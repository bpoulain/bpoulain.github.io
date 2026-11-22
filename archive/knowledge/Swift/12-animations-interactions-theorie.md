# 12. Animations & Interactions

## 12.1 Modèle mental central

**L'animation est la conséquence visible d'un changement d'état. Tu n'animes pas des propriétés CSS — tu changes l'état et SwiftUI anime la transition.**

SwiftUI interpole automatiquement entre l'ancien et le nouvel état. Tu dis "change cet état avec animation", SwiftUI calcule toutes les étapes intermédiaires.

> *Analogie : tu tournes un interrupteur et la lampe s'allume progressivement. Tu n'as pas programmé la progression — tu as juste changé l'état (on/off), et le système gère la transition.*

---

## 12.2 `withAnimation` — animations explicites

### 12.2.1 Principe

`withAnimation` enveloppe un changement d'état et demande à SwiftUI d'animer toutes les vues affectées par ce changement :

```swift
struct ToggleView: View {
    @State private var isExpanded = false

    var body: some View {
        VStack {
            Button("Toggle") {
                withAnimation {
                    isExpanded.toggle()
                }
            }

            if isExpanded {
                Text("Contenu étendu")
                    .transition(.opacity)
            }
        }
    }
}
```

### 12.2.2 Spécifier la courbe d'animation

```swift
withAnimation(.easeInOut(duration: 0.3)) { isExpanded.toggle() }
withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) { position = .center }
withAnimation(.linear(duration: 0.5)) { progress = 1.0 }
```

---

## 12.3 Animations implicites vs explicites

### 12.3.1 Animations implicites — `.animation()`

`.animation()` applique une animation à une vue spécifique sur toute modification d'une valeur donnée :

```swift
struct ImplicitAnim: View {
    @State private var scale: CGFloat = 1.0

    var body: some View {
        Circle()
            .frame(width: 100, height: 100)
            .scaleEffect(scale)
            .animation(.spring(), value: scale)  // ← implicite sur cette vue
            .onTapGesture {
                scale = scale == 1.0 ? 1.5 : 1.0
            }
    }
}
```

### 12.3.2 Différence

| `withAnimation` | `.animation(value:)` |
|----------------|---------------------|
| Anime tout ce qui est affecté par ce changement | Anime uniquement cette vue |
| Déclaratif à l'endroit du changement | Déclaratif sur la vue |
| Recommandé pour les changements complexes | Pour les animations locales simples |

---

## 12.4 Transitions — `.transition()`

Les transitions s'appliquent aux vues qui apparaissent ou disparaissent conditionnellement :

```swift
if isVisible {
    Card()
        .transition(.slide)       // ← entre depuis la gauche
}

if isAlert {
    AlertBanner()
        .transition(.opacity)     // ← fondu

if isPanel {
    SidePanel()
        .transition(.move(edge: .trailing))  // ← entre depuis la droite
}
```

### 12.4.1 Transitions asymétriques

```swift
.transition(.asymmetric(
    insertion: .move(edge: .top),      // ← entre par le haut
    removal: .move(edge: .bottom)      // ← sort par le bas
))
```

### 12.4.2 Transitions composées

```swift
.transition(.opacity.combined(with: .scale))
```

---

## 12.5 Interpolations automatiques de state

SwiftUI interpole automatiquement les valeurs numériques entre les états :

```swift
struct ProgressBar: View {
    var progress: Double

    var body: some View {
        GeometryReader { geo in
            Rectangle()
                .frame(width: geo.size.width * progress)
                .animation(.easeInOut, value: progress)
        }
    }
}
```

Quand `progress` passe de `0.2` à `0.8`, SwiftUI anime tous les états intermédiaires automatiquement.

---

## 12.6 Gestures

### 12.6.1 `TapGesture`

```swift
Text("Tap moi")
    .onTapGesture {
        print("Tappé")
    }

// Double tap
Text("Double tap")
    .onTapGesture(count: 2) {
        print("Double tappé")
    }
```

### 12.6.2 `DragGesture`

```swift
struct DraggableCard: View {
    @State private var offset = CGSize.zero

    var body: some View {
        RoundedRectangle(cornerRadius: 12)
            .frame(width: 200, height: 100)
            .offset(offset)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        offset = value.translation
                    }
                    .onEnded { _ in
                        withAnimation(.spring()) {
                            offset = .zero   // ← retour animé
                        }
                    }
            )
    }
}
```

### 12.6.3 `LongPressGesture`

```swift
.onLongPressGesture(minimumDuration: 0.5) {
    print("Long press")
}
```

### 12.6.4 Combiner des gestures

```swift
.simultaneousGesture(TapGesture().onEnded { })
.highPriorityGesture(DragGesture())
```

---

## 12.7 Animation = conséquence d'un changement de state

**Règle d'or :** tu n'animes jamais directement une vue. Tu changes l'état, et SwiftUI calcule l'animation.

```
❌ Penser CSS :
   "Je vais animer la propriété transform: translateX de 0 à 200"

✅ Penser SwiftUI :
   "Je change l'état (position = .right)
   et je demande à SwiftUI d'animer cette transition"
```

```swift
// ❌ Pensée CSS
card.style.transform = 'translateX(200px)'

// ✅ Pensée SwiftUI
withAnimation(.spring()) {
    position = .right   // ← change l'état, SwiftUI anime
}
```

---

## 12.8 Comparaison CSS/JS vs SwiftUI

| CSS / JS | SwiftUI |
|----------|---------|
| `transition: opacity 0.3s` | `.animation(.easeInOut(duration: 0.3), value: isVisible)` |
| `animation: fadeIn 0.3s` | `.transition(.opacity)` dans `withAnimation` |
| `element.style.transform = ...` | `withAnimation { state = newValue }` |
| Keyframes | `withAnimation` + séquence d'états |
| Drag event listeners | `DragGesture()` |
| Click handler | `.onTapGesture {}` |
| Long press | `.onLongPressGesture {}` |

**Différence fondamentale :**

En CSS/JS, tu décris les animations en termes de propriétés visuelles qui changent. En SwiftUI, tu décris les changements d'état — SwiftUI détermine comment interpoler.

---

## 12.9 Timing system intégré

SwiftUI dispose d'un timing system natif. Les valeurs communes :

```swift
.easeIn                     // lent → rapide
.easeOut                    // rapide → lent
.easeInOut                  // lent → rapide → lent
.linear(duration: 0.5)      // vitesse constante
.spring()                   // rebond naturel
.spring(response: 0.3,      // ressort personnalisé
        dampingFraction: 0.7)
.bouncy                     // rebond prononcé (iOS 17+)
.smooth                     // fluide sans rebond (iOS 17+)
```
