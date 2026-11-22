import Foundation
import WidgetKit

// Modèle partagé entre l'app et le widget — doit être Codable
struct Habit: Identifiable, Codable {
    let id: UUID
    var name: String
    var emoji: String
    var isCompleted: Bool
    var streak: Int
}

extension Habit {
    static let samples = [
        Habit(id: UUID(), name: "Boire de l'eau", emoji: "💧", isCompleted: true, streak: 5),
        Habit(id: UUID(), name: "Lire 20 min", emoji: "📚", isCompleted: false, streak: 2),
        Habit(id: UUID(), name: "Coder", emoji: "💻", isCompleted: false, streak: 12),
    ]
}

// Singleton qui lit/écrit dans l'App Group partagé
final class HabitStore {
    static let shared = HabitStore()

    // L'App Group doit être activé dans Capabilities pour les deux targets
    private let suiteName = "group.com.monapp.habits"
    private let key = "habits"

    func load() -> [Habit] {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let data = defaults.data(forKey: key) else {
            return Habit.samples
        }
        return (try? JSONDecoder().decode([Habit].self, from: data)) ?? Habit.samples
    }

    func save(_ habits: [Habit]) {
        guard let defaults = UserDefaults(suiteName: suiteName),
              let data = try? JSONEncoder().encode(habits) else { return }
        defaults.set(data, forKey: key)
    }
}

// Entry de timeline — snapshot d'état à un instant T
struct HabitEntry: TimelineEntry {
    // date : requis par le protocole — indique quand afficher ce snapshot
    let date: Date
    let habits: [Habit]

    var completedCount: Int { habits.filter { $0.isCompleted }.count }
    var totalCount: Int { habits.count }
    var progressText: String { "\(completedCount)/\(totalCount)" }
}
