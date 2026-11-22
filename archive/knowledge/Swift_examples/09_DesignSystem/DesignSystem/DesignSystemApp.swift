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
