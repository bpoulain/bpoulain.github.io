import Foundation

struct Exercise: Identifiable {
    let id = UUID()
    var name: String
    var emoji: String
    // Durée en secondes
    var duration: Int
    var restDuration: Int = 30
    var isCompleted: Bool = false
}

// État explicite de la séance — plus lisible que plusieurs booléens combinés
enum WorkoutPhase: Equatable {
    case idle
    case active(exercise: UUID)
    case resting
    case completed
}

extension Exercise {
    static let samples: [Exercise] = [
        Exercise(name: "Échauffement", emoji: "🔥", duration: 60),
        Exercise(name: "Squats", emoji: "🦵", duration: 45, restDuration: 20),
        Exercise(name: "Pompes", emoji: "💪", duration: 30, restDuration: 20),
        Exercise(name: "Gainage", emoji: "🏋️", duration: 60, restDuration: 30),
        Exercise(name: "Stretching", emoji: "🧘", duration: 120),
    ]
}
