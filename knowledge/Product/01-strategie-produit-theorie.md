# Section 1 — Stratégie produit & Product Thinking

> Fichier théorie uniquement. Pas d'exercices ici.
> Dernière mise à jour : 2026-04-24

---

## Table des matières

1. [Vision & Mission produit](#1-vision--mission-produit)
2. [Modèles business & frameworks PM](#2-modèles-business--frameworks-pm)
3. [Objectifs UX & KPIs business](#3-objectifs-ux--kpis-business)
4. [Priorisation OKR-driven](#4-priorisation-okr-driven)
5. [Segmentation & Personas dynamiques](#5-segmentation--personas-dynamiques)
6. [Analyse de feedbacks & Insights](#6-analyse-de-feedbacks--insights)
7. [Benchmark & Veille stratégique](#7-benchmark--veille-stratégique)
8. [Roadmap produit & UX](#8-roadmap-produit--ux)
9. [Éthique & UX responsable](#9-éthique--ux-responsable)

---

## 1. Vision & Mission produit

### Modèle mental

La vision décrit le **monde que votre produit veut créer** — elle est intemporelle, aspirationnelle. La mission décrit **ce que fait concrètement le produit aujourd'hui** pour avancer vers cette vision. Sans vision claire, chaque décision UX devient arbitraire.

### Analogie stable

Imaginez une boussole (vision) et un itinéraire GPS (mission). La boussole indique le nord magnétique absolu — elle ne change pas. L'itinéraire GPS recalcule selon le terrain, les conditions, les ressources disponibles. Un produit sans boussole finit par avancer vite... dans la mauvaise direction.

### Méthodologie & Bonnes pratiques

**Construire une vision actionnable :**

1. **Identifier le problème de fond** — Pas « les gens veulent une app de notes » mais « les gens perdent leurs idées parce que capturer est trop lent ».
2. **Définir la valeur unique** — Ce que vous résolvez mieux que quiconque, pour qui, et pourquoi maintenant.
3. **Formuler en 1 phrase** — La vision doit tenir dans une phrase que chaque membre de l'équipe peut répéter sans notes.
4. **Tester la stabilité** — Si la vision devient fausse dans 2 ans selon des changements normaux du marché, elle est trop tactique.
5. **Cascader vers la mission** — La mission traduit la vision en périmètre d'action actuel (marché cible, capacités disponibles, horizon temporel).

**Positionnement & Différenciation :**

Le positionnement répond à : *Pour [cible], [produit] est le [catégorie] qui [bénéfice distinctif] parce que [preuve]*. Ce n'est pas un slogan marketing — c'est un filtre décisionnel. Chaque fonctionnalité UX doit pouvoir se justifier par rapport à ce positionnement.

| Dimension | Question clé | Piège fréquent |
|---|---|---|
| Cible | Pour qui prioritairement ? | Vouloir cibler tout le monde |
| Catégorie | Dans quel univers mental ? | Créer une catégorie inexistante |
| Bénéfice | Quelle transformation ? | Lister des features, pas des bénéfices |
| Preuve | Pourquoi croire ? | Promesses non démontrables |

### Correction modèle mental

❌ **Idée reçue** : « La vision, c'est pour le marketing. En UX, on se concentre sur les utilisateurs. »

✅ **Approche correcte** : La vision est le premier filtre UX. Elle détermine quels utilisateurs prioriser, quels problèmes résoudre, et quels trade-offs accepter. Un designer sans accès à la vision prend des décisions tactiquement correctes mais stratégiquement incohérentes.

**KPI impacté** : Taux de rétention à 90 jours (un produit sans vision cohérente génère des features contradictoires qui brouillent la valeur perçue), NPS (les utilisateurs recommandent ce qu'ils comprennent).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Task success rate (les tâches correspondent-elles à la vision ?) | Taux de rétention M3, M6, M12 |
| NPS (valeur perçue alignée sur la promesse) | Part de marché dans le segment cible |
| Time-to-value (délai avant que l'utilisateur perçoive la valeur) | Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC) |

### Points éthiques & inclusivité

- Une vision centrée sur la croissance uniquement ❌ peut conduire à des décisions qui exploitent les utilisateurs. Intégrer explicitement le bénéfice utilisateur dans la formulation de la vision.
- La différenciation ne doit pas reposer sur des mécanismes d'exclusion (barrières tarifaires, linguistiques, cognitives non justifiées).
- Vérifier que la « cible » définie dans le positionnement n'exclut pas implicitement des groupes (seniors, personnes en situation de handicap, non-natifs numériques).

---

## 2. Modèles business & frameworks PM

### Modèle mental

Un framework business est une **carte de la réalité du produit** — pas la réalité elle-même. Il sert à aligner l'équipe sur les hypothèses critiques, identifier ce qui n'a pas encore été validé, et concentrer les efforts UX là où l'incertitude est la plus haute.

### Analogie stable

Un canvas ressemble à un tableau de bord d'avion. Chaque instrument (segment clients, sources de revenus, proposition de valeur) mesure une dimension différente. Un pilote n'ignore pas les instruments sous prétexte que « l'avion vole bien pour l'instant » — il les consulte précisément parce que les problèmes se détectent avant qu'ils deviennent visibles.

### Méthodologie & Bonnes pratiques

#### Lean Canvas (Ash Maurya)

Adapté du Business Model Canvas pour les startups et produits early-stage. Priorité aux hypothèses risquées.

| Bloc | Question | Lien UX |
|---|---|---|
| Problème | Quels 3 problèmes résolvez-vous ? | Jobs-to-be-done, pain points |
| Segments clients | Qui a ce problème en priorité ? | Proto-personas, early adopters |
| Proposition de valeur unique | Pourquoi vous, pas un concurrent ? | Positionnement UX, onboarding |
| Solution | Comment résolvez-vous le problème ? | Features, parcours principaux |
| Canaux | Comment atteignez-vous vos clients ? | UX du premier contact, acquisition |
| Sources de revenus | Comment monétisez-vous ? | Modèles de friction UX (freemium, paywall) |
| Structure de coûts | Quels sont vos coûts critiques ? | Priorisation des features à fort ROI |
| Métriques clés | Comment mesurez-vous le succès ? | KPIs UX et business alignés |
| Avantage injuste | Ce que les concurrents ne peuvent pas copier | Différenciation UX durable |

**Usage pratique** : Remplir le Lean Canvas en équipe, identifier les 3 hypothèses les plus risquées, et concevoir les premières recherches utilisateurs pour les tester.

#### Business Model Canvas (Osterwalder)

Plus complet, adapté aux produits matures. Intègre la dimension opérationnelle (partenaires clés, ressources clés, activités clés).

**Différence clé avec le Lean Canvas** : Le BMC part de la réalité existante pour l'optimiser. Le Lean Canvas part de l'incertitude pour la réduire.

#### Value Proposition Canvas (Osterwalder & Pigneur)

Zoom sur l'intersection entre le profil client et la proposition de valeur. Outil directement opérationnel pour le design UX.

```
PROFIL CLIENT                    PROPOSITION DE VALEUR
─────────────────────            ────────────────────────────
Jobs-to-be-done          ←→      Produits & services
(Ce que l'utilisateur            (Ce que vous offrez)
essaie d'accomplir)

Pains                    ←→      Pain relievers
(Frustrations, obstacles)        (Comment vous réduisez les pains)

Gains                    ←→      Gain creators
(Résultats désirés)              (Comment vous créez de la valeur)
```

**Le fit** est atteint quand vos pain relievers et gain creators correspondent précisément aux pains et gains de vos utilisateurs. C'est le travail du UX researcher de valider ce fit empiriquement.

### Comparaison d'approches

| Framework | Phase idéale | Forces | Limites |
|---|---|---|---|
| Lean Canvas | Découverte, validation | Rapide, centré incertitude | Trop simpliste pour produits complexes |
| Business Model Canvas | Croissance, optimisation | Vue systémique complète | Verbeux, moins actionnable en early-stage |
| Value Proposition Canvas | Design, product-market fit | Directement relié au design | Ne couvre pas le modèle opérationnel |

### Correction modèle mental

❌ **Idée reçue** : « Ces frameworks sont des outils de stratégie business, pas de UX. »

✅ **Approche correcte** : Chaque bloc d'un canvas a une implication UX directe. Les « Jobs-to-be-done » définissent les parcours à concevoir. Les « Pains » définissent les problèmes à résoudre dans l'interface. Les « Canaux » définissent les contextes d'usage à anticiper.

**KPI impacté** : Product-market fit score (Sean Ellis), taux d'activation (premier usage de valeur), taux de complétion des flux critiques.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux de complétion du flux de valeur core | Product-market fit score (>40% « très déçus » si supprimé) |
| Time-to-value (délai avant 1er « aha moment ») | MRR/ARR, taux de conversion essai → payant |
| SUS sur le flux principal | Taux de churn et reasons for churn |

### Points éthiques & inclusivité

- Le modèle de revenus ❌ basé sur la capture d'attention maximale (ad revenue) crée des incitations à concevoir des expériences addictives. Préférer des modèles alignés sur la valeur délivrée (abonnement, succès client).
- Inclure dans le Value Proposition Canvas des segments souvent ignorés : utilisateurs avec handicap, faible littératie numérique, connexion lente.
- Auditer les « Gain creators » pour s'assurer qu'ils ne créent pas de la valeur pour certains utilisateurs en pénalisant d'autres (ex : personnalisation algorithmique qui crée des bulles de filtre).

---

## 3. Objectifs UX & KPIs business

### Modèle mental

Les KPIs sont des **signaux** — ils indiquent qu'un problème existe ou a été résolu, mais ils n'expliquent pas pourquoi. La combinaison de métriques UX (comportement) et business (conséquence financière) permet de comprendre la chaîne causale de la valeur produit.

### Analogie stable

Imaginez un médecin qui mesure uniquement le poids d'un patient sans jamais demander comment il se sent. Les métriques business sans métriques UX donnent le même résultat : vous savez que quelque chose va mal, mais pas où ni pourquoi. Le duo KPI UX + KPI business est l'équivalent d'un bilan complet : mesures objectives + ressenti subjectif.

### Méthodologie & Bonnes pratiques

#### Les métriques UX fondamentales

**NPS — Net Promoter Score**
- Mesure : « Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez ce produit ? »
- Calcul : % Promoteurs (9-10) − % Détracteurs (0-6)
- Seuil acceptable : > 30 (bon), > 50 (excellent), > 70 (exceptionnel)
- Limite critique : mesure l'intention de comportement, pas le comportement réel. À croiser avec des données comportementales.

**CSAT — Customer Satisfaction Score**
- Mesure : Satisfaction sur une interaction spécifique (1-5 ou 1-10)
- Usage : Post-interaction (support, onboarding, achat)
- Limite : Très contextuel, difficile à comparer entre produits

**SUS — System Usability Scale**
- Mesure : 10 questions alternées positives/négatives, score de 0 à 100
- Seuils : < 51 (inacceptable), 51-67 (médiocre), 68 (moyen), 73-85 (bon), > 85 (excellent)
- Avantage : Validé scientifiquement, rapide (2 min), comparable entre produits et versions
- Usage idéal : Avant/après une refonte, benchmarking concurrentiel

**Task Success Rate**
- Mesure : % d'utilisateurs qui complètent une tâche définie sans aide
- Standard industrie : > 78% pour les tâches critiques
- Variantes : Succès complet / partiel / échec, avec ou sans erreurs

**Time-on-Task**
- Mesure : Durée pour compléter une tâche
- Piège ❌ : Plus de temps = plus d'engagement. Souvent faux — plus de temps peut signifier plus de confusion.
- Usage correct : Comparer à une baseline ou à un concurrent, pas en valeur absolue

#### Les métriques business clés en UX

| Métrique | Définition | Lien UX direct |
|---|---|---|
| Taux de conversion | % visiteurs → action souhaitée | Architecture de l'information, CTA, friction |
| Taux de rétention | % utilisateurs actifs après N jours | Valeur perçue, habitude, engagement |
| Churn rate | % utilisateurs qui arrêtent | Frustration, désalignement valeur/promesse |
| LTV (Lifetime Value) | Revenu total par client | Satisfaction cumulée, NPS, engagement long terme |
| CAC (Customer Acquisition Cost) | Coût pour acquérir 1 client | Expérience première impression, onboarding |
| ROI UX | (Gains UX − Coûts UX) / Coûts UX | Tous les KPIs UX convertis en $ |

#### Calculer le ROI UX

La formule de base : `ROI UX = (Amélioration de conversion × Revenu moyen × Volume) − Coût du projet UX`

Exemple concret : Un audit UX coûte 15 000€. Il améliore le taux de conversion du checkout de 2,1% à 2,8% (+0,7 point). Volume mensuel : 50 000 visiteurs. Panier moyen : 85€.
- Gain mensuel : 50 000 × 0,007 × 85 = 29 750€
- ROI sur 6 mois : ((29 750 × 6) − 15 000) / 15 000 = **1 090%**

### Correction modèle mental

❌ **Idée reçue** : « Un bon NPS suffit à prouver la qualité de l'expérience. »

✅ **Approche correcte** : Le NPS mesure l'intention de recommandation globale, pas la qualité de l'expérience. Un utilisateur peut avoir un NPS élevé malgré une interface difficile parce que le produit résout un problème critique. Croiser NPS + SUS + Task Success Rate pour une image complète.

**KPI impacté** : Si vous optimisez uniquement le NPS, vous risquez d'ignorer des problèmes d'usabilité critiques qui n'affectent pas encore la satisfaction globale mais créent du churn latent.

### KPIs liés

| Métrique UX | Métrique business | Corrélation |
|---|---|---|
| SUS score | Taux de conversion | Forte (interface difficile = abandon) |
| Task success rate | Taux de complétion de commande | Directe |
| NPS | Taux de rétention M12 | Forte (promoteurs churne 2× moins) |
| Time-to-value | CAC | Inverse (onboarding lent = coût acquisition gaspillé) |
| CSAT support | Coût support | Directe (CSAT bas = plus de tickets) |

### Points éthiques & inclusivité

- Les métriques d'engagement (DAU, temps passé) ❌ peuvent masquer des comportements compulsifs ou anxieux. Préférer des métriques de valeur délivrée (tâches accomplies, objectifs atteints).
- Segmenter les KPIs par groupe démographique pour détecter des inégalités d'expérience : un SUS global de 75 peut cacher un SUS de 55 pour les utilisateurs seniors.
- Le « taux de rétention » ne distingue pas rétention par valeur vs. rétention par friction (utilisateurs qui restent parce que migrer est difficile). L'éthique exige de mesurer les deux.

---

## 4. Priorisation OKR-driven

### Modèle mental

Les OKRs (Objectives & Key Results) sont un **système de traduction** : ils traduisent l'ambition stratégique en résultats mesurables, et ces résultats en décisions UX concrètes. La priorisation OKR-driven signifie que chaque feature, chaque refonte, chaque test commence par la question : « Quel OKR cette décision adresse-t-elle, et comment ? »

### Analogie stable

Imaginez un orchestre symphonique sans partition commune. Chaque musicien joue excellemment sa partie, mais le résultat est du bruit. Les OKRs sont la partition : ils définissent ce que chaque instrument (équipe produit, design, data) doit jouer, à quel moment, pour créer quelque chose de cohérent.

### Méthodologie & Bonnes pratiques

#### Structure d'un OKR

```
OBJECTIF (qualitatif, inspirant, temporel)
  ↓
Key Result 1 (mesurable, avec baseline et cible)
Key Result 2 (mesurable, avec baseline et cible)
Key Result 3 (mesurable, avec baseline et cible)
```

**Exemple UX-Product** :
- Objectif : Devenir la référence en onboarding pour les outils SaaS B2B
  - KR1 : Amener le Time-to-Value de 14 jours à 3 jours d'ici Q3
  - KR2 : Augmenter le taux d'activation (complétion onboarding) de 32% à 65%
  - KR3 : Atteindre un NPS onboarding de 45 (baseline : 28)

#### Relier les décisions UX aux OKRs

| Décision UX | OKR adressé | KR impacté | Méthode de mesure |
|---|---|---|---|
| Simplifier le formulaire d'inscription | Réduire friction onboarding | KR2 (taux activation) | A/B test taux de complétion |
| Ajouter un assistant guided tour | Accélérer time-to-value | KR1 (time-to-value) | Mesure cohort analysis |
| Repenser la page de bienvenue | NPS onboarding | KR3 (NPS) | Survey post-onboarding |

#### Frameworks de priorisation complémentaires

**RICE Score** : (Reach × Impact × Confidence) / Effort
- Reach : combien d'utilisateurs touchés par période
- Impact : effet sur la métrique cible (0,25 = minimal → 3 = massif)
- Confidence : % de certitude sur les estimations
- Effort : en semaines-personne

**ICE Score** : Impact × Confidence × Ease (version simplifiée pour early-stage)

**MoSCoW** : Must have / Should have / Could have / Won't have — utile pour les sprints, moins pour la priorisation stratégique

### Comparaison d'approches de priorisation

| Méthode | Forces | Faiblesses | Idéale pour |
|---|---|---|---|
| OKR-driven | Alignement stratégique | Nécessite OKRs bien formulés | Décisions à impact moyen/long terme |
| RICE | Quantitatif, comparaison facile | Subjectivité des estimations | Backlog produit dense |
| ICE | Rapide, accessible | Moins rigoureux | Équipes early-stage, workshops |
| MoSCoW | Clarté des obligations | Pas de nuance entre « must haves » | Sprint planning, MVP scope |
| Kano Model | Centre sur la satisfaction utilisateur | Long à instrumenter | Décisions features vs. UX polish |

### Correction modèle mental

❌ **Idée reçue** : « La priorisation, c'est la responsabilité du Product Manager. Le designer exécute. »

✅ **Approche correcte** : Le designer est le gardien de la faisabilité expérientielle. Sans input UX sur la priorisation, des features techniquement livrables peuvent être des désastres pour l'utilisateur. Le designer doit pouvoir argumenter en langage OKR pour influencer la priorisation.

**KPI impacté** : Taux de features adoptées post-lancement (les features non utilisées révèlent des erreurs de priorisation), vélocité de l'équipe (moins de retravailler si bien priorisé dès le départ).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Feature adoption rate | Revenu généré par feature livrée |
| Task success rate des nouvelles features | Impact OKR mesuré post-lancement |
| SUS après chaque release | NPS delta entre releases |

### Points éthiques & inclusivité

- Les OKRs de croissance pure ❌ (ex : « augmenter le DAU de 30% ») peuvent pousser vers des dark patterns d'engagement. Compléter avec des OKRs de qualité d'expérience et de bien-être utilisateur.
- Inclure explicitement des KRs d'accessibilité dans les OKRs produit (ex : « Atteindre WCAG 2.1 AA sur 100% des flux critiques d'ici Q4 »).
- Évaluer l'impact différentiel des décisions de priorisation sur les utilisateurs marginalisés ou en situation de fragilité.

---

## 5. Segmentation & Personas dynamiques

### Modèle mental

Un persona n'est pas un portrait sociologique — c'est un **modèle de comportement et de motivation**. Sa valeur est de rendre concrète et mémorable une tendance comportementale identifiée dans les données. Un persona qui ne change pas quand le comportement utilisateur change est devenu une fiction.

### Analogie stable

Les personas sont comme des prévisions météo : utiles pour planifier, mais qui perdent en validité si on ne les met pas à jour. Un météorologue ne consulte pas la prévision de la semaine dernière pour décider si vous devez prendre un parapluie aujourd'hui. De même, un persona de 2022 ne devrait pas guider les décisions de design de 2026.

### Méthodologie & Bonnes pratiques

#### Structure d'un persona riche

Un persona efficace contient :

1. **Profil psychographique** — Motivations profondes, valeurs, anxiétés (pas l'âge et la profession uniquement)
2. **Jobs-to-be-done** — Ce que l'utilisateur essaie d'accomplir fonctionnellement, émotionnellement, socialement
3. **Comportements observés** — Données comportementales réelles (analytics, sessions enregistrées)
4. **Points de friction identifiés** — Où ça coince dans le parcours actuel
5. **Citations réelles** — Verbatims d'interviews pour humaniser
6. **Métriques associées** — Volume de ce segment, NPS, rétention, valeur

#### Segmentation psychographique vs. démographique

| Dimension | Segmentation démographique | Segmentation psychographique |
|---|---|---|
| Variables | Âge, genre, localisation, revenus | Motivations, attitudes, valeurs, comportements |
| Utilité pour le design | Faible (l'âge ne prédit pas le comportement UX) | Forte (les motivations prédisent les choix d'interface) |
| Source de données | CRM, registres | Interviews, enquêtes, analytics comportementales |
| Exemple | Femmes 25-35 ans, CSP+ | Utilisateurs « efficacité-first » qui veulent zéro friction |

#### Intégration de l'IA pour les personas dynamiques

L'IA permet de passer des personas statiques (mise à jour annuelle) aux **personas adaptatifs** :

- **Clustering comportemental automatique** : les algorithmes de clustering (k-means, DBSCAN) identifient automatiquement des segments comportementaux dans les logs utilisateurs. L'équipe UX interprète et nomme ces clusters.
- **Mise à jour continue** : un persona peut être relié à un segment de données vivant. Quand le comportement du segment évolue (nouvelles features adoptées, changement de parcours), le persona est alerté pour révision.
- **Génération de proto-personas** : en early-stage, l'IA peut générer des proto-personas à partir d'études sectorielles et de données concurrentielles publiques — à valider rapidement par de vraies interviews.
- **Détection de sous-segments émergents** : l'IA détecte quand un comportement atypique devient statistiquement significatif et suggère la création d'un nouveau persona.

**Limites de l'IA sur les personas** : L'IA détecte des patterns comportementaux mais ne comprend pas les motivations profondes. L'interprétation qualitative reste humaine.

### Correction modèle mental

❌ **Idée reçue** : « Plus on a de personas, mieux on couvre les utilisateurs. »

✅ **Approche correcte** : 3 à 5 personas bien documentés valent mieux que 15 personas superficiels. L'excès de personas crée une paralysie décisionnelle (« pour quel persona on conçoit ? ») et des interfaces qui essaient de tout faire pour tout le monde — et ne fonctionnent vraiment bien pour personne.

**KPI impacté** : Task success rate (trop de personas = interfaces surchargées = confusion), taux de conversion (personas clairs = messages et CTA ciblés = meilleure conversion).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Task success rate par segment | Taux de conversion par segment |
| NPS segmenté par persona | LTV par segment (certains personas ont 3× la LTV) |
| SUS par profil d'utilisateur | Taux d'activation par cohorte démographique |

### Points éthiques & inclusivité

- Les personas basés uniquement sur les early adopters ❌ excluent structurellement les utilisateurs moins représentés dans les données initiales (seniors, non-natifs numériques, utilisateurs à faibles revenus).
- Éviter les personas stéréotypés qui renforcent des biais (ex : persona « tech-savvy » systématiquement masculin).
- Inclure au moins un persona de fragilité (utilisateur avec handicap, sous stress cognitif, connexion limitée) dans tout projet de design.
- Les algorithmes de clustering IA ❌ peuvent reproduire les biais des données d'entraînement. Auditer les segments générés par IA pour détecter les sous-représentations.

---

## 6. Analyse de feedbacks & Insights

### Modèle mental

Les feedbacks utilisateurs sont des **symptômes**, pas des diagnostics. Quand un utilisateur dit « je veux un bouton de recherche plus grand », le symptôme est « difficulté à trouver ce qu'il cherche ». L'insight est « l'architecture de l'information ne correspond pas au modèle mental de recherche de cet utilisateur ». Traiter le symptôme sans comprendre le diagnostic produit des solutions superficielles.

### Analogie stable

Analyser des feedbacks sans les synthétiser ressemble à lire des centaines de critiques restaurant une par une sans jamais chercher les thèmes récurrents. La valeur n'est pas dans la critique individuelle mais dans le pattern : « 73% des critiques négatives mentionnent le temps d'attente » — voilà un insight actionnable.

### Méthodologie & Bonnes pratiques

#### Sources de feedbacks et leur nature

| Source | Type de signal | Volume | Biais principal | Priorité d'analyse |
|---|---|---|---|---|
| Tickets support | Problèmes bloquants | Moyen | Biais vers les cas extrêmes | Très haute |
| Emails spontanés | Opinions fortes + / − | Faible | Biais de représentation | Haute |
| Enquêtes in-app | Satisfaction contextuelle | Élevé | Biais de désirabilité sociale | Haute |
| App store reviews | Satisfaction globale | Très élevé | Biais d'opinion forte | Moyenne |
| Forums & communautés | Usage réel, workarounds | Variable | Biais population spécifique | Moyenne |
| Réseaux sociaux | Sentiment public | Très élevé | Biais polémique | Faible-Moyenne |
| Sessions enregistrées | Comportement réel | Très élevé | Aucun (comportement observé) | Très haute |

#### Processus d'analyse en 5 étapes

1. **Collecte centralisée** — Agréger toutes les sources dans un outil unique (Notion, Airtable, ou plateforme dédiée type Dovetail, EnjoyHQ).
2. **Tagging & Catégorisation** — Créer une taxonomie stable : thème (navigation, performance, contenu), sentiment (positif/négatif/neutre), fréquence, criticité.
3. **Clustering** — Regrouper les feedbacks similaires pour identifier les patterns dominants.
4. **Insight extraction** — Formuler l'insight : ce que les utilisateurs cherchent à accomplir, ce qui les bloque, l'écart entre attente et réalité.
5. **Priorisation par impact** — Croiser fréquence × criticité × effort pour prioriser les insights à adresser.

#### Intégration de l'IA dans l'analyse de feedbacks

**Sentiment analysis automatique** :
- Les modèles NLP (BERT, GPT-based) classifient automatiquement le sentiment de chaque feedback.
- Précision typique sur des feedbacks produit : 85-92%.
- Limite : L'ironie, le sarcasme et les nuances culturelles restent difficiles à détecter.

**Clustering automatique** :
- Identifier automatiquement les thèmes émergents sans taxonomie prédéfinie.
- Utile pour les nouvelles sources de feedbacks ou les volumes très élevés (>10 000 items).

**Détection de tendances** :
- L'IA peut alerter quand un thème de feedback augmente significativement (ex : +40% de mentions du mot « lent » en 7 jours après une release).

**Limites de l'IA dans l'analyse de feedbacks** :
- L'IA peut identifier que 30% des feedbacks parlent de « navigation difficile » mais ne peut pas expliquer pourquoi le modèle mental des utilisateurs diffère de l'architecture prévue.
- La décision d'action reste humaine — l'IA priorise mais ne comprend pas le contexte stratégique.

### Correction modèle mental

❌ **Idée reçue** : « Les utilisateurs qui se plaignent sont une minorité non représentative. »

✅ **Approche correcte** : Pour chaque utilisateur qui se plaint, environ 26 ont le même problème sans le signaler (règle empirique du service client). Les feedbacks négatifs sont un signal d'iceberg. Les ignorer parce qu'ils représentent 2% des retours peut signifier ignorer un problème vécu par 50% des utilisateurs silencieux.

**KPI impacté** : Taux de churn (les utilisateurs silencieux qui churne ne l'ont pas annoncé), taux de tickets support (augmente si les feedbacks signalant des problèmes sont ignorés).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Volume de feedbacks par thème (trending) | Taux de churn par segment (corrélé aux feedbacks négatifs) |
| Sentiment score moyen par parcours | Coût support (baisse quand les insights sont adressés) |
| Taux de résolution des problèmes signalés | NPS delta après correction d'un problème identifié |

### Points éthiques & inclusivité

- Respecter scrupuleusement le RGPD dans la collecte et l'analyse de feedbacks. Les verbatims doivent être anonymisés avant tout traitement IA.
- Les feedbacks de certains groupes (non-natifs de la langue, utilisateurs avec handicap) peuvent être sous-représentés ou mal interprétés par les modèles NLP. Effectuer une validation manuelle sur ces sous-groupes.
- Ne pas biaiser l'analyse en cherchant uniquement les confirmations d'hypothèses existantes (biais de confirmation). Inclure un processus de devil's advocate.

---

## 7. Benchmark & Veille stratégique

### Modèle mental

Le benchmark n'est pas de la copie — c'est de la **calibration**. Il permet de savoir où vous êtes par rapport au marché, quelles conventions UX vos utilisateurs ont déjà intégrées (et qu'il ne faut pas casser), et où se trouvent les espaces d'innovation non exploités.

### Analogie stable

Le benchmark ressemble à l'étalonnage d'un instrument de mesure. Un thermomètre non étalonné peut indiquer 37°C alors que la température réelle est 38,5°C. Sans benchmark, votre évaluation de la qualité de votre UX est relative à rien. Avec benchmark, vous savez si votre SUS de 72 est bon (si la concurrence est à 65) ou décevant (si la concurrence est à 80).

### Méthodologie & Bonnes pratiques

#### Types de benchmark

| Type | Description | Méthode | Résultat |
|---|---|---|---|
| Benchmark concurrentiel direct | Comparer aux produits qui résolvent le même problème | Analyse experte + tests utilisateurs comparatifs | Gaps et forces relatifs |
| Benchmark d'industrie | Comparer aux standards du secteur | SUS, NPS, Task success rate moyens du secteur | Positionnement sectoriel |
| Benchmark inspirationnel | Comparer à des leaders UX d'autres industries | Analyse heuristique, patterns UI | Sources d'innovation |
| Benchmark de régression | Comparer à soi-même dans le temps | Mesure des mêmes KPIs avant/après release | Suivi de progression |

#### Processus de veille stratégique continue

1. **Définir le périmètre** — Concurrents directs (même problème, même cible), indirects (même besoin, cible différente), et substituts (solutions alternatives non digitales).
2. **Instrumenter la veille** — Configurer des alertes automatiques (Google Alerts, Mention, SparkToro) sur les noms de concurrents, les termes clés du secteur, les changements de design.
3. **Analyser les releases concurrentes** — Chaque mise à jour significative d'un concurrent est une donnée sur l'évolution du marché.
4. **Benchmarker les KPIs** — Utiliser des études sectorielles (Nielsen Norman Group, Baymard Institute pour l'e-commerce, etc.) pour calibrer vos métriques.
5. **Identifier les opportunités** — Problèmes récurrents chez les concurrents (reviews négatives, feedbacks publics) = opportunités de différenciation.

#### Intégration de l'IA dans la veille stratégique

- **Alertes IA** : Les outils de veille modernes (ex : Crayon, Klue) utilisent l'IA pour détecter automatiquement les changements sur les sites et apps concurrentes (nouvelles pages, nouveaux flows, changements de pricing).
- **Analyse de reviews concurrentes** : L'IA peut analyser les app store reviews des concurrents pour identifier leurs pain points récurrents — une source d'insights gratuite sur les opportunités de marché.
- **Détection de tendances UX** : Surveillance automatique des publications de recherche (Nielsen NN/g, ACM CHI) et des tendances de design (Dribbble, Awwwards) pour anticiper les évolutions.

### Correction modèle mental

❌ **Idée reçue** : « Benchmarker les concurrents risque de nous faire copier leurs erreurs. »

✅ **Approche correcte** : Le benchmark ne sert pas à copier — il sert à comprendre les conventions que vos utilisateurs ont déjà intégrées. Si 90% des apps de votre secteur utilisent une navigation bottom bar sur mobile, la briser n'est pas de l'innovation, c'est de la friction gratuite. L'innovation UX commence par comprendre ce qui doit rester conventionnel.

**KPI impacté** : SUS (les conventions brisées inutilement dégradent le SUS), learnability (temps pour maîtriser l'interface sur un produit qui suit les conventions du secteur est plus court).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| SUS relatif (vs. concurrents) | Part de marché dans le segment |
| Task success rate comparatif | Taux de conversion vs. benchmark sectoriel |
| Temps d'onboarding vs. concurrents | Coût d'acquisition (benchmark industrie) |

### Points éthiques & inclusivité

- Le benchmark concurrentiel ne doit pas conduire à normaliser des dark patterns sectoriels. Si tous les concurrents utilisent un opt-out trompeur pour les newsletters, la bonne pratique éthique est de ne pas les imiter.
- Surveiller les tendances d'accessibilité comme des indicateurs de progrès à adopter, pas seulement les tendances visuelles.
- Inclure dans la veille les innovations de marchés émergents et les besoins de populations sous-représentées dans les analyses concurrentielles habituelles.

---

## 8. Roadmap produit & UX

### Modèle mental

Une roadmap n'est pas un planning de développement — c'est un **outil de communication sur les priorités et les hypothèses**. Elle dit : « Voici ce que nous croyons avoir le plus d'impact pour nos utilisateurs et notre business, dans cet ordre, avec ces contraintes. » Elle doit évoluer quand les hypothèses sont invalidées.

### Analogie stable

La roadmap ressemble à l'itinéraire d'une expédition scientifique. Vous avez un plan de départ, mais vous savez que les découvertes en chemin vont modifier ce plan. Un bon chef d'expédition ne jette pas l'itinéraire à chaque obstacle — il l'ajuste en maintenant l'objectif final. Une roadmap trop rigide est un symptôme d'organisation qui valorise la certitude artificielle sur l'apprentissage réel.

### Méthodologie & Bonnes pratiques

#### Structure d'une roadmap centrée impact

| Dimension | Question | Comment le mesurer |
|---|---|---|
| Impact utilisateur | Ce changement améliore-t-il significativement l'expérience ? | Task success rate, SUS, NPS |
| Impact business | Ce changement adresse-t-il un OKR clé ? | Conversion, rétention, revenu |
| Effort estimé | Quel est le coût de livraison ? | Story points, semaines-équipe |
| Dépendances | Qu'est-ce qui bloque ou est bloqué ? | Diagramme de dépendances |
| Risques UX | Quels problèmes d'expérience peuvent émerger ? | Prototypage, tests rapides |

#### Types de roadmap selon l'horizon temporel

- **Now (0-3 mois)** : Commitments fermes, spécifiés, en cours d'exécution
- **Next (3-6 mois)** : Priorités confirmées mais pas encore spécifiées
- **Later (6-18 mois)** : Directions stratégiques, hypothèses à valider
- **Beyond** : Vision, non engagée

**Format recommandé** : Roadmap orientée outcomes (résultats) plutôt que features. Au lieu de « Refonte du checkout », écrire « Réduire le taux d'abandon checkout de 68% à 45% ». Cela laisse de la place à la solution optimale.

#### Intégration de l'IA dans la roadmap

- **Prévisions d'impact** : Les modèles IA peuvent prédire l'impact probable d'une feature sur les KPIs cibles en se basant sur les données historiques de releases similaires.
- **Détection de dépendances cachées** : L'IA peut analyser les patterns de bug reports et les données techniques pour identifier des dépendances non documentées.
- **Simulation de scénarios** : Modéliser différentes séquences de priorisation et leur impact projeté sur les OKRs.
- **Priorisation assistée** : Les outils de roadmap modernes (Productboard, Jira Advanced Roadmaps) utilisent l'IA pour scorer automatiquement les items du backlog selon des critères définis.

#### Roadmap UX spécifique

En parallèle de la roadmap produit, une roadmap UX tracks :

- Amélioration de la qualité d'expérience sur les parcours existants
- Investissements en recherche utilisateur
- Améliorations d'accessibilité
- Dette UX à résorber
- Travaux d'exploration et de prototypage en avance de phase

### Correction modèle mental

❌ **Idée reçue** : « La roadmap est définie par le business. Le UX s'adapte. »

✅ **Approche correcte** : Le UX doit alimenter la roadmap avec des données (insights utilisateurs, métriques d'expérience, dette UX identifiée). Les meilleures roadmaps sont le produit d'une négociation triangulaire entre les contraintes business, les besoins utilisateurs, et les contraintes techniques. Exclure la voix UX de ce processus produit des roadmaps déconnectées de la réalité d'usage.

**KPI impacté** : Feature adoption rate (les features conçues sans input UX ont un taux d'adoption 40-60% inférieur selon les études NNG), taux de rework post-lancement.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| SUS delta entre releases | OKR achievement rate |
| Dette UX mesurée (nombre de problèmes critiques backloggés) | Vélocité de livraison (moins de rework) |
| Feature adoption rate | Revenue impact par feature livrée |

### Points éthiques & inclusivité

- Inclure des jalons d'accessibilité obligatoires dans la roadmap, pas en option ou « si on a le temps ».
- Tracer explicitement dans la roadmap les améliorations de protection des données utilisateurs.
- Évaluer l'impact différentiel de chaque item roadmap sur les groupes d'utilisateurs vulnerables avant priorisation finale.
- Ne pas utiliser la roadmap comme un outil de fausse promesse envers les utilisateurs (annoncer des features sans engagement réel ❌).

---

## 9. Éthique & UX responsable

### Modèle mental

L'éthique UX n'est pas une contrainte ajoutée au design — c'est une **dimension de qualité**. Un produit qui manipule ses utilisateurs pour atteindre ses métriques n'est pas un bon produit qui a des problèmes éthiques : c'est un mauvais produit dont les métriques sont truquées. Les utilisateurs finissent toujours par le détecter — et le sentiment de trahison est le plus fort des générateurs de churn.

### Analogie stable

L'éthique UX ressemble aux normes de sécurité alimentaire. Un restaurant peut servir des plats délicieux avec des ingrédients périmés et s'en tirer pendant un certain temps. Mais quand les clients tombent malades, la fermeture est inévitable — et méritée. Les dark patterns sont les ingrédients périmés de l'expérience digitale.

### Méthodologie & Bonnes pratiques

#### Taxonomie des dark patterns à bannir ❌

| Dark pattern | Description | Impact utilisateur | Exemple |
|---|---|---|---|
| Confirmshaming | Libellé de refus humiliant | Honte, pression | « Non merci, je préfère rester ignorant » |
| Roach motel | Facile à entrer, difficile à sortir | Frustration, perte de confiance | Abonnement en 1 clic, résiliation en 7 étapes |
| Hidden costs | Frais révélés au dernier moment | Abandon, colère | Frais de livraison révélés au checkout |
| Misdirection | Attirer l'attention loin de l'action souhaitée | Confusion, erreur | Bouton « Confirmer » grisé, « Annuler » en rouge vif |
| Trick questions | Formulations doubles négatives ou trompeuses | Erreur non intentionnelle | Checkbox « Ne pas ne pas m'inscrire » |
| Urgency artificielle | Compteurs, stocks faux | Anxiété, décision forcée | « Plus que 2 ! » (constant) |
| Social proof manipulé | Faux avis, stats gonflées | Tromperie | « 500 personnes regardent cet article maintenant » |

#### Cadre d'audit éthique

Pour chaque flux critique du produit, évaluer :

1. **Transparence** — L'utilisateur comprend-il ce qu'il fait et ses conséquences ?
2. **Consentement éclairé** — Le consentement est-il donné librement, sans pression ni confusion ?
3. **Réversibilité** — L'utilisateur peut-il facilement défaire ses actions ?
4. **Équité** — L'expérience est-elle équivalente pour tous les groupes d'utilisateurs ?
5. **Vie privée by design** — Les données collectées sont-elles minimales, nécessaires, protégées ?

#### Inclusivité comportementale & diversité culturelle

- **Inclusion cognitive** : Concevoir pour les utilisateurs sous stress, fatigue, ou charge cognitive élevée. Un design accessible aux moments difficiles l'est aussi aux moments normaux.
- **Inclusion sensorielle** : WCAG 2.1 AA comme baseline minimum. Tester avec des lecteurs d'écran, en mode fort contraste, avec navigation clavier uniquement.
- **Diversité culturelle** : Les conventions UX varient selon les cultures (direction de lecture droite-gauche, signification des couleurs, conventions de date/heure). Localisation ≠ traduction.
- **Inclusion économique** : Expérience dégradée gracieusement sur connexions lentes et appareils d'entrée de gamme.

#### Audit éthique assisté par IA

L'IA peut aider à :
- **Détecter les dark patterns dans le code** : Analyser automatiquement les interfaces pour identifier les patterns problématiques documentés.
- **Simuler des biais** : Tester si l'algorithme de recommandation traite différemment les utilisateurs selon leur profil démographique.
- **Auditer les biais dans les modèles** : Vérifier si les modèles IA intégrés au produit produisent des résultats équitables entre groupes.

**Limites de l'audit IA** : L'IA peut détecter des patterns connus mais ne peut pas évaluer le contexte d'intention. La décision éthique finale reste humaine.

### Correction modèle mental

❌ **Idée reçue** : « Les dark patterns fonctionnent — ils augmentent les conversions, donc ils sont justifiés. »

✅ **Approche correcte** : Les dark patterns peuvent augmenter les conversions à court terme mais dégradent la confiance, augmentent les chargebacks, génèrent des plaintes réglementaires (RGPD, DSA en Europe), et créent du churn latent. Les études NNG montrent que les utilisateurs détectent les dark patterns et évitent les marques qui les utilisent. Le ROI négatif à moyen terme dépasse largement le gain à court terme.

**KPI impacté** : NPS (s'effondre quand les utilisateurs réalisent la manipulation), taux de churn à 6 mois, coûts légaux et de réputation.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Ethics audit score (% de flux sans dark patterns) | Taux de churn lié à la confiance |
| WCAG compliance rate | Risque légal (amendes RGPD, DSA) |
| Satisfaction de désabonnement (facilité perçue) | NPS à 6 mois (indicateur de confiance durable) |
| Taux de plaintes liées à l'expérience | Coût de réputation (mentions négatives, presse) |

### Points éthiques & inclusivité

- L'éthique UX est une responsabilité collective — pas uniquement du designer. Elle doit être intégrée dans les critères d'acceptance des stories, dans les revues de design, et dans les OKRs.
- Intégrer une revue éthique dans le processus de design (design critique, pre-mortem éthique) avant tout lancement.
- Former les équipes à reconnaître les dark patterns et créer une culture de refus des demandes qui en impliquent.
- Considérer l'impact environnemental du design : chaque requête inutile, chaque animation non essentielle, chaque vidéo en autoplay a un coût carbone. Le design sobre est aussi du design éthique.

---

*Fin de la Section 1 — Stratégie produit & Product Thinking*
