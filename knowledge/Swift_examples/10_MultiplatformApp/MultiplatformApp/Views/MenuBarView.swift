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
