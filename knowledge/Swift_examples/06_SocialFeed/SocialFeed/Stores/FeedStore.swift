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
