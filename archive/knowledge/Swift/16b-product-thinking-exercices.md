# 16. Product Thinking Execution Layer — Exercices

> **Format adapté :** cette section est purement méthodologique — pas de nouveau concept SwiftUI.
> Les exercices prennent la forme de scénarios produit, de décisions de scope, et d'un mini cas réel combinant sections 15 et 16.

---

## Exercice 16.1 — Formulation d'hypothèse POC

### Énoncé

Un product manager t'envoie ce brief :

> *"On veut construire un POC pour voir si notre nouvelle app de méditation fonctionne bien. Il faudrait qu'on puisse voir si les gens aiment l'app, si le design est bon, si les sessions sont assez longues, et si le flow d'inscription est trop compliqué."*

**Questions :**

→ Combien d'hypothèses distinctes ce brief contient-il ?
→ Laquelle prioriseras-tu pour le POC ? Justifie ton choix.
→ Reformule-la en une hypothèse testable, précise, binaire.
→ Définis un scope IN / OUT pour ce POC.

*Tente de répondre avant de lire la correction.*

---

### Correction 16.1

**Décompte des hypothèses cachées :**

Le brief contient **4 hypothèses distinctes** — aucune n'est formulée de façon testable :

```
1. "L'app fonctionne bien"          → vague — quelle metric ?
2. "Les gens aiment le design"      → mesurable mais flou (quelle définition de "aimer" ?)
3. "Les sessions sont assez longues" → hypothèse sur la durée optimale
4. "Le flow d'inscription est trop compliqué" → ← LA PLUS TESTABLE
```

**Priorisation :**

L'inscription est le point d'entrée universel — si les utilisateurs ne passent pas cette étape, rien d'autre ne peut être testé. C'est le **bloqueur le plus tôt dans le funnel**, donc le plus critique à valider.

**Reformulation en hypothèse testable :**

```
❌ "L'inscription est trop compliquée"
   → jugement — pas de critère de succès défini

✅ "Les utilisateurs complètent le flow d'inscription en 3 étapes
   (email / préférences / notification) en moins de 90 secondes
   sans aide extérieure."

   Critère de succès : 3 utilisateurs sur 4 complètent le flow
   en moins de 90 secondes sans poser de question.
   Critère d'échec : blocage sur l'écran "préférences" (hésitation
   de plus de 10 secondes ou question verbale).
```

**Scope IN / OUT :**

```
POC : Flow d'inscription — app méditation

IN SCOPE :
- Écran 1 : saisie email (mock — pas de vraie auth)
- Écran 2 : sélection des préférences (3 catégories : stress / sommeil / focus)
- Écran 3 : autorisation notifications (mock — pas de vraie demande système)
- Écran confirmation

OUT OF SCOPE :
- Vraie authentification (Firebase, Auth0, etc.)
- Validation d'email réelle
- Sauvegarde des préférences en base
- Contenu de méditation (0 session dans ce POC)
- Abonnement / paiement
- Toute feature post-inscription
```

---

## Exercice 16.2 — Build vs Fake : décision de scope

### Énoncé

Tu construis un POC pour valider le flow de **réservation d'un restaurant** :

> *L'hypothèse : "Les utilisateurs comprennent qu'ils peuvent filtrer par date ET par nombre de couverts avant de choisir un restaurant."*

Voici la liste des composants envisagés. Pour chacun, décide : **Build** ou **Fake** ?

| Composant | Ta décision | Raison |
|-----------|-------------|--------|
| DatePicker (sélection de date) | ? | |
| Stepper (nombre de couverts 1–10) | ? | |
| Liste de restaurants (données réelles depuis API) | ? | |
| Filtre par prix (€ / €€ / €€€) | ? | |
| Animations de transition entre écrans | ? | |
| Authentification utilisateur | ? | |
| Confirmation de réservation (email envoyé) | ? | |
| État d'erreur réseau | ? | |
| Carte interactive (MapKit) | ? | |
| Avis utilisateurs (notes / commentaires) | ? | |

