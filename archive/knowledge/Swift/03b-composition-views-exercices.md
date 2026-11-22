# 3. Composition des Views — Exercices

---

## Exercice 3.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En Reef.js, voici un composant "carte utilisateur" composé :

```js
// Reef.js v13
import { signal, component } from 'reef'

const user = signal({ name: 'Benoit', role: 'Designer', online: true })

function StatusBadge() {
    return `<span class="badge ${user.value.online ? 'green' : 'grey'}">
                ${user.value.online ? 'En ligne' : 'Hors ligne'}
            </span>`
}

function UserCard() {
    return {
        template() {
            return `
                <div class="card">
                    <h2>${user.value.name}</h2>
                    <p>${user.value.role}</p>
                    ${StatusBadge()}
                    <button data-action="toggle">Toggle status</button>
                </div>
            `
        },
        events: {
            toggle() { user.value = { ...user.value, online: !user.value.online } }
        }
    }
}
component('#app', UserCard)
```

**Questions :**

→ Comment traduis-tu `StatusBadge()` (fonction JS) en SwiftUI ?
→ Comment passer `online` à `StatusBadge` ? Valeur ou Binding ?
→ Si `UserCard` veut que `StatusBadge` puisse toggle le statut, que faut-il changer ?

*Tente de répondre avant de lire la correction.*

---

### Correction 3.1

**Modèle mental :**

`StatusBadge` est une fonction pure en JS — elle lit l'état et retourne du HTML. En SwiftUI, c'est une `struct View` qui reçoit ses données en paramètre.

Pour la version lecture seule (`let`) :

```swift
struct UserCard: View {
    @State private var isOnline = true
    let name = "Benoit"
    let role = "Designer"

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(name).font(.title2).bold()
            Text(role).foregroundStyle(.secondary)
            StatusBadge(isOnline: isOnline)
            Button("Toggle status") {
                isOnline.toggle()
            }
        }
        .padding()
    }
}

struct StatusBadge: View {
    let isOnline: Bool  // ← lecture seule, pas de @Binding

    var body: some View {
        Text(isOnline ? "En ligne" : "Hors ligne")
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(isOnline ? Color.green.opacity(0.2) : Color.gray.opacity(0.2))
            .foregroundStyle(isOnline ? .green : .secondary)
            .clipShape(Capsule())
    }
}
```

Si `StatusBadge` doit pouvoir toggle lui-même :

```swift
struct StatusBadge: View {
    @Binding var isOnline: Bool  // ← @Binding pour modifier le parent

    var body: some View {
        Button(isOnline ? "En ligne" : "Hors ligne") {
            isOnline.toggle()
        }
        // ...
    }
}

// Dans UserCard :
StatusBadge(isOnline: $isOnline)  // ← $
```

**Règle :**
- Enfant lit seulement → `let isOnline: Bool`
- Enfant doit modifier → `@Binding var isOnline: Bool` + `$isOnline` au passage

---

## Exercice 3.2 — Piège de paradigme

### Énoncé

Voici une View SwiftUI. Qu'est-ce qui ne va pas ?

```swift
struct TimerView: View {
    var ticks = 0  // ← variable simple

    var body: some View {
        Text("Ticks : \(ticks)")
        Button("Tick") {
            ticks += 1  // ← erreur de compilation
        }
    }
}
```

Et ce deuxième cas — est-ce que ça compile ? Que se passe-t-il à l'exécution ?

```swift
struct CounterView: View {
    var count = 0  // ← variable simple

    var body: some View {
        Text("\(count)")
        // pas de bouton — juste lecture
    }
}
```

**Questions :**
→ Pourquoi le premier cas ne compile pas ?
→ Le deuxième cas compile — mais quel est le problème conceptuel ?
→ Que faut-il faire pour que `ticks` survive aux recompositions ?

---

### Correction 3.2

**Cas 1 — ne compile pas :**

`TimerView` est une `struct`. Ses méthodes ne peuvent pas muter ses propriétés sauf si elles sont marquées `mutating`. Dans `body` (propriété calculée du protocole `View`), la mutation est interdite.

