# 7. Side Effects & Lifecycle

## 7.1 Modèle mental central

**`body` est pur — les effets secondaires sont externalisés et liés au cycle de vie.**

En SwiftUI, `body` ne doit contenir que de la description UI. Tout ce qui interagit avec le monde extérieur (réseau, timers, analytics, persistence) est un "side effect" qui doit vivre en dehors du `body`, déclenché par des modificateurs de cycle de vie.

> *Analogie : `body` est une recette de cuisine. Elle décrit le plat, elle ne lance pas le four. Les side effects sont les actions réelles : acheter les ingrédients, préchauffer le four, nettoyer après.*

---

## 7.2 `.task {}` — side effect async lié au cycle de vie

### 7.2.1 Définition

`.task {}` est le modificateur principal pour déclencher des **opérations asynchrones** liées au cycle de vie d'une View :

```swift
struct ArticleView: View {
    @State private var content = ""

    var body: some View {
        Text(content.isEmpty ? "Chargement..." : content)
            .task {
                content = await fetchArticle()
            }
    }
}
```

### 7.2.2 Comportement

- **Démarre** quand la View apparaît
- **Annulé automatiquement** quand la View disparaît (si la tâche est encore en cours)
- Peut être `async` — aucun callback, aucun completion handler
- Si la View réapparaît, la tâche redémarre

### 7.2.3 `.task(id:)` — redéclencher sur changement de valeur

```swift
struct SearchView: View {
    @State private var query = ""
    @State private var results: [String] = []

    var body: some View {
        VStack {
            TextField("Recherche", text: $query)
            List(results, id: \.self) { Text($0) }
        }
        .task(id: query) {  // ← redéclenché à chaque changement de query
            results = await search(query: query)
        }
    }
}
```

---

## 7.3 `.onAppear` / `.onDisappear`

### 7.3.1 `.onAppear`

Déclenché quand une View devient visible :

```swift
struct LoggedView: View {
    var body: some View {
        Text("Vue principale")
            .onAppear {
                analytics.track("vue_affichée")
            }
    }
}
```

**Différence avec `.task {}` :**
- `.onAppear` est synchrone — ne peut pas `await`
- `.task {}` est asynchrone — peut `await`
- Pour des opérations async, préfère `.task {}`

### 7.3.2 `.onDisappear`

Déclenché quand une View quitte l'écran :

```swift
struct VideoView: View {
    var body: some View {
        VideoPlayer()
            .onDisappear {
                player.pause()  // ← nettoyage quand on quitte
            }
    }
}
```

---

## 7.4 Pureté de `body`

### 7.4.1 Règle fondamentale

`body` doit être une **fonction pure** : même état → même description UI, sans effets secondaires.

```swift
// ❌ Mauvais — side effect dans body
struct BadView: View {
    var body: some View {
        analytics.track("rendu")   // ← side effect caché dans body
        return Text("Bonjour")
    }
}

// ✅ Correct — side effect externalisé
struct GoodView: View {
    var body: some View {
        Text("Bonjour")
            .onAppear {
                analytics.track("rendu")
            }
    }
}
```

### 7.4.2 Pourquoi la pureté est importante

`body` peut être appelé **très fréquemment** par SwiftUI. Si `body` contient des side effects (appels réseau, logs), ils seront exécutés à chaque recomposition — potentiellement des dizaines de fois.

---

## 7.5 Annulation automatique des tasks

Un avantage majeur de `.task {}` sur les patterns manuels : la **cancellation automatique**.

```swift
struct DetailView: View {
    @State private var data: String?

    var body: some View {
        Text(data ?? "Chargement...")
            .task {
                // Si l'utilisateur navigue avant la fin du fetch
                // → la task est automatiquement annulée
                data = await fetchData()
            }
    }
}
```

Pas de cleanup manuel, pas de timer à invalider, pas de `isMounted` à vérifier comme en JS.

---

## 7.6 Risques de duplication de side effects

### 7.6.1 Le problème

SwiftUI peut recomposer une View plusieurs fois. Si `.onAppear` contient un appel réseau, et que la View est recréée (ex: la vue parent change), l'appel peut être exécuté plusieurs fois.

```swift
// Risque si ProfileView est recréée plusieurs fois
struct ProfileView: View {
    var body: some View {
        Text("Profil")
            .onAppear {
                fetchProfile()  // peut être appelé plusieurs fois
            }
    }
}
```

### 7.6.2 Solution

- Utiliser `.task {}` qui gère la cancellation
- Stocker le résultat dans `@State` avec un check d'existence
- Déplacer la logique dans un `@Observable` qui gère son propre état de chargement

```swift
struct ProfileView: View {
    @State private var profile: Profile?

    var body: some View {
        Group {
            if let profile {
                Text(profile.name)
            } else {
                ProgressView()
            }
        }
        .task {
            guard profile == nil else { return }  // ← évite la re-fetch
            profile = await fetchProfile()
        }
    }
}
```

---

## 7.7 Comparaison paradigmes

| Concept | JS vanilla | Reef.js v13 | SwiftUI 6 |
|---------|-----------|-------------|-----------|
| Au montage | `DOMContentLoaded` / `document.ready` | Pas de hook de montage direct | `.task {}` ou `.onAppear` |
| Au démontage | Pas natif (MutationObserver) | Pas natif | `.onDisappear` |
| Fetch async | `fetch().then()` | `fetch().then()` | `.task { await ... }` |
| Annulation | `AbortController` manuel | Manuel | Automatique avec `.task {}` |
| Side effect pur | En dehors du render | En dehors du template | Modificateurs de cycle de vie |

---

## 7.8 Récapitulatif

| Modificateur | Quand | Nature |
|--------------|-------|--------|
| `.task {}` | Apparition de la View | Async, annulé à la disparition |
| `.task(id:) {}` | Apparition + changement de `id` | Async, redéclenché sur changement |
| `.onAppear {}` | Apparition de la View | Synchrone |
| `.onDisappear {}` | Disparition de la View | Synchrone |
| `.onChange(of:) {}` | Changement d'une valeur | Synchrone ou async |

**Règle d'or :** `body` décrit, les modificateurs de cycle de vie agissent.
