# Section 6 — Prototypage, Validation & Optimisation — Exercices

> Fichier d'exercices avec corrections. Chaque concept est travaillé sur trois niveaux : traduction mentale, détection de piège, et mini-cas réel avec dimension éthique et inclusive.

---

## Table des matières

1. [Concept 1 — Tests utilisateurs](#concept-1--tests-utilisateurs)
2. [Concept 2 — A/B Testing](#concept-2--ab-testing)
3. [Concept 3 — Analytics & Heatmaps](#concept-3--analytics--heatmaps)
4. [Concept 4 — Éthique IA Produit](#concept-4--éthique-ia-produit)

---

## Concept 1 — Tests utilisateurs

> Planification, protocole think-aloud, recrutement, analyse des résultats

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Une startup de santé numérique vient de terminer la conception d'une application permettant à des patients chroniques de suivre leur traitement quotidien et de communiquer avec leur médecin. La CPO annonce fièrement en réunion : "On a testé l'appli avec 3 collègues et 2 stagiaires — tout le monde a trouvé ça intuitif, on peut passer au développement."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Ce que la CPO appelle "test" est-il suffisant pour valider l'expérience de cette application ? Qu'est-ce qui te poserait problème dans cette approche, et pourquoi cela pourrait-il avoir des conséquences graves pour ce type de produit en particulier ?

---

#### Exercice 2 — Piège de paradigme

Une équipe UX d'une plateforme e-commerce B2B prépare une session de tests utilisateurs pour valider leur nouveau tunnel de commande. Voici le protocole tel qu'il a été rédigé par le PM :

---

*Protocole de test — Tunnel de commande B2B*

- **Participants recrutés** : 8 personnes du réseau LinkedIn du PM, dont 4 amis personnels
- **Scénario** : "Essayez d'utiliser notre nouvelle interface — dites-nous ce que vous pensez."
- **Consigne modérateur** : "Si quelqu'un est bloqué, aide-le pour ne pas perdre de temps."
- **Analyse** : "On notera les commentaires positifs et négatifs dans un tableau Excel à la fin."
- **Durée** : 15 minutes par participant, back-to-back toute la journée

---

**Question :** Identifie tous les problèmes de ce protocole. Pour chacun, explique l'impact sur la fiabilité des résultats et les KPIs UX qui seraient faussés. Y a-t-il des dimensions éthiques à considérer dans le recrutement décrit ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Researcher chez une néobanque qui lance une fonctionnalité de planification budgétaire automatique. L'algorithme analyse les dépenses passées et propose des "enveloppes budgétaires" mensuelles. La fonctionnalité sera utilisée par l'ensemble des clients, dont une part significative de personnes en situation de fragilité financière (surendettement, minima sociaux, travailleurs précaires). Le Product Manager veut valider le prototype en deux semaines avant le lancement.

**Dimension éthique et inclusive :** 23 % des utilisateurs actifs de la néobanque déclarent un revenu inférieur à 1 200 €/mois. L'algorithme de budgétisation n'a été entraîné que sur les données de clients "actifs stables" (revenus réguliers, pas d'incidents de paiement). L'équipe data confirme que les personnes à revenus variables ou irréguliers représentent moins de 8 % des données d'entraînement.

**Questions :**

1. Décris ton modèle mental AVANT de commencer : quelles hypothèses as-tu sur les besoins de chaque profil d'utilisateur, et pourquoi le profil "actif stable" ne peut pas représenter tous les utilisateurs ?

2. Construis un protocole de test complet : recrutement (critères, nombre, diversité), scénarios think-aloud, consignes modérateur, durée, environnement. Intègre explicitement les utilisateurs en situation de fragilité financière.

3. Comment analyseras-tu les résultats ? Définis ta méthode de priorisation des insights. Quelles observations t'amèneraient à recommander de bloquer le lancement ?

4. Quels KPIs UX et business suivrais-tu à 30, 60 et 90 jours après le lancement pour détecter des effets non prévus sur les utilisateurs fragiles ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Tester avec des collègues n'est pas un test utilisateur : c'est une revue interne. La différence fondamentale est celle du contexte cognitif. Un collègue ou un stagiaire connaît déjà le produit, le vocabulaire de l'équipe, les intentions derrière chaque choix. Un patient chronique arrive avec ses propres représentations mentales, ses habitudes, ses peurs et ses contraintes physiques ou cognitives. Un produit de santé ajoute une couche supplémentaire : l'enjeu est la sécurité thérapeutique, pas le confort d'utilisation.

**Raisonnement UX/Product**

La validité d'un test utilisateur repose sur la représentativité des participants. Ici, cinq biais majeurs s'accumulent :

1. **Biais de familiarité** : les testeurs connaissent le contexte du produit. Ils ne font pas d'effort cognitif de découverte.
2. **Biais de complaisance sociale** : les collègues ont tendance à éviter les feedbacks négatifs vis-à-vis du travail de leurs pairs.
3. **Biais de l'utilisateur expert** : des personnes habituées aux outils numériques naviguent différemment d'un patient de 65 ans atteint d'une maladie chronique qui utilise un smartphone d'entrée de gamme.
4. **Absence de représentation du public cible** : patients chroniques = population spécifique avec possibles troubles cognitifs liés à la maladie ou aux traitements, stress médical, vision réduite, motricité altérée.
5. **Enjeu de sécurité ignoré** : une erreur de dosage ou une incompréhension de l'interface dans ce contexte peut avoir des conséquences médicales graves.

**Solution détaillée**

Le protocole correct devrait inclure :

- **Recrutement représentatif** : 5 à 8 participants par segment identifié — au minimum : patients 45-65 ans avec pathologie chronique stable, patients 65+ avec ou sans aidant, patients en situation de handicap (moteur, visuel, cognitif). Recrutement via associations de patients, médecins partenaires, jamais via réseau personnel de l'équipe.
- **Scénarios réalistes** : "Vous venez de prendre votre médicament du matin. Enregistrez cette prise dans l'application." — une tâche concrète, pas "essayez l'appli".
- **Think-aloud** : protocole de verbalisation simultanée — "Dites à voix haute tout ce que vous pensez pendant que vous utilisez l'application."
- **Sans aide du modérateur** pendant l'exécution des tâches.
- **Validation spécifique** : tester les cas d'erreur critiques (mauvaise dose renseignée, rappel non reçu, confusion entre deux médicaments homonymes).

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Task success rate (prise de médicament correctement renseignée) | Taux d'incidents médicaux liés à l'interface (responsabilité légale) |
| Taux d'erreurs critiques (mauvaise dose, mauvaise heure) | Taux de rétention à 30 jours (abandon post-erreur) |
| SUS (perception de confiance dans l'interface santé) | NPS médecins prescripteurs |
| Temps de complétion d'une prise | Coût de correction post-lancement vs pré-lancement |

**Erreurs classiques**

- Confondre "feedback positif interne" avec "validation utilisateur"
- Sauter le recrutement ciblé pour aller plus vite
- Sous-estimer l'impact d'une mauvaise UX dans les produits à enjeux de santé, sécurité ou finance

**Correction du biais cognitif**

Biais de projection : l'équipe suppose que si "eux" comprennent, "tout le monde" comprend. Ce biais est d'autant plus dangereux que les concepteurs sont experts du domaine et de l'outil.

**Améliorations possibles**

Intégrer un test de "robustesse aux erreurs" : que se passe-t-il si l'utilisateur entre une dose incorrecte ? L'interface prévient-elle ? Avec quel niveau de clarté ? Ce test de cas limites est souvent oublié au profit du "chemin heureux" (happy path).

**Changement de paradigme**

Un test interne valide la conception ; seul un test avec de vrais utilisateurs représentatifs valide l'expérience.

---

#### Correction — Exercice 2 : Piège de paradigme

**Modèle mental attendu**

Un protocole de test est un dispositif scientifique : sa rigueur conditionne la fiabilité des données. Un protocole mal construit ne produit pas de données partielles — il produit des données fausses qui peuvent conduire à des décisions produit inverses aux besoins réels.

**Raisonnement UX/Product**

Analyse problème par problème :

**1. Recrutement via réseau personnel du PM ❌**
- Biais de convenance et de familiarité : les amis connaissent le PM et son projet, ils veulent inconsciemment lui faire plaisir.
- 4 amis sur 8 = 50 % du panel biaisé par la relation sociale.
- Dimension éthique : recruter des proches crée une relation d'obligation implicite qui compromet la liberté d'expression critique. Ce n'est pas un consentement libre et éclairé.
- En B2B, les utilisateurs cibles sont des acheteurs ou responsables achats en entreprise — le réseau personnel d'un PM ne correspond probablement pas à ce profil.

**2. Scénario vague et non ancré dans une tâche réelle ❌**
- "Essayez d'utiliser notre interface" ne simule aucun contexte de travail réel.
- Sans tâche concrète, le participant explore librement — il ne reproduit pas son comportement naturel.
- Un bon scénario ancre le participant dans un contexte : "Vous êtes responsable achats chez une PME de 50 personnes. Vous devez commander 200 unités de stylos en urgence pour une réunion demain matin."

**3. Aide du modérateur en cas de blocage ❌**
- C'est la règle d'or violée : le modérateur n'aide jamais pendant l'exécution.
- Un blocage est une donnée précieuse. L'aider, c'est effacer un friction point du compte-rendu.
- La bonne pratique : noter l'obstacle, laisser l'utilisateur poursuivre ou déclarer l'échec de la tâche, puis poser des questions en debriefing.

**4. Analyse non structurée ("tableau Excel positif/négatif") ❌**
- Les verbatims ne sont pas des votes. Un commentaire négatif peut être une erreur de compréhension ou un problème critique d'UX — seule l'analyse de contexte permet de distinguer les deux.
- L'analyse correcte catégorise les observations par : tâche, type de problème (orientation, compréhension sémantique, erreur de manipulation, charge cognitive), gravité (bloquant, irritant, mineur), fréquence (1 participant vs 5).

**5. Sessions back-to-back toute la journée ❌**
- Le modérateur s'épuise et perd en qualité d'observation. Son attention baisse après 3-4 sessions consécutives.
- Prévoir au maximum 4-5 sessions par jour avec des pauses de 15-20 minutes pour noter les observations à chaud.

**KPIs faussés**

| Problème de protocole | KPI faussé |
|---|---|
| Recrutement réseau personnel | Task success rate (sur-estimé) |
| Scénario vague | Temps de complétion (non représentatif du cas réel) |
| Aide modérateur | Taux d'erreur (sous-estimé), friction points non détectés |
| Analyse binaire | Priorisation des corrections (mauvaise allocation des ressources dev) |

**Erreurs classiques**

- Recruter vite par réseau pour "gagner du temps" — le temps gagné est perdu en re-travail post-lancement.
- Croire que "on note tout" est une méthode d'analyse.
- Sous-estimer la fatigue du modérateur sur des sessions longues.

**Correction du biais cognitif**

Biais de confirmation : en recrutant des proches et en aidant les participants bloqués, l'équipe se donne involontairement raison — le test devient une validation circulaire plutôt qu'un vrai test.

**Améliorations possibles**

Introduire un "observateur silencieux" (un second membre de l'équipe qui prend des notes comportementales pendant que le modérateur gère la relation avec le participant) — deux paires d'yeux voient deux fois plus.

**Changement de paradigme**

La valeur d'un test utilisateur est directement proportionnelle à la rigueur de son protocole — un mauvais protocole est pire que pas de test du tout, car il génère une fausse confiance.

---

#### Correction — Exercice 3 : Mini-cas réel

**Modèle mental attendu**

Un algorithme entraîné sur 8 % de données de revenus irréguliers ne peut pas produire des recommandations pertinentes pour les 23 % d'utilisateurs aux revenus similaires. Le biais de données se traduit directement en biais d'expérience. Pour des personnes en fragilité financière, un conseil budgétaire erroné n'est pas une gêne — c'est un risque de surendettement aggravé. Tester avec ces utilisateurs n'est pas une option éthique, c'est une obligation.

**Raisonnement UX/Product**

Le test doit couvrir au minimum deux segments radicalement différents :

- **Segment A — Revenus stables et réguliers** : salarié CDI, revenus mensuels constants. C'est le segment pour lequel l'algorithme a été optimisé.
- **Segment B — Revenus variables ou irréguliers** : auto-entrepreneur, intérimaire, bénéficiaire RSA, employé à temps partiel. C'est le segment à risque d'erreur algorithmique.

**Protocole de test complet**

**Recrutement**

- Nombre : 10 participants minimum — 5 par segment.
- Critères Segment A : CDI, revenus nets > 1 800 €/mois stables, utilisateurs actifs de l'application depuis > 3 mois.
- Critères Segment B : revenus irréguliers ou < 1 200 €/mois, au moins un incident de paiement ou découvert dans les 6 derniers mois, OU bénéficiaires d'aides sociales (RSA, AAH, APL).
- Recrutement Segment B : partenariats avec associations de micro-crédit, CCAS (Centres Communaux d'Action Sociale), plateformes de travailleurs indépendants précaires. Ne jamais recruter via panel en ligne standard — la population fragile y est sous-représentée.
- Consentement renforcé : expliquer clairement l'objectif, garantir l'anonymat des données financières partagées pendant le test, proposer une compensation financière juste (ne pas exploiter la précarité).

**Scénarios think-aloud**

Scénario 1 : "L'application vous propose d'allouer 350 € au poste 'alimentation' ce mois-ci. Dites à voix haute ce que vous pensez en voyant cette recommandation."

Scénario 2 : "Vous venez de recevoir une dépense imprévue de 180 € (réparation voiture). Comment utilisez-vous l'application pour réajuster votre budget ?"

Scénario 3 : "Ce mois-ci, vos revenus ont été inférieurs de 300 € à la normale. L'application vous a envoyé une alerte. Que faites-vous ?"

**Consignes modérateur**

- Protocole think-aloud strict : "Dites à voix haute tout ce que vous pensez en regardant l'écran, même si ça vous semble sans importance."
- Ne jamais commenter une décision financière personnelle du participant pendant le test.
- En cas d'émotion visible (stress, anxiété face aux données budgétaires), faire une pause et rappeler que le test peut être arrêté à tout moment sans justification.
- Débriefing obligatoire après chaque session : "Comment vous êtes-vous senti(e) pendant le test ?"

**Durée et environnement**

- 45 à 60 minutes par session.
- Maximum 4 sessions par jour pour le modérateur.
- À distance si possible pour le Segment B (réduire les contraintes de déplacement).
- Outil de prototype : Maze ou UserZoom pour capturer les clics et les temps de complétion.

**Analyse des résultats**

Méthode de priorisation : Rainbow Spreadsheet adapté.

Pour chaque observation, noter : participant, tâche, type d'observation (confusion sémantique / erreur de manipulation / incompréhension de la recommandation algorithmique / réaction émotionnelle négative), gravité (bloquant = empêche la tâche / irritant = ralentit mais ne bloque pas / cosmétique), fréquence sur 10 participants.

**Seuils de blocage du lancement :**

- Si > 3 participants du Segment B ne comprennent pas l'origine de la recommandation budgétaire → blocage : l'opacité algorithmique est un risque de manipulation non consentie.
- Si > 2 participants du Segment B interprètent une recommandation comme prescriptive (obligation) plutôt qu'indicative → blocage : le risque de décision financière erronée basée sur une mauvaise compréhension est trop élevé.
- Si l'algorithme génère des recommandations manifestement inadaptées pour 100 % des cas Segment B (enveloppes supérieures aux revenus réels, par exemple) → blocage immédiat.

**KPIs à 30 / 60 / 90 jours**

| Délai | KPI UX | KPI Business |
|---|---|---|
| J+30 | Taux d'activation de la fonctionnalité par segment (Segment A vs B) | Taux de rétention différentiel par segment |
| J+30 | Compréhension des recommandations (sondage in-app, score 1-5) | NPS segmenté A vs B |
| J+60 | Taux de modification manuelle des enveloppes proposées (signal d'inadéquation) | Taux d'incidents de paiement post-activation (indicateur de décision erronée) |
| J+60 | Taux d'abandon de la fonctionnalité à J+60 | Tickets support "je ne comprends pas ma recommandation" |
| J+90 | Score SUS de la fonctionnalité par segment | Impact sur le solde moyen des comptes Segment B (indicateur de bien-être financier) |

**Erreurs classiques**

- Tester uniquement le "happy path" (revenus stables, pas d'imprévus) et valider un produit qui échoue pour 23 % de sa base.
- Négliger la dimension émotionnelle : parler d'argent en situation de fragilité génère du stress qui biaise les comportements si le modérateur n'est pas formé à ce type d'entretien.
- Traiter tous les utilisateurs comme un segment unique malgré une hétérogénéité de revenus documentée.

**Correction du biais cognitif**

Biais d'homogénéité de l'outgroup : l'équipe produit (revenus stables, maîtrise numérique) a tendance à sous-estimer la diversité des utilisateurs qui ne lui ressemblent pas. "Nos utilisateurs fragiles utilisent les mêmes fonctionnalités que les autres" est une hypothèse non validée et potentiellement dangereuse.

**Améliorations possibles**

Mettre en place un panel permanent de 10 à 15 utilisateurs représentatifs du Segment B, rémunérés pour participer à des tests réguliers. Cela permet de tester toutes les nouvelles fonctionnalités avec ce segment critique sans devoir recruter à chaque sprint.

**Changement de paradigme**

Un test utilisateur n'est éthique que si les utilisateurs les plus vulnérables au produit sont systématiquement représentés dans l'échantillon de test.

---

## Concept 2 — A/B Testing

> Conditions de validité, interprétation des résultats, erreurs classiques

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

L'équipe produit d'une application de fitness lance un A/B test sur le bouton d'inscription à leur offre premium. Variante A : bouton blanc "Essayer Premium" (texte neutre). Variante B : bouton rouge "Je veux mes résultats maintenant !" (texte urgence + couleur alerte). Après 72 heures et 340 visites au total, le bouton B affiche +18 % de clics. La Product Manager arrête le test et déploie la variante B.

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Y a-t-il des raisons de remettre en question cette décision ? Quelles questions poserais-tu avant de valider le déploiement de la variante B ?

---

#### Exercice 2 — Piège de paradigme

Une équipe e-commerce réalise un A/B test sur sa page produit. Voici leurs conclusions partagées lors du weekly :

*"Le test A/B qu'on a lancé il y a 3 semaines est concluant. La variante avec la photo lifestyle dépasse la variante avec la photo produit seul : +22 % de taux de clic sur 'Ajouter au panier', p-value à 0,04, donc c'est significatif. On déploie à 100 % dès demain. Par ailleurs, on a aussi testé en même temps le changement de couleur du bandeau de livraison et le nouveau wording de la description — les 3 tests tournaient simultanément sur la même audience. Les résultats sont propres."*

**Question :** Qu'est-ce qui ne va pas dans cette analyse et ce processus de décision ? Quels KPIs business seraient affectés par cette erreur de méthode ? Identifie les erreurs classiques d'A/B testing présentes dans cet extrait.

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es Product Manager d'une plateforme de mise en relation entre freelances et entreprises. La conversion de visiteurs en inscrits plafonne à 3,2 % depuis 6 mois. L'équipe propose de tester deux versions d'une nouvelle page d'accueil :

- **Variante A (actuelle)** : liste de missions disponibles visible sans inscription, formulaire d'inscription en bas de page.
- **Variante B** : bénéfices de la plateforme mis en avant (témoignages, chiffres), formulaire d'inscription visible dès le haut de page, liste de missions masquée derrière un "Voir les missions" qui nécessite de s'inscrire.

**Dimension éthique et inclusive :** La Variante B cache le contenu derrière une inscription obligatoire. L'équipe marketing argumente que "tout le monde fait ça". Des membres de la communauté freelance ont exprimé dans des forums leur frustration face aux plateformes qui ne montrent pas les missions sans inscription.

**Questions :**

1. Décris ton modèle mental AVANT de lancer l'A/B test : quelles hypothèses formules-tu sur les effets attendus de chaque variante sur le comportement des visiteurs ?

2. Définis les conditions de validité de cet A/B test : durée minimale, taille d'échantillon, KPI primaire et KPIs secondaires à surveiller, conditions d'arrêt.

3. La variante B génère +31 % d'inscriptions mais le taux d'activation (premier projet accepté) chute de 41 % à 28 % à J+14. Comment interprètes-tu ces résultats ? Quelle décision prends-tu, et pourquoi ?

4. La variante B présente-t-elle un dark pattern ? ❌ Explique ton raisonnement et les implications éthiques et réputationnelles.

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Un A/B test est un dispositif statistique. Sa validité repose sur trois piliers : la taille de l'échantillon (suffisamment grand pour que les résultats ne soient pas dus au hasard), la durée (suffisamment longue pour capturer les variations naturelles du comportement), et l'isolation des variables (une seule variable testée à la fois). Ici, les trois piliers sont fragilisés.

**Raisonnement UX/Product**

Problème 1 — Taille d'échantillon insuffisante : 340 visites réparties en deux variantes = ~170 par variante. Pour détecter une différence de +18 % avec une puissance statistique acceptable (80 %) et un seuil de signification de 5 %, il faut généralement plusieurs milliers de visites selon la valeur initiale du taux et la taille d'effet attendue. Sans calculer la taille d'échantillon requise en amont, l'équipe ne sait pas si 340 visites sont suffisantes.

Problème 2 — Durée insuffisante (72 heures) : 3 jours ne couvrent pas un cycle complet de comportement utilisateur. Le comportement varie selon le jour de la semaine (les comportements du vendredi soir diffèrent de ceux du lundi matin), les campagnes marketing en cours, ou des événements saisonniers. Un test valide dure au minimum un cycle complet — typiquement 2 à 4 semaines pour un produit grand public.

Problème 3 — La métrique suivie est le clic, pas la conversion finale. +18 % de clics sur "Essayer Premium" ne signifie pas +18 % d'abonnements. La variante B (texte d'urgence + rouge) peut générer des clics impulsifs qui n'aboutissent pas à des souscriptions. Il faut suivre le taux de conversion complet du tunnel.

Problème 4 — Dimension éthique à évaluer : le texte "Je veux mes résultats maintenant !" exploite-t-il un biais d'urgence artificielle ? Si les "résultats" promis ne sont pas clairement définis et réalisables, ce wording frôle le dark pattern de fausse urgence ❌.

**KPIs impactés**

| KPI négligé | Risque si ignoré |
|---|---|
| Taux de conversion tunnel complet (pas juste le clic) | Décision basée sur une métrique vanité |
| Taux de rétention à 30 jours des abonnés issus de B | Churn élevé si les promesses du wording ne sont pas tenues |
| Taux de remboursement / annulation premium | Indicateur de frustration post-conversion |

**Erreurs classiques**

- Arrêter un test trop tôt dès qu'une tendance positive apparaît (Peeking Problem).
- Confondre taux de clic et taux de conversion.
- Ne pas calculer la taille d'échantillon requise avant de lancer le test.
- Ne pas vérifier la significativité statistique (aucune p-value mentionnée ici).

**Correction du biais cognitif**

Biais de confirmation + biais d'arrêt précoce (Peeking) : l'équipe a vu un résultat positif et a arrêté le test avant qu'il soit statistiquement concluant. La variation observée à 72 heures peut régresser vers la moyenne à 3 semaines.

**Améliorations possibles**

Utiliser un calculateur de taille d'échantillon (Evan Miller's A/B Calculator ou Optimizely's Sample Size Calculator) avant de lancer. Définir à l'avance la durée minimale du test et le KPI primaire — et ne pas y déroger, même si les résultats semblent prometteurs.

**Changement de paradigme**

Un A/B test décidé avant d'être statistiquement valide n'est pas un test — c'est un biais de confirmation habillé en science.

---

#### Correction — Exercice 2 : Piège de paradigme

**Modèle mental attendu**

Un A/B test valide isole une variable dans un contexte contrôlé. Dès que plusieurs variables changent simultanément, ou que plusieurs tests tournent sur la même audience, la relation de causalité entre le changement et le résultat est rompue. L'équipe confond corrélation et causalité.

**Raisonnement UX/Product**

Erreur 1 — Tests simultanés sur la même audience (contamination de l'échantillon) ❌

Trois tests tournant en même temps sur la même audience créent des interactions entre les variantes. Un visiteur peut voir la photo lifestyle ET le nouveau bandeau de livraison ET le nouveau wording. L'effet observé sur le taux de clic n'est pas attribuable à la photo seule — il est le produit d'une combinaison inconnue de changements. Les résultats sont statistiquement non interprétables.

La bonne pratique : un seul test à la fois sur la même page / même segment d'audience. Si l'on veut tester plusieurs éléments, utiliser un test multivarié (MVT) correctement configuré.

Erreur 2 — p-value mal interprétée

p = 0,04 signifie qu'il y a 4 % de probabilité d'observer un résultat aussi extrême si la variante B n'avait aucun effet réel. Ce n'est pas "concluant" de façon absolue — c'est en dessous du seuil conventionnel de 0,05, donc le résultat est dit "statistiquement significatif" dans ce cadre. Mais la significativité statistique ne garantit pas la signification pratique (effect size) ni la reproductibilité du résultat. Un p=0,04 sur un test avec contamination est sans valeur.

Erreur 3 — KPI unique (taux de clic "Ajouter au panier") sans suivi du tunnel complet

+22 % de clics sur "Ajouter au panier" est une métrique intermédiaire (proxy metric). La métrique qui compte est le taux de conversion final (achat complété) et la valeur du panier moyen. Une photo lifestyle peut attirer des clics d'exploration sans finalisation.

**KPIs business affectés**

| Erreur | KPI impacté | Direction du risque |
|---|---|---|
| Tests simultanés | Toutes les métriques de conversion | Données non fiables → mauvaise décision → perte de revenu |
| Déploiement prématuré | Taux de conversion réel post-déploiement | Possible régression si l'effet n'était pas réel |
| KPI partiel (clic sans fin de tunnel) | Chiffre d'affaires, panier moyen | Sur-estimation de l'impact |

**Erreurs classiques**

- Faire tourner des tests simultanés sans isolation des segments (A/B test pool contamination).
- Arrêter et déployer immédiatement sans phase de monitoring post-déploiement.
- Interpréter une p-value sans considérer la taille de l'effet (effect size) et la puissance du test.
- Confondre "statistiquement significatif" avec "important en pratique".

**Correction du biais cognitif**

Illusion de contrôle : l'équipe pense maîtriser l'expérimentation parce qu'elle utilise les bons termes (A/B test, p-value) sans en appliquer correctement les principes. La forme sans le fond est plus dangereuse que l'absence de test.

**Améliorations possibles**

Mettre en place une roadmap de tests séquentiels avec une règle simple : un seul test actif par zone de l'interface à la fois. Utiliser un outil d'A/B testing avec garde-fous intégrés (Optimizely, VWO, AB Tasty) qui alertent sur les conflits entre tests.

**Changement de paradigme**

Un A/B test n'est valide que si ses conditions d'isolation sont respectées — un test contaminé est statistiquement inutilisable, peu importe la p-value affichée.

---

#### Correction — Exercice 3 : Mini-cas réel

**Modèle mental attendu**

L'A/B test mesure un comportement dans un contexte précis. La métrique d'inscription est une métrique intermédiaire (leading indicator) — ce qui compte en réalité, c'est l'activation (un freelance qui trouve et accepte sa première mission). Un test peut améliorer une métrique intermédiaire tout en dégradant la métrique finale qui génère de la valeur. Le choix du KPI primaire est une décision stratégique, pas technique.

**Raisonnement UX/Product**

**1. Modèle mental avant le test**

Hypothèses Variante A (actuelle) :
- Montrer les missions sans inscription = signal de confiance et de valeur immédiate. Le visiteur voit "ce pour quoi il est venu" avant de donner ses données.
- Les inscrits viennent parce qu'ils ont vu des missions qui les intéressent → motivation intrinsèque → meilleure activation.
- Risque : faible taux d'inscription car "je peux voir sans m'inscrire, donc je remets à plus tard".

Hypothèses Variante B :
- Masquer le contenu = friction délibérée qui force l'inscription.
- Peut générer plus d'inscriptions par effet d'obligation, mais les inscrits n'ont pas encore vu de valeur concrète.
- Risque : inscriptions "à l'aveugle" — l'utilisateur s'inscrit sans être certain que la plateforme lui correspond → fort taux de churn précoce.

**2. Conditions de validité du test**

- **Durée minimale** : 3 semaines (couvrir au minimum un cycle complet de comportement + éviter les biais du jour de semaine).
- **Taille d'échantillon** : calculer en amont avec un calculateur (objectif : détecter une différence de +15 % sur le taux d'inscription avec 80 % de puissance et p < 0,05). Avec un taux de base de 3,2 %, il faut généralement 3 000 à 5 000 visites par variante.
- **KPI primaire** : taux d'activation à J+14 (premier projet accepté) — pas le taux d'inscription.
- **KPIs secondaires** : taux d'inscription, taux de complétion du profil, NPS à J+7, taux de rétention à J+30.
- **Conditions d'arrêt anticipé** : arrêter si le taux de plaintes ("je ne comprends pas pourquoi je dois m'inscrire pour voir les missions") dépasse un seuil prédéfini. Ne pas arrêter prématurément pour des résultats positifs sur les métriques secondaires.

**3. Interprétation des résultats (B : +31 % inscriptions mais activation J+14 : 41 % → 28 %)**

La variante B génère plus d'inscriptions mais de moindre qualité. Les chiffres racontent une histoire claire :

- La friction d'inscription forcée attire des visiteurs curieux mais non qualifiés, qui s'inscrivent sans motivation forte, explorent brièvement, et quittent la plateforme sans jamais accepter de mission.
- L'activation chute de -32 % en valeur relative (de 41 % à 28 %). Sur 1 000 inscrits : Variante A produit 410 freelances activés, Variante B produit 370 (1 310 inscrits × 28 %) — un gain en volume qui se retourne en perte nette en activation absolue.
- Si le modèle économique de la plateforme repose sur des commissions de mise en relation, la variante B est économiquement inférieure à la variante A malgré l'apparence flatteuse du +31 %.

**Décision** : ne pas déployer la variante B. Retenir la variante A comme base et lancer un nouveau test axé sur l'amélioration du taux de conversion de visiteurs qualifiés (qui voient les missions et ne s'inscrivent pas).

**4. Dark pattern de la Variante B ❌**

Oui, la variante B est un dark pattern de type "Roach Motel" / "Forced Registration" ❌.

- **Mécanisme** : masquer le contenu promis (les missions, raison d'être de la visite) derrière une inscription obligatoire. L'utilisateur vient pour voir des missions — il doit donner ses données avant de savoir si la plateforme lui est utile.
- **Pourquoi c'est un dark pattern** : la friction est intentionnelle et asymétrique. L'utilisateur est contraint de donner quelque chose (ses données personnelles, son temps pour remplir un formulaire) sans avoir reçu de valeur en échange, contrairement à la promesse implicite du "Voir les missions".
- **Implications éthiques** : collecte de données de personnes qui n'auraient pas consenti si elles avaient su que le contenu n'était pas adapté à leurs besoins. Ces inscriptions "aveugles" noient la base de données de contacts non qualifiés.
- **Implications réputationnelles** : le retour négatif observé dans les forums ("les plateformes qui cachent leurs missions derrière une inscription") est un signal faible de réputation qui peut se transformer en signal fort (articles négatifs, bouche-à-oreille défavorable dans les communautés freelance).
- **Alternative éthique** : montrer un aperçu partiel des missions (3 missions en preview, le reste masqué) avec une invitation claire à s'inscrire pour voir toutes les offres — la valeur est démontrée avant la demande de données.

**Erreurs classiques**

- Choisir le taux d'inscription comme KPI primaire d'un test sur une plateforme de mise en relation (c'est une métrique vanité si l'activation ne suit pas).
- Confondre "ce que font nos concurrents" (forced registration) avec "ce qui fonctionne pour nos utilisateurs".
- Ignorer les signaux qualitatifs (forums, avis) qui précèdent les métriques quantitatives.

**Correction du biais cognitif**

Biais de court terme (hyperbolic discounting) : l'équipe marketing préfère un gain immédiat visible (+31 % d'inscriptions) à un gain plus faible mais plus durable (activation de qualité). Les métriques de vanité (inscriptions) amplifient ce biais car elles sont plus visibles que les métriques de valeur (activation, rétention).

**Améliorations possibles**

Mettre en place un "North Star Metric" formalisé pour l'équipe : le nombre de freelances ayant accepté leur première mission dans le mois. Toutes les décisions d'A/B testing sont évaluées par rapport à cet indicateur, pas par rapport aux métriques intermédiaires.

**Changement de paradigme**

Optimiser une métrique intermédiaire sans vérifier la métrique finale, c'est prendre le risque de s'améliorer dans la mauvaise direction.

---

## Concept 3 — Analytics & Heatmaps

> Lecture d'un funnel, rage clicks, optimisation continue

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Le Head of Product d'une application de réservation de cours de sport te présente un rapport analytics de la semaine. Il te montre deux métriques : "Notre page d'accueil a un taux de rebond de 68 % — c'est catastrophique" et "Notre page 'Recherche de cours' a un temps moyen de session de 4 minutes 32 secondes — les gens adorent cette page."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Ces deux interprétations sont-elles nécessairement correctes ? Quelle lecture alternative ferais-tu de ces chiffres avant de tirer des conclusions ?

---

#### Exercice 2 — Piège de paradigme

L'équipe d'une plateforme de e-learning a accès à ses données Hotjar. Voici l'analyse présentée par l'analyste produit junior lors du sprint review :

---

*Analyse Hotjar — Page de cours "Introduction au Python"*

- **Heatmap de clics** : zone de clics intense sur l'image de couverture du cours — "les utilisateurs adorent notre visuel, il faut en faire plus comme ça."
- **Rage clicks** : 34 rage clicks détectés sur le bouton "Commencer le cours" — "c'est bon signe, les gens sont impatients de démarrer."
- **Scroll map** : 78 % des utilisateurs ne scrollent pas en dessous du premier écran — "notre contenu au-dessus de la ligne de flottaison est excellent, pas besoin de retravailler le bas de page."

**Question :** Qu'est-ce qui ne va pas dans cette analyse ? Propose une interprétation alternative pour chacune des trois observations. Quels KPIs seraient affectés par une décision prise sur la base de ces interprétations erronées ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es Product Analyst dans une startup proposant une application de téléconsultation médicale. L'application permet aux patients de consulter un médecin en moins de 10 minutes via chat ou vidéo. Le funnel de conversion principal est le suivant :

| Étape | Taux de passage |
|---|---|
| Page d'accueil → Sélection du motif | 71 % |
| Sélection du motif → Sélection du médecin | 58 % |
| Sélection du médecin → Formulaire patient | 44 % |
| Formulaire patient → Confirmation de paiement | 29 % |
| Confirmation de paiement → Consultation démarrée | 91 % |

Hotjar révèle : 112 rage clicks sur le champ "Numéro de sécurité sociale" du formulaire patient. L'équipe tech signale que le formulaire n'est pas optimisé mobile (champ de saisie qui se ferme aléatoirement sur iOS). La session replay montre que 63 % des abandons sur le formulaire se produisent sur des appareils iOS, entre 18h et 21h.

**Dimension éthique et inclusive :** Une partie des utilisateurs sont des personnes âgées (65+) ou des personnes en situation de handicap qui utilisent la téléconsultation car elles ne peuvent pas se déplacer. Pour elles, l'abandon du formulaire signifie potentiellement ne pas avoir accès aux soins ce jour-là.

**Questions :**

1. Décris ton modèle mental AVANT d'analyser : comment lis-tu un funnel de conversion ? Qu'est-ce qui te frappe en premier dans ces données ?

2. Priorise les problèmes identifiés (rage clicks, bug iOS, abandon formulaire) en utilisant une matrice effort/impact. Définis l'effort et l'impact de chaque correction.

3. Construis un plan d'optimisation continue sur 8 semaines : quelles actions, dans quel ordre, avec quels indicateurs de succès ?

4. Comment mesureras-tu l'impact spécifique sur les utilisateurs âgés et en situation de handicap ? Quels KPIs supplémentaires mets-tu en place ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Les métriques analytics sont des données brutes. Elles décrivent un comportement mais n'en expliquent pas la cause. Avant de conclure qu'un taux de rebond est "catastrophique" ou qu'un temps de session est un signe d'"amour" de la page, il faut comprendre le contexte de chaque métrique et la comparer à une baseline pertinente.

**Raisonnement UX/Product**

**Taux de rebond de 68 % sur la page d'accueil — vraiment catastrophique ?**

Un taux de rebond signifie qu'un visiteur est arrivé sur la page et n'a pas cliqué vers une autre page du site. Mais :

- Si la page d'accueil contient un moteur de recherche de cours (avec résultats chargés dynamiquement sans changement d'URL), un utilisateur qui cherche et trouve ne génère pas de navigation — Google Analytics l'enregistre comme rebond même s'il a interagi.
- Si une campagne SEA (Google Ads) dirige des utilisateurs vers une landing page spécifique à un cours, ceux qui lisent la page et appellent directement (click-to-call) sont enregistrés comme des rebonds — mais ils ont converti.
- La question à poser : quel est le taux de rebond moyen du secteur pour ce type d'application ? (Les applications de fitness et bien-être ont souvent des taux de rebond entre 55 % et 75 % sur mobile, ce qui est normal.)

**Temps moyen de session de 4:32 sur la page Recherche — vraiment positif ?**

Un temps long peut signifier :
- Engagement réel : l'utilisateur explore, compare des cours, lit les descriptions → signal positif.
- Frustration et friction : l'utilisateur ne trouve pas ce qu'il cherche, relance des recherches, change de filtres sans succès → signal négatif.
- Sans regarder le taux de conversion après cette page (passage de "Recherche" à "Réservation"), le temps de session seul est une métrique aveugle.

**KPIs à croiser pour comprendre**

| Métrique brute | Métrique à croiser | Interprétation correcte |
|---|---|---|
| Taux de rebond 68 % | Taux de conversion page d'accueil → inscription / réservation | Si conversion élevée malgré le rebond, le rebond n'est pas problématique |
| Temps session 4:32 | Taux de passage vers la réservation depuis la recherche | Si temps long + faible conversion = friction. Si temps long + bonne conversion = exploration normale |

**Erreurs classiques**

- Interpréter une métrique en isolation sans sa métrique complémentaire.
- Appliquer des benchmarks génériques sans vérifier leur pertinence pour le secteur et le contexte.
- Confondre "temps long = engagement positif" (cela peut être l'inverse).

**Correction du biais cognitif**

Biais de disponibilité : les métriques les plus visibles (taux de rebond, temps de session) sont les premières interprétées — même si elles ne sont pas les plus pertinentes. Le vrai signal est dans la corrélation entre métriques.

**Améliorations possibles**

Configurer des "Objectifs" (Goals) dans Google Analytics ou Amplitude avec des événements spécifiques (clic sur "Réserver", début du checkout) pour mesurer le taux de conversion réel plutôt que le comportement de navigation brut.

**Changement de paradigme**

Une métrique sans contexte est une donnée sans signification — interpréter les analytics, c'est construire un raisonnement, pas lire des chiffres.

---

#### Correction — Exercice 2 : Piège de paradigme

**Modèle mental attendu**

Les outils de heatmapping et de session replay enregistrent des comportements. L'interprétation de ces comportements requiert un raisonnement causal : pourquoi l'utilisateur fait-il cela ? La donnée brute ne répond pas à cette question — c'est au Product Analyst de formuler des hypothèses et de les valider.

**Raisonnement UX/Product**

**1. Clics intenses sur l'image de couverture — "ils adorent le visuel" ❌**

Interprétation alternative : les utilisateurs cliquent sur l'image parce qu'ils croient qu'elle est cliquable (lien vers le cours, lecture d'une vidéo de présentation). Si l'image n'est pas interactive et que les clics ne déclenchent rien, c'est un problème d'affordance — l'image signale une interactivité qu'elle n'a pas.

Comment vérifier : croiser avec les session replays. Si les utilisateurs cliquent plusieurs fois sur l'image (signe de frustration) sans résultat, l'hypothèse "ils adorent le visuel" est fausse.

**2. Rage clicks sur "Commencer le cours" — "ils sont impatients" ❌ C'est exactement l'inverse.**

Les rage clicks sont définis par Hotjar comme plusieurs clics rapides et répétés au même endroit sur une interface. C'est un signal universel de frustration : l'utilisateur clique frénétiquement parce que le bouton ne répond pas, charge trop lentement, ou que le clic ne déclenche pas l'action attendue.

34 rage clicks sur "Commencer le cours" = 34 instances de frustration documentées. Ce bouton a probablement un problème de performance (latence de chargement), d'état désactivé non visible (bouton visuellement actif mais fonctionnellement inactif), ou un bug JavaScript.

**KPI impacté** : taux d'abandon avant le premier contenu, taux de complétion des cours (si les utilisateurs frustrés au démarrage abandonnent).

**3. Scroll map : 78 % ne défilent pas au-delà du premier écran — "le contenu au-dessus est excellent" ❌**

Interprétation alternative : si 78 % des utilisateurs ne voient jamais le contenu sous la ligne de flottaison, les informations critiques placées en bas de page (prérequis, contenu du cours, avis, durée) sont invisibles pour la majorité. Cela peut être une cause d'abandon ou de mauvaise qualification (l'utilisateur commence un cours pour lequel il n'a pas le niveau).

La non-lecture du bas de page n'indique pas que le haut est "excellent" — cela peut indiquer que l'utilisateur a trouvé ce qu'il cherchait (bouton pour commencer) ou qu'il a abandonné avant de scroller.

**KPIs impactés**

| Mauvaise interprétation | KPI faussé | Conséquence de la décision erronée |
|---|---|---|
| Image = succès visuel | Taux de clic réel (affordance) | Multiplier des images non cliquables, augmenter la frustration |
| Rage clicks = impatience positive | Taux d'abandon au démarrage | Ne pas corriger le bug → perte de learners |
| Scroll faible = contenu haut = excellent | Taux de complétion, qualification entrante | Informations critiques restent cachées, mauvaise adéquation cours/étudiant |

**Erreurs classiques**

- Interpréter les heatmaps sans hypothèse préalable sur le comportement attendu.
- Ignorer la définition technique des signaux (rage clicks = frustration, pas impatience positive).
- Tirer des conclusions positives de comportements qui peuvent être neutres ou négatifs.

**Correction du biais cognitif**

Biais de confirmation : l'analyste junior cherche inconsciemment des confirmations que le produit fonctionne bien, et réinterprète des signaux négatifs (rage clicks, mauvaise affordance) en signaux positifs.

**Améliorations possibles**

Avant d'analyser les heatmaps, documenter les comportements attendus par zone de l'interface : "sur cette page, un utilisateur satisfait devrait cliquer une fois sur 'Commencer le cours' et ne pas recliquer sur l'image." Tout écart par rapport à ce modèle est un signal d'investigation, pas de validation.

**Changement de paradigme**

Un rage click n'est jamais un signe d'enthousiasme — c'est la main de l'utilisateur en train de crier à l'aide.

---

#### Correction — Exercice 3 : Mini-cas réel

**Modèle mental attendu**

Un funnel de conversion est une série d'étapes où chaque abandon représente un utilisateur qui n'a pas accompli son objectif. Dans le cas d'une application de santé, l'abandon n'est pas une perte commerciale abstraite — c'est une personne qui n'a potentiellement pas eu accès aux soins. La lecture du funnel doit combiner l'analyse quantitative (où perd-on le plus d'utilisateurs) et l'analyse qualitative (pourquoi).

**Raisonnement UX/Product**

**1. Lecture du funnel**

L'étape critique est le passage "Formulaire patient → Confirmation de paiement" : seulement 29 % passent cette étape. C'est de loin la plus grande chute du funnel. Les données complémentaires (rage clicks sur le numéro de sécu, bug iOS, heures d'abandon) dessinent un tableau cohérent :

- Le bug iOS est probable cause principale de l'abandon sur ce segment (63 % des abandons sur iOS = signal fort).
- Les heures 18h-21h correspondent à l'heure de pointe mobile (retour à la maison, consultation depuis le canapé). L'audience iOS en soirée est très large.
- Les rage clicks sur le champ "Numéro de sécurité sociale" signalent un problème d'interaction : fermeture du clavier, format de saisie non guidé, champ non masqué/sécurisé visuellement alors qu'il contient des données sensibles.

**Taux de complétion réel** : sur 1 000 personnes sur la page d'accueil, seulement 71 × 58 × 44 × 29 × 91 % ≈ **7,6 personnes** démarrent réellement une consultation. Le potentiel d'amélioration est massif.

**2. Matrice effort/impact**

| Problème | Impact | Effort | Priorité |
|---|---|---|---|
| Bug iOS fermeture clavier sur champ numéro sécu | Très élevé (63 % des abandons formulaire) | Moyen (correction technique ciblée) | P0 — correction immédiate |
| Rage clicks sur champ "Numéro de sécu" (format, guidance, sécurité visuelle) | Élevé (UX du formulaire) | Faible (micro-UX, masquage, placeholder guidant) | P1 — sprint suivant |
| Taux de passage "Sélection médecin → Formulaire" (44 %) | Élevé (potentiel d'amélioration) | Moyen (revoir la page de sélection, rassurer sur la suite) | P2 — sprint 2 |
| Taux de passage "Motif → Médecin" (58 %) | Moyen | Élevé (repenser le matching) | P3 — version suivante |

**3. Plan d'optimisation sur 8 semaines**

**Semaines 1-2 — Correction technique P0**

- Correction du bug iOS (fermeture du clavier sur le formulaire).
- Indicateur de succès : taux d'abandon sur le formulaire iOS passe sous la parité avec Android (objectif : -30 % d'abandon iOS).
- Déployé en urgence, pas en A/B test (c'est un bug, pas une expérimentation).

**Semaines 3-4 — Optimisation UX formulaire (P1)**

- Reformater le champ numéro de sécu (auto-format avec espaces, masquage des chiffres saisis, icône "sécurisé", placeholder "1 85 04 75 021 095 52").
- Supprimer les champs non nécessaires à l'étape de paiement (demander uniquement ce qui est indispensable pour cette étape).
- Test utilisateur rapide (5 personnes) sur le prototype du nouveau formulaire avant déploiement.
- Indicateur de succès : rage clicks sur le champ numéro sécu < 5 (vs 112 actuellement). Taux de passage formulaire → paiement > 40 % (vs 29 %).

**Semaines 5-6 — Optimisation page sélection médecin (P2)**

- Analyser avec les replays de session ce qui bloque entre la sélection du médecin et le formulaire.
- Hypothèse : les utilisateurs hésitent (manque d'information sur le médecin, manque de confiance, prix non visible avant le formulaire).
- Test A/B : afficher le prix et la disponibilité dès la card médecin vs uniquement au formulaire.
- Indicateur de succès : taux de passage "Sélection médecin → Formulaire" > 55 % (vs 44 %).

**Semaines 7-8 — Mesure consolidée et rapport**

- Comparer le funnel complet avant/après corrections.
- Calculer l'impact en consultations supplémentaires démarrées par jour.
- Préparer les hypothèses pour les optimisations P3 (matching motif/médecin).

**4. KPIs pour les utilisateurs âgés et en situation de handicap**

| KPI spécifique | Méthode de mesure | Cible |
|---|---|---|
| Taux d'abandon formulaire des 65+ | Segmentation par cohorte d'âge (si renseigné au profil) ou par comportement (temps de saisie long = signal indirec) | Réduire l'écart avec la moyenne générale |
| Taux d'erreur de saisie sur le formulaire | Events trackés sur les champs (corrections multiples, effacement) | < 2 erreurs moyennes par champ sur les 65+ |
| Temps de complétion du formulaire par segment | Amplitude / Mixpanel avec segmentation comportementale | 65+ : tolérer un temps 2x plus long, ne pas imposer de timeout |
| Taux de succès first-time (formulaire rempli sans abandon ni erreur bloquante) | Funnel segmenté | > 70 % pour les utilisateurs 65+ |
| NPS post-consultation pour les 65+ | Enquête in-app à J+1, question ouverte sur les difficultés rencontrées | Score NPS 65+ ≥ score NPS moyen |

**Dimension éthique**

Pour les personnes âgées ou en situation de handicap qui dépendent de la téléconsultation pour accéder aux soins, l'abandon du formulaire n'est pas un simple churn — c'est une barrière d'accès aux soins. L'équipe produit a une responsabilité éthique à monitorer spécifiquement ce segment et à prioriser les corrections qui l'impactent, même si la part de ces utilisateurs dans le total des sessions est faible. L'accessibilité n'est pas optionnelle dans un produit de santé.

**Erreurs classiques**

- Traiter l'optimisation du funnel comme un exercice purement mathématique (améliorer la moyenne) sans regarder les segments les plus vulnérables.
- Corriger un bug uniquement quand il affecte la majorité des utilisateurs — un bug qui bloque 63 % des iOS en soirée mérite une correction urgente même si les iOS ne représentent que 40 % de la base.
- Ignorer les rage clicks comme signal d'alerte sous prétexte que "le taux de conversion global n'est pas si mauvais".

**Correction du biais cognitif**

Biais de la moyenne : l'équipe optimise le funnel global sans voir que les améliorations de la moyenne peuvent masquer une dégradation pour des segments spécifiques. La moyenne cache les extrêmes — et dans le cas d'un produit de santé, les extrêmes sont les plus vulnérables.

**Améliorations possibles**

Mettre en place un dashboard spécifique aux segments vulnérables (65+, utilisateurs avec temps de saisie longs, utilisateurs iOS bas de gamme) qui alerte automatiquement si leur taux d'abandon dépasse de 15 points le taux moyen. Ce dashboard devient un engagement produit visible pour toute l'équipe.

**Changement de paradigme**

Optimiser un funnel de santé sans monitorer ses utilisateurs les plus fragiles, c'est optimiser l'expérience des utilisateurs qui en ont le moins besoin.

---

## Concept 4 — Éthique IA Produit

> Transparence des recommandations, contrôle humain, dark patterns IA ❌

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Le CPO d'une plateforme de streaming musical te présente fièrement leur nouveau système de recommandation IA : "Notre algorithme analyse les 150 derniers morceaux écoutés et génère une playlist personnalisée. Le taux d'engagement a augmenté de 34 %. Les utilisateurs adorent ça — ils n'ont même plus besoin de chercher, l'IA choisit pour eux."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Cette présentation semble positive — qu'est-ce qui pourrait poser problème à moyen terme pour l'expérience utilisateur et pour l'éthique du produit ? Quelles questions poserais-tu sur ce système avant de valider son déploiement à grande échelle ?

---

#### Exercice 2 — Piège de paradigme

Une application de recrutement utilise un système de scoring IA pour présenter les candidats aux recruteurs. Voici comment le système est présenté aux utilisateurs :

---

*Interface recruteur — Candidats recommandés*

Pour chaque candidat, l'interface affiche :
- Photo, prénom, ville
- Score de compatibilité : ██████░░░░ **67 %** — "Bonne correspondance"
- Bouton "Voir le profil complet" / Bouton "Passer"

Le score est présenté sans aucune explication sur les critères utilisés. Le modèle a été entraîné sur les embauches réussies des 5 dernières années dans les entreprises clientes. L'équipe tech confirme en interne que le modèle accorde un poids significatif à l'université d'origine et à la localisation géographique.

---

**Question :** Identifie tous les problèmes éthiques, UX et légaux de ce système. Quels dark patterns IA sont présents ❌ ? Quels KPIs seraient affectés si ces problèmes ne sont pas traités ? Propose les correctifs indispensables.

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es Product Designer dans une startup EdTech qui développe un assistant pédagogique IA pour des lycéens préparant leur orientation post-bac. L'IA analyse les notes, les centres d'intérêt déclarés et les résultats à des tests de positionnement pour recommander des filières et des écoles. La startup vient de lever 8 M€ et veut lancer la fonctionnalité dans 3 mois. Le CEO veut que les recommandations soient "définitives et personnalisées" — il s'inspire des algorithmes de recommandation Netflix.

**Dimension éthique et inclusive :** L'IA a été entraînée sur des données d'élèves issus principalement de lycées privés et de zones urbaines. Les lycéens de zones rurales et les élèves de milieux populaires représentent moins de 12 % des données d'entraînement. La startup travaille avec des lycées publics en REP+ (réseau d'éducation prioritaire) dans le cadre d'un partenariat avec l'Éducation Nationale.

**Questions :**

1. Décris ton modèle mental AVANT de concevoir la fonctionnalité : quelles sont les différences fondamentales entre une recommandation Netflix (série à regarder) et une recommandation d'orientation scolaire ? Pourquoi l'analogie du CEO est-elle inappropriée ?

2. Identifie les biais potentiels dans le modèle IA et leurs conséquences concrètes pour les élèves de REP+. Comment les documenteras-tu dans la conception du produit ?

3. Conçois le modèle d'interaction de la fonctionnalité en respectant les principes de transparence algorithmique, de contrôle humain et d'absence de dark patterns. Décris chaque choix de design et son justification éthique.

4. Quels KPIs UX et éthiques mettras-tu en place pour surveiller l'impact de la fonctionnalité sur les différents segments d'élèves, et quelles seraient tes conditions d'arrêt ou de révision du système ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Un algorithme de recommandation optimise une métrique définie (ici : l'engagement = temps écouté). Cette optimisation peut produire des effets non intentionnels à moyen terme : enfermement dans une bulle de filtre, réduction de la diversité musicale perçue par l'utilisateur, et perte d'autonomie dans les choix culturels. L'engagement à court terme peut masquer un appauvrissement de l'expérience à long terme.

**Raisonnement UX/Product**

**Problème 1 — La bulle de filtre (Filter Bubble)**

Un algorithme qui recommande en fonction des 150 derniers morceaux écoutés renforce par définition les goûts existants. Si l'utilisateur écoute principalement du rap français, il recevra principalement du rap français. Sa découverte d'autres genres (jazz, classique, musiques du monde) diminue mécaniquement. Le paradoxe : l'engagement augmente à court terme parce que l'utilisateur reçoit exactement ce qu'il connaît déjà — mais la valeur long terme (découverte, enrichissement culturel) diminue.

**Problème 2 — Perte d'autonomie et de sérendipité**

"Ils n'ont même plus besoin de chercher" — cette phrase, présentée comme un avantage, décrit en réalité une réduction de l'agentivité de l'utilisateur. La recherche active est un comportement culturel important. Un utilisateur qui ne choisit plus activement développe une dépendance à la prescription algorithmique.

**Problème 3 — Opacité du système**

L'utilisateur ne sait pas pourquoi ce morceau lui est recommandé. Il ne peut pas corriger les biais de sa propre historique (par exemple : "j'ai écouté de la musique de Noël en décembre — je ne veux pas que ça influence mes recommandations de janvier"). L'absence de contrôle est un problème éthique et d'expérience.

**Problème 4 — Optimisation d'une mauvaise métrique**

L'engagement (temps écouté) n'est pas synonyme de satisfaction. Un utilisateur peut écouter beaucoup parce qu'il a l'application en fond sonore, ou parce qu'il n'ose pas fermer la playlist (friction pour changer). La métrique correcte serait la satisfaction déclarée et la rétention à long terme.

**Questions à poser avant validation**

- Quelle est la diversité du catalogue recommandé par utilisateur à 3 mois vs 6 mois ? (Mesure de la bulle de filtre)
- Quel est le NPS à 6 mois des utilisateurs exposés à l'algorithme vs ceux qui naviguent manuellement ?
- Les utilisateurs ont-ils un moyen de voir pourquoi un morceau est recommandé ?
- Les utilisateurs peuvent-ils corriger ou "réinitialiser" leur historique de recommandation ?

**KPIs impactés**

| KPI négligé | Risque si ignoré |
|---|---|
| Diversité du catalogue consommé par utilisateur (index de diversité Simpson) | Appauvrissement culturel, bulle de filtre documentée |
| NPS à 6 mois (sentiment "découverte" vs "routine") | Churn long terme des utilisateurs qui s'ennuient |
| Taux d'exploration volontaire (recherche active vs écoute passive) | Perte d'engagement actif, dépendance passive |
| Taux de désactivation des recommandations IA | Signal que les utilisateurs rejettent le système |

**Erreurs classiques**

- Confondre l'engagement à court terme (temps d'écoute) et la satisfaction long terme.
- Mesurer le succès d'un algorithme de recommandation uniquement sur la métrique qu'il optimise.
- Présenter la perte d'autonomie utilisateur comme un bénéfice ("ils n'ont plus besoin de chercher").

**Correction du biais cognitif**

Biais de satisfaction immédiate (hyperbolic discounting) + biais de la métrique unique : l'équipe produit se concentre sur la hausse de l'engagement (+34 %) sans modéliser les effets à 6 et 12 mois sur la satisfaction, la diversité et la rétention.

**Améliorations possibles**

Introduire une dose contrôlée de "sérendipité algorithmique" : réserver 20 % des recommandations à des morceaux hors de la zone de confort de l'utilisateur, avec un indicateur explicite ("Nouveauté pour vous"). Mesurer séparément le taux d'écoute complète de ces morceaux "sérendipité" — c'est le KPI de découverte.

**Changement de paradigme**

Un algorithme qui optimise l'engagement sans optimiser l'autonomie de l'utilisateur construit une dépendance, pas une expérience.

---

#### Correction — Exercice 2 : Piège de paradigme

**Modèle mental attendu**

Un système de scoring IA dans le recrutement prend des décisions qui ont des conséquences directes sur la vie des personnes (accès à l'emploi). Ce contexte à fort enjeu impose une transparence totale, une explicabilité des critères, et une conformité légale stricte. L'opacité n'est pas une option de design — c'est une violation potentielle de la loi.

**Raisonnement UX/Product**

**Dark Pattern 1 — Score de confiance sans explicabilité ❌ (Deceptive Framing)**

Afficher "67 % — Bonne correspondance" sans expliquer ce que représente ce score est un dark pattern de type "autorité algorithmique opaque". L'utilisateur (le recruteur) est invité à faire confiance à un chiffre dont il ne connaît pas les fondements. Ce chiffre oriente sa décision sans lui donner les moyens de l'évaluer.

Règle légale RGPD (Art. 22) : toute décision ayant un impact significatif sur une personne et reposant sur un traitement automatisé doit pouvoir être expliquée à cette personne et être contestable. Un score de recrutement entre dans ce cadre.

**Dark Pattern 2 — Biais de représentation dans les données d'entraînement ❌ (Biased Proxy)**

Le modèle a été entraîné sur les embauches "réussies" des 5 dernières années. Si les entreprises clientes avaient des pratiques discriminatoires (embauche favorisant certaines universités, certaines zones géographiques), le modèle a appris et reproduit ces discriminations à grande échelle. Ce n'est pas une erreur technique — c'est une amplification algorithmique des discriminations existantes.

Le poids significatif accordé à "l'université d'origine" et à la "localisation géographique" sont des proxies connus pour des discriminations indirectes (milieu social, origine géographique, accès aux ressources).

**Problème légal** : en France, la discrimination à l'embauche est illégale (Code du travail, Art. L1132-1). Un algorithme qui discrimine indirectement engage la responsabilité de l'entreprise qui le déploie. Le RGPD impose en outre une analyse d'impact (DPIA) pour ce type de traitement.

**Dark Pattern 3 — Présentation visuelle orientée ❌ (Confirmatory Nudge)**

La présentation (photo, prénom, ville visible avant le score) permet des biais humains de s'activer (attractivité physique, prénom à consonance étrangère, ville perçue comme défavorisée) avant même que le recruteur ne voie le profil complet. La photo et le prénom ne devraient pas apparaître dans un système d'aide à la décision de recrutement.

**Correctifs indispensables**

1. **Explicabilité du score** : afficher les 3-5 critères qui ont contribué au score, avec leur poids relatif. Exemple : "Compétences Python (++) / Expérience en gestion de projet (+) / Localisation (critère désactivé car non pertinent légalement)."
2. **Suppression des critères discriminatoires** : retirer l'université d'origine et la localisation géographique du modèle. Auditer le modèle avec un test d'équité (fairness audit) avant tout déploiement.
3. **Anonymisation de la présentation initiale** : masquer la photo et le prénom dans la liste de recommandation. Ne les afficher qu'une fois que le recruteur a décidé d'ouvrir le profil complet.
4. **Droit de contestation** : permettre aux candidats de demander une explication de leur score et de contester une décision défavorable (conformité RGPD Art. 22).
5. **DPIA (Data Protection Impact Assessment)** : réaliser une analyse d'impact avant déploiement, obligatoire pour ce type de traitement à risque élevé.

**KPIs impactés**

| Problème | KPI impacté | Direction |
|---|---|---|
| Biais discrimination | Diversité des candidats embauchés (parité H/F, origines) | Dégradation si non traité |
| Opacité du score | Confiance des recruteurs dans le système (adoption) | Faible adoption si les recruteurs ne comprennent pas |
| Non-conformité RGPD | Risque de sanction CNIL (jusqu'à 4 % du CA mondial) | Risque légal et réputationnel |
| Dark pattern visuel | Taux de discrimination involontaire par les recruteurs | Augmentation des biais humains amplifiés par l'IA |

**Erreurs classiques**

- Croire que l'IA est "objective" parce qu'elle est algorithmique. Elle est le reflet des données — et les données reflètent les pratiques humaines passées, y compris leurs discriminations.
- Ignorer le RGPD Art. 22 sur le droit à l'explication des décisions automatisées.
- Déployer un système de scoring RH sans audit d'équité préalable.

**Correction du biais cognitif**

Biais d'automatisation (automation bias) : les recruteurs tendent à faire confiance à un score algorithmique même quand il est opaque, par déférence à la machine. Ce biais amplifie l'impact de tout biais présent dans le modèle.

**Améliorations possibles**

Introduire une validation humaine obligatoire pour les cas limites (score entre 40 % et 60 %) et une obligation pour le recruteur de rédiger une justification textuelle avant de "Passer" un candidat avec un score > 60 %. Ce mécanisme de friction positive réduit les décisions automatiques non réfléchies.

**Changement de paradigme**

Un algorithme de recrutement sans explicabilité n'est pas un outil d'aide à la décision — c'est une boîte noire qui décide à la place des humains en leur donnant l'illusion du contrôle.

---

#### Correction — Exercice 3 : Mini-cas réel

**Modèle mental attendu**

L'analogie Netflix est fondamentalement inappropriée pour l'orientation scolaire. Une recommandation Netflix optimise pour l'engagement immédiat sur un choix réversible (si la série ne plaît pas, on en choisit une autre). Une recommandation d'orientation scolaire a des conséquences à 5-10 ans sur la trajectoire de vie d'un adolescent, et pour les élèves de milieux défavorisés, une mauvaise orientation peut fermer des portes définitivement. Le modèle de design doit être radicalement différent.

**Raisonnement UX/Product**

**1. Différences fondamentales Netflix vs orientation scolaire**

| Dimension | Recommandation Netflix | Recommandation d'orientation |
|---|---|---|
| Réversibilité | Totale (on change de série en 2 clics) | Faible à nulle (changer de filière = 1 an perdu) |
| Enjeu de l'erreur | Négligeable (mauvaise série = 2h perdues) | Élevé (mauvaise filière = échec scolaire, perte de confiance) |
| Données d'entraînement | Milliards de vues (représentatives) | Données biaisées (12 % de profils REP+) |
| Contexte émotionnel | Divertissement, pas de stress | Choix d'avenir, anxiété élevée chez les lycéens |
| Rôle de l'humain | Aucun intermédiaire requis | Parents, enseignants, conseillers d'orientation = co-décideurs essentiels |
| Contrôle utilisateur | Fort (on zap librement) | Doit être maximum (l'élève construit son futur) |

Le CEO confond optimisation de l'engagement avec aide à la décision de vie. Ce sont deux catégories de produits avec des principes éthiques opposés.

**2. Biais du modèle et conséquences pour les élèves REP+**

Biais 1 — Sous-représentation des profils REP+ (12 % des données) : le modèle a appris à partir de trajectoires d'élèves de lycées privés et urbains. Il va sur-estimer la probabilité de succès dans des filières sélectives pour les profils qui ressemblent à ces données, et sous-estimer les possibilités pour les élèves REP+ même talentueuxs dont le profil "ressemble moins" aux trajectoires de succès historiques.

Conséquence concrète : un élève de REP+ excellent en mathématiques mais dont le profil global (lycée, ville, résultats aux tests) diffère des profils historiques des classes prépa peut recevoir une recommandation orientée vers des BTS ou licences professionnelles plutôt que vers une CPGE. L'algorithme reproduit et amplifie la reproduction sociale.

Biais 2 — Centres d'intérêt déclarés vs opportunités réelles : les élèves de milieux défavorisés ont souvent une moins bonne connaissance des filières possibles. Ils ne déclarent pas d'intérêt pour des filières dont ils ignorent l'existence. L'IA ne peut pas compenser une méconnaissance du système.

Documentation dans la conception : créer une "fiche de biais documentés" visible dans l'interface administrateur et dans la documentation du produit. Mentionner explicitement : "Ce modèle a été entraîné sur 12 % de profils REP+. Ses recommandations pour ce segment sont moins fiables. Une validation humaine est obligatoire pour les élèves issus de REP+."

**3. Modèle d'interaction éthique**

**Principe 1 — La recommandation est une piste, jamais une décision**

L'interface doit nommer explicitement ce que l'IA fait et ce qu'elle ne fait pas. Libellé correct : "Voici 3 pistes à explorer en fonction de ton profil. Ce ne sont pas des prédictions — explore-les avec ton conseiller d'orientation."

Libellé à éviter ❌ : "Ton profil correspond à ces filières" (formulation prescriptive qui induit une illusion de certitude).

**Principe 2 — Explicabilité des recommandations**

Pour chaque filière suggérée, afficher les 3 raisons qui ont conduit à cette suggestion : "Tes notes en mathématiques et sciences (15/20 de moyenne) / Ton intérêt déclaré pour la résolution de problèmes / Des élèves avec un profil similaire ont réussi dans cette filière."

Afficher également les zones d'incertitude : "Nous avons peu de données sur cette combinaison de profil et de filière — parle-en à ton conseiller."

**Principe 3 — Contrôle total de l'élève**

- L'élève peut modifier ses centres d'intérêt à tout moment et voir les recommandations se mettre à jour.
- L'élève peut exclure des filières qui ne l'intéressent pas sans que cela soit "mémorisé" comme un signal négatif pour de futures recommandations.
- L'élève peut voir l'ensemble de son profil tel qu'il est vu par l'algorithme et le corriger.
- Bouton "Tout effacer et recommencer" visible et accessible ❌ pas caché dans les paramètres (ce serait un dark pattern d'enfouissement).

**Principe 4 — Validation humaine obligatoire pour les élèves REP+**

Pour les élèves identifiés dans un établissement REP+, afficher un bandeau : "Ton établissement bénéficie d'un accompagnement personnalisé. Partage ces pistes avec ton conseiller d'orientation avant de prendre une décision." L'IA n'est pas le décideur — elle est l'outil du conseiller.

**Principe 5 — Aucun dark pattern de fausse urgence ❌**

Pas de compteur "Il ne reste que 3 jours pour répondre à Parcoursup", pas de notification anxiogène, pas de wording du type "Ne rate pas ta chance". Ces mécanismes d'urgence artificielle sont particulièrement destructeurs dans le contexte de l'orientation scolaire où l'anxiété des lycéens est déjà élevée.

**4. KPIs et conditions d'arrêt**

**KPIs UX et éthiques**

| KPI | Méthode | Cible | Alarme si |
|---|---|---|---|
| Taux d'acceptation des recommandations par segment (REP+ vs hors REP+) | Tracking de la décision finale déclarée par l'élève | Écart < 15 % entre les deux segments | Écart > 20 % → investigation biais |
| Score de confiance déclarée dans la recommandation (1-5) | Enquête post-utilisation | > 3,5/5 pour tous les segments | < 3/5 pour REP+ → révision du modèle |
| Taux de modification des recommandations par les conseillers d'orientation | Tracking des révisions manuelles | < 20 % (si > 20 %, le modèle est peu fiable) | > 30 % → blocage et révision du modèle |
| Diversité des filières recommandées (indice de Shannon) | Analytics sur la distribution des recommandations | Distribution non concentrée sur 3 filières | Concentration sur < 5 filières = bulle de filtre détectée |
| Taux de réussite à 1 an dans la filière choisie par segment | Suivi longitudinal avec les lycées partenaires | Écart REP+ / hors REP+ < 10 % | Écart > 15 % → audit biais du modèle |

**Conditions d'arrêt ou de révision**

- Si l'écart de recommandations de filières sélectives (CPGE, grandes écoles) entre élèves REP+ et hors REP+ avec des profils scolaires équivalents dépasse 25 % → arrêt immédiat de la fonctionnalité pour les élèves REP+ et révision du modèle.
- Si un élève de REP+ rapporte avoir renoncé à une filière sur la seule base de la recommandation IA sans consultation humaine → révision des consignes d'interface et renforcement de l'obligation de validation humaine.
- Si le modèle n'atteint pas 80 % de données REP+ représentatives dans les données d'entraînement dans les 18 mois → indiquer clairement dans l'interface que le modèle est en phase de calibration et que ses recommandations pour ce segment ont une fiabilité limitée.

**Erreurs classiques**

- Appliquer des logiques de produit grand public (engagement, rétention, funnel de conversion) à des produits à fort enjeu humain (santé, orientation, emploi, finance).
- Lancer une IA sur des populations vulnérables avec des données d'entraînement non représentatives de ces populations.
- Présenter les recommandations de l'IA comme objectives et définitives pour masquer leur nature probabiliste et biaisée.

**Correction du biais cognitif**

Biais d'enthousiasme technologique (Automation Bias + Techno-solutionnism) : l'équipe et le CEO croient que l'IA peut résoudre un problème systémique (inégalités d'accès à l'orientation) avec un algorithme entraîné sur des données qui reflètent précisément les inégalités qu'on veut résoudre. C'est une contradiction fondamentale que le design du produit doit adresser, pas contourner.

**Améliorations possibles**

Mettre en place un comité éthique externe (chercheurs en éducation, associations de lycéens de REP+, conseillers d'orientation) qui audite le modèle deux fois par an et dont les recommandations sont intégrées dans la roadmap produit. Publier un rapport d'impact annuel sur la diversité des orientations générées par la plateforme — un engagement de transparence public qui crée une responsabilité réelle.

**Changement de paradigme**

Une IA d'orientation qui ne garantit pas l'équité entre les segments d'élèves ne réduit pas les inégalités scolaires — elle les automatise à grande échelle.

---

*Fin des exercices — Section 6 : Prototypage, Validation & Optimisation*
