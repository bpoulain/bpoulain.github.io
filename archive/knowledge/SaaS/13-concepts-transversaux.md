# Module 13 — Concepts transversaux

> **Question directrice.** Quelles idées traversent tous les modules, et font de l'ensemble un système cohérent plutôt qu'une collection de fonctions ?

## Présentation du module

**Objectif.** Les modules précédents ont présenté les briques une par une : données, CRUD, identité, multi-tenancy, workflows, événements, administration, audit, API, sécurité, UX. Ce module rassemble **sept idées qui traversent toutes ces briques**. Le plan les place après les modules, comme une consolidation : on les comprend mieux une fois que l'on a vu leurs effets partout.

Chacune répond à une question de conception.

| Concept | Question de conception |
|---|---|
| Architecture pilotée par les métadonnées | Comment un même moteur sert-il tous les domaines ? |
| Configuration versus code | Qu'est-ce qui est codé, et qu'est-ce qui est configurable ? |
| Déclaratif versus impératif | Comment l'administrateur exprime-t-il ce qu'il veut ? |
| Plan de contrôle versus runtime | Où l'administrateur agit-il, et sur quoi ? |
| Invariants | Qu'est-ce qui ne doit jamais être faux ? |
| Modélisation temporelle | Que veut dire « à cette date » ? |
| Policy as Code | Comment gère-t-on les règles comme du logiciel ? |

**Prérequis.** Les modules 1 à 12, en particulier l'architecture pilotée par les métadonnées ([2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)), la séparation des plans ([1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)), les règles ([6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique)), le versionnement ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) et la configuration sûre ([12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

**Ordre retenu.** Les quatre premiers concepts décrivent la **forme** de la plateforme. Les trois derniers décrivent les **garanties** qu'elle donne.

```text
Forme       métadonnées ─ configuration vs code ─ déclaratif vs impératif ─ plan de contrôle vs runtime
Garanties   invariants ─ modélisation temporelle ─ Policy as Code
```

Le **Domain-Driven Design**, huitième concept transversal du plan, fait l'objet du module suivant.

Dans chaque entrée, la section « Relations » indique **où le concept apparaît déjà** dans les modules précédents. Les explications de détail ne sont pas répétées : elles sont rappelées et reliées.

## Sommaire du module

