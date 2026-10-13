# Module 15 — Cas d'application

> **Question directrice.** Comment partir d'un domaine que l'on ne connaît pas, et arriver à une plateforme configurée, en réutilisant le même moteur ?

## Présentation du module

**Objectif.** Le plan est explicite : le but du parcours n'est pas de savoir « construire un SaaS de gestion de flotte aérienne ». Il est de pouvoir **partir d'un domaine inconnu** et de le transformer en configuration de la plateforme. C'est ce qui distingue un SaaS vertical d'une plateforme SaaS agnostique, et le véritable objectif est d'**apprendre à construire le moteur qui permet de construire des SaaS verticaux**.

Les cas d'application arrivent en dernier, parce qu'ils **mobilisent tout ce qui précède**.

```text
SOLUTIONS DE DOMAINE        aéronautique · santé · industrie · logistique        module 15
MODÉLISATION DU DOMAINE     DDD · contraintes · invariants · règles              modules 13 et 14
MOTEUR DE LA PLATEFORME     ressources · workflow · événements · politiques      modules 2, 3, 6 et 7
PLATEFORME D'ADMINISTRATION IAM · RBAC · configuration · audit · gouvernance     modules 4, 8 et 9
CŒUR SAAS                   multi-tenancy · API · intégrations                   modules 1, 5 et 10
INFRASTRUCTURE              base · cloud · sécurité · fiabilité · SRE            module 11
```

L'expérience utilisateur (module 12) traverse ces niveaux : elle rend le tout utilisable.

**Prérequis.** Les modules 1 à 14. Ce module les recompose plus qu'il n'introduit de notions nouvelles.

**Ordre retenu.** Une méthode, un cas détaillé, puis trois cas comparés.

