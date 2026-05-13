import Foundation

@Observable
final class DashboardViewModel {
    var selectedPeriod: Period = .lastMonth
    var selectedDate: Date?

    // Données brutes — simulées ici, viendraient d'une API en prod
    private let allData: [DataPoint] = DataPoint.generateSeries(days: 90)

    // Filtered par période — computed, jamais stocké
    var filteredData: [DataPoint] {
        allData.filter { selectedPeriod.contains($0.date) }
    }

    // Agrégation hebdomadaire — calculée une fois depuis filteredData
    var weeklyTotals: [(week: Date, total: Double)] {
        let calendar = Calendar.current
        let grouped = Dictionary(grouping: filteredData) { point in
            calendar.date(from: calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: point.date)) ?? point.date
        }
        return grouped
            .map { (week: $0.key, total: $0.value.reduce(0) { $0 + $1.value }) }
            .sorted { $0.week < $1.week }
    }

    // Métriques résumées pour les KPI cards
    var summaries: [MetricSummary] {
        let total = filteredData.reduce(0) { $0 + $1.value }
        let avg = total / Double(max(filteredData.count, 1))
        let max = filteredData.max(by: { $0.value < $1.value })?.value ?? 0

        return [
            MetricSummary(title: "Total", value: total, unit: "", trend: 12.4, systemImage: "chart.line.uptrend.xyaxis"),
            MetricSummary(title: "Moyenne", value: avg, unit: "/jour", trend: 3.2, systemImage: "equal.circle"),
            MetricSummary(title: "Max", value: max, unit: "", trend: 8.7, systemImage: "arrow.up.circle"),
        ]
    }
}
