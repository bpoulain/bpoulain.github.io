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
