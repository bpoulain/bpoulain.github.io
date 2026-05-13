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
