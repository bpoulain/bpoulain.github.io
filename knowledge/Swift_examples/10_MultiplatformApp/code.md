# FILETREE
- MultiplatformApp/MultiplatformApp.swift
- MultiplatformApp/Views/ContentView.swift
- MultiplatformApp/Views/SidebarView.swift
- MultiplatformApp/Views/NoteDetailView.swift
- MultiplatformApp/Views/MenuBarView.swift

# FILES

## FILE

PATH: MultiplatformApp/MultiplatformApp.swift

META: {"path": "MultiplatformApp/MultiplatformApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

@main
struct MultiplatformApp: App {
    var body: some Scene {
        // WindowGroup : scene principale — compile sur iOS et macOS
        WindowGroup {
            ContentView()
        }
        // modelContainer avec CloudKit — sync automatique entre appareils
        .modelContainer(for: Note.self)

        // MenuBarExtra : icône dans la menu bar — macOS uniquement
        // La directive #if empêche la compilation sur iOS
        #if os(macOS)
        MenuBarExtra("Notes rapides", systemImage: "doc.text") {
            MenuBarView()
        }
        .menuBarExtraStyle(.window)
        #endif
    }
}
```

## FILE

PATH: MultiplatformApp/Views/ContentView.swift

META: {"path": "MultiplatformApp/Views/ContentView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

struct ContentView: View {
    @State private var selectedNote: Note?
    @Environment(\.horizontalSizeClass) private var sizeClass

    var body: some View {
        // NavigationSplitView : sidebar sur macOS/iPad, stack sur iPhone
        NavigationSplitView {
            SidebarView(selectedNote: $selectedNote)
        } detail: {
            if let note = selectedNote {
                NoteDetailView(note: note)
            } else {
                // Placeholder quand rien n'est sélectionné — commun sur macOS
                ContentUnavailableView(
                    "Sélectionnez une note",
                    systemImage: "doc.text",
                    description: Text("Choisissez une note dans la barre latérale\nou créez-en une nouvelle.")
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
        // Raccourci clavier macOS — ignoré sur iOS
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Nouvelle note") {
                    createNote()
                }
                .keyboardShortcut("n", modifiers: .command)
            }
        }
    }

    private func createNote() {
        // La création est gérée par SidebarView via une notification
        NotificationCenter.default.post(name: .createNewNote, object: nil)
    }
}

extension Notification.Name {
    static let createNewNote = Notification.Name("createNewNote")
}
```

## FILE

PATH: MultiplatformApp/Views/SidebarView.swift

META: {"path": "MultiplatformApp/Views/SidebarView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI
import SwiftData

struct SidebarView: View {
    @Binding var selectedNote: Note?
    @Query(sort: \Note.updatedAt, order: .reverse) private var notes: [Note]
    @Environment(\.modelContext) private var context
    @State private var searchText = ""

    var filteredNotes: [Note] {
        guard !searchText.isEmpty else { return notes }
        return notes.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        List(selection: $selectedNote) {
            ForEach(filteredNotes) { note in
                // NavigationLink value-based pour la sélection dans la sidebar
                NavigationLink(value: note) {
                    NoteRow(note: note)
                }
                // Adapter les interactions selon la plateforme
                #if os(iOS)
                .swipeActions(edge: .trailing) {
                    Button("Supprimer", systemImage: "trash", role: .destructive) {
                        context.delete(note)
                        if selectedNote?.id == note.id { selectedNote = nil }
                    }
                }
                #else
                .contextMenu {
                    Button("Supprimer", role: .destructive) {
                        context.delete(note)
                        if selectedNote?.id == note.id { selectedNote = nil }
                    }
                }
                #endif
            }
        }
        .searchable(text: $searchText, prompt: "Chercher…")
        .navigationTitle("Notes")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button("Nouvelle note", systemImage: "square.and.pencil") {
                    addNote()
                }
                #if os(macOS)
                // Raccourci supplémentaire affiché dans la toolbar macOS
                .help("Nouvelle note (⌘N)")
                #endif
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .createNewNote)) { _ in
            addNote()
        }
    }

    private func addNote() {
        let note = Note(title: "Sans titre")
        context.insert(note)
        selectedNote = note
    }
}

