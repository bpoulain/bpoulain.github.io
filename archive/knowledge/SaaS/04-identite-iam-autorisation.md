# Module 4 — Identité, IAM et autorisation

> **Question directrice.** Qui peut faire quoi, sur quelle ressource, dans quel contexte ?

## Présentation du module

**Objectif.** Aller bien au-delà du simple écran de connexion. Ce module explique comment une plateforme identifie ses utilisateurs et ses programmes, comment elle vérifie leur identité, et surtout comment elle décide, à chaque opération, ce qu'ils ont le droit de faire.

**Prérequis.** Les notions de ressource et d'opération des modules 2 et 3, et la notion de tenant du module 1.

**Ordre retenu.** Le module suit les trois blocs du plan : identité, authentification, autorisation. Il ajoute une entrée de départ qui pose le vocabulaire, et il place les sessions et les jetons avant l'authentification unique, car OAuth, OIDC et SAML manipulent des jetons.

```text
Vocabulaire     IAM ─ authentification et autorisation
Identité        utilisateur, groupe, équipe ─ identités non humaines
Authentification  mot de passe ─ MFA ─ session et jeton ─ clé d'API
                  SSO ─ OAuth 2.0 ─ OIDC ─ SAML ─ SCIM
Autorisation    permission, rôle, politique ─ RBAC ─ ACL ─ ABAC ─ ReBAC ─ PBAC
                niveau ressource, champ, ligne ─ héritage ─ délégation ─ moindre privilège
```

## Sommaire du module

