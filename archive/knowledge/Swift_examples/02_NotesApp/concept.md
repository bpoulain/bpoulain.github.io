# Concepts — Projet 2 : Notes App

## 1. SwiftData — persistance moderne

SwiftData remplace Core Data. La macro `@Model` génère automatiquement la plomberie de persistance.

```swift
import SwiftData

// @Model transforme la classe en entité persistante
// final class : SwiftData requiert des classes (reference types)
@Model
final class Note {
    var title: String
    var content: String
    var isFavorite: Bool
    var updatedAt: Date

    init(title: String = "") {
        self.title = title
        self.content = ""
        self.isFavorite = false
        self.updatedAt = .now
    }
}
```

### Configurer le container

```swift
@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup {
            NoteListView()
        }
        // modelContainer injecte le context dans tout l'arbre de vues
        .modelContainer(for: Note.self)
    }
}
```

---

## 2. @Query — observer la base de données

`@Query` observe les changements SwiftData et recharge la vue automatiquement. Il remplace `FetchRequest` de CoreData.

```swift
struct NoteListView: View {
    // Tri par date décroissante
    @Query(sort: \Note.updatedAt, order: .reverse) private var notes: [Note]

    // Filtrage avec prédicat typé (Swift macros)
    @Query(filter: #Predicate<Note> { $0.isFavorite == true })
    private var favorites: [Note]
}
```

---

## 3. @Bindable — modifier un @Model directement

`@Bindable` crée des Bindings sur les propriétés d'un objet `@Model`. Exactement comme `@State` mais pour les objets persistés.

```swift
struct NoteEditorView: View {
    // @Bindable : reçu depuis le parent, peut modifier les propriétés
    @Bindable var note: Note

    var body: some View {
        // $note.title crée un Binding<String> directement sur SwiftData
        TextField("Titre", text: $note.title)
        TextEditor(text: $note.content)
    }
}
```

---

## 4. modelContext — insérer et supprimer

```swift
struct NoteListView: View {
    // Injecté automatiquement par modelContainer
    @Environment(\.modelContext) private var context

    func addNote() {
        let note = Note(title: "Sans titre")
        context.insert(note)  // persisté automatiquement
    }

    func deleteNote(_ note: Note) {
        context.delete(note)  // suppression persistée
    }
}
```

---

## 5. AppStorage — préférences légères

`@AppStorage` est un wrapper `UserDefaults` typé. Idéal pour les préférences simples qui doivent survivre aux relances.

```swift
struct SettingsView: View {
    // Clé UserDefaults + valeur par défaut
    @AppStorage("fontSize") private var fontSize: Double = 16
    @AppStorage("showDates") private var showDates: Bool = true

    var body: some View {
        // Réagit comme @State : un changement recharge la vue
        Toggle("Afficher les dates", isOn: $showDates)
        Slider(value: $fontSize, in: 12...24)
    }
}
```

---

## 6. TextEditor et FocusState

`TextEditor` est la zone de saisie multiligne native. `@FocusState` contrôle quel champ a le focus clavier.

```swift
struct EditorView: View {
    @Bindable var note: Note
    // Enum pour nommer les champs qui peuvent avoir le focus
    @FocusState private var focusedField: Field?
    enum Field { case title, content }

    var body: some View {
        TextField("Titre", text: $note.title)
            .focused($focusedField, equals: .title)
            .onSubmit { focusedField = .content }  // Tab vers le contenu

        TextEditor(text: $note.content)
            .focused($focusedField, equals: .content)
            .toolbar {
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("OK") { focusedField = nil }
                }
            }
    }
}
```

---

## 7. swipeActions — actions contextuelles

```swift
ForEach(notes) { note in
    NoteRowView(note: note)
        .swipeActions(edge: .trailing) {
            Button("Supprimer", systemImage: "trash", role: .destructive) {
                context.delete(note)
            }
        }
        .swipeActions(edge: .leading) {
            Button(note.isFavorite ? "Défavoris" : "Favoris",
                   systemImage: note.isFavorite ? "star.slash" : "star.fill") {
                note.isFavorite.toggle()
            }
            .tint(.yellow)
        }
        .contextMenu {
            Button("Dupliquer", systemImage: "doc.on.doc") { ... }
            Button("Partager", systemImage: "square.and.arrow.up") { ... }
        }
}
```
