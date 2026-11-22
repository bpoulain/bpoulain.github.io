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
