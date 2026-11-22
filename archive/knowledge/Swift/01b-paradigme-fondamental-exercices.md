# 1. Paradigme fondamental — Exercices

---

## Exercice 1.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

Tu as ce code JS vanilla :

```js
// JS vanilla
const btn = document.querySelector('#toggle')
const box = document.querySelector('#box')
let visible = true

btn.addEventListener('click', () => {
  visible = !visible
  box.style.display = visible ? 'block' : 'none'
})
```

**Questions :**

→ Comment tu ferais ça en JS vanilla ? *(tu l'as, c'est ci-dessus)*

→ Maintenant, comment tu penses ce problème en SwiftUI ?
- Qu'est-ce qui est l'**état** ici ?
- Qu'est-ce qui est le **rendu** ?
- Que se passe-t-il quand le bouton est pressé ?

*Tente de répondre avant de lire la correction.*

---

### Correction 1.1

**Modèle mental :**

En JS vanilla, `visible` est une variable libre et le DOM est modifié manuellement. En SwiftUI, `visible` devient un état (`@State`), et l'UI est une description conditionnelle de cet état.

Tu ne touches jamais la `box` directement. Tu changes `isVisible`, et SwiftUI décide quoi afficher.

**Code SwiftUI :**

```swift
struct ToggleBoxView: View {
    @State private var isVisible = true

    var body: some View {
        VStack {
            Button("Toggle") {
                isVisible.toggle()
            }
            if isVisible {
                Rectangle()
                    .fill(Color.blue)
                    .frame(width: 100, height: 100)
            }
        }
    }
}
```

**Points clés :**
- `@State` = la donnée réactive (l'état)
- `if isVisible { ... }` = la description conditionnelle (le rendu)
- `isVisible.toggle()` = seule action requise — SwiftUI fait le reste
- Il n'y a aucun objet `Rectangle` accessible après création

**Pièges courants :**
- ❌ Penser qu'il faut "cacher" ou "montrer" la Rectangle comme en JS
- ✅ L'`if` dans `body` *décrit* la présence ou l'absence — SwiftUI gère le rendu

---

## Exercice 1.2 — Piège de paradigme

### Énoncé

Voici du pseudo-code SwiftUI. Qu'est-ce qui ne va pas ?

```swift
struct BadView: View {
    var count = 0  // ← pas de @State

    var body: some View {
        VStack {
            Text("\(count)")
            Button("+1") {
                count += 1  // ← erreur de compilation
            }
        }
    }
}
```

**Questions :**
→ Qu'est-ce qui ne va pas ici ?
→ Pourquoi ça ne marche pas en SwiftUI ?
→ Quel est le problème conceptuel (pas juste syntaxique) ?

*Tente de répondre avant de lire la correction.*

---

### Correction 1.2

**Problème conceptuel :**

`count` est une propriété de la `struct` View. En Swift, les structs sont des **valeurs immuables** par défaut dans ce contexte. SwiftUI ne peut pas détecter les changements sur une simple variable — il ne sait pas qu'il faut recomposer `body`.

Sans `@State`, le changement de `count` ne déclenche aucune recomposition. L'UI ne se met jamais à jour.

```
❌ Ce que le cerveau fait :
   "Je modifie count → l'UI se mettra à jour"

✅ Comment ça fonctionne réellement :
   SwiftUI ne surveille que les propriétés marquées @State (ou équivalent).
   Une variable ordinaire ne déclenche pas de recomposition.
```

**Code corrigé :**

```swift
struct GoodView: View {
    @State private var count = 0  // ← @State = observable par SwiftUI

    var body: some View {
        VStack {
            Text("\(count)")
            Button("+1") {
                count += 1  // ← déclenche recomposition de body
            }
        }
    }
}
```

**Erreurs classiques :**
- Oublier `@State` et se demander pourquoi l'UI ne change pas
- Confondre "modifier une variable" (JS) avec "déclencher une recomposition" (SwiftUI)
- `@State` n'est pas une annotation décorative — c'est le mécanisme qui connecte la donnée au système de rendu

**Pont Reef :**
> En Reef, un `signal()` sans `.value` modifié ne déclenche pas de re-render. De même en SwiftUI, une variable sans `@State` ne déclenche pas de recomposition. La logique est similaire, mais le mécanisme est différent : en Reef tu manipules `.value`, en SwiftUI le wrapper `@State` fait le travail automatiquement.

---

## Exercice 1.3 — Mini cas réel

### Énoncé

Tu construis une petite carte produit iOS avec :
- Un nom de produit (texte fixe)
- Un bouton "Ajouter au panier"
- Un indicateur qui affiche "Dans le panier" si le produit a été ajouté, rien sinon
- Un bouton "Retirer" visible uniquement quand le produit est dans le panier

**Avant de coder, décris le modèle mental :**
→ Qu'est-ce qui est l'état ?
→ Qu'est-ce qui est le rendu (projection de l'état) ?
→ Quelles interactions changent l'état ?

*Décris d'abord, code ensuite.*

---

### Correction 1.3

**Modèle mental :**

- **État** : `inCart: Bool` — un booléen suffit
- **Rendu** :
  - Le nom du produit (fixe, pas d'état)
  - Le texte "Dans le panier" (visible si `inCart == true`)
  - Le bouton "Ajouter" (visible si `inCart == false`)
  - Le bouton "Retirer" (visible si `inCart == true`)
- **Interactions** :
  - "Ajouter" → `inCart = true`
  - "Retirer" → `inCart = false`

**Code SwiftUI :**

```swift
struct ProductCard: View {
    let productName: String
    @State private var inCart = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(productName)
                .font(.headline)

            if inCart {
                Text("Dans le panier")
                    .foregroundStyle(.green)
                Button("Retirer") {
                    inCart = false
                }
                .foregroundStyle(.red)
            } else {
                Button("Ajouter au panier") {
                    inCart = true
                }
            }
        }
        .padding()
    }
}

#Preview {
    ProductCard(productName: "Clavier mécanique")
}
```

**Points clés :**
- Un seul état (`inCart`) pilote entièrement l'UI
- Pas de manipulation directe des boutons — ils apparaissent/disparaissent selon l'état
- `productName` est une donnée fixe, pas un état (passée en paramètre, pas `@State`)
- `#Preview` est la façon Swift 6 de prévisualiser une vue dans Xcode 26

**Erreurs classiques à éviter :**
- ❌ Créer deux états séparés (`showAddButton`, `showRemoveButton`) — c'est du DOM thinking
- ✅ Un seul état booléen suffit : `inCart`. Le rendu en découle
- ❌ Essayer de "cacher" les boutons avec une propriété de style (comme `display: none` en CSS)
- ✅ Utiliser `if/else` dans `body` — la vue n'existe simplement pas quand la condition est fausse

**Pont Reef :**
> En Reef, tu aurais un `signal(false)` et ton template retournerait conditionnellement le HTML des boutons. La logique est identique, mais en SwiftUI la "template" est une structure Swift (`body`), pas une string HTML.
