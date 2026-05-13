# Concepts — Projet 6 : Social Feed

## 1. LazyVStack — rendu paresseux

`LazyVStack` ne crée les vues que quand elles entrent dans la fenêtre visible — essentiel pour les listes longues.

```swift
// VStack : crée TOUTES les vues immédiatement → lent sur 1000 éléments
VStack {
    ForEach(posts) { PostRow(post: $0) }
}

// LazyVStack : crée uniquement les vues visibles → fluide sur 10 000 éléments
ScrollView {
    LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
        ForEach(posts) { PostRow(post: $0) }
    }
}
```

**Différence clé** : `List` utilise UITableView sous le capot (recyclage automatique). `LazyVStack` dans `ScrollView` donne plus de contrôle sur le layout mais gère le recyclage manuellement.

---

## 2. AsyncImage — chargement d'images réseau

`AsyncImage` charge et affiche une image depuis une URL de façon asynchrone.

```swift
AsyncImage(url: URL(string: post.imageURL)) { phase in
    switch phase {
    case .empty:
        // Placeholder pendant le chargement
        Rectangle()
            .fill(.secondary.opacity(0.15))
            .overlay { ProgressView() }
    case .success(let image):
        image
            .resizable()
            .aspectRatio(contentMode: .fill)
    case .failure:
        // Image de fallback en cas d'erreur
        Image(systemName: "photo")
            .foregroundStyle(.secondary)
    @unknown default:
        EmptyView()
    }
}
.frame(height: 200)
.clipped()
```

---

## 3. Infinite scroll — pagination

Déclencher le chargement de la page suivante quand l'utilisateur approche de la fin de la liste.

```swift
struct FeedView: View {
    @State private var store = FeedStore()

    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(store.posts) { post in
                    PostRow(post: post)
                        // Déclencher le chargement quand on approche de la fin
                        .onAppear {
                            if post.id == store.posts.last?.id {
                                Task { await store.loadNextPage() }
                            }
                        }
                }

                // Indicateur de chargement en bas
                if store.isLoadingMore {
                    ProgressView()
                        .padding()
                }
            }
        }
        .refreshable {
            // Pull to refresh — .refreshable gère l'indicateur automatiquement
            await store.refresh()
        }
    }
}
```

---

## 4. Cache d'images

`AsyncImage` ne met pas en cache les images entre les navigations. Un cache `NSCache` évite les re-téléchargements.

```swift
// Cache partagé — singleton pour toute l'app
final class ImageCache {
    static let shared = ImageCache()
    private let cache = NSCache<NSString, UIImage>()

    func image(for url: URL) -> UIImage? {
        cache.object(forKey: url.absoluteString as NSString)
    }

    func store(_ image: UIImage, for url: URL) {
        cache.setObject(image, forKey: url.absoluteString as NSString)
    }
}

// AsyncImage avec cache manuel
struct CachedAsyncImage: View {
    let url: URL
    @State private var image: UIImage?

    var body: some View {
        Group {
            if let image {
                Image(uiImage: image).resizable()
            } else {
                ProgressView()
                    .task { await loadImage() }
            }
        }
    }

    private func loadImage() async {
        // Vérifier le cache avant de télécharger
        if let cached = ImageCache.shared.image(for: url) {
            image = cached
            return
        }
        // Télécharger et mettre en cache
        guard let (data, _) = try? await URLSession.shared.data(from: url),
              let uiImage = UIImage(data: data) else { return }
        ImageCache.shared.store(uiImage, for: url)
        image = uiImage
    }
}
```

---

## 5. Optimistic UI

Mettre à jour l'UI immédiatement sans attendre la confirmation serveur — l'app semble instantanée.

```swift
func toggleLike(post: Post) {
    // 1. Mise à jour immédiate de l'UI (optimistic)
    let index = posts.firstIndex(where: { $0.id == post.id })
    posts[index]?.isLiked.toggle()
    posts[index]?.likesCount += post.isLiked ? -1 : 1

    // 2. Appel réseau en arrière-plan
    Task {
        do {
            try await api.toggleLike(postId: post.id)
            // Succès : l'UI était déjà correcte, rien à faire
        } catch {
            // Échec : rollback de l'UI
            posts[index]?.isLiked = post.isLiked
            posts[index]?.likesCount = post.likesCount
        }
    }
}
```

---

## 6. @MainActor — thread principal

SwiftUI doit être mis à jour sur le thread principal. `@MainActor` garantit ça.

```swift
// @MainActor sur la classe : toutes les méthodes s'exécutent sur le thread principal
@MainActor
@Observable
final class FeedStore {
    var posts: [Post] = []

    func loadNextPage() async {
        // Même si cette méthode appelle du code async (réseau)
        // les mises à jour de posts se font automatiquement sur le main thread
        let newPosts = try? await api.fetchPosts(page: currentPage + 1)
        posts.append(contentsOf: newPosts ?? [])
    }
}
```
