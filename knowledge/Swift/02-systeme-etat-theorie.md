# 2. Système d'état — State System

## 2.1 Modèle mental central

**Le state system est le moteur de réactivité de SwiftUI.**

Toute modification de l'interface passe par une modification d'état. SwiftUI observe automatiquement cet état et recompose uniquement les vues concernées.

> *Analogie : l'état est comme un tableau de bord. Les jauges (UI) reflètent toujours les valeurs du tableau de bord (état). Quand une valeur change, la jauge correspondante se met à jour — automatiquement, sans que tu aies à "pousser" la mise à jour.*

---

## 2.2 Vue d'ensemble des outils d'état

SwiftUI 6 / iOS 26 dispose de plusieurs outils selon le périmètre et la nature de l'état :

| Outil | Portée | Usage principal | iOS min |
|-------|--------|-----------------|---------|
| `@State` | Locale à la View | Données UI simples | iOS 13 |
| `@Binding` | Partagée entre parent/enfant | Liaison bidirectionnelle | iOS 13 |
| `@Observable` | Modèle externe partagé | Architecture moderne | iOS 17+ |
| `@StateObject` | Modèle externe (ownership) | Ancien modèle | iOS 14 |
| `@ObservedObject` | Modèle externe (référence) | Ancien modèle | iOS 13 |
| `@EnvironmentObject` | Injection globale | Ancien modèle | iOS 13 |
| `@Environment` | Valeurs système / personnalisées | Contexte global | iOS 13 |

> *En iOS 26, le modèle recommandé est `@Observable` + `@State`/`@Binding`. Les anciens patterns (`@StateObject`, `@ObservedObject`, `@EnvironmentObject`) sont toujours présents dans le code existant — tu les rencontreras, mais tu éviteras de les écrire.*

---

## 2.3 `@State` — état local

### 2.3.1 Définition

`@State` est le wrapper de propriété pour l'**état local** d'une View. Il signale à SwiftUI que cette valeur doit être observée, et que tout changement doit déclencher une recomposition.

```swift
struct CounterView: View {
    @State private var count = 0  // ← état local

    var body: some View {
        VStack {
            Text("\(count)")
            Button("+1") { count += 1 }
        }
    }
}
```

### 2.3.2 Propriétés clés

- **Propriété de la View** : `@State` vit dans la View, pas dans un modèle externe
- **Persistance entre recompositions** : SwiftUI conserve la valeur même si la struct View est recréée
- **Toujours `private`** : l'état local ne doit pas être exposé à l'extérieur
- **Types valeur** : `Bool`, `Int`, `String`, `Double`, structs simples

### 2.3.3 Analogie Reef

```js
// Reef.js v13 — signal() pour état local
import { signal, component } from 'reef'

const count = signal(0)

function App() {
    return {
        template() {
            return `<p>${count.value}</p>
                    <button data-action="inc">+1</button>`
        },
        events: {
            inc() { count.value++ }
        }
    }
}
component('#app', App)
```

| Reef.js v13 | SwiftUI 6 |
|-------------|-----------|
| `signal(0)` | `@State var count = 0` |
| `count.value` | `count` (lecture directe) |
| `count.value++` | `count += 1` |
| Re-render automatique après `.value` | Recomposition automatique après `@State` |

---

## 2.4 `@Binding` — liaison bidirectionnelle

### 2.4.1 Définition

`@Binding` crée une **référence bidirectionnelle** vers un état qui appartient à une autre View. L'enfant peut lire ET modifier l'état du parent.

```swift
// Vue parente — possède l'état
struct ParentView: View {
    @State private var isOn = false

    var body: some View {
        ToggleRow(isOn: $isOn)  // ← $ = passe un Binding, pas la valeur
    }
}

// Vue enfant — reçoit un Binding
struct ToggleRow: View {
    @Binding var isOn: Bool  // ← ne possède pas l'état

    var body: some View {
        Toggle("Activer", isOn: $isOn)
    }
}
```

### 2.4.2 Le préfixe `$`

Le `$` devant une propriété `@State` produit un `Binding<T>` — une référence vers l'état, pas sa valeur.

```
isOn      → Bool (la valeur)
$isOn     → Binding<Bool> (référence vers l'état)
```

### 2.4.3 Règle de propriété

- Le **parent** possède l'état (`@State`)
- L'**enfant** reçoit une liaison (`@Binding`)
- Si l'enfant modifie `isOn`, le parent voit le changement — et vice versa

---

## 2.5 `@Observable` — modèle moderne (iOS 17+ / iOS 26)

### 2.5.1 Définition

