# Concepts — Projet 1 : Habit Tracker

## 1. Le paradigme déclaratif

En SwiftUI tu **déclares** ce que l'UI doit afficher, pas comment l'afficher étape par étape.

```swift
// Impératif (UIKit) : tu pilotes manuellement
label.text = "7 jours"
label.isHidden = streak == 0

// Déclaratif (SwiftUI) : tu décris l'état voulu
if streak > 0 {
    Text("\(streak) jours")
}
```

La vue est une **fonction pure du state** : quand le state change, SwiftUI recalcule `body` et met à jour uniquement les parties concernées.

---

## 2. @State — source de vérité locale

`@State` marque une propriété comme mutable ET observée. SwiftUI relit `body` chaque fois que la valeur change.

```swift
struct CounterView: View {
    @State private var count = 0  // toujours private

    var body: some View {
        Button("Tap: \(count)") {
            count += 1  // provoque un recalcul de body
        }
    }
}
```

**Règle** : `@State` est toujours `private`. C'est l'état interne de la vue.

---

## 3. @Binding — partager l'état sans en être propriétaire

`@Binding` est un lien bidirectionnel vers un `@State` parent. L'enfant peut lire et modifier la valeur sans la posséder.

```swift
struct ParentView: View {
    @State private var isOn = false

    var body: some View {
        ToggleRow(isOn: $isOn)  // le $ crée un Binding
    }
}

struct ToggleRow: View {
    @Binding var isOn: Bool  // pas de valeur initiale — vient du parent

    var body: some View {
        Toggle("Actif", isOn: $isOn)
    }
}
```

---

## 4. Value types et Identifiable

Les modèles SwiftUI sont des **structs** (value types). Modifier une struct crée une copie — SwiftUI détecte la différence et met à jour l'UI.

`Identifiable` fournit un `id` unique que `ForEach` utilise pour tracker chaque élément sans confusion :

```swift
struct Habit: Identifiable {
    let id = UUID()  // UUID garantit l'unicité globale
    var name: String
    var isCompleted: Bool
}
```

---

## 5. NavigationStack

`NavigationStack` gère la pile de navigation push moderne (iOS 16+). Il remplace `NavigationView`.

```swift
NavigationStack {
    List(habits) { habit in
        NavigationLink(habit.name) {
            HabitDetailView(habit: habit)
        }
    }
    .navigationTitle("Habitudes")
    .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
            Button("Ajouter", systemImage: "plus") { ... }
        }
    }
}
```

---

## 6. withAnimation — animer les changements de state

`withAnimation` enveloppe une mutation de state pour que SwiftUI anime la transition :

```swift
Button {
    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
        habit.isCompleted.toggle()
    }
} label: {
    Image(systemName: habit.isCompleted ? "checkmark.circle.fill" : "circle")
}
```

---

## 7. Xcode Previews workflow

`#Preview` génère une prévisualisation live sans lancer le simulateur. C'est ton outil de prototypage principal.

```swift
#Preview("iPhone 16") {
    ContentView()
}

#Preview("Ligne seule") {
    // .constant() crée un Binding figé — idéal pour les previews de composants
    HabitRowView(habit: .constant(Habit(name: "Coder", emoji: "💻")))
        .padding()
}

#Preview("Dark Mode") {
    ContentView()
        .preferredColorScheme(.dark)
}
```

**Tips** :
- Crée plusieurs previews avec différentes données de test
- Utilise `.previewDevice()` pour tester sur iPhone SE vs Pro Max
- Les previews sont des specs vivantes — garde-les à jour
