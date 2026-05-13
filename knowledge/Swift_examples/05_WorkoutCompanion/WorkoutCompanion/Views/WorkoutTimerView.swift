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