- [13.1 Architecture pilotée par les métadonnées, vue transversale](#131-architecture-pilotée-par-les-métadonnées-vue-transversale)
- [13.2 Configuration versus code](#132-configuration-versus-code)
- [13.3 Déclaratif versus impératif](#133-déclaratif-versus-impératif)
- [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime)
- [13.5 Invariants](#135-invariants)
- [13.6 Modélisation temporelle](#136-modélisation-temporelle)
- [13.7 Policy as Code](#137-policy-as-code)

## 13.1 Architecture pilotée par les métadonnées, vue transversale

### 1. Comprendre simplement

Une **architecture pilotée par les métadonnées** (*metadata-driven architecture*) est une architecture où **la structure et le comportement du système sont décrits comme des données**, qu'un moteur générique **interprète**. On ne code pas « Aéronef ». On stocke un modèle « type Aéronef » et le moteur en tire les écrans, l'API, les règles de validation, les droits et les workflows.

**Pourquoi cela existe.** Si chaque nouveau domaine (aviation, santé, industrie) ou chaque nouveau client exige du développement, la plateforme n'est qu'une suite d'applications. Décrire les variations en données permet de servir des domaines différents avec le même moteur.

**Problème résolu.** Passer d'une **application spécifique** à une **plateforme configurable**.

**Modèle mental.** Un lecteur de musique et ses fichiers. Le lecteur est unique et ne connaît aucune chanson. Les fichiers décrivent ce qu'il doit jouer. Ajouter une chanson ne change pas le lecteur.

**Où l'analogie s'arrête.** Un fichier musical est passif : le lecteur ne fait que le décoder. Les métadonnées d'une plateforme contiennent des règles, des droits et des processus, qui ont des conséquences métier. Elles doivent être validées, testées et gouvernées comme du code.

**Exemple.** Un même moteur gère les aéronefs d'une compagnie, les lits d'un hôpital et les machines d'une usine. Seules les définitions de types, de champs, d'états, de rôles et de règles diffèrent.

**Les composants.**

1. un **métamodèle** : ce que l'on peut décrire (types, champs, états, règles) ;
2. des **modèles** : ce que chaque tenant décrit ;
3. des **interpréteurs** : moteurs de données, de workflow, d'autorisation, d'API, d'interface ;
4. un **cycle de vie** des métadonnées : validation, versionnement, publication ;
5. des **garde-fous** pour que le modèle reste sain.

**Objectif d'apprentissage :** vous pouvez décrire l'idée de « un modèle, plusieurs interprètes », distinguer métamodèle et modèle, et citer les coûts de l'approche.

### 2. Connaissances essentielles

#### Définition

**Architecture pilotée par les métadonnées** : architecture où le comportement d'un système est déterminé par des descriptions (types, champs, relations, états, règles, droits, vues) stockées comme des données, interprétées à l'exécution par des moteurs génériques.

#### Idées fondamentales

1. **Un seul modèle, plusieurs interprètes.** La même définition alimente la base, l'API, les validations, les droits, les workflows et l'interface.
2. **Le moteur ne connaît pas le métier.** Il connaît les concepts du métamodèle (type, champ, état), pas « aéronef ».
3. **Les métadonnées sont de vraies données.** Elles sont versionnées, validées, auditées et appartiennent à un tenant.
4. **Le métamodèle est le contrat le plus stable.** Le changer concerne tous les tenants, et il est géré avec le plus grand soin.
5. **Le coût se déplace.** On économise du développement par client, mais on investit dans la qualité du moteur, du métamodèle et des outils.
6. **La limite est l'expressivité.** Tout ne se décrit pas en métadonnées : il faut des points d'extension (voir [13.2 Configuration versus code](#132-configuration-versus-code)).

#### Vocabulaire essentiel

- **Métadonnée** (*metadata*) : donnée qui décrit d'autres données ou un comportement.
- **Métamodèle** (*metamodel*) : modèle qui définit ce que l'on peut décrire dans un modèle.
- **Modèle** : description propre à un tenant (ses types, ses règles).
- **Instance** : donnée métier créée selon un modèle (l'aéronef F-ABCD).
- **Interpréteur** (*interpreter*) : composant qui lit les métadonnées et agit en conséquence.
- **Compilation des métadonnées** : transformation des définitions en structures optimisées pour l'exécution.
- **Effet de plateforme interne** (*inner-platform effect*) : dérive où la configuration reproduit mal un langage de programmation complet.

#### Relations de cause à effet

- Le métier est décrit en métadonnées. Un nouveau domaine se configure sans nouveau code, mais la qualité de la plateforme dépend de celle du moteur.
- Les métadonnées sont interprétées à chaque requête. Le coût de lecture peut dominer, d'où la compilation et la mise en cache.
- Le métamodèle change sans précaution. Les configurations de tous les tenants peuvent se casser.
- On ajoute des options sans limite. La configuration devient un langage de programmation mal conçu, difficile à tester.

#### Idées reçues

- **« C'est sans code. »** Il y a du code : celui du moteur. Et la configuration, qui est du code déguisé, demande du génie logiciel.
- **« Plus c'est configurable, mieux c'est. »** Chaque option coûte en tests, en documentation et en support (voir [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration)).
- **« Interpréter est toujours plus lent que coder. »** La compilation et le cache réduisent l'écart. Les performances dépendent surtout de la conception.

#### Principe clé

Un moteur générique interprète des descriptions versionnées : le métier devient une donnée, et la qualité du moteur et du métamodèle devient l'enjeu central.

#### Si vous ne retenez que trois choses

1. La même définition alimente tous les moteurs : données, API, droits, workflows, interface.
2. On distingue instance, modèle et métamodèle ; le métamodèle est le contrat le plus délicat.
3. L'approche déplace le coût vers le moteur et la gouvernance des métadonnées.

### 3. Explication technique détaillée

#### Un modèle, plusieurs interprètes

```text
┌──────────────────────────────────────────────────────────────┐
│ Métadonnées versionnées du tenant                            │
│ types · champs · relations · états · règles · rôles · vues   │
└──────────────────────────────────────────────────────────────┘
                               │
      ┌──────────┬─────────────┼─────────────┬──────────────┐
      ▼          ▼             ▼             ▼              ▼
   moteur     moteur       moteur        génération     rendu de
  de données  de workflow  d'autorisation  de l'API    l'interface
```

Le même modèle alimente tous les moteurs. Un champ ajouté apparaît à la fois dans le stockage, la validation, l'API, les formulaires et les vues.

#### Ce que produit une définition

| Élément de la définition | Ce que le système en tire |
|---|---|
| Type et champs | Stockage, validation, API de lecture et d'écriture (voir [2.2 Type et schéma](02-donnees-ressources.md#22-type-et-schéma) et [3.1 CRUD, créer, lire, mettre à jour et supprimer](03-crud-runtime-ressources.md#31-crud-créer-lire-mettre-à-jour-et-supprimer)) |
| Relations | Navigation, intégrité référentielle, jointures (voir [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)) |
| États et transitions | Workflow, gardes, historique des changements d'état (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) |
| Règles et politiques | Validation, autorisation, calculs (voir [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) et [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) |
| Rôles et permissions | Contrôle d'accès, interface adaptée (voir [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)) |
| Vues et formulaires | Listes, saisies, tableaux de bord (voir [8.3 Vues et formulaires configurables](08-admin-control-plane.md#83-vues-et-formulaires-configurables) et [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)) |
| Événements | Automatisations, notifications, intégrations (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) |

#### Trois niveaux de modélisation

| Niveau | Contenu | Exemple |
|---|---|---|
| Instance | Les données métier | L'aéronef `F-ABCD`, statut « actif » |
| Modèle | La description propre au tenant | Le type « Aéronef » avec les champs `registration`, `status`, `next_inspection_date` |
| Métamodèle | Ce que la plateforme sait décrire | Les concepts « type », « champ », « état », « règle », « rôle » |

Ces niveaux rappellent ceux que l'on trouve dans les standards de modélisation de l'OMG (de M0 pour les instances à M2 pour le métamodèle). La plateforme maîtrise le métamodèle. Chaque tenant maîtrise son modèle. Les utilisateurs produisent les instances.

#### Compiler les métadonnées

Interpréter une définition à chaque requête serait trop coûteux. La plateforme **compile** donc les métadonnées :

```text
métadonnées (publiées) ─► validation ─► compilation ─► structures d'exécution en mémoire
   (validateurs prêts, plans de requêtes, tables de transitions, matrice de droits)
        │
        ▼  indexées par (tenant, version) ; remplacées atomiquement à la publication
requête ─► lecture de la structure compilée ─► exécution
```

- La structure compilée est **immuable** : une publication en crée une nouvelle et remplace l'ancienne d'un coup.
- Une requête en cours garde la **version** qu'elle a commencé à utiliser, ce qui évite des états mixtes.
- La **version** de métadonnées utilisée est tracée avec chaque décision (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).

#### Gouverner le métamodèle

Le métamodèle est partagé par tous les tenants. Le faire évoluer demande plus de soin que tout autre changement :

- les changements sont **compatibles** par défaut : on ajoute, on ne retire pas ;
- un changement incompatible suit une **dépréciation** annoncée et une **migration** des configurations existantes (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)) ;
- les configurations des tenants sont **testées** contre la nouvelle version avant son déploiement (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)) ;
- le déploiement est **progressif** (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

#### Les coûts et les pièges

| Piège | Description | Parade |
|---|---|---|
| Effet de plateforme interne | La configuration reproduit mal un langage de programmation | Limiter l'expressivité, offrir des extensions encadrées |
| Interprétation coûteuse | Lecture des métadonnées à chaque requête | Compilation, cache versionné |
| Débogage indirect | Un comportement vient d'une définition, pas d'une ligne de code | Traçabilité : quelle version, quelle règle (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) |
| Dérive entre environnements | Définitions différentes en préproduction et en production | Export, import, promotion de configuration |
| Compétences | Les administrateurs deviennent des « développeurs » sans le savoir | UX d'administration et garde-fous (voir [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration)) |

#### Les modes de défaillance

- **Un métamodèle trop pauvre** : tout cas particulier demande du code.
- **Un métamodèle trop riche** : un langage de programmation déguisé, ingérable.
- **Des métadonnées non versionnées** : on ne sait pas quel comportement s'applique.
- **Un moteur qui connaît un métier** : des `if` spécifiques à un client dans le code.
- **Des définitions non validées**, publiées sans contrôle.

**Contre-exemple.** Un moteur « générique » contient un test `if resource_type == "aircraft"` pour calculer une échéance. Pour supporter un client de santé, il faut copier le test, puis un autre, et ainsi de suite. Le moteur redevient une application spécifique, avec une apparence de généricité.

**Limites.** L'approche exige un investissement initial important et une équipe capable de concevoir un métamodèle. Elle n'est pas rentable si un seul domaine est visé, avec peu de variations. Les cas qui sortent du métamodèle demandent des extensions de code, qu'il faut prévoir.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'entrée de référence sur l'architecture pilotée par les métadonnées ; celle-ci en donne la vue d'ensemble |
| [2.2 Type et schéma](02-donnees-ressources.md#22-type-et-schéma) à [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Types, champs, métadonnées et champs personnalisés en sont les fondations |
| [13.2 Configuration versus code](#132-configuration-versus-code) | La frontière entre code et configuration dit ce qui entre dans le métamodèle |
| [13.3 Déclaratif versus impératif](#133-déclaratif-versus-impératif) | Les métadonnées s'expriment de façon déclarative |
| [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime) | Le plan de contrôle gère les métadonnées, le runtime les interprète |
| [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | L'UX d'administration et la configuration sûre rendent les métadonnées manipulables sans danger |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement de la configuration s'applique aux métadonnées |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Un contexte délimité définit son propre métamodèle ou son propre sous-ensemble |

### 5. Application pratique

**Situation initiale.** Un hôpital demande à utiliser la plateforme pour suivre ses lits : statut (libre, occupé, en nettoyage), service, affectation, et règle « un lit en nettoyage ne peut pas être attribué ».

**Problème.** La plateforme a été construite pour la maintenance aéronautique. Faut-il développer un module « Hôpital » ?

**Application du concept.** Évaluer le besoin par rapport au métamodèle.

**Déroulé.**

1. L'équipe décrit les besoins en termes de métamodèle : un type « Lit » avec des champs (`service`, `statut`), un workflow de statuts, une relation vers « Patient », une règle de garde, des rôles (infirmier, agent d'entretien).
2. Chaque élément existe dans le métamodèle : le besoin se **configure**, sans code.
3. Un besoin reste hors métamodèle : un algorithme de prévision d'occupation. Il n'est pas déclaratif et il est propre à ce client. Il est traité par une **extension** (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).
4. La configuration est testée par simulation, puis publiée dans un bac à sable avant la production.

**Résultat.** L'essentiel du besoin est couvert en quelques jours de configuration. La prévision d'occupation est un module d'extension séparé, sans toucher au moteur.

**Limites.** Si plusieurs clients demandent la même prévision, elle devrait entrer dans le métamodèle comme capacité générique : c'est un arbitrage de produit, pas seulement technique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une instance, un modèle et un métamodèle ?
2. **Compréhension.** Pourquoi compile-t-on les métadonnées ?
3. **Compréhension.** Pourquoi le métamodèle est-il le contrat le plus délicat ?
4. **Pourquoi.** Pourquoi un moteur qui contient un `if` sur un type d'objet précis contredit-il le principe ?
5. **Raisonnement pratique.** Un client demande une fonction qu'aucune configuration ne permet. Quelles questions vous posez-vous avant de coder ?

#### Réponses

1. Une instance est une donnée métier (l'aéronef F-ABCD). Un modèle est la description propre à un tenant (le type « Aéronef » et ses champs). Un métamodèle définit ce que la plateforme sait décrire (type, champ, état, règle).
2. Parce que lire et interpréter les définitions à chaque requête est coûteux. On les valide et on les transforme une fois en structures d'exécution, indexées par tenant et par version, et remplacées atomiquement à la publication.
3. Parce qu'il est partagé par tous les tenants : le changer sans précaution peut casser toutes les configurations. On le fait évoluer de façon compatible, avec dépréciation et déploiement progressif.
4. Parce que le moteur doit ignorer le métier. Chaque `if` spécifique recrée une application sur mesure, et supprime la possibilité de servir d'autres domaines par configuration.
5. Le besoin peut-il s'exprimer avec le métamodèle existant ? Est-ce une capacité générique à ajouter au métamodèle (utile à plusieurs tenants), ou une particularité à traiter en extension ? Quel est le coût de maintenance, et le risque ?

## 13.2 Configuration versus code

### 1. Comprendre simplement

Chaque comportement de la plateforme est soit **codé**, soit **configuré**. Le **code** est écrit par les ingénieurs de l'éditeur et livré par un déploiement. La **configuration** est une donnée, modifiée par un administrateur, active sans déploiement. La **frontière** entre les deux (*configuration vs code*, en anglais) est l'une des décisions d'architecture les plus structurantes d'une plateforme.

**Pourquoi cela existe.** Tout coder oblige chaque client à attendre l'éditeur : c'est lent, cher et ingérable à grande échelle. Tout configurer transforme le langage de configuration en langage de programmation mal outillé, risqué et difficile à tester. Il faut donc choisir, élément par élément, de quel côté de la frontière il se trouve.

**Problème résolu.** Donner de la souplesse aux clients sans sacrifier la sûreté, la performance et la maintenabilité.

**Modèle mental.** Un jeu de société. Les règles de base, le plateau et les pièces sont fixes (le code). Les règles « de la maison » (le nombre de joueurs, le montant de départ) se règlent à chaque partie (la configuration).

**Où l'analogie s'arrête.** Les règles de la maison d'un jeu ne mettent personne en danger. Une règle configurée dans une plateforme peut bloquer des opérations, ou ouvrir des droits. La configuration a des conséquences réelles et demande la même discipline que le code.

**Exemple.** La liste du plan : le **code** contient le moteur de sécurité, le moteur de workflow, le moteur de permissions, le moteur de données et le moteur d'événements. La **configuration** contient les types de ressources, les champs, les rôles, les permissions, les workflows, les politiques et les vues.

**Les composants.**

1. des **critères de décision** pour placer chaque élément ;
2. une **échelle** de niveaux, du code fixe aux extensions ;
3. des **points d'extension** là où le code rencontre la configuration ;
4. une **discipline** de génie logiciel appliquée à la configuration ;
5. un **chemin** pour déplacer un élément d'un côté à l'autre.

**Objectif d'apprentissage :** vous pouvez décider si un comportement doit être codé ou configuré à l'aide de critères explicites, et décrire pourquoi la configuration est du code déguisé.

### 2. Connaissances essentielles

#### Définition

- **Code** : comportement défini par des instructions écrites et livrées par l'éditeur, changées par un déploiement.
- **Configuration** : comportement défini par des données, propres à un tenant, modifiées par ses administrateurs sans déploiement.

#### Idées fondamentales

1. **Le code fixe les capacités, la configuration choisit leur usage.** Le moteur de workflow est du code, les workflows sont de la configuration.
2. **On configure ce qui varie, on code ce qui est stable.** Une variation réelle entre clients justifie une option. Sans variation, une option est un coût inutile.
3. **Ce qui est critique pour la sécurité ou l'intégrité reste codé, ou fortement encadré.** L'isolation des tenants ne se configure pas.
4. **La configuration est du code déguisé.** Elle demande versionnement, revue, tests, observabilité et retour arrière.
5. **La frontière bouge avec la maturité.** Une variation d'abord codée devient un paramètre, puis une règle.
6. **Chaque option a un coût permanent.** Tests, documentation, support, interactions avec les autres options.
7. **Il faut des échappatoires.** Un point d'extension encadré vaut mieux qu'une configuration qui tente de tout exprimer.

#### Vocabulaire essentiel

- **Paramètre** (*parameter*) : valeur simple (booléen, nombre, liste) qui règle un comportement fixe.
- **Option** (*option*, *setting*) : possibilité de choisir parmi plusieurs comportements.
- **Point d'extension** (*extension point*) : endroit où le code accepte du comportement externe (plugin, webhook, fonction).
- **Échappatoire** (*escape hatch*) : moyen d'obtenir un comportement que la configuration standard ne permet pas.
- **Dette de configuration** (*configuration debt*) : accumulation d'options, de règles et d'exceptions que personne ne comprend plus.
- **Dérive de configuration** (*configuration drift*) : divergence non maîtrisée entre environnements ou tenants.

#### Relations de cause à effet

- Une variation demandée par un client est codée en dur (`if tenant == "X"`). Le code se couvre d'exceptions, et chaque mise à jour devient risquée.
- Tout est rendu configurable. Les administrateurs doivent comprendre des centaines d'options, et personne ne peut tester les combinaisons (voir [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration)).
- La configuration n'est pas versionnée. On ne sait pas pourquoi le comportement a changé.
- Une règle de sécurité est configurable. Un administrateur la désactive par erreur, et l'isolation est compromise.

#### Idées reçues

- **« Configurable veut dire sans risque. »** Une configuration peut bloquer toute la production. Elle est aussi risquée qu'un déploiement.
- **« Il vaut mieux tout rendre configurable pour être générique. »** Une plateforme sans opinion devient un langage de programmation sans outils.
- **« La configuration n'a pas besoin de tests. »** Elle demande simulation, validation et revue (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

#### Principe clé

On configure ce qui varie réellement et qui peut être exprimé et validé de façon sûre ; on code ce qui est stable, critique ou trop complexe pour une description.

#### Si vous ne retenez que trois choses

1. Le code porte les moteurs et les garanties, la configuration porte les variations des clients.
2. La configuration est du code déguisé : elle demande les mêmes pratiques de qualité.
3. La frontière se décide par des critères (qui varie, à quelle fréquence, avec quel risque) et se déplace avec le temps.

### 3. Explication technique détaillée

#### L'échelle de la configurabilité

| Niveau | Mécanisme | Pouvoir | Analysabilité | Risque | Qui l'utilise |
|---|---|---|---|---|---|
| 0 | Code fixe | Total (par les ingénieurs) | Élevée (tests) | Livraison | Éditeur |
| 1 | Paramètres | Faible | Très élevée | Faible | Administrateurs |
| 2 | Données structurées (types, champs, états) | Moyen | Élevée | Moyen | Administrateurs, concepteurs |
| 3 | Règles déclaratives (condition, action) | Moyen à élevé | Élevée | Moyen | Concepteurs de processus |
| 4 | Expressions et formules | Élevé | Moyenne | Moyen à élevé | Utilisateurs avancés |
| 5 | Scripts exécutés en bac à sable | Très élevé | Faible | Élevé | Développeurs du client |
| 6 | Extensions de code (plugins, services) | Total | Très faible | Élevé | Partenaires, développeurs |

Plus on monte, plus le pouvoir augmente, et plus il devient difficile d'analyser, de simuler et de sécuriser. On vise le niveau le plus bas qui suffit.

#### Les critères de décision

| Critère | Vers la configuration | Vers le code |
|---|---|---|
| Qui fait varier ? | Un administrateur du client | L'éditeur seul |
| Fréquence de changement | Fréquente | Rare |
| Varie selon le tenant ? | Oui | Non |
| Risque en cas d'erreur | Faible ou maîtrisable (simulation, retour arrière) | Élevé : sécurité, intégrité, isolation |
| Exprimable de façon déclarative ? | Oui | Non : algorithme, optimisation |
| Performance | Non critique, ou compilable | Critique, chemin chaud |
| Besoin de test et de revue stricts | Possible par le pipeline de configuration | Mieux couvert par le pipeline de livraison |

#### Quelques décisions

| Besoin | Choix | Raison |
|---|---|---|
| Intervalle d'inspection par type d'aéronef | Configuration (donnée avec date d'effet) | Varie selon le tenant et la réglementation ; simple |
| Algorithme d'optimisation des plannings | Code, ou extension | Complexe, critique pour la performance, non déclaratif |
| « Un utilisateur ne peut pas approuver sa propre demande » | Invariant imposé par la plateforme | Sécurité ; ne doit pas pouvoir être désactivé (voir [13.5 Invariants](#135-invariants)) |
| Libellés et traductions | Configuration | Varie, sans risque |
| Contrôle d'accès | Moteur en code, politiques en configuration | Le moteur est stable, les politiques varient (voir [13.7 Policy as Code](#137-policy-as-code)) |
| Calcul d'une redevance propre à un client | Formule configurable, ou extension | Selon la complexité |

#### Un chemin de migration

Quand une variation s'installe, l'élément descend ou monte sur l'échelle :

```text
Étape 1 · code         si aircraft.type = "A320" alors intervalle = 90
Étape 2 · paramètre    intervalle = réglages.intervalle_inspection[aircraft.type]
Étape 3 · données      table « intervalles » éditée par le tenant, avec date d'effet
Étape 4 · règle        intervalle = règle("intervalle_inspection", aircraft)  (plusieurs conditions)
```

**Signal d'alerte.** Quand le même `if tenant == ...` apparaît deux fois, c'est qu'une variation réelle attend d'être modélisée. À l'inverse, une option que personne n'a modifiée en un an est candidate à devenir une valeur fixe.

#### La configuration est du code

| Pratique de génie logiciel | Application à la configuration |
|---|---|
| Gestion de versions | Versions de configuration, historique, différences (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) |
| Revue de code | Revue et approbation des changements (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) |
| Tests | Validation, simulation, jeux d'essai (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)) |
| Déploiement progressif | Publication par paliers (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)) |
| Observabilité | Trace de la version appliquée à chaque décision (voir [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces)) |
| Retour arrière | Restauration d'une version précédente (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)) |

#### Les points d'extension

Entre le code et la configuration, des points d'extension laissent entrer du comportement externe de façon encadrée :

- des **fonctions** personnalisées utilisables dans les expressions ;
- des **plugins** exécutés dans un bac à sable (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) ;
- des **webhooks** appelés lors d'événements (voir [7.5 Webhook](07-evenements-automatisation.md#75-webhook)) ;
- des **actions** personnalisées dans un workflow (voir [10.15 Interface personnalisée et workflows personnalisés](10-api-integrations-extensibilite.md#1015-interface-personnalisée-et-workflows-personnalisés)).

Chaque point d'extension a un **contrat** (entrées, sorties, délais, droits) versionné comme une API.

#### Les modes de défaillance

- **Le codage par client** : `if tenant == "X"` dans le moteur.
- **La configuration sans schéma** : des paramètres libres, sans type ni validation.
- **Le « tout configurable »** : un langage de programmation déguisé.
- **Des options mortes** : des réglages que plus personne ne comprend.
- **La dérive entre environnements.**
- **Une configuration sans propriétaire.**

**Contre-exemple.** Une plateforme ajoute une option pour chaque demande de client. Trois ans plus tard, elle en compte 400, dont 120 interagissent. Une nouvelle version casse des combinaisons que personne n'avait prévues, et l'équipe ne peut plus tester l'ensemble.

**Limites.** La frontière dépend de l'éditeur, du marché et de la maturité : il n'existe pas de règle universelle. Une mauvaise décision se corrige, mais à un coût : retirer une option expose les clients qui l'utilisent.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [13.1 Architecture pilotée par les métadonnées, vue transversale](#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | La frontière détermine ce qui entre dans le métamodèle |
| [13.3 Déclaratif versus impératif](#133-déclaratif-versus-impératif) | Les niveaux 2 à 4 de l'échelle sont des formes déclaratives |
| [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime) | Le plan de contrôle manipule la configuration, le runtime exécute le code qui l'interprète |
| [13.5 Invariants](#135-invariants) | Les invariants de plateforme restent hors de la configuration |
| [13.7 Policy as Code](#137-policy-as-code) | Les politiques sont de la configuration traitée comme du code |
| [1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire) | L'architecture modulaire place le code en modules et la configuration en données |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | La plateforme d'administration donne accès à la configuration |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions sont le niveau le plus haut de l'échelle |

### 5. Application pratique

**Situation initiale.** Un client demande que l'intervalle d'inspection soit de 60 jours pour ses A320, au lieu de 90. Un autre demande qu'un algorithme tienne compte des disponibilités des hangars pour planifier les inspections.

**Problème.** Les deux demandes sont-elles du même ordre ? Où les placer sur l'échelle ?

**Application du concept.** Les critères de décision.

**Déroulé.**

1. **Intervalle d'inspection.** Il varie selon les tenants et la réglementation, et il change à des dates précises. Il est simple et peu risqué. On le place en **donnée** : une table `intervalle par type` avec date d'effet (voir [13.6 Modélisation temporelle](#136-modélisation-temporelle)), éditable par le tenant.
2. **Algorithme de planification.** Il est complexe, propre à ce client, et critique pour la performance. Il n'est pas déclaratif. On le place en **extension** : un service externe appelé par un point d'extension, avec un contrat versionné et un délai maximal (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).
3. Le premier changement passe par le parcours de publication sûr (validation, simulation, revue, publication, voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)). Le second est testé comme un composant logiciel.

**Résultat.** La première demande est satisfaite en une demi-journée par l'administrateur, sans l'éditeur. La seconde est livrée par une équipe d'intégration, sans modifier le moteur.

**Limites.** Si dix clients demandent un algorithme de planification, il devient une capacité de la plateforme, avec ses propres paramètres : la frontière se déplace.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois critères qui orientent un comportement vers la configuration et trois vers le code.
2. **Compréhension.** Pourquoi dit-on que la configuration est du code déguisé ?
3. **Compréhension.** Qu'est-ce qu'un point d'extension, et pourquoi en faut-il ?
4. **Pourquoi.** Pourquoi les règles de sécurité fondamentales ne doivent-elles pas être configurables ?
5. **Raisonnement pratique.** Le même `if tenant == "X"` apparaît à deux endroits du moteur. Que faites-vous ?

#### Réponses

1. Vers la configuration : la variation vient de l'administrateur, elle est fréquente, elle varie selon le tenant, elle est déclarative et validable. Vers le code : l'éditeur seul la fait varier, elle est rare, elle est critique pour la sécurité ou la performance, ou elle est non déclarative.
2. Parce qu'elle change le comportement du système comme le ferait du code : elle peut le casser, elle a des dépendances, et elle demande versionnement, revue, tests, observabilité et retour arrière.
3. C'est l'endroit où le code accepte du comportement externe (plugin, webhook, fonction personnalisée) avec un contrat. Il en faut parce que la configuration ne peut pas tout exprimer, et qu'une échappatoire encadrée vaut mieux qu'un langage de configuration qui tente de tout faire.
4. Parce qu'une erreur ou un abus d'un tenant pourrait les affaiblir pour tous : l'isolation, l'audit et l'authentification forte des administrateurs protègent la plateforme entière.
5. J'y vois le signal qu'une variation réelle n'est pas modélisée. Je la remplace par un paramètre ou une règle configurable, avec une valeur par défaut, et je retire le test spécifique du moteur.

## 13.3 Déclaratif versus impératif

### 1. Comprendre simplement

Un style **impératif** (*imperative*) décrit **comment** faire : une suite d'instructions que l'on exécute dans l'ordre. Un style **déclaratif** (*declarative*) décrit **ce que l'on veut** : une condition, un résultat, un état désiré, et c'est le moteur qui décide comment y parvenir. Le plan oppose les deux sous le titre *declarative vs imperative* et le résume ainsi : l'administrateur manipule des **déclarations**, et le moteur les exécute.

**Pourquoi cela existe.** Une plateforme générique doit permettre à des non-développeurs d'exprimer des comportements, et à la plateforme de les **comprendre** : les valider, les comparer, les simuler, les expliquer. Un programme impératif quelconque se laisse difficilement analyser. Une déclaration restreinte, elle, se laisse analyser.

**Problème résolu.** Rendre les comportements configurables à la fois **lisibles**, **vérifiables** et **sûrs**.

**Modèle mental.** Un plan d'architecte plutôt qu'un journal de chantier. Le plan dit ce que l'on veut obtenir. Le journal dit dans quel ordre on a posé chaque brique. Avec le plan, on peut vérifier la cohérence, calculer les quantités et comparer deux versions.

**Où l'analogie s'arrête.** Un plan ne s'exécute pas. Une déclaration de plateforme, si : elle est évaluée par un moteur, avec un ordre, un moment et des effets. Il faut donc aussi une sémantique précise de son évaluation.

**Exemple.** Le plan donne deux formes de la même règle.

```text
Impératif                                       Déclaratif
si aircraft.status == "maintenance":            QUAND aircraft.status = "maintenance"
    aircraft.available = faux                   ALORS available = faux
```

**Les composants.**

1. un **langage restreint** de déclarations ;
2. un **moteur** qui les évalue ;
3. une **sémantique** claire (quand, dans quel ordre, avec quels effets) ;
4. des **outils** d'analyse : validation, simulation, impact, explication ;
5. des **échappatoires** impératives encadrées.

**Objectif d'apprentissage :** vous pouvez distinguer les deux styles, expliquer pourquoi le déclaratif se prête mieux à l'analyse, et citer ses limites.

### 2. Connaissances essentielles

#### Définition

- **Impératif** : style qui décrit une suite d'instructions et l'ordre de leur exécution pour obtenir un résultat.
- **Déclaratif** : style qui décrit le résultat, la condition ou l'état voulu, en laissant au moteur le choix de la méthode.

#### Idées fondamentales

1. **Une déclaration décrit le « quoi », pas le « comment ».** Le moteur choisit l'exécution, l'ordre, l'optimisation.
2. **Une déclaration restreinte est analysable.** On peut en extraire les dépendances, vérifier la cohérence, la simuler et l'expliquer.
3. **Un langage plus expressif est moins analysable.** Un langage complet ne permet pas, en général, de décider s'il se termine.
4. **La sémantique d'évaluation compte.** « QUAND » est-il évalué à chaque événement, à chaque changement d'état, ou à une date ?
5. **Le déclaratif ne supprime pas l'impératif.** Il le déplace dans le moteur, et dans des échappatoires explicitement encadrées.
6. **Un état désiré peut être réconcilié.** Un moteur compare l'état voulu et l'état réel, puis agit pour les rapprocher.

#### Vocabulaire essentiel

- **Déclaration** (*declaration*) : description d'un résultat, d'une règle ou d'un état voulu.
- **État désiré** (*desired state*) : configuration que le système doit atteindre.
- **Réconciliation** (*reconciliation*) : boucle qui compare l'état désiré à l'état réel et les rapproche.
- **Langage dédié** (*domain-specific language*, DSL) : langage restreint, adapté à un domaine.
- **Sémantique** : règles qui précisent la signification et l'évaluation d'une déclaration.
- **Échappatoire** (*escape hatch*) : appel à du code impératif depuis un cadre déclaratif.
- **Terminaison** (*termination*) : garantie qu'une évaluation s'achève.

#### Relations de cause à effet

- Les règles sont des déclarations restreintes. Le moteur peut extraire leurs dépendances et les simuler (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).
- Les règles sont des scripts impératifs libres. L'analyse d'impact et l'explication deviennent impossibles, et une boucle infinie reste possible.
- Le langage déclaratif s'enrichit de boucles, de variables et de fonctions. Il devient un langage complet : on perd l'analysabilité et la terminaison garantie.
- La sémantique d'évaluation est mal définie. Deux administrateurs lisent la même règle différemment, et le comportement surprend.

#### Idées reçues

- **« Déclaratif signifie sans programmation. »** Une déclaration complexe demande la même rigueur : conditions, cas limites, tests.
- **« Impératif est mauvais. »** Il est nécessaire pour les algorithmes. Le déclaratif convient aux variations exprimables simplement.
- **« Un langage déclaratif est toujours simple à déboguer. »** Le moteur décide de l'exécution : sans traçabilité, on ne voit pas pourquoi une règle a produit un effet.

#### Principe clé

On donne aux administrateurs un langage de déclarations restreint, que la plateforme sait analyser, simuler et expliquer, et on garde l'impératif dans le moteur et dans des échappatoires encadrées.

#### Si vous ne retenez que trois choses

1. Le déclaratif décrit le résultat voulu ; le moteur décide de la méthode.
2. La restriction du langage est ce qui permet l'analyse, la simulation et l'explication.
3. La sémantique d'évaluation et la traçabilité sont indispensables.

### 3. Explication technique détaillée

#### Comparer les deux styles

| Critère | Impératif | Déclaratif |
|---|---|---|
| Décrit | Les étapes | Le résultat ou la condition |
| Ordre | Explicite, dans le texte | Choisi par le moteur ou défini par la sémantique |
| Analyse automatique | Difficile | Possible (dépendances, cohérence) |
| Simulation | Exécution réelle nécessaire | Évaluation à blanc possible |
| Explication | Rejouer le programme | Montrer les conditions satisfaites (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) |
| Expressivité | Totale | Limitée par le langage |
| Risque | Boucles, effets de bord | Lacunes de sémantique, conflits entre règles |
| Utilisateur type | Développeur | Concepteur de processus, administrateur |

#### Une règle déclarative structurée

Dans une plateforme, la déclaration est une donnée structurée, pas du texte libre (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles)).

```json
{
  "rule": "aircraft_unavailable_in_maintenance",
  "when": { "event": "aircraft.status_changed", "condition": { "field": "status", "op": "eq", "value": "in_inspection" } },
  "then": [ { "set": { "field": "available", "value": false } } ],
  "priority": 100
}
```

- `when` : l'événement et la condition (déclaratifs, structurés).
- `then` : les effets, à partir d'un ensemble fini d'actions disponibles.
- `priority` : l'ordre en cas de plusieurs règles applicables.

Parce que la règle est structurée, la plateforme peut lister les champs qu'elle lit et écrit, détecter les conflits avec d'autres règles, et la simuler sur des données.

#### Expressivité contre analysabilité

Plus un langage est expressif, moins on peut garantir de choses à son sujet. Pour un langage complet, on ne peut pas décider, en général, si une évaluation se terminera (c'est le problème de l'arrêt). Une plateforme choisit donc un point sur cette échelle :

| Langage | Exemples | Terminaison garantie | Analysable |
|---|---|---|---|
| Conditions et actions sur un ensemble fini | Règles « quand / alors » | Oui | Très bien |
| Expressions sans boucle | Formules, gardes (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)) | Oui | Bien |
| Expressions avec récursion ou boucles bornées | Calculs avancés | Avec un budget d'exécution | Moyennement |
| Langage complet | Scripts de plugins | Non | Peu |

Un langage complet reste possible dans un **bac à sable** avec un budget de temps et de ressources (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)), mais on ne lui demande pas de garanties d'analyse.

#### La sémantique d'évaluation

Une déclaration n'a de sens qu'avec une règle d'évaluation précise. Les questions à trancher :

- **Quand ?** À chaque événement, à chaque changement d'état, ou périodiquement.
- **Dans quel ordre ?** Par priorité, par ordre de déclaration, ou sans ordre garanti.
- **Que se passe-t-il en cas de conflit ?** Deux règles écrivent des valeurs différentes dans le même champ.
- **Quels effets ?** Instantanés, différés, idempotents ?
- **Combien de fois ?** Une règle déclenchée en boucle par ses propres effets.

Ces choix doivent être **documentés, constants et testés** : ils font partie du contrat du moteur.

#### Le modèle de l'état désiré

Une autre forme du déclaratif décrit un **état voulu**, qu'un moteur de réconciliation atteint.

```text
état désiré (déclaré)          état réel (observé)           action du moteur
rôle « planificateur » :       rôle « planificateur » :
  permissions : A, B, C          permissions : A, B           ► ajouter C
tenant : région = EU           tenant : région = EU          ► aucune
```

- Le moteur **compare** et **corrige** en boucle, de façon idempotente.
- Le résultat ne dépend pas de l'historique des commandes, mais de l'état voulu.
- Ce modèle sert au provisionnement (voir [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement)), à la synchronisation de droits (voir [4.12 SCIM](04-identite-iam-autorisation.md#412-scim)) et à la propagation de la configuration.

#### Les échappatoires impératives

Quand le langage déclaratif ne suffit pas, une **échappatoire** appelle du code impératif :

- fonctions personnalisées, pures et sans effet de bord, utilisables dans une expression ;
- actions personnalisées d'un workflow (voir [10.15 Interface personnalisée et workflows personnalisés](10-api-integrations-extensibilite.md#1015-interface-personnalisée-et-workflows-personnalisés)) ;
- plugins et services externes (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

Elles ont un **contrat** (entrées, sorties, délai maximal, droits) et un **budget**. Une échappatoire est signalée dans l'analyse d'impact comme une zone non vérifiable (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).

#### Les modes de défaillance

- **Un langage qui devient complet** : on ajoute des boucles, des variables, des fonctions, jusqu'à avoir un langage de programmation sans outils.
- **Une sémantique implicite** : l'ordre ou la fréquence d'évaluation ne sont pas documentés.
- **Des règles en conflit** non détectées.
- **Un moteur opaque** : on ne peut pas savoir pourquoi une règle a agi.
- **Des échappatoires omniprésentes** : le déclaratif n'est qu'un décor.

**Contre-exemple.** Une plateforme permet d'écrire dans une règle un script JavaScript libre. Une règle appelle une API externe à chaque évaluation, une autre modifie le champ que la première lit. Le comportement dépend de l'ordre d'exécution, plus rien n'est simulable, et un administrateur provoque sans le vouloir une boucle d'écritures.

**Limites.** Le déclaratif convient aux variations simples et régulières. Pour des algorithmes (optimisation, calcul scientifique), l'impératif reste adapté. Les moteurs déclaratifs ont aussi des performances moins prévisibles : le choix de la méthode appartient au moteur.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique), [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule), [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | Règles, expressions, tables de décision et moteur de règles sont les formes déclaratives du module 6 |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Une machine à états est une déclaration d'états et de transitions |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | Les métadonnées s'expriment de façon déclarative |
| [13.2 Configuration versus code](#132-configuration-versus-code) | Les niveaux 2 à 4 de l'échelle sont déclaratifs |
| [13.7 Policy as Code](#137-policy-as-code) | Les politiques sont des déclarations évaluées à l'exécution |
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Le modèle de requête déclaratif suit le même principe que SQL |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) et [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | L'explicabilité et l'analyse d'impact reposent sur le caractère déclaratif |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Le provisionnement fonctionne par réconciliation d'un état désiré |

### 5. Application pratique

**Situation initiale.** Une plateforme permet d'écrire des règles de workflow sous forme de scripts. Un administrateur écrit une règle qui déclenche une notification à chaque modification d'un aéronef. Une autre règle, du même type, modifie un aéronef quand une notification est envoyée. Le système entre en boucle, et les utilisateurs reçoivent des milliers de messages.

**Problème.** Le langage trop libre ne permet ni de détecter le cycle, ni de garantir la terminaison.

**Application du concept.** Un passage à un langage de règles déclaratif restreint.

**Déroulé.**

1. L'équipe définit des règles « quand / si / alors » sur un ensemble fini d'événements, de conditions et d'actions.
2. Le moteur construit le **graphe de déclenchement** : quelle règle écrit quel champ, quelle règle réagit à quel événement.
3. Une **analyse statique** à la publication détecte un cycle possible : la règle A déclenche la règle B, qui déclenche A.
4. Un **budget** (profondeur de chaînage, nombre de règles par événement) garantit la terminaison à l'exécution (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).
5. Une **échappatoire** (une fonction personnalisée) reste disponible pour les cas particuliers, avec contrat et plafonds.

**Résultat.** Le cycle est détecté avant publication. L'administrateur voit « les règles R-12 et R-18 se déclenchent mutuellement ». Aucune boucle n'atteint la production.

**Limites.** L'analyse statique ne voit pas les cycles qui passent par un système externe : le budget d'exécution reste nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un style impératif et un style déclaratif ?
2. **Compréhension.** Pourquoi une règle déclarative structurée est-elle plus facile à simuler qu'un script ?
3. **Compréhension.** Qu'est-ce que la réconciliation d'un état désiré ?
4. **Pourquoi.** Pourquoi limite-t-on l'expressivité d'un langage de règles ?
5. **Raisonnement pratique.** Deux règles déclenchées par le même événement écrivent des valeurs différentes dans un même champ. Comment la plateforme doit-elle se comporter ?

#### Réponses

1. L'impératif décrit les étapes à exécuter et leur ordre. Le déclaratif décrit le résultat ou la condition voulus, et laisse au moteur le choix de la méthode.
2. Parce que la plateforme peut lire sa structure : elle en extrait les champs lus et écrits, évalue les conditions sans effet, et rapporte le résultat. Un script libre ne se laisse exécuter que pour de vrai, avec ses effets.
3. C'est une boucle qui compare l'état déclaré à l'état réel, et qui agit de façon idempotente pour les rapprocher, sans dépendre de l'historique des commandes.
4. Pour conserver l'analysabilité (dépendances, cycles, simulation) et garantir la terminaison. Un langage trop expressif perd ces garanties.
5. Elle doit appliquer une sémantique de conflit définie à l'avance (priorité, ordre déclaré, ou refus de publication), idéalement détecter le conflit à la publication, et le signaler plutôt que de laisser un ordre implicite décider.

## 13.4 Plan de contrôle versus runtime

### 1. Comprendre simplement

Le **plan de contrôle** (*control plane*) est la partie de la plateforme où l'on **décide** : configuration, politiques, workflows, permissions. Le **runtime** (*runtime*, ou moteur d'exécution) est la partie où l'on **exécute** : il applique ces décisions aux opérations de chaque jour. Le plan oppose les deux sous le titre *control plane vs runtime* et en tire une règle : l'administrateur **ne manipule pas directement les données de manière arbitraire**. Il **configure le moteur qui gouverne les opérations**.

**Pourquoi cela existe.** Si l'administrateur écrit directement dans les données, il contourne tout ce qui les protège : validations, droits, états, audit, invariants. Chaque correction « à la main » est une chance de casser la cohérence. En passant par le moteur, les règles s'appliquent toujours, de la même manière.

**Problème résolu.** Garantir que les règles s'appliquent à toutes les opérations, et que le pouvoir de les changer est séparé, protégé et tracé.

**Modèle mental.** Le bureau des méthodes d'une usine et la chaîne de production. Le bureau des méthodes définit les gammes de fabrication et les contrôles. Il ne monte pas chaque pièce. La chaîne applique les gammes, produit, et signale les anomalies.

**Où l'analogie s'arrête.** Une usine change ses gammes rarement. Une plateforme change sa configuration en continu, en production, pendant que des opérations sont en cours, et chaque version doit coexister avec les travaux déjà commencés.

**Exemple.** L'administrateur change la garde de la transition « Remettre en service ». Il ne modifie pas les 1 240 enregistrements d'aéronefs. Il modifie le workflow dans le plan de contrôle. Le runtime applique la nouvelle garde à partir de la prochaine transition.

**Les composants.**

1. le **plan de contrôle** : édition, validation, versionnement de la configuration ;
2. le **magasin de configuration** versionné ;
3. le **mécanisme de propagation** vers le runtime ;
4. le **runtime** : moteurs de données, de workflow, d'autorisation ;
5. les **opérations de maintenance** encadrées, pour les corrections de données.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi l'administrateur configure le moteur plutôt que les données, décrire le contrat entre les deux plans, et traiter les travaux en cours lors d'un changement.

### 2. Connaissances essentielles

#### Définition

- **Plan de contrôle** : ensemble des fonctions qui définissent et gouvernent le comportement du système (configuration, politiques, workflows, permissions).
- **Runtime** : ensemble des moteurs qui exécutent les opérations selon la configuration publiée, sur les données de chaque tenant.

#### Idées fondamentales

1. **L'administrateur configure le moteur, il n'écrit pas les données.** Les opérations de données passent par le runtime.
2. **Le runtime est la seule voie d'écriture des données métier.** Droits, validations, états, audit et invariants s'y appliquent.
3. **Le plan de contrôle produit des versions de configuration.** Elles sont validées, immuables et traçables.
4. **Le runtime utilise une copie locale.** Il ne dépend pas du plan de contrôle pour traiter chaque requête.
5. **Le délai de propagation est connu et observable.** Pendant ce délai, des nœuds peuvent appliquer des versions différentes.
6. **Un travail en cours garde sa version, ou migre selon une règle explicite.**
7. **Le plan de contrôle est plus puissant, donc mieux protégé.** Une erreur y touche tous les tenants ou toutes les opérations.

#### Vocabulaire essentiel

- **Configuration publiée** (*published configuration*) : version validée et active de la configuration.
- **Propagation** (*propagation*) : transmission d'une version du plan de contrôle vers le runtime.
- **Dernière configuration valide** (*last known good*) : version que le runtime continue d'utiliser si le plan de contrôle est indisponible.
- **Épinglage de version** (*version pinning*) : fait qu'un travail en cours conserve la version avec laquelle il a commencé.
- **Opération de maintenance** (*maintenance operation*) : correction de données exécutée par le moteur, avec motif et audit.
- **Accès d'urgence** (*break-glass*) : accès exceptionnel, tracé, qui contourne les protections normales.

#### Relations de cause à effet

- L'administrateur écrit dans la base. Les invariants, les droits et l'audit sont contournés, et la cohérence se dégrade sans trace.
- Chaque requête métier interroge le plan de contrôle. Une panne ou une lenteur du plan de contrôle arrête le runtime.
- La configuration est propagée sans versions. Impossible de savoir quelle configuration s'appliquait, ni de revenir en arrière.
- Un changement s'applique à tous les travaux en cours. Un workflow à mi-parcours se retrouve sous des règles qu'il n'avait pas à son démarrage.

#### Idées reçues

- **« L'administrateur doit pouvoir tout modifier directement. »** Il doit pouvoir tout faire **par le moteur**, avec les garde-fous du moteur.
- **« Le plan de contrôle est moins important, il a peu de trafic. »** Sa disponibilité compte moins que celle du runtime, mais son exactitude compte davantage : une erreur s'y propage partout.
- **« Séparer les plans, c'est séparer deux logiciels. »** C'est d'abord une séparation de responsabilités et de privilèges. Elle peut se faire dans un même déploiement.

#### Principe clé

Les règles se changent dans le plan de contrôle, par des versions validées ; elles s'appliquent à toutes les opérations par le runtime, qui reste la seule voie d'écriture des données.

#### Si vous ne retenez que trois choses

1. L'administrateur agit sur la configuration, pas sur les données ; le runtime applique les règles à chaque opération.
2. Le runtime fonctionne avec une copie versionnée de la configuration, même si le plan de contrôle est indisponible.
3. Les travaux en cours suivent une politique de version explicite : épinglage ou migration.

### 3. Explication technique détaillée

#### La chaîne de commande

```text
ADMINISTRATEUR
      │  édite, valide, publie
      ▼
PLAN DE CONTRÔLE ── configuration · politiques · workflows · permissions
      │  versions publiées (immuables, signées)
      ▼  propagation
RUNTIME ── moteur de données · de workflow · d'autorisation · d'événements
      │
      ▼
OPÉRATIONS ── enregistrements, transitions, approbations, notifications
```

Le sens est unique : la configuration descend. Les opérations ne modifient jamais la configuration.

#### Ce que l'administrateur peut et ne peut pas faire

| Besoin | Voie normale | Voie à éviter |
|---|---|---|
| Changer une règle | Modifier le workflow, publier une version | Modifier les données pour obtenir l'effet |
| Corriger 12 enregistrements erronés | Opération de maintenance via le moteur, avec motif | Requête d'écriture directe en base |
| Ajouter un statut | Modifier le type, publier | Ajouter la valeur dans la colonne |
| Donner un droit | Affecter un rôle (voir [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès)) | Modifier la table des permissions |
| Voir des données | Vue ou export soumis aux droits | Lecture directe de la base |

**Opération de maintenance.** Quand une donnée doit être corrigée en masse, on utilise une opération du moteur : elle applique les validations, vérifie les invariants, trace l'auteur et le motif, et se rejoue de façon idempotente (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse) et [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

```json
{
  "operation": "repair.set_field",
  "resource_type": "aircraft",
  "selection": { "ids": ["ac_8f3a", "ac_77d2"] },
  "patch": { "status": "in_inspection" },
  "reason": "Import du 2026-10-12 : statut erroné (incident INC-2041)",
  "dry_run": true
}
```

#### Le contrat entre les deux plans

La configuration publiée est un objet versionné que le runtime consomme :

```json
{
  "tenant_id": "ten_airline_01",
  "config_version": 42,
  "schema_version": "3.1",
  "published_at": "2026-10-13T08:00:00Z",
  "effective_from": "2026-10-13T08:05:00Z",
  "checksum": "sha256:9f2c…e41a",
  "contents": { "resource_types": [], "workflows": [], "policies": [], "roles": [] }
}
```

- `config_version` : numéro monotone, utilisé dans les traces de décision.
- `schema_version` : version du métamodèle, pour la compatibilité (voir [13.1 Architecture pilotée par les métadonnées, vue transversale](#131-architecture-pilotée-par-les-métadonnées-vue-transversale)).
- `effective_from` : instant à partir duquel la version s'applique (voir [13.6 Modélisation temporelle](#136-modélisation-temporelle)).
- `checksum` : intégrité vérifiée par le runtime avant application.

#### La propagation et la cohérence

| Mode | Principe | Avantage | Limite |
|---|---|---|---|
| Notification (push) | Le plan de contrôle prévient les nœuds | Rapide | Notifications perdues |
| Interrogation (pull) | Les nœuds vérifient périodiquement | Robuste | Délai égal à la période |
| Mixte | Notification, avec interrogation de rattrapage | Rapide et robuste | Plus complexe |

Pendant la propagation, des nœuds peuvent appliquer des versions différentes. Le délai est borné et visible : chaque nœud publie la version appliquée, et le plan de contrôle affiche l'avancement du déploiement (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

#### Les travaux en cours

Un changement de configuration arrive alors que des workflows, des approbations et des imports sont en cours. La politique doit être explicite :

| Politique | Description | Quand l'utiliser |
|---|---|---|
| Épingler | Le travail termine avec la version qui l'a démarré | Cohérence d'un processus long, valeur probante |
| Migrer | Le travail passe à la nouvelle version à la prochaine étape | Correction d'une règle, changement de sécurité |
| Mixte | Épingler par défaut, migrer pour certaines classes de changements | Cas général |
| Redémarrer | Recommencer avec la nouvelle version | Rare, avec accord explicite |

Le choix est lié au type de changement : un changement de sécurité s'applique immédiatement à tout, un changement de processus s'applique aux nouvelles instances.

#### Les défaillances

| Situation | Comportement attendu |
|---|---|
| Plan de contrôle indisponible | Le runtime continue avec la dernière configuration valide (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)) |
| Configuration reçue invalide (checksum, schéma) | Elle est rejetée, la version précédente reste active, une alerte est émise |
| Nœud en retard | Il rattrape par interrogation ; il est signalé s'il dépasse un seuil |
| Version défaillante en production | Retour arrière du plan de contrôle (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)) |

#### La séparation des privilèges

| Rôle | Périmètre | Protections |
|---|---|---|
| Administrateur de tenant | Configuration de son tenant | Authentification forte, journal d'audit |
| Administrateur de la plateforme | Configuration commune, tous les tenants | Authentification forte, approbation, accès limité dans le temps (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) |
| Ingénieur d'exploitation | Infrastructure, déploiements | Plan de gestion séparé (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)) |
| Accès d'urgence | Contourne les protections normales | Double contrôle, durée limitée, audit renforcé |

#### Les modes de défaillance

- **L'écriture directe en base**, qui contourne le moteur.
- **Le couplage du chemin critique** : le runtime appelle le plan de contrôle à chaque requête.
- **Une configuration non versionnée.**
- **Des travaux en cours soumis à une version imprévue.**
- **Un plan de contrôle sans protection particulière**, malgré son pouvoir.
- **Un accès d'urgence permanent** qui devient la voie normale.

**Contre-exemple.** Un administrateur technique, pressé, exécute une requête SQL pour changer le statut de 300 aéronefs importés par erreur. La requête ignore la garde de la transition, l'historique des états et les événements. Les notifications et les audits ne sont pas déclenchés. Trois semaines plus tard, un audit constate des aéronefs « actifs » sans trace de leur remise en service.

**Limites.** La séparation ajoute un délai entre la décision et son application, et de la complexité (versions, propagation). Pour un petit système mono-tenant, elle peut être excessive. Elle devient indispensable dès que plusieurs clients partagent le moteur.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | L'entrée de référence sur les trois plans ; celle-ci insiste sur le contrat de configuration et les travaux en cours |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) à [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La plateforme d'administration est l'interface humaine du plan de contrôle |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) et [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) | Le versionnement et le retour arrière font vivre la configuration publiée |
| [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse) et [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Les opérations de maintenance sont des opérations en masse idempotentes |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | Le runtime interprète les métadonnées publiées |
| [13.2 Configuration versus code](#132-configuration-versus-code) | Le plan de contrôle manipule la configuration, le code porte le runtime |
| [13.6 Modélisation temporelle](#136-modélisation-temporelle) | La date d'effet d'une version relève de la modélisation temporelle |
| [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | L'UX d'administration et la configuration sûre protègent le plan de contrôle |

### 5. Application pratique

**Situation initiale.** Un import défectueux a positionné 12 aéronefs au statut « actif » alors qu'ils sont en inspection. Un ingénieur propose une requête SQL de correction.

**Problème.** Une requête directe contournerait les gardes, l'historique et l'audit. Les aéronefs concernés pourraient aussi déclencher des événements incohérents.

**Application du concept.** Une opération de maintenance exécutée par le moteur.

**Déroulé.**

1. L'ingénieur prépare l'opération `repair.set_field` avec la sélection, le correctif et le motif « incident INC-2041 ».
2. Il l'exécute d'abord en **simulation** : 12 éléments seraient modifiés, 0 refusé.
3. Une deuxième personne **approuve** l'opération, au titre de la séparation des tâches (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
4. Le moteur applique le correctif élément par élément. Chaque changement crée une révision (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) et un événement (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) avec la mention « maintenance ».
5. Le rapport est conservé avec l'incident.

**Résultat.** Les 12 aéronefs sont corrigés. L'historique montre l'ancien et le nouveau statut, l'auteur, le motif et l'approbateur. Aucun invariant n'a été contourné.

**Limites.** L'opération n'a pas corrigé la cause : l'import lui-même. Un correctif de l'import et une validation dans le plan de contrôle sont à prévoir (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fait le plan de contrôle, et que fait le runtime ?
2. **Compréhension.** Pourquoi l'administrateur ne doit-il pas écrire directement dans les données ?
3. **Compréhension.** Que signifie « épingler » une version pour un travail en cours ?
4. **Pourquoi.** Pourquoi le runtime doit-il conserver une copie locale de la configuration ?
5. **Raisonnement pratique.** Une règle de sécurité est durcie. Doit-on épingler ou migrer les workflows en cours ?

#### Réponses

1. Le plan de contrôle définit, valide, versionne et publie la configuration (politiques, workflows, permissions). Le runtime l'exécute : il applique ces décisions à chaque opération et reste la seule voie d'écriture des données.
2. Parce qu'une écriture directe contourne les validations, les droits, les gardes, l'historique et l'audit, et peut casser les invariants sans laisser de trace.
3. Que le travail (une instance de workflow, par exemple) termine avec la version de configuration qui était active quand il a démarré, même si une nouvelle version a été publiée entre-temps.
4. Pour ne pas dépendre du plan de contrôle sur le chemin critique : une panne ou une lenteur du plan de contrôle ne doit pas arrêter le traitement des opérations. Le runtime continue avec la dernière configuration valide.
5. On migre : un changement de sécurité doit s'appliquer à tout, y compris aux travaux en cours, à la prochaine étape. Épingler laisserait des processus sous l'ancienne règle moins sûre.

## 13.5 Invariants

### 1. Comprendre simplement

Un **invariant** (*invariant*) est une **propriété qui doit toujours rester vraie**, quoi qu'il arrive : quels que soient la configuration, l'utilisateur, l'ordre des opérations ou les pannes. Le plan le formule ainsi : *ce qui ne doit jamais être faux*. Un système générique doit savoir exprimer ces propriétés, et les faire respecter.

**Pourquoi cela existe.** Une plateforme configurable laisse beaucoup de liberté. Sans garanties, cette liberté suffit à produire des états absurdes : une ressource sans tenant, une réservation en double, une demande approuvée par son auteur. Les invariants fixent les limites que la liberté ne franchit pas.

**Problème résolu.** Maintenir la cohérence et la confiance dans les données, indépendamment des configurations et des chemins d'accès.

**Modèle mental.** Les lois de la physique pour un jeu vidéo. Le concepteur du niveau peut placer ce qu'il veut, mais personne ne traverse un mur plein. Le moteur ne l'autorise pas.

**Où l'analogie s'arrête.** Les lois d'un moteur de jeu sont les mêmes pour tous. Les invariants d'une plateforme ont plusieurs niveaux : certains sont imposés à tous, d'autres sont choisis par un tenant, d'autres viennent du domaine métier.

**Exemple.** Quatre invariants cités par le plan : « une ressource appartient à un tenant » ; « un utilisateur ne peut pas approuver sa propre demande » ; « une réservation ne peut pas chevaucher une autre » ; « une ressource archivée ne peut pas être allouée ».

**Les composants.**

1. une **expression** de l'invariant, déclarative ;
2. un ou plusieurs **points d'application** : base, moteur, politique ;
3. un **niveau** : plateforme, tenant, domaine ;
4. une **vérification** : tests, contrôles périodiques ;
5. un **traitement des violations** : refus, alerte, réparation.

**Objectif d'apprentissage :** vous pouvez formuler un invariant, choisir où le faire respecter, et expliquer pourquoi la concurrence et la configuration le mettent à l'épreuve.

### 2. Connaissances essentielles

#### Définition

**Invariant** : propriété d'un système ou de ses données qui doit être vraie avant et après toute opération, dans tous les états observables.

#### Idées fondamentales

1. **Un invariant s'exprime comme une propriété vérifiable.** « Pour toute réservation, aucune autre n'occupe la même ressource sur la même période. »
2. **Il s'applique au plus bas niveau capable de le faire respecter.** Une contrainte de base vaut mieux qu'un contrôle d'interface.
3. **Il se défend en profondeur.** Interface, API, moteur, base : plusieurs couches, chacune avec son rôle.
4. **Il existe à plusieurs niveaux.** Plateforme (non configurable), tenant (choisi), domaine (métier).
5. **La concurrence est son principal ennemi.** « Vérifier puis agir » n'est pas atomique.
6. **Une configuration ne doit jamais pouvoir le rompre.** La validation de configuration vérifie la préservation des invariants.
7. **On le vérifie aussi après coup.** Des contrôles périodiques détectent les violations qui auraient échappé à l'application.

#### Vocabulaire essentiel

- **Contrainte** (*constraint*) : forme d'invariant exprimée dans le schéma (unicité, clé étrangère, vérification).
- **Précondition, postcondition** (*precondition*, *postcondition*) : conditions avant et après une opération.
- **Garde** (*guard*) : condition qui autorise ou refuse une transition (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).
- **Séparation des tâches** (*separation of duties*) : invariant qui interdit qu'une même personne cumule deux rôles incompatibles.
- **Contrôle de cohérence** (*consistency check*) : vérification périodique que les invariants sont respectés.
- **Violation** : état où un invariant est faux.
- **Réparation** (*repair*) : opération qui ramène le système à un état valide.

#### Relations de cause à effet

- L'invariant n'existe que dans l'interface. Un import ou un appel d'API le contourne, et des données invalides entrent.
- L'invariant est vérifié par « lire puis écrire » sans protection. Deux requêtes simultanées passent le test et le violent ensemble.
- Une règle de tenant peut désactiver un invariant de plateforme. Une erreur d'un tenant compromet la sécurité de tous.
- Les données existantes violent un nouvel invariant. Son activation bloque des opérations légitimes sur des enregistrements anciens.

#### Idées reçues

- **« Un invariant est une validation de formulaire. »** Une validation de formulaire est une aide. Un invariant tient quelle que soit la voie d'entrée.
- **« La base de données suffit. »** Elle exprime bien les contraintes locales. Les invariants sur plusieurs ressources, sur des états ou sur des droits demandent aussi le moteur.
- **« Plus d'invariants, plus de sûreté. »** Un invariant trop rigide empêche des cas métier légitimes. Il faut distinguer ce qui ne doit jamais arriver de ce qui est seulement déconseillé.

#### Principe clé

Un invariant est une propriété exprimée explicitement, appliquée au plus bas niveau possible, protégée contre la concurrence et la configuration, et vérifiée en continu.

#### Si vous ne retenez que trois choses

1. Un invariant est une propriété qui doit toujours être vraie, quelle que soit la voie d'entrée.
2. On l'applique au plus bas niveau capable de le garantir, en profondeur.
3. La concurrence et la configuration sont ses deux risques principaux.

### 3. Explication technique détaillée

#### Les niveaux d'invariants

| Niveau | Exemple | Configurable ? | Responsable |
|---|---|---|---|
| Plateforme | Chaque ressource appartient à un tenant ; l'audit est complet | Non | L'éditeur |
| Sécurité | Un utilisateur n'approuve pas sa propre demande | Non, ou très encadré | L'éditeur |
| Tenant | Un constat critique exige une approbation | Oui, par le tenant | L'administrateur du tenant |
| Domaine | Un aéronef retiré ne peut pas être affecté à un vol | Selon le modèle métier | Le concepteur du domaine (voir [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat)) |

#### Les familles d'invariants

| Famille | Exemple | Où l'exprimer |
|---|---|---|
| Structurel | La ressource a un tenant ; un champ obligatoire est présent | Schéma, moteur (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)) |
| Référentiel | La ressource référencée existe, et appartient au même tenant | Clé étrangère composite (voir [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère)) |
| État | Une ressource archivée ne peut pas être allouée | Gardes de transitions (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) |
| Relationnel | Deux réservations ne se chevauchent pas | Contrainte d'exclusion (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)) |
| Quantitatif | Le stock ne devient pas négatif | Vérification en base, transaction |
| Autorisation | Séparation des tâches | Politique et moteur (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) |
| Temporel | Deux versions d'une règle ne sont pas valides au même instant | Intervalles exclusifs (voir [13.6 Modélisation temporelle](#136-modélisation-temporelle)) |

#### Les exprimer comme des données

```json
{
  "invariants": [
    { "key": "resource_has_tenant", "applies_to": "*",
      "assert": "resource.tenant_id is not null", "level": "platform", "configurable": false },
    { "key": "no_self_approval", "applies_to": "approval",
      "assert": "approval.approver != approval.requester", "level": "security", "configurable": false },
    { "key": "no_booking_overlap", "applies_to": "booking",
      "assert": "no_overlap(booking.resource, booking.period)", "level": "domain" },
    { "key": "archived_not_allocatable", "applies_to": "allocation",
      "assert": "allocation.resource.status != 'archived'", "level": "domain" }
  ]
}
```

Exprimés comme des données, les invariants peuvent être **listés**, **testés**, **expliqués** (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) et **vérifiés** contre toute nouvelle configuration.

#### La défense en profondeur

```text
interface       aide : empêche l'erreur courante, explique
API et moteur   applique : règles, états, droits, séparation des tâches
base de données garantit : types, clés, unicité, exclusion, vérifications
contrôle périodique détecte : ce qui a échappé aux trois premiers
```

Chaque couche a un rôle différent. L'interface améliore l'expérience, le moteur applique les règles métier, la base garantit ce qui peut être exprimé comme contrainte, et le contrôle périodique détecte les violations résiduelles.

#### Un exemple de contrainte en base

Une réservation ne peut pas chevaucher une autre sur la même ressource. La base le garantit de façon atomique, y compris sous concurrence (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)) :

```sql
ALTER TABLE booking
  ADD CONSTRAINT no_booking_overlap
  EXCLUDE USING gist (
    tenant_id   WITH =,
    resource_id WITH =,
    period      WITH &&
  );
```

Un test d'application préalable (« existe-t-il déjà une réservation ? ») est utile à l'expérience, mais **seule la contrainte** garantit l'invariant : deux requêtes simultanées peuvent passer le test, et seule l'une d'elles passera la contrainte.

#### La concurrence

| Technique | Principe | Convient à |
|---|---|---|
| Contrainte en base | La base refuse la deuxième écriture | Unicité, exclusion, valeurs bornées |
| Verrouillage optimiste | Version de la ressource, refus si elle a changé (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)) | Modification d'une ressource |
| Transaction sérialisable | Les transactions se comportent comme si elles étaient séquentielles | Invariants sur plusieurs lignes |
| Saga et compensation | Étapes locales, compensation en cas d'échec (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)) | Invariants entre services : cohérence à terme |

Un invariant qui traverse plusieurs services ne peut pas être garanti à chaque instant. On vise alors une **cohérence à terme** avec détection et compensation, et on le dit explicitement.

#### Vérifier un invariant

- **Tests de propriétés** : générer des séquences d'opérations aléatoires, vérifier que l'invariant tient après chacune.
- **Assertions d'exécution** : le moteur vérifie ses propres invariants et lève une alerte en cas de violation.
- **Contrôles périodiques** : une requête de cohérence détecte les états invalides.

```sql
-- Contrôle périodique : aucune ressource sans tenant, aucune allocation d'une ressource archivée
SELECT a.id
FROM allocation a
JOIN resource r ON r.id = a.resource_id AND r.tenant_id = a.tenant_id
WHERE r.status = 'archived';
```

Un contrôle qui trouve des lignes déclenche une alerte (voir [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)) et une réparation par opération de maintenance (voir [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime)).

#### Les invariants et la configuration

La validation d'une nouvelle configuration vérifie qu'elle **préserve** les invariants (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)) :

- une règle de tenant ne peut pas désactiver un invariant de plateforme ;
- un nouveau workflow ne crée pas d'état d'où l'on ne peut plus sortir si l'invariant l'interdit ;
- un nouvel invariant est **simulé** sur les données existantes avant activation : combien d'enregistrements le violent déjà ?

#### Les modes de défaillance

- **L'invariant seulement dans l'interface.**
- **Le contrôle « vérifier puis agir »** sans protection de concurrence.
- **Des invariants contradictoires** : deux règles dont aucune opération ne peut satisfaire les deux.
- **Un invariant activé sur des données qui le violent déjà.**
- **Des invariants dispersés** : la même règle codée à trois endroits, avec trois variantes.
- **Des invariants confondus avec des préférences** : tout est « interdit », rien n'est flexible.

**Contre-exemple.** Une application vérifie en code qu'aucune réservation ne chevauche une autre, puis insère. Deux planificateurs réservent le même hangar au même moment : les deux requêtes passent le test, les deux insertions réussissent. Le planning contient deux avions dans le même hangar, et personne ne le sait avant le jour de l'arrivée.

**Limites.** Tout invariant ne s'exprime pas comme une contrainte de base. Ceux qui dépendent de plusieurs services ou de règles évolutives s'appuient sur le moteur et la cohérence à terme. Les invariants ont aussi un coût de performance (vérifications, verrous) : on les réserve à ce qui doit vraiment ne jamais être faux.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère) et [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) | Clés, contraintes et intégrité référentielle sont les invariants du niveau données |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Les gardes de transitions expriment les invariants d'état |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | La séparation des tâches est un invariant d'autorisation |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Transactions et verrouillage optimiste protègent les invariants sous concurrence |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | La saga traite les invariants distribués |
| [13.2 Configuration versus code](#132-configuration-versus-code) | Les invariants de plateforme restent hors de la configuration |
| [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | La configuration sûre vérifie qu'ils sont préservés |
| [14.5 Agrégat et racine d'agrégat](14-domain-driven-design.md#145-agrégat-et-racine-dagrégat) | Dans le DDD, l'agrégat est la frontière de cohérence qui garantit les invariants du domaine |

### 5. Application pratique

**Situation initiale.** Un tenant configure un workflow d'approbation de constats. Une règle de tenant permet à l'auteur du constat d'approuver lui-même les constats de gravité faible, « pour aller plus vite ». Un audit externe exige la séparation des tâches pour tous.

**Problème.** La configuration du tenant entre en conflit avec une exigence de sécurité de la plateforme.

**Application du concept.** Un invariant de sécurité imposé par la plateforme.

**Déroulé.**

1. L'invariant `no_self_approval` est déclaré au niveau « sécurité », non configurable.
2. Lors de la publication de la règle du tenant, la **validation** détecte qu'elle autoriserait l'auto-approbation. La publication est refusée, avec le message « Cette règle contredit l'invariant `no_self_approval` ».
3. Le moteur applique aussi l'invariant à l'exécution, par défense en profondeur : une demande d'approbation par l'auteur est refusée avec la raison « Séparation des tâches » (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).
4. Un contrôle périodique vérifie l'absence d'approbations où `approver = requester`.
5. Le tenant obtient la rapidité voulue autrement : une approbation par n'importe quel autre membre de l'équipe qualité, sans file d'attente centralisée.

**Résultat.** L'invariant tient, et le tenant gagne en rapidité par une règle légitime.

**Limites.** Un invariant non configurable limite des demandes légitimes de certains clients. Si les exceptions deviennent fréquentes, il faut distinguer deux niveaux d'exigence (par exemple selon la réglementation applicable), pas ouvrir un réglage global.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un invariant ? Donnez un exemple tiré du plan.
2. **Compréhension.** Quels sont les niveaux d'invariants, et lesquels sont configurables ?
3. **Compréhension.** Pourquoi le contrôle « vérifier puis agir » ne garantit-il pas un invariant ?
4. **Pourquoi.** Pourquoi applique-t-on un invariant au plus bas niveau capable de le garantir ?
5. **Raisonnement pratique.** Vous voulez activer un nouvel invariant « un aéronef retiré ne peut pas avoir de tâche ouverte ». Que faites-vous avant de l'activer ?

#### Réponses

1. C'est une propriété qui doit toujours être vraie. Exemple du plan : « un utilisateur ne peut pas approuver sa propre demande », ou « une réservation ne peut pas chevaucher une autre ».
2. Plateforme et sécurité (non configurables), tenant (choisi par l'administrateur), domaine (défini par le modèle métier, selon les cas). Les invariants de plateforme et de sécurité protègent tous les tenants.
3. Parce que deux requêtes simultanées peuvent passer toutes deux le test avant que l'une écrive. Seule une contrainte atomique (base de données, transaction sérialisable, verrouillage) empêche la violation.
4. Parce qu'un niveau plus bas s'applique à toutes les voies d'entrée (interface, API, import, scripts), alors qu'un niveau plus haut peut être contourné.
5. Je le simule sur les données existantes pour compter les violations (aéronefs retirés avec tâches ouvertes), je prévois une migration ou une réparation, je vérifie que les workflows existants le respectent, puis je l'active avec un contrôle périodique et une alerte.

## 13.6 Modélisation temporelle

### 1. Comprendre simplement

La **modélisation temporelle** (*temporal modeling*) consiste à **représenter explicitement le temps** dans le modèle de données et de configuration, pour que la plateforme sache ce qui est vrai **maintenant**, ce qui l'était **dans le passé**, ce qui le sera **dans le futur**, et ce qui était **connu** à une date donnée. Le plan résume : *NOW, PAST, FUTURE*.

**Pourquoi cela existe.** Les processus réels sont temporels. Une réglementation change à une date précise. Un contrat a une période de validité. Un accès expire. Une inspection est planifiée. Un audit demande qui était autorisé le 3 mars. Une correction s'applique rétroactivement. Sans modèle du temps, la plateforme écrase le passé, ne sait pas préparer le futur, et atteint vite ses limites dès que les clients ont des processus complexes.

**Problème résolu.** Représenter, interroger et planifier l'état des données et de la configuration à n'importe quel instant, et traiter les corrections.

**Modèle mental.** Un agenda et un registre comptable. L'agenda montre ce qui est prévu (le futur). Le registre conserve ce qui s'est passé (le passé), sans jamais l'effacer : une erreur se corrige par une écriture de correction, avec sa date.

**Où l'analogie s'arrête.** Un registre n'a qu'une chronologie, celle de l'écriture. Une plateforme doit distinguer deux dates : **quand le fait est vrai** dans le monde, et **quand le système l'a su**.

**Exemple.** Une réglementation fait passer l'intervalle d'inspection des A320 de 90 à 60 jours le 1er novembre 2026. L'administrateur saisit la nouvelle valeur en septembre, avec une **date d'effet** au 1er novembre. Le système applique 90 jours jusque-là, puis 60 jours, sans intervention. En mars 2027, un auditeur demande l'intervalle applicable à l'inspection du 15 octobre : 90 jours.

**Les composants.**

1. des **instants** et des **intervalles** de validité ;
2. la **date d'effet** et l'**expiration** ;
3. la **planification** ;
4. l'**état historique** et la **version à l'instant T** ;
5. la **configuration future** ;
6. les **fuseaux horaires** et les calendriers ;
7. la distinction entre **temps de validité** et **temps de transaction**.

**Objectif d'apprentissage :** vous pouvez représenter une valeur qui change avec le temps, interroger son état à une date donnée, planifier un changement, et expliquer la différence entre date d'effet et date d'enregistrement.

### 2. Connaissances essentielles

#### Définition

**Modélisation temporelle** : ensemble de techniques qui représentent le temps dans un modèle de données, pour connaître l'état d'un fait ou d'une configuration à un instant donné, programmer ses changements et conserver son historique, y compris les corrections.

#### Idées fondamentales

1. **On distingue l'instant et l'intervalle.** Un événement a un instant. Un fait a une période de validité.
2. **Un fait a une validité.** Elle va d'un début à une fin, de préférence en intervalle semi-ouvert.
3. **On n'écrase pas le passé.** On ajoute une nouvelle version avec ses dates.
4. **La date d'effet n'est pas la date d'enregistrement.** Le système sépare ce qui était vrai et ce qu'il savait.
5. **Le futur se prépare sans effet immédiat.** Une configuration future est validée, approuvée, puis activée à sa date.
6. **Chaque décision porte la version utilisée.** Elle peut être rejouée avec la version à l'instant T.
7. **Le temps est un contexte.** Fuseaux, calendriers, horloge unique : « maintenant » est lu une seule fois par décision.

#### Vocabulaire essentiel

- **Date d'effet** (*effective date*) : instant à partir duquel une valeur ou une version s'applique.
- **Expiration** (*expiration*) : instant à partir duquel un droit, une valeur ou une exception cesse d'être valable.
- **Validité** (*validity*) : période pendant laquelle un fait est vrai ou une version s'applique.
- **Planification** (*scheduling*) : programmation d'une action ou d'un changement à une date, ou de façon récurrente.
- **État historique** (*historical state*) : état d'une ressource à une date passée.
- **Configuration future** (*future configuration*) : configuration validée, qui s'appliquera à une date à venir.
- **Version à l'instant T** (*version at time T*) : version d'une donnée ou d'une configuration qui était active à l'instant T.
- **Temps de validité** (*valid time*) : moment où le fait est vrai dans le monde.
- **Temps de transaction** (*transaction time*) : moment où le système a enregistré le fait.
- **Intervalle semi-ouvert** : intervalle qui inclut son début et exclut sa fin, noté $[d, f)$.

#### Relations de cause à effet

- Une valeur est écrasée par une nouvelle. Le passé disparaît, et un audit ne peut plus répondre à « qu'est-ce qui s'appliquait ? ».
- Les heures sont stockées en heure locale sans fuseau. Les décisions se décalent au changement d'heure ou quand l'utilisateur voyage.
- Une planification vit en mémoire. Elle est perdue au redémarrage, et le changement n'a pas lieu.
- Une correction rétroactive est enregistrée comme une modification ordinaire. Les décisions passées deviennent inexplicables.
- « Maintenant » est lu à plusieurs endroits d'un même traitement. Les parties de la décision se réfèrent à des instants différents.

#### Idées reçues

- **« Un champ date de modification suffit. »** Il dit quand quelque chose a changé, pas quelle était l'ancienne valeur, ni sa période de validité.
- **« L'historique, c'est le journal d'audit. »** Le journal enregistre les changements. L'état historique permet de reconstituer la vérité à une date (voir [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence)). Les deux se complètent.
- **« Une configuration future est un brouillon. »** Un brouillon n'a pas de date. Une configuration future est validée, approuvée et datée.
- **« Les dates sont simples. »** Fuseaux, changements d'heure, jours ouvrés, mois de longueurs différentes : les erreurs sont fréquentes.

#### Principe clé

Chaque fait et chaque version de configuration ont une période de validité explicite et une date d'enregistrement ; le passé ne s'écrase pas, le futur se prépare, et chaque décision cite la version utilisée.

#### Si vous ne retenez que trois choses

1. Un fait a une validité, en intervalle semi-ouvert ; on n'écrase pas le passé.
2. La date d'effet (valide dans le monde) se distingue de la date d'enregistrement (connue du système).
3. La version à l'instant T, tracée avec chaque décision, permet de la rejouer et de l'expliquer.

### 3. Explication technique détaillée

#### Les axes du temps

| Axe | Question | Exemple |
|---|---|---|
| Temps de validité | Quand le fait est-il vrai dans le monde ? | L'intervalle est de 60 jours à partir du 1er novembre |
| Temps de transaction | Quand le système l'a-t-il enregistré ? | Saisi le 12 septembre |
| Temps de traitement | Quand l'évaluation a-t-elle lieu ? | Évalué le 15 octobre, à 08:42 |

La plupart des besoins se satisfont du seul temps de validité. Le temps de transaction devient nécessaire dès que l'on corrige le passé et que l'on doit pouvoir dire ce que l'on savait.

#### Les intervalles de validité

On représente la période d'une valeur par un **intervalle semi-ouvert** $[d, f)$ : le début est inclus, la fin est exclue. Deux versions consécutives partagent alors la même borne, sans chevauchement ni trou.

| version | intervalle_jours | valid_from | valid_to |
|---|---|---|---|
| 1 | 90 | 2025-01-01 | 2026-11-01 |
| 2 | 60 | 2026-11-01 | (ouvert) |

```sql
SELECT interval_days
FROM inspection_interval
WHERE tenant_id = :tenant
  AND aircraft_type = :type
  AND valid_from <= :instant
  AND (valid_to IS NULL OR :instant < valid_to);
```

Une **contrainte d'exclusion** empêche deux versions de se chevaucher pour un même type (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle) et [13.5 Invariants](#135-invariants)). Les types d'intervalles et l'opérateur de chevauchement de certains moteurs relationnels expriment cette contrainte directement.

**Quel instant utiliser ?** C'est une décision de conception, et elle doit être explicite. L'intervalle applicable à une inspection est celui qui valait **à la date de l'inspection**, pas celui d'aujourd'hui. Chaque évaluation reçoit donc l'instant de référence (`as_of`) en paramètre.

#### La bitemporalité

Quand on corrige le passé, il faut deux axes : ce qui était vrai (temps de validité) et ce que l'on savait (temps de transaction).

**Scénario.** Le 20 octobre 2026, on constate que l'intervalle des A320 était de 75 jours depuis le 1er septembre, par application rétroactive d'une directive.

| ligne | intervalle_jours | valid_from | valid_to | recorded_from | recorded_to |
|---|---|---|---|---|---|
| 1 | 90 | 2025-01-01 | (ouvert) | 2025-01-01 | 2026-10-20 |
| 2 | 90 | 2025-01-01 | 2026-09-01 | 2026-10-20 | (ouvert) |
| 3 | 75 | 2026-09-01 | (ouvert) | 2026-10-20 | (ouvert) |

La ligne 1 n'est pas supprimée : elle est **close dans le temps de transaction** à la date de la correction. Deux questions donnent deux réponses :

| Question | Réponse |
|---|---|
| Quel intervalle valait le 15 septembre, **tel que connu le 10 octobre** ? | 90 jours (ligne 1) |
| Quel intervalle valait le 15 septembre, **tel que connu aujourd'hui** ? | 75 jours (ligne 3) |

La première reconstitue une décision passée avec ce que l'on savait à l'époque. La seconde donne la vérité corrigée.

#### La date d'effet et la configuration future

Une version de configuration porte sa date d'effet (voir [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime)).

```text
brouillon ─► validation ─► simulation à la date T ─► approbation ─► publication (effective_from = T)
                                                                        │
                                       jusqu'à T : version actuelle ◄───┘
                                       à partir de T : nouvelle version, activée automatiquement
```

- **Aperçu à une date future.** On évalue la configuration à venir sur les données d'aujourd'hui : « au 1er novembre, 7 aéronefs dépasseront leur nouvelle échéance » (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).
- **Lots.** Plusieurs changements liés ont la même date d'effet et s'activent ensemble (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)).
- **Annulation.** Une configuration future peut être retirée avant sa date, sans effet.

#### L'expiration

| Objet | Mécanisme | Voir |
|---|---|---|
| Délégation temporaire de droits | Date de fin du droit | [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) |
| Clé d'API | Durée de vie limitée, rotation | [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi) |
| Jeton de session | Expiration et renouvellement | [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton) |
| Exception à une règle | Date d'expiration obligatoire | [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) |
| Promotion, quota temporaire | Période d'application | [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) |

Quelques règles :

- **Vérifier à l'usage.** On contrôle l'expiration au moment de l'évaluation. Une tâche de nettoyage seule laisserait l'accès actif entre l'expiration et le passage de la tâche.
- **Prévenir avant.** Une notification annonce l'expiration prochaine (voir [12.10 Notifications](12-produit-ux.md#1210-notifications)).
- **Prévoir le renouvellement.** Un parcours simple, avec approbation si nécessaire.
- **Choisir entre expiration douce et dure.** Une période de grâce, ou un arrêt net.

#### La planification

| Type | Exemple |
|---|---|
| Ponctuelle | Activer la nouvelle règle le 1er novembre à 00:00 |
| Récurrente | Revue d'inspection chaque lundi à 07:30 |
| Relative | Relancer 3 jours après une demande sans réponse |
| Conditionnelle | Dès que toutes les tâches sont closes |

```json
{
  "schedule": "weekly_inspection_review",
  "recurrence": { "rrule": "FREQ=WEEKLY;BYDAY=MO", "at": "07:30", "timezone": "Europe/Paris" },
  "calendar": "alpha_air_business_days",
  "on_missed": "run_once",
  "action": { "type": "start_workflow", "workflow": "inspection_review" }
}
```

- La **règle de récurrence** reprend le vocabulaire de la norme iCalendar (RFC 5545, `RRULE`).
- Le **planificateur est durable** : les tâches sont persistées et survivent aux redémarrages (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).
- Les traitements sont **idempotents** : une exécution rejouée ne duplique rien (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- `on_missed` précise la politique après une interruption : rattraper chaque occurrence manquée, n'exécuter qu'une fois, ou ignorer.
- On **étale** les exécutions pour éviter une pointe à minuit (« troupeau tonitruant »).

#### Fuseaux horaires et horloges

- **On stocke les instants en UTC**, avec le fuseau du tenant ou de l'utilisateur pour l'affichage et la récurrence en heure locale.
- **Une date n'est pas un instant.** « L'échéance est le 1er novembre » est une date de calendrier du tenant, pas un instant à la seconde près.
- **Les changements d'heure existent.** À la bascule de printemps, 02:30 n'existe pas ; à la bascule d'automne, 02:30 existe deux fois. Une planification en heure locale doit gérer les deux cas.
- **Une horloge unique.** Les serveurs se synchronisent sur une source de temps commune, et les décisions utilisent le temps du serveur, pas celui du client.
- **« Maintenant » est lu une fois.** Il est passé en paramètre à tous les sous-calculs d'une décision. Cela rend la décision cohérente, testable avec une fausse horloge et rejouable.

#### La version à l'instant T dans la pratique

Pour expliquer ou rejouer une décision passée, il faut conserver avec elle :

```json
{
  "decision_id": "dec_20261015_0042",
  "evaluated_at": "2026-10-15T08:42:17Z",
  "as_of": "2026-10-15T08:42:17Z",
  "config_version": 41,
  "rule": "inspection_interval",
  "inputs": { "aircraft_type": "A320", "last_inspection": "2026-08-20" },
  "result": { "interval_days": 90, "next_inspection_date": "2026-11-18" }
}
```

Avec `config_version` et les entrées, on retrouve la décision. Avec l'état historique des données, on la rejoue (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) et [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)).

#### Choisir une technique

| Technique | Principe | Avantages | Limites |
|---|---|---|---|
| Intervalles dans la table | Colonnes de début et de fin de validité | Simple, lisible, contraintes d'exclusion | Les corrections demandent le temps de transaction |
| Table d'historique | Révisions successives (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) | Audit naturel | Requêtes « à la date » plus lourdes |
| Tables temporelles du SGBD | Historique géré par la base, selon les possibilités du produit et la norme SQL:2011 | Moins de code | Dépend du produit, moins de contrôle |
| Sourcing d'événements | L'historique est la donnée (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)) | Rejeu complet | Complexité élevée |

#### Les modes de défaillance

- **L'écrasement** des valeurs, sans historique.
- **Des heures locales sans fuseau.**
- **Des intervalles qui se chevauchent** ou laissent des trous.
- **Une planification volatile**, perdue au redémarrage.
- **Un « maintenant » lu plusieurs fois** dans la même décision.
- **Une correction rétroactive non tracée.**
- **Une expiration vérifiée seulement par une tâche de fond.**
- **Des calendriers ignorés** : jours ouvrés, jours fériés propres à un tenant.

**Contre-exemple.** Une plateforme stocke l'intervalle d'inspection dans un seul champ du type d'aéronef. La réglementation change : l'administrateur écrase la valeur. Toutes les échéances recalculées reculent ou avancent d'un coup, y compris pour des inspections déjà réalisées sous l'ancienne règle. Trois mois plus tard, l'autorité demande pourquoi une inspection a été jugée « conforme » : plus personne ne peut dire quel intervalle s'appliquait.

**Limites.** La bitemporalité alourdit le modèle, les requêtes et le stockage : on la réserve aux données où la correction rétroactive a un sens (réglementation, contrats, droits). L'historique immuable entre en tension avec le droit à l'effacement (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)). Les décisions rejouées exigent que les données utilisées aient été conservées.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) et [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence) | Les révisions et les instantanés fournissent l'état historique |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement de configuration fournit la version à l'instant T et les lots datés |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Une exception porte une date d'expiration |
| [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision) | Les tables de décision ont des dates d'effet |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) et [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les tâches planifiées et leur idempotence mettent en œuvre la planification |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) | Le sourcing d'événements conserve l'historique complet |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | La délégation de droits est temporaire |
| [13.4 Plan de contrôle versus runtime](#134-plan-de-contrôle-versus-runtime) | La date d'effet gouverne l'activation d'une configuration |
| [13.5 Invariants](#135-invariants) | Les intervalles de validité utilisent des invariants d'exclusion |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | La simulation à une date future éclaire l'impact d'un changement |

### 5. Application pratique

**Situation initiale.** Une directive réduit l'intervalle d'inspection des A320 de 90 à 60 jours à compter du 1er novembre 2026. Le tenant compte 18 A320.

**Problème.** Appliquer la valeur immédiatement rendrait des aéronefs « en retard » trop tôt et fausserait des décisions passées. Attendre le 1er novembre pour saisir la valeur risque d'oublier ou de retarder.

**Application du concept.** Une configuration future avec date d'effet.

**Déroulé.**

1. L'administrateur crée en septembre une nouvelle version de la règle d'intervalle : 60 jours, avec `effective_from = 2026-11-01`.
2. La plateforme **simule** la règle à cette date sur les données actuelles : 7 aéronefs auraient dépassé leur échéance au 1er novembre. Le responsable qualité décide de planifier ces inspections en octobre.
3. La version passe par la revue et l'approbation (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).
4. Jusqu'au 31 octobre, les évaluations utilisent la version à 90 jours. Le 1er novembre à 00:00 (heure du tenant), la version à 60 jours s'applique, sans intervention.
5. Chaque calcul d'échéance conserve la version utilisée. En mars 2027, l'auditeur demande l'intervalle pour l'inspection du 15 octobre : la décision porte `config_version = 41`, 90 jours.
6. Le 20 octobre, la directive est corrigée rétroactivement au 1er septembre : une nouvelle ligne est enregistrée avec le temps de transaction, sans effacer l'ancienne.

**Résultat.** Le changement s'applique à la date prévue, sans intervention. Le passé reste explicable, et la correction rétroactive est tracée.

**Limites.** Si des échéances ont déjà été notifiées sous l'ancienne règle, il faut décider si on les recalcule : c'est une décision métier, pas un détail technique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre la date d'effet et la date d'enregistrement ?
2. **Compréhension.** Pourquoi utilise-t-on des intervalles semi-ouverts ?
3. **Compréhension.** Que signifie « version à l'instant T » et comment la retrouve-t-on ?
4. **Pourquoi.** Pourquoi vérifier une expiration au moment de l'usage et non seulement par une tâche de nettoyage ?
5. **Raisonnement pratique.** Une correction enregistrée le 20 octobre indique que l'intervalle était de 75 jours depuis le 1er septembre. Quel intervalle un audit doit-il retrouver pour le 15 septembre, selon qu'il demande « ce que l'on savait le 10 octobre » ou « la vérité aujourd'hui » ?

#### Réponses

1. La date d'effet est le moment où le fait est vrai (ou s'applique) dans le monde. La date d'enregistrement est le moment où le système l'a connu. Elles diffèrent quand on corrige le passé ou qu'on prépare l'avenir.
2. Parce que deux versions consécutives partagent la même borne : la fin de l'une est le début de la suivante. Il n'y a ni chevauchement ni trou, et une contrainte d'exclusion peut le garantir.
3. C'est la version de la donnée ou de la configuration qui était active à l'instant T. On la retrouve par l'intervalle de validité, et en conservant dans chaque décision la version utilisée, l'instant de référence et les entrées.
4. Parce qu'une tâche de nettoyage passe à intervalles réguliers : entre l'instant d'expiration et son passage, l'accès resterait actif. Le contrôle au moment de l'usage garantit que l'expiration est immédiate.
5. 90 jours si l'on demande ce que l'on savait le 10 octobre, car la correction n'était pas encore enregistrée. 75 jours si l'on demande la vérité d'aujourd'hui, car la correction rétroactive s'applique à partir du 1er septembre.

## 13.7 Policy as Code

### 1. Comprendre simplement

**Policy as Code** (en français, « politique comme code ») consiste à **exprimer les politiques d'une plateforme sous une forme lisible par une machine**, à les **versionner, tester et relire comme du logiciel**, puis à les faire **évaluer à l'exécution** par un moteur. Le plan en donne le schéma : *politique, lisible par une machine, évaluée à l'exécution*.

**Pourquoi cela existe.** Quand les règles vivent dans des documents, des habitudes et des morceaux de code dispersés, elles se contredisent, elles ne se testent pas, et on ne sait pas quelle règle s'appliquait quand. Les exprimer sous forme structurée permet de les appliquer partout de la même façon, de les auditer et de les faire évoluer en sécurité.

**Problème résolu.** Gouverner de nombreuses règles (droits, validations, conformité, workflows) de façon cohérente, testable et traçable.

**Modèle mental.** Le code de la route. Il est écrit, numéroté, daté et publié. Les agents l'appliquent, et on peut dire quelle version s'appliquait le jour d'une infraction. Un changement de règle suit une procédure, avec une date d'entrée en vigueur.

**Où l'analogie s'arrête.** Le code de la route est interprété par des humains, avec une marge d'appréciation. Une politique évaluée par un moteur est appliquée à la lettre : elle doit être précise, testée et sans ambiguïté.

**Exemple.** Une politique dit : « Un planificateur peut immobiliser un aéronef de sa base, si aucun vol n'est programmé dans les 24 heures. » Elle est écrite dans un langage dédié, relue par un responsable qualité, testée, puis publiée. Le moteur d'autorisation l'évalue pour chaque demande.

**Les composants.**

1. un **langage** de politiques, lisible par une machine ;
2. un **dépôt** versionné de politiques ;
3. un **moteur d'évaluation** (point de décision, voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) ;
4. un **pipeline** : relecture, tests, simulation, publication ;
5. des **journaux de décision** pour expliquer et auditer.

**Objectif d'apprentissage :** vous pouvez décrire le cycle de vie d'une politique, citer les catégories de politiques, et expliquer comment on les teste avant de les publier.

### 2. Connaissances essentielles

#### Définition

**Policy as Code** : pratique qui consiste à exprimer des politiques dans un format structuré et exécutable, géré avec les mêmes outils et pratiques que le code (versions, revue, tests, déploiement), et évalué par un moteur à l'exécution.

#### Idées fondamentales

1. **Une politique est une donnée exécutable.** Elle est structurée, lisible par une machine, évaluée à l'exécution.
2. **Elle suit un cycle de vie logiciel.** Écriture, revue, tests, simulation, publication, surveillance, retour arrière.
3. **Elle est séparée du code applicatif.** On change une règle sans redéployer l'application.
4. **Elle produit des décisions traçables.** Chaque décision cite la politique et la version utilisées.
5. **Elle couvre plusieurs catégories.** Autorisation, validation, conformité, workflow, sécurité, règles métier.
6. **Elle se compose par niveaux.** Plateforme, tenant, équipe, avec une règle de précédence claire.
7. **Elle n'est pas réservée aux développeurs.** Des experts du métier doivent pouvoir la comprendre, la relire et l'approuver.

#### Vocabulaire essentiel

- **Politique** (*policy*) : ensemble de règles qui déterminent une décision (autoriser, refuser, exiger, signaler).
- **Point de décision** (*policy decision point*, *PDP*) : composant qui évalue les politiques.
- **Point d'application** (*policy enforcement point*, *PEP*) : composant qui applique la décision.
- **Point d'information** (*policy information point*, *PIP*) : source des attributs nécessaires à la décision.
- **Journal de décision** (*decision log*) : enregistrement de chaque décision, avec ses entrées et la version de politique.
- **Test de politique** (*policy test*) : cas d'essai qui vérifie qu'une entrée donne la décision attendue.
- **Différence sémantique** (*semantic diff*) : comparaison de deux versions par leurs effets (quelles décisions changent).
- **Précédence** : règle qui détermine quelle politique l'emporte en cas de conflit.

#### Relations de cause à effet

- Les règles sont dispersées dans le code et les documents. Elles se contredisent, et on ne peut pas répondre à « pourquoi cet accès ? ».
- Les politiques ne sont pas testées. Un changement mineur ouvre ou ferme des accès par erreur, sans que personne s'en aperçoive.
- Les politiques sont évaluées par un service distant sans plan de repli. Une panne du service bloque toutes les opérations, ou les laisse passer.
- Les politiques sont écrites uniquement par des développeurs. Les experts du métier ne peuvent ni les relire, ni les contester.

#### Idées reçues

- **« Policy as Code, c'est mettre les règles dans Git. »** Le dépôt est une partie. L'essentiel est le cycle de vie : tests, simulation, évaluation structurée, traçabilité.
- **« C'est un outil d'autorisation. »** L'autorisation n'est qu'une catégorie. Les validations, la conformité et les workflows suivent le même principe.
- **« Une politique en code est plus sûre. »** Elle est plus **vérifiable**. Une politique fausse, bien testée au mauvais endroit, reste fausse.

#### Principe clé

Les politiques sont des artefacts structurés, versionnés et testés, évalués par un moteur dont chaque décision est traçable jusqu'à la politique et à sa version.

#### Si vous ne retenez que trois choses

1. Une politique est lisible par une machine, évaluée à l'exécution, et gérée comme du logiciel.
2. Elle suit un cycle : relecture, tests, simulation, publication progressive, surveillance, retour arrière.
3. Chaque décision cite la politique et la version qui l'ont produite.

### 3. Explication technique détaillée

#### Les catégories de politiques

Le plan en cite six. Elles partagent le même mécanisme et diffèrent par leur point d'évaluation et leur auteur.

| Catégorie | Question | Exemple | Évaluée à |
|---|---|---|---|
| Autorisation (*authorization*) | Cette personne peut-elle faire cette action ? | Un planificateur immobilise les aéronefs de sa base | Chaque requête (voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) |
| Validation (*validation*) | Cette donnée est-elle acceptable ? | L'immatriculation respecte le format du pays | Écriture (voir [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) |
| Conformité (*compliance*) | Cette pratique respecte-t-elle une obligation ? | Un export de données personnelles exige un motif et est journalisé | Opération et contrôle périodique |
| Workflow (*workflow*) | Quel chemin cette demande suit-elle ? | Un constat critique exige l'approbation du responsable qualité | Transition (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) |
| Sécurité (*security*) | Cette situation est-elle sûre ? | Les administrateurs utilisent une authentification multifacteur | Connexion, configuration |
| Règles métier (*business rules*) | Quelle valeur ou décision en découle ? | L'intervalle d'inspection dépend du type d'aéronef | Calcul (voir [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles)) |

#### Les formes de langage

| Forme | Exemples | Atouts | Limites |
|---|---|---|---|
| Structure de données propre à la plateforme | JSON ou YAML (conditions, actions) | Simple, analysable, adaptée à l'interface | Expressivité limitée |
| Langage dédié aux politiques | Rego (Open Policy Agent), Cedar | Expressif, outillé, testable | Apprentissage, intégration |
| Langage d'expressions | CEL (*Common Expression Language*) | Compact, sûr, sans effet de bord | Pas de politique complète seule |
| Relations entre objets | Tuples de relations (modèles inspirés de Zanzibar : OpenFGA, SpiceDB) | Autorisations hiérarchiques à grande échelle (voir [4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac)) | Moins adapté aux conditions complexes |
| Norme historique | XACML (OASIS) | Standardisé | Verbeux, peu utilisé pour de nouveaux projets |

Le choix dépend du public (qui écrit ?), de l'échelle, et des garanties recherchées (analyse, performance).

#### Une politique d'autorisation (pseudo-langage simplifié)

```text
politique « immobiliser_aeronef »
  action  : transition:ground
  autoriser si
      sujet.role = "planner"
      et sujet.base = ressource.base
      et aucun vol de la ressource n'est programmé dans les 24 prochaines heures
  sinon refuser avec la raison « garde_vol_programme »
```

Elle est lisible, structurée, et produit des raisons (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### Le cycle de vie d'une politique

```text
rédaction ─► relecture ─► tests ─► simulation sur décisions réelles ─► approbation
     ─► publication progressive ─► surveillance ─► (retour arrière si besoin)
```

| Étape | Contenu | Voir |
|---|---|---|
| Relecture | Revue par un pair et par un expert du métier | [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) |
| Tests | Cas d'essai positifs et négatifs | ci-dessous |
| Simulation | Rejeu de décisions passées avec la nouvelle politique | [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) |
| Publication progressive | Par palier, par tenant ou par groupe pilote | [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) |
| Surveillance | Taux de refus, latence, alertes | [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) |
| Retour arrière | Version précédente en un geste | [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) |

#### Tester une politique

```yaml
tests:
  - name: le_planificateur_immobilise_un_aeronef_de_sa_base
    input:
      subject: { role: planner, base: LYS }
      action: "transition:ground"
      resource: { type: aircraft, base: LYS, status: active, flights_next_24h: 0 }
    expect: allow

  - name: le_planificateur_ne_peut_pas_immobiliser_un_autre_base
    input:
      subject: { role: planner, base: LYS }
      action: "transition:ground"
      resource: { type: aircraft, base: CDG, status: active, flights_next_24h: 0 }
    expect: deny

  - name: refus_si_vol_programme
    input:
      subject: { role: planner, base: LYS }
      action: "transition:ground"
      resource: { type: aircraft, base: LYS, status: active, flights_next_24h: 1 }
    expect: deny
    reason: garde_vol_programme
```

- **Tests unitaires** : chaque règle a des cas qui l'autorisent et des cas qui la refusent.
- **Tests de non-régression** : un jeu de décisions réelles passées est rejoué, et l'on compare.
- **Différence sémantique** : « avec la nouvelle version, 12 décisions sur 10 000 changent », avec la liste.
- **Analyse automatique** : certains langages (comme Cedar) sont conçus pour permettre d'analyser automatiquement les politiques, par exemple pour vérifier qu'une politique n'ouvre pas un accès donné.

#### Les conflits et la précédence

Plusieurs politiques peuvent s'appliquer à une même demande. On définit à l'avance :

- l'**algorithme de combinaison** : un refus l'emporte sur une autorisation (*deny-overrides*), ou l'inverse (voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) ;
- la **précédence par niveau** : les politiques de la plateforme (garde-fous, voir [13.5 Invariants](#135-invariants)) l'emportent sur celles du tenant, qui l'emportent sur celles d'une équipe ;
- la **détection de conflits** à la publication : deux politiques qui se contredisent.

#### Performance et disponibilité

- **Évaluation locale** (bibliothèque ou service voisin) plutôt que distante, sur le chemin critique.
- **Données d'attributs** : leur latence pèse sur la décision. On les met en cache, ou on les transmet avec la requête.
- **Échec fermé** : si la décision ne peut pas être prise (panne, délai dépassé), on refuse, pour les politiques de sécurité.
- **Budget d'évaluation** : plafond de temps et de ressources par décision (voir [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

#### Gouvernance

- Chaque politique a un **propriétaire** : une équipe responsable de son contenu.
- Les **auteurs** et les **approbateurs** sont différents pour les politiques sensibles (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
- Un **catalogue** décrit chaque politique : objet, public, exemples, historique.
- Les **exceptions** sont explicites, datées et temporaires (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).
- Une politique inutilisée ou contradictoire est **retirée**.

#### Le multi-tenant

- **Niveaux** : plateforme, tenant, équipe, avec précédence (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).
- **Isolation** : l'évaluation d'un tenant n'accède qu'à ses politiques et à ses données.
- **Coût** : une politique complexe d'un tenant ne doit pas dégrader les autres (budgets, voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)).
- **Modèles** : la plateforme fournit des politiques types que chaque tenant adapte.

#### Les modes de défaillance

- **La multiplication** : des centaines de politiques que personne ne comprend (*policy sprawl*).
- **Des politiques sans tests** : un changement ouvre des accès.
- **Des conflits non détectés.**
- **Une évaluation lente** sur le chemin critique.
- **Un échec ouvert** : en cas de panne, tout passe.
- **Des auteurs isolés** : les experts métier ne relisent pas.
- **Une dérive** entre la politique écrite et celle qui est appliquée.

**Contre-exemple.** Une équipe décide de remplacer une condition « base de la ressource » par « base de l'utilisateur » dans une politique d'accès, pour corriger un cas. Aucun test n'existe. La condition devient vraie pour tous les utilisateurs qui n'ont pas de base : ils obtiennent l'accès à tout. L'erreur est découverte un mois plus tard, par un audit.

**Limites.** Policy as Code ne dit pas **quelle** politique est bonne : la définition des règles reste une décision métier et juridique. L'écriture en langage dédié a un coût d'apprentissage, d'où l'importance d'interfaces de rédaction accessibles (voir [12.3 UX d'administration](12-produit-ux.md#123-ux-dadministration)). Les langages formels n'éliminent pas les erreurs de spécification : on peut prouver qu'une règle fait ce qui est écrit, pas que ce qui est écrit est ce qu'on voulait.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Le contrôle d'accès par politiques en est l'application la plus connue |
| [4.16 ABAC](04-identite-iam-autorisation.md#416-abac) et [4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac) | ABAC et ReBAC fournissent les modèles d'attributs et de relations |
| [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | Règles métier et moteur de règles sont des politiques d'une autre catégorie |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Versionnement, retour arrière et revue en sont le cycle de vie |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'explicabilité vient des raisons que produit l'évaluation |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre) | Simulation et publication progressive en sont les garde-fous |
| [13.2 Configuration versus code](#132-configuration-versus-code) | Les politiques sont de la configuration traitée comme du code |
| [13.3 Déclaratif versus impératif](#133-déclaratif-versus-impératif) | Elles sont déclaratives par nature |
| [13.5 Invariants](#135-invariants) | Les invariants de plateforme encadrent ce que les politiques peuvent faire |

### 5. Application pratique

**Situation initiale.** Un tenant exporte régulièrement des listes de techniciens avec leurs habilitations. Ces listes contiennent des données personnelles. Le délégué à la protection des données veut que chaque export exige un motif, soit réservé à certains rôles, et soit journalisé.

**Problème.** Aujourd'hui, la règle est une consigne écrite, que les utilisateurs appliquent plus ou moins.

**Application du concept.** Une politique de conformité exprimée comme du code.

**Déroulé.**

1. Le délégué rédige, avec l'administrateur, la politique : « Un export d'un type marqué `contains_personal_data` exige le rôle `quality_manager` ou `dpo` et un motif ».
2. L'équipe écrit les tests : export autorisé avec rôle et motif, refusé sans motif, refusé sans rôle.
3. La **simulation** rejoue les exports des 30 derniers jours : 14 exports auraient été refusés faute de motif. Le délégué décide de communiquer avant l'entrée en vigueur.
4. La politique est approuvée par deux personnes (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)), puis publiée en mode « journal seul » pendant une semaine, avant d'être appliquée.
5. Chaque décision est enregistrée avec la version de politique, et un rapport mensuel est généré pour le délégué.

**Résultat.** La règle est appliquée de façon uniforme, et le délégué peut prouver, pour chaque export, quelle politique s'appliquait et pourquoi il a été autorisé ou refusé.

**Limites.** La politique ne couvre que les exports passant par la plateforme. Une copie d'écran, ou un export autorisé puis diffusé, relève d'autres mesures.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les six catégories de politiques citées par le plan ?
2. **Compréhension.** Quelles étapes composent le cycle de vie d'une politique ?
3. **Compréhension.** À quoi sert une différence sémantique entre deux versions ?
4. **Pourquoi.** Pourquoi une politique de sécurité doit-elle échouer « fermé » en cas de panne du moteur ?
5. **Raisonnement pratique.** Vous modifiez une politique d'accès. Comment vérifiez-vous, avant publication, que vous n'avez pas ouvert d'accès involontaire ?

#### Réponses

1. Autorisation, validation, conformité, workflow, sécurité et règles métier.
2. Rédaction, relecture, tests, simulation sur décisions réelles, approbation, publication progressive, surveillance, et retour arrière si nécessaire.
3. À savoir quelles décisions changent entre deux versions, et pour quelles demandes. Elle révèle des effets que la lecture du texte ne montre pas, par exemple un accès ouvert à tort.
4. Parce que, en cas d'incertitude, refuser est le comportement qui protège : un échec ouvert laisserait passer toutes les demandes pendant la panne, y compris des demandes interdites.
5. Par des tests (cas autorisés et refusés, y compris les cas limites), par la différence sémantique et la simulation sur des décisions réelles passées, par une relecture par un second spécialiste, puis par une publication progressive avec surveillance.

