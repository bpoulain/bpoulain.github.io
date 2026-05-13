# FILETREE
- DashboardAnalytics/DashboardAnalyticsApp.swift
- DashboardAnalytics/Models/MetricModels.swift
- DashboardAnalytics/ViewModels/DashboardViewModel.swift
- DashboardAnalytics/Views/DashboardView.swift

# FILES

## FILE

PATH: DashboardAnalytics/DashboardAnalyticsApp.swift

META: {"path": "DashboardAnalytics/DashboardAnalyticsApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

@main
struct DashboardAnalyticsApp: App {
    var body: some Scene {
        WindowGroup {
            DashboardView()
        }
    }
}
```

## FILE

PATH: DashboardAnalytics/Models/MetricModels.swift

META: {"path": "DashboardAnalytics/Models/MetricModels.swift", "sha256": "", "size": 0}

```swift
import Foundation

struct DataPoint: Identifiable {
    let id = UUID()
    let date: Date
    let value: Double
    let category: String
}

enum Period: String, CaseIterable, Identifiable {
    case lastWeek = "7 jours"
    case lastMonth = "30 jours"
    case lastQuarter = "90 jours"

    var id: String { rawValue }

    func contains(_ date: Date) -> Bool {
        let days: Int
        switch self {
        case .lastWeek: days = 7
        case .lastMonth: days = 30
        case .lastQuarter: days = 90
        }
        let cutoff = Calendar.current.date(byAdding: .day, value: -days, to: .now) ?? .now
        return date >= cutoff
    }
}

struct MetricSummary: Identifiable {
    let id = UUID()
    let title: String
    let value: Double
    let unit: String
    let trend: Double  // positif = hausse, négatif = baisse
    let systemImage: String
}

// Générateur de données synthétiques pour le développement
extension DataPoint {
    static func generateSeries(days: Int, baseValue: Double = 100, variance: Double = 20) -> [DataPoint] {
        (0..<days).map { i in
            let date = Calendar.current.date(byAdding: .day, value: -(days - i), to: .now) ?? .now
            let noise = Double.random(in: -variance...variance)
            let trend = Double(i) * 0.5  // légère tendance haussière
            return DataPoint(date: date, value: max(0, baseValue + noise + trend), category: "Série A")
        }
    }
}
```

## FILE

PATH: DashboardAnalytics/ViewModels/DashboardViewModel.swift

META: {"path": "DashboardAnalytics/ViewModels/DashboardViewModel.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: DashboardAnalytics/Views/DashboardView.swift

META: {"path": "DashboardAnalytics/Views/DashboardView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import Charts

struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Filtre de période
                    Picker("Période", selection: $viewModel.selectedPeriod) {
                        ForEach(Period.allCases) { period in
                            Text(period.rawValue).tag(period)
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)

                    // KPI cards — ViewThatFits adapte le layout à l'espace disponible
                    ViewThatFits(in: .horizontal) {
                        HStack(spacing: 12) {
                            ForEach(viewModel.summaries) { summary in
                                MetricCard(summary: summary)
                            }
                        }
                        .padding(.horizontal)

                        VStack(spacing: 12) {
                            ForEach(viewModel.summaries) { summary in
                                MetricCard(summary: summary)
                                    .frame(maxWidth: .infinity)
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Graphique en ligne interactif
                    InteractiveLineChartView(
                        data: viewModel.filteredData,
                        selectedDate: $viewModel.selectedDate
                    )
                    .padding(.horizontal)

                    // Graphique en barres hebdomadaire
                    WeeklyBarChartView(data: viewModel.weeklyTotals)
                        .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Dashboard")
        }
    }
}

// Card KPI avec indicateur de tendance
struct MetricCard: View {
    let summary: MetricSummary

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: summary.systemImage)
                    .foregroundStyle(.accentColor)
                Spacer()
                // Tendance positive en vert, négative en rouge
                Label(String(format: "%.1f%%", abs(summary.trend)),
                      systemImage: summary.trend >= 0 ? "arrow.up" : "arrow.down")
                    .font(.caption.bold())
                    .foregroundStyle(summary.trend >= 0 ? .green : .red)
            }
            Text(summary.value.formatted(.number.precision(.fractionLength(0))))
                .font(.title.bold())
            Text(summary.title + (summary.unit.isEmpty ? "" : " " + summary.unit))
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(14)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

// Graphique en ligne avec sélection interactive
struct InteractiveLineChartView: View {
    let data: [DataPoint]
    @Binding var selectedDate: Date?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Évolution")
                .font(.headline)

            Chart(data) { point in
                // Zone remplie sous la courbe
                AreaMark(
                    x: .value("Date", point.date),
                    yStart: .value("Min", 0),
                    yEnd: .value("Valeur", point.value)
                )
                .foregroundStyle(Gradient(colors: [.accentColor.opacity(0.25), .clear]))

                LineMark(
                    x: .value("Date", point.date),
                    y: .value("Valeur", point.value)
                )
                .foregroundStyle(.accentColor)
                .interpolationMethod(.catmullRom)

                // Point et tooltip sur la valeur sélectionnée
                if let selected = selectedDate,
                   Calendar.current.isDate(point.date, equalTo: selected, toGranularity: .day) {
                    PointMark(x: .value("Date", point.date), y: .value("Valeur", point.value))
                        .symbolSize(80)
                        .foregroundStyle(.accentColor)
                        .annotation(position: .top) {
                            VStack(spacing: 2) {
                                Text(point.value.formatted(.number.precision(.fractionLength(1))))
                                    .font(.caption.bold())
                                Text(point.date.formatted(date: .abbreviated, time: .omitted))
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                            }
                            .padding(6)
                            .background(.regularMaterial)
                            .clipShape(RoundedRectangle(cornerRadius: 6))
                        }
                }
            }
            // chartXSelection gère la sélection par tap/drag
            .chartXSelection(value: $selectedDate)
            .chartYAxis {
                AxisMarks(position: .leading)
            }
            .frame(height: 180)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

// Graphique en barres hebdomadaire
struct WeeklyBarChartView: View {
    let data: [(week: Date, total: Double)]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Par semaine")
                .font(.headline)

            Chart(data, id: \.week) { item in
                BarMark(
                    x: .value("Semaine", item.week, unit: .weekOfYear),
                    y: .value("Total", item.total)
                )
                .foregroundStyle(.accentColor.gradient)
                .cornerRadius(4)
                // Label d'accessibilité pour VoiceOver
                .accessibilityLabel("Semaine du \(item.week.formatted(date: .abbreviated, time: .omitted))")
                .accessibilityValue("\(Int(item.total))")
            }
            .chartXAxis {
                AxisMarks(values: .stride(by: .weekOfYear)) { value in
                    AxisValueLabel(format: .dateTime.month(.abbreviated).day())
                }
            }
            .frame(height: 160)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

#Preview {
    DashboardView()
}
```