- [4.1 IAM, authentification et autorisation](#41-iam-authentification-et-autorisation)
- [4.2 Utilisateur, groupe, équipe et organisation](#42-utilisateur-groupe-équipe-et-organisation)
- [4.3 Identités non humaines](#43-identités-non-humaines)
- [4.4 Mot de passe](#44-mot-de-passe)
- [4.5 Authentification multifacteur](#45-authentification-multifacteur)
- [4.6 Session et jeton](#46-session-et-jeton)
- [4.7 Clé d'API](#47-clé-dapi)
- [4.8 Authentification unique](#48-authentification-unique)
- [4.9 OAuth 2.0](#49-oauth-20)
- [4.10 OpenID Connect](#410-openid-connect)
- [4.11 SAML](#411-saml)
- [4.12 SCIM](#412-scim)
- [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée)
- [4.14 RBAC](#414-rbac)
- [4.15 ACL](#415-acl)
- [4.16 ABAC](#416-abac)
- [4.17 ReBAC](#417-rebac)
- [4.18 PBAC](#418-pbac)
- [4.19 Permissions au niveau ressource, champ et ligne](#419-permissions-au-niveau-ressource-champ-et-ligne)
- [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles)
- [4.21 Délégation](#421-délégation)
- [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches)

## 4.1 IAM, authentification et autorisation

### 1. Comprendre simplement

L'**IAM** (*Identity and Access Management*, gestion des identités et des accès) est l'ensemble des méthodes et des systèmes qui répondent à deux questions : **qui es-tu ?** et **que as-tu le droit de faire ?** La première est l'**authentification** (*authentication*). La seconde est l'**autorisation** (*authorization*).

**Pourquoi cela existe.** Une plateforme partagée par de nombreux clients et utilisateurs ne peut pas laisser n'importe qui faire n'importe quoi. Elle doit reconnaître chaque appelant de façon fiable, puis décider de ce qui lui est permis.

**Problème résolu.** Protéger les données et les actions de la plateforme, tout en laissant chacun faire ce qui relève de son rôle.

**Modèle mental.** Un aéroport. Au contrôle d'identité, on vérifie votre passeport : c'est l'authentification. Votre carte d'embarquement détermine ensuite par quelle porte vous passez et quel avion vous prenez : c'est l'autorisation.

**Où l'analogie s'arrête.** Un passager est contrôlé deux ou trois fois. Dans une plateforme, l'autorisation est évaluée à **chaque** opération, souvent des milliers de fois par session.

**Exemple.** Un technicien se connecte avec son mot de passe et un second facteur (authentification). Il demande ensuite de modifier le statut d'un aéronef. La plateforme vérifie qu'il a le droit de modifier les aéronefs de sa base (autorisation).

**Les quatre questions.**

1. **Qui ?** Le sujet, aussi appelé *principal*.
2. **Quoi ?** L'action demandée.
3. **Sur quoi ?** La ressource visée.
4. **Dans quel contexte ?** L'heure, le lieu, l'état de la ressource, le risque.

**Objectif d'apprentissage :** vous pouvez distinguer authentification et autorisation, et formuler une décision d'accès comme une réponse à quatre questions.

### 2. Connaissances essentielles

#### Définition

- **IAM** : discipline et ensemble de systèmes qui gèrent les identités numériques et contrôlent leur accès aux ressources.
- **Authentification** : processus qui vérifie qu'un sujet est bien celui qu'il prétend être.
- **Autorisation** : processus qui décide si un sujet authentifié peut effectuer une action sur une ressource.

#### Idées fondamentales

1. **Authentification et autorisation sont deux étapes distinctes.** On ne peut pas autoriser sans savoir qui agit.
2. **Une décision d'accès a quatre entrées.** Sujet, action, ressource, contexte.
3. **Le refus est le défaut.** Ce qui n'est pas explicitement permis est interdit.
4. **L'autorisation est vérifiée côté serveur, à chaque opération.** L'interface n'est qu'un confort.
5. **Les décisions sont traçables.** On doit pouvoir dire pourquoi un accès a été accordé ou refusé.
6. **Le sujet n'est pas toujours une personne.** Programmes et machines ont aussi des identités.

#### Vocabulaire essentiel

- **Sujet** ou **principal** (*subject*, *principal*) : l'entité qui agit (personne, programme).
- **Identifiant de connexion** (*credential*) : preuve présentée pour s'authentifier (mot de passe, clé, certificat).
- **Permission** : droit d'effectuer une action sur un type de ressource.
- **Politique** (*policy*) : règle qui décide d'une autorisation.
- **Point d'application** (*policy enforcement point*, *PEP*) : endroit où la décision est appliquée.
- **Point de décision** (*policy decision point*, *PDP*) : composant qui évalue la politique.
- **Contrôle d'accès défaillant** (*broken access control*) : catégorie de failles où les contrôles d'accès sont absents ou contournables.

#### Relations de cause à effet

- L'authentification est faible. Un attaquant se fait passer pour un utilisateur, et toutes les autorisations de celui-ci lui sont acquises.
- L'autorisation n'est vérifiée que dans l'interface. Un appel direct à l'API contourne le contrôle.
- Les droits ne sont jamais retirés. Les personnes qui changent de poste accumulent des accès dont elles n'ont plus besoin.

#### Idées reçues

- **« Si l'utilisateur est connecté, il peut faire ce qu'il veut. »** Non. Être connecté prouve une identité, pas un droit.
- **« `401 Unauthorized` signifie non autorisé. »** Le nom est trompeur. En HTTP, `401` signifie *non authentifié* ; `403` signifie *authentifié mais interdit*.
- **« La sécurité des accès est un problème de connexion. »** Non. Le contrôle d'accès défaillant est la première catégorie de failles du classement OWASP Top 10 de 2021 : la plupart des fuites viennent d'autorisations oubliées ou contournables.

#### Principe clé

L'authentification établit qui agit ; l'autorisation décide ce qui lui est permis, à chaque opération, côté serveur.

#### Si vous ne retenez que trois choses

1. Authentifier, c'est vérifier une identité ; autoriser, c'est décider d'un droit.
2. Une décision d'accès combine un sujet, une action, une ressource et un contexte.
3. Le refus est la valeur par défaut, et la décision est prise côté serveur.

### 3. Explication technique détaillée

#### Le cheminement d'une requête

```text
Requête
   │
   ▼
1. Authentification   ─► qui est le sujet ? (jeton, session, clé)
   │   échec → 401
   ▼
2. Contexte           ─► tenant, rôles, attributs, heure, risque
   │
   ▼
3. Autorisation       ─► autoriser(sujet, action, ressource, contexte) ?
   │   refus → 403 (ou 404)
   ▼
4. Exécution          ─► l'opération a lieu
   │
   ▼
5. Audit              ─► qui a fait quoi, avec quelle décision
```

#### Les composants d'une architecture d'autorisation

| Composant | Rôle | Analogie |
|---|---|---|
| Point d'application (PEP) | Intercepte la demande et applique la décision | Le portillon |
| Point de décision (PDP) | Évalue les politiques | Le contrôleur |
| Source des politiques | Stocke les politiques et les rôles | Le règlement |
| Source des attributs | Fournit les informations sur sujet et ressource | Le registre |

Cette décomposition est reprise des architectures de contrôle d'accès normalisées (XACML, NIST). Elle permet de **séparer** le code métier (qui appelle) de la logique de décision (qui peut changer).

#### Une décision comme fonction

```text
decision = autoriser(
  sujet     = { id: "u_42", rôles: ["planner"], base: "LYS" },
  action    = "update",
  ressource = { type: "aircraft", id: "ac_8f3a", base: "LYS", status: "active" },
  contexte  = { heure: "14:05", ip: "10.1.2.3" }
)
→ allow | deny   (+ raison)
```

**Pourquoi cette forme.** Quel que soit le modèle de contrôle d'accès choisi (rôles, attributs, relations), la plateforme appelle la même fonction. Le modèle peut évoluer sans changer les appelants.

#### Authentification et autorisation dans une plateforme multi-tenant

- L'authentification établit aussi l'**appartenance à un tenant** (voir [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy)).
- L'autorisation s'applique **dans** ce tenant : un rôle n'a de sens que dans son périmètre.
- Une autorisation de plateforme (opérateur du fournisseur) est une catégorie à part, plus encadrée (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).

**Contre-exemple.** Un point d'accès qui vérifie que l'appelant est connecté, mais pas son droit sur la ressource demandée : tout utilisateur connecté peut lire n'importe quel aéronef en devinant l'identifiant. C'est une faille classique de contrôle d'accès.

**Limites.** Un modèle d'autorisation parfait n'existe pas : plus il est expressif, plus il est difficile à auditer. Les entrées suivantes comparent les modèles (RBAC, ABAC, ReBAC, PBAC).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.2 Utilisateur, groupe, équipe et organisation](#42-utilisateur-groupe-équipe-et-organisation) | Les sujets humains sont des utilisateurs, groupes et équipes |
| [4.3 Identités non humaines](#43-identités-non-humaines) | Les programmes et machines sont d'autres sujets |
| [4.4 Mot de passe](#44-mot-de-passe) à [4.12 SCIM](#412-scim) | Détaillent les façons d'authentifier |
| [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée) à [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches) | Détaillent les façons d'autoriser |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les droits d'usage du tenant complètent les permissions de l'utilisateur |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Les décisions et les actions sont tracées dans l'audit |

### 5. Application pratique

**Situation initiale.** Un planificateur, un technicien et un auditeur externe utilisent la plateforme.

**Problème.** Ils doivent voir les mêmes aéronefs, mais n'ont pas les mêmes droits : le planificateur modifie, le technicien consulte et ajoute des constats, l'auditeur lit seulement.

**Application du concept.** Chacun s'authentifie ; chaque requête passe par la fonction d'autorisation avec son rôle.

**Déroulé.**

1. Le technicien envoie `PATCH /aircraft/ac_8f3a` avec son jeton.
2. L'authentification établit son identité et son tenant.
3. La fonction d'autorisation reçoit (technicien, `update`, aéronef, contexte).
4. La politique ne l'autorise que pour les constats : la modification du statut est refusée.
5. Le refus est tracé avec la raison.

**Résultat.** Trois profils utilisent les mêmes données avec des droits différents.

**Limites.** Un refus doit être expliqué à l'utilisateur sans révéler d'informations sensibles (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre authentification et autorisation ?
2. **Compréhension.** Quelles sont les quatre entrées d'une décision d'accès ?
3. **Compréhension.** Que signifie `403` par rapport à `401` ?
4. **Pourquoi.** Pourquoi l'autorisation doit-elle être vérifiée côté serveur à chaque opération ?
5. **Raisonnement pratique.** Un point d'accès `GET /aircraft/{id}` vérifie seulement que l'appelant est connecté. Quelle faille cela crée-t-il ?

#### Réponses

1. L'authentification vérifie l'identité du sujet ; l'autorisation décide de ce qu'il a le droit de faire.
2. Le sujet, l'action, la ressource et le contexte.
3. `401` signifie que l'appelant n'est pas authentifié ; `403` signifie qu'il est authentifié mais n'a pas le droit.
4. Parce que l'interface peut être contournée par un appel direct, et que les droits peuvent changer d'une opération à l'autre.
5. Tout utilisateur connecté, de n'importe quel tenant ou rôle, peut lire n'importe quel aéronef dont il connaît ou devine l'identifiant : c'est un contrôle d'accès défaillant.

## 4.2 Utilisateur, groupe, équipe et organisation

### 1. Comprendre simplement

Un **utilisateur** (*user*) est l'identité d'une personne dans la plateforme. Un **groupe** (*group*) rassemble des utilisateurs pour leur attribuer des droits d'un seul coup. Une **équipe** (*team*) rassemble des personnes qui travaillent ensemble. Une **organisation** (*organization*) est la structure à laquelle elles appartiennent.

**Pourquoi cela existe.** Attribuer des droits utilisateur par utilisateur est impraticable. Les regrouper permet de gérer des droits à l'échelle, et de refléter la structure réelle de l'entreprise.

**Problème résolu.** Représenter les personnes et leurs regroupements, de façon à administrer les accès sans gérer chaque individu.

**Modèle mental.** Un annuaire d'entreprise : des personnes, des services, des projets. On affecte un droit à un service, et tous ses membres l'obtiennent.

**Où l'analogie s'arrête.** Dans un annuaire, une personne est rangée à un seul endroit. Dans une plateforme, une personne peut appartenir à plusieurs groupes et plusieurs organisations, avec des rôles différents.

**Exemple.** Mathilde est technicienne à Lyon et membre du groupe « Habilités moteurs ». Elle appartient à l'organisation « Compagnie aérienne régionale ». Tous les membres du groupe peuvent signer les constats de moteur.

**Les composants.**

1. l'**utilisateur** et ses attributs ;
2. des **groupes** et leurs membres ;
3. des **équipes** et des **organisations** ;
4. des **appartenances** (*memberships*).

**Objectif d'apprentissage :** vous pouvez distinguer groupe et équipe, et décrire pourquoi l'appartenance est une relation distincte de l'utilisateur.

### 2. Connaissances essentielles

#### Définition

- **Utilisateur** : représentation numérique d'une personne, identifiée de façon unique, avec des attributs et un état de cycle de vie.
- **Groupe** : ensemble nommé d'utilisateurs (et parfois de groupes) servant à attribuer des droits en bloc.
- **Équipe** : ensemble de personnes qui collaborent à une mission, avec souvent un espace de travail et un responsable.
- **Organisation** : structure qui regroupe des personnes, des équipes et des ressources (voir [1.3 Compte, organisation et espace de travail](01-architecture-saas.md#13-compte-organisation-et-espace-de-travail)).

#### Idées fondamentales

1. **Une personne, une identité.** Elle n'est pas dupliquée par organisation.
2. **L'appartenance est une relation.** Elle porte un rôle, un statut, une date.
3. **Le groupe sert au contrôle d'accès ; l'équipe sert à l'organisation du travail.** Les deux se recoupent souvent, mais n'ont pas la même finalité.
4. **Les groupes peuvent être imbriqués.** Un groupe contient d'autres groupes.
5. **Les groupes peuvent être dynamiques.** L'appartenance se calcule à partir d'attributs.
6. **Un utilisateur a un cycle de vie.** Invité, actif, suspendu, désactivé.

#### Vocabulaire essentiel

- **Attribut** (*attribute*) : information sur l'utilisateur (service, base, qualification).
- **Appartenance** (*membership*) : lien entre un utilisateur et un groupe, une équipe ou une organisation.
- **Groupe imbriqué** (*nested group*) : groupe contenu dans un autre.
- **Groupe dynamique** (*dynamic group*) : groupe dont les membres sont déterminés par une règle sur les attributs.
- **Invitation** (*invitation*) : étape où l'utilisateur est créé mais n'a pas encore accepté.
- **Identifiant externe** (*external ID*) : identifiant de la personne dans l'annuaire du client.

#### Relations de cause à effet

- Les droits sont donnés utilisateur par utilisateur. Un départ ou un changement de poste oblige à retrouver et retirer chaque droit à la main.
- L'adresse électronique sert d'identifiant. Une personne qui change d'adresse devient un nouvel utilisateur, et perd son historique.
- Un compte n'est jamais désactivé au départ. Une personne partie conserve un accès actif.

#### Idées reçues

- **« Un groupe est la même chose qu'une équipe. »** Pas toujours. Un groupe est une construction d'accès ; une équipe est une construction d'organisation.
- **« L'adresse électronique est un bon identifiant. »** Pas seule : elle change, se réattribue et n'est pas toujours unique. Un identifiant interne stable est préférable.
- **« Supprimer l'utilisateur est la bonne façon de gérer un départ. »** Souvent non : on le **désactive**, pour conserver l'historique et l'attribution des actions passées.

#### Principe clé

Les droits s'attachent à des groupes et à des rôles plutôt qu'à des personnes ; une personne conserve une seule identité, avec des appartenances qui changent.

#### Si vous ne retenez que trois choses

1. Une personne a une identité unique et de multiples appartenances.
2. Les groupes servent à attribuer des droits en bloc ; les équipes organisent le travail.
3. Un départ se traite par désactivation, pas par suppression.

### 3. Explication technique détaillée

#### Un modèle de données minimal

```text
USER ──< MEMBERSHIP >── ORGANIZATION
  │         (rôle, statut, depuis)
  │
  └──< GROUP_MEMBER >── GROUP ──< (groupe parent)
```

```sql
CREATE TABLE app_user (
  id          uuid PRIMARY KEY,
  external_id text,                 -- identifiant dans l'annuaire du client
  email       text NOT NULL,
  full_name   text NOT NULL,
  status      text NOT NULL,        -- invited, active, suspended, deactivated
  UNIQUE (email)
);

CREATE TABLE membership (
  tenant_id       uuid NOT NULL,
  organization_id uuid NOT NULL,
  user_id         uuid NOT NULL REFERENCES app_user (id),
  role            text NOT NULL,
  status          text NOT NULL,
  PRIMARY KEY (tenant_id, organization_id, user_id)
);
```

**Pourquoi séparer.** L'identité (`app_user`) est unique. Les appartenances (`membership`) portent le contexte : dans quel tenant, quelle organisation, quel rôle.

#### Groupes statiques et dynamiques

| Type | Appartenance | Exemple | Précaution |
|---|---|---|---|
| Statique | Liste choisie par un administrateur | « Habilités moteurs » | Suivi manuel des départs |
| Dynamique | Règle sur des attributs | `base = LYS ET fonction = technicien` | Qualité des attributs |
| Synchronisé | Reflet d'un annuaire externe | Groupes de l'annuaire du client | Délai et conflits de synchronisation |

#### Cycle de vie d'un utilisateur

```text
invité ──► actif ──► suspendu ──► désactivé
              ▲          │
              └──────────┘ (réactivation)
```

**Désactiver plutôt que supprimer.** L'historique (audit, attribution) doit rester interprétable. Une suppression réelle ne se fait qu'à la demande de la personne (effacement) et fait l'objet d'une anonymisation des traces.

#### Les attributs

Les attributs d'un utilisateur alimentent les politiques par attributs (voir [4.16 ABAC](#416-abac)) : base d'affectation, qualifications, niveau d'habilitation. Leur **source de vérité** doit être claire : l'annuaire du client, la plateforme, ou un système de ressources humaines.

**Contre-exemple.** Modéliser un consultant externe qui travaille pour deux clients comme deux utilisateurs distincts, avec deux comptes et deux mots de passe. L'identité est dupliquée, l'historique est fragmenté, et la désactivation doit être faite deux fois.

**Limites.** Un groupe de très grande taille, ou profondément imbriqué, rend le calcul des droits effectifs coûteux. Il faut des limites de profondeur et un cache des appartenances (voir [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.3 Compte, organisation et espace de travail](01-architecture-saas.md#13-compte-organisation-et-espace-de-travail) | Compte, organisation et espace de travail précisent le vocabulaire commercial |
| [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise) | La hiérarchie d'entreprise place l'organisation, l'unité et l'équipe |
| [4.12 SCIM](#412-scim) | SCIM synchronise utilisateurs et groupes depuis l'annuaire du client |
| [4.14 RBAC](#414-rbac) | Les rôles sont attribués à des utilisateurs ou à des groupes |
| [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès) | L'administration gère ces objets |

### 5. Application pratique

**Situation initiale.** Un technicien est muté de la base de Lyon à celle de Toulouse. Il avait accès aux aéronefs de Lyon et au groupe « Habilités moteurs ».

**Problème.** Il doit perdre l'accès à Lyon, conserver son habilitation, et gagner l'accès à Toulouse, sans perdre son historique.

**Application du concept.** Son identité reste la même. Son appartenance et son attribut de base changent.

**Déroulé.**

1. L'administrateur met à jour l'attribut `base` de LYS à TLS.
2. Le groupe dynamique « Techniciens de Lyon » le perd, « Techniciens de Toulouse » le gagne.
3. Le groupe statique « Habilités moteurs » est inchangé.
4. L'historique de ses actions reste rattaché à la même identité.

**Résultat.** Ses droits suivent son rôle et son affectation, sans création de nouveau compte.

**Limites.** Si l'attribut `base` n'est pas mis à jour, il garde ses accès de Lyon. La qualité des attributs est une responsabilité à part entière.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un groupe et une équipe ?
2. **Compréhension.** Qu'est-ce qu'un groupe dynamique ?
3. **Compréhension.** Pourquoi désactive-t-on un utilisateur plutôt que de le supprimer ?
4. **Pourquoi.** Pourquoi l'appartenance est-elle une relation distincte de l'utilisateur ?
5. **Raisonnement pratique.** Un consultant travaille pour deux clients de la plateforme. Comment le modéliser ?

#### Réponses

1. Un groupe sert à attribuer des droits en bloc ; une équipe regroupe des personnes qui collaborent. Les deux peuvent coïncider, mais leurs finalités diffèrent.
2. Un groupe dont les membres sont déterminés par une règle sur leurs attributs, et non par une liste choisie.
3. Pour conserver l'historique et l'attribution des actions passées, qui restent interprétables.
4. Parce qu'une personne peut appartenir à plusieurs organisations, avec un rôle et un statut propres à chacune, sans dupliquer son identité.
5. Une seule identité, avec deux appartenances, une par client, chacune avec ses rôles et son statut.

## 4.3 Identités non humaines

### 1. Comprendre simplement

Toutes les entités qui agissent sur une plateforme ne sont pas des personnes. Un programme qui importe des données chaque nuit, une application mobile, un capteur sur un véhicule au sol : chacun a besoin d'une identité. On parle de **compte de service** (*service account*), d'**identité de machine** (*machine identity*) et d'**identité d'application** (*application identity*).

**Pourquoi cela existe.** Un programme ne peut pas utiliser le mot de passe d'une personne : il le diffuserait, et ses actions seraient attribuées à cette personne. Il lui faut sa propre identité, avec des droits limités et des actions traçables.

**Problème résolu.** Permettre aux programmes d'agir sur la plateforme de façon sûre, attribuable et révocable.

**Modèle mental.** Un badge de livreur. Il n'appartient à aucun employé ; il donne accès à un quai précis, pour une fonction précise, et il peut être désactivé sans toucher aux employés.

**Où l'analogie s'arrête.** Un livreur est une personne identifiable, responsable de son badge. Un programme ne peut pas répondre de lui-même : il faut un propriétaire humain ou une équipe qui en est responsable.

**Exemple.** Le traitement nocturne d'import utilise un compte de service qui ne peut écrire que des aéronefs. Un équipement embarqué s'authentifie avec un certificat propre.

**Les trois notions.**

1. **Compte de service** : identité d'un traitement ou d'une intégration, avec des droits dans la plateforme.
2. **Identité de machine** : identité d'une machine ou d'une charge de travail (serveur, conteneur, appareil).
3. **Identité d'application** : identité d'une application cliente, par exemple un client OAuth (voir [4.9 OAuth 2.0](#49-oauth-20)).

**Objectif d'apprentissage :** vous pouvez dire pourquoi un programme ne doit pas utiliser le compte d'une personne, et citer trois précautions sur les identités non humaines.

### 2. Connaissances essentielles

#### Définition

- **Compte de service** : identité non interactive associée à un programme, une intégration ou un traitement automatique, à laquelle on attribue des droits.
- **Identité de machine** : identité cryptographique d'une machine ou d'une charge de travail, souvent un certificat ou un jeton à courte durée.
- **Identité d'application** : identité d'une application cliente enregistrée auprès d'un serveur d'autorisation, qui peut agir seule ou au nom d'un utilisateur.

#### Idées fondamentales

1. **Chaque programme a sa propre identité.** Jamais celle d'une personne.
2. **Les droits sont minimaux.** Un import n'a pas besoin de supprimer des comptes.
3. **Un propriétaire est désigné.** Une personne ou une équipe en est responsable.
4. **Les secrets sont protégés et renouvelés.** Les identifiants durables sont un risque.
5. **L'authentification n'est pas interactive.** Pas de saisie humaine, donc pas de second facteur classique.
6. **Les actions sont attribuables.** Le journal distingue les actions de personnes et de programmes.

#### Vocabulaire essentiel

- **Identité non humaine** (*non-human identity*, *NHI*) : identité d'un programme ou d'une machine.
- **Identifiants clients** (*client credentials*) : couple identifiant et secret d'une application.
- **Certificat** (*certificate*) : document cryptographique qui prouve une identité.
- **mTLS** (*mutual TLS*) : TLS où le client et le serveur s'authentifient mutuellement par certificat.
- **Jeton à courte durée** (*short-lived token*) : jeton qui expire rapidement, ce qui limite l'impact d'un vol.
- **Rotation** (*rotation*) : remplacement régulier d'un secret.

#### Relations de cause à effet

- Un programme utilise le mot de passe d'une personne. Quand cette personne part, le programme cesse de fonctionner ; et ses actions lui sont attribuées à tort.
- Un compte de service reçoit des droits larges « pour que ça marche ». Une fuite de son secret expose toute la plateforme.
- Aucun propriétaire n'est désigné. Le compte survit à son usage et devient une porte dérobée oubliée.

#### Idées reçues

- **« Un compte de service est moins important qu'un compte humain. »** Au contraire : il a souvent des droits étendus, ne fait pas l'objet d'un second facteur et passe inaperçu.
- **« Un secret dans le code source est acceptable s'il est privé. »** Non. Le dépôt est copié, partagé, ou ouvert un jour par erreur. Les secrets se stockent dans un coffre.
- **« Une machine est identifiée par son adresse réseau. »** Non. L'adresse change et peut être usurpée. Une identité cryptographique est plus solide.

#### Principe clé

Chaque programme agit sous une identité propre, aux droits minimaux, avec un propriétaire, des secrets renouvelables et des actions traçables.

#### Si vous ne retenez que trois choses

1. Un programme a sa propre identité et jamais celle d'une personne.
2. Ses droits sont minimaux, et il a un propriétaire responsable.
3. Ses secrets sont de courte durée ou renouvelés, et stockés dans un coffre.

### 3. Explication technique détaillée

#### Les trois familles côte à côte

| Famille | Qui est identifié | Exemple | Preuve d'identité typique |
|---|---|---|---|
| Compte de service | Un traitement, une intégration | Import nocturne | Clé d'API, jeton, secret client |
| Identité de machine | Un serveur, un conteneur, un appareil | Capteur d'un véhicule | Certificat, identité de charge de travail |
| Identité d'application | Une application cliente | Application mobile des techniciens | Identifiant client, secret ou PKCE |

#### Les modes d'authentification courants

| Mode | Principe | Durée | Remarque |
|---|---|---|---|
| Clé d'API | Secret long, envoyé en en-tête | Longue | Simple ; à renouveler (voir [4.7 Clé d'API](#47-clé-dapi)) |
| Identifiants client OAuth | Secret échangé contre un jeton | Jeton court | Standard pour les services (voir [4.9 OAuth 2.0](#49-oauth-20)) |
| Certificat et mTLS | Preuve cryptographique mutuelle | Selon le certificat | Fort ; gestion de certificats à prévoir |
| Identité de charge de travail | La plateforme d'exécution atteste l'identité | Très courte | Évite de stocker un secret |

#### Cycle de vie d'une identité non humaine

1. **Création** avec un propriétaire, un but et un périmètre.
2. **Attribution** des droits strictement nécessaires.
3. **Émission** des secrets, stockés dans un coffre (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).
4. **Rotation** régulière et possibilité de révocation immédiate.
5. **Revue** périodique : est-il encore utilisé ? Les droits sont-ils justifiés ?
6. **Retrait** quand l'usage cesse.

**Mode de défaillance.** Les comptes de service orphelins : le propriétaire a quitté l'entreprise, plus personne ne sait à quoi sert le compte, personne n'ose le supprimer, et il garde ses droits indéfiniment.

#### Distinguer qui agit

Le journal d'audit doit enregistrer le **type** de l'acteur (personne, service) et, quand un programme agit au nom d'une personne, les **deux** identités (voir [4.21 Délégation](#421-délégation)).

```json
{
  "actor": { "type": "service", "id": "svc_nightly_import" },
  "on_behalf_of": null,
  "action": "create",
  "resource": "aircraft/ac_8f3a"
}
```

**Contre-exemple.** Un script de synchronisation configuré avec le compte administrateur du directeur technique. Les modifications apparaissent dans le journal sous son nom. Quand il change de poste, la synchronisation cesse, et personne ne comprend pourquoi.

**Limites.** Les identités de machine à courte durée demandent une infrastructure d'émission fiable ; si elle tombe, les services ne peuvent plus s'authentifier. Il faut prévoir des délais de grâce et de la supervision.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.2 Utilisateur, groupe, équipe et organisation](#42-utilisateur-groupe-équipe-et-organisation) | Les identités non humaines complètent les utilisateurs humains |
| [4.7 Clé d'API](#47-clé-dapi) | Les clés d'API sont un mode d'authentification courant |
| [4.9 OAuth 2.0](#49-oauth-20) | Les identifiants client d'OAuth authentifient les applications |
| [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches) | Le moindre privilège s'applique avec une rigueur particulière aux services |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | La gestion des secrets protège leurs identifiants |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration technique gère ces identités |

### 5. Application pratique

**Situation initiale.** Un import nocturne synchronise les aéronefs depuis le système de la compagnie. Il s'exécute avec le compte d'un technicien senior.

**Problème.** Le technicien part. L'import s'arrête, et le journal attribue des milliers de modifications à une personne qui n'est pas à l'origine.

**Application du concept.** On crée un compte de service dédié, avec des droits limités et un propriétaire.

**Déroulé.**

1. L'administrateur crée `svc_nightly_import`, désigne le responsable.
2. Il lui accorde le droit de créer et modifier des aéronefs, et rien d'autre.
3. Un secret est émis et stocké dans le coffre de l'intégration.
4. L'import utilise ce secret pour obtenir un jeton de courte durée.
5. Le journal indique désormais `service` comme type d'acteur.

**Résultat.** L'import est indépendant des personnes, ses actions sont attribuables, et ses droits sont limités.

**Limites.** Il faut encore renouveler le secret et vérifier périodiquement que le compte est utile.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un programme ne doit-il pas utiliser le compte d'une personne ?
2. **Compréhension.** Citez deux modes d'authentification d'une identité non humaine.
3. **Compréhension.** Qu'est-ce qu'un compte de service orphelin ?
4. **Pourquoi.** Pourquoi préfère-t-on des jetons à courte durée à des secrets durables ?
5. **Raisonnement pratique.** Un script d'intégration lit des aéronefs et n'en modifie jamais. Quels droits lui accorder ?

#### Réponses

1. Parce qu'il dépendrait de la présence de la personne, que ses actions lui seraient attribuées à tort, et qu'un partage de mot de passe est un risque.
2. Par exemple une clé d'API, les identifiants client OAuth, un certificat avec mTLS ou une identité de charge de travail.
3. Un compte dont le propriétaire est parti et dont plus personne ne connaît l'usage, mais qui garde ses droits.
4. Parce qu'un jeton volé n'est utile que pendant une courte durée, ce qui limite l'impact d'une fuite.
5. Uniquement le droit de lecture sur les aéronefs : le moindre privilège.

## 4.4 Mot de passe

### 1. Comprendre simplement

Le **mot de passe** (*password*) est un secret que seul l'utilisateur est censé connaître. Le système le compare à ce qu'il a enregistré pour décider s'il laisse entrer. C'est le moyen d'authentification le plus répandu, et l'un des plus fragiles.

**Pourquoi cela existe.** Il faut une façon simple de prouver son identité sans matériel particulier. Le mot de passe répond à ce besoin avec un coût d'adoption très faible.

**Problème résolu.** Permettre à un utilisateur de prouver qu'il est bien le titulaire d'un compte.

**Modèle mental.** Une clé de porte. Quiconque la possède entre, sans que la porte sache qui est la personne.

**Où l'analogie s'arrête.** Une clé physique ne se devine pas à distance, ne se réutilise pas dans mille serrures et ne se divulgue pas par une fuite de données. Un mot de passe, si.

**Exemple.** Un technicien choisit un mot de passe. La plateforme n'enregistre pas ce mot de passe : elle enregistre une empreinte calculée à partir de lui, et compare l'empreinte à chaque connexion.

**Les composants.**

1. le **secret** saisi par l'utilisateur ;
2. une **empreinte** calculée par une fonction de hachage lente ;
3. une **politique** de choix du mot de passe ;
4. des **protections** contre les essais répétés ;
5. un **parcours de réinitialisation**.

**Objectif d'apprentissage :** vous pouvez expliquer comment stocker un mot de passe, et citer deux attaques et leurs parades.

### 2. Connaissances essentielles

#### Définition

Un **mot de passe** est un secret de connaissance utilisé comme facteur d'authentification. Une plateforme n'en conserve que l'**empreinte** obtenue par une fonction de hachage conçue pour être lente et salée.

#### Idées fondamentales

1. **On ne stocke jamais le mot de passe.** On stocke une empreinte.
2. **Le hachage doit être lent et salé.** Lent pour ralentir les essais, salé pour que deux mots de passe identiques aient des empreintes différentes.
3. **La longueur prime sur la complexité.** Les recommandations actuelles privilégient la longueur et le contrôle contre les mots de passe connus.
4. **Les essais répétés sont limités.** Délai croissant, verrouillage, détection.
5. **Un mot de passe seul est insuffisant.** On le complète par un second facteur (voir [4.5 Authentification multifacteur](#45-authentification-multifacteur)).
6. **La réinitialisation est un point faible.** Elle est aussi sensible que la connexion.

#### Vocabulaire essentiel

- **Empreinte** (*hash*) : résultat d'une fonction à sens unique.
- **Sel** (*salt*) : valeur aléatoire propre à chaque mot de passe, ajoutée avant le hachage.
- **Poivre** (*pepper*) : secret commun ajouté, conservé hors de la base.
- **Argon2id, scrypt, bcrypt, PBKDF2** : fonctions de hachage de mots de passe, volontairement lentes.
- **Attaque par force brute** (*brute force*) : essai systématique de valeurs.
- **Bourrage d'identifiants** (*credential stuffing*) : essai de couples identifiant et mot de passe volés ailleurs.
- **Hameçonnage** (*phishing*) : tromperie pour obtenir le secret.

#### Relations de cause à effet

- Les mots de passe sont stockés en clair ou avec un hachage rapide. Une fuite de la base expose immédiatement les mots de passe, réutilisés sur d'autres services.
- Les utilisateurs réutilisent le même mot de passe. Une fuite sur un autre service permet d'entrer sur la plateforme par bourrage d'identifiants.
- Le parcours de réinitialisation confirme si une adresse existe. Un attaquant dresse la liste des comptes.

#### Idées reçues

- **« Un mot de passe complexe avec majuscule, chiffre et symbole est plus sûr. »** Pas nécessairement. Les règles de composition poussent à des choix prévisibles. Les lignes directrices du NIST (SP 800-63B) privilégient la longueur et la vérification contre des listes de mots de passe compromis.
- **« Il faut changer son mot de passe tous les 90 jours. »** Ces recommandations ont évolué : un changement forcé sans raison pousse à des variantes faibles. On impose le changement en cas de compromission avérée ou suspectée.
- **« Un hachage SHA-256 suffit. »** Non. Il est rapide, donc facile à attaquer massivement. Il faut une fonction lente dédiée aux mots de passe.

#### Principe clé

Stockez une empreinte lente et salée, jamais le mot de passe ; limitez les essais ; ne vous reposez jamais sur le mot de passe seul.

#### Si vous ne retenez que trois choses

1. On ne stocke que l'empreinte d'un mot de passe, calculée par une fonction lente et salée.
2. La longueur et la vérification contre les mots de passe connus valent mieux que les règles de composition.
3. Le mot de passe seul est insuffisant : un second facteur est la défense principale.

### 3. Explication technique détaillée

#### Le stockage

```text
Enregistrement : empreinte = Argon2id(mot_de_passe, sel_aléatoire, paramètres)
                 stocker : paramètres, sel, empreinte

Connexion      : recalculer l'empreinte avec le sel stocké
                 comparer à l'empreinte stockée (comparaison à temps constant)
```

**Pourquoi un sel.** Sans sel, deux utilisateurs ayant le même mot de passe ont la même empreinte, et des tables précalculées permettent de retrouver les mots de passe courants.

**Pourquoi un hachage lent.** Il rend chaque essai coûteux.

**Exemple chiffré.** Un mot de passe aléatoire de 8 caractères pris parmi 62 (lettres et chiffres) donne $62^8 \approx 2{,}2 \times 10^{14}$ possibilités. Un attaquant qui teste $10^{10}$ empreintes rapides par seconde les parcourt en environ 6 heures. Avec une fonction lente limitant à $10^{4}$ essais par seconde par machine, la même recherche prend environ 700 ans pour une machine. Les débits sont illustratifs.

#### Les attaques et leurs parades

| Attaque | Principe | Parades |
|---|---|---|
| Force brute en ligne | Essais répétés sur l'écran de connexion | Délais croissants, limitation de débit, détection |
| Force brute hors ligne | Casser les empreintes d'une base volée | Hachage lent et salé, longueur |
| Bourrage d'identifiants | Réutiliser des mots de passe volés ailleurs | Second facteur, vérification des mots de passe compromis |
| Hameçonnage | Faire saisir le mot de passe sur un faux site | Second facteur résistant à l'hameçonnage, formation |
| Devinette ciblée | Prénoms, dates, mots simples | Liste des mots de passe interdits |

#### Les recommandations actuelles

D'après les lignes directrices du NIST (SP 800-63B) :

- accepter des mots de passe longs (au moins 8 caractères, et permettre bien davantage) ;
- vérifier le mot de passe choisi contre des listes de mots de passe courants ou compromis ;
- ne pas imposer de règles de composition arbitraires ;
- ne pas imposer de changement périodique sans motif ;
- autoriser le collage et l'usage de gestionnaires de mots de passe.

#### La réinitialisation

1. L'utilisateur demande une réinitialisation avec son adresse.
2. La réponse est **identique** que l'adresse existe ou non.
3. Un lien à usage unique, de courte durée, est envoyé à l'adresse.
4. Le lien permet de définir un nouveau mot de passe, puis il est invalidé.
5. Les sessions existantes sont révoquées, et l'utilisateur est notifié.

**Contre-exemple.** Envoyer le mot de passe actuel ou un mot de passe temporaire par courriel. Le courriel est stocké, transféré et lisible par d'autres.

**Limites.** Le mot de passe reste vulnérable à l'hameçonnage et à la réutilisation. C'est pourquoi les plateformes s'orientent vers des méthodes sans mot de passe (clés d'accès, voir [4.5 Authentification multifacteur](#45-authentification-multifacteur)) ou vers l'authentification unique (voir [4.8 Authentification unique](#48-authentification-unique)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.5 Authentification multifacteur](#45-authentification-multifacteur) | Le second facteur complète le mot de passe |
| [4.6 Session et jeton](#46-session-et-jeton) | Après authentification, une session ou un jeton prend le relais |
| [4.8 Authentification unique](#48-authentification-unique) | L'authentification unique réduit le nombre de mots de passe à gérer |
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Le chiffrement et le hachage sont des primitives de sécurité distinctes |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit protège la connexion contre la force brute |

### 5. Application pratique

**Situation initiale.** Une fuite d'un site tiers publie des millions de couples identifiant et mot de passe. Certains techniciens utilisent le même mot de passe sur la plateforme.

**Problème.** Des tentatives de connexion automatisées réussissent sur quelques comptes.

**Application du concept.** La plateforme applique un ensemble de mesures en couches.

**Déroulé.**

1. Un limiteur détecte un nombre anormal d'échecs depuis les mêmes adresses et ralentit.
2. Les nouveaux mots de passe sont vérifiés contre une liste de mots de passe compromis.
3. Les comptes ciblés sont contraints à activer un second facteur.
4. Les sessions des comptes suspectés sont révoquées.

**Résultat.** Les tentatives échouent ou rencontrent un second facteur, et l'équipe de sécurité est alertée.

**Limites.** Un limiteur trop strict peut permettre de verrouiller volontairement le compte d'un tiers (déni de service ciblé) ; on préfère des délais croissants et des contrôles complémentaires.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que stocke-t-on à la place du mot de passe ?
2. **Compréhension.** À quoi sert le sel ?
3. **Compréhension.** Qu'est-ce que le bourrage d'identifiants ?
4. **Pourquoi.** Pourquoi utilise-t-on une fonction de hachage lente pour les mots de passe ?
5. **Raisonnement pratique.** Une demande de réinitialisation répond « adresse inconnue » lorsque l'adresse n'existe pas. Quel est le risque ?

#### Réponses

1. Une empreinte, calculée par une fonction de hachage lente et salée.
2. À rendre l'empreinte unique pour chaque mot de passe, même identique, et à empêcher l'usage de tables précalculées.
3. L'essai automatisé de couples identifiant et mot de passe volés sur d'autres services.
4. Pour que chaque essai coûte du temps : un attaquant qui possède une base volée ne peut pas tester des milliards de valeurs par seconde.
5. Un attaquant peut tester une liste d'adresses et savoir lesquelles ont un compte. La réponse doit être identique dans les deux cas.

## 4.5 Authentification multifacteur

### 1. Comprendre simplement

L'**authentification multifacteur** (*multi-factor authentication*, **MFA**) exige au moins **deux preuves d'identité de nature différente** : par exemple quelque chose que l'on sait (un mot de passe) et quelque chose que l'on possède (un téléphone, une clé physique).

**Pourquoi cela existe.** Un mot de passe peut être deviné, volé ou réutilisé. Un attaquant qui le possède entre sans résistance. Ajouter un second facteur d'une autre nature l'oblige à compromettre aussi cet élément.

**Problème résolu.** Réduire fortement le risque de prise de contrôle d'un compte lorsque le mot de passe est compromis.

**Modèle mental.** Un coffre qui exige une clé **et** un code. Un voleur qui a la clé ne peut pas ouvrir sans le code, et inversement.

**Où l'analogie s'arrête.** Les deux protections d'un coffre sont indépendantes. En ligne, un attaquant peut tromper l'utilisateur pour obtenir les deux à la fois (faux site qui relaie le code), sauf si le second facteur est conçu pour résister à cela.

**Exemple.** Le technicien saisit son mot de passe, puis valide la connexion avec une clé de sécurité qu'il branche sur son poste.

**Les trois familles de facteurs.**

1. **Connaissance** : ce que l'on sait (mot de passe, code PIN).
2. **Possession** : ce que l'on a (téléphone, clé de sécurité).
3. **Inhérence** : ce que l'on est (empreinte digitale, visage).

**Objectif d'apprentissage :** vous pouvez classer des méthodes d'authentification par famille de facteur, et dire pourquoi toutes les méthodes de second facteur ne se valent pas.

### 2. Connaissances essentielles

#### Définition

L'**authentification multifacteur** est une méthode d'authentification qui exige la présentation d'au moins deux facteurs appartenant à des familles différentes (connaissance, possession, inhérence).

#### Idées fondamentales

1. **Deux facteurs de familles différentes.** Deux mots de passe ne font pas du MFA.
2. **Tous les seconds facteurs ne sont pas équivalents.** Leur résistance à l'hameçonnage varie beaucoup.
3. **Les facteurs résistants à l'hameçonnage sont liés au site.** C'est le cas des clés d'accès (WebAuthn).
4. **La récupération est le maillon faible.** Un contournement facile par courriel annule la protection.
5. **L'exigence peut être graduée.** On la renforce pour les actions sensibles.
6. **Elle se configure par tenant.** Un administrateur peut l'imposer à ses utilisateurs.

#### Vocabulaire essentiel

- **Facteur** (*factor*) : une catégorie de preuve d'identité.
- **TOTP** (*time-based one-time password*) : code à usage unique calculé à partir de l'heure.
- **WebAuthn** : standard du W3C d'authentification par cryptographie à clé publique, avec FIDO2.
- **Clé d'accès** (*passkey*) : identifiant WebAuthn utilisable sans mot de passe, souvent synchronisé entre appareils.
- **Authentification renforcée** (*step-up authentication*) : demande d'un facteur supplémentaire pour une action sensible.
- **Fatigue de notification** (*MFA fatigue*) : attaque qui inonde l'utilisateur de demandes d'approbation jusqu'à ce qu'il accepte.
- **Codes de secours** (*recovery codes*) : codes à usage unique de récupération.

#### Relations de cause à effet

- Le second facteur est un code envoyé par SMS. L'attaquant qui détourne la ligne (échange de carte SIM) reçoit le code.
- La récupération du compte se fait par simple courriel. L'attaquant contourne le MFA en déclenchant la récupération.
- Le MFA est demandé à chaque action. Les utilisateurs cherchent des contournements, ou approuvent sans regarder.

#### Idées reçues

- **« Le MFA rend le compte inviolable. »** Non. Il élève fortement le coût d'une attaque, mais l'hameçonnage en temps réel, la fatigue de notification et la récupération faible subsistent.
- **« Le SMS est un bon second facteur. »** Il vaut mieux que rien, mais il est vulnérable à l'échange de carte SIM et à l'interception. Le NIST le classe parmi les méthodes à usage restreint.
- **« Le MFA ne concerne que les utilisateurs finaux. »** Non. Les comptes d'administration en ont le plus besoin.

#### Principe clé

Un second facteur n'a de valeur que s'il est d'une autre nature, difficile à relayer à distance, et si la récupération n'est pas plus faible que la connexion.

#### Si vous ne retenez que trois choses

1. Le MFA exige au moins deux preuves de familles différentes.
2. Les clés d'accès et clés de sécurité résistent à l'hameçonnage ; les SMS beaucoup moins.
3. Récupération et fatigue de notification sont les points d'attaque à traiter.

### 3. Explication technique détaillée

#### Les méthodes de second facteur

| Méthode | Famille | Résistance à l'hameçonnage | Remarque |
|---|---|---|---|
| Code par SMS | Possession | Faible | Échange de carte SIM, interception |
| Application TOTP | Possession | Faible à moyenne | Code saisi sur un faux site peut être relayé |
| Notification d'approbation | Possession | Faible | Fatigue de notification ; avec confirmation par numéro, moins exposée |
| Clé de sécurité (FIDO2) | Possession | Forte | Liée au site légitime |
| Clé d'accès (*passkey*) | Possession et inhérence | Forte | Synchronisée entre appareils selon le fournisseur |
| Biométrie locale | Inhérence | Dépend de l'usage | Déverrouille une clé locale, pas un secret transmis |

#### Le principe du TOTP

Le serveur et l'application partagent un secret $K$. À chaque instant, ils calculent le même code :

$$\text{code} = \text{Tronquer}\big(\text{HMAC}(K,\; T)\big) \bmod 10^{d}, \qquad T = \left\lfloor \frac{t - t_0}{X} \right\rfloor$$

où $t$ est l'heure courante, $t_0$ l'origine (généralement 0), $X$ la durée d'une période (30 secondes en pratique), et $d$ le nombre de chiffres (6 en général). Le mécanisme est décrit dans la RFC 6238, qui s'appuie sur la RFC 4226.

**Conséquence.** Le serveur tolère souvent un décalage d'une période pour absorber les écarts d'horloge. Le code reste valable quelques dizaines de secondes, ce qui laisse une fenêtre à un attaquant qui le relaie en temps réel.

#### Pourquoi WebAuthn résiste à l'hameçonnage

Avec WebAuthn, l'appareil génère une paire de clés par site. Le navigateur inclut le **nom de domaine** dans ce qui est signé. Un faux site ne peut pas obtenir une signature valable pour le vrai domaine : l'attaque par relais ne fonctionne pas.

```text
Site légitime  ─► défi ─► navigateur (inclut le domaine) ─► clé : signature valide
Faux site      ─► défi ─► navigateur (domaine différent) ─► signature inutilisable
```

#### Les politiques de plateforme

```json
{
  "tenant": "airline-regional",
  "mfa": {
    "required_for_roles": ["admin", "planner"],
    "allowed_methods": ["webauthn", "totp"],
    "remember_device_days": 14,
    "step_up_actions": ["change_permissions", "export_all", "create_api_key"]
  }
}
```

**Comment la lire.** Le MFA est imposé aux rôles à privilèges. Les méthodes faibles (SMS) sont exclues. Certaines actions sensibles exigent de ré-authentifier, même au sein d'une session ouverte.

#### La récupération

| Option | Niveau de risque |
|---|---|
| Codes de secours, conservés par l'utilisateur | Faible si bien gardés |
| Second appareil enregistré à l'avance | Faible |
| Récupération par administrateur du tenant, avec vérification | Moyen, selon la procédure |
| Récupération par courriel seul | Élevé : annule le MFA |

**Contre-exemple.** Un lien « j'ai perdu mon appareil » qui envoie un courriel de réinitialisation du second facteur. L'attaquant qui contrôle le courriel contourne tout le dispositif.

**Limites.** Un MFA trop contraignant pousse à la fatigue et aux contournements. La configuration doit trouver un équilibre entre protection et usage.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.4 Mot de passe](#44-mot-de-passe) | Le MFA complète un mot de passe |
| [4.8 Authentification unique](#48-authentification-unique) | Avec l'authentification unique, le MFA est exigé auprès du fournisseur d'identité |
| [4.6 Session et jeton](#46-session-et-jeton) | La session conserve le niveau d'authentification obtenu |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'interface doit expliquer pourquoi une ré-authentification est demandée |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust s'appuie sur une authentification forte et continue |

### 5. Application pratique

**Situation initiale.** Un compte d'administrateur du tenant d'une compagnie est compromis par hameçonnage. Le mot de passe était connu, et l'attaquant crée une clé d'API.

**Problème.** Un seul facteur a suffi à obtenir un pouvoir étendu.

**Application du concept.** La plateforme impose le MFA aux rôles administrateur et exige une authentification renforcée pour créer des clés d'API.

**Déroulé.**

1. L'administrateur active une clé de sécurité.
2. Le tenant impose le MFA aux administrateurs et exclut le SMS.
3. La création d'une clé d'API demande une nouvelle présentation de la clé de sécurité.
4. Un attaquant qui aurait le mot de passe ne peut plus créer de clé.

**Résultat.** Le pouvoir étendu n'est plus accessible par un seul secret volé.

**Limites.** Il faut une procédure de récupération solide pour le cas où l'administrateur perd sa clé.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les trois familles de facteurs ?
2. **Compréhension.** Pourquoi deux mots de passe ne constituent-ils pas du MFA ?
3. **Compréhension.** Pourquoi WebAuthn résiste-t-il à l'hameçonnage ?
4. **Pourquoi.** Pourquoi la récupération de compte est-elle le maillon faible du MFA ?
5. **Raisonnement pratique.** Quels contrôles ajouter pour des actions très sensibles dans une session déjà ouverte ?

#### Réponses

1. Connaissance, possession et inhérence.
2. Parce qu'ils appartiennent à la même famille : un attaquant qui obtient l'un peut obtenir l'autre par les mêmes moyens.
3. Parce que la signature est liée au nom de domaine du site : un faux site ne peut pas obtenir une signature valable pour le vrai.
4. Parce que si la récupération est plus facile que la connexion, l'attaquant l'utilise pour contourner le second facteur.
5. Une authentification renforcée : redemander un facteur au moment de l'action, avec une validité courte.

## 4.6 Session et jeton

### 1. Comprendre simplement

Une fois l'utilisateur authentifié, il ne ressaisit pas son mot de passe à chaque clic. La plateforme lui donne une **preuve de connexion** qu'il présente à chaque requête. Cette preuve peut prendre deux formes. La **session** (*session*) est un enregistrement conservé par le serveur, que le client désigne par un identifiant opaque. Le **jeton** (*token*) est une valeur que le client transporte et que le serveur sait vérifier.

**Pourquoi cela existe.** Le protocole HTTP n'a pas de mémoire : chaque requête est indépendante. Sans preuve de connexion, il faudrait s'authentifier à chaque appel.

**Problème résolu.** Prolonger une authentification réussie sur la durée d'un usage, de façon sûre et limitée dans le temps.

**Modèle mental.**

- *La session* est un vestiaire. Vous recevez un numéro ; le vestiaire sait à qui appartient le numéro.
- *Le jeton* est un billet daté et signé. Quiconque le présente est admis, sans que le guichet ait à consulter un registre.

**Où l'analogie s'arrête.** Un billet signé reste valable jusqu'à son expiration, même si le titulaire est devenu indésirable : on ne peut pas facilement le retirer.

**Exemple.** À la connexion, le serveur renvoie un jeton d'accès valable 15 minutes et un jeton de renouvellement valable plusieurs jours.

**Les composants.**

1. un **identifiant de session** ou un **jeton d'accès** ;
2. une **durée de validité** ;
3. un **moyen de renouvellement** ;
4. un **moyen de révocation**.

**Objectif d'apprentissage :** vous pouvez comparer session côté serveur et jeton signé, et expliquer pourquoi on utilise des jetons d'accès de courte durée.

### 2. Connaissances essentielles

#### Définition

- **Session** : contexte d'une interaction authentifiée, conservé côté serveur et référencé par un identifiant opaque, souvent transporté par un cookie.
- **Jeton** : valeur remise au client comme preuve d'authentification ou d'autorisation, qui peut être opaque (référence) ou auto-porteuse (par exemple un JWT signé).

#### Idées fondamentales

1. **Une session est de l'état côté serveur.** Elle se révoque facilement, mais demande du stockage partagé.
2. **Un jeton auto-porteur ne demande pas de consultation.** Mais il est difficile à révoquer avant son expiration.
3. **Les jetons d'accès sont de courte durée.** Un jeton volé est utile peu de temps.
4. **Un jeton de renouvellement obtient de nouveaux jetons.** Il est plus sensible, mieux protégé, et idéalement à rotation.
5. **Le jeton est un secret au porteur.** Quiconque le détient peut l'utiliser.
6. **La vérification porte sur plusieurs éléments.** Signature, émetteur, destinataire, expiration, tenant.

#### Vocabulaire essentiel

- **Cookie de session** : cookie qui contient l'identifiant de session.
- **JWT** (*JSON Web Token*) : jeton signé, formé de trois parties (en-tête, contenu, signature).
- **Revendication** (*claim*) : information portée par un jeton (sujet, tenant, expiration).
- **Jeton d'accès** (*access token*) : jeton présenté aux API.
- **Jeton de renouvellement** (*refresh token*) : jeton qui permet d'obtenir un nouveau jeton d'accès.
- **Révocation** (*revocation*) : invalidation d'une session ou d'un jeton avant son expiration.
- **Délai d'inactivité** et **durée maximale** (*idle timeout*, *absolute timeout*).

#### Relations de cause à effet

- Les jetons d'accès durent plusieurs jours. Un jeton volé donne un accès prolongé et impossible à retirer.
- Les sessions sont stockées en mémoire d'un seul serveur. Un redémarrage ou un équilibrage de charge déconnecte les utilisateurs.
- Le jeton est stocké dans un espace accessible aux scripts de la page. Une faille d'injection de script permet de le voler.

#### Idées reçues

- **« Un JWT est chiffré. »** Non. Il est **signé**, mais son contenu est lisible par quiconque le détient. Il ne faut y mettre aucun secret.
- **« Un JWT est toujours préférable à une session. »** Non. Il simplifie certaines architectures, mais complique la révocation.
- **« Une fois connecté, on est connecté jusqu'à la déconnexion. »** Non. Une session a des limites d'inactivité et de durée, et peut être révoquée.

#### Principe clé

Un jeton est une clé au porteur : limitez sa durée, sa portée, et prévoyez comment le retirer.

#### Si vous ne retenez que trois choses

1. Une session est un état serveur référencé par un identifiant ; un jeton est une preuve transportée par le client.
2. Les jetons d'accès doivent être de courte durée, avec un jeton de renouvellement protégé.
3. Un JWT est signé, pas chiffré, et difficile à révoquer avant son expiration.

### 3. Explication technique détaillée

#### Comparaison des approches

| Critère | Session côté serveur | Jeton opaque | Jeton auto-porteur (JWT) |
|---|---|---|---|
| Ce que le client détient | Identifiant | Référence | Données signées |
| Vérification | Lecture en stockage | Interrogation du serveur d'autorisation | Contrôle de signature |
| Révocation | Immédiate | Immédiate | Difficile avant expiration |
| Charge | Stockage partagé | Appel à chaque vérification | Aucun stockage |
| Informations lisibles par le client | Non | Non | Oui |

#### Structure d'un JWT

```text
En-tête.Contenu.Signature     (chacun encodé en base64url)

Contenu (exemple) :
{
  "iss": "https://auth.example.com",   émetteur
  "sub": "u_42",                       sujet
  "aud": "api.example.com",            destinataire
  "tenant_id": "ten_airline_01",       tenant
  "roles": ["planner"],                rôles
  "iat": 1760000000,                   émis à
  "exp": 1760000900                    expire à (15 minutes plus tard)
}
```

**Vérifications obligatoires par le serveur.**

1. la **signature** est valide, avec l'algorithme attendu et une clé de confiance ;
2. l'**émetteur** (`iss`) est celui attendu ;
3. le **destinataire** (`aud`) est cette API ;
4. le jeton n'est **pas expiré** (`exp`), avec une tolérance réduite d'horloge ;
5. le **tenant** du jeton correspond au contexte de la requête.

#### Jeton d'accès et jeton de renouvellement

```text
Connexion ──► jeton d'accès (15 min)  +  jeton de renouvellement (jours)
                  │ expire
                  ▼
Renouvellement ──► nouveau jeton d'accès  +  nouveau jeton de renouvellement
                                                (l'ancien est invalidé : rotation)
```

**Rotation et détection de rejeu.** À chaque renouvellement, le jeton de renouvellement est remplacé. Si un ancien jeton est présenté de nouveau, cela indique un vol probable : la famille entière de jetons est révoquée.

#### Cookies de session : les attributs de sécurité

| Attribut | Effet |
|---|---|
| `HttpOnly` | Inaccessible aux scripts de la page |
| `Secure` | Transmis uniquement en HTTPS |
| `SameSite=Lax` ou `Strict` | Limite l'envoi lors de requêtes entre sites (réduit les attaques CSRF) |
| `Max-Age` ou `Expires` | Durée de vie |

#### Les délais

- **Inactivité** : la session se ferme après un temps sans action.
- **Durée maximale** : la session se termine même en usage continu.
- **Ré-authentification** : demandée pour les actions sensibles (voir [4.5 Authentification multifacteur](#45-authentification-multifacteur)).

#### Modes de défaillance

- **Fixation de session** : l'attaquant impose un identifiant connu avant la connexion. On régénère l'identifiant à la connexion.
- **Confusion d'algorithme** : le serveur accepte un jeton non signé ou signé avec un algorithme inattendu. On fixe l'algorithme attendu côté serveur.
- **Jeton sans destinataire vérifié** : un jeton émis pour un autre service est accepté.
- **Rotation de clés oubliée** : les clés de signature ne sont jamais changées. On publie plusieurs clés avec un identifiant (`kid`).

**Contre-exemple.** Mettre dans un JWT le mot de passe haché ou un secret métier « puisqu'il est signé ». N'importe qui peut décoder le contenu et le lire.

**Limites.** Il n'existe pas de choix universel. Beaucoup de plateformes combinent : session ou jeton opaque pour l'interface web, et jetons courts pour les API.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.4 Mot de passe](#44-mot-de-passe) et [4.5 Authentification multifacteur](#45-authentification-multifacteur) | La session ou le jeton est émis après authentification |
| [4.9 OAuth 2.0](#49-oauth-20) | OAuth 2.0 définit l'émission et l'usage des jetons d'accès |
| [4.10 OpenID Connect](#410-openid-connect) | OIDC ajoute le jeton d'identité |
| [4.7 Clé d'API](#47-clé-dapi) | Une clé d'API est un autre secret au porteur, de longue durée |
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Le tenant courant est souvent porté par le jeton |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés de signature relèvent de la gestion des secrets |

### 5. Application pratique

**Situation initiale.** L'application web des techniciens garde un jeton valable 30 jours. Un technicien perd son ordinateur portable.

**Problème.** Le jeton volé donne accès à ses droits pendant des semaines, sans moyen de le retirer.

**Application du concept.** La plateforme passe à des jetons d'accès de 15 minutes et à un jeton de renouvellement révocable avec rotation.

**Déroulé.**

1. L'administrateur révoque les sessions du technicien depuis l'écran d'administration.
2. Le jeton de renouvellement est invalidé.
3. Le jeton d'accès en circulation expire au plus tard dans 15 minutes.
4. Le technicien se reconnecte sur un nouvel appareil.

**Résultat.** La fenêtre d'exposition passe de 30 jours à 15 minutes au plus.

**Limites.** Pour des opérations critiques, ces 15 minutes peuvent être trop longues : un contrôle de révocation en ligne s'ajoute alors à la vérification de signature.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une session et un jeton ?
2. **Compréhension.** Un JWT est-il chiffré ?
3. **Compréhension.** Pourquoi les jetons d'accès sont-ils de courte durée ?
4. **Pourquoi.** Pourquoi la révocation est-elle difficile avec un JWT ?
5. **Raisonnement pratique.** Quels contrôles le serveur doit-il faire à la réception d'un jeton ?

#### Réponses

1. Une session est un état conservé côté serveur et désigné par un identifiant. Un jeton est une preuve transportée par le client, que le serveur sait vérifier.
2. Non. Il est signé : son contenu est lisible, mais ne peut pas être modifié sans que la signature devienne invalide.
3. Pour limiter la durée pendant laquelle un jeton volé peut être utilisé.
4. Parce que le serveur le valide sans consulter de registre : tant qu'il n'est pas expiré, il reste accepté, sauf mécanisme de révocation supplémentaire.
5. Signature, émetteur, destinataire, expiration et correspondance avec le tenant de la requête.

## 4.7 Clé d'API

### 1. Comprendre simplement

Une **clé d'API** (*API key*) est un long secret aléatoire qu'une application ou une intégration présente à chaque appel pour s'identifier auprès de la plateforme. Elle est conçue pour les échanges entre programmes, sans personne devant l'écran.

**Pourquoi cela existe.** Les intégrations (un traitement nocturne, un site partenaire) ont besoin d'un moyen simple et durable de s'authentifier, sans passer par un écran de connexion.

**Problème résolu.** Donner à un programme une identité et un accès, que l'on peut limiter, surveiller et retirer sans toucher aux comptes des personnes.

**Modèle mental.** Un badge d'accès pour un prestataire : on le remet, on peut le limiter à certaines portes, et on le désactive sans toucher aux badges des employés.

**Où l'analogie s'arrête.** Un badge est lié à un porteur identifiable. Une clé d'API peut être copiée, et la plateforme ne sait pas qui la détient réellement.

**Exemple.** L'intégration avec le système de maintenance de la compagnie reçoit une clé nommée « sync-maintenance », limitée aux aéronefs et aux tâches, valable un an.

**Les composants.**

1. un **secret** à forte entropie ;
2. un **identifiant public** ou un préfixe ;
3. un **périmètre** (droits, tenant, environnement) ;
4. une **date d'expiration** ;
5. une **trace d'usage**.

**Objectif d'apprentissage :** vous pouvez décrire comment générer, stocker, limiter et renouveler une clé d'API.

### 2. Connaissances essentielles

#### Définition

Une **clé d'API** est une chaîne secrète à forte entropie associée à une identité non humaine ou à un tenant, présentée à chaque requête pour l'authentifier, et dont les droits sont limités par configuration.

#### Idées fondamentales

1. **La clé est un secret au porteur.** Quiconque la détient peut l'utiliser.
2. **Elle est aléatoire et longue.** Au moins 128 bits d'entropie.
3. **Elle est stockée comme un mot de passe.** Seule une empreinte est conservée côté plateforme.
4. **Elle est affichée une seule fois.** À la création.
5. **Elle a un périmètre et une durée.** Droits minimaux, tenant, expiration.
6. **Elle se renouvelle et se révoque.** Avec une période de recouvrement pour migrer sans interruption.

#### Vocabulaire essentiel

- **Secret** : partie confidentielle de la clé.
- **Préfixe** (*prefix*) : début lisible de la clé, qui permet de la reconnaître sans révéler le secret.
- **Entropie** (*entropy*) : mesure du caractère imprévisible.
- **Périmètre** (*scope*) : droits accordés à la clé.
- **Rotation** : remplacement planifié d'une clé.
- **Dernière utilisation** (*last used*) : information de suivi pour repérer les clés inutilisées.
- **Analyse de secrets** (*secret scanning*) : détection de clés dans le code ou les journaux.

#### Relations de cause à effet

- La clé est placée dans le code source ou une page web. Elle est copiée avec le dépôt, et n'importe qui peut l'utiliser.
- La clé est transmise dans l'adresse (`?api_key=…`). Elle apparaît dans les journaux des serveurs, des proxys et des navigateurs.
- La clé n'a pas de date d'expiration. Elle reste valable bien après la fin de l'intégration, et devient un accès oublié.

#### Idées reçues

- **« Une clé d'API authentifie un utilisateur. »** Non. Elle identifie une application ou un tenant, pas une personne.
- **« Une clé d'API suffit pour une application publique. »** Une application dont le code est distribué (mobile, navigateur) ne peut pas garder un secret : elle utilise d'autres mécanismes (OAuth avec PKCE).
- **« Plus la clé est courte, plus elle est pratique. »** Une clé courte se devine ; l'ergonomie vient des préfixes et de l'interface, pas de la brièveté.

#### Principe clé

Une clé d'API est un secret à traiter comme un mot de passe : aléatoire, stocké en empreinte, limité en droits, à durée bornée, renouvelable et révocable.

#### Si vous ne retenez que trois choses

1. Une clé d'API est un secret au porteur pour authentifier un programme.
2. La plateforme n'en garde qu'une empreinte et l'affiche une seule fois.
3. Chaque clé a des droits minimaux, une expiration et un historique d'usage.

### 3. Explication technique détaillée

#### Génération et stockage

```text
Création :
  secret   = 32 octets aléatoires issus d'un générateur cryptographique
  clé      = "pk_live_" + base64url(secret)          (préfixe lisible)
  stocké   : préfixe, SHA-256(secret) ou empreinte, tenant, périmètre, expiration
  affiché  : la clé complète, une seule fois

Vérification :
  retrouver la ligne par le préfixe, comparer les empreintes à temps constant
```

**Pourquoi un hachage rapide ici.** Contrairement à un mot de passe choisi par un humain, une clé générée aléatoirement avec 256 bits d'entropie ne peut pas être devinée : un hachage rapide suffit. L'empreinte protège contre la lecture de la base.

**Entropie.** Une clé de 32 octets aléatoires porte 256 bits d'entropie, soit $2^{256}$ valeurs possibles, hors de portée de toute recherche exhaustive.

#### La transmission

```http
GET /resources/aircraft HTTP/1.1
Authorization: Bearer pk_live_9sK2...
```

La clé voyage dans un **en-tête**, en HTTPS, jamais dans l'adresse ni dans le corps d'une page publique.

#### L'administration d'une clé

| Fonction | Détail |
|---|---|
| Création | Nom, propriétaire, droits, tenant, environnement, expiration |
| Affichage | Une seule fois ; ensuite seulement le préfixe |
| Droits | Périmètre minimal, sous-ensemble des droits du créateur |
| Rotation | Création d'une seconde clé, période de recouvrement, retrait de la première |
| Révocation | Immédiate, avec journalisation |
| Suivi | Dernière utilisation, volume, adresses sources |
| Alertes | Clé inutilisée, clé détectée dans un dépôt public |

#### Les environnements

Deux préfixes distincts (`pk_test_`, `pk_live_`) évitent qu'une clé de test soit utilisée en production par erreur, ou inversement.

#### Comparaison avec OAuth

| Critère | Clé d'API | OAuth (identifiants client) |
|---|---|---|
| Durée de la preuve | Longue | Jeton court, renouvelé |
| Mise en œuvre | Très simple | Plus complète |
| Révocation | Immédiate côté serveur | Jetons courts, renouvellement refusé |
| Délégation au nom d'un utilisateur | Non | Oui |
| Usage typique | Intégration simple serveur à serveur | Écosystème, applications tierces |

**Contre-exemple.** Une clé « administrateur » unique, utilisée par toutes les intégrations de l'entreprise. Elle ne peut pas être révoquée sans tout casser, et ses actions ne sont pas attribuables.

**Limites.** Une clé d'API ne permet pas d'identifier l'utilisateur final qui déclenche l'appel. Pour une application agissant au nom d'utilisateurs, OAuth est plus adapté (voir [4.9 OAuth 2.0](#49-oauth-20)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.3 Identités non humaines](#43-identités-non-humaines) | La clé d'API est un moyen d'authentification d'identité non humaine |
| [4.4 Mot de passe](#44-mot-de-passe) | Elle se stocke comme un mot de passe, en empreinte |
| [4.9 OAuth 2.0](#49-oauth-20) | OAuth est l'alternative à jetons courts et délégation |
| [10.5 Authentification des API](10-api-integrations-extensibilite.md#105-authentification-des-api) | L'authentification d'API compare les mécanismes disponibles |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration technique expose la gestion des clés |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | La gestion des secrets couvre leur stockage et leur rotation |

### 5. Application pratique

**Situation initiale.** Un partenaire de maintenance doit lire les aéronefs de la compagnie par API. Il reçoit aujourd'hui une clé administrateur par courriel.

**Problème.** La clé donne tous les droits, ne peut pas être limitée, et circule en clair.

**Application du concept.** On crée une clé dédiée, à portée réduite et à expiration.

**Déroulé.**

1. L'administrateur crée la clé « partner-maintenance » en lecture seule sur les aéronefs.
2. Il fixe une expiration à 6 mois et active une alerte sur la dernière utilisation.
3. La clé est affichée une seule fois et transmise par un canal sécurisé.
4. Le partenaire l'utilise ; la plateforme enregistre chaque appel.
5. Avant l'expiration, une seconde clé est créée, et la première retirée après migration.

**Résultat.** Le partenaire accède à ce dont il a besoin, rien de plus, avec une traçabilité complète.

**Limites.** Si le partenaire place la clé dans son dépôt de code, elle fuit quand même. L'analyse de secrets et la rotation limitent la durée d'exposition.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que conserve la plateforme d'une clé d'API ?
2. **Compréhension.** Pourquoi n'affiche-t-on la clé qu'une seule fois ?
3. **Compréhension.** Pourquoi ne faut-il pas placer la clé dans l'adresse ?
4. **Pourquoi.** Pourquoi un hachage rapide suffit-il pour une clé d'API, alors qu'il ne suffit pas pour un mot de passe ?
5. **Raisonnement pratique.** Une clé a fuité sur un dépôt public. Que faire, et dans quel ordre ?

#### Réponses

1. Une empreinte du secret, un préfixe pour l'identifier, ses droits, son tenant, son expiration et son historique d'usage.
2. Parce que la plateforme n'en garde pas le secret : l'afficher à nouveau est impossible, et cela évite de multiplier les lieux de stockage.
3. Parce que les adresses sont enregistrées dans les journaux des serveurs, des proxys et des navigateurs, et peuvent être partagées par mégarde.
4. Parce qu'une clé générée aléatoirement avec une forte entropie ne peut pas être devinée, alors qu'un mot de passe humain a une entropie faible et se casse par essais.
5. Révoquer la clé immédiatement, émettre une nouvelle clé, examiner l'usage récent dans les journaux, puis corriger la cause de la fuite.

## 4.8 Authentification unique

### 1. Comprendre simplement

L'**authentification unique** (*Single Sign-On*, **SSO**) permet à un utilisateur de s'authentifier **une seule fois** auprès d'un fournisseur d'identité, et d'accéder ensuite à plusieurs applications sans ressaisir ses identifiants.

**Pourquoi cela existe.** Une entreprise utilise des dizaines d'applications. Faire gérer à chaque employé autant de mots de passe, et à chaque application sa propre base d'utilisateurs, est coûteux et dangereux : les mots de passe sont réutilisés et le départ d'un employé laisse des comptes ouverts un peu partout.

**Problème résolu.** Centraliser l'identité, l'authentification forte et le retrait des accès, au même endroit pour toutes les applications.

**Modèle mental.** Un badge d'entreprise. Vous le présentez à l'entrée du bâtiment, puis il vous ouvre les portes de tous les services auxquels vous avez droit, sans montrer de papiers à chaque porte.

**Où l'analogie s'arrête.** La porte d'un service vérifie en plus vos droits locaux. Avec le SSO, l'application doit encore décider de ce que vous avez le droit de faire : l'authentification est unique, l'autorisation reste locale.

**Exemple.** Les employés de la compagnie aérienne se connectent à la plateforme avec leur compte professionnel. Quand l'un d'eux quitte l'entreprise, la désactivation de son compte central lui retire l'accès partout.

**Les acteurs.**

1. le **fournisseur d'identité** (*identity provider*, *IdP*) : celui qui authentifie ;
2. le **fournisseur de service** (*service provider*, *SP*) ou **application cliente** : celle qui fait confiance à l'IdP ;
3. l'**utilisateur**.

**Objectif d'apprentissage :** vous pouvez décrire le déroulement d'une connexion unique et dire quels protocoles la réalisent.

### 2. Connaissances essentielles

#### Définition

Le **SSO** est un mécanisme dans lequel un fournisseur d'identité authentifie l'utilisateur et transmet cette preuve à plusieurs applications, qui l'acceptent sans demander de nouvelle authentification.

#### Idées fondamentales

1. **L'authentification est déléguée.** L'application fait confiance à un fournisseur d'identité.
2. **La confiance est établie par configuration.** Échange de métadonnées, certificats ou clés.
3. **Le SSO s'appuie sur un protocole.** SAML 2.0 ou OpenID Connect.
4. **L'autorisation reste à l'application.** Le fournisseur d'identité peut transmettre des attributs, mais la décision est locale.
5. **Le client de la plateforme configure son propre fournisseur.** Un fournisseur différent par tenant.
6. **Le fournisseur d'identité est un point critique.** Son indisponibilité empêche la connexion.

#### Vocabulaire essentiel

- **Fournisseur d'identité** (*IdP*) : système qui authentifie les utilisateurs.
- **Fournisseur de service** (*SP*) : application qui délègue l'authentification.
- **Assertion** : déclaration signée de l'IdP sur l'identité de l'utilisateur.
- **Fédération** (*federation*) : relation de confiance entre domaines d'identité.
- **Provisionnement à la volée** (*just-in-time provisioning*) : création du compte à la première connexion.
- **Déconnexion unique** (*single logout*) : fermeture de toutes les sessions d'un coup.
- **Accès de secours** (*break-glass account*) : compte local de dernier recours, si le SSO est en panne.

#### Relations de cause à effet

- Le SSO est imposé à tous les utilisateurs d'un tenant. Les politiques de mot de passe et de MFA du client s'appliquent partout, de façon centralisée.
- Le fournisseur d'identité tombe en panne. Plus personne ne peut se connecter, y compris les administrateurs.
- Un compte est relié par simple adresse électronique. Un attaquant qui contrôle une adresse non vérifiée chez l'IdP peut prendre le compte d'un autre.

#### Idées reçues

- **« SSO signifie un seul mot de passe pour tout. »** Non. Il y a un seul **point d'authentification**, protégé idéalement par un second facteur.
- **« Le SSO règle aussi les droits. »** Non. Il transmet l'identité et des attributs. Les droits dans l'application restent à définir.
- **« Le SSO est réservé aux grandes entreprises. »** Il est surtout demandé par elles, mais le principe s'applique dès qu'une organisation veut centraliser ses accès.

#### Principe clé

Le SSO délègue l'authentification à un fournisseur d'identité de confiance, mais la plateforme garde la décision d'autorisation.

#### Si vous ne retenez que trois choses

1. Le SSO fait authentifier l'utilisateur une seule fois par un fournisseur d'identité.
2. Il repose sur un protocole standard (SAML 2.0 ou OpenID Connect) et une confiance configurée.
3. L'autorisation reste à la plateforme ; le fournisseur d'identité en est un point critique.

### 3. Explication technique détaillée

#### Le déroulement général

```text
Utilisateur           Plateforme (SP)              Fournisseur d'identité (IdP)
    │  1. accès ─────────►│                                   │
    │                     │ 2. redirection vers l'IdP ───────►│
    │ ◄───────────────────┴──────── (demande d'authentification)
    │  3. s'authentifie (mot de passe, MFA) ──────────────────►│
    │                     │ ◄──── 4. assertion ou jeton signé ─┤
    │                     │ 5. vérifie la signature et les conditions
    │                     │ 6. crée une session locale
    │ ◄── 7. accès ───────┤
```

**Pourquoi la redirection.** L'utilisateur saisit ses identifiants uniquement sur le site du fournisseur d'identité, pas sur la plateforme. Celle-ci ne voit jamais le mot de passe.

#### Les protocoles

| Protocole | Format | Contexte courant |
|---|---|---|
| SAML 2.0 | Assertions XML signées | Entreprises, applications d'entreprise (voir [4.11 SAML](#411-saml)) |
| OpenID Connect | Jeton d'identité JWT, au-dessus d'OAuth 2.0 | Applications modernes, mobiles (voir [4.10 OpenID Connect](#410-openid-connect)) |

#### La découverte du fournisseur par tenant

Une plateforme multi-tenant doit savoir **quel** fournisseur utiliser pour un utilisateur donné :

1. par le domaine de l'adresse électronique saisie (`@compagnie.example`) ;
2. par l'adresse de connexion propre au tenant (`compagnie.platform.example`) ;
3. par un choix explicite de l'utilisateur.

#### La configuration par tenant

```json
{
  "tenant": "airline-regional",
  "sso": {
    "protocol": "oidc",
    "issuer": "https://login.compagnie.example",
    "client_id": "platform-prod",
    "domains": ["compagnie.example"],
    "enforce": true,
    "jit_provisioning": true,
    "attribute_mapping": { "email": "email", "groups": "roles" },
    "break_glass_admins": ["admin-local-01"]
  }
}
```

**Comment la lire.** Le tenant impose le SSO pour ses domaines, crée les comptes à la volée, mappe des attributs du fournisseur vers des rôles, et conserve un compte de secours local.

#### Le rattachement d'un compte

Un compte est rattaché au couple (émetteur, identifiant du sujet) fourni par le fournisseur, pas à l'adresse électronique seule. Rattacher par adresse sans vérification qu'elle a été confirmée peut permettre la prise de contrôle d'un compte existant.

**Contre-exemple.** Une plateforme qui fusionne les comptes sur la base de l'adresse transmise par un fournisseur d'identité non vérifié. Un attaquant crée un compte chez ce fournisseur avec l'adresse d'un administrateur, et prend son compte.

#### Provisionnement et départ

- **À la volée** : le compte est créé à la première connexion. Simple, mais ne traite pas les départs.
- **Synchronisé** (SCIM, voir [4.12 SCIM](#412-scim)) : les comptes sont créés, modifiés et désactivés par synchronisation avec l'annuaire. Un départ coupe l'accès sans attendre.

**Limites.** Un utilisateur désactivé chez le fournisseur garde sa session locale jusqu'à son expiration. Des sessions courtes, la déconnexion unique ou la révocation par synchronisation réduisent cette fenêtre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.9 OAuth 2.0](#49-oauth-20) | OAuth 2.0 est la base d'OpenID Connect |
| [4.10 OpenID Connect](#410-openid-connect) | OpenID Connect réalise le SSO moderne |
| [4.11 SAML](#411-saml) | SAML réalise le SSO d'entreprise |
| [4.12 SCIM](#412-scim) | SCIM complète le SSO par le provisionnement |
| [4.5 Authentification multifacteur](#45-authentification-multifacteur) | Le MFA est exigé auprès du fournisseur d'identité |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration du SSO est propre à chaque tenant |

### 5. Application pratique

**Situation initiale.** La compagnie compte 2 000 employés et utilise un annuaire d'entreprise. Les mots de passe de la plateforme sont gérés séparément.

**Problème.** Les départs ne sont pas traités à temps, et la politique de mots de passe diffère de celle de l'entreprise.

**Application du concept.** L'administrateur configure l'authentification unique avec le fournisseur d'identité de l'entreprise.

**Déroulé.**

1. L'administrateur saisit les paramètres du fournisseur dans l'écran de configuration.
2. Il teste la connexion avec un compte pilote.
3. Il active l'obligation de SSO pour le domaine de l'entreprise.
4. Les connexions passent désormais par le fournisseur ; le MFA de l'entreprise s'applique.

**Résultat.** Un seul point de contrôle pour les mots de passe, le second facteur et les départs.

**Limites.** Il faut conserver un accès de secours pour les administrateurs, et prévoir la procédure en cas de panne du fournisseur.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qui sont le fournisseur d'identité et le fournisseur de service ?
2. **Compréhension.** Quels protocoles réalisent couramment le SSO ?
3. **Compréhension.** Le SSO gère-t-il les droits dans l'application ?
4. **Pourquoi.** Pourquoi rattache-t-on un compte à (émetteur, sujet) plutôt qu'à l'adresse électronique seule ?
5. **Raisonnement pratique.** Que prévoir si le fournisseur d'identité d'un client tombe en panne ?

#### Réponses

1. Le fournisseur d'identité authentifie l'utilisateur. Le fournisseur de service est l'application qui fait confiance à cette authentification.
2. SAML 2.0 et OpenID Connect.
3. Non. Il établit l'identité et peut transmettre des attributs ; les droits dans l'application restent définis par la plateforme.
4. Parce que l'adresse peut ne pas être vérifiée ou être réattribuée ; le couple (émetteur, sujet) est stable et propre à ce fournisseur.
5. Un accès de secours local pour les administrateurs, une procédure de rétablissement, et des sessions locales suffisamment longues pour ne pas couper tous les utilisateurs au moindre incident.

## 4.9 OAuth 2.0

### 1. Comprendre simplement

**OAuth 2.0** est un cadre normalisé qui permet à une application d'obtenir un **accès limité** aux ressources d'un utilisateur, avec son consentement, **sans jamais connaître son mot de passe**. C'est un cadre de **délégation d'autorisation**.

**Pourquoi cela existe.** Avant OAuth, une application qui voulait lire vos données chez un autre service vous demandait votre mot de passe pour ce service. Elle avait alors tous vos droits, sans limite ni moyen de révocation. OAuth remplace ce partage par un jeton limité et révocable.

**Problème résolu.** Permettre à une application tierce d'agir pour un utilisateur, avec des droits précis et temporaires, sans que l'utilisateur ne lui confie son secret.

**Modèle mental.** La clé de voiturier. Elle ouvre la portière et démarre le moteur, mais pas le coffre ni la boîte à gants. Vous pouvez la reprendre à tout moment.

**Où l'analogie s'arrête.** Une clé physique est la même pour tous. Un jeton OAuth est propre à une application, à un utilisateur, à un périmètre et à une durée, et son émission passe par un écran de consentement.

**Exemple.** Une application d'agenda demande à lire les dates d'inspection des aéronefs d'une planificatrice. La planificatrice approuve ce droit de lecture, sans donner son mot de passe à l'application d'agenda.

**Les quatre rôles.**

1. le **propriétaire de la ressource** (*resource owner*) : l'utilisateur ;
2. le **client** (*client*) : l'application qui veut accéder ;
3. le **serveur d'autorisation** (*authorization server*) : celui qui émet les jetons ;
4. le **serveur de ressources** (*resource server*) : l'API qui détient les données.

**Objectif d'apprentissage :** vous pouvez décrire le flux « code d'autorisation » et expliquer pourquoi OAuth 2.0 n'est pas, à lui seul, un protocole de connexion.

### 2. Connaissances essentielles

#### Définition

**OAuth 2.0** (RFC 6749) est un cadre d'autorisation qui permet à un client d'obtenir, auprès d'un serveur d'autorisation, un jeton d'accès de portée limitée pour appeler un serveur de ressources, au nom d'un propriétaire de ressource ou en son propre nom.

#### Idées fondamentales

1. **C'est de la délégation.** L'utilisateur autorise une application à agir pour lui, à un périmètre précis.
2. **Le mot de passe n'est pas partagé.** Le client reçoit un jeton, pas un secret.
3. **Le périmètre limite le jeton.** Les *scopes* bornent ce que le jeton permet.
4. **Plusieurs « flux » existent.** Chacun correspond à un type de client et de situation.
5. **Le jeton est un secret au porteur.** Sa durée est courte, et il se renouvelle.
6. **OAuth ne dit pas qui est l'utilisateur.** Pour l'identité, on ajoute OpenID Connect.

#### Vocabulaire essentiel

- **Périmètre** (*scope*) : étendue d'accès demandée (par exemple `aircraft.read`).
- **Type d'octroi** (*grant type*) : le flux utilisé pour obtenir un jeton.
- **Code d'autorisation** (*authorization code*) : valeur éphémère échangée contre des jetons.
- **URI de redirection** (*redirect URI*) : adresse où le serveur renvoie l'utilisateur.
- **PKCE** (*Proof Key for Code Exchange*, RFC 7636) : mécanisme qui protège l'échange du code.
- **Client confidentiel** et **client public** : un client qui peut garder un secret, ou non (application mobile, navigateur).
- **Consentement** (*consent*) : accord explicite de l'utilisateur.

#### Relations de cause à effet

- L'URI de redirection n'est pas vérifiée strictement. Un attaquant peut faire renvoyer le code vers son propre site.
- Le paramètre `state` n'est pas utilisé. Une attaque par falsification de requête peut lier le compte de la victime à celui de l'attaquant.
- Les périmètres demandés sont trop larges. L'utilisateur approuve un accès disproportionné, et une fuite du jeton est plus grave.

#### Idées reçues

- **« OAuth sert à se connecter. »** Non. OAuth autorise l'accès à une API. Se connecter, c'est-à-dire savoir qui est l'utilisateur, relève d'OpenID Connect.
- **« Le jeton d'accès contient les droits de l'utilisateur. »** Pas exactement. Le périmètre du jeton est un **plafond** : les droits effectifs sont l'intersection des permissions de l'utilisateur et du périmètre du jeton.
- **« Le flux implicite est adapté aux applications en navigateur. »** Il est déconseillé : les recommandations de sécurité actuelles préconisent le code d'autorisation avec PKCE.

#### Principe clé

Un jeton OAuth délègue un accès limité, à un client précis, pour un utilisateur précis, pendant un temps limité.

#### Si vous ne retenez que trois choses

1. OAuth 2.0 délègue un accès limité à une application, sans partager le mot de passe.
2. Le flux recommandé pour les applications avec utilisateur est le code d'autorisation avec PKCE.
3. Le périmètre du jeton plafonne l'accès, il ne l'étend jamais au-delà des droits de l'utilisateur.

### 3. Explication technique détaillée

#### Le flux code d'autorisation avec PKCE

```text
Utilisateur        Client (application)        Serveur d'autorisation      API (ressources)
     │ 1. démarre ──────►│                              │                        │
     │                   │ 2. redirige avec : client_id, redirect_uri, scope,
     │                   │    state, code_challenge ───►│                        │
     │ ◄─────────────────┴── 3. page de connexion et de consentement
     │ 4. s'authentifie, consent ──────────────────────►│                        │
     │ ◄──── 5. redirection vers redirect_uri?code=…&state=… ───                  │
     │                   │ 6. échange : code + code_verifier ─►│                  │
     │                   │ ◄── 7. jeton d'accès (+ jeton de renouvellement) ──    │
     │                   │ 8. appelle l'API avec le jeton d'accès ───────────────►│
```

**Le rôle de PKCE.** Le client génère un secret aléatoire (`code_verifier`) et envoie son empreinte (`code_challenge`) au début. À l'échange, il fournit le secret. Un attaquant qui intercepte le code ne peut pas l'échanger, car il ignore le secret.

```http
GET /authorize?response_type=code
    &client_id=calendar-app
    &redirect_uri=https%3A%2F%2Fcalendar.example%2Fcallback
    &scope=aircraft.read
    &state=af0ifjsldkj
    &code_challenge=<empreinte du vérificateur>
    &code_challenge_method=S256
```

```http
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<code reçu>
&redirect_uri=https%3A%2F%2Fcalendar.example%2Fcallback
&client_id=calendar-app
&code_verifier=<vérificateur d'origine>
```

#### Les types d'octroi

| Type | Situation | Remarque |
|---|---|---|
| Code d'autorisation avec PKCE | Application avec utilisateur (web, mobile) | Recommandé |
| Identifiants client (*client credentials*) | Service à service, sans utilisateur | Le client agit en son nom |
| Code d'appareil (*device code*, RFC 8628) | Appareil sans clavier | L'utilisateur approuve sur un autre écran |
| Renouvellement (*refresh token*) | Obtenir un nouveau jeton d'accès | Protéger et faire tourner le jeton |
| Implicite, mot de passe du propriétaire | Anciens usages | Déconseillés |

```http
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=svc-nightly-import
&client_secret=<secret>
&scope=aircraft.write
```

#### Périmètre et permissions

$$\text{droits effectifs} = \text{permissions de l'utilisateur} \;\cap\; \text{périmètre du jeton}$$

**Exemple.** Un planificateur peut modifier les aéronefs. Il approuve pour une application le seul périmètre `aircraft.read`. Les droits effectifs de l'application sont la lecture seule. Si le planificateur perd ses droits de modification, l'application n'obtient pas de nouveaux droits pour autant.

#### Les précautions essentielles

- **URI de redirection exactes** : pas de jokers, pas de redirections ouvertes.
- **Paramètre `state`** : protège contre la falsification de requête inter-sites.
- **PKCE pour tous les clients**, y compris confidentiels.
- **Secrets client** jamais dans une application distribuée.
- **Périmètres minimaux** et consentement lisible.
- **Jetons de renouvellement à rotation**, liés à un client.

#### Dans une plateforme

La plateforme est le **serveur d'autorisation** pour les applications de sa place de marché (voir [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)). L'administrateur d'un tenant donne le consentement au nom de ses utilisateurs, et peut révoquer l'accès d'une application à tout moment.

**Contre-exemple.** Une application mobile qui embarque un `client_secret` en dur. Le secret est extrait de l'application publiée, et n'importe qui peut se faire passer pour elle.

**Limites.** OAuth 2.0 est un cadre, pas un protocole figé : de nombreux choix sont laissés à l'implémentation. Les recommandations de sécurité (OAuth 2.0 Security Best Current Practice, et le projet OAuth 2.1) ont resserré ces choix.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.6 Session et jeton](#46-session-et-jeton) | OAuth émet des jetons d'accès et de renouvellement |
| [4.10 OpenID Connect](#410-openid-connect) | OpenID Connect ajoute l'identité à OAuth 2.0 |
| [4.8 Authentification unique](#48-authentification-unique) | Le SSO moderne repose sur OpenID Connect, donc sur OAuth |
| [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée) | Le périmètre (*scope*) est une notion distincte du rôle |
| [10.5 Authentification des API](10-api-integrations-extensibilite.md#105-authentification-des-api) | L'authentification d'API s'appuie souvent sur OAuth |
| [4.21 Délégation](#421-délégation) | OAuth est un mécanisme de délégation |

### 5. Application pratique

**Situation initiale.** Un éditeur partenaire propose un tableau de bord de suivi de maintenance qui lit les aéronefs d'un tenant.

**Problème.** Les clients ne veulent pas lui donner de mots de passe, ni une clé administrateur.

**Application du concept.** Le partenaire s'inscrit comme application OAuth auprès de la plateforme. L'administrateur du tenant l'approuve avec un périmètre de lecture.

**Déroulé.**

1. L'administrateur clique sur « Connecter » dans le tableau de bord du partenaire.
2. Il est redirigé vers la plateforme, s'authentifie et voit : « Lire les aéronefs et les tâches ».
3. Il approuve. Le partenaire reçoit un code, puis un jeton d'accès limité.
4. Le partenaire interroge l'API avec ce jeton.
5. L'administrateur peut révoquer l'accès depuis l'écran des intégrations.

**Résultat.** Le partenaire lit les données autorisées, sans mot de passe et sans clé administrateur, et l'accès est révocable.

**Limites.** Le client peut copier les données qu'il lit. La révocation arrête les appels futurs, pas la conservation de ce qui a déjà été lu : cela relève du contrat.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les quatre rôles d'OAuth 2.0 ?
2. **Compréhension.** À quoi sert PKCE ?
3. **Compréhension.** Quel flux utilise-t-on pour une intégration service à service sans utilisateur ?
4. **Pourquoi.** Pourquoi OAuth 2.0 n'est-il pas un protocole d'authentification ?
5. **Raisonnement pratique.** Une application obtient le périmètre `aircraft.write`, mais l'utilisateur n'a pas le droit de modifier les aéronefs. Que peut faire l'application ?

#### Réponses

1. Le propriétaire de la ressource, le client, le serveur d'autorisation et le serveur de ressources.
2. À empêcher qu'un code d'autorisation intercepté soit utilisé par un attaquant : l'échange exige un secret que seul le client légitime connaît.
3. Le flux des identifiants client (*client credentials*).
4. Parce qu'il délivre un droit d'accès à une API, et ne dit pas qui est l'utilisateur ni comment il s'est authentifié. L'identité est ajoutée par OpenID Connect.
5. Rien en écriture : les droits effectifs sont l'intersection des permissions de l'utilisateur et du périmètre. Sans droit de l'utilisateur, le périmètre ne donne rien.

## 4.10 OpenID Connect

### 1. Comprendre simplement

**OpenID Connect** (**OIDC**) est une couche d'**identité** construite au-dessus d'OAuth 2.0. Elle permet à une application de **savoir qui est l'utilisateur** qui vient de se connecter, et d'obtenir quelques informations de profil, de façon standardisée.

**Pourquoi cela existe.** OAuth 2.0 dit « cette application peut accéder à ces données ». Il ne dit pas qui s'est connecté. Beaucoup d'applications détournaient des jetons d'accès comme preuve d'identité, de façon fragile et non portable. OIDC normalise la réponse à la question « qui est-ce ? ».

**Problème résolu.** Fournir une connexion fédérée simple, sûre et interopérable pour les applications web et mobiles.

**Modèle mental.** Dans l'analogie de la clé de voiturier, OIDC ajoute une **carte d'identité** signée par l'hôtel, qui indique le nom du conducteur et à quelle heure il est arrivé.

**Où l'analogie s'arrête.** Une carte d'identité papier est destinée à tous ceux à qui on la montre. Le jeton d'identité OIDC est destiné **à l'application cliente** seulement, pas à l'API.

**Exemple.** L'application des techniciens délègue la connexion au fournisseur d'identité de l'entreprise. Elle reçoit un jeton d'identité qui indique le sujet, l'heure et le moyen d'authentification.

**Les composants.**

1. un **jeton d'identité** (*ID token*), un JWT signé ;
2. des **périmètres standards** (`openid`, `profile`, `email`) ;
3. un point d'accès d'**informations utilisateur** (*UserInfo*) ;
4. un document de **découverte** qui publie la configuration.

**Objectif d'apprentissage :** vous pouvez expliquer ce que le jeton d'identité contient, et pourquoi on ne doit pas l'utiliser pour appeler une API.

### 2. Connaissances essentielles

#### Définition

**OpenID Connect 1.0** est un protocole d'identité fondé sur OAuth 2.0 qui permet à un client de vérifier l'identité d'un utilisateur à partir de l'authentification effectuée par un serveur d'autorisation, et d'obtenir des informations de profil, par un jeton d'identité signé.

#### Idées fondamentales

1. **OIDC = OAuth 2.0 + identité.** Il réutilise ses flux et ses jetons.
2. **Le jeton d'identité est destiné au client.** Il prouve l'authentification, il n'ouvre pas d'API.
3. **Le périmètre `openid` active OIDC.** Sans lui, c'est de l'OAuth simple.
4. **Les revendications standard décrivent l'utilisateur.** Sujet, nom, adresse électronique.
5. **La découverte automatise la configuration.** Le fournisseur publie ses adresses et ses clés.
6. **Le sujet est stable par fournisseur.** C'est lui, et non l'adresse électronique, qui identifie la personne.

#### Vocabulaire essentiel

- **Jeton d'identité** (*ID token*) : JWT signé qui atteste l'authentification.
- **Revendication** (*claim*) : information sur l'utilisateur ou l'événement (`sub`, `email`).
- **`sub`** : identifiant stable du sujet chez le fournisseur.
- **`nonce`** : valeur qui lie le jeton à la demande, contre le rejeu.
- **Document de découverte** : `/.well-known/openid-configuration`.
- **JWKS** (*JSON Web Key Set*) : ensemble des clés publiques de signature.
- **`acr`** et **`amr`** : indications sur le niveau et les méthodes d'authentification.

#### Relations de cause à effet

- Le client utilise le jeton d'identité comme jeton d'API. Une API qui l'accepte ne vérifie pas que le jeton lui est destiné : un jeton émis pour une autre application peut être rejoué.
- Le compte est identifié par l'adresse `email`. Si le fournisseur autorise l'adresse non vérifiée ou son changement, un attaquant s'approprie le compte.
- La signature n'est pas vérifiée avec les clés du fournisseur. N'importe qui peut forger un jeton.

#### Idées reçues

- **« Le jeton d'accès et le jeton d'identité sont interchangeables. »** Non. Le premier est destiné à l'API, le second au client.
- **« L'adresse électronique est le bon identifiant. »** Non : utilisez le couple (`iss`, `sub`). L'adresse peut changer ou ne pas être vérifiée.
- **« OIDC remplace les autorisations. »** Non. Il fournit l'identité et des attributs ; les droits restent à définir.

#### Principe clé

OIDC répond à « qui est l'utilisateur ? » par un jeton signé destiné au client ; il s'ajoute à OAuth, qui répond à « que peut faire l'application ? ».

#### Si vous ne retenez que trois choses

1. OIDC ajoute à OAuth 2.0 un jeton d'identité et des revendications standard.
2. Le jeton d'identité est pour le client ; le jeton d'accès est pour l'API.
3. Identifiez l'utilisateur par (`iss`, `sub`), pas par son adresse électronique.

### 3. Explication technique détaillée

#### Le jeton d'identité

```json
{
  "iss": "https://login.compagnie.example",
  "sub": "00u8x1abc",
  "aud": "platform-prod",
  "exp": 1760000900,
  "iat": 1760000000,
  "auth_time": 1759999990,
  "nonce": "n-0S6_WzA2Mj",
  "email": "mathilde.durand@compagnie.example",
  "email_verified": true,
  "amr": ["pwd", "otp"]
}
```

**Comment le lire.** `iss` est l'émetteur. `sub` identifie la personne chez cet émetteur. `aud` est le client auquel le jeton est destiné. `amr` indique les méthodes d'authentification utilisées (mot de passe, code à usage unique), ce qui permet de vérifier qu'un second facteur a bien eu lieu.

#### Les vérifications du client

1. la **signature** correspond à une clé du fournisseur (publiée dans le JWKS) ;
2. `iss` est l'émetteur attendu ;
3. `aud` contient l'identifiant de ce client ;
4. le jeton n'est pas expiré (`exp`) ;
5. le `nonce` correspond à celui de la demande ;
6. si le niveau d'authentification est exigé, `acr` ou `amr` le confirme.

#### Les flux et les points d'accès

```text
Découverte        GET /.well-known/openid-configuration
Autorisation      GET /authorize   (scope = openid profile email)
Jetons            POST /token      → id_token, access_token, refresh_token
Informations      GET /userinfo    (avec le jeton d'accès)
Clés              GET /jwks        (clés publiques de signature)
```

#### Jeton d'identité et jeton d'accès

| Critère | Jeton d'identité | Jeton d'accès |
|---|---|---|
| Destinataire | Le client (application) | L'API (serveur de ressources) |
| Rôle | Prouver l'authentification | Autoriser un accès |
| Format | Toujours un JWT | Opaque ou JWT |
| À envoyer à une API ? | Non | Oui |

#### La correspondance avec l'identité de la plateforme

```text
(iss = https://login.compagnie.example, sub = 00u8x1abc)  ──►  utilisateur u_42 du tenant T1
```

On stocke ce couple comme identité fédérée de l'utilisateur. Les attributs (adresse, groupes) servent à mettre à jour son profil, mais ne servent pas de clé.

**Contre-exemple.** Lier les comptes sur l'adresse électronique présente dans le jeton sans contrôler `email_verified`. Un attaquant qui peut enregistrer l'adresse d'une victime chez un fournisseur permissif obtient le compte de celle-ci.

**Limites.** Chaque fournisseur d'identité a ses particularités : revendications personnalisées, noms de groupes, durée de vie des sessions. Une plateforme qui accepte de nombreux fournisseurs a besoin de règles de correspondance configurables par tenant.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.9 OAuth 2.0](#49-oauth-20) | OIDC est construit sur OAuth 2.0 |
| [4.6 Session et jeton](#46-session-et-jeton) | Le jeton d'identité est un JWT, avec la même vigilance de validation |
| [4.8 Authentification unique](#48-authentification-unique) | OIDC est l'une des deux façons de réaliser le SSO |
| [4.11 SAML](#411-saml) | SAML est l'alternative à base d'assertions XML |
| [4.12 SCIM](#412-scim) | SCIM complète la connexion par le provisionnement |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration du fournisseur est propre à chaque tenant |

### 5. Application pratique

**Situation initiale.** Une compagnie veut que ses techniciens se connectent à la plateforme avec leur compte d'entreprise, pour avoir un second facteur uniforme.

**Problème.** La plateforme doit accepter l'identité d'un fournisseur extérieur, de façon sûre, et rattacher chaque personne à un utilisateur existant.

**Application du concept.** Configuration d'un fournisseur OIDC pour le tenant, avec correspondance sur (`iss`, `sub`).

**Déroulé.**

1. L'administrateur renseigne l'adresse de découverte du fournisseur et l'identifiant client.
2. La plateforme lit la configuration et les clés publiques.
3. Un technicien se connecte : le jeton d'identité est validé (signature, émetteur, destinataire, expiration, nonce).
4. La plateforme retrouve l'utilisateur par (`iss`, `sub`) ou en crée un.
5. Elle contrôle `amr` pour confirmer le second facteur exigé.

**Résultat.** L'identité est fédérée, le second facteur de l'entreprise s'applique, et les comptes ne dépendent pas des adresses électroniques.

**Limites.** Si le fournisseur change de clés ou de domaine, la configuration doit suivre. La plateforme doit surveiller les erreurs de validation de jeton pour détecter ces cas.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient le jeton d'identité ?
2. **Compréhension.** À qui est destiné le jeton d'identité, et à qui le jeton d'accès ?
3. **Compréhension.** Que fait le périmètre `openid` ?
4. **Pourquoi.** Pourquoi identifie-t-on l'utilisateur par (`iss`, `sub`) plutôt que par son adresse ?
5. **Raisonnement pratique.** Une API accepte les jetons d'identité comme preuve d'accès. Quel est le risque ?

#### Réponses

1. Des revendications sur l'authentification et l'utilisateur : émetteur, sujet, destinataire, dates, nonce, et éventuellement adresse et méthodes d'authentification.
2. Le jeton d'identité est destiné au client. Le jeton d'accès est destiné à l'API.
3. Il active OpenID Connect : le serveur renvoie alors un jeton d'identité en plus des jetons OAuth.
4. Parce que l'adresse peut changer, être réattribuée ou ne pas être vérifiée, alors que le couple est stable et propre au fournisseur.
5. Un jeton d'identité émis pour une autre application peut être rejoué contre l'API, qui n'a pas vérifié qu'il lui est destiné. Il faut n'accepter que des jetons d'accès émis pour cette API.

## 4.11 SAML

### 1. Comprendre simplement

**SAML** (*Security Assertion Markup Language*) 2.0 est un standard qui permet à un fournisseur d'identité de transmettre à une application, sous forme de **document XML signé**, l'affirmation que l'utilisateur est bien authentifié, avec quelques informations sur lui. C'est le protocole de SSO historique des entreprises.

**Pourquoi cela existe.** Dans les années 2000, les entreprises voulaient relier leurs annuaires à leurs applications web de façon standard. SAML a répondu à ce besoin avant l'arrivée d'OAuth et d'OpenID Connect, et il est resté très répandu dans les grands comptes.

**Problème résolu.** Permettre à une organisation de faire accéder ses employés à des applications externes avec ses propres identifiants, sans partager de mots de passe.

**Modèle mental.** Une lettre officielle avec un cachet. Le fournisseur d'identité écrit la lettre « cette personne est bien Mathilde Durand », y appose son cachet, et c'est l'utilisateur lui-même qui la porte à l'application.

**Où l'analogie s'arrête.** Une lettre cachetée peut être photocopiée et présentée plus tard. Une assertion SAML porte des conditions de validité (destinataire, date) que l'application doit vérifier.

**Exemple.** Un employé clique sur la plateforme dans le portail de l'entreprise. Son navigateur transporte une assertion signée vers la plateforme, qui crée sa session.

**Les composants.**

1. un **fournisseur d'identité** (IdP) et un **fournisseur de service** (SP) ;
2. une **assertion** signée ;
3. des **métadonnées** échangées ;
4. des **liaisons** (*bindings*) qui décrivent le transport.

**Objectif d'apprentissage :** vous pouvez décrire une assertion SAML et dire quelles vérifications l'application doit faire.

### 2. Connaissances essentielles

#### Définition

**SAML 2.0**, standard de l'OASIS publié en 2005, définit un format XML d'**assertions** et des protocoles pour échanger des informations d'authentification et d'attributs entre un fournisseur d'identité et un fournisseur de service.

#### Idées fondamentales

1. **L'assertion est un document signé.** La signature prouve l'origine et l'intégrité.
2. **Le navigateur transporte l'assertion.** Le fournisseur de service n'appelle pas directement l'IdP.
3. **La confiance se configure par métadonnées.** Identifiants d'entité, adresses, certificats.
4. **L'assertion porte des conditions.** Destinataire, validité dans le temps.
5. **Les attributs servent à créer ou mettre à jour le compte.** Adresse, nom, groupes.
6. **Les certificats expirent.** Leur renouvellement est un événement d'exploitation à planifier.

#### Vocabulaire essentiel

- **Assertion** : document XML signé qui contient l'identité et des attributs.
- **Identifiant d'entité** (*entity ID*) : identifiant unique d'un IdP ou d'un SP.
- **Service de consommation d'assertions** (*Assertion Consumer Service*, *ACS*) : adresse où le SP reçoit l'assertion.
- **Métadonnées** (*metadata*) : document qui décrit une entité (adresses, certificats).
- **`NameID`** : identifiant du sujet dans l'assertion.
- **Liaison** (*binding*) : mode de transport (redirection HTTP, formulaire POST).
- **Initié par le SP** et **initié par l'IdP** : qui démarre le processus de connexion.

#### Relations de cause à effet

- Le fournisseur de service ne vérifie pas la signature correctement. Un attaquant forge une assertion et se connecte sous n'importe quelle identité.
- Le certificat de signature expire sans avoir été remplacé. Tous les utilisateurs du tenant perdent l'accès.
- Le destinataire (`Audience`) n'est pas contrôlé. Une assertion émise pour une autre application est acceptée.

#### Idées reçues

- **« SAML est dépassé. »** Il est plus ancien qu'OpenID Connect, mais très présent dans les entreprises. Une plateforme qui vise les grands comptes doit généralement le prendre en charge.
- **« Signer la réponse suffit. »** Pas toujours. Selon les configurations, il faut vérifier la signature de l'assertion elle-même, et se protéger contre l'ajout d'éléments non signés.
- **« SAML fait de l'autorisation fine. »** Il transporte des attributs ; la décision d'accès reste dans l'application.

#### Principe clé

Une assertion SAML n'est digne de confiance que si l'application vérifie sa signature, son émetteur, son destinataire et sa validité dans le temps.

#### Si vous ne retenez que trois choses

1. SAML transporte l'identité par une assertion XML signée, via le navigateur.
2. L'application doit vérifier signature, émetteur, destinataire et dates.
3. Les certificats ont une durée de vie : leur renouvellement doit être planifié.

### 3. Explication technique détaillée

#### Le déroulement initié par le fournisseur de service

```text
Utilisateur            Fournisseur de service (SP)          Fournisseur d'identité (IdP)
    │ 1. accède ───────────────►│                                    │
    │ ◄── 2. redirection avec une demande d'authentification ────────┤
    │ 3. suit la redirection ─────────────────────────────────────►  │
    │ 4. s'authentifie (MFA…) ────────────────────────────────────►  │
    │ ◄── 5. formulaire POST contenant la réponse SAML signée ───────┤
    │ 6. soumet vers l'ACS du SP ───►│
    │                                │ 7. vérifie signature et conditions
    │ ◄── 8. session ouverte ────────┤
```

#### Le contenu d'une assertion

```xml
<Assertion>
  <Issuer>https://idp.compagnie.example</Issuer>
  <Subject>
    <NameID>mathilde.durand@compagnie.example</NameID>
  </Subject>
  <Conditions NotBefore="2026-10-13T08:00:00Z" NotOnOrAfter="2026-10-13T08:05:00Z">
    <AudienceRestriction>
      <Audience>https://platform.example/saml/metadata</Audience>
    </AudienceRestriction>
  </Conditions>
  <AuthnStatement AuthnInstant="2026-10-13T08:00:00Z"/>
  <AttributeStatement>
    <Attribute Name="groups"><AttributeValue>planners</AttributeValue></Attribute>
  </AttributeStatement>
  <Signature>...</Signature>
</Assertion>
```

**Comment la lire.** L'émetteur, le sujet et la fenêtre de validité sont signés. `Audience` indique l'application destinataire. `AuthnStatement` dit quand l'authentification a eu lieu. Les attributs transportent les groupes.

#### Les vérifications obligatoires

1. **signature** valide, avec le certificat du fournisseur configuré pour ce tenant ;
2. **émetteur** (`Issuer`) conforme à la configuration ;
3. **destinataire** (`Audience`) égal à l'identifiant de la plateforme ;
4. **fenêtre de validité** (`NotBefore`, `NotOnOrAfter`), avec une petite tolérance d'horloge ;
5. **réponse attendue** (`InResponseTo`) pour contrer le rejeu ;
6. **adresse de réception** (`Recipient`) conforme à l'ACS.

#### Comparaison avec OpenID Connect

| Critère | SAML 2.0 | OpenID Connect |
|---|---|---|
| Format | XML signé | JSON et JWT |
| Transport | Navigateur (redirection, POST) | Redirections et appels HTTP |
| Âge et usage | 2005, entreprises | 2014, applications web et mobiles |
| Mobile et API | Peu adapté | Adapté |
| Complexité de mise en œuvre | Élevée (XML, signatures) | Plus simple |

#### La configuration par tenant

Un tenant fournit ses **métadonnées** ou les saisit : identifiant d'entité de l'IdP, adresse de connexion, certificat de signature. La plateforme fournit les siennes : identifiant d'entité, ACS. Une fonction de **test de connexion** est indispensable pour limiter les erreurs.

**Modes de défaillance.**

- **Contournement de signature par encapsulation** : une assertion légitime est enveloppée avec des éléments forgés. Les bibliothèques à jour et un contrôle strict de la structure sont nécessaires.
- **Certificat expiré** : prévoir la publication de deux certificats pendant la rotation.
- **Décalage d'horloge** : des assertions refusées à tort.
- **Format de `NameID` incohérent** : le même utilisateur apparaît sous deux identifiants.

**Contre-exemple.** Accepter n'importe quelle assertion signée par un certificat inclus dans l'assertion elle-même. Un attaquant signe avec son propre certificat, et l'application l'accepte.

**Limites.** Les bibliothèques SAML sont complexes, et leurs failles historiques sont nombreuses. Il vaut mieux utiliser une bibliothèque éprouvée ou un service d'identité plutôt qu'une implémentation maison.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.8 Authentification unique](#48-authentification-unique) | SAML est l'une des deux réalisations du SSO |
| [4.10 OpenID Connect](#410-openid-connect) | OpenID Connect en est l'alternative moderne |
| [4.12 SCIM](#412-scim) | SCIM provisionne les comptes que SAML connecte |
| [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée) | Les attributs d'assertion alimentent la correspondance de rôles |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration SAML est propre à chaque tenant |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les certificats de signature relèvent de la gestion des secrets |

### 5. Application pratique

**Situation initiale.** Une grande compagnie exige SAML : c'est le seul protocole que sa direction informatique accepte pour ses applications externes.

**Problème.** La plateforme doit accepter une assertion venant d'un IdP que ses équipes ne contrôlent pas.

**Application du concept.** Configuration SAML par tenant, avec échange de métadonnées, test de connexion et correspondance des groupes.

**Déroulé.**

1. L'administrateur de la compagnie importe les métadonnées de la plateforme dans son IdP.
2. Il fournit l'identifiant d'entité, l'adresse de connexion et le certificat de l'IdP.
3. Il définit la correspondance : le groupe `planners` donne le rôle « Planificateur ».
4. Un test de connexion vérifie la chaîne complète.
5. L'obligation SSO est activée pour le domaine.

**Résultat.** Les employés se connectent par leur portail d'entreprise, avec des rôles issus de l'annuaire.

**Limites.** Le renouvellement du certificat de l'IdP, tous les un à trois ans selon les politiques, doit être anticipé : à défaut, tous les utilisateurs perdent l'accès au jour de l'expiration.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une assertion SAML ?
2. **Compréhension.** Citez trois vérifications que le fournisseur de service doit effectuer.
3. **Compréhension.** Quelle est la différence de format entre SAML et OpenID Connect ?
4. **Pourquoi.** Pourquoi vérifie-t-on le destinataire (`Audience`) ?
5. **Raisonnement pratique.** Tous les utilisateurs d'un tenant ne peuvent plus se connecter un matin, sans changement de la plateforme. Quelle cause probable examinez-vous ?

#### Réponses

1. Un document XML signé par le fournisseur d'identité, qui affirme l'identité de l'utilisateur et transporte des attributs et des conditions de validité.
2. Par exemple : la signature, l'émetteur, le destinataire, la fenêtre de validité.
3. SAML utilise des assertions XML signées ; OpenID Connect utilise des jetons JWT en JSON.
4. Pour qu'une assertion émise pour une autre application ne soit pas acceptée par la plateforme.
5. L'expiration du certificat de signature de l'IdP, ou une rotation de certificat non reportée dans la configuration du tenant.

## 4.12 SCIM

### 1. Comprendre simplement

**SCIM** (*System for Cross-domain Identity Management*) est un protocole standard qui permet à l'annuaire d'une entreprise de **créer, modifier et désactiver automatiquement** les comptes des utilisateurs et des groupes dans les applications qu'elle utilise.

**Pourquoi cela existe.** Le SSO gère la **connexion**, pas le **cycle de vie** des comptes. Sans automatisation, les administrateurs doivent créer les comptes à la main dans chaque application, et surtout penser à les retirer au départ d'une personne.

**Problème résolu.** Garder les comptes des applications synchronisés avec l'annuaire de l'entreprise, en particulier lors des arrivées, des mutations et des départs.

**Modèle mental.** Le service des ressources humaines qui envoie à chaque service de l'entreprise la liste des entrées, mutations et sorties, au lieu d'attendre que chacun s'en aperçoive.

**Où l'analogie s'arrête.** Un courrier des ressources humaines est lu par une personne. SCIM est une interface automatique : des erreurs de configuration provoquent des suppressions massives sans personne pour s'en apercevoir.

**Exemple.** Un technicien est embauché : il apparaît dans l'annuaire, et son compte est créé dans la plateforme avec le bon groupe. Quand il quitte l'entreprise, son compte est désactivé dans les minutes qui suivent.

**Les composants.**

1. un **client SCIM** (l'annuaire ou le fournisseur d'identité) ;
2. un **serveur SCIM** (la plateforme) ;
3. des **ressources** `Users` et `Groups` ;
4. des **opérations** HTTP standard.

**Objectif d'apprentissage :** vous pouvez décrire les opérations SCIM et dire pourquoi la désactivation automatique est son apport principal en sécurité.

### 2. Connaissances essentielles

#### Définition

**SCIM 2.0** (RFC 7642, RFC 7643 et RFC 7644) est un standard d'interface REST et de schéma JSON pour gérer, entre un fournisseur d'identité et une application, le cycle de vie des identités : création, lecture, modification, désactivation et suppression.

#### Idées fondamentales

1. **L'annuaire est la source de vérité.** La plateforme reflète ses changements.
2. **Les opérations sont standardisées.** Création, lecture, remplacement, modification partielle, suppression.
3. **La désactivation est l'apport clé.** Un départ retire l'accès sans intervention manuelle.
4. **Les groupes se synchronisent aussi.** Ils servent à attribuer des rôles.
5. **Chaque tenant a ses propres paramètres.** Adresse de l'interface SCIM et jeton d'accès.
6. **La synchronisation demande réconciliation.** Des écarts peuvent apparaître et doivent être détectés.

#### Vocabulaire essentiel

- **`Users`** et **`Groups`** : ressources principales de SCIM.
- **`userName`** : nom de connexion du compte.
- **`externalId`** : identifiant du compte dans l'annuaire source.
- **`active`** : état d'activité du compte.
- **Filtre** (*filter*) : expression pour rechercher (`userName eq "..."`).
- **Opération de modification** (*PATCH operation*) : changement partiel d'une ressource.
- **Réconciliation** (*reconciliation*) : comparaison entre l'annuaire et l'application pour corriger les écarts.

#### Relations de cause à effet

- La désactivation est automatique. Un employé qui part perd l'accès dans la plateforme sans attendre qu'un administrateur y pense.
- L'annuaire envoie une suppression par erreur de configuration. Des centaines de comptes peuvent être supprimés d'un coup si la plateforme ne prévoit pas de garde-fous.
- La plateforme et l'annuaire attribuent des rôles chacun de leur côté. Les rôles divergent, et il faut décider qui fait foi.

#### Idées reçues

- **« SCIM remplace le SSO. »** Non. SCIM crée et supprime les comptes. Le SSO les authentifie.
- **« Désactiver et supprimer, c'est la même chose. »** Non. On désactive (`active = false`) pour conserver l'historique ; la suppression est une décision distincte.
- **« SCIM gère les droits fins. »** Il peut transporter des groupes, que la plateforme relie à des rôles. Les permissions détaillées restent propres à la plateforme.

#### Principe clé

Le SSO ouvre la porte, SCIM tient à jour la liste des personnes qui ont le droit d'y entrer, et en particulier retire celles qui n'y ont plus droit.

#### Si vous ne retenez que trois choses

1. SCIM synchronise les utilisateurs et les groupes depuis l'annuaire vers la plateforme.
2. Sa valeur principale est la désactivation automatique des comptes au départ.
3. L'annuaire fait foi, et la synchronisation doit être réconciliée et protégée contre les erreurs.

### 3. Explication technique détaillée

#### Les opérations

| Besoin | Requête | Exemple |
|---|---|---|
| Créer un utilisateur | `POST /scim/v2/Users` | Arrivée d'un employé |
| Rechercher | `GET /scim/v2/Users?filter=userName eq "…"` | Vérifier l'existence |
| Remplacer | `PUT /scim/v2/Users/{id}` | Mise à jour complète |
| Modifier | `PATCH /scim/v2/Users/{id}` | Changement de service |
| Désactiver | `PATCH` avec `active = false` | Départ |
| Supprimer | `DELETE /scim/v2/Users/{id}` | Suppression définitive |

#### Un utilisateur SCIM

```http
POST /scim/v2/Users HTTP/1.1
Authorization: Bearer <jeton SCIM propre au tenant>
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "externalId": "E-10492",
  "userName": "mathilde.durand@compagnie.example",
  "name": { "givenName": "Mathilde", "familyName": "Durand" },
  "emails": [{ "value": "mathilde.durand@compagnie.example", "primary": true }],
  "active": true
}
```

#### La désactivation au départ

```http
PATCH /scim/v2/Users/u_42 HTTP/1.1
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [ { "op": "replace", "path": "active", "value": false } ]
}
```

**Ce que la plateforme fait.** Elle passe l'utilisateur à l'état désactivé, révoque ses sessions et ses jetons, conserve son historique, et réaffecte ses tâches ouvertes si une règle le prévoit (voir [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer)).

#### Les groupes et les rôles

L'annuaire pousse des groupes (par exemple `planners`). La plateforme les associe à des rôles par une table de correspondance gérée par l'administrateur du tenant.

```text
Groupe de l'annuaire     Rôle de la plateforme
planners            ──►  Planificateur
technicians-lys     ──►  Technicien (base de Lyon)
```

#### Précautions

- **Authentification** par jeton propre au tenant, révocable.
- **Idempotence** : une création répétée pour le même `externalId` ne crée pas de doublon (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- **Garde-fous** : alerte ou blocage si une synchronisation demande de supprimer une grande proportion des comptes.
- **Réconciliation périodique** entre l'annuaire et la plateforme.
- **Clarté de la source de vérité** pour les rôles : annuaire ou plateforme.

**Contre-exemple.** Une plateforme qui, à réception de `DELETE` pour un utilisateur, supprime physiquement toutes ses données et ses actions passées. L'historique d'audit devient illisible, et une erreur de l'annuaire est irréversible.

**Limites.** Les implémentations de SCIM varient d'un fournisseur d'identité à l'autre : certains attributs, la manière de signaler les groupes ou le comportement des filtres diffèrent. Des tests avec les fournisseurs les plus courants sont nécessaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.8 Authentification unique](#48-authentification-unique) | SCIM complète le SSO par le cycle de vie des comptes |
| [4.2 Utilisateur, groupe, équipe et organisation](#42-utilisateur-groupe-équipe-et-organisation) | Il synchronise utilisateurs et groupes |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Il réalise le provisionnement et le déprovisionnement des utilisateurs |
| [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer) | La réaffectation des tâches au départ s'appuie sur le transfert |
| [4.14 RBAC](#414-rbac) | Les groupes synchronisés sont reliés à des rôles |
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | Il est un cas particulier de synchronisation entre systèmes |

### 5. Application pratique

**Situation initiale.** La compagnie a 2 000 employés, avec une dizaine de départs ou de mutations par mois. Les comptes sont gérés manuellement.

**Problème.** Des comptes d'anciens employés restent actifs pendant des semaines.

**Application du concept.** L'administrateur active SCIM entre l'annuaire et la plateforme.

**Déroulé.**

1. Il génère un jeton SCIM dans la plateforme et le saisit dans l'annuaire.
2. Il configure la correspondance entre groupes de l'annuaire et rôles.
3. Une première synchronisation crée les comptes manquants et signale les écarts.
4. Quand un employé quitte l'entreprise, l'annuaire envoie `active = false`.
5. La plateforme désactive le compte, révoque ses jetons et transfère ses tâches.

**Résultat.** Un départ est reflété en quelques minutes, sans action manuelle.

**Limites.** Si l'annuaire est mal configuré, la plateforme peut recevoir une vague de désactivations. Un seuil d'alerte protège contre ce cas.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quoi sert SCIM par rapport au SSO ?
2. **Compréhension.** Comment désactive-t-on un utilisateur par SCIM ?
3. **Compréhension.** Pourquoi distingue-t-on désactivation et suppression ?
4. **Pourquoi.** Pourquoi la désactivation automatique est-elle son principal apport en sécurité ?
5. **Raisonnement pratique.** L'annuaire envoie 600 suppressions d'un coup sur un tenant de 2 000 comptes. Que doit faire la plateforme ?

#### Réponses

1. Le SSO authentifie les utilisateurs ; SCIM crée, met à jour et désactive leurs comptes pour qu'ils reflètent l'annuaire.
2. Par une requête de modification qui passe l'attribut `active` à `false`.
3. La désactivation retire l'accès en conservant l'historique et en permettant une réactivation ; la suppression efface définitivement.
4. Parce qu'elle retire l'accès d'un employé qui part dès le départ, sans dépendre de la vigilance d'un administrateur.
5. Appliquer un garde-fou : suspendre le traitement, alerter l'administrateur du tenant et demander une confirmation, plutôt que d'exécuter une suppression massive probablement erronée.

## 4.13 Permission, rôle, politique et portée

### 1. Comprendre simplement

Quatre mots forment le vocabulaire de base de l'autorisation. Une **permission** est un droit précis : « modifier un aéronef ». Un **rôle** est un paquet de permissions qui correspond à une fonction : « planificateur ». Une **politique** est une règle qui décide d'un accès, éventuellement sous conditions. Une **portée** délimite l'étendue d'un droit : « sur la base de Lyon seulement ».

**Pourquoi cela existe.** Pour décider de façon cohérente et auditable, il faut nommer précisément ce qui est permis, à qui, et jusqu'où. Sans vocabulaire commun, chaque développeur invente sa propre logique.

**Problème résolu.** Exprimer des règles d'accès de façon structurée, lisible par les administrateurs et exécutable par le moteur.

**Modèle mental.**

- *La permission* est une clé qui ouvre une serrure précise.
- *Le rôle* est un trousseau remis pour une fonction.
- *La politique* est le règlement qui dit qui peut utiliser quelle clé, quand et où.
- *La portée* indique quelle zone du bâtiment le trousseau ouvre.

**Où l'analogie s'arrête.** Une clé physique ne tient pas compte du contexte. Une politique peut dépendre de l'heure, de l'état de la ressource ou de la relation entre la personne et la ressource.

**Exemple.** Le rôle « planificateur » contient les permissions `aircraft:read` et `aircraft:update`. Il est attribué à Mathilde avec la portée « base de Lyon ».

**Attention au mot « portée » (*scope*).** Il a deux sens : la portée d'un jeton OAuth (voir [4.9 OAuth 2.0](#49-oauth-20)) et l'étendue sur laquelle un rôle est attribué. Ce parcours précise « périmètre de jeton » et « portée d'attribution » quand le contexte ne suffit pas.

**Objectif d'apprentissage :** vous pouvez distinguer permission, rôle, politique et portée, et formuler une attribution complète.

### 2. Connaissances essentielles

#### Définition

- **Permission** : autorisation d'effectuer une action sur un type de ressource (par exemple `aircraft:update`).
- **Rôle** : ensemble nommé de permissions, qui traduit une fonction ou une responsabilité.
- **Politique** (*policy*) : règle déclarative qui détermine si une action est permise ou refusée, éventuellement sous conditions.
- **Portée d'attribution** : étendue (tenant, organisation, base, sous-arbre de ressources) sur laquelle un droit ou un rôle s'applique.

#### Idées fondamentales

1. **Une permission combine une action et un type de ressource.** Elle est la plus petite unité d'autorisation.
2. **Le rôle regroupe pour simplifier.** On attribue un rôle, non des dizaines de permissions.
3. **Une attribution a trois éléments.** Un sujet, un rôle, une portée.
4. **Une politique peut ajouter des conditions.** Elle va au-delà de la simple appartenance à un rôle.
5. **Le refus est la valeur par défaut.** Un refus explicite l'emporte sur une autorisation.
6. **Les droits d'usage du tenant s'ajoutent.** Une action exige permission et droit d'usage (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)).

#### Vocabulaire essentiel

- **Sujet** (*subject*) : qui agit.
- **Action** (*action*) : ce qui est tenté (`read`, `update`, `approve`).
- **Ressource** (*resource*) : sur quoi.
- **Effet** (*effect*) : autoriser (*allow*) ou refuser (*deny*).
- **Condition** (*condition*) : contrainte supplémentaire (heure, attribut, état).
- **Attribution** (*assignment*, *grant*) : lien entre un sujet, un rôle et une portée.
- **Refus par défaut** (*default deny*) : sans règle qui autorise, l'accès est refusé.

#### Relations de cause à effet

- Les permissions sont trop générales (« tout modifier »). Les rôles deviennent trop larges, et le moindre privilège est impossible.
- Les rôles sont attribués sans portée. Un planificateur d'une base a les droits sur toutes les bases.
- Aucun refus explicite n'est possible. Impossible de retirer un droit hérité sans réorganiser les rôles.

#### Idées reçues

- **« Un rôle, c'est un titre de poste. »** Pas exactement. Un rôle est un ensemble de permissions utiles à une fonction ; un titre peut en nécessiter plusieurs, et un rôle peut servir à plusieurs titres.
- **« Un rôle contient des utilisateurs. »** Non : un **groupe** contient des utilisateurs. Un rôle contient des permissions.
- **« Une politique est la même chose qu'un rôle. »** Un rôle est un cas particulier simple de politique. Les politiques peuvent exprimer des conditions que les rôles n'expriment pas.

#### Principe clé

Une autorisation précise se lit : *quel sujet, avec quel rôle, sur quelle portée, peut faire quelle action, sur quelle ressource, sous quelles conditions*.

#### Si vous ne retenez que trois choses

1. Une permission est une action sur un type de ressource ; un rôle est un paquet de permissions.
2. Une attribution relie un sujet, un rôle et une portée.
3. Une politique peut ajouter des conditions, et le refus est la valeur par défaut.

### 3. Explication technique détaillée

#### Nommer les permissions

Une convention courante est `type:action`.

| Permission | Sens |
|---|---|
| `aircraft:read` | Lire un aéronef |
| `aircraft:update` | Modifier un aéronef |
| `aircraft:archive` | Archiver un aéronef |
| `task:approve` | Approuver une tâche |
| `role:assign` | Attribuer un rôle |

**Pourquoi.** La convention rend les permissions lisibles, filtrables et générables : un nouveau type de ressource crée automatiquement ses permissions standard.

#### Les rôles et leurs attributions

```text
Rôle « Planificateur » = { aircraft:read, aircraft:update, task:create, task:assign }
Rôle « Technicien »    = { aircraft:read, task:read, finding:create }
Rôle « Auditeur »      = { aircraft:read, task:read, audit:read }

Attribution : (Mathilde, Planificateur, portée = base LYS)
              (Karim,    Technicien,    portée = base TLS)
```

#### La portée d'attribution

| Portée | Signification |
|---|---|
| Tenant | Tout le tenant |
| Organisation | Une organisation ou filiale |
| Base ou emplacement | Un lieu et ses sous-éléments |
| Ressource | Une ressource précise |

**Calcul.** Un droit sur `aircraft:update` est accordé si le sujet a une attribution dont le rôle contient cette permission et dont la portée **contient** la ressource visée.

#### Une politique avec conditions

```json
{
  "effect": "allow",
  "actions": ["aircraft:update"],
  "resources": ["aircraft/*"],
  "conditions": [
    { "left": "resource.base", "op": "eq", "right": "subject.base" },
    { "left": "resource.status", "op": "ne", "right": "retired" }
  ]
}
```

**Comment la lire.** Un sujet peut modifier un aéronef de sa propre base, sauf s'il est retiré du service. Ce sont des conditions sur les attributs : on entre dans le domaine de l'ABAC (voir [4.16 ABAC](#416-abac)).

#### L'évaluation

```text
1. Réunir les règles qui s'appliquent (attributions, politiques, héritage)
2. Si une règle de refus explicite correspond  ─► refuser
3. Sinon, si une règle d'autorisation correspond ─► autoriser
4. Sinon ─► refuser (par défaut)
```

**Cette ordonnance** (le refus explicite l'emporte, puis l'autorisation, puis le refus par défaut) est une convention répandue, pas une règle universelle. Elle doit être explicite dans la documentation de la plateforme.

#### Modes de défaillance

- **Explosion de permissions** : une permission par champ ou par écran, ingérable.
- **Rôles « fourre-tout »** : un rôle « Administrateur » qui a tout et qu'on attribue par commodité.
- **Portée oubliée** : rôle attribué sans limite par défaut.
- **Permissions dans le code** : liste codée en dur, impossible à configurer.

**Contre-exemple.** Une permission unique `manage` qui couvre créer, modifier, archiver et supprimer. On ne peut plus donner à quelqu'un le droit de modifier sans celui de supprimer.

**Limites.** Un vocabulaire riche est puissant mais doit rester compréhensible : un administrateur qui doit manier trois cents permissions fait des erreurs. L'interface doit les regrouper et les expliquer (voir [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac) | RBAC est le modèle fondé sur les rôles |
| [4.16 ABAC](#416-abac) | ABAC étend les politiques avec des attributs |
| [4.18 PBAC](#418-pbac) | PBAC met l'accent sur l'externalisation des politiques |
| [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles) | L'héritage et la hiérarchie de rôles prolongent la portée |
| [4.9 OAuth 2.0](#49-oauth-20) | Le périmètre de jeton est un autre sens de « portée » |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les droits d'usage du tenant complètent les permissions |

### 5. Application pratique

**Situation initiale.** La plateforme doit permettre aux planificateurs de Lyon et de Toulouse de modifier les aéronefs de leur base, sans voir ceux de l'autre.

**Problème.** Créer un rôle par base multiplierait les rôles ; un rôle sans portée donnerait accès à tout.

**Application du concept.** Un seul rôle « Planificateur », attribué avec une portée de base.

**Déroulé.**

1. L'administrateur définit le rôle avec ses permissions.
2. Il attribue (Mathilde, Planificateur, LYS) et (Karim, Planificateur, TLS).
3. Mathilde demande `aircraft:update` sur un aéronef de Toulouse.
4. Le moteur trouve son attribution, vérifie que la portée LYS ne contient pas cet aéronef, et refuse.

**Résultat.** Un seul rôle suffit pour toutes les bases, et l'isolation par base est respectée.

**Limites.** Si un planificateur doit couvrir deux bases temporairement, il faut une seconde attribution, avec une date de fin.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une permission et un rôle ?
2. **Compréhension.** Que contient une attribution ?
3. **Compréhension.** Quels sont les deux sens du mot « portée » ?
4. **Pourquoi.** Pourquoi le refus est-il la valeur par défaut ?
5. **Raisonnement pratique.** Comment éviter de créer un rôle par base ?

#### Réponses

1. Une permission est une action sur un type de ressource ; un rôle est un ensemble nommé de permissions.
2. Un sujet, un rôle et une portée.
3. Le périmètre d'un jeton OAuth (ce que le jeton permet) et la portée d'attribution (l'étendue sur laquelle un rôle s'applique).
4. Parce qu'une règle manquante ou oubliée ne doit jamais ouvrir un accès : il vaut mieux refuser à tort que d'autoriser à tort.
5. En attribuant le même rôle avec des portées différentes (une par base), au lieu de définir un rôle par base.

## 4.14 RBAC

### 1. Comprendre simplement

Le **RBAC** (*Role-Based Access Control*, contrôle d'accès fondé sur les rôles) donne aux utilisateurs des **rôles**, et aux rôles des **permissions**. On n'attribue jamais une permission directement à une personne : on lui attribue un rôle.

**Pourquoi cela existe.** Gérer les droits personne par personne ne passe pas à l'échelle. Les rôles reflètent des fonctions stables de l'organisation : on change le rôle d'une personne quand sa fonction change, et on modifie les droits d'un rôle une fois pour tous ses titulaires.

**Problème résolu.** Administrer simplement et de façon auditable les accès de nombreuses personnes, avec des droits cohérents pour une même fonction.

**Modèle mental.** Les uniformes d'un hôpital. Chaque fonction (infirmière, chirurgien, agent d'accueil) a ses accès. Une personne qui change de fonction change de tenue et d'accès.

**Où l'analogie s'arrête.** Un uniforme est visible et unique. Un utilisateur peut cumuler plusieurs rôles, dans des périmètres différents, sans que cela se voie.

**Exemple.** Les rôles « Planificateur », « Technicien » et « Auditeur » donnent chacun un ensemble de permissions. Mathilde est planificatrice.

**Les composants.**

1. des **utilisateurs** (ou des groupes) ;
2. des **rôles** ;
3. des **permissions** ;
4. des **attributions** (utilisateur–rôle) et des **affectations** (rôle–permission).

**Objectif d'apprentissage :** vous pouvez décrire le modèle RBAC, citer ses avantages et expliquer l'explosion de rôles.

### 2. Connaissances essentielles

#### Définition

Le **RBAC** est un modèle de contrôle d'accès dans lequel les permissions sont associées à des rôles et les rôles aux utilisateurs. Le modèle de référence a été formalisé par le NIST (Ferraiolo et Kuhn), puis normalisé dans la norme ANSI INCITS 359-2004.

#### Idées fondamentales

1. **Deux relations.** Utilisateur vers rôle, rôle vers permission.
2. **Les rôles correspondent à des fonctions.** Ils sont stables, nommés en termes métier.
3. **L'administration est simple.** Changer un rôle met à jour tous ses titulaires.
4. **L'audit est lisible.** « Qui a le rôle X ? » et « que permet le rôle X ? ».
5. **Le modèle a des niveaux.** Rôles de base, hiérarchies, contraintes de séparation des tâches.
6. **La limite est l'explosion de rôles.** Quand on veut du contexte, le nombre de rôles croît.

#### Vocabulaire essentiel

- **Rôle** (*role*) : fonction ou responsabilité associée à des permissions.
- **Attribution de rôle** (*role assignment*) : lien utilisateur–rôle.
- **Hiérarchie de rôles** (*role hierarchy*) : un rôle hérite des permissions d'un autre (voir [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles)).
- **Contrainte de séparation des tâches** (*separation of duty*) : rôles incompatibles (voir [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches)).
- **Explosion de rôles** (*role explosion*) : multiplication des rôles pour couvrir les contextes.
- **Exploration de rôles** (*role mining*) : déduction de rôles à partir des droits existants.
- **Accumulation de droits** (*privilege creep*) : droits qui s'ajoutent au fil des changements de poste.

#### Relations de cause à effet

- Les rôles reflètent des fonctions. Un changement de poste devient un changement de rôle, et non une revue de dizaines de droits.
- On encode la base et le niveau d'habilitation dans le nom du rôle. Le nombre de rôles devient le produit des combinaisons.
- Les rôles ne sont jamais revus. Les personnes accumulent des rôles et des droits dont elles n'ont plus besoin.

#### Idées reçues

- **« RBAC suffit pour tous les cas. »** Non. Dès que la décision dépend de l'état de la ressource ou de la relation entre la personne et la ressource, il faut y ajouter des attributs ou des relations.
- **« Plus il y a de rôles, mieux on contrôle. »** Non. Trop de rôles rendent le modèle incompréhensible et mal tenu.
- **« Un rôle est attribué une fois pour toutes. »** Non. Les attributions doivent être revues régulièrement et, pour certaines, bornées dans le temps.

#### Principe clé

Définissez des rôles par fonction, en nombre limité, et exprimez le contexte par la portée d'attribution plutôt que par de nouveaux rôles.

#### Si vous ne retenez que trois choses

1. RBAC attribue des permissions à des rôles et des rôles à des utilisateurs.
2. Il est simple à administrer et à auditer, mais statique et sans contexte.
3. Pour éviter l'explosion de rôles, utilisez la portée d'attribution et complétez par des attributs.

### 3. Explication technique détaillée

#### Le modèle de données

```sql
CREATE TABLE role (
  tenant_id uuid NOT NULL,
  id        uuid NOT NULL,
  name      text NOT NULL,
  is_system boolean NOT NULL DEFAULT false,
  PRIMARY KEY (tenant_id, id)
);

CREATE TABLE role_permission (
  tenant_id  uuid NOT NULL,
  role_id    uuid NOT NULL,
  permission text NOT NULL,          -- par exemple 'aircraft:update'
  PRIMARY KEY (tenant_id, role_id, permission)
);

CREATE TABLE role_assignment (
  tenant_id  uuid NOT NULL,
  user_id    uuid NOT NULL,
  role_id    uuid NOT NULL,
  scope_type text NOT NULL,          -- 'tenant', 'organization', 'location'
  scope_id   uuid,
  expires_at timestamptz,
  PRIMARY KEY (tenant_id, user_id, role_id, scope_type, scope_id)
);
```

#### La vérification

```text
autoriser(utilisateur, permission, ressource) :
    pour chaque attribution A de l'utilisateur, non expirée :
        si permission ∈ permissions(A.rôle)
           et ressource ∈ portée(A) :
            retourner autorisé
    retourner refusé
```

#### Les niveaux du modèle NIST

| Niveau | Contenu |
|---|---|
| RBAC de base (*core*) | Utilisateurs, rôles, permissions, attributions |
| RBAC hiérarchique | Héritage entre rôles |
| Contraintes statiques | Rôles incompatibles pour une même personne |
| Contraintes dynamiques | Rôles incompatibles dans une même session |

#### L'explosion de rôles

Si chaque combinaison de valeurs d'attributs devient un rôle, le nombre de rôles est le produit du nombre de valeurs :

$$N_{\text{rôles}} = \prod_{i=1}^{k} n_i$$

où $k$ est le nombre de dimensions encodées et $n_i$ le nombre de valeurs de la dimension $i$.

**Exemple chiffré.** Avec 10 bases, 6 fonctions et 3 niveaux d'habilitation, on obtient $10 \times 6 \times 3 = 180$ rôles. En gardant 6 rôles de fonction et en exprimant la base par la portée d'attribution et l'habilitation par un attribut, on reste à 6 rôles.

#### Conception des rôles

| Bonne pratique | Raison |
|---|---|
| Nommer par fonction métier | Lisible par les administrateurs |
| Limiter le nombre de rôles | Maintenable et auditable |
| Utiliser la portée plutôt que de dupliquer | Évite l'explosion |
| Prévoir des rôles personnalisés par tenant | Chaque client a ses fonctions |
| Revue périodique des attributions | Évite l'accumulation de droits |

**Contre-exemple.** Un rôle « Super Planificateur Lyon sans export » : il encode une base, un niveau et une exception. Chaque nouvelle exigence produit un nouveau rôle isolé.

**Limites.** RBAC ne sait pas dire « seulement les aéronefs dont l'inspection est en retard » ou « seulement ceux que j'ai créés ». Ces conditions relèvent des attributs (voir [4.16 ABAC](#416-abac)) ou des relations (voir [4.17 ReBAC](#417-rebac)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée) | Le vocabulaire de permission, rôle et portée en est le socle |
| [4.15 ACL](#415-acl) | Les ACL sont le modèle centré sur la ressource |
| [4.16 ABAC](#416-abac) | ABAC ajoute le contexte que RBAC ignore |
| [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles) | La hiérarchie de rôles est une extension standard |
| [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches s'exprime par des contraintes sur les rôles |
| [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès) | L'administration édite rôles, permissions et attributions |

### 5. Application pratique

**Situation initiale.** Une compagnie compte trois fonctions (planificateur, technicien, auditeur) et quatre bases. Elle utilise douze rôles « fonction × base ».

**Problème.** Chaque ajout de base crée trois rôles à maintenir, et les droits divergent d'un rôle à l'autre.

**Application du concept.** On passe à trois rôles de fonction, avec attribution par portée de base.

**Déroulé.**

1. L'administrateur crée les trois rôles et leurs permissions.
2. Il recrée les attributions : (utilisateur, rôle, base).
3. Il supprime les douze anciens rôles.
4. L'ouverture d'une cinquième base ne demande plus de nouveau rôle, seulement de nouvelles attributions.

**Résultat.** Trois rôles à maintenir, des droits cohérents d'une base à l'autre.

**Limites.** La migration doit vérifier que chaque utilisateur conserve exactement ses droits effectifs, et que les exceptions locales de certains anciens rôles sont explicitement traitées.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les deux relations du modèle RBAC ?
2. **Compréhension.** Qu'est-ce que l'explosion de rôles ?
3. **Compréhension.** Citez deux avantages et une limite de RBAC.
4. **Pourquoi.** Pourquoi exprime-t-on la base par une portée d'attribution plutôt que dans le nom du rôle ?
5. **Raisonnement pratique.** Un client demande « un planificateur ne peut modifier que les aéronefs dont l'inspection n'est pas en retard ». RBAC suffit-il ?

#### Réponses

1. Utilisateur vers rôle (attribution), et rôle vers permission (affectation).
2. La multiplication des rôles quand on encode dans leur nom des dimensions de contexte (base, niveau, projet) : leur nombre devient le produit des combinaisons.
3. Avantages : simplicité d'administration, audit lisible. Limite : absence de contexte, et risque d'explosion de rôles.
4. Pour garder un nombre limité de rôles : le contexte est porté par l'attribution, et non par la définition du rôle.
5. Non : la décision dépend d'un attribut de la ressource (état de l'inspection). Il faut une politique avec condition (ABAC) en complément du rôle.

## 4.15 ACL

### 1. Comprendre simplement

Une **ACL** (*Access Control List*, liste de contrôle d'accès) est une **liste attachée à une ressource**, qui indique qui a le droit de faire quoi sur elle : « Mathilde : lecture et modification ; le groupe Auditeurs : lecture ».

**Pourquoi cela existe.** Les rôles décrivent ce qu'une fonction peut faire en général. Mais on a souvent besoin de dire des choses précises sur une ressource donnée : « partager *cette* fiche avec *cette* personne ». L'ACL répond à ce besoin au plus près de la ressource.

**Problème résolu.** Gérer des droits au niveau d'une ressource individuelle, sans créer un rôle par cas particulier.

**Modèle mental.** La liste d'invités à la porte d'une salle. Elle appartient à la salle, et indique qui peut entrer.

**Où l'analogie s'arrête.** Une salle a une liste. Une plateforme a des millions de ressources, chacune avec la sienne : la gestion, l'audit et la recherche (« qu'est-ce que Mathilde peut voir ? ») deviennent difficiles.

**Exemple.** Le rapport confidentiel d'une inspection est partagé avec le responsable qualité et l'autorité, mais pas avec les autres planificateurs, qui ont pourtant le rôle « Planificateur ».

**Les composants.**

1. une **ressource** ;
2. une **liste d'entrées** ;
3. chaque entrée : un **sujet** (utilisateur ou groupe) et des **permissions**.

**Objectif d'apprentissage :** vous pouvez comparer ACL et RBAC, et dire dans quels cas on combine les deux.

### 2. Connaissances essentielles

#### Définition

Une **ACL** est une liste d'entrées associée à une ressource, où chaque entrée désigne un sujet (utilisateur, groupe, rôle) et les permissions qu'il a sur cette ressource.

#### Idées fondamentales

1. **L'ACL est centrée sur la ressource.** Le RBAC est centré sur le sujet.
2. **Elle permet des exceptions précises.** Partager une ressource avec une personne.
3. **Elle peut hériter d'un parent.** Une fiche reprend l'ACL de son dossier.
4. **Elle passe mal à l'échelle.** Beaucoup de ressources, beaucoup d'entrées.
5. **Elle complète les rôles plutôt que de les remplacer.** Les rôles donnent le cadre, les ACL les exceptions.
6. **L'ordre et les refus comptent.** Il faut une règle claire de combinaison.

#### Vocabulaire essentiel

- **Entrée de contrôle d'accès** (*access control entry*, *ACE*) : une ligne de l'ACL.
- **Propriétaire** (*owner*) : celui qui gère l'ACL d'une ressource.
- **Partage** (*sharing*) : ajout d'une entrée pour un autre sujet.
- **Héritage** (*inheritance*) : l'ACL du parent s'applique aux enfants.
- **Bit de permission** : dans Unix, `r`, `w`, `x` pour propriétaire, groupe, autres.
- **Liste de ressources visibles** (*list objects*) : requête « quelles ressources ce sujet peut-il voir ? ».

#### Relations de cause à effet

- Chaque ressource a sa propre liste. L'administration manuelle d'un grand nombre de ressources devient ingérable.
- L'ACL n'est pas héritée du parent. Chaque nouvelle ressource doit être partagée à la main.
- La liste de ressources visibles est calculée en parcourant toutes les ACL. Les écrans de liste ralentissent.

#### Idées reçues

- **« ACL et RBAC s'opposent. »** Non. Beaucoup de plateformes combinent des rôles pour le cadre général et des ACL pour les exceptions.
- **« Une ACL est une liste d'utilisateurs. »** Elle peut contenir aussi des groupes et des rôles. C'est la liaison entre sujet et ressource qui la définit.
- **« Partager, c'est donner un droit pour toujours. »** Non. Une bonne conception prévoit l'expiration et la révocation.

#### Principe clé

Une ACL dit, ressource par ressource, qui peut faire quoi : puissante pour les exceptions, coûteuse pour le cadre général.

#### Si vous ne retenez que trois choses

1. Une ACL est une liste de permissions attachée à une ressource.
2. Elle convient aux exceptions et au partage ; le RBAC convient au cadre général.
3. Son coût apparaît à l'échelle : gestion, audit et liste des ressources visibles.

### 3. Explication technique détaillée

#### Le modèle de données

```sql
CREATE TABLE resource_acl (
  tenant_id     uuid NOT NULL,
  resource_type text NOT NULL,
  resource_id   uuid NOT NULL,
  subject_type  text NOT NULL,      -- 'user', 'group', 'role'
  subject_id    uuid NOT NULL,
  permission    text NOT NULL,      -- 'read', 'update', 'share'
  effect        text NOT NULL DEFAULT 'allow',
  expires_at    timestamptz,
  PRIMARY KEY (tenant_id, resource_type, resource_id, subject_type, subject_id, permission)
);
```

#### La vérification

```text
autoriser(sujet, permission, ressource) :
    entrées = ACL(ressource) + ACL hérités des parents
    si une entrée « deny » correspond au sujet ou à l'un de ses groupes : refuser
    si une entrée « allow » correspond : autoriser
    sinon : repli sur les rôles (RBAC), puis refus par défaut
```

#### ACL, RBAC : comparaison

| Critère | RBAC | ACL |
|---|---|---|
| Axe | Sujet : « que peut faire Mathilde ? » | Ressource : « qui peut toucher ce rapport ? » |
| Granularité | Type de ressource, portée | Ressource individuelle |
| Administration | Quelques rôles | Beaucoup d'entrées |
| Audit « qui a accès à X ? » | Moyen | Direct |
| Audit « à quoi a accès Y ? » | Direct | Coûteux |
| Cas d'usage | Cadre fonctionnel | Partage, exceptions |

#### Le problème de la liste des ressources visibles

Pour afficher une liste filtrée par droits, on ne veut pas vérifier chaque ressource une à une. On joint la table des ACL :

```sql
SELECT a.*
FROM aircraft a
WHERE a.tenant_id = :tenant
  AND EXISTS (
    SELECT 1 FROM resource_acl x
    WHERE x.tenant_id = a.tenant_id
      AND x.resource_type = 'aircraft'
      AND x.resource_id = a.id
      AND x.subject_id IN (:utilisateur, :groupes...)
      AND x.permission = 'read'
  );
```

**Limites de cette approche.** La requête est lourde sur de grands volumes, et l'héritage (parents) la complique. On utilise souvent des index dédiés, des matérialisations ou un système spécialisé (voir [4.17 ReBAC](#417-rebac)).

#### Les systèmes de fichiers

Le modèle classique d'Unix attribue trois groupes de bits `rwx` : propriétaire, groupe, autres. Les ACL POSIX étendent ce modèle avec des entrées pour des utilisateurs et des groupes supplémentaires. C'est l'origine historique du terme.

**Contre-exemple.** Partager manuellement chaque rapport avec chaque auditeur, un par un, pour des centaines de rapports. Il vaut mieux accorder un rôle ou un groupe sur le dossier, avec héritage, et réserver l'ACL aux exceptions.

**Limites.** Sans règles de combinaison claires, des conflits apparaissent : une entrée autorise, une autre refuse, une troisième est héritée. Il faut documenter l'ordre d'évaluation et fournir des outils d'explication (« pourquoi cet accès ? »).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac) | RBAC fournit le cadre, les ACL les exceptions |
| [4.17 ReBAC](#417-rebac) | ReBAC généralise le partage et l'héritage par des relations |
| [4.19 Permissions au niveau ressource, champ et ligne](#419-permissions-au-niveau-ressource-champ-et-ligne) | Les ACL s'appliquent au niveau de la ressource ou de la ligne |
| [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles) | L'héritage entre parent et enfant est central |
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | La hiérarchie des ressources est le support de l'héritage |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'interface doit expliquer d'où vient un accès |

### 5. Application pratique

**Situation initiale.** Un rapport d'incident doit être consulté par le responsable qualité et par l'autorité de l'aviation civile, mais pas par les autres utilisateurs du tenant.

**Problème.** Aucun rôle existant ne correspond à ce groupe de lecteurs, et en créer un pour un rapport serait disproportionné.

**Application du concept.** L'administrateur ajoute des entrées d'ACL sur ce rapport.

**Déroulé.**

1. Le propriétaire du rapport le marque « restreint ».
2. L'ACL hérite d'abord du dossier : aucune entrée.
3. Il ajoute deux entrées de lecture : le responsable qualité et le groupe « Autorité ».
4. Les autres planificateurs, même avec `aircraft:read`, n'ont plus accès à ce rapport.

**Résultat.** Un accès restreint à un document, sans créer de rôle.

**Limites.** Si l'autorité change de contact, l'entrée de groupe doit suivre : il faut un groupe et pas des personnes nommées.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une ACL ?
2. **Compréhension.** En quoi une ACL diffère-t-elle d'un rôle ?
3. **Compréhension.** Pourquoi la liste des ressources visibles est-elle difficile avec des ACL ?
4. **Pourquoi.** Pourquoi combine-t-on souvent ACL et rôles ?
5. **Raisonnement pratique.** Un dossier contient 500 rapports qui doivent tous être lus par un nouveau groupe. Que proposez-vous ?

#### Réponses

1. Une liste attachée à une ressource, qui indique, pour chaque sujet, les permissions qu'il a sur elle.
2. Un rôle est un paquet de permissions attribué à un sujet de façon générale ; une ACL est une règle propre à une ressource.
3. Parce qu'il faut déterminer, pour un sujet, l'ensemble des ressources dont l'ACL l'autorise, ce qui oblige à parcourir ou à joindre un grand nombre d'entrées.
4. Les rôles donnent le cadre général à faible coût ; les ACL permettent les exceptions et le partage précis.
5. Accorder le droit de lecture au groupe sur le dossier, avec héritage, plutôt que d'ajouter 500 entrées une à une.

## 4.16 ABAC

### 1. Comprendre simplement

L'**ABAC** (*Attribute-Based Access Control*, contrôle d'accès fondé sur les attributs) décide d'un accès en évaluant des **attributs** : ceux du sujet (service, habilitation, base), ceux de la ressource (classification, état, propriétaire), ceux de l'action, et ceux de l'environnement (heure, lieu, niveau de risque).

**Pourquoi cela existe.** Les rôles ne savent pas exprimer le contexte : « seulement pendant les heures de travail », « seulement pour les aéronefs de sa propre base », « seulement si l'inspection n'est pas en retard ». ABAC exprime ces règles directement, sans multiplier les rôles.

**Problème résolu.** Prendre des décisions d'accès fines, dynamiques et contextuelles.

**Modèle mental.** Un videur qui applique un règlement : « vous entrez si vous avez plus de 18 ans, si votre nom est sur la liste de la soirée, et s'il reste de la place ». Il ne regarde pas votre fonction ; il compare des attributs à des conditions.

**Où l'analogie s'arrête.** Un videur connaît les faits par lui-même. Un système doit obtenir des attributs fiables : un attribut faux ou périmé produit une décision fausse.

**Exemple.** Une technicienne peut modifier un aéronef si : sa base est celle de l'aéronef, sa qualification couvre le modèle de l'aéronef, et l'aéronef n'est pas retiré du service.

**Les composants.**

1. des **attributs** (sujet, ressource, action, environnement) ;
2. des **politiques** (règles sur les attributs) ;
3. un **moteur d'évaluation** ;
4. des **sources d'attributs** fiables.

**Objectif d'apprentissage :** vous pouvez écrire une règle ABAC simple et dire pourquoi la qualité des attributs conditionne la sécurité.

### 2. Connaissances essentielles

#### Définition

L'**ABAC** est un modèle de contrôle d'accès dans lequel les décisions sont calculées en évaluant des politiques sur des attributs du sujet, de la ressource, de l'action et de l'environnement. Le NIST le décrit dans la publication SP 800-162.

#### Idées fondamentales

1. **La décision dépend de faits.** Pas seulement de l'appartenance à un rôle.
2. **Les règles sont déclaratives.** On écrit les conditions, le moteur les évalue.
3. **Elles s'adaptent au contexte.** Heure, lieu, état de la ressource.
4. **Les attributs doivent être fiables.** Un attribut falsifié ou périmé compromet la décision.
5. **Les règles sont plus expressives et plus difficiles à auditer.** « Qui peut accéder à X ? » n'est plus une simple requête.
6. **ABAC et RBAC se combinent.** Le rôle peut être l'un des attributs.

#### Vocabulaire essentiel

- **Attribut** (*attribute*) : propriété d'une entité (sujet, ressource, environnement).
- **Politique** (*policy*) : règle qui combine des conditions sur des attributs.
- **XACML** : langage et architecture normalisés par l'OASIS pour ABAC.
- **PDP, PEP, PAP, PIP** : point de décision, d'application, d'administration et d'information.
- **Obligation** : action à exécuter si l'accès est accordé (par exemple journaliser).
- **Conflit de politiques** : deux règles donnent des résultats opposés.

#### Relations de cause à effet

- La base du sujet est un attribut mis à jour en retard. Une personne mutée garde des accès sur son ancienne base.
- Le client peut fournir lui-même des attributs dans la requête. Il peut s'attribuer le niveau d'habilitation qu'il souhaite.
- Les politiques s'accumulent sans test. Un conflit ou une exception oubliée ouvre un accès involontaire.

#### Idées reçues

- **« ABAC remplace RBAC. »** Pas nécessairement. Les rôles restent utiles comme attributs. Beaucoup de systèmes combinent les deux.
- **« ABAC est toujours plus sûr, car plus fin. »** Non. Plus de finesse signifie plus de règles à valider. Sans tests, il est plus facile de se tromper.
- **« Les attributs viennent de la requête. »** Non : les attributs d'accès doivent venir de sources de confiance (annuaire, base), jamais du client.

#### Principe clé

ABAC exprime l'accès comme une règle sur des faits ; sa sécurité repose sur la fiabilité de ces faits et sur la testabilité de ces règles.

#### Si vous ne retenez que trois choses

1. ABAC décide d'un accès en évaluant des attributs du sujet, de la ressource, de l'action et de l'environnement.
2. Il exprime le contexte que les rôles ignorent.
3. Il exige des attributs fiables et des politiques testées.

### 3. Explication technique détaillée

#### Les quatre familles d'attributs

| Famille | Exemples | Source typique |
|---|---|---|
| Sujet | Service, base, qualifications, habilitation | Annuaire, profil |
| Ressource | Base, modèle, état, classification, propriétaire | Données de la ressource |
| Action | Lecture, modification, approbation | La requête |
| Environnement | Heure, adresse réseau, niveau de risque de la session | Contexte de la requête |

#### Une règle ABAC

```text
PERMETTRE modifier SUR aircraft
QUAND  sujet.base = ressource.base
  ET   ressource.modèle ∈ sujet.qualifications
  ET   ressource.statut ≠ "retired"
  ET   environnement.heure ∈ [06:00, 22:00]
```

**Comment la lire.** Chaque ligne est une condition. Elles doivent toutes être vraies. Aucun rôle n'est cité : la décision vient des faits.

#### L'architecture de décision

```text
Requête ──► PEP (point d'application)
                │ demande une décision
                ▼
            PDP (point de décision) ◄── PAP (politiques)
                │ interroge les attributs
                ▼
            PIP (sources d'attributs : annuaire, base, contexte)
                │
                ▼
            décision : autoriser / refuser (+ obligations)
```

#### Évaluer et tester

| Pratique | Raison |
|---|---|
| Tests de politiques | Vérifier chaque règle avec des cas types et des cas limites |
| Simulation | Rejouer des requêtes passées avec la nouvelle politique avant de la déployer |
| Explication | « Pourquoi l'accès a-t-il été refusé ? » doit avoir une réponse |
| Versionnement | Relier chaque décision à la version de la politique appliquée |
| Détection de conflits | Signaler les règles qui se contredisent |

#### Le problème de l'inverse

Avec RBAC, on répond facilement à « qui a le rôle X ? ». Avec ABAC, répondre à « qui peut modifier cet aéronef ? » demande d'**évaluer** les politiques pour de nombreux sujets. Cela peut être coûteux, et l'audit demande des outils d'analyse de politique.

#### Modes de défaillance

- **Attributs obsolètes** : un départ ou une mutation non répercutés.
- **Attributs contrôlés par l'attaquant** : champ libre d'une requête utilisé dans une décision.
- **Règles trop permissives par oubli** : une condition manquante.
- **Performance** : de nombreux attributs à chercher à chaque décision.

**Contre-exemple.** Une politique qui lit `sujet.habilitation` dans un champ modifiable par l'utilisateur lui-même dans son profil. Il se donne l'habilitation voulue.

**Limites.** ABAC ne sait pas exprimer naturellement des relations de partage et d'héritage dans des graphes de ressources (« éditeur du dossier parent »). C'est le domaine du ReBAC (voir [4.17 ReBAC](#417-rebac)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac) | Le rôle peut être l'un des attributs de la politique |
| [4.17 ReBAC](#417-rebac) | ReBAC traite les relations que ABAC exprime mal |
| [4.18 PBAC](#418-pbac) | PBAC met l'accent sur la gestion centralisée des politiques |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les politiques peuvent être écrites comme du code versionné |
| [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | Les attributs de ressource sont des métadonnées |
| [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité) | Les conditions d'éligibilité reprennent la même logique |

### 5. Application pratique

**Situation initiale.** Les techniciens ne doivent modifier que les aéronefs de leur base et dont ils sont qualifiés, hors aéronefs retirés du service.

**Problème.** Avec RBAC, il faudrait un rôle par base, par modèle et par état.

**Application du concept.** Une politique unique évalue les attributs.

**Déroulé.**

1. L'administrateur écrit la politique avec les trois conditions.
2. Le technicien demande de modifier un aéronef.
3. Le point d'application envoie sujet, action, ressource et contexte au point de décision.
4. Le point de décision lit les attributs (annuaire pour la base et les qualifications, ressource pour le modèle et l'état).
5. Les conditions sont vraies : l'accès est accordé et journalisé avec la version de la politique.

**Résultat.** Une règle remplace des centaines de rôles, et suit automatiquement les changements d'affectation.

**Limites.** La règle dépend de la fraîcheur des qualifications : une qualification expirée mais non mise à jour dans l'annuaire laisse un accès indu.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les quatre familles d'attributs d'ABAC ?
2. **Compréhension.** Que signifient PEP et PDP ?
3. **Compréhension.** Pourquoi ABAC peut-il remplacer des centaines de rôles ?
4. **Pourquoi.** Pourquoi les attributs ne doivent-ils jamais être fournis par le client ?
5. **Raisonnement pratique.** Comment tester une nouvelle politique avant de la mettre en production ?

#### Réponses

1. Les attributs du sujet, de la ressource, de l'action et de l'environnement.
2. Le PEP est le point d'application qui intercepte la demande ; le PDP est le point de décision qui évalue les politiques.
3. Parce que les conditions de base, de qualification et d'état sont évaluées sur des attributs, au lieu d'être encodées dans autant de rôles.
4. Parce qu'un client pourrait s'attribuer les valeurs qui lui donnent accès : les attributs doivent venir de sources de confiance.
5. Par des tests de cas types et limites, et par une simulation qui rejoue des requêtes passées pour comparer les décisions de l'ancienne et de la nouvelle politique.

## 4.17 ReBAC

### 1. Comprendre simplement

Le **ReBAC** (*Relationship-Based Access Control*, contrôle d'accès fondé sur les relations) déduit un droit d'accès d'un **chemin de relations** entre le sujet et la ressource : « Mathilde est membre de l'équipe Lyon ; l'équipe Lyon est propriétaire de la base de Lyon ; cet aéronef est dans la base de Lyon ; donc Mathilde peut le consulter ».

**Pourquoi cela existe.** Beaucoup de règles d'accès reposent sur le partage et l'appartenance : « les éditeurs d'un dossier peuvent éditer ses fiches », « les membres d'une équipe voient les projets de l'équipe ». Les rôles et les attributs expriment ces structures de façon lourde. Un graphe de relations les exprime naturellement.

**Problème résolu.** Modéliser des droits qui dépendent de la structure et du partage, avec héritage le long de hiérarchies, à grande échelle.

**Modèle mental.** Un arbre généalogique d'accès : on part de la personne, on suit les liens d'appartenance et de propriété, et on arrive (ou non) à la ressource.

**Où l'analogie s'arrête.** Un arbre généalogique est figé. Les relations d'un système changent en permanence, et la décision doit refléter ces changements sans délai gênant.

**Exemple.** Tout éditeur d'une base est éditeur des aéronefs qui y sont rattachés, et un visiteur de l'équipe peut les consulter.

**Les composants.**

1. des **objets** (utilisateurs, équipes, bases, aéronefs) ;
2. des **relations** entre objets (membre, propriétaire, parent) ;
3. des **règles de dérivation** (« éditeur du parent est éditeur ») ;
4. une **vérification** : existe-t-il un chemin autorisant ?

**Objectif d'apprentissage :** vous pouvez décrire un droit comme un chemin de relations, et dire quand ReBAC est préférable à RBAC.

### 2. Connaissances essentielles

#### Définition

Le **ReBAC** est un modèle de contrôle d'accès dans lequel l'autorisation est dérivée de l'existence d'une relation, directe ou indirecte, entre un sujet et une ressource, selon des règles de dérivation déclarées.

#### Idées fondamentales

1. **Les droits sont des chemins.** Sujet, relations, ressource.
2. **Les relations sont des données.** Elles sont ajoutées et retirées comme des enregistrements.
3. **Les règles propagent.** Un droit sur un parent se transmet aux enfants.
4. **Les ensembles de sujets sont des sujets.** « Les membres de l'équipe » est un sujet.
5. **Le partage devient naturel.** Ajouter une relation suffit.
6. **La cohérence est un défi.** Retirer un droit doit prendre effet vite et de façon fiable.

#### Vocabulaire essentiel

- **Tuple de relation** (*relationship tuple*) : fait « objet, relation, sujet ».
- **Ensemble d'utilisateurs** (*userset*) : un groupe défini par une relation (« membres de l'équipe »).
- **Règle de réécriture** (*rewrite rule*) : règle qui déduit une relation à partir d'autres.
- **Vérification** (*check*) : « le sujet a-t-il cette relation avec cet objet ? ».
- **Liste d'objets** (*list objects*) : « quels objets ce sujet peut-il atteindre ? ».
- **Zanzibar** : système d'autorisation de Google, décrit dans un article publié en 2019, qui a inspiré de nombreux systèmes ouverts.

#### Relations de cause à effet

- Les relations sont des données d'accès. Ajouter ou retirer un membre d'une équipe change immédiatement tous ses droits dérivés.
- Les droits se propagent par héritage. Déplacer une ressource sous un autre parent change ses accès (voir [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer)).
- Le graphe devient très gros. Chaque vérification parcourt des chemins, et la performance dépend de l'implémentation et du cache.

#### Idées reçues

- **« ReBAC, c'est du RBAC avec des groupes. »** Non. Les relations peuvent être arbitraires et se composer, ce qui exprime l'héritage et le partage de façon plus générale.
- **« ReBAC est réservé aux grandes entreprises. »** L'idée est utile dès que les droits dépendent de hiérarchies et de partage, quelle que soit la taille.
- **« ReBAC remplace les attributs. »** Non. Les conditions contextuelles (heure, état) restent mieux exprimées par des attributs.

#### Principe clé

Un droit est le résultat d'un chemin de relations entre un sujet et une ressource : modifier la relation, c'est modifier le droit.

#### Si vous ne retenez que trois choses

1. ReBAC dérive l'autorisation de relations directes et indirectes entre sujet et ressource.
2. Il excelle pour le partage et l'héritage dans des hiérarchies.
3. Il demande un stockage de relations performant et cohérent.

### 3. Explication technique détaillée

#### Les tuples de relation

```text
base:LYS#editor@team:lyon#member       les membres de l'équipe Lyon sont éditeurs de la base LYS
team:lyon#member@user:mathilde         Mathilde est membre de l'équipe Lyon
aircraft:ac_8f3a#parent@base:LYS       l'aéronef ac_8f3a est rattaché à la base LYS
```

**Lecture.** Chaque ligne a la forme `objet#relation@sujet`. Le sujet peut être une personne ou un ensemble (« les membres de l'équipe Lyon »).

#### Le modèle de règles (notation illustrative)

```text
type team
  relations
    member : user

type base
  relations
    editor : user | team#member
    viewer : user | team#member | editor

type aircraft
  relations
    parent : base
    editor : user | editor de parent
    viewer : user | editor | viewer de parent
```

**Lecture.** Les éditeurs d'un aéronef sont ses éditeurs directs et les éditeurs de sa base. Les lecteurs incluent les éditeurs et les lecteurs de la base. Cette notation est inspirée des langages de systèmes ouverts comme OpenFGA ou SpiceDB ; elle est simplifiée à titre pédagogique.

#### Le parcours d'une vérification

```text
« Mathilde peut-elle éditer l'aéronef ac_8f3a ? »
  aircraft:ac_8f3a#editor ?  ──►  éditeur de parent
  aircraft:ac_8f3a#parent  =  base:LYS
  base:LYS#editor ?        ──►  team:lyon#member
  team:lyon#member@user:mathilde  ✔
  ──► autorisé, par le chemin : mathilde → équipe Lyon → base LYS → aéronef
```

#### L'explication de la décision

Un avantage notable : la décision est accompagnée du **chemin** qui l'a justifiée. On peut répondre à « pourquoi Mathilde peut-elle éditer cet aéronef ? ». C'est précieux pour l'audit et pour l'interface (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### Les opérations d'un système ReBAC

| Opération | Question | Usage |
|---|---|---|
| Vérifier | Le sujet S a-t-il la relation R avec l'objet O ? | Contrôle d'accès à chaque requête |
| Lister les objets | Quels objets S peut-il atteindre ? | Listes filtrées par droits |
| Lister les sujets | Qui a la relation R avec O ? | Audit, partage |
| Écrire une relation | Ajouter ou retirer un lien | Attribution, partage, retrait |

#### La cohérence

Retirer un droit et modifier le contenu peuvent se croiser : un utilisateur dont l'accès vient d'être retiré ne doit pas voir une version de la ressource écrite après ce retrait. Les concepteurs de Zanzibar décrivent ce problème et le traitent par des jetons de cohérence qui lient une décision à une version connue des relations.

#### Modes de défaillance

- **Graphe non maîtrisé** : relations créées sans règle de nettoyage, avec de très longs chemins.
- **Retard de propagation** : un retrait de droit pas encore visible partout.
- **Cycles** : des relations circulaires qui font échouer le parcours.
- **Complexité du modèle** : règles de réécriture difficiles à raisonner.

**Contre-exemple.** Utiliser ReBAC pour exprimer « seulement entre 8 h et 18 h ». C'est une condition contextuelle, mieux exprimée par un attribut (ABAC), éventuellement combiné aux relations.

**Limites.** ReBAC demande un stockage dédié ou un moteur spécialisé pour passer à l'échelle. Pour un petit nombre de ressources, un simple RBAC avec héritage suffit.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac) | RBAC est un cas particulier simple de relations (sujet, rôle, portée) |
| [4.15 ACL](#415-acl) | ReBAC généralise les ACL et leur héritage |
| [4.16 ABAC](#416-abac) | ABAC complète ReBAC pour les conditions contextuelles |
| [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles) | L'héritage de permissions est naturel en ReBAC |
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | La hiérarchie de ressources en est le support |
| [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat) | Les frontières d'agrégats peuvent servir de racines d'héritage |

### 5. Application pratique

**Situation initiale.** La plateforme gère des organisations, des bases, des équipes et des aéronefs. Les clients demandent un partage souple : « cette équipe édite cette base et tout ce qu'elle contient ».

**Problème.** Avec RBAC, chaque partage crée une attribution par aéronef, ou un rôle par combinaison. Les listes deviennent ingérables.

**Application du concept.** On modélise les rattachements en relations, avec des règles de propagation.

**Déroulé.**

1. L'administrateur ajoute la relation « l'équipe Lyon est éditrice de la base LYS ».
2. Les aéronefs de la base héritent automatiquement de ce droit.
3. Un nouvel aéronef rattaché à LYS est immédiatement éditable par l'équipe.
4. Quand une personne quitte l'équipe, la relation d'appartenance est retirée, et tous ses droits dérivés disparaissent.

**Résultat.** Le partage se gère à l'échelle d'une base ou d'une équipe, sans multiplier les attributions.

**Limites.** Les listes d'aéronefs visibles doivent être calculées efficacement : un moteur spécialisé ou une matérialisation devient nécessaire à grande échelle.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Comment ReBAC décide-t-il d'un accès ?
2. **Compréhension.** Qu'est-ce qu'un tuple de relation ?
3. **Compréhension.** Citez un avantage de ReBAC par rapport à RBAC pour le partage.
4. **Pourquoi.** Pourquoi la cohérence du retrait de droits est-elle un enjeu ?
5. **Raisonnement pratique.** On veut limiter un accès aux heures de bureau. ReBAC seul suffit-il ?

#### Réponses

1. Par l'existence d'un chemin de relations entre le sujet et la ressource, selon des règles de dérivation.
2. Un fait de la forme « objet, relation, sujet », par exemple « l'équipe Lyon est membre de la base LYS ».
3. Le partage et l'héritage se font en ajoutant une relation, sans créer d'attribution par ressource ni de rôle par combinaison.
4. Parce qu'un droit retiré doit prendre effet rapidement et de façon fiable, y compris par rapport aux modifications de contenu concurrentes.
5. Non : c'est une condition contextuelle, mieux exprimée par un attribut ; on combine ReBAC et ABAC.

## 4.18 PBAC

### 1. Comprendre simplement

Le **PBAC** (*Policy-Based Access Control*, contrôle d'accès fondé sur des politiques) désigne l'approche où les règles d'accès sont écrites sous forme de **politiques déclaratives, gérées de façon centralisée et évaluées par un moteur dédié**, plutôt que codées en dur dans chaque application.

**Pourquoi cela existe.** Quand les règles d'accès sont dispersées dans le code de dizaines de services, les modifier est lent et risqué, et les auditer est presque impossible. Les centraliser permet de les relire, de les tester, de les versionner et de les appliquer partout de la même façon.

**Problème résolu.** Séparer la logique de décision d'accès de la logique métier, pour la faire évoluer sans redéployer les applications.

**Modèle mental.** Un règlement intérieur écrit et publié, qu'un service juridique tient à jour, contre des consignes orales différentes dans chaque service.

**Où l'analogie s'arrête.** Un règlement papier est interprété par des personnes. Une politique logicielle doit être exécutable sans ambiguïté, et ses erreurs s'appliquent immédiatement à tous.

**Exemple.** « Un export de plus de 1 000 lignes exige le rôle auditeur et une authentification forte de moins de 15 minutes. » Cette règle est écrite une fois et appliquée par toutes les API qui exportent des données.

**Attention à la définition.** Le terme est employé de façons différentes : tantôt comme synonyme d'ABAC, tantôt comme désignation générale de toute approche à politiques externalisées. Dans ce parcours, **PBAC** désigne un **mécanisme** (politiques déclaratives et moteur) qui peut exprimer la logique de RBAC, d'ABAC ou de ReBAC.

**Les composants.**

1. un **langage de politique** ;
2. un **moteur** d'évaluation ;
3. un **dépôt de politiques** versionné ;
4. des **journaux de décision**.

**Objectif d'apprentissage :** vous pouvez dire ce que l'externalisation des politiques apporte, et en quoi PBAC est un mécanisme plutôt qu'un modèle.

### 2. Connaissances essentielles

#### Définition

Le **PBAC** est une approche de contrôle d'accès dans laquelle les décisions résultent de l'évaluation, par un moteur de politiques, de règles déclaratives gérées indépendamment du code des applications.

#### Idées fondamentales

1. **Décision et application sont séparées.** L'application demande, le moteur décide.
2. **Les politiques sont des données ou du code versionné.** On les revoit, les teste, les déploie.
3. **Un même moteur sert plusieurs services.** La cohérence est assurée.
4. **Le mécanisme est indépendant du modèle.** On peut y exprimer des rôles, des attributs, des relations.
5. **Chaque décision est journalisée.** Avec la version de la politique appliquée.
6. **Le comportement en cas de panne est un choix.** Refuser par défaut, ou autoriser pour préserver la disponibilité.

#### Vocabulaire essentiel

- **Moteur de politiques** (*policy engine*) : composant qui évalue les politiques.
- **Langage de politique** (*policy language*) : notation des règles (Rego, Cedar, XACML).
- **Entrée de décision** (*decision input*) : sujet, action, ressource, contexte.
- **Journal de décision** (*decision log*) : trace de chaque décision et de son motif.
- **Politique comme code** (*policy as code*) : politique gérée comme du code (voir [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)).
- **Algorithme de combinaison** (*combining algorithm*) : règle de résolution des conflits (le refus l'emporte, la première règle applicable).
- **Ouvert en cas de panne** (*fail-open*) et **fermé en cas de panne** (*fail-closed*).

#### Relations de cause à effet

- Les politiques sont centralisées. Une correction de règle se déploie en un endroit et s'applique partout, sans redéployer les services.
- Le moteur est distant. Chaque décision ajoute une latence réseau et une dépendance : on l'embarque ou on met ses résultats en cache.
- Une politique erronée est déployée. L'erreur s'applique à tous les services d'un coup : il faut tests, simulation et déploiement progressif.

#### Idées reçues

- **« PBAC est un modèle comme RBAC. »** C'est plutôt une façon de mettre en œuvre un modèle, par des politiques externalisées.
- **« Externaliser les politiques les rend simples. »** Elles restent des règles complexes. L'externalisation les rend visibles et gouvernables, pas plus simples.
- **« La performance est négligeable. »** Non. Une décision par requête, parfois plusieurs, impose de maîtriser la latence.

#### Principe clé

Sortez la décision d'accès du code métier, écrivez-la comme une politique déclarative testée et versionnée, et journalisez chaque décision.

#### Si vous ne retenez que trois choses

1. PBAC externalise les règles d'accès dans des politiques déclaratives évaluées par un moteur.
2. Il sépare l'application de la décision, et rend les règles versionnables et testables.
3. Il impose de maîtriser la latence, la disponibilité du moteur et la qualité des politiques.

### 3. Explication technique détaillée

#### Les modes de déploiement du moteur

| Mode | Principe | Latence | Remarque |
|---|---|---|---|
| Bibliothèque intégrée | Le moteur est dans le processus de l'application | Très faible | Mise à jour des politiques à distribuer |
| Agent local (*sidecar*) | Un processus voisin sur la même machine | Faible | Isolation, politique partagée |
| Service distant | Appel réseau à un service central | Plus élevée | Gestion centralisée, dépendance forte |

#### Une décision

```json
{
  "input": {
    "principal": { "id": "u_42", "roles": ["planner"], "base": "LYS", "mfa_age_minutes": 5 },
    "action": "export",
    "resource": { "type": "aircraft", "count": 4200 },
    "context": { "ip": "10.1.2.3" }
  }
}
```

```json
{
  "decision": "deny",
  "reasons": ["export_over_1000_requires_auditor"],
  "policy_version": "2026-10-13.4"
}
```

#### Une politique (pseudo-langage inspiré de Rego, simplifié)

```text
règle autoriser_export :
  action = "export"
  ET (ressource.nombre <= 1000
      OU (rôle "auditeur" ∈ sujet.rôles ET sujet.mfa_récent <= 15 minutes))

règle refus_par_défaut :
  refuser si aucune règle d'autorisation ne correspond
```

#### Le cycle de vie d'une politique

```text
Rédiger ─► Relire ─► Tester ─► Simuler ─► Déployer par étapes ─► Observer ─► Retirer
(code)    (revue)   (cas)     (requêtes    (quelques tenants     (journaux de
                               passées)     d'abord)             décision)
```

#### Les combinaisons de règles

Lorsque plusieurs politiques s'appliquent, un algorithme de combinaison résout les conflits. Les plus courants :

| Algorithme | Principe |
|---|---|
| Le refus l'emporte | Un seul refus suffit à refuser |
| L'autorisation l'emporte | Une seule autorisation suffit |
| Première règle applicable | L'ordre des règles décide |

Le choix doit être explicite et documenté : il change radicalement le résultat de l'ajout d'une règle.

#### Comportement en cas de panne

Si le moteur est indisponible, deux choix :

- **fermé** : tout refuser. Sûr, mais le service s'arrête ;
- **ouvert** : tout autoriser. Disponible, mais dangereux.

Un compromis courant : un **cache local** des décisions récentes, et un refus pour les actions sensibles.

**Contre-exemple.** Déployer en une fois, sur tous les tenants, une politique non testée qui refuse toutes les écritures. Toute la plateforme est bloquée jusqu'au retour arrière.

**Limites.** Un moteur de politiques ne remplace pas la conception du modèle de permissions : il exécute des règles bien conçues. Mal utilisé, il concentre des règles incohérentes dans un endroit unique.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac), [4.16 ABAC](#416-abac), [4.17 ReBAC](#417-rebac) | PBAC est le mécanisme qui peut implémenter ces modèles |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | « Policy as Code » en est la discipline de gestion |
| [4.13 Permission, rôle, politique et portée](#413-permission-rôle-politique-et-portée) | Il reprend le vocabulaire de permission, de rôle et de politique |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les politiques sont versionnées comme toute configuration |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | L'administration du comportement inclut l'édition des politiques |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust s'appuie sur des décisions continues et contextuelles |

### 5. Application pratique

**Situation initiale.** Cinq services de la plateforme appliquent chacun leur propre règle d'export, avec des différences subtiles.

**Problème.** Un auditeur découvre qu'un service autorise un export volumineux sans second facteur, que les autres refusent.

**Application du concept.** La règle d'export est extraite dans une politique unique, évaluée par un moteur partagé.

**Déroulé.**

1. L'équipe écrit la politique d'export et la teste avec une série de cas.
2. Elle la simule sur les exports de la semaine passée : 12 exports auraient été refusés.
3. Elle déploie la politique à un tenant pilote, puis à tous.
4. Les cinq services appellent le moteur au lieu d'appliquer leur propre règle.
5. Les décisions sont journalisées, avec la version de la politique.

**Résultat.** Une seule règle, appliquée partout de la même façon, avec une trace de chaque décision.

**Limites.** Si le moteur est indisponible, il faut avoir décidé à l'avance de ce que fait chaque service.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'externalise-t-on avec PBAC ?
2. **Compréhension.** Pourquoi dit-on que PBAC est un mécanisme et non un modèle ?
3. **Compréhension.** Quelles sont les deux stratégies en cas de panne du moteur ?
4. **Pourquoi.** Pourquoi simule-t-on une politique avant de la déployer ?
5. **Raisonnement pratique.** Une politique erronée refuse toutes les écritures. Quelles pratiques auraient limité l'impact ?

#### Réponses

1. La logique de décision d'accès : les règles sont écrites comme des politiques et évaluées par un moteur indépendant du code métier.
2. Parce qu'il décrit comment les règles sont gérées et évaluées, et peut exprimer la logique de RBAC, d'ABAC ou de ReBAC.
3. Fermé (tout refuser) ou ouvert (tout autoriser). Un compromis consiste à utiliser un cache et à refuser les actions sensibles.
4. Pour mesurer ses effets sur des requêtes réelles et détecter des refus ou des accords involontaires avant qu'ils n'affectent les utilisateurs.
5. Des tests de cas types, une simulation sur des requêtes passées, un déploiement par étapes avec un tenant pilote, et un retour arrière rapide.

## 4.19 Permissions au niveau ressource, champ et ligne

### 1. Comprendre simplement

La finesse d'une permission peut varier. Au niveau de la **ressource**, on dit : « peut lire les aéronefs ». Au niveau du **champ**, on dit : « peut lire les aéronefs, mais pas le champ *coût* ». Au niveau de la **ligne** (*row-level security*), on dit : « peut lire seulement les aéronefs de sa base ».

**Pourquoi cela existe.** Un même type de ressource contient des données de sensibilité différente et appartient à des périmètres différents. Accorder « tout ou rien » sur un type est presque toujours trop large.

**Problème résolu.** Réduire l'accès au strict nécessaire, y compris à l'intérieur d'un type de ressource.

**Modèle mental.** Un classeur d'archives. Le niveau de la ressource, c'est le droit d'ouvrir le classeur. Celui de la ligne, c'est de ne voir que certains dossiers. Celui du champ, c'est que certaines pages d'un dossier sont masquées.

**Où l'analogie s'arrête.** Un classeur physique se filtre à la main. Dans une plateforme, ces filtres doivent s'appliquer partout : liste, détail, recherche, export, API, rapports.

**Exemple.** Le technicien de la base de Lyon voit les aéronefs de Lyon (ligne), mais pas leur coût de maintenance (champ), et ne peut pas supprimer d'aéronef (ressource).

**Les trois niveaux.**

1. **ressource** : quelle opération sur quel type ou quelle instance ;
2. **champ** : quelles propriétés sont lisibles ou modifiables ;
3. **ligne** : quelles instances sont visibles.

**Objectif d'apprentissage :** vous pouvez décrire les trois niveaux, et dire où appliquer chacun pour qu'aucun chemin d'accès ne les contourne.

### 2. Connaissances essentielles

#### Définition

- **Permission au niveau de la ressource** (*resource-level permissions*) : droit d'effectuer une action sur un type de ressource ou sur une instance précise.
- **Permission au niveau du champ** (*field-level*) : droit de lire ou de modifier certaines propriétés d'une ressource.
- **Sécurité au niveau de la ligne** (*row-level security*, *RLS*) : restriction des instances accessibles à un sujet selon des critères sur leurs données.

#### Idées fondamentales

1. **Les trois niveaux se combinent.** Une opération réussit si les trois l'autorisent.
2. **Ligne : quelles ressources.** Elle filtre les résultats.
3. **Champ : quelles informations.** Elle masque ou rend en lecture seule.
4. **Tous les chemins d'accès doivent l'appliquer.** Liste, détail, recherche, export, rapports, API.
5. **Un filtre ou un tri sur un champ interdit révèle son contenu.** On les interdit aussi.
6. **La défense en profondeur place une barrière dans la base.** Elle protège même si le code oublie un filtre.

#### Vocabulaire essentiel

- **Politique de ligne** (*row policy*) : règle qui définit les lignes visibles.
- **Masquage** (*masking*) : remplacement d'une valeur par une version cachée.
- **Champ sensible** (*sensitive field*) : champ soumis à des règles renforcées.
- **Contrôle en écriture** (*write check*) : vérification que l'écriture reste dans le périmètre autorisé.
- **Fuite par inférence** (*inference leak*) : déduction d'une valeur interdite par un filtre, un tri ou un comptage.
- **Défense en profondeur** (*defense in depth*) : plusieurs barrières indépendantes.

#### Relations de cause à effet

- Le masquage de champ est appliqué dans l'écran seulement. L'API ou l'export retourne le champ.
- Le filtrage de lignes est appliqué dans le code applicatif. Un chemin oublié (rapport, recherche) retourne toutes les lignes.
- Un utilisateur peut filtrer par un champ qu'il ne peut pas lire. Il découvre la valeur par recoupement.

#### Idées reçues

- **« Cacher une colonne dans l'écran la protège. »** Non. Elle doit être retirée côté serveur de chaque réponse.
- **« Le niveau de la ligne suffit à isoler les tenants. »** Il aide, mais il doit être complété par des clés, des filtres et des tests.
- **« Les droits de champ sont binaires. »** Non. Il existe plusieurs niveaux : invisible, lecture seule, modifiable, ou masqué partiellement.

#### Principe clé

Appliquez le contrôle de ligne et de champ au plus près des données, de façon uniforme, pour qu'aucun chemin ne l'oublie.

#### Si vous ne retenez que trois choses

1. Le niveau de ressource, de champ et de ligne se combinent pour déterminer ce qu'un sujet voit et fait.
2. Tous les chemins d'accès doivent appliquer ces contrôles, y compris filtres, tris et exports.
3. Une barrière dans la base de données renforce la défense en profondeur.

### 3. Explication technique détaillée

#### La combinaison des niveaux

```text
Requête : lire des aéronefs
   │
   ▼
Ressource : l'utilisateur a-t-il aircraft:read ?          non → refus
   │ oui
   ▼
Ligne     : filtrer aux aéronefs de sa base                 → ensemble restreint
   │
   ▼
Champ     : retirer ou masquer les champs interdits         → réponse finale
```

#### Les droits de champ comme métadonnées

```json
{
  "type": "aircraft",
  "field_permissions": [
    { "field": "maintenance_cost", "roles": ["finance"], "access": "read" },
    { "field": "status", "roles": ["planner"], "access": "write" },
    { "field": "status", "roles": ["technician", "auditor"], "access": "read" }
  ],
  "default_field_access": "read"
}
```

**Comment la lire.** Le champ `maintenance_cost` n'est lisible que par la finance. Le statut est modifiable par les planificateurs et lisible par les autres rôles. Les autres champs sont lisibles par tous ceux qui ont accès à la ressource.

#### Le contrôle de ligne dans la base : exemple PostgreSQL

```sql
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft FORCE ROW LEVEL SECURITY;

CREATE POLICY aircraft_tenant ON aircraft
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY aircraft_base ON aircraft
  USING (base_id = ANY (string_to_array(current_setting('app.base_ids'), ',')::uuid[]));
```

```sql
-- Au début de chaque transaction, le moteur fixe le contexte
SET LOCAL app.tenant_id = '6f2c…';
SET LOCAL app.base_ids  = '9a1d…,3be7…';
```

**Comment cela fonctionne.** La base ajoute automatiquement les conditions aux requêtes. `USING` filtre les lignes lues ou modifiées. `WITH CHECK` empêche d'écrire une ligne hors du périmètre. `FORCE` applique la politique même au propriétaire de la table. Le contexte est fixé au début de la transaction.

**Pourquoi c'est utile.** Même si un développeur oublie un `WHERE tenant_id = …`, la base refuse de retourner une ligne d'un autre tenant.

**Précautions.** Avec un pool de connexions, il faut fixer le contexte à chaque transaction et le réinitialiser, sinon une connexion réutilisée garde le contexte précédent. La politique a aussi un coût de performance qu'il faut mesurer.

#### Les fuites par inférence

| Fuite | Exemple | Parade |
|---|---|---|
| Filtre sur champ interdit | `filter: cost > 1000000` | Interdire le filtre sur un champ non lisible |
| Tri sur champ interdit | `sort: cost` | Interdire le tri |
| Comptage | `count` avec filtres sur lignes hors périmètre | Appliquer la ligne avant agrégation |
| Message d'erreur | « valeur déjà utilisée par un autre tenant » | Messages génériques |

#### Quand le niveau de ligne est complexe

Des règles de ligne qui dépendent de relations (voir [4.17 ReBAC](#417-rebac)) ou d'héritage (voir [4.20 Héritage de permissions et hiérarchie de rôles](#420-héritage-de-permissions-et-hiérarchie-de-rôles)) ne s'écrivent pas facilement dans une politique de base. On les calcule alors dans le moteur, avec une jointure ou une liste d'identifiants préalablement résolue.

**Contre-exemple.** Appliquer le filtre de ligne dans la requête principale d'une liste, mais pas dans l'API de recherche plein texte. La recherche retourne des titres de ressources que la liste ne montrerait pas.

**Limites.** Chaque niveau de finesse multiplie les cas à tester et à expliquer à l'utilisateur. Un champ invisible ne doit pas rendre un formulaire incompréhensible (voir [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Le modèle de requête applique les filtres de ligne et de champ |
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | La sécurité de ligne renforce l'isolation entre tenants |
| [4.15 ACL](#415-acl) | Les ACL s'appliquent au niveau de la ressource ou de la ligne |
| [4.16 ABAC](#416-abac) | Les attributs servent de critères de ligne et de champ |
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'export doit respecter les droits de ligne et de champ |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | L'interface s'adapte aux droits (champs masqués, actions absentes) |

### 5. Application pratique

**Situation initiale.** Un cabinet d'audit externe a un accès en lecture aux aéronefs de la compagnie. Le coût de maintenance et les notes internes sont confidentiels.

**Problème.** Le rôle « Auditeur » donne `aircraft:read`, qui expose tous les champs.

**Application du concept.** On ajoute des droits de champ et une restriction de ligne : seuls les aéronefs de la période d'audit sont visibles.

**Déroulé.**

1. L'administrateur marque `maintenance_cost` et `internal_notes` comme lisibles uniquement par la finance et les planificateurs.
2. Il ajoute une condition de ligne : seuls les aéronefs en service pendant la période audit sont visibles.
3. L'auditeur appelle l'API : les champs masqués sont absents, les lignes hors période aussi.
4. Il tente `filter=maintenance_cost>0` : la requête est refusée.

**Résultat.** L'auditeur voit ce dont il a besoin, rien de plus, par tous les chemins d'accès.

**Limites.** L'export de rapport doit appliquer les mêmes règles. Un test automatique compare ce que voit chaque rôle par l'interface, l'API et l'export.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un droit de ligne et un droit de champ ?
2. **Compréhension.** Que fait la clause `WITH CHECK` d'une politique de ligne ?
3. **Compréhension.** Pourquoi un filtre sur un champ interdit est-il dangereux ?
4. **Pourquoi.** Pourquoi cacher un champ dans l'interface ne suffit-il pas ?
5. **Raisonnement pratique.** La recherche plein texte retourne des titres de ressources qu'un utilisateur ne peut pas voir dans les listes. Quelle est la cause probable ?

#### Réponses

1. Le droit de ligne détermine quelles ressources sont visibles ; le droit de champ détermine quelles propriétés d'une ressource visible sont lisibles ou modifiables.
2. Elle vérifie que la ligne écrite reste dans le périmètre autorisé : on ne peut pas créer ou modifier une ligne hors de son périmètre.
3. Parce que le résultat du filtre révèle indirectement la valeur : en testant des seuils, on retrouve le champ.
4. Parce qu'un appel direct à l'API ou un export retourne le champ : le retrait doit se faire côté serveur.
5. Le filtre de ligne n'est pas appliqué dans le chemin de recherche plein texte : chaque chemin d'accès doit appliquer les mêmes contrôles.

## 4.20 Héritage de permissions et hiérarchie de rôles

### 1. Comprendre simplement

L'**héritage de permissions** (*permission inheritance*) signifie qu'un droit accordé sur un élément s'applique aussi aux éléments qu'il contient : le droit sur un dossier vaut pour les fiches qu'il contient. La **hiérarchie de rôles** (*role hierarchy*) signifie qu'un rôle supérieur possède automatiquement les permissions des rôles inférieurs : le responsable a tout ce qu'a le planificateur, et davantage.

**Pourquoi cela existe.** Sans héritage, il faudrait répéter chaque droit sur chaque élément et dans chaque rôle. Les structures hiérarchiques sont partout : organisations, emplacements, dossiers, fonctions.

**Problème résolu.** Réduire la quantité de droits à déclarer et à maintenir, en exploitant la structure existante.

**Modèle mental.** Un passe d'immeuble : il ouvre la porte d'entrée, l'ascenseur et les étages autorisés. On n'attribue pas une clé par pièce.

**Où l'analogie s'arrête.** Un passe est un objet fixe. Dans une plateforme, les structures changent (une ressource est déplacée, un rôle est restructuré) et les droits effectifs changent avec elles, parfois sans que personne ne le remarque.

**Exemple.** Le droit de lecture accordé sur l'emplacement « Aéroport de Lyon » vaut pour ses hangars, ses baies et les aéronefs qui y sont rangés.

**Les composants.**

1. une **structure hiérarchique** (arbre ou graphe) ;
2. des **règles de propagation** (de haut en bas) ;
3. des **exceptions** (rupture d'héritage, refus explicite) ;
4. un **calcul des droits effectifs**.

**Objectif d'apprentissage :** vous pouvez calculer les droits effectifs d'une ressource héritant d'un parent, et dire pourquoi un déplacement les modifie.

### 2. Connaissances essentielles

#### Définition

- **Héritage de permissions** : mécanisme par lequel les droits définis sur un élément parent s'appliquent à ses descendants, sauf exception.
- **Hiérarchie de rôles** : ordre partiel entre rôles dans lequel un rôle supérieur reprend les permissions des rôles qui lui sont inférieurs.

#### Idées fondamentales

1. **Les droits descendent.** Du parent aux enfants, du rôle supérieur à ses sous-rôles.
2. **Les droits effectifs sont calculés.** Ils combinent droits directs et hérités.
3. **L'héritage peut être interrompu.** Une ressource peut avoir son propre jeu de droits.
4. **Le refus explicite l'emporte sur l'héritage.** C'est la convention la plus courante.
5. **La structure détermine les droits.** Modifier la structure modifie les accès.
6. **La complexité doit rester explicable.** On doit pouvoir dire d'où vient un droit.

#### Vocabulaire essentiel

- **Droit hérité** (*inherited permission*) : droit venant d'un parent.
- **Droit direct** (*explicit permission*) : droit défini sur l'élément lui-même.
- **Rupture d'héritage** (*break inheritance*) : arrêt de la propagation.
- **Droits effectifs** (*effective permissions*) : résultat final après combinaison.
- **Fermeture transitive** (*transitive closure*) : ensemble de tous les ancêtres ou descendants.
- **Rôle senior** et **rôle junior** : dans une hiérarchie de rôles, celui qui hérite et celui dont on hérite.

#### Relations de cause à effet

- Un dossier est déplacé sous un autre parent. Il perd les droits de l'ancien, gagne ceux du nouveau : des personnes voient ou perdent l'accès sans qu'on ait touché à leurs droits.
- Un rôle intermédiaire est modifié. Tous les rôles supérieurs qui en héritent changent aussi.
- Une rupture d'héritage est oubliée. Une ressource très sensible garde les droits larges de son parent.

#### Idées reçues

- **« L'héritage rend les droits plus simples à comprendre. »** Il en réduit le nombre, mais il rend leur origine moins visible. Sans outils d'explication, il devient opaque.
- **« Un rôle supérieur est toujours un super-ensemble. »** C'est le sens de la hiérarchie, mais il faut éviter d'y mêler des rôles aux responsabilités différentes, au risque d'accorder trop.
- **« L'héritage ne concerne que les dossiers. »** Il s'applique à toute structure : organisations, emplacements, projets, rôles.

#### Principe clé

L'héritage économise des déclarations en échange d'un effort d'explication : calculez les droits effectifs, et sachez toujours dire d'où ils viennent.

#### Si vous ne retenez que trois choses

1. Les droits se propagent du parent aux enfants et du rôle supérieur aux rôles inférieurs.
2. Les droits effectifs sont calculés ; déplacer une ressource ou changer un rôle les modifie.
3. Il faut des ruptures d'héritage, des refus explicites et une explication de l'origine des droits.

### 3. Explication technique détaillée

#### Un exemple d'héritage de ressources

```text
Aéroport LYS                [Lecteurs : équipe Lyon]
 ├─ Hangar 2                [hérite]
 │   ├─ Baie 4              [hérite]
 │   │   └─ Aéronef F-ABCD  [hérite]
 │   └─ Baie 5              [rupture : Lecteurs = {Direction}]
 │       └─ Aéronef F-ABCE  [hérite de Baie 5 : seule la Direction y a accès]
 └─ Hangar 3                [hérite]
```

**Comment la lire.** L'équipe Lyon lit tout sous l'aéroport, sauf sous la baie 5, où l'héritage est interrompu et remplacé par un autre jeu de lecteurs.

#### Calcul des droits effectifs

```text
droits_effectifs(ressource) :
    si la ressource a une rupture d'héritage :
        retourner droits_directs(ressource)
    sinon :
        retourner droits_directs(ressource) ∪ droits_effectifs(parent(ressource))
    puis : retirer les refus explicites
```

**Coût.** Calculer à chaque requête en remontant l'arbre est lent pour des arbres profonds. On matérialise souvent la fermeture (une table ancêtre–descendant, voir [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie)) ou on met les résultats en cache.

#### La hiérarchie de rôles

```text
        Directeur
            │ hérite de
        Responsable
         ╱        ╲
 Planificateur   Auditeur
         ╲        ╱
         Lecteur
```

Chaque rôle reprend les permissions de ceux situés en dessous. Dans le modèle RBAC du NIST, c'est le niveau « hiérarchique ».

| Rôle | Permissions propres | Permissions effectives |
|---|---|---|
| Lecteur | `aircraft:read` | `aircraft:read` |
| Planificateur | `aircraft:update`, `task:assign` | lecture + ces deux |
| Auditeur | `audit:read` | lecture + `audit:read` |
| Responsable | `task:approve` | tout ce qui précède + `task:approve` |

#### Les conséquences d'un déplacement

Quand une ressource est déplacée (voir [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer)) :

1. les droits hérités de l'ancien parent disparaissent ;
2. les droits du nouveau parent s'appliquent ;
3. les index de fermeture ou les caches sont mis à jour ;
4. un journal conserve l'ancien et le nouvel ensemble de droits effectifs ;
5. l'interface avertit de l'effet sur les accès.

#### L'explication

Une bonne plateforme répond à « pourquoi puis-je voir cette ressource ? » :

```text
Vous avez accès à l'aéronef F-ABCD parce que :
  - vous êtes membre de l'équipe Lyon,
  - l'équipe Lyon est lectrice de l'Aéroport LYS,
  - l'aéronef est situé dans Baie 4 < Hangar 2 < Aéroport LYS (droit hérité).
```

**Contre-exemple.** Une hiérarchie de rôles où « Auditeur » hérite de « Planificateur » parce que l'auditeur a besoin de tout lire. L'auditeur obtient aussi le droit de modifier : la lecture et l'écriture ont été confondues.

**Limites.** Les graphes d'héritage avec plusieurs parents rendent le calcul et l'explication difficiles (un élément peut hériter de droits contradictoires). On limite souvent l'héritage à des arbres.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | La hiérarchie de ressources est le support de l'héritage |
| [3.5 Déplacer et transférer](03-crud-runtime-ressources.md#35-déplacer-et-transférer) | Un déplacement change les droits hérités |
| [4.14 RBAC](#414-rbac) | La hiérarchie de rôles est le niveau hiérarchique de RBAC |
| [4.15 ACL](#415-acl) | Les ACL peuvent hériter du parent |
| [4.17 ReBAC](#417-rebac) | L'héritage est natif dans les modèles à relations |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'interface doit expliquer l'origine d'un droit |

### 5. Application pratique

**Situation initiale.** Un dossier « Constats réglementaires » est lisible par l'équipe qualité. Un administrateur le déplace sous un nouveau dossier « Archives ouvertes à tous les planificateurs ».

**Problème.** Sans y penser, il rend les constats lisibles par tous les planificateurs, alors qu'ils contiennent des informations confidentielles.

**Application du concept.** La plateforme calcule l'effet du déplacement avant de l'appliquer.

**Déroulé.**

1. L'administrateur glisse le dossier vers sa nouvelle position.
2. La plateforme calcule les droits effectifs avant et après.
3. Elle affiche : « 38 personnes obtiendraient l'accès en lecture à 214 constats ».
4. L'administrateur annule, ou crée d'abord une rupture d'héritage sur les constats.

**Résultat.** L'effet du déplacement est connu avant qu'il ait lieu.

**Limites.** Ce calcul d'impact a un coût sur de grands arbres. On le limite souvent à un résumé.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un droit hérité ?
2. **Compréhension.** Que fait une rupture d'héritage ?
3. **Compréhension.** Que signifie qu'un rôle hérite d'un autre ?
4. **Pourquoi.** Pourquoi déplacer une ressource peut-il changer qui y a accès ?
5. **Raisonnement pratique.** Comment aider un administrateur à anticiper l'effet d'un déplacement ?

#### Réponses

1. Un droit qui s'applique à un élément parce qu'il a été accordé sur un parent.
2. Elle arrête la propagation des droits du parent : l'élément a ses propres droits.
3. Que le rôle supérieur possède toutes les permissions du rôle inférieur, en plus des siennes.
4. Parce que les droits héritent du parent : changer de parent change les droits hérités.
5. En calculant et en affichant l'écart des droits effectifs avant et après le déplacement, avec le nombre de personnes et de ressources concernées.

## 4.21 Délégation

### 1. Comprendre simplement

La **délégation** (*delegation*) est le fait qu'une personne ou une application **agisse au nom** d'une autre, en utilisant tout ou partie de ses droits, pour une durée ou un but limités. Un responsable en congé délègue ses approbations à un collègue. Un utilisateur autorise une application à lire ses données.

**Pourquoi cela existe.** Les organisations ne s'arrêtent pas quand quelqu'un est absent ou occupé. Et les applications tierces doivent pouvoir agir pour un utilisateur sans lui voler son identité.

**Problème résolu.** Transférer temporairement et de façon contrôlée une capacité d'action, avec traçabilité de qui agit pour qui.

**Modèle mental.** Une procuration. Elle précise ce que le mandataire peut faire, pour combien de temps, et au nom de qui. Le mandataire reste lui-même ; il n'est pas le mandant.

**Où l'analogie s'arrête.** Une procuration est un document unique. Dans une plateforme, on délègue souvent de façon automatique et répétée, entre applications, avec des chaînes possibles de délégations.

**Exemple.** La responsable qualité part en congé deux semaines. Elle délègue l'approbation des constats à un collègue, du 1er au 15, avec une limite de portée : constats de la base de Lyon seulement.

**Les composants.**

1. un **délégant** (celui dont les droits sont utilisés) ;
2. un **délégataire** (celui qui agit) ;
3. un **périmètre** de droits délégués ;
4. une **durée** ;
5. une **trace** qui retient les deux identités.

**Objectif d'apprentissage :** vous pouvez distinguer délégation et usurpation d'identité, et citer les garde-fous d'une délégation sûre.

### 2. Connaissances essentielles

#### Définition

La **délégation** est la transmission explicite, révocable et limitée, d'une partie des droits d'un sujet à un autre sujet, afin que ce dernier agisse en son nom, en conservant la distinction des deux identités.

#### Idées fondamentales

1. **Le délégataire garde sa propre identité.** Il agit « au nom de », il n'est pas « devenu » le délégant.
2. **La délégation est bornée.** Périmètre, durée, motif.
3. **Elle ne peut pas dépasser les droits du délégant.** On ne délègue pas ce que l'on n'a pas.
4. **Elle est révocable.** À tout moment, par le délégant ou un administrateur.
5. **Elle est tracée.** Chaque action porte les deux identités.
6. **La redélégation est interdite par défaut.** Sinon la chaîne devient incontrôlable.

#### Vocabulaire essentiel

- **Délégant** (*delegator*, *principal*) : celui qui délègue.
- **Délégataire** (*delegate*, *actor*) : celui qui agit.
- **Usurpation d'identité** (*impersonation*) : agir en se faisant passer pour une autre personne, sans distinction.
- **Au nom de** (*on behalf of*) : action d'un délégataire pour un délégant.
- **Échange de jeton** (*token exchange*, RFC 8693) : mécanisme OAuth pour obtenir un jeton qui représente une délégation.
- **Revendication d'acteur** (`act`) : revendication d'un jeton qui désigne l'acteur réel.
- **Élévation temporaire** (*temporary elevation*) : droits supplémentaires pour une durée courte.

#### Relations de cause à effet

- Un délégataire agit avec les droits entiers du délégant, sans limite. Il peut accomplir des actions que le délégant n'aurait jamais voulu voir faites en son nom.
- La trace ne mentionne que le délégant. En cas d'incident, on ne peut pas savoir qui a réellement agi.
- Une délégation n'a pas de date de fin. Elle devient permanente, et le délégataire garde ses droits après le retour du délégant.

#### Idées reçues

- **« Partager son mot de passe, c'est déléguer. »** Non. C'est une usurpation : les actions sont attribuées à la mauvaise personne, et le contrôle est perdu.
- **« L'assistance technique peut se connecter en tant que l'utilisateur pour l'aider. »** Seulement avec des garde-fous : consentement, durée limitée, journalisation distincte, restrictions des actions sensibles.
- **« Déléguer, c'est se dégager de la responsabilité. »** En général non : le délégant reste responsable de ce qui est fait en son nom.

#### Principe clé

Une délégation sûre est explicite, limitée en périmètre et en durée, révocable, et laisse une trace des deux identités.

#### Si vous ne retenez que trois choses

1. La délégation permet d'agir au nom d'un autre, sans prendre son identité.
2. Elle est bornée, révocable et ne dépasse jamais les droits du délégant.
3. Chaque action porte les deux identités dans le journal.

### 3. Explication technique détaillée

#### Les formes de délégation

| Forme | Exemple | Contrôle |
|---|---|---|
| Délégation humaine temporaire | Approbations déléguées pendant un congé | Périmètre, dates, révocation |
| Autorisation d'application | OAuth : une application agit pour l'utilisateur | Périmètre du jeton, consentement |
| Assistance (*impersonation* encadrée) | Le support se met à la place d'un utilisateur | Consentement, durée, restrictions, audit |
| Service pour utilisateur | Un service appelle un autre au nom de l'utilisateur | Échange de jeton, `act` |

#### L'enregistrement d'une délégation

```json
{
  "id": "dlg_77",
  "delegator": "u_resp_qualite",
  "delegate": "u_collegue",
  "permissions": ["finding:approve"],
  "scope": { "type": "location", "id": "LYS" },
  "starts_at": "2026-11-01T00:00:00Z",
  "ends_at": "2026-11-15T23:59:59Z",
  "reason": "Congés",
  "redelegation": false
}
```

#### La vérification

```text
autoriser(délégataire, action, ressource) :
    1. vérifier les droits propres du délégataire
    2. sinon, chercher une délégation active dont :
         - le délégataire est l'acteur,
         - la permission est incluse,
         - la ressource est dans le périmètre,
         - la date est dans la fenêtre,
         - le délégant possède encore ce droit
    3. enregistrer : acteur = délégataire, au nom de = délégant
```

**Point d'attention.** Le délégant doit **encore** posséder le droit au moment de l'action. Si ses droits sont retirés, la délégation devient inopérante.

#### La trace

```json
{
  "actor": "u_collegue",
  "on_behalf_of": "u_resp_qualite",
  "delegation_id": "dlg_77",
  "action": "finding:approve",
  "resource": "finding/fd_204",
  "at": "2026-11-04T09:12:00Z"
}
```

#### Délégation et séparation des tâches

Une délégation peut contourner une règle de séparation des tâches : si la personne qui soumet une demande reçoit la délégation d'approbation de son responsable, elle peut approuver sa propre demande. La plateforme doit appliquer la règle « un demandeur n'approuve jamais sa propre demande » même sous délégation (voir [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches)).

#### L'échange de jeton

Dans un système de services, un service A reçoit un jeton de l'utilisateur et doit appeler le service B en son nom. Il demande à un serveur d'autorisation un nouveau jeton qui désigne l'utilisateur comme sujet et A comme acteur (revendication `act`). B sait ainsi que A agit pour l'utilisateur, sans que A détienne le jeton d'origine.

**Contre-exemple.** Un service qui réutilise tel quel le jeton de l'utilisateur pour appeler d'autres services. Le jeton circule partout, avec toute sa portée, et le destinataire ne distingue pas l'utilisateur de l'intermédiaire.

**Limites.** Les chaînes de délégation sont difficiles à auditer. On limite la profondeur, on interdit la redélégation par défaut, et on fournit une vue des délégations actives par personne.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.9 OAuth 2.0](#49-oauth-20) | OAuth est un mécanisme de délégation d'accès à des applications |
| [4.22 Moindre privilège et séparation des tâches](#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches limite ce qu'une délégation peut cumuler |
| [4.3 Identités non humaines](#43-identités-non-humaines) | Les services agissent parfois au nom d'utilisateurs |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La gouvernance exige l'approbation et la revue des délégations |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'audit conserve les deux identités |
| [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants) | L'assistance inter-tenants par le fournisseur est une forme encadrée de délégation |

### 5. Application pratique

**Situation initiale.** Une responsable qualité part deux semaines. Les constats en attente d'approbation s'accumulent.

**Problème.** Partager son mot de passe avec un collègue est interdit, et lui donner le rôle de responsable de façon permanente est excessif.

**Application du concept.** Elle crée une délégation limitée dans le temps et dans le périmètre.

**Déroulé.**

1. Elle choisit « Déléguer » dans son profil, désigne son collègue, la permission d'approbation, la base de Lyon, du 1er au 15 novembre.
2. Le moteur vérifie que le collègue n'est pas soumis à une règle de séparation des tâches incompatible.
3. Le collègue approuve un constat : le journal enregistre « par le collègue, au nom de la responsable ».
4. Le 16 novembre, la délégation expire sans action.

**Résultat.** Le processus continue, avec traçabilité des deux identités, sans partage de secret.

**Limites.** Si le collègue a lui-même soumis le constat, la règle de séparation des tâches interdit l'approbation, même déléguée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre déléguer et partager son mot de passe ?
2. **Compréhension.** Que doit contenir le journal d'une action déléguée ?
3. **Compréhension.** Pourquoi une délégation ne peut-elle pas dépasser les droits du délégant ?
4. **Pourquoi.** Pourquoi interdit-on la redélégation par défaut ?
5. **Raisonnement pratique.** Un service d'assistance veut se connecter en tant qu'un client pour diagnostiquer un problème. Quels garde-fous prévoir ?

#### Réponses

1. Déléguer garde les deux identités distinctes, avec périmètre, durée et traçabilité. Partager un mot de passe confond les identités, sans limite ni trace fiable.
2. L'acteur réel, la personne au nom de qui il agit, la délégation concernée, l'action et l'instant.
3. Parce qu'on ne peut pas transmettre un droit que l'on ne possède pas : la délégation serait une élévation de privilège.
4. Parce que les chaînes de délégation deviennent incontrôlables : on ne sait plus qui détient quel droit, ni jusqu'à quand.
5. Consentement du client, durée courte, restriction des actions sensibles, journal séparé qui désigne l'agent d'assistance, et revue périodique.

## 4.22 Moindre privilège et séparation des tâches

### 1. Comprendre simplement

Le **moindre privilège** (*least privilege*) est le principe selon lequel chaque sujet ne reçoit que les droits **strictement nécessaires** à sa tâche, et seulement pendant le temps nécessaire. La **séparation des tâches** (*separation of duties*) est le principe selon lequel **aucune personne seule** ne doit pouvoir mener à son terme une opération critique : une autre personne doit intervenir.

**Pourquoi cela existe.** Les erreurs et les abus augmentent avec l'étendue des droits. Un compte qui peut tout faire est une cible, et une erreur de sa part est catastrophique. Et une personne qui peut à la fois demander et approuver peut commettre une fraude seule.

**Problème résolu.** Limiter l'impact d'une erreur, d'une compromission ou d'une malveillance, en réduisant les droits et en répartissant les décisions critiques.

**Modèle mental.**

- *Moindre privilège* : un employé de bureau a la clé de son bureau, pas celle de la salle des coffres.
- *Séparation des tâches* : le coffre exige deux clés détenues par deux personnes différentes.

**Où l'analogie s'arrête.** Deux clés physiques sont indépendantes par construction. Dans un système, il faut s'assurer que deux comptes sont réellement deux personnes, et qu'une délégation ou un rôle cumulé ne contourne pas la règle.

**Exemple.** Un technicien peut saisir un constat mais ne peut pas l'approuver. Le responsable qualité approuve, mais ne peut pas approuver les constats qu'il a lui-même saisis.

**Les composants.**

1. des **droits minimaux** par rôle ;
2. des **élévations temporaires** et tracées ;
3. des **revues périodiques** ;
4. des **règles d'incompatibilité** entre rôles ou entre actions.

**Objectif d'apprentissage :** vous pouvez appliquer les deux principes à un processus, et distinguer séparation statique et dynamique.

### 2. Connaissances essentielles

#### Définition

- **Moindre privilège** : principe de conception qui accorde à chaque sujet le minimum de droits nécessaires pour accomplir ses tâches légitimes, pour la durée nécessaire. Il remonte à l'article de Saltzer et Schroeder (1975).
- **Séparation des tâches** : principe qui répartit les étapes d'un processus sensible entre plusieurs personnes, de sorte qu'aucune ne puisse le mener seule à son terme.

#### Idées fondamentales

1. **Par défaut, rien.** Les droits s'ajoutent, ils ne se retirent pas d'un « tout ».
2. **Les droits sont limités dans le temps.** Une élévation expire.
3. **Les droits inutilisés se retirent.** Revue périodique et recertification.
4. **La séparation protège contre la fraude et l'erreur.** « Quatre yeux » (*four-eyes*).
5. **Elle peut être statique ou dynamique.** Rôles incompatibles, ou incompatibilité au moment de l'action.
6. **Les deux principes se renforcent.** Des droits réduits rendent la séparation plus facile à tenir.

#### Vocabulaire essentiel

- **Élévation juste à temps** (*just-in-time access*) : droits accordés pour une durée courte, à la demande.
- **Recertification** (*access review*) : revue périodique des droits par les responsables.
- **Quatre yeux** (*four-eyes principle*) : deux personnes doivent intervenir.
- **Auteur et approbateur** (*maker-checker*) : l'un propose, l'autre valide.
- **Séparation statique** (*static SoD*) : une personne ne peut pas détenir deux rôles incompatibles.
- **Séparation dynamique** (*dynamic SoD*) : une personne peut avoir les deux rôles, mais pas agir dans les deux pour le même objet.
- **Accès de dernier recours** (*break-glass*) : accès d'urgence exceptionnel, très surveillé.

#### Relations de cause à effet

- Un rôle large est attribué « pour ne pas bloquer ». Chaque compromission d'un compte touche tout.
- Les droits ne sont jamais revus. Ils s'accumulent à chaque changement de poste.
- Le demandeur peut approuver sa demande. Aucune détection de fraude n'est possible avant un audit externe.

#### Idées reçues

- **« Le moindre privilège ralentit le travail. »** Mal conçu, oui. Bien conçu (rôles adaptés, élévation à la demande), il ne gêne que les accès inutiles.
- **« La séparation des tâches exige beaucoup de personnel. »** Elle demande au moins deux personnes pour les opérations critiques. Dans les petites équipes, on compense par des revues a posteriori ou des tiers.
- **« Un administrateur doit pouvoir tout faire. »** Non. Même un administrateur a des limites : par exemple, ne pas pouvoir effacer sa propre trace.

#### Principe clé

Donnez le moins de droits possible, pour le moins de temps possible, et faites intervenir une seconde personne pour toute action dont une erreur serait grave.

#### Si vous ne retenez que trois choses

1. Le moindre privilège limite les droits au strict nécessaire et à la durée nécessaire.
2. La séparation des tâches empêche qu'une seule personne mène seule une opération critique.
3. Les deux se mettent en œuvre par des règles vérifiées par le moteur, et par des revues régulières.

### 3. Explication technique détaillée

#### Moindre privilège : les pratiques

| Pratique | Description |
|---|---|
| Refus par défaut | Rien n'est permis sans règle explicite |
| Rôles étroits | Un rôle par fonction, avec les permissions utiles |
| Portée minimale | Attribution sur une base plutôt que sur le tenant |
| Élévation à la demande | Droit d'administration accordé pour une heure, avec motif |
| Comptes distincts | Un compte d'usage courant et un compte d'administration |
| Services limités | Clé d'API ou compte de service aux droits strictement nécessaires |
| Recertification | Les responsables confirment périodiquement chaque droit |
| Retrait automatique | Les droits expirent, sauf renouvellement |

#### Une élévation à la demande

```json
{
  "request": {
    "user": "u_admin_02",
    "permission": "role:assign",
    "duration_minutes": 60,
    "reason": "Création d'un rôle pour l'audit externe (ticket 4821)",
    "approver": "u_secu_01"
  },
  "status": "approved",
  "expires_at": "2026-10-13T15:30:00Z"
}
```

#### Séparation des tâches : exemples d'incompatibilités

| Action A | Action B incompatible | Raison |
|---|---|---|
| Saisir un constat | Approuver ce constat | Aucun contrôle indépendant |
| Créer un fournisseur | Valider son paiement | Fraude possible |
| Modifier une politique d'accès | Approuver cette modification | Auto-validation |
| Demander une dérogation | Accorder cette dérogation | Contournement |

#### Les deux formes

| Forme | Règle | Exemple |
|---|---|---|
| Statique | Un utilisateur ne peut pas cumuler deux rôles incompatibles | « Saisisseur » et « Approbateur » ne se cumulent pas |
| Dynamique | Un utilisateur peut avoir les deux rôles mais pas agir sur le même objet | Il approuve les constats saisis par d'autres |

Ces deux formes correspondent aux contraintes statiques et dynamiques du modèle RBAC du NIST.

#### La vérification à l'exécution

```text
approuver(utilisateur, demande) :
    si demande.demandeur = utilisateur           ─► refuser (auto-approbation)
    si utilisateur a agi sur cette demande avant ─► refuser
    si une délégation fait de l'utilisateur le demandeur par un autre chemin ─► refuser
    sinon                                         ─► autoriser
```

C'est l'invariant du plan : « un utilisateur ne peut pas approuver sa propre demande » (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).

#### Les revues d'accès

Chaque trimestre, par exemple, chaque responsable reçoit la liste des droits de ses équipes, et confirme ou retire. Les droits non confirmés sont retirés. Les résultats sont conservés comme preuve (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

**Contre-exemple.** Un compte « admin » partagé par toute l'équipe d'exploitation, utilisé pour toutes les tâches. Aucune action n'est attribuable, aucun droit n'est limité, et la séparation des tâches est impossible à vérifier.

**Limites.** Dans les très petites organisations, la séparation complète est difficile. On compense par une revue a posteriori, un journal immuable et l'intervention d'un tiers (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.14 RBAC](#414-rbac) | Les contraintes de séparation des tâches sont définies sur les rôles |
| [4.21 Délégation](#421-délégation) | Une délégation ne doit pas contourner la séparation des tâches |
| [4.3 Identités non humaines](#43-identités-non-humaines) | Les comptes de service suivent le moindre privilège avec une rigueur particulière |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La gouvernance organise les revues et les approbations |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | La séparation des tâches s'exprime comme des invariants |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust prolonge le moindre privilège par une vérification continue |

### 5. Application pratique

**Situation initiale.** Une compagnie a un processus d'approbation des constats d'inspection. Un audit externe constate qu'un planificateur a approuvé des constats qu'il avait lui-même saisis.

**Problème.** Aucun contrôle ne l'empêchait, et l'audit remet en cause la valeur des approbations.

**Application du concept.** La plateforme applique une règle de séparation dynamique et resserre les rôles.

**Déroulé.**

1. L'administrateur active la règle « le saisisseur ne peut pas approuver sa saisie ».
2. Il retire le droit d'approbation aux rôles qui n'en ont pas besoin.
3. Il met en place une recertification trimestrielle des approbateurs.
4. Les tentatives d'auto-approbation sont refusées et journalisées.

**Résultat.** Chaque constat approuvé l'est par une personne distincte de son auteur, avec une preuve.

**Limites.** Dans une base distante avec une seule personne, la règle bloque le processus : il faut prévoir une approbation à distance ou une exception tracée (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que demande le principe du moindre privilège ?
2. **Compréhension.** Que signifie « quatre yeux » ?
3. **Compréhension.** Quelle différence y a-t-il entre séparation statique et dynamique ?
4. **Pourquoi.** Pourquoi accorde-t-on des droits d'administration pour une durée limitée plutôt que de façon permanente ?
5. **Raisonnement pratique.** Comment empêcher qu'un utilisateur approuve sa propre demande, même avec une délégation ?

#### Réponses

1. Que chaque sujet n'ait que les droits strictement nécessaires à ses tâches, pour la durée nécessaire.
2. Que deux personnes distinctes interviennent pour mener une opération critique : l'une propose, l'autre valide.
3. La séparation statique interdit de cumuler deux rôles incompatibles. La séparation dynamique permet de les cumuler mais interdit d'agir dans les deux sur le même objet.
4. Pour réduire la fenêtre d'exposition : un compte compromis ou une erreur ont un impact limité dans le temps, et chaque élévation est justifiée et tracée.
5. En vérifiant, au moment de l'approbation, que l'acteur et la personne au nom de qui il agit sont tous deux distincts du demandeur ; la règle s'applique à toutes les identités en jeu.

