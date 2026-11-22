# 11. Interop UIKit / AppKit

## 11.1 Modèle mental central

**SwiftUI et UIKit/AppKit coexistent. Quand SwiftUI n'a pas un composant, tu wraps le composant natif.**

UIKit (iOS) et AppKit (macOS) sont les frameworks UI impératifs d'Apple qui précèdent SwiftUI. Ils ont des années de composants éprouvés que SwiftUI n'a pas encore tous réimplementés. L'interop permet d'utiliser ces composants dans SwiftUI sans tout réécrire.

> *Analogie : SwiftUI est le projecteur moderne. UIKit/AppKit sont les projecteurs legacy avec des slides spéciales (composants non encore disponibles en SwiftUI). `UIViewRepresentable` est l'adaptateur entre les deux.*

---

## 11.2 `UIViewRepresentable` (iOS)

### 11.2.1 Définition

`UIViewRepresentable` est le protocole qui permet d'encapsuler une `UIView` UIKit dans une View SwiftUI :

```swift
struct MapView: UIViewRepresentable {
    // Créer la UIView
    func makeUIView(context: Context) -> MKMapView {
        MKMapView()
    }

    // Mettre à jour la UIView quand l'état SwiftUI change
    func updateUIView(_ uiView: MKMapView, context: Context) {
        // Synchroniser UIKit avec l'état SwiftUI
    }
}
```

### 11.2.2 Les trois méthodes

| Méthode | Quand | Rôle |
|---------|-------|------|
| `makeUIView(context:)` | Une seule fois | Créer et configurer la UIView |
| `updateUIView(_:context:)` | À chaque recomposition SwiftUI | Synchroniser la UIView avec le state |
| `makeCoordinator()` | Une seule fois | Créer un delegate/coordinator |

### 11.2.3 Exemple — TextField natif avec attributs avancés

```swift
struct FancyTextField: UIViewRepresentable {
    @Binding var text: String
    var placeholder: String

    func makeUIView(context: Context) -> UITextField {
        let field = UITextField()
        field.placeholder = placeholder
        field.delegate = context.coordinator
        return field
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        // Synchroniser si text a changé depuis SwiftUI
        if uiView.text != text {
            uiView.text = text
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(text: $text)
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        @Binding var text: String

        init(text: Binding<String>) {
            self._text = text
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            text = textField.text ?? ""
        }
    }
}
```

---

## 11.3 `NSViewRepresentable` (macOS)

Même principe qu'`UIViewRepresentable` mais pour macOS :

```swift
struct ColorPickerView: NSViewRepresentable {
    @Binding var selectedColor: NSColor

    func makeNSView(context: Context) -> NSColorWell {
        let well = NSColorWell()
        well.target = context.coordinator
        well.action = #selector(Coordinator.colorChanged(_:))
        return well
    }

    func updateNSView(_ nsView: NSColorWell, context: Context) {
        nsView.color = selectedColor
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(color: $selectedColor)
    }

    class Coordinator: NSObject {
        @Binding var color: NSColor

        init(color: Binding<NSColor>) {
            self._color = color
        }

        @objc func colorChanged(_ sender: NSColorWell) {
            color = sender.color
        }
    }
}
```

---

## 11.4 Le Coordinator — pont de communication

### 11.4.1 Rôle

Le **Coordinator** est la classe qui joue le rôle de delegate UIKit. Il "traduit" les événements UIKit (delegate callbacks) en modifications d'état SwiftUI.

```
UIKit événement → Coordinator → @Binding / closure → état SwiftUI → recomposition
```

### 11.4.2 Classe, pas struct

Le Coordinator est une `class` (pas `struct`) car UIKit/AppKit delegates doivent être des références (`NSObject`).

---

## 11.5 Bridging lifecycle UIKit ↔ SwiftUI

| Cycle de vie UIKit | Équivalent SwiftUI |
|--------------------|-------------------|
| `viewDidLoad` | `makeUIView(context:)` |
| `viewWillAppear` | `.onAppear {}` |
| `viewWillDisappear` | `.onDisappear {}` |
| `layoutSubviews` | Automatique (layout system) |
| `updateConstraints` | `updateUIView(_:context:)` |

---

## 11.6 Coexistence hybride

### 11.6.1 SwiftUI dans UIKit

Pour utiliser une View SwiftUI dans une app UIKit existante :

```swift
// Dans un UIViewController
let hostingController = UIHostingController(rootView: MySwiftUIView())
addChild(hostingController)
view.addSubview(hostingController.view)
hostingController.didMove(toParent: self)
```

### 11.6.2 UIKit dans SwiftUI

Via `UIViewRepresentable` ou `UIViewControllerRepresentable` (pour un `UIViewController` entier) :

```swift
struct DocumentPickerView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        UIDocumentPickerViewController(forOpeningContentTypes: [.pdf])
    }

    func updateUIViewController(_ vc: UIDocumentPickerViewController, context: Context) {}
}
```

---

## 11.7 Quand utiliser l'interop

**Cas où l'interop est nécessaire (iOS 26) :**
- Cartes (`MKMapView`) → bien que `Map` SwiftUI existe en iOS 26
- Contrôles très spécifiques (ARKit, SceneKit, RealityKit views)
- WebView (`WKWebView`) → `WebView` SwiftUI arrive mais limitée
- Fonctionnalités UIKit non encore portées en SwiftUI

**Cas où l'interop n'est PAS nécessaire en iOS 26 :**
- Listes scrollables → `List` / `ScrollView`
- Navigation → `NavigationStack`
- Formulaires → `Form`
- Alertes → `.alert()`, `.confirmationDialog()`
- TextFields, Toggles, Pickers → natifs SwiftUI

---

## 11.8 Comparaison paradigmes

| Concept | JS vanilla (DOM) | SwiftUI + UIKit |
|---------|-----------------|-----------------|
| Composant non disponible | Créer en HTML/JS | `UIViewRepresentable` |
| Événement vers "parent" | Callback / event | Coordinator + @Binding |
| Cycle de vie | Lifecycle methods | `makeUIView` / `updateUIView` |
| Mise à jour | Manipulation DOM | `updateUIView` déclenché par state |

**Différence conceptuelle clé :**

En JS, un composant tiers s'intègre via le DOM (events, mutation). En SwiftUI/UIKit, l'intégration passe par un **contrat bi-directionnel** : SwiftUI informe UIKit de l'état (via `updateUIView`), UIKit informe SwiftUI des événements (via Coordinator + @Binding).
