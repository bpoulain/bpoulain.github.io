# FILETREE
- NotesApp/NotesApp.swift
- NotesApp/Models/Note.swift
- NotesApp/Views/NoteListView.swift
- NotesApp/Views/NoteEditorView.swift
- NotesApp/Views/SettingsView.swift

# FILES

## FILE

PATH: NotesApp/NotesApp.swift

META: {"path": "NotesApp/NotesApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup {
            NoteListView()
        }
        // modelContainer configure la base SwiftData et injecte le context
        // dans tout l'arbre de vues via @Environment(\.modelContext)
        .modelContainer(for: Note.self)
    }
}
```

## FILE

PATH: NotesApp/Models/Note.swift

META: {"path": "NotesApp/Models/Note.swift", "sha256": "", "size": 0}

```swift
import Foundation
import SwiftData

// @Model : macro SwiftData qui génère la persistance automatiquement
// final class car SwiftData requiert des reference types (pas des structs)
@Model
final class Note {
    var title: String
    var content: String
    var isFavorite: Bool
    // updatedAt permet de trier par "le plus récemment modifié"
    var updatedAt: Date

    init(title: String = "") {
        self.title = title
        self.content = ""
        self.isFavorite = false
        self.updatedAt = .now
    }
}
```

## FILE

PATH: NotesApp/Views/NoteListView.swift

META: {"path": "NotesApp/Views/NoteListView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

struct NoteListView: View {
    // @Query observe SwiftData et recharge la vue à chaque changement
    // Trié par date de modification décroissante
    @Query(sort: \Note.updatedAt, order: .reverse) private var notes: [Note]

    // modelContext injecté automatiquement par .modelContainer dans l'App
    @Environment(\.modelContext) private var context

    @State private var searchText = ""
    @State private var showSettings = false

    // Computed property de filtrage — évite de dupliquer la logique dans la vue
    var filteredNotes: [Note] {
        guard !searchText.isEmpty else { return notes }
        return notes.filter {
            $0.title.localizedCaseInsensitiveContains(searchText) ||
            $0.content.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredNotes) { note in
                    // navigationDestination(for:) gère la navigation vers NoteEditorView
                    NavigationLink(value: note) {
                        NoteRowView(note: note)
                    }
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
                }
            }
            // searchable ajoute la barre de recherche native iOS
            .searchable(text: $searchText, prompt: "Chercher une note")
            .navigationTitle("Notes")
            .navigationDestination(for: Note.self) { note in
                NoteEditorView(note: note)
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Réglages", systemImage: "gear") { showSettings = true }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Nouvelle note", systemImage: "square.and.pencil") {
                        let note = Note(title: "")
                        context.insert(note)
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
        }
    }
}

struct NoteRowView: View {
    let note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(note.title.isEmpty ? "Sans titre" : note.title)
                    .font(.headline)
                    .lineLimit(1)
                if note.isFavorite {
                    Image(systemName: "star.fill")
                        .font(.caption)
                        .foregroundStyle(.yellow)
                }
            }
            if !note.content.isEmpty {
                Text(note.content)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
            Text(note.updatedAt.formatted(date: .abbreviated, time: .shortened))
                .font(.caption2)
                .foregroundStyle(.tertiary)
        }
        .padding(.vertical, 2)
    }
}

#Preview {
    NoteListView()
        .modelContainer(for: Note.self, inMemory: true)
}
```

## FILE

PATH: NotesApp/Views/NoteEditorView.swift

META: {"path": "NotesApp/Views/NoteEditorView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct NoteEditorView: View {
    // @Bindable permet de créer des Bindings ($note.title) sur un @Model SwiftData
    @Bindable var note: Note

    // FocusState : contrôle quel champ a le focus clavier
    @FocusState private var focusedField: Field?
    enum Field { case title, content }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            TextField("Titre", text: $note.title)
                .font(.title2.bold())
                .padding(.horizontal)
                .padding(.top, 16)
                .focused($focusedField, equals: .title)
                // onSubmit : quand l'utilisateur appuie sur Entrée, passe au contenu
                .onSubmit { focusedField = .content }

            Divider().padding(.vertical, 8)

            // TextEditor : zone de saisie multiligne native
            TextEditor(text: $note.content)
                .font(.body)
                .padding(.horizontal, 8)
                .focused($focusedField, equals: .content)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            // Bouton "OK" dans la barre au-dessus du clavier
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("OK") { focusedField = nil }
            }
        }
        // Met à jour updatedAt à chaque modification pour le tri de la liste
        .onChange(of: note.content) { note.updatedAt = .now }
        .onChange(of: note.title) { note.updatedAt = .now }
        // Ouvre le clavier sur le titre si la note est vide
        .onAppear {
            if note.title.isEmpty { focusedField = .title }
        }
    }
}
```

## FILE

PATH: NotesApp/Views/SettingsView.swift

META: {"path": "NotesApp/Views/SettingsView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss

    // AppStorage : wrapper UserDefaults typé
    // La clé est partagée — toute vue qui lit "fontSize" reçoit la même valeur
    @AppStorage("fontSize") private var fontSize: Double = 16
    @AppStorage("showDates") private var showDates: Bool = true
    @AppStorage("defaultTag") private var defaultTag: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Affichage") {
                    Toggle("Afficher les dates", isOn: $showDates)

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Taille du texte : \(Int(fontSize))pt")
                            .font(.subheadline)
                        Slider(value: $fontSize, in: 12...24, step: 1)
                    }
                    .padding(.vertical, 4)
                }

                Section("Saisie") {
                    TextField("Tag par défaut", text: $defaultTag)
                }

                Section {
                    // Exemple de lecture de la valeur stockée
                    Text("Les réglages sont sauvegardés automatiquement.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Réglages")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("OK") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    SettingsView()
}
```
