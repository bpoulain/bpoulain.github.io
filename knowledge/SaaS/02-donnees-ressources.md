# Module 2 — Modèle universel de données et de ressources

> **Question directrice.** Comment représenter, de façon générique, n'importe quel objet métier, et permettre à un administrateur de le définir sans développeur ?

## Présentation du module

**Objectif.** Apprendre à construire le cœur d'une plateforme générique : un moteur capable de manipuler des types, des propriétés, des relations et des enregistrements définis dynamiquement. C'est la partie que le plan appelle le « moteur Airtable », sans se limiter à la notion de table.

**Prérequis.** Les notions de tenant et de plateforme du [module 1](01-architecture-saas.md). Les notions de table, ligne et colonne rappelées dans la [vue d'ensemble](00-vue-ensemble.md).

**Ordre retenu.** Le module suit trois blocs, comme le plan.

```text
1. Le vocabulaire       entité ─ type ─ propriété ─ métadonnées ─ champs personnalisés ─ relations
                        hiérarchie ─ polymorphisme ─ composition
2. La modélisation      relationnel ─ clés ─ contraintes ─ normalisation ─ index ─ requêtes ─ validation
3. Les concepts avancés schéma dynamique ─ évolution ─ architecture pilotée par les métadonnées
```

Un seul écart avec le plan : la clé primaire et la clé étrangère passent avant les contraintes et la normalisation, car ces deux notions les supposent.

**Convention de vocabulaire.** Dans ce parcours, un **type de ressource** est la définition (par exemple « Aéronef »), une **ressource** est un exemplaire vu par l'API, et un **enregistrement** est sa représentation stockée.

## Sommaire du module

- [2.1 Entité, ressource, objet et enregistrement](#21-entité-ressource-objet-et-enregistrement)
- [2.2 Type et schéma](#22-type-et-schéma)
- [2.3 Propriété et champ](#23-propriété-et-champ)
- [2.4 Métadonnées](#24-métadonnées)
- [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés)
- [2.6 Relation et référence](#26-relation-et-référence)
- [2.7 Hiérarchie](#27-hiérarchie)
- [2.8 Polymorphisme](#28-polymorphisme)
- [2.9 Composition et agrégation](#29-composition-et-agrégation)
- [2.10 Modélisation relationnelle et diagramme entité-relation](#210-modélisation-relationnelle-et-diagramme-entité-relation)
- [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère)
- [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle)
- [2.13 Normalisation](#213-normalisation)
- [2.14 Index](#214-index)
- [2.15 Modèle de requête](#215-modèle-de-requête)
- [2.16 Validation des données](#216-validation-des-données)
- [2.17 Schéma dynamique](#217-schéma-dynamique)
- [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)
- [2.19 Architecture pilotée par les métadonnées et par les modèles](#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)

## 2.1 Entité, ressource, objet et enregistrement

### 1. Comprendre simplement

Quatre mots désignent, selon le milieu, « une chose dont le système garde une trace » : **entité** (*entity*), **ressource** (*resource*), **objet** (*object*) et **enregistrement** (*record*). Ils ne sont pas synonymes. Chacun regarde la même réalité sous un angle différent.

**Pourquoi cela existe.** Ces mots viennent de traditions différentes : la modélisation de données, les API Web, la programmation et les bases de données. Une plateforme générique les croise tous. Sans vocabulaire précis, on confond la description d'une chose avec la chose elle-même.

**Problème résolu.** S'accorder sur ce que la plateforme manipule, et sur les mots qui désignent la définition d'une chose et chacun de ses exemplaires.

**Modèle mental.** Un même animal est appelé « sujet » par un biologiste, « patient » par un vétérinaire et « Rex » par son maître. La réalité est la même ; le mot dépend du point de vue.

**Où l'analogie s'arrête.** En informatique, un même mot peut désigner la définition (le type) dans un outil et l'exemplaire dans un autre. Par exemple, « objet » désigne un type dans certaines plateformes métier et une instance en programmation.

**Exemple.** L'aéronef immatriculé F-ABCD est :

- une **entité** du domaine « Aéronef » (point de vue de la modélisation) ;
- une **ressource** accessible à l'adresse `/aircraft/ac_8f3a` de l'API (point de vue du Web) ;
- un **objet** dans la mémoire du programme (point de vue du code) ;
- un **enregistrement**, c'est-à-dire une ligne dans la base de données (point de vue du stockage).

**Les composants d'une ressource générique.**

1. un **identifiant** unique et stable ;
2. un **type** qui indique ce que c'est ;
3. des **propriétés** qui portent les valeurs ;
4. des **relations** vers d'autres ressources ;
5. des **informations système** (tenant, dates de création et de modification, version).

**Objectif d'apprentissage :** vous pouvez dire quel mot utiliser pour la définition d'une chose et pour un exemplaire, et expliquer pourquoi ces mots ne sont pas interchangeables.

### 2. Connaissances essentielles

#### Définition

- **Entité** : chose distincte du domaine métier, identifiable, sur laquelle le système conserve des informations.
- **Ressource** : entité rendue identifiable et adressable par une interface, en général par une adresse (URI) dans une API.
- **Objet** : exemplaire manipulé par un programme, qui associe des données et du comportement ; dans certaines plateformes, nom donné à un type de données.
- **Enregistrement** : représentation stockée d'un exemplaire, typiquement une ligne dans une table ou un document dans une base.

#### Idées fondamentales

1. **Une chose a une identité.** On peut la désigner sans ambiguïté, même si ses propriétés changent.
2. **La définition est distincte de l'exemplaire.** Le type « Aéronef » n'est pas l'aéronef F-ABCD.
3. **Une plateforme générique unifie la forme.** Toutes les ressources partagent la même structure d'enveloppe, quelle que soit leur nature.
4. **L'adressabilité est une propriété.** Une ressource se désigne par un identifiant, et à travers lui par une adresse.
5. **Les valeurs simples ne sont pas des ressources.** Une date ou un montant n'a pas d'identité propre ; il décrit une ressource.

#### Vocabulaire essentiel

- **Type de ressource** (*resource type*) : définition d'une famille de ressources (Aéronef, Technicien).
- **Instance** : exemplaire concret d'un type.
- **Identifiant** (*identifier*, *ID*) : valeur unique qui désigne une ressource.
- **URI** : adresse normalisée d'une ressource (par exemple `/aircraft/ac_8f3a`).
- **Valeur** (*value*) : donnée sans identité propre (un nombre, une date, un texte).
- **Enveloppe** : structure commune à toutes les ressources (identifiant, type, tenant, version, dates).

#### Relations de cause à effet

- La structure d'enveloppe est la même pour tous les types. Un seul moteur peut donc créer, lire et modifier n'importe quelle ressource.
- Une ressource est désignée par un identifiant stable. Ses propriétés peuvent changer sans que les références vers elle se brisent.
- La définition est distincte de l'exemplaire. On peut donc modifier le type (ajouter un champ) sans recréer les exemplaires.

#### Idées reçues

- **« Entité, objet, ressource et enregistrement veulent dire la même chose. »** Non. Ils désignent des points de vue différents. Les confondre mène à des modèles où la définition et l'exemplaire se mélangent.
- **« Une entité est une table. »** Pas toujours. Une entité peut être stockée dans plusieurs tables ou dans un document, et une table peut stocker plusieurs entités.
- **« Tout est une ressource. »** Non. Les valeurs sans identité (une date, une adresse intégrée) ne sont pas des ressources.

#### Principe clé

La définition d'une chose et ses exemplaires sont deux niveaux distincts ; un identifiant stable relie les exemplaires au reste du système.

#### Si vous ne retenez que trois choses

1. Entité, ressource, objet et enregistrement désignent la même réalité vue sous des angles différents.
2. Il faut distinguer la définition (type) de l'exemplaire (instance).
3. Une ressource est identifiable par un identifiant stable, indépendant de ses propriétés.

### 3. Explication technique détaillée

#### Les quatre points de vue

| Terme | Point de vue | Question posée | Exemple |
|---|---|---|---|
| Entité | Modélisation | Quelles choses existent dans le domaine ? | Aéronef, Technicien |
| Ressource | API Web | Qu'est-ce que le client peut désigner et manipuler ? | `GET /aircraft/ac_8f3a` |
| Objet | Programmation | Comment le code représente-t-il la chose ? | `new Aircraft(...)` |
| Enregistrement | Stockage | Comment la donnée est-elle conservée ? | Une ligne de la table `aircraft` |

#### L'enveloppe d'une ressource générique

```json
{
  "id": "ac_8f3a",
  "type": "aircraft",
  "tenant_id": "ten_airline_01",
  "version": 7,
  "created_at": "2026-03-02T09:14:00Z",
  "updated_at": "2026-10-11T16:40:12Z",
  "properties": {
    "registration": "F-ABCD",
    "model": "A320",
    "status": "active",
    "next_inspection_date": "2026-11-30"
  },
  "relations": {
    "base": "loc_lyon"
  }
}
```

**Comment la lire.** Les champs `id`, `type`, `tenant_id`, `version` et les dates sont **communs** à toutes les ressources et gérés par le moteur. Les `properties` et les `relations` sont **propres au type**, et définis par la configuration.

**Pourquoi cette séparation.** Le moteur peut appliquer partout les mêmes règles d'isolation, de versionnement et d'audit, sans connaître le métier.

#### Identité et égalité

Deux ressources sont la même ressource si elles ont le même identifiant, et non si elles ont les mêmes valeurs. Deux avions de même modèle, même statut et même base sont deux ressources distinctes.

**Contre-exemple.** Une adresse postale intégrée à une fiche (rue, ville, code postal) n'a pas besoin d'identité : c'est une valeur. Deux fiches peuvent avoir « la même adresse » sans partager une ressource.

#### Limites

La notion d'« entité » du DDD est plus étroite : c'est un objet défini par son identité et son cycle de vie, par opposition à l'objet-valeur (voir [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur)). Dans ce module, le mot est pris au sens large de la modélisation de données.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.2 Type et schéma](#22-type-et-schéma) | Le type décrit la structure des ressources du même nom |
| [2.3 Propriété et champ](#23-propriété-et-champ) | Les propriétés portent les valeurs d'une ressource |
| [2.6 Relation et référence](#26-relation-et-référence) | Les relations relient les ressources entre elles |
| [3.1 CRUD, créer, lire, mettre à jour et supprimer](03-crud-runtime-ressources.md#31-crud-créer-lire-mettre-à-jour-et-supprimer) | Les opérations de base (créer, lire, modifier, supprimer) s'appliquent aux ressources |
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | Une API REST expose les ressources à travers des adresses |
| [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) | Le DDD distingue entité et objet-valeur de façon plus précise |

### 5. Application pratique

**Situation initiale.** La plateforme doit gérer des aéronefs pour la compagnie, des équipements pour l'hôpital et des machines pour l'usine.

**Problème.** Écrire trois modules de code différents, un par métier, ne passe pas à l'échelle.

**Application du concept.** On définit une **enveloppe** commune. Un aéronef, un équipement et une machine sont tous des ressources avec un identifiant, un type, un tenant et des propriétés.

**Déroulé.**

1. L'administrateur de chaque tenant définit ses types de ressources.
2. Le moteur crée des ressources en leur attribuant un identifiant et le tenant courant.
3. Les mêmes opérations (créer, lire, modifier, lister) s'appliquent à tous les types.
4. L'API expose chaque type sous une adresse construite de la même manière.

**Résultat.** Un seul moteur sert trois métiers. Ajouter un quatrième métier ne demande pas de nouveau code d'enveloppe.

**Limites.** Une enveloppe trop générique perd en expressivité : certains besoins métier exigent un comportement spécifique, qu'il faut prévoir par des extensions (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un type de ressource et une ressource ?
2. **Compréhension.** Qu'est-ce qui distingue une ressource d'une simple valeur ?
3. **Compréhension.** Citez les composants d'une enveloppe de ressource générique.
4. **Pourquoi.** Pourquoi une plateforme générique donne-t-elle la même enveloppe à tous les types de ressources ?
5. **Raisonnement pratique.** Une adresse postale doit-elle être modélisée comme une ressource distincte dans la fiche d'un technicien ? Justifiez.

#### Réponses

1. Le type est la définition d'une famille (« Aéronef »). La ressource est un exemplaire concret (l'aéronef F-ABCD).
2. Une ressource a une identité propre et stable ; une valeur n'en a pas, elle décrit une ressource.
3. Un identifiant, un type, un tenant, une version, des dates de création et de modification, des propriétés et des relations.
4. Pour appliquer les mêmes opérations, les mêmes règles d'isolation, d'audit et de versionnement à tous les types, avec un seul moteur.
5. En général non : l'adresse est une valeur propre à la fiche. Elle ne devient une ressource que si on doit la partager entre plusieurs fiches, la référencer ou la gérer indépendamment.

## 2.2 Type et schéma

### 1. Comprendre simplement

Un **type** (*type*) est une catégorie de ressources qui partagent la même structure : tous les aéronefs ont une immatriculation, un modèle et un statut. Un **schéma** (*schema*) est la description formelle de cette structure : la liste des propriétés, leur nature, et les règles qu'elles doivent respecter.

**Pourquoi cela existe.** Sans description commune, chaque enregistrement serait une collection libre de valeurs, impossible à contrôler, à interroger ou à afficher de manière cohérente.

**Problème résolu.** Garantir que les ressources d'une même famille ont la même forme, et que le système peut le vérifier.

**Modèle mental.** Un formulaire papier vierge. Le formulaire est le schéma ; chaque formulaire rempli est une ressource.

**Où l'analogie s'arrête.** Un formulaire papier est imprimé une fois. Un schéma de plateforme peut évoluer pendant que des milliers de formulaires remplis existent déjà (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

**Exemple.** Le type « Aéronef » a pour schéma : `registration` (texte obligatoire), `model` (texte obligatoire), `status` (valeur parmi une liste), `next_inspection_date` (date facultative).

**Attention au mot « schéma ».** Il a deux sens : la description d'une structure, et, dans PostgreSQL, un espace de noms qui regroupe des tables. Ce parcours précise le sens à chaque emploi.

**Objectif d'apprentissage :** vous pouvez expliquer la différence entre un type et son schéma, et citer les éléments que contient un schéma.

### 2. Connaissances essentielles

#### Définition

- **Type** : catégorie de ressources qui partagent une même structure et des règles communes.
- **Schéma** : description formelle de la structure d'un type, ou d'un ensemble de types : propriétés, types de valeurs, contraintes et relations.

#### Idées fondamentales

1. **Le type nomme, le schéma décrit.** Le type est le nom d'une famille ; le schéma est sa description précise.
2. **Un schéma est un contrat.** Il dit ce qu'une donnée valide doit contenir.
3. **Un schéma est de la donnée.** Il peut être stocké, lu, comparé, versionné.
4. **Les types de valeurs sont limités et précis.** Texte, entier, décimal, booléen, date, énumération, référence.
5. **Le schéma peut être appliqué à l'écriture ou à la lecture.** Dans le premier cas, une donnée invalide est refusée ; dans le second, elle est acceptée puis interprétée.

#### Vocabulaire essentiel

- **Type de données** (*data type*) : nature d'une valeur (texte, entier, date…).
- **Énumération** (*enum*) : liste fermée de valeurs autorisées.
- **Obligatoire** (*required*) : la valeur doit être présente.
- **Valeur par défaut** (*default*) : valeur utilisée si aucune n'est fournie.
- **Schéma à l'écriture** (*schema-on-write*) : la conformité est vérifiée avant stockage.
- **Schéma à la lecture** (*schema-on-read*) : la structure est appliquée au moment de la lecture.
- **JSON Schema** : standard de description de la structure de documents JSON.

#### Relations de cause à effet

- Le schéma exige un champ. Une écriture sans ce champ est refusée : la qualité des données est garantie à l'entrée.
- Le schéma est trop souple. Des variantes de valeurs apparaissent (« actif », « Actif », « active »), et les requêtes ne trouvent plus tout.
- Le schéma est trop rigide. Les utilisateurs contournent en mettant des informations dans des champs libres.

#### Idées reçues

- **« Les bases de documents n'ont pas de schéma. »** Elles n'imposent pas toujours un schéma au stockage, mais l'application en suppose un. Le schéma est alors implicite, dans le code.
- **« Un schéma est figé. »** Non. Il évolue, et la gestion de cette évolution est un sujet central (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).
- **« Type et classe, c'est pareil. »** Pas exactement. Une classe de programmation porte aussi du comportement. Un type de ressource décrit surtout une structure de données.

#### Principe clé

Un schéma est un contrat explicite sur la forme des données : ce qui est écrit, une fois, peut être vérifié partout.

#### Si vous ne retenez que trois choses

1. Un type est une famille de ressources ; son schéma décrit sa structure précise.
2. Un schéma est un contrat vérifiable et il est lui-même de la donnée.
3. Un schéma peut être appliqué à l'écriture ou à la lecture : ce choix détermine où se situent les erreurs.

### 3. Explication technique détaillée

#### Un schéma en JSON Schema

```json
{
  "type": "object",
  "properties": {
    "registration": { "type": "string", "pattern": "^F-[A-Z]{4}$" },
    "model": { "type": "string", "minLength": 1 },
    "status": { "enum": ["active", "in_inspection", "retired"] },
    "next_inspection_date": { "type": "string", "format": "date" }
  },
  "required": ["registration", "model", "status"]
}
```

**Comment le lire.** Chaque propriété déclare son type et ses règles. La liste `required` indique celles qui sont obligatoires. Une donnée qui ne respecte pas ces règles est rejetée.

#### Les types de valeurs usuels

| Type | Exemple | Point d'attention |
|---|---|---|
| Texte | Immatriculation | Longueur maximale, encodage |
| Entier | Nombre d'heures de vol | Dépassement de capacité |
| Décimal | Montant | Ne pas utiliser de nombre flottant pour de l'argent |
| Booléen | Navigabilité | Préférer une énumération si une troisième valeur est possible |
| Date et heure | Prochaine inspection | Fuseaux horaires ; stocker en UTC |
| Énumération | Statut | Évolution de la liste |
| Référence | Base d'affectation | Intégrité (voir [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle)) |

**Exemple de piège.** Stocker un montant en nombre flottant provoque des erreurs d'arrondi (0,1 + 0,2 ne donne pas exactement 0,3 en représentation binaire). On utilise un type décimal ou des entiers en plus petite unité.

#### Schéma à l'écriture ou à la lecture

| Critère | Schéma à l'écriture | Schéma à la lecture |
|---|---|---|
| Moment du contrôle | Avant stockage | Au moment de l'usage |
| Qualité des données | Garantie | À la charge du lecteur |
| Souplesse d'intégration | Faible | Forte |
| Usage typique | Bases relationnelles, moteurs métier | Lacs de données, journaux |

**Choix pour une plateforme métier.** Le schéma à l'écriture est généralement préféré : une plateforme destinée à des processus métier a besoin de données fiables.

#### Limites

Un schéma n'exprime pas tout. Une règle comme « un aéronef ne peut pas être actif si son inspection est en retard » dépasse la structure : c'est une règle métier (voir [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](#21-entité-ressource-objet-et-enregistrement) | Le type est la définition des ressources de même famille |
| [2.3 Propriété et champ](#23-propriété-et-champ) | Le schéma est composé de définitions de propriétés |
| [2.16 Validation des données](#216-validation-des-données) | La validation applique le schéma à chaque écriture |
| [2.17 Schéma dynamique](#217-schéma-dynamique) | Le schéma dynamique est un schéma que l'administrateur modifie à l'exécution |
| [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma) | L'évolution du schéma gère les changements dans le temps |
| [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | Le sens PostgreSQL du mot « schéma » intervient dans les modèles multi-tenant |

### 5. Application pratique

**Situation initiale.** La compagnie aérienne saisit les aéronefs depuis plusieurs sources. Les statuts sont saisis comme « actif », « Actif », « en service ».

**Problème.** Les listes et les rapports ne sont plus fiables, car une même réalité apparaît sous plusieurs formes.

**Application du concept.** L'administrateur définit le schéma de l'aéronef avec une énumération pour `status`.

**Déroulé.**

1. Le schéma déclare `status` comme énumération de trois valeurs.
2. Le moteur valide chaque écriture contre ce schéma.
3. Les écritures avec une autre valeur sont refusées avec un message explicite.
4. Les données existantes non conformes sont signalées pour correction.

**Résultat.** Les rapports par statut redeviennent exacts.

**Limites.** Si la liste doit évoluer, il faut un processus pour ajouter une valeur sans casser les intégrations existantes (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un type et un schéma ?
2. **Compréhension.** Que signifie « schéma à l'écriture » ?
3. **Compréhension.** Pourquoi ne stocke-t-on pas un montant d'argent dans un nombre flottant ?
4. **Pourquoi.** Pourquoi dit-on qu'un schéma est un contrat ?
5. **Raisonnement pratique.** Un champ `status` est un texte libre. Quels problèmes peut-on prévoir, et comment les éviter ?

#### Réponses

1. Le type est le nom et la catégorie d'une famille de ressources. Le schéma décrit précisément sa structure : propriétés, types de valeurs, règles.
2. La conformité d'une donnée au schéma est vérifiée avant son stockage ; une donnée non conforme est refusée.
3. Parce que les nombres flottants binaires ne représentent pas exactement certaines valeurs décimales, ce qui produit des erreurs d'arrondi. On utilise un type décimal ou des entiers dans la plus petite unité.
4. Parce qu'il définit ce qu'une donnée valide doit contenir : producteurs et consommateurs peuvent se fier à cette forme et la vérifier.
5. Des variantes de la même valeur (casse, fautes, synonymes) et des requêtes incomplètes. On les évite par une énumération, qui limite les valeurs à une liste fermée.

## 2.3 Propriété et champ

### 1. Comprendre simplement

Une **propriété** (*property*) est une caractéristique d'une ressource : l'immatriculation d'un aéronef, sa date d'inspection. Un **champ** (*field*) est l'emplacement concret où cette caractéristique est déclarée, saisie ou stockée : une colonne, une zone d'un formulaire, un champ d'un document.

**Pourquoi cela existe.** Il faut séparer l'idée (ce que l'on veut savoir) de sa réalisation (où, comment, avec quelles règles). Une même propriété peut apparaître dans un formulaire, une table, une API et un rapport, avec des formes différentes.

**Problème résolu.** Décrire chaque caractéristique d'une ressource de façon complète : son nom, sa nature, ses règles et son affichage.

**Modèle mental.** La propriété est « la couleur » d'une voiture. Le champ est la case « couleur » sur la carte grise.

**Où l'analogie s'arrête.** Dans la pratique, beaucoup d'outils emploient les deux mots indifféremment. L'important est de savoir quelles informations accompagnent une propriété.

**Exemple.** La propriété « prochaine inspection » du type *aéronef* est de type date, facultative, sans valeur par défaut, affichée sous le libellé « Prochaine inspection » dans le formulaire.

**Les composants d'une définition de champ.**

1. un **nom technique** stable ;
2. un **libellé** affiché ;
3. un **type de valeur** ;
4. des **contraintes** (obligatoire, unique, bornes) ;
5. une **valeur par défaut** ;
6. des **indications d'usage** (aide, visibilité).

**Objectif d'apprentissage :** vous pouvez lister les éléments qui définissent un champ, et expliquer pourquoi le nom technique et le libellé doivent être séparés.

### 2. Connaissances essentielles

#### Définition

- **Propriété** : caractéristique nommée d'une ressource, qui prend une valeur pour chaque exemplaire.
- **Champ** : déclaration concrète d'une propriété dans un schéma, un formulaire ou un stockage, avec son type et ses règles.

#### Idées fondamentales

1. **Une définition est distincte de sa valeur.** Le champ « statut » est une définition ; « actif » est une valeur.
2. **Le nom technique et le libellé sont séparés.** Le premier est stable ; le second peut être traduit ou reformulé.
3. **Chaque champ porte des règles.** Obligatoire, unique, bornes, énumération, format.
4. **Certains champs sont gérés par le système.** Identifiant, dates, version : l'utilisateur ne peut pas les modifier.
5. **Certains champs sont calculés.** Leur valeur est dérivée d'autres champs par une formule (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)).

#### Vocabulaire essentiel

- **Nom technique** (*API name*, *key*) : identifiant stable du champ, utilisé par le code et les API.
- **Libellé** (*label*) : texte affiché à l'utilisateur, éventuellement traduit.
- **Obligatoire** (*required*) : une valeur doit être fournie.
- **Unique** : deux ressources ne peuvent pas avoir la même valeur dans le périmètre défini.
- **Valeur nulle** (*null*) : absence de valeur, à distinguer de zéro ou de texte vide.
- **Champ calculé** (*computed field*) : champ dont la valeur résulte d'une formule.
- **Champ système** (*system field*) : champ géré par la plateforme.

#### Relations de cause à effet

- Le nom technique est confondu avec le libellé. Renommer l'affichage casse les intégrations qui utilisaient l'ancien nom.
- Un champ devient obligatoire alors que des ressources existantes n'ont pas de valeur. Ces ressources deviennent invalides à la prochaine modification.
- Un champ calculé dépend d'un autre. Si ce dernier change, il faut recalculer, ou calculer à la lecture.

#### Idées reçues

- **« Un champ vide est égal à zéro. »** Non. `null`, `0` et `""` n'ont pas le même sens. Confondre une valeur absente et une valeur nulle fausse les calculs.
- **« Un libellé peut servir d'identifiant. »** Non. Un libellé change, se traduit et peut se répéter.
- **« Tous les champs sont modifiables. »** Non. Certains sont en lecture seule, ou calculés, ou propres au système.

#### Principe clé

Un champ est une définition riche, pas seulement un nom : type, règles, libellé et comportement s'ajoutent à sa valeur.

#### Si vous ne retenez que trois choses

1. Une propriété est une caractéristique ; un champ est sa déclaration avec type et règles.
2. Le nom technique est stable, le libellé est libre.
3. Absence de valeur, zéro et texte vide sont trois choses différentes.

### 3. Explication technique détaillée

#### La définition d'un champ comme donnée

```json
{
  "api_name": "next_inspection_date",
  "label": { "fr": "Prochaine inspection", "en": "Next inspection" },
  "data_type": "date",
  "required": false,
  "unique": false,
  "default": null,
  "read_only": false,
  "help_text": "Date limite de la prochaine inspection réglementaire."
}
```

**Comment le lire.** La plateforme stocke cette définition comme une donnée. Le moteur s'en sert pour valider les écritures, pour construire des formulaires et pour documenter l'API.

**Pourquoi.** Si la définition est une donnée, un administrateur peut la modifier sans développeur, et le moteur applique partout la même règle.

#### Types de champs particuliers

| Type | Particularité | Exemple |
|---|---|---|
| Calculé | Valeur dérivée par formule, souvent en lecture seule | Jours avant la prochaine inspection |
| Multi-valeurs | Contient une liste de valeurs | Certifications d'un technicien |
| Référence | Pointe vers une autre ressource | Base d'affectation |
| Système | Géré par la plateforme | Date de création |
| Sensible | Soumis à des règles d'accès renforcées | Numéro de sécurité sociale |

#### Renommage et suppression

**Renommer** le libellé est sans risque. Renommer le **nom technique** est un changement d'interface : les API, les automatisations et les rapports qui l'utilisent peuvent casser. Une plateforme prudente interdit ce changement, ou le traite comme la création d'un nouveau champ avec une période de transition.

**Supprimer** un champ implique de décider du sort des valeurs existantes : suppression immédiate, archivage, ou masquage avec conservation.

**Limites.** Chaque règle supplémentaire sur un champ (unique, obligatoire) a un coût : vérification à l'écriture et traitement des données existantes lors d'un changement.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.2 Type et schéma](#22-type-et-schéma) | Le schéma est l'ensemble des définitions de champs d'un type |
| [2.16 Validation des données](#216-validation-des-données) | La validation applique les règles portées par chaque champ |
| [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés) | Un champ personnalisé est un champ ajouté par un tenant |
| [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) | Les champs calculés reposent sur des formules |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les permissions peuvent être accordées champ par champ |

### 5. Application pratique

**Situation initiale.** Le service qualité de la compagnie veut distinguer « inspection non planifiée » d'« inspection sans date prévue ».

**Problème.** Un champ date vide ne permet pas de savoir si la date est inconnue ou si l'inspection est inutile.

**Application du concept.** L'administrateur ajoute un champ `inspection_required` (booléen, obligatoire, `true` par défaut) et rend la date obligatoire lorsque la valeur est vraie.

**Déroulé.**

1. L'administrateur crée le champ avec son nom technique et son libellé.
2. Il définit la valeur par défaut et la règle de dépendance.
3. Le moteur applique la valeur par défaut aux ressources existantes.
4. Le formulaire et l'API reflètent immédiatement le nouveau champ.

**Résultat.** On sait désormais distinguer une date manquante d'une inspection non requise.

**Limites.** La règle de dépendance entre deux champs est une validation entre champs : elle dépasse la définition d'un champ isolé (voir [2.16 Validation des données](#216-validation-des-données)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une propriété et un champ ?
2. **Compréhension.** Pourquoi sépare-t-on le nom technique du libellé ?
3. **Compréhension.** Quelle est la différence entre `null`, zéro et une chaîne vide ?
4. **Pourquoi.** Pourquoi la définition d'un champ est-elle stockée comme une donnée dans une plateforme configurable ?
5. **Raisonnement pratique.** Un administrateur veut renommer le champ `reg` en `registration`. Quels risques voyez-vous ?

#### Réponses

1. La propriété est la caractéristique de la ressource. Le champ est sa déclaration concrète, avec type, règles et libellé.
2. Le nom technique doit rester stable pour les intégrations. Le libellé peut changer, être traduit ou reformulé sans effet technique.
3. `null` signifie « pas de valeur », zéro est une valeur numérique, et la chaîne vide est une valeur de texte sans caractère. Ils ne sont pas interchangeables.
4. Pour que l'administrateur puisse la modifier sans développeur, et que le moteur applique partout la même règle à partir de la même source.
5. Les API, automatisations, rapports et exports qui utilisent `reg` cesseraient de fonctionner. Il faut une période de transition, par exemple un alias, ou bien créer un nouveau champ et migrer.

## 2.4 Métadonnées

### 1. Comprendre simplement

Les **métadonnées** (*metadata*) sont des données qui décrivent d'autres données. « L'aéronef F-ABCD est actif » est une donnée. « Le type Aéronef possède un champ obligatoire `status` qui ne peut valoir que `active`, `in_inspection` ou `retired` » est une métadonnée.

**Pourquoi cela existe.** Pour traiter des données de façon générique, un programme doit savoir comment elles sont faites. Cette connaissance doit être explicite, stockée quelque part, et pas enfouie dans le code.

**Problème résolu.** Permettre à un même moteur de traiter n'importe quel type de données en consultant leur description.

**Modèle mental.** Dans une bibliothèque, les livres sont les données. Le catalogue (titre, auteur, rayon, cote) est la métadonnée : il décrit les livres sans en contenir le texte.

**Où l'analogie s'arrête.** Un catalogue de bibliothèque décrit seulement. Dans une plateforme, les métadonnées **pilotent** le comportement : elles décident de ce qui est accepté, affiché ou refusé.

**Exemple.** La définition du champ `status` (type, valeurs autorisées, libellé, caractère obligatoire) est une métadonnée. L'aéronef F-ABCD, avec son statut `active`, est une donnée.

**Les familles de métadonnées.**

1. **structurelles** : types, champs, relations ;
2. **descriptives** : libellés, aides, catégories ;
3. **administratives** : propriétaire, date de création, version ;
4. **comportementales** : règles, états, permissions, vues.

**Objectif d'apprentissage :** vous pouvez donner un exemple de donnée et la métadonnée qui la décrit, et expliquer pourquoi une plateforme générique repose sur elles.

### 2. Connaissances essentielles

#### Définition

Une **métadonnée** est une donnée qui décrit la structure, le sens, l'origine, les règles ou l'usage d'une autre donnée. Dans une plateforme configurable, l'ensemble des métadonnées constitue le modèle que le moteur interprète.

#### Idées fondamentales

1. **Une métadonnée est une donnée.** On peut la stocker, l'interroger, la versionner et la protéger comme les autres.
2. **La distinction est relative.** Ce qui est donnée à un niveau est métadonnée à un autre.
3. **Les métadonnées décrivent le comportement.** Au-delà de la structure, elles portent règles, états, droits et présentations.
4. **Le moteur est séparé du modèle.** Le code interprète les métadonnées ; il ne contient pas le métier.
5. **Les métadonnées doivent rester cohérentes avec les données.** Si elles changent, les données existantes doivent rester interprétables.

#### Vocabulaire essentiel

- **Méta-niveau** : niveau qui décrit un autre niveau (le schéma décrit les données).
- **Catalogue de métadonnées** (*metadata repository*) : stockage des définitions.
- **Introspection** (*introspection*) : capacité d'un système à interroger sa propre description.
- **Dictionnaire de données** (*data dictionary*) : documentation des champs et de leur sens.
- **Métadonnée système** (*system metadata*) : information gérée par la plateforme sur chaque ressource.

#### Relations de cause à effet

- Les métadonnées décrivent un champ. Le moteur peut valider, afficher et exposer ce champ sans code spécifique.
- Les métadonnées sont modifiées par un administrateur. Le comportement du système change sans déploiement.
- Les métadonnées sont mises en cache. Un changement n'est visible qu'après invalidation du cache, ce qui crée un décalage.

#### Idées reçues

- **« Les métadonnées sont de la documentation. »** Non. Dans une plateforme, elles sont exécutables : le moteur les interprète.
- **« Métadonnées et données sont deux mondes séparés. »** Non. Les deux sont de la donnée ; seule leur fonction diffère.
- **« Les métadonnées ne changent jamais. »** Non. Elles évoluent, et chaque changement doit être géré (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

#### Principe clé

Les métadonnées déplacent la connaissance du métier du code vers la donnée, ce qui permet de la changer sans reprogrammer.

#### Si vous ne retenez que trois choses

1. Une métadonnée décrit une donnée : sa structure, son sens, ses règles.
2. Dans une plateforme configurable, les métadonnées pilotent le comportement du moteur.
3. Les métadonnées sont des données : elles se stockent, se versionnent et se sécurisent comme les autres.

### 3. Explication technique détaillée

#### Les niveaux de description

```text
Niveau 3 : méta-modèle   « un type possède des champs, des relations, des règles »
              │ décrit
Niveau 2 : métadonnées   « le type Aéronef a le champ registration, obligatoire »
              │ décrit
Niveau 1 : données       « l'aéronef F-ABCD a pour modèle A320 »
```

**Comment lire le schéma.** Chaque niveau est de la donnée pour le niveau du dessus, et la description du niveau du dessous. Le méta-modèle (niveau 3) est fixe, programmé dans le moteur. Les métadonnées (niveau 2) sont éditées par les administrateurs. Les données (niveau 1) sont saisies par les utilisateurs.

#### Les catalogues dans les bases de données

Les bases relationnelles décrivent leurs propres tables dans des tables spéciales. Le standard SQL prévoit des vues d'information (`INFORMATION_SCHEMA`) pour les interroger.

```sql
-- Lister les colonnes de la table aircraft
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'aircraft';
```

**Pourquoi c'est important.** Un moteur générique applique le même principe : il stocke sa propre description dans ses tables et la consulte pour traiter les données.

#### Stockage des métadonnées d'une plateforme

| Élément décrit | Table de métadonnées (exemple) | Contenu typique |
|---|---|---|
| Types | `resource_types` | Nom technique, libellé, version |
| Champs | `field_definitions` | Type de valeur, règles, ordre |
| Relations | `relation_definitions` | Cardinalité, types liés |
| Règles | `rule_definitions` | Conditions, actions |
| Vues | `view_definitions` | Colonnes, filtres, tri |

**Modes de défaillance.**

- **Dérive** : les données existantes ne respectent plus la définition modifiée.
- **Cache périmé** : un changement n'est pas vu par tous les serveurs.
- **Amorçage circulaire** : les métadonnées décrivant les métadonnées elles-mêmes demandent un noyau fixe, programmé.

**Limites.** Plus on déplace de comportement dans les métadonnées, plus on doit fournir d'outils pour les tester, les versionner et en comprendre l'impact (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.2 Type et schéma](#22-type-et-schéma) | Le schéma est la forme la plus répandue de métadonnée |
| [2.17 Schéma dynamique](#217-schéma-dynamique) | Le schéma dynamique repose sur des métadonnées modifiables à l'exécution |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'architecture pilotée par les métadonnées en est la conséquence directe |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | La plateforme d'administration édite les métadonnées |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les métadonnées doivent être versionnées comme toute configuration |

### 5. Application pratique

**Situation initiale.** La plateforme doit afficher un formulaire de saisie pour n'importe quel type de ressource.

**Problème.** Programmer un formulaire par type est impossible : les types sont créés par les administrateurs.

**Application du concept.** Le formulaire est généré à partir des métadonnées des champs du type.

**Déroulé.**

1. Le moteur lit les définitions de champs du type demandé.
2. Pour chaque champ, il choisit un composant selon le type (texte, date, liste).
3. Il applique les libellés, les valeurs par défaut et l'obligation.
4. À l'envoi, il valide les valeurs avec les mêmes définitions.

**Résultat.** Un seul composant de formulaire sert tous les types, présents et futurs.

**Limites.** Un formulaire généré est moins soigné qu'un formulaire dessiné à la main. Les plateformes ajoutent des métadonnées de présentation (groupes, ordre, aides) pour s'en rapprocher (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Donnez un exemple de donnée et la métadonnée qui la décrit.
2. **Compréhension.** Quelles sont les quatre familles de métadonnées d'une plateforme ?
3. **Compréhension.** Que fait `INFORMATION_SCHEMA` ?
4. **Pourquoi.** Pourquoi dit-on que les métadonnées d'une plateforme sont « exécutables » ?
5. **Raisonnement pratique.** Un administrateur modifie la définition d'un champ, mais certains serveurs continuent d'appliquer l'ancienne règle pendant une minute. Quelle est la cause probable ?

#### Réponses

1. Donnée : « F-ABCD a le statut actif ». Métadonnée : « le champ `status` du type Aéronef est une énumération obligatoire de trois valeurs ».
2. Structurelles (types, champs, relations), descriptives (libellés, aides), administratives (propriétaire, version), comportementales (règles, états, permissions, vues).
3. Il expose, sous forme de vues interrogeables en SQL, la description des tables et des colonnes de la base.
4. Parce que le moteur les interprète à l'exécution : elles décident de ce qui est accepté, affiché ou refusé, sans changement de code.
5. Un cache de métadonnées périmé : ces serveurs n'ont pas encore reçu la nouvelle version.

## 2.5 Champs et objets personnalisés

### 1. Comprendre simplement

Un **champ personnalisé** (*custom field*) est un champ qu'un client ajoute lui-même à un type fourni par la plateforme. Un **objet personnalisé** (*custom object*) est un type entier que le client crée lui-même. Dans les deux cas, ce n'est pas le fournisseur qui programme l'ajout.

**Pourquoi cela existe.** Chaque client a des besoins propres. Aucun fournisseur ne peut prévoir tous les champs et tous les types de tous les métiers. La plateforme doit donc laisser le client étendre le modèle.

**Problème résolu.** Adapter le modèle de données à chaque client, sans ajouter de code au produit ni créer une version dédiée.

**Modèle mental.** Un classeur à anneaux vendu avec des intercalaires standard. Le client peut ajouter ses propres intercalaires (champs) et ses propres sections (objets), sans changer le classeur.

**Où l'analogie s'arrête.** Un intercalaire papier n'a aucun impact sur le reste. Un champ personnalisé doit être stocké, validé, indexé, sécurisé, exporté et versionné, comme un champ standard.

**Exemple.** La compagnie aérienne ajoute le champ personnalisé « Numéro de série du train d'atterrissage » au type *Aéronef*. L'hôpital crée l'objet personnalisé « Contrat de maintenance », que le fournisseur n'a jamais prévu.

**Objectif d'apprentissage :** vous pouvez dire pourquoi une plateforme offre ces extensions, et citer deux techniques de stockage avec leurs compromis.

### 2. Connaissances essentielles

#### Définition

- **Champ personnalisé** : champ ajouté par un tenant à un type existant, propre à ce tenant.
- **Objet personnalisé** : type de ressource défini par un tenant, absent du catalogue standard de la plateforme.

#### Idées fondamentales

1. **L'extension est propre au tenant.** Un champ créé par un tenant n'apparaît pas chez les autres.
2. **Un champ personnalisé doit être traité comme un champ standard.** Validation, droits, API, rapports.
3. **Le stockage est un choix de conception.** Il existe plusieurs techniques, avec des compromis différents.
4. **Les extensions ont des limites.** Nombre maximal de champs, types autorisés, noms réservés.
5. **Les extensions doivent coexister avec les évolutions du standard.** Le fournisseur peut ajouter un champ standard de même nom.

#### Vocabulaire essentiel

- **Champ standard** : champ fourni par la plateforme, commun à tous les tenants.
- **Extension** : ajout propre à un tenant.
- **EAV** (*Entity–Attribute–Value*) : modèle où chaque valeur est une ligne (entité, attribut, valeur).
- **Colonne JSON** : colonne qui contient un document JSON dans une table relationnelle.
- **Préfixe ou suffixe de nom** : marque qui distingue les champs personnalisés des champs standard (par exemple le suffixe `__c` chez Salesforce).
- **Limite** (*governor limit*) : plafond imposé pour protéger la plateforme.

#### Relations de cause à effet

- Chaque tenant peut ajouter des champs. Le modèle physique de la base ne peut plus être le même pour tous : il faut une technique de stockage adaptée.
- Un champ personnalisé est utilisé dans des filtres. Sans index adapté, les requêtes ralentissent avec le volume.
- Le fournisseur ajoute un champ standard du même nom. Il peut entrer en conflit avec un champ personnalisé existant.

#### Idées reçues

- **« Ajouter une colonne par champ personnalisé est la solution naturelle. »** Cela fonctionne à petite échelle, mais avec des milliers de tenants, les migrations par tenant deviennent ingérables.
- **« Un champ personnalisé est moins fiable qu'un champ standard. »** Pas nécessairement, s'il bénéficie des mêmes règles de validation et de sécurité.
- **« On peut laisser les clients créer autant de champs qu'ils veulent. »** Non. Sans limite, un tenant peut dégrader les performances de tous.

#### Principe clé

Un champ personnalisé doit être de la même nature qu'un champ standard pour l'utilisateur, tout en étant isolé et borné pour la plateforme.

#### Si vous ne retenez que trois choses

1. Champs et objets personnalisés permettent à chaque tenant d'étendre le modèle sans code.
2. Plusieurs techniques de stockage existent, avec des compromis de flexibilité, de performance et d'intégrité.
3. Les extensions doivent être validées, sécurisées et limitées comme le reste.

### 3. Explication technique détaillée

#### Les quatre techniques de stockage

**Technique 1 : une colonne réelle par champ.**

```sql
ALTER TABLE aircraft ADD COLUMN landing_gear_serial text;
```

*Avantages.* Types stricts, index natifs, requêtes simples.
*Inconvénients.* Une modification du schéma physique par tenant ; la table devient très large ; les migrations deviennent difficiles avec de nombreux tenants.

**Technique 2 : une colonne JSON.**

```sql
ALTER TABLE aircraft ADD COLUMN custom jsonb NOT NULL DEFAULT '{}';
-- Valeur : {"landing_gear_serial": "LG-2291"}
```

*Avantages.* Flexible, une seule table, index possibles sur certains chemins.
*Inconvénients.* Typage et intégrité à la charge du moteur ; requêtes plus complexes ; index à gérer.

**Technique 3 : le modèle EAV.**

```text
custom_values(tenant_id, resource_id, field_id, value_text, value_number, value_date)
```

*Avantages.* Très souple, aucun changement de schéma physique.
*Inconvénients.* Requêtes complexes (une jointure par champ), performances limitées, typage faible.

**Technique 4 : table générique à colonnes flexibles et métadonnées.** Une grande table contient des colonnes génériques (par exemple `value0`, `value1`, …), et les métadonnées indiquent quelle colonne correspond à quel champ de quel type et de quel tenant. Cette approche a été décrite publiquement par Salesforce dans un article présenté à SIGMOD en 2009.

*Avantages.* Pas de changement de schéma physique ; bonnes performances avec des index dédiés.
*Inconvénients.* Complexité du moteur ; données moins lisibles directement en base.

#### Comparaison

| Critère | Colonne réelle | Colonne JSON | EAV | Table générique |
|---|---|---|---|---|
| Souplesse | Faible | Élevée | Très élevée | Élevée |
| Typage | Fort | Moteur | Faible | Moteur |
| Requêtes | Simples | Moyennes | Complexes | Via le moteur |
| Migrations par tenant | Nombreuses | Aucune | Aucune | Aucune |
| Indexation | Native | Partielle | Difficile | Dédiée |
| Adaptée à de nombreux tenants | Non | Oui | Oui | Oui |

#### Gouvernance des extensions

- **Nommage** : préfixe ou suffixe, pour éviter les collisions avec le standard.
- **Limites** : nombre de champs et d'objets par tenant, types autorisés.
- **Suppression** : décider du sort des données (voir [2.3 Propriété et champ](#23-propriété-et-champ)).
- **Droits** : les mêmes règles que pour les champs standard (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

**Limites.** Il n'existe pas de solution qui cumule souplesse totale, performance maximale et simplicité d'ingénierie. Le choix dépend du nombre de tenants, du volume attendu et du niveau de personnalisation visé.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.3 Propriété et champ](#23-propriété-et-champ) | Un champ personnalisé est un champ défini par le tenant |
| [2.17 Schéma dynamique](#217-schéma-dynamique) | Le schéma dynamique est le mécanisme qui rend possibles ces extensions |
| [2.14 Index](#214-index) | Les extensions posent la question de l'indexation de champs inconnus à l'avance |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La personnalisation fait partie de la configuration par tenant |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions de comportement sont traitées au module 10 |

### 5. Application pratique

**Situation initiale.** Dix tenants demandent chacun deux ou trois champs supplémentaires sur le type *Aéronef*.

**Problème.** Ajouter des colonnes par tenant dans la table partagée produirait une table très large, avec des colonnes vides pour la plupart des tenants.

**Application du concept.** La plateforme adopte une colonne JSON pour les champs personnalisés, et déclare chaque champ dans les métadonnées du tenant.

**Déroulé.**

1. L'administrateur déclare le champ personnalisé, son type et ses règles.
2. Le moteur valide les écritures de ce champ avec la définition du tenant.
3. La valeur est stockée dans la colonne JSON de la ressource.
4. Si le champ est utilisé en filtre fréquent, un index sur le chemin JSON est créé.

**Résultat.** Chaque tenant a son modèle étendu sans modification du schéma physique.

**Limites.** Les requêtes sur un champ non indexé deviennent lentes à grand volume. Il faut une politique pour décider quels champs méritent un index.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un champ personnalisé et un objet personnalisé ?
2. **Compréhension.** Citez deux techniques de stockage des champs personnalisés.
3. **Compréhension.** Pourquoi limite-t-on le nombre de champs personnalisés par tenant ?
4. **Pourquoi.** Pourquoi une colonne réelle par champ personnalisé est-elle difficile avec de nombreux tenants ?
5. **Raisonnement pratique.** Un tenant filtre souvent ses aéronefs sur un champ JSON personnalisé, et la recherche ralentit. Que proposez-vous ?

#### Réponses

1. Un champ personnalisé ajoute une propriété à un type existant. Un objet personnalisé crée un type entier.
2. Par exemple une colonne JSON et le modèle EAV. On peut aussi citer la colonne réelle et la table générique à colonnes flexibles.
3. Pour protéger la plateforme : sans limite, un tenant peut dégrader les performances de tous les autres.
4. Chaque ajout modifie le schéma physique partagé. Avec de nombreux tenants, cela produit une table très large et des migrations difficiles à gérer.
5. Créer un index sur le chemin JSON concerné, ou promouvoir le champ au rang de colonne dédiée si son usage est massif.

## 2.6 Relation et référence

### 1. Comprendre simplement

Une **relation** (*relation*) est un lien nommé entre deux ressources : un aéronef *est basé à* un aéroport, une tâche de maintenance *concerne* un aéronef. Une **référence** (*reference*) est la manière concrète de stocker ce lien : un champ qui contient l'identifiant de l'autre ressource.

**Pourquoi cela existe.** Les choses du monde sont liées entre elles. Si l'on recopie les informations d'une ressource dans toutes celles qui la concernent, les copies divergent dès que l'original change. On stocke donc l'information une seule fois, et on y renvoie.

**Problème résolu.** Représenter les liens entre ressources sans dupliquer les données.

**Modèle mental.** Un carnet d'adresses où une fiche indique « voir aussi : fiche 4521 ». On ne recopie pas la fiche, on y renvoie.

**Où l'analogie s'arrête.** Dans un carnet papier, personne ne vous prévient quand la fiche 4521 est détruite. Une plateforme doit détecter ce cas, et décider de ce qui arrive aux fiches qui y renvoient (voir [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle)).

**Exemple.** La tâche de maintenance T-1042 contient un champ `aircraft` qui vaut `ac_8f3a`. Pour afficher l'immatriculation, le moteur suit la référence jusqu'à l'aéronef.

**Les composants d'une relation.**

1. un **type source** et un **type cible** ;
2. un **nom**, et le nom de la relation inverse ;
3. une **cardinalité** (combien de ressources de chaque côté) ;
4. un caractère **obligatoire** ou facultatif ;
5. un comportement à la **suppression** de la cible.

**Objectif d'apprentissage :** vous pouvez décrire une relation avec sa cardinalité, et dire pourquoi on stocke une référence plutôt qu'une copie.

### 2. Connaissances essentielles

#### Définition

- **Relation** : lien sémantique, nommé et orienté, entre deux types de ressources, et par extension entre deux ressources.
- **Référence** : valeur stockée dans une ressource qui désigne une autre ressource par son identifiant.

#### Idées fondamentales

1. **On relie, on ne copie pas.** Une information est stockée une fois ; les autres ressources y renvoient.
2. **La cardinalité précise le lien.** Un-à-un, un-à-plusieurs, plusieurs-à-plusieurs.
3. **Une relation a un nom et un sens.** « Un aéronef est basé à une base » se lit aussi, à l'envers, « une base accueille des aéronefs ».
4. **Une relation plusieurs-à-plusieurs passe par une ressource d'association.** Cette ressource peut porter ses propres propriétés (date, rôle).
5. **Une référence ne sort jamais du tenant.** Une ressource ne doit pas pointer vers une ressource d'un autre tenant.
6. **On choisit entre référence et imbrication.** Par référence, la cible est partagée ; par valeur, elle est incluse dans la ressource.

#### Vocabulaire essentiel

- **Cardinalité** (*cardinality*) : nombre de ressources possibles de chaque côté d'une relation.
- **Clé étrangère** (*foreign key*) : implémentation d'une référence dans une base relationnelle (voir [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère)).
- **Ressource d'association** (*join table*, *junction table*) : ressource qui représente un lien plusieurs-à-plusieurs.
- **Relation inverse** (*inverse relation*) : lecture de la relation dans l'autre sens.
- **Référence orpheline** (*dangling reference*) : référence qui désigne une ressource disparue.
- **Imbrication** (*embedding*) : inclusion d'une structure dans une autre ressource.

#### Relations de cause à effet

- On copie le nom du modèle d'avion dans chaque tâche. Le modèle est corrigé à un endroit, mais pas dans les copies : les données deviennent incohérentes.
- Une relation plusieurs-à-plusieurs est stockée sous forme de liste d'identifiants dans un champ. On ne peut plus y attacher d'information (rôle, date), ni garantir son intégrité.
- Une référence peut désigner une ressource d'un autre tenant. Un utilisateur peut alors lire, par rebond, des données qui ne lui appartiennent pas.

#### Idées reçues

- **« Relation et jointure, c'est la même chose. »** Non. La relation est le lien métier ; la jointure est l'opération qui l'exploite dans une requête.
- **« Dans la théorie relationnelle, une relation est un lien. »** Attention : dans la théorie relationnelle de Codd, le mot *relation* désigne la **table** elle-même. Dans ce parcours, il désigne un lien entre ressources, comme dans le modèle entité-relation.
- **« Une liste d'identifiants suffit pour représenter un lien plusieurs-à-plusieurs. »** C'est une simplification qui perd l'intégrité et la capacité de porter des attributs.

#### Principe clé

Un lien se stocke une fois, sous forme d'une référence vers un identifiant stable, avec une cardinalité explicite et un comportement défini à la suppression.

#### Si vous ne retenez que trois choses

1. Une relation relie des ressources ; une référence en est la valeur stockée (un identifiant).
2. La cardinalité (1–1, 1–N, N–N) détermine la façon de stocker le lien.
3. Une référence reste toujours à l'intérieur du tenant.

### 3. Explication technique détaillée

#### Les trois cardinalités

| Cardinalité | Exemple | Mise en œuvre |
|---|---|---|
| Un-à-un (1–1) | Aéronef et certificat de navigabilité courant | Référence avec contrainte d'unicité, d'un côté ou de l'autre |
| Un-à-plusieurs (1–N) | Une base accueille plusieurs aéronefs | Référence placée du côté « plusieurs » |
| Plusieurs-à-plusieurs (N–N) | Techniciens et tâches | Ressource d'association |

#### Mise en œuvre relationnelle

```sql
-- 1–N : chaque tâche référence un aéronef
CREATE TABLE maintenance_task (
  tenant_id   uuid NOT NULL,
  id          uuid NOT NULL,
  aircraft_id uuid NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, aircraft_id) REFERENCES aircraft (tenant_id, id)
);

-- N–N : l'affectation porte ses propres propriétés
CREATE TABLE assignment (
  tenant_id     uuid NOT NULL,
  task_id       uuid NOT NULL,
  technician_id uuid NOT NULL,
  role          text NOT NULL,
  assigned_at   timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, task_id, technician_id),
  FOREIGN KEY (tenant_id, task_id)       REFERENCES maintenance_task (tenant_id, id),
  FOREIGN KEY (tenant_id, technician_id) REFERENCES technician (tenant_id, id)
);
```

**Pourquoi le tenant figure dans la clé étrangère.** La référence est un couple `(tenant_id, id)`. La base refuse ainsi qu'une tâche d'un tenant référence un aéronef d'un autre tenant.

#### La relation comme métadonnée

```json
{
  "api_name": "tasks",
  "source_type": "aircraft",
  "target_type": "maintenance_task",
  "cardinality": "one_to_many",
  "inverse_name": "aircraft",
  "required_on_target": true,
  "on_delete": "restrict"
}
```

**Comment le lire.** Un aéronef a plusieurs tâches ; chaque tâche doit avoir un aéronef ; on refuse de supprimer un aéronef qui a encore des tâches.

#### Référence ou imbrication

| Critère | Référence | Imbrication |
|---|---|---|
| La cible est partagée | Oui | Non |
| La cible a une identité propre | Oui | Non |
| Lecture en un seul accès | Non, il faut suivre le lien | Oui |
| Mise à jour de la cible | À un seul endroit | Dans chaque ressource |
| Exemple | Technicien affecté | Adresse de livraison saisie dans la fiche |

#### Modes de défaillance

- **Référence orpheline** : la cible a été supprimée sans traiter les références.
- **Cycle** : A référence B qui référence A, ce qui complique la suppression et le chargement.
- **Chargement en cascade** : suivre les relations en profondeur produit de très nombreuses lectures (« problème N+1 »).
- **Fuite entre tenants** : référence vers une ressource d'un autre tenant.

**Limites.** Chaque relation a un coût d'écriture (vérification) et de lecture (jointure). Une plateforme générique impose souvent un plafond de profondeur et de nombre de relations suivies par requête (voir [2.15 Modèle de requête](#215-modèle-de-requête)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](#21-entité-ressource-objet-et-enregistrement) | Les relations relient des ressources identifiées |
| [2.7 Hiérarchie](#27-hiérarchie) | La hiérarchie est une relation particulière d'un type vers lui-même |
| [2.9 Composition et agrégation](#29-composition-et-agrégation) | Composition et agrégation précisent la force du lien |
| [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère) | La clé étrangère est la mise en œuvre relationnelle de la référence |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | L'intégrité référentielle garantit que les références restent valides |
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Une référence ne traverse jamais la frontière du tenant |

### 5. Application pratique

**Situation initiale.** La compagnie veut suivre quels techniciens interviennent sur quelles tâches, avec leur rôle.

**Problème.** Un technicien intervient sur plusieurs tâches, et une tâche mobilise plusieurs techniciens. Le rôle (inspecteur, mécanicien) dépend de l'intervention, pas du technicien.

**Application du concept.** L'administrateur définit une relation plusieurs-à-plusieurs *Tâche–Technicien* avec une ressource d'association *Affectation* qui porte le rôle et la date.

**Déroulé.**

1. L'administrateur crée le type *Affectation* avec deux références obligatoires et le champ `role`.
2. Le moteur applique la contrainte : aucun doublon pour le même couple tâche–technicien.
3. L'interface affiche, sur la fiche d'une tâche, la liste des techniciens et leur rôle.
4. La relation inverse permet d'afficher, sur la fiche d'un technicien, ses tâches.

**Résultat.** Les rôles sont enregistrés par intervention, et les deux sens de lecture sont disponibles.

**Limites.** Un rapport qui croise aéronefs, tâches, affectations et techniciens suppose trois jointures : il faut surveiller son coût à grand volume.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une relation et une référence ?
2. **Compréhension.** Comment représente-t-on une relation plusieurs-à-plusieurs ?
3. **Compréhension.** Pourquoi une référence ne doit-elle jamais sortir du tenant ?
4. **Pourquoi.** Pourquoi stocke-t-on une référence plutôt qu'une copie des données de la cible ?
5. **Raisonnement pratique.** Un administrateur veut enregistrer, pour chaque technicien affecté à une tâche, le nombre d'heures passées. Où placer ce champ ?

#### Réponses

1. La relation est le lien métier entre deux types ou ressources. La référence est la valeur stockée (un identifiant) qui désigne la cible.
2. Par une ressource d'association qui contient deux références, une vers chaque côté, et éventuellement ses propres propriétés.
3. Parce qu'une référence suivie permettrait de lire, par rebond, des données d'un autre tenant : c'est une fuite d'isolation.
4. Parce qu'une copie diverge dès que l'original change. Une référence garantit qu'on lit toujours la valeur à jour.
5. Dans la ressource d'association *Affectation* : les heures dépendent du couple technicien–tâche, et pas du technicien ni de la tâche seuls.

## 2.7 Hiérarchie

### 1. Comprendre simplement

Une **hiérarchie** (*hierarchy*) est une structure en arbre : chaque élément a au plus un parent, et peut avoir des enfants. Un organigramme, une arborescence de dossiers, une décomposition d'un avion en systèmes puis en composants sont des hiérarchies.

**Pourquoi cela existe.** Beaucoup de domaines se décomposent naturellement du général au particulier. Le système doit pouvoir représenter cet emboîtement, le parcourir et le manipuler.

**Problème résolu.** Représenter des structures de profondeur variable, et répondre à des questions comme « quels sont tous les éléments sous ce nœud ? » ou « quel est le chemin jusqu'à la racine ? ».

**Modèle mental.** Un arbre généalogique descendant : une personne, ses enfants, leurs enfants. Chacun a un seul parent direct dans cet arbre.

**Où l'analogie s'arrête.** Dans une généalogie réelle, chaque personne a deux parents. Une hiérarchie logicielle impose un parent unique. Quand un élément peut avoir plusieurs parents, on parle de graphe, pas d'arbre.

**Exemple.** Les emplacements de la compagnie : *Aéroport de Lyon* contient *Hangar 2*, qui contient *Baie 4*. On veut lister tous les aéronefs présents dans l'aéroport, quelle que soit la baie.

**Objectif d'apprentissage :** vous pouvez dire ce qui distingue un arbre d'un graphe, et citer deux manières de stocker une hiérarchie.

### 2. Connaissances essentielles

#### Définition

Une **hiérarchie** est une structure dans laquelle les éléments sont organisés en niveaux : chaque élément, sauf la racine, a exactement un parent, et peut en avoir plusieurs enfants.

#### Idées fondamentales

1. **Un seul parent.** C'est ce qui distingue l'arbre du graphe.
2. **Une racine, des feuilles.** Le sommet n'a pas de parent ; les extrémités n'ont pas d'enfants.
3. **La profondeur est variable.** Le modèle ne doit pas fixer le nombre de niveaux.
4. **Deux questions fréquentes.** Les ancêtres (le chemin vers la racine) et les descendants (le sous-arbre).
5. **Pas de cycle.** Un élément ne peut pas être son propre ancêtre.
6. **Plusieurs représentations existent.** Elles favorisent soit la lecture, soit les déplacements.

#### Vocabulaire essentiel

- **Nœud** (*node*) : un élément de la hiérarchie.
- **Racine** (*root*) : le nœud sans parent.
- **Feuille** (*leaf*) : un nœud sans enfant.
- **Parent, enfant, frère** (*parent*, *child*, *sibling*) : liens directs entre nœuds.
- **Ancêtre, descendant** (*ancestor*, *descendant*) : liens à n'importe quelle distance.
- **Profondeur** (*depth*) : nombre de niveaux entre un nœud et la racine.
- **Sous-arbre** (*subtree*) : un nœud et tous ses descendants.

#### Relations de cause à effet

- Déplacer un nœud change tous les chemins de ses descendants. Selon la représentation, cela coûte une ou plusieurs milliers de mises à jour.
- Autoriser un déplacement sans contrôle peut créer un cycle : le nœud devient son propre descendant.
- Les droits héritent souvent le long de la hiérarchie. Déplacer un nœud change donc aussi les droits effectifs (voir [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles)).

#### Idées reçues

- **« La profondeur est connue à l'avance. »** Non. Les structures réelles varient : un modèle à trois niveaux fixes casse dès le quatrième.
- **« Une hiérarchie est une liste avec des indentations. »** Non. C'est une structure avec des règles : un parent, pas de cycle.
- **« Toute structure d'appartenance est un arbre. »** Non. Un technicien peut appartenir à plusieurs équipes : c'est un graphe.

#### Principe clé

Une hiérarchie est un arbre : un parent unique, pas de cycle, une profondeur libre. Le choix de sa représentation dépend des questions que l'on pose le plus souvent.

#### Si vous ne retenez que trois choses

1. Dans une hiérarchie, chaque élément a un seul parent, et il n'y a pas de cycle.
2. Les deux questions classiques sont : « quels sont les ancêtres ? » et « quels sont les descendants ? ».
3. Plusieurs représentations existent ; chacune favorise des opérations différentes.

### 3. Explication technique détaillée

#### Les représentations d'un arbre en base relationnelle

| Représentation | Principe | Forces | Faiblesses |
|---|---|---|---|
| Liste d'adjacence (*adjacency list*) | Chaque nœud stocke l'identifiant de son parent | Simple, déplacement facile | Descendants demandent une requête récursive |
| Chemin matérialisé (*materialized path*) | Chaque nœud stocke son chemin (`/1/4/9/`) | Sous-arbre par préfixe, lecture rapide | Déplacer un nœud réécrit les chemins de son sous-arbre |
| Ensembles imbriqués (*nested sets*) | Chaque nœud stocke deux bornes numériques | Sous-arbre très rapide à lire | Insertion et déplacement coûteux |
| Table de fermeture (*closure table*) | Une table stocke toutes les paires ancêtre–descendant | Requêtes rapides dans les deux sens | Plus d'espace, maintenance à l'écriture |

#### Liste d'adjacence et requête récursive

```sql
CREATE TABLE location (
  tenant_id uuid NOT NULL,
  id        uuid NOT NULL,
  parent_id uuid,
  name      text NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

-- Tous les descendants d'un nœud
WITH RECURSIVE sous_arbre AS (
  SELECT id, parent_id, name FROM location
  WHERE tenant_id = :tenant AND id = :racine
  UNION ALL
  SELECT l.id, l.parent_id, l.name
  FROM location l
  JOIN sous_arbre s ON l.parent_id = s.id
  WHERE l.tenant_id = :tenant
)
SELECT * FROM sous_arbre;
```

**Comment cela fonctionne.** La requête part de la racine demandée, puis ajoute à chaque tour les enfants des nœuds déjà trouvés, jusqu'à épuisement.

**Pourquoi c'est important.** Cette forme `WITH RECURSIVE` est prévue par le standard SQL et permet de parcourir une hiérarchie de profondeur quelconque.

#### Éviter les cycles

Avant de déplacer un nœud `X` sous un parent `P`, on vérifie que `P` n'est pas un descendant de `X`. Sans cette vérification, la hiérarchie devient circulaire et les requêtes récursives ne terminent plus.

**Contre-exemple.** Si l'on déplace *Hangar 2* sous *Baie 4*, qui est déjà dans *Hangar 2*, chacun devient l'ancêtre de l'autre.

#### Choisir une représentation

- Les déplacements sont fréquents et les lectures de sous-arbre rares : liste d'adjacence.
- Les lectures de sous-arbre sont très fréquentes et les déplacements rares : chemin matérialisé ou table de fermeture.
- Les structures sont presque figées et très lues : ensembles imbriqués.

**Limites.** Aucune représentation n'est la meilleure partout. Pour une plateforme générique, on fixe souvent une profondeur maximale raisonnable et on teste les cas extrêmes (arbres très larges ou très profonds).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.6 Relation et référence](#26-relation-et-référence) | Une hiérarchie est une relation d'un type vers lui-même, avec un parent unique |
| [2.9 Composition et agrégation](#29-composition-et-agrégation) | Composition et agrégation sont des cas de hiérarchie « tout et parties » |
| [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles) | Les permissions peuvent hériter le long de la hiérarchie |
| [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise) | La hiérarchie d'entreprise (tenant, organisation, unité, équipe) en est un cas |
| [2.14 Index](#214-index) | Les requêtes de sous-arbre bénéficient d'index adaptés |

### 5. Application pratique

**Situation initiale.** La compagnie veut lister tous les aéronefs présents dans un aéroport, quelle que soit la baie.

**Problème.** Le modèle des emplacements est un arbre de profondeur variable : aéroport, hangar, baie, parfois sous-baie.

**Application du concept.** On stocke la hiérarchie en liste d'adjacence, et on exécute une requête récursive pour obtenir tous les emplacements sous l'aéroport.

**Déroulé.**

1. L'utilisateur choisit « Aéroport de Lyon ».
2. Le moteur calcule l'ensemble des emplacements descendants.
3. Il sélectionne les aéronefs dont l'emplacement appartient à cet ensemble.
4. Le résultat est affiché, avec le chemin complet de chaque aéronef.

**Résultat.** La requête fonctionne quelle que soit la profondeur de l'arbre.

**Limites.** Si l'arbre compte des centaines de milliers de nœuds et que ce calcul est fréquent, on passe à un chemin matérialisé ou à une table de fermeture.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui distingue une hiérarchie d'un graphe ?
2. **Compréhension.** Que sont les ancêtres et les descendants d'un nœud ?
3. **Compréhension.** Quel est l'avantage d'un chemin matérialisé pour lire un sous-arbre ?
4. **Pourquoi.** Pourquoi faut-il vérifier l'absence de cycle avant un déplacement ?
5. **Raisonnement pratique.** Un client veut qu'un technicien appartienne à deux équipes. Une hiérarchie suffit-elle ?

#### Réponses

1. Dans une hiérarchie (un arbre), chaque nœud a un seul parent et il n'y a pas de cycle. Un graphe autorise plusieurs parents et des cycles.
2. Les ancêtres sont les nœuds sur le chemin du nœud à la racine. Les descendants sont tous les nœuds situés sous lui.
3. Tous les descendants partagent le préfixe de chemin de leur ancêtre : on les retrouve par une simple recherche de préfixe.
4. Sans cette vérification, un nœud peut devenir son propre ancêtre, et les parcours récursifs ne terminent plus.
5. Non. Appartenir à deux équipes est une relation plusieurs-à-plusieurs, donc un graphe. Il faut une relation d'appartenance distincte de la hiérarchie des équipes.

## 2.8 Polymorphisme

### 1. Comprendre simplement

Le **polymorphisme** (*polymorphism*) est la capacité d'un élément à prendre plusieurs formes tout en étant traité de manière uniforme. En modélisation de données, il apparaît sous trois aspects : des **types qui partagent une base commune** (héritage), une **relation qui peut viser plusieurs types** (association polymorphe), et un **même comportement qui s'adapte au type** de la ressource.

**Pourquoi cela existe.** Beaucoup de domaines contiennent des familles : un *aéronef*, un *véhicule au sol* et un *équipement d'atelier* sont tous des « actifs ». Les traiter ensemble (les lister, les affecter) évite de dupliquer le même code et le même modèle.

**Problème résolu.** Exprimer ce que des types ont en commun, tout en conservant leurs différences.

**Modèle mental.** Une prise électrique universelle. Elle accepte des fiches différentes, car elles partagent une interface commune.

**Où l'analogie s'arrête.** Une prise ne se préoccupe pas de ce que l'appareil fait. En modélisation, chaque forme garde ses propriétés propres, qu'il faut stocker et valider.

**Exemple.** Le type *Actif* définit `nom` et `emplacement`. Le type *Aéronef* ajoute `immatriculation`. Le type *Véhicule au sol* ajoute `plaque`. Une tâche de maintenance peut viser n'importe quel actif.

**Objectif d'apprentissage :** vous pouvez distinguer l'héritage de type et l'association polymorphe, et citer une limite de chacun.

### 2. Connaissances essentielles

#### Définition

Le **polymorphisme** est la propriété selon laquelle des éléments de types différents peuvent être utilisés à travers une interface commune. En modélisation, il désigne :

- l'**héritage de type** : un type spécialisé reprend les propriétés d'un type de base ;
- l'**association polymorphe** : une relation dont la cible peut être de plusieurs types.

#### Idées fondamentales

1. **Un socle commun, des extensions propres.** Le type de base porte ce qui est commun ; chaque sous-type ajoute ses propriétés.
2. **On traite en commun ce qui est commun.** Lister, affecter ou tracer des actifs sans connaître leur type exact.
3. **L'association polymorphe est un couple.** Elle stocke le type de la cible et son identifiant.
4. **La base de données ne vérifie pas seule une association polymorphe.** Le moteur doit assurer l'intégrité.
5. **L'héritage s'emploie quand la relation « est un » est vraie.** Sinon, on préfère la composition.

#### Vocabulaire essentiel

- **Type de base** (*base type*, *supertype*) : type dont d'autres héritent.
- **Sous-type** (*subtype*) : type spécialisé.
- **Héritage** (*inheritance*) : réutilisation des propriétés du type de base.
- **Association polymorphe** (*polymorphic association*) : relation vers plusieurs types possibles.
- **Trait** ou **interface** : capacité partagée, que plusieurs types déclarent (par exemple « affectable »).
- **Discriminant** : valeur qui indique le sous-type d'un enregistrement.

#### Relations de cause à effet

- On factorise ce qui est commun dans un type de base. Une évolution de ce socle profite à tous les sous-types, mais peut aussi les casser tous.
- Une association polymorphe est stockée comme un couple (type, identifiant). La base ne peut pas la contrôler : une référence invalide peut subsister.
- Une hiérarchie d'héritage trop profonde est difficile à comprendre : les propriétés viennent de plusieurs niveaux.

#### Idées reçues

- **« L'héritage est la meilleure façon de réutiliser. »** Non. Beaucoup d'équipes préfèrent la composition : des capacités (traits) que l'on ajoute à un type.
- **« Le polymorphisme est un concept réservé à la programmation objet. »** Non. Il s'exprime aussi en base de données et dans les modèles de ressources.
- **« Un sous-type est une table séparée. »** Pas nécessairement. Il existe plusieurs stratégies de stockage.

#### Principe clé

Utilisez le polymorphisme pour traiter en commun ce qui est vraiment commun, et gardez chaque forme responsable de ses propres différences.

#### Si vous ne retenez que trois choses

1. Le polymorphisme permet de traiter des types différents à travers une base commune.
2. Une association polymorphe désigne une cible de type variable par un couple (type, identifiant).
3. Préférez des capacités composables à un héritage profond.

### 3. Explication technique détaillée

#### Les stratégies de stockage de l'héritage

| Stratégie | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Table unique | Une table pour toute la famille, avec un discriminant | Simple, requêtes rapides sur la famille | Beaucoup de colonnes vides, contraintes affaiblies |
| Une table par type, liée à la base | Table de base commune, tables d'extension jointes | Modèle propre, contraintes fortes | Jointures nécessaires |
| Une table par type concret | Chaque type a toutes ses colonnes | Lecture directe d'un type | Requêtes sur la famille difficiles, duplication |

**Exemple de table unique.**

```sql
CREATE TABLE asset (
  tenant_id    uuid NOT NULL,
  id           uuid NOT NULL,
  kind         text NOT NULL,        -- discriminant : 'aircraft' ou 'ground_vehicle'
  name         text NOT NULL,
  registration text,                 -- propre à aircraft
  plate        text,                 -- propre à ground_vehicle
  PRIMARY KEY (tenant_id, id),
  CHECK (kind <> 'aircraft' OR registration IS NOT NULL)
);
```

**Comment cela fonctionne.** La colonne `kind` indique le sous-type. Une contrainte `CHECK` impose les colonnes obligatoires du sous-type.

#### L'association polymorphe

```text
maintenance_task(target_type, target_id)
  ('aircraft',       'ac_8f3a')
  ('ground_vehicle', 'gv_2210')
```

**Pourquoi c'est délicat.** Une clé étrangère SQL désigne une seule table. Ici, la cible dépend de la valeur de `target_type`. La vérification de l'existence doit donc être faite par le moteur.

**Alternative.** Définir un type de base commun (*Actif*) et référencer ce type : la cible est alors unique, et l'intégrité redevient contrôlable.

#### Les capacités composables

Au lieu d'une hiérarchie profonde, on déclare des **traits** que les types peuvent adopter : « affectable », « traçable », « géolocalisable ». Une tâche peut viser tout type qui déclare le trait « affectable ».

**Contre-exemple.** Faire hériter *Technicien* de *Actif* parce que les deux peuvent être « affectés » est une erreur : un technicien n'est pas un actif. Un trait « affectable » exprime la capacité sans fausser la relation « est un ».

**Limites.** Dans une plateforme où les types sont définis par des administrateurs, l'héritage et les traits doivent être gérés dans les métadonnées. Une modification d'un type de base se propage à tous ses sous-types, avec un impact à évaluer (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.2 Type et schéma](#22-type-et-schéma) | L'héritage organise les types et leurs schémas |
| [2.6 Relation et référence](#26-relation-et-référence) | L'association polymorphe est une relation à cible variable |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | L'intégrité d'une association polymorphe doit être assurée par le moteur |
| [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) | En DDD, on préfère souvent la composition à l'héritage pour réutiliser |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | Un moteur piloté par les métadonnées gère types de base et traits comme des données |

### 5. Application pratique

**Situation initiale.** Les tâches de maintenance visent aujourd'hui uniquement des aéronefs. La compagnie veut aussi planifier des tâches sur des véhicules au sol.

**Problème.** Dupliquer le type *Tâche* par catégorie d'actif multiplierait les écrans et les règles.

**Application du concept.** On introduit un type de base *Actif*, dont héritent *Aéronef* et *Véhicule au sol*. La tâche référence un *Actif*.

**Déroulé.**

1. L'administrateur crée le type *Actif* avec `nom` et `emplacement`.
2. Il déclare *Aéronef* et *Véhicule au sol* comme sous-types, avec leurs propres champs.
3. Il remplace la référence de la tâche vers *Aéronef* par une référence vers *Actif*.
4. Le moteur migre les références existantes.

**Résultat.** Une seule définition de tâche sert tous les actifs, et un nouveau sous-type s'ajoute sans modifier les tâches.

**Limites.** Les règles propres à un sous-type (par exemple une inspection réglementaire des seuls aéronefs) doivent être portées par le sous-type, pas par le type de base.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que l'héritage de type ?
2. **Compréhension.** Qu'est-ce qu'une association polymorphe ?
3. **Compréhension.** Citez deux stratégies de stockage de l'héritage en base relationnelle.
4. **Pourquoi.** Pourquoi une association polymorphe est-elle difficile à contrôler par la base de données ?
5. **Raisonnement pratique.** Peut-on faire hériter *Technicien* d'un type de base *Actif* parce que les deux sont affectables à des tâches ?

#### Réponses

1. Un type spécialisé reprend les propriétés d'un type de base et en ajoute d'autres.
2. Une relation dont la cible peut être de plusieurs types ; elle stocke le type de la cible et son identifiant.
3. Par exemple une table unique avec discriminant, ou une table de base commune avec des tables d'extension par type.
4. Parce qu'une clé étrangère désigne une seule table. Ici, la cible dépend d'une valeur de colonne, et la base ne peut pas vérifier son existence seule.
5. Non, car un technicien n'est pas un actif. On exprime la capacité commune par un trait « affectable » que les deux types déclarent.

## 2.9 Composition et agrégation

### 1. Comprendre simplement

La **composition** (*composition*) et l'**agrégation** (*aggregation*) décrivent deux façons pour un **tout** d'être constitué de **parties**. Dans la composition, les parties n'existent que pour le tout : elles disparaissent avec lui. Dans l'agrégation, les parties ont une existence indépendante : elles peuvent exister sans le tout, ou passer d'un tout à un autre.

**Pourquoi cela existe.** Quand un tout est supprimé, il faut savoir ce qui arrive à ses parties. La réponse décide du comportement de la suppression, des droits et des transactions.

**Problème résolu.** Exprimer le sens de l'appartenance : la partie vit-elle avec le tout, ou séparément ?

**Modèle mental.**

- *Composition* : un rapport d'inspection et ses lignes. Si on supprime le rapport, ses lignes n'ont plus de sens.
- *Agrégation* : un aéronef et ses moteurs. Un moteur peut être déposé et monté sur un autre aéronef.

**Où l'analogie s'arrête.** La frontière dépend du métier. Dans une autre compagnie, un équipement monté peut être considéré comme inséparable de son avion : la modélisation suit la réalité de l'organisation.

**Exemple.** *Rapport d'inspection* compose ses *Lignes de constat*. *Aéronef* agrège des *Moteurs*, dont le cycle de vie est indépendant.

**Attention au mot « agrégation ».** Il a trois sens : le lien « tout et parties » décrit ici, les fonctions d'agrégation de SQL (`COUNT`, `SUM`), et l'agrégat du DDD (voir [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat)). Ce parcours précise toujours le sens retenu.

**Objectif d'apprentissage :** vous pouvez expliquer la différence entre composition et agrégation par ce qui arrive aux parties à la suppression du tout.

### 2. Connaissances essentielles

#### Définition

- **Composition** : relation tout–parties où le cycle de vie des parties est lié à celui du tout. Une partie appartient à un seul tout et disparaît avec lui.
- **Agrégation** : relation tout–parties où les parties ont un cycle de vie indépendant et peuvent être partagées ou déplacées.

#### Idées fondamentales

1. **La différence porte sur le cycle de vie.** Qui supprime quoi, et quand.
2. **Une partie composée a un seul propriétaire.** Elle n'est pas partagée.
3. **Une partie agrégée peut changer de tout.** Le moteur doit permettre de la détacher et de la rattacher.
4. **La composition fixe souvent une frontière transactionnelle.** Le tout et ses parties sont modifiés ensemble.
5. **Le choix dépend du métier, pas de la technique.** Le même objet physique peut être modélisé différemment selon l'organisation.

#### Vocabulaire essentiel

- **Tout** (*whole*) : l'élément qui possède ou regroupe.
- **Partie** (*part*) : l'élément contenu.
- **Cycle de vie** (*lifecycle*) : succession des états d'un élément de sa création à sa suppression.
- **Suppression en cascade** (*cascade delete*) : suppression automatique des parties avec le tout.
- **Propriétaire** (*owner*) : le tout responsable de la partie.
- **Fonction d'agrégation** (*aggregate function*) : calcul sur un ensemble (somme, moyenne, comptage). Sens distinct.

#### Relations de cause à effet

- Composition choisie. À la suppression du tout, les parties sont supprimées avec lui. Le moteur doit le faire de façon atomique.
- Agrégation choisie. À la suppression du tout, les parties restent. Elles deviennent « non rattachées » et doivent pouvoir être réaffectées.
- Confusion entre les deux. Une suppression efface par erreur des parties qui vivaient indépendamment, ou laisse des parties orphelines qui n'ont plus de sens.

#### Idées reçues

- **« Composition et agrégation, c'est la même chose avec un nom différent. »** Non. Elles diffèrent par le sort des parties à la suppression.
- **« Une partie composée n'a pas d'identifiant. »** Pas nécessairement. Elle peut avoir son identifiant, mais n'existe pas sans son tout.
- **« Agrégation signifie somme ou moyenne. »** C'est un autre sens du mot, propre aux requêtes.

#### Principe clé

Demandez-vous : si le tout disparaît, la partie a-t-elle encore un sens ? Si non, c'est une composition ; si oui, c'est une agrégation.

#### Si vous ne retenez que trois choses

1. Composition : la partie vit et meurt avec le tout. Agrégation : la partie vit indépendamment.
2. Le choix détermine le comportement de la suppression et des droits.
3. Le mot « agrégation » a plusieurs sens : précisez toujours lequel vous employez.

### 3. Explication technique détaillée

#### Comparaison

| Critère | Composition | Agrégation |
|---|---|---|
| Existence de la partie sans le tout | Non | Oui |
| Nombre de touts par partie | Un seul | Un ou plusieurs, ou aucun |
| À la suppression du tout | Les parties sont supprimées | Les parties subsistent |
| Notation UML | Losange plein | Losange vide |
| Exemple | Rapport et ses lignes | Aéronef et ses moteurs |
| Mise en œuvre usuelle | Suppression en cascade | Référence facultative |

#### Mise en œuvre de la composition

```sql
CREATE TABLE inspection_line (
  tenant_id   uuid NOT NULL,
  report_id   uuid NOT NULL,
  line_no     integer NOT NULL,
  finding     text NOT NULL,
  PRIMARY KEY (tenant_id, report_id, line_no),
  FOREIGN KEY (tenant_id, report_id)
    REFERENCES inspection_report (tenant_id, id)
    ON DELETE CASCADE
);
```

**Comment cela fonctionne.** La clé primaire contient la référence au rapport : une ligne ne peut pas exister sans lui. `ON DELETE CASCADE` supprime les lignes avec le rapport.

#### Mise en œuvre de l'agrégation

```sql
CREATE TABLE engine (
  tenant_id   uuid NOT NULL,
  id          uuid NOT NULL,
  serial_no   text NOT NULL,
  aircraft_id uuid,            -- facultatif : un moteur peut être déposé
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, aircraft_id)
    REFERENCES aircraft (tenant_id, id)
    ON DELETE SET NULL
);
```

**Comment cela fonctionne.** La référence est facultative. À la suppression de l'aéronef, le moteur subsiste avec une référence vide.

#### Conséquences sur le moteur

| Aspect | Composition | Agrégation |
|---|---|---|
| Création | Souvent avec le tout, dans la même opération | Indépendante |
| Droits | Héritent du tout | Propres à la partie |
| Transaction | Un seul bloc atomique | Opérations séparées possibles |
| Audit | Journal rattaché au tout | Journal propre |

**Limites.** La composition crée de gros ensembles à manipuler d'un seul bloc. Un rapport de plusieurs milliers de lignes peut ralentir chaque modification si le tout est toujours chargé ou verrouillé en entier.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.6 Relation et référence](#26-relation-et-référence) | Composition et agrégation sont des relations qui précisent le cycle de vie |
| [2.7 Hiérarchie](#27-hiérarchie) | La hiérarchie en est la structure arborescente |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | Les actions à la suppression (cascade, mise à nul) en sont la traduction |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | L'archivage et la suppression doivent respecter le sens du lien |
| [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat) | L'agrégat du DDD reprend l'idée de frontière de cohérence autour d'un tout |

### 5. Application pratique

**Situation initiale.** Un rapport d'inspection comporte de 20 à 200 lignes de constat. La compagnie veut pouvoir supprimer un rapport saisi par erreur.

**Problème.** Si les lignes subsistent après la suppression, la base contient des lignes orphelines qui polluent les rapports.

**Application du concept.** *Rapport d'inspection* compose ses *Lignes*. La suppression du rapport supprime ses lignes dans la même transaction.

**Déroulé.**

1. L'utilisateur supprime le rapport R-77.
2. Le moteur démarre une transaction.
3. Il supprime les lignes liées, puis le rapport.
4. Il valide la transaction.

**Résultat.** Aucune ligne orpheline ne subsiste.

**Limites.** Si la suppression est irréversible, une erreur humaine est définitive. On préfère souvent archiver le rapport entier plutôt que de le supprimer (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre composition et agrégation ?
2. **Compréhension.** Donnez un exemple de chaque dans le domaine aéronautique.
3. **Compréhension.** Quels sont les trois sens du mot « agrégation » rencontrés dans ce parcours ?
4. **Pourquoi.** Pourquoi le choix entre composition et agrégation influence-t-il la suppression ?
5. **Raisonnement pratique.** Un moteur est déposé d'un aéronef pour révision. Quel modèle de lien permet de le conserver et pourquoi ?

#### Réponses

1. En composition, les parties disparaissent avec le tout. En agrégation, elles subsistent et peuvent changer de tout.
2. Composition : un rapport d'inspection et ses lignes de constat. Agrégation : un aéronef et ses moteurs.
3. Le lien tout–parties, les fonctions d'agrégation de SQL (somme, comptage) et l'agrégat du DDD.
4. Parce que la composition entraîne la suppression des parties avec le tout, alors que l'agrégation les laisse en place, parfois avec une référence vide.
5. Une agrégation avec référence facultative : le moteur existe indépendamment, et sa référence à l'aéronef peut être vidée puis rattachée à un autre.

## 2.10 Modélisation relationnelle et diagramme entité-relation

### 1. Comprendre simplement

La **modélisation relationnelle** (*relational modeling*) consiste à représenter les données sous forme de **tables** reliées entre elles. Le **diagramme entité-relation** (*Entity-Relationship Diagram*, **ERD**) est le dessin qui permet de préparer ce modèle : il montre les entités, leurs attributs et les relations qui les relient.

**Pourquoi cela existe.** Avant de créer des tables, il faut se mettre d'accord, avec les experts du métier, sur ce que l'on stocke et sur les liens entre les éléments. Le diagramme sert de langage commun entre le métier et la technique.

**Problème résolu.** Transformer un besoin exprimé en mots en une structure de données précise, vérifiable avant d'écrire du code.

**Modèle mental.** Un plan d'architecte avant de construire. On ne pose pas les murs avant d'avoir dessiné les pièces et les portes.

**Où l'analogie s'arrête.** Un plan de maison est rarement modifié une fois la maison construite. Un modèle de données évolue pendant toute la vie du produit. Dans une plateforme générique, ce plan est lui-même stocké comme donnée et modifié par les administrateurs.

**Exemple.**

```text
┌──────────┐ 1      N ┌──────────┐ 1      N ┌──────────────────┐
│ LOCATION ├──────────┤ AIRCRAFT ├──────────┤ MAINTENANCE_TASK │
└──────────┘          └──────────┘          └────────┬─────────┘
                                                     │ N
                                               ┌─────┴──────┐
                                               │ ASSIGNMENT │
                                               └─────┬──────┘
                                                     │ N
                                              ┌──────┴─────┐
                                              │ TECHNICIAN │
                                              └────────────┘
```

**Objectif d'apprentissage :** vous pouvez lire un diagramme entité-relation simple et le traduire en tables, clés et relations.

### 2. Connaissances essentielles

#### Définition

- **Modèle relationnel** : modèle de données, proposé par Edgar F. Codd en 1970, où les données sont organisées en relations (tables) composées de lignes (n-uplets) et de colonnes (attributs), manipulées par des opérations ensemblistes.
- **Diagramme entité-relation** : représentation graphique, introduite par Peter Chen en 1976, des entités, de leurs attributs et de leurs relations.

#### Idées fondamentales

1. **Une table décrit un ensemble de choses de même nature.** Chaque ligne en est un exemplaire.
2. **Un attribut est une colonne.** Il porte un type et des contraintes.
3. **Les liens passent par des clés.** On relie les tables par des identifiants, pas par la position.
4. **Le diagramme précède les tables.** Il se discute avec le métier.
5. **La traduction suit des règles.** Entité vers table, attribut vers colonne, relation 1–N vers clé étrangère, relation N–N vers table d'association.

#### Vocabulaire essentiel

- **Table** (*table*) : ensemble de lignes de même structure.
- **Ligne** ou **n-uplet** (*row*, *tuple*) : un exemplaire.
- **Colonne** ou **attribut** (*column*, *attribute*) : une caractéristique.
- **Entité** (*entity*) : chose du domaine représentée par une table.
- **Relation** (*relationship*) : lien entre entités dans le diagramme.
- **Cardinalité** (*cardinality*) : nombre minimal et maximal d'éléments de chaque côté.
- **Modèle conceptuel, logique, physique** : trois niveaux, du plus métier au plus technique.

#### Relations de cause à effet

- Le diagramme est discuté avec le métier avant la création des tables. Les erreurs de compréhension apparaissent tôt, quand elles coûtent peu.
- Une cardinalité mal comprise (1–N pris pour 1–1) produit un modèle qui interdit des cas réels.
- Le modèle physique est dessiné sans le modèle conceptuel. Les noms techniques et les choix de stockage masquent le sens métier.

#### Idées reçues

- **« Un ERD est un schéma de base de données. »** Pas exactement. Un ERD conceptuel décrit le métier. Le schéma physique en est une traduction, avec des choix techniques.
- **« Le modèle relationnel suffit pour tout. »** Non. Certains besoins (graphes très profonds, documents imbriqués, séries temporelles) sont mieux servis par d'autres modèles ou par des usages mixtes.
- **« Un modèle bien dessiné n'évolue plus. »** Non. Les besoins changent, et le modèle avec eux.

#### Principe clé

On dessine le sens avant de dessiner le stockage : le diagramme entité-relation est un langage commun, et les tables en sont la traduction.

#### Si vous ne retenez que trois choses

1. Le modèle relationnel organise les données en tables reliées par des clés.
2. Un ERD dit quelles entités existent et comment elles se relient, avant de créer les tables.
3. Les règles de traduction entre ERD et tables sont mécaniques : entité, attribut, relation.

### 3. Explication technique détaillée

#### Les trois niveaux de modélisation

| Niveau | Question | Contenu | Interlocuteur |
|---|---|---|---|
| Conceptuel | Quelles sont les choses du métier ? | Entités, relations, cardinalités | Experts métier |
| Logique | Comment les représenter en tables ? | Tables, colonnes, clés | Concepteurs |
| Physique | Comment les stocker efficacement ? | Types, index, partitionnement | Administrateurs de base |

#### Du diagramme aux tables

| Élément du diagramme | Traduction relationnelle |
|---|---|
| Entité | Une table |
| Attribut | Une colonne |
| Identifiant | Une clé primaire |
| Relation 1–N | Une clé étrangère du côté « N » |
| Relation N–N | Une table d'association avec deux clés étrangères |
| Relation 1–1 | Une clé étrangère avec contrainte d'unicité |

**Exemple de traduction.** La relation « un aéronef est basé dans un emplacement » (1–N) devient la colonne `base_id` de la table `aircraft`, avec une clé étrangère vers `location` (voir [2.6 Relation et référence](#26-relation-et-référence)).

#### La démarche en cinq étapes

1. **Identifier les entités** à partir du vocabulaire du métier.
2. **Lister leurs attributs**, et choisir un identifiant.
3. **Relier les entités**, avec la cardinalité de chaque côté.
4. **Vérifier avec le métier** à l'aide d'exemples concrets.
5. **Traduire en tables**, puis normaliser (voir [2.13 Normalisation](#213-normalisation)).

#### Le lien avec une plateforme générique

Une plateforme ne peut pas dessiner un diagramme par client. Elle fait donc de l'ERD une **donnée** : les entités deviennent des *types de ressources*, les attributs des *définitions de champs*, les relations des *définitions de relations*. Le diagramme que dessinait un concepteur est désormais saisi par l'administrateur dans une interface, et enregistré comme métadonnée (voir [2.4 Métadonnées](#24-métadonnées)).

**Contre-exemple.** Une plateforme qui exige qu'un développeur crée une table à chaque nouveau type n'est pas générique : elle déplace le travail de modélisation vers le fournisseur.

**Limites.** Le modèle relationnel suppose une structure connue et stable pour chaque table. Les besoins de souplesse extrême ont mené à des variantes (colonnes JSON, EAV), vues en [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés) et [2.17 Schéma dynamique](#217-schéma-dynamique).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](#21-entité-ressource-objet-et-enregistrement) | Les entités du diagramme deviennent des types de ressources |
| [2.6 Relation et référence](#26-relation-et-référence) | Les relations du diagramme sont des relations entre ressources |
| [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère) | Les clés relient les tables |
| [2.13 Normalisation](#213-normalisation) | La normalisation affine le modèle logique obtenu |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'architecture pilotée par les métadonnées stocke le diagramme comme donnée |

### 5. Application pratique

**Situation initiale.** La compagnie décrit son besoin : « Chaque aéronef est basé quelque part. Chaque aéronef a des tâches de maintenance, réalisées par des techniciens. »

**Problème.** Le besoin est exprimé en phrases. Il faut en tirer un modèle de données non ambigu.

**Application du concept.** On extrait les noms (entités) et les verbes (relations), puis on pose les cardinalités avec le métier.

**Déroulé.**

1. Entités repérées : Emplacement, Aéronef, Tâche, Technicien.
2. Relations : Aéronef–Emplacement (N–1), Tâche–Aéronef (N–1), Tâche–Technicien (N–N).
3. Question au métier : « Une tâche peut-elle concerner plusieurs aéronefs ? » Réponse : non.
4. Traduction : quatre tables et une table d'association *Affectation*.

**Résultat.** Un modèle validé par le métier, traduit en tables sans ambiguïté.

**Limites.** Si, plus tard, une tâche peut viser plusieurs aéronefs, la relation Tâche–Aéronef devient N–N : le modèle et les données existantes doivent migrer (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un diagramme entité-relation, et à quoi sert-il ?
2. **Compréhension.** Comment traduit-on une relation plusieurs-à-plusieurs en tables ?
3. **Compréhension.** Quels sont les trois niveaux de modélisation ?
4. **Pourquoi.** Pourquoi valide-t-on le diagramme avec le métier avant de créer les tables ?
5. **Raisonnement pratique.** Que devient le diagramme entité-relation dans une plateforme où les administrateurs définissent eux-mêmes les types ?

#### Réponses

1. C'est un dessin des entités, de leurs attributs et de leurs relations. Il sert de langage commun entre le métier et la technique avant de créer les tables.
2. Par une table d'association qui contient une clé étrangère vers chaque côté, éventuellement avec ses propres colonnes.
3. Conceptuel (le sens métier), logique (les tables et les clés), physique (les types, les index et le stockage).
4. Parce que les erreurs de compréhension coûtent peu à corriger sur un dessin, et beaucoup une fois les données et le code en place.
5. Il devient une donnée : types de ressources, définitions de champs et de relations, saisies par l'administrateur et stockées comme métadonnées.

## 2.11 Clé primaire et clé étrangère

### 1. Comprendre simplement

Une **clé primaire** (*primary key*) est la colonne, ou le groupe de colonnes, dont la valeur identifie de façon unique chaque ligne d'une table. Une **clé étrangère** (*foreign key*) est une colonne qui contient la clé primaire d'une ligne d'une autre table, et qui matérialise le lien entre les deux.

**Pourquoi cela existe.** Pour relier des données sans les copier, il faut pouvoir désigner une ligne sans ambiguïté. Le nom ou la description ne suffisent pas : ils changent et peuvent se répéter.

**Problème résolu.** Identifier une ligne de façon stable, et exprimer les liens entre lignes de façon vérifiable par la base.

**Modèle mental.** Le numéro de dossier d'un patient dans un hôpital est la clé primaire du dossier. Une ordonnance qui indique « dossier 4521 » contient une clé étrangère.

**Où l'analogie s'arrête.** Sur papier, rien n'empêche d'écrire un numéro de dossier qui n'existe pas. Dans une base, la clé étrangère est vérifiée : on ne peut pas référencer une ligne inexistante.

**Exemple.** La table `aircraft` a pour clé primaire `(tenant_id, id)`. La table `maintenance_task` contient une clé étrangère `(tenant_id, aircraft_id)` qui référence cette clé.

**Les composants.**

1. une **clé primaire** par table, unique et jamais vide ;
2. des **clés étrangères** qui y renvoient ;
3. des **actions référentielles** qui disent quoi faire à la suppression de la ligne référencée.

**Objectif d'apprentissage :** vous pouvez dire ce qui fait une bonne clé primaire, et expliquer pourquoi l'immatriculation d'un aéronef n'en est pas une.

### 2. Connaissances essentielles

#### Définition

- **Clé primaire** : colonne(s) dont les valeurs sont uniques et non nulles dans la table, et qui identifient chaque ligne.
- **Clé étrangère** : colonne(s) d'une table dont les valeurs doivent correspondre à une clé primaire (ou à une clé unique) d'une autre table, ou être nulles.

#### Idées fondamentales

1. **Unique et non nulle.** Une clé primaire désigne une seule ligne, toujours.
2. **Stable.** Sa valeur ne doit pas changer pendant la vie de la ligne, car d'autres y renvoient.
3. **Sans signification métier, de préférence.** Une clé artificielle (*surrogate key*) évite que les changements du métier cassent les liens.
4. **La clé étrangère est vérifiée.** La base refuse une valeur qui ne correspond à aucune ligne.
5. **Dans une plateforme multi-tenant, le tenant fait partie de la clé.** Cela empêche un lien de traverser les tenants.
6. **La suppression de la cible demande une règle.** Refuser, supprimer en cascade ou vider la référence.

#### Vocabulaire essentiel

- **Clé naturelle** (*natural key*) : identifiant tiré du métier (immatriculation, numéro de série).
- **Clé artificielle** (*surrogate key*) : identifiant sans signification, généré par le système.
- **Clé composite** (*composite key*) : clé formée de plusieurs colonnes.
- **UUID** : identifiant de 128 bits, généré sans coordination centrale.
- **Séquence** (*sequence*) : générateur de nombres croissants fourni par la base.
- **Action référentielle** : comportement déclaré à la suppression ou à la modification de la cible (`RESTRICT`, `CASCADE`, `SET NULL`).

#### Relations de cause à effet

- La clé primaire est une donnée métier qui change (immatriculation modifiée). Toutes les références doivent être mises à jour, ou se brisent.
- Les identifiants sont des entiers séquentiels exposés dans les adresses. Un tiers peut les deviner et tenter d'énumérer les ressources.
- La clé étrangère ne référence pas aussi le tenant. Une ligne peut pointer vers la ressource d'un autre tenant sans que la base s'y oppose.

#### Idées reçues

- **« Une clé naturelle est plus parlante, donc meilleure. »** Pas nécessairement. Une immatriculation d'aéronef peut changer, par exemple lors d'un changement d'État d'immatriculation. Une clé artificielle, avec une contrainte d'unicité sur l'immatriculation, est plus robuste.
- **« Un UUID est toujours plus lent qu'un entier. »** Pas toujours. Les UUID aléatoires dispersent les écritures dans l'index ; les UUID ordonnés dans le temps réduisent ce défaut.
- **« La clé étrangère sert seulement à la documentation. »** Non. Elle est appliquée par la base de données.

#### Principe clé

Identifiez chaque ligne par une valeur stable qui n'a aucune autre raison de changer, et faites vérifier chaque lien par la base.

#### Si vous ne retenez que trois choses

1. La clé primaire identifie de façon unique et stable ; la clé étrangère y renvoie et est vérifiée.
2. Préférez une clé artificielle ; exprimez l'unicité métier par une contrainte distincte.
3. Dans une plateforme multi-tenant, incluez le tenant dans les clés.

### 3. Explication technique détaillée

#### Clé naturelle ou clé artificielle

| Critère | Clé naturelle | Clé artificielle |
|---|---|---|
| Lisibilité | Élevée | Faible |
| Stabilité | Dépend du métier | Garantie |
| Taille | Variable | Fixe et petite |
| Exposition d'information | Oui | Non |
| Risque | Changement, doublon, erreur de saisie | Aucun lien avec le métier |

#### Générer des identifiants

| Méthode | Principe | Avantages | Inconvénients |
|---|---|---|---|
| Séquence d'entiers | Compteur géré par la base | Compact, ordonné | Devinable, difficile à générer hors de la base |
| UUID aléatoire (v4) | Valeur aléatoire de 128 bits | Génération sans coordination | Mauvaise localité dans les index |
| UUID ordonné dans le temps (v7) | Horodatage suivi d'aléa | Génération décentralisée, bonne localité | Révèle l'heure de création |

Le format des UUID, y compris les variantes ordonnées dans le temps, est décrit dans la RFC 9562.

#### Exemple complet avec tenant dans la clé

```sql
CREATE TABLE aircraft (
  tenant_id    uuid NOT NULL,
  id           uuid NOT NULL,
  registration text NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, registration)       -- unicité métier, distincte de la clé
);

CREATE TABLE maintenance_task (
  tenant_id   uuid NOT NULL,
  id          uuid NOT NULL,
  aircraft_id uuid NOT NULL,
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, aircraft_id)
    REFERENCES aircraft (tenant_id, id)
    ON DELETE RESTRICT
);
```

**Comment cela fonctionne.** La clé étrangère est composite : elle contient le tenant. Une tâche du tenant A ne peut donc pas référencer un aéronef du tenant B.

#### Actions référentielles

| Action | Effet à la suppression de la ligne référencée |
|---|---|
| `RESTRICT` ou `NO ACTION` | La suppression est refusée tant que des références existent |
| `CASCADE` | Les lignes qui référencent sont supprimées |
| `SET NULL` | La référence est vidée |
| `SET DEFAULT` | La référence prend sa valeur par défaut |

#### Points d'attention

- **Indexer les clés étrangères.** Dans PostgreSQL, la colonne qui référence n'est pas indexée automatiquement. Sans index, les jointures et les suppressions en cascade deviennent lentes.
- **Ne pas réutiliser les identifiants** d'éléments supprimés : une référence ancienne pourrait désigner une nouvelle ressource sans rapport.
- **Ne pas exposer d'identifiants séquentiels** si l'énumération est un risque. Un identifiant opaque évite que les ressources soient devinées, mais il ne remplace pas le contrôle d'accès.

**Limites.** Une clé composite plus longue alourdit chaque référence et chaque index. C'est le prix de la garantie d'isolation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.6 Relation et référence](#26-relation-et-référence) | La clé étrangère est la mise en œuvre relationnelle de la référence |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | Les contraintes et l'intégrité référentielle s'appuient sur les clés |
| [2.14 Index](#214-index) | Une clé primaire crée un index, et les clés étrangères méritent le leur |
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Le tenant dans la clé est une défense d'isolation |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | La sécurité au niveau de la ligne complète cette protection |

### 5. Application pratique

**Situation initiale.** Une compagnie utilise l'immatriculation comme identifiant d'aéronef. Un avion est cédé et reçoit une nouvelle immatriculation.

**Problème.** Toutes les tâches, tous les rapports et tous les journaux qui référencent l'ancienne valeur doivent être mis à jour, sous peine de rompre l'historique.

**Application du concept.** On introduit un identifiant artificiel, et l'immatriculation devient une simple colonne unique, modifiable.

**Déroulé.**

1. On ajoute la colonne `id` et on la remplit pour chaque aéronef.
2. On ajoute aux tables liées une colonne `aircraft_id` reprenant l'identifiant.
3. On remplace les références par l'immatriculation par des références à `id`.
4. On conserve l'unicité de l'immatriculation par une contrainte distincte.

**Résultat.** Le changement d'immatriculation est une simple modification de colonne, sans effet sur les liens ni sur l'historique.

**Limites.** La migration touche toutes les tables liées. Elle doit être planifiée et exécutée par étapes (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles propriétés doit avoir une clé primaire ?
2. **Compréhension.** Quelle est la différence entre clé naturelle et clé artificielle ?
3. **Compréhension.** Que fait `ON DELETE RESTRICT` ?
4. **Pourquoi.** Pourquoi inclut-on le tenant dans une clé étrangère ?
5. **Raisonnement pratique.** Des identifiants séquentiels apparaissent dans les adresses de l'API. Quel risque cela présente-t-il, et que suffit-il de faire ?

#### Réponses

1. Elle doit être unique, non nulle et stable dans le temps.
2. Une clé naturelle vient du métier (immatriculation) ; une clé artificielle est générée par le système et sans signification métier.
3. Elle refuse la suppression d'une ligne tant que d'autres lignes la référencent.
4. Pour que la base refuse qu'une ligne d'un tenant référence une ressource d'un autre tenant : c'est une garantie d'isolation vérifiée par la base.
5. Le risque est qu'un tiers énumère les ressources en incrémentant l'identifiant. L'identifiant opaque rend l'énumération difficile, mais il faut surtout contrôler l'accès à chaque ressource.

## 2.12 Contraintes et intégrité référentielle

### 1. Comprendre simplement

Les **contraintes** (*constraints*) sont des règles que les données doivent respecter pour être acceptées : une valeur obligatoire, unique, comprise dans une plage. L'**intégrité référentielle** (*referential integrity*) est la garantie que chaque référence désigne bien une ressource qui existe.

**Pourquoi cela existe.** Une donnée incorrecte coûte cher quand elle est découverte tard. Il vaut mieux la refuser à l'entrée que la corriger après coup, quand d'autres calculs s'en sont déjà servis.

**Problème résolu.** Garantir que les données restent cohérentes, quelles que soient les applications ou les utilisateurs qui les modifient.

**Modèle mental.** Des gardes à l'entrée d'un bâtiment. Chaque règle est un contrôle : « avez-vous un badge ? », « est-il valide ? ». Les données qui ne passent pas les contrôles n'entrent pas.

**Où l'analogie s'arrête.** Des gardes humains peuvent s'absenter. Une contrainte déclarée dans la base s'applique toujours, y compris pour des programmes qui ne connaissent pas les règles métier.

**Exemple.** La contrainte « l'immatriculation est unique dans un tenant » empêche deux aéronefs identiques. La contrainte référentielle « une tâche référence un aéronef existant » empêche une tâche sans aéronef.

**Objectif d'apprentissage :** vous pouvez citer les principales contraintes, et expliquer pourquoi on les applique à plusieurs niveaux.

### 2. Connaissances essentielles

#### Définition

- **Contrainte** : règle déclarée sur une table ou une colonne, que toute donnée stockée doit respecter, vérifiée à chaque écriture.
- **Intégrité référentielle** : propriété garantissant que chaque valeur d'une clé étrangère correspond à une clé existante dans la table référencée, ou est nulle.

#### Idées fondamentales

1. **Une contrainte est déclarative.** On dit ce qui doit être vrai ; la base le vérifie.
2. **Plusieurs niveaux d'intégrité.** Sur l'entité (clé unique), sur le domaine (valeurs permises), sur les références, et sur les règles métier.
3. **La dernière ligne de défense est la base.** Le moteur et l'interface vérifient aussi, pour de meilleurs messages, mais ils peuvent être contournés.
4. **Un contrôle « lire puis écrire » est fragile.** Deux écritures simultanées peuvent le contourner ; une contrainte de la base est atomique.
5. **Dans une plateforme configurable, certaines contraintes sont des métadonnées.** Le moteur les applique, car la base ne connaît pas les règles de chaque tenant.

#### Vocabulaire essentiel

- **`NOT NULL`** : la valeur est obligatoire.
- **`UNIQUE`** : deux lignes ne peuvent avoir la même valeur.
- **`CHECK`** : condition booléenne sur une ou plusieurs colonnes.
- **`FOREIGN KEY`** : lien vérifié vers une autre table.
- **`EXCLUDE`** : contrainte d'exclusion, par exemple pour empêcher des périodes qui se chevauchent (spécifique à PostgreSQL).
- **Orphelin** (*orphan*) : ligne qui référence une ligne disparue.
- **Contrainte différée** (*deferred*) : vérifiée à la fin de la transaction plutôt qu'à chaque instruction.

#### Relations de cause à effet

- La contrainte est vérifiée seulement dans l'interface. Un appel direct à l'API ou un import contourne la règle, et des données invalides arrivent.
- La vérification d'unicité est faite par le code (« lire puis écrire »). Deux requêtes simultanées passent le contrôle ; deux doublons sont créés.
- Une suppression ignore les références. Des lignes orphelines subsistent et font échouer des affichages.

#### Idées reçues

- **« Il suffit de valider dans l'interface. »** Non. L'interface est contournable. L'API et la base doivent vérifier aussi.
- **« Les contraintes ralentissent trop la base. »** Leur coût est généralement faible par rapport au coût de données incohérentes. Il faut cependant indexer les colonnes concernées.
- **« Une contrainte métier peut toujours s'écrire en SQL. »** Non. Certaines règles dépendent de plusieurs ressources ou de l'état d'un workflow, et relèvent du moteur de règles (voir [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)).

#### Principe clé

Plus une règle est proche des données, plus elle est difficile à contourner : déclarez dans la base ce que la base peut garantir, et dans le moteur le reste.

#### Si vous ne retenez que trois choses

1. Une contrainte est une règle déclarative vérifiée à chaque écriture.
2. L'intégrité référentielle garantit que chaque référence désigne une ressource existante.
3. Appliquez les règles à plusieurs niveaux, la base étant la dernière ligne de défense.

### 3. Explication technique détaillée

#### Les types de contraintes

| Contrainte | Garantie | Exemple |
|---|---|---|
| `NOT NULL` | Valeur obligatoire | `registration` ne peut pas être vide |
| `UNIQUE` | Pas de doublon | Une immatriculation par tenant |
| `PRIMARY KEY` | Unique et non nulle | `(tenant_id, id)` |
| `CHECK` | Condition sur les valeurs | `flight_hours >= 0` |
| `FOREIGN KEY` | Référence existante | Tâche vers aéronef |
| `EXCLUDE` | Exclusion mutuelle | Pas de chevauchement de réservations |

#### Un invariant métier par contrainte d'exclusion

L'exemple « une réservation de baie ne peut pas en chevaucher une autre » s'exprime directement en PostgreSQL :

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bay_booking (
  tenant_id uuid NOT NULL,
  id        uuid NOT NULL,
  bay_id    uuid NOT NULL,
  period    tstzrange NOT NULL,
  PRIMARY KEY (tenant_id, id),
  EXCLUDE USING gist (
    tenant_id WITH =,
    bay_id    WITH =,
    period    WITH &&          -- && signifie « se chevauche »
  )
);
```

**Pourquoi c'est important.** La base refuse atomiquement tout chevauchement, même si deux requêtes arrivent au même instant. Un contrôle fait dans le code ne le garantirait pas.

#### Les niveaux de vérification

| Niveau | Rôle | Limite |
|---|---|---|
| Interface | Retour immédiat, messages clairs | Contournable |
| Moteur ou API | Autorité sur les règles configurées | Dépend du code du moteur |
| Base de données | Dernière défense, atomique | Ne connaît pas les règles configurables |

#### Les actions à la suppression

La suppression d'une ressource référencée doit suivre une règle explicite : refuser (`RESTRICT`), supprimer les dépendants (`CASCADE`) ou vider la référence (`SET NULL`). Le choix dépend du lien (voir [2.9 Composition et agrégation](#29-composition-et-agrégation)). Dans une plateforme, on préfère souvent l'**archivage** à la suppression physique (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).

#### Modes de défaillance

- **Orphelins** : référence créée par un chemin qui ne vérifie pas.
- **Course critique** (*race condition*) : un contrôle suivi d'une écriture, sans verrou ni contrainte.
- **Contrainte non portable** : règle exprimée dans une fonctionnalité propre à un moteur de base, difficile à migrer.
- **Dérive** : la règle configurée change, mais les données existantes n'y satisfont plus (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

**Limites.** Une contrainte qui échoue doit produire un message compréhensible. Les erreurs brutes de la base ne sont pas destinées aux utilisateurs : le moteur traduit les violations en erreurs métier.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère) | Les clés primaires et étrangères sont les contraintes de base |
| [2.16 Validation des données](#216-validation-des-données) | La validation vérifie les règles avant l'écriture ; les contraintes sont le dernier recours |
| [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique) | Les règles métier complexes dépassent les contraintes de la base |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants sont les contraintes qui ne doivent jamais être fausses |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | Les transactions garantissent la cohérence d'ensemble |

### 5. Application pratique

**Situation initiale.** Deux planificateurs réservent la baie 4 pour des créneaux qui se chevauchent, presque en même temps.

**Problème.** Le code vérifie d'abord les réservations existantes, puis écrit. Les deux vérifications passent, car aucune des deux écritures n'est encore visible.

**Application du concept.** Une contrainte d'exclusion est déclarée sur la table de réservations.

**Déroulé.**

1. Les deux demandes arrivent simultanément.
2. La première écriture est acceptée.
3. La seconde est refusée par la base avec une violation de contrainte.
4. Le moteur traduit l'erreur en message : « Ce créneau est déjà réservé ».

**Résultat.** Aucun chevauchement n'est possible, même sous forte charge.

**Limites.** Une règle de ce type est propre à un modèle donné. Dans une plateforme où les tenants définissent leurs propres règles, il faut un mécanisme équivalent dans le moteur, avec des verrous ou des transactions adaptés (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez quatre types de contraintes.
2. **Compréhension.** Que garantit l'intégrité référentielle ?
3. **Compréhension.** Pourquoi la base est-elle appelée « dernière ligne de défense » ?
4. **Pourquoi.** Pourquoi un contrôle « lire puis écrire » ne garantit-il pas l'unicité en cas d'accès simultané ?
5. **Raisonnement pratique.** Comment empêcher que deux réservations de la même baie se chevauchent ?

#### Réponses

1. Par exemple `NOT NULL`, `UNIQUE`, `CHECK` et `FOREIGN KEY` ; on peut aussi citer la clé primaire et l'exclusion.
2. Que chaque référence désigne une ressource existante, ou soit vide.
3. Parce que l'interface et le code peuvent être contournés ou comporter des erreurs ; une contrainte déclarée dans la base s'applique à tout accès.
4. Parce que deux requêtes simultanées peuvent toutes deux lire « aucun doublon » avant que l'une d'elles n'ait écrit. Une contrainte de la base est vérifiée de façon atomique.
5. Par une contrainte d'exclusion déclarée dans la base, ou, dans un moteur générique, par une vérification atomique protégée par un verrou ou une transaction adaptée.

## 2.13 Normalisation

### 1. Comprendre simplement

La **normalisation** (*normalization*) est une méthode pour organiser les tables afin que chaque information ne soit stockée qu'**une seule fois**. Elle réduit la redondance, et avec elle les incohérences qui apparaissent quand on modifie une donnée à un endroit et pas dans ses copies.

**Pourquoi cela existe.** Une table qui répète la même information sur de nombreuses lignes est difficile à maintenir. Corriger une valeur demande de modifier toutes les lignes, et en oublier une crée une contradiction.

**Problème résolu.** Éviter les anomalies d'insertion, de modification et de suppression qui viennent de la redondance.

**Modèle mental.** Un annuaire où l'adresse d'une entreprise est inscrite sur la fiche de chacun de ses employés. Si l'entreprise déménage, il faut corriger toutes les fiches. En normalisant, l'adresse est écrite une seule fois, sur la fiche de l'entreprise.

**Où l'analogie s'arrête.** La normalisation n'est pas une fin en soi. Un modèle très normalisé demande plus de jointures à la lecture, ce qui peut ralentir certaines requêtes.

**Exemple.** Une table `aircraft` qui contient pour chaque ligne le constructeur et la ville du constructeur :

| id | registration | model | manufacturer | manufacturer_city |
|---|---|---|---|---|
| 1 | F-ABCD | A320 | Airbus | Toulouse |
| 2 | F-ABCE | A320 | Airbus | Toulouse |
| 3 | F-ABCF | A321 | Airbus | Toulouse |

Si le constructeur déménage, il faut modifier chaque ligne.

**Objectif d'apprentissage :** vous pouvez décrire les trois anomalies de la redondance et expliquer ce que demandent les trois premières formes normales.

### 2. Connaissances essentielles

#### Définition

La **normalisation** est un processus de conception qui décompose les tables selon des règles formelles (les **formes normales**) pour que chaque fait ne soit enregistré qu'une seule fois et que les dépendances entre colonnes soient explicites.

#### Idées fondamentales

1. **Un fait, un endroit.** Chaque information n'est stockée qu'une fois.
2. **Les dépendances fonctionnelles guident la décomposition.** Une colonne A détermine une colonne B si chaque valeur de A correspond à une seule valeur de B.
3. **Les formes normales sont cumulatives.** La 2NF suppose la 1NF ; la 3NF suppose la 2NF.
4. **La normalisation supprime des anomalies.** Insertion, modification, suppression.
5. **La dénormalisation est un choix assumé.** On duplique volontairement pour la lecture, au prix d'une synchronisation.

#### Vocabulaire essentiel

- **Redondance** (*redundancy*) : même information stockée plusieurs fois.
- **Anomalie de modification** (*update anomaly*) : une copie est corrigée, pas les autres.
- **Anomalie d'insertion** (*insertion anomaly*) : on ne peut pas enregistrer un fait sans en enregistrer un autre.
- **Anomalie de suppression** (*deletion anomaly*) : supprimer une ligne fait disparaître un fait qui devait rester.
- **Dépendance fonctionnelle** (*functional dependency*) : A détermine B.
- **Forme normale** (*normal form*) : niveau de conformité d'un modèle (1NF, 2NF, 3NF, BCNF).
- **Dénormalisation** (*denormalization*) : duplication volontaire pour accélérer la lecture.

#### Relations de cause à effet

- Une information est dupliquée sur dix mille lignes. Une correction demande dix mille mises à jour, et un oubli crée une contradiction.
- On normalise à l'excès. Chaque lecture demande de nombreuses jointures, et la requête ralentit.
- On dénormalise sans mécanisme de synchronisation. Les copies divergent avec le temps.

#### Idées reçues

- **« Plus on normalise, mieux c'est. »** Non. Au-delà de la 3NF, le gain est souvent faible, et le coût de lecture augmente.
- **« Normaliser, c'est mettre une table par concept. »** C'est un résultat fréquent, mais le critère est la dépendance entre colonnes, pas le nombre de tables.
- **« La dénormalisation est une erreur. »** Non. C'est un compromis légitime, s'il est documenté et maintenu (par exemple pour le reporting).

#### Principe clé

Normalisez pour que la vérité soit à un seul endroit ; dénormalisez ensuite, consciemment, là où la lecture l'exige.

#### Si vous ne retenez que trois choses

1. La normalisation évite de stocker plusieurs fois le même fait, donc les incohérences.
2. Les trois premières formes normales suppriment, dans l'ordre, les groupes répétés, les dépendances partielles et les dépendances transitives.
3. La dénormalisation est un compromis volontaire entre simplicité d'écriture et rapidité de lecture.

### 3. Explication technique détaillée

#### Les trois anomalies sur l'exemple

| Anomalie | Description sur l'exemple |
|---|---|
| Modification | Pour changer la ville d'Airbus, il faut modifier chaque ligne ; en oublier une crée une contradiction |
| Insertion | On ne peut pas enregistrer un nouveau constructeur sans lui associer un aéronef |
| Suppression | Supprimer le dernier aéronef d'un constructeur fait disparaître le constructeur |

#### Les formes normales

| Forme | Exigence | Anomalie traitée |
|---|---|---|
| 1NF | Valeurs atomiques, pas de groupe répété | Une cellule contenant une liste |
| 2NF | En plus : chaque attribut dépend de **toute** la clé | Dépendance partielle d'une clé composite |
| 3NF | En plus : aucun attribut ne dépend d'un autre attribut non-clé | Dépendance transitive |
| BCNF | Pour toute dépendance A → B non triviale, A est une clé candidate | Cas résiduels de la 3NF |

**Lecture sur l'exemple.** Ici, `manufacturer_city` dépend de `manufacturer`, qui dépend de `model`. Ce sont des dépendances transitives : la 3NF les interdit.

#### Après normalisation

```sql
CREATE TABLE manufacturer (
  id   uuid PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL
);

CREATE TABLE aircraft_model (
  id              uuid PRIMARY KEY,
  name            text NOT NULL,
  manufacturer_id uuid NOT NULL REFERENCES manufacturer (id)
);

CREATE TABLE aircraft (
  id           uuid PRIMARY KEY,
  registration text NOT NULL,
  model_id     uuid NOT NULL REFERENCES aircraft_model (id)
);
```

**Exemple chiffré.** Avec 10 000 aéronefs, changer la ville du constructeur modifiait 10 000 lignes avant normalisation. Après, il suffit de modifier 1 ligne de `manufacturer`.

#### Quand dénormaliser

| Situation | Raison | Précaution |
|---|---|---|
| Rapport lu très souvent | Éviter des jointures coûteuses | Rafraîchissement périodique |
| Historique figé | Conserver la valeur à un instant donné | Copie volontaire documentée |
| Moteur générique | Stocker des attributs variables dans un document | Validation par le moteur |

**Contre-exemple.** Copier le nom du modèle dans chaque tâche « pour aller plus vite », sans mécanisme de mise à jour, produit des noms différents pour un même modèle.

**Limites.** Les formes normales supposent un schéma stable. Dans un moteur générique, le modèle EAV pousse la normalisation à l'extrême, au prix de requêtes complexes (voir [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.10 Modélisation relationnelle et diagramme entité-relation](#210-modélisation-relationnelle-et-diagramme-entité-relation) | La normalisation affine le modèle logique tiré du diagramme |
| [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère) | Les dépendances fonctionnelles s'appuient sur la notion de clé |
| [2.14 Index](#214-index) | Les index compensent le coût de lecture des modèles normalisés |
| [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés) | Les champs personnalisés posent la question de la normalisation dans un modèle souple |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) | L'*event sourcing* et les modèles de lecture dénormalisés relèvent d'un autre compromis |

### 5. Application pratique

**Situation initiale.** La table des aéronefs contient, sur chaque ligne, le nom du modèle, le constructeur et la ville du constructeur.

**Problème.** Une erreur de saisie dans la ville du constructeur se retrouve sur des milliers de lignes, et les rapports par ville donnent des résultats contradictoires.

**Application du concept.** On sépare les faits : constructeurs, modèles et aéronefs, avec des références.

**Déroulé.**

1. On identifie les dépendances : modèle détermine constructeur, constructeur détermine ville.
2. On crée une table par fait et on les relie par des clés étrangères.
3. On migre les données en dédoublonnant.
4. On corrige l'erreur en un seul endroit.

**Résultat.** Les rapports par ville sont cohérents, et la correction ne demande qu'une modification.

**Limites.** Un écran qui affiche la liste des aéronefs avec constructeur et ville demande désormais deux jointures. À grand volume, une vue matérialisée peut compenser (voir [2.14 Index](#214-index)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que la normalisation, et quel problème résout-elle ?
2. **Compréhension.** Quelles sont les trois anomalies liées à la redondance ?
3. **Compréhension.** Que demande la troisième forme normale ?
4. **Pourquoi.** Pourquoi dénormalise-t-on parfois volontairement ?
5. **Raisonnement pratique.** Une colonne `skills` contient « soudure, hydraulique, avionique » pour chaque technicien. Quelle forme normale est violée et comment corriger ?

#### Réponses

1. C'est une méthode de décomposition des tables pour que chaque fait ne soit stocké qu'une fois. Elle évite les incohérences dues à la redondance.
2. Les anomalies de modification, d'insertion et de suppression.
3. Qu'en plus de la 2NF, aucun attribut non-clé ne dépende d'un autre attribut non-clé : pas de dépendance transitive.
4. Pour accélérer certaines lectures ou figer une valeur à un instant donné, en acceptant de gérer la synchronisation.
5. La première forme normale (valeurs non atomiques). On crée une table des compétences et une table d'association entre techniciens et compétences.

## 2.14 Index

### 1. Comprendre simplement

Un **index** est une structure de données auxiliaire qui permet de retrouver rapidement des lignes selon la valeur d'une ou plusieurs colonnes, sans parcourir toute la table.

**Pourquoi cela existe.** Sans index, chercher un aéronef par immatriculation oblige à lire toutes les lignes. Cela convient pour cent lignes, pas pour dix millions.

**Problème résolu.** Accélérer les recherches, les tris et les jointures sur de gros volumes.

**Modèle mental.** L'index alphabétique à la fin d'un livre. Au lieu de feuilleter chaque page pour trouver un mot, on consulte l'index, qui indique les pages.

**Où l'analogie s'arrête.** L'index d'un livre est figé à l'impression. Un index de base de données est mis à jour à chaque écriture, ce qui a un coût.

**Exemple.** Un index sur `(tenant_id, registration)` permet de retrouver immédiatement un aéronef par son immatriculation.

**Les composants.**

1. la **structure** (le plus souvent un arbre équilibré, ou *B-tree*) ;
2. les **colonnes indexées** et leur ordre ;
3. le **coût d'écriture** : l'index est mis à jour à chaque modification.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi un index accélère la lecture et ralentit l'écriture, et choisir l'ordre des colonnes d'un index composé.

### 2. Connaissances essentielles

#### Définition

Un **index** est une structure de données maintenue par la base de données, qui associe des valeurs de colonnes à l'emplacement des lignes correspondantes, afin d'accélérer les recherches, les tris et les jointures.

#### Idées fondamentales

1. **Un index échange de l'écriture contre de la lecture.** Chaque insertion ou modification met l'index à jour.
2. **L'ordre des colonnes compte.** Un index composé sert les recherches qui utilisent un préfixe de ses colonnes.
3. **La sélectivité détermine l'utilité.** Un index sur une colonne qui a deux valeurs ne trie presque rien.
4. **Un index prend de la place.** Parfois autant que la table.
5. **Le planificateur choisit.** La base décide d'utiliser ou non un index selon ses estimations.
6. **L'unicité s'implémente par un index.** Une contrainte `UNIQUE` en crée un.

#### Vocabulaire essentiel

- **B-tree** : arbre équilibré, structure d'index la plus courante.
- **Index composé** (*composite index*) : index sur plusieurs colonnes.
- **Sélectivité** (*selectivity*) : proportion de lignes écartées par une condition.
- **Index couvrant** (*covering index*) : index qui contient toutes les colonnes demandées.
- **Index partiel** (*partial index*) : index limité aux lignes qui satisfont une condition.
- **Parcours séquentiel** (*sequential scan*) : lecture de toute la table.
- **Plan d'exécution** (*query plan*) : stratégie choisie par la base pour exécuter une requête.

#### Relations de cause à effet

- Une colonne souvent filtrée n'est pas indexée. Les requêtes ralentissent proportionnellement au volume de la table.
- Trop d'index sont créés. Chaque écriture devient plus lente, et l'espace disque augmente.
- Le tenant n'est pas la première colonne de l'index. Les requêtes, toutes filtrées par tenant, ne l'utilisent pas efficacement.

#### Idées reçues

- **« Plus d'index, c'est plus de vitesse. »** Non. Chaque index ralentit les écritures et consomme de l'espace.
- **« Un index est toujours utilisé s'il existe. »** Non. Le planificateur peut préférer un parcours complet, par exemple si la condition ne filtre presque rien.
- **« L'index fonctionne quelle que soit la forme de la condition. »** Non. Appliquer une fonction à la colonne indexée (`lower(registration)`) peut empêcher l'usage d'un index simple.

#### Principe clé

Indexez ce que vous cherchez souvent et ce qui filtre beaucoup ; vérifiez par le plan d'exécution que l'index est vraiment utilisé.

#### Si vous ne retenez que trois choses

1. Un index accélère la lecture au prix de l'écriture et de l'espace.
2. L'ordre des colonnes d'un index composé détermine les requêtes qu'il sert.
3. Dans une plateforme multi-tenant, le tenant est généralement la première colonne.

### 3. Explication technique détaillée

#### Le principe du B-tree

Un B-tree est un arbre où chaque nœud contient de nombreuses clés triées. La recherche descend de la racine vers une feuille en quelques étapes.

**Coût de recherche.** Avec un facteur de branchement $b$ (le nombre d'enfants par nœud) et $n$ lignes, la profondeur est de l'ordre de :

$$\text{profondeur} \approx \log_b(n)$$

**Exemple chiffré.** Avec $b = 200$ et $n = 10\,000\,000$, on obtient $\log_{200}(10^7) \approx 3{,}0$ : environ trois ou quatre niveaux à lire, contre dix millions de lignes pour un parcours complet.

#### Index composé et préfixe

```sql
CREATE INDEX aircraft_tenant_status_due
  ON aircraft (tenant_id, status, next_inspection_date);
```

Cet index sert les requêtes qui filtrent :

- sur `tenant_id` seul ;
- sur `tenant_id` et `status` ;
- sur `tenant_id`, `status` et `next_inspection_date`.

Il ne sert pas efficacement une requête qui filtre sur `status` seul, sans `tenant_id`. C'est la règle du **préfixe gauche**.

#### Quelques variantes utiles

| Variante | Usage | Exemple |
|---|---|---|
| Index unique | Garantir l'unicité | `UNIQUE (tenant_id, registration)` |
| Index partiel | Indexer un sous-ensemble | `WHERE status = 'active'` |
| Index sur expression | Rechercher sans tenir compte de la casse | `lower(registration)` |
| Index inversé (GIN) | Rechercher dans un document JSON ou du texte | Champs personnalisés |

#### Indexer des champs que l'on ne connaît pas à l'avance

Dans une plateforme où les administrateurs créent des champs, il est impossible de prévoir tous les index. Plusieurs approches existent :

- indexer un document JSON dans son ensemble ou sur certains chemins ;
- créer des index à la demande pour les champs filtrés fréquemment ;
- maintenir des tables d'index séparées, alimentées par le moteur ;
- limiter le nombre de champs filtrables par type.

**Contre-exemple.** Laisser les utilisateurs filtrer et trier sur n'importe quel champ personnalisé, sans index et sans limite, permet à un seul tenant de saturer la base avec des requêtes qui parcourent tout.

#### Vérifier l'usage

```sql
EXPLAIN ANALYZE
SELECT * FROM aircraft
WHERE tenant_id = :tenant AND status = 'active'
ORDER BY next_inspection_date
LIMIT 50;
```

La sortie indique si la base utilise un parcours séquentiel ou un index, et le temps réel d'exécution.

**Limites.** Les coûts relatifs dépendent du volume, de la distribution des valeurs et du matériel. Il faut mesurer sur des données réalistes, pas deviner.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.11 Clé primaire et clé étrangère](#211-clé-primaire-et-clé-étrangère) | La clé primaire est indexée ; les clés étrangères méritent leur index |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | Les contraintes d'unicité reposent sur des index |
| [2.15 Modèle de requête](#215-modèle-de-requête) | Le modèle de requête détermine quels index sont utiles |
| [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés) | Les champs personnalisés compliquent l'indexation |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | La pagination efficace dépend d'un index sur le critère de tri |

### 5. Application pratique

**Situation initiale.** L'écran « aéronefs dont l'inspection arrive dans moins de 30 jours » met 8 secondes à s'afficher pour la plus grande compagnie.

**Problème.** La requête filtre sur le tenant, le statut et la date, mais seul le tenant est indexé.

**Application du concept.** Un index composé `(tenant_id, status, next_inspection_date)` est créé.

**Déroulé.**

1. On examine le plan d'exécution : parcours de toutes les lignes du tenant.
2. On crée l'index composé.
3. On relance la requête et on examine à nouveau le plan.
4. Le plan utilise l'index ; le temps tombe sous la centaine de millisecondes.

**Résultat.** L'écran s'affiche rapidement, sans changer le code.

**Limites.** Chaque mise à jour du statut ou de la date met aussi à jour l'index. Si ces champs sont modifiés massivement (import), le coût d'écriture augmente.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quoi sert un index et quel est son coût ?
2. **Compréhension.** Que signifie la règle du préfixe gauche ?
3. **Compréhension.** Qu'est-ce qu'un index partiel ?
4. **Pourquoi.** Pourquoi le tenant est-il généralement la première colonne des index d'une plateforme multi-tenant ?
5. **Raisonnement pratique.** Une requête filtre sur `status` seul et reste lente alors qu'un index `(tenant_id, status)` existe. Pourquoi ?

#### Réponses

1. Il accélère les recherches, tris et jointures. Son coût est un ralentissement des écritures et un espace de stockage supplémentaire.
2. Un index composé ne sert efficacement que les requêtes qui utilisent ses premières colonnes, dans l'ordre.
3. Un index qui ne couvre que les lignes qui satisfont une condition, par exemple celles dont le statut est « actif ».
4. Parce que toutes les requêtes sont filtrées par tenant. Avec le tenant en tête, l'index restreint immédiatement la recherche au périmètre du tenant.
5. La requête ne filtre pas sur `tenant_id`, première colonne de l'index : l'index ne peut pas être utilisé efficacement.

## 2.15 Modèle de requête

### 1. Comprendre simplement

Le **modèle de requête** (*query model*) est l'ensemble des moyens que la plateforme offre pour **interroger** les ressources : filtrer, choisir les champs, trier, paginer, suivre les relations, agréger, rechercher.

**Pourquoi cela existe.** Dans une plateforme générique, on ne peut pas écrire une requête par écran. Les clients et les applications doivent composer eux-mêmes leurs demandes, sans que la plateforme perde le contrôle de l'accès aux données et des performances.

**Problème résolu.** Offrir une interrogation puissante, mais sûre, bornée et indépendante du stockage.

**Modèle mental.** Un guichet de bibliothèque. Vous pouvez demander « les romans publiés après 2000, triés par titre », mais vous n'entrez pas vous-même dans les réserves.

**Où l'analogie s'arrête.** Le guichetier connaît votre carte et vos droits. Dans une plateforme, le moteur doit appliquer automatiquement le tenant et les droits de l'appelant à chaque requête.

**Exemple.** « Les aéronefs actifs dont l'inspection est avant le 1er décembre, triés par date, 50 par page. »

**Les composants d'un modèle de requête.**

1. un **filtre** (conditions) ;
2. une **projection** (champs demandés) ;
3. un **tri** ;
4. une **pagination** ;
5. des **relations à suivre** (inclusions) ;
6. des **agrégations** (comptages, sommes).

**Objectif d'apprentissage :** vous pouvez décrire les éléments d'une requête déclarative, et expliquer pourquoi une plateforme ne laisse pas ses clients écrire du SQL brut.

### 2. Connaissances essentielles

#### Définition

Le **modèle de requête** est le langage ou l'interface déclarative, avec ses opérations et ses limites, par lequel un client exprime ce qu'il veut lire dans la plateforme, indépendamment de la manière dont les données sont stockées.

#### Idées fondamentales

1. **Déclaratif.** Le client dit quoi, pas comment.
2. **Indépendant du stockage.** Le même modèle fonctionne quelle que soit la technique de stockage (voir [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés)).
3. **Compilé vers le stockage.** Le moteur traduit la demande en requêtes paramétrées.
4. **Contrôlé.** Le tenant et les droits sont ajoutés par le moteur, jamais fournis par le client.
5. **Borné.** Limites sur la taille des pages, la profondeur des relations et les opérations coûteuses.
6. **Sûr.** Les valeurs sont toujours passées en paramètres, jamais assemblées dans une chaîne.

#### Vocabulaire essentiel

- **Filtre** (*filter*) : ensemble de conditions sur les champs.
- **Projection** (*projection*) : sélection des champs retournés.
- **Tri** (*sort*, *order by*) : ordre des résultats.
- **Pagination** (*pagination*) : découpage des résultats en pages.
- **Inclusion** (*expand*, *include*) : chargement de ressources liées avec le résultat.
- **Agrégation** (*aggregation*) : calcul sur un ensemble (comptage, somme, moyenne).
- **Injection SQL** (*SQL injection*) : attaque où des données fournies par l'utilisateur sont interprétées comme du SQL.

#### Relations de cause à effet

- Le client assemble lui-même du SQL. Il peut lire n'importe quel tenant, ou saturer la base.
- La requête n'est pas bornée. Une demande « tout, trié sur n'importe quoi, avec toutes les relations » consomme une grande part des ressources.
- Le moteur construit les requêtes par concaténation de chaînes. Une valeur malveillante est interprétée comme du code : c'est une injection SQL.

#### Idées reçues

- **« Exposer une API de requête libre, c'est plus flexible, donc mieux. »** Non. Sans bornes, c'est aussi une porte d'entrée pour des abus.
- **« Filtrer dans l'interface suffit. »** Non. Le filtre d'accès doit être appliqué par le moteur, côté serveur.
- **« Le modèle de requête dépend de la base de données. »** Il ne devrait pas : il doit rester stable même si le stockage change.

#### Principe clé

Le client décrit ce qu'il veut ; le moteur ajoute ce qu'il doit (tenant, droits, limites) et traduit en requêtes paramétrées.

#### Si vous ne retenez que trois choses

1. Une requête déclarative décrit un filtre, une projection, un tri et une pagination.
2. Le tenant et les droits sont toujours ajoutés par le moteur.
3. Les valeurs sont passées en paramètres, jamais concaténées.

### 3. Explication technique détaillée

#### Un langage de requête déclaratif

```json
{
  "type": "aircraft",
  "filter": {
    "and": [
      { "field": "status", "op": "eq", "value": "active" },
      { "field": "next_inspection_date", "op": "lt", "value": "2026-12-01" }
    ]
  },
  "sort": [{ "field": "next_inspection_date", "dir": "asc" }],
  "fields": ["registration", "model", "next_inspection_date"],
  "page": { "size": 50 }
}
```

#### Compilation vers une requête paramétrée

```sql
SELECT registration, model, next_inspection_date
FROM aircraft
WHERE tenant_id = $1               -- ajouté par le moteur
  AND status = $2
  AND next_inspection_date < $3
ORDER BY next_inspection_date ASC
LIMIT 50;
```

**Ce que le moteur fait.**

1. Il vérifie que les champs et les opérateurs existent dans le schéma du type.
2. Il retire les champs auxquels l'appelant n'a pas droit (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
3. Il ajoute le filtre de tenant et les filtres d'accès.
4. Il applique les plafonds (taille de page, profondeur).
5. Il compile en requête paramétrée, jamais en concaténant des valeurs.

#### Opérateurs usuels

| Famille | Exemples |
|---|---|
| Comparaison | `eq`, `ne`, `lt`, `lte`, `gt`, `gte` |
| Ensemble | `in`, `not_in` |
| Texte | `contains`, `starts_with` |
| Logique | `and`, `or`, `not` |
| Présence | `is_null`, `is_not_null` |

#### Approches existantes

| Approche | Principe | Remarque |
|---|---|---|
| Paramètres d'URL | `?status=active&sort=date` | Simple, limité en expressivité |
| OData | Standard OASIS : `$filter`, `$select`, `$orderby`, `$expand` | Riche et normalisé |
| GraphQL | Le client décrit la forme exacte de la réponse | Demande des garde-fous de complexité (voir [10.2 GraphQL](10-api-integrations-extensibilite.md#102-graphql)) |
| DSL JSON maison | Comme l'exemple ci-dessus | Maîtrisé, mais à documenter et à faire évoluer |

#### Modes de défaillance

- **Injection** : concaténation de valeurs dans une requête.
- **Requête non bornée** : absence de limite de page ou de profondeur.
- **Tri sur un champ non indexé** : parcours complet et tri en mémoire.
- **Problème N+1** : une requête par ressource liée, au lieu d'un chargement groupé.
- **Contournement des droits** : un filtre ou un tri révèle indirectement la valeur d'un champ interdit.

**Contre-exemple.** Accepter un champ `where` contenant du SQL libre : le client contrôle la requête et peut contourner le filtre de tenant.

**Limites.** Un langage de requête ne peut pas tout permettre. Les requêtes analytiques lourdes (agrégations sur de gros volumes, croisements) relèvent souvent d'un système dédié, alimenté par la plateforme (voir [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.14 Index](#214-index) | Les index doivent correspondre aux filtres et aux tris autorisés |
| [2.16 Validation des données](#216-validation-des-données) | Les filtres sont validés contre le schéma, comme les écritures |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits au niveau du champ et de la ligne s'appliquent aux requêtes |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | Pagination et filtrage sont exposés par l'API |
| [10.2 GraphQL](10-api-integrations-extensibilite.md#102-graphql) | GraphQL est un modèle de requête centré sur le client |

### 5. Application pratique

**Situation initiale.** La compagnie veut un tableau filtrable de ses aéronefs, avec des filtres choisis par l'utilisateur.

**Problème.** Les filtres possibles varient d'un tenant à l'autre, car chacun a ses champs personnalisés.

**Application du concept.** Le tableau envoie une requête déclarative. Le moteur la valide contre le schéma du tenant et la compile.

**Déroulé.**

1. L'utilisateur choisit « statut = actif » et « inspection avant le 1er décembre ».
2. L'interface envoie le filtre déclaratif.
3. Le moteur contrôle les champs, ajoute le tenant et les droits, applique la limite de page.
4. Il exécute la requête paramétrée et retourne la première page.

**Résultat.** Le même tableau sert tous les tenants, avec leurs champs propres, sans exposer de SQL.

**Limites.** Un filtre sur un champ personnalisé non indexé peut être lent. La plateforme doit signaler ou limiter ces cas.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les éléments d'une requête déclarative ?
2. **Compréhension.** Qui ajoute le filtre de tenant à une requête, le client ou le moteur ?
3. **Compréhension.** Qu'est-ce qu'une injection SQL ?
4. **Pourquoi.** Pourquoi une plateforme préfère-t-elle un langage de requête déclaratif au SQL brut ?
5. **Raisonnement pratique.** Un client demande 50 000 aéronefs par page avec toutes leurs relations. Comment réagit une plateforme bien conçue ?

#### Réponses

1. Un filtre, une projection, un tri, une pagination, des inclusions de relations et éventuellement des agrégations.
2. Le moteur. Un filtre fourni par le client pourrait être omis ou falsifié.
3. Une attaque où une donnée fournie par un utilisateur est interprétée comme du code SQL parce qu'elle a été concaténée à la requête.
4. Pour garder le contrôle des droits, des performances et du stockage : le client décrit ce qu'il veut, et le moteur le traduit de façon sûre et bornée.
5. Elle applique un plafond de taille de page et de profondeur, et retourne une erreur claire ou une page plus petite avec un moyen de continuer.

## 2.16 Validation des données

### 1. Comprendre simplement

La **validation des données** (*data validation*) consiste à vérifier, avant d'accepter une donnée, qu'elle respecte les règles attendues : bon type, bon format, valeur dans les limites, champ obligatoire présent, cohérence avec les autres champs.

**Pourquoi cela existe.** Une donnée incorrecte acceptée aujourd'hui produit des erreurs demain, souvent loin de l'endroit où elle est entrée. Le plus simple est de la refuser tout de suite, avec une explication.

**Problème résolu.** Garder des données fiables, et fournir à l'utilisateur un message qui lui permet de corriger.

**Modèle mental.** Le contrôle des documents à une frontière. Chaque document est examiné avant d'autoriser le passage. Si un élément manque ou est faux, on explique ce qui ne va pas.

**Où l'analogie s'arrête.** Un contrôle frontalier est unique. Une plateforme valide à plusieurs endroits (interface, API, base), car chacun protège contre des risques différents.

**Exemple.** Une saisie d'aéronef contient une immatriculation « XYZ », sans le format attendu, et une date d'inspection dans le passé. La validation refuse l'écriture et indique les deux champs en cause.

**Les composants.**

1. des **règles** (type, format, plage, obligation, unicité, dépendances) ;
2. un **moment de contrôle** (à l'écriture) ;
3. un **rapport d'erreurs** exploitable, champ par champ.

**Objectif d'apprentissage :** vous pouvez classer les règles de validation par famille, et expliquer pourquoi le serveur est l'autorité finale.

### 2. Connaissances essentielles

#### Définition

La **validation** est le contrôle, avant stockage ou traitement, qu'une donnée respecte des règles déclarées. Elle accepte la donnée ou la refuse avec des erreurs explicites.

#### Idées fondamentales

1. **Valider à chaque frontière de confiance.** Tout ce qui vient de l'extérieur est vérifié.
2. **Le serveur fait autorité.** L'interface améliore l'expérience, mais ne protège rien.
3. **Les règles sont déclaratives.** Elles sont des métadonnées que le moteur applique.
4. **Il existe plusieurs familles de règles.** Syntaxe, valeur, inter-champs, inter-ressources, métier.
5. **Les erreurs sont structurées.** Un code, un champ concerné, un message.
6. **On préfère les listes de valeurs autorisées.** Accepter ce qui est connu plutôt qu'interdire ce qui est dangereux.

#### Vocabulaire essentiel

- **Validation syntaxique** : le format est correct (une date, une adresse électronique).
- **Validation sémantique** : la valeur a un sens (une date d'inspection dans le futur).
- **Règle inter-champs** (*cross-field rule*) : la validité dépend de plusieurs champs.
- **Liste d'autorisation** (*allow list*) : ensemble de valeurs permises.
- **Assainissement** (*sanitization*) : transformation d'une valeur pour la rendre sûre. À distinguer de la validation.
- **Erreur de validation** (*validation error*) : refus structuré, avec champ et code.

#### Relations de cause à effet

- La validation n'est faite que côté interface. Un appel direct à l'API contourne tout, et des données invalides entrent.
- Les règles sont codées à plusieurs endroits. Elles divergent avec le temps : l'interface accepte ce que l'API refuse.
- Le message d'erreur ne désigne pas le champ. L'utilisateur ne sait pas quoi corriger.

#### Idées reçues

- **« La validation côté client suffit. »** Non. Elle n'est qu'une aide : le serveur doit valider, car le client peut être contourné.
- **« Valider, c'est nettoyer. »** Non. Valider décide d'accepter ou de refuser ; assainir transforme. Les deux ont des usages distincts.
- **« Plus on refuse, mieux c'est. »** Non. Une validation trop stricte bloque des cas légitimes. Elle doit refléter les besoins réels.

#### Principe clé

Chaque donnée entrante est vérifiée côté serveur, par des règles déclarées, avec des erreurs qui disent quoi corriger.

#### Si vous ne retenez que trois choses

1. La validation refuse les données invalides avant leur stockage, avec des erreurs explicites.
2. Le serveur est l'autorité ; l'interface n'est qu'une aide.
3. Les règles sont des métadonnées appliquées par le moteur, au même endroit pour tous.

### 3. Explication technique détaillée

#### Les familles de règles

| Famille | Exemple | Où l'exprimer |
|---|---|---|
| Type et format | Une date valide, `^F-[A-Z]{4}$` | Définition du champ |
| Valeur | `flight_hours >= 0`, énumération | Définition du champ |
| Obligation | Le champ est requis | Définition du champ |
| Inter-champs | `end_date >= start_date` | Règle du type |
| Inter-ressources | L'immatriculation est unique dans le tenant | Contrainte ou moteur |
| Métier | Un aéronef ne peut pas être actif avec une inspection en retard | Moteur de règles (voir [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)) |

#### Des règles déclaratives

```json
{
  "field": "next_inspection_date",
  "rules": [
    {
      "type": "required_if",
      "when": { "field": "inspection_required", "op": "eq", "value": true }
    },
    { "type": "not_before", "value": "today" }
  ]
}
```

**Comment le lire.** La date est obligatoire si l'inspection est requise, et elle ne peut pas être dans le passé. Le moteur lit ces règles et les applique à toute écriture.

#### Ordre de validation

```text
1. Structure de la requête         ─► format, champs inconnus
2. Types et formats des champs     ─► date valide, texte non vide
3. Règles par champ                ─► bornes, énumérations
4. Règles inter-champs             ─► cohérence interne
5. Règles inter-ressources         ─► unicité, références existantes
6. Règles métier                   ─► état, workflow
```

**Pourquoi cet ordre.** Les contrôles les moins coûteux et les plus simples passent en premier. On évite d'interroger la base pour une requête déjà mal formée.

#### Une réponse d'erreur exploitable

```json
{
  "status": 422,
  "code": "validation_failed",
  "errors": [
    { "field": "registration", "code": "pattern_mismatch", "message": "Format attendu : F-XXXX." },
    { "field": "next_inspection_date", "code": "in_past", "message": "La date doit être dans le futur." }
  ]
}
```

**Pourquoi.** Toutes les erreurs sont retournées d'un coup, avec le champ concerné. L'utilisateur corrige en une fois.

#### Quand une règle change

Une règle ajoutée ou resserrée ne s'applique qu'aux écritures futures. Les données existantes peuvent ne plus la respecter. La plateforme doit alors soit les signaler, soit les corriger par lot, soit exiger la correction à la prochaine modification (voir [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma)).

**Modes de défaillance.**

- **Règles dupliquées** entre interface, API et import : elles divergent.
- **Validation partielle** dans un import en masse : les premières lignes sont acceptées, les suivantes refusées, sans rapport clair.
- **Message qui révèle trop** : un refus qui expose l'existence d'une ressource d'un autre tenant.
- **Validation lente** : appel à un service externe sur le chemin de chaque écriture.

**Limites.** La validation ne remplace pas les contraintes de la base ni le contrôle d'accès. Elle améliore la qualité et l'expérience, mais ne suffit pas à elle seule pour garantir l'intégrité en cas d'accès simultané (voir [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.2 Type et schéma](#22-type-et-schéma) | Le schéma fournit une grande partie des règles à vérifier |
| [2.12 Contraintes et intégrité référentielle](#212-contraintes-et-intégrité-référentielle) | Les contraintes de la base sont le dernier recours |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Le runtime applique la validation dans le pipeline d'écriture et gère les erreurs |
| [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique) | Les règles métier complexes prolongent la validation |
| [8.2 Administration du modèle de données](08-admin-control-plane.md#82-administration-du-modèle-de-données) | L'administrateur configure les règles de validation d'un type |

### 5. Application pratique

**Situation initiale.** Un import de 5 000 aéronefs depuis un tableur échoue à moitié, sans explication.

**Problème.** Les erreurs sont retournées une à une, et l'utilisateur ne peut pas corriger efficacement.

**Application du concept.** L'import utilise le même moteur de validation que l'API, et produit un rapport complet.

**Déroulé.**

1. Le moteur lit chaque ligne et la valide contre le schéma du tenant.
2. Il collecte toutes les erreurs, avec numéro de ligne, champ et code.
3. Il retourne un rapport téléchargeable, et n'importe aucune ligne si le mode choisi est « tout ou rien ».
4. L'utilisateur corrige le fichier et recommence.

**Résultat.** Les règles sont les mêmes que pour la saisie manuelle, et le rapport permet de corriger en une fois.

**Limites.** Valider 5 000 lignes demande de vérifier l'unicité entre elles et avec la base. Cela justifie un traitement par lots plutôt qu'une validation ligne par ligne (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois familles de règles de validation.
2. **Compréhension.** Pourquoi la validation côté serveur est-elle indispensable ?
3. **Compréhension.** Quelle est la différence entre validation et assainissement ?
4. **Pourquoi.** Pourquoi retourne-t-on toutes les erreurs de validation d'un coup ?
5. **Raisonnement pratique.** Une règle « la date d'inspection est obligatoire » est ajoutée alors que 2 000 aéronefs n'en ont pas. Que doit faire la plateforme ?

#### Réponses

1. Par exemple : type et format, valeur (bornes, énumération), obligation, inter-champs, inter-ressources, métier.
2. Parce que le client peut être contourné : un appel direct à l'API ne passe pas par l'interface. Seul le serveur garantit l'application des règles.
3. La validation accepte ou refuse une donnée. L'assainissement la transforme pour la rendre sûre. Ce sont deux opérations distinctes.
4. Pour que l'utilisateur corrige tout en une seule fois, au lieu de découvrir les erreurs une par une.
5. Signaler les 2 000 aéronefs non conformes, proposer une correction par lot, et décider si la règle s'applique immédiatement ou seulement à la prochaine modification.

## 2.17 Schéma dynamique

### 1. Comprendre simplement

Un **schéma dynamique** (*dynamic schema*) est un schéma que l'on peut **modifier pendant que le système fonctionne**, par une simple action de configuration, sans redéployer le logiciel ni reconstruire la base de données.

**Pourquoi cela existe.** Dans une plateforme générique, ce sont les clients qui définissent leurs types et leurs champs. Attendre une nouvelle version du produit à chaque besoin est inacceptable.

**Problème résolu.** Permettre à un administrateur d'adapter le modèle de données à son métier en quelques secondes, de façon sûre.

**Modèle mental.** Un tableur. On ajoute une colonne à tout moment, sans arrêter le fichier ni le réécrire.

**Où l'analogie s'arrête.** Dans un tableur, personne d'autre ne dépend de la colonne. Dans une plateforme, des API, des règles, des vues et des intégrations dépendent du schéma : chaque changement doit être maîtrisé.

**Exemple.** Un administrateur ajoute le champ « Niveau de bruit » au type *Aéronef*. Il est disponible dans les formulaires, l'API et les filtres dès l'enregistrement du changement.

**Les composants.**

1. un **stockage des définitions** (métadonnées) ;
2. un **moteur** qui lit les définitions à l'exécution ;
3. un **stockage des valeurs** capable d'accueillir des champs inconnus à l'avance ;
4. des **mécanismes de contrôle** (validation, droits, impact).

**Objectif d'apprentissage :** vous pouvez expliquer ce qui change quand le schéma devient une donnée, et citer deux risques d'un schéma modifiable à chaud.

### 2. Connaissances essentielles

#### Définition

Un **schéma dynamique** est un schéma dont les définitions de types, de champs et de règles sont stockées comme des données, interprétées par le moteur à l'exécution, et modifiables sans changement de code ni migration physique de la base.

#### Idées fondamentales

1. **Le schéma est une donnée.** Il est stocké, interrogé et versionné comme le reste.
2. **Le moteur interprète.** Il charge la définition courante pour chaque tenant et chaque type.
3. **Le stockage physique est stable.** Les champs personnalisés vivent dans des structures génériques (voir [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés)).
4. **« Sans schéma » n'existe pas.** Le schéma se déplace : de la base vers le moteur.
5. **La souplesse se paie.** Typage, performance et intégrité deviennent des responsabilités du moteur.
6. **Les changements sont publiés, pas appliqués à la volée.** Un brouillon, une validation, puis une publication.

#### Vocabulaire essentiel

- **Interprétation** (*interpretation*) : lecture de la définition à chaque opération.
- **Brouillon** et **publication** (*draft*, *publish*) : étapes avant qu'un changement soit actif.
- **Cache de schéma** : copie en mémoire des définitions, pour la performance.
- **Stockage hybride** : colonnes fixes pour les champs communs, structure souple pour les autres.
- **Promotion** : passage d'un champ personnalisé à une colonne dédiée.
- **Dérive** (*drift*) : écart entre les données stockées et la définition courante.

#### Relations de cause à effet

- Le schéma est lu à chaque requête depuis la base. Le plan de contrôle devient un goulot d'étranglement : on met en cache.
- Un type de champ change (texte vers nombre). Les valeurs existantes ne sont plus conformes, et doivent être converties ou rejetées.
- Trop de champs sont créés par un tenant. Les formulaires, les requêtes et les index souffrent.

#### Idées reçues

- **« Un schéma dynamique est sans structure. »** Non. Il est plus structuré que jamais, mais de façon explicite et pilotée par des données.
- **« Dynamique signifie instantané et sans risque. »** Non. Chaque changement doit être validé et son impact mesuré.
- **« Il remplace entièrement le modèle relationnel. »** Non. En pratique, on combine un noyau relationnel stable et une extension souple.

#### Principe clé

Rendre le schéma modifiable à l'exécution déplace la responsabilité de la structure de la base vers le moteur ; il faut alors y mettre les garde-fous que la base fournissait.

#### Si vous ne retenez que trois choses

1. Un schéma dynamique est stocké comme donnée et interprété à l'exécution.
2. Le moteur doit assurer le typage, la validation et la performance que la base assurait.
3. Chaque modification passe par un cycle contrôlé : brouillon, validation, publication.

### 3. Explication technique détaillée

#### Cycle de vie d'un changement de schéma

```text
Brouillon ──► Validation ──► Analyse d'impact ──► Publication ──► Propagation
 (édition)    (cohérence)    (qui dépend ?)       (nouvelle         (caches,
                                                  version)          instances)
```

**Comment cela fonctionne.**

1. L'administrateur modifie un brouillon, sans effet sur le fonctionnement courant.
2. Le moteur vérifie la cohérence : noms uniques, types valides, références existantes.
3. Il calcule l'impact : ressources concernées, vues, règles et workflows qui utilisent le champ.
4. La publication crée une nouvelle version, et les caches sont invalidés.

#### Un stockage hybride

```sql
CREATE TABLE resource (
  tenant_id  uuid NOT NULL,
  id         uuid NOT NULL,
  type_id    uuid NOT NULL,
  version    integer NOT NULL,
  status     text,                 -- champ commun, promu en colonne
  properties jsonb NOT NULL,       -- champs propres au type, définis dynamiquement
  PRIMARY KEY (tenant_id, id)
);
```

**Pourquoi.** Les champs communs et très utilisés (statut) ont une colonne dédiée, indexable et typée. Les autres vivent dans le document, validé par le moteur.

#### Le moteur à l'exécution

1. Il récupère la **définition courante** du type pour le tenant (depuis un cache).
2. Il **valide** la requête contre cette définition.
3. Il **écrit** dans la structure de stockage.
4. Il **enregistre** la version de schéma utilisée.

**Cas du type de champ qui change.** Un élargissement (entier vers décimal) est sûr. Un rétrécissement (décimal vers entier) peut perdre de l'information et nécessite une conversion contrôlée.

#### Comparaison

| Critère | Schéma statique | Schéma dynamique |
|---|---|---|
| Changement | Migration et déploiement | Configuration, effet immédiat |
| Typage | Par la base | Par le moteur |
| Performance | Maximale, prévisible | Dépend du moteur et des index |
| Outils tiers (BI, requêtes directes) | Natifs | Difficiles, il faut des vues |
| Risque | Lourdeur de l'évolution | Dérive, complexité du moteur |

**Modes de défaillance.**

- **Dérive** : des données ne respectent plus la définition courante.
- **Cache incohérent** : certains serveurs appliquent une ancienne version.
- **Explosion de champs** : un tenant crée des centaines de champs et dégrade les formulaires et les index.
- **Dépendances cachées** : un champ supprimé est utilisé par une règle ou une vue.

**Limites.** Un schéma dynamique convient aux données de gestion. Pour des données à très haut volume ou à très faible latence, on préfère un schéma statique et optimisé.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.5 Champs et objets personnalisés](#25-champs-et-objets-personnalisés) | Les champs et objets personnalisés sont rendus possibles par un schéma dynamique |
| [2.4 Métadonnées](#24-métadonnées) | Le schéma dynamique repose sur des métadonnées éditables |
| [2.18 Évolution et versionnement de schéma](#218-évolution-et-versionnement-de-schéma) | L'évolution du schéma en gère les changements successifs |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'architecture pilotée par les métadonnées en généralise le principe |
| [8.2 Administration du modèle de données](08-admin-control-plane.md#82-administration-du-modèle-de-données) | L'administration est l'interface qui édite le schéma |

### 5. Application pratique

**Situation initiale.** Un administrateur de la compagnie veut ajouter un champ à tous les aéronefs, un vendredi à 17 h.

**Problème.** Il ne veut ni attendre le prochain déploiement ni perturber les techniciens connectés.

**Application du concept.** Le champ est créé comme brouillon, validé, puis publié.

**Déroulé.**

1. L'administrateur crée le champ dans un brouillon et choisit son type.
2. Le moteur affiche l'impact : 1 240 aéronefs, 2 vues, aucune règle.
3. L'administrateur publie. Une nouvelle version du schéma est créée.
4. Les serveurs rechargent la définition. Les formulaires affichent le champ.

**Résultat.** Le changement est actif en quelques secondes, sans déploiement.

**Limites.** Les intégrations externes qui lisent les aéronefs doivent tolérer un champ supplémentaire. Cela suppose des contrats d'API conçus pour l'ajout de champs (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui distingue un schéma dynamique d'un schéma statique ?
2. **Compréhension.** Pourquoi met-on les définitions de schéma en cache ?
3. **Compréhension.** Que signifie « dérive » ?
4. **Pourquoi.** Pourquoi les changements de schéma passent-ils par un cycle brouillon, validation et publication ?
5. **Raisonnement pratique.** Un administrateur change un champ texte en champ numérique alors que des valeurs contiennent des lettres. Que doit faire le moteur ?

#### Réponses

1. Le schéma dynamique est une donnée interprétée à l'exécution et modifiable sans déploiement ni migration physique ; le schéma statique est figé dans la structure de la base et change par migration.
2. Pour éviter de lire la définition en base à chaque requête, ce qui ralentirait et surchargerait le plan de contrôle.
3. L'écart entre les données stockées et la définition courante du schéma.
4. Pour détecter les incohérences et mesurer l'impact avant que le changement n'affecte les utilisateurs, et pouvoir revenir en arrière.
5. Détecter les valeurs non convertibles avant publication, les signaler, et soit exiger une correction, soit proposer une conversion contrôlée, sans rendre le changement actif tant que le résultat est incohérent.

## 2.18 Évolution et versionnement de schéma

### 1. Comprendre simplement

L'**évolution de schéma** (*schema evolution*) est la manière de modifier la structure des données au fil du temps, alors que des données, des applications et des intégrations existent déjà. Le **versionnement de schéma** (*schema versioning*) consiste à identifier chaque état du schéma par un numéro de version, pour savoir lequel s'appliquait à une donnée et pouvoir revenir en arrière.

**Pourquoi cela existe.** Un métier change : de nouveaux champs apparaissent, d'autres disparaissent, les règles se resserrent. Mais les données déjà saisies, elles, ne changent pas toutes seules.

**Problème résolu.** Changer le modèle sans casser les données existantes ni les systèmes qui en dépendent.

**Modèle mental.** La rénovation d'un immeuble habité. On ne peut pas démolir et reconstruire : on change étage par étage, en maintenant l'immeuble utilisable.

**Où l'analogie s'arrête.** Un immeuble n'a qu'un état à la fois. Un schéma versionné fait coexister plusieurs états : des données de versions différentes, des clients en retard.

**Exemple.** Le champ `reg` est renommé en `registration`. Les intégrations externes, les rapports et les règles qui utilisent `reg` doivent continuer à fonctionner pendant une transition.

**Les composants.**

1. une **classification des changements** (sûrs ou cassants) ;
2. une **stratégie de transition** (changement parallèle, migration) ;
3. des **versions** de schéma conservées ;
4. une **analyse d'impact**.

**Objectif d'apprentissage :** vous pouvez distinguer un changement compatible d'un changement cassant, et décrire la méthode « étendre puis contracter ».

### 2. Connaissances essentielles

#### Définition

- **Évolution de schéma** : ensemble des changements successifs de la structure des données et de leurs règles, et des techniques pour les appliquer sans rupture.
- **Versionnement de schéma** : attribution d'un identifiant de version à chaque état publié du schéma, et conservation de cet historique.

#### Idées fondamentales

1. **Tous les changements ne se valent pas.** Ajouter un champ facultatif est sûr ; supprimer ou renommer ne l'est pas.
2. **La compatibilité a deux sens.** Rétrocompatible : le nouveau schéma lit les anciennes données. Compatible vers l'avant : l'ancien code lit les nouvelles données.
3. **On change par étapes.** Étendre, migrer, basculer, contracter.
4. **Chaque version est conservée.** Pour interpréter une donnée ancienne et auditer.
5. **L'impact se mesure avant de publier.** Ressources, vues, règles et intégrations concernées.

#### Vocabulaire essentiel

- **Changement cassant** (*breaking change*) : modification qui rend invalide du code ou des données existants.
- **Rétrocompatibilité** (*backward compatibility*) : le nouveau schéma accepte les anciennes données.
- **Compatibilité vers l'avant** (*forward compatibility*) : l'ancien code tolère des données du nouveau schéma.
- **Migration** (*migration*) : transformation des données d'un schéma vers un autre.
- **Remplissage rétroactif** (*backfill*) : calcul d'une valeur pour les ressources existantes.
- **Étendre puis contracter** (*expand and contract*) : méthode de changement en deux temps, avec une période de coexistence.
- **Dépréciation** (*deprecation*) : annonce d'un retrait futur.

#### Relations de cause à effet

- Un champ est supprimé d'un coup. Les intégrations qui l'utilisent échouent, et les données sont perdues.
- Un nouveau champ obligatoire est ajouté sans valeur par défaut. Les ressources existantes deviennent invalides.
- Les versions de schéma ne sont pas conservées. On ne sait plus interpréter les données anciennes, ni reconstituer la situation à une date passée.

#### Idées reçues

- **« Renommer un champ est un changement mineur. »** Non. C'est un changement cassant : il supprime l'ancien nom et en crée un nouveau.
- **« Une migration est une opération ponctuelle. »** Non. Elle s'étale souvent sur une période de coexistence, parfois de plusieurs semaines.
- **« On peut toujours revenir en arrière. »** Pas toujours. Si des données ont été supprimées ou transformées avec perte, le retour est impossible.

#### Principe clé

Ne faites jamais en un seul pas ce qui peut se faire en deux : ajoutez le nouveau, migrez, basculez, puis seulement retirez l'ancien.

#### Si vous ne retenez que trois choses

1. Les changements de schéma se classent en compatibles et cassants.
2. La méthode « étendre puis contracter » évite les ruptures.
3. Chaque version de schéma est conservée, et l'impact est mesuré avant publication.

### 3. Explication technique détaillée

#### Classification des changements

| Changement | Compatible ? | Précaution |
|---|---|---|
| Ajouter un champ facultatif | Oui | Les lecteurs doivent tolérer les champs inconnus |
| Ajouter un champ obligatoire avec valeur par défaut | Oui, avec remplissage | Remplir les ressources existantes |
| Ajouter une valeur à une énumération | Oui pour l'écriture | Les lecteurs doivent tolérer une valeur inconnue |
| Élargir un type (entier vers décimal) | Oui | Vérifier les consommateurs |
| Renommer un champ | Non | Période de coexistence avec alias |
| Retirer un champ | Non | Dépréciation, puis retrait |
| Rétrécir un type ou une contrainte | Non | Vérifier les données existantes |
| Retirer une valeur d'énumération | Non | Migrer les ressources qui l'utilisent |

#### La méthode « étendre puis contracter »

Exemple : renommer `reg` en `registration`.

1. **Étendre.** Ajouter `registration`. Écrire dans les deux champs à chaque modification.
2. **Migrer.** Remplir `registration` pour toutes les ressources existantes.
3. **Basculer.** Faire lire `registration` par tous les consommateurs, un par un.
4. **Contracter.** Quand plus personne n'utilise `reg`, le retirer.

```text
        Étendre              Migrer               Basculer             Contracter
   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
   │ reg          │     │ reg          │     │ reg (lu par  │     │ registration │
   │ registration │ ──► │ registration │ ──► │ personne)    │ ──► │              │
   │ (vide)       │     │ (rempli)     │     │ registration │     │              │
   └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

#### Les versions de schéma

Chaque publication crée une nouvelle version. Chaque ressource peut porter le numéro de la version avec laquelle elle a été écrite.

| Stratégie | Principe | Avantage | Inconvénient |
|---|---|---|---|
| Migration immédiate | Toutes les ressources sont converties à la publication | État homogène | Opération longue, risque de verrouillage |
| Migration paresseuse | Conversion à la lecture ou à l'écriture suivante | Pas d'interruption | Plusieurs versions coexistent longtemps |
| Aucune migration | Le code lit plusieurs versions | Simple à publier | Complexité de lecture permanente |

#### Analyse d'impact

Avant publication, le moteur recense :

- le nombre de ressources concernées ;
- les vues, filtres, règles et workflows qui référencent le champ ;
- les clés d'API et intégrations qui l'ont lu récemment ;
- les valeurs existantes incompatibles avec le nouveau type ou la nouvelle contrainte.

**Contre-exemple.** Supprimer le champ `status` d'un type utilisé par un workflow : le workflow échoue à sa prochaine exécution, sans qu'aucun avertissement n'ait été donné.

**Limites.** L'analyse d'impact ne voit que ce que la plateforme connaît. Les intégrations externes qui n'ont pas déclaré leurs usages restent des dépendances invisibles.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.17 Schéma dynamique](#217-schéma-dynamique) | Le schéma dynamique multiplie les changements à gérer |
| [2.16 Validation des données](#216-validation-des-données) | Les règles modifiées s'appliquent aux nouvelles écritures ; les données existantes sont à traiter |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement de la configuration généralise celui du schéma |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API protège les clients externes des changements cassants |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | L'interface doit rendre l'impact d'un changement visible |

### 5. Application pratique

**Situation initiale.** L'administrateur veut remplacer le champ texte libre `status` par une énumération de trois valeurs, alors que 3 000 aéronefs ont des valeurs variées.

**Problème.** Restreindre brutalement les valeurs rend invalides une partie des ressources, et casse des intégrations.

**Application du concept.** Changement par étapes avec analyse d'impact et migration contrôlée.

**Déroulé.**

1. Le moteur compte les valeurs distinctes : « actif », « Actif », « en service », « retired »…
2. L'administrateur définit une table de correspondance vers les trois valeurs cibles.
3. Une migration paresseuse convertit chaque ressource à sa prochaine modification, et un traitement de fond convertit le reste.
4. Quand toutes les ressources sont conformes, la contrainte d'énumération est activée.

**Résultat.** Aucune ressource n'est devenue invalide pendant la transition, et aucune intégration n'a cassé.

**Limites.** Pendant la transition, les lecteurs doivent accepter les deux formes. Une communication aux intégrateurs est nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez deux changements de schéma compatibles et deux changements cassants.
2. **Compréhension.** Quelles sont les étapes de la méthode « étendre puis contracter » ?
3. **Compréhension.** Que signifie rétrocompatible ?
4. **Pourquoi.** Pourquoi conserve-t-on toutes les versions de schéma ?
5. **Raisonnement pratique.** Un nouveau champ obligatoire est ajouté sans valeur par défaut. Quelle conséquence a-t-il sur les ressources existantes ?

#### Réponses

1. Compatibles : ajouter un champ facultatif, élargir un type. Cassants : renommer un champ, retirer un champ ou rétrécir un type.
2. Étendre (ajouter le nouveau en parallèle), migrer (remplir), basculer (changer les consommateurs), contracter (retirer l'ancien).
3. Que le nouveau schéma peut lire les données écrites selon l'ancien schéma.
4. Pour interpréter correctement les données anciennes, reconstituer la situation à une date passée et permettre l'audit et le retour arrière.
5. Les ressources existantes n'ont pas de valeur pour ce champ et deviennent invalides dès qu'elles sont modifiées ; il faut une valeur par défaut ou un remplissage rétroactif.

## 2.19 Architecture pilotée par les métadonnées et par les modèles

### 1. Comprendre simplement

Dans une **architecture pilotée par les métadonnées** (*metadata-driven architecture*), le comportement de l'application n'est pas écrit dans le code : il est **décrit par des données** que le moteur lit et interprète à l'exécution. Dans une **architecture pilotée par les modèles** (*model-driven architecture*), on part d'un modèle abstrait du système, à partir duquel on **génère** ou on pilote le logiciel.

**Pourquoi cela existe.** Le code spécifique à un métier coûte cher à écrire, à tester et à faire évoluer. Si le métier se décrit par des données, un même moteur sert tous les métiers, et un administrateur peut les modifier.

**Problème résolu.** Passer d'une application spécifique à une plateforme configurable.

**Modèle mental.** Un lecteur de musique et un fichier de partition. Le même lecteur (le moteur) joue n'importe quelle partition (la description). Changer de morceau n'exige pas de changer de lecteur.

**Où l'analogie s'arrête.** Une partition ne fait que décrire. Les métadonnées d'une plateforme décrivent aussi des règles, des droits et des processus, et leurs erreurs ont des conséquences sur les données.

**Exemple.** Au lieu de programmer une classe *Aéronef* avec ses champs, ses droits et ses états, on décrit un type de ressource en données. Le moteur le lit et sait créer, valider, afficher et protéger des aéronefs.

```json
{
  "name": "aircraft",
  "label": "Aéronef",
  "fields": [
    { "api_name": "registration", "data_type": "string", "required": true, "unique": true },
    { "api_name": "model", "data_type": "string", "required": true },
    { "api_name": "status", "data_type": "enum",
      "values": ["active", "in_inspection", "retired"] }
  ],
  "relations": [
    { "api_name": "base", "target_type": "location", "cardinality": "many_to_one" }
  ],
  "permissions": [
    { "role": "technician", "actions": ["read"] },
    { "role": "planner", "actions": ["read", "update"] }
  ],
  "workflows": ["aircraft_lifecycle"]
}
```

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi décrire le métier par des données change la nature du logiciel, et citer deux coûts de cette approche.

### 2. Connaissances essentielles

#### Définition

- **Architecture pilotée par les métadonnées** : style d'architecture où le comportement du système est déterminé à l'exécution par des métadonnées interprétées par un moteur générique, plutôt que par du code propre à chaque cas.
- **Architecture pilotée par les modèles** (*model-driven architecture*) : approche où un modèle abstrait du système sert de source pour produire ou piloter l'implémentation, souvent par génération de code ou de structures. Le terme est aussi celui d'une démarche normalisée par l'OMG.

#### Idées fondamentales

1. **Le code est générique, la donnée est spécifique.** Le moteur ne connaît pas le métier.
2. **La frontière code et configuration est un choix de conception.** Ce qui est configurable s'exprime en métadonnées (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)).
3. **Interpréter ou générer.** Un moteur interprète les métadonnées à l'exécution ; un générateur les transforme en code avant l'exécution.
4. **Un seul moteur, de nombreux métiers.** L'effort est mutualisé.
5. **Le pouvoir d'expression est borné.** Plus on veut exprimer, plus le langage de description devient complexe.

#### Vocabulaire essentiel

- **Moteur** (*engine*) : composant générique qui interprète les métadonnées.
- **Interprétation** et **génération** : deux façons de passer d'une description à un comportement.
- **Modèle** (*model*) : représentation abstraite du système ou du domaine.
- **Méta-modèle** (*metamodel*) : modèle qui définit les éléments qu'un modèle peut contenir.
- **Effet de plateforme interne** (*inner-platform effect*) : tendance d'un système configurable à reconstruire un langage de programmation ou une base de données au sein de lui-même, en moins bien.
- **Configuration au lieu de code** (*configuration over code*) : principe de privilégier la description à la programmation.

#### Relations de cause à effet

- Le comportement est décrit par des données. Un administrateur peut le changer sans développeur, mais une erreur de description a un effet immédiat.
- Le langage de description grandit. Il devient un langage de programmation à part entière, plus difficile à tester et à déboguer que le code.
- Le moteur interprète toujours. Les performances dépendent de sa conception, et les cas extrêmes doivent être traités par des extensions de code.

#### Idées reçues

- **« Piloté par les métadonnées signifie sans code. »** Non. Le moteur est du code, et souvent un code très exigeant.
- **« Tout doit être configurable. »** Non. Une configuration trop riche est plus complexe que du code et plus difficile à gouverner.
- **« Pilotée par les modèles désigne la même chose que pilotée par les métadonnées. »** Les deux idées sont proches, mais la première insiste sur la génération depuis un modèle, la seconde sur l'interprétation à l'exécution.

#### Principe clé

Codez le moteur une fois, décrivez les métiers en données, et gardez dans le code ce qui est difficile ou critique à exprimer en configuration.

#### Si vous ne retenez que trois choses

1. Le comportement est décrit par des données que le moteur interprète à l'exécution.
2. Cette approche transforme une application spécifique en plateforme configurable.
3. Elle a un coût : un moteur complexe, des erreurs de configuration à gouverner, et le risque de recréer un langage de programmation.

### 3. Explication technique détaillée

#### Du code spécifique au moteur générique

```text
Approche spécifique                    Approche pilotée par les métadonnées
───────────────────                    ────────────────────────────────────
class Aircraft { ... }                 ResourceType { name: "aircraft", ... }
class Technician { ... }               ResourceType { name: "technician", ... }
écran Aéronefs, écran Techniciens      moteur de formulaires générique
règles codées en dur                   règles décrites en données
```

**Ce qui change.** Dans l'approche spécifique, ajouter un métier demande de programmer. Dans l'approche pilotée par les métadonnées, il suffit de décrire.

#### Ce que le moteur interprète

| Métadonnée | Comportement obtenu |
|---|---|
| Champs et types | Validation, formulaires, API |
| Relations | Navigation, intégrité, jointures |
| Permissions | Contrôle d'accès, filtrage |
| États et transitions | Workflow du cycle de vie (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) |
| Règles | Calculs, validations métier (voir [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)) |
| Vues | Listes, filtres, tableaux de bord (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)) |

#### Interpréter ou générer

| Critère | Interprétation | Génération |
|---|---|---|
| Moment | À l'exécution | Avant l'exécution |
| Souplesse | Changement immédiat | Régénération et déploiement |
| Performance | Dépend du moteur | Code spécialisé, souvent plus rapide |
| Débogage | Au niveau du moteur | Code généré à inspecter |
| Usage typique | Plateformes configurables | Outils de conception de systèmes |

La démarche normalisée par l'OMG (*Model Driven Architecture*) distingue un modèle indépendant de la technique et un modèle spécifique à une plateforme, dont le code est dérivé. Une plateforme SaaS configurable se situe, elle, plutôt du côté de l'interprétation à l'exécution.

#### Un exemple documenté

Salesforce a décrit publiquement, dans un article présenté à SIGMOD en 2009, une architecture où les objets personnalisés des clients sont décrits par des métadonnées, stockés dans des structures génériques, et interprétés par un moteur partagé. Cet exemple illustre l'idée, sans en être la seule réalisation possible.

#### Le coût de l'approche

- **Un moteur complexe** : il doit tout gérer (types, droits, règles, performances).
- **Un langage de description** : plus il est expressif, plus il ressemble à un langage de programmation.
- **Une gouvernance nécessaire** : les erreurs de configuration ont des effets directs (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).
- **Des cas extrêmes** : ils exigent des points d'extension en code (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

**Contre-exemple.** Exprimer en métadonnées une logique entièrement algorithmique (boucles, conditions imbriquées sur dix niveaux) revient à écrire un programme dans un langage mal outillé. Il vaut mieux le coder, et exposer une action configurable.

**Limites.** Le point d'équilibre entre configuration et code est propre à chaque produit. Il se règle par l'usage : on externalise ce qui varie vraiment d'un client à l'autre, et on garde en code ce qui est stable, critique ou algorithmique.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.4 Métadonnées](#24-métadonnées) | Les métadonnées sont la matière de cette architecture |
| [2.17 Schéma dynamique](#217-schéma-dynamique) | Le schéma dynamique en est la première application |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | La vue transversale montre son effet sur tous les modules |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Elle oblige à décider ce qui est codé et ce qui est configuré |
| [13.3 Déclaratif versus impératif](13-concepts-transversaux.md#133-déclaratif-versus-impératif) | Les métadonnées s'expriment de façon déclarative |
| [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique) | Le Resource Engine est le moteur qui interprète ces métadonnées |

### 5. Application pratique

**Situation initiale.** Après la compagnie aérienne, l'usine veut gérer ses machines et ses ordres de fabrication sur la plateforme.

**Problème.** L'équipe de développement ne veut pas écrire un second module spécifique, ni maintenir deux bases de code métier.

**Application du concept.** L'administrateur de l'usine décrit ses types en métadonnées, avec ses champs, ses relations, ses rôles et ses états.

**Déroulé.**

1. Il crée les types *Machine* et *Ordre de fabrication* dans l'interface d'administration.
2. Il définit leurs champs, leurs relations et leurs permissions.
3. Il associe un workflow d'états à l'ordre de fabrication.
4. Le moteur génère formulaires, listes, API et contrôles à partir de ces descriptions.

**Résultat.** L'usine utilise l'application en quelques jours, sans développement spécifique.

**Limites.** Un besoin particulier, par exemple un calcul d'ordonnancement spécifique, dépasse la configuration. Il passe par une extension développée séparément (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une architecture pilotée par les métadonnées ?
2. **Compréhension.** Quelle différence y a-t-il entre interpréter et générer ?
3. **Compréhension.** Qu'est-ce que l'effet de plateforme interne ?
4. **Pourquoi.** Pourquoi cette architecture permet-elle de passer d'une application à une plateforme ?
5. **Raisonnement pratique.** Un client veut exprimer un calcul d'ordonnancement très complexe dans les règles configurables. Que proposez-vous ?

#### Réponses

1. Une architecture où le comportement est décrit par des données que le moteur interprète à l'exécution, plutôt que codé pour chaque métier.
2. Interpréter, c'est lire la description à chaque exécution. Générer, c'est la transformer en code avant l'exécution.
3. La tendance d'un système configurable à reconstruire, en moins bien, un langage de programmation ou une base de données à l'intérieur de lui-même.
4. Parce que le métier devient une donnée : un même moteur sert tous les métiers, et les clients les définissent eux-mêmes sans développement.
5. Le coder comme une extension ou une action personnalisée, exposée comme brique configurable, plutôt que de le décrire dans un langage de règles qui deviendrait ingérable.