*Complète le tableau avant de lire la correction.*

---

### Correction 16.2

```
Rappel de l'hypothèse :
"Les utilisateurs comprennent qu'ils peuvent filtrer
par date ET nombre de couverts avant de choisir."
→ Ce qui est testé : la découvrabilité des filtres et leur compréhension.
```

| Composant | Décision | Raison |
|-----------|----------|--------|
| **DatePicker** | ✅ Build | C'est le cœur de l'hypothèse — doit être interactif |
| **Stepper couverts** | ✅ Build | Idem — fait partie du filtre à tester |
| **Liste de restaurants** | ✅ Fake (mock JSON) | La liste existe pour donner du contexte, pas pour tester l'API |
| **Filtre par prix** | ✅ Fake (disabled) | Hors scope — `PlaceholderScreen` ou bouton disabled |
| **Animations de transition** | ✅ Build (partielles) | Une transition fluide fait partie de la compréhension du flow |
| **Authentification** | ✅ Fake (skip) | Le flow testé commence avant le login |
| **Confirmation email** | ✅ Fake (écran visuel) | L'écran de confirmation valide la fin du flow — le vrai email non |
| **État d'erreur réseau** | ✅ Build (partiel) | Si le mock "échoue", l'UX d'erreur fait partie de la crédibilité |
| **Carte MapKit** | ✅ Fake (image statique) | La carte ne teste pas l'hypothèse — coût technique élevé pour zéro insight |
| **Avis utilisateurs** | ✅ Fake (données hardcodées) | Données affichées pour le réalisme — pas testées |

**Pattern décisionnel :**

```
BUILD si :
  → Le composant est sur le chemin critique de l'hypothèse
  → Son absence rend le test invalide
  → Son comportement fait partie de ce qu'on mesure

FAKE si :
  → C'est du contexte qui rend le POC crédible mais ne teste rien
  → C'est hors scope de l'hypothèse
  → Le coût de construction dépasse l'insight produit
```

---

## Exercice 16.3 — Mini cas réel : POC d'un flow onboarding

### Énoncé

Tu dois construire un POC pour valider cette hypothèse :

> *"Les utilisateurs comprennent que l'app personnalise leur contenu selon leurs réponses à l'onboarding — et que chaque question a un impact visible sur ce qu'ils voient ensuite."*

L'app est une **app de lecture** (articles, livres numériques). L'onboarding comporte 3 questions :

1. Quel genre de contenu préfères-tu ? (Fiction / Non-fiction / Les deux)
2. Combien de temps as-tu pour lire par jour ? (< 15 min / 15–30 min / 30 min+)
3. Quel est ton objectif ? (Me divertir / Apprendre / Les deux)

Après l'onboarding, l'utilisateur voit un **feed personnalisé** (titre + badge de catégorie).

**Ta mission :**

1. Avant de coder : définir les modèles, le service, l'état partagé
2. Écrire le skeleton complet (sans logique) — structure et navigation uniquement
3. Brancher les données mock — le feed doit changer selon les réponses

*Décris l'architecture d'abord, code ensuite.*

---

### Correction 16.3

**Étape 1 — Architecture**

```
Hypothèse : l'utilisateur perçoit la connexion réponse → contenu
→ Ce qui est testé : la lisibilité du lien cause/effet

Modèles nécessaires :
- OnboardingAnswer (les 3 réponses)
- Article (contenu mock du feed)
- OnboardingModel (état du flow + réponses)
- FeedModel (génère les articles selon les réponses)

Service : pas de protocol nécessaire — les données sont entièrement hardcodées
→ La personnalisation est simulée par filtrage local, pas un vrai algorithme

Navigation : flow linéaire (pas de NavigationStack — switch d'état)
→ OnboardingView → Q1 → Q2 → Q3 → FeedView
```

**Étape 2 — Code complet**

