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
