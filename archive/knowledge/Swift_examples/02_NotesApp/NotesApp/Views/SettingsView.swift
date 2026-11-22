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
