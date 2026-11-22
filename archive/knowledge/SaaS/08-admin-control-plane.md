# Module 8 — Plateforme d'administration et plan de contrôle

> **Question directrice.** Comment permettre à un administrateur de définir le comportement du système sans développeur, sans pour autant le laisser casser le système ?

## Présentation du module

**Objectif.** Les modules précédents ont décrit les moteurs de la plateforme : données, opérations, identités, états, règles, événements. Ce module montre comment on les **rend configurables par des humains** : une interface et une API d'administration qui leur permettent de définir le comportement du système, de façon sûre, versionnée et traçable.

**Prérequis.** Le plan de contrôle ([1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)), et les moteurs des modules 2 à 7. Chaque entrée de ce module renvoie vers les entrées qui expliquent le moteur configuré ; elle ne les répète pas, elle traite l'angle de l'**administration**.

**Ordre retenu.** Le module suit les cinq familles du plan, précédées d'une entrée de principes.

```text
Principes          la plateforme d'administration
Données            modèle de données ─ vues et formulaires
Utilisateurs       identités et accès
Comportement       workflows, règles, politiques, automatisations ─ feature flags
Technique          configuration d'environnement ─ clés d'API, webhooks, intégrations
Opérationnel       journaux, audit, événements, tâches, erreurs, métriques
```

L'idée directrice du plan : l'administrateur **ne manipule pas les données de façon arbitraire**. Il **configure le moteur qui gouverne les opérations**.

```text
        ADMIN
          │
          ▼
   PLAN DE CONTRÔLE
   configuration, politiques, workflows, permissions
          │
          ▼
   MOTEUR D'EXÉCUTION
          │
          ▼
     OPÉRATIONS
```

## Sommaire du module

