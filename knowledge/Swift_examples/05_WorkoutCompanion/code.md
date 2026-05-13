# FILETREE
- WorkoutCompanion/WorkoutCompanionApp.swift
- WorkoutCompanion/Models/WorkoutModels.swift
- WorkoutCompanion/Views/ExerciseListView.swift
- WorkoutCompanion/Views/WorkoutTimerView.swift

# FILES

## FILE

PATH: WorkoutCompanion/WorkoutCompanionApp.swift

META: {"path": "WorkoutCompanion/WorkoutCompanionApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

@main
struct WorkoutCompanionApp: App {
    var body: some Scene {
        WindowGroup {
            ExerciseListView()
        }
    }
}
```

## FILE

PATH: WorkoutCompanion/Models/WorkoutModels.swift

META: {"path": "WorkoutCompanion/Models/WorkoutModels.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: WorkoutCompanion/Views/ExerciseListView.swift

META: {"path": "WorkoutCompanion/Views/ExerciseListView.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: WorkoutCompanion/Views/WorkoutTimerView.swift

META: {"path": "WorkoutCompanion/Views/WorkoutTimerView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct WorkoutTimerView: View {
    let exercise: Exercise
    let namespace: Namespace.ID
    let onClose: () -> Void

    @State private var secondsElapsed: Int = 0
    @State private var isRunning = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    // Progression entre 0.0 et 1.0
    private var progress: Double {
        min(Double(secondsElapsed) / Double(exercise.duration), 1.0)
    }

    var body: some View {
        VStack(spacing: 32) {
            // Header avec hero transition depuis la liste
            HStack {
                Text(exercise.emoji)
                    .font(.system(size: 48))
                    // Même ID que dans SwipeToCompleteRow → animation hero
                    .matchedGeometryEffect(id: "emoji-\(exercise.id)", in: namespace)
                Text(exercise.name)
                    .font(.title.bold())
                    .matchedGeometryEffect(id: "name-\(exercise.id)", in: namespace)
                Spacer()
                Button("Fermer", systemImage: "xmark.circle.fill") { onClose() }
                    .foregroundStyle(.secondary)
                    .font(.title2)
            }
            .padding(.horizontal)

            Spacer()

            // Timer circulaire — Canvas pour le rendu custom
            ZStack {
                // Canvas : rendu haute performance pour le cercle de progression
                Canvas { context, size in
                    let center = CGPoint(x: size.width / 2, y: size.height / 2)
                    let radius = min(size.width, size.height) / 2 - 20

                    // Piste de fond
                    var track = Path()
                    track.addArc(center: center, radius: radius,
                                 startAngle: .degrees(-90), endAngle: .degrees(270),
                                 clockwise: false)
                    context.stroke(track, with: .color(.secondary.opacity(0.15)),
                                   style: StrokeStyle(lineWidth: 16, lineCap: .round))

                    // Arc de progression
                    let end = Angle.degrees(-90 + 360 * progress)
                    var arc = Path()
                    arc.addArc(center: center, radius: radius,
                               startAngle: .degrees(-90), endAngle: end,
                               clockwise: false)
                    context.stroke(arc, with: .color(.accentColor),
                                   style: StrokeStyle(lineWidth: 16, lineCap: .round))
                }
                .frame(width: 240, height: 240)

                // Temps au centre
                VStack(spacing: 4) {
                    Text(formattedTime)
                        .font(.system(size: 56, weight: .thin, design: .rounded))
                        .monospacedDigit()
                    Text("/ \(exercise.duration)s")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            // Boutons de contrôle
            HStack(spacing: 24) {
                Button {
                    withAnimation(reduceMotion ? .none : .spring(response: 0.3)) {
                        secondsElapsed = 0
                        isRunning = false
                    }
                } label: {
                    Image(systemName: "arrow.counterclockwise")
                        .font(.title2)
                        .frame(width: 56, height: 56)
                        .background(.regularMaterial)
                        .clipShape(Circle())
                }

                Button {
                    let impact = UIImpactFeedbackGenerator(style: .light)
                    impact.impactOccurred()
                    withAnimation(reduceMotion ? .none : .spring(response: 0.25, dampingFraction: 0.5)) {
                        isRunning.toggle()
                    }
                } label: {
                    Image(systemName: isRunning ? "pause.fill" : "play.fill")
                        .font(.title)
                        .frame(width: 72, height: 72)
                        .background(Color.accentColor)
                        .foregroundStyle(.white)
                        .clipShape(Circle())
                        // Légère mise à l'échelle au tap — feedback visuel
                        .scaleEffect(isRunning ? 0.95 : 1.0)
                }
                .buttonStyle(.plain)

                Button {
                    onClose()
                } label: {
                    Image(systemName: "forward.end.fill")
                        .font(.title2)
                        .frame(width: 56, height: 56)
                        .background(.regularMaterial)
                        .clipShape(Circle())
                }
            }
            .padding(.bottom, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.background)
        // TimelineView : met à jour la vue à chaque seconde quand le timer tourne
        .overlay {
            if isRunning {
                TimelineView(.animation(minimumInterval: 1)) { context in
                    Color.clear
                        .onChange(of: Int(context.date.timeIntervalSince1970)) { _, newValue in
                            if isRunning && secondsElapsed < exercise.duration {
                                secondsElapsed += 1
                            } else if secondsElapsed >= exercise.duration {
                                let notification = UINotificationFeedbackGenerator()
                                notification.notificationOccurred(.success)
                                isRunning = false
                            }
                        }
                }
            }
        }
    }

    private var formattedTime: String {
        let remaining = exercise.duration - secondsElapsed
        let minutes = remaining / 60
        let seconds = remaining % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

#Preview {
    @Previewable @Namespace var ns
    WorkoutTimerView(
        exercise: Exercise.samples[1],
        namespace: ns,
        onClose: { }
    )
}
```
