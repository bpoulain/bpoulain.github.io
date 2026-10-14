# Module 17 — Collaboration, communication et gestion du travail

> **Question directrice.** Comment une personne sait-elle ce qu'elle doit faire et ce qui vient de se passer, sans être submergée, et comment chaque organisation règle-t-elle cela à sa façon ?

## Présentation du module

**Objectif.** Ce module appartient au plan des compléments. Le parcours initial traite la tâche ([6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)), l'approbation et l'escalade ([6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)) et la notification vue de l'interface ([12.10 Notifications](12-produit-ux.md#1210-notifications)). Il ne décrit pas ce qui se trouve **derrière** la cloche et la liste de tâches : le service qui décide qui est prévenu, les canaux et leurs défaillances, la gestion du travail comme fonction de la plateforme, les échanges entre collègues, et la diffusion en temps réel qui garde tout cela à jour. Ce module comble cet écart.

**Prérequis.** Les événements et leur transport ([7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action), [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements), [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)), la tâche et l'escalade ([6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche), [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)), les notifications côté interface ([12.10 Notifications](12-produit-ux.md#1210-notifications)), la délégation ([4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)), la configuration par niveaux ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) et la modélisation temporelle ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

**Ce module et l'étude dédiée.** L'[étude sur l'Activity center et le Notification center](../etudes/activity-center-notification-center.md) répond à trois questions de conception : comment les deux centres s'articulent, comment les mettre en œuvre, comment les organisations et les utilisateurs se les approprient. Le présent module décrit, concept par concept, les mécanismes de plateforme que l'étude suppose connus. L'étude se lit avant ou après ; elle est citée là où elle apporte une vue d'ensemble.

**Un mot, plusieurs sens.** Le mot « tâche » désigne dans le parcours la tâche humaine d'un workflow ([6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)), la ressource métier telle que `maintenance_task` ([15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne)) et la tâche de fond ou *job* ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)). Ce module emploie **élément de travail** pour tout ce qui attend une personne, **tâche de workflow** pour le premier sens et **job** pour le troisième.

**Ordre retenu.** Quatre groupes. Le plan range la collaboration avant la diffusion en temps réel. Ce module inverse les deux, car la présence et l'édition collaborative reposent sur le transport en temps réel.

```text
Notifier      service et résolution ─ abonnements et préférences ─ modèles et localisation
              canaux et statut de livraison ─ courriel : rebonds et authentification
              consentement et désabonnement ─ limitation, résumés et heures calmes
Travailler    élément de travail et boîte de tâches ─ affectation, prise en charge et absence
              échéance, horloge et priorité ─ files, modèles, rappels et charge
Diffuser      temps réel : interrogation, flux serveur, WebSocket ─ compteurs et état de lecture
Collaborer    commentaires, mentions, fils et fil d'activité ─ présence et édition collaborative
```

| Groupe | Question de l'utilisateur |
|---|---|
| Notifier | Comment la bonne personne est-elle prévenue, par le bon canal, sans être inondée ? |
| Travailler | Qu'est-ce que je dois faire, pour quand, et qui d'autre peut s'en charger ? |
| Diffuser | Comment ce que je vois reste-t-il à jour sans que je recharge la page ? |
| Collaborer | Comment travailler à plusieurs sur le même dossier sans se marcher dessus ? |

**Références.** Les textes cités dans ce module (RFC, spécifications du Web, textes réglementaires) ont été confrontés à leur version officielle pendant la rédaction, et les articles de recherche à leur notice bibliographique. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires)
- [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)
- [17.3 Modèles de message et localisation](#173-modèles-de-message-et-localisation)
- [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison)
- [17.5 Rebonds et authentification du courriel](#175-rebonds-et-authentification-du-courriel)
- [17.6 Consentement, désabonnement et nature des messages](#176-consentement-désabonnement-et-nature-des-messages)
- [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes)
- [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)
- [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence)
- [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité)
- [17.11 Files enregistrées, modèles de tâche, rappels personnels et vue de charge](#1711-files-enregistrées-modèles-de-tâche-rappels-personnels-et-vue-de-charge)
- [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)
- [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture)
- [17.14 Commentaires, mentions, fils de discussion et fil d'activité](#1714-commentaires-mentions-fils-de-discussion-et-fil-dactivité)
- [17.15 Présence et édition collaborative](#1715-présence-et-édition-collaborative)

## 17.1 Service de notifications et résolution des destinataires

### 1. Comprendre simplement

Un **service de notifications** (*notification service*) est le composant de la plateforme qui reçoit une **demande de notification** (« tel fait s'est produit, il faut prévenir telles personnes ») et se charge de tout le reste : trouver les personnes concernées, appliquer leurs préférences, rédiger le message, le remettre par les bons canaux et suivre son sort. La **résolution des destinataires** (*recipient resolution*) est l'étape qui transforme une **audience décrite par une fonction** (« les responsables qualité de la base LYS ») en une **liste concrète de personnes**, au moment de l'envoi.

**Pourquoi cela existe.** Sans service commun, chaque module envoie ses propres messages : le workflow un courriel, l'administration un autre, les alertes d'exploitation un troisième. Chacun ignore les préférences des autres, les doublons se multiplient, et personne ne sait ce qui a été envoyé. Sans résolution à l'envoi, les règles citent des personnes nommées : un départ ou une mutation les rend fausses, sans erreur visible.

**Problème résolu.** Faire de « prévenir quelqu'un » une capacité unique, cohérente et mesurable, qui suit les changements d'organisation sans reconfigurer chaque règle.

**Modèle mental.** La salle du courrier d'une grande entreprise. Les services y déposent des plis adressés à des **fonctions** (« le directeur technique », « le responsable qualité de Lyon »). La salle du courrier sait qui occupe la fonction aujourd'hui, qui est en congé, comment chacun préfère être joint, et elle tient un registre des plis partis.

**Où l'analogie s'arrête.** Une salle du courrier ne vérifie pas que le destinataire a le droit de lire le contenu, ne regroupe pas dix plis en un seul et n'adapte pas la langue du message. Le service de notifications fait tout cela, pour des milliers de tenants.

**Exemple.** Un technicien déclare un constat critique sur F-ABCD. Le workflow émet une demande de type `finding_critical`, avec l'audience « responsables qualité de la base de l'aéronef, et gestionnaire de la base ». Le service résout cette audience : quatre personnes sont retenues, dont le suppléant d'une responsable en congé, et le technicien auteur est exclu. Il en tire quatre notifications individuelles, qu'il confie à la suite du traitement (préférences, rendu, canaux).

**Les composants.**

1. une **demande de notification** émise par un producteur (workflow, règle, alerte) ;
2. une **audience** décrite par des sélecteurs (rôle, relation, champ, groupe, liste) ;
3. un **résolveur** qui produit les personnes concernées ;
4. des **filtres** (personne active, droit de voir le sujet, exclusion de l'acteur) ;
5. une **déduplication** entre règles qui se recoupent ;
6. un **enregistrement de la raison** pour chaque destinataire ;
7. un **passage de relais** vers les préférences, le rendu et les canaux.

**Objectif d'apprentissage :** vous pouvez distinguer une demande d'une notification, expliquer comment une audience décrite par une fonction devient une liste de personnes, et citer les filtres à appliquer.

### 2. Connaissances essentielles

#### Définition

- **Service de notifications** : composant de plateforme qui accepte des demandes de notification de tout producteur, et assure de façon uniforme et par tenant la résolution des destinataires, l'application des préférences, le rendu, la remise par les canaux et le suivi.
- **Demande de notification** (*notification request*) : intention d'un producteur de prévenir une audience d'un fait, avec un type, un sujet et des données minimales.
- **Résolution des destinataires** : transformation d'une audience décrite symboliquement en un ensemble de personnes concrètes et distinctes, avec la raison pour laquelle chacune est retenue.

#### Idées fondamentales

1. **Un seul service pour tous les producteurs.** Les préférences, les limites et le suivi s'appliquent partout, car aucun module n'envoie de message de son côté.
2. **Une demande n'est pas une notification.** Une demande produit zéro, une ou plusieurs notifications, une par destinataire.
3. **L'audience se décrit, elle ne se liste pas.** On désigne une fonction, une relation ou un champ, et le service trouve les personnes au moment voulu.
4. **La résolution filtre autant qu'elle élargit.** Elle retire les personnes inactives, celles qui n'ont pas le droit de voir le sujet, et l'auteur de l'action.
5. **Chaque destinataire sait pourquoi il l'est.** La raison est enregistrée avec la notification, ce qui permet d'expliquer et de corriger.
6. **La demande est idempotente.** La livraison des événements est « au moins une fois » : une clé d'idempotence évite d'envoyer deux fois pour le même fait.

#### Vocabulaire essentiel

- **Producteur** (*producer*) : composant qui émet une demande de notification.
- **Audience** (*audience*) : ensemble de personnes visées, décrit par des sélecteurs.
- **Sélecteur** (*selector*) : expression qui désigne des personnes (rôle et périmètre, relation, champ, groupe, liste).
- **Point de contact** (*contact point*) : adresse d'une personne sur un canal (boîte courriel, appareil mobile, identifiant de messagerie).
- **Exclusion de l'acteur** (*actor exclusion*) : retrait de la personne qui a provoqué le fait.
- **Clé d'idempotence** (*idempotency key*) : identifiant stable d'une demande, qui permet d'ignorer ses répétitions.
- **Diffusion en éventail** (*fan-out*) : multiplication d'une demande en autant de notifications que de destinataires. Le même mot désigne, au niveau du transport, la distribution d'un message à de nombreux clients connectés (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)).

#### Relations de cause à effet

- Les règles citent des personnes nommées. Une mutation ou un départ les rend fausses : le message part à la mauvaise personne, ou à personne, sans erreur visible.
- La résolution n'applique aucun filtre de droits. Le message révèle l'existence d'un objet à une personne qui n'a pas le droit de le voir (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- La résolution n'exclut pas l'acteur. La personne qui vient d'agir reçoit un message sur sa propre action, et cesse de lire les suivants.
- Deux règles visent la même personne pour le même fait. Sans déduplication, elle reçoit deux messages.
- Une audience sans plafond (« tous les utilisateurs ») est déclenchée par erreur. Des milliers de messages partent avant que quiconque s'en aperçoive.

#### Idées reçues

- **« Chaque module peut envoyer ses propres courriels. »** Non. Les préférences, les limites, la déduplication et la traçabilité deviennent impossibles à garantir.
- **« On résout les destinataires une fois, à la configuration de la règle. »** Non. Les rôles, les équipes, les congés changent chaque jour : la résolution se fait à l'envoi.
- **« La notification est la même pour tous. »** Non. Le rendu dépend du destinataire : langue, droits, canal.

#### Principe clé

Une demande désigne qui est concerné par une fonction, pas par un nom ; le service résout, filtre, déduplique et trace, une fois, pour toute la plateforme.

#### Si vous ne retenez que trois choses

1. Un service unique reçoit des demandes et produit une notification par destinataire.
2. L'audience est décrite par des fonctions, relations ou champs, et résolue à l'envoi, avec filtre de droits et exclusion de l'acteur.
3. Chaque destinataire est enregistré avec sa raison, et la demande est idempotente.

### 3. Explication technique détaillée

#### Où se situe le service

```text
producteurs : workflow, règles, alertes, API
        │  demande de notification (idempotente)
        ▼
file d'entrée ─► résolution des ─► préférences ─► rendu ─► canaux ─► suivi
                 destinataires     et limites     (17.3)   (17.4)
                 (cette entrée)    (17.2, 17.7)
```

Le service se place **après** l'événement et **avant** les canaux. Il consomme les mêmes événements que les autres composants (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) et applique la règle de notification décrite en [12.10 Notifications](12-produit-ux.md#1210-notifications). Il ignore la logique métier de ses producteurs : il lui suffit d'un type, d'un sujet et d'une audience.

#### Une demande de notification

```json
{
  "request_id": "nrq_01HZX5A3",
  "idempotency_key": "finding.critical:fd_204:v1",
  "tenant_id": "ten_airline_01",
  "type": "finding_critical",
  "subject": { "type": "finding", "id": "fd_204" },
  "audience": {
    "include": [
      { "role": "quality_manager", "scope": "subject.aircraft.base" },
      { "field": "subject.aircraft.base.manager" },
      { "relation": "follower_of", "target": "subject" }
    ],
    "exclude": [ { "actor": true } ]
  },
  "urgency_hint": "high",
  "data": { "severity": "critical", "aircraft": "F-ABCD" },
  "occurred_at": "2026-10-13T10:40:12Z",
  "correlation_id": "req_91ab33"
}
```

**Comment la lire.** Le producteur dit quoi (`type`, `subject`), à qui (`audience`) et avec quelle clé d'idempotence. Il ne dit ni par quel canal, ni dans quelle langue, ni à quelle heure : ce sont les affaires du service et de la configuration du tenant. Le champ `data` reste minimal : il ne contient que ce qui peut apparaître dans un message sans risque (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)).

#### Les sélecteurs d'audience

| Sélecteur | Exemple | S'appuie sur | Remarque |
|---|---|---|---|
| Rôle et périmètre | Responsables qualité de la base LYS | Attributions de rôles (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée)) | Évalué au moment de la résolution |
| Relation | Suiveurs de l'aéronef, responsable de l'auteur | Relations (voir [4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac)) et abonnements (voir [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)) | La relation peut être indirecte |
| Champ du sujet | `aircraft.base.manager` | Données du sujet (voir [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)) | La personne suit la donnée |
| Équipe ou groupe | Équipe de planification | Groupes (voir [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation)) | Les membres sont ceux du jour |
| Participants | Auteur, assigné, contributeurs | Historique du sujet | Utile pour les fils de discussion |
| Liste explicite | Trois personnes désignées | Rien | À éviter : fragile |

#### L'algorithme de résolution

1. **Développer** chaque sélecteur en un ensemble de personnes.
2. **Réunir** les inclusions, puis retirer les exclusions.
3. **Retirer** les personnes inactives ou suspendues (voir [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation)).
4. **Appliquer la suppléance** : ajouter ou substituer le suppléant d'une personne absente (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
5. **Filtrer par le droit de lecture** du sujet (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
6. **Exclure l'acteur**, sauf si le type de notification exige de l'informer.
7. **Dédupliquer et plafonner** l'ensemble.
8. **Enregistrer la raison** de chaque destinataire.

```json
{
  "request_id": "nrq_01HZX5A3",
  "recipients": [
    { "user": "u_sophie", "reasons": [ { "type": "role", "code": "role_scope", "params": { "role": "quality_manager", "scope": "LYS" } } ] },
    { "user": "u_hugo",   "reasons": [ { "type": "role", "code": "role_scope", "params": { "role": "quality_manager", "scope": "LYS" } } ] },
    { "user": "u_lea",    "reasons": [ { "type": "field", "code": "base_manager", "params": { "base": "LYS" } } ] },
    { "user": "u_julien", "reasons": [ { "type": "delegation", "code": "on_behalf_of", "params": { "delegator": "u_sophie", "delegation": "dlg_78" } } ] }
  ],
  "excluded": [ { "user": "u_karim", "code": "actor" } ]
}
```

**Exemple chiffré.** Le sélecteur de rôle retourne {Sophie, Hugo}. Le sélecteur de champ retourne {Léa}. Le sélecteur de relation retourne les suiveurs du constat : {Karim, Léa}, car le technicien Karim, auteur du constat, le suit automatiquement (voir [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)). L'union compte quatre personnes : Sophie, Hugo, Léa, Karim. Karim est retiré, car il est l'acteur. Sophie est en congé, et son suppléant Julien est ajouté par la délégation. Le résultat final compte quatre destinataires : Sophie, Hugo, Léa, Julien. Les raisons enregistrées servent plus tard à répondre à la question « pourquoi ai-je reçu ceci ? » (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

**Suppléance : remplacer ou ajouter ?**

| Politique | Effet | Quand |
|---|---|---|
| Ajouter le suppléant | Le titulaire et le suppléant reçoivent la notification | Cas général : le titulaire retrouve l'historique à son retour |
| Remplacer par le suppléant | Seul le suppléant reçoit | Quand le titulaire ne doit pas être dérangé en congé |
| Ignorer | Le titulaire seul reçoit | Quand aucune délégation ne couvre ce type |

#### Résoudre tôt ou tard ?

| Moment | Avantage | Risque |
|---|---|---|
| À l'émission de la demande | Audience figée, traçable, stable pour les rejeux | Les droits et les rôles ont pu changer avant la livraison |
| À la livraison | Rôles et droits à jour | Résultat différent de ce qu'une règle simulée annonçait |
| Les deux (recommandé) | Audience et raisons figées à l'émission ; **droits revérifiés au rendu** | Un peu plus de travail |

On fige donc **qui** est concerné et **pourquoi** au moment du fait, et l'on revérifie **ce qu'il a le droit de voir** au moment où le message est rendu ou remis. Pour une notification différée (résumé périodique, heures calmes), cette revérification est indispensable (voir [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes)).

#### Les garde-fous

- **Plafond d'audience.** Une demande qui dépasse un seuil (par exemple 500 personnes) est suspendue pour revue, ou traitée par un mode de diffusion par lots.
- **Quota de tenant.** Les messages sont comptés par tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)).
- **Frontière de tenant.** Une audience ne traverse jamais la frontière de son tenant (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) et [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
- **Profondeur de boucle.** Un message qui déclenche une action qui produit un événement qui redemande le même message est arrêté par un compteur de profondeur porté par l'identifiant de corrélation.
- **Idempotence.** Une demande portant une clé déjà vue dans la fenêtre de déduplication est ignorée (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Les modes de défaillance

- **Une audience vide.** Aucune personne n'est retenue : le fait n'est communiqué à personne. On l'alerte à l'administrateur du tenant (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)).
- **Une audience démesurée.** Un sélecteur trop large noie la plateforme et les personnes.
- **Des rôles périmés.** Une règle visait un rôle supprimé : elle ne résout plus personne.
- **Une fuite par la liste des destinataires.** Le message affiche la liste complète des personnes prévenues, y compris celles que le lecteur n'a pas le droit de connaître.

**Contre-exemple.** Une règle écrite avec trois adresses courriel en dur. À la mutation de l'un des destinataires, le message continue à partir vers lui. La règle semble fonctionner, aucune alerte ne se déclenche, et le constat critique n'est vu par personne d'autre.

**Limites.** Le service résout bien ce qu'on lui décrit. Il ne sait pas qu'un rôle est mal attribué dans le tenant, ni que la personne désignée est débordée. La qualité de l'organisation reste hors de sa portée.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | Le service met en œuvre la règle, l'urgence et le chemin de livraison décrits côté interface |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) et [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Les événements et le bus alimentent les demandes |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La livraison au moins une fois impose des demandes idempotentes |
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée), [4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac) et [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Rôles, relations et droits déterminent l'audience et les filtres |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | La délégation ajoute ou remplace un destinataire |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Le contexte de tenant est propagé dans chaque demande |
| [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification) | Les abonnements alimentent les sélecteurs de relation ; les préférences s'appliquent après la résolution |
| [17.3 Modèles de message et localisation](#173-modèles-de-message-et-localisation) et [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison) | Le rendu et les canaux prolongent le traitement |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Les éléments de travail émettent des événements que le service transforme en notifications |

### 5. Application pratique

**Situation initiale.** Alpha Air avait trois sources de messages : le workflow des constats, le module de maintenance et les alertes d'exploitation. Un constat critique générait trois courriels distincts pour le responsable qualité, aucun pour son adjoint, et un message pour le technicien qui venait de le créer.

**Problème.** Chaque source avait sa liste de destinataires en dur. Aucun filtre ne s'appliquait, aucune suppléance n'était prévue, et personne ne savait combien de messages partaient réellement.

**Application du concept.** Les trois sources émettent une demande vers le service de notifications. Une seule audience décrit la fonction « responsables qualité de la base de l'aéronef, et gestionnaire de la base », avec exclusion de l'acteur.

**Déroulé.**

1. À 10:40, le constat critique `fd_204` est enregistré. L'événement `finding.critical` est publié.
2. La règle du tenant produit une demande `finding_critical` avec une clé d'idempotence liée au constat.
3. Le service développe les sélecteurs : deux responsables qualité, un gestionnaire de base et les suiveurs du constat.
4. Il retire l'auteur du constat et ajoute le suppléant de la responsable en congé.
5. Il vérifie le droit de lecture de chacun sur le constat, enregistre les raisons, et produit quatre notifications.
6. Il confie les quatre notifications aux préférences, au rendu et aux canaux.

**Résultat.** Une demande, quatre notifications, aucun doublon, aucune notification à l'auteur, et une raison lisible pour chaque destinataire.

**Limites.** Si la base TLS n'a pas de responsable qualité attribué, l'audience est vide pour les constats de cette base. La plateforme peut le détecter et l'alerter ; elle ne peut pas désigner de responsable à la place du tenant.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une demande de notification et une notification ?
2. **Compréhension.** Citez quatre filtres appliqués pendant la résolution des destinataires.
3. **Compréhension.** Pourquoi décrit-on l'audience par des fonctions plutôt que par des personnes ?
4. **Pourquoi.** Pourquoi fige-t-on l'audience à l'émission mais revérifie-t-on les droits au rendu ?
5. **Raisonnement pratique.** Une règle de notification est simulée sur sept jours et annonce 12 destinataires. Après publication, 600 personnes reçoivent le message. Quelles causes envisagez-vous ?

#### Réponses

1. Une demande est l'intention d'un producteur de prévenir une audience d'un fait. Elle produit autant de notifications que de destinataires retenus, une par personne.
2. Par exemple : personne inactive ou suspendue, droit de lecture du sujet, exclusion de l'acteur, déduplication et plafonnement. Ajouter la suppléance fait aussi partie de la résolution.
3. Parce que les personnes changent (arrivées, départs, congés, mutations) plus vite que les règles. Une fonction suit l'organisation, une adresse en dur la fige.
4. Parce que le fait et ses personnes concernées sont établis à un instant précis, et doivent rester traçables. Mais entre l'émission et la remise, un droit a pu être retiré : montrer le contenu à une personne qui n'y a plus droit serait une fuite.
5. Un sélecteur plus large que prévu (un groupe imbriqué, un rôle sans périmètre), une relation transitive qui agrège beaucoup de personnes, un périmètre ignoré à la publication, ou une différence entre les données de simulation et celles de production. Un plafond d'audience aurait suspendu la demande.

## 17.2 Abonnement, suivi et préférences de notification

### 1. Comprendre simplement

Un **abonnement** (*subscription*) dit **sur quoi** une personne veut être informée : un aéronef, une file de travail, un fil de discussion, un type d'événement. Le **suivi** (*follow*, *watch*) est sa forme courante : « je suis cet objet ». Une **préférence de notification** (*notification preference*) dit **comment** et **quand** la personne veut être prévenue : par quel canal, tout de suite ou en résumé, ou pas du tout.

**Pourquoi cela existe.** Sans abonnement, il ne reste que deux mauvais choix : notifier tout le monde de tout (du bruit), ou ne rien notifier (du silence). L'abonnement exprime l'intérêt, la préférence exprime la manière. Sans préférences, chacun subit les choix de l'administrateur, et finit par couper toutes les notifications.

**Problème résolu.** Adapter la vigilance de chaque personne à ce qui la concerne et à sa façon de travailler, sans l'intervention d'un développeur.

**Modèle mental.** L'abonnement à une revue et le choix de sa livraison. S'abonner dit **quoi** recevoir. Choisir de la recevoir au bureau ou à la maison, chaque jour ou chaque semaine, dit **comment**.

**Où l'analogie s'arrête.** Un abonné à une revue choisit tout, librement. Dans une plateforme, certaines notifications sont obligatoires, certains abonnements naissent automatiquement (on suit ce qui vous est assigné), et le tenant fixe un plafond sur les canaux.

**Exemple.** La planificatrice Nadia suit explicitement l'aéronef F-ABCD : elle reçoit ses changements d'état. Le technicien Karim suit automatiquement l'activité qui lui est assignée. Nadia met en sourdine, pour deux semaines, un aéronef en stockage dont les mises à jour ne l'intéressent plus, et règle la catégorie « Information » en résumé quotidien.

**Les composants.**

1. des **abonnements explicites**, créés par la personne ;
2. des **abonnements implicites**, déduits d'un lien avec l'objet (auteur, assigné, mentionné) ;
3. une **sourdine**, qui suspend l'alerte sans supprimer l'abonnement ;
4. une **matrice de préférences** : catégorie, canal, mode de remise ;
5. des **valeurs par défaut** à chaque niveau (plateforme, tenant, équipe) ;
6. des **obligations** que rien ne désactive ;
7. le **calcul de la préférence effective**.

**Objectif d'apprentissage :** vous pouvez distinguer un abonnement d'une préférence, expliquer comment la préférence effective est calculée sous des plafonds, et dire pourquoi les valeurs par défaut comptent autant.

### 2. Connaissances essentielles

#### Définition

- **Abonnement** : déclaration d'intérêt d'une personne pour un sujet (objet, file, fil, requête) ou une famille d'événements, qui fait entrer cette personne dans l'audience des notifications correspondantes.
- **Suivi** : abonnement à un objet précis, **explicite** (la personne l'a demandé) ou **implicite** (déduit d'un lien avec l'objet : auteur, assigné, mentionné).
- **Préférence de notification** : choix d'une personne sur la manière de recevoir une catégorie ou un type de notification (canal, mode de remise, désactivation), dans les limites posées par le tenant et la plateforme.

#### Idées fondamentales

1. **L'abonnement dit quoi, la préférence dit comment.** Les deux se règlent séparément, et ne se confondent pas.
2. **Deux origines d'abonnement.** Explicite (« je suis ») et implicite (« je suis concerné »). Le premier exprime un choix, le second évite un silence involontaire.
3. **La sourdine suspend, elle ne supprime pas.** L'abonnement reste, l'alerte est retenue, et la personne peut revenir en arrière.
4. **La préférence effective est calculée.** Elle résulte d'une cascade de niveaux, sous des plafonds que la personne ne peut pas relever.
5. **Certaines notifications traversent les préférences.** Les obligations, et selon la politique les mentions directes et les escalades, ne se coupent pas.
6. **Les valeurs par défaut font l'essentiel de l'expérience.** La plupart des personnes ne règlent jamais rien : les défauts sont la préférence réelle.

#### Vocabulaire essentiel

- **Abonnement et suivi** (*subscription and follow*) : couple de notions qui désigne ce qui intéresse la personne, par déclaration (explicite) ou par déduction (implicite).
- **Suivi implicite** (*implicit follow*) : abonnement créé automatiquement par une règle (assignation, création, mention).
- **Sourdine** (*mute*) : suspension des alertes pour un sujet, un type ou un fil, éventuellement jusqu'à une date.
- **Report** (*snooze*) : sourdine de courte durée, qui se termine seule.
- **Catégorie** (*category*) : regroupement de types de notification pour le réglage (travail, décisions, information).
- **Mode de remise** (*delivery mode*) : immédiat, en résumé périodique ou désactivé.
- **Matrice de préférences** (*preference matrix*) : table catégorie par canal dont chaque cellule porte un mode.
- **Centre de préférences** (*preference center*) : écran où la personne règle sa matrice et ses sourdines.
- **Plafond** (*ceiling*) : ensemble de canaux ou de modes que les niveaux inférieurs ne peuvent pas dépasser.
- **Préférence effective** (*effective preference*) : valeur finalement appliquée, après la cascade et les plafonds.

#### Relations de cause à effet

- Les abonnements implicites sont trop généreux. La personne finit par suivre des centaines d'objets, le bruit monte, et elle coupe tout.
- Il n'existe pas de sourdine. La seule échappatoire est de désactiver une catégorie entière, y compris ce qui est utile.
- Les préférences sont réglables type par type. Personne ne s'en occupe, les défauts inadaptés persistent, et le centre de préférences devient un écran que nul n'ouvre.
- Un droit est retiré, mais l'abonnement demeure. La personne reçoit des notifications sur un objet qu'elle n'a plus le droit de voir (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- Un nouveau type est lancé avec le mode « immédiat » pour tous. Le jour de la mise en service, chacun reçoit une avalanche.

#### Idées reçues

- **« Suivre et régler ses préférences, c'est la même chose. »** Non. L'un désigne des objets, l'autre des manières de recevoir.
- **« Désactiver une catégorie suffit pour ne plus rien recevoir de ce sujet. »** Non. Les obligations et, selon la politique, les mentions directes et les escalades traversent la sourdine.
- **« Plus de granularité donne plus de liberté. »** Non. Au-delà de quelques catégories, les réglages restent inutilisés, et les défauts décident.

#### Principe clé

Un abonnement désigne l'objet de l'intérêt, une préférence règle la manière, et la valeur effective se calcule en cascade, sous des plafonds que la personne ne peut pas relever.

#### Si vous ne retenez que trois choses

1. Un abonnement dit quoi, une préférence dit comment, et les deux se règlent séparément.
2. La préférence effective se calcule en cascade sous des plafonds, avec des obligations qui ne se coupent pas.
3. Les valeurs par défaut décident de l'expérience de la majorité, et un nouveau type est lancé en douceur.

### 3. Explication technique détaillée

#### Le modèle d'un abonnement

```sql
CREATE TABLE subscription (
  tenant_id     uuid        NOT NULL,
  user_id       uuid        NOT NULL,
  subject_type  text        NOT NULL,
  subject_id    text        NOT NULL,
  origin        text        NOT NULL CHECK (origin IN ('explicit','assigned','author','mentioned','rule')),
  event_filter  text,
  muted_until   timestamptz,
  suspended     boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, user_id, subject_type, subject_id)
);

CREATE INDEX subscription_by_subject
  ON subscription (tenant_id, subject_type, subject_id)
  WHERE suspended = false;
```

La clé primaire interdit les doublons : une personne a au plus un abonnement par sujet. L'index sert la requête la plus fréquente, **« qui suit cet objet ? »**, utilisée par le sélecteur de relation de la résolution (voir [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires)).

```sql
SELECT user_id
FROM subscription
WHERE tenant_id = :tenant_id
  AND subject_type = 'finding' AND subject_id = 'fd_204'
  AND suspended = false
  AND (muted_until IS NULL OR muted_until <= now());
```

**Le champ `origin`** garde la trace de la création. Si une personne qui suivait implicitement (`assigned`) clique ensuite sur « Suivre », l'origine devient `explicit`, et l'abonnement survit au retrait de l'assignation. **Le champ `suspended`** passe à vrai quand la personne perd le droit de lire le sujet : l'abonnement n'est pas détruit (le droit peut revenir), mais il est exclu de la résolution.

#### Le suivi implicite

| Fait | Abonnement créé | Fin |
|---|---|---|
| Création d'un objet | Auteur (`author`) | À la clôture de l'objet, après un délai |
| Assignation d'une activité | Assigné (`assigned`) | Au retrait de l'assignation, si l'origine n'est pas devenue explicite |
| Mention dans un commentaire | Personne mentionnée (`mentioned`) | À la résolution du fil |
| Participation à un fil | Participant (`rule`) | À la résolution du fil |

**Règle d'équilibre.** Un abonnement implicite sur un objet clos ou archivé expire. Sans cela, le nombre de suivis croît sans limite, et chaque objet a des milliers de suiveurs dormants dont la résolution coûte du temps.

#### Les préférences

```json
{
  "user_id": "u_nadia",
  "preferences": {
    "work":          { "in_app": "immediate", "email": "digest",    "push": "immediate" },
    "decisions":     { "in_app": "immediate", "email": "immediate", "push": "immediate" },
    "information":   { "in_app": "immediate", "email": "digest",    "push": "off" },
    "conversations": { "in_app": "immediate", "email": "off",       "push": "off" }
  },
  "mutes": [
    { "subject": { "type": "aircraft", "id": "ac_5c19" }, "until": "2026-10-27T00:00:00Z" }
  ]
}
```

**Comment la lire.** Chaque cellule combine une catégorie et un canal, et prend l'un des trois modes. La catégorie « système » (sécurité, obligations) n'apparaît pas : elle n'est pas modifiable par la personne. La sourdine porte sur un sujet précis et s'arrête à une date.

**Quelle granularité ?**

| Niveau de réglage | Avantage | Inconvénient |
|---|---|---|
| Un interrupteur global | Simple | Tout ou rien |
| Par canal | Facile à comprendre | Ne distingue pas l'utile du superflu |
| Par catégorie et par canal | Bon équilibre, quelques cellules | Demande des catégories bien choisies |
| Par type | Précis | Des dizaines de cellules, rarement réglées |
| Par sujet (sourdine) | Répond au cas « cet objet-là, non » | Faut-il retrouver les sujets coupés ? |

L'équilibre courant est une matrice par catégorie et par canal, de cinq à huit catégories, complétée par une sourdine par sujet. Le réglage par type reste un mode avancé.

#### La préférence effective

```text
mode_effectif(personne, type, canal) :
    si le type est obligatoire (niveau plateforme ou tenant) :
        la remise est assurée par au moins un canal permis
    sinon :
        canaux_permis = plateforme ∩ offre ∩ tenant              (plafond)
        si canal ∉ canaux_permis                       → désactivé
        mode = préférence de la personne pour (catégorie, canal)
               sinon valeur par défaut de l'équipe
               sinon valeur par défaut du tenant
               sinon valeur par défaut du type
        si le sujet est en sourdine pour la personne   → désactivé
                                                          (sauf mention directe
                                                           ou escalade, selon la politique)
    retourner mode
```

**Exemple de calcul.** Le tenant autorise l'application et le mobile, et interdit le courriel. L'utilisateur `u_42` a choisi « courriel : immédiat » pour la catégorie « travail ».

| Canal | Plafond du tenant | Choix de la personne | Mode effectif |
|---|---|---|---|
| Application | Autorisé | Non précisé, défaut « immédiat » | Immédiat |
| Mobile | Autorisé | « Immédiat » | Immédiat |
| Courriel | **Interdit** | « Immédiat » | Désactivé |

Le plafond l'emporte sur le choix personnel. L'écran de préférences de la personne affiche « Courriel : non autorisé par votre organisation » pour qu'elle comprenne (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### Les valeurs par défaut

| Famille | Mode par défaut recommandé | Raison |
|---|---|---|
| Obligations (sécurité, conformité) | Immédiat, non désactivable | La plateforme ou le tenant en répond |
| Décisions attendues de la personne | Immédiat | Une décision ne doit pas dormir (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)) |
| Travail affecté | Immédiat dans l'application, résumé par courriel | Informer sans interrompre |
| Information | Résumé | Utile mais rarement urgent |
| Conversations | Dans l'application seulement | Le fil est consultable sans interruption |
| Promotions du produit | Désactivé jusqu'au consentement | Voir [17.6 Consentement, désabonnement et nature des messages](#176-consentement-désabonnement-et-nature-des-messages) |

**Lancer un nouveau type.** Un type nouvellement créé reçoit un mode par défaut. L'activer d'un coup pour tous les utilisateurs d'un tenant produit une avalanche. On le déploie progressivement, par drapeau (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)), avec le mode « résumé » pour commencer, et l'on observe le taux de coupure avant d'élargir.

#### La sourdine

- **Portée** : un sujet, un type, un fil.
- **Durée** : illimitée ou jusqu'à une date. Une sourdine sans fin est un piège : la personne oublie, et manque une information utile des mois plus tard.
- **Contournements** documentés à l'écran : les obligations, les mentions qui vous visent directement, les escalades dont vous êtes la cible.
- **Alerte retenue, pas information perdue** : les éléments restent consultables dans le fil, sans alerte.

#### La cohérence

Une préférence modifiée s'applique aux notifications **nouvelles**. Pour une notification différée (résumé, heures calmes), la préférence est relue au moment de la remise (voir [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes)). Les préférences sont souvent mises en cache : après une modification, l'effet peut tarder de quelques secondes, ce qui est la cohérence à terme habituelle (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

#### Les modes de défaillance

- **Des abonnements fantômes** : la personne a changé d'équipe, ses anciens suivis persistent et la bruitent.
- **Une désactivation contournée** : la personne a coupé une catégorie, mais une autre règle vise la même information par une autre catégorie.
- **Des préférences périmées** : le réglage a été fait pour un canal que la personne n'utilise plus.
- **Un plafond ignoré** : un canal interdit par le tenant reste actif parce que la préférence personnelle est lue avant le plafond.

**Contre-exemple.** Une plateforme crée un suivi implicite chaque fois qu'une personne ouvre une fiche. Au bout de six mois, elle suit trois mille objets, reçoit cent messages par jour, et désactive toutes les notifications d'un coup, y compris les décisions qui lui sont adressées.

**Limites.** Les préférences ne règlent pas tout : certaines personnes veulent tout recevoir, d'autres rien. La plateforme fournit un cadre et des valeurs par défaut raisonnables, pas une solution à l'attention humaine.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires) | Les abonnements alimentent les sélecteurs de relation ; les préférences s'appliquent après la résolution |
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | La hiérarchie plateforme, tenant, utilisateur y est posée ; cette entrée détaille le calcul |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La cascade des niveaux et le catalogue de réglages portent les défauts et les plafonds |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | La perte d'un droit suspend l'abonnement correspondant |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Un nouveau type se déploie progressivement par drapeau |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | Les préférences en cache suivent la cohérence à terme |
| [17.6 Consentement, désabonnement et nature des messages](#176-consentement-désabonnement-et-nature-des-messages) | Le consentement gouverne les messages promotionnels |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | Les modes « résumé » et les heures calmes y sont détaillés |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, Nadia, planificatrice de la base LYS, reçoit chaque jour une cinquantaine de messages : changements d'état de tous les aéronefs de la flotte, assignations, commentaires. Elle a fini par créer une règle de messagerie qui range tout dans un dossier.

**Problème.** Aucun réglage n'existe entre « tout » et « rien », et rien ne distingue ce qui la concerne vraiment.

**Application du concept.** Le tenant définit cinq catégories et des valeurs par défaut par rôle. Chaque personne peut suivre, couper et régler.

**Déroulé.**

1. Le tenant impose les catégories « décisions » et « système » en immédiat, et place « information » en résumé par défaut.
2. Nadia suit explicitement les trois aéronefs de sa base qu'elle planifie cette semaine.
3. Elle met en sourdine, jusqu'au 27 octobre, un aéronef en stockage (`ac_5c19`).
4. Elle règle « conversations » sur l'application seulement.
5. Le suivi implicite l'abonne aux activités qu'on lui assigne, et l'abonnement expire quand elles sont closes.

**Résultat.** Elle reçoit les décisions et les assignations qui la concernent, un résumé quotidien pour le reste, et rien pour l'aéronef en stockage. Le taux de coupure de la catégorie « information » est mesuré par le tenant, qui ajuste ses défauts (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)).

**Limites.** Si Nadia oublie que la sourdine expire le 27 octobre, elle retrouvera les messages de l'aéronef sans y avoir pensé. Une alerte de fin de sourdine, ou une durée maximale par défaut, atténue ce risque.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un abonnement et une préférence ?
2. **Compréhension.** Citez deux sources d'abonnements implicites et dites quand ils prennent fin.
3. **Compréhension.** Que se passe-t-il quand le tenant interdit un canal que la personne a choisi ?
4. **Pourquoi.** Pourquoi les valeurs par défaut comptent-elles plus que le centre de préférences ?
5. **Raisonnement pratique.** Vous lancez un nouveau type de notification pour 3 000 utilisateurs. Comment l'introduisez-vous sans avalanche ?

#### Réponses

1. Un abonnement désigne ce qui intéresse la personne (un objet, un fil, une file). Une préférence règle la manière d'être prévenue (canal, mode de remise). L'un alimente l'audience, l'autre s'applique ensuite.
2. L'assignation (le suivi dure tant que l'assignation dure, si la personne n'a pas suivi explicitement), la création d'un objet (le suivi expire un délai après la clôture de l'objet). La mention et la participation à un fil s'arrêtent à la résolution du fil.
3. Le plafond l'emporte : le canal est désactivé quelle que soit la préférence personnelle, et l'écran de préférences explique que l'organisation ne l'autorise pas.
4. Parce que la plupart des personnes ne règlent jamais rien. Les valeurs par défaut sont donc la préférence réelle du plus grand nombre, et un défaut mal choisi se traduit en bruit ou en silence généralisé.
5. En le déployant par paliers derrière un drapeau, avec le mode « résumé » au départ, en mesurant le taux d'action et le taux de coupure, puis en élargissant. On évite de l'activer d'un coup en « immédiat » pour tous.

## 17.3 Modèles de message et localisation

### 1. Comprendre simplement

Un **modèle de message** (*message template*) est le gabarit qui produit le texte d'une notification à partir de données : un titre, un corps, des libellés d'action, un lien, avec des variables à remplir. La **localisation des modèles** (*template localization*) est le mécanisme qui choisit, pour chaque destinataire, la version dans sa langue, avec ses formats de date et de nombre, et un repli quand la traduction manque.

**Pourquoi cela existe.** Sans modèles, les messages sont des chaînes de caractères dispersées dans le code : on ne peut ni changer le ton, ni ajouter une langue, ni adapter le texte à un tenant, ni le tester. Sans localisation, chacun reçoit la langue du développeur.

**Problème résolu.** Produire, pour chaque destinataire et chaque canal, un message correct, lisible, sûr et dans la bonne langue, sans modifier le code.

**Modèle mental.** Le formulaire pré-imprimé à champs à remplir (« Bonjour {nom}, votre {objet} est prêt »), tenu en plusieurs versions linguistiques dans un tiroir. Le secrétariat choisit le bon tiroir selon le destinataire.

**Où l'analogie s'arrête.** Un formulaire papier ne s'adapte pas au canal (court pour le mobile, riche pour le courriel), ne gère pas le pluriel, et ne vérifie pas que les champs remplis ne révèlent aucun secret.

**Exemple.** Le modèle `finding_critical` produit « Constat critique sur F-ABCD » pour Hugo, dont la langue est le français, et « Critical finding on F-ABCD » pour un auditeur anglophone. Le corps change selon le nombre de constats en attente : un seul, ou plusieurs.

**Les composants.**

1. une **clé** et une **version** de modèle ;
2. des **variantes par canal** (application, courriel, mobile, messagerie) ;
3. des **variantes par langue**, avec une chaîne de repli ;
4. des **variables typées** et leurs règles de rendu ;
5. des **formes de pluriel** par langue ;
6. une **validation** à l'enregistrement (variables, longueur, champs autorisés) ;
7. une **trace** de la version utilisée pour chaque message envoyé.

**Objectif d'apprentissage :** vous pouvez expliquer comment on choisit la version d'un modèle pour un destinataire, citer ce qu'un modèle ne doit jamais contenir, et décrire le rôle de la chaîne de repli.

### 2. Connaissances essentielles

#### Définition

- **Modèle de message** : gabarit versionné qui, associé à un type de notification, à un canal et à une langue, produit le texte d'un message à partir de variables typées.
- **Localisation des modèles** : choix et rendu de la variante d'un modèle selon la langue, les formes de pluriel et les formats régionaux du destinataire, avec un repli défini quand une variante manque.

#### Idées fondamentales

1. **Le texte est une donnée, pas du code.** Il se change, se traduit, se prévisualise et se versionne sans déploiement.
2. **Un modèle est propre à un canal.** Le même fait se dit court sur un mobile, plus complet par courriel.
3. **Les variables sont typées et bornées.** Un modèle ne peut citer que des champs déclarés, et seulement ceux qu'un canal externe peut transporter.
4. **Le choix de la langue suit une chaîne de repli.** Une variante absente ne produit jamais un message vide ou cassé.
5. **Le pluriel et les formats dépendent de la langue.** On ne les fabrique pas par concaténation.
6. **Chaque message envoyé garde la version du modèle utilisé.** On peut ainsi reconstituer ce qui a été dit.

#### Vocabulaire essentiel

- **Variable** (*placeholder*, *variable*) : emplacement du modèle remplacé par une donnée au rendu.
- **Étiquette de langue** (*language tag*) : identifiant de langue ou de variante régionale, comme `fr` ou `fr-CA`, défini par le BCP 47 (RFC 5646 et RFC 4647).
- **Chaîne de repli** (*fallback chain*) : suite ordonnée de variantes essayées tant que la précédente manque.
- **Catégories de pluriel** (*plural categories*) : classes de nombres qui déterminent la forme d'un mot dans une langue (par exemple *one* et *other*).
- **Rendu** (*rendering*) : production du texte final à partir du modèle, des données, de la langue et du fuseau.
- **Échappement** (*escaping*) : neutralisation des caractères spéciaux d'une donnée avant de l'insérer dans un format (HTML, par exemple).
- **Modèle de repli** (*fallback template*) : modèle de la plateforme utilisé quand le tenant n'a rien défini.

#### Relations de cause à effet

- Les messages sont écrits dans le code. Changer un mot demande un déploiement, et ajouter une langue demande de modifier cent fichiers.
- Un modèle accepte n'importe quel champ. Un courriel finit par contenir le détail confidentiel d'un constat (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)).
- Une donnée fournie par un utilisateur est insérée sans échappement dans un courriel HTML. Un titre contenant du balisage casse la mise en page, ou pire.
- Aucune chaîne de repli n'existe. Une personne dont la langue n'est pas traduite reçoit un message vide, ou des clés techniques à la place du texte.
- Le modèle change sans version. Personne ne peut dire quel texte a été envoyé à qui lors d'un litige.

#### Idées reçues

- **« Traduire, c'est remplacer les mots. »** Non. Le pluriel, l'ordre des mots, les formats de date et de nombre diffèrent selon la langue.
- **« Un seul modèle suffit pour tous les canaux. »** Non. Une notification mobile n'a ni la place ni la forme d'un courriel.
- **« Le modèle appartient au développeur. »** Non. Dans une plateforme configurable, le tenant doit pouvoir adapter ton, marque et vocabulaire.

#### Principe clé

Un message est le rendu d'un modèle versionné, par canal et par langue, à partir de variables déclarées, avec un repli défini, et la version utilisée est conservée.

#### Si vous ne retenez que trois choses

1. Le texte d'une notification est une donnée versionnée, avec une variante par canal et par langue.
2. Les variables sont typées, échappées, et limitées à ce qu'un canal externe peut porter.
3. Une chaîne de repli garantit un message dans tous les cas, et la version utilisée est enregistrée.

### 3. Explication technique détaillée

#### L'anatomie d'un modèle

```json
{
  "template_key": "finding_critical",
  "version": 4,
  "variables": {
    "aircraft": { "type": "string", "external": true },
    "open_findings": { "type": "integer", "external": true },
    "finding_summary": { "type": "string", "external": false }
  },
  "channels": {
    "in_app": {
      "title": { "fr": "Constat critique sur {aircraft}", "en": "Critical finding on {aircraft}" },
      "body": {
        "fr": { "one": "{open_findings} constat attend une décision.", "other": "{open_findings} constats attendent une décision." },
        "en": { "one": "{open_findings} finding awaits a decision.", "other": "{open_findings} findings await a decision." }
      },
      "action_label": { "fr": "Ouvrir", "en": "Open" }
    },
    "push": {
      "title": { "fr": "Constat critique", "en": "Critical finding" },
      "body":  { "fr": { "other": "{aircraft} : une décision est attendue." }, "en": { "other": "{aircraft}: a decision is awaited." } },
      "max_length": { "title": 40, "body": 120 }
    }
  }
}
```

**Comment la lire.** Chaque variable déclare son type et si elle peut apparaître sur un canal externe (`external`). Ici, `finding_summary` est réservée à l'application : elle n'apparaît dans aucune variante du mobile ni du courriel. Les variantes de corps portent une clé de catégorie de pluriel (`one`, `other`). Le canal mobile impose des longueurs maximales.

#### Les variantes par canal

| Canal | Forme | Taille | Actions | Données autorisées |
|---|---|---|---|---|
| Application | Titre, corps, actions | Moyenne | Boutons, lien profond | Contenu complet selon les droits |
| Courriel | Objet, texte et version riche, pied de page | Libre | Liens | Titre, raison, lien : pas de détail confidentiel |
| Mobile | Titre court, corps court | Quelques dizaines de caractères | Une ou deux actions | Titre et lien |
| Messagerie d'équipe | Message structuré | Courte | Boutons éventuels | Titre et lien |
| Webhook | Charge utile structurée | Libre | Aucune | Selon le contrat d'intégration (voir [7.5 Webhook](07-evenements-automatisation.md#75-webhook)) |

#### Le choix de la variante

```text
variante(type, canal, langue_du_destinataire) :
    1. modèle du tenant, langue exacte        (fr-CA)
    2. modèle du tenant, langue principale    (fr)
    3. modèle du tenant, langue par défaut du tenant
    4. modèle de la plateforme, langue exacte
    5. modèle de la plateforme, langue principale
    6. modèle de la plateforme, langue par défaut de la plateforme
```

Les étiquettes de langue suivent le BCP 47 : une étiquette comme `fr-CA` désigne le français tel qu'on l'emploie au Canada, et son repli naturel est `fr`. Les modèles obligatoires de sécurité ou de conformité ne sont pas remplaçables par le tenant : seule la variante de la plateforme est utilisée.

#### Le pluriel et les formats

Chaque langue regroupe les nombres en **catégories de pluriel**, définies par le référentiel Unicode CLDR : *zero*, *one*, *two*, *few*, *many*, *other*. La catégorie *other* est toujours présente. L'anglais n'emploie que *one* et *other*. Le russe emploie *one*, *few*, *many* et *other*, par exemple « 1 книга », « 2 книги », « 5 книг ». Un modèle qui fabrique le pluriel en ajoutant un « s » échoue dès la deuxième langue.

| Élément | Règle |
|---|---|
| Pluriel | Une variante par catégorie utilisée par la langue |
| Dates et heures | Format de la langue, **fuseau du destinataire** (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Nombres | Séparateurs et groupements de la langue |
| Noms propres | Insérés tels quels, jamais traduits ni accordés par concaténation |

#### La sûreté du rendu

- **Variables déclarées seulement.** Un modèle qui cite une variable inconnue est refusé à l'enregistrement.
- **Champs externes.** Seules les variables marquées `external` peuvent figurer dans une variante de courriel, de mobile ou de messagerie (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)).
- **Échappement.** Toute donnée est échappée selon le format de sortie. Un titre contenant `<script>` devient du texte inoffensif.
- **Liens.** Un lien profond contient des identifiants opaques, jamais de données personnelles, et il est revérifié à l'ouverture (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).
- **Pas de logique libre.** Le langage de gabarit se limite aux variables, aux conditions simples et aux formes de pluriel, à l'image du langage d'expressions sûr de [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule).

#### Le cycle de vie d'un modèle

1. **Brouillon** par le tenant ou la plateforme.
2. **Validation** : variables déclarées, longueurs, langues manquantes, champs externes.
3. **Prévisualisation** avec des données d'exemple, dans chaque langue et chaque canal.
4. **Publication** versionnée (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), avec retour arrière possible.
5. **Archivage** : chaque notification envoyée garde la clé et la version du modèle.

#### Les modes de défaillance

- **Une variable non remplie** : « Constat critique sur {aircraft} » apparaît tel quel.
- **Une traduction qui diverge** : la version française est mise à jour, l'anglaise non.
- **Un message tronqué** : un titre mobile dépasse la limite et la partie utile disparaît.
- **Un repli silencieux** : le message part dans la langue du tenant sans que personne le sache.
- **Un modèle de tenant qui masque une obligation** : le tenant reformule un message légal.

**Contre-exemple.** Une plateforme assemble « Vous avez » + nombre + « constats » + (« s » si n > 1) + « en attente ». En russe, en polonais ou en arabe, la règle est fausse, et il faut réécrire le code pour chaque langue.

**Limites.** La traduction automatique accélère la production, mais elle ne remplace pas une relecture : le ton, les termes métier et la longueur varient. Les langues qui s'écrivent de droite à gauche posent des questions de mise en page qui dépassent ce module (voir le module 25 du [plan des compléments](../PLAN-COMPLEMENTS.md#module-25--expériences-multi-contextes--internationalisation-mobile-hors-ligne-temps-réel)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | Le contenu d'une notification (titre, raison, action, lien) et la règle de confidentialité des canaux externes |
| [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires) | Le rendu suit la résolution des destinataires et se fait par destinataire |
| [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison) | Chaque canal impose sa forme et ses limites |
| [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) | Le langage de gabarit suit les principes d'un langage d'expressions sûr |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les modèles sont des objets de configuration versionnés |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les dates sont rendues dans le fuseau du destinataire |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | Le tenant surcharge les modèles de la plateforme dans le cadre de la cascade |
| [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | La publication d'un modèle suit le parcours de configuration sûre |

### 5. Application pratique

**Situation initiale.** Alpha Air dispose d'un message unique pour les constats critiques, rédigé en français dans le code. L'auditeur externe, anglophone, reçoit le texte français. Un technicien se plaint que la notification mobile est coupée au milieu du mot « critique ».

**Problème.** Le texte est dans le code, une seule langue, une seule forme pour tous les canaux.

**Application du concept.** La plateforme adopte des modèles versionnés, avec une variante par canal et par langue, et une chaîne de repli.

**Déroulé.**

1. L'administrateur du tenant ouvre le modèle `finding_critical` v3 de la plateforme et le copie en brouillon.
2. Il ajuste le ton du français, ajoute le logo de la compagnie, et définit une variante mobile à 40 caractères.
3. La validation signale que la variante anglaise du mobile est absente : il la rédige.
4. La prévisualisation montre les rendus pour `fr`, `en` et `fr-CA`. Le dernier repose sur le repli `fr`.
5. Le modèle v4 est publié, avec retour arrière possible vers v3.
6. Chaque notification émise garde la clé et la version.

**Résultat.** Chaque destinataire reçoit le message dans sa langue, avec une forme adaptée à son canal, et sans détail confidentiel dans le courriel ni dans le mobile.

**Limites.** Les modèles du tenant ne peuvent pas retirer le pied de page légal ni reformuler les messages obligatoires de sécurité. Une traduction produite par un outil automatique doit rester relue par une personne du métier.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient un modèle de message, et pourquoi y a-t-il une variante par canal ?
2. **Compréhension.** Décrivez la chaîne de repli pour un destinataire dont la langue est `fr-CA`.
3. **Compréhension.** Pourquoi marque-t-on certaines variables comme interdites sur les canaux externes ?
4. **Pourquoi.** Pourquoi ne fabrique-t-on pas le pluriel en ajoutant un « s » ?
5. **Raisonnement pratique.** Un litige porte sur le texte d'une notification envoyée il y a deux mois. Comment la plateforme permet-elle de le reconstituer ?

#### Réponses

1. Une clé, une version, des variables typées, et des variantes de titre, de corps et d'action par canal et par langue. Chaque canal a sa forme et ses limites : un mobile n'a ni la place ni les possibilités d'un courriel.
2. On essaie le modèle du tenant en `fr-CA`, puis en `fr`, puis dans la langue par défaut du tenant, puis les mêmes variantes du modèle de la plateforme. Un message est ainsi toujours produit.
3. Parce que le courriel, le mobile et la messagerie sortent du périmètre contrôlé. Une variable sensible y circulerait chez des tiers et resterait lisible après un retrait de droits.
4. Parce que les langues ont des règles de pluriel différentes, regroupées en catégories (*one*, *few*, *many*, *other*…). Un « s » ajouté ne marche qu'en français et en anglais, et pas toujours.
5. Chaque notification enregistre la clé du modèle et sa version. On retrouve la version publiée, avec ses variantes, et on rend de nouveau le message avec les données conservées (en tenant compte de la politique de rétention).

## 17.4 Adaptateurs de canal et statut de livraison

### 1. Comprendre simplement

Un **adaptateur de canal** (*channel adapter*) est le composant qui traduit un message déjà rendu dans le langage d'un canal précis : l'enregistrer dans la boîte de réception de l'application, le remettre à un serveur de courriel, le confier à un service de notifications mobiles, le publier dans une messagerie d'équipe, ou appeler un webhook. Le **statut de livraison** (*delivery status*) est ce que l'on sait du sort d'un message sur un canal donné : en attente, envoyé, délivré, échoué, supprimé.

**Pourquoi cela existe.** Chaque canal a ses protocoles, ses limites et ses pannes. Sans adaptateurs, chaque module parle à chaque fournisseur : changer de fournisseur devient un chantier, et la panne de l'un bloque tout. Sans statut fiable, on ne peut ni réessayer à bon escient, ni basculer vers un autre canal, ni mesurer ce qui arrive vraiment aux personnes.

**Problème résolu.** Isoler la diversité des canaux derrière une interface unique, et rendre le sort de chaque message connu et exploitable.

**Modèle mental.** Les guichets d'une poste : lettre, colis, recommandé. Un guichetier par type, chacun avec ses règles et ses limites de poids. Le suivi du colis indique où il en est.

**Où l'analogie s'arrête.** Le suivi postal est détaillé. Pour beaucoup de canaux, « délivré » n'est pas toujours connu, et « lu » l'est encore moins : le statut reflète ce que le canal sait, pas ce que la personne a fait.

**Exemple.** Un constat critique doit atteindre Hugo. Le message est enregistré dans l'application (statut « délivré » : il est en base). Il est confié au service de notifications mobiles, qui l'accepte (« envoyé »), puis l'appareil l'acquitte (« délivré »). Le courriel est accepté par le serveur du destinataire (« envoyé »), sans autre confirmation. Si le jeton de l'appareil est invalide, le mobile échoue et la politique de bascule déclenche le courriel.

**Les composants.**

1. une **interface commune** que tous les adaptateurs respectent ;
2. un **adaptateur par canal** et par fournisseur ;
3. des **capacités déclarées** (taille, mise en forme, actions, accusés) ;
4. une **machine à états** du statut de livraison ;
5. une **politique de reprise** et de bascule ;
6. des **identifiants et secrets** propres au tenant ou à la plateforme ;
7. des **mesures** par canal.

**Objectif d'apprentissage :** vous pouvez décrire l'interface d'un adaptateur, énumérer les statuts de livraison et leur sens selon le canal, et expliquer quand basculer vers un autre canal.

### 2. Connaissances essentielles

#### Définition

- **Adaptateur de canal** : composant qui implémente, pour un canal et un fournisseur donnés, une interface commune d'envoi, de déclaration de capacités et de remontée de statut, et qui isole le reste de la plateforme des particularités du canal.
- **Statut de livraison** : état, par message et par canal, parmi un ensemble fermé (en attente, envoyé, délivré, ouvert, échoué, supprimé, expiré), qui ne dit que ce que le canal permet de savoir.

#### Idées fondamentales

1. **Une interface, plusieurs adaptateurs.** Ajouter un canal ou changer de fournisseur ne touche ni les producteurs ni le service de notifications.
2. **Le statut dit ce que l'on sait, pas ce que l'on espère.** « Accepté par le fournisseur » n'est ni « délivré » ni « lu ».
3. **Les statuts forment une machine à états.** Certains sont terminaux ; les transitions sont déclarées (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).
4. **L'envoi est au moins une fois.** L'adaptateur transmet une clé d'idempotence au fournisseur quand c'est possible, et le résultat est enregistré avant toute reprise.
5. **Un échec se classe.** Transitoire, on réessaie avec temporisation ; permanent, on cesse et l'on bascule ou supprime (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
6. **La bascule est une politique.** Elle dépend de l'urgence et des canaux autorisés, jamais d'un réflexe.

#### Vocabulaire essentiel

- **Fournisseur** (*provider*) : service tiers ou interne qui assure le transport (serveur de courriel, service de notifications mobiles, passerelle de messages courts).
- **Capacités** (*capabilities*) : ce qu'un canal sait faire (taille maximale, texte riche, actions, accusés de réception).
- **Accusé de réception** (*delivery receipt*) : confirmation, fournie par le canal, qu'un message est parvenu à sa cible.
- **Jeton d'appareil** (*device token*) ou **abonnement push** : identifiant qui désigne un appareil ou un navigateur auprès d'un service de notifications mobiles.
- **Durée de vie** (*time to live*, *TTL*) : durée au-delà de laquelle un message ne doit plus être remis.
- **Bascule** (*fallback*) : repli vers un autre canal quand le premier échoue ou ne répond pas.
- **Suppression** (*suppression*) : décision de ne pas envoyer (préférence, heures calmes, adresse en échec).

#### Relations de cause à effet

- Chaque module appelle directement le fournisseur de courriel. Un changement de fournisseur demande de modifier tous les modules, et une panne les bloque tous.
- Le statut « délivré » est affiché pour tout message accepté. Les équipes croient avoir prévenu quelqu'un qui n'a jamais rien reçu.
- Les échecs permanents sont réessayés comme les échecs transitoires. L'adaptateur martèle une adresse inexistante, et abîme la réputation d'envoi (voir [17.5 Rebonds et authentification du courriel](#175-rebonds-et-authentification-du-courriel)).
- Un seul fournisseur et une seule file servent tous les canaux. La panne du courriel retarde les notifications mobiles.
- La bascule n'est pas bornée. Le message d'une activité banale réveille la personne par appel après échec de trois canaux.

#### Idées reçues

- **« Si le fournisseur répond 200, le message est arrivé. »** Non. Il a été accepté pour traitement. Le sort final peut être connu plus tard, ou jamais.
- **« Tous les canaux se valent. »** Non. Ils diffèrent par la taille, la forme, la fiabilité et ce qu'ils révèlent.
- **« Mieux vaut envoyer par tous les canaux à la fois. »** Non. La personne reçoit trois fois le même message, et la confiance baisse.

#### Principe clé

Un adaptateur cache un canal derrière une interface commune, et le statut de livraison n'affirme que ce que le canal permet de savoir.

#### Si vous ne retenez que trois choses

1. Chaque canal a un adaptateur avec des capacités déclarées, derrière une interface commune.
2. Le statut de livraison est une machine à états qui dit ce que l'on sait, avec des échecs classés en transitoires et permanents.
3. La bascule entre canaux est une politique bornée par l'urgence et par les canaux autorisés.

### 3. Explication technique détaillée

#### L'interface d'un adaptateur

```typescript
type Channel = "in_app" | "email" | "push" | "chat" | "sms" | "webhook";

interface Capabilities {
  maxTitle: number;
  maxBody: number;
  richText: boolean;
  actions: boolean;
  receipts: "none" | "provider" | "device";
}

type SendResult =
  | { status: "accepted"; providerId: string }
  | { status: "rejected"; kind: "transient" | "permanent"; code: string };

interface ChannelAdapter {
  readonly channel: Channel;
  capabilities(): Capabilities;
  send(
    message: RenderedMessage,
    contact: ContactPoint,
    options: { idempotencyKey: string; ttlSeconds: number },
  ): Promise<SendResult>;
  health(): Promise<"up" | "degraded" | "down">;
}
```

**Comment la lire.** Le service n'appelle jamais un fournisseur : il appelle `send`. Les `capabilities` servent à vérifier le rendu avant l'envoi (voir [17.3 Modèles de message et localisation](#173-modèles-de-message-et-localisation)). Le résultat distingue l'**acceptation** du **rejet**, et classe le rejet en transitoire ou permanent. `health` alimente la bascule et la surveillance.

#### Les statuts de livraison

```text
en attente ─► envoi en cours ─► envoyé ─► délivré ─► ouvert (si le canal le permet)
    │               │             │
    │               ▼             ▼
    │          échec transitoire ─► nouvelle tentative ─► (retour à « en attente »)
    │               │
    │               ▼
    │          échec permanent   (terminal)
    ├──────► supprimé            (préférence, heures calmes, adresse en échec)
    └──────► expiré              (durée de vie dépassée)
```

| Statut | Sens | Canal application | Courriel | Mobile |
|---|---|---|---|---|
| En attente | Accepté par le service, pas encore envoyé | Instantané | File d'envoi | File d'envoi |
| Envoyé | Accepté par le fournisseur | Écrit en base | Accepté par le serveur du destinataire | Accepté par le service de notifications |
| Délivré | Parvenu à la cible, si le canal le sait | En base, donc délivré | Rarement connu | Selon le service, par acquittement de l'appareil |
| Ouvert | La personne l'a vu | Ouverture de la boîte | Suivi par pixel, peu fiable | Ouverture de la notification |
| Échoué | Aucune remise possible | Rare | Rebond, rejet | Jeton invalide |
| Supprimé | Non envoyé volontairement | Préférence | Adresse supprimée | Désactivé |

La dernière colonne évite un piège : un statut « ouvert » par pixel de suivi n'est qu'un indice, car certains clients de messagerie bloquent ou préchargent les images.

#### La durée de vie

Chaque envoi porte une durée de vie. Le protocole Web Push (RFC 8030) l'impose : l'en-tête TTL est obligatoire, et le service de notifications ne doit pas remettre le message après son expiration ; une durée nulle signifie « remise immédiate si l'appareil est joignable, sinon abandon ». Le principe vaut pour tous les canaux : une alerte d'astreinte n'a plus de sens six heures plus tard, alors qu'un résumé de la veille en garde un.

| Type de notification | Durée de vie raisonnable | Raison |
|---|---|---|
| Alerte critique | Quelques minutes | Périmée dès qu'elle est ancienne |
| Décision demandée | Jusqu'à l'échéance | Reste utile tant qu'elle est ouverte |
| Information | Plusieurs jours | Sans urgence, utile en différé |

Pour le mobile, la RFC 8291 définit le chiffrement de bout en bout de la charge utile d'un message Web Push, et la RFC 8292 (VAPID) permet à l'application serveur de s'identifier auprès du service. Les services de notifications propres aux systèmes d'exploitation mobiles ont leurs propres interfaces, que l'adaptateur masque.

#### Reprises et isolation

- **Classement des échecs.** Les erreurs de réseau, les réponses de surcharge ou d'indisponibilité sont transitoires. Un jeton invalide, une adresse inexistante ou un refus d'autorisation sont permanents (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
- **Temporisation croissante** avec aléa, et nombre de reprises borné par la durée de vie du message.
- **File des échecs** surveillée pour les messages épuisés (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- **Disjoncteur par fournisseur** : quand un fournisseur échoue de façon répétée, l'adaptateur cesse de l'appeler un moment (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
- **Isolation.** Une file par canal, et par tenant pour les gros émetteurs : la panne d'un canal ou le débit d'un tenant ne bloque pas les autres (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).

#### Les politiques de bascule

| Urgence | Politique | Garde-fou |
|---|---|---|
| Critique | Mobile ; si non délivré en 2 minutes, courriel ; si non acquitté en 15 minutes, appel ou message court selon le tenant | Seulement vers des canaux que le tenant autorise |
| Élevée | Application et mobile ; courriel si le mobile échoue | Une seule bascule |
| Normale | Application ; résumé par courriel | Aucune bascule |
| Faible | Application seulement | Aucune |

Une bascule n'est pas une insistance : elle ne se déclenche que sur échec ou absence d'acquittement, et jamais vers un canal interdit par le tenant ou par les préférences obligatoires (voir [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)).

#### Identifiants et secrets

Les fournisseurs demandent des identifiants (clés d'API, mots de passe de relais, certificats). Les identifiants de la plateforme et ceux d'un tenant qui apporte son propre fournisseur sont stockés comme des secrets, jamais dans la configuration en clair (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)). Un tenant qui fournit son propre serveur d'envoi assume sa réputation, mais la plateforme fixe des limites de débit pour se protéger (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).

#### Les mesures

| Mesure | Question |
|---|---|
| Délai entre la demande et l'envoi (médiane, 95e centile) | Le canal est-il rapide ? |
| Part des messages « envoyé » puis « délivré » | Que sait-on réellement ? |
| Échecs par code | Quelles causes dominent ? |
| Profondeur de la file des échecs | Des messages sont-ils bloqués ? |
| Part des bascules | La politique est-elle trop souvent sollicitée ? |

Ces mesures alimentent la surveillance (voir [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)) et les objectifs de niveau de service (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

#### Les modes de défaillance

- **Un fournisseur silencieux** : il accepte, puis perd. Seul un accusé de réception ou une mesure de bout en bout le révèle.
- **Un jeton obsolète** : l'application a été désinstallée, les envois échouent indéfiniment. Il faut retirer le jeton.
- **Une avalanche de reprises** après une panne, qui reproduit la panne.
- **Une bascule en boucle** : le canal de repli bascule vers le premier.
- **Un secret partagé** entre tenants : un tenant épuise le quota commun.

**Contre-exemple.** Un adaptateur de courriel qui appelle le fournisseur dans la requête de l'utilisateur, sans file. À la première panne du fournisseur, l'approbation d'un constat échoue : une indisponibilité d'un canal de notification bloque le métier.

**Limites.** Aucun adaptateur ne rend un canal fiable. Le courriel reste « au mieux », et un statut « envoyé » n'est pas une preuve de lecture. Pour les messages qui exigent une preuve, la plateforme s'appuie sur le journal d'audit et l'acquittement dans l'application, pas sur un canal externe (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [17.3 Modèles de message et localisation](#173-modèles-de-message-et-localisation) | Le rendu respecte les capacités déclarées de chaque adaptateur |
| [17.5 Rebonds et authentification du courriel](#175-rebonds-et-authentification-du-courriel) | Les rebonds et l'authentification concernent l'adaptateur de courriel |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | La limitation et les heures calmes décident d'envoyer, différer ou supprimer |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Classement des échecs, temporisation et disjoncteur |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | File des échecs et idempotence |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Un webhook est un canal à destination d'un système |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les identifiants des fournisseurs sont des secrets |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les mesures par canal alimentent les alertes |
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | Les canaux, l'urgence et la livraison y sont présentés côté interface |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, un constat critique est notifié par courriel seulement. Un jour, le fournisseur de courriel est lent pendant deux heures : le constat reste sans réponse jusqu'au lendemain.

**Problème.** Un seul canal, aucun statut, aucune bascule, et aucun moyen de savoir ce qui est parti.

**Application du concept.** Le tenant active trois canaux et une politique de bascule pour l'urgence critique.

**Déroulé.**

1. À 10:40:12, la demande `finding_critical` est résolue pour Hugo.
2. L'adaptateur de l'application écrit la notification : statut « délivré » à 10:40:12.
3. L'adaptateur mobile transmet au service de notifications avec une durée de vie de 10 minutes. Il répond que le jeton est invalide : échec permanent, jeton retiré.
4. La politique bascule vers le courriel. L'adaptateur de courriel est accepté par le serveur du destinataire à 10:40:20 : statut « envoyé ».
5. La personne ouvre la notification dans l'application à 10:52 : statut « traité » côté activité (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)).

**Résultat.** Le constat est lu en douze minutes. La plateforme sait que le mobile était mort, que le courriel est parti, et que l'application l'a affichée.

**Limites.** Le courriel reste « envoyé » sans confirmation de lecture : seul le statut côté application prouve la prise en compte.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient l'interface d'un adaptateur de canal ?
2. **Compréhension.** Quelle différence y a-t-il entre « envoyé » et « délivré » ?
3. **Compréhension.** Pourquoi classe-t-on un échec en transitoire ou permanent ?
4. **Pourquoi.** Pourquoi fixe-t-on une durée de vie à un message ?
5. **Raisonnement pratique.** Le fournisseur de courriel est indisponible depuis une heure. Que doit faire la plateforme pour les notifications urgentes et pour les autres ?

#### Réponses

1. Un identifiant de canal, des capacités déclarées, une opération d'envoi qui prend un message rendu, un point de contact et une clé d'idempotence, une distinction entre acceptation et rejet (transitoire ou permanent), et un état de santé.
2. « Envoyé » signifie accepté par le fournisseur ou le serveur suivant. « Délivré » signifie parvenu à la cible (boîte, appareil), quand le canal sait le dire. Beaucoup de canaux ne fournissent pas cette seconde information.
3. Parce que l'action à mener diffère : on réessaie un échec transitoire avec temporisation, alors qu'un échec permanent (adresse inexistante, jeton invalide) appelle l'arrêt, la suppression ou la bascule.
4. Parce que certains messages perdent leur sens avec le temps : une alerte d'astreinte remise six heures plus tard est trompeuse. La durée de vie borne aussi les reprises.
5. Ne pas bloquer l'action métier (envoi asynchrone par file), laisser le disjoncteur ouvert, reprendre avec temporisation, basculer les notifications urgentes vers un autre canal autorisé, laisser les autres dans la file jusqu'à reprise, et alerter l'exploitation si la file d'échecs grossit.

## 17.5 Rebonds et authentification du courriel

### 1. Comprendre simplement

La **gestion des rebonds** (*bounce handling*) consiste à reconnaître, classer et traiter les courriels qui n'ont pas pu être remis (les **rebonds**) : cesser d'écrire à une adresse inexistante, réessayer quand la panne est passagère, mettre une adresse de côté. L'**authentification du courriel** (*email authentication*) regroupe les mécanismes qui permettent à un serveur destinataire de vérifier qu'un message vient bien du domaine qu'il prétend : **SPF**, **DKIM** et **DMARC**.

**Pourquoi cela existe.** Le courriel est un système ouvert : n'importe qui peut écrire n'importe quelle adresse d'expéditeur. Les serveurs récepteurs filtrent donc sévèrement. Un message non authentifié finit au courrier indésirable, ou est refusé. Écrire à des adresses mortes dégrade la **réputation** de l'expéditeur, et finit par envoyer en indésirables les messages destinés à des adresses valides.

**Problème résolu.** Faire en sorte que les notifications par courriel arrivent dans les boîtes, protéger la réputation d'envoi, et empêcher que le domaine d'un tenant soit usurpé.

**Modèle mental.** La poste : les mentions « n'habite pas à l'adresse indiquée » ou « boîte pleine » sont les rebonds. Le cachet, la signature et la liste des facteurs autorisés d'une compagnie sont l'authentification.

**Où l'analogie s'arrête.** Le retour à l'expéditeur postal est physique et fiable. Un rebond de courriel peut arriver tard, être incomplet, ou ne jamais venir : certains serveurs acceptent le message puis le détruisent sans rien dire.

**Exemple.** Alpha Air envoie ses notifications depuis `notifications@alpha-air.example`, par l'intermédiaire de la plateforme. Un message à une adresse supprimée provoque une réponse « 550 5.1.1 : adresse de boîte inexistante » : rebond permanent, l'adresse est mise de côté. Une réponse « 452 4.2.2 : boîte pleine » est transitoire : on réessaie.

**Les composants.**

1. une **classification** des échecs (permanent, transitoire, blocage, plainte) ;
2. une **liste de suppression** des adresses à ne plus utiliser ;
3. une **politique de reprise** pour les échecs transitoires ;
4. **SPF** : quels serveurs peuvent envoyer pour le domaine ;
5. **DKIM** : une signature vérifiable du message ;
6. **DMARC** : la politique du domaine et l'alignement avec l'adresse visible ;
7. des **rapports** et des mesures de réputation.

**Objectif d'apprentissage :** vous pouvez classer un rebond selon son code, décrire ce que vérifient SPF, DKIM et DMARC, et expliquer pourquoi la réputation d'envoi se partage entre tenants.

### 2. Connaissances essentielles

#### Définition

- **Rebond** (*bounce*) : message d'erreur renvoyé à l'expéditeur, immédiatement par le serveur qui refuse la remise (réponse SMTP), ou plus tard sous la forme d'un message de notification de statut de remise.
- **Gestion des rebonds** : ensemble des règles qui classent les rebonds et déterminent l'action : réessayer, supprimer l'adresse, suspendre le canal, alerter.
- **Authentification du courriel** : ensemble de mécanismes (SPF, DKIM, DMARC) par lesquels un domaine déclare qui peut envoyer en son nom et permet aux récepteurs de le vérifier.

#### Idées fondamentales

1. **Un rebond est un signal qu'on classe.** Permanent, transitoire, blocage de politique : chacun appelle une action différente.
2. **On cesse d'écrire à une adresse en échec permanent.** Continuer abîme la réputation.
3. **Les plaintes sont une autre forme de rebond.** Un destinataire qui marque un message comme indésirable le signale au fournisseur de messagerie, qui peut le retransmettre.
4. **L'authentification prouve l'origine, pas la qualité.** Un message authentifié peut rester indésirable, mais un message non authentifié est rarement accepté.
5. **Trois mécanismes complémentaires.** SPF vérifie le serveur d'envoi, DKIM vérifie la signature, DMARC dit quoi faire et exige l'alignement avec le domaine visible.
6. **La réputation est une ressource partagée.** L'envoi d'un tenant peut nuire aux autres, d'où l'isolation par domaine, par flux ou par plage d'adresses.

#### Vocabulaire essentiel

- **Rebond permanent** (*hard bounce*) : échec définitif, par exemple une adresse inexistante.
- **Rebond transitoire** (*soft bounce*) : échec probablement passager, par exemple une boîte pleine.
- **Notification de statut de remise** (*delivery status notification*, *DSN*) : message structuré qui rapporte le sort d'un envoi.
- **Boucle de rétroaction** (*feedback loop*) : service par lequel un fournisseur de messagerie retransmet les plaintes de ses utilisateurs à l'expéditeur.
- **Liste de suppression** (*suppression list*) : adresses à ne plus utiliser.
- **Alignement** (*alignment*) : correspondance entre le domaine de l'adresse visible (`From`) et le domaine authentifié par SPF ou DKIM.
- **Sélecteur** (*selector*) : étiquette qui désigne la clé publique DKIM à utiliser dans le DNS.
- **Réputation d'envoi** (*sender reputation*) : crédit que les fournisseurs de messagerie accordent à un domaine ou à une adresse IP selon son historique.

#### Relations de cause à effet

- Les rebonds permanents ne sont pas traités. L'adresse reste dans les envois, le taux de rebonds monte, et les fournisseurs filtrent même les adresses valides.
- Les rebonds transitoires sont traités comme permanents. Des personnes perdent leurs notifications à la première boîte pleine.
- SPF ou DKIM est absent. Les messages vont en indésirables, ou sont refusés par les grands fournisseurs.
- Le domaine du tenant est utilisé pour l'envoi sans que le tenant l'ait autorisé. Un tiers malveillant peut ensuite l'usurper plus facilement, faute de politique publiée.
- Un tenant envoie en masse depuis le même domaine que les autres. Une campagne mal préparée dégrade la livraison de tous.

#### Idées reçues

- **« Un message accepté par le serveur est un message remis. »** Non. Il peut être filtré, mis en indésirables ou détruit plus tard.
- **« SPF suffit. »** Non. SPF ne vérifie pas l'adresse visible par la personne, ne résiste pas à certains transferts, et ne signe pas le contenu.
- **« DMARC bloque le courrier légitime. »** Pas si la politique est introduite par étapes, en observation d'abord (`p=none`), puis durcie.

#### Principe clé

On traite chaque échec selon sa nature, on prouve l'origine du message par SPF, DKIM et DMARC, et l'on protège la réputation, qui est partagée.

#### Si vous ne retenez que trois choses

1. Un rebond se classe (permanent, transitoire, blocage, plainte) et déclenche une action différente.
2. SPF, DKIM et DMARC prouvent ensemble l'origine, avec un alignement sur l'adresse visible.
3. La réputation d'envoi est partagée : on isole les flux et les domaines, et on cesse d'écrire aux adresses mortes.

### 3. Explication technique détaillée

#### Le vocabulaire des échecs

Un échec se signale à trois niveaux, qui se complètent.

| Niveau | Source | Exemple | Sens |
|---|---|---|---|
| Réponse SMTP | RFC 5321 | `550`, `452` | `4yz` : échec temporaire ; `5yz` : échec permanent, la même demande ne doit pas être répétée |
| Code de statut amélioré | RFC 3463 | `5.1.1`, `4.2.2` | Trois champs `classe.sujet.détail` : classe 2 succès, 4 échec transitoire persistant, 5 échec permanent |
| Notification de statut de remise | RFC 3464 | Message structuré | Action par destinataire : *failed*, *delayed*, *delivered*, *relayed*, *expanded* |

Les codes améliorés sont plus précis que la réponse brute. Par exemple, `5.1.1` signifie « adresse de boîte inexistante » (échec permanent), `4.2.2` « boîte pleine » (échec transitoire persistant), `5.7.1` « remise non autorisée, message refusé » (échec permanent, souvent lié à une politique ou à la réputation).

**Rejet immédiat ou rebond différé.** Le serveur destinataire peut refuser pendant la conversation SMTP (l'adaptateur le voit tout de suite), ou accepter puis renvoyer un message de rebond plus tard. Les deux cas doivent être traités.

#### La décision

| Signal | Classe | Action |
|---|---|---|
| `5.1.1` ou `5.1.2` | Permanent : adresse ou domaine invalide | Mettre l'adresse en suppression, prévenir l'administrateur du tenant |
| `4.2.2` | Transitoire : boîte pleine | Réessayer avec temporisation pendant une durée bornée, puis compter |
| `4.x.x` répété | Transitoire persistant | Après un seuil, suspendre le courriel pour la personne et basculer vers un autre canal |
| `5.7.x` | Blocage de politique ou de réputation | Ne pas réessayer en boucle ; vérifier l'authentification et la réputation |
| Plainte (rapport d'abus) | Plainte | Supprimer l'adresse pour ce flux, enregistrer, enquêter si le taux monte |

Un format normalisé existe pour les plaintes : la RFC 5965 (*An Extensible Format for Email Feedback Reports*, souvent appelée ARF) définit le type `message/feedback-report`, utilisé pour transmettre ces plaintes.

**Exemple de politique.** « Trois rebonds transitoires sur sept jours suspendent le courriel pour la personne et bascule vers l'application. Un rebond permanent supprime l'adresse immédiatement. Un administrateur peut la réactiver après correction. »

#### SPF, DKIM, DMARC

| Mécanisme | Ce qu'il vérifie | Où c'est publié | Spécification |
|---|---|---|---|
| **SPF** | Que le serveur d'envoi est autorisé pour l'identité d'enveloppe (`MAIL FROM`) ou `HELO` | Enregistrement DNS de type TXT du domaine | RFC 7208 |
| **DKIM** | Qu'une signature, produite avec une clé privée du domaine, valide les en-têtes choisis et le corps | Clé publique dans le DNS, sous `sélecteur._domainkey.domaine` | RFC 6376 |
| **DMARC** | Que le domaine de l'adresse visible (`From`) est aligné avec un domaine authentifié par SPF ou DKIM, et applique la politique du propriétaire | Enregistrement TXT sous `_dmarc.domaine` | RFC 9989 (remplace la RFC 7489) |

Le résultat d'une évaluation SPF est l'une des valeurs *pass*, *fail*, *softfail*, *neutral*, *none*, *temperror* et *permerror*. DMARC admet trois politiques, `none` (observer), `quarantine` (traiter comme suspect) et `reject` (refuser), et prévoit des rapports agrégés (RFC 9990) et des rapports d'échec par message (RFC 9991). Les documents plus anciens citent la RFC 7489, aujourd'hui remplacée par la RFC 9989.

```text
alpha-air.example.                   TXT  "v=spf1 include:_spf.mailer.example -all"
s2026._domainkey.alpha-air.example.  TXT  "v=DKIM1; k=rsa; p=<clé publique>"
_dmarc.alpha-air.example.            TXT  "v=DMARC1; p=none; rua=mailto:dmarc@alpha-air.example"
```

**Comment la lire.** La première ligne autorise les serveurs du fournisseur d'envoi, et refuse (`-all`) tous les autres. La deuxième publie la clé qui permet de vérifier les signatures du sélecteur `s2026`. La troisième demande l'observation seule (`p=none`) et l'envoi de rapports agrégés. Ces valeurs sont des exemples.

**L'alignement.** Un message peut réussir SPF avec le domaine du fournisseur d'envoi, sans que ce domaine soit celui de l'adresse visible. DMARC exige que SPF ou DKIM réussisse **avec un domaine aligné** sur l'adresse visible. C'est pourquoi la plateforme signe avec le domaine du tenant (`d=alpha-air.example`), pas seulement avec le sien.

**Mise en place progressive.** On publie d'abord `p=none` avec les rapports, on corrige les sources légitimes oubliées, puis on passe à `quarantine`, enfin à `reject`.

#### La plateforme envoie pour des tenants

| Option | Fonctionnement | Avantage | Risque |
|---|---|---|---|
| Domaine de la plateforme | `"Alpha Air" <notifications@mail.plateforme.example>` | Rien à configurer | Réputation commune ; le tenant n'est pas reconnu comme expéditeur |
| Domaine du tenant | `notifications@alpha-air.example` | Identité propre, alignement | Le tenant doit publier des enregistrements DNS, et la plateforme doit les vérifier |
| Sous-domaine délégué | `mail.alpha-air.example` | Isolation de réputation | Un peu plus de configuration |

Un **assistant de configuration** guide l'administrateur du tenant : publication des enregistrements DNS, vérification automatique, surveillance continue. Un domaine non vérifié n'est pas utilisé comme adresse d'expéditeur : la plateforme se rabat sur son propre domaine, avec le nom du tenant en libellé.

#### La réputation et les exigences des grands fournisseurs

La réputation s'attache à un domaine et à des adresses IP. Une campagne qui provoque beaucoup de plaintes, ou l'envoi vers des adresses mortes, abaisse la réputation de tous les messages qui partent de la même origine.

À titre d'exemple de pratique de marché, un grand fournisseur de messagerie grand public exige depuis le 1er février 2024, des expéditeurs en masse (plus de 5 000 messages par jour vers ses comptes), SPF, DKIM et DMARC, la prise en charge du désabonnement en un clic pour les messages promotionnels ou d'abonnement, et un taux de messages signalés comme indésirables inférieur à 0,30 %, tel que ses outils pour expéditeurs le mesurent. Il demande aussi des clés DKIM d'au moins 1 024 bits, en recommandant 2 048. Ces exigences évoluent : elles se vérifient auprès de chaque fournisseur.

| Mesure | Définition |
|---|---|
| Taux de rebonds permanents | Rebonds permanents divisés par messages envoyés |
| Taux de plaintes | Plaintes divisées par messages remis |
| Part de messages authentifiés | Messages avec SPF ou DKIM aligné, divisés par messages envoyés |

#### Les modes de défaillance

- **Un domaine non authentifié** : une partie des notifications n'arrive jamais, sans que personne l'ait remarqué.
- **Des adresses mortes conservées** : le taux de rebonds monte, la réputation baisse.
- **Un transfert** qui casse SPF : la signature DKIM prend le relais, d'où l'intérêt de DKIM.
- **Une clé DKIM jamais renouvelée** ou une clé trop courte.
- **Une politique `reject` posée trop tôt** : du courrier légitime d'une source oubliée est refusé.

**Contre-exemple.** Une plateforme envoie les courriels de tous ses tenants depuis une seule adresse IP et un seul domaine. Un tenant lance une campagne vers une liste achetée : les plaintes montent, et les notifications critiques de tous les autres tenants arrivent en indésirables.

**Limites.** L'authentification n'empêche pas un message légitime d'être filtré, et les règles des fournisseurs de messagerie ne sont pas toutes publiques. La plateforme réduit les risques ; elle ne les supprime pas, et ne contrôle pas ce que fait le destinataire de ses messages.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison) | L'adaptateur de courriel applique la classification et la suppression |
| [17.6 Consentement, désabonnement et nature des messages](#176-consentement-désabonnement-et-nature-des-messages) | Les messages promotionnels ont leur propre flux, leur consentement et leur désabonnement |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | La limitation de débit protège la réputation |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | La réputation partagée est un cas de voisin bruyant |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés DKIM sont des secrets à protéger et à renouveler |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les envois sont comptés et bornés par tenant |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administrateur gère les domaines d'envoi et leur vérification |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les taux de rebonds et de plaintes alimentent la surveillance |

### 5. Application pratique

**Situation initiale.** Alpha Air envoie des notifications par courriel depuis le domaine de la plateforme. Les responsables qualité signalent que « certains messages n'arrivent pas », et le service informatique de la compagnie demande à ce que les messages portent le domaine `alpha-air.example`.

**Problème.** L'expéditeur est celui de la plateforme, la réputation est partagée, et le tenant ne contrôle pas l'identité d'envoi.

**Application du concept.** Le tenant configure son propre domaine d'envoi, avec authentification complète et une surveillance des rebonds.

**Déroulé.**

1. L'administrateur saisit le domaine dans l'assistant. La plateforme affiche les enregistrements à publier : SPF, deux sélecteurs DKIM, DMARC en observation.
2. Le service informatique publie les enregistrements ; la vérification automatique réussit.
3. Les messages sortent avec `d=alpha-air.example`. Les rapports DMARC agrégés confirment que seule la plateforme envoie pour ce domaine.
4. Deux semaines plus tard, la politique passe à `quarantine`.
5. Une adresse supprimée de l'annuaire produit un rebond `5.1.1` : elle est mise en suppression, et l'administrateur est informé.

**Résultat.** Les messages sont authentifiés et alignés, la réputation du tenant est séparée de celle des autres, et les adresses mortes sortent automatiquement des envois.

**Limites.** Si le service informatique ne publie pas les enregistrements, la plateforme se rabat sur son propre domaine, et les messages restent soumis à sa réputation commune.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un rebond permanent et un rebond transitoire ? Donnez un exemple de chaque.
2. **Compréhension.** Que vérifient SPF, DKIM et DMARC ?
3. **Compréhension.** Qu'est-ce que l'alignement DMARC ?
4. **Pourquoi.** Pourquoi la réputation d'envoi demande-t-elle d'isoler les tenants ?
5. **Raisonnement pratique.** Le taux de rebonds permanents d'un tenant passe de 0,5 % à 6 % en une semaine. Que faites-vous ?

#### Réponses

1. Un rebond permanent est un échec définitif, comme une adresse inexistante (`5.1.1`) : on cesse d'envoyer. Un rebond transitoire est un échec probablement passager, comme une boîte pleine (`4.2.2`) : on réessaie avec temporisation, pendant une durée bornée.
2. SPF vérifie que le serveur d'envoi est autorisé pour le domaine d'enveloppe. DKIM vérifie une signature du message produite avec la clé publiée par le domaine. DMARC applique la politique du propriétaire du domaine et exige que l'un des deux réussisse avec un domaine aligné sur l'adresse visible.
3. C'est la correspondance entre le domaine de l'adresse `From` visible et le domaine authentifié par SPF ou par DKIM. Sans alignement, la réussite de SPF ou de DKIM ne prouve rien sur l'adresse que le destinataire voit.
4. Parce que les fournisseurs de messagerie jugent un domaine ou une adresse IP globalement. Les envois d'un tenant qui provoquent plaintes ou rebonds dégradent la livraison de tous ceux qui partagent l'origine.
5. Vérifier si une importation récente a introduit des adresses invalides, appliquer la suppression immédiate des rebonds permanents, suspendre les envois non critiques du tenant le temps d'un nettoyage, informer l'administrateur, et contrôler l'authentification et les plaintes. Un taux élevé non traité compromet la réputation de tous.

## 17.6 Consentement, désabonnement et nature des messages

### 1. Comprendre simplement

Un **message transactionnel** (*transactional message*) est un message nécessaire à l'exécution du service que la personne utilise : réinitialisation d'un mot de passe, activité assignée, demande d'approbation, facture. Un **message marketing** (*marketing message*) promeut un produit, une offre ou une actualité. Cette **nature** détermine le régime : faut-il un **consentement** (*consent*) et un moyen de se **désabonner** (*unsubscribe*), dans quel flux d'envoi le message part, et la personne peut-elle le couper.

**Pourquoi cela existe.** Les personnes ont le droit de maîtriser les communications promotionnelles, et la loi l'impose dans de nombreux pays. Les fournisseurs de messagerie imposent aussi des moyens de désabonnement aux expéditeurs en masse. Mélanger les natures produit deux dérives : des messages indispensables manqués parce que les personnes se désabonnent de tout, ou de la publicité glissée dans des messages de service.

**Problème résolu.** Traiter chaque message selon sa nature, respecter les choix des personnes, et garder la preuve de ce qu'elles ont accepté.

**Modèle mental.** Le relevé de compte et le prospectus. Une mention « pas de publicité » sur la boîte aux lettres arrête les prospectus, pas le relevé.

**Où l'analogie s'arrête.** Un autocollant est grossier. Un consentement est précis (par finalité), daté, prouvable et retirable. La frontière entre information de service et promotion dépend du contenu et de la juridiction, pas seulement de l'intention.

**Exemple.** La plateforme envoie à Nadia : une notification d'activité assignée (service), une alerte de connexion suspecte (sécurité), et une lettre d'information sur les nouveautés du produit (marketing). Elle se désabonne de la troisième en un clic, et continue de recevoir les deux premières.

**Les composants.**

1. une **classification** des types de messages par nature ;
2. des **flux d'envoi** séparés pour chaque nature ;
3. un **registre de consentements** avec preuve ;
4. un **mécanisme de désabonnement** simple, sans connexion ;
5. des **en-têtes** de désabonnement en un clic ;
6. une **liste de suppression** respectée par tous les envoyeurs ;
7. une **répartition des responsabilités** entre plateforme et tenant.

**Objectif d'apprentissage :** vous pouvez classer un message par nature, décrire ce qu'un consentement valable doit pouvoir démontrer, et expliquer comment fonctionne un désabonnement en un clic.

### 2. Connaissances essentielles

#### Définition

- **Message transactionnel** (ou **opérationnel**) : message nécessaire à l'exécution du service demandé par la personne ou à sa sécurité, indépendant de toute promotion.
- **Message marketing** : message dont le but est de promouvoir un produit, un service ou une offre, ou d'entretenir la relation commerciale.
- **Consentement** : manifestation de volonté libre, spécifique, éclairée et univoque, par laquelle une personne accepte de recevoir une catégorie de messages, enregistrée avec ses preuves.
- **Désabonnement** : acte par lequel la personne cesse de recevoir une catégorie de messages, par un moyen aussi simple que celui qui a servi à s'abonner.

#### Idées fondamentales

1. **La nature d'un message se juge à son but et à son contenu.** Ni le canal ni la mise en forme ne la changent.
2. **Les messages de service restent bornés.** On n'y glisse pas de promotion : elle en ferait un message marketing.
3. **Le marketing exige un consentement ou une autre base reconnue.** Il demande aussi un moyen de désabonnement facile.
4. **Un consentement se démontre.** On sait qui a consenti, à quoi, quand, avec quel texte, et par quel moyen.
5. **Un désabonnement s'applique vite, sans connexion, à la bonne portée.** Une catégorie, pas tout, sauf demande explicite.
6. **En B2B, deux responsables.** La plateforme répond de ses communications au titre de son produit, le tenant de ses communications internes.

#### Vocabulaire essentiel

- **Message transactionnel ou marketing** (*transactional versus marketing message*) : distinction de nature qui détermine le régime applicable à un message.
- **Désabonnement et consentement** (*unsubscribe and consent*) : couple de mécanismes par lequel la personne accorde, puis retire, son accord pour une catégorie de messages.
- **Adhésion** (*opt-in*) : choix actif d'une personne pour recevoir une catégorie de messages.
- **Retrait** (*opt-out*) : choix actif de ne plus la recevoir.
- **Double adhésion** (*double opt-in*) : adhésion confirmée par un second acte, par exemple en cliquant un lien reçu à l'adresse.
- **Preuve de consentement** (*consent record*) : enregistrement de ce qui a été accepté, quand et comment.
- **Base légale** (*lawful basis*) : fondement qui autorise un traitement de données (consentement, exécution du contrat, intérêt légitime, etc.).
- **Désabonnement en un clic** (*one-click unsubscribe*) : désabonnement par une seule requête, déclenchée depuis le client de messagerie.
- **Flux d'envoi** (*sending stream*) : chemin technique, avec ses domaines et ses adresses, propre à une nature de messages.

#### Relations de cause à effet

- Un message de service contient une bannière promotionnelle. Il devient un message marketing, avec les obligations qui s'y attachent, et peut être signalé comme indésirable.
- Le lien de désabonnement exige de se connecter. Les personnes cliquent « indésirable » à la place, et la réputation d'envoi baisse.
- Le désabonnement d'une catégorie désabonne de tout. Les personnes perdent des messages utiles.
- Le registre de consentement ne garde pas de preuve. Il est impossible de démontrer un accord en cas de contestation.
- La liste de suppression est propre à chaque système d'envoi. Un message part par une autre voie vers une personne qui s'est désabonnée.

#### Idées reçues

- **« Un message de service n'a aucune règle. »** Non. Il doit rester dans son rôle, être sûr et respecter les choix de canal.
- **« Le consentement se déduit de l'inscription au service. »** Non. Il se demande séparément, pour une finalité précise, et il se démontre (voir les repères juridiques plus bas).
- **« Se désabonner, c'est quitter le service. »** Non. Le désabonnement porte sur une catégorie de messages, pas sur l'usage du produit.

#### Principe clé

La nature d'un message décide de son régime ; le consentement se démontre, le désabonnement est aussi facile que l'adhésion, et les flux d'envoi sont séparés.

#### Si vous ne retenez que trois choses

1. Un message se classe par sa nature (sécurité, service, information, marketing), et chaque nature suit son régime.
2. Le consentement est précis, daté, prouvable et retirable aussi facilement qu'il est donné.
3. Le désabonnement se fait en un clic, sans connexion, à la bonne portée, et vaut pour tous les systèmes d'envoi.

### 3. Explication technique détaillée

#### La classification des messages

| Catégorie | Exemple | Consentement | Désabonnement | Flux d'envoi | La personne peut-elle le couper ? |
|---|---|---|---|---|---|
| Sécurité et obligation | Connexion suspecte, avis légal | Sans objet (cadre du service) | Non | Transactionnel | Non |
| Opérationnel du travail | Activité assignée, approbation demandée | Sans objet (cadre du service) | Par les préférences (canaux), pas par désabonnement | Transactionnel | Le canal oui, le type obligatoire non |
| Information du tenant | Annonce interne | Selon la politique du tenant | Par les préférences | Transactionnel, au nom du tenant | Oui |
| Marketing du fournisseur | Lettre d'information du produit | **Oui** | **Oui, en un clic** | Marketing, séparé | Oui |

Cette grille est un repère de conception, pas un avis juridique : la qualification d'un message dépend de son contenu et de la juridiction.

#### Les repères juridiques

Ces repères viennent de l'Union européenne. D'autres pays ont des règles différentes, et la mise en œuvre se vérifie avec un conseil juridique.

| Texte | Ce qu'il impose, en résumé |
|---|---|
| RGPD, article 7 | Le responsable doit pouvoir démontrer le consentement (§1) ; la demande est clairement distincte des autres sujets (§2) ; la personne peut retirer son consentement à tout moment, aussi facilement qu'elle l'a donné (§3) |
| RGPD, article 21, §2 et §3 | La personne peut s'opposer à tout moment au traitement à des fins de prospection ; après opposition, ses données ne sont plus traitées à cette fin |
| Directive 2002/58/CE (vie privée et communications électroniques), article 13 | Le courrier électronique de prospection exige en principe le consentement préalable (§1) ; un client existant peut recevoir des offres pour des produits similaires, à condition de pouvoir s'opposer, gratuitement et simplement, lors de la collecte puis à chaque message (§2) |

#### Un registre de consentements

```json
{
  "consent_id": "cns_01HZY2",
  "person": "u_nadia",
  "purpose": "product_newsletter",
  "status": "given",
  "given_at": "2026-09-02T09:14:00Z",
  "evidence": { "channel": "web_form", "text_version": "v3", "form": "newsletter_signup" },
  "withdrawn_at": null
}
```

**Comment la lire.** Chaque consentement est lié à une **finalité** précise (`product_newsletter`), pas à « tous les messages ». Il garde la version du texte accepté et le moyen utilisé. Le retrait ne détruit pas l'enregistrement : il le complète (`withdrawn_at`), car la preuve de l'accord et de son retrait doit rester disponible.

#### Le désabonnement

1. **Un lien** dans le pied du message, qui identifie la personne et la catégorie par un jeton signé, sans connexion.
2. **Une page de confirmation** claire, qui dit ce qui est arrêté et ce qui continue (« Les notifications de travail ne sont pas concernées »).
3. **Un traitement idempotent** : cliquer deux fois a le même effet.
4. **Une propagation rapide** à tous les systèmes d'envoi, par la liste de suppression.
5. **Un journal** de la demande, avec l'heure.

**Le désabonnement en un clic.** Le message porte deux en-têtes, définis par les RFC 2369 et 8058 :

```text
List-Unsubscribe: <https://notifications.plateforme.example/u/8d2f...>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

Le client de messagerie affiche alors un bouton « Se désabonner ». Un clic provoque une requête **HTTPS POST** vers l'adresse, avec le corps `List-Unsubscribe=One-Click`. La RFC 8058 impose que le message soit signé par DKIM, avec ces deux en-têtes dans la signature, et que la requête ne passe ni par une redirection ni par des cookies. L'adresse contient un jeton opaque, qui permet de traiter la demande sans session.

Les grands fournisseurs de messagerie en font une exigence pour les messages promotionnels des expéditeurs en masse, avec un lien de désabonnement visible dans le corps du message (voir [17.5 Rebonds et authentification du courriel](#175-rebonds-et-authentification-du-courriel)).

#### Les flux séparés

| Flux | Domaine ou sous-domaine | Contenu | Raison |
|---|---|---|---|
| Transactionnel | `mail.plateforme.example` | Service, sécurité, activités | Doit arriver, ne partage pas la réputation du marketing |
| Marketing | `news.plateforme.example` | Actualités du produit | Peut subir plaintes et désabonnements sans nuire au service |

**Au nom du tenant.** Les messages qu'un tenant envoie à ses propres utilisateurs (annonces internes) sont ses communications. Le tenant décide de leur contenu, et répond de leur régime. La plateforme fournit les outils : suppression, désabonnement par catégorie, flux séparé.

#### Les modes de défaillance

- **Un consentement implicite** : une inscription au service vaut abonnement à la lettre d'information.
- **Un désabonnement lent** : des messages partent encore plusieurs jours après la demande.
- **Une liste de suppression non partagée** : un système tiers continue d'envoyer.
- **Un lien de désabonnement imprévisible** : le jeton est trop simple, et un tiers désabonne d'autres personnes.
- **Des catégories trop grossières** : une seule case « notifications » pour tout.

**Contre-exemple.** Une plateforme ajoute, au bas de chaque courriel de notification, un encart « Découvrez notre nouvelle offre ». Les messages de service deviennent promotionnels ; les personnes se plaignent, et la réputation d'envoi des notifications critiques baisse.

**Limites.** Cette entrée décrit des mécanismes, pas le droit. Les exigences varient selon les pays, la nature de la relation, et le type de destinataire (particulier, salarié, entreprise). La qualification d'un message et la base légale se décident avec un conseil juridique et, pour les données personnelles, avec le responsable de la protection des données du tenant.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | Y est posée la règle : messages de sécurité et de transaction non optionnels, promotionnels avec consentement et désabonnement |
| [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification) | Les préférences règlent canaux et catégories ; le consentement gouverne le marketing |
| [17.5 Rebonds et authentification du courriel](#175-rebonds-et-authentification-du-courriel) | Les flux séparés protègent la réputation ; la liste de suppression est commune |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | Les limites et les heures calmes s'appliquent aussi aux messages marketing |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le consentement et son retrait sont tracés |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les envois marketing sont comptés par flux |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administrateur voit et gère les domaines et flux d'envoi |

### 5. Application pratique

**Situation initiale.** La plateforme envoie une lettre d'information produit à tous ses utilisateurs, en s'appuyant sur le fait qu'ils ont un compte. Des utilisateurs s'en plaignent, et certains la signalent comme indésirable.

**Problème.** Aucun consentement n'est enregistré, le lien de désabonnement exige une connexion, et la lettre part par le même flux que les notifications de travail.

**Application du concept.** Trois changements : séparer les flux, recueillir des consentements précis, et fournir un désabonnement en un clic.

**Déroulé.**

1. La plateforme crée un flux marketing sur un sous-domaine dédié.
2. Les nouveaux inscrits voient une case non cochée « Recevoir les nouveautés du produit », avec le texte exact. L'accord est enregistré avec la version du texte.
3. Les utilisateurs existants reçoivent une demande de consentement dans l'application. Sans réponse, ils ne reçoivent pas la lettre.
4. Chaque envoi porte les en-têtes de désabonnement en un clic et un lien visible.
5. Nadia clique « Se désabonner » dans son client de messagerie : une requête POST est envoyée, l'adresse est ajoutée à la liste de suppression du flux, et sa notification d'activité continue d'arriver.

**Résultat.** Les consentements sont démontrables, le désabonnement est immédiat et ne touche pas les notifications de travail, et la réputation du flux de service est préservée.

**Limites.** Le tenant d'Alpha Air envoie ses propres annonces internes. Il lui revient de décider si une annonce est opérationnelle ou promotionnelle pour ses salariés, et de répondre de ce choix.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Donnez un exemple de message transactionnel, un de message opérationnel de travail et un de message marketing.
2. **Compréhension.** Que doit pouvoir démontrer un registre de consentements ?
3. **Compréhension.** Comment fonctionne un désabonnement en un clic ?
4. **Pourquoi.** Pourquoi sépare-t-on les flux d'envoi de service et de marketing ?
5. **Raisonnement pratique.** Un responsable commercial veut ajouter une offre promotionnelle en pied des notifications d'activités. Que répondez-vous ?

#### Réponses

1. Transactionnel (sécurité) : alerte de connexion suspecte. Opérationnel du travail : activité assignée ou demande d'approbation. Marketing : lettre d'information présentant les nouveautés du produit.
2. Qui a consenti, à quelle finalité précise, à quelle date, avec quelle version du texte, par quel moyen, et si le consentement a été retiré (avec sa date). La preuve de l'accord et du retrait reste disponible.
3. Le message porte les en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post`. Le client de messagerie affiche un bouton ; un clic envoie une requête HTTPS POST à l'adresse indiquée, qui identifie la personne par un jeton, sans connexion. Le message doit être signé par DKIM, en-têtes compris.
4. Parce que leur régime et leur réputation diffèrent. Les plaintes et les désabonnements du marketing ne doivent pas faire baisser la livraison des notifications de service, qui doivent arriver.
5. Refuser : l'encart transformerait des messages de service en messages marketing, avec les obligations de consentement et de désabonnement, et risquerait d'abaisser la réputation d'envoi. L'offre peut passer par le flux marketing, aux personnes qui ont consenti.

## 17.7 Limitation, résumé périodique et heures calmes

### 1. Comprendre simplement

La **limitation** (*throttling*) plafonne le nombre de notifications qu'une personne, un type ou un tenant reçoit sur une période. Le **résumé périodique** (*digest*) regroupe en un seul message ce qui s'est passé pendant une période (« votre journée »). Les **heures calmes** (*quiet hours*) sont des plages pendant lesquelles on évite d'interrompre la personne : les messages non urgents attendent la fin de la plage. Le plan les range sous un même titre, *throttling and digest* et *quiet hours*, car ce sont trois façons de **décider quand et combien** on interrompt.

**Pourquoi cela existe.** L'attention humaine est limitée, et chaque interruption a un coût. Passé quelques dizaines de messages par jour, une personne ne lit plus rien, y compris l'important (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)). Les fournisseurs de canaux ont aussi des plafonds, et les personnes ont des horaires : on ne réveille pas quelqu'un à trois heures du matin pour une information.

**Problème résolu.** Préserver l'attention et le repos, sans jamais retenir ce qui est urgent.

**Modèle mental.** Une secrétaire qui filtre : « Je vous passe les appels urgents tout de suite, je vous résume les autres à 17 h, et après 20 h plus rien, sauf incendie. »

**Où l'analogie s'arrête.** La secrétaire juge au cas par cas, et personne ne lui demande ses raisons. Le service applique des règles déclarées, et il doit pouvoir dire ce qu'il a retenu, différé ou regroupé, et pourquoi.

**Exemple.** Hugo, responsable qualité, recevait 40 courriels par jour sur les constats. Avec la limitation, le regroupement et un résumé quotidien à 17 h, il reçoit trois interruptions et un résumé. Entre 20 h et 7 h 30, seules les alertes critiques le joignent.

**Les composants.**

1. une **classification d'urgence** qui décide de ce qui traverse ;
2. des **plafonds** par destinataire, par type, par canal et par tenant ;
3. une **politique de débordement** : différer, regrouper ou supprimer ;
4. un **tampon de résumé** par personne et par fenêtre ;
5. un **planificateur** de résumés, idempotent ;
6. des **plages de calme** et leurs exceptions ;
7. le **fuseau horaire** et le calendrier du destinataire.

**Objectif d'apprentissage :** vous pouvez décider, pour une notification donnée, si elle part tout de suite, attend ou entre dans un résumé, et expliquer pourquoi un résumé se calcule à l'envoi.

### 2. Connaissances essentielles

#### Définition

- **Limitation** : plafonnement du nombre de notifications délivrées à un destinataire, pour un type ou un canal, sur une période, avec une politique pour le surplus.
- **Résumé périodique** : message unique, produit à échéance régulière, qui regroupe les notifications non urgentes d'une période et les présente de façon ordonnée.
- **Heures calmes** : plages définies par la personne, le tenant ou l'équipe pendant lesquelles les notifications non urgentes ne sont pas remises, mais différées.

#### Idées fondamentales

1. **L'urgence décide de ce qui traverse.** Une alerte critique ou une obligation ne subit ni plafond, ni heures calmes.
2. **Limiter, c'est choisir quoi faire du surplus.** On diffère, on regroupe ou l'on supprime, mais on ne perd jamais en silence.
3. **Un résumé se calcule à l'envoi.** Ce n'est pas une pile de messages retardés : il exclut ce qui est déjà traité et regroupe ce qui reste.
4. **Les heures calmes dépendent du fuseau et du calendrier de la personne.** Elles ne sont pas des heures du serveur.
5. **Les exceptions sont explicites.** Critique, astreinte, escalade : la règle les nomme.
6. **Ce qui est retenu reste consultable.** Le fil dans l'application garde tout, sans alerte.

#### Vocabulaire essentiel

- **Seuil** (*threshold*) : nombre maximal de notifications par période.
- **Seau de jetons** (*token bucket*) : algorithme qui accorde des jetons à un rythme fixe, chaque notification en consommant un (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).
- **Débordement** (*overflow*) : dépassement du seuil.
- **Tampon** (*buffer*) : zone qui retient les notifications destinées à un résumé.
- **Clé de regroupement** (*grouping key*) : valeur qui rapproche des notifications semblables (sujet, type).
- **Fin de plage** (*end of quiet window*) : instant où les messages différés sont remis.
- **Astreinte** (*on-call*) : permanence qui traverse les heures calmes pour les alertes qui la concernent (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).
- **Ne pas déranger** (*do not disturb*) : sourdine manuelle et temporaire, plus courte qu'une plage planifiée.

#### Relations de cause à effet

- Aucune limitation n'existe. Un incident produit des centaines de messages en une minute, et personne ne lit le premier, qui était le bon.
- La limitation supprime le surplus sans le dire. Une information importante disparaît parmi les messages supprimés.
- Les résumés répètent ce qui a déjà été traité. Les personnes cessent de les ouvrir.
- Les heures calmes utilisent le fuseau du serveur. Une personne basée à Lyon est réveillée à 4 h du matin.
- Tous les résumés partent à 8 h pile. La charge se concentre, et les fournisseurs limitent le débit.

#### Idées reçues

- **« Un résumé, c'est juste un message retardé. »** Non. Il est calculé à l'envoi, regroupé, trié, et il omet ce qui n'est plus d'actualité.
- **« Les heures calmes, c'est le silence total. »** Non. Les alertes critiques et les astreintes les traversent, par règle déclarée.
- **« La limitation sert à économiser le coût d'envoi. »** Non. Elle sert d'abord à protéger l'attention et la réputation d'envoi.

#### Principe clé

Chaque notification subit la même décision : traverser, attendre ou entrer dans un résumé. Cette décision dépend de l'urgence, du plafond et de la plage de calme du destinataire, et elle est toujours expliquée.

#### Si vous ne retenez que trois choses

1. L'urgence détermine ce qui traverse limites et heures calmes ; le reste est différé, regroupé ou résumé, jamais perdu en silence.
2. Un résumé est calculé à l'envoi, dans le fuseau du destinataire, et ne répète pas ce qui est traité.
3. Les plafonds et les plages s'appliquent par personne, par type et par tenant, avec des exceptions explicites.

### 3. Explication technique détaillée

#### La décision pour une notification

```text
notification prête
   ├─ urgence critique ou type obligatoire ─────────────► remise immédiate
   └─ sinon
        ├─ plafond atteint ? ─── oui ──────────────────► entrée dans le résumé
        └─ non
             ├─ plage de calme en cours ? ─ oui ───────► différée à la fin de plage (sauf astreinte)
             └─ non ──► urgence faible ? ─ oui ────────► entrée dans le résumé
                                        └ non ─────────► remise immédiate
```

| Urgence | Plage de calme | Plafond atteint | Décision |
|---|---|---|---|
| Critique ou obligatoire | Indifférent | Indifférent | Remise immédiate |
| Élevée | Oui | Non | Différée à la fin de plage, sauf astreinte |
| Élevée | Non | Non | Remise immédiate |
| Normale | Non | Non | Remise immédiate dans l'application, résumé pour le courriel |
| Normale ou faible | Indifférent | Oui | Entrée dans le résumé |
| Faible | Indifférent | Non | Résumé, ou boîte de réception seule |

```typescript
type Decision =
  | { action: "deliver_now"; reason: string }
  | { action: "defer_until"; until: Instant; reason: string }
  | { action: "add_to_digest"; reason: string };

function decide(n: Notification, who: RecipientContext, now: Instant): Decision {
  if (n.urgency === "critical" || n.mandatory) {
    return { action: "deliver_now", reason: "critical_or_mandatory" };
  }
  if (who.limits.exceeded(n)) {
    return { action: "add_to_digest", reason: "rate_limit" };
  }
  const quiet = who.quietHours.windowAt(now);
  if (quiet !== null && !who.onCall) {
    return { action: "defer_until", until: quiet.end, reason: "quiet_hours" };
  }
  if (n.urgency === "low") {
    return { action: "add_to_digest", reason: "low_urgency" };
  }
  return { action: "deliver_now", reason: "normal" };
}
```

**Comment la lire.** L'ordre des tests est la règle : l'urgence passe avant tout, puis le plafond, puis la plage de calme. Chaque décision porte une `reason` qui est enregistrée avec la notification, pour que la personne et l'administrateur sachent pourquoi un message a été retenu (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### La limitation

| Dimension | Exemple de plafond | Ce qu'elle protège |
|---|---|---|
| Par destinataire et par canal | 5 notifications mobiles par heure | L'attention de la personne |
| Par type et par sujet | 1 notification par 10 minutes pour le même constat | Les rafales d'un événement répété |
| Par tenant | Quota mensuel de messages (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) | Le coût et la réputation d'envoi |
| Par fournisseur | Débit autorisé par le fournisseur | Le rejet par le fournisseur |

Le **seau de jetons** convient bien : il autorise des rafales courtes et borne le débit moyen. Avec une capacité $b$ et un rythme de recharge $r$, le nombre de notifications admises sur une durée $t$ est au plus

$$N(t) \leq b + r \times t$$

où $b$ est le nombre de jetons du seau plein et $r$ le nombre de jetons ajoutés par unité de temps.

**Exemple chiffré.** Avec $b = 5$ et $r = 1$ jeton toutes les 10 minutes (soit 6 par heure), une personne peut recevoir 5 notifications immédiates, puis une par tranche de 10 minutes. Sur une heure, au plus $5 + 6 = 11$ notifications passent. Le surplus part dans le résumé.

**Politique de débordement.**

| Politique | Effet | Quand |
|---|---|---|
| Différer | La notification attend un jeton, avec une durée de vie | Information utile, sans urgence |
| Regrouper | « +7 autres constats » dans une notification | Événements de même sujet ou de même type |
| Supprimer | Aucun envoi, une trace seulement | Faible valeur, doublon avéré |

On ne supprime jamais une obligation, une alerte critique ni une décision attendue. Chaque suppression est comptée et visible dans les mesures.

#### Le résumé périodique

Un résumé se prépare en trois temps.

1. **Collecter.** Chaque notification retenue est écrite dans un tampon, identifié par `(destinataire, fenêtre)`.
2. **Planifier.** Un job unique par destinataire et par fenêtre, avec une clé d'idempotence du type `digest:2026-10-13:u_hugo`, se déclenche à l'heure locale choisie, avec un décalage aléatoire pour étaler la charge (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).
3. **Composer.** À l'envoi, le résumé relit l'état de chaque élément : ce qui est traité, annulé ou obsolète en est retiré. Les éléments restants sont regroupés par catégorie ou par sujet, triés par priorité et par échéance, et plafonnés (« +12 autres »).

Un résumé vide n'est pas envoyé.

**Les résumés de travail.** Un résumé peut aussi porter les éléments de travail qui arrivent à échéance, en tête, avant les simples informations. C'est le cas du « votre journée » décrit dans l'[étude dédiée](../etudes/activity-center-notification-center.md).

#### Les heures calmes

```json
{
  "quiet_hours": [
    { "days": ["mon", "tue", "wed", "thu", "fri"], "start": "20:00", "end": "07:30" },
    { "days": ["sat", "sun"], "start": "00:00", "end": "23:59" }
  ],
  "timezone": "Europe/Paris",
  "exceptions": ["critical", "on_call"]
}
```

**Comment la lire.** La plage de semaine traverse minuit : elle commence à 20 h le soir et finit à 7 h 30 le lendemain. Le fuseau est celui de la **personne**, pas celui du serveur. Le week-end, tout le jour est calme, sauf les exceptions nommées.

| Sujet délicat | Règle |
|---|---|
| Plage qui traverse minuit | Évaluer l'instant dans le fuseau, en regardant la plage de la veille et celle du jour |
| Changement d'heure | Calculer par le fuseau, pas en ajoutant des heures (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Déplacement de la personne | Suivre le fuseau du profil, qu'elle peut changer, plutôt que celui de l'appareil |
| Fin de plage | Remettre les messages différés avec un étalement, pour éviter la rafale de 7 h 30 |
| Astreinte | L'alerte destinée à la personne d'astreinte traverse (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) |

**Valeurs par défaut.** Le tenant fixe des heures calmes par défaut (la nuit locale de l'établissement). La personne peut les restreindre ou les étendre dans les limites de la politique (voir [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)).

#### Les mesures

| Mesure | Question |
|---|---|
| Part des notifications retenues par motif (plafond, plage, faible urgence) | La limitation travaille-t-elle trop ? |
| Taux d'ouverture et d'action des résumés | Les résumés servent-ils ? |
| Délai entre le fait et la remise, par urgence | L'urgent traverse-t-il vraiment ? |
| Pic de remises à la fin d'une plage | La charge est-elle étalée ? |

#### Les modes de défaillance

- **Une urgence mal classée** : une alerte importante est placée dans le résumé du soir.
- **Un résumé qui fait doublon** : il répète des éléments déjà traités.
- **Une rafale à la fin de plage** : tous les messages différés partent à 7 h 30.
- **Un fuseau erroné** : une personne est réveillée, ou n'est pas alertée en journée.
- **Une clé de limitation trop large** : le second incident, distinct, est supprimé avec le premier.

**Contre-exemple.** Une plateforme limite à « 10 notifications par jour » sans distinguer l'urgence. Le onzième message est supprimé : c'est la demande d'approbation d'un constat critique, restée sans réponse.

**Limites.** Aucune règle ne remplace le jugement des personnes. Un résumé trop long n'est pas lu, des heures calmes trop larges retardent des informations utiles, et une limite trop basse se contourne par des canaux informels. On mesure, et on ajuste.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.10 Notifications](12-produit-ux.md#1210-notifications) | Y sont posés le regroupement, la déduplication, la limitation et les heures calmes |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | L'algorithme du seau de jetons y est détaillé |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les résumés sont des jobs planifiés, idempotents, étalés |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Fuseaux, changements d'heure et calendriers |
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | L'astreinte traverse les heures calmes |
| [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification) | Les modes « résumé » et les heures calmes sont des préférences |
| [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison) | La suppression et la durée de vie se décident à cet endroit |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Le quota de messages par tenant |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Le résumé de travail met en tête les éléments à échéance |

### 5. Application pratique

**Situation initiale.** Hugo, responsable qualité de la base LYS, reçoit 40 courriels par jour sur les constats. Une nuit, un incident de capteur produit 120 notifications en vingt minutes. Il en lit trois. Le lendemain, un constat critique est resté dix-neuf heures sans décision.

**Problème.** Tout a la même importance, le même canal, et arrive à toute heure.

**Application du concept.** Le tenant définit des urgences, un plafond, un résumé et des heures calmes.

**Déroulé.**

1. Les constats critiques sont classés « élevée » et traversent plafond et résumé.
2. Les constats normaux sont regroupés par aéronef dans le résumé de 17 h.
3. Le plafond est fixé à 5 notifications mobiles par heure, avec un seau de jetons.
4. Les heures calmes sont 20 h – 7 h 30, avec l'astreinte qualité en exception.
5. Pendant l'incident de capteur, les 120 notifications se regroupent en une seule : « 120 mesures hors plage sur LYS ».

**Résultat.** Hugo reçoit trois interruptions par jour, toutes actionnables, et un résumé. La nuit, seules les alertes critiques le joignent, et le matin il retrouve les informations différées dans l'application.

**Limites.** Si l'urgence d'un type est mal classée, un message important peut dormir dans le résumé. Le taux d'action par type, mesuré chaque mois, sert à détecter ces erreurs.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fait-on d'une notification qui dépasse le plafond ?
2. **Compréhension.** Pourquoi les heures calmes utilisent-elles le fuseau de la personne ?
3. **Compréhension.** Pourquoi un résumé ne se compose-t-il pas à l'avance ?
4. **Pourquoi.** Pourquoi les alertes critiques traversent-elles limitation et heures calmes ?
5. **Raisonnement pratique.** Avec un seau de 5 jetons rechargé de 1 jeton par 10 minutes, combien de notifications au plus passent en 30 minutes ?

#### Réponses

1. On la diffère, on la regroupe dans le résumé, ou, pour un contenu de faible valeur, on la supprime avec une trace. On ne supprime jamais une obligation, une alerte critique ni une décision attendue.
2. Parce que l'interruption dépend de l'heure vécue par la personne. Un calcul dans le fuseau du serveur la réveillerait la nuit ou la laisserait sans alerte le jour.
3. Parce que l'état des éléments change entre le fait et l'envoi : certains sont traités, annulés ou devenus obsolètes. Composer à l'envoi évite de répéter ce qui n'est plus d'actualité.
4. Parce que leur valeur tient à leur rapidité : une alerte différée peut être inutile ou dangereuse. La limitation et les heures calmes protègent l'attention, mais pas au prix d'une information critique manquée.
5. $N \leq b + r \times t = 5 + 1 \times 3 = 8$ notifications au plus : cinq immédiates, puis une par tranche de 10 minutes, soit trois de plus en 30 minutes.

## 17.8 Élément de travail et boîte de tâches

### 1. Comprendre simplement

Un **élément de travail** (*work item*) est la forme normalisée de « ce qui attend quelqu'un », quelle qu'en soit l'origine : une tâche de workflow, une ressource affectée, une obligation calculée, un rappel personnel. La **boîte de tâches** (*task inbox*, aussi appelée *worklist*) est la vue unifiée, par personne et par groupe, de ces éléments : ce que j'ai à faire, et ce que je peux prendre.

**Pourquoi cela existe.** Sans unification, une personne cherche son travail dans cinq écrans : les approbations dans un module, la maintenance dans un autre, les rappels par courriel. Les responsables ne voient pas la charge, et les retards passent inaperçus. Sans normalisation, chaque module réinvente ses listes, ses filtres et ses compteurs.

**Problème résolu.** Offrir une file unique et cohérente, filtrée par les droits, où chacun sait ce qu'il doit traiter ensuite.

**Modèle mental.** La bannette d'un chef de poste. Les dossiers viennent de services différents, mais arrivent dans une même corbeille, classés par urgence. Chacun garde sa version d'origine dans son service.

**Où l'analogie s'arrête.** Une bannette contient les dossiers. La boîte de tâches contient des **références** vers des dossiers qui restent chez leurs propriétaires, et dont l'état se met à jour tout seul. Elle sert aussi à agir, pas seulement à consulter.

**Exemple.** Karim, technicien de la base LYS, ouvre sa boîte : deux inspections qui lui sont affectées (ressources `maintenance_task`), une revue à prendre dans le pool des techniciens (tâche de workflow), un rappel qu'il s'est créé. Sophie, responsable qualité, y trouve des constats à approuver et des tâches « à vérifier ». Les deux boîtes ont la même forme, et contiennent des choses différentes.

**Les composants.**

1. des **sources de travail** déclarées par le tenant ;
2. une **projection** qui produit des éléments normalisés ;
3. un **propriétaire** ou un **groupe éligible** pour chaque élément ouvert ;
4. un **état simple**, dérivé de la source ;
5. des **vues** (mes éléments, à prendre, en retard) ;
6. des **capacités** par élément, calculées par la source ;
7. des **compteurs** cohérents avec les vues.

**Objectif d'apprentissage :** vous pouvez décrire les champs d'un élément de travail, expliquer en quoi la boîte de tâches est une projection, et dire pourquoi un élément ouvert a toujours un responsable ou un groupe.

### 2. Connaissances essentielles

#### Définition

- **Élément de travail** : enregistrement normalisé qui référence une unité de travail ou de décision attendue d'une personne ou d'un groupe, avec un état, une échéance éventuelle, une priorité et une issue, la vérité restant dans la source.
- **Boîte de tâches** : vue unifiée et filtrée par les droits des éléments de travail ouverts qui concernent une personne, directement ou par les groupes dont elle fait partie.

#### Idées fondamentales

1. **Un élément référence, il ne remplace pas.** La ressource, le workflow ou la règle restent la source de vérité.
2. **La forme est normalisée.** Les mêmes champs décrivent toutes les sources, pour que listes, filtres et compteurs soient uniques.
3. **Un élément ouvert a un responsable ou un groupe éligible.** Jamais ni l'un ni l'autre : ce serait un orphelin (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).
4. **L'état est simple et dérivé.** Ouvert, en cours, clos, avec une raison de clôture ; il suit la source, il ne la contredit pas.
5. **La boîte est une projection filtrée par les droits.** Un élément n'apparaît que si la personne peut le voir et s'en occuper.
6. **Les actions se délèguent à la source.** La boîte ne contient aucune règle métier propre.

#### Vocabulaire essentiel

- **Source de travail** (*work source*) : déclaration d'une ressource ou d'un workflow qui alimente la boîte.
- **Projection** (*projection*) : modèle de lecture produit à partir d'événements (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)).
- **Pool** (*pool*) : groupe éligible, défini par un rôle et un périmètre.
- **Élément orphelin** (*orphan item*) : élément ouvert sans responsable ni groupe éligible.
- **Raison de clôture** (*closing reason*) : terminé, annulé, expiré ou remplacé.
- **Capacité** (*capability*) : action qu'une personne peut effectuer sur un élément, calculée par la source (voir [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)).
- **Éléments à prendre** (*available items*) : éléments d'un pool que la personne est éligible à traiter, mais qui n'ont pas de responsable.

#### Relations de cause à effet

- La boîte interroge chaque source à la volée. Elle est lente, la pagination est incohérente, et un module en panne vide la liste.
- Les éléments portent leur propre copie des règles. Une règle de transition change dans la source, la boîte propose une action devenue interdite.
- Aucun garde-fou n'interdit les éléments sans responsable. Des éléments dorment sans que personne ne soit alerté.
- Le compteur ne suit pas le filtre de droits. Il révèle l'existence d'éléments que la personne n'a pas le droit de voir (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- Un élément est dupliqué à chaque événement rejoué. La même tâche apparaît deux fois.

#### Idées reçues

- **« Un élément de travail est une tâche de workflow. »** Non. C'est une forme commune à plusieurs sources, dont la tâche de workflow est une.
- **« La boîte de tâches est une vue de la table des ressources. »** Non. Elle agrège des sources hétérogènes, dont certaines ne sont pas des ressources.
- **« Un élément clos disparaît. »** Non. Il reste consultable avec sa raison de clôture, pour l'historique et la mesure.

#### Principe clé

Un élément de travail est la trace normalisée de ce qui attend quelqu'un ; il référence sa source, a toujours un responsable ou un groupe tant qu'il est ouvert, et la boîte n'en est que la projection filtrée par les droits.

#### Si vous ne retenez que trois choses

1. Un élément de travail référence une source de vérité et la présente sous une forme commune.
2. Tant qu'il est ouvert, il a un responsable ou un groupe éligible, et son état suit celui de la source.
3. La boîte de tâches est une projection filtrée par les droits, et ses actions sont déléguées à la source.

### 3. Explication technique détaillée

#### La forme normalisée

| Champ | Sens | Remarque |
|---|---|---|
| `id` | Identifiant de l'élément | Propre à la boîte |
| `source_key`, `source_ref` | Source déclarée et identifiant dans la source | Unicité du couple |
| `source_version` | Version vue de la source | Ignore les événements en retard |
| `kind` | Tâche de workflow, ressource, obligation, personnel | Pour les filtres |
| `title` | Texte affiché | Rendu depuis un modèle |
| `subject` | Objet concerné (type et identifiant) | Sert au contrôle de droits |
| `assignee`, `pool` | Responsable, ou groupe éligible | L'un ou l'autre, jamais aucun |
| `status`, `closed_reason` | État normalisé et raison de clôture | Dérivés de la source |
| `priority`, `due_at` | Priorité et échéance | Voir [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) |
| `assignment_reason` | Pourquoi cette personne ou ce groupe | Explicabilité |
| `capabilities` | Actions possibles pour la personne qui regarde | Calculées à la lecture |

Le modèle de stockage, les contraintes et les index sont détaillés dans l'[étude dédiée](../etudes/activity-center-notification-center.md).

#### D'une source à un élément

```text
source de vérité ─► événement ─► traducteur de la source ─► élément normalisé ─► boîte
(workflow,          (7.1)        (une par source)           (mise à jour         (lecture,
 ressource, règle)                                           idempotente)         droits)
```

Chaque source a son **traducteur** : il sait lire l'objet d'origine, dire s'il est ouvert, qui en est responsable, quand il est dû. C'est le patron de la couche anticorruption (voir [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité)) : le vocabulaire de la source ne contamine pas celui de la boîte.

**Invariants.**

- Un seul élément par objet de source : le couple `(source_key, source_ref)` est unique.
- Un élément ouvert a un `assignee` ou un `pool`.
- La clôture est monotone : un élément clos le reste, sauf réouverture explicite par la source.
- L'élément n'est jamais le lieu d'une décision métier : il ne fait que présenter.

#### La requête de la boîte

```sql
WITH my_pools AS (
  SELECT role, scope
  FROM role_assignment
  WHERE tenant_id = :tenant_id
    AND user_id = :user_id
    AND (valid_to IS NULL OR valid_to > now())
)
SELECT w.id, w.title, w.priority, w.due_at, w.assignee_id
FROM work_item w
WHERE w.tenant_id = :tenant_id
  AND w.status <> 'closed'
  AND ( w.assignee_id = :user_id
        OR ( w.assignee_id IS NULL
             AND EXISTS (SELECT 1 FROM my_pools p
                         WHERE p.role = w.pool_role
                           AND (p.scope IS NULL OR p.scope = w.pool_scope)) ) )
ORDER BY w.priority, w.due_at NULLS LAST, w.id
LIMIT 50;
```

**Comment la lire.** La table `role_assignment` est illustrative : elle représente les attributions de rôle décrites en [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée). Une personne voit deux familles d'éléments : ceux qui lui sont assignés, et ceux d'un pool dont elle remplit le rôle et le périmètre. L'éligibilité est calculée **à la lecture** à partir des attributions de rôles en cours (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée)) : si la personne perd un rôle, les éléments du pool disparaissent de sa liste à la lecture suivante. Le tri par priorité, puis par échéance, puis par identifiant est stable, ce qui rend possible une pagination par curseur (voir [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)).

**Les compteurs.** Ils réutilisent le même prédicat que la liste : « à moi », « à prendre » (pool), « en retard ». Un compteur calculé par un autre chemin que la liste finit par la contredire, ou par révéler l'existence d'éléments interdits (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

#### Les états

```text
ouvert ──► en cours ──► clos (terminé)
   │          │
   └──────────┴──────► clos (annulé | expiré | remplacé)
```

| État de la source (exemple) | État normalisé | Raison de clôture |
|---|---|---|
| `maintenance_task` planifiée | Ouvert | — |
| `maintenance_task` en cours | En cours | — |
| `maintenance_task` à vérifier | Ouvert (pour le vérificateur) | — |
| `maintenance_task` close | Clos | Terminé |
| `maintenance_task` annulée | Clos | Annulé |
| Tâche de workflow expirée | Clos | Expiré |
| Instance de workflow migrée vers une autre version | Clos | Remplacé |

Un élément « à vérifier » change de main : il passe de l'exécutant au vérificateur, selon la source (voir [15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne)).

#### Les droits

| Question | Réponse |
|---|---|
| Qui voit un élément ? | La personne assignée, ou un membre éligible du pool, qui peut aussi lire le sujet |
| Qui peut agir ? | Celle qui a la capacité sur la source, séparation des tâches comprise (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) |
| Que révèle le titre ? | Rien qu'un lecteur de la boîte n'aurait le droit de voir |
| Que se passe-t-il sans droit ? | L'élément est absent ; le lien profond mène à « non autorisé » (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) |

#### La performance

- **Index partiels** sur les éléments ouverts, par responsable et par pool.
- **Titre dénormalisé** pour éviter une jointure vers la source à chaque affichage.
- **Pagination par curseur**, jamais par décalage sur de grandes listes (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)).
- **Reconstruction** à volonté à partir des sources : la boîte est jetable (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)).

#### Les modes de défaillance

- **Un événement perdu** : un élément manque. Une relecture périodique de la source le corrige.
- **Un élément fantôme** : la source l'a supprimé, la boîte le garde. La réconciliation compare les ouverts.
- **Un orphelin** : le dernier membre d'un pool a quitté le tenant.
- **Une latence de projection** : « je viens de terminer et c'est toujours là » (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
- **Une fuite par le compteur ou le titre.**

**Contre-exemple.** Une équipe construit la boîte de tâches en interrogeant, à chaque ouverture de page, les cinq modules sources. Le module de maintenance répond en six secondes, la pagination change à chaque appel, et un module indisponible rend la page entière inutilisable.

**Limites.** La normalisation perd des nuances propres à chaque source. On les retrouve en ouvrant l'objet d'origine : la boîte sert à trier, pas à tout dire.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | La tâche de workflow est une source ; la liste de travail y est introduite |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les actions sur une ressource sont des transitions avec gardes |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | La boîte est un modèle de lecture, reconstructible |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Listes et compteurs suivent les droits de ligne |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | L'interdiction des orphelins est un invariant |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Chaque source a son traducteur, selon la couche anticorruption |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | Les capacités par élément proviennent du serveur |
| [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence) | L'affectation et la prise en charge s'appliquent aux éléments du pool |
| [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) | Échéance, horloge et priorité qualifient l'élément |
| [17.11 Files enregistrées, modèles de tâche, rappels personnels et vue de charge](#1711-files-enregistrées-modèles-de-tâche-rappels-personnels-et-vue-de-charge) | Files, modèles, rappels et charge s'appuient sur la boîte |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, Karim consulte trois écrans pour savoir ce qu'il doit faire : la liste des tâches de maintenance, le module des approbations et sa messagerie. Sophie découvre des constats critiques en attente le lendemain.

**Problème.** Le travail est dispersé, et personne n'a de vue d'ensemble de ce qui attend.

**Application du concept.** Le tenant déclare deux sources de travail et active la boîte de tâches.

**Déroulé.**

1. L'administrateur déclare la source `maintenance_task_work` (assignation par exécutant, puis par vérificateur) et la source `finding_approval` (tâche de workflow).
2. À chaque événement de ces sources, le traducteur met à jour l'élément correspondant.
3. Karim ouvre sa boîte : deux éléments à lui, un élément à prendre dans le pool des techniciens.
4. Sophie voit trois éléments : deux décisions attendues et une tâche à vérifier.
5. Karim prend l'élément du pool : il passe « en cours », et disparaît de la liste « à prendre » des autres techniciens.

**Résultat.** Chacun voit au même endroit ce qui l'attend, avec les mêmes filtres et les mêmes compteurs. Les actions s'exécutent dans les modules d'origine, avec leurs règles.

**Limites.** Si une troisième source n'est pas déclarée, ses éléments restent invisibles : la boîte est aussi complète que les sources déclarées.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un élément de travail, et en quoi diffère-t-il d'une tâche de workflow ?
2. **Compréhension.** Citez trois champs d'un élément de travail et leur rôle.
3. **Compréhension.** Pourquoi un élément ouvert a-t-il toujours un responsable ou un pool ?
4. **Pourquoi.** Pourquoi les actions de la boîte sont-elles déléguées à la source ?
5. **Raisonnement pratique.** Un compteur affiche 12 éléments « à prendre », mais la liste n'en montre que 9. Quelles causes envisagez-vous ?

#### Réponses

1. C'est un enregistrement normalisé qui référence une unité de travail attendue d'une personne ou d'un groupe, quelle que soit sa source. La tâche de workflow est l'une des sources possibles, avec les ressources affectées, les obligations calculées et les rappels personnels.
2. Par exemple : `source_key` et `source_ref` (rattachement à la source, unicité), `assignee` ou `pool` (qui en est responsable), `status` et `closed_reason` (état normalisé), `due_at` (échéance), `capabilities` (actions possibles pour la personne).
3. Pour qu'aucun travail ne dorme : un élément sans responsable ni groupe n'apparaît dans aucune liste. Une contrainte interdit cet état, et une alerte signale ceux qui le deviennent (par exemple quand le dernier membre d'un pool part).
4. Parce que la source porte les règles : gardes de transition, séparation des tâches, validations. La boîte ne doit pas les dupliquer, car elles divergeraient.
5. Le compteur n'applique pas le même filtre de droits que la liste (il compte des éléments dont le sujet n'est pas lisible), le compteur et la liste sont lus à des instants différents (retard de la projection), ou un compteur en cache n'a pas été invalidé. Les deux doivent partager le même prédicat.

## 17.9 Affectation, prise en charge, réaffectation et absence

### 1. Comprendre simplement

Une **stratégie d'affectation** (*assignment strategy*) est la règle qui désigne qui doit traiter un élément : une personne nommée, un groupe, un tour de rôle, la personne la moins chargée, celle qui a la bonne habilitation. La **prise en charge et la libération** (*claim and release*) sont les gestes par lesquels un membre d'un groupe se saisit d'un élément, ou le rend. La **réaffectation et la délégation** (*reassignment and delegation*) changent le responsable en cours de route. L'**absence** (*out-of-office*) est la période où une personne n'est pas disponible, avec les effets qu'elle entraîne sur son travail.

**Pourquoi cela existe.** Le travail doit toujours avoir un responsable. Or les personnes s'absentent, partent, se retrouvent débordées, et les équipes changent. Sans règles, ou bien les éléments dorment dans un coin, ou bien tout le monde les prend, ou bien ils restent chez quelqu'un qui n'est plus là.

**Problème résolu.** Désigner la bonne personne, de façon prévisible et explicable, et garder le travail en mouvement malgré les absences et les changements.

**Modèle mental.** Un chef de service qui répartit les dossiers : certains nominativement, d'autres à « celui qui est disponible », avec un tableau des congés affiché au mur.

**Où l'analogie s'arrête.** Un chef décide au cas par cas, de tête. Une plateforme applique des règles qui doivent rester déterministes, justifiables et sûres vis-à-vis de la séparation des tâches.

**Exemple.** Douze inspections arrivent dans le pool des techniciens de LYS. Karim en prend deux. La plateforme en confie trois à Julie, la moins chargée. Sophie part en congé : ses décisions en attente passent à Julien, son suppléant, au nom d'elle. Un élément qu'Hugo avait pris et n'a pas touché depuis quatre heures retourne au pool.

**Les composants.**

1. une **stratégie** d'affectation par type d'élément ;
2. des **conditions d'éligibilité** (rôle, périmètre, habilitation, disponibilité) ;
3. la **prise en charge** et la **libération**, atomiques ;
4. des **limites** (nombre d'éléments pris en charge, durée de bail) ;
5. la **réaffectation**, avec contrôle des droits et de la séparation des tâches ;
6. la **délégation** (au nom de) ;
7. les **absences** et leurs effets automatiques.

**Objectif d'apprentissage :** vous pouvez comparer les stratégies d'affectation, expliquer comment une prise en charge est rendue atomique, et décrire les effets d'une absence sur le travail en cours.

### 2. Connaissances essentielles

#### Définition

- **Stratégie d'affectation** : règle déterministe qui désigne, parmi des personnes éligibles, la ou les personnes responsables d'un élément, et qui enregistre la raison.
- **Prise en charge** (*claim*) : acte par lequel un membre éligible d'un groupe devient responsable d'un élément libre. **Libération** (*release*) : acte inverse.
- **Réaffectation** : changement de responsable par une personne autorisée. **Délégation** : autorisation d'agir au nom d'un autre, avec conservation de la responsabilité d'origine (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
- **Absence** : période déclarée pendant laquelle une personne n'est pas disponible, assortie d'une politique (suppléant, retour au pool, mise en attente).

#### Idées fondamentales

1. **L'affectation est une règle, pas une habitude.** Elle est déterministe, enregistrée avec sa raison, et explicable à la personne concernée.
2. **Pousser ou tirer.** Une affectation poussée désigne une personne ; une affectation tirée laisse l'élément dans un pool pour qu'on s'en saisisse.
3. **La prise en charge est atomique.** Deux personnes ne peuvent pas prendre le même élément.
4. **Prendre engage.** Une prise en charge a une limite de durée et de nombre, pour éviter l'accaparement.
5. **Réaffecter transfère, déléguer représente.** Dans le premier cas, la responsabilité change de main ; dans le second, elle reste au délégant.
6. **Une absence a des effets prévus.** On ne découvre pas un congé quand un élément est en retard.

#### Vocabulaire essentiel

- **Éligibilité** (*eligibility*) : ensemble des conditions qui rendent une personne apte à recevoir un élément (voir [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité)).
- **Tournante** (*round robin*) : distribution à tour de rôle parmi les personnes éligibles.
- **Moins chargé** (*least loaded*) : choix de la personne qui a le moins d'éléments ouverts, éventuellement rapporté à sa capacité.
- **Bail** (*lease*) : durée pendant laquelle une prise en charge reste valide sans activité ; passé ce délai, l'élément retourne au pool.
- **Limite de travail en cours** (*work-in-progress limit*) : nombre maximal d'éléments qu'une personne peut tenir ouverts.
- **Au nom de** (*on behalf of*) : mention de l'identité représentée par une action déléguée.
- **Politique d'absence** (*absence policy*) : règle qui dit ce que deviennent les éléments d'une personne absente.

#### Relations de cause à effet

- L'affectation vise une personne nommée, sans repli. L'élément est bloqué dès que la personne est absente (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)).
- Aucune limite de prise en charge n'existe. Une personne zélée prend vingt éléments et n'en traite que cinq, pendant que les autres attendent.
- Aucun bail n'existe. Un élément pris et oublié reste indisponible indéfiniment.
- La réaffectation ne vérifie pas la séparation des tâches. L'exécutant se retrouve vérificateur de son propre travail (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
- L'absence n'est pas déclarée. Les éléments vont à une personne qui n'est pas là, et l'escalade se déclenche pour rien.

#### Idées reçues

- **« Plus d'automatisme, c'est mieux. »** Non. Une affectation automatique non explicable est contestée, et personne ne sait la corriger.
- **« La délégation, c'est la réaffectation. »** Non. Une délégation conserve le responsable d'origine ; une réaffectation le remplace.
- **« En cas d'absence, tout va au suppléant. »** Pas forcément : selon la politique, les éléments restent, retournent au pool ou sont transférés.

#### Principe clé

Chaque élément ouvert a un responsable ou un pool éligible ; l'affectation est une règle déterministe, la prise en charge est atomique et bornée, et les absences ont des effets déclarés.

#### Si vous ne retenez que trois choses

1. Une stratégie d'affectation désigne parmi les éligibles, de façon déterministe, avec une raison enregistrée.
2. La prise en charge est atomique et bornée par un bail et une limite de travail en cours.
3. Réaffecter transfère, déléguer représente, et une absence déclenche des effets prévus par une politique.

### 3. Explication technique détaillée

#### Les stratégies

| Stratégie | Principe | Avantage | Limite |
|---|---|---|---|
| Personne nommée | La source ou une règle désigne une personne | Responsabilité claire | Fragile en cas d'absence |
| Pool, prise en charge libre | N'importe quel titulaire éligible se saisit | Simple, souple | Accaparement, délai de prise en charge |
| Tournante | Chacun à son tour | Équité en nombre | Ignore la charge réelle et les compétences |
| Moins chargé | La personne qui a le moins d'éléments ouverts | Équilibre la charge | Dépend de la mesure de charge |
| Par compétence | Habilitation ou qualification requise | Qualité, conformité | Pool restreint, goulot |
| Persistante | La même personne que l'élément précédent du même dossier | Continuité | Concentre la charge |
| De permanence | La personne d'astreinte du moment (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) | Urgence | Dépend du planning d'astreinte |

Plusieurs stratégies se composent : par exemple « parmi les techniciens habilités de la base, le moins chargé, absents exclus ».

```typescript
function pickAssignee(candidates: Person[], item: WorkItem, now: Instant): Person | null {
  const eligible = candidates.filter((p) =>
    p.active &&
    !p.absentAt(now) &&
    p.holds(item.pool) &&
    !violatesSeparation(p, item));
  if (eligible.length === 0) {
    return null;                       // l'élément reste dans le pool ; alerte d'orphelin
  }
  return eligible.reduce((best, p) => (load(p) < load(best) ? p : best));
}
```

**Comment la lire.** On filtre d'abord (actif, présent, détenteur du rôle, séparation des tâches respectée), puis on choisit. Si personne n'est éligible, la fonction ne force rien : l'élément reste dans le pool et une alerte signale le risque d'orphelin.

#### La prise en charge et la libération

```sql
UPDATE work_item
SET assignee_id = :user_id, status = 'in_progress', updated_at = now()
WHERE tenant_id = :tenant_id
  AND id = :item_id
  AND assignee_id IS NULL
  AND status = 'open';
```

Si la requête modifie une ligne, la personne est responsable. Si elle n'en modifie aucune, quelqu'un d'autre a été plus rapide : la personne l'apprend par un message clair, sans verrou long (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

| Garde-fou | Règle | Raison |
|---|---|---|
| Limite de travail en cours | Au plus *n* éléments pris en charge à la fois | Éviter l'accaparement |
| Bail | Retour au pool après 4 h sans activité | Éviter les éléments oubliés |
| Motif de libération | Obligatoire | Comprendre pourquoi on se retire |
| Éligibilité revérifiée | À la prise en charge, pas seulement à l'affichage | Les droits ont pu changer |

#### La réaffectation et la délégation

| | Réaffectation | Délégation |
|---|---|---|
| Qui décide | Une personne habilitée (planificateur, responsable) | Le délégant, dans la limite de la politique du tenant |
| Responsable après | La personne cible | Le délégant, représenté par le délégué |
| Traçabilité | Historique de l'élément | « Acteur » et « au nom de » (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)) |
| Durée | Définitive jusqu'à nouvelle décision | Bornée par une fenêtre |
| Vérifications | Éligibilité de la cible, séparation des tâches | Idem, plus le droit du délégant au moment de l'action |

**Réaffectation en masse.** Un responsable réaffecte vingt éléments d'un coup (voir [12.8 Actions en masse](12-produit-ux.md#128-actions-en-masse)) : la plateforme vérifie l'éligibilité de chaque élément, produit un rapport des refus, et envoie **une** notification groupée par destinataire (voir [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes)).

**Éviter la boucle.** Une règle automatique qui réaffecte un élément que l'autre règle vient de réaffecter fait des allers-retours. On limite le nombre de réaffectations par élément et par période, et l'on alerte au-delà.

#### L'absence

```json
{
  "absence_id": "abs_01HZZ3",
  "person": "u_sophie",
  "from": "2026-10-12T00:00:00Z",
  "to": "2026-10-16T23:59:59Z",
  "policy": {
    "new_items": "exclude_from_pools",
    "open_items": "delegate",
    "delegate": "u_julien",
    "notifications": "defer_non_urgent",
    "escalation": "skip_to_delegate"
  }
}
```

| Effet | Options | Défaut recommandé |
|---|---|---|
| Nouveaux éléments de pool | Exclure la personne de l'éligibilité | Exclure |
| Éléments déjà assignés | Garder, déléguer, retourner au pool | Déléguer au suppléant si désigné, sinon retourner au pool |
| Notifications | Différer, ou maintenir | Différer le non urgent (voir [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes)) |
| Escalade | Sauter la personne absente | Passer directement au suppléant |
| Retour | Aucune réversion automatique | Les éléments restent chez le suppléant, la personne les reprend si besoin |

**Pièges d'absence.** Le suppléant est lui-même absent : on résout la chaîne avec une profondeur limitée. La délégation couvre des permissions que le suppléant n'a pas : on les accorde pour la durée, dans la politique (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)). La délégation contourne une séparation des tâches : la règle s'applique aussi sous délégation (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).

#### Les mesures

| Mesure | Question |
|---|---|
| Délai de prise en charge (médiane, 90e centile) | Le pool est-il absorbé ? |
| Taux de réaffectation | L'affectation initiale est-elle bien réglée ? |
| Part des éléments retournés au pool par bail | Y a-t-il de l'accaparement ou de l'oubli ? |
| Éléments sans éligible | Où manque-t-il des personnes ou des rôles ? |

#### Les modes de défaillance

- **Un élément orphelin** : aucune personne éligible, et personne n'est alerté.
- **Un accaparement** : quelques personnes tiennent tout le travail.
- **Une affectation inexpliquée** : la personne ne sait pas pourquoi un élément lui est confié.
- **Une absence contournée** : un élément est affecté à une personne en congé par une règle qui l'ignore.
- **Un suppléant sans droits** : la délégation est déclarée, mais l'action est refusée.

**Contre-exemple.** Une plateforme affecte en tournante, sans considérer l'habilitation. Une inspection exigeant une qualification est confiée à une personne qui ne la détient pas ; la tâche échoue au moment de la vérification, et l'échéance est perdue.

**Limites.** Aucune stratégie ne mesure l'effort réel d'un élément : le « moins chargé » compte des éléments, pas du temps. La plateforme propose des règles et trace leurs raisons ; l'équilibre d'une équipe reste une décision humaine.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Y sont présentées les stratégies d'attribution des tâches |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Les escalades réaffectent selon des délais |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | La délégation et le suppléant, avec acteur et « au nom de » |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches s'applique à l'affectation et à la réaffectation |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | La prise en charge est une écriture conditionnelle |
| [12.8 Actions en masse](12-produit-ux.md#128-actions-en-masse) | La réaffectation en masse, avec rapport et notification groupée |
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | La permanence alimente la stratégie de permanence |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Les éléments du pool et leurs compteurs |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | Les notifications d'une personne absente sont différées |

### 5. Application pratique

**Situation initiale.** Alpha Air voit des constats critiques attendre plusieurs jours quand le responsable est en congé, et des inspections rester sans exécutant parce que chacun croit qu'un autre s'en charge.

**Problème.** Les affectations visent des personnes nommées, sans repli, et rien n'indique les absences.

**Application du concept.** Le tenant configure des pools par rôle et base, une stratégie « moins chargé, habilitation requise », un bail de 4 heures, et une politique d'absence.

**Déroulé.**

1. Douze inspections arrivent dans le pool des techniciens habilités de LYS.
2. Karim en prend deux (prise en charge libre), Julie en reçoit trois par la stratégie « moins chargé ».
3. Hugo prend une inspection puis part en réunion : après 4 heures sans activité, le bail expire, et l'élément retourne au pool avec une notification à lui.
4. Sophie déclare une absence du 12 au 16 octobre, avec Julien comme suppléant.
5. Ses décisions en attente sont déléguées à Julien, au nom d'elle. Ses notifications non urgentes sont différées.
6. Julien approuve un constat : la trace indique « Julien, au nom de Sophie » (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).

**Résultat.** Aucun élément n'attend un congé, et chaque affectation porte sa raison. Les accaparements sont limités par le bail et la limite de travail en cours.

**Limites.** Si Julien est lui-même en déplacement, la chaîne s'arrête à une profondeur de deux, et l'élément retourne au pool avec une alerte.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois stratégies d'affectation et un avantage de chacune.
2. **Compréhension.** Comment rend-on la prise en charge atomique ?
3. **Compréhension.** Quelle différence y a-t-il entre réaffecter et déléguer ?
4. **Pourquoi.** Pourquoi une prise en charge a-t-elle un bail ?
5. **Raisonnement pratique.** La stratégie « moins chargé » confie toujours les éléments à la même personne. Quelles causes envisagez-vous ?

#### Réponses

1. Par exemple : le pool avec prise en charge libre (simple), la tournante (équité en nombre), le moins chargé (équilibre la charge), par compétence (qualité). On peut composer plusieurs stratégies.
2. Par une écriture conditionnelle : la mise à jour ne réussit que si l'élément est encore libre et ouvert. Une seule personne obtient une ligne modifiée, l'autre apprend qu'elle a été devancée.
3. Réaffecter transfère la responsabilité à une autre personne, définitivement. Déléguer permet à un délégué d'agir au nom du délégant, qui reste responsable, pour une durée bornée, avec une trace « acteur » et « au nom de ».
4. Pour éviter les éléments oubliés : une prise en charge sans activité pendant un certain temps retourne au pool, ce qui libère l'élément pour les autres et rend l'accaparement visible.
5. Les autres personnes ne sont pas éligibles (rôle, périmètre, habilitation ou absence), la mesure de charge est erronée ou ignore les éléments clos, ou la personne est la seule à satisfaire une contrainte comme la séparation des tâches. On examine la raison enregistrée de chaque affectation.

## 17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité

### 1. Comprendre simplement

Une **échéance** (*due date*) est l'instant avant lequel un élément doit être traité. L'**horloge d'engagement** (*SLA clock*) décompte le temps consommé sur l'engagement pris : elle démarre, peut être suspendue, puis s'arrête. Un **calendrier ouvré** (*business calendar*) dit **quand le temps compte** : heures d'ouverture, jours fériés, fuseau. La **priorité** (*priority*) et l'**ordre** (*ordering*) disent **quoi traiter d'abord**. Le plan nomme ces notions *due date and SLA clock*, *business calendar* et *priority and ordering*.

**Pourquoi cela existe.** Sans échéance, il n'y a pas de retard à constater. Sans calendrier, « deux jours » ne veut rien dire : le week-end compte-t-il ? Sans horloge, on ne sait pas si l'engagement est tenu quand l'attente est le fait du client. Sans priorité, on traite dans l'ordre d'arrivée, et l'urgent attend.

**Problème résolu.** Rendre les délais calculables, comparables et justes, et ordonner le travail d'une façon que chacun peut expliquer.

**Modèle mental.** Le chronomètre d'une cuisine de restaurant : il ne tourne que quand la cuisine est ouverte, il s'arrête quand on attend le fournisseur, et le plat à servir en premier dépend à la fois de son importance et de l'heure promise.

**Où l'analogie s'arrête.** Un chronomètre de cuisine est un objet physique unique. Dans une plateforme, des milliers de tenants ont chacun leur calendrier, leurs fuseaux et leurs règles de suspension, et un même élément peut avoir deux horloges.

**Exemple.** Une activité est créée un vendredi à 16 h, avec un délai de 8 heures ouvrées sur un calendrier de 8 h à 17 h du lundi au vendredi. L'échéance tombe le lundi à 15 h. Si le lundi est férié, elle tombe le mardi à 15 h. Si l'activité attend un document du client pendant une demi-journée, l'horloge est suspendue et l'échéance se décale d'autant.

**Les composants.**

1. une **échéance**, instant calculé dans un calendrier ;
2. une **horloge** avec états (en cours, suspendue, arrêtée) ;
3. un **calendrier ouvré** versionné ;
4. des **motifs de suspension** déclarés ;
5. des **seuils** d'avertissement et de violation ;
6. une **priorité**, explicite ou calculée ;
7. une **règle d'ordre** stable avec départage et vieillissement.

**Objectif d'apprentissage :** vous pouvez calculer une échéance en temps ouvré, décrire les états d'une horloge d'engagement, et expliquer pourquoi la priorité et l'échéance sont deux notions distinctes.

### 2. Connaissances essentielles

#### Définition

- **Échéance** : instant limite de traitement d'un élément, calculé à partir d'un instant de départ, d'une durée accordée et d'un calendrier.
- **Horloge d'engagement** : décompte du temps ouvré consommé depuis le départ d'un engagement de délai, avec des états (en cours, suspendue, arrêtée) et des seuils.
- **Calendrier ouvré** : description des plages pendant lesquelles le temps compte (jours et heures ouvrés, jours fériés, fuseau), versionnée comme une configuration.
- **Priorité** : niveau d'importance attribué à un élément, explicite ou calculé, qui sert à ordonner le travail.

#### Idées fondamentales

1. **Une échéance est un instant, pas une durée.** Elle résulte d'un calcul dans un calendrier, et se stocke en UTC.
2. **L'horloge compte du temps d'engagement, pas du temps mural.** Un week-end et une nuit ne consomment rien.
3. **Une horloge peut se suspendre, pour des motifs déclarés.** L'attente d'un tiers en fait partie, avec une trace.
4. **Le calendrier est une donnée versionnée.** Un jour férié ajouté après coup ne déplace pas silencieusement les engagements déjà pris (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).
5. **Priorité et échéance sont deux notions.** La première dit l'importance, la seconde dit l'urgence : un élément peut être important sans être pressé.
6. **L'ordre est une règle explicite et stable.** Elle prévoit un départage et un vieillissement pour que rien ne reste indéfiniment en bas de la file.

#### Vocabulaire essentiel

- **Heures ouvrées** (*business hours*) : plages d'ouverture qui comptent pour l'engagement.
- **Suspension** (*pause*) : arrêt temporaire de l'horloge, avec un motif.
- **Violation** (*breach*) : dépassement de l'engagement.
- **Délai de première réponse** (*time to first response*) : durée avant la première prise en charge.
- **Délai de résolution** (*time to resolution*) : durée avant la clôture.
- **Rapport de consommation** (*consumption ratio*) : part du délai consommée, entre 0 et 1 ou plus.
- **Urgence** (*urgency*) et **impact** (*impact*) : deux dimensions dont la combinaison donne une priorité.
- **Discipline de file** (*queue discipline*) : règle qui détermine l'ordre de traitement.
- **Vieillissement** (*aging*) : augmentation progressive de la priorité effective avec l'ancienneté.
- **Famine** (*starvation*) : situation où un élément n'est jamais traité parce qu'il est toujours dépassé par d'autres.

#### Relations de cause à effet

- Les délais sont comptés en temps mural. Une activité créée le vendredi soir est « en retard » dès le lundi matin, sans que personne n'ait pu agir.
- L'horloge n'est jamais suspendue. Les équipes sont pénalisées pour l'attente d'un tiers, et cessent de croire aux indicateurs.
- Le calendrier est modifié sans version. Les échéances déjà annoncées au client changent sans avertissement.
- Tout est « prioritaire ». La priorité n'ordonne plus rien (inflation de priorité).
- Le tri est « priorité, puis échéance » sans vieillissement. Les éléments de faible priorité ne sont jamais traités.

#### Idées reçues

- **« Une échéance est une date. »** Elle est un instant dans un fuseau, calculé dans un calendrier. Une date seule ne dit pas à quelle heure.
- **« Suspendre l'horloge, c'est tricher. »** Non, si le motif est déclaré, tracé, et limité à des causes que le contrat reconnaît.
- **« La priorité décide de tout. »** Non. Un élément de priorité faible mais échu dans une heure peut devoir passer avant un élément de priorité haute à cinq jours.

#### Principe clé

L'engagement se mesure en temps ouvré dans un calendrier versionné, l'horloge peut être suspendue pour des motifs déclarés, et l'ordre de traitement est une règle explicite qui distingue importance et urgence.

#### Si vous ne retenez que trois choses

1. Une échéance se calcule dans un calendrier ouvré, et se stocke en UTC.
2. Une horloge d'engagement a des états, des motifs de suspension déclarés et des seuils d'avertissement.
3. Priorité et échéance sont distinctes, et l'ordre est une règle stable avec départage et vieillissement.

### 3. Explication technique détaillée

#### Calculer une échéance en temps ouvré

$$\text{échéance} = \text{ajouter}(t_0,\; d,\; \text{cal})$$

où $t_0$ est l'instant de départ, $d$ la durée accordée en minutes ouvrées, et $\text{cal}$ le calendrier (jours ouvrés, plage d'ouverture, jours fériés, fuseau).

```typescript
interface Calendar {
  openMinute: number;          // minute d'ouverture depuis minuit, 480 = 08:00
  closeMinute: number;         // minute de fermeture, 1020 = 17:00
  workingDays: number[];       // 1 = lundi ... 7 = dimanche
  holidays: Set<string>;       // dates locales fériées, "AAAA-MM-JJ"
}

interface LocalInstant {
  date: string;                // date locale "AAAA-MM-JJ"
  minute: number;              // minutes écoulées depuis minuit, dans le fuseau du calendrier
}

function weekday(date: string): number {
  const d = new Date(date + "T00:00:00Z").getUTCDay();   // 0 = dimanche
  return d === 0 ? 7 : d;
}

function nextDay(date: string): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isOpenDay(date: string, cal: Calendar): boolean {
  return cal.workingDays.includes(weekday(date)) && !cal.holidays.has(date);
}

function addBusinessMinutes(start: LocalInstant, minutes: number, cal: Calendar): LocalInstant {
  let date = start.date;
  let minute = start.minute;
  let left = minutes;
  while (true) {
    if (!isOpenDay(date, cal) || minute >= cal.closeMinute) {
      date = nextDay(date);
      minute = cal.openMinute;
      continue;
    }
    if (minute < cal.openMinute) {
      minute = cal.openMinute;
    }
    const available = cal.closeMinute - minute;
    if (left <= available) {
      return { date, minute: minute + left };
    }
    left -= available;
    date = nextDay(date);
    minute = cal.openMinute;
  }
}
```

**Comment la lire.** La fonction avance dans les plages ouvertes, consomme ce qui reste de la journée, puis passe à la journée ouvrée suivante. Elle ne traite ni les fuseaux ni les changements d'heure : elle travaille en heure locale du calendrier, et une conversion en UTC se fait ensuite avec une bibliothèque de fuseaux (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).

| Départ | Durée | Calendrier | Échéance |
|---|---|---|---|
| Vendredi 16:00 | 8 h ouvrées | Lundi à vendredi, 08:00 à 17:00 | Lundi 15:00 |
| Vendredi 16:00 | 8 h ouvrées | Idem, lundi férié | Mardi 15:00 |
| Samedi 10:00 | 1 h ouvrée | Idem | Lundi 09:00 |
| Mercredi 07:00 | 30 min | Idem | Mercredi 08:30 |

Les quatre lignes ont été recalculées par programme. La deuxième montre pourquoi le calendrier est une donnée : le même départ et la même durée donnent deux échéances différentes.

#### L'horloge d'engagement

```text
non démarrée ──démarrage──► en cours ──suspension──► suspendue ──reprise──► en cours ──arrêt──► arrêtée (tenue)
                               │                                               │
                               └───────── seuil de violation dépassé ──────────┴─────────────────► arrêtée (violée)
```

```json
{
  "sla": {
    "policy": "finding_review_2d",
    "target_business_minutes": 960,
    "state": "paused",
    "consumed_business_minutes": 310,
    "paused_since": "2026-10-13T14:05:00Z",
    "pause_reason": "waiting_customer_document",
    "calendar": "business_hours_lys@v6"
  }
}
```

**Comment la lire.** L'engagement vaut 960 minutes ouvrées (deux journées de 8 heures). 310 minutes sont consommées, l'horloge est suspendue depuis 14 h 05 pour attendre un document du client, et le calendrier utilisé est identifié avec sa version (`v6`). À la reprise, l'échéance projetée est recalculée à partir du temps restant : $960 - 310 = 650$ minutes.

$$\rho = \frac{\text{temps consommé}}{\text{temps accordé}}$$

où $\rho$ est le rapport de consommation. À $\rho = 0{,}75$ on avertit, à $\rho = 1$ l'engagement est violé. Ici, $\rho = 310 / 960 \approx 0{,}32$.

| Horloge | Départ | Arrêt | Exemple de cible |
|---|---|---|---|
| Première réponse | Création de l'élément | Première prise en charge | 4 heures ouvrées |
| Résolution | Création de l'élément | Clôture | 2 jours ouvrés |

Les deux horloges coexistent sur un même élément. Les **motifs de suspension** sont un petit ensemble fermé : attente du client, attente d'un tiers, attente d'une pièce. Un motif absent de la liste est refusé, et chaque suspension est tracée avec son auteur (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

#### Le calendrier comme donnée versionnée

| Question | Règle |
|---|---|
| Qui définit le calendrier ? | Le tenant, par équipe ou par base |
| Que contient-il ? | Jours ouvrés, plages, jours fériés, fuseau, exceptions (permanence, 24 h sur 24) |
| Comment évolue-t-il ? | Par versions datées, avec date d'effet (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Que devient une échéance déjà calculée ? | Elle est conservée avec la version du calendrier qui l'a produite ; un recalcul n'a lieu que sur événement (suspension, changement de politique) |
| Que se passe-t-il à l'ajout d'un jour férié ? | Les échéances futures le prennent en compte à la création ; les engagements déjà pris ne bougent pas, sauf règle explicite |

Un service ouvert vingt-quatre heures sur vingt-quatre utilise un calendrier sans fermeture. C'est la même mécanique avec une plage continue.

#### La priorité et l'ordre

La priorité est **explicite** (choisie par une personne ou une règle) ou **calculée** à partir de l'urgence et de l'impact.

| Impact \ Urgence | Élevée | Moyenne | Faible |
|---|---|---|---|
| Élevé | 1 | 1 | 2 |
| Moyen | 1 | 2 | 3 |
| Faible | 2 | 3 | 3 |

Cette matrice est un exemple. L'important est qu'elle soit **déclarée**, **stable** et **expliquée** à la personne qui voit une priorité.

**Les disciplines de file.**

| Discipline | Règle | Quand |
|---|---|---|
| Ordre d'arrivée | Premier arrivé, premier servi | Éléments équivalents, équité |
| Priorité d'abord | Priorité, puis échéance, puis ancienneté | Importance très différente |
| Échéance d'abord | Échéance la plus proche en premier | Engagements de délai dominants |
| Score composite | Combine priorité, échéance, ancienneté | Files mixtes, avec règle documentée |

Pour un seul exécutant et des travaux tous disponibles au départ, les traiter par échéance croissante minimise le retard maximal : c'est un résultat classique d'ordonnancement, la règle de Jackson, étudiée dès les années 1950. Il ne s'étend pas simplement au cas où les travaux arrivent à des dates différentes, et il ne dit rien de l'importance relative des éléments : il oriente un choix, il ne l'impose pas.

**Exemple chiffré.** Cinq éléments : A (priorité 2, échéance demain 09 h), B (priorité 1, dans 3 jours), C (priorité 3, aujourd'hui 17 h), D (priorité 2, dans 2 jours), E (priorité 1, demain 12 h).

| Discipline | Ordre obtenu |
|---|---|
| Priorité d'abord | E, B, A, D, C |
| Échéance d'abord | C, A, E, D, B |

Avec « priorité d'abord », C, le plus pressé, passe en dernier et risque la violation. On ajoute donc une **règle de remontée** : un élément dont la consommation dépasse 0,75, ou dont l'échéance tombe dans moins de quatre heures, passe devant. Le **vieillissement** abaisse d'un niveau la priorité effective tous les $k$ jours d'attente, dans une limite, pour éviter la famine.

#### Les interactions

- **Notifications** : les événements `due_soon` et `overdue` sont des jobs planifiés par élément, annulés à la clôture (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).
- **Escalade** : elle se mesure à l'horloge d'engagement, et se suspend avec elle (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).
- **Affectation** : une réaffectation ne remet pas l'horloge à zéro, sauf règle explicite (voir [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence)).
- **Mesure** : le taux de retard se calcule sur le temps ouvré, pas sur le temps mural.

#### Les modes de défaillance

- **Le temps mural** : tout est en retard le lundi matin.
- **Une suspension abusive** : l'horloge est arrêtée pour des motifs non contractuels, et les indicateurs sont faux.
- **Un calendrier recalculé silencieusement** : les engagements déjà pris glissent.
- **L'inflation de priorité** : toutes les demandes deviennent « urgentes ».
- **Un tri instable** : deux éléments équivalents changent de place à chaque affichage.

**Contre-exemple.** Une plateforme calcule les échéances en ajoutant 48 heures à l'instant de création. Une activité créée le vendredi à 16 h a une échéance le dimanche à 16 h : elle est en retard avant même que l'équipe ait rouvert.

**Limites.** Un calendrier ne dit rien de la disponibilité réelle des personnes, ni de la durée de l'effort. Il décrit quand le temps compte, pas combien le travail demande. Les fuseaux et les changements d'heure restent des sources d'erreurs : on les confie à des bibliothèques éprouvées.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Calendriers, fuseaux, version à l'instant T |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | L'escalade se déclenche sur l'horloge d'engagement |
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Les délais métier sont une famille de délais d'expiration |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Rappels et violations sont des jobs planifiés, idempotents |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | L'engagement envers un client est un objectif de niveau de service |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | L'élément porte échéance, priorité et horloge |
| [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence) | La réaffectation et l'absence interagissent avec l'horloge |
| [17.7 Limitation, résumé périodique et heures calmes](#177-limitation-résumé-périodique-et-heures-calmes) | Les résumés placent en tête les éléments à échéance proche |

### 5. Application pratique

**Situation initiale.** Alpha Air s'est engagée à faire examiner un constat critique dans « deux jours ». Un constat enregistré le vendredi à 16 h est déclaré « en retard » le dimanche, alors que personne n'est au travail. Un autre est resté sans suite pendant que l'équipe attendait un rapport d'essai d'un sous-traitant.

**Problème.** Les délais sont comptés en temps mural, sans suspension et sans calendrier.

**Application du concept.** Le tenant définit un calendrier ouvré par base, une horloge de résolution de 2 jours ouvrés, une horloge de première réponse de 4 heures, et trois motifs de suspension.

**Déroulé.**

1. Le constat est créé le vendredi à 16 h. L'horloge démarre, avec le calendrier `business_hours_lys@v6`.
2. L'échéance de première réponse est calculée : vendredi 16 h plus 4 heures ouvrées, soit le lundi 11 h.
3. Le lundi à 10 h, Sophie prend en charge : l'horloge de première réponse s'arrête (tenue).
4. Elle demande un rapport au sous-traitant : l'horloge de résolution est suspendue avec le motif « attente d'un tiers ».
5. Le rapport arrive deux jours plus tard : l'horloge reprend, l'échéance projetée est recalculée à partir du temps restant.
6. À $\rho = 0{,}75$, un rappel est envoyé ; à $\rho = 1$, l'escalade se déclenche (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).

**Résultat.** Le retard mesuré reflète le temps réellement disponible, et l'échéance communiquée au client reste cohérente.

**Limites.** Si le motif de suspension n'est pas dans la liste du contrat, l'horloge continue. Le tenant et son client conviennent des motifs, et la plateforme les applique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi stocke-t-on une échéance en UTC mais la calcule-t-on dans un calendrier ?
2. **Compréhension.** Citez les états d'une horloge d'engagement et deux motifs de suspension.
3. **Compréhension.** Quelle différence y a-t-il entre priorité et échéance ?
4. **Pourquoi.** Pourquoi le calendrier est-il versionné ?
5. **Raisonnement pratique.** Une activité est créée le mercredi à 16 h 30, avec 2 heures ouvrées, sur un calendrier de 8 h à 17 h du lundi au vendredi. Quelle est l'échéance ?

#### Réponses

1. L'instant doit être sans ambiguïté et comparable : l'UTC s'y prête. Mais ce que « deux heures ouvrées » veut dire dépend du calendrier local (plages, fériés, fuseau), donc le calcul se fait dans ce calendrier.
2. Non démarrée, en cours, suspendue, arrêtée (tenue ou violée). Motifs : attente du client, attente d'un tiers, attente d'une pièce.
3. La priorité exprime l'importance, l'échéance exprime l'urgence. Un élément peut être important sans être pressé, ou pressé sans être important.
4. Pour que les engagements déjà pris ne glissent pas quand le calendrier change : on sait quelle version a produit chaque échéance, et l'on peut rejouer le calcul (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).
5. Il reste 30 minutes dans la journée (16 h 30 à 17 h). Il en manque 90, qui se consomment le jeudi à partir de 8 h : l'échéance est jeudi 09 h 30.

## 17.11 Files enregistrées, modèles de tâche, rappels personnels et vue de charge

### 1. Comprendre simplement

Une **file enregistrée** (*saved queue*) est une vue nommée et partagée de la boîte de tâches, définie par un filtre, un tri et un périmètre, avec ses compteurs. Un **modèle de tâche** (*task template*) est une définition réutilisable d'élément de travail (titre, liste de contrôle, affectation, échéance relative, priorité) qu'on instancie à la demande ou par règle. Un **rappel personnel** (*personal reminder*) est un élément privé qu'une personne se crée pour elle-même. Une **vue de charge** (*workload view*) montre ce qui pèse sur chaque personne ou chaque équipe : éléments ouverts, échéances, capacité.

**Pourquoi cela existe.** Les équipes organisent leur travail en files (par type, par base, par urgence). Elles répètent les mêmes tâches, avec les mêmes contrôles. Chacun a besoin de se rappeler des choses qui n'appartiennent à aucun workflow. Les responsables doivent équilibrer la charge avant qu'un retard n'apparaisse.

**Problème résolu.** Donner à chaque équipe les outils d'organisation de son travail sans développement, tout en gardant la cohérence de la boîte de tâches.

**Modèle mental.** Le tableau de service d'un atelier : des casiers par type de dossier (les files), des fiches de procédure (les modèles), le pense-bête de chacun (les rappels), et le planning de charge affiché au mur (la vue de charge).

**Où l'analogie s'arrête.** Le tableau mural est le même pour tous. Ici, chaque file a une audience, des droits, des compteurs qui dépendent de la personne qui regarde, et la vue de charge révèle des informations sur des personnes, ce qui appelle de la prudence.

**Exemple.** La file « En attente de décision (LYS) » rassemble les décisions du pool des responsables qualité de LYS. Le modèle « Inspection A » crée douze éléments d'un coup avec leur liste de contrôle. Karim se crée un rappel « relancer le fournisseur jeudi ». La responsable de la base consulte la charge de l'équipe pour la semaine.

**Les composants.**

1. une **définition de file** : filtre, tri, périmètre, audience, indicateurs ;
2. un **modèle** versionné avec liste de contrôle et règles d'achèvement ;
3. des **instanciations** par une personne, une règle ou un workflow ;
4. des **rappels personnels** privés, avec échéance ou déclencheur ;
5. des **mesures de charge** agrégées ;
6. des **droits** de définition et de consultation ;
7. des **limites** de nombre et de complexité.

**Objectif d'apprentissage :** vous pouvez distinguer une file d'une vue personnelle, décrire ce qu'un modèle fige et ce qu'il laisse libre, et lire une vue de charge avec la loi de Little.

### 2. Connaissances essentielles

#### Définition

- **File enregistrée** : vue partagée de la boîte de tâches, définie par un filtre, un tri, un périmètre d'affectation et une audience, qui expose des compteurs et des indicateurs d'engagement.
- **Modèle de tâche** : définition versionnée d'un élément de travail réutilisable, avec valeurs par défaut, liste de contrôle et règle d'achèvement.
- **Rappel personnel** : élément de travail privé, créé par une personne pour elle-même, déclenché par une date ou un événement, hors de tout engagement.
- **Vue de charge** : agrégat des éléments ouverts, des échéances et des capacités par personne ou par équipe, sur une période.

#### Idées fondamentales

1. **Une file est une vue partagée qui porte un périmètre de travail.** Elle compte, elle alerte, et elle se règle par le tenant ou l'équipe.
2. **Un modèle décrit, une instance exécute.** Chaque instance garde la version du modèle utilisé, comme un workflow (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)).
3. **Un rappel est privé et hors engagement.** Il ne compte dans aucun taux de retard d'équipe.
4. **La charge est une mesure agrégée et contextualisée.** Elle sert à équilibrer, pas à classer des personnes.
5. **Les vues de charge sont sensibles.** Elles portent sur des personnes : on minimise, on agrège, et on encadre.
6. **Tout cela se configure par niveau.** Tenant, équipe, personne, avec des limites de nombre et de complexité.

#### Vocabulaire essentiel

- **File intelligente** (*smart queue*) : file dont le contenu se calcule par un filtre à chaque lecture.
- **File statique** (*static queue*) : file dont les éléments sont placés par une règle ou une personne.
- **Liste de contrôle** (*checklist*) : suite d'étapes à cocher, attachées à un élément.
- **Sous-élément** (*subtask*) : élément à part entière, rattaché à un élément parent.
- **Règle d'achèvement** (*completion rule*) : condition qui permet de clore l'élément (toutes les lignes obligatoires cochées).
- **Capacité** (*capacity*) : quantité de travail qu'une personne ou une équipe peut absorber sur une période.
- **Charge** (*load*) : quantité de travail ouvert ou planifié sur une période.
- **Arriéré** (*backlog*) : ensemble des éléments ouverts en attente de traitement.

#### Relations de cause à effet

- Chaque équipe crée ses files sans limite. Le tenant se retrouve avec des centaines de files, dont personne ne sait lesquelles sont utiles.
- Le modèle est modifié, et les instances en cours changent d'un coup. Des éléments en cours perdent des lignes de contrôle déjà cochées.
- Les rappels sont visibles de l'équipe. Les personnes y mettent des notes personnelles, puis cessent de les utiliser.
- La vue de charge classe les personnes par nombre d'éléments clos. Elle devient un outil de pression, et les personnes la contournent.
- La charge n'est pas rapprochée de la capacité. On compte des éléments sans savoir si l'équipe peut les traiter.

#### Idées reçues

- **« Une file est une vue personnelle partagée. »** Non. Une file porte un périmètre d'affectation et des engagements, une vue personnelle non.
- **« Une liste de contrôle est un ensemble de sous-tâches. »** Non. Ses lignes ne sont pas des éléments de travail : elles n'ont ni responsable, ni échéance, ni notification.
- **« Plus il y a d'éléments ouverts, plus l'équipe est occupée. »** Non. Un arriéré qui croît peut venir d'un trop faible débit de traitement, ou d'un trop fort débit d'arrivée.

#### Principe clé

Les files organisent le travail partagé, les modèles le répètent à l'identique, les rappels restent privés, et la charge se lit par équipe, en rapport avec la capacité.

#### Si vous ne retenez que trois choses

1. Une file est une vue partagée avec un périmètre ; un modèle est versionné et ses instances gardent leur version.
2. Un rappel personnel est privé et hors engagement.
3. La charge se lit par équipe, avec la loi de Little, et se protège comme une donnée sur des personnes.

### 3. Explication technique détaillée

#### La définition d'une file

```json
{
  "queue": "pending_decision_lys",
  "label": { "fr": "En attente de décision (LYS)", "en": "Pending decision (LYS)" },
  "scope": "team:quality_lys",
  "filter": {
    "and": [
      { "field": "pool_role", "op": "eq", "value": "quality_manager" },
      { "field": "pool_scope", "op": "eq", "value": "LYS" },
      { "field": "status", "op": "neq", "value": "closed" }
    ]
  },
  "sort": [
    { "field": "priority", "dir": "asc" },
    { "field": "due_at", "dir": "asc" }
  ],
  "indicators": ["overdue_count", "oldest_age", "sla_at_risk"],
  "audience": { "roles": ["quality_manager", "technical_director"] }
}
```

**Comment la lire.** Une file ressemble à la vue configurable de [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) et de [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables), avec trois ajouts : un **périmètre d'affectation** (le filtre sur le pool), des **indicateurs d'engagement** (retards, ancienneté, éléments à risque) et une **audience** (qui peut la voir). Elle ne duplique pas les éléments : elle les filtre.

| | Vue personnelle | File enregistrée |
|---|---|---|
| Créée par | Toute personne | Administrateur, ou responsable d'équipe |
| Portée | La personne | Équipe, tenant |
| Compteurs | Pour soi | Pour l'équipe, avec indicateurs |
| Engagement | Aucun | Retards et éléments à risque |
| Droits d'accès | Ceux de la personne | Audience définie, plus droits de lecture des éléments |

Les compteurs d'une file suivent le même filtre de droits que sa liste (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)). Le nombre de files est limité par tenant, et la complexité d'un filtre est bornée (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

#### Les modèles de tâche

```json
{
  "template": "inspection_a_check",
  "version": 3,
  "title": "Inspection A — {aircraft.registration}",
  "checklist": [
    { "key": "visual", "label": "Contrôle visuel du train d'atterrissage", "required": true },
    { "key": "fluids", "label": "Niveaux de fluides", "required": true },
    { "key": "report", "label": "Rapport signé", "required": true, "verifier": true }
  ],
  "assign": { "strategy": "pool", "role": "technician", "scope": "aircraft.base" },
  "due": { "after": "P2D", "calendar": "business_hours" },
  "priority": 2,
  "completion": "all_required_items_checked"
}
```

**Comment la lire.** Le modèle fige ce qui doit être répété : le titre, la liste de contrôle, la stratégie d'affectation, l'échéance relative, la règle d'achèvement. Il laisse libre ce qui varie : le sujet, les paramètres, et la date de départ.

- **Instanciation** par une personne (« créer depuis un modèle »), par une règle (échéance d'inspection), ou par une étape de workflow.
- **Version.** L'instance garde la version du modèle. Une nouvelle version ne s'applique qu'aux instances créées ensuite, sauf migration explicite (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).
- **Liste de contrôle ou sous-éléments.** Une ligne de liste de contrôle n'est pas un élément : pas de responsable, pas d'échéance. Quand une étape mérite un responsable ou une échéance propres, on en fait un sous-élément.
- **Séparation des tâches.** Une ligne marquée `verifier` ne peut pas être cochée par l'exécutant (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).

Un modèle est un objet de configuration comme un autre : brouillon, validation, simulation, publication (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)). Les modèles livrés avec une solution métier forment une partie de ce que le module 23 du [plan des compléments](../PLAN-COMPLEMENTS.md#module-23--solutions-verticales-packagées-et-personnalisation-durable) appelle un paquet de solution.

#### Les rappels personnels

| Aspect | Règle |
|---|---|
| Propriétaire | La personne qui le crée, seule |
| Déclencheur | Une date, une heure relative à un objet, ou un événement (« quand F-ABCD repasse en service ») |
| Récurrence | Règle de récurrence normalisée (RFC 5545), dans le fuseau de la personne (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Rendu | Élément « personnel » dans la boîte, et notification à l'échéance (voir [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires)) |
| Engagement | Aucun : hors des taux de retard d'équipe |
| Visibilité | Privée, y compris pour l'administrateur du tenant, sauf obligation légale |
| Report | Possible, sans limite de principe |

Un rappel peut se **convertir** en élément partagé quand il devient un vrai travail : il entre alors dans le champ des engagements et de l'affectation.

#### La vue de charge

La **loi de Little** (voir [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)) relie l'arriéré, le débit d'arrivée et le temps de traitement :

$$L = \lambda \times W$$

où $L$ est le nombre moyen d'éléments dans le système (l'arriéré), $\lambda$ le débit d'arrivée (éléments par jour) et $W$ le temps moyen passé dans le système (en jours). Elle vaut pour un système en régime stable.

**Exemple chiffré.** Une équipe reçoit $\lambda = 12$ éléments par jour, et les traite en moyenne en $W = 2$ jours. L'arriéré moyen est $L = 12 \times 2 = 24$ éléments. Si le temps de traitement double (4 jours), l'arriéré moyen double aussi : 48 éléments. Si l'équipe ne peut traiter que 10 éléments par jour alors que 12 arrivent, le système n'est plus stable : l'arriéré croît de 2 éléments par jour, sans limite.

| Mesure | Question | Remarque |
|---|---|---|
| Éléments ouverts, par équipe | Quelle est la taille de l'arriéré ? | À rapprocher de la capacité |
| Éléments à échéance sous 48 heures | Que doit-on tenir ? | Peut alimenter une alerte |
| Âge de l'élément le plus ancien | Quelque chose est-il oublié ? | Détecte les famines |
| Charge prévue sur 5 jours, rapportée à la capacité | L'équipe va-t-elle tenir ? | Utilise un effort estimé |

$$\text{taux de charge} = \frac{\text{effort estimé des éléments ouverts}}{\text{capacité disponible sur la période}}$$

La capacité tient compte des absences déclarées (voir [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence)). Au-dessus de 1, l'équipe ne peut pas tout traiter dans la période.

**Protéger la vue.** Une vue de charge parle de personnes.

- **Agréger par défaut** : la vue d'équipe est la règle, le détail individuel est réservé à la personne et à son responsable.
- **Éviter les classements** de personnes, et les compteurs de « productivité » qui s'en déduisent.
- **Documenter** l'usage, car selon les pays, la surveillance de l'activité des salariés relève du droit du travail et de la protection des données : la plateforme fournit des garde-fous, l'organisation décide de leur usage.

#### Les modes de défaillance

- **Une prolifération de files** : personne ne sait laquelle consulter.
- **Un modèle qui dérive** : copié et modifié dans chaque équipe, il n'y a plus de pratique commune.
- **Une charge mesurée en nombre d'éléments** alors que leurs efforts diffèrent de un à cinquante.
- **Un rappel qui devient une affectation déguisée** : on y met des demandes à d'autres.
- **Une vue de charge détournée** en outil de classement individuel.

**Contre-exemple.** Une équipe affiche publiquement le nombre d'éléments clos par personne. Les personnes choisissent les éléments faciles, laissent les cas complexes, et l'arriéré des éléments difficiles s'allonge.

**Limites.** La charge mesurée est une approximation : l'effort estimé est souvent faux, et la capacité d'une équipe fluctue. On l'utilise comme un indicateur d'alerte, pas comme une vérité.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Les files filtrent la boîte de tâches ; les rappels y sont des éléments personnels |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les niveaux de partage des vues s'appliquent aux files |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | Les vues enregistrées et leur définition |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Les modèles suivent le versionnement des workflows |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La loi de Little lit la charge et l'arriéré |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Rappels récurrents, calendriers de capacité |
| [17.9 Affectation, prise en charge, réaffectation et absence](#179-affectation-prise-en-charge-réaffectation-et-absence) | Les absences réduisent la capacité |
| [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) | Les indicateurs d'engagement d'une file viennent des horloges |
| [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | Les limites de nombre et de complexité, et le parcours de publication |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, la responsable de la base LYS ne sait pas combien d'inspections sont ouvertes, ni si l'équipe tiendra la semaine. Chaque technicien tient ses propres notes de rappel. Les inspections A sont créées à la main, et leurs listes de contrôle varient d'une personne à l'autre.

**Problème.** Le travail est organisé de façon informelle, sans files, sans modèle commun, et sans lecture de la charge.

**Application du concept.** Le tenant crée des files, un modèle d'inspection et une vue de charge d'équipe.

**Déroulé.**

1. L'administrateur définit les files « À prendre — techniciens LYS » et « En attente de décision (LYS) ».
2. Le modèle `inspection_a_check` v3 est publié avec sa liste de contrôle et son échéance de deux jours ouvrés.
3. Une règle d'échéance instancie le modèle pour chaque aéronef concerné : douze éléments arrivent dans le pool.
4. Karim se crée un rappel « relancer le fournisseur jeudi », visible de lui seul.
5. La responsable consulte la vue de charge de l'équipe : 24 éléments ouverts, arrivée de 12 par jour, temps moyen de 2 jours. La capacité de 10 par jour prévue pour la semaine indique un taux de charge supérieur à 1.
6. Elle ajoute deux personnes en renfort pour la semaine.

**Résultat.** Le travail répété suit un modèle commun, chacun garde ses rappels, et la charge est lue en amont du retard.

**Limites.** La vue de charge n'est pas un outil d'évaluation individuelle : elle reste agrégée par équipe, et les détails par personne sont réservés à la personne et à son responsable, selon la politique du tenant.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui distingue une file enregistrée d'une vue personnelle ?
2. **Compréhension.** Pourquoi une instance garde-t-elle la version du modèle qui l'a créée ?
3. **Compréhension.** Quelle différence y a-t-il entre une ligne de liste de contrôle et un sous-élément ?
4. **Pourquoi.** Pourquoi protège-t-on la vue de charge ?
5. **Raisonnement pratique.** Une équipe reçoit 8 éléments par jour et les traite en 3 jours en moyenne. Quel est l'arriéré moyen, et que devient-il si le temps de traitement passe à 6 jours ?

#### Réponses

1. Une file est partagée, avec un périmètre d'affectation, une audience, des compteurs d'équipe et des indicateurs d'engagement. Une vue personnelle ne sert qu'à son propriétaire, sans engagement.
2. Pour qu'un changement du modèle ne bouleverse pas les éléments en cours (lignes cochées, échéances) : une nouvelle version ne s'applique qu'aux instances créées ensuite, sauf migration décidée.
3. Une ligne de liste de contrôle n'a ni responsable, ni échéance, ni notification propres : elle fait partie de l'élément. Un sous-élément est un élément de travail complet, avec son responsable et son échéance.
4. Parce qu'elle porte sur des personnes : mal utilisée, elle devient un outil de pression ou de surveillance, avec des effets pervers et des risques juridiques. On agrège par équipe, on évite les classements, et l'on documente l'usage.
5. $L = \lambda \times W = 8 \times 3 = 24$ éléments. Avec $W = 6$ jours : $8 \times 6 = 48$ éléments. L'arriéré double quand le temps de traitement double.

## 17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail

### 1. Comprendre simplement

Quand le serveur doit informer le client d'un fait à un moment imprévisible, trois techniques se partagent le terrain. L'**interrogation périodique** (*polling*) : le client redemande à intervalles réguliers. Les **événements envoyés par le serveur** (*server-sent events*, SSE) : le client ouvre une connexion HTTP que le serveur garde ouverte pour y pousser des messages. Le **WebSocket** : un canal persistant et bidirectionnel, ouvert par une négociation HTTP. La **diffusion en éventail** (*fan-out*) est la distribution d'un même message à un grand nombre de clients connectés.

**Pourquoi cela existe.** Sans mise à jour automatique, la personne recharge la page, les compteurs restent faux, les écrans partagés divergent et une collaboration paraît morte. L'interrogation à haute fréquence règle le problème, mais gaspille des requêtes et ne tient pas à l'échelle.

**Problème résolu.** Garder ce que la personne voit à jour avec ce qui se passe, sans rechargement manuel, à un coût maîtrisé et sans compromettre les droits.

**Modèle mental.** Attendre un colis. L'interrogation, c'est aller voir la boîte aux lettres toutes les cinq minutes. Les événements serveur, c'est un abonnement où le standard vous rappelle quand quelque chose arrive. Le WebSocket est une ligne téléphonique laissée ouverte dans les deux sens. La diffusion en éventail est le haut-parleur d'une gare : un message, mille oreilles.

**Où l'analogie s'arrête.** Une ligne téléphonique relie deux personnes. Ici, un serveur tient des milliers de lignes ouvertes, chacune consomme de la mémoire, doit être authentifiée et autorisée, et se coupe puis se rétablit au gré du réseau.

**Exemple.** L'en-tête de la plateforme affiche deux compteurs : activités à faire et notifications non lues. Quand une activité est assignée à Karim, le badge passe de 3 à 4 en quelques secondes. Si la connexion se coupe dans un tunnel, l'interface passe en interrogation toutes les 60 secondes et rattrape ce qu'elle a manqué à la reconnexion.

**Les composants.**

1. un **transport** (interrogation, flux serveur, WebSocket) ;
2. un **gestionnaire de connexions** par nœud ;
3. un **registre d'abonnements** (canaux, tenants, personnes) ;
4. une **couche de diffusion** reliée au bus d'événements ;
5. un **curseur** de séquence pour rattraper ;
6. un contrôle d'**authentification et d'autorisation** ;
7. une **dégradation** vers l'interrogation.

**Objectif d'apprentissage :** vous pouvez comparer les trois transports, expliquer pourquoi le temps réel ne remplace jamais la lecture de la vérité, et décrire la diffusion en éventail au niveau d'une passerelle.

### 2. Connaissances essentielles

#### Définition

- **Interrogation périodique** (*polling*) : technique par laquelle le client envoie des requêtes à intervalles réguliers pour savoir si quelque chose a changé. L'**interrogation longue** (*long polling*) en est une variante : le serveur retient la réponse jusqu'à ce qu'un fait survienne ou qu'un délai expire.
- **Événements envoyés par le serveur** (*server-sent events*) : flux à sens unique, du serveur vers le client, sur une connexion HTTP maintenue ouverte, au format `text/event-stream`, défini par le standard HTML du WHATWG.
- **WebSocket** : protocole de communication bidirectionnelle sur une connexion persistante, ouverte par une requête HTTP de type `Upgrade`, normalisé par la RFC 6455.
- **Diffusion en éventail** (*fan-out*) : distribution d'un message à de nombreux destinataires, ici les clients connectés intéressés par un canal.

#### Idées fondamentales

1. **Le temps réel est une optimisation de la fraîcheur, pas une garantie.** La vérité se lit par requête ; le message poussé dit seulement qu'il faut regarder.
2. **Le transport suit la direction des échanges.** Descendant seul : flux serveur ; interactif dans les deux sens : WebSocket ; simple et tolérant au délai : interrogation.
3. **Une connexion persistante a un coût.** Mémoire, descripteurs, battements, authentification : elle se compte et se limite.
4. **Le message poussé porte un curseur.** Il permet de détecter un trou et de rattraper par une lecture.
5. **La diffusion passe par un bus.** Chaque nœud ne connaît que ses propres connexions.
6. **L'application fonctionne sans temps réel.** L'interrogation est le repli, jamais une régression.

#### Vocabulaire essentiel

- **Canal** (*channel*, *topic*) : nom auquel les clients s'abonnent pour recevoir un type de messages.
- **Battement** (*heartbeat*, *keep-alive*) : message périodique qui maintient la connexion ouverte et révèle sa coupure.
- **Ping et pong** : trames de contrôle du WebSocket, pour vérifier que l'autre extrémité répond.
- **Curseur** (*cursor*) : identifiant ou numéro de séquence du dernier message reçu.
- **Resynchronisation** (*resync*) : lecture par requête de ce qui a été manqué, à partir d'un curseur.
- **Consommateur lent** (*slow consumer*) : client qui ne lit pas assez vite et fait grossir la mémoire du serveur.
- **Contre-pression** (*backpressure*) : mécanisme qui ralentit ou coupe l'envoi vers un consommateur lent.
- **Diffusion à l'écriture ou à la lecture** (*fan-out on write*, *fan-out on read*) : copier un message dans la boîte de chaque destinataire à l'émission, ou le lire à la demande dans un flux commun.

#### Relations de cause à effet

- Le temps réel est traité comme la vérité. Une coupure réseau laisse l'écran faux, sans que la personne le sache.
- Chaque onglet ouvre une connexion et le serveur n'en limite pas le nombre. Une personne avec dix onglets coûte dix fois plus.
- Le jeton d'accès est placé dans l'adresse de connexion. Il se retrouve dans les journaux des intermédiaires.
- L'autorisation n'est vérifiée qu'à la connexion. Après le retrait d'un droit, la personne continue de recevoir des messages sur ce qu'elle ne peut plus voir.
- Un message rare est poussé à tous les clients d'un tenant, quel que soit leur intérêt. La charge et les fuites augmentent.

#### Idées reçues

- **« Le WebSocket est toujours meilleur. »** Non. Il demande plus d'infrastructure et de discipline, et le flux serveur couvre la plupart des besoins descendants.
- **« Le temps réel supprime le besoin d'interroger. »** Non. Il faut rattraper après une coupure, et recharger à l'ouverture.
- **« Il suffit de pousser le contenu. »** Souvent non. Pousser un identifiant et laisser le client relire est plus sûr au regard des droits.

#### Principe clé

Le push signale, la requête établit : le serveur pousse de quoi savoir qu'il faut regarder, avec un curseur ; le client lit la vérité, et l'application fonctionne sans le push.

#### Si vous ne retenez que trois choses

1. Interrogation, flux serveur et WebSocket répondent à des besoins différents ; le choix suit la direction des échanges et l'infrastructure.
2. Une connexion persistante est authentifiée, autorisée, limitée, et elle porte un curseur pour rattraper les messages manqués.
3. La diffusion en éventail passe par un bus et des canaux filtrés par les droits ; l'application reste utilisable sans temps réel.

### 3. Explication technique détaillée

#### Comparer les transports

| Critère | Interrogation | Interrogation longue | Flux serveur (SSE) | WebSocket |
|---|---|---|---|---|
| Direction | Requêtes du client | Requêtes du client, réponse retenue | Serveur vers client | Bidirectionnelle |
| Protocole | HTTP | HTTP | HTTP, `text/event-stream` | HTTP puis protocole WebSocket (RFC 6455) |
| Reconnexion | Naturelle | À gérer | Automatique, avec reprise par `Last-Event-ID` | À gérer par l'application |
| Intermédiaires (proxys, équilibreurs) | Aucun souci | Délais d'attente à régler | Bonne compatibilité, tamponnage possible | Variable selon les équipements |
| Coût serveur | Beaucoup de requêtes | Connexions en attente | Connexions ouvertes | Connexions ouvertes |
| Quand | Simple, tolérant au délai | Repli | Notifications, compteurs, flux descendants | Échanges interactifs (collaboration, présence) |

La RFC 6202 documente les limites de l'interrogation longue et du flux sur HTTP : surcoût des en-têtes, intermédiaires qui tamponnent les réponses, et recommande des délais de l'ordre d'une trentaine de secondes, la désactivation du cache et la limitation des connexions simultanées.

#### Le flux serveur

```text
id: 1042
event: counters
data: {"assigned": 4, "pool_available": 3}

id: 1043
event: notification
data: {"id": "nt_55a1", "type": "finding_critical"}

```

**Comment la lire.** Le serveur répond avec le type de contenu `text/event-stream`, en UTF-8, et garde la connexion ouverte. Chaque message est une suite de champs terminée par une ligne vide. `event` nomme le type, `data` porte la charge, `id` fixe le dernier identifiant reçu. Un champ `retry` règle le délai de reconnexion, en millisecondes. Si la connexion se coupe, le navigateur se reconnecte seul et envoie l'en-tête `Last-Event-ID` avec le dernier identifiant : le serveur peut reprendre là. Le client est l'objet `EventSource`, qui n'accepte qu'une adresse et l'option `withCredentials`, sans en-têtes personnalisés.

| Point d'attention | Conséquence |
|---|---|
| Pas d'en-tête personnalisé avec `EventSource` | On s'appuie sur un cookie de session (`withCredentials`) ou sur un ticket à usage unique, court |
| Sens unique | Les actions du client passent par des requêtes ordinaires |
| Limite de connexions en HTTP/1.1 | Environ 6 par navigateur et par domaine, tous onglets confondus ; en HTTP/2, le plafond de flux simultanés est négocié et vaut 100 par défaut |

#### Le WebSocket

```text
GET /realtime HTTP/1.1
Host: app.plateforme.example
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: <valeur aléatoire en base 64>
Sec-WebSocket-Version: 13
Origin: https://app.plateforme.example

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: <valeur calculée à partir de la clé>
```

**Comment la lire.** La connexion commence comme une requête HTTP de type `GET` avec `Upgrade: websocket`. Le serveur répond 101, et la connexion passe au protocole WebSocket. Ensuite, chaque côté envoie des **trames** de données ou de contrôle (`ping`, `pong`, `close`) quand il veut. L'en-tête `Origin` indique le site d'où vient la page : le serveur peut refuser une origine qu'il n'accepte pas, et c'est son rôle de le faire.

**Sécurité.**

- **Vérifier l'origine** à l'établissement. Sans cela, une page d'un autre site pourrait ouvrir une connexion avec les cookies de la personne.
- **Authentifier la connexion** et **autoriser chaque abonnement** : le droit de recevoir un canal n'est pas celui de s'y connecter.
- **Ne pas mettre de jeton durable dans l'adresse** : elle apparaît dans les journaux. On utilise un ticket à usage unique, court, échangé à l'ouverture.
- **Revérifier les droits** à l'expiration du jeton, et couper les abonnements dont le droit a disparu.
- **Limiter** le nombre de connexions par personne et la taille des messages entrants.

#### La diffusion en éventail

```text
événement métier ─► bus d'événements ─► passerelle temps réel (plusieurs nœuds)
                         (7.3)           │ registre : quelles connexions suivent quels canaux
                                         ├─► nœud 1 ─► connexions A, B, C
                                         └─► nœud 2 ─► connexions D, E
```

Les **canaux** portent le tenant dans leur nom et se limitent à ce que la personne peut voir.

| Canal | Contenu | Qui peut s'abonner |
|---|---|---|
| `tenant/{t}/user/{u}/counters` | Compteurs de la personne | La personne |
| `tenant/{t}/queue/{q}` | Changements d'une file | Les membres de l'audience de la file |
| `tenant/{t}/subject/{type}/{id}` | Changements d'un objet | Les personnes qui peuvent lire l'objet |

**Que pousser ?** Deux modèles.

| Modèle | Principe | Avantage | Risque |
|---|---|---|---|
| Invalider et relire | Le message dit « le compteur a changé » ; le client relit | Droits appliqués à la lecture ; messages petits | Une requête de plus par changement |
| Pousser le contenu | Le message porte les données | Affichage immédiat | Il faut filtrer par destinataire, et le contenu peut fuiter |

Pour les compteurs et les listes, « invalider et relire » est le choix sûr.

**Diffusion à l'écriture ou à la lecture.** Pour un fil d'activité (voir [17.14 Commentaires, mentions, fils de discussion et fil d'activité](#1714-commentaires-mentions-fils-de-discussion-et-fil-dactivité)), on peut copier chaque entrée dans le flux de chaque destinataire à l'émission (rapide à lire, coûteux à l'écriture quand il y a beaucoup de suiveurs), ou la lire à la demande dans le flux commun (peu coûteux à l'écriture, plus lent à la lecture). Beaucoup de systèmes combinent les deux selon le nombre de suiveurs.

#### Fiabilité

- **Au mieux, pas au moins une fois.** Un message poussé peut se perdre ou arriver en double.
- **Numéroter** les messages par canal : un trou dans la séquence déclenche une relecture depuis le dernier curseur reçu.
- **Appliquer de façon idempotente** : un message rejoué ne change rien (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- **Coalescer** : pour les compteurs, seule la dernière valeur compte, et l'on peut fusionner les messages en attente.
- **Se dégrader** : en cas de panne de la passerelle, les clients passent en interrogation avec temporisation (voir [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)).

#### Capacité

Le nombre de connexions est proche de celui des personnes actives multiplié par le nombre d'onglets ouverts.

$$C \approx U \times o$$

où $C$ est le nombre de connexions simultanées, $U$ le nombre de personnes actives et $o$ le nombre moyen d'onglets par personne. Avec $U = 20\,000$ et $o = 1{,}5$, on obtient 30 000 connexions. Si chacune coûte environ 50 Ko de mémoire (valeur d'exemple à mesurer), il faut prévoir environ 1,5 Go pour les seules connexions, avant les tampons d'envoi. On mesure plutôt qu'on ne suppose (voir [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)).

**Battements.** Les équilibreurs de charge et les pare-feu coupent les connexions inactives après un délai. On envoie un battement plus fréquent que ce délai, et l'on déclare la connexion morte si un `pong` n'arrive pas.

#### Les modes de défaillance

- **Une tempête de reconnexions** après une panne : tous les clients reviennent en même temps. On ajoute temporisation et aléa (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
- **Un consommateur lent** qui fait gonfler la mémoire du serveur.
- **Un droit retiré non appliqué** : la connexion continue à recevoir.
- **Un trou non détecté** : l'écran reste faux sans que rien ne le signale.
- **Un équilibreur qui tamponne** les réponses du flux serveur : les messages arrivent par paquets.

**Contre-exemple.** Une plateforme pousse le contenu complet des activités sur un canal « tenant ». Une personne qui n'a pas le droit de lire un constat reçoit tout de même son titre, parce que le filtre était appliqué à l'affichage, pas à la diffusion.

**Limites.** Un transport persistant ne garantit rien sur la livraison, et complexifie l'exploitation (équilibrage, déploiements sans coupure, observabilité). Pour des besoins modestes, une interrogation toutes les 30 à 60 secondes est un choix raisonnable, et plus simple.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Le bus d'événements alimente la passerelle |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Un webhook est une livraison de serveur à serveur ; le temps réel va du serveur au client |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | Le temps réel réduit le retard de cohérence à terme, sans le supprimer |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les canaux et les messages suivent les droits de lecture |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Le tenant est porté par chaque canal et chaque connexion |
| [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive) | La dégradation vers l'interrogation |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La capacité en connexions se mesure |
| [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison) | Le canal d'application et le mobile sont des adaptateurs distincts |
| [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture) | Compteurs et état de lecture utilisent ce transport |
| [17.15 Présence et édition collaborative](#1715-présence-et-édition-collaborative) | La présence et l'édition collaborative reposent sur le WebSocket |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, les compteurs de l'en-tête ne se mettent à jour qu'au rechargement de la page. Les responsables laissent un onglet ouvert toute la journée et découvrent les décisions en attente par hasard.

**Problème.** L'écran n'est jamais frais, et rafraîchir toutes les 5 secondes charge l'API sans fin.

**Application du concept.** La plateforme ajoute un flux serveur pour les compteurs, avec interrogation en repli.

**Déroulé.**

1. À l'ouverture, le client lit les compteurs par une requête, et ouvre un flux serveur avec un ticket à usage unique.
2. La passerelle abonne la connexion au canal `tenant/ten_airline_01/user/u_karim/counters` après vérification des droits.
3. Une activité est assignée à Karim. Le bus d'événements transmet l'événement à la passerelle, qui envoie `event: counters` avec l'identifiant 1042.
4. Le client reçoit le message, voit que le compteur a changé, et relit les compteurs par requête.
5. Karim passe dans un tunnel : la connexion se coupe. À la reconnexion, le navigateur envoie `Last-Event-ID: 1042`, et la passerelle relit les changements depuis ce curseur.
6. Si la passerelle est indisponible, le client passe en interrogation toutes les 60 secondes.

**Résultat.** Les compteurs se mettent à jour en quelques secondes, l'écran reste utilisable sans temps réel, et aucun contenu confidentiel ne circule sur le canal.

**Limites.** Le flux serveur ne sert qu'au sens descendant : les actions passent toujours par des requêtes ordinaires. Les échanges interactifs (présence, co-édition) demandent un WebSocket (voir [17.15 Présence et édition collaborative](#1715-présence-et-édition-collaborative)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre l'interrogation, le flux serveur et le WebSocket ?
2. **Compréhension.** Que fait le navigateur quand une connexion de flux serveur se coupe ?
3. **Compréhension.** Pourquoi vérifie-t-on l'en-tête `Origin` à l'ouverture d'un WebSocket ?
4. **Pourquoi.** Pourquoi pousse-t-on souvent « le compteur a changé » plutôt que le contenu ?
5. **Raisonnement pratique.** Avec 12 000 personnes actives et 2 onglets en moyenne, combien de connexions la passerelle doit-elle tenir, et que fait-on pour les équilibreurs de charge qui coupent après 60 secondes d'inactivité ?

#### Réponses

1. L'interrogation consiste à redemander à intervalles réguliers. Le flux serveur est une connexion HTTP maintenue ouverte, dans le sens serveur vers client, avec reconnexion automatique. Le WebSocket est un canal persistant et bidirectionnel, ouvert par une requête HTTP `Upgrade`.
2. Il attend le délai de reconnexion, puis se reconnecte seul, en envoyant l'en-tête `Last-Event-ID` avec le dernier identifiant reçu, ce qui permet au serveur de reprendre le flux.
3. Parce que le serveur peut ainsi refuser les connexions d'un site qu'il n'accepte pas. Sans vérification, une page d'un autre site pourrait ouvrir une connexion avec les cookies de la personne.
4. Parce que les droits sont alors appliqués à la lecture, par la requête, et non à la diffusion. Le message est petit, et ne risque pas de livrer à un client un contenu qu'il n'a pas le droit de voir.
5. $C \approx U \times o = 12\,000 \times 2 = 24\,000$ connexions. On envoie un battement plus fréquent que le délai de l'équilibreur, par exemple toutes les 25 à 30 secondes, et on déclare la connexion morte si la réponse n'arrive pas.

## 17.13 Compteurs de non-lus et synchronisation de l'état de lecture

### 1. Comprendre simplement

Un **compteur de non-lus** (*unread counter*) est le nombre affiché sur une pastille pour indiquer combien d'éléments n'ont pas encore été vus : notifications, messages d'un fil, éléments d'une file. La **synchronisation de l'état de lecture** (*read state synchronization*) fait en sorte que ce qui est lu sur un appareil le soit aussi sur les autres, et que le compteur reste cohérent partout.

**Pourquoi cela existe.** La pastille est le premier moteur d'attention d'une interface. Si elle ment, parce qu'elle ne retombe jamais à zéro ou qu'elle compte des éléments inaccessibles, la confiance disparaît, et les personnes cessent de la regarder. Sans synchronisation, on relit sur son téléphone ce qu'on vient de lire à son poste de travail.

**Problème résolu.** Afficher un nombre juste, peu coûteux à calculer, et identique sur tous les écrans de la personne.

**Modèle mental.** Le marque-page d'un livre que plusieurs lecteurs se partagent : un seul marque-page dit « lu jusqu'ici », ou bien des cases cochées chapitre par chapitre. Chacun doit voir le même état.

**Où l'analogie s'arrête.** Un livre ne reçoit pas de nouveaux chapitres pendant qu'on le lit, et ne se lit pas sur plusieurs appareils à la fois. Ici, de nouveaux éléments arrivent sans cesse, et plusieurs écrans modifient l'état au même moment.

**Exemple.** Nadia lit cinq notifications sur son poste de travail. Sur son téléphone, la pastille passe de 12 à 7 en quelques secondes. Elle utilise ensuite « tout marquer comme lu avant 12 h » : ce qui est arrivé à 12 h 01 reste non lu.

**Les composants.**

1. une **définition** de ce que compte chaque compteur ;
2. un **état de lecture** par élément, ou un **marqueur** par flux ;
3. un **calcul** du compteur (à la demande, maintenu, borné) ;
4. un **filtre de droits** identique à celui de la liste ;
5. une **diffusion** des changements entre écrans (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)) ;
6. une **règle de fusion** monotone ;
7. une **annonce accessible** des changements.

**Objectif d'apprentissage :** vous pouvez choisir une méthode de calcul pour un compteur, expliquer pourquoi l'état « lu » se fusionne facilement, et décrire ce que fait « tout marquer comme lu ».

### 2. Connaissances essentielles

#### Définition

- **Compteur de non-lus** : nombre d'éléments, parmi un ensemble défini et filtré par les droits de la personne, dont l'état de lecture est « non lu ».
- **État de lecture** : propriété d'un élément pour une personne donnée, qui dit si elle l'a vu, indépendante de l'état d'une action éventuelle (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)).
- **Synchronisation de l'état de lecture** : propagation et fusion des changements d'état de lecture entre les appareils et les onglets d'une même personne.

#### Idées fondamentales

1. **Un compteur compte une chose précise.** « Non lues », « à traiter », « mentions » : jamais « tout ».
2. **L'état de lecture est monotone.** Un élément lu reste lu, sauf marquage explicite « non lu ». C'est ce qui rend la fusion simple.
3. **Deux représentations sont possibles.** Un drapeau par élément, ou un marqueur « lu jusqu'ici » par flux.
4. **Le compteur suit le même filtre de droits que la liste.** Sans cela, il révèle ce qu'on ne peut pas voir (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
5. **La synchronisation combine diffusion et relecture.** La première est rapide, la seconde est fiable (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)).
6. **Un compteur peut être faux un instant, jamais durablement.** Il se recalcule, et l'écart est borné.

#### Vocabulaire essentiel

- **Pastille** (*badge*) : indicateur numérique affiché sur une icône ou un onglet.
- **Drapeau de lecture** (*read flag*) : état lu ou non lu stocké par élément.
- **Marqueur de lecture** (*read marker*, *high-water mark*) : numéro de séquence du dernier élément lu d'un flux.
- **Marquer tout comme lu** (*mark all as read*) : opération qui passe à « lu » un ensemble borné dans le temps.
- **Compteur maintenu** (*maintained counter*) : valeur stockée, incrémentée et décrémentée à chaque changement.
- **Dérive** (*drift*) : écart entre le compteur stocké et la valeur réelle.
- **Affichage plafonné** (*capped display*) : valeur limitée à un seuil d'affichage (« 99+ »).
- **Ensemble à croissance seule** (*grow-only set*) : ensemble dont les éléments ne font que s'ajouter, et que l'on fusionne par union.

#### Relations de cause à effet

- Le compteur est maintenu par incréments, sans recalcul. Un message perdu ou rejoué fait dériver le nombre, qui ne retombe plus à zéro.
- Le compteur n'applique pas les droits. Il annonce « 3 » alors que la personne n'en voit que 2.
- « Tout marquer comme lu » ne borne pas l'instant. Les éléments arrivés pendant l'opération sont marqués lus sans avoir été vus.
- Deux onglets modifient l'état sans règle de fusion. Le dernier écrit gagne, et un élément lu repasse à « non lu ».
- Le compteur compte les non-lus pour un très grand flux sans plafond. Le calcul devient coûteux, et ralentit chaque affichage.

#### Idées reçues

- **« Lu veut dire traité. »** Non. La lecture et l'action sont deux dimensions (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)).
- **« Le compteur doit être exact à la seconde. »** Non. Il doit être juste à l'ordre de quelques secondes, et se corriger tout seul.
- **« Un drapeau par élément est toujours le meilleur choix. »** Non. Pour un flux volumineux, un marqueur est bien moins coûteux.

#### Principe clé

Un compteur se définit précisément, se calcule avec le filtre de droits de la liste, et se fusionne entre écrans par une règle monotone, avec un recalcul qui borne toute dérive.

#### Si vous ne retenez que trois choses

1. Un compteur compte une définition précise, avec le même filtre de droits que la liste.
2. Lu est un état monotone : la fusion entre écrans se fait par union ou par maximum, sans conflit.
3. Un compteur maintenu dérive : on le recalcule, et l'on plafonne l'affichage pour les grands nombres.

### 3. Explication technique détaillée

#### Ce que l'on compte

| Compteur | Définition | Portée | Retombe à zéro par |
|---|---|---|---|
| Notifications non lues | Notifications dont l'état de lecture est « non lu » | La personne | Lecture ou « tout marquer comme lu » |
| Actions en attente | Notifications actionnables dont l'action est en attente | La personne | Traitement de l'élément visé |
| Non-lus d'un fil | Commentaires postérieurs au marqueur de lecture du fil | Le fil et la personne | Ouverture du fil |
| Éléments à prendre | Éléments du pool éligibles et libres | La personne | Prise en charge par quelqu'un |

Le compteur d'activités ouvertes n'est pas un compteur de non-lus : il compte du travail restant, pas de l'information non vue (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)).

#### Calculer un compteur

| Méthode | Principe | Avantage | Limite |
|---|---|---|---|
| À la demande | `COUNT` sur les éléments non lus | Toujours exact | Coût proportionnel au volume |
| Borné | `COUNT` avec une limite, affichage « 99+ » | Coût constant | Pas de valeur exacte au-delà du plafond |
| Maintenu | Valeur stockée, incrémentée et décrémentée | Lecture instantanée | Dérive possible, à recalculer |
| Par marqueur | Éléments dont la séquence dépasse le marqueur de lecture | Une seule ligne par flux et par personne | Les exceptions (« marquer non lu ») demandent une liste complémentaire |

```sql
SELECT count(*) AS unread
FROM (
  SELECT 1
  FROM notification
  WHERE tenant_id = :tenant_id
    AND recipient_id = :user_id
    AND read_state = 'unread'
  LIMIT 100
) AS capped;
```

**Comment la lire.** La requête s'arrête à 100 lignes. Si elle en retourne 100, l'interface affiche « 99+ ». Le coût ne dépend plus du volume, ce qui convient à une pastille, car personne n'agit différemment à 340 ou à 3 400.

#### Un marqueur de lecture

```sql
CREATE TABLE read_marker (
  tenant_id   uuid        NOT NULL,
  user_id     uuid        NOT NULL,
  stream      text        NOT NULL,
  last_seq    bigint      NOT NULL,
  updated_at  timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, user_id, stream)
);

UPDATE read_marker
SET last_seq = CASE WHEN :seq > last_seq THEN :seq ELSE last_seq END,
    updated_at = now()
WHERE tenant_id = :tenant_id AND user_id = :user_id AND stream = :stream;
```

**Comment la lire.** Une ligne par personne et par flux (un fil, une file) porte le dernier numéro de séquence lu. La mise à jour est **monotone** : elle ne fait jamais reculer le marqueur, même si deux écrans écrivent dans le désordre. Le nombre de non-lus est le nombre d'éléments du flux dont la séquence dépasse `last_seq`. Pour « tout marquer comme lu avant 12 h », on place le marqueur sur la plus grande séquence antérieure à 12 h : ce qui arrive après reste non lu.

#### La fusion entre écrans

```text
écran A : lit les éléments 40 à 45  ─► serveur : marqueur = 45 ─► diffuse « lecture jusqu'à 45 »
écran B : reçoit le message          ─► applique max(marqueur local, 45) ─► pastille recalculée
écran B (hors ligne) : lit 46        ─► file locale ─► à la reconnexion : envoie 46 ─► serveur : marqueur = 46
```

L'état « lu » ne fait que croître : fusionner deux états revient à prendre l'union des éléments lus, ou le maximum des marqueurs. Aucune résolution de conflit n'est nécessaire, car l'ordre des opérations ne change pas le résultat. Cette propriété est celle des types de données à convergence automatique (voir [17.15 Présence et édition collaborative](#1715-présence-et-édition-collaborative)).

**Le marquage « non lu ».** Il rompt la monotonie. On l'accompagne d'un horodatage serveur par élément, et la dernière écriture, selon l'horloge du serveur, l'emporte.

#### La synchronisation

1. **Écriture** : l'écran envoie l'opération « lu jusqu'à *n* », idempotente.
2. **Diffusion** : le serveur publie un message court sur le canal de la personne (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)).
3. **Application** : chaque écran fusionne par maximum, puis recalcule sa pastille.
4. **Relecture** : à la reconnexion, ou toutes les minutes en repli, l'écran lit les compteurs par une requête.

**Hors ligne.** Les opérations de lecture se mettent en file locale, et s'envoient à la reconnexion. Comme elles sont idempotentes et monotones, leur ordre ne compte pas.

#### Accessibilité

Un changement de compteur n'est pas visible par une personne qui utilise un lecteur d'écran. Le critère de succès 4.1.3 des WCAG 2.2, « Messages d'état » (niveau AA), demande que les messages d'état soient déterminables par programme, par un rôle ou des propriétés, afin que les technologies d'assistance puissent les annoncer sans déplacer le focus. On annonce donc la mise à jour du compteur avec modération : une annonce par changement significatif, pas à chaque message.

#### Confidentialité

- **Le compteur révèle l'existence.** Il applique le même filtre que la liste.
- **Les pastilles du système d'exploitation** (nombre sur l'icône d'une application mobile) transitent par les services de notifications du fabricant : on n'y envoie que le nombre, rien d'autre (voir [17.4 Adaptateurs de canal et statut de livraison](#174-adaptateurs-de-canal-et-statut-de-livraison)).
- **Pas de comparaison entre personnes.** Un compteur de non-lus est une aide personnelle, pas un indicateur de performance.

#### Les modes de défaillance

- **Une pastille qui ne retombe jamais à zéro** : dérive d'un compteur maintenu, ou éléments inaccessibles comptés.
- **Un double décompte** : le même message de lecture est appliqué deux fois.
- **Un marquage global trop large** : des éléments non vus sont marqués lus.
- **Une divergence entre écrans** : la diffusion a échoué, et aucune relecture n'a corrigé.
- **Un calcul trop coûteux** : un flux de millions d'éléments compté à chaque affichage.

**Contre-exemple.** Une plateforme maintient le compteur par incréments et décrémentations. Un événement de lecture est perdu après une coupure, et la pastille affiche 1 pendant des mois. Les personnes cessent de la consulter, et ratent une décision qui s'y trouvait.

**Limites.** Un compteur plafonné ne dit pas le volume réel, et un marqueur ne représente pas des lectures dans le désordre sans liste d'exceptions. Pour des besoins de preuve de lecture (accusé de réception juridique), le compteur n'est pas la source : on utilise un enregistrement dédié, tracé (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Le transport diffuse les changements d'état et les compteurs |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Les compteurs d'éléments de travail sont distincts des non-lus |
| [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires) | Les notifications portent un état de lecture par destinataire |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Le compteur suit les droits de lecture |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | Un retard borné de cohérence à terme est acceptable |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Les compteurs sont des modèles de lecture, reconstructibles |
| [12.8 Actions en masse](12-produit-ux.md#128-actions-en-masse) | « Tout marquer comme lu » est une action en masse |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | L'état « tout est lu » est un état vide à soigner |
| [17.15 Présence et édition collaborative](#1715-présence-et-édition-collaborative) | La fusion monotone est un cas simple de type à convergence automatique |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, Nadia a deux écrans ouverts. Après avoir tout lu au poste, la pastille de son téléphone affiche encore 12. Le lendemain, la pastille indique 3 alors que sa boîte n'en montre aucune.

**Problème.** Les états de lecture ne se propagent pas, et le compteur maintenu a dérivé.

**Application du concept.** La plateforme remplace les incréments par un calcul borné, ajoute un marqueur de lecture par flux, et diffuse les changements.

**Déroulé.**

1. Nadia ouvre sa boîte au poste et lit les éléments jusqu'au numéro 45.
2. Le serveur applique un maximum monotone : le marqueur passe à 45.
3. Un message court `read_state.changed` part sur le canal personnel de Nadia.
4. Le téléphone applique `max(local, 45)` et recalcule sa pastille : 7 au lieu de 12.
5. La nuit, un événement est perdu : la pastille d'un onglet reste inexacte. À l'ouverture suivante, la relecture des compteurs la corrige.

**Résultat.** Le nombre affiché est le même partout à quelques secondes près, et toute erreur est corrigée à la reconnexion ou à la relecture périodique.

**Limites.** La pastille ne dit rien de l'importance de ce qui reste : un nombre bas peut cacher une décision critique. Les notifications de décision ont leur propre compteur (« actions en attente »).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la fusion de l'état « lu » ne demande-t-elle pas de résolution de conflit ?
2. **Compréhension.** Comment calcule-t-on un compteur de façon bornée ?
3. **Compréhension.** Que fait l'opération « tout marquer comme lu avant 12 h » avec un marqueur de lecture ?
4. **Pourquoi.** Pourquoi le compteur applique-t-il le même filtre de droits que la liste ?
5. **Raisonnement pratique.** Une pastille affiche 1 alors que la liste est vide. Quelles causes envisagez-vous ?

#### Réponses

1. Parce que l'état « lu » est monotone : il ne fait que passer de non lu à lu. Fusionner deux états revient à prendre l'union des lectures, ou le maximum des marqueurs, quel que soit l'ordre des opérations.
2. En limitant la requête à un nombre fixe de lignes, par exemple 100, et en affichant « 99+ » si la limite est atteinte. Le coût ne dépend plus du volume.
3. Elle place le marqueur sur la plus grande séquence d'élément antérieure à 12 h. Les éléments arrivés après restent non lus, et le marqueur ne recule jamais.
4. Parce qu'un compteur plus large que la liste révèle l'existence d'éléments que la personne n'a pas le droit de voir. Les deux doivent partager le même prédicat de droits.
5. Un compteur maintenu qui a dérivé (événement perdu ou rejoué), un compteur en cache non invalidé, ou un élément que la liste filtre (droits, archivage) mais que le compteur compte. On recalcule, et l'on aligne les deux sur un même prédicat.

## 17.14 Commentaires, mentions, fils de discussion et fil d'activité

### 1. Comprendre simplement

Un **commentaire** (*comment*) est un texte écrit par une personne et rattaché à un objet : un constat, une activité, un aéronef. Une **mention** (*mention*) désigne une personne, ou un groupe, dans un commentaire, pour attirer son attention. Un **fil de discussion** (*discussion thread*) regroupe des commentaires qui se répondent. Le **fil d'activité** (*activity feed*) est le flux chronologique de ce qui s'est passé autour d'un objet, d'une équipe ou d'un tenant : il mêle les événements du système et les commentaires.

**Pourquoi cela existe.** Les échanges qui entourent le travail (questions, précisions, accords informels) se perdent dans la messagerie, loin de l'objet et sans trace. Sans mention, une question reste sans réponse. Sans fil, la discussion est un mur de texte. Sans fil d'activité, il faut deviner ce qui a changé.

**Problème résolu.** Garder les échanges au contact de l'objet, adressables, notifiés, tracés, et soumis aux mêmes droits.

**Modèle mental.** Les annotations dans la marge d'un dossier papier, avec des notes nominatives collées sur les pages, et la fiche de suivi qui liste ce qui est arrivé au dossier.

**Où l'analogie s'arrête.** Les annotations papier restent sur le dossier. Ici, un commentaire hérite des droits d'accès de l'objet, déclenche des notifications, peut être modifié ou retiré selon une politique, et fait l'objet d'un audit.

**Exemple.** Sur le constat `fd_204`, Karim écrit : « Usure mesurée à 2,1 mm, voir la photo. » et mentionne Sophie pour confirmer le seuil. Sophie reçoit une notification, répond dans le fil, et marque le fil comme résolu. Le fil d'activité de F-ABCD affiche : « constat créé », « commentaire de Karim », « réponse de Sophie », « fil résolu ».

**Les composants.**

1. un **commentaire** avec auteur, texte, objet et horodatage ;
2. des **mentions** résolues par identifiant ;
3. un **fil** avec état et ancrage ;
4. des **droits** hérités de l'objet ;
5. des **notifications** déclenchées par les événements ;
6. un **fil d'activité** composé d'événements et de commentaires ;
7. une **politique** de modification, de suppression et de conservation.

**Objectif d'apprentissage :** vous pouvez décrire le modèle d'un commentaire et d'une mention, expliquer comment les droits s'appliquent, et distinguer le fil d'activité du journal d'audit.

### 2. Connaissances essentielles

#### Définition

- **Commentaire** : contenu textuel rédigé par une personne, rattaché à un objet, qui hérite de ses droits de lecture et ne constitue pas une décision.
- **Mention** : référence à une personne ou à un groupe dans un commentaire, stockée par identifiant, qui déclenche une notification.
- **Fil de discussion** : ensemble ordonné de commentaires sur un même sujet ou un même ancrage, doté d'un état (ouvert, résolu).
- **Fil d'activité** : flux chronologique, lisible et filtrable, des événements et des commentaires relatifs à un périmètre, sans valeur probante propre (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

#### Idées fondamentales

1. **Un commentaire appartient à un objet et suit ses droits.** Qui peut lire l'objet peut lire ses commentaires, sauf visibilité plus restreinte déclarée.
2. **Une mention est une référence, pas du texte.** Elle se stocke par identifiant, et résiste aux changements de nom.
3. **Mentionner ne donne aucun droit.** Si la personne ne peut pas lire l'objet, la plateforme le dit, et propose une action autorisée.
4. **Un fil a un état et un ancrage.** Il peut porter sur l'objet entier ou sur un champ précis, et se résoudre.
5. **Le fil d'activité n'est pas une preuve.** Il est lisible et pratique ; l'audit est complet et protégé.
6. **Un commentaire n'est pas une décision.** Les décisions passent par l'approbation, liée à une version (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).

#### Vocabulaire essentiel

- **Ancrage** (*anchor*) : point précis auquel un fil est rattaché (un champ, une section).
- **Réponse** (*reply*) : commentaire dans un fil, en réponse à un autre.
- **Résolution d'un fil** (*thread resolution*) : état qui marque une question comme traitée.
- **Suppression douce** (*soft delete*) : retrait d'affichage qui conserve l'enregistrement (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).
- **Historique d'édition** (*edit history*) : suite des versions d'un commentaire (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)).
- **Assainissement** (*sanitization*) : neutralisation du contenu pour empêcher l'exécution de code injecté.
- **Participant** (*participant*) : personne qui a écrit ou été mentionnée dans un fil.
- **Mention de groupe** (*group mention*) : mention d'un rôle ou d'une équipe, qui vise plusieurs personnes.

#### Relations de cause à effet

- Le commentaire est stocké sans lien avec l'objet. Il ne suit pas les droits, et fuit vers des personnes qui n'ont pas accès au constat.
- La mention est stockée comme du texte. Une personne renommée n'est plus retrouvée, et aucune notification ne part.
- La mention ne vérifie pas le droit de lecture. La notification part vers une personne qui cliquera sur un lien refusé, ou, pire, révèle l'existence de l'objet.
- Les commentaires servent à demander des approbations. Aucune décision n'est tracée sur une version, et le dossier n'a pas de preuve.
- Une mention de groupe vise 400 personnes sans plafond. Les notifications inondent la plateforme et les personnes.

#### Idées reçues

- **« Un commentaire est un message. »** Non. Un message va à des destinataires choisis, un commentaire reste sur l'objet et suit ses droits.
- **« Le fil d'activité remplace le journal d'audit. »** Non. Le premier est lisible et partiel, le second est complet et protégé (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- **« Un commentaire modifiable n'a pas besoin d'historique. »** Non. Modifier après coup une réponse déjà lue sans trace permet de réécrire ce qui a été dit.

#### Principe clé

Un commentaire est une trace d'échange attachée à un objet et soumise à ses droits ; la mention est une référence résolue par identifiant, et ni l'un ni l'autre ne remplacent une décision ni une preuve.

#### Si vous ne retenez que trois choses

1. Commentaires et mentions héritent des droits de l'objet, et une mention ne donne aucun accès.
2. Un fil a un état et un ancrage, et le fil d'activité est lisible sans être probant.
3. Les décisions passent par l'approbation, pas par les commentaires.

### 3. Explication technique détaillée

#### Le modèle d'un commentaire

```json
{
  "comment_id": "cm_01HZZ9",
  "tenant_id": "ten_airline_01",
  "subject": { "type": "finding", "id": "fd_204" },
  "thread_id": "th_01HZZ7",
  "author": "u_karim",
  "body": "Usure mesurée à 2,1 mm, voir la photo jointe. @[u_sophie] peux-tu confirmer le seuil ?",
  "mentions": [ { "user": "u_sophie", "offset": 56, "length": 11 } ],
  "visibility": "tenant",
  "created_at": "2026-10-13T10:41:30Z",
  "edited_at": null,
  "revision": 1
}
```

**Comment la lire.** Le texte contient un jeton de mention `@[u_sophie]` : l'affichage résout l'identifiant vers le nom actuel de la personne. Les décalages de la mention permettent à l'interface de la mettre en évidence. La visibilité par défaut est celle de l'objet. Une visibilité plus restreinte (par exemple « interne à l'équipe qualité ») est possible, jamais plus large.

#### Les droits

| Question | Règle |
|---|---|
| Qui lit un commentaire ? | Les personnes qui lisent l'objet, dans la limite de la visibilité du commentaire (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) |
| Qui peut commenter ? | Les personnes qui ont le droit de commenter l'objet, distinct du droit de le lire ou de le modifier |
| Que fait une mention ? | Elle notifie, mais ne donne aucun droit |
| Que voit-on dans la notification ? | Titre, auteur et lien, pas le texte complet pour un canal externe (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)) |

**Quand la personne mentionnée ne peut pas lire l'objet.** L'interface propose trois issues : renoncer à la mention, demander à une personne habilitée d'accorder l'accès (par le parcours de demande de droits), ou inviter la personne par un autre moyen. Elle ne la prévient pas d'un objet qu'elle ne peut pas voir.

**L'autocomplétion** ne propose que des personnes qui peuvent lire l'objet : proposer tous les utilisateurs du tenant révélerait l'annuaire et l'existence d'accès.

#### Les mentions de groupe

| Cas | Règle |
|---|---|
| Mention d'un rôle ou d'une équipe | Résolue au moment de l'envoi par la résolution des destinataires (voir [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires)) |
| Groupe très large | Plafond, confirmation (« 400 personnes seront prévenues »), ou refus |
| Mention répétée | Déduplication : une personne n'est prévenue qu'une fois par fil et par fenêtre |
| Mention de soi | Ignorée |

#### Les fils

- **Ancrage** : l'objet entier, un champ (`finding.measurement`), ou une section d'un document. Un fil ancré à un champ garde la version de l'objet qu'il commentait, car la valeur a pu changer depuis.
- **États** : ouvert, résolu. Résoudre un fil est un acte tracé, et peut être annulé.
- **Profondeur** : un seul niveau de réponses suffit dans la plupart des cas. Plus profond, les fils deviennent illisibles.
- **Suivi** : participer à un fil crée un abonnement implicite (voir [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification)), qui s'arrête à la résolution.
- **Pagination** par curseur sur l'ordre chronologique (voir [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)).

#### Modifier et supprimer

| Opération | Règle recommandée |
|---|---|
| Modification | Fenêtre limitée, historique des révisions conservé (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)), mention « modifié » |
| Suppression | Suppression douce : un marqueur remplace le texte, l'enregistrement et son historique restent consultables par l'audit |
| Objet en état terminal ou approuvé | Commentaires figés, ou nouveaux commentaires seulement |
| Obligation de conservation | Aucune suppression avant le terme (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)) |

#### Le fil d'activité

Le fil d'activité est le **journal d'activité** de [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) : une trace lisible destinée aux personnes, qui se distingue de l'audit et de l'historique de modifications.

| | Fil d'activité | Journal d'audit |
|---|---|---|
| Public | Les personnes qui travaillent sur l'objet | Auditeurs, sécurité, conformité |
| Contenu | Événements significatifs, commentaires, regroupés | Toutes les actions pertinentes, avec avant et après |
| Garanties | Aucune valeur probante propre | Complet, immuable, vérifiable |
| Droits | Chaque entrée suit les droits de son sujet et de ses champs | Accès restreint et tracé |
| Forme | Phrases lisibles, regroupées (« 12 activités créées ») | Enregistrements structurés |

**Comment il se construit.** Des abonnés aux événements métier écrivent des entrées, et les commentaires y sont ajoutés. Chaque entrée porte le sujet, l'acteur, le type, un texte généré à partir d'un modèle, et sa visibilité. Pour un objet, on lit le flux à la demande, filtré par les droits (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) pour les arbitrages entre diffusion à l'écriture et à la lecture). Le regroupement évite d'afficher douze lignes quand douze éléments sont créés ensemble.

#### Le contenu et la sécurité

- **Assainissement.** Le texte accepte un sous-ensemble de mise en forme déclaré, jamais du HTML libre : sans cela, un commentaire peut exécuter du code dans le navigateur d'un lecteur.
- **Aperçus de liens.** Le serveur qui récupère l'aperçu d'une adresse doit être protégé contre les adresses internes (voir [7.5 Webhook](07-evenements-automatisation.md#75-webhook)).
- **Limitation de débit.** Contre les flux de commentaires automatisés (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).
- **Pièces jointes.** Elles relèvent du stockage de fichiers, avec leurs contrôles propres (voir le [module 18 du plan des compléments](../PLAN-COMPLEMENTS.md#module-18--fichiers-documents-et-contenus)).

#### Les modes de défaillance

- **Une décision dans un commentaire** : « OK pour moi » n'est pas une approbation liée à une version.
- **Une tempête de mentions** : un fil animé notifie dix personnes à chaque message.
- **Un commentaire visible hors de ses droits** : un auditeur externe lit des remarques internes.
- **Un texte modifié sans trace** : une réponse change après avoir été lue.
- **Un fil d'activité bruyant** : tout y apparaît, rien n'est lisible.

**Contre-exemple.** Une équipe demande les approbations dans les commentaires (« Sophie, tu valides ? »). Un mois plus tard, personne ne retrouve qui a validé quelle version, et le constat avait été modifié entre-temps.

**Limites.** Un fil de discussion n'est pas un outil de gestion de projet. Quand une question appelle une action avec un responsable et une échéance, elle devient un élément de travail (voir [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches)). Les commentaires ne remplacent pas un canal de messagerie d'équipe pour les échanges sans objet.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le fil d'activité est le journal d'activité ; l'audit reste distinct |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Les révisions d'un commentaire suivent le versionnement d'entité |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Droits de lecture hérités, filtrage par champ |
| [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires) | Les mentions produisent des demandes de notification, résolues par audience |
| [17.2 Abonnement, suivi et préférences de notification](#172-abonnement-suivi-et-préférences-de-notification) | La participation à un fil crée un abonnement implicite |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Les décisions passent par l'approbation, pas par un commentaire |
| [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Les nouveaux commentaires se diffusent aux lecteurs connectés |
| [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture) | Le non-lu d'un fil se calcule par marqueur de lecture |
| [17.8 Élément de travail et boîte de tâches](#178-élément-de-travail-et-boîte-de-tâches) | Une question qui exige une action devient un élément de travail |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | Suppression douce et conservation |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, les échanges autour des constats passent par la messagerie. Quand Sophie est interrogée sur un constat, elle ne retrouve ni la photo ni la discussion. Un auditeur demande « qui a dit quoi, et quand ? ».

**Problème.** Les échanges sont dispersés, hors de l'objet, sans droits ni trace.

**Application du concept.** La plateforme active les commentaires, les mentions et un fil d'activité sur les constats.

**Déroulé.**

1. Karim écrit un commentaire sur `fd_204` et mentionne Sophie.
2. La plateforme vérifie que Sophie peut lire le constat, enregistre la mention par identifiant, et émet `mention.created`.
3. Le service de notifications résout l'audience (Sophie), applique ses préférences, et envoie un message avec titre, auteur et lien (voir [17.1 Service de notifications et résolution des destinataires](#171-service-de-notifications-et-résolution-des-destinataires)).
4. Sophie répond dans le fil, et le résout. Le fil d'activité de F-ABCD affiche les entrées regroupées.
5. L'approbation du constat se fait ensuite par la tâche d'approbation, liée à la version 5 (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)), et non dans le fil.
6. L'auditeur externe consulte le fil d'activité : il y voit les entrées des champs qu'il a le droit de lire.

**Résultat.** Les échanges sont au contact du constat, avec leurs droits et leur historique, et la décision est tracée là où elle doit l'être.

**Limites.** Si le texte d'un commentaire est modifié après l'approbation, l'historique d'édition le montre, mais l'approbation ne porte que sur la version du constat. Les règles de gel des commentaires dépendent de la politique du tenant.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi une mention est-elle stockée par identifiant plutôt que comme du texte ?
2. **Compréhension.** Que se passe-t-il quand on mentionne une personne qui ne peut pas lire l'objet ?
3. **Compréhension.** Quelle différence y a-t-il entre le fil d'activité et le journal d'audit ?
4. **Pourquoi.** Pourquoi une décision ne doit-elle pas se prendre dans un commentaire ?
5. **Raisonnement pratique.** Un commentaire mentionne « tous les responsables qualité » : 400 personnes. Que doit faire la plateforme ?

#### Réponses

1. Pour que la mention survive aux changements de nom et se résolve vers la bonne personne au moment de l'envoi, avec vérification de ses droits. Du texte libre ne permettrait ni la notification fiable ni la résistance aux renommages.
2. La mention ne donne aucun droit. L'interface prévient l'auteur, et propose de renoncer à la mention, de demander l'accès à une personne habilitée, ou d'inviter la personne autrement. Elle ne notifie pas d'un objet que la personne ne peut pas voir.
3. Le fil d'activité est lisible, regroupé, filtré par les droits, et sans valeur probante propre. Le journal d'audit est complet, immuable, vérifiable et d'accès restreint. L'un sert à travailler, l'autre à prouver.
4. Parce qu'une décision doit être tracée avec son auteur, son instant, son résultat et la version précise sur laquelle elle porte. Un commentaire ne l'établit pas, et peut être modifié ou noyé.
5. Appliquer un plafond : demander une confirmation explicite (« 400 personnes seront prévenues »), ou refuser selon la politique, déduplication par fil et par fenêtre, et passer par la résolution des destinataires avec filtre de droits. Une alternative est de poster dans une file de décision plutôt que de mentionner.

## 17.15 Présence et édition collaborative

### 1. Comprendre simplement

La **présence** (*presence*) indique qui est là en ce moment sur un objet ou un écran : en ligne, en train de consulter, en train d'éditer. L'**édition collaborative** (*collaborative editing*) permet à plusieurs personnes de modifier le même contenu en même temps, sans que la dernière sauvegarde écrase les autres.

**Pourquoi cela existe.** Sans présence, on découvre au moment d'enregistrer qu'un collègue modifiait le même dossier. Sans mécanisme d'édition collaborative, la dernière sauvegarde gagne, et le travail de l'autre est perdu : c'est la mise à jour perdue décrite en [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste).

**Problème résolu.** Voir qui travaille sur un objet, et permettre des modifications simultanées qui se fondent sans perte.

**Modèle mental.** Une salle de réunion avec un tableau blanc. On voit qui est dans la salle (la présence), et chacun peut écrire sur le tableau sans effacer ce que les autres écrivent (l'édition collaborative).

**Où l'analogie s'arrête.** Au tableau, tout le monde voit tout, immédiatement, et deux personnes ne peuvent pas écrire exactement au même endroit sans s'en apercevoir. En ligne, il y a de la latence, des coupures, du travail hors ligne, et deux personnes peuvent modifier la même phrase à leur insu.

**Exemple.** Sophie et Hugo ouvrent le rapport d'inspection. Chacun voit l'avatar de l'autre. Sophie rédige la section 3, Hugo la section 5 : les deux modifications se combinent. Si tous deux modifient la même phrase, la règle de fusion de la plateforme tranche, et le résultat est le même pour tous.

**Les composants.**

1. un **état de présence** éphémère, entretenu par des battements ;
2. un **canal** par objet, relié au transport temps réel ;
3. des **indicateurs** (avatars, curseurs, saisie en cours) ;
4. une **stratégie de concurrence** (verrou, version, fusion, transformation, convergence) ;
5. un **historique** et une **attribution** des modifications ;
6. des **droits** appliqués en continu ;
7. des **limites** (taille, nombre de participants).

**Objectif d'apprentissage :** vous pouvez décrire la présence comme un état éphémère, comparer les stratégies d'édition concurrente, et expliquer sur un exemple pourquoi une transformation est nécessaire.

### 2. Connaissances essentielles

#### Définition

- **Présence** : information éphémère sur les personnes actuellement connectées à un objet ou à un écran, et sur ce qu'elles y font, qui disparaît d'elle-même si elle n'est pas entretenue.
- **Édition collaborative** : ensemble de techniques qui permettent à plusieurs personnes de modifier simultanément un même contenu, en garantissant que toutes les copies convergent vers le même résultat.

#### Idées fondamentales

1. **La présence est un état éphémère.** Elle s'entretient par des battements et s'éteint par expiration, sans quoi une déconnexion brutale laisserait des fantômes.
2. **La présence informe, elle ne verrouille pas.** Elle réduit les surprises ; la protection contre les écrasements vient d'ailleurs.
3. **Pour des enregistrements structurés, le contrôle optimiste et la fusion par champ suffisent.** C'est le cas de la plupart des formulaires métier (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).
4. **Pour du texte partagé, il faut un algorithme de convergence.** Deux familles existent : la transformation opérationnelle et les types à convergence automatique.
5. **Convergence et intention.** Toutes les copies finissent identiques, et chaque modification garde son sens autant que possible.
6. **Collaborer n'est pas être anonyme.** L'attribution, l'historique et les droits continuent de s'appliquer.

#### Vocabulaire essentiel

- **Battement** (*heartbeat*) : signal périodique qui prouve qu'une personne est toujours là.
- **État éphémère** (*soft state*) : état qui expire s'il n'est pas renouvelé.
- **Opération** (*operation*) : modification élémentaire (insérer un caractère, supprimer une plage).
- **Transformation opérationnelle** (*operational transformation*, *OT*) : technique qui ajuste des opérations concurrentes les unes par rapport aux autres pour préserver leur intention.
- **Type de données répliqué sans conflit** (*conflict-free replicated data type*, *CRDT*) : structure de données conçue pour que ses copies convergent sans coordination.
- **Convergence** (*convergence*) : propriété selon laquelle toutes les copies finissent dans le même état.
- **Préservation de l'intention** (*intention preservation*) : propriété selon laquelle l'effet d'une opération est celui voulu par son auteur, même après transformation.
- **Curseur partagé** (*shared cursor*) : indication de la position de chacun dans le contenu.

#### Relations de cause à effet

- La présence est utilisée comme verrou. Une personne qui part sans se déconnecter bloque les autres, ou une déconnexion libère un verrou trop tôt.
- Toutes les modifications d'un texte sont des écritures de document entier. Les deux personnes se marchent dessus, et la dernière écrase l'autre.
- Les opérations sont appliquées dans l'ordre d'arrivée sans transformation. Les copies divergent, et personne ne s'en aperçoit avant plusieurs jours.
- Le journal des opérations n'est jamais compacté. Il croît sans limite, et l'ouverture d'un document devient lente.
- La révocation d'un droit n'est pas appliquée aux sessions ouvertes. Une personne qui n'a plus accès continue d'éditer.

#### Idées reçues

- **« Il suffit de verrouiller le document. »** Pour un enregistrement court, oui. Pour un texte long édité par plusieurs personnes, le verrou bloque le travail.
- **« Le dernier qui enregistre a raison. »** C'est une perte de travail, pas une règle de fusion.
- **« Les CRDT sont une solution toute prête. »** Ils garantissent la convergence, pas la qualité du résultat : deux modifications au même endroit peuvent produire un texte étrange mais identique pour tous.

#### Principe clé

La présence informe, la concurrence se règle par une stratégie adaptée au contenu, et l'on n'emploie une convergence algorithmique que pour les contenus où la fusion par champ ne suffit pas.

#### Si vous ne retenez que trois choses

1. La présence est un état éphémère qui informe et ne verrouille pas.
2. Pour des enregistrements, le contrôle optimiste et la fusion par champ suffisent ; pour du texte partagé, on recourt à la transformation opérationnelle ou aux CRDT.
3. Convergence, historique, attribution et droits restent garantis, et l'on s'appuie sur des bibliothèques éprouvées.

### 3. Explication technique détaillée

#### La présence

```json
{
  "channel": "tenant/ten_airline_01/subject/finding/fd_204",
  "participants": [
    { "user": "u_sophie", "state": "editing",  "field": "analysis", "last_seen": "2026-10-13T10:52:08Z" },
    { "user": "u_hugo",   "state": "viewing",  "field": null,       "last_seen": "2026-10-13T10:52:11Z" }
  ]
}
```

| Aspect | Règle |
|---|---|
| Entretien | Un battement toutes les 10 à 30 secondes depuis chaque onglet |
| Expiration | Après deux ou trois battements manqués, la personne n'est plus présente |
| Stockage | Mémoire partagée avec durée de vie, pas dans la base transactionnelle |
| Diffusion | Changements regroupés et espacés, pour ne pas inonder (voir [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)) |
| Portée | Les personnes qui peuvent lire l'objet, pas les autres |
| Vie privée | La présence révèle l'activité des personnes : politique du tenant, option de discrétion si elle est permise |

Le coût est proportionnel au nombre de personnes présentes fois la fréquence des battements, ce qui se mesure (voir [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)).

#### Les stratégies d'édition concurrente

| Stratégie | Principe | Convient à | Limites |
|---|---|---|---|
| Verrou pessimiste | Une personne édite, les autres lisent | Enregistrements courts, conflits rares | Blocage, verrous oubliés |
| Contrôle optimiste | Refus si la version a changé (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)) | Formulaires, enregistrements | La personne doit fusionner à la main |
| Fusion par champ | Fusion automatique des champs disjoints (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)) | Enregistrements structurés | Conflit si le même champ est modifié |
| Transformation opérationnelle | Ajuster les opérations concurrentes pour préserver l'intention | Texte, avec serveur central | Complexité, preuves difficiles |
| CRDT | Structures conçues pour converger sans coordination | Texte, listes, travail hors ligne, pair-à-pair | Métadonnées qui croissent, complexité |

**Un critère de choix.** Si le contenu se découpe en champs que des personnes modifient rarement en même temps, on s'arrête à la fusion par champ avec un indicateur de présence. On n'adopte la transformation ou un CRDT que pour de longs textes édités en parallèle.

#### Pourquoi il faut transformer

Texte initial : `abc`. Deux personnes modifient en parallèle.

- **Opération 1** (Sophie) : insérer `X` à la position 1.
- **Opération 2** (Hugo) : supprimer le caractère à la position 2 (le `c`).

| | Copie de Sophie | Copie de Hugo |
|---|---|---|
| Départ | `abc` | `abc` |
| Applique sa propre opération | `aXbc` | `ab` |
| Reçoit l'opération de l'autre **sans transformation** | Supprime la position 2 : `aXc` | Insère `X` en position 1 : `aXb` |
| Résultat | `aXc` | `aXb` |

Les copies **divergent**. Avec une transformation, l'opération 2 reçue par Sophie est ajustée : l'insertion en position 1 a décalé le `c` en position 3, donc on supprime la position 3.

| | Copie de Sophie | Copie de Hugo |
|---|---|---|
| Après opération 1 | `aXbc` | `abc` |
| Après opération 2, **transformée** si nécessaire | Supprime la position 3 : `aXb` | `ab`, puis insère `X` en position 1 : `aXb` |
| Résultat | `aXb` | `aXb` |

Les deux copies **convergent**, et l'intention de chacun est respectée : le `X` est inséré après le `a`, et le `c` est supprimé. Cette technique est née des travaux de C. Ellis et S. Gibbs sur les systèmes de groupe en 1989.

#### Les types à convergence automatique

Au lieu de transformer les opérations, on choisit des structures dont les opérations **commutent** : l'ordre de réception n'a plus d'importance. Marc Shapiro et ses collègues ont formalisé en 2011 des conditions suffisantes de convergence pour de tels types, dits CRDT.

**Exemple minimal : un compteur qui ne fait que croître.** Chaque copie tient un compteur par réplique. La valeur est la somme, la fusion prend le maximum, réplique par réplique.

| Réplique | A | B |
|---|---|---|
| État local | A:3, B:0 | A:0, B:2 |
| Après fusion (maximum par réplique) | A:3, B:2 | A:3, B:2 |
| Valeur lue | 5 | 5 |

Le marqueur de lecture de [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture) suit le même principe : le maximum est une fusion commutative, idempotente et associative. Pour du texte, les CRDT donnent à chaque caractère un identifiant unique et ordonné, de sorte qu'insérer et supprimer commutent. Le prix est un surcroît de métadonnées, qu'il faut compacter.

#### Dans la plateforme

- **Versions.** Un document collaboratif produit des révisions (instantanés) pour l'historique et le retour arrière (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)).
- **Approbation.** Une approbation porte sur une version précise (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)). Un document soumis à approbation passe en lecture seule, ou crée une nouvelle version.
- **Attribution.** L'auteur de chaque passage est conservé, car l'audit et le droit d'auteur l'exigent parfois (voir [9.2 Acteur, horodatage, avant et après, motif](09-audit-versionnement-gouvernance.md#92-acteur-horodatage-avant-et-après-motif)).
- **Droits.** Une révocation de droit coupe la session d'édition en cours (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Hors ligne.** Les modifications faites sans réseau se fusionnent à la reconnexion ; avec un CRDT, sans conflit au sens de la perte.
- **Limites.** Nombre de participants simultanés, taille du document, fréquence des opérations.

#### Les modes de défaillance

- **Un fantôme de présence** : une personne figure encore alors qu'elle est partie.
- **Une divergence silencieuse** : les copies diffèrent sans que personne s'en aperçoive.
- **Un historique d'opérations non compacté** : l'ouverture devient lente.
- **Une modification d'un document approuvé** sans nouvelle version.
- **Une mauvaise implémentation maison** : les algorithmes de convergence sont subtils, et leurs défauts n'apparaissent qu'en production.

**Contre-exemple.** Une équipe code sa propre transformation d'opérations pour un éditeur de rapports. Tout fonctionne à deux utilisateurs, et diverge à trois, quand deux opérations concurrentes se transforment mutuellement dans un ordre différent. La correction demande de réécrire le moteur.

**Limites.** Cette entrée présente des principes, pas une implémentation. Pour des besoins réels d'édition simultanée de texte, on adopte une bibliothèque éprouvée, plutôt qu'un algorithme écrit pour l'occasion. La plupart des besoins métier d'une plateforme configurable sont couverts par la fusion par champ et la présence.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Contrôle optimiste et fusion par champ : le premier recours ; l'édition collaborative y est signalée comme technique à part |
| [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Le WebSocket porte la présence et les opérations |
| [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture) | La fusion monotone de l'état de lecture illustre la convergence |
| [17.14 Commentaires, mentions, fils de discussion et fil d'activité](#1714-commentaires-mentions-fils-de-discussion-et-fil-dactivité) | Les fils de discussion sont ancrés à des contenus édités |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Les révisions d'un document collaboratif |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Une approbation porte sur une version figée |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits s'appliquent en continu pendant la session |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La convergence est une forme de cohérence à terme |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | Le coût des connexions et des battements se mesure |

### 5. Application pratique

**Situation initiale.** Chez Alpha Air, deux personnes éditent le rapport d'inspection d'un aéronef : Sophie rédige la synthèse, Hugo complète les mesures. Un jour, Hugo écrase les modifications de Sophie en enregistrant une version plus ancienne, sans s'en rendre compte.

**Problème.** Aucune indication de présence, et le contrôle de version se limite à écraser.

**Application du concept.** La plateforme ajoute la présence, le contrôle optimiste par champ, et, pour la synthèse en texte libre, une édition collaborative par CRDT.

**Déroulé.**

1. Sophie ouvre le rapport : son avatar apparaît pour Hugo, avec l'indication « édite la synthèse ».
2. Hugo modifie les mesures : les champs sont disjoints, la fusion par champ les combine, sans conflit.
3. Les deux modifient la synthèse : l'éditeur utilise un CRDT, et leurs saisies se combinent sans perte.
4. Hugo se déconnecte brutalement. Après trois battements manqués, sa présence expire.
5. Le rapport est soumis à approbation : il passe en lecture seule, et l'approbation porte sur la version 7 (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).
6. L'historique conserve les révisions, avec l'auteur de chaque passage.

**Résultat.** Plus aucun écrasement, une trace de qui a écrit quoi, et une approbation portant sur une version figée.

**Limites.** Si Sophie perd ses droits en cours de session, sa connexion d'édition est coupée au prochain contrôle. L'éditeur collaboratif reste un composant à part, avec ses propres coûts d'exploitation.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la présence est-elle un état éphémère ?
2. **Compréhension.** Citez trois stratégies d'édition concurrente et un cas d'usage de chacune.
3. **Compréhension.** Que signifie « convergence » pour des copies d'un même texte ?
4. **Pourquoi.** Pourquoi une opération concurrente doit-elle être transformée avant d'être appliquée ?
5. **Raisonnement pratique.** Une équipe édite des fiches de maintenance structurées en champs. Faut-il un CRDT ?

#### Réponses

1. Parce qu'une déconnexion brutale ne prévient pas : si la présence n'expirait pas, des fantômes resteraient affichés. Un battement périodique la renouvelle, et elle disparaît quand il manque.
2. Par exemple : le verrou pessimiste pour un enregistrement court rarement édité, le contrôle optimiste ou la fusion par champ pour un formulaire structuré, la transformation opérationnelle ou un CRDT pour un texte long édité en parallèle ou hors ligne.
3. Toutes les copies finissent dans le même état, une fois que toutes les opérations ont été reçues, quel que soit l'ordre de réception.
4. Parce qu'une opération est définie par rapport à l'état sur lequel son auteur l'a faite. Appliquée sur un état déjà modifié par une autre opération, elle peut viser le mauvais caractère : les copies divergent, comme dans l'exemple `abc`.
5. En général non : des champs disjoints se fusionnent avec le contrôle optimiste par champ, et un indicateur de présence limite les surprises. Un CRDT ne se justifie que pour des champs de texte long édités simultanément.

## Références du module

Les références ci-dessous ont été consultées pendant la rédaction du module, à la date indiquée. Un renvoi vers un texte officiel prime sur le résumé qu'en donne le module.

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| WebSocket | RFC 6455, *The WebSocket Protocol* (décembre 2011) | [rfc-editor.org/rfc/rfc6455](https://www.rfc-editor.org/rfc/rfc6455) | 17.12 |
| Événements envoyés par le serveur | Standard HTML du WHATWG, section 9.2 *Server-sent events* | [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/server-sent-events.html) | 17.12 |
| Événements envoyés par le serveur | MDN, *Using server-sent events* | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) | 17.12 |
| Interrogation longue | RFC 6202, *Known Issues and Best Practices for the Use of Long Polling and Streaming in Bidirectional HTTP* (avril 2011) | [rfc-editor.org/rfc/rfc6202](https://www.rfc-editor.org/rfc/rfc6202) | 17.12 |
| Web Push | RFC 8030 (décembre 2016), RFC 8291 (novembre 2017), RFC 8292 (novembre 2017) | [RFC 8030](https://www.rfc-editor.org/rfc/rfc8030), [RFC 8291](https://www.rfc-editor.org/rfc/rfc8291), [RFC 8292](https://www.rfc-editor.org/rfc/rfc8292) | 17.4 |
| Réponses SMTP | RFC 5321, *Simple Mail Transfer Protocol* (octobre 2008), section 4.2.1 | [rfc-editor.org/rfc/rfc5321](https://www.rfc-editor.org/rfc/rfc5321) | 17.5 |
| Codes de statut améliorés | RFC 3463, *Enhanced Mail System Status Codes* (janvier 2003) | [rfc-editor.org/rfc/rfc3463](https://www.rfc-editor.org/rfc/rfc3463) | 17.5 |
| Notifications de statut de remise | RFC 3464 (janvier 2003) | [rfc-editor.org/rfc/rfc3464](https://www.rfc-editor.org/rfc/rfc3464) | 17.5 |
| Rapports de plainte | RFC 5965, *An Extensible Format for Email Feedback Reports* (août 2010) | [rfc-editor.org/rfc/rfc5965](https://www.rfc-editor.org/rfc/rfc5965) | 17.5 |
| SPF | RFC 7208 (avril 2014) | [rfc-editor.org/rfc/rfc7208](https://www.rfc-editor.org/rfc/rfc7208) | 17.5 |
| DKIM | RFC 6376 (septembre 2011) | [rfc-editor.org/rfc/rfc6376](https://www.rfc-editor.org/rfc/rfc6376) | 17.5 |
| DMARC | RFC 9989 (2026), qui remplace la RFC 7489 (mars 2015) ; RFC 9990 (rapports agrégés) et RFC 9991 (rapports d'échec) | [RFC 9989](https://www.rfc-editor.org/rfc/rfc9989), [RFC 9990](https://www.rfc-editor.org/rfc/rfc9990), [RFC 9991](https://www.rfc-editor.org/rfc/rfc9991), [RFC 7489](https://www.rfc-editor.org/rfc/rfc7489) | 17.5 |
| Désabonnement | RFC 2369 (juillet 1998) ; RFC 8058, *Signaling One-Click Functionality for List Email Headers* (janvier 2017) | [RFC 2369](https://www.rfc-editor.org/rfc/rfc2369), [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058) | 17.6 |
| Exigences d'un grand fournisseur | Google, *Email sender guidelines* (exigences en vigueur depuis le 1er février 2024) | [support.google.com/a/answer/81126](https://support.google.com/a/answer/81126) | 17.5, 17.6 |
| Consentement | RGPD, article 7 ; article 21, §2 et §3 | [art. 7](https://gdpr-info.eu/art-7-gdpr/), [art. 21](https://gdpr-info.eu/art-21-gdpr/) | 17.6 |
| Prospection électronique | Directive 2002/58/CE, article 13 | [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058) | 17.6 |
| Étiquettes de langue | RFC 5646 (septembre 2009), avec la RFC 4647 : BCP 47 | [rfc-editor.org/rfc/rfc5646](https://www.rfc-editor.org/rfc/rfc5646) | 17.3 |
| Pluriels | Unicode CLDR, *Plural Rules* | [cldr.unicode.org](https://cldr.unicode.org/index/cldr-spec/plural-rules) | 17.3 |
| Messages d'état | WCAG 2.2, critère de succès 4.1.3 (niveau AA) | [w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | 17.13 |
| Transformation opérationnelle | C. A. Ellis et S. J. Gibbs, *Concurrency control in groupware systems*, ACM SIGMOD 1989, pp. 399-407 | [dl.acm.org/doi/10.1145/67544.66963](https://dl.acm.org/doi/10.1145/67544.66963) | 17.15 |
| CRDT | M. Shapiro, N. Preguiça, C. Baquero, M. Zawirski, *Conflict-free Replicated Data Types*, SSS 2011, LNCS 6976, pp. 386-400 | [Notice bibliographique tenue par un coauteur](https://asc.di.fct.unl.pt/~nmp/pubs/sss-2011.bib) | 17.15 |
| Ordonnancement | Règle de Jackson (échéance croissante, un seul exécutant, retard maximal) | Polycopié de cours d'ordonnancement à une machine, [web-static.stern.nyu.edu](https://web-static.stern.nyu.edu/om/faculty/pinedo/scheduling/shakhlevich/handout04.pdf) | 17.10 |

**Consultées le 2026-10-14.** Les pages ont été lues pour confirmer les titres, les dates, le statut et le contenu essentiel cité. Le module ne reproduit pas les textes. Pour la règle de Jackson, les sources divergent sur l'année (1954 ou 1955) : le module ne la donne pas. Les articles de recherche (Ellis et Gibbs, Shapiro et ses coauteurs) ont été vérifiés par leur notice bibliographique, pas par la lecture du texte complet.

**Non confrontés à une source pendant la rédaction.** Les valeurs d'exemple (durées, seuils, tailles, cadences de battement), l'affirmation selon laquelle les équilibreurs de charge coupent les connexions inactives après un délai configurable, l'avertissement sur la fiabilité du suivi d'ouverture par pixel, et les repères de conception qui n'ont pas de norme. Les articles de loi cités sont ceux de l'Union européenne : leur application à un cas précis demande un conseil juridique.