`@Observable` (macro Swift) est le système recommandé en iOS 26 pour les **modèles de données partagés**. Il permet de rendre une classe observable par SwiftUI sans boilerplate.

```swift
// Modèle observable
@Observable
class UserSettings {
    var username = "Benoit"
    var isDarkMode = false
}

// Vue qui l'utilise
struct SettingsView: View {
    var settings: UserSettings  // ← pas de @StateObject ni @ObservedObject

    var body: some View {
        Toggle("Mode sombre", isOn: $settings.isDarkMode)
        Text("Bonjour \(settings.username)")
    }
}
```

### 2.5.2 Comment ça fonctionne

Avec `@Observable`, SwiftUI détecte automatiquement quelles propriétés tu utilises dans `body`, et ne recompose la vue que si *ces* propriétés changent. C'est une granularité fine automatique.

### 2.5.3 `@State` + `@Observable` ensemble

Pour créer une instance observable **dans** une View (avec ownership) :

```swift
struct AppRoot: View {
    @State private var settings = UserSettings()  // ← @State pour ownership

    var body: some View {
        SettingsView(settings: settings)
    }
}
```

### 2.5.4 `@Bindable` pour les propriétés observables

Quand tu veux passer un `Binding` vers une propriété d'un `@Observable`, utilise `@Bindable` :

```swift
struct SettingsView: View {
    @Bindable var settings: UserSettings  // ← @Bindable pour créer des $bindings

    var body: some View {
        Toggle("Mode sombre", isOn: $settings.isDarkMode)  // ← $ fonctionne ici
    }
}
```

---

## 2.6 Anciens patterns — ce que tu rencontreras

### 2.6.1 `@StateObject` / `@ObservedObject` (iOS 14–16)

Avant `@Observable`, les classes devaient se conformer au protocole `ObservableObject` et marquer leurs propriétés avec `@Published` :

```swift
// ❗ Ancien modèle — iOS 14–16 — encore très présent dans la communauté
class UserSettings: ObservableObject {
    @Published var username = "Benoit"
    @Published var isDarkMode = false
}

struct SettingsView: View {
    @StateObject private var settings = UserSettings()  // ownership
    // ou @ObservedObject var settings: UserSettings    // référence externe
    ...
}
```

**À retenir** :
- `@StateObject` = ownership (la View crée et conserve l'objet)
- `@ObservedObject` = référence (l'objet vient de l'extérieur)
- En iOS 26, préfère `@Observable` + `@State`

### 2.6.2 `@EnvironmentObject` (iOS 13–16)

Injection d'un `ObservableObject` dans tout l'arbre de vues sans le passer explicitement :

```swift
// ❗ Ancien modèle — encore présent dans le code iOS 15–16
struct ContentView: View {
    @EnvironmentObject var settings: UserSettings
    ...
}
```

En iOS 26, `@Environment` avec un `@Observable` remplace ce pattern.

---

## 2.7 Granularité du state

### 2.7.1 État local vs partagé

| Cas | Outil recommandé |
|-----|-----------------|
| Donnée UI simple dans une View | `@State` |
| Donnée partagée entre parent et enfant | `@State` + `@Binding` |
| Modèle partagé dans plusieurs Views | `@Observable` + `@State` |
| Valeur système (colorScheme, locale...) | `@Environment` |

### 2.7.2 Règle de placement

> **Place l'état au niveau le plus bas possible qui permette d'y accéder.**

Si seule une View a besoin d'un état, il va dans cette View. Si deux Views en ont besoin, il monte dans leur ancêtre commun.

---

## 2.8 Dépendances implicites état → UI

SwiftUI suit automatiquement quelles propriétés d'état sont utilisées dans `body`. Il ne recompose que les vues concernées.

```swift
@Observable
class AppState {
    var count = 0
    var name = "Benoit"
}

struct CountView: View {
    var state: AppState
    var body: some View {
        Text("\(state.count)")
        // Cette vue ne se recompose QUE si state.count change
        // state.name change → cette vue n'est PAS recomposée
    }
}
```

---

## 2.9 Déclenchement de recomposition — récapitulatif

| Cause | Effet |
|-------|-------|
| `@State` modifié | Recomposition de la View propriétaire |
| `@Binding` modifié (depuis enfant) | Recomposition du parent (qui possède `@State`) |
| Propriété `@Observable` utilisée dans `body` modifiée | Recomposition de cette View |
| `@Environment` modifié | Recomposition des Views qui le lisent |

**Aucune action manuelle n'est requise.** Contrairement à Reef où tu dois modifier `signal.value` explicitement, en SwiftUI toute modification d'un état wrappé déclenche automatiquement la recomposition.
