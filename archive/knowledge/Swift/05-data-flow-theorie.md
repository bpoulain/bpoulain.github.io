# 5. Data Flow — Flux de données

## 5.1 Modèle mental central

**Les données circulent du haut vers le bas. Jamais du bas vers le haut sans mécanisme explicite.**

SwiftUI impose une direction de flux : les données descendent dans l'arbre de vues via des paramètres ou des `@Binding`. Remonter une information vers un parent nécessite un `@Binding` ou un modèle partagé (`@Observable`). Il n'y a pas de communication latérale directe entre vues.

> *Analogie : un arbre d'eau où l'eau descend naturellement. Pour remonter de l'eau, tu as besoin d'un tuyau explicite (`@Binding`) ou d'un réservoir commun (`@Observable`).*

---

## 5.2 Propagation top-down

### 5.2.1 Principe

Les données passent du parent vers l'enfant via les **paramètres de la View** :

```swift
struct ParentView: View {
    @State private var userName = "Benoit"

    var body: some View {
        ChildView(name: userName)  // ← descend
    }
}

struct ChildView: View {
    let name: String  // ← reçoit la valeur

    var body: some View {
        Text("Bonjour \(name)")
    }
}
```

### 5.2.2 Source de vérité unique

Chaque donnée doit avoir **une seule source de vérité**. Si plusieurs vues affichent la même donnée, elles doivent toutes la lire depuis la même source (l'état parent, un modèle observable partagé).

```
❌ Mauvais : dupliquer l'état dans chaque View
✅ Bon : une seule source, partagée par propagation ou @Observable
```

---

## 5.3 `@Environment` — contexte global injecté

### 5.3.1 Définition

`@Environment` permet de lire des **valeurs injectées dans l'arbre de vues** sans les passer explicitement de parent en enfant. C'est une injection de dépendances implicite.

```swift
struct MyView: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.locale) private var locale

    var body: some View {
        Text(colorScheme == .dark ? "Mode sombre" : "Mode clair")
    }
}
```

### 5.3.2 Valeurs `@Environment` courantes

| Clé | Type | Description |
|-----|------|-------------|
| `\.colorScheme` | `ColorScheme` | `.dark` / `.light` |
| `\.locale` | `Locale` | Locale de l'appareil |
| `\.font` | `Font?` | Police héritée |
| `\.dismiss` | `DismissAction` | Ferme la vue courante |
| `\.openURL` | `OpenURLAction` | Ouvre une URL |

### 5.3.3 Injecter une valeur dans l'environnement

```swift
struct AppRoot: View {
    var body: some View {
        ContentView()
            .environment(\.locale, Locale(identifier: "fr_FR"))
    }
}
```

---

## 5.4 `@Observable` dans le data flow (iOS 26)

### 5.4.1 Modèle partagé descendant

Un modèle `@Observable` peut être passé directement en paramètre, sans `@Binding` :

```swift
@Observable
class AppModel {
    var theme = "light"
    var userName = "Benoit"
}

struct RootView: View {
    @State private var model = AppModel()

    var body: some View {
        ProfileView(model: model)
        SettingsView(model: model)
    }
}
```

Quand `model.theme` change, toutes les vues qui lisent cette propriété sont recomposées automatiquement.

### 5.4.2 `@Environment` avec `@Observable` (iOS 26)

Pour partager un modèle global sans le passer explicitement à travers chaque couche :

```swift
// Injection dans l'environnement
struct AppRoot: View {
    @State private var model = AppModel()

    var body: some View {
        ContentView()
            .environment(model)  // ← injecte l'objet @Observable
    }
}

// Lecture n'importe où dans l'arbre
struct DeepChildView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        Text(model.userName)
    }
}
```

---

## 5.5 `@Bindable` — Bindings depuis un `@Observable`

Pour créer des `$binding` depuis un objet `@Observable` reçu en paramètre :

```swift
struct SettingsView: View {
    @Bindable var model: AppModel  // ← @Bindable pour produire des $

    var body: some View {
        TextField("Nom", text: $model.userName)  // ← $ fonctionne sur @Bindable
        Toggle("Mode sombre", isOn: Binding(
            get: { model.theme == "dark" },
            set: { model.theme = $0 ? "dark" : "light" }
        ))
    }
}
```

---

## 5.6 Hiérarchie de responsabilité du state

### 5.6.1 Règle de placement

| Portée de l'état | Où le placer |
|-----------------|--------------|
| Une seule View | `@State` local dans cette View |
| Parent + un enfant | `@State` dans le parent, `@Binding` pour l'enfant |
| Plusieurs Views distantes | `@Observable` + `@State` dans l'ancêtre commun |
| Tout l'arbre de l'app | `@Observable` + `@Environment` |

### 5.6.2 Ne pas faire remonter l'état inutilement

Si un état n'est utilisé que dans une View et ses descendants directs, il reste local. Le remonter dans l'arbre crée du couplage inutile.

---

## 5.7 État vs dérivés

### 5.7.1 Source de vérité vs valeur dérivée

Une **source de vérité** est une valeur qui existe en tant que telle dans l'état. Un **dérivé** est calculé à partir d'autres valeurs.

```swift
@Observable
class CartModel {
    var items: [Item] = []                   // ← source de vérité

    var totalPrice: Double {                  // ← dérivé (computed property)
        items.reduce(0) { $0 + $1.price }
    }

    var isEmpty: Bool { items.isEmpty }       // ← dérivé
}
```

**Règle :** ne jamais stocker un dérivé comme état séparé. Le stocker crée un risque d'incohérence.

```
❌ Mauvais : stocker items ET totalPrice comme deux états séparés
✅ Bon : stocker items, calculer totalPrice à la demande
```

---

## 5.8 Absence de store central obligatoire

En SwiftUI (contrairement à certains patterns JS), il n'y a **pas de store central obligatoire**. L'état peut être distribué dans l'arbre selon les besoins.

- Petit app : `@State` local suffit
- App moyenne : quelques `@Observable` partagés
- Grande app : organisation par domaine fonctionnel (voir section 13)

---

## 5.9 Comparaison paradigmes

| Outil | Reef.js v13 | SwiftUI 6 |
|-------|-------------|-----------|
| State local | `signal()` dans le composant | `@State` |
| State partagé | `signal()` module-level | `@Observable` + `@State` |
| Passer vers enfant | argument de fonction | paramètre de View |
| Modifier depuis enfant | mutation directe du `signal` | `@Binding` |
| Contexte global | variable module | `@Environment` |
| Dérivé | propriété calculée JS | computed property Swift |

**Différence clé avec Reef :**

En Reef, un `signal()` défini au niveau module est accessible depuis n'importe où. En SwiftUI, la circulation est plus structurée : l'état descend explicitement, et les remontées nécessitent `@Binding` ou un modèle partagé. C'est plus verbeux mais évite les couplages cachés.
