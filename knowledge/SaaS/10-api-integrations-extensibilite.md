# Module 10 — API, intégrations et extensibilité

> **Question directrice.** Comment ouvrir la plateforme à des applications, des partenaires et des développeurs, sans perdre le contrôle de ce qui s'y passe ?

## Présentation du module

**Objectif.** Une plateforme agnostique n'a de valeur que si elle est **ouverte** : d'autres programmes doivent pouvoir la lire et la modifier, d'autres systèmes doivent pouvoir échanger avec elle, et d'autres développeurs doivent pouvoir l'étendre. Ce module traite ces trois ouvertures : les **API**, les **intégrations** et l'**extensibilité**.

**Prérequis.** Les ressources et opérations des modules 2 et 3, l'authentification du module 4, les événements et webhooks du module 7, l'administration du module 8.

**Ordre retenu.** Les trois familles du plan, dans l'ordre : API, intégrations, extensibilité. Le plan répète certains termes à l'intérieur de ce module ; chacun est expliqué une seule fois, à l'endroit le plus utile.

```text
API               REST ─ GraphQL ─ gRPC ─ passerelle ─ authentification
                  limitation de débit ─ pagination et filtrage ─ versionnement (et idempotence)
Intégrations      connecteurs et adaptateurs ─ synchronisation, ETL, import et export
                  systèmes externes et système de référence
Extensibilité     plugins et extensions ─ SDK et plateforme développeur ─ marketplace
                  interface et workflows personnalisés
```

**Renvois vers les entrées principales des termes répétés.**

