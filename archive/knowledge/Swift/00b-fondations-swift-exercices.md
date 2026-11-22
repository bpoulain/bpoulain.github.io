# 0. Fondations Swift — Exercices

> **Format adapté :** les exercices de cette section mêlent traduction JS→Swift, pièges de paradigme, et mini cas pratiques orientés POC. Les 3 niveaux restent mais le pont pédagogique ici est JS vanilla / Python → Swift (pas SwiftUI).

---

## Exercice 0.1 — `struct` vs `class` / `let` vs `var`

### Énoncé

En JS, tu écris souvent :

```js
// JS — objet mutable partagé par référence
const user = { name: 'Benoit', score: 0 }

function incrementScore(u) {
    u.score++  // ← modifie l'objet original
}

incrementScore(user)
console.log(user.score)  // 1
```

**Questions :**

→ Si tu traduis `user` en `struct Swift` et passes l'objet à une fonction, que se passe-t-il ?
→ Quand utilises-tu une `struct` et quand une `class` en Swift ?
→ Pourquoi les Views SwiftUI sont-elles des `struct` et non des `class` ?

*Tente de répondre avant de lire la correction.*

---

### Correction 0.1

**La surprise struct :**

```swift
struct User {
    var name: String
    var score: Int
}

func incrementScore(_ u: User) -> User {  // ← doit retourner une copie modifiée
    var copy = u
    copy.score += 1
    return copy
}

var user = User(name: "Benoit", score: 0)
user = incrementScore(user)  // ← doit réassigner
print(user.score)  // 1
```

En Swift, `struct` est un **type valeur** — passé à une fonction, c'est une copie. La fonction ne peut pas modifier l'original. C'est différent de JS où les objets sont passés par référence.

**Règle struct vs class :**

| Situation | Choix |
|-----------|-------|
| Données UI (View SwiftUI) | `struct` |
| Données statiques / immuables | `struct` |
| Modèle partagé entre plusieurs Views | `class @Observable` |
| Données avec identité (un utilisateur précis) | `class` souvent |

**Pourquoi les Views SwiftUI sont des structs :**

SwiftUI recrée les Views constamment (recomposition). Une `struct` est légère, copiable, sans effets de bord. Si les Views étaient des `class`, elles persisteraient en mémoire et créeraient des bugs d'état. (Voir section 03.)

---

## Exercice 0.2 — Optionals (critique en POC)

### Énoncé

Voici du code Swift avec un problème :

```swift
struct ApiResponse: Codable {
    let username: String?
    let score: Int?
}

func displayUser(_ response: ApiResponse) {
    print("Bienvenue \(response.username)!")   // ← problème ici
    print("Score : \(response.score)")          // ← problème ici
}
```

Et ce deuxième cas — qu'est-ce qui ne va pas dans le flux UI ?

```swift
struct ProfileView: View {
    @State private var profile: UserProfile?

    var body: some View {
        VStack {
            Text(profile!.name)    // ← force unwrap
            Text(profile!.bio)
        }
        .task {
            profile = await fetchProfile()
        }
    }
}
```

**Questions :**
→ Pourquoi les deux `print()` sont-ils problématiques ?
→ Pourquoi `profile!` est-il dangereux dans la View ?
→ Comment corriger les deux cas ?

---

### Correction 0.2

**Problème 1 — Optionals non unwrappés :**

`username: String?` contient `Optional("Benoit")`, pas `"Benoit"`. `print("\(response.username)")` affichera `Optional("Benoit")` — pas ce qu'on veut. Et si la valeur est nil, ça affiche `nil`.

```swift
// ✅ Correction avec if let
func displayUser(_ response: ApiResponse) {
    if let username = response.username {
        print("Bienvenue \(username)!")
    } else {
        print("Utilisateur inconnu")
    }

    let score = response.score ?? 0  // ← valeur par défaut si nil
    print("Score : \(score)")
}
```

**Problème 2 — Force unwrap `!` dans une View :**

`profile!` crash si `profile` est `nil`. Au démarrage, avant que `.task` ait terminé le fetch, `profile` est `nil`. L'app crashe instantanément.

```swift
// ✅ Correction — if let dans body
struct ProfileView: View {
    @State private var profile: UserProfile?

    var body: some View {
        Group {
            if let profile {
                VStack {
                    Text(profile.name)
                    Text(profile.bio)
                }
            } else {
                ProgressView("Chargement...")
            }
        }
        .task {
            profile = await fetchProfile()
        }
    }
}
```

**Règle d'or :** jamais de `!` sur des données venant d'une API ou d'un état chargé de façon async.

---

## Exercice 0.3 — Codable et parsing JSON

### Énoncé

Tu reçois cette réponse JSON d'une API :

```json
{
    "user_id": 42,
    "display_name": "Benoit Poulain",
    "created_at": "2026-01-15T10:30:00Z",
    "is_premium": true,
    "tags": ["design", "swift", "ios"]
}
```

**Questions :**

→ Définis la struct Swift `UserDTO` qui mappe exactement ce JSON.
→ Le champ `user_id` utilise `snake_case` — comment le mapper en `userId` (camelCase Swift) ?
→ Comment décoder `created_at` comme une vraie `Date` Swift ?

*Tente de répondre avant de lire la correction.*

---

### Correction 0.3

