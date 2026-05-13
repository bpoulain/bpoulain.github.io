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
