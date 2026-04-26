# 15. Product POC Layer — Exercices

---

## Exercice 15.1 — Traduction mentale : service abstrait

### Énoncé

En JS, tu switches souvent entre dev et prod avec une variable d'environnement :

```js
// JS — switch mock / live
const API_BASE = process.env.NODE_ENV === 'development'
    ? null  // mode mock
    : 'https://api.myapp.com'

async function fetchProducts() {
    if (!API_BASE) {
        // mock local
        return [
            { id: 1, name: 'Produit A', price: 29.99 },
            { id: 2, name: 'Produit B', price: 49.99 }
        ]
    }
    const response = await fetch(`${API_BASE}/products`)
    return response.json()
}
```

**Questions :**

→ En Swift, comment "switcher" entre mock et live sans `if/else` dans chaque vue ?
→ Qu'est-ce qu'un `protocol` Swift et comment l'utiliser pour ce pattern ?
→ Qui "sait" quelle implémentation utiliser — la View ou l'AppRoot ?

*Tente de répondre avant de lire la correction.*

---

### Correction 15.1

**Modèle mental :**

En JS, le switch est dans la fonction elle-même. En Swift, la View ne sait pas quelle implémentation elle reçoit — c'est l'AppRoot qui décide, via injection.

```swift
// 1. Le contrat (protocol)
protocol ProductService {
    func fetchProducts() async throws -> [Product]
}

// 2. Implémentation mock
struct MockProductService: ProductService {
    func fetchProducts() async throws -> [Product] {
        try await Task.sleep(for: .milliseconds(500))
        return [
            Product(id: UUID(), name: "Produit A", price: 29.99),
            Product(id: UUID(), name: "Produit B", price: 49.99)
        ]
    }
}

// 3. Implémentation live
struct LiveProductService: ProductService {
    func fetchProducts() async throws -> [Product] {
        let url = URL(string: "https://api.myapp.com/products")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Product].self, from: data)
    }
}

// 4. AppRoot choisit
struct AppRoot: View {
    @State private var model = ProductModel(
        service: ProcessInfo.processInfo.environment["USE_MOCK"] != nil
            ? MockProductService()
            : LiveProductService()
    )
    // ou simplement :
    // service: MockProductService()  ← pendant le développement du POC

    var body: some View {
        ProductListView().environment(model)
    }
}
```

**La View ne change jamais :**
```swift
struct ProductListView: View {
    @Environment(ProductModel.self) private var model
    // indifférente à Mock vs Live
}
```

---

## Exercice 15.2 — Piège de paradigme : DTO vs UI Model

### Énoncé

Un développeur reçoit ce JSON :

```json
{ "product_id": "abc-123", "price_in_cents": 2999, "stock_count": 0 }
```

Et il écrit directement :

```swift
struct Product: Codable, Identifiable {
    let id: String          // ← String, pas UUID
    let priceInCents: Int   // ← en centimes
    let stockCount: Int

    // Pour ForEach, utilise id directement
}

struct ProductRow: View {
    let product: Product

    var body: some View {
        HStack {
            Text(product.id)            // ← affiche "abc-123" dans l'UI
            Text("\(product.priceInCents)") // ← affiche "2999" dans l'UI
            if product.stockCount == 0 {
                Text("Rupture")
            }
        }
    }
}
```

**Questions :**

→ Quels sont les 3 problèmes de cette approche directe ?
→ Comment séparer le DTO (pour le décodage JSON) du Model UI (pour SwiftUI) ?
→ Qu'est-ce qui va dans une computed property vs un init de transformation ?

---

### Correction 15.2

**3 problèmes :**

1. **Affichage de données brutes** : `product.id` = `"abc-123"` dans l'UI — pas l'identifiant interne qu'on affiche
2. **Calcul dans la View** : convertir centimes → euros et formater doit être fait avant d'arriver dans la View
3. **Couplage fort** : si l'API change le format de `product_id` ou de `price_in_cents`, toute l'UI casse

```swift
// DTO — uniquement pour le décodage JSON
struct ProductDTO: Codable {
    let productId: String
    let priceInCents: Int
    let stockCount: Int

    enum CodingKeys: String, CodingKey {
        case productId = "product_id"
        case priceInCents = "price_in_cents"
        case stockCount = "stock_count"
    }
}

// Model UI — orienté affichage
struct Product: Identifiable {
    let id: UUID
    let rawId: String   // ← conservé si nécessaire pour les appels API
    let price: Double
    let isInStock: Bool

    // Transformation DTO → Model UI dans un init
    init(from dto: ProductDTO) {
        self.id = UUID()          // ← UUID stable pour SwiftUI
        self.rawId = dto.productId
        self.price = Double(dto.priceInCents) / 100.0
        self.isInStock = dto.stockCount > 0
    }

    // Affichage dans des computed properties
    var formattedPrice: String {
        price.formatted(.currency(code: "EUR"))
    }

    var stockLabel: String {
        isInStock ? "Disponible" : "Rupture de stock"
    }

    var stockColor: Color {
        isInStock ? .green : .red
    }
}

// View propre — uniquement de l'affichage
struct ProductRow: View {
    let product: Product

    var body: some View {
        HStack {
            Text(product.formattedPrice)
            Spacer()
            Text(product.stockLabel)
                .foregroundStyle(product.stockColor)
        }
    }
}
```

