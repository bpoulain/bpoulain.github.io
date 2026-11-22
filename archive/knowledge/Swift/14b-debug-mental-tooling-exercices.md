# 14. Debug & Mental Tooling — Exercices

---

## Exercice 14.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, voici du code de debug classique :

```js
// JS vanilla — debug
function render(state) {
    console.log('render appelé', state)  // debug du rendu
    document.querySelector('#count').textContent = state.count
    document.querySelector('#status').textContent = state.loading ? 'Chargement...' : 'Prêt'
}

// Vérifier combien de fois render est appelé
let renderCount = 0
const originalRender = render
function render(state) {
    renderCount++
    console.log(`render #${renderCount}`)
    originalRender(state)
}
```

**Questions :**

→ Quel est l'équivalent SwiftUI de `console.log('render appelé')` ?
→ Comment savoir combien de fois `body` est appelé ?
→ Comment détecter QUELLE propriété a provoqué la recomposition ?

*Tente de répondre avant de lire la correction.*

---

### Correction 14.1

**Équivalents de debug :**

```swift
struct DebugView: View {
    @State private var count = 0
    @State private var isLoading = false

    var body: some View {
        // Équivalent de console.log('render appelé')
        let _ = print("DebugView.body appelé — count: \(count)")

        // Équivalent de compter les renders
        let _ = Self._printChanges()  // ← affiche quelle propriété a changé

        VStack {
            Text("Count : \(count)")
            Text(isLoading ? "Chargement..." : "Prêt")
            Button("+1") { count += 1 }
        }
    }
}
```

**Output de `_printChanges()` :**
```
DebugView: _count changed.      ← après count += 1
DebugView: _isLoading changed.  ← après isLoading = true
```

**Règles :**
- `print(...)` dans `body` → log à chaque recomposition
- `Self._printChanges()` → identifie précisément quelle propriété a changé
- Les deux **doivent être supprimés avant mise en production**

---

## Exercice 14.2 — Piège de paradigme

### Énoncé

Voici 3 bugs courants. Identifie chaque problème et propose la correction.

**Bug 1 :**

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        Button("Count: \(count)") {
            count += 1
        }
        .onAppear {
            count = 0  // ← "reset au démarrage"
        }
    }
}
```

**Bug 2 :**

```swift
struct TimerView: View {
    @State private var seconds = 0

    var body: some View {
        Text("\(seconds)s")
            .onAppear {
                // Lance un timer infini
                Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                    seconds += 1  // ← erreur potentielle Swift 6
                }
            }
    }
}
```

**Bug 3 :**

```swift
struct SearchView: View {
    @State private var query = ""
    @State private var results: [String] = []

    var body: some View {
        TextField("Recherche", text: $query)
            .task(id: query) {
                results = await performSearch(query)
                // performSearch prend 2s — l'utilisateur tape vite
            }
    }
}
```

**Questions :**
→ Bug 1 : Pourquoi `.onAppear` reset le count à chaque fois ?
→ Bug 2 : Quels sont les 2 problèmes de ce timer ?
→ Bug 3 : Que se passe-t-il si l'utilisateur tape vite ("s", "sw", "swi", "swif", "swift") ?

---

### Correction 14.2

**Bug 1 — `.onAppear` inopportun :**

`.onAppear` s'exécute **chaque fois** que la vue apparaît à l'écran. Si l'utilisateur navigue vers une autre vue puis revient, le count sera resetté.

```
Problème : .onAppear n'est pas "au montage initial" — c'est "à chaque apparition"
```

```swift
// ✅ Correction : utiliser .task {} une seule fois, ou initialiser directement
@State private var count = 0  // ← initialisé à 0, pas besoin de .onAppear
```

**Bug 2 — Timer non géré :**

1. **Thread safety** : `seconds += 1` dans le callback du timer s'exécute sur le background thread. En Swift 6, modifier un `@State` hors du MainActor est une erreur.
2. **Fuite mémoire / double timer** : si la View disparaît et réapparaît, un nouveau timer est créé sans annuler l'ancien.

```swift
// ✅ Correction — utiliser .task avec sleep
struct TimerView: View {
    @State private var seconds = 0

    var body: some View {
        Text("\(seconds)s")
            .task {
                while true {
                    try? await Task.sleep(for: .seconds(1))
                    seconds += 1  // ← sur @MainActor par défaut dans .task
                }
                // .task est annulé automatiquement quand la View disparaît
            }
    }
}
```

