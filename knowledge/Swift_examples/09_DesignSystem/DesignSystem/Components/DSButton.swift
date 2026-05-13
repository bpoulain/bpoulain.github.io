import SwiftUI

// Variants disponibles pour DSButton
enum DSButtonVariant {
    case primary     // fond accentColor, texte blanc
    case secondary   // fond accentColor léger, texte accentColor
    case ghost       // pas de fond, texte accentColor
    case destructive // fond rouge, texte blanc
}

// Composant bouton du design system
struct DSButton: View {
    let label: String
    let variant: DSButtonVariant
    let action: () -> Void

    @Environment(\.dsTheme) private var theme
    @Environment(\.isEnabled) private var isEnabled

    init(_ label: String, variant: DSButtonVariant = .primary, action: @escaping () -> Void) {
        self.label = label
        self.variant = variant
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.body.bold())
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(DSButtonStyle(variant: variant, cornerRadius: theme.buttonCornerRadius))
        .opacity(isEnabled ? 1.0 : 0.4)
    }
}

// ButtonStyle encapsule le pressed state — séparé de la vue pour réutilisabilité
struct DSButtonStyle: ButtonStyle {
    let variant: DSButtonVariant
    let cornerRadius: CGFloat

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(foregroundColor)
            .padding(.vertical, DS.Spacing.sm)
            .padding(.horizontal, DS.Spacing.lg)
            .background(backgroundColor(isPressed: configuration.isPressed))
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            // Overlay pour la bordure (variant secondary et ghost)
            .overlay {
                if variant == .secondary || variant == .ghost {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .strokeBorder(Color.dsAccent, lineWidth: 1.5)
                }
            }
            // Spring physics pour le feedback tactile
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.2, dampingFraction: 0.7), value: configuration.isPressed)
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary, .destructive: return .white
        case .secondary, .ghost: return .dsAccent
        }
    }

    private func backgroundColor(isPressed: Bool) -> Color {
        let base: Color
        switch variant {
        case .primary: base = .dsAccent
        case .secondary: base = .dsAccent.opacity(0.1)
        case .ghost: base = .clear
        case .destructive: base = .dsDestructive
        }
        return isPressed ? base.opacity(0.8) : base
    }
}

// Previews en galerie — chaque variant dans son contexte
#Preview("Tous les variants") {
    VStack(spacing: DS.Spacing.md) {
        DSButton("Primary", variant: .primary) { }
        DSButton("Secondary", variant: .secondary) { }
        DSButton("Ghost", variant: .ghost) { }
        DSButton("Destructive", variant: .destructive) { }
        DSButton("Désactivé") { }.disabled(true)
    }
    .padding()
}

#Preview("Dark Mode") {
    VStack(spacing: DS.Spacing.md) {
        DSButton("Primary", variant: .primary) { }
        DSButton("Secondary", variant: .secondary) { }
    }
    .padding()
    .preferredColorScheme(.dark)
}
