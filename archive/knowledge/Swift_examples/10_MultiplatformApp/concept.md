# Concepts — Projet 10 : Multiplatform App

## 1. SwiftUI Multiplatform — même code, deux plateformes

Une app SwiftUI avec une cible "Multiplatform" compile le même code Swift pour iOS et macOS. La différence d'UX est gérée par des adaptations conditionnelles.

```swift
// Code partagé — fonctionne partout
struct NoteListView: View {
    @Query(sort: \Note.updatedAt, order: .reverse) var notes: [Note]

    var body: some View {
        List(notes) { note in
            NavigationLink(note.title, value: note)
        }
        // Les modifiers communs fonctionnent sur les deux plateformes
        .navigationTitle("Notes")
    }
}

// Code conditionnel — seulement sur macOS
#if os(macOS)
extension NoteListView {
    // Comportement spécifique macOS ici
}
#endif
```

---

## 2. NavigationSplitView — sidebar adaptative

`NavigationSplitView` affiche une sidebar sur macOS/iPad, et se replie en navigation stack sur iPhone compact.

```swift
struct ContentView: View {
    @State private var selectedNote: Note?
    @State private var columnVisibility = NavigationSplitViewVisibility.doubleColumn

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            // Colonne sidebar (gauche)
            SidebarView(selectedNote: $selectedNote)
        } detail: {
            // Colonne détail (droite)
            if let note = selectedNote {
                NoteEditorView(note: note)
            } else {
                ContentUnavailableView("Sélectionnez une note",
                    systemImage: "doc.text")
            }
        }
        // Style selon la plateforme
        .navigationSplitViewStyle(.balanced)
    }
}
```

---

## 3. MenuBarExtra — app dans la menu bar

`MenuBarExtra` est une Scene qui crée une icône permanente dans la menu bar macOS.

```swift
@main
struct MultiplatformApp: App {
    var body: some Scene {
        // Scene principale — iPhone + macOS
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Note.self)

        // Scene menu bar — macOS uniquement
        #if os(macOS)
        MenuBarExtra("Notes", systemImage: "doc.text") {
            MenuBarView()
        }
        .menuBarExtraStyle(.window)  // fenêtre popup au lieu d'un menu
        #endif
    }
}

struct MenuBarView: View {
    @Query(sort: \Note.updatedAt, order: .reverse) var notes: [Note]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(notes.prefix(5)) { note in
                Button(note.title) {
                    // Ouvrir la note dans la fenêtre principale
                    NSApp.activate(ignoringOtherApps: true)
                }
            }
            Divider()
            Button("Ouvrir Notes…") { NSApp.activate(ignoringOtherApps: true) }
            Button("Quitter") { NSApp.terminate(nil) }
        }
        .frame(width: 260)
    }
}
```

---

## 4. Toolbar adaptatif

La toolbar se comporte différemment selon la plateforme. Les placements macOS sont précis (toolbar nommée, menu bar).

```swift
.toolbar {
    // Fonctionnel sur les deux plateformes
    ToolbarItem(placement: .primaryAction) {
        Button("Nouvelle note", systemImage: "square.and.pencil") {
            addNote()
        }
    }

    // macOS uniquement : raccourci clavier
    #if os(macOS)
    ToolbarItem(placement: .primaryAction) {
        Button("Nouvelle note") { addNote() }
            .keyboardShortcut("n", modifiers: .command)  // Cmd+N
    }
    #endif
}

// Raccourcis clavier macOS
.keyboardShortcut("n", modifiers: .command)          // Cmd+N
.keyboardShortcut("w", modifiers: .command)          // Cmd+W
.keyboardShortcut(.delete, modifiers: .command)      // Cmd+Suppr
.keyboardShortcut("f", modifiers: [.command, .shift]) // Cmd+Shift+F
```

---

## 5. CloudKit — sync automatique multi-devices

`NSPersistentCloudKitContainer` synchronise automatiquement SwiftData / CoreData avec iCloud.

```swift
// Dans l'App — activer la sync CloudKit
WindowGroup {
    ContentView()
}
.modelContainer(for: Note.self) {
    // Configuration CloudKit
    let config = ModelConfiguration(cloudKitDatabase: .automatic)
    return try ModelContainer(for: Note.self, configurations: config)
}

// Les données se synchronisent automatiquement entre tous les appareils de l'utilisateur
// Pas de code supplémentaire nécessaire pour la sync de base
```

---

## 6. Adaptive layout — compact vs regular

```swift
struct AdaptiveNoteLayout: View {
    @Environment(\.horizontalSizeClass) private var sizeClass

    var body: some View {
        if sizeClass == .compact {
            // iPhone : layout vertical, navigation stack
            NavigationStack {
                NoteListView()
            }
        } else {
            // iPad / Mac : layout en colonnes
            NavigationSplitView {
                NoteListView()
            } detail: {
                NoteDetailView()
            }
        }
    }
}

// containerRelativeFrame : taille relative au conteneur (iOS 17+)
// Remplace souvent GeometryReader pour des layouts responsifs simples
NoteCard()
    .containerRelativeFrame(.horizontal) { width, _ in
        width * 0.9  // 90% de la largeur du conteneur
    }
```

---

## 7. Différences clés iOS vs macOS

| Aspect | iOS/iPhone | macOS |
|---|---|---|
| Navigation | Stack push | Sidebar + Détail |
| Saisie | Tactile, clavier virtuel | Clavier physique, souris |
| Raccourcis | Swipe actions | Keyboard shortcuts |
| Fenêtres | Une seule | Multiple windows |
| Toolbar | Bottom / top bar | Toolbar native macOS |
| Contexte | Quick glance | Productivité longue |

```swift
// Adapter les interactions selon la plateforme
#if os(iOS)
.swipeActions(edge: .trailing) {
    Button("Supprimer", role: .destructive) { delete() }
}
#else
.contextMenu {
    Button("Supprimer", role: .destructive) { delete() }
}
.keyboardShortcut(.delete, modifiers: .command)
#endif
```
