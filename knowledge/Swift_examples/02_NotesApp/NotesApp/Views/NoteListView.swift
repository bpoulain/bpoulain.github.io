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
