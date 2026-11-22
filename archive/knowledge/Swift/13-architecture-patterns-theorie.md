# 13. Architecture & Patterns

## 13.1 Modèle mental central

**L'architecture en SwiftUI 6 organise le data flow — pas l'UI. Les Views décrivent, les modèles décident.**

SwiftUI impose naturellement une séparation : les Views sont des descriptions pures de l'UI (section 1), les `@Observable` sont les modèles qui contiennent la logique et les données. L'architecture sert à organiser ces modèles selon la complexité de l'app.

> *Analogie : une View est comme le front d'un journal (mise en page). Un modèle est la rédaction (les décisions, le contenu). Tu ne mets pas la rédaction dans la mise en page.*

---

## 13.2 Séparation feature / state / UI

### 13.2.1 Trois niveaux

En iOS 26, une organisation saine sépare :

1. **UI (Views)** — description visuelle, aucune logique métier
2. **State / Model** — données, logique, effets secondaires
3. **Services** — réseau, persistance, APIs externes

```
App
├── Features/
│   ├── Auth/
│   │   ├── AuthView.swift          ← UI
│   │   ├── AuthModel.swift         ← @Observable
│   │   └── AuthService.swift       ← réseau, Keychain
│   └── Profile/
│       ├── ProfileView.swift
│       ├── ProfileModel.swift
│       └── ProfileService.swift
└── Shared/
    ├── Components/                  ← Views réutilisables
    └── Models/                      ← types de données communs
```

### 13.2.2 Règle de dépendance

```
View → dépend de → @Observable Model
@Observable Model → dépend de → Service
Service → dépend de → API / Persistence

Vue ne dépend JAMAIS de Service directement
```

---

## 13.3 Architecture orientée data flow (iOS 26)

### 13.3.1 Le pattern recommandé

En iOS 26 avec `@Observable`, l'architecture standard est :

```swift
// Modèle — contient état + logique
@Observable
@MainActor
class AuthModel {
    var isAuthenticated = false
    var currentUser: User?
    var isLoading = false
    private(set) var errorMessage: String?

    func signIn(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        do {
            currentUser = try await AuthService.signIn(email: email, password: password)
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

// View — description pure, délègue au modèle
struct SignInView: View {
    @State private var email = ""
    @State private var password = ""
    var model: AuthModel

    var body: some View {
        VStack {
            TextField("Email", text: $email)
            SecureField("Mot de passe", text: $password)
            Button("Connexion") {
                Task { await model.signIn(email: email, password: password) }
            }
            .disabled(model.isLoading)
        }
    }
}
```

**Ce que la View fait :**
- Afficher l'UI
- Capturer les inputs locaux (`email`, `password` en `@State`)
- Déclencher des actions sur le modèle

**Ce que le modèle fait :**
- Contenir les données métier
- Exécuter la logique
- Déclencher les appels réseau
- Gérer les erreurs

---

## 13.4 Composition vs centralisation

### 13.4.1 Ne pas créer un "store global"

Un store central unique est un anti-pattern en SwiftUI. Plusieurs petits modèles focalisés sont préférables :

```swift
// ❌ Anti-pattern — store global
@Observable
class AppStore {
    var auth: AuthState
    var profile: ProfileState
    var settings: SettingsState
    var cart: CartState
    // ... toute l'app dans un seul objet
}

// ✅ Recommandé — modèles focalisés
@Observable class AuthModel { ... }
@Observable class ProfileModel { ... }
@Observable class CartModel { ... }
```

### 13.4.2 Composition par injection

Les modèles sont injectés là où ils sont nécessaires :

```swift
struct AppRoot: View {
    @State private var auth = AuthModel()
    @State private var cart = CartModel()

    var body: some View {
        NavigationStack {
            HomeView(cart: cart)
                .environment(auth)  // auth disponible dans tout l'arbre
        }
    }
}
```

---

## 13.5 Réduction du couplage UI / logique métier

### 13.5.1 Actions comme closures

Pour réduire le couplage, les Views reçoivent des actions comme closures :

```swift
struct DeleteButton: View {
    let onDelete: () -> Void  // ← closure, pas une référence au modèle

    var body: some View {
        Button("Supprimer", role: .destructive) {
            onDelete()
        }
    }
}
```

### 13.5.2 Views testables sans modèles complexes

En injectant les données et actions via paramètres, les Views sont utilisables en preview sans avoir besoin du modèle complet :

```swift
#Preview {
    DeleteButton(onDelete: { print("Supprimé") })
}
```

---

## 13.6 Modularisation avec Swift Packages

Pour les grandes apps, chaque domaine fonctionnel devient un Swift Package :

```
MyApp/
├── MyApp/                    ← App target
└── Packages/
    ├── AuthFeature/          ← Package Swift
    ├── ProfileFeature/
    └── SharedUI/
```

Avantages :
- Compilation incrémentale (rapide)
- Isolation des dépendances
- Réutilisation entre apps

---

## 13.7 Observation-driven architecture (iOS 26)

Le pattern central d'iOS 26 est simple :

1. **`@Observable`** pour les modèles
2. **`@State`** pour l'ownership dans les Views
3. **`@Environment`** pour les modèles partagés dans l'arbre
4. **`@Bindable`** pour les formulaires dans les Views

```swift
// Injection globale d'un modèle partagé
struct AppRoot: View {
    @State private var userSession = UserSession()

    var body: some View {
        ContentView()
            .environment(userSession)
    }
}

// Lecture n'importe où dans l'arbre
struct ProfileBadge: View {
    @Environment(UserSession.self) private var session

    var body: some View {
        Text("Bonjour \(session.name)")
    }
}
```

---

## 13.8 Comparaison avec les patterns JS

| Pattern JS | SwiftUI equivalent |
|-----------|-------------------|
| Module pattern (closure) | Swift Package / internal types |
| Store centralisé (Redux-like) | Anti-pattern — modèles focalisés à la place |
| Service layer | Classes Swift avec `async` methods |
| Component avec local state | `@State` dans View |
| Shared state | `@Observable` + `@Environment` |
| Props down / events up | Paramètres View + closures |

---

## 13.9 Récapitulatif des patterns iOS 26

| Besoin | Solution |
|--------|----------|
| Logique de business | `@Observable` class `@MainActor` |
| Ownership du modèle | `@State private var model = Model()` |
| Partage dans l'arbre | `.environment(model)` + `@Environment(Model.self)` |
| Formulaire avec binding | `@Bindable var model: Model` |
| Actions réutilisables | Closures en paramètres de View |
| Réseau / persistence | Service layer séparé |
| Navigation | `@Observable` router (section 6) |
