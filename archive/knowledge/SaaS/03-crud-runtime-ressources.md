# Module 3 — CRUD et runtime de ressources

> **Question directrice.** Comment exécuter, de façon uniforme et fiable, des opérations sur n'importe quel type de ressource défini par un administrateur ?

## Présentation du module

**Objectif.** Une fois le modèle défini au [module 2](02-donnees-ressources.md), il faut savoir l'exécuter. Ce module construit, pas à pas, un **moteur de ressources générique** (*Resource Engine*) : les mêmes opérations s'appliquent à tout type, quelle que soit sa définition.

```text
POST   /resources/{type}          créer
GET    /resources/{type}          lister
GET    /resources/{type}/{id}     lire
PATCH  /resources/{type}/{id}     modifier
DELETE /resources/{type}/{id}     supprimer
```

Ici, `{type}` peut être n'importe quel type défini par l'administrateur : aéronef, équipement, machine.

**Prérequis.** Les notions de type, de schéma, de relation et de validation du module 2.

**Ordre retenu.** Le module va des opérations vers les garanties d'exécution, puis les assemble.

```text
Opérations         CRUD ─ archiver ─ cloner ─ fusionner ─ déplacer ─ en masse ─ import / export
Garanties          validation et erreurs ─ transactions ─ concurrence ─ idempotence
Assemblage         le Resource Engine
```

