# 16. Product Thinking Execution Layer

> **Nature :** section méthodologique — pas de nouveau concept SwiftUI.
> **Objectif :** transformer une idée produit en POC utile, testable, lisible par des stakeholders.
> **Prérequis :** section 15 (Product POC Layer).

---

## 16.1 Modèle mental central

**Un POC n'est pas un prototype. C'est une question formulée en interface.**

Tu ne construis pas une app — tu construis un dispositif de test pour valider une hypothèse. Chaque décision de construction doit répondre à : *"est-ce que ça teste mon hypothèse ?"*

> *Analogie design : un wireframe papier teste la structure. Un prototype cliquable teste le flow. Un POC SwiftUI teste la faisabilité technique ET la compréhension UX — avec de vraies interactions.*

---

## 16.2 Définition du scope POC

### 16.2.1 Une seule hypothèse

Avant de coder, formuler une seule question produit :

```
❌ Trop large :
   "Je veux voir si l'app est utilisable"

✅ Hypothèse testable :
   "Les utilisateurs comprennent-ils que swiper vers la gauche ajoute au panier ?"
   "Le flow onboarding en 3 étapes est-il trop long ?"
   "Les users trouvent-ils le bouton 'Partager' sans aide ?"
```

### 16.2.2 Définir le hors-scope explicitement

Un POC sans liste de ce qu'il ne fait pas dérive toujours. Écrire explicitement :

```
POC : Flow de paiement simplifié

IN SCOPE :
- Saisie carte bancaire (mock — validation de format uniquement)
- Récapitulatif commande
- Confirmation visuelle

OUT OF SCOPE :
- Vrai paiement Stripe
- Gestion des erreurs bancaires réelles
- Sauvegarde de carte
- Historique des commandes
```

### 16.2.3 Timeboxing

Un POC a une deadline courte — 1 à 5 jours selon la complexité. Passé ce délai, c'est un produit, pas un POC.

---

## 16.3 What to fake vs what to build

### 16.3.1 La règle centrale

> **Fake everything that doesn't validate your UX hypothesis.**

### 16.3.2 Tableau de décision

| Composant | Build | Fake | Raison |
|-----------|-------|------|--------|
| Core UX flow | ✅ | | C'est l'hypothèse à tester |
| Interactions clés | ✅ | | Les animations/transitions font partie de l'hypothèse |
| Données affichées | | ✅ | Mock JSON suffit pour valider la lisibilité |
| Authentification | | ✅ souvent | Hors scope si le flow testé commence après login |
| Backend / API réelle | | ✅ | MockService (section 15) |
| Logique métier complexe | | ✅ | Hard-code les cas représentatifs |
| Edge cases | | ✅ | Tester le happy path d'abord |
| États d'erreur | ✅ partiel | | UX des erreurs fait partie de la crédibilité |

### 16.3.3 Comment hard-coder intelligemment

```swift
// ❌ Hard-code caché dans la View
struct CheckoutView: View {
    var body: some View {
        Text("Total : 129,99 €")  // ← non testable, non configurable
    }
}

// ✅ Hard-code dans les données mock — configurable
struct CheckoutView: View {
    let order: Order  // ← données injectées, même si c'est du mock

    var body: some View {
        Text("Total : \(order.total.formatted(.currency(code: "EUR")))")
    }
}

extension Order {
    static let mockCheckout = Order(
        items: [Product.mockData[0], Product.mockData[1]],
        deliveryDate: Calendar.current.date(byAdding: .day, value: 3, to: Date())!
    )
}
```

---

## 16.4 Priorisation des flows

### 16.4.1 Maximum 2 flows par POC

```
Flow principal (obligatoire) :
  → Le flow qui teste l'hypothèse centrale

Flow secondaire (optionnel) :
  → Un flow adjacent qui permet la navigation de retour
  → Ex : si le flow principal est "checkout", le secondaire est "retour panier"

Tout le reste :
  → Boutons disabled, écrans placeholder, "coming soon"
```

### 16.4.2 Placeholder propre

```swift
struct PlaceholderScreen: View {
    let title: String

    var body: some View {
        ContentUnavailableView(
            title,
            systemImage: "hammer",
            description: Text("Cette section sera disponible prochainement")
        )
    }
}

// Usage dans NavigationStack
.navigationDestination(for: AppRoute.self) { route in
    switch route {
    case .checkout(let items):
        CheckoutView(items: items)   // ← implémenté
    case .orderHistory:
        PlaceholderScreen(title: "Historique")  // ← hors scope
    case .settings:
        PlaceholderScreen(title: "Paramètres")  // ← hors scope
    }
}
```

---

## 16.5 Instrumentation UX légère

### 16.5.1 Logs simples pour observer le comportement

```swift
// Tracking des étapes clés — print suffit pour un POC
struct CheckoutView: View {
    var body: some View {
        VStack { ... }
            .onAppear { print("[POC] checkout_viewed") }
    }
}

Button("Confirmer") {
    print("[POC] checkout_confirmed — step: \(currentStep)")
    proceed()
}
```