**Règle :**
- DTO → décodage JSON, jamais affiché directement
- Transformation dans un `init(from:)` — une seule fois, dans le modèle
- Calculs d'affichage → computed properties sur le Model UI

---

## Exercice 15.3 — Mini cas réel : POC d'une app e-commerce

### Énoncé

Tu construis un POC pour valider le flow "découverte de produits" d'une app e-commerce :

1. **Liste de produits** (grid 2 colonnes, chargée depuis un mock)
2. **Détail produit** (nom, prix formaté, stock, bouton "Ajouter")
3. **Panier flottant** (compteur d'articles, toujours visible)

Contraintes POC :
- Mock data uniquement (pas de vrai backend)
- Les 5 UX states sur la liste (idle, loading, empty, success, error)
- Le panier est partagé entre la liste et le détail

**Avant de coder :**
→ Quels modèles crées-tu ? (`Product`, `Cart` ?)
→ Quel protocol de service ?
→ Où vit l'état du panier ?

*Décris d'abord, code ensuite.*

---

### Correction 15.3

**Architecture du POC :**

```swift
// MODÈLES
struct Product: Identifiable {
    let id = UUID()
    var name: String
    var price: Double
    var isInStock: Bool

    var formattedPrice: String { price.formatted(.currency(code: "EUR")) }

    static let mockData = [
        Product(name: "Clavier mécanique", price: 129.99, isInStock: true),
        Product(name: "Souris sans fil", price: 59.99, isInStock: true),
        Product(name: "Écran 4K", price: 399.99, isInStock: false),
        Product(name: "Webcam HD", price: 79.99, isInStock: true)
    ]
}

// SERVICE
protocol ProductService {
    func fetchProducts() async throws -> [Product]
}

struct MockProductService: ProductService {
    func fetchProducts() async throws -> [Product] {
        try await Task.sleep(for: .seconds(1))
        return Product.mockData
    }
}

// PANIER — partagé via @Observable + @Environment
@Observable
class CartModel {
    var items: [Product] = []
    var count: Int { items.count }

    func add(_ product: Product) {
        items.append(product)
    }
}

// LISTE MODEL
enum FeatureState<T> {
    case idle, loading, empty
    case success(T), failure(String)
}

@Observable @MainActor
class ProductListModel {
    private let service: any ProductService
    var state: FeatureState<[Product]> = .idle

    init(service: any ProductService) { self.service = service }

    func load() async {
        state = .loading
        do {
            let products = try await service.fetchProducts()
            state = products.isEmpty ? .empty : .success(products)
        } catch {
            state = .failure(error.localizedDescription)
        }
    }
}

// APP ROOT
struct ShopPOC: View {
    @State private var listModel = ProductListModel(service: MockProductService())
    @State private var cart = CartModel()

    var body: some View {
        NavigationStack {
            ProductListView()
                .navigationTitle("Boutique")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        CartBadge()
                    }
                }
        }
        .environment(listModel)
        .environment(cart)
    }
}

// PANIER BADGE
struct CartBadge: View {
    @Environment(CartModel.self) private var cart

    var body: some View {
        Label("\(cart.count)", systemImage: "cart")
            .bold()
    }
}

// LISTE
struct ProductListView: View {
    @Environment(ProductListModel.self) private var model

    let columns = [GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        Group {
            switch model.state {
            case .idle:
                Color.clear.task { await model.load() }
            case .loading:
                ProgressView("Chargement...")
            case .empty:
                ContentUnavailableView("Aucun produit", systemImage: "tray")
            case .success(let products):
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(products) { product in
                            NavigationLink(value: product) {
                                ProductCard(product: product)
                            }
                        }
                    }
                    .padding()
                }
            case .failure(let message):
                VStack(spacing: 12) {
                    Text(message).foregroundStyle(.red)
                    Button("Réessayer") { Task { await model.load() } }
                }
            }
        }
        .navigationDestination(for: Product.self) { product in
            ProductDetailView(product: product)
        }
    }
}

// CARTE PRODUIT
struct ProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.1))
                .frame(height: 120)
            Text(product.name).font(.subheadline).bold()
            Text(product.formattedPrice).foregroundStyle(.secondary)
            if !product.isInStock {
                Text("Rupture").font(.caption).foregroundStyle(.red)
            }
        }
        .padding(12)
        .background(.background)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(radius: 2)
    }
}

// DÉTAIL
struct ProductDetailView: View {
    let product: Product
    @Environment(CartModel.self) private var cart
    @State private var added = false

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .frame(maxWidth: .infinity, minHeight: 250)

            Text(product.name).font(.title).bold()
            Text(product.formattedPrice).font(.title2).foregroundStyle(.secondary)

            Text(product.isInStock ? "En stock" : "Rupture de stock")
                .foregroundStyle(product.isInStock ? .green : .red)

            Spacer()

            Button(added ? "Ajouté ✓" : "Ajouter au panier") {
                cart.add(product)
                added = true
            }
            .buttonStyle(.borderedProminent)
            .disabled(!product.isInStock || added)
            .frame(maxWidth: .infinity)
        }
        .padding()
        .navigationTitle(product.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    ShopPOC()
}
```

**Ce que ce POC valide :**
- Le flow découverte → détail → ajout panier fonctionne
- Les 5 UX states sont couverts sur la liste
- Le compteur panier est visible et synchronisé
- Switch mock → live = une seule ligne à changer dans `AppRoot`
