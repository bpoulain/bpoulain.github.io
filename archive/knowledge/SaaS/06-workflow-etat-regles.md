# Module 6 — Workflow, état et règles métier

> **Question directrice.** Comment représenter des processus et des règles métier complexes, de façon configurable, pour que la plateforme soit une plateforme métier et plus seulement une base de données ?

## Présentation du module

**Objectif.** Jusqu'ici, la plateforme sait stocker et manipuler des ressources. Ce module lui apprend à comprendre **ce qui se passe dans la vie d'une ressource** : dans quel état elle est, comment elle en change, quels processus font intervenir quelles personnes, et quelles règles décident de ce qui est permis.

**Prérequis.** Les ressources et les opérations des modules 2 et 3, les rôles et permissions du module 4.

**Ordre retenu.** Deux blocs : les états et les processus, puis les règles. Le plan les présente en deux listes ; l'ordre ci-dessous suit les dépendances.

```text
États et processus   état ─ transition et machine à états ─ workflow ─ approbation et escalade ─ délai et reprise
Règles               règle métier ─ condition et éligibilité ─ expression et formule ─ table de décision ─ moteur de règles
```

Les notions de *constraint* et de *validation rule* sont expliquées en [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) et [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) ; elles sont replacées ici dans l'ensemble des règles. La notion de *policy* est détaillée en [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) pour l'accès ; elle est élargie ici aux politiques métier.

## Sommaire du module

