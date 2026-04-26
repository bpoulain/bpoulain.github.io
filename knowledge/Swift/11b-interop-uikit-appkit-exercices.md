# 11. Interop UIKit / AppKit — Exercices

---

## Exercice 11.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, tu intègres une bibliothèque de carte tierce dans ta page :

```js
// JS vanilla — intégration d'une lib tierce
const mapContainer = document.querySelector('#map')

// La lib crée et gère son propre DOM
const map = new ThirdPartyMap(mapContainer, {
    center: { lat: 48.8566, lng: 2.3522 },
    zoom: 12
})

// Écouter les événements de la lib
map.on('click', (e) => {
    console.log('Cliqué à :', e.latlng)
    currentLocation.value = e.latlng  // mise à jour du state Reef
})

// Mettre à jour la lib depuis le state
function updateMap(lat, lng) {
    map.setCenter({ lat, lng })
}
```

**Questions :**

→ Quel est l'équivalent de "la lib crée son propre DOM" en SwiftUI ?
→ Où va `updateMap(lat, lng)` dans la structure `UIViewRepresentable` ?
→ Où vont les events (map clicks) dans la structure SwiftUI ?

*Tente de répondre avant de lire la correction.*

---

### Correction 11.1

**Modèle mental :**

| JS vanilla | SwiftUI |
|-----------|---------|
| La lib crée son DOM | `makeUIView()` crée la UIView |
| `updateMap()` | `updateUIView()` |
| `map.on('click', ...)` | Coordinator (delegate) → @Binding |

```swift
import MapKit

struct MapViewWrapper: UIViewRepresentable {
    @Binding var selectedCoordinate: CLLocationCoordinate2D?
    var center: CLLocationCoordinate2D

    func makeUIView(context: Context) -> MKMapView {
        let map = MKMapView()
        map.delegate = context.coordinator

        let tapGesture = UITapGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handleTap(_:))
        )
        map.addGestureRecognizer(tapGesture)

        return map
    }

    func updateUIView(_ uiView: MKMapView, context: Context) {
        // Équivalent de updateMap() — déclenché par les changements de state SwiftUI
        let region = MKCoordinateRegion(
            center: center,
            span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        )
        uiView.setRegion(region, animated: true)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(selectedCoordinate: $selectedCoordinate)
    }

    class Coordinator: NSObject, MKMapViewDelegate {
        @Binding var selectedCoordinate: CLLocationCoordinate2D?

        init(selectedCoordinate: Binding<CLLocationCoordinate2D?>) {
            self._selectedCoordinate = selectedCoordinate
        }

        @objc func handleTap(_ gesture: UITapGestureRecognizer) {
            guard let mapView = gesture.view as? MKMapView else { return }
            let point = gesture.location(in: mapView)
            selectedCoordinate = mapView.convert(point, toCoordinateFrom: mapView)
        }
    }
}

// Usage dans SwiftUI
struct MapScreen: View {
    @State private var selected: CLLocationCoordinate2D?
    @State private var center = CLLocationCoordinate2D(latitude: 48.8566, longitude: 2.3522)

    var body: some View {
        VStack {
            MapViewWrapper(selectedCoordinate: $selected, center: center)
                .frame(maxWidth: .infinity, minHeight: 300)

            if let coord = selected {
                Text("Cliqué : \(coord.latitude, specifier: "%.4f"), \(coord.longitude, specifier: "%.4f")")
            }
        }
    }
}
```

---

## Exercice 11.2 — Piège de paradigme

### Énoncé

Voici un `UIViewRepresentable` avec un problème :

```swift
struct TextEditorWrapper: UIViewRepresentable {
    @Binding var text: String

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.text = text         // ← initialisé avec text
        // ← Pas de delegate configuré
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        uiView.text = text           // ← mis à jour à chaque recomposition
    }
}
```

**Questions :**
→ Quel est le problème avec ce code quand l'utilisateur tape du texte ?
→ Que se passe-t-il si SwiftUI recompose la vue pendant la saisie ?
→ Comment corriger pour avoir une synchronisation bidirectionnelle ?

---

### Correction 11.2

**Problème 1 — pas de delegate :**

L'utilisateur tape du texte dans `UITextView`, mais l'état SwiftUI (`text`) ne se met jamais à jour — il n'y a pas de mécanisme pour "remonter" les changements.