| Entrée | Contenu |
|---|---|
| [15.1 De nouveau domaine à plateforme configurée](#151-de-nouveau-domaine-à-plateforme-configurée) | La méthode générale, de la découverte d'un domaine à l'expérience métier, avec un domaine neuf traité de bout en bout |
| [15.2 Étude de cas, maintenance d'une flotte aérienne](#152-étude-de-cas-maintenance-dune-flotte-aérienne) | Un cas détaillé : la maintenance d'une flotte aérienne, fil rouge du parcours |
| [15.3 Études de cas comparées, santé, industrie et logistique](#153-études-de-cas-comparées-santé-industrie-et-logistique) | Trois cas comparés : santé, industrie, logistique |

**Avertissement sur les cas.** Les cas sont des **modèles pédagogiques simplifiés**. Ils illustrent une démarche. Ils ne sont pas des spécifications réglementaires. Dans les secteurs réglementés (aéronautique, santé, industrie), les exigences des autorités et des normes applicables prévalent toujours, et doivent être vérifiées avec les experts concernés.

## Sommaire du module

- [15.1 De nouveau domaine à plateforme configurée](#151-de-nouveau-domaine-à-plateforme-configurée)
- [15.2 Étude de cas, maintenance d'une flotte aérienne](#152-étude-de-cas-maintenance-dune-flotte-aérienne)
- [15.3 Études de cas comparées, santé, industrie et logistique](#153-études-de-cas-comparées-santé-industrie-et-logistique)

## 15.1 De nouveau domaine à plateforme configurée

### 1. Comprendre simplement

La démarche **« nouveau domaine → plateforme configurée »** transforme la description d'un métier que l'on ne connaît pas en **configuration** de la plateforme. Elle commence par une phase de **découverte**, puis suit **huit étapes** : identifier les ressources, les relations, les états, les règles, les rôles, les workflows, configurer la plateforme, puis construire l'expérience métier.

**Pourquoi cela existe.** Sans démarche, chaque nouveau domaine redémarre de zéro, ou pire, il est codé en dur. Avec une démarche, on pose les bonnes questions dans le bon ordre, et l'on produit des artefacts que les experts du métier peuvent vérifier. Le plan en fait la différence entre un SaaS vertical et une plateforme agnostique.

**Problème résolu.** Passer d'un métier flou à une configuration exécutable, sans développement spécifique, en limitant les malentendus.

**Modèle mental.** Un urbaniste qui arrive dans une ville inconnue. Il recense les bâtiments et les lieux (les ressources). Il relève les routes qui les relient (les relations). Il note les états des lieux (ouvert, fermé, en travaux), puis le code de la route (les règles), les habitants et ce qu'ils ont le droit de faire (les rôles), et les parcours quotidiens (les workflows). Ensuite seulement, il aménage la ville (la configuration) et dessine la signalisation (l'expérience).

**Où l'analogie s'arrête.** Une ville change lentement et se laisse observer. Un domaine métier se modélise avec des experts qui ne sont pas toujours d'accord, le modèle se teste sur des cas réels, et il évolue.

**Exemple.** Un centre de formation : des sessions, des formateurs, des salles, des inscriptions. En quelques ateliers, on aboutit à des types de ressources, des états de session, des règles de capacité et de disponibilité, des rôles et des workflows. Le résultat se configure, sans écrire de code.

**Les composants.**

1. la **découverte** du domaine : sous-domaines, langage, processus ;
2. l'identification des **ressources** ;
3. l'identification des **relations** ;
4. l'identification des **états** ;
5. l'identification des **règles** ;
6. l'identification des **rôles** ;
7. l'identification des **workflows** ;
8. la **configuration** de la plateforme ;
9. la construction de l'**expérience métier**, et la vérification par des **scénarios**.

**Objectif d'apprentissage :** vous pouvez dérouler la démarche sur un domaine nouveau, dire ce que produit chaque étape, et distinguer ce qui se configure de ce qui exige une extension.

### 2. Connaissances essentielles

#### Définition

**Démarche de modélisation par configuration** : suite ordonnée d'étapes qui part de la compréhension d'un domaine et aboutit à un modèle configuré dans la plateforme, vérifié par des scénarios avec les experts du métier.

#### Idées fondamentales

1. **On part du métier, avec ses experts.** Pas des écrans, ni de la technique.
2. **L'ordre compte.** Chaque étape s'appuie sur la précédente : on ne peut pas définir des règles sur des états qu'on n'a pas identifiés.
3. **Chaque étape produit un livrable vérifiable.** Glossaire, liste de ressources, diagramme d'états, tableau de règles, matrice de rôles.
4. **On valide par des scénarios réels.** Une revue abstraite ne détecte pas ce qu'un cas concret révèle.
5. **On itère.** Les étapes s'éclairent mutuellement : un état oublié fait revenir à la liste des ressources.
6. **On sépare trois résultats.** Ce qui se configure, ce qui demande une extension, et ce qui révèle un manque de la plateforme.
7. **L'expérience vient en dernier.** Elle se déduit du modèle, elle ne le précède pas.

#### Vocabulaire essentiel

- **Ressource** (*resource*) : chose que le métier gère, suit ou décide (voir [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement)).
- **Relation** (*relation*) : lien entre ressources (voir [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)).
- **État** (*state*) : étape de vie d'une ressource (voir [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie)).
- **Règle** (*rule*) : condition, contrainte ou calcul du métier (voir [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)).
- **Rôle** (*role*) : ensemble de droits correspondant à une fonction (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée)).
- **Workflow** : enchaînement d'étapes, d'approbations et d'automatismes (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)).
- **Scénario** (*scenario*) : cas d'usage réel, écrit en langage métier, servant à vérifier le modèle.
- **Livrable** (*deliverable*) : artefact produit à la fin d'une étape.
- **Lacune** (*gap*) : besoin qui ne se laisse pas exprimer par la configuration existante.
- **Modèle de configuration** (*configuration template*) : configuration réutilisable, adaptable à un autre tenant.

#### Relations de cause à effet

- On commence par les écrans. Le modèle suit l'interface, les règles se dispersent dans les écrans, et le comportement revient en code.
- On saute les états et les règles. Le modèle ne contient que des données, et tout le comportement redevient du code spécifique.
- On ne valide pas par des scénarios. Le modèle est élégant, mais ne couvre pas la réalité du métier.
- On configure tout d'un coup. Les erreurs sont nombreuses et difficiles à localiser.
- On copie la configuration d'un autre client sans analyse. Elle importe son vocabulaire, ses règles et ses exceptions.

#### Idées reçues

- **« Il faut d'abord un modèle de données complet. »** On avance par itérations : l'essentiel d'abord, le détail ensuite. Un modèle complet avant les états et les règles est souvent faux.
- **« La démarche remplace l'expertise du métier. »** Elle l'organise. Sans experts, elle produit un modèle plausible et faux.
- **« Une configuration réussie signifie zéro code. »** Il reste des extensions. Les identifier et les isoler est un résultat de la démarche, pas un échec.

#### Principe clé

On avance du métier vers la configuration en étapes ordonnées, avec un livrable vérifié par des scénarios à chaque étape, et l'on distingue ce qui se configure de ce qui exige une extension.

#### Si vous ne retenez que trois choses

1. L'ordre est : découverte, ressources, relations, états, règles, rôles, workflows, configuration, expérience.
2. Chaque étape produit un livrable que les experts du métier peuvent vérifier sur des scénarios.
3. Le résultat se répartit en configuration, extensions et lacunes de la plateforme.

### 3. Explication technique détaillée

#### Vue d'ensemble

```text
Nouveau domaine
   │  0. Découverte        langage, sous-domaines, processus
   ▼
   │  1. Ressources        quelles choses le métier gère-t-il ?
   ▼
   │  2. Relations         comment se rattachent-elles ?
   ▼
   │  3. États             quelles étapes de vie traversent-elles ?
   ▼
   │  4. Règles            qu'est-ce qui est permis, interdit, calculé ?
   ▼
   │  5. Rôles             qui fait quoi, sur quoi ?
   ▼
   │  6. Workflows         quels enchaînements et automatismes ?
   ▼
   │  7. Configuration     tout exprimer dans la plateforme
   ▼
   │  8. Expérience        ce que voit et fait chaque rôle
   ▼
 Scénarios de vérification (à chaque étape, puis de bout en bout)
```

| Étape | Question | Livrable | Entrées de référence |
|---|---|---|---|
| 0. Découverte | De quoi parle ce métier ? Qui fait quoi, avec quoi ? | Carte du domaine, glossaire, sous-domaines | [14.1 Domaine et sous-domaine](14-domain-driven-design.md#141-domaine-et-sous-domaine), [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent), [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) |
| 1. Ressources | Quelles choses le métier gère-t-il, suit-il, décide-t-il ? | Types de ressources et champs | [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) à [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés), [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) |
| 2. Relations | Comment ces choses se rattachent-elles ? | Schéma des relations, cardinalités, hiérarchies | [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence) à [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation), [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) |
| 3. États | Quelles étapes de vie traverse chaque ressource ? | Diagrammes d'états et de transitions | [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie), [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) |
| 4. Règles | Qu'est-ce qui est permis, interdit, obligatoire, calculé ? | Tableau de règles et d'invariants | [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique) à [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles), [13.5 Invariants](13-concepts-transversaux.md#135-invariants) |
| 5. Rôles | Qui fait quoi, sur quoi, dans quelles conditions ? | Matrice des rôles, des actions et des périmètres | [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) à [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) |
| 6. Workflows | Quels enchaînements, approbations, délais, automatismes ? | Workflows, événements, déclencheurs | [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) à [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative), [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) à [7.11 Saga](07-evenements-automatisation.md#711-saga) |
| 7. Configuration | Comment exprimer tout cela dans la plateforme ? | Configuration publiée en bac à sable | [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) à [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle), [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) |
| 8. Expérience | Que voit chaque rôle, avec quels écrans et indicateurs ? | Vues, formulaires, tableaux de bord, notifications | [12.1 Architecture de l'information et navigation](12-produit-ux.md#121-architecture-de-linformation-et-navigation) à [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) |

#### Étape 0 : la découverte

**Questions.** Quel est le but du métier ? Qui sont les acteurs ? Quels sont les mots qu'ils emploient ? Où sont les décisions, les exceptions, les contrôles ?

**Techniques.**

- **Entretiens et observation** des personnes qui font le travail, plus que de celles qui le décrivent.
- **Ateliers** : cartographier sur un mur les événements et les décisions du métier (voir [14.1 Domaine et sous-domaine](14-domain-driven-design.md#141-domaine-et-sous-domaine)).
- **Documents réels** : formulaires, tableurs, procédures, courriels types.
- **Glossaire** : un mot, un sens, noté (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).
- **Sous-domaines** : cœur, support, générique (voir [14.1 Domaine et sous-domaine](14-domain-driven-design.md#141-domaine-et-sous-domaine)).

**Les tableurs du client sont une mine.** Les colonnes sont des champs. Les onglets sont des types de ressources. Les couleurs de cellules sont souvent des états. Les formules sont des règles. Les commentaires sont des exceptions. Les décoder est l'une des méthodes de découverte les plus efficaces.

**Livrables.** Glossaire, carte du domaine avec ses sous-domaines, liste des acteurs, liste des processus, premiers scénarios.

#### Étape 1 : les ressources

**Question.** Quelles choses le métier gère-t-il, suit-il dans le temps, ou sur lesquelles décide-t-il ?

**Technique.** Relever les **noms** du glossaire qui ont une **identité** et une **histoire**. Chaque nom est candidat à devenir un type de ressource. On distingue :

- ce qui a une identité et un cycle de vie (entité) ;
- ce qui est une simple valeur (objet-valeur, voir [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur)) ;
- ce qui est une liste de référence (statuts, catégories, pays).

**Livrable.** Types de ressources, avec champs (nom, type, obligatoire, valeurs permises).

**Pièges.** Un type « Objet » ou « Élément » trop générique. Des champs en texte libre pour des choses structurées. Confondre un état avec un type (« Aéronef actif » n'est pas un type).

#### Étape 2 : les relations

**Question.** Comment ces ressources se rattachent-elles les unes aux autres ?

**Technique.** Pour chaque paire de ressources liées, préciser : la **nature** du lien (référence, composition, hiérarchie), la **cardinalité** (un, plusieurs), l'**obligation** (peut-il exister sans l'autre ?), et ce qui se passe à la suppression (voir [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence) à [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) et [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)).

**Livrable.** Schéma des relations, avec cardinalités et obligations.

**Pièges.** Des relations plusieurs-à-plusieurs non explicitées (elles cachent souvent une ressource : l'inscription entre un stagiaire et une session). Des hiérarchies mal bornées. Le choix entre référence et composition fait au hasard : il décide des frontières d'agrégat (voir [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat)).

#### Étape 3 : les états

**Question.** Quelles étapes de vie traverse chaque ressource, et qu'est-ce qui la fait passer de l'une à l'autre ?

**Technique.** Pour chaque ressource qui a un cycle de vie : lister les **états** (avec des noms du métier), les **transitions** autorisées, **qui** les déclenche et **dans quelles conditions** (voir [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie) et [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)). Un état est une **période** durant laquelle certaines choses sont permises et d'autres pas.

**Livrable.** Diagramme d'états et de transitions par ressource.

**Pièges.** Trop d'états (un par subtilité). Des états qui mélangent deux dimensions (« en inspection et en retard »). Des transitions oubliées (annulation, retour en arrière).

#### Étape 4 : les règles

**Question.** Qu'est-ce qui est obligatoire, interdit, autorisé sous condition, ou calculé ?

**Technique.** Reprendre chaque scénario et noter les « si... alors... », les « jamais », les « toujours ». Classer en :

| Type | Exemple | Où l'exprimer |
|---|---|---|
| Invariant | Une salle n'est pas occupée par deux sessions en même temps | Contrainte, invariant (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)) |
| Validation | La capacité est un entier positif | Schéma, validation (voir [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) |
| Garde | Une session ne peut être confirmée que si le minimum est atteint | Garde de transition (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) |
| Calcul | Taux de remplissage = inscrits / capacité | Formule (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)) |
| Politique | Qui peut annuler ? | Politique d'accès (voir [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)) |

**Livrable.** Tableau de règles, chacune avec son type, son énoncé en langage métier, sa source (expert, réglementation) et son niveau (plateforme, tenant, domaine).

**Pièges.** Des règles implicites que personne n'énonce, et que l'on découvre en production. Des règles contradictoires entre experts. Des paramètres codés en dur (un seuil de 80 %) qui devraient être configurables.

#### Étape 5 : les rôles

**Question.** Qui fait quoi, sur quelles ressources, dans quelles conditions ?

**Technique.** Construire une matrice **rôle × ressource × action**, puis la compléter par les conditions (son propre périmètre, son équipe, son état) (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée), [4.14 RBAC](04-identite-iam-autorisation.md#414-rbac), [4.16 ABAC](04-identite-iam-autorisation.md#416-abac), [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)). Appliquer le **moindre privilège** et la **séparation des tâches** (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).

**Livrable.** Matrice des rôles, avec périmètres et conditions.

**Pièges.** Un rôle « administrateur » qui peut tout. Des rôles qui reproduisent l'organigramme au lieu des fonctions. L'oubli du **libre-service** (le stagiaire consulte ses propres données).

#### Étape 6 : les workflows

**Question.** Quels enchaînements, quelles approbations, quels délais, quels automatismes ?

**Technique.** Pour chaque processus du glossaire : le **déclencheur**, les **étapes**, les **acteurs**, les **décisions**, les **délais** et **escalades**, les **événements** émis, les **effets** (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) à [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) et [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) à [7.11 Saga](07-evenements-automatisation.md#711-saga)).

**Livrable.** Workflows, événements, déclencheurs, notifications.

**Pièges.** Un workflow qui tente de tout modéliser, y compris des exceptions rares qu'un humain règle mieux. Des délais non définis. Des automatismes qui s'enchaînent en boucle (voir [13.3 Déclaratif versus impératif](13-concepts-transversaux.md#133-déclaratif-versus-impératif)).

#### Étape 7 : la configuration

**Question.** Comment exprimer tout cela dans la plateforme, sans code ?

**Technique.** Traduire chaque livrable en objets de la plateforme : types, champs, relations, états, règles, politiques, workflows, vues (voir [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) à [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)). Travailler en **bac à sable**, par petits lots, et utiliser les **validations**, la **simulation** et la **revue** (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)). Garder un **historique** de la configuration (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

**Livrable.** Configuration publiée d'abord dans un environnement de test, avec un jeu de données d'essai.

**Pièges.** Configurer tout avant de tester. Oublier les données existantes : leur import ou leur migration fait partie du travail (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) et [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant)).

#### Étape 8 : l'expérience métier

**Question.** Que voit et que fait chaque rôle, au quotidien ?

**Technique.** Partir des **tâches** de chaque rôle : écrans d'accueil, vues, formulaires, tableaux de bord, notifications (voir [12.1 Architecture de l'information et navigation](12-produit-ux.md#121-architecture-de-linformation-et-navigation) à [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)). Vérifier la **découvrabilité** (voir [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)) et l'**explicabilité** des refus (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

**Livrable.** Vues, formulaires, tableaux de bord et notifications configurés par rôle.

**Pièges.** Une interface unique pour tous les rôles. Un vocabulaire du moteur au lieu de celui du métier (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).

#### La vérification par des scénarios

À chaque étape, puis de bout en bout, on exécute des **scénarios réels** sur la configuration.

```text
Scénario : une session est pleine, un stagiaire se désiste
  Étant donné une session confirmée, complète, avec une liste d'attente
  Quand un stagiaire inscrit annule son inscription
  Alors la première personne de la liste d'attente est promue
  Et elle reçoit une notification
  Et le taux de remplissage reste à 100 %
```

Chaque scénario est classé :

| Résultat | Signification | Suite |
|---|---|---|
| Passe par configuration | Le modèle exprime le cas | Aucune |
| Demande une extension | Une règle ou un calcul propre au domaine dépasse la configuration | Extension encadrée (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) et [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) |
| Révèle une lacune de la plateforme | Une capacité générique manque | Retour au produit : évolution du métamodèle (voir [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale)) |
| Révèle une erreur de modèle | Le modèle ne reflète pas le métier | Retour à l'étape concernée |

#### Itérer

La démarche n'est pas une cascade. Typiquement :

- un scénario révèle un **état** manquant : retour à l'étape 3 ;
- une règle suppose une **relation** non modélisée : retour à l'étape 2 ;
- une approbation révèle un **rôle** oublié : retour à l'étape 5.

On fait de petits tours complets, avec un sous-ensemble du domaine, plutôt qu'un seul grand tour.

#### La mesure de la qualité du modèle

| Mesure | Ce qu'elle indique |
|---|---|
| Part des scénarios qui passent par configuration | Adéquation du modèle et de la plateforme |
| Nombre d'extensions | Pression sur le métamodèle |
| Part de champs en texte libre | Structure insuffisante |
| États inutilisés ou règles jamais déclenchées | Sur-modélisation |
| Temps pour configurer un nouveau cas | Maturité de la méthode |

#### Les modes de défaillance

- **Commencer par l'interface** au lieu du modèle.
- **Un modèle sans comportement** : des données, mais ni états, ni règles.
- **Des ateliers sans experts** : un modèle plausible, mais faux.
- **L'absence de scénarios** : on découvre les écarts en production.
- **L'importation du modèle d'un autre client**, avec son vocabulaire.
- **Tout configurer d'un coup**, sans paliers.
- **Ignorer la gouvernance** : personne n'est propriétaire de la configuration.

**Contre-exemple.** Une équipe reçoit un tableur de 40 colonnes et le transforme tel quel en un type de ressource avec 40 champs. Elle configure la plateforme en deux jours. En production, les utilisateurs découvrent qu'une colonne « Statut » mélange cinq choses (état de la session, état du paiement, état de l'inscription, présence, résultat). Les règles n'ont aucune prise, et tout le comportement vit dans des commentaires de cellules.

**Limites.** La démarche suppose un accès aux experts et du temps pour des ateliers. Elle fonctionne mal sur un domaine où le métier n'a pas encore formalisé ses processus : il faut alors accompagner leur clarification, ce qui dépasse la configuration. Enfin, certains domaines très spécialisés contiennent des calculs (optimisation, simulation) qui relèvent d'extensions, quelle que soit la qualité du modèle.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.1 Domaine et sous-domaine](14-domain-driven-design.md#141-domaine-et-sous-domaine) à [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | La découverte s'appuie sur les sous-domaines, le langage omniprésent et les contextes |
| [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) à [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Les ressources, relations et contraintes sont les briques du modèle |
| [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie) à [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | États, workflows, règles et moteur de règles en portent le comportement |
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) à [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Les rôles et permissions viennent de l'identité et de l'autorisation |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) à [7.11 Saga](07-evenements-automatisation.md#711-saga) | Événements et automatismes rendent le système dynamique |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) à [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La plateforme d'administration permet de configurer sans développeur |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | Versionnement, impact et configuration sûre encadrent la mise en place |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) et [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Le métamodèle et la frontière code/configuration décident de ce qui est possible |
| [15.2 Étude de cas, maintenance d'une flotte aérienne](#152-étude-de-cas-maintenance-dune-flotte-aérienne) et [15.3 Études de cas comparées, santé, industrie et logistique](#153-études-de-cas-comparées-santé-industrie-et-logistique) | Cas détaillé et cas comparés appliquent la démarche |

### 5. Application pratique

**Situation initiale.** Un centre de formation professionnelle rejoint la plateforme. L'équipe de configuration ne connaît pas ce métier. Le centre propose des formations au catalogue, organisées en sessions, avec des formateurs, des salles et des stagiaires. Sa gestion se fait aujourd'hui dans trois tableurs et des courriels.

**Problème.** Configurer la plateforme pour ce domaine, sans développement, en quelques semaines.

**Application du concept.** La démarche en huit étapes, avec la découverte.

#### Étape 0 : découverte

Après deux ateliers avec la responsable pédagogique et l'assistante de formation, le glossaire est établi : **formation** (au catalogue), **session** (une réalisation datée d'une formation), **formateur**, **salle**, **stagiaire**, **inscription**, **attestation**.

| Sous-domaine | Type | Raison |
|---|---|---|
| Planification des sessions | Cœur | Remplir les sessions, mobiliser formateurs et salles : la différence du centre |
| Inscriptions et présence | Support | Nécessaire, propre au centre |
| Facturation | Générique | Intégrée au système comptable du centre |
| Identité | Générique | Fédérée avec l'annuaire du centre (voir [4.10 OpenID Connect](04-identite-iam-autorisation.md#410-openid-connect)) |

#### Étape 1 : ressources

| Type | Champs principaux |
|---|---|
| `course` | titre, durée en heures, niveau, prérequis |
| `session` | formation, dates, salle, formateur, capacité maximale, effectif minimal |
| `trainer` | nom, compétences, disponibilités |
| `room` | nom, capacité, équipements |
| `trainee` | identité, entreprise |
| `enrollment` | session, stagiaire, présence |
| `certificate` | inscription, date de délivrance |

#### Étape 2 : relations

| Lien | Nature | Cardinalité | Remarque |
|---|---|---|---|
| `session` → `course` | Référence | N:1 | Une formation, plusieurs sessions |
| `session` → `room` | Référence | N:1 | Une salle par session |
| `session` → `trainer` | Référence | N:1 | Un formateur principal |
| `enrollment` → `session` | Composition | N:1 | L'inscription n'existe pas sans la session |
| `enrollment` → `trainee` | Référence | N:1 | Le stagiaire existe indépendamment |
| `certificate` → `enrollment` | Référence | 1:1 | Au plus une attestation par inscription |
| `trainer` ↔ `course` | Association | N:N | Compétence : un formateur enseigne plusieurs formations |

La **composition** de l'inscription dans la session fait de la session la racine d'un agrégat : l'invariant de capacité s'y applique (voir [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat)).

#### Étape 3 : états

```text
session :
  brouillon ─► inscriptions ouvertes ─► confirmée ─► en cours ─► terminée ─► clôturée
      │              │                     │
      └──────────────┴─────────────────────┴──► annulée

inscription :
  en attente ─► confirmée ─► présente
      │            │      └► absente
      ▼            ▼
  liste d'attente  annulée
```

#### Étape 4 : règles

| Règle | Type | Énoncé |
|---|---|---|
| R1 | Invariant | Les inscriptions confirmées d'une session ne dépassent pas sa capacité |
| R2 | Invariant | Un formateur n'est pas affecté à deux sessions qui se chevauchent |
| R3 | Invariant | Une salle n'est pas occupée par deux sessions en même temps |
| R4 | Garde | Le formateur affecté a la compétence de la formation |
| R5 | Garde | Une session ne passe à « confirmée » que si l'effectif minimal est atteint |
| R6 | Unicité | Un stagiaire n'a qu'une inscription par session |
| R7 | Calcul | Taux de remplissage = inscrits confirmés / capacité |
| R8 | Politique | Une attestation est délivrée si la présence est au moins égale au seuil du tenant (par défaut 80 %) |

#### Étape 5 : rôles

| Rôle | Sessions | Inscriptions | Attestations | Facturation |
|---|---|---|---|---|
| Responsable pédagogique | Créer, modifier, confirmer, annuler | Lire | Valider | Lire |
| Assistante de formation | Lire | Créer, confirmer, annuler | Délivrer | — |
| Formateur | Lire ses sessions | Saisir la présence de ses sessions | — | — |
| Stagiaire (libre-service) | Lire le catalogue | S'inscrire, annuler la sienne | Lire la sienne | — |
| Finance | Lire | Lire | — | Lire, exporter |

Le formateur ne voit que ses sessions, et le stagiaire que ses données : ce sont des permissions fondées sur des attributs (voir [4.16 ABAC](04-identite-iam-autorisation.md#416-abac)).

#### Étape 6 : workflows

| Workflow | Déclencheur | Étapes |
|---|---|---|
| Inscription | Demande d'un stagiaire | Contrôle de la capacité, puis confirmation ou liste d'attente, notification |
| Promotion de la liste d'attente | Annulation d'une inscription | La première personne en attente est confirmée et notifiée |
| Confirmation de session | J-7 avant le début | Si effectif minimal atteint : confirmation et notifications. Sinon : décision du responsable (annuler ou prolonger), avec escalade après 48 heures |
| Clôture | Fin de la session | Saisie des présences, attestations, clôture |

Événements émis : `session.confirmed`, `session.cancelled`, `enrollment.confirmed`, `enrollment.waitlisted`, `certificate.issued`.

#### Étape 7 : configuration (extrait)

```json
{
  "resource_type": "session",
  "fields": [
    { "key": "course", "type": "reference", "target": "course", "required": true },
    { "key": "starts_at", "type": "datetime", "required": true },
    { "key": "capacity", "type": "integer", "min": 1, "required": true },
    { "key": "min_attendees", "type": "integer", "min": 1, "required": true }
  ],
  "states": ["draft", "open", "confirmed", "in_progress", "completed", "closed", "cancelled"],
  "transitions": [
    { "key": "confirm", "from": ["open"], "to": "confirmed",
      "allowed_roles": ["training_manager"],
      "guards": [ { "expr": "confirmed_enrollments >= min_attendees",
                    "message": "L'effectif minimal n'est pas atteint." } ] }
  ],
  "invariants": [
    { "key": "capacity", "assert": "confirmed_enrollments <= capacity" },
    { "key": "room_free", "assert": "no_overlap(room, period)" },
    { "key": "trainer_free", "assert": "no_overlap(trainer, period)" }
  ],
  "schedule": [
    { "key": "check_minimum", "at": "starts_at - P7D", "action": { "start_workflow": "session_confirmation" } }
  ]
}
```

La configuration est d'abord publiée en **bac à sable**, avec des données d'essai importées d'un des tableurs.

#### Étape 8 : expérience

| Rôle | Accueil | Éléments clés |
|---|---|---|
| Responsable pédagogique | Tableau de bord « Sessions à risque » | Sessions sous l'effectif minimal à J-14, taux de remplissage, décisions en attente |
| Assistante de formation | Liste « Inscriptions à traiter » | Vues par session, actions en masse pour confirmer |
| Formateur | « Mes prochaines sessions » | Feuille de présence |
| Stagiaire | Catalogue et « Mes inscriptions » | Inscription en un clic, attestation à télécharger |

#### Vérification par des scénarios

| Scénario | Résultat |
|---|---|
| Une session est pleine, un stagiaire se désiste, la liste d'attente avance | Configuration |
| Un formateur tombe malade, on le remplace | Configuration (R2 et R4 contrôlent le remplaçant) |
| L'effectif minimal n'est pas atteint à J-7 | Configuration (workflow avec décision et escalade) |
| Export des heures de formation vers un organisme de financement | Extension (connecteur propre au financeur) |
| Calcul de présence par demi-journée avec tolérances particulières | Lacune : le calcul exige une fonction non disponible, à intégrer comme capacité générique |

**Résultat.** Sur dix scénarios, huit passent par configuration, un demande une extension (le connecteur du financeur), un révèle une lacune de la plateforme (un type de calcul de durée). La configuration complète est publiée en trois semaines, dont une consacrée aux ateliers.

**Limites.** Les experts ont fait émerger une règle non dite au troisième atelier : les sessions inter-entreprises ne peuvent pas être annulées dans les 48 heures qui précèdent leur début. Elle a été ajoutée à l'étape 4 : c'est la raison d'être de l'itération. D'autres règles apparaîtront à l'usage, d'où la gouvernance de la configuration (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les étapes de la démarche, dans l'ordre ?
2. **Compréhension.** Quel livrable attend-on à l'étape des états ?
3. **Compréhension.** Comment classe-t-on le résultat d'un scénario de vérification ?
4. **Pourquoi.** Pourquoi les règles se définissent-elles après les états et avant les rôles ?
5. **Raisonnement pratique.** Un client fournit un tableur de 40 colonnes et demande de « le mettre dans la plateforme ». Comment procédez-vous ?

#### Réponses

1. Découverte du domaine, ressources, relations, états, règles, rôles, workflows, configuration de la plateforme, expérience métier, avec une vérification par scénarios à chaque étape.
2. Un diagramme d'états et de transitions par ressource qui a un cycle de vie, avec pour chaque transition qui la déclenche et sous quelles conditions.
3. En quatre résultats : passe par configuration, demande une extension, révèle une lacune de la plateforme, ou révèle une erreur de modèle (retour à l'étape concernée).
4. Parce que beaucoup de règles portent sur les états (une garde de transition), donc l'état doit exister avant la règle. Et les rôles dépendent des règles : on ne peut pas dire qui peut faire une action tant qu'on n'a pas établi quand elle est permise.
5. Je ne le recopie pas tel quel. Je le décode : colonnes en champs, regroupements en types de ressources, couleurs en états, formules en règles, commentaires en exceptions. Je valide avec les experts sur des scénarios, puis je configure par petits lots en bac à sable.

## 15.2 Étude de cas, maintenance d'une flotte aérienne

### 1. Comprendre simplement

Ce cas applique toute la démarche à une **compagnie aérienne régionale** qui doit gérer la **maintenance de sa flotte** : inspections programmées, constats, bons de travail, remises en service, consignes des autorités. C'est le domaine **aéronautique** (*aeronautics*) qui sert de fil rouge au parcours depuis le premier module.

**Pourquoi cela existe.** Ce domaine est un excellent terrain d'essai, parce qu'il réunit presque toutes les difficultés d'une plateforme : un cycle de vie contrôlé, des règles fortes venues de l'extérieur, des preuves à conserver, des échéances qui dépendent du temps et de l'usage, des rôles séparés, et des échanges avec des systèmes externes. Si le moteur y tient, il tient dans des domaines moins exigeants.

**Problème résolu.** Montrer, sur un cas complet, comment les concepts des quatorze premiers modules se composent, et comment le résultat se configure.

**Modèle mental.** Le carnet d'entretien d'une voiture, à l'échelle d'une flotte, avec des échéances imposées par des autorités et des preuves à fournir. Chaque intervention est datée, signée, et le véhicule ne repart que lorsque la personne habilitée l'a déclaré apte.

**Où l'analogie s'arrête.** Le propriétaire d'une voiture décide seul. Une compagnie est tenue par des règles externes, et chaque action doit être traçable, attribuée et conservée. Une erreur peut avoir des conséquences pour la sécurité des personnes.

**Exemple.** Une autorité publie une consigne qui impose le contrôle d'un composant sur certains aéronefs dans un délai donné. La plateforme identifie les aéronefs concernés, crée les tâches, les planifie, enregistre les constats, contrôle la remise en service, et produit la preuve de conformité.

**Les composants.**

1. le **contexte** : sous-domaines, langage, contextes ;
2. les **ressources** et leurs **relations** ;
3. les **états** et les **règles** ;
4. les **rôles** et les **workflows** ;
5. la **dimension temporelle** : échéances, versions datées ;
6. la **configuration**, l'**expérience** et les **intégrations** ;
7. l'**audit** et l'**exploitation**.

**Objectif d'apprentissage :** vous pouvez décrire, de bout en bout, comment un domaine réglementé se modélise avec les primitives de la plateforme, et repérer ce qui reste hors configuration.

### 2. Connaissances essentielles

#### Définition

**Étude de cas de maintenance aéronautique** : application de la démarche « nouveau domaine → plateforme configurée » (voir [15.1 De nouveau domaine à plateforme configurée](#151-de-nouveau-domaine-à-plateforme-configurée)) à la gestion de la maintenance d'une flotte régionale, avec ses ressources, états, règles, rôles, workflows et exigences de preuve.

#### Idées fondamentales

1. **Le cœur est la planification et la conformité.** Le stockage des aéronefs n'est qu'un support.
2. **Les états portent la sécurité.** Un aéronef n'est utilisable que dans un état contrôlé, et les transitions sont gardées.
3. **La preuve vaut autant que l'action.** Qui a fait quoi, quand, avec quelle règle : tout est tracé et conservé.
4. **Les échéances sont temporelles et multiples.** Calendrier, heures de vol, cycles : la première limite atteinte décide.
5. **La séparation des tâches est un invariant.** Qui exécute n'est pas qui vérifie, ni qui libère.
6. **Les règles viennent de l'extérieur et changent à des dates.** On les configure avec des dates d'effet.
7. **Certaines exigences restent hors configuration.** Calculs d'optimisation, échanges avec les autorités : ce sont des extensions et des intégrations.

#### Vocabulaire essentiel

- **Programme d'entretien** (*maintenance programme*) : ensemble des tâches de maintenance et de leurs intervalles pour un type d'aéronef.
- **Inspection programmée** (*scheduled inspection*) : contrôle déclenché par une échéance (calendaire, en heures de vol ou en cycles).
- **Constat** (*finding*) : anomalie observée lors d'une inspection ou en exploitation.
- **Bon de travail** (*work order*) : ensemble des tâches à réaliser sur un aéronef, avec les heures prévues et les autorisations.
- **Remise en service** (*release to service*) : décision, prise par une personne habilitée, qui autorise le retour en exploitation.
- **Consigne de navigabilité** (*airworthiness directive*) : instruction obligatoire émise par une autorité pour corriger une situation affectant la sécurité.
- **Navigabilité** (*airworthiness*) : aptitude d'un aéronef à voler en sécurité, conformément à la réglementation.
- **Cycle** (*cycle*) : un décollage et un atterrissage, unité d'usure de certaines pièces.
- **Pièce à vie limitée** (*life-limited part*) : composant à remplacer à une limite d'heures, de cycles ou de calendrier.
- **Liste d'équipements minimale** (*minimum equipment list*) : liste qui précise quels équipements peuvent être inopérants, sous conditions, pour poursuivre l'exploitation.

#### Relations de cause à effet

- Le statut de l'aéronef est un seul champ libre. Rien n'interdit de le remettre en service avec une tâche ouverte, et la preuve de contrôle manque.
- Les échéances sont stockées comme une date saisie à la main. Elles ne tiennent pas compte des heures de vol, ni des changements de règle.
- La même personne peut exécuter et libérer. Une erreur ou une fraude n'est plus détectable.
- Les intervalles sont écrasés lors d'un changement de réglementation. Les décisions passées ne sont plus explicables.

#### Idées reçues

- **« La maintenance, c'est un CRUD sur des aéronefs. »** Ce sont des états gardés, des règles, des échéances, des preuves et des rôles.
- **« La conformité se prouve avec la dernière valeur. »** Elle se prouve avec l'historique : ce qui s'appliquait, à quelle date, et qui l'a validé.
- **« Un seul statut suffit. »** Au moins trois dimensions coexistent : le cycle de vie administratif, l'état technique (conformité aux échéances) et la disponibilité opérationnelle.

#### Principe clé

Dans un domaine réglementé, le modèle met des états gardés, des règles datées, des rôles séparés et une trace complète au centre, et le reste se déduit de ces primitives.

#### Si vous ne retenez que trois choses

1. Les états gardés, les règles datées et les rôles séparés portent la sécurité et la conformité.
2. La preuve se construit par l'historique, les versions de règles et la trace des décisions.
3. La configuration couvre l'essentiel ; les calculs spécialisés et les échanges avec les autorités sont des extensions.

### 3. Explication technique détaillée

**Cadre.** Ce modèle est une **simplification pédagogique**. Les exigences réelles dépendent de l'autorité, du type d'exploitation et des approbations de l'organisme. Il montre la démarche, il ne constitue pas une référence réglementaire.

#### Le contexte et les sous-domaines

| Sous-domaine | Type | Contexte délimité | Raison |
|---|---|---|---|
| Planification des inspections | Cœur | Planification | Disponibilité de la flotte, utilisation des hangars |
| Suivi des constats et conformité | Cœur | Maintenance et qualité | Sécurité, preuve, relations avec l'autorité |
| Gestion des pièces et composants | Support | Stocks | Nécessaire, propre au parc |
| Exploitation des vols | Support | Exploitation | Source des heures et des cycles |
| Identité et accès | Générique | Identité (déléguée) | Fédération (voir [4.10 OpenID Connect](04-identite-iam-autorisation.md#410-openid-connect)) |
| Facturation interne | Générique | Finance | Intégration comptable |

```text
Planification ──► (événements : aéronef immobilisé, remis en service) ◄── Maintenance et qualité
      ▲                                                                       │
      │ heures et cycles (API publiée)                                        │ ACL (traduction)
      │                                                                       ▼
Exploitation des vols                                               Système qualité externe
```

#### Le langage

| Terme retenu | Synonymes rejetés | Remarque |
|---|---|---|
| Aéronef | Avion, appareil | Le parc comprend aussi des hélicoptères |
| Immobiliser | Mettre à l'arrêt, *grounding* | Passage de « actif » à « en inspection » |
| Remettre en service | Libérer, *release* | Décision signée, jamais automatique |
| Constat | Anomalie, écart, défaut | Un constat a une gravité |
| Bon de travail | Ordre de travail, OT | Regroupe des tâches et un budget d'heures |

#### Les ressources et les relations

```text
Aéronef (aircraft)
├── est d'un ────── Type d'aéronef (aircraft_type) : intervalles, limites
├── est basé à ──── Base (base)
├── porte ───────── Composants installés (component_install) ──► Composant (component)
├── a ───────────── Vols programmés (flight)
├── a ───────────── Tâches de maintenance (maintenance_task)
├── a ───────────── Constats (finding)
└── fait l'objet de Bons de travail (work_order) ⊃ Lignes (work_order_line)

Consigne de navigabilité (directive) ──applicable à──► types, plages de numéros de série, composants
```

| Ressource | Champs principaux | Remarque |
|---|---|---|
| `aircraft` | immatriculation, type, base, état, heures et cycles cumulés, prochaine échéance | Entité, agrégat propre |
| `aircraft_type` | intervalles (jours, heures, cycles), limites | Valeurs datées (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| `maintenance_task` | aéronef, description, échéance, état, exécutant, vérificateur | Entité propre |
| `finding` | aéronef, type, gravité, mesure (si usure), état | Entité propre |
| `work_order` | aéronef, heures autorisées, lignes, état | Racine d'agrégat (voir [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat)) |
| `component` | référence, numéro de série, limites de vie | Pièce à vie limitée |
| `directive` | référence, applicabilité, délai, exigences | Déclenche des tâches |

#### Les états

```text
aéronef :   actif ──immobiliser──► en inspection ──remettre en service──► actif
               │                         │
               └──────── retirer ────────┴──► retiré

tâche :     planifiée ─► en cours ─► à vérifier ─► close
                │             │
                └─────────────┴──► annulée

constat :   ouvert ─► en analyse ─► corrigé ─► vérifié ─► clos
                           └──► différé (échéance et approbation requises)
```

Trois **dimensions** distinctes sont séparées plutôt que fondues dans un seul champ :

| Dimension | Exemple de valeurs | Nature |
|---|---|---|
| Cycle de vie administratif | actif, en inspection, retiré | État géré par des transitions |
| Conformité aux échéances | à jour, échéance proche, en retard | Calculée à partir des échéances et de la date |
| Disponibilité opérationnelle | disponible, affecté, indisponible | Dérivée des vols et des états |

#### Les règles et les invariants

| Règle | Type | Énoncé | Niveau |
|---|---|---|---|
| A1 | Invariant | Un aéronef retiré n'est affecté à aucun vol ni à aucune tâche | Domaine |
| A2 | Garde | Immobiliser exige qu'aucun vol ne soit programmé dans les 24 h | Tenant |
| A3 | Garde | Remettre en service exige que toutes les tâches soient closes et qu'aucun constat critique ne reste ouvert | Tenant |
| A4 | Séparation des tâches | Qui exécute un contrôle ne le vérifie pas et ne remet pas l'aéronef en service | Sécurité |
| A5 | Calcul | L'échéance est la première limite atteinte entre calendrier, heures et cycles | Domaine |
| A6 | Invariant | Un hangar n'accueille pas plus d'aéronefs que sa capacité sur une période | Domaine |
| A7 | Validation | Un constat d'usure exige une mesure | Tenant |
| A8 | Temporelle | L'intervalle applicable est celui en vigueur à la date de l'inspection | Domaine |
| A9 | Conformité | Toute consigne applicable à un aéronef génère une tâche dans les 24 h | Tenant |
| A10 | Politique | Seul le directeur technique peut retirer un aéronef | Tenant |

Les règles A1, A4 et A6 sont des **invariants** (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)), tandis qu'A2, A3 et A7 sont des **gardes** et des validations propres au tenant (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) et [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)).

#### Les rôles et permissions

| Rôle | Aéronef | Tâche | Constat | Bon de travail | Remise en service | Retrait |
|---|---|---|---|---|---|---|
| Planificateur | Lire, immobiliser (sa base) | Créer, affecter | Lire | Créer | — | — |
| Technicien | Lire | Exécuter les siennes | Créer, documenter | Lire | — | — |
| Responsable qualité | Lire | Vérifier | Approuver, clore | Approuver | Oui | — |
| Directeur technique | Lire | Lire | Lire | Lire | — | Oui |
| Auditeur | Lecture seule | Lecture seule | Lecture seule | Lecture seule | — | — |
| Administrateur du tenant | Configurer | — | — | — | — | — |

Les conditions sont fondées sur des attributs (voir [4.16 ABAC](04-identite-iam-autorisation.md#416-abac)) : le technicien ne voit et ne modifie que ses tâches, le planificateur ne traite que sa base, et A4 interdit à la même personne de cumuler certains rôles sur une même intervention.

#### Les workflows et les événements

| Workflow | Déclencheur | Étapes essentielles | Événements |
|---|---|---|---|
| Inspection programmée | Échéance à J-14 | Création de la tâche, notification, affectation d'un créneau | `task.created` |
| Immobilisation | Décision du planificateur | Garde A2, motif, création des tâches liées | `aircraft.grounded` |
| Exécution et constats | Début de la tâche | Saisie des mesures, constats, documents | `finding.reported` |
| Constat critique | Constat de gravité critique | Approbation du responsable qualité, escalade après 4 h | `finding.critical` |
| Remise en service | Fin des tâches | Garde A3, vérification, signature | `aircraft.released` |
| Consigne de navigabilité | Publication d'une consigne | Voir l'application pratique | `directive.published` |

#### La dimension temporelle

Les intervalles du programme d'entretien sont des **valeurs datées** (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)). L'échéance d'une inspection est la première limite atteinte :

$$\text{échéance} = \min\left(d_{\text{cal}},\ d_{\text{heures}},\ d_{\text{cycles}}\right)$$

- $d_{\text{cal}}$ : date de la dernière inspection augmentée de l'intervalle en jours ;
- $d_{\text{heures}}$ : date prévue à laquelle le cumul d'heures de vol atteindra la limite, d'après l'utilisation prévue ;
- $d_{\text{cycles}}$ : date prévue d'atteinte de la limite de cycles.

Chaque décision d'échéance conserve la **version de règle** et l'**instant** d'évaluation, pour qu'un audit puisse la rejouer (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

#### La configuration

```json
{
  "resource_type": "aircraft",
  "states": ["active", "in_inspection", "retired"],
  "transitions": [
    { "key": "ground", "label": "Immobiliser", "from": ["active"], "to": "in_inspection",
      "allowed_roles": ["planner"],
      "guards": [ { "expr": "count(flights where status = 'scheduled' and start < now() + 24h) = 0",
                    "message": "Un vol est programmé dans les 24 h." } ],
      "requires": ["reason"] },
    { "key": "release", "label": "Remettre en service", "from": ["in_inspection"], "to": "active",
      "allowed_roles": ["quality_manager"],
      "guards": [ { "expr": "all(tasks, t => t.status = 'closed') and count(findings where severity = 'critical' and status != 'closed') = 0" } ],
      "segregation": { "not_same_person_as": ["task.executor", "task.verifier"] } },
    { "key": "retire", "label": "Retirer du service", "from": ["active", "in_inspection"], "to": "retired",
      "allowed_roles": ["technical_director"] }
  ],
  "invariants": [
    { "key": "retired_not_allocatable", "assert": "aircraft.status != 'retired' for allocation" }
  ]
}
```

#### L'expérience

| Rôle | Accueil | Éléments clés |
|---|---|---|
| Planificateur | « Planification de la flotte » | Calendrier par aéronef, vues par base, simulation d'immobilisations |
| Technicien | « Mes tâches » | Fiches de tâche en mode hors ligne, saisie de mesures |
| Responsable qualité | « En attente de décision » | Constats critiques, remises en service, preuves |
| Directeur technique | « Santé de la flotte » (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)) | Disponibilité, retards, tendances |
| Auditeur | « Conformité » | Historique, preuves, exports |

#### Les intégrations et les extensions

| Besoin | Réponse | Niveau |
|---|---|---|
| Système qualité de l'entreprise | Connecteur avec couche anticorruption (voir [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) et [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité)) | Intégration |
| Heures et cycles issus de l'exploitation | Interface programmatique ou synchronisation planifiée (voir [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)) | Intégration |
| Optimisation du placement des inspections dans les hangars | Service d'optimisation appelé par un point d'extension (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) | Extension |
| Échanges avec l'autorité | Export de preuves, selon le format exigé | Extension |

#### L'audit et l'exploitation

- **Preuve** : chaque transition conserve l'acteur, l'instant, le motif, la version de règle et l'état avant/après (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) et [9.2 Acteur, horodatage, avant et après, motif](09-audit-versionnement-gouvernance.md#92-acteur-horodatage-avant-et-après-motif)).
- **Conservation** : la durée est fixée par la réglementation et les contrats, avec des protections contre la modification (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- **Disponibilité** : les tablettes des hangars fonctionnent hors ligne, et se resynchronisent (voir [12.5 Formulaires et assistants](12-produit-ux.md#125-formulaires-et-assistants)).
- **Reprise** : les enregistrements de maintenance ont des objectifs de reprise stricts (voir [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto)).
- **Isolation** : les données de la compagnie sont isolées de celles des autres tenants (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).

#### Les modes de défaillance

- **Un statut unique** pour tout, sans dimensions séparées.
- **Des échéances saisies à la main**, non recalculées.
- **L'absence de séparation des tâches** dans le modèle de rôles.
- **L'écrasement des intervalles** lors d'un changement de règle.
- **Des constats en texte libre**, donc non analysables.
- **Une configuration non versionnée**, qui rend la preuve impossible.

**Contre-exemple.** Une compagnie stocke le statut d'un aéronef dans un seul champ « Statut » avec les valeurs « OK », « À vérifier », « HS », modifiable par tous. Après une inspection, un technicien met « OK » directement. Aucun contrôle n'exige que les tâches soient closes, ni qu'une personne habilitée décide. L'autorité demande la preuve : la plateforme ne peut ni la fournir ni garantir qu'elle est complète.

**Limites.** Ce modèle ne couvre ni la gestion détaillée des stocks de pièces, ni la planification des équipes, ni les approbations propres à chaque autorité. Il ne remplace pas les exigences réglementaires : il montre comment elles s'expriment avec les primitives de la plateforme. Un déploiement réel exige un travail avec l'organisme d'entretien et ses autorités de tutelle.

### 4. Relations avec les autres concepts

| Module | Rôle dans le cas |
|---|---|
| 1. Architecture SaaS | Tenant, plans de contrôle et de données, frontières de service |
| 2. Données et ressources | Types, champs, relations, contraintes, historique des valeurs |
| 3. CRUD et runtime | Moteur de ressources, transitions, idempotence, opérations en masse |
| 4. Identité et autorisation | Rôles, périmètres par base, séparation des tâches |
| 5. Multi-tenancy | Isolation, configuration propre à la compagnie |
| 6. Workflow, état et règles | États gardés, approbations, règles d'échéance |
| 7. Événements et automatisation | `aircraft.grounded`, rappels d'échéance, notifications |
| 8. Plateforme d'administration | Configuration par le responsable qualité, sans développeur |
| 9. Audit et gouvernance | Preuve de conformité, versions de règles, revue des changements |
| 10. API et extensibilité | Système qualité, heures de vol, optimisation |
| 11. Sécurité et exploitation | Disponibilité, sauvegarde, reprise, observabilité |
| 12. UX | Tableaux de bord, tablettes hors ligne, explicabilité des refus |
| 13 et 14. Transversaux et DDD | Invariants, temps, politiques, agrégats, événements |

### 5. Application pratique

**Situation initiale.** Une autorité publie une consigne de navigabilité : tout aéronef d'un type donné, équipé d'un composant dans une plage de numéros de série, doit subir un contrôle dans les 30 jours ou 100 heures de vol, la première échéance atteinte. La compagnie compte 52 aéronefs, dont 5 retirés du service.

**Problème.** Identifier les aéronefs concernés, planifier les contrôles sans désorganiser les vols, assurer l'exécution, et produire la preuve de conformité, dans les délais.

**Application du concept.** Le parcours complet sur la plateforme configurée.

**Déroulé.**

1. **Réception.** Le responsable qualité crée la ressource `directive` avec la référence, le type visé, la plage de numéros de série, le délai et l'exigence. L'événement `directive.published` est émis.
2. **Applicabilité.** Une règle (A9) évalue chaque aéronef : type, composant installé, numéro de série. 12 aéronefs sont concernés. Les aéronefs retirés sont exclus par A1.
3. **Création des tâches.** Un workflow crée les 12 tâches avec leur échéance, calculée selon A5 et A8. Les planificateurs reçoivent une notification groupée.
4. **Planification.** Les planificateurs affectent des créneaux de hangar, la capacité étant contrôlée par A6. La **simulation** (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)) montre que 3 aéronefs ont des vols programmés pendant le créneau souhaité : le planificateur décale les créneaux, et A2 empêche toute immobilisation illégitime.
5. **Exécution.** Les techniciens exécutent les contrôles, hors ligne si nécessaire, et saisissent mesures et constats. Un constat critique est signalé sur l'un des aéronefs : le responsable qualité approuve la correction, avec escalade après 4 heures.
6. **Remise en service.** Pour chaque aéronef, le responsable qualité remet en service si A3 est satisfaite. A4 garantit qu'il n'a pas exécuté le contrôle.
7. **Preuve.** Le rapport de conformité liste, par aéronef, la tâche, l'exécutant, le vérificateur, les mesures, les dates, la version de la consigne et celle des règles. Un export est transmis à l'autorité par un connecteur dédié.

**Résultat.** Onze aéronefs sont conformes dans le délai. Le douzième, immobilisé plus longtemps à cause d'une pièce à commander, est remis en service après 4 jours de plus, avec une dérogation approuvée et tracée. La preuve complète est produite en quelques minutes, et la plateforme n'a nécessité aucun développement spécifique, sauf le connecteur d'export.

**Limites.** L'interprétation de la consigne (applicabilité exacte) reste une décision humaine, validée par la qualité. La qualité des données (composants installés, numéros de série) conditionne le résultat : une donnée erronée produit une applicabilité erronée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi sépare-t-on le cycle de vie administratif, la conformité aux échéances et la disponibilité opérationnelle ?
2. **Compréhension.** Quels invariants protègent la sécurité dans ce modèle ?
3. **Compréhension.** Comment l'échéance d'une inspection est-elle calculée ?
4. **Pourquoi.** Pourquoi la séparation des tâches est-elle exprimée comme un invariant plutôt que comme une convention ?
5. **Raisonnement pratique.** Une nouvelle consigne exige un contrôle dans les 15 jours pour 20 aéronefs. Quelles étapes la plateforme exécute-t-elle, et où l'intervention humaine est-elle indispensable ?

#### Réponses

1. Parce que ces trois dimensions n'ont pas la même nature : la première est gérée par des transitions, la deuxième est calculée à partir des échéances et de la date, la troisième est dérivée des vols et des états. Les confondre dans un seul champ rend les règles ambiguës.
2. Un aéronef retiré n'est affecté à rien (A1), qui exécute ne vérifie ni ne libère (A4), et un hangar n'est pas surchargé (A6). Les gardes A2 et A3 complètent le dispositif au niveau des transitions.
3. Comme la première limite atteinte entre la limite calendaire, la limite d'heures de vol et la limite de cycles, avec l'intervalle applicable à la date de l'inspection (règles datées).
4. Parce qu'une convention peut être oubliée ou contournée, alors qu'un invariant est appliqué par le moteur pour toutes les voies d'entrée : il est vérifiable et auditable.
5. La plateforme crée la consigne, détermine l'applicabilité par règle, génère les tâches avec leur échéance, notifie, contrôle les capacités et les gardes, trace tout, et produit la preuve. L'humain est indispensable pour interpréter la consigne, valider l'applicabilité, arbitrer les conflits de planning, exécuter les contrôles et décider de la remise en service.

## 15.3 Études de cas comparées, santé, industrie et logistique

### 1. Comprendre simplement

Cette entrée applique la même démarche à trois autres domaines : la **santé** (un hôpital qui gère ses lits et ses interventions), l'**industrie** (une usine qui gère sa production et la maintenance de ses machines) et la **logistique** (un opérateur qui suit des expéditions). On compare ensuite avec l'aéronautique pour voir **ce qui reste constant** et **ce qui varie**.

**Pourquoi cela existe.** Une plateforme n'est agnostique que si elle le prouve. Un modèle qui ne marche que pour l'aviation est un SaaS vertical déguisé. En configurant des domaines très différents avec les mêmes primitives, on vérifie la généricité du moteur, et l'on apprend à reconnaître les **patrons** qui se retrouvent d'un domaine à l'autre.

**Problème résolu.** Passer de « je sais configurer un domaine » à « je sais configurer un domaine que je ne connais pas », en identifiant ce qui se réutilise et ce qui relève du secteur.

**Modèle mental.** Un même jeu de pièces de construction, avec lequel on assemble trois maquettes : un hôpital, une usine, un entrepôt. Les briques (ressources, états, règles, rôles, événements) sont identiques. Les maquettes diffèrent par leur assemblage et par les contraintes propres à chaque lieu.

**Où l'analogie s'arrête.** Des briques n'imposent aucune contrainte de sécurité. Chaque secteur ajoute les siennes : confidentialité des données de santé, traçabilité des produits, chaîne de garde des colis. Elles doivent être comprises et modélisées, pas empruntées au cas précédent.

**Exemple.** Un même patron, la **libération après contrôle**, se retrouve partout : un aéronef est remis en service après inspection, un lit est remis à disposition après nettoyage, un lot est libéré après contrôle qualité, un véhicule reprend la route après vérification.

**Les composants.**

1. un **domaine** et ses sous-domaines ;
2. ses **ressources**, **états** et **règles** ;
3. ses **rôles**, **workflows** et **événements** ;
4. ses **contraintes** propres (réglementation, volumes) ;
5. les **patrons** partagés avec d'autres domaines.

**Objectif d'apprentissage :** vous pouvez configurer mentalement trois domaines avec les mêmes primitives, comparer leurs contraintes, et extraire un patron réutilisable.

### 2. Connaissances essentielles

#### Définition

**Étude comparée de domaines** : analyse parallèle de la configuration de plusieurs domaines avec les mêmes primitives de la plateforme, pour distinguer ce qui est commun (les patrons) de ce qui est propre au secteur (les contraintes, les volumes, le langage).

#### Idées fondamentales

1. **Les primitives sont les mêmes.** Seules les définitions changent : types, états, règles, rôles.
2. **Chaque secteur apporte ses invariants.** Confidentialité, traçabilité, chaîne de garde : ils ne se déduisent pas du cas précédent.
3. **Des patrons se retrouvent partout.** Libération après contrôle, capacité et exclusion, chaîne de garde, approbation à deux.
4. **La sensibilité des données varie.** Les données de santé exigent une protection particulière.
5. **Le rythme et le volume varient.** Un hôpital vit en temps réel ; une logistique reçoit des millions d'événements par jour.
6. **Le langage est celui du secteur.** Chaque domaine a son glossaire (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).
7. **Les extensions diffèrent.** Dispositifs médicaux, automates industriels, géolocalisation : ce sont des intégrations propres au secteur.

#### Vocabulaire essentiel

- **Patron métier** (*business pattern*) : solution de configuration récurrente, réutilisable d'un domaine à l'autre.
- **Chaîne de garde** (*chain of custody*) : suite ininterrompue des détenteurs successifs d'un objet, avec date et responsable de chaque transfert.
- **Traçabilité** (*traceability*) : capacité de reconstituer l'historique et l'origine d'un élément.
- **Lot** (*batch*, *lot*) : groupe d'unités produites ensemble, suivi comme un ensemble.
- **Ordre de fabrication** (*production order*) : demande de produire une quantité d'un produit.
- **Donnée de santé** (*health data*) : donnée à caractère personnel relative à la santé, soumise à des règles renforcées.
- **Tournée** (*route*) : suite d'arrêts effectués par un véhicule pour livrer ou collecter.
- **Preuve de livraison** (*proof of delivery*) : trace de la remise à destination (signature, photo, horodatage).
- **Taux de rendement global** (*overall equipment effectiveness*, OEE) : indicateur de performance d'un équipement industriel.

#### Relations de cause à effet

- On copie la configuration aéronautique en changeant les noms. Les invariants propres au secteur manquent, et le modèle semble correct tout en étant dangereux.
- On traite les événements d'un opérateur logistique comme des ressources ordinaires. Le volume sature la base, et l'historique de chaque colis devient illisible.
- On applique à un hôpital les mêmes droits d'accès qu'à une usine. Des professionnels non impliqués voient des dossiers de patients.
- On ignore le patron commun. Chaque domaine réinvente la libération après contrôle, avec ses propres erreurs.

#### Idées reçues

- **« Chaque secteur exige une plateforme différente. »** Les primitives sont communes. Les contraintes se configurent ou s'étendent.
- **« Les états sont les mêmes partout. »** Les noms et les transitions diffèrent. Seuls les patrons se ressemblent.
- **« La santé n'est qu'une question de permissions. »** Elle ajoute aussi le consentement, la minimisation, la traçabilité des accès et des exigences d'hébergement.

#### Principe clé

Le moteur reste le même : on reconnaît les patrons communs pour les réutiliser, et l'on modélise explicitement les contraintes propres à chaque secteur.

#### Si vous ne retenez que trois choses

1. Les mêmes primitives configurent des domaines très différents.
2. Les patrons (libération après contrôle, capacité, chaîne de garde) se réutilisent ; les contraintes sectorielles se modélisent.
3. Les volumes, la sensibilité des données et la réglementation changent d'un secteur à l'autre.

### 3. Explication technique détaillée

**Cadre.** Comme pour l'aéronautique, les modèles ci-dessous sont des **simplifications pédagogiques**. Les exigences réglementaires et normatives de chaque secteur prévalent, et se vérifient avec les experts concernés.

#### Le même squelette

| Étape | Santé | Industrie | Logistique |
|---|---|---|---|
| Ressource centrale | Lit, séjour | Machine, lot | Colis, expédition |
| Cycle de vie clé | Libre, occupé, à nettoyer | En production, en maintenance, en panne | Pris en charge, en transit, livré |
| Rôles | Infirmier, médecin, gestionnaire de lits | Opérateur, qualité, maintenance | Expéditeur, chauffeur, exploitant d'entrepôt |
| Événements | Admission, transfert, sortie | Ordre lancé, lot libéré, panne | Scan, transfert, livraison |
| Règles fortes | Un lit, un patient ; accès limité au dossier | Lot libéré après contrôle ; matières traçables | Un colis, un lieu ; chaîne de garde |

#### Santé : lits et interventions

**Ressources.** `patient`, `stay` (séjour), `bed`, `ward` (service), `procedure` (intervention), `staff` (professionnel), `operating_room`.

**Relations.** Le séjour référence le patient. L'**affectation d'un lit** relie un séjour à un lit sur une **période** (modélisation temporelle, voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)). Le lit appartient à un service.

```text
lit :       libre ─► occupé ─► à nettoyer ─► en nettoyage ─► libre
              │                                  │
              └───────────► bloqué (maintenance) ┘

séjour :    admis ─► hospitalisé ─► sorti

intervention :  planifiée ─► préparée ─► en cours ─► terminée
                     └──────────────► annulée
```

| Règle | Type | Énoncé |
|---|---|---|
| S1 | Invariant | Un lit n'est occupé que par un patient à la fois (exclusion sur la période) |
| S2 | Garde | Un lit « à nettoyer » ne peut pas être attribué |
| S3 | Garde | Une intervention exige un consentement documenté |
| S4 | Politique | L'accès au dossier est réservé aux professionnels impliqués dans la prise en charge |
| S5 | Audit | Tout accès au dossier d'un patient est journalisé |
| S6 | Accès d'urgence | Un accès exceptionnel est possible, avec motif, tracé et revu (voir [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime)) |

**Particularités.**

- Les **données de santé** constituent une catégorie particulière de données personnelles, soumise à des règles renforcées (au sein de l'Union européenne, l'article 9 du règlement général sur la protection des données). D'autres juridictions ont leurs propres cadres, par exemple HIPAA aux États-Unis. Certains pays imposent aussi des exigences d'hébergement (en France, la certification d'hébergeur de données de santé). Ces exigences se vérifient pays par pays.
- L'**audit des lectures** n'est pas facultatif : savoir qui a consulté quel dossier fait partie de la preuve (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- L'**isolation** entre établissements et entre services est stricte (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
- Les échanges de données cliniques s'appuient souvent sur des standards comme HL7 FHIR, via des connecteurs (voir [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)).

**Expérience.** Un tableau des lits par service, lisible d'un coup d'œil, avec texte et couleur (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)) ; des listes de tâches par rôle ; des demandes de nettoyage notifiées en temps réel.

#### Industrie : production et maintenance des machines

**Ressources.** `machine`, `production_order`, `product`, `bill_of_materials` (nomenclature), `routing` (gamme), `batch` (lot), `work_station`, `maintenance_task`, `quality_check`.

**Relations.** L'ordre référence un produit, sa nomenclature et sa gamme. Un lot est produit par un ordre et **consomme** des lots de matières : c'est la **généalogie** du lot.

```text
machine :   en production ─► arrêt planifié ─► en maintenance ─► en essai ─► en production
                 │
                 └──► en panne ─► en maintenance

lot :       créé ─► en contrôle ─► libéré
                         ├──► bloqué ─► libéré / rebuté
                         └──► rebuté

ordre :     planifié ─► lancé ─► en cours ─► terminé
                              └──► suspendu
```

| Règle | Type | Énoncé |
|---|---|---|
| I1 | Garde | Un lot n'est libéré que si tous ses contrôles qualité sont conformes |
| I2 | Invariant | Chaque lot de produit fini référence les lots de matières consommés |
| I3 | Invariant | Une machine en maintenance ne reçoit pas d'ordre |
| I4 | Séparation des tâches | L'opérateur d'un lot ne le libère pas |
| I5 | Déclencheur | La maintenance préventive est déclenchée par un compteur (heures de marche, cycles) |

**Particularités.**

- La **traçabilité** permet les rappels : à partir d'un lot de matière défectueux, on retrouve tous les lots finis concernés, et leurs expéditions.
- Les **mesures de machines** sont des flux fréquents : on les traite comme des événements agrégés, pas comme des ressources par mesure (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)).
- Un indicateur courant, le taux de rendement global :

$$\text{OEE} = \text{disponibilité} \times \text{performance} \times \text{qualité}$$

 chaque facteur étant compris entre 0 et 1 : la disponibilité est la part du temps planifié où la machine produit, la performance est le rapport entre la cadence réelle et la cadence nominale, la qualité est la part des pièces conformes. Un OEE de $0{,}9 \times 0{,}95 \times 0{,}98 \approx 0{,}84$ signifie que 84 % du temps planifié est productif au rendement nominal.

- Les **échanges avec les automates et systèmes de pilotage** passent par des passerelles, souvent à l'aide de standards industriels comme OPC UA (voir [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)).

#### Logistique : expéditions et tournées

**Ressources.** `shipment`, `parcel`, `route`, `vehicle`, `driver`, `warehouse`, `location`, `scan_event`, `delivery_proof`.

**Relations.** Un colis appartient à une expédition. Une expédition est affectée à des tournées. Une tournée est réalisée par un véhicule et un chauffeur. La **position** d'un colis est son dernier lieu connu.

```text
colis :   créé ─► pris en charge ─► en transit ─► en distribution ─► livré
                                         │              │
                                         │              └──► échec de livraison ─► retourné
                                         └──► en entrepôt ─► en transit
```

| Règle | Type | Énoncé |
|---|---|---|
| L1 | Invariant | Un colis est en un seul lieu à la fois |
| L2 | Invariant | La chaîne de garde est ininterrompue : chaque transfert a un cédant et un receveur |
| L3 | Garde | Un colis livré ne redevient « en transit » que par un événement de retour |
| L4 | Invariant | Une tournée ne dépasse pas la capacité du véhicule |
| L5 | Engagement | Une livraison hors fenêtre convenue déclenche une alerte (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) |

**Particularités.**

- Le **volume** est massif : des millions d'événements de scan par jour. L'historique d'un colis est naturellement un **flux d'événements** (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)), et la page de suivi est un **modèle de lecture** (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)).
- Les événements arrivent **en retard ou dans le désordre** : un scan fait à 10 h peut arriver à 10 h 30, après un autre. Le modèle distingue l'**instant du fait** et l'**instant de réception** (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).
- Le **scan répété** (même colis, même lieu) ne doit pas créer de doublon : l'idempotence est indispensable (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- L'**optimisation de tournées** est un problème de calcul spécialisé : elle relève d'une **extension** (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).
- Le **suivi public** exige un accès en libre-service à des champs limités, par un lien à jeton, sans exposer d'autres colis (voir [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)).

#### Comparaison avec l'aéronautique

| Aspect | Aéronautique | Santé | Industrie | Logistique |
|---|---|---|---|---|
| Ressource centrale | Aéronef | Lit, patient | Machine, lot | Colis |
| Cycle de vie caractéristique | Actif, en inspection, retiré | Libre, occupé, à nettoyer | En production, en maintenance | Pris en charge, en transit, livré |
| Invariant typique | Qui exécute ne libère pas | Un lit, un patient | Traçabilité des lots | Un colis, un lieu |
| Contrainte forte | Preuve de conformité | Confidentialité des données | Rappel de produit | Volume, chaîne de garde |
| Rythme | Modéré | Temps réel | Flux de mesures | Très élevé |
| Échéances | Calendrier, heures, cycles | Rondes, durées de séjour | Compteurs de marche | Fenêtres de livraison |
| Extension typique | Optimisation de hangars | Dispositifs, dossier patient | Automates | Optimisation de tournées |

#### Les patrons communs

| Patron | Principe | Où on le retrouve |
|---|---|---|
| Libération après contrôle | Un élément bloqué n'est libéré que si les tâches sont closes, par une personne autre que l'exécutant | Remise en service, lit nettoyé, lot libéré, véhicule vérifié |
| Capacité et exclusion | Une ressource n'est pas surchargée sur une période | Hangar, lit, salle d'opération, véhicule |
| Chaîne de garde | Chaque transfert est enregistré avec cédant, receveur, date | Pièces, échantillons, colis |
| Approbation à deux | Une décision sensible exige deux personnes | Remise en service, libération de lot, retrait |
| Maintenance par compteur | Un seuil d'usage déclenche une action | Heures de vol, heures de marche, kilomètres |
| File d'exceptions | Les écarts sont regroupés et traités à part | Constats, lots non conformes, échecs de livraison |

#### Ce qui varie vraiment

- **La sensibilité des données** : très élevée en santé, modérée ailleurs, avec des contraintes spécifiques.
- **Le volume et le rythme** : de quelques centaines d'écritures par jour à des millions d'événements.
- **La réglementation** : autorités, audits, durées de conservation, exigences d'hébergement.
- **Les intégrations** : dispositifs, automates, transporteurs, systèmes d'information existants.
- **L'expérience** : terminaux mobiles de terrain, écrans d'atelier, portails publics.

#### Les modes de défaillance

- **Copier le modèle d'un autre domaine** en changeant les noms.
- **Ignorer les invariants du secteur** : confidentialité, traçabilité, chaîne de garde.
- **Sous-estimer le volume** : traiter des événements massifs comme de simples enregistrements.
- **Appliquer un patron à contre-sens** : forcer une libération après contrôle là où le métier n'en a pas.
- **Négliger les standards d'échange** du secteur.

**Contre-exemple.** Une équipe réutilise telle quelle la configuration du lit d'hôpital pour une chambre d'hôtel, parce que « un lit, un occupant, un nettoyage ». Elle importe l'accès restreint au dossier et la traçabilité des lectures, qui n'ont pas de sens ici, et elle manque la vraie règle du secteur : les réservations futures et les surréservations. Le modèle est inutilisable pour le revenu.

**Limites.** Un patron n'est pas une loi. Il faut vérifier, avec les experts du secteur, que la sémantique correspond. Les modèles sectoriels détaillés (dossier patient, nomenclatures industrielles, réseaux de transport) sont des domaines à part entière, que cette entrée n'épuise pas.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [15.1 De nouveau domaine à plateforme configurée](#151-de-nouveau-domaine-à-plateforme-configurée) | La démarche générale appliquée à chaque domaine |
| [15.2 Étude de cas, maintenance d'une flotte aérienne](#152-étude-de-cas-maintenance-dune-flotte-aérienne) | Le cas aéronautique sert de référence de comparaison |
| [14.1 Domaine et sous-domaine](14-domain-driven-design.md#141-domaine-et-sous-domaine) à [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Sous-domaines, langage et contextes de chaque secteur |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants propres à chaque secteur |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les périodes d'affectation, la maintenance par compteur et les événements en retard |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les politiques d'accès et de conformité sectorielles |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) et [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Le suivi logistique est naturellement un flux d'événements avec modèles de lecture |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) et [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | La confidentialité en santé repose sur les droits fins et l'audit des accès |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation des établissements, des usines et des clients |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) et [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les standards d'échange et les extensions propres à chaque secteur |

### 5. Application pratique

**Situation initiale.** L'équipe de configuration a déployé la remise en service d'aéronefs pour la compagnie régionale. Trois nouveaux clients arrivent presque en même temps : un hôpital (lits), une usine (lots) et un transporteur (véhicules). Chacun demande « la même chose que pour les avions, mais pour nous ».

**Problème.** Éviter de reconfigurer trois fois le même mécanisme avec des variantes divergentes, tout en respectant les différences de chaque secteur.

**Application du concept.** Extraire le patron « libération après contrôle » et en faire un **modèle de configuration** paramétré.

**Déroulé.**

1. **Abstraire.** L'équipe décrit le patron indépendamment du domaine : une ressource passe de « disponible » à « bloquée », des tâches sont créées, une personne habilitée autre que l'exécutant la libère quand toutes les tâches sont closes.
2. **Paramétrer.** Elle écrit un modèle avec des paramètres : type de ressource, états, rôles, type de tâche.

```json
{
  "template": "release_after_check",
  "parameters": ["resource_type", "available_state", "blocked_state",
                 "task_type", "releaser_role", "executor_role"],
  "definition": {
    "states": ["${available_state}", "${blocked_state}"],
    "transitions": [
      { "key": "block", "from": ["${available_state}"], "to": "${blocked_state}",
        "requires": ["reason"] },
      { "key": "release", "from": ["${blocked_state}"], "to": "${available_state}",
        "allowed_roles": ["${releaser_role}"],
        "guards": [ { "expr": "all(tasks, t => t.status = 'closed')" } ],
        "segregation": { "not_same_person_as": ["task.executor"] } }
    ]
  }
}
```

3. **Instancier** pour chaque tenant.

| Paramètre | Aéronef | Lit d'hôpital | Lot de production | Véhicule |
|---|---|---|---|---|
| `resource_type` | `aircraft` | `bed` | `batch` | `vehicle` |
| `available_state` | `active` | `free` | `released` | `available` |
| `blocked_state` | `in_inspection` | `to_clean` | `in_quality_check` | `in_maintenance` |
| `task_type` | `inspection` | `cleaning` | `quality_check` | `vehicle_inspection` |
| `releaser_role` | `quality_manager` | `ward_nurse` | `quality_engineer` | `fleet_manager` |
| `executor_role` | `technician` | `cleaning_agent` | `operator` | `mechanic` |

4. **Ajouter le spécifique.** Chaque tenant complète le modèle avec ses règles propres : l'hôpital exige l'enregistrement du produit de désinfection et la traçabilité de l'agent ; l'usine exige des mesures dans la tolérance et la référence des instruments ; le transporteur exige un contrôle de pression des pneus et un relevé du kilométrage.
5. **Vérifier par scénarios** avec les experts de chaque secteur, en bac à sable.
6. **Publier** le modèle dans le catalogue de la plateforme, versionné (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

**Résultat.** Les trois clients sont configurés en quelques jours chacun. Le patron est corrigé une seule fois quand un défaut est trouvé, et la correction se propage aux nouvelles instances après revue.

**Limites.** Les instances déjà déployées ne se mettent pas à jour automatiquement : chaque tenant a personnalisé son modèle, et une mise à jour demande une analyse d'impact (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)). Le patron ne convient pas à tous : pour un tenant dont la libération n'exige aucune vérification, il serait inutilement lourd.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui reste constant d'un domaine à l'autre, et qu'est-ce qui varie ?
2. **Compréhension.** Donnez trois patrons communs et un exemple de chacun.
3. **Compréhension.** Pourquoi le suivi logistique est-il naturellement un flux d'événements ?
4. **Pourquoi.** Pourquoi ne suffit-il pas de copier la configuration d'un domaine en changeant les noms ?
5. **Raisonnement pratique.** Un nouveau client, un laboratoire d'analyses, demande une configuration. Quels patrons recherchez-vous, et quelles contraintes sectorielles cherchez-vous à identifier ?

#### Réponses

1. Les primitives constantes sont les ressources, les états, les règles, les rôles, les workflows et les événements. Varient les définitions, les contraintes sectorielles (confidentialité, traçabilité, chaîne de garde), le volume et le rythme, la réglementation et les intégrations.
2. Libération après contrôle (remise en service d'un aéronef, libération d'un lot), capacité et exclusion (un lit pour un patient, un hangar pour des aéronefs), chaîne de garde (colis, échantillons). On peut aussi citer l'approbation à deux et la maintenance par compteur.
3. Parce que l'objet (un colis) n'a pas d'état stable : il est défini par la suite des faits (scans, transferts, livraisons) qui lui arrivent. L'historique est la donnée, et la page de suivi est une projection de ces événements.
4. Parce que chaque secteur ajoute des invariants et des exigences qui ne se déduisent pas du cas précédent : une copie paraît correcte mais manque les règles essentielles du nouveau domaine, voire en importe qui n'ont pas de sens.
5. La libération après contrôle (libérer un résultat après vérification, par une personne autre que l'exécutant), la chaîne de garde (échantillon, de la collecte au résultat), la file d'exceptions (résultats hors tolérances). Contraintes à identifier : la sensibilité des données, les exigences de traçabilité, les accréditations et audits, les échéances d'étalonnage, les volumes et les intégrations avec les instruments.

