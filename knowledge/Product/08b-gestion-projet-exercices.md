# Section 8 — Gestion de projet & Priorisation — Exercices

> **Mode d'emploi** : Pour chaque concept, commencez par répondre aux 3 exercices sans consulter les corrections. Notez votre raisonnement, vos hypothèses et vos doutes. La confrontation entre votre modèle mental initial et la correction est le vrai moteur d'apprentissage.

---

## CONCEPT 1 — Roadmap UX & Product

### Bloc 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :**
Tu rejoins en tant que Product Designer une startup fintech qui propose une application de gestion budgétaire pour les 18-30 ans. L'équipe a une roadmap existante sous forme de liste de fonctionnalités dans un Google Sheet, triées par ordre d'idée. Le CEO veut "sortir le plus de features possible" avant une levée de fonds dans 6 mois. Le CTO est focalisé sur la scalabilité technique. Il n'existe aucun lien documenté entre les fonctionnalités prévues et des objectifs business ou utilisateurs.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Décris ta démarche pour transformer cette liste de fonctionnalités en une roadmap orientée valeur. Quels premiers gestes ferais-tu ? Quelles questions poserais-tu, et à qui ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :**
L'équipe produit d'une plateforme d'e-learning B2B vient de produire la roadmap suivante pour le trimestre :

| Priorité | Feature | Raison invoquée |
|---|---|---|
| 1 | Nouveau tableau de bord administrateur | "Le CEO d'un gros client l'a demandé" |
| 2 | Refonte du logo in-app | "L'équipe marketing veut être cohérente" |
| 3 | Export PDF des certificats | "Plusieurs utilisateurs en ont parlé" |
| 4 | Amélioration de l'accessibilité (lecteurs d'écran) | "Ce serait bien d'avoir ça un jour" |
| 5 | Système de notifications push | "Ça a l'air de bien marcher chez les concurrents" |

**Question :**
Qu'est-ce qui ne va pas ici ? Identifie au moins 4 problèmes structurels dans cette roadmap. Quels KPIs UX et business seraient affectés négativement si cette roadmap était exécutée telle quelle ? Signale les dark patterns organisationnels présents.

---

#### Exercice 3 — Mini-cas réel

**Contexte :**
Tu es Product Designer senior chez une ONG qui développe une application mobile d'aide à la recherche d'emploi pour les personnes réfugiées en France. L'application existe depuis 18 mois. Les données disponibles sont :

