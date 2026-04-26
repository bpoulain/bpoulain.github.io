# 3. Composition des Views

## 3.1 Modèle mental central

**Une View SwiftUI est une description de ce qui doit apparaître, pas un objet persistant.**

Les Views sont des structs (types valeur). SwiftUI les crée, les compare, et les jette — elles ne "vivent" pas entre les recompositions. La composition consiste à imbriquer des descriptions, pas à assembler des objets.

> *Analogie : les Views sont comme des recettes de cuisine. Tu décris ce que tu veux. SwiftUI cuisine le résultat. Tu ne gardes pas le plat — tu gardes la recette.*

---

## 3.2 `struct View` — valeur, pas instance

### 3.2.1 Une View est un type valeur

En SwiftUI, toutes les vues conforment au protocole `View` via une `struct` :

```swift
struct MyView: View {
    var body: some View {
        Text("Bonjour")
    }
}
```

Une `struct` en Swift est un **type valeur** — elle est copiée, pas référencée. SwiftUI peut créer et détruire des instances de `MyView` à chaque recomposition sans conséquence.

### 3.2.2 Pourquoi les Views sont jetables

Ce modèle est fondamental : puisqu'une View est une pure description, SwiftUI peut la recréer à tout moment. Il n'y a pas d'objet UI "quelque part en mémoire" qu'on garde en vie. L'identité d'une vue est gérée par SwiftUI, pas par la struct elle-même.

```
❌ Modèle DOM : un nœud `<div>` existe en mémoire, tu le modifies
✅ Modèle SwiftUI : une View décrit ce qui doit exister, SwiftUI décide quoi créer/détruire
```

---

## 3.3 `some View` — type de retour opaque

### 3.3.1 Définition

`some View` est un **type de retour opaque**. Il dit : "je retourne quelque chose qui est une View, mais tu n'as pas besoin de savoir exactement lequel."

```swift
var body: some View {
    Text("Bonjour")
}
```

### 3.3.2 Pourquoi pas `View` directement ?

Le protocole `View` en Swift a un `associatedType` (`Body`), ce qui l'empêche d'être utilisé directement comme type. `some View` contourne cette contrainte en laissant Swift inférer le type concret à la compilation.

### 3.3.3 Conséquence pratique

`body` ne peut retourner **qu'une seule View racine**. Pour retourner plusieurs vues côte à côte, tu utilises un conteneur (`VStack`, `HStack`, `Group`) ou le `@ViewBuilder` implicite.

---

## 3.4 Composition hiérarchique

### 3.4.1 Le principe

En SwiftUI, l'UI est construite par **imbrication de descriptions** :

```swift
struct ProfileCard: View {
    var body: some View {
        VStack(alignment: .leading) {
            AvatarView(name: "BP")
            NameLabel(name: "Benoit Poulain")
            TagList(tags: ["Design", "Swift"])
        }
        .padding()
    }
}
```

Chaque sous-composant (`AvatarView`, `NameLabel`, `TagList`) est une `struct View` indépendante. La hiérarchie est une arborescence de descriptions.

### 3.4.2 Comparaison avec Reef

```js
// Reef.js v13 — composition via fonctions retournant des strings HTML
function AvatarView(name) {
    return `<div class="avatar">${name[0]}</div>`
}

function ProfileCard() {
    return {
        template() {
            return `
                <div class="card">
                    ${AvatarView("BP")}
                </div>
            `
        }
    }
}
```

| Reef.js v13 | SwiftUI 6 |
|-------------|-----------|
| Fonction retournant string HTML | `struct View` avec `body` |
| Composition par interpolation | Composition par imbrication |
| DOM produit au runtime | Description compilée statiquement |
| `component('#app', App)` | `@main` + `WindowGroup` |

---

## 3.5 Extraction de sous-vues

### 3.5.1 Quand extraire

