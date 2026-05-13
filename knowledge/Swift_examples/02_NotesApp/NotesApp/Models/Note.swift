import Foundation
import SwiftData

// @Model : macro SwiftData qui génère la persistance automatiquement
// final class car SwiftData requiert des reference types (pas des structs)
@Model
final class Note {
    var title: String
    var content: String
    var isFavorite: Bool
    // updatedAt permet de trier par "le plus récemment modifié"
    var updatedAt: Date

    init(title: String = "") {
        self.title = title
        self.content = ""
        self.isFavorite = false
        self.updatedAt = .now
    }
}
