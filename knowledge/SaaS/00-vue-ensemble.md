# Parcours de formation : construire une plateforme SaaS agnostique

Ce parcours explique, concept par concept, tout ce que le fichier `PLAN.md` demande de maîtriser pour construire une plateforme SaaS générique. Il suit la structure pédagogique définie dans `CLAUDE.md`.

Le suivi de la rédaction se trouve dans [SUIVI.md](../SUIVI.md). La correspondance entre chaque terme du plan et son explication se trouve dans [COUVERTURE.md](../COUVERTURE.md).

Des **compléments** prolongent le parcours, à partir de [PLAN-COMPLEMENTS.md](../PLAN-COMPLEMENTS.md) : voir la section « Compléments au parcours » en fin de fichier.

## Paramètres de ce parcours

| Paramètre | Valeur |
|---|---|
| Domaine technique | Architecture d'une plateforme SaaS configurable, indépendante du domaine métier |
| Langue | Français |
| Public visé | Débutant : aucune connaissance préalable du domaine n'est supposée |
| Profondeur | Détaillée |
| Objectif | Savoir construire le moteur qui permet de construire des SaaS verticaux, et non un SaaS vertical particulier |
| Document de référence | `PLAN.md` |

---

## Partie A — Vue d'ensemble du domaine

### Ce que le domaine étudie

Le domaine étudie la conception de **plateformes logicielles en ligne** capables d'héberger plusieurs applications métier, pour plusieurs clients, sans réécrire le logiciel pour chaque cas.

Il réunit des disciplines qui sont souvent enseignées séparément :

- l'architecture logicielle ;
- la modélisation des données ;
- la gestion des identités et des droits d'accès ;
- l'automatisation et les processus métier ;
- l'administration et la gouvernance ;
- l'exploitation, la sécurité et la fiabilité ;
- la conception de l'expérience utilisateur.

### Son objectif principal

Un **SaaS vertical** est un produit construit pour un métier précis, par exemple la gestion d'une flotte d'avions. Une **plateforme SaaS agnostique** ne contient aucun métier. Elle fournit des **primitives** : des ressources, des relations, des états, des règles, des rôles et des workflows. Chaque client, ou chaque équipe, les assemble pour obtenir son application métier.

L'idée clé du plan est donc la suivante : le SaaS ne se construit pas autour du métier. Il fournit les briques qui permettent de construire n'importe quelle application métier.

### Les problèmes qu'il résout

| Problème | Réponse de la plateforme |
|---|---|
| Servir de nombreux clients avec un seul système | Multi-tenancy : un même logiciel sert plusieurs clients isolés les uns des autres |
| Éviter de recoder pour chaque métier | Architecture pilotée par les métadonnées : le modèle métier est une donnée, pas du code |
| Laisser le client configurer sans développeur | Plateforme d'administration et plan de contrôle |
| Savoir qui peut faire quoi | Identité, autorisation, permissions fines |
| Rester maître d'un système configurable | Audit, versionnement, gouvernance |
| Être utilisable à grande échelle par des entreprises | Sécurité, fiabilité, observabilité, exploitation |
| Rendre la complexité compréhensible | UX des systèmes complexes |

### Le modèle mental global

```text
                         PLATEFORME SAAS
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   CŒUR DE PLATEFORME   PLATEFORME D'ADMIN   EXPÉRIENCE UTILISATEUR
   données, moteur,     identité, accès,     applications, vues,
   exécution            configuration,       tableaux de bord,
                        politiques           workflows
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                    CONFIGURATION DU DOMAINE
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
        Compagnie aérienne  Hôpital          Usine
```

Lecture du schéma :

1. Le **cœur de plateforme** stocke et traite des ressources génériques.
2. La **plateforme d'administration** permet de définir le comportement du système.
3. L'**expérience utilisateur** présente le résultat aux utilisateurs métier.
4. La **configuration du domaine** est la seule couche qui connaît le métier. Elle est de la donnée, pas du code.

> **Limite du schéma.** Dans un vrai système, ces trois blocs se recouvrent. Par exemple, l'expérience utilisateur dépend des permissions, qui appartiennent à la plateforme d'administration.

### Comment les concepts s'insèrent dans le domaine

Les concepts du plan s'organisent en couches. Chaque couche s'appuie sur celle du dessous.

