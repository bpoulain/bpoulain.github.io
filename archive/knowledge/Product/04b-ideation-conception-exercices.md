# Section 4 — Idéation & Conception UX — Exercices

> **Fichier exercices avec corrections.** Ce fichier complète la théorie de la Section 4. Chaque concept est travaillé en trois exercices progressifs : traduction mentale, piège de paradigme, mini-cas réel. Les corrections incluent modèle mental attendu, raisonnement UX/Product, KPIs impactés, erreurs classiques et biais cognitifs.

---

## Table des matières

1. [Concept 1 — Architecture de l'information](#concept-1--architecture-de-linformation)
2. [Concept 2 — Wireframing & prototypage rapide](#concept-2--wireframing--prototypage-rapide)
3. [Concept 3 — UX Writing & microcopy](#concept-3--ux-writing--microcopy)
4. [Concept 4 — Conception pour la charge cognitive](#concept-4--conception-pour-la-charge-cognitive)

---

---

# Concept 1 — Architecture de l'information

> **Périmètre** : arborescence, navigation, labelling, card sorting, tree testing

---

## BLOC 1 — Exercices (sans correction)

---

### Exercice 1.1 — Traduction mentale

**Contexte :**
Tu rejoins l'équipe produit d'une mutuelle de santé qui veut refondre son espace client en ligne. L'application actuelle propose 47 rubriques dans le menu principal. Les utilisateurs se plaignent de ne pas trouver leurs remboursements. Le taux de contact au support pour "Je ne trouve pas mon relevé de remboursement" atteint 23 % des appels entrants.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Décris ton raisonnement avant d'avoir la correction. Quels seraient tes premiers réflexes ? Quelle méthode choisirais-tu pour comprendre comment les utilisateurs organisent mentalement ces 47 rubriques ? Pourquoi ?

---

### Exercice 1.2 — Piège de paradigme

**Contexte :**
L'équipe produit d'une plateforme e-commerce B2B (acheteurs professionnels) a restructuré sa navigation en se basant sur l'organigramme interne de l'entreprise :

- **Rubrique "Approvisionnement"** → catalogues fournisseurs
- **Rubrique "Finance"** → factures, bons de commande
- **Rubrique "Logistique"** → suivi des livraisons
- **Rubrique "Contractuel"** → contrats-cadres, conditions tarifaires
- **Rubrique "Support"** → tickets d'aide

Lors des tests utilisateurs post-lancement, 68 % des acheteurs ne trouvent pas leurs factures au premier essai. Le taux de rebond sur la page d'accueil augmente de 34 %.

**Question :**
Qu'est-ce qui ne va pas ici ? Identifie le problème fondamental, nomme le biais ou l'anti-pattern en jeu. Quels KPIs seraient affectés à court et long terme ? Y a-t-il une dimension éthique ou inclusive à signaler ?

---

### Exercice 1.3 — Mini-cas réel

**Contexte produit :**
Tu es UX designer pour **CareConnect**, une application de coordination de soins à domicile. Les utilisateurs sont : (1) des **aidants familiaux** (souvent peu à l'aise avec le numérique, 50–75 ans), (2) des **infirmiers libéraux** (mobiles, sur smartphone, entre deux visites), et (3) des **médecins coordinateurs** (bureau, desktop).

L'application actuelle est une liste plate de 60 fonctionnalités accessibles depuis un seul menu hamburger. Les aidants familiaux appellent le support en moyenne 4,2 fois dans leur premier mois d'utilisation.

**Objectifs business :**
- Réduire les appels support de 50 % en 6 mois
- Augmenter le taux de complétion des fiches patient à 85 % (actuellement 41 %)
- Obtenir un SUS ≥ 75 (actuellement 52)

**Ta mission :**
Décris ton modèle mental AVANT de commencer (comment tu représentes le problème). Explique comment tu structurerais la démarche d'architecture de l'information : méthodes, participants, livrables. Précise comment tu intègres les besoins des 3 profils différents sans créer 3 apps séparées. Quels KPIs suivrais-tu pour valider ta solution ? Quelles dimensions éthiques et inclusives sont en jeu ?

---

## BLOC 2 — Corrections

---

### Correction 1.1 — Traduction mentale

**Modèle mental attendu**
L'architecture de l'information ne se conçoit pas depuis l'intérieur (logique interne de l'entreprise) mais depuis l'extérieur (modèle mental des utilisateurs). 47 rubriques signifient que chaque service a probablement réclamé sa propre entrée de menu — c'est un symptôme organisationnel, pas une décision UX.

**Raisonnement UX/Product**
Le problème est un classique de la navigation "ego-centrique" : le menu reflète la structure de l'entreprise (pôle remboursements, pôle cotisations, pôle prévention…) plutôt que les tâches que les utilisateurs cherchent à accomplir ("Voir ce qui m'a été remboursé", "Comprendre ma prochaine cotisation", "Déclarer un sinistre").

**Méthode à choisir : Card Sorting ouvert**
- Imprime chaque rubrique actuelle sur une carte physique ou digitale (Maze, Optimal Workshop, Miro)
- Recrute 15 à 20 utilisateurs représentatifs (mix âges, mix profils — pensez aux seniors peu à l'aise avec le numérique)
- Demande-leur de regrouper les cartes comme ils le jugent logique, et de nommer leurs groupes eux-mêmes
- Analyse les dendrogrammes de résultats pour identifier les clusters naturels

**Pourquoi card sorting ouvert plutôt que fermé ?**
Le card sorting fermé impose des catégories existantes — on ne ferait que valider la structure actuelle, ce qui ne résoudrait pas le problème. Le card sorting ouvert révèle le modèle mental des utilisateurs sans leur imposer un cadre.

**Solution détaillée**
1. Card sorting ouvert → identifier 6 à 9 catégories naturelles
2. Reformuler le labelling avec les mots des utilisateurs (pas le jargon interne)
3. Tree testing sur la nouvelle arborescence proposée → valider que "Mes remboursements" est trouvable en moins de 3 clics
4. Test de navigation avec les 5 tâches les plus fréquentes selon les logs

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Taux de succès de navigation (task success rate) | Volume d'appels support (-23 % visé) |
| Temps moyen pour trouver un remboursement | Coût par contact support |
| Score SUS post-refonte | Taux de fidélisation des adhérents |
| Taux d'abandon de navigation | NPS de l'espace client |

**Erreurs classiques**
- Réduire à 15 rubriques sans faire de card sorting → on risque de regrouper sous des labels qui font sens pour l'équipe mais pas pour l'utilisateur
- Faire le card sorting uniquement avec des utilisateurs jeunes et technophiles → les seniors représentent une part majeure des adhérents d'une mutuelle
- Confondre card sorting et arborescence finale → le card sorting est une entrée de données, pas un livrable prêt à intégrer

**Correction du biais cognitif**
Biais du survivant : l'équipe produit ne voit que les utilisateurs qui *trouvent* leurs remboursements (ceux qui appellent et se plaignent) — les utilisateurs qui abandonnent silencieusement (churn passif) sont invisibles. Les logs de navigation révèlent l'abandon, les appels support révèlent la friction — les deux sont nécessaires.

**Améliorations possibles**
- Ajouter un moteur de recherche interne avec suggestion auto-complétion, qui absorbe les cas limites où même une bonne arborescence ne suffit pas
- Implémenter un "raccourci contextuel" sur la page d'accueil : "Votre dernier remboursement" affiché directement

**Changement de paradigme en 1 phrase**
Une bonne architecture de l'information se lit de l'extérieur vers l'intérieur : d'abord les mots et les tâches des utilisateurs, jamais la structure de l'entreprise.

---

### Correction 1.2 — Piège de paradigme

**Modèle mental attendu**
La navigation organisée selon l'organigramme interne est l'un des anti-patterns UX les plus répandus en B2B. Les utilisateurs ne pensent pas "Finance" — ils pensent "facture", "payer", "justificatif". Le problème n'est pas la mauvaise volonté de l'équipe, mais l'absence de méthode centrée utilisateur.

**Le problème fondamental : le modèle mental organisationnel**
L'équipe a projeté sa propre structure interne sur la navigation externe. C'est ce qu'on appelle l'**organisation ego-centrique** ou **navigation en silo organisationnel**. L'acheteur B2B qui cherche une facture ne sait pas (et ne devrait pas avoir à savoir) que dans cette entreprise, les factures relèvent du pôle Finance.

**Anti-pattern identifié : le menu-organigramme** ❌
Le menu reflète l'organisation interne plutôt que les flux de travail des utilisateurs. En B2B, les acheteurs ont des tâches précises et répétitives (passer commande, vérifier livraison, télécharger facture, contacter le fournisseur). La navigation doit refléter ces tâches, pas les départements.

**Dimension éthique et inclusive**
Les acheteurs juniors ou nouveaux dans le poste sont particulièrement pénalisés : ils n'ont pas encore le réseau interne pour savoir "à quel département ça correspond". Une navigation opaque crée une barrière invisible qui avantage les utilisateurs déjà experts et exclut les nouveaux entrants. En B2B, le turnover est réel — une mauvaise navigation ralentit l'onboarding de chaque nouvel acheteur.

**KPIs affectés**

| KPI UX | KPI Business |
|---|---|
| Taux de succès à la 1re tentative (findability) : 32 % → objectif 80 % | Taux de renouvellement de contrat (rétention B2B) |
| Taux de rebond : +34 % → signe d'abandon précoce | Coût d'acquisition vs. coût de rétention |
| Temps moyen pour télécharger une facture | Délai de paiement fournisseur (si facture introuvable → retard de paiement) |
| NPS acheteur (fidélisation plateforme) | Churn vers concurrent |
| SUS global de la plateforme | CAC (si les nouveaux acheteurs abandonnent l'onboarding) |

**Solution UX attendue**
Refondre la navigation autour de tâches fréquentes identifiées par analytics :
- "Passer une commande"
- "Suivre mes livraisons"
- "Mes documents" (factures, bons de commande, contrats — regroupés par document, pas par département)
- "Contacter un fournisseur"
- "Tableau de bord" (vue d'ensemble)

**Tree testing** pour valider que les 5 tâches les plus fréquentes sont trouvables en moins de 3 clics.

**Erreurs classiques**
- Croire que les utilisateurs B2B sont plus "experts" et donc tolèrent une navigation complexe → faux : un expert dans son métier n'est pas forcément expert de la navigation de votre plateforme
- Ne pas impliquer les acheteurs dans la refonte car "on connaît nos clients" → biais de connaissance (curse of knowledge)

**Changement de paradigme en 1 phrase**
En B2B comme en B2C, la navigation doit répondre à la question "Qu'est-ce que je veux faire ?" — jamais à "À quel département ça appartient ?"

---

### Correction 1.3 — Mini-cas réel (CareConnect)

**Modèle mental AVANT de commencer**
Le modèle mental à construire : trois rôles avec des contextes d'usage radicalement différents (mobilité, matériel, urgence, compétence numérique) qui partagent les mêmes données patient. Le risque principal est de concevoir pour l'utilisateur le plus technophile (infirmier ou médecin) et de laisser l'aidant familial — souvent le moins numérique mais le plus fréquent — dans l'incapacité d'utiliser l'app.

**Démarche recommandée**

**Étape 1 — Analyse quantitative des logs existants**
Avant toute méthode qualitative, analyser les données disponibles :
- Quelles fonctionnalités sont utilisées par chaque profil ?
- Où se produisent les abandons ?
- Quels chemins mènent aux 4,2 appels support mensuels des aidants ?

**Étape 2 — Card sorting différencié par profil**
Organiser 3 sessions de card sorting ouvert séparées (une par profil) :
- **Aidants familiaux** : session en personne si possible, facilitateur patient, durée allongée (90 min), explication verbale des regroupements encouragée
- **Infirmiers** : session digitale courte (45 min sur mobile), cartes limitées aux fonctionnalités mobiles
- **Médecins coordinateurs** : session desktop, focus sur vue agrégée des patients

**Étape 3 — Analyse croisée des résultats**
Identifier les fonctionnalités qui apparaissent dans les mêmes clusters pour les 3 profils (navigation universelle possible) vs. celles qui divergent totalement (nécessitent des vues personnalisées).

**Étape 4 — Architecture à vue unique + contextualisation par rôle**
Solution recommandée : une arborescence commune simplifiée (5 à 7 catégories max), avec une **personnalisation de la vue d'accueil par rôle** après connexion. L'aidant voit "Mes proches / Agenda des soins / Messagerie / Documents". L'infirmier voit "Mes patients du jour / Compte-rendus à rédiger / Urgences". Le médecin voit "Tableau de bord / Dossiers patients / Prescriptions". Les données sont les mêmes — seule la porte d'entrée est adaptée.

**Étape 5 — Tree testing de validation**
Tester les 5 tâches les plus critiques pour chaque profil :
- Aidant : "Trouver le prochain rendez-vous de votre mère avec l'infirmière"
- Infirmier : "Accéder au compte-rendu de la visite précédente pour Mme Durand"
- Médecin : "Voir les patients sans visite depuis plus de 7 jours"
Objectif : taux de succès ≥ 80 % sans aide au premier essai.

**Dimensions éthiques et inclusives**

- **Accessibilité numérique** : Les aidants familiaux (50–75 ans) peuvent avoir des troubles visuels légers, une motricité fine réduite, ou une anxiété numérique. Labels clairs, icônes accompagnées de texte, zones de tap suffisamment grandes (min. 44px), pas de gestes complexes (swipe imbriqué, double-tap).
- **Langue et littéracie** : Éviter tout jargon médical dans l'interface destinée aux aidants. "Ordonnance en cours" plutôt que "prescription active". Tester la compréhension des labels avec des utilisateurs réels, pas uniquement avec l'équipe.
- **Fracture numérique** : S'assurer que toutes les actions critiques ont un équivalent téléphonique documenté — l'app ne doit pas être le seul moyen d'accès aux soins.
- **Consentement et données de santé** : L'architecture doit rendre visible et compréhensible qui a accès à quelles données du patient. Un aidant ne doit pas pouvoir accéder aux données d'un patient pour lequel il n'a pas de mandat explicite.

**KPIs à suivre**

| KPI UX | Cible | KPI Business | Cible |
|---|---|---|---|
| SUS global | ≥ 75 (actuellement 52) | Volume d'appels support | −50 % en 6 mois |
| Taux de succès navigation (5 tâches critiques) | ≥ 80 % | Taux de complétion des fiches patient | 85 % (actuellement 41 %) |
| Temps moyen pour atteindre une tâche clé | < 20 secondes | Taux de rétention à 3 mois (aidants) | +25 % |
| Taux d'abandon de navigation | < 10 % | NPS par profil | ≥ 30 |
| Taux d'erreurs de navigation | < 5 % | Coût par contact support | −40 % |

**Erreurs classiques à éviter**
- Créer 3 applications séparées → coût de maintenance triple, données fragmentées, communication inter-profils impossible
- Faire valider l'arborescence uniquement par l'équipe médicale → biais de surexpertise, invisibilisation des aidants
- Ignorer les contextes d'usage (infirmier debout entre deux visites sur 4G) lors du tree testing → tester en conditions réelles ou simulées

**Changement de paradigme en 1 phrase**
L'architecture de l'information multi-profils ne crée pas plusieurs silos — elle adapte le point d'entrée tout en partageant une structure commune, comme un bâtiment avec plusieurs portes qui mènent aux mêmes pièces.

---

---

# Concept 2 — Wireframing & prototypage rapide

> **Périmètre** : choix de fidélité, ce qui doit/ne doit pas figurer, usage de l'IA pour génération

---

## BLOC 1 — Exercices (sans correction)

---

### Exercice 2.1 — Traduction mentale

**Contexte :**
Tu travailles sur une nouvelle fonctionnalité d'un outil de gestion de plannings pour des équipes de restauration. Le chef de projet te demande de "faire un prototype pour montrer à la direction" dans les 48 heures. Tu n'as pas encore fait de tests utilisateurs sur cette fonctionnalité.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Quel niveau de fidélité choisirais-tu pour ce prototype, et pourquoi ? Qu'est-ce que tu mettrais — ou ne mettrais pas — dedans ? Quels risques identifies-tu dans la demande telle qu'elle est formulée ?

---

### Exercice 2.2 — Piège de paradigme

**Contexte :**
Une startup EdTech a utilisé un outil IA de génération de wireframes (prompt-to-UI) pour concevoir en 2 heures l'ensemble de son application mobile de révision pour lycéens. L'équipe est satisfaite du résultat : "C'est beau, ça ressemble à une vraie app." Ils décident de passer directement au développement sans phase de test.

Lors du lancement en beta, les métriques sont mauvaises : taux de complétion du premier parcours de révision = 18 %, taux de désinstallation J+3 = 67 %.

**Question :**
Qu'est-ce qui ne va pas ici ? Nomme les anti-patterns et les erreurs de processus. Quels KPIs sont affectés ? Y a-t-il une dimension éthique spécifique au public cible (lycéens) à signaler ?

---

### Exercice 2.3 — Mini-cas réel

**Contexte produit :**
Tu es UX designer freelance pour **Linka**, une plateforme de mise en relation entre entreprises et freelances seniors (55–70 ans, reconversion ou complément de revenus). La direction veut créer un "tableau de bord freelance" permettant de gérer les missions, les devis, les factures et la disponibilité.

La date de lancement est dans 10 semaines. Tu as 3 semaines pour livrer une base de conception validée avant le passage aux développeurs.

**Objectifs business :**
- Onboarding complet (profil + première candidature) en moins de 15 minutes
- Taux de conversion "inscription → première mission acceptée" ≥ 30 % dans les 90 premiers jours
- NPS freelance ≥ 40 à 6 mois

**Ta mission :**
Décris ton modèle mental AVANT de commencer. Explique ta stratégie de prototypage : quels niveaux de fidélité tu utilises, dans quel ordre, pour quels objectifs. Précise ce que tu mets et ce que tu refuses de mettre dans chaque version. Comment tu utilises potentiellement l'IA pour accélérer sans dégrader la qualité UX ? Quels KPIs valident chaque étape ? Quelles dimensions éthiques et inclusives gouvernent tes choix de conception ?

---

## BLOC 2 — Corrections

---

### Correction 2.1 — Traduction mentale

**Modèle mental attendu**
Un prototype n'a pas une seule forme — son niveau de fidélité doit correspondre à son objectif. Un prototype pour convaincre la direction n'a pas le même niveau de détail qu'un prototype pour tester avec des utilisateurs. Le danger est de confondre les deux et de créer un prototype "beau" qui valide les opinions internes plutôt que les besoins utilisateurs.

**Raisonnement UX/Product**
La demande "montrer à la direction dans 48h" est une demande de communication, pas de validation UX. Il faut distinguer :
- **Prototype de concept** (basse fidélité, 2–4h) : Fait comprendre la logique de la fonctionnalité sans prétendre que c'est la solution finale
- **Prototype de communication** (fidélité moyenne à haute) : Fait vendre la direction, mais risque de créer un "effet d'ancrage" — l'équipe s'attache au prototype et résiste aux itérations futures
- **Prototype de test utilisateur** (fidélité adaptée à ce qu'on teste) : Conçu pour générer de l'apprentissage, pas pour impressionner

**Choix recommandé : wireframe basse/moyenne fidélité + annotation**
- Pas de couleurs finales, pas de vraies photos, pas de copie définitive
- Schéma fonctionnel des écrans clés avec annotations expliquant les intentions UX
- Accompagné d'un pitch verbal expliquant pourquoi cette fonctionnalité résout le problème

**Ce qui doit figurer**
- Les flux principaux (happy path)
- La logique de navigation entre les écrans
- Les zones d'action principales (CTA)
- Le contenu typique (texte placeholder ou données représentatives — pas lorem ipsum pour les zones critiques)

**Ce qui ne doit PAS figurer**
- Les couleurs et la typographie finale (la direction commenterait le style plutôt que la logique)
- Les états d'erreur complets (trop tôt, risque de noyer le message principal)
- Les cas limites et edge cases (à traiter plus tard)
- Des animations ou micro-interactions (fausse impression de complétude)

**Risques dans la demande**
- Effet de sunken cost : si la direction valide ce prototype, il devient difficile de le changer même si les tests utilisateurs révèlent des problèmes
- Confusion prototype/produit : la direction peut croire que c'est "presque fini" et pousser pour un lancement rapide
- Absence de données utilisateurs : on prototype une solution à un problème qu'on n'a pas encore vérifié avec des utilisateurs de restauration

**KPIs impactés**

| KPI UX | KPI Business |
|---|---|
| Nombre d'itérations nécessaires après tests | Time-to-market réel vs. estimé |
| Taux de succès des tâches lors des premiers tests | Coût des modifications post-développement |
| Pertinence des retours utilisateurs | Risque de lancement d'une feature non adoptée |

**Changement de paradigme en 1 phrase**
La fidélité d'un prototype doit correspondre à sa question : basse fidélité pour explorer, moyenne fidélité pour tester, haute fidélité pour communiquer — jamais l'inverse.

---

### Correction 2.2 — Piège de paradigme

**Modèle mental attendu**
Un outil IA de génération d'interface produit un résultat *visuellement cohérent* mais *fonctionnellement non validé*. La beauté de l'interface est une propriété esthétique, pas une preuve d'utilisabilité. Le taux de désinstallation à J+3 de 67 % indique que les utilisateurs ont essayé l'app, n'ont pas réussi à accomplir quelque chose de signifiant, et sont partis.

**Anti-patterns identifiés**

**1. Confusion apparence/utilisabilité** ❌
L'équipe a confondu "ça ressemble à une vraie app" avec "ça répond aux besoins des lycéens". Une interface peut être graphiquement impeccable et complètement inutilisable pour sa cible.

**2. Skip du test utilisateur** ❌
Passer du wireframe IA directement au développement supprime la boucle d'apprentissage fondamentale. Le test utilisateur n'est pas une phase optionnelle de validation — c'est le moment où on découvre ce qu'on ne sait pas encore.

**3. Confier la conception à l'IA sans brief utilisateur** ❌
Un outil prompt-to-UI génère une interface générique à partir de patterns existants. Il n'a aucune connaissance des lycéens de cette startup, de leurs habitudes d'étude, de leurs contextes d'usage (transport, chambre, 10 minutes avant un cours), ni de leurs modèles mentaux de la "révision".

**4. Ignorer le public spécifique — dimension éthique** ❌
Les lycéens sont des mineurs. Plusieurs dimensions éthiques s'appliquent :
- **Attention et addiction** : Les mécanismes de gamification (streaks, récompenses, notifications poussées) peuvent créer des patterns compulsifs chez des adolescents encore en développement neurologique
- **Accessibilité cognitive** : Une interface conçue pour des adultes habitués aux apps SaaS peut être inadaptée aux profils dys (dyslexie, TDAH) — très représentés chez les lycéens
- **Données de mineurs** : L'architecture doit anticiper les obligations légales (RGPD, consentement parental selon l'âge)

**Analyse des KPIs en échec**

| KPI | Résultat | Interprétation |
|---|---|---|
| Taux de complétion du 1er parcours : 18 % | Catastrophique | L'onboarding ou la structure du premier parcours est incompréhensible ou démotivante |
| Taux de désinstallation J+3 : 67 % | Critique | Les utilisateurs ont donné une chance, ont été frustrés, et ont abandonné définitivement — pas un problème de découverte mais d'expérience réelle |
| Taux de rétention J+7 (probable) | Non mesuré | Aurait dû être le KPI cible de la beta |

**KPIs qui auraient dû être testés avant le lancement**
- Taux de complétion de l'onboarding
- Temps pour créer sa première révision
- Taux de retour J+1 (premier signe de rétention)
- Score SUS auprès de lycéens réels (pas l'équipe, pas les parents)

**Solution correcte**
1. Générer des wireframes avec l'IA comme base de travail brute — pas comme livrable final
2. Tester ces wireframes avec 5 lycéens en test de navigation (5 suffisent pour identifier les problèmes majeurs)
3. Itérer 2 à 3 fois avant de passer au développement
4. Définir des KPIs de beta clairs avant le lancement, pas après

**Erreurs classiques**
- Confondre vitesse de génération et vitesse de validation
- Croire que l'IA connaît la cible mieux que les utilisateurs réels
- Ne pas différencier "ça me plaît" (évaluation interne) de "ça marche pour eux" (validation externe)

**Changement de paradigme en 1 phrase**
L'IA accélère la génération de solutions candidates — elle ne remplace jamais la confrontation avec les utilisateurs réels.

---

### Correction 2.3 — Mini-cas réel (Linka)

**Modèle mental AVANT de commencer**
Le défi central : concevoir pour une cible (freelances 55–70 ans) qui a une forte expertise métier mais une relation variable au numérique — certains utilisent LinkedIn depuis 10 ans, d'autres viennent de s'équiper d'un smartphone. Le tableau de bord doit être puissant (gestion de missions, devis, factures, disponibilité) sans être complexe. La contrainte de 10 semaines impose une rigueur dans le choix des niveaux de fidélité.

**Stratégie de prototypage en 3 phases**

**Phase 1 — Semaine 1 : Exploration basse fidélité (paper wireframes ou Balsamiq)**

Objectif : Tester la logique de navigation et l'architecture du tableau de bord AVANT d'investir dans un design détaillé.

Ce qui doit figurer :
- Les 4 zones fonctionnelles (missions, devis, factures, disponibilité) sous forme de blocs rectangulaires annotés
- Le flux d'onboarding en 5 étapes maximum (schéma linéaire)
- La page d'accueil du tableau de bord avec les informations de premier niveau

Ce qui ne doit PAS figurer :
- Couleurs, police, icônes définitives
- Contenu réel (use placeholders représentatifs : "Mission : Conseil en communication — 3 jours — 450€/j")
- États de loading ou micro-interactions
- Tous les états d'erreur

Test associé : 5 tests de navigation avec des freelances seniors (recruter via LinkedIn, réseau professionnel). Tâches : "Créez un devis pour une mission de 2 jours", "Marquez-vous disponible à partir du 15 mai", "Retrouvez la facture de votre dernière mission".

KPI validé : Taux de succès ≥ 70 % sur les 3 tâches critiques pour passer à la phase 2.

**Phase 2 — Semaines 2–3 : Prototypage moyen fidélité (Figma)**

Objectif : Valider le détail des interactions, le labelling et les flux complets.

Ce qui doit figurer :
- Design system léger (typographie, couleurs primaires, composants boutons/formulaires)
- Tous les états d'une tâche clé (ex : création d'un devis : formulaire vide → rempli → aperçu → envoi confirmé)
- UX writing des labels, titres, messages de confirmation
- Responsive mobile (les freelances seniors consultent souvent sur tablette ou mobile)

Ce qui ne doit PAS figurer :
- Animations finales (risque de distraction pendant les tests)
- Intégrations tierces (comptabilité, signature électronique) — à prototyper en V2

Test associé : 8 tests utilisateurs avec scénarios complets. Observer sans intervenir. Chronométrer l'onboarding (objectif < 15 min). Faire remplir un SUS en fin de session.

KPI validé : SUS ≥ 65 (prototype) et onboarding < 15 min. Sinon, itération avant passage aux devs.

**Usage de l'IA pour accélérer sans dégrader**

- Génération de variantes de composants (boutons, formulaires) à partir d'un brief clair → gain de temps sur la phase d'exploration
- Génération de contenus placeholder réalistes (ex : noms de mission, montants, dates) → les tests sont plus authentiques
- Résumé automatique des notes de tests utilisateurs (si transcription disponible) → identification plus rapide des patterns de problèmes
- **Ce que l'IA ne remplace pas** : le choix des tâches à tester, l'interprétation des comportements observés, la décision de quelle itération prioriser

**Dimensions éthiques et inclusives**

- **Âgisme numérique** : Ne pas supposer que les freelances 55–70 ans sont moins compétents. Ils ont une expertise métier forte — l'interface doit les traiter en professionnels, pas en "seniors à aider". Pas de tutoriels condescendants, pas d'icônes simplistes qui infantilisent.
- **Accessibilité visuelle** : Contraste minimum WCAG AA (ratio 4.5:1), taille de texte configurable, zones de tap ≥ 44px. Les troubles visuels augmentent statistiquement après 50 ans.
- **Littéracie numérique variable** : Le tableau de bord doit fonctionner sans connaissance préalable de ce type d'outil. Progressive disclosure : les fonctions avancées (modèles de devis, récurrence de mission) sont accessibles mais pas imposées d'emblée.
- **Biais de conception** : Les équipes produit sont souvent jeunes (25–35 ans). Tester avec des freelances seniors réels est non-négociable — les hypothèses internes seront systématiquement décalées.

**KPIs de validation par phase**

| Phase | KPI UX | Cible | KPI Business | Cible |
|---|---|---|---|---|
| Phase 1 (BF) | Taux de succès navigation | ≥ 70 % | — | — |
| Phase 2 (MF) | SUS sur prototype | ≥ 65 | Durée onboarding | < 15 min |
| Post-lancement | SUS en production | ≥ 70 | Conv. inscr.→mission | ≥ 30 % à 90j |
| 6 mois | NPS freelance | ≥ 40 | Taux de rétention | ≥ 60 % à 6 mois |

**Changement de paradigme en 1 phrase**
Prototyper, c'est choisir délibérément ce qu'on ne fait pas encore pour apprendre le plus vite possible avec le moins de ressources possible.

---

---

# Concept 3 — UX Writing & microcopy

> **Périmètre** : boutons, messages d'erreur, notifications, ton de marque

---

## BLOC 1 — Exercices (sans correction)

---

### Exercice 3.1 — Traduction mentale

**Contexte :**
Tu travailles sur l'application mobile d'une banque en ligne. L'équipe juridique impose que chaque écran de virement affiche le texte suivant sur le bouton de confirmation :

*"Valider et autoriser l'exécution de l'ordre de virement conformément aux conditions générales en vigueur"*

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Que penses-tu de ce label de bouton ? Comment proposerais-tu de le reformuler en respectant à la fois les contraintes juridiques et les principes d'UX writing ? Quels KPIs seraient affectés par la version actuelle ?

---

### Exercice 3.2 — Piège de paradigme

**Contexte :**
Une plateforme de réservation de voyages affiche les messages d'erreur suivants lors de la saisie du formulaire de réservation :

- Champ date de départ laissé vide → *"Erreur 400 : paramètre date_depart absent ou invalide"*
- Carte bancaire refusée → *"Transaction declined. Code : ERR_PAYMENT_GW_003"*
- Date d'arrivée antérieure à date de départ → *"Incohérence temporelle détectée"*
- Formulaire soumis avec email invalide → *"Format non conforme aux standards RFC 5322"*

Suite à un audit, le taux d'abandon du tunnel de réservation est de 54 %, dont 31 % sur les étapes avec formulaires.

**Question :**
Qu'est-ce qui ne va pas ici ? Reformule chacun des 4 messages d'erreur. Quels KPIs sont affectés ? Quels principes d'UX writing sont violés ? Y a-t-il une dimension éthique à signaler ?

---

### Exercice 3.3 — Mini-cas réel

**Contexte produit :**
Tu es UX writer pour **Remi**, une application de bien-être mental et de soutien émotionnel destinée à des adultes en situation de stress chronique ou de burn-out léger. L'app propose des exercices de respiration, des journaux guidés et une messagerie avec des coachs certifiés.

**Objectifs business :**
- Taux de complétion du premier exercice de respiration ≥ 60 %
- Taux d'engagement J+7 ≥ 40 % (revient utiliser l'app)
- NPS ≥ 50 (sensible car public vulnérable)
- Zéro incident de communication maladroite générant une plainte ou une détresse utilisateur

**Ta mission :**
Décris ton modèle mental AVANT de commencer. Rédige la microcopy pour 5 surfaces critiques : (1) bouton de lancement du premier exercice, (2) message de bienvenue post-inscription, (3) notification de rappel J+3, (4) message d'erreur si la connexion au coach est perdue pendant une session, (5) message de félicitation après 7 jours consécutifs. Justifie chaque choix par des principes d'UX writing et des considérations éthiques liées au public. Quels KPIs suivrais-tu ?

---

## BLOC 2 — Corrections

---

### Correction 3.1 — Traduction mentale

**Modèle mental attendu**
L'UX writing n'est pas l'ennemi du département juridique — c'est le traducteur entre le langage légal et le langage humain. Un bouton est une action, pas un contrat. La contrainte juridique ("l'utilisateur doit consentir de façon éclairée") peut être satisfaite sans noyer l'action principale dans un texte de 12 mots.

**Raisonnement UX/Product**
Le label de bouton doit répondre à une seule question : "Que va-t-il se passer quand je clique ?" La réponse doit être claire, courte, et orientée action. La protection juridique peut être assurée par un texte d'accompagnement (lien vers les CGV, case de consentement séparée) — pas par le label du bouton lui-même.

**Reformulation proposée**

Label du bouton : **"Envoyer le virement"** (ou "Confirmer le virement")

Texte d'accompagnement sous le bouton (plus petit) :
*"En confirmant, vous autorisez ce virement selon nos [conditions générales]."* (lien cliquable)

**Justification**
- Le bouton dit ce que fait l'action (envoyer)
- Le consentement juridique est explicite mais séparé, non intégré au label
- Le lien vers les CGV est visible mais non intrusif
- L'utilisateur comprend immédiatement ce qui va se passer — ce qui réduit les virements accidentels (problème réel en banque)

**KPIs affectés par le label actuel**

| KPI UX | Impact négatif | KPI Business | Impact négatif |
|---|---|---|---|
| Taux de complétion du virement | Friction et hésitation | Nombre de virements effectués | Baisse potentielle |
| Temps de complétion de l'action | Augmenté (lecture lente) | Taux d'abandon tunnel virement | Augmenté |
| Taux de virements accidentels | Non réduit (le label n'aide pas à comprendre l'irréversibilité) | Coûts de support (annulation, réclamation) | Augmentés |
| Score de clarté perçue (UX writing audit) | Très faible | — | — |

**Erreurs classiques**
- Croire que "plus de texte légal = plus de protection" → les tribunaux évaluent le consentement éclairé, pas la longueur du bouton
- Ne pas impliquer l'équipe juridique dans la recherche d'une formulation alternative → travailler avec eux, pas contre eux
- Confondre le label d'action et la notice d'information

**Correction du biais cognitif**
Biais d'autorité : l'équipe juridique a une autorité légitime sur ce qui doit être dit — mais pas nécessairement sur comment le dire. Le rôle de l'UX writer est de trouver une formulation qui satisfait les deux contraintes, pas de choisir l'une contre l'autre.

**Changement de paradigme en 1 phrase**
Un label de bouton est une promesse d'action — la protection juridique se place autour du bouton, jamais dedans.

---

### Correction 3.2 — Piège de paradigme

**Modèle mental attendu**
Les messages d'erreur sont l'un des moments les plus critiques de l'UX writing : l'utilisateur vient d'échouer, il est frustré, il a besoin d'une aide immédiate et compréhensible. Afficher du jargon technique ou des codes d'erreur, c'est abandonner l'utilisateur au moment le plus vulnérable.

**Principes d'UX writing violés**
1. **Clarté** : L'utilisateur doit comprendre ce qui s'est passé sans connaissances techniques
2. **Orientation** : Le message doit dire quoi faire pour corriger le problème
3. **Ton humain** : Pas de jargon, pas de codes, pas de langage machine
4. **Non-culpabilisation** : Ne pas formuler l'erreur comme une faute de l'utilisateur

**Reformulation des 4 messages**

| Situation | Message actuel ❌ | Message corrigé ✅ |
|---|---|---|
| Date de départ vide | "Erreur 400 : paramètre date_depart absent ou invalide" | "Veuillez indiquer une date de départ pour continuer." |
| Carte bancaire refusée | "Transaction declined. Code : ERR_PAYMENT_GW_003" | "Votre paiement n'a pas pu aboutir. Vérifiez les informations de votre carte ou essayez avec une autre carte." |
| Date d'arrivée avant départ | "Incohérence temporelle détectée" | "La date d'arrivée doit être après la date de départ. Voulez-vous corriger les dates ?" |
| Email invalide | "Format non conforme aux standards RFC 5322" | "Cette adresse e-mail ne semble pas valide. Vérifiez qu'elle contient bien un @ et un nom de domaine (ex : vous@exemple.fr)." |

**Notes sur les reformulations**
- Pour la carte bancaire : ne jamais suggérer que la carte est "bloquée" ou "rejetée" (formulation culpabilisante et parfois inexacte — cela peut être un problème technique passager). Utiliser "n'a pas pu aboutir" est neutre et orienté solution.
- Pour la date incohérente : proposer directement l'action corrective ("Voulez-vous corriger les dates ?") plutôt de juste signaler l'erreur.
- Pour l'email : l'exemple concret ("vous@exemple.fr") est une bonne pratique — il montre ce qu'on attend, pas seulement ce qui ne va pas.

**Dimension éthique**

❌ **Dark pattern à signaler** : Afficher des codes d'erreur techniques en apparence anodine peut être une forme d'obscurcissement délibéré qui décourage l'utilisateur de compléter sa réservation — ce qui peut avantager le site s'il est en concurrence avec d'autres plateformes. Même si ce n'est pas intentionnel ici, le résultat est identique.

Les messages d'erreur incompréhensibles discriminent les utilisateurs moins à l'aise avec l'anglais (trois des quatre messages sont en anglais ou en jargon), les seniors, et les personnes ayant des troubles de la compréhension. C'est un problème d'accessibilité cognitive.

**KPIs affectés**

| KPI UX | Impact | KPI Business | Impact |
|---|---|---|---|
| Taux d'abandon tunnel réservation | 54 % → objectif < 20 % | Chiffre d'affaires perdu sur abandons | Direct et mesurable |
| Taux de complétion formulaire | Très bas | Coût d'acquisition client (si l'utilisateur repart sans réserver) | Augmenté |
| SUS de l'expérience de réservation | Très faible | NPS post-réservation | Corrélé à la friction vécue |
| Taux de contact support sur erreurs | Élevé | Coût de support client | Réductible |

**Changement de paradigme en 1 phrase**
Un message d'erreur est une conversation d'aide, pas un log de débogage — il appartient à l'utilisateur, pas au système.

---

### Correction 3.3 — Mini-cas réel (Remi)

**Modèle mental AVANT de commencer**
L'UX writing pour une application de bien-être mental opère dans un contexte de haute sensibilité émotionnelle. Les utilisateurs sont en situation de fragilité — stress chronique, burn-out — et chaque mot peut soit renforcer soit fragiliser leur expérience. Le ton doit être chaleureux, bienveillant et humain, sans être condescendant, médicalisé, ou dans le registre de la culpabilisation. La dimension éthique est structurante à chaque décision de formulation.

**Rédaction des 5 surfaces critiques**

---

**Surface 1 — Bouton de lancement du premier exercice de respiration**

❌ Version à éviter : "Commencer l'exercice" (trop neutre, aucune invitation émotionnelle) ou "Démarrer la session de cohérence cardiaque" (jargon médical, intimidant)

✅ Version recommandée :
**"Prendre un moment pour moi"**

Justification :
- Reformule l'action comme un acte de soin envers soi-même, pas une "tâche à accomplir"
- Évite la connotation de performance ou d'effort
- S'adresse à des personnes en surcharge — le message "c'est pour toi, pas pour les autres" est rassurant
- La formulation "moment pour moi" est ancrée dans le quotidien (pas de jargon)

Variante alternative testable : **"Je commence ma pause"**

---

**Surface 2 — Message de bienvenue post-inscription**

❌ Version à éviter : "Bienvenue sur Remi ! Votre compte a été créé avec succès. Commencez dès maintenant !" (tonalité commerciale, injonction à l'action)

✅ Version recommandée :
> *"Bienvenue. Vous venez de faire quelque chose d'important pour vous.*
> *Remi est là pour vous accompagner, à votre rythme, quand vous en avez besoin.*
> *Il n'y a rien à faire "bien" ici — juste vous."*

Justification :
- Première phrase : valide la démarche de l'utilisateur (s'inscrire sur une app de bien-être est un acte de reconnaissance de son état, parfois difficile à franchir)
- Deuxième phrase : rassure sur l'absence de pression de performance
- Troisième phrase : neutralise le biais de perfection (une cible burn-out a souvent une tendance perfectionniste)
- Ton : chaleureux, doux, non performatif — pas enjoué ni clinique

Considération éthique : ne pas utiliser d'émojis dans le message de bienvenue d'une app de santé mentale — le registre visuel doit rester sobre et sérieux, pas festif.

---

**Surface 3 — Notification de rappel J+3**

❌ Version à éviter : "Tu n'as pas ouvert Remi depuis 3 jours ! Reviens vite 🔥" ❌ (culpabilisation, dark pattern de pression)

❌ À éviter aussi : "Rappel : votre session de bien-être vous attend" (trop formel, impersonnel)

✅ Version recommandée :
> *"Comment vous sentez-vous aujourd'hui ?*
> *Deux minutes suffisent parfois pour changer une journée."*

Justification :
- La question d'ouverture est une invitation, pas une injonction
- "Comment vous sentez-vous" crée une connexion émotionnelle immédiate
- "Deux minutes" réduit la barrière perçue à l'entrée (une personne en burn-out peut sentir que "faire de l'exercice de respiration" est une charge de plus)
- Pas de culpabilisation sur l'absence des 3 derniers jours

Considération éthique : les notifications push pour une app de santé mentale doivent être activables et désactivables facilement. La microcopy des paramètres de notification doit aussi être rédigée avec soin : "Choisissez les moments où vous voulez qu'on vous retrouve" plutôt que "Activer/désactiver les notifications".

---

**Surface 4 — Message d'erreur si la connexion au coach est perdue pendant une session**

❌ Version à éviter : "Erreur de connexion. Votre session a été interrompue. Veuillez réessayer." (froid, aucune empathie, aucun contexte)

✅ Version recommandée :
> *"La connexion avec votre coach s'est interrompue.*
> *Ce n'est pas de votre faute — c'est un problème technique de notre côté.*
> *[Relancer la connexion] ou [Écrire un message à votre coach]*"

Justification :
- Première phrase : explique simplement ce qui s'est passé
- Deuxième phrase : **critique en contexte de vulnérabilité** — une personne en état de stress peut immédiatement se demander "ai-je fait quelque chose de mal ?" ou vivre l'interruption comme un rejet. Neutraliser explicitement la culpabilité est une protection éthique.
- Deux options de récupération : l'une technique (relancer), l'autre relationnelle (écrire) — pour éviter de laisser l'utilisateur seul
- Ne jamais afficher un code d'erreur ou un message technique dans ce contexte

Considération éthique : si la perte de connexion survient pendant un moment de détresse exprimée par l'utilisateur, le message doit aussi inclure un lien vers les ressources d'urgence si nécessaire (numéro de crise, lien vers un professionnel de santé).

---

**Surface 5 — Message de félicitation après 7 jours consécutifs**

❌ Version à éviter : "🎉 BRAVO ! 7 jours consécutifs ! Tu es un champion du bien-être !" (trop festif, registre gamification agressive, pression de la streak à maintenir)

❌ À éviter aussi : "Félicitations pour vos 7 jours. Continuez ainsi." (trop froid, impersonnel)

✅ Version recommandée :
> *"7 jours avec vous.*
> *C'est remarquable — pas parce que vous avez "réussi" quelque chose, mais parce que vous avez choisi de prendre soin de vous sept fois de suite.*
> *Continuez quand vous le souhaitez. Remi est là."*

Justification :
- "7 jours avec vous" : formulation relationnelle (l'app est à côté de vous, pas au-dessus)
- Neutralise le biais de performance ("pas parce que vous avez réussi") — critique pour une cible burn-out qui a souvent un rapport problématique à la performance et à la réussite
- "Quand vous le souhaitez" : ne pas créer une pression de continuité. Manquer le jour 8 ne doit pas être vécu comme un échec.
- Ton : chaleureux, adulte, non gamifié

Considération éthique : **les streaks sont un dark pattern potentiel** ❌ dans les apps de bien-être mental. Elles peuvent générer de l'anxiété autour de l'interruption (FOMO du streak). Si la feature existe, la microcopy doit activement désamorcer cette pression plutôt que de la renforcer.

**KPIs à suivre**

| KPI UX | Cible | KPI Business | Cible |
|---|---|---|---|
| Taux de complétion 1er exercice | ≥ 60 % | NPS | ≥ 50 |
| Taux d'ouverture de la notification J+3 | ≥ 35 % | Taux d'engagement J+7 | ≥ 40 % |
| Taux de retour après erreur de connexion | ≥ 70 % | Taux de rétention M+1 | ≥ 50 % |
| Sentiment perçu du ton (survey UX) | Chaleureux ≥ 4/5 | Incidents de communication signalés | 0 |
| Taux d'abandon post-message de bienvenue | < 15 % | Taux de conversion vers coaching payant | +15 % à 3 mois |

**Changement de paradigme en 1 phrase**
En UX writing de bien-être, chaque mot porte une charge émotionnelle — rédiger pour une personne vulnérable, c'est rédiger pour ce qu'elle ressent, pas pour ce qu'elle fait.

---

---

# Concept 4 — Conception pour la charge cognitive

> **Périmètre** : chunking, progressive disclosure, hiérarchisation, loi de Hick

---

## BLOC 1 — Exercices (sans correction)

---

### Exercice 4.1 — Traduction mentale

**Contexte :**
Tu travailles sur un formulaire d'inscription à un service de télémédecine. Le formulaire actuel contient 34 champs sur une seule page : identité, adresse, mutuelle, antécédents médicaux, allergies, traitements en cours, contact d'urgence, préférences de consultation, consentements (×5).

Le taux d'abandon du formulaire est de 78 %.

**Question :**
Comment aborderais-tu ce problème avec ta compréhension actuelle ? Quelles techniques de réduction de la charge cognitive utiliserais-tu ? Comment organiserais-tu les 34 champs ? Quels KPIs seraient améliorés ?

---

### Exercice 4.2 — Piège de paradigme

**Contexte :**
L'équipe produit d'une application de gestion financière personnelle a ajouté les fonctionnalités suivantes à l'écran d'accueil :
- Solde total des comptes
- Dernières 5 transactions
- Graphique de dépenses par catégorie (8 catégories)
- Budget mensuel avec barre de progression (12 budgets)
- Objectifs d'épargne (4 objectifs avec barres de progression)
- Alertes de dépassement de budget (3 alertes actives)
- Prévision de solde à J+30
- Recommandations IA (3 recommandations personnalisées)
- Accès rapide aux 6 actions les plus fréquentes
- Taux de change EUR/USD/GBP en temps réel
- Publicité pour un produit financier partenaire

Lors des tests utilisateurs, les participants disent : "Je ne sais pas par où commencer", "Il y a trop de choses", "Je ne suis pas sûr de ce que je dois faire."

**Question :**
Qu'est-ce qui ne va pas ici ? Identifie les principes de conception cognitifs violés. Quels éléments supprimes-tu, déplaces-tu, ou réorganises-tu ? Quel KPI mesures-tu pour valider l'amélioration ? Y a-t-il une dimension éthique à signaler ?

---

### Exercice 4.3 — Mini-cas réel

**Contexte produit :**
Tu es UX designer pour **Arbo**, une plateforme de gestion administrative pour les auto-entrepreneurs (déclarations de chiffre d'affaires, calcul des cotisations, facturation, suivi fiscal). Les utilisateurs sont des freelances sans formation comptable, souvent anxieux face à l'administration.

L'étude utilisateur révèle :
- 73 % déclarent "avoir peur de faire une erreur" lors de la déclaration mensuelle
- 61 % ne comprennent pas la différence entre les différents taux de cotisation selon leur activité
- 48 % ignorent qu'ils peuvent modifier une déclaration déjà envoyée

**Objectifs business :**
- Taux de complétion de la déclaration mensuelle ≥ 90 % (actuellement 67 %)
- Taux d'erreurs de déclaration signalées ≥ 30 % de réduction
- SUS ≥ 80 (actuellement 61)
- NPS ≥ 45 (actuellement 28)

**Ta mission :**
Décris ton modèle mental AVANT de commencer. Explique comment tu appliques chunking, progressive disclosure, hiérarchisation et loi de Hick à la refonte du flux de déclaration mensuelle. Précise les dimensions éthiques et inclusives (anxiété, littéracie administrative). Quels KPIs valident chaque décision de conception ?

---

## BLOC 2 — Corrections

---

### Correction 4.1 — Traduction mentale

**Modèle mental attendu**
34 champs sur une seule page génèrent une charge cognitive massive dès l'arrivée sur le formulaire. L'utilisateur voit l'ensemble du travail à accomplir d'un seul regard, ce qui déclenche une réaction de fuite ("c'est trop long, je le fais plus tard"). La technique de chunking — diviser en blocs logiques présentés séquentiellement — réduit la charge perçue et améliore le taux de complétion.

**Raisonnement UX/Product**
Le problème n'est pas que le formulaire a 34 champs — il est possible que tous ces champs soient nécessaires. Le problème est la présentation simultanée de toute la complexité. Un formulaire en étapes ne supprime pas les champs, il répartit la charge cognitive dans le temps.

**Application des techniques**

**1. Chunking — Regroupement logique**
Diviser les 34 champs en 5 étapes thématiques :
- **Étape 1** — Votre identité (6 champs : prénom, nom, date de naissance, email, téléphone, mot de passe)
- **Étape 2** — Votre adresse (4 champs : rue, code postal, ville, pays)
- **Étape 3** — Votre couverture santé (4 champs : mutuelle, numéro d'adhérent, médecin traitant, groupe sanguin)
- **Étape 4** — Votre santé (8 champs : antécédents, allergies, traitements — avec option "Aucun" pour réduire la saisie)
- **Étape 5** — Préférences et consentements (les 12 champs restants, dont les 5 consentements regroupés clairement)

**2. Progressive disclosure**
- Ne pas afficher les champs optionnels d'emblée → afficher "Ajouter un traitement en cours" plutôt qu'un champ vide
- Le champ "contact d'urgence" peut être proposé après l'inscription ("Ajoutez un contact d'urgence pour plus de sécurité") via une étape facultative ou dans le profil

**3. Indicateur de progression**
Barre de progression visible ("Étape 2 sur 5") → réduit l'anxiété de la complétion, crée une motivation séquentielle

**4. Hiérarchisation par criticité**
Identifier les champs qui bloquent la création du compte vs. ceux qui améliorent le service mais ne sont pas bloquants. L'email et la date de naissance sont obligatoires → demandés en étape 1. Les préférences de consultation peuvent attendre après la première connexion.

**Technique supplémentaire : smart defaults**
Pré-remplir les champs devinables (pays = France par défaut, format de téléphone), proposer une saisie assistée (auto-complétion de l'adresse via API), réduire la saisie au strict nécessaire.

**KPIs améliorés**

| KPI UX | Impact attendu | KPI Business | Impact attendu |
|---|---|---|---|
| Taux de complétion du formulaire | 22 % → 65–75 % | Volume d'inscriptions | +200 % potentiel |
| Temps de complétion moyen | Réduit de 30–40 % | Coût d'acquisition par utilisateur actif | Réduit |
| Taux d'abandon par étape | Identifiable et actionnable | Taux de patients actifs à J+30 | Amélioré |
| SUS du formulaire | Très faible → ≥ 65 | — | — |

**Dimension éthique**
Un formulaire médical doit expliquer clairement *pourquoi* chaque donnée sensible est collectée (antécédents, allergies). Les 5 consentements RGPD doivent être formulés en langage compréhensible, non comme un mur de texte juridique — c'est une obligation légale ET une exigence éthique. Chaque consentement doit être une décision séparée et éclairée, jamais groupé dans une case unique "J'accepte tout".

**Erreurs classiques**
- Diviser en étapes sans indicateur de progression → l'utilisateur ne sait pas combien il en reste
- Mettre les consentements en étape 1 → risque de blocage immédiat sur du texte juridique
- Fractionner en trop d'étapes (10+) → la fragmentation devient elle-même une friction

**Changement de paradigme en 1 phrase**
Réduire la charge cognitive, ce n'est pas supprimer des informations — c'est les distribuer dans le temps de façon à ce que chaque moment ne demande qu'un seul effort mental.

---

### Correction 4.2 — Piège de paradigme

**Modèle mental attendu**
L'écran d'accueil souffre de surcharge informationnelle (information overload). Chaque élément ajouté a du sens individuellement — mais leur coprésence crée une compétition pour l'attention qui rend tout illisible. La loi de Hick prédit que le temps de décision augmente logarithmiquement avec le nombre d'options — ici, l'utilisateur ne sait pas quelle information regarder en premier.

**Principes de conception cognitifs violés**

**1. Loi de Hick — Surcharge de choix**
11 blocs d'information distincts + 3 alertes + publicité = paralysie décisionnelle. L'utilisateur ne sait pas par où commencer car rien n'est hiérarchisé.

**2. Mémoire de travail (capacité limitée)**
La mémoire de travail humaine traite efficacement 4 ± 1 éléments simultanément (révision de la règle de Miller). 11 blocs d'information dépassent massivement cette capacité.

**3. Absence de hiérarchie visuelle et fonctionnelle**
Tous les éléments semblent d'égale importance. Le solde total (information primaire) n'est pas plus prominent que le taux de change EUR/USD (information tertiaire pour la plupart des utilisateurs).

**4. Progressive disclosure non appliquée**
Les recommandations IA, les objectifs d'épargne et les prévisions à J+30 sont des informations secondaires qui méritent leur propre écran, accessible depuis l'accueil — pas affichées d'emblée.

**Dimension éthique — Dark pattern** ❌
La publicité pour un produit financier partenaire sur l'écran d'accueil d'une app de gestion financière personnelle est un problème éthique sérieux :
- L'utilisateur est en position de vulnérabilité cognitive (il évalue sa situation financière)
- La publicité peut être confondue avec une recommandation personnalisée (surtout si elle est visuellement intégrée au flux)
- Dans certaines juridictions, mélanger conseil financier et publicité sans distinction claire est une infraction réglementaire (MiFID II en Europe)

**Restructuration recommandée**

**Écran d'accueil — 4 éléments maximum :**
1. Solde total (information primaire, grande taille, en haut)
2. Dernières 3 transactions (information de contexte immédiat)
3. 1 alerte prioritaire si pertinente (budgets dépassés) — pas 3 alertes simultanées
4. 3 actions rapides les plus fréquentes (pas 6)

**Accès depuis l'accueil vers :**
- Section "Budgets" → graphiques de dépenses, barres de budget, objectifs
- Section "Analyse" → prévisions, recommandations IA
- Section "Informations" → taux de change (si pertinent pour l'utilisateur — sinon, à supprimer)

**La publicité** : si elle doit exister, dans une section dédiée "Offres partenaires", clairement séparée du contenu financier personnel et identifiée comme publicité.

**KPIs à mesurer pour valider**

| KPI UX | Avant | Objectif après | KPI Business | Objectif |
|---|---|---|---|---|
| Taux d'engagement sur l'accueil (clics sur un élément intentionnel) | Faible (errance) | +50 % | Taux de clics sur CTA produit partenaire | — (retirer ou tracer séparément) |
| Temps avant 1ère action utile | Long | Réduit de 40 % | Taux de rétention hebdomadaire | +20 % |
| Score SUS | < 60 probable | ≥ 75 | NPS | +15 points |
| Taux de retour J+7 | Faible | +25 % | — | — |

**Erreurs classiques**
- Croire que "plus d'information = plus de valeur" → en conception, la valeur d'une information est inversement proportionnelle à la quantité d'informations qui l'entourent
- Ajouter des fonctionnalités à l'accueil pour justifier leur existence dans le produit → chaque feature doit mériter sa place selon l'usage réel, pas selon l'investissement de développement
- Appeler "personnalisation" ce qui est en réalité de la publicité ciblée ❌

**Changement de paradigme en 1 phrase**
Un bon écran d'accueil ne montre pas tout ce que le produit sait faire — il montre exactement ce dont l'utilisateur a besoin à ce moment précis.

---

### Correction 4.3 — Mini-cas réel (Arbo)

**Modèle mental AVANT de commencer**
Le problème central n'est pas technique — il est émotionnel et cognitif. Les auto-entrepreneurs ont peur de faire une erreur avec des conséquences réelles (pénalités, redressement URSSAF). Cette anxiété amplifie chaque friction. Une interface qui réduit la charge cognitive réduit aussi l'anxiété — les deux sont liés. Le design doit être un filet de sécurité perçu, pas une source de pression supplémentaire.

**Application des 4 techniques**

**1. Chunking — Découpage de la déclaration**

La déclaration mensuelle est actuellement perçue comme un "formulaire à ne pas rater". La reframer en 3 étapes nommées et rassurantes :

- **Étape 1 — Mon chiffre d'affaires du mois** (1 ou 2 champs selon le type d'activité) — accompagné d'une explication contextuelle : "C'est le total des factures encaissées ce mois, pas celles émises."
- **Étape 2 — Vérification automatique** (Arbo calcule les cotisations, affiche le montant, explique le calcul) — l'utilisateur vérifie, ne calcule pas
- **Étape 3 — Confirmation et envoi** (récapitulatif + bouton de confirmation + confirmation post-envoi rassurante)

Chaque étape est une page distincte. L'utilisateur ne voit jamais les 3 étapes simultanément.

**2. Progressive disclosure — Ne révéler que ce qui est nécessaire**

- **Par défaut** : seul le champ de saisie du CA mensuel est visible. Pas de mention des taux de cotisation, pas de calculs, pas d'explications sur les régimes.
- **Sur demande** : bouton "Comment est calculé ce montant ?" → affiche l'explication du taux applicable à l'activité, avec un exemple chiffré ("Pour une activité de services : 22,2 % × votre CA")
- **Si erreur potentielle détectée** : alerte contextuelle ("Ce montant est très différent de votre mois précédent — voulez-vous vérifier ?") — non bloquante, juste informative

Résultat : les 61 % qui ne comprennent pas les taux de cotisation ne sont pas forcés de comprendre pour compléter — mais l'information est accessible pour ceux qui veulent.

**3. Hiérarchisation — Priorité à la sécurité et à la clarté**

Hiérarchie visuelle du récapitulatif (étape 3) :
- **Niveau 1** (grand, prominent) : Montant de la cotisation à payer ce mois → c'est l'information actionnelle
- **Niveau 2** (moyen) : CA déclaré + date limite de paiement
- **Niveau 3** (petit, accessible sur demande) : Détail du calcul, référence réglementaire, lien vers l'URSSAF

Les 48 % qui ignorent qu'on peut modifier une déclaration → information placée en Niveau 2 sur l'écran de confirmation post-envoi : "Votre déclaration a été envoyée. Vous pouvez la modifier jusqu'au [date limite] si nécessaire." — avec un lien direct vers la modification.

**4. Loi de Hick — Réduction des options au moment critique**

Sur l'écran de confirmation (étape 3), proposer exactement 2 options :
- "Envoyer ma déclaration" (CTA principal, bien visible)
- "Revenir vérifier" (lien secondaire, moins visible)

Ne pas afficher simultanément : envoyer, sauvegarder pour plus tard, annuler, contacter le support, voir mes déclarations précédentes — même si toutes ces options sont valides. Les options secondaires sont accessibles via le menu, pas sur l'écran de décision.

**Réduction de l'anxiété — dimension transversale**

- **Ton rassurant dans la microcopy** : "Arbo vérifie automatiquement votre saisie avant envoi" (filet de sécurité perçu), "Vous pouvez modifier cette déclaration jusqu'au [date]" (réversibilité perçue)
- **Confirmation post-envoi** : Pas juste "Déclaration envoyée" — mais "Votre déclaration de [mois] a bien été transmise à l'URSSAF. Prochaine déclaration : [date]. Vous recevrez une confirmation par email."
- **Prévisibilité** : Afficher la date limite de déclaration du mois suivant directement après l'envoi → réduit l'anxiété de "quand dois-je le refaire ?"

**Dimensions éthiques et inclusives**

- **Anxiété administrative** : Ne jamais utiliser de langage alarmiste ou de countdown agressif ("⚠️ PLUS QUE 3 JOURS !"). Préférer une indication neutre et prévisible.
- **Littéracie administrative** : Éviter tout acronyme non expliqué (URSSAF, BIC/BNC, régime micro) dans le flux principal. Les termes techniques sont accessibles en info-bulle ou en section "En savoir plus".
- **Accessibilité cognitive** : Le formulaire de déclaration doit être utilisable par des personnes avec des troubles de l'attention (TDAH) — une seule action par écran, pas de distracteurs, progression claire.
- **Erreur sans sanction** : Le design ne doit pas surpénaliser l'erreur. Si l'utilisateur saisit un montant inhabituel, un avertissement doux suffit — pas un blocage ou une alerte rouge anxiogène.
- **Equité d'accès** : Les auto-entrepreneurs en zone rurale avec une connexion lente doivent pouvoir compléter la déclaration — pas de dépendance à une connexion rapide pour les étapes critiques.

**KPIs de validation par décision de conception**

| Décision UX | KPI UX | Cible | KPI Business | Cible |
|---|---|---|---|---|
| Chunking en 3 étapes | Taux de complétion déclaration | 67 % → 90 % | Réduction des erreurs de déclaration | −30 % |
| Progressive disclosure des taux | Compréhension des taux (survey) | 61 % → 85 % comprennent | NPS | 28 → 45 |
| Loi de Hick sur confirmation | Taux d'hésitation sur l'écran de confirmation | Mesuré par heatmap/session recording | Taux de déclarations "abandonnées" en étape 3 | < 5 % |
| Message de réversibilité post-envoi | Taux de modification de déclaration (feature découverte) | 48 % → 70 % connaissent la feature | Volume de contacts support "erreur dans ma déclaration" | −40 % |
| SUS global | SUS | 61 → 80 | Taux de rétention annuelle (abonnement) | +20 % |

**Erreurs classiques à éviter**
- Simplifier l'interface au point de cacher des informations légalement importantes → l'utilisateur doit toujours pouvoir accéder au détail du calcul
- Confondre "simple" et "simplifié" → une interface simple a peu d'éléments ; une interface simplifiée cache la complexité de façon inadaptée. Ici, on veut du simple (chunking, hiérarchisation) mais pas du simplifié (on ne cache pas les taux de cotisation, on les rend accessibles sur demande)
- Tester uniquement avec des utilisateurs à l'aise avec la comptabilité → les 73 % qui ont peur de faire une erreur sont la cible principale, pas les power users

**Changement de paradigme en 1 phrase**
Concevoir pour la charge cognitive, c'est concevoir pour la capacité d'attention humaine — pas pour l'exhaustivité de l'information disponible.

---

---

## Récapitulatif des KPIs clés par concept

| Concept | KPI UX principal | KPI Business principal |
|---|---|---|
| Architecture de l'information | Taux de succès de navigation (findability) | Volume d'appels support, taux de conversion |
| Wireframing & prototypage | Taux de succès lors des tests utilisateurs, SUS | Time-to-market, coût des modifications post-dev |
| UX Writing & microcopy | Taux de complétion des actions, taux d'abandon des formulaires | Taux de conversion, NPS, volume de contacts support |
| Charge cognitive | Taux de complétion des flux, SUS | Taux de rétention, réduction des erreurs, NPS |

---

## Grille d'auto-évaluation

Pour chaque exercice complété, vérifie :

- [ ] Mon modèle mental de départ était-il centré utilisateur ou centré organisation/système ?
- [ ] Ai-je identifié au moins 1 KPI UX et 1 KPI Business impactés ?
- [ ] Ai-je intégré une dimension éthique ou inclusive dans ma réponse ?
- [ ] Ai-je signalé les dark patterns si présents ?
- [ ] Ma solution est-elle testable (peut-on mesurer si elle marche) ?
- [ ] Ai-je évité de supposer des compétences techniques chez les utilisateurs ?
