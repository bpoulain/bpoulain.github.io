# Section 3 — Psychologie appliquée à l'UX & Product

> **Fichier théorie uniquement.** Cette section explore les mécanismes psychologiques qui gouvernent la perception, la décision et l'émotion des utilisateurs — et comment les intégrer éthiquement dans la conception produit.

---

## Table des matières

1. [Motivation humaine appliquée au produit](#1-motivation-humaine-appliquée-au-produit)
2. [Heuristiques et biais cognitifs](#2-heuristiques-et-biais-cognitifs)
3. [Psychologie sociale & comportementale](#3-psychologie-sociale--comportementale)
4. [Charge cognitive & ergonomie mentale](#4-charge-cognitive--ergonomie-mentale)
5. [Influence et persuasion éthique](#5-influence-et-persuasion-éthique)
6. [Psychologie appliquée au design visuel](#6-psychologie-appliquée-au-design-visuel)
7. [Accessibilité cognitive](#7-accessibilité-cognitive)
8. [IA appliquée à la psychologie UX](#8-ia-appliquée-à-la-psychologie-ux)

---

## 1. Motivation humaine appliquée au produit

### 1.1 Modèle de Maslow adapté produit

**Modèle mental**
Un utilisateur n'adopte pas un produit si ses besoins de base (fiabilité, sécurité des données) ne sont pas satisfaits. Ce n'est qu'une fois ces besoins couverts qu'il peut aspirer à une expérience enrichissante ou à un sentiment d'appartenance.

**Analogie stable**
Construire une maison : on ne pose pas les fenêtres décoratives avant d'avoir des fondations solides et un toit étanche. L'expérience émotionnelle (les fenêtres) ne tient que si les couches inférieures sont stables.

**Pyramide Maslow appliquée produit**

| Niveau | Besoin humain | Équivalent produit | Exemple concret |
|---|---|---|---|
| 1 — Physiologique | Survie, énergie | Fonctionnement de base, rapidité | Page qui charge en < 3 s |
| 2 — Sécurité | Protection, stabilité | Confidentialité, fiabilité, no-crash | HTTPS, sauvegarde automatique |
| 3 — Appartenance | Lien social | Communauté, partage, collaboration | Feed social, commentaires |
| 4 — Estime | Reconnaissance | Progression, badges, statut | Niveaux, profil public |
| 5 — Réalisation | Sens, accomplissement | Personnalisation profonde, impact | Tableaux de bord avancés |

**Correction modèle mental**
❌ Idée reçue : "Rendre le produit beau et engageant suffit à retenir les utilisateurs."
✅ Approche correcte : Si les couches 1 et 2 sont défaillantes (bugs, lenteur, fuite de données), aucun design émotionnel ne compense. La fidélisation commence par la fiabilité.
KPI impacté : taux de rétention à 30 jours, churn rate.

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Task success rate (niveau 1-2) | Taux de rétention (niveaux 3-4) |
| SUS score global | NPS (niveaux 4-5) |
| Taux de complétion des onboarding | Lifetime Value (LTV) |

**Points éthiques & inclusivité**
- Ne pas exploiter les besoins d'appartenance ou d'estime pour créer une dépendance (voir dark patterns FOMO).
- Les besoins varient selon les cultures : l'estime est plus collective dans certaines cultures asiatiques que dans les cultures occidentales individualistes. Adapter les mécanismes de reconnaissance.

---

### 1.2 Self-Determination Theory (SDT) — Deci & Ryan

**Modèle mental**
Les humains sont intrinsèquement motivés quand trois besoins psychologiques fondamentaux sont satisfaits : se sentir compétent, autonome, et connecté aux autres. Un produit qui nourrit ces trois dimensions crée un engagement durable sans manipulation.

**Analogie stable**
Un jardin qui pousse tout seul quand les conditions sont réunies (sol riche = compétence, soleil = autonomie, eau = connexion). Forcer la croissance avec des engrais chimiques excessifs (rewards artificiels, notifications coercitives) brûle les racines à long terme.

**Les trois piliers SDT en design produit**

| Pilier | Définition | Application design | Anti-pattern à éviter |
|---|---|---|---|
| Compétence | Se sentir capable et efficace | Progression visible, feedback immédiat, courbe d'apprentissage douce | Difficulté arbitraire, interface trop complexe |
| Autonomie | Choisir librement ses actions | Options de personnalisation, chemins multiples, respect des choix | Menus cachés, options de désabonnement introuvables |
| Connexion | Appartenir à quelque chose | Fonctions sociales, communauté, partage de résultats | Isolement forcé, communauté toxique non modérée |

**Correction modèle mental**
❌ Idée reçue : "Les récompenses (points, badges) sont le meilleur moteur d'engagement."
✅ Approche correcte : Les récompenses extrinsèques peuvent détruire la motivation intrinsèque (effet de surjustification). Un utilisateur qui collectait des badges "pour le fun" s'arrête quand les badges disparaissent.
KPI impacté : engagement à long terme, DAU/MAU ratio.

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux de retour spontané (sans notification) | DAU/MAU ratio |
| Profondeur de session | Taux de recommandation organique |
| NPS qualitatif | Coût d'acquisition vs rétention organique |

---

## 2. Heuristiques et biais cognitifs

### 2.1 Système 1 vs Système 2 — Kahneman

**Modèle mental**
Le cerveau dispose de deux modes de traitement : un mode rapide, automatique et émotionnel (Système 1) et un mode lent, délibéré et logique (Système 2). La majorité des interactions produit se font en Système 1 — les utilisateurs ne "réfléchissent" pas, ils réagissent.

**Analogie stable**
Conduire une voiture connue (Système 1 : automatique, fluide) vs apprendre à conduire (Système 2 : concentration maximale, erreurs fréquentes). Un bon design UX vise à mettre le maximum d'actions en "mode conduite automatique".

**Implications design**

| Situation | Système activé | Bonne pratique UX |
|---|---|---|
| Navigation principale | Système 1 | Patterns standards, icônes reconnus |
| Remplissage de formulaire complexe | Système 2 | Progression par étapes, aide contextuelle |
| Micro-interactions quotidiennes | Système 1 | Feedbacks immédiats, gestes naturels |
| Décision d'achat importante | Système 2 → Système 1 | Ancrer la confiance puis simplifier le passage à l'action |
| Message d'erreur | Système 2 forcé | Clarté, ton rassurant, solution immédiate |

**Correction modèle mental**
❌ Idée reçue : "Les utilisateurs lisent attentivement les interfaces."
✅ Approche correcte : Les utilisateurs scannent (eye-tracking le confirme). Le Système 1 prend des décisions en millisecondes. Concevoir pour le scan, pas pour la lecture linéaire.
KPI impacté : taux de complétion de tâche, taux d'erreur utilisateur.

---

### 2.2 Biais d'ancrage

**Modèle mental**
La première information perçue devient la référence de jugement pour tout ce qui suit. En UX produit, le premier prix vu, la première option affichée ou la première valeur proposée ancre la perception de l'utilisateur.

**Analogie stable**
Négocier un salaire : celui qui dit un chiffre en premier cadre toute la négociation. Même si le chiffre semble arbitraire, il ancre les attentes des deux parties.

**Méthodologie & Bonnes pratiques**
1. Afficher d'abord le plan ou l'option qui donne le plus de valeur perçue (même si ce n'est pas la moins chère).
2. Utiliser le "prix barré" de manière honnête : montrer un vrai prix de référence, pas un prix artificiel gonflé (pratique trompeuse ❌).
3. Proposer une option "par défaut" bien calibrée dans les formulaires (pré-remplissage).
4. Dans les tableaux de prix, mettre la colonne recommandée au centre — ancre visuelle et psychologique.

**Correction modèle mental**
❌ Idée reçue : "Montrer le prix le moins cher en premier attire plus de conversions."
✅ Approche correcte : Montrer d'abord l'option premium crée un ancrage haut. Les options suivantes semblent alors plus abordables par contraste.
KPI impacté : panier moyen, taux de conversion vers plans premium.

**Points éthiques & inclusivité**
- L'ancrage éthique informe une décision libre. L'ancrage manipulatoire (faux prix de référence, fausses urgences) est un dark pattern ❌ illégal dans de nombreuses juridictions (RGPD, Digital Services Act).

---

### 2.3 Biais de disponibilité

**Modèle mental**
Les utilisateurs jugent la probabilité d'un événement à partir de la facilité avec laquelle ils peuvent le rappeler en mémoire. Ce qui est mémorable (récent, émotionnellement fort, souvent vu) semble plus probable ou important.

**Analogie stable**
Après avoir vu un reportage sur un crash d'avion, on surestime le danger de l'avion par rapport à la voiture — bien que statistiquement inverse. Le souvenir frais crée une distorsion de la réalité.

**Application UX**
- Les utilisateurs qui ont eu une mauvaise expérience récente avec un produit estiment que "ça arrive toujours" même si c'est rare.
- Les témoignages clients récents et spécifiques ont plus d'impact que des statistiques globales.
- Un bug visible (même mineur) crée un biais de disponibilité négatif durable sur la fiabilité perçue.

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Score de fiabilité perçue (enquête) | NPS après incident |
| Taux de retour après un bug | Churn suite à un incident |

---

### 2.4 Biais de confirmation

**Modèle mental**
Les utilisateurs cherchent et interprètent l'information de façon à confirmer leurs croyances préexistantes. En tests utilisateurs, ils "voient" ce qu'ils s'attendent à voir dans une interface.

**Analogie stable**
Relire son propre texte pour trouver des fautes : le cerveau lit ce qu'il a voulu écrire, pas ce qui est réellement écrit. C'est pourquoi un regard extérieur trouve des erreurs invisibles pour l'auteur.

**Implications en recherche UX**
- Un designer qui observe ses propres tests utilisateurs subit ce biais (il "voit" que l'utilisateur comprend quand ce n'est pas le cas).
- Les questions fermées en entretien génèrent des réponses biaisées par confirmation.
- Utiliser des méthodes mixtes (quantitatif + qualitatif) pour contrebalancer.

---

## 3. Psychologie sociale & comportementale

### 3.1 Preuve sociale (Social Proof)

**Modèle mental**
Face à l'incertitude, les individus observent le comportement des autres pour décider comment agir. Dans un produit, voir que d'autres utilisateurs font confiance ou utilisent activement une fonctionnalité réduit l'anxiété décisionnelle.

**Analogie stable**
Choisir un restaurant : une salle vide à 19h génère un signal négatif immédiat, même sans avoir goûté la nourriture. Une salle pleine rassure, même sans connaître personne.

**Formes de preuve sociale en produit**

| Type | Exemple concret | Efficacité | Risque éthique |
|---|---|---|---|
| Chiffres d'utilisation | "10 000 équipes nous font confiance" | Haute si vérifiable | ❌ Faux chiffres = fraude |
| Avis clients | Notes étoiles, verbatims | Très haute | ❌ Faux avis = dark pattern |
| Activité en temps réel | "3 personnes regardent cette offre" | Haute mais anxiogène | ❌ Si faux = manipulation |
| Endorsements d'experts | Logos de presse, certifications | Haute en B2B | Doit être vérifiable |
| Comportement des pairs | "Vos collègues utilisent déjà X" | Très haute en SaaS | Respect de la vie privée |

**Correction modèle mental**
❌ Idée reçue : "Afficher un grand nombre de clients suffit à convaincre."
✅ Approche correcte : La preuve sociale est efficace quand elle est spécifique, crédible et contextuellement pertinente. Une PME est plus convaincue par "500 PME du secteur industrie" que par "1 million d'utilisateurs globaux".
KPI impacté : taux de conversion, temps jusqu'à la première action clé (time-to-value).

**Points éthiques & inclusivité**
- Ne jamais fabriquer ou gonfler les chiffres sociaux (dark pattern ❌, illégal).
- Prendre en compte que la preuve sociale peut créer des effets de conformité excluants pour des minorités ou des profils non-représentés dans les témoignages affichés.

---

### 3.2 Gamification éthique

**Modèle mental**
La gamification consiste à appliquer des mécaniques de jeu (progression, récompenses, défis) dans un contexte non-ludique pour augmenter l'engagement. Éthique signifie que ces mécaniques servent l'utilisateur, pas seulement les métriques du produit.

**Analogie stable**
Une application de running qui célèbre chaque kilomètre parcouru : la récompense renforce un comportement bénéfique pour l'utilisateur. À l'inverse, un casino en ligne qui utilise des sons et lumières pour masquer les pertes est de la gamification manipulatoire ❌.

**Gamification éthique vs manipulatoire**

| Mécanique | Éthique ✅ | Manipulatoire ❌ |
|---|---|---|
| Progression | Barre de complétion de profil qui aide l'utilisateur | Jauge de "complétion" artificielle pour forcer des actions non nécessaires |
| Récompenses | Badge après une vraie compétence acquise | Badge pour avoir cliqué sur une publicité |
| Défis | Défi hebdomadaire d'apprentissage | Streak qui pénalise les pauses (shame loop) |
| Classements | Classement optionnel entre collègues | Classement public sans possibilité de se retirer |
| Notifications | Rappel contextuel et utile | Notifications de FOMO anxiogènes |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux de complétion des défis | DAU, WAU |
| Satisfaction déclarée (enquête) | Taux d'engagement fonctionnalité |
| Taux de désactivation des notifications | Taux de désabonnement |

---

## 4. Charge cognitive & ergonomie mentale

### 4.1 Modèle de charge cognitive (Sweller)

**Modèle mental**
La mémoire de travail humaine est limitée à 4 ± 1 chunks d'information simultanés (Miller-Cowan). Chaque élément supplémentaire dans une interface "coûte" de la charge cognitive. Une interface bien conçue minimise ce coût pour maximiser l'énergie disponible pour la tâche réelle.

**Analogie stable**
Jongler : avec 3 balles, c'est fluide. Ajouter une 4e puis une 5e demande une concentration croissante jusqu'à faire tomber toutes les balles. Une interface surchargée fait "tomber" l'attention de l'utilisateur.

**Trois types de charge cognitive**

| Type | Description | Origine | Solution design |
|---|---|---|---|
| Charge intrinsèque | Complexité inhérente à la tâche | Tâche elle-même | Ne peut pas être supprimée, seulement accompagnée |
| Charge extrinsèque | Charge imposée par le design | Interface mal conçue | Simplification, hiérarchie visuelle, patterns standards |
| Charge germane | Effort de construction de schémas mentaux | Apprentissage | Faciliter avec des analogies, progressivité |

**Méthodologie & Bonnes pratiques**
1. Appliquer la règle des 4 ± 1 : ne pas afficher plus de 4-5 options principales simultanément.
2. Utiliser le chunking : regrouper les informations liées (adresse = rue + code postal + ville = 1 chunk).
3. Progressivité de l'information (progressive disclosure) : montrer l'essentiel d'abord, les détails sur demande.
4. Utiliser des patterns UI reconnus (boutons standards, navigation familière) pour réduire la charge d'apprentissage.
5. Éliminer les éléments décoratifs qui n'apportent pas d'information.

---

### 4.2 Loi de Hick (Hick-Hyman)

**Modèle mental**
Le temps nécessaire pour prendre une décision augmente logarithmiquement avec le nombre d'options. Doubler le nombre d'options n'augmente pas le temps de décision de manière proportionnelle, mais chaque option supplémentaire a un coût croissant sur la fatigue décisionnelle.

**Analogie stable**
Menu de restaurant : un menu de 6 plats est parcouru rapidement. Un menu de 80 plats génère de l'anxiété du choix (paradox of choice, Barry Schwartz) et souvent un choix sous-optimal ou l'abandon.

**Application concrète**

| Contexte | Recommandation |
|---|---|
| Navigation principale | Maximum 5-7 items de premier niveau |
| Formulaires de choix | Maximum 4-5 options radio visibles |
| Tableaux de prix | 3 plans (Good / Better / Best) |
| Filtres de recherche | Filtres clés visibles, filtres avancés en accordéon |
| Onboarding | 1 action clé par écran |

**Correction modèle mental**
❌ Idée reçue : "Plus d'options = plus de valeur perçue = meilleure expérience."
✅ Approche correcte : La valeur perçue vient de la pertinence des options, pas de leur nombre. Curating (sélectionner pour l'utilisateur) est souvent plus puissant que de tout afficher.
KPI impacté : taux de complétion, temps sur tâche, taux d'abandon.

---

### 4.3 Fatigue décisionnelle

**Modèle mental**
La capacité à prendre de bonnes décisions s'épuise tout au long d'une session ou d'une journée. Les utilisateurs fatigués décisionnellement ont tendance à choisir l'option par défaut, à abandonner, ou à faire des choix impulsifs.

**Analogie stable**
Faire des courses après une longue journée de travail : on met dans le caddie des produits plus sucrés, moins réfléchis. Le même utilisateur le matin aurait fait des choix différents.

**Implications design**
- Placer les décisions importantes en début de parcours (avant que la fatigue s'installe).
- Proposer des options par défaut intelligentes et bienveillantes pour les décisions peu critiques.
- Éviter les longs formulaires non découpés (fatigue à mi-chemin).
- Sauvegarder les progrès intermédiaires pour permettre de reprendre plus tard.

**Points éthiques & inclusivité**
- Exploiter délibérément la fatigue décisionnelle pour pousser un upsell en fin de parcours est un dark pattern ❌.
- Les personnes avec TDA/H ou anxiété sont particulièrement vulnérables à la fatigue décisionnelle : concevoir pour elles profite à tous.

---

## 5. Influence et persuasion éthique

### 5.1 Principes de Cialdini adaptés UX

**Modèle mental**
Robert Cialdini a identifié 7 principes d'influence universels qui activent des réponses automatiques chez les individus. En UX, ces principes peuvent être utilisés de manière éthique pour aider les utilisateurs à prendre de bonnes décisions — ou de manière manipulatoire pour les forcer vers des décisions qui servent le produit contre leurs intérêts.

**Analogie stable**
Un bon conseiller bancaire utilise les mêmes principes d'influence qu'un vendeur de voitures à pression : la différence est que l'un cherche le meilleur accord pour le client, l'autre cherche la commission maximale.

**Les 7 principes adaptés UX**

| Principe | Description | Application UX éthique ✅ | Dark pattern ❌ |
|---|---|---|---|
| Réciprocité | On rend ce qu'on a reçu | Offrir une valeur réelle (guide, essai gratuit) avant de demander | "Cadeaux" avec engagement caché |
| Engagement/Cohérence | On reste cohérent avec ses engagements passés | Micro-engagements progressifs dans l'onboarding | Foot-in-the-door pour données excessives |
| Preuve sociale | Suivre le comportement des pairs | Témoignages vérifiés, compteurs réels | Faux avis, faux compteurs |
| Autorité | Faire confiance aux experts | Certifications réelles, badges vérifiables | Faux experts, faux labels |
| Sympathie | On est influencé par ceux qu'on apprécie | Ton chaleureux, personnalisation sincère | Flatterie excessive, personnages fictifs |
| Rareté | Les ressources rares sont plus désirables | Stock limité réel, délai d'accès honnête | Fausse rareté, compte à rebours fictif ❌ |
| Unité | On est influencé par le sentiment d'appartenance | Communauté ouverte, valeurs partagées | Communauté fermée excluante, tribalisme |

**Points éthiques & inclusivité**
- La rareté et l'urgence artificielles sont des dark patterns ❌ explicitement condamnés par le Dark Patterns Hall of Shame et réglementés par le Digital Services Act européen.
- Les personnes en situation de vulnérabilité économique, sociale ou cognitive sont plus susceptibles d'être manipulées par ces techniques.

---

### 5.2 Nudges — Architecture de choix bienveillante

**Modèle mental**
Un nudge est une modification de l'architecture de choix qui oriente le comportement dans une direction bénéfique pour l'individu, sans interdire ni inciter financièrement. Il préserve la liberté totale de l'utilisateur tout en rendant le meilleur choix le plus facile.

**Analogie stable**
Placer les fruits en premier dans la cafétéria scolaire (avant les desserts) augmente la consommation de fruits sans interdire les desserts ni imposer de règles. La disposition seule oriente le comportement.

**Formes de nudges en UX**

| Type de nudge | Exemple produit | Bénéfice pour l'utilisateur |
|---|---|---|
| Défaut intelligent | Opt-out plutôt qu'opt-in pour la sauvegarde auto | Protège les données sans effort |
| Simplification | Pré-remplissage de formulaire avec données connues | Réduit la charge, évite les erreurs |
| Rappels timely | Notification de renouvellement 30j avant expiration | Évite une interruption de service |
| Feedback immédiat | Indicateur de force de mot de passe en temps réel | Guide vers un choix plus sûr |
| Reformulation | "Vous économisez 20€/mois" vs "Plan à 80€/an" | Présentation transparente et motivante |

**Distinction nudge vs dark pattern**

| Critère | Nudge éthique ✅ | Dark pattern ❌ |
|---|---|---|
| Transparence | L'utilisateur peut voir et comprendre la logique | Logique cachée ou trompeuse |
| Réversibilité | Facile de choisir autrement | Difficile, voire impossible de refuser |
| Bénéficiaire | L'utilisateur est le principal bénéficiaire | Le produit/business est le seul bénéficiaire |
| Consentement éclairé | Oui | Non |

---

## 6. Psychologie appliquée au design visuel

### 6.1 Lois de la Gestalt

**Modèle mental**
Le cerveau ne perçoit pas des éléments isolés mais cherche activement des structures, des patterns, des "formes entières" (Gestalt = forme en allemand). Ces lois décrivent comment la perception organise automatiquement les éléments visuels.

**Analogie stable**
Regarder les nuages : le cerveau voit des animaux ou des visages dans des formes abstraites. Ce n'est pas dans les nuages, c'est dans la façon dont notre cerveau construit du sens à partir de fragments visuels.

**Les lois de la Gestalt appliquées au design**

| Loi | Principe | Application UI | Exemple concret |
|---|---|---|---|
| Proximité | Les éléments proches semblent liés | Regrouper label + champ de formulaire | Label collé à son input, espace entre les groupes |
| Similarité | Les éléments similaires semblent appartenir au même groupe | Boutons d'action de même couleur | Tous les CTA primaires en bleu |
| Continuité | Le regard suit les lignes et courbes naturellement | Guider vers l'action clé | Flèche pointant vers le CTA |
| Clôture | Le cerveau complète les formes incomplètes | Icônes simples reconnues | Icône hamburger menu |
| Figure/fond | Distinction entre élément principal et arrière-plan | Modales sur fond sombre | Pop-in de confirmation |
| Connexité | Les éléments connectés visuellement semblent liés | Étapes de navigation numérotées | Progress steps reliés par une ligne |
| Destin commun | Les éléments qui bougent ensemble semblent liés | Animations de groupe | Items d'une liste qui apparaissent ensemble |

---

### 6.2 Micro-interactions

**Modèle mental**
Les micro-interactions sont de petits moments de design — une animation, un son, un changement d'état — qui confirment une action, préviennent une erreur ou créent un moment de plaisir. Elles constituent la texture émotionnelle d'un produit.

**Analogie stable**
La façon dont une porte de voiture se ferme : le "cloc" satisfaisant n'est pas fonctionnel (la porte serait fermée sans lui) mais il communique qualité, fiabilité et soin du détail. C'est la même chose pour les micro-interactions d'une interface.

**Anatomie d'une micro-interaction (Dan Saffer)**

1. **Déclencheur** — Qu'est-ce qui active la micro-interaction ? (clic, hover, swipe, état système)
2. **Règles** — Que se passe-t-il ? (logique de l'animation ou du feedback)
3. **Feedback** — Comment l'utilisateur le perçoit ? (visuel, sonore, haptique)
4. **Boucles & modes** — Conditions spéciales ou répétition ?

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Score de satisfaction UX (CSAT) | Taux de retour utilisateur |
| Taux d'erreur (réduit par feedback) | Réduction tickets support |
| Mémorabilité de marque (enquête) | NPS émotionnel |

---

### 6.3 Effet de position sérielle — Mémorisation

**Modèle mental**
Dans une séquence d'informations, les utilisateurs mémorisent mieux le début (effet de primauté) et la fin (effet de récence) que le milieu. Les éléments placés au centre d'une longue liste sont les moins mémorisés.

**Analogie stable**
Une chanson de 10 couplets : on retient le premier couplet (primauté) et le dernier refrain (récence). Le 5e couplet ? Disparu.

**Application design**

| Position | Mémorisation | Utilisation recommandée |
|---|---|---|
| Début (premier tiers) | Très haute | Message de valeur principale, avantage clé |
| Milieu | Basse | Informations secondaires, détails techniques |
| Fin (dernier tiers) | Haute | Call-to-action, résumé, engagement demandé |

**Correction modèle mental**
❌ Idée reçue : "Il suffit de mettre l'information importante en gros et en couleur."
✅ Approche correcte : La position dans la séquence de lecture est aussi critique que la hiérarchie visuelle. Un CTA en bas de page bénéficie de l'effet de récence, mais un CTA enfoui au milieu d'un long texte sera ignoré quelle que soit sa taille.
KPI impacté : taux de clic sur CTA, taux de mémorisation de marque.

---

## 7. Accessibilité cognitive

### 7.1 TDA/H — Trouble du Déficit de l'Attention avec ou sans Hyperactivité

**Modèle mental**
Le TDA/H n'est pas un manque de concentration : c'est une difficulté à réguler l'attention selon des signaux de priorité peu stimulants. Les personnes TDA/H ont souvent une hyper-concentration (hyperfocus) sur les tâches stimulantes, mais une grande difficulté à maintenir l'attention sur des tâches répétitives ou peu engageantes.

**Analogie stable**
Un moteur de voiture de course qui a du mal à rouler lentement en file indienne, mais qui excelle à haute vitesse sur circuit dégagé. Ce n'est pas un moteur défaillant — il est fait pour un autre contexte.

**Design inclusif pour le TDA/H**

| Défi commun | Solution design |
|---|---|
| Distraction par les éléments visuels | Réduire les animations non essentielles, design épuré |
| Perte de place dans les longs formulaires | Sauvegarder automatiquement, afficher la progression |
| Oubli des étapes à suivre | Instructions visibles en permanence, pas seulement en début |
| Difficulté à prioriser | Hiérarchie visuelle forte, 1 action principale par écran |
| Impulsivité dans les clics | Confirmation pour les actions irréversibles |

---

### 7.2 Dyslexie

**Modèle mental**
La dyslexie est une différence neurologique dans le traitement du langage écrit qui affecte entre 10% et 17% de la population mondiale. Ce n'est pas un déficit d'intelligence : c'est une différence dans la façon dont le cerveau décode les symboles graphiques.

**Bonnes pratiques de design pour la dyslexie**

| Dimension | Recommandation | Standard |
|---|---|---|
| Typographie | Sans-serif préféré, espacement des lettres augmenté | Opendyslexic, Atkinson Hyperlegible |
| Interlignage | Minimum 1.5x la taille de police | WCAG 2.1 recommandation |
| Longueur des lignes | Maximum 66-80 caractères par ligne | Standard lisibilité |
| Contraste | Fond légèrement crème plutôt que blanc pur | Réduit le glare |
| Alignement | Texte aligné à gauche uniquement (pas justifié) | Justifié = espacement irrégulier difficile |
| Hierarchie | Titres explicitement différenciés | H1 > H2 > corps, jamais décoratif |

**Correction modèle mental**
❌ Idée reçue : "Concevoir pour la dyslexie est un cas marginal qui n'impacte que peu d'utilisateurs."
✅ Approche correcte : Les améliorations pour la dyslexie bénéficient à tous les utilisateurs (lisibilité universelle). C'est le principe du "curb cut effect" : les abaissés de trottoir pour fauteuils roulants sont aussi utilisés par les personnes avec des poussettes, des valises, des vélos.
KPI impacté : taux de lecture complète, taux de complétion, SUS score.

---

### 7.3 Diversité cognitive dans le design — Principes généraux

**Modèle mental**
La diversité cognitive englobe un spectre large : TDA/H, dyslexie, autisme, dyscalculie, anxiété, dépression situationnelle. Concevoir pour la diversité cognitive ne signifie pas créer des versions parallèles du produit, mais choisir des approches universellement plus claires.

**Principes du design cognitif inclusif**

| Principe | Description | Exemple concret |
|---|---|---|
| Clarté du langage | Éviter le jargon, phrases courtes, voix active | "Sauvegardez votre fichier" vs "La persistance des données doit être initialisée" |
| Consistance | Mêmes patterns pour les mêmes actions | Toujours le même bouton pour "Annuler" |
| Tolérance à l'erreur | Permettre de défaire, de corriger | Bouton "Annuler" après une action, corbeille |
| Charge réduite | Pas plus d'une tâche cognitive par écran | Formulaire découpé en étapes |
| Feedback clair | Confirmer ce qui s'est passé | "Votre message a été envoyé" avec icône |
| Flexibilité | Plusieurs chemins vers le même résultat | Raccourcis + menus + recherche |

**Points éthiques & inclusivité**
- Ne jamais utiliser la diversité cognitive comme argument marketing sans engagement réel de conception.
- Impliquer des personnes neurodivergentes dans les phases de recherche et de test utilisateur — elles ne sont pas des edge cases, elles révèlent les faiblesses du design pour tous.

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| SUS score toutes populations | Part de marché élargie |
| Taux d'erreur par segment | Réduction coûts support |
| Taux de complétion inclusif | Conformité légale (RGAA, WCAG) |

---

## 8. IA appliquée à la psychologie UX

### 8.1 Eye-tracking et heatmaps intelligentes

**Modèle mental**
L'eye-tracking mesure où les utilisateurs regardent vraiment une interface, révélant la différence entre ce que les utilisateurs disent regarder et ce qu'ils regardent effectivement. Les heatmaps agrègent ces données pour révéler des patterns de perception à l'échelle.

**Analogie stable**
Une caméra de surveillance d'un magasin qui enregistre les trajets des clients : elle révèle que 80% ne voient jamais le rayon du fond, indépendamment de ce que les clients disent dans les questionnaires post-visite.

**Eye-tracking classique vs IA**

| Dimension | Eye-tracking classique | Eye-tracking IA (prédictif) |
|---|---|---|
| Coût | Élevé (équipement spécialisé) | Faible (modèles prédictifs) |
| Participants | 10-30 utilisateurs en laboratoire | Simulation sur millions de patterns |
| Temps | Jours / semaines | Minutes |
| Précision | Haute (données réelles) | Bonne (80-90% de corrélation) |
| Outils | Tobii, iMotions | Attention Insight, Neurons, EyeQuant |

**Bonnes pratiques**
1. Utiliser l'eye-tracking IA pour valider rapidement une maquette avant les tests utilisateurs formels.
2. Vérifier si le regard naturel atteint les éléments critiques (CTA, messages d'erreur, instructions).
3. Identifier les zones "mortes" (jamais regardées) pour simplifier le design.
4. Ne pas substituer l'eye-tracking IA à la recherche utilisateur réelle pour des décisions critiques.

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux de fixation sur CTA | Taux de clic sur éléments clés |
| Zones d'attention vs zones d'intention | Conversion sur pages produit |

---

### 8.2 Prédiction de fatigue et d'attention

**Modèle mental**
Des algorithmes d'IA peuvent analyser les patterns comportementaux (vitesse de scroll, pauses, mouvements de souris, temps entre clics) pour prédire la fatigue attentionnelle d'un utilisateur et adapter l'interface en conséquence.

**Analogie stable**
Un prof expérimenté qui détecte que ses élèves décrochent (regards perdus, agitation) et change de registre pédagogique immédiatement, sans attendre la fin du cours. L'IA fait la même chose, mais à l'échelle d'un million d'utilisateurs simultanément.

**Applications concrètes**

| Signal comportemental | Interprétation IA | Adaptation possible |
|---|---|---|
| Scroll rapide sans arrêt | Scan en mode survol | Afficher un résumé ou ancre de navigation |
| Temps long sur un élément sans clic | Confusion ou hésitation | Afficher une aide contextuelle |
| Abandon à mi-formulaire | Fatigue ou blocage | Proposer une sauvegarde et un retour |
| Retour en arrière fréquent | Désorientation | Améliorer les fils d'Ariane |
| Inactivité prolongée | Perte d'attention | Rappel doux ou résumé de contexte |

**Points éthiques & inclusivité**
- La collecte comportementale doit être transparente et conforme au RGPD (base légale, information utilisateur).
- Ne pas utiliser ces données pour manipuler un utilisateur fatigué vers un achat impulsif ❌.
- Les utilisateurs doivent pouvoir refuser la personnalisation comportementale sans perte de fonctionnalité.

---

### 8.3 Analyse comportementale adaptative

**Modèle mental**
L'analyse comportementale adaptative utilise le machine learning pour personnaliser l'expérience en temps réel selon les patterns d'usage observés — non pas selon ce que l'utilisateur a renseigné dans son profil, mais selon ce que ses actions révèlent de ses besoins réels.

**Analogie stable**
Spotify Discover Weekly : Spotify ne vous demande pas "Quel type de musique voulez-vous découvrir ?" — il analyse vos comportements d'écoute (skips, repeats, moment de la journée, durée) et déduit vos préférences implicites. Le résultat est souvent plus précis que ce que vous auriez répondu à un questionnaire.

**Gradient de personnalisation adaptative**

| Niveau | Description | Exemple | Risque |
|---|---|---|---|
| 1 — Contextuel | Adaptation selon device, heure, lieu | Interface simplifiée sur mobile | Faible |
| 2 — Comportemental | Adaptation selon historique d'actions | Recommandations basées sur navigation | Moyen (bulle de filtre) |
| 3 — Prédictif | Anticipation des besoins | Pré-chargement de contenu probable | Moyen (erreurs coûteuses) |
| 4 — Génératif | Interface co-créée par l'IA en temps réel | Layouts dynamiques selon profil | Élevé (cohérence, biais) |

**Correction modèle mental**
❌ Idée reçue : "Plus la personnalisation est poussée, meilleure est l'expérience."
✅ Approche correcte : Une personnalisation excessive crée une "bulle de filtre" (filter bubble) qui enferme l'utilisateur dans ses habitudes, réduit la découverte, et peut renforcer des biais. La transparence sur les mécanismes de personnalisation est essentielle.
KPI impacté : diversité de l'engagement, taux de découverte, confiance déclarée.

**Points éthiques & inclusivité**
- Offrir à l'utilisateur une vue sur pourquoi le contenu lui est recommandé ("Parce que vous avez regardé X").
- Permettre de réinitialiser les préférences apprises.
- Auditer régulièrement les algorithmes pour détecter des biais discriminatoires (genre, âge, origine).
- Ne jamais utiliser l'analyse comportementale pour cibler des populations vulnérables avec des contenus addictifs ou préjudiciables ❌.

---

## Synthèse — KPIs psychologie UX

| Concept | KPI UX principal | KPI Business principal |
|---|---|---|
| Motivation (SDT) | DAU/MAU, engagement profond | LTV, churn négatif |
| Heuristiques Kahneman | Taux d'erreur, temps sur tâche | Coût de support |
| Biais cognitifs | SUS score | Taux de conversion |
| Preuve sociale | Confiance déclarée | Taux de conversion |
| Gamification | Complétion, engagement récurrent | DAU, revenus in-app |
| Charge cognitive | Taux de complétion, taux d'erreur | Taux d'abandon |
| Persuasion éthique | Satisfaction post-décision | Conversion, NPS |
| Gestalt | Temps de scan, eye-tracking | CTR éléments clés |
| Accessibilité cognitive | SUS inclusif | Part de marché, conformité |
| IA comportementale | Précision recommandation | Engagement, revenus |

---

> **Rappel éthique transversal** : La psychologie humaine est puissante. L'utiliser en UX sans éthique revient à weaponiser la connaissance du cerveau humain contre les utilisateurs. Chaque décision de design qui exploite un biais cognitif doit se poser la question : *"Ce design sert-il l'utilisateur ou sert-il le produit aux dépens de l'utilisateur ?"*
