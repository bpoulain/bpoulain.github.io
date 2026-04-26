# 4. Layout System — Exercices

---

## Exercice 4.1 — Traduction mentale (CSS → SwiftUI)

### Énoncé

Voici une structure HTML/CSS :

```html
<div style="display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px">
    <img src="avatar.png" style="width:48px; height:48px; border-radius:50%">
    <div style="flex:1">
        <p style="font-weight:bold; margin:0">Benoit Poulain</p>
        <p style="color:gray; margin:0">Designer</p>
    </div>
    <span style="color:green">En ligne</span>
</div>
```

**Questions :**

→ Quel conteneur SwiftUI correspond à `display:flex; flex-direction:row` ?
→ Comment traduire `flex:1` (prend tout l'espace restant) ?
→ Comment placer "En ligne" à droite ?

*Tente de répondre avant de lire la correction.*

---

### Correction 4.1

**Modèle mental :**

`flex-direction: row` → `HStack`. `flex: 1` → `Spacer()` ou `.frame(maxWidth: .infinity)`. L'alignement `center` sur l'axe vertical est le défaut de `HStack`.

```swift
struct UserRow: View {
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "person.circle.fill")
                .resizable()
                .frame(width: 48, height: 48)
                .foregroundStyle(.blue)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 2) {
                Text("Benoit Poulain")
                    .bold()
                Text("Designer")
                    .foregroundStyle(.secondary)
                    .font(.subheadline)
            }

            Spacer()   // ← équivalent flex:1 — pousse "En ligne" à droite

            Text("En ligne")
                .foregroundStyle(.green)
                .font(.caption)
        }
        .padding(16)
    }
}
```

**Correspondances clés :**

| CSS | SwiftUI |
|-----|---------|
| `display:flex; flex-direction:row` | `HStack` |
| `align-items:center` | alignement vertical par défaut de `HStack` |
| `gap:12px` | `spacing: 12` dans `HStack` |
| `flex:1` sur l'élément du milieu | `Spacer()` après cet élément |
| `padding:16px` | `.padding(16)` |

---

## Exercice 4.2 — Piège de paradigme

### Énoncé

Un développeur vient de CSS et écrit ça pour centrer un texte :

```swift
struct CenteredView: View {
    var body: some View {
        Text("Centré")
            .frame(width: 300, height: 100)
    }
}
```

Et pour une bannière plein écran :

```swift
struct BannerView: View {
    var body: some View {
        ZStack {
            Color.blue
                .frame(width: 390, height: 200)  // ← largeur fixe codée en dur
            Text("Bienvenue")
                .foregroundStyle(.white)
        }
    }
}
```

**Questions :**
→ Que fait réellement `.frame(width: 300)` sur le Text ?
→ Quel est le problème avec `width: 390` dans `BannerView` ?
→ Comment faire une bannière qui s'adapte à n'importe quelle largeur d'écran ?

---

### Correction 4.2

**Problème 1 — `.frame()` n'est pas position:**

`.frame(width: 300, height: 100)` donne au `Text` une zone de 300×100, mais le texte reste centré **dans cette zone** par défaut. Ce n'est pas un positionnement absolu — c'est une contrainte de taille.

```
❌ Ce que le cerveau fait :
   "frame crée une boite à une position précise, comme un div"

✅ Comment ça fonctionne réellement :
   frame définit une taille proposée — la View s'aligne à l'intérieur
   selon l'alignment (défaut: .center)
```

**Problème 2 — taille fixe codée en dur :**

`width: 390` ne marchera pas sur un iPad, un iPhone Plus, ou un Mac. SwiftUI est conçu pour s'adapter aux écrans.

**Code corrigé :**

```swift
struct BannerView: View {
    var body: some View {
        ZStack {
            Color.blue
                .frame(maxWidth: .infinity, minHeight: 200)
                // ← prend toute la largeur disponible, hauteur min 200
            Text("Bienvenue")
                .foregroundStyle(.white)
                .font(.largeTitle)
        }
    }
}
```

**Règle à retenir :**
- `.frame(maxWidth: .infinity)` = prend toute la largeur disponible (adaptatif)
- `.frame(width: 300)` = contrainte fixe (non adaptatif, à éviter sauf raison précise)
- Jamais de largeur codée en dur basée sur la résolution d'un appareil

---

## Exercice 4.3 — Mini cas réel

### Énoncé

Tu construis une barre de navigation personnalisée pour une app. Elle doit avoir :
- Un bouton retour (icône chevron.left) à gauche
- Un titre centré
- Un bouton d'action (icône ellipsis) à droite
- Hauteur standard, fond blanc/système, séparateur en bas

**Avant de coder :**
→ Quel conteneur principal ?
→ Comment centrer le titre tout en ayant des boutons aux bords ?
→ Comment gérer le séparateur ?

*Décris d'abord, code ensuite.*

---

### Correction 4.3

**Modèle mental :**

`HStack` avec un `Spacer()` de chaque côté du titre, ou `ZStack` avec le titre au centre et les boutons dans un `HStack`. La deuxième approche garantit un centrage absolu même si les boutons ont des largeurs différentes.

**Approche 1 — HStack + Spacers (simple) :**

```swift
struct CustomNavBar: View {
    let title: String
    var onBack: () -> Void = {}
    var onAction: () -> Void = {}

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onBack) {
                    Image(systemName: "chevron.left")
                        .font(.title3)
                        .foregroundStyle(.primary)
                }
                .frame(width: 44)

                Spacer()

                Text(title)
                    .font(.headline)

                Spacer()

                Button(action: onAction) {
                    Image(systemName: "ellipsis")
                        .font(.title3)
                        .foregroundStyle(.primary)
                }
                .frame(width: 44)
            }
            .padding(.horizontal, 16)
            .frame(height: 44)

            Divider()
        }
        .background(.background)
    }
}

#Preview {
    VStack {
        CustomNavBar(title: "Mon titre")
        Spacer()
    }
}
```

**Approche 2 — ZStack pour centrage garanti :**

```swift
struct CustomNavBar: View {
    let title: String

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                Text(title)
                    .font(.headline)
                    .frame(maxWidth: .infinity)  // ← centré absolument

                HStack {
                    Button { } label: {
                        Image(systemName: "chevron.left").font(.title3)
                    }
                    Spacer()
                    Button { } label: {
                        Image(systemName: "ellipsis").font(.title3)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(height: 44)
            .foregroundStyle(.primary)

            Divider()
        }
        .background(.background)
    }
}
```

**Points clés :**
- `ZStack` permet de superposer le titre centré et les boutons aux bords
- `.frame(width: 44)` sur les boutons : zone de tap standard iOS (44pt)
- `Divider()` : séparateur horizontal standard système
- `.background(.background)` : couleur de fond adaptative (clair/sombre)

**Erreurs classiques :**
- ❌ Utiliser `padding` pour "centrer" un titre — ça cassera sur d'autres appareils
- ❌ Coder en dur des positions (`offset(x: 150)`) pour centrer
- ✅ `Spacer()` ou `ZStack` pour un centrage adaptatif
