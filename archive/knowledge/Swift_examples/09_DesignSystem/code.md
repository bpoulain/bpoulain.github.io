# FILETREE
- DesignSystem/DesignSystemApp.swift
- DesignSystem/Tokens/DSTokens.swift
- DesignSystem/Tokens/DSTheme.swift
- DesignSystem/Components/DSButton.swift
- DesignSystem/Components/DSCard.swift
- DesignSystem/Layout/FlowLayout.swift

# FILES

## FILE

PATH: DesignSystem/DesignSystemApp.swift

META: {"path": "DesignSystem/DesignSystemApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

@main
struct DesignSystemApp: App {
    var body: some Scene {
        WindowGroup {
            // Galerie de démonstration des composants du design system
            ComponentGalleryView()
                // Injection du thème au niveau racine
                .environment(\.dsTheme, DSTheme())
        }
    }
}

struct ComponentGalleryView: View {
    var body: some View {
        NavigationStack {
            List {
                Section("Boutons") {
                    DSButton("Primary", variant: .primary) { }
                    DSButton("Secondary", variant: .secondary) { }
                    DSButton("Ghost", variant: .ghost) { }
                    DSButton("Destructive", variant: .destructive) { }
                }
                Section("Badges") {
                    FlowLayout(spacing: 8) {
                        ForEach(["SwiftUI", "iOS", "Design System", "WidgetKit", "Swift"], id: \.self) { tag in
                            DSBadge(label: tag)
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                }
                Section("Cards") {
                    DSCard {
                        VStack(alignment: .leading, spacing: DS.Spacing.sm) {
                            Text("Titre de la card").font(.headline)
                            Text("Contenu de la card avec plusieurs lignes de texte.")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                }
            }
            .navigationTitle("Design System")
        }
    }
}
```

## FILE

PATH: DesignSystem/Tokens/DSTokens.swift

META: {"path": "DesignSystem/Tokens/DSTokens.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// Namespace pour les tokens — évite les conflits avec d'autres extensions
enum DS {
    // Tokens d'espacement — toujours utiliser ces valeurs, jamais des chiffres en dur
    enum Spacing {
        static let xxs: CGFloat = 4
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    // Tokens de rayons de bord
    enum Radius {
        static let sm: CGFloat = 6
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let full: CGFloat = 999  // capsule parfaite
    }

    // Tokens typographiques — utiliser .dsHeadline plutôt que .title2
    enum Typography {
        static let display = Font.system(size: 34, weight: .bold, design: .default)
        static let title = Font.title2.bold()
        static let headline = Font.headline
        static let body = Font.body
        static let caption = Font.caption
        static let caption2 = Font.caption2
    }
}

// Extension Color pour les tokens sémantiques
// Les couleurs sont définies dans Assets.xcassets pour le Dark Mode automatique
extension Color {
    // Utiliser des noms sémantiques, pas des valeurs hex
    static let dsBackground = Color(.systemBackground)
    static let dsSurface = Color(.secondarySystemBackground)
    static let dsAccent = Color.accentColor
    static let dsTextPrimary = Color(.label)
    static let dsTextSecondary = Color(.secondaryLabel)
    static let dsDestructive = Color(.systemRed)
    static let dsBorder = Color(.separator)
}
```

## FILE

PATH: DesignSystem/Tokens/DSTheme.swift

META: {"path": "DesignSystem/Tokens/DSTheme.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// Thème global du design system — peut être personnalisé par app
struct DSTheme {
    var accentColor: Color = .dsAccent
    var cornerRadius: CGFloat = DS.Radius.md
    var buttonCornerRadius: CGFloat = DS.Radius.full
    var fontScale: CGFloat = 1.0
}

// EnvironmentKey : injecter le thème dans tout l'arbre de vues
struct DSThemeKey: EnvironmentKey {
    static let defaultValue = DSTheme()
}

extension EnvironmentValues {
    var dsTheme: DSTheme {
        get { self[DSThemeKey.self] }
        set { self[DSThemeKey.self] = newValue }
    }
}

// Modifier pratique pour appliquer un thème
extension View {
    func dsTheme(_ theme: DSTheme) -> some View {
        environment(\.dsTheme, theme)
    }
}
```

## FILE

PATH: DesignSystem/Components/DSButton.swift

META: {"path": "DesignSystem/Components/DSButton.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: DesignSystem/Components/DSCard.swift

META: {"path": "DesignSystem/Components/DSCard.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: DesignSystem/Layout/FlowLayout.swift

META: {"path": "DesignSystem/Layout/FlowLayout.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// FlowLayout : layout qui revient à la ligne quand l'espace est insuffisant
// Utilise le Layout Protocol (iOS 16+) — remplace les solutions VStack/HStack imbriqués
struct FlowLayout: Layout {
    var spacing: CGFloat = DS.Spacing.xs
    var alignment: HorizontalAlignment = .leading

    // sizeThatFits : calculer la taille nécessaire pour afficher tous les sous-vues
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var totalHeight: CGFloat = 0
        var rowWidth: CGFloat = 0
        var rowHeight: CGFloat = 0

        for (index, subview) in subviews.enumerated() {
            let size = subview.sizeThatFits(.unspecified)
            // Revenir à la ligne si la sous-vue dépasse la largeur disponible
            if rowWidth + size.width > maxWidth, rowWidth > 0 {
                totalHeight += rowHeight + spacing
                rowWidth = 0
                rowHeight = 0
            }
            rowWidth += size.width + (index < subviews.count - 1 ? spacing : 0)
            rowHeight = max(rowHeight, size.height)
        }
        // Dernière ligne
        totalHeight += rowHeight
        return CGSize(width: maxWidth, height: totalHeight)
    }

    // placeSubviews : positionner chaque sous-vue dans le rectangle disponible
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0
        // Stocker les positions pour l'alignement horizontal
        var rowViews: [(subview: LayoutSubview, size: CGSize, x: CGFloat)] = []

        func placeRow() {
            for (subview, size, xPos) in rowViews {
                subview.place(at: CGPoint(x: xPos, y: y), proposal: ProposedViewSize(size))
            }
            rowViews.removeAll()
        }

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                placeRow()
                y += rowHeight + spacing
                x = bounds.minX
                rowHeight = 0
            }
            rowViews.append((subview: subview, size: size, x: x))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        placeRow()
    }
}

#Preview("FlowLayout — tags") {
    let tags = ["SwiftUI", "iOS 18", "Design System", "WidgetKit", "Swift 6",
                "Animations", "Gestures", "Charts", "Multiplatform"]
    FlowLayout(spacing: 8) {
        ForEach(tags, id: \.self) { tag in
            DSBadge(label: tag)
        }
    }
    .padding()
}
```
