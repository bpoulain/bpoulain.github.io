# Section 11 — Service Design & Systèmes complexes — Exercices

> **Fichier exercices — aucune théorie ici.**
> Ces exercices s'appuient sur les concepts de la Section 11 (théorie). Chaque bloc suit la même structure : traduction mentale, piège de paradigme, mini-cas réel — puis les corrections détaillées avec KPIs, erreurs classiques et changement de paradigme.

---

## Table des matières

1. [Concept 1 — Service blueprint](#concept-1--service-blueprint)
2. [Concept 2 — Expérience cross-canal](#concept-2--expérience-cross-canal)
3. [Concept 3 — Design de dashboard complexe](#concept-3--design-de-dashboard-complexe)
4. [Concept 4 — Workflows métiers B2B](#concept-4--workflows-métiers-b2b)

---

## Concept 1 — Service blueprint

### Contexte du cas

**Produit** : *MutuelSanté* — une mutuelle de santé proposant une application mobile de remboursement, un espace client web, un service téléphonique et des agences physiques dans 40 villes. Le parcours de remboursement d'une hospitalisation implique : le patient (assuré), le médecin hospitalier, l'hôpital, la Sécurité Sociale, et les équipes internes de *MutuelSanté* (gestionnaires de sinistres, service client, service informatique). Depuis 6 mois, le NPS transactionnel post-hospitalisation est de -12.

---

### Exercice 1 — Traduction mentale

La directrice UX de *MutuelSanté* veut "améliorer l'expérience de remboursement". Son réflexe initial est de faire un audit de l'application mobile et de refondre le tunnel de soumission de demande.

**Question** : Comment aborderais-tu ce problème avec ta compréhension actuelle du service design ? L'application mobile est-elle le bon point de départ ? Que ferais-tu concrètement dans les deux premières semaines ?

---

### Exercice 2 — Piège de paradigme

L'équipe de *MutuelSanté* présente le service blueprint suivant en réunion :

> Le blueprint cartographie uniquement les étapes que l'assuré vit sur l'application : soumettre une demande, uploader les pièces justificatives, suivre le statut, recevoir le virement. L'équipe est fière d'avoir réduit le nombre d'étapes de 9 à 6.

Le NPS post-hospitalisation reste à -12 trois mois après le redesign de l'app.

**Question** : Qu'est-ce qui ne va pas dans cette approche du service blueprint ? Pourquoi le redesign de l'application n'a-t-il pas amélioré le NPS ? Quels KPIs auraient signalé ce problème en amont ?

---

### Exercice 3 — Mini-cas réel

*MutuelSanté* reçoit les verbatims suivants de ses assurés après une hospitalisation :

- *"J'ai envoyé mes documents sur l'app mais l'hôpital m'a dit qu'il avait déjà tout transmis à la mutuelle. Je ne sais pas qui a raison."*
- *"Le remboursement a mis 6 semaines. Personne ne m'a expliqué pourquoi. J'ai appelé 3 fois et eu 3 réponses différentes."*
- *"J'ai dû ressaisir mes coordonnées bancaires alors qu'elles sont déjà dans mon profil."*
- *"La lettre de refus partiel était incompréhensible. J'ai dû appeler pour savoir ce que je pouvais faire."*
- *"Mon médecin m'a dit de ne pas m'inquiéter, que la mutuelle gérait. Mais j'ai quand même reçu une relance de l'hôpital."*

**Question** : Décris ton modèle mental AVANT de commencer l'analyse. Classe ces verbatims selon les couches du service blueprint (actions utilisateur, frontstage, backstage, processus de support). Identifie les pain points systémiques. Propose une liste de 5 investigations prioritaires à mener et 3 interventions à fort impact. Quels KPIs suivrais-tu pour mesurer l'amélioration ?

Inclure une réflexion sur la dimension inclusive : quels segments d'assurés sont les plus pénalisés par ces défaillances systémiques ?

---

### Corrections — Concept 1

#### Correction Exercice 1

**Modèle mental attendu**

Un NPS de -12 post-hospitalisation signale une défaillance d'expérience grave. L'hospitalisation est une période de vulnérabilité émotionnelle et physique — les frictions vécues pendant cette période ont un impact émotionnel amplifié. Avant de toucher à l'application, comprendre où la valeur est détruite dans le système global.

Le réflexe "on va refaire l'app" est la réponse la plus rapide à formuler et la moins probable d'être la bonne. Le parcours de remboursement post-hospitalisation implique au minimum 5 acteurs (assuré, hôpital, médecin, Sécu, *MutuelSanté*) et 4 systèmes d'information différents — les frictions les plus douloureuses se trouvent probablement dans les interfaces entre ces acteurs, pas dans les formulaires de l'application.

**Ce qu'il faut faire dans les deux premières semaines**

1. **Interviews quali avec 10 à 15 assurés** récents ayant vécu une hospitalisation : raconter l'expérience de bout en bout, pas seulement l'application. Cartographier les émotions, les attentes, les moments de frustration et les moments positifs.

2. **Interviews des agents du service téléphonique** : quels sont les motifs de contact les plus fréquents post-hospitalisation ? Combien d'appels concernent des délais inexpliqués ? Des documents perdus ? Des conflits avec l'hôpital ?

3. **Analyse des tickets support** : classifier les raisons de contact et leur volume. Identifier les "bugs systémiques" (problèmes qui reviennent indépendamment de l'utilisateur).

4. **Cartographier le parcours complet** — de la sortie de l'hôpital jusqu'au virement reçu — en incluant les acteurs hors *MutuelSanté*.

5. **Ne pas toucher à l'application** avant d'avoir cette vision systémique.

**KPIs impactés**

| KPI UX | KPI Business |
|--------|-------------|
| NPS transactionnel post-hospitalisation (actuellement -12) | Coût des contacts support liés aux remboursements |
| Customer Effort Score (CES) post-remboursement | Taux de résiliation post-sinistre |
| Taux de compréhension de la lettre de remboursement | Coût de traitement d'un dossier de remboursement |

**Erreurs classiques**

- Traiter un problème systémique comme un problème d'interface
- Confondre "on peut améliorer l'app" avec "améliorer l'app résoudra le problème"
- Ne pas impliquer les équipes opérationnelles (gestionnaires, service téléphonique) qui voient les défaillances systémiques quotidiennement

**Feedback itératif — changement de paradigme**

> Quand un NPS est négatif, le problème est rarement là où on le cherche en premier. Le service blueprint existe précisément pour éviter de soigner le symptôme en ignorant la maladie systémique.

---

#### Correction Exercice 2

**Modèle mental attendu**

Un service blueprint incomplet — qui ne cartographie que le frontstage de l'utilisateur — n'est pas un service blueprint. C'est une user journey map partielle. Sans cartographier les acteurs, les systèmes et les processus backstage qui conditionnent l'expérience, le redesign de l'interface ne peut pas résoudre les problèmes qui naissent en coulisses.

**Ce qui ne va pas**

| Problème | Explication |
|---------|-------------|
| Blueprint limité au frontstage numérique | Un blueprint valide cartographie AUSSI le backstage — les acteurs internes, les systèmes, les délais de traitement, les règles de validation |
| Acteurs absents | Le blueprint ne mentionne pas l'hôpital, la Sécurité Sociale, les gestionnaires de sinistres internes — qui sont pourtant au cœur des frictions |
| Optimisation locale, pas systémique | Passer de 9 à 6 étapes sur l'app est une amélioration incrémentale d'un canal, pas une amélioration du service |
| Pas de handoffs cartographiés | Les moments de transfert entre acteurs (hôpital → *MutuelSanté*, Sécu → *MutuelSanté*) sont les points de rupture les plus fréquents — invisibles dans ce blueprint |

**Pourquoi le NPS reste à -12**

Le NPS post-hospitalisation est conditionné par l'expérience globale — pas par la fluidité de l'application. Si le remboursement prend 6 semaines sans communication, si l'assuré reçoit des informations contradictoires selon le canal, si la lettre de remboursement est incompréhensible, si les coordonnées bancaires doivent être ressaisies — ces problèmes sont backstage et aucun redesign d'app ne peut les résoudre.

**KPIs qui auraient signalé le problème en amont**

| KPI | Signal |
|-----|--------|
| Délai moyen de traitement d'un dossier de remboursement | Si > 15 jours en moyenne, c'est un problème systémique |
| Taux de résolution au premier contact téléphonique | Un taux faible signale des problèmes de coordination interne |
| Volume de contacts support par type de motif | "Délai inexpliqué" et "Documents manquants" en tête = problème backstage |
| Taux de dossiers nécessitant une intervention manuelle | Révèle les exceptions non gérées par les systèmes |

**Feedback itératif — changement de paradigme**

> Un service blueprint qui ne montre que ce que l'utilisateur voit est un miroir — utile, mais il n'explique pas ce qui se passe derrière la vitre.

---

#### Correction Exercice 3

**Modèle mental AVANT d'analyser**

Ces 5 verbatims ne sont pas des problèmes d'interface. Ce sont des signaux de défaillances systémiques : coordination entre acteurs, synchronisation des données, communication proactive, lisibilité des documents administratifs. Le service blueprint est l'outil exact pour cartographier d'où viennent ces problèmes.

**Classification des verbatims selon les couches du blueprint**

| Verbatim | Couche principale | Nature du problème |
|---------|------------------|-------------------|
| "J'ai envoyé mes docs mais l'hôpital m'a dit qu'il avait déjà tout transmis" | Backstage / Processus de support | Duplication non communiquée, absence de synchronisation entre les flux de données Hôpital → *MutuelSanté* et Assuré → *MutuelSanté* |
| "6 semaines, 3 appels, 3 réponses différentes" | Backstage / Frontstage téléphonique | Délai de traitement non maîtrisé + absence de visibilité du statut pour les agents = incohérence des réponses |
| "Ressaisie des coordonnées bancaires" | Frontstage numérique / Backstage SI | Données non partagées entre le profil et le formulaire de demande de remboursement — problème d'intégration technique |
| "Lettre de refus partiel incompréhensible" | Frontstage communication / Backstage rédactionnel | Contenu administratif non designé pour l'utilisateur — jargon assurantiel non traduit |
| "Mon médecin m'a dit que ça gérait, mais j'ai reçu une relance de l'hôpital" | Processus de support / Backstage inter-acteurs | Absence de communication entre les systèmes de l'hôpital et *MutuelSanté*, créant une contradiction entre le discours du médecin et la réalité administrative |

**Pain points systémiques identifiés**

1. **Absence de source de vérité unique** sur le statut d'un dossier : l'assuré, l'hôpital et les agents internes ont des visions différentes — le "dossier" n'existe pas en tant qu'objet partagé.
2. **Délais de traitement non maîtrisés et non communiqués** : le remboursement est une boîte noire pour l'assuré et, semble-t-il, pour les agents eux-mêmes.
3. **Silos de données** : le profil utilisateur ne communique pas avec les formulaires ; les données de l'hôpital ne communiquent pas avec les données de l'assuré.
4. **Communication en langage administratif** : les documents sortants (lettres, notifications) sont rédigés par et pour des gestionnaires, pas pour des assurés en situation de stress.
5. **Coordination inter-acteurs absente** : aucun mécanisme ne synchronise les communications entre hôpital, Sécu et *MutuelSanté* du point de vue de l'assuré.

**5 investigations prioritaires**

| Priorité | Investigation | Méthode |
|----------|--------------|---------|
| 1 | Cartographie complète du flux de données entre hôpital, Sécu et *MutuelSanté* | Entretiens systèmes avec DSI + audit des API et échanges de fichiers |
| 2 | Analyse des délais de traitement par étape du dossier (où passe le temps ?) | Analyse des logs de workflow interne + entretiens gestionnaires |
| 3 | Test utilisateur de la lettre de remboursement avec 8 assurés aux profils variés (âge, niveau d'étude, expérience) | Test de compréhension (comprehension test) |
| 4 | Inventaire des motifs de contact téléphonique post-hospitalisation sur 90 jours | Analyse des données CRM + écoutes téléphoniques avec accord |
| 5 | Entretiens avec les agents pour comprendre pourquoi 3 agents donnent 3 réponses différentes | Shadowing + accès aux outils internes des agents |

**3 interventions à fort impact**

1. **Portail de statut en temps réel** — un tableau de bord assuré simple ("Votre dossier est en cours de traitement — étape 3 sur 5 — délai estimé : 5 jours") visible sur l'app et le web. Elimine les contacts "où en est mon remboursement ?" et réduit l'anxiété. Impact direct sur le CES et le volume de contacts support.

2. **Refonte des lettres de remboursement en plain language** — reécriture des courriers avec un lexique simple, une structure claire (ce qui est remboursé / ce qui ne l'est pas / pourquoi / que faire si vous contestez) et des tests de compréhension avec des assurés représentatifs. Impact direct sur le NPS et le volume d'appels "je n'ai pas compris ma lettre".

3. **Unification du dossier assuré** — un identifiant de dossier unique visible par l'assuré, par les agents internes et (dans la mesure du possible) référencé dans les échanges avec l'hôpital. Réduit les contradictions entre sources d'information et la duplication de documents.

**KPIs de mesure de l'amélioration**

| KPI UX | KPI Business |
|--------|-------------|
| NPS transactionnel post-remboursement (objectif : passer de -12 à > +20 en 12 mois) | Coût moyen de traitement d'un dossier (objectif : réduction de 20 %) |
| CES post-demande de remboursement | Volume de contacts support "statut de dossier" (objectif : -40 %) |
| Taux de compréhension de la lettre de remboursement (test utilisateur) | Délai moyen de remboursement (objectif : < 10 jours) |
| Taux de résolution au premier contact | Taux de résiliation dans les 3 mois post-sinistre |

**Dimension inclusive — qui est le plus pénalisé ?**

Les assurés les plus impactés par ces défaillances systémiques sont :
- **Les seniors** : moins à l'aise avec l'application mobile, plus dépendants du téléphone et des courriers papier — pour eux, la lettre incompréhensible et les 3 réponses différentes au téléphone sont des obstacles majeurs
- **Les personnes en situation de précarité** : une hospitalisation peut générer des difficultés financières immédiates. Un remboursement de 6 semaines sans communication peut aggraver une situation critique
- **Les personnes ne maîtrisant pas le français administratif** : les lettres assurantielles en jargon technique constituent une barrière d'accès réelle
- **Les patients hospitalisés pour des pathologies graves** : la charge cognitive d'une hospitalisation difficile amplifie chaque friction administrative

La refonte devrait inclure des tests utilisateurs avec des profils seniors, des profils à faible littératie administrative et des profils allophones — pas seulement des utilisateurs "standard".

**Feedback itératif — changement de paradigme**

> Les défaillances les plus visibles pour l'utilisateur naissent le plus souvent dans les coulisses — là où aucun designer ne regarde habituellement.

---

## Concept 2 — Expérience cross-canal

### Contexte du cas

**Produit** : *LogiTrack* — une plateforme de gestion de livraisons pour les e-commerçants B2B. Les clients (responsables logistiques) utilisent la plateforme web pour gérer les expéditions, l'application mobile pour le suivi en temps réel, le support email pour les litiges, et le téléphone pour les urgences. *LogiTrack* a récemment intégré un chat en ligne sur la plateforme web. Le Customer Effort Score (CES) global est de 4,1 / 7 — jugé trop élevé. Les clients se plaignent principalement de devoir "tout réexpliquer à chaque fois".

---

### Exercice 1 — Traduction mentale

Une responsable logistique chez un client B2B de *LogiTrack* décrit son quotidien :

> "Ce matin, j'ai détecté un problème sur une expédition via l'app mobile en route vers un client. J'ai ouvert le chat sur la plateforme web pour avoir de l'aide. L'agent du chat ne voyait pas l'expédition dont je parlais. J'ai alors appelé le support téléphonique, qui m'a demandé le numéro de commande — que j'avais en main — mais aussi le nom du transporteur, l'adresse exacte, et la raison du problème, que j'avais déjà saisie dans le chat. J'ai tout répété. Finalement, le problème a été résolu 4 heures plus tard."

**Question** : Comment aborderais-tu l'analyse de cette situation ? Quels sont les points de friction cross-canal identifiables ? Quelle est la cause structurelle du problème, et où se situe-t-elle dans le système ?

---

### Exercice 2 — Piège de paradigme

L'équipe produit de *LogiTrack* décide d'améliorer l'expérience cross-canal en ajoutant un chat en temps réel à l'application mobile (en plus du chat déjà présent sur le web) et en intégrant un bot de premier niveau sur le support téléphonique.

Le PM présente cette feuille de route comme "la stratégie omnicanale de *LogiTrack*".

**Question** : Qu'est-ce qui ne va pas dans cette approche ? Ajouter des canaux résout-il le problème identifié ? Quels KPIs seraient affectés positivement ou négativement par cette décision ?

---

### Exercice 3 — Mini-cas réel

*LogiTrack* a cartographié les 5 transitions de canal les plus fréquentes chez ses clients B2B :

| Transition | Fréquence | CES moyen | Problème identifié |
|-----------|-----------|-----------|-------------------|
| App mobile → Chat web | 38 % des contacts | 5,8 / 7 | L'agent du chat ne voit pas le contexte de l'expédition consultée sur l'app |
| Chat web → Téléphone | 24 % des escalades | 6,1 / 7 | L'agent téléphone n'a pas l'historique du chat |
| Email → Téléphone | 18 % des escalades | 5,9 / 7 | L'agent téléphone demande de renvoyer les pièces jointes déjà envoyées par email |
| Plateforme web → Email | 12 % des contacts | 4,2 / 7 | L'email de confirmation ne contient pas les informations attendues par le client |
| Téléphone → Plateforme web | 8 % des redirections | 3,9 / 7 | Le client est redirigé vers la plateforme pour "finaliser" — sans lien direct |

**Question** : Décris ton modèle mental AVANT de commencer. Priorise ces 5 transitions selon leur impact sur le CES global et le volume. Pour chacune des 2 transitions les plus critiques, propose une solution concrète (ce qui doit changer dans le système, pas seulement dans l'interface). Quels KPIs suivrais-tu pour valider l'amélioration ? Intègre une dimension éthique et inclusive dans ta réponse.

---

### Corrections — Concept 2

#### Correction Exercice 1

**Modèle mental attendu**

Le problème décrit n'est pas un problème d'interface — c'est un problème d'architecture d'information partagée. L'utilisateur vit une expérience cross-canal continue mais les systèmes internes vivent dans des silos. La friction naît à chaque handoff entre canaux parce que le "contexte" de l'utilisateur ne voyage pas avec lui.

**Points de friction cross-canal identifiés**

| Friction | Canal concerné | Nature |
|---------|---------------|--------|
| L'agent du chat ne voit pas l'expédition | App mobile → Chat web | Données comportementales de l'app non accessibles depuis le chat web |
| Numéro de commande + informations reposaisies au téléphone | Chat web → Téléphone | Historique du chat non transmis à l'agent téléphone |
| Délai de 4 heures pour résolution | Système global | Absence de procédure d'escalade urgente pour les litiges en cours de livraison |

**Cause structurelle**

La cause racine n'est pas technique au sens de "l'interface est mauvaise" — c'est l'absence d'un objet de données partagé entre tous les canaux : le "contexte de la session utilisateur". Quand la responsable logistique contacte le chat, le système ne sait pas qu'elle est en train de consulter l'expédition #X sur l'app mobile. Quand elle appelle, l'agent téléphone ne voit pas que le chat a déjà documenté le problème.

La solution n'est pas une meilleure interface — c'est un CRM intégré visible sur tous les canaux, avec une "fiche de contexte" qui capture ce que l'utilisateur vient de faire, quel que soit le canal.

**KPIs impactés**

| KPI UX | KPI Business |
|--------|-------------|
| Customer Effort Score — CES (actuellement 4,1/7) | Coût moyen d'une interaction support (multiplié par le nombre de répétitions) |
| Taux de résolution au premier contact | Churn B2B lié aux frictions de service |
| NPS B2B (décideur) | Taux d'escalade inter-canal |

**Feedback itératif — changement de paradigme**

> La friction cross-canal naît dans les systèmes d'information, pas dans les interfaces. Résoudre un problème de handoff, c'est résoudre un problème d'architecture, pas un problème de design.

---

#### Correction Exercice 2

**Modèle mental attendu**

Ajouter des canaux n'est pas une stratégie omnicanale — c'est une stratégie multicanale. Le problème identifié n'est pas l'absence de canaux (il y en a déjà 4) mais l'absence de cohérence entre eux. Ajouter un 5ème canal sans résoudre le problème de coordination crée un 5ème silo.

**Ce qui ne va pas**

| Décision | Problème |
|---------|---------|
| Ajouter un chat mobile | Crée un 3ème canal de texte (chat web + chat mobile + email) sans résoudre l'absence de contexte partagé entre eux |
| Ajouter un bot téléphonique en premier niveau | Allonge la durée avant d'atteindre un agent humain — aggrave la frustration des clients qui ont un problème urgent |
| Appeler ça une "stratégie omnicanale" | Confusion entre multicanal (multiplier les points de contact) et omnicanal (unifier le contexte entre les points de contact) |

**Impact sur les KPIs**

| KPI | Impact prévu | Réalité probable |
|-----|-------------|-----------------|
| Nombre de canaux disponibles | +2 (positif en apparence) | Augmentation des silos et des points de friction |
| CES global | Objectif : baisse | Probable stagnation ou hausse si les nouveaux canaux ne partagent pas le contexte |
| Coût de support | Objectif : baisse (bot téléphonique) | Probable hausse si le bot ralentit la résolution et génère des escalades |
| Satisfaction client B2B | Objectif : hausse | Risque de dégradation si l'expérience de transition reste identique |

**Ce qu'il faut faire à la place**

Investir dans l'unification du contexte entre canaux existants avant d'en créer de nouveaux :
1. CRM unique visible de tous les agents sur tous les canaux
2. Transmission automatique de l'historique de contact à chaque escalade
3. Identifier l'expédition consultée par l'utilisateur et la pré-renseigner dans l'interface de support

**Feedback itératif — changement de paradigme**

> L'omnicanalité ne se construit pas en ajoutant des canaux — elle se construit en unifiant le contexte de l'utilisateur à travers les canaux existants.

---

#### Correction Exercice 3

**Modèle mental AVANT de commencer**

Un CES élevé (4,1 / 7, soit élevé en termes d'effort) est coûteux à deux niveaux : il dégrade la satisfaction et il augmente le coût du service (chaque friction génère un contact supplémentaire). Prioriser les interventions selon deux critères simultanés : l'impact sur le CES (magnitude de la friction) × le volume (fréquence de la transition).

**Priorisation des 5 transitions**

| Transition | Volume | CES | Score priorité (Volume × CES) | Priorité |
|-----------|--------|-----|-------------------------------|---------|
| App mobile → Chat web | 38 % | 5,8 | **22,0** | **1** |
| Chat web → Téléphone | 24 % | 6,1 | **14,6** | **2** |
| Email → Téléphone | 18 % | 5,9 | 10,6 | 3 |
| Plateforme web → Email | 12 % | 4,2 | 5,0 | 4 |
| Téléphone → Plateforme web | 8 % | 3,9 | 3,1 | 5 |

**Transition 1 — App mobile → Chat web (Priorité absolue)**

*Problème* : L'agent du chat ne voit pas l'expédition que le client consultait sur l'app.

*Solution systémique* :
- Implémenter un mécanisme de "contexte partagé" : quand un utilisateur ouvre le chat depuis l'app mobile, transmettre automatiquement à l'agent l'identifiant de l'expédition en cours de consultation, le dernier statut affiché et les 3 dernières actions effectuées sur l'app
- Interface agent : afficher une carte de contexte en haut du chat ("Ce client consulte actuellement l'expédition #EXP-2024-0847 — statut : Délai de livraison signalé")
- Ne pas demander à l'utilisateur de "décrire le problème" si le contexte est déjà visible — pré-renseigner le premier message du chat avec le contexte automatique

*Interface utilisateur* :
- Bouton "Obtenir de l'aide sur cette expédition" dans l'app mobile — ouvre le chat avec le contexte pré-chargé
- Confirmation visible côté utilisateur : "L'agent voit votre expédition #EXP-2024-0847"

**Transition 2 — Chat web → Téléphone (Escalade)**

*Problème* : L'agent téléphonique demande de tout réexpliquer, l'historique du chat est perdu.

*Solution systémique* :
- À la fermeture d'une session de chat non résolue, générer automatiquement un résumé du chat (numéro de dossier, problème décrit, solutions tentées, statut) et le lier à l'identifiant client dans le CRM
- Interface agent téléphonique : afficher le résumé du dernier contact dès la reconnaissance du numéro client
- Formuler un script d'entrée pour les agents : "Bonjour, je vois que vous avez été en contact sur le chat à 10h20 concernant l'expédition #EXP-2024-0847 — je reprends votre dossier."
- Option "appel prioritaire" depuis le chat pour les litiges urgents (livraison en cours) — avec transmission automatique du contexte

**KPIs de validation**

| KPI UX | KPI Business |
|--------|-------------|
| CES par transition (objectif : < 3 / 7 sur les 2 transitions prioritaires) | Coût moyen par résolution (objectif : -25 % via réduction des répétitions) |
| Taux de résolution au premier contact (objectif : +30 %) | Taux de churn B2B lié aux litiges de livraison (objectif : -15 %) |
| Satisfaction post-interaction (CSAT) | Délai moyen de résolution de litige (objectif : < 2h pour les urgences) |

**Dimension éthique et inclusive**

- **Accessibilité linguistique** : *LogiTrack* sert des clients B2B dont certains responsables logistiques sont non-natifs en français (entreprises internationales, sous-traitants). La transmission de contexte systémique est encore plus critique quand une barrière linguistique existe — devoir tout réexpliquer dans une deuxième langue est une friction doublée.
- **Équité de niveau de service** : analyser si les clients les plus petits (PME avec moins de ressources) ont un CES plus élevé que les grands comptes. Si le niveau de service dépend implicitement du volume de contrat, les petits clients vivent une expérience discriminatoire.
- **Droit à un canal humain** : le bot de premier niveau téléphonique ne doit pas bloquer l'accès à un agent humain pour les urgences réelles. Toujours proposer une sortie vers un agent dans les 60 secondes pour les litiges actifs.

**Feedback itératif — changement de paradigme**

> Résoudre un problème de transition cross-canal, c'est résoudre un problème de données partagées entre systèmes — pas ajouter un nouveau point de contact.

---

## Concept 3 — Design de dashboard complexe

### Contexte du cas

**Produit** : *CareBoard* — un dashboard de suivi des patients pour les équipes infirmières et médicales dans des services hospitaliers. L'outil affiche en temps réel les données de 20 à 40 patients : constantes vitales, traitements en cours, alertes, tâches à effectuer, résultats d'analyses, et notes de suivi. Le service est utilisé en rotation par des infirmières, des médecins et des aides-soignants, avec des droits d'accès différents selon les rôles. Depuis le déploiement, les équipes signalent : "trop d'alertes", "on ne sait plus où regarder", "on manque des informations critiques parce qu'elles sont noyées".

---

### Exercice 1 — Traduction mentale

Une infirmière de nuit décrit son expérience avec *CareBoard* :

> "Quand je prends mon service à 21h, je dois évaluer l'état de 30 patients en moins de 15 minutes. Le dashboard affiche tout — les constantes, les médicaments, les analyses, les notes, les alertes. Tout est rouge ou orange. Je ne sais plus ce qui est vraiment urgent. Hier soir, j'ai raté une alerte sur la glycémie d'un patient parce qu'elle était au même niveau visuel que 15 autres alertes moins importantes."

**Question** : Comment aborderais-tu ce problème ? Quel est le principe de design fondamental qui est violé ici ? Quelle serait ta première action concrète pour améliorer l'expérience sans modifier les données affichées ?

---

### Exercice 2 — Piège de paradigme

L'équipe IT de l'hôpital analyse les retours sur *CareBoard* et propose :

> "On va ajouter un panneau de filtres avancé pour que chaque soignant puisse personnaliser ce qu'il voit. On va aussi ajouter un bouton 'Voir tout' et un bouton 'Résumé' pour donner le choix. Chaque médecin aura sa vue et chaque infirmière aussi."

**Question** : Qu'est-ce qui ne va pas dans cette solution ? Pourquoi déléguer la personnalisation à l'utilisateur est-il problématique dans ce contexte précis ? Quels KPIs et risques sont en jeu ?

---

### Exercice 3 — Mini-cas réel

L'équipe de *CareBoard* doit redéfinir la hiérarchie des alertes et l'architecture d'information du dashboard pour le service de soins intensifs. Les données disponibles sont :

**Volume d'alertes par type sur 30 jours :**
- Alertes constantes critiques (fréquence cardiaque, saturation, tension hors seuil critique) : 312
- Alertes médicaments (heure de prise, dose à vérifier) : 1 847
- Alertes analyses (résultats disponibles, valeurs hors normes) : 923
- Alertes administratives (dossier incomplet, signature manquante) : 2 341
- Rappels de soins (toilette, mobilisation, repas) : 3 102
- Alertes équipement (batterie faible, niveau perfusion) : 489

**Observation terrain :** les infirmières désactivent en masse les notifications sonores à cause de la surcharge. Résultat : elles ratent des alertes critiques.

**Question** : Décris ton modèle mental AVANT de commencer. Classe ces 6 types d'alertes en niveaux de priorité en justifiant chaque niveau. Conçois une architecture d'alerte à 3 niveaux. Propose le format visuel adapté à chaque niveau. Quels KPIs suivrais-tu ? Intègre une dimension éthique et inclusive.

---

### Corrections — Concept 3

#### Correction Exercice 1

**Modèle mental attendu**

L'infirmière de nuit est face à un problème de charge cognitive maximale dans un contexte de forte pression temporelle. La règle d'or des interfaces critiques : l'information la plus importante doit être la plus visible, sans que l'utilisateur ait à la chercher. Quand tout est urgent, rien n'est urgent.

**Principe de design fondamental violé**

La **hiérarchie visuelle** — le principe selon lequel l'importance d'une information doit être proportionnelle à sa prominance visuelle. Dans *CareBoard*, la hiérarchie est aplatie : une alerte critique (risque vital) et un rappel de toilette ont le même poids visuel. Le résultat est une interface qui crie partout et guide nulle part.

Corollaire : la **surcharge d'alertes** crée un phénomène d'**alert fatigue** — documenté dans la littérature médicale — où les soignants deviennent insensibles aux alertes à force d'en voir trop. C'est une défaillance UX qui a des conséquences cliniques réelles.

**Première action concrète**

Sans modifier les données, réviser immédiatement la hiérarchisation visuelle des alertes :

1. Définir 3 niveaux d'alerte et 3 couleurs strictement dédiées :
   - **Rouge vif + son distinct** : risque vital immédiat (constantes critiques hors seuil dangereux)
   - **Orange + notification visuelle silencieuse** : action requise dans l'heure (médicament, résultat à examiner)
   - **Gris / texte standard** : information utile mais non urgente (rappels de soins, administratif)

2. Faire disparaître visuellement les alertes de niveau 3 de la vue principale — elles sont accessibles mais pas proéminentes.

3. Ajouter un indicateur synthétique en tête du tableau : "3 alertes critiques — 8 actions à effectuer dans l'heure" pour permettre le bilan en 5 secondes.

**KPIs impactés**

| KPI UX | KPI Business (et sécurité patient) |
|--------|-------------------------------------|
| Taux de détection des alertes critiques | Taux d'événements indésirables liés à une alerte manquée |
| Time-to-action sur les alertes critiques (objectif : < 2 min) | Temps moyen de prise en charge d'une alerte urgente |
| Taux de désactivation des notifications (signe d'alert fatigue) | Conformité aux protocoles de soins |

**Feedback itératif — changement de paradigme**

> Quand tout est rouge, rien n'est urgent. La hiérarchie visuelle est la première décision de design dans une interface critique.

---

#### Correction Exercice 2

**Modèle mental attendu**

Déléguer la configuration à l'utilisateur résout le problème du designer, pas celui de l'utilisateur. Dans un contexte médical d'urgence, demander à une infirmière de nuit de configurer ses filtres avant de prendre son service est un ajout de charge cognitive au mauvais moment. Et si elle oublie de configurer ? Si elle efface accidentellement une alerte ? La personnalisation dans les interfaces critiques est un transfert de responsabilité, pas une solution.

**Ce qui ne va pas**

| Problème | Explication |
|---------|-------------|
| Personnalisation = charge cognitive ajoutée | En soins intensifs, le temps consacré à configurer l'outil est du temps retiré aux patients |
| Risque de configuration sous-optimale | Une infirmière qui cache par erreur une catégorie d'alertes peut manquer des informations critiques |
| Incohérence entre soignants | Si chaque utilisateur a sa vue, le passage de relais entre équipes devient problématique — "moi je voyais ça, toi tu ne le voyais pas" |
| "Voir tout" aggrave le problème | Permettre de "tout voir" est exactement le problème initial — l'utilisateur se retrouve submergé |
| La solution doit être éditoriale, pas configurable | La hiérarchie des alertes médicales est une décision clinique et UX conjointe, pas un choix personnel |

**Risques en jeu**

| Risque | Niveau |
|--------|--------|
| Alerte critique manquée suite à mauvaise configuration | Critique (sécurité patient) |
| Alert fatigue aggravée par la complexité des filtres | Élevé |
| Non-conformité réglementaire si des données critiques peuvent être masquées | Élevé |
| Engagement des équipes médicales dans la configuration (temps) | Moyen |

**KPIs impactés négativement par cette solution**

- Taux de détection des alertes critiques : risque de baisse si des alertes sont accidentellement masquées
- Cohérence des informations à la passation de service : risque de confusion entre équipes
- SUS de l'outil : la complexité de configuration augmente la charge perçue

**Feedback itératif — changement de paradigme**

> Dans une interface critique, la personnalisation est un transfert de responsabilité vers l'utilisateur — elle doit être utilisée avec une extrême prudence, voire pas du tout pour les données de sécurité.

---

#### Correction Exercice 3

**Modèle mental AVANT de commencer**

Dans un contexte de soins intensifs, la hiérarchisation n'est pas un exercice de design — c'est un exercice clinique et éthique. La mauvaise hiérarchie a des conséquences sur la sécurité des patients. La méthodologie : cartographier les alertes par conséquence d'inaction (que se passe-t-il si cette alerte est manquée pendant 5 minutes ? 30 minutes ? 2 heures ?), pas par volume ou par fréquence.

**Classification des 6 types d'alertes par niveau de priorité**

| Niveau | Type d'alerte | Volume mensuel | Conséquence d'une alerte manquée | Justification |
|--------|--------------|----------------|----------------------------------|---------------|
| **CRITIQUE (Niveau 1)** | Constantes vitales critiques | 312 | Risque vital immédiat — conséquences irréversibles en minutes | Tolérance zéro — aucune alerte de ce type ne peut être ratée |
| **URGENT (Niveau 2)** | Alertes équipement (perfusion, batterie) | 489 | Conséquences sérieuses en 15 à 60 minutes | Action requise rapidement mais pas immédiatement |
| **URGENT (Niveau 2)** | Alertes analyses (valeurs hors normes) | 923 | Conséquences cliniques importantes mais avec une fenêtre d'action | Nécessite attention dans l'heure |
| **IMPORTANT (Niveau 3)** | Alertes médicaments | 1 847 | Conséquences potentielles si répétées — délai tolérable de quelques heures | Important mais pas urgent à la seconde |
| **INFORMATION (Niveau 4)** | Rappels de soins | 3 102 | Pas de conséquence immédiate — planifiable | Informatif, pas interruptif |
| **INFORMATION (Niveau 4)** | Alertes administratives | 2 341 | Aucune conséquence clinique immédiate | Ne doit pas interrompre les soins |

**Architecture d'alerte à 3 niveaux**

**Niveau 1 — CRITIQUE (risque vital)**
- Volume : 312 / mois ≈ 10 / jour
- Format visuel : bandeau rouge clignotant en haut du dashboard avec le nom du patient et la mesure concernée ("Jean D. — Saturation O2 : 82 %")
- Son : alarme distincte et reconnaissable, non désactivable
- Persistance : reste visible jusqu'à accusé de réception explicite par un soignant identifié
- Action : accusé de réception obligatoire + horodatage automatique

**Niveau 2 — URGENT (action dans l'heure)**
- Volume : 489 + 923 = 1 412 / mois ≈ 47 / jour
- Format visuel : icône orange dans la carte du patient concerné, visible sans être interruptif
- Son : notification discrète (1 bip) — non répétée
- Vue synthèse : compteur "X alertes urgentes" visible en permanence en haut du tableau
- Action : clic pour détail et prise en charge

**Niveau 3 — PLANIFIABLE (action dans la journée)**
- Volume : 1 847 + 3 102 + 2 341 = 7 290 / mois ≈ 243 / jour
- Format visuel : indicateur gris / texte standard dans la vue détail du patient — pas dans la vue liste
- Son : aucun
- Vue liste : pas visible (accessible uniquement en cliquant sur le patient)
- Action : consultation à la demande

**Règle critique sur les notifications sonores :**

Les soignants désactivent les sons en raison de la surcharge — signal d'alert fatigue. La solution n'est pas de rendre les sons incontournables mais de réduire le volume d'alertes sonores au niveau 1 uniquement (10 / jour au lieu de 8 000 / mois). Le son retrouve son sens comme signal d'urgence absolue.

**KPIs à suivre**

| KPI UX | KPI Sécurité & Business |
|--------|--------------------------|
| Taux de détection des alertes niveau 1 (objectif : 100 %) | Taux d'événements indésirables liés à une alerte manquée |
| Time-to-action sur les alertes niveau 1 (objectif : < 2 minutes) | Taux de conformité aux protocoles d'alerte |
| Taux de désactivation des sons (objectif : 0 % pour les niveaux 1-2) | Satisfaction des équipes soignantes (eNPS spécifique à l'outil) |
| Charge cognitive perçue (SUS adapté au contexte clinique) | Réduction du volume d'alertes sonores (impact sur le stress des équipes) |

**Dimension éthique et inclusive**

- **Responsabilité clinique** : la hiérarchisation des alertes dans un outil médical est une décision qui engage la responsabilité médicale et juridique de l'établissement. Elle doit être co-construite avec les médecins référents, les infirmières et les responsables qualité — pas décidée seule par une équipe produit.
- **Accessibilité sonore** : les alertes ne doivent pas reposer uniquement sur le son (soignants malentendants) ni uniquement sur la couleur (daltonisme). Chaque niveau d'alerte doit être identifiable par au moins 2 modalités distinctes (son + forme, couleur + icône, texte + couleur).
- **Équité de surveillance** : s'assurer que l'architecture d'alerte ne génère pas de biais implicites — par exemple, des patients ayant moins de données connectées (moins d'équipements de monitoring) ne doivent pas recevoir moins d'attention par construction du système.

**Feedback itératif — changement de paradigme**

> Dans une interface critique, la hiérarchie d'alerte n'est pas un choix visuel — c'est une décision clinique et éthique qui engage la sécurité des patients.

---

## Concept 4 — Workflows métiers B2B

### Contexte du cas

**Produit** : *HireFlow* — un outil SaaS RH de gestion des recrutements pour les PME (50 à 500 salariés). L'outil gère le workflow complet du recrutement : création des offres, gestion des candidatures, planification des entretiens, évaluations collaboratives, validation de l'offre, et intégration dans le SIRH. Il est utilisé par 3 rôles : **Recruteur** (opérationnel), **Manager** (évalue les candidats de son équipe), **Administrateur RH** (paramètre les workflows, valide les décisions finales, accède aux données globales). Le taux d'adoption 6 mois après déploiement est de 54 % — l'équipe attendait 80 %.

---

### Exercice 1 — Traduction mentale

Un manager opérationnel (rôle Manager dans *HireFlow*) se plaint :

> "Je reçois un email pour évaluer un candidat, je clique, j'arrive dans l'outil, et je dois chercher où est le CV, où sont les notes des autres entretiens, où je dois saisir mon évaluation. À chaque fois, je perd 5 minutes avant de commencer. Et le formulaire d'évaluation me demande 12 critères — certains je ne sais même pas ce que ça veut dire pour mon métier."

**Question** : Comment aborderais-tu ce problème ? Qu'est-ce que cette plainte révèle sur la conception du workflow et du formulaire d'évaluation ? Quelle est la première action à prendre ?

---

### Exercice 2 — Piège de paradigme ❌

L'équipe produit de *HireFlow* analyse le faible taux d'adoption. Elle identifie que les Managers n'utilisent que 20 % des fonctionnalités disponibles dans leur rôle. Sa conclusion :

> "Le problème, c'est que les Managers ne connaissent pas l'outil. On va créer une série de tutoriels vidéo de 3 à 5 minutes pour chaque fonctionnalité et les envoyer par email. On va aussi ajouter des tooltips sur chaque champ du formulaire d'évaluation."

**Question** : Qu'est-ce qui ne va pas dans ce diagnostic et dans cette solution ? Quels KPIs seraient affectés ? Y a-t-il un dark pattern potentiel dans cette approche ?

---

### Exercice 3 — Mini-cas réel

L'équipe de *HireFlow* a mappé le workflow complet d'une évaluation Manager. Voici les étapes telles qu'elles existent actuellement dans l'outil :

1. Réception d'un email de notification avec un lien vers *HireFlow*
2. Connexion à *HireFlow* (saisie des identifiants)
3. Navigation vers le menu "Recrutements en cours"
4. Sélection du poste concerné
5. Clic sur "Candidatures"
6. Sélection du bon candidat parmi la liste
7. Consultation du CV (onglet "Documents")
8. Consultation des notes des entretiens précédents (onglet "Historique")
9. Retour sur l'onglet "Évaluation"
10. Remplissage d'un formulaire de 12 critères (notation de 1 à 5 + commentaire libre obligatoire pour chaque critère)
11. Validation
12. Fermeture et retour au workflow principal

**Durée moyenne observée : 18 minutes. Durée attendue par les Managers : < 5 minutes.**

**Question** : Décris ton modèle mental AVANT de commencer. Identifie les étapes à forte friction. Propose une refonte du workflow (pas l'interface graphique — le flux logique) qui atteint la cible de < 5 minutes sans supprimer les informations nécessaires à une bonne décision. Quels KPIs suivrais-tu ? Intègre une dimension éthique et inclusive.

---

### Corrections — Concept 4

#### Correction Exercice 1

**Modèle mental attendu**

Le Manager dans *HireFlow* n'est pas un utilisateur principal de l'outil — c'est un utilisateur périphérique qui intervient de façon ponctuelle dans un workflow qu'il n'a pas initié. Pour ce type d'utilisateur, chaque interaction doit être autonome et auto-explicative. Le contexte ne peut pas être supposé — il doit être fourni.

**Ce que la plainte révèle**

| Problème identifié | Implication de design |
|------------------|----------------------|
| "Je dois chercher où est le CV" | L'email de notification ne transporte pas le contexte — le Manager arrive dans l'outil sans atterrissage contextuel |
| "Je dois chercher les notes des autres entretiens" | L'interface ne regroupe pas les informations pertinentes pour la tâche du Manager — elles sont dispersées en onglets |
| "5 minutes avant de commencer" | Le workflow de navigation est conçu pour les Recruteurs (utilisateurs quotidiens) pas pour les Managers (utilisateurs ponctuels) |
| "12 critères, certains incompréhensibles" | Le formulaire est générique — les critères n'ont pas été adaptés au métier du Manager ni à son niveau d'expertise RH |

**Ce que révèle le formulaire de 12 critères**

Un formulaire de 12 critères avec commentaire obligatoire pour chaque représente environ 15 à 20 minutes de travail — bien au-delà de ce qu'un Manager opérationnel peut consacrer à chaque candidat entre deux réunions. Soit les critères sont trop nombreux, soit tous ne sont pas pertinents pour ce rôle, soit le format texte obligatoire n'est pas adapté.

**Première action : user testing contextuel**

Observer 5 Managers en situation réelle d'évaluation : où s'arrêtent-ils ? Quels critères laissent-ils vides ? À quelle étape perdent-ils du temps ? Quel est l'ordre naturel dans lequel ils veulent consulter l'information ?

**KPIs impactés**

| KPI UX | KPI Business |
|--------|-------------|
| Time on Task pour l'évaluation Manager (actuellement : 18 min, cible : < 5 min) | Taux d'adoption par le rôle Manager (actuellement : faible) |
| Taux de complétion des formulaires d'évaluation | Qualité des données d'évaluation (évaluations partielles = données inutilisables) |
| SUS par rôle (Manager vs Recruteur) | Délai moyen du processus de recrutement (bloqué par les évaluations lentes) |

**Feedback itératif — changement de paradigme**

> Un outil B2B multi-rôles doit concevoir l'expérience séparément pour chaque rôle — notamment les utilisateurs périphériques qui interagissent rarement mais dont les actions bloquent le workflow entier.

---

#### Correction Exercice 2

**Modèle mental attendu**

"Les utilisateurs n'utilisent que 20 % des fonctionnalités" n'est pas un problème de connaissance — c'est peut-être un problème de pertinence. Si les Managers n'utilisent que 20 % des fonctionnalités, c'est peut-être parce que 80 % ne sont pas adaptées à leur usage. Des tutoriels sur des fonctionnalités dont l'utilisateur n'a pas besoin n'améliorent pas l'adoption — ils augmentent la charge cognitive.

**Ce qui ne va pas**

| Problème | Explication |
|---------|-------------|
| Diagnostic incorrect | 20 % d'utilisation n'est pas un problème de connaissance — c'est potentiellement une adéquation faible entre les fonctionnalités et les besoins réels du rôle Manager |
| Solution = plus de formation | La formation compense une mauvaise UX à court terme — elle ne la résout pas. Un Manager en réunion entre deux entretiens ne regardera pas une vidéo de 5 minutes |
| Tooltips sur chaque champ | Des tooltips sur 12 champs de formulaire ajoutent de l'information à une interface déjà surchargée — c'est de la documentation inline qui masque un problème de clarté de design |
| Cause-effet inversé | Si les Managers n'utilisent pas les fonctionnalités, la réponse est de comprendre pourquoi — pas de leur expliquer comment faire quelque chose qu'ils ont choisi de ne pas faire |

**Dark pattern potentiel ❌**

Forcer l'usage d'un outil sous-adapté en ajoutant de la documentation et des tutoriels, sans remettre en question l'adéquation de l'outil au besoin — c'est une forme de dark pattern organisationnel : rendre l'outil plus "instructé" pour justifier son maintien plutôt que de l'améliorer. L'utilisateur est contraint de s'adapter à l'outil plutôt que l'inverse.

**KPIs qui révèlent le vrai problème**

| KPI | Interprétation |
|-----|---------------|
| Taux de complétion des évaluations Manager | Si < 70 % → le workflow est trop long ou trop complexe |
| Délai moyen entre réception de la notification et soumission de l'évaluation | > 48h → le Manager reporte parce que c'est trop lourd |
| Taux d'évaluations partielles (champs vides) | > 30 % → certains critères ne sont pas adaptés ou compréhensibles |
| NPS interne des Managers sur l'outil | Score bas = problème d'usage, pas de connaissance |

**Feedback itératif — changement de paradigme**

> Former les utilisateurs à un outil mal adapté n'est pas de la pédagogie — c'est un aveu que l'outil ne fait pas le travail à la place du design.

---

#### Correction Exercice 3

**Modèle mental AVANT de commencer**

18 minutes pour une tâche attendue en 5 minutes signifie un ratio d'effort de 3,6x. Dans un outil B2B, chaque minute de friction supplémentaire est une minute retirée au travail réel de l'utilisateur. Le problème n'est pas la durée intrinsèque — c'est le rapport entre la valeur perçue de la tâche et l'effort demandé.

La méthode : identifier les étapes à valeur nulle (navigation, connexion, recherche) qui peuvent être supprimées ou automatisées, et les étapes à valeur réelle (consultation des informations, évaluation) qui peuvent être condensées et améliorées.

**Analyse des 12 étapes par type de valeur**

| Étape | Type | Valeur | Action |
|-------|------|--------|--------|
| 1 — Email de notification | Navigation | Zéro valeur directe | Rendre le lien dans l'email contextuel (lien direct vers la page d'évaluation pré-chargée) |
| 2 — Connexion à *HireFlow* | Navigation | Zéro valeur | SSO avec l'outil de communication interne (si disponible) ou lien de connexion one-click depuis l'email |
| 3 — Menu "Recrutements en cours" | Navigation | Zéro valeur | Supprimer — le lien dans l'email atterrit directement sur la candidature |
| 4 — Sélection du poste | Navigation | Zéro valeur | Supprimer — déjà connu via le lien |
| 5 — Clic "Candidatures" | Navigation | Zéro valeur | Supprimer — déjà connu via le lien |
| 6 — Sélection du candidat | Navigation | Zéro valeur | Supprimer — déjà connu via le lien |
| 7 — Consultation du CV (onglet) | Valeur réelle | Haute | Afficher le CV directement sur la page d'évaluation (split screen ou panel latéral) |
| 8 — Consultation des notes précédentes (onglet) | Valeur réelle | Haute | Afficher les notes précédentes en résumé sur la page d'évaluation |
| 9 — Retour sur l'onglet évaluation | Navigation | Zéro valeur | Supprimer — tout est sur la même page |
| 10 — Formulaire 12 critères + commentaire obligatoire | Valeur réelle | Variable | Réduire à 4-5 critères clés pour le rôle Manager + commentaire optionnel sur les critères rouges uniquement |
| 11 — Validation | Valeur réelle | Haute | Conserver |
| 12 — Retour workflow | Navigation | Zéro valeur | Confirmation de soumission + fermeture automatique |

**Workflow refondu**

**Avant** : 12 étapes, 18 minutes, 6 navigations inutiles

**Après** : 4 étapes, < 5 minutes

1. **Email → lien contextuel** : le Manager reçoit un email avec un bouton "Évaluer [Prénom Nom] pour le poste [Intitulé]". Un clic unique, connexion SSO, atterrissage direct sur la page d'évaluation.

2. **Page d'évaluation unifiée** (split screen ou layout en 3 colonnes) :
   - Colonne gauche : CV du candidat (scrollable)
   - Colonne centrale : résumé des entretiens précédents avec notations et points clés des autres évaluateurs (condensé en 5 lignes max)
   - Colonne droite : formulaire d'évaluation — 4 critères adaptés au rôle du Manager (ex : "Adéquation au poste", "Esprit d'équipe", "Autonomie perçue", "Motivation") + 1 champ commentaire libre optionnel + recommandation binaire ("Recommande" / "Ne recommande pas")

3. **Validation en 1 clic** avec confirmation visuelle.

4. **Fermeture automatique** après validation + email récapitulatif à l'équipe RH.

**Gain estimé** : élimination de 6 étapes de navigation pure → < 5 minutes en conditions normales.

**KPIs à suivre**

| KPI UX | KPI Business |
|--------|-------------|
| Time on Task pour l'évaluation Manager (objectif : < 5 min) | Taux d'adoption par le rôle Manager (objectif : > 80 %) |
| Taux de complétion des évaluations (objectif : > 90 %) | Délai moyen du processus de recrutement (objectif : -20 %) |
| SUS spécifique au rôle Manager (objectif : > 75 / 100) | Qualité des données RH (évaluations complètes et exploitables) |
| Délai entre notification et soumission (objectif : < 24h) | Satisfaction des managers (eNPS spécifique) |

**Dimension éthique et inclusive**

- **Biais dans les critères d'évaluation** : les 4 critères proposés dans le formulaire Manager ne sont pas neutres. Des critères comme "Esprit d'équipe" ou "Autonomie perçue" peuvent être interprétés différemment selon les préjugés culturels, de genre ou d'âge de l'évaluateur. ❌ Dark pattern RH : des formulaires d'évaluation non structurés laissent une latitude qui amplifie les biais implicites. La solution : ancrer chaque critère avec des comportements observables précis (behaviorally anchored rating scales — BARS).
- **Traçabilité des évaluations** : dans le cadre du RGPD et des droits des candidats, les évaluations doivent être traçables, auditables et potentiellement communicables au candidat sur demande. Concevoir l'interface d'évaluation avec cet enjeu en tête — ne pas laisser les évaluateurs saisir des commentaires discriminatoires que le système permettrait d'archiver sans contrôle.
- **Accessibilité du formulaire** : le formulaire d'évaluation doit être utilisable par des managers en situation de handicap (moteur, visuel). Les champs de saisie doivent respecter les standards WCAG 2.1 AA, avec des labels explicites et des zones de clic suffisamment larges.
- **Équité inter-candidats** : si le workflow Manager est trop long et que certains managers ne complètent pas leurs évaluations, certains candidats ont des dossiers incomplets et sont désavantagés dans le processus de sélection — sans que cela soit intentionnel. La fluidité du workflow est une question d'équité envers les candidats.

**Feedback itératif — changement de paradigme**

> Dans un workflow B2B multi-rôles, concevoir pour l'utilisateur périphérique (celui qui intervient rarement mais dont l'action est critique) est au moins aussi important que concevoir pour l'utilisateur principal.

---

## Récapitulatif des changements de paradigmes

| Concept | Paradigme abandonné ❌ | Paradigme adopté ✅ |
|---------|----------------------|---------------------|
| Service blueprint | "Le service blueprint, c'est une user journey map améliorée" | "Le blueprint cartographie les coulisses autant que la scène — c'est un outil organisationnel autant qu'un outil UX" |
| Expérience cross-canal | "Ajouter des canaux = meilleure expérience omnicanale" | "L'omnicanalité se construit en unifiant le contexte entre canaux — pas en multipliant les points de contact" |
| Dashboard complexe | "Un bon dashboard montre toutes les données disponibles" | "Un bon dashboard a un point de vue — il hiérarchise et guide, il n'expose pas" |
| Workflows métiers B2B | "Les utilisateurs B2B peuvent gérer des interfaces complexes, ils seront formés" | "La formation compense une mauvaise UX — elle ne la résout pas. Le design doit faire le travail à la place de la formation" |
