# Module 7 — Automatisation et architecture événementielle

> **Question directrice.** Comment faire réagir la plateforme, de façon fiable et configurable, à ce qui se passe en elle et autour d'elle ?

## Présentation du module

**Objectif.** Les modules précédents ont rendu la plateforme capable de stocker, d'exécuter des opérations, de contrôler l'accès, de suivre des états et d'appliquer des règles. Ce module la rend **réactive** : un changement d'état déclenche des actions, des systèmes externes sont prévenus, des traitements s'exécutent à des heures fixées.

**Prérequis.** Les transactions et l'idempotence du [module 3](03-crud-runtime-ressources.md), les états et workflows du [module 6](06-workflow-etat-regles.md), la notion de système distribué du [module 1](01-architecture-saas.md).

**Ordre retenu.** Du concept d'événement vers les mécanismes de transport, puis les garanties de livraison, puis les patrons avancés.

```text
Événement ──► Condition ──► Action ──► Événement ──► …
```

```text
Concepts           événement, déclencheur, action ─ message et file ─ publication-abonnement ─ architecture événementielle
Intégration        webhook ─ tâches planifiées et tâches de fond
Fiabilité          reprises, file des échecs, idempotence ─ cohérence à terme
Patrons avancés    event sourcing ─ CQRS ─ saga
```

**Exemple fil rouge du plan.**

```text
Statut de la ressource → « expiré »
        ↓
Déclenchement du workflow
        ↓
Notification du propriétaire
        ↓
Blocage de la ressource
        ↓
Création d'une tâche
```

La notion de nouvelle tentative (*retry*) est expliquée en [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) ; elle est reprise ici du point de vue des messages. L'idempotence est expliquée en [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) ; elle est reprise du point de vue des consommateurs.

## Sommaire du module

