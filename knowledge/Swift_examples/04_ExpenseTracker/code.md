# FILETREE
- ExpenseTracker/ExpenseTrackerApp.swift
- ExpenseTracker/Models/Expense.swift
- ExpenseTracker/ViewModels/ExpenseViewModel.swift
- ExpenseTracker/Views/ExpenseListView.swift
- ExpenseTracker/Views/ChartsView.swift

# FILES

## FILE

PATH: ExpenseTracker/ExpenseTrackerApp.swift

META: {"path": "ExpenseTracker/ExpenseTrackerApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

@main
struct ExpenseTrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ExpenseListView()
        }
        .modelContainer(for: Expense.self)
    }
}
```

## FILE

PATH: ExpenseTracker/Models/Expense.swift

META: {"path": "ExpenseTracker/Models/Expense.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: ExpenseTracker/ViewModels/ExpenseViewModel.swift

META: {"path": "ExpenseTracker/ViewModels/ExpenseViewModel.swift", "sha256": "", "size": 0}

```swift
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
```

## FILE

PATH: ExpenseTracker/Views/ExpenseListView.swift

META: {"path": "ExpenseTracker/Views/ExpenseListView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

struct ExpenseListView: View {
    @Environment(\.modelContext) private var context
    @State private var viewModel = ExpenseViewModel()
    @State private var showingAddExpense = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Résumé mensuel
                MonthlySummaryView(total: viewModel.monthTotal)
                    .padding()
                    .background(.regularMaterial)

                // Filtre par catégorie
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        CategoryFilterButton(
                            label: "Tout",
                            isSelected: viewModel.selectedCategory == nil
                        ) { viewModel.selectedCategory = nil }

                        ForEach(ExpenseCategory.allCases) { cat in
                            CategoryFilterButton(
                                label: cat.rawValue,
                                isSelected: viewModel.selectedCategory == cat
                            ) { viewModel.selectedCategory = cat }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }

                List {
                    ForEach(viewModel.filteredExpenses) { expense in
                        ExpenseRowView(expense: expense)
                            .swipeActions(edge: .trailing) {
                                Button("Supprimer", systemImage: "trash", role: .destructive) {
                                    viewModel.delete(expense)
                                }
                            }
                    }
                }
                .listStyle(.plain)
            }
            .navigationTitle("Dépenses")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Ajouter", systemImage: "plus") {
                        showingAddExpense = true
                    }
                }
                ToolbarItem(placement: .topBarLeading) {
                    NavigationLink {
                        ChartsView(viewModel: viewModel)
                    } label: {
                        Image(systemName: "chart.bar.fill")
                    }
                }
            }
            .sheet(isPresented: $showingAddExpense) {
                AddExpenseView { expense in
                    viewModel.add(expense)
                }
            }
        }
        .onAppear { viewModel.configure(with: context) }
    }
}

struct MonthlySummaryView: View {
    let total: Double

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Ce mois-ci")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(total, format: .currency(code: "EUR"))
                    .font(.title.bold())
            }
            Spacer()
        }
    }
}

struct CategoryFilterButton: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.15))
                .foregroundStyle(isSelected ? .white : .primary)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

struct ExpenseRowView: View {
    let expense: Expense

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: expense.category.systemImage)
                .font(.title3)
                .foregroundStyle(.accentColor)
                .frame(width: 36, height: 36)
                .background(Color.accentColor.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))

            VStack(alignment: .leading, spacing: 2) {
                Text(expense.title)
                    .font(.body)
                Text(expense.date.formatted(date: .abbreviated, time: .omitted))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text(expense.amount, format: .currency(code: "EUR"))
                .font(.body.bold())
        }
        .padding(.vertical, 4)
    }
}

struct AddExpenseView: View {
    let onAdd: (Expense) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var amountText = ""
    @State private var category: ExpenseCategory = .food
    @State private var date = Date.now

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Libellé", text: $title)
                    TextField("Montant", text: $amountText)
                        .keyboardType(.decimalPad)
                }
                Section {
                    Picker("Catégorie", selection: $category) {
                        ForEach(ExpenseCategory.allCases) { cat in
                            Label(cat.rawValue, systemImage: cat.systemImage).tag(cat)
                        }
                    }
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }
            }
            .navigationTitle("Nouvelle dépense")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        if let amount = Double(amountText.replacingOccurrences(of: ",", with: ".")) {
                            onAdd(Expense(title: title, amount: amount, category: category, date: date))
                            dismiss()
                        }
                    }
                    .disabled(title.isEmpty || Double(amountText.replacingOccurrences(of: ",", with: ".")) == nil)
                }
            }
        }
    }
}
```

## FILE

PATH: ExpenseTracker/Views/ChartsView.swift

META: {"path": "ExpenseTracker/Views/ChartsView.swift", "sha256": "", "size": 0}

```swift
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
```
