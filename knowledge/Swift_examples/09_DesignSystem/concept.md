# Concepts — Projet 9 : Design System

## 1. Tokens — les atomes du design system

Les tokens sont les valeurs fondamentales (couleurs, typographie, espacements) définies une fois et réutilisées partout. En SwiftUI, ils prennent la forme d'extensions et d'enums.

```swift
// Couleurs — définies dans Assets.xcassets pour le support automatique Dark Mode
extension Color {
    static let dsBackground = Color("Background")         // blanc / noir
    static let dsSurface = Color("Surface")               // gris clair / gris sombre
    static let dsAccent = Color("Accent")                 // couleur principale
    static let dsTextPrimary = Color("TextPrimary")       // noir / blanc
    static let dsTextSecondary = Color("TextSecondary")   // gris
    static let dsDestructive = Color("Destructive")       // rouge
}

// Espacements — cohérence garantie dans toute l'app
enum DS {
    enum Spacing {
        static let xxs: CGFloat = 4
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    enum Radius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let full: CGFloat = 999  // capsule
    }
}
```

---

## 2. ViewModifier — styles réutilisables

```swift
// Modifier encapsulant un style de card
struct CardModifier: ViewModifier {
    var padding: CGFloat = DS.Spacing.md
    var shadow: Bool = true

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .background(Color.dsSurface)
            .clipShape(RoundedRectangle(cornerRadius: DS.Radius.md))
            .shadow(color: .black.opacity(shadow ? 0.08 : 0), radius: 8, y: 2)
    }
}

// Extension pour usage propre : .card() plutôt que .modifier(CardModifier())
extension View {
    func card(padding: CGFloat = DS.Spacing.md, shadow: Bool = true) -> some View {
        modifier(CardModifier(padding: padding, shadow: shadow))
    }
}

// Usage
Text("Bonjour").card()
VStack { ... }.card(shadow: false)
```

---

## 3. ButtonStyle — pressed state personnalisé

```swift
struct DSPrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.bold())
            .foregroundStyle(.white)
            .padding(.vertical, DS.Spacing.sm)
            .padding(.horizontal, DS.Spacing.lg)
            .background(Color.dsAccent)
            .clipShape(Capsule())
            // configuration.isPressed : true pendant le tap
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .opacity(configuration.isPressed ? 0.85 : 1.0)
            .animation(.spring(response: 0.2), value: configuration.isPressed)
    }
}

// Usage
Button("Confirmer") { ... }
    .buttonStyle(DSPrimaryButtonStyle())

// Ou via une extension propre
extension ButtonStyle where Self == DSPrimaryButtonStyle {
    static var dsPrimary: Self { Self() }
}
Button("Confirmer") { ... }.buttonStyle(.dsPrimary)
```

---

## 4. SwiftUI Layout Protocol — layouts entièrement custom

Le `Layout` Protocol (iOS 16+) permet de créer des conteneurs de mise en page sur mesure.

```swift
// FlowLayout : dispose les éléments en ligne et revient à la ligne quand nécessaire
// Idéal pour les tags, badges, chips
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? 0
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                y += rowHeight + spacing
                x = 0
                rowHeight = 0
            }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        return CGSize(width: maxWidth, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                y += rowHeight + spacing
                x = bounds.minX
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}

// Usage
FlowLayout(spacing: 8) {
    ForEach(tags, id: \.self) { tag in
        DSBadge(label: tag)
    }
}
```

---

## 5. EnvironmentKey — thème injecté

```swift
// 1. Définir le thème
struct DSTheme {
    var accentColor: Color = .blue
    var cornerRadius: CGFloat = DS.Radius.md
    var fontScale: CGFloat = 1.0
}

// 2. Créer la clé d'environnement
struct DSThemeKey: EnvironmentKey {
    static let defaultValue = DSTheme()
}

extension EnvironmentValues {
    var dsTheme: DSTheme {
        get { self[DSThemeKey.self] }
        set { self[DSThemeKey.self] = newValue }
    }
}

// 3. Injecter à la racine
ContentView()
    .environment(\.dsTheme, DSTheme(accentColor: .purple))

// 4. Lire dans les composants
struct DSButton: View {
    @Environment(\.dsTheme) private var theme

    var body: some View {
        Button("...") { }
            .foregroundStyle(theme.accentColor)
            .clipShape(RoundedRectangle(cornerRadius: theme.cornerRadius))
    }
}
```

---

## 6. Previews avancées — galerie de composants

```swift
// Afficher tous les variants d'un composant dans une seule preview
#Preview("DSButton — tous les variants") {
    VStack(spacing: 16) {
        DSButton("Primary", variant: .primary) { }
        DSButton("Secondary", variant: .secondary) { }
        DSButton("Ghost", variant: .ghost) { }
        DSButton("Destructive", variant: .destructive) { }
        DSButton("Désactivé", variant: .primary) { }.disabled(true)
    }
    .padding()
}

#Preview("Dark Mode") {
    DSButton("Primary", variant: .primary) { }
        .padding()
        .preferredColorScheme(.dark)
}

#Preview("Dynamic Type — Accessibility XL") {
    DSButton("Primary", variant: .primary) { }
        .environment(\.sizeCategory, .accessibilityExtraLarge)
        .padding()
}
```
