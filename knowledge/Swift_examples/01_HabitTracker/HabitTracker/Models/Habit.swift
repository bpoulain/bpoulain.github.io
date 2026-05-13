import Foundation

// Struct = value type : chaque modification crée une nouvelle copie
// SwiftUI compare avant/après et met à jour uniquement les vues impactées
struct Habit: Identifiable {
    // UUID garantit l'unicité — Identifiable est requis par ForEach
    let id = UUID()
    var name: String
    var emoji: String
    var isCompleted: Bool = false
    // streak : nombre de jours consécutifs complétés
    var streak: Int = 0
}

// Données de preview séparées du modèle — ne pas polluer le code métier
extension Habit {
    static let previews: [Habit] = [
        Habit(name: "Boire de l'eau", emoji: "💧"),
        Habit(name: "Lire 20 min", emoji: "📚", streak: 3),
        Habit(name: "Coder", emoji: "💻", isCompleted: true, streak: 7),
    ]
}
