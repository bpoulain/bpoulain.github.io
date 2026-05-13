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
