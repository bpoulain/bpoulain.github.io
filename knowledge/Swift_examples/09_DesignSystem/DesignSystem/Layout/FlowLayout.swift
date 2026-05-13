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
