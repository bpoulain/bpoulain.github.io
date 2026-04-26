# Section 3 — Psychologie appliquée à l'UX & Product — Exercices

> **Mode d'emploi** : Pour chaque exercice, écris ta réponse avant de consulter la correction. L'objectif est de confronter ton modèle mental actuel au raisonnement UX/Product attendu.

---

## Concept A — Biais cognitifs : ancrage, confirmation et disponibilité

---

### BLOC 1 — Exercices

---

#### Exercice A1 — Traduction mentale

Un chef de produit présente les résultats d'un sondage interne à son équipe. 78 % des employés de l'entreprise affirment que l'application mobile est "intuitive". Il s'appuie sur ce chiffre pour convaincre sa direction d'annuler une série de tests utilisateurs planifiés avec des clients réels, au motif que "les données sont déjà là".

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Quels biais reconnaîs-tu dans cette situation ?

---

#### Exercice A2 — Piège de paradigme

Voici un extrait d'un brief produit réel :

> "Lors de nos entretiens utilisateurs, nous avons posé la question suivante : *Notre nouvelle navigation est-elle plus claire que l'ancienne, n'est-ce pas ?* 80 % des participants ont répondu oui. Nous validerons donc la nouvelle navigation et passerons en phase de développement."

**Question :** Qu'est-ce qui ne va pas ici ? Liste les problèmes méthodologiques. Quels KPI UX et business seraient affectés par cette décision si elle était mise en production ?

---

#### Exercice A3 — Mini-cas réel

**Contexte produit :** Tu es UX Lead sur une application de prise en charge médicale à distance pour personnes âgées (65–85 ans). L'équipe a reçu 12 tickets de support en une semaine signalant des difficultés à trouver le bouton "Prendre un rendez-vous". Le CEO, après avoir lu un article sur une startup concurrente qui a "redesigné son onboarding et triplé ses conversions", demande de refondre entièrement l'onboarding en priorité.

**Dimension éthique et inclusive :** Cette population est particulièrement vulnérable à la surcharge cognitive et aux biais de disponibilité dans les décisions produit (les 12 tickets bruyants masquent peut-être une majorité silencieuse satisfaite — ou au contraire, l'iceberg d'un problème systémique).

**Questions :**
1. Décris ton modèle mental AVANT de commencer : quelle est, selon toi, la vraie nature du problème ?
2. Comment prioriseras-tu et investigues-tu ? Quelles méthodes de recherche choisiras-tu et pourquoi ?
3. Quels KPI suivrais-tu pour valider (ou invalider) la demande du CEO ?

---

### BLOC 2 — Corrections

---

#### Correction A1

**Modèle mental attendu**
Il faut distinguer source de données (employés internes vs utilisateurs réels), nature du biais (confirmation) et pertinence de la métrique (opinion interne ≠ performance UX mesurée).

**Raisonnement UX/Product**
Le chef de produit commet deux biais simultanés :
- **Biais de confirmation** : il sélectionne la donnée qui confirme sa position (le sondage favorable) et rejette l'investigation contradictoire (les tests).
- **Biais de disponibilité** : le chiffre de 78 % est saillant, récent, facile à citer — il occupe tout l'espace de décision.

De plus, les employés sont des utilisateurs atypiques : ils connaissent le produit, ses raccourcis, sa logique interne. Leur opinion sur l'"intuitivité" ne prédit pas l'expérience d'un client novice.

**Solution détaillée**
1. Maintenir les tests utilisateurs avec les véritables clients cibles.
2. Encadrer le sondage interne comme un signal faible, pas une validation.
3. Proposer au chef de produit de formuler une hypothèse testable : "Si l'application est vraiment intuitive, le taux de complétion de la tâche principale doit dépasser X % en test non assisté."

**KPIs impactés**
- UX : SUS score (System Usability Scale), taux de complétion des tâches, taux d'erreur
- Business : taux d'activation, taux de churn précoce, coût du support client

**Erreurs classiques**
- Confondre satisfaction déclarative et performance mesurée
- Faire confiance à des proxies internes pour des décisions orientées client
- Annuler la recherche pour "économiser du temps" (résultat : beaucoup plus de temps perdu en refontes post-lancement)

**Correction du biais cognitif**
Le biais de confirmation se combat avec un protocole de falsification : avant de valider, cherche activement à invalider ton hypothèse.

