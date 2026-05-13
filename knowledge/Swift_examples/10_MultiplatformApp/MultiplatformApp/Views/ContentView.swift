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