struct NoteRow: View {
    let note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(note.title.isEmpty ? "Sans titre" : note.title)
                .font(.headline)
                .lineLimit(1)
            Text(note.updatedAt.formatted(date: .abbreviated, time: .shortened))
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 2)
    }
}
```

## FILE

PATH: MultiplatformApp/Views/NoteDetailView.swift

META: {"path": "MultiplatformApp/Views/NoteDetailView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct NoteDetailView: View {
    @Bindable var note: Note
    @FocusState private var focusedField: Field?
    enum Field { case title, content }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            TextField("Titre", text: $note.title)
                .font(.title2.bold())
                // padding différent selon la plateforme
                .padding(.horizontal)
                #if os(iOS)
                .padding(.top, 16)
                #else
                .padding(.top, 8)
                #endif
                .focused($focusedField, equals: .title)
                .onSubmit { focusedField = .content }

            Divider().padding(.vertical, 8)

            TextEditor(text: $note.content)
                .font(.body)
                .padding(.horizontal, 8)
                .focused($focusedField, equals: .content)
                // macOS : supprimer le fond blanc par défaut de TextEditor
                #if os(macOS)
                .scrollContentBackground(.hidden)
                #endif
        }
        .navigationTitle(note.title.isEmpty ? "Sans titre" : note.title)
        #if os(iOS)
        .navigationBarTitleDisplayMode(.inline)
        #endif
        .toolbar {
            #if os(iOS)
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("OK") { focusedField = nil }
            }
            #else
            // Toolbar macOS — raccourcis standard
            ToolbarItem(placement: .primaryAction) {
                Button("Partager", systemImage: "square.and.arrow.up") {
                    // NSSharingServicePicker sur macOS
                }
            }
            #endif
        }
        .onChange(of: note.content) { note.updatedAt = .now }
        .onChange(of: note.title) { note.updatedAt = .now }
        .onAppear {
            if note.title.isEmpty { focusedField = .title }
        }
    }
}
```

## FILE

PATH: MultiplatformApp/Views/MenuBarView.swift

META: {"path": "MultiplatformApp/Views/MenuBarView.swift", "sha256": "", "size": 0}

```swift
// Ce fichier est compilé seulement sur macOS
#if os(macOS)
import SwiftUI
import SwiftData

// Vue compacte dans la menu bar — accès rapide aux 5 dernières notes
struct MenuBarView: View {
    @Query(sort: \Note.updatedAt, order: .reverse) private var notes: [Note]
    @Environment(\.modelContext) private var context
    @State private var newNoteTitle = ""
    @FocusState private var isInputFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Saisie rapide d'une note
            HStack {
                TextField("Note rapide…", text: $newNoteTitle)
                    .textFieldStyle(.plain)
                    .focused($isInputFocused)
                    .onSubmit {
                        guard !newNoteTitle.isEmpty else { return }
                        let note = Note(title: newNoteTitle)
                        context.insert(note)
                        newNoteTitle = ""
                    }
                if !newNoteTitle.isEmpty {
                    Button("Ajouter", systemImage: "return") {
                        let note = Note(title: newNoteTitle)
                        context.insert(note)
                        newNoteTitle = ""
                    }
                    .buttonStyle(.plain)
                    .foregroundStyle(.secondary)
                }
            }
            .padding(8)

            Divider()

            // Dernières notes
            ForEach(notes.prefix(5)) { note in
                Button {
                    // Ouvrir l'app principale au premier plan
                    NSApp.activate(ignoringOtherApps: true)
                } label: {
                    HStack {
                        Text(note.title.isEmpty ? "Sans titre" : note.title)
                            .lineLimit(1)
                        Spacer()
                        Text(note.updatedAt.formatted(date: .omitted, time: .shortened))
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                }
                .buttonStyle(.plain)
            }

            Divider()

            // Actions système
            Button("Ouvrir Notes") {
                NSApp.activate(ignoringOtherApps: true)
            }
            .keyboardShortcut("o", modifiers: .command)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)

            Button("Quitter") {
                NSApp.terminate(nil)
            }
            .keyboardShortcut("q", modifiers: .command)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
        }
        .frame(width: 280)
        .onAppear { isInputFocused = true }
    }
}
#endif
```