- [8.1 La plateforme d'administration](#81-la-plateforme-dadministration)
- [8.2 Administration du modèle de données](#82-administration-du-modèle-de-données)
- [8.3 Vues et formulaires configurables](#83-vues-et-formulaires-configurables)
- [8.4 Administration des identités et des accès](#84-administration-des-identités-et-des-accès)
- [8.5 Administration du comportement](#85-administration-du-comportement)
- [8.6 Feature flags](#86-feature-flags)
- [8.7 Configuration d'environnement](#87-configuration-denvironnement)
- [8.8 Administration technique, clés d'API, webhooks et intégrations](#88-administration-technique-clés-dapi-webhooks-et-intégrations)
- [8.9 Administration opérationnelle](#89-administration-opérationnelle)

## 8.1 La plateforme d'administration

### 1. Comprendre simplement

La **plateforme d'administration** (*admin platform*) est l'ensemble des écrans, des API et des procédures par lesquels des personnes habilitées **définissent et pilotent le comportement** de la plateforme pour leur tenant (et, pour le fournisseur, pour la plateforme elle-même). C'est le visage humain du plan de contrôle.

**Pourquoi cela existe.** Une plateforme configurable n'a de valeur que si la configuration est accessible, sûre et compréhensible. Sans une vraie plateforme d'administration, la configuration reste dans le code, dans des demandes de support ou dans des scripts, et le client dépend du fournisseur pour chaque changement.

**Problème résolu.** Rendre le client autonome pour adapter la plateforme à son métier, tout en protégeant le système et les autres clients.

**Modèle mental.** Une salle de contrôle. Les opérateurs ne touchent pas directement aux installations : ils agissent par un pupitre qui valide chaque commande, empêche les manœuvres dangereuses et enregistre tout.

**Où l'analogie s'arrête.** Une salle de contrôle est tenue par des spécialistes formés. Les administrateurs d'une plateforme SaaS ont des niveaux de compétence très variés : l'interface doit les guider et les protéger.

**Exemple.** Un administrateur de la compagnie ajoute un statut à un type, modifie un workflow d'approbation, crée un rôle et configure un webhook : tout cela depuis la même console, avec les mêmes garde-fous, sans développeur.

**Les composants.**

1. une **API de configuration** (le vrai plan de contrôle) ;
2. une **console d'administration** (client de cette API) ;
3. un **stockage de configuration** versionné ;
4. un **moteur de validation et d'impact** ;
5. un **processus de changement** (brouillon, publication, retour arrière) ;
6. un **modèle de droits d'administration** et un **audit**.

**Objectif d'apprentissage :** vous pouvez décrire l'architecture d'une plateforme d'administration et dire pourquoi la console doit être un simple client de l'API de configuration.

### 2. Connaissances essentielles

#### Définition

La **plateforme d'administration** est la partie de la plateforme qui expose, par une interface et une API, les moyens de créer, modifier, valider, publier et auditer la configuration qui gouverne le comportement des moteurs d'exécution.

#### Idées fondamentales

1. **L'API d'abord.** Tout ce que la console fait, l'API le permet : automatisation et « configuration comme code ».
2. **La configuration est une donnée versionnée.** Chaque changement est une nouvelle version, avec auteur et motif.
3. **Un changement suit un cycle.** Brouillon, validation, aperçu ou simulation, publication, surveillance, retour arrière.
4. **L'administrateur configure, il n'écrit pas les données à la main.** Il agit sur les moteurs, pas sur la base (voir [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime)).
5. **Les garde-fous sont dans le système.** Validation, limites, analyse d'impact.
6. **L'administration a ses propres droits.** Qui peut configurer quoi est un sujet d'autorisation à part entière.

#### Vocabulaire essentiel

- **Console d'administration** (*admin console*) : interface graphique de la plateforme d'administration.
- **API de configuration** (*configuration API*, *admin API*) : interface programmable du plan de contrôle.
- **Brouillon** et **publication** (*draft*, *publish*) : états d'un changement avant et après sa mise en service.
- **Analyse d'impact** (*impact analysis*) : calcul de ce qu'un changement touche.
- **Configuration comme code** (*configuration as code*) : gestion de la configuration en fichiers versionnés et revus.
- **Garde-fou** (*guardrail*) : contrôle qui empêche une action dangereuse.
- **Administrateur délégué** (*delegated admin*) : administrateur limité à une partie du tenant.

#### Relations de cause à effet

- La console fait des choses que l'API ne sait pas faire. L'automatisation est impossible, les environnements ne se synchronisent pas, et le support reproduit les actions à la main.
- La configuration est modifiée directement en base « pour aller vite ». Elle échappe aux validations, à l'historique et à la propagation, et le comportement devient inexplicable.
- Un administrateur retire ses propres droits ou ceux du dernier administrateur. Plus personne ne peut administrer le tenant.

#### Idées reçues

- **« Une console d'administration est un simple écran de formulaires. »** C'est un produit complet : validation, impact, versions, droits, audit, simulation.
- **« Plus de souplesse pour l'administrateur, c'est mieux. »** Une souplesse sans garde-fous crée des erreurs graves ; elle doit être bornée et guidée.
- **« Les administrateurs savent ce qu'ils font. »** Ils ont des profils variés, parfois peu techniques : le système doit réduire le risque d'erreur.

#### Principe clé

Chaque capacité de configuration est une API, un objet versionné et un cycle de changement protégé ; la console n'en est que l'une des formes d'accès.

#### Si vous ne retenez que trois choses

1. L'administration passe par une API de configuration ; la console n'en est qu'un client.
2. Un changement de configuration suit un cycle : brouillon, validation, aperçu, publication, retour arrière.
3. Les garde-fous, l'audit et les droits d'administration sont des fonctions de la plateforme, pas des options.

### 3. Explication technique détaillée

#### L'architecture

```text
  Console web     CLI / Terraform / scripts     Intégrations
        │                  │                        │
        └──────────────────┼────────────────────────┘
                           ▼
                 API de configuration (plan de contrôle)
          ┌────────────┬────────────┬──────────────┬────────────┐
          │ Droits     │ Validation │ Impact       │ Versions   │
          │ d'admin    │ + limites  │ + simulation │ + audit    │
          └────────────┴──────┬─────┴──────────────┴────────────┘
                              ▼
                  Stockage de configuration versionné
                              │ propagation
                              ▼
                 Moteurs d'exécution (plan de données)
```

#### Ce que chaque famille administre

| Famille | Objets configurés | Moteur concerné | Entrées liées |
|---|---|---|---|
| Données | Types, champs, relations, validations | Moteur de ressources | [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles), [8.2 Administration du modèle de données](#82-administration-du-modèle-de-données) |
| Présentation | Vues, formulaires | Moteur d'interface | [8.3 Vues et formulaires configurables](#83-vues-et-formulaires-configurables) |
| Identités | Utilisateurs, groupes, rôles, permissions | Identité et accès | [4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation), [8.4 Administration des identités et des accès](#84-administration-des-identités-et-des-accès) |
| Comportement | Workflows, règles, politiques, automatisations | Moteurs d'états, de règles, d'événements | [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche), [8.5 Administration du comportement](#85-administration-du-comportement) |
| Déploiement | Drapeaux, environnements | Plateforme | [8.6 Feature flags](#86-feature-flags), [8.7 Configuration d'environnement](#87-configuration-denvironnement) |
| Technique | Clés d'API, webhooks, intégrations | API et événements | [8.8 Administration technique, clés d'API, webhooks et intégrations](#88-administration-technique-clés-dapi-webhooks-et-intégrations) |
| Opérationnel | Journaux, audit, tâches, erreurs, métriques | Observabilité | [8.9 Administration opérationnelle](#89-administration-opérationnelle) |

#### Le cycle de vie d'un changement

```text
Brouillon ──► Validation ──► Aperçu / simulation ──► Approbation ──► Publication ──► Surveillance
 (édition)   (cohérence,     (impact, essai à       (si requise,    (nouvelle      (erreurs,
              limites,        blanc)                 voir 9.7)       version)       usage)
              droits)                                                    │
                                                                         └──► Retour arrière
```

```http
PUT  /admin/v1/resource-types/aircraft/drafts/d_81   (modifier un brouillon)
POST /admin/v1/resource-types/aircraft/drafts/d_81/validate
POST /admin/v1/resource-types/aircraft/drafts/d_81/impact
POST /admin/v1/resource-types/aircraft/drafts/d_81/publish
POST /admin/v1/resource-types/aircraft/versions/12/rollback
```

#### Les droits d'administration

| Règle | Raison |
|---|---|
| Permissions d'administration distinctes des permissions métier | Un planificateur n'est pas un concepteur de modèle |
| On n'accorde pas ce que l'on n'a pas | Évite l'élévation de privilège |
| Au moins un administrateur doit rester | Évite le verrouillage |
| Portée par sous-arbre pour les administrateurs délégués | Un directeur de filiale n'administre que sa filiale (voir [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise)) |
| Actions sensibles : second facteur et approbation | Réduit le risque d'erreur et de compromission |

#### La configuration comme code

```yaml
# aircraft.yaml : type de ressource, versionné dans un dépôt du client
resource_type: aircraft
label: Aéronef
fields:
  - { api_name: registration, type: string, required: true, unique: true }
  - { api_name: status, type: enum, values: [active, in_inspection, retired] }
workflows: [aircraft_lifecycle]
```

Le client peut ainsi relire les changements, les tester dans un environnement d'essai et les promouvoir (voir [8.7 Configuration d'environnement](#87-configuration-denvironnement)), comme il le ferait pour du code.

#### Les modes de défaillance

- **Fonction console sans API** : impossible à automatiser et à reproduire.
- **Configuration modifiée hors circuit** : pas de version, pas d'audit, pas de validation.
- **Verrouillage** : le dernier administrateur se retire ses droits.
- **Dérive** : la configuration de l'environnement d'essai diffère de la production sans que l'on sache comment.
- **Garde-fous contournables** : des limites appliquées par l'interface mais pas par l'API.

**Contre-exemple.** Un écran « paramètres avancés » qui écrit directement en base sans passer par la validation ni l'historique. Un seul administrateur peut modifier un comportement global sans que personne ne puisse le retracer.

**Limites.** Une plateforme d'administration riche est un produit à part entière, avec ses utilisateurs, sa documentation et sa dette. Il faut y investir comme dans le reste du produit (voir [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | Elle est l'interface humaine du plan de contrôle |
| [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime) | La vue transversale reprend la distinction entre configurer et exécuter |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | La configuration y est versionnée |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La gouvernance encadre les changements sensibles |
| [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration) | L'expérience d'administration est un sujet de conception à part |
| [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | La configuration sûre en est l'enjeu central |

### 5. Application pratique

**Situation initiale.** Les demandes de modification de la configuration d'un client passent par le support, qui les applique à la main dans des écrans internes. Le délai moyen est de trois jours.

**Problème.** Le client est dépendant, le support est saturé, et les changements ne sont ni versionnés ni testés.

**Application du concept.** Les capacités de configuration sont exposées par une API de configuration, avec une console client, des droits d'administration et un cycle de changement.

**Déroulé.**

1. Le fournisseur définit les objets de configuration (types, workflows, rôles) comme des ressources versionnées.
2. Il expose l'API et construit la console par-dessus.
3. L'administrateur du client modifie un workflow en brouillon, lance la validation et l'analyse d'impact.
4. Il publie ; la plateforme propage la nouvelle version.
5. Une erreur est détectée ; il revient à la version précédente en un clic.

**Résultat.** Le délai de changement passe de trois jours à quelques minutes, sans intervention du support, et chaque changement est tracé.

**Limites.** Les clients doivent être formés, et les actions les plus risquées (par exemple modifier les droits d'administrateur) restent soumises à approbation.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la console doit-elle être un client de l'API de configuration ?
2. **Compréhension.** Quelles sont les étapes du cycle de vie d'un changement de configuration ?
3. **Compréhension.** Pourquoi les droits d'administration sont-ils distincts des droits métier ?
4. **Pourquoi.** Pourquoi interdit-on à un administrateur de s'accorder des droits qu'il n'a pas ?
5. **Raisonnement pratique.** Le dernier administrateur d'un tenant supprime son propre rôle. Comment la plateforme doit-elle réagir ?

#### Réponses

1. Pour que toute fonction de la console soit automatisable, reproductible et soumise aux mêmes contrôles que n'importe quel accès.
2. Brouillon, validation, aperçu ou simulation, approbation éventuelle, publication, surveillance et retour arrière si nécessaire.
3. Parce que configurer le système est un pouvoir différent d'utiliser l'application métier : un planificateur n'a pas à concevoir le modèle de données.
4. Pour éviter l'élévation de privilège : un administrateur ne peut déléguer que ce qu'il possède.
5. Elle doit refuser l'opération, pour garantir qu'au moins un administrateur reste capable d'administrer le tenant.

## 8.2 Administration du modèle de données

### 1. Comprendre simplement

L'**administration du modèle de données** est la fonction de la plateforme d'administration qui permet de **définir et de faire évoluer** les types de ressources (*resource types*), leurs champs (*fields*), leurs relations (*relations*) et leurs règles de validation (*validation*), sans développeur.

**Pourquoi cela existe.** C'est la face humaine de la promesse de la plateforme : le métier se décrit en données (voir [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)). Sans interface adaptée, cette capacité reste réservée aux experts. Avec elle, un responsable métier peut ajouter un champ ou un type.

**Problème résolu.** Permettre de modéliser et de faire évoluer le domaine du client en toute sécurité, malgré les données qui existent déjà et les systèmes qui en dépendent.

**Modèle mental.** Un atelier de conception de formulaire et de plan de classement. On dessine les rubriques et leurs liens, mais le système vérifie que le dessin reste cohérent avec ce qui est déjà rangé.

**Où l'analogie s'arrête.** Un plan de classement papier se modifie sans conséquence immédiate. Ici, chaque modification touche des données vivantes, des API, des vues et des règles.

**Exemple.** L'administrateur ajoute au type *Aéronef* un champ « Niveau de bruit », le rend obligatoire pour les nouveaux enregistrements, avec une valeur par défaut, et le lie à une règle de validation.

**Les composants.**

1. un **concepteur de types** ;
2. un **concepteur de champs** ;
3. un **concepteur de relations** ;
4. un **éditeur de validations** ;
5. une **analyse d'impact et de dépendances**.

**Objectif d'apprentissage :** vous pouvez décrire les garde-fous d'une modification de modèle, et expliquer comment éviter de casser des données ou des intégrations.

### 2. Connaissances essentielles

#### Définition

L'**administration du modèle de données** est l'ensemble des fonctions d'interface et d'API permettant de créer, modifier, dépublier et supprimer les types de ressources, leurs champs, leurs relations et leurs règles de validation, avec contrôle de cohérence, d'impact et de version.

#### Idées fondamentales

1. **Chaque changement est classé.** Compatible ou cassant (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)).
2. **L'impact est calculé avant publication.** Ressources, vues, règles, workflows, API concernés.
3. **Les noms techniques sont stables.** Le renommage d'un libellé est libre ; celui d'un nom technique est une migration.
4. **La suppression est progressive.** Masquer, déprécier, puis supprimer après un délai.
5. **Des limites protègent la plateforme.** Nombre de champs, de types, de relations.
6. **Le modèle de données est protégé.** Seuls certains rôles peuvent le modifier.

#### Vocabulaire essentiel

- **Concepteur** (*designer*) : outil visuel de définition.
- **Graphe de dépendances** (*dependency graph*) : carte de ce qui utilise un élément.
- **Dépréciation** (*deprecation*) : marquage d'un élément en vue de son retrait.
- **Remplissage rétroactif** (*backfill*) : calcul d'une valeur pour les ressources existantes.
- **Mode lecture seule** : état où un champ ne peut plus être modifié, mais reste lisible.
- **Taux de remplissage** (*fill rate*) : proportion de ressources où un champ a une valeur.
- **Statistiques d'usage** (*usage analytics*) : où et quand un champ est lu ou écrit.

#### Relations de cause à effet

- Un champ est supprimé d'un clic. Les vues, règles et intégrations qui l'utilisent échouent sans avertissement.
- Un champ devient obligatoire alors que les données existantes en sont dépourvues. Les ressources deviennent invalides à leur prochaine modification.
- Le nom technique est modifié. Les API, les imports et les exports cessent de fonctionner.

#### Idées reçues

- **« Ajouter un champ est toujours sans risque. »** C'est le changement le plus sûr, mais il demande de réfléchir à son intégration (vues, API, droits).
- **« On peut supprimer un champ inutilisé. »** Il faut vérifier les dépendances, y compris externes, et conserver les données pendant un délai.
- **« Le modèle appartient à l'équipe technique. »** Il appartient au métier ; la technique fournit les garde-fous.

#### Principe clé

Un changement de modèle est un changement de contrat : classez-le, mesurez son impact, appliquez-le par étapes, et gardez le moyen de revenir en arrière.

#### Si vous ne retenez que trois choses

1. L'administration du modèle de données applique le cycle brouillon, impact, publication.
2. Les noms techniques sont stables ; la suppression est progressive.
3. Le graphe de dépendances et les statistiques d'usage rendent l'impact visible.

### 3. Explication technique détaillée

#### Les opérations et leur risque

| Opération | Risque | Garde-fou |
|---|---|---|
| Ajouter un champ facultatif | Faible | Visibilité dans vues et droits à décider |
| Ajouter un champ obligatoire | Moyen | Valeur par défaut ou remplissage rétroactif |
| Modifier un libellé, une aide | Faible | Aucun |
| Renommer un nom technique | Élevé | Interdit, ou alias pendant une transition |
| Changer le type d'un champ | Élevé | Conversion contrôlée, rapport des valeurs non convertibles |
| Restreindre une contrainte | Élevé | Contrôle des données existantes |
| Supprimer un champ | Élevé | Dépréciation, retrait des dépendances, conservation |
| Changer une cardinalité | Élevé | Migration des relations existantes |

#### Un rapport d'impact

```json
{
  "change": "make_required",
  "target": "aircraft.noise_level",
  "impact": {
    "resources_without_value": 412,
    "resources_total": 1240,
    "views_using": ["fleet_overview", "noise_report"],
    "forms_using": ["aircraft_edit"],
    "workflows_using": [],
    "rules_using": ["noise_threshold_check"],
    "integrations_reading": ["ep_quality_system"]
  },
  "recommendation": "Définir une valeur par défaut ou lancer un remplissage rétroactif avant publication.",
  "blocking": true
}
```

**Comment le lire.** Le changement est bloqué : 412 aéronefs n'ont pas de valeur. Le rapport liste ce qui utilise le champ, y compris une intégration externe qui l'a lu récemment.

#### La suppression progressive

```text
Actif ──► Déprécié (masqué dans les formulaires, lecture seule)
            │ période de grâce (par exemple 90 jours), usage externe surveillé
            ▼
        Retiré (plus accessible par l'API, données conservées)
            │ rétention
            ▼
        Supprimé (données effacées)
```

#### Les statistiques d'usage

| Indicateur | Utilité |
|---|---|
| Taux de remplissage | Un champ rempli à 2 % est peut-être inutile |
| Dernière lecture ou écriture par l'API | Détecte les intégrations qui en dépendent |
| Nombre de vues, règles, workflows qui l'utilisent | Mesure l'impact d'une suppression |
| Date de création et auteur | Retrouver la responsabilité |

#### Les limites

| Limite | Raison |
|---|---|
| Nombre de champs par type | Lisibilité, performance des formulaires et des requêtes |
| Nombre de types et de relations | Complexité du modèle, graphe de requêtes |
| Profondeur d'héritage | Compréhension, performance |
| Nombre de champs filtrables | Nombre d'index (voir [2.14 Index](02-donnees-ressources.md#214-index)) |

**Contre-exemple.** Un bouton « Supprimer ce champ » qui supprime immédiatement et définitivement les valeurs. Une suppression par erreur est irréversible, et l'intégration d'un partenaire échoue sans qu'on comprenne pourquoi.

**Limites.** Le calcul d'impact ne voit que ce que la plateforme connaît. Les usages externes non déclarés restent invisibles, d'où l'intérêt d'une période de dépréciation avec surveillance.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique) | Il en est l'interface humaine |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | Il applique les règles d'évolution de schéma |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | L'éditeur de validations y est intégré |
| [8.3 Vues et formulaires configurables](#83-vues-et-formulaires-configurables) | Les vues et formulaires dépendent des champs définis ici |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement de la configuration s'y applique |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | L'impact doit être rendu visible à l'administrateur |

### 5. Application pratique

**Situation initiale.** Le service environnement de la compagnie veut suivre le niveau de bruit de chaque aéronef et l'exiger pour les nouveaux enregistrements.

**Problème.** 1 240 aéronefs existent déjà sans cette valeur, et une intégration lit les aéronefs toutes les nuits.

**Application du concept.** L'administrateur modifie le modèle par étapes, avec analyse d'impact.

**Déroulé.**

1. Il crée le champ « Niveau de bruit », facultatif, et publie.
2. Il lance un remplissage rétroactif à partir d'un fichier de mesures.
3. Le taux de remplissage atteint 100 % ; il rend le champ obligatoire. L'analyse d'impact ne signale plus de blocage.
4. Il ajoute le champ aux vues et au formulaire.
5. L'intégration reçoit le nouveau champ ; elle l'ignore sans erreur.

**Résultat.** Le modèle évolue sans rendre de ressource invalide ni casser l'intégration.

**Limites.** Si l'intégration avait rejeté les champs inconnus, elle aurait échoué : le contrat d'API doit tolérer les ajouts (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels éléments un administrateur peut-il définir dans le modèle de données ?
2. **Compréhension.** Pourquoi la suppression d'un champ est-elle progressive ?
3. **Compréhension.** À quoi sert le taux de remplissage ?
4. **Pourquoi.** Pourquoi les noms techniques sont-ils stables ?
5. **Raisonnement pratique.** Un administrateur veut rendre un champ obligatoire alors que 30 % des ressources n'ont pas de valeur. Que doit proposer la plateforme ?

#### Réponses

1. Des types de ressources, des champs, des relations et des règles de validation.
2. Pour laisser le temps de retirer les dépendances et de détecter les usages externes, et pour pouvoir revenir en arrière.
3. À mesurer l'usage réel d'un champ, par exemple pour décider de le déprécier ou pour évaluer l'impact d'une obligation.
4. Parce que les API, les imports, les exports et les règles les utilisent : les changer casse ces dépendances.
5. De bloquer la publication tant que les valeurs manquent, et de proposer une valeur par défaut ou un remplissage rétroactif, avec le détail des ressources concernées.

## 8.3 Vues et formulaires configurables

### 1. Comprendre simplement

Une **vue** (*view*) définit **comment une liste de ressources est présentée** : quelles colonnes, quels filtres, quel tri, quel regroupement, et pour qui. Un **formulaire** (*form*) définit **comment une ressource est saisie ou modifiée** : quels champs, dans quel ordre, avec quelles sections, quelles conditions d'affichage et quelles aides. Ce sont des métadonnées que le moteur d'interface interprète.

**Pourquoi cela existe.** Des rôles différents ont besoin de présentations différentes des mêmes données : le planificateur veut les échéances, le technicien les tâches, la direction des totaux. Si chaque présentation exige du développement, la plateforme n'est plus configurable.

**Problème résolu.** Adapter la présentation et la saisie aux besoins de chacun, sans code.

**Modèle mental.** Des fiches de lecture différentes d'une même base de données : une fiche courte pour l'accueil, une fiche détaillée pour le responsable, un formulaire simplifié pour le terrain.

**Où l'analogie s'arrête.** Une fiche imprimée est figée. Une vue configurée s'adapte aux évolutions du modèle, aux droits de celui qui la regarde et à la quantité de données.

**Exemple.** La vue « Aéronefs à inspecter ce mois-ci » affiche l'immatriculation, la base et l'échéance, triée par date, filtrée sur 30 jours, visible par les planificateurs. Le formulaire « Constat » ne montre le champ « Mesure » que si le type de constat est « Usure ».

**Les composants.**

1. une **définition de vue** (colonnes, filtres, tri, regroupements, portée) ;
2. une **définition de formulaire** (sections, champs, conditions) ;
3. un **moteur d'affichage** ;
4. des **règles de partage** (personnel, équipe, tenant).

**Objectif d'apprentissage :** vous pouvez décrire une vue et un formulaire comme des données, et expliquer pourquoi masquer un champ dans un formulaire ne le protège pas.

### 2. Connaissances essentielles

#### Définition

- **Vue configurable** (*configurable views*) : définition déclarative d'une présentation de liste (colonnes, filtres, tri, regroupement, agrégats), associée à un type de ressource et à une audience.
- **Formulaire configurable** (*configurable forms*) : définition déclarative d'une interface de saisie (mise en page, champs, valeurs par défaut, règles d'affichage et d'édition).

#### Idées fondamentales

1. **Une vue est une requête enregistrée.** Elle se compile vers le modèle de requête de la plateforme (voir [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête)).
2. **Un formulaire est une mise en forme du schéma.** Il ne définit pas la structure, il la présente.
3. **L'affichage ne remplace pas la sécurité.** Un champ masqué à l'écran reste lisible par l'API sans droit de champ.
4. **Les vues s'adaptent aux droits.** Elles n'affichent que ce que l'utilisateur peut voir.
5. **Le partage est géré.** Vue personnelle, d'équipe, du tenant, par défaut.
6. **Elles évoluent avec le modèle.** Un champ supprimé ne doit pas casser une vue.

#### Vocabulaire essentiel

- **Colonne** (*column*) : champ ou calcul affiché dans une liste.
- **Filtre enregistré** (*saved filter*) : condition réutilisable.
- **Regroupement** (*grouping*) : organisation des lignes par valeur d'un champ.
- **Section** (*section*) : groupe de champs dans un formulaire.
- **Visibilité conditionnelle** (*conditional visibility*) : champ affiché selon la valeur d'autres champs.
- **Vue par défaut** (*default view*) : vue présentée par défaut à une audience.
- **Mise en page** (*layout*) : disposition des éléments.

#### Relations de cause à effet

- Une vue est créée à partir d'un champ. Si le champ est supprimé sans contrôle, la vue affiche une erreur ou une colonne vide.
- Un formulaire masque un champ « interne ». L'API le retourne encore, et un utilisateur averti le lit.
- Les vues partagées sont trop nombreuses. Les utilisateurs ne s'y retrouvent plus, et chacun crée la sienne.

#### Idées reçues

- **« Configurer un formulaire, c'est configurer la sécurité. »** Non. La visibilité d'un champ dans un formulaire est une présentation ; la sécurité est portée par les droits (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **« Une vue n'est qu'un filtre. »** Elle a aussi des colonnes, un tri, des regroupements, des agrégats, une audience.
- **« Les formulaires configurables sont aussi soignés que ceux dessinés à la main. »** Ils le deviennent par de bonnes métadonnées de présentation (groupes, aides, ordre).

#### Principe clé

Les vues et les formulaires décrivent la présentation ; les droits et le schéma portent la sécurité et la structure. Les trois restent distincts.

#### Si vous ne retenez que trois choses

1. Une vue est une requête enregistrée avec sa présentation ; un formulaire est une mise en forme du schéma.
2. Masquer n'est pas protéger : la sécurité relève des droits de champ et de ligne.
3. Vues et formulaires doivent résister aux changements du modèle et s'adapter aux droits de l'utilisateur.

### 3. Explication technique détaillée

#### Une vue comme donnée

```json
{
  "key": "aircraft_due_this_month",
  "type": "aircraft",
  "label": "Aéronefs à inspecter ce mois-ci",
  "columns": ["registration", "model", "base.name", "next_inspection_date", "open_tasks"],
  "filter": {
    "and": [
      { "field": "status", "op": "eq", "value": "active" },
      { "field": "next_inspection_date", "op": "lte", "value": { "fn": "today_plus_days", "args": [30] } }
    ]
  },
  "sort": [{ "field": "next_inspection_date", "dir": "asc" }],
  "group_by": "base.name",
  "audience": { "roles": ["planner", "quality_manager"] },
  "page_size": 50
}
```

#### Un formulaire comme donnée

```json
{
  "key": "finding_edit",
  "type": "finding",
  "sections": [
    { "title": "Constat",
      "fields": [ { "field": "title", "required": true },
                  { "field": "category" },
                  { "field": "severity" } ] },
    { "title": "Mesures",
      "visible_when": "category = 'wear'",
      "fields": [ { "field": "measure_value" },
                  { "field": "measure_unit" } ] },
    { "title": "Approbation",
      "fields": [ { "field": "approval_status", "read_only": true } ],
      "visible_for_roles": ["quality_manager"] }
  ]
}
```

**Comment la lire.** Le formulaire a trois sections. La section « Mesures » n'apparaît que pour les constats d'usure. La section « Approbation » n'est visible que pour le responsable qualité, et son champ est en lecture seule.

#### La compilation d'une vue

```text
Définition de vue ──► requête déclarative (filtre, tri, champs)
                          │ ajout du tenant, des droits de ligne et de champ
                          ▼
                    requête paramétrée ──► page de résultats
```

La vue ne contourne pas les contrôles : elle passe par le même modèle de requête et les mêmes droits que l'API.

#### Les niveaux de partage

| Niveau | Portée | Qui peut créer |
|---|---|---|
| Personnel | Créateur | Tout utilisateur |
| Équipe | Un groupe ou une unité | Responsable d'équipe |
| Tenant | Tous les utilisateurs de l'audience | Administrateur |
| Par défaut | Présentée automatiquement | Administrateur |
| Plateforme | Fournie par la plateforme | Fournisseur |

#### La résistance aux changements du modèle

| Changement | Effet sur les vues et formulaires | Comportement attendu |
|---|---|---|
| Champ ajouté | Aucun | Disponible à l'ajout |
| Champ renommé (libellé) | Aucun | Libellé mis à jour |
| Champ retiré | Colonne ou champ invalide | Signalement à l'administrateur, élément ignoré à l'affichage |
| Type modifié | Filtre ou tri incompatible | Vue marquée « à corriger » |
| Droit de champ retiré | Colonne non visible pour certains | Colonne absente, sans erreur |

**Contre-exemple.** Utiliser la « visibilité par rôle » d'un champ de formulaire comme seul moyen de cacher le coût de maintenance aux techniciens. Un technicien averti appelle l'API et l'obtient.

**Limites.** Un excès de configuration produit des interfaces incohérentes. La plateforme propose des modèles de vues et de formulaires, des règles de conception et des limites pour garder une interface compréhensible (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Une vue est une requête enregistrée |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits de champ et de ligne s'y appliquent |
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) | Un formulaire présente les champs du schéma |
| [12.5 Formulaires et assistants](12-produit-ux.md#125-formulaires-et-assistants) | Les principes de conception des formulaires en précisent la qualité |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | Les principes de conception des tables et des vues |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | L'interface s'adapte aux droits et aux rôles |

### 5. Application pratique

**Situation initiale.** Les planificateurs veulent une liste des aéronefs dont l'inspection arrive dans 30 jours, groupée par base. Les techniciens veulent un formulaire de constat simplifié sur tablette.

**Problème.** Ces deux demandes ne justifient pas un développement ; elles reviennent à chaque nouveau client.

**Application du concept.** L'administrateur crée une vue et un formulaire à partir du modèle existant.

**Déroulé.**

1. Il choisit le type *Aéronef* et définit les colonnes, le filtre « échéance dans 30 jours » et le regroupement par base.
2. Il limite la vue aux rôles planificateur et responsable qualité.
3. Il crée un formulaire de constat avec trois sections, dont une conditionnelle.
4. Il définit ces deux éléments comme défauts de leurs audiences.

**Résultat.** Les deux besoins sont satisfaits en quelques minutes, avec les mêmes droits et la même sécurité que le reste.

**Limites.** Si le champ « base » est renommé plus tard par le modèle, l'administrateur est averti que la vue dépend de lui.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient la définition d'une vue ?
2. **Compréhension.** Que signifie la visibilité conditionnelle d'une section de formulaire ?
3. **Compréhension.** Pourquoi une vue ne contourne-t-elle pas les droits ?
4. **Pourquoi.** Pourquoi masquer un champ dans un formulaire ne le protège-t-il pas ?
5. **Raisonnement pratique.** Un champ utilisé par trois vues est retiré du modèle. Comment la plateforme doit-elle réagir ?

#### Réponses

1. Un type de ressource, des colonnes, un filtre, un tri, éventuellement un regroupement, des agrégats, une audience et un partage.
2. La section n'est affichée que si une condition portant sur d'autres champs est vraie.
3. Parce qu'elle est compilée vers le même modèle de requête que l'API, qui applique les droits de tenant, de ligne et de champ.
4. Parce que l'API ou un export peut toujours retourner le champ : la sécurité doit être portée par des droits côté serveur.
5. Avertir l'administrateur avant le retrait, lister les vues concernées, et, après retrait, ignorer proprement la colonne en marquant les vues « à corriger ».

## 8.4 Administration des identités et des accès

### 1. Comprendre simplement

L'**administration des identités et des accès** regroupe les fonctions qui permettent de gérer, dans un tenant, les **utilisateurs** (*users*), les **groupes** (*groups*), les **équipes** (*teams*), les **rôles** (*roles*) et les **permissions** (*permissions*) : inviter et désactiver, organiser, attribuer, contrôler et revoir les accès.

**Pourquoi cela existe.** Le [module 4](04-identite-iam-autorisation.md) a décrit les mécanismes. Ici, il s'agit de leur **exploitation** par des personnes : à grande échelle, un administrateur a besoin d'outils pour voir qui a accès à quoi, accorder et retirer en masse, déléguer sans risque et prouver qu'il contrôle.

**Problème résolu.** Permettre de gouverner les accès d'un grand nombre de personnes, de façon lisible, déléguée, sûre et auditable.

**Modèle mental.** La gestion des badges d'un grand site : qui entre où, quels badges sont actifs, quelles zones sont sensibles, et un bilan régulier pour retirer ce qui n'est plus justifié.

**Où l'analogie s'arrête.** Un badge ouvre une porte. Un droit logiciel peut dépendre d'attributs, de relations, de l'état d'une ressource : sa compréhension demande des outils d'explication.

**Exemple.** L'administratrice répond à deux questions : « que peut faire Mathilde ? » et « qui peut approuver un constat critique ? ». Elle organise ensuite une revue trimestrielle des accès.

**Les composants.**

1. une **gestion des utilisateurs** (invitation, statut, groupes) ;
2. un **éditeur de rôles et de permissions** ;
3. une **vue des droits effectifs** ;
4. une **administration déléguée** ;
5. des **revues d'accès** ;
6. les **paramètres d'authentification** (SSO, SCIM, MFA, sessions).

**Objectif d'apprentissage :** vous pouvez décrire les fonctions d'une console des accès et les règles qui empêchent l'élévation de privilège.

### 2. Connaissances essentielles

#### Définition

L'**administration des identités et des accès** est l'ensemble des fonctions d'interface et d'API qui permettent de gérer le cycle de vie des identités d'un tenant, leurs regroupements, leurs rôles et leurs permissions, ainsi que la politique d'authentification et la revue des accès.

#### Idées fondamentales

1. **Voir avant d'agir.** « Que peut faire cette personne ? » et « qui peut faire cela ? » doivent avoir une réponse.
2. **L'administration est déléguée par périmètre.** Chaque administrateur gère son sous-arbre.
3. **On n'accorde pas ce que l'on n'a pas.** Règle contre l'élévation de privilège.
4. **Les opérations de masse sont indispensables.** Invitations, désactivations, changements de rôle par lots.
5. **Les revues sont régulières.** Les droits qui ne sont plus justifiés sont retirés.
6. **Les paramètres d'authentification sont des politiques.** MFA obligatoire, SSO imposé, durée de session.

#### Vocabulaire essentiel

- **Droits effectifs** (*effective permissions*) : résultat de tous les rôles, héritages et politiques.
- **Matrice de permissions** (*permission matrix*) : tableau rôles par permissions.
- **Revue d'accès** (*access review*, *recertification*) : confirmation périodique des droits par les responsables.
- **Élévation de privilège** (*privilege escalation*) : obtention de droits supérieurs à ceux prévus.
- **Prévisualisation en tant que** (*view as*) : voir l'interface telle que la voit un utilisateur.
- **Modèle de rôle** (*role template*) : rôle prédéfini par la plateforme.
- **Dernier administrateur** (*last admin*) : protection contre le verrouillage.

#### Relations de cause à effet

- Aucune vue des droits effectifs. L'administrateur ne sait pas pourquoi une personne a accès, et n'ose plus rien retirer.
- Un administrateur peut créer un rôle avec n'importe quelle permission. Il s'accorde indirectement des droits qu'il n'avait pas.
- Les revues d'accès n'existent pas. Les droits s'accumulent au fil des changements de poste.

#### Idées reçues

- **« Gérer les accès, c'est inviter et supprimer des utilisateurs. »** C'est aussi expliquer, déléguer, réviser et prouver.
- **« L'administrateur du tenant doit pouvoir tout faire. »** Il est borné par les droits d'usage du plan et par les règles de gouvernance (voir [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)).
- **« Plus il y a de rôles, plus on est précis. »** Au-delà de quelques dizaines, l'administration devient ingérable (voir [4.14 RBAC](04-identite-iam-autorisation.md#414-rbac)).

#### Principe clé

Un administrateur d'accès doit pouvoir répondre à « qui peut quoi, et pourquoi », agir par lots, déléguer sans élever les privilèges, et revoir régulièrement.

#### Si vous ne retenez que trois choses

1. La console des accès doit expliquer les droits effectifs, dans les deux sens (par personne, par action).
2. La délégation est bornée et interdit l'élévation de privilège.
3. Les revues régulières et les opérations de masse font passer l'administration à l'échelle.

### 3. Explication technique détaillée

#### Les fonctions principales

| Fonction | Contenu | Remarque |
|---|---|---|
| Utilisateurs | Inviter, activer, suspendre, désactiver, réinitialiser le second facteur | Cycle de vie (voir [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation)) |
| Groupes et équipes | Créer, composer, synchroniser | Groupes dynamiques, synchronisés |
| Rôles | Définir, copier, modèles | Rôles système et personnalisés |
| Attributions | Rôle, portée, durée | Avec date de fin possible |
| Droits effectifs | « Que peut faire X ? » « Qui peut faire Y sur Z ? » | Outil d'explication |
| Revues | Campagnes de recertification | Preuves conservées |
| Sessions | Lister, révoquer | Départ, compromission |
| Authentification | SSO, SCIM, MFA, mots de passe | Politiques par tenant |

#### La vue des droits effectifs

```text
Question : que peut faire Mathilde Durand sur l'aéronef F-ABCD ?

  aircraft:read      ✔   via rôle « Planificateur » (portée : base LYS)
  aircraft:update    ✔   via rôle « Planificateur » (portée : base LYS)
  aircraft:archive   ✖   aucun rôle ne l'accorde
  task:approve       ✖   refusé par la règle « un demandeur n'approuve pas sa demande »
  finding:read       ✔   via groupe « Qualité » (accès hérité de la base LYS)
```

**Pourquoi.** L'explication relie chaque droit à son origine : rôle, groupe, héritage ou règle. Elle rend possibles les décisions de retrait ou d'ajout en connaissance de cause.

#### Les règles contre l'élévation de privilège

| Règle | Exemple |
|---|---|
| On n'accorde pas ce que l'on n'a pas | Un administrateur d'organisation ne peut pas accorder la permission d'administrer le tenant |
| On ne modifie pas son propre niveau d'accès | Un administrateur ne peut pas s'ajouter un rôle supérieur |
| Les rôles créés sont bornés par le catalogue du plan | Pas de permission réservée à la plateforme (voir [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)) |
| Les actions sensibles exigent une validation | Création d'un rôle d'administration : approbation par un second administrateur |
| Le dernier administrateur est protégé | Impossible de retirer ou de désactiver le dernier |

#### Une revue d'accès

```text
Campagne : « Revue trimestrielle Q4 »
  Pour chaque responsable : la liste des droits de ses équipes
  Décision par ligne : Confirmer | Retirer | Modifier
  Rappels automatiques à J+7 et J+14
  Droits non confirmés à J+21 : retirés automatiquement (selon la politique)
  Résultat : rapport conservé comme preuve (voir l'entrée 9.8)
```

#### Les opérations de masse

L'invitation de 300 utilisateurs, la désactivation d'une base entière ou le changement de rôle d'un groupe passent par des opérations de masse avec simulation (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse)), avec un rapport par élément et la possibilité d'annuler.

#### L'aperçu en tant qu'utilisateur

Pour tester les droits, l'administrateur peut afficher l'interface « en tant que » un utilisateur donné, en **lecture seule** et avec journalisation. Cela évite de créer des comptes de test et de deviner l'effet d'un changement.

**Contre-exemple.** Une console qui permet de créer un rôle « Super » avec toutes les permissions du catalogue, y compris celles que le créateur n'a pas, et de se l'attribuer. L'administrateur délégué d'une filiale devient administrateur du tenant.

**Limites.** L'explication des droits effectifs est coûteuse pour les modèles complexes (attributs, relations). On la calcule à la demande, avec des limites de profondeur, et on fournit au minimum la liste des sources.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation) à [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Il rend opérables les mécanismes du module 4 |
| [4.12 SCIM](04-identite-iam-autorisation.md#412-scim) | SCIM automatise une partie de l'administration |
| [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise) | L'administration déléguée suit la hiérarchie d'entreprise |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Le moindre privilège et la revue en sont l'esprit |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Les changements sensibles passent par une gouvernance |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | L'interface s'adapte aux droits et aux rôles |

### 5. Application pratique

**Situation initiale.** Un audit externe demande à la compagnie de justifier les droits d'approbation des constats et de prouver qu'ils sont revus.

**Problème.** L'administrateur ne dispose d'aucune liste claire de ceux qui ont ce droit, ni d'historique de revue.

**Application du concept.** Une campagne de revue d'accès est lancée sur les permissions d'approbation.

**Déroulé.**

1. L'administrateur interroge « qui a `finding:approve` ? » : 23 personnes, par 4 rôles et 2 groupes.
2. Il lance une campagne : chaque responsable confirme les droits de ses équipes.
3. 5 droits sont retirés, 2 sont limités à une base.
4. Le rapport de campagne, avec décideurs et dates, est exporté.

**Résultat.** L'audit obtient la liste, les décisions et les preuves, et le nombre d'approbateurs passe de 23 à 16.

**Limites.** La revue est un instantané : il faut la répéter et automatiser des alertes sur les nouvelles attributions sensibles.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les deux questions auxquelles une console des accès doit répondre ?
2. **Compréhension.** Que fait une revue d'accès ?
3. **Compréhension.** Quelle règle empêche l'élévation de privilège par la création de rôles ?
4. **Pourquoi.** Pourquoi protège-t-on le dernier administrateur ?
5. **Raisonnement pratique.** Un directeur de filiale veut créer un rôle d'administrateur de tenant. Que doit faire la plateforme ?

#### Réponses

1. « Que peut faire cette personne ? » et « qui peut faire cette action sur cette ressource ? ».
2. Elle demande aux responsables de confirmer ou de retirer périodiquement les droits de leurs équipes, et conserve les décisions comme preuves.
3. La règle selon laquelle un administrateur ne peut accorder que des permissions qu'il possède lui-même, dans les limites du catalogue du plan.
4. Pour éviter qu'un tenant devienne impossible à administrer, par erreur ou par attaque.
5. La refuser, car il ne possède pas ce droit : il peut éventuellement demander une approbation à un administrateur du tenant.

## 8.5 Administration du comportement

### 1. Comprendre simplement

L'**administration du comportement** regroupe les outils par lesquels des personnes non développeuses définissent **ce que fait la plateforme** : des **workflows** (*workflows*), des **règles** (*rules*), des **politiques** (*policies*) et des **automatisations** (*automations*). On parle souvent de « low-code » ou de « no-code ».

**Pourquoi cela existe.** Les processus et règles d'un client changent plus vite que le calendrier de livraison du fournisseur. Pour que la plateforme s'adapte, ceux qui connaissent le métier doivent pouvoir les définir et les modifier eux-mêmes.

**Problème résolu.** Rendre le comportement de la plateforme modifiable par le métier, tout en maintenant la fiabilité d'un logiciel.

**Modèle mental.** Un atelier de montage où l'on assemble des procédures à partir de blocs standard : déclencheurs, conditions, actions. Le résultat est un petit programme, avec ses risques.

**Où l'analogie s'arrête.** Un assemblage de blocs paraît simple, mais il se comporte comme du code : boucles, effets de bord, cas limites, erreurs. Il demande les pratiques d'un logiciel : tests, versions, revue, surveillance.

**Exemple.** L'administrateur définit : « quand un constat critique est créé, créer une tâche urgente, notifier la direction et bloquer les affectations de l'aéronef ». Il teste la règle sur des cas, la simule sur les constats du mois passé, puis la publie.

**Les composants.**

1. des **concepteurs** (workflows, règles, tables de décision, politiques) ;
2. des **vérifications statiques** ;
3. des **tests et simulations** ;
4. un **déploiement progressif** ;
5. une **surveillance de l'exécution**.

**Objectif d'apprentissage :** vous pouvez décrire le cycle de vie d'un artefact de comportement et citer des garde-fous contre les boucles et les actions dangereuses.

### 2. Connaissances essentielles

#### Définition

L'**administration du comportement** est l'ensemble des fonctions qui permettent de créer, tester, publier, surveiller et faire évoluer les workflows, règles, politiques et automatisations qui gouvernent l'exécution métier de la plateforme.

#### Idées fondamentales

1. **Ce sont des programmes.** Ils méritent les pratiques de l'ingénierie logicielle.
2. **La vérification est statique d'abord.** Cycles, étapes inatteignables, responsables absents.
3. **On teste avant de publier.** Scénarios, essai à blanc, simulation sur l'historique.
4. **On publie progressivement.** Par date d'effet, par groupe pilote.
5. **On surveille l'exécution.** Taux d'échec, volume, durée, effets.
6. **Chaque artefact a un propriétaire et une documentation.** Sinon il devient une boîte noire.

#### Vocabulaire essentiel

- **Faible code** (*low-code*) et **sans code** (*no-code*) : outils de construction de logique sans programmation classique.
- **Essai à blanc** (*dry run*) : exécution qui calcule et journalise sans appliquer.
- **Simulation** (*simulation*) : rejeu d'événements passés avec une nouvelle définition.
- **Cas de test** (*test case*) : entrée et résultat attendu.
- **Déploiement progressif** (*staged rollout*, *canary*) : mise en service sur un sous-ensemble d'abord.
- **Limite d'exécution** (*execution limit*) : plafond d'actions par unité de temps.
- **Journal d'exécution** (*execution log*) : trace des déclenchements et des résultats.

#### Relations de cause à effet

- Une automatisation déclenche une action qui produit l'événement qui la déclenche. Une boucle sature la plateforme et envoie des milliers de notifications.
- Une règle est publiée sans simulation. Elle refuse un grand nombre d'opérations légitimes dès la première heure.
- Aucune trace d'exécution n'est visible. Quand un client demande « pourquoi cette tâche a-t-elle été créée ? », personne ne sait répondre.

#### Idées reçues

- **« Sans code, donc sans risque. »** Non. Une logique mal conçue a les mêmes effets qu'un code défectueux, avec moins d'outils de diagnostic.
- **« Une règle publiée est terminée. »** Elle doit être surveillée, car le contexte change (données, volumes, autres règles).
- **« Tester, c'est exécuter une fois. »** Il faut des cas types, des cas limites et des rejeux d'historique.

#### Principe clé

Traitez chaque règle ou workflow comme un logiciel : analyse statique, tests, simulation, déploiement progressif, surveillance, propriétaire.

#### Si vous ne retenez que trois choses

1. Les artefacts de comportement sont des programmes et suivent un cycle d'ingénierie.
2. Validation, essai à blanc et simulation précèdent la publication.
3. Limites d'exécution et journaux protègent la plateforme et permettent d'expliquer.

### 3. Explication technique détaillée

#### Le cycle de vie d'un artefact

```text
Conception ─► Vérification statique ─► Tests ─► Simulation ─► Approbation ─► Publication
 (éditeur)     (cycles, impasses,       (cas      (rejeu de     (si requise)   (date d'effet,
                responsables)            types)    l'historique)               pilote)
                                                                                    │
                                    Retour arrière ◄── Surveillance ◄──────────────┘
                                                      (échecs, volumes, effets)
```

#### Les vérifications statiques

| Vérification | Ce qu'elle détecte |
|---|---|
| Boucle | Une action qui peut redéclencher l'automatisation |
| Étape inatteignable | Une étape qu'aucun chemin ne permet d'atteindre |
| Impasse | Une branche sans issue |
| Responsable absent | Une tâche assignée à un rôle vide |
| Référence invalide | Un champ ou un type supprimé |
| Action interdite | Une action qui dépasse les droits ou les limites du plan |
| Conflit | Deux règles qui se contredisent |

#### L'essai à blanc et la simulation

| Outil | Question | Résultat |
|---|---|---|
| Essai à blanc | « Que ferait cette règle sur cette donnée ? » | Effets calculés et journalisés, rien n'est appliqué |
| Simulation sur l'historique | « Qu'aurait-elle fait sur les 30 derniers jours ? » | Nombre de déclenchements, exemples, effets |
| Test de scénario | « Pour cette entrée, le résultat est-il celui attendu ? » | Réussite ou échec |

```json
{
  "simulation": {
    "automation": "on_critical_finding",
    "period": "2026-09-13/2026-10-13",
    "events_evaluated": 1842,
    "triggered": 37,
    "actions": { "create_task": 37, "notify": 37, "ground_aircraft": 29 },
    "warnings": ["8 immobilisations concerneraient des aéronefs déjà en inspection"]
  }
}
```

#### Les garde-fous d'exécution

| Garde-fou | Rôle |
|---|---|
| Limite d'actions par minute et par automatisation | Empêche l'emballement |
| Profondeur maximale de chaînage | Empêche les cascades |
| Détection de boucle à l'exécution | Arrête une automatisation qui se rappelle elle-même |
| Plafond de notifications par tenant | Évite l'inondation |
| Actions dangereuses soumises à droit (suppression, appel externe) | Réduit le risque |
| Mode « désactivation automatique » en cas d'échecs répétés | Contient une automatisation défaillante |

#### L'observabilité

Pour chaque exécution, le journal conserve : l'artefact et sa version, l'événement déclencheur, les conditions évaluées, les actions effectuées ou refusées, la durée et les erreurs. Cette trace répond à « pourquoi cela s'est-il passé ? » (voir [8.9 Administration opérationnelle](#89-administration-opérationnelle)).

#### La gouvernance

- **Propriétaire** et description obligatoires.
- **Revue** par un tiers pour les artefacts sensibles (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).
- **Environnement d'essai** pour construire et tester avant la production (voir [8.7 Configuration d'environnement](#87-configuration-denvironnement)).
- **Promotion** de la configuration d'un environnement à l'autre.

**Contre-exemple.** Une règle publiée directement en production par un administrateur, sans simulation, qui immobilise tous les aéronefs dont la date d'inspection est absente. La moitié de la flotte est bloquée au premier déclenchement.

**Limites.** L'outillage de test et de simulation est un investissement lourd. Il faut le concentrer sur les artefacts à risque, et accepter que des cas ne soient découverts qu'en production, d'où la surveillance et le retour arrière rapide.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) à [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | Il rend administrables les workflows et règles du module 6 |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les automatisations sont des configurations événement–condition–action |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les politiques peuvent être gérées comme du code |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les artefacts sont versionnés |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | L'interface doit rendre visible l'impact d'un changement |
| [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | La configuration sûre y est au cœur |

### 5. Application pratique

**Situation initiale.** La compagnie veut automatiser la réponse aux constats critiques, mais craint qu'une erreur de règle ne bloque la flotte.

**Problème.** Elle n'a pas d'équipe de développement ; la règle sera écrite par la qualité.

**Application du concept.** Le cycle complet : conception, tests, simulation, pilote, surveillance.

**Déroulé.**

1. Le responsable qualité construit l'automatisation dans l'éditeur. La vérification statique signale une boucle potentielle : elle est corrigée.
2. Il crée quatre cas de test (critique, majeur, aéronef déjà en inspection, constat sans aéronef).
3. La simulation sur le mois passé indique 37 déclenchements, dont 8 avertissements.
4. Il publie l'automatisation pour la base de Lyon uniquement, pendant deux semaines.
5. Le journal d'exécution montre aucun échec ; il l'étend à toute la compagnie.

**Résultat.** La règle est en production avec des risques maîtrisés, sans développement.

**Limites.** Les cas qui ne se sont pas produits pendant le mois simulé ne sont pas couverts : la surveillance reste nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi dit-on que les automatisations « sans code » sont des programmes ?
2. **Compréhension.** Quelle différence y a-t-il entre un essai à blanc et une simulation sur l'historique ?
3. **Compréhension.** Citez trois garde-fous d'exécution.
4. **Pourquoi.** Pourquoi déploie-t-on une automatisation sur un sous-ensemble d'abord ?
5. **Raisonnement pratique.** Une automatisation envoie 5 000 notifications en dix minutes. Quelles mesures la plateforme aurait-elle dû avoir ?

#### Réponses

1. Parce qu'elles ont des déclencheurs, des conditions, des actions, des boucles possibles et des effets de bord : elles se comportent comme du code, avec les mêmes risques.
2. L'essai à blanc évalue la règle sur une donnée précise sans rien appliquer ; la simulation rejoue des événements passés pour mesurer ce que la règle aurait fait.
3. Par exemple : limite d'actions par minute, détection de boucle, plafond de notifications, désactivation automatique en cas d'échecs répétés.
4. Pour limiter l'impact d'une erreur, observer le comportement réel, et corriger avant de l'étendre.
5. Un plafond de notifications par tenant, une détection de boucle, une limite d'actions par automatisation et une désactivation automatique après dépassement.

## 8.6 Feature flags

### 1. Comprendre simplement

Un **drapeau de fonctionnalité** (*feature flag*, ou *feature toggle*) est un **interrupteur** qui active, désactive ou fait varier une capacité du logiciel **à l'exécution**, sans redéploiement, éventuellement pour un tenant, un utilisateur ou un pourcentage de la population.

**Pourquoi cela existe.** Mettre une fonction en ligne et la rendre visible sont deux décisions différentes. Les drapeaux les séparent : le code peut être déployé « éteint », puis allumé progressivement, observé, et éteint immédiatement en cas de problème.

**Problème résolu.** Réduire le risque des mises en production, permettre des déploiements progressifs, des bêta par client, des coupe-circuits d'urgence et des expérimentations.

**Modèle mental.** Le tableau de disjoncteurs d'un bâtiment. Chaque circuit peut être coupé ou rétabli indépendamment, sans toucher à l'installation.

**Où l'analogie s'arrête.** Un disjoncteur est simple. Les drapeaux se composent, se ciblent et se périment : sans entretien, un tableau couvert de centaines de drapeaux devient incompréhensible.

**Exemple.** La nouvelle vue « Planning de la flotte » est déployée en production derrière le drapeau `fleet_planning_v2`. Elle est d'abord activée pour deux tenants pilotes, puis pour 25 % des utilisateurs, puis pour tous, puis le drapeau est retiré.

**Les composants.**

1. une **définition** du drapeau (nom, type, valeurs, valeur par défaut) ;
2. des **règles de ciblage** (tenant, utilisateur, offre, pourcentage) ;
3. un **service d'évaluation** ;
4. un **cycle de vie** et un propriétaire.

**Objectif d'apprentissage :** vous pouvez décrire les types de drapeaux, expliquer le déploiement par pourcentage et dire pourquoi un drapeau doit être retiré.

### 2. Connaissances essentielles

#### Définition

Un **drapeau de fonctionnalité** est une condition évaluée à l'exécution, définie en dehors du code déployé, qui détermine quelle variante d'un comportement est utilisée pour un contexte donné (tenant, utilisateur, version, région).

#### Idées fondamentales

1. **Déployer n'est pas livrer.** Le code est en production, la fonction est éteinte jusqu'à décision.
2. **Le ciblage est contextuel.** Par tenant, utilisateur, offre, région, pourcentage.
3. **Un drapeau a une durée de vie.** Il est créé, déployé, généralisé puis retiré.
4. **Le coupe-circuit est une fonction à part.** Un drapeau d'exploitation permet de désactiver vite une fonction à risque.
5. **Le drapeau n'est pas un droit d'usage.** L'un est technique, l'autre est commercial (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)).
6. **L'évaluation est rapide et sûre en cas de panne.** Une valeur par défaut est prévue.

#### Vocabulaire essentiel

- **Drapeau de livraison** (*release toggle*) : sépare le déploiement de la livraison.
- **Drapeau d'exploitation** (*ops toggle*, *kill switch*) : coupe-circuit.
- **Drapeau d'expérimentation** (*experiment toggle*) : compare des variantes.
- **Drapeau de permission** (*permission toggle*) : active pour un public donné.
- **Déploiement par pourcentage** (*percentage rollout*) : activation pour une fraction de la population.
- **Contexte d'évaluation** (*evaluation context*) : informations utilisées pour décider.
- **Dette de drapeaux** (*flag debt*) : accumulation de drapeaux périmés.

#### Relations de cause à effet

- Un drapeau n'est jamais retiré. Le code garde les deux variantes, l'une est morte, et personne ne sait laquelle.
- Le service de drapeaux est indisponible sans valeur par défaut. Les fonctions disparaissent, ou le service plante.
- Plusieurs drapeaux interagissent. Le nombre de combinaisons à tester explose.

#### Idées reçues

- **« Les drapeaux remplacent les tests. »** Non. Ils permettent de limiter l'exposition, pas de supprimer le besoin de tester chaque variante.
- **« Un drapeau est un réglage permanent. »** Non. Un réglage permanent est une configuration (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) ; un drapeau est transitoire.
- **« Tous les drapeaux sont visibles des clients. »** Non. La plupart sont internes. Ceux que le client voit relèvent de la configuration ou de l'offre.

#### Principe clé

Un drapeau est un outil temporaire de gestion du risque : on le crée avec un objectif, un propriétaire et une date de retrait.

#### Si vous ne retenez que trois choses

1. Un drapeau sépare le déploiement du code de la livraison de la fonction.
2. Il est évalué dans un contexte (tenant, utilisateur, pourcentage), avec une valeur par défaut sûre.
3. Il est temporaire : sans retrait, il devient une dette.

### 3. Explication technique détaillée

#### Les types de drapeaux

| Type | Durée de vie | Décideur | Exemple |
|---|---|---|---|
| Livraison | Jours à semaines | Produit, technique | Nouvelle vue de planning |
| Expérimentation | Semaines | Produit | Deux versions d'un écran |
| Exploitation (coupe-circuit) | Longue, parfois permanente | Exploitation | Désactiver les notifications en cas de panne |
| Permission | Variable | Produit, commercial | Bêta réservée à des clients choisis |

#### Une définition de drapeau

```json
{
  "key": "fleet_planning_v2",
  "type": "release",
  "owner": "team-planning",
  "default": false,
  "rules": [
    { "if": { "tenant": ["ten_pilot_01", "ten_pilot_02"] }, "serve": true },
    { "if": { "plan": ["enterprise"] }, "percentage": 25, "serve": true }
  ],
  "created_at": "2026-09-01",
  "remove_by": "2026-12-01",
  "kill_switch": true
}
```

#### Le déploiement par pourcentage

Pour qu'un utilisateur reste dans la même variante d'une évaluation à l'autre, on calcule un **seau** stable à partir d'un identifiant et du nom du drapeau :

$$\text{seau} = \text{hash}(\text{identifiant} \,\|\, \text{drapeau}) \bmod 100$$

L'utilisateur est inclus si $\text{seau} < p$, où $p$ est le pourcentage visé. Passer $p$ de 25 à 50 inclut les mêmes utilisateurs qu'avant, plus de nouveaux : l'expérience ne « clignote » pas.

#### Le contexte d'évaluation

| Attribut | Usage |
|---|---|
| Tenant | Pilotes, clients bêta |
| Utilisateur | Équipe interne d'abord |
| Offre | Fonction réservée à certaines offres |
| Région, cellule | Déploiement géographique ou par cellule (voir [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)) |
| Version de l'application | Compatibilité des clients mobiles |

#### Le cycle de vie

```text
Créer ─► Déployer éteint ─► Activer pour des pilotes ─► Étendre par pourcentage
                                                              │
        Retirer le code et le drapeau ◄── Généraliser (100 %) ◄┘
```

La dernière étape est la plus souvent oubliée. Une date de retrait et un propriétaire sont indispensables.

#### Les pièges

| Piège | Conséquence | Parade |
|---|---|---|
| Drapeaux jamais retirés | Dette, code mort, complexité | Date de retrait, revue périodique |
| Drapeaux imbriqués | Combinaisons à tester en grand nombre | Limiter les dépendances |
| Évaluation incohérente entre services | Un utilisateur voit une variante dans un service et une autre ailleurs | Évaluation centralisée et identifiant stable |
| Service de drapeaux en panne | Fonctions éteintes ou erreurs | Valeur par défaut, cache local |
| Changement sans trace | Impossible d'expliquer un incident | Journal des changements et droits |

#### Les droits et l'audit

Changer un drapeau modifie le comportement de la production : c'est une action sensible. Elle exige un droit spécifique, une trace (qui, quand, pourquoi) et, pour les coupe-circuits, une procédure d'urgence claire.

**Contre-exemple.** Utiliser un drapeau pour réserver une fonction aux clients d'une offre supérieure. La logique commerciale se retrouve dans la même table que les déploiements techniques, et un nettoyage de drapeaux « périmés » supprime par erreur un droit d'usage payé.

**Limites.** Les drapeaux déplacent le risque : au lieu d'une version déployée, on a une configuration d'exécution qui peut changer à tout moment. La discipline de gestion devient celle d'un système de production.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les droits d'usage sont commerciaux, les drapeaux sont techniques |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration de tenant est durable, les drapeaux sont transitoires |
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | Le déploiement par cellule utilise le même ciblage |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | Le coupe-circuit est un outil de dégradation maîtrisée |
| [8.7 Configuration d'environnement](#87-configuration-denvironnement) | Les drapeaux sont une forme de configuration d'exécution |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Les changements de drapeaux sont audités |

### 5. Application pratique

**Situation initiale.** L'équipe a réécrit le moteur de calcul des échéances d'inspection. Une erreur de calcul affecterait la navigabilité des aéronefs.

**Problème.** Un déploiement « tout ou rien » est trop risqué, et un retour arrière par redéploiement prendrait plusieurs heures.

**Application du concept.** Le nouveau moteur est derrière un drapeau, avec comparaison avec l'ancien.

**Déroulé.**

1. Le code est déployé avec le drapeau éteint : l'ancien moteur sert.
2. Le drapeau est activé en mode « ombre » : les deux moteurs calculent, seul l'ancien est utilisé, les écarts sont journalisés.
3. Après une semaine sans écart, le nouveau moteur est activé pour deux tenants pilotes, puis pour 25 %, puis pour tous.
4. Un écart inattendu apparaît à 50 % : le drapeau est éteint en une minute, sans redéploiement.
5. Après correction et généralisation, le drapeau et l'ancien code sont retirés.

**Résultat.** Le changement critique est livré progressivement, avec un retour arrière immédiat.

**Limites.** Le mode « ombre » double le coût de calcul pendant la période de comparaison : il se limite à des changements à risque.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre déployer et livrer une fonction ?
2. **Compréhension.** Pourquoi calcule-t-on un seau stable pour le déploiement par pourcentage ?
3. **Compréhension.** Citez trois types de drapeaux.
4. **Pourquoi.** Pourquoi un drapeau doit-il avoir une date de retrait ?
5. **Raisonnement pratique.** Peut-on utiliser un drapeau pour réserver une fonction à l'offre « Entreprise » ?

#### Réponses

1. Déployer, c'est mettre le code en production ; livrer, c'est rendre la fonction visible. Un drapeau permet de les décider séparément.
2. Pour qu'un utilisateur reste dans la même variante à chaque évaluation, et que l'augmentation du pourcentage n'inclue que des utilisateurs en plus.
3. Par exemple : drapeau de livraison, d'expérimentation, d'exploitation (coupe-circuit), de permission.
4. Parce que, sans retrait, il laisse du code mort et des combinaisons à tester : c'est une dette qui complexifie le système.
5. Pas comme moyen principal : un droit d'usage est une décision commerciale, à porter par le modèle d'abonnement (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)), et non par un drapeau technique.

## 8.7 Configuration d'environnement

### 1. Comprendre simplement

La **configuration d'environnement** (*environment configuration*) rassemble les paramètres qui **diffèrent d'un environnement ou d'un déploiement à l'autre** pour un même code : adresses des services, références vers les secrets, tailles de ressources, limites, région. Elle appartient au **déploiement**, pas au client. Elle diffère donc de la configuration d'un tenant (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).

**Pourquoi cela existe.** Le même logiciel s'exécute en développement, en test, en préproduction et en production, dans plusieurs régions et cellules. Il ne doit pas être recompilé pour chacun : ce qui change doit être séparé du code et connu.

**Problème résolu.** Faire tourner un même artefact dans des contextes différents, sans y coder de valeurs propres à un lieu, et sans exposer de secrets.

**Modèle mental.** Les réglages d'une même machine selon l'atelier où elle est installée : tension électrique, langue, adresse du réseau. La machine est identique, ses réglages d'installation diffèrent.

**Où l'analogie s'arrête.** Les réglages d'une machine physique se font une fois. Ceux d'un déploiement évoluent, doivent être promus d'un environnement à l'autre, versionnés et vérifiés.

**Exemple.** La même version de la plateforme est déployée avec `database_url`, `region`, `max_connections` et `log_level` différents en préproduction et en production.

**Les composants.**

1. des **paramètres** typés et documentés ;
2. des **valeurs par environnement** ;
3. des **références vers les secrets** (jamais les secrets eux-mêmes) ;
4. un **processus de promotion** ;
5. des **contrôles** de validité et de dérive.

**Objectif d'apprentissage :** vous pouvez séparer configuration d'environnement, configuration de tenant et secrets, et décrire comment promouvoir une configuration d'un environnement à l'autre.

### 2. Connaissances essentielles

#### Définition

La **configuration d'environnement** est l'ensemble des paramètres propres à un déploiement (environnement, région, cellule) qui déterminent comment un même artefact logiciel s'exécute et se connecte, gérés séparément du code.

#### Idées fondamentales

1. **Le code est identique, la configuration diffère.** Un seul artefact traverse les environnements.
2. **La configuration est hors du code.** Variables, fichiers, services de configuration.
3. **Les secrets sont à part.** On y fait référence, on ne les stocke pas dans la configuration (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).
4. **La configuration est typée et validée au démarrage.** Un paramètre manquant empêche le démarrage.
5. **Les environnements se ressemblent.** L'écart entre test et production est réduit et connu.
6. **La configuration est versionnée et promue.** Elle suit un chemin, comme le code.

#### Vocabulaire essentiel

- **Environnement** (*environment*) : instance de la plateforme avec un rôle (développement, test, préproduction, production).
- **Parité d'environnements** (*dev/prod parity*) : réduction des écarts entre environnements.
- **Promotion** (*promotion*) : passage d'une configuration d'un environnement au suivant.
- **Dérive** (*drift*) : écart non voulu entre l'état réel et l'état déclaré.
- **Infrastructure comme code** (*infrastructure as code*) : description versionnée de l'infrastructure.
- **Configuration statique** et **dynamique** : lue au démarrage, ou rechargée à chaud.
- **Les douze facteurs** (*Twelve-Factor App*) : méthode de conception d'applications, dont le principe de configuration par l'environnement.

#### Relations de cause à effet

- Une valeur est codée en dur pour la production. Le code testé n'est plus celui qui est exécuté, et chaque changement demande un redéploiement.
- La configuration de test diffère beaucoup de celle de production. Des défauts n'apparaissent qu'en production.
- Les secrets sont placés dans les fichiers de configuration. Ils fuient avec le dépôt ou les journaux.

#### Idées reçues

- **« Configuration d'environnement et configuration de tenant, c'est pareil. »** Non. La première appartient au déploiement et au fournisseur ; la seconde au client.
- **« Un fichier de configuration par environnement dans le dépôt suffit. »** Cela fonctionne au début ; à l'échelle, il faut des modèles, de la validation et un contrôle de dérive.
- **« La configuration peut être modifiée à chaud sans risque. »** Un changement à chaud est un changement de production : il suit le même contrôle.

#### Principe clé

Un artefact, plusieurs environnements : tout ce qui varie est hors du code, typé, validé, versionné et promu ; les secrets sont des références.

#### Si vous ne retenez que trois choses

1. La configuration d'environnement sépare ce qui varie d'un déploiement à l'autre du code.
2. Elle est distincte de la configuration de tenant et des secrets.
3. Elle est validée au démarrage, versionnée, promue et contrôlée contre la dérive.

### 3. Explication technique détaillée

#### Les trois familles à ne pas confondre

| Famille | Appartient à | Exemple | Où elle vit |
|---|---|---|---|
| Configuration d'environnement | Le déploiement (fournisseur) | URL de la base, région, taille de pool | Fichiers, variables, service de configuration |
| Configuration de tenant | Le client | Langue, seuils, modules activés | Base de configuration de la plateforme |
| Secrets | Le déploiement ou le tenant | Mot de passe, clé de signature | Coffre dédié (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) |

#### Un exemple

```yaml
# config/production-eu-west.yaml
environment: production
region: eu-west
http:
  port: 8080
  request_timeout: 10s
database:
  url_ref: "vault://platform/prod/db-url"       # référence, pas la valeur
  max_connections: 200
events:
  bus: "bus-prod-eu"
logging:
  level: info
limits:
  max_import_rows: 500000
```

#### La validation au démarrage

```text
Démarrage :
  1. Charger la configuration par couches (défauts < environnement < instance)
  2. Résoudre les références de secrets
  3. Valider les types, les plages, les paramètres obligatoires
  4. Vérifier la connectivité (base, bus)
  5. Si une vérification échoue → arrêt immédiat, avec message explicite
```

**Pourquoi échouer vite.** Une configuration invalide découverte à la première requête, à trois heures du matin, est bien plus coûteuse qu'un échec au démarrage lors du déploiement.

#### La promotion

```text
Développement ─► Test ─► Préproduction ─► Production
     │              │          │              │
  config-dev    config-test  config-preprod  config-prod
        (même artefact, valeurs propres à chaque environnement)
```

| Pratique | Raison |
|---|---|
| Valeurs par environnement dans un dépôt versionné et revu | Traçabilité |
| Modèles communs, écarts minimes | Parité des environnements |
| Différences explicites et listées | Savoir ce qui diffère |
| Promotion automatisée | Éviter les écarts manuels |
| Contrôle de dérive | Détecter les modifications hors circuit |

#### Statique ou dynamique

| Mode | Principe | Avantage | Risque |
|---|---|---|---|
| Statique | Lue au démarrage, nouvelle version pour changer | Prévisible | Changement lent |
| Dynamique | Rechargée à chaud | Réactivité | Comportement changeant sans redéploiement |

La configuration dynamique est réservée aux paramètres pour lesquels un changement à chaud est sûr et utile (seuils, limites) ; les paramètres structurels (connexions, ports) restent statiques.

#### Les environnements des clients

Les clients ont eux aussi besoin d'environnements : un bac à sable pour tester leurs configurations avant de les appliquer. La plateforme offre des **tenants d'essai** et des outils de **promotion** de configuration (types, workflows, règles) d'un tenant d'essai vers le tenant de production, avec différences affichées et validation (voir [8.1 La plateforme d'administration](#81-la-plateforme-dadministration)).

**Contre-exemple.** Un fichier de configuration de production, avec les mots de passe de la base, enregistré dans le dépôt de code. N'importe quel développeur y a accès, et chaque copie du dépôt en contient un exemplaire.

**Limites.** La parité parfaite entre environnements n'existe pas (volumes, intégrations réelles). On documente les écarts et on compense par des tests spécifiques, et par une surveillance renforcée lors des mises en production.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration de tenant est une famille distincte |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les secrets sont gérés séparément et référencés |
| [8.1 La plateforme d'administration](#81-la-plateforme-dadministration) | La promotion de configuration s'appuie sur la plateforme d'administration |
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | Cellules et régions ont chacune leur configuration |
| [8.6 Feature flags](#86-feature-flags) | Les drapeaux sont une configuration d'exécution transitoire |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Elle illustre la frontière entre configuration et code |

### 5. Application pratique

**Situation initiale.** Une nouvelle version fonctionne en préproduction mais échoue en production : un délai d'attente configuré à 30 secondes en préproduction est de 5 secondes en production, et une intégration est plus lente.

**Problème.** Personne ne savait que la valeur différait, et rien ne signalait l'écart.

**Application du concept.** La configuration est versionnée, comparée et validée entre environnements.

**Déroulé.**

1. L'équipe place toutes les valeurs dans un dépôt, avec un modèle commun et des surcharges par environnement.
2. Un outil liste les écarts entre préproduction et production avant chaque déploiement.
3. Le délai d'attente est identifié comme différent ; l'équipe décide de l'harmoniser à 15 secondes.
4. Le contrôle de dérive compare la configuration déclarée à celle réellement chargée.

**Résultat.** Les écarts sont connus et choisis, et plus aucun n'est découvert en production.

**Limites.** L'outil ne détecte que les paramètres déclarés ; une configuration implicite (valeur par défaut d'une bibliothèque) reste invisible : on documente les défauts importants.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre configuration d'environnement et configuration de tenant ?
2. **Compréhension.** Pourquoi fait-on référence aux secrets plutôt que de les stocker dans la configuration ?
3. **Compréhension.** Pourquoi valide-t-on la configuration au démarrage ?
4. **Pourquoi.** Pourquoi cherche-t-on la parité entre environnements ?
5. **Raisonnement pratique.** Quel mécanisme offrir aux clients pour tester une configuration avant de la mettre en production ?

#### Réponses

1. La première appartient au déploiement et sert à exécuter le même code dans différents lieux ; la seconde appartient au client et adapte le comportement métier.
2. Pour que les secrets ne fuient pas avec le dépôt, les journaux ou les copies de configuration, et pour pouvoir les renouveler sans changer la configuration.
3. Pour échouer vite, avec un message clair, plutôt que de découvrir une valeur invalide en pleine exploitation.
4. Pour que les défauts apparaissent avant la production : plus les environnements se ressemblent, plus les tests sont représentatifs.
5. Des tenants d'essai (bacs à sable) et un outil de promotion de configuration vers la production, avec différences affichées et validation.

## 8.8 Administration technique, clés d'API, webhooks et intégrations

### 1. Comprendre simplement

L'**administration technique** regroupe les fonctions par lesquelles un administrateur gère les **accès programmatiques** et les **connexions** de son tenant : les **clés d'API** (*API keys*), les **webhooks** (*webhooks*) et les **intégrations** (*integrations*) avec des systèmes externes.

**Pourquoi cela existe.** Les mécanismes décrits aux modules 4, 7 et 10 (clés, webhooks, connecteurs) sont des moyens d'accéder à la plateforme ou de la faire communiquer. Leur gestion au quotidien a ses propres besoins : créer, limiter, surveiller, renouveler, révoquer, diagnostiquer.

**Problème résolu.** Donner aux administrateurs la maîtrise des accès techniques de leur tenant, de façon sûre et observable, sans passer par le support.

**Modèle mental.** Le standard et le répertoire des accès entrants et sortants d'une entreprise : qui a une ligne, avec quels droits, depuis quand, et si elle fonctionne.

**Où l'analogie s'arrête.** Un standard téléphonique a un nombre fini de lignes. Une plateforme peut avoir des centaines de clés, de webhooks et de connexions, chacune avec ses secrets, ses échecs et sa dépendance à des tiers.

**Exemple.** L'administrateur crée une clé « sync-maintenance » en lecture seule, valable un an, configure un webhook vers le système qualité, consulte le journal des livraisons, et révoque l'accès d'une application dont il n'a plus besoin.

**Les composants.**

1. un **gestionnaire de clés** ;
2. un **gestionnaire de webhooks** ;
3. un **catalogue d'intégrations** ;
4. un **tableau de santé** ;
5. des **droits et alertes** spécifiques.

**Objectif d'apprentissage :** vous pouvez décrire les fonctions d'une console technique et les bonnes pratiques de rotation et de visibilité des secrets.

### 2. Connaissances essentielles

#### Définition

L'**administration technique** est l'ensemble des fonctions d'interface et d'API qui permettent de créer, configurer, surveiller, renouveler et révoquer les clés d'API, les webhooks et les intégrations d'un tenant, avec les droits, les limites et la traçabilité adaptés.

#### Idées fondamentales

1. **Un inventaire exhaustif.** Tout accès technique est listé, avec son propriétaire et son périmètre.
2. **Les secrets sont affichés une seule fois.** Ensuite, seuls des identifiants non sensibles.
3. **La rotation est facile.** Deux secrets valables en parallèle pendant une période de transition.
4. **La santé est visible.** Dernier usage, échecs, volumes.
5. **La révocation est immédiate.** Et journalisée.
6. **Ces fonctions sont sensibles.** Elles exigent des droits spécifiques et des contrôles renforcés.

#### Vocabulaire essentiel

- **Propriétaire** (*owner*) : personne ou équipe responsable d'un accès.
- **Périmètre** (*scope*) : droits accordés à une clé ou à une intégration.
- **Rotation** (*rotation*) : remplacement planifié d'un secret.
- **Période de recouvrement** (*overlap period*) : durée où l'ancien et le nouveau secret sont valables.
- **Liste d'adresses autorisées** (*IP allowlist*) : limitation des adresses sources.
- **Journal de livraison** (*delivery log*) : trace des envois de webhooks.
- **Autorisations d'applications** (*connected apps*) : liste des applications ayant un accès au nom du tenant ou d'utilisateurs.

#### Relations de cause à effet

- Aucun inventaire des clés. Des clés oubliées restent actives des années, et leur compromission passe inaperçue.
- La rotation exige un arrêt. Les équipes la repoussent, et les secrets vieillissent.
- Les échecs de webhooks ne sont pas visibles. Un système externe cesse de recevoir des événements sans que personne ne le sache.

#### Idées reçues

- **« Une clé d'API est un simple mot de passe. »** Elle a un périmètre, un propriétaire, un usage mesurable, un cycle de vie : c'est une identité non humaine (voir [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines)).
- **« Les intégrations se gèrent par le support. »** Les gérer en libre-service est plus sûr et plus rapide, si les contrôles sont bons.
- **« Désactiver une clé suffit. »** Il faut aussi vérifier ce qui l'utilisait : sinon des processus échouent sans qu'on en connaisse la cause.

#### Principe clé

Chaque accès technique a un propriétaire, un périmètre minimal, une date de fin, un suivi d'usage et une procédure de rotation et de révocation.

#### Si vous ne retenez que trois choses

1. L'inventaire des accès techniques est complet, avec propriétaire et périmètre.
2. Les secrets sont montrés une fois, renouvelés par recouvrement et révoqués immédiatement au besoin.
3. La santé des webhooks et des intégrations est visible et alertée.

### 3. Explication technique détaillée

#### Le gestionnaire de clés d'API

| Fonction | Détail |
|---|---|
| Création | Nom, propriétaire, droits, expiration, environnement |
| Affichage | Secret montré à la création uniquement |
| Périmètre | Sous-ensemble des droits du créateur (voir [8.4 Administration des identités et des accès](#84-administration-des-identités-et-des-accès)) |
| Rotation | Création d'une seconde clé, migration, retrait de la première |
| Suivi | Dernière utilisation, volume, adresses sources |
| Restrictions | Liste d'adresses autorisées, plages horaires, limites de débit |
| Alertes | Clé inutilisée depuis 90 jours, clé proche de l'expiration, clé détectée dans un dépôt public |

#### Le gestionnaire de webhooks

| Fonction | Détail |
|---|---|
| Points d'accès | Adresse, événements abonnés, filtres, état |
| Secret de signature | Affichage, rotation avec recouvrement |
| Journal de livraison | Statut, durée, réponse, tentatives |
| Test | Envoi d'un événement d'essai |
| Rejeu | Renvoi d'une livraison ou d'une période |
| Santé | Taux de succès, désactivation automatique avec alerte |

#### Le catalogue d'intégrations

```json
{
  "integration": "int_quality_system",
  "type": "connector",
  "provider": "quality-suite",
  "status": "healthy",
  "owner": "u_it_manager",
  "credentials_ref": "vault://tenant/ten_airline_01/int_quality_system",
  "last_sync": "2026-10-13T06:00:12Z",
  "sync": { "direction": "bidirectional", "interval": "PT15M", "last_errors": 0 },
  "mapping": "map_findings_v3"
}
```

**Comment le lire.** L'intégration a un propriétaire, une référence vers ses identifiants (jamais le secret lui-même), un état de santé et une synchronisation périodique avec son dernier résultat.

#### Les autorisations d'applications

Quand des applications tierces accèdent au tenant par OAuth (voir [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20)), l'administrateur doit voir : quelle application, quel périmètre accordé, par qui, depuis quand, et pouvoir **révoquer** l'accès. L'ajout d'une application à forte portée peut être soumis à approbation de l'administrateur.

#### La rotation sans interruption

```text
1. Créer la nouvelle clé (K2)               K1 et K2 valides
2. Déployer K2 chez le consommateur         K1 et K2 valides
3. Vérifier que K1 n'est plus utilisée      (dernière utilisation de K1 stable)
4. Révoquer K1                              K2 seule valide
```

Le suivi de la dernière utilisation de K1 donne la preuve que la migration est terminée.

#### Les droits

| Action | Droit |
|---|---|
| Voir l'inventaire | Lecture technique |
| Créer une clé | Gestion des clés (avec second facteur récent) |
| Créer une clé à droits larges | Approbation d'un second administrateur |
| Ajouter une application connectée | Gestion des intégrations, éventuellement approbation |
| Consulter les journaux de livraison | Lecture technique, filtrée par tenant |

**Contre-exemple.** Un administrateur qui crée une clé « administrateur » pour une intégration en lecture seule « pour que ça marche du premier coup ». La clé a tous les droits, n'expire jamais et est partagée dans trois équipes.

**Limites.** Les intégrations s'appuient sur des systèmes tiers dont le comportement échappe à la plateforme. La console ne peut qu'exposer les symptômes (échecs, retards) et guider le diagnostic, pas corriger le tiers.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi) | Les clés d'API sont expliquées comme moyen d'authentification |
| [4.9 OAuth 2.0](04-identite-iam-autorisation.md#49-oauth-20) | Les applications connectées reposent sur OAuth |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Les webhooks sont le mécanisme d'envoi |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) | Les connecteurs sont les composants d'intégration |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les secrets sont stockés et renouvelés selon la gestion des secrets |
| [8.9 Administration opérationnelle](#89-administration-opérationnelle) | La santé des intégrations alimente la console opérationnelle |

### 5. Application pratique

**Situation initiale.** Un audit révèle que la compagnie a 47 clés d'API actives, dont 30 dont personne ne connaît l'usage, et que trois webhooks échouent depuis des semaines.

**Problème.** Il n'existe aucun inventaire, aucune propriété et aucun suivi.

**Application du concept.** L'administrateur utilise la console technique pour faire le ménage.

**Déroulé.**

1. Il affiche les clés avec leur dernière utilisation : 28 n'ont pas servi depuis 6 mois.
2. Il les désactive en lot (désactivation avant suppression, pour pouvoir revenir en arrière).
3. Il assigne un propriétaire et une expiration aux 19 autres.
4. Il examine les trois webhooks en échec : deux pointent vers des adresses qui n'existent plus, un autre rejette la signature. Il corrige ou supprime.
5. Il configure des alertes sur les clés inutilisées et les webhooks en échec.

**Résultat.** Le périmètre d'accès est réduit de moitié, et chaque accès restant a un propriétaire et une alerte.

**Limites.** Une clé désactivée qui était utilisée une fois par an (clôture annuelle) provoquera un échec ; la période de désactivation avant suppression permet de la rétablir.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le secret d'une clé n'est-il affiché qu'une fois ?
2. **Compréhension.** Comment renouvelle-t-on une clé sans interruption ?
3. **Compréhension.** Que doit montrer un journal de livraison de webhook ?
4. **Pourquoi.** Pourquoi exige-t-on un propriétaire pour chaque accès technique ?
5. **Raisonnement pratique.** Une clé n'a pas été utilisée depuis 8 mois. Que faire ?

#### Réponses

1. Parce que la plateforme n'en conserve que l'empreinte : elle ne peut pas le réafficher, ce qui limite les lieux où il est stocké.
2. En créant une seconde clé, en migrant les consommateurs, en vérifiant que l'ancienne n'est plus utilisée, puis en la révoquant.
3. Chaque livraison : événement, statut, durée, réponse, tentatives, et la possibilité de la rejouer.
4. Pour que quelqu'un soit responsable de son périmètre, de son renouvellement et de sa révocation ; sinon l'accès devient orphelin.
5. La désactiver (avant de la supprimer) après avoir vérifié avec son propriétaire qu'elle n'est plus nécessaire, avec la possibilité de la rétablir.

## 8.9 Administration opérationnelle

### 1. Comprendre simplement

L'**administration opérationnelle** regroupe les outils qui permettent à un administrateur de **voir ce que la plateforme fait et a fait** pour son tenant : les **journaux** (*logs*), l'**audit** (*audit*), les **événements** (*events*), les **tâches** (*jobs*), les **erreurs** (*errors*) et les **métriques** (*metrics*). C'est le tableau de bord de l'exploitation, côté client.

**Pourquoi cela existe.** Un client qui configure une plateforme doit pouvoir comprendre pourquoi quelque chose s'est produit, ou ne s'est pas produit. Sans visibilité, chaque question devient une demande de support, et la confiance s'effrite.

**Problème résolu.** Donner de la transparence et de l'autonomie de diagnostic aux administrateurs, sans exposer ce qui concerne les autres tenants ni les détails internes de la plateforme.

**Modèle mental.** Le tableau de bord d'un véhicule : vitesse, voyants d'alerte, historique des trajets. L'administrateur voit son véhicule, pas le moteur de toute la flotte.

**Où l'analogie s'arrête.** Un tableau de bord est simple. Ici, plusieurs sources d'information de natures différentes (techniques, métier, gouvernance) doivent être présentées de façon cohérente et reliée.

**Exemple.** « Pourquoi cette tâche a-t-elle été créée ? » L'administrateur suit le chemin : l'événement de constat critique, l'automatisation déclenchée, l'action de création de tâche, et le journal d'exécution.

**Les composants.**

1. un **journal d'activité** et un **journal d'audit** ;
2. un **flux d'événements** consultable ;
3. un **moniteur de tâches** ;
4. un **tableau d'erreurs** ;
5. des **métriques d'usage et de santé** ;
6. des **alertes** configurables.

**Objectif d'apprentissage :** vous pouvez distinguer les six sources d'information opérationnelle et dire à quelle question chacune répond.

### 2. Connaissances essentielles

#### Définition

L'**administration opérationnelle** est l'ensemble des fonctions de consultation, de recherche, de corrélation et d'alerte qui exposent à un administrateur, dans le périmètre de son tenant, l'activité, l'historique, les traitements, les erreurs et les mesures de la plateforme.

#### Idées fondamentales

1. **Chaque source répond à une question différente.** Technique, gouvernance, métier, traitement, échec, tendance.
2. **Tout est filtré par tenant.** L'administrateur ne voit que son périmètre.
3. **Les sources sont reliées.** Un identifiant de corrélation permet de suivre un déroulement.
4. **L'audit est immuable.** Les journaux techniques sont temporaires et filtrés.
5. **Les données sensibles sont protégées.** Pas de secrets ni de données personnelles superflues dans ce que l'on affiche.
6. **L'information est actionnable.** Alertes, filtres, export, rejeu.

#### Vocabulaire essentiel

- **Journal technique** (*log*) : trace de diagnostic produite par les composants.
- **Journal d'audit** (*audit log*) : trace de gouvernance de qui a fait quoi (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- **Journal d'activité** (*activity log*) : suite des actions des utilisateurs.
- **Moniteur de tâches** (*job monitor*) : vue des traitements en file, en cours, échoués.
- **Identifiant de corrélation** (*correlation ID*) : valeur qui relie les traces d'un même déroulement.
- **Métrique** (*metric*) : mesure agrégée dans le temps.
- **Alerte** (*alert*) : notification d'un seuil franchi.

#### Relations de cause à effet

- Les sources ne sont pas reliées. L'administrateur voit un événement, une erreur, une tâche, sans pouvoir les lier : il ouvre un ticket.
- Les journaux techniques contiennent des données d'autres tenants. Une consultation « côté client » devient une fuite.
- Les erreurs sont affichées brutes, avec des détails internes. Elles inquiètent sans aider, et peuvent révéler des informations sensibles.

#### Idées reçues

- **« Journal, audit et événements, c'est la même chose. »** Non. Ils servent des publics et des besoins différents, avec des durées de conservation et des garanties différentes.
- **« Plus on en montre, mieux c'est. »** Non. Un excès de bruit masque l'essentiel. Il faut des filtres, des résumés et des alertes.
- **« L'exploitation est l'affaire du fournisseur. »** Une partie, la plus proche du métier du client, relève de l'administrateur du tenant.

#### Principe clé

Chaque source d'information opérationnelle a sa question et son public ; une corrélation et un filtrage par tenant les rendent utilisables ensemble.

#### Si vous ne retenez que trois choses

1. Journaux techniques, audit, événements, tâches, erreurs et métriques ne se confondent pas.
2. Tout est limité au tenant, relié par des identifiants de corrélation et protégé des données sensibles.
3. L'information doit mener à une action : filtre, alerte, rejeu, correction.

### 3. Explication technique détaillée

#### Les six sources

| Source | Question | Public | Durée de conservation | Modifiable ? | Entrées liées |
|---|---|---|---|---|---|
| Journaux techniques (*logs*) | Que s'est-il passé techniquement ? | Exploitation, support | Courte à moyenne | Non, mais purgés | [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) |
| Audit | Qui a changé quoi, quand, pourquoi ? | Gouvernance, conformité | Longue, selon la réglementation | Non (immuable) | [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications), [9.2 Acteur, horodatage, avant et après, motif](09-audit-versionnement-gouvernance.md#92-acteur-horodatage-avant-et-après-motif) |
| Événements | Quels faits métier se sont produits ? | Métier, intégrations | Moyenne | Non | [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) |
| Tâches (*jobs*) | Quels traitements sont en cours, échoués ? | Administrateurs | Moyenne | État, relance | [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) |
| Erreurs | Qu'est-ce qui échoue, pour qui, combien ? | Administrateurs, exploitation | Moyenne | Non | [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs) |
| Métriques | Quelle est la tendance, la santé, l'usage ? | Tous | Longue, agrégée | Non | [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) |

#### Une console opérationnelle

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Santé       Intégrations : 3 saines, 1 en échec    Webhooks : 98,7 % de succès │
│ Usage       Appels API : 41 200 / 100 000    Aéronefs : 7 800 / 10 000        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tâches      En cours : 2    En file : 14    Échouées (24 h) : 3  [relancer]  │
│ Erreurs     Validation : 124   Droits : 18   Intégration : 9    [détails]    │
│ Audit       Dernier changement : Karim, règle « critical_finding », 08:12    │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### La corrélation

```text
Requête req_91ab33
  ├─ Audit       : « Mathilde a créé le constat fd_204 »
  ├─ Événement   : finding.created (evt_01HZX)
  ├─ Automation  : on_critical_finding → exécutée (run_77)
  │    ├─ Action : création de la tâche tk_5521
  │    └─ Action : webhook vers ep_quality_system (livré, 200)
  └─ Journal tech: 3 lignes (niveau info), 0 erreur
```

Avec un identifiant de corrélation commun, l'administrateur reconstitue le déroulement complet depuis n'importe quel point d'entrée.

#### Le moniteur de tâches

| État | Actions possibles |
|---|---|
| En file | Annuler, voir la position |
| En cours | Voir l'avancement, annuler |
| Réussie | Voir le résultat, télécharger le rapport |
| Échouée | Voir la cause, relancer, signaler |
| Expirée | Relancer |

#### Les erreurs présentées utilement

Une erreur utile à l'administrateur indique : le **type**, le **nombre** d'occurrences, la **période**, les **exemples** (ressources concernées), la **cause probable** et une **action** (corriger une règle, mettre à jour une clé). Les détails techniques internes ne sont pas affichés ; un identifiant permet au support de les retrouver.

#### Les alertes pour l'administrateur

| Alerte | Seuil possible |
|---|---|
| Intégration en échec | Trois échecs consécutifs |
| Webhook désactivé automatiquement | Immédiat |
| Quota proche | 80 % |
| Tâche bloquée | Aucun progrès depuis 30 minutes |
| Taux d'erreurs de validation anormal | Au-dessus de la moyenne des sept derniers jours |
| Action sensible (rôle d'administrateur attribué) | Immédiat, vers les responsables |

#### La séparation fournisseur et tenant

| Vue | Contenu | Pour qui |
|---|---|---|
| Vue tenant | Données et événements du tenant, filtrées | Administrateurs du tenant |
| Vue plateforme | Santé globale, capacité, incidents | Opérateurs du fournisseur |
| Communication d'incident | Statut du service et incidents en cours | Tous |

**Contre-exemple.** Une page « Journaux » qui lit les journaux techniques partagés avec un simple filtre d'affichage sur le tenant. Une faille de filtre expose des lignes d'autres tenants, avec leurs identifiants et parfois leurs données.

**Limites.** Offrir trop de détails augmente le coût de stockage, le risque de fuite et le bruit. On privilégie des vues synthétiques avec exploration, des durées de conservation maîtrisées, et l'export pour les besoins de conformité.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit est l'une des sources, de nature gouvernance |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements métier y sont consultables |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Le moniteur de tâches s'appuie sur les tâches de fond |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Journaux, métriques et traces sont les trois piliers de l'observabilité |
| [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs) | Le suivi des erreurs agrège les erreurs |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Le filtrage par tenant est une exigence d'isolation |

### 5. Application pratique

**Situation initiale.** Un planificateur signale qu'« une tâche urgente est apparue toute seule sur un aéronef et qu'il est bloqué ».

**Problème.** Personne ne sait quelle règle a créé la tâche, ni pourquoi l'aéronef a changé d'état.

**Application du concept.** L'administrateur utilise la console opérationnelle pour reconstituer le déroulement.

**Déroulé.**

1. Il recherche l'aéronef et affiche son historique d'audit : transition « immobiliser » à 08:12, acteur : automatisation `on_critical_finding`.
2. Il suit le lien vers l'exécution : déclenchée par le constat fd_204, gravité « critique ».
3. Il ouvre le constat : saisi par un technicien à 08:11.
4. Il comprend que la règle a fonctionné comme prévu, et explique la situation au planificateur.
5. Il ajuste la règle pour exiger une confirmation humaine avant immobilisation.

**Résultat.** L'incident est expliqué en cinq minutes, sans support, et une amélioration est apportée.

**Limites.** Si la règle avait appartenu à un autre administrateur, il aurait fallu les droits de lecture sur les automatisations d'autres périmètres.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un journal technique et un journal d'audit ?
2. **Compréhension.** À quoi sert l'identifiant de corrélation dans la console opérationnelle ?
3. **Compréhension.** Citez trois alertes utiles pour un administrateur de tenant.
4. **Pourquoi.** Pourquoi la console ne doit-elle jamais lire directement des journaux partagés sans filtrage fort par tenant ?
5. **Raisonnement pratique.** Comment présenter une erreur d'intégration à un administrateur ?

#### Réponses

1. Le journal technique sert au diagnostic et est conservé peu de temps ; le journal d'audit trace qui a fait quoi, de façon immuable et sur une longue durée.
2. À relier l'audit, les événements, les automatisations, les actions et les journaux d'un même déroulement.
3. Par exemple : intégration en échec, webhook désactivé, quota proche, tâche bloquée.
4. Parce qu'un défaut de filtrage exposerait des données d'autres tenants : l'isolation doit être garantie à la source.
5. Avec son type, le nombre d'occurrences, la période, des exemples, la cause probable et une action possible, sans détails internes de la plateforme.