```swift
// MODÈLES

enum ContentPreference: String, CaseIterable {
    case fiction = "Fiction"
    case nonFiction = "Non-fiction"
    case both = "Les deux"
}

enum ReadingTime: String, CaseIterable {
    case short = "< 15 min"
    case medium = "15–30 min"
    case long = "30 min+"
}

enum ReadingGoal: String, CaseIterable {
    case entertainment = "Me divertir"
    case learning = "Apprendre"
    case both = "Les deux"
}

struct OnboardingAnswer {
    var contentPreference: ContentPreference = .both
    var readingTime: ReadingTime = .medium
    var goal: ReadingGoal = .both
}

struct Article: Identifiable {
    let id = UUID()
    let title: String
    let category: String
    let readingMinutes: Int
    let isNonFiction: Bool
}

// DONNÉES MOCK — pool complet
extension Article {
    static let all: [Article] = [
        Article(title: "L'IA va-t-elle remplacer les designers ?", category: "Technologie", readingMinutes: 8, isNonFiction: true),
        Article(title: "Fondations du Swift moderne", category: "Apprentissage", readingMinutes: 12, isNonFiction: true),
        Article(title: "La dernière nuit à Paris", category: "Fiction", readingMinutes: 5, isNonFiction: false),
        Article(title: "Pourquoi vous lisez mal", category: "Productivité", readingMinutes: 20, isNonFiction: true),
        Article(title: "Le dernier train", category: "Thriller", readingMinutes: 7, isNonFiction: false),
        Article(title: "Design thinking en 2026", category: "Apprentissage", readingMinutes: 15, isNonFiction: true),
        Article(title: "Nuits blanches", category: "Fiction", readingMinutes: 3, isNonFiction: false),
        Article(title: "Les biais cognitifs expliqués", category: "Psychologie", readingMinutes: 25, isNonFiction: true)
    ]

    // Filtrage selon les réponses
    static func filtered(by answer: OnboardingAnswer) -> [Article] {
        all.filter { article in
            // Filtre par type de contenu
            let contentMatch: Bool = switch answer.contentPreference {
            case .fiction: !article.isNonFiction
            case .nonFiction: article.isNonFiction
            case .both: true
            }

            // Filtre par durée
            let timeMatch: Bool = switch answer.readingTime {
            case .short: article.readingMinutes < 10
            case .medium: article.readingMinutes <= 20
            case .long: true
            }

            return contentMatch && timeMatch
        }
    }
}

// MODÈLE ONBOARDING

enum OnboardingStep {
    case q1ContentPreference
    case q2ReadingTime
    case q3Goal
    case feed
}

@Observable
class OnboardingModel {
    var step: OnboardingStep = .q1ContentPreference
    var answer = OnboardingAnswer()

    func selectContent(_ pref: ContentPreference) {
        answer.contentPreference = pref
        step = .q2ReadingTime
    }

    func selectTime(_ time: ReadingTime) {
        answer.readingTime = time
        step = .q3Goal
    }

    func selectGoal(_ goal: ReadingGoal) {
        answer.goal = goal
        step = .feed
    }

    var personalizedFeed: [Article] {
        Article.filtered(by: answer)
    }
}

// ROOT

struct ReadingPOC: View {
    @State private var model = OnboardingModel()

    var body: some View {
        switch model.step {
        case .q1ContentPreference:
            OnboardingQ1View()
        case .q2ReadingTime:
            OnboardingQ2View()
        case .q3Goal:
            OnboardingQ3View()
        case .feed:
            PersonalizedFeedView()
        }
    }
    // Injection à la racine — toutes les sous-vues y accèdent
    // (inline pour la lisibilité du POC)
}

// Wrap avec environment pour que les sous-vues y accèdent :
struct ReadingPOCApp: View {
    @State private var model = OnboardingModel()

    var body: some View {
        Group {
            switch model.step {
            case .q1ContentPreference:
                OnboardingQ1View()
            case .q2ReadingTime:
                OnboardingQ2View()
            case .q3Goal:
                OnboardingQ3View()
            case .feed:
                PersonalizedFeedView()
            }
        }
        .environment(model)
        .animation(.easeInOut, value: model.step)  // ← transition visible entre étapes
    }
}

// ÉCRANS ONBOARDING

struct OnboardingQ1View: View {
    @Environment(OnboardingModel.self) private var model

    var body: some View {
        VStack(spacing: 24) {
            ProgressView(value: 1, total: 3)
                .padding(.horizontal)

            Spacer()

            Text("Quel genre de contenu préfères-tu ?")
                .font(.title2).bold()
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(ContentPreference.allCases, id: \.self) { pref in
                    Button(pref.rawValue) {
                        model.selectContent(pref)
                    }
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal)

            Spacer()
        }
        .navigationTitle("Étape 1 / 3")
    }
}

struct OnboardingQ2View: View {
    @Environment(OnboardingModel.self) private var model

    var body: some View {
        VStack(spacing: 24) {
            ProgressView(value: 2, total: 3)
                .padding(.horizontal)

            Spacer()

            Text("Combien de temps as-tu pour lire par jour ?")
                .font(.title2).bold()
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(ReadingTime.allCases, id: \.self) { time in
                    Button(time.rawValue) {
                        model.selectTime(time)
                    }
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal)

            Spacer()
        }
    }
}

struct OnboardingQ3View: View {
    @Environment(OnboardingModel.self) private var model

    var body: some View {
        VStack(spacing: 24) {
            ProgressView(value: 3, total: 3)
                .padding(.horizontal)

            Spacer()

            Text("Quel est ton objectif principal ?")
                .font(.title2).bold()
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(ReadingGoal.allCases, id: \.self) { goal in
                    Button(goal.rawValue) {
                        model.selectGoal(goal)
                    }
                    .buttonStyle(.borderedProminent)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal)

            Spacer()
        }
    }
}

// FEED PERSONNALISÉ

struct PersonalizedFeedView: View {
    @Environment(OnboardingModel.self) private var model

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 0) {
                // ← Feedback explicite sur la personnalisation
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundStyle(.accent)
                    Text("Sélectionné pour toi · \(model.answer.contentPreference.rawValue)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(.regularMaterial)

                if model.personalizedFeed.isEmpty {
                    ContentUnavailableView(
                        "Aucun article correspond",
                        systemImage: "books.vertical",
                        description: Text("Essaie de modifier tes préférences")
                    )
                } else {
                    List(model.personalizedFeed) { article in
                        ArticleRow(article: article)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Ton feed")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct ArticleRow: View {
    let article: Article

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(article.category)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.accentColor.opacity(0.15))
                    .foregroundStyle(.accent)
                    .clipShape(Capsule())

                Spacer()

                Text("\(article.readingMinutes) min")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Text(article.title)
                .font(.subheadline)
                .bold()
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ReadingPOCApp()
}
```

**Ce que ce POC valide :**

```
✅ Hypothèse testable :
   L'utilisateur voit que ses réponses modifient le contenu du feed
   → Observable : le badge "Sélectionné pour toi · Fiction" change selon Q1

✅ Lien cause/effet visible :
   → La ProgressView montre la progression dans l'onboarding
   → Le header du feed rappelle explicitement la réponse choisie
   → La liste change réellement selon les réponses (filtrage local)

✅ Feedback UX si aucun résultat :
   → ContentUnavailableView si la combinaison retourne 0 articles

✅ Switch vers données réelles = 1 ligne :
   → Remplacer Article.filtered(by:) par un appel de service
```

**Ce que ce POC ne valide PAS (out of scope) :**

```
❌ Vraie authentification
❌ Algorithme de personnalisation réel
❌ Persistance des préférences (AppStorage)
❌ Contenu réel (API articles)
❌ Toute navigation post-feed (détail d'article, favoris, etc.)
```