- [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action)
- [7.2 Message et file d'attente](#72-message-et-file-dattente)
- [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements)
- [7.4 Architecture orientée événements](#74-architecture-orientée-événements)
- [7.5 Webhook](#75-webhook)
- [7.6 Tâche planifiée et tâche de fond](#76-tâche-planifiée-et-tâche-de-fond)
- [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)
- [7.8 Cohérence à terme](#78-cohérence-à-terme)
- [7.9 Event sourcing](#79-event-sourcing)
- [7.10 CQRS](#710-cqrs)
- [7.11 Saga](#711-saga)

## 7.1 Événement, déclencheur et action

### 1. Comprendre simplement

Un **événement** (*event*) est le constat qu'**un fait s'est produit** : « l'aéronef F-ABCD a été immobilisé ». Un **déclencheur** (*trigger*) est ce qui démarre un traitement automatique : un événement, une heure, une action manuelle. Une **action** (*action*) est ce que la plateforme fait en réponse : créer une tâche, envoyer une notification, appeler un système externe.

**Pourquoi cela existe.** Une plateforme métier ne se contente pas de stocker : elle doit réagir. Si chaque réaction est codée à l'endroit où le fait se produit, le code devient un enchevêtrement. Si l'on sépare le constat (événement) de la réaction (action), on peut ajouter des réactions sans toucher à l'origine.

**Problème résolu.** Découpler ce qui se passe de ce que l'on en fait, pour automatiser sans programmer et pour étendre sans casser.

**Modèle mental.** Un détecteur de fumée. Il constate (événement) ; une règle décide si le seuil est franchi (condition) ; la sirène retentit (action).

**Où l'analogie s'arrête.** Un détecteur a une seule action câblée. Une plateforme peut avoir des dizaines de réactions à un même événement, chacune configurée par un tenant différent.

**Exemple.** L'événement `aircraft.grounded` déclenche trois actions configurées : créer une tâche d'inspection, notifier le planificateur, interdire les affectations de vol.

**Le modèle Événement–Condition–Action.**

1. **Événement** : que s'est-il passé ?
2. **Condition** : cela nous concerne-t-il ?
3. **Action** : que faisons-nous ?

**Objectif d'apprentissage :** vous pouvez décrire un événement, distinguer un événement d'une commande, et écrire une automatisation sous la forme événement–condition–action.

### 2. Connaissances essentielles

#### Définition

- **Événement** : enregistrement immuable d'un fait métier ou technique survenu à un instant donné, nommé au passé.
- **Déclencheur** : condition de démarrage d'une automatisation (événement, planification, action manuelle, seuil).
- **Action** : opération exécutée par la plateforme en réaction à un déclencheur.

#### Idées fondamentales

1. **Un événement est un fait passé et immuable.** On ne le refuse pas, on ne le modifie pas.
2. **Un événement n'est pas une commande.** Une commande demande de faire ; un événement constate que cela a été fait.
3. **Un événement a une enveloppe.** Identifiant, type, source, instant, données, corrélation.
4. **Un déclencheur peut filtrer.** Par type, par ressource, par condition.
5. **Une automatisation est une configuration.** Déclencheur, condition, actions : elle est modifiable par l'administrateur.
6. **Chaque changement important émet un événement.** Création, modification, transition, suppression.

#### Vocabulaire essentiel

- **Type d'événement** (*event type*) : nom stable (`aircraft.grounded`).
- **Charge utile** (*payload*, *data*) : les informations de l'événement.
- **Source** : le composant ou la ressource à l'origine.
- **Identifiant de corrélation** (*correlation ID*) : relie les événements d'un même déroulement.
- **Identifiant de causalité** (*causation ID*) : désigne l'événement qui en a causé un autre.
- **Commande** (*command*) : demande d'exécuter une action, qui peut être refusée.
- **Automatisation** (*automation*) : règle « quand ceci, si cela, alors cela ».

#### Relations de cause à effet

- Les réactions sont codées là où le fait se produit. Ajouter une réaction demande de modifier le code d'origine, et le risque de régression grandit.
- Un événement est nommé comme une commande (`ground_aircraft`). Les consommateurs croient pouvoir le refuser, et le producteur croit pouvoir leur imposer un résultat.
- La charge utile n'est pas stable. Chaque évolution casse les automatisations des clients.

#### Idées reçues

- **« Un événement, c'est un message quelconque. »** Non. C'est un fait passé, immuable, avec un sens métier.
- **« Il suffit d'émettre l'événement après avoir écrit en base. »** Non : si le processus s'arrête entre les deux, l'événement est perdu. On utilise une boîte d'envoi transactionnelle (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).
- **« Plus il y a d'événements, mieux c'est. »** Non. Trop d'événements de granularité fine noient les consommateurs et rendent les flux illisibles.

#### Principe clé

Un événement constate un fait passé ; les réactions s'y abonnent sans que l'origine les connaisse.

#### Si vous ne retenez que trois choses

1. Un événement est un fait passé, immuable et nommé ; une commande est une demande.
2. Une automatisation relie un déclencheur, une condition et des actions, par configuration.
3. L'émission de l'événement doit être fiable : elle est liée à la transaction du changement.

### 3. Explication technique détaillée

#### L'enveloppe d'un événement

Le format *CloudEvents*, spécifié par la CNCF, propose des attributs communs. L'exemple ci-dessous s'en inspire.

```json
{
  "specversion": "1.0",
  "id": "evt_01HZX4Q8",
  "type": "aircraft.grounded",
  "source": "/tenants/ten_airline_01/aircraft/ac_8f3a",
  "subject": "ac_8f3a",
  "time": "2026-10-13T08:12:45Z",
  "datacontenttype": "application/json",
  "tenantid": "ten_airline_01",
  "correlationid": "req_91ab33",
  "data": {
    "previous_status": "active",
    "new_status": "in_inspection",
    "reason": "Inspection annuelle",
    "actor": "u_42"
  }
}
```

**Comment la lire.** `id` est unique (utile pour dédupliquer). `type` dit ce qui s'est passé. `source` et `subject` désignent la ressource. `tenantid` isole. `correlationid` relie l'événement à la requête d'origine. `data` porte les informations propres à ce type.

#### Événement ou commande

| Critère | Événement | Commande |
|---|---|---|
| Nature | Constat d'un fait passé | Demande d'agir |
| Temps verbal | Passé : `aircraft.grounded` | Impératif : `ground_aircraft` |
| Destinataires | Zéro, un ou plusieurs | Un seul |
| Refus possible | Non : c'est déjà arrivé | Oui |
| Émetteur attend un résultat | Non | Souvent |

#### Les types d'événements d'une plateforme

| Famille | Exemples | Origine |
|---|---|---|
| Cycle de vie de ressource | `resource.created`, `resource.updated`, `resource.deleted` | Moteur de ressources |
| Transition d'état | `aircraft.grounded`, `finding.approved` | Machine à états |
| Processus | `workflow.started`, `task.assigned`, `task.overdue` | Moteur de workflow |
| Sécurité | `user.login_failed`, `role.assigned` | Identité et accès |
| Plateforme | `tenant.suspended`, `quota.exceeded` | Plan de contrôle |
| Temporel | `schedule.fired`, `timer.expired` | Planificateur |

#### Une automatisation configurée

```json
{
  "key": "on_critical_finding",
  "trigger": { "event": "finding.created" },
  "condition": "event.data.severity = 'critical'",
  "actions": [
    { "type": "create_resource", "resource": "maintenance_task",
      "values": { "aircraft": "{{event.data.aircraft}}", "priority": "urgent" } },
    { "type": "notify", "role": "technical_director",
      "template": "critical_finding" },
    { "type": "webhook", "endpoint": "ep_quality_system" }
  ],
  "enabled": true
}
```

**Comment la lire.** Quand un constat est créé, si sa gravité est critique, trois actions sont lancées : une tâche, une notification, un webhook. L'administrateur peut la désactiver ou la modifier.

#### Les granularités de charge utile

| Style | Contenu | Avantage | Inconvénient |
|---|---|---|---|
| Notification | Identifiant et type seulement | Léger, toujours à jour (le consommateur relit) | Le consommateur doit rappeler la source |
| Transfert d'état | Les données utiles dans l'événement | Le consommateur est autonome | Couplage au schéma, risque de données périmées |
| Différentiel | Ce qui a changé (avant et après) | Précis pour l'audit | Plus volumineux |

#### Fiabilité de l'émission

Pour qu'un événement soit émis si et seulement si le changement est validé, on l'écrit dans la **même transaction** (boîte d'envoi, voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).

**Contre-exemple.** Un événement `aircraft.updated` sans information sur ce qui a changé, qui oblige chaque consommateur à relire et comparer. Ou, à l'inverse, un événement contenant toute la ressource, y compris des champs sensibles, que tous les abonnés reçoivent.

**Limites.** Les événements sont un contrat : leur nom et leur forme sont versionnés (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)). Un événement mal conçu est difficile à changer une fois que des clients s'y sont abonnés.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les transitions d'état émettent des événements |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Les événements démarrent et font avancer les workflows |
| [7.2 Message et file d'attente](#72-message-et-file-dattente) | Les événements circulent sous forme de messages |
| [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements) | La publication-abonnement distribue les événements |
| [14.6 Événement de domaine](14-domain-driven-design.md#146-événement-de-domaine) | L'événement de domaine est la forme tactique du DDD |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Les événements alimentent le journal d'audit |

### 5. Application pratique

**Situation initiale.** Quand un constat critique est enregistré, la direction technique veut être prévenue, une tâche doit être créée et le système qualité du client doit être informé.

**Problème.** Ces trois réactions sont codées dans le service de constats, et chaque client souhaite des variantes.

**Application du concept.** Le service de constats émet l'événement `finding.created`. Les réactions sont des automatisations configurées par tenant.

**Déroulé.**

1. Le technicien enregistre le constat. Le moteur écrit le constat et l'événement dans la même transaction.
2. Le relais publie l'événement.
3. Le moteur d'automatisation évalue les automatisations du tenant.
4. Celle du tenant « compagnie » correspond : tâche, notification, webhook.

**Résultat.** Le service de constats ignore les réactions. Chaque tenant configure les siennes.

**Limites.** Il faut un moyen de voir quelles automatisations se sont déclenchées pour un événement donné (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un événement et une commande ?
2. **Compréhension.** Que contient l'enveloppe d'un événement ?
3. **Compréhension.** Que signifie événement-condition-action ?
4. **Pourquoi.** Pourquoi nomme-t-on un événement au passé ?
5. **Raisonnement pratique.** Comment garantir qu'un événement n'est émis que si la modification a été validée ?

#### Réponses

1. Un événement constate un fait passé et ne peut pas être refusé ; une commande demande d'agir et peut être refusée.
2. Un identifiant, un type, une source, un instant, des données, et des informations de corrélation et de tenant.
3. Un modèle d'automatisation : quand un événement survient, si une condition est vraie, alors une action est exécutée.
4. Parce qu'il décrit un fait qui a eu lieu : le nom rappelle qu'il est immuable et qu'on ne peut plus l'empêcher.
5. En l'écrivant dans la même transaction que la modification (boîte d'envoi transactionnelle), puis en le publiant après la validation.

## 7.2 Message et file d'attente

### 1. Comprendre simplement

Un **message** (*message*) est une unité de données envoyée d'un composant à un autre : il transporte un événement, une commande ou une demande de traitement. Une **file d'attente** (*queue*) est une zone tampon qui conserve les messages jusqu'à ce qu'un consommateur les traite, généralement **un seul consommateur par message**.

**Pourquoi cela existe.** Si un composant appelle directement un autre et attend la réponse, ils dépendent l'un de l'autre dans le temps : l'un ralentit, l'autre attend ; l'un tombe, l'autre échoue. Une file les découple : l'émetteur dépose et continue, le récepteur traite à son rythme.

**Problème résolu.** Absorber les pics de charge, découpler les composants dans le temps, et fiabiliser la transmission du travail.

**Modèle mental.** Une boîte aux lettres. L'expéditeur dépose le courrier à n'importe quelle heure ; le destinataire le relève quand il peut. Aucun des deux n'attend l'autre.

**Où l'analogie s'arrête.** Une boîte aux lettres ne dit pas si le courrier est arrivé en double ou dans le désordre. Une file doit gérer les doublons, l'ordre et les messages que personne n'arrive à traiter.

**Exemple.** Un import de 20 000 lignes est découpé en messages de 100 lignes déposés dans une file. Dix consommateurs les traitent en parallèle, à leur rythme.

**Les composants.**

1. un **producteur** (émetteur) ;
2. une **file** (stockage tampon) ;
3. un ou plusieurs **consommateurs** ;
4. des **accusés de réception** (*acknowledgements*).

**Objectif d'apprentissage :** vous pouvez décrire le cycle de vie d'un message, expliquer la livraison « au moins une fois » et dimensionner grossièrement le nombre de consommateurs.

### 2. Connaissances essentielles

#### Définition

- **Message** : unité de communication asynchrone, composée d'un contenu et de métadonnées (identifiant, destinataire, tenant, corrélation).
- **File d'attente** : structure de stockage ordonnée qui retient les messages jusqu'à leur consommation et leur acquittement, et qui répartit le travail entre des consommateurs concurrents.

#### Idées fondamentales

1. **La communication est asynchrone.** L'émetteur n'attend pas le traitement.
2. **La file absorbe les pics.** Elle lisse une charge irrégulière.
3. **Les consommateurs sont concurrents.** Ajouter des consommateurs augmente le débit.
4. **Un message est acquitté après traitement.** Sans acquittement, il est redélivré.
5. **La livraison est « au moins une fois ».** Des doublons sont possibles : les consommateurs sont idempotents.
6. **L'ordre est limité.** Il n'est garanti qu'au sein d'une clé ou d'une partition.

#### Vocabulaire essentiel

- **Producteur** (*producer*) et **consommateur** (*consumer*) : celui qui envoie, celui qui traite.
- **Courtier** (*broker*) : système qui gère les files.
- **Acquittement** (*ack*, *acknowledgement*) : confirmation de bon traitement.
- **Délai de visibilité** (*visibility timeout*) : durée pendant laquelle un message pris est caché aux autres consommateurs.
- **Profondeur de file** (*queue depth*, *backlog*) : nombre de messages en attente.
- **FIFO** : premier entré, premier sorti.
- **Contre-pression** (*backpressure*) : mécanisme qui ralentit l'émetteur quand le récepteur est saturé.
- **Message empoisonné** (*poison message*) : message qui fait toujours échouer son traitement.

#### Relations de cause à effet

- Le producteur est plus rapide que les consommateurs. La file grossit sans limite, le délai de traitement s'allonge, et la mémoire ou le stockage se remplit.
- Le consommateur plante après avoir traité mais avant d'acquitter. Le message est redélivré : l'effet est appliqué deux fois si le traitement n'est pas idempotent.
- Un message empoisonné échoue toujours. Il est rejoué sans fin et monopolise un consommateur, voire bloque une file ordonnée.

#### Idées reçues

- **« Une file garantit que chaque message est traité une seule fois. »** Non. La garantie courante est « au moins une fois ». L'effet « exactement une fois » s'obtient par un traitement idempotent.
- **« Une file garantit l'ordre global. »** Non. L'ordre n'est garanti qu'au sein d'un groupe ou d'une partition, et les reprises peuvent le modifier.
- **« Ajouter une file règle les problèmes de performance. »** Elle les déplace : le traitement peut être retardé, mais pas supprimé.

#### Principe clé

Une file découple dans le temps ; en échange, elle impose de gérer les doublons, l'ordre limité, les messages en échec et le débit des consommateurs.

#### Si vous ne retenez que trois choses

1. Une file conserve les messages jusqu'à leur traitement et leur acquittement.
2. La livraison est généralement « au moins une fois » : les consommateurs doivent être idempotents.
3. Débit, ordre et messages en échec sont des sujets de conception à part entière.

### 3. Explication technique détaillée

#### Le cycle de vie d'un message

```text
Producteur ──► File ──► Consommateur
   publie       conserve   1. reçoit (message invisible aux autres)
                           2. traite
                           3. acquitte  ──► message supprimé
                              (ou échec / expiration du délai ──► message redélivré)
```

#### Les sémantiques de livraison

| Sémantique | Garantie | Risque | Usage |
|---|---|---|---|
| Au plus une fois (*at-most-once*) | Jamais de doublon | Perte possible | Mesures non critiques |
| Au moins une fois (*at-least-once*) | Jamais de perte | Doublons possibles | Cas général, avec idempotence |
| Exactement une fois (*exactly-once*) | Un seul effet | Coûteux ou limité à un système | Obtenu par idempotence ou transaction |

#### Dimensionner les consommateurs

Avec un débit d'arrivée $\lambda$ (messages par seconde) et un temps de traitement moyen $S$ (secondes par message), le nombre minimal de consommateurs en parallèle est :

$$N \approx \lambda \times S$$

**Exemple chiffré.** Avec $\lambda = 200$ messages/s et $S = 0{,}05$ s, il faut au moins $200 \times 0{,}05 = 10$ consommateurs. On prévoit une marge (par exemple 30 à 50 %) pour absorber les variations.

**Si le débit d'arrivée dépasse la capacité.** Si $\lambda = 300$ et la capacité de traitement est $\mu = 250$, la file grossit de $\lambda - \mu = 50$ messages par seconde, soit 3 000 par minute, jusqu'à saturation ou jusqu'à ce que l'on ajoute des consommateurs.

#### L'ordre

| Besoin | Mécanisme |
|---|---|
| Aucun | Consommateurs concurrents, sans ordre |
| Ordre par ressource | Clé de partition (identifiant de la ressource) : tous les messages d'une ressource vont au même consommateur dans l'ordre |
| Ordre global | Un seul consommateur : limite le débit, à éviter |

#### Les métadonnées d'un message

```json
{
  "message_id": "msg_7c1e",
  "type": "aircraft.import.chunk",
  "tenant_id": "ten_airline_01",
  "correlation_id": "req_91ab33",
  "partition_key": "import_55",
  "attempt": 1,
  "published_at": "2026-10-13T08:12:45Z",
  "body": { "file_id": "file_204", "from_row": 1, "to_row": 100 }
}
```

**Pourquoi chaque champ.** `message_id` sert à dédupliquer. `tenant_id` isole et permet l'équité. `correlation_id` relie le message à son origine. `partition_key` garantit l'ordre au sein d'une ressource. `attempt` aide à gérer les reprises.

#### L'équité entre tenants

Une file commune permet à un tenant qui dépose 100 000 messages de retarder tous les autres. On y remédie par :

- des **files séparées** par tenant ou par catégorie de tenants ;
- un **ordonnancement équitable** (chaque tenant a sa part de capacité) ;
- des **quotas** de dépôt par tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)).

#### Files et journaux

Certains systèmes (journaux d'événements, *logs*) conservent les messages après lecture et permettent à plusieurs lecteurs de les relire à partir d'une position. Une file classique supprime le message après acquittement. Les deux modèles servent des usages différents : répartition de travail pour la file, diffusion et rejeu pour le journal (voir [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements)).

**Contre-exemple.** Une file unique pour tous les types de travaux de la plateforme (imports, notifications, calculs). Un import massif retarde les notifications urgentes de plusieurs heures.

**Limites.** Une file n'a de valeur que supervisée : profondeur, âge du plus ancien message, taux d'erreur et débit de consommation sont les indicateurs de base.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action) | Les événements et commandes circulent sous forme de messages |
| [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements) | La publication-abonnement distribue à plusieurs consommateurs |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les messages en échec vont dans une file des échecs |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend la livraison « au moins une fois » sûre |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les quotas garantissent l'équité entre tenants |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité s'appuie sur le débit et la profondeur |

### 5. Application pratique

**Situation initiale.** Un import de 20 000 aéronefs est lancé depuis l'interface. Il dure plusieurs minutes et bloque l'écran de l'utilisateur.

**Problème.** Le traitement dépasse le délai d'attente d'une requête, et il monopolise le serveur.

**Application du concept.** L'import est découpé en messages traités par des consommateurs.

**Déroulé.**

1. La requête enregistre le fichier, crée une tâche d'import et répond immédiatement avec un identifiant.
2. Le fichier est découpé en 200 lots de 100 lignes, déposés dans une file avec le tenant et la tâche.
3. Dix consommateurs traitent les lots en parallèle, en acquittant chaque lot.
4. L'état d'avancement (lots traités sur 200) est consultable.
5. Un lot qui échoue après plusieurs tentatives est mis de côté (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

**Résultat.** L'utilisateur n'est pas bloqué ; l'import avance en parallèle ; les autres tenants ne sont pas pénalisés grâce à une file par catégorie.

**Limites.** Le résultat n'est pas immédiat : l'interface doit afficher l'avancement et notifier à la fin.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un acquittement et à quoi sert-il ?
2. **Compréhension.** Que signifie livraison « au moins une fois » ?
3. **Compréhension.** Comment garantit-on l'ordre des messages d'une même ressource ?
4. **Pourquoi.** Pourquoi les consommateurs doivent-ils être idempotents ?
5. **Raisonnement pratique.** Il arrive 400 messages par seconde, et un consommateur traite un message en 25 ms. Combien de consommateurs faut-il au minimum ?

#### Réponses

1. La confirmation que le message a été traité ; sans elle, la file le redélivre, ce qui évite les pertes.
2. Que chaque message est délivré une ou plusieurs fois : jamais perdu, mais possiblement en double.
3. Par une clé de partition (l'identifiant de la ressource) : tous ses messages vont au même consommateur, dans l'ordre.
4. Parce qu'un message peut être délivré plusieurs fois (reprise après échec ou expiration) : traiter deux fois ne doit pas produire deux effets.
5. $400 \times 0{,}025 = 10$ consommateurs au minimum, avec une marge pour les variations.

## 7.3 Publication-abonnement et bus d'événements

### 1. Comprendre simplement

La **publication-abonnement** (*publish-subscribe*, ou **pub/sub**) est un modèle de communication où un émetteur (le **publieur**) envoie un message à un **sujet** (*topic*) sans savoir qui le recevra ; chaque **abonné** à ce sujet en reçoit **une copie**. Un **bus d'événements** (*event bus*) est l'infrastructure qui réalise cette distribution : il reçoit les événements et les route vers les abonnés.

**Pourquoi cela existe.** Avec une file, un message n'est traité que par un consommateur. Or un même événement doit souvent provoquer plusieurs réactions indépendantes : notifier, indexer pour la recherche, alimenter l'audit, appeler un webhook. Le modèle publication-abonnement permet d'en ajouter sans toucher à l'émetteur.

**Problème résolu.** Diffuser un fait à de nombreux intéressés, sans couplage entre l'émetteur et les récepteurs.

**Modèle mental.** Une station de radio. Elle émet sur une fréquence sans savoir qui écoute. Chaque auditeur règle son poste sur la fréquence qui l'intéresse.

**Où l'analogie s'arrête.** Un auditeur qui n'a pas allumé son poste rate l'émission. Un abonné logiciel doit, lui, recevoir les événements même s'il était indisponible : on parle d'abonnement **durable**.

**Exemple.** L'événement `aircraft.grounded` est publié sur le sujet `aircraft`. Quatre abonnés le reçoivent : le moteur d'automatisation, l'indexeur de recherche, le service d'audit et le service de webhooks.

**Les composants.**

1. des **publieurs** ;
2. des **sujets** ;
3. des **abonnements** avec filtres ;
4. un **bus** qui route et conserve.

**Objectif d'apprentissage :** vous pouvez comparer file et publication-abonnement, et décrire comment le bus distribue un événement à plusieurs abonnés avec des filtres.

### 2. Connaissances essentielles

#### Définition

- **Publication-abonnement** : modèle de messagerie dans lequel les émetteurs publient sur des sujets et les récepteurs s'abonnent à ces sujets, sans connaissance mutuelle.
- **Bus d'événements** : composant d'infrastructure qui reçoit les événements publiés, applique les règles de routage et les livre aux abonnés.

#### Idées fondamentales

1. **L'émetteur ignore les abonnés.** Ajouter un abonné ne change rien à l'émetteur.
2. **Chaque abonné reçoit sa copie.** Contrairement à la file, qui répartit.
3. **Les abonnements filtrent.** Par type d'événement, par attribut, par tenant.
4. **Les abonnements sont durables.** Ils conservent ce que l'abonné n'a pas encore consommé.
5. **Chaque abonnement a sa propre fiabilité.** Son rythme, ses reprises, sa file des échecs.
6. **Le bus doit être gouverné.** Qui publie quoi, qui s'abonne à quoi.

#### Vocabulaire essentiel

- **Sujet** (*topic*) : canal nommé d'événements.
- **Abonnement** (*subscription*) : lien entre un abonné et un sujet, avec son filtre.
- **Éventail de diffusion** (*fan-out*) : un événement distribué à de nombreux abonnés.
- **Groupe de consommateurs** (*consumer group*) : abonnés qui se répartissent le travail pour un même abonnement.
- **Routage par contenu** (*content-based routing*) : choix des destinataires selon le contenu de l'événement.
- **Rejeu** (*replay*) : relecture d'événements passés.
- **Registre de schémas** (*schema registry*) : catalogue des formats d'événements.

#### Relations de cause à effet

- Un abonné lent consomme moins vite que la production. Son retard grossit ; dans un système mal isolé, il ralentit les autres.
- Un abonnement n'est pas durable. L'abonné qui redémarre perd les événements émis pendant son absence.
- Deux abonnés publient chacun en réaction à l'autre. Une boucle d'événements s'installe et sature le bus.

#### Idées reçues

- **« Pub/sub est une file avec plusieurs lecteurs. »** Non. La file répartit les messages entre consommateurs ; la publication-abonnement donne une copie à chaque abonné.
- **« Un bus d'événements est une base de données. »** Non. Il transporte, et peut conserver temporairement ; il n'est pas l'archive métier.
- **« Tout le monde peut s'abonner à tout. »** Pas dans une plateforme multi-tenant : un abonné ne doit recevoir que les événements de son périmètre.

#### Principe clé

Le bus transporte des faits vers des intéressés qu'il connaît, et que l'émetteur ignore ; chaque abonné a son propre rythme et sa propre fiabilité.

#### Si vous ne retenez que trois choses

1. En publication-abonnement, chaque abonné reçoit une copie de l'événement.
2. Les abonnements sont filtrés et durables, avec leur propre gestion des échecs.
3. Le bus doit isoler les tenants et être gouverné.

### 3. Explication technique détaillée

#### File ou publication-abonnement

| Critère | File (point à point) | Publication-abonnement |
|---|---|---|
| Destinataires d'un message | Un seul consommateur | Tous les abonnés |
| Usage typique | Répartir du travail | Diffuser un fait |
| Couplage | Émetteur connaît la file | Émetteur connaît le sujet |
| Ajout d'un récepteur | Il partage le travail | Il reçoit en plus sa copie |
| Exemple | Traitement d'un lot d'import | Événement `aircraft.grounded` |

#### La topologie d'un bus interne

```text
                                  ┌───► Moteur d'automatisation (abonnement A)
Moteur de ressources ──publie──►  │
Moteur de workflow ───publie──►   BUS ├───► Indexeur de recherche     (abonnement B)
Plan de contrôle ─────publie──►   │
                                  ├───► Audit                       (abonnement C)
                                  └───► Service de webhooks         (abonnement D)
```

Chaque abonnement a sa propre file interne, son rythme, ses reprises et sa file des échecs.

#### Les filtres d'abonnement

```json
{
  "subscription": "sub_quality_system",
  "tenant": "ten_airline_01",
  "topic": "finding",
  "filter": {
    "type": ["finding.created", "finding.approved"],
    "data.severity": ["critical", "major"]
  },
  "delivery": { "kind": "webhook", "endpoint": "ep_quality_system" },
  "retry": { "max_attempts": 8 },
  "dead_letter": true
}
```

**Comment la lire.** L'abonnement reçoit les constats créés ou approuvés dont la gravité est critique ou majeure, pour un tenant précis, et les livre par un webhook, avec reprises.

#### Groupes de consommateurs

Plusieurs instances d'un même service s'abonnent ensemble : chaque événement n'est traité que par **une** instance du groupe, mais **chaque groupe** reçoit tous les événements.

```text
Abonnement « indexation »     : groupe de 4 instances → chaque événement traité par une seule
Abonnement « notifications »  : groupe de 2 instances → chaque événement traité par une seule
(les deux groupes reçoivent tous les événements)
```

#### L'isolation entre tenants

| Aspect | Technique |
|---|---|
| Visibilité | Un abonné ne reçoit que les événements de son tenant (filtre obligatoire) |
| Équité | Files et quotas par tenant ou par abonnement |
| Abonnements configurés par les clients | Webhooks, avec isolation et limites par tenant |
| Données sensibles | Charge utile minimale, ou chiffrement par tenant |

#### Le rejeu

Un bus avec rétention permet de rejouer des événements pour un nouvel abonné ou après une correction. Il faut alors des consommateurs idempotents et la maîtrise de la charge (rejouer un mois d'événements d'un coup peut saturer).

#### Modes de défaillance

- **Tempête d'événements** : une boucle de réactions qui se renouvellent.
- **Abonné lent** qui accumule un retard et consomme du stockage.
- **Schéma modifié** qui casse silencieusement un abonné.
- **Abonnements orphelins** : plus personne ne sait qui reçoit quoi.

**Contre-exemple.** Un bus où tous les événements de tous les tenants passent sur un seul sujet, sans filtre systématique côté serveur : un abonné mal configuré peut recevoir les événements d'un autre tenant.

**Limites.** Le bus ne résout pas la cohérence : un abonné peut voir un événement avant que la lecture d'un autre composant soit à jour (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action) | Le bus transporte les événements |
| [7.2 Message et file d'attente](#72-message-et-file-dattente) | Chaque abonnement s'appuie sur une file |
| [7.4 Architecture orientée événements](#74-architecture-orientée-événements) | L'architecture orientée événements en est l'usage généralisé |
| [7.5 Webhook](#75-webhook) | Les webhooks sont des abonnements livrés par HTTP |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation entre tenants s'applique au bus |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Chaque abonnement a sa file des échecs |

### 5. Application pratique

**Situation initiale.** Quand un aéronef est immobilisé, la plateforme appelle successivement quatre services dans le même code : audit, indexation, notifications, intégrations.

**Problème.** L'ajout d'une cinquième réaction demande de modifier le service d'origine. Une lenteur d'un service retarde l'action de l'utilisateur.

**Application du concept.** Le moteur de ressources publie un événement sur le bus ; chaque service s'abonne.

**Déroulé.**

1. Le moteur écrit le changement et l'événement dans la même transaction.
2. Le relais publie `aircraft.grounded` sur le sujet `aircraft`.
3. Le bus remet une copie à chaque abonnement, avec ses filtres.
4. Un nouveau service de tableau de bord s'abonne : aucune modification de l'émetteur.

**Résultat.** L'action de l'utilisateur n'attend plus les réactions, et une réaction s'ajoute sans toucher à l'origine.

**Limites.** Il faut un catalogue des événements et des abonnements pour savoir qui réagit à quoi (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une file et la publication-abonnement ?
2. **Compréhension.** Qu'est-ce qu'un abonnement durable ?
3. **Compréhension.** Comment filtre-t-on les événements reçus par un abonné ?
4. **Pourquoi.** Pourquoi l'émetteur n'a-t-il pas besoin de connaître ses abonnés ?
5. **Raisonnement pratique.** Quel risque d'isolation présente un sujet unique pour tous les tenants, et comment le traiter ?

#### Réponses

1. Dans une file, chaque message est traité par un seul consommateur ; en publication-abonnement, chaque abonné reçoit sa propre copie.
2. Un abonnement qui conserve les événements non encore consommés, de sorte qu'un abonné absent les reçoit à son retour.
3. Par des règles de filtrage sur le type, des attributs de l'événement, le tenant, définies dans l'abonnement.
4. Parce que l'émetteur publie un fait sur un sujet : le bus se charge de le distribuer, ce qui permet d'ajouter des abonnés sans modifier l'émetteur.
5. Un abonné pourrait recevoir les événements d'autres tenants. On applique un filtre de tenant obligatoire côté serveur, ou des sujets séparés par tenant.

## 7.4 Architecture orientée événements

### 1. Comprendre simplement

L'**architecture orientée événements** (*event-driven architecture*, **EDA**) est un style où les composants d'un système communiquent en **produisant et en réagissant à des événements**, plutôt qu'en s'appelant directement les uns les autres. Chaque composant fait sa part quand un fait qui le concerne se produit.

**Pourquoi cela existe.** Dans une plateforme où des automatisations configurables, des intégrations et des modules variés réagissent aux mêmes faits, les appels directs créent un maillage de dépendances. Le système devient rigide : tout changement oblige à modifier plusieurs composants.

**Problème résolu.** Découpler les composants, permettre l'extension par ajout de réactions et absorber les variations de charge.

**Modèle mental.** Le tableau d'affichage d'une gare. Les arrivées et les retards y sont annoncés. Chaque service (taxis, commerces, agents) réagit à sa façon, sans que le tableau les connaisse.

**Où l'analogie s'arrête.** Un tableau d'affichage est lu par des humains qui comprennent le contexte. Un système doit organiser la réaction, l'ordre, la cohérence et le suivi d'un déroulement qui traverse plusieurs composants.

**Exemple.** Dans la plateforme : une ressource passe à « expiré » ; un événement est émis ; un workflow démarre, une notification part, la ressource est bloquée, une tâche est créée. Aucune de ces réactions n'est appelée par la précédente.

**Les composants.**

1. des **producteurs** d'événements ;
2. un **transport** (bus, files) ;
3. des **consommateurs** qui réagissent ;
4. des **moyens de suivi** (corrélation, traces).

**Objectif d'apprentissage :** vous pouvez comparer chorégraphie et orchestration, décrire trois usages des événements et nommer les difficultés de l'EDA.

### 2. Connaissances essentielles

#### Définition

L'**architecture orientée événements** est un style d'architecture dans lequel les interactions entre composants reposent sur l'émission, le transport et la consommation asynchrones d'événements, qui représentent des faits métier ou techniques.

#### Idées fondamentales

1. **Les composants sont découplés.** Dans le temps, dans l'espace et dans la connaissance mutuelle.
2. **L'extension est naturelle.** Ajouter une réaction, c'est ajouter un abonné.
3. **Le flux de contrôle est réparti.** Aucun composant ne connaît tout le déroulement (chorégraphie).
4. **La cohérence est à terme.** Les composants convergent, ils ne sont pas synchrones (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)).
5. **Le suivi est un prérequis.** Sans corrélation et traçage, un flux devient incompréhensible.
6. **L'architecture se combine avec des appels directs.** Tout n'est pas événementiel.

#### Vocabulaire essentiel

- **Chorégraphie** (*choreography*) : chaque composant réagit aux événements, sans chef d'orchestre.
- **Orchestration** (*orchestration*) : un composant central pilote la séquence des étapes.
- **Notification d'événement** (*event notification*) : l'événement signale un fait, le consommateur relit au besoin.
- **Transfert d'état par événement** (*event-carried state transfer*) : l'événement porte les données.
- **Communication synchrone** et **asynchrone** : l'appelant attend ou non la réponse.
- **Couplage temporel** : dépendance à la disponibilité simultanée de l'autre composant.
- **Trace distribuée** (*distributed trace*) : suivi d'une requête à travers plusieurs composants.

#### Relations de cause à effet

- Les réactions sont de simples abonnements. L'ajout d'une réaction n'exige pas de modifier l'émetteur, mais nul ne voit plus la totalité du flux.
- Un composant est indisponible. Les événements s'accumulent dans la file et seront traités à son retour, sans impact sur l'émetteur.
- Les événements portent des données internes. Les consommateurs en dépendent, et chaque évolution interne devient un changement cassant.

#### Idées reçues

- **« L'EDA remplace les appels directs. »** Non. Une lecture ou une validation immédiate reste un appel synchrone. L'EDA convient aux réactions, aux propagations et aux traitements différés.
- **« L'EDA est plus simple. »** Non. Elle déplace la complexité : traçabilité, ordre, doublons, cohérence à terme.
- **« Plus de découplage, c'est toujours mieux. »** Un découplage excessif rend le flux invisible et difficile à déboguer.

#### Principe clé

Utilisez les événements pour propager des faits et déclencher des réactions ; gardez les appels directs pour obtenir une réponse immédiate ; outillez le suivi dès le départ.

#### Si vous ne retenez que trois choses

1. Les composants réagissent à des événements au lieu de s'appeler entre eux.
2. Chorégraphie (réaction répartie) et orchestration (pilotage central) répondent à des besoins différents.
3. Corrélation, traçage et gouvernance des événements sont indispensables.

### 3. Explication technique détaillée

#### Trois usages des événements

| Usage | Principe | Exemple |
|---|---|---|
| Notification | Signaler un fait, le consommateur relit si besoin | `finding.created` : l'indexeur relit le constat |
| Transfert d'état | L'événement porte les données utiles | Copie locale d'un référentiel dans un autre service |
| Sourcing d'événements | Les événements sont la source de vérité | L'état est reconstruit à partir des événements (voir [7.9 Event sourcing](#79-event-sourcing)) |

#### Chorégraphie et orchestration

```text
CHORÉGRAPHIE                                  ORCHESTRATION

Ressource ─► [expired] ─► Workflow            Ressource ─► [expired]
                │ émet [workflow.started]             │
                ├──► Notification                     ▼
                ├──► Blocage                      Orchestrateur
                └──► Tâche                        │ 1. notifier
                                                   │ 2. bloquer
(chacun réagit à ce qu'il voit)                   │ 3. créer la tâche
                                                   │ (il connaît et suit la séquence)
```

| Critère | Chorégraphie | Orchestration |
|---|---|---|
| Couplage | Faible | Plus fort vers l'orchestrateur |
| Visibilité du flux | Faible, répartie | Forte, centralisée |
| Évolution | Ajout simple d'abonnés | Modification du pilote |
| Gestion des échecs | Complexe, répartie | Centralisée (voir [7.11 Saga](#711-saga)) |
| Cas favorable | Réactions indépendantes | Séquence avec ordre et compensation |

#### L'exemple du plan

```text
1. La ressource passe au statut « expiré »              (événement : resource.expired)
2. Le moteur d'automatisation démarre un workflow       (réaction)
3. Le workflow notifie le propriétaire                  (action)
4. Le workflow bloque la ressource                      (transition d'état)
5. Le workflow crée une tâche                           (création de ressource)
        chacune de ces étapes émet à son tour un événement
```

Ici, les étapes 3 à 5 sont **orchestrées** par un workflow : leur ordre importe et leur échec doit être géré. L'étape 2 est **chorégraphiée** : le workflow est un abonné de l'événement initial.

#### La corrélation

Pour suivre un déroulement à travers de nombreux composants, chaque événement porte :

- `correlation_id` : le même pour tout le déroulement, issu de la requête d'origine ;
- `causation_id` : l'identifiant de l'événement qui l'a causé.

```text
req_91ab33 ─► evt_1 (resource.expired)
                 └─► evt_2 (workflow.started, causé par evt_1)
                          ├─► evt_3 (notification.sent, causé par evt_2)
                          └─► evt_4 (aircraft.grounded, causé par evt_2)
```

Un outil de suivi reconstruit ce graphe pour répondre à « pourquoi cet aéronef a-t-il été bloqué ? ».

#### Les difficultés propres à l'EDA

| Difficulté | Réponse |
|---|---|
| Ordre des événements | Clé de partition, numéros de version |
| Doublons | Consommateurs idempotents (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) |
| Perte d'événement | Boîte d'envoi, réconciliation |
| Cohérence | Vue à terme, indicateurs de retard (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)) |
| Compréhension du flux | Corrélation, traçage, catalogue d'événements |
| Évolution des schémas | Versionnement, compatibilité |
| Test | Tests de contrat, rejeu d'événements |

#### Les anti-patrons

- **Spaghetti d'événements** : chaînes d'événements imbriquées que personne n'a dessinées.
- **Commande déguisée** : un événement qui impose une action précise à un seul destinataire.
- **Événement fourre-tout** : un type unique `changed` avec des données hétérogènes.
- **Appel synchrone par événements** : l'émetteur attend une réponse sur un autre événement, en réinventant un appel distant fragile.

**Contre-exemple.** Utiliser des événements pour valider qu'un identifiant de ressource existe avant d'enregistrer une relation. La validation exige une réponse immédiate : un appel direct, ou une contrainte en base, est le bon outil.

**Limites.** L'EDA convient aux flux où le retard de quelques secondes est acceptable. Pour des opérations qui exigent une cohérence immédiate et une réponse à l'utilisateur, on conserve des appels synchrones, dans les frontières de cohérence du service (voir [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action) à [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements) | L'EDA s'appuie sur les événements, les files et le bus |
| [7.8 Cohérence à terme](#78-cohérence-à-terme) | Elle implique la cohérence à terme |
| [7.11 Saga](#711-saga) | La saga coordonne des flux répartis avec compensations |
| [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) | Elle accompagne souvent les microservices |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Un workflow peut orchestrer une partie du flux |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Les traces et journaux permettent de suivre les flux |

### 5. Application pratique

**Situation initiale.** Le module de gestion des ressources appelle directement les modules de notification, d'audit, de recherche et d'automatisation, dans une même requête.

**Problème.** Une lenteur de l'un ralentit l'utilisateur. Un nouveau module oblige à modifier le code des ressources.

**Application du concept.** Le moteur de ressources émet un événement par changement ; les modules s'y abonnent.

**Déroulé.**

1. La requête de modification s'exécute et enregistre l'événement dans la même transaction.
2. Elle répond à l'utilisateur sans attendre les réactions.
3. Le bus distribue l'événement aux quatre modules.
4. Un cinquième module (statistiques) s'abonne sans toucher aux ressources.
5. Un outil de suivi relie par `correlation_id` l'action de l'utilisateur à toutes les réactions.

**Résultat.** La requête est plus rapide, et la plateforme s'étend sans modifier le cœur.

**Limites.** Les réactions arrivent avec quelques secondes de décalage. L'interface doit gérer cette cohérence à terme (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre chorégraphie et orchestration ?
2. **Compréhension.** Citez trois usages des événements.
3. **Compréhension.** À quoi servent l'identifiant de corrélation et l'identifiant de causalité ?
4. **Pourquoi.** Pourquoi l'EDA exige-t-elle des consommateurs idempotents ?
5. **Raisonnement pratique.** Dans quel cas un appel synchrone reste-t-il préférable à un événement ?

#### Réponses

1. En chorégraphie, chaque composant réagit sans chef d'orchestre ; en orchestration, un composant central pilote la séquence.
2. Par exemple : notification d'un fait, transfert d'état, sourcing d'événements.
3. L'identifiant de corrélation relie tous les événements d'un même déroulement ; l'identifiant de causalité désigne l'événement qui en a provoqué un autre.
4. Parce que la livraison peut être faite plusieurs fois (reprises) : un traitement non idempotent produirait des effets en double.
5. Quand l'appelant a besoin d'une réponse immédiate pour continuer, par exemple pour valider une donnée ou lire une valeur.

## 7.5 Webhook

### 1. Comprendre simplement

Un **webhook** est un **rappel HTTP** : quand un événement se produit dans la plateforme, celle-ci envoie automatiquement une requête HTTP (`POST`) contenant les informations de l'événement à une adresse que le client a configurée. Le système du client est ainsi prévenu en temps réel, sans interroger la plateforme en permanence.

**Pourquoi cela existe.** Sans webhook, un système externe qui veut connaître les changements doit interroger l'API toutes les minutes (*polling*). C'est coûteux, lent et inefficace : la plupart des interrogations ne trouvent rien de neuf.

**Problème résolu.** Notifier des systèmes externes des événements qui les concernent, rapidement et à faible coût, sans qu'ils aient à interroger.

**Modèle mental.** Laisser son numéro de téléphone pour être rappelé, plutôt que d'appeler toutes les cinq minutes pour savoir si le colis est arrivé.

**Où l'analogie s'arrête.** Un rappel téléphonique est fait par une personne qui réessaie, s'identifie et sait si vous avez décroché. Un webhook doit, lui, prouver son authenticité, gérer les indisponibilités du récepteur et éviter d'être utilisé comme outil d'attaque.

**Exemple.** La compagnie configure l'adresse `https://qualite.compagnie.example/hooks/platform`. À chaque constat critique, la plateforme y envoie l'événement correspondant.

**Les composants.**

1. un **point d'accès** (adresse) configuré par le client ;
2. un **abonnement** (types d'événements) ;
3. une **signature** qui authentifie l'envoi ;
4. des **reprises** en cas d'échec ;
5. un **journal** des livraisons.

**Objectif d'apprentissage :** vous pouvez décrire la livraison d'un webhook, expliquer la vérification de signature et citer deux risques de sécurité.

### 2. Connaissances essentielles

#### Définition

Un **webhook** est un mécanisme d'intégration par lequel un système, lors de la survenue d'un événement, envoie une requête HTTP vers une adresse enregistrée par un abonné, pour lui transmettre les données de cet événement.

#### Idées fondamentales

1. **C'est une poussée (*push*), non une interrogation (*pull*).** La plateforme prend l'initiative.
2. **La livraison est « au moins une fois ».** Le récepteur doit être idempotent.
3. **L'authenticité se prouve par signature.** Le récepteur vérifie que l'envoi vient bien de la plateforme.
4. **Les échecs sont attendus.** Reprises avec temporisation, puis désactivation.
5. **Le récepteur répond vite.** Il accuse réception et traite ensuite.
6. **La plateforme appelle des adresses fournies par des clients.** C'est une surface d'attaque à encadrer.

#### Vocabulaire essentiel

- **Point d'accès** (*endpoint*) : adresse du récepteur.
- **Signature** (*signature*) : valeur calculée avec un secret partagé pour authentifier le message.
- **HMAC** : code d'authentification de message à base de hachage et de clé secrète.
- **Rejeu** (*replay*) : renvoi d'un message ancien par un attaquant, ou par la plateforme sur demande.
- **Livraison** (*delivery*) : tentative d'envoi d'un événement à un point d'accès.
- **Falsification de requête côté serveur** (*SSRF*) : attaque qui pousse le serveur à appeler une adresse interne.
- **Désactivation automatique** : arrêt des envois vers un point d'accès qui échoue durablement.

#### Relations de cause à effet

- Le récepteur est indisponible. Sans reprises, des événements sont perdus ; avec des reprises, ils arrivent en retard et parfois dans le désordre.
- Aucune signature. N'importe qui peut envoyer de faux événements au récepteur.
- La plateforme appelle n'importe quelle adresse saisie par un client. Un client malveillant lui fait appeler des services internes.

#### Idées reçues

- **« Un webhook est fiable comme un appel d'API. »** Non. Le récepteur peut être arrêté, lent ou en erreur. La livraison est au mieux « au moins une fois », sans ordre garanti.
- **« Une adresse secrète suffit à protéger un webhook. »** Non. Elle fuit dans les journaux. Une signature vérifiée est nécessaire.
- **« Le webhook transporte toute la donnée. »** Souvent il ne transporte que l'essentiel : le récepteur rappelle l'API pour obtenir le détail.

#### Principe clé

Un webhook est une livraison « au moins une fois » vers un récepteur extérieur : il faut le signer, le rejouer avec méthode et protéger la plateforme des adresses qu'on lui donne.

#### Si vous ne retenez que trois choses

1. Un webhook envoie un événement par HTTP vers une adresse choisie par le client.
2. Le récepteur vérifie la signature et traite chaque événement de façon idempotente.
3. La plateforme doit se protéger des adresses malveillantes et gérer les échecs.

### 3. Explication technique détaillée

#### Le déroulement d'une livraison

```text
Événement ──► Abonnement (filtre) ──► File de livraison ──► POST vers le point d'accès
                                              │                       │ 2xx dans le délai ?
                                              │                 oui ──┴── non
                                              │                  │         │
                                          succès (journal)       │    reprise avec temporisation
                                                                 │         │ (après N échecs)
                                                                 └──── file des échecs, alerte,
                                                                       désactivation éventuelle
```

#### Une requête de webhook

```http
POST /hooks/platform HTTP/1.1
Host: qualite.compagnie.example
Content-Type: application/json
User-Agent: Platform-Webhooks/1.0
X-Platform-Event: finding.created
X-Platform-Delivery: dlv_77c2e1
X-Platform-Timestamp: 1760343165
X-Platform-Signature: v1=5f2b…c9a1

{ "id": "evt_01HZX4Q8", "type": "finding.created",
  "data": { "finding_id": "fd_204", "severity": "critical" } }
```

#### La signature

La plateforme calcule, avec un secret partagé propre à l'abonnement :

$$\text{signature} = \text{HMAC-SHA256}\big(\text{secret},\; \text{horodatage} \,\|\, "." \,\|\, \text{corps}\big)$$

où $\|$ désigne la concaténation.

**Vérification côté récepteur.**

```text
1. Lire l'horodatage et la signature dans les en-têtes
2. Refuser si l'horodatage est trop ancien (par exemple plus de 5 minutes) : protection contre le rejeu
3. Recalculer la signature avec le secret et le corps brut reçu
4. Comparer en temps constant ; refuser si différent
5. Dédupliquer par identifiant d'événement
6. Répondre 2xx rapidement, traiter ensuite
```

**Pourquoi l'horodatage dans la signature.** Il lie la signature à un instant : un attaquant qui capture une requête ne peut pas la rejouer indéfiniment.

#### Les reprises

| Tentative | Délai avant | Remarque |
|---|---|---|
| 1 | Immédiat | Première livraison |
| 2 | 30 s | Après un échec |
| 3 | 5 min | |
| 4 | 30 min | |
| 5 | 2 h | |
| 6 | 12 h | Dernière tentative |

Après l'épuisement, l'événement va dans la file des échecs. Un point d'accès qui échoue durablement est désactivé avec une alerte au tenant (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)). Les délais exacts sont un choix de conception.

#### La sécurité côté plateforme

| Risque | Parade |
|---|---|
| Appel vers des adresses internes (SSRF) | Interdire les adresses privées et de boucle locale, vérifier après résolution DNS, limiter aux schémas autorisés |
| Redirections vers l'interne | Ne pas suivre les redirections, ou les revalider |
| Récepteur lent qui ralentit les envois | Délai court, isolation par point d'accès |
| Charge utile trop grosse | Taille limitée |
| Fuite de secrets | Secret propre à chaque abonnement, rotation |
| Données sensibles dans le corps | Contenu minimal, chiffrement à la source si nécessaire |

#### La gestion côté administrateur

- création du point d'accès, choix des types d'événements, génération du secret ;
- **test** d'envoi ;
- **journal des livraisons** avec statut, durée, réponse ;
- **rejeu** manuel d'une livraison ;
- **rotation** du secret avec période de recouvrement (voir [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations)).

**Contre-exemple.** Appeler l'adresse du client dans la même transaction que la modification. Une lenteur du récepteur bloque l'utilisateur, et une panne annule la modification. Les webhooks sont toujours envoyés après validation, de façon asynchrone.

**Limites.** Les webhooks ne garantissent pas l'ordre : un événement `updated` peut arriver avant `created`. Le récepteur utilise les numéros de version ou rappelle l'API pour l'état courant.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.3 Publication-abonnement et bus d'événements](#73-publication-abonnement-et-bus-dévénements) | Un webhook est un abonnement dont la livraison est un appel HTTP |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La file des échecs reçoit les livraisons épuisées |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Le récepteur doit être idempotent |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration gère les points d'accès, les secrets et les journaux |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) | Les connecteurs et adaptateurs construisent sur ce mécanisme |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces identifie le risque SSRF |

### 5. Application pratique

**Situation initiale.** Le système qualité du client interroge l'API toutes les 5 minutes pour savoir si un constat critique a été créé.

**Problème.** Les constats critiques sont connus avec jusqu'à 5 minutes de retard, et l'API reçoit 288 appels par jour pour un événement rare.

**Application du concept.** Le client configure un webhook sur `finding.created` avec un filtre de gravité.

**Déroulé.**

1. L'administrateur enregistre l'adresse, choisit l'événement et récupère le secret.
2. Il implémente la vérification de signature côté récepteur.
3. Un constat critique est créé ; la plateforme envoie la requête en quelques secondes.
4. Le récepteur répond `200`, enregistre l'identifiant d'événement et traite.
5. Pendant une panne de 20 minutes du récepteur, les envois sont repris avec temporisation, puis livrés.

**Résultat.** Le système qualité est prévenu en quelques secondes, avec moins de trafic, sans perte d'événements.

**Limites.** Pendant une longue panne, les événements arrivent en rafale à la reprise : le récepteur doit les absorber, et traiter l'ordre par numéro de version.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un webhook et l'interrogation d'une API ?
2. **Compréhension.** À quoi sert la signature d'un webhook ?
3. **Compréhension.** Pourquoi inclut-on l'horodatage dans la signature ?
4. **Pourquoi.** Pourquoi le récepteur doit-il être idempotent ?
5. **Raisonnement pratique.** Un client saisit comme adresse de webhook `http://10.0.0.5/admin`. Quel risque, et que faire ?

#### Réponses

1. Avec un webhook, la plateforme prend l'initiative et envoie l'événement ; avec l'interrogation, le client demande régulièrement s'il y a du nouveau.
2. À prouver que le message vient de la plateforme et n'a pas été altéré.
3. Pour qu'un attaquant ne puisse pas rejouer plus tard une requête capturée : le récepteur refuse les horodatages trop anciens.
4. Parce que la livraison est « au moins une fois » : un événement peut arriver plusieurs fois après des reprises.
5. Un risque de falsification de requête côté serveur (SSRF) : la plateforme appellerait un service interne. Il faut refuser les adresses privées, vérifier après la résolution DNS et limiter les redirections.

## 7.6 Tâche planifiée et tâche de fond

### 1. Comprendre simplement

Une **tâche planifiée** (*scheduled job*) est un traitement qui s'exécute **à une heure donnée ou de façon récurrente** : chaque nuit à 2 h, le premier jour du mois, toutes les 15 minutes. Une **tâche de fond** (*background job*) est un traitement exécuté **en dehors de la requête de l'utilisateur**, de façon asynchrone : un import, la génération d'un rapport, l'envoi de courriels.

**Pourquoi cela existe.** Certains traitements sont trop longs pour tenir dans une requête : l'utilisateur ne peut pas attendre cinq minutes devant un écran figé. D'autres dépendent du temps et non d'une action : une échéance, un rappel, un nettoyage.

**Problème résolu.** Exécuter du travail long ou différé sans bloquer les utilisateurs, et déclencher des traitements par le temps.

**Modèle mental.** Le personnel de nuit d'un bâtiment : il intervient à heures fixes (tâches planifiées) ou sur demande, pendant que les occupants ne sont pas là (tâches de fond).

**Où l'analogie s'arrête.** Le personnel est identifiable et unique. En plateforme, plusieurs instances peuvent tenter d'exécuter la même tâche, et un redémarrage peut la laisser à moitié faite.

**Exemple.** Chaque nuit, une tâche planifiée recalcule les échéances d'inspection de chaque tenant. Chaque lundi à 7 h (heure du tenant), une autre envoie le récapitulatif hebdomadaire.

**Les composants.**

1. une **définition** (quoi, quand, pour qui) ;
2. un **planificateur** qui déclenche ;
3. une **file** et des **exécutants** (*workers*) ;
4. un **suivi** (états, résultats, journaux).

**Objectif d'apprentissage :** vous pouvez décrire comment une tâche planifiée est déclenchée une seule fois dans un système réparti, et expliquer les pièges des fuseaux horaires.

### 2. Connaissances essentielles

#### Définition

- **Tâche planifiée** : traitement déclenché par le temps, selon une échéance unique ou une règle de récurrence.
- **Tâche de fond** : traitement exécuté de manière asynchrone, hors du cycle de requête, généralement via une file et des exécutants.

#### Idées fondamentales

1. **La requête répond vite, le travail se fait après.** L'utilisateur reçoit un identifiant de tâche.
2. **Le temps est un déclencheur.** Échéances, rappels, expirations, nettoyages.
3. **Une tâche est déclenchée une seule fois.** Dans un système réparti, une seule instance doit la lancer.
4. **L'exécution est « au moins une fois ».** Les tâches sont idempotentes.
5. **Chaque tâche a un état suivi.** En attente, en cours, réussie, échouée, annulée.
6. **Les tâches respectent l'équité entre tenants.** Quotas et files séparées.

#### Vocabulaire essentiel

- **Expression cron** : notation de récurrence à cinq champs (minute, heure, jour du mois, mois, jour de la semaine).
- **Exécutant** (*worker*) : processus qui prend des tâches et les exécute.
- **Bail** (*lease*) : droit temporaire de traiter une tâche, à renouveler.
- **Battement de cœur** (*heartbeat*) : signal périodique qui indique qu'une tâche vit.
- **Tâche manquée** (*missed run*, *misfire*) : exécution qui n'a pas eu lieu à l'heure prévue.
- **Chevauchement** (*overlap*) : une exécution démarre alors que la précédente n'est pas finie.
- **Point de reprise** (*checkpoint*) : sauvegarde d'avancement pour reprendre après interruption.

#### Relations de cause à effet

- Plusieurs instances de la plateforme déclenchent la même tâche planifiée. Elle s'exécute en double : mails en double, calculs en double.
- La plateforme est arrêtée à l'heure prévue. La tâche est manquée : sans politique de rattrapage, un cycle de traitement est perdu.
- Tous les tenants ont leur tâche à minuit. La charge se concentre en une minute, et le service ralentit.

#### Idées reçues

- **« Une tâche planifiée s'exécute toujours à l'heure. »** Non. Elle s'exécute au mieux à l'heure : retards, redémarrages, saturation.
- **« Un fuseau horaire est un détail. »** Non. Une tâche « chaque jour à 2 h 30 » n'existe pas le jour du passage à l'heure d'été et existe deux fois le jour du retour à l'heure d'hiver.
- **« Une tâche de fond n'a pas besoin de suivi. »** Non. Sans état visible, l'utilisateur ne sait pas si son import a abouti.

#### Principe clé

Une tâche différée est une unité de travail durable, identifiable, idempotente et suivie ; son déclenchement par le temps doit être unique et son horaire sans ambiguïté.

#### Si vous ne retenez que trois choses

1. Les tâches de fond et planifiées sortent le travail long ou temporel de la requête.
2. Le déclenchement doit être unique, l'exécution idempotente et l'état suivi.
3. Fuseaux horaires et concentration des échéances sont des pièges classiques.

### 3. Explication technique détaillée

#### Les types de tâches

| Type | Déclencheur | Exemple |
|---|---|---|
| Tâche de fond à la demande | Action de l'utilisateur | Génération d'un rapport |
| Tâche récurrente | Règle de récurrence | Recalcul nocturne des échéances |
| Tâche différée unique | Date précise | Rappel 30 jours avant l'échéance |
| Tâche de maintenance | Interne | Purge, archivage, réindexation |
| Tâche de réaction | Événement | Traitement d'un webhook entrant |

#### Une tâche comme donnée

```json
{
  "id": "job_88f1",
  "tenant_id": "ten_airline_01",
  "type": "report.generate",
  "status": "running",
  "attempt": 1,
  "run_at": "2026-10-13T02:00:00Z",
  "started_at": "2026-10-13T02:00:03Z",
  "heartbeat_at": "2026-10-13T02:01:30Z",
  "progress": { "done": 4200, "total": 10000 },
  "idempotency_key": "report:2026-10:ten_airline_01"
}
```

#### La récurrence

Une expression cron compte cinq champs.

```text
┌───────── minute (0–59)
│ ┌─────── heure (0–23)
│ │ ┌───── jour du mois (1–31)
│ │ │ ┌─── mois (1–12)
│ │ │ │ ┌─ jour de la semaine (0–6)
│ │ │ │ │
0 2 * * *        chaque jour à 02:00
0 7 * * 1        chaque lundi à 07:00
*/15 * * * *     toutes les 15 minutes
```

Une plateforme multi-tenant stocke la **règle** et le **fuseau horaire** du tenant.

#### Les fuseaux horaires et l'heure d'été

| Situation | Effet sur « chaque jour à 2 h 30 » |
|---|---|
| Passage à l'heure d'été (2 h devient 3 h) | L'instant 2 h 30 n'existe pas : la tâche est sautée ou décalée selon la politique |
| Retour à l'heure d'hiver (3 h devient 2 h) | L'instant 2 h 30 existe deux fois : la tâche peut s'exécuter deux fois |

**Parades.** Stocker les instants en UTC, calculer la prochaine occurrence avec une bibliothèque de fuseaux, et définir explicitement le comportement aux changements d'heure.

#### Le déclenchement unique

Dans un système avec plusieurs instances, une technique courante utilise la base de données comme coordinateur :

```sql
-- Chaque exécutant réserve des tâches échues sans bloquer les autres
SELECT id
FROM job
WHERE status = 'queued' AND run_at <= now()
ORDER BY run_at
LIMIT 10
FOR UPDATE SKIP LOCKED;
```

**Comment cela fonctionne.** `FOR UPDATE SKIP LOCKED` verrouille les lignes choisies et ignore celles déjà verrouillées par un autre exécutant. Deux exécutants ne prennent jamais la même tâche, et aucun n'attend l'autre.

#### La tâche longue

| Besoin | Mécanisme |
|---|---|
| Savoir si la tâche vit | Battement de cœur, bail renouvelé |
| Reprendre après interruption | Points de reprise (dernier lot traité) |
| Annuler | Drapeau d'annulation vérifié entre les lots |
| Montrer l'avancement | Compteurs enregistrés régulièrement |
| Éviter les doublons | Clé d'idempotence par tâche (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)) |

#### Les pics de minuit

Si 5 000 tenants ont chacun une tâche à 00:00, la charge est de 5 000 tâches en une minute. On répartit :

- **décalage aléatoire** (*jitter*) par tenant, par exemple dans une fenêtre de 30 minutes ;
- **équité** : file par tenant ou limite de concurrence par tenant ;
- **priorités** : les tâches interactives passent avant les tâches de maintenance.

**Contre-exemple.** Une tâche planifiée implémentée par un `cron` installé sur chaque serveur de la plateforme. Avec dix serveurs, elle s'exécute dix fois ; avec un seul, elle est perdue en cas de panne de ce serveur.

**Limites.** Les tâches de fond ne conviennent pas à tout. Un traitement dont l'utilisateur attend le résultat immédiat reste dans la requête, ou fait l'objet d'une expérience en deux temps (avancement, notification).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.2 Message et file d'attente](#72-message-et-file-dattente) | Les tâches de fond s'exécutent via des files |
| [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse) | Les opérations en masse volumineuses sont des tâches de fond |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence protège contre les doubles exécutions |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Les délais et reprises s'appliquent aux tâches |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les échéances et dates d'effet relèvent de la modélisation temporelle |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | L'administration opérationnelle suit les tâches |

### 5. Application pratique

**Situation initiale.** Le client souhaite recevoir chaque lundi à 7 h, heure de Paris, un récapitulatif des inspections à venir.

**Problème.** Le récapitulatif ne doit être envoyé qu'une fois, malgré plusieurs instances de la plateforme, et à la bonne heure même au changement d'heure.

**Application du concept.** Une tâche planifiée par tenant, avec fuseau et clé d'idempotence.

**Déroulé.**

1. La règle `0 7 * * 1` et le fuseau `Europe/Paris` sont enregistrés dans la configuration du tenant.
2. Le planificateur calcule la prochaine occurrence en UTC et crée une tâche avec une clé `digest:2026-10-19:ten_airline_01`.
3. Un exécutant réserve la tâche (`SKIP LOCKED`), la traite et enregistre le résultat.
4. Si la plateforme redémarre pendant l'exécution, le bail expire et un autre exécutant reprend ; la clé d'idempotence évite le doublon d'envoi.
5. La prochaine occurrence est calculée.

**Résultat.** Le récapitulatif part chaque lundi à 7 h, une seule fois, y compris pendant le passage à l'heure d'été.

**Limites.** Si la plateforme est arrêtée à 7 h, la politique de rattrapage décide s'il faut envoyer le récapitulatif à la reprise ou le sauter.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une tâche planifiée et une tâche de fond ?
2. **Compréhension.** Que signifie l'expression cron `0 7 * * 1` ?
3. **Compréhension.** Pourquoi une tâche « chaque jour à 2 h 30 » pose-t-elle problème lors des changements d'heure ?
4. **Pourquoi.** Pourquoi une tâche doit-elle être idempotente ?
5. **Raisonnement pratique.** Comment éviter que 5 000 tenants lancent leur tâche à minuit pile ?

#### Réponses

1. Une tâche planifiée est déclenchée par le temps ; une tâche de fond est exécutée de façon asynchrone hors de la requête, souvent à la demande.
2. Chaque lundi à 7 h 00.
3. Au passage à l'heure d'été, cet instant n'existe pas ; au retour à l'heure d'hiver, il existe deux fois : la tâche peut être sautée ou exécutée deux fois.
4. Parce qu'elle peut être exécutée plusieurs fois (reprise après redémarrage, double déclenchement) : le résultat doit rester le même.
5. En répartissant les échéances par un décalage aléatoire par tenant, avec des files équitables et des limites de concurrence.

## 7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs

### 1. Comprendre simplement

Quand un consommateur échoue à traiter un message, trois mécanismes se combinent. La **nouvelle tentative** (*retry*) retraite le message plus tard. La **file de lettres mortes** (*dead-letter queue*, **DLQ**) met de côté les messages qui échouent toujours, pour examen. L'**idempotence du consommateur** (*idempotency*) garantit que traiter plusieurs fois le même message ne produit qu'un seul effet.

**Pourquoi cela existe.** Dans un système de messagerie, des échecs surviennent : service tiers indisponible, donnée inattendue, bug. Sans reprise, des messages sont perdus ; sans limite, un message défectueux bloque le traitement ; sans idempotence, les reprises dupliquent les effets.

**Problème résolu.** Traiter chaque message de façon fiable malgré les pannes, sans perdre de message, sans bloquer le flux et sans doubler les effets.

**Modèle mental.** Le courrier non distribuable. La poste réessaie, puis, si l'adresse est introuvable, dépose la lettre au **service des rebuts** (le *dead letter office*), où on l'examine. D'où le nom de la file.

**Où l'analogie s'arrête.** Une lettre est un objet physique, qu'on ne distribue qu'une fois. Un message peut être livré plusieurs fois, et le facteur logiciel doit vérifier qu'il ne l'a pas déjà traité.

**Exemple.** Un message « envoyer la facture du constat F-204 » échoue car le service de facturation est en panne. Il est repris après 5 s, 30 s, 5 min. Après la quatrième tentative, il est déposé dans la file des échecs et une alerte est émise.

**Les composants.**

1. une **politique de reprise** ;
2. une **file des échecs** ;
3. un **registre de messages traités** ;
4. un **outil de relecture** (*redrive*).

**Objectif d'apprentissage :** vous pouvez décrire le parcours d'un message en échec, et concevoir un consommateur idempotent.

### 2. Connaissances essentielles

#### Définition

- **Reprise de message** : redélivrance automatique d'un message dont le traitement a échoué, selon une politique de nombre et d'espacement.
- **File de lettres mortes** : file de destination des messages qui ont épuisé leurs tentatives ou qui sont jugés impossibles à traiter.
- **Consommateur idempotent** : consommateur dont le traitement d'un message déjà vu ne produit aucun effet supplémentaire.

#### Idées fondamentales

1. **On distingue les échecs passagers et permanents.** Réessayer les premiers, mettre de côté les seconds.
2. **Les reprises sont espacées.** Temporisation croissante et aléa (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
3. **Un message défectueux ne bloque pas le flux.** Il est isolé dans la file des échecs.
4. **La file des échecs est surveillée.** Elle a un propriétaire, une alerte, un délai de traitement.
5. **Les messages mis de côté peuvent être rejoués.** Après correction, on les remet dans le flux.
6. **Le consommateur déduplique.** Un registre associe l'identifiant du message à son traitement.

#### Vocabulaire essentiel

- **Message empoisonné** (*poison message*) : message qui échoue systématiquement.
- **Relecture** (*redrive*, *replay*) : remise des messages de la file des échecs dans la file principale.
- **File de reprise** (*retry queue*) : file à délai pour les messages à retraiter plus tard.
- **Boîte de réception** (*inbox*) : table des messages déjà traités, pour la déduplication.
- **Livraison au moins une fois** : chaque message est délivré une ou plusieurs fois.
- **Âge du plus ancien message** (*oldest message age*) : indicateur de retard de traitement.

#### Relations de cause à effet

- Un message défectueux est réessayé sans limite. Il consomme des ressources, bloque les messages suivants dans une file ordonnée et masque les vraies pannes.
- Les messages en échec sont déposés dans la file des échecs sans que personne ne la surveille. Ils s'y accumulent jusqu'à expirer, et sont perdus.
- Le consommateur n'est pas idempotent. Après une reprise, l'effet est appliqué deux fois : deux factures, deux courriels.

#### Idées reçues

- **« La file des échecs est une corbeille. »** Non. C'est une file de travail à traiter : elle doit avoir un responsable et des alertes.
- **« Réessayer indéfiniment garantit de ne rien perdre. »** Non. Cela bloque le flux et masque les erreurs permanentes ; la limite et la mise de côté sont la bonne réponse.
- **« L'idempotence est la responsabilité de la file. »** Non. Elle est la responsabilité du consommateur : la file ne sait pas ce que le traitement fait.

#### Principe clé

Réessayez ce qui est passager, isolez ce qui est durable, surveillez ce que vous isolez, et rendez chaque consommateur capable de recevoir deux fois le même message.

#### Si vous ne retenez que trois choses

1. Les reprises, la file des échecs et l'idempotence forment un ensemble inséparable.
2. La file des échecs est surveillée et rejouable, pas une corbeille.
3. Le consommateur déduplique par identifiant de message, dans la même transaction que son effet.

### 3. Explication technique détaillée

#### Le parcours d'un message en échec

```text
File principale ──► Consommateur ──► succès ──► acquittement
                         │ échec
                         ▼
                 classer l'erreur
          ┌──────────────┴───────────────┐
      passagère                        permanente
          │                                │
          ▼                                ▼
 File de reprise (délai : 5 s, 30 s, 5 min)    File des échecs (immédiat)
          │ retraitement                       │ alerte + investigation
          └──► File principale                 └──► après correction : relecture
                 (au bout de N tentatives ─► File des échecs)
```

#### Reprise bloquante ou non

| Mode | Principe | Avantage | Inconvénient |
|---|---|---|---|
| Bloquante | On réessaie le même message avant de passer au suivant | Conserve l'ordre | Un message défectueux bloque tout |
| Non bloquante | Le message en échec est déplacé vers une file de reprise, le flux continue | Pas de blocage | L'ordre n'est plus garanti |

Sur une file ordonnée par ressource, on peut réserver la reprise bloquante à la clé de la ressource concernée, sans bloquer les autres.

#### Le consommateur idempotent

```sql
CREATE TABLE processed_message (
  consumer   text        NOT NULL,
  message_id text        NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (consumer, message_id)
);
```

```text
Traiter(message) :
  BEGIN
    INSERT INTO processed_message (consumer, message_id) VALUES (...)
      ON CONFLICT DO NOTHING
    si 0 ligne insérée : message déjà traité → COMMIT et ignorer
    sinon : appliquer l'effet métier                 (même transaction)
  COMMIT
  acquitter le message
```

**Pourquoi la même transaction.** L'inscription du message traité et l'effet sont atomiques : on n'a ni effet sans inscription (doublon à la reprise) ni inscription sans effet (message perdu).

**Limite.** Si l'effet est un appel externe non transactionnel (courriel), l'atomicité n'est pas possible : on utilise une clé d'idempotence auprès du service externe (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

#### La file des échecs en exploitation

| Indicateur | Question |
|---|---|
| Profondeur | Combien de messages attendent ? |
| Âge du plus ancien | Depuis combien de temps un message est-il en échec ? |
| Taux d'entrée | Combien arrivent par heure ? |
| Cause principale | Quelle erreur domine ? |
| Délai de résolution | Combien de temps avant la relecture ? |

**Bonnes pratiques.**

- conserver les **métadonnées d'origine** : message, tentatives, erreurs, instant ;
- classer les causes (donnée invalide, dépendance indisponible, bug) ;
- fournir une **relecture** unitaire et en lot, avec contrôle de la charge ;
- fixer une **durée de conservation** et un responsable ;
- protéger les **données personnelles** contenues dans les messages.

#### Les réglages d'une politique

```json
{
  "queue": "billing.invoice.requested",
  "max_attempts": 5,
  "backoff": { "type": "exponential", "initial": "PT5S", "max": "PT10M", "jitter": 0.2 },
  "retry_on": ["unavailable", "timeout", "rate_limited"],
  "dead_letter": { "queue": "billing.invoice.requested.dlq", "retention": "P14D", "alert_after": "PT1H" }
}
```

**Contre-exemple.** Rejouer automatiquement et immédiatement toute la file des échecs, une fois le service rétabli. Des milliers de messages arrivent d'un coup, saturent le service qui vient de redémarrer, et recréent la panne.

**Limites.** Un système qui génère des échecs constants cache un défaut de conception. La file des échecs est un symptôme : l'objectif est de réduire les causes, pas d'accumuler des messages.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Les politiques de délai et de reprise y sont présentées en général |
| [7.2 Message et file d'attente](#72-message-et-file-dattente) | Les files délivrent « au moins une fois » |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence est la condition de sécurité des reprises |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | L'inscription du message traité et l'effet sont dans la même transaction |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | L'administration opérationnelle suit la file des échecs |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les alertes sur profondeur et âge relèvent de la surveillance |

### 5. Application pratique

**Situation initiale.** Le service de facturation consomme des messages `invoice.requested`. Une nuit, le système comptable du client est indisponible pendant trois heures.

**Problème.** Certains messages sont perdus, d'autres sont traités deux fois après des redémarrages.

**Application du concept.** Politique de reprise avec file des échecs, et consommateur idempotent par identifiant de message.

**Déroulé.**

1. Chaque message échoue avec « indisponible » et part dans la file de reprise avec un délai croissant.
2. Après cinq tentatives (environ 40 minutes), les messages vont dans la file des échecs, et une alerte est émise.
3. Le système comptable est rétabli. Un opérateur déclenche la relecture par lots de 100.
4. Quelques messages avaient déjà été traités avant une coupure : le registre les détecte et les ignore.

**Résultat.** Aucune facture perdue, aucune facture en double, et l'incident est traité avec une trace complète.

**Limites.** La relecture massive doit être limitée en débit pour ne pas saturer à nouveau le système comptable.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quoi sert une file de lettres mortes ?
2. **Compréhension.** Qu'est-ce qu'un message empoisonné ?
3. **Compréhension.** Comment un consommateur reconnaît-il un message déjà traité ?
4. **Pourquoi.** Pourquoi la déduplication et l'effet métier sont-ils dans la même transaction ?
5. **Raisonnement pratique.** La file des échecs contient 40 000 messages après un incident. Comment les rejouer sans reproduire la panne ?

#### Réponses

1. À mettre de côté les messages qui ont épuisé leurs tentatives ou ne peuvent pas être traités, pour les examiner sans bloquer le flux.
2. Un message dont le traitement échoue systématiquement, par exemple à cause d'une donnée inattendue.
3. Il consulte un registre des identifiants de messages traités ; si l'identifiant y est déjà, il ignore le message.
4. Pour que l'inscription et l'effet réussissent ou échouent ensemble : sans cela, on perd un message ou on le traite deux fois.
5. Par une relecture par lots, avec un débit limité et une surveillance du service cible, en s'appuyant sur l'idempotence pour absorber les doublons.

## 7.8 Cohérence à terme

### 1. Comprendre simplement

La **cohérence à terme** (*eventual consistency*) est la propriété d'un système dans lequel, si l'on cesse de modifier une donnée, **toutes ses copies finissent par avoir la même valeur**, mais pendant un certain temps elles peuvent différer. La cohérence « forte » exige au contraire que tout le monde voie immédiatement la dernière valeur.

**Pourquoi cela existe.** Dans un système réparti, garantir que toutes les copies sont à jour au même instant coûte du temps de réponse et de la disponibilité (voir [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)). Les architectures événementielles, les index de recherche et les vues dérivées sont mises à jour de façon asynchrone : elles ont du retard, par construction.

**Problème résolu.** Obtenir de la disponibilité, du débit et de l'indépendance entre composants, en acceptant un retard borné dans la visibilité des changements.

**Modèle mental.** Les panneaux d'une gare. Quand un train est retardé, les panneaux sont mis à jour l'un après l'autre. Pendant quelques secondes, certains affichent l'ancienne heure. Ils convergent ensuite.

**Où l'analogie s'arrête.** Les panneaux d'une gare sont mis à jour par une seule source fiable. Dans un système, une mise à jour peut être perdue : sans mécanisme de rattrapage, la divergence est permanente.

**Exemple.** Un technicien crée un aéronef. La liste affichée juste après ne le contient pas encore : l'index de recherche est mis à jour deux secondes plus tard.

**Les composants.**

1. une **source de vérité** ;
2. des **copies dérivées** (index, vues, caches) ;
3. un **mécanisme de propagation** (événements) ;
4. un **mécanisme de rattrapage** (réconciliation).

**Objectif d'apprentissage :** vous pouvez dire où la cohérence à terme apparaît dans la plateforme, et comment la rendre acceptable pour l'utilisateur.

### 2. Connaissances essentielles

#### Définition

La **cohérence à terme** est une garantie selon laquelle, en l'absence de nouvelles modifications, toutes les réplicas ou copies d'une donnée convergent vers la même valeur après un délai fini. Elle s'oppose à la cohérence forte, où toute lecture voit la dernière écriture validée.

#### Idées fondamentales

1. **Le retard est la règle, pas l'exception.** Index, projections, caches, répliques.
2. **La convergence est promise, le délai ne l'est pas toujours.** Il doit être mesuré et borné par objectif.
3. **La source de vérité est unique.** Les copies en dérivent.
4. **Certaines données exigent la cohérence forte.** Invariants, unicité, solde, droits.
5. **L'expérience utilisateur compense.** Retour immédiat de ce que l'utilisateur vient d'écrire, indicateur de mise à jour.
6. **Un rattrapage est nécessaire.** Un événement perdu ne se rattrape pas tout seul.

#### Vocabulaire essentiel

- **Fenêtre d'incohérence** (*inconsistency window*) : durée pendant laquelle les copies diffèrent.
- **Retard de réplication** (*replication lag*) : écart entre source et copie.
- **Lecture de sa propre écriture** (*read-your-writes*) : garantie qu'un utilisateur voit ce qu'il vient d'écrire.
- **Lecture monotone** (*monotonic reads*) : garantie de ne pas voir une valeur plus ancienne après une plus récente.
- **Convergence** (*convergence*) : atteinte du même état par toutes les copies.
- **Réconciliation** (*reconciliation*, *anti-entropy*) : processus qui détecte et corrige les écarts.
- **Dernière écriture gagnante** (*last-write-wins*) : règle de résolution simple par horodatage.

#### Relations de cause à effet

- Un index de recherche est alimenté par des événements. Une rafale de modifications crée du retard : la recherche est en décalage de plusieurs secondes ou minutes.
- Un événement est perdu. L'index diverge durablement de la base : sans réconciliation, personne ne s'en aperçoit.
- L'utilisateur modifie un champ puis recharge la liste. Il voit l'ancienne valeur, croit que son changement a échoué et recommence.

#### Idées reçues

- **« Cohérence à terme signifie incohérence permanente. »** Non. Elle promet la convergence, avec un délai que l'on mesure et que l'on borne.
- **« La cohérence forte est toujours meilleure. »** Non. Elle a un coût en latence et en disponibilité ; on la réserve à ce qui l'exige.
- **« C'est un problème de base de données seulement. »** Non. Tout composant qui dérive des données par asynchronisme y est exposé.

#### Principe clé

Choisissez, donnée par donnée, ce qui doit être immédiatement cohérent et ce qui peut converger ; mesurez le retard et donnez un moyen de rattraper les écarts.

#### Si vous ne retenez que trois choses

1. Les copies dérivées convergent vers la source avec un retard mesurable.
2. Les invariants et les décisions critiques restent en cohérence forte, dans la frontière du service.
3. Il faut un rattrapage, des indicateurs de retard et une expérience utilisateur adaptée.

### 3. Explication technique détaillée

#### Où elle apparaît dans la plateforme

| Composant | Source de vérité | Retard typique | Atténuation |
|---|---|---|---|
| Index de recherche | Base transactionnelle | Secondes | Lecture de sa propre écriture, indicateur de mise à jour |
| Tableaux de bord et agrégats | Événements, base | Secondes à minutes | Horodatage de dernière mise à jour affiché |
| Réplicas de lecture | Base principale | Millisecondes à secondes | Lecture sur la principale juste après écriture |
| Caches | Base | Durée de vie du cache | Invalidation sur événement |
| Systèmes tiers synchronisés | Plateforme | Minutes | Statut de synchronisation |
| Webhooks | Plateforme | Secondes | Rappel de l'API pour l'état courant |

#### La mesure du retard

$$\text{retard}(t) = t_{\text{visible}} - t_{\text{validé}}$$

où $t_{\text{validé}}$ est l'instant de validation du changement dans la source et $t_{\text{visible}}$ l'instant où il est visible dans la copie. On fixe un objectif, par exemple « 99 % des changements visibles dans l'index en moins de 5 secondes ».

#### Les garanties de session

| Garantie | Signification | Comment l'obtenir |
|---|---|---|
| Lecture de sa propre écriture | Je vois ce que je viens d'écrire | Retourner la ressource écrite, lire sur la source, attendre un jeton de version |
| Lecture monotone | Je ne vois pas de valeur plus ancienne après une plus récente | Affecter une session à une réplique, ou transmettre une version minimale |
| Ordre causal | Je vois la cause avant l'effet | Versionnement, horloges logiques |

#### Un exemple de gestion d'interface

```text
1. L'utilisateur crée un aéronef (POST).
2. La réponse contient la ressource créée, avec sa version : l'interface l'affiche immédiatement.
3. L'interface recharge la liste (index) ; si la version attendue n'y figure pas encore,
   elle réessaie brièvement ou affiche « mise à jour en cours ».
4. L'indexation se termine ; la liste converge.
```

#### La réconciliation

| Technique | Principe |
|---|---|
| Balayage périodique | Comparer la source et la copie par lots, corriger les écarts |
| Sommes de contrôle par segment | Comparer des empreintes pour localiser les écarts |
| Réindexation à la demande | Reconstruire entièrement une copie dérivée |
| Contrôle de version | Chaque écriture porte une version ; une copie plus ancienne est mise à jour |

#### Ce qui reste en cohérence forte

| Donnée | Pourquoi |
|---|---|
| Unicité (immatriculation) | Un doublon ne se « corrige » pas à terme sans conséquences |
| État d'un workflow et ses transitions | Les règles dépendent de l'état exact |
| Droits d'accès | Un retrait de droit doit être effectif tôt (voir [4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac)) |
| Soldes, quotas | Un dépassement ne se rattrape pas |

**Contre-exemple.** Vérifier l'unicité d'une immatriculation en interrogeant l'index de recherche. Entre deux indexations, deux requêtes passent le contrôle, et un doublon est créé. L'unicité doit être vérifiée dans la base transactionnelle.

**Limites.** La cohérence à terme ne se prête pas à tous les écrans. Un tableau de pilotage qui affiche des chiffres décalés doit le dire explicitement, avec l'heure de la dernière mise à jour, pour ne pas induire de décision erronée.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | Le théorème CAP et la nature des systèmes distribués l'expliquent |
| [7.4 Architecture orientée événements](#74-architecture-orientée-événements) | L'architecture orientée événements la rend inévitable |
| [7.10 CQRS](#710-cqrs) | CQRS repose sur des modèles de lecture à terme |
| [7.11 Saga](#711-saga) | La saga assure la cohérence métier malgré l'absence de transaction globale |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le contrôle de version aide à ordonner les mises à jour |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'interface doit expliquer les retards de mise à jour |

### 5. Application pratique

**Situation initiale.** Les utilisateurs se plaignent que les aéronefs qu'ils créent « n'apparaissent pas » dans la liste, alors qu'ils figurent dans leur fiche.

**Problème.** La liste lit un index de recherche mis à jour par événements, avec un retard de quelques secondes qui monte à une minute aux heures de pointe.

**Application du concept.** Retour immédiat de la ressource créée, jeton de version pour la liste, et surveillance du retard.

**Déroulé.**

1. La réponse de création renvoie l'aéronef et son numéro de version.
2. L'interface ajoute localement l'aéronef à la liste affichée.
3. À l'actualisation, elle demande à l'index « au moins la version 1 de cet aéronef » ; si l'index est en retard, elle attend brièvement ou signale une mise à jour en cours.
4. Une alerte se déclenche si le retard d'indexation dépasse 10 secondes pendant plus de 5 minutes.

**Résultat.** L'utilisateur voit immédiatement ce qu'il a créé, et le retard est surveillé et borné.

**Limites.** Cette solution ne concerne que les données que l'utilisateur vient d'écrire. Les autres utilisateurs voient toujours le retard normal.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que promet la cohérence à terme ?
2. **Compréhension.** Citez trois composants d'une plateforme sujets à la cohérence à terme.
3. **Compréhension.** Qu'est-ce que la lecture de sa propre écriture ?
4. **Pourquoi.** Pourquoi faut-il un mécanisme de réconciliation ?
5. **Raisonnement pratique.** Peut-on vérifier l'unicité d'une immatriculation à l'aide de l'index de recherche ?

#### Réponses

1. Qu'en l'absence de nouvelles modifications, toutes les copies convergent vers la même valeur, après un délai fini.
2. Par exemple : index de recherche, tableaux de bord et agrégats, réplicas de lecture, caches, systèmes tiers synchronisés.
3. La garantie qu'un utilisateur voit les modifications qu'il vient lui-même d'effectuer, même si les copies dérivées ne sont pas encore à jour.
4. Parce qu'un événement ou une mise à jour peut être perdu : sans rattrapage, la copie diverge durablement de la source.
5. Non : l'index a du retard, donc deux requêtes simultanées peuvent passer le contrôle. L'unicité se vérifie dans la base transactionnelle.

## 7.9 Event sourcing

### 1. Comprendre simplement

L'**event sourcing** (« sourcing d'événements ») consiste à ne pas stocker l'état courant d'une ressource, mais **la suite complète des événements** qui l'ont fait évoluer. L'état courant n'est pas enregistré : il est **recalculé** en rejouant les événements depuis le début.

**Pourquoi cela existe.** Une base classique ne conserve que le dernier état : on écrase l'ancien. Pour savoir pourquoi et quand une valeur a changé, il faut ajouter une table d'historique, qui peut diverger de l'état réel. Avec le sourcing d'événements, l'historique **est** la donnée : rien ne peut changer sans laisser de trace.

**Problème résolu.** Obtenir un historique complet, fidèle et exploitable, la capacité de reconstituer l'état à n'importe quel instant, et de reconstruire des vues dérivées.

**Modèle mental.** Le grand livre d'une comptabilité. On n'y écrit pas « le solde est 4 200 € » : on y enregistre les écritures, et le solde est leur somme. On n'efface jamais une écriture : pour corriger, on en ajoute une autre.

**Où l'analogie s'arrête.** Un grand livre est simple : des montants s'additionnent. Dans une plateforme, « rejouer » une suite d'événements demande des fonctions d'évolution précises, et des événements dont le sens doit rester stable pendant des années.

**Exemple.** Le flux d'un aéronef : `AircraftRegistered`, `InspectionScheduled`, `AircraftGrounded`, `InspectionCompleted`, `AircraftReleased`. Son état courant (actif, prochaine inspection) se déduit de ces cinq événements.

**Les composants.**

1. un **magasin d'événements** (*event store*) en ajout seul ;
2. des **flux** par entité ;
3. des **fonctions d'évolution** qui construisent l'état ;
4. des **projections** pour la lecture ;
5. des **instantanés** pour accélérer.

**Objectif d'apprentissage :** vous pouvez décrire comment l'état se reconstruit à partir des événements, et dire dans quels cas le sourcing d'événements se justifie.

### 2. Connaissances essentielles

#### Définition

Le **sourcing d'événements** est un patron de persistance dans lequel tous les changements d'état d'une entité sont enregistrés comme une suite ordonnée et immuable d'événements, l'état courant étant obtenu en appliquant ces événements dans l'ordre.

#### Idées fondamentales

1. **Les événements sont la source de vérité.** L'état est dérivé.
2. **Le magasin est en ajout seul.** On n'efface ni ne modifie un événement.
3. **L'état se reconstruit par pliage.** Chaque événement transforme l'état précédent.
4. **Une correction est un nouvel événement.** On ne réécrit pas l'histoire.
5. **Les vues de lecture sont des projections.** Elles se reconstruisent à volonté.
6. **Les événements ont une vie longue.** Leur forme et leur sens doivent évoluer avec soin.

#### Vocabulaire essentiel

- **Flux d'événements** (*event stream*) : suite d'événements d'une même entité.
- **Magasin d'événements** (*event store*) : stockage des flux, en ajout seul.
- **Pliage** (*fold*, *replay*) : calcul de l'état en appliquant les événements dans l'ordre.
- **Instantané** (*snapshot*) : état sauvegardé à une version donnée, pour éviter de tout rejouer.
- **Projection** (*projection*) : vue dérivée construite à partir des événements.
- **Mise à niveau d'événement** (*upcasting*) : transformation d'un ancien format d'événement en format actuel.
- **Événement compensatoire** : événement qui annule le sens d'un précédent.

#### Relations de cause à effet

- Les événements sont conservés, et non l'état. On peut reconstituer l'état à n'importe quelle date, et reconstruire n'importe quelle vue.
- Un événement a été mal conçu. Il ne peut pas être corrigé : il faut le mettre à niveau à la lecture ou ajouter un événement correctif.
- Un flux devient très long. La reconstruction devient lente : on utilise des instantanés.

#### Idées reçues

- **« Le sourcing d'événements, c'est l'architecture événementielle. »** Non. L'architecture événementielle fait communiquer par des événements ; le sourcing d'événements en fait la **source de vérité** du stockage. On peut avoir l'une sans l'autre.
- **« C'est un journal d'audit amélioré. »** Il en tient lieu, mais c'est un choix de persistance structurant, avec des conséquences sur tout le modèle.
- **« On y gagne en simplicité. »** Non. L'historique est gratuit, mais le coût de conception, de versionnement et de lecture est réel.

#### Principe clé

L'historique des faits est la donnée ; l'état n'est qu'un résumé que l'on peut toujours recalculer.

#### Si vous ne retenez que trois choses

1. On stocke des événements immuables ; l'état courant s'en déduit par pliage.
2. On corrige en ajoutant des événements, jamais en les modifiant.
3. Il se justifie quand l'historique, l'audit ou le voyage dans le temps sont centraux.

### 3. Explication technique détaillée

#### Un flux et l'état qui en découle

| Version | Événement | Données |
|---|---|---|
| 1 | `AircraftRegistered` | immatriculation F-ABCD, modèle A320 |
| 2 | `InspectionScheduled` | échéance 2026-11-30 |
| 3 | `AircraftGrounded` | motif « inspection annuelle » |
| 4 | `InspectionCompleted` | prochaine échéance 2027-11-30 |
| 5 | `AircraftReleased` | — |

**Pliage.** L'état s'obtient par une fonction $f$ appliquée événement par événement :

$$s_n = f(s_{n-1}, e_n), \qquad s_0 = \text{état vide}$$

où $s_n$ est l'état après le $n$-ième événement et $e_n$ le $n$-ième événement.

```typescript
function evolve(state: AircraftState, event: AircraftEvent): AircraftState {
  switch (event.type) {
    case "AircraftRegistered":
      return { ...state, registration: event.data.registration, status: "active" };
    case "AircraftGrounded":
      return { ...state, status: "in_inspection" };
    case "InspectionCompleted":
      return { ...state, nextInspectionDate: event.data.nextInspectionDate };
    case "AircraftReleased":
      return { ...state, status: "active" };
    default:
      return state;
  }
}

const state = events.reduce(evolve, emptyState);
```

#### Le magasin d'événements

```sql
CREATE TABLE event_store (
  tenant_id   uuid        NOT NULL,
  stream_id   uuid        NOT NULL,
  version     integer     NOT NULL,
  type        text        NOT NULL,
  data        jsonb       NOT NULL,
  metadata    jsonb       NOT NULL,       -- auteur, corrélation, causalité
  recorded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, stream_id, version)
);
```

**Contrôle de concurrence.** La clé primaire `(tenant_id, stream_id, version)` rend l'écriture optimiste : deux écritures concurrentes de la version 6 d'un même flux ne peuvent pas réussir toutes les deux (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

#### Les instantanés

Pour un flux de 10 000 événements, rejouer à chaque lecture est lent. On enregistre un instantané tous les $k$ événements (par exemple 100) : l'état se reconstruit en lisant le dernier instantané puis les événements suivants.

#### Voyager dans le temps

```text
État au 15 mars = pliage des événements dont recorded_at <= 15 mars
```

Cette propriété répond à des questions de conformité (« quel était l'état de l'aéronef le jour de l'accident ? ») sans table d'historique séparée.

#### Les corrections

| Besoin | Mauvaise méthode | Bonne méthode |
|---|---|---|
| Saisie erronée | Modifier l'événement | Ajouter `RegistrationCorrected` |
| Annuler une action | Supprimer l'événement | Ajouter un événement compensatoire |
| Changer le format d'un événement | Réécrire le magasin | Mise à niveau à la lecture (*upcasting*) |

#### La suppression de données personnelles

L'immuabilité entre en tension avec le droit à l'effacement. Deux pratiques : ne pas mettre de données personnelles dans les événements (références vers un magasin modifiable) ; ou chiffrer ces données avec une clé propre à la personne, dont la destruction rend les événements illisibles (effacement cryptographique, voir [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)).

#### Comparaison avec les alternatives

| Approche | Historique | État courant | Complexité |
|---|---|---|---|
| Table d'état classique | Perdu (écrasé) | Direct | Faible |
| Table + historique d'audit | Séparé, peut diverger | Direct | Moyenne |
| Tables temporelles (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) | Intégré, géré par la base | Direct | Moyenne |
| Sourcing d'événements | La donnée elle-même | Calculé ou projeté | Élevée |

**Contre-exemple.** Des événements de type `AircraftUpdated` qui contiennent l'état complet. Cela reproduit le modèle classique : on n'a plus l'intention (immobilisation, correction) ni l'intérêt du sourcing.

**Limites.** Le sourcing d'événements est un patron puissant mais exigeant. Il convient à des zones du système où l'historique est central (réglementaire, financier), pas à toute la plateforme.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action) | Il fait des événements la source de vérité |
| [7.10 CQRS](#710-cqrs) | Il est souvent associé à CQRS pour les lectures |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Le versionnement d'entité en est une alternative plus légère |
| [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence) | Instantanés et différences existent aussi dans d'autres approches |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La modélisation temporelle propose des voies voisines |
| [14.6 Événement de domaine](14-domain-driven-design.md#146-événement-de-domaine) | Les événements de domaine sont les événements du flux |

### 5. Application pratique

**Situation initiale.** Après un incident, l'autorité demande à la compagnie de prouver, minute par minute, les décisions prises sur un aéronef pendant les trois dernières semaines.

**Problème.** L'état courant ne dit pas ce qui a précédé. L'historique d'audit est partiel : certains changements passent par des imports qui ne le renseignent pas.

**Application du concept.** Pour le domaine « navigabilité », la plateforme stocke les faits comme événements immuables.

**Déroulé.**

1. Chaque décision (immobilisation, dérogation, remise en service) est enregistrée comme événement avec auteur et motif.
2. L'autorité demande l'état de l'aéronef au 14 octobre à 10 h 05.
3. La plateforme rejoue le flux jusqu'à cet instant et produit l'état et la liste des décisions.
4. Une projection sépare la chronologie par acteur pour l'enquête.

**Résultat.** La compagnie répond précisément, sans reconstitution manuelle, avec des faits que personne n'a pu modifier.

**Limites.** Un événement mal formulé il y a un an doit être lu avec sa version d'origine : un registre de versions d'événements est nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que stocke-t-on en sourcing d'événements, et comment obtient-on l'état courant ?
2. **Compréhension.** Comment corrige-t-on une erreur ?
3. **Compréhension.** À quoi servent les instantanés ?
4. **Pourquoi.** Pourquoi le sourcing d'événements n'est-il pas synonyme d'architecture événementielle ?
5. **Raisonnement pratique.** Une donnée personnelle figure dans des événements immuables, et la personne demande son effacement. Comment procéder ?

#### Réponses

1. On stocke la suite des événements ; l'état courant s'obtient en les rejouant dans l'ordre.
2. En ajoutant un événement correctif ou compensatoire, jamais en modifiant l'événement d'origine.
3. À éviter de rejouer tout le flux : l'état se reconstruit à partir du dernier instantané et des événements postérieurs.
4. L'architecture événementielle concerne la communication entre composants ; le sourcing d'événements concerne la persistance, où les événements sont la source de vérité.
5. Détruire la clé de chiffrement propre à cette personne (effacement cryptographique), ou, si la donnée n'était qu'une référence, supprimer la donnée dans le magasin modifiable vers lequel elle pointait.

## 7.10 CQRS

### 1. Comprendre simplement

Le **CQRS** (*Command Query Responsibility Segregation*, « séparation des responsabilités entre commandes et requêtes ») consiste à utiliser **deux modèles distincts** : l'un pour **modifier** les données (les commandes), l'autre pour les **lire** (les requêtes). Chacun est conçu pour sa tâche.

**Pourquoi cela existe.** Écrire et lire n'ont pas les mêmes besoins. L'écriture exige des règles strictes, de la cohérence, des invariants. La lecture exige de la rapidité, des vues adaptées à chaque écran, parfois des agrégats. Un même modèle qui doit faire les deux devient un compromis qui les sert mal.

**Problème résolu.** Optimiser séparément les écritures et les lectures, les faire évoluer indépendamment et les mettre à l'échelle séparément.

**Modèle mental.** Une cuisine et un tableau d'affichage. En cuisine, on suit des règles précises pour préparer les plats (écriture). Sur le tableau d'affichage, on présente les plats du jour de manière lisible (lecture). On ne lit pas la carte dans les casseroles.

**Où l'analogie s'arrête.** Le tableau d'affichage est mis à jour par une personne. Un modèle de lecture est mis à jour automatiquement, avec un retard : il faut en gérer les conséquences (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)).

**Exemple.** L'écriture d'un aéronef passe par un modèle normalisé avec ses règles. L'écran « Vue de la flotte » lit une table dénormalisée qui contient déjà, pour chaque aéronef, la base, le nombre de tâches ouvertes et la prochaine échéance.

**Les composants.**

1. un **modèle d'écriture** (commandes) ;
2. un ou plusieurs **modèles de lecture** (requêtes) ;
3. un **mécanisme de propagation** de l'un vers l'autre.

**Objectif d'apprentissage :** vous pouvez décrire la séparation entre commandes et requêtes, citer ses niveaux de mise en œuvre et dire quand l'éviter.

### 2. Connaissances essentielles

#### Définition

Le **CQRS** est un patron d'architecture qui sépare le modèle utilisé pour traiter les **commandes** (opérations qui modifient l'état) du modèle utilisé pour traiter les **requêtes** (opérations qui lisent sans modifier), afin de les concevoir, de les optimiser et de les déployer indépendamment.

#### Idées fondamentales

1. **Une commande modifie, une requête lit.** Jamais les deux à la fois.
2. **Les modèles peuvent différer.** Structure normalisée à l'écriture, dénormalisée à la lecture.
3. **La séparation a plusieurs niveaux.** Des modèles distincts dans le même code, des tables distinctes, ou des bases distinctes.
4. **Le modèle de lecture est dérivé.** Il est alimenté par les changements du modèle d'écriture.
5. **La cohérence entre les deux est à terme.** Avec un retard à prévoir.
6. **Il n'est pas toujours justifié.** Pour des besoins simples, un modèle unique suffit.

#### Vocabulaire essentiel

- **Commande** (*command*) : demande de modification, validée par le modèle d'écriture.
- **Requête** (*query*) : demande de lecture, sans effet de bord.
- **Modèle d'écriture** (*write model*, *command side*) : structure qui garantit les invariants.
- **Modèle de lecture** (*read model*, *query side*) : structure optimisée pour la consultation.
- **Projection** : mise à jour d'un modèle de lecture à partir des changements.
- **CQS** (*Command–Query Separation*) : principe d'origine, énoncé par Bertrand Meyer pour les méthodes d'un objet.

#### Relations de cause à effet

- Les lectures utilisent le modèle d'écriture, normalisé. Les écrans ont besoin de nombreuses jointures, et la lecture ralentit.
- Les modèles de lecture sont alimentés de façon asynchrone. Une lecture juste après une écriture peut être en retard.
- On sépare physiquement sans nécessité. L'équipe gère deux bases et leur synchronisation pour un besoin qui n'en demandait pas.

#### Idées reçues

- **« CQRS exige le sourcing d'événements. »** Non. Ce sont deux patrons indépendants, qui se combinent souvent.
- **« CQRS exige deux bases de données. »** Non. Le plus simple est de ne séparer que les modèles, dans la même base.
- **« CQRS est un style de microservices. »** Non. Il s'applique à l'intérieur d'un service comme entre services.

#### Principe clé

Séparez les modèles quand les besoins d'écriture et de lecture divergent vraiment ; sinon, gardez un modèle unique.

#### Si vous ne retenez que trois choses

1. CQRS sépare le modèle qui modifie du modèle qui lit.
2. Le modèle de lecture est dérivé, avec un retard à gérer.
3. Il apporte de la complexité : il se justifie par une asymétrie réelle entre lecture et écriture.

### 3. Explication technique détaillée

#### L'architecture

```text
Client
  │ commande                         │ requête
  ▼                                  ▼
Gestionnaire de commandes       Service de requêtes
  │ valide, applique les règles       │ lit directement
  ▼                                   ▼
Modèle d'écriture ──événements──► Modèle de lecture (vues dénormalisées)
(tables normalisées, invariants)     (par écran : flotte, tâches, tableau de bord)
```

#### Les niveaux de séparation

| Niveau | Description | Coût | Quand |
|---|---|---|---|
| 1. Séparation de code | Objets de commande et objets de lecture distincts, même base | Faible | Point de départ |
| 2. Tables de lecture dédiées | Tables dénormalisées alimentées par le même processus | Moyen | Lectures lourdes |
| 3. Stockage de lecture séparé | Moteur de recherche, base orientée documents | Élevé | Besoins très différents |
| 4. Avec sourcing d'événements | Écriture en événements, projections en lecture | Très élevé | Historique central |

#### Un exemple de modèle de lecture

```sql
-- Table de lecture dénormalisée, une ligne par aéronef
CREATE TABLE fleet_overview (
  tenant_id            uuid NOT NULL,
  aircraft_id          uuid NOT NULL,
  registration         text NOT NULL,
  model                text NOT NULL,
  base_name            text,
  status               text NOT NULL,
  open_tasks           integer NOT NULL DEFAULT 0,
  next_inspection_date date,
  updated_at           timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, aircraft_id)
);
```

**Comment elle est alimentée.** Un abonné aux événements `aircraft.*` et `task.*` met à jour la ligne correspondante : changement de statut, ouverture ou clôture d'une tâche, changement de base. Les lectures de l'écran « Flotte » sont des lectures simples sur cette table.

#### Un gestionnaire de commande

```typescript
async function handleGroundAircraft(cmd: GroundAircraft, ctx: RequestContext) {
  await authz.require(ctx.principal, "aircraft:ground", { id: cmd.aircraftId });
  return db.transaction(async (tx) => {
    const aircraft = await repo.load(tx, ctx.tenantId, cmd.aircraftId);
    aircraft.ground(cmd.reason);                       // applique les invariants
    await repo.save(tx, aircraft);                      // modèle d'écriture
    await outbox.add(tx, event("aircraft.grounded", aircraft)); // alimente les projections
  });
}
```

#### Le retard entre écriture et lecture

Comme le modèle de lecture est alimenté de façon asynchrone, une lecture immédiate après une commande peut ne pas refléter celle-ci. On y répond :

- en **renvoyant** la ressource modifiée dans la réponse à la commande ;
- par un **jeton de version** que la requête exige ;
- par un indicateur de **mise à jour en cours** dans l'interface (voir [7.8 Cohérence à terme](#78-cohérence-à-terme)).

#### Les droits dans le modèle de lecture

Les droits au niveau de la ligne et du champ (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) doivent s'appliquer aux modèles de lecture comme au modèle d'écriture. Un modèle de lecture dénormalisé qui agrège des données de plusieurs sources doit porter les informations nécessaires au filtrage (tenant, base, niveau de confidentialité).

#### La reconstruction

Un modèle de lecture se reconstruit à volonté : on vide la table et on rejoue les événements (ou on relit la source). C'est un atout (corriger un défaut, ajouter une colonne) et une contrainte (le temps de reconstruction doit rester raisonnable).

**Contre-exemple.** Introduire CQRS avec deux bases pour une plateforme de dix tables et trois écrans simples. La complexité de synchronisation, de retard et de diagnostic dépasse largement le gain en lecture.

**Limites.** CQRS fait peser sur l'interface et sur les tests la prise en compte d'un retard entre écriture et lecture. Les équipes qui ne l'ont pas prévu rencontrent des écrans « qui ne montrent pas ce que je viens de faire ».

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.9 Event sourcing](#79-event-sourcing) | Le sourcing d'événements fournit naturellement des projections |
| [7.8 Cohérence à terme](#78-cohérence-à-terme) | Le modèle de lecture est cohérent à terme |
| [7.1 Événement, déclencheur et action](#71-événement-déclencheur-et-action) | Les événements alimentent les projections |
| [2.13 Normalisation](02-donnees-ressources.md#213-normalisation) | La dénormalisation des modèles de lecture est un compromis assumé |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | Les vues configurables des écrans s'appuient sur des modèles de lecture |
| [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat) | Le modèle d'écriture respecte les frontières d'agrégat |

### 5. Application pratique

**Situation initiale.** L'écran « Vue de la flotte » affiche, pour chaque aéronef, la base, le nombre de tâches ouvertes et la prochaine inspection. Il met 6 secondes à charger pour la plus grande compagnie, à cause de jointures sur cinq tables.

**Problème.** La même structure normalisée sert l'écriture (avec ses invariants) et les écrans de consultation.

**Application du concept.** Une table de lecture dénormalisée, alimentée par les événements.

**Déroulé.**

1. L'équipe crée la table `fleet_overview`.
2. Un abonné la met à jour à chaque événement d'aéronef ou de tâche.
3. L'écran lit directement cette table, avec une pagination par curseur.
4. Une reconstruction initiale remplit la table à partir de l'état existant.
5. Un indicateur affiche l'heure de dernière mise à jour.

**Résultat.** L'écran se charge en moins de 200 ms, sans toucher au modèle d'écriture.

**Limites.** Les écritures sont plus lourdes (événements, projections), et le modèle de lecture peut avoir quelques secondes de retard.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que sépare CQRS ?
2. **Compréhension.** Citez deux niveaux de mise en œuvre de CQRS.
3. **Compréhension.** Quel est le principal inconvénient du modèle de lecture dérivé ?
4. **Pourquoi.** Pourquoi CQRS n'impose-t-il pas deux bases de données ?
5. **Raisonnement pratique.** Pour quel type de plateforme CQRS n'est-il pas justifié ?

#### Réponses

1. Le modèle qui traite les commandes (écriture) du modèle qui traite les requêtes (lecture).
2. Par exemple : séparation de code dans la même base, tables de lecture dédiées, stockage de lecture séparé.
3. Il est cohérent à terme : une lecture juste après une écriture peut ne pas refléter le changement.
4. Parce que la séparation porte sur les modèles et les responsabilités ; elle peut se faire dans la même base, avec des tables ou des objets distincts.
5. Pour une plateforme simple, avec peu de volumétrie et des besoins de lecture proches de ceux d'écriture : un modèle unique est plus simple et suffisant.

## 7.11 Saga

### 1. Comprendre simplement

Une **saga** est une façon de mener à bien une **opération métier qui traverse plusieurs services**, sans transaction globale. Elle la décompose en une suite d'étapes, chacune étant une transaction locale. Si une étape échoue, la saga exécute des **actions compensatoires** qui défont, sur le plan métier, les étapes déjà réalisées.

**Pourquoi cela existe.** Quand les données sont réparties entre plusieurs services, une transaction unique ne peut pas couvrir tout (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)). Mais le métier exige que l'opération réussisse en entier, ou qu'elle soit annulée proprement.

**Problème résolu.** Obtenir une cohérence métier pour une opération répartie, sans verrouiller plusieurs systèmes.

**Modèle mental.** L'organisation d'un voyage : on réserve le vol, puis l'hôtel, puis la voiture. Si la voiture n'est pas disponible, on annule l'hôtel puis le vol. Chaque annulation est une action compensatoire.

**Où l'analogie s'arrête.** Annuler une réservation n'est pas toujours un retour exact à l'état initial : des frais peuvent s'appliquer, un courriel est déjà parti. Une compensation est un **contre-effet métier**, pas un retour arrière technique.

**Exemple.** Le transfert d'un aéronef vendu entre deux tenants (voir [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer)) : exporter dans le tenant vendeur, importer dans le tenant acheteur, archiver chez le vendeur. Si l'import échoue, on annule l'export.

**Les composants.**

1. une **séquence d'étapes**, chacune transactionnelle localement ;
2. une **compensation** pour chaque étape ;
3. un **coordinateur** (ou une chorégraphie d'événements) ;
4. un **état persistant** de la saga.

**Objectif d'apprentissage :** vous pouvez décrire une saga avec ses compensations, et citer deux anomalies d'isolation qu'elle entraîne.

### 2. Connaissances essentielles

#### Définition

Une **saga** est une séquence de transactions locales, chacune mettant à jour un seul service, telle que, si l'une échoue, des transactions compensatoires sont exécutées pour annuler l'effet des précédentes. Le concept a été proposé par Hector Garcia-Molina et Kenneth Salem en 1987 pour les transactions de longue durée.

#### Idées fondamentales

1. **Pas de transaction globale.** Chaque étape est locale et validée tout de suite.
2. **Chaque étape a une compensation.** Un contre-effet métier.
3. **L'état de la saga est persistant.** Elle survit aux redémarrages.
4. **Deux styles de coordination.** Orchestration (un chef) ou chorégraphie (événements).
5. **Étapes et compensations sont idempotentes.** Elles peuvent être rejouées.
6. **L'isolation est absente.** Des états intermédiaires sont visibles : il faut le gérer.

#### Vocabulaire essentiel

- **Transaction locale** (*local transaction*) : transaction dans un seul service.
- **Compensation** (*compensating action*) : action qui annule sur le plan métier l'effet d'une étape.
- **Orchestrateur** (*saga orchestrator*) : composant qui pilote les étapes et les compensations.
- **Chorégraphie** (*choreography*) : chaque service réagit aux événements des autres.
- **Étape pivot** (*pivot transaction*) : étape après laquelle on ne revient plus en arrière.
- **Étapes reprenables** (*retriable transactions*) : étapes suivant le pivot, qui doivent finir par réussir.
- **Verrou sémantique** (*semantic lock*) : état « en attente » qui signale qu'une ressource est engagée dans une saga.

#### Relations de cause à effet

- Une étape échoue après trois réussites. Sans compensation, l'opération est à moitié faite et le système est incohérent sur le plan métier.
- Une compensation échoue. La saga reste bloquée : il faut des reprises, puis une intervention humaine.
- Les états intermédiaires sont visibles. Un autre utilisateur lit une ressource « à moitié transférée » et agit dessus.

#### Idées reçues

- **« Une saga est une transaction répartie. »** Non. Elle n'offre pas l'isolation d'une transaction : on voit des états intermédiaires.
- **« Une compensation, c'est un retour arrière. »** Non. C'est une nouvelle action métier, qui peut avoir ses propres effets (frais, notifications).
- **« Toute opération se compense. »** Non. Un courriel envoyé ou un paiement encaissé ne se retirent pas : il faut placer les étapes irréversibles en dernier.

#### Principe clé

Une saga assure la cohérence métier par des compensations, pas par l'isolation : elle l'accepte et organise les états intermédiaires.

#### Si vous ne retenez que trois choses

1. Une saga enchaîne des transactions locales avec, pour chacune, une compensation.
2. Orchestration et chorégraphie en sont les deux styles de coordination.
3. L'absence d'isolation impose d'exposer des états intermédiaires explicites.

### 3. Explication technique détaillée

#### Un exemple : le transfert d'un aéronef entre tenants

| Étape | Action (service) | Compensation |
|---|---|---|
| 1 | Réserver l'aéronef : état « transfert en cours » (vendeur) | Remettre l'état précédent |
| 2 | Exporter les données autorisées (vendeur) | Supprimer l'export |
| 3 | Créer l'aéronef et l'historique transmis (acheteur) | Archiver la copie chez l'acheteur |
| 4 | **Pivot** : marquer le transfert accepté par l'acheteur | — (point de non-retour) |
| 5 | Archiver l'aéronef chez le vendeur | Reprise jusqu'à réussite |
| 6 | Notifier les deux parties | Reprise jusqu'à réussite |

**Lecture.** Avant le pivot, un échec déclenche les compensations en ordre inverse. Après le pivot, les étapes doivent aboutir : on les reprend jusqu'à réussite, avec intervention humaine en dernier recours.

#### L'orchestration

```text
Orchestrateur de saga (état persistant)
   │ 1. commande : réserver ─────────► Service vendeur
   │ ◄──── événement : réservé
   │ 2. commande : exporter ─────────► Service vendeur
   │ ◄──── événement : exporté
   │ 3. commande : créer ────────────► Service acheteur
   │ ◄──── événement : échec !
   │ 4. compensation : supprimer l'export ──► Service vendeur
   │ 5. compensation : remettre l'état ─────► Service vendeur
   ▼
 saga : « annulée », avec le motif
```

```json
{
  "saga_id": "saga_41",
  "type": "aircraft_transfer",
  "state": "compensating",
  "step": 3,
  "history": [
    { "step": 1, "status": "done" },
    { "step": 2, "status": "done" },
    { "step": 3, "status": "failed", "error": "target_type_missing" },
    { "step": 2, "status": "compensated" }
  ]
}
```

#### Orchestration ou chorégraphie

| Critère | Orchestration | Chorégraphie |
|---|---|---|
| Visibilité | Centralisée, lisible | Répartie, difficile à reconstituer |
| Couplage | Vers l'orchestrateur | Entre services, par événements |
| Ajout d'une étape | Modifier l'orchestrateur | Ajouter un abonné |
| Gestion des échecs | Centralisée | Chaque service doit gérer |
| Adaptée à | Séquences longues, nombreuses compensations | Peu d'étapes, services autonomes |

#### L'absence d'isolation

| Anomalie | Description | Contre-mesure |
|---|---|---|
| Lecture sale | Un autre voit un état intermédiaire qui sera annulé | État « en cours » explicite, verrou sémantique |
| Mise à jour perdue | Une action externe écrase un changement d'une saga | Contrôle de version, état verrouillé |
| Lecture non répétable | Les valeurs changent entre deux étapes | Étapes qui relisent, ou valeurs figées dans la saga |

**Verrou sémantique.** On marque la ressource « transfert en cours » : les opérations incompatibles sont refusées tant que la saga n'est pas terminée.

#### Saga et autres mécanismes

| Mécanisme | Isolation | Couplage | Usage |
|---|---|---|---|
| Transaction locale | Forte | Un seul service | Cas général |
| Validation en deux phases (2PC) | Forte | Fort, bloquant | Rare en SaaS réparti |
| Saga | Faible, compensée | Faible | Opérations métier longues |
| Workflow durable (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)) | — | — | Sert souvent à orchestrer une saga |

#### Les règles de conception

- **Rendre chaque étape et chaque compensation idempotente** (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- **Placer les étapes difficiles à compenser tard**, avant le pivot.
- **Persister l'état** de la saga à chaque étape.
- **Fixer des délais** et des reprises (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
- **Prévoir l'intervention humaine** pour les compensations qui échouent.
- **Journaliser** chaque étape (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

**Contre-exemple.** Une saga dont l'étape 2 envoie un courriel au client avant que l'étape 3 ait réussi. Si l'étape 3 échoue, le client a reçu une confirmation d'une opération annulée, et aucune compensation ne peut « reprendre » le courriel.

**Limites.** Les sagas sont difficiles à tester : il faut exercer toutes les combinaisons d'échecs et de compensations. Elles ne s'imposent que pour des opérations qui traversent réellement plusieurs frontières de service.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | La saga remplace la transaction là où celle-ci ne s'applique pas |
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | Elle répond aux contraintes des systèmes distribués |
| [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service) | Elle traverse les frontières de service |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Un workflow durable orchestre souvent la saga |
| [7.4 Architecture orientée événements](#74-architecture-orientée-événements) | La chorégraphie en est le style événementiel |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Le provisionnement d'un tenant est une saga |

### 5. Application pratique

**Situation initiale.** Le provisionnement d'un tenant crée des éléments dans quatre services : identité, ressources, facturation, notifications. L'étape de facturation échoue après la création de l'identité et des ressources.

**Problème.** Le tenant est à moitié créé : il existe pour l'identité et les ressources, mais pas pour la facturation.

**Application du concept.** Le provisionnement est modélisé comme une saga orchestrée avec compensations.

**Déroulé.**

1. L'orchestrateur exécute : créer l'identité, créer les ressources, créer le compte de facturation.
2. La facturation échoue après trois reprises (service tiers indisponible).
3. L'orchestrateur lance les compensations en ordre inverse : supprimer les ressources, désactiver l'identité.
4. Le tenant est marqué « échec de provisionnement », avec le motif.
5. Le commercial est alerté ; la demande peut être relancée sans doublons grâce aux clés d'idempotence.

**Résultat.** Aucun tenant à moitié créé, et un état clair pour l'équipe commerciale.

**Limites.** Pendant l'exécution, des états intermédiaires existent : l'interface d'administration affiche « en cours de provisionnement » et bloque les actions sur ce tenant.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une compensation ?
2. **Compréhension.** Quelle différence y a-t-il entre orchestration et chorégraphie ?
3. **Compréhension.** Qu'est-ce que l'étape pivot ?
4. **Pourquoi.** Pourquoi une saga n'offre-t-elle pas l'isolation d'une transaction ?
5. **Raisonnement pratique.** Où placer l'envoi d'un courriel de confirmation dans une saga ?

#### Réponses

1. Une action métier qui annule l'effet d'une étape déjà réalisée, par exemple annuler une réservation.
2. En orchestration, un coordinateur central pilote les étapes ; en chorégraphie, chaque service réagit aux événements des autres.
3. L'étape après laquelle on ne revient plus en arrière : les étapes suivantes doivent aboutir par reprises.
4. Parce que chaque étape est validée immédiatement : d'autres peuvent voir les états intermédiaires avant la fin ou l'annulation de la saga.
5. Après le pivot, en fin de saga, parce qu'un courriel ne se compense pas : il ne doit partir qu'une fois la réussite assurée.
