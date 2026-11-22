# 14. Debug & Mental Tooling

## 14.1 Modèle mental central

**Debugger SwiftUI, c'est comprendre pourquoi le rendu est ce qu'il est — pas chercher un bug de DOM.**

La plupart des bugs SwiftUI viennent d'une mauvaise compréhension du flux d'état : trop de recompositions, état mal placé, side effects dans `body`. Le tooling de debug aide à visualiser ce qui se passe.

> *Analogie : si l'image projetée est mauvaise, tu n'agis pas sur l'écran. Tu vérifies la diapositive (état) et le projecteur (body).*

---

## 14.2 `#Preview` — prévisualisation moderne

### 14.2.1 Syntax Swift 6

```swift
#Preview {
    MyView()
}

// Avec paramètres
#Preview("Mode sombre") {
    MyView()
        .preferredColorScheme(.dark)
}

// Avec données
#Preview {
    let model = TaskModel()
    model.tasks = [TodoTask(title: "Test")]
    return TodoListView()
}
```

### 14.2.2 Prévisualiser des états spécifiques

```swift
#Preview("État chargement") {
    ProfileView(state: .loading)
}

#Preview("État erreur") {
    ProfileView(state: .failure("Réseau indisponible"))
}

#Preview("État succès") {
    let profile = UserProfile(name: "Benoit", bio: "Designer")
    ProfileView(state: .success(profile))
}
```

---

## 14.3 Cycles de recomposition — comprendre qui se recompose

### 14.3.1 Détecter les recompositions

La technique simple : ajouter un print dans `body` :

```swift
var body: some View {
    let _ = print("ProfileView recomposé") // ← détecte les recompositions
    VStack { ... }
}
```

### 14.3.2 Causes communes de recompositions excessives

| Cause | Symptôme | Solution |
|-------|----------|----------|
| État trop haut dans l'arbre | Tout l'arbre se recompose pour un changement local | Descendre l'état |
| `@Observable` avec trop de propriétés | Recomposition quand n'importe quelle propriété change | Modèles focalisés |
| `id: \.self` instable | Recréation totale de la liste | UUID stable |
| Closures recréées | Vues qui "clignotent" | `let` ou Equatable |

### 14.3.3 Outil Xcode — Swift UI Recomposition Inspector

Dans Xcode 26, l'inspecteur SwiftUI permet de visualiser quelles vues se recomposent. Active "Debug > SwiftUI View Hierarchy" ou utilise l'outil "Recomposition Highlighting" dans Instruments.

---

## 14.4 Debugging des recompositions

### 14.4.1 `_printChanges()` — iOS 15+

Pour voir pourquoi une View se recompose :

```swift
var body: some View {
    let _ = Self._printChanges()  // ← affiche quelle propriété a changé
    VStack { ... }
}
```

Output exemple :
```
ProfileView: _user changed.
ProfileView: @self changed.
```

### 14.4.2 Identifier les loops de state

Une boucle de state se produit quand un changement d'état déclenche une recomposition qui déclenche un autre changement d'état, etc. :

```swift
// ❌ Loop potentielle
var body: some View {
    Text("...")
        .onAppear {
            counter += 1  // modifie l'état
            // → recomposition → .onAppear → counter += 1 → ...
        }
}
```

**Solution :** vérifier que `.onAppear` ne modifie pas d'état qui déclenche une nouvelle apparition.

---

## 14.5 Inspection de performance UI

### 14.5.1 Instruments — SwiftUI profiling

Dans Xcode, Product > Profile > SwiftUI Instrument :
- "View Body Invocations" : combien de fois `body` est appelé
- "View Properties Updates" : quelles propriétés ont changé
- "Core Animation" : frames perdues

### 14.5.2 Signes d'une performance dégradée

- Scroll saccadé → trop de vues non lazy, `body` trop lourd
- Animations saccadées → calculs lourds dans `body` ou trop de recompositions
- Lenteur au démarrage → initialisation lourde dans `@State private var model = HeavyModel()`

---

## 14.6 Comprendre le diffing interne

### 14.6.1 SwiftUI ne compare pas les vues — il compare les descriptions

SwiftUI ne garde pas une "vieille version" de la View pour comparer. Il recalcule `body`, compare les descriptions, et met à jour uniquement ce qui a changé.

```
État change
    ↓
body() appelé → nouvelle description
    ↓
SwiftUI diff : ancienne description vs nouvelle
    ↓
Applique les changements minimaux au rendu natif
```

### 14.6.2 L'identité des vues

SwiftUI utilise l'**identité structurelle** (position dans l'arbre) et l'**identité explicite** (`id`) pour determiner si une vue est la "même" entre deux recompositions.

```swift
// Identité structurelle — la deuxième Vue est "la même" vue que la première
// si elle est au même endroit dans l'arbre
if condition {
    Text("A")  // ← toujours la même View si condition ne change que rarement
}

// Identité explicite — force une nouvelle identité
Text("A")
    .id(someValue)  // ← si someValue change, SwiftUI recrée la View entièrement
```

---

## 14.7 Isolation des effets secondaires

### 14.7.1 Bugs courants de side effects

```swift
// ❌ Side effect dans body — exécuté à chaque recomposition
var body: some View {
    analytics.track("view_rendered")  // ← appelé des dizaines de fois
    return Text("...")
}

// ❌ State modifié dans une computed property
var displayText: String {
    log.append("computed")  // ← side effect caché dans un dérivé
    return "Hello"
}
```

### 14.7.2 Règle de debug

Si un comportement est imprévisible ou répété, cherche des side effects dans :
1. `body` directement
2. Les computed properties utilisées dans `body`
3. Les initialiseurs de View (constructeurs)

---

## 14.8 Checklist de debugging SwiftUI

Quand quelque chose ne marche pas, vérifier dans cet ordre :

1. **L'état est-il dans le bon wrapper ?** (`@State` / `@Binding` / `@Observable`)
2. **Le wrapper est-il bien configuré ?** (`@State private` / `@Binding` avec `$`)
3. **Y a-t-il des side effects dans `body` ?**
4. **Les identifiants des listes sont-ils stables ?**
5. **Le modèle est-il sur `@MainActor` ?** (pour les mises à jour UI depuis async)
6. **Y a-t-il une boucle de state ?** (state change → recomposition → state change)

---

## 14.9 Comparaison debug JS vs SwiftUI

| Problème JS | Équivalent SwiftUI |
|------------|-------------------|
| "Mon event listener ne se déclenche pas" | "@State sans $ passé au composant" |
| "Ma variable change mais l'UI ne se met pas à jour" | "@State manquant, variable simple" |
| "Mon fetch tourne en boucle" | "Side effect dans body, ou .task sans garde" |
| "Mes éléments de liste clignottent" | "id: \.self instable ou id: index" |
| "console.log dans render = beaucoup de logs" | "print dans body = beaucoup de prints" |
| "Mutation accidentelle de state partagé" | "@State dans enfant au lieu de @Binding" |