```text
┌─────────────────────────────────────────────────────┐
│ SOLUTIONS MÉTIER        compagnie aérienne, hôpital │  Module 15
├─────────────────────────────────────────────────────┤
│ MODÉLISATION DU DOMAINE  DDD, invariants, règles    │  Modules 13, 14
├─────────────────────────────────────────────────────┤
│ MOTEUR DE PLATEFORME    ressources, workflows,      │  Modules 2, 3, 6, 7
│                         événements, règles          │
├─────────────────────────────────────────────────────┤
│ PLATEFORME D'ADMIN      identité, configuration,    │  Modules 4, 8, 9
│                         audit, gouvernance          │
├─────────────────────────────────────────────────────┤
│ CŒUR SAAS               multi-tenancy, API,         │  Modules 1, 5, 10
│                         intégrations                │
├─────────────────────────────────────────────────────┤
│ INFRASTRUCTURE          sécurité, fiabilité, SRE    │  Module 11
└─────────────────────────────────────────────────────┘
        L'UX des systèmes complexes (Module 12) traverse toutes les couches.
```

### Prérequis minimaux

Ce parcours explique chaque concept avant de l'utiliser. Il suppose seulement que vous connaissez les dix idées suivantes, au moins en intuition.

| Terme | Sens en une phrase |
|---|---|
| Client et serveur | Le client (navigateur, application) envoie des demandes ; le serveur les traite et répond |
| Requête et réponse | Une requête est une demande envoyée à un serveur ; la réponse est ce qu'il renvoie |
| HTTP | Le protocole de communication du Web : une requête porte une méthode (GET, POST…) et une adresse |
| API | Une interface qu'un programme appelle pour demander une opération à un autre programme |
| Base de données | Un système qui stocke des données de façon durable et permet de les interroger |
| Table, ligne, colonne | Dans une base relationnelle, une table contient des lignes ; chaque ligne a des valeurs par colonne |
| Requête SQL | Une instruction écrite en SQL pour lire ou modifier des données d'une base relationnelle |
| JSON | Un format de texte pour représenter des données structurées (objets, listes, valeurs) |
| Identifiant | Une valeur unique qui désigne sans ambiguïté un objet, par exemple un numéro ou un UUID |
| Processus et service | Un programme en cours d'exécution ; un service est un processus qui répond à des requêtes |

### Ordre d'apprentissage recommandé

L'ordre suit celui du plan : on ne commence ni par l'aéronautique, ni par le DDD. On construit d'abord les primitives, puis on les gouverne, puis on les exploite, et on termine par les cas d'application.

| Étape | Fichier | Idée directrice |
|---|---|---|
| 1 | [01-architecture-saas.md](01-architecture-saas.md) | Comprendre ce que l'on construit |
| 2 | [02-donnees-ressources.md](02-donnees-ressources.md) | Représenter n'importe quoi |
| 3 | [03-crud-runtime-ressources.md](03-crud-runtime-ressources.md) | Manipuler ces objets de façon fiable |
| 4 | [04-identite-iam-autorisation.md](04-identite-iam-autorisation.md) | Déterminer qui peut agir |
| 5 | [05-multi-tenancy-modele-entreprise.md](05-multi-tenancy-modele-entreprise.md) | Transformer le moteur en vrai SaaS |
| 6 | [06-workflow-etat-regles.md](06-workflow-etat-regles.md) | Représenter des processus et des règles |
| 7 | [07-evenements-automatisation.md](07-evenements-automatisation.md) | Rendre le système dynamique |
| 8 | [08-admin-control-plane.md](08-admin-control-plane.md) | Laisser le client configurer sans développeur |
| 9 | [09-audit-versionnement-gouvernance.md](09-audit-versionnement-gouvernance.md) | Rendre la plateforme maîtrisable |
| 10 | [10-api-integrations-extensibilite.md](10-api-integrations-extensibilite.md) | Ouvrir la plateforme au monde extérieur |
| 11 | [11-securite-fiabilite-operations.md](11-securite-fiabilite-operations.md) | Pouvoir l'exploiter à grande échelle |
| 12 | [12-produit-ux.md](12-produit-ux.md) | Rendre le tout utilisable |
| 13 | [13-concepts-transversaux.md](13-concepts-transversaux.md) | Consolider les idées qui traversent tous les modules |
| 14 | [14-domain-driven-design.md](14-domain-driven-design.md) | Encapsuler proprement des domaines complexes |
| 15 | [15-cas-application.md](15-cas-application.md) | Appliquer la méthode à un domaine nouveau |
| Final | [99-synthese-globale.md](99-synthese-globale.md) | Relier l'ensemble en un seul système |

