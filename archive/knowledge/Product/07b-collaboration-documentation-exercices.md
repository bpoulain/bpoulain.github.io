# Section 7 — Collaboration & Documentation — Exercices

> **Mode d'emploi** : Chaque concept comporte trois exercices progressifs. Tentez de répondre par écrit avant de lire la correction. L'objectif n'est pas d'avoir "la bonne réponse" mais de révéler votre modèle mental actuel pour mieux le faire évoluer.

---

## Concept 1 — Facilitation de workshops & réunions

### BLOC 1 — Exercices

---

**Exercice 1 — Traduction mentale**

Vous êtes UX Lead dans une scale-up fintech. Le CPO vous demande d'organiser un atelier pour "aligner tout le monde sur la nouvelle fonctionnalité de paiement fractionné". Sont conviés : 2 PMs, 3 développeurs, 1 data analyst, 1 responsable juridique, 1 UX researcher, 2 designers.

Comment aborderais-tu ce problème avec ta compréhension actuelle ? Décris les étapes que tu planifierais, le déroulé de la réunion et ce que tu attendrais en sortie.

---

**Exercice 2 — Piège de paradigme**

Voici le compte-rendu d'un workshop "alignement produit" organisé par une équipe :

> *Lundi matin, 9h. Salle de réunion, 12 personnes. Le PM présente pendant 45 minutes les spécifications de la nouvelle fonctionnalité via un deck PowerPoint de 60 slides. Il répond aux questions au fur et à mesure. À 10h30, un vote à main levée valide le projet. Tout le monde repart avec le PDF du deck.*

Qu'est-ce qui ne va pas ici ? Identifie les dysfonctionnements et précise quels KPI seraient affectés.

---

**Exercice 3 — Mini-cas réel**

**Contexte produit** : Vous travaillez sur une application de téléassistance pour personnes âgées (65-85 ans) vivant seules. Le produit inclut un bracelet connecté et une interface mobile pour les proches aidants. Suite à des retours utilisateurs alarmants (confusion sur les alertes, difficultés à appeler les secours), une refonte partielle de l'interface est nécessaire en urgence.

