# 2. Système d'état — Exercices

---

## Exercice 2.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En Reef.js, voici un formulaire de préférences simple :

```js
// Reef.js v13
import { signal, component } from 'reef'

const username = signal('Benoit')
const darkMode = signal(false)

function PrefsApp() {
    return {
        template() {
            return `
                <p>Bonjour ${username.value}</p>
                <label>
                    <input type="checkbox" data-action="toggleDark"
                           ${darkMode.value ? 'checked' : ''}>
                    Mode sombre
                </label>
            `
        },
        events: {
            toggleDark() { darkMode.value = !darkMode.value }
        }
    }
}

component('#app', PrefsApp)
```

**Questions :**

→ Quels sont les états dans ce code Reef ?
→ Comment traduire ces deux `signal()` en SwiftUI ?
→ Quel wrapper choisirais-tu pour `username` et `darkMode` dans une View simple ?

*Tente de répondre avant de lire la correction.*

---

### Correction 2.1

**Modèle mental :**

Les deux `signal()` de Reef correspondent à des états locaux réactifs. En SwiftUI, la traduction directe est `@State`.

```swift
struct PrefsView: View {
    @State private var username = "Benoit"
    @State private var darkMode = false

    var body: some View {
        VStack(alignment: .leading) {
            Text("Bonjour \(username)")
            Toggle("Mode sombre", isOn: $darkMode)
        }
        .padding()
    }
}
```

**Correspondances :**

| Reef.js v13 | SwiftUI 6 |
|-------------|-----------|
| `signal('Benoit')` | `@State private var username = "Benoit"` |
| `signal(false)` | `@State private var darkMode = false` |
| `username.value` | `username` |
| `darkMode.value = !darkMode.value` | `darkMode.toggle()` |
| Re-render automatique | Recomposition automatique |

**Pièges courants :**
- ❌ Penser que `@State` nécessite `.value` comme Reef → non, tu accèdes directement à `username`
- ❌ Oublier `$darkMode` pour le `Toggle` → le `$` produit un `Binding<Bool>` requis par `Toggle`
- ✅ `Toggle` en SwiftUI prend un `Binding<Bool>` (`$darkMode`), pas une valeur

---

## Exercice 2.2 — Piège de paradigme

### Énoncé

Voici deux composants SwiftUI. Qu'est-ce qui ne va pas ?

```swift
// Vue parente
struct ParentView: View {
    @State private var score = 0

    var body: some View {
        ScoreDisplay(score: score)
        Button("Ajouter 10") { score += 10 }
    }
}

// Vue enfant — veut modifier le score
struct ScoreDisplay: View {
    var score: Int  // ← paramètre normal, pas @Binding

    var body: some View {
        Text("Score : \(score)")
        Button("Reset") {
            score = 0  // ← erreur de compilation
        }
    }
}
```

**Questions :**
→ Qu'est-ce qui ne va pas ici ?
→ Comment l'enfant peut-il modifier l'état du parent ?
→ Quelle est la différence conceptuelle entre passer `score` et `$score` ?

*Tente de répondre avant de lire la correction.*

---

### Correction 2.2

**Problème :**

`ScoreDisplay` reçoit `score` comme un `Int` — une **copie** de la valeur. En Swift, les structs passent par valeur. L'enfant ne peut pas modifier l'original. Et même s'il le pouvait, SwiftUI ne saurait pas recomposer le parent.

```
❌ Ce que le cerveau fait :
   "Je passe score à l'enfant, il peut le modifier"

✅ Comment ça fonctionne réellement :
   L'enfant reçoit une COPIE. Pour qu'il modifie l'état du parent,
   il faut un @Binding — une référence bidirectionnelle vers l'état.
```

**Code corrigé :**

```swift
struct ParentView: View {
    @State private var score = 0

    var body: some View {
        ScoreDisplay(score: $score)   // ← $ = Binding
        Button("Ajouter 10") { score += 10 }
    }
}

struct ScoreDisplay: View {
    @Binding var score: Int   // ← @Binding, pas simple Int

    var body: some View {
        Text("Score : \(score)")
        Button("Reset") {
            score = 0   // ← modifie l'état du parent via le Binding
        }
    }
}
```

