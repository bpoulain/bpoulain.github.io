# Section 2 — Recherche utilisateur & Data Insights

> Fichier théorie uniquement. Pas d'exercices ici.
> Dernière mise à jour : 2026-04-24

---

## Table des matières

1. [Recherche qualitative](#1-recherche-qualitative)
2. [Recherche quantitative](#2-recherche-quantitative)
3. [Tests exploratoires](#3-tests-exploratoires)
4. [Plan de recrutement pour tests utilisateurs](#4-plan-de-recrutement-pour-tests-utilisateurs)
5. [Synthèse & Storytelling des insights](#5-synthèse--storytelling-des-insights)
6. [Accessibilité & Inclusion](#6-accessibilité--inclusion)
7. [Biais dans la recherche](#7-biais-dans-la-recherche)

---

## 1. Recherche qualitative

### Modèle mental

La recherche qualitative répond à la question **« Pourquoi ? »** — elle explore les motivations, les modèles mentaux, les émotions et les contextes qui expliquent un comportement. Elle ne dit pas combien d'utilisateurs font quelque chose ; elle dit pourquoi et comment. C'est le microscope de la recherche utilisateur.

### Analogie stable

La recherche qualitative ressemble au travail d'un journaliste d'investigation. Il ne fait pas un sondage auprès de 10 000 personnes — il passe du temps avec quelques témoins clés, observe leur quotidien, pose des questions ouvertes, et construit une compréhension profonde d'une réalité complexe. La vérité qualitative émerge de la profondeur, pas de la masse.

### Méthodologie & Bonnes pratiques

#### L'entretien utilisateur

L'entretien est la méthode qualitative la plus utilisée et la plus souvent mal pratiquée.

**Principes fondamentaux :**

1. **Écouter plus que parler** — La règle des 80/20 : l'utilisateur parle 80% du temps.
2. **Questions ouvertes uniquement** — « Décrivez-moi comment vous... » plutôt que « Est-ce que vous... »
3. **Suivre les digressions** — Les apartés et les associations d'idées sont souvent les insights les plus riches.
4. **Éviter les questions hypothétiques** — « Qu'est-ce que vous feriez si... » prédit rarement le comportement réel. Préférer « Racontez-moi la dernière fois que... »
5. **Séparer discovery et validation** — Un entretien exploratoire n'est pas un test de concept.

**Structure d'un entretien de 60 minutes :**

| Phase | Durée | Objectif | Exemples de questions |
|---|---|---|---|
| Mise en confiance | 5 min | Créer un contexte sécurisant | Contexte personnel, relation au sujet |
| Exploration du contexte | 15 min | Comprendre l'environnement d'usage | « Décrivez votre journée type... » |
| Deep dive comportemental | 25 min | Explorer le comportement en détail | « Racontez-moi la dernière fois que vous avez... » |
| Exploration des alternatives | 10 min | Comprendre les solutions concurrentes | « Avant ce produit, comment faisiez-vous ? » |
| Clôture | 5 min | Collecter ce qui n'a pas été dit | « Y a-t-il quelque chose d'important que je n'ai pas demandé ? » |

#### Le shadowing (observation contextuelle)

Observer l'utilisateur dans son **contexte naturel d'usage**, sans intervention. Ce que les gens disent qu'ils font et ce qu'ils font réellement divergent systématiquement.

**Quand utiliser le shadowing :**
- Quand le contexte d'usage est critique (environnement bruyant, mobile en déplacement, usage professionnel sous stress)
- Quand les entretiens révèlent des incohérences
- Quand on veut découvrir les workarounds non déclarés

**Risques :** L'effet Hawthorne — les gens modifient leur comportement quand ils sont observés. Minimiser en expliquant qu'on observe le contexte, pas la performance.

#### L'ethnographie

L'immersion longue durée dans l'environnement de l'utilisateur. Plus rare en UX commercial, mais très puissante pour des produits dans des contextes de vie complexes (santé, éducation, travail en terrain difficile).

**Différence clé avec le shadowing** : L'ethnographie vise à comprendre la culture et les normes sociales qui structurent les comportements. Le shadowing vise à observer un comportement spécifique.

#### Les journaux utilisateurs (diary studies)

L'utilisateur documente lui-même ses expériences dans le temps, via des entrées régulières (photos, notes vocales, questionnaires courts).

**Forces :**
- Capture le comportement dans le temps (vs. snapshot d'un entretien)
- Révèle l'évolution d'une habitude
- Idéal pour les comportements épisodiques ou sensibles (difficiles à recréer en labo)

**Faiblesses :**
- Biais de sélection (les participants qui complètent un journal de 2 semaines sont plus engagés que la moyenne)
- Fatigue participante (qualité des entrées décroît dans le temps)
- Délai d'analyse plus long

| Méthode qualitative | Profondeur | Contexte naturel | Durée | Effort analyse | Nombre idéal |
|---|---|---|---|---|---|
| Entretien | Très haute | Non | 1h | Moyen | 5-8 par segment |
| Shadowing | Haute | Oui | 2-4h | Élevé | 3-5 |
| Ethnographie | Maximale | Oui | Jours/semaines | Très élevé | 2-4 |
| Journal utilisateur | Haute | Oui | 1-4 semaines | Élevé | 10-20 |

### Correction modèle mental

❌ **Idée reçue** : « 5 entretiens ne sont pas statistiquement significatifs — les résultats ne sont pas fiables. »

✅ **Approche correcte** : La recherche qualitative ne cherche pas la significativité statistique — elle cherche la saturation thématique. Jakob Nielsen a démontré que 5 participants révèlent ~85% des problèmes d'usabilité majeurs. La 6ème interview ajoute en moyenne 31% de nouveaux insights, la 12ème moins de 5%. L'objectif n'est pas le volume mais la richesse et la diversité des profils.

**KPI impacté** : Task success rate (les insights qualitatifs permettent d'identifier les modèles mentaux erronés qui causent les échecs de tâche), NPS (comprendre le « pourquoi » des détracteurs permet des corrections ciblées).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux de découverte de nouveaux problèmes par entretien | Réduction du coût de rework post-lancement |
| Couverture des modèles mentaux utilisateurs | Time-to-market (insights précoces évitent les pivots tardifs) |
| Saturation thématique (% de thèmes récurrents dans les interviews) | NPS (amélioration ciblée sur les raisons de déception) |

### Points éthiques & inclusivité

- Le consentement éclairé est obligatoire et doit être obtenu avant tout entretien — en termes simples, sans jargon juridique.
- Anonymiser systématiquement les verbatims et données personnelles avant tout traitement ou partage.
- Inclure des participants représentatifs en termes de genre, d'âge, de handicap, de niveau de littératie numérique, et d'origine culturelle — pas uniquement les profils faciles à recruter.
- Créer un environnement psychologiquement sécurisant : informer que « l'interface est testée, pas vous », autoriser l'arrêt à tout moment, proposer une compensation équitable.
- Éviter le « poverty tourism » en recherche ethnographique : ne pas traiter des populations vulnérables comme des objets d'étude sans restitution et bénéfice pour elles.

---

## 2. Recherche quantitative

### Modèle mental

La recherche quantitative répond à la question **« Combien ? »** — elle mesure ce qui se passe réellement à l'échelle, avec une rigueur statistique qui permet de généraliser. Elle dit que 73% des utilisateurs abandonnent à l'étape 3 du checkout, mais elle ne dit pas pourquoi. C'est le télescope de la recherche : vision large et chiffrée, mais distante.

### Analogie stable

La recherche quantitative ressemble aux statistiques vitales d'une ville. Vous savez que le taux de chômage est de 8,4%, que l'espérance de vie est de 82 ans, que 23% des résidents utilisent les transports en commun. Ces chiffres sont vrais, utiles, comparables. Mais ils ne vous disent pas ce que ça fait de vivre dans cette ville, ni pourquoi certains quartiers attirent des familles et d'autres pas. Les deux types de connaissance sont nécessaires.

### Méthodologie & Bonnes pratiques

#### Analytics comportementales

Les analytics mesurent le comportement réel des utilisateurs à grande échelle, sans biais de déclaration.

**Métriques comportementales fondamentales :**

| Métrique | Ce qu'elle mesure | Utilisation UX |
|---|---|---|
| Pageviews / Sessions | Volume de trafic | Identifier les pages critiques |
| Bounce rate | % sessions avec une seule page vue | Détecter les problèmes de pertinence ou de performance |
| Scroll depth | Jusqu'où les utilisateurs scrollent | Évaluer la structure du contenu |
| Click rate par élément | % clics sur un élément spécifique | Évaluer la visibilité des CTA |
| Rage clicks | Clics répétés sur un élément non interactif | Détecter les confusions d'affordance |
| Dead clicks | Clics sur des éléments non cliquables | Problèmes de modèle mental |
| Session duration | Temps passé | Engagement ou confusion (à contextualiser) |
| Return rate | % utilisateurs qui reviennent | Valeur perçue, habitude |

#### Funnels de conversion

Un funnel modélise le parcours séquentiel d'un utilisateur vers un objectif défini.

**Anatomie d'un funnel :**
```
Étape 1 : Visite page d'accueil        100 000 users  (100%)
    ↓ drop-off : 52%
Étape 2 : Visite page produit           48 000 users   (48%)
    ↓ drop-off : 63%
Étape 3 : Ajout au panier               17 760 users   (17,8%)
    ↓ drop-off : 71%
Étape 4 : Checkout initié               5 150 users    (5,2%)
    ↓ drop-off : 45%
Étape 5 : Achat complété                2 833 users    (2,8%)
```

**Où concentrer l'effort UX** : L'étape avec le plus grand drop-off absolu (pas relatif). Ici, étape 2→3 (−30 240 users) plutôt que étape 4→5 (−2 317 users).

#### Cohort Analysis

La cohort analysis segmente les utilisateurs par date de premier contact et suit leur comportement dans le temps. Elle révèle l'impact réel des changements produit sur différentes « générations » d'utilisateurs.

**Usage UX principal :** Mesurer l'impact d'une refonte sur la rétention. Si la cohorte d'utilisateurs acquis après la refonte a une rétention à 30 jours de 42% vs. 28% avant, la refonte a eu un impact mesurable.

```
EXEMPLE DE COHORT ANALYSIS (Rétention)

Cohorte      Semaine 1  Semaine 2  Semaine 4  Semaine 8  Semaine 12
──────────────────────────────────────────────────────────────────
Jan 2026      100%       68%        45%        32%        28%
Fév 2026      100%       71%        49%        35%        31%
Mars 2026*    100%       76%        54%        41%        38%
                                          * après refonte onboarding
```

#### Heatmaps

Les heatmaps visualisent l'activité des utilisateurs sur une page : clics, mouvements de souris, profondeur de scroll.

| Type de heatmap | Ce qu'elle révèle | Limite |
|---|---|---|
| Click map | Zones les plus cliquées | Ne distingue pas les clics intentionnels des clics de confusion |
| Scroll map | Profondeur de lecture | Ne révèle pas l'attention réelle (scroll ≠ lecture) |
| Move map | Zones de focus visuel (proxy) | Corrélation imparfaite avec le regard réel |
| Rage click map | Zones de frustration | Très actionnable pour détecter les bugs perçus |

#### Analyse prédictive assistée par IA

L'IA appliquée aux données quantitatives permet d'aller au-delà de la description du passé vers la **prédiction du futur** :

- **Prédiction de churn** : Les modèles de machine learning identifient les patterns comportementaux qui précèdent le churn (ex : baisse d'activité sur 14 jours + absence de feature X) et permettent des interventions préventives.
- **Prédiction d'abandon de funnel** : Identifier en temps réel les sessions à risque d'abandon pour déclencher une aide contextuelle.
- **Segmentation automatique** : L'IA détecte des segments comportementaux non évidents (ex : users qui utilisent le produit uniquement en mobilité nocturne) sans hypothèse préalable.
- **Next Best Action** : Prédire l'action suivante la plus probable d'un utilisateur pour personnaliser l'interface en conséquence.

**Limite critique de l'analyse prédictive** : Les modèles prédictifs optimisent pour ce qu'ils ont appris à prédire. Si les données d'entraînement contiennent des biais, les prédictions les amplifient. Auditer régulièrement les modèles pour équité et biais.

### Correction modèle mental

❌ **Idée reçue** : « Si les analytics montrent qu'un flux performe bien, il n'y a pas besoin de recherche utilisateur. »

✅ **Approche correcte** : Les analytics mesurent ce qui se passe pour les utilisateurs qui restent — ils sont muets sur ceux qui partent avant d'atteindre l'étape mesurée. Un taux de conversion de 3,5% peut sembler acceptable jusqu'à ce qu'une recherche qualitative révèle que 30% des visiteurs partent confus dès la homepage et ne sont jamais comptés dans le funnel.

**KPI impacté** : Taux de conversion global (corriger les problèmes pré-funnel invisibles dans les analytics standards), CAC (réduire le gaspillage d'acquisition sur des utilisateurs qui partent sans être mesurés).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Drop-off rate par étape de funnel | Taux de conversion global |
| Rétention par cohorte (post-release) | LTV par cohorte |
| Rage click rate (frustration mesurée) | Taux de churn précoce (J7, J30) |
| Scroll depth sur les pages clés | Taux d'activation |

### Points éthiques & inclusivité

- Respecter le RGPD dans la collecte analytics : consentement explicite, minimisation des données, droit d'opposition.
- Les analytics standards surreprésentent les utilisateurs qui ont accès à des appareils récents et des connexions rapides. Mesurer séparément les performances sur connexions lentes et appareils d'entrée de gamme.
- Les heatmaps ne capturent pas l'activité des lecteurs d'écran — elles ne doivent pas être l'unique source de décision sur l'accessibilité.
- Les modèles de prédiction de churn ❌ ne doivent pas conduire à des traitements différenciés injustes (ex : ne pas proposer de support proactif aux utilisateurs à faible LTV prédit).

---

## 3. Tests exploratoires

### Modèle mental

Les tests exploratoires sont des **méthodes de sondage de l'inconnu** — ils servent à comprendre comment les utilisateurs organisent mentalement l'information, quelle est leur première réaction à une interface, et quels chemins ils empruntent naturellement. Ils répondent à « Comment les utilisateurs perçoivent-ils la structure de notre produit ? » avant de concevoir cette structure.

### Analogie stable

Les tests exploratoires sont comme l'étude des courants marins avant de dessiner les routes maritimes. Les marins ne tracent pas une route et n'espèrent pas que les courants s'adaptent — ils observent d'abord où l'eau coule naturellement, puis tracent des routes qui exploitent ces courants. Les tests exploratoires révèlent les « courants mentaux » des utilisateurs.

### Méthodologie & Bonnes pratiques

#### Card Sorting

Le card sorting demande aux utilisateurs de **regrouper des contenus ou fonctionnalités** selon leur propre logique. Il révèle les modèles mentaux de classification des utilisateurs.

**Deux variantes :**

| Variante | Description | Quand l'utiliser |
|---|---|---|
| Card sorting ouvert | L'utilisateur crée ses propres catégories | Discovery d'une architecture de l'information |
| Card sorting fermé | Les catégories sont prédéfinies, l'utilisateur classe les items | Validation d'une architecture existante |

**Analyse :** La matrice de similarité (% de fois où deux items sont mis dans la même catégorie) révèle les associations mentales naturelles. Les items toujours ensemble devraient l'être dans l'interface. Les items rarement ensemble révèlent des ambiguïtés de nomenclature ou de catégorie.

**Volume recommandé :** 15-20 participants suffisent pour identifier les patterns majeurs.

#### Tree Testing

Le tree testing évalue la **navigabilité d'une architecture d'information existante** en demandant aux utilisateurs de trouver des items dans une structure hiérarchique textuelle (sans interface visuelle).

**Avantage majeur :** Isole les problèmes d'architecture de l'information des problèmes visuels. Si les utilisateurs échouent dans un tree test, le problème est la structure, pas la couleur du bouton.

**Métriques clés :**

| Métrique | Description | Seuil acceptable |
|---|---|---|
| Task success rate | % qui trouvent l'item correctement | > 80% pour les tâches critiques |
| Directness | % qui trouvent sans revenir en arrière | > 60% |
| Time-on-task | Durée moyenne pour trouver | < 45 secondes pour une tâche standard |
| First click accuracy | % qui font le bon premier clic | Très prédictif du succès final |

#### First-Click Testing

Le first-click testing mesure le **premier clic instinctif** d'un utilisateur pour accomplir une tâche sur une interface. La recherche montre que la probabilité de succès total d'une tâche est 87% si le premier clic est correct, contre 46% si le premier clic est incorrect.

**Usage :** Valider rapidement des layouts, comparer deux versions d'un CTA, tester la visibilité d'éléments critiques.

#### Surveys avancées

Au-delà des enquêtes de satisfaction basiques, les surveys avancées utilisent des techniques qui contournent les biais de déclaration :

- **MaxDiff (Maximum Difference Scaling)** : Forcer les utilisateurs à choisir l'attribut le plus et le moins important dans des ensembles de 4-5 options. Révèle les vraies priorités vs. le classement classique où tout est « très important ».
- **Conjoint analysis** : Présenter des combinaisons de features avec des trade-offs. Révèle les préférences réelles face à des arbitrages.
- **Kano survey** : Identifier si une feature est de base (attendue), de performance (plus = mieux) ou d'enchantement (surprise positive).

#### Tests automatisés assistés par IA

L'IA permet d'automatiser certaines dimensions des tests exploratoires :

- **Analyse automatique des résultats de card sorting** : Génération automatique de la matrice de similarité et proposition de dendrogrammes de clustering.
- **Benchmark automatique d'architecture** : Comparaison automatique de la structure d'information d'un produit avec les standards du secteur.
- **Tests de navigation synthétiques** : Simulation du comportement de navigation d'utilisateurs virtuels pour détecter les impasses architecturales avant les tests réels.
- **Analyse des patterns de premier clic** : Détection automatique des zones d'attention dans les heatmaps de premier clic, corrélée à des modèles de prédiction de saillance visuelle.

**Limite** : Les utilisateurs synthétiques ne remplacent pas les vrais utilisateurs pour les décisions d'architecture critiques. Ils servent à pré-filtrer les hypothèses les plus risquées.

### Correction modèle mental

❌ **Idée reçue** : « Les tests exploratoires, c'est bien pour la recherche académique. En contexte commercial, on n'a pas le temps. »

✅ **Approche correcte** : Un tree test de 20 participants en ligne prend 3 jours et coûte moins de 500€ avec des outils comme Maze ou Optimal Workshop. Il peut éviter 3 mois de développement d'une architecture qui ne correspond pas aux modèles mentaux des utilisateurs. Le ROI d'un test exploratoire bien ciblé est l'un des plus élevés du toolkit UX.

**KPI impacté** : Task success rate (une architecture validée par tree testing produit des taux de succès 25-40% supérieurs selon les études Optimal Workshop), taux d'abandon (une navigation intuitive réduit l'abandon par frustration de navigation).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| First click accuracy | Taux de conversion (le bon premier clic mène à la conversion) |
| Tree test success rate | Coût de développement évité (détection précoce) |
| Card sorting agreement rate | Taux de complétion des tâches de navigation |

### Points éthiques & inclusivité

- Inclure des participants avec des modèles mentaux culturellement différents dans le card sorting — les taxonomies qui paraissent évidentes pour un public occidental peuvent être contre-intuitives pour d'autres.
- Les outils de tests en ligne automatisés excluent les utilisateurs sans accès numérique stable. Compléter avec des tests en présentiel pour les populations cibles à faible littératie numérique.
- Éviter les formulations de tâches dans les tests qui supposent des compétences implicites (vocabulaire technique, compréhension de métaphores culturelles spécifiques).

---

## 4. Plan de recrutement pour tests utilisateurs

### Modèle mental

Le recrutement est la **fondation de la validité** de toute recherche. Les meilleurs protocoles de test donnent des résultats biaisés si les participants ne représentent pas le spectre réel des utilisateurs. Le recrutement n'est pas une formalité logistique — c'est une décision de recherche critique.

### Analogie stable

Le recrutement pour les tests utilisateurs est comme l'échantillonnage pour un essai clinique. Les chercheurs en médecine ne testent pas un médicament uniquement sur les bénévoles les plus en forme et les plus disponibles — ils définissent des critères d'inclusion/exclusion rigoureux pour que les résultats soient généralisables à la population cible. Le même principe s'applique à la recherche UX.

### Méthodologie & Bonnes pratiques

#### Définir les critères de recrutement

Avant de recruter, définir :

1. **Critères d'inclusion** — Caractéristiques nécessaires pour représenter les utilisateurs cibles (comportement, contexte d'usage, relation au domaine).
2. **Critères d'exclusion** — Caractéristiques qui biaiseraient les résultats (ex : exclure les employés de l'entreprise, les professionnels UX pour les tests de concept).
3. **Critères de diversité** — Assurer la représentativité sur les dimensions pertinentes.

**Matrice de diversité standard :**

| Dimension | Variables à couvrir | Pourquoi c'est important |
|---|---|---|
| Genre | Femmes, hommes, non-binaire | Comportements et modèles mentaux peuvent diverger |
| Âge | Couvrir au minimum 3 tranches | L'expérience numérique varie massivement |
| Niveau de littératie numérique | Novice, intermédiaire, expert | Définit les attentes d'affordance |
| Handicap | Moteur, visuel, cognitif, auditif | Révèle les problèmes d'accessibilité |
| Contexte d'usage | Mobile/desktop, connexion rapide/lente | Impacte les décisions de performance et responsive design |
| Langue maternelle | Locuteurs natifs et non-natifs | Révèle les problèmes de compréhension des labels |
| Origine géographique/culturelle | Si produit multi-marché | Conventions UX et attentes varient culturellement |

#### Quotas démographiques

Les quotas définissent la répartition cible de chaque groupe dans l'échantillon. Ils évitent que la facilité de recrutement crée une sur-représentation de certains profils.

**Exemple de plan de recrutement pour 12 participants (test d'usabilité modéré) :**

```
Profil A — Utilisateurs expérimentés (usage quotidien)         : 4 participants
  - 2 femmes (dont 1 senior 60+), 2 hommes (dont 1 avec handicap)

Profil B — Utilisateurs occasionnels (1-2 fois/semaine)        : 4 participants
  - Mix genre, 1 profil faible littératie numérique, 1 mobile-only

Profil C — Nouveaux utilisateurs (< 1 mois d'expérience)       : 4 participants
  - 2 non-natifs de la langue de l'interface, mix âge
```

#### Inclusion cognitive

L'inclusion cognitive signifie concevoir et conduire les tests pour des utilisateurs avec des profils cognitifs variés :

- **Dyslexie** : Adapter les protocoles écrits, permettre le verbal
- **TDAH** : Sessions plus courtes, pauses structurées, tâches clairement délimitées
- **Anxiété** : Créer un contexte explicitement dépourvu de jugement, permettre l'arrêt sans explication
- **Fatigue cognitive** : Tester à différents moments de la journée (matin vs. fin de journée)
- **Âge avancé** : Sessions plus courtes, zoom interface, pas de pression temporelle

#### Canaux de recrutement

| Canal | Avantages | Inconvénients | Idéal pour |
|---|---|---|---|
| Panel de recrutement (Usertesting, Maze, UserZoom) | Rapide, filtres démographiques | Coûteux, profils parfois gamifiés | Tests rapides, grands volumes |
| Base de clients existants | Comportement réel connu, engagés | Biais de fidélité, sur-représentation des satisfaits | Tests d'optimisation |
| Recrutement terrain | Contexte naturel, diversité | Long, difficile à scaler | Recherche exploratoire, profils marginaux |
| Réseaux sociaux ciblés | Large reach, peu coûteux | Biais de self-selection | Discovery, proto-personas |
| Associations partenaires | Accès à des groupes spécifiques | Relation à construire | Inclusion de populations spécifiques |

### Correction modèle mental

❌ **Idée reçue** : « Les utilisateurs experts sont les meilleurs testeurs — ils donnent un feedback plus précis et articulé. »

✅ **Approche correcte** : Les utilisateurs experts testent leur propre expertise, pas l'interface. Ils contournent instinctivement les problèmes qu'un novice rencontrerait, et leur feedback porte sur des nuances avancées ignorées par 80% des utilisateurs réels. Pour les tests d'usabilité, prioriser les utilisateurs représentatifs de la majorité cible, pas les plus éloquents.

**KPI impacté** : Task success rate (les problèmes détectés avec des experts non représentatifs ne sont pas ceux qui causent les échecs réels), généralisation des insights (des résultats obtenus sur un échantillon non représentatif ne peuvent pas guider des décisions à l'échelle).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Représentativité de l'échantillon (écart vs. base utilisateurs) | Pertinence des décisions de design (moins de rework) |
| Couverture des profils d'accessibilité | Conformité légale (ADA, RGAA, EN 301 549) |
| Taux de participation des profils sous-représentés | Expansion de marché (nouveaux segments adressés) |

### Points éthiques & inclusivité

- Compenser équitablement les participants pour leur temps — ne pas exploiter la bonne volonté des utilisateurs.
- Obtenir un consentement éclairé adapté au profil du participant (version simplifiée pour les personnes avec difficultés de lecture, traduction pour les non-natifs).
- Garantir l'anonymat des données collectées et expliquer clairement comment elles seront utilisées.
- Ne pas recruter des populations vulnérables (personnes en détresse psychologique, situations de dépendance) sans protocole éthique renforcé.
- Assurer que le processus de recrutement lui-même est accessible (formulaire d'inscription accessible, options de participation alternatives).

---

## 5. Synthèse & Storytelling des insights

### Modèle mental

La synthèse est le moment où les données deviennent des décisions. Un insight brut (« 7 utilisateurs sur 10 ont cliqué sur le mauvais bouton ») n'a pas de valeur sans la compréhension de son origine et la recommandation qui s'ensuit. La synthèse transforme les observations en compréhension, et le storytelling transforme la compréhension en action.

### Analogie stable

La synthèse des insights ressemble au travail d'un détective qui résout une affaire. Il ne présente pas à la cour une liste de 200 indices dans l'ordre chronologique — il construit une narration cohérente qui relie les preuves, explique le mécanisme, et conduit à une conclusion claire. Les stakeholders business ont besoin d'une histoire, pas d'une annexe de données.

### Méthodologie & Bonnes pratiques

#### Du raw data à l'insight actionnable

La chaîne de transformation des données :

```
Observations brutes
    ↓ (regroupement par thème)
Patterns (récurrences)
    ↓ (analyse causale)
Insights (explication du comportement)
    ↓ (implication pour le design)
Recommandations (actions à prendre)
    ↓ (lien avec les objectifs business)
Décisions priorisées (OKR, roadmap)
```

**Exemple de cette chaîne :**
- Observation : « 4 utilisateurs ont cherché le bouton 'Aide' dans le menu de navigation »
- Pattern : « Les utilisateurs cherchent l'aide là où ils cherchent d'habitude dans d'autres produits »
- Insight : « Le modèle mental de l'aide est celui d'une navigation globale, pas d'une aide contextuelle »
- Recommandation : « Ajouter un accès à l'aide dans la navigation principale en complément de l'aide contextuelle »
- Décision : « Inclure dans le sprint suivant, impact attendu : réduction de 30% des tickets support sur les flux concernés »

#### Méthodes de synthèse

**Affinity mapping (diagramme d'affinité) :**

1. Transcrire chaque observation sur un post-it individuel
2. Regrouper silencieusement les post-its par affinité thématique
3. Nommer chaque groupe avec un titre de pattern
4. Identifier les groupes les plus peuplés = les priorités d'insight

**How Might We (HMW) :**

Transformer les insights négatifs en opportunités de design : « Les utilisateurs ne trouvent pas le prix total avant le checkout » → « Comment pourrions-nous rendre le coût total visible à chaque étape du parcours ? »

**Jobs-to-be-done mapping :**

Organiser les insights autour des jobs fonctionnels, émotionnels et sociaux identifiés. Révèle les opportunités de design non évidentes.

#### Storytelling des insights pour les stakeholders

**Structure narrative efficace pour une présentation insights :**

| Section | Contenu | Durée recommandée |
|---|---|---|
| Context hook | Pourquoi cette recherche ? Quel problème business ? | 2 min |
| Portrait utilisateur | Qui avons-nous rencontré ? Citation forte | 3 min |
| Journey map annotée | Le parcours réel avec les points de friction | 5 min |
| Top 3 insights | Chaque insight avec preuve + impact estimé | 6 min |
| Recommandations | Priorisées par impact × effort | 4 min |
| Prochaines étapes | Ce qui est décidé, ce qui reste à valider | 2 min |

**Règle d'or** : Chaque insight doit être accompagné d'une preuve (verbatim, vidéo clip, donnée quantitative). Un insight sans preuve est une opinion.

#### IA pour la synthèse & les dashboards interactifs

- **Clustering automatique de verbatims** : Les modèles NLP (BERT, GPT) peuvent regrouper automatiquement des centaines de verbatims par thème, réduisant de 70% le temps d'affinity mapping manuel.
- **Génération de résumés d'insight** : L'IA peut produire un premier jet de synthèse des patterns récurrents, à réviser et valider par le chercheur.
- **Dashboards interactifs** : Outils comme Dovetail, EnjoyHQ ou des solutions custom permettent de créer des dashboards vivants où les insights sont liés aux verbatims source, permettant aux stakeholders de « descendre » jusqu'à la preuve.
- **Visualisation narrative** : L'IA peut générer automatiquement des visualisations de journey maps et de sentiment maps à partir des données de recherche structurées.

**Limite importante** : L'IA génère des patterns statistiques — elle ne génère pas des insights. L'insight requiert la compréhension du contexte humain, du domaine, et des enjeux business. Le chercheur UX reste l'interprète.

### Correction modèle mental

❌ **Idée reçue** : « Une présentation avec beaucoup de données inspire plus confiance qu'une présentation épurée. »

✅ **Approche correcte** : Trop de données noient l'insight principal dans le bruit. Les stakeholders business prennent des décisions sur 3-5 insights clés, pas sur 50 observations. La clarté de la narration détermine la probabilité que les insights se transforment en décisions — pas la quantité de données présentées.

**KPI impacté** : Taux d'adoption des recommandations UX (les insights bien narrativisés ont un taux d'adoption 2-3× supérieur selon les études de pratiques de recherche), vitesse de décision (moins de temps perdu en réunions de clarification post-présentation).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux d'adoption des recommandations UX | Vélocité de décision (time-to-action sur insights) |
| Couverture des insights dans les décisions de sprint | Réduction du rework (décisions basées sur données réelles) |
| Qualité de la triangulation quanti/quali | ROI de la recherche (insights vs. coût de conduite) |

### Points éthiques & inclusivité

- Anonymiser rigoureusement toutes les citations et vidéos avant partage avec des stakeholders non impliqués dans la recherche.
- Éviter le cherry-picking des verbatims qui confirment uniquement les hypothèses. Présenter les insights contradictoires avec la même rigueur.
- Mentionner explicitement les limites de l'échantillon dans toute présentation (qui n'est pas représenté dans ces résultats).
- Restituer les résultats aux participants quand cela est possible et pertinent — la transparence sur l'utilisation de leur contribution renforce la confiance.

---

## 6. Accessibilité & Inclusion

### Modèle mental

L'accessibilité n'est pas une fonctionnalité supplémentaire pour une minorité — c'est la **qualité de base** de tout design. Concevoir accessible améliore l'expérience pour tous (effet de la bordure de trottoir : conçue pour les fauteuils roulants, utilisée par les poussettes, les livreurs, les cyclistes). L'inclusion est l'objectif stratégique dont l'accessibilité est un outil.

### Analogie stable

L'accessibilité est comme les normes de construction parasismique. On ne les applique pas uniquement dans les zones à fort risque sismique — elles deviennent un standard de qualité universel parce que les bâtiments qui résistent aux séismes résistent aussi mieux à tout. De même, une interface qui fonctionne pour un utilisateur aveugle, sourd, ou avec une main immobilisée fonctionne mieux pour tout le monde dans des conditions dégradées.

### Méthodologie & Bonnes pratiques

#### WCAG 2.1 — Les quatre principes fondamentaux (POUR)

| Principe | Description | Exemples d'implémentation |
|---|---|---|
| **P**erceptible | L'information doit être présentable à tous les sens | Texte alternatif sur les images, sous-titres vidéo, contraste suffisant |
| **O**pérable | L'interface doit être navigable sans souris | Navigation clavier complète, pas de time limits, focus visible |
| **U**nderstandable | Le contenu et l'interface doivent être compréhensibles | Labels clairs, messages d'erreur explicites, aide contextuelle |
| **R**obust | Le contenu doit être interprété par les technologies d'assistance | HTML sémantique, ARIA labels, compatibilité lecteurs d'écran |

**Niveaux de conformité :**
- **Niveau A** : Exigences minimales absolues (non négociables)
- **Niveau AA** : Standard légal dans la plupart des pays (RGAA en France, ADA aux USA, EN 301 549 en Europe)
- **Niveau AAA** : Excellence, souvent inatteignable globalement

#### Tests d'accessibilité sur profils variés

**Méthodes de test d'accessibilité :**

| Méthode | Ce qu'elle teste | Outils | Limites |
|---|---|---|---|
| Test automatique | Erreurs WCAG détectables par code | axe, WAVE, Lighthouse | Détecte ~30-40% des problèmes WCAG |
| Test au lecteur d'écran | Navigation et compréhension sans visuel | NVDA, JAWS, VoiceOver | Nécessite expertise |
| Test navigation clavier | Opérabilité sans souris | Manuel | Rapide, très révélateur |
| Test fort contraste | Lisibilité dans les modes dégradés | Mode OS | Simple, souvent négligé |
| Test avec utilisateurs réels | Impact réel sur des personnes concernées | Recrutement spécifique | Le plus valide, le plus rare |

**Règle importante** : Les tests automatiques ne remplacent pas les tests avec des utilisateurs en situation de handicap. Ils sont complémentaires, pas substituables.

#### Simulations d'accessibilité assistées par IA

L'IA ouvre de nouvelles possibilités pour tester l'accessibilité :

- **Simulation de déficiences visuelles** : Outils comme Sim Daltonism ou les filtres intégrés dans Figma simulent différents types de daltonisme et de déficiences visuelles sur les maquettes.
- **Analyse automatique de contraste** : L'IA peut analyser des captures d'écran entières pour détecter tous les problèmes de contraste, pas uniquement les couleurs codées en dur.
- **Génération de textes alternatifs** : Les modèles de vision par ordinateur peuvent suggérer des textes alternatifs pour les images — à réviser par un humain pour la pertinence contextuelle.
- **Test de lisibilité cognitive** : L'IA peut évaluer la complexité linguistique d'une interface (indice de Flesch-Kincaid) et identifier les formulations trop complexes.

#### Recommandations inclusives clés

**Pour les déficiences visuelles :**
- Ratio de contraste minimum 4,5:1 pour le texte normal, 3:1 pour le texte large (WCAG AA)
- Ne jamais utiliser la couleur seule comme seul indicateur d'information
- Taille de police minimum 16px pour le corps de texte

**Pour les déficiences motrices :**
- Zones de clic minimum 44×44px (Apple HIG) / 48×48dp (Material Design)
- Pas d'interactions qui requièrent précision ou vitesse (hover states critiques)
- Toutes les fonctions accessibles au clavier et vocalement

**Pour les déficiences cognitives :**
- Language simple (niveau lycée maximum pour les interfaces grand public)
- Pas plus de 5-7 options dans un menu (capacité de mémoire de travail)
- Messages d'erreur explicites et constructifs (dire ce qui s'est passé ET quoi faire)
- Pas de contenu qui clignote plus de 3 fois par seconde (risque épileptique)

### Correction modèle mental

❌ **Idée reçue** : « L'accessibilité, c'est pour les 2% d'utilisateurs en situation de handicap. Le ROI ne justifie pas l'investissement. »

✅ **Approche correcte** : 15% de la population mondiale vit avec un handicap permanent (OMS). 100% des utilisateurs vivent avec des handicaps situationnels (bras cassé, soleil sur l'écran, bruit ambiant, fatigue, stress). L'accessibilité améliore l'expérience pour tous. Et légalement, en France (RGAA) et en Europe (EN 301 549), c'est une obligation pour les services publics et les grandes entreprises — dont la non-conformité expose à des sanctions.

**KPI impacté** : SUS (une interface accessible est une interface mieux conçue, le SUS s'améliore pour tous), risque légal (exposition aux sanctions RGAA/ADA), expansion marché (15% de la population globalement sous-adressée).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| WCAG 2.1 AA compliance rate | Risque légal (conformité RGAA, ADA) |
| SUS segmenté par profil d'accessibilité | Expansion de marché (segment handicap) |
| Task success rate pour les utilisateurs avec assistive technologies | Coût de mise en conformité (croît exponentiellement si traité en fin de projet) |

### Points éthiques & inclusivité

- Impliquer des personnes en situation de handicap dès la phase de discovery, pas uniquement pour valider une solution déjà conçue.
- L'accessibilité n'est pas une liste de cases à cocher — c'est une culture de design empathique qui se construit dans les critères d'acceptance des stories et les revues de design.
- Éviter le « inspiration porn » : ne pas utiliser des personnes en situation de handicap uniquement comme sujets d'études de cas sans les impliquer dans les solutions.
- Penser à l'accessibilité des processus de recherche eux-mêmes : les questionnaires, les outils de test, les lieux de recrutement doivent être accessibles.

---

## 7. Biais dans la recherche

### Modèle mental

Les biais sont les **angles morts structurels** de la recherche utilisateur. Ils ne résultent pas d'une incompétence ou d'une mauvaise intention — ils sont intrinsèques à la façon dont les humains traitent l'information et interagissent avec d'autres humains. Les identifier ne les élimine pas, mais permet de les compenser.

### Analogie stable

Les biais de recherche ressemblent aux aberrations optiques dans un télescope. Même un télescope parfaitement conçu a des zones où l'image est déformée. Un astronome expert connaît les aberrations de son instrument et sait quand les corriger dans son analyse. Un astronome naïf prendrait les déformations pour des données réelles. En recherche UX, connaître ses biais est une compétence professionnelle, pas une admission de faiblesse.

### Méthodologie & Bonnes pratiques

#### Taxonomie des biais majeurs en recherche UX

##### Biais d'échantillonnage

Le biais le plus structurel : vos participants ne représentent pas vraiment vos utilisateurs.

| Type | Description | Exemple concret | Correction |
|---|---|---|---|
| Biais de volontariat | Les participants volontaires sont différents des non-volontaires | Les testeurs UX sont plus engagés et tech-savvy que la moyenne | Recruter activement les profils moins disponibles |
| Biais de survivant | N'étudier que les utilisateurs actifs, ignorer ceux qui ont abandonné | Les churnés ne participent plus aux tests | Inclure des churnés récents dans le recrutement |
| Biais de commodité | Recruter les profils les plus faciles d'accès | Recruter uniquement en ligne exclut les non-numérisés | Plan de recrutement avec quotas diversifiés |
| Biais géographique | Over-représentation de certaines zones | Recruter uniquement dans les grandes villes | Élargir le bassin de recrutement |

##### Biais de désirabilité sociale

Les participants disent ce qu'ils pensent que le chercheur veut entendre, ou ce qui les présente sous un jour favorable.

**Symptômes :**
- Évaluations uniformément positives sur tout
- Hésitation avant de critiquer
- Commentaires qui correspondent étrangement aux hypothèses du chercheur

**Corrections :**
- Formuler les questions en third person : « Que penseraient des utilisateurs comme vous de... » plutôt que « Qu'en pensez-vous ? »
- Affirmer explicitement : « Il n'y a pas de bonne ou mauvaise réponse — vous testez l'interface, pas vous-même »
- Utiliser des méthodes comportementales (analytics, eye-tracking) qui ne dépendent pas des déclarations

##### Biais d'acquiescement (Acquiescence bias)

La tendance des participants à approuver les affirmations, quelle que soit leur opinion réelle.

**Symptômes :**
- Accord élevé sur des affirmations contradictoires présentées à des moments différents
- Scores Likert systématiquement au-dessus de la moyenne

**Corrections :**
- Alterner questions positives et négatives (le SUS utilise précisément cette technique)
- Utiliser des échelles bipolaires plutôt que des échelles d'accord unidirectionnelles
- Comparer les déclarations au comportement observé

##### Biais du chercheur

Les biais introduits par la personne qui conduit la recherche.

| Biais | Description | Correction |
|---|---|---|
| Biais de confirmation | Chercher les données qui confirment l'hypothèse | Définir les critères de falsification avant la recherche |
| Leading questions | Formulations qui orientent la réponse | Faire réviser les guides par un pair |
| Biais d'interprétation | Interpréter les silences et les hésitations selon ses attentes | Multi-codage indépendant par deux chercheurs |
| Biais de recency | Surpondérer les dernières observations | Prendre des notes détaillées pendant le test, pas après |

#### Détection IA des biais algorithmiques

Les biais dans la recherche UX ne concernent pas uniquement les biais humains — ils incluent aussi les biais dans les outils numériques utilisés.

**Biais algorithmiques à surveiller :**

| Biais algorithmique | Description | Impact UX |
|---|---|---|
| Biais de représentation | Les données d'entraînement sur-représentent certains groupes | Les recommandations personnalisées fonctionnent moins bien pour les minorités |
| Biais de mesure | Les métriques favorisent certains comportements | Les A/B tests optimisent pour la conversion à court terme, pas le bien-être |
| Biais de feedback loop | Les algorithmes renforcent les comportements déjà existants | La personnalisation crée des filtres de bulle qui réduisent la diversité d'exposition |
| Biais d'attribution | L'IA attribue des intentions à tort à certains groupes | Les systèmes de détection de fraude avec plus de faux positifs sur certains profils |

**Méthodes de détection IA des biais :**
- **Fairness metrics** : Mesurer si les performances du modèle sont équivalentes entre groupes (demographic parity, equalized odds).
- **Counterfactual testing** : Tester si le modèle donne des résultats différents selon le profil démographique à toutes choses égales par ailleurs.
- **Audit d'explicabilité** : Utiliser des méthodes XAI (SHAP, LIME) pour comprendre quelles features du profil pèsent dans les décisions algorithmiques.

### Comparaison des approches de contrôle des biais

| Approche | Biais adressés | Effort | Quand l'utiliser |
|---|---|---|---|
| Triangulation méthodes | Biais de méthode | Moyen | Toute recherche décisionnelle |
| Multi-codage indépendant | Biais d'interprétation | Élevé | Analyse qualitative critique |
| Blind analysis | Biais de confirmation | Moyen | Quand les hypothèses sont fortes |
| Données comportementales | Biais de désirabilité | Faible | Toujours en complément |
| Pre-registration des hypothèses | Biais de confirmation | Faible | Recherche à fort enjeu |

### Correction modèle mental

❌ **Idée reçue** : « Les biais sont évitables avec assez de rigueur. Un bon chercheur ne biaise pas sa recherche. »

✅ **Approche correcte** : Aucune recherche n'est exempte de biais — les biais sont inhérents à la cognition humaine et aux méthodes de collecte. L'objectif n'est pas l'absence de biais (impossible) mais la **conscience des biais présents** et leur **compensation systématique**. Un chercheur qui affirme ne pas avoir de biais est plus dangereux qu'un chercheur qui les identifie et les nomme.

**KPI impacté** : Validité des décisions de design (des insights biaisés conduisent à des solutions inadaptées), taux de succès des features post-lancement (les features conçues sur des insights biaisés ont un taux d'adoption inférieur).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux de convergence quanti/quali (validation croisée) | Taux de succès des features post-lancement |
| Représentativité de l'échantillon vs. base utilisateurs | ROI de la recherche (insights actionnables vs. biaisés) |
| Taux d'équité des métriques IA entre groupes | Risque légal (discrimination algorithmique, RGPD) |

### Points éthiques & inclusivité

- La transparence sur les biais et les limites de la recherche est une responsabilité éthique envers les décideurs qui utilisent ces résultats.
- Les biais algorithmiques peuvent avoir des conséquences discriminatoires réelles — une interface qui fonctionne moins bien pour certains groupes démographiques n'est pas un problème technique mineur, c'est une inégalité de service.
- Mettre en place une revue éthique des modèles IA utilisés dans le produit, avec une attention particulière aux biais de représentation.
- Documenter les biais identifiés dans les rapports de recherche — pas les cacher. La transparence améliore la qualité des décisions prises sur la base de ces résultats.
- Inclure dans les critères d'acceptance des modèles IA des métriques d'équité entre groupes démographiques, pas uniquement des métriques de performance globale.

---

*Fin de la Section 2 — Recherche utilisateur & Data Insights*