### 16.5.2 Tracking manuel des points de friction

Pendant les tests utilisateurs, noter manuellement :
- Où l'utilisateur hésite (> 3 secondes sans action)
- Les taps sur des éléments non-interactifs
- Les retours en arrière inattendus
- Les questions verbales pendant la session

Ces observations valent plus que des analytics automatiques pour un POC.

### 16.5.3 Feature flag de debug visible

```swift
// Overlay debug visible pendant les tests
struct DebugOverlay: View {
    @State private var log: [String] = []

    var body: some View {
        VStack {
            Spacer()
            if !log.isEmpty {
                ScrollView(.horizontal) {
                    HStack {
                        ForEach(log, id: \.self) { entry in
                            Text(entry)
                                .font(.caption2)
                                .padding(4)
                                .background(.black.opacity(0.7))
                                .foregroundStyle(.white)
                                .clipShape(Capsule())
                        }
                    }
                    .padding(.horizontal)
                }
                .frame(height: 30)
            }
        }
    }
}
```

---

## 16.6 Design → Code translation mindset

### 16.6.1 Figma n'est pas une spec technique

Un Figma contient des pixels, des couleurs, des états visuels. Il ne décrit pas :
- Les états intermédiaires (loading, error, empty)
- La hiérarchie de l'état
- Les transitions de navigation
- Les cas limites (texte trop long, liste vide, etc.)

**Ton rôle en tant que designer qui code :** compléter ce que Figma ne dit pas.

### 16.6.2 Simplification structurelle obligatoire

```
Figma :           →    SwiftUI :
pixel-perfect          adaptatif
états statiques        états dynamiques
desktop-first          mobile-first + Dynamic Type
animations Lottie      animations SwiftUI natives
```

**Traduction pratique :**

```swift
// Au lieu de reproduire pixel par pixel un composant Figma complexe
// → utiliser les composants SwiftUI natifs comme base

// Figma : "custom bottom sheet avec handle, corner radius 24, blur fond"
// SwiftUI → .sheet() avec détents
.sheet(isPresented: $showSheet) {
    ContentView()
        .presentationDetents([.medium, .large])  // ← natif iOS 26
        .presentationDragIndicator(.visible)
}
```

### 16.6.3 Penser en states, pas en pixels

```
Figma frame "Panier plein"  →  state: .success(items) avec items.count > 0
Figma frame "Panier vide"   →  state: .empty
Figma frame "Chargement"    →  state: .loading

→ Ces 3 frames Figma = 1 enum FeatureState<[Item]> en Swift
```

---

## 16.7 Cycle de prototypage POC

### 16.7.1 Les 7 étapes

```
1. Hypothèse produit
   → "Les users comprennent-ils que swiper ajoute au panier ?"

2. Flow utilisateur
   → Dessiner les écrans et transitions sur papier ou Figma

3. Mock data
   → Définir les structs et les données statiques (section 15)

4. SwiftUI skeleton
   → Structurer les Views sans logique — juste la hiérarchie et le layout

5. Injection de data
   → Brancher le MockService, afficher les vraies données mock

6. Test rapide
   → Session de test de 30 min avec 2-3 utilisateurs

7. Itération
   → Corriger les friction points identifiés, retester
```

### 16.7.2 Skeleton d'abord

```swift
// Étape 4 — skeleton sans logique
struct CheckoutView: View {
    // Pas encore de @State, pas de model
    let items: [Product]  // ← données hardcodées depuis l'appelant

    var body: some View {
        List {
            ForEach(items) { item in
                HStack {
                    Text(item.name)
                    Spacer()
                    Text(item.formattedPrice)
                }
            }
        }
        Button("Confirmer la commande") { }   // ← action vide pour l'instant
            .buttonStyle(.borderedProminent)
            .frame(maxWidth: .infinity)
            .padding()
    }
}

#Preview {
    CheckoutView(items: Product.mockData)
}
```

Construire la structure visuelle et le layout **avant** d'ajouter la logique. Prévisualiser à chaque étape.

---

## 16.8 KPI implicites du POC

### 16.8.1 Ce qu'on mesure réellement

| KPI | Question | Observable |
|-----|----------|-----------|
| **Compréhension du flow** | L'utilisateur sait-il quoi faire ? | Taps sur les bons éléments au premier essai |
| **Fluidité UX** | Les transitions sont-elles fluides ? | Hesitations, retours en arrière inattendus |
| **Points de friction** | Où l'utilisateur bloque-t-il ? | Temps passé sur chaque écran |
| **Validation / Invalidation** | L'hypothèse est-elle confirmée ? | Conclusion binaire après les tests |

### 16.8.2 Décision post-POC

```
POC réussi → l'hypothèse est validée → on construit la vraie feature
POC échoué → l'hypothèse est invalidée → on pivote (ce n'est pas un échec)
POC ambigu → manque de données → on refait un POC plus ciblé
```

**Le POC a réussi même s'il ne fait "rien" de réel** — il a répondu à une question. C'est son unique objectif.
