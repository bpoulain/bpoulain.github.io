# 7. Side Effects & Lifecycle — Exercices

---

## Exercice 7.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, voici un fetch au chargement d'une "page" :

```js
// JS vanilla
async function loadUserPage() {
    const container = document.querySelector('#user')
    container.innerHTML = '<p>Chargement...</p>'

    const response = await fetch('/api/user/42')
    const user = await response.json()

    container.innerHTML = `<h1>${user.name}</h1><p>${user.role}</p>`
}

document.addEventListener('DOMContentLoaded', loadUserPage)
```

**Questions :**

→ Quel est l'équivalent de `DOMContentLoaded` en SwiftUI ?
→ Comment gérer l'état "chargement" puis "chargé" ?
→ Qu'est-ce que SwiftUI fait automatiquement que tu dois faire manuellement en JS ?

*Tente de répondre avant de lire la correction.*

---

### Correction 7.1

**Modèle mental :**

En JS, tu manipules le DOM manuellement (d'abord "Chargement...", puis le contenu). En SwiftUI, tu as un état qui reflète la situation, et `body` projette cet état. Le chargement est déclenché par `.task {}`.

```swift
struct User {
    let name: String
    let role: String
}

struct UserView: View {
    @State private var user: User?

    var body: some View {
        Group {
            if let user {
                VStack(alignment: .leading) {
                    Text(user.name).font(.title)
                    Text(user.role)
                }
            } else {
                ProgressView("Chargement...")
            }
        }
        .task {
            user = await fetchUser(id: 42)
        }
    }
}

// Simulation du fetch
func fetchUser(id: Int) async -> User {
    try? await Task.sleep(for: .seconds(1))  // simuler latence
    return User(name: "Benoit Poulain", role: "Designer")
}
```

**Ce que SwiftUI fait automatiquement :**
- Annulation du fetch si l'utilisateur quitte la vue avant la fin
- Recomposition de `body` quand `user` change de `nil` à sa valeur
- Gestion du thread (`.task {}` peut mettre à jour `@State` directement)

**Pièges courants :**
- ❌ Mettre le fetch dans `body` directement — `body` est appelé trop souvent
- ❌ Utiliser `.onAppear` pour un `async` fetch — `.onAppear` est synchrone
- ✅ `.task {}` est fait pour ça : async, lié au cycle de vie, annulation auto

---

## Exercice 7.2 — Piège de paradigme

### Énoncé

Voici une View qui log un événement analytics :

```swift
struct ProductView: View {
    let product: Product

    var body: some View {
        VStack {
            Text(product.name)
            Text(product.price, format: .currency(code: "EUR"))
        }
        let _ = print("ProductView affiché : \(product.name)")  // ← piège
    }
}
```

Et ce deuxième cas :

```swift
struct SearchView: View {
    @State private var query = ""
    @State private var results: [String] = []

    var body: some View {
        TextField("Recherche", text: $query)
            .onAppear {
                Task {
                    results = await search(query: query)
                }
            }
            // L'utilisateur tape → rien ne se passe
    }
}
```

**Questions :**
→ Quel est le problème avec le `print` dans `body` ?
→ Pourquoi la recherche ne se relance pas quand l'utilisateur tape ?
→ Que faut-il utiliser à la place dans chaque cas ?

---

### Correction 7.2

**Problème 1 — print dans body :**

`body` est appelé à chaque recomposition. Si le parent change, si l'état change, SwiftUI rappelle `body`. Le `print` sera exécuté des dizaines de fois, pas une seule.

```
❌ Ce que le cerveau fait :
   "body s'exécute une fois à l'affichage — c'est là que je log"

✅ Comment ça fonctionne réellement :
   body peut être appelé très fréquemment.
   Les side effects vont dans .onAppear, pas dans body.
```

```swift
// ✅ Correct
VStack {
    Text(product.name)
}
.onAppear {
    print("ProductView affiché : \(product.name)")
}
```

**Problème 2 — recherche qui ne se relance pas :**

`.onAppear` est déclenché **une seule fois** (quand la View apparaît). Il ne surveille pas les changements de `query`. Il faut `.task(id: query)` qui redémarre à chaque changement :

```swift
struct SearchView: View {
    @State private var query = ""
    @State private var results: [String] = []

    var body: some View {
        VStack {
            TextField("Recherche", text: $query)
            List(results, id: \.self) { Text($0) }
        }
        .task(id: query) {
            // Redéclenché à chaque changement de query
            // La tâche précédente est automatiquement annulée
            results = await search(query: query)
        }
    }
}
```

---

## Exercice 7.3 — Mini cas réel

### Énoncé

Tu construis un écran de profil utilisateur qui :
- Affiche un spinner pendant le chargement
- Affiche le profil (nom, bio) après chargement
- Si le chargement échoue, affiche un message d'erreur avec un bouton "Réessayer"
- Log un événement analytics "profil_vu" **une seule fois** à l'affichage

**Avant de coder :**
→ Quel état faut-il pour gérer loading / success / error ?
→ Où va le log analytics ?
→ Comment déclencher un "réessayer" ?

*Décris d'abord, code ensuite.*

---

### Correction 7.3

**Modèle mental :**

Un enum de states pour les 3 cas (loading, success, error). `.task` pour le fetch. `.onAppear` pour le log unique.

```swift
struct UserProfile: Equatable {
    let name: String
    let bio: String
}

enum LoadingState {
    case loading
    case success(UserProfile)
    case failure(String)
}

struct ProfileView: View {
    let userId: String
    @State private var state: LoadingState = .loading

    var body: some View {
        Group {
            switch state {
            case .loading:
                ProgressView("Chargement...")

            case .success(let profile):
                VStack(alignment: .leading, spacing: 12) {
                    Text(profile.name).font(.title).bold()
                    Text(profile.bio).foregroundStyle(.secondary)
                }
                .padding()

            case .failure(let message):
                VStack(spacing: 16) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.largeTitle)
                        .foregroundStyle(.orange)
                    Text(message)
                    Button("Réessayer") {
                        state = .loading  // ← reset → relance le .task
                    }
                }
                .padding()
            }
        }
        .onAppear {
            analytics.track("profil_vu", userId: userId)  // ← une seule fois
        }
        .task(id: state) {
            // Ne tourne que si state == .loading
            guard case .loading = state else { return }
            do {
                let profile = try await fetchProfile(id: userId)
                state = .success(profile)
            } catch {
                state = .failure("Impossible de charger le profil")
            }
        }
    }
}

// Simulation
struct Analytics {
    func track(_ event: String, userId: String) {
        print("Analytics: \(event) — userId: \(userId)")
    }
}
let analytics = Analytics()

func fetchProfile(id: String) async throws -> UserProfile {
    try await Task.sleep(for: .seconds(1))
    return UserProfile(name: "Benoit Poulain", bio: "Designer & Swift learner")
}
```

**Points clés :**
- `LoadingState` enum couvre tous les cas — le switch dans `body` est exhaustif
- `.task(id: state)` redémarre quand `state` change (bouton Réessayer reset à `.loading`)
- `guard case .loading = state else { return }` évite de relancer si déjà en succès
- `.onAppear {}` déclenché une seule fois — différent de `.task` qui peut redémarrer
- `state` doit être `Equatable` pour `.task(id:)` → enum sans données associées complexes

**Erreurs classiques :**
- ❌ Trois `@State` séparés pour `isLoading`, `profile`, `errorMessage` → incohérences possibles
- ✅ Un seul enum d'état couvre tous les cas mutuellement exclusifs
- ❌ Appeler `fetchProfile` dans `.onAppear` → pas de gestion d'annulation
- ✅ `.task {}` avec annulation automatique
