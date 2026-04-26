# Synthèse globale — Swift 6 / SwiftUI 6 (iOS 26)

Référence condensée — sections 00 à 16 — pont pédagogique JS/Reef → SwiftUI

---

## 0. Fondations Swift — Prérequis

**Types, optionals, JSON, networking — les briques avant SwiftUI.**

| Concept | Règle | Exemple |
|---------|-------|---------|
| `struct` | Type valeur — copié à chaque assignation | Views SwiftUI |
| `class` | Type référence — partagé | Modèles `@Observable` |
| `let` | Immutable — défaut recommandé | Constantes, IDs |
| `var` | Mutable — seulement si nécessaire | État, compteurs |
| `String?` | Optional — valeur potentiellement absente | Données API |
| `if let` | Unwrap conditionnel sûr | Branches UI |
| `guard let` | Unwrap + early exit | Préconditions |
| `??` | Valeur par défaut si nil | `username ?? "Anonyme"` |
| `!` | Force unwrap — **éviter sur données async** | — |

**Codable :**

```swift
struct UserDTO: Codable {
    let userId: Int       // ← snake_case JSON auto-mappé
    let createdAt: Date
}

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
decoder.dateDecodingStrategy = .iso8601
```

**Networking minimal :**

```swift
func fetchItems() async throws -> [Item] {
    let url = URL(string: "https://api.example.com/items")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Item].self, from: data)
}
```

**Concurrency :**
- `async/await` = séquentiel non-bloquant
- `Task {}` = créer un contexte async depuis UI synchrone
- `@MainActor` = toutes les modifications UI sur le thread principal

---

## 1. Paradigme fondamental — UI = état

**SwiftUI décrit l'interface. Il ne la manipule pas.**

```
état → body (description) → rendu (automatique)
```

| Outil | Nature | Paradigme |
|-------|--------|-----------|
| JS vanilla | DOM direct | Impératif |
| Reef.js v13 | Template + signal | Semi-déclaratif |
| SwiftUI 6 | struct View | Déclaratif pur |

- **Pas de DOM.** Pas d'objet UI à modifier.
- `body` est appelé à chaque changement d'état — il doit rester pur.
- En une phrase : *tu changes l'état, SwiftUI recalcule l'affichage.*

---

## 2. Système d'état

| Wrapper | Usage | Portée |
|---------|-------|--------|
| `@State` | État local, type valeur | View locale |
| `@Binding` | Liaison bidirectionnelle | Parent → enfant |
| `@Observable` | Modèle de données partagé | iOS 17+ / iOS 26 |
| `@StateObject` | Modèle (ownership) — ancien | iOS 14 |
| `@ObservedObject` | Modèle (référence) — ancien | iOS 13 |
| `@Environment` | Contexte injecté | Tout l'arbre |
| `@AppStorage` | Persistance UserDefaults | App-wide |

**Règles clés :**
- `@State` toujours `private`
- `$` = produit un `Binding<T>` depuis `@State` ou `@Bindable`
- `@Observable` + `@State` = pattern recommandé iOS 26
- `@Bindable` pour écrire dans un `@Observable` via `$`

**Analogie Reef :**

| Reef v13 | SwiftUI 6 |
|----------|-----------|
| `signal(0)` | `@State var count = 0` |
| `count.value++` | `count += 1` |
| `save('key', value)` | `@AppStorage("key")` |
| Pas de mécanisme Reef | `@Binding` pour enfant |

---

## 3. Composition des Views

