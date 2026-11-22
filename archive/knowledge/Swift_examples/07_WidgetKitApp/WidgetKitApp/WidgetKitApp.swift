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