| Terme du plan | Entrée principale | Angle ajouté dans ce module |
|---|---|---|
| API keys | [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi) | Choix du mécanisme d'authentification d'une API ([10.5 Authentification des API](#105-authentification-des-api)) |
| OAuth | [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20) | Idem |
| Webhooks | [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Connecteurs et synchronisation ([10.9 Connecteurs et adaptateurs](#109-connecteurs-et-adaptateurs), [10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export)) |
| Idempotency | [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Contrat d'API ([10.8 Versionnement d'API](#108-versionnement-dapi)) |
| Import/export | [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | Intégration entre systèmes ([10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export)) |

## Sommaire du module

- [10.1 API et REST](#101-api-et-rest)
- [10.2 GraphQL](#102-graphql)
- [10.3 gRPC](#103-grpc)
- [10.4 API Gateway](#104-api-gateway)
- [10.5 Authentification des API](#105-authentification-des-api)
- [10.6 Limitation de débit](#106-limitation-de-débit)
- [10.7 Pagination et filtrage](#107-pagination-et-filtrage)
- [10.8 Versionnement d'API](#108-versionnement-dapi)
- [10.9 Connecteurs et adaptateurs](#109-connecteurs-et-adaptateurs)
- [10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export)
- [10.11 Systèmes externes et système de référence](#1011-systèmes-externes-et-système-de-référence)
- [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés)
- [10.13 SDK et plateforme développeur](#1013-sdk-et-plateforme-développeur)
- [10.14 Marketplace](#1014-marketplace)
- [10.15 Interface personnalisée et workflows personnalisés](#1015-interface-personnalisée-et-workflows-personnalisés)

## 10.1 API et REST

### 1. Comprendre simplement

Une **API** (*Application Programming Interface*) est le **contrat** par lequel un programme demande une opération à un autre programme : quelles demandes sont possibles, avec quelles données, et quelles réponses reviennent. **REST** (*Representational State Transfer*) est un **style d'architecture** pour les API Web, dans lequel on manipule des **ressources** identifiées par des adresses, avec un petit nombre d'opérations uniformes.

**Pourquoi cela existe.** Une plateforme est utilisée par des applications, des intégrations, des partenaires, pas seulement par des personnes devant un écran. Il leur faut une interface stable, documentée et prévisible. REST s'accorde naturellement avec le modèle de ressources de la plateforme (voir [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) et [3.1 CRUD, créer, lire, mettre à jour et supprimer](03-crud-runtime-ressources.md#31-crud-créer-lire-mettre-à-jour-et-supprimer)).

**Problème résolu.** Permettre à des programmes variés d'utiliser la plateforme de façon simple, uniforme et indépendante des détails internes.

**Modèle mental.** La carte d'un restaurant. Elle liste ce qu'on peut commander et sous quelle forme. On commande sans entrer en cuisine, et la cuisine peut changer ses méthodes sans changer la carte.

**Où l'analogie s'arrête.** Une carte est lue par des humains qui devinent les intentions. Une API est lue par des programmes qui n'interprètent pas : tout doit être explicite.

**Exemple.**

```http
GET /api/v1/aircraft/ac_8f3a HTTP/1.1
Accept: application/json
Authorization: Bearer …
```

**Les composants.**

1. des **ressources** identifiées par des adresses ;
2. des **méthodes HTTP** aux sens normalisés ;
3. des **représentations** (JSON) ;
4. des **codes de statut** ;
5. un **contrat documenté** (spécification).

**Objectif d'apprentissage :** vous pouvez décrire les contraintes de REST, concevoir des adresses de ressources cohérentes et dire pourquoi une API générique doit publier une spécification par tenant.

### 2. Connaissances essentielles

#### Définition

- **API** : interface programmable qui expose des fonctions ou des données d'un système à d'autres programmes, selon un contrat explicite.
- **REST** : style d'architecture défini par Roy Fielding (2000), fondé sur des ressources adressables, une interface uniforme, l'absence d'état de session côté serveur, la possibilité de mise en cache et une architecture en couches.

#### Idées fondamentales

1. **On adresse des ressources, pas des fonctions.** `/aircraft/{id}` plutôt que `/getAircraft`.
2. **L'interface est uniforme.** Les mêmes méthodes (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) pour toutes les ressources.
3. **Le serveur ne garde pas d'état de session.** Chaque requête porte tout ce qu'il faut (voir [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)).
4. **Les représentations sont négociées.** Format, langue, version.
5. **Les statuts HTTP portent le résultat.** Succès, erreur du client, erreur du serveur (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)).
6. **Le contrat est publié.** Une spécification lisible par machine.

#### Vocabulaire essentiel

- **Ressource** (*resource*) : objet adressable (voir [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement)).
- **URI** : adresse d'une ressource.
- **Représentation** (*representation*) : forme sous laquelle l'état d'une ressource est échangé.
- **Sans état** (*stateless*) : le serveur ne conserve pas de contexte entre requêtes.
- **Hypermédia** (*hypermedia*, *HATEOAS*) : réponses qui contiennent les liens vers les actions possibles.
- **OpenAPI** : spécification normalisée pour décrire une API REST.
- **Modèle de maturité de Richardson** : échelle de quatre niveaux de maturité d'une API REST.

#### Relations de cause à effet

- L'API reflète la structure interne (noms de tables, identifiants techniques). Chaque refonte interne casse les clients.
- Les actions sont toutes des `POST` vers des verbes. Les propriétés de `GET`, `PUT` et `DELETE` (sûreté, idempotence, cache) sont perdues (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- La spécification n'est pas à jour. Les développeurs découvrent le comportement par essais, et les erreurs d'intégration se multiplient.

#### Idées reçues

- **« REST, c'est du JSON sur HTTP. »** C'est une façon de s'y prendre, avec des contraintes précises. Beaucoup d'API « REST » n'en respectent que quelques-unes.
- **« REST interdit les actions métier. »** Non. Les actions sont exposées comme sous-ressources ou comme transitions (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).
- **« Une API par type de ressource est incompatible avec une plateforme générique. »** Au contraire : elle peut être générée à partir des métadonnées, avec une spécification propre à chaque tenant.

#### Principe clé

Une bonne API REST modélise des ressources et des transitions avec des conventions uniformes, un contrat publié et des comportements prévisibles.

#### Si vous ne retenez que trois choses

1. REST adresse des ressources avec des méthodes uniformes et des échanges sans état.
2. L'API est un contrat : documenté, versionné, indépendant de la structure interne.
3. Dans une plateforme configurable, la spécification est générée par tenant à partir des métadonnées.

### 3. Explication technique détaillée

#### Les contraintes de REST

| Contrainte | Sens | Effet |
|---|---|---|
| Client–serveur | Séparation des responsabilités | Évolution indépendante |
| Sans état | Pas de contexte conservé côté serveur | Montée en charge horizontale |
| Cachable | Les réponses indiquent si elles peuvent être mises en cache | Performance |
| Interface uniforme | Ressources, méthodes, représentations, hypermédia | Simplicité, outillage |
| Couches | Intermédiaires transparents (passerelle, cache) | Souplesse |
| Code à la demande (facultatif) | Le serveur peut envoyer du code | Rarement utilisé |

#### Les niveaux de maturité de Richardson

| Niveau | Caractéristique | Exemple |
|---|---|---|
| 0 | Un seul point d'accès, tout en `POST` | `POST /api` avec une commande dans le corps |
| 1 | Ressources distinctes | `/aircraft`, `/aircraft/{id}` |
| 2 | Méthodes HTTP et statuts utilisés correctement | `GET`, `PUT`, `DELETE`, `404`, `409` |
| 3 | Hypermédia : les liens guident le client | Réponse avec `links` |

La plupart des API de production visent le niveau 2, parfois avec quelques liens du niveau 3.

#### Une conception d'adresses cohérente

| Besoin | Adresse | Méthode |
|---|---|---|
| Lister les aéronefs | `/aircraft` | `GET` |
| Lire un aéronef | `/aircraft/{id}` | `GET` |
| Créer un aéronef | `/aircraft` | `POST` |
| Modifier partiellement | `/aircraft/{id}` | `PATCH` |
| Supprimer ou archiver | `/aircraft/{id}` | `DELETE` |
| Lister les tâches d'un aéronef | `/aircraft/{id}/tasks` | `GET` |
| Déclencher une transition | `/aircraft/{id}/transitions/ground` | `POST` |
| Opération longue | `/imports` | `POST` puis suivi de la tâche |

**Conventions utiles.** Noms de ressources au pluriel, en minuscules ; relations en sous-ressources ; paramètres de requête pour le filtrage, le tri et la pagination (voir [10.7 Pagination et filtrage](#107-pagination-et-filtrage)) ; identifiants opaques.

#### Une réponse enrichie

```json
{
  "id": "ac_8f3a",
  "type": "aircraft",
  "version": 12,
  "properties": {
    "registration": "F-ABCD",
    "model": "A320",
    "status": "active"
  },
  "links": {
    "self": "/api/v1/aircraft/ac_8f3a",
    "tasks": "/api/v1/aircraft/ac_8f3a/tasks",
    "transitions": {
      "ground": { "href": "/api/v1/aircraft/ac_8f3a/transitions/ground", "method": "POST" }
    }
  }
}
```

**Comment la lire.** Les liens indiquent ce que le client peut faire à partir de cet état : la transition `ground` n'est présente que si elle est permise (garde et droits évalués).

#### La spécification par tenant

Les types et champs d'un tenant étant définis par métadonnées (voir [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)), la plateforme génère pour chaque tenant un document **OpenAPI** à jour, qui décrit ses types, ses champs personnalisés, ses relations et ses transitions. Les outils de génération de clients (voir [10.13 SDK et plateforme développeur](#1013-sdk-et-plateforme-développeur)) et la documentation interactive en dérivent.

```yaml
# Extrait généré pour le tenant « airline-regional »
paths:
  /aircraft/{id}:
    get:
      summary: Lire un aéronef
      responses:
        "200":
          description: L'aéronef
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Aircraft" }
components:
  schemas:
    Aircraft:
      type: object
      required: [registration, model]
      properties:
        registration: { type: string, pattern: "^F-[A-Z]{4}$" }
        model:        { type: string }
        noise_level:  { type: integer, description: "Champ personnalisé du tenant" }
```

#### Les modes de défaillance

- **API bavarde** : une page demande vingt appels successifs.
- **Incohérences** : pluriels, casse, formats de date différents d'un endroit à l'autre.
- **Fuite d'implémentation** : identifiants et noms internes visibles.
- **Changement cassant silencieux** : un champ change de type sans nouvelle version.
- **Actions déguisées** : des mises à jour de champ qui déclenchent des effets cachés.

**Contre-exemple.** `POST /api/doAction?name=updateAircraftStatus&id=…` pour tout. Aucune des propriétés de HTTP (cache, idempotence) n'est exploitable, les outils génériques ne comprennent rien, et la documentation devient la seule source de vérité.

**Limites.** REST convient bien aux opérations sur des ressources. Pour des requêtes très variées sur des données liées, ou pour des échanges internes à haut débit, GraphQL ou gRPC peuvent être plus adaptés (voir [10.2 GraphQL](#102-graphql) et [10.3 gRPC](#103-grpc)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) | Une API REST expose les ressources de la plateforme |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](03-crud-runtime-ressources.md#31-crud-créer-lire-mettre-à-jour-et-supprimer) | Les opérations CRUD correspondent aux méthodes HTTP |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Les statuts et formats d'erreur font partie du contrat |
| [10.4 API Gateway](#104-api-gateway) | La passerelle protège et route l'API |
| [10.8 Versionnement d'API](#108-versionnement-dapi) | Le contrat est versionné |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | La spécification est générée par les métadonnées |

### 5. Application pratique

**Situation initiale.** Un partenaire de maintenance veut intégrer ses outils avec la plateforme de la compagnie. Il demande la liste des aéronefs, ses champs personnalisés et les transitions possibles.

**Problème.** L'API actuelle est écrite à la main et ne décrit pas les champs personnalisés du tenant.

**Application du concept.** L'API est générée à partir des métadonnées, avec une spécification OpenAPI par tenant.

**Déroulé.**

1. Le moteur de ressources expose les endpoints génériques pour chaque type défini.
2. La plateforme génère le document OpenAPI du tenant, incluant les champs personnalisés.
3. Le partenaire télécharge la spécification et génère son client.
4. Il lit les aéronefs, et découvre par les liens les transitions permises.

**Résultat.** L'intégration est construite en quelques jours, sur une description fidèle au modèle du client.

**Limites.** Quand l'administrateur modifie le modèle, la spécification change : le partenaire doit être prévenu, d'où le versionnement et la politique de dépréciation (voir [10.8 Versionnement d'API](#108-versionnement-dapi)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois contraintes de REST.
2. **Compréhension.** Que signifie « sans état » ?
3. **Compréhension.** Pourquoi les adresses doivent-elles désigner des ressources plutôt que des actions ?
4. **Pourquoi.** Pourquoi la spécification d'une API générique est-elle générée par tenant ?
5. **Raisonnement pratique.** Comment exposer l'action « immobiliser un aéronef » dans une API REST ?

#### Réponses

1. Par exemple : client–serveur, sans état, interface uniforme, cachable, couches.
2. Que le serveur ne conserve pas de contexte de session entre deux requêtes : chacune contient toute l'information nécessaire.
3. Pour tirer parti des propriétés des méthodes HTTP (sûreté, idempotence, cache), et pour garder une interface uniforme que les outils comprennent.
4. Parce que les types, champs et relations diffèrent d'un tenant à l'autre : un contrat unique ne décrirait pas fidèlement chacun.
5. Comme une transition, par exemple `POST /aircraft/{id}/transitions/ground`, avec ses gardes et ses droits.

## 10.2 GraphQL

### 1. Comprendre simplement

**GraphQL** est un langage de requête pour les API, et un environnement d'exécution associé, dans lequel **le client décrit précisément les données qu'il veut** et les reçoit en une seule requête. Le serveur expose un **schéma typé** qui décrit les types, les champs et les relations disponibles.

**Pourquoi cela existe.** Avec une API de ressources, un écran qui a besoin d'un aéronef, de sa base et de ses tâches ouvertes exige parfois plusieurs appels, et chaque appel renvoie plus de champs que nécessaire. GraphQL a été conçu chez Facebook (usage interne dès 2012, publication en 2015) pour répondre aux besoins d'applications mobiles aux écrans variés.

**Problème résolu.** Éviter les appels multiples et les réponses trop volumineuses, en laissant le client demander exactement ce dont il a besoin.

**Modèle mental.** Commander à la carte plutôt que prendre le menu fixe : on demande précisément les plats qu'on veut, dans une seule commande.

**Où l'analogie s'arrête.** Une cuisine répond à n'importe quelle commande. Un serveur GraphQL doit se protéger contre les requêtes trop coûteuses (profondeur, volume).

**Exemple.**

```graphql
query {
  aircraft(id: "ac_8f3a") {
    registration
    status
    base { name }
    tasks(status: OPEN, first: 5) { id description dueDate }
  }
}
```

**Les composants.**

1. un **schéma** typé ;
2. des **requêtes** (lecture), des **mutations** (écriture), des **abonnements** (flux) ;
3. des **résolveurs** qui obtiennent les données ;
4. des **garde-fous** (limites de coût, droits).

**Objectif d'apprentissage :** vous pouvez décrire ce que GraphQL apporte, ses risques et les situations où REST reste préférable.

### 2. Connaissances essentielles

#### Définition

**GraphQL** est une spécification (maintenue aujourd'hui par la GraphQL Foundation) d'un langage de requête et d'un système de types pour les API, où le client précise la forme de la réponse et le serveur la construit à partir de résolveurs.

#### Idées fondamentales

1. **Le client décide de la forme.** Il choisit les champs et les relations à suivre.
2. **Un seul point d'accès.** Toutes les opérations passent par la même adresse.
3. **Le schéma est fortement typé et auto-descriptif.** On peut l'interroger (introspection).
4. **Le serveur doit se protéger.** Limites de profondeur, de coût, de volume.
5. **Les droits s'appliquent champ par champ.** Chaque résolveur contrôle l'accès.
6. **L'évolution se fait par ajout et dépréciation de champs.** Pas de numéros de version.

#### Vocabulaire essentiel

- **Schéma** (*schema*) : description des types et des opérations.
- **Requête** (*query*), **mutation** (*mutation*), **abonnement** (*subscription*) : lecture, écriture, flux.
- **Résolveur** (*resolver*) : fonction qui produit la valeur d'un champ.
- **Introspection** (*introspection*) : interrogation du schéma lui-même.
- **Problème N+1** (*N+1 problem*) : une requête par élément d'une liste.
- **Requête persistée** (*persisted query*) : requête enregistrée à l'avance et appelée par identifiant.
- **Coût de requête** (*query cost*) : estimation des ressources consommées.

#### Relations de cause à effet

- Les clients peuvent imbriquer sans limite. Une requête malveillante ou maladroite, très profonde, épuise le serveur.
- Chaque résolveur lit la base pour chaque élément. Une liste de 100 aéronefs avec leur base produit 101 requêtes (problème N+1).
- Toutes les requêtes passent par `POST` sur une seule adresse. Les mécanismes de cache HTTP habituels ne s'appliquent plus.

#### Idées reçues

- **« GraphQL remplace REST. »** Non. Ils répondent à des besoins différents, et coexistent souvent.
- **« GraphQL est plus performant. »** Pas automatiquement : il réduit le nombre d'appels et la taille des réponses, mais peut aggraver la charge du serveur sans garde-fous.
- **« Le schéma garantit la sécurité. »** Non. L'autorisation doit être implémentée à chaque champ.

#### Principe clé

GraphQL donne la maîtrise de la forme des données au client ; la contrepartie est que le serveur doit maîtriser le coût et l'accès de chaque requête.

#### Si vous ne retenez que trois choses

1. Le client décrit les données voulues ; la réponse a exactement cette forme.
2. Le serveur doit limiter la profondeur et le coût, et traiter le problème N+1.
3. Les droits sont appliqués par champ ; le schéma d'un tenant peut être généré depuis ses métadonnées.

### 3. Explication technique détaillée

#### Un schéma

```graphql
type Aircraft {
  id: ID!
  registration: String!
  model: String!
  status: AircraftStatus!
  base: Location
  tasks(status: TaskStatus, first: Int = 20, after: String): TaskConnection!
  noiseLevel: Int            # champ personnalisé du tenant
}

enum AircraftStatus { ACTIVE IN_INSPECTION RETIRED }

type Query {
  aircraft(id: ID!): Aircraft
  aircraftList(filter: AircraftFilter, first: Int = 20, after: String): AircraftConnection!
}

type Mutation {
  groundAircraft(id: ID!, reason: String!): Aircraft!
}
```

#### Le problème N+1 et la parade

```text
Requête : liste de 100 aéronefs, avec leur base

Naïf : 1 requête pour les aéronefs
       + 100 requêtes (une base par aéronef)             = 101 lectures

Avec regroupement (batching) : 1 requête pour les aéronefs
       + 1 requête « bases WHERE id IN (...) »             = 2 lectures
```

Le motif courant de « chargeur de données » (*DataLoader*) regroupe les lectures demandées dans la même passe d'exécution.

#### Le contrôle du coût

On attribue un coût à chaque champ, on calcule le coût de la requête avant l'exécution, et on la refuse au-delà d'un plafond.

$$\text{coût}(\text{requête}) = \sum_{\text{champs}} \text{coût unitaire} \times \text{nombre estimé d'éléments}$$

| Garde-fou | Effet |
|---|---|
| Profondeur maximale | Interdit les imbrications abusives |
| Plafond de coût | Refuse les requêtes trop lourdes |
| Taille de page maximale | Limite le volume |
| Requêtes persistées | N'accepte que des requêtes prévues (API publiques sensibles) |
| Délai d'exécution | Interrompt les traitements trop longs |

#### Les erreurs

Une réponse GraphQL contient souvent un code `200` avec un champ `errors` : certaines parties de la réponse peuvent réussir, et d'autres échouer. Le client doit lire `errors` et `data` ensemble.

#### Le schéma par tenant

Comme pour l'API REST, le schéma GraphQL d'un tenant est **généré** à partir de ses métadonnées : types, champs personnalisés, relations, enums issus de ses définitions. La plateforme le met à jour quand le modèle change (voir [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)).

#### REST ou GraphQL

| Critère | REST | GraphQL |
|---|---|---|
| Forme de la réponse | Fixée par le serveur | Choisie par le client |
| Nombre d'appels pour un écran | Plusieurs | Un |
| Cache HTTP | Natif | Plus complexe |
| Courbe d'apprentissage | Faible | Plus élevée |
| Contrôle de la charge | Par endpoint | Par coût de requête |
| Adapté à | Intégrations simples, API publiques | Interfaces riches, clients variés |

**Contre-exemple.** Exposer un schéma GraphQL public sans limite de profondeur ni de coût. Un client envoie une requête imbriquée sur dix niveaux qui déclenche des millions de lectures, et le service est indisponible pour tous.

**Limites.** GraphQL suppose une discipline côté serveur (résolveurs, regroupement, droits). Pour une API publique simple d'intégration, REST reste souvent plus lisible pour les partenaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](#101-api-et-rest) | Il est une alternative ou un complément à REST |
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | C'est un modèle de requête centré sur le client |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits de champ s'appliquent aux résolveurs |
| [10.6 Limitation de débit](#106-limitation-de-débit) | La limitation de débit s'exprime en coût de requête |
| [10.4 API Gateway](#104-api-gateway) | La passerelle applique les garde-fous globaux |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | Le schéma est généré à partir des métadonnées |

### 5. Application pratique

**Situation initiale.** L'application mobile des techniciens affiche pour chaque aéronef sa base, ses tâches ouvertes et ses dernières inspections. Elle fait cinq appels REST par écran, sur un réseau instable.

**Problème.** Latence cumulée et consommation de données élevées.

**Application du concept.** Un point d'accès GraphQL réservé à l'application mobile, avec requêtes persistées.

**Déroulé.**

1. L'équipe définit les trois requêtes des écrans de l'application, enregistrées côté serveur.
2. L'application appelle chaque requête par son identifiant, avec des variables.
3. Le serveur exécute la requête avec regroupement des lectures et contrôle des droits champ par champ.
4. Un écran se charge en un appel de 6 Ko au lieu de cinq appels de 40 Ko.

**Résultat.** Temps de chargement divisé par trois sur réseau mobile, avec un coût maîtrisé.

**Limites.** Chaque évolution d'écran demande une nouvelle requête persistée, avec déploiement coordonné de l'application et du serveur.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qui décide de la forme de la réponse dans GraphQL ?
2. **Compréhension.** Qu'est-ce que le problème N+1 ?
3. **Compréhension.** Citez deux garde-fous contre les requêtes trop coûteuses.
4. **Pourquoi.** Pourquoi la mise en cache HTTP est-elle plus difficile avec GraphQL ?
5. **Raisonnement pratique.** Une API publique d'intégration simple (créer, lire, modifier des aéronefs) doit-elle être en GraphQL ?

#### Réponses

1. Le client, qui décrit les champs et les relations qu'il veut.
2. Une requête de liste qui déclenche une lecture supplémentaire par élément : un total de N+1 lectures.
3. Par exemple : profondeur maximale, plafond de coût, taille de page maximale, requêtes persistées.
4. Parce que les requêtes passent généralement par une seule adresse en `POST`, avec des corps variables : les clés de cache habituelles ne s'y appliquent pas.
5. Pas nécessairement : REST est plus simple et lisible pour des intégrations simples. GraphQL se justifie par la diversité des écrans et des clients.

## 10.3 gRPC

### 1. Comprendre simplement

**gRPC** est un cadre d'appel de procédures distantes (*Remote Procedure Call*) à haute performance, créé par Google et ouvert en 2015. Il utilise le protocole **HTTP/2** et le format binaire **Protocol Buffers** : on décrit le contrat dans un fichier, et on **génère** le code client et serveur dans de nombreux langages.

**Pourquoi cela existe.** Les échanges entre services internes sont très nombreux et très fréquents. Un format textuel (JSON) et un protocole générique coûtent du temps et de la bande passante. gRPC offre un contrat strict, des échanges compacts et des flux continus.

**Problème résolu.** Faire communiquer des services entre eux de façon rapide, typée et fiable, avec un contrat unique à partir duquel on génère le code.

**Modèle mental.** Une ligne directe interne entre services, avec un formulaire normalisé, plutôt qu'un courrier postal libre.

**Où l'analogie s'arrête.** Une ligne interne fonctionne dans le bâtiment. gRPC s'utilise surtout à l'intérieur de la plateforme ; pour des partenaires et des navigateurs, il est moins adapté.

**Exemple.** Le moteur de workflow appelle le moteur de ressources en gRPC pour déclencher une transition, avec un délai maximal et un identifiant de corrélation.

**Les composants.**

1. un **contrat** (`.proto`) ;
2. un **code généré** (clients et serveurs) ;
3. un **transport** HTTP/2 ;
4. des **types d'appels** (unaire, flux) ;
5. des **échéances** et des **statuts** standardisés.

**Objectif d'apprentissage :** vous pouvez décrire gRPC, ses quatre formes d'appel, et dire quand le préférer à REST.

### 2. Connaissances essentielles

#### Définition

**gRPC** est un cadre d'appel de procédures distantes qui définit les services et les messages dans un langage de description (Protocol Buffers), les transporte sur HTTP/2 avec une sérialisation binaire, et génère le code d'accès pour de nombreux langages.

#### Idées fondamentales

1. **Contrat d'abord.** Le fichier `.proto` est la source de vérité.
2. **Code généré.** Les clients et serveurs typés sont produits automatiquement.
3. **Format binaire compact.** Plus petit et plus rapide que du JSON.
4. **Flux natifs.** Le serveur, le client ou les deux peuvent envoyer des suites de messages.
5. **Échéances et annulation.** Chaque appel porte un délai, propagé aux appels suivants.
6. **Compatibilité par règles strictes.** Les numéros de champs ne se réutilisent jamais.

#### Vocabulaire essentiel

- **Protocol Buffers** (*protobuf*) : langage de description et format de sérialisation binaire.
- **Service** (*service*) : ensemble de méthodes appelables à distance.
- **Appel unaire** (*unary*) : une requête, une réponse.
- **Flux** (*streaming*) : suite de messages dans un ou deux sens.
- **Échéance** (*deadline*) : instant limite pour terminer un appel.
- **Intercepteur** (*interceptor*) : composant qui s'insère dans les appels (authentification, journalisation).
- **gRPC-Web** : variante pour les navigateurs, via un relais.

#### Relations de cause à effet

- Un numéro de champ est réutilisé pour un autre sens. Les anciens clients interprètent mal les nouveaux messages, sans erreur visible.
- Aucune échéance n'est fixée. Un appel bloqué retient des ressources, et la lenteur se propage en cascade.
- Le navigateur est un client direct. Il ne peut pas parler gRPC nativement : il faut un relais, ou une autre API pour le Web.

#### Idées reçues

- **« gRPC est toujours plus rapide que REST. »** Pour des échanges fréquents entre services, souvent oui ; pour un appel occasionnel, la différence est négligeable.
- **« gRPC convient à tout. »** Non. Pour des API publiques et des partenaires, REST est plus accessible, avec des outils simples et lisibles.
- **« Binaire signifie illisible, donc non débogable. »** Il faut des outils adaptés, mais le contrat typé réduit les erreurs.

#### Principe clé

Utilisez gRPC pour les échanges internes fréquents et typés ; gardez REST ou GraphQL pour les interfaces exposées à l'extérieur.

#### Si vous ne retenez que trois choses

1. gRPC décrit un contrat en `.proto`, génère le code et échange en binaire sur HTTP/2.
2. Il offre des flux et des échéances, adaptés aux appels internes.
3. Il est moins adapté aux navigateurs et aux API publiques.

### 3. Explication technique détaillée

#### Un contrat

```protobuf
syntax = "proto3";

package platform.resources.v1;

service ResourceService {
  rpc Get(GetRequest) returns (Resource);
  rpc Transition(TransitionRequest) returns (Resource);
  rpc Watch(WatchRequest) returns (stream ResourceEvent);   // flux serveur
}

message GetRequest {
  string tenant_id = 1;
  string type      = 2;
  string id        = 3;
}

message TransitionRequest {
  string tenant_id   = 1;
  string type        = 2;
  string id          = 3;
  string transition  = 4;
  string reason      = 5;
  string request_id  = 6;     // clé d'idempotence
}
```

#### Les quatre formes d'appel

| Forme | Description | Exemple |
|---|---|---|
| Unaire | Une requête, une réponse | Lire une ressource |
| Flux serveur | Une requête, une suite de réponses | Suivre les événements d'une ressource |
| Flux client | Une suite de requêtes, une réponse | Envoyer un lot de mesures |
| Bidirectionnel | Deux suites indépendantes | Synchronisation continue |

#### Les échéances

Chaque appel porte une échéance, transmise à tous les appels en cascade. Si le client abandonne à 2 s, les services appelés cessent leur travail à 2 s.

```text
Client (échéance 2 s)
   └─► Service A (reste 1,9 s)
          └─► Service B (reste 1,6 s)  → si dépassé : annulation en cascade
```

#### Les règles de compatibilité

| Changement | Compatible ? |
|---|---|
| Ajouter un champ avec un nouveau numéro | Oui |
| Ajouter une méthode à un service | Oui |
| Supprimer un champ | Oui, si on réserve son numéro et son nom |
| Renommer un champ (numéro conservé) | Oui sur le fil, pas pour le code généré |
| Réutiliser un numéro de champ | **Non** |
| Changer le type d'un champ | Généralement **non** |

#### Comparaison avec REST

| Critère | REST (JSON) | gRPC |
|---|---|---|
| Format | Texte | Binaire |
| Contrat | Optionnel (OpenAPI) | Obligatoire |
| Code client | Écrit ou généré | Généré |
| Flux | Limités (événements serveur) | Natifs |
| Navigateur | Natif | Relais nécessaire |
| Lisibilité | Élevée | Nécessite des outils |
| Usage typique | API externes | Services internes |

**Contre-exemple.** Exposer directement en gRPC une API destinée à des centaines de partenaires, dont des intégrateurs sans outillage protobuf. Chacun doit installer des générateurs, et le support explose. Une API REST en façade, adossée en interne à gRPC, est plus appropriée.

**Limites.** L'équilibrage de charge de HTTP/2 (connexions longues et multiplexées) demande des composants adaptés, et le débogage exige des outils spécifiques.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](#101-api-et-rest) | REST en est le complément pour l'extérieur |
| [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) | Les microservices l'utilisent pour leurs échanges internes |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Les échéances sont une application des délais d'expiration |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Un identifiant de requête rend les appels idempotents |
| [7.4 Architecture orientée événements](07-evenements-automatisation.md#74-architecture-orientée-événements) | Les flux gRPC peuvent servir de transport d'événements |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Les traces distribuées suivent les appels gRPC |

### 5. Application pratique

**Situation initiale.** Le moteur de workflow appelle le moteur de ressources plusieurs milliers de fois par minute en REST/JSON. La latence cumulée ralentit les processus.

**Problème.** Chaque appel coûte un établissement de connexion et une sérialisation textuelle volumineuse.

**Application du concept.** Les appels internes passent en gRPC avec connexions persistantes.

**Déroulé.**

1. L'équipe définit le contrat `.proto` des opérations utilisées.
2. Les deux moteurs génèrent leur code client et serveur.
3. Chaque appel porte une échéance de 500 ms et un identifiant de requête.
4. La latence médiane passe de 18 ms à 6 ms, et le volume réseau est divisé par quatre.

**Résultat.** Les workflows s'exécutent plus vite, et le contrat est vérifié à la compilation.

**Limites.** L'API publique reste en REST : un adaptateur traduit les appels externes en appels gRPC internes.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Sur quels éléments technologiques repose gRPC ?
2. **Compréhension.** Citez les quatre formes d'appel.
3. **Compréhension.** À quoi sert une échéance ?
4. **Pourquoi.** Pourquoi ne réutilise-t-on jamais un numéro de champ protobuf ?
5. **Raisonnement pratique.** Une API est destinée à des partenaires variés. Quel style choisir à l'extérieur ?

#### Réponses

1. Le protocole HTTP/2 et le format de sérialisation Protocol Buffers.
2. Unaire, flux serveur, flux client, bidirectionnel.
3. À borner la durée d'un appel et à propager cette limite aux appels en cascade, pour éviter qu'un appel bloqué ne retienne des ressources.
4. Parce que les anciens clients interpréteraient le nouveau champ avec l'ancien sens, sans erreur visible, et corrompraient les données.
5. En général REST (éventuellement avec une spécification OpenAPI), plus accessible que gRPC pour des partenaires variés.

## 10.4 API Gateway

### 1. Comprendre simplement

Une **passerelle d'API** (*API gateway*) est le **point d'entrée unique** par lequel passent les requêtes destinées aux API de la plateforme. Elle applique les contrôles communs (authentification, limitation de débit, validation, journalisation) puis oriente chaque requête vers le service qui doit la traiter.

**Pourquoi cela existe.** Sans passerelle, chaque service doit réimplémenter les mêmes contrôles : authentification, quotas, journalisation, TLS. Les erreurs et les divergences s'accumulent, et il est difficile d'imposer une politique commune ou de superviser l'ensemble.

**Problème résolu.** Centraliser les préoccupations transversales d'exposition, de sécurité et de gouvernance des API.

**Modèle mental.** La réception d'un immeuble de bureaux : contrôle du badge, enregistrement du visiteur, orientation vers le bon étage. Les occupants n'ont pas à refaire ces contrôles à leur porte.

**Où l'analogie s'arrête.** La réception ne participe pas au travail des occupants. Une passerelle qui contient de la logique métier devient un goulot d'étranglement et un point de défaillance.

**Exemple.** Une requête arrive avec un jeton. La passerelle le valide, résout le tenant, vérifie le quota, ajoute les en-têtes de corrélation, puis oriente la requête vers le moteur de ressources.

**Les composants.**

1. un **routage** ;
2. une **chaîne de politiques** (authentification, quotas, validation) ;
3. un **contexte** vérifié transmis aux services ;
4. une **supervision** ;
5. un **portail** d'accès pour les développeurs (facultatif).

**Objectif d'apprentissage :** vous pouvez lister les responsabilités d'une passerelle, ce qu'elle ne doit pas faire, et son rôle dans le contexte de tenant.

### 2. Connaissances essentielles

#### Définition

Une **passerelle d'API** est un composant d'infrastructure placé devant les services, qui reçoit toutes les requêtes externes, applique des politiques transversales et les achemine vers les services de destination.

#### Idées fondamentales

1. **Un seul point d'entrée.** Une adresse, une politique, une supervision.
2. **Les politiques transversales y sont appliquées.** Authentification, quotas, validation, journalisation.
3. **Elle résout et propage le contexte.** Identité, tenant, corrélation, vérifiés.
4. **Elle ne contient pas de logique métier.** Elle oriente et protège.
5. **Elle est hautement disponible.** Sa panne est une panne de tout.
6. **Elle n'est pas la seule barrière.** Les services vérifient aussi les droits qui les concernent.

#### Vocabulaire essentiel

- **Routage** (*routing*) : choix du service de destination.
- **Chaîne de politiques** (*policy chain*) : suite de contrôles appliqués dans l'ordre.
- **Terminaison TLS** (*TLS termination*) : déchiffrement du trafic à la passerelle.
- **Transformation** (*transformation*) : adaptation de la requête ou de la réponse.
- **Portail développeur** (*developer portal*) : site de documentation, d'inscription et de gestion des clés.
- **Passerelle par client** (*backend for frontend*) : passerelle spécialisée par type de client.
- **Maillage de services** (*service mesh*) : infrastructure des échanges internes (est–ouest).

#### Relations de cause à effet

- Les politiques sont dans chaque service. Elles divergent, et un service oublie un contrôle.
- La passerelle accumule de la logique métier. Elle devient un monolithe en façade, difficile à faire évoluer et à tester.
- Les services supposent que la passerelle a tout contrôlé. Un accès direct (réseau interne mal protégé) contourne toutes les protections.

#### Idées reçues

- **« La passerelle suffit pour sécuriser l'API. »** Non. Elle fait les contrôles généraux ; chaque service doit contrôler les droits sur ses ressources.
- **« Une passerelle ralentit toujours. »** Elle ajoute un saut réseau, mais elle peut aussi mettre en cache, compresser et réduire la charge des services.
- **« Une passerelle est un produit à installer. »** C'est une fonction : elle peut être un produit, un service géré ou un composant développé.

#### Principe clé

La passerelle applique ce qui est commun à toutes les API ; la logique métier et les droits sur les ressources restent dans les services.

#### Si vous ne retenez que trois choses

1. La passerelle est l'entrée unique, qui applique les politiques transversales.
2. Elle établit un contexte vérifié, dont le tenant, et le transmet aux services.
3. Elle ne remplace pas les contrôles des services et ne contient pas de logique métier.

### 3. Explication technique détaillée

#### Le chemin d'une requête

```text
Client
  │ HTTPS
  ▼
┌──────────────────────── Passerelle d'API ────────────────────────┐
│ 1. Terminaison TLS, protection de base (taille, protocole)        │
│ 2. Résolution du tenant (sous-domaine, jeton, clé)                │
│ 3. Authentification (validation du jeton ou de la clé)            │
│ 4. Autorisation grossière (périmètre du jeton, route autorisée)   │
│ 5. Limitation de débit et quotas (par tenant, par clé)            │
│ 6. Validation de la requête (schéma, taille, types)               │
│ 7. Ajout du contexte vérifié et de l'identifiant de corrélation   │
│ 8. Routage vers le service, avec délai et reprises maîtrisés      │
└──────────────────────────────┬────────────────────────────────────┘
                               ▼
                  Services (autorisation fine, métier)
```

#### Les responsabilités

| Responsabilité | Détail | Où se termine le contrôle |
|---|---|---|
| Authentification | Valider jeton, clé, certificat | À la passerelle ; identité transmise |
| Autorisation | Périmètre du jeton, routes permises | Droits fins dans les services |
| Limitation de débit | Par tenant, par clé, par route (voir [10.6 Limitation de débit](#106-limitation-de-débit)) | À la passerelle |
| Validation | Schéma de la requête, taille | À la passerelle et dans le service |
| Journalisation | Requête, tenant, durée, statut | À la passerelle |
| Cache | Réponses publiques ou idempotentes | À la passerelle |
| Versionnement | Routage selon la version demandée (voir [10.8 Versionnement d'API](#108-versionnement-dapi)) | À la passerelle |
| Transformation | Adaptation de formats, compatibilité | Avec précaution |

#### Le contexte transmis

La passerelle ne fait pas confiance aux en-têtes du client. Elle les retire et ajoute ceux qu'elle a **vérifiés**, signés pour que les services puissent les contrôler.

```http
X-Platform-Tenant: ten_airline_01
X-Platform-Principal: u_42
X-Platform-Scopes: aircraft.read aircraft.write
X-Request-Id: req_91ab33
X-Platform-Context-Signature: v1=…
```

#### Les politiques par offre

Les quotas et fonctions accessibles dépendent de l'offre du tenant (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)). La passerelle consulte les droits d'usage (avec un cache), et applique des limites différentes par offre : par exemple 100 requêtes par seconde pour « Essentiel » et 1 000 pour « Entreprise ».

#### Les modèles de déploiement

| Modèle | Principe | Usage |
|---|---|---|
| Passerelle unique | Une pour toutes les API | Simplicité |
| Par domaine | Une par ensemble de services | Isolation, équipes autonomes |
| Par client (*BFF*) | Une par type de client (mobile, web, partenaires) | Besoins spécifiques |
| Nord–sud et est–ouest | Passerelle pour l'extérieur, maillage pour l'intérieur | Grandes architectures |

#### Les modes de défaillance

- **Point de défaillance unique** : sans redondance, sa panne coupe tout.
- **Logique métier dans la passerelle** : transformation de données, règles, orchestration.
- **Dérive de configuration** : des routes ou des politiques différentes entre environnements.
- **Contournement** : un service accessible directement sans passer par la passerelle.
- **Latence ajoutée** : trop de politiques synchrones lourdes (appels externes) dans la chaîne.

**Contre-exemple.** Une passerelle qui, en plus du routage, agrège les données de cinq services, applique des règles de gestion et transforme les formats. Chaque évolution métier exige de modifier la passerelle, qui devient le composant le plus fragile.

**Limites.** La passerelle centralise les contrôles, mais aussi le risque : elle doit être très disponible, surveillée, testée, et sa configuration doit être gérée comme du code.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Elle résout et propage le contexte de tenant |
| [10.5 Authentification des API](#105-authentification-des-api) | Elle valide les moyens d'authentification |
| [10.6 Limitation de débit](#106-limitation-de-débit) | Elle applique la limitation de débit |
| [10.8 Versionnement d'API](#108-versionnement-dapi) | Elle route selon la version demandée |
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | Elle appartient au plan de données, configurée par le plan de contrôle |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust exige que les services vérifient aussi |

### 5. Application pratique

**Situation initiale.** Cinq services exposent chacun leur API externe, avec leur propre authentification et leurs propres limites. Un partenaire doit gérer cinq clés et cinq comportements.

**Problème.** L'expérience est incohérente, et les contrôles sont inégaux : un service n'applique aucune limite de débit.

**Application du concept.** Une passerelle unique devant les cinq services.

**Déroulé.**

1. La passerelle expose une adresse unique, avec des routes par service.
2. Elle valide le jeton ou la clé, résout le tenant et applique les quotas de l'offre.
3. Elle transmet aux services un contexte signé.
4. Les services retirent leur propre authentification externe et vérifient le contexte signé.
5. La journalisation et les métriques par tenant sont centralisées.

**Résultat.** Une expérience cohérente pour les partenaires, des contrôles uniformes, et une supervision centralisée.

**Limites.** Les services doivent refuser tout appel qui n'a pas le contexte signé, sans quoi un accès direct contourne la passerelle.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez quatre responsabilités d'une passerelle d'API.
2. **Compréhension.** Pourquoi la passerelle retire-t-elle les en-têtes de contexte fournis par le client ?
3. **Compréhension.** Pourquoi ne doit-elle pas contenir de logique métier ?
4. **Pourquoi.** Pourquoi les services doivent-ils vérifier eux-mêmes les droits malgré la passerelle ?
5. **Raisonnement pratique.** Comment adapter les limites de débit à l'offre du tenant ?

#### Réponses

1. Par exemple : authentification, limitation de débit, validation, journalisation, routage, cache.
2. Parce que le client peut y mettre n'importe quelle valeur : seul un contexte établi par la passerelle après vérification est fiable.
3. Parce qu'elle deviendrait un monolithe et un goulot d'étranglement, difficile à faire évoluer et à tester, et son échec serait critique.
4. Parce que les droits fins dépendent des ressources et des règles du métier, et qu'un accès direct ou une erreur de configuration contournerait la passerelle.
5. En consultant les droits d'usage du tenant (avec un cache) et en appliquant à la passerelle des plafonds différents par offre.

## 10.5 Authentification des API

### 1. Comprendre simplement

L'**authentification d'une API** (*API authentication*) est la manière dont un appelant **prouve son identité** à chaque requête. Plusieurs moyens existent : **clé d'API** (*API keys*), **jeton OAuth**, **certificat**, **signature de requête**, **cookie de session**. Le bon choix dépend de **qui appelle** : un serveur, une application tierce agissant pour un utilisateur, une application mobile, un appareil.

**Pourquoi cela existe.** Une API exposée sur Internet reçoit des appels de toute nature. Sans authentification, la plateforme ne sait pas à qui elle répond, ne peut pas appliquer de droits ni de limites, ni attribuer les actions.

**Problème résolu.** Identifier de façon fiable et proportionnée chaque appelant, selon son type et le risque.

**Modèle mental.** Les différents types de badges d'un site : badge d'employé, badge visiteur limité, accès livreur à un quai, clé d'un prestataire d'entretien. Chacun correspond à un besoin, un niveau de confiance et une durée.

**Où l'analogie s'arrête.** Un badge est présenté à une personne qui regarde le visage. Une API ne voit que la preuve numérique : elle doit résister aux vols et aux rejeux.

**Exemple.** L'import nocturne s'authentifie par identifiants client OAuth ; l'application d'agenda tierce par code d'autorisation avec PKCE ; le capteur d'un véhicule par certificat.

**Les composants.**

1. un **type de preuve** (secret, jeton, certificat, signature) ;
2. un **mode de validation** (passerelle, serveur d'autorisation) ;
3. des **durées** et des **portées** ;
4. des **règles d'erreur** (401, 403).

**Objectif d'apprentissage :** vous pouvez associer un type d'appelant au mécanisme adapté et lister les contrôles de validation d'un jeton.

### 2. Connaissances essentielles

#### Définition

L'**authentification d'API** est l'ensemble des mécanismes par lesquels un service identifie l'appelant d'une requête d'API, à partir d'une preuve présentée avec chaque appel, avant d'appliquer les décisions d'autorisation.

#### Idées fondamentales

1. **Le mécanisme dépend du type d'appelant.** Service, utilisateur délégant, application mobile, appareil.
2. **Les preuves sont de durée courte, sauf nécessité.** Les secrets longs sont des risques.
3. **La preuve est liée à un tenant et à un périmètre.** Elle détermine le contexte.
4. **L'authentification n'est pas l'autorisation.** Un appelant authentifié n'a pas tous les droits (voir [4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation)).
5. **Le transport est chiffré.** HTTPS partout.
6. **Les erreurs ne révèlent rien.** Pas d'indication sur l'existence d'un compte.

#### Vocabulaire essentiel

- **Jeton porteur** (*bearer token*) : jeton dont la possession suffit à l'utiliser.
- **Identifiants client** (*client credentials*) : couple identifiant et secret d'une application.
- **mTLS** : authentification mutuelle par certificats.
- **Signature de requête** (*request signing*) : preuve calculée sur la requête avec un secret (HMAC).
- **CORS** : mécanisme de contrôle des appels d'un navigateur entre origines.
- **Audience** : destinataire prévu d'un jeton.
- **Liaison de jeton** (*token binding*, *sender-constrained token*) : jeton lié à son porteur légitime.

#### Relations de cause à effet

- Une clé d'API longue est utilisée dans une application mobile. Elle est extraite de l'application publiée, et utilisable par n'importe qui.
- Le jeton est accepté pour toute API. Un jeton émis pour une autre application ouvre l'accès à celle-ci.
- Le jeton est placé dans l'adresse. Il apparaît dans les journaux et l'historique des navigateurs.

#### Idées reçues

- **« Une clé d'API suffit pour toutes les situations. »** Non. Elle convient à l'intégration serveur à serveur simple ; pas à la délégation au nom d'un utilisateur ni aux applications distribuées.
- **« OAuth, c'est compliqué, une clé suffit. »** Pour des écosystèmes d'applications tierces et la délégation, OAuth est le bon outil.
- **« Le jeton d'un utilisateur peut servir à toutes les API de la plateforme. »** Non : il doit être limité à une audience et à un périmètre.

#### Principe clé

Choisissez le mécanisme selon l'appelant et le risque, limitez la durée et le périmètre de la preuve, et vérifiez toujours émetteur, destinataire et expiration.

#### Si vous ne retenez que trois choses

1. Un type d'appelant correspond à un mécanisme : clé, OAuth, certificat, signature, session.
2. La preuve est de courte durée, limitée à une audience et à un périmètre.
3. L'authentification précède l'autorisation et ne la remplace jamais.

### 3. Explication technique détaillée

#### Le choix du mécanisme

| Appelant | Mécanisme recommandé | Raison |
|---|---|---|
| Serveur de l'organisation (import, synchronisation) | Identifiants client OAuth, ou clé d'API à portée limitée | Pas d'utilisateur, secret côté serveur |
| Application tierce au nom d'un utilisateur | OAuth, code d'autorisation avec PKCE | Délégation, consentement, révocation |
| Application mobile ou monopage | OAuth avec PKCE, sans secret embarqué | Aucun secret ne peut être caché |
| Interface web de la plateforme (même origine) | Cookie de session sécurisé | Protection par attributs du cookie |
| Appareil ou charge de travail | Certificat (mTLS) ou identité de charge de travail | Preuve cryptographique forte |
| Appels entre services internes | mTLS, jetons à courte durée | Zéro confiance interne |

#### Les caractéristiques des mécanismes

| Mécanisme | Durée typique | Délégation | Révocation | Remarque |
|---|---|---|---|---|
| Clé d'API (voir [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi)) | Longue | Non | Immédiate | Simple, secret au porteur |
| Jeton OAuth (voir [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20)) | Minutes à heures | Oui | Par renouvellement refusé, introspection | Standard d'écosystème |
| Certificat client | Mois à années | Non | Liste de révocation, rotation | Fort, gestion de certificats |
| Signature HMAC | Selon la clé | Non | Retrait de la clé | Protège le contenu de la requête |
| Cookie de session (voir [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)) | Minutes à heures | Non | Immédiate | Pour les navigateurs |

#### La validation d'un jeton

```text
Réception : Authorization: Bearer <jeton>
  1. Vérifier le format et la signature (clé publique de l'émetteur, algorithme attendu)
  2. Vérifier l'émetteur (iss) et le destinataire (aud) = cette API
  3. Vérifier l'expiration (exp) et la date de début (nbf), avec une tolérance d'horloge faible
  4. Vérifier le périmètre (scope) requis par la route
  5. Établir le tenant (revendication) et vérifier qu'il correspond au contexte demandé
  6. Optionnellement : vérifier la révocation (introspection, liste)
```

#### Une requête signée

```http
POST /api/v1/aircraft HTTP/1.1
Host: api.platform.example
Date: Tue, 13 Oct 2026 08:12:45 GMT
Content-Type: application/json
X-Key-Id: key_nightly_import
X-Signature: HMAC-SHA256 <empreinte de (méthode, chemin, date, empreinte du corps)>

{ "registration": "F-ABCD", "model": "A320" }
```

**Pourquoi.** La signature couvre la méthode, le chemin, la date et le corps : un attaquant ne peut ni modifier la requête, ni la rejouer au-delà d'une courte fenêtre de validité.

#### Les précautions communes

| Précaution | Raison |
|---|---|
| HTTPS uniquement (TLS 1.2 minimum, TLS 1.3 préférable) | Confidentialité et intégrité |
| Jamais de secret dans l'adresse | Journaux, historiques, partage |
| Limitation de débit avant authentification | Résister au bourrage d'identifiants |
| Réponses d'erreur uniformes | Ne pas révéler l'existence d'un compte |
| Secret côté serveur seulement | Pas de clé dans les applications distribuées |
| Rotation et expiration | Limiter la durée d'exposition |
| CORS strict pour les navigateurs | Éviter les accès non voulus depuis d'autres sites |

#### La liaison au tenant

Chaque preuve est liée à un tenant : le jeton contient le tenant ; la clé d'API lui est associée à la création. La requête ne peut pas en changer. Un utilisateur qui appartient à plusieurs tenants demande un jeton par tenant (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).

**Contre-exemple.** Une API qui accepte une clé dans l'adresse (`?api_key=…`), sans expiration, utilisée aussi dans une page web publique. La clé est dans les journaux des intermédiaires, dans le code de la page, et ne peut plus être renouvelée sans casser les clients.

**Limites.** Chaque mécanisme a un coût d'adoption pour les intégrateurs. Une plateforme en propose généralement deux ou trois (clé d'API simple, OAuth), et ne multiplie pas les options sans besoin.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi) | La clé d'API est l'un des mécanismes |
| [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20) | OAuth est le mécanisme de délégation |
| [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton) | Sessions et jetons sont la base des preuves |
| [10.4 API Gateway](#104-api-gateway) | La passerelle valide les preuves |
| [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) | Les identités non humaines utilisent clés, certificats, jetons |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust applique l'authentification aussi entre services |

### 5. Application pratique

**Situation initiale.** La plateforme propose une seule clé d'API par tenant, avec les droits d'administrateur. Elle est utilisée par un traitement serveur, une application mobile et trois partenaires.

**Problème.** La clé a fuité de l'application mobile. Elle donne tous les droits, et ne peut pas être révoquée sans tout casser.

**Application du concept.** Un mécanisme adapté à chaque appelant.

**Déroulé.**

1. Le traitement serveur passe aux identifiants client OAuth, avec le périmètre `aircraft.write`.
2. L'application mobile utilise le code d'autorisation avec PKCE : les techniciens s'authentifient, et le jeton porte leurs droits.
3. Chaque partenaire a sa propre application OAuth, avec son périmètre et son consentement.
4. La clé d'administrateur unique est révoquée après migration.

**Résultat.** Chaque appelant a une identité, des droits et une révocation propres ; la fuite d'une preuve ne compromet plus l'ensemble.

**Limites.** Les partenaires doivent migrer ; une période de recouvrement et un guide de migration sont nécessaires (voir [10.8 Versionnement d'API](#108-versionnement-dapi)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quel mécanisme convient à une application mobile qui agit au nom d'un utilisateur ?
2. **Compréhension.** Quelles vérifications fait-on sur un jeton ?
3. **Compréhension.** Pourquoi la signature de requête couvre-t-elle le corps ?
4. **Pourquoi.** Pourquoi ne met-on jamais de secret dans l'adresse ?
5. **Raisonnement pratique.** Un service interne reçoit un jeton émis pour une autre API. Que doit-il faire ?

#### Réponses

1. OAuth avec code d'autorisation et PKCE, sans secret embarqué dans l'application.
2. La signature, l'émetteur, le destinataire, l'expiration, le périmètre et le tenant, et éventuellement la révocation.
3. Pour qu'un attaquant ne puisse pas modifier le contenu de la requête sans invalider la signature.
4. Parce que les adresses sont enregistrées dans les journaux des intermédiaires et les historiques : le secret fuirait.
5. Le refuser : l'audience du jeton n'est pas cette API, ce qui doit toujours être vérifié.

## 10.6 Limitation de débit

### 1. Comprendre simplement

La **limitation de débit** (*rate limiting*) consiste à **plafonner le nombre de requêtes** qu'un appelant peut envoyer pendant une durée donnée. Au-delà, la plateforme répond « trop de requêtes » et invite à réessayer plus tard.

**Pourquoi cela existe.** Les ressources d'une plateforme sont partagées. Un client qui envoie des milliers de requêtes par seconde, par erreur ou par malveillance, dégrade le service des autres. La limitation protège la plateforme, répartit équitablement la capacité et sert de base aux offres commerciales (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)).

**Problème résolu.** Contenir les abus et les erreurs de charge, garantir l'équité entre clients, et maintenir la disponibilité pour tous.

**Modèle mental.** Un tourniquet à l'entrée d'une salle : il laisse passer un nombre limité de personnes par minute, et celles qui arrivent trop vite attendent.

**Où l'analogie s'arrête.** Un tourniquet est physique et uniforme. Une limitation logicielle peut varier selon l'appelant, la route, l'offre et le coût de l'opération, et doit être appliquée de façon cohérente par de nombreuses instances.

**Exemple.** L'offre « Essentiel » autorise 10 requêtes par seconde avec des pointes de 50. Un script qui en envoie 200 par seconde reçoit des réponses `429 Too Many Requests` avec un délai conseillé avant de réessayer.

**Les composants.**

1. un **algorithme** de comptage ;
2. des **dimensions** (appelant, route, tenant) ;
3. des **seuils** par offre ;
4. des **réponses** explicites ;
5. un **compteur partagé** entre instances.

**Objectif d'apprentissage :** vous pouvez décrire le seau de jetons, expliquer l'effet de bord des fenêtres fixes et dire comment le client doit réagir à un `429`.

### 2. Connaissances essentielles

#### Définition

La **limitation de débit** est un mécanisme de contrôle qui mesure le rythme des requêtes d'un appelant (ou d'un groupe d'appelants) et refuse ou retarde celles qui dépassent un seuil défini.

#### Idées fondamentales

1. **La limite protège le collectif.** Elle empêche un appelant d'épuiser une ressource partagée.
2. **Elle s'applique par dimension.** Par clé, par tenant, par utilisateur, par route, par adresse.
3. **Elle tolère des pointes.** Un débit moyen borné, avec une capacité de rafale.
4. **Elle informe.** Le client sait quand réessayer.
5. **Elle dépend de l'offre.** Les seuils sont des droits d'usage (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)).
6. **Elle est partagée.** Plusieurs instances de la passerelle doivent compter ensemble.

#### Vocabulaire essentiel

- **Seau de jetons** (*token bucket*) : algorithme qui accorde des jetons à un rythme fixe, chaque requête en consommant un.
- **Seau percé** (*leaky bucket*) : algorithme qui lisse le débit de sortie.
- **Fenêtre fixe** (*fixed window*) : comptage par intervalles de temps alignés.
- **Fenêtre glissante** (*sliding window*) : comptage sur les $N$ dernières secondes.
- **Rafale** (*burst*) : envoi rapide d'un grand nombre de requêtes.
- **`429 Too Many Requests`** : code de statut HTTP de refus pour excès de requêtes (RFC 6585).
- **`Retry-After`** : en-tête qui indique quand réessayer.

#### Relations de cause à effet

- La limite est faite par instance de la passerelle et non partagée. Avec dix instances, un appelant peut envoyer dix fois la limite prévue.
- Le client réessaie immédiatement après un `429`. Il aggrave la charge et reste bloqué : il doit attendre et ralentir.
- La limite ne distingue pas les routes. Un appelant épuise son quota avec des lectures bon marché, puis ne peut plus faire une écriture critique.

#### Idées reçues

- **« Limiter, c'est refuser des clients. »** C'est protéger la qualité de service de tous, y compris du client limité.
- **« Une limite par adresse IP suffit. »** Non. De nombreux clients partagent une adresse (réseau d'entreprise), et un attaquant en change. On limite plutôt par identité (clé, jeton, tenant).
- **« Toutes les requêtes se valent. »** Non. Une recherche coûteuse pèse beaucoup plus qu'une lecture simple : on peut compter un coût.

#### Principe clé

Limitez par identité, avec une capacité de rafale, selon l'offre, de façon partagée entre instances, et dites au client quand revenir.

#### Si vous ne retenez que trois choses

1. La limitation de débit protège la plateforme et répartit équitablement sa capacité.
2. L'algorithme du seau de jetons autorise des rafales dans un débit moyen borné.
3. Le client doit respecter `Retry-After` et ralentir, avec temporisation et aléa.

### 3. Explication technique détaillée

#### Les algorithmes

| Algorithme | Principe | Avantage | Inconvénient |
|---|---|---|---|
| Fenêtre fixe | Compteur remis à zéro à chaque intervalle | Très simple | Double rafale possible à la frontière |
| Fenêtre glissante (journal) | Conserve l'horodatage de chaque requête | Précis | Mémoire |
| Fenêtre glissante (compteur) | Interpole entre deux fenêtres | Bon compromis | Approximatif |
| Seau de jetons | Jetons ajoutés à rythme fixe, plafonnés | Autorise les rafales, simple | Réglage de la capacité |
| Seau percé | File à débit de sortie constant | Lisse | Retarde, plus de mémoire |

#### Le seau de jetons

Un seau a une capacité $b$ (nombre maximal de jetons) et se remplit à un rythme $r$ (jetons par seconde). Chaque requête consomme un jeton. Le nombre de jetons à l'instant $t$ est :

$$J(t) = \min\Big(b,\; J(t_0) + r\,(t - t_0)\Big)$$

où $t_0$ est l'instant de la dernière mise à jour. La requête est acceptée si $J(t) \geq 1$.

**Exemple chiffré.** Avec $r = 10$ jetons/s et $b = 50$, un client peut envoyer 50 requêtes d'un coup (rafale), puis en moyenne 10 par seconde. Après 5 secondes d'inactivité, le seau est de nouveau plein.

#### L'effet de bord des fenêtres fixes

Avec une limite de 100 requêtes par minute en fenêtre fixe, un client peut envoyer 100 requêtes à 12:00:59, puis 100 autres à 12:01:00 : 200 requêtes en deux secondes, sans dépasser la limite de chaque fenêtre. Les fenêtres glissantes ou le seau de jetons évitent cet effet.

#### Une réponse de refus

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 12
Content-Type: application/problem+json

{
  "type": "https://api.platform.example/problems/rate-limited",
  "title": "Limite de débit atteinte",
  "status": 429,
  "detail": "Votre offre autorise 100 requêtes par minute. Réessayez dans 12 secondes.",
  "request_id": "req_91ab33"
}
```

Les en-têtes `RateLimit-*` sont l'objet d'une normalisation en cours à l'IETF ; plusieurs API utilisent déjà des variantes préfixées. `Retry-After` est, lui, standard.

#### Le comptage partagé

Pour que plusieurs instances comptent ensemble, on utilise un stockage rapide et partagé avec des opérations atomiques.

```text
Clé : ratelimit:{tenant}:{clé_api}:{fenêtre}
Opération atomique : INCR clé ; EXPIRE clé durée_fenêtre
Si compteur > limite : refuser
```

En cas d'indisponibilité de ce stockage, une décision s'impose : **ouvrir** (laisser passer, au risque d'abus) ou **fermer** (refuser, au risque d'indisponibilité). Beaucoup de plateformes appliquent des limites locales de secours plus larges.

#### Les dimensions et les coûts

| Dimension | Usage |
|---|---|
| Par clé ou jeton | Équité entre applications |
| Par tenant | Protection globale d'un client |
| Par route | Protéger les opérations coûteuses (export, recherche) |
| Par utilisateur | Éviter qu'un utilisateur épuise le quota du tenant |
| Par coût estimé | Requêtes lourdes comptées davantage (voir [10.2 GraphQL](#102-graphql)) |

#### La réaction du client

1. Respecter `Retry-After`.
2. À défaut, appliquer une temporisation exponentielle avec aléa (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
3. Réduire le parallélisme, mettre en file, regrouper.
4. Ne jamais réessayer immédiatement en boucle.

**Contre-exemple.** Une limite stricte de 10 requêtes par seconde sans rafale, appliquée à une application mobile qui charge un écran avec 15 appels simultanés à l'ouverture. Chaque ouverture produit des erreurs, alors que le débit moyen est très faible.

**Limites.** La limitation de débit ne remplace pas la planification de capacité. Si la demande légitime dépasse durablement la capacité, il faut augmenter celle-ci (voir [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | C'est un quota de débit appliqué à l'API |
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Elle contient le voisin bruyant |
| [10.4 API Gateway](#104-api-gateway) | Elle est appliquée à la passerelle |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Le client réagit par une temporisation avec aléa |
| [10.2 GraphQL](#102-graphql) | GraphQL la compte en coût de requête |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les seuils sont des droits d'usage par offre |

### 5. Application pratique

**Situation initiale.** Un partenaire déploie une intégration qui interroge l'API toutes les secondes pour chaque aéronef de la compagnie : 3 000 requêtes par seconde pendant dix minutes.

**Problème.** Les autres clients subissent des lenteurs. L'intégration n'a pas de limite.

**Application du concept.** La passerelle applique un seau de jetons par application et par tenant.

**Déroulé.**

1. L'application est limitée à 50 requêtes par seconde, avec une rafale de 200.
2. La passerelle répond `429` avec `Retry-After` au-delà.
3. Le partenaire reçoit une alerte sur son tableau de bord de développeur.
4. Il passe à un webhook sur les changements d'aéronef, ce qui supprime l'interrogation.

**Résultat.** La charge redevient normale, le partenaire est averti, et il adopte un mécanisme plus adapté.

**Limites.** Le plafond doit rester cohérent avec l'offre : une compagnie qui a besoin d'un débit plus élevé le demande ou change d'offre.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fait le seau de jetons ?
2. **Compréhension.** Quel défaut présente la fenêtre fixe ?
3. **Compréhension.** Que doit faire un client qui reçoit un `429` ?
4. **Pourquoi.** Pourquoi le comptage doit-il être partagé entre les instances ?
5. **Raisonnement pratique.** Avec $r = 20$ jetons/s et $b = 100$, combien de requêtes peuvent partir immédiatement après une période d'inactivité ?

#### Réponses

1. Il accorde des jetons à un rythme fixe jusqu'à une capacité maximale, chaque requête en consommant un : il autorise des rafales dans un débit moyen borné.
2. Une double rafale à la frontière de deux fenêtres, qui permet de dépasser le débit voulu sur un court intervalle.
3. Attendre le délai indiqué (`Retry-After`) ou appliquer une temporisation exponentielle avec aléa, et réduire son débit.
4. Parce que sinon chaque instance compte pour elle seule : l'appelant peut envoyer, au total, autant de fois la limite qu'il y a d'instances.
5. 100 requêtes (la capacité du seau), puis environ 20 par seconde.

## 10.7 Pagination et filtrage

### 1. Comprendre simplement

La **pagination** (*pagination*) découpe un grand résultat en **pages** que le client lit une à une. Le **filtrage** (*filtering*) restreint le résultat aux éléments qui correspondent à des critères, avec éventuellement un tri. Les deux se combinent pour obtenir « les 50 aéronefs actifs dont l'inspection est dans moins de 30 jours, triés par date ».

**Pourquoi cela existe.** Une liste de 500 000 ressources ne peut pas être renvoyée d'un coup : trop lourde pour le serveur, le réseau et le client. Il faut un moyen de la parcourir par morceaux, et de ne demander que ce qui compte.

**Problème résolu.** Parcourir efficacement et de façon stable de grands ensembles de ressources, avec des critères précis.

**Modèle mental.** Un annuaire téléphonique : on cherche d'abord par critère (une ville), puis on tourne les pages, dans un ordre stable.

**Où l'analogie s'arrête.** Un annuaire imprimé est figé. Une liste de ressources évolue pendant qu'on la parcourt : des éléments sont ajoutés ou supprimés entre deux pages.

**Exemple.**

```http
GET /api/v1/aircraft?status=active&inspection_before=2026-12-01&sort=next_inspection_date&limit=50
```

**Les composants.**

1. des **critères de filtre** ;
2. un **tri** stable ;
3. une **taille de page** bornée ;
4. un **repère de position** (curseur ou décalage) ;
5. une **enveloppe** de réponse avec le lien vers la suite.

**Objectif d'apprentissage :** vous pouvez comparer la pagination par décalage et par curseur, et expliquer pourquoi la seconde est plus performante et plus stable.

### 2. Connaissances essentielles

#### Définition

- **Pagination** : technique de découpage d'un résultat en pages de taille bornée, avec un moyen d'obtenir la page suivante.
- **Filtrage** : restriction d'un résultat aux éléments satisfaisant des conditions exprimées par le client.

#### Idées fondamentales

1. **La taille de page est bornée.** Le client ne peut pas tout demander.
2. **Le tri doit être total et stable.** Sans cela, des éléments sont vus deux fois ou jamais.
3. **Deux grandes méthodes.** Par décalage (*offset*) et par curseur (*keyset*).
4. **Les droits et le tenant sont appliqués avant la pagination.** Le résultat est celui que l'appelant peut voir.
5. **Le filtrage s'appuie sur des index.** Un filtre sur un champ non indexé est coûteux.
6. **Le total exact coûte cher.** On l'offre avec précaution.

#### Vocabulaire essentiel

- **Décalage** (*offset*) et **limite** (*limit*) : sauter $n$ éléments et en prendre $m$.
- **Curseur** (*cursor*) : repère opaque de la position atteinte.
- **Pagination par clé** (*keyset pagination*, *seek method*) : reprise à partir de la valeur de la clé de tri du dernier élément.
- **Jeton de page** (*page token*) : curseur encodé, opaque pour le client.
- **Départage** (*tie-breaker*) : champ unique ajouté au tri pour le rendre total.
- **Enveloppe** (*envelope*) : structure de réponse qui contient les données et la pagination.
- **Lien de navigation** (*Link header*, RFC 8288) : en-tête qui indique les pages suivante et précédente.

#### Relations de cause à effet

- La pagination par décalage est utilisée sur de gros volumes. La page 20 000 oblige la base à lire et écarter des centaines de milliers de lignes : elle devient lente.
- Des éléments sont insérés pendant le parcours. Avec un décalage, des éléments sont vus deux fois ou manqués.
- Le tri ne départage pas les égalités. Des éléments de même date sont retournés dans un ordre variable, d'une page à l'autre.

#### Idées reçues

- **« Offset et limit suffisent toujours. »** Pour de petits volumes, oui. Pour de grandes tables et des parcours profonds, non.
- **« Le client doit pouvoir sauter à la page 500. »** Rarement utile. Les parcours séquentiels et les filtres couvrent presque tous les besoins.
- **« Le nombre total est gratuit. »** Il peut obliger à compter des millions de lignes à chaque requête.

#### Principe clé

Paginez par curseur sur un tri total et indexé, bornez la taille de page, et appliquez les droits et le tenant avant tout.

#### Si vous ne retenez que trois choses

1. La pagination par curseur est stable et efficace sur de gros volumes ; le décalage est simple mais s'effondre en profondeur.
2. Le tri doit être total, grâce à un champ de départage, et s'appuyer sur un index.
3. Filtres, droits et tenant sont appliqués avant la pagination.

### 3. Explication technique détaillée

#### Décalage ou curseur

| Critère | Par décalage | Par curseur |
|---|---|---|
| Simplicité | Très simple | Un peu plus complexe |
| Accès à une page arbitraire | Oui | Non |
| Performance en profondeur | Dégrade (lit et écarte $n$ lignes) | Constante (recherche par index) |
| Stabilité sous insertions et suppressions | Mauvaise | Bonne |
| Convient à | Petits volumes, interfaces à pages numérotées | API, parcours complets, grands volumes |

#### La requête par décalage

```sql
SELECT * FROM aircraft
WHERE tenant_id = :tenant AND status = 'active'
ORDER BY next_inspection_date, id
OFFSET 1000000 LIMIT 50;       -- la base doit lire et écarter 1 000 000 de lignes
```

#### La requête par curseur (méthode « keyset »)

```sql
SELECT * FROM aircraft
WHERE tenant_id = :tenant AND status = 'active'
  AND (next_inspection_date, id) > (:derniere_date, :dernier_id)
ORDER BY next_inspection_date, id
LIMIT 50;                      -- accès direct par l'index (tenant, status, date, id)
```

**Comment cela fonctionne.** La page suivante commence juste après le dernier élément reçu, identifié par sa valeur de tri et son identifiant. L'index permet de s'y placer directement, quelle que soit la profondeur. Le coût est de l'ordre de $O(\log n + \text{taille de page})$, contre $O(\text{décalage} + \text{taille de page})$.

#### Le jeton de page

Le curseur est présenté au client comme une chaîne opaque, qui encode la dernière valeur de tri, l'identifiant, et un contrôle d'intégrité.

```json
{
  "data": [ { "id": "ac_8f3a", "registration": "F-ABCD" } ],
  "page": {
    "limit": 50,
    "next_cursor": "eyJkIjoiMjAyNi0xMS0zMCIsImlkIjoiYWNfOGYzYSJ9",
    "has_more": true
  }
}
```

**Pourquoi opaque.** Le client ne doit pas le construire : le format peut changer sans casser les clients, et il ne peut pas être forgé pour accéder à des données hors de son périmètre.

#### Le filtrage

| Approche | Exemple | Remarque |
|---|---|---|
| Paramètres simples | `?status=active&base=LYS` | Lisible, limité |
| Opérateurs dans les paramètres | `?next_inspection_date[lt]=2026-12-01` | Plus riche |
| Langage de filtre structuré | Corps JSON (voir [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête)) | Très expressif, à borner |
| Standard OData | `$filter=status eq 'active'` | Normalisé, riche |

**Règles de sûreté.** Les champs filtrables et triables sont listés et indexés ; les droits de champ s'appliquent (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) ; les opérateurs coûteux sont limités ; la taille de page est plafonnée.

#### Le total

Un `COUNT(*)` exact sur de grands volumes est coûteux. Options : fournir une estimation, un total « jusqu'à 10 000 », ou le calculer à la demande. Beaucoup d'API ne le fournissent pas par défaut.

#### La cohérence pendant le parcours

Un parcours complet de plusieurs milliers de pages se fait sur des données qui changent. Les curseurs garantissent de ne pas voir deux fois un élément ni d'en manquer **parmi ceux qui existaient au départ et n'ont pas changé de clé de tri**. Pour une photographie cohérente, on utilise un instantané (export) plutôt qu'un parcours paginé.

**Contre-exemple.** Un tri par `next_inspection_date` seul, sans départage. Cinquante aéronefs ont la même date : deux appels successifs les renvoient dans un ordre différent, et la pagination en omet ou en répète.

**Limites.** La pagination par curseur ne permet pas de sauter à une page arbitraire ni d'afficher « page 3 sur 40 ». Les interfaces qui l'exigent combinent filtres précis et recherche plutôt que la navigation par numéro de page.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Le filtre et le tri relèvent du modèle de requête |
| [2.14 Index](02-donnees-ressources.md#214-index) | Les index déterminent les filtres et tris efficaces |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits de ligne et de champ s'appliquent avant la pagination |
| [10.1 API et REST](#101-api-et-rest) | Les conventions de pagination font partie du contrat REST |
| [10.6 Limitation de débit](#106-limitation-de-débit) | La taille de page borne la charge par requête |
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | Les exports massifs remplacent le parcours paginé |

### 5. Application pratique

**Situation initiale.** Un partenaire synchronise ses données en parcourant la liste de 800 000 aéronefs avec `offset` et `limit`. Les dernières pages mettent plus de 20 secondes, et certains aéronefs manquent.

**Problème.** Le décalage est profond, et des aéronefs sont créés pendant le parcours.

**Application du concept.** L'API passe à une pagination par curseur avec départage par identifiant.

**Déroulé.**

1. L'API trie par `(updated_at, id)` et expose `next_cursor`.
2. Le partenaire lit les pages avec le curseur : chaque page demande environ 30 ms, quelle que soit la profondeur.
3. Pour la synchronisation incrémentale, il demande « les ressources modifiées après ce curseur ».
4. Aucun aéronef n'est manqué ni dupliqué.

**Résultat.** Le parcours complet passe de plusieurs heures à quelques minutes, sans perte.

**Limites.** Les ressources modifiées pendant le parcours peuvent apparaître à nouveau plus loin (leur clé de tri a changé) : le consommateur doit être idempotent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la pagination par décalage ralentit-elle en profondeur ?
2. **Compréhension.** Que contient un curseur et pourquoi est-il opaque ?
3. **Compréhension.** À quoi sert un champ de départage dans le tri ?
4. **Pourquoi.** Pourquoi appliquer les droits avant la pagination ?
5. **Raisonnement pratique.** Un client veut parcourir toutes les ressources modifiées depuis hier. Quelle approche conseillez-vous ?

#### Réponses

1. Parce que la base doit lire et écarter toutes les lignes précédant le décalage avant de renvoyer la page.
2. La valeur de tri et l'identifiant du dernier élément, avec un contrôle d'intégrité ; il est opaque pour permettre de changer son format et empêcher sa falsification.
3. À rendre le tri total, pour que des éléments de valeur de tri égale soient toujours renvoyés dans le même ordre.
4. Pour que les pages ne contiennent que des éléments que l'appelant a le droit de voir, et que les comptes et les curseurs n'en révèlent pas d'autres.
5. Une pagination par curseur sur `(updated_at, id)`, avec un filtre `updated_at > hier`, avec un consommateur idempotent.

## 10.8 Versionnement d'API

### 1. Comprendre simplement

Le **versionnement d'API** (*API versioning*) est l'ensemble des pratiques qui permettent de **faire évoluer le contrat d'une API sans casser les clients existants** : distinguer les changements compatibles de ceux qui cassent, proposer plusieurs versions en parallèle, annoncer et organiser les retraits.

**Pourquoi cela existe.** Une API est utilisée par des programmes écrits par d'autres, qui ne peuvent pas évoluer au rythme de la plateforme. Un champ renommé ou un comportement modifié sans prévenir fait échouer leurs intégrations. La confiance dans l'API repose sur la stabilité de son contrat.

**Problème résolu.** Permettre à la plateforme d'évoluer et aux clients de migrer à leur rythme, avec des règles connues.

**Modèle mental.** Un changement de norme de prise électrique : on ne remplace pas toutes les prises d'un coup. On fournit des adaptateurs, une période de transition, et on annonce longtemps à l'avance la date de fin de l'ancienne norme.

**Où l'analogie s'arrête.** Un changement de norme électrique est rare. Une API évolue en continu, et la plupart des changements doivent être invisibles.

**Exemple.** L'API `v1` renvoie `registration`. L'API `v2` renvoie `registration` et une structure `identifiers`. Les clients de `v1` continuent de fonctionner pendant dix-huit mois, avec des en-têtes de dépréciation qui annoncent la date de retrait.

**Les composants.**

1. une **classification** des changements ;
2. une **stratégie de version** ;
3. une **politique de dépréciation** ;
4. des **outils de compatibilité** (tests de contrat, journal des changements) ;
5. un **contrat d'idempotence** (*idempotency*) explicite.

**Objectif d'apprentissage :** vous pouvez classer des changements d'API, choisir une stratégie de versionnement et rédiger un calendrier de dépréciation.

### 2. Connaissances essentielles

#### Définition

Le **versionnement d'API** est l'ensemble des mécanismes (identification de version, politique de compatibilité, calendrier de dépréciation) par lesquels les évolutions d'un contrat d'API sont communiquées, introduites et retirées de façon prévisible pour ses utilisateurs.

#### Idées fondamentales

1. **La plupart des changements sont compatibles.** Ajouter un champ ou un endpoint ne casse rien.
2. **Les changements cassants sont rares et annoncés.** Retrait, renommage, changement de sens.
3. **Une version est un engagement.** On la maintient pendant une durée annoncée.
4. **Les clients doivent être tolérants.** Ils ignorent les champs inconnus.
5. **La dépréciation est un processus.** Annonce, période de coexistence, retrait.
6. **L'idempotence fait partie du contrat.** Les opérations d'écriture indiquent comment les rejouer en sûreté.

#### Vocabulaire essentiel

- **Changement cassant** (*breaking change*) : modification qui peut faire échouer un client existant.
- **Changement additif** (*additive change*) : ajout qui ne modifie rien d'existant.
- **Dépréciation** (*deprecation*) : annonce qu'un élément sera retiré.
- **Date de retrait** (*sunset date*) : date à laquelle l'élément cesse de fonctionner.
- **Lecteur tolérant** (*tolerant reader*) : client qui ignore ce qu'il ne connaît pas.
- **Test de contrat** (*contract test*) : test qui vérifie le respect du contrat entre fournisseur et consommateur.
- **Version épinglée** (*pinned version*) : version à laquelle un compte ou un client est rattaché.

#### Relations de cause à effet

- Un champ est renommé sans nouvelle version. Les clients qui le lisent cassent, souvent en silence.
- Les clients rejettent les champs qu'ils ne connaissent pas. Chaque ajout, même sûr, devient cassant.
- Aucune date de retrait n'est annoncée. Des versions anciennes subsistent indéfiniment, et le coût de maintenance augmente.

#### Idées reçues

- **« Versionner, c'est mettre `/v2` dans l'adresse. »** C'est une façon de nommer. L'essentiel est la politique de compatibilité et de retrait.
- **« Il vaut mieux ne jamais changer. »** Une API figée se dégrade : les besoins évoluent, et la dette s'accumule.
- **« Ajouter une valeur d'énumération est toujours sûr. »** Pas pour les clients qui traitent exhaustivement les valeurs connues : ils doivent prévoir un cas par défaut.

#### Principe clé

Faites évoluer l'API par ajouts compatibles, annoncez et datez les ruptures, et donnez aux clients le temps et les moyens de migrer.

#### Si vous ne retenez que trois choses

1. On distingue changements additifs (sûrs) et changements cassants (annoncés, versionnés).
2. Une version est un engagement de durée, avec une politique de dépréciation et de retrait.
3. Les clients tolérants et les tests de contrat rendent l'évolution possible.

### 3. Explication technique détaillée

#### La classification des changements

| Changement | Compatible ? | Remarque |
|---|---|---|
| Ajouter un champ en réponse | Oui | Les clients tolérants l'ignorent |
| Ajouter un endpoint | Oui | |
| Ajouter un paramètre facultatif | Oui | |
| Ajouter une valeur d'énumération | Avec précaution | Clients exhaustifs |
| Rendre un champ obligatoire en entrée | **Non** | Casse les écritures existantes |
| Renommer ou supprimer un champ | **Non** | |
| Changer le type ou le format d'un champ | **Non** | |
| Changer le sens d'un champ ou d'un statut | **Non** | Le plus insidieux |
| Resserrer une validation | **Non** | Des requêtes valides deviennent refusées |
| Changer un code de statut ou une erreur | **Non** | |

#### Les stratégies de version

| Stratégie | Exemple | Avantages | Inconvénients |
|---|---|---|---|
| Dans l'adresse | `/v1/aircraft`, `/v2/aircraft` | Visible, simple à router | Duplique les adresses |
| Dans un en-tête de contenu | `Accept: application/vnd.platform.v2+json` | Adresses stables | Moins visible |
| Par date | `Platform-Version: 2026-10-01` | Granularité fine, chaque client épinglé | Nombreuses combinaisons à tester |
| Évolution additive sans version | Aucune version, ajouts seulement | Simplicité | Exige une discipline stricte, ruptures impossibles |

Certaines API très utilisées (par exemple celle de Stripe) épinglent chaque compte sur une version datée et permettent de l'outrepasser par requête.

#### Une politique de dépréciation

```text
J       Annonce : journal des changements, courriel aux propriétaires des clés concernées,
        en-têtes de réponse indiquant la dépréciation et la date de retrait
J+90    Rappel ; les appels à l'ancienne version sont comptés et signalés dans le tableau de bord
J+365   Rappel renforcé ; contact direct des plus gros utilisateurs
J+540   Retrait : l'ancienne version répond « 410 Gone » avec un message de migration
```

L'en-tête `Sunset` (RFC 8594) indique la date après laquelle une ressource n'est plus disponible.

```http
HTTP/1.1 200 OK
Sunset: Wed, 31 Mar 2028 00:00:00 GMT
Link: <https://docs.platform.example/migrate-v1-v2>; rel="sunset"
```

#### Les outils de compatibilité

| Outil | Rôle |
|---|---|
| Spécification versionnée (OpenAPI) | Contrat de référence |
| Détection automatique des changements cassants | Compare deux spécifications et signale les ruptures |
| Tests de contrat | Vérifient que le fournisseur respecte ce que les consommateurs utilisent |
| Journal des changements | Information des clients |
| Statistiques d'usage par version et par client | Savoir qui doit migrer |
| Environnement d'essai | Tester la migration |

#### Le versionnement dans une plateforme configurable

Les clients modifient eux-mêmes le modèle (champs, types). Chaque ajout de champ modifie la réponse de l'API : c'est un **changement additif** produit par le client, qui doit être toléré par ses propres intégrations. Les changements cassants du client (suppression, renommage) relèvent de son administration (voir [8.2 Administration du modèle de données](08-admin-control-plane.md#82-administration-du-modèle-de-données)) : la plateforme aide par l'analyse d'impact et la dépréciation progressive.

#### L'idempotence dans le contrat

Pour les opérations d'écriture non idempotentes, le contrat précise :

- l'en-tête de clé d'idempotence accepté ;
- la **durée de conservation** des clés (par exemple 24 heures) ;
- le comportement en cas de **réutilisation** avec un contenu différent (erreur) ;
- la **réponse rejouée** à l'identique (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

**Contre-exemple.** Une API qui retire un champ « déprécié depuis deux ans » sans date annoncée, un lundi matin. Trois intégrations de clients cessent de fonctionner, et le support est saturé.

**Limites.** Chaque version maintenue a un coût (tests, support, correctifs de sécurité). Le calendrier doit équilibrer la stabilité pour les clients et la capacité du fournisseur à évoluer.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | Le schéma évolue ; l'API en expose la vue stable |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement d'API est un cas du versionnement de contrats |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence est un élément du contrat d'écriture |
| [10.1 API et REST](#101-api-et-rest) | Le contrat REST est ce qui est versionné |
| [10.13 SDK et plateforme développeur](#1013-sdk-et-plateforme-développeur) | Les SDK suivent le versionnement de l'API |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements et leurs schémas suivent la même discipline |

### 5. Application pratique

**Situation initiale.** La plateforme veut remplacer le champ texte `owner` par une structure `owner: { id, type, name }` dans les réponses de l'API.

**Problème.** Une quarantaine d'intégrations lisent `owner` comme texte. Elles ne peuvent pas toutes évoluer rapidement.

**Application du concept.** Introduction par ajout, puis dépréciation planifiée.

**Déroulé.**

1. La plateforme **ajoute** `owner_ref` (la structure) tout en conservant `owner` (texte). Changement additif.
2. Elle annonce la dépréciation de `owner`, avec une date de retrait à 12 mois, et l'indique dans la spécification (`deprecated: true`).
3. Un tableau de bord liste les clients qui lisent encore `owner`.
4. Elle contacte les dix plus gros utilisateurs.
5. À la date de retrait, `owner` est supprimé pour les versions actuelles, mais reste disponible pour les comptes épinglés sur l'ancienne version datée, pendant une période prolongée.

**Résultat.** La migration se fait sans rupture, avec des clients informés.

**Limites.** Les comptes épinglés prolongent le coût de maintenance : un second calendrier de retrait doit être fixé.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois changements d'API cassants.
2. **Compréhension.** Qu'est-ce qu'un lecteur tolérant ?
3. **Compréhension.** À quoi sert l'en-tête `Sunset` ?
4. **Pourquoi.** Pourquoi une API doit-elle préciser la durée de conservation des clés d'idempotence ?
5. **Raisonnement pratique.** Comment introduire une nouvelle structure pour un champ sans casser les clients ?

#### Réponses

1. Par exemple : supprimer ou renommer un champ, changer le type d'un champ, rendre un champ obligatoire en entrée.
2. Un client qui ignore les champs et les valeurs qu'il ne connaît pas, de sorte que les ajouts ne le font pas échouer.
3. À indiquer la date après laquelle une ressource ou une version ne sera plus disponible.
4. Parce que le client doit savoir pendant combien de temps il peut rejouer une requête avec la même clé en obtenant la même réponse.
5. Ajouter le nouveau champ à côté de l'ancien (changement additif), déprécier l'ancien avec une date de retrait, mesurer l'usage, puis retirer.

## 10.9 Connecteurs et adaptateurs

### 1. Comprendre simplement

Un **adaptateur** (*adapter*, au pluriel *adapters*) est un composant qui **traduit** entre le modèle et le protocole de la plateforme, et ceux d'un système externe. Un **connecteur** (*connector*, au pluriel *connectors*) est une **intégration prête à l'emploi** avec un système précis (un ERP, un système qualité, un annuaire) : il assemble un adaptateur, la gestion de l'authentification, la correspondance des données, la planification des échanges et la supervision.

**Pourquoi cela existe.** Les systèmes externes ont leurs propres formats, protocoles, vocabulaires et contraintes. Les relier directement à la plateforme, au cas par cas, dissémine ces particularités dans tout le code. Un adaptateur les isole en un seul endroit, et un connecteur les rend réutilisables.

**Problème résolu.** Intégrer des systèmes hétérogènes sans contaminer le modèle de la plateforme, et rendre ces intégrations réutilisables et configurables.

**Modèle mental.** L'adaptateur de prise pour voyager : il fait le lien entre deux normes sans modifier ni l'appareil ni la prise. Le connecteur est le câble complet, déjà équipé de l'adaptateur et testé pour un pays.

**Où l'analogie s'arrête.** Un adaptateur de prise ne transforme que la forme. Un adaptateur logiciel traduit aussi le sens : vocabulaire, règles, états.

**Exemple.** Le connecteur « système qualité Q » lit les constats d'inspection de la plateforme, les convertit dans le format de Q, authentifie les appels avec les identifiants du tenant, planifie les envois, et signale les échecs.

**Les composants.**

1. un **adaptateur** (traduction de modèle et de protocole) ;
2. une **gestion des identifiants** externes ;
3. une **correspondance** (*mapping*) configurable ;
4. une **planification** des échanges ;
5. une **supervision** et des **erreurs** classées.

**Objectif d'apprentissage :** vous pouvez décrire les rôles d'un adaptateur et d'un connecteur, et expliquer pourquoi on isole les modèles externes.

### 2. Connaissances essentielles

#### Définition

- **Adaptateur** : composant qui convertit l'interface ou le modèle d'un système vers ceux qu'attend un autre système, afin de les faire coopérer sans les modifier (patron *Adapter*).
- **Connecteur** : composant d'intégration packagé, configurable, qui relie la plateforme à un système externe précis, avec authentification, correspondance de données, planification et supervision.

#### Idées fondamentales

1. **Les modèles externes restent à l'extérieur.** Une couche de traduction protège le modèle de la plateforme (couche anticorruption).
2. **La correspondance est configurable.** Chaque tenant a ses champs, chaque système externe aussi.
3. **Les identifiants externes sont gérés.** Table de correspondance entre identifiants.
4. **Les erreurs sont classées.** Passagères, permanentes, d'authentification, de limites du système externe.
5. **Chaque connexion est supervisée.** État, dernière synchronisation, volumes, erreurs.
6. **Les connecteurs sont versionnés et isolés.** Comme des extensions (voir [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés)).

#### Vocabulaire essentiel

- **Couche anticorruption** (*anti-corruption layer*) : couche qui protège le modèle interne des concepts d'un système externe.
- **Correspondance** (*mapping*) : règles qui relient les champs et les valeurs de deux systèmes.
- **Modèle canonique** (*canonical model*) : modèle commun intermédiaire.
- **Référence croisée** (*cross-reference*) : association entre l'identifiant interne et l'identifiant externe.
- **Plateforme d'intégration** (*iPaaS*) : service géré pour construire des intégrations.
- **Authentification déléguée** : connexion au système externe avec les identifiants du tenant.
- **Limites du fournisseur** (*vendor rate limits*) : contraintes imposées par le système externe.

#### Relations de cause à effet

- Le modèle externe est utilisé tel quel dans la plateforme. Chaque changement du système externe se répercute dans toute la plateforme.
- Les identifiants externes sont mélangés avec les identifiants internes. Les doublons se multiplient et les liens se brisent.
- Les limites du système externe ne sont pas gérées. La synchronisation s'effondre aux heures de pointe.

#### Idées reçues

- **« Un connecteur, c'est un simple appel d'API. »** Il traite aussi l'authentification, la correspondance, la reprise, la planification, la supervision et les évolutions de l'autre système.
- **« Un modèle canonique règle tout. »** Il réduit le nombre de traductions, mais ajoute un modèle à maintenir ; il faut le justifier.
- **« Une intégration est terminée quand elle fonctionne. »** Elle doit être maintenue : le système externe évolue, ses jetons expirent, ses limites changent.

#### Principe clé

Isolez chaque système externe derrière un adaptateur, configurez la correspondance par tenant, et supervisez chaque connexion comme un service.

#### Si vous ne retenez que trois choses

1. L'adaptateur traduit et isole ; le connecteur packagé relie la plateforme à un système précis.
2. La correspondance des champs et des identifiants est configurable et explicite.
3. Chaque connexion est supervisée, versionnée et protégée contre les limites du système externe.

### 3. Explication technique détaillée

#### L'architecture

```text
Plateforme                     Connecteur                         Système externe
┌────────────┐   événements   ┌───────────────────────┐          ┌────────────────┐
│ Ressources │ ─────────────► │ Adaptateur            │  appels  │ Système qualité│
│ Modèle     │                │  - traduit le modèle  │ ───────► │ (API propre)   │
│ de la      │ ◄───────────── │  - authentifie        │ ◄─────── │                │
│ plateforme │   résultats    │  - limite le débit    │          └────────────────┘
└────────────┘                │  - classe les erreurs │
                              │  - tient les liens    │
                              └───────────────────────┘
```

#### La correspondance

```json
{
  "mapping": "map_findings_v3",
  "direction": "outbound",
  "source_type": "finding",
  "target_object": "NonConformity",
  "fields": [
    { "from": "title",               "to": "Subject" },
    { "from": "severity",            "to": "Priority",
      "values": { "critical": "P1", "major": "P2", "minor": "P3" } },
    { "from": "aircraft.registration","to": "AssetRef" },
    { "from": "created_at",          "to": "OpenedOn", "transform": "iso_date" }
  ],
  "identity": { "external_id_field": "Id", "store_as": "qs_id" }
}
```

#### L'interface d'un connecteur

```typescript
interface Connector {
  // Établir et vérifier la connexion avec les identifiants du tenant
  connect(config: ConnectionConfig): Promise<ConnectionStatus>;

  // Envoyer une ressource, de façon idempotente
  push(resource: Resource, ctx: SyncContext): Promise<PushResult>;

  // Récupérer les changements depuis un curseur
  pull(since: Cursor, ctx: SyncContext): Promise<ChangeBatch>;

  // Traductions de modèle
  toExternal(resource: Resource): ExternalObject;
  fromExternal(object: ExternalObject): ResourceDraft;

  // Santé et limites
  health(): Promise<HealthReport>;
}
```

#### Les référence croisées

| Identifiant interne | Système | Identifiant externe |
|---|---|---|
| `fd_204` | Système qualité | `NC-88421` |
| `ac_8f3a` | ERP | `ASSET-00417` |
| `u_42` | Annuaire | `E-10492` |

Cette table permet de mettre à jour plutôt que de créer à chaque synchronisation (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)) et de retrouver les objets liés des deux côtés.

#### La classification des erreurs

| Classe | Exemples | Traitement |
|---|---|---|
| Passagère | Délai, indisponibilité, limite atteinte | Nouvelle tentative avec temporisation (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)) |
| Authentification | Jeton expiré, identifiants révoqués | Renouvellement, sinon alerte à l'administrateur |
| Donnée | Valeur refusée par le système externe | Mise de côté avec le motif, correction humaine |
| Permanente | Objet supprimé, droits insuffisants | Alerte, arrêt de l'objet concerné |
| Rupture de contrat | Réponse inattendue après une mise à jour du système | Désactivation du connecteur, alerte à l'éditeur |

#### La supervision par connexion

| Indicateur | Question |
|---|---|
| Dernière synchronisation réussie | Les données sont-elles à jour ? |
| Volume et erreurs récentes | La connexion fonctionne-t-elle ? |
| Retard de synchronisation | De combien d'événements est-on en retard ? |
| Consommation des limites du fournisseur | Va-t-on être bloqué ? |
| Expiration des identifiants | Faut-il renouveler ? |

**Contre-exemple.** Des appels directs à l'API du système qualité, éparpillés dans le code de dix modules, avec le format externe stocké tel quel. Quand le système externe change un champ, il faut corriger dix endroits, et personne ne sait ce que la plateforme stocke réellement.

**Limites.** Un connecteur couvre les cas courants ; les besoins très spécifiques exigent de la personnalisation (voir [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés)). Chaque connecteur ajoute une surface de support à long terme.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Les webhooks sont l'un des canaux d'un connecteur |
| [10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export) | La synchronisation est le principal usage |
| [10.11 Systèmes externes et système de référence](#1011-systèmes-externes-et-système-de-référence) | Le système de référence détermine la direction des échanges |
| [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés) | Un connecteur est souvent livré comme extension |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration technique gère les connexions |
| [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20) | L'autorisation vers le système externe passe souvent par OAuth |

### 5. Application pratique

**Situation initiale.** Trois clients veulent transmettre leurs constats critiques à leur système qualité, chacun avec un système différent.

**Problème.** Développer trois intégrations spécifiques serait coûteux, et chaque client a ses propres champs.

**Application du concept.** Un connecteur générique pour « systèmes qualité », avec des adaptateurs par éditeur et une correspondance configurable.

**Déroulé.**

1. Le fournisseur développe l'adaptateur de chaque système, avec un contrat commun.
2. Chaque client choisit son système dans le catalogue et saisit ses identifiants.
3. Il configure la correspondance de ses champs, avec des valeurs par défaut proposées.
4. La plateforme planifie les envois, gère les reprises et affiche l'état.
5. Une erreur d'authentification (jeton expiré) déclenche une alerte à l'administrateur.

**Résultat.** Les trois clients sont connectés en quelques jours, avec une base commune de maintenance.

**Limites.** Chaque système externe a ses particularités (limites, pagination, erreurs) que l'adaptateur doit absorber.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un adaptateur et un connecteur ?
2. **Compréhension.** À quoi sert une couche anticorruption ?
3. **Compréhension.** Pourquoi tient-on une table de références croisées ?
4. **Pourquoi.** Pourquoi classe-t-on les erreurs d'un connecteur ?
5. **Raisonnement pratique.** Le système externe met à jour son API et change un nom de champ. Que se passe-t-il avec une bonne architecture ?

#### Réponses

1. L'adaptateur traduit entre deux modèles ou protocoles ; le connecteur est une intégration complète et configurable avec un système précis, qui inclut l'adaptateur.
2. À empêcher les concepts du système externe de contaminer le modèle de la plateforme, en les traduisant à la frontière.
3. Pour relier les objets des deux côtés, mettre à jour au lieu de dupliquer, et retrouver l'équivalent d'un objet dans l'autre système.
4. Pour appliquer le bon traitement : reprise, renouvellement d'identifiants, correction humaine ou arrêt.
5. Seul l'adaptateur est à modifier ; le reste de la plateforme n'est pas affecté.

## 10.10 Synchronisation, ETL, import et export

### 1. Comprendre simplement

La **synchronisation** (*sync*) maintient la cohérence des données entre deux systèmes, dans un sens ou dans les deux, en continu ou par lots. L'**ETL** (*Extract, Transform, Load*, extraire, transformer, charger) est un enchaînement qui prélève des données dans des sources, les transforme et les charge dans une cible, souvent pour l'analyse. L'**import** et l'**export** (*import/export*) sont les échanges de données par fichiers ou lots (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)), vus ici comme outils d'intégration.

**Pourquoi cela existe.** Aucune organisation n'utilise un seul système. Les données doivent circuler : de la plateforme vers l'entrepôt de données pour l'analyse, de l'ERP vers la plateforme pour les références, entre systèmes lors de migrations.

**Problème résolu.** Faire circuler des données entre systèmes de façon fiable, rejouable et cohérente, avec une idée claire de qui fait autorité.

**Modèle mental.** Un service de courrier interne entre deux bureaux : des enveloppes de mises à jour circulent à intervalles réguliers, avec un registre de ce qui a été envoyé et reçu.

**Où l'analogie s'arrête.** Un courrier n'a pas de conflit : ici, les deux bureaux peuvent modifier la même fiche en même temps, et il faut décider laquelle l'emporte.

**Exemple.** Chaque nuit, un ETL extrait les inspections de la plateforme, les enrichit avec des données de l'ERP, et les charge dans l'entrepôt de données pour les tableaux de bord de la direction.

**Les composants.**

1. une **direction** de synchronisation ;
2. une **détection de changements** ;
3. une **correspondance d'identifiants** ;
4. une **politique de conflit** ;
5. une **reprise** et une **réconciliation**.

**Objectif d'apprentissage :** vous pouvez décrire une synchronisation incrémentale, les politiques de conflit et la différence entre ETL et ELT.

### 2. Connaissances essentielles

#### Définition

- **Synchronisation** : processus qui propage les changements d'un système à un autre (ou dans les deux sens) pour maintenir une cohérence convenue.
- **ETL** : processus en trois étapes (extraction, transformation, chargement) qui déplace des données d'une ou plusieurs sources vers une cible. En **ELT**, la transformation se fait après le chargement, dans la cible.

#### Idées fondamentales

1. **Il faut décider qui fait autorité.** Pour chaque donnée, un système de référence (voir [10.11 Systèmes externes et système de référence](#1011-systèmes-externes-et-système-de-référence)).
2. **On synchronise par incréments.** Chargement initial, puis changements.
3. **Les changements se détectent de plusieurs façons.** Horodatage, version, journal de changements, événements.
4. **Les identifiants sont mis en correspondance.** Table de références croisées.
5. **Les conflits ont une règle.** La source gagne, la plus récente gagne, ou arbitrage humain.
6. **Tout est rejouable.** Idempotence et réconciliation périodique.

#### Vocabulaire essentiel

- **Chargement initial** (*initial load*) et **synchronisation incrémentale** (*incremental sync*).
- **Capture des changements** (*change data capture*, *CDC*) : lecture du journal de modifications d'une base.
- **Synchronisation unidirectionnelle** et **bidirectionnelle** (*one-way*, *two-way sync*).
- **Pierre tombale** (*tombstone*) : marqueur d'une suppression à propager.
- **Entrepôt de données** (*data warehouse*) : base conçue pour l'analyse.
- **Réconciliation** (*reconciliation*) : comparaison pour détecter et corriger les écarts.
- **Qualité des données** (*data quality*) : exactitude, complétude, cohérence.

#### Relations de cause à effet

- La synchronisation est bidirectionnelle sans règle de conflit. Les deux systèmes s'écrasent mutuellement, ou bouclent (A modifie B, qui modifie A).
- Les suppressions ne sont pas propagées. Les deux systèmes divergent durablement : des objets supprimés d'un côté réapparaissent.
- La détection de changements repose sur un horodatage « modifié après ». Des horloges décalées ou des modifications simultanées font manquer des changements.

#### Idées reçues

- **« Synchroniser, c'est copier. »** Copier est le début. Il faut gérer les identifiants, les conflits, les suppressions, les erreurs et les reprises.
- **« Le temps réel est toujours préférable. »** Il coûte plus cher. Beaucoup de besoins (analyse, rapports) sont satisfaits par des lots périodiques.
- **« La synchronisation bidirectionnelle est naturelle. »** Elle est la plus difficile. On préfère un sens unique par donnée, avec un système de référence clair.

#### Principe clé

Désignez une autorité par donnée, détectez les changements de façon fiable, mettez les identifiants en correspondance et rendez chaque échange rejouable.

#### Si vous ne retenez que trois choses

1. Une synchronisation a une direction, une autorité et une règle de conflit.
2. On combine un chargement initial et des changements incrémentaux fiables.
3. Les suppressions, les identifiants et les erreurs doivent être traités explicitement.

### 3. Explication technique détaillée

#### Les modes de synchronisation

| Mode | Principe | Latence | Usage |
|---|---|---|---|
| Lot périodique | Export ou extraction à intervalles | Minutes à heures | Analyse, rapports |
| Événementiel | Les événements déclenchent la propagation | Secondes | Mise à jour opérationnelle |
| Capture des changements (CDC) | Lecture du journal de la base | Secondes | Réplication fidèle |
| Interrogation (*polling*) | Lecture périodique de « ce qui a changé » | Selon l'intervalle | Systèmes sans événements |
| Fichiers (import, export) | Échange de fichiers | Heures à jours | Systèmes anciens, partenaires |

#### La détection des changements

| Méthode | Principe | Limites |
|---|---|---|
| Horodatage de modification | `modifié après T` | Horloges, transactions longues, absence de colonne |
| Numéro de version ou séquence | `version > N` | Nécessite de le maintenir |
| Journal de changements (CDC) | Lecture ordonnée du journal | Dépend du système source |
| Événements | La source publie | Perte possible, besoin de réconciliation |
| Comparaison complète | Différence d'ensemble | Coûteuse, mais fiable en dernier recours |

#### Une boucle de synchronisation incrémentale

```text
curseur ← dernier curseur enregistré
répéter :
    lot ← source.changements_depuis(curseur, limite = 500)
    pour chaque changement dans lot :
        id_cible ← références_croisées.chercher(changement.id)
        si changement.type = suppression :
            cible.supprimer_ou_archiver(id_cible)       # pierre tombale
        sinon si id_cible existe :
            cible.mettre_à_jour(id_cible, traduire(changement))
        sinon :
            nouvel_id ← cible.créer(traduire(changement))
            références_croisées.enregistrer(changement.id, nouvel_id)
    enregistrer le curseur = dernier élément du lot       (après succès du lot)
jusqu'à lot vide
```

**Points de sûreté.** Le curseur n'est enregistré qu'après le succès du lot ; chaque opération est idempotente ; les erreurs d'un élément n'arrêtent pas le lot (elles sont mises de côté).

#### Les politiques de conflit

| Politique | Principe | Risque |
|---|---|---|
| La source de référence gagne | La donnée est toujours écrasée par la source | Perd les modifications locales |
| La dernière écriture gagne | Horodatage le plus récent | Dépend des horloges, perd du travail |
| Fusion par champ | Chaque champ a son système de référence | Plus complexe, plus fidèle |
| Arbitrage humain | Conflits listés pour décision | Lent, mais sûr pour les données sensibles |

Une pratique saine : attribuer chaque **champ** à un système de référence (voir [10.11 Systèmes externes et système de référence](#1011-systèmes-externes-et-système-de-référence)), et rendre le champ en lecture seule dans l'autre système.

#### Éviter les boucles

Si A modifie B, et que la modification de B déclenche une synchronisation vers A, on boucle. Parades :

- une **marque d'origine** sur les changements (« provient de A ») pour ne pas les renvoyer à leur source ;
- une **comparaison** avant écriture : ne pas écrire si la valeur est identique ;
- des **acteurs techniques** identifiables, dont les changements ne sont pas propagés en retour.

#### ETL et ELT

| Critère | ETL | ELT |
|---|---|---|
| Où se fait la transformation | Avant le chargement, dans un outil | Après le chargement, dans la cible |
| Données chargées | Déjà transformées | Brutes, puis transformées |
| Souplesse | Moindre | Grande : on retransforme à volonté |
| Charge | Sur l'outil d'intégration | Sur la cible (entrepôt) |
| Adapté à | Cibles aux capacités limitées, données à nettoyer avant | Entrepôts modernes, besoins analytiques changeants |

#### La réconciliation

Périodiquement, on compare la source et la cible par comptages et sommes de contrôle par segment, puis on corrige les écarts. C'est le filet de sécurité de toute synchronisation fondée sur des événements ou des horodatages.

#### Les modes de défaillance

- **Doublons** : création répétée faute de référence croisée.
- **Suppressions perdues** : non propagées.
- **Changements manqués** : horodatage ou événements non fiables.
- **Boucles** : synchronisation bidirectionnelle sans marque d'origine.
- **Dérive de schéma** : un champ ajouté ou renommé d'un côté.
- **Surcharge** : un chargement initial massif qui sature la cible.

**Contre-exemple.** Une synchronisation bidirectionnelle entre la plateforme et un système externe où les deux peuvent modifier la date d'inspection, avec la règle « la dernière écriture gagne ». Deux modifications rapprochées s'écrasent, la valeur finale dépend des horloges, et personne ne comprend pourquoi la date change.

**Limites.** Une synchronisation parfaite entre systèmes autonomes n'existe pas : on garantit la convergence à terme, et on se dote des moyens de détecter et de corriger les écarts (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'import et l'export sont les mécanismes de lot |
| [10.9 Connecteurs et adaptateurs](#109-connecteurs-et-adaptateurs) | Les connecteurs réalisent la synchronisation |
| [10.11 Systèmes externes et système de référence](#1011-systèmes-externes-et-système-de-référence) | Le système de référence détermine la direction et les conflits |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La convergence à terme et la réconciliation |
| [4.12 SCIM](04-identite-iam-autorisation.md#412-scim) | SCIM est une synchronisation d'identités |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les erreurs et reprises s'appuient sur les mêmes mécanismes |

### 5. Application pratique

**Situation initiale.** La compagnie veut que les qualifications des techniciens, tenues dans le système des ressources humaines, soient disponibles dans la plateforme pour les contrôles d'éligibilité (voir [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité)).

**Problème.** La saisie manuelle dans les deux systèmes crée des écarts, et une qualification expirée reste valide dans la plateforme.

**Application du concept.** Une synchronisation à sens unique, du système RH vers la plateforme, avec le système RH comme référence.

**Déroulé.**

1. Un chargement initial importe les 2 000 techniciens et leurs qualifications, avec table de références croisées.
2. Toutes les 15 minutes, une synchronisation incrémentale récupère les changements (par journal du système RH).
3. Les qualifications sont des champs en lecture seule dans la plateforme.
4. Une qualification retirée est propagée comme suppression ; la plateforme la désactive.
5. Une réconciliation nocturne compare les comptages et signale les écarts.

**Résultat.** Les contrôles d'éligibilité s'appuient sur des qualifications à jour, sans double saisie.

**Limites.** Le délai de 15 minutes est acceptable pour la plupart des cas ; pour une révocation urgente, un événement immédiat complète la synchronisation périodique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre ETL et ELT ?
2. **Compréhension.** Pourquoi faut-il propager les suppressions explicitement ?
3. **Compréhension.** Comment évite-t-on les boucles dans une synchronisation bidirectionnelle ?
4. **Pourquoi.** Pourquoi prévoit-on une réconciliation périodique ?
5. **Raisonnement pratique.** Deux systèmes peuvent modifier le même champ. Quelle règle de conception proposez-vous ?

#### Réponses

1. En ETL, la transformation précède le chargement ; en ELT, on charge les données brutes puis on les transforme dans la cible.
2. Parce qu'une absence ne dit pas si l'objet a été supprimé ou n'a pas changé : sans marque de suppression, les systèmes divergent.
3. Par une marque d'origine sur les changements, une comparaison avant écriture, et l'exclusion des changements produits par l'intégration elle-même.
4. Parce que des événements ou des changements peuvent être perdus ou manqués : la réconciliation détecte et corrige les écarts résiduels.
5. Désigner un système de référence par champ, et rendre le champ en lecture seule dans l'autre système, plutôt que de laisser les deux écrire.

## 10.11 Systèmes externes et système de référence

### 1. Comprendre simplement

Les **systèmes externes** (*external systems*) sont les systèmes d'information, extérieurs à la plateforme, qu'utilise l'organisation cliente : ERP, gestion des ressources humaines, comptabilité, systèmes réglementaires, outils métier spécialisés. Le **système de référence** (*system of record*, *SoR*) est le système désigné comme **l'autorité** pour une donnée : en cas de désaccord, c'est lui qui a raison.

**Pourquoi cela existe.** Une organisation a rarement un seul système. La même donnée (un employé, un aéronef, un fournisseur) apparaît dans plusieurs. Sans désignation claire, chaque système prétend détenir la vérité, les copies divergent, et personne ne sait laquelle croire.

**Problème résolu.** Donner à chaque donnée un propriétaire unique, pour que les copies soient identifiées comme telles et que les échanges aient un sens.

**Modèle mental.** L'état civil. Le registre officiel est la référence ; les extraits et les copies, aussi nombreux soient-ils, en dérivent. Si un extrait contredit le registre, c'est l'extrait qui est faux.

**Où l'analogie s'arrête.** Un registre d'état civil est unique pour tout un pays. Dans une organisation, la référence dépend de la donnée : un système pour les employés, un autre pour les pièces, un autre pour la navigabilité.

**Exemple.** La qualification d'un technicien a pour référence le système des ressources humaines. L'immatriculation d'un aéronef a pour référence le registre officiel. Les tâches de maintenance ont pour référence la plateforme.

**Les composants.**

1. un **inventaire** des systèmes et de leurs données ;
2. une **attribution** de l'autorité par donnée ;
3. des **stratégies d'intégration** (copie, référence, interrogation) ;
4. une **règle** de résolution des écarts ;
5. une **traçabilité** de l'origine.

**Objectif d'apprentissage :** vous pouvez désigner un système de référence par donnée, choisir une stratégie d'intégration et traiter l'indisponibilité de la référence.

### 2. Connaissances essentielles

#### Définition

- **Système externe** : système d'information extérieur à la plateforme avec lequel elle échange des données ou dont elle dépend.
- **Système de référence** : système désigné comme source faisant autorité pour une donnée ou un ensemble de données ; les autres systèmes en détiennent des copies ou des références.

#### Idées fondamentales

1. **L'autorité est attribuée par donnée.** Pas par système : un même système peut être la référence pour certaines données et pas pour d'autres.
2. **Une seule référence par donnée.** Deux références concurrentes produisent des conflits.
3. **Les copies sont identifiées comme telles.** Leur origine et leur fraîcheur sont connues.
4. **La stratégie dépend de l'usage.** Copier, référencer, interroger à la demande.
5. **La référence peut être indisponible.** Le comportement dégradé est prévu.
6. **La plateforme est la référence de ce qu'elle produit.** Processus, décisions, configurations.

#### Vocabulaire essentiel

- **Source de vérité** (*source of truth*, *golden source*) : autre nom du système de référence.
- **Gestion des données de référence** (*master data management*, *MDM*) : discipline de maîtrise des données partagées.
- **Copie locale** (*replica*, *cache*) : exemplaire d'une donnée dont l'autorité est ailleurs.
- **Fédération** (*federation*) : interrogation du système source à la demande, sans copie.
- **Propriété d'une donnée** (*data ownership*) : responsabilité d'une équipe ou d'un système sur une donnée.
- **Provenance** (*provenance*, *lineage*) : origine et parcours d'une donnée.
- **Mode dégradé** (*degraded mode*) : fonctionnement limité quand une dépendance est indisponible.

#### Relations de cause à effet

- Deux systèmes peuvent modifier la même donnée sans référence désignée. Les valeurs divergent, et la réconciliation devient un travail manuel permanent.
- Une copie n'est pas identifiée comme telle. Les utilisateurs la modifient localement, et la prochaine synchronisation l'écrase.
- La référence est indisponible et aucune stratégie n'est prévue. Les processus qui en dépendent s'arrêtent.

#### Idées reçues

- **« Le système le plus récent doit être la référence. »** Non. L'autorité tient à la responsabilité et à la qualité de la donnée, pas à la modernité du système.
- **« Il faut tout centraliser dans la plateforme. »** Pas nécessairement : respecter la référence existante est souvent plus sûr que la déplacer.
- **« Une copie à jour vaut la référence. »** Elle peut être à jour, mais elle n'a pas autorité : en cas d'écart, la référence gagne.

#### Principe clé

Pour chaque donnée, un seul système a autorité ; les autres la reçoivent, la référencent ou l'interrogent, et le savent.

#### Si vous ne retenez que trois choses

1. Le système de référence est désigné par donnée, et il est unique.
2. Les autres systèmes copient, référencent ou interrogent, avec une origine connue.
3. La plateforme prévoit le comportement quand la référence est indisponible.

### 3. Explication technique détaillée

#### Un tableau d'autorité

| Donnée | Système de référence | Dans la plateforme | Stratégie |
|---|---|---|---|
| Immatriculation officielle d'un aéronef | Registre réglementaire externe | Copie en lecture seule | Synchronisation périodique, contrôle à la saisie |
| Qualifications des techniciens | Système RH | Copie en lecture seule | Synchronisation incrémentale (voir [10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export)) |
| Tâches de maintenance | Plateforme | Référence | Export vers l'ERP |
| Stock de pièces | ERP | Référence par identifiant | Interrogation à la demande |
| Décisions d'approbation | Plateforme | Référence | Journal d'audit, export |
| Identité des utilisateurs | Annuaire du client | Copie synchronisée (SCIM) | Voir [4.12 SCIM](04-identite-iam-autorisation.md#412-scim) |

#### Les stratégies d'intégration

| Stratégie | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Copier | Répliquer la donnée dans la plateforme | Rapide, disponible hors ligne | Fraîcheur, synchronisation, stockage |
| Référencer | Stocker uniquement l'identifiant externe | Aucune duplication | Dépend de la disponibilité, affichage à résoudre |
| Interroger à la demande (fédérer) | Appeler le système source au moment de l'usage | Toujours à jour | Latence, dépendance forte |
| Recevoir par événements | Le système source publie ses changements | Frais, découplé | Perte possible, besoin de réconciliation |

#### Le champ qui sait d'où il vient

```json
{
  "type": "technician",
  "fields": [
    { "api_name": "full_name", "source_of_truth": "external:hr", "editable": false },
    { "api_name": "qualifications", "source_of_truth": "external:hr", "editable": false,
      "sync": { "mode": "incremental", "max_staleness": "PT15M" } },
    { "api_name": "preferred_base", "source_of_truth": "platform", "editable": true }
  ]
}
```

**Comment le lire.** Le nom et les qualifications viennent du système RH, en lecture seule, avec un retard maximal de 15 minutes. La base préférée appartient à la plateforme.

#### L'affichage de la provenance

L'interface indique pour les données copiées : « Source : système RH · mis à jour il y a 7 minutes ». Cela évite qu'un utilisateur modifie une valeur qu'il ne peut pas changer, ou se fie à une donnée périmée.

#### L'indisponibilité de la référence

| Stratégie | Comportement |
|---|---|
| Copie locale | La plateforme fonctionne avec la dernière valeur, signalée « non vérifiée depuis… » |
| Référence par identifiant | Les écrans affichent l'identifiant ; les actions qui exigent la donnée sont suspendues |
| Interrogation à la demande | Délai, reprise, puis dégradation maîtrisée (voir [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)) |
| Contrôle bloquant | Une qualification non vérifiable : refus par défaut pour les actions critiques |

#### Les règles de conception

- **Documenter** l'autorité de chaque donnée, comme une métadonnée.
- **Rendre en lecture seule** les copies dont l'autorité est ailleurs.
- **Mesurer** le retard de chaque copie et en fixer un maximum.
- **Prévoir** la reprise après une période d'indisponibilité (rattrapage, réconciliation).
- **Éviter** de créer dans la plateforme de nouveaux identifiants pour des objets déjà identifiés ailleurs.

**Contre-exemple.** Une fiche d'aéronef dont l'immatriculation est modifiable à la fois dans la plateforme et dans l'ERP, avec une synchronisation bidirectionnelle. Deux utilisateurs la corrigent chacun de leur côté ; les deux systèmes se mettent mutuellement à jour, et personne ne sait laquelle est la bonne.

**Limites.** Désigner des références ne règle pas la qualité des données : une référence peut être inexacte. La gouvernance des données (responsables, contrôles de qualité) est une activité à part entière.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.10 Synchronisation, ETL, import et export](#1010-synchronisation-etl-import-et-export) | La synchronisation applique l'attribution d'autorité |
| [10.9 Connecteurs et adaptateurs](#109-connecteurs-et-adaptateurs) | Les connecteurs réalisent l'accès aux systèmes externes |
| [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | L'autorité d'un champ est une métadonnée |
| [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive) | La dégradation maîtrisée traite l'indisponibilité de la référence |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Un contexte délimité a sa propre autorité sur ses concepts |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | Les copies sont cohérentes à terme |

### 5. Application pratique

**Situation initiale.** Les techniciens sont saisis dans le système RH et dans la plateforme. Les qualifications y sont maintenues séparément, et les écarts sont fréquents.

**Problème.** Un technicien dont la qualification a expiré est encore affecté à des tâches moteur.

**Application du concept.** Le système RH est désigné référence ; la plateforme en reçoit une copie en lecture seule.

**Déroulé.**

1. L'équipe documente l'autorité : qualifications, statut, base d'attache viennent du système RH.
2. Les champs correspondants deviennent non modifiables dans la plateforme, avec l'indication de leur source.
3. Une synchronisation incrémentale les met à jour toutes les 15 minutes.
4. Les contrôles d'éligibilité utilisent la copie ; une copie plus ancienne que 24 h bloque les actions critiques.
5. Les modifications de qualifications se font désormais uniquement dans le système RH.

**Résultat.** Les écarts disparaissent, et l'éligibilité est fondée sur une source unique.

**Limites.** Les corrections urgentes dans le système RH mettent jusqu'à 15 minutes à arriver : un déclenchement immédiat par événement est prévu pour les retraits de qualification.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un système de référence ?
2. **Compréhension.** Citez trois stratégies d'intégration d'une donnée externe.
3. **Compréhension.** Pourquoi les copies d'une donnée externe doivent-elles être en lecture seule ?
4. **Pourquoi.** Pourquoi attribue-t-on l'autorité par donnée plutôt que par système ?
5. **Raisonnement pratique.** Que faire quand le système de référence est indisponible ?

#### Réponses

1. Le système désigné comme autorité pour une donnée : en cas de désaccord entre systèmes, sa valeur prévaut.
2. Copier, référencer par identifiant, interroger à la demande, ou recevoir par événements.
3. Pour éviter que des modifications locales soient écrasées à la synchronisation suivante, et que deux systèmes se contredisent.
4. Parce qu'un même système peut faire autorité pour certaines données et pas pour d'autres : l'autorité dépend de la responsabilité sur chaque donnée.
5. Appliquer un mode dégradé prévu : utiliser la dernière copie en la signalant, suspendre les actions qui exigent la donnée, ou refuser par défaut les actions critiques.

## 10.12 Plugins, extensions et modules personnalisés

### 1. Comprendre simplement

Un **plugin** (ou **extension**, *extension*) est un **paquet de code** qui ajoute une fonction à la plateforme, **sans en modifier le cœur**, en s'appuyant sur des points d'extension prévus. Un **module personnalisé** (*custom module*) est un ensemble plus large (types de données, workflows, écrans, logique) construit pour un tenant ou pour un secteur.

**Pourquoi cela existe.** La configuration atteint ses limites : une règle de calcul spécifique, une intégration particulière, un contrôle propre à un métier. Plutôt que d'ajouter chaque besoin au produit, la plateforme laisse le client ou un partenaire apporter son code, dans un cadre contrôlé.

**Problème résolu.** Étendre la plateforme au-delà de la configuration, sans compromettre la stabilité, la sécurité ni l'isolation entre tenants.

**Modèle mental.** Les extensions d'un navigateur ou les applications d'un téléphone : le système fournit un cadre et des interfaces, des tiers ajoutent des fonctions, et le système les isole et les limite.

**Où l'analogie s'arrête.** Une extension de navigateur n'est installée que sur votre poste. Un plugin de plateforme s'exécute chez le fournisseur, à côté du code de tous les autres clients : sécurité et ressources y sont critiques.

**Exemple.** Un plugin de calcul d'ordonnancement s'insère comme « action personnalisée » dans les workflows du tenant. Un autre ajoute un type de champ « coordonnées géographiques » avec un composant de saisie.

**Les composants.**

1. des **points d'extension** documentés ;
2. un **manifeste** qui déclare le plugin et ses permissions ;
3. un **environnement d'exécution isolé** ;
4. un **cycle de vie** (installation, activation, mise à jour, retrait) ;
5. une **supervision** par plugin.

**Objectif d'apprentissage :** vous pouvez décrire les modèles d'exécution d'un plugin et les mesures qui protègent la plateforme de son code.

### 2. Connaissances essentielles

#### Définition

- **Plugin** ou **extension** : composant logiciel tiers, chargé par la plateforme, qui s'exécute dans un cadre défini et accède à la plateforme par des interfaces explicitement exposées.
- **Module personnalisé** : ensemble cohérent de ressources, de logique et d'interface, propre à un tenant ou à un domaine, livré comme extension.

#### Idées fondamentales

1. **Le cœur reste intact.** Les plugins s'appuient sur des points d'extension stables.
2. **Un plugin déclare ce dont il a besoin.** Permissions, ressources, déclencheurs.
3. **Il s'exécute isolé.** Hors du processus principal, ou dans un bac à sable.
4. **Il est borné en ressources.** Temps, mémoire, appels.
5. **Il n'accède pas directement à la base.** Il passe par les interfaces de la plateforme, avec des droits limités.
6. **Il a un cycle de vie et un propriétaire.** Installation, mise à jour, retrait, support.

#### Vocabulaire essentiel

- **Point d'extension** (*extension point*, *hook*) : endroit prévu où un plugin peut intervenir.
- **Manifeste** (*manifest*) : description du plugin (identité, version, permissions, déclencheurs).
- **Bac à sable** (*sandbox*) : environnement d'exécution isolé et limité.
- **Isolat** (*isolate*) : unité d'isolation légère d'un moteur d'exécution.
- **WebAssembly** : format de code portable, exécutable dans un environnement isolé.
- **Capacité** (*capability*) : droit précis accordé au plugin (lire les aéronefs, appeler une adresse).
- **Chaîne d'approvisionnement** (*supply chain*) : ensemble des dépendances logicielles d'un plugin.

#### Relations de cause à effet

- Un plugin s'exécute dans le processus principal. Une erreur ou une boucle infinie arrête la plateforme pour tous les tenants.
- Un plugin accède directement à la base. Il peut lire des données d'autres tenants ou contourner les règles.
- Un plugin est mis à jour sans test de compatibilité. Une évolution de la plateforme ou du plugin casse les workflows qui en dépendent.

#### Idées reçues

- **« Un plugin est du code de confiance. »** Non. C'est du code de tiers, à traiter comme potentiellement défaillant ou malveillant.
- **« Plus la plateforme est extensible, mieux c'est. »** Chaque point d'extension est un contrat à maintenir et une surface d'attaque.
- **« Isoler un plugin, c'est le lancer dans un autre processus. »** C'est un début. Il faut aussi limiter ses ressources, ses accès réseau et ses droits.

#### Principe clé

Traitez un plugin comme du code étranger : isolé, borné, aux droits minimaux, observable et révocable.

#### Si vous ne retenez que trois choses

1. Les plugins étendent la plateforme par des points d'extension stables, sans toucher au cœur.
2. Isolation, limites de ressources et droits minimaux protègent la plateforme et les autres tenants.
3. Chaque plugin a un manifeste, un cycle de vie et une supervision.

### 3. Explication technique détaillée

#### Les modèles d'exécution

| Modèle | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Dans le processus | Le code est chargé dans le moteur | Très rapide | Risqué : une erreur affecte tout |
| Bac à sable embarqué (isolat, WebAssembly) | Exécution isolée et limitée dans le moteur | Rapide, bien borné | Capacités limitées, outillage |
| Hors processus (conteneur, fonction) | Le plugin tourne séparément, appelé à distance | Isolation forte | Latence, coût |
| Distant chez le tiers (webhook, service du partenaire) | La plateforme appelle un service externe | Aucun code étranger chez le fournisseur | Dépendance, latence, disponibilité |

Le choix dépend du degré de confiance, du besoin de performance et du coût d'exploitation.

#### Un manifeste

```json
{
  "id": "acme.scheduling-optimizer",
  "name": "Optimiseur d'ordonnancement",
  "version": "1.3.0",
  "publisher": "Acme Aero Software",
  "extension_points": [
    { "type": "workflow.action", "key": "optimize_schedule",
      "input_schema": "schemas/optimize-input.json",
      "output_schema": "schemas/optimize-output.json" }
  ],
  "permissions": [
    { "resource": "aircraft", "actions": ["read"] },
    { "resource": "maintenance_task", "actions": ["read", "update"] }
  ],
  "network": { "allow": ["api.acme-aero.example"] },
  "limits": { "timeout": "PT10S", "memory": "128MB", "calls_per_minute": 600 },
  "runtime": { "type": "sandbox", "language": "wasm" }
}
```

**Comment le lire.** Le plugin ajoute une action de workflow, déclare ses entrées et sorties, demande des droits précis, n'a le droit d'appeler qu'une adresse externe, et reçoit des limites de temps, de mémoire et d'appels.

#### L'exécution contrôlée

```text
Workflow (tenant T) ──► appelle l'action « optimize_schedule »
         │
         ▼
Hôte de plugins :
   1. vérifie que le plugin est installé et actif pour T
   2. émet un jeton à portée limitée (permissions du manifeste ∩ droits du tenant)
   3. lance l'exécution isolée avec les limites
   4. l'appel à la plateforme passe par l'API (avec le jeton), jamais par la base
   5. mesure temps, mémoire, appels ; coupe si dépassement
   6. journalise (plugin, version, tenant, durée, résultat)
         │
         ▼
Résultat validé contre le schéma de sortie, puis rendu au workflow
```

#### Les mesures de protection

| Risque | Mesure |
|---|---|
| Boucle infinie, consommation excessive | Délai maximal, quota de mémoire et de calcul |
| Accès à des données interdites | Jeton limité, accès par API uniquement, isolation par tenant |
| Exfiltration vers l'extérieur | Liste d'adresses réseau autorisées |
| Plugin malveillant ou compromis | Examen, signature, analyse des dépendances, désactivation à distance |
| Panne du plugin | Disjoncteur, repli, absence d'effet sur les autres tenants |
| Incompatibilité après mise à jour | Contrats versionnés, tests de compatibilité, déploiement progressif |

#### Le cycle de vie

```text
Soumis ─► Examiné ─► Publié ─► Installé (par un tenant) ─► Activé ─► Mis à jour ─► Désactivé ─► Désinstallé
                         │              │ consentement aux permissions        │ période de grâce
                         └── retiré (kill switch) en cas de problème
```

#### La supervision par plugin

| Indicateur | Utilité |
|---|---|
| Taux d'erreurs, durée, dépassements de limites | Santé du plugin |
| Consommation (temps, appels) par tenant | Facturation, équité |
| Version installée par tenant | Compatibilité |
| Journal d'exécution | Diagnostic (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)) |

**Contre-exemple.** Un plugin chargé dans le processus du moteur de ressources, avec accès à la connexion de base de données. Un bogue dans une boucle d'un plugin d'un tenant bloque le moteur pour tous les tenants.

**Limites.** L'isolation a un coût en performance et en complexité. On l'applique de façon proportionnée : un plugin qui n'appelle que des API externes signées n'a pas les mêmes exigences qu'un plugin qui exécute du code dans la plateforme.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire) | Les points d'extension sont un élément de l'architecture de plateforme |
| [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) | Le langage d'expressions renvoie ici quand il ne suffit plus |
| [10.9 Connecteurs et adaptateurs](#109-connecteurs-et-adaptateurs) | Les connecteurs sont souvent livrés comme plugins |
| [10.14 Marketplace](#1014-marketplace) | La marketplace distribue les plugins |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Elle illustre la frontière entre configuration et code |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces traite l'exécution de code tiers |

### 5. Application pratique

**Situation initiale.** La compagnie a un algorithme d'ordonnancement propriétaire qui répartit les inspections selon des contraintes que ni les règles ni les tables de décision n'expriment.

**Problème.** Il ne peut pas être exprimé en configuration, et le fournisseur ne veut pas l'intégrer au produit.

**Application du concept.** Un plugin d'action de workflow, exécuté dans un bac à sable avec des droits limités.

**Déroulé.**

1. Le partenaire développe le plugin selon le contrat de point d'extension `workflow.action`.
2. Le fournisseur l'examine, le signe et le publie.
3. L'administrateur de la compagnie l'installe, examine les permissions demandées et les accepte.
4. Il ajoute l'action à son workflow de planification.
5. À chaque exécution, l'hôte l'isole, le limite à 10 secondes et à 128 Mo, et journalise.

**Résultat.** La compagnie intègre sa logique propriétaire sans modifier le produit ni affecter les autres clients.

**Limites.** Si la compagnie veut que le plugin accède à de nouvelles données, elle doit passer par une mise à jour du manifeste et un nouveau consentement.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un point d'extension ?
2. **Compréhension.** Que contient un manifeste de plugin ?
3. **Compréhension.** Pourquoi un plugin n'accède-t-il pas directement à la base de données ?
4. **Pourquoi.** Pourquoi borne-t-on le temps et la mémoire d'un plugin ?
5. **Raisonnement pratique.** Un plugin est suspecté d'envoyer des données à l'extérieur. Quelles mesures auraient pu l'empêcher ?

#### Réponses

1. Un endroit prévu de la plateforme où un plugin peut intervenir, avec un contrat stable.
2. L'identité et la version, les points d'extension utilisés, les permissions, les accès réseau autorisés et les limites de ressources.
3. Pour éviter qu'il contourne les droits, les règles et l'isolation entre tenants : il passe par l'API avec un jeton à portée limitée.
4. Pour qu'une erreur ou un abus ne dégrade pas la plateforme ni les autres tenants.
5. Une liste d'adresses réseau autorisées, des droits minimaux, un examen avant publication et une supervision des appels sortants.

## 10.13 SDK et plateforme développeur

### 1. Comprendre simplement

Un **SDK** (*Software Development Kit*) est un **ensemble de bibliothèques et d'outils**, pour un langage donné, qui facilitent l'usage de l'API de la plateforme : authentification, reprises, pagination, types. La **plateforme développeur** (*developer platform*) est l'**offre complète** destinée aux développeurs : documentation, spécifications, SDK, environnements d'essai, outils en ligne de commande, gestion des clés et des applications, journaux, assistance.

**Pourquoi cela existe.** Une API ouverte n'est utile que si elle est facile à adopter. Un développeur qui doit lire des dizaines de pages, écrire l'authentification, la pagination et les reprises, ou qui ne dispose pas d'environnement d'essai, abandonne ou produit des intégrations fragiles.

**Problème résolu.** Réduire le coût et le délai d'intégration, améliorer la qualité des intégrations, et faire de l'écosystème un atout.

**Modèle mental.** Une boîte à outils, un atelier et une notice : l'outillage prêt à l'emploi, un lieu pour essayer sans risque, et une documentation qui guide.

**Où l'analogie s'arrête.** Une boîte à outils est livrée une fois. Une plateforme développeur évolue avec l'API, et ses SDK et sa documentation doivent suivre sans divergence.

**Exemple.** Un développeur de partenaire installe le SDK, s'authentifie, crée un tenant d'essai avec des données synthétiques, appelle l'API en dix lignes, et consulte le journal de ses requêtes.

**Les composants.**

1. une **spécification** de l'API ;
2. des **SDK** par langage ;
3. une **documentation** (référence, guides, exemples) ;
4. un **environnement d'essai** ;
5. des **outils** (CLI, console de développeur) ;
6. un **support** et une **communication** (journal des changements, état du service).

**Objectif d'apprentissage :** vous pouvez décrire ce que contient une plateforme développeur et comment un SDK est produit et maintenu.

### 2. Connaissances essentielles

#### Définition

- **SDK** : bibliothèque et outils fournis pour un langage ou une plateforme afin de simplifier l'intégration avec une API ou un système.
- **Plateforme développeur** : ensemble coordonné de ressources, d'outils et de services destinés à permettre à des développeurs d'intégrer, d'étendre et de construire sur la plateforme.

#### Idées fondamentales

1. **L'API est le produit des développeurs.** Son ergonomie est une fonction du produit.
2. **Les SDK sont dérivés de la spécification.** Générés, puis soignés par langage.
3. **Le SDK prend en charge les détails ennuyeux.** Authentification, reprises, pagination, idempotence.
4. **Un environnement d'essai est indispensable.** On essaie sans risque, avec des données synthétiques.
5. **La documentation est un produit.** Référence, guides par cas d'usage, exemples exécutables.
6. **La mesure guide.** Temps jusqu'au premier appel réussi, erreurs fréquentes, abandon.

#### Vocabulaire essentiel

- **Générateur de code client** (*client generator*) : outil qui produit un SDK à partir d'une spécification (OpenAPI).
- **Environnement d'essai** (*sandbox*) : tenant ou instance de test, avec données synthétiques.
- **Interface en ligne de commande** (*CLI*) : outil d'usage de la plateforme depuis un terminal.
- **Temps jusqu'au premier appel** (*time to first call*, *TTFC*) : durée entre l'inscription et le premier appel réussi.
- **Journal des changements** (*changelog*) : liste des évolutions de l'API et des SDK.
- **Versionnement sémantique** (*semantic versioning*) : numérotation `majeur.mineur.correctif` qui signale les ruptures.
- **Console développeur** (*developer console*) : interface de gestion des applications, clés et journaux.

#### Relations de cause à effet

- Les SDK sont écrits à la main par langage. Ils divergent de l'API, prennent du retard et contiennent des erreurs.
- Il n'y a pas d'environnement d'essai. Les développeurs testent en production, avec des risques pour les données.
- La documentation n'est pas mise à jour avec l'API. Les développeurs sont induits en erreur, et le support est saturé.

#### Idées reçues

- **« Un bon SDK cache l'API. »** Il la rend plus pratique, sans empêcher d'y accéder directement pour les cas non couverts.
- **« Générer un SDK suffit. »** Le code généré est un point de départ. Les conventions idiomatiques, la gestion des erreurs et les exemples demandent du soin.
- **« La documentation est l'affaire des rédacteurs. »** Elle dépend des équipes qui conçoivent l'API : une API incohérente ne se documente pas bien.

#### Principe clé

Chaque obstacle entre un développeur et son premier appel réussi est un coût d'adoption ; la plateforme développeur existe pour les supprimer.

#### Si vous ne retenez que trois choses

1. Un SDK simplifie l'usage de l'API ; la plateforme développeur rassemble tout ce qui facilite l'intégration.
2. SDK et documentation sont produits à partir de la spécification, et suivent ses versions.
3. Un environnement d'essai et des journaux de requêtes sont des fonctions de base.

### 3. Explication technique détaillée

#### Le contenu d'une plateforme développeur

| Élément | Contenu | Question à laquelle il répond |
|---|---|---|
| Spécification | OpenAPI par tenant, schémas d'événements | Que puis-je appeler ? |
| Référence | Chaque endpoint, paramètre, erreur | Comment fonctionne ceci ? |
| Guides | Cas d'usage (créer un aéronef, synchroniser) | Comment atteindre mon objectif ? |
| SDK | Bibliothèques par langage | Comment l'appeler simplement ? |
| Exemples et modèles | Applications d'exemple | Par où commencer ? |
| Environnement d'essai | Tenants de test, données synthétiques | Où essayer sans risque ? |
| Outils | CLI, console, générateurs | Comment automatiser ? |
| Visibilité | Journal des requêtes et des webhooks | Que s'est-il passé ? |
| Gouvernance | Journal des changements, calendrier de dépréciation | Qu'est-ce qui change ? |
| Support | Forum, assistance, état du service | Où demander de l'aide ? |

#### Ce que le SDK prend en charge

```typescript
import { Platform } from "@platform/sdk";

const client = new Platform({
  tenant: "airline-regional",
  auth: { clientId: process.env.PLATFORM_CLIENT_ID!, clientSecret: process.env.PLATFORM_SECRET! },
});

// Création idempotente : le SDK génère et réutilise la clé d'idempotence en cas de reprise
const aircraft = await client.aircraft.create({
  registration: "F-ABCD",
  model: "A320",
});

// Pagination par curseur masquée par un itérateur
for await (const a of client.aircraft.list({ status: "active", inspectionBefore: "2026-12-01" })) {
  console.log(a.registration, a.nextInspectionDate);
}

// Erreurs typées, avec reprises automatiques sur les erreurs passagères et les 429
try {
  await client.aircraft.transition(aircraft.id, "ground", { reason: "Inspection annuelle" });
} catch (e) {
  if (e instanceof PlatformConflictError) { /* garde échouée : e.guards */ }
}
```

**Ce que le SDK fait pour le développeur.**

1. **Authentification** : obtention et renouvellement des jetons.
2. **Reprises** avec temporisation et aléa (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)) et respect de `Retry-After`.
3. **Idempotence** : génération et réutilisation des clés.
4. **Pagination** : itération sans manipuler les curseurs.
5. **Types** : modèles et erreurs typés.
6. **Journalisation** : identifiants de requête pour le support.

#### La production des SDK

```text
Spécification OpenAPI (du tenant ou de la plateforme)
        │ générateur de code
        ▼
Code client de base (par langage)
        │ couche manuelle : conventions du langage, erreurs, reprises, exemples
        ▼
SDK publié (versionné sémantiquement, testé contre l'API réelle)
```

**Le défi des champs personnalisés.** Les types d'un tenant diffèrent. Deux approches : un SDK générique avec des champs dynamiques, ou un SDK **généré par tenant** à partir de sa spécification (types fortement typés pour ses champs).

#### L'environnement d'essai

| Caractéristique | Détail |
|---|---|
| Isolé | Aucune donnée de production |
| Rapide à créer | En quelques secondes, par la console ou l'API |
| Réaliste | Données synthétiques, modèle proche de la production |
| Réinitialisable | Retour à un état connu |
| Limité | Quotas pour éviter les abus |
| Parité | Même comportement que la production, indiqué clairement quand il diffère |

#### Les indicateurs de la plateforme développeur

| Indicateur | Ce qu'il révèle |
|---|---|
| Temps jusqu'au premier appel réussi | Qualité de l'onboarding |
| Taux d'erreurs par endpoint et par développeur | Points de friction de l'API |
| Recherches sans résultat dans la documentation | Lacunes de la documentation |
| Volume de tickets d'assistance par thème | Zones à clarifier |
| Adoption des versions de SDK | Rythme de migration |

**Contre-exemple.** Un SDK généré une fois en 2024 et jamais mis à jour, qui n'expose pas les nouveaux endpoints et ignore les en-têtes de dépréciation. Les développeurs contournent le SDK par des appels directs, avec des comportements incohérents.

**Limites.** Maintenir plusieurs SDK, une documentation et des environnements d'essai est un effort permanent. On choisit les langages les plus utilisés, on automatise la génération et les tests, et on dépriorise les autres.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](#101-api-et-rest) | Le SDK et la documentation dérivent de la spécification |
| [10.8 Versionnement d'API](#108-versionnement-dapi) | Les SDK suivent les versions et les dépréciations |
| [10.5 Authentification des API](#105-authentification-des-api) | Le SDK prend en charge l'authentification |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Il gère les clés d'idempotence |
| [10.14 Marketplace](#1014-marketplace) | La marketplace s'appuie sur la plateforme développeur |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | La console développeur recoupe l'administration technique |

### 5. Application pratique

**Situation initiale.** Les partenaires mettent en moyenne trois semaines à réaliser une première intégration, avec de nombreux tickets d'assistance sur l'authentification et la pagination.

**Problème.** Chaque développeur réécrit les mêmes mécanismes, avec des erreurs.

**Application du concept.** Lancement d'une plateforme développeur : SDK, tenant d'essai, guides par cas d'usage.

**Déroulé.**

1. L'équipe génère des SDK pour trois langages à partir de la spécification, avec une couche d'ergonomie.
2. Elle ajoute un tenant d'essai créé en un clic, avec des données synthétiques.
3. Elle publie trois guides (créer des aéronefs, synchroniser, recevoir des webhooks), avec des exemples exécutables.
4. Elle mesure le temps jusqu'au premier appel : il passe de trois jours à quarante minutes.
5. Les tickets sur l'authentification et la pagination diminuent de 70 %.

**Résultat.** Les intégrations sont plus rapides et plus fiables, et le support se concentre sur les cas réellement difficiles.

**Limites.** Chaque évolution de l'API demande de mettre à jour les SDK, les guides et les exemples : sans automatisation, la dérive revient.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que prend en charge un SDK pour le développeur ?
2. **Compréhension.** Quelle est la différence entre un SDK et une plateforme développeur ?
3. **Compréhension.** Pourquoi faut-il un environnement d'essai ?
4. **Pourquoi.** Pourquoi les SDK sont-ils produits à partir de la spécification ?
5. **Raisonnement pratique.** Quel indicateur permet d'évaluer la qualité de l'accueil des développeurs ?

#### Réponses

1. Par exemple : l'authentification, les reprises, la pagination, l'idempotence, les types et la journalisation.
2. Le SDK est une bibliothèque pour un langage ; la plateforme développeur englobe la documentation, les spécifications, les SDK, les environnements d'essai, les outils, la visibilité et l'assistance.
3. Pour essayer et tester sans risque pour les données de production, avec des données synthétiques.
4. Pour qu'ils restent fidèles à l'API et à ses versions, et pour réduire les divergences et le travail de maintenance.
5. Le temps jusqu'au premier appel réussi, entre l'inscription et un premier appel fonctionnel.

## 10.14 Marketplace

### 1. Comprendre simplement

Une **marketplace** (« place de marché ») est un **catalogue** où des développeurs tiers publient des applications, des extensions, des connecteurs ou des modèles, et où les tenants les **découvrent, les installent et, éventuellement, les paient**.

**Pourquoi cela existe.** Une plateforme agnostique ne peut pas offrir toutes les fonctions de tous les métiers. En ouvrant un canal de distribution, elle permet à un écosystème de partenaires de construire des solutions verticales (une application de gestion de la fatigue des équipages, un connecteur vers un ERP) et aux clients de les trouver au même endroit.

**Problème résolu.** Étendre l'offre sans l'étendre dans le produit de base, avec un cadre de confiance : examen, consentement, facturation, retrait.

**Modèle mental.** Une boutique d'applications d'un téléphone : le système y publie des applications examinées, l'utilisateur les installe en acceptant des permissions, et le magasin peut en retirer une à distance.

**Où l'analogie s'arrête.** Une application installée sur un téléphone touche les données d'une personne. Une application de marketplace agit sur les données d'une organisation, souvent sensibles et réglementées, avec des conséquences contractuelles.

**Exemple.** La compagnie installe depuis la marketplace une application d'analyse de fatigue des équipages. L'installation lui montre les données qu'elle lit, et demande l'accord de l'administrateur.

**Les composants.**

1. un **catalogue** et sa recherche ;
2. un **format de paquet** (manifeste, permissions) ;
3. un **processus d'examen et de certification** ;
4. un **parcours d'installation** avec consentement ;
5. une **facturation** et un partage de revenus ;
6. des **mécanismes de retrait** et de contrôle.

**Objectif d'apprentissage :** vous pouvez décrire le parcours d'une application de sa publication à son retrait, et les contrôles qui protègent les tenants.

### 2. Connaissances essentielles

#### Définition

Une **marketplace** est un service de distribution, géré par le fournisseur de la plateforme, qui référence des applications et extensions tierces, encadre leur publication, leur installation et leur facturation, et applique des règles de confiance et de sécurité.

#### Idées fondamentales

1. **La confiance est le produit.** Le tenant installe parce qu'il fait confiance au catalogue.
2. **Chaque application est examinée.** Sécurité, qualité, conformité aux règles.
3. **Les permissions sont explicites.** L'administrateur voit et accepte ce que l'application demandera.
4. **L'installation est propre au tenant.** Chacun décide, et peut retirer.
5. **Le fournisseur peut retirer une application.** À distance, en cas de problème.
6. **La marketplace est aussi une relation commerciale.** Prix, essais, revenus, contrats.

#### Vocabulaire essentiel

- **Éditeur** (*publisher*, *vendor*) : le tiers qui développe et publie l'application.
- **Fiche** (*listing*) : présentation d'une application dans le catalogue.
- **Certification** (*certification*) : validation par le fournisseur d'un niveau de sécurité et de qualité.
- **Consentement** (*consent*) : accord de l'administrateur aux permissions demandées.
- **Partage de revenus** (*revenue share*) : répartition des recettes entre fournisseur et éditeur.
- **Interrupteur de retrait** (*kill switch*) : capacité à désactiver une application.
- **Sous-traitant** (*sub-processor*) : tiers qui traite des données personnelles pour le compte d'un responsable.

#### Relations de cause à effet

- Les applications sont publiées sans examen. Une application malveillante ou défaillante est installée par des centaines de tenants.
- Les permissions sont larges et opaques. L'administrateur accepte sans comprendre, et une application accède à des données dont elle n'a pas besoin.
- Il n'existe pas de moyen de retrait rapide. Une vulnérabilité découverte dans une application reste exploitable pendant des jours.

#### Idées reçues

- **« Une marketplace est un simple catalogue. »** C'est un dispositif de confiance : examen, consentement, facturation, retrait, assistance.
- **« L'examen garantit l'absence de défaut. »** Il réduit le risque ; il doit être complété par l'isolation, les droits minimaux et la surveillance.
- **« Le fournisseur n'est pas responsable de ce que font les applications tierces. »** Il porte une part de responsabilité de confiance et de conformité, selon le contrat et la loi.

#### Principe clé

Une marketplace n'est digne de confiance que si chaque application est examinée, installée avec des droits minimaux consentis, isolée et révocable.

#### Si vous ne retenez que trois choses

1. La marketplace étend l'offre par des applications tierces dans un cadre de confiance.
2. Examen, consentement aux permissions, isolation et retrait en sont les piliers.
3. Chaque tenant décide ce qu'il installe et peut le retirer.

### 3. Explication technique détaillée

#### Le paquet d'une application

```json
{
  "app_id": "acme.crew-fatigue",
  "name": "Analyse de fatigue des équipages",
  "publisher": { "name": "Acme Aero Software", "verified": true },
  "version": "2.1.0",
  "category": "safety",
  "requested_permissions": [
    { "resource": "flight", "actions": ["read"], "reason": "Calcul de l'amplitude des vacations" },
    { "resource": "technician", "actions": ["read"], "fields": ["full_name", "base"],
      "reason": "Association des vacations aux personnes" }
  ],
  "extension_points": ["dashboard.widget", "workflow.action"],
  "pricing": { "model": "per_active_user", "unit_price_eur": 4.0, "trial_days": 30 },
  "data_processing": { "regions": ["eu"], "sub_processors": ["cloud-provider-x"], "retention_days": 90 },
  "support": { "url": "https://support.acme-aero.example", "sla": "next-business-day" }
}
```

#### Le parcours d'une application

```text
Éditeur ─► Soumission ─► Examen (sécurité, qualité, politiques) ─► Publication
                               │ échecs : retours à l'éditeur
Tenant ─► Découverte ─► Fiche (permissions, prix, données traitées) ─► Consentement de l'administrateur
       ─► Installation ─► Utilisation ─► Mises à jour ─► Désinstallation
Fournisseur ─► Surveillance ─► Retrait (désactivation à distance) si nécessaire
```

#### Ce que l'examen vérifie

| Domaine | Vérifications |
|---|---|
| Sécurité | Permissions minimales, gestion des secrets, dépendances, vulnérabilités connues |
| Données | Finalité, localisation, rétention, sous-traitants, respect de la protection des données |
| Qualité | Fiabilité, performances, expérience utilisateur, documentation |
| Conformité | Respect des règles de la marketplace, absence de pratiques trompeuses |
| Exploitation | Support, gestion des incidents, plan de fin de vie |

#### Les contrôles côté tenant

| Contrôle | Détail |
|---|---|
| Liste d'autorisation ou de refus | L'administrateur restreint les applications installables |
| Approbation des installations | Les utilisateurs demandent, les administrateurs approuvent |
| Revue des permissions | Liste des applications installées et de leurs accès |
| Droits à la mise à jour | Une mise à jour qui demande de nouvelles permissions exige un nouveau consentement |
| Désinstallation et effacement | Retrait de l'accès et suppression des données conservées par l'application |
| Journal | Actions des applications dans l'audit (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) |

#### L'isolation et les limites

Les applications s'exécutent selon les modèles de plugins (voir [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés)) ou comme services distants avec des jetons OAuth limités (voir [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20)). Elles sont soumises aux limites de débit et aux quotas par tenant (voir [10.6 Limitation de débit](#106-limitation-de-débit)).

#### Le retrait

```text
Alerte (vulnérabilité, abus, plainte)
   │
   ▼
Décision : suspendre l'application  ──► tous les jetons révoqués, extensions désactivées
   │
   ▼
Notification des administrateurs concernés, avec les actions recommandées
   │
   ▼
Analyse, correction par l'éditeur, nouvel examen, réactivation, ou retrait définitif
```

#### Les risques

| Risque | Exemple | Atténuation |
|---|---|---|
| Application malveillante | Exfiltration de données | Examen, isolation, liste d'adresses, surveillance |
| Application mal conçue | Sature l'API | Limites, quotas, isolation |
| Abus de permissions | Lecture de données non nécessaires | Permissions minimales, consentement, revue |
| Compromission de l'éditeur | Mise à jour piégée | Examen des mises à jour, signature, surveillance |
| Abandon | Éditeur disparu, application non maintenue | Statuts de maintenance, avertissements, plan de fin de vie |
| Atteinte à la vie privée | Sous-traitance non déclarée | Déclaration obligatoire, contrats |

**Contre-exemple.** Une marketplace où n'importe qui publie une application avec une demande de permission unique « accès complet à toutes les données du tenant », sans examen ni consentement détaillé. Une seule application malveillante compromet des dizaines de clients, et la confiance dans la plateforme est détruite.

**Limites.** L'examen a un coût et un délai, qui freinent les éditeurs. On propose des niveaux (applications vérifiées, certifiées) et on automatise une grande partie des contrôles.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés) | Les applications s'appuient sur les modèles de plugins |
| [10.13 SDK et plateforme développeur](#1013-sdk-et-plateforme-développeur) | Les éditeurs utilisent la plateforme développeur |
| [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20) | Le consentement utilise OAuth et ses périmètres |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration technique liste les applications connectées |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | La facturation et les droits d'usage encadrent l'accès aux offres |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces couvre les applications tierces |

### 5. Application pratique

**Situation initiale.** Une société aéronautique veut proposer son application d'analyse de fatigue aux compagnies clientes de la plateforme.

**Problème.** Les compagnies exigent des garanties sur les données traitées, et le fournisseur doit protéger ses tenants.

**Application du concept.** Publication par la marketplace avec examen, consentement et isolation.

**Déroulé.**

1. L'éditeur soumet l'application avec son manifeste et sa déclaration de traitement de données.
2. L'examen vérifie les permissions (lecture seule des vols et des noms), les dépendances et la localisation en Union européenne.
3. L'application est publiée avec le badge « vérifiée ».
4. L'administrateur de la compagnie examine la fiche, accepte les permissions et installe.
5. L'application s'exécute avec un jeton limité à la lecture des vols de son tenant ; ses appels sont audités et soumis aux limites de débit.

**Résultat.** La compagnie dispose d'une fonction spécialisée avec des garanties claires, et le fournisseur maintient le contrôle.

**Limites.** Si l'éditeur change de sous-traitant, il doit le déclarer ; une nouvelle version avec des permissions étendues exige un nouveau consentement.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la fonction d'une marketplace pour une plateforme agnostique ?
2. **Compréhension.** Pourquoi les permissions demandées par une application sont-elles affichées à l'administrateur ?
3. **Compréhension.** À quoi sert un interrupteur de retrait ?
4. **Pourquoi.** Pourquoi une mise à jour qui demande de nouvelles permissions exige-t-elle un nouveau consentement ?
5. **Raisonnement pratique.** Une vulnérabilité est découverte dans une application installée chez 300 tenants. Que fait le fournisseur ?

#### Réponses

1. Étendre l'offre par des solutions tierces, notamment verticales, sans les intégrer au produit de base, dans un cadre de confiance.
2. Pour que l'administrateur décide en connaissance de cause de ce à quoi l'application aura accès.
3. À désactiver à distance une application défaillante ou dangereuse, en révoquant ses accès.
4. Parce que le consentement initial ne couvre que les permissions acceptées : étendre l'accès sans accord reviendrait à contourner la décision du tenant.
5. Il suspend l'application (jetons révoqués, extensions désactivées), prévient les administrateurs concernés, et n'autorise la réactivation qu'après correction et nouvel examen.

## 10.15 Interface personnalisée et workflows personnalisés

### 1. Comprendre simplement

L'**interface personnalisée** (*custom UI*) désigne les éléments d'interface définis par un tenant ou un partenaire et intégrés à la plateforme : pages, widgets, composants de formulaire, tableaux de bord, applications embarquées. Les **workflows personnalisés** (*custom workflows*) sont des processus construits par un tenant ou un partenaire avec des étapes, des déclencheurs et des actions **qui ne font pas partie du catalogue standard**.

**Pourquoi cela existe.** Les vues, formulaires et workflows configurables (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) et [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement)) couvrent la majorité des besoins. Il reste un « dernier kilomètre » : un écran très spécifique, un composant de saisie particulier, une étape de processus propre à un métier. Plutôt que d'ajouter chaque besoin au produit, la plateforme permet de les construire par l'extension.

**Problème résolu.** Répondre aux besoins d'interface et de processus qui sortent du standard, sans compromettre la cohérence, la sécurité et la capacité d'évolution de la plateforme.

**Modèle mental.** Les accessoires d'une cuisine équipée : le caisson standard est livré, et l'on ajoute des modules sur mesure qui s'insèrent dans des emplacements prévus, sans abattre les murs.

**Où l'analogie s'arrête.** Un module de cuisine est inerte. Une interface personnalisée exécute du code dans le navigateur de l'utilisateur, au milieu des données de la plateforme : sécurité, cohérence et performance sont en jeu.

**Exemple.** La compagnie ajoute un widget « Carte des aéronefs au sol » sur son tableau de bord, et une étape de workflow « Calcul de l'impact opérationnel » qui appelle son propre service.

**Les composants.**

1. des **emplacements d'extension** d'interface ;
2. un **modèle d'isolation** (iframe, composants isolés) ;
3. des **étapes et déclencheurs** personnalisés pour les workflows ;
4. une **API d'extension** stable ;
5. des **contrôles** de sécurité, de performance et de gouvernance.

**Objectif d'apprentissage :** vous pouvez décrire comment on intègre une interface tierce en sécurité, et comment on conçoit une étape de workflow personnalisée.

### 2. Connaissances essentielles

#### Définition

- **Interface personnalisée** : composants ou pages d'interface produits par un tenant ou un partenaire, hébergés ou référencés par la plateforme, et exécutés dans le cadre d'emplacements et de contrats d'extension.
- **Workflow personnalisé** : processus du tenant qui utilise, outre les étapes standard, des types d'étapes, de déclencheurs ou de conditions fournis par une extension.

#### Idées fondamentales

1. **Des emplacements prévus.** L'interface personnalisée s'insère dans des zones définies, pas partout.
2. **L'isolation est obligatoire.** Le code tiers ne doit pas lire la session de l'utilisateur ni modifier le reste de la page.
3. **L'interface passe par l'API.** Avec un jeton à portée limitée, jamais d'accès direct.
4. **Les composants respectent le système de conception.** Cohérence, accessibilité, thèmes.
5. **Les étapes personnalisées sont des appels contractuels.** Entrées et sorties typées, délais, reprises.
6. **Tout est versionné et gouverné.** Comme les autres configurations (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

#### Vocabulaire essentiel

- **Emplacement** (*slot*, *extension slot*) : zone de l'interface prévue pour un contenu tiers.
- **Cadre isolé** (*sandboxed iframe*) : fenêtre intégrée avec des droits restreints.
- **Échange de messages** (*postMessage*) : mécanisme de communication contrôlée entre la page hôte et un cadre.
- **Micro-interface** (*micro-frontend*) : fragment d'interface développé et déployé indépendamment.
- **Étape personnalisée** (*custom step*, *custom action*) : étape de workflow fournie par une extension.
- **Politique de sécurité du contenu** (*Content Security Policy*, *CSP*) : en-tête qui limite ce que la page peut charger et exécuter.
- **Système de conception** (*design system*) : bibliothèque de composants et de règles visuelles (voir [12.2 Design systems](12-produit-ux.md#122-design-systems)).

#### Relations de cause à effet

- Un composant tiers s'exécute dans la page principale. Il peut lire le jeton de session de l'utilisateur, ou modifier d'autres parties de l'interface.
- L'interface personnalisée accède aux API avec les droits de l'utilisateur sans limite. Une extension malveillante peut tout faire au nom de l'utilisateur.
- Les étapes personnalisées appellent un service lent sans délai. Les workflows s'accumulent en attente, et le moteur ralentit.

#### Idées reçues

- **« Une interface personnalisée est un simple composant de plus. »** C'est du code tiers dans le navigateur de vos utilisateurs : il demande l'isolation et la gouvernance d'un plugin.
- **« Le thème suffit à l'harmoniser. »** La cohérence demande aussi des comportements, des états, de l'accessibilité et de la performance.
- **« Une étape personnalisée peut faire ce qu'elle veut. »** Elle a des entrées et des sorties définies, un délai, une idempotence, et des effets contrôlés.

#### Principe clé

L'interface et les étapes de processus personnalisées s'insèrent par des contrats étroits, avec isolation, droits limités, délais et gouvernance.

#### Si vous ne retenez que trois choses

1. L'interface personnalisée s'insère dans des emplacements, de façon isolée, avec des droits limités.
2. Les étapes de workflow personnalisées sont des appels typés, bornés et idempotents.
3. Les deux sont versionnés, gouvernés et testés comme du code.

### 3. Explication technique détaillée

#### Les modèles d'intégration d'interface

| Modèle | Principe | Isolation | Cohérence visuelle | Cas |
|---|---|---|---|---|
| Configuration seule | Vues et formulaires configurés | Totale (aucun code) | Native | Cas courants |
| Composants dans des emplacements | Le tenant fournit des composants rendus à des emplacements | Moyenne à forte | Bonne, via le système de conception | Widgets, champs spéciaux |
| Cadre isolé (*iframe*) | Page externe intégrée, dialogue par messages | Forte | Faible à moyenne | Applications existantes, outils tiers |
| Micro-interfaces | Fragments intégrés au chargement | Variable | Bonne | Grandes équipes de partenaires |
| Application autonome via l'API | Application complète séparée | Totale | Propre à l'application | Portails, applications spécialisées |

#### Un emplacement et un composant

```json
{
  "extension": "acme.ground-map",
  "slot": "dashboard.widget",
  "title": "Aéronefs au sol",
  "entry": "https://widgets.acme-aero.example/ground-map/index.html",
  "isolation": "iframe",
  "iframe_sandbox": ["allow-scripts"],
  "requested_scopes": ["aircraft.read"],
  "size": { "min_height": 240 },
  "csp": { "connect-src": ["https://widgets.acme-aero.example", "https://api.platform.example"] }
}
```

#### L'isolation par cadre

```html
<iframe
  src="https://widgets.acme-aero.example/ground-map/index.html"
  sandbox="allow-scripts"
  referrerpolicy="no-referrer"></iframe>
```

L'attribut `sandbox` retire à la page intégrée l'accès à l'origine de la plateforme, aux cookies et au stockage de la page hôte. Le composant échange avec la page par des messages explicites.

```text
Page hôte ──postMessage(init, jeton court limité à aircraft.read)──► Cadre isolé
Cadre isolé ──appel API avec le jeton──► API de la plateforme
Cadre isolé ──postMessage(resize, navigate...)──► Page hôte (vérifie chaque message)
```

**Le jeton.** Il est émis par la plateforme, à courte durée, limité aux droits de l'utilisateur **et** aux périmètres de l'extension (intersection). Il n'est jamais le jeton de session de l'utilisateur.

#### Les étapes de workflow personnalisées

```json
{
  "step_type": "acme.operational_impact",
  "label": "Calcul de l'impact opérationnel",
  "endpoint": "https://api.acme-aero.example/impact",
  "input_schema": {
    "type": "object",
    "required": ["aircraft_id", "grounding_period"],
    "properties": {
      "aircraft_id": { "type": "string" },
      "grounding_period": { "type": "string", "format": "duration" }
    }
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "flights_cancelled": { "type": "integer" },
      "estimated_cost": { "type": "number" }
    }
  },
  "timeout": "PT20S",
  "retry": { "max_attempts": 3, "backoff": "exponential" },
  "idempotent": true,
  "signing": "hmac-sha256",
  "side_effects": "none"
}
```

**Comment le lire.** L'étape appelle un service du partenaire avec des entrées et sorties typées, un délai, des reprises et une signature. Elle déclare qu'elle est idempotente et sans effet de bord, ce qui permet à la plateforme de la rejouer en sûreté.

#### L'exécution de l'étape

```text
Workflow ──► étape « operational_impact »
   1. valider les entrées contre le schéma
   2. appeler l'endpoint (signé, avec clé d'idempotence = instance + étape)
   3. appliquer le délai ; reprises selon la politique
   4. valider la réponse contre le schéma de sortie
   5. stocker le résultat dans le contexte du workflow
   6. en cas d'échec définitif : branche d'erreur du workflow, file des échecs
```

#### Les garde-fous

| Domaine | Mesure |
|---|---|
| Sécurité de l'interface | Cadre isolé, CSP, jetons limités, pas d'accès à la session |
| Données | Droits de l'utilisateur et périmètres de l'extension (intersection) |
| Performance | Chargement différé, limites de taille et de temps |
| Cohérence | Composants du système de conception, thèmes, accessibilité |
| Étapes personnalisées | Délais, reprises, idempotence déclarée, signature, schémas |
| Gouvernance | Versions, revue, journal d'exécution, désactivation |
| Évolution | API d'extension versionnée, tests de compatibilité |

#### La stabilité face aux évolutions

L'API d'extension d'interface et le contrat des étapes sont des **contrats versionnés** (voir [10.8 Versionnement d'API](#108-versionnement-dapi)) : la plateforme annonce les changements, offre une période de coexistence et fournit des outils de test. Un tenant dont l'extension casse après une mise à jour est un échec de la plateforme autant que de l'extension.

**Contre-exemple.** Charger un script fourni par un tenant directement dans la page de la plateforme, avec accès au jeton de session. Une erreur ou une intention malveillante lui donne accès à tout ce que l'utilisateur peut faire, dans tous ses tenants.

**Limites.** Les interfaces isolées sont plus difficiles à harmoniser visuellement. Un équilibre est à trouver entre sécurité, cohérence et liberté de conception ; les emplacements composants avec le système de conception sont un bon compromis pour les cas courants.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les vues et formulaires configurables sont la première couche |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | Les workflows et règles configurables sont la première couche |
| [10.12 Plugins, extensions et modules personnalisés](#1012-plugins-extensions-et-modules-personnalisés) | Les extensions d'interface et d'étape sont des plugins |
| [12.2 Design systems](12-produit-ux.md#122-design-systems) | Le système de conception assure la cohérence |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | L'interface s'adapte aux droits |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Les étapes personnalisées étendent le moteur de workflow |

### 5. Application pratique

**Situation initiale.** La compagnie veut afficher, sur son tableau de bord, une carte des aéronefs au sol, et calculer automatiquement l'impact opérationnel d'une immobilisation.

**Problème.** Ni la carte ni le calcul n'existent dans le catalogue standard.

**Application du concept.** Un widget en cadre isolé et une étape de workflow personnalisée, fournis par un partenaire.

**Déroulé.**

1. Le partenaire déclare le widget (emplacement `dashboard.widget`, périmètre `aircraft.read`).
2. L'administrateur l'installe ; la plateforme émet des jetons courts limités à la lecture des aéronefs.
3. Le widget affiche la carte, dans un cadre isolé, avec le thème de la plateforme.
4. Le partenaire déclare aussi une étape `operational_impact`, que l'administrateur ajoute au workflow « Immobilisation ».
5. À chaque immobilisation, l'étape calcule l'impact et le stocke dans le dossier, avec un délai de 20 secondes et des reprises.

**Résultat.** Deux besoins spécifiques sont satisfaits sans modifier le produit ni compromettre la sécurité.

**Limites.** Si le service du partenaire est indisponible, le workflow doit prévoir une branche de repli (étape manuelle) pour ne pas bloquer les immobilisations.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi isole-t-on une interface tierce dans un cadre restreint ?
2. **Compréhension.** Que contient le contrat d'une étape de workflow personnalisée ?
3. **Compréhension.** Pourquoi le jeton d'une interface personnalisée est-il l'intersection des droits de l'utilisateur et des périmètres de l'extension ?
4. **Pourquoi.** Pourquoi une étape personnalisée doit-elle déclarer qu'elle est idempotente ?
5. **Raisonnement pratique.** Le service d'une étape personnalisée est indisponible. Comment éviter que les workflows se bloquent ?

#### Réponses

1. Pour que le code tiers ne puisse pas lire la session de l'utilisateur ni modifier le reste de la page : il n'a que les accès qu'on lui accorde explicitement.
2. Des schémas d'entrée et de sortie, un délai, une politique de reprise, une déclaration d'idempotence, une signature, et les effets de bord éventuels.
3. Pour que l'extension ne puisse agir ni au-delà de ce que l'utilisateur peut faire, ni au-delà de ce que le tenant lui a accordé.
4. Pour que la plateforme puisse la rejouer en sûreté en cas de délai ou de reprise, sans dupliquer les effets.
5. Par des délais et des reprises bornés, une branche d'erreur ou de repli dans le workflow (par exemple une tâche manuelle) et une alerte à l'administrateur.