- [6.1 État, statut et cycle de vie](#61-état-statut-et-cycle-de-vie)
- [6.2 Transition et machine à états](#62-transition-et-machine-à-états)
- [6.3 Workflow, processus, étape et tâche](#63-workflow-processus-étape-et-tâche)
- [6.4 Approbation et escalade](#64-approbation-et-escalade)
- [6.5 Délai d'expiration et nouvelle tentative](#65-délai-dexpiration-et-nouvelle-tentative)
- [6.6 Règle métier, règle de validation, contrainte et politique](#66-règle-métier-règle-de-validation-contrainte-et-politique)
- [6.7 Condition et éligibilité](#67-condition-et-éligibilité)
- [6.8 Expression et formule](#68-expression-et-formule)
- [6.9 Table de décision](#69-table-de-décision)
- [6.10 Moteur de règles](#610-moteur-de-règles)

## 6.1 État, statut et cycle de vie

### 1. Comprendre simplement

Un **état** (*state*) décrit la situation d'une ressource à un instant donné, parmi un ensemble fini de situations nommées : *brouillon*, *actif*, *suspendu*, *archivé*. Un **cycle de vie** (*lifecycle*) est l'ensemble ordonné des états qu'une ressource peut traverser, avec les chemins permis entre eux, de sa création à sa fin. Le **statut** (*status*) est le mot courant que l'on rencontre dans les noms de champs ; il désigne tantôt l'état, tantôt une information d'affichage.

**Pourquoi cela existe.** Ce que l'on peut faire d'une ressource dépend de sa situation. On ne planifie pas un vol pour un aéronef retiré du service. Si cette situation est un texte libre, chacun l'interprète à sa façon, et les règles deviennent impossibles à appliquer de façon fiable.

**Problème résolu.** Donner un vocabulaire fermé et partagé à la situation d'une ressource, pour pouvoir y rattacher des règles, des droits et des actions.

**Modèle mental.** Le suivi d'un colis : *créé*, *expédié*, *en livraison*, *livré*. À chaque instant, le colis est dans un seul de ces états, et l'on sait quelles étapes viennent après.

**Où l'analogie s'arrête.** Le suivi d'un colis est linéaire. Un cycle de vie peut se ramifier et revenir en arrière : un aéronef en inspection revient en service, une demande refusée repart en brouillon.

**Exemple.** Le cycle de vie de l'aéronef : *planifié*, *actif*, *en inspection*, *retiré*.

```text
planifié ──► actif ◄──► en inspection
               │
               ▼
            retiré
```

**Les composants.**

1. un **ensemble d'états** nommés ;
2. un **état initial** et des **états terminaux** ;
3. des **chemins permis** entre états ;
4. ce que **chaque état autorise** ou interdit.

**Objectif d'apprentissage :** vous pouvez définir le cycle de vie d'une ressource et dire, pour chaque état, ce qui est permis.

### 2. Connaissances essentielles

#### Définition

- **État** : valeur, parmi un ensemble fini et nommé, qui caractérise la situation d'une ressource par rapport à son cycle de vie.
- **Cycle de vie** : modèle qui décrit les états possibles d'une ressource, leurs relations et leur ordre.
- **Statut** : terme générique ; dans ce parcours, on emploie *état* pour la position dans le cycle de vie, et *statut* pour le nom du champ qui la porte ou pour une information d'affichage dérivée.

#### Idées fondamentales

1. **Un ensemble fermé de valeurs.** Pas de texte libre.
2. **Un seul état courant par dimension.** À un instant, la ressource est dans un état précis.
3. **L'état détermine ce qui est permis.** Droits, règles, actions disponibles.
4. **Ce qui se calcule ne se stocke pas comme état.** « En retard » se déduit d'une date.
5. **Plusieurs dimensions sont indépendantes.** Cycle de vie et approbation ne se fusionnent pas.
6. **Le cycle de vie est une configuration.** L'administrateur peut le définir pour ses types.

#### Vocabulaire essentiel

- **État initial** (*initial state*) : état dans lequel une ressource est créée.
- **État terminal** (*final state*, *terminal state*) : état dont on ne sort plus.
- **État courant** (*current state*) : état actuel de la ressource.
- **Historique d'états** (*state history*) : suite des états traversés, avec dates et auteurs.
- **Dimension** : axe indépendant d'états (cycle de vie, approbation, paiement).
- **Statut dérivé** (*derived status*) : information calculée à partir d'autres données.

#### Relations de cause à effet

- L'état est un texte libre. Des variantes apparaissent (« actif », « Actif »), et les règles basées sur l'état échouent silencieusement.
- Plusieurs dimensions sont fusionnées dans un seul champ. Le nombre d'états explose et le modèle devient incompréhensible.
- L'historique n'est pas conservé. On ne sait plus quand ni par qui la ressource a changé d'état.

#### Idées reçues

- **« Statut et état sont deux choses différentes à définir. »** En pratique les mots se confondent. L'important est de décider ce qu'ils désignent dans votre plateforme et de s'y tenir.
- **« Plus d'états, c'est plus de précision. »** Non. Trop d'états rendent les transitions impossibles à maintenir. Il vaut mieux séparer les dimensions.
- **« Un état « en retard » est utile à stocker. »** C'est une information dérivée d'une date. La stocker crée un risque de divergence.

#### Principe clé

Un état est une valeur fermée qui résume la situation d'une ressource et conditionne ce qu'on peut en faire ; ce qui se calcule se dérive, ne se stocke pas.

#### Si vous ne retenez que trois choses

1. Un état appartient à un ensemble fermé, et un cycle de vie décrit les états et les chemins permis.
2. L'état détermine les actions, les droits et les règles applicables.
3. Séparez les dimensions indépendantes, et dérivez ce qui peut se calculer.

### 3. Explication technique détaillée

#### Un cycle de vie comme donnée

```json
{
  "type": "aircraft",
  "state_field": "status",
  "states": [
    { "key": "planned",       "label": "Planifié",      "initial": true },
    { "key": "active",        "label": "Actif" },
    { "key": "in_inspection", "label": "En inspection" },
    { "key": "retired",       "label": "Retiré",        "terminal": true }
  ]
}
```

#### Ce que chaque état autorise

| État | Modifier les champs | Affecter à un vol | Créer une tâche | Archiver |
|---|---|---|---|---|
| Planifié | Oui | Non | Oui | Oui |
| Actif | Oui, sauf champs réglementaires | Oui | Oui | Non |
| En inspection | Limité | Non | Oui | Non |
| Retiré | Non | Non | Non | Oui |

Ce tableau est la forme concrète des invariants du type de l'entrée [13.5 Invariants](13-concepts-transversaux.md#135-invariants) : « un aéronef retiré ne peut pas être affecté ».

#### Séparer les dimensions

Un aéronef a un **cycle de vie** (4 états) et un **état de conformité réglementaire** (3 états : conforme, à surveiller, non conforme).

- En un seul champ : $4 \times 3 = 12$ combinaisons à nommer et à gérer.
- En deux champs indépendants : $4 + 3 = 7$ valeurs, et les règles combinent les deux.

#### Ce qui se dérive

```sql
-- Information dérivée : jamais stockée comme état
SELECT id,
       (next_inspection_date < CURRENT_DATE) AS overdue
FROM aircraft;
```

Stocker `overdue` comme état imposerait un traitement qui le recalcule chaque jour, et créerait une période où la valeur est fausse.

#### L'historique

```sql
CREATE TABLE state_history (
  tenant_id   uuid NOT NULL,
  resource_id uuid NOT NULL,
  from_state  text,
  to_state    text NOT NULL,
  changed_by  uuid NOT NULL,
  reason      text,
  changed_at  timestamptz NOT NULL DEFAULT now()
);
```

Cette table permet de répondre à « quand cet aéronef est-il passé en inspection, et par qui ? » et de calculer des durées d'immobilisation.

**Contre-exemple.** Un champ `status` en texte libre qui contient « OK », « ok », « en cours », « en cours de contrôle ». Le rapport « nombre d'aéronefs en contrôle » compte trois valeurs différentes selon la saisie.

**Limites.** Un cycle de vie rigide peut ne pas couvrir des cas réels. Il faut prévoir des états d'exception et un mécanisme de dérogation tracée (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.2 Transition et machine à états](#62-transition-et-machine-à-états) | Les transitions définissent les passages permis entre états |
| [6.3 Workflow, processus, étape et tâche](#63-workflow-processus-étape-et-tâche) | Un workflow pilote souvent les changements d'état |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | « Archivé » est un état du cycle de vie |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Le cycle de vie du tenant est un cas particulier |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants dépendent de l'état |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'historique d'états alimente l'audit |

### 5. Application pratique

**Situation initiale.** La compagnie suit les aéronefs avec un champ texte « statut ». Les rapports de disponibilité de la flotte sont incohérents.

**Problème.** Le même statut est saisi de plusieurs façons, et aucune règle ne limite les actions selon la situation de l'aéronef.

**Application du concept.** L'administrateur définit un cycle de vie avec quatre états et un historique.

**Déroulé.**

1. Il crée l'énumération d'états du type *Aéronef*.
2. Il migre les valeurs existantes par une table de correspondance (« OK » vers *actif*, « contrôle » vers *en inspection*).
3. Il active l'historique.
4. Il définit, pour chaque état, les actions permises.

**Résultat.** Les rapports de disponibilité deviennent fiables, et les actions interdites sont refusées par le moteur.

**Limites.** La migration des valeurs existantes peut laisser des cas ambigus à traiter à la main (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un état, et qu'est-ce qu'un cycle de vie ?
2. **Compréhension.** Pourquoi ne stocke-t-on pas « en retard » comme un état ?
3. **Compréhension.** Qu'est-ce que l'état initial et l'état terminal ?
4. **Pourquoi.** Pourquoi sépare-t-on les dimensions d'état indépendantes ?
5. **Raisonnement pratique.** Un aéronef a 5 états de cycle de vie et 4 états d'approbation. Combien de combinaisons si on les fusionne, et combien de valeurs sinon ?

#### Réponses

1. Un état est une valeur d'un ensemble fermé qui décrit la situation d'une ressource. Un cycle de vie décrit les états possibles et leurs enchaînements.
2. Parce que c'est une information dérivée d'une date : la stocker crée un risque de divergence avec la valeur calculée.
3. L'état initial est celui dans lequel une ressource est créée ; l'état terminal est celui dont on ne sort plus.
4. Pour éviter l'explosion des combinaisons, et parce que ces dimensions évoluent indépendamment.
5. $5 \times 4 = 20$ combinaisons si on les fusionne ; $5 + 4 = 9$ valeurs avec deux champs séparés.

## 6.2 Transition et machine à états

### 1. Comprendre simplement

Une **transition** (*transition*) est le passage d'un état à un autre, déclenché par un événement ou une action, sous certaines conditions. Une **machine à états** (*state machine*) est le modèle qui décrit tous les états d'une ressource et **exactement** les transitions permises entre eux.

**Pourquoi cela existe.** Si n'importe quel état peut être remplacé par n'importe quel autre, les règles métier n'ont plus de prise : un aéronef retiré peut redevenir actif d'une simple modification. La machine à états rend les changements d'état explicites, contrôlés et traçables.

**Problème résolu.** Garantir que les ressources suivent uniquement des chemins valides, et attacher des conditions et des effets à chaque changement.

**Modèle mental.** Un réseau ferroviaire. Les gares sont les états ; les voies, les transitions. On ne passe d'une gare à une autre que s'il y a une voie, et des aiguillages (les conditions) décident de la route.

**Où l'analogie s'arrête.** Une voie ferrée est passive. Une transition peut déclencher des effets : créer des tâches, notifier, bloquer d'autres ressources.

**Exemple.** La transition « immobiliser » fait passer un aéronef de *actif* à *en inspection*, à condition qu'aucun vol ne soit programmé dans les 24 h. Elle crée la tâche d'inspection et prévient le planificateur.

**Les composants d'une transition.**

1. un **état source** et un **état cible** ;
2. un **déclencheur** (action, événement) ;
3. des **gardes** (conditions) ;
4. des **effets** (actions exécutées) ;
5. des **droits** (qui peut la déclencher).

**Objectif d'apprentissage :** vous pouvez décrire une machine à états avec ses gardes et ses effets, et expliquer pourquoi on interdit la modification directe du champ d'état.

### 2. Connaissances essentielles

#### Définition

Une **machine à états finis** est un modèle formel défini par un ensemble d'états, un état initial, un ensemble d'événements et une fonction de transition qui donne, pour chaque état et chaque événement, l'état suivant. Dans une plateforme, la **transition** est l'unité de changement, avec ses conditions et ses effets.

#### Idées fondamentales

1. **Toute transition est explicite.** Un changement d'état hors transition est interdit.
2. **Une garde conditionne la transition.** Elle peut dépendre de données, de droits ou du contexte.
3. **Les effets font partie de la transition.** Ils s'exécutent avec le changement d'état.
4. **L'ensemble est vérifiable.** On peut contrôler automatiquement qu'il n'y a pas d'impasse ni d'état inaccessible.
5. **La machine est une configuration.** L'administrateur la modifie sans développeur.
6. **Les transitions sont des actions métier.** Elles portent un nom, une intention, un motif.

#### Vocabulaire essentiel

- **Garde** (*guard*) : condition qui doit être vraie pour que la transition ait lieu.
- **Effet** (*effect*, *action*) : opération exécutée à la transition (création, notification).
- **Déclencheur** (*trigger*) : événement ou action qui provoque la transition.
- **État inaccessible** (*unreachable state*) : état qu'aucun chemin ne permet d'atteindre.
- **Impasse** (*dead end*) : état non terminal sans transition sortante.
- **Diagramme d'états** (*statechart*) : extension qui ajoute états imbriqués et parallèles (David Harel, 1987).

#### Relations de cause à effet

- Le champ d'état est modifiable directement par l'API. Les règles et effets liés aux transitions sont contournés.
- Une transition échoue à mi-chemin. L'état a changé mais l'effet (création de tâche) n'a pas eu lieu, sauf si les deux sont dans la même transaction.
- Deux utilisateurs déclenchent des transitions en même temps. Sans contrôle de version, la seconde s'applique à un état qui n'est plus le bon.

#### Idées reçues

- **« Une machine à états, c'est un schéma de documentation. »** Non : c'est un objet exécutable, que le moteur applique et vérifie.
- **« Toutes les transitions sont possibles dans les deux sens. »** Non. Certaines sont irréversibles (retirer un aéronef), d'autres conditionnelles.
- **« Les états et transitions doivent être codés. »** Dans une plateforme générique, ils sont des métadonnées : le moteur les interprète.

#### Principe clé

L'état d'une ressource ne change que par une transition déclarée, avec ses gardes et ses effets, exécutée comme une opération atomique.

#### Si vous ne retenez que trois choses

1. Une machine à états déclare tous les états et seules les transitions permises.
2. Chaque transition a des gardes (conditions) et des effets (actions).
3. Le champ d'état n'est jamais modifié directement : il passe par une transition.

### 3. Explication technique détaillée

#### Une définition de machine à états

```json
{
  "type": "aircraft",
  "transitions": [
    {
      "key": "ground",
      "label": "Immobiliser",
      "from": ["active"],
      "to": "in_inspection",
      "allowed_roles": ["planner"],
      "guards": [
        { "expr": "count(flights where status = 'scheduled' and start < now() + 24h) = 0",
          "message": "Un vol est programmé dans les 24 h." }
      ],
      "requires": ["reason"],
      "effects": [
        { "type": "create_resource", "resource": "maintenance_task",
          "values": { "aircraft": "$self", "description": "Inspection programmée" } },
        { "type": "notify", "role": "planner" }
      ]
    },
    {
      "key": "release",
      "label": "Remettre en service",
      "from": ["in_inspection"],
      "to": "active",
      "allowed_roles": ["quality_manager"],
      "guards": [ { "expr": "all(tasks, t => t.status = 'closed')" } ]
    }
  ]
}
```

**Comment la lire.** Deux transitions. *Immobiliser* est possible depuis l'état *actif*, pour les planificateurs, sous une garde et avec un motif obligatoire ; elle crée une tâche et notifie. *Remettre en service* exige que toutes les tâches soient clôturées.

#### Formalisation

Une machine à états finis se note :

$$M = (S,\; s_0,\; E,\; \delta,\; F)$$

où $S$ est l'ensemble des états, $s_0 \in S$ l'état initial, $E$ l'ensemble des événements, $\delta : S \times E \to S$ la fonction de transition (éventuellement partielle : un événement peut être interdit dans un état) et $F \subseteq S$ l'ensemble des états terminaux.

#### Exécution d'une transition

```text
1. Charger la ressource et vérifier la version
2. Vérifier que la transition est déclarée depuis l'état courant
3. Vérifier les droits de l'appelant
4. Vérifier les données requises (motif...)
5. Évaluer les gardes
6. Dans une transaction :
     - écrire le nouvel état et la version
     - enregistrer l'historique
     - exécuter les effets synchrones
     - enregistrer les événements à publier
7. Après validation : effets asynchrones (notifications)
```

#### L'exposition par l'API

```http
POST /resources/aircraft/ac_8f3a/transitions/ground HTTP/1.1
If-Match: "12"
Content-Type: application/json

{ "reason": "Inspection annuelle" }
```

La réponse d'une transition interdite est un conflit (`409`) avec l'explication de la garde qui a échoué (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)).

#### Les vérifications statiques d'une machine

| Vérification | Ce qu'elle détecte |
|---|---|
| État inaccessible | Un état que l'on ne peut jamais atteindre |
| Impasse | Un état non terminal sans issue |
| Transitions ambiguës | Deux transitions de même déclencheur et mêmes gardes |
| Garde jamais vraie | Une transition inutilisable |
| État sans effet métier | Un état qui n'autorise ni n'interdit rien |

Ces vérifications sont faites à l'enregistrement par l'administrateur (voir [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)).

#### Les états imbriqués et parallèles

Les diagrammes d'états de Harel ajoutent deux notions : des **états composés** (un état *actif* contenant les sous-états *au sol* et *en vol*) et des **régions parallèles** (le cycle de vie et la conformité évoluent en même temps). Une plateforme générique les représente souvent par des dimensions d'état séparées plutôt que par un modèle hiérarchique complet.

**Contre-exemple.** `PATCH {"status": "active"}` sur un aéronef retiré. Le moteur remplace la valeur sans passer par une transition : la règle « un aéronef retiré ne revient pas en service » est violée.

**Limites.** Une machine à états décrit bien le cycle de vie d'**une** ressource. Pour coordonner plusieurs personnes et ressources dans le temps, on utilise un workflow (voir [6.3 Workflow, processus, étape et tâche](#63-workflow-processus-étape-et-tâche)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.1 État, statut et cycle de vie](#61-état-statut-et-cycle-de-vie) | Elle opérationnalise le cycle de vie |
| [6.3 Workflow, processus, étape et tâche](#63-workflow-processus-étape-et-tâche) | Le workflow orchestre des transitions et des tâches |
| [6.7 Condition et éligibilité](#67-condition-et-éligibilité) | Les gardes sont des conditions |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les transitions émettent des événements |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | Elles sont exécutées en transaction |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le contrôle de version protège des transitions concurrentes |

### 5. Application pratique

**Situation initiale.** Les techniciens remettent parfois en service un aéronef alors qu'une tâche d'inspection est encore ouverte.

**Problème.** Rien ne l'empêche : le statut est un champ modifiable librement.

**Application du concept.** L'administrateur définit les transitions *Immobiliser* et *Remettre en service*, avec une garde sur les tâches.

**Déroulé.**

1. L'administrateur retire le droit de modifier directement `status`.
2. Il crée les deux transitions avec leurs rôles et gardes.
3. Un technicien tente « Remettre en service » : la garde échoue avec le message « 2 tâches sont encore ouvertes ».
4. Quand les tâches sont clôturées, le responsable qualité peut effectuer la transition.

**Résultat.** La règle métier est appliquée par le moteur, avec un historique de chaque changement.

**Limites.** Un cas d'urgence peut nécessiter une dérogation : on prévoit une transition « remise en service dérogatoire », avec approbation et motif (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une transition ?
2. **Compréhension.** Quelle est la différence entre une garde et un effet ?
3. **Compréhension.** Que détecte une vérification d'état inaccessible ?
4. **Pourquoi.** Pourquoi interdit-on la modification directe du champ d'état ?
5. **Raisonnement pratique.** Une transition crée une tâche, mais la création échoue. Que doit devenir l'état de la ressource ?

#### Réponses

1. Le passage d'un état à un autre, déclenché par une action ou un événement, sous des conditions.
2. Une garde est une condition à satisfaire pour que la transition ait lieu ; un effet est une action exécutée quand elle a lieu.
3. Un état qu'aucun chemin de transitions ne permet d'atteindre : il est inutile ou résulte d'une erreur de configuration.
4. Parce que cela contournerait les gardes, les droits et les effets de la transition, donc les règles métier.
5. Elle ne doit pas changer : le changement d'état et ses effets synchrones sont dans la même transaction, qui est annulée.

## 6.3 Workflow, processus, étape et tâche

### 1. Comprendre simplement

Un **processus** (*process*) est une suite d'activités qui permet d'atteindre un objectif métier : approuver un constat, intégrer un nouveau technicien. Un **workflow** est la description exécutable de ce processus : quelles **étapes** (*steps*), dans quel ordre, avec quelles conditions, et quelles **tâches** (*tasks*) à qui. Une tâche est une unité de travail à accomplir par une personne ou par un système.

**Pourquoi cela existe.** Beaucoup de processus durent des jours et font intervenir plusieurs personnes et plusieurs systèmes. Sans moteur, chacun gère sa part par courriel, et personne ne sait où en est le dossier ni qui doit agir.

**Problème résolu.** Coordonner dans le temps des personnes et des systèmes, avec un suivi, des règles d'attribution et une trace de chaque étape.

**Modèle mental.** Le parcours d'un dossier administratif : il passe de guichet en guichet, chacun fait sa part, le dossier avance ou revient, et l'on peut toujours savoir où il est.

**Où l'analogie s'arrête.** Un dossier papier est physiquement à un seul endroit. Un workflow peut faire avancer plusieurs branches en parallèle, attendre des événements externes et s'interrompre.

**Exemple.** Le workflow « Approbation d'un constat d'inspection » : saisie par le technicien, revue par le responsable qualité, validation par la direction technique si le constat est critique, clôture.

**Les composants.**

1. une **définition** (étapes, transitions, règles) ;
2. des **instances** en cours d'exécution ;
3. des **tâches** assignées ;
4. un **contexte** de données ;
5. un **historique**.

**Objectif d'apprentissage :** vous pouvez distinguer la définition d'un workflow de ses instances, et dire en quoi un workflow diffère d'une machine à états.

### 2. Connaissances essentielles

#### Définition

- **Processus** : enchaînement d'activités organisé pour produire un résultat métier.
- **Workflow** : représentation formelle et exécutable d'un processus, qui décrit les étapes, leur ordre, les conditions de passage, les acteurs et les données.
- **Étape** (*step*) : unité d'un workflow (tâche humaine, action automatique, décision, attente).
- **Tâche** : unité de travail assignée à une personne, un rôle ou un système, avec un état propre.

#### Idées fondamentales

1. **Définition et instance sont distinctes.** La définition est unique ; chaque dossier en a une instance.
2. **Une instance a un état persistant.** Étape courante, variables, historique : elle survit aux redémarrages.
3. **Les tâches humaines passent par une liste de travail.** Assignation, réclamation, délai.
4. **Un workflow peut être séquentiel, parallèle, conditionnel.** Avec bifurcations et jonctions.
5. **Il peut attendre.** Un événement, une date, une réponse.
6. **Il pilote les ressources.** Il déclenche leurs transitions.

#### Vocabulaire essentiel

- **Instance de workflow** (*workflow instance*, *case*) : exécution concrète d'une définition.
- **Tâche humaine** (*human task*, *user task*) : étape confiée à une personne.
- **Tâche automatique** (*service task*) : étape exécutée par le système.
- **Passerelle** (*gateway*) : point de décision ou de synchronisation.
- **Liste de travail** (*worklist*, *task inbox*) : tâches assignées à une personne ou à un rôle.
- **Variable de processus** (*process variable*) : donnée transportée par l'instance.
- **BPMN** : notation normalisée (OMG, ISO/IEC 19510) pour modéliser les processus.

#### Relations de cause à effet

- La définition change pendant que des instances sont en cours. Si elles s'exécutent selon la nouvelle définition, elles peuvent se retrouver dans une étape qui n'existe plus : on les rattache à la version avec laquelle elles ont démarré.
- Les tâches sont assignées à une personne nommée. Quand elle est absente ou partie, le dossier est bloqué : on assigne à des rôles ou à des groupes.
- Les données du processus contiennent des copies de ressources. Elles divergent des ressources réelles pendant les jours d'exécution.

#### Idées reçues

- **« Un workflow, c'est un schéma de flux. »** Non : c'est un objet exécutable avec des instances persistantes.
- **« Un workflow remplace la machine à états d'une ressource. »** Non. La machine à états protège le cycle de vie d'une ressource ; le workflow coordonne des acteurs et des activités. Ils se complètent.
- **« Tout processus doit être automatisé. »** Non. Un processus qui change souvent ou dont les cas particuliers sont nombreux est parfois mieux traité par des personnes avec des outils de suivi.

#### Principe clé

Un workflow est une définition versionnée, exécutée en instances persistantes, qui coordonne des tâches et fait avancer les ressources.

#### Si vous ne retenez que trois choses

1. Un workflow est la forme exécutable d'un processus, avec des étapes et des tâches.
2. Chaque dossier est une instance persistante, rattachée à la version de la définition.
3. Machine à états et workflow se complètent : l'une protège la ressource, l'autre coordonne les acteurs.

### 3. Explication technique détaillée

#### Une définition de workflow

```json
{
  "key": "finding_approval",
  "version": 3,
  "trigger": { "event": "finding.created" },
  "steps": [
    { "id": "review",   "type": "human_task", "assignee": { "role": "quality_manager" },
      "due": "P2D", "outcomes": ["approved", "rejected", "critical"] },
    { "id": "decide",   "type": "gateway",
      "branches": [
        { "when": "review.outcome = 'critical'", "next": "director" },
        { "when": "review.outcome = 'approved'", "next": "close" },
        { "when": "review.outcome = 'rejected'", "next": "rework" }
      ] },
    { "id": "director", "type": "human_task", "assignee": { "role": "technical_director" },
      "due": "P1D", "outcomes": ["approved", "rejected"] },
    { "id": "rework",   "type": "human_task", "assignee": { "ref": "finding.author" } },
    { "id": "close",    "type": "action",
      "do": { "transition": "finding.close" } }
  ]
}
```

**Comment la lire.** Un constat créé déclenche une revue. Selon le résultat, le dossier passe à la direction, est clôturé ou retourne à l'auteur. `due` est une durée au format ISO 8601 (deux jours).

#### Les types d'étapes

| Type | Description | Exemple |
|---|---|---|
| Tâche humaine | Assignée à une personne ou un rôle | Revue du constat |
| Action automatique | Exécutée par le moteur | Changer l'état de la ressource |
| Décision (passerelle) | Choisit une branche selon des conditions | Constat critique ou non |
| Parallèle (bifurcation et jonction) | Plusieurs branches simultanées | Revue qualité et revue sécurité |
| Attente | Événement ou minuteur | Attendre la réponse du client |
| Sous-processus | Appel d'un autre workflow | Procédure d'escalade |

#### Les états d'une instance et d'une tâche

| Objet | États typiques |
|---|---|
| Instance | en cours, en attente, terminée, annulée, en erreur |
| Tâche | créée, assignée, réclamée, en cours, terminée, annulée, expirée |

#### La persistance

Une instance dure plusieurs jours. Son état (étape courante, variables, tâches ouvertes) est écrit à chaque avancement, de façon durable. Après un redémarrage, le moteur reprend chaque instance là où elle était. Certaines architectures le font par journal d'événements (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)).

#### L'attribution des tâches

| Stratégie | Principe |
|---|---|
| Personne nommée | Simple, fragile (absence, départ) |
| Rôle ou groupe | N'importe quel titulaire peut réclamer la tâche |
| Règle calculée | Le responsable de l'auteur, le moins chargé, la base de l'aéronef |
| Délégation | Remplaçant désigné en cas d'absence (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)) |

#### Le versionnement

Chaque instance reste rattachée à la version de la définition avec laquelle elle a démarré. Une nouvelle version ne s'applique qu'aux nouvelles instances, sauf migration explicite (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

#### Machine à états ou workflow ?

| Critère | Machine à états | Workflow |
|---|---|---|
| Objet | Cycle de vie d'une ressource | Coordination d'acteurs et d'activités |
| Durée | Instantané à long terme | Minutes à semaines |
| Acteurs multiples | Non, c'est la ressource | Oui, avec tâches et assignations |
| Attente d'événements | Peu | Courante |
| Exemple | Aéronef : actif, en inspection | Approbation d'un constat |

**Contre-exemple.** Un workflow qui duplique les règles de transition d'une ressource dans ses propres conditions. Quand la règle change, il faut la modifier à deux endroits, et elles divergent. Le workflow doit appeler la transition de la ressource, qui porte ses gardes.

**Limites.** Un workflow trop détaillé devient aussi complexe qu'un programme. On garde dans le workflow ce qui est du ressort de la coordination, et dans les règles et les transitions ce qui est de la logique métier.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.2 Transition et machine à états](#62-transition-et-machine-à-états) | Les workflows déclenchent les transitions des ressources |
| [6.4 Approbation et escalade](#64-approbation-et-escalade) | Les approbations et escalades sont des motifs de workflow |
| [6.5 Délai d'expiration et nouvelle tentative](#65-délai-dexpiration-et-nouvelle-tentative) | Les délais et reprises s'y appliquent à chaque étape |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements démarrent et font avancer les workflows |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | La saga est un workflow de transactions réparties |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | L'administrateur conçoit les workflows dans l'interface |

### 5. Application pratique

**Situation initiale.** Les constats d'inspection sont transmis par courriel entre le technicien, le responsable qualité et la direction. Des constats critiques restent plusieurs jours sans réponse.

**Problème.** Personne ne sait qui doit agir, et il n'y a aucun suivi des délais.

**Application du concept.** L'administrateur modélise le processus d'approbation dans un workflow, avec des tâches assignées par rôle.

**Déroulé.**

1. À la création d'un constat, une instance de workflow démarre.
2. Le responsable qualité de la base voit la tâche dans sa liste, avec un délai de deux jours.
3. Il juge le constat « critique » : le workflow assigne la tâche à la direction technique.
4. La direction approuve ; le workflow fait passer le constat à l'état « clôturé ».

**Résultat.** Chaque constat a une trace de qui l'a traité et en combien de temps, et plus aucun dossier n'est « perdu ».

**Limites.** Un responsable absent bloque encore la tâche : il faut des règles d'escalade et de délégation (voir [6.4 Approbation et escalade](#64-approbation-et-escalade)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre la définition d'un workflow et une instance ?
2. **Compréhension.** Citez trois types d'étapes.
3. **Compréhension.** Pourquoi assigne-t-on souvent les tâches à un rôle plutôt qu'à une personne ?
4. **Pourquoi.** Pourquoi rattache-t-on une instance à la version de la définition avec laquelle elle a démarré ?
5. **Raisonnement pratique.** Quand utiliser une machine à états seule, et quand ajouter un workflow ?

#### Réponses

1. La définition décrit le processus ; une instance est une exécution concrète de cette définition, pour un dossier précis.
2. Par exemple : tâche humaine, action automatique, décision, parallèle, attente, sous-processus.
3. Pour que le dossier ne soit pas bloqué par l'absence ou le départ d'une personne : n'importe quel titulaire du rôle peut agir.
4. Pour qu'une modification de la définition ne place pas les instances en cours dans une étape qui n'existe plus ou qui a changé de sens.
5. Une machine à états suffit pour protéger le cycle de vie d'une ressource ; on ajoute un workflow quand plusieurs acteurs, tâches et attentes doivent être coordonnés dans le temps.

## 6.4 Approbation et escalade

### 1. Comprendre simplement

Une **approbation** (*approval*) est une étape d'un processus où une ou plusieurs personnes doivent rendre une décision (approuver ou refuser) avant que le processus continue. Une **escalade** (*escalation*) est le transfert automatique d'un dossier, ou d'une alerte, à un niveau supérieur quand il n'est pas traité à temps ou quand il dépasse un seuil.

**Pourquoi cela existe.** Les décisions importantes engagent la responsabilité de l'organisation. Elles doivent être prises par la bonne personne, et ne pas rester bloquées. L'approbation garantit le contrôle, l'escalade garantit le mouvement.

**Problème résolu.** Obtenir des décisions autorisées et traçables dans des délais maîtrisés.

**Modèle mental.** La signature d'un responsable sur un bon de commande. Si le responsable est absent ou ne répond pas, le dossier remonte à son supérieur.

**Où l'analogie s'arrête.** Un bon de commande n'est signé qu'une fois. En plateforme, plusieurs approbateurs, des règles de quorum, des délégations et des relances peuvent se combiner.

**Exemple.** Un constat critique doit être approuvé par le responsable qualité. Sans réponse après 24 h, il est signalé au directeur technique ; après 48 h, la tâche lui est réassignée.

**Les composants.**

1. un **demandeur** ;
2. un ou plusieurs **approbateurs** ;
3. une **règle de décision** (un, tous, quorum) ;
4. des **délais** ;
5. des **règles d'escalade**.

**Objectif d'apprentissage :** vous pouvez décrire les motifs d'approbation les plus courants et définir une règle d'escalade.

### 2. Connaissances essentielles

#### Définition

- **Approbation** : étape de décision, formalisée et tracée, par laquelle une personne habilitée accepte ou refuse une demande.
- **Escalade** : mécanisme qui, sur dépassement d'un délai ou d'un seuil, notifie ou réaffecte le traitement à un niveau de responsabilité supérieur.

#### Idées fondamentales

1. **L'approbation est une décision tracée.** Qui, quand, avec quel résultat et quel motif.
2. **L'approbateur est défini par une règle.** Rôle, hiérarchie, montant.
3. **Le demandeur n'approuve jamais sa propre demande.** C'est une séparation des tâches (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
4. **L'approbation porte sur un état précis.** Si les données changent ensuite, l'approbation peut devenir caduque.
5. **L'escalade protège contre le blocage.** Elle est déclenchée par le temps ou par une condition.
6. **Relancer n'est pas escalader.** Un rappel prévient la même personne ; une escalade implique un niveau supérieur.

#### Vocabulaire essentiel

- **Demandeur** (*requester*) : celui qui soumet la demande.
- **Approbateur** (*approver*) : celui qui décide.
- **Quorum** : nombre minimal d'approbations requises parmi plusieurs approbateurs.
- **Rappel** (*reminder*) : notification à l'approbateur.
- **Niveau d'escalade** (*escalation level*) : palier de responsabilité.
- **Délégation** (*delegation*) : remplaçant temporaire (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
- **Approbation caduque** (*stale approval*) : approbation portant sur un état qui a changé depuis.

#### Relations de cause à effet

- Aucune règle d'escalade n'est définie. Une demande dont l'approbateur est absent reste bloquée indéfiniment.
- L'approbation porte sur « le dossier » et non sur une version figée. Le demandeur modifie le dossier après l'approbation, et la modification n'a jamais été vue.
- Les escalades sont automatiques sans plafond. Une demande remonte jusqu'à la direction pour un détail mineur, et les vraies urgences sont noyées.

#### Idées reçues

- **« Une approbation est un simple clic. »** C'est une décision qui engage : elle doit être associée à ce qui est approuvé, à l'identité, à la date et à un motif quand c'est requis.
- **« Un délai dépassé doit mener à une approbation automatique. »** C'est rarement acceptable : on préfère escalader ou refuser par défaut.
- **« Escalader, c'est notifier le chef. »** Escalader transfère la responsabilité de la décision, avec traçabilité.

#### Principe clé

Une approbation est une décision tracée sur un état précis ; l'escalade en garantit l'issue dans un délai connu, sans jamais remplacer la décision par une présomption.

#### Si vous ne retenez que trois choses

1. L'approbation formalise une décision tracée, sur une version précise de la demande.
2. L'escalade évite le blocage en transférant au niveau supérieur selon le temps ou un seuil.
3. Le demandeur ne peut pas être son propre approbateur.

### 3. Explication technique détaillée

#### Les motifs d'approbation

| Motif | Règle | Exemple |
|---|---|---|
| Un seul approbateur | La décision d'une personne suffit | Responsable qualité |
| Premier qui répond | Plusieurs candidats, le premier décide | Équipe de planification |
| Tous | Tous doivent approuver (unanimité) | Qualité et sécurité |
| Quorum | $k$ approbations sur $n$ | 2 sur 3 membres du comité |
| Séquentiel | Un après l'autre, dans l'ordre | Chef d'équipe puis directeur |
| Parallèle | Tous en même temps | Revue qualité et revue sécurité |

**Effet du motif sur le délai.** Avec trois approbateurs ayant chacun un délai de réponse d'environ un jour :

- en **séquentiel**, le délai total est la **somme** : environ 3 jours ;
- en **parallèle**, le délai total est le **maximum** : environ 1 jour.

#### La résolution de l'approbateur

```json
{
  "step": "approval",
  "approvers": {
    "rules": [
      { "when": "request.amount > 10000", "role": "technical_director" },
      { "when": "request.amount <= 10000", "relation": "requester.manager" }
    ],
    "exclude": ["requester"],
    "fallback": { "role": "quality_manager" }
  },
  "decision": { "mode": "any_one" },
  "outcomes": ["approved", "rejected", "changes_requested"]
}
```

**Comment la lire.** Le niveau de l'approbateur dépend du montant. Le demandeur est exclu. En l'absence de résultat (personne n'est disponible), un repli désigne le responsable qualité.

#### L'escalade

```json
{
  "escalation": [
    { "after": "PT24H", "action": "remind",   "target": "assignee" },
    { "after": "PT48H", "action": "reassign", "target": { "relation": "assignee.manager" } },
    { "after": "PT72H", "action": "notify",   "target": { "role": "technical_director" } }
  ],
  "max_levels": 2
}
```

**Comment la lire.** Un rappel à 24 h, une réaffectation au responsable à 48 h, une notification à la direction à 72 h. Le nombre de niveaux est plafonné.

#### Les déclencheurs d'escalade

| Déclencheur | Exemple |
|---|---|
| Temps | Pas de réponse en 48 h |
| Condition | Constat marqué « critique » : escalade immédiate |
| Seuil | Montant supérieur à une limite |
| Échec | Trois refus successifs |
| Événement | Un incident déclaré |

#### L'approbation sur une version figée

Pour qu'une approbation ne soit pas détournée par une modification ultérieure, on associe la décision à la **version** de la ressource (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) :

```json
{
  "decision_id": "dec_882",
  "approver": "u_qm_01",
  "resource": "finding/fd_204",
  "approved_version": 5,
  "outcome": "approved",
  "decided_at": "2026-11-04T09:12:00Z"
}
```

Si la ressource passe en version 6, l'approbation de la version 5 n'est plus valable : une nouvelle approbation est demandée.

**Contre-exemple.** Un workflow où l'approbation automatique est déclenchée après 5 jours sans réponse. Un constat critique est ainsi « approuvé » parce que personne n'a eu le temps de le regarder.

**Limites.** Un système d'escalade trop sensible fatigue : les supérieurs sont sollicités pour des cas qui ne le justifient pas. On calibre les seuils, et on mesure le taux d'escalade.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.3 Workflow, processus, étape et tâche](#63-workflow-processus-étape-et-tâche) | L'approbation est une étape de workflow |
| [6.5 Délai d'expiration et nouvelle tentative](#65-délai-dexpiration-et-nouvelle-tentative) | Les délais déclenchent les escalades |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | La délégation remplace un approbateur absent |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches interdit l'auto-approbation |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La gouvernance étend l'approbation aux changements de configuration |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Les décisions sont conservées comme preuves |

### 5. Application pratique

**Situation initiale.** Une demande de dérogation de remise en service doit être approuvée par le responsable qualité. Il est en déplacement, et la dérogation concerne un aéronef immobilisé.

**Problème.** L'immobilisation coûte cher chaque jour, et le dossier attend.

**Application du concept.** Un workflow d'approbation avec escalade, délégation et approbation liée à la version.

**Déroulé.**

1. Le technicien soumet la demande ; le workflow assigne le responsable qualité.
2. À 24 h sans réponse, un rappel est envoyé.
3. Le responsable a délégué ses approbations à son adjoint : la tâche est réassignée.
4. L'adjoint approuve ; la décision est liée à la version 3 de la demande.
5. Le demandeur modifie la demande ensuite : l'approbation devient caduque et une nouvelle est requise.

**Résultat.** La demande est traitée sans blocage, avec une décision tracée et attachée à ce qui a été réellement examiné.

**Limites.** Si aucune délégation n'existe et si le supérieur est injoignable, la procédure d'accès de dernier recours doit être prévue (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un rappel et une escalade ?
2. **Compréhension.** Citez trois motifs d'approbation.
3. **Compréhension.** Pourquoi le demandeur est-il exclu des approbateurs ?
4. **Pourquoi.** Pourquoi lie-t-on une approbation à une version de la demande ?
5. **Raisonnement pratique.** Trois approbateurs répondent chacun en environ un jour. Quel est le délai en séquentiel et en parallèle ?

#### Réponses

1. Un rappel prévient la même personne ; une escalade transfère la décision ou l'alerte à un niveau de responsabilité supérieur.
2. Par exemple : un seul approbateur, tous, quorum, séquentiel, parallèle.
3. Parce qu'une personne ne doit pas contrôler seule ce qu'elle a elle-même demandé : c'est la séparation des tâches.
4. Pour que l'approbation porte sur ce qui a été examiné : si la demande est modifiée ensuite, une nouvelle décision est nécessaire.
5. Environ 3 jours en séquentiel (somme), environ 1 jour en parallèle (maximum).

## 6.5 Délai d'expiration et nouvelle tentative

### 1. Comprendre simplement

Un **délai d'expiration** (*timeout*) est la durée maximale qu'on accepte d'attendre avant de renoncer ou de suivre un autre chemin. Une **nouvelle tentative** (*retry*) consiste à refaire une opération qui a échoué, dans l'espoir que l'échec était passager.

**Pourquoi cela existe.** Dans un système réparti, les opérations échouent souvent pour des raisons temporaires : réseau saturé, service redémarré, verrou concurrent. Attendre sans fin bloque tout. Ne jamais réessayer transforme chaque incident passager en échec définitif.

**Problème résolu.** Rendre un processus robuste face aux défaillances passagères, sans qu'il se bloque ni n'amplifie la panne.

**Modèle mental.** Appeler quelqu'un : si personne ne répond après dix sonneries, on raccroche (délai). On réessaie un peu plus tard, en espaçant les appels (nouvelle tentative avec temporisation), mais on ne rappelle pas cent fois par minute.

**Où l'analogie s'arrête.** Un téléphone qui sonne dans le vide n'a aucun effet. Réessayer une opération peut avoir des effets : créer deux fois une ressource si on ne sait pas si la première tentative a abouti.

**Exemple.** Une étape de workflow appelle le système de facturation. Il ne répond pas dans les 10 secondes (délai). Le workflow réessaie après 2, 4 puis 8 secondes. Après quatre échecs, il passe en erreur et alerte un opérateur.

**Les composants.**

1. un **délai** (technique ou métier) ;
2. une **politique de reprise** (nombre, espacement) ;
3. un **classement des erreurs** (transitoires, permanentes) ;
4. une **sortie** quand les reprises sont épuisées.

**Objectif d'apprentissage :** vous pouvez définir une politique de reprise avec temporisation croissante, et dire pourquoi elle suppose des opérations idempotentes.

### 2. Connaissances essentielles

#### Définition

- **Délai d'expiration** : limite de temps après laquelle une opération ou une attente est considérée comme échouée ou déclenche une action alternative.
- **Nouvelle tentative** : réexécution automatique d'une opération après un échec, selon une politique (nombre maximal, espacement, conditions).

#### Idées fondamentales

1. **Tout appel a un délai.** Une attente sans limite est un défaut de conception.
2. **Deux familles de délais.** Techniques (réseau, requête) et métier (une approbation dans les 48 h).
3. **On ne réessaie que les erreurs passagères.** Réessayer une demande invalide ne sert à rien.
4. **La reprise espace ses tentatives.** Temporisation croissante et aléa.
5. **Réessayer suppose l'idempotence.** Sinon, on duplique les effets (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
6. **Les reprises ont une fin.** Une sortie prévue : alerte, compensation, file d'erreurs.

#### Vocabulaire essentiel

- **Temporisation exponentielle** (*exponential backoff*) : durée d'attente qui double à chaque tentative.
- **Aléa** (*jitter*) : variation aléatoire qui évite que tous les clients réessaient au même instant.
- **Erreur transitoire** (*transient error*) : erreur susceptible de disparaître.
- **Disjoncteur** (*circuit breaker*) : mécanisme qui cesse temporairement d'appeler un service en échec.
- **Budget de reprises** (*retry budget*) : plafond du total de reprises autorisées.
- **Tempête de reprises** (*retry storm*) : surcharge provoquée par des reprises simultanées.
- **File des échecs** (*dead-letter queue*) : destination des opérations qui ont épuisé leurs reprises (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Relations de cause à effet

- Un service est surchargé et répond lentement. Tous ses clients réessaient : la charge augmente encore, et la panne s'aggrave.
- Plusieurs couches réessaient chacune trois fois. Une seule requête d'origine peut devenir $3 \times 3 \times 3 = 27$ appels au service du bas.
- Un délai est plus long que celui de l'appelant. L'appelant abandonne avant que l'opération n'ait fini, et ne sait pas si elle a réussi.

#### Idées reçues

- **« Réessayer, c'est toujours mieux. »** Non. Sans limite, temporisation et idempotence, cela aggrave les pannes et duplique les effets.
- **« Un délai court est plus sûr. »** Non. Un délai trop court produit des faux échecs ; un délai trop long bloque. Il se règle sur la distribution réelle des durées.
- **« On peut réessayer toutes les erreurs. »** Non. Les erreurs permanentes (donnée invalide, droit refusé) ne se corrigent pas par une reprise.

#### Principe clé

Bornez toute attente, ne réessayez que ce qui est passager et idempotent, espacez les tentatives avec de l'aléa, et prévoyez ce qui se passe quand les tentatives sont épuisées.

#### Si vous ne retenez que trois choses

1. Chaque attente a un délai, et chaque reprise une limite.
2. On espace les reprises avec une temporisation croissante et de l'aléa.
3. Réessayer exige des opérations idempotentes et un classement des erreurs.

### 3. Explication technique détaillée

#### Les délais

| Niveau | Exemple | Valeur typique |
|---|---|---|
| Connexion | Établir une connexion réseau | Quelques secondes |
| Requête | Réponse d'un service | Secondes à dizaines de secondes |
| Étape de workflow | Exécution d'une action | Minutes |
| Tâche humaine | Approbation | Heures à jours (voir [6.4 Approbation et escalade](#64-approbation-et-escalade)) |
| Processus | Durée maximale totale | Jours à semaines |

**Règle de cohérence.** Le délai d'un appelant doit être **supérieur** à celui de l'appelé, sinon l'appelant abandonne avant que l'appelé n'ait fini.

#### La temporisation exponentielle avec aléa

$$d_n = \min\big(d_{\max},\; d_0 \times 2^{\,n}\big) + \text{aléa}$$

où $d_n$ est l'attente avant la tentative $n$ (à partir de 0), $d_0$ l'attente initiale, $d_{\max}$ le plafond, et « aléa » une valeur aléatoire (par exemple entre 0 et 20 % de la durée).

**Exemple chiffré.** Avec $d_0 = 1$ s et $d_{\max} = 60$ s, les attentes sont 1, 2, 4, 8, 16, 32, puis 60 s, chacune plus un aléa. Sans aléa, mille clients en échec réessaieraient tous aux mêmes instants (1 s, 2 s, 4 s...), et leurs reprises s'additionneraient en vagues.

#### L'amplification entre couches

Si chaque couche fait $k$ tentatives et qu'il y a $n$ couches empilées, une requête d'origine peut produire jusqu'à $k^n$ appels sur la dernière.

| Couches | Tentatives par couche | Appels maximaux sur la dernière couche |
|---|---|---|
| 1 | 3 | 3 |
| 2 | 3 | 9 |
| 3 | 3 | 27 |

On évite l'amplification en ne réessayant qu'à **un seul niveau** (en général, le plus proche du client final), et en utilisant un budget de reprises.

#### La politique de reprise d'une étape

```json
{
  "step": "bill_customer",
  "timeout": "PT10S",
  "retry": {
    "max_attempts": 4,
    "backoff": { "type": "exponential", "initial": "PT2S", "max": "PT1M", "jitter": 0.2 },
    "retry_on": ["timeout", "unavailable", "rate_limited"],
    "do_not_retry_on": ["validation_failed", "forbidden"]
  },
  "on_exhausted": { "route": "dead_letter", "notify": "operations" }
}
```

#### L'incertitude après un délai

Un délai écoulé ne dit pas si l'opération a eu lieu (voir [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)). Avant de réessayer, on doit :

1. soit utiliser une opération **idempotente** avec la même clé (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)) ;
2. soit **interroger** l'état avant de refaire ;
3. soit accepter l'incertitude et la traiter par une compensation.

#### Le disjoncteur

Quand un service échoue de façon répétée, le disjoncteur s'ouvre : les appels suivants échouent immédiatement pendant un temps, sans charger le service, puis un essai prudent teste son retour.

```text
fermé ──(trop d'échecs)──► ouvert ──(délai écoulé)──► semi-ouvert ──(succès)──► fermé
                               ▲                          │ échec
                               └──────────────────────────┘
```

**Contre-exemple.** Une boucle `while (échec) réessayer()` sans limite ni attente, sur un appel non idempotent. Au premier incident, elle sature le service appelé et crée des centaines de doublons.

**Limites.** Les valeurs de délai et de reprise se règlent sur des mesures réelles. Des valeurs « raisonnables » choisies a priori sont rarement optimales, et elles doivent être revues avec l'évolution de la charge.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | L'incertitude d'un appel distribué motive délais et reprises |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Le classement des erreurs détermine ce qui est réessayé |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend les reprises sûres |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La file des échecs reçoit les opérations épuisées |
| [6.4 Approbation et escalade](#64-approbation-et-escalade) | Les délais métier déclenchent les escalades |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | La tolérance aux pannes s'appuie sur ces mécanismes |

### 5. Application pratique

**Situation initiale.** Un workflow notifie un système de facturation externe à chaque clôture de constat. Un matin, le service de facturation est lent pendant dix minutes.

**Problème.** Les clients du workflow réessaient immédiatement, plusieurs fois par seconde, ce qui aggrave la lenteur. Certains constats sont facturés deux fois.

**Application du concept.** Politique de reprise avec temporisation exponentielle, aléa, plafond, idempotence et file des échecs.

**Déroulé.**

1. L'appel porte une clé d'idempotence (identifiant du constat).
2. Un délai de 10 s est appliqué à chaque tentative.
3. Les reprises se font à 2, 4, 8 puis 16 s avec aléa.
4. Après quatre échecs, l'opération va dans une file des échecs et une alerte est émise.
5. Le service de facturation récupère ; un opérateur relance les opérations de la file.

**Résultat.** Plus de tempête de requêtes, plus de doublon, et aucune opération perdue.

**Limites.** Les opérations dans la file des échecs demandent un suivi : sans responsable, elles s'y accumulent sans être traitées (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un délai d'expiration, et qu'est-ce qu'une nouvelle tentative ?
2. **Compréhension.** Pourquoi ajoute-t-on de l'aléa à la temporisation ?
3. **Compréhension.** Quelles erreurs ne doit-on pas réessayer ?
4. **Pourquoi.** Pourquoi les reprises exigent-elles des opérations idempotentes ?
5. **Raisonnement pratique.** Trois couches empilées réessaient chacune quatre fois. Combien d'appels maximum reçoit la dernière couche pour une requête ?

#### Réponses

1. Un délai est la durée maximale d'attente avant de renoncer ; une nouvelle tentative est la réexécution d'une opération après un échec.
2. Pour que les clients en échec ne réessaient pas tous au même instant, ce qui créerait des vagues de requêtes.
3. Les erreurs permanentes : donnée invalide, droit refusé, ressource inexistante.
4. Parce qu'on ne sait pas toujours si la première tentative a abouti : sans idempotence, la reprise duplique les effets.
5. $4 \times 4 \times 4 = 64$ appels au maximum.

## 6.6 Règle métier, règle de validation, contrainte et politique

### 1. Comprendre simplement

Quatre mots désignent des « règles », à des niveaux différents. Une **règle métier** (*business rule*) est un énoncé qui définit ou encadre un aspect de l'activité : « un aéronef dont l'inspection est en retard ne peut pas être affecté à un vol ». Une **règle de validation** (*validation rule*) vérifie la qualité d'une donnée saisie. Une **contrainte** (*constraint*) est une condition qui doit toujours être vraie. Une **politique** (*policy*) est une orientation plus générale, mise en œuvre par des règles.

**Pourquoi cela existe.** Une entreprise vit de règles : réglementation, contrats, usages, décisions de la direction. Pour qu'une plateforme les applique de façon cohérente, il faut les exprimer explicitement, les classer, et les séparer du code.

**Problème résolu.** Donner un vocabulaire et un emplacement à chaque famille de règles, pour qu'elles soient écrites une fois, appliquées partout et modifiables par les personnes qui en ont la charge.

**Modèle mental.** Le règlement d'une entreprise : la **politique** générale (« la sécurité des vols prime »), des **règles métier** précises qui la déclinent (« aucun vol sans inspection à jour »), des **contrôles de saisie** (validation) et des **verrous** qui ne se contournent pas (contraintes).

**Où l'analogie s'arrête.** Un règlement papier est interprété par des humains. Une plateforme les exécute sans nuance : une règle mal écrite est appliquée à la lettre, partout.

**Exemple.**

| Niveau | Énoncé |
|---|---|
| Politique | « La navigabilité des aéronefs est notre priorité. » |
| Règle métier | « Un aéronef dont l'inspection est en retard ne peut pas être programmé. » |
| Règle de validation | « La date d'inspection doit être une date valide, non antérieure à la date de mise en service. » |
| Contrainte | « L'immatriculation est unique dans le tenant. » |

**Les composants d'une règle.**

1. un **énoncé** clair ;
2. des **conditions** ;
3. un **effet** (autoriser, refuser, calculer, déclencher) ;
4. un **moment** d'application ;
5. un **responsable**.

**Objectif d'apprentissage :** vous pouvez classer un énoncé parmi ces quatre catégories et dire où l'exprimer.

### 2. Connaissances essentielles

#### Définition

- **Règle métier** : énoncé qui définit ou contraint un aspect de l'activité d'une organisation, exprimé de façon précise et compréhensible par les acteurs métier.
- **Règle de validation** : règle qui contrôle la conformité d'une donnée (format, plage, présence, cohérence) au moment de sa saisie.
- **Contrainte** : condition que le système garantit toujours vraie ; sa violation est un échec de l'opération.
- **Politique** : directive générale, stable, qui oriente les décisions et que des règles précises mettent en œuvre.

#### Idées fondamentales

1. **Les règles sont organisées en niveaux.** Politique, règle métier, validation et contrainte, du plus général au plus précis.
2. **Une règle s'exprime séparément du code.** Elle est relue, testée et changée par les responsables.
3. **Une règle a un moment d'application.** À l'écriture, à une transition, sur un événement, à la lecture.
4. **Les règles sont de natures différentes.** Contrôler (interdire), calculer (dériver), déclencher (réagir).
5. **Une règle a un propriétaire.** Quelqu'un est responsable de son contenu et de ses évolutions.
6. **Les règles doivent être cohérentes entre elles.** Un ensemble contradictoire produit des comportements imprévisibles.

#### Vocabulaire essentiel

- **Règle de dérivation** (*derivation rule*) : règle qui calcule une valeur à partir d'autres.
- **Règle de contrôle** (*constraint rule*) : règle qui interdit certains états ou actions.
- **Règle de réaction** (*action rule*, *event-condition-action*) : règle qui déclenche une action sur un événement.
- **Invariant** (*invariant*) : propriété qui doit être vraie en permanence (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).
- **Référentiel de règles** (*rule repository*) : catalogue central des règles.
- **Manifeste des règles métier** : texte de référence du *Business Rules Group* (2003) qui défend l'expression explicite des règles.

#### Relations de cause à effet

- Les règles sont éparpillées dans le code. Chaque modification demande de les retrouver partout, et personne ne connaît l'ensemble.
- Une règle métier est déguisée en validation de saisie. Elle n'est appliquée que par l'interface, et contournée par l'API.
- Deux règles se contredisent. Le comportement dépend de l'ordre d'évaluation, donc du hasard.

#### Idées reçues

- **« Une règle de validation et une règle métier, c'est la même chose. »** Non. La validation contrôle la qualité d'une donnée ; la règle métier encadre une décision ou un comportement.
- **« Les contraintes sont la responsabilité de la base de données. »** Celles qui sont structurelles, oui. Les contraintes métier dépendent du contexte et du moteur.
- **« Une politique, c'est une règle plus longue. »** Non. Une politique est une orientation ; elle se décline en règles vérifiables.

#### Principe clé

Exprimez chaque règle à son niveau (politique, règle, validation, contrainte), dans un lieu unique, avec un propriétaire, et appliquez-la au bon moment.

#### Si vous ne retenez que trois choses

1. Politique, règle métier, validation et contrainte forment une hiérarchie du général au précis.
2. Une règle est exprimée séparément du code, avec un moment d'application et un propriétaire.
3. Les règles d'un ensemble doivent être cohérentes et testées ensemble.

### 3. Explication technique détaillée

#### Les familles de règles

| Famille | Rôle | Exemple | Moment d'application |
|---|---|---|---|
| Validation | Contrôler une donnée | Format de l'immatriculation | Écriture |
| Contrainte | Garantir un invariant | Une seule réservation par baie et période | Écriture (atomique) |
| Contrôle métier | Interdire ou autoriser une action | Pas de vol sans inspection à jour | Transition, action |
| Dérivation | Calculer une valeur | Jours avant l'échéance | Lecture ou écriture |
| Réaction | Déclencher une action | Tâche créée si l'inspection est en retard | Événement |
| Décision | Choisir un résultat parmi plusieurs | Intervalle d'inspection selon la catégorie | À la demande |

#### Une règle comme donnée

```json
{
  "key": "no_flight_with_overdue_inspection",
  "kind": "control",
  "statement": "Un aéronef dont l'inspection est en retard ne peut pas être affecté à un vol.",
  "applies_to": { "resource": "flight", "operation": ["create", "update"] },
  "when": "flight.aircraft.next_inspection_date < flight.start_date",
  "effect": { "type": "reject", "code": "inspection_overdue",
              "message": "L'inspection de l'aéronef sera en retard à la date du vol." },
  "owner": "role:quality_manager",
  "version": 4
}
```

**Comment la lire.** La règle s'applique à la création et à la modification d'un vol. Si l'inspection de l'aéronef est postérieure à la date du vol, l'opération est refusée avec un code et un message. Elle a un propriétaire et une version.

#### La différence avec la validation

| Critère | Validation | Règle métier |
|---|---|---|
| Porte sur | Une donnée saisie | Une décision, un comportement |
| Données utilisées | La ressource elle-même | Souvent plusieurs ressources, l'état, le contexte |
| Propriétaire | Équipe produit, qualité des données | Responsable métier |
| Changement | Rare | Fréquent (réglementation, contrat) |

#### Les conflits entre règles

Deux règles peuvent se contredire (« le planificateur peut modifier un vol » et « aucun vol ne se modifie à moins de 24 h »). On résout par :

1. une **priorité** explicite ;
2. une règle de **combinaison** (le refus l'emporte) ;
3. des **tests** de scénarios qui exercent les combinaisons.

#### Où la règle s'exécute

```text
Écriture  ──►  validation ──► contraintes ──► règles de contrôle ──► persistance
Transition ──► gardes ──► règles de contrôle ──► effets
Événement  ──► règles de réaction ──► actions
Lecture    ──► règles de dérivation ──► valeur calculée
```

**Contre-exemple.** « Un aéronef retiré ne doit pas être affecté » codée comme condition d'affichage dans l'écran de planification. L'import en masse, l'API et l'application mobile n'appliquent pas la règle.

**Limites.** Plus on externalise de règles, plus le référentiel devient lourd. Il faut des propriétaires, une revue régulière, et des outils pour retrouver les règles qui s'appliquent à une opération (voir [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Les contraintes de la base en sont le niveau structurel |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | Les règles de validation en sont une famille |
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) | Les politiques d'accès sont des politiques au sens large |
| [6.7 Condition et éligibilité](#67-condition-et-éligibilité) | Les conditions et l'éligibilité composent les règles |
| [6.10 Moteur de règles](#610-moteur-de-règles) | Le moteur de règles les évalue |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants sont les règles qui ne doivent jamais être fausses |

### 5. Application pratique

**Situation initiale.** Après une inspection de l'autorité, la compagnie doit appliquer une nouvelle règle : « un aéronef ne peut plus être programmé s'il lui reste moins de 10 heures avant l'échéance de visite ».

**Problème.** La règle doit être effective partout (interface, API, imports), dès demain, sans développement.

**Application du concept.** Le responsable qualité ajoute une règle de contrôle dans le référentiel.

**Déroulé.**

1. Il crée la règle avec son énoncé, sa condition et son effet de refus.
2. Il la teste sur des vols d'exemple : elle refuse deux vols de test, en accepte un.
3. Il la publie. Elle s'applique à toute création ou modification de vol.
4. Les imports et l'API reçoivent le même refus, avec le même code.

**Résultat.** La nouvelle exigence est appliquée de façon uniforme, avec un propriétaire et une version.

**Limites.** Les vols déjà programmés ne sont pas touchés : il faut une analyse d'impact et, si nécessaire, une procédure de reprogrammation (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une règle de validation et une règle métier ?
2. **Compréhension.** Qu'est-ce qu'une contrainte ?
3. **Compréhension.** Quelle différence y a-t-il entre une politique et une règle ?
4. **Pourquoi.** Pourquoi exprime-t-on les règles séparément du code ?
5. **Raisonnement pratique.** Une règle est appliquée par l'écran mais pas par l'API. Quelle erreur de conception cela révèle-t-il ?

#### Réponses

1. La validation contrôle la qualité d'une donnée saisie ; la règle métier encadre une décision ou un comportement, souvent en croisant plusieurs données.
2. Une condition que le système garantit toujours vraie ; sa violation fait échouer l'opération.
3. Une politique est une orientation générale ; une règle est une déclinaison précise, vérifiable et exécutable.
4. Pour que les responsables puissent les relire, les tester et les modifier, et pour les appliquer partout de la même façon.
5. La règle est portée par l'interface et non par le moteur : elle doit être appliquée côté serveur, à chaque chemin d'accès.

## 6.7 Condition et éligibilité

### 1. Comprendre simplement

Une **condition** (*condition*) est une expression qui, évaluée sur des données et un contexte, est **vraie** ou **fausse** : « l'aéronef est actif **et** son inspection est dans moins de 30 jours ». C'est la brique de base des règles, des gardes de transition et des filtres. L'**éligibilité** (*eligibility*) est le résultat d'une évaluation qui dit si une entité **remplit les critères** pour obtenir quelque chose, avec les raisons si ce n'est pas le cas.

**Pourquoi cela existe.** Presque toute décision métier se ramène à une question : « cette personne, cet aéronef, cette demande peuvent-ils faire ou recevoir ceci ? ». Il faut un moyen d'exprimer les critères, de les évaluer de façon fiable et d'expliquer le résultat.

**Problème résolu.** Exprimer des critères de décision de façon explicite, vérifiable et explicable.

**Modèle mental.** Un formulaire de demande d'aide : une liste de critères (âge, revenus, situation) ; chaque critère est une condition ; l'ensemble donne l'éligibilité, avec le motif en cas de refus.

**Où l'analogie s'arrête.** Un formulaire est lu par un humain qui interprète. Une plateforme évalue les conditions de façon mécanique : une valeur manquante, un fuseau horaire ou une comparaison de texte peuvent produire un résultat inattendu.

**Exemple.** Un technicien est **éligible** à signer une tâche moteur si : sa licence est valide, sa qualification couvre le modèle du moteur, il n'est pas en congé, et il n'est pas l'auteur de la tâche.

**Les composants.**

1. des **opérandes** (champs, valeurs, fonctions) ;
2. des **opérateurs** (comparaison, logique) ;
3. un **résultat** vrai ou faux ;
4. pour l'éligibilité : des **raisons** associées à chaque critère.

**Objectif d'apprentissage :** vous pouvez écrire une condition composée, expliquer le rôle des valeurs nulles, et structurer un résultat d'éligibilité explicable.

### 2. Connaissances essentielles

#### Définition

- **Condition** : expression booléenne évaluée sur des données et un contexte, dont le résultat est vrai, faux (ou inconnu en présence de valeurs absentes).
- **Éligibilité** : détermination, à partir d'un ensemble de conditions, de la capacité d'une entité à accéder à un droit, une action ou un avantage, accompagnée des motifs d'un éventuel refus.

#### Idées fondamentales

1. **Une condition est une expression booléenne.** Comparaisons combinées par ET, OU, NON.
2. **Une condition a trois résultats possibles.** Vrai, faux, inconnu quand une valeur manque.
3. **L'éligibilité est composée.** Tous les critères, ou un sous-ensemble, doivent être satisfaits.
4. **Un refus s'explique.** On retourne les critères non satisfaits.
5. **Le temps fait partie du contexte.** « Maintenant » doit être fixé et explicite.
6. **Les conditions sont testables.** Avec des cas types et des cas limites.

#### Vocabulaire essentiel

- **Prédicat** (*predicate*) : fonction qui retourne vrai ou faux.
- **Opérateur logique** (*logical operator*) : ET, OU, NON.
- **Logique à trois valeurs** (*three-valued logic*) : vrai, faux, inconnu.
- **Évaluation paresseuse** (*short-circuit evaluation*) : arrêt dès que le résultat est connu.
- **Critère** (*criterion*) : condition élémentaire d'une éligibilité.
- **Motif de refus** (*ineligibility reason*) : raison d'un critère non satisfait.
- **Table de vérité** (*truth table*) : liste de tous les résultats pour toutes les valeurs d'entrée.

#### Relations de cause à effet

- Une valeur est absente (nulle). Une comparaison avec elle ne donne ni vrai ni faux, mais « inconnu » : selon la règle, l'accès est accordé ou refusé par erreur.
- Une condition utilise « maintenant » sans fuseau. Selon l'endroit où elle est évaluée, le résultat diffère autour de minuit.
- L'éligibilité ne retourne que « oui » ou « non ». L'utilisateur refusé ne sait pas quoi corriger.

#### Idées reçues

- **« Une condition est vraie ou fausse, c'est tout. »** Avec des valeurs absentes, il existe un troisième résultat : inconnu. Ne pas le traiter est une source classique d'erreurs.
- **« L'éligibilité est un simple booléen. »** Un booléen sans raison n'est pas actionnable. Le résultat doit expliquer.
- **« Les conditions sont un détail technique. »** Elles portent la règle métier : une erreur d'inégalité large ou stricte a des conséquences réelles.

#### Principe clé

Une condition doit dire ce qu'elle fait de l'absence et du temps ; une éligibilité doit dire pourquoi elle refuse.

#### Si vous ne retenez que trois choses

1. Une condition est une expression logique sur des données et un contexte.
2. Les valeurs absentes produisent un résultat « inconnu » qu'il faut traiter explicitement.
3. L'éligibilité retourne un verdict et des motifs.

### 3. Explication technique détaillée

#### Des conditions comme données

```json
{
  "all": [
    { "field": "aircraft.status", "op": "eq", "value": "active" },
    { "any": [
        { "field": "aircraft.next_inspection_date", "op": "is_null" },
        { "field": "aircraft.next_inspection_date", "op": "gte", "value": { "fn": "today" } }
    ]},
    { "not": { "field": "aircraft.base", "op": "in", "value": ["TLS"] } }
  ]
}
```

**Comment la lire.** Toutes les conditions doivent être vraies : l'aéronef est actif, **et** (sa date d'inspection est absente **ou** n'est pas dépassée), **et** il n'est pas basé à Toulouse. La structure arborescente (`all`, `any`, `not`) est une représentation d'un arbre d'expression.

#### La logique à trois valeurs

Comme en SQL, une comparaison avec une valeur absente donne « inconnu ».

| A | B | A ET B | A OU B | NON A |
|---|---|---|---|---|
| vrai | inconnu | inconnu | vrai | faux |
| faux | inconnu | faux | inconnu | vrai |
| inconnu | inconnu | inconnu | inconnu | inconnu |

**Conséquence.** Une règle de refus « refuser si la date d'inspection est dépassée » ne refuse pas un aéronef dont la date est absente, car la condition est « inconnue ». Il faut décider explicitement : une date absente est-elle acceptable ou non ?

#### Le résultat d'éligibilité

```json
{
  "subject": "technician/u_42",
  "decision": "ineligible",
  "criteria": [
    { "key": "license_valid",        "met": true },
    { "key": "model_qualification",  "met": false,
      "reason": "Qualification A320 absente",
      "how_to_fix": "Compléter la formation moteur A320" },
    { "key": "not_on_leave",         "met": true },
    { "key": "not_task_author",      "met": true }
  ]
}
```

**Pourquoi cette forme.** Le résultat n'est pas seulement « inéligible » : il indique quel critère échoue, pourquoi et comment y remédier. Cette information alimente l'interface (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) et la décision humaine.

#### Les pièges des conditions

| Piège | Exemple | Parade |
|---|---|---|
| Valeur absente | `date < aujourd'hui` avec date nulle | Définir explicitement le comportement |
| Fuseau horaire | « Aujourd'hui » évalué en UTC ou en heure locale | Fixer le fuseau de référence |
| Comparaison de texte | « 10 » < « 9 » | Typer les champs |
| Inégalité large ou stricte | `>=` contre `>` | Écrire le test limite |
| Précision numérique | Comparer des décimaux calculés | Tolérance ou types décimaux |
| Évaluation dans le temps | « Aujourd'hui » change entre deux évaluations | Fixer l'instant d'évaluation |

#### L'évaluation et la mise en cache

Une éligibilité coûteuse (plusieurs requêtes) peut être calculée à la demande ou précalculée et mise en cache. Le cache doit être invalidé quand les données sources changent (par exemple la fin d'une licence). Il vaut mieux afficher la date de dernière évaluation.

**Contre-exemple.** Un « booléen » `eligible` stocké sur la fiche du technicien, mis à jour à la main. Il devient faux sans que personne ne s'en aperçoive, et plus aucune règle ne sait pourquoi.

**Limites.** Une éligibilité très composée devient difficile à expliquer. On structure les critères en groupes (réglementaire, organisationnel, disponibilité) pour garder le résultat lisible.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.2 Transition et machine à états](#62-transition-et-machine-à-états) | Les gardes de transition sont des conditions |
| [6.6 Règle métier, règle de validation, contrainte et politique](#66-règle-métier-règle-de-validation-contrainte-et-politique) | Les règles s'appuient sur des conditions |
| [6.8 Expression et formule](#68-expression-et-formule) | Les expressions sont le langage des conditions |
| [4.16 ABAC](04-identite-iam-autorisation.md#416-abac) | Les politiques d'accès par attributs évaluent des conditions |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'explicabilité demande des motifs de refus |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les conditions dépendent souvent du temps |

### 5. Application pratique

**Situation initiale.** La planificatrice affecte des techniciens à des tâches moteur. Elle découvre trop tard qu'un technicien n'était pas qualifié.

**Problème.** Les critères de qualification sont connus, mais appliqués à la main, et le refus tardif désorganise le planning.

**Application du concept.** Une éligibilité calculée et affichée au moment de l'affectation, avec les motifs.

**Déroulé.**

1. L'administrateur définit l'éligibilité « signer une tâche moteur » avec quatre critères.
2. Quand la planificatrice choisit un technicien, la plateforme évalue les critères.
3. L'interface grise les techniciens inéligibles et affiche le motif au survol.
4. Si la planificatrice force le choix, le moteur refuse l'affectation avec le détail.

**Résultat.** Les affectations non conformes disparaissent, et les motifs de refus sont compris.

**Limites.** Une éligibilité affichée peut être obsolète quelques minutes plus tard : le moteur la revérifie à l'enregistrement.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les trois résultats possibles d'une condition ?
2. **Compréhension.** Que doit contenir un résultat d'éligibilité en cas de refus ?
3. **Compréhension.** Pourquoi le fuseau horaire importe-t-il dans une condition de date ?
4. **Pourquoi.** Pourquoi ne stocke-t-on pas l'éligibilité comme un booléen modifiable ?
5. **Raisonnement pratique.** Une règle refuse les aéronefs « dont la date d'inspection est dépassée ». Un aéronef a une date absente. Que se passe-t-il, et comment corriger ?

#### Réponses

1. Vrai, faux et inconnu (quand une valeur manque).
2. Le verdict, les critères non satisfaits, la raison de chacun et, si possible, la façon d'y remédier.
3. Parce que « aujourd'hui » dépend du fuseau : autour de minuit, la condition peut être vraie dans un fuseau et fausse dans l'autre.
4. Parce qu'une valeur stockée manuellement devient fausse sans qu'on le sache, et que plus aucune règle n'en explique l'origine : il faut la calculer.
5. La condition est « inconnue » et ne refuse pas l'aéronef. Il faut décider explicitement du comportement pour une date absente (par exemple la refuser), et l'écrire dans la règle.

## 6.8 Expression et formule

### 1. Comprendre simplement

Une **expression** (*expression*) est une petite combinaison de valeurs, de champs, d'opérateurs et de fonctions qui s'évalue en une valeur : `jours_entre(aujourd'hui(), prochaine_inspection)`. Une **formule** (*formula*) est une expression utilisée pour **calculer la valeur d'un champ**, comme dans un tableur.

**Pourquoi cela existe.** Les administrateurs veulent définir des conditions et des champs calculés sans développeur. Pour cela, la plateforme doit leur offrir un langage simple et sûr, capable d'exprimer des calculs et des tests.

**Problème résolu.** Permettre à des non-développeurs d'exprimer de la logique de calcul et de test, sans mettre en danger la plateforme.

**Modèle mental.** Une cellule de tableur. On y écrit `=B2 - A2`, et la valeur est calculée à partir des autres cellules, sans programmer.

**Où l'analogie s'arrête.** Dans un tableur, l'utilisateur est seul sur son fichier. Dans une plateforme, une expression écrite par un client s'exécute chez le fournisseur, parmi d'autres clients : sécurité et limites de ressources deviennent essentielles.

**Exemple.** Le champ calculé `jours_avant_inspection` a pour formule `jours_entre(aujourd'hui(), prochaine_inspection)`. Une garde de transition utilise l'expression `jours_avant_inspection < 10`.

**Les composants.**

1. une **grammaire** (la syntaxe du langage) ;
2. des **opérateurs** et des **fonctions** ;
3. des **références** à des champs et au contexte ;
4. un **évaluateur** sûr et borné.

**Objectif d'apprentissage :** vous pouvez décrire les propriétés d'un langage d'expressions sûr, et expliquer le danger d'évaluer du code fourni par un utilisateur.

### 2. Connaissances essentielles

#### Définition

- **Expression** : construction du langage de la plateforme qui, évaluée dans un contexte de données, produit une valeur typée.
- **Formule** : expression associée à un champ calculé ou à une règle de dérivation, qui détermine sa valeur à partir d'autres données.

#### Idées fondamentales

1. **Le langage est limité et typé.** Il offre des opérateurs et des fonctions choisis, pas un langage de programmation complet.
2. **L'évaluation est sûre.** Pas d'accès au système, pas de boucle infinie, ressources bornées.
3. **Elle est déterministe.** Mêmes données, même résultat, sauf fonctions explicitement temporelles.
4. **Une expression est analysée une fois, exécutée souvent.** Analyse, vérification de types, puis évaluation.
5. **Les formules créent des dépendances.** Un champ calculé dépend d'autres champs, sans cycle.
6. **Le langage évolue avec précaution.** Chaque fonction ajoutée est un contrat.

#### Vocabulaire essentiel

- **Analyse syntaxique** (*parsing*) : transformation du texte en arbre.
- **Arbre syntaxique abstrait** (*abstract syntax tree*, *AST*) : représentation arborescente d'une expression.
- **Bac à sable** (*sandbox*) : environnement d'exécution isolé et borné.
- **Champ calculé** (*computed field*, *formula field*) : champ dont la valeur est une formule.
- **Graphe de dépendances** (*dependency graph*) : relations « le champ A dépend du champ B ».
- **Pureté** (*purity*) : absence d'effet de bord dans l'évaluation.
- **Injection** (*injection*) : exécution de contenu fourni par un attaquant comme du code.

#### Relations de cause à effet

- Les expressions sont évaluées par un `eval` du langage hôte. Un utilisateur peut exécuter du code arbitraire sur le serveur.
- Aucune limite de temps ni de profondeur. Une expression volontairement lourde épuise le processeur de la plateforme.
- Un champ calculé en référence un autre qui le référence. Le calcul ne termine pas : il faut détecter les cycles à l'enregistrement.

#### Idées reçues

- **« Un langage d'expressions est simple à construire. »** Les cas limites (types, valeurs absentes, dates, arrondis, sécurité) en font un chantier à part entière.
- **« On peut réutiliser le langage de programmation du serveur. »** C'est dangereux : il donne accès à tout ce que le processus peut faire.
- **« Une formule est évaluée une seule fois. »** Elle doit être recalculée quand ses entrées changent, ou à chaque lecture selon le choix de conception.

#### Principe clé

Un langage d'expressions pour des clients doit être limité, typé, déterministe, sans effet de bord et borné en ressources.

#### Si vous ne retenez que trois choses

1. Une expression s'évalue en une valeur ; une formule définit un champ calculé.
2. Le langage doit être sûr : pas d'exécution de code arbitraire, ressources limitées.
3. Les formules créent un graphe de dépendances qui doit rester sans cycle.

### 3. Explication technique détaillée

#### Exemples d'expressions

| Expression | Résultat | Usage |
|---|---|---|
| `jours_entre(aujourd'hui(), prochaine_inspection)` | Nombre entier | Champ calculé |
| `statut = "actif" ET jours_avant_inspection >= 10` | Booléen | Condition, garde |
| `si(heures_de_vol > 5000, "lourde", "légère")` | Texte | Catégorie dérivée |
| `somme(taches.cout)` | Nombre | Agrégat sur une relation |
| `concat(modele, " — ", immatriculation)` | Texte | Libellé affiché |

#### Du texte à la valeur

```text
Texte : jours_avant_inspection < 10 ET statut = "actif"
   │  analyse lexicale et syntaxique
   ▼
Arbre :        ET
             /    \
           <        =
          / \      / \
 jours_avant 10  statut "actif"
   │  vérification des types
   ▼
Arbre typé (booléen)
   │  évaluation avec le contexte (valeurs de la ressource)
   ▼
Résultat : vrai | faux | inconnu
```

**Pourquoi la compilation en arbre.** L'analyse est faite une fois à l'enregistrement : les erreurs de syntaxe et de type sont détectées tôt, et l'évaluation est rapide (l'arbre est mis en cache).

#### Les garde-fous d'exécution

| Garde-fou | Raison |
|---|---|
| Pas d'accès aux fichiers, au réseau, au système | Isoler l'exécution |
| Limite de temps d'évaluation | Éviter l'épuisement du processeur |
| Limite de profondeur et de taille | Éviter les expressions explosives |
| Limite de mémoire | Éviter la saturation |
| Fonctions autorisées seulement | Surface d'attaque contrôlée |
| Pas d'effet de bord | Évaluation reproductible, testable |

#### Les champs calculés et leurs dépendances

```text
jours_avant_inspection = jours_entre(aujourd'hui(), prochaine_inspection)
etat_inspection        = si(jours_avant_inspection < 0, "retard",
                            si(jours_avant_inspection < 30, "proche", "ok"))
```

Le champ `etat_inspection` dépend de `jours_avant_inspection`, qui dépend de `prochaine_inspection`. Le moteur construit le graphe de dépendances :

- il refuse un **cycle** (A dépend de B qui dépend de A) à l'enregistrement ;
- il calcule dans l'**ordre** topologique ;
- il décide de **stocker** la valeur (recalculée à la modification) ou de la **calculer** à la lecture.

#### Stocker ou calculer

| Option | Avantage | Inconvénient |
|---|---|---|
| Calculé à la lecture | Toujours à jour, pas de stockage | Coût à chaque lecture, non indexable simplement |
| Stocké et recalculé à la modification | Rapide, indexable | Valeur périmée si une dépendance externe change (le temps) |
| Stocké et recalculé périodiquement | Équilibre | Fenêtre d'obsolescence |

Une formule qui dépend du temps (`aujourd'hui()`) ne peut pas être stockée sans un recalcul périodique.

#### Les langages existants

Plutôt que d'inventer un langage, beaucoup de plateformes en adoptent un existant, conçu pour l'évaluation sûre, par exemple CEL (*Common Expression Language*, conçu pour des évaluations rapides et sûres) ou des représentations JSON comme JsonLogic. Elles ajoutent leurs fonctions métier.

**Contre-exemple.** Évaluer une chaîne fournie par l'administrateur avec la fonction `eval` du langage du serveur. Une expression telle que « lire un fichier du système puis l'envoyer à une adresse externe » devient possible.

**Limites.** Un langage trop riche devient un langage de programmation, avec ses difficultés de test et de maintenance. On le garde volontairement modeste, et on renvoie les cas complexes vers des extensions (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.7 Condition et éligibilité](#67-condition-et-éligibilité) | Les conditions sont écrites avec des expressions |
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) | Un champ calculé est un type de champ |
| [13.3 Déclaratif versus impératif](13-concepts-transversaux.md#133-déclaratif-versus-impératif) | Les expressions sont une forme de description déclarative |
| [6.10 Moteur de règles](#610-moteur-de-règles) | Le moteur de règles évalue des expressions |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions prennent le relais quand le langage ne suffit pas |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces examine l'exécution de code fourni par l'utilisateur |

### 5. Application pratique

**Situation initiale.** La compagnie veut un champ « Échéance critique » : vrai si l'inspection est dans moins de 10 jours ou si le total des heures de vol dépasse un seuil par modèle.

**Problème.** Le calcul dépend de plusieurs champs et d'une table de seuils : un développeur serait nécessaire pour l'écrire en code.

**Application du concept.** L'administrateur définit un champ calculé avec une expression.

**Déroulé.**

1. Il écrit : `jours_avant_inspection < 10 OU heures_de_vol > seuil_modele(modele)`.
2. L'éditeur analyse l'expression : types vérifiés, fonction `seuil_modele` reconnue.
3. Le moteur construit le graphe de dépendances et valide l'absence de cycle.
4. Le champ s'affiche en liste et peut servir de filtre.

**Résultat.** Un champ métier utile, sans développement et sans risque pour la plateforme.

**Limites.** Comme le champ dépend de `aujourd'hui()`, il doit être recalculé chaque jour. Le moteur l'indique dans la description du champ.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une expression et une formule ?
2. **Compréhension.** Qu'est-ce qu'un arbre syntaxique ?
3. **Compréhension.** Citez trois garde-fous d'exécution d'un langage d'expressions.
4. **Pourquoi.** Pourquoi ne faut-il pas utiliser `eval` pour évaluer les expressions des clients ?
5. **Raisonnement pratique.** Un administrateur enregistre un champ A calculé à partir de B, et B calculé à partir de A. Que doit faire la plateforme ?

#### Réponses

1. Une expression s'évalue en une valeur ; une formule est une expression qui définit la valeur d'un champ calculé.
2. La représentation arborescente d'une expression, obtenue après analyse, sur laquelle on vérifie les types et on évalue.
3. Par exemple : pas d'accès au système, limite de temps, limite de profondeur, limite de mémoire, liste de fonctions autorisées.
4. Parce que cela permettrait d'exécuter du code arbitraire avec les droits du serveur : toute la plateforme et les autres clients seraient exposés.
5. Refuser l'enregistrement : le graphe de dépendances contient un cycle, et le calcul ne pourrait pas terminer.

## 6.9 Table de décision

### 1. Comprendre simplement

Une **table de décision** (*decision table*) représente un ensemble de règles sous forme de **tableau** : chaque colonne d'entrée porte une condition, chaque colonne de sortie un résultat, et chaque ligne est une règle. C'est une manière lisible d'exprimer une logique de décision qui combine plusieurs critères.

**Pourquoi cela existe.** Des conditions imbriquées (« si… alors… sinon si… ») deviennent illisibles dès que les critères se multiplient. Un tableau permet de voir d'un coup toutes les combinaisons, de vérifier qu'aucune n'est oubliée et de laisser des experts métier le maintenir.

**Problème résolu.** Rendre lisible, vérifiable et modifiable une décision qui dépend de nombreux critères.

**Modèle mental.** Une grille tarifaire ou un barème : on lit la ligne qui correspond à sa situation, et l'on trouve le résultat dans la dernière colonne.

**Où l'analogie s'arrête.** Un barème papier est lu par un humain qui repère les cas limites. Une table exécutée par une machine doit être **complète et non ambiguë**, sinon un cas tombe dans un trou ou dans un chevauchement.

**Exemple.** L'intervalle d'inspection d'un aéronef dépend de sa catégorie, de son âge et de son usage.

| Catégorie | Âge | Heures par an | Intervalle (jours) |
|---|---|---|---|
| Commercial | < 10 ans | tout | 90 |
| Commercial | ≥ 10 ans | < 1 500 | 60 |
| Commercial | ≥ 10 ans | ≥ 1 500 | 30 |
| Loisir | tout | tout | 180 |

**Les composants.**

1. des **colonnes d'entrée** (conditions) ;
2. des **colonnes de sortie** (résultats) ;
3. des **lignes** (règles) ;
4. une **politique de sélection** (*hit policy*).

**Objectif d'apprentissage :** vous pouvez lire une table de décision, repérer un chevauchement ou un trou, et choisir une politique de sélection.

### 2. Connaissances essentielles

#### Définition

Une **table de décision** est une représentation tabulaire d'une logique de décision, dans laquelle chaque ligne associe une combinaison de conditions d'entrée à un ou plusieurs résultats, évaluée selon une politique de sélection. Le standard **DMN** (*Decision Model and Notation*, OMG) en normalise le format et les politiques.

#### Idées fondamentales

1. **Une ligne est une règle.** Si toutes les conditions de la ligne sont vraies, le résultat s'applique.
2. **Le tableau rend les combinaisons visibles.** On voit les trous et les chevauchements.
3. **La politique de sélection tranche.** Unique, première, collecte, priorité.
4. **La complétude est vérifiable.** Toutes les combinaisons d'entrée possibles sont couvertes.
5. **Le contenu est modifiable par le métier.** Sans toucher au code.
6. **La table est versionnée et datée.** Les barèmes changent à des dates précises (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

#### Vocabulaire essentiel

- **Politique de sélection** (*hit policy*) : règle qui dit quelle ligne retenir quand plusieurs correspondent.
- **Complétude** (*completeness*) : toute combinaison d'entrée est couverte.
- **Chevauchement** (*overlap*) : deux lignes correspondent à la même combinaison.
- **Trou** (*gap*) : une combinaison n'est couverte par aucune ligne.
- **Valeur indifférente** (*don't care*, « tout ») : colonne qui ne restreint pas la ligne.
- **Intervalle** (*range*) : condition qui porte sur une plage de valeurs.

#### Relations de cause à effet

- Deux lignes se chevauchent sans politique claire. Le résultat dépend de l'ordre des lignes, et change si quelqu'un les réordonne.
- Un cas n'est couvert par aucune ligne. La décision échoue ou retourne un résultat vide, sans que personne ne s'en aperçoive.
- Une table grossit sans contrôle. Elle devient illisible et ne remplit plus son rôle de clarté.

#### Idées reçues

- **« Une table de décision, c'est un tableur. »** Elle en a la forme, mais elle est exécutable, avec une sémantique stricte.
- **« Plus la table est grande, mieux elle décrit. »** Au-delà de quelques dizaines de lignes, on la découpe en plusieurs tables liées.
- **« L'ordre des lignes n'a pas d'importance. »** Cela dépend de la politique de sélection : avec « première », il est essentiel.

#### Principe clé

Une table de décision est utile si elle est complète, sans ambiguïté, de taille raisonnable, et si sa politique de sélection est explicite.

#### Si vous ne retenez que trois choses

1. Une table de décision exprime des règles en lignes, avec des conditions et des résultats.
2. La politique de sélection tranche entre lignes concurrentes ; la complétude évite les trous.
3. Elle se vérifie automatiquement et se maintient par le métier.

### 3. Explication technique détaillée

#### Les politiques de sélection (DMN)

| Politique | Principe | Usage |
|---|---|---|
| Unique | Au plus une ligne correspond ; sinon erreur | Barèmes sans chevauchement |
| Première (*first*) | La première ligne correspondante, dans l'ordre | Cas particuliers puis cas général |
| Priorité (*priority*) | La ligne dont le résultat a la plus haute priorité | Choix par importance |
| N'importe laquelle (*any*) | Plusieurs lignes peuvent correspondre si elles donnent le même résultat | Redondance volontaire |
| Collecte (*collect*) | Toutes les lignes correspondantes, avec agrégation (liste, somme, minimum) | Calcul de frais cumulés |
| Ordre des règles, ordre des sorties | Résultats retournés dans un ordre défini | Listes ordonnées |

#### Une table comme donnée

```json
{
  "key": "inspection_interval",
  "hit_policy": "unique",
  "inputs": [
    { "name": "category", "type": "string" },
    { "name": "age_years", "type": "integer" },
    { "name": "hours_per_year", "type": "integer" }
  ],
  "outputs": [ { "name": "interval_days", "type": "integer" } ],
  "rules": [
    { "when": { "category": "commercial", "age_years": "< 10" },
      "then": { "interval_days": 90 } },
    { "when": { "category": "commercial", "age_years": ">= 10", "hours_per_year": "< 1500" },
      "then": { "interval_days": 60 } },
    { "when": { "category": "commercial", "age_years": ">= 10", "hours_per_year": ">= 1500" },
      "then": { "interval_days": 30 } },
    { "when": { "category": "leisure" },
      "then": { "interval_days": 180 } }
  ],
  "effective_from": "2026-01-01"
}
```

#### Vérifier la complétude

Pour $n$ colonnes d'entrée ayant chacune un nombre fini de classes de valeurs $c_i$, le nombre total de combinaisons est :

$$N = \prod_{i=1}^{n} c_i$$

**Exemple chiffré.** Avec 2 catégories, 2 classes d'âge (< 10, ≥ 10) et 2 classes d'usage (< 1 500, ≥ 1 500), il y a $2 \times 2 \times 2 = 8$ combinaisons. La table ci-dessus en couvre 8 avec 4 lignes (grâce aux valeurs indifférentes). Un outil vérifie que chacune des 8 combinaisons correspond à **une et une seule** ligne.

#### Les erreurs fréquentes

| Défaut | Détection | Effet |
|---|---|---|
| Trou | Combinaison sans ligne | Résultat vide ou erreur |
| Chevauchement | Deux lignes pour une combinaison | Résultat selon l'ordre |
| Ligne inatteignable | Entièrement masquée par une ligne précédente (politique « première ») | Règle inutile |
| Intervalles mal bornés | `< 10` et `> 10` : 10 non couvert | Trou à la valeur limite |

#### Les dates d'effet

Les barèmes changent à des dates précises (une réglementation entre en vigueur le 1er janvier). Une table porte une date d'effet, et la plateforme conserve les versions : une décision rendue le 15 décembre se rejoue avec la table qui était valable ce jour-là (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

**Contre-exemple.** Une table de 200 lignes avec 12 colonnes d'entrée, que personne ne comprend plus. Chaque modification fait craindre un effet de bord. Il vaut mieux la découper en plusieurs tables simples, chacune produisant un résultat intermédiaire.

**Limites.** Une table convient aux décisions à critères discrets et peu nombreux. Pour une logique séquentielle, avec des états et des itérations, un workflow ou du code est plus adapté.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.6 Règle métier, règle de validation, contrainte et politique](#66-règle-métier-règle-de-validation-contrainte-et-politique) | Elle exprime un ensemble de règles métier de décision |
| [6.7 Condition et éligibilité](#67-condition-et-éligibilité) | Chaque cellule d'entrée est une condition |
| [6.10 Moteur de règles](#610-moteur-de-règles) | Le moteur de règles ou de décision l'exécute |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les barèmes ont des dates d'effet |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les tables sont versionnées comme toute configuration |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | La décision doit indiquer quelle ligne a été retenue |

### 5. Application pratique

**Situation initiale.** Les intervalles d'inspection sont codés en dur dans le moteur de planification. Chaque évolution réglementaire exige un développement et une mise en production.

**Problème.** La qualité veut changer les intervalles sans attendre, avec un contrôle de cohérence.

**Application du concept.** L'intervalle est exprimé dans une table de décision gérée par la qualité.

**Déroulé.**

1. L'administrateur crée la table avec ses trois colonnes d'entrée.
2. L'éditeur contrôle la complétude : un trou est signalé (catégorie « cargo » non couverte).
3. La qualité ajoute la ligne manquante et fixe une date d'effet.
4. Le moteur de planification appelle la table pour chaque aéronef et conserve la ligne utilisée dans l'historique.

**Résultat.** Les intervalles sont modifiables par la qualité, avec un contrôle automatique et une trace de la ligne appliquée.

**Limites.** Un changement de table modifie des échéances futures : une analyse d'impact (« combien d'aéronefs voient leur échéance avancée ? ») est nécessaire avant publication.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que représente une ligne d'une table de décision ?
2. **Compréhension.** Qu'est-ce qu'un trou et qu'est-ce qu'un chevauchement ?
3. **Compréhension.** À quoi sert la politique de sélection ?
4. **Pourquoi.** Pourquoi une table de décision est-elle plus lisible que des conditions imbriquées ?
5. **Raisonnement pratique.** Une table a des lignes `age < 10` et `age > 10`. Quel défaut présente-t-elle ?

#### Réponses

1. Une règle : si toutes ses conditions d'entrée sont vraies, son résultat s'applique.
2. Un trou est une combinaison d'entrées qu'aucune ligne ne couvre ; un chevauchement est une combinaison couverte par plusieurs lignes.
3. À trancher quand plusieurs lignes correspondent : prendre la première, la plus prioritaire, ou collecter toutes les lignes.
4. Parce que toutes les combinaisons sont visibles d'un coup, et que l'on peut vérifier automatiquement qu'aucune n'est oubliée ni contradictoire.
5. La valeur 10 n'est couverte par aucune ligne : c'est un trou à la valeur limite.

## 6.10 Moteur de règles

### 1. Comprendre simplement

Un **moteur de règles** (*rule engine*) est un composant logiciel qui **évalue un ensemble de règles** sur des données (les « faits ») et **déclenche les actions** qui en découlent, indépendamment du code de l'application. Il a la responsabilité de choisir quelles règles s'appliquent, dans quel ordre, et de rendre compte de ce qu'il a fait.

**Pourquoi cela existe.** Quand les règles sont nombreuses et changent souvent, les coder en dur dans les applications est lent et dangereux. Un moteur dédié permet de les gérer comme des données, de les évaluer de façon cohérente et de les expliquer.

**Problème résolu.** Exécuter de façon fiable, explicable et modifiable un grand nombre de règles métier.

**Modèle mental.** Un comité qui applique un règlement à des dossiers : pour chaque dossier, il examine quelles règles sont pertinentes, applique celles qui le sont, et note ses décisions.

**Où l'analogie s'arrête.** Un comité exerce du jugement. Un moteur applique exactement les règles écrites, sans nuance : la qualité des décisions est celle des règles.

**Exemple.** Un moteur reçoit « le constat F-204, critique, sur un aéronef actif ». Les règles correspondantes se déclenchent : créer une tâche urgente, notifier la direction technique, interdire les affectations de vol.

**Les composants.**

1. un **référentiel de règles** ;
2. une **mémoire de travail** (les faits) ;
3. un **évaluateur** (sélection et exécution) ;
4. des **actions** et une **trace** de décision.

**Objectif d'apprentissage :** vous pouvez décrire le fonctionnement d'un moteur de règles, citer ses risques, et dire quand ne pas en utiliser.

### 2. Connaissances essentielles

#### Définition

Un **moteur de règles** est un système qui exécute des règles exprimées de façon déclarative (condition et action) contre un ensemble de faits, en choisissant les règles applicables et en exécutant leurs actions, avec une trace des décisions.

#### Idées fondamentales

1. **Les règles sont des données.** On les ajoute, les modifie et les retire sans redéployer.
2. **Le moteur sélectionne.** Parmi de nombreuses règles, il trouve celles qui s'appliquent.
3. **Il peut chaîner.** Une action peut produire un fait qui déclenche une autre règle.
4. **Il explique.** Il indique quelles règles ont été déclenchées et pourquoi.
5. **Il doit terminer.** Les boucles de règles sont une menace.
6. **Il ne convient pas à tout.** Pour des cas simples, une expression ; pour du séquentiel, un workflow.

#### Vocabulaire essentiel

- **Fait** (*fact*) : donnée sur laquelle les règles s'appliquent.
- **Règle de production** (*production rule*) : couple condition et action (« quand… alors… »).
- **Chaînage avant** (*forward chaining*) : on part des faits pour déduire les actions.
- **Chaînage arrière** (*backward chaining*) : on part d'un but pour chercher les conditions qui le prouvent.
- **Résolution de conflits** (*conflict resolution*) : choix de l'ordre quand plusieurs règles sont déclenchables.
- **Algorithme Rete** : algorithme d'appariement efficace, publié par Charles Forgy à la fin des années 1970.
- **Session** (*session*) : exécution du moteur sur un ensemble de faits.

#### Relations de cause à effet

- Une règle modifie un fait qui en déclenche une autre. Sans contrôle, des boucles infinies apparaissent ou l'ordre devient imprévisible.
- Le nombre de règles croît. Sans structure ni propriétaires, le référentiel devient un amas où chaque modification est risquée.
- Les décisions ne sont pas tracées. En cas de litige, on ne peut pas expliquer pourquoi la plateforme a refusé ou autorisé.

#### Idées reçues

- **« Un moteur de règles supprime la complexité. »** Il la déplace dans les règles, et la rend plus visible. Elle reste à gouverner.
- **« Les règles sont toujours plus faciles à maintenir que du code. »** Pas nécessairement : sans tests, versions et propriétaires, elles sont plus difficiles à maintenir.
- **« Tout doit passer par le moteur de règles. »** Non. Une simple condition, une contrainte de la base ou un workflow sont souvent plus adaptés.

#### Principe clé

Un moteur de règles est un outil de gouvernance de la décision : il vaut par la qualité de ses règles, de ses tests et de ses traces.

#### Si vous ne retenez que trois choses

1. Un moteur de règles évalue des règles déclaratives sur des faits et exécute leurs actions.
2. Il faut maîtriser l'ordre, les boucles, les conflits et la traçabilité.
3. Il ne remplace ni les contraintes, ni les workflows, ni les expressions simples.

### 3. Explication technique détaillée

#### Les trois grandes familles

| Famille | Principe | Exemple d'usage |
|---|---|---|
| Moteur de règles de production | Règles « quand… alors… », chaînage, mémoire de travail | Détection de situations complexes, déduction |
| Moteur de décision | Évalue des tables ou arbres de décision, retourne un résultat | Calcul d'un tarif, d'un intervalle |
| Évaluateur d'expressions | Évalue des conditions simples à un point d'accroche | Gardes, filtres, règles de validation |

La plupart des plateformes SaaS configurables n'ont pas besoin d'un moteur de production complet : un évaluateur d'expressions et des tables de décision couvrent l'essentiel.

#### Un exemple de règles et de décision

```json
{
  "rules": [
    {
      "key": "critical_finding_response",
      "priority": 100,
      "when": "finding.severity = 'critical' AND aircraft.status = 'active'",
      "then": [
        { "type": "create_resource", "resource": "maintenance_task",
          "values": { "aircraft": "$aircraft", "priority": "urgent" } },
        { "type": "transition", "resource": "$aircraft", "key": "ground" },
        { "type": "notify", "role": "technical_director" }
      ]
    }
  ]
}
```

```json
{
  "trace": [
    { "rule": "critical_finding_response", "matched": true,
      "facts": ["finding/fd_204", "aircraft/ac_8f3a"],
      "actions": ["create_resource maintenance_task", "transition ground", "notify technical_director"] }
  ]
}
```

#### Le chaînage et les boucles

```text
Fait : constat critique ──► règle A : immobiliser l'aéronef
                                 │ produit : aéronef « en inspection »
                                 ▼
                            règle B : créer une tâche d'inspection
                                 │ produit : tâche ouverte
                                 ▼
                            règle C : notifier le responsable
```

Si la règle C modifie un fait qui déclenche à nouveau la règle A, on obtient une boucle. Les parades :

- un **plafond** de cycles d'évaluation ;
- une règle qui ne se déclenche **qu'une fois** par fait et par session ;
- des **tests** de scénarios pour détecter les chaînes circulaires.

#### La résolution de conflits

Quand plusieurs règles peuvent s'exécuter, un ordre est nécessaire :

| Critère | Principe |
|---|---|
| Priorité explicite | La règle de plus haute priorité d'abord |
| Spécificité | La règle la plus précise d'abord |
| Ancienneté | La règle la plus récente, ou la plus ancienne |
| Ordre de déclaration | Selon leur position dans le référentiel |

Le critère doit être documenté : il détermine le résultat.

#### L'algorithme Rete

Pour éviter de réévaluer toutes les règles à chaque changement de fait, l'algorithme Rete construit un réseau qui mémorise les correspondances partielles : seules les parties du réseau touchées par un nouveau fait sont recalculées. C'est ce qui permet à des moteurs de production d'évaluer efficacement des milliers de règles.

#### Intégration dans la plateforme

| Point d'accroche | Rôle des règles |
|---|---|
| Avant l'écriture | Contrôle (refuser, corriger) |
| À une transition | Gardes et effets |
| Sur un événement | Réactions |
| À la demande | Décisions (éligibilité, tarif) |

#### La gouvernance des règles

| Pratique | Raison |
|---|---|
| Propriétaire par règle | Responsable du contenu et des évolutions |
| Tests de scénarios | Détecter les régressions et les conflits |
| Simulation avant publication | Mesurer l'impact sur des cas réels |
| Version et date d'effet | Rejouer une décision passée (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Trace de chaque décision | Expliquer, auditer, déboguer |
| Revue périodique | Retirer les règles devenues inutiles |

**Contre-exemple.** Mille règles ajoutées en trois ans par des équipes différentes, sans propriétaire ni test. Personne n'ose en retirer une, et un effet de bord inattendu bloque régulièrement la plateforme après un ajout de règle.

**Limites.** Les performances d'un moteur dépendent du nombre de règles, de faits et de chaînages. Il faut mesurer sur des volumes réalistes, et réserver le moteur aux décisions qui en ont besoin.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.6 Règle métier, règle de validation, contrainte et politique](#66-règle-métier-règle-de-validation-contrainte-et-politique) | Il exécute les règles métier |
| [6.7 Condition et éligibilité](#67-condition-et-éligibilité) | Il évalue des conditions |
| [6.8 Expression et formule](#68-expression-et-formule) | Il s'appuie sur un langage d'expressions |
| [6.9 Table de décision](#69-table-de-décision) | Il exécute des tables de décision |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Il réagit à des événements et en émet |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les politiques évaluées par un moteur relèvent de « Policy as Code » |

### 5. Application pratique

**Situation initiale.** La plateforme doit réagir aux constats critiques : immobiliser l'aéronef, créer une tâche urgente, notifier la direction, interdire les affectations.

**Problème.** Ces réactions sont codées à plusieurs endroits, et chaque client a ses propres seuils de criticité.

**Application du concept.** Une règle de réaction est configurée par tenant et exécutée par le moteur à la création d'un constat.

**Déroulé.**

1. L'administrateur crée la règle avec le seuil de criticité de son tenant.
2. Un constat critique est enregistré ; l'événement déclenche le moteur.
3. Le moteur évalue les règles du tenant, trouve celle-ci, exécute ses trois actions dans l'ordre.
4. La trace est enregistrée : règle déclenchée, faits, actions.
5. Le responsable consulte la trace pour comprendre pourquoi l'aéronef a été immobilisé.

**Résultat.** Chaque client a sa logique de réaction, exécutée de façon uniforme et explicable.

**Limites.** Si l'action d'immobilisation échoue (garde non satisfaite), le moteur doit consigner l'échec et alerter, plutôt que de le taire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fait un moteur de règles ?
2. **Compréhension.** Qu'est-ce que le chaînage avant ?
3. **Compréhension.** Pourquoi la résolution de conflits est-elle nécessaire ?
4. **Pourquoi.** Pourquoi les boucles de règles sont-elles un risque ?
5. **Raisonnement pratique.** Pour une simple condition sur un champ, faut-il un moteur de règles ?

#### Réponses

1. Il évalue des règles déclaratives sur des faits, sélectionne celles qui s'appliquent et exécute leurs actions, avec une trace.
2. On part des faits connus pour déclencher les règles et en déduire des actions ou de nouveaux faits.
3. Parce que plusieurs règles peuvent s'appliquer simultanément, et que l'ordre d'exécution peut changer le résultat.
4. Parce qu'une action qui modifie un fait peut redéclencher la règle qui l'a produite, et que l'évaluation ne termine plus.
5. Non : une expression ou une condition suffit. Le moteur est réservé aux situations où règles nombreuses, chaînage et traçabilité apportent un vrai gain.
