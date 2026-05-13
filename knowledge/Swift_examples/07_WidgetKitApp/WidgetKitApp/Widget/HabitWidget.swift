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