**Votre mission** : Faciliter un workshop de 3h avec 8 participants (PM, 2 devs, 1 designer, 1 infirmière coordinatrice, 1 travailleuse sociale, 1 proche aidant invité, 1 représentante d'une association de défense des seniors).

**Dimension éthique et inclusive** : Deux des participants ne sont pas à l'aise avec les outils numériques collaboratifs (Miro, FigJam). L'une des personnes invitées a des difficultés auditives.

Décris ton modèle mental AVANT de commencer. Comment structurerais-tu ce workshop ? Quels KPI suivrais-tu pour mesurer son impact ?

---

### BLOC 2 — Corrections

---

**Correction — Exercice 1**

**Modèle mental attendu**

Un workshop n'est pas une réunion d'information déguisée. Faciliter, c'est créer les conditions pour que des intelligences diverses convergent vers une décision ou une production collective. L'objectif n'est pas "d'aligner" en imposant une vision, mais de co-construire une compréhension partagée.

**Raisonnement UX/Product**

Avant de planifier quoi que ce soit, trois questions préalables s'imposent :
1. Quel est le vrai livrable attendu en fin de session ? (Décision validée ? Liste de risques ? Backlog priorisé ?)
2. Quels conflits de priorités prévisibles existent entre les parties prenantes ? (Le juridique a probablement des contraintes de conformité, les devs ont des contraintes techniques, le PM a des contraintes business.)
3. Quelle est la diversité de "langage" dans la salle ? (Un designer pense en flux utilisateurs, un dev pense en contraintes techniques, un juriste pense en risques légaux.)

**Solution détaillée**

Structure recommandée en 3 phases :

- **Divergence (30-40 min)** : Chaque participant note individuellement sur post-its les risques, questions et opportunités qu'il voit dans cette fonctionnalité, sans hiérarchie de parole. Cela évite l'effet de conformisme au PM ou au titre senior le plus présent.
- **Émergence (40-50 min)** : Clustering des post-its par thèmes, identification des zones de consensus et de tension. Le facilitateur n'est pas là pour trancher mais pour rendre visible ce qui est invisible.
- **Convergence (30-40 min)** : Sur la base des tensions identifiées, définir collectivement les critères de succès de la fonctionnalité. Livrable : une liste de 5-7 critères d'acceptation priorisés, validés par dot voting.

**KPIs impactés**

- UX : taux de participation active (nombre de contributions par personne), diversité des points de vue exprimés, clarté des critères d'acceptation (mesurable via NPS interne post-workshop)
- Business : réduction des allers-retours en phase de développement (proxy : nombre de tickets "clarification" sur Jira dans les 2 semaines suivantes), time-to-decision

**Erreurs classiques**

- Confondre "informer" et "aligner"
- Laisser les personnes à fort titre monopoliser la parole (biais d'autorité)
- Ne pas définir de livrable concret avant le workshop : on sort avec "une meilleure compréhension" mais sans décision

**Correction des biais cognitifs**

Le biais de conformisme (groupthink) est particulièrement fort dans les ateliers verticaux. La technique des post-its individuels avant tout partage oral le neutralise efficacement.

**Améliorations possibles**

Envoyer un pré-read de 2 pages maximum 48h avant pour contextualiser, afin de ne pas passer les 30 premières minutes à "rattraper" les moins informés.

> **Changement de paradigme** : Un bon workshop se prépare comme une expérience utilisateur — avec un parcours, des moments de friction volontaires, et un livrable mesurable.

---

**Correction — Exercice 2**

**Modèle mental attendu**

Ce compte-rendu décrit une réunion de présentation top-down, pas un workshop. Le mot "workshop" est utilisé comme label de légitimité pour une décision déjà prise.

**Raisonnement UX/Product**

Dysfonctionnements identifiés :

1. **45 minutes de présentation passive** : Les participants sont des récepteurs, pas des contributeurs. Leur expertise métier n'est pas activée.
2. **60 slides** : Un deck de cette taille signale généralement que l'émetteur n'a pas synthétisé. En atelier, les slides doivent être un outil de facilitation, pas un rapport.
3. **Questions au fil de la présentation** : Cela fragmente la pensée de tous, favorise les questions de détail et empêche la réflexion systémique.
4. **Vote à main levée** : Le mécanisme de décision le plus biaisé qui soit — l'effet d'entraînement (bandwagon effect) et le biais d'autorité (qui lève la main en premier ?) invalident la fiabilité du résultat.
5. **Livrable = PDF du deck** : Ce n'est pas un livrable co-produit. C'est une archive unilatérale.

**KPIs affectés**

- UX : SUS interne de la réunion (si mesuré) serait très bas. NPS interne collaboratif (recommanderiez-vous ce type de session ?) négatif probable.
- Business : taux de réouverture de sujets "déjà décidés" dans les 4 semaines suivantes (indicateur de faux-alignement), nombre de désaccords exprimés en dehors de la réunion (couloirs, Slack), vitesse d'exécution post-décision ralentie par manque d'adhésion réelle.

❌ **Dark pattern organisationnel** : Le vote à main levée en fin de présentation est l'équivalent d'un "nudge" de validation. Il crée l'illusion du consensus sans en garantir la sincérité. C'est un dark pattern de gouvernance.

**Erreurs classiques**

- Utiliser le mot "workshop" pour un format qui ne l'est pas (washing méthodologique)
- Confondre l'absence d'objection verbale avec un accord

**Améliorations possibles**

Remplacer le vote à main levée par un vote anonyme pondéré (ex : chaque participant distribue 5 points entre les options). Limiter le temps de présentation initiale à 10 minutes maximum (executive summary).

> **Changement de paradigme** : "Aligner" par présentation unilatérale ne produit pas de l'alignement — il produit du silence, qui sera confondu avec du consentement.

---

**Correction — Exercice 3**

**Modèle mental attendu**

Ce workshop mobilise des parties prenantes aux langages, cultures et niveaux de confort technologique très différents. La facilitation doit être pensée comme un design d'accessibilité — pas seulement pour les utilisateurs finaux du produit, mais pour les participants du workshop eux-mêmes.

**Raisonnement UX/Product**

Avant de structurer le workshop, deux contraintes non négociables :
- Les participants non à l'aise avec Miro/FigJam ne doivent pas être mis en situation d'échec ou de dépendance. Le format doit fonctionner entièrement en présentiel physique (post-its, paper prototyping), ou en mode hybride avec un "interprète" numérique désigné.
- La participante malentendante nécessite : transcription en temps réel (CART ou application de sous-titrage), micro de table dédié, positionnement visuel favorisant la lecture labiale, et un facilitateur sensibilisé au rythme de parole.

**Solution détaillée**

Découpage en 4 temps :

**Temps 1 — Immersion partagée (45 min)**
Avant de résoudre, tout le monde doit avoir la même représentation du problème. Diffuser 2-3 extraits de sessions d'observation utilisateur (témoignages anonymisés de seniors ou de proches aidants en difficulté). Réaction individuelle écrite : "Ce que j'ai vu / Ce que j'ai ressenti / Ce que ça change pour moi." Cela homogénéise le niveau d'empathie et ancre la discussion dans des faits, pas des opinions.

**Temps 2 — Cartographie des moments critiques (45 min)**
En sous-groupes mixtes (technique + terrain), identifier les 3 moments où l'utilisateur est le plus vulnérable dans le parcours actuel. Travail sur parcours papier imprimé. Livrable : carte de chaleur des points de friction annotée.

**Temps 3 — Génération de solutions (45 min)**
Chaque sous-groupe esquisse 2 solutions pour le moment critique le plus sévère. Pas de jugement. L'infirmière et la travailleuse sociale ont autant de légitimité pour proposer des solutions d'interface que les designers — leur expertise terrain est irremplaçable.

**Temps 4 — Priorisation et décision (30 min)**
Présentation en 90 secondes par groupe, puis dot voting (chacun dispose de 3 gommettes à placer sur les solutions préférées). Critères de vote explicites : impact sur la sécurité utilisateur + faisabilité dans les 4 semaines.

**Dimension éthique et inclusive**

Ce workshop mobilise une personne âgée proche aidant et une représentante associative : leur présence doit être réelle, pas symbolique. Cela implique :
- Leur donner la parole en premier lors de la phase d'immersion
- Éviter le jargon produit dans les consignes
- S'assurer que leurs contributions sont explicitement valorisées dans le livrable final

Sur la question de l'autonomie des seniors : aucune solution ne doit être retenue si elle réduit l'autonomie ou la dignité de l'utilisateur au profit de la surveillance des proches (risque de paternalisme technologique).

**KPIs impactés**

- UX : task success rate sur les scénarios critiques (appel aux secours, confirmation d'alerte) — cible post-refonte > 90%, SUS sur l'interface redessinée > 75, taux d'abandon sur les flux d'urgence (cible = 0)
- Business : taux de fidélisation des abonnés à 6 mois (indicateur indirect d'utilité perçue), NPS des proches aidants (la décision d'achat leur appartient souvent), réduction des appels au support liés à la confusion d'interface

**Erreurs classiques**

- Inviter des "représentants utilisateurs" sans créer les conditions pour qu'ils contribuent réellement
- Choisir les outils en fonction des habitudes de l'équipe produit plutôt qu'en fonction des participants les moins équipés
- Traiter la dimension éthique comme un "bonus" plutôt que comme un critère de priorisation à part entière

> **Changement de paradigme** : Concevoir un workshop accessible n'est pas une contrainte — c'est le meilleur signal que vous avez réellement compris que la diversité des perspectives améliore la qualité des décisions.

---

## Concept 2 — Documentation & fiches composants (Design System)

### BLOC 1 — Exercices

---

**Exercice 1 — Traduction mentale**

Vous venez d'intégrer une équipe produit d'une marketplace de services à domicile (ménage, jardinage, bricolage). Le design system existe depuis 2 ans mais personne ne sait vraiment ce qu'il contient. Les designers créent souvent "à côté" parce que "c'est plus rapide". Les développeurs implémentent en se basant sur les maquettes Figma plutôt que sur la documentation.

Comment aborderais-tu ce problème avec ta compréhension actuelle ? Que ferais-tu en priorité ?

---

**Exercice 2 — Piège de paradigme**

Voici une fiche composant extraite d'un design system interne :

> **Composant : Bouton principal**
> Couleur : #2563EB
> Taille : 16px, padding 12px 24px
> État hover : opacity 0.9
> Utilisation : Pour les actions principales.
> Exporté depuis Figma le 14/03/2025.

Qu'est-ce qui ne va pas dans cette documentation ? Quels KPI seraient affectés par une documentation de ce niveau ?

---

**Exercice 3 — Mini-cas réel**

**Contexte produit** : Vous êtes design system lead dans une entreprise qui édite une plateforme RH SaaS à destination des équipes RH (recruteurs, gestionnaires de paie, managers). La plateforme est utilisée par 200 entreprises clientes, dont certaines ont des obligations légales d'accessibilité numérique (RGAA/WCAG 2.1 AA).

Lors d'un audit, il est découvert que 40% des composants interactifs ne respectent pas les contrastes minimaux, et qu'aucun composant n'a de documentation sur le comportement attendu pour les lecteurs d'écran.

**Dimension éthique et inclusive** : Parmi les utilisateurs, certains ont des déficiences visuelles, d'autres utilisent des technologies d'assistance. Les entreprises clientes risquent des poursuites légales si la non-conformité persiste.

Décris ton modèle mental AVANT de commencer. Comment prioriseras-tu les corrections ? Quelle structure de documentation mettras-tu en place ? Quels KPI suivrais-tu ?

---

### BLOC 2 — Corrections

---

**Correction — Exercice 1**

**Modèle mental attendu**

Un design system inutilisé n'est pas un problème de documentation — c'est un problème d'adoption, qui est lui-même un problème de confiance et de valeur perçue. Avant de "documenter mieux", il faut comprendre pourquoi les équipes contournent le système existant.

**Raisonnement UX/Product**

Trois questions diagnostiques prioritaires :
1. Pourquoi les designers créent-ils "à côté" ? (Composants manquants ? Trop rigides ? Documentation introuvable ?)
2. Pourquoi les développeurs se basent-ils sur les maquettes plutôt que sur la doc ? (Documentation trop technique ? Pas synchronisée avec Figma ? Pas de source de vérité unique ?)
3. Qui est propriétaire du design system ? (Si personne ne l'est, il se dégrade naturellement.)

**Solution détaillée**

Phase 1 — Audit d'usage (1 semaine) : Interviewer 3 designers et 3 développeurs avec des questions comportementales ("Montre-moi comment tu as créé le dernier composant"). Identifier les 5 composants les plus utilisés et les 5 plus contournés.

Phase 2 — Quick wins (2 semaines) : Corriger en priorité les 5 composants les plus contournés. Documenter dans le format le plus simple possible : "Quand l'utiliser / Quand ne pas l'utiliser / Comportement attendu / Exemple d'usage réel dans le produit."

Phase 3 — Gouvernance (ongoing) : Établir un processus de contribution (comment propose-t-on un nouveau composant ?) et un processus de dépréciation (comment retire-t-on un composant obsolète ?).

**KPIs impactés**

- UX : taux d'adoption du design system (ratio composants issus du DS / total composants en production), cohérence perçue (SUS partiel sur la cohérence visuelle), NPS interne des équipes design et dev
- Business : réduction du temps de design et dev sur les nouvelles features (mesurable en sprints), réduction des bugs d'incohérence UI (tickets Jira "visual inconsistency")

**Erreurs classiques**

- Ajouter de la documentation sans résoudre les problèmes d'adoption
- Documenter pour "avoir une doc" plutôt que pour répondre aux besoins réels des contributeurs

> **Changement de paradigme** : Un design system est un produit interne — il a ses utilisateurs (designers, devs), ses pain points, et il nécessite la même démarche centrée utilisateur que n'importe quel produit externe.

---

**Correction — Exercice 2**

**Modèle mental attendu**

Cette fiche documente des valeurs visuelles mais pas le composant en tant qu'élément d'interface vivant. Elle répond à "à quoi ça ressemble" mais pas à "comment ça se comporte", "dans quel contexte l'utiliser", "quels sont ses états", ni "comment il se comporte pour un utilisateur qui n'utilise pas de souris".

**Raisonnement UX/Product**

Manques critiques identifiés :

1. **États manquants** : Pas de documentation pour les états disabled, loading, focus, pressed, error. Un bouton a au minimum 5-6 états — aucun n'est documenté.
2. **Accessibilité absente** : Pas de mention du rôle ARIA, pas d'indication sur le comportement au clavier (Tab, Entrée, Espace), pas de ratio de contraste vérifié (WCAG 2.1 AA exige 4.5:1 pour le texte normal).
3. **Contexte d'usage flou** : "Pour les actions principales" est trop vague. Est-ce qu'on peut avoir deux boutons principaux sur la même page ? Non — mais la doc ne le dit pas.
4. **Date d'export Figma** : Ce n'est pas un indicateur de validité. Une doc peut être exportée mais obsolète le jour suivant si le composant évolue sans mise à jour.

❌ **Dark pattern documentaire** : La mention "exporté depuis Figma le 14/03/2025" crée une fausse impression de rigueur et de synchronisation. Si le composant a été modifié après cette date, la doc est mensongère par inaction.

**KPIs affectés**

- UX : taux de réimplémentation non conforme (composants créés hors design system), score WCAG automatisé (outils axe, Lighthouse), SUS partiel accessibilité
- Business : coût des bugs d'accessibilité en production (temps de correction × fréquence), risque légal (conformité RGAA pour les clients soumis à obligation)

**Améliorations possibles**

Une fiche composant complète doit contenir : description fonctionnelle, règles d'utilisation (quand / quand pas), tous les états visuels, comportement clavier et lecteur d'écran, ratio de contraste mesuré, tokens de design associés, exemples d'usage réels, et un historique de version.

> **Changement de paradigme** : Documenter un composant, c'est documenter son comportement, pas sa couleur — tout comme spécifier un produit, c'est décrire son usage, pas sa forme.

---

**Correction — Exercice 3**

**Modèle mental attendu**

L'accessibilité n'est pas une couche qu'on ajoute à la fin — c'est une propriété fondamentale d'un composant. Quand 40% des composants échouent sur le contraste, c'est un problème systémique de processus, pas un problème de cas particuliers.

**Raisonnement UX/Product**

Priorisation des corrections selon deux axes : sévérité de l'impact utilisateur et fréquence d'usage du composant.

Niveau 1 (critique, à corriger en sprint 1) : composants des flux d'urgence ou obligatoires (formulaires de saisie, boutons d'action primaire, messages d'erreur). Un utilisateur malvoyant qui ne peut pas lire un message d'erreur est bloqué dans sa tâche — task success rate = 0.

Niveau 2 (important, sprint 2-3) : composants de navigation, tableaux de données, éléments de feedback (toasts, alertes).

Niveau 3 (améliorations, backlog) : composants décoratifs, illustrations, iconographie secondaire.

**Structure de documentation accessibilité**

Pour chaque composant, ajouter une section "Accessibilité" contenant :
- Ratio de contraste mesuré (fond/texte, fond/bordure) avec indication du niveau atteint (AA/AAA)
- Rôle ARIA recommandé et attributs nécessaires (aria-label, aria-describedby, etc.)
- Navigation au clavier : quelles touches, dans quel ordre, quel comportement attendu
- Comportement avec lecteur d'écran (NVDA, VoiceOver) : ce qui est annoncé, dans quel ordre
- États qui doivent être communiqués programmatiquement (focus visible, erreur, désactivé)

**Dimension éthique et inclusive**

Ne pas traiter l'accessibilité comme un "projet spécial" — l'intégrer dans la définition of done de chaque composant. Cela signifie : aucun composant n'est considéré "done" s'il n'a pas passé un test de contraste automatisé ET une vérification manuelle avec lecteur d'écran.

Sur le risque légal : informer proactivement les équipes dirigeantes du périmètre de non-conformité, avec une estimation de l'exposition légale. C'est une responsabilité éthique, pas seulement une tâche technique.

**KPIs impactés**

- UX : score WCAG automatisé (axe, Lighthouse) — cible : 0 erreur de niveau A et AA sur tous les composants core, taux de task success pour les personas avec déficience visuelle (tests avec lecteur d'écran), SUS mesuré auprès d'utilisateurs utilisant des technologies d'assistance
- Business : nombre de tickets "accessibilité" en production (cible : décroissance mensuelle de 20%), conformité RGAA auditée (cible : niveau AA d'ici 6 mois), réduction du risque légal documenté (poursuites évitées)

**Erreurs classiques**

- Déléguer l'accessibilité aux développeurs sans que les designers aient été formés
- Considérer l'accessibilité comme un projet ponctuel plutôt qu'un standard permanent

> **Changement de paradigme** : L'accessibilité dans un design system n'est pas une feature — c'est le prix d'entrée de la qualité professionnelle.

---

## Concept 3 — Handoff UX/UI aux développeurs

### BLOC 1 — Exercices

---

**Exercice 1 — Traduction mentale**

Vous êtes UX designer dans une startup e-commerce (vente de mobilier en ligne). Vous venez de finir les maquettes haute fidélité d'une nouvelle page produit avec un configurateur 3D simplifié. Le sprint de développement commence lundi. Comment organiseriez-vous la transmission de votre travail aux développeurs ?

---

**Exercice 2 — Piège de paradigme**

Un designer envoie ce message à son équipe dev un vendredi à 17h :

> *"Les maquettes finales sont dans Figma, j'ai tout annoté. Le lien est dans le channel Slack. Si vous avez des questions, je suis disponible. Bon courage pour le sprint !"*

Qu'est-ce qui ne va pas dans cette approche du handoff ? Quels problèmes concrets cela va-t-il créer ? Quels KPI seraient affectés ?

---

**Exercice 3 — Mini-cas réel**

**Contexte produit** : Vous êtes UX Lead dans une ONG qui développe une application mobile d'aide à la recherche d'hébergement d'urgence pour des personnes sans domicile fixe. L'application sera utilisée par des travailleurs sociaux (sur terrain, souvent en déplacement, connexion intermittente) et, dans certains cas, directement par des personnes en situation de précarité.

Une nouvelle fonctionnalité majeure vient d'être designée : un système de géolocalisation des places disponibles en temps réel, avec filtres (accessibilité PMR, présence d'animaux acceptée, femmes seules). Les maquettes incluent des états complexes (chargement, erreur réseau, aucun résultat, résultats partiels).

**Dimension éthique et inclusive** : Les données de géolocalisation des utilisateurs ne doivent pas être stockées. L'interface doit fonctionner en mode dégradé sans connexion.

Décris ton modèle mental AVANT de commencer. Comment structurerais-tu ce handoff ? Quels KPI suivrais-tu ?

---

### BLOC 2 — Corrections

---

**Correction — Exercice 1**

**Modèle mental attendu**

Un handoff n'est pas un transfert de fichiers — c'est un transfert de compréhension. L'objectif est que les développeurs puissent implémenter fidèlement l'intention du design sans avoir besoin d'interrompre le designer pour chaque question.

**Raisonnement UX/Product**

Avant de "livrer" les maquettes, se demander : si je n'étais plus disponible, est-ce qu'un développeur qui n'a pas participé aux décisions de design pourrait comprendre POURQUOI chaque choix a été fait, pas seulement QUOI a été choisi ?

**Solution détaillée**

1. **Annotations d'intention** (pas seulement de spécification) : Documenter "pourquoi ce choix" en plus de "quelles valeurs". Ex : "Le configurateur s'ouvre en drawer plutôt qu'en modale pour permettre de continuer à voir les photos produit — ne pas changer ce comportement sans discussion UX."
2. **Inventaire des états** : Lister exhaustivement tous les états de chaque composant interactif (configurateur : état initial, sélection en cours, option indisponible, résumé de configuration, erreur de compatibilité). Les états manquants en maquette deviennent des bugs en production.
3. **Session de handoff live** (30-45 min) : Walkthrough des maquettes avec les développeurs avant le début du sprint. Laisser les devs poser des questions et noter les zones d'ambiguïté — ce sont des bugs potentiels détectés en amont.
4. **Tokens de design documentés** : S'assurer que les valeurs de design (couleurs, espacements, typographie) sont liées au design system, pas hardcodées dans les maquettes.

**KPIs impactés**

- UX : fidélité d'implémentation (ratio "maquette vs. prod" mesuré par un audit visuel post-sprint), nombre de bugs UI en recette, task success rate sur le configurateur
- Business : vélocité du sprint (nombre de tickets "clarification design" ouverts pendant le sprint), coût de rework post-sprint

> **Changement de paradigme** : Un handoff parfait est celui qui rend le designer temporairement inutile — tout est dans les livrables, pas dans la tête du designer.

---

**Correction — Exercice 2**

**Modèle mental attendu**

Ce message présuppose que les développeurs savent quoi chercher dans Figma, savent interpréter les annotations, et savent quelles questions poser. Ces trois suppositions sont rarement vraies en même temps.

**Raisonnement UX/Product**

Problèmes concrets qui vont se produire :

1. **Vendredi à 17h** : Le sprint commence lundi. Les développeurs auront le week-end pour "se faire leur idée" sans pouvoir clarifier. Les malentendus seront déjà ancrés lundi matin.
2. **"J'ai tout annoté"** : Les annotations du designer répondent aux questions que le designer s'est posé — pas nécessairement aux questions que les développeurs se poseront.
3. **"Si vous avez des questions"** : Inversion de la charge de l'ambiguïté. C'est au designer de provoquer les questions, pas aux développeurs de les identifier.
4. **Aucune session de walkthrough** : Sans discussion live, les développeurs interprètent les maquettes selon leur modèle mental technique, pas selon l'intention UX.

**KPIs affectés**

- UX : fidélité d'implémentation (écarts visuels et comportementaux vs. maquette), taux de bugs UI en recette
- Business : nombre de tickets "à revoir" post-sprint, temps perdu en allers-retours, retard de livraison

❌ **Dark pattern organisationnel** : Envoyer les livrables la veille du sprint en fin de journée est une façon de clore la responsabilité du designer sans avoir vérifié que la transmission a réellement eu lieu.

**Améliorations possibles**

Prévoir une session de handoff dédiée de 30-45 minutes avec les développeurs concernés, idéalement 2-3 jours avant le début du sprint pour laisser le temps aux questions et aux éventuels ajustements.

> **Changement de paradigme** : Le handoff n'est pas terminé quand le designer a livré — il est terminé quand les développeurs ont compris.

---

**Correction — Exercice 3**

**Modèle mental attendu**

Ce handoff est exceptionnel à deux titres : la complexité des états (réseau instable, mode dégradé) et les enjeux éthiques (géolocalisation, données sensibles de personnes vulnérables). Ces deux dimensions doivent être explicitement documentées et ne peuvent pas être laissées à l'interprétation des développeurs.

**Raisonnement UX/Product**

Structure du handoff recommandée en 4 niveaux :

**Niveau 1 — Contexte et intention (1 document)**
Résumé des personas (travailleur social en terrain, personne en situation de précarité), des contraintes d'usage (connexion intermittente, stress élevé, besoin de rapidité) et des décisions de design majeures. Ce document est lu par les développeurs avant de toucher aux maquettes.

**Niveau 2 — Inventaire des états par fonctionnalité**
Pour la géolocalisation seule : état de permission refusée, état de chargement, état de résultats complets, état de résultats partiels (données partiellement disponibles), état d'erreur réseau récupérable, état hors-ligne (mode dégradé avec dernières données connues), état "aucun résultat".
Chaque état doit avoir sa maquette dédiée ET une note d'intention : "En mode hors-ligne, afficher les résultats en cache avec un bandeau de date de dernière mise à jour — ne jamais afficher une liste vide sans contexte."

**Niveau 3 — Contraintes éthiques documentées**
Section explicite dans la documentation : "Données de géolocalisation — la position de l'utilisateur ne doit jamais être envoyée au serveur, ni stockée localement au-delà de la session. La recherche doit fonctionner par zone géographique (ville/arrondissement) et non par coordonnées GPS précises. Ce choix est une décision de design éthique, pas une contrainte technique."

**Niveau 4 — Session de handoff avec scénarios de test**
Walkthrough en deux temps : (1) navigation dans les maquettes avec les devs, (2) simulation de scénarios d'usage dégradés ("que se passe-t-il si l'utilisateur perd le réseau pendant la recherche ?"). Les réponses à ces questions deviennent des critères d'acceptation dans les user stories.

**Dimension éthique et inclusive**

Les filtres (PMR, animaux, femmes seules) doivent être documentés avec leurs règles d'affichage par défaut. La question éthique : quel est l'état par défaut des filtres ? Afficher tous les résultats sans pré-filtrage évite de masquer des options par inadvertance à une personne qui n'aurait pas pensé à activer un filtre pertinent.

**KPIs impactés**

- UX : taux de task success sur le scénario "trouver une place disponible en moins de 2 minutes", taux de complétion du flux en mode dégradé, SUS mesuré auprès de travailleurs sociaux en condition réelle
- Business / Impact : nombre de personnes orientées par l'application par semaine, taux de placement réussi (proportion de recherches aboutissant à une orientation effective), temps moyen de recherche (réduction = impact direct sur les personnes aidées)

**Erreurs classiques**

- Ne pas documenter les états d'erreur : ce sont les moments de plus grande vulnérabilité pour l'utilisateur
- Laisser les décisions éthiques à l'implémentation technique sans les rendre explicites dans les spécifications

> **Changement de paradigme** : Dans un produit à fort impact social, les décisions éthiques de design sont des spécifications fonctionnelles — elles doivent être aussi précises et non négociables que les comportements techniques.

---

## Concept 4 — Collaboration interdisciplinaire & Leadership UX/PM

### BLOC 1 — Exercices

---

**Exercice 1 — Traduction mentale**

Vous êtes UX designer senior dans une entreprise de logistique B2B. Le PM vient vous voir avec cette demande : "On a besoin d'une interface pour que les conducteurs puissent saisir leurs temps de pause obligatoires. Réglementairement, c'est obligatoire. Je t'envoie les specs fonctionnelles, tu fais les maquettes pour vendredi ?"

Comment aborderais-tu cette situation avec ta compréhension actuelle ?

---

**Exercice 2 — Piège de paradigme**

Dans une réunion de roadmap, un PM dit au designer :

> *"On n'a pas le temps de faire de la recherche utilisateur sur cette feature. Les clients ont demandé cette fonctionnalité dans les tickets de support, c'est suffisant comme signal. Fais directement les maquettes."*

Qu'est-ce qui ne va pas dans ce raisonnement ? Quels KPI seraient affectés si l'équipe suit cette approche ?

---

**Exercice 3 — Mini-cas réel**

**Contexte produit** : Vous êtes Product Designer dans une edtech qui développe une plateforme d'apprentissage en ligne pour adultes en reconversion professionnelle (25-55 ans). La plateforme propose des formations certifiantes en partenariat avec des entreprises qui co-financent la formation de leurs salariés.

Le PM propose de gamifier l'expérience d'apprentissage avec un système de points, de badges et de classements entre apprenants. Il cite des études de cas concurrents montrant +25% d'engagement.

**Dimension éthique et inclusive** : Parmi les apprenants, certains sont en situation de handicap (dyslexie, déficiences motrices), d'autres vivent des situations personnelles difficiles (reconversion subie, licenciement). Le classement entre apprenants pourrait avoir des effets négatifs sur les personnes les plus fragiles.

Décris ton modèle mental AVANT de commencer. Comment naviguerais-tu cette tension PM/Designer ? Quels KPI suivrais-tu pour arbitrer ?

---

### BLOC 2 — Corrections

---

**Correction — Exercice 1**

**Modèle mental attendu**

La demande du PM est une solution déguisée en problème. "Une interface pour saisir les temps de pause" est déjà une décision de design — avant même d'avoir compris les conducteurs, leurs conditions de travail, leur niveau de confort avec le numérique, ou les conséquences d'une mauvaise saisie.

**Raisonnement UX/Product**

Avant d'accepter la commande telle quelle, poser les questions suivantes au PM :
- Qui sont exactement ces conducteurs ? (Âge, niveau numérique, type de véhicule, conditions de saisie : en mouvement ? au dépôt ? sur smartphone ?)
- Quelles sont les conséquences d'une erreur de saisie ? (Amende ? Perte de données réglementaires ?)
- Y a-t-il des contraintes légales sur le format de la donnée saisie ?
- Quel est le contexte de saisie ? (Connexion disponible ? Interface déjà existante à intégrer ?)

Ce n'est pas de la résistance — c'est de la rigueur professionnelle. Un designer qui accepte une commande sans questionner son contexte prend le risque de créer une interface parfaitement conforme à la demande et parfaitement inadaptée à l'usage réel.

**Solution détaillée**

Proposer au PM un "mini-cadrage" de 2 jours avant les maquettes : 3-5 entretiens téléphoniques rapides avec des conducteurs (30 min chacun), observation si possible d'une saisie réelle, synthèse des contraintes d'usage. Ce temps investi réduit le risque de rework post-développement d'un facteur 3 à 5.

**KPIs impactés**

- UX : task success rate sur la saisie réglementaire (cible > 95% — c'est obligatoire), taux d'erreur de saisie, SUS > 70 pour une interface d'usage contraint
- Business : coût des erreurs de conformité réglementaire (amendes, litiges), taux d'adoption de l'outil par les conducteurs (un outil non adopté = non-conformité)

**Erreurs classiques**

- Accepter les specs fonctionnelles comme un brief de design
- Confondre "contrainte réglementaire" avec "aucune latitude de design" — c'est souvent l'inverse : plus la contrainte est forte, plus le design doit être soigné

> **Changement de paradigme** : Recevoir une demande de design sans questionner son contexte d'usage, c'est accepter de résoudre le mauvais problème avec excellence.

---

**Correction — Exercice 2**

**Modèle mental attendu**

Les tickets de support sont un signal, pas une étude. Ils disent ce que les utilisateurs ont demandé, pas pourquoi ils l'ont demandé, ni si la solution qu'ils ont imaginée est la bonne.

**Raisonnement UX/Product**

Problèmes dans le raisonnement du PM :

1. **Biais de disponibilité** : Les tickets de support surreprésentent les utilisateurs les plus vocaux ou les plus frustrés. La majorité silencieuse qui abandonne sans signaler n'apparaît jamais dans les tickets.
2. **Confusion signal/besoin** : "Les clients ont demandé X" signifie qu'ils ont imaginé X comme solution à leur problème. Leur vrai besoin est peut-être satisfait par Y, qui est plus simple à implémenter et plus efficace.
3. **"Pas le temps de faire de la recherche"** est une fausse économie : corriger une feature mal conçue en production coûte 5 à 10 fois plus cher qu'un entretien utilisateur de 45 minutes en amont.

**KPIs affectés**

- UX : taux d'utilisation de la feature post-lancement (une feature mal cadrée est souvent sous-utilisée malgré une forte demande apparente), task success rate, taux d'abandon sur le nouveau flux
- Business : ROI UX négatif si la feature nécessite un rework dans les 2 sprints suivants, augmentation des tickets de support post-lancement (la feature résout-elle vraiment le problème ?)

**Contre-argument constructif pour le PM**

Ne pas opposer frontalement. Proposer : "Je comprends la contrainte de temps. Je propose 3 entretiens de 30 minutes avec des clients qui ont soumis ce type de ticket — ça prend 2 jours et ça nous évite de construire la mauvaise chose." Rendre la recherche rapide et concrète réduit la résistance.

**Erreurs classiques**

- Accepter le veto du PM sans contre-proposer une alternative légère
- Présenter la recherche utilisateur comme un "luxe" plutôt que comme une réduction de risque business

> **Changement de paradigme** : Les tickets de support disent ce que les utilisateurs ont demandé — la recherche utilisateur dit ce dont ils ont besoin. Ce ne sont pas toujours la même chose.

---

**Correction — Exercice 3**

**Modèle mental attendu**

Il ne s'agit pas d'être "pour" ou "contre" la gamification — il s'agit de comprendre pour qui elle fonctionne, dans quelles conditions, et avec quels effets secondaires. Le +25% d'engagement des concurrents est un chiffre sans contexte : engagement mesuré comment ? Sur quelle population ? Sur quelle durée ?

**Raisonnement UX/Product**

La gamification par classement (leaderboard) présente un problème structurel dans un contexte d'apprentissage pour adultes en reconversion : elle favorise les apprenants déjà avancés ou disponibles, et pénalise symboliquement ceux qui progressent plus lentement (contraintes personnelles, handicap, situation difficile). Elle peut convertir une motivation intrinsèque (apprendre pour évoluer) en motivation extrinsèque (éviter la honte du bas du classement) — mécanisme documenté comme réduisant la qualité de l'apprentissage à long terme.

**Comment naviguer la tension PM/Designer**

1. **Ne pas refuser en bloc** : Proposer d'explorer la gamification dans un cadre hypothèses/tests. "Je comprends l'objectif d'engagement. Testons deux variantes : une avec classement collectif (visible seulement pour soi) et une avec progression individuelle sans comparaison. Lequel performe mieux sur notre population ?"
2. **Apporter des données** : Chercher des études sur la gamification en formation adulte (contexte différent des jeux vidéo ou des applications grand public). La littérature sur la Self-Determination Theory (Deci & Ryan) montre que l'autonomie et la compétence perçue sont de meilleurs prédicteurs de l'engagement durable que la compétition.
3. **Rendre l'éthique tangible** : "Si notre classement décourage les apprenants en situation de handicap ou en reconversion difficile, notre taux de complétion global va baisser — et nos partenaires entreprises mesureront le taux de certification, pas le taux d'engagement."

**Dimension éthique et inclusive**

Proposer une alternative : gamification par progression personnelle (comparaison de soi à soi dans le temps), badges liés à des compétences réelles plutôt qu'au volume d'activité, et possibilité de désactiver la visibilité de son avancement pour les apprenants qui le souhaitent.

❌ **Dark pattern de gamification** : Un leaderboard visible par tous dans un contexte d'apprentissage peut créer une pression sociale qui amène des apprenants à "jouer les points" plutôt qu'à apprendre réellement, et à abandonner si leur position est trop basse. C'est un dark pattern si l'objectif affiché est "favoriser l'apprentissage" mais que le mécanisme favorise en réalité le volume d'activité.

**KPIs impactés**

- UX : taux de complétion des formations (indicateur principal — pas l'engagement brut), NPS des apprenants à 3 et 6 mois, taux d'abandon par segment (identifier si les populations vulnérables abandonnent plus après l'introduction de la gamification), SUS sur l'expérience d'apprentissage
- Business : taux de certification (ce que mesurent les entreprises partenaires), rétention des apprenants sur les formations longues (> 3 mois), NPS des entreprises partenaires (leur KPI principal est le retour à l'emploi ou la montée en compétence, pas l'engagement)

**Erreurs classiques**

- Transposer des mécaniques de gamification B2C (applications fitness, Duolingo) à un contexte B2B et formation adulte sans adapter
- Mesurer l'engagement (clics, sessions, temps passé) comme proxy du succès quand le vrai KPI est l'acquisition de compétences

> **Changement de paradigme** : L'engagement est un moyen, pas une fin — un apprenant peut être très engagé dans une gamification et ne rien apprendre. Le KPI ultime d'une edtech est la compétence acquise, pas le temps passé sur la plateforme.
