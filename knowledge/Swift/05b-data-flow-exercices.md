# 5. Data Flow — Exercices

---

## Exercice 5.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En Reef.js, voici une app avec un état partagé entre deux composants :

```js
// Reef.js v13 — état partagé via signal module-level
import { signal, component } from 'reef'

const cart = signal([])

function CartCounter() {
    return {
        template() {
            return `<span>Panier : ${cart.value.length}</span>`
        }
    }
}

function AddButton() {
    return {
        template() {
            return `<button data-action="add">Ajouter</button>`
        },
        events: {
            add() {
                cart.value = [...cart.value, { id: Date.now(), name: 'Article' }]
            }
        }
    }
}

component('#counter', CartCounter)
component('#btn', AddButton)
```

**Questions :**

→ En SwiftUI, les deux vues sont dans le même `body` parent. Où vit l'état `cart` ?
→ Comment `CartCounter` et `AddButton` accèdent-ils à `cart` sans qu'il soit global ?
→ Traduis ce code en SwiftUI.

*Tente de répondre avant de lire la correction.*

---

### Correction 5.1

**Modèle mental :**

En Reef, le signal est au niveau module — accessible partout. En SwiftUI, l'état `cart` monte dans l'ancêtre commun des deux vues, qui le passe en paramètre (ou via `@Observable` + `@Environment` pour des apps plus grandes).

```swift
struct CartItem: Identifiable {
    let id = UUID()
    let name: String
}

struct CartApp: View {
    @State private var cart: [CartItem] = []  // ← état dans l'ancêtre commun

    var body: some View {
        VStack(spacing: 20) {
            CartCounter(count: cart.count)
            AddButton { cart.append(CartItem(name: "Article")) }
        }
        .padding()
    }
}

struct CartCounter: View {
    let count: Int  // ← reçoit la donnée

    var body: some View {
        Text("Panier : \(count)")
            .font(.headline)
    }
}

struct AddButton: View {
    let onAdd: () -> Void  // ← reçoit l'action (closure)

    var body: some View {
        Button("Ajouter", action: onAdd)
            .buttonStyle(.borderedProminent)
    }
}
```

**Différence clé :**
- En Reef : signal global, accessible n'importe où
- En SwiftUI : état dans l'ancêtre commun, passé explicitement vers le bas
- `AddButton` ne possède pas l'état — il reçoit une action (`onAdd: () -> Void`)

---

## Exercice 5.2 — Piège de paradigme

### Énoncé

Un développeur veut partager un état entre deux vues non liées directement. Il fait ça :

```swift
// Dans View A
struct ViewA: View {
    @State private var score = 0

    var body: some View {
        VStack {
            Text("Score A : \(score)")
            Button("+10") { score += 10 }
        }
    }
}

// Dans View B — essaie de lire le même score
struct ViewB: View {
    @State private var score = 0  // ← état séparé !

    var body: some View {
        Text("Score B : \(score)")
        // score est toujours 0 même quand ViewA le modifie
    }
}
```

**Questions :**
→ Pourquoi `ViewB` ne voit jamais les changements de `ViewA` ?
→ Quelles sont les deux solutions en SwiftUI ?
→ Laquelle choisirais-tu si les deux vues sont dans le même écran ? Ou dans des écrans séparés ?

---

### Correction 5.2

**Problème :**

Chaque `@State` est **privé à sa View**. `ViewA.score` et `ViewB.score` sont deux états distincts, non connectés. Modifier l'un ne touche pas l'autre.

```
❌ Ce que le cerveau fait :
   "Deux variables avec le même nom → même état"

✅ Comment ça fonctionne réellement :
   Chaque @State est indépendant. L'état ne se "synchronise" pas par similarité de nom.
```

**Solution 1 — Remonter l'état dans le parent commun :**

