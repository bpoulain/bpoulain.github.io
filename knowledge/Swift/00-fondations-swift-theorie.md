# 0. Fondations Swift — Prérequis POC-oriented

> **Statut :** prérequis recommandé avant les sections 01–14.
> Peut être consulté en parallèle de l'apprentissage SwiftUI.
> Focus : autonomie sur les données et la connexion à des APIs — pas exhaustivité.

---

## 0.1 Paradigme de base Swift — `struct` vs `class`, `let` vs `var`

### 0.1.1 `struct` vs `class` — valeur vs référence

Swift distingue deux façons d'organiser des données :

| | `struct` | `class` |
|--|---------|---------|
| Type | **Valeur** | **Référence** |
| Copie | Copiée à chaque assignation | Partagée (même objet) |
| Héritage | Non | Oui |
| Usage SwiftUI | **Préféré pour les Views et données** | Utilisé pour les modèles `@Observable` |

```swift
// struct — type valeur
struct Point {
    var x: Double
    var y: Double
}

var p1 = Point(x: 1, y: 2)
var p2 = p1    // ← copie indépendante
p2.x = 99
print(p1.x)   // 1 — p1 n'a pas changé

// class — type référence
class Counter {
    var count = 0
}

let c1 = Counter()
let c2 = c1    // ← même objet
c2.count = 99
print(c1.count) // 99 — c1 a changé
```

**Pourquoi c'est important en SwiftUI :**
- Les Views SwiftUI sont des `struct` → recréées en permanence, copiées sans effet de bord
- Les modèles `@Observable` sont des `class` → partagés par référence, observables
- (Voir section 03 — Composition des Views pour le détail)

### 0.1.2 `let` vs `var` — immutabilité par défaut

Swift encourage l'**immutabilité par défaut** :

```swift
let name = "Benoit"    // ← constant — ne peut pas changer
var count = 0          // ← variable — peut changer

name = "Alice"  // ❌ Erreur de compilation
count += 1      // ✅
```

**Dans une `struct`, `let` = propriété non modifiable :**

```swift
struct Product {
    let id: UUID       // ← jamais modifié après création
    var price: Double  // ← peut changer
}
```

**Règle pratique :** commence par `let`. Passe à `var` si le compilateur te le demande.

### 0.1.3 Mutabilité dans les structs

Une `struct` avec `var` peut être mutée seulement si l'instance est `var` :

```swift
struct Cart {
    var items: [String] = []

    mutating func add(_ item: String) {  // ← mutating requis dans une struct
        items.append(item)
    }
}

var myCart = Cart()   // var → mutable
myCart.add("Pomme")   // ✅

let frozenCart = Cart()
frozenCart.add("Banane")  // ❌ Erreur — let = immutable
```

---

## 0.2 Optionals — valeurs potentiellement absentes

### 0.2.1 Le concept

En Swift, une variable **ne peut pas être `nil` par défaut**. Si une valeur peut être absente, elle doit être déclarée comme **Optional** avec `?` :

```swift
var name: String = "Benoit"    // ← ne peut jamais être nil
var nickname: String? = nil    // ← peut être nil (Optional)
var age: Int? = 25             // ← Optional avec valeur
```

**Analogie JS :** `String?` ≈ `string | null | undefined` en TypeScript.

### 0.2.2 Lire un Optional — `if let` (unwrap sûr)

Pour utiliser la valeur d'un Optional, tu dois d'abord vérifier qu'elle existe :

```swift
let username: String? = fetchUsername()  // peut retourner nil

// if let — unwrap sûr
if let name = username {
    print("Bonjour \(name)")  // ← name est un String ici, pas String?
} else {
    print("Pas de nom")
}

// Swift 5.7+ — même variable
if let username {
    print("Bonjour \(username)")
}
```

### 0.2.3 `guard let` — early exit

`guard let` est la forme préférée quand une valeur manquante est une erreur de logique :

```swift
func displayProfile(userId: String?) {
    guard let id = userId else {
        print("Pas d'ID — abandon")
        return  // ← sort de la fonction
    }
    // ici, id est un String garanti
    loadProfile(id: id)
}
```

**Règle :** `if let` pour les branches conditionnelles, `guard let` pour les préconditions.

### 0.2.4 Optional dans les UI states

