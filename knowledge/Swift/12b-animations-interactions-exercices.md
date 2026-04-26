# 12. Animations & Interactions — Exercices

---

## Exercice 12.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, voici une carte qui se retourne au tap :

```js
// JS vanilla — flip card
const card = document.querySelector('.card')
let flipped = false

card.addEventListener('click', () => {
    flipped = !flipped
    card.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    card.style.transition = 'transform 0.5s ease'
})
```

**Questions :**

→ En SwiftUI, tu ne manipules pas `card.style.transform`. Qu'est-ce qui change à la place ?
→ Où va le `0.5s ease` (durée de transition) ?
→ Traduis ce code en SwiftUI.

*Tente de répondre avant de lire la correction.*

---

### Correction 12.1

**Modèle mental :**

En JS : mutation directe des propriétés de style + transition CSS.
En SwiftUI : état `isFlipped` → rotationEffect pilotée par l'état → `withAnimation` pour la transition.

```swift
struct FlipCard: View {
    @State private var isFlipped = false

    var body: some View {
        ZStack {
            if !isFlipped {
                // Face avant
                RoundedRectangle(cornerRadius: 16)
                    .fill(.blue)
                    .overlay(Text("Front").font(.title).foregroundStyle(.white))
            } else {
                // Face arrière — retournée
                RoundedRectangle(cornerRadius: 16)
                    .fill(.orange)
                    .overlay(Text("Back").font(.title).foregroundStyle(.white))
                    .rotation3DEffect(.degrees(180), axis: (x: 0, y: 1, z: 0))
            }
        }
        .frame(width: 200, height: 130)
        .rotation3DEffect(
            .degrees(isFlipped ? 180 : 0),
            axis: (x: 0, y: 1, z: 0)
        )
        .onTapGesture {
            withAnimation(.easeInOut(duration: 0.5)) {  // ← équivalent du 0.5s ease
                isFlipped.toggle()
            }
        }
    }
}
```

**Correspondances :**

| JS vanilla | SwiftUI |
|-----------|---------|
| `card.style.transform = 'rotateY(180deg)'` | `rotation3DEffect(.degrees(180), axis: ...)` |
| `card.style.transition = 'transform 0.5s ease'` | `withAnimation(.easeInOut(duration: 0.5))` |
| `flipped = !flipped` | `isFlipped.toggle()` |

---

## Exercice 12.2 — Piège de paradigme

### Énoncé

Voici du code SwiftUI avec un problème d'animation :

```swift
struct BadAnimView: View {
    @State private var isVisible = false

    var body: some View {
        VStack {
            Button("Show/Hide") {
                isVisible.toggle()  // ← pas de withAnimation
            }

            if isVisible {
                Text("Je suis là !")
                    .transition(.slide)
                    .animation(.easeInOut, value: isVisible)
            }
        }
    }
}
```

Et ce deuxième cas :

```swift
struct DirectMutation: View {
    @State private var scale: CGFloat = 1.0

    var body: some View {
        Circle()
            .scaleEffect(scale)
            .onTapGesture {
                // Essai d'animer "manuellement" en JS style
                for i in stride(from: 1.0, through: 1.5, by: 0.1) {
                    scale = i  // ← boucle rapide qui set scale
                }
            }
    }
}
```

**Questions :**
→ Cas 1 : La `.transition(.slide)` + `.animation()` suffisent-ils sans `withAnimation` ?
→ Cas 2 : Pourquoi la boucle ne produit-elle pas d'animation ?
→ Quelle est la bonne approche dans chaque cas ?

---

### Correction 12.2

**Cas 1 — `.transition` sans `withAnimation` :**

```
❌ Ce que le cerveau fait :
   "J'ai mis .transition et .animation sur la vue → elle sera animée"

✅ Comment ça fonctionne réellement :
   .transition définit COMMENT la vue entre/sort.
   .animation définit la courbe pour les CHANGEMENTS DE PROPRIÉTÉS.
   Pour que SwiftUI anime l'insertion/suppression, le changement d'état
   doit être enveloppé dans withAnimation.
```

```swift
// ✅ Correct
Button("Show/Hide") {
    withAnimation(.easeInOut) {   // ← le changement d'état est enveloppé
        isVisible.toggle()
    }
}
```