- `struct View` = **valeur**, jetable, recréée à chaque recomposition
- `some View` = type de retour opaque — une seule racine dans `body`
- Composition = imbrication de descriptions (pas d'héritage)
- Extraction de sous-vues = refactoring organisationnel, aucun impact comportemental
- `@State` **survit** aux recompositions — les `var` simples non

```swift
struct MyView: View {
    @State private var count = 0  // ← stable entre recompositions
    var body: some View {
        SubView(count: count)     // ← composition
    }
}
```

---

## 4. Layout System

**Négociation parent/enfant — jamais de positionnement absolu.**

| CSS | SwiftUI |
|-----|---------|
| `flex-direction: column` | `VStack` |
| `flex-direction: row` | `HStack` |
| Superposition | `ZStack` |
| `flex: 1` | `Spacer()` |
| `max-width: 100%` | `.frame(maxWidth: .infinity)` |
| `padding: 16px` | `.padding(16)` |
| `gap: 8px` | `spacing: 8` dans VStack/HStack |

- Jamais de coordonnées codées en dur
- `.frame(maxWidth: .infinity)` = prend toute la largeur disponible
- `ZStack` pour centrer un titre avec boutons aux bords

---

## 5. Data Flow

**Les données descendent. Remonter nécessite `@Binding` ou `@Observable` partagé.**

```
Parent (@State) → Enfant (paramètre)
                  Enfant → Parent (@Binding avec $)
```

- Source de vérité unique — ne jamais dupliquer l'état
- Valeurs dérivées = computed properties, jamais `@State` séparé
- `@Environment` pour les valeurs système (colorScheme, locale, dismiss...)
- Injection d'un `@Observable` via `.environment(model)` + `@Environment(Model.self)`

---

## 6. Navigation

**Navigation = état. Naviguer = ajouter à la pile. Revenir = retirer.**

```swift
@State private var path: [AppRoute] = []

// Naviguer
path.append(.detail(id: someId))

// Revenir
path.removeLast()

// Retour accueil
path = []
```

- Routes = enum Swift typé (pas de strings)
- `.sheet(isPresented: $bool)` pour les modales
- `@Environment(\.dismiss)` pour fermer une modale de l'intérieur
- Deep linking = initialiser `path` avec les valeurs cibles

---

## 7. Side Effects & Lifecycle

**`body` est pur. Les effets vivent dans les modificateurs.**

| Modificateur | Quand | Nature |
|--------------|-------|--------|
| `.task {}` | Apparition + annulation auto | Async |
| `.task(id:) {}` | Apparition + changement de `id` | Async, redéclenché |
| `.onAppear {}` | Apparition | Sync |
| `.onDisappear {}` | Disparition | Sync |

- `.task {}` : annulation automatique à la disparition de la View
- Ne jamais mettre de side effect (fetch, log) directement dans `body`
- `defer { isLoading = false }` = équivalent Swift de `finally`

---

## 8. Lists & Performance

**Identifiants stables = performances optimales.**

```swift
struct Item: Identifiable {
    let id = UUID()  // ← stable, unique
    var name: String
}

List {
    ForEach(items) { item in ItemRow(item: item) }
        .onDelete { items.remove(atOffsets: $0) }
        .onMove { items.move(fromOffsets: $0, toOffset: $1) }
}
```

- `List` = scrollable + natif + virtualisé
- `ForEach` = dans un conteneur existant
- `LazyVStack` dans `ScrollView` pour grandes collections custom
- Jamais `indices` comme identifiant dans une liste éditable
- `id: \.self` risqué si doublons possibles

---

## 9. Concurrency

**`async/await` = code séquentiel non-bloquant. `@MainActor` = UI thread.**

| Concept | Code |
|---------|------|
| Fonction async | `func f() async throws -> T` |
| Attendre | `try await f()` |
| Parallèle | `async let a = f1(); async let b = f2(); await (a, b)` |
| Dans SwiftUI | `.task { data = try? await fetch() }` |
| Modèle UI-safe | `@Observable @MainActor class Model` |

- `.task {}` = sur `@MainActor` par défaut
- `async let` pour les fetches parallèles indépendants
- Annulation automatique avec structured concurrency

**Analogie JS :**

| JS | Swift |
|----|-------|
| `async/await` | `async/await` |
| `Promise.all([...])` | `async let` + `await (a, b, c)` |
| `AbortController` | Automatique `.task {}` |
| Monothread | `@MainActor` pour isoler le thread UI |

---

## 10. Persistence & Storage

**`@AppStorage` = `@State` qui survit aux relances de l'app.**

```swift
@AppStorage("isDarkMode") private var isDark = false
@AppStorage("fontSize") private var fontSize: Double = 16
```

- Valeur par défaut = utilisée si rien n'est encore stocké
- Déclenche la recomposition comme `@State`
- Supporte `$binding` natif
- Types enum → stocker `rawValue: String`, reconstruire en computed property

**Séparation état UI vs persistant :**

| Persisté (`@AppStorage`) | Éphémère (`@State`) |
|--------------------------|---------------------|
| Préférences utilisateur | Champ de recherche |
| Compteurs cumulatifs | Position de scroll |
| Thème, taille de police | État d'expansion |

---

## 11. Interop UIKit / AppKit

**`UIViewRepresentable` = adaptateur SwiftUI → UIKit.**

```swift
struct MyUIKitView: UIViewRepresentable {
    func makeUIView(context: Context) -> UIKitViewType {
        // Créer et configurer la UIView — UNE SEULE FOIS
    }
    func updateUIView(_ uiView: UIKitViewType, context: Context) {
        // Synchroniser UIKit avec l'état SwiftUI — À CHAQUE RECOMPOSITION
    }
    func makeCoordinator() -> Coordinator {
        // Créer le delegate/coordinator
    }
}
```

- Coordinator = delegate UIKit → modifications `@Binding`
- `if uiView.property != value { uiView.property = value }` dans `updateUIView` pour éviter les boucles
- `UIViewControllerRepresentable` pour les `UIViewController`

---

## 12. Animations & Interactions

**Animation = conséquence d'un changement d'état. Jamais de propriétés CSS.**

```swift
withAnimation(.spring()) {
    isExpanded.toggle()  // ← change l'état, SwiftUI anime
}
```

| Concept | Code |
|---------|------|
| Animation explicite | `withAnimation(.easeInOut) { state = newValue }` |
| Animation implicite | `.animation(.spring(), value: someState)` |
| Transition | `.transition(.opacity)` / `.transition(.slide)` |
| Tap | `.onTapGesture {}` |
| Drag | `DragGesture().onChanged { }.onEnded { }` |

**Courbes utiles :**
- `.spring()` → rebond naturel
- `.easeInOut(duration: 0.3)` → accélération/décélération
- `.bouncy` → rebond prononcé (iOS 17+)

---

## 13. Architecture & Patterns

**Views décrivent. Modèles décident. Services exécutent.**

```
View → @Observable Model → Service (réseau/persistence)
```

**Pattern iOS 26 recommandé :**

```swift
@Observable @MainActor class FeatureModel {
    var data: [Item] = []
    var isLoading = false
    func load() async { ... }  // logique ici
}

struct FeatureView: View {
    @State private var model = FeatureModel()  // ownership
    var body: some View {
        // description pure — .task { await model.load() }
    }
}
```

- Pas de store global — modèles focalisés par domaine
- Closures en paramètres pour découpler les Views des modèles
- `@Environment` pour partager les modèles dans l'arbre
- Dérivés = computed properties (pas d'état dupliqué)

---

## 14. Debug & Mental Tooling

**Checklist quand quelque chose ne marche pas :**

1. L'état est-il dans le bon wrapper ? (`@State` / `@Binding` / `@Observable`)
2. `@State` est-il `private` ? `$` est-il utilisé pour les bindings ?
3. Y a-t-il des side effects dans `body` ?
4. Les IDs de la liste sont-ils stables ? (`Identifiable` avec `UUID`)
5. Le modèle est-il `@MainActor` pour les mises à jour async ?
6. Y a-t-il une boucle de state ?

**Outils de debug :**

```swift
let _ = print("body appelé")         // combien de fois ?
let _ = Self._printChanges()          // quelle propriété ?
#Preview("État X") { View(state: x) } // tester chaque état
```

---

## 15. Product POC Layer — Couche données

**Un POC SwiftUI = UI states + data layer minimal + injection propre.**

```
View → @Observable Model → Service (protocol) → Mock ou Live
```

**FeatureState — les 5 états obligatoires :**

```swift
enum FeatureState<T> {
    case idle, loading, empty
    case success(T), failure(String)
}
```

**Pattern service switchable :**

```swift
protocol ProductService {
    func fetchProducts() async throws -> [Product]
}

struct MockProductService: ProductService { /* données statiques */ }
struct LiveProductService: ProductService { /* URLSession */ }

// AppRoot choisit — la View ne sait pas
@State private var model = ProductModel(service: MockProductService())
```

**DTO vs Model UI :**

| DTO (`Codable`) | Model UI (`Identifiable`) |
|-----------------|--------------------------|
| Mappe le JSON brut | Orienté affichage |
| `price_in_cents: Int` | `formattedPrice: String` |
| `product_id: String` | `id: UUID` |
| Jamais affiché directement | Computed properties pour l'UI |

**Règles POC :**
- 1–2 flows maximum — résiste à la feature creep
- Mock d'abord, live ensuite — valide l'UI avant le backend
- Switch mock → live = **une seule ligne** dans AppRoot

---

## 16. Product Thinking Execution — Méthodologie POC

**Un POC n'est pas un prototype. C'est une question formulée en interface.**

**Hypothèse testable :**

```
❌ "Je veux voir si l'app est utilisable"
✅ "Les utilisateurs complètent le flow en 3 étapes en < 90 secondes sans aide"
```

**Build vs Fake — règle centrale :**

> *Fake everything that doesn't validate your UX hypothesis.*

| Build | Fake |
|-------|------|
| Core UX flow (c'est l'hypothèse) | Données affichées (mock JSON suffit) |
| Interactions clés | Authentification (hors scope si flow post-login) |
| États d'erreur (partiels) | Backend réel, edge cases, logique métier complexe |

**PlaceholderScreen — hors scope propre :**

```swift
.navigationDestination(for: AppRoute.self) { route in
    switch route {
    case .checkout(let items): CheckoutView(items: items)   // ← implémenté
    case .orderHistory: PlaceholderScreen(title: "Historique")  // ← hors scope
    }
}
```

**Cycle en 7 étapes :**

```
1. Hypothèse → 2. Flow papier → 3. Mock data → 4. Skeleton SwiftUI
→ 5. Injection data → 6. Test 30 min / 2-3 users → 7. Itération
```

**Post-POC :**
- Validé → construire la vraie feature
- Invalidé → pivoter (ce n'est pas un échec — c'est l'objectif)
- Ambigu → POC plus ciblé

---

## Gradient de déclarativité — vue d'ensemble

```
JS vanilla ──────────── Reef.js v13 ──────────── SwiftUI 6
(impératif pur)       (semi-déclaratif)        (déclaratif pur)
DOM direct            DOM diffing              Pas de DOM
Mutation manuelle     signal() + save()        @State + auto
Event listeners       Event delegation         Modificateurs
```

**Ce que Reef apprend que JS vanilla n'apprend pas :**
- Penser en état (signal) plutôt qu'en manipulation directe
- Séparer la donnée (`signal()`) de l'affichage (template)

**Ce que SwiftUI fait que Reef ne fait pas encore :**
- Réactivité automatique sans `.value` explicite
- Pas de DOM — pas de string HTML
- Annulation automatique des tâches async
- Layout system adaptatif natif
- Animations liées à l'état sans bibliothèque externe