Quelques écarts avec l'ordre de présentation du plan, tous justifiés par les dépendances entre concepts :

- **Module 1 :** les systèmes distribués sont expliqués avant la comparaison monolithe, monolithe modulaire et microservices, car les microservices ne se comprennent qu'avec leurs conséquences.
- **Module 2 :** la clé primaire et la clé étrangère sont expliquées avant les contraintes et la normalisation, car ces deux notions les supposent.
- **Module 4 :** les sessions et les jetons sont expliqués avant l'authentification unique, car OAuth, OIDC et SAML manipulent des jetons.
- **Concepts transversaux :** ils sont regroupés après le module 12, comme consolidation, et non dispersés avant les modules qui les rendent concrets.

### Carte des dépendances

```text
M1 SaaS ──► M2 Données ──► M3 CRUD / runtime
                │                │
                ▼                ▼
        M4 Identité / IAM ──► M5 Multi-tenancy
                │                │
                └───────┬────────┘
                        ▼
        M6 États / règles ──► M7 Événements
                        │
                        ▼
                M8 Administration ──► M9 Audit / gouvernance
                        │
                        ▼
              M10 API / extensibilité
                        │
                        ▼
          M11 Sécurité / fiabilité / opérations
                        │
                        ▼
                    M12 UX
                        │
                        ▼
      M13 Transversaux ──► M14 DDD ──► M15 Cas d'application
```

| Flèche | Ce que la dépendance signifie |
|---|---|
| M1 → M2 | Il faut savoir ce qu'est une plateforme et un tenant avant de modéliser des données pour plusieurs clients |
| M2 → M3 | Les opérations (créer, modifier, supprimer) agissent sur le modèle de ressources défini au module 2 |
| M2, M3 → M4 | « Qui peut faire quoi » suppose de savoir ce qui existe (ressources) et ce qu'on peut en faire (opérations) |
| M4 → M5 | L'isolation entre tenants repose sur l'identité et sur l'autorisation |
| M6 → M7 | Un changement d'état est souvent la cause d'un événement, et un événement déclenche un workflow |
| M2 à M7 → M8 | L'administration configure chacun des moteurs précédents ; elle ne les remplace pas |
| M8 → M9 | Un système configurable doit pouvoir dire qui a changé quoi, et quand |
| M3, M4, M7 → M10 | Une API expose les opérations, protège l'accès et s'appuie sur les événements |
| M1 à M10 → M11 | L'exploitation sûre porte sur tout ce qui précède |
| M4, M8 → M12 | Une interface complexe s'adapte aux droits de l'utilisateur et aux capacités configurables |
| M2, M13 → M14 | Le DDD structure la modélisation, et les concepts transversaux en donnent les principes |
| Tous → M15 | Les cas d'application mobilisent l'ensemble |

### Le fil rouge des exemples

Pour que les exemples restent cohérents d'un module à l'autre, ce parcours utilise une plateforme fictive appelée simplement **la plateforme**. Trois organisations, appelées **tenants**, y configurent chacune leur application :

| Tenant | Métier | Exemples de ressources configurées |
|---|---|---|
| Compagnie aérienne régionale | Maintenance de flotte | Aéronef, tâche de maintenance, technicien |
| Hôpital | Gestion d'équipements et de lits | Équipement médical, lit, intervention |
| Usine | Production | Machine, ordre de fabrication, lot |

L'exemple le plus utilisé est l'**aéronef** de la compagnie aérienne :

```json
{
  "type": "aircraft",
  "tenant": "airline-regional",
  "properties": {
    "registration": "F-ABCD",
    "model": "A320",
    "status": "active",
    "next_inspection_date": "2026-11-30"
  }
}
```

> **Avertissement.** Les exemples sont des illustrations pédagogiques. Ils ne décrivent ni un produit réel ni une recommandation unique de conception. Lorsqu'un choix est une convention ou un compromis plutôt qu'un fait établi, le texte le précise.

### Comment lire une entrée

Chaque concept, ou groupe de concepts très proches, forme une **entrée**. Toutes les entrées suivent le même gabarit.