**Bug 3 — Résultats désynchronisés :**

`.task(id: query)` annule la tâche précédente et en lance une nouvelle à chaque changement de `query`. Si l'utilisateur tape "swift" en 0.5s, 5 tâches sont lancées, mais les 4 premières sont annulées avant d'avoir fini. La 5ème réussit → `results` = résultats pour "swift". Correct !

```
Ce n'est PAS un bug — c'est le comportement voulu.
.task(id:) gère l'annulation automatiquement.
```

L'unique précaution : si `performSearch` ne vérifie pas la cancellation (`Task.checkCancellation()`), une tâche annulée peut quand même écrire dans `results` si elle finit juste avant l'annulation.

```swift
// ✅ Protection
func performSearch(_ query: String) async throws -> [String] {
    try await Task.sleep(for: .seconds(2))
    try Task.checkCancellation()  // ← ne retourne pas si annulé
    return ["Swift", "SwiftUI"]
}
```

---

## Exercice 14.3 — Mini cas réel

### Énoncé

Tu debugges une app avec ces symptômes :

1. La liste de tâches "clignote" quand on ajoute une tâche
2. Le spinner de chargement s'affiche deux fois à chaque navigation
3. Le compteur de la barre de navigation semble avoir un cycle de retard

**Questions :**
→ Symptôme 1 : Quelle est la cause probable ? Comment la diagnostiquer ?
→ Symptôme 2 : Quelle est la cause probable ? Comment la corriger ?
→ Symptôme 3 : Quelle est la cause probable ? Comment la corriger ?

---

### Correction 14.3

**Symptôme 1 — liste qui clignote :**

**Cause probable :** identifiants instables dans `ForEach`.

**Diagnostic :**

```swift
ForEach(tasks, id: \.id) { task in   // ← vérifier que id est stable
    TaskRow(task: task)
}
```

Si les IDs sont recalculés (ex: `id: UUID()` dans une computed property), SwiftUI pense que tous les éléments sont nouveaux → recréation totale → animation de remplacement visible.

```swift
// ❌ UUID recréé à chaque recomposition
var processedTasks: [Task] {
    rawTasks.map { Task(id: UUID(), title: $0.title) }  // ← nouveau UUID à chaque fois
}

// ✅ UUID stable dans le modèle
struct Task: Identifiable {
    let id = UUID()  // ← généré à la création, stable
    var title: String
}
```

**Symptôme 2 — spinner double à la navigation :**

**Cause probable :** deux `.onAppear` ou `.task {}` déclenchés lors de la navigation. Avec `NavigationStack`, une vue peut apparaître deux fois brièvement lors d'une transition.

**Diagnostic :** ajouter `print("task lancé")` dans `.task {}`. Si c'est affiché deux fois, la vue est montée deux fois.

**Correction :**

```swift
.task {
    guard data == nil else { return }  // ← garde contre le double déclenchement
    data = await fetchData()
}
```

**Symptôme 3 — compteur avec cycle de retard :**

**Cause probable :** le compteur est stocké dans un état séparé de la source de vérité (état dupliqué désynchronisé).

```swift
// ❌ État dupliqué → toujours un cycle de retard
@State private var count = 0
@State private var tasks: [Task] = []

Button("Ajouter") {
    tasks.append(newTask)
    count = tasks.count  // ← mis à jour APRÈS, visible au prochain rendu
}

// ✅ Dérivé — toujours synchrone
var count: Int { tasks.count }  // ← calculé au moment du rendu, jamais en retard
```

**Checklist de résolution :**

```
Bug de liste (clignotement) → vérifier les IDs (Identifiable, UUID stable)
Double side effect → guard dans .task, .onAppear une seule fois
Valeur en retard → remplacer l'état dupliqué par une computed property
UI ne se met pas à jour → @State manquant, ou modèle sans @Observable
Crash async → @MainActor manquant sur le modèle
```

**Outil final — prévisualiser tous les états problématiques :**

```swift
#Preview("Liste vide") { TaskListView(tasks: []) }
#Preview("Liste longue") { TaskListView(tasks: Array(repeating: Task(title: "Test"), count: 100)) }
#Preview("Chargement") { TaskListView(isLoading: true, tasks: []) }
#Preview("Erreur") { TaskListView(error: "Réseau indisponible", tasks: []) }
```

Les previews multiples permettent de tester chaque état sans lancer l'app — un gain de temps considérable pour identifier la source d'un bug visuel.