Les Optionals sont omniprésents dans SwiftUI pour les états de chargement :

```swift
// Pattern courant — nil = pas encore chargé
@State private var user: User?   // nil pendant le chargement

var body: some View {
    if let user {
        Text(user.name)       // ← affiché quand chargé
    } else {
        ProgressView()        // ← spinner pendant le chargement
    }
}
```

> *Voir aussi section 07 (Side effects) et section 09 (Concurrency) pour les patterns async complets.*

### 0.2.5 Opérateurs Optional utiles

```swift
// ?? — valeur par défaut si nil
let display = username ?? "Anonyme"

// ?. — chaînage optionnel (ne crash pas si nil)
let length = username?.count   // Int? — nil si username est nil

// ! — force unwrap (dangereux — éviter)
let forced = username!  // crash si nil
```

---

## 0.3 Codable — JSON ↔ Swift

### 0.3.1 Le principe

`Codable` permet de **sérialiser/désérialiser** automatiquement entre JSON et types Swift. C'est la façon standard de travailler avec des APIs REST.

```swift
// Une struct Codable peut être construite depuis JSON
struct User: Codable {
    let id: Int
    let name: String
    let email: String
}
```

### 0.3.2 Décodage JSON → Swift

```swift
let jsonData = """
{
    "id": 42,
    "name": "Benoit Poulain",
    "email": "b.poulain@gmail.com"
}
""".data(using: .utf8)!

let decoder = JSONDecoder()
let user = try decoder.decode(User.self, from: jsonData)
print(user.name)  // "Benoit Poulain"
```

### 0.3.3 Mapping des clés JSON — `CodingKeys`

Quand les noms JSON ne correspondent pas aux conventions Swift :

```swift
struct Article: Codable {
    let id: Int
    let title: String
    let publishedAt: Date  // ← camelCase Swift

    enum CodingKeys: String, CodingKey {
        case id
        case title
        case publishedAt = "published_at"  // ← snake_case JSON
    }
}
```

**Alternative — `JSONDecoder.keyDecodingStrategy` :**

```swift
let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase  // auto snake_case → camelCase
decoder.dateDecodingStrategy = .iso8601               // auto parsing des dates
```

### 0.3.4 Structures imbriquées

```swift
struct APIResponse: Codable {
    let status: String
    let data: [Product]    // ← tableau de Product (aussi Codable)
}

struct Product: Codable {
    let id: UUID
    let name: String
    let price: Double
}
```

### 0.3.5 `Identifiable` + `Codable` — combo SwiftUI

Pour les listes SwiftUI, un modèle doit souvent être les deux :

```swift
struct Item: Codable, Identifiable {
    let id: UUID      // ← pour ForEach/List
    var name: String
    var price: Double
}
```

---

## 0.4 Networking minimal — URLSession

### 0.4.1 GET request simple

```swift
func fetchUsers() async throws -> [User] {
    let url = URL(string: "https://api.example.com/users")!
    let (data, _) = try await URLSession.shared.data(from: url)
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return try decoder.decode([User].self, from: data)
}
```

### 0.4.2 Gestion d'erreurs basique

```swift
func loadUsers() async {
    do {
        let users = try await fetchUsers()
        // utiliser users
    } catch URLError.notConnectedToInternet {
        print("Pas de connexion")
    } catch DecodingError.keyNotFound(let key, _) {
        print("Clé manquante dans le JSON : \(key)")
    } catch {
        print("Erreur : \(error.localizedDescription)")
    }
}
```

### 0.4.3 Requête avec paramètres

```swift
func searchProducts(query: String) async throws -> [Product] {
    var components = URLComponents(string: "https://api.example.com/products")!
    components.queryItems = [URLQueryItem(name: "q", value: query)]

    let url = components.url!
    let (data, response) = try await URLSession.shared.data(from: url)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw URLError(.badServerResponse)
    }

    return try JSONDecoder().decode([Product].self, from: data)
}
```

### 0.4.4 Pattern dans une View SwiftUI

```swift
struct UserListView: View {
    @State private var users: [User] = []

    var body: some View {
        List(users) { user in Text(user.name) }
            .task {
                users = (try? await fetchUsers()) ?? []
            }
    }
}
```

> *Pour l'intégration complète avec gestion d'état (loading/error/success), voir section 07. Pour la structure d'un APIClient réutilisable, voir section 15.*