Extraire une sous-vue est un **refactoring purement visuel/organisationnel** — pas d'impact sur les performances ou le comportement. Il faut extraire quand :
- Un bloc `body` devient difficile à lire
- Un composant est réutilisé à plusieurs endroits
- Un concept mérite son propre nom

### 3.5.2 Comment extraire

```swift
// Avant extraction
struct ProductView: View {
    var body: some View {
        VStack {
            HStack {
                Image(systemName: "star.fill")
                    .foregroundStyle(.yellow)
                Text("4.5")
                    .bold()
            }
            Text("Très bon produit")
        }
    }
}

// Après extraction
struct ProductView: View {
    var body: some View {
        VStack {
            RatingBadge(rating: 4.5)
            Text("Très bon produit")
        }
    }
}

struct RatingBadge: View {
    let rating: Double

    var body: some View {
        HStack {
            Image(systemName: "star.fill")
                .foregroundStyle(.yellow)
            Text(String(format: "%.1f", rating))
                .bold()
        }
    }
}
```

### 3.5.3 Les paramètres des sous-vues

Les données passées à une sous-vue sont des **paramètres de la struct** :
- `let` pour les données en lecture seule (passées depuis le parent)
- `@Binding` si l'enfant doit pouvoir les modifier
- `@State` si l'état est local à la sous-vue

---

## 3.6 Computed properties pour découper le body

Une alternative à l'extraction de sous-vues est d'utiliser des **computed properties** :

```swift
struct DashboardView: View {
    @State private var isExpanded = false

    var body: some View {
        VStack {
            headerSection
            if isExpanded { detailSection }
        }
    }

    private var headerSection: some View {
        HStack {
            Text("Dashboard")
                .font(.title)
            Spacer()
            Button(isExpanded ? "Réduire" : "Voir plus") {
                isExpanded.toggle()
            }
        }
        .padding()
    }

    private var detailSection: some View {
        Text("Contenu détaillé ici")
            .padding()
    }
}
```

**Quand utiliser des computed properties plutôt que des sous-vues :**
- Le composant ne sera pas réutilisé ailleurs
- Il n'a pas besoin de paramètres propres
- C'est uniquement pour améliorer la lisibilité du `body`

---

## 3.7 Réutilisation par composition, pas héritage

En SwiftUI, il n'y a **pas d'héritage de vues**. Tu ne "extends" pas une View existante.

La réutilisation passe par :
1. **Composition** : imbriquer des vues dans d'autres vues
2. **Modificateurs** : `.padding()`, `.foregroundStyle()`, etc.
3. **Paramètres** : configurer une vue via ses propriétés

```swift
// ❌ Il n'existe pas en SwiftUI :
// struct MyButton: Button { ... }

// ✅ Composition :
struct PrimaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(title, action: action)
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
    }
}
```

---

## 3.8 Views jetables — implications pratiques

### 3.8.1 Ne pas stocker d'état dans une View sans `@State`

Puisque les Views sont recréées à chaque recomposition, une variable normale sera réinitialisée :

```swift
struct BadView: View {
    var tempValue = 42  // recréée à chaque recomposition — instable

    var body: some View {
        Text("\(tempValue)")
    }
}
```

### 3.8.2 `@State` survit aux recompositions

SwiftUI conserve la valeur `@State` même quand il recrée la struct View. C'est le seul moyen de maintenir de l'état entre recompositions dans une View.

```swift
struct GoodView: View {
    @State private var count = 0  // survit aux recompositions

    var body: some View {
        Button("\(count)") { count += 1 }
    }
}
```

---

## 3.9 Récapitulatif

| Concept | Description |
|---------|-------------|
| `struct View` | Type valeur, jetable, recréé à chaque recomposition |
| `some View` | Type de retour opaque — une seule View racine |
| Composition | Imbrication de descriptions, pas d'héritage |
| Extraction | Refactoring organisationnel — aucun impact comportemental |
| Computed property | Alternative légère à la sous-vue si pas de réutilisation |
| `@State` | Survit aux recompositions — seul état stable dans une View |
