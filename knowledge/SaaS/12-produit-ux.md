# Module 12 — Produit et UX pour les systèmes complexes

> **Question directrice.** Comment permettre à des humains de comprendre, de configurer et d'exploiter un système complexe sans le casser ?

## Présentation du module

**Objectif.** Les modules précédents construisent un moteur : des données, des règles, des droits, des événements. Ce module traite de ce qui le rend **utilisable**. Le plan l'ajoute explicitement, parce que c'est souvent le grand oublié : on ne construit pas seulement un moteur générique, on construit une **interface qui permet à des personnes de comprendre et de configurer un système complexe**. Un moteur puissant dont personne ne comprend les options est inutilisable. Pire, il est dangereux : une erreur de configuration agit à grande échelle.

**Prérequis.** Les vues et formulaires configurables ([8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)), les permissions ([4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) et [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), les états et les règles (module 6), l'audit et le retour arrière (module 9).

**Ordre retenu.** Quatre groupes, du cadre général aux principes de sûreté.

```text
Structurer    architecture de l'information et navigation ─ design systems
              UX d'administration ─ divulgation progressive et configuration contextuelle
Composants    formulaires et assistants ─ tables, filtres, recherche et vues ─ tableaux de bord
              actions en masse ─ palette de commandes ─ notifications
États         états vides et états d'erreur ─ interface sensible aux permissions et aux rôles
Principes     découvrabilité ─ explicabilité ─ conscience de l'impact ─ configuration sûre
```

Les quatre derniers concepts sont ceux que le plan signale comme particulièrement importants. Chacun répond à une question que se pose l'utilisateur d'un système configurable.

| Principe | Question de l'utilisateur |
|---|---|
| Découvrabilité | Comment découvrir ce que le système sait faire ? |
| Explicabilité | Pourquoi cette action est-elle impossible ? |
| Conscience de l'impact | Si je change cette règle, qu'est-ce que cela va affecter ? |
| Configuration sûre | Comment empêcher l'administrateur de casser le système ? |

Les entrées de la deuxième partie du module (composants et états) sont des **applications** de ces quatre principes : un bon formulaire ou une bonne table sont ceux qui les respectent.

## Sommaire du module

- [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation)
- [12.2 Design systems](#122-design-systems)
- [12.3 UX d'administration](#123-ux-dadministration)
- [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle)
- [12.5 Formulaires et assistants](#125-formulaires-et-assistants)
- [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues)
- [12.7 Tableaux de bord](#127-tableaux-de-bord)
- [12.8 Actions en masse](#128-actions-en-masse)
- [12.9 Palette de commandes](#129-palette-de-commandes)
- [12.10 Notifications](#1210-notifications)
- [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur)
- [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)
- [12.13 Découvrabilité](#1213-découvrabilité)
- [12.14 Explicabilité](#1214-explicabilité)
- [12.15 Conscience de l'impact](#1215-conscience-de-limpact)
- [12.16 Configuration sûre](#1216-configuration-sûre)

## 12.1 Architecture de l'information et navigation

### 1. Comprendre simplement

L'**architecture de l'information** (*information architecture*) consiste à **organiser, nommer et relier les contenus et les fonctions d'un système** pour que les personnes s'y retrouvent. La **navigation** (*navigation*) est l'ensemble des moyens concrets (menus, fil d'Ariane, onglets, liens, recherche) qui permettent de se déplacer dans cette organisation.

**Pourquoi cela existe.** Une plateforme configurable contient des centaines d'objets, de réglages et d'écrans, et ce nombre augmente à chaque personnalisation. Sans structure, les utilisateurs ne savent pas où chercher. Les administrateurs créent alors des doublons, parce qu'ils ne trouvent pas ce qui existe déjà.

**Problème résolu.** Permettre à chacun de trouver ce dont il a besoin, de savoir où il se trouve et de revenir en arrière, même quand le système grossit et change.

**Modèle mental.** Le plan d'un grand bâtiment. L'architecture de l'information est le plan : les étages, les ailes, les noms des salles. La navigation est la signalétique : panneaux, flèches, plan à l'entrée.

**Où l'analogie s'arrête.** Un bâtiment est le même pour tous et ne change pas chaque semaine. Une plateforme change selon le rôle de la personne, le tenant et la configuration : un administrateur peut ajouter de nouvelles « pièces » (des types d'objets) à tout moment.

**Exemple.** La console d'un tenant aérien est organisée en sections : « Flotte », « Maintenance », « Qualité », « Rapports », « Administration ». L'administrateur crée le type d'objet « Constat ». Où apparaît-il dans le menu ? Une règle d'architecture le décide : sous la catégorie déclarée par le type, ici « Qualité ». Sans règle, le nouveau type atterrirait en fin de menu, à un endroit arbitraire.

**Les composants.**

1. le **modèle des objets et des tâches** : ce que les personnes manipulent et ce qu'elles veulent faire ;
2. les **systèmes d'organisation** : hiérarchie, regroupements, facettes ;
3. les **systèmes de désignation** : libellés et vocabulaire ;
4. les **systèmes de navigation** : global, local, contextuel ;
5. le **système de recherche**.

**Objectif d'apprentissage :** vous pouvez expliquer comment on structure une interface à partir des objets et des tâches, distinguer les formes de navigation, et dire pourquoi une plateforme configurable doit prévoir où placer ce que les administrateurs ajoutent.

### 2. Connaissances essentielles

#### Définition

- **Architecture de l'information** : discipline qui organise, désigne et relie les contenus et les fonctions d'un système, pour que ses utilisateurs trouvent et comprennent ce dont ils ont besoin.
- **Navigation** : ensemble des mécanismes qui permettent à un utilisateur de se déplacer dans un système, de savoir où il se trouve et de revenir en arrière.

#### Idées fondamentales

1. **On structure selon les modèles mentaux des utilisateurs.** Pas selon l'organigramme de l'équipe de développement, ni selon le schéma de la base de données.
2. **Les objets d'abord, les écrans ensuite.** On identifie les objets du domaine et leurs relations, puis on en déduit les écrans et la navigation.
3. **Un même contenu a plusieurs chemins.** Menu, recherche, liens contextuels, éléments récents, favoris : les personnes ne cherchent pas toutes de la même façon.
4. **L'utilisateur sait toujours où il est, ce qu'il peut faire et comment revenir.**
5. **Les libellés sont du vocabulaire métier, et ils sont stables.** Le même mot désigne la même chose partout (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).
6. **La structure absorbe l'ajout.** De nouveaux types d'objets ou de nouveaux modules ne demandent pas de refondre le menu.
7. **On mesure et on teste.** Tri par cartes, test d'arborescence, analyse des recherches sans résultat.

#### Vocabulaire essentiel

- **Taxonomie** (*taxonomy*) : classification hiérarchique des objets et des catégories.
- **Facette** (*facet*) : critère indépendant de classement (statut, base, type) qui permet de filtrer par plusieurs axes.
- **Fil d'Ariane** (*breadcrumb*) : suite de liens qui montre la position dans la hiérarchie.
- **Navigation globale, locale, contextuelle** : respectivement, vers les grandes sections, à l'intérieur d'une section, vers les objets liés.
- **Repérage** (*wayfinding*) : capacité de savoir où l'on est et comment aller où l'on veut.
- **Tri par cartes** (*card sorting*) : méthode où des utilisateurs regroupent et nomment des éléments.
- **Test d'arborescence** (*tree testing*) : méthode qui vérifie si les utilisateurs trouvent des éléments dans une hiérarchie sans interface.
- **Sélecteur de tenant** (*tenant switcher*) : contrôle qui permet de changer de tenant ou d'organisation.

#### Relations de cause à effet

- La structure reproduit l'organisation interne de l'éditeur. Les utilisateurs ne retrouvent pas leurs repères, car leur modèle mental est différent.
- Les libellés viennent du modèle technique (`resource_type_definitions`). Les utilisateurs ne comprennent pas les entrées, et le support reçoit des questions.
- Chaque nouveauté ajoute une entrée au menu. Le menu s'allonge jusqu'à devenir illisible.
- Le tenant et l'environnement ne sont pas visibles. Des personnes agissent sur la production en croyant travailler sur un bac à sable.

#### Idées reçues

- **« Il faut trois clics au maximum. »** Cette règle n'est pas étayée. Ce qui compte, c'est que chaque étape soit évidente et confirme que l'on va dans la bonne direction.
- **« La recherche remplace la navigation. »** La recherche aide quand on connaît le nom de ce que l'on cherche. La navigation montre ce qui existe, et sert donc à découvrir.
- **« Le menu reflète les tables de la base. »** Les tables sont un détail d'implémentation. L'utilisateur pense en objets métier et en tâches.

#### Principe clé

On organise l'interface selon la façon dont les utilisateurs pensent leur travail, avec leur vocabulaire, plusieurs chemins d'accès et un repérage constant.

#### Si vous ne retenez que trois choses

1. On part des objets et des tâches des utilisateurs, pas du schéma technique.
2. Une plateforme configurable doit prévoir où placer automatiquement ce que les administrateurs ajoutent.
3. L'utilisateur voit toujours son contexte : où il est, dans quel tenant et dans quel environnement.

### 3. Explication technique détaillée

#### Les quatre systèmes de l'architecture de l'information

| Système | Question | Exemple dans la plateforme |
|---|---|---|
| Organisation | Comment regroupe-t-on ? | Par objet (Aéronef, Vol), par tâche (Planifier une inspection), par rôle |
| Désignation | Comment nomme-t-on ? | « Aéronef » plutôt que `resource_type_aircraft` |
| Navigation | Comment se déplace-t-on ? | Menu latéral, fil d'Ariane, onglets, liens |
| Recherche | Comment trouve-t-on sans naviguer ? | Recherche globale, filtres, palette de commandes |

#### Trois façons d'organiser

| Organisation | Principe | Avantage | Limite |
|---|---|---|---|
| Par objet | Un espace par type d'objet (Aéronefs, Vols, Constats) | Cohérente avec le modèle de données ; extensible : un nouvel objet est une nouvelle entrée | Une tâche qui traverse plusieurs objets est dispersée |
| Par tâche | Des entrées orientées action (« Planifier une inspection ») | Proche du travail réel | Difficile à étendre ; suppose de connaître toutes les tâches |
| Par rôle | Un espace par profil (planificateur, technicien) | Réduit le bruit | Duplique le contenu ; gêne quand une personne a plusieurs rôles |

En pratique, on combine : navigation principale par objet, accès par tâche depuis la page d'accueil, et adaptation au rôle par les permissions (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)).

#### Les formes de navigation

| Forme | Rôle | Exemple |
|---|---|---|
| Globale | Accéder aux grandes sections ; toujours présente | Menu latéral |
| Locale | Se déplacer à l'intérieur d'une section ou d'un objet | Onglets d'un aéronef : Aperçu, Tâches, Constats |
| Contextuelle | Suivre les relations entre objets | Du vol vers l'aéronef affecté |
| Fil d'Ariane | Montrer la position et permettre de remonter | Flotte › Aéronefs › F-ABCD |
| Supplémentaire | Raccourcis propres à la personne | Éléments récents, favoris |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Alpha Air ▾    Production ▾                        Rechercher…  ⌘K      │
├────────────────┬────────────────────────────────────────────────────────┤
│ Flotte         │ Flotte › Aéronefs › F-ABCD                             │
│ Maintenance    │                                                        │
│ Qualité        │ Aperçu | Tâches | Constats | Historique | Documents    │
│ Rapports       │ ───────                                                │
│ Administration │ Statut : Actif     Prochaine inspection : 2026-11-20   │
└────────────────┴────────────────────────────────────────────────────────┘
```

Ce schéma montre trois choses toujours visibles : le **contexte** (tenant et environnement) et la **recherche** en haut, la **navigation globale** à gauche, et le **repérage** (fil d'Ariane et onglet actif) dans la zone de contenu.

#### Une navigation décrite par des métadonnées

Dans une plateforme configurable, le menu est lui-même une donnée. Chaque type d'objet déclare sa catégorie, et le moteur d'interface construit la navigation.

```json
{
  "navigation": [
    { "key": "fleet", "label": "Flotte", "items": [
        { "type": "resource_list", "resource": "aircraft", "label": "Aéronefs" },
        { "type": "resource_list", "resource": "flight", "label": "Vols" }
    ]},
    { "key": "quality", "label": "Qualité", "items": [
        { "type": "resource_list", "resource": "finding", "label": "Constats" },
        { "type": "dashboard", "ref": "quality_overview", "label": "Vue d'ensemble" }
    ]}
  ],
  "placement_rules": {
    "new_resource_type": "under_declared_category",
    "uncategorized": "section_other",
    "item_visible_if": "has_permission('read', item.resource)"
  }
}
```

Trois règles rendent la structure robuste. Un type d'objet sans catégorie va dans une section « Autres » ; il n'est pas perdu. Une entrée n'apparaît que si la personne a le droit de lire l'objet (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)). Un libellé vient de la configuration du tenant, ce qui permet de respecter son vocabulaire.

#### Le contexte multi-tenant

- **Le sélecteur de tenant.** Une personne qui appartient à plusieurs tenants (un prestataire, un administrateur de plateforme) voit toujours dans lequel elle agit. La navigation ne montre jamais le contenu d'un autre tenant en même temps (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
- **L'indicateur d'environnement.** La production, la préproduction et le bac à sable se distinguent par un repère permanent et net (voir [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement)). Une couleur ou un bandeau dédié à la production réduit les erreurs de cible.
- **Les adresses stables.** Chaque écran a une adresse qui contient le tenant et l'objet. Elle peut être partagée, ajoutée aux favoris, et le bouton « précédent » fonctionne.
- **Le fil d'Ariane suit la hiérarchie, pas l'historique.** Il indique où se trouve l'objet, non par où l'on est passé.

#### Évaluer une structure

| Méthode | Question | Résultat |
|---|---|---|
| Tri par cartes ouvert | Comment les utilisateurs regroupent-ils et nomment-ils ? | Idées de catégories et de libellés |
| Tri par cartes fermé | Les éléments tombent-ils dans les catégories prévues ? | Validation des catégories |
| Test d'arborescence | Les personnes trouvent-elles une cible sans aide visuelle ? | Taux de réussite, chemin direct |
| Analyse des recherches | Que cherchent-elles sans succès ? | Libellés manquants, objets mal placés |
| Test d'utilisabilité | La tâche aboutit-elle ? | Obstacles réels |

#### Les modes de défaillance

- **La structure calquée sur la base de données** ou sur l'organigramme de l'éditeur.
- **Des libellés incohérents** : le même objet porte deux noms selon l'écran.
- **Un menu qui enfle** : chaque module ajoute des entrées, sans arbitrage.
- **Une profondeur excessive** : cinq ou six niveaux de menus imbriqués.
- **Des fonctions critiques cachées** dans des endroits improbables.
- **Des doublons** : deux chemins qui mènent à des écrans différents pour la même fonction.
- **Un contexte invisible** : tenant ou environnement non indiqué.

**Contre-exemple.** Une plateforme place l'administration des rôles sous « Paramètres › Sécurité › Avancé › Gestion des entités ». Les administrateurs l'appellent « droits d'accès », la cherchent sous « Utilisateurs », ne la trouvent pas, et finissent par créer des comptes partagés pour contourner.

**Limites.** Une bonne structure ne remplace ni la recherche ni les explications. Elle ne résiste pas non plus à une croissance sans arbitrage : à chaque ajout, il faut décider où cela va, et parfois réorganiser. La structure idéale dépend des tâches réelles des utilisateurs, qui ne se découvrent que par l'observation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.2 Design systems](#122-design-systems) | Le système de conception fournit les composants de navigation |
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | La recherche, les filtres et les vues complètent la navigation |
| [12.9 Palette de commandes](#129-palette-de-commandes) | La palette de commandes offre un accès rapide, sans parcourir le menu |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | La navigation s'adapte aux permissions et aux rôles |
| [12.13 Découvrabilité](#1213-découvrabilité) | La découvrabilité dépend directement de la structure |
| [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent) | Le langage omniprésent fournit les libellés |
| [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) et [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | Les objets et leurs métadonnées fondent l'organisation par objet |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les vues et formulaires configurables s'insèrent dans cette structure |
| [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise) et [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | La hiérarchie d'entreprise et le contexte de tenant déterminent ce que la navigation montre |

### 5. Application pratique

**Situation initiale.** Après un an, le tenant de la compagnie aérienne a créé 14 types d'objets personnalisés. Le menu latéral compte 60 entrées à plat, dans l'ordre de création. Les planificateurs se plaignent de ne pas retrouver les écrans, et deux administrateurs ont créé le même type « Constat » sous deux noms.

**Problème.** L'architecture de l'information n'a pas suivi la croissance du modèle.

**Application du concept.** Une refonte de la structure fondée sur les tâches réelles.

**Déroulé.**

1. L'équipe produit organise un tri par cartes ouvert avec huit utilisateurs (planificateurs, techniciens, responsables qualité). Les groupes qui émergent sont « Flotte », « Maintenance », « Qualité », « Rapports » et « Administration ».
2. Elle ajoute à chaque type d'objet un attribut de catégorie, et une règle de placement automatique. Un type sans catégorie va dans « Autres », et l'administrateur en est averti.
3. Elle remplace les libellés techniques par ceux du langage métier du tenant.
4. Elle ajoute un fil d'Ariane, des onglets locaux sur chaque objet et un bandeau d'environnement.
5. Elle vérifie le résultat par un test d'arborescence avec douze personnes, sur dix tâches (par exemple : « Où clôturez-vous un constat ? »).

**Résultat.** Le menu passe de 60 entrées à 6 sections de 8 entrées au plus. Dans le test, le taux de réussite des tâches passe d'environ 40 % à environ 80 % (valeurs illustratives). Les doublons cessent, car l'administrateur voit l'existant.

**Limites.** La structure dépend de six tâches types. Un autre secteur (hôpital, usine) aurait d'autres regroupements : la catégorie et le libellé sont donc des données du tenant, pas des constantes du produit.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre l'architecture de l'information et la navigation ?
2. **Compréhension.** Citez trois formes de navigation et donnez un exemple pour chacune.
3. **Compréhension.** Pourquoi une plateforme configurable a-t-elle besoin de règles de placement pour les nouveaux types d'objets ?
4. **Pourquoi.** Pourquoi les libellés doivent-ils venir du langage métier plutôt que du modèle technique ?
5. **Raisonnement pratique.** Un menu compte 60 entrées plates et les utilisateurs ne trouvent pas les écrans. Quelle méthode utilisez-vous pour proposer une nouvelle structure, et comment la validez-vous ?

#### Réponses

1. L'architecture de l'information est l'organisation : le regroupement, la désignation et les relations entre objets et fonctions. La navigation est l'ensemble des moyens concrets de se déplacer dans cette organisation (menus, onglets, fil d'Ariane, liens).
2. Globale : le menu latéral vers les grandes sections. Locale : les onglets d'un aéronef (Aperçu, Tâches, Constats). Contextuelle : le lien d'un vol vers son aéronef. On peut aussi citer le fil d'Ariane (position dans la hiérarchie).
3. Parce que les administrateurs ajoutent des types d'objets à tout moment. Sans règle, ils atterrissent à un endroit arbitraire, et le menu se dégrade à chaque ajout. Une règle (catégorie déclarée, section par défaut) garde la structure cohérente.
4. Parce que les utilisateurs pensent avec les mots de leur métier. Un libellé technique ne correspond à aucun repère, il n'est pas trouvable par la recherche de l'utilisateur, et il génère des questions au support.
5. Un tri par cartes ouvert avec des utilisateurs représentatifs, pour faire émerger regroupements et libellés. On valide ensuite par un test d'arborescence, qui mesure le taux de réussite et le chemin direct, avant toute mise en production.

## 12.2 Design systems

### 1. Comprendre simplement

Un **système de conception** (*design system*) est une **bibliothèque partagée de composants, de règles et de principes** qui garantit que toutes les interfaces d'un produit se ressemblent et se comportent de la même façon. On emploie souvent l'expression anglaise *design systems*, y compris en français.

**Pourquoi cela existe.** Sans lui, chaque écran invente son bouton, sa table et sa gestion d'erreur. Le produit devient incohérent, coûteux à maintenir et inégal en accessibilité. Dans une plateforme où l'interface est **générée à partir de métadonnées**, le système de conception est de plus un **vocabulaire** : il définit les composants que le moteur d'interface a le droit d'assembler.

**Problème résolu.** Construire vite des interfaces cohérentes, accessibles et maintenables, par des équipes différentes, y compris par des extensions tierces.

**Modèle mental.** Un jeu de briques avec son manuel. Les briques (les composants) ont des formes et des couleurs normalisées. Le manuel (les principes et les motifs) dit comment les assembler. Toute construction semble faite par la même main.

**Où l'analogie s'arrête.** Des briques sont inertes et figées. Un système de conception vit : il a des versions, des composants dépréciés, des exceptions justifiées, et des équipes qui le font évoluer.

**Exemple.** Le composant `DatePicker` est utilisé dans tous les formulaires. Il affiche un calendrier, valide la saisie, gère le fuseau horaire et se pilote au clavier. Le type de champ `date` du schéma (voir [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ)) est relié à ce composant. Quand le composant est amélioré, tous les formulaires en profitent.

**Les composants.**

1. des **principes** de conception ;
2. des **jetons de conception** (couleurs, espacements, typographie) ;
3. des **composants** réutilisables ;
4. des **motifs** qui assemblent des composants ;
5. une **documentation** vivante ;
6. une **gouvernance** : propriétaires, contributions, versions.

**Objectif d'apprentissage :** vous pouvez expliquer ce que contient un système de conception, pourquoi il est central dans une interface générée par métadonnées, et comment on le fait évoluer sans casser les écrans existants.

### 2. Connaissances essentielles

#### Définition

- **Système de conception** : ensemble cohérent de principes, de jetons, de composants réutilisables, de motifs et de documentation, maintenu comme un produit et partagé par les équipes.
- **Jeton de conception** (*design token*) : valeur nommée (couleur, espacement, taille de police) qui représente une décision de conception et sert de source unique à tous les composants.

#### Idées fondamentales

1. **Une source unique de vérité.** Une décision (par exemple la couleur du danger) est prise une fois, puis réutilisée partout par des jetons.
2. **On compose.** Les écrans sont assemblés à partir de composants simples, au lieu d'être dessinés de zéro.
3. **L'accessibilité est intégrée aux composants.** On la corrige une fois, pour tous les écrans.
4. **Le système est un produit.** Il a des propriétaires, des versions, une documentation et une feuille de route.
5. **Cohérence ne veut pas dire rigidité.** On prévoit des variantes, des points d'extension et un chemin pour les exceptions.
6. **Dans une interface pilotée par métadonnées, les composants sont le vocabulaire du moteur.** Un type de champ choisit un composant, pas un écran.
7. **La personnalisation par tenant est encadrée.** Le thème est modifiable dans des limites qui préservent la lisibilité.

#### Vocabulaire essentiel

- **Composant** (*component*) : élément d'interface réutilisable, avec son comportement et ses états.
- **Motif** (*pattern*) : solution éprouvée à un problème récurrent, qui assemble des composants (par exemple un panneau de filtres).
- **Variante** (*variant*) : version d'un composant (principal, secondaire, danger).
- **Thème** (*theme*) : ensemble de valeurs de jetons qui définit l'apparence.
- **Bibliothèque de composants** (*component library*) : implémentation en code des composants.
- **Accessibilité** (*accessibility*) : capacité d'être utilisé par des personnes avec des limitations visuelles, motrices, auditives ou cognitives.
- **WCAG** (*Web Content Accessibility Guidelines*) : recommandations du W3C sur l'accessibilité du contenu web, avec trois niveaux de conformité (A, AA, AAA).
- **Marque blanche** (*white labeling*) : présentation du produit sous l'identité visuelle du client.

#### Relations de cause à effet

- Chaque équipe écrit sa propre table. Les comportements diffèrent, et chaque correctif d'accessibilité doit être refait autant de fois.
- Les couleurs sont codées en dur. Un nouveau thème ou une marque blanche exige de modifier des centaines de fichiers.
- Les tenants peuvent choisir n'importe quelle couleur. Des textes deviennent illisibles, et l'accessibilité n'est plus garantie.
- Un composant change sans versionnement. Les écrans qui l'utilisent se cassent sans prévenir.

#### Idées reçues

- **« Un système de conception est une bibliothèque de maquettes. »** C'est aussi du code, des règles, une documentation et une organisation.
- **« Il bride l'innovation. »** Il retire le travail répétitif et laisse du temps pour les vrais problèmes. Il prévoit aussi des exceptions.
- **« On le construit une fois, et c'est fini. »** C'est un produit vivant. Sans maintenance, il se dégrade et les équipes le contournent.

#### Principe clé

On prend une décision de conception une seule fois, on la rend réutilisable sous forme de jetons et de composants accessibles, et on la fait évoluer comme un produit.

#### Si vous ne retenez que trois choses

1. Un système de conception réunit des jetons, des composants, des motifs et une gouvernance.
2. Dans une interface pilotée par métadonnées, il est le vocabulaire que le moteur peut assembler.
3. Il évolue avec des versions et des dépréciations, sans casser les écrans existants.

### 3. Explication technique détaillée

#### Les couches d'un système de conception

```text
principes              « la clarté avant la densité », « jamais d'effet caché »
   │
jetons de conception   couleurs, espacements, typographie, rayons, ombres
   │
composants             bouton, champ, sélecteur de date, table, boîte de dialogue
   │
motifs                 formulaire d'édition, panneau de filtres, assistant, état vide
   │
gabarits de page       liste, détail, tableau de bord, assistant
```

Chaque couche s'appuie sur la précédente. On ne change pas une couleur dans un composant : on change le jeton, et tous les composants suivent.

#### Les jetons

On distingue deux niveaux. Les jetons **primitifs** décrivent des valeurs brutes (une nuance de bleu). Les jetons **sémantiques** décrivent un rôle (la couleur de l'action principale) et pointent vers un primitif.

```json
{
  "primitive": {
    "blue-600": "#1F5FBF",
    "red-600": "#C62828",
    "gray-900": "#1B1F23",
    "white": "#FFFFFF"
  },
  "semantic": {
    "color.action.primary": "{primitive.blue-600}",
    "color.feedback.danger": "{primitive.red-600}",
    "color.text.default": "{primitive.gray-900}",
    "color.surface.default": "{primitive.white}",
    "space.2": "8px",
    "space.3": "16px",
    "radius.default": "6px"
  }
}
```

**Pourquoi des jetons.** Changer `color.feedback.danger` met à jour tous les composants. Un thème sombre, ou le thème d'un tenant, est un autre jeu de valeurs pour les mêmes jetons sémantiques.

#### Les états d'un composant

Un composant n'est pas une image : il a des états qu'il faut tous concevoir.

| État | Exemple pour un champ | Pourquoi le prévoir |
|---|---|---|
| Repos | Champ vide avec libellé | Référence |
| Survol | Bordure plus marquée | Indice d'interaction (absent sur écran tactile) |
| Focus | Contour visible | Navigation au clavier |
| Désactivé | Champ grisé avec explication | Voir [12.14 Explicabilité](#1214-explicabilité) |
| Chargement | Indicateur de progression | Éviter l'incertitude |
| Erreur | Message associé au champ | Voir [12.5 Formulaires et assistants](#125-formulaires-et-assistants) |
| Lecture seule | Valeur sans contrôle d'édition | Permissions (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)) |

#### Du type de champ au composant

Le moteur d'interface ne contient pas de formulaire écrit à la main. Il choisit un composant selon le type de champ défini dans le schéma (voir [2.2 Type et schéma](02-donnees-ressources.md#22-type-et-schéma) et [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ)).

```json
{
  "field_components": {
    "text":      { "component": "TextField" },
    "text_long": { "component": "TextArea" },
    "number":    { "component": "NumberField", "props": ["unit", "min", "max"] },
    "date":      { "component": "DatePicker", "props": ["min", "max", "timezone"] },
    "boolean":   { "component": "Toggle" },
    "enum":      { "component": "Select", "when_more_than": 12, "use": "SearchableSelect" },
    "reference": { "component": "ResourcePicker", "props": ["resource", "filter"] }
  }
}
```

Le lien entre le schéma et l'interface est donc une table de correspondance. Ajouter un nouveau type de champ à la plateforme demande un composant correspondant dans le système de conception.

#### L'accessibilité intégrée

- **Éléments natifs d'abord.** Un vrai bouton ou un vrai champ apporte gratuitement le comportement clavier et l'annonce par les lecteurs d'écran.
- **Libellés associés.** Chaque champ a un libellé relié programmatiquement, et ses erreurs aussi.
- **Focus visible et ordre logique.** On peut tout faire au clavier, dans un ordre cohérent.
- **Pas d'information par la couleur seule.** Une erreur combine couleur, icône et texte.
- **Annonces dynamiques.** Un résultat de tri ou un message d'enregistrement est annoncé aux technologies d'assistance.
- **Contraste suffisant.** Les WCAG 2.2 (recommandation du W3C publiée en 2023) fixent, au niveau AA, un rapport de contraste d'au moins 4,5:1 pour le texte courant et 3:1 pour le grand texte et les composants d'interface.

$$\text{rapport de contraste} = \frac{L_1 + 0{,}05}{L_2 + 0{,}05}$$

- $L_1$ : luminance relative de la couleur la plus claire (entre 0 pour le noir et 1 pour le blanc) ;
- $L_2$ : luminance relative de la couleur la plus sombre.

Le noir sur blanc donne $(1 + 0{,}05) / (0 + 0{,}05) = 21$, le maximum. Un jaune très clair avec du texte blanc donne un rapport voisin de 1,1:1, très en dessous du seuil.

#### La personnalisation par tenant

| Niveau | Éléments | Règle |
|---|---|---|
| Libre | Logo, nom affiché, page d'accueil | Aucune contrainte technique |
| Encadré | Couleur principale, thème clair ou sombre | Contraste vérifié automatiquement ; correction ou refus |
| Interdit | Couleurs et icônes de danger, tailles minimales, comportement clavier | Garantit la lisibilité et la sécurité d'usage |

Le tenant n'écrit pas de CSS. Il choisit des valeurs de jetons, et la plateforme valide le résultat avant de le publier.

#### Faire évoluer sans casser

- **Versions sémantiques.** Un changement incompatible incrémente la version majeure ; un ajout compatible, la version mineure.
- **Dépréciation annoncée.** Un composant remplacé est signalé, reste disponible pendant une période de transition, puis est retiré.
- **Alias.** Quand un composant est renommé, l'ancien nom reste un alias dans la table de correspondance des types de champ.
- **Tests de régression visuelle.** Une comparaison automatique d'images détecte les changements involontaires.
- **Catalogue vivant.** Chaque composant a une page avec ses variantes, ses états, ses règles d'usage et ses exemples de code.

#### Les compromis

| Choix | Avantage | Coût |
|---|---|---|
| Système strict | Cohérence, rapidité | Moins de liberté ; exceptions coûteuses |
| Système souple | S'adapte aux cas particuliers | Dérives, incohérences |
| Équipe centrale | Qualité homogène | Risque de goulot d'étranglement |
| Modèle fédéré | Contributions rapides | Demande une gouvernance claire |

#### Les modes de défaillance

- **Le goulot d'étranglement.** Toute demande passe par une petite équipe, et les produits la contournent.
- **Des composants sans documentation.** Personne ne sait quand les utiliser.
- **Les copies divergentes.** Des équipes recopient un composant et le modifient localement.
- **La dette de migration.** Plusieurs versions coexistent indéfiniment.
- **L'accessibilité ajoutée tard.** Elle coûte alors beaucoup plus cher qu'à la conception.
- **Un thème de tenant qui casse le contraste.**

**Contre-exemple.** Un produit définit ses couleurs en dur dans chaque composant. Un client demande son thème. L'équipe copie les composants pour chaque client. Un an plus tard, onze variantes existent, et la correction d'un défaut d'interface doit être appliquée onze fois.

**Limites.** Un système de conception standardise des interactions courantes. Il ne remplace pas la recherche auprès des utilisateurs. Les interactions très spécifiques, comme un éditeur visuel de workflow ou un graphe de dépendances, dépassent les composants standards et demandent une conception propre. Les composants génériques doivent aussi tenir la charge de grands volumes de données.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation) | Le système fournit les composants de navigation |
| [12.5 Formulaires et assistants](#125-formulaires-et-assistants) | Les formulaires sont des motifs construits sur les composants de champ |
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | Les tables, filtres et vues sont des composants et des motifs du système |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | Les états vides et d'erreur sont des motifs standardisés |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les vues et formulaires configurables sont rendus par ces composants |
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) | Les types de champ du schéma se relient à des composants |
| [10.15 Interface personnalisée et workflows personnalisés](10-api-integrations-extensibilite.md#1015-interface-personnalisée-et-workflows-personnalisés) | Les interfaces personnalisées des extensions réutilisent les mêmes composants |
| [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur) | Le SDK de la plateforme expose les composants aux développeurs tiers |

### 5. Application pratique

**Situation initiale.** Trois équipes ont chacune écrit leur table de données : le module « Flotte », le module « Maintenance » et l'éditeur de vues. Un client hospitalier exige la navigation complète au clavier et un niveau de conformité AA.

**Problème.** Les trois tables diffèrent par le tri, la pagination et le comportement au clavier. Aucune n'annonce les changements de tri aux technologies d'assistance.

**Application du concept.** Un composant de table unique dans le système de conception.

**Déroulé.**

1. L'équipe audite les trois tables et liste les écarts : icônes de tri différentes, un seul composant utilisable au clavier, aucune annonce dynamique.
2. Elle construit un composant `DataTable` : sémantique native de tableau, navigation au clavier, annonces de tri, en-tête fixe, colonnes configurables, densité réglable. Tous les styles viennent des jetons.
3. Elle déprécie les trois anciennes tables, fournit une transformation automatique du code, et ajoute des tests de régression visuelle.
4. Elle relie les définitions de vues configurables (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)) au composant : toutes les vues existantes héritent du comportement.
5. Elle instaure une liste de contrôle d'accessibilité dans la revue de toute contribution.

**Résultat.** Une correction d'accessibilité atteint toutes les vues en une seule livraison. L'audit du client valide les tables.

**Limites.** La conformité ne dépend pas que des composants. Les libellés, les contrastes des thèmes de tenant et la structure des pages restent à la charge des équipes produit et des tenants.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un jeton de conception, et quelle est la différence entre un jeton primitif et un jeton sémantique ?
2. **Compréhension.** Pourquoi le système de conception est-il particulièrement important dans une interface générée par métadonnées ?
3. **Compréhension.** Quels éléments d'un thème de tenant peut-on laisser libres, et lesquels doit-on encadrer ?
4. **Pourquoi.** Pourquoi vaut-il mieux intégrer l'accessibilité dans les composants plutôt que de la vérifier écran par écran ?
5. **Raisonnement pratique.** Vous renommez le composant `Select` en `Dropdown`. Que faites-vous pour ne pas casser les écrans existants ?

#### Réponses

1. Un jeton est une valeur nommée (couleur, espacement) qui représente une décision de conception et sert de source unique. Un jeton primitif est une valeur brute (une nuance de bleu). Un jeton sémantique décrit un rôle (la couleur de l'action principale) et pointe vers un primitif.
2. Parce que le moteur d'interface assemble des composants choisis selon les types de champ. Le système de conception définit donc ce que le moteur peut afficher, et la qualité des composants se répercute sur tous les écrans configurés.
3. Libres : le logo, le nom affiché, la page d'accueil. Encadrés : la couleur principale et le thème, avec une vérification automatique du contraste. Interdits : les couleurs de danger, les tailles minimales et le comportement clavier.
4. Parce qu'une correction dans un composant atteint tous les écrans qui l'utilisent. Une vérification écran par écran est coûteuse, incomplète, et se dégrade à chaque nouvel écran.
5. On conserve `Select` comme alias dans la table de correspondance, on annonce la dépréciation, on fournit une transformation automatique du code, on garde les deux noms pendant une période de transition, puis on retire l'ancien nom lors d'une version majeure.

## 12.3 UX d'administration

### 1. Comprendre simplement

L'**UX d'administration** (*admin UX*) est la conception des interfaces par lesquelles on **configure, gère et supervise** la plateforme : utilisateurs et droits, modèles de données, workflows, règles, intégrations. Elle se distingue de l'UX d'usage, celle des personnes qui font leur travail quotidien dans la plateforme.

**Pourquoi cela existe.** Les tâches d'administration sont complexes, rares et lourdes de conséquences : une erreur touche tous les utilisateurs d'un tenant. Les administrateurs sont rarement des développeurs. Ce sont souvent des experts du métier qui configurent le système quelques heures par mois. Si l'UX est mauvaise, deux choses se produisent : les clients n'utilisent pas la configurabilité, et la valeur de la plateforme est perdue ; ou ils l'utilisent mal et cassent leur configuration.

**Problème résolu.** Permettre à des non-développeurs de configurer un système complexe de façon efficace, compréhensible et sûre.

**Modèle mental.** Une salle de contrôle plutôt que le tableau de bord d'une voiture. Beaucoup d'informations, tout est étiqueté, des procédures guident, des verrous protègent les actions dangereuses, et tout ce qui est fait est consigné.

**Où l'analogie s'arrête.** Une salle de contrôle est confiée à des opérateurs formés. Un administrateur de tenant peut être novice et ne configurer qu'une fois par trimestre : l'interface doit donc enseigner autant qu'elle permet d'agir.

**Exemple.** L'administrateur veut ajouter l'état « Reporté » au workflow des constats. Un bon écran lui montre le diagramme actuel, lui laisse modifier un brouillon, indique les règles et les vues qui utilisent les états, simule l'effet sur les constats ouverts, puis demande une revue avant la publication.

**Les composants.**

1. des **modes** de travail : lecture, brouillon, publié ;
2. la **lisibilité** de l'état courant ;
3. l'**aide à la création** : modèles, assistants, exemples ;
4. des **contrôles de sûreté** : validation, aperçu, confirmation ;
5. la **traçabilité** : historique et auteur de chaque changement.

**Objectif d'apprentissage :** vous pouvez décrire ce qui distingue l'UX d'administration de l'UX d'usage, expliquer le parcours du brouillon à la publication, et citer les erreurs de conception qui rendent la configuration dangereuse.

### 2. Connaissances essentielles

#### Définition

**UX d'administration** : discipline de conception des interfaces de configuration, de gestion et de supervision d'une plateforme, qui vise l'efficacité, la compréhension et la sûreté des personnes qui l'administrent.

#### Idées fondamentales

1. **Les administrateurs sont des utilisateurs.** Ils ont des objectifs, un temps limité et des connaissances variables. Ce ne sont pas des développeurs.
2. **Les conséquences sont plus grandes.** Une erreur d'administration se propage à de nombreux utilisateurs : la portée et l'impact doivent être visibles.
3. **On rend l'état courant lisible avant de permettre de le changer.** On ne modifie bien que ce que l'on comprend.
4. **On sépare le brouillon de la publication.** Modifier n'est pas déployer.
5. **Les actions dangereuses sont difficiles à faire par accident et réversibles.**
6. **L'efficacité compte.** Les experts ont besoin d'actions en masse, de recherche, de copie, d'import et d'export.
7. **Les profils diffèrent.** Un responsable qualité, un administrateur de tenant et un administrateur technique n'ont pas les mêmes tâches ni le même vocabulaire.

#### Vocabulaire essentiel

- **Brouillon** (*draft*) : version en cours de modification, sans effet sur le fonctionnement.
- **Publication** (*publish*) : passage d'un brouillon à la version active.
- **Portée** (*scope*) : ensemble de ce que touche un changement (un formulaire, un type, un tenant, la plateforme).
- **Aperçu** (*preview*) : représentation de ce que donnerait la modification, sans l'appliquer.
- **Utilisé par** (*where-used*) : liste des éléments qui référencent l'objet que l'on modifie.
- **Provenance** : indication de l'origine d'une valeur effective (plateforme, tenant, équipe).
- **Gabarit** (*template*) : configuration de départ réutilisable.

#### Relations de cause à effet

- L'interface expose un champ de texte libre pour des règles. Une erreur de syntaxe passe inaperçue, et les transitions échouent en production.
- La portée n'est pas affichée. L'administrateur croit modifier un formulaire et modifie tous les formulaires du type.
- Il n'existe ni brouillon ni historique. Chaque correction est un risque, et la peur de casser bloque l'usage de la configurabilité.
- Les libellés reprennent le jargon d'implémentation. Les administrateurs créent des tickets au lieu de configurer.

#### Idées reçues

- **« Les administrateurs sont des experts, ils comprendront. »** Ce sont des experts du métier, pas du moteur, et ils configurent rarement.
- **« Une interface d'administration n'a pas besoin de conception soignée. »** Les erreurs de configuration comptent parmi les plus coûteuses.
- **« Il suffit d'un grand formulaire de paramètres. »** Il noie les réglages utiles. On regroupe par tâche, avec des valeurs par défaut sensées.

#### Principe clé

Une interface d'administration rend l'état visible, la portée explicite, les changements prévisualisables et réversibles, et les actions dangereuses difficiles à faire par accident.

#### Si vous ne retenez que trois choses

1. Les administrateurs sont des utilisateurs à part entière, avec des enjeux plus élevés.
2. On sépare le brouillon de la publication, et on montre l'aperçu et l'impact avant d'appliquer.
3. La portée, la provenance et l'historique sont toujours visibles.

### 3. Explication technique détaillée

#### Qui administre quoi

| Profil | Tâches typiques | Besoins |
|---|---|---|
| Administrateur de tenant | Utilisateurs, rôles, paramètres généraux | Clarté, peu de jargon, garde-fous |
| Concepteur de processus (responsable qualité) | Workflows, règles, formulaires, vues | Aperçu, simulation, vocabulaire métier |
| Administrateur technique | Intégrations, clés d'API, webhooks (voir [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations)) | Précision, journaux, outils de test |
| Auditeur | Consultation, export, historique | Lecture seule, recherche, preuves |

#### L'anatomie d'un écran d'administration

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Tenant : Alpha Air        Environnement : PRODUCTION        Brouillons : 2       │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Workflow « Constat »                              Version publiée : v7           │
│ Définition | Utilisé par | Historique | Aperçu des effets                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ États : Ouvert → En analyse → Corrigé → Clos                                     │
│ Transition « Clore » : réservée au rôle Responsable qualité                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ Enregistrer le brouillon ]  [ Simuler ]  [ Demander une revue ]  [ Publier ]   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- **La ligne de contexte** rappelle le tenant, l'environnement et le nombre de brouillons en attente.
- **L'en-tête de l'objet** indique la version publiée et propose les vues : définition, utilisé par, historique, aperçu des effets.
- **Le contenu** montre l'état courant, de façon lisible.
- **La barre d'actions** distingue les actions sans risque (enregistrer un brouillon, simuler) de l'action qui a un effet (publier).

#### Du brouillon à la publication

```text
brouillon ─► validation automatique ─► aperçu ou simulation ─► revue (si requise) ─► publication
    ▲                                                                                    │
    └────────── retour arrière (version précédente) ◄── surveillance après publication ◄─┘
```

Ce parcours repose sur le versionnement de la configuration (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), la revue et l'approbation (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) et le retour arrière (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)). L'interface rend ces mécanismes accessibles : chaque étape est un écran ou un bouton, pas une procédure à connaître.

#### Rendre l'état effectif visible

Dans un système à héritage, la valeur que l'on voit n'est pas toujours celle que l'on a saisie. L'interface montre la valeur **effective** et sa **provenance** (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) et [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles)).

| Réglage | Valeur effective | Provenance |
|---|---|---|
| Durée de session | 30 minutes | Hérité de la plateforme |
| Langue par défaut | Français | Défini par le tenant |
| Seuil d'alerte d'inspection | 14 jours | Surchargé par l'équipe Maintenance |

Un bouton « Revenir à la valeur héritée » rend la surcharge réversible.

#### Maîtriser la prolifération des réglages

Chaque réglage coûte : documentation, tests, support, interactions imprévues. Avec $n$ réglages binaires indépendants, il existe $2^n$ configurations possibles. Avec 20 réglages, $2^{20} = 1\,048\,576$ configurations : la plateforme ne peut pas les tester toutes.

- On préfère des **valeurs par défaut judicieuses** à un réglage de plus.
- On **regroupe par tâche** plutôt que par composant technique.
- On **retire** les réglages que personne n'utilise, en s'appuyant sur des mesures.
- On privilégie un petit nombre de **gabarits** éprouvés à une infinité de combinaisons.

#### L'efficacité pour les experts

- une **recherche** dans les réglages (voir [12.9 Palette de commandes](#129-palette-de-commandes)) ;
- des **actions en masse** (voir [12.8 Actions en masse](#128-actions-en-masse)) ;
- la **copie** d'un élément existant (voir [3.3 Cloner et dupliquer](03-crud-runtime-ressources.md#33-cloner-et-dupliquer)) ;
- l'**import et l'export** de configuration, pour la reproduire d'un environnement à l'autre ;
- une **API équivalente** à l'interface, pour automatiser ;
- des **raccourcis clavier**.

#### Les modes de défaillance

- **Le formulaire monolithique** de 80 champs, sans regroupement.
- **L'absence d'aperçu** : l'effet n'est visible qu'en production.
- **L'action destructive en un clic**, sans confirmation proportionnée ni retour arrière.
- **Le jargon d'implémentation** dans les libellés.
- **La portée invisible** : on modifie le global en croyant modifier le local.
- **Une configuration uniquement manuelle** : pas d'export, donc pas de reproductibilité entre environnements.
- **Une interface d'administration négligée « parce que c'est interne ».**

**Contre-exemple.** L'écran des règles est un champ de texte libre où l'on saisit du JSON. Un administrateur retire une accolade, enregistre, et toutes les transitions du workflow échouent. Aucun message ne l'a averti, aucun brouillon n'existait, et la version précédente n'est pas conservée.

**Limites.** Une interface d'administration ne peut pas rendre simple une logique intrinsèquement complexe. Elle réduit la complexité accidentelle (jargon, dispersion, absence de repères), pas la complexité essentielle des règles du client. La formation, la documentation et parfois l'accompagnement restent nécessaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | La plateforme d'administration fournit les fonctions ; l'UX d'administration les rend utilisables |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | L'administration du comportement (règles, workflows) est l'usage le plus délicat |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Versionnement, retour arrière et revue sont les mécanismes sous-jacents du parcours de publication |
| [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle) | La divulgation progressive structure les écrans de configuration |
| [12.15 Conscience de l'impact](#1215-conscience-de-limpact) | La conscience de l'impact fournit « utilisé par » et l'aperçu des effets |
| [12.16 Configuration sûre](#1216-configuration-sûre) | La configuration sûre systématise les garde-fous |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Le moindre privilège limite qui peut publier |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | L'héritage de configuration impose d'afficher la provenance |

### 5. Application pratique

**Situation initiale.** Les workflows sont configurés par édition directe d'un document JSON dans un champ de texte. Un tiers des tickets du support porte sur la configuration des workflows. En six mois, trois incidents sont venus de configurations invalides publiées en production.

**Problème.** L'interface suppose que l'administrateur pense comme un développeur, sans brouillon, sans validation et sans aperçu.

**Application du concept.** Une refonte de l'éditeur de workflow selon les principes de l'UX d'administration.

**Déroulé.**

1. L'éditeur affiche le diagramme d'états lisible, avec les transitions et les rôles autorisés.
2. Chaque modification se fait sur un **brouillon**. Une validation automatique vérifie la cohérence (états inaccessibles, transitions sans rôle) à chaque enregistrement.
3. L'onglet « Utilisé par » liste les vues, règles et intégrations qui référencent les états.
4. Un bouton « Simuler » rejoue la nouvelle définition sur des constats existants, et indique combien changeraient de comportement.
5. La publication exige une revue pour les workflows de production (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)). L'historique des versions permet un retour arrière en un clic.
6. Le JSON reste accessible dans un mode expert, avec validation et comparaison avec la version précédente.

**Résultat.** Les tickets de configuration baissent nettement, et plus aucune configuration invalide n'atteint la production. Les responsables qualité modifient eux-mêmes leurs workflows.

**Limites.** L'éditeur visuel n'exprime pas tout. Le mode expert reste nécessaire pour les cas complexes, et il est protégé par les mêmes validations.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi l'UX d'administration est-elle plus critique que l'UX d'usage ?
2. **Compréhension.** Quelle est la différence entre un brouillon et une publication ?
3. **Compréhension.** Pourquoi affiche-t-on la provenance d'une valeur de configuration ?
4. **Pourquoi.** Pourquoi vaut-il mieux limiter le nombre de réglages plutôt que d'en ajouter un par demande de client ?
5. **Raisonnement pratique.** Un administrateur modifie un type d'objet utilisé par 12 vues et 3 workflows. Quelles informations lui montrez-vous avant de publier ?

#### Réponses

1. Parce qu'une erreur d'administration agit sur tous les utilisateurs d'un tenant, voire de la plateforme. Les conséquences sont plus larges et plus difficiles à défaire qu'une erreur individuelle.
2. Un brouillon est une version en cours de modification, sans effet sur le fonctionnement. La publication la fait devenir la version active. Les séparer permet de valider, de prévisualiser et de relire avant tout effet.
3. Parce que, dans un système à héritage, la valeur effective peut venir de la plateforme, du tenant ou d'une équipe. Sans provenance, l'administrateur ne sait pas où modifier, ni ce qu'il surcharge.
4. Parce que chaque réglage multiplie les configurations possibles, donc les tests, la documentation, le support et les interactions imprévues. Des valeurs par défaut judicieuses et des gabarits sont plus maintenables.
5. La portée du changement, la liste « utilisé par » (les 12 vues et les 3 workflows), l'aperçu ou la simulation des effets, les éventuelles incompatibilités, et la possibilité de revenir à la version précédente.

## 12.4 Divulgation progressive et configuration contextuelle

### 1. Comprendre simplement

La **divulgation progressive** (*progressive disclosure*) consiste à **montrer d'abord l'essentiel, et à révéler le reste à la demande**. La **configuration contextuelle** (*contextual configuration*) consiste à **proposer la configuration à l'endroit et au moment où le besoin apparaît**, avec la bonne portée.

**Pourquoi cela existe.** Une plateforme configurable a énormément d'options. Les montrer toutes en même temps surcharge : l'utilisateur ne sait plus ce qui compte. Tout cacher frustre les experts. Par ailleurs, une configuration reléguée dans un espace d'administration éloigné fait perdre le contexte : « de quel formulaire parlais-je ? ».

**Problème résolu.** Rendre la plateforme simple pour le cas courant, puissante pour le cas expert, et la configuration naturelle à l'endroit où l'on constate le besoin.

**Modèle mental.** Un appareil photo. Un bouton suffit pour une photo réussie. Un mode manuel est disponible pour les experts. Chaque réglage est expliqué à l'endroit où on le change.

**Où l'analogie s'arrête.** Un appareil photo a un nombre limité de réglages indépendants. Une plateforme a des milliers d'options reliées entre elles par héritage, par portée et par dépendances. Il faut donc aussi indiquer la portée de chaque réglage.

**Exemple.** Dans un formulaire, l'administrateur clique sur l'engrenage à côté du champ « Date d'inspection ». Un panneau latéral s'ouvre avec l'essentiel (libellé, obligatoire), les options avancées (condition d'affichage, aide) et le niveau expert (formule, validation). Il indique la portée et l'usage : « utilisé par 3 vues, 1 workflow ».

**Les composants.**

1. des **niveaux** (essentiel, avancé, expert) ;
2. des **déclencheurs** d'affichage (sections repliables, panneaux, pages dédiées) ;
3. des **valeurs par défaut sûres** ;
4. des **points d'entrée contextuels** ;
5. une **indication de portée** et d'impact.

**Objectif d'apprentissage :** vous pouvez répartir des options entre niveaux, choisir entre configuration contextuelle et centrale, et expliquer pourquoi l'indication de portée est indispensable.

### 2. Connaissances essentielles

#### Définition

- **Divulgation progressive** : technique de conception qui présente d'abord les informations et les options les plus utiles, et réserve les options secondaires à une action explicite de l'utilisateur.
- **Configuration contextuelle** : accès à la configuration d'un élément depuis l'endroit où cet élément est utilisé, sans quitter son contexte, avec indication de la portée de la modification.

#### Idées fondamentales

1. **Les valeurs par défaut couvrent la majorité des cas.** L'utilisateur ne configure que ce qu'il veut changer.
2. **Le niveau avancé est signalé, pas caché.** Un lien clair indique qu'il existe des options de plus.
3. **Ce qui est replié reste trouvable.** La recherche des réglages et les indices rendent les options avancées accessibles.
4. **Peu de niveaux.** Au-delà de deux niveaux de révélation, l'utilisabilité se dégrade en général.
5. **La configuration contextuelle indique sa portée.** On sait toujours ce que le changement touchera.
6. **Les permissions filtrent aussi.** Le niveau expert, ou l'accès contextuel, peut être réservé à certains rôles (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)).
7. **On ajuste les niveaux par la mesure.** Une option avancée très utilisée devient essentielle.

#### Vocabulaire essentiel

- **Niveau essentiel, avancé, expert** : gradation des options selon la fréquence d'usage et le niveau de compétence requis.
- **Section repliable** (*collapsible section*) : zone dont le contenu apparaît à la demande.
- **Panneau latéral** (*side panel*, ou *drawer*) : volet qui s'ouvre à côté du contenu sans le remplacer.
- **Valeur par défaut** (*default*) : valeur appliquée tant que l'utilisateur n'en choisit pas une autre.
- **Portée** (*scope*) : étendue de ce qu'un changement modifie.
- **Point d'entrée contextuel** : bouton ou lien de configuration placé à côté de l'élément concerné.

#### Relations de cause à effet

- Toutes les options sont visibles d'emblée. Le nouvel utilisateur est submergé et choisit au hasard.
- Les options avancées sont cachées sans indice. Les experts ne les trouvent plus et ouvrent des tickets.
- La configuration contextuelle n'affiche pas sa portée. L'administrateur modifie sans le savoir tous les formulaires d'un type.
- Les valeurs par défaut sont mal choisies. Il faut ouvrir le niveau avancé pour que la fonction marche : la divulgation progressive échoue.

#### Idées reçues

- **« Cacher les options avancées revient à les supprimer. »** Non. Elles restent disponibles, avec un chemin évident pour les trouver.
- **« La divulgation progressive est un assistant. »** Un assistant est une suite d'étapes (voir [12.5 Formulaires et assistants](#125-formulaires-et-assistants)). La divulgation progressive est une organisation en couches d'un même écran.
- **« Tout doit être configurable en contexte. »** Certains réglages ont un effet global (politique de mots de passe) : ils appartiennent à un espace central.

#### Principe clé

On montre ce qui sert au plus grand nombre d'abord, on signale le reste sans le cacher, et l'on configure là où le besoin se voit, avec la portée affichée.

#### Si vous ne retenez que trois choses

1. Des niveaux (essentiel, avancé, expert) et des valeurs par défaut sûres rendent le cas courant simple.
2. La configuration contextuelle place le réglage près de son objet, et elle affiche la portée du changement.
3. Replier ne veut pas dire cacher : les options avancées restent signalées et trouvables.

### 3. Explication technique détaillée

#### Les niveaux de divulgation

| Niveau | Contenu | Public | Affichage |
|---|---|---|---|
| Essentiel | Ce qui sert à la majorité des cas | Tous | Toujours affiché |
| Avancé | Options qui adaptent le comportement | Utilisateurs réguliers | Section repliée, lien « Options avancées » |
| Expert | Formules, scripts, paramètres techniques | Spécialistes | Panneau ou page séparés, éventuellement par permission |

#### Où et comment révéler

| Technique | Quand l'utiliser | Point de vigilance |
|---|---|---|
| Section repliable | Quelques options liées au sujet | Ne pas replier des champs obligatoires |
| Panneau latéral | Configurer sans quitter le contexte | Garder l'écran principal visible et stable |
| Boîte de dialogue | Décision courte et ciblée | Éviter d'empiler les dialogues |
| Page dédiée | Configuration longue ou complexe | Prévoir un retour clair vers le contexte |
| Aide en ligne | Explication d'un terme | Ne jamais y placer l'information essentielle |

#### Des niveaux décrits par des métadonnées

Dans une plateforme pilotée par métadonnées (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)), les niveaux font partie de la définition des réglages. L'interface n'est pas codée écran par écran.

```json
{
  "field_settings": [
    { "key": "label",       "level": "basic",    "default": null },
    { "key": "required",    "level": "basic",    "default": false },
    { "key": "visible_if",  "level": "advanced", "default": null },
    { "key": "help_text",   "level": "advanced", "default": "" },
    { "key": "validation",  "level": "expert",   "default": [] },
    { "key": "formula",     "level": "expert",   "default": null }
  ],
  "expert_level_requires": "permission:configure_expert"
}
```

#### Un panneau de configuration contextuelle

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Champ « Date d'inspection »                    Portée : tenant Alpha Air   │
├────────────────────────────────────────────────────────────────────────────┤
│ Essentiel                                                                  │
│   Libellé       [ Date d'inspection ]                                      │
│   Obligatoire   [x]                                                        │
│ ▸ Options avancées : visibilité, aide, valeur par défaut                   │
│ ▸ Expert : validation personnalisée, formule                               │
├────────────────────────────────────────────────────────────────────────────┤
│ Utilisé par : 3 vues, 1 workflow, 1 intégration                            │
└────────────────────────────────────────────────────────────────────────────┘
```

Le panneau montre la **portée** en haut, le **niveau essentiel** déjà ouvert, les niveaux supérieurs **signalés mais repliés**, et l'**usage** en bas (voir [12.15 Conscience de l'impact](#1215-conscience-de-limpact)).

#### Contextuel ou central ?

| Réglage | Où le placer | Pourquoi |
|---|---|---|
| Libellé et caractère obligatoire d'un champ | Contextuel, depuis le formulaire | Se décide en regardant le formulaire |
| Colonnes d'une vue | Contextuel, depuis la table | Se décide en regardant les données |
| Politique de mots de passe du tenant | Central (administration de la sécurité) | Effet global, sans lien avec un écran |
| Rôles et permissions | Central | Demande une vue d'ensemble |

Les deux se complètent. Un réglage contextuel renvoie vers l'espace central pour les vues d'ensemble, et l'espace central renvoie vers le contexte pour les réglages locaux.

#### La portée et l'héritage

Une configuration contextuelle précise toujours **ce qu'elle modifie** :

- « Ce formulaire seulement » ;
- « Tous les formulaires du type Aéronef » ;
- « Tout le tenant » ;
- « Ma vue personnelle ».

Quand un choix de portée est possible, il est proposé explicitement, avec le plus restreint par défaut. La valeur effective et sa provenance sont affichées (voir [12.3 UX d'administration](#123-ux-dadministration)).

#### Ajuster les niveaux par la mesure

| Observation | Décision |
|---|---|
| Une option avancée est utilisée par la majorité des administrateurs | La promouvoir au niveau essentiel |
| Une option essentielle n'est presque jamais modifiée | La replier, ou revoir sa valeur par défaut |
| Des tickets demandent comment faire une chose qui existe | Améliorer l'indice, la recherche ou le libellé |
| Un administrateur modifie souvent la valeur par défaut | Remettre en cause la valeur par défaut |

#### Les modes de défaillance

- **« Avancé » devient un fourre-tout** où l'on range tout ce qu'on ne sait pas classer.
- **Des options cachées sans indice** : elles sont introuvables.
- **Trop de niveaux** : l'utilisateur ne sait plus où chercher.
- **Contextuel sans portée** : on modifie le global sans le savoir.
- **Une page séparée** qui fait perdre le contexte et oblige à y revenir.
- **Des valeurs par défaut inadaptées**, qui obligent à ouvrir le niveau avancé.

**Contre-exemple.** Un éditeur cache sous « Plus d'options » tout ce qui n'est pas indispensable. Les administrateurs expérimentés ne retrouvent plus le réglage du délai d'expiration et ouvrent des tickets. Replier n'est pas supprimer : il faut un chemin évident, comme une recherche des réglages ou un indice sur le panneau.

**Limites.** La divulgation progressive ne répare pas un modèle de configuration mal conçu : elle masque la complexité sans la réduire. Les niveaux sont des hypothèses sur l'usage, à vérifier par la mesure et par des tests.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.3 UX d'administration](#123-ux-dadministration) | L'UX d'administration est le cadre dans lequel ces techniques s'appliquent |
| [12.5 Formulaires et assistants](#125-formulaires-et-assistants) | Les assistants séquencent des étapes ; la divulgation progressive organise en couches |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Les niveaux et l'accès contextuel peuvent dépendre des permissions |
| [12.13 Découvrabilité](#1213-découvrabilité) | La divulgation progressive est en tension avec la découvrabilité : il faut les concilier |
| [12.15 Conscience de l'impact](#1215-conscience-de-limpact) | Le panneau contextuel affiche l'usage et l'impact |
| [12.16 Configuration sûre](#1216-configuration-sûre) | Les valeurs par défaut sûres font partie de la configuration sûre |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les définitions de vues et de formulaires portent les niveaux |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | L'héritage de configuration détermine la portée proposée |

### 5. Application pratique

**Situation initiale.** La configuration d'une transition de workflow (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) tient sur un écran unique de 40 champs : rôles autorisés, gardes, motif requis, effets, notifications, délais, journalisation. Les nouveaux administrateurs ne savent pas par où commencer, et une partie valide les valeurs par défaut sans les comprendre.

**Problème.** Tout est au même niveau, et rien n'indique ce qui est important.

**Application du concept.** Une refonte en niveaux, avec une configuration contextuelle depuis le diagramme d'états.

**Déroulé.**

1. L'équipe classe les 40 champs d'après l'usage réel : 6 sont utilisés dans presque toutes les transitions (libellé, états de départ et d'arrivée, rôles autorisés, motif requis, notification).
2. Ces 6 champs forment le niveau essentiel. Une quinzaine d'autres (gardes simples, délais, effets) forment le niveau avancé. Le reste (expressions, gardes personnalisées) devient expert, derrière une permission.
3. L'administrateur configure une transition en cliquant sur la flèche du diagramme : un panneau latéral s'ouvre, le diagramme reste visible.
4. Le panneau affiche la portée (« ce workflow, version brouillon ») et l'usage (« utilisée par 2 règles de notification »).
5. Les valeurs par défaut sont choisies pour que la transition fonctionne sans ouvrir le niveau avancé.
6. Des mesures d'usage guident les promotions et rétrogradations d'options au fil des versions.

**Résultat.** Le temps moyen pour configurer une première transition diminue sensiblement, et les valeurs par défaut cessent d'être validées sans compréhension. Les experts gardent un accès complet.

**Limites.** Le classement reflète l'usage d'un moment. Un autre secteur peut utiliser autrement les mêmes champs, d'où la mesure continue.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que la divulgation progressive, et en quoi diffère-t-elle d'un assistant ?
2. **Compréhension.** Qu'appelle-t-on configuration contextuelle ?
3. **Compréhension.** Citez deux réglages mieux placés dans un espace central, et expliquez pourquoi.
4. **Pourquoi.** Pourquoi doit-on afficher la portée d'un changement dans une configuration contextuelle ?
5. **Raisonnement pratique.** Une option « avancée » est modifiée par 80 % des administrateurs dès leur première configuration. Que faites-vous, et que vérifiez-vous ?

#### Réponses

1. C'est la présentation en couches : l'essentiel d'abord, le reste à la demande, sur un même écran. Un assistant est une suite d'étapes séquentielles pour accomplir une tâche. La divulgation progressive n'impose pas d'ordre.
2. C'est la possibilité de configurer un élément depuis l'endroit où il est utilisé, sans quitter le contexte, avec la portée du changement affichée.
3. Par exemple, les rôles et permissions, et la politique de mots de passe. Ils ont un effet global ou demandent une vue d'ensemble, sans lien avec un seul écran.
4. Parce que le même geste peut modifier un seul formulaire ou tous les formulaires d'un type. Sans portée affichée, l'administrateur peut modifier le global sans le savoir.
5. On la promeut au niveau essentiel, car elle est de fait nécessaire à la majorité. On vérifie aussi sa valeur par défaut : si presque tout le monde la change, c'est peut-être que la valeur par défaut est mal choisie.

## 12.5 Formulaires et assistants

### 1. Comprendre simplement

Un **formulaire** (*form*, au pluriel *forms*) est l'écran par lequel on **saisit ou modifie** les informations d'une ressource. Un **assistant** (*wizard*, au pluriel *wizards*) est un parcours en **étapes successives** qui guide une tâche complexe ou peu fréquente.

**Pourquoi cela existe.** La saisie est le moment où les données entrent dans le système. Un mauvais formulaire produit de mauvaises données, des abandons et des tickets de support. Certaines tâches (créer un workflow, brancher une intégration) dépassent ce qu'un seul écran peut rendre compréhensible : il faut les décomposer et guider.

**Problème résolu.** Obtenir des données correctes et complètes avec un effort minimal, et permettre à une personne de réussir une tâche qu'elle ne fait presque jamais.

**Modèle mental.** Le formulaire est la fiche que l'on remplit à un guichet. L'assistant est un conseiller qui pose les questions une par une, dans le bon ordre, et récapitule avant de valider.

**Où l'analogie s'arrête.** À un guichet, l'agent corrige à voix haute et on peut tout reprendre sur le champ. Ici, l'interface doit anticiper les erreurs, valider, conserver la saisie, et gérer des accès simultanés par plusieurs personnes.

**Exemple.** Le formulaire « Constat » n'affiche le champ « Mesure » que si le type est « Usure ». L'assistant « Créer un workflow » compte quatre étapes : choisir un modèle de départ, définir les états, définir les transitions et les rôles, puis réviser et publier.

**Les composants.**

1. des **champs**, regroupés en **sections** ;
2. des **règles** : obligatoire, visible sous condition, validations ;
3. des **messages** d'aide et d'erreur ;
4. des **actions** : enregistrer, annuler ;
5. pour l'assistant, des **étapes**, une **progression** et un **résumé final**.

**Objectif d'apprentissage :** vous pouvez décrire ce qui rend un formulaire utilisable, expliquer où doit se faire la validation, et décider quand un assistant est justifié.

### 2. Connaissances essentielles

#### Définition

- **Formulaire** : interface de saisie ou de modification des champs d'une ressource, avec des règles de validation.
- **Assistant** : interface qui décompose une tâche en étapes ordonnées, avec une navigation entre les étapes et un récapitulatif avant la validation.

#### Idées fondamentales

1. **Un formulaire ne demande que le nécessaire.** Chaque champ a un coût en temps et en erreurs.
2. **Il guide plutôt qu'il ne sanctionne.** Libellés clairs, aides, valeurs par défaut, exemples.
3. **La validation est immédiate, précise et proche du champ.** Le message dit quoi corriger.
4. **Les règles viennent du schéma, une seule fois.** L'interface les relaie, le serveur les applique : la validation côté interface ne protège rien à elle seule.
5. **On ne perd jamais la saisie.** Erreur, conflit ou session expirée : le contenu saisi est conservé.
6. **Un assistant sert aux tâches complexes, rares ou dépendantes.** Il ralentit les experts sur des tâches quotidiennes.
7. **Un assistant est réversible jusqu'au dernier pas.** On peut revenir, et un résumé précède la validation.

#### Vocabulaire essentiel

- **Champ** (*field*) : élément de saisie correspondant à une propriété.
- **Libellé** (*label*) : texte visible qui nomme le champ.
- **Texte indicatif** (*placeholder*) : exemple affiché dans un champ vide ; il ne remplace pas le libellé.
- **Validation en ligne** (*inline validation*) : contrôle effectué pendant la saisie, avec message près du champ.
- **Condition d'affichage** (*conditional display*) : règle qui rend un champ visible ou obligatoire selon une autre valeur.
- **Enregistrement automatique** (*autosave*) : conservation périodique de la saisie en brouillon.
- **Étape** (*step*) : unité d'un assistant, qui regroupe quelques champs ou une décision.
- **Résumé** (*review step*) : dernière étape qui récapitule les choix avant validation.

#### Relations de cause à effet

- Beaucoup de champs obligatoires sans utilité. Les personnes saisissent « N/A » ou « 0 » pour avancer, et les données deviennent inexploitables.
- Un message générique (« Valeur invalide »). L'utilisateur ne sait pas quoi corriger, et tente au hasard.
- La validation n'existe que dans l'interface. Un import ou un appel d'API contourne les règles, et des données invalides entrent.
- Un assistant pour une tâche quotidienne. Les experts perdent du temps à cliquer sur « Suivant ».
- La saisie est perdue à la première erreur ou à l'expiration de session. Les personnes abandonnent.

#### Idées reçues

- **« Le texte indicatif peut remplacer le libellé. »** Il disparaît dès que l'on tape, il est peu contrasté et mal annoncé par les technologies d'assistance. Le libellé reste visible.
- **« Il faut valider à chaque frappe. »** C'est agressif : l'erreur s'affiche avant que la personne ait fini. On valide à la sortie du champ, puis on corrige en direct.
- **« Plus d'étapes, c'est plus simple. »** Chaque étape ajoute de la navigation. On regroupe les décisions qui vont ensemble.

#### Principe clé

On demande le strict nécessaire, on valide près du champ avec un message utile, le serveur reste l'autorité, et l'on ne perd jamais la saisie.

#### Si vous ne retenez que trois choses

1. Chaque champ, chaque champ obligatoire en particulier, a un coût : on ne demande que le nécessaire.
2. La validation d'interface aide ; seule la validation du serveur protège.
3. Un assistant convient aux tâches rares, complexes ou dépendantes, avec un résumé avant la validation.

### 3. Explication technique détaillée

#### Un formulaire décrit par le schéma

Dans une plateforme pilotée par métadonnées (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)), un formulaire est une donnée. Les règles de visibilité et d'obligation sont des expressions (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)).

```json
{
  "form": "finding_edit",
  "resource": "finding",
  "sections": [
    { "title": "Description", "fields": [
        { "field": "title", "required": true, "help": "Résumez le constat en une phrase." },
        { "field": "type", "required": true },
        { "field": "wear_measure", "visible_if": "type = 'wear'", "required_if": "type = 'wear'" }
    ]},
    { "title": "Suivi", "fields": [ "assigned_to", "due_date" ] }
  ]
}
```

Les conditions `visible_if` et `required_if` sont évaluées par le même moteur d'expressions côté interface et côté serveur. Ainsi, un champ caché ne peut pas devenir obligatoire par erreur, et le serveur refuse un champ « Mesure » absent quand le type est « Usure ».

#### Les quatre couches de validation

| Couche | Moment | Exemple | Rôle |
|---|---|---|---|
| Contrainte de saisie | Pendant la frappe | Masque de date, clavier numérique | Prévenir l'erreur |
| Validation de champ | À la sortie du champ | « Format de date invalide » | Corriger tôt |
| Validation de formulaire | À l'envoi | « L'échéance doit suivre la date du constat » | Cohérence entre champs |
| Validation du serveur | À l'enregistrement | Unicité, règles métier, droits | Autorité finale |

La validation côté interface est une aide ergonomique. La validation côté serveur est la seule qui protège (voir [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) et [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)).

#### Les messages d'erreur

Un bon message dit **quoi**, **pourquoi** et **comment corriger**. Il est placé près du champ, et il ne repose pas sur la seule couleur.

| À éviter | À préférer |
|---|---|
| « Valeur invalide. » | « La date d'échéance doit être postérieure au 2026-10-13, date du constat. » |
| « Erreur 422. » | « Cette immatriculation est déjà utilisée par un autre aéronef. » |
| « Champ requis ! » | « Indiquez la mesure : elle est requise pour un constat d'usure. » |

Le serveur renvoie les erreurs par champ, dans un format normalisé (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)), et l'interface les rattache aux champs concernés :

```json
{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "La validation a échoué",
  "status": 422,
  "request_id": "req_91ab33",
  "errors": [
    { "field": "due_date", "code": "must_be_after", "message": "L'échéance doit être postérieure à la date du constat." }
  ]
}
```

Pour un long formulaire, un résumé en haut de page liste les erreurs, chacune avec un lien vers le champ, et le focus se place sur la première.

#### Les conflits et la perte de saisie

- **Conflit de version.** Si quelqu'un a modifié la ressource entre l'ouverture et l'enregistrement, le verrouillage optimiste le détecte (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)). L'interface affiche les différences et laisse choisir, plutôt que d'écraser.
- **Enregistrement automatique.** Les formulaires longs conservent un brouillon, local ou serveur.
- **Session expirée.** On redemande l'authentification sans perdre la page.
- **Réseau instable.** Les saisies en atelier ou en déplacement sont mises en file puis envoyées au retour de la connexion.

#### Quand utiliser un assistant

| Convient | Ne convient pas |
|---|---|
| Tâche rare ou nouvelle pour la personne | Tâche quotidienne d'un expert |
| Étapes dépendantes : un choix conditionne la suite | Champs indépendants les uns des autres |
| Décision à guider (choisir un modèle, un type) | Édition simple d'une ressource |
| Risque élevé : un résumé avant validation protège | Modification mineure et réversible |

```text
Étape 1 ───► Étape 2 ───► Étape 3 ───────► Étape 4
Modèle       États        Transitions       Révision
  ●────────────○────────────○─────────────────○
[Précédent]                    [Suivant]   [Enregistrer et quitter]
```

Les règles d'un bon assistant :

1. **Montrer la position** : numéro d'étape, nombre d'étapes, titres.
2. **Autoriser le retour** sans perdre la saisie.
3. **Valider étape par étape**, pour ne pas découvrir toutes les erreurs à la fin.
4. **Permettre d'enregistrer et de reprendre** plus tard. L'état de l'assistant est conservé côté serveur.
5. **Terminer par un résumé** qui nomme ce qui va se passer : « Publier le workflow (2 vues seront mises à jour) ».
6. **Laisser passer** les étapes facultatives.

#### Les formulaires générés

Générer les formulaires à partir du schéma donne cohérence et rapidité : un nouveau champ apparaît partout. La limite est qu'un formulaire généré ne sait pas exprimer tout ce qu'un cas métier demande (grille de saisie, champ composé, widget spécialisé). On prévoit des **points d'extension** : un composant personnalisé pour un champ donné (voir [10.15 Interface personnalisée et workflows personnalisés](10-api-integrations-extensibilite.md#1015-interface-personnalisée-et-workflows-personnalisés)).

#### L'accessibilité

- un libellé associé à chaque champ, lu par les technologies d'assistance ;
- le caractère obligatoire indiqué par du texte, pas seulement par une couleur ou une étoile ;
- les messages d'erreur reliés au champ ;
- l'ordre de tabulation conforme à l'ordre visuel ;
- un bouton d'envoi qui n'est pas simplement désactivé sans explication (voir [12.14 Explicabilité](#1214-explicabilité)).

#### Les modes de défaillance

- **Trop de champs obligatoires**, donc des valeurs factices.
- **Des messages génériques.**
- **Des validations uniquement dans l'interface.**
- **Une perte de saisie** après une erreur ou un conflit.
- **Un assistant sans retour possible**, ni reprise.
- **Des conditions croisées illisibles** : un champ devient obligatoire pour des raisons que personne ne comprend (voir [12.15 Conscience de l'impact](#1215-conscience-de-limpact)).

**Contre-exemple.** Un formulaire de 35 champs obligatoires, dont 20 sont inutiles pour le technicien. Les techniciens saisissent « 0 » ou « N/A » pour avancer. Un an plus tard, les statistiques calculées sur ces champs sont inutilisables.

**Limites.** Un bon formulaire ne remplace pas une bonne conception de la tâche : si les données demandées ne servent à personne, le meilleur formulaire n'y change rien. Les règles de dépendance complexes deviennent difficiles à comprendre et à tester.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les formulaires configurables sont des métadonnées interprétées par le moteur d'interface |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) et [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Les règles de validation et le format d'erreur viennent du modèle et du runtime |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le verrouillage optimiste détecte les conflits de saisie |
| [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) | Les conditions de visibilité sont des expressions |
| [12.2 Design systems](#122-design-systems) | Les composants de champ viennent du système de conception |
| [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle) | La divulgation progressive organise les champs d'un formulaire en niveaux |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | Les états d'erreur du formulaire suivent les motifs standardisés |
| [12.14 Explicabilité](#1214-explicabilité) | Un champ ou un bouton désactivé doit dire pourquoi |

### 5. Application pratique

**Situation initiale.** Les techniciens enregistrent les constats sur une tablette, dans le hangar. Le formulaire compte 28 champs, tous obligatoires. La saisie prend en moyenne six minutes, et beaucoup de champs contiennent « N/A ».

**Problème.** Le formulaire sert le modèle de données plutôt que la tâche du technicien.

**Application du concept.** Une refonte du formulaire fondée sur la tâche réelle.

**Déroulé.**

1. L'équipe observe des techniciens et identifie sept informations utiles dès la saisie : aéronef, zone, type, description, gravité, photo, technicien.
2. Ces sept champs forment le formulaire principal. Les 21 autres passent dans une section « Détails », optionnelle.
3. Le champ « Mesure » devient conditionnel : il n'apparaît que pour un constat d'usure, et il est alors obligatoire.
4. La validation est faite à la sortie du champ, avec des messages qui disent comment corriger.
5. Le formulaire enregistre un brouillon local : un passage en zone sans réseau ne perd rien.
6. La première création d'un modèle de constat par un administrateur passe par un assistant en quatre étapes, avec un résumé avant publication.

**Résultat.** La saisie passe de six minutes à environ une minute et demie, et les valeurs « N/A » disparaissent des champs essentiels.

**Limites.** Certains champs déplacés dans « Détails » étaient exigés par des rapports réglementaires. Ils sont obligatoires à la clôture du constat, pas à sa création : la règle est une condition de transition (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)), non une obligation de saisie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le texte indicatif ne remplace-t-il pas le libellé ?
2. **Compréhension.** Citez les quatre couches de validation et ce que chacune apporte.
3. **Compréhension.** Dans quels cas un assistant est-il justifié ?
4. **Pourquoi.** Pourquoi la validation côté interface ne suffit-elle pas ?
5. **Raisonnement pratique.** Un formulaire perd la saisie quand la session expire. Comment le concevez-vous pour éviter cela ?

#### Réponses

1. Parce qu'il disparaît dès que l'on tape, que son contraste est faible et que les technologies d'assistance le lisent mal. Le libellé reste visible en permanence et identifie le champ.
2. Contrainte de saisie (prévenir l'erreur), validation de champ (corriger tôt), validation de formulaire (cohérence entre champs), validation du serveur (autorité finale qui protège les données).
3. Pour une tâche rare, nouvelle, ou dont les étapes sont dépendantes, ou quand le risque justifie un résumé avant validation. Pas pour une tâche quotidienne d'expert.
4. Parce qu'un import, un appel d'API ou un client modifié contourne l'interface. Seule la validation du serveur s'applique à tous les chemins d'entrée.
5. On enregistre un brouillon (local ou serveur) pendant la saisie, on redemande l'authentification sans quitter la page, et on rejoue l'envoi après la reconnexion, sans perdre les données saisies.

## 12.6 Tables, filtres, recherche et vues

### 1. Comprendre simplement

Une **table** (*table*) affiche une liste de ressources en lignes et en colonnes. Les **filtres** (*filters*) restreignent cette liste selon des critères structurés. La **recherche** (*search*) retrouve des éléments à partir de mots. Une **vue** (*view*, au pluriel *views*) est une combinaison enregistrée de colonnes, de filtres, de tri et de regroupements.

**Pourquoi cela existe.** Les utilisateurs passent l'essentiel de leur temps à chercher, comparer et parcourir des données. Une plateforme manipule des milliers ou des millions d'enregistrements, de types définis par l'administrateur. Sans bons outils de tri, de filtrage et de recherche, ces données sont inaccessibles.

**Problème résolu.** Trouver vite le bon sous-ensemble, le comprendre d'un coup d'œil, puis agir dessus.

**Modèle mental.** Une bibliothèque. Les rayonnages sont la table. Les fiches de classement sont les filtres. Le catalogue interrogeable est la recherche. Les listes de lecture enregistrées sont les vues.

**Où l'analogie s'arrête.** La bibliothèque est la même pour tous. Ici, chaque personne ne voit que ce que ses droits autorisent, les données changent pendant que l'on regarde, et les « livres » sont des types d'objets créés par les clients.

**Exemple.** Un planificateur veut les aéronefs de la base de Lyon dont la prochaine inspection est dans moins de 30 jours, triés par date. Il enregistre ce résultat comme vue « À inspecter à Lyon » et la partage avec son équipe.

**Les composants.**

1. la **table** : colonnes, tri, pagination, sélection ;
2. les **filtres** : champ, opérateur, valeur ;
3. la **recherche** : saisie libre et index ;
4. les **vues** : sauvegarde, partage, vue par défaut ;
5. les **actions** sur la sélection (voir [12.8 Actions en masse](#128-actions-en-masse)).

**Objectif d'apprentissage :** vous pouvez choisir entre filtre et recherche, adapter les opérateurs au type de champ, et expliquer les contraintes de volume et de droits.

### 2. Connaissances essentielles

#### Définition

- **Table** : présentation tabulaire d'une liste de ressources, dont chaque ligne est un enregistrement et chaque colonne une propriété.
- **Filtre** : condition structurée (champ, opérateur, valeur) qui restreint un ensemble.
- **Recherche** : récupération d'éléments pertinents à partir d'une requête libre, le plus souvent par un index.
- **Vue** : définition enregistrée de la présentation d'une liste (colonnes, filtres, tri, regroupement, portée).

#### Idées fondamentales

1. **Colonnes, filtres et tri se déduisent du schéma.** Le type du champ détermine l'opérateur proposé : contient pour du texte, entre pour un nombre, dans les 30 prochains jours pour une date.
2. **Filtre et recherche sont complémentaires.** Le filtre exprime une condition précise. La recherche aide quand on connaît seulement un mot.
3. **L'état de la liste est visible et partageable.** Les filtres actifs sont affichés, et l'adresse reflète l'état.
4. **Le volume impose des choix techniques.** Pagination ou défilement virtuel, tri et filtre côté serveur, total approximatif.
5. **Les résultats respectent les droits.** Lignes, colonnes et résultats de recherche sont filtrés (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
6. **Une vue est une donnée.** On l'enregistre, on la partage, on la versionne (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)).
7. **« Aucun résultat » est un état à concevoir.** Il explique et propose une issue (voir [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur)).

#### Vocabulaire essentiel

- **Tri** (*sort*) : ordre des lignes selon une ou plusieurs colonnes.
- **Pagination** (*pagination*) : découpage de la liste en pages.
- **Défilement virtuel** (*virtual scrolling*) : affichage des seules lignes visibles, pour de grands volumes.
- **Opérateur** (*operator*) : relation de comparaison d'un filtre (égal, contient, avant…).
- **Facette** (*facet*) : filtre par catégorie avec décompte, par exemple « Base (Lyon : 12, Paris : 30) ».
- **Recherche plein texte** (*full-text search*) : recherche dans le contenu textuel, classée par pertinence.
- **Index de recherche** (*search index*) : structure dédiée à la recherche rapide, alimentée par les données.
- **Vue enregistrée** (*saved view*) : vue conservée et réutilisable.

#### Relations de cause à effet

- Les mêmes opérateurs sont proposés pour tous les types. Les utilisateurs construisent des filtres absurdes (« contient » sur une date).
- Le tri et le filtre se font dans le navigateur sur un million de lignes. La page devient lente et consomme toute la mémoire.
- L'index de recherche n'applique pas les droits. Des résultats révèlent l'existence ou le contenu d'éléments interdits.
- L'état de la table n'est pas conservé. L'utilisateur perd ses filtres au moindre retour en arrière.
- L'index est alimenté de façon asynchrone. Un enregistrement créé à l'instant n'apparaît pas encore dans la recherche.

#### Idées reçues

- **« La recherche suffit, les filtres sont inutiles. »** Une recherche textuelle ne sait pas exprimer « date inférieure à 30 jours » ni « statut parmi trois valeurs ».
- **« Le défilement infini est toujours préférable. »** Il fait perdre la position, empêche de retrouver une ligne et gêne l'accès au pied de page. Pour le travail de pilotage, on préfère la pagination ou la virtualisation avec des repères.
- **« Le total exact est indispensable. »** Il est coûteux à calculer. Un total approximatif ou « plus de 10 000 » suffit souvent (voir [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)).

#### Principe clé

Une liste puissante laisse exprimer une condition précise par filtre, retrouver par la recherche, garder l'état dans des vues, et respecte toujours les droits et le volume.

#### Si vous ne retenez que trois choses

1. Les colonnes, filtres et opérateurs dépendent du schéma et du type de chaque champ.
2. Filtre et recherche répondent à deux besoins différents ; une vue enregistre une combinaison réutilisable.
3. Les droits et le volume imposent le calcul côté serveur et l'application des permissions aux résultats.

### 3. Explication technique détaillée

#### La table

| Décision | Recommandation | Raison |
|---|---|---|
| Alignement | Texte à gauche, nombres à droite | Comparaison des chiffres |
| Colonne d'identité | Figée à gauche | Repère pendant le défilement horizontal |
| En-tête | Figé | Repère pendant le défilement vertical |
| Densité | Compacte ou confortable, au choix | Experts et occasionnels |
| Tri | Indicateur visible ; tri sur plusieurs colonnes | Compréhension de l'ordre |
| Sélection | Cases à cocher ; « tout sélectionner » explicite | Actions en masse |
| Colonnes | Configurables, ordre mémorisé | Besoins différents |
| Actions de ligne | Menu contextuel plutôt que cinq boutons | Lisibilité |

#### Les filtres et leurs opérateurs

| Type de champ | Opérateurs pertinents |
|---|---|
| Texte | est, contient, commence par, est vide |
| Nombre | égal, différent, inférieur, supérieur, entre |
| Date | avant, après, entre, aujourd'hui, dans les N prochains jours |
| Énumération | est l'une de, n'est pas |
| Booléen | vrai, faux |
| Référence | est, appartient à (via une relation) |

Les filtres s'assemblent en groupes logiques. Ils sont décrits dans une structure que l'interface construit et que le serveur exécute (voir [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) et [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)).

```json
{
  "filter": {
    "and": [
      { "field": "base", "op": "in", "value": ["LYS", "CDG"] },
      { "field": "next_inspection_date", "op": "within_next", "value": { "days": 30 } },
      { "or": [
          { "field": "status", "op": "eq", "value": "active" },
          { "field": "status", "op": "eq", "value": "in_inspection" }
      ]}
    ]
  }
}
```

La même structure sert à l'interface, à l'API et à la définition des vues : une vue enregistrée est un filtre nommé.

#### La recherche

| Type | Principe | Usage | Limite |
|---|---|---|---|
| Exacte | Correspondance sur un identifiant | Retrouver un objet connu (une immatriculation) | Ne tolère aucune faute |
| Plein texte | Index de mots, classement par pertinence | Textes libres (descriptions de constats) | Index à maintenir ; résultats approchés |
| Tolérante | Accepte des fautes ou des variantes | Noms propres | Faux positifs |
| Structurée | Syntaxe `champ:valeur` | Utilisateurs experts | Demande un apprentissage |

Dans une plateforme multi-tenant :

- l'index est **cloisonné par tenant**, ou le filtre de tenant est obligatoire dans chaque requête ;
- les résultats sont **filtrés par permission** au niveau de la ressource, du champ et de la ligne (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), sans révéler le nombre de résultats cachés ;
- l'index est alimenté par les événements (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) : il est donc **cohérent à terme** (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)). L'interface peut le signaler (« résultats à jour il y a quelques secondes »).

#### Les vues

```json
{
  "view": "inspections_lyon",
  "resource": "aircraft",
  "columns": ["registration", "type", "base", "status", "next_inspection_date"],
  "filter": { "and": [
    { "field": "base", "op": "eq", "value": "LYS" },
    { "field": "next_inspection_date", "op": "within_next", "value": { "days": 30 } }
  ]},
  "sort": [ { "field": "next_inspection_date", "dir": "asc" } ],
  "scope": "team:planning"
}
```

Une vue a une **portée** (personnelle, équipe, tenant). On distingue la vue enregistrée de la **vue modifiée non enregistrée** : l'interface le signale (« Modifiée — Enregistrer, Réinitialiser »), pour qu'une personne ne croie pas avoir changé la vue partagée.

#### Volume et performance

- **Pagination par curseur** pour les listes volumineuses (voir [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)).
- **Index adaptés** : un tri ou un filtre sur une colonne sans index devient une lecture complète (voir [2.14 Index](02-donnees-ressources.md#214-index)). On limite les colonnes triables aux colonnes indexées, ou on prévient.
- **Total approximatif** quand le total exact coûte trop.
- **Recherche avec délai** : on attend une courte pause de saisie avant d'interroger le serveur.
- **Colonnes calculées** : elles coûtent à chaque ligne affichée, d'où des limites ou une pré-agrégation.

#### Les modes de défaillance

- **Le calcul dans le navigateur** de volumes que le serveur devrait traiter.
- **Un filtre qui ignore les droits** ou une recherche qui fuit.
- **L'état perdu** : filtres oubliés au retour.
- **Des opérateurs inadaptés** au type de champ.
- **Une vue partagée modifiée par accident.**
- **Un index obsolète non signalé.**

**Contre-exemple.** Une table charge les 80 000 lignes dans le navigateur pour trier et filtrer localement. Sur le poste d'un planificateur, la page met 40 secondes à s'afficher, et le tri bloque l'écran. Le jour où le volume double, la page ne s'ouvre plus.

**Limites.** Les filtres expriment ce qu'on sait demander ; ils ne remplacent ni l'analyse (voir [12.7 Tableaux de bord](#127-tableaux-de-bord)) ni la qualité des données. Une recherche plein texte donne des résultats approchés : on ne lui confie pas une décision qui exige l'exactitude.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les vues configurables sont les métadonnées de ces listes |
| [2.14 Index](02-donnees-ressources.md#214-index) et [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Les index et le modèle de requête rendent les filtres et le tri possibles |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | La pagination et le filtrage de l'API alimentent la table |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les permissions s'appliquent à chaque résultat |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | L'index de recherche est cohérent à terme |
| [12.8 Actions en masse](#128-actions-en-masse) | Les actions en masse agissent sur la sélection |
| [12.9 Palette de commandes](#129-palette-de-commandes) | La palette de commandes complète la recherche pour les actions |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | « Aucun résultat » est un état vide à concevoir |

### 5. Application pratique

**Situation initiale.** Le tenant compte 180 000 tâches de maintenance. L'écran « Tâches » les affiche dans une table, avec une recherche par mot et un seul filtre sur le statut. Les planificateurs recréent chaque matin la même sélection : tâches de la base de Lyon, en retard, par priorité.

**Problème.** La liste n'exprime pas les conditions utiles, l'état n'est pas conservé, et la page est lente.

**Application du concept.** Une refonte de la liste et des vues.

**Déroulé.**

1. L'équipe ajoute des filtres typés : base (énumération), échéance (date avec « en retard » et « dans les N jours »), priorité, technicien assigné.
2. Elle déporte le tri, le filtre et la pagination côté serveur, par curseur, sur des colonnes indexées.
3. Elle permet d'enregistrer des vues partageables par équipe. La vue « En retard à Lyon » devient la vue par défaut de l'équipe de planification.
4. L'état de la liste est encodé dans l'adresse : un collègue ouvre le même résultat en suivant un lien.
5. La recherche plein texte porte sur les descriptions, avec filtrage par permission et une indication de fraîcheur.
6. L'état « Aucun résultat » propose d'élargir le filtre ou de retirer le dernier critère.

**Résultat.** Le temps d'affichage passe de plusieurs secondes à moins d'une seconde pour la page courante. Les planificateurs ouvrent leur vue en un clic, et les nouveaux arrivants héritent des vues d'équipe.

**Limites.** Chaque colonne triable doit être indexée ; l'équipe a donc limité le tri aux colonnes indexées. Un tri sur une colonne calculée demande une pré-agrégation.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un filtre et une recherche ?
2. **Compréhension.** Qu'est-ce qu'une vue, et quelles informations contient-elle ?
3. **Compréhension.** Pourquoi les opérateurs de filtre dépendent-ils du type de champ ?
4. **Pourquoi.** Pourquoi l'index de recherche doit-il appliquer les permissions ?
5. **Raisonnement pratique.** Une liste de 500 000 enregistrements se charge en 30 secondes. Quelles sont vos hypothèses et vos actions ?

#### Réponses

1. Un filtre exprime une condition structurée et précise (champ, opérateur, valeur). Une recherche part d'un texte libre et classe des résultats approchés par pertinence. Les deux sont complémentaires.
2. Une vue est une définition enregistrée de la présentation d'une liste : colonnes, filtres, tri, regroupement et portée (personnelle, équipe, tenant). C'est une donnée qui peut être partagée et versionnée.
3. Parce que les comparaisons n'ont de sens que selon le type : « contient » pour un texte, « entre » pour un nombre, « dans les N prochains jours » pour une date. Proposer les mêmes opérateurs partout conduit à des filtres absurdes.
4. Parce qu'un résultat de recherche peut révéler l'existence ou le contenu d'un élément que la personne n'a pas le droit de voir. Les droits doivent s'appliquer à chaque résultat, comme dans la liste.
5. Hypothèses : tri et filtre dans le navigateur, absence d'index, pagination par décalage profond, calcul d'un total exact. Actions : déporter le calcul côté serveur, ajouter des index adaptés, passer à une pagination par curseur, rendre le total approximatif.

## 12.7 Tableaux de bord

### 1. Comprendre simplement

Un **tableau de bord** (*dashboard*, au pluriel *dashboards*) est une page qui **synthétise visuellement** des indicateurs et des listes clés, pour **répondre à des questions et déclencher des actions**.

**Pourquoi cela existe.** Les responsables et les opérateurs ne peuvent pas parcourir des milliers de lignes pour savoir où regarder. Ils ont besoin d'une vue d'ensemble : où est le problème, où va la tendance, que dois-je traiter en premier.

**Problème résolu.** Passer de la donnée à la décision d'un coup d'œil, puis mener directement vers le détail utile.

**Modèle mental.** Le tableau de bord d'un cockpit. Peu d'instruments, bien choisis, lisibles d'un coup d'œil. Un voyant attire l'attention quand quelque chose sort de la normale.

**Où l'analogie s'arrête.** Un cockpit est conçu une fois, pour un usage connu. Un tableau de bord de plateforme est configuré par chaque tenant, avec ses données et ses définitions, pour des publics différents.

**Exemple.** « Santé de la flotte » affiche le nombre d'aéronefs actifs et en inspection, les inspections en retard, les échéances des 30 prochains jours et les constats ouverts. Chaque tuile mène à la liste filtrée qui l'explique.

**Les composants.**

1. la **question** posée et le **public** visé ;
2. des **widgets** : indicateurs, graphiques, listes ;
3. des **définitions** d'indicateurs ;
4. des **filtres globaux** ;
5. l'**actualisation** et l'indication de fraîcheur ;
6. l'**exploration vers le détail**.

**Objectif d'apprentissage :** vous pouvez concevoir un tableau de bord à partir de questions, expliquer pourquoi la définition d'un indicateur doit être unique, et décrire les options de calcul.

### 2. Connaissances essentielles

#### Définition

**Tableau de bord** : interface qui regroupe, pour un public et un objectif donnés, des indicateurs, des graphiques et des listes calculés sur les données, avec un accès au détail.

#### Idées fondamentales

1. **Un tableau de bord répond à des questions précises, pour un public précis.** Ce n'est pas une collection de graphiques.
2. **Un chiffre n'a de sens qu'avec un contexte.** Comparaison à un objectif, à la période précédente, tendance.
3. **Chaque indicateur mène à l'action.** Un clic ouvre la liste filtrée qui l'explique.
4. **La fraîcheur est visible.** On indique l'heure des données.
5. **La hiérarchie visuelle guide.** L'important est en haut et en grand.
6. **Les droits s'appliquent.** La même tuile peut donner des résultats différents selon la personne.
7. **Un indicateur a une définition unique.** Le chiffre de la tuile et la liste qui s'ouvre concordent.

#### Vocabulaire essentiel

- **Indicateur clé** (*KPI*, *key performance indicator*) : mesure choisie pour suivre un objectif.
- **Widget** ou **tuile** : élément du tableau de bord (chiffre, graphique, liste).
- **Agrégation** (*aggregation*) : calcul de synthèse (nombre, somme, moyenne) sur un ensemble.
- **Exploration vers le détail** (*drill-down*) : passage d'un chiffre aux enregistrements qui le composent.
- **Filtre global** : filtre appliqué à tous les widgets du tableau de bord.
- **Pré-agrégation** (*pre-aggregation*) : calcul à l'avance des agrégats, mis à jour au fil des changements.
- **Mesure** (*measure*) : définition nommée et réutilisable d'un indicateur.
- **Indicateur de vanité** (*vanity metric*) : chiffre flatteur qui ne déclenche aucune décision.

#### Relations de cause à effet

- Il y a trop de widgets. Rien ne ressort, et plus personne ne regarde.
- Les indicateurs sont sans comparaison. Un « 41 » n'est ni bon ni mauvais.
- Chaque affichage recalcule sur de gros volumes. La page est lente et la base est chargée.
- Les données sont périmées sans que cela se voie. Des décisions s'appuient sur un état ancien.
- Le chiffre de la tuile ne correspond pas à la liste après le clic. La confiance dans le tableau de bord disparaît.

#### Idées reçues

- **« Plus il y a de graphiques, plus c'est informatif. »** Au contraire : l'attention se dilue.
- **« Le tableau de bord remplace les rapports. »** Il sert à surveiller et à orienter. Les rapports servent à analyser en détail et à prouver.
- **« Un graphique en secteurs convient à tout. »** Pour comparer des quantités, des barres sont plus lisibles. Pour une tendance, une ligne.
- **« Un chiffre en hausse est une bonne nouvelle. »** Tout dépend de ce qu'il mesure, et de l'objectif visé.

#### Principe clé

Un tableau de bord part d'une question, donne un contexte à chaque chiffre, garde une définition unique et mène du chiffre au détail.

#### Si vous ne retenez que trois choses

1. On conçoit un tableau de bord à partir des questions d'un public, pas à partir des données disponibles.
2. Un indicateur a une définition unique, partagée avec les listes qui l'expliquent.
3. Le calcul est maîtrisé (pré-agrégation, cache) et respecte les droits.

### 3. Explication technique détaillée

#### L'anatomie d'un tableau de bord

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Santé de la flotte      Base : [ Toutes ▾ ]      Données au 2026-10-13 08:30     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Actifs 41 (+2)   En inspection 6 (−1)   En retard 3 (objectif 0)   Constats 17   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Échéances des 30 prochains jours, par semaine                                    │
│ S1 ████████ 4     S2 ██████████████ 7     S3 ████ 2     S4 ██████ 3              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ À traiter : F-ABCD (retard de 4 jours)   F-GHIJ (retard de 2 jours)              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

On lit de haut en bas : le **contexte** (filtre global, fraîcheur), les **indicateurs clés** avec leur comparaison, une **tendance ou une répartition**, puis une **liste à traiter**. Chaque élément mène à une liste filtrée.

#### Quelle question, quelle représentation

| Question | Représentation | Exemple |
|---|---|---|
| Combien ? | Chiffre avec comparaison | Inspections en retard : 3 (objectif 0) |
| Comment cela évolue-t-il ? | Ligne ou barres dans le temps | Constats ouverts par semaine |
| Comment cela se répartit-il ? | Barres horizontales triées | Constats par gravité |
| Que dois-je traiter ? | Liste courte, triée par urgence | Dix inspections les plus en retard |
| Sommes-nous dans l'objectif ? | Chiffre et seuil, avec couleur et texte | Disponibilité de la flotte contre l'objectif |

#### Un tableau de bord décrit par des métadonnées

```json
{
  "dashboard": "fleet_health",
  "scope": "tenant",
  "filters": [ { "key": "base", "field": "base", "type": "enum", "default": "all" } ],
  "widgets": [
    { "id": "w1", "type": "kpi", "title": "Aéronefs actifs",
      "measure": "active_aircraft",
      "compare": { "to": "previous_period" },
      "on_click": { "open_view": "active_aircraft" } },
    { "id": "w2", "type": "kpi", "title": "Inspections en retard",
      "measure": "overdue_inspections",
      "target": 0,
      "on_click": { "open_view": "overdue_inspections" } },
    { "id": "w3", "type": "list", "title": "À traiter",
      "view": "overdue_inspections", "limit": 10 }
  ],
  "refresh": { "mode": "interval", "seconds": 300 }
}
```

Un widget référence une **mesure** et une **vue** : il ne contient pas de requête libre.

#### Une définition unique par indicateur

```json
{
  "measures": [
    { "key": "overdue_inspections",
      "label": "Inspections en retard",
      "resource": "aircraft",
      "where": { "field": "next_inspection_date", "op": "lt", "value": { "fn": "today" } },
      "agg": "count" }
  ]
}
```

La tuile et la vue « Inspections en retard » référencent la **même** mesure. Si deux écrans calculent « en retard » différemment (l'un compte les aéronefs déjà en inspection, l'autre non), les chiffres divergent, et la confiance disparaît. La mesure nommée joue le rôle d'une couche sémantique : une seule définition, utilisée par la tuile, la liste, l'export et l'API.

#### Le calcul

| Approche | Principe | Avantage | Limite |
|---|---|---|---|
| À la volée | Requête d'agrégation à chaque affichage | Toujours à jour ; simple | Lente sur de gros volumes ; charge la base |
| Avec cache | Résultat conservé quelques minutes | Rapide ; simple | Données légèrement anciennes ; clé de cache à soigner |
| Pré-agrégée | Compteurs mis à jour par les événements (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) | Très rapide ; coût stable | Complexité ; cohérence à terme (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)) |
| Modèle de lecture dédié | Magasin séparé alimenté par les événements (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)) | Découple lecture et écriture | Infrastructure supplémentaire |

La clé de cache contient le **tenant**, les **filtres** et le **profil de permissions** : deux personnes qui n'ont pas les mêmes droits ne partagent pas un résultat.

#### Droits et multi-tenant

- **Les résultats suivent les permissions.** Un total calculé sur des lignes que la personne ne peut pas voir est une fuite d'information (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Les petits effectifs.** Un compte de 1 sur une population restreinte peut identifier une personne. Dans les contextes sensibles, on applique un seuil minimal d'agrégation.
- **Les tableaux de bord inter-tenants** réservés à l'opérateur de la plateforme n'affichent que des agrégats, jamais les données d'un tenant (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
- **Les définitions par tenant.** Un tenant peut redéfinir « en retard » selon son métier. La mesure est donc une donnée du tenant (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).

#### La lisibilité

- les barres commencent à zéro, sinon les écarts sont trompeurs ;
- les unités et les périodes sont explicites ;
- « pas de donnée » se distingue de « zéro » ;
- la couleur ne porte pas seule le sens : on ajoute un texte ou une icône ;
- les pourcentages affichent aussi les effectifs : « 100 % » sur 2 cas n'a pas le même sens que sur 2 000 ;
- peu de widgets, avec un ordre de lecture évident.

#### Les modes de défaillance

- **Le tableau de bord vitrine** : beaucoup de graphiques, aucune décision.
- **Des définitions divergentes** entre la tuile et la liste.
- **Un calcul lent** : plus personne n'ouvre la page.
- **Des données périmées** sans indication.
- **Des indicateurs de vanité** : le nombre total de connexions, sans lien avec une action.
- **Des droits ignorés** dans les agrégats.

**Contre-exemple.** Un tableau de bord affiche « 7 inspections en retard ». Le clic ouvre une liste qui en contient 5. L'écart vient de deux définitions différentes de « en retard ». Les responsables cessent de s'y fier et recomptent à la main.

**Limites.** Un tableau de bord indique où regarder, il n'explique pas pourquoi. Pour l'analyse, on a besoin de rapports et d'exploration. Une pré-agrégation rend la page rapide, mais fige des définitions : modifier une définition demande un recalcul.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | Chaque widget mène à une vue filtrée ; les vues et les mesures partagent les définitions |
| [12.8 Actions en masse](#128-actions-en-masse) | Depuis une liste à traiter, on agit en masse |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | Un widget sans donnée affiche un état vide explicite |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Les tuiles et les résultats suivent les permissions et le rôle |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les tableaux de bord sont des métadonnées configurables |
| [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) et [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Les événements alimentent les pré-agrégations et les modèles de lecture |
| [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants) | L'administration inter-tenants n'affiche que des agrégats |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les tableaux de bord de fiabilité reposent sur les SLO |

### 5. Application pratique

**Situation initiale.** Le responsable qualité dispose d'un tableau de bord de 14 widgets. Il met 12 secondes à s'afficher. Le chiffre « Inspections en retard » affiche 7 alors que la liste en contient 5. Personne ne sait à quelles décisions il sert.

**Problème.** Le tableau de bord a été construit à partir des données disponibles, et non des questions du responsable.

**Application du concept.** Une refonte fondée sur les questions du public.

**Déroulé.**

1. L'équipe interroge le responsable qualité et retient cinq questions : quels aéronefs sont en retard, que dois-je faire aujourd'hui, quelles échéances arrivent, combien de constats sont ouverts et lesquels sont critiques, y a-t-il une dérive ?
2. Elle ne garde que six widgets, ordonnés de haut en bas selon ces questions.
3. Elle définit chaque indicateur comme une mesure nommée, partagée avec les vues. Le chiffre et la liste concordent.
4. Elle pré-agrège les compteurs à partir des événements (changement de statut, clôture d'inspection), par tenant.
5. Elle ajoute l'indication de fraîcheur, la comparaison avec la semaine précédente et l'exploration vers la liste filtrée.
6. Elle applique les permissions : un chef d'atelier ne voit que sa base.

**Résultat.** La page s'affiche en moins d'une seconde. Les chiffres concordent avec les listes, et le responsable en fait sa page d'ouverture.

**Limites.** La pré-agrégation est cohérente à terme : un chiffre peut accuser quelques secondes de retard, d'où l'affichage de la fraîcheur.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quelles questions un tableau de bord doit-il répondre, et à qui ?
2. **Compréhension.** Pourquoi un indicateur doit-il avoir une définition unique ?
3. **Compréhension.** Quelle est la différence entre un calcul à la volée et une pré-agrégation ?
4. **Pourquoi.** Pourquoi la clé de cache d'un tableau de bord inclut-elle le profil de permissions ?
5. **Raisonnement pratique.** Une tuile affiche « 100 % de conformité ». Que vérifiez-vous avant de vous y fier ?

#### Réponses

1. À des questions précises de décision d'un public identifié : où est le problème, que dois-je traiter, comment évolue la situation. Le public détermine les questions, pas l'inverse.
2. Parce que si la tuile, la liste, l'export et l'API calculent le même indicateur différemment, les chiffres divergent et la confiance disparaît. Une mesure nommée garantit la cohérence.
3. Le calcul à la volée exécute l'agrégation à chaque affichage : toujours à jour, mais lent sur de gros volumes. La pré-agrégation tient des compteurs à jour à mesure que les données changent : rapide, mais plus complexe et cohérente à terme.
4. Parce que deux personnes qui n'ont pas les mêmes droits ne doivent pas partager un résultat : un total calculé sur des lignes interdites serait une fuite d'information.
5. L'effectif sous-jacent (100 % de 2 éléments ou de 2 000 ?), la définition de la conformité, la période, la fraîcheur des données, et le périmètre filtré (droits, filtre global).

## 12.8 Actions en masse

### 1. Comprendre simplement

Une **action en masse** (*bulk action*) applique **la même opération à plusieurs éléments sélectionnés** en une seule fois : changer un statut, réaffecter, étiqueter, archiver, supprimer. On parle des *bulk actions* au pluriel dans les interfaces.

**Pourquoi cela existe.** Répéter une opération mille fois est lent et source d'oublis. Mais l'efficacité a un revers : un seul clic peut faire mille erreurs d'un coup. Une bonne interface rend l'action en masse rapide **et** sûre.

**Problème résolu.** Gagner du temps sur les opérations répétitives sans multiplier les erreurs ni perdre le contrôle de ce qui est modifié.

**Modèle mental.** Le tri d'une boîte de courriels : on sélectionne vingt messages et on les archive d'un geste. On voit ce qui est sélectionné, on peut annuler tout de suite, et un résumé confirme ce qui s'est passé.

**Où l'analogie s'arrête.** Un courriel archivé se retrouve. Ici, chaque élément a ses propres règles (états, droits, gardes de workflow) : certains peuvent réussir, d'autres être refusés, et certains effets (notifications envoyées) ne se rattrapent pas.

**Exemple.** Un technicien est parti. Un planificateur sélectionne ses 86 tâches ouvertes et les réaffecte à un collègue. Un aperçu indique : 80 seront modifiées, 4 sont refusées (en cours d'exécution), 2 sont ignorées (déjà affectées au collègue).

**Les composants.**

1. la **sélection** (page ou ensemble filtré) ;
2. le **choix de l'action** et de ses paramètres ;
3. l'**aperçu** de ce qui sera fait ;
4. la **confirmation**, proportionnée au risque ;
5. l'**exécution**, souvent asynchrone ;
6. le **rapport**, avec reprise des échecs et annulation.

**Objectif d'apprentissage :** vous pouvez concevoir le parcours d'une action en masse, distinguer sélection de page et sélection de résultat, et décider de la confirmation selon le risque.

### 2. Connaissances essentielles

#### Définition

**Action en masse** : opération appliquée en un seul geste à un ensemble d'éléments sélectionnés, avec aperçu, confirmation proportionnée et rapport par élément.

#### Idées fondamentales

1. **La sélection est explicite et chiffrée.** « 12 éléments sélectionnés », et la différence entre la page courante et l'ensemble du résultat est claire.
2. **On prévisualise avant d'exécuter.** On sait combien d'éléments seront modifiés, ignorés ou refusés, et pourquoi.
3. **La confirmation est proportionnelle au risque.** Aucune pour une action réversible et mineure ; une confirmation explicite pour une action destructrice.
4. **Les échecs partiels sont normaux.** Le rapport indique chaque élément, et l'on peut rejouer les échecs.
5. **Le travail long est asynchrone.** On suit la progression, on peut quitter la page, et on est notifié à la fin.
6. **Chaque élément suit ses règles.** Droits, gardes de workflow, validations : l'action en masse n'est pas un contournement.
7. **On peut annuler quand c'est possible.** Retour arrière groupé, archivage plutôt que suppression.

#### Vocabulaire essentiel

- **Sélection** (*selection*) : ensemble des éléments désignés pour l'action.
- **Sélection globale** (*select all matching*) : sélection de tous les résultats d'un filtre, pas seulement de la page affichée.
- **Éligibilité** (*eligibility*) : capacité d'un élément à recevoir l'action selon son état et les droits.
- **Aperçu** (*dry run*, *preview*) : simulation de l'effet, sans l'appliquer.
- **Tâche** (*job*) : exécution asynchrone de l'opération, avec suivi.
- **Rapport d'exécution** : résultat par élément (réussite, ignoré, refusé, erreur).
- **Confirmation par saisie** (*typed confirmation*) : confirmation qui exige de taper un mot ou un nombre.

#### Relations de cause à effet

- La sélection n'indique pas son étendue. L'utilisateur croit agir sur 25 lignes et agit sur 1 240.
- Aucun aperçu n'est proposé. Les effets sont découverts après coup, et l'annulation est impossible.
- La confirmation est identique pour tout. Les utilisateurs cliquent sans lire, et la confirmation perd sa valeur.
- Le rapport n'existe pas. Les erreurs partielles passent inaperçues.
- L'opération est synchrone sur 10 000 éléments. Le délai d'attente expire sans que l'on sache ce qui a été fait.

#### Idées reçues

- **« Une action en masse n'est que la répétition d'une action unitaire. »** Elle change l'échelle du risque, du verrouillage et des effets de bord.
- **« Une confirmation suffit à tout sécuriser. »** Une confirmation systématique est ignorée par habitude. Un aperçu précis, associé à une confirmation réservée au risque réel, protège mieux.
- **« L'opération est atomique. »** Cela dépend de la sémantique choisie (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse)) : souvent, le meilleur effort est préféré pour les grands lots.

#### Principe clé

Une action en masse montre exactement ce qu'elle va faire, confirme à la mesure du risque, et rend compte élément par élément.

#### Si vous ne retenez que trois choses

1. La sélection est chiffrée, et la page se distingue du résultat complet.
2. L'aperçu précède l'exécution, et le rapport la suit.
3. La confirmation, l'asynchronisme et l'annulation dépendent du risque et du volume.

### 3. Explication technique détaillée

#### La sélection : page ou résultat

```text
☑ 25 éléments de cette page sont sélectionnés.
   [ Sélectionner les 1 240 éléments qui correspondent au filtre « Base = LYS » ]

☑ Les 1 240 éléments qui correspondent au filtre sont sélectionnés.   [ Effacer la sélection ]
```

La deuxième forme désigne une sélection **par critère**. Au moment de l'exécution, le moteur résout le critère en une liste d'identifiants figée, pour que l'ensemble ne change pas pendant l'opération (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse)).

#### Du choix à l'exécution

```text
sélection ─► action et paramètres ─► aperçu : n modifiés, m ignorés, k refusés
   ─► confirmation proportionnée ─► exécution (tâche) ─► rapport ─► reprise des échecs ou annulation
```

#### L'aperçu

| Résultat | Nombre | Détail |
|---|---|---|
| Seront modifiés | 1 198 | |
| Ignorés (déjà « En inspection ») | 31 | Aucun effet |
| Refusés (droits insuffisants) | 6 | Liste téléchargeable |
| Bloqués (garde : « Un vol est programmé dans les 24 h. ») | 5 | Liste avec la raison par élément |

Le total (1 198 + 31 + 6 + 5) fait 1 240. L'aperçu réutilise les mêmes règles que l'exécution réelle (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) : il explique les refus avec les messages de garde (voir [12.14 Explicabilité](#1214-explicabilité)).

#### La confirmation proportionnelle

| Niveau de risque | Exemple | Confirmation |
|---|---|---|
| Faible, réversible | Ajouter une étiquette à 40 éléments | Aucune, ou message avec « Annuler » |
| Moyen | Changer le statut de 200 éléments | Boîte de dialogue avec le nombre et l'effet |
| Élevé, destructeur | Supprimer 1 000 éléments | Saisie d'un mot ou du nombre ; permission dédiée ; éventuellement approbation (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) |

#### L'exécution et le rapport

- **Asynchrone au-delà d'un seuil.** La tâche indique « 3 200 sur 10 000 », peut être mise en arrière-plan, et notifie à la fin (voir [12.10 Notifications](#1210-notifications)).
- **Idempotente.** Une clé d'idempotence évite qu'un double clic ou une reprise duplique les effets (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- **Plafonnée.** Une opération porte sur un nombre limité d'éléments, et respecte les quotas et la limitation de débit.
- **Rapport par élément.**

```json
{
  "job_id": "job_41",
  "status": "completed",
  "summary": { "total": 86, "succeeded": 80, "skipped": 2, "failed": 4 },
  "failures": [
    { "id": "task_204", "code": "state_not_allowed", "message": "La tâche est en cours d'exécution." }
  ],
  "actions": { "retry_failed": true, "download_report": true, "undo": true }
}
```

#### Annuler

- **Immédiatement après**, pour une opération douce : un message avec « Annuler » pendant quelques secondes.
- **Par compensation**, pour un changement d'état : une opération inverse, quand elle est possible.
- **Par retour arrière**, pour les modifications versionnées (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)).
- **Par archivage**, pour la suppression : on archive d'abord, on supprime définitivement plus tard (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).

#### Les effets de bord

Une action en masse peut déclencher des centaines d'événements et de notifications. On regroupe : un résumé pour la personne concernée au lieu de 86 messages (voir [12.10 Notifications](#1210-notifications)), et on limite le débit des intégrations sortantes.

#### Permissions et règles

Chaque élément est évalué avec les droits de la personne et les gardes de ses transitions. L'action n'est proposée que si au moins un élément est éligible. Les éléments non éligibles sont expliqués, jamais silencieusement ignorés (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) et [12.14 Explicabilité](#1214-explicabilité)).

#### Les modes de défaillance

- **La sélection de page prise pour la sélection globale**, ou l'inverse.
- **L'absence d'aperçu**, donc des effets découverts après.
- **Une confirmation uniforme**, ignorée par habitude.
- **Un rapport absent**, avec des erreurs silencieuses.
- **Une exécution synchrone** qui expire sur les gros lots.
- **Un double envoi** après un délai d'attente, sans idempotence.
- **Une avalanche de notifications.**

**Contre-exemple.** Un bouton « Supprimer tout » est placé à côté de « Exporter », sans aperçu ni confirmation. Un utilisateur croyait exporter la sélection de 25 lignes. Il supprime les 18 000 enregistrements du filtre. Aucune corbeille ne permet la restauration.

**Limites.** Un aperçu est une photographie : entre l'aperçu et l'exécution, l'état peut changer. L'exécution revérifie donc chaque élément, et le rapport final fait foi. Certains effets de bord (courriels envoyés, appels sortants) ne s'annulent pas.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse) | Le runtime fournit la sémantique (atomique, meilleur effort), les tâches et les rapports |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend la reprise sûre |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | L'archivage rend la suppression réversible |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les gardes des transitions décident de l'éligibilité |
| [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Retour arrière et approbation encadrent les actions risquées |
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | La sélection s'appuie sur les filtres et les vues |
| [12.10 Notifications](#1210-notifications) | La notification de fin et le regroupement des messages |
| [12.14 Explicabilité](#1214-explicabilité) | Les refus s'expliquent élément par élément |
| [12.16 Configuration sûre](#1216-configuration-sûre) | Les garde-fous (plafonds, confirmations) relèvent de la configuration sûre |

### 5. Application pratique

**Situation initiale.** Un technicien quitte l'entreprise. Il a 86 tâches de maintenance ouvertes qu'il faut réaffecter à un collègue avant la fin de la semaine.

**Problème.** Réaffecter les tâches une à une prendrait une heure et laisserait des oublis. Les tâches ont des états différents, et certaines ne peuvent pas être réaffectées.

**Application du concept.** Une action en masse « Réaffecter » avec aperçu et rapport.

**Déroulé.**

1. Le planificateur filtre les tâches par technicien et statut, puis sélectionne les 86 résultats, annoncés explicitement.
2. Il choisit l'action « Réaffecter » et le collègue cible.
3. L'aperçu indique : 80 tâches seront modifiées, 2 sont ignorées (déjà au collègue), 4 sont refusées (en cours d'exécution, la garde l'interdit), avec la raison de chaque refus.
4. La confirmation est de niveau moyen : une boîte de dialogue rappelle le nombre et l'effet.
5. L'opération s'exécute comme tâche, avec une notification unique à la fin et un message groupé au collègue.
6. Le rapport liste les 4 refus. Le planificateur les traite à part, et peut annuler l'ensemble pendant 24 heures.

**Résultat.** 80 tâches sont réaffectées en moins d'une minute, les 6 autres sont traitées en connaissance de cause, et chaque modification est tracée dans l'audit (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

**Limites.** Le collègue reçoit 80 tâches d'un coup : l'interface prévient d'une charge élevée, mais la décision d'équilibrer reste humaine.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre sélectionner la page et sélectionner tous les résultats ?
2. **Compréhension.** Que doit montrer un aperçu avant l'exécution ?
3. **Compréhension.** Comment adapte-t-on la confirmation au risque ?
4. **Pourquoi.** Pourquoi une action en masse ne doit-elle jamais contourner les règles unitaires ?
5. **Raisonnement pratique.** Une action en masse sur 50 000 éléments expire côté client après 30 secondes. Comment la concevez-vous ?

#### Réponses

1. Sélectionner la page désigne les éléments affichés (par exemple 25). Sélectionner tous les résultats désigne l'ensemble du filtre (par exemple 1 240). L'interface doit distinguer et chiffrer les deux, car l'effet n'a pas la même échelle.
2. Le nombre d'éléments qui seront modifiés, ignorés ou refusés, avec la raison pour chacun, et l'effet de l'action. L'aperçu applique les mêmes règles que l'exécution.
3. Aucune confirmation ou un message « Annuler » pour une action réversible et mineure ; une boîte de dialogue avec le nombre pour un risque moyen ; une saisie explicite, une permission dédiée, voire une approbation pour une action destructrice.
4. Parce que sinon l'action en masse devient un moyen de faire ce qui est interdit à l'unité : droits, gardes de workflow et validations doivent s'appliquer à chaque élément.
5. On la traite comme une tâche asynchrone : accusé de réception immédiat avec un identifiant, progression consultable, notification à la fin, rapport par élément, idempotence pour la reprise, et plafond ou découpage en lots.

## 12.9 Palette de commandes

### 1. Comprendre simplement

Une **palette de commandes** (*command palette*) est un champ de saisie rapide, ouvert par un raccourci clavier (souvent Ctrl+K ou Cmd+K), dans lequel on **tape quelques lettres** pour **trouver et exécuter** une action ou **aller** à un endroit. Elle s'est popularisée avec les éditeurs de code (par exemple Sublime Text et Visual Studio Code).

**Pourquoi cela existe.** Une plateforme riche compte des centaines d'actions et d'écrans, dispersés dans des menus. Les utilisateurs réguliers veulent aller vite, sans lâcher le clavier. La palette réunit navigation, actions et recherche en un seul point d'entrée, et elle aide à découvrir ce que le système sait faire.

**Problème résolu.** Réduire le coût d'accès aux fonctions que l'on connaît par leur nom, et rendre visible la liste de ce qui est possible.

**Modèle mental.** Le guichet unique. On dit ce que l'on veut en quelques mots, et le système propose les endroits ou les actions qui correspondent.

**Où l'analogie s'arrête.** Un guichet d'orientation renvoie vers un service. La palette peut aussi **exécuter** une action avec des effets. Elle doit donc respecter les mêmes droits, les mêmes confirmations et la même traçabilité que l'interface habituelle.

**Exemple.** L'utilisateur tape `Cmd+K`, puis « insp ». La palette propose : « Aller à : Inspections en retard », « Créer : Tâche d'inspection », « Aéronef F-ABCD », « Basculer vers : Bac à sable ».

**Les composants.**

1. un **déclencheur** (raccourci clavier, bouton) ;
2. des **sources de résultats** : pages, actions, objets, aide ;
3. une **correspondance** approximative et un **classement** ;
4. le **contexte** : objet courant, sélection, rôle ;
5. l'**exécution**, avec paramètres et confirmation ;
6. l'affichage des **raccourcis** équivalents.

**Objectif d'apprentissage :** vous pouvez décrire ce que contient une palette, expliquer pourquoi elle dépend du contexte et des droits, et préciser en quoi elle complète la navigation.

### 2. Connaissances essentielles

#### Définition

**Palette de commandes** : interface de saisie rapide, accessible au clavier depuis tout l'écran, qui propose des pages, des actions et des objets correspondant à ce que l'utilisateur tape, et qui permet de les ouvrir ou de les exécuter.

#### Idées fondamentales

1. **Un seul point d'entrée, partout.** Le même raccourci ouvre la palette sur chaque écran.
2. **Les résultats dépendent du contexte et des droits.** Une action n'est proposée que si elle est possible ici et maintenant, pour cette personne.
3. **La correspondance est tolérante.** Quelques lettres, des fautes, des synonymes : on retrouve la commande.
4. **Le classement tient compte de l'usage.** Récents, fréquents et contextuels remontent.
5. **C'est un accélérateur, pas un remplaçant.** La navigation visible reste nécessaire pour découvrir.
6. **Les actions à effets gardent leurs garde-fous.** Même confirmation, même traçabilité.
7. **Elle enseigne.** Le raccourci direct s'affiche à côté de la commande.

#### Vocabulaire essentiel

- **Commande** (*command*) : action nommée que l'on peut déclencher.
- **Correspondance floue** (*fuzzy matching*) : mise en correspondance tolérante aux fautes et aux fragments.
- **Classement** (*ranking*) : ordre des résultats selon pertinence, contexte et usage.
- **Source de résultats** (*provider*) : composant qui fournit un type de résultats (pages, objets, actions).
- **Contexte** (*context*) : état courant (objet affiché, sélection, rôle) qui conditionne les commandes.
- **Préfixe** (*prefix*) : caractère qui restreint la recherche à une catégorie.

#### Relations de cause à effet

- La palette propose des actions que l'on ne peut pas exécuter. L'utilisateur perd confiance et cesse de l'utiliser.
- Les commandes contournent les confirmations de l'interface. Des actions destructrices s'exécutent sans garde-fou.
- Le classement ignore l'usage. Les commandes les plus courantes sont noyées parmi les résultats.
- Les commandes ne sont pas déclarées par métadonnées. Chaque module ajoute des cas particuliers et la palette devient incohérente.

#### Idées reçues

- **« C'est un outil de développeur. »** C'est utile à tout utilisateur régulier d'une interface dense.
- **« Elle remplace les menus. »** Non. Elle sert à ceux qui savent ce qu'ils cherchent. Les menus servent à découvrir.
- **« Il faut y mettre toutes les fonctions. »** Une liste surchargée est inutilisable. On y met les actions utiles et pertinentes dans le contexte.

#### Principe clé

Une palette de commandes donne un accès rapide, contextuel et conforme aux droits, aux pages, aux objets et aux actions, sans contourner aucune règle.

#### Si vous ne retenez que trois choses

1. La palette réunit navigation, actions et recherche derrière un raccourci unique.
2. Ses résultats dépendent du contexte et des permissions, et ses actions gardent leurs confirmations.
3. Elle accélère les habitués et enseigne les raccourcis, mais ne remplace pas la navigation visible.

### 3. Explication technique détaillée

#### Les sources de résultats

| Source | Contenu | Exemple |
|---|---|---|
| Navigation | Pages, vues, tableaux de bord | « Aller à : Inspections en retard » |
| Actions | Commandes exécutables | « Créer : Tâche d'inspection » |
| Objets | Enregistrements trouvés par recherche | « Aéronef F-ABCD » |
| Réglages et aide | Paramètres, documentation | « Réglages : Notifications » |
| Récents et favoris | Éléments consultés récemment | « Constat 2026-0412 » |

#### Des commandes décrites par des métadonnées

Dans une plateforme configurable, chaque module et chaque extension déclare ses commandes. La palette les assemble.

```json
{
  "commands": [
    { "id": "go.overdue_inspections",
      "label": "Aller à : Inspections en retard",
      "keywords": ["retard", "inspection", "échéance"],
      "action": { "type": "open_view", "view": "overdue_inspections" } },
    { "id": "aircraft.ground",
      "label": "Immobiliser l'aéronef courant",
      "context": { "resource": "aircraft", "selected": true },
      "requires": { "transition": "ground" },
      "confirm": "standard" },
    { "id": "env.switch_sandbox",
      "label": "Basculer vers le bac à sable",
      "requires": { "permission": "environment:switch" } }
  ]
}
```

- `context` : la commande n'apparaît que lorsque la condition est vraie (un aéronef est ouvert).
- `requires` : elle n'apparaît que si la personne y a droit, et si la transition est possible (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)).
- `confirm` : elle suit le même niveau de confirmation que l'action dans l'interface habituelle (voir [12.8 Actions en masse](#128-actions-en-masse)).
- `keywords` : des synonymes qui améliorent la correspondance.

#### La correspondance et le classement

Le score d'un résultat combine plusieurs critères :

$$\text{score} = w_1 \cdot \text{qualité de correspondance} + w_2 \cdot \text{fréquence d'usage} + w_3 \cdot \text{récence} + w_4 \cdot \text{pertinence du contexte}$$

- $w_1$ à $w_4$ : poids relatifs donnés à chaque critère, ajustés par l'expérience ;
- la **qualité de correspondance** valorise un début de mot, des initiales, une correspondance exacte, et tolère les accents et certaines fautes ;
- la **fréquence** et la **récence** font remonter les commandes que la personne utilise ;
- le **contexte** favorise les commandes liées à l'objet affiché.

Des **préfixes** facultatifs restreignent la recherche : par exemple `>` pour les actions, `#` pour les objets. Ils servent aux experts et restent facultatifs.

#### Le contexte

Une même saisie « immob » donne des résultats différents selon le contexte :

| Contexte | Résultat principal |
|---|---|
| Fiche de l'aéronef F-ABCD | « Immobiliser F-ABCD » |
| Liste de tâches | « Rechercher des aéronefs immobilisés » |
| Aucun objet ouvert | « Aller à : Aéronefs immobilisés » |

#### Les permissions

Une commande à laquelle la personne n'a pas droit n'est pas proposée (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)). Dans certains cas, on la montre désactivée avec la raison (voir [12.14 Explicabilité](#1214-explicabilité)), par exemple quand une demande d'accès est possible. Le serveur contrôle de toute façon l'exécution.

#### La sûreté

- Les actions à effets ont les mêmes confirmations que les boutons de l'interface (voir [12.16 Configuration sûre](#1216-configuration-sûre)).
- Chaque exécution est journalisée comme une action normale (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- Les actions destructrices ne s'exécutent pas d'une seule frappe.

#### L'accessibilité

- Elle est entièrement utilisable au clavier : ouverture, navigation par flèches, validation, fermeture par Échap.
- Elle utilise les rôles d'accessibilité adaptés (champ combiné avec liste de résultats) pour les lecteurs d'écran.
- Elle annonce le nombre de résultats et le résultat sélectionné.
- Elle ne repose pas sur un raccourci unique : un bouton visible l'ouvre aussi.

#### Le multi-tenant

- Les résultats d'objets sont limités au tenant courant.
- Une commande « Changer de tenant » existe pour les personnes qui en ont plusieurs.
- Les opérateurs de la plateforme disposent d'une portée explicite pour les recherches inter-tenants (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
- Les extensions peuvent enregistrer des commandes, dans un espace de noms (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

#### Les modes de défaillance

- **Des commandes indisponibles** proposées, puis refusées.
- **Des commandes non classées** : trop de résultats sans ordre pertinent.
- **Une palette réservée à la souris** ou à un raccourci non accessible.
- **Des actions destructrices sans confirmation.**
- **Des fuites** : des objets d'un autre tenant ou non autorisés dans les résultats.
- **Des libellés incohérents** entre menus et palette.

**Contre-exemple.** La palette d'un produit propose « Supprimer le tenant » dans ses résultats pour tous les administrateurs. Elle s'exécute dès la touche Entrée, sans confirmation, parce que la commande a été ajoutée par un module qui n'a pas déclaré son niveau de confirmation.

**Limites.** La palette n'aide pas ceux qui ne savent pas ce qu'ils cherchent. Elle exige que les commandes aient des noms et des mots-clés bien choisis. Sur de très gros volumes d'objets, la recherche distante a une latence qu'il faut masquer.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation) | Elle complète la navigation visible par un accès direct |
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | Elle réutilise la recherche d'objets et les vues enregistrées |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Ses résultats suivent les permissions et le contexte |
| [12.13 Découvrabilité](#1213-découvrabilité) | Elle contribue à la découvrabilité en listant les actions possibles |
| [12.14 Explicabilité](#1214-explicabilité) | Une commande indisponible peut expliquer pourquoi |
| [12.16 Configuration sûre](#1216-configuration-sûre) | Les actions à effets gardent leurs garde-fous |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions déclarent leurs commandes |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Les exécutions sont tracées dans le journal d'audit |

### 5. Application pratique

**Situation initiale.** L'administrateur d'un tenant modifie souvent des réglages dispersés dans six niveaux de menus. Pour changer les règles de notification, il lui faut sept clics. Les nouveaux arrivants ne savent pas que certains réglages existent.

**Problème.** L'accès aux fonctions dépend de la connaissance de leur emplacement.

**Application du concept.** Une palette de commandes alimentée par les métadonnées.

**Déroulé.**

1. L'équipe définit un registre de commandes : chaque module déclare ses pages, ses réglages et ses actions, avec libellé, mots-clés, contexte et permission requise.
2. La palette s'ouvre avec Cmd+K ou Ctrl+K, et par un bouton « Rechercher ou saisir une commande » dans l'en-tête.
3. Les résultats sont filtrés par permission et contexte. Les commandes à effets reprennent les confirmations de l'interface.
4. Le classement favorise les commandes récentes et celles de l'objet affiché.
5. L'équipe mesure les recherches sans résultat et ajoute des mots-clés ou des commandes manquantes.

**Résultat.** L'accès aux réglages passe de sept clics à deux secondes : Cmd+K, « notif », Entrée. Les recherches sans résultat révèlent des fonctions mal nommées, que l'équipe corrige.

**Limites.** La palette n'a rien changé pour les utilisateurs occasionnels, qui continuent à utiliser les menus. D'où l'importance de maintenir la navigation visible.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sortes de résultats une palette de commandes peut-elle proposer ?
2. **Compréhension.** Pourquoi les résultats dépendent-ils du contexte ?
3. **Compréhension.** Que doit faire la palette pour une action destructrice ?
4. **Pourquoi.** Pourquoi la palette ne remplace-t-elle pas la navigation visible ?
5. **Raisonnement pratique.** Des utilisateurs tapent « congé » dans la palette et n'obtiennent rien, alors que la fonction existe sous « Absences ». Que faites-vous ?

#### Réponses

1. Des pages et des vues (navigation), des actions exécutables, des objets trouvés par recherche, des réglages et de l'aide, ainsi que des éléments récents ou favoris.
2. Parce qu'une commande n'a de sens que si elle est possible ici et maintenant : l'action « Immobiliser » n'est proposée que sur un aéronef, et seulement si la transition est possible pour cette personne.
3. Elle exige la même confirmation que l'interface habituelle, journalise l'exécution, et ne l'exécute jamais d'une seule frappe sans confirmation.
4. Parce qu'elle sert à ceux qui savent ce qu'ils cherchent. La navigation visible montre ce qui existe, et elle permet de découvrir. Sans elle, les fonctions ignorées restent ignorées.
5. On analyse les recherches sans résultat, on ajoute « congé » comme mot-clé ou synonyme de la commande « Absences », et l'on vérifie le libellé de l'élément pour qu'il soit cohérent avec le vocabulaire des utilisateurs.

## 12.10 Notifications

### 1. Comprendre simplement

Une **notification** (*notification*) est un message que le système **envoie de sa propre initiative** pour informer une personne d'un événement qui la concerne, ou pour lui demander d'agir. Elle passe par un ou plusieurs **canaux** : dans l'application (cloche, bandeau, boîte de réception), par courriel, par notification mobile, par messagerie d'équipe.

**Pourquoi cela existe.** Les personnes ne regardent pas la plateforme en permanence. Certains événements exigent une réaction rapide (une approbation, une échéance, un incident). Sans notification, ils passent inaperçus. Avec trop de notifications, plus personne ne les lit.

**Problème résolu.** Faire savoir à la bonne personne, au bon moment, par le bon canal, qu'il se passe quelque chose qui la concerne, sans l'inonder.

**Modèle mental.** La sonnette, la boîte aux lettres et le tableau d'affichage. La sonnette interrompt et ne sert qu'à l'urgent. La boîte aux lettres reçoit le courrier du jour. Le tableau d'affichage informe ceux qui passent.

**Où l'analogie s'arrête.** Un facteur ne sait pas ce que vous faites. Un système de notification peut regrouper, différer selon vos horaires, et vérifier que la personne a bien traité la demande, et il agit à grande échelle.

**Exemple.** Un technicien crée un constat critique. Le responsable qualité reçoit tout de suite une notification dans l'application avec les boutons « Approuver » et « Refuser ». Il reçoit aussi un résumé par courriel à 18 h des constats non traités.

**Les composants.**

1. un **événement** source (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) ;
2. des **règles** : qui est concerné, sous quelle condition ;
3. des **modèles** de message ;
4. des **canaux** et des niveaux d'urgence ;
5. des **préférences** par personne et par tenant ;
6. le **regroupement** et la limitation ;
7. le **suivi** : livré, lu, traité.

**Objectif d'apprentissage :** vous pouvez décrire le chemin de l'événement à la notification, choisir un canal selon l'urgence, et expliquer comment on évite la saturation.

### 2. Connaissances essentielles

#### Définition

**Notification** : message émis automatiquement par le système à destination d'une personne, par un canal choisi, à la suite d'un événement, pour l'informer ou lui demander d'agir.

#### Idées fondamentales

1. **Une notification a un destinataire, une raison et, si possible, une action.** Sinon, ce n'est que du bruit.
2. **L'urgence détermine le canal.** On interrompt pour l'urgent, on informe en différé pour le reste.
3. **Les préférences appartiennent à la personne, dans le cadre posé par le tenant.** La plateforme impose un minimum non désactivable (sécurité).
4. **Moins vaut mieux.** On regroupe, on déduplique et on limite.
5. **La notification n'est pas la source de vérité.** L'état se lit dans le système : la notification peut être en retard ou déjà obsolète.
6. **Les messages de sécurité et de transaction ne sont pas optionnels.** Les messages promotionnels exigent un consentement et un désabonnement.
7. **Les canaux externes ne reçoivent pas de données sensibles.** Un courriel ou une notification mobile n'est pas un canal maîtrisé.

#### Vocabulaire essentiel

- **Canal** (*channel*) : moyen de remise (application, courriel, mobile, messagerie, webhook).
- **Préférence** (*preference*) : choix de la personne sur ce qu'elle reçoit et par quel canal.
- **Résumé périodique** (*digest*) : message unique qui regroupe plusieurs notifications sur une période.
- **Regroupement** (*grouping*) : fusion de notifications similaires en une seule.
- **Limitation** (*throttling*) : plafond du nombre de notifications par période.
- **Déduplication** (*deduplication*) : suppression des notifications identiques répétées.
- **Modèle de message** (*template*) : gabarit qui produit le texte selon la langue et le tenant.
- **Boîte de réception** (*inbox*) : liste persistante des notifications dans l'application.
- **Heures calmes** (*quiet hours*) : plage pendant laquelle on évite d'interrompre.

#### Relations de cause à effet

- Chaque événement produit une notification. La personne en reçoit des dizaines par jour, et elle finit par les ignorer toutes, y compris l'importante.
- Une notification ne contient ni raison ni action. Le destinataire doit enquêter, et la notification n'apporte rien.
- Le contenu confidentiel est copié dans le message. Il circule hors du périmètre contrôlé (courriel, notification mobile, aperçu sur écran verrouillé).
- Il n'y a pas de déduplication, et le moteur d'événements livre « au moins une fois » (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)). La personne reçoit le même message plusieurs fois.
- Les préférences sont absentes. Les personnes coupent tout, ou quittent le produit.

#### Idées reçues

- **« Plus on notifie, mieux les gens sont informés. »** La saturation produit l'inverse.
- **« Le courriel est un canal fiable. »** Sa livraison n'est pas garantie : filtres, délais, boîtes pleines.
- **« La notification remplace la liste des tâches. »** La liste est la source de vérité. La notification est un signal pour y aller.

#### Principe clé

Une notification est un signal rare, adressé, actionnable et proportionné à l'urgence, et la liste de travail reste la source de vérité.

#### Si vous ne retenez que trois choses

1. Une notification dit qui, quoi, pourquoi et que faire, par un canal adapté à l'urgence.
2. Les préférences, le regroupement et la limitation protègent l'attention.
3. Les données sensibles restent dans la plateforme : la notification contient un lien, pas le contenu confidentiel.

### 3. Explication technique détaillée

#### De l'événement à la notification

```text
événement (voir 7.1) ─► règle de notification ─► destinataires ─► préférences et heures calmes
   ─► regroupement et déduplication ─► rendu (modèle, langue) ─► canal(s) ─► suivi (livré, lu, traité)
```

Chaque étape est un point de contrôle. Une notification peut être supprimée (préférence, déduplication), différée (heures calmes), regroupée (résumé) ou escaladée (aucune réponse).

#### Une règle de notification

```json
{
  "notification_rule": "finding_critical_created",
  "on": "finding.created",
  "when": "severity = 'critical'",
  "recipients": [
    { "role": "quality_manager" },
    { "field": "aircraft.base_manager" }
  ],
  "template": "finding_critical",
  "urgency": "high",
  "channels": {
    "default": ["in_app", "email"],
    "high":    ["in_app", "push", "email"]
  },
  "group_by": ["aircraft"],
  "dedupe_window": "PT10M",
  "escalate_after": "PT4H"
}
```

La règle est une donnée du tenant. Elle réagit à l'événement (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) et [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)), évalue une condition, désigne les destinataires par rôle ou par champ, et indique le canal selon l'urgence.

#### Urgence et canal

| Urgence | Exemple | Canaux typiques | Comportement |
|---|---|---|---|
| Critique | Incident de sécurité, panne | Notification mobile, appel, application | Interrompt, ignore les heures calmes |
| Élevée | Approbation en attente, échéance du jour | Application, notification mobile | Interrompt pendant les heures de travail |
| Normale | Tâche affectée, commentaire | Application, résumé par courriel | Regroupée |
| Faible | Information, nouveauté | Boîte de réception | Consultée à la demande |

#### Les préférences et leur hiérarchie

| Niveau | Ce qui est défini | Peut être surchargé par |
|---|---|---|
| Plateforme | Notifications obligatoires (sécurité, facturation), canaux disponibles | Personne |
| Tenant | Canaux autorisés, modèles, marque, règles | L'utilisateur, dans les limites fixées |
| Utilisateur | Catégories reçues, canaux, heures calmes, langue | — |

Cette hiérarchie suit celle de la configuration (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)). Une préférence personnelle ne peut pas désactiver une notification obligatoire.

#### Regroupement, déduplication et limitation

- **Regroupement** : « 86 tâches vous ont été réaffectées » plutôt que 86 messages (voir [12.8 Actions en masse](#128-actions-en-masse)).
- **Déduplication** : une fenêtre de temps et une clé (par exemple `finding_id` et type) évitent les répétitions.
- **Limitation** : un plafond par personne et par heure, au-delà duquel les notifications passent dans un résumé.
- **Résumé périodique** : un courriel quotidien ou hebdomadaire regroupe ce qui n'est pas urgent.

#### Le contenu

- un **titre court** qui dit l'essentiel ;
- la **raison** : pourquoi la personne est concernée ;
- l'**action** : un lien profond vers l'écran où agir ;
- l'**horodatage** et la **langue** de la personne ;
- **aucune donnée sensible** dans les canaux externes : « Un constat critique attend votre approbation. [Ouvrir] », sans le détail confidentiel.

#### La livraison

- Le moteur d'événements livre au moins une fois : la notification doit être **idempotente** (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- Les **échecs** sont repris avec un délai croissant, puis abandonnés avec une trace.
- Pour le courriel, l'**authentification du domaine d'envoi** (SPF, DKIM, DMARC) améliore la délivrabilité.
- Un **retour d'erreur** (adresse invalide) désactive le canal pour la personne et le signale.
- Les notifications **dans l'application** sont persistantes et marquables comme lues ou traitées.

#### L'escalade

Si une notification actionnable reste sans réponse, on l'**escalade** : rappel à la personne, puis notification à son responsable (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)). L'escalade a un délai, un destinataire de repli, et s'arrête dès que la tâche est traitée.

#### Le multi-tenant

- **Modèles par tenant** : marque, langue, ton, avec un modèle de repli de la plateforme.
- **Canaux désactivables** par tenant (certains clients interdisent le courriel externe).
- **Aucune fuite** : une notification ne cite que des éléments que le destinataire peut voir (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Coûts et quotas** : l'envoi de messages est mesuré par tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)).

#### Les modes de défaillance

- **La saturation** : trop de notifications, taux d'ouverture en chute.
- **Des notifications sans action** ou sans propriétaire.
- **Des fuites de données** dans les canaux externes.
- **Des doublons** liés à la livraison au moins une fois.
- **Des notifications périmées** : la tâche est déjà traitée quand la personne l'ouvre.
- **Des préférences ignorées** ou impossibles à trouver.

**Contre-exemple.** Chaque modification d'un aéronef envoie un courriel à toute l'équipe. Les personnes créent une règle de messagerie qui range ces courriels dans un dossier. Quand un constat critique attend une approbation, le courriel va dans le même dossier.

**Limites.** Le meilleur système de notification ne remplace pas une liste de travail claire. Certaines personnes préfèrent ne rien recevoir et consulter la plateforme, d'autres veulent tout recevoir : les préférences ne règlent pas tout, et il faut accepter une part d'arbitrage.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) et [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Les événements et le bus alimentent les règles de notification |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Un webhook est une notification destinée à un système plutôt qu'à une personne |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La livraison au moins une fois impose l'idempotence |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Les approbations et escalades s'appuient sur les notifications |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | Les préférences suivent la hiérarchie de configuration |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les alertes d'exploitation sont des notifications destinées aux équipes techniques |
| [12.8 Actions en masse](#128-actions-en-masse) | Les actions en masse regroupent leurs notifications |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Le contenu d'une notification suit les permissions du destinataire |

### 5. Application pratique

**Situation initiale.** Le responsable qualité reçoit 40 courriels par jour sur les constats. Il les ignore presque tous, et un constat critique est resté 19 heures sans approbation.

**Problème.** Toutes les notifications ont la même importance, le même canal et le même format.

**Application du concept.** Une refonte des règles selon l'urgence, avec regroupement et escalade.

**Déroulé.**

1. L'équipe classe les événements par urgence : constat critique (élevée), constat normal (normale), clôture (faible).
2. Les constats critiques génèrent une notification dans l'application avec des boutons « Approuver » et « Refuser », et une notification mobile pendant les heures de travail.
3. Les constats normaux sont regroupés dans un résumé quotidien à 17 h.
4. Les clôtures vont dans la boîte de réception, sans courriel.
5. Une escalade rappelle le responsable après 4 heures, puis prévient son suppléant après 8 heures (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).
6. Les contenus des canaux externes ne comportent que le titre et un lien.

**Résultat.** Le responsable reçoit en moyenne trois interruptions par jour, toutes actionnables. Le délai d'approbation des constats critiques passe de 19 heures à environ 3 heures.

**Limites.** Un responsable en congé ne répond à rien : l'escalade vers un suppléant est donc indispensable, et la délégation (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)) doit être configurée à l'avance.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient une règle de notification ?
2. **Compréhension.** Pourquoi choisit-on le canal selon l'urgence ?
3. **Compréhension.** À quoi servent le regroupement et la déduplication ?
4. **Pourquoi.** Pourquoi ne met-on pas de données sensibles dans le corps d'un courriel ou d'une notification mobile ?
5. **Raisonnement pratique.** Une notification d'approbation reste sans réponse pendant deux jours. Que prévoyez-vous ?

#### Réponses

1. L'événement déclencheur, une condition, les destinataires (par rôle ou par champ), le modèle de message, l'urgence et les canaux, ainsi que le regroupement, la déduplication et l'escalade.
2. Parce que l'interruption a un coût : on réserve les canaux intrusifs à l'urgent, et l'on laisse le reste dans la boîte de réception ou dans un résumé, pour préserver l'attention.
3. Le regroupement fusionne des notifications similaires en une seule (86 réaffectations deviennent un message). La déduplication supprime les répétitions d'un même événement, notamment dues à la livraison au moins une fois.
4. Parce que ces canaux sortent du périmètre contrôlé : le courriel est stocké chez des tiers, la notification mobile s'affiche sur un écran verrouillé. On envoie un titre et un lien, et le détail reste dans la plateforme.
5. Une escalade : rappel après un délai, puis notification au responsable ou au suppléant, avec arrêt dès que l'approbation est donnée. La délégation en cas d'absence est configurée à l'avance.

## 12.11 États vides et états d'erreur

### 1. Comprendre simplement

Un **état vide** (*empty state*, au pluriel *empty states*) est ce que l'interface affiche quand il n'y a rien à montrer : aucune donnée créée, aucun résultat, tout est traité. Un **état d'erreur** (*error state*, au pluriel *error states*) est ce qu'elle affiche quand quelque chose a échoué. Ce sont des moments où l'utilisateur est le plus perdu, et où une bonne conception l'aide le plus.

**Pourquoi cela existe.** Dans une plateforme configurable, le « vide » est fréquent : nouveau tenant, nouveau type d'objet, filtre trop strict. Les erreurs sont inévitables. Un écran blanc, ou un « Une erreur est survenue » sans suite, abandonne l'utilisateur au moment où il a besoin d'aide.

**Problème résolu.** Transformer un moment de blocage en une explication et en une prochaine étape claire.

**Modèle mental.** Un panneau « Fermé pour travaux, réouverture le 3 » plutôt qu'une porte close. Le premier dit pourquoi, et quand revenir. La seconde laisse deviner.

**Où l'analogie s'arrête.** Un panneau est le même pour tous les passants. Un état vide ou d'erreur doit s'adapter : à la cause réelle, aux droits de la personne, à ce qu'elle peut faire ensuite.

**Exemple.** La liste « Constats » est vide pour un nouveau tenant : « Aucun constat pour le moment. Les constats apparaissent ici quand un technicien en crée un. [Créer un constat] [Importer un fichier] ». Avec un filtre actif : « Aucun résultat pour Base = LYS et Gravité = Critique. [Retirer le filtre Gravité] ».

**Les composants.**

1. le **type** d'état : premier usage, aucun résultat, tout est traité, non autorisé, erreur ;
2. une **explication** de la cause ;
3. une **action** suivante ;
4. le **ton** et la clarté du message ;
5. un **identifiant** de support pour les erreurs.

**Objectif d'apprentissage :** vous pouvez distinguer les types d'états vides, rédiger un message d'erreur utile, et expliquer pourquoi l'identifiant de corrélation est utile.

### 2. Connaissances essentielles

#### Définition

- **État vide** : état d'une zone d'interface qui n'a aucun contenu à présenter, avec une explication et une action.
- **État d'erreur** : état d'une zone d'interface ou d'une opération qui a échoué, avec ce qui s'est passé, ce que cela change et ce que l'on peut faire.

#### Idées fondamentales

1. **Un état vide a une cause, et on la nomme.** « Rien n'a encore été créé » n'est pas « aucun résultat pour ce filtre ».
2. **Chaque état propose une suite.** Créer, importer, élargir un filtre, réessayer, demander l'accès.
3. **Les erreurs de l'utilisateur et du système se distinguent.** La première est corrigeable par la personne, la seconde se signale ou se retente.
4. **Un message d'erreur dit ce qui s'est passé, ce que cela change et que faire.** Sans jargon.
5. **On conserve le travail de l'utilisateur.** Une erreur ne détruit pas la saisie.
6. **Une erreur locale reste locale.** Un widget en échec n'efface pas la page.
7. **On ne révèle rien d'interne.** Ni pile d'appels, ni existence d'éléments interdits ; on fournit un identifiant pour le support.

#### Vocabulaire essentiel

- **Premier usage** (*first-run state*) : état vide d'une zone que personne n'a encore alimentée.
- **Aucun résultat** (*no results*) : état vide dû à un filtre ou à une recherche.
- **État de chargement** (*loading state*) : état transitoire pendant l'obtention des données ; souvent un squelette (*skeleton*).
- **Erreur récupérable** (*recoverable error*) : erreur après laquelle la personne peut agir (corriger, réessayer).
- **Identifiant de corrélation** (*request id*) : identifiant qui relie l'écran d'erreur à la trace de la requête (voir [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs)).
- **Frontière d'erreur** (*error boundary*) : mécanisme qui limite la portée d'une erreur à une zone.
- **Hors ligne** (*offline*) : état où le réseau est indisponible.

#### Relations de cause à effet

- Une liste vide s'affiche sans explication. Le nouvel utilisateur croit que le produit est cassé ou vide de sens.
- Un seul message générique est utilisé pour toutes les erreurs. L'utilisateur ne sait pas s'il doit corriger, réessayer ou prévenir quelqu'un.
- Un widget en échec fait tomber toute la page. Une panne partielle devient une panne totale.
- Le message affiche une pile d'appels. L'utilisateur est perdu, et l'information interne est exposée.
- Le bouton « Réessayer » rejoue une opération non idempotente. Elle s'exécute deux fois.

#### Idées reçues

- **« Un état vide est un détail. »** C'est le premier écran de chaque nouveau tenant, et souvent le premier moment de vérité.
- **« Un message technique aide l'utilisateur. »** Il ne peut rien faire d'une exception interne. Il a besoin d'une cause compréhensible et d'une action.
- **« Une erreur est un échec de l'utilisateur. »** Ce n'est presque jamais le cas : le ton ne blâme pas.

#### Principe clé

Un état vide ou d'erreur explique la cause en mots de l'utilisateur, conserve son travail, et propose une action suivante.

#### Si vous ne retenez que trois choses

1. On distingue les états vides par leur cause : premier usage, aucun résultat, tout est traité, non autorisé.
2. Un message d'erreur dit quoi, pourquoi et que faire, avec un identifiant pour le support.
3. L'erreur reste locale et ne détruit pas la saisie.

### 3. Explication technique détaillée

#### Les états vides

| Type | Cause | Contenu du message | Action proposée |
|---|---|---|---|
| Premier usage | Rien n'a encore été créé | À quoi sert cette zone, un exemple | Créer, importer, choisir un modèle |
| Aucun résultat | Filtre ou recherche trop restrictif | Rappel des critères actifs | Retirer un critère, effacer les filtres |
| Tout est traité | File de travail vide (bonne nouvelle) | Le dire positivement | Voir l'historique, aller ailleurs |
| Non autorisé | Aucun accès aux éléments | La zone est restreinte, sans révéler son contenu | Demander l'accès |
| Non inclus | Fonction absente de l'offre | Quelle offre la propose | Voir les offres, contacter |

Le premier usage est l'occasion d'**enseigner**. Il peut présenter un exemple, un modèle de départ, ou renvoyer vers un assistant (voir [12.5 Formulaires et assistants](#125-formulaires-et-assistants)).

#### Les erreurs

| Famille | Exemple | Message type | Action |
|---|---|---|---|
| Validation | Date invalide | Dire quoi corriger, près du champ | Corriger et renvoyer |
| Permission | Action interdite | « Vous n'avez pas accès à cet élément » | Demander l'accès, revenir |
| Introuvable | Lien périmé | « Cet élément n'existe pas ou n'est plus accessible » | Retour à la liste, recherche |
| Conflit | Modifié par un autre utilisateur | Montrer les différences | Recharger, fusionner |
| Limite | Trop de requêtes | Dire quand réessayer | Attendre, réessayer |
| Système | Panne d'un service | « Un problème de notre côté a empêché l'opération » | Réessayer, communiquer l'identifiant |
| Réseau | Hors ligne | « Vous êtes hors ligne » | Travailler en local, resynchroniser |

Le message sur les permissions et l'inexistence reste volontairement identique pour un élément interdit et pour un élément absent (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)) : il ne révèle pas l'existence.

#### Anatomie d'un message d'erreur

```text
Impossible d'enregistrer le constat.                       ← ce qui s'est passé
La date d'échéance est antérieure à la date du constat.    ← pourquoi
→ Corrigez la date d'échéance, puis enregistrez à nouveau. ← que faire
Votre saisie est conservée.            Référence : req_91ab33   ← rassurer, aider le support
```

Quatre éléments : **ce qui s'est passé**, **pourquoi** quand on le sait, **que faire**, et **la référence** pour le support. On y ajoute de quoi rassurer : la saisie n'est pas perdue.

#### L'étendue de l'erreur

Une erreur reste dans la zone qui l'a produite. Chaque widget d'un tableau de bord a sa propre frontière d'erreur : si l'un échoue, il affiche « Impossible de charger ce graphique. [Réessayer] » et le reste de la page fonctionne (voir [12.7 Tableaux de bord](#127-tableaux-de-bord)). Le même principe s'applique à une dépendance indisponible : le système se dégrade, il ne s'arrête pas (voir [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)).

#### Le chargement

- Un **squelette** (forme grisée de la page) évite les sauts de mise en page et rassure plus qu'un indicateur seul.
- Au-delà d'un délai (quelques secondes), un message dit que l'opération est plus longue que d'habitude.
- Un état de chargement ne dure pas indéfiniment : un délai d'attente le fait basculer vers un état d'erreur avec une action.

#### Réessayer sans danger

Un bouton « Réessayer » n'est sûr que si l'opération est **idempotente** (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)), ou si elle n'a pas eu lieu. Pour une création, l'interface renvoie la même clé d'idempotence. Les reprises automatiques utilisent un délai croissant pour ne pas aggraver la panne (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).

#### Sécurité et support

- Aucune **pile d'appels** ni détail interne n'est affiché.
- L'**identifiant de corrélation** permet au support de retrouver l'événement et la trace (voir [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) et [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs)).
- Un élément interdit et un élément inexistant ont le même message.
- Les messages ne contiennent pas de données d'un autre tenant.

#### Un contenu configurable

Dans une plateforme où les administrateurs définissent des types d'objets, les états vides ne peuvent pas être écrits à l'avance pour chacun. La plateforme fournit un message générique construit à partir du nom du type (« Aucun {type} pour le moment »). L'administrateur peut ajouter un texte d'aide et un lien vers sa propre procédure.

```json
{
  "resource": "finding",
  "empty_state": {
    "first_use": {
      "title": "Aucun constat pour le moment",
      "body": "Les constats sont créés par les techniciens pendant les inspections.",
      "actions": ["create", "import"],
      "help_link": "https://wiki.alpha-air.example/procedure-constats"
    }
  }
}
```

#### Les modes de défaillance

- **L'écran blanc**, ou le cercle qui tourne indéfiniment.
- **Le message unique** pour toutes les erreurs.
- **L'erreur globale** pour un problème local.
- **Le jargon technique** ou la pile d'appels affichée.
- **Le blâme** : « Vous avez saisi une valeur incorrecte ».
- **La saisie perdue.**
- **Le bouton « Réessayer »** sur une opération non idempotente.

**Contre-exemple.** L'API renvoie une indisponibilité temporaire. L'écran affiche un cercle qui tourne sans fin. L'utilisateur recharge dix fois, et chaque rechargement ajoute une requête sur un service déjà à bout.

**Limites.** Les messages ne remplacent pas la correction des causes : un état d'erreur bien conçu reste un échec. La qualité d'un message dépend aussi des codes d'erreur fournis par le serveur : s'ils sont génériques, l'interface ne peut pas être plus précise (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Les codes et le format d'erreur du serveur alimentent les messages |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend « Réessayer » sûr |
| [11.14 Suivi des erreurs](11-securite-fiabilite-operations.md#1114-suivi-des-erreurs) | L'identifiant de corrélation relie l'écran au suivi des erreurs |
| [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive) | La dégradation progressive limite l'étendue d'une panne |
| [12.2 Design systems](#122-design-systems) | Les états sont des motifs standardisés du système de conception |
| [12.5 Formulaires et assistants](#125-formulaires-et-assistants) | Les erreurs de validation suivent les règles des formulaires |
| [12.6 Tables, filtres, recherche et vues](#126-tables-filtres-recherche-et-vues) | « Aucun résultat » est l'état vide des listes filtrées |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | « Non autorisé » dépend des permissions |
| [12.14 Explicabilité](#1214-explicabilité) | Les messages expliquent pourquoi une action est impossible |

### 5. Application pratique

**Situation initiale.** Un nouveau tenant, une compagnie régionale, active sa plateforme. Les 14 écrans de liste sont vides. Les nouveaux administrateurs ne savent pas par où commencer, et le premier appel à l'API de la veille a renvoyé une erreur qui s'est affichée en anglais, sans consigne.

**Problème.** Les écrans vides n'enseignent rien, et les erreurs n'aident pas.

**Application du concept.** Une conception systématique des états.

**Déroulé.**

1. L'équipe produit classe chaque écran vide par type (premier usage, aucun résultat, tout est traité) et rédige un gabarit par type.
2. Les écrans de premier usage proposent des actions : créer, importer un fichier (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)), choisir un modèle. L'écran « Aéronefs » propose d'importer la flotte.
3. Les filtres actifs sont rappelés dans « Aucun résultat », avec un bouton pour retirer le dernier.
4. Les erreurs sont mappées sur les familles du tableau : chaque famille a un message, une action et une référence de support.
5. Chaque widget des tableaux de bord reçoit sa propre frontière d'erreur.
6. Les messages sont traduits et ne contiennent aucun détail interne.

**Résultat.** La part des nouveaux tenants qui créent leur premier objet dans les 24 heures augmente nettement, et les tickets « ça ne marche pas » diminuent, car les messages indiquent quoi faire.

**Limites.** Les états vides spécifiques à chaque type d'objet restent génériques : seule une aide rédigée par l'administrateur les rend vraiment utiles.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois types d'états vides et la différence de message entre eux.
2. **Compréhension.** Quels sont les quatre éléments d'un bon message d'erreur ?
3. **Compréhension.** Pourquoi limite-t-on une erreur à la zone qui l'a produite ?
4. **Pourquoi.** Pourquoi un élément interdit et un élément absent reçoivent-ils le même message ?
5. **Raisonnement pratique.** Un bouton « Réessayer » apparaît après l'échec de la création d'un enregistrement. Qu'est-ce qui garantit que la reprise ne crée pas un doublon ?

#### Réponses

1. Premier usage (rien n'a encore été créé : on explique à quoi sert la zone et on propose de créer ou d'importer), aucun résultat (un filtre est trop strict : on rappelle les critères et on propose de les retirer), tout est traité (c'est une bonne nouvelle : on le dit et on propose d'aller ailleurs).
2. Ce qui s'est passé, pourquoi (quand on le sait), que faire, et une référence pour le support. On y ajoute de quoi rassurer, par exemple que la saisie est conservée.
3. Pour qu'une panne partielle reste partielle : un widget en échec n'empêche pas d'utiliser le reste de la page, et l'utilisateur peut continuer à travailler.
4. Pour ne pas révéler l'existence d'un élément à quelqu'un qui n'a pas le droit de le voir. Un message différent permettrait de déduire qu'il existe.
5. L'idempotence : l'interface renvoie la même clé d'idempotence, et le serveur reconnaît la requête déjà traitée au lieu de recréer l'enregistrement (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

## 12.12 Interface sensible aux permissions et aux rôles

### 1. Comprendre simplement

Une **interface sensible aux permissions** (*permission-aware UI*) adapte ce qu'elle montre et ce qu'elle permet **aux droits réels de la personne**. Une **interface sensible aux rôles** (*role-aware UI*) adapte **la présentation et les parcours au rôle** : planificateur, technicien, responsable qualité. L'interface n'est pas la même pour tout le monde.

**Pourquoi cela existe.** Montrer des boutons qu'une personne ne peut pas utiliser crée de la frustration et des demandes au support. À l'inverse, tout cacher sans explication rend les droits opaques. Un même écran ne sert pas non plus de la même façon un planificateur et un technicien. Mais l'interface ne doit jamais être la seule défense.

**Problème résolu.** Présenter à chacun ce qui est utile et possible pour lui, sans bruit, sans impasse, et sans que la sécurité repose sur l'affichage.

**Modèle mental.** Le badge d'accès d'un bâtiment. Les portes s'ouvrent selon le badge, et les plans à l'entrée n'indiquent que ce que vous pouvez visiter. Mais le gardien et les serrures restent en place.

**Où l'analogie s'arrête.** Un badge ouvre ou n'ouvre pas. L'interface a trois choix : cacher, montrer désactivé, ou expliquer, et le bon choix dépend de la situation.

**Exemple.** Le technicien voit « Mes tâches » et « Créer un constat ». Le planificateur voit « Planification » et le bouton « Immobiliser ». Le responsable qualité voit « Remettre en service ». Une personne qui n'a pas le droit voit le bouton désactivé avec « Réservé au responsable qualité. [Demander l'accès] ».

**Les composants.**

1. les **droits calculés par le serveur** ;
2. les **capacités** exposées à l'interface ;
3. des **règles de présentation** : cacher, désactiver, expliquer ;
4. l'**adaptation au rôle** : accueil, navigation, vocabulaire ;
5. l'**application côté serveur**, qui reste la seule garantie.

**Objectif d'apprentissage :** vous pouvez choisir entre cacher, désactiver et expliquer, décrire comment l'interface obtient les droits, et expliquer pourquoi cacher un bouton ne sécurise rien.

### 2. Connaissances essentielles

#### Définition

- **Interface sensible aux permissions** : interface dont les éléments affichés et les actions proposées sont déterminés par les droits de la personne dans le contexte courant.
- **Interface sensible aux rôles** : interface dont la présentation (accueil, navigation, vues par défaut, vocabulaire) est adaptée au rôle de la personne.

#### Idées fondamentales

1. **L'interface reflète les droits, elle ne les applique pas.** Le serveur reste l'autorité (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
2. **Le serveur indique les capacités.** L'interface ne recopie pas les règles de droits : sinon, les deux dérivent.
3. **On choisit entre cacher, désactiver et expliquer.** Selon que la personne pourrait obtenir l'accès, que la fonction est pertinente, et que l'existence est sensible.
4. **Les droits dépendent du contexte.** Objet, état, tenant, pas seulement le rôle.
5. **Le rôle oriente la présentation.** L'accueil, les tableaux de bord et le vocabulaire diffèrent.
6. **Une personne a souvent plusieurs rôles.** Les droits s'ajoutent, et l'interface le gère.
7. **L'interface ne révèle pas ce que la sécurité cache.** Un bouton grisé ne doit pas trahir l'existence d'un élément interdit.

#### Vocabulaire essentiel

- **Capacité** (*capability*) : action qu'une personne peut effectuer sur une ressource dans le contexte courant.
- **Action permise** (*allowed action*) : élément de la réponse du serveur qui indique ce qui est possible.
- **Masquer** (*hide*) : ne pas afficher l'élément.
- **Désactiver** (*disable*) : afficher l'élément, non utilisable, avec ou sans explication.
- **Voir en tant que** (*view as*) : simulation de l'interface telle que la verrait un rôle donné.
- **Demande d'accès** (*access request*) : processus par lequel une personne sollicite un droit.
- **Persona** : profil type d'utilisateur, utilisé pour concevoir l'interface par rôle.

#### Relations de cause à effet

- L'interface recopie localement les règles de droits. Les règles du serveur évoluent, l'interface montre des boutons qui échouent, ou cache des actions autorisées.
- Un bouton est caché sans explication. L'utilisateur croit à une panne, ou ne sait pas qu'il peut demander l'accès.
- Le même accueil est affiché à tous. Chaque personne doit chercher l'utile dans le bruit.
- Le contrôle repose sur le masquage. Un appel direct à l'API contourne la protection : c'est une faille.
- Les capacités sont calculées une fois à la connexion. Elles deviennent fausses quand les droits ou l'état de l'objet changent.

#### Idées reçues

- **« Cacher le bouton sécurise l'action. »** Non. Il empêche seulement un clic. Seul le serveur protège.
- **« Désactiver vaut toujours mieux que cacher. »** Un élément désactivé dont la personne n'aura jamais l'usage est du bruit, et peut révéler des fonctions ou des objets sensibles.
- **« Un rôle égale une interface. »** Les droits dépendent aussi du contexte : un technicien peut modifier ses propres tâches, pas celles des autres.

#### Principe clé

L'interface montre ce qui est possible et utile à la personne selon les capacités fournies par le serveur, explique ce qui ne l'est pas quand c'est utile, et ne remplace jamais le contrôle du serveur.

#### Si vous ne retenez que trois choses

1. Le serveur calcule les capacités, l'interface les affiche, et seul le serveur protège.
2. On choisit entre cacher, désactiver et expliquer selon le cas, sans révéler d'information sensible.
3. Le rôle adapte la présentation : accueil, navigation, vocabulaire, vues par défaut.

### 3. Explication technique détaillée

#### Cacher, désactiver ou expliquer

| Situation | Choix | Raison |
|---|---|---|
| Fonction réservée à un rôle que la personne n'aura jamais (administration de la plateforme) | Cacher | Du bruit, et parfois une information |
| Fonction à laquelle la personne peut accéder (demande d'accès, montée d'offre) | Montrer désactivée, avec la raison et un chemin | Informer et permettre d'agir |
| Action impossible à cause de l'état de l'objet (garde de workflow) | Montrer désactivée avec la raison (voir [12.14 Explicabilité](#1214-explicabilité)) | La personne comprend comment la débloquer |
| Élément dont l'existence est sensible | Cacher | Ne pas révéler |
| Champ en lecture seule | Montrer sans contrôle d'édition | La personne voit la donnée sans pouvoir la modifier |

#### Les capacités fournies par le serveur

L'interface ne devine pas les droits. Le serveur les calcule, avec la même logique qui les appliquera, et les joint à la réponse.

```json
{
  "id": "ac_8f3a",
  "type": "aircraft",
  "attributes": { "registration": "F-ABCD", "status": "active" },
  "capabilities": {
    "update": { "allowed": true },
    "transitions": {
      "ground": {
        "allowed": false,
        "reason": { "code": "guard_failed", "message": "Un vol est programmé dans les 24 h." }
      },
      "retire": {
        "allowed": false,
        "reason": { "code": "permission_denied", "required_role": "technical_director" }
      }
    },
    "fields": {
      "next_inspection_date": "editable",
      "internal_notes": "hidden"
    }
  }
}
```

- `update` : la modification de la ressource est possible.
- `transitions` : chaque transition indique si elle est possible, et sinon pourquoi.
- `fields` : chaque champ est éditable, en lecture seule ou masqué (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

L'interface construit ses boutons à partir de ces informations, sans connaître les règles. Quand les règles changent, rien ne change dans l'interface.

#### Le calcul des capacités

Les capacités viennent du moteur de politiques (voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) et des gardes des transitions (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)). Pour une liste, on évite d'appeler le moteur une fois par ligne : on calcule les capacités par lot, ou par type pour les règles qui ne dépendent pas de la ligne, et on précise celles qui dépendent d'elle à la demande.

Les capacités peuvent devenir **périmées** : un droit retiré, un état qui a changé. Le serveur revérifie à l'exécution, et l'interface traite proprement un refus (voir [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur)).

#### Le rôle et la personnalisation

| Élément | Adaptation par rôle |
|---|---|
| Accueil | Tableau de bord du rôle (voir [12.7 Tableaux de bord](#127-tableaux-de-bord)) |
| Navigation | Sections utiles, ordre adapté (voir [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation)) |
| Vues par défaut | « Mes tâches » pour le technicien, « À planifier » pour le planificateur |
| Vocabulaire | Libellés du métier du rôle |
| Raccourcis et commandes | Commandes pertinentes pour le rôle (voir [12.9 Palette de commandes](#129-palette-de-commandes)) |

L'adaptation par rôle est une **configuration** (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables)) : on n'écrit pas une interface par rôle.

#### Plusieurs rôles et contextes

- Les droits de plusieurs rôles **s'ajoutent**, et l'accueil combine les vues utiles.
- Une personne peut choisir un **rôle actif** (« Agir en tant que : Planificateur ») quand les rôles ont des contextes très différents.
- Le **contexte** de tenant ou d'organisation (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)) modifie les droits : on peut être administrateur d'un tenant et simple lecteur d'un autre.

#### « Voir en tant que »

Un administrateur qui conçoit des rôles veut savoir ce que verra une personne. Deux mécanismes à ne pas confondre :

- **Voir en tant que** : simulation de l'interface selon un rôle, sans agir, pour vérifier la conception.
- **Se connecter en tant que** (emprunt d'identité) : action réelle sous l'identité d'une autre personne, exceptionnelle, encadrée et auditée (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) et [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

#### La sécurité

- Le serveur **refuse** toute action non autorisée, quel que soit l'état de l'interface.
- On teste les droits **par l'API**, avec des requêtes qui contournent l'interface.
- Les réponses interdit et inexistant restent indiscernables quand l'existence est sensible (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)).
- L'interface ne contient pas de **secrets** ni de règles sensibles côté client.

#### Les modes de défaillance

- **Des règles de droits dupliquées** dans l'interface, qui dérivent.
- **Des boutons cachés sans explication** : les utilisateurs signalent des pannes.
- **Une sécurité par le masquage** : l'API reste ouverte.
- **Des capacités périmées** après un changement de droits.
- **Un accueil unique** pour tous les rôles.
- **Un calcul de droits ligne par ligne** qui ralentit les listes.

**Contre-exemple.** Une plateforme masque le bouton « Supprimer » pour les techniciens. L'appel direct `DELETE /resources/finding/{id}` n'est pas contrôlé côté serveur. Un technicien, par curiosité, appelle l'API depuis la console du navigateur et supprime un constat d'une autre équipe.

**Limites.** L'interface sensible aux permissions augmente la complexité : chaque écran peut avoir plusieurs états selon la personne, et les tests doivent couvrir les combinaisons. Les droits très fins (au niveau du champ ou de la ligne) rendent la présentation plus difficile à prévoir.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) à [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles) | Rôles, politiques, RBAC, ABAC, permissions fines : la source des droits |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Le moteur de politiques calcule les capacités |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les permissions au niveau ressource, champ et ligne fixent ce qui est affiché |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les gardes de transition expliquent les actions impossibles |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Le comportement 403 ou 404 protège l'existence |
| [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation) et [12.9 Palette de commandes](#129-palette-de-commandes) | La navigation et la palette dépendent des permissions |
| [12.14 Explicabilité](#1214-explicabilité) | L'explicabilité complète la désactivation d'un élément |
| [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) | Les vues et formulaires par rôle sont des configurations |

### 5. Application pratique

**Situation initiale.** Tous les boutons sont visibles pour tous les rôles. Un technicien clique sur « Immobiliser » et obtient une erreur 403 sans explication. Le support reçoit des tickets « le bouton ne marche pas ». L'équipe a ajouté, côté interface, un tableau de règles de droits qui n'est plus à jour.

**Problème.** Les droits sont dupliqués dans l'interface, mal expliqués, et l'accueil est identique pour tous.

**Application du concept.** Des capacités fournies par le serveur et des règles de présentation.

**Déroulé.**

1. Le serveur joint les capacités à chaque réponse : chaque transition indique si elle est possible, et pourquoi sinon.
2. L'interface supprime son tableau de règles. Elle affiche les boutons selon les capacités.
3. Les fonctions que la personne n'aura jamais sont masquées. Les actions bloquées par une garde sont désactivées, avec le message de la garde. Les fonctions accessibles sur demande proposent « Demander l'accès ».
4. L'accueil dépend du rôle : « Mes tâches » pour le technicien, « À planifier » pour le planificateur, « En attente d'approbation » pour le responsable qualité.
5. Les tests d'API vérifient que les actions interdites sont refusées même sans interface.

**Résultat.** Les tickets « le bouton ne marche pas » disparaissent, car les raisons sont affichées. Quand les règles de droits changent, l'interface suit sans modification.

**Limites.** Le calcul des capacités d'une liste de 500 lignes a un coût : l'équipe l'a limité aux capacités qui dépendent de la ligne, et calcule les autres une fois par type.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une interface sensible aux permissions et une interface sensible aux rôles ?
2. **Compréhension.** Dans quels cas masque-t-on un élément plutôt que de le désactiver ?
3. **Compréhension.** Comment l'interface connaît-elle les droits de la personne ?
4. **Pourquoi.** Pourquoi cacher un bouton ne suffit-il pas à sécuriser une action ?
5. **Raisonnement pratique.** Un utilisateur voit le bouton « Approuver » actif, clique, et reçoit un refus. Quelles causes envisagez-vous, et que fait l'interface ?

#### Réponses

1. La première adapte ce que l'on peut voir et faire aux droits précis dans le contexte courant. La seconde adapte la présentation et les parcours (accueil, navigation, vocabulaire) au rôle. Les deux se complètent.
2. Quand la fonction ne sera jamais accessible à la personne (bruit), ou quand son existence est sensible. On désactive et on explique quand la personne peut obtenir l'accès ou quand un état bloque l'action.
3. Le serveur calcule les capacités avec la logique qui sera appliquée à l'exécution, et les joint à ses réponses. L'interface les affiche sans recopier les règles.
4. Parce que le masquage empêche seulement un clic. Un appel direct à l'API contourne l'interface. Le serveur doit refuser toute action non autorisée.
5. Les capacités étaient périmées (droit retiré, état qui a changé depuis le chargement), ou une règle dépend d'un élément changeant entre le chargement et le clic. L'interface affiche un message d'erreur de permission clair, recharge les capacités, et ne laisse pas la personne croire à une panne.

## 12.13 Découvrabilité

### 1. Comprendre simplement

La **découvrabilité** (*discoverability*) est la facilité avec laquelle un utilisateur **découvre ce que le système sait faire**, y compris des capacités dont il ne soupçonne pas l'existence. Le plan la pose ainsi : *comment l'utilisateur découvre-t-il les capacités du système ?*

**Pourquoi cela existe.** Dans une plateforme configurable, la puissance est dans les options. Une fonction que personne ne découvre est, pour l'utilisateur, une fonction qui n'existe pas. Les clients paient pour des capacités qu'ils n'utilisent pas, ils bricolent des tableurs pour ce que la plateforme fait déjà, et ils demandent des fonctions qui existent.

**Problème résolu.** Faire en sorte que chaque capacité utile soit trouvée au moment où elle sert, sans formation préalable et sans surcharger l'écran.

**Modèle mental.** Une rue commerçante. Les enseignes disent ce qu'il y a derrière chaque porte. Un magasin sans enseigne a des produits mais pas de clients. La personne qui cherche une pharmacie repère la croix verte sans avoir lu un plan.

**Où l'analogie s'arrête.** Une rue change lentement. Une plateforme change à chaque version et à chaque configuration, et ses « enseignes » dépendent du rôle, des droits et de l'offre.

**Exemple.** Un responsable qualité exporte chaque semaine les constats vers un tableur pour compter les retards. Il ignore que la plateforme offre des mesures et des tableaux de bord. Une suggestion discrète, à l'endroit de l'export, lui propose de créer un tableau de bord à partir de cette vue.

**Les composants.**

1. des **signifiants** visibles : boutons, icônes, libellés ;
2. une **structure** compréhensible (voir [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation)) ;
3. la **recherche** et la **palette de commandes** (voir [12.9 Palette de commandes](#129-palette-de-commandes)) ;
4. des **aides contextuelles** : indices, exemples, états vides ;
5. des **modèles** et un **parcours de démarrage** ;
6. l'**annonce des nouveautés** ;
7. la **mesure** de l'adoption.

**Objectif d'apprentissage :** vous pouvez distinguer découvrabilité, trouvabilité et apprenabilité, citer les leviers qui rendent une capacité découvrable, et expliquer comment on mesure l'adoption.

### 2. Connaissances essentielles

#### Définition

**Découvrabilité** : propriété d'un système dont les capacités peuvent être trouvées par l'utilisateur, sans formation préalable, au moment où elles lui sont utiles.

Elle se distingue de deux notions voisines :

- la **trouvabilité** (*findability*) : retrouver quelque chose dont on sait qu'il existe ;
- l'**apprenabilité** (*learnability*) : facilité à apprendre à utiliser une capacité une fois qu'on l'a découverte.

#### Idées fondamentales

1. **Ce qui ne se voit pas n'existe pas.** Une capacité a besoin de signifiants : un libellé, une icône, un emplacement logique.
2. **On découvre dans le contexte.** Une aide au moment du besoin vaut plus qu'une documentation lue à l'avance.
3. **Il faut plusieurs chemins.** Navigation, recherche, palette, aide, états vides, modèles.
4. **La divulgation progressive reste signalée.** Ce qui est replié est annoncé (voir [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle)).
5. **Les droits et l'offre ont leur place.** Une capacité à laquelle la personne n'a pas accès peut être montrée et expliquée (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)).
6. **On mesure l'adoption.** La présence d'une fonction ne prouve pas qu'elle est découverte.
7. **Le changement est une source d'invisibilité.** Les nouveautés et les objets personnalisés doivent être annoncés au bon endroit.

#### Vocabulaire essentiel

- **Affordance** (*affordance*) : possibilité d'action que suggère l'apparence d'un élément.
- **Signifiant** (*signifier*) : indice perceptible qui indique où et comment agir (terme popularisé par Don Norman).
- **Intégration** (*onboarding*) : accompagnement des premiers usages d'un nouvel utilisateur ou d'un nouveau tenant.
- **Liste de démarrage** (*getting-started checklist*) : suite d'étapes proposées pour mettre en place l'essentiel.
- **Aide contextuelle** (*contextual help*) : explication affichée à l'endroit où l'on en a besoin.
- **Adoption** (*feature adoption*) : part des utilisateurs éligibles qui ont utilisé une capacité.
- **Annonce de nouveautés** (*what's new*) : présentation des changements récents, ciblée.

#### Relations de cause à effet

- Les capacités n'ont pas de signifiant. Elles sont sous-utilisées, et les clients demandent des fonctions qui existent.
- La découverte repose sur une formation ou une documentation externe. Elle coûte cher, et elle est oubliée dès la première semaine.
- Tout est affiché en permanence. La surcharge cache ce qui compte, et rien n'est découvert pour autant.
- Les nouveautés ne sont pas annoncées au bon endroit. Les clients pensent que la fonction manque.
- Les objets configurés par le tenant (types, workflows, vues) ne sont pas répertoriés. Personne ne sait ce qui a été construit.

#### Idées reçues

- **« Une bonne documentation suffit. »** La plupart des utilisateurs agissent sans la lire. Elle complète le produit, elle ne le remplace pas.
- **« Une visite guidée au premier lancement règle tout. »** Elle est vite oubliée, et elle se déroule hors contexte.
- **« Les utilisateurs découvriront en explorant. »** Explorer a un coût et un risque, en particulier en administration, où l'on craint de casser.

#### Principe clé

Chaque capacité utile a un signifiant à l'endroit où elle sert, plusieurs chemins pour être trouvée, et une mesure d'adoption pour savoir si elle l'est.

#### Si vous ne retenez que trois choses

1. Une capacité non découverte est une capacité qui n'existe pas pour l'utilisateur.
2. On découvre dans le contexte : signifiants, états vides, modèles, suggestions et recherche.
3. On mesure l'adoption, tenant par tenant, pour savoir ce qui n'est pas découvert.

### 3. Explication technique détaillée

#### Les leviers

| Levier | Quand | Exemple |
|---|---|---|
| Signifiants visibles | Toujours | Bouton « Ajouter un champ » à côté du formulaire (voir [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle)) |
| États vides pédagogiques | Premier usage | « Créez votre premier workflow » avec un modèle (voir [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur)) |
| Modèles et exemples | À la création | « Créer à partir d'un modèle » |
| Recherche et palette | Intention connue | « Réglages : notifications » (voir [12.9 Palette de commandes](#129-palette-de-commandes)) |
| Aide contextuelle | Au point de décision | Info-bulle « À quoi sert ce champ ? » |
| Suggestions contextuelles | Comportement répété | « Vous exportez souvent cette vue : créer un tableau de bord ? » |
| Parcours de démarrage | Nouveau tenant | Liste d'étapes pour mettre en place l'essentiel |
| Annonce de nouveautés | Nouvelle version | Encart ciblé selon le rôle et l'usage |

#### Une liste de démarrage

```text
Démarrer avec Alpha Air                                            3 sur 6
  ☑ Importer la flotte
  ☑ Inviter les planificateurs
  ☑ Définir les rôles
  ☐ Configurer le workflow des constats
  ☐ Créer un tableau de bord de la flotte
  ☐ Connecter le système qualité
```

Une liste de démarrage est utile quand elle est **courte**, **orientée résultat**, **mesurable** (case cochée automatiquement) et **reportable** (on peut la quitter et la reprendre).

#### Les capacités hors offre ou hors droits

Montrer une capacité qu'une personne ne peut pas utiliser informe, mais peut agacer. On adopte les règles suivantes :

- on la montre **désactivée avec une explication** : « Disponible dans l'offre Entreprise », ou « Réservé aux responsables qualité » (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)) ;
- on propose un **chemin** : demander l'accès, voir l'offre, contacter l'administrateur ;
- on **ne multiplie pas** les messages promotionnels : un indice discret, pas une interruption.

#### Mesurer l'adoption

$$\text{taux d'adoption} = \frac{\text{utilisateurs éligibles ayant utilisé la capacité}}{\text{utilisateurs éligibles}}$$

- **Utilisateurs éligibles** : ceux qui ont le droit d'utiliser la capacité et pour qui elle est pertinente (rôle, offre, contexte).
- **Utilisé** : une action significative, pas une simple ouverture d'écran.

**Exemple.** Sur 120 utilisateurs éligibles aux tableaux de bord, 38 en ont utilisé un au cours du dernier mois : $38 / 120 \approx 32\ \%$.

| Mesure | Ce qu'elle révèle |
|---|---|
| Taux d'adoption | Part des éligibles qui utilisent la capacité |
| Délai jusqu'à la première utilisation | Rapidité de la découverte |
| Taux de retour | Utilité perçue après la première utilisation |
| Recherches sans résultat | Libellés et fonctions que les utilisateurs cherchent sans les trouver |
| Questions au support | Capacités mal signalées |

Ces mesures sont des **statistiques d'usage**. Elles respectent le consentement et les règles du tenant sur la collecte de données (voir [11.1 La triade CIA](11-securite-fiabilite-operations.md#111-la-triade-cia)).

#### Rendre découvrable ce que le tenant a construit

Dans une plateforme configurable, chaque tenant construit son propre système : types d'objets, champs, workflows, vues, règles. Ce système doit être lui-même découvrable.

- Un **catalogue** liste ce que le tenant a configuré, avec description, auteur, date et usage.
- Une **documentation générée** à partir de la configuration (types, états, rôles, règles) reste à jour sans effort.
- Le **vocabulaire** est cohérent entre les écrans, la palette et la documentation (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).

#### Découvrabilité et divulgation progressive

Les deux principes s'opposent en apparence : l'un montre moins, l'autre veut que tout se trouve. Ils se concilient par :

- un **indice** visible qui annonce les options repliées ;
- une **recherche** qui couvre aussi les options avancées ;
- des **états vides** et des **exemples** qui font apparaître les capacités le moment venu ;
- des **mesures** pour promouvoir ce que les utilisateurs cherchent souvent.

#### Les modes de défaillance

- **Des fonctions sans signifiant**, découvertes par hasard.
- **Une formation obligatoire** pour des tâches courantes.
- **Une visite guidée** longue, au mauvais moment, qui est fermée immédiatement.
- **Des nouveautés cachées** dans des notes de version que personne ne lit.
- **Un catalogue de la configuration absent** : personne ne sait ce qui existe.
- **Des suggestions intrusives**, qui agacent et sont désactivées.

**Contre-exemple.** Une plateforme livre une fonction de simulation des règles. Elle apparaît seulement dans un sous-menu « Avancé » de l'éditeur de règles et n'est mentionnée que dans les notes de version. Six mois plus tard, 3 % des administrateurs l'ont utilisée, et les clients demandent « un moyen de tester une règle avant de la publier ».

**Limites.** La découvrabilité a un coût : chaque indice occupe de l'espace et de l'attention. Les suggestions fondées sur le comportement posent des questions de consentement. Une fonction très spécialisée n'a pas à être découverte par tous : l'objectif est qu'elle le soit par ceux à qui elle sert.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.1 Architecture de l'information et navigation](#121-architecture-de-linformation-et-navigation) | La structure et les libellés déterminent la découvrabilité de base |
| [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle) | La divulgation progressive doit rester signalée |
| [12.9 Palette de commandes](#129-palette-de-commandes) | La palette de commandes expose la liste des actions possibles |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | Les états vides sont des occasions d'enseigner |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Les capacités hors droits peuvent être montrées et expliquées |
| [12.14 Explicabilité](#1214-explicabilité) | L'explicabilité répond à « pourquoi ne puis-je pas ? » là où la découvrabilité répond à « que puis-je faire ? » |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La place de marché pose le même problème pour les extensions |
| [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent) | Le langage omniprésent rend les libellés prévisibles |

### 5. Application pratique

**Situation initiale.** Trois mois après son arrivée, le tenant utilise 20 % des fonctions de la plateforme. Le responsable qualité exporte les constats vers un tableur chaque semaine pour compter les retards. Aucun workflow n'est configuré.

**Problème.** Les capacités existent mais ne sont pas découvertes, et les administrateurs hésitent à explorer la configuration de peur de la casser.

**Application du concept.** Un ensemble de leviers complémentaires.

**Déroulé.**

1. L'équipe produit ajoute une **liste de démarrage** en six étapes, cochées automatiquement, visible sur l'accueil de l'administrateur.
2. Elle propose des **modèles** : « Workflow de constat standard » et « Tableau de bord Santé de la flotte ».
3. Un **signifiant** « Créer un tableau de bord à partir de cette vue » apparaît près de l'action d'export.
4. L'**état vide** de la liste de workflows présente le modèle standard, avec un aperçu.
5. La **palette** (voir [12.9 Palette de commandes](#129-palette-de-commandes)) liste « Créer : tableau de bord », « Créer : workflow ».
6. Une annonce **ciblée** informe les responsables qualité de la fonction de simulation, à l'endroit de l'éditeur de règles.
7. L'équipe suit le **taux d'adoption** par capacité et par tenant.

**Résultat.** Au bout de deux mois, la part des responsables qualité qui utilisent un tableau de bord passe d'environ 12 % à environ 55 % (valeurs illustratives). L'export hebdomadaire vers un tableur disparaît.

**Limites.** L'adoption dépend aussi de la valeur perçue : un tableau de bord découvert mais mal conçu n'est pas réutilisé (voir [12.7 Tableaux de bord](#127-tableaux-de-bord)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre découvrabilité, trouvabilité et apprenabilité ?
2. **Compréhension.** Citez quatre leviers qui améliorent la découvrabilité.
3. **Compréhension.** Comment mesure-t-on l'adoption d'une capacité ?
4. **Pourquoi.** Pourquoi une documentation, même excellente, ne suffit-elle pas à rendre une capacité découvrable ?
5. **Raisonnement pratique.** Une fonction livrée il y a six mois n'est utilisée que par 3 % des utilisateurs éligibles. Quelles sont vos hypothèses et vos actions ?

#### Réponses

1. La découvrabilité est la possibilité de découvrir ce qui existe sans le savoir. La trouvabilité est la possibilité de retrouver ce dont on sait qu'il existe. L'apprenabilité est la facilité d'apprendre à utiliser une capacité une fois qu'on l'a découverte.
2. Des signifiants visibles, des états vides pédagogiques, des modèles et exemples, une recherche ou une palette, des aides contextuelles, des suggestions contextuelles, des parcours de démarrage, et des annonces ciblées de nouveautés.
3. Par le taux d'adoption : le nombre d'utilisateurs éligibles qui ont utilisé la capacité (par une action significative) divisé par le nombre d'utilisateurs éligibles. On suit aussi le délai de première utilisation et le taux de retour.
4. Parce que la plupart des utilisateurs agissent avant de lire. Une capacité doit se signaler au moment et à l'endroit où elle sert. La documentation complète le produit, elle ne remplace pas ses signifiants.
5. Hypothèses : signifiant absent ou mal placé, nom incompris, fonction cachée en « avancé », nouveauté non annoncée, besoin mal identifié. Actions : vérifier les recherches sans résultat et les questions au support, tester avec des utilisateurs, améliorer le signifiant et l'emplacement, ajouter un modèle ou une suggestion contextuelle, puis remesurer.

## 12.14 Explicabilité

### 1. Comprendre simplement

L'**explicabilité** (*explainability*) est la capacité du système à **expliquer ses résultats et ses refus** en termes compréhensibles : pourquoi une action est impossible, pourquoi un élément est visible ou masqué, pourquoi une règle s'est déclenchée, pourquoi un workflow a pris cette branche. Le plan la pose ainsi : *pourquoi cette action est-elle impossible ?*

**Pourquoi cela existe.** Un système configurable combine des permissions, des états, des gardes, des règles, des quotas, des offres et de l'héritage. Quand une action est refusée, la cause peut se trouver dans n'importe laquelle de ces couches. Sans explication, l'utilisateur ne peut pas résoudre le problème, le support devient l'interprète du système, la confiance s'érode, et les administrateurs ne parviennent pas à déboguer leur propre configuration.

**Problème résolu.** Transformer un refus opaque en une cause compréhensible et une prochaine étape.

**Modèle mental.** Le tableau de bord d'une voiture. Un voyant générique « défaut moteur » laisse démuni. Un message « porte arrière mal fermée » dit quoi faire. L'explicabilité est la différence entre les deux.

**Où l'analogie s'arrête.** Une voiture n'a pas de secrets à protéger. Une plateforme doit calibrer l'explication selon la personne : ne pas révéler l'existence d'éléments interdits, ni la mécanique interne des règles de sécurité.

**Exemple.** Le bouton « Immobiliser » est grisé. Au lieu d'un simple « Action non autorisée », l'interface affiche : « Impossible pour le moment : le vol AF-123 est programmé le 2026-10-14 à 06:40 UTC (dans moins de 24 h). [Voir le vol] ».

**Les composants.**

1. des **raisons structurées**, produites par le moteur ;
2. leur **traduction** en langage de l'utilisateur ;
3. leur **présentation** à l'endroit du blocage ;
4. une **action de résolution** ;
5. un **niveau de détail** adapté au public ;
6. une **trace** des décisions pour l'analyse après coup.

**Objectif d'apprentissage :** vous pouvez décrire comment un moteur produit des raisons structurées, adapter l'explication au public, et expliquer le compromis avec la sécurité.

### 2. Connaissances essentielles

#### Définition

**Explicabilité** : capacité d'un système à fournir, pour une décision, un refus ou un résultat, les raisons qui l'ont produit, sous une forme compréhensible par la personne concernée, avec les moyens d'agir.

#### Idées fondamentales

1. **Chaque refus a une raison structurée.** Un code et des paramètres, produits par le moteur, pas un texte écrit à la main dans l'interface.
2. **La raison s'exprime dans le vocabulaire de l'utilisateur.** Pas en termes d'implémentation.
3. **L'explication mène à une action.** Corriger, demander, attendre, contacter.
4. **Le détail dépend du public et de la sécurité.** L'utilisateur voit la cause utile, l'administrateur voit la règle, l'auditeur voit la trace.
5. **Plusieurs causes se présentent par ordre d'actionnabilité.** On évite le « corrige un, trouve un autre ».
6. **Elle s'étend aux décisions automatiques.** Règles, routage, approbations requises.
7. **Les raisons sont un contrat.** Leurs codes sont stables et testés.

#### Vocabulaire essentiel

- **Raison** (*reason*) : cause identifiée d'une décision ou d'un refus, avec un code et des paramètres.
- **Trace de décision** (*decision trace*) : enregistrement des conditions évaluées et de leur résultat.
- **Garde** (*guard*) : condition d'une transition (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).
- **Politique** (*policy*) : règle d'autorisation (voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)).
- **Explication contrastive** (*why-not explanation*) : réponse à « pourquoi pas ? », qui indique ce qui manque pour que l'action soit possible.
- **Cause actionnable** : cause que la personne peut lever.
- **Mode explication** (*explain mode*) : évaluation qui collecte toutes les conditions au lieu de s'arrêter à la première.

#### Relations de cause à effet

- Un refus est renvoyé sans raison. Les utilisateurs ouvrent des tickets ou contournent la règle.
- La raison est un code technique. L'utilisateur ne comprend pas, et le support doit traduire.
- L'interface fabrique elle-même les messages. Ils divergent du comportement réel du moteur.
- L'explication détaille toute la règle de sécurité. Un attaquant en déduit comment la contourner ou quelles ressources existent.
- Seule la première cause est affichée. L'utilisateur la corrige, puis découvre la suivante.

#### Idées reçues

- **« Expliquer, c'est tout montrer. »** Non. C'est donner la cause utile à la bonne personne. Le reste est du bruit, ou un risque.
- **« L'explicabilité ne concerne que l'intelligence artificielle. »** Elle s'applique d'abord aux règles, droits, états et workflows. Ces mécanismes sont déterministes, donc explicables.
- **« Un message d'erreur suffit. »** Le message dit ce qui s'est passé. L'explication dit pourquoi, et ce qu'il faut changer.

#### Principe clé

Chaque refus ou décision porte une raison structurée, exprimée en langage de la personne, avec une action possible, et calibrée selon le public et la sécurité.

#### Si vous ne retenez que trois choses

1. Le moteur produit des raisons structurées, l'interface les traduit.
2. L'explication nomme la cause actionnable et propose une suite.
3. Le niveau de détail dépend du public, et il ne doit pas révéler d'information sensible.

### 3. Explication technique détaillée

#### Une décision explicable

Au lieu de renvoyer « refusé », le moteur renvoie la décision et ses raisons.

```json
{
  "action": "transition:ground",
  "resource": { "type": "aircraft", "id": "ac_8f3a" },
  "decision": "denied",
  "reasons": [
    {
      "type": "guard",
      "code": "flight_scheduled_within_24h",
      "params": { "flight": "AF-123", "departure": "2026-10-14T06:40:00Z" },
      "message": "Un vol est programmé dans les 24 h.",
      "actionable": true,
      "resolution": { "type": "open_resource", "resource": "flight", "id": "fl_552" }
    },
    {
      "type": "validation",
      "code": "reason_required",
      "params": { "field": "reason" },
      "message": "Un motif est requis pour immobiliser un aéronef.",
      "actionable": true
    }
  ]
}
```

- `type` : la famille de la raison (permission, garde, validation, quota, offre…).
- `code` : un identifiant stable, utilisable par l'interface, les tests et le support.
- `params` : les valeurs qui permettent un message précis.
- `message` : un texte par défaut, localisable.
- `actionable` et `resolution` : ce que la personne peut faire.

#### Les familles de raisons

| Famille | Exemple | Message | Résolution |
|---|---|---|---|
| Permission | Rôle absent | « Réservé aux responsables qualité » | Demander l'accès |
| État ou garde | Vol programmé | « Un vol est programmé dans les 24 h » | Voir le vol, attendre |
| Validation | Champ requis | « Un motif est requis » | Renseigner le champ |
| Quota | Limite atteinte | « Vous avez atteint 50 aéronefs sur votre offre » | Libérer, changer d'offre |
| Offre | Fonction non incluse | « Disponible dans l'offre Entreprise » | Voir les offres |
| Dépendance | Éléments liés | « 2 tâches ouvertes bloquent la remise en service » | Ouvrir les tâches |
| Disponibilité | Maintenance | « Indisponible jusqu'à 18 h UTC » | Réessayer plus tard |

#### Évaluer sans court-circuit

Pour décider, un moteur s'arrête souvent à la première condition fausse : c'est rapide. Pour **expliquer**, il doit évaluer **toutes** les conditions et indiquer lesquelles échouent. On prévoit donc un mode d'évaluation à la demande, déclenché par un clic sur « Pourquoi ? », plutôt qu'à chaque affichage d'une liste.

```text
Garde « Remise en service » : ÉCHEC
  ✔ Le rôle est « Responsable qualité »
  ✔ L'aéronef est « En inspection »
  ✘ Toutes les tâches de maintenance sont clôturées
        → 2 tâches ouvertes : MT-1042, MT-1047
  ✔ Aucune non-conformité critique n'est ouverte
```

Cette présentation en arbre de conditions rend lisible une garde composée (voir [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité) et [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision)).

#### Les niveaux de détail

| Public | Ce qu'il voit | Exemple |
|---|---|---|
| Utilisateur final | La cause actionnable, en mots simples | « 2 tâches doivent d'abord être clôturées » |
| Administrateur du tenant | La règle et le lien vers sa configuration | « Règle R-07 « Remise en service » ; [Modifier la règle] » |
| Support et audit | La trace complète : règles, versions, valeurs | « R-07 v3 évaluée le 2026-10-13 08:42 : tâches ouvertes = 2 » |
| Public non autorisé | Rien qui révèle l'existence ou le détail | « Vous n'avez pas accès à cet élément » |

#### Expliquer les décisions automatiques

L'explicabilité ne se limite pas aux refus. Elle répond aussi à des questions comme :

- « Pourquoi cette demande m'est-elle attribuée ? » : « Règle de routage R-12 : gravité = critique, donc approbation par le responsable qualité » (voir [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).
- « Pourquoi ce champ est-il obligatoire ? » : « Obligatoire quand le type est « Usure » » (voir [12.5 Formulaires et assistants](#125-formulaires-et-assistants)).
- « Pourquoi ne vois-je pas ce constat ? » : « Votre rôle ne couvre pas la base de Paris » (en respectant la sécurité).
- « Pourquoi cette notification ? » : « Vous êtes responsable de la base de Lyon » (voir [12.10 Notifications](#1210-notifications)).

#### Sécurité

L'explication peut aider un attaquant. Quelques précautions :

- **ne pas révéler l'existence** d'un élément interdit : même message que pour un élément absent (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)) ;
- **ne pas détailler** les règles de sécurité à un public qui n'a pas à les connaître ;
- **limiter le débit** des demandes « pourquoi ? », pour éviter qu'elles servent à sonder le système ;
- **journaliser** ces demandes quand elles portent sur des éléments sensibles (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

#### La qualité des messages

- **Un modèle de message par code**, avec des paramètres, localisable.
- **Le vocabulaire du métier**, pas celui du moteur (voir [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).
- **Une seule action principale** quand plusieurs causes existent : on met en avant la plus actionnable.
- **Des codes stables**, versionnés comme une API (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

#### Les modes de défaillance

- **Un refus muet** : bouton grisé, sans raison.
- **Un code brut** affiché à l'utilisateur.
- **Des messages fabriqués dans l'interface**, qui divergent du moteur.
- **Une explication complète** à un public qui ne doit pas la voir.
- **Une explication périmée** : l'état a changé depuis l'évaluation.
- **Un coût caché** : l'évaluation sans court-circuit exécutée à chaque ligne d'une grande liste.

**Contre-exemple.** Le bouton « Remettre en service » est grisé, avec une info-bulle « Action non disponible ». Le responsable qualité ne sait pas si c'est un problème de droit, de tâches ouvertes ou d'une panne. Il appelle le support, qui consulte les journaux et répond une heure plus tard : deux tâches ouvertes.

**Limites.** L'explication est une photographie au moment de l'évaluation : elle peut devenir fausse. Les règles très composées produisent des explications longues qu'il faut synthétiser. L'explicabilité a un coût d'ingénierie : les raisons doivent être prévues dès la conception du moteur, il est difficile de les ajouter après coup.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états), [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique), [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | Gardes, règles, conditions et moteur de règles produisent les raisons |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) et [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les politiques et permissions fines produisent les raisons de refus |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | Le format d'erreur normalisé transporte les raisons et protège l'existence |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | La trace de décision et le journal d'audit permettent l'analyse après coup |
| [12.5 Formulaires et assistants](#125-formulaires-et-assistants) et [12.8 Actions en masse](#128-actions-en-masse) | Formulaires et actions en masse affichent les raisons par champ ou par élément |
| [12.11 États vides et états d'erreur](#1211-états-vides-et-états-derreur) | Les états d'erreur et « non autorisé » s'appuient sur les raisons |
| [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles) | Les capacités du serveur incluent la raison de l'indisponibilité |
| [12.15 Conscience de l'impact](#1215-conscience-de-limpact) | L'impact répond à « qu'est-ce que ça change ? », l'explicabilité à « pourquoi ? » |

### 5. Application pratique

**Situation initiale.** Le responsable qualité ne peut pas « Remettre en service » un aéronef. L'interface affiche « Action non autorisée ». Le support reçoit cinq tickets par semaine pour ce cas, et chaque résolution demande l'examen des journaux.

**Problème.** Le moteur dispose des informations (les gardes sont évaluées) mais ne les expose pas.

**Application du concept.** Des raisons structurées et un mode explication.

**Déroulé.**

1. Le moteur renvoie, pour chaque transition indisponible, la liste des raisons avec un code, des paramètres et une résolution.
2. L'interface affiche la raison près du bouton, et un lien « Pourquoi ? » ouvre l'arbre des conditions.
3. La condition « Toutes les tâches de maintenance sont clôturées » affiche les identifiants des deux tâches ouvertes, avec un lien direct.
4. L'administrateur du tenant voit en plus la règle R-07 et un lien vers sa configuration.
5. Pour un utilisateur sans droit de voir l'aéronef, le message reste « Vous n'avez pas accès à cet élément ».
6. Les demandes « Pourquoi ? » sont limitées en débit et tracées pour les éléments sensibles.

**Résultat.** Les tickets sur ce cas disparaissent, car la cause et l'action sont visibles. Les administrateurs repèrent aussi des règles trop strictes grâce aux explications fréquentes.

**Limites.** Pour des règles composées de dizaines de conditions, l'arbre devient long : l'équipe affiche d'abord les conditions en échec, et replie les autres.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une raison structurée, et que contient-elle ?
2. **Compréhension.** Pourquoi le moteur doit-il évaluer sans court-circuit pour expliquer ?
3. **Compréhension.** Comment adapte-t-on l'explication au public ?
4. **Pourquoi.** Pourquoi l'explicabilité peut-elle être un risque de sécurité ?
5. **Raisonnement pratique.** Un bouton est grisé pour un utilisateur, et la raison est « rôle absent ». Comment l'interface choisit-elle de l'afficher ou non ?

#### Réponses

1. C'est la cause d'une décision, produite par le moteur : un type, un code stable, des paramètres, un message localisable, et si possible une action de résolution. Elle permet à l'interface et au support de s'appuyer sur la même information.
2. Parce que l'évaluation de décision s'arrête à la première condition fausse. Pour expliquer, il faut connaître toutes les conditions en échec, afin de ne pas faire corriger les causes une à une.
3. En définissant des niveaux : l'utilisateur voit la cause actionnable en mots simples, l'administrateur la règle et son lien, le support la trace complète. Un public non autorisé ne voit rien qui révèle l'existence ou le détail.
4. Parce qu'une explication détaillée peut révéler l'existence d'éléments interdits ou la logique des règles de sécurité, et servir à sonder le système. On limite le détail, on limite le débit des demandes et on journalise les cas sensibles.
5. Elle regarde si la personne peut obtenir le droit et si l'existence de la fonction n'est pas sensible. Si oui, elle montre le bouton désactivé avec « Réservé au rôle X » et un chemin de demande d'accès. Sinon, elle masque le bouton (voir [12.12 Interface sensible aux permissions et aux rôles](#1212-interface-sensible-aux-permissions-et-aux-rôles)).

## 12.15 Conscience de l'impact

### 1. Comprendre simplement

La **conscience de l'impact** (*impact awareness*) est la capacité de l'interface à **montrer, avant qu'on agisse, ce qu'un changement va affecter**. Le plan la pose ainsi : *si je change cette règle, qu'est-ce que cela va affecter ?*

**Pourquoi cela existe.** Dans un système déclaratif, tout est relié. Un champ est utilisé par des vues, des règles, des workflows, des intégrations et des rapports. Un administrateur ne peut pas garder ce graphe en tête. Un changement local peut avoir des effets lointains. Sans visibilité, on découvre les dégâts après coup, souvent par un utilisateur.

**Problème résolu.** Rendre visibles les dépendances et les effets d'un changement avant sa publication, pour décider en connaissance de cause.

**Modèle mental.** Un plan de chantier. Avant de percer un mur, on regarde ce qui passe derrière : tuyaux, câbles, gaines. On ne perce pas au hasard.

**Où l'analogie s'arrête.** Le plan d'un bâtiment est un document fixe, à jour par construction. Le graphe de dépendances d'une plateforme évolue en permanence, et certaines dépendances (expressions libres, systèmes externes) n'y figurent pas toujours.

**Exemple.** Un administrateur veut supprimer le champ « Date d'inspection ». L'écran d'impact indique : utilisé par 3 vues, 2 règles, 1 workflow, 2 widgets de tableau de bord, 1 webhook ; 1 240 enregistrements contiennent une valeur. Il choisit plutôt de le marquer **obsolète**.

**Les composants.**

1. un **graphe de dépendances** ;
2. l'analyse **« utilisé par »** ;
3. la **simulation** sur des données réelles ou historiques ;
4. la **différence** (diff) entre l'ancienne et la nouvelle configuration ;
5. l'**étendue** : configuration, données, personnes ;
6. la **classification** : compatible, à risque, cassant ;
7. la **communication** : qui prévenir.

**Objectif d'apprentissage :** vous pouvez décrire comment un graphe de dépendances est construit, distinguer simulation et analyse « utilisé par », et classer un changement selon son risque.

### 2. Connaissances essentielles

#### Définition

**Conscience de l'impact** : propriété d'une interface qui fait connaître à la personne, avant publication, les éléments, les données et les personnes qu'un changement de configuration affectera, ainsi que la nature de cet effet.

#### Idées fondamentales

1. **Tout changement a une étendue.** Sur quoi porte-t-il, sur combien d'éléments, pour quelles personnes ?
2. **Les dépendances sont déclarées, donc calculables.** Elles sont extraites des définitions, pas devinées.
3. **On montre avant d'appliquer.** Analyse d'impact, aperçu, simulation.
4. **On distingue compatible et cassant.** Les changements ne méritent pas tous la même attention.
5. **L'étendue a trois dimensions.** La configuration (ce qui dépend), les données (combien d'enregistrements), les personnes (qui est touché).
6. **On vérifie aussi après.** Surveillance renforcée, comparaison avant et après, retour arrière.
7. **On dit ce que l'on ne sait pas.** Certaines dépendances, comme les systèmes externes, restent invisibles.

#### Vocabulaire essentiel

- **Graphe de dépendances** (*dependency graph*) : représentation des éléments et des liens « utilise ».
- **Utilisé par** (*where-used*) : liste des éléments qui référencent un élément donné.
- **Analyse d'impact** (*impact analysis*) : évaluation des conséquences d'un changement.
- **Rayon d'action** (*blast radius*) : étendue des effets d'un changement ou d'une panne.
- **Changement cassant** (*breaking change*) : changement qui rend incompatible ce qui existait.
- **Simulation** (*dry run*) : exécution à blanc, sans effet réel.
- **Dépréciation** (*deprecation*) : marquage d'un élément comme destiné à disparaître.
- **Dépendance transitive** : dépendance indirecte, par un élément intermédiaire.

#### Relations de cause à effet

- Il n'y a pas de graphe de dépendances. La suppression d'un champ casse silencieusement une règle, et l'on s'en aperçoit en production.
- Les expressions sont stockées comme du texte opaque. Le système ne sait pas quels champs elles utilisent, donc il ne peut pas les lister.
- Il n'y a pas de simulation. L'effet réel est découvert par les utilisateurs.
- Tous les changements sont traités pareillement. Les alertes se banalisent, ou à l'inverse, tout est bloqué.

#### Idées reçues

- **« Les tests couvrent l'impact. »** Les tests du produit couvrent le code de l'éditeur. Ils ne couvrent pas la configuration propre à chaque tenant.
- **« Une confirmation suffit. »** Sans information sur ce qui sera touché, la confirmation n'est pas éclairée.
- **« Le retour arrière remplace l'analyse. »** Certains effets ne se défont pas : notifications envoyées, appels à des systèmes externes, données déjà transformées.

#### Principe clé

Avant de publier, on sait ce qui dépend de l'élément modifié, ce que le changement fera sur des données réelles, et quelles personnes seront touchées.

#### Si vous ne retenez que trois choses

1. Les dépendances sont extraites des définitions déclaratives pour construire un graphe « utilisé par ».
2. La simulation montre l'effet réel d'un changement sur des données, sans l'appliquer.
3. On classe les changements, et l'on signale ce qui reste invisible, comme les systèmes externes.

### 3. Explication technique détaillée

#### Le graphe des références

Les éléments de configuration (types, champs, vues, règles, workflows, rôles, intégrations, tableaux de bord) sont des nœuds. Une référence est une arête « utilise ». Le graphe est construit automatiquement à partir des métadonnées.

```text
champ « aircraft.next_inspection_date »
 ├─ vues             : « Inspections en retard », « À inspecter à Lyon », « Flotte »
 ├─ règles           : R-07 (garde « Remise en service »), R-12 (alerte d'échéance)
 ├─ workflows        : « Maintenance aéronef » (transition Immobiliser)
 ├─ tableaux de bord : « Santé de la flotte » (2 widgets)
 ├─ intégrations     : webhook « système-qualité » (champ exporté)
 └─ données          : 1 240 enregistrements avec une valeur
```

**Pourquoi les expressions doivent être analysées.** Une règle écrite comme une chaîne de caractères opaque (`"flight.start < now() + 24h"`) cache ses dépendances. En l'analysant syntaxiquement, le moteur extrait les champs et les fonctions utilisés (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)) et alimente le graphe. Une expression stockée sous forme d'arbre structuré, comme celle des règles du module 6, rend cette extraction fiable.

#### L'impact selon le type de changement

| Changement | Étendue habituelle | Risque |
|---|---|---|
| Modifier un libellé | Affichage seulement | Faible |
| Ajouter un champ facultatif | Formulaires, vues | Faible |
| Rendre un champ obligatoire | Saisies futures, enregistrements existants, imports | Moyen à élevé |
| Changer le type d'un champ | Données, règles, vues, intégrations | Élevé |
| Supprimer un champ ou un état | Tout ce qui le référence, données | Cassant |
| Modifier une garde | Comportement des transitions, flux de travail | Moyen à élevé |
| Modifier un rôle ou une politique | Droits de toutes les personnes concernées | Élevé |

Ces catégories rejoignent l'évolution de schéma (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)) et le versionnement de configuration (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

#### La simulation

La simulation exécute la nouvelle configuration **sans effet réel** :

- sur les **données actuelles** : « avec la nouvelle garde, 14 des 52 aéronefs ne pourraient plus être immobilisés » ;
- sur des **événements passés**, rejoués (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)) : « sur les 30 derniers jours, 3 transitions auraient été refusées » ;
- avec les **effets de bord désactivés** : pas de notifications, pas d'appels sortants.

#### La différence et la classification

L'interface montre la différence entre la version publiée et le brouillon, dans un langage lisible, et classe le changement :

| Classe | Définition | Traitement |
|---|---|---|
| Compatible | N'affecte aucun élément existant | Publication directe possible |
| À risque | Affecte des éléments ou des personnes, sans rupture | Aperçu et revue recommandés |
| Cassant | Rend invalide un élément existant ou en change le sens | Revue obligatoire, plan de migration, annonce |

#### Un panneau « Avant de publier »

```text
Avant de publier : suppression du champ « Date d'inspection »     CLASSE : CASSANT

Ce qui change     Le champ disparaît des formulaires et des vues.
Ce qui dépend     3 vues · 2 règles · 1 workflow · 2 widgets · 1 webhook
Données           1 240 enregistrements contiennent une valeur (conservée en archive 90 jours)
Personnes         14 planificateurs, 6 responsables qualité
Non vérifiable    Systèmes externes qui consomment le webhook « système-qualité »

[ Voir le détail ]  [ Marquer obsolète au lieu de supprimer ]  [ Simuler ]  [ Demander une revue ]
```

La dernière ligne signale ce que le système ne peut pas vérifier : il est honnête sur ses limites.

#### L'étendue pour les changements de plateforme

Quand l'éditeur change un modèle fourni à tous (une nouvelle version d'un type standard), l'étendue est celle de la **flotte de tenants**. L'analyse d'impact porte alors sur les configurations clientes : combien de tenants ont personnalisé ce type, utilisent le champ modifié, ont une règle qui en dépend. Un déploiement progressif (voir [12.16 Configuration sûre](#1216-configuration-sûre)) limite le risque.

#### Après le changement

- **Surveillance renforcée** pendant une période : taux d'erreurs, échecs de transition, plaintes (voir [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)).
- **Comparaison avant et après** sur les indicateurs concernés.
- **Retour arrière** disponible (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)), en gardant à l'esprit que les effets externes ne se défont pas.
- **Dépréciation** plutôt que suppression : l'élément est marqué obsolète, signalé là où il est utilisé, et retiré après un délai.

#### Les dépendances invisibles

Certaines dépendances échappent au graphe :

- les **systèmes externes** qui consomment une API ou un webhook (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) ;
- les **extensions** qui lisent des champs (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) ;
- les **exports et scripts** de l'utilisateur ;
- les **personnes** qui s'appuient sur une habitude.

On le dit explicitement dans l'analyse, et on utilise des fenêtres de dépréciation, des versions d'API et des annonces.

#### Les modes de défaillance

- **Un graphe incomplet** : les références ne sont pas toutes extraites.
- **Des dépendances opaques** : expressions libres, scripts.
- **Une simulation sans données représentatives.**
- **Une classification uniforme** : tout est « à risque », donc plus rien ne l'est.
- **Un impact non communiqué** : les personnes touchées apprennent le changement après coup.
- **Un retour arrière illusoire**, alors que les effets externes sont irréversibles.

**Contre-exemple.** Un administrateur supprime un champ qu'il croit inutilisé. L'écran ne lui montre que les vues. Une règle de notification, écrite sous forme de texte libre, l'utilisait. Le lendemain, plus aucune alerte d'échéance n'est envoyée, et personne ne s'en aperçoit avant un retard d'inspection.

**Limites.** Le graphe n'est aussi bon que les références déclarées. L'impact **métier** (une règle qui change le sens d'un processus) n'est pas calculable : il demande une revue humaine. Une simulation sur le passé ne prédit pas le futur : elle montre ce qui se serait passé, pas ce qui se passera.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | L'évolution de schéma est la source de nombreux changements cassants |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Versionnement, retour arrière et revue encadrent la publication |
| [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | L'analyse des expressions et des règles alimente le graphe |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) | Le rejeu d'événements permet la simulation historique |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API gère les dépendances externes |
| [12.3 UX d'administration](#123-ux-dadministration) | L'UX d'administration expose le panneau d'impact |
| [12.14 Explicabilité](#1214-explicabilité) | L'explicabilité répond à « pourquoi », l'impact à « qu'est-ce que cela change » |
| [12.16 Configuration sûre](#1216-configuration-sûre) | La configuration sûre systématise validation, simulation et publication progressive |

### 5. Application pratique

**Situation initiale.** Un administrateur du tenant veut supprimer le champ « Date d'inspection » après une refonte de son processus. Il croit qu'il n'est plus utilisé. Aucun écran ne lui indique ce qui en dépend.

**Problème.** Une suppression sans analyse risque de casser des règles, des vues et une intégration.

**Application du concept.** L'analyse d'impact et la dépréciation.

**Déroulé.**

1. L'administrateur choisit « Supprimer le champ ». La plateforme calcule le graphe et affiche « Utilisé par : 3 vues, 2 règles, 1 workflow, 2 widgets, 1 webhook ».
2. Le changement est classé **cassant**.
3. L'administrateur lance la **simulation** : avec le champ supprimé, la règle R-07 ne peut plus être évaluée et 100 % des remises en service seraient refusées.
4. Il choisit **« Marquer obsolète »** : le champ est masqué des formulaires, reste lisible dans les règles et les exports, et un avertissement apparaît dans les 5 éléments qui l'utilisent.
5. Il corrige la règle R-07 et le workflow, simule à nouveau, puis demande une revue (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).
6. Après 90 jours sans usage, le champ est supprimé, avec archivage des valeurs.

**Résultat.** Aucune interruption de service. L'administrateur a évité une suppression qui aurait bloqué toutes les remises en service.

**Limites.** Le webhook consommé par le système externe n'a pas pu être vérifié : le responsable de l'intégration a été prévenu séparément, et une période de dépréciation a été annoncée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifie « utilisé par », et comment la liste est-elle produite ?
2. **Compréhension.** Quelle différence y a-t-il entre analyse d'impact et simulation ?
3. **Compréhension.** Comment classe-t-on un changement, et pourquoi ?
4. **Pourquoi.** Pourquoi les expressions de règles doivent-elles être structurées plutôt que stockées comme du texte libre ?
5. **Raisonnement pratique.** Vous voulez rendre obligatoire un champ qui est vide dans 30 % des enregistrements. Quelles questions d'impact posez-vous ?

#### Réponses

1. C'est la liste des éléments (vues, règles, workflows, intégrations…) qui référencent un élément donné. Elle est produite en extrayant les références des définitions déclaratives, y compris des expressions analysées.
2. L'analyse d'impact liste ce qui dépend de l'élément modifié (statique). La simulation exécute la nouvelle configuration sur des données réelles ou historiques pour montrer l'effet réel (dynamique), sans effet de bord.
3. Selon l'effet : compatible (aucun élément existant touché), à risque (éléments touchés, sans rupture) ou cassant (éléments invalidés). La classification règle le niveau de contrôle : revue, plan de migration, annonce.
4. Parce qu'une expression structurée peut être analysée pour en extraire les champs et fonctions utilisés. Du texte libre cache ses dépendances, et le graphe est alors incomplet.
5. Que faire des 30 % d'enregistrements existants vides (blocage de leur modification, migration, valeur par défaut) ; quels imports et intégrations n'envoient pas ce champ ; quelles vues et règles en dépendent ; combien de personnes seront bloquées lors de la saisie ; comment simuler et annoncer le changement.

## 12.16 Configuration sûre

### 1. Comprendre simplement

La **configuration sûre** (*safe configuration*) est l'ensemble des **mécanismes qui rendent difficile de casser le système par la configuration** : validations, valeurs par défaut sûres, aperçus, limites, brouillons, revues, bacs à sable, retour arrière. Le plan la pose ainsi : *comment empêcher l'administrateur de casser le système ?*

**Pourquoi cela existe.** La configurabilité donne du pouvoir, et le pouvoir sans garde-fou casse : un workflow qui boucle, une règle qui bloque tout le monde, un rôle qui donne trop de droits, un champ obligatoire qui interdit la saisie. Les administrateurs ne sont pas négligents. Ils manquent d'information et d'outils. La plateforme doit être conçue pour que **la bonne action soit facile et la mauvaise difficile**.

**Problème résolu.** Permettre une grande liberté de configuration sans que chaque erreur devienne un incident.

**Modèle mental.** L'installation électrique d'une maison. Le disjoncteur coupe en cas de surcharge. La prise de terre protège des fuites. Les câbles et les prises sont normalisés. On peut bricoler librement, car le système est conçu pour que l'erreur ne mette pas le feu.

**Où l'analogie s'arrête.** Un disjoncteur coupe de façon binaire. La configuration sûre est graduée : elle prévient, avertit, limite, demande une revue ou bloque, selon le risque.

**Exemple.** Un administrateur publie une règle qui interdit de clore un constat tant qu'un champ « Référence externe » n'est pas renseigné. La validation détecte que ce champ n'est jamais rempli dans les données existantes. Elle signale : « Cette règle bloquerait 100 % des clôtures ». La publication est refusée tant que l'avertissement n'est pas traité.

**Les composants.**

1. la **prévention** : types, valeurs par défaut sûres, limites ;
2. la **détection** : validation, simulation ;
3. le **contrôle** : permissions, revue, séparation des pouvoirs ;
4. l'**isolation** : brouillon, bac à sable, déploiement progressif ;
5. la **récupération** : versions, retour arrière, interrupteur d'urgence ;
6. la **traçabilité** : qui a changé quoi, quand, pourquoi.

**Objectif d'apprentissage :** vous pouvez décrire les couches de défense de la configuration, choisir des valeurs par défaut sûres, et expliquer pourquoi certains invariants ne sont pas configurables.

### 2. Connaissances essentielles

#### Définition

**Configuration sûre** : ensemble de principes et de mécanismes qui permettent à des administrateurs de modifier le comportement d'un système sans pouvoir, par erreur ou par méconnaissance, le mettre en défaut ou violer ses garanties essentielles.

#### Idées fondamentales

1. **La bonne action est facile, la mauvaise est difficile.** C'est le principe du *poka-yoke*, terme issu de la production industrielle : concevoir pour que l'erreur soit improbable ou visible.
2. **On valide avant d'appliquer.** Syntaxe, références, cohérence, invariants.
3. **On simule avant de publier.** Voir l'effet sur des données réelles (voir [12.15 Conscience de l'impact](#1215-conscience-de-limpact)).
4. **On isole.** Brouillon, bac à sable, déploiement progressif : l'erreur reste confinée.
5. **On limite.** Des plafonds de complexité et un budget d'exécution empêchent l'emballement.
6. **On peut revenir en arrière.** Les versions et le retour arrière enlèvent la peur de configurer.
7. **On sépare les pouvoirs et on protège les invariants.** Qui configure, qui relit, qui publie ; et certaines garanties de la plateforme ne sont pas configurables.

#### Vocabulaire essentiel

- **Garde-fou** (*guardrail*) : mécanisme qui limite les conséquences d'une erreur sans empêcher l'usage.
- **Valeur par défaut sûre** (*safe default*) : valeur initiale qui minimise le risque (droits minimaux, option désactivée).
- **Invariant** : propriété qui doit toujours rester vraie, quelle que soit la configuration (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).
- **Bac à sable** (*sandbox*) : environnement isolé où l'on essaie sans effet sur la production.
- **Déploiement progressif** (*progressive rollout*) : exposition graduelle d'un changement à une part croissante du trafic ou des tenants.
- **Budget d'exécution** (*execution budget*) : plafond de temps, d'étapes ou de ressources pour une règle ou un workflow.
- **Interrupteur d'urgence** (*kill switch*) : moyen de désactiver rapidement une règle, une fonction ou une intégration.
- **Échec fermé** (*fail closed*) : en cas de doute ou d'erreur, on refuse.

#### Relations de cause à effet

- La configuration est appliquée sans validation. Une règle invalide ou incohérente atteint la production.
- Il n'y a pas de bac à sable. Les administrateurs testent en production, ou n'osent pas tester.
- Il n'y a pas de plafond de complexité. Une règle qui s'appelle elle-même, ou un workflow qui boucle, sature le système.
- Les droits de configuration sont trop larges. Une erreur individuelle touche toute la plateforme.
- Il n'existe pas de retour arrière. Les administrateurs ont peur de modifier, et la configurabilité n'est plus utilisée.

#### Idées reçues

- **« Il suffit de former les administrateurs. »** La sûreté ne doit pas dépendre de la vigilance de chacun. Les experts se trompent aussi.
- **« Plus de confirmations, plus de sûreté. »** Les confirmations systématiques sont ignorées. On réserve la friction au risque réel.
- **« On peut tout valider automatiquement. »** Les erreurs de syntaxe et de cohérence, oui. Le sens métier d'une règle demande une revue humaine.

#### Principe clé

Chaque changement de configuration passe par des défenses en couches (valider, simuler, relire, isoler, publier progressivement, surveiller, annuler), et certaines garanties de la plateforme ne sont jamais configurables.

#### Si vous ne retenez que trois choses

1. La sûreté vient de couches de défense, pas de la vigilance de chacun.
2. On valide, on simule, on isole puis on publie progressivement, avec un retour arrière.
3. Les invariants de la plateforme (isolation, audit, sécurité minimale) échappent à la configuration.

### 3. Explication technique détaillée

#### Les couches de défense

| Couche | Mécanismes | Exemple |
|---|---|---|
| Prévention | Types, valeurs par défaut sûres, limites, choix guidés | Nouveau rôle sans aucun droit ; liste fermée plutôt que texte libre |
| Détection | Validation, simulation, analyse d'impact | « Cette règle bloquerait 100 % des clôtures » |
| Contrôle | Permissions, revue, séparation des pouvoirs | L'auteur ne publie pas seul un changement sensible |
| Isolation | Brouillon, bac à sable, déploiement progressif | Publication à 5 % des utilisateurs, puis 100 % |
| Récupération | Versions, retour arrière, interrupteur d'urgence | Retour à la version précédente en un clic |
| Traçabilité | Journal d'audit, historique, motif | « Modifié par X le 2026-10-13, motif : refonte » |

#### La validation à l'enregistrement

| Niveau | Question | Exemple |
|---|---|---|
| Syntaxique | La définition est-elle bien formée ? | Expression valide |
| Référentiel | Les références existent-elles ? | Le champ cité existe, le rôle existe |
| Sémantique | La définition est-elle cohérente ? | Chaque état est atteignable, chaque transition a un rôle, pas de cycle sans sortie |
| De santé | L'effet attendu est-il plausible ? | Une règle ne s'applique ni à 0 % ni à 100 % des cas |

```json
{
  "validation": {
    "status": "failed",
    "findings": [
      { "level": "error", "code": "unreachable_state",
        "message": "L'état « Reporté » ne peut être atteint par aucune transition.",
        "path": "states.postponed" },
      { "level": "error", "code": "transition_without_role",
        "message": "La transition « Clore » n'a aucun rôle autorisé.",
        "path": "transitions.close" },
      { "level": "warning", "code": "rule_matches_all",
        "message": "La règle R-21 s'applique à 100 % des constats existants.",
        "path": "rules.R-21" }
    ]
  }
}
```

Une **erreur** bloque la publication. Un **avertissement** exige une confirmation explicite, avec motif. Les chemins permettent à l'interface de désigner l'endroit fautif (voir [12.5 Formulaires et assistants](#125-formulaires-et-assistants)).

#### Les limites de complexité

| Limite | Exemple de plafond | Ce qu'elle évite |
|---|---|---|
| Profondeur d'une expression | 10 niveaux | Règles illisibles et coûteuses |
| Nombre d'étapes d'un workflow | 200 | Processus ingérables |
| Boucles | Interdites ou bornées par un nombre d'itérations | Boucle infinie |
| Budget d'exécution d'une règle | 50 ms ou 1 000 opérations | Règle qui monopolise les ressources |
| Règles par type d'objet | 100 | Évaluations qui ralentissent chaque écriture |

Le **budget d'exécution** garantit qu'une configuration terminera : si une règle le dépasse, son évaluation est interrompue et ses effets sont refusés (**échec fermé**), l'incident est signalé, et le reste du système n'est pas touché.

#### Des valeurs par défaut sûres

| Objet | Valeur par défaut | Raison |
|---|---|---|
| Nouveau rôle | Aucun droit | Le moindre privilège (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) |
| Nouvelle intégration | Lecture seule | Limiter l'écriture à ce qui est validé |
| Nouveau webhook | Désactivé jusqu'au test | Éviter des appels vers un système non prêt |
| Nouveau champ | Facultatif | Ne pas bloquer la saisie existante |
| Nouvelle règle | Mode simulation | Observer avant d'appliquer |
| Accès incertain | Refusé | Échec fermé pour la sécurité |

Le principe est asymétrique : **échec fermé** pour l'accès et la sécurité, **dégradation maîtrisée** pour la disponibilité (voir [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)).

#### L'isolation

- **Environnements** : bac à sable, préproduction, production (voir [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement)). La configuration est une donnée exportable, que l'on promeut d'un environnement à l'autre.
- **Déploiement progressif** : un changement de configuration est activé pour une fraction des utilisateurs ou des tenants, avec des drapeaux (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)), puis élargi.
- **Mode simulation** : une règle évalue et journalise ce qu'elle ferait, sans appliquer.

#### Les garanties non configurables

Certaines propriétés appartiennent à la plateforme, pas au tenant :

- l'**isolation des tenants** (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) ;
- le **journal d'audit** des changements de configuration (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) ;
- les **exigences minimales de sécurité** (chiffrement, authentification forte pour les administrateurs, voir [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)) ;
- l'**intégrité de l'historique**.

Une configuration de tenant ne peut pas les affaiblir. Les politiques impératives de la plateforme l'emportent sur celles du tenant (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).

#### La friction proportionnée

| Risque | Friction |
|---|---|
| Faible, réversible | Aucune ; annulation possible |
| Moyen | Confirmation avec l'étendue (voir [12.15 Conscience de l'impact](#1215-conscience-de-limpact)) |
| Élevé | Revue par une deuxième personne (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) |
| Irréversible | Saisie explicite, délai de réflexion, suppression différée |

Pour une suppression destructrice, on préfère un **délai** : l'élément est marqué, caché, puis supprimé après une période, ce qui laisse le temps de se raviser.

#### Le parcours de publication

```text
brouillon ─► validation ─► simulation ─► revue (si requise) ─► publication progressive
    ▲                                                                   │
    └────── retour arrière ◄── interrupteur d'urgence ◄── surveillance ◄┘
```

Chaque étape est automatisée quand c'est possible, et visible de l'administrateur (voir [12.3 UX d'administration](#123-ux-dadministration)).

#### Mesurer la sûreté

| Mesure | Ce qu'elle indique |
|---|---|
| Incidents causés par la configuration | La sûreté réelle |
| Part des changements validés et simulés avant publication | L'adoption du parcours |
| Taux et délai de retour arrière | La capacité de récupération |
| Avertissements ignorés | La qualité des alertes (trop de bruit ?) |

#### Les modes de défaillance

- **La validation superficielle** : seule la syntaxe est vérifiée.
- **Des garde-fous trop stricts** : les administrateurs contournent (tableurs, comptes partagés).
- **Aucune échappatoire contrôlée** : en cas d'urgence, personne ne peut agir.
- **Des avertissements innombrables** : ils sont ignorés.
- **Un bac à sable différent de la production** : les essais ne prouvent rien.
- **Des droits de publication trop larges.**

**Contre-exemple.** Un administrateur publie une règle de validation qui rejette toute valeur contenant une apostrophe, pour protéger un champ. L'éditeur n'impose ni validation sémantique, ni simulation, ni revue. Les noms de pièces comme « Joint d'étanchéité » sont refusés à la saisie. La règle reste en production pendant deux jours, jusqu'à ce que les techniciens alertent le support.

**Limites.** La sûreté absolue est impossible : une règle correcte peut être mauvaise pour le métier. Trop de garde-fous poussent les utilisateurs vers des contournements. Il faut des échappatoires contrôlées (un accès d'urgence tracé et limité dans le temps) et accepter qu'une part du risque reste humaine : la revue métier ne s'automatise pas.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.3 UX d'administration](#123-ux-dadministration) | L'UX d'administration met en scène le parcours brouillon, validation, publication |
| [12.4 Divulgation progressive et configuration contextuelle](#124-divulgation-progressive-et-configuration-contextuelle) | Les valeurs par défaut sûres complètent la divulgation progressive |
| [12.14 Explicabilité](#1214-explicabilité) | L'explicabilité justifie les refus de publication |
| [12.15 Conscience de l'impact](#1215-conscience-de-limpact) | La conscience de l'impact alimente validation et simulation |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants définissent ce qui ne doit jamais être rompu |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Le moindre privilège et la séparation des tâches encadrent qui configure et qui publie |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) et [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | Drapeaux et environnements permettent l'isolation |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Versionnement, retour arrière et revue sont les mécanismes de récupération et de contrôle |

### 5. Application pratique

**Situation initiale.** Un administrateur du tenant publie une règle sur le workflow des constats : « Un constat ne peut être clos que si le champ *Référence externe* est renseigné ». Ce champ n'est presque jamais rempli. En quelques minutes, plus aucun constat ne peut être clos. Un incident est ouvert, et l'équipe passe une heure à trouver l'origine.

**Problème.** La plateforme a laissé publier une configuration qui rend le système inutilisable, sans avertir ni permettre un retour rapide.

**Application du concept.** Un parcours de publication sûr.

**Déroulé.**

1. **Validation.** La règle est syntaxiquement valide et référence un champ existant. La validation de santé détecte qu'elle s'appliquerait à 100 % des constats existants : avertissement « Cette règle bloquerait 100 % des clôtures ».
2. **Simulation.** L'administrateur lance la simulation sur les constats ouverts : 100 % de refus de clôture. Il voit que le champ est presque toujours vide.
3. **Correction.** Il remplace la condition par « *Référence externe* requise seulement pour la gravité critique ». La simulation indique 4 % de refus.
4. **Revue.** Le workflow étant en production, un responsable qualité relit et approuve (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).
5. **Publication progressive.** La règle est d'abord appliquée à 10 % des utilisateurs (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)), pendant une journée, puis à 100 %.
6. **Surveillance et retour arrière.** Les refus de clôture sont suivis. Un retour arrière est disponible en un clic (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)).

**Résultat.** L'erreur initiale est détectée à l'écran, avant publication, et sans incident. La règle publiée est plus précise et produit le comportement voulu.

**Limites.** La revue ne détecte pas tout : le responsable qualité valide la règle, mais la pertinence de la condition « gravité critique » reste une décision métier. La sûreté réduit le risque, elle ne remplace pas le jugement.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez quatre couches de défense de la configuration et un mécanisme pour chacune.
2. **Compréhension.** Qu'est-ce qu'une valeur par défaut sûre ? Donnez deux exemples.
3. **Compréhension.** Pourquoi certains éléments ne doivent-ils pas être configurables ?
4. **Pourquoi.** Pourquoi un budget d'exécution est-il nécessaire dans un moteur de règles configurable ?
5. **Raisonnement pratique.** Un administrateur doit modifier en urgence une règle en production, un vendredi soir. Comment le parcours de publication garde-t-il la sûreté sans bloquer ?

#### Réponses

1. Prévention (valeurs par défaut sûres, limites), détection (validation, simulation), contrôle (revue, séparation des pouvoirs), isolation (brouillon, bac à sable, déploiement progressif), récupération (retour arrière, interrupteur d'urgence), traçabilité (journal d'audit).
2. C'est la valeur initiale qui minimise le risque. Exemples : un nouveau rôle n'a aucun droit ; un nouveau webhook est désactivé tant qu'il n'a pas été testé ; une nouvelle règle démarre en mode simulation.
3. Parce que les garanties de la plateforme (isolation des tenants, journal d'audit, sécurité minimale) protègent tous les clients. Les laisser configurables permettrait à une erreur ou à un abus d'un tenant de les affaiblir pour tous.
4. Pour garantir la terminaison : une règle écrite par un administrateur peut boucler ou être très coûteuse. Le budget interrompt l'évaluation, refuse ses effets (échec fermé) et protège le reste du système.
5. Un chemin d'urgence encadré : validation et simulation automatiques restent en place, la revue peut être accélérée ou remplacée par une approbation d'astreinte, la publication est tracée avec un motif, le retour arrière reste disponible, et l'accès d'urgence est temporaire et audité.

