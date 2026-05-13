import SwiftUI
import Charts

struct ChartsView: View {
    let viewModel: ExpenseViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Graphique en secteurs par catégorie
                VStack(alignment: .leading, spacing: 8) {
                    Text("Par catégorie")
                        .font(.headline)
                        .padding(.horizontal)

                    Chart(viewModel.categoryTotals) { item in
                        SectorMark(
                            angle: .value("Total", item.total),
                            innerRadius: .ratio(0.5),  // donut chart
                            angularInset: 2
                        )
                        .foregroundStyle(by: .value("Catégorie", item.category.rawValue))
                        // accessibilityLabel : description lisible par VoiceOver
                        .accessibilityLabel("\(item.category.rawValue) : \(item.total.formatted(.currency(code: "EUR")))")
                    }
                    .frame(height: 240)
                    .padding(.horizontal)
                }
                .padding(.vertical)
                .background(.regularMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16))

                // Graphique en barres par montant
                VStack(alignment: .leading, spacing: 8) {
                    Text("Détail")
                        .font(.headline)
                        .padding(.horizontal)

                    Chart(viewModel.categoryTotals) { item in
                        BarMark(
                            x: .value("Catégorie", item.category.rawValue),
                            y: .value("Montant", item.total)
                        )
                        .foregroundStyle(by: .value("Catégorie", item.category.rawValue))
                        .annotation(position: .top) {
                            Text(item.total.formatted(.currency(code: "EUR")))
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .chartYAxis { AxisMarks(format: .currency(code: "EUR")) }
                    .frame(height: 200)
                    .padding(.horizontal)
                }
                .padding(.vertical)
                .background(.regularMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .padding()
        }
        .navigationTitle("Graphiques")
        .navigationBarTitleDisplayMode(.inline)
    }
}
