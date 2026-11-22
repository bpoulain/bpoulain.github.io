# Section 2 — Recherche utilisateur & Data Insights — Exercices

> Fichier exercices avec corrections détaillées.
> Dernière mise à jour : 2026-04-24

---

## Table des matières

1. [Concept 1 — Recherche qualitative](#concept-1--recherche-qualitative)
2. [Concept 2 — Recherche quantitative](#concept-2--recherche-quantitative)
3. [Concept 3 — Synthèse & Storytelling des insights](#concept-3--synthèse--storytelling-des-insights)
4. [Concept 4 — Biais dans la recherche](#concept-4--biais-dans-la-recherche)

---

## Concept 1 — Recherche qualitative

> Interviews semi-directifs, shadowing, biais de désirabilité sociale

---

### BLOC 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :** Tu travailles en tant que Product Designer sur une application mobile de suivi de santé mentale destinée aux étudiants universitaires (18-25 ans). Le taux de complétion du parcours d'onboarding est de 34%. La PM te demande de comprendre pourquoi les utilisateurs abandonnent l'onboarding.

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle de la recherche qualitative ? Décris ta démarche, les types de questions que tu poserais, et à qui tu parlerais en priorité.

---

#### Exercice 2 — Piège de paradigme

**Contexte :** Une équipe produit d'une startup SaaS B2B (outil de gestion de projet) mène des entretiens utilisateurs pour comprendre pourquoi la fonctionnalité de reporting est peu utilisée. Voici l'extrait de leur guide d'entretien :

> *"Notre fonctionnalité de reporting vous semble-t-elle utile ?"*
> *"Pensez-vous qu'un meilleur design du tableau de bord vous inciterait à l'utiliser plus souvent ?"*
> *"Si on ajoutait des graphiques personnalisables, est-ce que ça changerait quelque chose pour vous ?"*
> *"Notez de 1 à 10 votre satisfaction envers notre outil de reporting."*

**Question :** Qu'est-ce qui ne va pas dans ce guide d'entretien ? Identifie au moins 4 problèmes distincts. Quels KPIs business et UX seraient affectés par les décisions prises à partir de ces données ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Researcher chez une plateforme e-commerce spécialisée dans la mode durable et éthique. La plateforme vient de lancer une section "Impact environnemental" sur chaque fiche produit (empreinte carbone, conditions de fabrication, certifications). Le taux de clic sur cette section est de 8%, bien en dessous des 25% espérés.

La CMO pense que le problème est le design. La CPO pense que les utilisateurs ne sont pas intéressés par l'impact. La Head of Sustainability pense que les informations ne sont pas assez détaillées.

**Ta mission :** Concevoir et mener une campagne de recherche qualitative pour comprendre réellement ce qui se passe. La dimension éthique est centrale : ton produit est censé démocratiser la consommation responsable, mais tu dois éviter de projeter tes propres valeurs sur les utilisateurs.

1. Décris ton **modèle mental AVANT de commencer** : quelles hypothèses fais-tu ? Quels biais risques-tu d'apporter ?
2. Détaille ta **méthodologie de recherche** : méthodes choisies, profils recrutés, guide d'entretien (5 questions clés), protocole de shadowing si pertinent.
3. Quels **KPIs** suivrais-tu pour valider l'impact de tes recommandations, une fois implémentées ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Le bon réflexe est de résister à l'interprétation immédiate (onboarding trop long, trop complexe, etc.) et de d'abord comprendre *qui* abandonne, *à quelle étape* et *dans quel contexte*. L'onboarding d'une app de santé mentale pour étudiants est un terrain particulièrement sensible : la friction n'est pas seulement UX, elle est émotionnelle et sociale.

**Raisonnement UX/Product**

Un taux de complétion de 34% sur un onboarding de santé mentale ne dit rien par lui-même. Il faut distinguer :
- Les abandons dus à la friction technique (formulaires trop longs, demandes de permissions incompréhensibles)
- Les abandons dus à l'anxiété ou à la résistance émotionnelle (peur du jugement, sentiment d'exposition)
- Les abandons dus à une inadéquation entre les attentes et la réalité du produit (l'utilisateur découvre que l'app ne correspond pas à ce qu'il cherchait)

Ces trois profils d'abandon nécessitent des réponses radicalement différentes.

**Solution détaillée**

*Étape 1 — Avant les entretiens : analyse quantitative préalable*
Consulter les données d'analytics pour identifier l'étape précise d'abandon (step-by-step funnel de l'onboarding). Si 70% abandonnent à l'étape "Quels sont tes symptômes actuels ?", le problème n'est pas le même que si l'abandon est diffus sur tout le parcours.

*Étape 2 — Recrutement*
- 8 à 12 participants (saturation thématique attendue rapidement sur ce sujet)
- 3 profils : utilisateurs ayant complété l'onboarding, utilisateurs ayant abandonné (recrutés via email de réactivation), et étudiants n'ayant jamais téléchargé l'app (pour comprendre les représentations a priori)
- Attention au recrutement inclusif : inclure des étudiants en situation de handicap psychique, des étudiants internationaux (rapport différent à la santé mentale selon les cultures), des étudiants en dehors des grandes villes

*Étape 3 — Méthode : entretiens semi-directifs + diary study courte*
L'entretien seul est insuffisant ici : les sujets liés à la santé mentale activent fortement le biais de désirabilité sociale (les participants tendent à donner la réponse "saine" plutôt que la réponse vraie). Compléter avec une diary study sur 5 jours : les participants notent leurs pensées et émotions lors de chaque interaction avec l'app.

*Questions clés d'entretien (extraits) :*
- "Raconte-moi ce qui t'a amené à télécharger cette application. Qu'est-ce que tu espérais trouver ?"
- "La dernière fois que tu as ouvert l'app, décris-moi exactement ce qui s'est passé, étape par étape."
- "Y a-t-il eu un moment où tu as hésité ? Qu'est-ce qui s'est passé dans ta tête à ce moment-là ?"
- "Comment tu te sentirais si un ami voyait ce que tu remplissais dans cette app ?"
- "Qu'est-ce qui t'aurait aidé à continuer ?"

*Dimension éthique critique :*
Le consentement éclairé doit expliquer que l'entretien portera sur des sujets potentiellement sensibles. Avoir un protocole de sortie si un participant manifeste une détresse psychologique. Ne jamais analyser les données en suggérant que le problème est "l'utilisateur". La stigmatisation de la santé mentale est un vrai obstacle systémique, pas une lacune de l'UX.

**KPIs impactés**

UX :
- Taux de complétion de l'onboarding (objectif : de 34% → 60%+)
- SUS (System Usability Scale) — mesure la perception de facilité et de contrôle
- Taux de désinstallation dans les 7 premiers jours
- Nombre moyen d'étapes complétées avant abandon (funnel granulaire)

Business :
- DAU/MAU ratio (indicateur d'engagement habituel — critique pour une app de santé)
- Rétention J7 et J30
- NPS — sur ce type de produit, un NPS négatif a un impact direct sur l'acquisition (bouche à oreille négatif dans les campus)
- Taux de conversion vers l'abonnement premium (dépend de l'onboarding)

**Erreurs classiques**

- Recruter uniquement des utilisateurs qui ont complété l'onboarding (biais de survivant pur)
- Poser des questions sur le design avant de comprendre les motivations
- Interpréter l'abandon comme un problème d'UX alors qu'il peut être culturel ou émotionnel
- Ne pas prévoir de protocole de sécurité pour les participants vulnérables

**Correction du biais cognitif**

Le biais de disponibilité : l'équipe pense spontanément "l'onboarding est trop long" parce que c'est la critique la plus commune dans d'autres contextes. La recherche qualitative sert précisément à défaire ces patterns automatiques.

**Améliorations possibles**

Associer un·e psychologue ou un·e travailleur·euse social·e à la conception du guide d'entretien pour les sujets liés à la santé mentale. Explorer le concept de "progressive disclosure" dans l'onboarding — demander le minimum viable d'informations au départ, collecter le reste progressivement sur les 7 premiers jours d'usage.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Un bon guide d'entretien est un outil d'exploration, pas de validation. Il doit générer de la surprise, pas confirmer des hypothèses. Chaque question de ce guide est conçue (consciemment ou non) pour orienter les réponses.

**Problèmes identifiés**

*Problème 1 — Questions fermées induisant une réponse positive*
"Notre fonctionnalité de reporting vous semble-t-elle utile ?" — La formulation contient l'implication que la fonctionnalité existe et mérite d'être jugée utile. La plupart des participants répondront "oui" par politesse ou par peur de blesser l'interviewer (biais de désirabilité sociale). Question refactorisée : "Racontez-moi comment vous rendez compte de l'avancement d'un projet à votre équipe ou à votre hiérarchie."

*Problème 2 — Question hypothétique et suggestive*
"Pensez-vous qu'un meilleur design du tableau de bord vous inciterait à l'utiliser plus souvent ?" — La question suppose que (a) le problème est le design, (b) l'utilisateur *voudrait* utiliser la fonctionnalité plus souvent. Elle plante l'hypothèse dans la tête du participant. Ce que les gens disent qu'ils feraient dans un hypothétique ne prédit pas leur comportement réel.

*Problème 3 — Proposition de fonctionnalité pendant la recherche découverte*
"Si on ajoutait des graphiques personnalisables..." — C'est du concept testing déguisé en entretien exploratoire. L'utilisateur n'a aucune base d'expérience réelle pour évaluer quelque chose qu'il n'a pas utilisé. Cette question génère de faux positifs (les gens disent "oui" aux nouvelles fonctionnalités par défaut). ❌ Dark pattern de recherche : présenter une feature list pendant la discovery pour valider des décisions déjà prises.

*Problème 4 — Échelle numérique sans contexte comportemental*
"Notez de 1 à 10 votre satisfaction" — Une note isolée est inutile sans comprendre ce qu'elle mesure. Un utilisateur qui note 6/10 parce qu'il n'a jamais vraiment utilisé la fonctionnalité versus un utilisateur qui note 6/10 parce qu'il l'utilise quotidiennement mais trouve la vitesse de chargement insuffisante — ces deux notes sont incomparables. Le score doit toujours être ancré dans un comportement réel.

*Problème 5 (bonus) — Centrage produit au lieu de centrage utilisateur*
L'ensemble du guide part du produit ("notre fonctionnalité") et non de l'utilisateur ("votre façon de travailler"). Une recherche qualitative efficace commence par comprendre le travail à accomplir (Jobs-to-be-Done) avant même de mentionner le produit.

**KPIs affectés par de mauvaises décisions issues de ces données**

Si l'équipe se base sur ces entretiens pour décider de refactoriser le design du reporting :
- Feature adoption rate : restera bas, car le problème n'est probablement pas le design
- Time-to-value : non amélioré si le vrai problème est la découvrabilité ou la pertinence de la fonctionnalité
- Churn B2B : les clients SaaS B2B churnent quand ils ne voient pas la valeur — un reporting mal compris contribue à l'invisibilité de la valeur délivrée
- ROI UX : investissement en redesign sans impact mesurable = justification future de la recherche utilisateur compromise

**Erreurs classiques**

- Confondre guide d'entretien et sondage de satisfaction
- Utiliser la recherche utilisateur pour valider des décisions déjà prises (HiPPO-driven research)
- Négliger la distinction entre ce que les utilisateurs disent vouloir et ce dont ils ont besoin

**Correction du biais cognitif**

Biais de confirmation : l'équipe cherche inconsciemment à prouver que le problème est le design (car c'est ce qu'elle peut contrôler et livrer rapidement). La bonne recherche qualitative doit activement chercher à infirmer ses propres hypothèses.

---

#### Correction — Exercice 3

**Modèle mental AVANT de commencer (attendu)**

Un bon chercheur explicite ses biais avant de commencer. Dans ce cas :
- Hypothèse personnelle probable : "Les utilisateurs *devraient* s'intéresser à l'impact environnemental — c'est important." → Risque de projeter ses propres valeurs et de voir des signaux d'intérêt là où il n'y en a pas.
- Hypothèse de la CMO ("c'est le design") : plausible mais ne devrait jamais être le point de départ d'une recherche qualitative.
- L'écart attitude/comportement est massif dans tout ce qui concerne la consommation responsable : les gens disent se soucier de l'environnement, mais leurs achats ne le reflètent pas toujours. C'est l'un des biais les plus documentés en consumer research.

**Méthodologie de recherche détaillée**

*Phase 1 — Entretiens contextuels (8-10 participants, 60 min chacun)*

Profils recrutés (critère de diversité intentionnel) :
- 3 utilisateurs qui ont cliqué sur la section Impact (qui "convertissent" — comprendre pourquoi)
- 4 utilisateurs qui ne l'ont jamais cliqué malgré des visites régulières
- 2 utilisateurs qui ont abandonné une session au moment de consulter une fiche produit
- Attention : recruter des profils socio-économiques variés (la mode éthique est souvent perçue comme un luxe), des profils de genre variés, et au moins 2 participants en situation de handicap visuel ou moteur (la section Impact est-elle accessible ?)

Guide d'entretien — 5 questions clés :
1. "Raconte-moi comment tu choisis un vêtement en ligne. Montre-moi ce que tu regardes en premier, en second — prends ton temps."
2. "La dernière fois que tu as acheté quelque chose sur cette plateforme, décris-moi ce qui t'a convaincu d'acheter ou de ne pas acheter."
3. "Tu as vu cette section [montrer la section Impact]. Qu'est-ce que tu comprends quand tu la regardes ? Qu'est-ce qu'elle t'inspire ?"
4. "Est-ce qu'il y a des moments où tu regardes ce type d'information et des moments où tu ne le regardes pas ? Qu'est-ce qui change ?"
5. "Si tu devais expliquer à quelqu'un de ton entourage pourquoi tu achètes (ou pas) sur une plateforme de mode éthique, qu'est-ce que tu dirais ?"

*Phase 2 — Sessions de shadowing/think-aloud sur mobile (5 participants, 30 min)*
Observer des utilisateurs naviguer sur la plateforme en situation réelle (ou simulée en labo), sur leur propre téléphone. Demander de penser à voix haute. L'objectif est de voir ce que l'oeil suit spontanément vs. ce qui est déclaré en entretien.

*Dimension éthique centrale :*
- Ne pas recruter uniquement des participants déjà convaincus par la consommation responsable (biais de recrutement militant)
- Ne pas formuler les questions de façon à culpabiliser les participants qui ne regardent pas la section Impact
- Les données sur les comportements d'achat sont sensibles : expliquer clairement l'usage des données collectées
- Vérifier que la section Impact elle-même ne contient pas de greenwashing — le chercheur doit signaler si les informations affichées sont trompeuses ou inaccessibles aux personnes non expertes

**KPIs à suivre après implémentation des recommandations**

UX :
- Taux de clic sur la section Impact (objectif : de 8% → 25%+ cible initiale)
- Temps passé sur la section Impact (si court → contenu non lu, si très long → contenu confus ?)
- Task success rate : "Trouve l'empreinte carbone de ce produit" — peut-on accomplir cette tâche facilement ?
- SUS sur la fiche produit globale
- Taux d'accessibilité WCAG sur la section Impact (score d'audit automatisé + test avec utilisateurs malvoyants)

Business :
- Taux de conversion des fiches produit avec fort score Impact vs. sans (A/B test)
- Average Order Value : les utilisateurs qui consultent Impact achètent-ils des produits plus chers / plus durables ?
- NPS segmenté par profil d'engagement avec la section Impact
- Taux de rétention à 90 jours des acheteurs "Impact-engagés" vs. non-engagés
- Panier abandonné sur les fiches avec section Impact visible vs. cachée (corrélation ≠ causalité)

**Erreurs classiques**

- Conclure que "les utilisateurs ne sont pas intéressés" après un seul type de recherche
- Traiter le taux de clic de 8% comme un échec sans segmenter (8% de qui ? À quelle étape du tunnel ? Sur quel device ?)
- Projeter la valeur environnementale du produit sur les attentes des utilisateurs
- Ignorer les barrières économiques : certains utilisateurs *veulent* consommer responsable mais sont bloqués par le prix, pas par le manque d'information

**Correction des biais cognitifs**

Le biais d'attribution : les trois parties prenantes (CMO, CPO, Head of Sustainability) attribuent le problème à leur domaine de responsabilité respectif. Aucune n'a tort, mais toutes pensent en silo. La recherche qualitative doit produire une narrative unifiée qui transcende les périmètres organisationnels.

**Améliorations possibles**

Ajouter une phase de co-design avec des utilisateurs pour co-construire une version améliorée de la section Impact. Tester si une "progressive disclosure" (afficher d'abord l'essentiel, avec option d'aller plus loin) améliore l'engagement. Explorer des formats alternatifs : comparaison visuelle, score simplifié, storytelling de la chaîne de fabrication.

---

**Feedback itératif — Changement de paradigme**

> La recherche qualitative n'est pas là pour confirmer ce qu'on pense savoir, mais pour découvrir ce qu'on ne savait pas qu'on ne savait pas.

---

## Concept 2 — Recherche quantitative

> Funnels de conversion, cohort analysis, lecture de heatmaps

---

### BLOC 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :** Tu rejoins l'équipe produit d'un SaaS B2B de facturation pour PME. Le Head of Product te présente ce chiffre : "Notre taux de conversion trial-to-paid est de 12%." Il te demande si c'est bon ou mauvais.

**Question :** Comment aborderais-tu l'interprétation de ce KPI avec ta compréhension actuelle ? Quelles questions poserais-tu avant de conclure ? Quelles données complémentaires demanderais-tu ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :** L'équipe produit d'une plateforme éducative en ligne analyse ses heatmaps de la page d'accueil. Voici leurs conclusions :

> *"La heatmap montre que les utilisateurs cliquent massivement sur le carrousel de témoignages en haut de page. On va donc agrandir ce carrousel et en ajouter un deuxième en milieu de page. Par ailleurs, le bouton CTA 'Commencer gratuitement' en bas de page n'est presque pas cliqué — on va le retirer pour simplifier la page."*

**Question :** Qu'est-ce qui ne va pas dans cette analyse et ces décisions ? Identifie les erreurs méthodologiques. Quels KPIs risquent d'être dégradés par ces décisions ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es Product Analyst chez une application mobile de fitness (abonnement mensuel, audience 25-45 ans, mix urban/péri-urban). L'équipe observe les données suivantes sur les 90 derniers jours :

| Cohorte | Semaine d'inscription | Rétention J7 | Rétention J30 | Rétention J90 |
|---|---|---|---|---|
| A | Semaine 1 | 68% | 41% | 22% |
| B | Semaine 5 | 71% | 38% | 19% |
| C | Semaine 9 | 74% | 29% | 11% |
| D | Semaine 13 | 69% | 24% | — |

La PM dit : "La cohorte C a la meilleure rétention J7 mais la pire à J30. Quelque chose s'est passé à la semaine 9."

Par ailleurs, une heatmap de l'écran d'accueil post-login révèle que 78% des interactions se concentrent sur une bannière promotionnelle "Défi du mois", et que le bouton "Reprendre ma séance" (fonctionnalité principale) n'est cliqué que par 23% des utilisateurs actifs.

**Question :**
1. Décris ton **modèle mental AVANT d'analyser** : quelles hypothèses plausibles pour expliquer ce pattern de cohortes ?
2. Quelles **données complémentaires** demanderais-tu pour confirmer ou infirmer tes hypothèses ?
3. Que lis-tu dans la **heatmap** et quelles recommandations en tires-tu ?
4. Quels **KPIs** suivrais-tu après tes recommandations ? Identifie aussi la **dimension éthique** de l'usage d'une heatmap sur une app santé.

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Un KPI isolé n'a aucune valeur sans contexte. 12% de conversion trial-to-paid peut être excellent (si la médiane du secteur est 8%) ou catastrophique (si des concurrents directs sont à 25%). Le bon réflexe est de ne jamais interpréter un chiffre sans son contexte sectoriel, sa tendance temporelle, et sa décomposition par segment.

**Questions à poser avant de conclure**

1. *Benchmark sectoriel :* Quelle est la médiane de conversion trial-to-paid pour un SaaS B2B de facturation sur ce segment de marché ? (Généralement 15-25% selon les benchmarks SaaS)
2. *Tendance temporelle :* Ce 12% est-il stable, en hausse ou en baisse sur les 6 derniers mois ? Un 12% en hausse depuis 8% est très positif ; un 12% en baisse depuis 22% est une alarme.
3. *Décomposition par segment :* Quelle est la conversion par taille d'entreprise (TPE vs. PME), par canal d'acquisition, par géographie ? Un 12% agrégé peut cacher un 5% sur les PME (problème produit) et un 30% sur les TPE (produit très adapté à ce segment).
4. *Durée du trial :* 12% sur un trial de 7 jours vs. 30 jours sont incomparables. Un trial plus court a mécaniquement un taux de conversion plus bas.
5. *Définition de "trial" :* Inclut-on les utilisateurs qui n'ont jamais connecté après inscription ? Si oui, le taux réel d'utilisateurs actifs-en-trial qui convertissent est peut-être 30%.
6. *Time-to-convert :* Combien de jours après le début du trial les utilisateurs convertissent-ils ? Si la majorité convertit au dernier jour, cela indique un manque de valeur perçue pendant le trial.

**Données complémentaires à demander**

- Funnel détaillé du trial : inscription → première action clé (création d'une facture) → 3 actions clés → conversion
- Taux d'activation (premier usage de la fonctionnalité principale dans les 24h)
- Feature adoption par les utilisateurs qui convertissent vs. ceux qui ne convertissent pas
- NPS en fin de trial des non-convertis (si collecté)
- Motifs de non-conversion (enquête courte à la sortie du trial)

**KPIs impactés**

UX :
- Time-to-value (temps entre inscription et premier "aha moment")
- Task success rate sur les 3 actions fondamentales du trial

Business :
- MRR (Monthly Recurring Revenue) — directement corrélé au trial-to-paid
- CAC (Customer Acquisition Cost) — si le taux de conversion baisse, le CAC effectif augmente
- LTV/CAC ratio — indicateur de santé globale du modèle SaaS

**Erreurs classiques**

- Décider d'actions (améliorer l'onboarding, changer le pricing) avant de comprendre *où* dans le funnel trial la valeur n'est pas perçue
- Comparer à des benchmarks génériques SaaS sans qualifier le segment précis

**Correction du biais cognitif**

Biais d'ancrage : le premier chiffre entendu (12%) devient la référence à partir de laquelle on raisonne. Forcer la question "12% de quoi exactement ?" brise l'ancrage.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Une heatmap mesure les interactions, pas l'intention ni la valeur. Un fort taux de clics peut indiquer de l'engagement positif, mais aussi de la confusion, une fausse affordance, ou un élément qui attire l'attention au détriment de la conversion. Analyser une heatmap sans croiser avec d'autres données (clickmaps, scrollmaps, analytics de conversion, sessions recordings) est une erreur méthodologique structurelle.

**Erreurs identifiées**

*Erreur 1 — Confondre interaction et valeur*
Le carrousel de témoignages "massivement cliqué" : les carousels génèrent souvent des clics de navigation (flèches précédent/suivant) qui sont comptabilisés dans les heatmaps comme des clics "d'intérêt". Ce n'est pas la même chose qu'un clic intentionnel vers une conversion. Il faut segmenter : quels utilisateurs ont cliqué sur le carrousel *et* ont ensuite converti ?

*Erreur 2 — Décision additive sans test*
"On va agrandir le carrousel et en ajouter un deuxième" — Augmenter un élément déjà dominant risque d'écraser les autres éléments d'une page et de noyer le CTA principal. Sans A/B test, cette décision est une prise de risque non mesurée.

❌ Dark pattern potentiel : un carrousel de témoignages peut être utilisé pour créer une pression sociale artificielle sur les visiteurs. Si les témoignages sont sélectifs (uniquement les meilleurs), c'est une pratique de manipulation.

*Erreur 3 — Retirer le CTA bas de page parce qu'il est peu cliqué*
C'est une erreur classique de lecture de heatmap. Un CTA peu cliqué en bas de page n'est peut-être pas vu (problème de scroll depth), pas encore pertinent pour l'utilisateur à ce stade de lecture, ou pas assez visible. La solution n'est pas de le supprimer, mais de comprendre pourquoi il sous-performe. Un CTA bas de page capture les utilisateurs les plus motivés (ceux qui ont lu toute la page) — les supprimer revient à éliminer un filet de sécurité de conversion.

*Erreur 4 — Absence de segmentation*
La heatmap est analysée en masse. Un nouveau visiteur et un utilisateur revenant ont des comportements radicalement différents sur la même page. Analyser les heatmaps segmentées (nouveaux vs. récurrents, mobile vs. desktop, trafic organique vs. paid) aurait peut-être révélé que le carrousel n'est massivement cliqué que par les mobiles, et que le CTA bas de page convertit très bien sur desktop.

**KPIs qui risquent d'être dégradés**

UX :
- Taux de conversion page d'accueil → inscription (dégradé si on supprime le CTA)
- Taux de rebond (aggravé si la page est surchargée de carrousels)
- SUS — une page surchargée dégrade la perception de clarté

Business :
- Conversion trial/inscription (impact direct de la suppression du CTA)
- ROI des campagnes d'acquisition (si la landing page est moins efficace, le coût par lead augmente)

**Erreurs classiques**

- Traiter la heatmap comme une preuve et non comme une hypothèse
- Ne pas croiser avec les données de conversion réelle (GA4, Mixpanel)
- Ignorer la dimension temporelle : la heatmap d'une journée n'est pas représentative

---

#### Correction — Exercice 3

**Modèle mental AVANT d'analyser (attendu)**

Hypothèses plausibles pour le pattern de cohortes :

- Hypothèse 1 (Événement externe) : quelque chose s'est passé à la semaine 9 qui a attiré un profil d'utilisateurs différent (campagne marketing agressive, presse, influenceur). Ces utilisateurs ont une motivation initiale plus faible (intérêt de curiosité vs. intention réelle de changement de comportement). Cela expliquerait une bonne rétention J7 (curiosité) mais un fort abandon à J30.
- Hypothèse 2 (Changement produit) : une mise à jour publiée autour de la semaine 9 a introduit une friction, un bug, ou une modification de l'expérience qui dégrade la valeur perçue après J7.
- Hypothèse 3 (Saisonnalité) : la semaine 9 correspond peut-être à une période où les gens prennent des bonnes résolutions (rentrée de septembre, janvier…) mais abandonnent rapidement.
- Hypothèse 4 (Changement de pricing ou d'offre) : un essai gratuit étendu ou une promotion à la semaine 9 a attiré des utilisateurs peu engagés à long terme.

**Données complémentaires à demander**

- Source d'acquisition par cohorte (organique, paid, influenceur) : tester l'hypothèse 1
- Changelog produit : tester l'hypothèse 2
- Calendrier marketing : tester les hypothèses 1, 3 et 4
- Feature adoption rate par cohorte : les cohortes C et D utilisent-elles les mêmes fonctionnalités que A et B ?
- Session recordings de J7 à J30 pour la cohorte C : où se déconnectent-ils ?
- NPS ou in-app survey à J14 pour la cohorte C

**Lecture de la heatmap**

Le pattern heatmap (78% sur la bannière promotionnelle, 23% sur "Reprendre ma séance") est un signal d'alarme fort :

- La fonctionnalité principale de l'app (reprendre sa séance d'entraînement) est reléguée par un élément promotionnel. C'est une inversion de valeur : l'interface optimise pour l'engagement court terme (clic sur le défi du mois) au détriment de l'habitude à long terme (reprendre sa routine d'entraînement).
- Un utilisateur qui revient sur l'app pour s'entraîner et doit chercher "Reprendre ma séance" est un utilisateur qui va churnner à J30. La friction d'accès à la valeur principale est un prédicteur de rétention négatif.

Recommandations heatmap :
1. Remonter "Reprendre ma séance" en position primaire (première interaction disponible dès l'ouverture de l'app)
2. Réduire la bannière promotionnelle à un élément secondaire (pas suppression — la gamification est utile, mais elle ne doit pas concurrencer l'action principale)
3. A/B tester les deux layouts sur la cohorte D avant de déployer globalement
4. Mesurer l'impact sur la rétention J30 de la cohorte D vs. les précédentes

**Dimension éthique des heatmaps sur une app santé**

Les heatmaps enregistrent les interactions des utilisateurs à leur insu dans la plupart des implémentations. Sur une app de santé/fitness :
- Les données de comportement d'usage peuvent révéler des patterns de santé sensibles (fréquence d'entraînement, plages horaires, etc.)
- Le RGPD impose un consentement explicite pour la collecte de données comportementales — vérifier que les outils heatmap (Hotjar, FullStory) sont correctement configurés et que les données de santé sont exclues
- Les décisions d'interface basées sur la maximisation des clics (dark patterns de gamification) peuvent créer des comportements compulsifs chez des utilisateurs vulnérables (troubles du comportement alimentaire, orthorexie, addiction à l'exercice)
- ❌ Dark pattern : une bannière "Défi du mois" qui monopolise 78% des clics peut être conçue pour maximiser l'engagement au détriment de la santé réelle de l'utilisateur

**KPIs à suivre après recommandations**

UX :
- Rétention J30 et J90 par cohorte (indicateur principal)
- Taux d'accès à "Reprendre ma séance" dans les 30 premières secondes post-login
- Session length et fréquence de sessions (engagement sain vs. engagement compulsif)
- SUS — facilité d'accès à la fonctionnalité principale

Business :
- Churn rate mensuel (corrélé à la rétention J30)
- LTV par cohorte d'acquisition
- MRR stability (une app fitness qui churne massivement à J30 a un MRR très volatil)
- NPS segmenté par niveau d'engagement avec la fonctionnalité principale

**Erreurs classiques**

- Traiter la cohorte analysis comme une réponse au lieu d'une question
- Optimiser pour l'engagement (clics, sessions) sans corriger pour la valeur (séances complétées, objectifs atteints)
- Ignorer la saisonnalité dans l'interprétation des cohortes

**Correction des biais cognitifs**

Biais du survivant : on analyse les cohortes à partir de ce qui est visible (les utilisateurs qui reviennent). Les utilisateurs perdus après J1 ou J3 sont invisibles dans cette analyse — ils représentent pourtant le volume d'abandon le plus massif.

**Améliorations possibles**

Mettre en place une notification push de récupération à J14 pour les cohortes à fort risque de churn (rétention J7 > 70% mais baisse brutale identifiée). Corréler les données de rétention avec les données d'usage réel (nombre de séances complétées vs. juste ouverture de l'app — distinction entre DAU engagement profond vs. superficiel).

---

**Feedback itératif — Changement de paradigme**

> Les données quantitatives te disent *que* quelque chose se passe — seule la recherche qualitative te dira *pourquoi* ; les deux ensemble te permettent d'agir.

---

## Concept 3 — Synthèse & Storytelling des insights

> Passage de données brutes à narrative actionnable, affinity mapping

---

### BLOC 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :** Tu viens de mener 10 entretiens utilisateurs pour une application de téléconsultation médicale. Tes notes font 47 pages. Dans 48h, tu dois présenter tes findings à la CPO, au Head of Engineering et au Head of Medical Affairs. Chacun a des attentes différentes.

**Question :** Comment aborderais-tu la synthèse de ces 10 entretiens ? Par où commences-tu ? Comment décides-tu de ce qui est important ? Comment structures-tu ta présentation pour des audiences aux préoccupations différentes ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :** Voici la synthèse qu'une UX Researcher a produite après 8 entretiens avec des enseignants utilisant une plateforme éducative numérique :

> *"100% des enseignants interrogés trouvent l'interface confuse. 87% aimeraient plus de personnalisation. Les enseignants veulent une meilleure intégration avec leurs outils existants. Conclusion : il faut refaire l'interface, ajouter des options de personnalisation et intégrer les outils tiers."*

**Question :** Qu'est-ce qui ne va pas dans cette synthèse ? Identifie les problèmes de méthode, de narration et de logique. Comment aurait-elle dû être structurée ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es Lead UX Researcher dans une startup qui développe un outil de gestion RH pour des entreprises de 50 à 500 employés. L'outil inclut : gestion des congés, suivi de performance, onboarding des nouveaux employés, et communication interne.

Tu viens de terminer une phase de recherche mixte :
- 12 entretiens avec des responsables RH
- 6 sessions de shadowing d'un responsable RH pendant une semaine
- Un sondage quantitatif (n=240 RH managers) révélant : 71% déclarent "perdre du temps sur des tâches administratives répétitives", 58% disent "manquer de visibilité sur l'engagement des employés", 34% signalent "des tensions liées à la communication des décisions RH"

Tu dois maintenant :
1. Créer un **affinity map** (décris les clusters que tu formerais et leur logique)
2. Transformer ces données en **narrative actionnable** pour deux audiences : l'équipe produit (qui veut des features à prioriser) et le board (qui veut comprendre l'opportunité business)
3. Identifier les **dimensions éthiques** de la synthèse de données RH
4. Définir les **KPIs** qui valideront tes recommandations

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

La synthèse n'est pas un résumé — c'est une transformation. On passe de données brutes (verbatims, observations, patterns) à une narrative qui permet la décision. Le critère de qualité d'une synthèse n'est pas l'exhaustivité, mais l'actionnabilité : est-ce que les décideurs peuvent agir différemment après avoir lu/entendu ça ?

**Méthode de synthèse structurée**

*Étape 1 — Codage des données (2-3h)*
Lire toutes les notes et identifier les unités d'observation significatives (phrases, comportements, citations). Les tagger avec des codes thématiques. Ne pas chercher à interpréter à ce stade — juste catégoriser.

*Étape 2 — Affinity mapping*
Regrouper les codes similaires en clusters. Un cluster représente un pattern récurrent (observé chez au moins 3 participants sur 10). Nommer chaque cluster par un verbe-action qui décrit ce que l'utilisateur essaie de faire ("Rassurer le patient avant la consultation", "Gérer l'attente quand le médecin est en retard"...).

*Étape 3 — Identification des tensions et contradictions*
Les insights les plus puissants ne sont pas les choses que tout le monde dit, mais les contradictions : "Les patients disent vouloir plus d'information, mais semblent anxieux quand on leur en donne trop." Ces tensions sont les leviers de design.

*Étape 4 — Articulation des insights actionnables*
Un insight actionnable a la structure : **[Observation]** + **[Conséquence pour l'utilisateur]** + **[Opportunité produit]**
Exemple : "Les patients hésitent à poser des questions médicales par chat avant la consultation [observation] parce qu'ils craignent que ça soit perçu comme une demande urgente [conséquence] → Distinguer visuellement les messages 'questions de préparation' des signalements d'urgence [opportunité produit]."

*Adaptation aux audiences*

Pour la CPO : insights structurés par ordre de priorité d'impact produit, avec recommendation et métriques de succès associées.
Pour le Head of Engineering : insights traduits en besoins fonctionnels avec niveau de complexité estimé (haut/moyen/faible).
Pour le Head of Medical Affairs : insights sur les comportements de santé, les risques perçus, les besoins de réassurance médicale.

Ne pas faire une présentation unique pour les trois : un slide deck avec une section par audience, ou trois formats différents (PDF résumé exécutif pour le Head of Medical Affairs, Notion doc pour l'équipe produit).

**KPIs impactés**

UX :
- Task success rate sur les actions clés identifiées comme problématiques dans les entretiens
- SUS post-correctifs

Business :
- NPS médecins (si les insights portent sur leur expérience)
- Taux d'abandon de consultation (si l'anxiété pré-consultation est un insight clé)
- Taux d'adoption des nouvelles fonctionnalités issues des recommandations

**Erreurs classiques**

- Présenter les verbatims bruts sans interprétation (le chercheur doit faire le travail d'analyse, pas déléguer l'interprétation aux décideurs)
- Présenter trop d'insights (plus de 5 insights actionnables dans une présentation = dilution de l'attention)
- Ne pas indiquer la fréquence (combien de participants sur combien ont exprimé/vécu ça ?)

**Correction du biais cognitif**

Biais de représentativité : les verbatims les plus marquants (les plus émouvants, les plus surprenants) ont tendance à être surpondérés dans la mémoire du chercheur. L'affinity mapping force une pondération par fréquence, pas par saillance émotionnelle.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Une bonne synthèse UX n'est pas une liste de faits agrégés et de conclusions linéaires. Elle doit articuler *pourquoi* les utilisateurs font ce qu'ils font, pas seulement *ce qu'ils veulent*.

**Problèmes identifiés**

*Problème 1 — Usage trompeur des pourcentages sur un petit échantillon*
"100% des enseignants" et "87% aimeraient" sur n=8 participants. Utiliser des pourcentages sur 8 personnes est statistiquement invalide et crée une fausse impression de certitude quantitative. Sur n=8, on dit "tous les participants" ou "la grande majorité" — jamais un pourcentage chiffré.

*Problème 2 — Synthèse de déclarations, pas de comportements*
"Les enseignants veulent une meilleure intégration" — C'est une reformulation de ce que les participants ont dit, pas une analyse de ce qu'ils font réellement. La recherche qualitative doit aller au-delà du déclaratif. Pourquoi l'intégration manque-t-elle ? Quel workaround ont-ils développé ? Quel est le coût réel de cette friction ?

*Problème 3 — Conclusions prescriptives sans priorisation ni trade-off*
"Refaire l'interface + personnalisation + intégration outils tiers" = trois chantiers massifs présentés comme une liste de souhaits. Une bonne synthèse UX priorise, identifie les trade-offs et propose des solutions à différents niveaux de complexité.

*Problème 4 — Absence de narrative causale*
Il n'y a aucun fil narratif. La vraie question est : quel est le problème central que vivent ces enseignants, et comment les trois frictions identifiées s'articulent-elles autour de ce problème central ? Une narrative pourrait être : "Les enseignants passent plus de temps à gérer la plateforme qu'à enseigner, ce qui crée une charge cognitive qui réduit la qualité de leur préparation pédagogique."

*Problème 5 — Pas de dimension éthique*
Sur une plateforme éducative, des insights sur la charge de travail des enseignants ont des implications sur leur santé au travail et leur burnout. Une synthèse responsable le signale.

**Structure corrigée**

1. Insight central : une phrase qui capture l'enjeu fondamental
2. Preuves comportementales : 3-4 observations concrètes qui illustrent l'insight (avec verbatims choisis)
3. Conséquences pour l'utilisateur et pour le produit
4. Opportunités prioritaires : 2-3 recommandations classées par impact/effort
5. Questions ouvertes : ce que la recherche n'a pas pu répondre

**KPIs impactés si les mauvaises décisions sont prises**

- Effort de développement mal alloué (refaire l'interface = 3-6 mois de dev sur hypothèse non validée)
- Feature adoption rate potentiellement faible si les fonctionnalités ajoutées ne répondent pas au vrai problème
- NPS enseignants non amélioré après refonte

---

#### Correction — Exercice 3

**Affinity map — Clusters et logique**

Cluster 1 — "La charge administrative invisible"
Contenu : toutes les observations sur les tâches répétitives, les double-saisies, les exports manuels, les emails pour des choses qui devraient être automatisées.
Logique : ce cluster répond au 71% quantitatif "perdre du temps sur des tâches administratives". Il s'ancre dans des comportements observés pendant le shadowing (combien de fois le RH a ouvert Excel pendant la semaine ?).

Cluster 2 — "L'opacité de l'engagement employé"
Contenu : difficultés à détecter les signaux faibles de désengagement, absence d'indicateurs lisibles, dépendance aux remontées managériales informelles.
Logique : répond au 58% quantitatif. Croiser avec les verbatims d'entretien : "Je découvre qu'un employé est malheureux quand il m'annonce sa démission."

Cluster 3 — "La communication RH perçue comme descendante et opaque"
Contenu : réactions négatives aux annonces de changement de politique, manque d'espace pour le feedback ascendant, sentiment des employés d'être informés mais pas consultés.
Logique : répond au 34% quantitatif sur les tensions. Dimension éthique forte ici.

Cluster 4 — "L'onboarding comme première impression jamais reprise"
Contenu : processus d'onboarding conçu une fois et jamais revu, inadapté aux nouvelles réalités (télétravail, diversité de profils), charge disproportionnée sur le RH pendant les premières semaines d'un nouvel employé.
Logique : observé pendant le shadowing (semaine de forte présence d'un nouveau collaborateur = semaine de chaos pour le RH).

Cluster 5 — "La conformité légale comme épée de Damoclès"
Contenu : crainte des erreurs de congés mal gérés, peur des non-conformités RGPD, anxiété autour des entretiens de performance (formulaires non standardisés).
Logique : non mentionné dans le quantitatif mais très présent dans les entretiens — insight émergent à ne pas ignorer.

**Narrative pour l'équipe produit**

> "Les responsables RH passent 40% de leur semaine à faire des choses que leur outil devrait faire à leur place. Le résultat : ils n'ont plus le temps pour ce qui crée vraiment de la valeur — détecter les signaux faibles, accompagner les transitions, être présents pour les managers. Notre opportunité : automatiser l'administratif pour libérer de l'espace pour l'humain.
>
> Priorités produit :
> 1. Automatisation des tâches répétitives (congés, rappels de performance) — impact immédiat sur le cluster 1
> 2. Dashboard d'engagement employé lisible et actionnable — cluster 2
> 3. Refonte du module onboarding pour le rendre autonome après paramétrage initial — cluster 4"

**Narrative pour le board**

> "Le marché des RH managers PME est sous-servi : les outils existants sont soit trop complexes (SIRH enterprise), soit trop basiques (tableurs). Notre recherche montre qu'un RH manager en PME perd en moyenne 15h/semaine sur des tâches qui pourraient être automatisées. Si on convertit ça en coût horaire moyen (45€/h), c'est 675€/semaine de valeur temps détruite — soit 35 000€/an par RH manager. Notre outil peut capturer une part de cette valeur. Sur un marché de 120 000 PME éligibles en France, l'opportunité est significative."

**Dimensions éthiques de la synthèse de données RH**

- Les données RH sont parmi les plus sensibles : comportements de performance, de présence, d'engagement peuvent révéler des situations de vulnérabilité (santé mentale, difficultés personnelles). Les synthèses d'insights ne doivent jamais identifier des individus.
- Le outil RH peut être utilisé pour surveiller les employés. La narrative produit doit inclure une réflexion sur les usages détournés : un "dashboard d'engagement employé" peut devenir un outil de surveillance si les indicateurs ne sont pas co-construits avec les employés eux-mêmes.
- ❌ Dark pattern : proposer un "score d'engagement" par employé visible par le management sans consentement des employés est une pratique de surveillance opaque.
- La dimension inclusive : les insights viennent de 12 responsables RH. Quelle est leur diversité ? Si tous sont des femmes de 35-50 ans en grandes villes, la narrative ne représente pas les RH managers en zones rurales, les TPE, ou les secteurs non-tertiaires.

**KPIs de validation des recommandations**

UX :
- Time-on-task pour les 5 actions RH les plus fréquentes (avant/après)
- SUS par profil d'usage (RH opérationnel vs. RH stratégique)
- Taux d'adoption des fonctionnalités d'automatisation dans les 60 premiers jours

Business :
- Churn rate (les RH managers qui gagnent du temps restent, ceux qui n'en gagnent pas partent)
- NPS segmenté par taille d'entreprise cliente
- Expansion revenue : les clients satisfaits upgraden-ils vers des fonctionnalités premium ?
- Réduction du temps de support (si l'outil est plus clair, moins de tickets)
- ROI UX déclaré : combien d'heures économisées par semaine (enquête trimestrielle clients)

**Erreurs classiques**

- Confondre affinity map et mind map (l'affinity map part des données, le mind map part des idées)
- Créer des clusters trop larges (un cluster "problèmes UX" qui contient tout n'aide personne)
- Produire une narrative unique pour toutes les audiences
- Présenter les insights comme des certitudes plutôt que comme des hypothèses à tester

**Correction des biais cognitifs**

Biais d'autorité du quantitatif : les chiffres du sondage (71%, 58%, 34%) tendent à dominer la narrative parce qu'ils semblent plus légitimes. Le chercheur doit s'assurer que les insights qualitatifs émergents (comme le cluster 5 sur la conformité légale) ont la même visibilité même sans chiffre associé.

**Améliorations possibles**

Valider la narrative avec 2-3 participants de la recherche avant présentation au board ("member checking" — est-ce que votre synthèse résonne avec leur réalité ?). Intégrer des verbatims directs dans la narrative pour ancrer les chiffres dans l'humain.

---

**Feedback itératif — Changement de paradigme**

> L'insight n'est pas ce que les utilisateurs ont dit — c'est ce que leurs mots révèlent sur ce qu'ils n'ont pas su dire.

---

## Concept 4 — Biais dans la recherche

> Biais d'échantillonnage, acquiescement, biais du chercheur, biais algorithmiques IA

---

### BLOC 1 — Exercices

---

#### Exercice 1 — Traduction mentale

**Contexte :** Tu es UX Researcher pour une néobanque qui développe un nouveau service de micro-épargne automatique. Pour tes entretiens de discovery, tu as recruté 10 participants via ta propre newsletter et tes réseaux sociaux professionnels (LinkedIn). 8 d'entre eux sont des CSP+ (cadres supérieurs, 30-45 ans), 7 vivent en Île-de-France, et tous ont un smartphone récent.

**Question :** Avec ta compréhension actuelle des biais de recherche, identifies-tu un problème dans ce recrutement ? Si oui, lequel, et quelles conséquences concrètes sur le produit final cela peut-il avoir ?

---

#### Exercice 2 — Piège de paradigme

**Contexte :** Une équipe produit développe un assistant IA pour aider les recruteurs à présélectionner des CV pour des postes dans la tech. Elle a utilisé un outil d'IA générative pour analyser 50 entretiens utilisateurs (avec des recruteurs) et en extraire des insights. L'IA a produit ce résumé :

> *"Les recruteurs valorisent les candidats avec des expériences dans des grandes entreprises connues, des diplômes d'écoles reconnues, et une présentation soignée du CV. Ils trouvent difficile d'évaluer des profils atypiques (autodidactes, reconversions) et prennent plus de temps sur ces profils. Recommandation : prioriser les profils avec des signaux de qualité reconnus pour réduire le temps de tri."*

**Question :** Identifie tous les biais présents dans cette situation. Quels seraient les impacts éthiques, sociaux et business de suivre cette recommandation ? Quels KPIs seraient trompeurs ici ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu rejoins l'équipe UX Research d'une grande plateforme de mise en relation entre freelances et entreprises (modèle marketplace B2B2C). L'équipe a mené une étude sur la satisfaction des freelances avec le processus de vérification des compétences (badge de compétences délivré après un test et une revue de portfolio).

Voici l'historique de la recherche :
- Les entretiens ont été conduits uniquement en français (plateforme disponible en 5 langues)
- Le recrutement a ciblé des freelances ayant au moins 3 missions complétées sur la plateforme (biais de survivant)
- Le guide d'entretien a été conçu par la PM qui a fortement envie de valider le système de badge (elle en est l'initiatrice)
- Les entretiens ont été menés par la PM elle-même
- Les insights ont été analysés via un outil d'IA qui a été entraîné sur des données de plateformes similaires principalement américaines

Le rapport final conclut : "Les freelances sont globalement satisfaits du système de badge. Quelques améliorations UX mineures sont suggérées."

**Question :**
1. Décris ton **modèle mental AVANT d'analyser** : combien de couches de biais identifies-tu dans cette étude ?
2. Propose un **audit de biais complet** : pour chaque biais identifié, évalue son impact sur la validité des résultats et propose une correction.
3. La dimension **éthique et inclusive** : quels groupes sont potentiellement invisibilisés par cette recherche ?
4. Si tu devais **reprendre cette étude de zéro**, quelle serait ta méthodologie ?
5. Quels **KPIs** permettraient de détecter les angles morts laissés par cette recherche initiale ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Le biais d'échantillonnage est l'un des biais les plus courants et les plus dommageables en UX Research. Il contamine toutes les données collectées, tous les insights produits, et potentiellement toutes les décisions produit qui s'ensuivent. L'échantillon n'est pas neutre : il est toujours le reflet des réseaux d'accès du chercheur.

**Problèmes identifiés dans ce recrutement**

*Biais d'échantillonnage structurel*
Recruter via sa propre newsletter et LinkedIn favorise mécaniquement des profils qui :
- S'intéressent à l'UX ou aux nouvelles technologies (biais d'intérêt tech)
- Ont un réseau professionnel actif en ligne (CSP+, urbains, éduqués)
- Sont dans une situation financière suffisamment stable pour avoir déjà une réflexion sur l'épargne

Un service de micro-épargne automatique devrait par définition cibler des personnes qui ont du mal à épargner — c'est-à-dire souvent des personnes aux revenus irréguliers, aux situations économiques précaires, vivant en dehors des grandes agglomérations. Ces profils sont exactement ceux qui sont absents de l'échantillon.

*Conséquences concrètes sur le produit*

1. Le produit sera conçu pour des personnes qui savent déjà épargner : l'interface supposera une littératie financière élevée (comprendre les taux, les horizons d'épargne, les arbitrages risque/rendement).
2. Les barrières réelles à l'épargne (revenus irréguliers, méfiance envers les institutions bancaires, précarité de logement empêchant la domiciliation) ne seront pas identifiées.
3. Le produit "micro-épargne" risque d'être perçu comme une fonctionnalité premium pour les utilisateurs déjà financièrement à l'aise, au lieu d'un outil d'inclusion financière.
4. L'accessibilité n'aura pas été testée (les participants ont tous un smartphone récent — les personnes avec des équipements moins récents, ou avec des handicaps visuels ou cognitifs, sont absentes).

**KPIs impactés**

UX :
- Task success rate biaisé (facile sur smartphone haut de gamme, difficile sur Android d'entrée de gamme)
- SUS non représentatif de la population cible réelle

Business :
- Taux d'adoption par segment cible réel (faible si le produit est inadapté aux personnes aux revenus modestes)
- NPS clivé selon le niveau socio-économique (très haut pour CSP+, très bas pour les autres)
- Échec commercial si le go-to-market cible un segment non testé

**Erreurs classiques**

- Penser que des utilisateurs "tech-savvy" sont représentatifs de la population générale
- Confondre accessibilité (recruter facilement) et représentativité
- Ne pas vérifier la diversité de l'échantillon avant de commencer les entretiens

**Correction du biais cognitif**

Biais de proximité : on recrute les gens qu'on connaît parce que c'est plus facile et plus rapide. Ce biais est compréhensible mais coûteux. La règle : pour chaque entretien avec un profil "dans mon réseau", planifier un entretien avec un profil "hors de mon réseau" (via panels, associations partenaires, recrutement en contexte réel).

**Améliorations possibles**

Définir des quotas de recrutement inclusifs *avant* de commencer : au moins 30% de participants hors Île-de-France, au moins 30% de participants avec revenus nets < 1800€/mois, au moins 20% de participants de plus de 55 ans, et au moins 2 participants avec un handicap déclaré (moteur, visuel ou cognitif). Utiliser des panels tiers spécialisés (UserTesting, Testapic) qui permettent un filtrage démographique précis.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Cette situation cumule plusieurs couches de biais : biais des utilisateurs interrogés (les recruteurs), biais algorithmique dans l'analyse IA, et biais prescriptif dans la recommandation finale. Le tout produit une recommandation qui va systématiquement pénaliser les profils sous-représentés dans les données d'entraînement historiques.

**Audit des biais**

*Biais 1 — Biais d'échantillonnage des recruteurs interrogés*
Les 50 entretiens sont avec des recruteurs. Leurs préférences (grandes entreprises, grandes écoles) reflètent leurs propres biais cognitifs de recrutement, pas des indicateurs objectifs de performance au travail. La recherche utilisateur a capturé et légitimé ces biais plutôt que de les questionner.

*Biais 2 — Biais de confirmation dans l'analyse IA*
Les outils d'IA générative entraînés sur des données textuelles de recrutement reproduisent les schémas historiques de discrimination (études montrent une sur-représentation de profils issus de grandes écoles, de genres et d'origines majoritaires dans les données d'entraînement). L'IA n'a pas identifié de "vérité" sur les critères de qualité — elle a synthétisé les préférences déclarées d'un groupe homogène.

*Biais 3 — Normalisation du biais comme "insight"*
"Les recruteurs trouvent difficile d'évaluer des profils atypiques et prennent plus de temps" — C'est une observation comportementale. La recommandation de "prioriser les profils avec signaux de qualité reconnus" transforme ce biais comportemental en règle prescriptive. C'est un saut logique dangereux : parce que les recruteurs ont du mal avec les profils atypiques, on va les supprimer. ❌

❌ Dark pattern systémique : un algorithme de présélection qui filtre les profils atypiques reproduit et amplifie les discriminations à l'embauche. Ce n'est pas un bug — c'est le design du système.

**Impacts éthiques, sociaux et business**

Éthiques :
- Discrimination indirecte illégale (en France, la discrimination à l'embauche basée sur l'origine, le sexe, le handicap est illégale — un algorithme peut la rendre systématique et invisible)
- Exclusion des personnes en reconversion professionnelle, des autodidactes, des personnes dont le parcours est non-linéaire (souvent des femmes après maternité, des personnes issues de l'immigration, des personnes en situation de handicap)
- Responsabilité juridique pour l'entreprise qui utilise cet outil

Sociaux :
- Réduction de la diversité dans les recrutements tech
- Renforcement des inégalités d'accès à l'emploi qualifié
- Perte pour les entreprises de profils atypiques souvent plus créatifs et résilients

Business :
- Risque légal et réputationnel si le biais est exposé (article de presse, action en justice)
- Perte de diversité = perte de performance à long terme (les équipes diverses surperforment selon de nombreuses études)
- Risque de churn des clients recruteurs attachés à la diversité (entreprises à politique RSE active)

**KPIs trompeurs ici**

- "Temps de tri réduit" : un KPI de productivité recruteur qui cache une discrimination systématique
- "Taux de satisfaction recruteur" : si les recruteurs sont satisfaits de ne plus voir de profils qu'ils trouvent "difficiles", ce KPI monte — mais il mesure le confort du recruteur, pas la qualité du recrutement
- "Taux d'embauche" : peut augmenter pour les profils standard tout en réduisant la diversité globale

**KPIs alternatifs à substituer**

- Taux de rétention à 12 mois des profils embauchés (les profils atypiques ont-ils une meilleure ou moins bonne rétention réelle ?)
- Index de diversité des candidats présentés vs. embauchés
- Taux de succès dans le poste à 6 mois (performance manager) par type de profil

**Erreurs classiques**

- Déléguer à l'IA une décision qui a des implications éthiques sans supervision humaine
- Confondre efficience (tri plus rapide) et efficacité (meilleurs recrutements)
- Traiter les biais cognitifs des utilisateurs comme des données objectives

---

#### Correction — Exercice 3

**Modèle mental AVANT d'analyser — Couches de biais**

Cette étude cumule au minimum 6 couches de biais distinctes, ce qui la rend inutilisable telle quelle pour des décisions produit.

Couche 1 — Biais d'échantillonnage (survivant)
Recruter uniquement des freelances avec 3+ missions complétées exclut :
- Les freelances qui ont quitté la plateforme (insatisfaits, discriminés, ou n'ayant pas réussi à passer le système de badge)
- Les freelances en début de parcours (qui ont peut-être le plus de difficultés avec le système)
- Les nouveaux arrivants non-francophones (exclus par la langue)

Couche 2 — Biais linguistique
Entretiens uniquement en français sur une plateforme disponible en 5 langues : les freelances non-francophones (potentiellement 30-40% de la base selon les marchés couverts) sont totalement invisibles. Or, les systèmes de badge peuvent être particulièrement problématiques pour des profils dont les certifications ou expériences viennent de pays non-reconnus dans le référentiel.

Couche 3 — Biais du chercheur / conflit d'intérêts
Le guide d'entretien a été conçu par la PM qui est l'initiatrice du système de badge. Elle a un intérêt personnel à sa validation. Ce conflit d'intérêts doit être déclaré et le guide revu par une tierce partie.

Couche 4 — Biais de désirabilité sociale et de contexte
Le chercheur est la PM = quelqu'un avec du pouvoir sur la plateforme. Les freelances interviewés par la PM peuvent hésiter à critiquer un système qu'elle a créé, craignant des conséquences sur leur statut sur la plateforme (conscient ou non).

Couche 5 — Biais algorithmique de l'outil d'analyse IA
Un outil entraîné sur des données de plateformes américaines peut avoir des biais culturels importants sur la définition de la "compétence", des critères de qualité d'un portfolio, et de ce que signifie une "bonne" présentation professionnelle.

Couche 6 — Biais de confirmation dans la conclusion
"Globalement satisfaits" avec "quelques améliorations mineures" — cette conclusion est cohérente avec ce que la PM voulait entendre. Elle ne reflète probablement pas la réalité des groupes non-représentés dans l'étude.

**Audit de biais complet**

| Biais | Impact sur validité | Correction |
|---|---|---|
| Biais de survivant (3+ missions) | Très fort — exclut les cas d'échec | Recruter 30% de freelances ayant quitté la plateforme ou bloqués au badge |
| Biais linguistique (FR only) | Fort — exclut 30-40% de la base | Mener les entretiens dans les 5 langues de la plateforme via des researchers natifs |
| Biais du chercheur (PM initiatrice) | Très fort — contamination du guide + interprétation | Séparer la conception du guide (researcher indépendant) et la conduite des entretiens |
| Biais de désirabilité sociale | Fort — les participants minimisent les critiques | Utiliser un chercheur sans lien hiérarchique visible avec la plateforme |
| Biais algorithmique IA | Moyen à fort — dépend de l'outil | Auditer les données d'entraînement, croiser avec une analyse humaine |
| Biais de confirmation dans la conclusion | Fort — la conclusion oriente les décisions | Peer review de la synthèse par une personne n'ayant pas participé à l'étude |

**Dimension éthique et inclusive — Groupes invisibilisés**

- Freelances non-francophones : leur expérience du badge est probablement différente (traduction des critères, reconnaissance des certifications étrangères)
- Freelances avec un handicap : le processus de badge (test, revue de portfolio) peut être inaccessible (délais non adaptés, formats non accessibles)
- Freelances issus de pays à faible reconnaissance des certifications : leur portfolio peut être mal évalué par un système calibré sur les standards occidentaux
- Freelances en reconversion : leurs compétences transversales peuvent être sous-valorisées par un système de badge très sectoriel
- Femmes après une pause carrière : même problème de continuité du parcours

❌ Risque systémique : un système de badge mal conçu et mal évalué peut devenir un mécanisme de discrimination déguisée en évaluation méritocratique.

**Méthodologie de reprise de zéro**

Phase 1 — Audit du système existant (2 semaines)
- Analyse quantitative des taux de succès/échec au badge par langue, géographie, type de profil
- Identification des groupes surreprésentés et sous-représentés dans les badges accordés

Phase 2 — Recherche qualitative multilingue (4 semaines)
- 20 entretiens en 5 langues, conduits par des researchers locaux (pas la PM)
- Recrutement : 40% freelances avec badge accordé, 30% freelances ayant échoué, 20% freelances ayant quitté la plateforme, 10% freelances en cours de processus
- Guide d'entretien conçu par une UX Researcher indépendante, revu par un comité d'éthique

Phase 3 — Sessions d'observation
- Observer 10 freelances passer le test de badge en conditions réelles (think-aloud)
- Tester l'accessibilité du processus avec 3 participants en situation de handicap

Phase 4 — Synthèse et validation
- Synthèse par une UX Researcher différente de celle qui a mené les entretiens
- Validation des insights avec un panel représentatif de freelances (member checking)

**KPIs pour détecter les angles morts**

UX :
- Taux de succès au badge par profil linguistique, géographique et type de handicap
- Time-to-badge par profil (certains groupes mettent-ils plus de temps ?)
- Taux d'abandon du processus de badge (à quelle étape ?)
- SUS du processus de badge par profil

Business et éthique :
- Index de diversité des freelances badgés vs. non-badgés (par genre, géographie, origine des certifications)
- Corrélation badge / taux de mission complétée (le badge prédit-il réellement la qualité ?)
- Taux de complétion de missions par freelances badgés vs. non-badgés (validation de la valeur prédictive du badge)
- NPS segmenté par langue et profil de freelance
- Churn rate des freelances non-badgés dans les 90 jours suivant l'échec au badge

**Erreurs classiques**

- Traiter l'absence de plainte comme une preuve de satisfaction
- Valider un système en n'interrogeant que ceux qui ont réussi à le traverser
- Confier la recherche sur un système à la personne qui l'a créé sans contre-poids

**Correction des biais cognitifs**

Biais de point aveugle : le biais le plus dangereux est celui dont on n'est pas conscient. La PM croit sincèrement être objective — c'est exactement ce qui la rend incapable de l'être sur son propre système. L'institutionnalisation du peer review et de la séparation des rôles (conception vs. conduite vs. synthèse vs. validation) est la réponse systémique à ce biais.

**Améliorations possibles**

Mettre en place un comité d'éthique produit qui audite les processus de notation et de badge avant leur lancement. Co-concevoir le système de badge avec des freelances représentatifs de la diversité de la plateforme. Publier un rapport de transparence annuel sur la diversité des freelances badgés (pratique de plus en plus attendue par les clients entreprises à politique RSE).

---

**Feedback itératif — Changement de paradigme**

> Le biais de recherche le plus dangereux n'est pas celui qu'on commet — c'est celui qu'on est convaincu de ne pas commettre.

---

*Fin de la Section 2 — Exercices*