```swift
struct ScoreBoard: View {
    @State private var score = 0  // ← source unique

    var body: some View {
        ViewA(score: $score)
        ViewB(score: score)
    }
}

struct ViewA: View {
    @Binding var score: Int

    var body: some View {
        VStack {
            Text("Score A : \(score)")
            Button("+10") { score += 10 }
        }
    }
}

struct ViewB: View {
    let score: Int  // ← lecture seule

    var body: some View {
        Text("Score B : \(score)")
    }
}
```

**Solution 2 — `@Observable` (pour vues dans des écrans différents) :**

```swift
@Observable
class GameState {
    var score = 0
}

struct ViewA: View {
    var game: GameState

    var body: some View {
        Button("+10") { game.score += 10 }
    }
}

struct ViewB: View {
    var game: GameState

    var body: some View {
        Text("Score : \(game.score)")
    }
}
```

**Règle de choix :**
- Même écran, vues proches → `@State` + `@Binding`
- Vues distantes dans l'arbre, ou données métier → `@Observable`

---

## Exercice 5.3 — Mini cas réel

### Énoncé

Tu construis une app de commande avec :
- Un `@Observable` `OrderModel` qui contient : `items: [String]`, `note: String`
- Un écran `OrderSummary` qui affiche le récapitulatif (lecture seule)
- Un écran `OrderForm` qui permet d'ajouter des items et d'écrire une note (modifications)

**Avant de coder :**
→ Où crées-tu l'instance de `OrderModel` ?
→ Comment la passes-tu à `OrderSummary` et `OrderForm` ?
→ `OrderForm` a besoin de `$model.note` (TextField) — quel wrapper utilises-tu ?

*Décris d'abord, code ensuite.*

---

### Correction 5.3

**Modèle mental :**

`OrderModel` est créé dans la vue racine avec `@State`. Il est passé en paramètre aux sous-vues. `OrderSummary` le reçoit comme `var` (lecture auto via `@Observable`). `OrderForm` l'utilise avec `@Bindable` pour accéder aux `$bindings`.

```swift
@Observable
class OrderModel {
    var items: [String] = []
    var note: String = ""

    var summary: String {
        items.isEmpty ? "Commande vide" : items.joined(separator: ", ")
    }
}

// Vue racine
struct OrderApp: View {
    @State private var order = OrderModel()

    var body: some View {
        TabView {
            OrderForm(order: order)
                .tabItem { Label("Commander", systemImage: "cart") }
            OrderSummary(order: order)
                .tabItem { Label("Récap", systemImage: "doc.text") }
        }
    }
}

// Lecture seule — var suffit car @Observable détecte les lectures
struct OrderSummary: View {
    var order: OrderModel

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Récapitulatif")
                .font(.title2).bold()
            Text(order.summary)
            if !order.note.isEmpty {
                Text("Note : \(order.note)")
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
    }
}

// Modifications — @Bindable pour accéder aux $bindings
struct OrderForm: View {
    @Bindable var order: OrderModel

    var body: some View {
        Form {
            Section("Articles") {
                ForEach(order.items, id: \.self) { item in
                    Text(item)
                }
                Button("Ajouter un article") {
                    order.items.append("Article \(order.items.count + 1)")
                }
            }
            Section("Note") {
                TextField("Note spéciale...", text: $order.note)
                // ← $order.note possible grâce à @Bindable
            }
        }
    }
}

#Preview {
    OrderApp()
}
```

**Points clés :**
- `@State private var order = OrderModel()` → ownership dans la racine
- `var order: OrderModel` dans `OrderSummary` → `@Observable` détecte les lectures automatiquement
- `@Bindable var order: OrderModel` dans `OrderForm` → permet `$order.note`
- La même instance `order` est partagée entre les deux écrans → source de vérité unique

**Erreurs classiques :**
- ❌ Créer deux instances séparées : `@State private var order = OrderModel()` dans chaque View
- ❌ Utiliser `@Binding var order: OrderModel` pour un `@Observable` → inutile et incorrect
- ✅ `var order: OrderModel` pour lecture, `@Bindable var order: OrderModel` pour écriture via `$`
