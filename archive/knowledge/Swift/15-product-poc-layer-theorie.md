# 15. Product POC Layer

> **Prérequis :** sections 00 (fondations Swift), 09 (concurrency), 13 (architecture).
> **Objectif :** transformer une idée produit en app testable avec données réelles ou simulées.

---

## 15.1 Modèle mental central

**Un POC SwiftUI = UI states + data layer minimal + injection propre.**

La couche data d'un POC doit être **indépendante de l'UI** et **switchable** entre mock et réel sans modifier les Views. SwiftUI injecte le service, pas l'URL.

> *Analogie : le POC est une scène de théâtre. Les décors (UI) sont réels. Les acteurs peuvent jouer avec de faux accessoires (mock) ou de vrais (live data) — la scène ne change pas.*

---

## 15.2 Data layer minimal — `APIClient`

### 15.2.1 Le principe de séparation

```
View → Model (@Observable) → Service (protocol) → Implementation (Mock ou Live)
```

La View ne sait jamais si elle parle à une vraie API ou à un mock. Elle parle au **protocol**.

### 15.2.2 Définir un protocol de service

```swift
// Le contrat — indépendant de l'implémentation
protocol ProductService {
    func fetchProducts() async throws -> [Product]
    func fetchProduct(id: UUID) async throws -> Product
}
```

### 15.2.3 `LiveService` — données réelles

```swift
struct LiveProductService: ProductService {
    private let baseURL = "https://api.myapp.com"

    func fetchProducts() async throws -> [Product] {
        let url = URL(string: "\(baseURL)/products")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode([Product].self, from: data)
    }

    func fetchProduct(id: UUID) async throws -> Product {
        let url = URL(string: "\(baseURL)/products/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(Product.self, from: data)
    }
}
```

### 15.2.4 `MockService` — données simulées

```swift
struct MockProductService: ProductService {
    func fetchProducts() async throws -> [Product] {
        try await Task.sleep(for: .milliseconds(800))  // ← simuler la latence réseau
        return Product.mockData
    }

    func fetchProduct(id: UUID) async throws -> Product {
        try await Task.sleep(for: .milliseconds(400))
        guard let product = Product.mockData.first(where: { $0.id == id }) else {
            throw URLError(.fileDoesNotExist)
        }
        return product
    }
}

// Données de mock dans le modèle
extension Product {
    static let mockData: [Product] = [
        Product(id: UUID(), name: "Clavier mécanique", price: 129.99, category: "Tech"),
        Product(id: UUID(), name: "Souris sans fil", price: 59.99, category: "Tech"),
        Product(id: UUID(), name: "Carnet Moleskine", price: 14.99, category: "Papeterie")
    ]
}
```

### 15.2.5 Switch mock / live — injection via environnement

```swift
// Dans AppRoot — switch par flag de compilation ou feature flag
struct AppRoot: View {
    private let service: any ProductService = {
        #if DEBUG
        return MockProductService()
        #else
        return LiveProductService()
        #endif
    }()

    var body: some View {
        ContentView()
            .environment(ProductModel(service: service))
    }
}
```

---

## 15.3 Modélisation orientée UX — DTO vs Model UI

### 15.3.1 Le problème

Les APIs retournent des données brutes (DTO — Data Transfer Object) qui ne correspondent pas toujours à ce que l'UI a besoin d'afficher :

```swift
// DTO — ce que l'API retourne
struct ProductDTO: Codable {
    let id: String           // ← String dans l'API
    let name: String
    let price_cents: Int     // ← en centimes
    let created_at: String   // ← date en string ISO
    let is_available: Bool
}

// Model UI — ce dont SwiftUI a besoin
struct Product: Identifiable {
    let id: UUID             // ← converti
    let name: String
    let price: Double        // ← converti en euros
    let createdDate: Date    // ← converti en Date
    let isAvailable: Bool
}
```

### 15.3.2 Transformation DTO → Model UI

```swift
extension Product {
    init(from dto: ProductDTO) {
        self.id = UUID(uuidString: dto.id) ?? UUID()
        self.name = dto.name
        self.price = Double(dto.price_cents) / 100.0
        self.isAvailable = dto.is_available
        let formatter = ISO8601DateFormatter()
        self.createdDate = formatter.date(from: dto.created_at) ?? Date()
    }
}
```

### 15.3.3 ViewModel léger — enrichissement pour l'affichage

Pour les calculs d'affichage, une computed property sur le model suffit :

```swift
extension Product {
    var formattedPrice: String {
        price.formatted(.currency(code: "EUR"))
    }

    var availabilityLabel: String {
        isAvailable ? "Disponible" : "Rupture de stock"
    }

    var availabilityColor: Color {
        isAvailable ? .green : .red
    }
}
```

*Pas besoin d'une couche "ViewModel" séparée pour un POC — les computed properties sur le model suffisent.*

---

## 15.4 Mocking & prototypage rapide

### 15.4.1 JSON local (bundle)

Pour les données complexes, charger un JSON depuis le bundle de l'app :

```swift
func loadMockJSON<T: Codable>(filename: String, as type: T.Type) throws -> T {
    guard let url = Bundle.main.url(forResource: filename, withExtension: "json"),
          let data = try? Data(contentsOf: url) else {
        throw URLError(.fileDoesNotExist)
    }
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return try decoder.decode(T.self, from: data)
}

// Usage
let products = try loadMockJSON(filename: "mock_products", as: [Product].self)
```

