import Foundation
import SwiftData

// Structure légère pour les données agrégées (pas @Model — pas persistée)
struct CategoryTotal: Identifiable {
    var id: String { category.rawValue }
    let category: ExpenseCategory
    let total: Double
}

@Observable
final class ExpenseViewModel {
    var selectedCategory: ExpenseCategory?
    var selectedMonth: Date = .now

    private var modelContext: ModelContext?
    private(set) var expenses: [Expense] = []

    func configure(with context: ModelContext) {
        self.modelContext = context
        refresh()
    }

    func refresh() {
        guard let context = modelContext else { return }
        let descriptor = FetchDescriptor<Expense>(
            sortBy: [SortDescriptor(\Expense.date, order: .reverse)]
        )
        expenses = (try? context.fetch(descriptor)) ?? []
    }

    // Filtre combiné catégorie + mois — dérivé, jamais stocké
    var filteredExpenses: [Expense] {
        let calendar = Calendar.current
        return expenses.filter { expense in
            let matchesCategory = selectedCategory == nil || expense.category == selectedCategory
            let matchesMonth = calendar.isDate(expense.date, equalTo: selectedMonth, toGranularity: .month)
            return matchesCategory && matchesMonth
        }
    }

    // Total du mois sélectionné — computed property
    var monthTotal: Double {
        filteredExpenses.reduce(0) { $0 + $1.amount }
    }

    // Totaux groupés par catégorie pour les Charts
    var categoryTotals: [CategoryTotal] {
        let grouped = Dictionary(grouping: filteredExpenses, by: \.category)
        return grouped
            .map { CategoryTotal(category: $0.key, total: $0.value.reduce(0) { $0 + $1.amount }) }
            .sorted { $0.total > $1.total }
    }

    func add(_ expense: Expense) {
        modelContext?.insert(expense)
        refresh()
    }

    func delete(_ expense: Expense) {
        modelContext?.delete(expense)
        refresh()
    }
}
