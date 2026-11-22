# Concepts — Projet 5 : Workout Companion

## 1. Spring physics — animations naturelles

Les springs SwiftUI imitent la physique réelle. Trois paramètres clés :

- **response** : durée perçue de l'animation (plus petit = plus rapide)
- **dampingFraction** : amortissement (1.0 = critique sans rebond, <0.5 = rebondit beaucoup)
- **initialVelocity** : vitesse initiale (utile après un gesture pour continuer l'élan)

```swift
// Animation douce, légèrement élastique
withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
    isExpanded.toggle()
}

// Animation vive, rebondissante — type app icon tap
withAnimation(.spring(response: 0.25, dampingFraction: 0.5)) {
    isSelected = true
}

// Après un DragGesture : utiliser la vélocité pour la continuité
withAnimation(.spring(response: 0.5, dampingFraction: 0.8, blendDuration: 0.1)) {
    dragOffset = .zero
}
```

---

## 2. DragGesture — interactions type "Clear"

Clear (l'app todo) utilise des swipes calibrés pour déclencher des actions à des seuils précis.

```swift
struct SwipeToCompleteRow: View {
    @State private var dragOffset: CGFloat = 0
    // GestureState : état temporaire lié au lifecycle du gesture
    @GestureState private var isDragging = false

    // Seuil de complétion
    private let completionThreshold: CGFloat = 100

    var body: some View {
        ZStack {
            // Fond coloré visible derrière pendant le drag
            HStack {
                Image(systemName: "checkmark")
                    .foregroundStyle(.white)
                    .opacity(Double(dragOffset) / completionThreshold)
                Spacer()
            }
            .padding(.horizontal)
            .frame(maxWidth: .infinity)
            .background(Color.green)

            // Contenu principal — se déplace avec le drag
            TaskRow()
                .offset(x: dragOffset)
                .gesture(
                    DragGesture()
                        .updating($isDragging) { _, state, _ in state = true }
                        .onChanged { value in
                            // Résistance progressive : l'élément ralentit au-delà du seuil
                            if value.translation.width > 0 {
                                dragOffset = value.translation.width
                            }
                        }
                        .onEnded { value in
                            if value.translation.width > completionThreshold {
                                // Compléter avec animation spring
                                withAnimation(.spring(response: 0.3)) {
                                    completeTask()
                                }
                            } else {
                                // Rebond vers position initiale
                                withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) {
                                    dragOffset = 0
                                }
                            }
                        }
                )
        }
    }
}
```

---

## 3. MatchedGeometryEffect — Hero transitions

`@Namespace + .matchedGeometryEffect` anime la transition d'une vue entre deux emplacements dans l'UI — effet "hero" façon App Store.

```swift
struct ExerciseListView: View {
    @Namespace private var heroNamespace
    @State private var selectedExercise: Exercise?

    var body: some View {
        if let exercise = selectedExercise {
            // Vue détail — même ID dans le namespace = SwiftUI anime la transition
            ExerciseDetailView(exercise: exercise, namespace: heroNamespace) {
                withAnimation(.spring(response: 0.5)) {
                    selectedExercise = nil
                }
            }
        } else {
            List(exercises) { exercise in
                Button {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.75)) {
                        selectedExercise = exercise
                    }
                } label: {
                    ExerciseCard(exercise: exercise)
                        // Lier la vue à l'espace de nommage
                        .matchedGeometryEffect(id: exercise.id, in: heroNamespace)
                }
            }
        }
    }
}
```

---

## 4. Canvas — rendu personnalisé haute performance

`Canvas` délègue le rendu à un contexte graphique — idéal pour des visualisations complexes qui ne nécessitent pas d'interaction par élément.

```swift
// Timer circulaire — barre de progression arc
Canvas { context, size in
    let center = CGPoint(x: size.width / 2, y: size.height / 2)
    let radius = min(size.width, size.height) / 2 - 16

    // Fond de la piste
    var backgroundPath = Path()
    backgroundPath.addArc(center: center, radius: radius,
                          startAngle: .degrees(-90), endAngle: .degrees(270),
                          clockwise: false)
    context.stroke(backgroundPath, with: .color(.secondary.opacity(0.2)),
                   style: StrokeStyle(lineWidth: 12, lineCap: .round))

    // Arc de progression
    let endAngle = Angle.degrees(-90 + 360 * progress)
    var progressPath = Path()
    progressPath.addArc(center: center, radius: radius,
                        startAngle: .degrees(-90), endAngle: endAngle,
                        clockwise: false)
    context.stroke(progressPath, with: .color(.accentColor),
                   style: StrokeStyle(lineWidth: 12, lineCap: .round))
}
.frame(width: 200, height: 200)
```

---

## 5. Reduced Motion — accessibilité

Certains utilisateurs désactivent les animations (vertiges, épilepsie). Toujours respecter cette préférence.

```swift
struct AnimatedButton: View {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @State private var isPressed = false

    var body: some View {
        Button("Démarrer") {
            // Substituer l'animation par un changement instantané si nécessaire
            if reduceMotion {
                isPressed = true
            } else {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                    isPressed = true
                }
            }
        }
        .scaleEffect(isPressed ? 0.95 : 1.0)
    }
}
```

---

## 6. State machines pour les animations

Les animations complexes sont plus propres avec des états explicites plutôt que des booléens combinés.

```swift
enum WorkoutPhase {
    case idle         // En attente
    case active       // En cours d'exercice
    case resting      // Repos entre séries
    case completed    // Terminé
}

@Observable
final class WorkoutSession {
    var phase: WorkoutPhase = .idle
    var secondsRemaining: Int = 0

    // Chaque transition est explicite et testable
    func start() {
        phase = .active
        secondsRemaining = currentExercise.duration
    }

    func pauseForRest() {
        phase = .resting
        secondsRemaining = restDuration
    }

    func complete() {
        withAnimation(.spring(response: 0.4)) {
            phase = .completed
        }
    }
}
```
