# FILETREE
- HabitTracker/HabitTrackerApp.swift
- HabitTracker/Models/Habit.swift
- HabitTracker/Views/ContentView.swift
- HabitTracker/Views/HabitRowView.swift

# FILES

## FILE

PATH: HabitTracker/HabitTrackerApp.swift

META: {"path": "HabitTracker/HabitTrackerApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// Point d'entrée unique de l'app — annoté @main
@main
struct HabitTrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

## FILE

PATH: HabitTracker/Models/Habit.swift

META: {"path": "HabitTracker/Models/Habit.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: HabitTracker/Views/ContentView.swift

META: {"path": "HabitTracker/Views/ContentView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct ContentView: View {
    // @State : source de vérité locale — toujours private
    // SwiftUI observe cette propriété et recalcule body à chaque changement
    @State private var habits: [Habit] = Habit.previews
    @State private var showingAddSheet = false

    var body: some View {
        // NavigationStack gère la pile de navigation (iOS 16+)
        NavigationStack {
            List {
                // $habits : le préfixe $ transforme [Habit] en Binding<[Habit]>
                // Chaque $habit est un Binding<Habit> — la sous-vue peut le modifier
                ForEach($habits) { $habit in
                    HabitRowView(habit: $habit)
                }
                .onDelete { indexSet in
                    habits.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("Mes habitudes")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Ajouter", systemImage: "plus") {
                        showingAddSheet = true
                    }
                }
                ToolbarItem(placement: .topBarLeading) {
                    // EditButton active le mode édition natif de List
                    EditButton()
                }
            }
            // sheet : vue modale présentée par-dessus
            .sheet(isPresented: $showingAddSheet) {
                AddHabitView(habits: $habits)
            }
        }
    }
}

// Composant séparé pour garder ContentView lisible
struct AddHabitView: View {
    @Binding var habits: [Habit]
    // @Environment(\.dismiss) : ferme la sheet sans passer de Binding supplémentaire
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var emoji = "⭐️"

    var body: some View {
        NavigationStack {
            Form {
                Section("Nouvelle habitude") {
                    TextField("Nom", text: $name)
                    TextField("Emoji", text: $emoji)
                }
            }
            .navigationTitle("Ajouter")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        habits.append(Habit(name: name, emoji: emoji))
                        dismiss()
                    }
                    // Désactivé si le nom est vide
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}

#Preview("Liste complète") {
    ContentView()
}

#Preview("Dark Mode") {
    ContentView()
        .preferredColorScheme(.dark)
}
```

## FILE

PATH: HabitTracker/Views/HabitRowView.swift

META: {"path": "HabitTracker/Views/HabitRowView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// Composant réutilisable — reçoit un Binding pour pouvoir modifier l'habitude
struct HabitRowView: View {
    // @Binding : pas propriétaire du state, mais peut le modifier
    // La modification se propage automatiquement au parent
    @Binding var habit: Habit

    var body: some View {
        HStack(spacing: 12) {
            Text(habit.emoji)
                .font(.title2)

            VStack(alignment: .leading, spacing: 2) {
                Text(habit.name)
                    .font(.body)
                    // Barré quand complété — réagit automatiquement au state
                    .strikethrough(habit.isCompleted, color: .secondary)
                    .foregroundStyle(habit.isCompleted ? .secondary : .primary)

                // Streak — affiché seulement si l'habitude a une progression
                if habit.streak > 0 {
                    Label("\(habit.streak) jour\(habit.streak > 1 ? "s" : "")", systemImage: "flame.fill")
                        .font(.caption)
                        .foregroundStyle(.orange)
                }
            }

            Spacer()

            Button {
                // withAnimation enveloppe la mutation pour animer la transition
                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                    habit.isCompleted.toggle()
                    if habit.isCompleted {
                        habit.streak += 1
                    }
                }
            } label: {
                Image(systemName: habit.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundStyle(habit.isCompleted ? Color.green : Color.secondary)
                    // contentTransition anime le changement de SF Symbol
                    .contentTransition(.symbolEffect(.replace))
            }
            // .plain supprime le highlight bleu par défaut dans une List
            .buttonStyle(.plain)
        }
        .padding(.vertical, 4)
    }
}

#Preview("Complétée avec streak") {
    // .constant() crée un Binding non modifiable — idéal pour les previews
    HabitRowView(habit: .constant(
        Habit(name: "Coder", emoji: "💻", isCompleted: true, streak: 7)
    ))
    .padding()
}

#Preview("Non complétée") {
    HabitRowView(habit: .constant(Habit(name: "Lire 20 min", emoji: "📚")))
        .padding()
}
```
