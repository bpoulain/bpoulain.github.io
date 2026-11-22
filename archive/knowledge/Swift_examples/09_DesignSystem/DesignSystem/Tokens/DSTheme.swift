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