**Problème 2 — boucle de mise à jour :**

`updateUIView` est appelé à chaque recomposition SwiftUI. Si SwiftUI force la mise à jour de `uiView.text` pendant que l'utilisateur tape, le curseur se repositionne au début du texte à chaque frappe.

```
❌ Ce que le cerveau fait :
   "Je mets à jour uiView.text dans updateUIView, c'est suffisant"

✅ Comment ça fonctionne réellement :
   updateUIView court dans les deux sens.
   Il faut éviter de forcer la mise à jour si la valeur n'a pas changé.
```

**Code corrigé :**

```swift
struct TextEditorWrapper: UIViewRepresentable {
    @Binding var text: String

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.delegate = context.coordinator  // ← delegate pour remonter les changements
        textView.font = .systemFont(ofSize: 16)
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        // Éviter de réécrire si le contenu est identique → pas de reset du curseur
        if uiView.text != text {
            uiView.text = text
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(text: $text)
    }

    class Coordinator: NSObject, UITextViewDelegate {
        @Binding var text: String

        init(text: Binding<String>) {
            self._text = text
        }

        func textViewDidChange(_ textView: UITextView) {
            text = textView.text  // ← remonte les changements vers SwiftUI
        }
    }
}
```

**Règle à retenir :**
- `makeUIView` : configurer la vue + le delegate → `context.coordinator`
- `updateUIView` : synchroniser UIKit → **vérifier si la valeur a changé avant d'écrire**
- Coordinator : remonter les événements UIKit → modifier `@Binding`

---

## Exercice 11.3 — Mini cas réel

### Énoncé

Tu intègres un `UIActivityViewController` (le share sheet natif iOS) dans une app SwiftUI. Le share sheet doit :
- S'ouvrir via un bouton
- Partager un texte et une URL
- Détecter quand l'utilisateur a fini (succès ou annulation)

**Avant de coder :**
→ `UIActivityViewController` est un `UIViewController`, pas une `UIView` — quel protocole utilises-tu ?
→ Comment déclencher l'ouverture depuis un bouton SwiftUI ?
→ Comment détecter la fin du partage ?

---

### Correction 11.3

**Modèle mental :**

Pour un `UIViewController`, le protocole est `UIViewControllerRepresentable`. Le déclenchement passe par un `@State private var showShare = false` et `.sheet()`.

```swift
struct ActivityViewController: UIViewControllerRepresentable {
    let items: [Any]
    var onCompletion: ((Bool) -> Void)?

    func makeUIViewController(context: Context) -> UIActivityViewController {
        let vc = UIActivityViewController(activityItems: items, applicationActivities: nil)
        vc.completionWithItemsHandler = { _, completed, _, _ in
            onCompletion?(completed)
        }
        return vc
    }

    func updateUIViewController(_ vc: UIActivityViewController, context: Context) {}
}

struct ShareButton: View {
    let contentToShare = "Découvrez SwiftUI 6 !"
    let urlToShare = URL(string: "https://developer.apple.com")!

    @State private var showShare = false
    @State private var shareResult: String = ""

    var body: some View {
        VStack(spacing: 16) {
            Button("Partager") {
                showShare = true
            }
            .buttonStyle(.borderedProminent)

            if !shareResult.isEmpty {
                Text(shareResult)
                    .foregroundStyle(.secondary)
            }
        }
        .sheet(isPresented: $showShare) {
            ActivityViewController(
                items: [contentToShare, urlToShare],
                onCompletion: { completed in
                    showShare = false
                    shareResult = completed ? "Partagé avec succès !" : "Annulé"
                }
            )
        }
    }
}

#Preview {
    ShareButton()
}
```

**Points clés :**
- `UIViewControllerRepresentable` pour les `UIViewController`
- `.sheet(isPresented: $showShare)` déclenche l'affichage depuis l'état
- `completionWithItemsHandler` = callback UIKit → traduit en closure Swift pour SwiftUI
- `showShare = false` dans le handler ferme le sheet

**Erreurs classiques :**
- ❌ Essayer de "pousser" un `UIActivityViewController` directement sans wrapping
- ❌ Utiliser `UIViewRepresentable` pour un UIViewController
- ✅ `UIViewControllerRepresentable` pour les controllers, `UIViewRepresentable` pour les vues simples
