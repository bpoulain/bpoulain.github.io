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
