# 4. Layout System

## 4.1 Modèle mental central

**SwiftUI négocie la taille entre parent et enfant — aucun n'impose seul.**

Le layout n'est pas absolu (pas de `position: absolute`, pas de `top: 20px`). C'est un système de **propositions et de réponses** : le parent propose un espace, l'enfant choisit sa taille dans cet espace, le parent positionne l'enfant selon les règles d'alignement.

> *Analogie : le parent dit "tu as 300px de large". L'enfant dit "j'en veux 120". Le parent positionne l'enfant dans les 300px selon l'alignement demandé.*

---

## 4.2 Les conteneurs de base

### 4.2.1 `VStack` — axe vertical

Empile les vues verticalement :

```swift
VStack(alignment: .leading, spacing: 8) {
    Text("Titre")
    Text("Sous-titre")
    Image(systemName: "photo")
}
```

- `alignment` : `.leading`, `.center`, `.trailing` (alignement horizontal)
- `spacing` : espace entre les éléments (défaut : 8pt environ)

### 4.2.2 `HStack` — axe horizontal

Empile les vues horizontalement :

```swift
HStack(alignment: .firstTextBaseline, spacing: 12) {
    Image(systemName: "person.fill")
    Text("Benoit Poulain")
    Spacer()
    Text("Designer")
        .foregroundStyle(.secondary)
}
```

- `alignment` : `.top`, `.center`, `.bottom`, `.firstTextBaseline`
- `Spacer()` : pousse les éléments aux deux bords

### 4.2.3 `ZStack` — axe de profondeur

Superpose les vues en Z (profondeur) :

```swift
ZStack(alignment: .bottomLeading) {
    Image(systemName: "photo")
        .resizable()
        .scaledToFill()
    Text("Légende")
        .padding(8)
        .background(.black.opacity(0.6))
        .foregroundStyle(.white)
}
```

---

## 4.3 Taille intrinsèque vs taille contrainte

### 4.3.1 Taille intrinsèque

La **taille intrinsèque** d'une vue est la taille qu'elle "veut" naturellement :
- `Text("Bonjour")` → largeur du texte, hauteur d'une ligne
- `Image(systemName: "star")` → taille native de l'icône
- `Button("OK")` → taille du contenu + padding interne

### 4.3.2 Taille contrainte

Un parent peut **proposer** une taille à son enfant via `.frame()` ou la géométrie du conteneur. L'enfant peut choisir d'occuper tout l'espace proposé ou seulement une partie.

---

## 4.4 `Spacer()` — distribution d'espace

`Spacer()` consomme **tout l'espace disponible** sur l'axe du conteneur parent :

```swift
HStack {
    Text("Gauche")
    Spacer()          // pousse le texte à droite
    Text("Droite")
}
```

```swift
VStack {
    Text("En haut")
    Spacer()          // pousse le bouton en bas
    Button("OK") { }
}
```

Plusieurs `Spacer()` se partagent l'espace équitablement.

---

## 4.5 `.frame()` — contrôle de taille

### 4.5.1 `.frame()` n'est pas `position: absolute`

En CSS, `position: absolute; top: 20px; left: 30px` place un élément à une coordonnée précise. En SwiftUI, `.frame()` est une **contrainte de taille**, pas de position.

```swift
Text("Bonjour")
    .frame(width: 200, height: 50)
    // Propose à Text une zone de 200×50 — Text se positionne selon l'alignement
```

### 4.5.2 `.frame(maxWidth: .infinity)`

Pour qu'une vue occupe tout l'espace disponible en largeur :

```swift
Button("Valider")
    .frame(maxWidth: .infinity)
    .padding()
    .background(.blue)
    .foregroundStyle(.white)
    .clipShape(RoundedRectangle(cornerRadius: 10))
```

### 4.5.3 Alignement dans `.frame()`

```swift
Text("Gauche")
    .frame(maxWidth: .infinity, alignment: .leading)
    // Le frame prend toute la largeur, le texte s'aligne à gauche
```

---

## 4.6 Alignment guides

SwiftUI propose plusieurs alignements pour les conteneurs :

| Alignement | VStack | HStack |
|------------|--------|--------|
| `.leading` / `.trailing` | axe horizontal | — |
| `.top` / `.bottom` | — | axe vertical |
| `.center` | axe horizontal | axe vertical |
| `.firstTextBaseline` | — | aligne sur la baseline du premier texte |
| `.lastTextBaseline` | — | aligne sur la baseline du dernier texte |

---

## 4.7 `layoutPriority` — priorité de layout

Quand plusieurs vues se disputent l'espace, `layoutPriority` détermine qui est servi en premier :

```swift
HStack {
    Text("Texte très long qui pourrait être tronqué")
        .layoutPriority(1)   // ← servi en premier
    Text("Court")
}
```

La vue avec la priorité la plus haute reçoit l'espace qu'elle demande en premier. Les autres prennent ce qui reste.

---

## 4.8 Safe Area

### 4.8.1 Définition

La **safe area** est la zone de l'écran non masquée par les éléments système (encoche, barre de navigation, barre de tab). SwiftUI respecte la safe area par défaut.

### 4.8.2 Ignorer la safe area

```swift
ZStack {
    Color.blue
        .ignoresSafeArea()  // ← étend jusqu'aux bords physiques
    VStack {
        Text("Contenu dans la safe area")
    }
}
```

### 4.8.3 Edges spécifiques

```swift
Color.blue
    .ignoresSafeArea(edges: .top)  // ← seulement en haut
```

---

## 4.9 Comparaison CSS vs SwiftUI Layout

| CSS / HTML | SwiftUI |
|-----------|---------|
| `display: flex; flex-direction: column` | `VStack` |
| `display: flex; flex-direction: row` | `HStack` |
| `position: relative` + enfants superposés | `ZStack` |
| `flex: 1` (prend tout l'espace) | `Spacer()` ou `maxWidth: .infinity` |
| `width: 200px` | `.frame(width: 200)` |
| `max-width: 100%` | `.frame(maxWidth: .infinity)` |
| `position: absolute` | Pas d'équivalent direct — `ZStack` + `.offset()` |
| `gap: 8px` | `spacing: 8` dans `VStack`/`HStack` |
| `padding: 16px` | `.padding(16)` |
| `z-index` | Ordre dans `ZStack` (dernier = devant) |

---

## 4.10 Récapitulatif du système de layout

1. **Le parent propose** un espace disponible à l'enfant
2. **L'enfant choisit** sa taille selon sa taille intrinsèque et les contraintes reçues
3. **Le parent positionne** l'enfant selon ses règles d'alignement
4. Ce processus est **récursif** — chaque vue fait de même avec ses enfants
5. **Aucune coordonnée absolue** — tout est relatif et adaptatif
