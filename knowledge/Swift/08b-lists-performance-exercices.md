# 8. Lists & Performance — Exercices

---

## Exercice 8.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En Reef.js, voici une liste dynamique avec ajout et suppression :

```js
// Reef.js v13
import { signal, component } from 'reef'

const items = signal([
    { id: 1, name: 'Pomme' },
    { id: 2, name: 'Banane' }
])

function ItemList() {
    return {
        template() {
            return `
                <ul>
                    ${items.value.map(item =>
                        `<li data-id="${item.id}">
                            ${item.name}
                            <button data-action="remove" data-id="${item.id}">×</button>
                        </li>`
                    ).join('')}
                </ul>
                <button data-action="add">Ajouter Cerise</button>
            `
        },
        events: {
            remove(event) {
                const id = parseInt(event.target.dataset.id)
                items.value = items.value.filter(i => i.id !== id)
            },
            add() {
                items.value = [...items.value, { id: Date.now(), name: 'Cerise' }]
            }
        }
    }
}
component('#app', ItemList)
```

**Questions :**

→ Comment traduire `items.value.map()` en SwiftUI ?
→ Qu'est-ce qu'il faut ajouter au modèle `Item` pour que SwiftUI puisse identifier chaque élément ?
→ Comment fait-on la suppression sans `.filter()` sur l'array ?

*Tente de répondre avant de lire la correction.*

---

### Correction 8.1

**Modèle mental :**

`items.value.map()` → `ForEach` ou `List`. L'ID dans Reef sert au diffing DOM → en SwiftUI c'est `Identifiable`. La suppression se fait via `.onDelete` ou en filtrant le tableau d'état.

```swift
struct Item: Identifiable {
    let id = UUID()
    var name: String
}

struct ItemListView: View {
    @State private var items = [
        Item(name: "Pomme"),
        Item(name: "Banane")
    ]

    var body: some View {
        List {
            ForEach(items) { item in
                Text(item.name)
            }
            .onDelete { indexSet in
                items.remove(atOffsets: indexSet)  // ← suppression native
            }
        }
        Button("Ajouter Cerise") {
            items.append(Item(name: "Cerise"))
        }
        .padding()
    }
}
```

**Différences clés :**

| Reef.js v13 | SwiftUI |
|-------------|---------|
| `id: Date.now()` | `let id = UUID()` (stable, unique) |
| `items.value.map()` | `ForEach(items)` |
| `.filter()` manuel | `.onDelete` natif |
| Event delegation `data-action` | Closures directes sur `Button` |

---

## Exercice 8.2 — Piège de paradigme

### Énoncé

Voici une liste avec un problème d'identifiants :

```swift
struct NumberList: View {
    @State private var numbers = [1, 2, 3, 4, 5]

    var body: some View {
        List {
            ForEach(numbers, id: \.self) { number in
                Text("\(number)")
            }
            .onDelete { indexSet in
                numbers.remove(atOffsets: indexSet)
            }
        }
        Button("Ajouter 3") {
            numbers.append(3)  // ← ajoute un doublon
        }
    }
}
```

Et ce deuxième cas :

```swift
struct TaskList: View {
    @State private var tasks = [
        Task(title: "Lire Swift"),
        Task(title: "Faire les exercices")
    ]

    var body: some View {
        List {
            ForEach(tasks.indices, id: \.self) { index in  // ← utilise l'index
                Text(tasks[index].title)
            }
            .onDelete { indexSet in
                tasks.remove(atOffsets: indexSet)
            }
        }
    }
}
```

**Questions :**
→ Quel est le problème avec `id: \.self` quand il y a des doublons ?
→ Pourquoi utiliser `indices` comme `id` est problématique lors d'une suppression ?
→ Quelle est la solution dans les deux cas ?

---

### Correction 8.2

**Problème 1 — `id: \.self` avec doublons :**

`id: \.self` utilise la valeur comme identifiant. Si deux éléments ont la même valeur (`3` apparaît deux fois), SwiftUI ne peut pas les distinguer. Les animations seront incorrectes et le comportement imprévisible.

```
❌ Ce que le cerveau fait :
   "id: \.self, c'est pratique pour les arrays simples"

✅ Comment ça fonctionne réellement :
   SwiftUI exige des IDs UNIQUES. id: \.self sur des valeurs non
   uniques produit des bugs visuels et comportementaux.
```

