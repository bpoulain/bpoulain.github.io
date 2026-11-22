# 1. Paradigme fondamental — UI = état

## 1.1 Modèle mental central

**SwiftUI ne manipule pas une interface. Il décrit une interface.**

L'UI n'est pas un objet que tu modifies. C'est le résultat d'une fonction appliquée à ton état. Quand l'état change, SwiftUI recalcule la description et met à jour l'affichage automatiquement.

> *Analogie du projecteur : tu changes les données (la diapositive), le projecteur recalcule et affiche le résultat. Tu ne touches jamais l'image projetée directement.*

---

## 1.2 Comparaison des paradigmes

| Outil | Nature | Rapport à l'UI |
|-------|--------|----------------|
| **JS vanilla** | Impératif, DOM direct | Tu modifies l'interface manuellement : `element.textContent = ...` |
| **Reef.js v13** | Semi-déclaratif, state-driven | Tu changes `signal.value`, Reef redessine la partie concernée |
| **SwiftUI 6** | Déclaratif pur | Tu décris l'UI en fonction de l'état — SwiftUI fait le reste |

### 1.2.1 JS vanilla — impératif pur

En JS vanilla, tu parles directement au DOM. L'interface est un objet mutable :

```js
// JS vanilla — mutation directe
const btn = document.querySelector('#btn')
const counter = document.querySelector('#count')
let count = 0

btn.addEventListener('click', () => {
  count++
  counter.textContent = count  // tu modifies le DOM toi-même
})
```

Tu dois savoir *où* se trouve l'élément, *comment* le modifier, et *quand* le faire.

### 1.2.2 Reef.js v13 — semi-déclaratif

Avec Reef, tu changes l'état via `signal()`. Reef redessine automatiquement la partie du DOM liée à ce signal :

```js
// Reef.js v13 — state-driven
import { signal, component } from 'reef'

const count = signal(0)

function App() {
  return {
    template() {
      return `<p>${count.value}</p>
              <button data-action="inc">+1</button>`
    },
    events: {
      inc() { count.value++ }
    }
  }
}

component('#app', App)
```

Tu changes la donnée (`count.value++`). Reef recalcule le template et diffuse les changements dans le DOM. Mais la description de l'UI reste une string HTML — tu restes dans le monde du DOM.

### 1.2.3 SwiftUI 6 — déclaratif pur

En SwiftUI, il n'y a **pas de DOM**. Tu décris *ce que l'UI doit être* selon l'état. SwiftUI gère entièrement le rendu :

```swift
// SwiftUI 6 — déclaratif pur
import SwiftUI

struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("\(count)")
            Button("+1") { count += 1 }
        }
    }
}
```

Quand `count` change, SwiftUI recompose `body` et met à jour l'affichage. Tu n'accèdes jamais à l'élément `Text` directement.

---

## 1.3 UI = f(état) — la règle fondamentale

**En SwiftUI, l'UI est une projection de l'état.**

```
état → body → affichage
         ↑
    (recalculé automatiquement à chaque changement d'état)
```

Cette équation est invariante :
- Tu ne pousses pas de changements vers l'UI
- Tu mets à jour l'état
- SwiftUI recalcule `body` et produit le nouvel affichage

---

## 1.4 Recomposition automatique

### 1.4.1 Ce que "recomposition" signifie

Quand un état change, SwiftUI appelle à nouveau `body`. C'est la **recomposition** : SwiftUI relit la description de l'UI et détermine ce qui a changé.

Ce n'est pas un rechargement complet — SwiftUI est efficace : il compare l'ancienne et la nouvelle description et n'effectue que les mises à jour nécessaires.

### 1.4.2 Invalidation automatique

SwiftUI **détecte automatiquement** les dépendances entre l'état et les vues. Tu n'as pas à lui dire "cette vue dépend de cet état". Dès qu'une valeur marquée `@State` (ou équivalent) change, les vues qui l'utilisent sont automatiquement invalidées et recomposées.

*Contrairement à Reef où tu dois appeler `save()` pour persister et où le re-render est lié à la modification d'un `signal()`, SwiftUI ne requiert aucune action manuelle de synchronisation.*

---

## 1.5 Absence de DOM — rupture conceptuelle clé

En JS vanilla et Reef, même déclaratif, il existe un **objet UI physique** (le DOM) que tu peux inspecter et manipuler.

**SwiftUI n'a pas de DOM.** Il n'y a pas d'objet `Button` que tu peux récupérer et modifier. Il y a une *description* de ce que devrait être le bouton, et SwiftUI produit l'interface native correspondante.

| Concept | JS / Reef | SwiftUI |
|---------|-----------|---------|
| Interface | Objet DOM mutable | Description immuable |
| Modification | `element.style.color = ...` | Changer l'état → recomposition |
| Accès à l'UI | `document.querySelector(...)` | Impossible (et inutile) |
| Synchronisation | Manuelle (ou via Reef) | Automatique |

---

## 1.6 État vs rendu — distinction fondamentale

SwiftUI distingue strictement :

- **L'état** (`data`) : les valeurs qui décrivent *ce qui est vrai* dans ton app (compteur à 3, utilisateur connecté, liste de 12 items)
- **Le rendu** (`projection`) : la représentation visuelle de cet état

Tu travailles toujours sur l'état. Le rendu est une conséquence automatique.

```
                   ┌─────────────────┐
   Interaction ──▶ │   État (data)   │
   utilisateur     │   count = 3     │
                   └────────┬────────┘
                            │ changement
                            ▼
                   ┌─────────────────┐
                   │  body (calcul)  │ ← SwiftUI appelle automatiquement
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   Rendu (UI)    │ ← affichage mis à jour
                   └─────────────────┘
```

---

## 1.7 Récapitulatif du changement de paradigme

| Dimension | JS vanilla | Reef.js v13 | SwiftUI 6 |
|-----------|-----------|-------------|-----------|
| Paradigme | Impératif | Semi-déclaratif | Déclaratif pur |
| UI est... | Un objet mutable | Un template re-rendu | Une description recalculée |
| Mise à jour | Manuelle | Via `signal.value` | Via état (`@State`, etc.) |
| Synchronisation | À ta charge | Automatique (Reef) | Automatique (SwiftUI) |
| Accès à l'UI | `querySelector` | Template string | Impossible (inutile) |
| Persistance | Séparée | `save()` manuel | `@AppStorage` (section 10) |

**En une phrase :** SwiftUI est un système de description d'interface, pas de manipulation d'interface.
