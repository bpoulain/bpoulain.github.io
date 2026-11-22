# Module 9 — Audit, versionnement et gouvernance

> **Question directrice.** Qui a changé quoi, quand, et quelle configuration était active à ce moment-là ?

## Présentation du module

**Objectif.** Une plateforme configurable change en permanence : les données par les utilisateurs, le comportement par les administrateurs. Ce module montre comment rendre ces changements **traçables**, **reconstituables** et **maîtrisés** : l'audit répond à « qui a fait quoi », le versionnement à « dans quel état et sous quelle configuration », la gouvernance à « qui a autorisé et sur quelle preuve ».

**Prérequis.** Les opérations et transactions du module 3, l'identité du module 4, les états et règles du module 6, les événements du module 7 et la plateforme d'administration du module 8.

**Ordre retenu.** Les trois blocs du plan, dans l'ordre : audit, versionnement, gouvernance.

```text
Audit           journaux ─ anatomie d'une entrée (acteur, horodatage, avant et après, motif)
Versionnement   révision d'entité ─ instantané et différence
                configuration, workflows, politiques ─ retour arrière
Gouvernance     revue, demande de changement, approbation ─ exception et preuve
```

**Renvois utiles.**

- Le versionnement du **schéma** est expliqué en [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) ; le versionnement des **API** en [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi). Ce module les replace dans le panorama des objets versionnés (voir [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).
- La **séparation des tâches** et la **délégation** sont expliquées en [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) et [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) ; elles sont appliquées ici aux changements de configuration (voir [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation)).
- L'**approbation** de workflow est expliquée en [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) ; l'approbation de **changements** l'est en [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation).

## Sommaire du module

- [9.1 Journal d'audit, journal d'activité et historique des modifications](#91-journal-daudit-journal-dactivité-et-historique-des-modifications)
- [9.2 Acteur, horodatage, avant et après, motif](#92-acteur-horodatage-avant-et-après-motif)
- [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité)
- [9.4 Instantané et différence](#94-instantané-et-différence)
- [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)
- [9.6 Retour arrière](#96-retour-arrière)
- [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation)
- [9.8 Exception et preuve](#98-exception-et-preuve)

## 9.1 Journal d'audit, journal d'activité et historique des modifications

### 1. Comprendre simplement

Trois traces voisines se distinguent par leur finalité. Le **journal d'audit** (*audit log*) est le registre fiable et durable des actions significatives : qui a fait quoi, sur quoi, quand, avec quel résultat. Le **journal d'activité** (*activity log*) est le fil d'activité lisible par les utilisateurs : « Mathilde a modifié l'aéronef F-ABCD ». L'**historique des modifications** (*change history*) conserve, ressource par ressource, l'évolution des valeurs.

**Pourquoi cela existe.** Une plateforme partagée par de nombreux acteurs doit pouvoir établir les responsabilités : en cas d'incident, de litige, de contrôle réglementaire ou d'enquête de sécurité. Sans trace fiable, personne ne peut démontrer ce qui s'est passé.

**Problème résolu.** Rendre chaque action importante attribuable, vérifiable, et reconstituable après coup.

**Modèle mental.** La boîte noire d'un avion. Elle enregistre en continu, résiste à l'altération, et sert à comprendre ce qui s'est passé. L'analogie est parlante pour un client aéronautique.

**Où l'analogie s'arrête.** On ne lit une boîte noire qu'après un accident. Un journal d'audit est consulté tous les jours : par les administrateurs, les responsables conformité, les auditeurs. Il doit être interrogeable.

**Exemple.** Un auditeur demande : « Qui a modifié la règle d'immobilisation le 12 octobre, avec quel motif, et quelle était sa version précédente ? » Le journal d'audit répond.

**Les composants.**

1. des **entrées** structurées et immuables ;
2. un **chemin d'écriture** fiable ;
3. un **stockage** protégé et durable ;
4. des **moyens d'interrogation** ;
5. une **politique de conservation**.

**Objectif d'apprentissage :** vous pouvez distinguer les trois journaux, dire ce qu'une entrée d'audit doit garantir et citer deux moyens de protéger le journal contre l'altération.

### 2. Connaissances essentielles

#### Définition

- **Journal d'audit** : enregistrement chronologique, immuable et vérifiable des actions pertinentes pour la sécurité, la conformité et la responsabilité (qui, quoi, quand, sur quoi, résultat).
- **Journal d'activité** : flux lisible des actions des utilisateurs, destiné à la collaboration et à l'information, sans garantie probatoire équivalente.
- **Historique des modifications** : suite des valeurs successives d'une ressource, avec les changements entre chaque état.

#### Idées fondamentales

1. **L'audit est probatoire.** Il est immuable, complet et attribuable.
2. **L'activité est informative.** Elle sert à suivre ce qui se passe, pas à prouver.
3. **L'historique porte sur la ressource.** Il dit comment un objet a évolué.
4. **L'écriture est liée au changement.** Une action réussie et non tracée est un défaut grave.
5. **Le journal est protégé.** Même les administrateurs ne le modifient pas.
6. **On trace ce qu'il faut, pas tout.** Pas de secrets ; données sensibles par référence ou masquées.

#### Vocabulaire essentiel

- **Entrée d'audit** (*audit record*, *audit entry*) : un enregistrement du journal.
- **Immuable** (*immutable*, *append-only*) : qui ne se modifie ni ne se supprime.
- **Chaînage de hachages** (*hash chaining*) : technique où chaque entrée contient l'empreinte de la précédente.
- **WORM** (*write once, read many*) : stockage où l'on écrit une fois et lit plusieurs fois.
- **Falsification** (*tampering*) : altération malveillante d'une trace.
- **Injection de journal** (*log injection*) : insertion de contenu trompeur par une valeur contrôlée par l'utilisateur.
- **Traçabilité** (*traceability*, *accountability*) : capacité à attribuer chaque action à un acteur.

#### Relations de cause à effet

- L'audit est écrit séparément de la transaction. Un incident entre les deux laisse une action sans trace, ou une trace sans action.
- Les administrateurs peuvent modifier le journal. Il perd sa valeur probatoire : on ne peut plus en exclure l'altération.
- Tout est journalisé, secrets compris. Le journal devient lui-même une cible, et une source de fuite.

#### Idées reçues

- **« Les journaux d'application suffisent comme audit. »** Non. Ils sont techniques, rotatifs, modifiables et incomplets. L'audit a ses exigences propres.
- **« Auditer, c'est enregistrer les connexions. »** C'est aussi tracer les changements de données, de configuration, de droits, les exports et les accès privilégiés.
- **« Plus on garde longtemps, mieux c'est. »** La conservation est une obligation et une charge : elle est déterminée par la réglementation et le besoin, et elle se heurte à la protection des données personnelles.

#### Principe clé

Un journal d'audit est probant s'il est complet, attribuable, immuable et écrit avec l'action elle-même.

#### Si vous ne retenez que trois choses

1. Audit (preuve), activité (information) et historique (évolution d'une ressource) ont des finalités différentes.
2. L'écriture de l'audit est liée au changement, et le journal est protégé contre l'altération.
3. Il trace l'essentiel sans exposer de secrets ni de données inutiles.

### 3. Explication technique détaillée

#### Comparaison des trois traces

| Critère | Journal d'audit | Journal d'activité | Historique des modifications |
|---|---|---|---|
| Finalité | Preuve, conformité, enquête | Information, collaboration | Évolution d'une ressource |
| Public | Auditeurs, sécurité, administrateurs | Utilisateurs | Utilisateurs, administrateurs |
| Granularité | Action significative | Action visible | Valeurs par champ |
| Garanties | Immuable, complet, attribuable | Au mieux | Selon le mécanisme (voir [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité)) |
| Conservation | Longue, selon la réglementation | Courte à moyenne | Selon la politique du type |
| Exemple | « Karim a attribué le rôle Administrateur à Mathilde » | « Mathilde a modifié F-ABCD » | « statut : actif → en inspection » |

#### Ce que l'on trace

| Catégorie | Exemples |
|---|---|
| Authentification | Connexions, échecs, changement de second facteur |
| Autorisation | Refus d'accès aux ressources sensibles |
| Données | Création, modification, suppression, archivage de ressources sensibles |
| Configuration | Changement de type, de règle, de workflow, de politique, de réglage |
| Droits | Attribution et retrait de rôles, délégations |
| Administration technique | Création de clés, de webhooks, d'intégrations |
| Sorties de données | Exports, impressions, accès par API en masse |
| Accès privilégiés | Assistance, administration inter-tenants (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) |

#### Le chemin d'écriture

```text
Opération métier ──► transaction ──┬─► changement des données
                                   └─► écriture de l'entrée d'audit (même transaction)
                                             │ transmission asynchrone
                                             ▼
                                   Stockage d'audit protégé (append-only)
```

**Pourquoi la même transaction.** Si l'action est validée, l'entrée existe ; si elle est annulée, l'entrée n'existe pas. Aucune action ne peut réussir sans trace.

#### La protection contre l'altération

| Technique | Principe |
|---|---|
| Stockage en ajout seul | Pas de modification ni de suppression, par conception |
| Séparation des droits | Les administrateurs de la plateforme ne peuvent pas écrire dans le journal |
| Chaînage de hachages | Chaque entrée porte l'empreinte de la précédente |
| Stockage WORM | Verrouillage matériel ou logiciel |
| Copie externe | Réplication vers un système indépendant |
| Signature périodique | Empreinte d'ensemble signée et horodatée par un tiers |

**Le chaînage de hachages.** Chaque entrée $n$ stocke :

$$h_n = H\big(h_{n-1} \;\|\; \text{contenu}_n\big)$$

où $H$ est une fonction de hachage cryptographique et $\|$ la concaténation. Modifier une entrée change son empreinte, donc celles de toutes les suivantes : l'altération est détectée à la vérification de la chaîne.

#### Les pièges de contenu

| Piège | Risque | Parade |
|---|---|---|
| Secrets dans les entrées | Fuite par le journal | Ne jamais journaliser les secrets, masquer |
| Données personnelles complètes | Conflit avec la protection des données | Références, valeurs masquées |
| Valeurs saisies non nettoyées | Injection de lignes trompeuses | Échapper, structurer |
| Horloges désynchronisées | Chronologie fausse | Heure serveur synchronisée, numéro de séquence |
| Volume excessif | Coût, bruit | Niveaux de détail, échantillonnage hors audit |

**Contre-exemple.** Un journal d'audit stocké dans la même base que les données applicatives, que tout administrateur de base peut modifier. Un responsable mécontent efface trois lignes avant un contrôle, et personne ne peut le prouver ni l'exclure.

**Limites.** Un journal parfait ne remplace pas la prévention. Il permet de détecter, d'expliquer et de dissuader, pas d'empêcher.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.2 Acteur, horodatage, avant et après, motif](#92-acteur-horodatage-avant-et-après-motif) | Détaille la structure d'une entrée |
| [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité) | L'historique des modifications relève du versionnement d'entité |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements alimentent le journal |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | L'écriture de l'audit est dans la transaction |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La console opérationnelle expose l'audit du tenant |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Les journaux techniques sont une famille distincte |

### 5. Application pratique

**Situation initiale.** Après un incident, l'autorité demande à la compagnie de lui indiquer qui a modifié la date d'inspection d'un aéronef et pourquoi.

**Problème.** Les journaux applicatifs ont été purgés après 30 jours, et ils ne contiennent pas les valeurs modifiées.

**Application du concept.** Un journal d'audit dédié, immuable, avec les valeurs avant et après.

**Déroulé.**

1. À chaque modification d'un champ réglementaire, le moteur écrit une entrée d'audit dans la même transaction.
2. Les entrées sont transmises à un stockage en ajout seul, séparé de la base métier.
3. L'autorité demande l'historique du champ pour l'aéronef concerné.
4. L'administrateur filtre le journal par ressource et par champ, et exporte la liste.
5. Une vérification de la chaîne de hachages démontre l'intégrité de l'extrait.

**Résultat.** La compagnie répond avec des faits datés, attribués et vérifiables.

**Limites.** Pour les modifications antérieures à la mise en place du journal, il n'existe pas de preuve équivalente : la valeur de l'audit commence à sa date d'activation.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre journal d'audit et journal d'activité ?
2. **Compréhension.** Pourquoi écrit-on l'entrée d'audit dans la même transaction que le changement ?
3. **Compréhension.** Comment le chaînage de hachages détecte-t-il une altération ?
4. **Pourquoi.** Pourquoi les administrateurs ne doivent-ils pas pouvoir modifier le journal d'audit ?
5. **Raisonnement pratique.** Peut-on utiliser les journaux techniques des serveurs comme journal d'audit ?

#### Réponses

1. Le journal d'audit est une preuve, immuable et complète ; le journal d'activité est un fil d'information pour les utilisateurs, sans garantie probatoire.
2. Pour que toute action validée soit tracée, et qu'aucune trace n'existe pour une action annulée.
3. Chaque entrée contient l'empreinte de la précédente : modifier une entrée change toutes les empreintes suivantes, ce qui se détecte en vérifiant la chaîne.
4. Parce qu'un journal modifiable perd sa valeur de preuve : on ne peut plus exclure qu'il ait été altéré.
5. Non : ils sont techniques, rotatifs, incomplets pour les besoins de gouvernance et modifiables. L'audit demande un dispositif dédié.

## 9.2 Acteur, horodatage, avant et après, motif

### 1. Comprendre simplement

Une bonne entrée d'audit répond à quatre questions simples. **Qui ?** L'**acteur** (*actor*). **Quand ?** L'**horodatage** (*timestamp*). **Quoi ?** L'état **avant** et **après** (*before / after*). **Pourquoi ?** Le **motif** (*reason*). S'y ajoutent la cible, l'action, le résultat et le contexte.

**Pourquoi cela existe.** Une trace qui dit seulement « un changement a eu lieu » ne permet ni d'enquêter ni de rendre compte. Chaque information manquante ferme une question qu'un auditeur ou un responsable posera.

**Problème résolu.** Donner à chaque entrée d'audit assez d'informations pour répondre sans ambiguïté à qui, quand, quoi et pourquoi.

**Modèle mental.** La fiche d'intervention d'un technicien : date et heure, nom, ce qu'il a fait, valeurs relevées avant et après, motif de l'intervention.

**Où l'analogie s'arrête.** Une fiche papier est remplie par la personne. Dans un système, l'acteur et l'heure doivent être établis **par le serveur**, jamais fournis par le client.

**Exemple.**

```json
{
  "id": "aud_01HZX9",
  "tenant_id": "ten_airline_01",
  "at": "2026-10-12T14:03:27.412Z",
  "actor": { "type": "user", "id": "u_42", "name": "Mathilde Durand" },
  "on_behalf_of": null,
  "action": "update",
  "target": { "type": "aircraft", "id": "ac_8f3a" },
  "changes": [
    { "field": "next_inspection_date", "before": "2026-11-30", "after": "2026-12-15" }
  ],
  "reason": "Report accordé par l'autorité, dossier DGAC-2026-118",
  "outcome": "success",
  "context": { "ip": "10.1.2.3", "session": "ses_77", "correlation_id": "req_91ab33" }
}
```

**Les éléments d'une entrée.**

1. **acteur** et éventuellement mandant ;
2. **horodatage** précis et fiable ;
3. **action** et **cible** ;
4. **valeurs avant et après** ;
5. **motif** ;
6. **résultat** et **contexte**.

**Objectif d'apprentissage :** vous pouvez lister les champs d'une entrée d'audit complète et dire lesquels ne doivent jamais être fournis par le client.

### 2. Connaissances essentielles

#### Définition

Une **entrée d'audit** est un enregistrement structuré qui établit, pour une action donnée, l'identité de l'acteur, l'instant, la cible, les valeurs avant et après, le motif, le résultat et le contexte d'exécution.

#### Idées fondamentales

1. **L'acteur est établi par le serveur.** Authentifié, jamais déclaré par le client.
2. **L'acteur peut être composé.** Personne, service, automatisation, ou agent au nom d'une personne.
3. **L'horodatage vient du serveur.** En temps universel, précis, synchronisé.
4. **Le avant et le après sont au niveau du champ.** Avec masquage des valeurs sensibles.
5. **Le motif est exigé pour les actions sensibles.** Texte libre et, si possible, référence (ticket, demande).
6. **Le résultat est enregistré.** Succès, refus, échec : les tentatives refusées comptent aussi.

#### Vocabulaire essentiel

- **Acteur** (*actor*) : l'entité qui exécute l'action (utilisateur, service, automatisation).
- **Mandant** (*principal*, *on behalf of*) : la personne au nom de laquelle l'acteur agit (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
- **Horodatage** (*timestamp*) : instant de l'action, en UTC.
- **Avant et après** (*before / after*) : valeurs d'un champ avant et après la modification.
- **Motif** (*reason*, *justification*) : explication de l'action.
- **Résultat** (*outcome*) : succès, refus, échec.
- **Contexte** (*context*) : adresse, session, appareil, corrélation.

#### Relations de cause à effet

- L'acteur d'une action automatique est toujours « système ». Impossible de savoir quelle règle ou quelle automatisation en est responsable.
- L'horodatage est fourni par le client. Il peut être faux ou décalé, et l'ordre des événements est incertain.
- Seules les valeurs « après » sont conservées. Une enquête ne peut plus dire ce qui a été remplacé.

#### Idées reçues

- **« Un horodatage local est suffisant. »** Non. Les fuseaux horaires, les changements d'heure et les décalages d'horloge rendent la chronologie ambiguë : on enregistre en UTC avec une précision suffisante.
- **« Le motif est un champ facultatif de confort. »** Pour les actions sensibles, il est une exigence de gouvernance : il distingue l'action légitime de l'action injustifiée.
- **« Enregistrer le avant et le après suffit. »** Il faut aussi le contexte : sans acteur ni cause, la différence ne dit rien.

#### Principe clé

Chaque entrée d'audit répond à qui, quand, quoi, pourquoi, avec des valeurs établies par le serveur et non déclarées par le client.

#### Si vous ne retenez que trois choses

1. Une entrée complète contient acteur, instant, action, cible, avant et après, motif, résultat et contexte.
2. L'acteur et l'instant sont déterminés par le serveur.
3. Le motif est obligatoire pour les actions sensibles et les valeurs sensibles sont masquées.

### 3. Explication technique détaillée

#### Les types d'acteurs

| Type | Exemple | Informations utiles |
|---|---|---|
| Utilisateur | Mathilde Durand | Identifiant, nom, session, appareil |
| Compte de service | `svc_nightly_import` | Propriétaire, application |
| Automatisation | `on_critical_finding` v4 | Version de la règle, événement déclencheur |
| Plateforme | Planificateur, migration | Composant, tâche |
| Opérateur du fournisseur | Ingénieur support | Ticket, approbation (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) |
| Agent au nom de | Collègue avec délégation | Acteur et mandant (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)) |

#### La représentation des changements

Les différences peuvent être représentées au niveau du champ, ou par un format de description de modification de document comme JSON Patch (RFC 6902).

```json
[
  { "op": "replace", "path": "/next_inspection_date", "value": "2026-12-15" },
  { "op": "add",     "path": "/notes/-",              "value": "Report accordé" }
]
```

**Choix de conception.** On stocke souvent les deux : les valeurs avant et après par champ (lisibles, indexables), et, pour les structures complexes, un différentiel.

#### Les actions en masse et automatiques

| Situation | Représentation |
|---|---|
| Opération en masse | Une entrée de lot (acteur, critère, nombre) et des entrées par ressource, liées par un identifiant de lot |
| Automatisation | Acteur = automatisation et version ; événement déclencheur en cause |
| Import | Acteur = utilisateur ; identifiant d'import ; fichier source |
| Transition d'état | Action = transition ; état avant et après |

#### L'ordre et l'horloge

L'ordre des entrées se fonde sur l'instant d'enregistrement par le serveur, avec un **numéro de séquence** pour départager les entrées proches. Les serveurs sont synchronisés par un protocole d'horloge. Pour des preuves fortes, on peut faire horodater des empreintes par un tiers.

#### Le masquage

| Donnée | Traitement dans l'audit |
|---|---|
| Mot de passe, secret, jeton | Jamais enregistrés |
| Donnée personnelle sensible | Masquée ou remplacée par une référence |
| Contenu volumineux | Référence vers une version, avec empreinte |
| Champ à droit restreint | L'accès à l'entrée suit les droits du champ (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) |

#### Une estimation de volume

Avec 10 millions d'entrées par jour de 2 Ko chacune, le volume est :

$$10^{7} \times 2\ \text{Ko} = 20\ \text{Go par jour}$$

soit environ 7 To par an. D'où l'importance de choisir ce qui est audité, de compresser, et de tenir une politique de conservation.

**Contre-exemple.** Une entrée du type `{ "actor": "system", "action": "update", "target": "aircraft/ac_8f3a" }`. On ne sait ni qui a déclenché, ni ce qui a changé, ni pourquoi. Elle remplit le journal sans servir à rien.

**Limites.** Un motif libre est parfois peu informatif (« correction »). On le complète par une liste de motifs codifiés, une référence obligatoire à une demande pour les actions les plus sensibles, et un contrôle de qualité.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.1 Journal d'audit, journal d'activité et historique des modifications](#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Il décrit la structure de l'entrée du journal d'audit |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | Les actions déléguées enregistrent deux identités |
| [9.4 Instantané et différence](#94-instantané-et-différence) | Les différences s'expriment par instantanés et différentiels |
| [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation) | Le motif est lié à la demande de changement |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Le contexte reprend les identifiants de corrélation et de causalité |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits de champ s'appliquent aux valeurs enregistrées |

### 5. Application pratique

**Situation initiale.** Lors d'un contrôle, l'inspecteur constate qu'une date d'inspection a été repoussée de deux semaines. L'entrée d'audit indique seulement « modifié par système ».

**Problème.** On ne sait pas si c'est une personne, un import ou une règle, ni pourquoi.

**Application du concept.** Le moteur exige un motif pour les champs réglementaires et enregistre l'acteur réel.

**Déroulé.**

1. L'utilisateur modifie la date : l'interface demande un motif (liste codifiée plus texte).
2. Le moteur enregistre l'acteur authentifié, l'instant serveur, les valeurs avant et après, le motif et la référence du dossier.
3. L'inspecteur recherche par ressource et par champ.
4. Il obtient : « 12 octobre, Mathilde Durand, de 30/11 à 15/12, report accordé par l'autorité, dossier DGAC-2026-118 ».

**Résultat.** La question est close en quelques minutes, avec la référence du justificatif.

**Limites.** Un motif frauduleux est possible : l'audit ne prévient pas, il permet de détecter et de sanctionner, y compris par recoupement avec les pièces justificatives.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles informations compose une entrée d'audit complète ?
2. **Compréhension.** Pourquoi l'horodatage est-il établi par le serveur ?
3. **Compréhension.** Comment enregistre-t-on une action d'un collègue agissant par délégation ?
4. **Pourquoi.** Pourquoi enregistre-t-on aussi les tentatives refusées ?
5. **Raisonnement pratique.** Quel traitement appliquer à un mot de passe modifié dans l'audit ?

#### Réponses

1. Acteur, mandant éventuel, instant, action, cible, valeurs avant et après, motif, résultat et contexte.
2. Parce qu'un horodatage fourni par le client peut être faux ou décalé : seul le serveur offre une chronologie fiable.
3. Avec les deux identités : l'acteur réel (le collègue) et le mandant (la personne au nom de qui il agit), avec la référence de la délégation.
4. Parce qu'elles révèlent des tentatives d'accès non autorisées et des comportements anormaux, utiles à la sécurité.
5. Ne jamais enregistrer sa valeur : on trace l'événement (« mot de passe modifié ») sans la valeur ni son empreinte.

## 9.3 Révision et versionnement d'entité

### 1. Comprendre simplement

Une **révision** (*revision*) est un état identifié d'une ressource à un moment de son histoire. Le **versionnement d'entité** (*entity versioning*) consiste à **conserver les révisions successives** d'une ressource, et pas seulement la dernière, pour pouvoir les consulter, les comparer et en restaurer une.

**Pourquoi cela existe.** Sans historique des états, une modification écrase l'ancienne valeur : on ne peut plus retrouver ce qui a été remplacé, revenir en arrière, ni savoir quel était l'état de la ressource à une date passée.

**Problème résolu.** Conserver la mémoire des états d'une ressource, pour l'annulation, la comparaison, la preuve et la collaboration.

**Modèle mental.** L'historique des versions d'un document partagé : chaque enregistrement crée une version, on peut les comparer et restaurer l'une d'elles.

**Où l'analogie s'arrête.** Un document est un objet unique. Une ressource d'une plateforme est liée à d'autres : « restaurer » une ressource sans ses relations, ou quand les ressources liées ont changé, pose des questions de cohérence.

**Exemple.** L'aéronef F-ABCD a 14 révisions. L'utilisateur compare les révisions 11 et 14, constate qu'une immatriculation a été corrigée, et restaure la révision 12.

**Les composants.**

1. un **numéro de révision** ;
2. un **contenu** de la révision ;
3. des **métadonnées** (auteur, instant, motif) ;
4. des **opérations** (lister, comparer, restaurer).

**Objectif d'apprentissage :** vous pouvez décrire comment conserver les révisions d'une ressource, interroger son état à une date donnée et restaurer sans réécrire l'histoire.

### 2. Connaissances essentielles

#### Définition

- **Révision** : état complet et identifié d'une ressource, correspondant à un enregistrement ou à une étape significative de son cycle de vie.
- **Versionnement d'entité** : mécanisme qui conserve les révisions successives d'une ressource avec leurs métadonnées, et permet de les interroger.

#### Idées fondamentales

1. **Une révision est immuable.** On ajoute, on ne modifie pas.
2. **Restaurer crée une nouvelle révision.** Le contenu ancien devient le nouveau contenu courant, et l'historique reste linéaire.
3. **La question « à la date T » a une réponse.** On retrouve la révision qui était en vigueur.
4. **Le versionnement a un coût.** Stockage et complexité.
5. **Les droits s'appliquent à l'historique.** Une valeur à droit restreint l'est aussi dans ses révisions passées.
6. **Les relations posent question.** Une référence désigne-t-elle « la dernière version » ou « cette version » ?

#### Vocabulaire essentiel

- **Numéro de révision** (*revision number*) : compteur croissant par ressource.
- **Révision courante** (*current revision*) : la dernière.
- **Table d'historique** (*history table*) : stockage des révisions antérieures.
- **Table temporelle versionnée par le système** (*system-versioned temporal table*) : mécanisme de base de données qui conserve l'historique des lignes (SQL:2011).
- **Requête « à la date »** (*as-of query*) : lecture de l'état à un instant donné.
- **Restauration** (*restore*) : remise en vigueur d'une révision antérieure.
- **Référence épinglée** (*pinned reference*) : référence qui désigne une révision précise.

#### Relations de cause à effet

- Les révisions sont conservées sans limite ni politique. Le stockage croît, les lectures de l'historique ralentissent.
- Une restauration réécrit les révisions intermédiaires. L'historique perd son intégrité, et on ne sait plus ce qui a eu lieu.
- L'historique révèle des champs à droits restreints. Un utilisateur sans droit sur le coût le lit dans une ancienne révision.

#### Idées reçues

- **« Le numéro de version du contrôle de concurrence est la révision. »** Ils peuvent coïncider, mais leurs rôles diffèrent : l'un détecte les conflits (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)), l'autre identifie un état historique.
- **« Restaurer, c'est effacer les révisions suivantes. »** Non : c'est ajouter une révision qui reprend le contenu ancien.
- **« Versionner toute la plateforme est souhaitable. »** On versionne ce dont l'historique a de la valeur, pour un coût raisonnable.

#### Principe clé

L'historique est en ajout seul : toute modification, y compris une restauration, ajoute une révision et n'en retire aucune.

#### Si vous ne retenez que trois choses

1. Chaque révision est un état immuable, avec auteur, instant et motif.
2. Restaurer crée une nouvelle révision au contenu ancien.
3. L'historique suit les mêmes droits d'accès que les données courantes.

### 3. Explication technique détaillée

#### Le schéma d'une table d'historique

```sql
CREATE TABLE aircraft_revision (
  tenant_id   uuid        NOT NULL,
  resource_id uuid        NOT NULL,
  revision    integer     NOT NULL,
  data        jsonb       NOT NULL,        -- contenu complet de la révision
  changed_by  uuid        NOT NULL,
  reason      text,
  valid_from  timestamptz NOT NULL,
  valid_to    timestamptz,                 -- NULL pour la révision courante
  PRIMARY KEY (tenant_id, resource_id, revision)
);
```

#### La lecture « à la date »

```sql
SELECT data
FROM aircraft_revision
WHERE tenant_id = :tenant
  AND resource_id = :id
  AND valid_from <= :instant
  AND (valid_to IS NULL OR valid_to > :instant);
```

#### Les mécanismes de conservation

| Mécanisme | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Table d'historique alimentée par l'application | L'application écrit la révision | Contrôle total, motif | Risque d'oubli sur un chemin |
| Déclencheurs de base de données | La base écrit l'historique | Complet, indépendant du chemin | Motif et acteur plus difficiles à passer |
| Tables temporelles du système (SQL:2011) | La base versionne les lignes | Intégré, requêtes « à la date » | Dépend du moteur, moins de métadonnées métier |
| Sourcing d'événements (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)) | Les événements sont la donnée | Historique natif | Changement de modèle complet |

#### Ce qui est versionné

| Élément | Versionner ? | Remarque |
|---|---|---|
| Champs scalaires de la ressource | Oui | Cas de base |
| Parties composées (lignes d'un rapport) | Oui, avec le tout | La révision porte sur l'ensemble (voir [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation)) |
| Relations | Selon le besoin | Une relation ajoutée ou retirée est un changement |
| Ressources référencées | Non, par défaut | La référence désigne la ressource, pas sa révision |
| Pièces jointes | Par empreinte | Conserver l'empreinte et l'accès |

#### Les références : dernière version ou version épinglée

Une tâche référence un aéronef. Deux comportements :

- **Référence vivante** : elle désigne l'aéronef courant. Elle est utile pour le suivi.
- **Référence épinglée** : elle désigne la révision de l'aéronef au moment de la tâche. Elle est utile pour la preuve : « sur quel état l'inspection a-t-elle été réalisée ? ».

On choisit l'une ou l'autre selon la finalité ; les documents réglementaires utilisent souvent des références épinglées.

#### Brouillon et publication

Pour un contenu qui passe par une validation (une procédure, un document), on distingue révision **brouillon** et révision **publiée**. La révision publiée est celle qui est en vigueur ; les brouillons sont des états de travail (voir [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation)).

#### Droits et conservation

- L'accès à l'historique suit les droits de lecture, **y compris au niveau du champ** (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- La durée de conservation des révisions est définie par type, avec purge ou archivage des plus anciennes.
- Le droit à l'effacement exige de pouvoir anonymiser les données personnelles dans les révisions.

**Contre-exemple.** Une fonction « Annuler la dernière modification » qui supprime la dernière ligne d'historique et rétablit l'état précédent. Le journal n'indique plus qu'une erreur a eu lieu, ni qui l'a corrigée.

**Limites.** Conserver toutes les révisions de toutes les ressources fait croître le stockage. On adopte des politiques adaptées : toutes les révisions pour les données réglementaires, une révision par jour pour d'autres, rien pour les données jetables.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le numéro de version sert aussi au contrôle de concurrence |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'historique des modifications est l'une des trois traces |
| [9.4 Instantané et différence](#94-instantané-et-différence) | Les révisions se stockent en instantanés ou en différences |
| [9.6 Retour arrière](#96-retour-arrière) | La restauration d'une révision est une forme de retour arrière |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) | Le sourcing d'événements est une autre façon de conserver l'histoire |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La modélisation temporelle généralise les requêtes « à la date » |

### 5. Application pratique

**Situation initiale.** Un technicien corrige par erreur l'immatriculation d'un aéronef avec celle d'un autre. L'erreur est détectée trois jours plus tard, après plusieurs modifications légitimes.

**Problème.** Revenir en arrière sans perdre les modifications légitimes, et savoir exactement ce qui a été fait.

**Application du concept.** L'historique des révisions permet de comparer et de restaurer le champ concerné.

**Déroulé.**

1. L'administrateur ouvre l'historique de l'aéronef : 18 révisions.
2. Il compare les révisions 12 (avant l'erreur) et 18 (courante) : l'immatriculation est la seule différence indésirable, avec deux modifications légitimes sur d'autres champs.
3. Il restaure uniquement le champ `registration` à sa valeur de la révision 12.
4. Une révision 19 est créée, avec le motif « correction d'une erreur de saisie ».

**Résultat.** L'erreur est corrigée, les modifications légitimes sont conservées, et l'historique raconte toute l'histoire.

**Limites.** Si l'immatriculation erronée a été utilisée dans des documents émis entre-temps, le retour arrière de la donnée ne les corrige pas : une procédure de correction des documents est nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une révision ?
2. **Compréhension.** Que se passe-t-il quand on restaure une révision ancienne ?
3. **Compréhension.** Comment retrouve-t-on l'état d'une ressource à une date donnée ?
4. **Pourquoi.** Pourquoi les droits de champ doivent-ils s'appliquer à l'historique ?
5. **Raisonnement pratique.** Une tâche d'inspection doit prouver sur quel état de l'aéronef elle a été réalisée. Quel type de référence utiliser ?

#### Réponses

1. Un état identifié et immuable d'une ressource à un moment de son histoire.
2. Une nouvelle révision est créée avec le contenu ancien ; les révisions intermédiaires restent dans l'historique.
3. En cherchant la révision dont la période de validité contient cette date (requête « à la date »).
4. Parce qu'un utilisateur sans droit sur un champ pourrait sinon le lire dans une révision passée.
5. Une référence épinglée : elle désigne la révision de l'aéronef au moment de l'inspection, et non son état courant.

## 9.4 Instantané et différence

### 1. Comprendre simplement

Un **instantané** (*snapshot*) est une **copie complète** de l'état d'une ressource à un instant donné. Une **différence** (*diff*) est la description de **ce qui a changé** entre deux états. Ce sont les deux manières de conserver l'histoire : stocker chaque état en entier, ou stocker uniquement les changements.

**Pourquoi cela existe.** Un historique doit être à la fois lisible, compact et rapide à interroger. Les copies complètes sont simples à lire mais volumineuses ; les différences sont compactes mais demandent de reconstruire. Le choix, ou la combinaison, dépend de l'usage.

**Problème résolu.** Choisir comment représenter les changements pour conserver l'historique à un coût raisonnable et le rendre utile pour la comparaison, l'audit et la restauration.

**Modèle mental.** Une série de photographies d'un chantier (instantanés), et la liste « ce qui a été ajouté depuis la dernière photo » (différences).

**Où l'analogie s'arrête.** Deux photos se comparent à l'œil. Deux états de données structurées se comparent par des règles : ordre des listes, valeurs équivalentes, relations.

**Exemple.** Une règle de workflow modifiée passe de la version 3 à la version 4. L'interface affiche une différence : « condition changée de `severity = 'major'` à `severity IN ('major','critical')` ; action de notification ajoutée ».

**Les composants.**

1. des **instantanés** (états complets) ;
2. des **différences** (changements entre états) ;
3. des **règles de reconstruction** ;
4. des **présentations** lisibles.

**Objectif d'apprentissage :** vous pouvez comparer instantanés et différences, estimer leur coût de stockage et décrire la stratégie de points de référence.

### 2. Connaissances essentielles

#### Définition

- **Instantané** : représentation complète et autonome de l'état d'une ressource ou d'une configuration à un instant donné.
- **Différence** (*diff*, *delta*) : description des changements nécessaires pour passer d'un état à un autre.

#### Idées fondamentales

1. **L'instantané est autonome.** Il se lit seul, sans autre donnée.
2. **La différence est compacte.** Elle ne contient que les changements.
3. **Reconstruire demande une base.** À partir d'un instantané et d'une suite de différences.
4. **On combine souvent les deux.** Un instantané tous les $k$ changements, des différences entre.
5. **Une différence peut être technique ou sémantique.** Les champs qui changent, ou une description métier.
6. **Comparer est une opération à part entière.** Elle demande des règles pour les listes, les relations et les équivalences.

#### Vocabulaire essentiel

- **Point de référence** (*keyframe*, *base snapshot*) : instantané périodique utilisé comme base de reconstruction.
- **Différentiel** (*delta*) : suite de changements depuis un état précédent.
- **JSON Patch** (RFC 6902) et **JSON Merge Patch** (RFC 7396) : formats normalisés de description de modifications d'un document JSON.
- **Différence textuelle** (*text diff*) : comparaison ligne à ligne de textes.
- **Différence sémantique** (*semantic diff*) : description du changement en termes métier.
- **Fusion à trois voies** (*three-way merge*) : combinaison de deux modifications à partir d'une base commune.

#### Relations de cause à effet

- Seules des différences sont conservées, sans point de référence. Reconstruire l'état 1 000 impose de rejouer 1 000 différences, et la perte d'une seule rompt la chaîne.
- Seuls des instantanés sont conservés. Le stockage croît proportionnellement au nombre de révisions et à la taille de la ressource.
- Une différence est calculée sans normaliser l'ordre des champs ou des listes. Des changements apparents n'en sont pas, et le bruit masque l'essentiel.

#### Idées reçues

- **« Une différence est toujours plus économique. »** Pas toujours : pour des changements massifs ou des listes réordonnées, elle peut dépasser la taille d'un instantané.
- **« Comparer deux versions est trivial. »** Les structures imbriquées, les listes et les références demandent des choix de conception.
- **« Le texte de la différence suffit à l'utilisateur. »** Un patch technique est illisible pour un responsable métier : il faut une présentation sémantique.

#### Principe clé

Conservez des instantanés pour la rapidité et la robustesse, des différences pour la compacité et la lisibilité, et alternez les deux avec des points de référence.

#### Si vous ne retenez que trois choses

1. Un instantané est un état complet ; une différence décrit ce qui a changé.
2. La combinaison de points de référence et de différences équilibre stockage et coût de lecture.
3. Une comparaison utile est normalisée et présentée en termes métier.

### 3. Explication technique détaillée

#### Comparaison des deux approches

| Critère | Instantanés | Différences |
|---|---|---|
| Stockage | Élevé | Faible |
| Lecture d'un état | Directe | Reconstruction |
| Robustesse | Chaque état est autonome | La chaîne doit rester intacte |
| Comparaison de deux états | Calculée | Disponible directement entre voisins |
| Usage typique | Archives, configurations publiées | Historique fin, audit des champs |

#### Le coût de stockage

Soit $S$ la taille d'un état complet, $d$ la taille moyenne d'une différence, $n$ le nombre de révisions et $k$ l'intervalle entre points de référence.

| Stratégie | Stockage total |
|---|---|
| Instantanés seuls | $n \times S$ |
| Différences seules (un seul état de base) | $S + (n-1) \times d$ |
| Points de référence tous les $k$ | $\dfrac{n}{k} \times S + n \times d$ |

**Exemple chiffré.** Avec $S = 50$ Ko, $d = 1$ Ko et $n = 1\,000$ révisions :

- instantanés seuls : $1\,000 \times 50 = 50\,000$ Ko, soit 50 Mo ;
- différences seules : $50 + 999 \times 1 \approx 1\,049$ Ko, soit environ 1 Mo ;
- points de référence tous les 50 : $20 \times 50 + 1\,000 \times 1 = 2\,000$ Ko, soit 2 Mo, avec au plus 50 différences à rejouer pour reconstruire un état.

#### Une différence représentée en JSON Patch

```json
{
  "from_revision": 11,
  "to_revision": 12,
  "patch": [
    { "op": "replace", "path": "/status", "value": "in_inspection" },
    { "op": "replace", "path": "/next_inspection_date", "value": "2026-12-15" },
    { "op": "remove",  "path": "/notes/2" }
  ]
}
```

#### Une différence sémantique pour l'interface

```text
Aéronef F-ABCD  ·  révision 11 → 12  ·  Mathilde Durand, 12 octobre 14:03
  Statut                    Actif  →  En inspection
  Prochaine inspection      30/11/2026  →  15/12/2026
  Note n° 3                 supprimée : « RAS »
```

L'interface traduit les chemins techniques en libellés métier et en valeurs lisibles, selon les définitions de champs (voir [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ)).

#### Les règles de comparaison

| Cas | Difficulté | Règle usuelle |
|---|---|---|
| Ordre des champs d'un objet | Aucun sens | Ignoré |
| Listes ordonnées | Ajouts et déplacements | Comparaison par position ou par identifiant |
| Listes non ordonnées (ensembles) | Ordre sans sens | Comparaison par identifiant |
| Valeurs équivalentes (`1.0` et `1`) | Faux changements | Normalisation avant comparaison |
| Textes longs | Lignes modifiées | Différence ligne à ligne ou mot à mot |
| Références | Identifiants peu parlants | Afficher le libellé de la cible |

#### Fusion à trois voies

Quand deux personnes modifient la même configuration à partir de la même version (la base), on peut combiner :

```text
Base (v3) ──► Modification A (v4a)
          └─► Modification B (v4b)
         Fusion : A + B, avec conflit si les deux ont touché le même champ
```

Les champs modifiés par un seul côté sont fusionnés automatiquement ; les champs modifiés des deux côtés sont des conflits à résoudre (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

**Contre-exemple.** Afficher à un administrateur la différence brute de deux documents JSON de 800 lignes, où l'ordre des champs a changé : des centaines de lignes « modifiées » sans aucun changement réel, et le changement important est noyé.

**Limites.** Les différences supposent des états comparables. Si le schéma a changé entre deux révisions (champ renommé), la différence doit en tenir compte ou signaler la rupture (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité) | Les révisions se stockent sous forme d'instantanés ou de différences |
| [9.2 Acteur, horodatage, avant et après, motif](#92-acteur-horodatage-avant-et-après-motif) | Le avant et le après d'une entrée d'audit sont une différence |
| [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Comparer deux versions de configuration utilise les mêmes outils |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Une approbation porte sur un instantané figé |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | La fusion à trois voies résout des modifications concurrentes |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Les sauvegardes complètes et incrémentales suivent la même logique |

### 5. Application pratique

**Situation initiale.** Les responsables qualité modifient souvent les workflows d'approbation. Après une modification, des constats sont refusés, et l'équipe ne sait pas ce qui a changé entre la version 6 et la version 7.

**Problème.** Les deux versions sont de longs documents JSON ; la comparaison à l'œil est impraticable.

**Application du concept.** La plateforme conserve un instantané à chaque publication, et affiche une différence sémantique entre deux versions.

**Déroulé.**

1. À chaque publication, la définition complète est enregistrée (instantané immuable).
2. L'administrateur choisit « Comparer 6 et 7 ».
3. La plateforme normalise les deux définitions et calcule les changements.
4. L'interface affiche : « étape *revue* : délai passé de 2 jours à 1 jour ; branche *critique* : ajout de l'approbation de la direction ».
5. L'équipe comprend pourquoi les constats critiques attendent désormais une étape de plus.

**Résultat.** La cause du changement de comportement est identifiée en quelques minutes.

**Limites.** Pour des définitions très volumineuses, la comparaison peut être lente : on la calcule à la demande, avec mise en cache.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un instantané et une différence ?
2. **Compréhension.** Pourquoi utilise-t-on des points de référence ?
3. **Compréhension.** Qu'est-ce qu'une différence sémantique ?
4. **Pourquoi.** Pourquoi faut-il normaliser avant de comparer ?
5. **Raisonnement pratique.** Pour 1 000 révisions de 50 Ko avec des différences de 1 Ko, quel est le stockage avec un point de référence tous les 100 ?

#### Réponses

1. Un instantané est un état complet et autonome ; une différence décrit uniquement ce qui a changé entre deux états.
2. Pour limiter le nombre de différences à rejouer pour reconstruire un état, et pour rendre la chaîne plus robuste.
3. Une description du changement en termes métier (libellés, valeurs lisibles) plutôt qu'en chemins techniques.
4. Pour éviter de signaler comme changements des différences sans effet (ordre des champs, valeurs équivalentes).
5. $10 \times 50 + 1\,000 \times 1 = 1\,500$ Ko, soit environ 1,5 Mo.

## 9.5 Versionnement de la configuration, des workflows et des politiques

### 1. Comprendre simplement

Dans une plateforme configurable, **le comportement est de la donnée** : la configuration, les workflows, les règles et les politiques déterminent ce que le système fait. Pour répondre à « quelle configuration était active à ce moment-là ? », chacun de ces objets est **versionné** : le **versionnement de la configuration** (*configuration versioning*), des **workflows** (*workflow versioning*) et des **politiques** (*policy versioning*). Le versionnement du **schéma** (*schema versioning*) et celui des **API** (*API versioning*) en sont des cas voisins.

**Pourquoi cela existe.** Une décision prise hier a été produite par la configuration d'hier. Pour l'expliquer, la contester ou la rejouer, il faut retrouver la version exacte des règles qui s'appliquaient. Sans cela, l'historique des données est incomplet : on sait quoi, pas pourquoi.

**Problème résolu.** Rendre le comportement passé de la plateforme explicable, reconstituable et réversible.

**Modèle mental.** Les éditions successives d'un règlement intérieur. Chaque décision renvoie à l'édition en vigueur le jour où elle a été prise.

**Où l'analogie s'arrête.** Un règlement est un texte unique. Une configuration est un ensemble d'objets liés (types, règles, workflows, politiques) qui doivent changer **ensemble**, de façon cohérente.

**Exemple.** Le 12 octobre, un constat est refusé par la règle `inspection_overdue`. Le 20 octobre, un auditeur demande pourquoi. Le journal indique : règle version 4, table de décision `inspection_interval` version 9, valable depuis le 1er octobre.

**Les objets versionnés.**

1. **configuration** de tenant ;
2. **types et schémas** ;
3. **workflows** ;
4. **règles et tables de décision** ;
5. **politiques** d'accès et de gouvernance ;
6. **API** exposées.

**Objectif d'apprentissage :** vous pouvez décrire comment retrouver la configuration active à un instant donné et comment la relier à une décision passée.

### 2. Connaissances essentielles

#### Définition

Le **versionnement de la configuration** est la pratique qui consiste à conserver chaque état publié des objets de configuration (types, workflows, règles, politiques, réglages) comme une **version immuable**, identifiée, datée, attribuée, avec la possibilité de retrouver la version active à tout instant et de la comparer à une autre.

#### Idées fondamentales

1. **Une version publiée est immuable.** On crée une nouvelle version, on ne modifie pas l'ancienne.
2. **Une version a une période de validité.** Date d'effet et date de fin.
3. **Une décision cite la version appliquée.** Elle est donc explicable.
4. **Les instances en cours gardent leur version.** Un workflow démarré continue avec sa définition d'origine (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)).
5. **Les changements liés sont publiés ensemble.** Un ensemble de modifications forme un lot cohérent.
6. **Plusieurs objets sont versionnés, de façons voisines.** Schéma, API, configuration, mais avec des règles de compatibilité propres.

#### Vocabulaire essentiel

- **Version** (*version*) : état publié et immuable d'un objet de configuration.
- **Version active** (*active version*) : celle qui est en vigueur à un instant.
- **Date d'effet** (*effective date*) : instant à partir duquel une version s'applique.
- **Lot de changements** (*change set*, *release*) : ensemble de modifications publiées ensemble.
- **Épinglage** (*pinning*) : rattachement d'une instance à une version précise.
- **Provenance de décision** (*decision provenance*) : lien entre une décision et les versions qui l'ont produite.
- **Compatibilité** (*compatibility*) : possibilité pour des consommateurs d'une version ancienne de continuer à fonctionner.

#### Relations de cause à effet

- La définition d'un workflow est modifiée en place. Les instances en cours changent de comportement au milieu de leur exécution.
- Les décisions ne citent pas la version de règle. Plus tard, on ne peut plus dire pourquoi un refus a eu lieu.
- Des changements dépendants sont publiés séparément. Pendant un court instant, le système est dans un état incohérent (un champ supprimé alors qu'une règle l'utilise encore).

#### Idées reçues

- **« Versionner la configuration, c'est garder une copie de sauvegarde. »** Non. Une version est un objet adressable avec ses dates d'effet, et référençable par les décisions.
- **« Le numéro de version du produit suffit. »** Non. La version de la configuration d'un tenant est indépendante de la version du code.
- **« Tout changement de configuration doit créer une version immédiatement active. »** Non. On peut programmer l'activation à une date d'effet, et publier des lots.

#### Principe clé

Chaque décision peut être reliée à la version exacte de la configuration qui l'a produite, et toute version passée peut être retrouvée.

#### Si vous ne retenez que trois choses

1. Les objets de configuration sont versionnés de façon immuable, avec dates d'effet.
2. Les décisions et les instances citent la version qu'elles ont utilisée.
3. Les changements liés sont publiés comme un lot atomique.

### 3. Explication technique détaillée

#### Le panorama des objets versionnés

| Objet | Question à laquelle répond sa version | Règle de compatibilité | Entrée |
|---|---|---|---|
| Schéma d'un type | Quelle structure avaient les données ? | Rétrocompatibilité des lectures | [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) |
| Configuration de tenant | Quels réglages s'appliquaient ? | Aucune : état à la date | [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) |
| Workflow | Quelle procédure suivait ce dossier ? | Les instances restent sur leur version | [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) |
| Règle, table de décision | Quelle règle a produit cette décision ? | Date d'effet | [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision) |
| Politique d'accès | Quelle règle autorisait cet accès ? | Date d'effet, simulation | [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) |
| API | Quel contrat les clients utilisaient-ils ? | Compatibilité vers l'arrière, dépréciation | [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) |

#### Une version de configuration

```sql
CREATE TABLE config_version (
  tenant_id      uuid        NOT NULL,
  kind           text        NOT NULL,   -- 'rule', 'workflow', 'policy', 'resource_type', 'setting'
  key            text        NOT NULL,
  version        integer     NOT NULL,
  content        jsonb       NOT NULL,
  status         text        NOT NULL,   -- 'draft', 'published', 'superseded'
  effective_from timestamptz,
  effective_to   timestamptz,
  created_by     uuid        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  change_set_id  uuid,
  PRIMARY KEY (tenant_id, kind, key, version)
);
```

```sql
-- Version active d'une règle à un instant donné
SELECT *
FROM config_version
WHERE tenant_id = :tenant AND kind = 'rule' AND key = :key
  AND status IN ('published', 'superseded')
  AND effective_from <= :instant
  AND (effective_to IS NULL OR effective_to > :instant)
ORDER BY version DESC
LIMIT 1;
```

#### La provenance d'une décision

```json
{
  "decision_id": "dec_8821",
  "kind": "rule_evaluation",
  "at": "2026-10-12T14:03:27Z",
  "inputs": { "aircraft": "ac_8f3a", "inspection_date": "2026-09-30" },
  "result": "reject",
  "code": "inspection_overdue",
  "provenance": {
    "rule": { "key": "no_flight_with_overdue_inspection", "version": 4 },
    "decision_table": { "key": "inspection_interval", "version": 9 },
    "policy": { "key": "flight_dispatch", "version": 2 },
    "config_set": "cs_2026_10_01"
  }
}
```

**Pourquoi.** La décision n'est pas seulement un résultat : elle est liée aux versions qui l'ont produite. On peut la rejouer avec les mêmes versions, ou avec les nouvelles pour mesurer l'écart.

#### Les lots de changements

Quand plusieurs objets doivent changer ensemble (un champ ajouté, la règle qui l'utilise, la vue qui l'affiche), on les publie dans un **lot** : tous deviennent actifs au même instant, ou aucun.

```text
Lot cs_2026_10_01
  ├─ resource_type aircraft : v12 → v13 (ajout du champ noise_level)
  ├─ rule noise_threshold_check : v1 (nouvelle)
  └─ view fleet_overview : v7 → v8 (colonne noise_level)
→ validation d'ensemble → publication atomique à la date d'effet
```

#### Le versionnement de l'API

| Approche | Exemple | Remarque |
|---|---|---|
| Dans l'adresse | `/v2/aircraft` | Visible, simple |
| Dans un en-tête | `Accept: application/vnd.platform.v2+json` | Adresse stable |
| Par date | `Platform-Version: 2026-10-01` | Chaque client est épinglé sur une date |
| Sans version, avec compatibilité | Ajouts seulement | Exige une discipline stricte |

Le détail est traité en [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi).

#### Les règles de conception

- **Ne jamais modifier une version publiée.**
- **Citer la version** dans chaque décision, chaque instance et chaque entrée d'audit pertinente.
- **Publier par lots** quand des objets sont interdépendants.
- **Programmer les dates d'effet** pour les changements réglementaires.
- **Conserver les versions** au moins aussi longtemps que les décisions qui en dépendent.

**Contre-exemple.** Une règle « corrigée » en place, sans nouvelle version, après un incident. L'audit indique qu'une décision a été prise « par la règle X », mais cette règle n'est plus celle qui s'appliquait : la décision est inexplicable.

**Limites.** Conserver et lier toutes les versions a un coût. On le concentre sur les objets qui produisent des décisions à conséquence (règles, politiques, tables, workflows), et on tient une politique de rétention.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | Le versionnement de schéma est le cas des données structurelles |
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) | Les instances de workflow sont épinglées sur une version |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Les décisions de politique citent la version appliquée |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API protège les clients externes |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les dates d'effet relèvent de la modélisation temporelle |
| [9.6 Retour arrière](#96-retour-arrière) | Le retour arrière repose sur la conservation des versions |

### 5. Application pratique

**Situation initiale.** Un client conteste le refus d'une affectation de vol le 12 octobre, en affirmant que la règle n'existait pas à cette date.

**Problème.** La règle a été modifiée le 15 octobre ; la version active le 12 doit être retrouvée avec certitude.

**Application du concept.** La décision cite la version de règle, et la plateforme retrouve la version active à la date demandée.

**Déroulé.**

1. L'administrateur ouvre la décision `dec_8821`.
2. Elle indique : règle `no_flight_with_overdue_inspection`, version 4, active du 1er au 14 octobre.
3. Il affiche la version 4 et la compare à la version 5 (active depuis le 15) : la condition a été étendue de 10 à 15 jours.
4. Il explique au client que la règle existait à la date du refus, avec le seuil de l'époque.

**Résultat.** La contestation est tranchée sur des faits, avec la version exacte.

**Limites.** Si les versions antérieures à la mise en place du système n'ont pas été conservées, la reconstitution est impossible pour cette période.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi une version publiée est-elle immuable ?
2. **Compréhension.** Que signifie qu'une décision cite sa provenance ?
3. **Compréhension.** Pourquoi publie-t-on par lots ?
4. **Pourquoi.** Pourquoi les instances de workflow en cours restent-elles sur leur version d'origine ?
5. **Raisonnement pratique.** Comment retrouver la règle active le 12 octobre ?

#### Réponses

1. Pour que toute décision passée puisse être expliquée par l'objet exact qui l'a produite ; toute modification passe par une nouvelle version.
2. Qu'elle enregistre les versions des règles, tables et politiques qui l'ont produite, ce qui permet de l'expliquer et de la rejouer.
3. Pour que des changements interdépendants deviennent actifs ensemble, sans état intermédiaire incohérent.
4. Pour qu'une modification de la définition ne change pas le comportement d'un dossier au milieu de son exécution.
5. En cherchant la version dont la période de validité contient cette date (requête « à la date » sur les versions de configuration).

## 9.6 Retour arrière

### 1. Comprendre simplement

Le **retour arrière** (*rollback*) consiste à **ramener un système, une configuration ou des données à un état antérieur** après un changement qui s'est mal passé. Il peut porter sur du code, une configuration, un schéma ou des données.

**Pourquoi cela existe.** Les erreurs se produiront, malgré les tests et les revues. Ce qui compte alors est la **rapidité et la sûreté** du retour à un état connu. Une plateforme qui permet de changer vite doit permettre de revenir vite.

**Problème résolu.** Limiter la durée et l'étendue des dégâts d'un changement erroné.

**Modèle mental.** Le bouton « annuler » ou la restauration à un point de contrôle : on retourne à un état sûr, puis on corrige à tête reposée.

**Où l'analogie s'arrête.** Dans un éditeur de texte, l'annulation ne concerne que votre travail. Dans une plateforme, d'autres personnes et systèmes ont agi entre-temps, et certains effets (courriels envoyés, appels à des tiers) ne peuvent pas être défaits.

**Exemple.** Une règle publiée à 9 h refuse à tort des affectations. À 9 h 20, l'administrateur revient à la version précédente en un clic. À 9 h 21, les affectations reprennent.

**Les types de retour arrière.**

1. **configuration** : réactiver une version précédente ;
2. **données** : restaurer des révisions ;
3. **schéma** : revenir à une structure précédente ;
4. **code** : redéployer la version précédente.

**Objectif d'apprentissage :** vous pouvez décrire ce qui rend un retour arrière possible, ses limites, et l'alternative de la correction vers l'avant.

### 2. Connaissances essentielles

#### Définition

Un **retour arrière** est une opération qui rétablit un état antérieur identifié d'un objet ou d'un système (configuration, donnée, schéma, version de code), en enregistrant cette opération comme un nouveau changement.

#### Idées fondamentales

1. **Revenir est une opération vers l'avant.** Elle crée une nouvelle version au contenu ancien ; l'historique reste intact.
2. **Il faut avoir conservé l'état antérieur.** D'où le versionnement.
3. **Les effets externes ne se défont pas.** Un courriel ou un appel à un tiers appelle une compensation.
4. **Les changements postérieurs sont un enjeu.** Revenir peut effacer des modifications légitimes faites depuis.
5. **Le schéma est plus délicat que la configuration.** Des données ont pu être écrites sous la nouvelle structure.
6. **Corriger vers l'avant est parfois préférable.** Quand revenir est plus risqué que corriger.

#### Vocabulaire essentiel

- **Retour arrière** (*rollback*) : retour à un état antérieur.
- **Correction vers l'avant** (*roll forward*, *fix forward*) : correction par une nouvelle modification.
- **Point de restauration** (*restore point*) : état identifié auquel on peut revenir.
- **Fenêtre d'annulation** (*undo window*) : durée pendant laquelle l'annulation reste simple.
- **Compensation** (*compensation*) : action qui neutralise sur le plan métier un effet non réversible.
- **Retour arrière automatique** (*automatic rollback*) : déclenché par des signaux de santé.
- **Restauration de sauvegarde** (*backup restore*) : retour à une copie complète (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

#### Relations de cause à effet

- La version précédente n'a pas été conservée. Le retour arrière est impossible, et la correction doit être improvisée.
- Le retour arrière d'un schéma est lancé alors que des données ont été écrites avec le nouveau. Elles deviennent invalides ou sont perdues.
- Des notifications ont été envoyées par la règle erronée. Le retour arrière arrête la règle, mais ne reprend pas les courriels.

#### Idées reçues

- **« Revenir en arrière, c'est tout remettre comme avant. »** Non. Les effets externes et les modifications légitimes intermédiaires échappent au retour arrière.
- **« Une sauvegarde remplace le retour arrière. »** Elle est une dernière ligne de défense, lourde et globale. Le retour arrière ciblé est plus rapide et moins destructeur.
- **« Un bon test supprime la nécessité du retour arrière. »** Non : les tests ne couvrent jamais tout.

#### Principe clé

Concevez chaque changement pour qu'il soit réversible : conservez l'état précédent, limitez la portée, surveillez, et sachez ce qui ne peut pas être défait.

#### Si vous ne retenez que trois choses

1. Le retour arrière est une nouvelle version au contenu précédent, pas un effacement.
2. Il suppose des versions conservées, et ne défait pas les effets externes.
3. Pour les données et les schémas, il faut anticiper ce qui a été écrit depuis.

### 3. Explication technique détaillée

#### Ce qui est réversible, et comment

| Objet | Mécanisme | Difficulté | Précaution |
|---|---|---|---|
| Configuration, règle, workflow | Réactiver une version précédente | Faible | Instances en cours, décisions déjà prises |
| Politique d'accès | Réactiver une version précédente | Faible | Accès accordés ou refusés entre-temps |
| Drapeau de fonctionnalité | Inverser | Très faible | Aucune |
| Données d'une ressource | Restaurer une révision (voir [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité)) | Moyenne | Modifications intermédiaires, droits |
| Import en masse | Annuler par identifiant de lot | Moyenne | Ressources modifiées depuis |
| Schéma | Revenir à la version précédente | Élevée | Données écrites sous la nouvelle structure |
| Code | Redéployer la version précédente | Variable | Compatibilité avec le schéma, les données |
| Tout | Restaurer une sauvegarde | Très élevée | Perte des changements depuis la sauvegarde |

#### Le retour arrière de configuration

```text
Version active : v5 (erronée)         Version précédente : v4
        │
        │  POST .../versions/4/activate  (motif : « refus à tort »)
        ▼
Nouvelle version v6 = contenu de v4, active immédiatement
Journal : « v6 créée par retour arrière depuis v5 vers v4, par Karim, 09:20 »
```

Le moteur propage la nouvelle version comme un changement ordinaire (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)).

#### L'annulation d'un import

```text
Import imp_204 : 8 000 lignes → 7 650 créations, 350 mises à jour
Annuler imp_204 :
   pour chaque ressource créée par l'import et non modifiée depuis : supprimer (archiver)
   pour chaque ressource mise à jour par l'import et non modifiée depuis : restaurer la révision précédente
   les ressources modifiées depuis : listées pour décision humaine
```

Les ressources modifiées depuis l'import ne sont pas écrasées automatiquement : c'est le point sensible de tout retour arrière de données.

#### Le retour arrière du schéma

| Situation | Possibilité |
|---|---|
| Champ ajouté, aucune donnée écrite | Simple : retirer ou masquer |
| Champ ajouté, des données écrites | Masquer plutôt que supprimer, conserver les valeurs |
| Type de champ changé avec conversion | Difficile : la conversion a pu perdre de l'information |
| Champ supprimé | Impossible si les données ont été supprimées ; d'où la dépréciation progressive (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)) |

La méthode « étendre puis contracter » rend le retour arrière possible tant que la contraction n'a pas eu lieu.

#### Le retour arrière automatique

Un déploiement ou une configuration est publié avec des **signaux de santé** surveillés (taux d'erreurs, latence, refus). Si un seuil est franchi, le système bascule automatiquement vers la version précédente et alerte.

#### Revenir ou corriger vers l'avant

| Critère | Retour arrière | Correction vers l'avant |
|---|---|---|
| Rapidité | Très rapide si prévu | Dépend de la correction |
| Risque | Effets de bord du retour | Nouveau changement non testé |
| Données écrites sous la nouvelle version | Problématique | Souvent nécessaire |
| Quand | Changement récent, état antérieur sain | Retour impossible ou plus dangereux |

**Contre-exemple.** Annuler à l'aveugle une migration de schéma en production après trois heures d'écritures. Les données écrites avec la nouvelle structure sont perdues ou corrompues, et l'incident s'aggrave.

**Limites.** Le retour arrière n'efface pas la nécessité de comprendre la cause. Chaque retour est suivi d'une analyse et d'un correctif (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.3 Révision et versionnement d'entité](#93-révision-et-versionnement-dentité) | La restauration de révisions est son mécanisme pour les données |
| [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | La conservation des versions de configuration le rend possible |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | Étendre puis contracter garde le retour possible |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | La compensation traite les effets non réversibles |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les drapeaux offrent un retour immédiat |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | La restauration de sauvegarde est la ligne de défense finale |

### 5. Application pratique

**Situation initiale.** Un import de 8 000 aéronefs écrase, par erreur, les dates d'inspection de 350 aéronefs existants avec des valeurs du fichier, anciennes.

**Problème.** L'erreur est découverte deux heures plus tard. Pendant ce temps, des planificateurs ont modifié 40 de ces aéronefs.

**Application du concept.** L'import est annulé par son identifiant, avec traitement des ressources modifiées depuis.

**Déroulé.**

1. L'administrateur choisit « Annuler l'import imp_204 » et obtient un aperçu.
2. L'aperçu indique : 310 mises à jour restaurables, 40 modifiées depuis (à décider), 7 650 créations conservées.
3. Il approuve la restauration des 310 aéronefs à leur révision précédente.
4. Pour les 40 autres, il affiche les deux valeurs et laisse les planificateurs trancher.
5. Les restaurations sont journalisées avec le motif et le lot d'origine.

**Résultat.** Les données erronées sont corrigées sans écraser le travail légitime des deux dernières heures.

**Limites.** Si les dates erronées avaient déjà déclenché des notifications, celles-ci ne se rappellent pas : une communication corrective est nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un retour arrière est-il enregistré comme un nouveau changement ?
2. **Compréhension.** Quels effets un retour arrière ne peut-il pas défaire ?
3. **Compréhension.** Quel est le risque du retour arrière d'un schéma ?
4. **Pourquoi.** Pourquoi les modifications faites depuis un import ne sont-elles pas écrasées automatiquement par son annulation ?
5. **Raisonnement pratique.** Quand préférer la correction vers l'avant ?

#### Réponses

1. Pour conserver un historique linéaire et complet : on ne réécrit jamais le passé, on y ajoute une nouvelle version.
2. Les effets externes : courriels envoyés, appels vers des systèmes tiers, paiements. Ils demandent une compensation.
3. Des données ont pu être écrites avec la nouvelle structure : elles deviendraient invalides ou seraient perdues.
4. Parce qu'elles sont légitimes : les écraser détruirait un travail valide ; on les signale pour décision.
5. Quand le retour est plus risqué que la correction, par exemple parce que des données ont déjà été écrites sous la nouvelle version.

## 9.7 Revue, demande de changement et approbation

### 1. Comprendre simplement

Dans une plateforme où la configuration est le comportement, modifier une règle revient à modifier le logiciel. La **gouvernance des changements** applique à ces modifications les pratiques qui protègent le code : une **demande de changement** (*change request*) décrit ce que l'on veut changer et pourquoi, une **revue** (*review*) fait examiner le changement par une autre personne, et une **approbation** (*approval*) l'autorise avant sa mise en service.

**Pourquoi cela existe.** Un changement non maîtrisé de configuration peut bloquer une flotte, ouvrir un accès, fausser des décisions réglementaires. La plupart des cadres de conformité exigent une gestion des changements : pour que chaque modification soit justifiée, évaluée, autorisée et tracée.

**Problème résolu.** Réduire le risque des changements de configuration sans les ralentir inutilement, et prouver qu'ils ont été contrôlés.

**Modèle mental.** La revue de code et la demande de fusion (*pull request*) : un changement est proposé avec sa différence, des relecteurs commentent, des approbateurs valident, puis on publie.

**Où l'analogie s'arrête.** Une revue de code se fait entre développeurs. Les changements de configuration sont proposés par des profils métier, relus par d'autres profils métier et techniques, avec des enjeux de conformité.

**Exemple.** Le responsable qualité propose de modifier le seuil d'immobilisation de 10 à 15 jours. La demande affiche la différence, l'impact simulé (23 aéronefs concernés), et requiert l'approbation du directeur technique avant publication.

**Les composants.**

1. une **demande de changement** (objet, motif, impact, plan) ;
2. une **revue** et des **commentaires** ;
3. une **règle d'approbation** selon le risque ;
4. un **journal** de décision ;
5. une **application** contrôlée du changement.

**Objectif d'apprentissage :** vous pouvez décrire le cycle d'une demande de changement et dire comment proportionner le contrôle au risque.

### 2. Connaissances essentielles

#### Définition

- **Demande de changement** : proposition formelle de modification d'une configuration ou d'un processus, avec sa justification, son impact évalué et son plan d'application.
- **Revue** : examen d'un changement proposé par une personne autre que son auteur.
- **Approbation** : décision d'autoriser un changement, prise par une personne ou un groupe habilité.

#### Idées fondamentales

1. **Le contrôle est proportionné au risque.** Les changements mineurs sont automatiques, les majeurs exigent des approbations.
2. **L'auteur n'approuve pas son propre changement.** C'est la séparation des tâches (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
3. **Le changement est examiné avec sa différence et son impact.** Pas sur description seule.
4. **Les contrôles automatiques précèdent la revue humaine.** Validation, tests, simulation.
5. **Les urgences ont une voie dédiée.** Avec revue a posteriori.
6. **Tout est tracé.** Demande, avis, décision, application, résultat.

#### Vocabulaire essentiel

- **Changement standard** (*standard change*) : changement courant à faible risque, préapprouvé.
- **Changement d'urgence** (*emergency change*) : changement accéléré pour résoudre un incident.
- **Relecteur** (*reviewer*) : personne qui examine.
- **Approbateur** (*approver*) : personne qui autorise.
- **Fenêtre de changement** (*change window*) : période autorisée pour appliquer.
- **Matrice d'approbation** (*approval matrix*) : règles qui associent risque et approbateurs.
- **Taux d'échec des changements** (*change failure rate*) : proportion de changements qui entraînent un incident ou un retour arrière.

#### Relations de cause à effet

- Tous les changements exigent les mêmes approbations. Les équipes les contournent par des canaux informels, et les changements risqués ne sont plus mieux contrôlés.
- La revue porte sur une description. Les relecteurs approuvent sans voir la différence réelle ni l'impact, et deviennent une formalité.
- Les urgences n'ont pas de procédure. Les équipes modifient directement la production, et personne ne revoit ensuite.

#### Idées reçues

- **« La gouvernance ralentit toujours. »** Mal conçue, oui. Bien proportionnée, elle accélère les changements courants (préapprouvés) et sécurise les autres.
- **« Une approbation, c'est un clic. »** Elle engage la responsabilité de l'approbateur : elle porte sur une version précise du changement, avec son impact.
- **« La revue est l'affaire des techniciens. »** Pour de la configuration métier, ce sont souvent les responsables du métier qui relisent.

#### Principe clé

Un changement de configuration est contrôlé selon son risque : examiné avec sa différence et son impact, autorisé par une personne autre que son auteur, appliqué de façon contrôlée et tracé.

#### Si vous ne retenez que trois choses

1. La gouvernance des changements applique à la configuration les pratiques qui protègent le code.
2. Le niveau de contrôle dépend du risque ; l'auteur n'approuve pas son propre changement.
3. Chaque étape (demande, revue, décision, application) est tracée.

### 3. Explication technique détaillée

#### Le cycle d'une demande de changement

```text
Brouillon ─► Soumise ─► En revue ─┬─► Modifications demandées ──► (retour au brouillon)
                                  ├─► Rejetée
                                  └─► Approuvée ─► Planifiée ─► Appliquée ─► Vérifiée ─► Clôturée
                                                                    │
                                                                    └─► Retour arrière (si échec)
```

#### Le contenu d'une demande

```json
{
  "id": "chg_0471",
  "title": "Seuil d'immobilisation : 10 → 15 jours",
  "author": "u_qm_01",
  "type": "rule_change",
  "risk": "high",
  "target": { "kind": "rule", "key": "no_flight_with_overdue_inspection", "from_version": 4, "to_version": 5 },
  "reason": "Consigne de l'autorité n° 2026-33",
  "diff": "(voir la différence sémantique)",
  "impact": { "aircraft_affected": 23, "flights_affected": 8, "simulated_period": "30 jours" },
  "checks": { "validation": "passed", "tests": "12/12", "simulation": "completed" },
  "effective_from": "2026-11-01T00:00:00Z",
  "required_approvals": [ { "role": "technical_director" }, { "role": "quality_manager" } ],
  "rollback_plan": "Réactiver la version 4"
}
```

#### Proportionner le contrôle au risque

| Niveau de risque | Exemples | Contrôle |
|---|---|---|
| Faible (standard) | Libellé, aide, vue personnelle | Automatique, journalisé |
| Moyen | Nouveau champ, nouvelle vue partagée, règle non réglementaire | Revue par un pair |
| Élevé | Règle réglementaire, workflow d'approbation, politique d'accès | Revue et approbation de deux personnes, simulation |
| Critique | Droits d'administration, désactivation de l'audit, export massif | Approbation renforcée, second facteur, fenêtre dédiée |

**Détermination automatique.** Le niveau de risque se déduit de l'objet touché (type de configuration, étiquette « réglementaire ») et de l'impact simulé, par une règle de la plateforme, pas par déclaration de l'auteur.

#### Les contrôles automatiques

| Contrôle | Résultat attendu avant revue |
|---|---|
| Validation de cohérence | Aucun lien brisé, aucun cycle |
| Tests de scénarios | Tous passent |
| Simulation sur historique | Impact connu et chiffré |
| Analyse de dépendances | Éléments concernés listés |
| Contrôle des droits | L'auteur a le droit de proposer ce changement |

#### Séparation des tâches et délégation

- L'**auteur** ne peut pas être l'approbateur.
- Un approbateur qui reçoit une **délégation** reste soumis à la même règle (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
- Pour les changements critiques, deux approbateurs **distincts** sont requis.

#### Les changements d'urgence

```text
Incident ─► changement d'urgence : approbation accélérée (un approbateur de garde)
         ─► application immédiate, avec motif et lien vers l'incident
         ─► revue a posteriori sous 48 h par le comité de changement
         ─► régularisation ou retour arrière
```

La voie d'urgence existe pour ne pas encourager les contournements, mais elle est tracée, limitée et revue.

#### Les indicateurs

| Indicateur | Utilité |
|---|---|
| Délai de traitement des demandes | Détecter les goulots d'étranglement |
| Taux de rejet | Qualité des propositions et clarté des critères |
| Taux d'échec des changements | Efficacité du contrôle |
| Part des changements d'urgence | Santé du processus |
| Changements hors circuit détectés | Contournements à traiter |

**Contre-exemple.** Un processus d'approbation identique pour tout, avec trois approbateurs pour changer un libellé. Les équipes y renoncent et modifient directement la configuration par l'API, hors circuit.

**Limites.** La gouvernance suppose que l'on ne puisse pas contourner le circuit : l'API de configuration applique les mêmes règles que l'interface, y compris pour les administrateurs.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | L'approbation de workflow est la forme métier de la même idée |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches l'impose |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | Les délégations d'approbation y sont encadrées |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | La plateforme d'administration intègre ce cycle |
| [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les changements sont des nouvelles versions de configuration |
| [9.8 Exception et preuve](#98-exception-et-preuve) | Les décisions et les exceptions constituent des preuves |

### 5. Application pratique

**Situation initiale.** Une autorité publie une consigne : l'intervalle d'inspection de certains aéronefs passe de 90 à 60 jours à compter du 1er novembre.

**Problème.** La modification de la table de décision touche des dizaines d'aéronefs et des vols programmés. Elle doit être décidée, tracée et datée.

**Application du concept.** Une demande de changement avec simulation, approbation à deux, et date d'effet.

**Déroulé.**

1. Le responsable qualité crée la demande avec la nouvelle version de la table et la référence de la consigne.
2. Les contrôles automatiques passent ; la simulation indique 23 aéronefs et 8 vols concernés.
3. La plateforme classe le changement « critique » (règle réglementaire) : deux approbateurs requis.
4. Le directeur technique et le responsable sécurité approuvent, chacun avec un commentaire.
5. La table devient active le 1er novembre à 00:00, avec un lot d'actions de replanification préparées.

**Résultat.** Le changement est appliqué à la bonne date, avec une preuve complète de la décision.

**Limites.** Si le seul directeur technique est absent, la procédure de remplacement (délégation tracée) doit être prévue pour ne pas manquer la date d'effet.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi proportionne-t-on le contrôle au risque ?
2. **Compréhension.** Que contient une demande de changement ?
3. **Compréhension.** Quelle règle interdit à l'auteur d'approuver ?
4. **Pourquoi.** Pourquoi prévoit-on une voie d'urgence ?
5. **Raisonnement pratique.** Des changements sont régulièrement faits « hors circuit » par l'API. Quelle est la faille ?

#### Réponses

1. Pour que les changements courants restent rapides, et que l'effort de contrôle porte sur ceux qui peuvent causer des dégâts.
2. Un objet, un motif, une différence, un impact évalué, les résultats des contrôles, une date d'effet, les approbations requises et un plan de retour.
3. La séparation des tâches : l'auteur d'un changement ne peut pas être son approbateur.
4. Pour que les incidents puissent être traités rapidement dans un cadre tracé, plutôt que d'encourager des contournements.
5. L'API de configuration n'applique pas les mêmes règles de gouvernance que l'interface : le circuit de changement doit être imposé à tous les canaux.

## 9.8 Exception et preuve

### 1. Comprendre simplement

Une **exception** (*exception*) est un **écart autorisé, documenté et limité dans le temps** par rapport à une règle ou à une politique. Une **preuve** (*evidence*) est l'ensemble des **éléments enregistrés** qui démontrent qu'un contrôle a été appliqué, qu'une décision a été prise ou qu'une exception a été accordée régulièrement.

**Pourquoi cela existe.** Aucune règle ne couvre tous les cas. Le réel impose des dérogations : une pièce indisponible, une urgence, une situation imprévue. Sans cadre, elles se font en cachette et érodent les règles. Avec un cadre, elles sont maîtrisées et défendables. Et face à un auditeur, une affirmation ne suffit pas : il faut des preuves.

**Problème résolu.** Permettre la flexibilité nécessaire sans perdre la maîtrise, et être en mesure de démontrer, à tout moment, ce qui a été fait et décidé.

**Modèle mental.** Une dérogation administrative : accordée par une autorité compétente, motivée, limitée dans le temps et dans l'étendue, assortie de conditions, et conservée au dossier.

**Où l'analogie s'arrête.** Une dérogation papier est classée. Dans une plateforme, l'exception est un objet vivant : elle expire, déclenche des alertes, est comptée dans les indicateurs, et peut être contrôlée automatiquement.

**Exemple.** Dans l'aviation, la liste minimale d'équipements (MEL) permet, sous conditions et pour une durée limitée, d'exploiter un aéronef avec certains équipements inopérants. La plateforme représente de telles dérogations comme des exceptions de première classe.

**Les composants.**

1. un **objet exception** (règle visée, périmètre, justification, risque, approbateur, expiration, mesures compensatoires) ;
2. un **cycle de vie** (demande, approbation, activité, expiration, clôture) ;
3. un **dispositif de preuves** (collecte, intégrité, conservation, restitution).

**Objectif d'apprentissage :** vous pouvez décrire une exception comme un objet à durée limitée, et lister les éléments d'un dossier de preuve.

### 2. Connaissances essentielles

#### Définition

- **Exception** : dérogation explicite, approuvée, motivée et temporaire à une règle, une politique ou un contrôle, assortie de conditions et de mesures compensatoires.
- **Preuve** : élément enregistré, daté, attribuable et protégé contre l'altération, qui démontre l'application d'un contrôle ou la régularité d'une décision.

#### Idées fondamentales

1. **Une exception est un objet, pas une contournement.** Elle est déclarée, approuvée et tracée.
2. **Elle est limitée.** Dans le temps, dans le périmètre, dans les conditions.
3. **Elle a un propriétaire.** Quelqu'un est responsable de son suivi et de sa clôture.
4. **Elle s'accompagne de mesures compensatoires.** Un risque accepté est atténué par d'autres moyens.
5. **La preuve est produite par construction.** Les contrôles génèrent leurs preuves au fil de l'eau.
6. **La preuve est protégée.** Horodatage, intégrité, conservation, restitution.

#### Vocabulaire essentiel

- **Mesure compensatoire** (*compensating control*) : contrôle additionnel qui réduit le risque d'une exception.
- **Acceptation du risque** (*risk acceptance*) : décision formelle de tolérer un risque résiduel.
- **Dossier de preuves** (*evidence package*) : ensemble d'éléments rassemblés pour un contrôle ou un audit.
- **Conformité continue** (*continuous compliance*) : collecte automatique et régulière des preuves.
- **Gel légal** (*legal hold*) : suspension de la suppression de données pour une procédure.
- **Intégrité** (*integrity*) : garantie qu'une preuve n'a pas été modifiée.
- **Échantillonnage** (*sampling*) : sélection d'exemples par l'auditeur.

#### Relations de cause à effet

- Les exceptions n'ont pas de date de fin. Elles deviennent la règle réelle, et la règle officielle n'est plus appliquée.
- Les preuves sont reconstituées au moment de l'audit. Elles sont incomplètes, coûteuses à produire et peu fiables.
- Les exceptions sont accordées sans mesures compensatoires. Le risque est accepté sans être réduit.

#### Idées reçues

- **« Une exception est un échec du contrôle. »** C'est un mécanisme du contrôle : mieux vaut une dérogation encadrée qu'un contournement caché.
- **« La preuve, c'est un document à joindre. »** C'est un ensemble d'éléments de nature variée (journaux, approbations, résultats de tests, versions de configuration), souvent produits automatiquement.
- **« Les preuves se préparent avant l'audit. »** Elles doivent exister en continu ; sinon on ne prouve que ce que l'on a reconstitué.

#### Principe clé

Toute dérogation est un objet approuvé, limité et revu ; toute décision importante laisse en continu des preuves que l'on peut restituer.

#### Si vous ne retenez que trois choses

1. Une exception est une dérogation formelle, avec un propriétaire, une durée et des mesures compensatoires.
2. Les preuves sont produites par les contrôles eux-mêmes, de façon continue.
3. Une preuve est datée, attribuable, protégée et conservée selon sa finalité.

### 3. Explication technique détaillée

#### Une exception comme donnée

```json
{
  "id": "exc_0092",
  "rule": { "key": "no_flight_with_overdue_inspection", "version": 4 },
  "scope": { "aircraft": "ac_8f3a", "flights_max": 3 },
  "justification": "Pièce en transit ; inspection reportée de 5 jours, risque évalué faible",
  "risk": { "level": "medium", "assessment_ref": "ra_551" },
  "compensating_controls": [
    "Inspection visuelle avant chaque vol",
    "Vols limités à la base principale"
  ],
  "requested_by": "u_planner_03",
  "approvals": [
    { "by": "u_qm_01", "at": "2026-10-12T09:10:00Z" },
    { "by": "u_techdir_01", "at": "2026-10-12T09:42:00Z" }
  ],
  "starts_at": "2026-10-12T10:00:00Z",
  "expires_at": "2026-10-17T10:00:00Z",
  "status": "active"
}
```

**Comment la lire.** L'exception vise une règle précise (version 4) et un aéronef, pour trois vols au plus, avec des mesures compensatoires. Elle est approuvée par deux personnes et expire automatiquement.

#### Le cycle de vie

```text
Demandée ─► Évaluée (risque, mesures) ─► Approuvée ─► Active ─┬─► Expirée automatiquement
                                                              ├─► Clôturée (cause résolue)
                                                              └─► Renouvelée (nouvelle approbation)
```

**Les rappels automatiques.** Une tâche planifiée (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)) alerte le propriétaire avant l'expiration ; à l'échéance, l'exception est désactivée et la règle redevient pleinement applicable.

#### L'application par le moteur

La règle n'est pas désactivée : le moteur d'évaluation consulte les exceptions actives.

```text
Évaluer la règle R sur (aéronef A, vol V) :
   résultat = appliquer R
   si résultat = refus
      et il existe une exception active pour (R, A) dont le périmètre couvre V :
          → accorder, avec « autorisé par l'exception exc_0092 »
          → décrémenter le compteur de vols de l'exception
   enregistrer la décision et l'exception utilisée (voir l'entrée 9.5)
```

#### La preuve par construction

| Contrôle | Preuve produite automatiquement |
|---|---|
| Accès privilégié accordé | Demande, approbation, durée, journal des actions |
| Changement de règle | Demande de changement, revue, différence, version, résultat des tests |
| Revue d'accès trimestrielle | Campagne, décisions, retraits effectués |
| Sauvegarde et restauration | Journaux de sauvegarde, tests de restauration |
| Suppression d'un tenant | Journal d'effacement, certificat |
| Exception accordée | Objet exception, approbations, utilisation, clôture |

#### Un dossier de preuves

```text
Contrôle C-14 : « Les changements de règles réglementaires sont approuvés à deux »
Période : 1er juillet – 30 septembre 2026
  ├─ Extrait du journal d'audit : 14 changements, 14 approbations doubles
  ├─ Demandes de changement : chg_0388 … chg_0471 (liens)
  ├─ Versions de configuration concernées : liste
  ├─ Exceptions liées : 1 (exc_0092), approuvée, expirée, clôturée
  ├─ Résultat du contrôle automatique : 100 % conformes
  └─ Empreinte d'intégrité du dossier : sha256:9f2c…  (horodatée)
```

#### Les propriétés d'une bonne preuve

| Propriété | Signification |
|---|---|
| Datée | Horodatage fiable |
| Attribuable | Acteur et responsable identifiés |
| Complète | Couvre toute la période et tous les cas |
| Intègre | Détectable en cas d'altération |
| Restituable | Exportable dans un format exploitable |
| Conservée | Pendant la durée requise (et pas au-delà pour les données personnelles) |

#### Le gel légal

Lors d'une enquête ou d'un litige, la suppression normale (rétention, purge) est suspendue pour les données concernées. La plateforme doit pouvoir **geler** un périmètre, tracer le gel, et le lever sur décision.

**Contre-exemple.** Des « dérogations » accordées par message instantané entre un planificateur et un responsable, sans objet dans la plateforme. Six mois plus tard, personne ne sait lesquelles sont encore valables, ni avec quelles conditions.

**Limites.** La collecte de preuves a un coût, et un excès de preuves noie l'essentiel. On les relie à des contrôles identifiés, avec des niveaux de détail adaptés au risque, et on teste régulièrement qu'on sait les restituer.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.1 Journal d'audit, journal d'activité et historique des modifications](#91-journal-daudit-journal-dactivité-et-historique-des-modifications) et [9.2 Acteur, horodatage, avant et après, motif](#92-acteur-horodatage-avant-et-après-motif) | L'audit fournit les preuves de base |
| [9.5 Versionnement de la configuration, des workflows et des politiques](#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les décisions citent les versions et les exceptions utilisées |
| [9.7 Revue, demande de changement et approbation](#97-revue-demande-de-changement-et-approbation) | Les demandes et approbations sont des preuves |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Les revues d'accès produisent des preuves de moindre privilège |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les expirations d'exceptions reposent sur des tâches planifiées |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La validité dans le temps des exceptions relève de la modélisation temporelle |

### 5. Application pratique

**Situation initiale.** Un aéronef doit effectuer trois vols avant une inspection qui ne peut pas avoir lieu faute de pièce. La règle d'immobilisation l'interdit.

**Problème.** La compagnie veut exploiter l'aéronef de façon encadrée, et pouvoir le justifier devant l'autorité.

**Application du concept.** Une exception approuvée, limitée et assortie de mesures compensatoires.

**Déroulé.**

1. Le planificateur crée la demande d'exception avec la justification et l'évaluation du risque.
2. Le responsable qualité et le directeur technique l'approuvent.
3. L'exception est active pour trois vols et cinq jours ; le moteur l'applique, et chaque vol décrémente le compteur.
4. À la fin du troisième vol, ou après cinq jours, l'exception expire automatiquement.
5. Le dossier (demande, approbations, vols concernés, inspections visuelles) est conservé et exportable.

**Résultat.** L'exploitation est possible, encadrée, et entièrement justifiable.

**Limites.** Si les inspections visuelles compensatoires ne sont pas enregistrées dans la plateforme, la preuve est incomplète : elles doivent être des tâches obligatoires liées à l'exception.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles informations compose une exception ?
2. **Compréhension.** Qu'est-ce qu'une mesure compensatoire ?
3. **Compréhension.** Pourquoi produit-on les preuves « par construction » ?
4. **Pourquoi.** Pourquoi une exception doit-elle expirer ?
5. **Raisonnement pratique.** Que doit contenir un dossier de preuves pour un contrôle d'approbation à deux ?

#### Réponses

1. La règle visée, le périmètre, la justification, l'évaluation du risque, les mesures compensatoires, les approbations, la durée et le statut.
2. Un contrôle supplémentaire qui réduit le risque pris en acceptant l'exception.
3. Pour qu'elles existent en continu, complètes et fiables, au lieu d'être reconstituées au moment de l'audit.
4. Pour qu'une dérogation ne devienne pas la règle de fait : l'expiration force à la renouveler explicitement ou à rétablir la règle.
5. L'extrait du journal d'audit, les demandes de changement et leurs approbations, les versions concernées, le résultat du contrôle automatique et une empreinte d'intégrité.
