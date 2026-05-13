import SwiftUI

struct ExerciseListView: View {
    @State private var exercises: [Exercise] = Exercise.samples
    @State private var selectedExercise: Exercise?
    // @Namespace : espace de nommage partagé pour MatchedGeometryEffect
    @Namespace private var heroNamespace
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        NavigationStack {
            ZStack {
                // Liste des exercices
                List {
                    ForEach($exercises) { $exercise in
                        SwipeToCompleteRow(exercise: $exercise, namespace: heroNamespace) {
                            withAnimation(reduceMotion ? .none : .spring(response: 0.4, dampingFraction: 0.75)) {
                                selectedExercise = exercise
                            }
                        }
                    }
                }
                .navigationTitle("Séance")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Réinitialiser") {
                            withAnimation(.spring(response: 0.4)) {
                                exercises = Exercise.samples
                            }
                        }
                    }
                }

                // Vue détail en overlay — hero transition depuis la liste
                if let exercise = selectedExercise {
                    WorkoutTimerView(
                        exercise: exercise,
                        namespace: heroNamespace
                    ) {
                        withAnimation(reduceMotion ? .none : .spring(response: 0.5, dampingFraction: 0.8)) {
                            selectedExercise = nil
                        }
                    }
                    .zIndex(1)  // toujours au-dessus de la liste
                }
            }
        }
    }
}

// Ligne avec swipe-to-complete (interaction type Clear)
struct SwipeToCompleteRow: View {
    @Binding var exercise: Exercise
    let namespace: Namespace.ID
    let onTap: () -> Void

    @State private var dragOffset: CGFloat = 0
    private let threshold: CGFloat = 80

    var body: some View {
        ZStack(alignment: .leading) {
            // Fond vert progressif pendant le drag
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.green.opacity(dragOffset / threshold))
                .overlay(alignment: .leading) {
                    Image(systemName: "checkmark")
                        .foregroundStyle(.white)
                        .padding(.leading, 16)
                        .opacity(Double(dragOffset) / Double(threshold))
                }

            // Contenu de la ligne
            HStack(spacing: 12) {
                Text(exercise.emoji)
                    .font(.title2)
                    // matchedGeometryEffect lie cet élément à la vue détail
                    .matchedGeometryEffect(id: "emoji-\(exercise.id)", in: namespace)

                VStack(alignment: .leading, spacing: 2) {
                    Text(exercise.name)
                        .font(.headline)
                        .strikethrough(exercise.isCompleted)
                        .matchedGeometryEffect(id: "name-\(exercise.id)", in: namespace)
                    Text("\(exercise.duration)s")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                if exercise.isCompleted {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(.green)
                }
            }
            .padding(12)
            .background(.regularMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .offset(x: dragOffset)
            .onTapGesture { onTap() }
            .gesture(
                DragGesture()
                    .onChanged { value in
                        // Drag seulement vers la droite, avec légère résistance
                        if value.translation.width > 0 {
                            dragOffset = value.translation.width * 0.8
                        }
                    }
                    .onEnded { value in
                        if value.translation.width > threshold {
                            // Complétion avec haptic
                            let impact = UIImpactFeedbackGenerator(style: .medium)
                            impact.impactOccurred()
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                exercise.isCompleted = true
                                dragOffset = 0
                            }
                        } else {
                            // Rebond vers la position initiale
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) {
                                dragOffset = 0
                            }
                        }
                    }
            )
        }
        .listRowInsets(.init())
        .listRowBackground(Color.clear)
        .padding(.vertical, 4)
        .padding(.horizontal)
    }
}

#Preview {
    ExerciseListView()
}