De plus, même si ça compilait, SwiftUI ne saurait pas surveiller `ticks` pour déclencher une recomposition.

**Cas 2 — compile mais problème conceptuel :**

```
❌ Ce que le cerveau fait :
   "count existe dans la struct, il est lu dans body — ça suffit"

✅ Comment ça fonctionne réellement :
   count est recréé à zéro à chaque recomposition de CounterView.
   Si SwiftUI recompose la vue pour une raison quelconque, count revient à 0.
```

**Code corrigé :**

```swift
struct TimerView: View {
    @State private var ticks = 0  // ← @State : survit aux recompositions

    var body: some View {
        Text("Ticks : \(ticks)")
        Button("Tick") {
            ticks += 1
        }
    }
}
```

**Règle :**
- Toute donnée qui doit **persister entre recompositions** et **déclencher des mises à jour** doit être `@State` (ou équivalent)
- Les `var` simples dans une View sont instables — elles sont recréées à chaque recomposition

---

## Exercice 3.3 — Mini cas réel

### Énoncé

Tu construis une fiche produit pour une app e-commerce. La fiche contient :
- Une image (placeholder : `Image(systemName: "photo")`)
- Un nom de produit
- Un prix
- Une note (étoiles, de 0 à 5)
- Un bouton "Ajouter au panier" qui change en "Retiré" si pressé

**Avant de coder :**
→ Quels composants extrairais-tu en sous-vues ?
→ Lesquels utilisent `let` et lesquels utilisent `@Binding` ?
→ Où vit l'état "ajouté au panier" ?

*Décris d'abord, code ensuite.*

---

### Correction 3.3

**Modèle mental :**

- `ProductImage` → sous-vue simple, `let` (pas d'état)
- `StarRating` → sous-vue simple, `let rating: Int`
- `AddToCartButton` → sous-vue avec action — peut être simple (`let action: () -> Void`) ou avec `@Binding var inCart: Bool`
- L'état `inCart` vit dans la fiche produit parent

**Code SwiftUI :**

```swift
struct ProductSheet: View {
    let name: String
    let price: Double
    let rating: Int
    @State private var inCart = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            ProductImage()
            Text(name)
                .font(.title2)
                .bold()
            Text(String(format: "%.2f €", price))
                .foregroundStyle(.secondary)
            StarRating(rating: rating)
            AddToCartButton(inCart: $inCart)
        }
        .padding()
    }
}

struct ProductImage: View {
    var body: some View {
        Image(systemName: "photo")
            .resizable()
            .scaledToFit()
            .frame(maxWidth: .infinity, maxHeight: 200)
            .background(Color.gray.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct StarRating: View {
    let rating: Int

    var body: some View {
        HStack(spacing: 4) {
            ForEach(1...5, id: \.self) { star in
                Image(systemName: star <= rating ? "star.fill" : "star")
                    .foregroundStyle(star <= rating ? .yellow : .gray)
            }
        }
    }
}

struct AddToCartButton: View {
    @Binding var inCart: Bool

    var body: some View {
        Button(inCart ? "Retiré du panier" : "Ajouter au panier") {
            inCart.toggle()
        }
        .buttonStyle(.borderedProminent)
        .tint(inCart ? .red : .blue)
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    ProductSheet(name: "Clavier mécanique", price: 129.99, rating: 4)
}
```

**Points clés :**
- `ProductImage` et `StarRating` : données en lecture seule (`let`) — pas d'état
- `AddToCartButton` : `@Binding` car il modifie l'état du parent
- L'état `inCart` vit dans `ProductSheet` — source de vérité unique
- `ForEach(1...5, id: \.self)` : itère de 1 à 5 avec l'entier comme identifiant

**Erreurs classiques :**
- ❌ Mettre `@State private var inCart` dans `AddToCartButton` — son état serait déconnecté de la fiche
- ❌ Ne pas extraire et tout mettre dans un `body` géant — moins lisible et moins réutilisable
- ✅ Composition = découpage logique en responsabilités séparées