**Feedback itératif**
Une donnée qui te conforte sans t'avoir rien coûté mérite d'être questionnée deux fois plus sévèrement.

---

#### Correction A2

**Modèle mental attendu**
La question posée est orientée (leading question), ce qui invalide les résultats. Même si 80 % disent "oui", cette réponse mesure la pression sociale et le biais de confirmation, pas la clarté réelle de la navigation.

**Raisonnement UX/Product**
Problèmes méthodologiques identifiés :
1. **Question suggestive** : "n'est-ce pas ?" oriente vers la réponse positive — violation du principe de neutralité en recherche qualitative.
2. **Absence de tâche concrète** : "est-ce plus clair ?" est une évaluation abstraite. Une vraie validation demande à l'utilisateur d'accomplir une tâche réelle et mesure son succès.
3. **Biais de désirabilité sociale** : les participants ont tendance à répondre ce que l'interviewer semble vouloir entendre.
4. **Absence de baseline** : sans mesure de la navigation ancienne, la comparaison est vide de sens.

**Solution détaillée**
Reformuler le protocole :
- Remplacer la question fermée orientée par une tâche d'usabilité : "Montrez-moi comment vous feriez pour [objectif clé]."
- Mesurer le taux de succès, le temps sur tâche, le nombre de clics erronés.
- Recueillir l'évaluation verbatim post-tâche (non suggestive).

**KPIs impactés si la décision est maintenue en prod**
- UX : augmentation du taux d'erreur de navigation, SUS dégradé, augmentation du temps sur tâche
- Business : baisse du taux de conversion, hausse du taux de rebond, hausse des tickets support, impact négatif sur le NPS

**Erreurs classiques**
- Confondre un accord verbal avec une validation comportementale
- Passer en dev sur la base d'une seule question mal posée
- Négliger le coût d'un rollback post-lancement

**Correction du biais cognitif**
Le biais de confirmation dans la recherche se corrige en rédigeant les questions avant de connaître les résultats espérés, et en les faisant relire par quelqu'un d'extérieur à l'équipe.

**Feedback itératif**
Si ta méthode de recherche peut seulement confirmer, elle ne peut pas valider.

---

#### Correction A3