| Section | Rôle |
|---|---|
| 1. Comprendre simplement | Intuition, raison d'être, analogie et exemple. À lire en premier |
| 2. Connaissances essentielles | Définition, idées fondamentales, vocabulaire, idées reçues, trois points à retenir |
| 3. Explication technique détaillée | Mécanismes, formules, schémas, compromis, cas limites |
| 4. Relations avec les autres concepts | Prérequis, dépendances, confusions possibles |
| 5. Application pratique | Un cas réaliste, de la situation initiale au résultat |
| 6. Vérification finale | Cinq questions, puis les réponses dans une sous-section séparée |

Conseil de lecture : après la section 1, essayez d'expliquer le concept avec vos propres mots. Avant de lire les réponses de la section 6, répondez aux questions.

### Règles de regroupement et couverture

- Les concepts très proches (par exemple *Create, Read, Update, Delete*) sont traités dans **une même entrée**, où chacun est défini explicitement. Cela évite de répéter la même explication.
- Un concept qui apparaît dans plusieurs modules du plan (par exemple *Idempotency* ou *Approval*) est expliqué **une fois**, là où il est le plus utile. Les autres modules ajoutent leur angle propre et renvoient vers l'entrée principale.
- Un petit nombre d'entrées ajoutent un **prérequis** que le plan suppose connu (par exemple la distinction entre authentification et autorisation).
- Aucun terme du plan n'est omis. [COUVERTURE.md](../COUVERTURE.md) donne, pour chaque terme, l'entrée où il est expliqué.

### Plan des fichiers

| Fichier | Module | Entrées |
|---|---|---|
| 01-architecture-saas.md | SaaS et architecture de plateforme | 11 |
| 02-donnees-ressources.md | Modèle universel de données et de ressources | 19 |
| 03-crud-runtime-ressources.md | CRUD et runtime de ressources | 12 |
| 04-identite-iam-autorisation.md | Identité, IAM et autorisation | 22 |
| 05-multi-tenancy-modele-entreprise.md | Multi-tenancy et modèle d'entreprise | 10 |
| 06-workflow-etat-regles.md | Workflow, état et règles métier | 10 |
| 07-evenements-automatisation.md | Automatisation et architecture événementielle | 11 |
| 08-admin-control-plane.md | Plateforme d'administration et plan de contrôle | 9 |
| 09-audit-versionnement-gouvernance.md | Audit, versionnement et gouvernance | 8 |
| 10-api-integrations-extensibilite.md | API, intégrations et extensibilité | 15 |
| 11-securite-fiabilite-operations.md | Sécurité, fiabilité et opérations | 17 |
| 12-produit-ux.md | Produit et UX pour les systèmes complexes | 16 |
| 13-concepts-transversaux.md | Concepts transversaux | 7 |
| 14-domain-driven-design.md | Domain-Driven Design | 8 |
| 15-cas-application.md | Cas d'application | 3 |
| 99-synthese-globale.md | Partie C, synthèse globale | n/a |

### Compléments au parcours

Le parcours initial s'arrête au module 15. Le plan des compléments ([PLAN-COMPLEMENTS.md](../PLAN-COMPLEMENTS.md)) recense les sujets que `PLAN.md` ne demandait pas, et propose de les rédiger comme modules supplémentaires, avec le même gabarit. La numérotation poursuit celle du parcours, et le numéro 99 reste réservé à la synthèse globale.

