# 13. Architecture & Patterns — Exercices

---

## Exercice 13.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla avec Reef, voici une app avec logique dans le composant :

```js
// Reef.js v13 — tout dans le composant
import { signal, component } from 'reef'

const state = signal({
    username: '',
    isLoading: false,
    error: null,
    data: null
})

function App() {
    return {
        template() {
            if (state.value.isLoading) return '<p>Chargement...</p>'
            if (state.value.error) return `<p>Erreur: ${state.value.error}</p>`

            return `
                <input value="${state.value.username}" data-action="input" type="text">
                <button data-action="fetch">Chercher</button>
                ${state.value.data ? `<p>${state.value.data.name}</p>` : ''}
            `
        },
        events: {
            input(e) { state.value = { ...state.value, username: e.target.value } },
            fetch() {
                state.value = { ...state.value, isLoading: true, error: null }
                fetch(`/api/users/${state.value.username}`)
                    .then(r => r.json())
                    .then(data => {
                        state.value = { ...state.value, data, isLoading: false }
                    })
                    .catch(err => {
                        state.value = { ...state.value, error: err.message, isLoading: false }
                    })
            }
        }
    }
}
component('#app', App)
```

**Questions :**

→ Le fetch est dans le composant. En SwiftUI architecture, où va-t-il ?
→ Comment séparer la logique de la View ?
→ Traduis en respectant la séparation View / Model.

*Tente de répondre avant de lire la correction.*

---

### Correction 13.1

**Modèle mental :**

En Reef, tout est dans le composant (template + logique + fetch). En SwiftUI architecture, on sépare : la View décrit l'UI, le modèle contient la logique et les données.

```swift
// MODÈLE — contient logique + état
@Observable
@MainActor
class UserSearchModel {
    var username = ""
    var isLoading = false
    var errorMessage: String?
    var foundUser: User?

    struct User {
        let name: String
    }

    func search() async {
        guard !username.isEmpty else { return }
        isLoading = true
        errorMessage = nil
        do {
            foundUser = try await fetchUser(username: username)
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    private func fetchUser(username: String) async throws -> User {
        try await Task.sleep(for: .seconds(1))
        return User(name: "Benoit Poulain")
    }
}

// VIEW — description pure, délègue au modèle
struct UserSearchView: View {
    @State private var model = UserSearchModel()  // ownership

    var body: some View {
        VStack(spacing: 16) {
            TextField("Nom d'utilisateur", text: $model.username)
                .textFieldStyle(.roundedBorder)

            Button("Chercher") {
                Task { await model.search() }
            }
            .disabled(model.isLoading)

            if model.isLoading {
                ProgressView()
            } else if let error = model.errorMessage {
                Text("Erreur : \(error)").foregroundStyle(.red)
            } else if let user = model.foundUser {
                Text(user.name).font(.headline)
            }
        }
        .padding()
    }
}
```

**Séparation claire :**
- View : `TextField`, `Button`, `ProgressView` → description
- Model : `search()`, `fetchUser()`, `isLoading`, `errorMessage` → logique

---

## Exercice 13.2 — Piège de paradigme

### Énoncé

Voici une architecture problématique :

```swift
// Un seul "AppStore" pour tout
@Observable
class AppStore {
    var isAuthenticated = false
    var currentUser: User?
    var cartItems: [CartItem] = []
    var notifications: [Notification] = []
    var searchResults: [Result] = []
    var currentSearch = ""
    var isDarkMode = false
    var fontSize: Double = 16
    var navigationPath: [Route] = []
    // + 20 autres propriétés...

    func signIn() async { ... }
    func addToCart(_ item: CartItem) { ... }
    func search() async { ... }
    func updateSettings() { ... }
    // + 30 autres méthodes...
}

// Injecté partout
struct AppRoot: View {
    @State private var store = AppStore()
    var body: some View {
        ContentView()
            .environment(store)
    }
}
```

**Questions :**
→ Quels problèmes cause ce store global ?
→ Une View qui n'utilise que `cartItems` va-t-elle se recomposer quand `searchResults` change ?
→ Comment découper ce store ?

---

### Correction 13.2

**Problèmes du store global :**

1. **Performance** : chaque changement de n'importe quelle propriété peut déclencher des recompositions dans toutes les views qui observent le store
2. **Couplage** : une vue qui n'a besoin que du panier doit quand même dépendre du store entier
3. **Testabilité** : difficile de tester `CartModel` sans initialiser tout l'`AppStore`
4. **Modularisation** : impossible d'extraire `CartFeature` en package séparé

*Note sur la performance : avec `@Observable` iOS 17+, SwiftUI détecte les propriétés utilisées dans `body`. Mais `AppStore` reste un problème architectural même si les recompositions sont optimisées.*

