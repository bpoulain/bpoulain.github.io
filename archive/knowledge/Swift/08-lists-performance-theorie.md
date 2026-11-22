# 8. Lists & Performance

## 8.1 Modèle mental central

**SwiftUI identifie chaque élément par son `id` pour décider quoi recréer, déplacer ou détruire.**

La stabilité des identifiants est la clé de la performance des listes. Un `id` stable → SwiftUI réutilise les vues existantes. Un `id` instable (ex: index, UUID généré à chaque fois) → SwiftUI détruit et recrée toutes les vues à chaque changement.

> *Analogie : pense à une salle de classe avec des étiquettes sur les tables. SwiftUI utilise les étiquettes pour savoir quelle table déplacer. Si tu changes les étiquettes à chaque réorganisation, il ne sait plus rien réutiliser.*

---

## 8.2 `List` — liste native

### 8.2.1 Structure de base

`List` est la vue native pour afficher des collections scrollables avec des styles iOS natifs :

```swift
struct TaskListView: View {
    let tasks = ["Lire Swift", "Faire les exercices", "Construire une app"]

    var body: some View {
        List(tasks, id: \.self) { task in
            Text(task)
        }
    }
}
```

### 8.2.2 `List` avec `Identifiable`

La façon recommandée : conformer le modèle à `Identifiable` (fournit automatiquement `id`) :

```swift
struct Task: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool
}

struct TaskListView: View {
    let tasks: [Task]

    var body: some View {
        List(tasks) { task in  // ← pas besoin de id: \.id, Identifiable suffit
            HStack {
                Image(systemName: task.isDone ? "checkmark.circle" : "circle")
                Text(task.title)
            }
        }
    }
}
```

### 8.2.3 Styles de List

```swift
List { ... }
    .listStyle(.plain)          // ← pas de fond séparé
    .listStyle(.insetGrouped)   // ← sections avec fond arrondi (iOS par défaut)
    .listStyle(.sidebar)        // ← sidebar macOS / iPad
```

---

## 8.3 `ForEach` — itération dans un conteneur

`ForEach` itère dans un conteneur existant (pas scrollable seul) :

```swift
struct TagListView: View {
    let tags = ["Swift", "Design", "iOS"]

    var body: some View {
        VStack {
            ForEach(tags, id: \.self) { tag in
                Text(tag)
                    .padding(.horizontal, 8)
                    .background(.blue.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}
```

**Différence `List` vs `ForEach` :**

| `List` | `ForEach` |
|--------|-----------|
| Scrollable | Pas scrollable seul |
| Style natif iOS (séparateurs, swipe, etc.) | Neutre — dans tout conteneur |
| Virtualisé automatiquement | Pas toujours virtualisé |
| Pour les grandes collections | Pour les petites collections |

---

## 8.4 Identité et stabilité des vues

### 8.4.1 `id:` et `Identifiable`

SwiftUI utilise l'`id` pour tracker l'identité de chaque élément entre les recompositions :

```swift
// ❌ Mauvais — UUID() généré à chaque recomposition
ForEach(items) { item in
    ItemRow(id: UUID(), ...)  // UUID différent à chaque fois → SwiftUI recrée tout
}

// ✅ Bon — ID stable dans le modèle
struct Item: Identifiable {
    let id = UUID()  // ← généré une fois à la création
    var name: String
}
```

### 8.4.2 Pourquoi `id: \.self` est fragile

```swift
ForEach(strings, id: \.self) { str in ... }
```

`id: \.self` utilise la valeur elle-même comme identifiant. Si deux éléments ont la même valeur, SwiftUI les confond. Préfère `Identifiable` avec un `UUID` stable.

---

## 8.5 Diffing automatique

SwiftUI compare automatiquement les anciennes et nouvelles listes pour déterminer :
- Quels éléments ont été **ajoutés** → crée de nouvelles vues
- Quels éléments ont été **supprimés** → détruit les vues existantes
- Quels éléments ont été **déplacés** → déplace les vues (animations)
- Quels éléments ont **changé** → recompose leurs vues

Ce mécanisme est possible grâce aux identifiants stables.

---

## 8.6 Virtualisation implicite

`List` et `LazyVStack` sont **paresseux** (lazy) — ils ne créent que les vues visibles à l'écran, plus quelques vues en tampon.

```swift
// List — virtualisation automatique
List(largeCollection) { item in
    ItemRow(item: item)
    // Seuls les items visibles sont instanciés
}

// ScrollView + LazyVStack — virtualisation explicite
ScrollView {
    LazyVStack {
        ForEach(largeCollection) { item in
            ItemRow(item: item)
        }
    }
}
```

**`VStack` vs `LazyVStack` :**

| `VStack` | `LazyVStack` |
|----------|--------------|
| Crée toutes les vues immédiatement | Crée les vues à la demande |
| OK pour petites collections (< 50 items) | Recommandé pour grandes collections |
| Meilleur pour les layouts fixes | Dans `ScrollView` |

---

## 8.7 Suppression et déplacement natifs

`List` supporte nativement le swipe-to-delete et le drag-to-reorder via `.onDelete` et `.onMove` :

```swift
struct EditableList: View {
    @State private var items = ["Pomme", "Banane", "Cerise"]

    var body: some View {
        List {
            ForEach(items, id: \.self) { item in
                Text(item)
            }
            .onDelete { indexSet in
                items.remove(atOffsets: indexSet)
            }
            .onMove { from, to in
                items.move(fromOffsets: from, toOffset: to)
            }
        }
        .toolbar {
            EditButton()  // ← active le mode édition iOS natif
        }
    }
}
```

---

## 8.8 Performance et identifiants

### 8.8.1 Règle de performance

- `id` = **stable** + **unique** → performance optimale
- `id` = index → problèmes si insertion/suppression au milieu
- `id: \.self` sur un type valeur sans unicité garantie → risques de confusion

### 8.8.2 `equatable` pour éviter les recompositions inutiles

SwiftUI recompose une vue dès que ses inputs changent. Si le modèle est `Equatable`, SwiftUI peut vérifier si la valeur a vraiment changé avant de recomposer :

```swift
struct ItemRow: View, Equatable {
    let item: Item  // Item doit être Equatable

    var body: some View {
        Text(item.name)
    }

    static func == (lhs: ItemRow, rhs: ItemRow) -> Bool {
        lhs.item.id == rhs.item.id && lhs.item.name == rhs.item.name
    }
}
```

---

## 8.9 Comparaison paradigmes

| Concept | JS / Reef | SwiftUI |
|---------|-----------|---------|
| Liste dynamique | `map()` dans template | `ForEach` ou `List` |
| Identifiant | `key` (optionnel en Reef) | `id` (requis) ou `Identifiable` |
| Virtualisation | Bibliothèque externe | Native dans `List` / `LazyVStack` |
| Suppression | Manipulation du DOM | `.onDelete` natif |
| Réordonnancement | Drag & Drop manuel | `.onMove` natif |
| Diffing | Reef fait le DOM diff | SwiftUI diff via identifiants |