| Fichier | Module | Entrées | À lire après | Statut |
|---|---|---|---|---|
| [17-collaboration-communication-travail.md](17-collaboration-communication-travail.md) | Collaboration, communication et gestion du travail | 15 | Module 12 (il prolonge [12.10 Notifications](12-produit-ux.md#1210-notifications), [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche), [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) et le module 7) | Rédigé |
| [18-fichiers-documents-contenus.md](18-fichiers-documents-contenus.md) | Fichiers, documents et contenus | 11 | Modules 5, 9 et 11 (il détaille ce que [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants), [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) et [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) mentionnent : stockage, téléversement, contrôle, diffusion) | Rédigé |
| [19-recherche-analytique-restitution.md](19-recherche-analytique-restitution.md) | Recherche, analytique et restitution | 11 | Modules 7, 10 et 12 (il prolonge [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues), [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord), [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) et [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) : de l'expérience de recherche et de tableau de bord à l'infrastructure qui la porte) | Rédigé |
| [20-gouvernance-donnees-conformite.md](20-gouvernance-donnees-conformite.md) | Gouvernance des données, conformité et assurance | 11 | Modules 3, 5, 9 et 11 (il organise en un cadre ce que [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer), [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant), [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) et [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) décrivent séparément ; il s'appuie aussi sur [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) | Rédigé |
| [21-livraison-qualite-logicielle.md](21-livraison-qualite-logicielle.md) | Livraison logicielle et assurance qualité | 11 | Modules 8, 9 et 11 (il prolonge la livraison de la configuration, [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags), [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement), [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre), vers celle du code et de l'infrastructure ; il s'appuie aussi sur [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) et [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)) | Rédigé |
| [22-performance-echelle-economie.md](22-performance-echelle-economie.md) | Performance, échelle et économie d'infrastructure | 11 | Modules 1, 5 et 11 (il prolonge [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation), [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants), [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride), [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive), [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) et [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) : quotas, isolation, cellule, dégradation, reprise et capacité) ; il s'appuie aussi sur [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique) et [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | Rédigé |
| [23-solutions-verticales-packagees.md](23-solutions-verticales-packagees.md) | Solutions verticales packagées et personnalisation durable | 8 | Modules 2, 5, 9, 10 et 15 (il prolonge [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles), [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant), [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence), [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) et [15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée) : du domaine configuré au produit installable, mis à jour chez des tenants personnalisés) ; il s'appuie aussi sur [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) et [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Rédigé |
| [24-cycle-vie-client-support.md](24-cycle-vie-client-support.md) | Cycle de vie client, support et réussite client | 8 | Modules 1, 3, 4, 5, 11 et 12 (il prolonge [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement), [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant), [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export), [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation), [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants), [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) et [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité) : du cycle de vie technique du tenant à la relation qui l'entoure) ; il s'appuie aussi sur [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances) | Rédigé |
| [25-experiences-multi-contextes.md](25-experiences-multi-contextes.md) | Expériences multi-contextes : internationalisation, mobile, hors ligne, temps réel | 6 | Modules 2, 3, 12, 13 et 15 (il prolonge [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées), [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste), [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence), [12.2 Design systems](12-produit-ux.md#122-design-systems), [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur), [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) et [15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne) : de l'interface et des données dans un seul contexte à la langue, la région, l'appareil et le réseau) ; il s'articule avec [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) et [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](17-collaboration-communication-travail.md#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Rédigé |
| [26-intelligence-artificielle.md](26-intelligence-artificielle.md) | Intelligence artificielle dans une plateforme configurable | 9 | Modules 4, 6, 9, 11 et 13 (il applique à l'IA [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines), [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation), [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches), [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade), [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications), [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive) et [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) : identités non humaines, délégation, moindre privilège, approbation, audit, dégradation et politique comme code) ; il s'appuie aussi sur [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits), [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) et [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | Rédigé |
| [27-types-donnees-specialises.md](27-types-donnees-specialises.md) | Types de données spécialisés | 7 | Modules 2, 13 et 14 (il prolonge [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ), [2.14 Index](02-donnees-ressources.md#214-index), [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données), [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) et [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) : du catalogue de types de champ simples aux types qui ont leurs propres règles) ; il s'articule avec [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation), [22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage) et [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche) | Rédigé |
| [28-interoperabilite-avancee.md](28-interoperabilite-avancee.md) | Interopérabilité avancée | 6 | Modules 7 et 10 (il prolonge [7.5 Webhook](07-evenements-automatisation.md#75-webhook), [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi), [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs), [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) et [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence) : des connecteurs et de la synchronisation aux normes sectorielles, aux flux d'événements et aux contrats) ; il s'articule avec [20.6 Données de référence et contrat de données](20-gouvernance-donnees-conformite.md#206-données-de-référence-et-contrat-de-données) et [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | Rédigé |
| [29-organisation-produit-economie.md](29-organisation-produit-economie.md) | Organisation, produit et économie de la plateforme | 6 | Modules 1, 10 et 13 (il prolonge [1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire), [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service), [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur), [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) et [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) : de l'architecture de la plateforme à l'organisation qui la construit, la gouverne et l'ouvre à des partenaires) ; il s'articule avec [21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture), [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) et [24.3 Mesures d'adoption et score de santé du compte](24-cycle-vie-client-support.md#243-mesures-dadoption-et-score-de-santé-du-compte) | Rédigé |
| [30-annexe-fondations-infrastructure.md](30-annexe-fondations-infrastructure.md) | Annexe A — Fondations d'infrastructure | 6 | Modules 1, 3 et 11 (elle précise [1.1 SaaS](01-architecture-saas.md#11-saas), [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués), [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) : les familles de bases de données, le stockage, la réplication et la cohérence, le réseau, les modèles d'exécution, les services gérés et les zones) ; elle se relie à [22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication), [22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage), [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) et [29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité) | Rédigé |

- La correspondance entre chaque terme de ces modules et son explication se trouve dans [COUVERTURE-COMPLEMENTS.md](../COUVERTURE-COMPLEMENTS.md).
- Une [étude dédiée](../etudes/activity-center-notification-center.md) applique le module 17 à une question de conception : l'articulation d'un centre d'activités et d'un centre de notifications.
- Le module 16 est proposé par le plan des compléments et n'est pas encore rédigé.

| Flèche | Ce que la dépendance signifie |
|---|---|
| M6, M7, M12 → M17 | La gestion du travail s'appuie sur les tâches et les approbations, les notifications sur les événements, et les deux sur les principes d'interface du module 12 |
| M5, M9, M11 → M18 | Le fichier hérite de l'isolation du tenant, des révisions et des preuves, et du chiffrement ; le module décrit son stockage, son contrôle, sa diffusion, sa transformation en document et sa conservation |
| M7, M10, M12 → M19 | La recherche s'appuie sur le modèle de lecture et la cohérence à terme, l'analytique sur la synchronisation vers l'entrepôt, et la restitution sur les tableaux de bord et les mesures nommées du module 12 |
| M3, M5, M9, M11 → M20 | La rétention, la résidence, l'audit et la preuve, les clés et les incidents fournissent les mécanismes ; le module les organise en classification, registre, droits, contrôles, audits et engagements |
| M8, M9, M11 → M21 | La configuration d'environnement, le versionnement et le cycle de développement sécurisé sont les prérequis ; le module décrit la chaîne qui livre le code et l'infrastructure, la stratégie de test et le pilotage de l'ingénierie |
| M1, M5, M11 → M22 | Les quotas, l'isolation et la planification de capacité fixent le cadre ; le module décrit les leviers d'architecture, l'équité entre tenants et la lecture économique de la plateforme |
| M2, M5, M9, M10, M15 → M23 | Les métadonnées, la personnalisation du tenant, la fusion et le versionnement, la marketplace et la démarche de configuration fournissent les mécanismes ; le module les assemble en un produit vertical installable, distribuable et gouverné |
| M1, M3, M5, M11, M12 → M24 | Le cycle de vie du tenant, l'import et l'export, l'accès de support, la gestion des incidents et la mesure d'adoption fournissent les mécanismes ; le module les assemble en parcours d'arrivée, de vie du compte et de départ |
| M2, M3, M12, M13, M17 → M25 | Les métadonnées, la concurrence et l'idempotence, le système de conception, la modélisation temporelle et le temps réel fournissent les bases ; le module les assemble pour servir des langues, des régions, des appareils et des conditions de réseau différents |
| M4, M6, M9, M11, M13 → M26 | Les identités non humaines, la délégation, l'approbation, l'audit, la dégradation progressive et la politique comme code fournissent les briques ; le module les assemble pour qu'une IA agisse par la même API, avec les mêmes droits, la même trace et la même configuration |
| M2, M13, M14 → M27 | Les champs, la validation, les index, la modélisation temporelle et les objets-valeurs fournissent le cadre ; le module décrit les types qui portent leurs propres règles : position, mesure, grandeur, montant, identifiant, texte mis en forme, terme et lien |
| M7, M10 → M28 | Les webhooks, les connecteurs, la synchronisation et le système de référence fournissent le cadre ; le module décrit ce qui rend l'échange durable : normes, correspondances, flux, schémas, contrats, flux sans code et réconciliation |
| M1, M10, M13 → M29 | L'architecture de plateforme, le SDK, la marketplace et la configuration fournissent le cadre ; le module décrit ce qui rend la plateforme durable : produit, équipe et chemin balisé, gouvernance des API, arbitrages de dépendance, feuille de route mesurée, partenaires et exceptions datées |
| M1, M3, M11 → M30 | Le SaaS, les transactions, les systèmes distribués et la redondance posent le cadre ; l'annexe décrit les briques d'infrastructure dont les propriétés (cohérence, durabilité, disponibilité, résidence) se retrouvent dans les garanties de la plateforme |