**Modèle mental attendu**
Les 12 tickets sont un signal de disponibilité (biais de disponibilité du CEO et de l'équipe). Ils sont bruyants mais non représentatifs sans contexte. La demande de refonte de l'onboarding est une solution imposée avant que le problème ne soit compris. Sur une population âgée, une refonte mal conduite peut aggraver la situation.

**Raisonnement UX/Product**

Étape 1 — Quantifier le signal réel
- Quel est le volume total d'utilisateurs actifs ? 12 tickets sur 10 000 utilisateurs ≠ 12 tickets sur 200.
- Les tickets signalent un bouton introuvable : c'est un problème de findability (trouvabilité), pas nécessairement un problème d'onboarding.

Étape 2 — Distinguer onboarding et findability
- L'onboarding est le parcours d'accueil (première utilisation).
- Le bouton "Prendre un rendez-vous" est un élément de navigation récurrente.
- Refondre l'onboarding n'améliorera pas la navigation post-onboarding.

Étape 3 — Méthodes de recherche recommandées
- **Analyse des sessions enregistrées** (heatmaps, click maps) pour voir où les utilisateurs cliquent réellement.
- **Test d'arborescence** (tree testing) pour valider que l'étiquette et la position du bouton sont trouvables.
- **Tests utilisateurs non assistés** avec 5 participants de la tranche 65–85 ans sur la tâche "prise de rendez-vous".

Dimension éthique et inclusive :
- Recruter des participants représentatifs : presbytie, tremblement léger, faible littératie numérique.
- Vérifier la taille des cibles tactiles (minimum 44×44 px recommandé WCAG), le contraste, le libellé du bouton.
- Ne pas sur-optimiser pour un profil "senior stéréotypé" — l'hétérogénéité est grande à cet âge.

**KPIs à suivre**
- UX : taux de complétion de la tâche "prise de rendez-vous", taux d'erreur, temps sur tâche, SUS score
- Business : taux d'utilisation de la fonctionnalité, volume de tickets support liés, taux de rétention à 30 jours, coût du support téléphonique évité

**Erreurs classiques**
- Confondre le symptôme (tickets) avec le problème (findability vs onboarding)
- Agir sur le dernier article lu plutôt que sur la donnée propre au contexte
- Négliger l'accessibilité cognitive pour une population âgée

**Correction du biais cognitif**
Le biais de disponibilité (l'article sur la startup, les 12 tickets) rend certaines solutions "évidentes" sans qu'elles soient pertinentes. La parade : cartographier le problème avant d'évaluer les solutions.

**Feedback itératif**
La solution la plus visible n'est presque jamais la solution au problème le plus important.

---

## Concept B — Charge cognitive & loi de Hick

---

### BLOC 1 — Exercices

---

#### Exercice B1 — Traduction mentale

Un designer présente une nouvelle page d'accueil d'une application B2B de gestion de projets. La page comporte : un menu principal à 9 entrées, 4 widgets de statistiques, 2 notifications urgentes, un champ de recherche, une liste des 10 derniers projets, et un bouton "Démarrer un nouveau projet" en bas de page.

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Qu'est-ce qui pourrait poser problème ici ?

---

#### Exercice B2 — Piège de paradigme

Une équipe produit décide d'améliorer son tunnel d'inscription en ajoutant des étapes supplémentaires pour "mieux qualifier les utilisateurs". Le formulaire passe de 3 champs à 11 champs. L'équipe marketing se félicite : "Nous aurons des données plus riches sur nos prospects."

**Question :** Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?

---

#### Exercice B3 — Mini-cas réel

**Contexte produit :** Tu travailles sur une plateforme d'apprentissage en ligne destinée à des demandeurs d'emploi en reconversion professionnelle (public varié : 25–55 ans, niveaux d'études hétérogènes, accès au numérique parfois limité). L'équipe souhaite ajouter 6 nouvelles fonctionnalités sur le tableau de bord principal : suivi de progression, forum communautaire, calendrier de sessions live, bibliothèque de ressources, messagerie avec le mentor, et badge de niveau.

**Dimension éthique et inclusive :** Ce public peut être en situation de fragilité psychologique (stress lié au chômage, sentiment d'illégitimité). Une surcharge de l'interface peut provoquer de l'abandon et renforcer le sentiment d'incapacité.

**Questions :**
1. Décris ton modèle mental AVANT de commencer : comment envisages-tu l'organisation de ces fonctionnalités ?
2. Quelle stratégie de réduction de la charge cognitive appliqueras-tu ? (chunking, progressive disclosure, hiérarchie visuelle…)
3. Quels KPI suivrais-tu pour valider que ta solution réduit réellement la charge cognitive ?

---

### BLOC 2 — Corrections

---

#### Correction B1

**Modèle mental attendu**
La page cumule trop d'éléments de priorité concurrente. La loi de Hick prédit que le temps de décision augmente logarithmiquement avec le nombre d'options. Une page d'accueil avec 9 entrées de menu + 4 widgets + notifications n'a pas de hiérarchie claire : tout est "prioritaire", donc rien ne l'est.

**Raisonnement UX/Product**
- La loi de Hick s'applique : trop d'options = paralysie décisionnelle.
- La charge cognitive extrinsèque (liée à l'interface, non à la tâche) est élevée : l'utilisateur doit d'abord décoder l'interface avant de pouvoir travailler.
- Le bouton "Démarrer un nouveau projet" — probablement l'action principale — est relégué en bas de page.

**Solution détaillée**
1. Identifier la tâche principale de l'utilisateur à l'arrivée sur le dashboard (hypothèse à valider par la recherche).
2. Appliquer une hiérarchie visuelle : 1 action primaire bien visible, 2–3 informations secondaires, le reste accessible mais discret.
3. Regrouper le menu en catégories (chunking) pour réduire les entrées visibles à 3–5.
4. Positionner le CTA principal (nouveau projet) dans la zone de lecture naturelle (haut gauche ou centre).

**KPIs impactés**
- UX : temps sur tâche, taux d'erreur, SUS score, taux d'abandon du tableau de bord
- Business : taux d'adoption des fonctionnalités clés, engagement quotidien (DAU), NPS

**Erreurs classiques**
- Ajouter des informations "parce qu'elles sont disponibles" plutôt que parce qu'elles sont utiles à ce moment précis
- Confondre richesse fonctionnelle et valeur perçue par l'utilisateur

**Correction du biais cognitif**
L'équipe produit souffre de biais de complétude : montrer tout ce que le produit peut faire. L'utilisateur, lui, veut accomplir une tâche précise le plus vite possible.

**Feedback itératif**
Un bon dashboard ne montre pas tout ce qui est disponible — il montre ce dont l'utilisateur a besoin maintenant.

---

#### Correction B2

**Modèle mental attendu**
L'ajout de champs alourdit la charge cognitive et augmente le coût d'entrée dans le produit. La loi de Hick s'applique à chaque champ : chaque question supplémentaire est une micro-décision qui fatigue l'utilisateur et augmente la probabilité d'abandon.

**Raisonnement UX/Product**
- Chaque champ supplémentaire représente un coût cognitif et motivationnel pour l'utilisateur.
- La recherche montre systématiquement qu'au-delà de 3–5 champs, le taux de complétion des formulaires chute significativement.
- Le besoin de "données riches" est un besoin marketing interne, pas un besoin utilisateur. Il crée un conflit d'intérêts direct.

❌ **Dark pattern détecté** : forcer l'utilisateur à fournir des données personnelles supplémentaires sans bénéfice direct pour lui, sous couvert d'"amélioration de l'expérience", est une pratique limite. Si les données sont revendues ou utilisées à des fins non déclarées, c'est une violation du RGPD.

**Solution détaillée**
1. Garder le formulaire d'inscription à l'essentiel (email + mot de passe, ou connexion sociale).
2. Collecter les données de qualification progressivement, après activation, via un onboarding en plusieurs étapes légères (progressive disclosure).
3. Rendre les champs optionnels visibles comme optionnels, et expliquer à quoi servent les données collectées.

**KPIs impactés**
- UX : taux de complétion du formulaire, taux d'abandon à chaque étape (funnel analysis), temps de complétion
- Business : taux de conversion inscription → activation, coût d'acquisition client (CAC), taux de churn précoce

**Erreurs classiques**
- Optimiser pour la qualité du lead marketing aux dépens du taux de conversion
- Ne pas mesurer l'impact de chaque champ ajouté sur l'abandon

**Correction du biais cognitif**
Biais de suroptimisation interne : l'équipe optimise pour ses propres outils (CRM enrichi) plutôt que pour l'expérience utilisateur.

**Feedback itératif**
Les données que tu ne collectes pas à l'inscription peuvent être obtenues plus tard, chez un utilisateur déjà convaincu.

---

#### Correction B3

**Modèle mental attendu**
6 fonctionnalités nouvelles sur un dashboard = risque élevé de surcharge cognitive pour un public déjà fragilisé. La solution n'est pas de choisir lesquelles supprimer, mais de décider lesquelles montrer quand, à qui, et comment.

**Raisonnement UX/Product**

Stratégie de réduction de la charge cognitive :

**1. Progressive disclosure (divulgation progressive)**
Ne pas afficher les 6 fonctionnalités dès le premier accès. Définir un parcours d'activation :
- Jour 1 : suivi de progression + prochaine session (les deux informations les plus motivantes)
- Semaine 1 : messagerie mentor activée dès la première session complétée
- Semaine 2 : forum et bibliothèque présentés quand l'utilisateur a terminé son premier module

**2. Chunking**
Regrouper les 6 fonctionnalités en 3 zones sémantiques :
- "Mon parcours" (progression + badge)
- "Mes ressources" (bibliothèque + sessions live)
- "Ma communauté" (forum + mentor)

**3. Hiérarchie visuelle**
Mettre en avant la prochaine action concrète recommandée (ex. : "Votre prochain module vous attend") plutôt qu'un inventaire de fonctionnalités.

**Dimension éthique et inclusive**
- Éviter les indicateurs de "performance" anxiogènes (barres de progression au rouge, compteurs de jours d'inactivité).
- Proposer des libellés encourageants et non culpabilisants ("Reprendre là où vous vous êtes arrêté" vs "Vous avez du retard").
- Tester l'interface avec des utilisateurs ayant un faible niveau de littératie numérique.
- Vérifier la compatibilité avec les lecteurs d'écran pour les utilisateurs en situation de handicap visuel.

**KPIs à suivre**
- UX : taux de retour à J+3 et J+7, taux d'utilisation de chaque fonctionnalité, SUS score, taux d'abandon du dashboard
- Business : taux de complétion des modules, taux de rétention à 30 jours, NPS, taux d'engagement avec le mentor

**Erreurs classiques**
- Lancer toutes les fonctionnalités simultanément "pour ne pas retarder les utilisateurs"
- Négliger l'impact psychologique de l'interface sur un public fragile
- Mesurer uniquement l'utilisation des fonctionnalités sans mesurer le sentiment d'efficacité perçue

**Correction du biais cognitif**
Biais de fonctionnalité : l'équipe pense que plus il y a de fonctionnalités visibles, plus le produit est perçu comme riche. Pour l'utilisateur en reconversion, chaque fonctionnalité non utilisée est une source de honte potentielle.

**Feedback itératif**
Un produit inclusif ne cache rien — il révèle les fonctionnalités au bon moment, pour la bonne personne, dans le bon état émotionnel.

---

## Concept C — Influence et persuasion éthique vs dark patterns

---

### BLOC 1 — Exercices

---

#### Exercice C1 — Traduction mentale

Un responsable marketing te demande d'ajouter sur la page de tarification les mentions suivantes : "⚡ Plus que 2 places disponibles !", un compte à rebours "Offre expire dans 01:47:32", et des étoiles de notation affichant "4,9/5 (2 341 avis)". Il te précise en privé que les places sont en réalité illimitées, que le compte à rebours se réinitialise à chaque visite, et que les avis ne sont pas vérifiés.

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ?

---

#### Exercice C2 — Piège de paradigme

Voici la page de désinscription d'un service de streaming :

> "Êtes-vous sûr de vouloir partir ? Si vous annulez maintenant, vous perdrez :
> - Vos 47 films sauvegardés
> - Votre historique de visionnage depuis 2019
> - Vos 3 profils familiaux
> - Votre accès hors ligne
> - Votre tarif spécial ancienneté (non récupérable)
>
> [Rester et profiter] &nbsp;&nbsp;&nbsp; [Annuler quand même]"

**Question :** Identifie les techniques de persuasion utilisées. Lesquelles sont éthiques, lesquelles ne le sont pas ? Quels KPI seraient artificiellement gonflés ?

---

#### Exercice C3 — Mini-cas réel

**Contexte produit :** Tu travailles sur une application de coaching nutritionnel par abonnement (9,99 €/mois). Le taux de churn mensuel est de 18 %. La direction te demande de "réduire le churn par tous les moyens". Certains membres de l'équipe proposent de rendre le bouton d'annulation difficile à trouver, d'ajouter des écrans d'obstruction (roach motel), et d'envoyer des emails de culpabilisation ("Vous abandonnez vos objectifs de santé ?").

**Dimension éthique et inclusive :** Une application de santé opère dans un domaine sensible. Manipuler des utilisateurs sur leurs comportements alimentaires ou leur rapport au corps peut causer des dommages psychologiques réels, particulièrement chez les personnes souffrant de troubles alimentaires.

**Questions :**
1. Décris ton modèle mental AVANT de commencer : quelles sont les vraies causes d'un churn à 18 % ?
2. Quelles techniques de rétention sont éthiques et efficaces sur le long terme ?
3. Quels KPI suivrais-tu pour distinguer une rétention "saine" d'une rétention forcée ?

---

### BLOC 2 — Corrections

---

#### Correction C1

**Modèle mental attendu**
Les trois éléments demandés sont des dark patterns de type "fausse urgence" et "preuve sociale falsifiée". Ils constituent des pratiques trompeuses illégales dans plusieurs juridictions (RGPD, DSA, réglementations consommateurs en Europe).

**Raisonnement UX/Product**
- **Fausse rareté** ("2 places disponibles") : crée une pression artificielle via le biais de rareté. ❌ Dark pattern.
- **Faux compte à rebours** (se réinitialise) : exploite le biais d'urgence temporelle de manière mensongère. ❌ Dark pattern + pratique commerciale déloyale.
- **Avis non vérifiés** présentés comme authentiques : manipulation de la preuve sociale. ❌ Dark pattern + potentiellement illégal (RGPD, directive Omnibus UE 2022).

**Solution détaillée**
Refuser d'implémenter ces demandes dans leur forme actuelle. Proposer des alternatives éthiques :
- Afficher les vrais avis vérifiés (via un tiers de confiance comme Trustpilot), même si la note est légèrement inférieure.
- Utiliser la rareté réelle si elle existe ("Dernières places pour la formation du 15 mai" si c'est vrai).
- Remplacer le compte à rebours par une vraie offre limitée dans le temps, communiquée honnêtement.

**KPIs impactés**
- Court terme : les dark patterns peuvent gonfler artificiellement le taux de conversion.
- Moyen terme : hausse du taux de churn (acheteurs manipulés non satisfaits), dégradation du NPS, risque légal.
- Long terme : atteinte à la réputation, amendes réglementaires, perte de confiance durable.

**Erreurs classiques**
- Confondre optimisation du taux de conversion et manipulation
- Ignorer le coût réputationnel et légal des dark patterns
- Ne pas distinguer persuasion (information honnête qui motive) et manipulation (information fausse qui presse)

**Correction du biais cognitif**
Biais de court terme : optimiser le taux de conversion d'aujourd'hui en dégradant la confiance de demain est une destruction de valeur déguisée en gain.

**Feedback itératif**
Un utilisateur convaincu revient. Un utilisateur manipulé se plaint.

---

#### Correction C2

**Modèle mental attendu**
Cette page combine des techniques légitimes et des dark patterns. L'analyse doit distinguer information honnête (rappeler ce qu'on perd) et obstruction délibérée (asymétrie des options, culpabilisation).

**Raisonnement UX/Product**

Techniques utilisées et leur nature :

| Technique | Éthique ? | Explication |
|---|---|---|
| Lister les données perdues | ⚠️ Limite | Informer est légitime. Présenter la liste pour maximiser la culpabilité est une manipulation émotionnelle. |
| "Tarif spécial non récupérable" | ❌ Dark pattern | Crée une fausse peur de la perte (loss aversion exploitée). Si c'est vrai, c'est une info légitime ; si c'est faux ou exagéré, c'est trompeur. |
| Asymétrie des boutons | ❌ Dark pattern | "Rester et profiter" est visually dominant, "Annuler quand même" est minimisé. C'est un confirmshaming (honte de confirmer). |
| "Quand même" dans le libellé | ❌ Dark pattern | Le mot "quand même" implique que la décision est irrationnelle. C'est du langage manipulatoire. |

**KPIs artificiellement gonflés**
- Taux de rétention mensuel (les utilisateurs ne partent pas, mais ils n'utilisent pas le service)
- MRR apparent (revenus maintenus par friction, non par valeur)
- Ces KPI masquent le vrai problème : faible valeur perçue du service.

**Solution éthique**
Un écran de désinscription peut légitimement :
- Rappeler les avantages actuels (honnêtement)
- Proposer une pause (au lieu d'annuler)
- Proposer un tarif réduit si disponible
- Demander le motif de départ (pour améliorer le produit)
Il ne doit pas : culpabiliser, asymétriser les boutons, ou induire une fausse urgence.

**Feedback itératif**
Retenir un utilisateur qui veut partir coûte plus cher que comprendre pourquoi il veut partir.

---

#### Correction C3

**Modèle mental attendu**
Un churn de 18 % est un symptôme, pas un problème. Les techniques d'obstruction proposées traitent le symptôme en aggravant la cause. Dans un domaine de santé, les dommages potentiels sont amplifiés.

**Raisonnement UX/Product**

Étape 1 — Comprendre les causes du churn
- Analyser à quel moment du parcours les utilisateurs annulent (J+7 ? M+1 ? M+3 ?)
- Segmenter : qui churne ? Les utilisateurs peu actifs ? Ceux qui n'ont pas atteint leurs objectifs ?
- Mener des exit surveys (sondages de sortie) pour comprendre les motifs réels.
- Causes probables : valeur perçue insuffisante, manque d'engagement, objectifs irréalistes fixés à l'onboarding, absence de résultats visibles.

Étape 2 — Techniques de rétention éthiques

**Éthiques et efficaces :**
- Personnalisation du contenu selon les progrès réels de l'utilisateur
- Rappels motivationnels basés sur des progrès observés ("Vous avez tenu 7 jours sur 7 cette semaine !")
- Fonctionnalité de pause (au lieu de l'annulation immédiate)
- Offre de tarif réduit pour les utilisateurs à risque d'annulation (proposé explicitement, pas caché)
- Amélioration réelle des fonctionnalités les moins utilisées

❌ **Dark patterns refusés :**
- Bouton d'annulation caché : roach motel, illégal dans plusieurs pays, contraire au RGPD
- Emails de culpabilisation sur la santé : manipulation émotionnelle sur un sujet sensible, risque de dommages psychologiques réels (troubles alimentaires, anxiété)
- Écrans d'obstruction multiples : pratique déloyale

**Dimension éthique et inclusive**
Les applications de nutrition touchent des personnes potentiellement vulnérables (TCA, dysmorphophobie, historique de régimes yo-yo). Tout discours culpabilisant sur "l'abandon des objectifs" peut être dangereux. Une charte éthique produit est recommandée, avec relecture par un professionnel de santé mentale.

**KPIs pour distinguer rétention saine vs rétention forcée**
- Rétention saine : DAU/MAU ratio élevé, taux de complétion des plans alimentaires, NPS > 40, réabonnement spontané après pause
- Rétention forcée : utilisateurs actifs en baisse malgré abonnement maintenu, NPS faible, tickets support élevés, taux de remboursement / litiges bancaires en hausse

**Feedback itératif**
La rétention forcée est de la valeur empruntée — elle sera toujours remboursée avec intérêts en churn différé et en réputation dégradée.

---

## Concept D — Gamification éthique

---

### BLOC 1 — Exercices

---

#### Exercice D1 — Traduction mentale

Une startup EdTech décide d'implémenter un système de gamification complet : points d'XP, niveaux, classements publics hebdomadaires des apprenants les plus actifs, badges, et une "flamme" qui disparaît si l'utilisateur n'apprend pas pendant 24h.

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Quelles mécaniques te semblent bénéfiques, lesquelles te semblent problématiques ?

---

#### Exercice D2 — Piège de paradigme

Une application de méditation affiche en page d'accueil : "🔥 Série de 47 jours ! Ne brisez pas votre streak !" avec une notification push envoyée à 23h00 si l'utilisateur n'a pas médité de la journée.

**Question :** Qu'est-ce qui ne va pas ici ? Quels KPI sont optimisés au détriment de quels autres ?

---

#### Exercice D3 — Mini-cas réel

**Contexte produit :** Tu travailles sur une application d'apprentissage des langues pour des adultes en situation de handicap cognitif léger (difficultés d'attention, mémoire à court terme). L'équipe veut introduire de la gamification pour augmenter l'engagement. Le public inclut des personnes avec TDA/H, des personnes en rémission après AVC, et des personnes âgées en prévention cognitive.

**Dimension éthique et inclusive :** Ce public est particulièrement sensible aux mécaniques de punition (streak perdu, classement), aux notifications intrusives, et à la compétition sociale. Une mauvaise implémentation peut provoquer abandon, frustration et sentiment d'échec amplifié.

**Questions :**
1. Décris ton modèle mental AVANT de commencer : quelles mécaniques de gamification sont adaptées ou contre-indiquées pour ce public ?
2. Conçois un système de gamification éthique adapté à ce contexte.
3. Quels KPI suivrais-tu pour mesurer l'impact positif vs négatif de la gamification ?

---

### BLOC 2 — Corrections

---

#### Correction D1

**Modèle mental attendu**
La gamification n'est pas neutre. Chaque mécanique a un effet motivationnel différent et peut générer motivation intrinsèque (apprendre pour le plaisir) ou motivation extrinsèque (apprendre pour le score). Seule la première est durable.

**Analyse des mécaniques**

| Mécanique | Évaluation | Risque |
|---|---|---|
| Points d'XP | ⚠️ Neutre | Utile si reflète la progression réelle. Problématique si remplace la progression. |
| Niveaux | ✅ Plutôt éthique | Sentiment de progression clair. |
| Classements publics | ❌ Problématique | Décourage les apprenants lents, crée compétition anxiogène. |
| Badges | ✅ Plutôt éthique | Reconnaissance des accomplissements si méritée. |
| Streak + punition | ❌ Dark pattern de gamification | Crée de l'anxiété, favorise la compulsion sur la compréhension. Duolingo a d'ailleurs assoupli ce système après des critiques. |

**Solution détaillée**
- Remplacer le classement compétitif par des défis collaboratifs ou des comparaisons à soi-même.
- Transformer la streak en "jours consécutifs cette semaine" sans disparition punitive.
- Ajouter des "jours de grâce" (streak shield) pour éviter l'anxiété.

**Feedback itératif**
Une mécanique de gamification éthique récompense l'effort, pas la compulsion.

---

#### Correction D2

**Modèle mental attendu**
Une application de méditation dont la mécanique principale crée de l'anxiété génère une contradiction fondamentale entre son objet (réduire le stress) et son moyen (créer une pression de non-abandon de streak).

**Raisonnement UX/Product**
- La notification à 23h00 est intrusive, non consentie et potentiellement néfaste pour le sommeil.
- La "flamme" de streak exploite le biais d'aversion à la perte. Ce n'est pas de la motivation intrinsèque — c'est de la compulsion.
- L'effet est mesurable : les utilisateurs méditent pour ne pas perdre leur streak, pas pour méditer. La qualité de l'expérience se dégrade.

**KPIs optimisés au détriment d'autres**
- Optimisé : DAU, sessions quotidiennes, rétention J+30
- Dégradé : qualité perçue de la méditation, NPS à long terme, taux de recommandation, bien-être réel (non mesurable mais central à la mission produit)

❌ **Dark pattern de gamification** : exploiter l'aversion à la perte pour créer de la compulsion dans une application censée réduire le stress.

**Solution éthique**
- Streak optionnel, activable par l'utilisateur s'il le souhaite.
- Notification envoyée au moment choisi par l'utilisateur, pas à 23h.
- Option "Je prends une pause cette semaine" sans perte du streak.
- Message de félicitation centré sur le bénéfice ("Vous avez médité 5 fois ce mois-ci — c'est 5 moments pour vous.") et non sur le score.

**Feedback itératif**
Si ta mécanique de rétention crée le problème que ton produit prétend résoudre, tu as un problème de mission, pas de design.

---

#### Correction D3

**Modèle mental attendu**
Pour un public avec handicap cognitif léger, la gamification compétitive et punitive est contre-indiquée. La gamification adaptée repose sur la progression personnelle, la récompense positive, et la flexibilité.

**Raisonnement UX/Product**

Mécaniques contre-indiquées pour ce public :
- Classements et comparaisons sociales (source d'anxiété et de sentiment d'échec)
- Streak avec punition de perte (charge mémorielle et anxiété)
- Notifications fréquentes ou nocturnes (fragmentation de l'attention, perturbation du sommeil)
- Minuteries et pression temporelle (incompatible avec TDA/H et lenteur cognitive post-AVC)

Mécaniques adaptées :
- **Progression visible non comparative** : barre de progression personnelle ("Vous avez appris 47 mots !")
- **Récompenses immédiates et positives** : animation de célébration après chaque exercice réussi
- **Micro-objectifs quotidiens flexibles** : l'utilisateur définit lui-même son objectif (5 min ou 20 min)
- **Raccourcis de reprise** : "Reprendre là où vous vous êtes arrêté" sans culpabilisation
- **Mode "journée calme"** : désactive les notifications et les éléments dynamiques pour une session zen
- **Badges de régularité longue durée** : valoriser 1 session par semaine pendant 3 mois, pas 90 jours consécutifs

**Dimension éthique et inclusive**
- Paramètres d'accessibilité cognitive : réduction des animations, taille de police, mode contraste élevé
- Consentement explicite pour chaque type de notification
- Pas de score visible par défaut — l'activer est un choix de l'utilisateur
- Tester avec des représentants du public cible, accompagnés si nécessaire de leur aidant

**KPIs positifs vs négatifs**
- Positifs : taux de retour hebdomadaire (vs quotidien), taux de complétion des exercices, satisfaction déclarée (échelle 1–5 simple), progrès vocabulaire mesuré
- Signaux d'alerte : taux d'abandon brutal, baisse des sessions après une semaine (signe de découragement), verbatims négatifs dans les notes de stores

**Feedback itératif**
La gamification éthique mesure les progrès de l'utilisateur contre lui-même d'hier — jamais contre les autres.

---

*Fin des exercices — Section 3*

> **Prochaine étape :** Section 4 — Idéation & Conception UX — Exercices
