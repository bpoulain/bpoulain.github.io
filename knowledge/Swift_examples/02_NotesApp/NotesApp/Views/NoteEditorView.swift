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
