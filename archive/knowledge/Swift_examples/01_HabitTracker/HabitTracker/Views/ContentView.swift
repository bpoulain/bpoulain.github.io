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