**Cas 2 — boucle JS-style :**

SwiftUI ne re-render pas à chaque itération de la boucle. Il n'exécute qu'**un seul rendu** après que toutes les mutations sont appliquées — il voit directement `scale = 1.5`. La boucle ne produit aucune animation.

```
❌ Ce que le cerveau fait (JS) :
   "Si je change scale en boucle rapide → SwiftUI affiche chaque frame"

✅ Comment ça fonctionne réellement :
   SwiftUI recompose une seule fois après tous les changements.
   Pour animer, utilise withAnimation et laisse SwiftUI interpoler.
```

```swift
// ✅ Correct
.onTapGesture {
    withAnimation(.spring()) {
        scale = scale == 1.0 ? 1.5 : 1.0   // ← SwiftUI interpole automatiquement
    }
}
```

---

## Exercice 12.3 — Mini cas réel

### Énoncé

Tu construis un bouton "J'aime" avec :
- Une icône cœur (vide → plein)
- Quand on tape : le cœur rebondit (scale 1 → 1.3 → 1)
- Le compteur de likes s'incrémente avec une animation de fondu
- Un effet de particules simple (3 petits cœurs qui s'envolent) — optionnel

**Avant de coder :**
→ Quels états sont nécessaires ?
→ Comment gérer le "rebond" (scale 1 → 1.3 → 1) ?
→ Comment animer le changement du compteur ?

*Décris d'abord, code ensuite.*

---

### Correction 12.3

**Modèle mental :**

- État : `isLiked: Bool`, `likeCount: Int`, `scale: CGFloat`
- Le rebond : `withAnimation(.spring(response: 0.3, dampingFraction: 0.3))` → scale
- Le compteur : `withAnimation(.easeInOut)` sur le changement de `likeCount`
- `.contentTransition(.numericText())` anime le changement de nombre

```swift
struct LikeButton: View {
    @State private var isLiked = false
    @State private var likeCount = 42
    @State private var scale: CGFloat = 1.0

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: isLiked ? "heart.fill" : "heart")
                .font(.title2)
                .foregroundStyle(isLiked ? .red : .secondary)
                .scaleEffect(scale)
                .onTapGesture {
                    // 1. Changer l'état
                    isLiked.toggle()
                    likeCount += isLiked ? 1 : -1

                    // 2. Animation rebond : scale vers 1.3 puis retour
                    withAnimation(.spring(response: 0.2, dampingFraction: 0.3)) {
                        scale = 1.3
                    }
                    // Retour après un court délai
                    Task {
                        try? await Task.sleep(for: .milliseconds(150))
                        withAnimation(.spring(response: 0.2, dampingFraction: 0.5)) {
                            scale = 1.0
                        }
                    }
                }

            Text("\(likeCount)")
                .font(.headline)
                .foregroundStyle(.secondary)
                .contentTransition(.numericText())  // ← anime le changement de nombre
                .animation(.easeInOut(duration: 0.2), value: likeCount)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(Capsule())
    }
}

#Preview {
    LikeButton()
}
```

**Variante avec `.keyframeAnimator` (iOS 17+) pour le rebond :**

```swift
.keyframeAnimator(initialValue: 1.0, trigger: isLiked) { view, scale in
    view.scaleEffect(scale)
} keyframes: { _ in
    KeyframeTrack {
        LinearKeyframe(1.3, duration: 0.1)
        SpringKeyframe(1.0, duration: 0.3, spring: .bouncy)
    }
}
```

**Points clés :**
- `.spring(dampingFraction: 0.3)` = faible amortissement → rebond prononcé
- `.contentTransition(.numericText())` = SwiftUI 6 pour animer les changements numériques
- `Task.sleep` pour séquencer les animations (évite les timers complexes)
- L'état pilote tout : `isLiked`, `likeCount`, `scale` — SwiftUI anime les transitions

**Erreurs classiques :**
- ❌ Tenter de "forcer" une animation en boucle (paradigme JS)
- ❌ Oublier `withAnimation` → changement immédiat sans transition
- ✅ Chaque changement visible mérite son propre `withAnimation` avec la bonne courbe
