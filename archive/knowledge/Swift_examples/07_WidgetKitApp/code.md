# FILETREE
- WidgetKitApp/WidgetKitApp.swift
- WidgetKitApp/Shared/SharedModels.swift
- WidgetKitApp/Widget/HabitWidget.swift
- WidgetKitApp/Intents/CheckHabitIntent.swift

# FILES

## FILE

PATH: WidgetKitApp/WidgetKitApp.swift

META: {"path": "WidgetKitApp/WidgetKitApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import WidgetKit

@main
struct WidgetKitApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var habits: [Habit] = HabitStore.shared.load()

    var body: some View {
        NavigationStack {
            List($habits) { $habit in
                HStack {
                    Text(habit.emoji)
                    Text(habit.name)
                    Spacer()
                    Button {
                        habit.isCompleted.toggle()
                        // Sauvegarder dans l'App Group et rafraîchir les widgets
                        HabitStore.shared.save(habits)
                        WidgetCenter.shared.reloadAllTimelines()
                    } label: {
                        Image(systemName: habit.isCompleted ? "checkmark.circle.fill" : "circle")
                            .foregroundStyle(habit.isCompleted ? .green : .secondary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .navigationTitle("Habitudes")
        }
        // Intercepter les deep links depuis les widgets
        .onOpenURL { url in
            handleDeepLink(url)
        }
    }

    private func handleDeepLink(_ url: URL) {
        // monapp://habit/<uuid> → naviguer vers l'habitude
        guard url.scheme == "monapp",
              url.host == "habit",
              let idString = url.pathComponents.last,
              let id = UUID(uuidString: idString) else { return }
        // Navigation vers l'habitude correspondante
        _ = id
    }
}
```

## FILE

PATH: WidgetKitApp/Shared/SharedModels.swift

META: {"path": "WidgetKitApp/Shared/SharedModels.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: WidgetKitApp/Widget/HabitWidget.swift

META: {"path": "WidgetKitApp/Widget/HabitWidget.swift", "sha256": "", "size": 0}

```swift
import WidgetKit
import SwiftUI

// TimelineProvider : fournit les snapshots au système
struct HabitTimelineProvider: TimelineProvider {
    // placeholder : affiché dans la galerie de widgets, doit être instantané
    func placeholder(in context: Context) -> HabitEntry {
        HabitEntry(date: .now, habits: Habit.samples)
    }

    // getSnapshot : affiché lors de la prévisualisation, doit être instantané
    func getSnapshot(in context: Context, completion: @escaping (HabitEntry) -> Void) {
        let entry = HabitEntry(date: .now, habits: HabitStore.shared.load())
        completion(entry)
    }

    // getTimeline : prépare la séquence de snapshots pour les prochaines heures
    func getTimeline(in context: Context, completion: @escaping (Timeline<HabitEntry>) -> Void) {
        let habits = HabitStore.shared.load()
        let now = Date.now
        let entry = HabitEntry(date: now, habits: habits)

        // .atEnd : le système redemande une timeline après la dernière entrée
        // .after(date) : programmer le prochain refresh à minuit (reset des habitudes)
        let midnight = Calendar.current.nextDate(after: now,
                                                  matching: DateComponents(hour: 0),
                                                  matchingPolicy: .nextTime) ?? now
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }
}

// Vue principale du widget — supporte small, medium et Lock Screen
struct HabitWidgetView: View {
    let entry: HabitEntry
    @Environment(\.widgetFamily) private var widgetFamily

    var body: some View {
        switch widgetFamily {
        case .systemSmall:
            SmallHabitView(entry: entry)
        case .systemMedium:
            MediumHabitView(entry: entry)
        case .accessoryCircular:
            // Lock Screen widget circulaire
            LockScreenCircularView(entry: entry)
        default:
            SmallHabitView(entry: entry)
        }
    }
}

struct SmallHabitView: View {
    let entry: HabitEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Habitudes")
                .font(.caption.bold())
                .foregroundStyle(.secondary)
            Text(entry.progressText)
                .font(.title.bold())
            Text("\(entry.completedCount) sur \(entry.totalCount) aujourd'hui")
                .font(.caption2)
                .foregroundStyle(.secondary)
            Spacer()
            // Barre de progression compacte
            GeometryReader { geo in
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.secondary.opacity(0.2))
                    .overlay(alignment: .leading) {
                        let width = geo.size.width * (Double(entry.completedCount) / Double(max(entry.totalCount, 1)))
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color.accentColor)
                            .frame(width: width)
                    }
            }
            .frame(height: 6)
        }
        .padding()
        // widgetURL : tout le widget est un lien vers l'app
        .widgetURL(URL(string: "monapp://habits"))
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct MediumHabitView: View {
    let entry: HabitEntry

    var body: some View {
        HStack(spacing: 12) {
            // Résumé à gauche
            VStack(alignment: .leading, spacing: 4) {
                Text("Aujourd'hui")
                    .font(.caption.bold())
                    .foregroundStyle(.secondary)
                Text(entry.progressText)
                    .font(.title.bold())
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Divider()

            // Liste des habitudes à droite
            VStack(alignment: .leading, spacing: 6) {
                ForEach(entry.habits.prefix(3)) { habit in
                    // Link : deep link précis vers l'habitude
                    Link(destination: URL(string: "monapp://habit/\(habit.id)")!) {
                        HStack(spacing: 6) {
                            Text(habit.emoji).font(.caption)
                            Text(habit.name)
                                .font(.caption)
                                .lineLimit(1)
                            Spacer()
                            Image(systemName: habit.isCompleted ? "checkmark.circle.fill" : "circle")
                                .font(.caption)
                                .foregroundStyle(habit.isCompleted ? .green : .secondary)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct LockScreenCircularView: View {
    let entry: HabitEntry

    var body: some View {
        // Les Lock Screen widgets utilisent des couleurs adaptatives automatiquement
        ZStack {
            // Cercle de progression
            Circle()
                .stroke(Color.secondary.opacity(0.3), lineWidth: 4)
            Circle()
                .trim(from: 0, to: CGFloat(entry.completedCount) / CGFloat(max(entry.totalCount, 1)))
                .stroke(Color.accentColor, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Text(entry.progressText)
                .font(.system(size: 14, weight: .bold, design: .rounded))
        }
        .widgetURL(URL(string: "monapp://habits"))
        .containerBackground(.clear, for: .widget)
    }
}

// Déclaration du widget
struct HabitWidget: Widget {
    let kind = "HabitWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HabitTimelineProvider()) { entry in
            HabitWidgetView(entry: entry)
        }
        .configurationDisplayName("Habitudes")
        .description("Suivez vos habitudes depuis l'écran d'accueil.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular])
    }
}

// WidgetBundle : point d'entrée de la Widget Extension target
@main
struct HabitWidgetBundle: WidgetBundle {
    var body: some Widget {
        HabitWidget()
    }
}

#Preview(as: .systemSmall) {
    HabitWidget()
} timeline: {
    HabitEntry(date: .now, habits: Habit.samples)
}
```

## FILE

PATH: WidgetKitApp/Intents/CheckHabitIntent.swift

META: {"path": "WidgetKitApp/Intents/CheckHabitIntent.swift", "sha256": "", "size": 0}

```swift
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
```