**Problème 2 — `indices` comme `id` :**

Après suppression de l'élément à l'index 0, tous les index se décalent. Ce qui était à l'index 1 est maintenant à l'index 0. SwiftUI pense que c'est un élément différent, créant des animations incorrectes et potentiellement des crashs.

**Solutions :**

```swift
// Pour des strings simples sans doublons possibles → wrapper dans un type Identifiable
struct NamedItem: Identifiable {
    let id = UUID()
    let value: Int
}

// Pour des modèles → Identifiable avec UUID
struct Task: Identifiable {
    let id = UUID()  // ← stable, unique, généré à la création
    var title: String
}

struct TaskList: View {
    @State private var tasks = [
        Task(title: "Lire Swift"),
        Task(title: "Faire les exercices")
    ]

    var body: some View {
        List {
            ForEach(tasks) { task in  // ← utilise Identifiable, pas indices
                Text(task.title)
            }
            .onDelete { indexSet in
                tasks.remove(atOffsets: indexSet)
            }
        }
    }
}
```

**Règle :**
- Toujours `Identifiable` avec `let id = UUID()` pour les modèles
- `id: \.self` uniquement pour des strings garanties uniques (rares)
- Jamais `indices` comme identifiant dans une liste éditable

---

## Exercice 8.3 — Mini cas réel

### Énoncé

Tu construis une app de courses. La liste doit :
- Afficher les articles avec leur quantité
- Permettre le swipe-to-delete sur chaque article
- Permettre de réordonner par drag & drop
- Afficher le nombre total d'articles en bas
- Avoir un bouton "Ajouter" qui ajoute un article générique

**Avant de coder :**
→ Quel type utilises-tu pour les articles ? Pourquoi `Identifiable` ?
→ Où vit l'état de la liste ?
→ Comment le total est-il calculé — état séparé ou dérivé ?

*Décris d'abord, code ensuite.*

---

### Correction 8.3

**Modèle mental :**

- `GroceryItem` avec `id = UUID()` (stable, Identifiable)
- Liste dans `@State` du parent
- Total = **propriété calculée** (dérivé, pas état séparé)

```swift
struct GroceryItem: Identifiable {
    let id = UUID()
    var name: String
    var quantity: Int
}

struct GroceryListView: View {
    @State private var items: [GroceryItem] = [
        GroceryItem(name: "Pommes", quantity: 6),
        GroceryItem(name: "Pain", quantity: 1),
        GroceryItem(name: "Fromage", quantity: 2)
    ]

    var totalCount: Int {
        items.reduce(0) { $0 + $1.quantity }  // ← dérivé, pas @State
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(items) { item in
                    HStack {
                        Text(item.name)
                        Spacer()
                        Text("×\(item.quantity)")
                            .foregroundStyle(.secondary)
                    }
                }
                .onDelete { indexSet in
                    items.remove(atOffsets: indexSet)
                }
                .onMove { from, to in
                    items.move(fromOffsets: from, toOffset: to)
                }
            }
            .navigationTitle("Courses")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    EditButton()
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        let n = items.count + 1
                        items.append(GroceryItem(name: "Article \(n)", quantity: 1))
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }

            // Pied de liste
            HStack {
                Text("Total")
                    .bold()
                Spacer()
                Text("\(totalCount) articles")
                    .foregroundStyle(.secondary)
            }
            .padding()
            .background(.regularMaterial)
        }
    }
}

#Preview {
    GroceryListView()
}
```

**Points clés :**
- `EditButton()` active le mode édition natif iOS (drag handles + delete buttons)
- `.onDelete` et `.onMove` s'appliquent au `ForEach`, pas au `List`
- `totalCount` est une computed property — recalculée automatiquement quand `items` change
- `ToolbarItem(placement:)` pour positionner les boutons dans la barre de navigation

**Erreurs classiques :**
- ❌ Stocker `totalCount` en `@State` séparé → risque d'incohérence avec `items`
- ❌ Appliquer `.onDelete` sur le `List` → ça s'applique sur `ForEach`
- ❌ `id: \.name` si des articles peuvent avoir le même nom
- ✅ `UUID` stable dans le modèle → performance et animations correctes
