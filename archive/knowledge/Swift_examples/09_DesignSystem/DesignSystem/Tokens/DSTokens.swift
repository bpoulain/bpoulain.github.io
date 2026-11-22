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
