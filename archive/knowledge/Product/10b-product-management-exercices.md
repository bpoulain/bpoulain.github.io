# Section 10 — Product Management avancé — Exercices

> **Fichier exercices — aucune théorie ici.**
> Ces exercices s'appuient sur les concepts de la Section 10 (théorie). Chaque bloc suit la même structure : traduction mentale, piège de paradigme, mini-cas réel — puis les corrections détaillées avec KPIs, erreurs classiques et changement de paradigme.

---

## Table des matières

1. [Concept 1 — Vision & Stratégie produit](#concept-1--vision--stratégie-produit)
2. [Concept 2 — Métriques AAARRR](#concept-2--métriques-aaarrr)
3. [Concept 3 — Expérimentation produit](#concept-3--expérimentation-produit)
4. [Concept 4 — Éthique IA produit](#concept-4--éthique-ia-produit)

---

## Concept 1 — Vision & Stratégie produit

### Contexte du cas

**Produit** : *Kaia* — une application mobile de coaching parental pour les parents d'enfants de 2 à 10 ans, avec un modèle freemium. L'équipe est composée de 4 personnes (PM, 2 développeurs, 1 designer). Le produit est à 6 mois de son lancement, avec 1 200 utilisateurs actifs mensuels et un taux de conversion freemium → payant de 1,8 %.

---

### Exercice 1 — Traduction mentale

L'équipe de *Kaia* tient sa réunion de roadmap trimestrielle. La CEO annonce : "On a besoin d'une fonctionnalité de messagerie entre parents, d'un journal de bord des progrès de l'enfant, d'une section vidéo avec des experts, et d'une gamification complète. On doit tout lancer avant l'été pour ne pas perdre face à nos concurrents."

**Question** : Comment aborderais-tu ce problème avec ta compréhension actuelle du Product Management ? Que ferais-tu concrètement dans les 48 heures suivantes ?

---

### Exercice 2 — Piège de paradigme

Le PM de *Kaia* rédige la vision produit suivante :

> "Kaia est une application mobile de coaching parental qui propose des exercices quotidiens, des vidéos d'experts, un journal de bord, une communauté de parents et un système de gamification. Notre objectif est d'être l'application la plus complète du marché parental d'ici 18 mois."

**Question** : Qu'est-ce qui ne va pas dans cette vision produit ? Sois précis sur la nature des problèmes. Quels KPIs seraient affectés négativement si l'équipe travaillait avec cette vision comme boussole ?

---

### Exercice 3 — Mini-cas réel

La direction de *Kaia* doit décider entre trois options stratégiques pour les 12 prochains mois :

- **Option A — Build** : Développer en interne un moteur de recommandation personnalisé pour suggérer des exercices selon le profil de l'enfant
- **Option B — Buy** : Acquérir *ParentLib*, une petite startup qui a déjà construit une bibliothèque de 800 exercices vidéo validés par des pédopsychologues
- **Option C — Partner** : Signer un accord de distribution avec *Mamazen*, une plateforme de bien-être familial qui compte 80 000 abonnés

**Question** : Décris ton modèle mental AVANT de commencer l'analyse. Quels éléments dois-tu évaluer pour chacune des trois options ? Comment implémenterais-tu la décision une fois choisie ? Quels KPIs suivrais-tu pour valider que le choix était le bon dans 6 mois ?

---

### Corrections — Concept 1

#### Correction Exercice 1

**Modèle mental attendu**

Face à une liste de demandes multiples sous pression concurrentielle, le réflexe PM n'est pas d'organiser l'exécution — c'est de remonter aux problèmes utilisateurs sous-jacents. La pression concurrentielle est un signal d'urgence perçue, pas une stratégie. La question n'est pas "comment faire tout ça ?" mais "pourquoi ces features spécifiquement, et pour quel utilisateur ?"

**Raisonnement UX/Product**

Dans les 48 heures :
1. Questionner chaque demande avec le cadre des Jobs-to-be-Done : "Quel job à accomplir cette feature résout-elle pour quel utilisateur dans quelle situation ?"
2. Croiser avec les données existantes : quelles features sont les plus utilisées ? Quels problèmes reviennent dans les avis et les tickets support ?
3. Proposer une session de tri avec la CEO : classer les 4 demandes selon leur impact probable sur le taux de conversion et la rétention, et selon l'effort estimé
4. Identifier la "killer feature" : laquelle de ces 4 est la plus susceptible de résoudre le problème de conversion (1,8 % est très faible — le vrai problème est là, pas dans le nombre de features)

**Solution détaillée**

Avant de construire quoi que ce soit, lancer une investigation de 2 semaines :
- Interviews de 8 à 10 utilisateurs actifs (pourquoi reviennent-ils ?) et de 5 à 6 utilisateurs ayant essayé sans convertir (pourquoi n'ont-ils pas payé ?)
- Analyse du funnel de conversion : à quelle étape les utilisateurs décrochent-ils ?
- Analyse de la rétention J7 et J30 : est-ce un problème d'activation ou de valeur continue ?

La décision de roadmap ne devrait intervenir qu'après ces apprentissages.

**KPIs impactés**

| KPI UX | KPI Business |
|--------|-------------|
| Taux d'activation (moment "aha") | Taux de conversion freemium → payant (actuellement 1,8 %) |
| Rétention J7 / J30 | MRR (revenu récurrent mensuel) |
| Taux de complétion du onboarding | CAC / LTV ratio |

**Erreurs classiques**

- Traiter chaque demande de la CEO comme une roadmap validée
- Construire plusieurs features simultanément sans valider l'hypothèse de chacune
- Confondre l'urgence perçue (concurrents) avec une urgence réelle mesurée par des données

**Correction des biais cognitifs**

Le biais de pression sociale (FOMO concurrentiel) pousse à réagir à la vitesse du marché perçu plutôt qu'à la vitesse des apprentissages. Le biais de confirmation amène à construire les features que la direction souhaite, puis à sélectionner les données qui les valident. La structuration rigoureuse d'une hypothèse préalable est le seul antidote.

**Améliorations possibles**

Mettre en place un processus de demande de roadmap standardisé : chaque demande de feature doit arriver avec un problème utilisateur articulé, une métrique cible et une hypothèse de causalité. Cela recadre la relation avec la direction dans une logique de dialogue stratégique plutôt que de liste de courses.

**Feedback itératif — changement de paradigme**

> La roadmap ne répond pas à la question "que va-t-on construire ?" mais à "quel problème allons-nous résoudre et comment le mesurerons-nous ?"

---

#### Correction Exercice 2

**Modèle mental attendu**

Une vision produit qui décrit des features n'est pas une vision — c'est une liste de livraisons. La vision doit répondre à trois questions : pour qui, quel problème profond, quelle transformation. Tout le reste (features, technologies, format) en découle.

**Raisonnement UX/Product**

Problèmes identifiés dans la vision rédigée :
1. **Absence d'utilisateur cible précis** : "parents" est trop vague — parents de quel âge d'enfant ? Dans quelle situation ? Face à quel problème spécifique ?
2. **Liste de features, pas de transformation** : "exercices, vidéos, journal, communauté, gamification" décrit ce que le produit fait, pas ce qu'il transforme dans la vie de l'utilisateur
3. **Positionnement concurrentiel fragile** : "application la plus complète" est une stratégie de volume, pas de valeur — elle mène à une guerre d'attrition contre des acteurs mieux financés
4. **Absence de différenciation durable** : rien dans cette vision n'est difficile à copier pour un concurrent

**KPIs négativement affectés**

| KPI UX | Impact | KPI Business | Impact |
|--------|--------|-------------|--------|
| NPS | Baisse — le produit ne crée pas de valeur émotionnelle identifiable | ARR / MRR | Stagnation — pas de positionnement premium défendable |
| Taux d'activation | Baisse — l'absence de valeur claire rend le onboarding générique | LTV | Baisse — la "complétude" attire des utilisateurs peu engagés |
| Rétention J30 | Baisse — sans transformation promise, pas de raison de revenir | CAC | Hausse — difficile à différencier en acquisition |

**Solution** — Vision reformulée (proposition) :

> "Pour les parents d'enfants de 2 à 8 ans qui traversent des épisodes de comportements difficiles (crises, refus, disputes de fratrie) et qui ne savent pas comment réagir sans crier ni céder, *Kaia* est le compagnon de coaching parental qui leur donne confiance en temps réel — contrairement aux livres et aux thérapeutes qui demandent du temps et de l'argent, nous sommes là dans le moment critique, en moins de 3 minutes."

**Feedback itératif — changement de paradigme**

> Une vision produit ne décrit pas ce qu'on va construire — elle décrit la transformation qu'on rend possible dans la vie de l'utilisateur.

---

#### Correction Exercice 3

**Modèle mental AVANT d'analyser**

Le choix Build/Buy/Partner n'est pas une décision technique — c'est une décision stratégique sur où concentrer les ressources rares d'une petite équipe. La question centrale : "Quelle capacité est un avantage compétitif différenciateur pour *Kaia*, et quelle capacité est une commodité ?"

Si la capacité est différenciatrice → Build
Si la capacité est une commodité mais critique → Buy
Si la capacité permet d'accéder à un marché ou une audience → Partner

**Analyse des trois options**

| Dimension | Option A — Build | Option B — Buy | Option C — Partner |
|-----------|-----------------|---------------|-------------------|
| Avantage compétitif | Élevé si exécuté bien | Moyen (bibliothèque partageable) | Faible (distribution externe) |
| Risque d'exécution | Élevé (4 personnes, 12 mois) | Moyen (intégration, culture) | Faible |
| Impact sur LTV | Élevé à long terme | Moyen | Incertain |
| Délai de valeur | Long (12 mois+) | Moyen (3-6 mois) | Court (1-2 mois) |
| Coût | Coût d'opportunité élevé | Coût financier (acquisition) | Coût de structure partagée |
| Alignement vision | À valider selon la vision | Bonne complémentarité si vision = contenu expert | Bonne si vision = audience |

**Recommandation contextuelle**

Pour une équipe de 4 personnes avec 1 200 MAU et un problème de conversion non résolu : avant de décider de Build, Buy ou Partner, il faut d'abord valider que le problème de conversion (1,8 %) n'est pas un problème d'onboarding ou de proposition de valeur — auquel cas aucune de ces trois options ne le résout.

Si le problème de conversion est lié à un manque de contenu crédible → Option B (contenu expert validé) est la réponse la plus rapide
Si le problème est la visibilité → Option C (accès à l'audience Mamazen) est pertinent
Si le produit a atteint le PMF et qu'il cherche à se différencier → Option A devient défendable

**KPIs à suivre à 6 mois selon l'option choisie**

| Option | KPI UX | KPI Business |
|--------|--------|-------------|
| A — Build | Taux d'utilisation du moteur de recommandation, satisfaction des recommandations (CSAT) | Rétention J30, ARPU |
| B — Buy | Taux de complétion des exercices vidéo, NPS post-contenu | Conversion freemium→payant, MRR |
| C — Partner | Taux d'activation des utilisateurs acquis via Mamazen | CAC des nouveaux utilisateurs, LTV cohorte Mamazen |

**Erreurs classiques**

- Choisir "Build" par défaut car "ça nous appartient" — sans évaluer le coût d'opportunité pour une petite équipe
- Choisir "Buy" sans due diligence sur la culture, la dette technique et la compatibilité vision de la startup cible
- Choisir "Partner" pour éviter la décision — un partenariat sans conviction stratégique ne génère jamais les résultats espérés

**Feedback itératif — changement de paradigme**

> La décision Build/Buy/Partner est une décision sur où vous vous différenciez, pas sur ce qui est plus facile ou moins cher à court terme.

---

## Concept 2 — Métriques AAARRR

### Contexte du cas

**Produit** : *Tandem* — une plateforme SaaS B2B de gestion des notes de frais, ciblant les PME de 10 à 200 salariés. Modèle par abonnement mensuel, 90 € par mois pour 10 utilisateurs. L'équipe reçoit un rapport mensuel avec les données suivantes :

| Métrique | Valeur |
|----------|--------|
| Visiteurs uniques landing page | 18 400 |
| Inscriptions (trial 14 jours) | 412 |
| Utilisateurs ayant importé au moins une note (J7) | 89 |
| Abonnés actifs (payants) | 31 |
| Abonnés ayant résilié ce mois | 9 |
| Abonnés ayant upgradé (plan 30 users) | 4 |
| Nouveaux clients via recommandation | 2 |
| Revenus mensuels récurrents (MRR) | 2 790 € |

---

### Exercice 1 — Traduction mentale

Regarde les données de *Tandem* ci-dessus. Sans calcul complexe, décris ce que ce tableau te "dit" sur la santé du produit. Quels sont les signaux positifs ? Quels sont les signaux d'alerte ? Où concentrerais-tu ton attention en priorité ?

---

### Exercice 2 — Piège de paradigme

Le PM de *Tandem* présente en réunion de direction :

> "On a 412 inscriptions ce mois, c'est notre meilleur résultat depuis le lancement. La machine d'acquisition fonctionne, il faut continuer d'investir dans les campagnes Google Ads. On a aussi un bon MRR de 2 790 €, ça prouve que le modèle tient."

**Question** : Qu'est-ce qui ne va pas dans cette analyse ? Quels KPIs le PM ignore-t-il ? Quels sont les risques si la direction suit cette recommandation ?

---

### Exercice 3 — Mini-cas réel

À partir des données de *Tandem*, calcule ou estime les métriques suivantes et utilise-les pour construire un diagnostic complet et une recommandation d'actions priorisées :

1. Taux de conversion landing → trial
2. Taux d'activation (trial → utilisation réelle J7)
3. Taux de conversion trial → payant
4. Churn rate mensuel
5. LTV estimée (durée de vie moyenne à estimer)
6. CAC approximatif (en supposant un budget Google Ads de 4 600 €/mois)
7. Ratio LTV / CAC

**Question** : Décris ton modèle mental AVANT de commencer les calculs. Comment ces métriques s'articulent-elles entre elles ? Quelle est la priorité absolue d'amélioration et pourquoi ? Propose un plan d'action à 90 jours avec les KPIs cibles.

---

### Corrections — Concept 2

#### Correction Exercice 1

**Modèle mental attendu**

Avant de calculer quoi que ce soit, le PM lit un funnel comme une histoire à trois actes : est-ce que les gens arrivent (acquisition), est-ce qu'ils vivent la valeur (activation), est-ce qu'ils restent (rétention). L'oeil expert identifie rapidement les ruptures — les étapes où le flux se réduit de façon disproportionnée.

**Lecture du tableau par étape**

- **Acquisition** : 18 400 visiteurs → 412 inscriptions. C'est un signal d'intérêt initial satisfaisant.
- **Activation** : 412 inscriptions → 89 utilisateurs actifs à J7. La chute est massive — plus de 78 % des inscrits n'ont jamais vraiment utilisé le produit. C'est le signal d'alerte le plus fort.
- **Conversion** : 89 utilisateurs actifs → 31 abonnés payants. Ce taux est correct mais difficile à interpréter sans savoir combien de trials sont arrivés à expiration ce mois.
- **Rétention / Churn** : 9 résiliations sur 31 abonnés actifs. C'est potentiellement critique.
- **Expansion** : 4 upgrades — signal positif, ces clients trouvent de la valeur et acceptent de payer plus.
- **Referral** : 2 nouveaux clients par recommandation — très faible, le bouche-à-oreille ne fonctionne pas encore.

**Signaux positifs**

- Intérêt initial significatif (18 400 visiteurs)
- Quelques clients qui expandent (4 upgrades)
- MRR existant prouvant que le modèle est monétisable

**Signaux d'alerte**

- Effondrement entre inscription et utilisation réelle (activation critique)
- Potentiel churn élevé (9 sur 31 = 29 %, à confirmer)
- Quasi-absence de referral

**Feedback itératif — changement de paradigme**

> Ce n'est pas le nombre d'inscriptions qui compte — c'est le nombre d'utilisateurs qui ont vécu la valeur du produit. Tout le reste n'est que du trafic.

---

#### Correction Exercice 2

**Modèle mental attendu**

Le PM fait une erreur classique : il mesure l'entrée du funnel (inscriptions) et le résultat final (MRR) en ignorant tout ce qui se passe entre les deux. Cette vision tunnel est dangereuse car elle peut conduire à investir massivement dans l'acquisition alors que le vrai problème est l'activation ou la rétention — ce qui aggrave le problème plutôt que de le résoudre.

**Ce que le PM ignore**

| Dimension ignorée | Réalité | Impact |
|------------------|---------|--------|
| Taux d'activation | 89/412 = 21,6 % seulement | Investir dans l'acquisition avec un produit qui n'active que 21 % des trials revient à verser de l'eau dans un seau troué |
| Churn potentiel | 9 résiliations sur 31 actifs | Si ce churn se maintient, la base d'abonnés va fondre rapidement |
| Qualité des 412 inscrits | Non mesurée | Des campagnes Ads peuvent attirer des utilisateurs mal ciblés qui n'activent jamais |
| LTV / CAC | Non calculé | Peut-être que le coût d'acquisition actuel est déjà supérieur à la valeur générée |

**Risques si la direction suit la recommandation**

- Augmenter le budget Ads sans résoudre l'activation → hausse du CAC sans hausse du LTV → ratio LTV/CAC qui se dégrade → modèle économique non viable
- Le churn ronge la base plus vite que l'acquisition ne la reconstitue → "leaky bucket" (seau troué)
- La direction croit que "la machine d'acquisition fonctionne" alors qu'elle creuse un puits qui ne retient pas l'eau

**KPIs ignorés par le PM**

- Taux d'activation J7 (21,6 %)
- Churn rate mensuel (potentiellement 29 %)
- LTV estimée
- Ratio LTV/CAC
- Coût de l'acquisition vs valeur générée

**Feedback itératif — changement de paradigme**

> Investir dans l'acquisition avant de résoudre l'activation, c'est arroser un jardin avec un tuyau percé — plus on arrose, plus on gaspille.

---

#### Correction Exercice 3

**Modèle mental AVANT les calculs**

Les métriques AAARRR forment un système : une faiblesse à une étape contamine toutes les étapes en aval. Avant de calculer, identifier quelle étape est le "bottleneck" — là où l'effort d'amélioration aurait le plus grand effet de levier sur les métriques finales (MRR, LTV).

**Calculs**

| Métrique | Calcul | Résultat | Benchmark SaaS B2B |
|----------|--------|----------|--------------------|
| Taux conversion landing → trial | 412 / 18 400 | **2,24 %** | 2-5 % ✓ acceptable |
| Taux d'activation (trial → usage J7) | 89 / 412 | **21,6 %** | 40-60 % attendu ❌ critique |
| Taux conversion trial → payant | 31 / 89 | **34,8 %** | 15-25 % ✓ bon |
| Churn rate mensuel | 9 / 31 | **29 %** | < 3-5 %/mois B2B ❌ critique |
| Durée de vie moyenne estimée | 1 / 0,29 | **~3,4 mois** | — |
| LTV estimée | 90 € × 3,4 mois | **~306 €** | — |
| CAC estimé (Ads) | 4 600 € / 31 | **~148 €** | — |
| Ratio LTV / CAC | 306 / 148 | **~2,07** | Minimum 3:1 ❌ |

**Diagnostic**

Le produit a deux problèmes critiques et simultanés :
1. **Activation catastrophique** (21,6 %) : 4 inscrits sur 5 ne vivent jamais la valeur du produit. Le taux de conversion trial → payant est bon (34,8 %) mais il ne s'applique qu'aux rares utilisateurs qui ont activé.
2. **Churn mortifère** (29 %/mois) : même les clients qui ont activé et payé partent en moins de 4 mois en moyenne. Le LTV de 306 € est trop faible face au CAC de 148 €.

**Plan d'action 90 jours**

| Priorité | Action | KPI cible | Délai |
|----------|--------|-----------|-------|
| 1 | Audit du onboarding : identifier à quelle étape les 78 % perdus décrochent (heatmaps, session replay, interviews des non-actifs) | Taux d'activation J7 > 40 % | J0-J30 |
| 2 | Refonte de l'onboarding : réduire le time-to-value (TTQ : time to first import de note) | TTQ < 5 minutes | J15-J45 |
| 3 | Programme de rétention : entretiens de sortie avec les 9 résiliés, identification des raisons réelles | Churn rate < 10 %/mois | J30-J60 |
| 4 | Quick wins rétention : notifications de valeur, check-in J14, personnalisation des emails d'activation | Rétention J30 > 70 % | J45-J75 |
| 5 | Gel ou réduction du budget Ads jusqu'à résolution de l'activation | Maintenir CAC, améliorer LTV/CAC > 3:1 | Immédiat |

**Erreurs classiques**

- Optimiser le taux de conversion landing → trial sans améliorer l'activation (apporter plus d'eau dans le seau troué)
- Confondre le taux de conversion trial → payant (34,8 %, bon) avec une preuve que le produit fonctionne — ce taux ne s'applique qu'à 21 % des inscrits
- Ignorer le churn car "on acquiert plus vite qu'on ne perd" — arithmétique trompeuse à court terme, destruc trice à moyen terme

**Correction des biais cognitifs**

Le biais de disponibilité fait que les métriques les plus faciles à voir (inscriptions, MRR absolu) capturent l'attention. Le ratio LTV/CAC, moins visible, est pourtant le signal de santé le plus important du modèle économique SaaS.

**Feedback itératif — changement de paradigme**

> Un bon taux de conversion trial → payant avec un mauvais taux d'activation, c'est un moteur qui tourne vite dans un embrayage qui patine — l'énergie est là, elle ne se transmet pas.

---

## Concept 3 — Expérimentation produit

### Contexte du cas

**Produit** : *Pivo* — une application de gestion de cave à vin pour les amateurs éclairés. Modèle par abonnement annuel (49 €/an). 22 000 utilisateurs actifs, dont 3 400 abonnés payants. L'équipe constate que le taux de complétion de l'onboarding (ajout des 10 premières bouteilles) est de 31 % — ce qui est jugé insuffisant. Elle a trois hypothèses pour l'expliquer.

---

### Exercice 1 — Traduction mentale

L'équipe de *Pivo* veut "tester des trucs" pour améliorer l'onboarding. La designer propose d'ajouter une progression visuelle (barre de progression), le développeur veut créer un mode de scan de code-barres amélioré, et le PM évoque un système de récompenses gamifiées.

**Question** : Comment aborderais-tu ce moment ? Quelle est la première chose à faire AVANT de choisir quoi tester ? Décris la méthode pour structurer ces idées en hypothèses testables.

---

### Exercice 2 — Piège de paradigme

L'équipe de *Pivo* lance un test A/B sur la couleur du bouton "Ajouter une bouteille" : vert (contrôle) vs orange (variante). Après 3 jours, la variante orange montre +7 % de clics. Le PM annonce : "Orange gagne, on déploie !"

**Question** : Qu'est-ce qui ne va pas dans cette expérience et dans cette décision ? Quels KPIs seraient affectés si on prend cette décision comme elle est ?

---

### Exercice 3 — Mini-cas réel

L'équipe de *Pivo* a formulé trois hypothèses pour expliquer le faible taux de complétion de l'onboarding (31 %) :

- **Hypothèse A** : "Les utilisateurs abandonnent parce que saisir manuellement les informations d'une bouteille (millésime, appellation, producteur) est trop long"
- **Hypothèse B** : "Les utilisateurs abandonnent parce qu'ils ne voient pas immédiatement la valeur de construire leur cave (le bénéfice n'est visible qu'à partir de 10+ bouteilles)"
- **Hypothèse C** : "Les utilisateurs abandonnent parce que l'objectif de 10 bouteilles est perçu comme une barrière arbitraire et démotivante"

**Question** : Décris ton modèle mental AVANT de concevoir les tests. Pour chaque hypothèse, conçois un test minimal (pas nécessairement un A/B test), définis le critère de succès précis, et décris comment tu interprèterais les résultats pour décider de pivoter ou persévérer. Quels KPIs suivrais-tu pour chacun ?

---

### Corrections — Concept 3

#### Correction Exercice 1

**Modèle mental attendu**

Avant de tester quoi que ce soit, il faut savoir ce qu'on teste et pourquoi. Une idée de feature n'est pas une hypothèse. Une hypothèse contient trois éléments : un mécanisme causal ("parce que..."), un segment cible précis, et un critère de succès mesurable. Sans ces trois éléments, l'expérience ne peut pas être interprétée.

**La première chose à faire : diagnostiquer avant de tester**

Avant même de formuler des hypothèses, examiner les données comportementales disponibles :
- À quelle étape exacte les utilisateurs abandonnent-ils l'onboarding ? (funnel analytics)
- Qu'est-ce qui différencie les 31 % qui complètent de ceux qui ne complètent pas ? (analyse de cohorte)
- Existe-t-il des verbatims dans les avis ou les tickets support qui expliquent l'abandon ?

Cette investigation prend 1 à 3 jours et oriente les hypothèses sur des causes réelles plutôt que sur des intuitions d'équipe.

**Structuration des idées en hypothèses testables**

| Idée initiale | Hypothèse structurée |
|--------------|---------------------|
| Barre de progression (designer) | "Nous croyons qu'ajouter une barre de progression à l'onboarding augmentera le taux de complétion de +15 %, parce que les utilisateurs manquent de repère sur l'avancement et abandonnent faute de perception de fin proche." |
| Scan code-barres amélioré (dev) | "Nous croyons que réduire le temps de saisie par une expérience de scan à une touche augmentera l'ajout de la 1ère bouteille de +25 %, parce que la friction de saisie manuelle est le principal frein à l'activation." |
| Gamification (PM) | "Nous croyons qu'introduire un badge 'Fondateur de cave' après 10 bouteilles augmentera le taux de complétion de +20 %, parce que l'absence de récompense symbolique à l'arrivée réduit la motivation à terminer." |

Chaque hypothèse peut maintenant être priorisée, conçue et testée indépendamment.

**KPIs impactés**

- Taux de complétion de l'onboarding (objectif primaire)
- Time-to-Value (TTQ : temps avant la 1ère bouteille ajoutée)
- Taux de conversion trial → abonné (impacté par l'activation)

**Feedback itératif — changement de paradigme**

> Une idée de feature n'est pas une hypothèse. Une hypothèse, c'est une idée avec un "parce que", un segment et un seuil de validation chiffré.

---

#### Correction Exercice 2

**Modèle mental attendu**

Un test A/B valide est soumis à plusieurs conditions simultanées : durée suffisante, volume suffisant, significativité statistique, et alignement sur la bonne métrique. Décider après 3 jours sur un métrique de clic (non sur une métrique de valeur) est un exemple de décision prématurée sur une mauvaise métrique.

**Ce qui ne va pas**

| Problème | Explication |
|---------|-------------|
| Durée trop courte (3 jours) | Les tests A/B doivent durer au minimum 1 à 2 semaines pour neutraliser les biais de jour de la semaine et les variations naturelles du trafic |
| Mauvaise métrique (clics) | Cliquer sur "Ajouter une bouteille" n'est pas la même chose que compléter l'ajout. La métrique pertinente est le taux de complétion de l'onboarding, pas le taux de clic |
| Significativité statistique non mentionnée | +7 % sur un petit volume peut être du bruit aléatoire. Sans calcul de p-value ou intervalle de confiance, la décision est un pari |
| Absence d'hypothèse de départ | Si l'équipe n'avait pas formulé d'hypothèse ("la couleur orange attire davantage l'attention parce que X"), elle ne peut pas interpréter le résultat |

**KPIs affectés si on déploie précipitamment**

| KPI | Impact |
|-----|--------|
| Taux de complétion onboarding | Potentiellement inchangé — la couleur du bouton n'est peut-être pas la cause du problème |
| Crédibilité de l'équipe | Déploiements basés sur des données insuffisantes érodent la confiance dans la culture d'expérimentation |
| Budget de développement | Temps investi dans un changement non validé qui n'aura peut-être aucun effet |

**Comment corriger ce test**

1. Définir la durée minimale (au moins 2 cycles hebdomadaires complets)
2. Calculer la taille d'échantillon nécessaire pour une significativité à 95 %
3. Changer la métrique primaire : complétion de l'ajout de la 1ère bouteille, pas le clic
4. Documenter l'hypothèse causale avant de regarder les résultats

**Feedback itératif — changement de paradigme**

> Un A/B test sans hypothèse causale ni significativité statistique n'est pas une expérience — c'est une intuition habillée en données.

---

#### Correction Exercice 3

**Modèle mental AVANT de concevoir les tests**

Trois hypothèses simultanées signifient trois causes possibles du même symptôme. Avant de tout tester en parallèle (coûteux, difficile à interpréter), prioriser les hypothèses selon deux critères : probabilité (quelle hypothèse est la plus probable au vu des données disponibles ?) et testabilité (quelle hypothèse peut être testée le plus rapidement et à moindre coût ?).

**Tests conçus pour chaque hypothèse**

**Hypothèse A — Friction de saisie manuelle**

- **Test minimal** : "Fake door" — proposer dans l'onboarding actuel un bouton "Scanner ma bouteille" qui mène à une page "Cette fonctionnalité arrive bientôt — aimeriez-vous être notifié ?" et mesurer le taux de clic et d'inscription à la notif
- **Alternative** : session d'observation utilisateur (5-8 personnes) en enregistrant le temps de saisie et les abandons mid-formulaire
- **Critère de succès** : > 40 % des utilisateurs testeurs cliquent sur "Scanner ma bouteille" OU > 60 % des sessions observées montrent un abandon sur l'étape formulaire
- **Décision** : Si confirmé → investir dans un flow de scan ; si infirmé → passer à l'hypothèse suivante
- **KPIs** : Time-to-first-bottle, taux d'abandon sur étape formulaire, taux d'engagement avec la fonctionnalité scan

**Hypothèse B — Valeur perçue insuffisante**

- **Test minimal** : Modifier la page d'onboarding pour afficher une prévisualisation de ce à quoi ressemblera la cave une fois remplie (mockup animé ou screenshot d'une cave de 15 bouteilles avec recommandations, alertes, statistiques)
- **Critère de succès** : Le taux de complétion de l'onboarding passe de 31 % à > 42 % sur la variante avec prévisualisation, avec significativité à 95 % après 14 jours
- **Décision** : Si confirmé → investir dans la communication de valeur tout au long de l'onboarding ; si infirmé → le problème n'est pas la perception de valeur
- **KPIs** : Taux de complétion onboarding, rétention J7, taux de conversion trial → payant

**Hypothèse C — Objectif perçu comme arbitraire**

- **Test minimal** : A/B test sur le nombre de bouteilles requis pour "compléter" l'onboarding — variante A : 10 bouteilles (actuel), variante B : 5 bouteilles avec message "Votre cave est lancée ! Continuez à l'enrichir"
- **Critère de succès** : Le taux de complétion (à 5 bouteilles) de la variante B dépasse 55 %, ET la rétention J7 de la variante B n'est pas inférieure à la variante A
- **Décision** : Si confirmé → repenser le milestone d'activation ; si la rétention chute dans B → l'activation à 5 bouteilles est insuffisante pour créer l'habitude
- **KPIs** : Taux de complétion, rétention J7 et J30, temps moyen de complétion

**Priorisation recommandée**

Commencer par des observations utilisateurs (peu coûteuses) pour discriminer A et B avant de lancer des A/B tests (qui nécessitent du volume). *Pivo* avec 22 000 MAU a le volume pour des A/B tests mais pas en illimité — tester séquentiellement est plus efficace que simultanément.

**Erreurs classiques**

- Lancer les 3 tests en parallèle → impossibilité d'attribuer l'effet causal en cas d'amélioration
- Arrêter un test dès que la variante semble gagner, sans attendre la significativité
- Considérer un test "infirmé" comme un échec plutôt que comme un apprentissage — savoir ce qui ne fonctionne pas est une valeur

**Feedback itératif — changement de paradigme**

> Un test qui infirme une hypothèse n'est pas un échec — c'est un apprentissage qui vaut autant que le budget économisé en ne construisant pas la mauvaise solution.

---

## Concept 4 — Éthique IA produit

### Contexte du cas

**Produit** : *Cleo* — une application de coaching financier personnel, pilotée par IA, qui analyse les dépenses bancaires de l'utilisateur, prédit son comportement financier et lui recommande des actions pour améliorer sa situation. 180 000 utilisateurs actifs, dont une part significative de jeunes actifs précaires (25-35 ans) et de personnes en situation de fragilité financière. Le modèle inclut un système de recommandation de produits financiers partenaires (crédit à la consommation, assurances) pour lesquels *Cleo* perçoit une commission.

---

### Exercice 1 — Traduction mentale

Le CPO de *Cleo* annonce : "On va intégrer un système IA qui détecte automatiquement quand un utilisateur est stressé financièrement (sur la base de ses patterns de dépenses et de consultation de l'app), et on lui envoie une notification personnalisée proposant notre crédit partenaire. C'est du bon timing, non ?"

**Question** : Comment aborderais-tu cette idée ? Quelles questions poses-tu immédiatement ? Quels sont les risques que tu identifies, et à quel niveau (éthique, légal, réputationnel, business) ?

---

### Exercice 2 — Piège de paradigme ❌

Le PM de *Cleo* conçoit un système de personnalisation adaptative qui affiche des badges motivants à l'utilisateur ("Tu dépenses mieux que 78 % des Français de ton âge !"). L'équipe observe que les utilisateurs ayant reçu le badge dépensent +23 % de temps en plus dans l'app après la notification.

**Question** : Qu'est-ce qui ne va pas dans ce système et dans l'interprétation de cette métrique ? Quels dark patterns sont présents ou risquent d'apparaître ? Quels KPIs devraient être suivis à la place ? ❌

---

### Exercice 3 — Mini-cas réel

L'équipe de *Cleo* doit décider d'une politique de transparence IA pour son système de recommandation de produits financiers. Trois options sont sur la table :

- **Option 1 — Disclosure minimale** : mentionner dans les CGU que *Cleo* peut faire des recommandations rémunérées, sans indiquer au moment de la recommandation qu'il s'agit d'un produit sponsorisé
- **Option 2 — Disclosure contextuelle** : afficher une mention "Recommandé par *Cleo* — partenariat rémunéré" sur chaque recommandation produit financier
- **Option 3 — Transparence radicale** : expliquer à l'utilisateur pourquoi l'IA lui recommande ce produit ("Basé sur ton profil de dépenses et ta situation de trésorerie, *Cleo* a identifié ce produit comme potentiellement adapté. *Cleo* perçoit une commission si tu souscris.") et lui offrir un mode sans recommandations sponsorisées

**Question** : Décris ton modèle mental AVANT d'analyser les options. Évalue chaque option sur les dimensions éthique, légale, UX et business. Quelle option recommandes-tu et pourquoi ? Quels KPIs suivrais-tu pour valider la décision ?

---

### Corrections — Concept 4

#### Correction Exercice 1

**Modèle mental attendu**

Lorsqu'une feature IA cible des utilisateurs en situation de vulnérabilité (stress financier) pour déclencher un acte commercial (souscription d'un crédit), le PM doit activer immédiatement un cadre d'analyse éthique avant de répondre à la question de faisabilité. La question n'est pas "est-ce techniquement possible ?" mais "est-ce que cela sert l'intérêt de l'utilisateur ou l'exploite ?"

**Questions à poser immédiatement**

| Dimension | Questions |
|-----------|-----------|
| Intention | L'objectif est-il d'aider l'utilisateur en difficulté ou de le convertir à un produit financier au moment de sa plus grande vulnérabilité ? |
| Consentement | L'utilisateur a-t-il consenti à ce que son comportement soit analysé pour déclencher des offres commerciales ? |
| Impact | Que se passe-t-il si un utilisateur stressé financièrement souscrit un crédit à la consommation qu'il ne peut pas rembourser ? Qui porte la responsabilité ? |
| Alternatives | Existe-t-il une façon d'aider cet utilisateur qui ne soit pas commerciale ? (alertes, conseils gratuits, redirection vers des aides publiques) |
| Légalité | Est-ce conforme à la directive sur le crédit à la consommation et aux obligations de conseil en produits financiers (MiFID II, RGPD) ? |

**Risques identifiés**

| Niveau | Risque | Gravité |
|--------|--------|---------|
| Éthique | Exploitation de la vulnérabilité — cibler un utilisateur au moment de son stress maximal pour lui vendre un produit qui peut aggraver sa situation | Critique |
| Légal | Obligation de conseil et mise en garde en matière de crédit (code de la consommation) ; potentielle requalification en pratique commerciale trompeuse | Élevé |
| Réputationnel | Scandale médiatique potentiel si des utilisateurs en difficulté s'endettent davantage via *Cleo* | Élevé |
| Business | Érosion de la confiance → churn massif ; risque de régulation sectorielle ; actions en justice collectives | Élevé |

❌ **Dark pattern identifié** : cibler un utilisateur en situation de détresse pour déclencher une conversion commerciale est une forme de manipulation émotionnelle. Même si l'intention de l'équipe est "d'aider", le mécanisme exploite la vulnérabilité.

**KPIs impactés**

- NPS (confiance et perception éthique du produit)
- Taux de rétention (si des utilisateurs se sentent exploités)
- Taux de sinistre sur les crédits souscrits (métrique externe mais responsabilité morale de *Cleo*)
- Risque réglementaire (coût potentiel d'amendes, ACPR en France)

**Feedback itératif — changement de paradigme**

> "Bon timing" n'est pas un argument éthique. Cibler une personne au moment de sa plus grande vulnérabilité pour un acte commercial, c'est choisir délibérément de maximiser la probabilité de conversion en exploitant la faiblesse — même si le produit peut objectivement aider.

---

#### Correction Exercice 2

**Modèle mental attendu**

La métrique "temps passé dans l'app" est une métrique d'engagement, pas de valeur. Quand un produit financier augmente le temps d'écran de 23 % via des badges comparatifs, la première question est : est-ce que cet engagement crée de la valeur financière réelle pour l'utilisateur, ou est-ce qu'il crée de l'anxiété sociale qui maintient l'attention ?

**Ce qui ne va pas**

| Problème | Explication |
|---------|-------------|
| Métrique de vanité | Le temps passé dans l'app n'est pas corrélé à une amélioration de la situation financière de l'utilisateur |
| Comparaison sociale normative ❌ | "Tu dépenses mieux que 78 % des Français" active le biais de comparaison sociale — l'utilisateur revient non pas pour améliorer ses finances mais pour maintenir son statut perçu |
| Absence de contrôle utilisateur | L'utilisateur ne peut pas désactiver les notifications comparatives ni choisir ce qu'il veut mesurer |
| Biais de représentativité | "78 % des Français" — sur quelle base ? Si l'échantillon est biaisé (utilisateurs *Cleo*), la comparaison est statistiquement invalide |

**Dark patterns présents ou risquant d'apparaître** ❌

| Dark pattern | Description |
|-------------|-------------|
| Variable reward (récompense variable) | Les badges créent une boucle de récompense intermittente qui incite à revenir consulter non par besoin mais par conditionnement |
| Social proof manipulatoire | La comparaison avec "78 % des Français" est un levier de conformité sociale utilisé pour créer de l'engagement sans valeur réelle |
| FOMO financier | "Rester dans le top 22 %" crée une anxiété artificielle de déclassement qui n'existait pas avant la fonctionnalité |

**KPIs alternatifs à mesurer**

| KPI actuel (mauvais) | KPI alternatif (centré valeur) |
|--------------------|-------------------------------|
| Temps passé dans l'app | Nombre d'objectifs financiers atteints par l'utilisateur |
| Fréquence de connexion | Taux d'utilisateurs ayant amélioré leur taux d'épargne sur 3 mois |
| Taux d'ouverture des notifications | Taux d'actions concrètes prises suite à une recommandation |
| Rétention (engagement) | Rétention associée à une progression mesurable de la situation financière |

**Feedback itératif — changement de paradigme**

> Un produit financier qui optimise l'engagement sans optimiser le bénéfice financier réel de l'utilisateur n'est pas un coach — c'est un média qui se monétise sur l'anxiété de ses utilisateurs.

---

#### Correction Exercice 3

**Modèle mental AVANT d'analyser les options**

La transparence dans un produit financier IA n'est pas un choix éthique optionnel — c'est une obligation légale (RGPD art. 22, directive sur le crédit, réglementation MiFID II) ET un levier de confiance à long terme. La question n'est pas "jusqu'où peut-on aller sans se faire attraper ?" mais "quelle transparence construit le produit auquel nos utilisateurs peuvent faire confiance sur 10 ans ?"

Le conflit d'intérêt (recommandation rémunérée) doit être déclaré au moment où il opère — pas dans des CGU que personne ne lit.

**Analyse des trois options**

| Dimension | Option 1 — Disclosure minimale | Option 2 — Disclosure contextuelle | Option 3 — Transparence radicale |
|-----------|-------------------------------|-------------------------------------|----------------------------------|
| Éthique | ❌ Non — le conflit d'intérêt est dissimulé au moment de la décision | ✓ Honnête mais incomplet | ✅ Pleinement éthique |
| Légalité (FR/UE) | ❌ Probable non-conformité (RGPD art.22, code de la consommation) | ✓ Probablement conforme | ✅ Conforme et au-delà |
| UX | ❌ Trompeuse — l'utilisateur n'a pas l'information pour décider | ✓ Informative mais passive | ✅ Empowering — l'utilisateur comprend et contrôle |
| Business court terme | ✓ Conversion maximale (conflit non visible) | → Conversion légèrement réduite | → Conversion réduite à court terme |
| Business long terme | ❌ Risque légal, réputationnel, churn si découverte | ✓ Stable | ✅ Confiance, NPS, rétention élevés |

**Recommandation : Option 3 — Transparence radicale**

Justification :
1. *Cleo* opère sur un segment vulnérable (fragilité financière) — la responsabilité morale est proportionnelle à la vulnérabilité des utilisateurs
2. Le modèle d'affaires de *Cleo* ne peut être durable que s'il est fondé sur la confiance — une fois qu'un utilisateur découvre qu'il a été orienté vers un produit rémunéré sans disclosure, la confiance est irréparable
3. La transparence radicale est un avantage compétitif différenciateur dans un secteur (fintech) où la méfiance est structurelle
4. Le mode "sans recommandations sponsorisées" peut devenir un argument marketing ("*Cleo* vous donne le choix") et une source de données sur la valeur perçue des recommandations

**KPIs à suivre pour valider la décision**

| KPI UX | KPI Business |
|--------|-------------|
| Taux d'utilisation du mode sans recommandations sponsorisées | Conversion sur les recommandations transparentes (vs baseline) |
| NPS (confiance) | LTV des utilisateurs en Option 3 vs segments précédents |
| Taux de compréhension de la disclosure (test utilisateur) | Risque légal et réglementaire (0 incident = succès) |
| Sentiment qualitatif sur la politique de transparence | Rétention à 12 mois (confiance → fidélité) |

**Erreurs classiques**

- Rédiger une disclosure qui "coche la case légale" sans être réellement compréhensible (jargon, taille de police réduite, placement en bas de page)
- Considérer que parce que la pratique est répandue dans l'industrie elle est acceptable éthiquement
❌ **Dark pattern de consentement** : placer le mode "sans recommandations" dans un menu de 5 niveaux de profondeur, avec une interface qui le présente comme un désavantage ("Vous perdrez accès aux offres personnalisées")

**Correction des biais cognitifs**

Le biais de conformité industrielle ("tout le monde fait de la disclosure minimale dans la fintech") normalise des pratiques qui, vues sous l'angle de l'utilisateur, sont trompeuses. Le test éthique simple : "Si mes utilisateurs voyaient exactement comment ce système fonctionne, seraient-ils à l'aise ?" Si la réponse est non, la feature doit être repensée.

**Feedback itératif — changement de paradigme**

> Dans un produit qui touche à l'argent et à la vulnérabilité financière, la transparence n'est pas un risque business — c'est le fondement du seul modèle économique soutenable.

---

## Récapitulatif des changements de paradigmes

| Concept | Paradigme abandonné ❌ | Paradigme adopté ✅ |
|---------|----------------------|---------------------|
| Vision & Stratégie | "La roadmap EST la stratégie" | "La roadmap traduit la stratégie — elle est son artefact, pas son identité" |
| Métriques AAARRR | "Plus d'inscriptions = succès" | "L'activation est le vrai point de départ — tout le reste est du trafic" |
| Expérimentation | "Tester = avoir des données" | "Tester = valider une hypothèse causale avec un critère de succès pré-défini" |
| Éthique IA | "L'IA est objectif car basée sur des données" | "L'IA amplifie les biais encodés dans ses données — la supervision humaine est non-négociable" |
