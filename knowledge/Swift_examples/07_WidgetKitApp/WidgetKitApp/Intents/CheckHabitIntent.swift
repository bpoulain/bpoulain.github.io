import AppIntents
import WidgetKit

// AppIntent : action exposée à Siri, Shortcuts et widgets interactifs (iOS 17+)
struct CheckHabitIntent: AppIntent {
    // Titre affiché dans Raccourcis / Siri
    static var title: LocalizedStringResource = "Cocher une habitude"
    static var description = IntentDescription("Marque une habitude comme complétée pour aujourd'hui")

    // Paramètre : l'utilisateur peut choisir quelle habitude
    @Parameter(title: "Nom de l'habitude")
    var habitName: String

    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Charger, modifier, sauvegarder
        var habits = HabitStore.shared.load()
        guard let index = habits.firstIndex(where: {
            $0.name.localizedCaseInsensitiveCompare(habitName) == .orderedSame
        }) else {
            throw $habitName.needsValueError("Habitude '\(habitName)' introuvable")
        }
        habits[index].isCompleted = true
        HabitStore.shared.save(habits)

        // Rafraîchir les widgets après la modification
        WidgetCenter.shared.reloadAllTimelines()

        return .result(dialog: "\(habitName) cochée ✅")
    }
}

// Intent pour les widgets interactifs — s'exécute sans ouvrir l'app
struct ToggleHabitIntent: AppIntent {
    static var title: LocalizedStringResource = "Basculer une habitude"

    @Parameter(title: "ID de l'habitude")
    var habitId: String

    func perform() async throws -> some IntentResult {
        var habits = HabitStore.shared.load()
        guard let index = habits.firstIndex(where: { $0.id.uuidString == habitId }) else {
            return .result()
        }
        habits[index].isCompleted.toggle()
        HabitStore.shared.save(habits)
        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }
}