- **Taux de complétion du profil** : 34% (objectif initial : 70%)
- **NPS** : +12 (très bas pour ce secteur)
- **Task success rate — "trouver une offre pertinente"** : 41%
- **Taux de rétention à J+30** : 18%
- **Entretiens utilisateurs récents** : Difficultés linguistiques majeures (l'app est uniquement en français), manque de confiance dans la sécurité des données personnelles, offres perçues comme inadaptées au niveau de qualification réel

**Contexte éthique et inclusif :**
Les utilisateurs sont dans des situations de grande vulnérabilité. Certains ont des compétences numériques limitées. Des données personnelles sensibles (statut migratoire, expériences traumatiques) peuvent être impliquées. La confiance est un enjeu central.

**Consigne :**
Décris ton modèle mental AVANT de commencer (tes hypothèses sur les causes des problèmes). Construis une roadmap pour les 3 prochains mois en priorisant selon la valeur utilisateur et la réduction des risques éthiques. Justifie chaque choix. Quels KPIs suivrais-tu pour valider l'impact de chaque initiative ? Comment communiquerais-tu cette roadmap aux parties prenantes de l'ONG (direction, bailleurs de fonds, équipe technique, partenaires associatifs) ?

---

### Bloc 2 — Corrections

---

#### Correction Exercice 1 — Traduction mentale

**Modèle mental attendu**

Une roadmap n'est pas une liste de fonctionnalités. C'est un outil de communication stratégique qui relie des problèmes utilisateurs réels à des objectifs business mesurables, dans une séquence temporelle justifiée. Le point de départ n'est jamais "que construire ?" mais "quel problème résoudre, pour qui, pourquoi maintenant ?"

**Raisonnement UX/Product**

Avant de toucher à la roadmap existante, il faut comprendre pourquoi elle est dans cet état. Une liste de features sans logique causale est souvent le symptôme d'une organisation qui confond livraison (output) et impact (outcome). La pression de la levée de fonds crée un biais vers la quantité plutôt que vers la valeur démontrée.

**Solution détaillée**

*Étape 1 — Audit de l'existant (semaine 1)*
- Rencontrer séparément le CEO, le CTO, et 2-3 membres de l'équipe pour comprendre les hypothèses derrière chaque feature listée
- Demander : "Si cette feature n'existait pas, que se passerait-il pour l'utilisateur ?" et "Comment saurons-nous que c'est un succès ?"
- Rechercher les données produit disponibles : analytics, feedbacks support, entretiens passés

*Étape 2 — Identifier les OKRs ou les objectifs stratégiques*
- Demander au CEO : quels sont les 3 indicateurs qui prouveront à vos investisseurs que le produit fonctionne ?
- Reformuler ces indicateurs en objectifs mesurables (ex : "augmenter le taux de rétention à J+30 de 20% à 45%")
- Si aucun OKR n'existe, proposer un atelier de 2h pour en définir ensemble

*Étape 3 — Reclasser les features par problème utilisateur*
- Regrouper les features par thème de problème (ex : "onboarding difficile", "manque de confiance", "valeur perçue insuffisante")
- Pour chaque groupe, identifier quel OKR il adresse
- Éliminer ou reporter les features qui n'adressent aucun OKR

*Étape 4 — Construire la roadmap maintenant/ensuite/plus tard*
- Utiliser le format "Now / Next / Later" plutôt que des dates précises (les dates créent de fausses certitudes)
- Pour chaque initiative dans "Now" : problème adressé, hypothèse de valeur, KPI de succès, dépendances
- Partager en format visuel, pas en tableur

*Questions clés à poser :*
- Au CEO : "Quel comportement utilisateur devons-nous changer pour rendre la levée de fonds convaincante ?"
- Au CTO : "Quelles contraintes techniques imposent un séquençage particulier ?"
- À l'équipe : "Quels problèmes utilisateurs revenaient le plus dans les feedbacks ?"

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Task success rate (fonctionnalités réellement utilisées) | Taux de conversion (démo → abonnement) |
| SUS score global | Rétention à 30/60/90 jours |
| Taux d'abandon de l'onboarding | Coût d'acquisition (si mauvaise rétention, CAC monte) |
| NPS (fidélité et recommandation) | ROI UX : valeur livrée vs. effort dépensé |

**Erreurs classiques**

- Confondre une liste de features avec une roadmap stratégique
- Accepter la pression du volume de features sans questionner leur valeur
- Ne pas impliquer les parties prenantes dans la définition des objectifs (roadmap imposée = roadmap contestée)
- Omettre la recherche utilisateur existante avant de proposer un plan

**Correction des biais cognitifs**

- **Biais de disponibilité** : les features listées en premier ne sont pas les plus importantes, elles sont juste celles dont quelqu'un s'est souvenu ce jour-là
- **HIPPO effect** (Highest Paid Person's Opinion) : la demande du CEO compte, mais elle doit être confrontée aux données utilisateurs avant d'entrer dans la roadmap
- **Biais de planification** : s'engager sur 6 mois de features précises dans une startup early-stage est une illusion — une roadmap souple et orientée objectifs est plus honnête et plus utile pour les investisseurs

**Améliorations possibles**

- Proposer une "opportunity solution tree" (Teresa Torres) pour visualiser comment chaque feature découle d'un besoin utilisateur, lui-même relié à un objectif business
- Créer un template de fiche initiative : problème, impact attendu, KPI de mesure, effort estimé, risque
- Organiser un "product review" mensuel pour ajuster la roadmap selon les apprentissages

**Feedback itératif — changement de paradigme en 1 phrase :**
Une roadmap n'est pas une promesse de livraison, c'est une hypothèse de valeur qui évolue au rythme de ce que vous apprenez sur vos utilisateurs.

---

#### Correction Exercice 2 — Piège de paradigme

**Modèle mental attendu**

Une roadmap saine est tirée par des problèmes utilisateurs et des objectifs business, pas par des demandes ad hoc, des intuitions ou des benchmarks concurrents non qualifiés. Chaque item doit pouvoir répondre à "quel problème utilisateur réel cela résout-il ?" et "comment le mesurerons-nous ?"

**Problèmes structurels identifiés**

**Problème 1 — Gouvernance par le client VIP (feature 1)**
La demande d'un seul client CEO, même important, ne justifie pas une priorité maximale. C'est un cas classique de "customer-driven" vs "user-centered" — la personne qui paie n'est pas l'utilisateur final. Un tableau de bord administrateur peut ne servir que quelques dizaines de personnes tandis que des milliers d'apprenants subissent des problèmes d'engagement non résolus.

❌ **Dark pattern organisationnel — HIPPO effect institutionnalisé** : la roadmap est otage des demandes des clients les plus bruyants, pas des besoins les plus répandus.

**Problème 2 — Feature cosmétique sans valeur fonctionnelle (feature 2)**
La refonte du logo in-app ne résout aucun problème utilisateur documenté. Elle satisfait un besoin interne (cohérence marketing) qui n'a aucun impact mesurable sur l'expérience d'apprentissage. C'est une dépense d'effort sans retour sur la valeur utilisateur.

❌ **Dark pattern organisationnel — Beauty over function** : prioriser l'apparence sur la fonctionnalité sans données qui justifient cet investissement.

**Problème 3 — Vague signal qualitatif non qualifié (feature 3)**
"Plusieurs utilisateurs en ont parlé" n'est pas une raison de priorisation suffisante. Combien ? Dans quel contexte ? À quelle fréquence ce problème bloque-t-il une tâche importante ? L'export PDF pourrait être une vraie nécessité (preuve d'apprentissage pour le CV, exigence RH) ou une demande anecdotique.

**Problème 4 — Accessibilité reléguée en option (feature 4)**
❌ **Dark pattern éthique et légal — Accessibilité optionnelle** : l'accessibilité n'est pas une amélioration "sympa à avoir". En Europe, le RGAA (Référentiel Général d'Amélioration de l'Accessibilité) impose des normes légales, particulièrement pour les services B2B. Les utilisateurs avec handicaps visuels sont exclus du produit tant que les lecteurs d'écran ne sont pas supportés. La formulation "ce serait bien d'avoir ça un jour" est une non-décision qui maintient une discrimination active.

**Problème 5 — Benchmark sans validation (feature 5)**
"Ça marche chez les concurrents" est une justification circulaire. Les notifications push peuvent augmenter l'engagement ou générer du churning par irritation selon le contexte, le timing, la pertinence et le canal. Sans recherche sur les comportements d'apprentissage des utilisateurs actuels, c'est un pari aveugle.

**KPIs affectés négativement par cette roadmap**

| Décision | KPI UX impacté | KPI Business impacté |
|---|---|---|
| Feature 1 (tableau admin VIP) | SUS des apprenants (non amélioré) | Churn des comptes non-VIP (risque) |
| Feature 2 (refonte logo) | Aucun KPI utilisateur amélioré | ROI négatif (effort sans retour mesurable) |
| Feature 3 (export PDF non qualifié) | Task success partiel, non ciblé | Faible impact sur rétention ou conversion |
| Feature 4 (accessibilité déprioritisée) | Exclusion totale des utilisateurs avec handicaps | Risque légal (non-conformité RGAA/WCAG) |
| Feature 5 (notifs sans recherche) | Taux d'opt-out (si notifications mal calibrées) | Engagement court terme, churning long terme |

**Erreurs classiques**

- Traiter les demandes des clients payants comme des ordres plutôt que comme des signaux à qualifier
- Confondre "quelqu'un l'a demandé" avec "c'est un problème répandu et bloquant"
- Reporter systématiquement l'accessibilité comme si elle n'était pas une obligation
- Imiter les concurrents sans comprendre leur contexte et leurs résultats réels

**Correction des biais cognitifs**

- **Biais d'imitation** (features 5) : ce que font les concurrents n'est pas forcément adapté à votre contexte, votre audience ou votre modèle économique
- **Biais de confirmation** (feature 1) : une demande forte d'un client important confirme notre envie de le satisfaire, mais ne valide pas l'importance pour l'ensemble des utilisateurs
- **Effet de halo** (feature 2) : si l'équipe marketing est influente, ses demandes semblent plus légitimes — même sans données

**Améliorations possibles**

- Adopter un framework de priorisation explicite (RICE, MoSCoW) avec critères transparents
- Intégrer l'accessibilité comme critère de qualification obligatoire ("cette feature est-elle accessible ?" devient un bloquant, pas une option)
- Créer une distinction claire entre "demandes clients" (input) et "initiatives roadmap" (décisions après qualification)
- Organiser un atelier de priorisation avec les parties prenantes pour aligner sur les critères

**Feedback itératif — changement de paradigme en 1 phrase :**
Une roadmap construite sur des demandes non qualifiées ressemble à un produit utile de l'extérieur, mais accumule en silence une dette d'impact : elle occupe l'équipe sans résoudre les vrais problèmes.

---

#### Correction Exercice 3 — Mini-cas réel

**Modèle mental attendu avant de commencer**

Avant d'analyser les données, un Product Designer doit formuler ses hypothèses initiales pour détecter ensuite ses propres biais. Les hypothèses probables ici :
- "Les taux faibles viennent d'un problème UX de navigation"
- "Il faut ajouter des fonctionnalités"
- "Le NPS faible reflète la qualité de l'interface"

Ces hypothèses sont partiellement fausses. Les données qualitatives (entretiens) révèlent des problèmes plus profonds : la langue, la confiance et l'inadéquation des contenus. Ce sont des enjeux systémiques, pas des problèmes d'interface superficiels.

**Analyse causale des KPIs**

| KPI | Valeur | Cause probable (hypothèse) |
|---|---|---|
| Complétion profil 34% | Très bas | Barrière linguistique + méfiance sur les données personnelles |
| NPS +12 | Bas | Valeur perçue insuffisante (offres inadaptées) + friction linguistique |
| Task success 41% | Très bas | Offres non filtrées par niveau de qualification réel + langue |
| Rétention J+30 18% | Critique | L'app ne délivre pas de valeur perçue rapidement → abandon |

**Roadmap 3 mois — orientée valeur et réduction des risques éthiques**

**Mois 1 — Confiance et accessibilité linguistique (fondations)**

*Initiative 1.1 — Multilinguisme minimum viable*
- Traduction de l'app en arabe, dari/pachto, tigrigna (langues les plus représentées parmi les réfugiés en France selon les données associatives)
- Ne pas attendre une traduction parfaite : un contenu imparfaitement traduit vaut mieux qu'un contenu incompréhensible
- Impliquer des utilisateurs bilingues comme testeurs de traduction rémunérés
- Justification éthique : exclure des utilisateurs par la langue est une forme de discrimination structurelle, même involontaire

*Initiative 1.2 — Transparence sur les données personnelles*
- Refonte de l'écran de création de compte : expliquer clairement ce qui est collecté, pourquoi, qui y a accès, comment l'effacer
- Ajouter une FAQ "Vos données sont protégées" accessible depuis le profil
- Justification éthique : des populations en situation administrative précaire ont des raisons légitimes de craindre le partage de données — la confiance se construit par la transparence, pas par l'opacité

*Initiative 1.3 — Simplification du formulaire de profil*
- Réduire le formulaire de profil au strict nécessaire pour afficher des offres pertinentes (3-5 champs max)
- Utiliser des icônes et des questions simples plutôt que du jargon administratif
- Permettre de compléter le profil progressivement (pas en une seule session)

**Mois 2 — Pertinence et valeur délivrée**

*Initiative 2.1 — Algorithme de matching basé sur le niveau de qualification réel*
- Travailler avec l'équipe technique pour filtrer les offres par niveau de qualification déclaré, pas seulement par secteur
- Inclure des filtres "équivalence de diplôme" et "compétences non formelles"
- Justification : afficher des offres inaccessibles génère de la frustration et du découragement — c'est une violence symbolique pour des personnes déjà fragilisées

*Initiative 2.2 — Onboarding valeur immédiate (< 3 minutes)*
- Créer un onboarding qui montre 3 offres pertinentes AVANT de demander toutes les informations de profil
- Principe "show, don't tell" : prouver la valeur de l'app avant de demander un effort
- Tester le flow avec 5 utilisateurs représentatifs (attention au recrutement : diversité de langues, niveaux numériques, situations)

**Mois 3 — Rétention et feedback loops**

*Initiative 3.1 — Système de suivi de candidature simple*
- Permettre aux utilisateurs de marquer les offres ("intéressé", "candidaté", "entretien") pour donner un sentiment de progression
- Notification utile J+7 : "Avez-vous eu des nouvelles ?" (non intrusif, optionnel)

*Initiative 3.2 — Mécanisme de feedback utilisateur in-app*
- Ajouter un micro-feedback après chaque session : "Les offres vous semblaient-elles adaptées ?" (2 options + champ libre optionnel)
- Traiter ce feedback en équipe chaque semaine

*Initiative 3.3 — Audit d'accessibilité numérique*
- Faire un audit RGAA/WCAG 2.1 AA de l'application (en partenariat avec une asso spécialisée si pas de budget pour un prestataire)
- Prioriser les corrections bloquantes (navigation clavier, contrastes, labels des champs)

**KPIs de suivi par initiative**

| Initiative | KPI UX | KPI Business/Impact |
|---|---|---|
| Multilinguisme | Taux de complétion profil par langue | Rétention J+30 par communauté linguistique |
| Transparence données | Taux de création de compte complet | Confiance mesurée par NPS segmenté |
| Matching qualification | Task success "trouver offre pertinente" | Taux de candidature soumise |
| Onboarding revu | Taux de complétion onboarding | Rétention J+7 (premier test de valeur) |
| Feedback in-app | Taux de réponse aux micro-feedbacks | Qualité perçue des offres (score moyen) |
| Accessibilité | Score RGAA (niveau A → AA) | Conformité légale, inclusion mesurée |

**Communication aux parties prenantes**

- **Direction ONG** : format "impact attendu vs. effort", lier chaque initiative à la mission de l'organisation et aux engagements pris envers les bénéficiaires
- **Bailleurs de fonds** : montrer le lien entre les KPIs d'impact (taux de placement, candidatures soumises) et les initiatives — les bailleurs veulent voir de l'impact social mesurable
- **Équipe technique** : roadmap avec dépendances techniques clarifiées, estimation des efforts, priorisation des "quick wins" pour maintenir la motivation
- **Partenaires associatifs** : les impliquer comme relais pour le recrutement des testeurs et comme validateurs des hypothèses culturelles et linguistiques

**Erreurs classiques dans ce contexte**

- Appliquer des solutions "standard" sans tenir compte du contexte culturel et linguistique des utilisateurs
- Mesurer uniquement les KPIs techniques sans mesurer l'impact social réel (personnes qui ont trouvé un emploi)
- Réduire la confiance à une question de "design de l'interface" sans traiter les enjeux réels de protection des données
- Négliger l'accessibilité numérique pour des utilisateurs potentiellement peu familiers avec les interfaces mobiles

**Feedback itératif — changement de paradigme en 1 phrase :**
Dans un contexte de grande vulnérabilité, chaque choix de design est un choix éthique : prioriser la confiance et l'inclusion n'est pas une contrainte supplémentaire, c'est la condition pour que le produit ait un impact réel.

---

## CONCEPT 2 — Priorisation RICE vs MoSCoW

### Bloc 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :**
Tu es Product Designer dans une scale-up SaaS de gestion des notes de frais pour les PME. Le backlog contient 23 fonctionnalités candidates pour le prochain trimestre. L'équipe a 2 Product Designers, 5 développeurs et un chef de projet. Le CEO veut "tout faire" mais les ressources sont limitées. Personne ne s'accorde sur ce qui est important.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Explique comment tu utiliserais un ou plusieurs frameworks de priorisation pour trancher objectivement. Quelles informations te manqueraient pour appliquer RICE ou MoSCoW ? Comment faciliterais-tu le processus de décision avec l'équipe ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :**
L'équipe produit d'une app de méditation grand public a appliqué MoSCoW pour le prochain sprint et produit le résultat suivant :

| Catégorie | Feature |
|---|---|
| Must have | Nouvelle gamme de sons premium (payants) |
| Must have | Intégration Apple Watch |
| Must have | Programme "30 jours de méditation" |
| Should have | Correction d'un bug d'accessibilité sur les sous-titres des vidéos guidées |
| Could have | Amélioration du temps de chargement des sessions (actuellement 8 secondes) |
| Won't have | Mode hors-ligne |

**Question :**
Qu'est-ce qui ne va pas dans l'application de MoSCoW ici ? Identifie les problèmes de raisonnement, les inversions de priorité et les dark patterns présents. Quels KPIs seraient affectés ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :**
Tu travailles pour une application de téléconsultation médicale qui vient de lever 5M€. Le backlog a été consolidé après une phase de recherche utilisateur. Tu dois prioriser les 6 initiatives suivantes pour le prochain trimestre (12 semaines, équipe de 4 devs + 1 designer) :

| ID | Initiative | Description |
|---|---|---|
| A | Réservation en moins de 3 clics | Simplifier le tunnel de prise de RDV |
| B | Historique médical partageable | Partage sécurisé avec d'autres médecins |
| C | Interface adaptée aux seniors (70+ ans) | Taille de texte, contraste, navigation simplifiée |
| D | Notifications de rappel de RDV | SMS + push 24h et 1h avant |
| E | Traduction automatique pour patients allophones | Consultation en 5 langues via traduction IA |
| F | Tableau de bord analytics pour médecins | Suivi de leur activité et revenus |

Données disponibles :
- **Reach** (nombre d'utilisateurs impactés sur 3 mois) : A=8000, B=2000, C=3500, D=9000, E=1200, F=800
- **Impact estimé sur le KPI principal** (taux de complétion de la prise de RDV) : A=4, B=2, C=3, D=3, E=2, F=1 (échelle 1-5)
- **Confidence** (niveau de preuve : recherche, tests, données) : A=80%, B=40%, C=70%, D=90%, D=90%, E=30%, F=60%
- **Effort** (en semaines-équipe) : A=2, B=6, C=4, D=1, E=8, F=5

**Contexte éthique et inclusif :**
La téléconsultation touche des personnes malades ou en détresse. Les seniors et les patients allophones sont structurellement désavantagés par les interfaces numériques médicales. Des vies peuvent dépendre de l'accessibilité du service.

**Consigne :**
Décris ton modèle mental AVANT de commencer. Applique le framework RICE à chaque initiative. Identifie les limites du score RICE dans ce contexte et comment les corriger avec une couche éthique. Produis une priorisation finale justifiée. Quels KPIs suivrais-tu pour chaque initiative ?

---

### Bloc 2 — Corrections

---

#### Correction Exercice 1 — Traduction mentale

**Modèle mental attendu**

Avant d'appliquer un framework, il faut comprendre ce que vous cherchez à optimiser. RICE et MoSCoW sont des outils de structuration de la décision, pas des algorithmes qui décident à votre place. Leur force est de rendre les hypothèses implicites explicites et comparables.

**Raisonnement UX/Product**

Le désaccord dans l'équipe sur les priorités révèle généralement l'absence de critères partagés, pas un manque d'intelligence collective. L'enjeu est d'aligner l'équipe sur des critères avant d'évaluer chaque feature.

**Solution détaillée**

*Informations manquantes pour appliquer RICE :*
- **Reach** : données analytics sur le nombre d'utilisateurs actifs, segmentation par type d'usage
- **Impact** : résultats de tests utilisateurs, entretiens, données de support (problèmes les plus signalés)
- **Confidence** : existe-t-il des preuves (tests, A/B, benchmarks) ou s'agit-il d'hypothèses ?
- **Effort** : estimations de l'équipe technique en points de complexité ou semaines

*Informations manquantes pour appliquer MoSCoW :*
- Définition partagée de "Must have" (bloquant pour qui ? dans quel usage ?)
- Objectif du sprint (sans objectif clair, tout peut sembler "Must have")
- Contraintes techniques non négociables

*Facilitation du processus de décision :*
1. Organiser un atelier "priorisation" de 2h avec Product Manager, designers et représentants techniques
2. Définir collectivement les critères d'évaluation (sur quelle métrique veut-on maximiser l'impact ?)
3. Évaluer chaque feature par rapport à ces critères — chacun note individuellement avant de comparer (évite la pensée de groupe)
4. Utiliser RICE pour les features comparables en reach et impact, MoSCoW pour qualifier les must-have réglementaires ou techniques
5. Documenter les décisions et les raisons — "pourquoi avons-nous écarté X" est aussi important que "pourquoi avons-nous choisi Y"

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Task success rate (features qui résolvent de vrais problèmes) | Vélocité de livraison (priorisation claire = moins de pivots) |
| SUS (cohérence fonctionnelle) | ROI développement (effort concentré sur haute valeur) |
| Taux d'adoption des nouvelles features | Satisfaction équipe (moins de conflits de priorité) |

**Erreurs classiques**

- Appliquer RICE sur des intuitions sans données réelles (garbage in, garbage out)
- Utiliser MoSCoW sans définir l'objectif du sprint — résultat : tout devient "Must have"
- Laisser le framework décider à la place du jugement humain — un score RICE de 100 pour une feature éthiquement problématique ne justifie pas de la construire

**Feedback itératif — changement de paradigme en 1 phrase :**
Un framework de priorisation ne remplace pas le jugement — il structure les hypothèses pour que la décision soit visible, justifiable et contestable.

---

#### Correction Exercice 2 — Piège de paradigme

**Modèle mental attendu**

MoSCoW est un outil de classification par criticité pour un objectif donné. Sa mauvaise application la plus fréquente : traiter "Must have" comme "ce qu'on veut" plutôt que "ce sans quoi l'objectif du sprint ne peut pas être atteint".

**Problèmes identifiés**

**Problème 1 — "Must have" utilisés comme désirs, pas comme nécessités**
Les sons premium et l'intégration Apple Watch sont des améliorations de valeur, pas des conditions de survie du produit. Si l'objectif du sprint est "améliorer l'engagement et la rétention", ces features peuvent contribuer — mais elles ne sont pas "Must have" au sens strict (le produit fonctionne sans elles).

**Problème 2 — Bug d'accessibilité classé "Should have"**
❌ **Dark pattern éthique — Accessibilité optionnelle** : un bug qui rend les sous-titres des vidéos guidées illisibles exclut les utilisateurs sourds ou malentendants de l'expérience principale. C'est une régression d'accessibilité et potentiellement une violation de la directive européenne sur l'accessibilité numérique. Ce bug devrait être classé "Must have" ou résolu immédiatement en dehors du sprint.

**Problème 3 — Temps de chargement de 8 secondes classé "Could have"**
❌ **Dark pattern de performance — Friction invisible** : 8 secondes de chargement pour une session de méditation est catastrophique. Les études montrent qu'un délai de plus de 3 secondes entraîne 53% d'abandon (Google/SOASTA). Ce n'est pas un luxe d'optimisation, c'est un problème de valeur fondamentale. Un utilisateur qui attend 8 secondes avant une méditation ne médite pas — il s'impatiente.

**Problème 4 — Mode hors-ligne classé "Won't have" sans justification**
Pour une app de méditation, l'usage hors-ligne (transports, zones rurales, voyage) est un cas d'usage majeur. Si la décision est justifiée par les contraintes d'effort, c'est acceptable — mais si c'est juste parce que "c'est compliqué techniquement", c'est un faux "Won't have" qui abandonne une partie significative des utilisateurs.

**KPIs affectés**

| Décision | KPI UX impacté | KPI Business impacté |
|---|---|---|
| Bug accessibilité en "Should have" | SUS (score d'usabilité pour users malentendants) | Risque légal, exclusion d'un segment |
| Chargement 8s en "Could have" | Task success (session démarrée), taux d'abandon | Rétention, engagement quotidien, LTV |
| Sons premium en "Must have" | Aucun KPI usabilité amélioré | Potentiel revenu, mais à quel coût d'opportunité ? |

**Feedback itératif — changement de paradigme en 1 phrase :**
Dans MoSCoW, "Must have" signifie "sans cela, le sprint échoue" — pas "c'est ce qu'on préfère construire".

---

#### Correction Exercice 3 — Mini-cas réel

**Modèle mental attendu avant de commencer**

Hypothèses initiales probables : "Il faut d'abord améliorer l'interface principale (A), les notifications sont toujours efficaces (D)." Biais possible : sous-estimer l'impact éthique de l'accessibilité (C) et de la traduction (E) parce que leurs scores RICE seront mécaniquement plus bas (reach limité).

**Calcul des scores RICE**

Formule : **(Reach × Impact × Confidence) / Effort**

| ID | Reach | Impact | Confidence | Effort | Score RICE |
|---|---|---|---|---|---|
| A | 8000 | 4 | 0.80 | 2 | **(8000 × 4 × 0.80) / 2 = 12 800** |
| B | 2000 | 2 | 0.40 | 6 | **(2000 × 2 × 0.40) / 6 = 266** |
| C | 3500 | 3 | 0.70 | 4 | **(3500 × 3 × 0.70) / 4 = 1 837** |
| D | 9000 | 3 | 0.90 | 1 | **(9000 × 3 × 0.90) / 1 = 24 300** |
| E | 1200 | 2 | 0.30 | 8 | **(1200 × 2 × 0.30) / 8 = 90** |
| F | 800 | 1 | 0.60 | 5 | **(800 × 1 × 0.60) / 5 = 96** |

**Classement RICE brut :**
1. D — Notifications (24 300)
2. A — Réservation simplifiée (12 800)
3. C — Interface seniors (1 837)
4. B — Historique partageable (266)
5. F — Dashboard médecins (96)
6. E — Traduction multilingue (90)

**Limites du score RICE dans ce contexte**

Le score RICE récompense le reach (nombre d'utilisateurs). Or, dans un contexte médical :
- Un patient allophone qui ne comprend pas son médecin est en situation de danger réel, pas de simple inconfort
- Un senior qui ne peut pas naviguer dans l'interface pour annuler un RDV manque potentiellement un soin urgent
- L'impact d'une erreur ou d'une exclusion dans un contexte médical n'est pas comparable à celui d'une app de divertissement

**Correction éthique du classement**

Appliquer un multiplicateur "criticité éthique" pour les initiatives à impact de sécurité ou d'inclusion médicale :

| ID | Score RICE | Multiplicateur éthique | Score ajusté | Justification |
|---|---|---|---|---|
| A | 12 800 | ×1 | 12 800 | Amélioration UX standard |
| B | 266 | ×1 | 266 | Confort médecins, pas critique |
| C | 1 837 | ×2 | 3 674 | Inclusion seniors : accès aux soins |
| D | 24 300 | ×1 | 24 300 | Impact fort, faible enjeu éthique |
| E | 90 | ×3 | 270 | Sécurité médicale : barrière langue = risque vital |
| F | 96 | ×1 | 96 | Analytique, non critique |

**Classement final ajusté :**
1. D — Notifications (24 300) — 1 semaine
2. A — Réservation simplifiée (12 800) — 2 semaines
3. C — Interface seniors (3 674) — 4 semaines
4. E — Traduction multilingue (270) — à découper en MVP (2 langues pilotes en 4 semaines)
5. B — Historique partageable (266) — reporté au trimestre suivant
6. F — Dashboard médecins (96) — reporté

**Capacité équipe : 4 devs × 12 semaines = ~12 semaines-équipe disponibles**
Plan retenu : D (1) + A (2) + C (4) + E partiel (4) = 11 semaines — réaliste avec marge de sécurité.

**KPIs par initiative**

| Initiative | KPI UX | KPI Business/Impact |
|---|---|---|
| D — Notifications | Taux de no-show (réduction attendue) | Taux d'annulation tardive, revenus médecins |
| A — Réservation simplifiée | Task success taux de RDV complété, temps moyen | Taux de conversion visite → RDV pris |
| C — Interface seniors | SUS segmenté 70+ ans, taux d'erreur | Rétention segment senior, NPS segmenté |
| E — Traduction | Task success patients allophones, compréhension du diagnostic | Inclusion mesurée, accès aux soins (impact social) |

**Erreurs classiques**

- Appliquer RICE mécaniquement sans questionner ce que "impact" signifie dans un contexte de soin
- Exclure les initiatives à faible reach sans évaluer la gravité de l'exclusion
- Confondre "evidence" avec "volume de données" — une étude ethnographique sur 10 seniors peut avoir une confidence plus haute qu'un A/B test sur 1000 utilisateurs non représentatifs

**Feedback itératif — changement de paradigme en 1 phrase :**
Dans un contexte à enjeux de sécurité ou de santé, le score RICE mesure l'efficacité mais pas la responsabilité — la priorisation finale doit intégrer explicitement ce que coûte l'exclusion de ceux que le score ne voit pas.

---

## CONCEPT 3 — Méthodes agiles adaptées au design

### Bloc 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :**
Tu viens d'intégrer une équipe Scrum en tant que Product Designer. L'équipe fait des sprints de 2 semaines. Lors de ta première Sprint Planning, tu constates que les maquettes sont validées le jour même de leur intégration par les développeurs. Les tests utilisateurs n'ont jamais eu lieu. Le Product Owner dit que "le design, c'est fait avant le sprint". La QA (Quality Assurance) se fait en fin de sprint sur des fonctionnalités déjà livrées.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Décris comment tu proposerais d'intégrer une boucle de design dans ce processus Scrum sans tout casser. Quels seraient tes alliés dans l'équipe, et comment convaincrais-tu les sceptiques ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :**
Une équipe produit d'une app de livraison de courses a adopté un "dual track agile" (double boucle discovery/delivery). Voici comment ils l'appliquent :

- La track Discovery produit des maquettes haute-fidélité chaque semaine
- La track Delivery implémente les maquettes de la semaine précédente
- Il n'y a pas de tests utilisateurs dans le processus — les maquettes sont validées par le Product Owner
- Les retours utilisateurs arrivent via les avis App Store (traités tous les 3 mois)
- Quand il y a un conflit entre la maquette et la faisabilité technique, le développeur implémente ce qui est possible sans en informer le designer

**Question :**
Qu'est-ce qui ne va pas dans ce dual track ? Identifie les dysfonctionnements, les dark patterns et les KPIs qui seraient affectés. Que manque-t-il pour que ce système fonctionne réellement ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :**
Tu es lead designer dans une fintech qui développe une app d'épargne automatique pour les indépendants (freelances, auto-entrepreneurs). L'équipe est composée de 3 designers, 6 développeurs, 1 PM et 1 Product Owner. Vous utilisez Scrum avec des sprints de 2 semaines.

La situation actuelle :
- Le taux de complétion de l'onboarding est de 28% (très bas)
- 60% des abandons surviennent à l'étape "connexion du compte bancaire"
- Les utilisateurs expriment des inquiétudes sur la sécurité lors des tests utilisateurs
- L'équipe a décidé de refaire entièrement l'onboarding en un sprint — une décision prise sans recherche supplémentaire
- Les développeurs ont déjà commencé à coder la nouvelle version basée sur des maquettes non testées

**Contexte éthique et inclusif :**
Les indépendants ont des situations financières instables et peuvent être en difficulté. La connexion bancaire implique des données très sensibles. Des erreurs dans l'onboarding pourraient entraîner des préjudices financiers (mauvaise compréhension des règles d'épargne automatique).

**Consigne :**
Décris ton modèle mental AVANT de commencer. Comment interviendrais-tu dans ce sprint en cours sans le faire dérailler ? Propose une organisation dual track pour les 3 prochains sprints qui permette de tester et d'apprendre en parallèle du développement. Quels KPIs suivrais-tu à chaque étape ? Comment traiterais-tu la dimension éthique et sécuritaire dans le process de design ?

---

### Bloc 2 — Corrections

---

#### Correction Exercice 1 — Traduction mentale

**Modèle mental attendu**

Scrum n'a pas été conçu pour exclure le design — il a été conçu pour les équipes de développement logiciel, et le design a été ajouté (souvent maladroitement) après coup. L'intégration du design dans Scrum n'est pas un problème d'outil, c'est un problème de temporalité et de culture.

**Raisonnement UX/Product**

Le symptôme "maquettes validées le jour de l'intégration" révèle que le design est traité comme une étape de production, pas comme un processus d'apprentissage. Le vrai problème : l'équipe croit que le design est "fini" quand les maquettes sont livrées. En réalité, le design est fini quand l'utilisateur accomplit sa tâche avec succès.

**Solution détaillée**

*Principe clé : le design doit avoir un sprint d'avance sur le développement*

Modèle "1 sprint ahead" :
- Sprint N (Delivery) : l'équipe développe les features designées et validées au sprint N-1
- Sprint N (Discovery) : en parallèle, le design travaille sur les features du sprint N+1 : recherche, idéation, tests de prototypes
- Résultat : quand le Sprint N se termine et que le Sprint N+1 commence, les maquettes sont déjà testées

*Comment proposer ce changement sans tout casser :*
1. Commencer par une conversation individuelle avec le Product Owner : "Je voudrais qu'on essaie quelque chose pendant 2 sprints — si ça ne marche pas, on revient en arrière"
2. Proposer de garder le sprint actuel intact et d'introduire la discovery en parallèle pour le prochain sprint seulement
3. Montrer concrètement : "Je vais tester ce prototype avec 3 utilisateurs cette semaine — ça prend 3h et ça peut éviter 2 semaines de développement inutile"

*Alliés dans l'équipe :*
- Le développeur senior : souvent frustré par les retours tardifs qui génèrent du refactoring coûteux
- Le QA : intéressé par les tests en amont (moins de bugs à corriger)
- Le Product Owner : si vous montrez que les tests utilisateurs réduisent le risque de mauvaise feature

*Convaincre les sceptiques :*
- Calculer le coût d'un sprint de développement sur une feature abandonnée après tests : "On a dépensé 2 semaines × 6 développeurs = 12 semaines-homme sur une feature qui n'a pas fonctionné. 3h de test utilisateur auraient pu l'éviter."
- Proposer un pilote sur 1 feature, avec avant/après mesuré sur les KPIs

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Taux d'erreur par feature (réduction) | Vélocité réelle (features utiles livrées, pas features produites) |
| Task success rate en sprint review | Coût de refontes post-livraison |
| SUS (évolution dans le temps) | Time-to-value (délai entre besoin identifié et valeur délivrée) |

**Feedback itératif — changement de paradigme en 1 phrase :**
Intégrer le design dans Scrum n'est pas ajouter une étape avant le sprint — c'est faire tourner la boucle d'apprentissage en parallèle de la boucle de livraison.

---

#### Correction Exercice 2 — Piège de paradigme

**Modèle mental attendu**

Le dual track agile est une promesse puissante : apprendre vite (discovery) pendant qu'on construit (delivery). Mais sans feedback utilisateur réel dans la discovery et sans communication entre les tracks, c'est une double cascade déguisée en agilité.

**Dysfonctionnements identifiés**

**Dysfonctionnement 1 — Discovery sans utilisateurs**
Une discovery track qui produit des maquettes haute-fidélité sans tests utilisateurs n'est pas une discovery — c'est de la production accélérée. La haute-fidélité est un signal d'alerte : plus une maquette est "belle", moins on est prêt à la remettre en question. La discovery devrait produire des prototypes basse-fidélité rapides à tester et à jeter.

**Dysfonctionnement 2 — Feedback utilisateur à 3 mois de délai**
❌ **Dark pattern de rétroaction — Feedback loop brisée** : traiter les avis App Store tous les 3 mois, c'est comme piloter une voiture en regardant dans le rétroviseur toutes les 10 minutes. Les problèmes se sont accumulés, les utilisateurs ont churné, et les avis App Store ne représentent pas les utilisateurs silencieux (qui abandonnent sans commenter).

**Dysfonctionnement 3 — Implémentation silencieuse des divergences techniques**
❌ **Dark pattern organisationnel — Design debt silencieuse** : quand un développeur implémente "ce qui est possible" sans en informer le designer, deux problèmes surgissent. Premièrement, l'expérience utilisateur finale n'est pas ce qui a été designé. Deuxièmement, personne ne documente l'écart, donc personne ne sait ce qui a réellement été livré par rapport à ce qui était prévu. C'est une accumulation invisible de dette UX.

**Ce qui manque**

- Des tests utilisateurs hebdomadaires (même 2 sessions de 30 min) dans la discovery track
- Un rituel de synchronisation design-dev avant l'intégration (ex : "design review" de 30 min en début de sprint)
- Un canal de communication clair pour signaler les divergences techniques (ex : les développeurs annotent les PR avec les écarts et le designer valide)
- Des métriques in-app (pas seulement les avis App Store) pour détecter les problèmes en temps réel

**KPIs affectés**

| Dysfonctionnement | KPI UX impacté | KPI Business impacté |
|---|---|---|
| Discovery sans utilisateurs | SUS (features non validées), taux d'erreur | Fonctionnalités peu adoptées, churning |
| Feedback à 3 mois | Task success non mesuré | Problèmes non détectés → churn silencieux |
| Écarts non communiqués | Cohérence de l'expérience (broken UX) | Coût de refactoring, dette technique UX |

**Feedback itératif — changement de paradigme en 1 phrase :**
Un dual track sans feedback utilisateur dans la discovery et sans communication entre les tracks est une façon organisée de construire la mauvaise chose deux fois plus vite.

---

#### Correction Exercice 3 — Mini-cas réel

**Modèle mental attendu avant de commencer**

Hypothèse initiale probable : "Il faut arrêter le sprint et tout recommencer proprement." C'est souvent la mauvaise réponse — elle détruit le travail déjà fait et crée de la méfiance envers le design dans l'équipe.

Hypothèse révisée : il faut d'abord comprendre ce qui est déjà engagé, réduire le risque des éléments non testés, et introduire une boucle d'apprentissage en parallèle sans bloquer la livraison.

**Intervention dans le sprint en cours**

*Ne pas stopper le sprint — mais introduire un garde-fou rapide*

1. Identifier quelles parties du code sont les plus avancées et les moins risquées (ex : les étapes d'onboarding avant la connexion bancaire)
2. Proposer immédiatement 3 tests utilisateurs express (guerrilla testing, 30 min chacun) sur le prototype actuel — faisable en 2 jours
3. Avec les résultats, séparer ce qui peut être livré tel quel de ce qui doit être revu
4. Négocier avec le PM et le PO : les parties risquées (connexion bancaire, communication sur la sécurité) sont placées en "spike" (exploration technique et design) plutôt qu'en livraison définitive

*Pourquoi c'est important éthiquement :*
Un onboarding bancaire mal expliqué peut conduire un indépendant en difficulté financière à autoriser des prélèvements automatiques qu'il ne comprend pas. C'est un risque de préjudice réel, pas une simple dégradation de l'expérience.

**Organisation dual track pour les 3 sprints suivants**

*Sprint 1 (semaines 1-2)*
- **Delivery** : Livrer les parties validées de l'onboarding (étapes 1-3), en excluant la connexion bancaire
- **Discovery** : Tests qualitatifs approfondis sur la connexion bancaire (5 entretiens + prototype papier) ; identifier les sources d'inquiétude sur la sécurité ; benchmark des apps bancaires reconnues pour leur confiance (N26, Revolut, Lydia)

*Sprint 2 (semaines 3-4)*
- **Delivery** : Intégrer les itérations validées de l'étape connexion bancaire ; A/B test sur le message de réassurance sécurité (2 variantes)
- **Discovery** : Analyser les résultats des tests ; recruter 3 utilisateurs représentatifs pour un test utilisateur modéré sur le flow complet ; tester les messages de communication sur la sécurité

*Sprint 3 (semaines 5-6)*
- **Delivery** : Finaliser le flow d'onboarding complet avec les insights intégrés ; déployer à 20% des nouveaux utilisateurs
- **Discovery** : Observer les données in-app du déploiement partiel ; préparer les hypothèses pour le sprint suivant

**KPIs par étape**

| Sprint | KPI UX suivi | KPI Business suivi |
|---|---|---|
| Sprint 1 | Taux d'abandon par étape (heatmap) | Taux de completion onboarding étapes 1-3 |
| Sprint 2 | Taux de confiance perçue (questionnaire post-session) | Taux de complétion connexion bancaire |
| Sprint 3 | SUS du flow complet, task success rate | Taux de complétion onboarding global (vs. 28% de départ) |

**Traitement de la dimension éthique dans le process**

- Checklist "sécurité et transparence" pour chaque écran du flow bancaire : est-ce que l'utilisateur sait ce qui va se passer ? A-t-il les moyens de refuser ou d'annuler ?
- Tester explicitement avec des utilisateurs en situation précaire (contactés via des associations d'indépendants, avec consentement)
- Ne jamais pré-cocher des autorisations de prélèvement — c'est un dark pattern de consentement qui serait légalement et éthiquement inacceptable
- Ajouter une étape "simulateur" : "Voici comment fonctionnera votre épargne automatique le mois prochain" avant la validation finale

**Erreurs classiques**

- Arrêter un sprint en cours parce que le processus n'était pas parfait — cela démoralise l'équipe et génère de la méfiance envers le design
- Traiter la sécurité financière comme un problème de "UX writing" plutôt que comme un enjeu d'architecture d'information et de transparence
- Tester uniquement avec des utilisateurs confortables avec la technologie bancaire, qui ne représentent pas les utilisateurs les plus vulnérables

**Feedback itératif — changement de paradigme en 1 phrase :**
Dans un sprint déjà engagé, le rôle du designer n'est pas d'avoir raison sur le processus — c'est de réduire le risque pour l'utilisateur avec le temps et les ressources disponibles.

---

## CONCEPT 4 — Suivi de performance & Feedback loops

### Bloc 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :**
Tu rejoins en tant que Product Designer une application de coaching sportif en ligne. L'équipe dispose de données analytics depuis 18 mois, mais personne ne les regarde régulièrement. Le PM dit : "On a tout dans Mixpanel, mais personne n'a le temps d'analyser." Le NPS est mesuré une fois par an. Les décisions de design sont prises en réunion, basées sur les convictions des personnes présentes.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Quelles métriques regarderais-tu en premier et pourquoi ? Comment construirais-tu une culture de suivi de performance dans cette équipe sans créer une "data paralysis" (paralysie par excès de données) ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :**
L'équipe d'une plateforme de mise en relation entre freelances et entreprises a mis en place le tableau de bord de performance suivant qu'elle consulte chaque semaine :

| Métrique | Valeur actuelle | Tendance |
|---|---|---|
| Nombre de visiteurs uniques | 45 000/mois | ↑ +12% |
| Nombre de pages vues | 280 000/mois | ↑ +8% |
| Durée moyenne de session | 4 min 32 sec | → stable |
| Taux de rebond | 68% | → stable |
| Nombre de profils créés | 1 200/mois | ↑ +5% |
| **Taux de mise en relation réussie** | **8%** | **↓ -3%** |

L'équipe est satisfaite de ses résultats car "le trafic monte".

**Question :**
Qu'est-ce qui ne va pas dans la lecture de ces métriques ? Identifie le vrai problème caché dans ce tableau de bord. Quels KPIs seraient vraiment pertinents pour mesurer la santé de cette plateforme ? Pourquoi le "taux de rebond" et la "durée de session" peuvent être des métriques trompeuses ? Signale le dark pattern de mesure présent.

---

#### Exercice 3 — Mini-cas réel

**Contexte :**
Tu es Product Designer dans une application de suivi de santé mentale (journal de bien-être, exercices guidés, accès à des ressources) destinée aux étudiants universitaires. L'app a été lancée il y a 6 mois, en partenariat avec 3 universités.

Données disponibles :
- **DAU (Daily Active Users)** : 1 200 (sur 8 000 inscrits)
- **Taux de rétention à J+7** : 31%
- **Taux de rétention à J+30** : 12%
- **NPS** : +8
- **Feature la plus utilisée** : Journal de bien-être (68% des sessions actives)
- **Feature la moins utilisée** : Accès aux ressources professionnelles (3% des sessions)
- **Feedback qualitatif** : "C'est utile mais je ne sais pas si ça change vraiment quelque chose", "J'aimerais savoir si je progresse", "Je n'ose pas accéder aux ressources de psy, j'ai peur que ça soit enregistré"

**Contexte éthique et inclusif :**
Les données de santé mentale sont parmi les plus sensibles qui existent. Des étudiants en détresse peuvent utiliser l'app dans des moments de vulnérabilité extrême. La stigmatisation de la santé mentale est un frein réel à l'accès aux ressources professionnelles.

**Consigne :**
Décris ton modèle mental AVANT de commencer. Analyse les données disponibles et identifie les 3 problèmes principaux à traiter. Construis un système de suivi de performance (quelles métriques, à quelle fréquence, par qui) adapté à ce contexte sensible. Propose des feedback loops qui permettent d'itérer rapidement sans compromettre la confiance ou la sécurité des utilisateurs. Quels KPIs ne faut-il PAS utiliser ici, et pourquoi ?

---

### Bloc 2 — Corrections

---

#### Correction Exercice 1 — Traduction mentale

**Modèle mental attendu**

La data paralysis vient d'un excès de métriques sans hiérarchie. La solution n'est pas "regarder plus de données" mais "identifier la North Star Metric — la métrique unique qui reflète le mieux la valeur délivrée aux utilisateurs" et construire autour d'elle un système minimaliste de suivi.

**Raisonnement UX/Product**

Pour une app de coaching sportif, la valeur n'est pas "regarder l'app" — c'est "progresser". La North Star Metric pourrait être : "nombre de sessions d'entraînement complétées par utilisateur actif sur 30 jours". Tout le reste s'organise autour de cette métrique centrale.

**Solution détaillée**

*Étape 1 — Identifier la North Star Metric*
- Organiser un atelier d'1h avec le PM et l'équipe : "Quel comportement utilisateur prouve que notre app crée de la valeur ?"
- Formuler en comportement mesurable, pas en sentiment : pas "les utilisateurs sont satisfaits" mais "les utilisateurs complètent X séances par semaine"

*Étape 2 — Construire un dashboard minimaliste (3-5 métriques max)*
- North Star : sessions complétées / utilisateur actif / 30 jours
- Santé du funnel : taux de complétion de la 1ère séance (onboarding)
- Rétention : J+7, J+30 (indicateur de valeur perçue dans le temps)
- NPS : mesuré tous les trimestres sur les utilisateurs actifs (pas tous les utilisateurs)
- 1 métrique d'alerte : taux d'abandon en cours de séance (signal d'un problème UX)

*Étape 3 — Créer un rythme de lecture*
- Review hebdomadaire de 30 min : regarder uniquement les variations sur la North Star et les métriques d'alerte
- Review mensuelle d'1h : analyser les tendances, relier aux décisions prises
- Règle : toute décision de design produit doit inclure une hypothèse mesurable ("si on change X, on s'attend à voir Y évoluer de Z%")

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Task completion (séances terminées) | Rétention (abonnements renouvelés) |
| SUS (facilité d'usage perçue) | LTV (valeur utilisateur sur 12 mois) |
| Taux d'abandon en cours de séance | Coût d'acquisition vs. rétention |

**Erreurs classiques**

- Confondre vanity metrics (nombre d'utilisateurs inscrits) et actionable metrics (taux d'activation)
- Mesurer le NPS sur tous les utilisateurs, y compris les inactifs — cela dilue le signal
- Regarder les données sans hypothèse préalable — "chercher" dans les données sans question précise génère des faux positifs

**Feedback itératif — changement de paradigme en 1 phrase :**
Une North Star Metric bien choisie ne simplifie pas la réalité — elle concentre l'attention de toute l'équipe sur ce qui compte vraiment pour l'utilisateur.

---

#### Correction Exercice 2 — Piège de paradigme

**Modèle mental attendu**

Le vrai problème n'est pas visible dans les métriques que l'équipe célèbre — il est dans la métrique qu'elle mentionne en passant et qui chute : le taux de mise en relation réussie.

**Analyse**

❌ **Dark pattern de mesure — Vanity metrics comme anesthésiant** : le tableau de bord est dominé par des métriques de volume (visiteurs, pages vues) qui montent. Elles créent une sensation de succès qui masque le vrai problème : la fonctionnalité centrale du produit (la mise en relation) échoue de plus en plus.

**Métriques trompeuses**

- **Durée de session** : une session longue peut signifier un utilisateur engagé ou un utilisateur perdu dans l'interface. Sans contexte, cette métrique ne dit rien.
- **Taux de rebond** : un utilisateur qui trouve ce qu'il cherche rapidement et part aura un rebond "élevé" — ce qui est en réalité un succès. Le rebond ne dit pas "l'utilisateur est déçu", il dit "l'utilisateur n'a pas visité d'autre page".
- **Pages vues** : une métrique d'engagement d'une autre époque du web. Pour une plateforme de mise en relation, ce qui compte c'est la qualité de la correspondance, pas le nombre de pages consultées.

**KPIs vraiment pertinents pour une plateforme de mise en relation**

| KPI Primaire | Pourquoi |
|---|---|
| Taux de mise en relation réussie | C'est la raison d'être du produit |
| Temps moyen entre inscription et première mise en relation | Mesure la vélocité de valeur |
| Taux de répétition (clients qui reviennent) | Mesure la qualité des mises en relation |
| NPS post-mission | Mesure la satisfaction sur l'expérience complète |
| Taux d'activation (inscrits → profil complété → première mise en relation) | Identifie les points de blocage dans le funnel |

**Impact du vrai problème**

Le taux de mise en relation baisse (-3% en tendance) pendant que le trafic monte (+12%). Cela signifie que l'acquisition fonctionne mais que la valeur produit baisse. Si cette tendance continue : les utilisateurs arrivent, ne trouvent pas de valeur, partent, et parlent en mal du produit. Le CAC (coût d'acquisition) monte, la LTV baisse, le modèle économique se dégrade.

**Erreurs classiques**

- Célébrer la croissance du trafic comme un signe de santé produit
- Ne pas tracer la métrique de valeur centrale (la mise en relation) au même niveau de visibilité que les métriques de volume
- Traiter une baisse de -3% comme "stable" parce qu'elle est faible en valeur absolue — en tendance, c'est un signal d'alerte

**Feedback itératif — changement de paradigme en 1 phrase :**
Les vanity metrics montent presque toujours — ce qui révèle la santé d'un produit, c'est la métrique de valeur centrale, pas le volume qui l'entoure.

---

#### Correction Exercice 3 — Mini-cas réel

**Modèle mental attendu avant de commencer**

Hypothèses initiales probables : "Il faut augmenter l'engagement, rendre l'app plus addictive, pousser les utilisateurs vers les ressources professionnelles." Ces hypothèses sont dangereuses dans un contexte de santé mentale.

Hypothèse révisée : dans un contexte de santé mentale, "engagement" et "rétention" ne sont pas les bonnes boussoles. L'objectif n'est pas que les étudiants utilisent l'app le plus souvent possible — c'est qu'ils aillent mieux. Ces deux objectifs peuvent être contradictoires.

**Analyse des 3 problèmes principaux**

**Problème 1 — Rétention faible, non liée à l'utilité perçue**
La rétention à J+30 de 12% est critique. Mais le journal de bien-être est utilisé à 68% des sessions — les utilisateurs actifs trouvent de la valeur. Le problème est l'abandon précoce : beaucoup d'étudiants essaient une fois et ne reviennent pas. Hypothèse : l'app ne donne pas de signe de progression, donc l'utilisateur ne sait pas si "ça marche" et abandonne.

**Problème 2 — Absence de signal de progression**
Le feedback qualitatif "je ne sais pas si ça change quelque chose" est un signal fort. Les utilisateurs ne voient pas l'impact de leur pratique. En psychologie, le sentiment d'auto-efficacité (croire que ses actions ont un effet) est central à l'engagement dans une pratique de bien-être. L'absence de feedback de progression est un frein à la rétention.

**Problème 3 — Méfiance sur la confidentialité des données sensibles**
❌ **Dark pattern de confiance — Opacité sur la vie privée dans un contexte sensible** : "j'ai peur que ça soit enregistré" est un signal d'alerte critique. Si des étudiants en détresse n'osent pas accéder aux ressources professionnelles par peur de la surveillance, l'app amplifie la stigmatisation au lieu de la réduire. Ce n'est pas un problème de design superficiel — c'est un problème d'architecture de confiance.

**Système de suivi de performance adapté**

*Métriques à suivre (et par qui)*

| Fréquence | Métrique | Responsable |
|---|---|---|
| Quotidien (alertes) | DAU / MAU ratio (si chute brutale, signal de crise) | PM automatisé |
| Hebdomadaire | Rétention J+7 (par cohorte de lancement) | PM + Designer |
| Mensuel | Rétention J+30, progression perçue (auto-évaluation in-app) | PM + Designer + Partenaires universitaires |
| Trimestriel | NPS (uniquement sur utilisateurs actifs), entretiens qualitatifs (5-8) | Designer + Chercheur |

*Métriques à ne PAS utiliser — et pourquoi*

| Métrique à éviter | Raison |
|---|---|
| Durée de session | Une session longue peut signifier une crise, pas de l'engagement positif |
| Notifications envoyées vs. ouvertes | Optimiser les notifications push en santé mentale peut être intrusif et contre-productif |
| Streak (série de jours consécutifs) | Crée de l'anxiété et de la culpabilité si l'utilisateur "casse" sa série lors d'une mauvaise période |
| Comparaison sociale (rankings) | La comparaison en santé mentale est un facteur de risque avéré, notamment chez les étudiants |

❌ **Dark patterns à proscrire absolument** : gamification agressive (streaks, badges de performance en bien-être), notifications de relance culpabilisantes ("Tu n'as pas ouvert l'app depuis 3 jours — tu vas bien ?"), partage des données avec les universités sans consentement granulaire et informé.

**Feedback loops proposées**

*Boucle courte (hebdomadaire) — Apprentissage quantitatif*
- Analyser les données de rétention par cohorte et par fonctionnalité
- Identifier les moments d'abandon (à quelle étape, à quel moment de la journée)
- Règle : toute hypothèse de design inclut une métrique de validation et un délai de décision (ex : "si le taux de complétion du journal passe de 42% à 55% en 2 semaines, on généralise")

*Boucle moyenne (mensuelle) — Apprentissage qualitatif*
- 3 entretiens utilisateurs avec des étudiants actifs (recrutés via les partenaires universitaires, jamais directement via l'app)
- 2 entretiens avec des étudiants inactifs (pour comprendre l'abandon)
- Attention éthique au recrutement : ne pas recruter des étudiants en situation de crise aiguë pour des recherches — travailler avec des psychologues du campus pour définir les critères

*Boucle longue (trimestrielle) — Impact*
- Mesurer l'impact réel avec les services de santé universitaires : est-ce que le nombre d'étudiants qui consultent un psychologue augmente dans les universités partenaires ?
- C'est la métrique d'impact réel, pas une métrique produit — mais c'est ce que l'ONG et les universités veulent vraiment mesurer

**Propositions d'itération basées sur les feedbacks**

*Pour le problème de progression perçue :*
- Ajouter un "bilan hebdomadaire" optionnel (pas imposé) : "Comment vous êtes-vous senti cette semaine ?" en 3 questions
- Afficher un graphique de tendance personnel et privé : "Vos 4 dernières semaines" — uniquement visible par l'utilisateur, jamais partagé
- Formulation importante : "tendance de bien-être" pas "score de santé mentale" — la nuance linguistique est critique

*Pour la méfiance sur les données :*
- Revoir entièrement l'écran de confidentialité : "Ce qui reste sur votre téléphone" vs. "Ce qui est partagé avec l'université" — deux colonnes claires
- Ajouter un mode "anonyme" pour les exercices guidés : aucune donnée collectée, aucune progression sauvegardée
- Permettre l'export et la suppression des données en 2 clics
- Faire valider la politique de confidentialité par un juriste spécialisé en données de santé

**Erreurs classiques**

- Appliquer des mécaniques d'engagement issues des apps grand public (streaks, notifications push) dans un contexte de santé mentale — elles peuvent faire du mal
- Mesurer uniquement ce qui est facile à mesurer (clics, sessions) plutôt que ce qui compte (est-ce que les utilisateurs vont mieux ?)
- Partager des données agrégées avec les universités sans avoir expliqué exactement ce qui est partagé, à qui, et comment — même les données anonymisées peuvent être sensibles dans ce contexte

**Feedback itératif — changement de paradigme en 1 phrase :**
Dans un produit de santé mentale, la vraie métrique de succès n'est pas l'engagement de l'utilisateur avec l'app — c'est si l'utilisateur va mieux, même si cela signifie qu'il a moins besoin de l'app.

---

## Synthèse — Tableau de bord des concepts

| Concept | Erreur la plus fréquente | Biais cognitif principal | KPI pivot |
|---|---|---|---|
| Roadmap UX & Product | Confondre liste de features et stratégie | HIPPO effect + biais de planification | Taux de complétion objectif utilisateur |
| Priorisation RICE/MoSCoW | Appliquer mécaniquement sans données ni éthique | Biais de disponibilité + biais d'imitation | Score RICE pondéré par l'impact éthique |
| Agile & Design | Traiter le design comme une étape avant le sprint | Biais de confirmation (valider ses maquettes) | Vélocité réelle (features utiles livrées) |
| Suivi de performance | Célébrer les vanity metrics, ignorer la North Star | Biais de confirmation + heuristique de représentativité | North Star Metric + rétention à J+30 |

---

*Ces exercices ont été conçus pour être réutilisés dans des ateliers d'équipe. Chaque mini-cas peut être adapté au contexte de votre organisation. Les dimensions éthiques et inclusives ne sont pas optionnelles — elles font partie intégrante de la pratique professionnelle du Product Design.*
