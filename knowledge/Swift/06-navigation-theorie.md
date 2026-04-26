# 6. Navigation

## 6.1 Modèle mental central

**La navigation est de l'état. Tu ne "pousse" pas de vues — tu modifies le chemin de navigation.**

En SwiftUI, naviguer vers un autre écran consiste à ajouter une valeur à un état de navigation (`NavigationPath`). SwiftUI affiche la vue correspondante automatiquement. Revenir en arrière, c'est retirer cette valeur. La navigation est une projection de l'état, comme tout le reste.

> *Analogie : le NavigationPath est une pile de cartes. Ajouter une carte = naviguer vers l'écran correspondant. Retirer la carte du dessus = revenir en arrière.*

---

## 6.2 `NavigationStack` — le conteneur de navigation

### 6.2.1 Structure de base

`NavigationStack` est le conteneur qui gère l'historique de navigation :

```swift
struct AppRoot: View {
    var body: some View {
        NavigationStack {
            ContentView()
                .navigationTitle("Accueil")
        }
    }
}
```

### 6.2.2 Navigation par lien — `NavigationLink`

```swift
struct ContentView: View {
    var body: some View {
        List {
            NavigationLink("Profil", destination: ProfileView())
            NavigationLink("Paramètres", destination: SettingsView())
        }
        .navigationTitle("Menu")
    }
}
```

`NavigationLink` crée un lien vers une destination. L'utilisateur tape, SwiftUI pousse la vue.

---

## 6.3 `NavigationPath` — navigation state-driven

### 6.3.1 Définition

`NavigationPath` est une **pile de valeurs typées** qui représente l'état de navigation. SwiftUI affiche les vues correspondantes à ces valeurs.

```swift
struct AppRoot: View {
    @State private var path = NavigationPath()  // ← état de navigation

    var body: some View {
        NavigationStack(path: $path) {
            HomeView(path: $path)
        }
        .navigationDestination(for: String.self) { screen in
            ScreenRouter(screen: screen, path: $path)
        }
    }
}
```

### 6.3.2 Naviguer programmatiquement

```swift
// Naviguer vers un écran
path.append("detail")    // ← ajoute à la pile

// Revenir en arrière
path.removeLast()        // ← retire le dernier

// Revenir à la racine
path.removeLast(path.count)   // ou path = NavigationPath()
```

---

## 6.4 Routes comme données

### 6.4.1 Enum de routes

La façon recommandée en iOS 26 : définir les routes comme un enum, passer des valeurs typées dans `NavigationPath`.

```swift
// Définir les routes comme type
enum AppRoute: Hashable {
    case detail(itemId: UUID)
    case settings
    case userProfile(userId: String)
}

struct AppRoot: View {
    @State private var path: [AppRoute] = []

    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .detail(let id):
                        DetailView(itemId: id)
                    case .settings:
                        SettingsView()
                    case .userProfile(let userId):
                        UserProfileView(userId: userId)
                    }
                }
        }
    }
}

// Dans HomeView, naviguer :
struct HomeView: View {
    @Environment(\.navigationPath) // ou passer path en paramètre
    // ...
    // Pour naviguer :
    // path.append(AppRoute.settings)
    // path.append(AppRoute.detail(itemId: someId))
}
```

---

## 6.5 Navigation vs navigation DOM

| Web (JS) | SwiftUI |
|----------|---------|
| `window.location.href = '/detail'` | `path.append(.detail(id: id))` |
| `history.back()` | `path.removeLast()` |
| `history.pushState(...)` | `path.append(...)` |
| Route définie par URL string | Route définie par valeur typée (enum) |
| Navigation côté client/serveur | Navigation entièrement locale |

**Différence fondamentale :** en SwiftUI, les routes sont des **types Swift**, pas des strings. Le compilateur vérifie la validité des routes.

---

## 6.6 Deep linking via état

Puisque la navigation est de l'état, tu peux aller directement à n'importe quelle profondeur de navigation en initialisant `NavigationPath` avec les valeurs appropriées :

```swift
// Deep link vers un détail spécifique au démarrage
struct AppRoot: View {
    @State private var path: [AppRoute] = [
        .userProfile(userId: "benoit"),
        .detail(itemId: someId)
    ]
    // L'app démarre directement sur la vue détail
    ...
}
```

---

## 6.7 Modales et sheets

En dehors de `NavigationStack`, les modales utilisent `.sheet()` et `.fullScreenCover()` — toujours via état :

```swift
struct ContentView: View {
    @State private var showSettings = false

    var body: some View {
        Button("Ouvrir settings") {
            showSettings = true
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}
```

**Fermer une modale depuis l'intérieur :**

```swift
struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Button("Fermer") {
            dismiss()  // ← action fournie par l'environnement
        }
    }
}
```

---

## 6.8 Restoration automatique du stack

`NavigationStack` avec `path` bindé peut être persisté (via `@AppStorage` ou Codable) pour restaurer l'état de navigation après relance de l'app. C'est possible précisément parce que la navigation est de l'état.

---

## 6.9 Séparation UI / logique de navigation

En iOS 26, la bonne pratique est de séparer :
- **La logique de navigation** (quel écran montrer, dans quel ordre) → dans un modèle ou un router
- **Les vues** (comment afficher un écran) → dans les Views

```swift
@Observable
class AppRouter {
    var path: [AppRoute] = []

    func goToDetail(id: UUID) {
        path.append(.detail(itemId: id))
    }

    func goBack() {
        path.removeLast()
    }

    func goHome() {
        path = []
    }
}
```

---

## 6.10 Récapitulatif

| Concept | Description |
|---------|-------------|
| `NavigationStack` | Conteneur de navigation avec gestion du stack |
| `NavigationLink` | Lien UI vers une destination |
| `NavigationPath` | État de navigation — pile de valeurs typées |
| Routes | Enum Swift typé — pas de strings |
| Deep link | Initialiser `path` avec les valeurs cibles |
| Modale | `.sheet()` / `.fullScreenCover()` via état `Bool` |
| Fermer modale | `@Environment(\.dismiss)` |
| Navigation = état | Ajouter/retirer des valeurs dans `path` |
