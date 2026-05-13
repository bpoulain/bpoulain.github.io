import SwiftUI

// Composant card générique — accepte n'importe quel contenu via @ViewBuilder
struct DSCard<Content: View>: View {
    let content: Content
    var padding: CGFloat = DS.Spacing.md
    var hasShadow: Bool = true

    @Environment(\.dsTheme) private var theme

    init(padding: CGFloat = DS.Spacing.md, hasShadow: Bool = true, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.hasShadow = hasShadow
        self.content = content()
    }

    var body: some View {
        content
            .padding(padding)
            .background(Color.dsSurface)
            .clipShape(RoundedRectangle(cornerRadius: theme.cornerRadius))
            .shadow(
                color: hasShadow ? Color.black.opacity(0.06) : .clear,
                radius: 8,
                x: 0,
                y: 2
            )
    }
}

// ViewModifier version — pour usage .card() sur n'importe quelle vue
struct CardModifier: ViewModifier {
    @Environment(\.dsTheme) private var theme
    var hasShadow: Bool = true

    func body(content: Content) -> some View {
        content
            .padding(DS.Spacing.md)
            .background(Color.dsSurface)
            .clipShape(RoundedRectangle(cornerRadius: theme.cornerRadius))
            .shadow(color: hasShadow ? .black.opacity(0.06) : .clear, radius: 8, y: 2)
    }
}

extension View {
    func card(shadow: Bool = true) -> some View {
        modifier(CardModifier(hasShadow: shadow))
    }
}

// Badge — composant atomique pour les tags
struct DSBadge: View {
    let label: String
    var color: Color = .dsAccent

    var body: some View {
        Text(label)
            .font(.caption.bold())
            .foregroundStyle(color)
            .padding(.horizontal, DS.Spacing.sm)
            .padding(.vertical, DS.Spacing.xxs)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
            // Accessibilité : le badge est lisible par VoiceOver
            .accessibilityLabel("Tag : \(label)")
    }
}

#Preview("Cards") {
    VStack(spacing: DS.Spacing.md) {
        DSCard {
            VStack(alignment: .leading) {
                Text("Card standard").font(.headline)
                Text("Avec ombre et padding par défaut").foregroundStyle(.secondary)
            }
        }
        DSCard(hasShadow: false) {
            Text("Card sans ombre").font(.body)
        }
        Text("Via modifier").card()
    }
    .padding()
}
