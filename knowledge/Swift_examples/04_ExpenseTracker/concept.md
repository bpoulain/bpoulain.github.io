# Concepts — Projet 4 : Expense Tracker

## 1. Swift Charts — visualisation de données native

Le framework `Charts` (iOS 16+) produit des graphiques accessibles, animés et Dark Mode natifs.

```swift
import Charts

// Graphique en barres par catégorie
Chart(expensesByCategory) { item in
    BarMark(
        x: .value("Catégorie", item.category),
        y: .value("Total", item.total)
    )
    .foregroundStyle(by: .value("Catégorie", item.category))
    .annotation(position: .top) {
        Text(item.total.formatted(.currency(code: "EUR")))
            .font(.caption2)
    }
}
.chartXAxis { ... }
.chartLegend(position: .bottom)
.frame(height: 200)
```

---

## 2. Derived state — computed properties

Les totaux, moyennes et statistiques ne doivent jamais être stockés — ils se calculent à partir des données source.

```swift
@Observable
final class ExpenseViewModel {
    var expenses: [Expense] = []

    // Dérivé automatiquement — jamais stocké en base
    var totalThisMonth: Double {
        let calendar = Calendar.current
        return expenses
            .filter { calendar.isDate($0.date, equalTo: .now, toGranularity: .month) }
            .reduce(0) { $0 + $1.amount }
    }

    var byCategory: [String: Double] {
        Dictionary(grouping: expenses, by: \.category.name)
            .mapValues { $0.reduce(0) { $0 + $1.amount } }
    }
}
```

---

## 3. Domain models — séparer données et UI

Un domain model représente le métier indépendamment de la persistance.

```swift
// Domain model : représente la logique métier
struct Budget {
    let category: Category
    let monthlyLimit: Double

    var isOverBudget: Bool { spent > monthlyLimit }
    var progress: Double { min(spent / monthlyLimit, 1.0) }
    var remaining: Double { max(monthlyLimit - spent, 0) }

    // La dépense actuelle est injectée — pas stockée dans le model
    var spent: Double = 0
}

enum Category: String, CaseIterable, Identifiable {
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
```

---

## 4. Environment injection

`@Environment` partage des objets dans tout le sous-arbre de vues sans prop drilling.

```swift
// Créer une clé d'environment personnalisée
struct ExpenseViewModelKey: EnvironmentKey {
    static let defaultValue = ExpenseViewModel()
}

extension EnvironmentValues {
    var expenseViewModel: ExpenseViewModel {
        get { self[ExpenseViewModelKey.self] }
        set { self[ExpenseViewModelKey.self] = newValue }
    }
}

// Injecter à la racine
ContentView()
    .environment(\.expenseViewModel, ExpenseViewModel())

// Lire dans n'importe quelle sous-vue
struct AnyChildView: View {
    @Environment(\.expenseViewModel) private var viewModel
}
```

---

## 5. Formatage monétaire

```swift
// Méthode moderne — utilise la Locale courante automatiquement
amount.formatted(.currency(code: "EUR"))  // "12,50 €" en France

// Avec contrôle de la Locale
let formatter = NumberFormatter()
formatter.numberStyle = .currency
formatter.locale = Locale(identifier: "fr_FR")
formatter.string(from: NSNumber(value: amount))

// Dans une vue — réagit automatiquement au changement de Locale
Text(expense.amount, format: .currency(code: "EUR"))
```

---

## 6. Filtres et tri

```swift
@Observable
final class ExpenseViewModel {
    var expenses: [Expense] = []
    var selectedCategory: Category?
    var selectedPeriod: Period = .thisMonth

    // Le filtre est une computed property — se recalcule automatiquement
    var filteredExpenses: [Expense] {
        expenses
            .filter { selectedCategory == nil || $0.category == selectedCategory }
            .filter { selectedPeriod.contains($0.date) }
            .sorted { $0.date > $1.date }
    }
}

// Picker de filtre dans la toolbar
Picker("Période", selection: $viewModel.selectedPeriod) {
    ForEach(Period.allCases) { period in
        Text(period.label).tag(period)
    }
}
.pickerStyle(.segmented)
```
