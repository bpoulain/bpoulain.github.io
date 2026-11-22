# Concepts — Projet 8 : Dashboard Analytics

## 1. Swift Charts — les différentes marques

```swift
// LineMark — courbe temporelle
Chart(dataPoints) { point in
    LineMark(x: .value("Date", point.date), y: .value("Valeur", point.value))
        .interpolationMethod(.catmullRom)  // courbe lissée
    AreaMark(x: .value("Date", point.date), y: .value("Valeur", point.value))
        .foregroundStyle(Gradient(colors: [.accentColor.opacity(0.3), .clear]))
}

// BarMark — comparaison catégories
Chart(categories) { cat in
    BarMark(x: .value("Catégorie", cat.name), y: .value("Total", cat.value))
        .annotation(position: .top) {
            Text(cat.value.formatted(.number.precision(.fractionLength(0))))
                .font(.caption2)
        }
}

// PointMark — scatter plot
Chart(points) { p in
    PointMark(x: .value("X", p.x), y: .value("Y", p.y))
        .symbolSize(p.size * 100)
        .foregroundStyle(by: .value("Groupe", p.group))
}
```

---

## 2. Graphique interactif — sélection et tooltip

```swift
struct InteractiveLineChart: View {
    let data: [DataPoint]
    @State private var selectedDate: Date?

    var body: some View {
        Chart(data) { point in
            LineMark(x: .value("Date", point.date), y: .value("Valeur", point.value))
            // Marquer la valeur sélectionnée
            if let selected = selectedDate, Calendar.current.isDate(point.date, equalTo: selected, toGranularity: .day) {
                PointMark(x: .value("Date", point.date), y: .value("Valeur", point.value))
                    .symbolSize(100)
                    .annotation(position: .top) {
                        TooltipView(point: point)
                    }
            }
        }
        // chartXSelection : gère le tap/drag pour sélectionner une valeur
        .chartXSelection(value: $selectedDate)
    }
}
```

---

## 3. GeometryReader — layouts proportionnels

`GeometryReader` expose la taille disponible pour créer des layouts proportionnels.

```swift
struct ProportionalGrid: View {
    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 3  // 3 colonnes égales
            let spacing: CGFloat = 12
            let cardWidth = columnWidth - spacing

            HStack(spacing: spacing) {
                MetricCard(title: "Visiteurs").frame(width: cardWidth)
                MetricCard(title: "Sessions").frame(width: cardWidth)
                MetricCard(title: "Durée").frame(width: cardWidth)
            }
        }
    }
}

// Moderne (iOS 17+) : containerRelativeFrame remplace souvent GeometryReader
MetricCard()
    .containerRelativeFrame(.horizontal, count: 3, spacing: 12)
```

---

## 4. PreferenceKey — communication enfant → parent

Les données remontent normalement via des closures ou des bindings. `PreferenceKey` permet à un enfant de "remonter" une valeur dans l'arbre sans prop drilling.

```swift
// Définir une PreferenceKey
struct ChartHeightPreference: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())  // garder la hauteur maximale
    }
}

// Dans un composant enfant — "poster" la valeur
struct ChartView: View {
    var body: some View {
        Chart { ... }
            .background(
                GeometryReader { geo in
                    Color.clear
                        .preference(key: ChartHeightPreference.self, value: geo.size.height)
                }
            )
    }
}

// Dans le parent — "recevoir" la valeur
struct DashboardView: View {
    @State private var chartHeight: CGFloat = 0

    var body: some View {
        VStack {
            ChartView()
            Text("Hauteur du graphique : \(Int(chartHeight))pt")
        }
        .onPreferenceChange(ChartHeightPreference.self) { height in
            chartHeight = height
        }
    }
}
```

---

## 5. ViewThatFits — layout adaptatif automatique

`ViewThatFits` essaie chaque vue dans l'ordre et affiche la première qui tient dans l'espace disponible.

```swift
// Sur iPhone compact : 1 colonne. Sur iPad : 3 colonnes.
ViewThatFits {
    // Version large — iPad
    HStack(spacing: 16) {
        MetricCard(title: "Ventes")
        MetricCard(title: "Commandes")
        MetricCard(title: "Revenus")
    }
    // Version compacte — iPhone
    VStack(spacing: 12) {
        MetricCard(title: "Ventes")
        MetricCard(title: "Commandes")
        MetricCard(title: "Revenus")
    }
}
```

---

## 6. Memoization — éviter les recalculs

```swift
@Observable
final class DashboardViewModel {
    var rawData: [DataPoint] = []
    var selectedPeriod: Period = .lastMonth

    // Recalculé uniquement quand rawData ou selectedPeriod change
    // (pas à chaque re-render de la vue)
    var filteredData: [DataPoint] {
        rawData.filter { selectedPeriod.contains($0.date) }
    }

    // Agrégation coûteuse — ne calculer qu'une fois
    var weeklyAggregation: [WeeklyTotal] {
        Dictionary(grouping: filteredData) { point in
            Calendar.current.startOfWeekISO8601(for: point.date)
        }
        .map { WeeklyTotal(week: $0.key, total: $0.value.reduce(0) { $0 + $1.value }) }
        .sorted { $0.week < $1.week }
    }
}
```
