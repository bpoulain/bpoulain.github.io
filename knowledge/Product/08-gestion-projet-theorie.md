# Section 8 — Gestion de projet & Priorisation

> **Fichier théorie — aucun exercice.**
> Cette section couvre les fondamentaux de la planification UX orientée impact, des méthodes agiles appliquées au design, et des outils IA qui transforment le suivi de performance en avantage décisionnel.

---

## Table des matières

1. [Roadmap UX & Product : aligner impact utilisateur et métriques business](#1-roadmap-ux--product--aligner-impact-utilisateur-et-métriques-business)
2. [OKRs & KPIs : de la stratégie à la mesure UX](#2-okrs--kpis--de-la-stratégie-à-la-mesure-ux)
3. [Estimation d'effort & planning UX](#3-estimation-deffort--planning-ux)
4. [Méthodes agiles & gestion des dépendances UX](#4-méthodes-agiles--gestion-des-dépendances-ux)
5. [Suivi de performance & feedback loops](#5-suivi-de-performance--feedback-loops)
6. [IA appliquée : dashboards, alertes et prédictions](#6-ia-appliquée--dashboards-alertes-et-prédictions)

---

## 1. Roadmap UX & Product : aligner impact utilisateur et métriques business

### Modèle mental

Une roadmap n'est pas une liste de fonctionnalités avec des dates. C'est une narration stratégique qui relie chaque initiative à un problème utilisateur documenté ET à un objectif business mesurable. Si une ligne de la roadmap ne peut pas répondre à "quel problème utilisateur ça résout ?" et "quel KPI ça améliore ?", elle ne devrait pas y figurer.

**Analogie stable**

Une roadmap ressemble à un plan de traitement médical sur 12 mois : chaque intervention (fonctionnalité) est justifiée par un diagnostic (insight utilisateur), vise un résultat mesurable (KPI), et est ordonnée selon la priorité médicale (impact vs risque). Un plan de traitement qui liste des soins sans diagnostic est de la médecine défensive, pas de la médecine.

---

### Anatomie d'une roadmap UX/Product efficace

#### Les dimensions essentielles de chaque initiative

| Dimension | Question clé | Exemple |
|-----------|-------------|---------|
| **Problème utilisateur** | Quel pain point documenté adresse-t-on ? | "65% des utilisateurs abandonnent à l'étape 3 du checkout" |
| **Hypothèse de solution** | Quelle solution testons-nous ? | "Réduire le formulaire de 8 à 4 champs" |
| **Objectif business** | Quel OKR cette initiative sert-elle ? | "Augmenter le taux de conversion de 12% à Q3" |
| **KPI de succès** | Comment mesure-t-on la réussite ? | "Taux de complétion checkout > 80%" |
| **Effort estimé** | Combien de sprints ? | "3 sprints (design + dev + test)" |
| **Dépendances** | Qui/quoi bloque ou est bloqué ? | "Requiert refonte du design system boutons" |
| **Risque UX** | Quel risque pour l'expérience ? | "Risque : suppression de champs perçue comme manque de sécurité" |

---

### Types de roadmaps selon l'audience

| Type | Audience | Horizon temporel | Format |
|------|----------|-----------------|--------|
| **Roadmap stratégique** | Direction, investisseurs | 12-24 mois | Thèmes, pas de dates fixes |
| **Roadmap produit** | PM, équipes produit | 3-6 mois | Initiatives + trimestres |
| **Roadmap UX** | UX, design system | 1-3 mois | Flux, composants, recherches |
| **Roadmap de sprint** | Dev, UX opérationnel | 2 semaines | User stories détaillées |

**Erreur fréquente** : utiliser la même roadmap pour toutes les audiences. La direction veut des thèmes et des impacts business. Les devs veulent des user stories précises. Présenter la roadmap stratégique à l'équipe dev crée de la confusion ; présenter la roadmap de sprint à la direction noie le signal dans le bruit.

---

### Roadmap "Now / Next / Later" : le format le plus adapté à l'UX

```
NOW (Sprint en cours ou trimestre T)
├── Initiative A — Refonte onboarding (KPI : activation +15%)
└── Initiative B — Accessibilité module paiement (KPI : conformité WCAG AA)

NEXT (Trimestre T+1)
├── Initiative C — Personnalisation tableau de bord (KPI : engagement +20%)
└── Initiative D — Mode sombre (KPI : rétention utilisateurs mobiles)

LATER (T+2 et au-delà — sujets à changement)
├── Initiative E — Internationalisation (KPI : nouveaux marchés)
└── Initiative F — IA recommendations (KPI : conversion cross-sell)
```

**Avantage** : ce format communique la direction sans promettre des dates qui seront inévitablement manquées. Il est honnête sur l'incertitude croissante avec le temps.

---

### IA pour prévision d'impact et de risque

**Ce que l'IA peut apporter à la construction de roadmap**

| Fonctionnalité IA | Mécanisme | Bénéfice | Limite |
|------------------|-----------|---------|--------|
| Prévision d'impact | Analyse des données historiques (A/B tests passés, analytics) pour prédire l'impact d'une initiative similaire | Décisions basées sur patterns réels | Dépend de la qualité et quantité des données historiques |
| Scoring de risque | Analyse des initiatives similaires ayant échoué pour identifier les signaux de risque | Prévention proactive | Ne prédit pas les risques nouveaux sans précédent |
| Priorisation assistée | Calcul automatique du score RICE/ICE sur la base des données disponibles | Objectivité dans la priorisation | Peut manquer de contexte qualitatif |
| Détection de dépendances | Analyse des tickets et composants pour identifier les blocages potentiels | Anticipation des délais | Faux positifs si les données Jira/Figma sont incomplètes |

**Principe essentiel** : l'IA assiste la priorisation, elle ne la remplace pas. Les décisions de roadmap intègrent des dimensions politiques, éthiques, et stratégiques que les algorithmes ne peuvent pas peser correctement.

---

### Correction modèle mental

**❌ Idée reçue** : "Une roadmap doit avoir des dates précises pour être crédible."

**✅ Approche correcte** : Les dates précises à 6+ mois sont des illusions de certitude. Elles créent des engagements impossibles à tenir et des dettes UX (couper des tests utilisateurs pour respecter une deadline). Préférer les horizons trimestriels et les formats Now/Next/Later. La crédibilité vient de la clarté des priorités et du rationnel de priorisation, pas de la précision illusoire des dates.

**KPI impacté** : taux de livraison dans les délais annoncés, satisfaction des stakeholders (NPS interne)

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de complétion des initiatives UX planifiées | Taux de réalisation des OKRs trimestriels |
| Taux d'initiatives validées par tests utilisateurs | ROI des initiatives livrées (impact KPI mesuré) |
| Délai entre insight utilisateur et mise en roadmap | Réduction du time-to-market par initiative |

---

### Points éthiques & inclusivité

- **Biais de priorisation** : les initiatives qui bénéficient aux utilisateurs majoritaires (profils les plus représentés dans les données) seront toujours favorisées par les algorithmes de priorisation basés sur le volume. Les besoins des populations minoritaires ou vulnérables doivent être explicitement protégés dans le processus de roadmapping.
- **Accessibilité comme dette technique UX** : les initiatives d'accessibilité ne doivent pas être systématiquement repoussées en "Later" parce qu'elles n'ont pas de business case immédiat évident. Elles ont souvent un business case légal (conformité RGAA) et éthique (inclusion).
- **Transparence de la roadmap** : dans les produits grand public, informer les utilisateurs des évolutions prévues (changements majeurs d'interface, suppressions de fonctionnalités) est une pratique éthique qui réduit la résistance au changement.

---

## 2. OKRs & KPIs : de la stratégie à la mesure UX

### Modèle mental

Les OKRs (Objectives & Key Results) définissent où aller et comment savoir qu'on y est arrivé. Les KPIs mesurent en permanence si on avance dans la bonne direction. Un OKR sans KPI de suivi est une déclaration d'intention. Un KPI sans OKR est une donnée sans signification.

**Analogie stable**

L'OKR est la destination et le critère d'arrivée ("atteindre Paris, en moins de 4h"). Les KPIs sont le tableau de bord : vitesse actuelle, niveau de carburant, temps restant estimé. Sans destination (OKR), le tableau de bord donne des données mais pas de direction. Sans tableau de bord (KPIs), on ne sait pas si on avance.

---

### Architecture OKR appliquée à l'UX/Product

**Structure d'un OKR UX bien formé**

```
OBJECTIF (qualitatif, inspirant, mémorisable)
"Offrir une expérience d'onboarding qui transforme les nouveaux utilisateurs en utilisateurs actifs"

KEY RESULT 1 (quantitatif, mesurable, ambitieux)
"Augmenter le taux d'activation J+7 de 30% à 50% d'ici fin T3"

KEY RESULT 2
"Réduire le temps moyen jusqu'à la première action clé de 8 min à 4 min"

KEY RESULT 3
"Atteindre un SUS score > 75 sur le flux d'onboarding (vs 58 actuellement)"
```

**Les 3 critères d'un bon Key Result**
1. Mesurable avec des données existantes ou facilement collectables
2. Ambitieux mais atteignable (~70% de probabilité selon la culture OKR Google)
3. Directement lié à l'expérience utilisateur mesurée, pas à une activité de livraison

---

### Hiérarchie des métriques UX/Business

```
Niveau 1 — Métriques business (direction, investisseurs)
├── Revenue, MRR, churn, LTV, CAC, conversion globale

Niveau 2 — Métriques produit (PM, équipes produit)
├── Activation, rétention, engagement, feature adoption

Niveau 3 — Métriques UX (designers, researchers)
├── Task success rate, time on task, SUS, NPS, CSAT, error rate

Niveau 4 — Métriques comportementales (UX + Data)
└── Heatmaps, funnels, click paths, scroll depth, rage clicks
```

**Principe de connexion** : chaque métrique UX (niveau 3) doit pouvoir être reliée à une métrique business (niveau 1). "Le SUS est passé de 58 à 76 → task success +25% → taux de conversion checkout +8% → +120K€ de revenus mensuels."

---

### Tableau de correspondance KPIs UX / Business

| Problème UX | KPI UX | KPI Business impacté |
|-------------|--------|---------------------|
| Interface trop complexe | SUS score, time on task | Conversion, rétention |
| Onboarding peu clair | Taux d'activation J+7, drop-off rate | Churn J+30, LTV |
| Formulaire trop long | Taux de complétion, error rate | Conversion, leads |
| Navigation confuse | Task success rate, clics erreur | Engagement, pages vues |
| Microcopy inadapté | Comprehension rate, questions support | Coût support, NPS |
| Accessibilité insuffisante | Score Lighthouse, WCAG failures | Audience potentielle, risque légal |
| Temps de chargement lent | Performance score, Core Web Vitals | Taux de rebond, SEO |
| Dark pattern détecté | NPS, taux de désabonnement | Réputation, LTV long terme |

---

### Exemple concret OKR complet avec mesure IA

**Contexte** : Application de gestion financière personnelle, problème identifié : 60% des utilisateurs n'utilisent jamais la fonctionnalité "Budget mensuel" malgré son importance stratégique.

```
OBJECTIF : Faire de la fonctionnalité Budget mensuel un pilier central de l'expérience

KEY RESULT 1 : Augmenter le taux d'adoption feature Budget de 40% à 70% à Q4
  → Mesure : Analytics (sessions avec budget configuré / total sessions actives)
  → IA : Prédiction de l'impact d'une refonte onboarding feature sur le KR1

KEY RESULT 2 : Atteindre un taux de rétention J+30 de 65% (vs 48% actuellement)
  → Mesure : Cohortes d'utilisateurs ayant configuré un budget vs non
  → IA : Modèle prédictif churn pour identifier les utilisateurs à risque

KEY RESULT 3 : SUS score de la fonctionnalité Budget > 72 (vs 51 en test actuel)
  → Mesure : Test utilisateur qualitatif + SUS questionnaire post-test
  → IA : Analyse automatique des verbatims post-test pour clustering thématique

INITIATIVES ASSOCIÉES :
  → Refonte du flux de première configuration Budget (Design Sprint)
  → Ajout de nudges contextuels (éthiques, opt-in, non-manipulatoires)
  → Amélioration des messages d'état vide et microcopy
```

---

### Correction modèle mental

**❌ Idée reçue** : "Le NPS est le KPI UX ultime — si le NPS augmente, l'UX s'améliore."

**✅ Approche correcte** : Le NPS mesure la propension à recommander, influencée par de nombreux facteurs au-delà de l'UX (prix, support, marketing). C'est un indicateur lagging (retardé) qui reflète une expérience passée. Pour piloter l'UX en temps réel, lui préférer des métriques leading : task success rate, SUS, taux de complétion de flux critiques. Le NPS est un signal de confirmation, pas un signal de pilotage.

**KPI impacté** : précision du diagnostic UX, vitesse de détection des problèmes d'expérience

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| SUS score (>68 = seuil acceptable) | Taux de conversion funnel principal |
| Task success rate (cible >85%) | Taux de rétention M+1, M+3 |
| Time on task (tendance à la baisse) | Coût support (tickets liés à confusion UX) |
| Error rate (cible <5%) | NPS global produit |
| CSAT post-interaction (>4/5) | Churn rate |

---

### Points éthiques & inclusivité

- **Métriques trompeuses** : un taux de complétion élevé peut masquer une expérience sous pression — si les utilisateurs complètent un flux parce qu'ils n'ont pas d'autre choix (dark pattern de coercition), la métrique est haute mais l'éthique est violée.
- **Représentativité des KPIs** : les métriques agrégées (moyenne du SUS, NPS global) peuvent masquer de grandes disparités entre groupes d'utilisateurs. Segmenter les métriques par profil démographique, niveau d'expertise, et accessibilité pour détecter des inégalités d'expérience.
- **❌ KPIs manipulés** : certains produits optimisent des KPIs d'engagement (temps passé, clics) en utilisant des mécaniques addictives. Un KPI éthique mesure la valeur créée pour l'utilisateur, pas la captation de son attention.

---

## 3. Estimation d'effort & planning UX

### Modèle mental

Estimer le temps d'un projet UX n'est pas prévoir l'avenir — c'est communiquer une plage de probabilité basée sur des données historiques et des hypothèses explicites. La précision d'une estimation est inversement proportionnelle à l'incertitude du problème.

**Analogie stable**

Estimer un projet UX ressemble à estimer un déménagement : si vous avez déjà déménagé 10 fois, vous savez que ça prend 2 fois plus de temps que prévu. L'estimation juste n'est pas "il me faudra exactement 6h" mais "selon mes déménagements passés, entre 6h et 12h, avec 70% de probabilité dans cette plage."

---

### Les 4 phases de travail UX à estimer

**Méthode de décomposition systématique**

| Phase | Activités | Facteurs d'impact sur la durée |
|-------|-----------|-------------------------------|
| **Découverte & Recherche** | Entretiens, analyse données, benchmarks | Nombre de participants, accès aux utilisateurs |
| **Conception** | Wireframes, prototype, itérations | Complexité fonctionnelle, nombre d'états |
| **Tests & Validation** | Tests utilisateurs, analyse, recommandations | Nombre de participants, méthode (modérée vs non-modérée) |
| **Handoff & Documentation** | Annotations, specs, documentation | Maturité du design system |

---

### Matrice d'estimation par type de livrable

| Livrable UX | Estimation basse | Estimation haute | Variables clés |
|-------------|-----------------|-----------------|----------------|
| Interview utilisateur (1 personne) | 1h | 1,5h | Guide préparé, disponibilité |
| Analyse de 5 interviews | 3h | 8h | Complexité thématique |
| Wireframe 1 écran | 0,5h | 2h | Complexité UI, nombre d'états |
| Prototype cliquable (5 écrans) | 4h | 12h | Fidélité, interactions |
| Test utilisateur non-modéré (5 participants) | 2h setup | 6h analyse | Recrutement, outil |
| Test utilisateur modéré (5 participants) | 5h | 10h | Logistique, analyse |
| Fiche composant design system | 1h | 3h | Complexité, états |
| Audit UX heuristique (10 écrans) | 4h | 8h | Profondeur, livrables |
| Design sprint complet | 40h (5 jours) | 50h | Préparation, taille équipe |

---

### Techniques d'estimation UX

#### T-shirt sizing (pour la roadmap)

| Taille | Effort approximatif | Usage |
|--------|-------------------|-------|
| XS | < 1 jour | Quick win, microcopy, petite correction |
| S | 1-3 jours | Écran simple, optimisation composant |
| M | 1-2 semaines | Flux complet, refonte partielle |
| L | 3-6 semaines | Module complexe, nouveau parcours utilisateur |
| XL | > 6 semaines | Refonte majeure, nouveau produit |

#### Story points UX (pour Scrum)

Adapter le système de points Fibonacci (1, 2, 3, 5, 8, 13) à la complexité UX :
- **1 point** : modification évidente sans impact flow
- **3 points** : nouveau composant ou état connu
- **5 points** : nouveau flux simple avec quelques cas limites
- **8 points** : flux complexe, dépendances multiples
- **13 points** : trop complexe — décomposer avant d'estimer

---

### Les 3 ennemis de la précision des estimations UX

**1. Le problème mal défini**
Une estimation précise sur un problème vague est une fausse précision. Avant d'estimer, exiger une définition claire du livrable attendu et des critères de "done".

**2. L'oubli des itérations**
Le temps de design inclut les aller-retours avec les stakeholders, les révisions post-test, et les ajustements au handoff. Ces éléments représentent souvent 40-60% du temps total mais sont rarement inclus dans les estimations initiales.

**3. L'optimisme du cone d'incertitude**
```
Phase de découverte    → incertitude : ±100% (l'estimation peut doubler)
Phase de conception    → incertitude : ±50%
Phase de prototype     → incertitude : ±25%
Handoff prêt           → incertitude : ±10%
```

Plus on est tôt dans le projet, plus l'estimation doit exprimer une plage large.

---

### Correction modèle mental

**❌ Idée reçue** : "Les tests utilisateurs prennent trop de temps — on peut les raccourcir ou les supprimer si on est en retard."

**✅ Approche correcte** : Supprimer les tests utilisateurs est l'équivalent de supprimer les contrôles qualité en production. Les bugs UX non détectés en amont coûtent en moyenne 5 à 100 fois plus cher à corriger après lancement. Si le temps manque, réduire la scope du test (moins de scenarios, méthode non-modérée) mais ne pas le supprimer entièrement.

**KPI impacté** : coût de correction post-lancement, taux de bugs UX en production

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Écart estimation vs réalité (précision de planification) | Respect des délais de livraison (delivery rate) |
| Taux d'inclusion des tests dans les sprints planifiés | Coût des corrections post-lancement (ratio bugs UX) |
| Temps de cycle UX par type de livrable | Vélocité équipe (features/sprint) |

---

### Points éthiques & inclusivité

- **Charge invisible du recrutement diversifié** : recruter des profils inclusifs (personnes âgées, handicapées, non-expertes) prend plus de temps que de recruter des "utilisateurs typiques". Ce surcoût doit être planifié et budgété — ne pas l'omettre pour tenir les délais, car cela perpétue les angles morts de l'expérience.
- **Temps de documentation d'accessibilité** : l'estimation doit systématiquement inclure le temps de documentation et de test des critères d'accessibilité. Les traiter comme une activité hors estimation crée systématiquement une dette d'accessibilité.

---

## 4. Méthodes agiles & gestion des dépendances UX

### Modèle mental

Les méthodes agiles ont été conçues par et pour les développeurs. Les adapter à l'UX demande de comprendre que le design nécessite une double boucle : une boucle courte de livraison (synchronisée avec les sprints dev) et une boucle longue de recherche et de stratégie (qui préfigure les sprints futurs). Ces deux boucles doivent coexister sans se parasiter.

**Analogie stable**

L'UX dans un environnement agile, c'est comme un chef cuisinier dans un restaurant qui tourne à flux tendu : pendant que la cuisine envoie les plats commandés (sprint dev en cours), le chef prépare les mises en place pour le service suivant (research et conception pour le sprint+1) et teste de nouvelles recettes pour le menu de demain (exploration stratégique). Ces trois temps coexistent, avec des rythmes différents.

---

### Les deux boucles UX en environnement agile

```
BOUCLE COURTE (synchronisée avec les sprints dev — 2 semaines)
├── Finalisation des specs du sprint en cours
├── Support au handoff et réponses aux questions dev
├── Review des développements livrés
└── Corrections et ajustements mineurs

BOUCLE LONGUE (1 sprint d'avance minimum)
├── Conception et wireframes du sprint+1
├── Tests utilisateurs des concepts du sprint+1
├── Recherche exploratoire pour le sprint+2
└── Contribution à la roadmap et priorisation backlog
```

**Principe clé** : l'UX doit toujours avoir un sprint d'avance pour éviter de bloquer le développement. Si l'UX et les devs sont sur le même sprint, l'UX devient le goulot d'étranglement.

---

### Scrum adapté à l'UX

**Rôles UX dans Scrum**

| Rôle Scrum | Rôle UX | Responsabilité |
|------------|---------|---------------|
| Product Owner | Souvent le PM avec inputs UX | Priorisation backlog avec critères UX |
| Scrum Master | Facilitateur de sprint | Inclure le design dans la définition of Done |
| Development Team | UX designer inclus | Conception + handoff + review |

**Définition of Done enrichie avec l'UX**

```
Une user story est "Done" quand :
□ Fonctionnalité développée et testée techniquement
□ Design fidèle au prototype validé (audit visuel)
□ Critères d'accessibilité respectés (WCAG AA minimum)
□ Cas limites documentés et implémentés
□ Test utilisateur rapide validé (ou décision explicite de reporter)
□ Documentation design system mise à jour si composant impacté
```

---

### Kanban appliqué à l'UX

**Tableau Kanban UX typique**

| Backlog Research | En cours (Research) | Insights prêts | Design en cours | Review design | Dev ready | En prod |
|-----------------|--------------------|--------------|-----------------|-----------------|-----------|---------|
| Interviews J+15 | Entretiens semaine | Synthèse flux A | Wireframes écran B | Prototype flux C | Specs écran D | Feature E |

**WIP limits (Work In Progress)** : définir un maximum de 2-3 items par colonne pour éviter la dispersion et détecter les goulots d'étranglement visuellement.

---

### Identification des risques UX à chaque étape agile

| Étape agile | Risque UX fréquent | Signal d'alerte | Action préventive |
|-------------|-------------------|-----------------|------------------|
| Backlog grooming | User stories sans critère UX | "Ajouter un bouton" sans contexte | Exiger un problem statement sur chaque story |
| Sprint planning | Over-scoping du design | "On peut faire ça en 1 jour" | Estimation rigoureuse avec l'UX |
| Sprint execution | Dérive des specs sans validation | Dev interprète librement le design | Daily sync UX/dev 15 min |
| Sprint review | Feedback stakeholder tardif | "Ah mais j'aurais voulu..." | Inclure stakeholders dans les mid-sprint reviews |
| Sprint retrospective | UX invisible dans la rétro | Rétros exclusivement techniques | UX animateur de la rétro sur les critères expérience |

---

### Gestion des dépendances UX

**Types de dépendances fréquentes**

```
DÉPENDANCES ENTRANTES (ce dont l'UX a besoin)
├── Données analytics → pour valider les hypothèses de redesign
├── Accès utilisateurs → pour les tests qualitatifs
├── Design system stable → pour commencer la conception
├── Décision PM sur le scope → avant de commencer le design
└── Contraintes techniques → pour ne pas concevoir l'impossible

DÉPENDANCES SORTANTES (ce que l'UX produit pour les autres)
├── Specs finalisées → pour que le dev puisse estimer
├── Prototype validé → pour que le dev puisse commencer
├── Documentation composants → pour que le design system reste synchronisé
└── Insights utilisateurs → pour que le PM puisse prioriser le backlog
```

**Matrice de dépendances UX (pour Jira/Confluence)**

| Initiative | Dépend de | Bloque | Statut | Responsable |
|-----------|----------|--------|--------|-------------|
| Refonte checkout | Design system v2.0 | Feature paiement Apple Pay | En attente | Lead designer |
| Onboarding B2B | Specs PM (personas B2B) | Sprint 14 dev | Bloqué | PM Sarah |
| Accessibilité formulaires | Audit WCAG actuel | Mise en conformité légale | En cours | UX + dev |

---

### Correction modèle mental

**❌ Idée reçue** : "En agile, les grandes phases de recherche upfront ne sont pas compatibles — tout doit se faire en micro-sprints."

**✅ Approche correcte** : La recherche stratégique (discovery) doit opérer sur un cycle plus long que les sprints de livraison. L'approche Dual Track Agile formalise cette coexistence : une piste de discovery (UX research + conception) et une piste de delivery (développement + livraison) fonctionnent en parallèle sur des rythmes différents. La discovery alimente la delivery avec un lead time d'un ou deux sprints.

**KPI impacté** : vélocité de livraison UX (pas de blocage), taux de re-travail post-livraison

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de stories UX "Done" sans re-travail | Vélocité de l'équipe (features/sprint) |
| Délai moyen entre design finalisé et dev démarré | Pourcentage de sprints sans blocage UX |
| Taux de dépendances UX résolues dans les délais | Prédictibilité de livraison (variance de vélocité) |

---

### Points éthiques & inclusivité

- **Accessibilité dans la définition of Done** : en agile, ce qui n'est pas dans la definition of done n'est jamais fait. Inscrire les critères d'accessibilité dans la DoD est l'unique façon de garantir qu'ils ne sont pas systématiquement repoussés.
- **Vélocité vs qualité éthique** : la pression de vélocité en agile pousse souvent à implémenter des solutions "quick and dirty" qui s'avèrent être des dark patterns involontaires (ex : fenêtres modale auto-focus qui piègent les lecteurs d'écran). Inclure une review éthique rapide dans la sprint review.
- **Représentation des utilisateurs dans les rétros** : les sprints rétrospectives discutent de l'équipe, rarement des utilisateurs. Intégrer un point systématique : "Qu'avons-nous appris sur nos utilisateurs ce sprint ?"

---

## 5. Suivi de performance & feedback loops

### Modèle mental

Le suivi de performance UX n'est pas la surveillance des chiffres dans un dashboard. C'est un système de détection précoce qui transforme les signaux faibles (chutes de métriques, verbatims négatifs, comportements inattendus) en décisions d'amélioration avant qu'ils ne deviennent des crises.

**Analogie stable**

Le suivi de performance UX ressemble au système d'alerte d'un avion : les instruments ne pilotent pas l'avion à la place du pilote, mais ils permettent de détecter des problèmes avant qu'ils deviennent catastrophiques. L'altimètre (taux de rétention), le carburant (engagement), et la vitesse (conversion) sont surveillés en permanence — pas uniquement quand on sent que quelque chose ne va pas.

---

### Cadre de suivi HEART (Google)

Le framework HEART est le cadre de mesure UX le plus utilisé pour aligner métriques UX et objectifs produit.

| Dimension | Signification | Exemple de métrique | Type |
|-----------|--------------|--------------------|----|
| **H**appiness | Satisfaction subjective des utilisateurs | NPS, CSAT, SUS | Déclaratif |
| **E**ngagement | Niveau d'interaction avec le produit | Sessions/semaine, features utilisées | Comportemental |
| **A**doption | Adoption de nouvelles features | % utilisateurs ayant utilisé X dans les 30j | Comportemental |
| **R**etention | Fidélité et retour des utilisateurs | Churn rate, rétention M+1, M+3 | Comportemental |
| **T**ask success | Efficacité de réalisation des tâches clés | Task completion rate, error rate, time on task | Comportemental |

**Usage** : sélectionner 2-3 dimensions HEART selon l'objectif du sprint ou de la feature, pas toutes les 5 simultanément. Chaque dimension doit avoir un signal (comment on mesure), une métrique (ce qu'on mesure), et un objectif (ce qu'on vise).

---

### Boucle de feedback UX : architecture systémique

```
[Signal]          [Collecte]         [Analyse]          [Action]
    ↓                 ↓                  ↓                  ↓
Données           Automatique        Diagnostic          Décision
analytics     →   (dashboards)   →   (humain + IA)   →  (PM + UX)
    +                 +                  +                  +
Verbatims         Périodique         Priorisation        Backlog
qualitatifs   →   (tests, NPS)   →   (impact/effort) →  mis à jour
    +                 +                  +                  ↓
Signaux           Alertes            Synthèse         Implémentation
support       →   IA anomalie    →   actionnables  →       ↓
                                                       [Mesure]
                                                     Boucle suivante
```

---

### Cadences de feedback recommandées

| Cadence | Activité | Données collectées | Décision produite |
|---------|----------|-------------------|------------------|
| **Quotidienne** | Dashboard automatique | Analytics, alertes IA | Corrections urgentes |
| **Hebdomadaire** | Revue des métriques clés | KPIs HEART, tickets support | Ajustements sprint |
| **Bi-hebdomadaire** | Test utilisateur rapide (1-2 utilisateurs) | Verbatims, observations | Backlog refinement |
| **Mensuelle** | Revue OKR + bilan UX | Toutes métriques + qualitatif | Priorisation roadmap |
| **Trimestrielle** | Bilan stratégique UX | Tendances longues, NPS, SUS | Révision roadmap |

---

### Métriques par étape du funnel AAARRR adapté UX

| Étape funnel | Métrique UX | Métrique business | Seuil d'alerte |
|-------------|------------|-----------------|----------------|
| **Awareness** (découverte) | Clarté du message (first impression test) | Taux de rebond landing page | Rebond > 70% |
| **Acquisition** (inscription) | Taux de complétion inscription | Coût par acquisition (CAC) | Abandon > 40% |
| **Activation** (première valeur) | Taux d'activation J+3 (first key action) | Taux d'activation J+7 | Activation < 30% |
| **Rétention** (retour) | Rétention cohort M+1 | Churn mensuel | Churn > 5% mensuel |
| **Revenu** (monétisation) | Conversion vers plan payant | MRR, ARPU | Conversion < benchmark secteur |
| **Référence** (recommandation) | NPS | Taux de referral | NPS < 20 |

---

### Ajustements continus : processus de décision data-driven

**Quand agir sur un signal ?**

```
Signal détecté (KPI chute ou anomalie)
    ↓
Est-ce statistiquement significatif ? (taille d'échantillon, durée)
    ├── NON → continuer à observer (biais de confirmation possible)
    └── OUI ↓
         Est-ce isolé ou systémique ?
         ├── ISOLÉ (1 segment, 1 device) → corrective ciblée
         └── SYSTÉMIQUE ↓
              Cause connue ou inconnue ?
              ├── CONNUE → correctif planifié en backlog
              └── INCONNUE → lancement d'une investigation UX
                           (analytics + test qualitatif)
```

---

### Correction modèle mental

**❌ Idée reçue** : "Si les métriques sont bonnes en moyenne, l'expérience est bonne pour tous les utilisateurs."

**✅ Approche correcte** : Les moyennes masquent des disparités critiques. Un SUS score moyen de 70 peut cacher un score de 45 pour les utilisateurs seniors et de 85 pour les utilisateurs experts. Segmenter systématiquement les métriques UX par profil, device, langue, et niveau d'expertise pour détecter les expériences dégradées invisibles dans les agrégats.

**KPI impacté** : taux de churn par segment, NPS par profil utilisateur, coût support différentiel

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Task success rate (cible > 85%) | Taux de conversion funnel principal |
| SUS score (cible > 68) | Churn mensuel (cible < 3-5% selon secteur) |
| Error rate (cible < 5%) | LTV (Lifetime Value) |
| Time on task (tendance décroissante) | Coût support (tickets/utilisateur actif) |
| CSAT post-interaction (cible > 4/5) | NPS (cible > 30 pour B2C grand public) |

---

### Points éthiques & inclusivité

- **Métriques d'engagement vs bien-être utilisateur** : optimiser le "temps passé dans l'application" comme KPI d'engagement peut conduire à concevoir des interfaces addictives qui nuisent au bien-être des utilisateurs. Préférer des métriques de valeur créée (tâche accomplie, problème résolu) plutôt que de durée d'exposition.
- **Feedback loop inclusif** : les sources de feedback passives (analytics) surreprésentent les utilisateurs les plus actifs. Les utilisateurs qui abandonnent (churned users) ou qui n'utilisent jamais certaines features sont absents des données. Compléter avec des études proactives (interviews des churned users, recrutement de non-utilisateurs).
- **❌ Dark pattern de mesure** : certains produits augmentent artificiellement les métriques d'engagement par des dark patterns (notifications anxiogènes, gamification manipulatrice). Ces pratiques gonflent les KPIs à court terme et détruisent la confiance et la rétention à long terme.

---

## 6. IA appliquée : dashboards, alertes et prédictions

### Modèle mental

L'IA dans la gestion de projet UX/Product n'est pas un oracle qui prédit l'avenir — c'est un système d'amplification de la perception humaine. Elle voit les patterns dans les données que l'équipe ne peut pas surveiller manuellement à l'échelle, et alerte les humains au bon moment pour qu'ils prennent les bonnes décisions.

**Analogie stable**

L'IA de gestion de projet ressemble à un système de monitoring d'infrastructure serveur : il surveille en permanence des centaines de métriques, détecte les anomalies avant qu'elles deviennent des pannes, et envoie des alertes aux ingénieurs au bon moment. L'ingénieur décide de l'action, mais sans le monitoring, il réagirait aux pannes et non aux signaux faibles.

---

### Dashboards automatisés : architecture recommandée

#### Dashboard UX en temps réel (quotidien)

| Couche | Métriques affichées | Source | Alerte IA si |
|--------|-------------------|--------|-------------|
| **Comportemental** | Task completion, error rate, funnel drop-off | Mixpanel, Amplitude | Chute > 10% vs J-7 |
| **Satisfaction** | NPS passif (in-app), CSAT | Hotjar, Medallia | Score < seuil défini |
| **Performance** | Core Web Vitals, Lighthouse score | Google Search Console | LCP > 2.5s |
| **Accessibilité** | Score axe, WCAG failures | CI/CD pipeline | Nouvelles violations |
| **Engagement** | Feature adoption, sessions/user | Mixpanel, Amplitude | Chute adoption > 15% |

#### Dashboard OKR mensuel (stratégique)

```
[OKR 1 : Améliorer l'onboarding]
  KR1 : Activation J+7         → 42% / objectif 50%  ⚠ en retard
  KR2 : Time to first action   → 5min30 / objectif 4min  ⚠ en retard
  KR3 : SUS onboarding         → 68 / objectif 75  🔴 sous le seuil

[OKR 2 : Réduire le churn]
  KR1 : Rétention M+1          → 67% / objectif 65%  ✅ en avance
  KR2 : NPS score              → 34 / objectif 30  ✅ objectif atteint
```

---

### Suivi OKR/KPI augmenté par IA

**Ce que l'IA apporte au suivi des OKRs**

| Fonctionnalité | Mécanisme | Exemple |
|---------------|-----------|---------|
| **Prédiction d'atteinte** | Projection basée sur la tendance actuelle | "Au rythme actuel, KR1 atteindra 44% à la fin du trimestre (objectif : 50%)" |
| **Attribution des causes** | Corrélation entre changements et variations de KPI | "La chute du taux d'activation corrèle avec le déploiement du 15/03" |
| **Recommandation d'actions** | Analyse des initiatives passées et de leur impact | "Les 3 initiatives similaires passées ont eu un impact moyen de +6% sur ce KPI" |
| **Détection d'anomalies** | Écarts statistiques par rapport aux tendances | "Comportement inhabituel sur le flux paiement ce matin à 09h15" |
| **Alertes de risque** | Signaux faibles avant que le KPI dépasse le seuil | "La courbe d'engagement hebdomadaire suggère un risque de chute sous le seuil dans 2 semaines" |

---

### Prédiction de priorités critiques par IA

**Modèle de priorisation augmenté IA**

```
DONNÉES D'ENTRÉE (pour le modèle IA)
├── Données analytics comportementales (Amplitude, Mixpanel)
├── Historique des incidents et bugs UX
├── Verbatims et tickets support
├── Scores NPS/CSAT par feature
├── Données A/B tests passés
└── Roadmap actuelle et dépendances

SORTIE DU MODÈLE
├── Score de risque par initiative (risque d'impact négatif si non prioritaire)
├── Score d'impact estimé (basé sur patterns historiques similaires)
├── Score d'urgence (signaux de dégradation en cours)
└── Recommandation de priorisation avec confidence level
```

**Important** : l'IA produit des scores basés sur les données passées. Les problèmes nouveaux, sans précédent dans l'historique, auront des scores de confiance faibles. Le jugement humain reste essentiel pour les initiatives innovantes sans données comparables.

---

### Alertes IA sur anomalies : bonnes pratiques

#### Taxonomie des alertes

| Type d'alerte | Déclencheur | Urgence | Destinataire |
|---------------|-------------|---------|-------------|
| **Anomalie critique** | Chute KPI > 20% en < 1h | Immédiate | PM + UX + Lead dev |
| **Dérive progressive** | Tendance négative sur 7 jours | < 24h | PM + UX |
| **Milestone KPI** | Seuil OKR franchi (positif ou négatif) | < 48h | Équipe produit |
| **Anomalie usage** | Comportement inhabituel sur un flux | < 24h | UX researcher |
| **Risque dépendance** | Ticket bloquant non résolu depuis 5 jours | < 48h | PM |

#### Règles pour éviter l'alert fatigue

**❌ Sur-alerter détruit l'efficacité des alertes** : si chaque anomalie mineure déclenche une notification, l'équipe commence à ignorer les alertes — y compris les critiques. Calibrer les seuils pour que chaque alerte reçue demande une action réelle.

**Bonnes pratiques anti-alert fatigue**

1. Minimum 2 signaux convergents avant alerte (pas d'alerte sur une seule métrique)
2. Seuils différenciés par heure (pic de trafic vs creux) et par segment
3. Consolidation : une alerte agrégée par sujet, pas 10 notifications séparées
4. Mémoire : ne pas ré-alerter sur la même anomalie dans les 4h sauf aggravation

---

### Outils IA de gestion de projet UX/Product : récapitulatif

| Outil | Type IA | Usage UX/Product | Maturité |
|-------|---------|-----------------|---------|
| **Amplitude + AI** | Analyse prédictive, anomaly detection | Comportements utilisateurs, funnel prediction | Mature |
| **Mixpanel + AI** | Insights automatiques, alertes | Engagement et rétention | Mature |
| **Linear AI** | Résumé tickets, priorisation | Gestion backlog | En développement |
| **Jira AI** | Suggestions, estimation, résumés | Planification sprints | Bêta avancée |
| **Notion AI** | Résumé, structuration, recherche | Documentation OKRs | Disponible |
| **Productboard AI** | Priorisation basée sur insights clients | Roadmap intelligence | Disponible |
| **Pendo AI** | Analyse comportementale, guides in-app | Adoption features | Mature |
| **FullStory AI** | Session replay intelligent, anomalie | Détection friction UX | Mature |
| **Hotjar AI** | Analyse heatmaps, résumé verbatims | Tests utilisateurs | Disponible |

---

### Correction modèle mental

**❌ Idée reçue** : "Avec un dashboard IA complet, l'équipe UX peut piloter le produit uniquement par les données."

**✅ Approche correcte** : Les dashboards IA mesurent ce qui s'est passé et projettent des tendances, mais ne peuvent pas expliquer le pourquoi. Un taux d'abandon de 45% à l'étape 3 est visible dans le dashboard — mais seul un test utilisateur qualitatif révèle que les utilisateurs ne comprennent pas le libellé du champ. Les données quantitatives et qualitatives sont complémentaires et irremplaçables l'une par l'autre.

**KPI impacté** : qualité et précision des diagnostics UX, pertinence des solutions proposées

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Délai entre détection anomalie et correction (MTTR UX) | Réduction des pertes de revenus liées aux bugs UX |
| Taux d'alertes IA actionnées (vs ignorées) | Prédictibilité des métriques (variance KPI) |
| Précision des prédictions IA (objectifs vs résultats) | ROI des outils IA (coût licence vs valeur détectée) |
| Couverture monitoring (% des flux critiques surveillés) | Temps de réaction aux incidents UX |

---

### Points éthiques & inclusivité

**Biais des données historiques dans les prédictions IA**

Si les données historiques reflètent des expériences conçues pour un profil d'utilisateur majoritaire, les prédictions IA perpétuent et amplifient ces biais. Exemple : si l'historique A/B tests est basé sur des utilisateurs desktop anglophones de 25-35 ans, les recommandations IA pour optimiser l'onboarding reproduiront les biais de cet échantillon pour les utilisateurs mobiles, âgés, ou non-anglophones.

**Transparence des algorithmes de priorisation**

Lorsque l'IA recommande de dé-prioriser une initiative d'accessibilité parce qu'elle "impacte moins de 5% des utilisateurs selon les données", il faut pouvoir contester cette recommandation avec des arguments éthiques et légaux que l'algorithme ne peut pas peser. Documenter explicitement les décisions où le jugement humain a overridé la recommandation IA, et pourquoi.

**❌ Dark pattern de surveillance IA**

Utiliser les données de tracking comportemental pour identifier et cibler les utilisateurs en état de vulnérabilité (anxiété, fatigue, contexte émotionnel difficile) pour maximiser des KPIs de conversion ou d'engagement est une violation éthique grave. Les modèles IA qui optimisent l'engagement sans contrainte éthique explicite peuvent dériver vers ce type de comportement.

**Droit à l'explication**

Dans les produits qui utilisent l'IA pour personnaliser l'expérience (recommandations, priorisation de contenu, ciblage de notifications), les utilisateurs doivent avoir accès à une explication compréhensible du fonctionnement du système et un moyen de désactiver la personnalisation.

---

## Synthèse des KPIs de la Section 8

| Domaine | KPI UX prioritaire | KPI Business prioritaire |
|---------|-------------------|--------------------------|
| Roadmap | Taux initiatives validées par tests | Taux de réalisation OKRs |
| OKR/KPI | SUS + task success rate | Conversion + rétention |
| Estimation | Précision estimation (écart réel/prévu) | Délais de livraison respectés |
| Agile | Stories Done sans re-travail | Vélocité (features/sprint) |
| Feedback loops | MTTR anomalies UX | Churn mensuel |
| IA dashboards | Taux alertes actionnées | ROI outils IA |

---

## Récapitulatif : connexion OKR → KPI → Décision UX

```
NIVEAU STRATÉGIQUE (trimestre)
OKR : "Réduire les frictions dans le parcours d'achat"
    ↓
NIVEAU TACTIQUE (sprint)
KR : "Taux de complétion checkout > 80% à fin T3"
    ↓
NIVEAU OPÉRATIONNEL (quotidien)
KPI suivi : task completion rate, error rate, time on task step 3
    ↓
SIGNAL IA
Alerte : "Chute du taux de complétion step 3 de 72% à 58% depuis 3 jours"
    ↓
INVESTIGATION UX
Test utilisateur rapide : "Le nouveau champ 'code promo' est perçu comme obligatoire"
    ↓
DÉCISION
Correctif : rendre optionnel visuellement explicite + test A/B
    ↓
MESURE
Taux de complétion step 3 remonte à 76% en 72h → progression vers KR
```

Ce flux — de l'OKR stratégique au signal IA opérationnel, en passant par l'investigation qualitative — illustre la boucle complète d'une gestion de projet UX data-driven et centrée utilisateur.

---

*Fin de la Section 8 — Gestion de projet & Priorisation*
*Fichier théorie — pas d'exercices inclus*