L'intégrité référentielle est expliquée en [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle). Son angle d'exécution (que se passe-t-il à la suppression d'une ressource référencée ?) est repris en [3.2 Archiver et restaurer](#32-archiver-et-restaurer) et en [3.12 Assembler un Resource Engine générique](#312-assembler-un-resource-engine-générique).

## Sommaire du module

- [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer)
- [3.2 Archiver et restaurer](#32-archiver-et-restaurer)
- [3.3 Cloner et dupliquer](#33-cloner-et-dupliquer)
- [3.4 Fusionner](#34-fusionner)
- [3.5 Déplacer et transférer](#35-déplacer-et-transférer)
- [3.6 Opérations en masse](#36-opérations-en-masse)
- [3.7 Import et export](#37-import-et-export)
- [3.8 Validation et gestion des erreurs](#38-validation-et-gestion-des-erreurs)
- [3.9 Transactions et atomicité](#39-transactions-et-atomicité)
- [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste)
- [3.11 Idempotence](#311-idempotence)
- [3.12 Assembler un Resource Engine générique](#312-assembler-un-resource-engine-générique)

## 3.1 CRUD, créer, lire, mettre à jour et supprimer

### 1. Comprendre simplement

**CRUD** est le sigle des quatre opérations de base sur une donnée : **Create** (créer), **Read** (lire), **Update** (mettre à jour) et **Delete** (supprimer). Presque toute application de gestion repose sur ces quatre opérations.

**Pourquoi cela existe.** Quand on gère des données, on a toujours les mêmes besoins : en ajouter, les consulter, les corriger, les retirer. Donner un nom à ces quatre opérations permet de les standardiser, de les outiller et de les protéger de la même façon pour tous les types de données.

**Problème résolu.** Éviter de réinventer, pour chaque type de ressource, les mêmes opérations avec des règles légèrement différentes.

**Modèle mental.** Un classeur de fiches : on y ajoute une fiche, on la consulte, on la corrige, on la retire.

**Où l'analogie s'arrête.** Un classeur n'est utilisé que par une personne à la fois, sans droits ni historique. Dans une plateforme, chaque opération doit être autorisée, validée, tracée, et supporter des accès simultanés.

**Exemple.**

- **Créer** un aéronef F-ABCD ;
- **Lire** sa fiche ou la liste des aéronefs actifs ;
- **Mettre à jour** son statut en « en inspection » ;
- **Supprimer** la fiche créée par erreur.

**Les composants d'une opération.**

1. une **intention** (créer, lire, modifier, supprimer) ;
2. une **ressource cible** (type et identifiant) ;
3. une **identité** qui agit (utilisateur, tenant) ;
4. un **résultat** (la ressource, ou une erreur).

**Objectif d'apprentissage :** vous pouvez expliquer les quatre opérations, leur correspondance avec HTTP et SQL, et pourquoi elles ne suffisent pas à tout décrire.

### 2. Connaissances essentielles

#### Définition

**CRUD** désigne l'ensemble minimal des opérations de persistance sur une ressource :

- **Create** : enregistrer une nouvelle ressource ;
- **Read** : obtenir une ressource ou une liste de ressources ;
- **Update** : modifier les propriétés d'une ressource existante ;
- **Delete** : retirer une ressource.

#### Idées fondamentales

1. **Quatre opérations, de nombreux types.** Un moteur générique implémente CRUD une fois pour tous les types.
2. **Chaque opération a sa correspondance.** HTTP : `POST`, `GET`, `PUT` ou `PATCH`, `DELETE`. SQL : `INSERT`, `SELECT`, `UPDATE`, `DELETE`.
3. **Lire a deux formes.** Obtenir une ressource par identifiant, ou lister selon des critères.
4. **Modifier a deux formes.** Remplacer toute la ressource, ou n'en modifier qu'une partie.
5. **Supprimer n'est pas toujours effacer.** On archive souvent plutôt que d'effacer (voir [3.2 Archiver et restaurer](#32-archiver-et-restaurer)).
6. **CRUD ne dit pas tout.** Une action métier (approuver, immobiliser) n'est pas une simple modification de champ.

#### Vocabulaire essentiel

- **Ressource** (*resource*) : l'objet visé par l'opération.
- **Opération** (*operation*) : une des actions de base.
- **Remplacement complet** (`PUT`) : la nouvelle représentation remplace l'ancienne.
- **Modification partielle** (`PATCH`) : seuls les champs fournis changent.
- **Action métier** (*command*) : opération porteuse d'une intention (par exemple « immobiliser »).
- **Idempotente** : répétée, produit le même effet qu'une seule fois (voir [3.11 Idempotence](#311-idempotence)).

#### Relations de cause à effet

- Les opérations sont réalisées par un seul moteur. Les règles d'accès, de validation et d'audit s'appliquent partout de la même façon.
- Une action métier est traitée comme une simple modification de champ. Les règles qui accompagnent l'intention (droits, étapes, notifications) sont contournées.
- Une modification partielle est confondue avec un remplacement complet. Des champs non fournis sont effacés par erreur.

#### Idées reçues

- **« CRUD, c'est simple, il n'y a rien à concevoir. »** Faux. Dès qu'il y a des droits, de la concurrence, des relations et un historique, chaque opération pose des questions précises.
- **« Une application métier, c'est du CRUD. »** Pas seulement. Les processus, les approbations et les règles dépassent la simple modification de données.
- **« `PUT` et `PATCH` sont équivalents. »** Non. `PUT` remplace la ressource ; `PATCH` la modifie partiellement.

#### Principe clé

CRUD est le socle commun : un moteur générique l'implémente une fois, et y applique de manière uniforme sécurité, validation, historique et événements.

#### Si vous ne retenez que trois choses

1. CRUD désigne créer, lire, mettre à jour et supprimer.
2. Chaque opération passe par la même chaîne de contrôles dans le moteur.
3. Les actions métier dépassent CRUD et demandent des opérations explicites.

### 3. Explication technique détaillée

#### Correspondances

| Opération | HTTP | SQL | Réponse typique |
|---|---|---|---|
| Create | `POST /aircraft` | `INSERT` | `201 Created` avec l'adresse de la nouvelle ressource |
| Read (un) | `GET /aircraft/{id}` | `SELECT … WHERE id = …` | `200 OK` ou `404 Not Found` |
| Read (liste) | `GET /aircraft?status=active` | `SELECT … WHERE …` | `200 OK` avec une page |
| Update (partiel) | `PATCH /aircraft/{id}` | `UPDATE … SET …` | `200 OK` ou `204 No Content` |
| Update (complet) | `PUT /aircraft/{id}` | `UPDATE …` | `200 OK` ou `204 No Content` |
| Delete | `DELETE /aircraft/{id}` | `DELETE` ou `UPDATE` (archivage) | `204 No Content` |

#### La chaîne de traitement d'une opération

```text
Requête
  │
  ▼
1. Authentification          qui appelle ?
2. Contexte de tenant        dans quel tenant ?
3. Autorisation              a-t-il le droit de faire cela, sur cette ressource ?
4. Chargement                (modification, suppression) lire l'état courant
5. Validation                les données respectent-elles le schéma ?
6. Règles métier             l'opération est-elle permise dans cet état ?
7. Persistance               écrire, dans une transaction
8. Événements et audit       publier, tracer
  │
  ▼
Réponse
```

**Pourquoi cet ordre.** Les contrôles peu coûteux et bloquants passent en premier. L'autorisation est vérifiée avant toute lecture de contenu, pour ne rien révéler à un appelant non autorisé.

#### Exemples de requêtes

```http
POST /resources/aircraft HTTP/1.1
Content-Type: application/json

{ "registration": "F-ABCD", "model": "A320", "status": "active" }
```

```http
HTTP/1.1 201 Created
Location: /resources/aircraft/ac_8f3a
ETag: "1"

{ "id": "ac_8f3a", "registration": "F-ABCD", "version": 1 }
```

```http
PATCH /resources/aircraft/ac_8f3a HTTP/1.1
If-Match: "1"
Content-Type: application/merge-patch+json

{ "status": "in_inspection" }
```

**Comment les lire.** La création renvoie `201` et l'adresse de la ressource. La modification partielle ne mentionne que le champ changé, et `If-Match` protège contre une modification concurrente (voir [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste)).

#### Au-delà de CRUD

Une opération comme « immobiliser un aéronef » doit vérifier des conditions, changer un état, créer des tâches et notifier. On l'expose comme une **action** explicite :

```http
POST /resources/aircraft/ac_8f3a/actions/ground
```

**Contre-exemple.** Laisser les clients faire `PATCH {"status": "grounded"}` pour immobiliser. Rien n'oblige à indiquer un motif ni à créer les tâches associées : la règle métier dépend de la bonne volonté de chaque client.

**Limites.** Un moteur CRUD pur est « anémique » : il stocke sans comprendre le métier. C'est pourquoi on y associe des états (module 6), des règles et des événements (module 7).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) | CRUD agit sur des ressources identifiées |
| [3.8 Validation et gestion des erreurs](#38-validation-et-gestion-des-erreurs) | La validation et la gestion des erreurs font partie de chaque opération |
| [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste) | La modification doit gérer les accès simultanés |
| [3.11 Idempotence](#311-idempotence) | L'idempotence rend les opérations rejouables |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les transitions d'état formalisent les actions métier |
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | L'API REST expose CRUD à travers HTTP |

### 5. Application pratique

**Situation initiale.** La plateforme doit offrir les opérations de base sur trois types : aéronef, équipement médical, machine.

**Problème.** Écrire trois ensembles d'écrans et d'API est coûteux et source d'écarts de comportement.

**Application du concept.** Un seul moteur CRUD, piloté par la définition du type, traite les trois.

**Déroulé.**

1. Le moteur reçoit `POST /resources/medical_device`.
2. Il charge la définition du type pour le tenant courant.
3. Il vérifie les droits de création, valide le corps contre le schéma.
4. Il écrit la ressource et retourne `201` avec son adresse.

**Résultat.** Le même code et les mêmes garanties servent tous les types, y compris ceux qui seront créés demain.

**Limites.** Si un type exige une logique très particulière à la création (par exemple un numéro de série calculé par un système externe), elle passe par une extension du moteur et non par la configuration seule.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifie CRUD ?
2. **Compréhension.** Quelle est la différence entre `PUT` et `PATCH` ?
3. **Compréhension.** Pourquoi l'autorisation est-elle vérifiée avant la validation ?
4. **Pourquoi.** Pourquoi une action métier ne se limite-t-elle pas à une modification de champ ?
5. **Raisonnement pratique.** Un client envoie `PUT /aircraft/ac_8f3a` avec seulement le champ `status`. Que risque-t-il de se passer ?

#### Réponses

1. Create (créer), Read (lire), Update (mettre à jour), Delete (supprimer).
2. `PUT` remplace toute la ressource par la représentation fournie. `PATCH` ne modifie que les champs fournis.
3. Pour ne rien révéler à un appelant non autorisé : une erreur de validation détaillée pourrait divulguer l'existence ou la forme d'une ressource.
4. Parce qu'elle porte une intention et des règles : droits, motif, conditions d'état, effets associés. Un simple changement de champ contournerait ces règles.
5. Si `PUT` est interprété comme un remplacement complet, les champs non fournis sont perdus ou invalides (par exemple l'immatriculation obligatoire). Il aurait fallu utiliser `PATCH`.

## 3.2 Archiver et restaurer

### 1. Comprendre simplement

**Archiver** (*archive*) une ressource, c'est la retirer de l'usage courant sans l'effacer : elle n'apparaît plus dans les listes par défaut, mais elle existe encore. **Restaurer** (*restore*) est l'opération inverse : la remettre en service.

**Pourquoi cela existe.** Effacer est irréversible. Or on supprime souvent par erreur, et beaucoup d'activités exigent de garder l'historique : audit, litige, obligation légale, traçabilité d'un aéronef retiré de la flotte.

**Problème résolu.** Permettre de « supprimer » sans perdre de données, et de revenir en arrière.

**Modèle mental.** Une armoire d'archives. On range un dossier terminé, il ne gêne plus, mais on peut le ressortir.

**Où l'analogie s'arrête.** Une armoire ne change pas le sens des autres dossiers. Archiver une ressource affecte celles qui la référencent, ses règles d'unicité et ses droits.

**Exemple.** Un aéronef vendu est archivé. Il disparaît de la liste de la flotte, mais ses inspections passées restent consultables. Si la vente est annulée, on le restaure.

**Les composants.**

1. un **marqueur** d'archivage (état ou horodatage) ;
2. un **filtre par défaut** qui masque les ressources archivées ;
3. des **règles d'usage** sur les ressources archivées ;
4. une **purge** éventuelle, après un délai.

**Objectif d'apprentissage :** vous pouvez comparer l'archivage à la suppression physique, et dire quelles précautions l'archivage impose.

### 2. Connaissances essentielles

#### Définition

- **Archiver** : marquer une ressource comme retirée de l'usage courant, en conservant ses données et son historique.
- **Restaurer** : annuler l'archivage et rendre la ressource à l'usage courant.

#### Idées fondamentales

1. **L'archivage est réversible, la suppression physique non.**
2. **Une ressource archivée est invisible par défaut.** Listes, recherches et rapports l'excluent, sauf demande explicite.
3. **L'archivage a des effets sur les liens.** Que deviennent les références vers une ressource archivée ?
4. **L'unicité doit tenir compte de l'archivage.** Une immatriculation archivée peut-elle être réutilisée ?
5. **Archiver n'est pas effacer au sens légal.** Un droit à l'effacement exige une suppression réelle.
6. **Les ressources archivées ont des règles propres.** Par exemple : une ressource archivée ne peut pas être affectée.

#### Vocabulaire essentiel

- **Suppression logique** (*soft delete*) : marquage plutôt qu'effacement.
- **Suppression physique** (*hard delete*) : effacement réel des données.
- **Pierre tombale** (*tombstone*) : marqueur qui indique qu'une ressource a été supprimée.
- **Purge** : suppression physique définitive après un délai de conservation.
- **Rétention** (*retention*) : durée de conservation prévue.
- **Index partiel unique** : unicité qui ne s'applique qu'aux ressources non archivées.

#### Relations de cause à effet

- Une ressource est archivée mais reste visible dans les listes. Les utilisateurs la sélectionnent encore : le filtre par défaut est indispensable.
- L'unicité ne tient pas compte de l'archivage. Une nouvelle ressource avec la même immatriculation est refusée à cause d'une ressource archivée.
- Un parent est archivé, pas ses enfants. Des ressources actives pointent vers un parent invisible.

#### Idées reçues

- **« Archiver, c'est supprimer proprement. »** Pas au sens légal. Les données sont conservées, ce qui peut être contraire à une demande d'effacement.
- **« Un indicateur booléen suffit. »** Souvent non. Une date d'archivage et l'auteur sont utiles, ainsi qu'un état cohérent avec le cycle de vie.
- **« Restaurer remet tout comme avant. »** Pas toujours. Si une règle d'unicité ou une référence a changé entre-temps, la restauration peut être impossible ou partielle.

#### Principe clé

Archiver préserve la donnée et l'historique, au prix d'une complexité : il faut dire précisément ce qu'une ressource archivée peut encore faire.

#### Si vous ne retenez que trois choses

1. Archiver retire sans effacer ; restaurer remet en service.
2. Les ressources archivées sont masquées par défaut, et les règles d'unicité et de liens doivent en tenir compte.
3. L'archivage n'est pas un effacement au sens du droit à l'oubli.

### 3. Explication technique détaillée

#### Deux représentations

| Représentation | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Champ d'horodatage | `archived_at` renseigné quand archivé | Simple, indique quand | Toute requête doit filtrer |
| État dans le cycle de vie | `status = 'archived'` | Intégré aux transitions et aux règles | Mélange avec les autres statuts |
| Table d'archive séparée | Déplacement de la ligne | Table active légère | Restauration et liens plus complexes |

#### Unicité avec archivage

```sql
-- L'immatriculation est unique parmi les aéronefs non archivés
CREATE UNIQUE INDEX aircraft_registration_active
  ON aircraft (tenant_id, registration)
  WHERE archived_at IS NULL;
```

**Comment cela fonctionne.** L'index n'inclut que les lignes non archivées. Une immatriculation archivée peut donc être réutilisée.

**Contre-exemple.** Avec une contrainte d'unicité sans condition, restaurer une ressource dont l'immatriculation a été réattribuée échoue. Il faut alors prévoir une règle de résolution.

#### Effet sur les liens

À l'archivage d'une ressource référencée, plusieurs politiques existent :

| Politique | Effet | Exemple |
|---|---|---|
| Refuser | Interdire l'archivage tant que des ressources actives la référencent | Une base avec des aéronefs |
| Propager | Archiver aussi les ressources dépendantes | Un rapport et ses lignes (composition) |
| Détacher | Vider les références | Un technicien archivé, ses affectations passées conservées |
| Conserver | Laisser les liens, en lecture seule | Historique des inspections d'un aéronef vendu |

Ce choix découle du type de lien (voir [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation)).

#### Règles d'usage d'une ressource archivée

Ces règles font partie des **invariants** de la plateforme (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)). Par exemple : « une ressource archivée ne peut pas être affectée », « une ressource archivée ne peut pas être modifiée, sauf restauration ». Elles sont appliquées par le moteur à chaque opération.

#### Restauration

La restauration vérifie que la ressource peut redevenir active :

1. l'unicité est toujours respectée ;
2. les références qu'elle porte désignent des ressources existantes et actives ;
3. l'utilisateur a le droit de restaurer.

#### Purge et conservation

Une politique de rétention définit le délai après lequel une ressource archivée est supprimée définitivement. Ce délai dépend du métier et de la loi. Pour une demande d'effacement de données personnelles, on applique une suppression ou une anonymisation réelle, et non un simple archivage.

**Limites.** L'archivage accumule des données qui alourdissent la base et les index. Sans purge ni stockage séparé, les performances se dégradent avec le temps.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | L'intégrité référentielle décide du sort des références à la suppression |
| [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) | Composition et agrégation déterminent la propagation de l'archivage |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer) | L'archivage est une forme de « Delete » |
| [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie) | « Archivé » est souvent un état du cycle de vie |
| [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence) | Les instantanés conservent l'état d'une ressource avant archivage |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | À l'échelle d'un tenant, la rétention gouverne la suppression des données du client |

### 5. Application pratique

**Situation initiale.** Un aéronef vendu doit disparaître de la flotte, mais l'autorité exige de conserver son historique d'inspections pendant dix ans.

**Problème.** Une suppression physique violerait l'obligation de conservation.

**Application du concept.** L'aéronef est archivé. Ses inspections sont conservées en lecture seule.

**Déroulé.**

1. L'utilisateur choisit « Archiver » et indique le motif « vendu ».
2. Le moteur vérifie qu'aucune tâche active n'existe.
3. Il renseigne `archived_at`, l'auteur et le motif.
4. L'aéronef disparaît des listes par défaut. Un filtre « inclure les archivés » permet de le retrouver.

**Résultat.** L'historique est conservé, la flotte active est propre, et l'opération est réversible.

**Limites.** Après dix ans, la purge doit être déclenchée, avec l'accord du service juridique. Elle doit aussi traiter les sauvegardes et les journaux (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre archiver et supprimer physiquement ?
2. **Compréhension.** Pourquoi les listes excluent-elles les ressources archivées par défaut ?
3. **Compréhension.** Qu'est-ce qu'un index unique partiel, et à quoi sert-il ici ?
4. **Pourquoi.** Pourquoi l'archivage ne répond-il pas à un droit à l'effacement ?
5. **Raisonnement pratique.** On archive une base d'affectation qui contient 40 aéronefs actifs. Quelles politiques sont possibles ?

#### Réponses

1. Archiver retire de l'usage courant en conservant les données ; la suppression physique les efface définitivement.
2. Parce que l'usage courant concerne les ressources actives. Les afficher exposerait les utilisateurs à des choix invalides.
3. Un index d'unicité limité aux lignes non archivées. Il permet de réutiliser une valeur unique (immatriculation) déjà portée par une ressource archivée.
4. Parce que les données sont conservées. L'effacement exige une suppression ou une anonymisation réelle des données personnelles.
5. Refuser l'archivage tant que des aéronefs actifs y sont rattachés, ou exiger leur réaffectation préalable. On peut aussi propager l'archivage, si le métier le décide, mais c'est rarement adapté pour des aéronefs.

## 3.3 Cloner et dupliquer

### 1. Comprendre simplement

**Dupliquer** (*duplicate*) une ressource, c'est en créer une nouvelle qui reprend les valeurs de la première. **Cloner** (*clone*) va plus loin : on copie aussi les éléments qui la composent, comme ses lignes ou ses sous-éléments. Dans ce parcours, la distinction est la suivante : la **duplication** copie la ressource seule, le **clonage** copie la ressource et ses parties.

**Pourquoi cela existe.** Beaucoup de saisies sont des variantes d'une ressource existante. Partir d'une copie évite de ressaisir, et sert aussi à créer des modèles réutilisables.

**Problème résolu.** Gagner du temps et réduire les erreurs de saisie, en créant une ressource à partir d'une autre.

**Modèle mental.** Photocopier une fiche pour en remplir une nouvelle. Si la fiche a des annexes, le clonage les photocopie aussi.

**Où l'analogie s'arrête.** Une photocopie recopie tout, y compris ce qui ne doit pas l'être : le numéro unique, la date de création, le nom de l'auteur. Un moteur doit décider champ par champ.

**Exemple.** Une compagnie ouvre un nouveau plan d'inspection en clonant celui d'un modèle d'avion existant, avec ses 120 lignes de contrôle.

**Les composants.**

1. une **source** ;
2. des **règles de copie** par champ et par relation ;
3. des **valeurs réinitialisées** (identifiant, dates, état) ;
4. un **résultat** : une ressource indépendante.

**Objectif d'apprentissage :** vous pouvez dire ce qu'une copie doit réinitialiser, et distinguer copie superficielle et copie profonde.

### 2. Connaissances essentielles

#### Définition

- **Duplication** : création d'une nouvelle ressource indépendante, dont les propriétés propres reprennent celles d'une ressource source.
- **Clonage** : duplication qui inclut les ressources composées (parties) et, selon la règle choisie, certaines relations.

#### Idées fondamentales

1. **La copie est indépendante.** Après l'opération, modifier l'une ne modifie pas l'autre.
2. **Certains champs ne se copient pas.** Identifiant, dates, version, auteur, valeurs uniques.
3. **Les parties suivent le tout.** Dans une composition, le clonage copie les parties (voir [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation)).
4. **Les références sont conservées ou réaffectées.** Dans une agrégation, la copie pointe vers les mêmes ressources.
5. **L'état repart de l'état initial.** Une copie ne reprend pas l'état d'approbation de la source.
6. **Les modèles sont des clones contrôlés.** Un modèle est une ressource conçue pour être clonée.

#### Vocabulaire essentiel

- **Copie superficielle** (*shallow copy*) : copie des valeurs propres ; les références pointent vers les mêmes cibles.
- **Copie profonde** (*deep copy*) : copie aussi les objets liés ou composés.
- **Champ réinitialisé** : champ remis à sa valeur initiale lors de la copie.
- **Modèle** (*template*) : ressource conçue pour servir de base à des copies.
- **Source** : ressource d'origine.

#### Relations de cause à effet

- Une valeur unique (immatriculation) est copiée telle quelle. La création échoue sur la contrainte d'unicité, ou pire, deux ressources se confondent.
- L'état d'approbation est copié. La copie apparaît approuvée sans avoir été revue.
- Les parties ne sont pas copiées. La copie est incomplète, et la modification des parties de la source modifie ce que voit la copie.

#### Idées reçues

- **« Cloner, c'est copier toutes les valeurs. »** Non. Il faut décider pour chaque champ : copier, vider, ou réinitialiser.
- **« La copie reste liée à la source. »** Non. Elle est indépendante, sauf si le modèle prévoit explicitement un lien d'origine.
- **« Cloner est sans risque. »** Non. Une copie peut exposer des données auxquelles l'utilisateur n'avait accès qu'à la source, ou reproduire des erreurs.

#### Principe clé

Une copie réussie décide, pour chaque champ et chaque lien, ce qui est copié, ce qui est vidé et ce qui est réinitialisé.

#### Si vous ne retenez que trois choses

1. Dupliquer copie la ressource ; cloner copie aussi ses parties.
2. Identifiants, dates, valeurs uniques et état doivent être réinitialisés.
3. Une règle de copie par champ et par relation rend l'opération sûre.

### 3. Explication technique détaillée

#### Règles de copie par champ

| Famille de champ | Règle habituelle | Exemple |
|---|---|---|
| Identifiant, version | Généré | `id`, `version` |
| Dates système, auteur | Réinitialisé | `created_at`, `created_by` |
| Valeur unique | Vidé ou à saisir | Immatriculation |
| Propriété ordinaire | Copié | Modèle, capacité |
| Champ calculé | Recalculé | Jours avant inspection |
| État du cycle de vie | État initial | `draft` |
| Référence (agrégation) | Conservée | Base d'affectation |
| Parties (composition) | Copiées | Lignes d'un plan |
| Pièce jointe | Selon la politique | Document réglementaire |

#### Une description déclarative

```json
{
  "type": "aircraft",
  "clone": {
    "reset": ["id", "version", "created_at", "created_by", "status"],
    "require_input": ["registration"],
    "copy_parts": ["inspection_plan_lines"],
    "keep_references": ["model", "base"]
  }
}
```

**Comment le lire.** Les champs système sont réinitialisés. L'immatriculation doit être fournie par l'utilisateur. Les lignes du plan sont copiées. Le modèle et la base restent référencés.

#### Déroulement d'un clonage

1. Charger la source avec ses parties (en vérifiant le droit de lecture).
2. Appliquer les règles de copie pour construire la nouvelle ressource.
3. Fixer le tenant courant et l'auteur.
4. Valider comme une création ordinaire.
5. Écrire la ressource et ses parties dans une seule transaction (voir [3.9 Transactions et atomicité](#39-transactions-et-atomicité)).

**Contre-exemple.** Dupliquer en copiant la ligne de base de données brute, y compris les champs système. La copie hérite de l'identifiant ou de la version de la source, et des contraintes sont violées.

**Cas des relations plusieurs-à-plusieurs.** Copier ou non les affectations ? Souvent non : une affectation a un sens pour une ressource précise à une date précise. Le choix doit être explicite.

**Limites.** Le clonage profond d'un grand ensemble (milliers de parties) peut être long. On le traite alors comme une tâche de fond avec suivi d'avancement (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) | Composition et agrégation déterminent ce qui est copié |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer) | Le clonage est une création alimentée par une source |
| [3.9 Transactions et atomicité](#39-transactions-et-atomicité) | Il doit être exécuté de façon atomique |
| [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Les contraintes d'unicité imposent de modifier certaines valeurs |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les modèles et les copies sont proposés dans l'interface d'administration |

### 5. Application pratique

**Situation initiale.** Une compagnie reçoit un nouvel A320. Son plan d'inspection est identique à celui d'un A320 existant.

**Problème.** Ressaisir 120 lignes de contrôle est long et source d'erreurs.

**Application du concept.** L'utilisateur clone l'aéronef existant en fournissant la nouvelle immatriculation.

**Déroulé.**

1. L'utilisateur choisit « Cloner » sur l'aéronef modèle.
2. L'interface demande l'immatriculation.
3. Le moteur applique les règles de copie : champs système réinitialisés, plan copié, base conservée.
4. Il valide et écrit l'ensemble dans une transaction.

**Résultat.** Le nouvel aéronef est créé avec son plan complet en quelques secondes.

**Limites.** Si le plan du modèle d'origine est modifié plus tard, la copie n'est pas mise à jour. Pour un comportement partagé, on préfère une référence au plan plutôt qu'une copie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence ce parcours fait-il entre dupliquer et cloner ?
2. **Compréhension.** Citez trois champs qu'une copie doit réinitialiser.
3. **Compréhension.** Pourquoi l'état d'approbation ne doit-il pas être copié ?
4. **Pourquoi.** Pourquoi le clonage d'une composition copie-t-il les parties, alors que celui d'une agrégation conserve les références ?
5. **Raisonnement pratique.** La copie d'un aéronef échoue sur la contrainte d'unicité de l'immatriculation. Comment concevoir l'opération ?

#### Réponses

1. Dupliquer copie la ressource seule. Cloner copie aussi ses parties (composition) et, selon la règle, certaines relations.
2. Par exemple l'identifiant, la version, les dates de création et de modification, l'auteur, l'état, les valeurs uniques.
3. Parce qu'une copie n'a pas été revue : elle apparaîtrait approuvée sans l'avoir été, contournant le processus.
4. Parce que, dans une composition, les parties n'ont de sens qu'avec leur tout : la copie doit avoir les siennes. Dans une agrégation, les parties existent indépendamment et peuvent être partagées.
5. Marquer le champ comme « à saisir » dans la règle de copie : l'utilisateur doit fournir une nouvelle immatriculation avant la création.

## 3.4 Fusionner

### 1. Comprendre simplement

**Fusionner** (*merge*) deux ressources, c'est les regrouper en une seule, plus complète, qui conserve l'information utile des deux et remplace les deux d'origine. On l'emploie surtout pour éliminer les **doublons** : deux fiches qui désignent en réalité la même chose.

**Pourquoi cela existe.** Dans toute base alimentée par plusieurs sources ou plusieurs personnes, des doublons apparaissent : le même technicien saisi deux fois, avec une orthographe différente. Ils faussent les rapports et dispersent l'historique.

**Problème résolu.** Reconstituer une seule fiche de référence, sans perdre d'information ni casser les liens.

**Modèle mental.** Deux dossiers papier ouverts pour la même personne. On en garde un, on y reporte ce qui manque, on réoriente tous les documents qui pointaient vers l'autre, puis on archive le second.

**Où l'analogie s'arrête.** Sur papier, un classeur ne change pas pendant qu'on fusionne. Dans une plateforme, d'autres utilisateurs peuvent modifier l'une ou l'autre fiche au même moment.

**Attention au mot « merge ».** Dans les outils de gestion de versions, il désigne la combinaison de deux séries de modifications d'un même document. Ici, il s'agit de fusionner deux ressources distinctes.

**Exemple.** Deux fiches *Technicien* : « J. Martin » (avec adresse électronique) et « Jean Martin » (avec numéro de licence). Elles désignent la même personne.

**Les composants.**

1. le choix de la **ressource survivante** ;
2. des **règles de résolution** champ par champ ;
3. la **réaffectation des références** ;
4. la **traçabilité** de l'opération.

**Objectif d'apprentissage :** vous pouvez décrire les étapes d'une fusion et les risques liés aux références et à la réversibilité.

### 2. Connaissances essentielles

#### Définition

La **fusion** est l'opération qui remplace plusieurs ressources du même type par une seule ressource survivante, en combinant leurs propriétés selon des règles de résolution et en redirigeant toutes les références qui pointaient vers les ressources absorbées.

#### Idées fondamentales

1. **Il y a une survivante et des absorbées.** Les absorbées cessent d'être actives.
2. **Chaque champ en conflit demande une règle.** La survivante gagne, la plus récente gagne, la valeur non vide gagne, ou choix manuel.
3. **Toutes les références doivent suivre.** Tâches, affectations et journaux qui pointaient vers l'absorbée doivent pointer vers la survivante.
4. **La détection des doublons est distincte de la fusion.** La détection est une recherche (exacte ou approchée) ; la fusion est l'action.
5. **La fusion est rarement réversible.** On conserve une trace pour la défaire si nécessaire.
6. **Les contraintes d'unicité peuvent entrer en conflit.** Par exemple deux affectations identiques après fusion.

#### Vocabulaire essentiel

- **Ressource survivante** (*survivor*, *golden record*) : celle qui reste et porte les données consolidées.
- **Ressource absorbée** (*merged record*) : celle qui est retirée.
- **Règle de survie** (*survivorship rule*) : règle de choix de la valeur de chaque champ.
- **Redirection** (*re-pointing*) : mise à jour des références vers la survivante.
- **Déduplication** (*deduplication*) : détection et traitement des doublons.
- **Annulation de fusion** (*unmerge*) : retour à l'état d'avant la fusion.

#### Relations de cause à effet

- Les références ne sont pas redirigées. Des tâches pointent vers une fiche absorbée, qui n'est plus active : elles deviennent orphelines.
- Les règles de survie ne sont pas définies. La valeur d'un champ est choisie arbitrairement, et une information fiable est perdue.
- Aucune trace n'est conservée. Une fusion erronée est impossible à défaire.

#### Idées reçues

- **« Fusionner, c'est supprimer le doublon. »** Non. Il faut d'abord reporter l'information utile et les liens.
- **« Un algorithme peut décider seul quels sont les doublons. »** Il propose des candidats. La décision de fusion, surtout pour des personnes, demande souvent une validation humaine.
- **« La fusion est toujours souhaitable. »** Non. Deux ressources très proches peuvent être légitimement distinctes (deux homonymes).

#### Principe clé

Une fusion est une transaction qui consolide les données, redirige les liens et laisse une trace, pour que l'on puisse l'expliquer, et au besoin l'annuler.

#### Si vous ne retenez que trois choses

1. Une fusion garde une ressource survivante et absorbe les autres.
2. Les valeurs sont résolues par des règles, et toutes les références sont redirigées.
3. L'opération doit être atomique, tracée, et si possible réversible.

### 3. Explication technique détaillée

#### Les étapes d'une fusion

```text
1. Sélection        choisir la survivante et les absorbées
2. Résolution       décider de la valeur de chaque champ en conflit
3. Redirection      réaffecter les références vers la survivante
4. Déduplication    traiter les liens redevenus identiques
5. Retrait          marquer les absorbées comme fusionnées (renvoi vers la survivante)
6. Trace            enregistrer l'opération et les valeurs d'origine
```

Toutes ces étapes forment **une seule transaction** (voir [3.9 Transactions et atomicité](#39-transactions-et-atomicité)).

#### Les règles de survie

| Règle | Principe | Exemple |
|---|---|---|
| La survivante gagne | On garde la valeur de la survivante | Nom officiel |
| La plus récente gagne | On garde la valeur modifiée en dernier | Adresse électronique |
| Non vide gagne | On remplit les vides | Numéro de licence |
| Plus grande valeur | On garde le maximum | Heures de vol cumulées |
| Choix manuel | L'utilisateur tranche | Champs sensibles |

#### La redirection des références

```sql
-- Toutes les affectations de l'absorbée passent à la survivante
UPDATE assignment
SET technician_id = :survivante
WHERE tenant_id = :tenant
  AND technician_id = :absorbee;
```

**Cas particulier.** Si la survivante et l'absorbée étaient toutes deux affectées à la même tâche, la redirection crée deux affectations identiques, ce qui viole la clé primaire `(tenant_id, task_id, technician_id)`. Il faut les consolider avant ou pendant la mise à jour.

#### Trace et réversibilité

On enregistre : les identifiants des absorbées, l'état complet de chacune avant fusion, la liste des références redirigées, l'auteur et le motif. Une ressource absorbée garde un champ `merged_into` : un accès à son ancienne adresse peut rediriger vers la survivante.

**Contre-exemple.** Supprimer physiquement l'absorbée sans conserver son état : les liens externes (signets, intégrations) qui y renvoient échouent, et la fusion ne peut plus être défaite.

#### Concurrence

Pendant la fusion, quelqu'un peut modifier une absorbée. On protège l'opération par un verrouillage ou par une vérification de version (voir [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste)) : si une ressource a changé depuis la sélection, la fusion est rejouée avec l'état à jour.

**Limites.** Fusionner des ressources qui ont des historiques d'audit propres pose la question de leur réunion : un journal qui mentionne l'absorbée doit rester compréhensible après la fusion.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère) | Les références à rediriger s'appuient sur les clés étrangères |
| [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Les contraintes d'unicité peuvent être violées par la redirection |
| [3.9 Transactions et atomicité](#39-transactions-et-atomicité) | La fusion est une transaction multi-ressources |
| [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste) | La concurrence doit être maîtrisée pendant la fusion |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | La fusion doit être tracée dans le journal d'audit |
| [3.2 Archiver et restaurer](#32-archiver-et-restaurer) | Une ressource absorbée est archivée plutôt qu'effacée |

### 5. Application pratique

**Situation initiale.** La base contient « J. Martin » et « Jean Martin », tous deux techniciens, avec des affectations différentes.

**Problème.** Les rapports de charge de travail sous-estiment chaque personne, car leur activité est répartie sur deux fiches.

**Application du concept.** Un responsable fusionne les deux fiches en choisissant « Jean Martin » comme survivante.

**Déroulé.**

1. L'interface affiche les deux fiches côte à côte, avec les conflits.
2. Le responsable choisit : nom de la survivante, adresse la plus récente, licence non vide.
3. Le moteur redirige les 38 affectations de « J. Martin » vers « Jean Martin ».
4. Deux affectations deviennent identiques : elles sont consolidées.
5. « J. Martin » est marquée « fusionnée dans Jean Martin ».

**Résultat.** Une seule fiche porte toute l'activité, et l'historique reste consultable.

**Limites.** Si les deux fiches désignaient en réalité deux personnes homonymes, la fusion est une erreur. C'est pourquoi on garde la trace et on prévoit une annulation.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une ressource survivante ?
2. **Compréhension.** Que doit-on faire des références qui pointent vers une ressource absorbée ?
3. **Compréhension.** Citez trois règles de résolution d'un champ en conflit.
4. **Pourquoi.** Pourquoi la fusion doit-elle être exécutée dans une seule transaction ?
5. **Raisonnement pratique.** Après redirection, une tâche a deux affectations du même technicien. Que faire ?

#### Réponses

1. C'est la ressource qui reste active après la fusion et qui porte les données consolidées.
2. Les rediriger vers la survivante, et conserver sur l'absorbée un renvoi (`merged_into`).
3. Par exemple : la survivante gagne, la plus récente gagne, la valeur non vide gagne.
4. Pour qu'en cas d'échec rien ne soit à moitié fusionné : références redirigées sans retrait de l'absorbée, ou l'inverse.
5. Les consolider en une seule affectation (en conservant, par exemple, le rôle le plus pertinent), avant ou pendant la redirection, pour respecter la contrainte d'unicité.

## 3.5 Déplacer et transférer

### 1. Comprendre simplement

**Déplacer** (*move*) une ressource, c'est changer sa **position** dans une structure : un autre dossier, un autre emplacement, un autre parent. **Transférer** (*transfer*) une ressource, c'est changer sa **responsabilité** : un autre propriétaire, une autre équipe, une autre organisation, voire un autre tenant.

**Pourquoi cela existe.** Les structures évoluent : on réorganise les emplacements, on rattache un projet à un autre service. Les responsabilités changent aussi : une personne quitte l'entreprise, un avion est vendu à une autre compagnie.

**Problème résolu.** Réorganiser et réaffecter sans recréer les ressources, donc en conservant leur identité, leurs liens et leur historique.

**Modèle mental.** Déménager un meuble d'une pièce à une autre (déplacer), ou le donner à quelqu'un d'autre (transférer).

**Où l'analogie s'arrête.** Un meuble déplacé garde les mêmes propriétés. Dans une plateforme, déplacer une ressource peut changer ses droits hérités, ses règles d'unicité et les vues qui l'affichent.

**Exemple.**

- *Déplacer* l'aéronef F-ABCD du hangar 2 au hangar 3 : sa position change, son exploitant reste le même.
- *Transférer* la tâche T-1042 du technicien A au technicien B : la responsabilité change, la position reste la même.

**Les composants.**

1. une **ressource** et son **état d'origine** ;
2. une **destination** (nouveau parent ou nouveau responsable) ;
3. des **contrôles** sur les droits et les règles ;
4. des **effets** sur les droits, les liens et les processus en cours.

**Objectif d'apprentissage :** vous pouvez distinguer déplacer et transférer, et expliquer pourquoi un transfert entre tenants n'est pas une simple modification.

### 2. Connaissances essentielles

#### Définition

- **Déplacement** : changement du rattachement d'une ressource dans une structure (hiérarchie, conteneur), sans changement de responsable.
- **Transfert** : changement du propriétaire ou du responsable d'une ressource, avec transmission des droits et des obligations associés.

#### Idées fondamentales

1. **L'identité est conservée.** La ressource garde son identifiant et son historique.
2. **Déplacer touche la structure ; transférer touche la responsabilité.** Les deux peuvent se combiner.
3. **Les droits doivent être vérifiés des deux côtés.** Sur la source (peut-on retirer ?) et sur la destination (peut-on recevoir ?).
4. **Les effets en cascade sont à maîtriser.** Droits hérités, processus en cours, notifications.
5. **Un transfert entre tenants est une opération à part.** Les identifiants, les définitions et les droits diffèrent d'un tenant à l'autre.
6. **Un transfert peut demander une acceptation.** Le destinataire confirme avant la prise en charge.

#### Vocabulaire essentiel

- **Parent** (*parent*) : élément de la structure auquel la ressource est rattachée.
- **Propriétaire** (*owner*) : responsable de la ressource.
- **Destination** (*target*) : nouveau parent ou nouveau responsable.
- **Droits hérités** (*inherited permissions*) : droits qui viennent du parent (voir [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles)).
- **Transfert inter-tenants** (*cross-tenant transfer*) : passage d'une ressource d'un tenant à un autre.
- **Acceptation** (*acceptance*) : confirmation du destinataire.

#### Relations de cause à effet

- Une ressource est déplacée sous un nouveau parent. Elle hérite des droits du nouveau parent, et peut devenir visible ou invisible pour des personnes.
- Une ressource est déplacée sous l'un de ses propres descendants. Un cycle apparaît dans la hiérarchie (voir [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie)).
- Le propriétaire est changé sans traiter les processus en cours. Des tâches en attente restent attribuées à l'ancien responsable.

#### Idées reçues

- **« Déplacer, c'est copier puis supprimer. »** Non. La copie crée une nouvelle identité : les liens et l'historique sont perdus.
- **« Transférer, c'est changer un champ `owner`. »** Au sein d'un tenant, souvent oui, mais il faut aussi traiter droits, tâches et notifications. Entre tenants, c'est une opération beaucoup plus lourde.
- **« Un déplacement ne change rien aux droits. »** Faux dès que les droits héritent de la structure.

#### Principe clé

Déplacer ou transférer préserve l'identité de la ressource ; la plateforme doit en revanche recalculer tout ce qui dépendait de sa position ou de son responsable.

#### Si vous ne retenez que trois choses

1. Déplacer change la position ; transférer change la responsabilité.
2. L'identité et l'historique de la ressource sont conservés.
3. Un transfert entre tenants est une opération contrôlée, non une simple mise à jour.

### 3. Explication technique détaillée

#### Comparaison avec les opérations voisines

| Opération | Identité | Ce qui change | Exemple |
|---|---|---|---|
| Déplacer | Conservée | Parent, position | Aéronef du hangar 2 au hangar 3 |
| Transférer | Conservée | Propriétaire, responsable | Tâche du technicien A au B |
| Cloner | Nouvelle | Tout est copié | Nouveau plan d'inspection |
| Archiver | Conservée | État | Aéronef vendu |

#### Les contrôles d'un déplacement

1. La ressource et la destination existent et appartiennent au même tenant.
2. La destination accepte ce type de ressource.
3. Aucun cycle n'est créé (pas de déplacement sous un descendant).
4. L'utilisateur peut retirer la ressource de la source **et** l'ajouter à la destination.
5. Les contraintes d'unicité dans le nouveau parent sont respectées (par exemple un nom unique par dossier).

```sql
-- Déplacement d'un emplacement sous un nouveau parent (liste d'adjacence)
UPDATE location
SET parent_id = :nouveau_parent
WHERE tenant_id = :tenant
  AND id = :id;
```

**Effets à recalculer.** Chemin matérialisé (voir [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie)), droits hérités (voir [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles)), compteurs et agrégats rattachés au parent.

#### Les contrôles d'un transfert au sein d'un tenant

1. Le nouveau responsable existe, est actif et a le droit de recevoir.
2. L'utilisateur a le droit de transférer.
3. Les **processus en cours** (tâches, approbations) sont réaffectés ou conservés selon une règle explicite.
4. Les notifications préviennent les deux personnes.
5. L'événement est tracé dans le journal d'audit.

**Variante avec acceptation.** Le transfert passe par deux états : *proposé*, puis *accepté* ou *refusé*. La ressource reste chez l'ancien responsable jusqu'à l'acceptation.

#### Le transfert entre tenants

C'est un cas à part. Une ressource ne peut pas simplement changer de `tenant_id`, car :

- ses références pointent vers des ressources du tenant d'origine ;
- les définitions de types et de champs du tenant de destination peuvent différer ;
- les droits, les rôles et les utilisateurs référencés n'existent pas dans l'autre tenant ;
- les obligations de conservation et de confidentialité peuvent exiger de garder une trace dans l'origine.

On le réalise par une procédure explicite : export, correspondance de schémas, import dans la destination, puis archivage dans l'origine, avec consentement des deux parties et trace dans les deux journaux.

**Exemple.** Un aéronef vendu à une autre compagnie qui utilise la même plateforme. Les inspections passées peuvent être transmises, tandis que l'historique interne du vendeur (notes, coûts) reste dans son tenant.

**Contre-exemple.** Modifier directement `tenant_id` d'une ressource pour la « transférer » : les références croisées, les droits et les index deviennent incohérents, et l'isolation entre tenants est compromise.

**Limites.** Le transfert inter-tenants est coûteux à concevoir. Beaucoup de plateformes le proposent seulement pour quelques types, avec une procédure supervisée (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | Déplacer modifie la position dans une hiérarchie, sans créer de cycle |
| [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles) | Les droits hérités suivent le déplacement |
| [3.3 Cloner et dupliquer](#33-cloner-et-dupliquer) | Cloner crée une nouvelle identité, contrairement à déplacer |
| [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants) | L'administration inter-tenants encadre les transferts entre tenants |
| [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant) | La migration d'un tenant est un déplacement de masse |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Chaque déplacement ou transfert doit être tracé |

### 5. Application pratique

**Situation initiale.** Un technicien quitte la compagnie. Il est responsable de 14 tâches ouvertes.

**Problème.** Si son compte est désactivé sans traitement, ces tâches restent bloquées.

**Application du concept.** Un responsable transfère en une opération les tâches ouvertes à un autre technicien.

**Déroulé.**

1. Le responsable sélectionne les 14 tâches et choisit « Transférer à ».
2. Le moteur vérifie que le destinataire est actif et qualifié pour ces tâches.
3. Il change le responsable et conserve l'historique des affectations.
4. Il notifie le destinataire et met à jour les files de travail.

**Résultat.** Les tâches continuent sans interruption, avec une trace de qui les détenait avant.

**Limites.** Si une tâche exige une qualification que le destinataire n'a pas, le transfert est refusé pour celle-ci. Il faut un rapport clair du résultat (voir [3.6 Opérations en masse](#36-opérations-en-masse)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre déplacer et transférer ?
2. **Compréhension.** Pourquoi déplacer n'est-il pas équivalent à copier puis supprimer ?
3. **Compréhension.** Quels contrôles protègent un déplacement dans une hiérarchie ?
4. **Pourquoi.** Pourquoi un transfert entre tenants n'est-il pas une simple modification de `tenant_id` ?
5. **Raisonnement pratique.** Un aéronef est vendu à une autre compagnie. Comment traiter son historique d'inspections ?

#### Réponses

1. Déplacer change la position dans une structure ; transférer change le propriétaire ou le responsable.
2. Copier crée une nouvelle identité : les références, les liens externes et l'historique ne suivent pas.
3. Vérifier l'existence et le type de la destination, l'absence de cycle, les droits côté source et destination, et l'unicité dans le nouveau parent.
4. Parce que les références, les définitions, les droits et les utilisateurs sont propres à chaque tenant ; changer le champ rendrait les données incohérentes et romprait l'isolation.
5. Par une procédure explicite : transmettre les inspections réglementaires à la compagnie acheteuse selon un schéma convenu, archiver l'aéronef chez le vendeur, et conserver une trace dans les deux tenants.

## 3.6 Opérations en masse

### 1. Comprendre simplement

Une **opération en masse** (*bulk operation*) applique la même action à **de nombreuses ressources en une seule demande** : créer 500 tâches, passer 120 aéronefs au statut « en inspection », archiver tous les rapports de plus de dix ans.

**Pourquoi cela existe.** Répéter une action ressource par ressource est long pour l'utilisateur et coûteux pour le système, qui paie à chaque fois les coûts d'authentification, de réseau et de transaction. Regrouper réduit ces coûts et simplifie le suivi.

**Problème résolu.** Traiter efficacement de grands ensembles de ressources, et rendre compte de ce qui a réussi ou échoué.

**Modèle mental.** Un facteur qui dépose un sac de courrier dans une boîte plutôt qu'une lettre à la fois. Il faut ensuite savoir quelles lettres sont arrivées.

**Où l'analogie s'arrête.** Un sac de courrier est livré ou non. Une opération en masse peut réussir pour certains éléments et échouer pour d'autres : l'état partiel est le cœur du problème.

**Exemple.** Un planificateur sélectionne 120 aéronefs et les passe en « en inspection ». Pour trois d'entre eux, une tâche bloquante existe : ils sont refusés, les 117 autres sont modifiés.

**Les composants.**

1. un **ensemble cible** (liste explicite ou filtre) ;
2. une **opération** commune ;
3. un **mode d'exécution** (tout ou rien, ou meilleur effort) ;
4. un **rapport** par élément.

**Objectif d'apprentissage :** vous pouvez choisir entre atomicité totale et succès partiel, et décrire ce qu'un rapport d'opération en masse doit contenir.

### 2. Connaissances essentielles

#### Définition

Les **opérations en masse** (*bulk operations*) sont des demandes uniques qui appliquent une opération à plusieurs ressources, avec une sémantique explicite d'exécution (atomique ou partielle) et un résultat détaillé par ressource.

#### Idées fondamentales

1. **Deux sémantiques.** Tout ou rien (atomique), ou meilleur effort avec succès partiel.
2. **Chaque élément est contrôlé individuellement.** Droits, validation, règles métier s'appliquent à chacun.
3. **Le résultat est détaillé.** Un statut par élément, plus un résumé.
4. **Les lots sont bornés.** Taille maximale, délai maximal, quotas.
5. **Le grand volume est asynchrone.** Une tâche de fond avec identifiant et suivi d'avancement.
6. **Les actions destructrices demandent des garde-fous.** Aperçu du nombre d'éléments, confirmation.

#### Vocabulaire essentiel

- **Lot** (*batch*) : ensemble d'éléments traités ensemble.
- **Atomique** (*all-or-nothing*) : tout réussit, ou rien n'est appliqué.
- **Meilleur effort** (*best effort*) : chaque élément est traité indépendamment.
- **Succès partiel** (*partial success*) : certains éléments réussissent, d'autres échouent.
- **Simulation** (*dry run*) : exécution à blanc qui calcule le résultat sans l'appliquer.
- **Tâche de fond** (*background job*) : traitement exécuté en dehors de la requête (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).

#### Relations de cause à effet

- Le lot est traité de façon atomique. Une seule erreur annule tout, ce qui est sûr mais frustrant pour de gros lots.
- Le lot est traité en meilleur effort. Une partie est appliquée : le client doit savoir exactement laquelle, pour corriger le reste.
- Le lot est trop grand pour une requête. Le délai d'attente expire, et on ne sait pas ce qui a été appliqué.

#### Idées reçues

- **« Une opération en masse est une boucle d'opérations unitaires. »** Pas exactement. Elle doit aussi gérer les limites, la transaction, le rapport et les accès simultanés.
- **« Le tout ou rien est toujours préférable. »** Non. Pour 100 000 éléments, une seule erreur ne devrait pas bloquer 99 999 réussites.
- **« Une réponse `200` signifie que tout s'est bien passé. »** Pas pour un lot : le statut de chaque élément doit être lu.

#### Principe clé

Une opération en masse doit toujours dire, élément par élément, ce qui a été appliqué, ce qui a été refusé et pourquoi.

#### Si vous ne retenez que trois choses

1. Une opération en masse applique une action à de nombreuses ressources avec une sémantique explicite.
2. Atomique ou meilleur effort : le choix dépend du métier et de la taille du lot.
3. Le rapport détaillé par élément est indispensable.

### 3. Explication technique détaillée

#### Choisir la sémantique

| Critère | Atomique | Meilleur effort |
|---|---|---|
| Cohérence | Totale | Par élément |
| Impact d'une erreur | Annule tout | Isolé à l'élément |
| Taille de lot adaptée | Petite à moyenne | Grande |
| Verrouillage | Plus long, plus étendu | Plus court |
| Reprise | Simple (rejouer le lot) | Rejouer les éléments en échec |

#### Un exemple de requête et de réponse

```http
POST /resources/aircraft/bulk HTTP/1.1
Idempotency-Key: 7d1f2c9e-5a31-4b8a-9d5f-1b3c0e2a6c11
Content-Type: application/json

{
  "mode": "best_effort",
  "operations": [
    { "op": "update", "id": "ac_1",   "patch": { "status": "in_inspection" } },
    { "op": "update", "id": "ac_2",   "patch": { "status": "in_inspection" } },
    { "op": "update", "id": "ac_999", "patch": { "status": "in_inspection" } }
  ]
}
```

```json
{
  "summary": { "total": 3, "succeeded": 2, "failed": 1 },
  "results": [
    { "index": 0, "status": "ok",    "id": "ac_1", "version": 8 },
    { "index": 1, "status": "ok",    "id": "ac_2", "version": 4 },
    { "index": 2, "status": "error", "code": "not_found", "message": "Ressource introuvable." }
  ]
}
```

**Comment la lire.** Le résumé donne le bilan. Chaque entrée de `results` renvoie à l'élément par son rang. Une erreur porte un code stable exploitable par le client.

#### Opérations par filtre

Une demande du type « passer en inspection tous les aéronefs de la base de Lyon » désigne des éléments par un **critère** plutôt que par une liste. C'est plus puissant, et plus dangereux : le résultat dépend de l'état de la base au moment de l'exécution.

Précautions :

1. **Aperçu** : afficher le nombre d'éléments concernés avant d'exécuter.
2. **Figer l'ensemble** : résoudre le filtre en une liste d'identifiants au début.
3. **Confirmation explicite** pour les actions destructrices.
4. **Plafond** sur le nombre d'éléments par opération.

#### Exécution asynchrone

Au-delà d'une taille, l'opération devient une **tâche** :

```text
POST /bulk          ──►  202 Accepted  { "job_id": "job_41" }
GET  /jobs/job_41   ──►  { "status": "running", "done": 3200, "total": 10000 }
GET  /jobs/job_41   ──►  { "status": "completed", "succeeded": 9980, "failed": 20 }
```

**Pourquoi.** Cela évite les délais d'attente, permet de suivre l'avancement et de relancer ou d'annuler.

#### Modes de défaillance

- **Délai d'attente sans résultat** : on ne sait pas ce qui a été appliqué (d'où l'idempotence, voir [3.11 Idempotence](#311-idempotence)).
- **Verrouillage excessif** : un lot atomique de 50 000 éléments bloque les autres utilisateurs.
- **Effets de bord multiples** : 10 000 notifications envoyées d'un coup. On regroupe ou on limite.
- **Contournement des quotas** : une opération en masse dépasse les limites de débit unitaires.

**Limites.** Les opérations en masse sont soumises aux mêmes règles d'autorisation que les opérations unitaires, élément par élément. Un administrateur qui peut modifier mille ressources peut aussi en détériorer mille : l'audit et la possibilité d'annulation sont d'autant plus importants (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.9 Transactions et atomicité](#39-transactions-et-atomicité) | L'atomicité d'un lot repose sur les transactions |
| [3.11 Idempotence](#311-idempotence) | Une clé d'idempotence rend la reprise d'un lot sûre |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les gros lots s'exécutent comme tâches de fond |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | Les quotas et la limitation de débit s'appliquent aux lots |
| [12.8 Actions en masse](12-produit-ux.md#128-actions-en-masse) | L'interface doit proposer aperçu et confirmation |
| [3.7 Import et export](#37-import-et-export) | L'import est une opération en masse alimentée par un fichier |

### 5. Application pratique

**Situation initiale.** Une autorité publie une consigne : 300 aéronefs de la flotte doivent être inspectés avant la fin du mois.

**Problème.** Créer 300 tâches une à une prendrait une journée et laisserait des oublis.

**Application du concept.** Le planificateur crée les 300 tâches par une opération en masse en meilleur effort, avec un rapport.

**Déroulé.**

1. Il sélectionne les aéronefs par filtre. Le système indique : 300 éléments.
2. Il lance l'opération. Le moteur la traite comme une tâche de fond.
3. Le moteur applique les règles à chaque aéronef. Dix sont refusés : ils ont déjà une tâche ouverte pour la même consigne.
4. Un rapport de 290 réussites et 10 refus avec motif est mis à disposition.

**Résultat.** L'essentiel est fait en quelques minutes, et le reste est traité en connaissance de cause.

**Limites.** Si le planificateur relance par erreur l'opération, des doublons peuvent être créés : une clé d'idempotence évite ce risque.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un lot atomique et un lot en meilleur effort ?
2. **Compréhension.** Que doit contenir le résultat d'une opération en masse ?
3. **Compréhension.** Pourquoi plafonne-t-on la taille des lots ?
4. **Pourquoi.** Pourquoi résout-on un filtre en une liste d'identifiants avant d'exécuter ?
5. **Raisonnement pratique.** Une opération sur 100 000 éléments expire côté client après 30 secondes. Comment le concevoir autrement ?

#### Réponses

1. Un lot atomique applique tout ou rien. En meilleur effort, chaque élément est traité indépendamment et peut réussir ou échouer.
2. Un résumé (nombres totaux, réussites, échecs) et un résultat par élément avec un statut et, en cas d'échec, un code et un message.
3. Pour limiter la durée des transactions et des verrous, la charge sur la plateforme et la taille des réponses.
4. Pour figer l'ensemble cible : l'état de la base peut changer pendant l'exécution, et l'opération doit s'appliquer à ce que l'utilisateur a vu et confirmé.
5. En tâche asynchrone : la requête retourne un identifiant de tâche, et le client suit l'avancement et récupère le résultat à la fin.

## 3.7 Import et export

### 1. Comprendre simplement

L'**import** (*import*) fait entrer dans la plateforme des données qui viennent d'ailleurs : un fichier, un autre système. L'**export** (*export*) fait sortir des données de la plateforme vers un fichier ou un autre système.

**Pourquoi cela existe.** Aucune plateforme n'est utilisée dans le vide. Un client arrive avec des données existantes. Il a besoin de les analyser dans un tableur, de les transmettre à un partenaire ou de les conserver. Et la réglementation lui donne le droit de récupérer ses données.

**Problème résolu.** Déplacer de gros volumes de données entre la plateforme et le monde extérieur, de façon contrôlée, vérifiée et traçable.

**Modèle mental.** Les douanes d'un port. À l'entrée, les marchandises sont contrôlées, déclarées et rangées. À la sortie, on vérifie ce qui a le droit de partir.

**Où l'analogie s'arrête.** Une marchandise est acceptée ou refusée. Un import peut être accepté en partie, avec des corrections, et un export doit adapter son contenu aux droits de la personne qui le demande.

**Exemple.** Une compagnie qui rejoint la plateforme importe un fichier de 8 000 aéronefs et équipements depuis son ancien système. Chaque semaine, elle exporte la liste des inspections à venir au format CSV pour un audit externe.

**Les composants d'un import.**

1. la **lecture** du fichier ;
2. la **correspondance** des colonnes avec les champs ;
3. la **validation** ;
4. l'**application** (création ou mise à jour) ;
5. le **rapport**.

**Objectif d'apprentissage :** vous pouvez décrire les étapes d'un import sûr, et citer deux précautions propres à l'export.

### 2. Connaissances essentielles

#### Définition

- **Import** : opération qui lit des données externes, les met en correspondance avec le modèle de la plateforme, les valide et les enregistre.
- **Export** : opération qui sélectionne des données de la plateforme, les met en forme dans un format de fichier ou d'échange, et les livre.

#### Idées fondamentales

1. **Un import passe par le même moteur que la saisie.** Mêmes règles de validation, mêmes droits, même audit.
2. **La correspondance est explicite.** Chaque colonne source est associée à un champ cible.
3. **On valide d'abord, on applique ensuite.** Un aperçu ou une simulation évite les mauvaises surprises.
4. **Un import doit être rejouable.** Il utilise une clé externe pour mettre à jour plutôt que dupliquer.
5. **Un export respecte les droits.** Chaque utilisateur n'exporte que ce qu'il a le droit de voir.
6. **Un export est une sortie de données.** Il doit être contrôlé, tracé et sûr pour l'ouverture dans d'autres outils.

#### Vocabulaire essentiel

- **Correspondance** (*mapping*) : association entre colonnes sources et champs cibles.
- **Clé externe** (*external ID*) : identifiant de la ressource dans le système d'origine.
- **Insertion ou mise à jour** (*upsert*) : crée si absent, met à jour si présent.
- **Zone d'attente** (*staging*) : stockage temporaire avant application.
- **Rapport d'import** : liste des lignes acceptées, refusées et corrigées.
- **Portabilité des données** : droit de récupérer ses données dans un format structuré et lisible par machine.

#### Relations de cause à effet

- L'import contourne la validation. Des données invalides entrent en masse, et sont difficiles à corriger après coup.
- Il n'y a pas de clé externe. Un deuxième import du même fichier crée des doublons.
- L'export ignore les droits au niveau du champ. Un utilisateur obtient par fichier ce que l'interface lui cache.

#### Idées reçues

- **« Importer, c'est insérer des lignes en base. »** Non. Passer par la base directement contourne les règles du moteur.
- **« Un export est sans danger. »** Non. C'est une copie hors du système : confidentialité, fuite, et risques à l'ouverture du fichier.
- **« Un fichier CSV est un format fiable. »** Pas sans convention : encodage, séparateurs, dates et nombres varient selon les pays et les outils.

#### Principe clé

L'import et l'export traversent la frontière de la plateforme : ils appliquent les mêmes règles que la saisie normale, et laissent une trace complète.

#### Si vous ne retenez que trois choses

1. L'import passe par le moteur ; il valide, met en correspondance, applique et rend compte.
2. Une clé externe rend l'import rejouable sans doublons.
3. L'export applique les droits de l'utilisateur et protège les fichiers produits.

### 3. Explication technique détaillée

#### Le pipeline d'import

```text
Fichier ─► Lecture ─► Correspondance ─► Validation ─► Aperçu ─► Application ─► Rapport
 (CSV,    (encodage,   (colonnes ->      (schéma,      (nombre   (par lots,     (lignes ok,
 JSON,     séparateur)  champs)          règles)       d'erreurs) transaction)  refusées)
 XLSX)
```

**Pourquoi un aperçu.** Un import qui modifie 8 000 ressources ne se défait pas facilement. Montrer le nombre de créations, de modifications et d'erreurs avant d'appliquer évite des erreurs coûteuses.

#### La correspondance comme donnée

```json
{
  "type": "aircraft",
  "key": "external_id",
  "mapping": [
    { "column": "Immat",     "field": "registration" },
    { "column": "Modèle",    "field": "model" },
    { "column": "Prochaine", "field": "next_inspection_date", "format": "DD/MM/YYYY" },
    { "column": "Base",      "field": "base", "lookup": { "type": "location", "by": "name" } }
  ],
  "on_missing_reference": "reject_row"
}
```

**Comment la lire.** Chaque colonne est associée à un champ, avec un format de date. La colonne « Base » est résolue en référence par recherche du nom. Une référence introuvable rejette la ligne.

#### Ordre et dépendances

Un import qui contient plusieurs types doit respecter l'ordre des dépendances : d'abord les emplacements, puis les aéronefs qui les référencent, puis les tâches qui référencent les aéronefs. Les clés externes permettent de résoudre les références avant même que les identifiants internes existent.

#### Rejouabilité

Avec une clé externe unique par ressource, l'import devient une insertion ou mise à jour :

```sql
INSERT INTO aircraft (tenant_id, id, external_id, registration, model)
VALUES (:tenant, :id, :ext, :reg, :model)
ON CONFLICT (tenant_id, external_id)
DO UPDATE SET registration = EXCLUDED.registration,
              model        = EXCLUDED.model;
```

**Pourquoi.** Si l'import est interrompu et relancé, les ressources déjà créées sont mises à jour, pas dupliquées (voir [3.11 Idempotence](#311-idempotence)).

#### L'export

| Sujet | Précaution |
|---|---|
| Droits | Appliquer les droits de ligne et de champ de l'utilisateur (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) |
| Volume | Génération asynchrone pour les gros exports, avec lien temporaire |
| Cohérence | Fixer l'instant de lecture pour éviter un fichier à moitié à jour |
| Format | Dates en ISO 8601, encodage UTF-8, séparateurs documentés |
| Confidentialité | Journaliser qui a exporté quoi, quand, et pour quel périmètre |
| Sécurité du fichier | Neutraliser l'injection de formules dans les tableurs |

**Injection de formules.** Un tableur interprète comme une formule une cellule qui commence par `=`, `+`, `-` ou `@`. Une valeur saisie par un utilisateur malveillant peut donc s'exécuter à l'ouverture du fichier exporté. On neutralise en préfixant ces valeurs d'une apostrophe ou d'un caractère d'échappement.

**Portabilité.** Le RGPD (article 20) donne aux personnes concernées le droit de recevoir leurs données dans un format structuré, couramment utilisé et lisible par machine. Un export en CSV ou en JSON répond à cette exigence pour les données personnelles.

**Limites.** Un export complet d'un tenant n'est pas une sauvegarde : il ne contient ni la configuration complète ni les garanties de cohérence d'une sauvegarde (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.6 Opérations en masse](#36-opérations-en-masse) | L'import est une opération en masse |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | L'import utilise le même moteur de validation que la saisie |
| [3.11 Idempotence](#311-idempotence) | La clé externe rend l'import idempotent |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | L'export respecte les droits au niveau du champ et de la ligne |
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | Les intégrations automatisent l'import et l'export entre systèmes |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | L'export de sortie fait partie du déprovisionnement d'un tenant |

### 5. Application pratique

**Situation initiale.** Une nouvelle compagnie dispose d'un fichier de 8 000 aéronefs et équipements issu d'un ancien système.

**Problème.** Le fichier contient des doublons, des dates dans trois formats et des statuts non conformes.

**Application du concept.** L'import passe par un pipeline avec correspondance, simulation et rapport.

**Déroulé.**

1. L'administrateur charge le fichier et définit la correspondance des colonnes.
2. Le moteur exécute une simulation : 7 650 lignes valides, 350 en erreur.
3. L'administrateur télécharge le rapport, corrige le fichier et relance.
4. Cette fois, 8 000 lignes sont valides. L'import applique par lots de 500.
5. Un rapport final est conservé.

**Résultat.** Les données sont dans la plateforme avec les mêmes garanties que si elles avaient été saisies une à une.

**Limites.** Les anciennes données peuvent contenir des informations sensibles que le fichier expose en clair. Le fichier d'import doit être traité comme une donnée confidentielle, et supprimé après usage.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les étapes d'un import ?
2. **Compréhension.** À quoi sert une clé externe ?
3. **Compréhension.** Pourquoi un export doit-il respecter les droits au niveau du champ ?
4. **Pourquoi.** Pourquoi propose-t-on une simulation avant d'appliquer un import ?
5. **Raisonnement pratique.** Un export CSV contient une cellule `=HYPERLINK("http://…")` saisie par un utilisateur. Quel est le risque, et que faire ?

#### Réponses

1. Lecture, correspondance des colonnes, validation, aperçu, application par lots, rapport.
2. À identifier la ressource dans le système d'origine, pour mettre à jour plutôt que dupliquer quand l'import est rejoué.
3. Parce qu'un export est une autre porte d'accès aux données : sans ce contrôle, un utilisateur obtient par fichier ce que l'interface lui cache.
4. Parce qu'un import modifie de nombreuses ressources et ne se défait pas facilement ; l'aperçu permet de corriger avant d'appliquer.
5. Le tableur peut l'interpréter comme une formule à l'ouverture du fichier (injection de formules). On neutralise en préfixant les valeurs commençant par `=`, `+`, `-` ou `@`.

## 3.8 Validation et gestion des erreurs

### 1. Comprendre simplement

La **validation** à l'exécution (*validation*) est l'étape où le moteur vérifie une demande avant de l'appliquer. La **gestion des erreurs** (*error handling*) est la manière dont le moteur signale ce qui n'a pas pu être fait : quel est le problème, qui doit le corriger et ce qu'il est possible de faire ensuite.

**Pourquoi cela existe.** Dans une plateforme, des milliers de demandes arrivent de sources variées. Beaucoup échoueront : donnée incorrecte, droit manquant, ressource modifiée entre-temps, panne. La qualité de la plateforme se juge à la clarté et à la cohérence de ses réponses d'erreur.

**Problème résolu.** Permettre au client de comprendre une erreur, de décider s'il peut réessayer, et d'agir.

**Modèle mental.** Un guichet qui refuse un dossier. Un bon guichet dit pourquoi, précise ce qui manque et indique s'il faut revenir demain ou apporter une pièce.

**Où l'analogie s'arrête.** Un guichetier peut improviser. Un client logiciel a besoin de codes stables et lisibles par machine, pas seulement de phrases.

**Exemple.** Une demande de création d'aéronef échoue parce que l'immatriculation est déjà utilisée. La réponse indique le champ concerné, un code stable et un message lisible.

**La famille d'erreurs.**

1. **erreur du client** (demande invalide, droit manquant, ressource absente) ;
2. **conflit** (état incompatible, modification concurrente) ;
3. **limite** (quota, débit) ;
4. **erreur du serveur** (panne, délai).

**Objectif d'apprentissage :** vous pouvez classer une erreur dans sa famille, et dire pourquoi cela détermine si le client doit réessayer.

### 2. Connaissances essentielles

#### Définition

- **Validation à l'exécution** : étape du traitement d'une demande qui vérifie sa conformité (structure, schéma, règles) avant toute écriture.
- **Gestion des erreurs** : ensemble des conventions et des mécanismes qui classent, signalent et traitent les échecs d'une opération.

#### Idées fondamentales

1. **Une erreur est une réponse à part entière.** Elle fait partie du contrat de l'API.
2. **Le code est stable, le message est humain.** Le client s'appuie sur le code ; l'utilisateur lit le message.
3. **La famille détermine la suite.** Une erreur du client ne se corrige pas par une nouvelle tentative identique ; une erreur de panne, oui.
4. **Les erreurs de validation sont complètes.** On les remonte toutes d'un coup, avec le champ concerné.
5. **On ne divulgue pas l'interne.** Pas de trace de pile ni de détail de base de données dans la réponse.
6. **Chaque erreur est corrélable.** Un identifiant de requête permet de retrouver l'incident dans les journaux.

#### Vocabulaire essentiel

- **Code d'erreur** (*error code*) : identifiant stable et lisible par machine.
- **Détail de problème** (*problem details*) : format normalisé de réponse d'erreur HTTP.
- **Identifiant de requête** (*request ID*, *correlation ID*) : valeur qui relie une réponse à ses journaux.
- **Erreur transitoire** (*transient error*) : erreur susceptible de disparaître à une nouvelle tentative.
- **Erreur permanente** : erreur qui se reproduira à l'identique.
- **Défaillance partielle** : échec d'une partie seulement d'une opération composée.

#### Relations de cause à effet

- Les erreurs n'ont pas de code stable. Les clients analysent les messages, et cassent dès que le texte change.
- Une erreur transitoire et une erreur permanente sont confondues. Les clients réessaient indéfiniment une demande invalide, ou abandonnent une demande qui aurait réussi.
- Les messages exposent des détails internes. Un attaquant apprend la structure de la base ou l'existence d'une ressource.

#### Idées reçues

- **« Toute erreur doit renvoyer le même message générique. »** Non. Trop vague, le message n'aide pas ; trop précis, il divulgue. Il faut un équilibre selon l'audience.
- **« Les erreurs 4xx sont celles du serveur. »** Non. Les codes `4xx` indiquent une erreur du client, les `5xx` une erreur du serveur.
- **« Il suffit de lever une exception. »** Non. Une exception interne doit être traduite en réponse structurée, avec un code et une famille.

#### Principe clé

Une erreur bien conçue dit ce qui s'est passé, à qui revient la correction, et si une nouvelle tentative a un sens.

#### Si vous ne retenez que trois choses

1. Les erreurs ont un code stable, un message humain et un champ concerné.
2. La famille d'erreur détermine si le client corrige, réessaie ou abandonne.
3. Les détails internes restent dans les journaux, pas dans la réponse.

### 3. Explication technique détaillée

#### Les familles et leurs codes HTTP

| Famille | Code HTTP | Exemple | Réessayer ? |
|---|---|---|---|
| Demande invalide | `400`, `422` | Champ obligatoire absent | Non, corriger d'abord |
| Non authentifié | `401` | Jeton absent ou expiré | Après authentification |
| Non autorisé | `403` | Droit manquant | Non |
| Introuvable | `404` | Ressource inexistante ou invisible | Non |
| Conflit | `409`, `412` | Version obsolète, état incompatible | Après relecture |
| Limite | `429` | Quota de débit atteint | Oui, après un délai |
| Panne serveur | `500`, `503` | Base indisponible | Oui, avec reprise progressive |

**Remarque.** La RFC 9110 nomme `422` « Unprocessable Content ». Il signale une demande bien formée mais sémantiquement invalide, par exemple un échec de validation.

#### Un format normalisé

La RFC 9457 définit un format de réponse d'erreur pour les API HTTP, de type `application/problem+json`, qui remplace la RFC 7807.

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "La validation a échoué",
  "status": 422,
  "detail": "Deux champs sont invalides.",
  "instance": "/resources/aircraft",
  "request_id": "req_91ab33",
  "errors": [
    { "field": "registration", "code": "already_exists", "message": "Cette immatriculation est déjà utilisée." },
    { "field": "next_inspection_date", "code": "in_past", "message": "La date doit être dans le futur." }
  ]
}
```

#### Ne pas révéler l'existence

Quand un utilisateur demande une ressource qu'il n'a pas le droit de voir, répondre `403` confirme qu'elle existe. Beaucoup de plateformes répondent `404` dans ce cas : l'appelant ne peut pas distinguer l'absence de l'interdiction. Ce choix protège les données, mais complique le diagnostic : l'identifiant de requête et les journaux compensent.

#### Où se produisent les erreurs

```text
Entrée          ─► structure, authentification         (400, 401)
Autorisation    ─► droits                              (403, 404)
Validation      ─► schéma, règles                      (422)
Règles métier   ─► état, conflits                      (409)
Persistance     ─► concurrence, contraintes            (409, 412)
Dépendances     ─► services tiers, base                (502, 503, 504)
```

#### Erreurs partielles

Dans une opération composée (lot, import), certaines parties réussissent et d'autres non. La réponse doit indiquer précisément l'état de chaque partie (voir [3.6 Opérations en masse](#36-opérations-en-masse)). Un code global trompeur (`200` alors que la moitié a échoué) est une source d'erreurs silencieuses.

**Contre-exemple.** Une réponse `500` avec le texte « Erreur interne » pour une immatriculation en doublon. Le client ne sait ni que l'erreur vient de sa demande ni qu'il peut la corriger, et réessaie en boucle.

**Limites.** Un catalogue de codes d'erreur est un contrat : on peut en ajouter, pas en retirer ou en changer le sens sans casser des clients (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation des données définit les règles ; le runtime les applique et les signale |
| [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste) | Les conflits de version produisent des erreurs `409` ou `412` |
| [3.11 Idempotence](#311-idempotence) | Une erreur transitoire se traite par nouvelle tentative idempotente |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Les délais d'expiration et les reprises sont traités au niveau des workflows |
| [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs) | Le suivi des erreurs collecte et agrège les erreurs serveur |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | L'interface affiche les erreurs de façon compréhensible |

### 5. Application pratique

**Situation initiale.** Une application cliente enregistre des inspections. Elle réessaie automatiquement toute requête qui échoue.

**Problème.** Une demande avec une date invalide est renvoyée 50 fois, sans jamais réussir, et sature la file de traitement.

**Application du concept.** L'API retourne des codes distincts par famille. Le client ne réessaie que les erreurs transitoires.

**Déroulé.**

1. L'API répond `422` avec le champ `next_inspection_date` et le code `in_past`.
2. Le client reconnaît une erreur permanente et n'insiste pas.
3. Il affiche le message à l'utilisateur, qui corrige.
4. Pour un `503`, il réessaie avec un délai croissant.

**Résultat.** Plus de tempête de requêtes inutiles, et l'utilisateur sait exactement quoi corriger.

**Limites.** Cette logique suppose que les familles d'erreur sont fiables. Une panne qui répond par erreur `400` au lieu de `503` ferait abandonner à tort.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi une erreur doit-elle avoir un code stable en plus d'un message ?
2. **Compréhension.** Quelle est la différence entre un `422` et un `503` pour le client ?
3. **Compréhension.** À quoi sert l'identifiant de requête ?
4. **Pourquoi.** Pourquoi une plateforme répond-elle parfois `404` à un utilisateur qui n'a pas le droit de voir une ressource ?
5. **Raisonnement pratique.** Un lot de 100 éléments retourne `200` alors que 12 ont échoué. Quel est le problème ?

#### Réponses

1. Le client programme sa logique sur le code ; le message peut être reformulé, traduit ou corrigé sans casser les clients.
2. Un `422` est une erreur de la demande : il faut la corriger avant de réessayer. Un `503` est une indisponibilité du serveur : on peut réessayer plus tard.
3. À relier la réponse reçue par le client aux journaux du serveur, pour diagnostiquer l'incident.
4. Pour ne pas confirmer l'existence de la ressource : l'appelant ne peut pas distinguer une ressource absente d'une ressource interdite.
5. Le code global masque les échecs partiels : le client peut croire que tout a réussi. Il doit lire le résultat par élément, et le code global doit refléter le caractère partiel.

## 3.9 Transactions et atomicité

### 1. Comprendre simplement

Une **transaction** (*transaction*) regroupe plusieurs opérations en une unité logique qui réussit entièrement ou échoue entièrement. L'**atomicité** (*atomicity*) est cette propriété du « tout ou rien » : il n'existe pas d'état intermédiaire visible où seule une partie des opérations aurait été appliquée.

**Pourquoi cela existe.** Une action métier touche souvent plusieurs données : créer une tâche, l'affecter, enregistrer une trace. Si le système s'arrête après la première étape, les données sont incohérentes : une tâche sans affectation, ou une affectation sans trace.

**Problème résolu.** Garantir que les données restent cohérentes malgré les pannes et les erreurs en cours d'opération.

**Modèle mental.** Un virement bancaire. On débite un compte et on en crédite un autre. Les deux opérations réussissent ensemble, ou aucune n'est appliquée.

**Où l'analogie s'arrête.** Dans un virement, les deux comptes sont dans le même système. Quand les données sont réparties dans plusieurs services, une transaction unique ne peut plus les couvrir (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)).

**Exemple.** La création d'une tâche de maintenance écrit trois choses : la tâche, la première affectation et l'entrée du journal d'audit. Si l'écriture de l'audit échoue, les deux premières sont annulées.

**Les composants.**

1. un **début** (`BEGIN`) ;
2. des **opérations** ;
3. une **fin** réussie (`COMMIT`) ou annulée (`ROLLBACK`) ;
4. des **garanties** d'isolation et de durabilité.

**Objectif d'apprentissage :** vous pouvez expliquer les quatre propriétés ACID et dire ce qu'une transaction ne peut pas couvrir.

### 2. Connaissances essentielles

#### Définition

Une **transaction** est une suite d'opérations exécutée comme une unité indivisible, qui respecte les propriétés **ACID**. L'**atomicité** garantit que les opérations sont toutes appliquées ou toutes annulées.

#### Idées fondamentales

1. **Tout ou rien.** C'est l'atomicité : pas d'état partiel visible.
2. **ACID.** Atomicité, cohérence (*consistency*), isolation, durabilité (*durability*).
3. **L'isolation a des niveaux.** Plus elle est forte, plus elle protège, et plus elle coûte.
4. **Une transaction doit rester courte.** Elle retient des verrous et des ressources.
5. **Une transaction ne couvre qu'un seul système.** Au-delà, il faut d'autres mécanismes.
6. **Les effets extérieurs sont publiés après la validation.** Un courriel ou un événement ne doit partir que si la transaction est validée.

#### Vocabulaire essentiel

- **Validation** (*commit*) : rendre définitifs les changements.
- **Annulation** (*rollback*) : défaire les changements de la transaction.
- **Verrou** (*lock*) : mécanisme qui empêche l'accès simultané à une donnée.
- **Interblocage** (*deadlock*) : deux transactions qui s'attendent mutuellement.
- **Niveau d'isolation** (*isolation level*) : degré de protection contre les effets des transactions concurrentes.
- **Boîte d'envoi transactionnelle** (*transactional outbox*) : technique qui enregistre les événements à publier dans la même transaction que les données.

#### Relations de cause à effet

- Une opération est interrompue à mi-chemin sans transaction. La base contient un état partiel, que personne ne sait réparer simplement.
- La transaction dure trop longtemps. Elle retient des verrous, et les autres utilisateurs attendent.
- Un courriel est envoyé avant la validation. La transaction échoue ensuite, et le courriel annonce un fait qui n'a pas eu lieu.

#### Idées reçues

- **« Une transaction garantit l'absence de conflit entre utilisateurs. »** Pas en totalité. Selon le niveau d'isolation, certaines anomalies subsistent (voir [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste)).
- **« Plus l'isolation est forte, mieux c'est. »** Non. Elle réduit la concurrence et peut causer des échecs de sérialisation à réessayer.
- **« Une transaction peut englober plusieurs services. »** En général non, ou à un coût élevé. On utilise des sagas.

#### Principe clé

Regroupez dans une transaction ce qui doit être cohérent, gardez-la courte, et ne publiez les effets extérieurs qu'après sa validation.

#### Si vous ne retenez que trois choses

1. Une transaction applique un ensemble d'opérations en tout ou rien.
2. ACID décrit ses garanties : atomicité, cohérence, isolation, durabilité.
3. Elle est locale à un système : au-delà, on utilise des sagas et des événements.

### 3. Explication technique détaillée

#### Un exemple en SQL

```sql
BEGIN;

INSERT INTO maintenance_task (tenant_id, id, aircraft_id, description)
VALUES (:tenant, :task, :aircraft, 'Inspection des trains');

INSERT INTO assignment (tenant_id, task_id, technician_id, role, assigned_at)
VALUES (:tenant, :task, :technician, 'lead', now());

INSERT INTO audit_log (tenant_id, id, actor_id, action, resource_id, at)
VALUES (:tenant, :audit, :actor, 'create_task', :task, now());

COMMIT;   -- ou ROLLBACK en cas d'erreur
```

**Comment cela fonctionne.** Si l'une des trois insertions échoue, la base annule les précédentes. Aucune tâche n'existe sans affectation et sans trace.

#### Les propriétés ACID

| Propriété | Garantie | Exemple |
|---|---|---|
| Atomicité | Tout ou rien | La tâche n'existe qu'avec son affectation |
| Cohérence | Les contraintes sont respectées avant et après | Les clés étrangères restent valides |
| Isolation | Les transactions concurrentes ne se perturbent pas | Une lecture ne voit pas une écriture à moitié faite |
| Durabilité | Une transaction validée survit à une panne | Une coupure de courant ne la perd pas |

#### Les niveaux d'isolation (norme SQL)

| Niveau | Lecture sale | Lecture non répétable | Lecture fantôme |
|---|---|---|---|
| `READ UNCOMMITTED` | Possible | Possible | Possible |
| `READ COMMITTED` | Évitée | Possible | Possible |
| `REPEATABLE READ` | Évitée | Évitée | Possible selon la norme |
| `SERIALIZABLE` | Évitée | Évitée | Évitée |

**Lecture du tableau.** Une *lecture sale* voit des données non validées. Une *lecture non répétable* donne deux valeurs différentes pour la même ligne dans la même transaction. Une *lecture fantôme* voit apparaître de nouvelles lignes qui correspondent à un même filtre. Beaucoup de bases, dont PostgreSQL, utilisent `READ COMMITTED` par défaut. Les comportements exacts varient selon les systèmes.

#### La frontière transactionnelle d'un moteur

Une requête correspond en général à **une transaction**, qui englobe :

1. la modification de la ressource ;
2. les effets sur les ressources liées (composition) ;
3. l'entrée du journal d'audit ;
4. l'enregistrement des événements à publier.

#### La boîte d'envoi transactionnelle

```text
Transaction :   modifier la ressource  +  écrire l'événement dans la table « outbox »
                                │
                                ▼  après validation
                Relais : lit la table « outbox » et publie les événements
```

**Pourquoi.** Si l'on publiait l'événement avant la validation, on risquerait un événement pour un changement annulé. Si l'on publiait après, on risquerait de perdre l'événement en cas de panne entre les deux. La boîte d'envoi transforme ce problème en une écriture locale atomique.

#### Interblocages et durée

- Un **interblocage** survient quand deux transactions verrouillent chacune ce que l'autre attend. La base en annule une ; le moteur doit **réessayer**.
- On les réduit en verrouillant toujours dans le même ordre.
- Une transaction ne doit pas attendre un appel réseau externe : elle retiendrait ses verrous pendant toute l'attente.

**Contre-exemple.** Ouvrir une transaction, appeler un service externe de notification, puis valider. Si le service est lent, la transaction reste ouverte des secondes entières et bloque les autres écritures.

**Limites.** Une transaction ne couvre pas un appel à un service tiers, ni deux bases séparées. La coordination de plusieurs systèmes passe par des sagas (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)) et par de l'idempotence (voir [3.11 Idempotence](#311-idempotence)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Les contraintes sont vérifiées à l'intérieur de la transaction |
| [3.10 Concurrence et verrouillage optimiste](#310-concurrence-et-verrouillage-optimiste) | La concurrence est la question de l'isolation entre transactions |
| [3.6 Opérations en masse](#36-opérations-en-masse) | Les lots atomiques reposent sur une transaction |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La boîte d'envoi transactionnelle fiabilise la publication d'événements |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | Les sagas traitent ce que les transactions ne peuvent pas couvrir |
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | La répartition sur plusieurs machines limite les transactions |

### 5. Application pratique

**Situation initiale.** La plateforme crée une tâche, l'affecte et notifie le technicien par courriel.

**Problème.** Un incident survient entre la création de la tâche et l'affectation : la tâche existe sans responsable.

**Application du concept.** La création et l'affectation sont placées dans une même transaction. La notification passe par la boîte d'envoi.

**Déroulé.**

1. Le moteur ouvre une transaction.
2. Il écrit la tâche, l'affectation, l'audit et une ligne « notification à envoyer ».
3. Il valide.
4. Un relais lit la ligne et envoie le courriel, avec reprise si le service de messagerie est indisponible.

**Résultat.** Aucune tâche sans affectation. Le courriel part si et seulement si la création a été validée.

**Limites.** Le courriel peut être envoyé plus d'une fois en cas de reprise : le traitement doit être idempotent (voir [3.11 Idempotence](#311-idempotence)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifient les lettres ACID ?
2. **Compréhension.** Quelle différence y a-t-il entre `COMMIT` et `ROLLBACK` ?
3. **Compréhension.** Qu'est-ce qu'un interblocage ?
4. **Pourquoi.** Pourquoi ne faut-il pas appeler un service externe à l'intérieur d'une transaction ?
5. **Raisonnement pratique.** Comment éviter de publier un événement pour un changement qui a été annulé ?

#### Réponses

1. Atomicité, cohérence, isolation, durabilité.
2. `COMMIT` rend définitifs les changements de la transaction. `ROLLBACK` les annule.
3. Une situation où deux transactions se bloquent mutuellement, chacune attendant un verrou détenu par l'autre. La base en annule une.
4. Parce que la transaction retient ses verrous pendant l'attente, ce qui bloque les autres, et parce que l'effet extérieur ne peut pas être annulé si la transaction échoue ensuite.
5. En écrivant l'événement dans une table dans la même transaction que le changement (boîte d'envoi), puis en le publiant seulement après la validation.

## 3.10 Concurrence et verrouillage optimiste

### 1. Comprendre simplement

La **concurrence** (*concurrency*) désigne le fait que plusieurs acteurs agissent **en même temps** sur les mêmes données. Le **verrouillage optimiste** (*optimistic locking*) est une technique qui suppose que les conflits sont rares : on laisse chacun travailler, et au moment d'enregistrer, on vérifie que la ressource n'a pas changé depuis qu'il l'a lue.

**Pourquoi cela existe.** Sans protection, deux personnes qui modifient la même fiche s'écrasent l'une l'autre sans le savoir. La dernière à enregistrer efface silencieusement le travail de la première : c'est la **mise à jour perdue** (*lost update*).

**Problème résolu.** Empêcher l'écrasement silencieux des modifications, sans bloquer les utilisateurs pendant qu'ils éditent.

**Modèle mental.** Deux personnes corrigent chacune une copie d'un même document papier. La seconde qui rend sa copie efface la première. Avec un verrouillage optimiste, le document porte un numéro de version : si le numéro a changé au moment du dépôt, on doit d'abord relire.

**Où l'analogie s'arrête.** Des humains peuvent fusionner deux corrections à la main. Pour un logiciel, il faut une règle : fusionner par champ, ou refuser et demander une relecture.

**Exemple.** Une planificatrice et un technicien ouvrent la fiche de l'aéronef F-ABCD. Elle change le statut, il ajoute une remarque. Le second à enregistrer reçoit un conflit et relit la fiche mise à jour.

**Les composants.**

1. un **numéro de version** attaché à chaque ressource ;
2. une **écriture conditionnelle** (« si la version est toujours celle que j'ai lue ») ;
3. un **signal de conflit** ;
4. une **stratégie de reprise** côté client.

**Objectif d'apprentissage :** vous pouvez décrire la mise à jour perdue et expliquer, pas à pas, comment une colonne de version l'évite.

### 2. Connaissances essentielles

#### Définition

- **Concurrence** : exécution simultanée d'opérations qui accèdent aux mêmes données.
- **Verrouillage optimiste** : mécanisme de contrôle de concurrence qui ne verrouille pas pendant l'édition, et détecte les conflits à l'écriture à l'aide d'une version ou d'une empreinte.

#### Idées fondamentales

1. **La mise à jour perdue est silencieuse.** Aucune erreur ne se produit : le travail disparaît.
2. **Une version détecte le conflit.** Chaque modification incrémente la version.
3. **L'écriture est conditionnelle.** Elle n'a lieu que si la version n'a pas changé.
4. **Le conflit est rendu au client.** Il relit, fusionne ou abandonne.
5. **Optimiste ou pessimiste selon la contention.** Peu de conflits : optimiste. Beaucoup : verrouiller.
6. **Le contrôle doit couvrir tous les chemins d'écriture.** Une écriture qui l'oublie annule la protection.

#### Vocabulaire essentiel

- **Mise à jour perdue** (*lost update*) : une modification en écrase une autre sans la voir.
- **Version** (*version*) : compteur incrémenté à chaque modification.
- **ETag** : étiquette HTTP qui identifie un état d'une ressource.
- **`If-Match`** : en-tête HTTP qui conditionne une écriture à l'état attendu.
- **Verrouillage pessimiste** (*pessimistic locking*) : réservation de la ressource avant modification.
- **Fusion par champ** (*field-level merge*) : combinaison de modifications portant sur des champs différents.

#### Relations de cause à effet

- Deux utilisateurs lisent la version 7. Le premier écrit : version 8. Le second écrit avec la version 7 : le moteur détecte le décalage et refuse.
- Une modification renvoie la ressource entière. Si l'écriture ne vérifie pas la version, les champs modifiés entre-temps par un autre sont écrasés par d'anciennes valeurs.
- La contention est forte. Beaucoup d'écritures échouent et sont rejouées : le verrouillage optimiste devient inefficace.

#### Idées reçues

- **« Les transactions suffisent à éviter les conflits entre utilisateurs. »** Non. Une transaction protège une opération courte. Entre la lecture à l'écran et l'enregistrement, plusieurs secondes ou minutes peuvent s'écouler, hors de toute transaction.
- **« Le dernier qui écrit a raison. »** C'est une politique, pas une garantie. Elle perd silencieusement du travail.
- **« Un horodatage suffit comme version. »** Pas fiablement. Deux modifications dans la même fraction de seconde, ou des horloges décalées, peuvent le tromper. Un compteur entier est plus sûr.

#### Principe clé

Chaque écriture déclare à partir de quel état elle a été préparée ; le moteur refuse si l'état a changé depuis.

#### Si vous ne retenez que trois choses

1. La mise à jour perdue est l'écrasement silencieux d'une modification par une autre.
2. Le verrouillage optimiste compare une version au moment d'écrire et refuse si elle a changé.
3. Le client doit gérer le conflit : relire, fusionner ou abandonner.

### 3. Explication technique détaillée

#### Le scénario de la mise à jour perdue

| Instant | Planificatrice | Technicien | État en base |
|---|---|---|---|
| t1 | Lit l'aéronef (version 7) | | v7, statut `active` |
| t2 | | Lit l'aéronef (version 7) | v7, statut `active` |
| t3 | Écrit `status = in_inspection` | | v8, statut `in_inspection` |
| t4 | | Écrit une remarque en renvoyant toute la fiche lue à t2 | **Sans contrôle** : statut remis à `active`, modification de t3 perdue |

Avec contrôle de version, l'écriture de t4 est refusée : elle porte la version 7, alors que l'état est en version 8.

#### L'écriture conditionnelle en SQL

```sql
UPDATE aircraft
SET status     = :nouveau_statut,
    version    = version + 1,
    updated_at = now()
WHERE tenant_id = :tenant
  AND id        = :id
  AND version   = :version_lue;      -- la condition optimiste

-- Si 0 ligne est modifiée : conflit ou ressource absente
```

**Comment cela fonctionne.** La condition `version = :version_lue` fait que l'écriture ne réussit que si personne n'a modifié la ligne entre-temps. Le nombre de lignes modifiées indique le résultat.

#### Le protocole HTTP

```http
GET /resources/aircraft/ac_8f3a

HTTP/1.1 200 OK
ETag: "7"
```

```http
PATCH /resources/aircraft/ac_8f3a
If-Match: "7"
Content-Type: application/merge-patch+json

{ "status": "in_inspection" }
```

Si l'état a changé, le serveur répond `412 Precondition Failed`. Si le client a omis l'en-tête alors que le serveur l'exige, il répond `428 Precondition Required`. Certaines API utilisent plutôt `409 Conflict`.

#### Optimiste ou pessimiste

| Critère | Optimiste | Pessimiste |
|---|---|---|
| Principe | Détecter à l'écriture | Verrouiller avant d'éditer |
| Blocage des autres | Aucun | Oui, pendant le verrou |
| Adapté si | Conflits rares, éditions longues | Conflits fréquents, opérations courtes et critiques |
| Risque | Rejeu, frustration en cas de conflit | Verrous oubliés, interblocages |
| Mise en œuvre SQL | Colonne de version | `SELECT … FOR UPDATE` |

**Verrou pessimiste en SQL.**

```sql
BEGIN;
SELECT * FROM aircraft WHERE tenant_id = :t AND id = :id FOR UPDATE;
-- les autres écritures sur cette ligne attendent la fin de la transaction
UPDATE aircraft SET status = :s WHERE tenant_id = :t AND id = :id;
COMMIT;
```

#### La fusion par champ

Quand les deux modifications portent sur des champs différents (statut d'un côté, remarque de l'autre), le moteur peut les fusionner automatiquement :

1. il charge l'état courant (version 8) ;
2. il compare ce que le client a lu (version 7) avec ce qu'il envoie : seul le champ `remarks` a changé ;
3. il applique ce changement sur l'état courant, sans toucher à `status`.

Si les deux modifient le **même champ**, il y a vrai conflit : la décision revient à l'utilisateur.

#### Modes de défaillance

- **Chemin d'écriture sans contrôle** : une opération en masse qui ignore la version.
- **Version non incrémentée** par certaines écritures internes.
- **Boucle de reprise sans fin** : un client rejoue indéfiniment sans relire.
- **Verrou pessimiste oublié** : une session abandonnée bloque une ressource.

**Limites.** Le verrouillage optimiste ne résout pas la collaboration en temps réel (plusieurs personnes qui éditent simultanément le même texte). Cela relève de techniques spécifiques d'édition collaborative.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.9 Transactions et atomicité](#39-transactions-et-atomicité) | Les niveaux d'isolation des transactions traitent la concurrence à courte échelle |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer) | La modification (`PATCH`, `PUT`) est l'opération exposée au conflit |
| [3.8 Validation et gestion des erreurs](#38-validation-et-gestion-des-erreurs) | Un conflit produit une erreur `409` ou `412` à gérer |
| [3.11 Idempotence](#311-idempotence) | L'idempotence complète le contrôle de version pour les reprises |
| [3.4 Fusionner](#34-fusionner) | La fusion de ressources doit gérer les modifications simultanées |
| [12.5 Formulaires et assistants](12-produit-ux.md#125-formulaires-et-assistants) | Les formulaires doivent gérer visuellement les conflits |

### 5. Application pratique

**Situation initiale.** Dix planificateurs travaillent chaque jour sur les mêmes aéronefs. Des modifications disparaissent sans explication.

**Problème.** Des mises à jour perdues se produisent, car les écrans renvoient la fiche entière à chaque enregistrement.

**Application du concept.** Le moteur ajoute une version à chaque ressource et exige `If-Match` à chaque modification.

**Déroulé.**

1. L'écran charge la fiche avec `ETag: "7"`.
2. L'utilisateur modifie la remarque, et enregistre avec `If-Match: "7"`.
3. Entre-temps, la fiche est passée en version 8. Le serveur répond `412`.
4. L'écran recharge la fiche, montre la différence, et propose de réappliquer la remarque.
5. L'utilisateur confirme, et l'enregistrement réussit avec `If-Match: "8"`.

**Résultat.** Plus aucune modification n'est perdue silencieusement.

**Limites.** Les conflits sont désormais visibles, ce qui peut agacer les utilisateurs. La fusion par champ réduit le nombre de conflits à traiter.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une mise à jour perdue ?
2. **Compréhension.** Comment une colonne de version détecte-t-elle un conflit ?
3. **Compréhension.** Quelle est la différence entre un verrouillage optimiste et pessimiste ?
4. **Pourquoi.** Pourquoi une transaction ne suffit-elle pas à éviter la mise à jour perdue dans un écran d'édition ?
5. **Raisonnement pratique.** Deux utilisateurs modifient des champs différents de la même ressource. Comment éviter un conflit inutile ?

#### Réponses

1. C'est l'écrasement silencieux d'une modification par une autre écrite à partir d'un état plus ancien.
2. L'écriture ne réussit que si la version stockée est identique à celle lue par le client. Si elle a changé, aucune ligne n'est modifiée et le conflit est signalé.
3. Le verrouillage optimiste détecte le conflit à l'écriture sans bloquer personne. Le verrouillage pessimiste réserve la ressource avant l'édition.
4. Parce que la lecture à l'écran et l'enregistrement sont séparés de plusieurs secondes ou minutes, en dehors de toute transaction. La version couvre ce laps de temps.
5. Par une fusion par champ : le moteur applique chaque modification sur l'état courant, et ne signale un conflit que si les deux ont touché le même champ.

## 3.11 Idempotence

### 1. Comprendre simplement

Une opération est **idempotente** (*idempotent*) quand l'exécuter une fois ou plusieurs fois produit **le même état final**. La notion est précieuse dès que les demandes peuvent être répétées : après un délai d'attente, un double clic, une relivraison de message.

**Pourquoi cela existe.** Dans un système distribué, un client qui ne reçoit pas de réponse ne sait pas si sa demande a été traitée. Pour être sûr, il la renvoie. Si l'opération n'est pas idempotente, elle risque d'être appliquée deux fois : deux paiements, deux tâches, deux courriels.

**Problème résolu.** Rendre les répétitions sans danger, pour pouvoir réessayer sans crainte.

**Modèle mental.** Le bouton d'appel d'un ascenseur. Appuyer cinq fois produit le même effet qu'appuyer une fois : l'ascenseur vient.

**Où l'analogie s'arrête.** Appuyer est naturellement idempotent. Commander une pizza ne l'est pas : deux appels produisent deux pizzas. Pour de telles opérations, il faut une **clé d'idempotence** qui identifie la demande.

**Exemple.** « Passer le statut de l'aéronef à `in_inspection` » est idempotent : le répéter ne change rien de plus. « Créer une tâche » ne l'est pas : le répéter crée deux tâches.

**Les composants.**

1. une **opération** dont l'effet est défini ;
2. une **clé** qui identifie la demande ;
3. un **stockage** du résultat associé à la clé ;
4. une **règle d'expiration**.

**Objectif d'apprentissage :** vous pouvez distinguer une opération naturellement idempotente d'une opération qui demande une clé, et décrire le mécanisme de la clé.

### 2. Connaissances essentielles

#### Définition

Une opération est **idempotente** si l'appliquer plusieurs fois a le même effet sur l'état du système que l'appliquer une seule fois. L'**idempotence** est la propriété qui rend les répétitions sûres.

#### Idées fondamentales

1. **Les répétitions sont inévitables.** Délais d'attente, reprises automatiques, relivraisons.
2. **« Définir » est idempotent, « incrémenter » ne l'est pas.** `statut = X` oui ; `compteur = compteur + 1` non.
3. **La conception peut rendre une opération idempotente.** Par exemple en utilisant une clé externe pour créer ou mettre à jour.
4. **Une clé d'idempotence identifie la demande.** Le serveur associe la clé à un résultat.
5. **Le résultat est rejoué, non recalculé.** Une deuxième demande avec la même clé reçoit la même réponse.
6. **Exactement une fois s'obtient par répétition plus idempotence.** « Au moins une fois » plus un traitement idempotent donne un effet unique.

#### Vocabulaire essentiel

- **Clé d'idempotence** (*idempotency key*) : valeur unique choisie par le client pour une demande.
- **Rejeu** (*replay*) : renvoi d'une même demande.
- **Livraison au moins une fois** (*at-least-once delivery*) : le message arrive une fois ou plus.
- **Déduplication** (*deduplication*) : détection d'une demande ou d'un message déjà traité.
- **Opération sûre** (*safe*) : opération qui ne modifie pas l'état (lecture).
- **Empreinte de la demande** (*request fingerprint*) : valeur calculée sur le contenu pour vérifier que la même clé n'est pas réutilisée avec un contenu différent.

#### Relations de cause à effet

- Le client réessaie après un délai d'attente. Si l'opération n'est pas idempotente, un doublon est créé.
- La clé est stockée après l'exécution seulement. Deux demandes simultanées avec la même clé passent toutes deux : il faut réserver la clé avant d'exécuter.
- La clé expire trop tôt. Une reprise tardive est traitée comme une nouvelle demande.

#### Idées reçues

- **« `POST` est idempotent. »** Non. `POST` ne l'est pas par défaut. `PUT` et `DELETE` le sont par définition dans la RFC 9110.
- **« Idempotent signifie sans effet de bord. »** Non. Une opération idempotente a des effets, mais pas d'effet supplémentaire à la répétition.
- **« Une clé d'idempotence rend tout sûr. »** Pas les effets extérieurs déjà produits (un courriel déjà envoyé), sauf s'ils sont aussi dédupliqués.

#### Principe clé

Concevez chaque opération pour qu'une répétition ne change rien de plus : par construction si possible, par clé d'idempotence sinon.

#### Si vous ne retenez que trois choses

1. Une opération idempotente répétée donne le même état final.
2. Pour les opérations qui ne le sont pas, une clé d'idempotence évite les doublons.
3. L'idempotence rend les reprises sûres et soutient l'exécution « exactement une fois ».

### 3. Explication technique détaillée

#### L'idempotence des méthodes HTTP

| Méthode | Sûre (lecture seule) | Idempotente |
|---|---|---|
| `GET`, `HEAD`, `OPTIONS` | Oui | Oui |
| `PUT` | Non | Oui |
| `DELETE` | Non | Oui |
| `POST` | Non | Non |
| `PATCH` | Non | Pas garantie |

**Remarque.** Supprimer une ressource déjà supprimée donne le même état final (absente). La réponse peut différer (`204`, puis `404`), mais l'état est le même.

#### Rendre une opération idempotente par construction

| Non idempotent | Idempotent |
|---|---|
| « Ajouter 1 aux heures de vol » | « Fixer les heures de vol à 1 240 » |
| « Basculer l'état actif » | « Passer l'état à actif » |
| « Créer l'aéronef » | « Créer ou mettre à jour l'aéronef de clé externe X » |

#### Le mécanisme de la clé d'idempotence

Le client génère une clé unique par demande et l'envoie dans un en-tête, par exemple `Idempotency-Key`. Cette pratique est courante dans les API de paiement. Le serveur mémorise :

```sql
CREATE TABLE idempotency_record (
  tenant_id     uuid NOT NULL,
  key           text NOT NULL,
  request_hash  text NOT NULL,
  status        text NOT NULL,        -- 'in_progress' ou 'completed'
  response_code integer,
  response_body jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, key)
);
```

**Déroulement côté serveur.**

```text
1. Réserver la clé  : INSERT (tenant, key, hash, 'in_progress')
        │
        ├── la clé existe déjà ?
        │      ├── même empreinte, 'completed'    ─► rejouer la réponse stockée
        │      ├── même empreinte, 'in_progress'  ─► répondre « en cours » (409)
        │      └── empreinte différente           ─► erreur : clé réutilisée avec un autre contenu
        ▼
2. Exécuter l'opération (dans une transaction)
3. Enregistrer la réponse et marquer 'completed'
```

**Pourquoi réserver d'abord.** Sans réservation préalable, deux demandes simultanées avec la même clé s'exécuteraient toutes deux.

#### Idempotence du côté des consommateurs de messages

Une file qui garantit « au moins une fois » peut délivrer un message plusieurs fois. Le consommateur déduplique par identifiant de message :

```sql
INSERT INTO processed_message (consumer, message_id)
VALUES (:consumer, :message_id)
ON CONFLICT DO NOTHING;
-- si 0 ligne insérée : message déjà traité, ignorer
```

Cette insertion se fait dans la même transaction que l'effet du message (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Modes de défaillance

- **Clé trop courte** ou non unique : collisions entre demandes différentes.
- **Clé non liée à l'empreinte** : une clé réutilisée avec un autre contenu rejoue une mauvaise réponse.
- **Durée de conservation trop courte** par rapport aux délais de reprise des clients.
- **Effets extérieurs non dédupliqués** : le courriel est réenvoyé même si la création est rejouée.

**Contre-exemple.** Un client qui génère une nouvelle clé à chaque tentative. Chaque reprise paraît être une nouvelle demande, et la protection est inopérante : la clé doit rester identique pour toutes les tentatives d'une même demande.

**Limites.** La clé d'idempotence protège contre les doublons techniques. Elle ne détecte pas qu'un utilisateur a volontairement créé deux ressources identiques ; c'est une règle d'unicité métier.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | L'incertitude des appels distribués motive l'idempotence |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer) | Les méthodes HTTP de CRUD ont des propriétés d'idempotence différentes |
| [3.6 Opérations en masse](#36-opérations-en-masse) | Une clé d'idempotence sur un lot permet de le rejouer en sécurité |
| [3.7 Import et export](#37-import-et-export) | La clé externe rend l'import idempotent |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les consommateurs de messages doivent être idempotents |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | L'idempotence est un élément du contrat d'une API |

### 5. Application pratique

**Situation initiale.** Une application mobile enregistre des constats d'inspection sur le terrain, avec une connexion instable.

**Problème.** Une demande de création expire. L'application la renvoie, et des constats apparaissent en double.

**Application du concept.** L'application génère une clé par constat et l'envoie à chaque tentative.

**Déroulé.**

1. L'application génère la clé `k-4f21…` et envoie la demande.
2. Le serveur crée le constat, mais la réponse se perd.
3. L'application renvoie la demande avec la même clé.
4. Le serveur reconnaît la clé, retrouve le résultat et renvoie le même constat, sans le créer une seconde fois.

**Résultat.** Aucun doublon, même avec des reprises multiples.

**Limites.** La clé doit survivre à un redémarrage de l'application : elle doit être stockée avec le constat en attente d'envoi.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une opération idempotente ?
2. **Compréhension.** Pourquoi `POST` n'est-il pas idempotent par défaut ?
3. **Compréhension.** Que signifie la clé d'idempotence, et qui la génère ?
4. **Pourquoi.** Pourquoi faut-il réserver la clé avant d'exécuter l'opération ?
5. **Raisonnement pratique.** Comment rendre « ajouter 1 aux heures de vol » idempotent ?

#### Réponses

1. Une opération dont l'application répétée produit le même état final que l'application unique.
2. Parce que `POST` crée ou déclenche un effet à chaque appel : le répéter produit un deuxième effet.
3. Une valeur unique qui identifie une demande ; c'est le client qui la génère, et la réutilise à chaque tentative de cette demande.
4. Sinon deux demandes simultanées avec la même clé pourraient s'exécuter toutes deux avant que l'une n'ait enregistré son résultat.
5. En changeant la nature de l'opération : « fixer les heures de vol à telle valeur », ou « enregistrer un vol d'identifiant X », avec déduplication par identifiant de vol.

## 3.12 Assembler un Resource Engine générique

### 1. Comprendre simplement

Le **Resource Engine** est le composant qui **assemble** tout ce que ce module et le précédent ont présenté : il reçoit une demande sur une ressource de n'importe quel type, lit la définition de ce type, applique la sécurité, la validation, les règles et la transaction, puis publie les événements et l'audit.

**Pourquoi cela existe.** Faire fonctionner ensemble les briques (type, droits, validation, transaction, événements) demande un ordre précis et des conventions communes. Si chaque type de ressource les assemblait à sa façon, le comportement divergerait.

**Problème résolu.** Obtenir un seul chemin d'exécution, identique pour tous les types, où chaque garantie est assurée à un endroit unique.

**Modèle mental.** Une chaîne de montage avec un contrôle qualité à chaque poste. Chaque pièce, quel que soit son modèle, passe par les mêmes postes dans le même ordre.

**Où l'analogie s'arrête.** Une chaîne est linéaire. Le moteur doit aussi gérer des opérations concurrentes, des reprises et des extensions qui s'insèrent à des points choisis.

**Exemple.** Le moteur reçoit `PATCH /resources/aircraft/ac_8f3a`. Pour un type *ordre de fabrication* défini hier par une usine, il appliquerait exactement le même chemin.

**Les composants.**

1. un **registre de types** (les définitions) ;
2. un **contexte de requête** (identité, tenant) ;
3. des **services transversaux** (autorisation, validation, règles) ;
4. un **accès au stockage** ;
5. une **sortie** (événements, audit).

**Objectif d'apprentissage :** vous pouvez décrire l'ordre des étapes du moteur et justifier la place de chacune.

### 2. Connaissances essentielles

#### Définition

Un **Resource Engine** est un composant générique qui exécute les opérations sur des ressources de tout type en interprétant la définition de ce type, et en appliquant de manière uniforme les contrôles et les garanties de la plateforme.

#### Idées fondamentales

1. **Un seul chemin pour tous les types.** Le moteur ne contient pas de logique propre à un métier.
2. **Piloté par la définition.** Le comportement vient du registre de types.
3. **Les préoccupations transversales sont traitées une fois.** Sécurité, isolation, validation, audit, événements.
4. **La transaction englobe l'état et ses effets.** Modification, audit et boîte d'envoi.
5. **Des points d'extension encadrés.** Avant et après certaines étapes, du code personnalisé peut s'insérer.
6. **Des contrats clairs.** Version, clé d'idempotence, format d'erreur.

#### Vocabulaire essentiel

- **Registre de types** (*type registry*) : stockage et accès aux définitions de types.
- **Contexte de requête** (*request context*) : identité, tenant, identifiant de corrélation.
- **Point d'extension** (*hook*) : endroit où du code personnalisé peut s'exécuter (avant, après).
- **Dépôt** (*repository*) : composant qui encapsule l'accès au stockage.
- **Pipeline** : suite ordonnée d'étapes de traitement.
- **Contrat** : ensemble des garanties et conventions que le moteur offre à ses clients.

#### Relations de cause à effet

- Une préoccupation (par exemple l'audit) est codée dans chaque type. Un type l'oublie, et le comportement de la plateforme devient irrégulier.
- Les extensions s'exécutent dans la transaction et sont lentes. Toutes les écritures ralentissent.
- Le moteur connaît des cas métier particuliers. Il devient un monolithe de règles, que personne n'ose modifier.

#### Idées reçues

- **« Un moteur générique remplace tout code métier. »** Non. Il exécute ce qui est exprimable en configuration ; le reste passe par des extensions.
- **« Le moteur n'a pas besoin de connaître la sécurité. »** Si : l'autorisation et l'isolation font partie du chemin de chaque opération.
- **« Plus de points d'extension, c'est mieux. »** Non. Chaque point est un contrat à maintenir et un risque de performance.

#### Principe clé

Le moteur applique à tout type le même chemin, dans le même ordre, avec les mêmes garanties ; seul ce qui est configuré change.

#### Si vous ne retenez que trois choses

1. Le moteur exécute un pipeline unique, piloté par la définition du type.
2. Autorisation, isolation, validation, règles, transaction, événements et audit sont traités une fois.
3. La logique spécifique passe par des extensions encadrées, pas par des cas particuliers dans le moteur.

### 3. Explication technique détaillée

#### Les composants

| Composant | Rôle | Dépend de |
|---|---|---|
| Registre de types | Fournit la définition d'un type pour un tenant | Métadonnées |
| Contexte de requête | Identité, tenant, corrélation | Authentification |
| Autorisation | Décide si l'opération est permise | Identité, politiques |
| Validateur | Vérifie la conformité au schéma | Registre de types |
| Moteur de règles | Applique les règles métier et les états | Registre, états |
| Dépôt | Lit et écrit les données | Stockage |
| Boîte d'envoi | Enregistre les événements | Dépôt |
| Audit | Enregistre qui a fait quoi | Dépôt |

#### Le déroulement d'une modification

```text
Client                Moteur                         Services             Stockage
  │  PATCH + If-Match    │                               │                    │
  │ ───────────────────► │ contexte (identité, tenant)   │                    │
  │                      │ définition du type ─────────► registre             │
  │                      │ autorisation ───────────────► politiques           │
  │                      │ BEGIN ───────────────────────────────────────────► │
  │                      │ charger l'état courant ──────────────────────────► │
  │                      │ vérifier la version                                │
  │                      │ appliquer le patch, valider ─► validateur          │
  │                      │ règles métier, transitions ──► moteur de règles    │
  │                      │ écrire (version + 1) ────────────────────────────► │
  │                      │ audit + événement (boîte d'envoi) ───────────────► │
  │                      │ COMMIT ──────────────────────────────────────────► │
  │ ◄─────────────────── │ 200 + nouvel ETag                                  │
```

#### Le même chemin en pseudo-code

```typescript
async function patchResource(
  ctx: RequestContext,
  typeName: string,
  id: string,
  patch: Patch,
  ifMatch: string,
) {
  const type = await registry.getType(ctx.tenantId, typeName);
  await authz.require(ctx.principal, "update", { type, id });

  return db.transaction(async (tx) => {
    const current = await repo.get(tx, ctx.tenantId, type, id);
    if (current.version !== parseVersion(ifMatch)) throw new PreconditionFailed();

    const next = applyPatch(current, patch, type);
    validator.validate(type, next);                  // schéma et règles par champ
    await rules.evaluate(ctx, type, current, next);  // règles métier, transitions

    const saved = await repo.save(tx, ctx.tenantId, type, next, current.version);
    await outbox.add(tx, event("resource.updated", saved));
    await audit.record(tx, ctx, "update", current, saved);
    return saved;
  });
}
```

**Comment le lire.** Le code ne mentionne aucun métier. `type` provient du registre. Toutes les étapes de garantie sont présentes, dans l'ordre : autorisation, version, validation, règles, écriture, événement, audit.

#### L'intégrité référentielle à l'exécution

Les relations étant définies par les administrateurs, la base de données ne peut pas toujours en vérifier toutes les règles. Le moteur le fait lui-même :

1. à la **création**, il vérifie que chaque référence désigne une ressource existante du même tenant ;
2. à la **suppression ou à l'archivage**, il consulte les relations entrantes et applique la politique déclarée : refuser, propager, détacher ou conserver (voir [3.2 Archiver et restaurer](#32-archiver-et-restaurer)) ;
3. il s'appuie sur les clés étrangères de la base partout où elles existent (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)).

#### Les points d'extension

| Point | Usage typique | Précaution |
|---|---|---|
| Avant validation | Normaliser une valeur | Rapide, sans effet de bord |
| Avant écriture | Règle métier personnalisée | Doit être déterministe |
| Après validation de la transaction | Notifier un système tiers | Asynchrone, idempotent |

#### Modes de défaillance

- **Dérive monolithique** : le moteur accumule des cas particuliers par client.
- **Extensions lentes** dans la transaction : toutes les écritures ralentissent.
- **Définitions non mises en cache** : chaque requête relit le registre.
- **Fuite entre tenants** : un chemin d'accès qui oublie le contexte de tenant.
- **Récursion d'extensions** : une extension déclenche une opération qui la déclenche à nouveau.

**Limites.** Un moteur générique a un coût d'indirection : il est plus lent qu'un code spécialisé pour un type donné. On l'accepte pour la souplesse, et on réserve les optimisations (index, caches, requêtes dédiées) aux types les plus sollicités.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | Le moteur est l'interpréteur de l'architecture pilotée par les métadonnées |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](#31-crud-créer-lire-mettre-à-jour-et-supprimer) à [3.11 Idempotence](#311-idempotence) | Il assemble toutes les opérations et garanties du module |
| [4.14 RBAC](04-identite-iam-autorisation.md#414-rbac) | L'autorisation y est appelée avant toute opération |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les transitions d'état y sont appliquées comme règles |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements sont publiés à la fin de chaque opération |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit est enregistré dans la même transaction |

### 5. Application pratique

**Situation initiale.** Une usine définit hier le type *Ordre de fabrication* avec trois champs et deux rôles.

**Problème.** L'usine veut l'utiliser aujourd'hui, avec les mêmes garanties que les aéronefs : droits, historique, événements, contrôle de version.

**Application du concept.** Aucun développement : le moteur lit la définition et applique le même pipeline.

**Déroulé.**

1. Un opérateur envoie `POST /resources/manufacturing_order`.
2. Le moteur charge la définition du type pour le tenant de l'usine.
3. Il vérifie les droits du rôle de l'opérateur, valide les trois champs, applique les règles.
4. Il écrit la ressource, l'audit et l'événement dans une transaction.
5. Il répond `201` avec l'adresse et la version.

**Résultat.** L'usine dispose d'un type opérationnel, avec toutes les garanties de la plateforme, sans modification du code.

**Limites.** Si l'usine veut un calcul d'ordonnancement spécifique à la création, il faut une extension développée et déployée séparément (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le Resource Engine ne contient-il aucune logique propre à un métier ?
2. **Compréhension.** Citez, dans l'ordre, quatre étapes du traitement d'une modification.
3. **Compréhension.** Pourquoi l'audit et l'événement sont-ils écrits dans la même transaction que la modification ?
4. **Pourquoi.** Pourquoi le moteur applique-t-il lui-même l'intégrité référentielle pour les relations définies par les administrateurs ?
5. **Raisonnement pratique.** Une extension appelée avant l'écriture interroge un service externe lent. Quel est l'effet, et que faire ?

#### Réponses

1. Parce qu'il interprète la définition du type : tout le métier est dans la configuration, ce qui permet de servir n'importe quel domaine avec le même code.
2. Par exemple : contexte et définition du type, autorisation, chargement et contrôle de version, validation puis règles, écriture, audit et événement.
3. Pour que ces traces existent si et seulement si la modification a été validée, sans événement pour un changement annulé ni changement sans trace.
4. Parce que ces relations ne sont pas toutes connues de la base de données au moment de sa conception : le moteur doit vérifier et appliquer les politiques de suppression à partir des métadonnées.
5. L'extension ralentit toutes les écritures et retient la transaction. Il faut la déplacer après la validation, de façon asynchrone et idempotente, ou la limiter par un délai maximal.
