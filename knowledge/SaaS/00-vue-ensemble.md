# Parcours de formation : construire une plateforme SaaS agnostique

Ce parcours explique, concept par concept, tout ce que le fichier `PLAN.md` demande de maîtriser pour construire une plateforme SaaS générique. Il suit la structure pédagogique définie dans `CLAUDE.md`.

Le suivi de la rédaction se trouve dans [SUIVI.md](../SUIVI.md). La correspondance entre chaque terme du plan et son explication se trouve dans [COUVERTURE.md](../COUVERTURE.md).

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