**Découpage recommandé :**

```swift
// Un modèle par domaine
@Observable class AuthModel {
    var isAuthenticated = false
    var currentUser: User?
    func signIn() async { ... }
}

@Observable class CartModel {
    var items: [CartItem] = []
    func add(_ item: CartItem) { items.append(item) }
}

@Observable class SearchModel {
    var query = ""
    var results: [Result] = []
    func search() async { ... }
}

// Préférences → @AppStorage (section 10), pas un modèle
// Navigation → AppRouter @Observable (section 6)

// Injection ciblée
struct AppRoot: View {
    @State private var auth = AuthModel()
    @State private var cart = CartModel()
    // search reste local aux vues qui en ont besoin

    var body: some View {
        ContentView()
            .environment(auth)   // partagé dans tout l'arbre
            .environment(cart)   // partagé dans tout l'arbre
    }
}
```

---

## Exercice 13.3 — Mini cas réel

### Énoncé

Tu construis une app de tâches (To-Do) avec :
- Une liste de tâches (titre + statut done/undone)
- Ajout d'une tâche via un champ texte
- Toggle done/undone
- Filtre (Toutes / Actives / Terminées)
- Compteur "X tâches restantes"

**Avant de coder :**
→ Quels modèles crées-tu ? (`@Observable` ?)
→ Qu'est-ce qui va dans `@State` local de la View ?
→ Le filtre est-il dans le modèle ou dans la View ?

*Décris d'abord, code ensuite.*

---

### Correction 13.3

**Modèle mental :**

- `TaskModel` : contient les tâches, les actions, le filtre (filtre = état partagé entre liste et tabs)
- View : `@State private var model = TaskModel()`, champ texte local
- Compteur = propriété calculée du modèle (dérivé)

```swift
struct TodoTask: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool = false
}

enum TaskFilter: String, CaseIterable {
    case all = "Toutes"
    case active = "Actives"
    case done = "Terminées"
}

@Observable
@MainActor
class TaskModel {
    var tasks: [TodoTask] = []
    var filter: TaskFilter = .all

    var filteredTasks: [TodoTask] {
        switch filter {
        case .all: return tasks
        case .active: return tasks.filter { !$0.isDone }
        case .done: return tasks.filter { $0.isDone }
        }
    }

    var remainingCount: Int {
        tasks.filter { !$0.isDone }.count
    }

    func add(title: String) {
        guard !title.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        tasks.append(TodoTask(title: title))
    }

    func toggle(_ task: TodoTask) {
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index].isDone.toggle()
        }
    }

    func delete(at offsets: IndexSet) {
        tasks.remove(atOffsets: offsets)
    }
}

struct TodoListView: View {
    @State private var model = TaskModel()
    @State private var newTitle = ""  // ← local à la View — état UI éphémère

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filtre
                Picker("Filtre", selection: $model.filter) {
                    ForEach(TaskFilter.allCases, id: \.self) { filter in
                        Text(filter.rawValue).tag(filter)
                    }
                }
                .pickerStyle(.segmented)
                .padding()

                // Liste
                List {
                    ForEach(model.filteredTasks) { task in
                        HStack {
                            Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(task.isDone ? .green : .secondary)
                                .onTapGesture { model.toggle(task) }
                            Text(task.title)
                                .strikethrough(task.isDone)
                                .foregroundStyle(task.isDone ? .secondary : .primary)
                        }
                    }
                    .onDelete { model.delete(at: $0) }
                }

                // Pied
                HStack {
                    Text("\(model.remainingCount) tâche(s) restante(s)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.bottom, 8)
            }
            .navigationTitle("Tâches")
            .toolbar {
                ToolbarItem(placement: .bottomBar) {
                    HStack {
                        TextField("Nouvelle tâche...", text: $newTitle)
                            .textFieldStyle(.roundedBorder)
                            .onSubmit { addTask() }
                        Button("Ajouter") { addTask() }
                            .disabled(newTitle.isEmpty)
                    }
                }
            }
        }
    }

    private func addTask() {
        model.add(title: newTitle)
        newTitle = ""
    }
}

#Preview {
    TodoListView()
}
```

**Points clés :**
- `TaskModel` contient logique, filtre, dérivés — pas la View
- `newTitle` est dans `@State` local — état UI éphémère, pas besoin de persister
- `filteredTasks` et `remainingCount` = propriétés calculées (pas d'état dupliqué)
- `toggle()` et `delete()` = méthodes du modèle — la View ne manipule pas le tableau directement

**Erreurs classiques :**
- ❌ `@State var tasks` dans la View + logique de filtre dans `body`
- ❌ Stocker `remainingCount` comme état séparé → risque d'incohérence
- ✅ Logique = modèle, description = View
