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
