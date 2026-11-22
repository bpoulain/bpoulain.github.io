# 6. Navigation — Exercices

---

## Exercice 6.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, voici une navigation simple par hashchange :

```js
// JS vanilla — navigation via hash
window.addEventListener('hashchange', () => {
    renderPage(window.location.hash)
})

function renderPage(hash) {
    const app = document.querySelector('#app')
    if (hash === '#detail') {
        app.innerHTML = '<div>Page détail</div><a href="#">Retour</a>'
    } else {
        app.innerHTML = '<div>Accueil</div><a href="#detail">Voir détail</a>'
    }
}

renderPage(window.location.hash)
```

**Questions :**

→ En SwiftUI, la navigation n'est pas gérée par des URLs. Quel est l'équivalent conceptuel du hash ?
→ Comment "aller vers le détail" sans manipuler de string ?
→ Comment "revenir en arrière" ?

*Tente de répondre avant de lire la correction.*

---

### Correction 6.1

**Modèle mental :**

En JS, le hash string sert de "routeur". En SwiftUI, la navigation est une **pile de valeurs typées** (`NavigationPath` ou tableau d'`AppRoute`). Naviguer = ajouter une valeur. Revenir = retirer.

```swift
enum AppRoute: Hashable {
    case detail
    case home
}

struct AppRoot: View {
    @State private var path: [AppRoute] = []

    var body: some View {
        NavigationStack(path: $path) {
            HomeView(path: $path)
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .detail:
                        DetailView(path: $path)
                    case .home:
                        HomeView(path: $path)
                    }
                }
        }
    }
}

struct HomeView: View {
    @Binding var path: [AppRoute]

    var body: some View {
        VStack {
            Text("Accueil")
            Button("Voir détail") {
                path.append(.detail)   // ← équivalent window.location.hash = '#detail'
            }
        }
        .navigationTitle("Accueil")
    }
}

struct DetailView: View {
    @Binding var path: [AppRoute]

    var body: some View {
        VStack {
            Text("Page détail")
            Button("Retour") {
                path.removeLast()   // ← équivalent history.back()
            }
        }
        .navigationTitle("Détail")
    }
}
```

**Différences clés :**
- SwiftUI vérifie les routes à la compilation (enum typé, pas de strings)
- Le retour en arrière est géré automatiquement par `NavigationStack` (bouton Back natif)
- `path.removeLast()` est nécessaire seulement pour un retour programmatique

---

## Exercice 6.2 — Piège de paradigme

### Énoncé

Un développeur présente ce code pour naviguer programmatiquement :

```swift
struct HomeView: View {
    var body: some View {
        Button("Aller au profil") {
            // ??? Comment naviguer ici sans NavigationPath ?
            ProfileView()  // ← ne fait rien, juste crée une View
        }
    }
}
```

Et cette deuxième tentative :

```swift
struct HomeView: View {
    @State private var showProfile = false

    var body: some View {
        Button("Profil") {
            showProfile = true
        }
        // Et ensuite... il ne sait pas comment afficher ProfileView
    }
}
```

**Questions :**
→ Pourquoi `ProfileView()` dans le bouton ne fait rien ?
→ La deuxième approche est sur la bonne voie — qu'est-ce qui manque ?
→ Quand utiliser `.sheet()` plutôt que `NavigationLink` ?

---

### Correction 6.2

**Problème 1 :**

`ProfileView()` crée une *description* de la vue — une valeur Swift. Elle n'est pas affichée. En SwiftUI, tu ne "montres" pas une vue en la créant — tu modifies l'état de navigation.

```
❌ Ce que le cerveau fait :
   "Je crée la vue → elle s'affiche"

✅ Comment ça fonctionne réellement :
   Créer une View ne l'affiche pas. Il faut la placer dans body,
   ou modifier l'état de navigation.
```

**Problème 2 :**

La deuxième approche est correcte pour une **modale**. Il manque le `.sheet()` :

```swift
struct HomeView: View {
    @State private var showProfile = false

    var body: some View {
        Button("Profil") {
            showProfile = true
        }
        .sheet(isPresented: $showProfile) {
            ProfileView()
        }
    }
}
```

**Quand utiliser quoi :**

| Cas | Pattern |
|-----|---------|
| Navigation avec stack (retour natif) | `NavigationStack` + `NavigationLink` |
| Navigation programmatique dans le stack | `path.append(route)` |
| Modale légère (partial screen) | `.sheet()` |
| Modale plein écran | `.fullScreenCover()` |
| Dialogue de confirmation | `.confirmationDialog()` ou `.alert()` |

---

## Exercice 6.3 — Mini cas réel

### Énoncé

Tu construis une app de liste d'articles. Structure :
- **HomeView** : liste de 3 articles (titre + date)
- Tap sur un article → **ArticleDetail** avec le contenu complet
- Un bouton "Partager" sur la détail → **ShareSheet** (modale)
- Un bouton "Retour accueil" dans la modale qui ferme tout et retourne à l'accueil

**Avant de coder :**
→ Quels éléments utilisent `NavigationStack` ? Lesquels utilisent `.sheet()` ?
→ Comment passer l'article sélectionné vers `ArticleDetail` ?
→ Comment le bouton "Retour accueil" dans la modale ferme la modale ET revient à l'accueil ?

*Décris d'abord, code ensuite.*

---

### Correction 6.3

**Modèle mental :**

- Navigation liste → détail : `NavigationStack` (push)
- Modale partage : `.sheet()` (modal overlay)
- "Retour accueil" : fermer la modale (`dismiss`) + vider le path

```swift
struct Article: Identifiable, Hashable {
    let id = UUID()
    let title: String
    let date: String
    let content: String
}

struct ArticleApp: View {
    @State private var path: [Article] = []
    let articles = [
        Article(title: "Swift 6 est là", date: "2026-04-01", content: "Swift 6 apporte..."),
        Article(title: "SwiftUI layout", date: "2026-04-10", content: "Le layout system..."),
        Article(title: "Navigation moderne", date: "2026-04-20", content: "NavigationStack...")
    ]

    var body: some View {
        NavigationStack(path: $path) {
            List(articles) { article in
                NavigationLink(value: article) {
                    VStack(alignment: .leading) {
                        Text(article.title).bold()
                        Text(article.date).foregroundStyle(.secondary).font(.caption)
                    }
                }
            }
            .navigationTitle("Articles")
            .navigationDestination(for: Article.self) { article in
                ArticleDetail(article: article, onGoHome: {
                    path = []  // ← retourne à l'accueil
                })
            }
        }
    }
}

struct ArticleDetail: View {
    let article: Article
    let onGoHome: () -> Void
    @State private var showShare = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(article.title).font(.title).bold()
            Text(article.date).foregroundStyle(.secondary)
            Text(article.content)
            Spacer()
            Button("Partager") {
                showShare = true
            }
            .buttonStyle(.bordered)
        }
        .padding()
        .navigationTitle(article.title)
        .sheet(isPresented: $showShare) {
            ShareSheet(onGoHome: {
                showShare = false  // ferme la modale
                onGoHome()         // puis retourne à l'accueil
            })
        }
    }
}

struct ShareSheet: View {
    let onGoHome: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 20) {
            Text("Partager cet article")
                .font(.headline)
            Button("Fermer") {
                dismiss()
            }
            Button("Retour à l'accueil") {
                onGoHome()
            }
            .foregroundStyle(.red)
        }
        .padding()
    }
}

#Preview {
    ArticleApp()
}
```

**Points clés :**
- `NavigationLink(value: article)` + `navigationDestination(for:)` = navigation typée
- `path = []` vide la pile → retour direct à la racine
- La closure `onGoHome` permet à la modale de déclencher une action dans le parent
- `@Environment(\.dismiss)` ferme la modale sans avoir de référence au parent

**Erreurs classiques :**
- ❌ Essayer de naviguer depuis la modale vers une vue dans le NavigationStack (impossible directement)
- ❌ Utiliser des strings comme identifiants de routes
- ✅ Routes = types Hashable (enum ou struct conformant à Hashable)