---

## 0.5 Concurrency minimale — lecture et usage

> *Cette section couvre la syntaxe Swift. Pour l'intégration dans le cycle de vie SwiftUI (.task, annulation), voir **section 09**.*

### 0.5.1 `async/await` — lire le code

```swift
// Fonction qui peut "attendre" sans bloquer le thread
func fetchData() async throws -> Data {
    let (data, _) = try await URLSession.shared.data(from: url)
    return data
}

// Appeler avec await
let data = try await fetchData()  // ← se suspend ici, reprend quand data est dispo
```

**Règle de lecture :** `await` = "ce code peut se suspendre et reprendre plus tard". Rien ne bloque.

### 0.5.2 `Task {}` — créer un contexte async depuis un contexte synchrone

Les boutons SwiftUI sont synchrones. Pour lancer du code async depuis un bouton :

```swift
Button("Charger") {
    Task {
        await loadData()  // ← dans un Task pour accéder à async
    }
}
```

### 0.5.3 `@MainActor` — pourquoi c'est nécessaire

Swift 6 enforced : les mises à jour d'UI doivent être sur le thread principal. `@MainActor` garantit ça pour un modèle entier :

```swift
@Observable
@MainActor  // ← toutes les opérations de cette classe sont sur le main thread
class DataModel {
    var items: [Item] = []

    func load() async {
        items = try await fetchItems()  // ← safe — sur @MainActor
    }
}
```

Sans `@MainActor`, modifier un `@State` depuis un thread background = erreur Swift 6.

---

## 0.6 Closures — lecture essentielle

### 0.6.1 Syntaxe de base

Une closure est une **fonction sans nom** passée comme valeur :

```swift
// Fonction nommée
func double(_ n: Int) -> Int { n * 2 }

// Closure équivalente
let double = { (n: Int) -> Int in n * 2 }

// Forme abrégée (types inférés)
let double = { $0 * 2 }
```

**Analogie JS :**
```js
// JS
const double = (n) => n * 2
const double = n => n * 2
```

### 0.6.2 Closures comme paramètres — lire le code SwiftUI

La plupart des APIs SwiftUI utilisent des closures comme paramètres :

```swift
// Button prend une closure comme action
Button("Valider") {
    // cette accolade est une closure trailing (paramètre final)
    submit()
}

// .task prend une closure async
.task {
    await loadData()
}

// ForEach prend une closure de construction de vue
ForEach(items) { item in
    Text(item.name)
}
```

### 0.6.3 Fonctions passées en paramètre

Dans les modèles et les sous-vues, tu passeras souvent des actions comme closures :

```swift
struct DeleteButton: View {
    let onDelete: () -> Void  // ← "une fonction qui ne prend rien et ne retourne rien"

    var body: some View {
        Button("Supprimer", action: onDelete)
    }
}

// Usage
DeleteButton(onDelete: {
    model.deleteItem()
})
```

### 0.6.4 `@escaping` — lecture

`@escaping` signifie que la closure peut être appelée après la fin de la fonction (ex: stockée, appelée plus tard). Tu le verras dans les APIs réseau :

```swift
// À lire (rarement à écrire en POC)
func fetchWithCallback(completion: @escaping (Result<User, Error>) -> Void) { ... }
```

En pratique avec `async/await`, tu évites les callbacks et donc `@escaping` — mais tu le croiseras dans le code legacy.

---

## Récapitulatif Bloc 0

| Concept | À retenir | Utilisé dans |
|---------|-----------|-------------|
| `struct` | Type valeur — Views SwiftUI | Sections 01, 03 |
| `class` | Type référence — modèles `@Observable` | Sections 02, 13 |
| `let` / `var` | Immutabilité par défaut | Partout |
| `Optional ?` | Valeur potentiellement absente | Sections 07, 09 |
| `if let` / `guard let` | Unwrap sûr | Sections 07, 09 |
| `Codable` | JSON ↔ Swift | Sections 09, 15 |
| `URLSession` | Appel réseau | Sections 09, 15 |
| `async/await` | Code asynchrone séquentiel | **Section 09** |
| `Task {}` | Contexte async depuis UI | Sections 07, 09 |
| `@MainActor` | Thread sécurité UI | Section 09 |
| Closures | Fonctions passées en paramètre | Partout |
