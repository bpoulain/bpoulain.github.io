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
