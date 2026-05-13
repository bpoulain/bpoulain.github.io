# Concepts — Projet 7 : WidgetKit App

## 1. Le modèle stateless des widgets

Un widget n'est **pas** une vue SwiftUI réactive. C'est une **série de snapshots** que le système rend comme des images statiques à des moments précis.

```
App normale : État → Vue réactive → Interaction en temps réel
Widget       : Timeline[snapshot1, snapshot2, ...] → Rendu statique à chaque entrée
```

**Conséquence** : pas de `@State`, pas d'animations live, pas d'appels réseau dans le widget lui-même. Toutes les données sont préparées à l'avance par le `TimelineProvider`.

---

## 2. TimelineProvider — le cœur d'un widget

Le `TimelineProvider` fournit au système les snapshots qui seront affichés.

```swift
struct HabitTimelineProvider: TimelineProvider {
    // snapshot : affiché dans la galerie de widgets (preview rapide)
    func placeholder(in context: Context) -> HabitEntry {
        HabitEntry(date: .now, habits: Habit.previews)
    }

    // getSnapshot : affiché en prévisualisation, doit être instantané
    func getSnapshot(in context: Context, completion: @escaping (HabitEntry) -> Void) {
        let entry = HabitEntry(date: .now, habits: loadHabits())
        completion(entry)
    }

    // getTimeline : prépare la séquence de snapshots pour les prochaines heures
    func getTimeline(in context: Context, completion: @escaping (Timeline<HabitEntry>) -> Void) {
        let habits = loadHabits()
        let entry = HabitEntry(date: .now, habits: habits)

        // .atEnd : demander un refresh après la dernière entrée
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }

    private func loadHabits() -> [Habit] {
        // Lire depuis l'App Group shared UserDefaults
        let defaults = UserDefaults(suiteName: "group.com.monapp.habits")
        let data = defaults?.data(forKey: "habits") ?? Data()
        return (try? JSONDecoder().decode([Habit].self, from: data)) ?? []
    }
}
```

---

## 3. TimelineEntry — snapshot à un instant T

```swift
struct HabitEntry: TimelineEntry {
    // date est requis par le protocole — indique quand afficher ce snapshot
    let date: Date
    let habits: [Habit]
    let completedCount: Int

    init(date: Date, habits: [Habit]) {
        self.date = date
        self.habits = habits
        self.completedCount = habits.filter { $0.isCompleted }.count
    }
}
```

---

## 4. App Groups — partager des données

Un widget est une extension séparée de l'app principale. Pour partager des données, utiliser un **App Group** dans les Capabilities Xcode.

```swift
// Dans l'app principale — sauvegarder les données dans le groupe partagé
let sharedDefaults = UserDefaults(suiteName: "group.com.monapp.habits")!

func saveHabits(_ habits: [Habit]) {
    let data = try? JSONEncoder().encode(habits)
    sharedDefaults.set(data, forKey: "habits")
    // Demander au widget de se rafraîchir
    WidgetCenter.shared.reloadAllTimelines()
}

// Dans le widget — lire les données partagées
let sharedDefaults = UserDefaults(suiteName: "group.com.monapp.habits")!
let habits = /* décoder depuis sharedDefaults */
```

---

## 5. Deep linking — ouvrir l'app depuis le widget

```swift
// Dans la vue widget — chaque zone est un lien
struct HabitWidgetView: View {
    let entry: HabitEntry

    var body: some View {
        // widgetURL : lien sur tout le widget
        VStack { ... }
            .widgetURL(URL(string: "monapp://habits"))

        // Ou des liens précis par élément (pour medium/large)
        ForEach(entry.habits) { habit in
            Link(destination: URL(string: "monapp://habit/\(habit.id)")!) {
                HabitMiniRow(habit: habit)
            }
        }
    }
}

// Dans l'app principale — intercepter le lien
.onOpenURL { url in
    if url.host == "habit", let id = url.pathComponents.last {
        // Naviguer vers l'habitude correspondante
        selectedHabitId = UUID(uuidString: id)
    }
}
```

---

## 6. App Intents — actions depuis Siri et Shortcuts

`AppIntent` permet d'exposer des actions de ton app à Siri, Spotlight et Raccourcis.

```swift
// Définir l'intent
struct CheckHabitIntent: AppIntent {
    static var title: LocalizedStringResource = "Cocher une habitude"
    static var description = IntentDescription("Marque une habitude comme complétée")

    // Paramètre configurable par l'utilisateur
    @Parameter(title: "Habitude")
    var habitName: String

    func perform() async throws -> some IntentResult {
        // Logique métier : cocher l'habitude
        HabitStore.shared.complete(named: habitName)
        return .result(dialog: "\(habitName) ✅")
    }
}

// Widget interactif — bouton qui déclenche l'intent
Button(intent: CheckHabitIntent()) {
    Image(systemName: "checkmark.circle")
}
```

---

## 7. WidgetBundle — plusieurs widgets dans un target

```swift
@main
struct MyWidgetBundle: WidgetBundle {
    var body: some Widget {
        HabitWidget()       // widget principal
        StreakWidget()      // widget secondaire
        LockScreenWidget()  // widget Lock Screen
    }
}
```
