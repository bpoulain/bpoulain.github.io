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