```swift
struct UserDTO: Codable {
    let userId: Int
    let displayName: String
    let createdAt: Date
    let isPremium: Bool
    let tags: [String]
}

// Décodage avec configuration
func decodeUser(from data: Data) throws -> UserDTO {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase   // ← snake → camel auto
    decoder.dateDecodingStrategy = .iso8601                // ← parse les dates ISO

    return try decoder.decode(UserDTO.self, from: data)
}

// Usage
let jsonString = """
{
    "user_id": 42,
    "display_name": "Benoit Poulain",
    "created_at": "2026-01-15T10:30:00Z",
    "is_premium": true,
    "tags": ["design", "swift", "ios"]
}
"""

if let data = jsonString.data(using: .utf8),
   let user = try? decodeUser(from: data) {
    print(user.displayName)   // "Benoit Poulain"
    print(user.userId)        // 42
    print(user.tags)          // ["design", "swift", "ios"]
}
```

**Points clés :**
- `.convertFromSnakeCase` → mapping automatique `user_id` → `userId`
- `.iso8601` → `"2026-01-15T10:30:00Z"` → `Date`
- `try?` → `nil` si le décodage échoue (safe pour le POC)

---

## Exercice 0.4 — Networking minimal dans SwiftUI

### Énoncé

Tu veux afficher une liste de posts depuis cette URL : `https://jsonplaceholder.typicode.com/posts`

La réponse JSON ressemble à :
```json
[
  { "id": 1, "userId": 1, "title": "Titre du post", "body": "Contenu..." },
  ...
]
```

**Avant de coder :**
→ Définis le modèle `Post` (Codable + Identifiable)
→ Écris la fonction `fetchPosts() async throws -> [Post]`
→ Intègre dans une View SwiftUI avec gestion loading/error

---

### Correction 0.4

```swift
// Modèle
struct Post: Codable, Identifiable {
    let id: Int
    let userId: Int
    let title: String
    let body: String
}

// Fetch
func fetchPosts() async throws -> [Post] {
    let url = URL(string: "https://jsonplaceholder.typicode.com/posts")!
    let (data, response) = try await URLSession.shared.data(from: url)

    guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }

    return try JSONDecoder().decode([Post].self, from: data)
}

// View SwiftUI
struct PostListView: View {
    @State private var posts: [Post] = []
    @State private var isLoading = true
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if isLoading {
                ProgressView("Chargement des posts...")
            } else if let error = errorMessage {
                VStack {
                    Text("Erreur : \(error)").foregroundStyle(.red)
                    Button("Réessayer") {
                        isLoading = true
                        errorMessage = nil
                    }
                }
            } else {
                List(posts) { post in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(post.title).bold()
                        Text(post.body)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    }
                }
            }
        }
        .task(id: isLoading) {
            guard isLoading else { return }
            do {
                posts = try await fetchPosts()
            } catch {
                errorMessage = error.localizedDescription
            }
            isLoading = false
        }
        .navigationTitle("Posts")
    }
}

#Preview {
    NavigationStack { PostListView() }
}
```

**Points clés :**
- `Post: Codable, Identifiable` = compatible JSON + ForEach/List
- `guard let http = response as? HTTPURLResponse` = vérification du status code
- `isLoading = true` + `errorMessage = nil` dans le bouton "Réessayer" = déclenche le `.task(id:)`

---

## Exercice 0.5 — Closures : lire du code SwiftUI

### Énoncé

Voici du code SwiftUI que tu dois **lire et comprendre** (pas nécessairement écrire) :

```swift
struct FilteredList: View {
    let items: [String]
    let filter: (String) -> Bool           // ← closure paramètre
    let onSelect: (String) -> Void         // ← closure action

    var filteredItems: [String] {
        items.filter(filter)               // ← closure passée à .filter
    }

    var body: some View {
        List(filteredItems, id: \.self) { item in   // ← closure de construction
            Button(item) {
                onSelect(item)             // ← appel de la closure
            }
        }
    }
}

// Usage
FilteredList(
    items: ["Design", "Swift", "Python", "Figma"],
    filter: { $0.count > 4 },             // ← closure inline avec $0
    onSelect: { selected in
        print("Sélectionné : \(selected)")
    }
)
```

**Questions :**

→ Que signifie `(String) -> Bool` comme type de paramètre ?
→ Que fait `$0` dans `{ $0.count > 4 }` ?
→ Pourquoi `items.filter(filter)` fonctionne sans accolade ?

---

### Correction 0.5

**`(String) -> Bool` :**

C'est un **type de fonction** — "une fonction qui prend un `String` et retourne un `Bool`". En JS : `(s: string) => boolean`. `filter:` attend n'importe quelle closure qui a cette signature.

**`$0` :**

Dans une closure avec un seul paramètre, `$0` remplace le nom du paramètre. Ces deux closures sont équivalentes :

```swift
{ item in item.count > 4 }   // ← forme explicite
{ $0.count > 4 }              // ← forme abrégée avec $0
```

**`items.filter(filter)` :**

`Array.filter()` prend une closure `(Element) -> Bool`. `filter` (la propriété de la View) est déjà une closure de ce type → elle peut être passée directement sans accolade. C'est ce qu'on appelle "passer une fonction comme valeur".

**Analogie JS :**

```js
// JS — équivalent
const filteredItems = items.filter(filter)
// identique à
const filteredItems = items.filter(item => filter(item))
```

En Swift, idem — tu peux passer une fonction là où une closure est attendue, si les types correspondent.

**Ce qu'il faut retenir pour lire du code SwiftUI :**
- `{ }` seul = closure simple (action de bouton, onTapGesture, etc.)
- `{ item in }` = closure avec paramètre nommé
- `{ $0 }` = closure avec paramètre abrégé
- `() -> Void` = "action sans paramètre et sans retour"
- `(String) -> Void` = "action qui reçoit un String"
