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
