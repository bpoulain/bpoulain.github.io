# FILETREE
- SocialFeed/SocialFeedApp.swift
- SocialFeed/Models/Post.swift
- SocialFeed/Stores/FeedStore.swift
- SocialFeed/Views/FeedView.swift
- SocialFeed/Views/PostRowView.swift

# FILES

## FILE

PATH: SocialFeed/SocialFeedApp.swift

META: {"path": "SocialFeed/SocialFeedApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

@main
struct SocialFeedApp: App {
    var body: some Scene {
        WindowGroup {
            FeedView()
        }
    }
}
```

## FILE

PATH: SocialFeed/Models/Post.swift

META: {"path": "SocialFeed/Models/Post.swift", "sha256": "", "size": 0}

```swift
import Foundation

struct Post: Identifiable, Codable {
    let id: UUID
    var author: String
    var avatarURL: String
    var content: String
    var imageURL: String?
    var likesCount: Int
    var commentsCount: Int
    var isLiked: Bool
    var postedAt: Date
}

extension Post {
    // Données de preview générées localement
    static func makeSamples(count: Int) -> [Post] {
        (0..<count).map { i in
            Post(
                id: UUID(),
                author: ["Alice", "Bob", "Clara", "David"][i % 4],
                avatarURL: "https://i.pravatar.cc/40?img=\(i)",
                content: "Post numéro \(i + 1) — Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                imageURL: i % 3 == 0 ? "https://picsum.photos/400/300?random=\(i)" : nil,
                likesCount: Int.random(in: 0...200),
                commentsCount: Int.random(in: 0...50),
                isLiked: false,
                postedAt: Date.now.addingTimeInterval(Double(-i * 3600))
            )
        }
    }
}
```

## FILE

PATH: SocialFeed/Stores/FeedStore.swift

META: {"path": "SocialFeed/Stores/FeedStore.swift", "sha256": "", "size": 0}

```swift
import Foundation

// @MainActor : toutes les mutations de posts se font sur le thread principal
@MainActor
@Observable
final class FeedStore {
    private(set) var posts: [Post] = []
    private(set) var isLoading = false
    private(set) var isLoadingMore = false
    private var currentPage = 0
    private let pageSize = 20

    func refresh() async {
        isLoading = true
        // Simuler une requête réseau (300ms de latence)
        try? await Task.sleep(for: .milliseconds(300))
        currentPage = 0
        posts = Post.makeSamples(count: pageSize)
        isLoading = false
    }

    func loadNextPage() async {
        guard !isLoadingMore else { return }
        isLoadingMore = true
        try? await Task.sleep(for: .milliseconds(500))
        currentPage += 1
        posts.append(contentsOf: Post.makeSamples(count: pageSize))
        isLoadingMore = false
    }

    // Optimistic UI : mise à jour immédiate, rollback si erreur réseau
    func toggleLike(post: Post) {
        guard let index = posts.firstIndex(where: { $0.id == post.id }) else { return }
        // 1. Mise à jour locale immédiate
        posts[index].isLiked.toggle()
        posts[index].likesCount += posts[index].isLiked ? 1 : -1

        // 2. Appel réseau (simulé)
        Task {
            try? await Task.sleep(for: .milliseconds(200))
            // En cas d'erreur réelle : rollback avec les valeurs originales
            // posts[index].isLiked = post.isLiked
            // posts[index].likesCount = post.likesCount
        }
    }
}
```

## FILE

PATH: SocialFeed/Views/FeedView.swift

META: {"path": "SocialFeed/Views/FeedView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct FeedView: View {
    @State private var store = FeedStore()

    var body: some View {
        NavigationStack {
            ScrollView {
                // LazyVStack : ne crée les vues qu'au moment où elles deviennent visibles
                LazyVStack(spacing: 0) {
                    if store.isLoading {
                        ProgressView("Chargement…")
                            .padding(40)
                    } else {
                        ForEach(store.posts) { post in
                            PostRowView(post: post) {
                                store.toggleLike(post: post)
                            }
                            .onAppear {
                                // Déclencher la page suivante quand le dernier post est visible
                                if post.id == store.posts.last?.id {
                                    Task { await store.loadNextPage() }
                                }
                            }
                            Divider()
                        }

                        // Indicateur de pagination en bas de liste
                        if store.isLoadingMore {
                            ProgressView()
                                .padding(24)
                        }
                    }
                }
            }
            // .refreshable gère l'indicateur de pull-to-refresh automatiquement
            .refreshable {
                await store.refresh()
            }
            .navigationTitle("Feed")
        }
        .task {
            // Chargement initial lié au cycle de vie de la vue
            await store.refresh()
        }
    }
}

#Preview {
    FeedView()
}
```

## FILE

PATH: SocialFeed/Views/PostRowView.swift

META: {"path": "SocialFeed/Views/PostRowView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct PostRowView: View {
    let post: Post
    let onLike: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header auteur
            HStack(spacing: 10) {
                // AsyncImage charge l'image depuis l'URL de façon asynchrone
                AsyncImage(url: URL(string: post.avatarURL)) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    default:
                        // Placeholder générique pendant le chargement
                        Circle().fill(Color.secondary.opacity(0.2))
                    }
                }
                .frame(width: 36, height: 36)
                .clipShape(Circle())

                VStack(alignment: .leading, spacing: 1) {
                    Text(post.author)
                        .font(.subheadline.bold())
                    Text(post.postedAt.formatted(.relative(presentation: .named)))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }
            .padding(.horizontal)
            .padding(.vertical, 10)

            // Contenu texte
            Text(post.content)
                .font(.body)
                .padding(.horizontal)
                .padding(.bottom, 8)

            // Image du post (optionnelle)
            if let imageURL = post.imageURL {
                AsyncImage(url: URL(string: imageURL)) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    case .empty, .failure:
                        Rectangle()
                            .fill(Color.secondary.opacity(0.1))
                            .overlay { Image(systemName: "photo").foregroundStyle(.secondary) }
                    @unknown default:
                        EmptyView()
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 200)
                .clipped()
            }

            // Barre d'actions
            HStack(spacing: 20) {
                Button(action: onLike) {
                    Label("\(post.likesCount)", systemImage: post.isLiked ? "heart.fill" : "heart")
                        .foregroundStyle(post.isLiked ? .red : .secondary)
                        // contentTransition anime le changement de symbole
                        .contentTransition(.symbolEffect(.replace))
                }

                Button { } label: {
                    Label("\(post.commentsCount)", systemImage: "bubble")
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Button { } label: {
                    Image(systemName: "square.and.arrow.up")
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 10)
            .buttonStyle(.plain)
        }
    }
}

#Preview {
    PostRowView(post: Post.makeSamples(count: 1)[0], onLike: { })
}
```
