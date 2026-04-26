# 9. Concurrency — async / await

## 9.1 Modèle mental central

**`async/await` en Swift est une exécution séquentielle de code qui peut se suspendre — sans bloquer le thread principal.**

Contrairement aux callbacks et aux `.then()`, `async/await` permet d'écrire du code asynchrone qui ressemble à du code synchrone. La coroutine se "suspend" pendant l'attente (réseau, fichier) et reprend quand le résultat est disponible.

> *Analogie : tu commandes un café. Au lieu de rester debout à attendre (`sync`), tu t'assieds et fais autre chose. Le barista te rappelle quand c'est prêt (`await`). Tu n'as pas bloqué la file.*

---

## 9.2 `async/await` — la base

### 9.2.1 Déclarer une fonction async

```swift
// Fonction qui peut se suspendre — doit être attendue avec await
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}
```

### 9.2.2 Appeler avec `await`

```swift
// Dans un contexte async
let user = try await fetchUser(id: "42")
```

### 9.2.3 Comparaison avec JS

```js
// JS — async/await
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`)
    return await response.json()
}

const user = await fetchUser('42')
```

```swift
// Swift — async/await (très similaire conceptuellement)
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

let user = try await fetchUser(id: "42")
```

**Différences clés :**
- Swift utilise `throws` + `try await` pour la gestion d'erreurs (pas de `.catch`)
- `try await` = peut se suspendre ET peut lancer une erreur
- Les types sont vérifiés à la compilation (pas de `any`)

---

## 9.3 `.task {}` — contexte async dans SwiftUI

Le modificateur `.task {}` est le **point d'entrée** d'un contexte `async` dans une View (voir aussi section 7) :

```swift
struct DataView: View {
    @State private var data: [String] = []

    var body: some View {
        List(data, id: \.self) { Text($0) }
            .task {
                do {
                    data = try await fetchData()
                } catch {
                    // gérer l'erreur
                }
            }
    }
}
```

---

## 9.4 `@MainActor` — isolation du thread UI

### 9.4.1 Problème

En Swift, les mises à jour d'`@State` et `@Observable` doivent se faire sur le **thread principal** (MainActor). Un fetch réseau s'exécute sur un thread background — si tu mets à jour l'état depuis ce thread, Swift 6 te donnera une erreur.

### 9.4.2 Solution

`@MainActor` garantit que les mises à jour se font sur le thread principal :

```swift
@Observable
@MainActor  // ← toute la classe s'exécute sur le main thread
class UserModel {
    var user: User?
    var isLoading = false

    func loadUser(id: String) async {
        isLoading = true
        do {
            user = try await fetchUser(id: id)
        } catch {
            // gérer
        }
        isLoading = false
    }
}
```

### 9.4.3 `.task {}` est déjà sur le MainActor

`SwiftUI` garantit que `.task {}` s'exécute sur le MainActor par défaut. Tu peux directement modifier `@State` dedans :

```swift
.task {
    // Déjà sur @MainActor — pas besoin de await MainActor.run { }
    data = try await fetchData()  // ✅ sécurisé
}
```

---

## 9.5 Structured concurrency — tâches parallèles

### 9.5.1 `async let` — parallelisme déclaratif

Pour lancer plusieurs opérations asynchrones en parallèle et attendre toutes les résultats :

```swift
func loadDashboard() async throws {
    // Lancées en parallèle — pas séquentielles
    async let user = fetchUser(id: "42")
    async let posts = fetchPosts(userId: "42")
    async let settings = fetchSettings()

    // Attendre tous les résultats
    let (u, p, s) = try await (user, posts, settings)
    // u, p, s sont disponibles en même temps
}
```

Sans `async let`, ça aurait été séquentiel (3× la latence). Avec `async let`, les 3 fetches se font en parallèle.

### 9.5.2 `TaskGroup` — parallélisme dynamique

Pour un nombre variable de tâches :

```swift
func fetchAllUsers(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask {
                try await fetchUser(id: id)
            }
        }
        var users: [User] = []
        for try await user in group {
            users.append(user)
        }
        return users
    }
}
```

---

## 9.6 Cancellation automatique

Swift structured concurrency gère la cancellation en cascade. Quand une tâche parente est annulée (ex: `.task {}` quand la View disparaît), toutes les sous-tâches sont annulées automatiquement.

Pour vérifier si une tâche a été annulée :

```swift
func longOperation() async throws {
    for i in 0..<1000 {
        try Task.checkCancellation()  // ← lève CancellationError si annulé
        await processItem(i)
    }
}
```

---

## 9.7 Comparaison JS async vs Swift async

| Concept | JS | Swift |
|---------|----|-------|
| Fonction async | `async function f() {}` | `func f() async {}` |
| Attendre | `await` | `await` |
| Erreur | `try/catch` ou `.catch()` | `throws` + `try` |
| Parallèle | `Promise.all([...])` | `async let` + `await (a, b)` |
| Annulation | `AbortController` manuel | Automatique (structured concurrency) |
| Thread UI | Pas de concept | `@MainActor` |

**Différence fondamentale :**

En JS, l'event loop est monothread — pas de problème de threading. En Swift, le code peut s'exécuter sur plusieurs threads simultanément. `@MainActor` et Swift 6 enforced concurrency garantissent que l'UI n'est modifiée que depuis le main thread.

---

## 9.8 Propagation du contexte async

Une fonction `async` ne peut être appelée que depuis un autre contexte `async` :
- Dans `.task {}`
- Dans une fonction marquée `async`
- Dans `Task { }` (création d'une tâche manuelle)

```swift
// ❌ Ne compile pas hors d'un contexte async
Button("Fetch") {
    let data = await fetchData()  // ← erreur
}

// ✅ Correct
Button("Fetch") {
    Task {
        data = try await fetchData()  // ← dans un Task
    }
}
```

---

## 9.9 Récapitulatif

| Concept | Description |
|---------|-------------|
| `async/await` | Code asynchrone séquentiel, non-bloquant |
| `throws` + `try` | Gestion d'erreurs combinée à async |
| `.task {}` | Contexte async lié au cycle de vie SwiftUI |
| `@MainActor` | Garantit exécution sur le main thread |
| `async let` | Lancer plusieurs opérations en parallèle |
| `Task { }` | Créer une tâche manuelle dans un contexte synchrone |
| Cancellation | Automatique en structured concurrency |