**Règle à retenir :**
- Parent : `@State private var score = 0` (ownership)
- Passage : `ScoreDisplay(score: $score)` (le `$` produit un `Binding<Int>`)
- Enfant : `@Binding var score: Int` (référence bidirectionnelle)

**Pont Reef :**
> En Reef, un `signal()` est une référence partagée — n'importe quelle partie du code peut lire et écrire via `.value`. En SwiftUI, le `@Binding` joue ce rôle entre un parent et un enfant, mais avec une propriété explicite : le parent possède l'état, l'enfant y accède via liaison.

---

## Exercice 2.3 — Mini cas réel

### Énoncé

Tu construis une app de suivi de lecture. L'écran principal (`BookTracker`) affiche :
- Un titre "Mes lectures"
- Une liste de 3 livres (texte fixe pour l'instant)
- Pour chaque livre : un bouton "Lu" / "Non lu" qui toggle l'état

**Avant de coder, décris :**
→ Où vit l'état "lu/non lu" de chaque livre ?
→ Faut-il `@State`, `@Binding`, ou `@Observable` ici ?
→ Comment la vue d'un livre (child) peut-elle modifier son état ?

*Décris d'abord, code ensuite.*

---

### Correction 2.3

**Modèle mental :**

Chaque livre a son propre état `isRead: Bool`. Le plus simple est de gérer ça dans une View parent qui contient un tableau d'états.

Deux approches valables — voici la plus claire pour débuter :

**Approche 1 — `@State` + `@Binding` (recommandée pour ce cas simple)**

```swift
struct BookTracker: View {
    @State private var readStatus = [false, false, false]
    let books = ["Dune", "Foundation", "Neuromancer"]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Mes lectures")
                .font(.title)

            ForEach(books.indices, id: \.self) { i in
                BookRow(title: books[i], isRead: $readStatus[i])
            }
        }
        .padding()
    }
}

struct BookRow: View {
    let title: String
    @Binding var isRead: Bool

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Button(isRead ? "Lu ✓" : "Non lu") {
                isRead.toggle()
            }
            .foregroundStyle(isRead ? .green : .secondary)
        }
    }
}

#Preview {
    BookTracker()
}
```

**Points clés :**
- `@State private var readStatus` vit dans le parent — il possède les données
- `$readStatus[i]` — SwiftUI permet des bindings sur éléments de tableau
- `BookRow` reçoit `@Binding var isRead` — il peut modifier l'état parent
- Le titre du bouton change selon `isRead` — **rendu = projection de l'état**

**Approche 2 — `@Observable` (plus adaptée si les livres sont un vrai modèle)**

```swift
@Observable
class Book {
    let title: String
    var isRead = false
    init(title: String) { self.title = title }
}

struct BookTracker: View {
    @State private var books = [
        Book(title: "Dune"),
        Book(title: "Foundation"),
        Book(title: "Neuromancer")
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Mes lectures")
                .font(.title)

            ForEach(books) { book in
                BookRow(book: book)
            }
        }
        .padding()
    }
}

struct BookRow: View {
    var book: Book  // @Observable → pas besoin de @Binding

    var body: some View {
        HStack {
            Text(book.title)
            Spacer()
            Button(book.isRead ? "Lu ✓" : "Non lu") {
                book.isRead.toggle()
            }
            .foregroundStyle(book.isRead ? .green : .secondary)
        }
    }
}
```

*Note : `Book` doit aussi se conformer à `Identifiable` pour `ForEach`. En pratique, ajoute `var id = UUID()` dans la classe.*

**Erreurs classiques :**
- ❌ Mettre `@State` dans `BookRow` pour `isRead` — ça crée un état local déconnecté du modèle
- ❌ Passer `readStatus[i]` sans `$` → l'enfant reçoit une copie, ne peut pas modifier
- ✅ `@Binding` pour les types valeur simples, `@Observable` pour les modèles complexes