### 15.4.2 Simulation de latence

Simuler différentes conditions réseau pour tester l'UI :

```swift
enum NetworkCondition {
    case instant
    case fast     // 200ms
    case normal   // 800ms
    case slow     // 2000ms
    case timeout
}

extension MockProductService {
    func delay(for condition: NetworkCondition) async throws {
        switch condition {
        case .instant: break
        case .fast: try await Task.sleep(for: .milliseconds(200))
        case .normal: try await Task.sleep(for: .milliseconds(800))
        case .slow: try await Task.sleep(for: .seconds(2))
        case .timeout: throw URLError(.timedOut)
        }
    }
}
```

### 15.4.3 Feature flags simples

```swift
// Feature flags pour tester variantes UI
struct FeatureFlags {
    static var showNewCheckout = false
    static var enableDarkModeForce = false
    static var mockNetworkError = false
}

// Usage dans un service mock
func fetchProducts() async throws -> [Product] {
    if FeatureFlags.mockNetworkError {
        throw URLError(.notConnectedToInternet)
    }
    return Product.mockData
}
```

---

## 15.5 User flows comme états

### 15.5.1 Un flow = suite d'états

En SwiftUI, un parcours utilisateur se modélise comme une succession d'états — pas une séquence impérative :

```swift
// Onboarding flow — états successifs
enum OnboardingStep {
    case welcome
    case permissionsRequest
    case profileSetup
    case complete
}

@Observable
class OnboardingModel {
    var step: OnboardingStep = .welcome

    func advance() {
        switch step {
        case .welcome: step = .permissionsRequest
        case .permissionsRequest: step = .profileSetup
        case .profileSetup: step = .complete
        case .complete: break
        }
    }
}
```

```swift
// View qui projette l'état du flow
struct OnboardingView: View {
    @State private var model = OnboardingModel()

    var body: some View {
        switch model.step {
        case .welcome:
            WelcomeScreen(onContinue: model.advance)
        case .permissionsRequest:
            PermissionsScreen(onContinue: model.advance)
        case .profileSetup:
            ProfileSetupScreen(onComplete: model.advance)
        case .complete:
            MainAppView()
        }
    }
}
```

> *Voir section 06 (Navigation) pour les flows avec pile de navigation.*

### 15.5.2 Login → Feed → Detail — flow complet

```swift
enum AppFlow: Hashable {
    case login
    case feed
    case productDetail(Product)
    case checkout(items: [Product])
}
```

---

## 15.6 UX States critiques — les 5 états d'une feature

**Chaque feature doit gérer 5 états pour être crédible en conditions réelles :**

```swift
enum FeatureState<T> {
    case idle                    // état initial — rien n'a encore été demandé
    case loading                 // en cours de chargement
    case empty                   // chargé, mais pas de données
    case success(T)              // données disponibles
    case failure(String)         // erreur avec message
}
```

```swift
@Observable
class ProductListModel {
    var state: FeatureState<[Product]> = .idle

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
```

```swift
// View couvrant tous les états
struct ProductListView: View {
    @State private var model = ProductListModel()

    var body: some View {
        Group {
            switch model.state {
            case .idle:
                Color.clear.onAppear { Task { await model.load() } }
            case .loading:
                ProgressView("Chargement...")
            case .empty:
                EmptyStateView(
                    icon: "tray",
                    message: "Aucun produit disponible",
                    action: ("Réessayer", { Task { await model.load() } })
                )
            case .success(let products):
                ProductGrid(products: products)
            case .failure(let message):
                ErrorView(message: message) {
                    Task { await model.load() }
                }
            }
        }
    }
}
```

> *Ce pattern est l'application directe des sections 01 (UI = état) et 07 (lifecycle).*

---

## 15.7 Intégration SwiftUI — injection du service

### 15.7.1 Injection via environnement

```swift
@Observable
@MainActor
class ProductModel {
    private let service: any ProductService
    var state: FeatureState<[Product]> = .idle

    init(service: any ProductService) {
        self.service = service
    }

    func loadProducts() async {
        state = .loading
        do {
            let products = try await service.fetchProducts()
            state = products.isEmpty ? .empty : .success(products)
        } catch {
            state = .failure(error.localizedDescription)
        }
    }
}

// Injection à la racine
struct AppRoot: View {
    @State private var model = ProductModel(service: MockProductService())

    var body: some View {
        ProductListView()
            .environment(model)
    }
}

// Lecture dans les sous-vues
struct ProductListView: View {
    @Environment(ProductModel.self) private var model
    // ...
}
```

### 15.7.2 Refresh manuel et automatique

```swift
// Refresh manuel — bouton
Button("Rafraîchir") {
    Task { await model.loadProducts() }
}

// Refresh automatique au pull-to-refresh
List { ... }
    .refreshable {
        await model.loadProducts()
    }

// Refresh sur changement de filtre
.task(id: selectedCategory) {
    await model.loadProducts(category: selectedCategory)
}
```

---

## 15.8 Scope de POC — les règles de discipline

| Règle | Application |
|-------|-------------|
| **1–2 flows maximum** | Résiste à la tentation d'ajouter des features |
| **1 hypothesis par POC** | "Est-ce que les users comprennent ce flow ?" |
| **Pas d'architecture globale** | Pas de router central, pas de store global |
| **Mock d'abord, live ensuite** | Valide l'UI avant de connecter le backend |
| **Vitesse > perfectionnisme** | Un POC buggy mais testable > un POC parfait jamais livré |
