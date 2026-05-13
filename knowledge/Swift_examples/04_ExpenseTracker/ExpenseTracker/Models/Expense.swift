import Foundation
import SwiftData

// Catégories comme enum Swift — type-safe, exhaustif, itérable
enum ExpenseCategory: String, Codable, CaseIterable, Identifiable {
    case food = "Alimentation"
    case transport = "Transport"
    case entertainment = "Loisirs"
    case health = "Santé"
    case other = "Autre"

    var id: String { rawValue }

    var systemImage: String {
        switch self {
        case .food: return "fork.knife"
        case .transport: return "car.fill"
        case .entertainment: return "gamecontroller.fill"
        case .health: return "heart.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }
}

@Model
final class Expense {
    var title: String
    var amount: Double
    var category: ExpenseCategory
    var date: Date
    var note: String

    init(title: String, amount: Double, category: ExpenseCategory, date: Date = .now) {
        self.title = title
        self.amount = amount
        self.category = category
        self.date = date
        self.note = ""
    }
}

// Extension de données pour le développement
extension Expense {
    static let samples: [Expense] = [
        Expense(title: "Courses Monoprix", amount: 42.50, category: .food),
        Expense(title: "Métro mensuel", amount: 84.10, category: .transport),
        Expense(title: "Netflix", amount: 15.99, category: .entertainment),
        Expense(title: "Médecin", amount: 25.00, category: .health),
    ]
}
