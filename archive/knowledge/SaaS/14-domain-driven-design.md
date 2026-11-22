# Module 14 — Domain-Driven Design

> **Question directrice.** Comment encapsuler proprement les concepts métier, pour que le modèle reste fidèle au domaine quand le système grossit ?

## Présentation du module

**Objectif.** Le *Domain-Driven Design* (DDD, « conception pilotée par le domaine ») est une approche de modélisation logicielle formulée par Eric Evans dans son ouvrage *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003). Elle propose de construire le logiciel autour d'un **modèle partagé du domaine métier**, élaboré avec les experts du métier, puis exprimé fidèlement dans le code.

**Pourquoi si tard dans le parcours.** Le plan le dit : il faut d'abord comprendre les primitives SaaS et les architectures de plateforme. Ensuite seulement, on peut apprendre à **encapsuler proprement les concepts métier**. Le DDD s'appuie sur ce qui précède : les frontières de service ([1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)), le modèle de données (module 2), les événements (module 7) et les invariants ([13.5 Invariants](13-concepts-transversaux.md#135-invariants)).

**Prérequis.** Les modules 1 à 7, et le concept d'invariant ([13.5 Invariants](13-concepts-transversaux.md#135-invariants)).

**Deux niveaux.** Le DDD distingue la conception **stratégique**, qui découpe le domaine et ses langages, et la conception **tactique**, qui construit le modèle à l'intérieur d'un contexte.

```text
Stratégique   domaine et sous-domaine ─ langage omniprésent ─ contexte délimité
Tactique      entité et objet-valeur ─ agrégat ─ événement de domaine ─ référentiel ─ service de domaine
```

**Deux usages dans ce parcours.**

1. **Pour la plateforme elle-même.** Le code du moteur, de l'identité ou du workflow est un système complexe, et le DDD s'y applique directement.
2. **Pour les domaines des clients.** Un tenant modélise son domaine par la configuration, et les notions du DDD guident cette configuration : où placer la frontière d'une ressource, quel langage employer, quels événements émettre.

La correspondance entre les notions du DDD et les primitives déjà rencontrées guide tout le module.

| Concept du DDD | Équivalent ou appui dans la plateforme |
|---|---|
| Domaine, sous-domaine | Le métier du tenant ; les grands modules de la plateforme |
| Langage omniprésent | Libellés et vocabulaire configurés par le tenant (voir [12.1 Architecture de l'information et navigation](12-produit-ux.md#121-architecture-de-linformation-et-navigation)) |
| Contexte délimité | Module, application ou espace de configuration ; frontière de service (voir [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)) |
| Entité | Ressource : un type, un identifiant, un cycle de vie (voir [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement)) |
| Objet-valeur | Type de champ composite et validé (voir [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ)) |
| Agrégat | Ressource et ses ressources enfants, avec une frontière de transaction (voir [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) et [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)) |
| Événement de domaine | Événement émis par le moteur (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) |
| Référentiel | Couche de persistance du moteur (voir [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique)) |
| Service de domaine | Service du moteur, règle ou extension (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)) |
| Invariant | Garde ou contrainte (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)) |

**Fil rouge.** La compagnie aérienne régionale et sa maintenance, pour tous les exemples.

## Sommaire du module

- [14.1 Domaine et sous-domaine](#141-domaine-et-sous-domaine)
- [14.2 Langage omniprésent](#142-langage-omniprésent)
- [14.3 Contexte délimité](#143-contexte-délimité)
- [14.4 Entité et objet-valeur](#144-entité-et-objet-valeur)
- [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat)
- [14.6 Événement de domaine](#146-événement-de-domaine)
- [14.7 Référentiel](#147-référentiel)
- [14.8 Service de domaine](#148-service-de-domaine)

## 14.1 Domaine et sous-domaine

### 1. Comprendre simplement

Le **domaine** (*domain*) est le **champ d'activité métier** que le logiciel sert : la maintenance aéronautique, la gestion hospitalière, la logistique. Un **sous-domaine** (*subdomain*) est une **partie cohérente** de ce domaine : la planification des inspections, la gestion des pièces, la facturation.

**Pourquoi cela existe.** On ne peut pas modéliser tout un métier avec la même finesse. Certaines parties font la différence d'une organisation. D'autres sont nécessaires mais banales. D'autres encore sont les mêmes partout. Distinguer les sous-domaines permet de **concentrer l'effort** là où il compte, et de **ne pas réinventer** ce qui existe.

**Problème résolu.** Décider où investir (modèle riche, équipe forte) et où acheter, configurer ou simplifier.

**Modèle mental.** Une ville. Le centre historique fait son identité et attire (le cœur). Les réseaux d'eau, d'électricité et de transport sont indispensables, mais ressemblent à ceux de toute ville (le générique). Les services de proximité, propres à la ville, sont utiles sans être distinctifs (le support).

**Où l'analogie s'arrête.** Une ville a un plan stable. Les sous-domaines d'une organisation évoluent : un sous-domaine de support peut devenir le cœur si la stratégie change, et un cœur peut devenir générique quand le marché le standardise.

**Exemple.** Le domaine est la maintenance d'une flotte régionale. Les sous-domaines sont la planification des inspections (cœur), le suivi des constats et de la conformité (cœur), la gestion des pièces (support), l'identité et l'accès (générique) et la facturation interne (générique).

**Les composants.**

1. le **domaine**, c'est-à-dire le problème à résoudre ;
2. les **sous-domaines** qui le composent ;
3. une **classification** : cœur, support, générique ;
4. une **stratégie** par type de sous-domaine ;
5. la distinction entre l'**espace du problème** et l'**espace de la solution**.

**Objectif d'apprentissage :** vous pouvez découper un domaine en sous-domaines, les classer, et en déduire où investir en priorité.

### 2. Connaissances essentielles

#### Définition

- **Domaine** : champ d'activité, avec ses connaissances et ses règles, auquel s'applique le logiciel.
- **Sous-domaine** : partie du domaine qui possède sa propre cohérence, son vocabulaire et ses règles.
- **Domaine cœur** (*core domain*) : sous-domaine qui différencie l'organisation et porte son avantage stratégique.
- **Sous-domaine de support** (*supporting subdomain*) : sous-domaine nécessaire, propre à l'organisation, mais non différenciant.
- **Sous-domaine générique** (*generic subdomain*) : sous-domaine banalisé, identique ou proche chez la plupart des organisations.

#### Idées fondamentales

1. **Le domaine est dans le monde, pas dans le code.** On le découvre avec les experts du métier.
2. **Les sous-domaines se découvrent, ils ne se décrètent pas.** Ils ne suivent pas les couches techniques (base, interface), mais les parties du métier.
3. **Tous les sous-domaines ne se valent pas.** Cœur, support et générique appellent des efforts différents.
4. **Le type oriente la stratégie.** On construit le cœur avec soin, on simplifie le support, on achète ou intègre le générique.
5. **Le cœur est un jugement stratégique, et il change.** Il dépend de l'organisation et du moment.
6. **Le problème précède la solution.** On identifie les sous-domaines avant de choisir les contextes et les services.

#### Vocabulaire essentiel

- **Espace du problème** (*problem space*) : le domaine, ses sous-domaines et leurs règles.
- **Espace de la solution** (*solution space*) : les contextes délimités, modules et services choisis pour y répondre (voir [14.3 Contexte délimité](#143-contexte-délimité)).
- **Expert du domaine** (*domain expert*) : personne qui connaît le métier en profondeur.
- **Atelier de découverte** (*event storming*) : atelier collaboratif où l'on cartographie les événements du métier pour en comprendre les processus et les frontières.
- **Avantage concurrentiel** : ce qui distingue durablement une organisation de ses concurrents.

#### Relations de cause à effet

- Un sous-domaine générique est modélisé comme un cœur. On y investit des mois pour ne produire rien de distinctif.
- Le cœur est sous-investi. On obtient un modèle pauvre, difficile à faire évoluer, précisément là où le métier change le plus.
- Le découpage suit les couches techniques. Chaque changement métier traverse toutes les couches et toutes les équipes.
- Les sous-domaines ne sont pas explicités. Chacun décide « à l'instinct » où soigner la conception, et les choix se contredisent.

#### Idées reçues

- **« Le cœur, c'est ce qui est le plus technique. »** C'est ce qui différencie stratégiquement l'organisation, pas ce qui est difficile à programmer.
- **« Un sous-domaine égale un microservice. »** Le sous-domaine appartient au problème. Le service est une solution parmi d'autres.
- **« Il faut tout modéliser en DDD. »** Le DDD tactique vaut pour la complexité du cœur. Pour le reste, un modèle simple suffit.

#### Principe clé

On découpe le métier en sous-domaines, on identifie ceux qui différencient l'organisation, et l'on investit en conséquence, en simplifiant ou en achetant le reste.

#### Si vous ne retenez que trois choses

1. Le domaine est le problème métier, et les sous-domaines en sont les parties cohérentes.
2. On distingue le cœur (différenciant), le support (nécessaire) et le générique (banalisé).
3. La classification décide de l'effort : construire avec soin, simplifier, acheter.

### 3. Explication technique détaillée

#### Du domaine aux sous-domaines

```text
Domaine : maintenance d'une flotte régionale
├─ Planification des inspections         ← cœur
├─ Suivi des constats et conformité      ← cœur
├─ Gestion des pièces et des stocks      ← support
├─ Identité et accès                     ← générique
└─ Facturation interne                   ← générique
```

Ce découpage décrit le **métier**. Il ne préjuge ni des modules ni des services.

#### Les trois types

| Type | Question de classement | Complexité | Volatilité | Stratégie | Exemple |
|---|---|---|---|---|---|
| Cœur | Un concurrent qui le fait mieux nous fait-il perdre ? | Élevée | Élevée | Construire en interne, avec le meilleur modèle et les meilleures personnes | Planification des inspections |
| Support | Est-il nécessaire, mais sans effet sur notre avantage ? | Moyenne | Moyenne | Construire simplement, ou configurer | Gestion des pièces |
| Générique | Existe-t-il des solutions éprouvées sur le marché ? | Variable | Faible | Acheter, intégrer, utiliser un standard | Authentification, facturation |

#### Comment les découvrir

- **Conversations avec les experts**, en notant le vocabulaire et les désaccords.
- **Ateliers de découverte** : cartographier sur un mur les événements du métier et les décisions.
- **Étude des processus** et des documents réels : formulaires, règles, exceptions.
- **Observation des organisations** : les départements reflètent souvent des sous-domaines, sans s'y confondre.

Des **signaux** aident à repérer le cœur : là où le métier investit, où les règles sont les plus subtiles, où les experts se disputent, où la direction cherche à se distinguer.

#### Les critères de classement

| Critère | Cœur | Support | Générique |
|---|---|---|---|
| Différenciation | Forte | Faible | Nulle |
| Singularité des règles | Forte | Moyenne | Faible (standard) |
| Disponibilité de solutions du marché | Faible | Moyenne | Forte |
| Impact d'une erreur sur l'avantage | Élevé | Modéré | Faible |

#### Du sous-domaine au contexte délimité

Le sous-domaine est dans l'**espace du problème**. Le contexte délimité est dans l'**espace de la solution**. Dans le meilleur des cas, un sous-domaine correspond à un contexte. Un contexte peut aussi couvrir plusieurs sous-domaines proches, ou un sous-domaine peut être découpé en plusieurs contextes. On y reviendra en [14.3 Contexte délimité](#143-contexte-délimité).

#### Deux niveaux de domaine dans une plateforme

| Niveau | Domaine | Exemple de cœur |
|---|---|---|
| Plateforme | Construire des systèmes métier configurables | Le moteur de métadonnées, le moteur de workflow, le moteur d'autorisation |
| Tenant | Le métier du client | La planification des inspections |

Pour l'éditeur de la plateforme, le cœur est le moteur, pas la maintenance aéronautique. Pour le tenant, le cœur est son métier, que la plateforme sert par configuration. Mélanger les deux niveaux conduit à coder des particularités métier dans le moteur (voir [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale)).

#### Les effets sur les décisions techniques

| Type | Investissement de modélisation | Exemple de choix |
|---|---|---|
| Cœur | Modèle riche, DDD tactique complet, tests approfondis | Moteur de planification développé en interne, avec ses agrégats et ses règles |
| Support | Modèle simple, configuration | Gestion des pièces par types d'objets configurés |
| Générique | Aucun modèle propre | Authentification déléguée à un fournisseur d'identité (voir [4.10 OpenID Connect](04-identite-iam-autorisation.md#410-openid-connect)) |

#### Les modes de défaillance

- **Tout traiter comme du cœur** : un investissement partout, nulle part de profondeur.
- **Prendre un sous-domaine générique pour un cœur** : développer sa propre authentification ou sa propre facturation.
- **Découper par couches techniques** plutôt que par métier.
- **Ne jamais revoir la classification** : le cœur d'il y a cinq ans n'est plus celui d'aujourd'hui.
- **Ignorer les experts** : le découpage vient uniquement de l'équipe technique.

**Contre-exemple.** Une équipe consacre un an à construire un système d'authentification sur mesure, avec toutes les options, parce qu'elle y voit un « cœur ». Pendant ce temps, le moteur de planification, que les clients achètent, reste un prototype. Un concurrent livre une planification supérieure, avec une authentification fédérée standard.

**Limites.** La classification est un jugement, pas une mesure. Deux équipes peuvent classer différemment un même sous-domaine. Elle doit donc être discutée, écrite et revue, avec la direction et les experts.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.2 Langage omniprésent](#142-langage-omniprésent) | Chaque sous-domaine porte son propre vocabulaire |
| [14.3 Contexte délimité](#143-contexte-délimité) | Les sous-domaines (problème) guident le choix des contextes délimités (solution) |
| [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service) | Les frontières de service s'appuient sur les sous-domaines |
| [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) | Le monolithe modulaire place les modules selon les sous-domaines |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Le type de sous-domaine influence ce qui est codé ou configuré |
| [4.10 OpenID Connect](04-identite-iam-autorisation.md#410-openid-connect) | L'identité est un sous-domaine générique, délégué à un fournisseur standard |
| [15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée) | Un nouveau domaine suit le même découpage avant d'être configuré |

### 5. Application pratique

**Situation initiale.** Un éditeur de plateforme étudie l'arrivée d'un nouveau client, la compagnie aérienne régionale. La direction du client demande tout, dès le premier jour : planification, constats, pièces, facturation interne, gestion des utilisateurs.

**Problème.** L'équipe ne peut pas tout modéliser avec la même profondeur. Où concentrer l'effort ?

**Application du concept.** Un atelier de découverte avec les experts de la compagnie, puis une classification.

**Déroulé.**

1. Avec les responsables de la maintenance, l'équipe cartographie les événements et les décisions du métier.
2. Elle identifie cinq sous-domaines.
3. Elle les classe : la planification des inspections et le suivi de conformité sont le **cœur** de la compagnie (elle y gagne en disponibilité des appareils et en conformité). La gestion des pièces est du **support**. L'identité et la facturation interne sont **génériques**.
4. Elle en déduit la stratégie : le cœur est modélisé avec un langage précis et des invariants soignés. Les pièces sont configurées en types simples. L'identité passe par la fédération avec le fournisseur d'identité de la compagnie (voir [4.10 OpenID Connect](04-identite-iam-autorisation.md#410-openid-connect)). La facturation interne s'intègre au système financier existant.

**Résultat.** L'équipe consacre les deux tiers de l'effort au cœur et livre le reste par configuration et intégration en quelques semaines.

**Limites.** Le client estime que la gestion des pièces est stratégique. La classification est rediscutée avec lui, et ajustée : la compagnie y voit un avantage de disponibilité des appareils. Le sous-domaine passe de support à cœur.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un domaine et un sous-domaine ?
2. **Compréhension.** Quels sont les trois types de sous-domaine, et quelle stratégie convient à chacun ?
3. **Compréhension.** Pourquoi un sous-domaine n'est-il pas un microservice ?
4. **Pourquoi.** Pourquoi ne faut-il pas traiter un sous-domaine générique comme un cœur ?
5. **Raisonnement pratique.** Une équipe hésite à construire son propre moteur de facturation. Quels critères utilisez-vous pour décider ?

#### Réponses

1. Le domaine est le champ d'activité métier dans son ensemble. Un sous-domaine en est une partie cohérente, avec son vocabulaire et ses règles.
2. Cœur : il différencie l'organisation, on le construit en interne avec soin. Support : il est nécessaire mais non différenciant, on le simplifie ou on le configure. Générique : il est banalisé, on l'achète ou on l'intègre.
3. Parce que le sous-domaine appartient à l'espace du problème (le métier), alors que le microservice est une solution technique. Un sous-domaine peut être servi par un service, par plusieurs, ou par un module d'un monolithe.
4. Parce qu'on y investit un effort élevé sans avantage distinctif, alors que des solutions éprouvées existent. Cet effort manque au cœur, où il ferait la différence.
5. Est-ce un facteur de différenciation ? Existe-t-il des solutions du marché adaptées ? Les règles de facturation du métier sont-elles propres et subtiles ? Quel est le coût d'une erreur ? Si la facturation est banalisée, on intègre une solution existante.

## 14.2 Langage omniprésent

### 1. Comprendre simplement

Le **langage omniprésent** (*ubiquitous language*) est un **vocabulaire précis, partagé** par les experts du métier et les développeurs, et utilisé **partout** : dans les conversations, dans les documents, dans le code, dans les tests et dans l'interface. Un même mot désigne la même chose, pour tout le monde, à l'intérieur d'un même contexte.

**Pourquoi cela existe.** Quand les experts parlent d'« immobilisation » et que le code dit `setStatus(3)`, quelqu'un traduit à chaque échange. Chaque traduction perd du sens et cache des malentendus. Un langage commun supprime la traduction : les experts peuvent lire les noms du code, et les développeurs comprennent les phrases des experts.

**Problème résolu.** Réduire les malentendus entre métier et technique, et rendre le modèle vérifiable par ceux qui connaissent le domaine.

**Modèle mental.** Le jargon d'un chantier. L'architecte, le maçon et le client disent « dalle » pour la même chose. Personne ne traduit, et on se comprend en un mot. Si le client dit « sol » et le maçon « plancher », le chantier dérape.

**Où l'analogie s'arrête.** Un chantier a un seul jargon. Une organisation a plusieurs langages : le même mot peut signifier deux choses selon le département. Le langage omniprésent n'est donc valable qu'à l'intérieur d'un **contexte** (voir [14.3 Contexte délimité](#143-contexte-délimité)).

**Exemple.** L'équipe hésite entre « immobiliser », « mettre à l'arrêt » et « ground » pour la même action. Elle convient avec les experts d'**« immobiliser »**. Le mot devient le nom de la transition dans le workflow, de l'événement `AircraftGrounded`, du bouton de l'interface et des phrases des tests.

**Les composants.**

1. un **glossaire** vivant ;
2. des **conversations** régulières avec les experts ;
3. des **noms du code** qui reprennent les mots du glossaire ;
4. des **tests** écrits dans le même langage ;
5. des **règles** pour traiter les synonymes et les termes ambigus.

**Objectif d'apprentissage :** vous pouvez construire un glossaire, reconnaître un terme ambigu, et expliquer pourquoi un langage n'est valable que dans un contexte.

### 2. Connaissances essentielles

#### Définition

**Langage omniprésent** : langage structuré autour du modèle du domaine, partagé par les experts et les développeurs, employé dans toutes les communications et dans le code, à l'intérieur d'un contexte délimité.

#### Idées fondamentales

1. **Un mot, un sens, dans un contexte.** Les synonymes et les termes ambigus sont traités explicitement.
2. **Le langage vient du métier.** Les développeurs adoptent les mots des experts, ils n'inventent pas les leurs.
3. **Le code parle ce langage.** Classes, méthodes, événements et tests utilisent les mêmes mots.
4. **Le langage évolue avec le modèle.** Un nouveau mot, ou un mot qui change de sens, signale une compréhension qui progresse.
5. **Une contradiction révèle une frontière.** Si le même mot signifie deux choses, il y a probablement deux contextes.
6. **Le langage est tenu à jour.** Un glossaire non maintenu est pire qu'aucun.

#### Vocabulaire essentiel

- **Glossaire** (*glossary*) : liste des termes du contexte, avec leur définition et leurs exemples.
- **Terme ambigu** : mot qui a plusieurs sens selon la personne ou le contexte.
- **Synonyme** : mots différents pour un même concept.
- **Traduction** : conversion entre le vocabulaire métier et le vocabulaire technique, source d'erreurs.
- **Scénario** (*scenario*) : exemple de comportement écrit en langage métier, souvent sous forme « étant donné / quand / alors ».

#### Relations de cause à effet

- Les développeurs utilisent leurs propres mots. Les experts ne peuvent plus relire ni vérifier le modèle, et les malentendus s'accumulent.
- Le même mot a deux sens dans le même contexte. Les règles se contredisent, et les bugs ressemblent à des désaccords d'interprétation.
- Les noms du code divergent du glossaire. Chaque évolution du métier demande un travail de correspondance.
- Le langage est imposé par la plateforme (ses termes techniques). Les utilisateurs du tenant voient un vocabulaire qui n'est pas le leur.

#### Idées reçues

- **« Le langage omniprésent est un lexique à imprimer. »** Il vit dans les conversations et le code. Le glossaire en est la trace.
- **« Un seul langage pour toute l'entreprise. »** Un langage est valable dans un contexte. Chercher un langage unique conduit à des termes vagues.
- **« Les développeurs doivent traduire le métier en termes techniques propres. »** C'est l'inverse : le code reprend les termes du métier.

#### Principe clé

Le métier et le code parlent le même langage précis, dans un contexte donné, et toute divergence de vocabulaire est un signal à traiter.

#### Si vous ne retenez que trois choses

1. Un langage commun, précis et vivant relie les experts, le code et les tests.
2. Un mot a un seul sens dans un contexte, et un conflit de sens révèle une frontière.
3. Dans une plateforme, le vocabulaire affiché est celui du tenant, pas celui du moteur.

### 3. Explication technique détaillée

#### Un glossaire utile

```yaml
context: maintenance
terms:
  - term: Aéronef
    definition: Appareil identifié par son immatriculation, soumis à des inspections réglementaires.
    synonyms_rejected: [Avion, Appareil]
    code_name: Aircraft
    notes: "« Avion » est trop restrictif : le parc inclut des hélicoptères."
  - term: Immobiliser
    definition: Passer un aéronef de l'état « Actif » à « En inspection ». Exige un motif.
    synonyms_rejected: [Mettre à l'arrêt, Ground]
    code_name: ground
    event: AircraftGrounded
  - term: Remettre en service
    definition: Passer un aéronef de « En inspection » à « Actif », après clôture de toutes les tâches.
    code_name: release
    event: AircraftReleased
```

Chaque entrée précise **le mot retenu**, **les mots rejetés**, **la correspondance avec le code**, et les **événements** associés.

#### Du langage au code

| Sans langage commun | Avec langage omniprésent |
|---|---|
| `aircraft.setStatus(3)` | `aircraft.ground(reason)` |
| `updateRecord("ac", id, {s: 3})` | `new AircraftGrounded(aircraftId, reason)` |
| `if (t.type == 2 && t.st == 1)` | `if (task.isOpenInspection())` |
| `RESOURCE_TYPE_DEFINITIONS` (affiché à l'utilisateur) | « Types d'objets » (libellé du tenant) |

Le code lisible par un expert est un code qui parle le métier.

#### Des tests dans le même langage

```text
Scénario : immobiliser un aéronef sans vol programmé
  Étant donné un aéronef « Actif » sans vol programmé dans les 24 heures
  Quand le planificateur l'immobilise avec le motif « Inspection annuelle »
  Alors l'aéronef est « En inspection »
  Et l'événement « Aéronef immobilisé » est publié
```

Un scénario de ce type est lisible par un expert, et vérifiable par la machine (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) pour la restitution des raisons).

#### Les conflits de sens

| Terme | Contexte « Planification » | Contexte « Maintenance » | Contexte « Facturation » |
|---|---|---|---|
| Aéronef | Ressource à affecter à des vols ; disponibilité | Appareil avec état technique, heures de vol, composants | Actif amorti |
| Vol | Mission programmée avec un horaire | Cycle d'utilisation qui consomme des heures de vie | Prestation facturée |
| Immobilisé | Indisponible pour l'affectation | En inspection, avec des tâches ouvertes | Hors production |

Le mot est le même, le modèle est différent. Plutôt que de forcer un sens unique, on **sépare les contextes** et on traduit aux frontières (voir [14.3 Contexte délimité](#143-contexte-délimité)).

#### Dans une plateforme configurable

Le langage du tenant est une **donnée** : libellés des types, des champs, des états et des transitions.

- Les identifiants techniques (`aircraft`, `ground`) sont **stables** ; les libellés affichés (« Aéronef », « Immobiliser ») **changent** par tenant et par langue (voir [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées)).
- L'interface montre le **vocabulaire du tenant**, jamais celui du moteur (« ResourceType », « Transition »).
- Le glossaire du tenant se **génère** en partie à partir de sa configuration (voir [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)).
- Un tenant d'un autre secteur a un autre langage, avec le même moteur.

#### Faire vivre le langage

- **Dans les échanges** : on corrige un mot imprécis, on le note.
- **Dans la revue du code** : un nom qui s'écarte du glossaire est discuté.
- **Lors des évolutions du modèle** : un changement de sens est un événement, pas un détail.
- **Dans la documentation** : les mêmes termes, sans second vocabulaire.

#### Les modes de défaillance

- **Une double nomenclature** : les mots du métier d'un côté, ceux du code de l'autre, avec une table de correspondance.
- **Des synonymes tolérés** : trois noms pour le même concept.
- **Un glossaire figé**, écrit une fois et jamais relu.
- **Un langage de plateforme imposé** aux utilisateurs.
- **Un terme « fourre-tout »** qui désigne plusieurs concepts (« donnée », « objet », « élément »).

**Contre-exemple.** Dans un module, « vol » désigne une mission programmée ; dans un autre, un cycle d'utilisation d'un appareil. Une règle « un aéronef ne peut pas être immobilisé s'il a un vol dans les 24 h » est écrite avec le premier sens et implémentée avec le second. Elle bloque des immobilisations légitimes pendant un mois, avant que l'écart ne soit découvert.

**Limites.** Construire un langage commun demande du temps des experts, qui est rare. Il ne supprime pas toute ambiguïté. Dans des organisations très grandes, plusieurs langages coexistent, et le travail porte sur leurs frontières plus que sur leur unification.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.1 Domaine et sous-domaine](#141-domaine-et-sous-domaine) | Chaque sous-domaine a son vocabulaire |
| [14.3 Contexte délimité](#143-contexte-délimité) | Un langage n'est valable que dans un contexte délimité |
| [14.4 Entité et objet-valeur](#144-entité-et-objet-valeur) à [14.8 Service de domaine](#148-service-de-domaine) | Entités, objets-valeurs, agrégats, événements et services portent des noms du langage |
| [12.1 Architecture de l'information et navigation](12-produit-ux.md#121-architecture-de-linformation-et-navigation) | Les libellés de l'interface reprennent le langage du tenant |
| [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | Les métadonnées portent libellés et traductions |
| [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie) | Les noms d'états sont des termes du langage |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les noms d'événements sont au passé et dans le langage du métier |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | La plateforme garde ses identifiants techniques stables sous les libellés du tenant |

### 5. Application pratique

**Situation initiale.** Dans la plateforme, l'action est nommée `set_maintenance_mode` dans le code, « Mettre en maintenance » dans l'interface pour les planificateurs, « Immobiliser » dans les procédures de qualité et « Grounding » dans les échanges avec les autorités. Un nouvel employé met des semaines à voir qu'il s'agit d'une seule action.

**Problème.** Quatre noms pour un concept, sans règle.

**Application du concept.** Un atelier de langage avec les experts.

**Déroulé.**

1. L'équipe liste les termes employés par les planificateurs, les techniciens, la qualité et les développeurs pour cette action.
2. Les experts retiennent « Immobiliser », mot utilisé dans les procédures réglementaires de la compagnie. « Grounding » reste un mot des échanges avec les autorités, noté comme synonyme externe.
3. Le glossaire est mis à jour, avec le nom de code `ground`, l'événement `AircraftGrounded` et le libellé affiché.
4. Le code est renommé : la transition devient `ground`, et les anciens noms sont conservés en alias pour les intégrations existantes (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).
5. L'interface et les tests reprennent « Immobiliser ».

**Résultat.** Un seul mot circule du métier aux tests. Les nouveaux arrivants comprennent les procédures et le code sans table de correspondance.

**Limites.** Un autre tenant (une compagnie anglophone) a un libellé différent. Les identifiants restent identiques, les libellés se configurent : la plateforme distingue le nom technique de l'étiquette.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que le langage omniprésent, et où doit-il se retrouver ?
2. **Compréhension.** Pourquoi un même mot peut-il avoir deux sens dans une organisation ?
3. **Compréhension.** Comment une plateforme configurable traite-t-elle le langage de chaque tenant ?
4. **Pourquoi.** Pourquoi une contradiction de vocabulaire est-elle un signal utile ?
5. **Raisonnement pratique.** Deux équipes emploient « client » avec des sens différents. Comment procédez-vous ?

#### Réponses

1. C'est un vocabulaire précis, partagé par les experts et les développeurs, qui structure le modèle. Il se retrouve dans les conversations, les documents, le code (noms de classes, de méthodes, d'événements), les tests et l'interface.
2. Parce que les départements ont des préoccupations différentes : un terme prend le sens utile à chacun. Le même mot « aéronef » désigne une ressource à affecter pour la planification et un appareil à l'état technique pour la maintenance.
3. Elle sépare l'identifiant technique stable (`aircraft`) du libellé affiché, qui est une donnée du tenant, traduisible et personnalisable. L'interface montre toujours le vocabulaire du tenant.
4. Parce qu'elle indique souvent une frontière entre deux contextes : le même mot désigne deux concepts. La traiter explicitement évite des modèles incohérents.
5. Je confronte les deux équipes autour de scénarios concrets, je note les définitions dans chaque contexte, et je décide s'il s'agit de deux concepts (donc deux termes, ou deux contextes avec traduction à la frontière) ou d'un même concept mal défini.

## 14.3 Contexte délimité

### 1. Comprendre simplement

Un **contexte délimité** (*bounded context*) est une **frontière explicite** à l'intérieur de laquelle **un modèle et son langage sont cohérents et valables**. En dehors, les mêmes mots peuvent désigner autre chose, et un autre modèle s'applique.

**Pourquoi cela existe.** Un modèle unique pour tout un métier finit par contenir toutes les contradictions : chaque département y ajoute ses attributs et ses règles, et plus personne ne le comprend. Mieux vaut plusieurs modèles, chacun cohérent, avec des frontières claires et des traductions aux jonctions.

**Problème résolu.** Garder des modèles compréhensibles et évolutifs, et éviter qu'un changement chez l'un casse tous les autres.

**Modèle mental.** Les services d'un hôpital. Pour l'accueil, le « patient » est une identité avec une couverture sociale. Pour le bloc opératoire, c'est un dossier clinique et une intervention. Pour la facturation, c'est un compte à facturer. Le même mot, trois modèles. Chaque service a le sien, et échange des informations avec les autres par des documents précis.

**Où l'analogie s'arrête.** Les services d'un hôpital se voient et se parlent. Les contextes d'un logiciel doivent expliciter leurs relations : qui dépend de qui, quel contrat, quelle traduction.

**Exemple.** Dans la compagnie aérienne, la **planification** voit l'aéronef comme une ressource disponible ou non. La **maintenance** le voit comme un appareil avec un état technique, des heures de vol et des composants. Les deux contextes ont chacun leur modèle d'« aéronef », reliés par l'identifiant (l'immatriculation) et par des événements.

**Les composants.**

1. un **modèle** cohérent ;
2. un **langage** propre (voir [14.2 Langage omniprésent](#142-langage-omniprésent)) ;
3. une **frontière** explicite ;
4. une **propriété** : équipe, données, déploiement ;
5. des **relations** avec les autres contextes, décrites dans une carte.

**Objectif d'apprentissage :** vous pouvez délimiter des contextes à partir des conflits de langage, choisir un type de relation entre contextes, et relier un contexte à une frontière de service.

### 2. Connaissances essentielles

#### Définition

**Contexte délimité** : frontière explicite, linguistique et organisationnelle, à l'intérieur de laquelle un modèle de domaine particulier est défini, cohérent et applicable.

#### Idées fondamentales

1. **Un modèle n'est valable que dans une frontière.** En dehors, il ne tient plus.
2. **La frontière est celle d'un langage.** Là où un mot change de sens, un contexte change.
3. **Un contexte a un propriétaire.** Une équipe qui décide de son modèle, de ses données et de ses évolutions.
4. **Les contextes communiquent par des contrats explicites.** Événements, API, traductions, jamais par partage implicite de tables.
5. **On ne cherche pas un modèle unique.** Une tentative de « modèle canonique » universel échoue ou devient vague.
6. **Les relations entre contextes sont des choix.** Dépendance, partenariat, conformité, séparation : on les cartographie.
7. **Le contexte est une frontière logique avant d'être technique.** Il peut devenir un module, un service ou une application configurée.

#### Vocabulaire essentiel

- **Carte des contextes** (*context map*) : représentation des contextes et de leurs relations.
- **Couche anticorruption** (*anti-corruption layer*, ACL) : couche qui traduit le modèle d'un autre contexte pour protéger le sien.
- **Noyau partagé** (*shared kernel*) : sous-ensemble du modèle partagé et géré conjointement par deux contextes.
- **Client-fournisseur** (*customer–supplier*) : relation où un contexte en amont fournit ce dont l'aval dépend, avec des attentes négociées.
- **Conformiste** (*conformist*) : relation où l'aval adopte le modèle de l'amont sans le traduire.
- **Service hôte ouvert** (*open host service*) : contexte qui expose un protocole public et stable.
- **Langage publié** (*published language*) : format documenté et partagé pour les échanges (schéma d'événement, API).
- **Chemins séparés** (*separate ways*) : choix de ne pas intégrer deux contextes.
- **Partenariat** (*partnership*) : relation de coordination étroite entre deux équipes sur des objectifs communs.

#### Relations de cause à effet

- Un modèle unique est partagé par toute l'entreprise. Il grossit, se contredit, et chaque changement demande l'accord de tous.
- Deux contextes partagent des tables. Une modification d'un côté casse l'autre, sans prévenir.
- Il n'y a pas de traduction à la frontière. Le modèle externe contamine le modèle interne, et ses défauts s'y installent.
- La frontière technique (un service) ne suit pas celle du langage. Les équipes se coordonnent en permanence pour un même concept.

#### Idées reçues

- **« Un contexte délimité, c'est un microservice. »** C'est une frontière de modèle. Elle peut être réalisée par un module d'un monolithe ou par un service (voir [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) et [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)).
- **« Il faut un modèle canonique pour intégrer. »** Un modèle unique transforme chaque différence en compromis. Les traductions explicites sont plus robustes.
- **« Les contextes s'ignorent. »** Ils communiquent, mais à travers des contrats explicites.

#### Principe clé

On délimite des modèles cohérents, chacun avec son langage et son propriétaire, reliés par des contrats explicites et des traductions aux frontières.

#### Si vous ne retenez que trois choses

1. Un contexte délimité est une frontière dans laquelle un modèle et son langage sont cohérents.
2. Les contextes communiquent par des contrats explicites, avec traduction aux frontières.
3. La frontière du contexte guide celle des modules et des services, sans s'y confondre.

### 3. Explication technique détaillée

#### La carte des contextes

```text
┌──────────────────┐   événements    ┌──────────────────┐
│   Planification  │ ──────────────► │   Maintenance    │
│  (aéronef =      │ « Vol terminé » │  (aéronef =      │
│   ressource)     │                 │   état technique)│
└────────┬─────────┘                 └────────┬─────────┘
         │ API publiée                        │ ACL (traduction)
         ▼                                    ▼
┌──────────────────┐                 ┌──────────────────┐
│     Identité     │                 │ Système qualité  │
│  (générique,     │                 │ externe          │
│   fournisseur)   │                 │ (modèle imposé)  │
└──────────────────┘                 └──────────────────┘
```

Chaque flèche porte un **type de relation** et un **contrat**. La carte est un document vivant, tenu par les équipes concernées.

#### Les types de relations

| Relation | Principe | Quand l'utiliser | Risque |
|---|---|---|---|
| Partenariat | Deux équipes coordonnent leurs évolutions | Objectifs communs, forte interdépendance | Coordination coûteuse |
| Noyau partagé | Un petit modèle est géré en commun | Concepts vraiment communs | Couplage fort, discipline nécessaire |
| Client-fournisseur | L'aval exprime ses besoins à l'amont | Dépendance unilatérale négociée | L'amont ignore l'aval |
| Conformiste | L'aval adopte le modèle de l'amont | Amont inaccessible ou standard | Perte d'autonomie du modèle |
| Couche anticorruption | L'aval traduit le modèle de l'amont | Modèle externe ou ancien à ne pas importer | Coût de traduction |
| Service hôte ouvert et langage publié | L'amont expose un protocole stable | Nombreux clients | Contrat à maintenir |
| Chemins séparés | Pas d'intégration | Le coût dépasse le bénéfice | Duplication |

#### Un exemple de traduction

Le système qualité externe de la compagnie a son propre modèle d'« écart », avec des codes de gravité numériques. La maintenance a son modèle de « constat » avec une gravité nommée. Une **couche anticorruption** traduit :

```typescript
// Couche anticorruption : le modèle externe n'entre pas dans le domaine.
class QualityGatewayTranslator {
  toFinding(external: ExternalQualityDeviation): Finding {
    return Finding.report({
      aircraft: Registration.of(external.tail_number),
      severity: this.severityOf(external.sev_code),   // 1..4 → Critique, Majeur, Mineur, Information
      description: external.text,
      source: ExternalReference.of("quality-system", external.id),
    });
  }

  private severityOf(code: number): Severity {
    switch (code) {
      case 1: return Severity.Critical;
      case 2: return Severity.Major;
      case 3: return Severity.Minor;
      default: return Severity.Information;
    }
  }
}
```

La traduction est **localisée** : si le système externe change, seul le traducteur évolue (voir [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) et [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)).

#### Contexte, module et service

| Niveau | Rôle | Rapport avec le contexte |
|---|---|---|
| Contexte délimité | Frontière de modèle et de langage | Concept |
| Module d'un monolithe modulaire | Frontière de code (voir [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices)) | Réalisation fréquente d'un contexte |
| Microservice | Frontière de déploiement (voir [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)) | Réalisation possible, avec un coût distribué |
| Application configurée d'un tenant | Frontière de configuration | Réalisation dans la plateforme |

Un contexte peut commencer comme module, et devenir un service plus tard si le besoin d'indépendance se confirme. Faire l'inverse (des services sans contextes clairs) produit un « monolithe distribué ».

#### Dans une plateforme configurable

- **Pour l'éditeur** : les moteurs (identité, workflow, données, événements) sont des contextes de la plateforme, avec des contrats.
- **Pour le tenant** : un tenant peut organiser sa configuration en **espaces** (ou applications) correspondant à ses contextes : « Planification », « Maintenance », « Qualité ».
- **Les références entre contextes** se font par **identifiant** et par **événements**, pas par partage de la structure interne.
- **Les types partagés** (par exemple « Aéronef ») sont d'abord un **identifiant commun** ; chaque contexte y rattache sa propre vue.

#### Découvrir les frontières

- **Conflits de langage** : un mot qui change de sens (voir [14.2 Langage omniprésent](#142-langage-omniprésent)).
- **Équipes et propriété** : qui décide de quoi.
- **Cohérence transactionnelle** : ce qui doit changer ensemble.
- **Rythme de changement** : ce qui évolue ensemble, ou séparément.
- **Exigences différentes** : disponibilité, conformité, sécurité.

#### Les modes de défaillance

- **La grosse boule de boue** : un modèle sans frontières, où tout dépend de tout.
- **Le modèle canonique** : un modèle universel qui ne satisfait personne.
- **Le partage de base de données** entre contextes.
- **L'absence de carte** : personne ne sait qui dépend de qui.
- **Des contextes qui suivent l'organigramme technique** plutôt que le langage.
- **Des microservices sans contexte**, qui échangent des tables sous forme d'API.

**Contre-exemple.** Deux équipes partagent la table `aircraft` : planification et maintenance y ajoutent des colonnes. Un ajout de la maintenance rend une colonne non nulle, et l'application de planification cesse d'enregistrer. Les deux équipes découvrent qu'elles dépendent l'une de l'autre sans l'avoir décidé.

**Limites.** Plusieurs contextes demandent des traductions, des événements et des cohérences à terme : c'est plus complexe qu'un modèle unique. Pour un petit système avec un seul langage, un seul contexte suffit, et en créer plusieurs est prématuré.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.1 Domaine et sous-domaine](#141-domaine-et-sous-domaine) | Les sous-domaines (problème) guident la forme des contextes (solution) |
| [14.2 Langage omniprésent](#142-langage-omniprésent) | La frontière d'un contexte est celle de son langage |
| [14.6 Événement de domaine](#146-événement-de-domaine) | Les événements de domaine sont le moyen principal de communication entre contextes |
| [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) et [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service) | Le monolithe modulaire et les microservices réalisent les contextes |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) et [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence) | Connecteurs, adaptateurs et système de référence jouent le rôle de couche anticorruption |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation des tenants est une autre dimension de frontière, orthogonale aux contextes |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | Chaque contexte peut avoir son propre sous-ensemble du métamodèle |
| [15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée) | La configuration d'un nouveau domaine s'organise par contextes |

### 5. Application pratique

**Situation initiale.** La plateforme du tenant aérien contient un unique type « Aéronef » avec 62 champs : disponibilité, créneaux, heures de vol, composants, valeur comptable. Trois équipes y ajoutent des champs et des règles. Les modifications se heurtent, et les formulaires deviennent illisibles.

**Problème.** Un modèle unique sert trois langages et trois responsabilités.

**Application du concept.** Une séparation en contextes avec une carte.

**Déroulé.**

1. L'équipe identifie trois contextes à partir des conflits de langage : **Planification** (disponibilité, affectation), **Maintenance** (état technique, tâches, composants) et **Finance** (valeur, amortissement).
2. Chaque contexte reçoit son propre type : « Aéronef planifiable », « Aéronef technique », « Actif comptable ». Un **identifiant commun** (l'immatriculation) les relie.
3. Les échanges passent par des événements : `AircraftGrounded` (publié par la maintenance) rend l'aéronef indisponible pour la planification.
4. L'équipe documente la carte, avec le propriétaire et le contrat de chaque relation.
5. Le système qualité externe est relié par une couche anticorruption.

**Résultat.** Chaque équipe fait évoluer son modèle sans bloquer les autres. Les formulaires redeviennent lisibles, et les règles de chaque contexte sont cohérentes.

**Limites.** Certaines vues exigent une information d'un autre contexte (afficher l'état technique dans la planification). On la fournit par un **modèle de lecture** alimenté par événements (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)), pas par un partage de table.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un contexte délimité ?
2. **Compréhension.** Citez trois types de relation entre contextes et décrivez-les.
3. **Compréhension.** Quelle différence y a-t-il entre un contexte délimité et un microservice ?
4. **Pourquoi.** Pourquoi vaut-il mieux traduire aux frontières que de chercher un modèle canonique ?
5. **Raisonnement pratique.** Deux équipes modifient la même table et se bloquent mutuellement. Comment procédez-vous ?

#### Réponses

1. Une frontière explicite dans laquelle un modèle de domaine et son langage sont cohérents et valables, avec un propriétaire et des contrats explicites avec les autres contextes.
2. Par exemple : la couche anticorruption (l'aval traduit le modèle de l'amont pour protéger le sien), le client-fournisseur (l'aval exprime ses besoins à l'amont), le noyau partagé (un petit modèle géré en commun). On peut aussi citer conformiste, partenariat, chemins séparés.
3. Le contexte délimité est une frontière de modèle et de langage. Le microservice est une frontière de déploiement. Un contexte peut être réalisé par un module d'un monolithe ou par un service.
4. Parce qu'un modèle unique oblige à des compromis qui le rendent vague et fragile. Une traduction explicite localise l'effet d'un changement, et chaque contexte garde un modèle cohérent.
5. Je sépare les modèles selon les langages et les responsabilités (deux contextes), je donne à chacun sa propre structure avec un identifiant commun, et je remplace le partage de table par des événements ou des API, avec un contrat.

## 14.4 Entité et objet-valeur

### 1. Comprendre simplement

Une **entité** (*entity*) est un objet du domaine **défini par son identité**, qui subsiste dans le temps alors que ses attributs changent : l'aéronef F-ABCD reste le même aéronef quand son statut ou sa base changent. Un **objet-valeur** (*value object*) est un objet **défini uniquement par ses valeurs**, sans identité propre, et **immuable** : une immatriculation, une durée, un montant, une période. Deux objets-valeurs de mêmes valeurs sont interchangeables.

**Pourquoi cela existe.** Il faut distinguer ce qui a une histoire de ce qui est une simple valeur. Une entité se suit, se référence par son identifiant, s'historise. Une valeur se copie, se compare, se remplace. Les confondre produit deux défauts : des modifications faites par erreur sur un objet partagé, et un modèle pauvre où l'on manipule des chaînes et des nombres sans signification.

**Problème résolu.** Exprimer précisément ce qui compte dans le modèle, concentrer les règles sur les valeurs, et éviter les effets de bord.

**Modèle mental.** Une personne et une pièce de 1 euro. Une pièce est équivalente à n'importe quelle autre pièce de 1 euro : on se moque de savoir laquelle on a. Une personne reste la même quand elle change d'adresse : son identité demeure, ses attributs varient.

**Où l'analogie s'arrête.** La distinction dépend du contexte. Une pièce est une valeur pour un client. Une pièce de collection numérotée est une entité pour un numismate. De même, une adresse est une valeur dans un contexte, et une entité pour un service qui suit les adresses.

**Exemple.** `Aircraft` est une entité : son identité est stable. `Registration`, `InspectionInterval` et `Period` sont des objets-valeurs : chacun est immuable, validé à sa création, et comparé par ses valeurs.

**Les composants.**

1. une **identité** stable pour les entités ;
2. des **attributs** qui changent au fil du cycle de vie ;
3. des **objets-valeurs** immuables et validés ;
4. une **égalité** adaptée : par identité ou par valeur ;
5. un **comportement** porté par les objets, pas seulement des données.

**Objectif d'apprentissage :** vous pouvez décider si un concept est une entité ou un objet-valeur, concevoir un objet-valeur toujours valide, et éviter l'obsession des primitives.

### 2. Connaissances essentielles

#### Définition

- **Entité** : objet du domaine défini par une identité continue dans le temps, distincte de ses attributs.
- **Objet-valeur** : objet du domaine défini uniquement par ses attributs, immuable et sans identité, dont l'égalité est celle de ses valeurs.

#### Idées fondamentales

1. **L'identité se distingue des attributs.** Une entité reste elle-même quand ses attributs changent.
2. **Un objet-valeur est immuable.** On ne le modifie pas, on le remplace.
3. **L'égalité n'est pas la même.** Entités : même identité. Objets-valeurs : mêmes valeurs.
4. **Un objet-valeur est toujours valide.** Il vérifie ses règles à sa création : on ne peut pas en construire un invalide.
5. **Les objets-valeurs portent du comportement.** Calculs, comparaisons, conversions, sans effet de bord.
6. **On préfère un objet-valeur à un type primitif.** Une durée en jours n'est pas un entier quelconque.
7. **La distinction dépend du contexte.** Le même concept peut être une entité ici et une valeur ailleurs.

#### Vocabulaire essentiel

- **Identité** (*identity*) : ce qui distingue une entité des autres et la suit dans le temps.
- **Égalité par valeur** (*value equality*) : deux objets sont égaux si leurs attributs le sont.
- **Immuabilité** (*immutability*) : propriété d'un objet qui ne change pas après sa création.
- **Obsession des primitives** (*primitive obsession*) : usage de types simples (chaînes, entiers) pour des concepts du domaine.
- **Constructeur validant** : fabrique qui refuse de produire un objet invalide.
- **Cycle de vie** (*lifecycle*) : suite des états d'une entité, de sa création à sa fin.

#### Relations de cause à effet

- Les concepts sont des chaînes et des nombres. Les validations sont répétées et divergent, et des valeurs absurdes circulent.
- Un objet-valeur est modifiable et partagé. Un changement fait à un endroit modifie, sans le vouloir, tous les endroits qui le référencent.
- L'identité d'une entité repose sur un attribut qui peut changer (l'immatriculation). Les références se cassent au changement, et les historiques se brisent.
- Une entité n'a pas d'identité stable. On crée des doublons, et on ne peut plus suivre son histoire.

#### Idées reçues

- **« Une entité, c'est une table. »** C'est un concept du domaine. Sa représentation dans une table est un choix de persistance.
- **« Un objet-valeur n'a pas de comportement. »** Il en a, mais sans effet de bord : une période sait si elle en chevauche une autre.
- **« L'identité est toujours un identifiant technique. »** Elle peut être naturelle (un numéro) ou composite. On la choisit stable et unique dans le tenant.

#### Principe clé

Une entité se reconnaît à son identité et change au fil du temps ; un objet-valeur se reconnaît à ses valeurs, ne change pas, et ne naît jamais invalide.

#### Si vous ne retenez que trois choses

1. Une entité a une identité stable ; un objet-valeur n'a que des valeurs et ne change pas.
2. Un objet-valeur est toujours valide et porte les règles de la valeur.
3. On remplace les types primitifs par des objets-valeurs là où le concept a des règles.

### 3. Explication technique détaillée

#### Comparaison

| Critère | Entité | Objet-valeur |
|---|---|---|
| Défini par | Son identité | Ses valeurs |
| Égalité | Même identité | Mêmes valeurs |
| Mutabilité | Ses attributs changent | Immuable : on le remplace |
| Cycle de vie | Oui : création, évolution, fin | Non |
| Partage | Référence par identifiant | Copie, ou partage sans risque |
| Exemples | Aéronef, tâche de maintenance, utilisateur | Immatriculation, période, intervalle, montant |

#### Des objets-valeurs toujours valides

```typescript
class Registration {
  private constructor(readonly value: string) {}

  // format simplifié pour l'exemple
  static of(raw: string): Registration {
    const v = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]{1,2}-?[A-Z0-9]{3,5}$/.test(v)) throw new InvalidRegistration(raw);
    return new Registration(v);
  }

  equals(other: Registration): boolean { return this.value === other.value; }
}

class InspectionInterval {
  private constructor(readonly days: number) {}

  static ofDays(days: number): InspectionInterval {
    if (!Number.isInteger(days) || days <= 0) throw new InvalidInterval(days);
    return new InspectionInterval(days);
  }

  nextFrom(lastInspection: CalendarDate): CalendarDate {
    return lastInspection.plusDays(this.days);
  }
}

class Period {
  private constructor(readonly start: Instant, readonly end: Instant) {}

  static between(start: Instant, end: Instant): Period {   // intervalle [début, fin)
    if (!start.isBefore(end)) throw new InvalidPeriod(start, end);
    return new Period(start, end);
  }

  overlaps(other: Period): boolean {
    return this.start.isBefore(other.end) && other.start.isBefore(this.end);
  }
}
```

Chaque constructeur refuse une valeur invalide. Le reste du code n'a plus à la revérifier.

#### Une entité

```typescript
class Aircraft {
  private constructor(
    readonly id: AircraftId,                 // identité stable, interne
    private registration: Registration,      // attribut : peut changer
    private status: AircraftStatus,
    private interval: InspectionInterval,
  ) {}

  isSameAs(other: Aircraft): boolean { return this.id.equals(other.id); }

  reRegister(newRegistration: Registration): void {
    this.registration = newRegistration;     // même aéronef, nouvelle immatriculation
  }
}
```

L'**identifiant** est stable et sans signification. L'immatriculation est un **attribut**, car elle peut changer (réimmatriculation) sans que l'aéronef devienne un autre aéronef.

#### Choisir une identité

| Type | Exemple | Avantages | Risques |
|---|---|---|---|
| Identifiant technique | UUID, ULID | Stable, unique, sans signification | Illisible pour les humains |
| Clé naturelle | Immatriculation | Parlante | Peut changer, se dupliquer, être réutilisée |
| Composite | `(tenant_id, id)` | Isolation par tenant (voir [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère)) | Plus lourde |

On retient en général un identifiant technique unique **dans le tenant**, avec la clé naturelle en attribut unique mais modifiable.

#### Un objet-valeur composite dans la plateforme

Dans une plateforme configurable, un objet-valeur est un **type de champ composite** défini par métadonnées (voir [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) et [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)).

```json
{
  "field_types": [
    { "key": "period", "kind": "composite",
      "parts": [ { "key": "start", "type": "datetime" }, { "key": "end", "type": "datetime" } ],
      "constraints": [ "start < end" ] },
    { "key": "money", "kind": "composite",
      "parts": [ { "key": "amount", "type": "decimal(12,2)" },
                 { "key": "currency", "type": "enum", "values": ["EUR", "USD"] } ] }
  ]
}
```

- Le type composite réutilise ses règles dans tous les champs qui l'emploient.
- Il est **stocké** comme des colonnes intégrées ou comme un objet structuré, sans table ni identité propre.
- Un montant utilise un **décimal** et non un flottant, pour éviter les erreurs d'arrondi.

#### Valeur ou entité : une règle pratique

Posez deux questions :

1. **Y a-t-il une histoire à suivre ?** Si l'on doit savoir ce qu'il lui est arrivé, c'est une entité.
2. **Peut-on remplacer un exemplaire par un autre de mêmes valeurs sans conséquence ?** Si oui, c'est un objet-valeur.

Dans le doute, on commence par un objet-valeur : c'est plus simple et plus sûr, et on peut le promouvoir en entité si le besoin d'identité apparaît.

#### Les modes de défaillance

- **L'obsession des primitives** : des entiers et des chaînes pour tout.
- **Des objets-valeurs modifiables**, partagés entre plusieurs entités.
- **Une identité fondée sur un attribut changeant.**
- **Des entités sans identité stable** : des doublons.
- **Un modèle anémique** : des objets sans comportement, avec des règles dans des services.
- **Un objet-valeur promu en entité sans raison**, avec une table et une identité inutiles.

**Contre-exemple.** Un champ « intervalle d'inspection » est un entier. Un import écrit 0 pour des aéronefs sans valeur. Le calcul de l'échéance, qui additionne l'intervalle à la dernière inspection, donne « aujourd'hui » pour tous les aéronefs, et ils apparaissent tous « en retard » le lendemain.

**Limites.** Multiplier les objets-valeurs alourdit le code pour des concepts triviaux : on les réserve à ce qui porte des règles ou un sens. La correspondance avec la base de données et avec les types configurables ajoute un travail de conversion.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement) | La notion de ressource de la plateforme est proche de celle d'entité |
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) et [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Les types de champs et types composites réalisent les objets-valeurs |
| [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) | La composition place des entités et valeurs dans un même ensemble |
| [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère) | Les clés primaires et composites réalisent l'identité |
| [14.2 Langage omniprésent](#142-langage-omniprésent) | Les noms d'entités et d'objets-valeurs viennent du langage omniprésent |
| [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat) | Les entités et les valeurs sont regroupées en agrégats |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Un objet-valeur garantit des invariants locaux |
| [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique) | Le moteur de ressources manipule ces types de champs |

### 5. Application pratique

**Situation initiale.** Le moteur de planification calcule les échéances d'inspection à partir d'un entier `interval_days` et de deux dates `valid_from` et `valid_to`. Plusieurs bugs surviennent : un intervalle nul, une période dont la fin précède le début, des périodes qui se chevauchent sans que l'on s'en aperçoive.

**Problème.** Les règles de ces valeurs sont dispersées, et chaque appelant doit les connaître.

**Application du concept.** Des objets-valeurs `InspectionInterval` et `Period`.

**Déroulé.**

1. L'équipe crée `InspectionInterval` : entier strictement positif, avec la méthode `nextFrom(date)`.
2. Elle crée `Period` : début strictement avant la fin, avec la méthode `overlaps`.
3. Les points d'entrée (formulaires, import, API) construisent ces objets : une valeur invalide est refusée dès la frontière, avec un message précis (voir [12.5 Formulaires et assistants](12-produit-ux.md#125-formulaires-et-assistants)).
4. Les calculs de chevauchement passent par `Period.overlaps`, et non par des comparaisons éparpillées.
5. Dans la plateforme, les deux sont déclarés comme **types composites** : tout champ qui les emploie hérite des règles.

**Résultat.** Plus aucune valeur absurde n'entre. Les règles sont écrites à un seul endroit, et testées une fois.

**Limites.** Les données historiques contiennent déjà des intervalles nuls. Une migration les identifie et les corrige avant d'activer la validation (voir [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une entité et un objet-valeur ?
2. **Compréhension.** Pourquoi un objet-valeur est-il immuable ?
3. **Compréhension.** Qu'est-ce que l'obsession des primitives ?
4. **Pourquoi.** Pourquoi l'immatriculation ne doit-elle pas être l'identité d'un aéronef ?
5. **Raisonnement pratique.** Un « montant » est stocké comme un nombre à virgule flottante. Quels problèmes cela pose-t-il, et que proposez-vous ?

#### Réponses

1. Une entité est définie par son identité : elle reste elle-même quand ses attributs changent. Un objet-valeur est défini par ses valeurs, sans identité, et on le remplace au lieu de le modifier.
2. Parce qu'il peut être partagé et copié sans risque : si on le modifiait, tous ceux qui le référencent seraient affectés. L'immuabilité rend aussi son raisonnement et ses tests plus simples.
3. L'usage de types simples (chaînes, entiers) pour des concepts du domaine, qui disperse les règles de validation et laisse circuler des valeurs absurdes.
4. Parce qu'elle peut changer (réimmatriculation) sans que l'aéronef devienne un autre : l'utiliser comme identité casserait les références et l'historique. On préfère un identifiant stable, avec l'immatriculation en attribut.
5. Les flottants produisent des erreurs d'arrondi sur les sommes. Je propose un objet-valeur `Money` avec un montant décimal et une devise, des opérations qui vérifient la devise, et une règle d'arrondi explicite.

## 14.5 Agrégat et racine d'agrégat

### 1. Comprendre simplement

Un **agrégat** (*aggregate*) est un **groupe d'objets du domaine traités comme une unité** pour les modifications et la cohérence. Il a une **racine** (*aggregate root*), qui est son seul point d'entrée : l'extérieur ne tient que la racine. Les **invariants** (*invariants*) de l'agrégat sont garantis à chaque modification, en une seule transaction.

**Pourquoi cela existe.** Sans frontière, n'importe quel objet peut en modifier un autre, les règles sont contournées, les transactions s'étendent à tout le système, et les verrous bloquent tout le monde. L'agrégat dit ce qui doit être cohérent **immédiatement** (à l'intérieur) et ce qui peut l'être **plus tard** (entre agrégats).

**Problème résolu.** Protéger les règles qui doivent toujours être vraies, avec une frontière de transaction petite et claire.

**Modèle mental.** Un bon de travail et ses lignes. On n'ajoute pas une ligne en cachette : on passe par le bon, qui vérifie que le total des heures reste dans le budget autorisé. Le bon et ses lignes forment un tout, et l'on parle du bon, pas de chaque ligne.

**Où l'analogie s'arrête.** Un bon de travail existe dans le monde. Un agrégat est un **choix de modélisation** : on décide de ses frontières selon les règles à protéger, et ce choix peut être revu.

**Exemple.** `WorkOrder` est la racine. `WorkOrderLine` sont des entités internes. L'invariant est : « la somme des heures prévues ne dépasse pas les heures autorisées ». `Aircraft` est un autre agrégat, que le bon de travail référence uniquement par son identifiant.

**Les composants.**

1. une **racine** unique, point d'entrée ;
2. des **entités et objets-valeurs internes** ;
3. des **invariants** que l'agrégat garantit ;
4. une **frontière transactionnelle** ;
5. des **références par identité** vers les autres agrégats ;
6. des **événements** pour informer les autres agrégats.

**Objectif d'apprentissage :** vous pouvez dessiner un agrégat à partir de ses invariants, formuler les règles de conception, et expliquer pourquoi la cohérence entre agrégats est à terme.

### 2. Connaissances essentielles

#### Définition

- **Agrégat** : ensemble d'entités et d'objets-valeurs traité comme une unité de cohérence et de transaction.
- **Racine d'agrégat** : entité unique de l'agrégat par laquelle passent toutes les modifications, et que l'extérieur est seul autorisé à référencer.
- **Invariant** : règle qui doit être vraie à chaque fois que l'agrégat est observé (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).

#### Idées fondamentales

1. **Un agrégat protège des invariants réels.** Sa frontière est la frontière de cohérence immédiate.
2. **L'accès passe par la racine.** Personne ne modifie une entité interne directement.
3. **Les agrégats sont petits.** On y met ce que les invariants exigent, pas tout ce qui est lié.
4. **On référence les autres agrégats par identité.** Pas par référence d'objet.
5. **Une transaction modifie un seul agrégat.** Les autres suivent ensuite.
6. **La cohérence entre agrégats est à terme.** Elle passe par des événements et, si nécessaire, des sagas (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)).
7. **La concurrence se gère par agrégat.** Une version de l'agrégat détecte les conflits (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

#### Vocabulaire essentiel

- **Frontière de cohérence** (*consistency boundary*) : limite à l'intérieur de laquelle les invariants sont garantis immédiatement.
- **Identité locale** : identité d'une entité interne, valable seulement à l'intérieur de l'agrégat.
- **Identité globale** : identité de la racine, utilisée par l'extérieur.
- **Cohérence à terme** (*eventual consistency*) : cohérence atteinte après un délai, entre agrégats (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
- **Version de l'agrégat** : numéro incrémenté à chaque modification, utilisé pour détecter les conflits.
- **Événement de domaine** : fait important survenu dans l'agrégat (voir [14.6 Événement de domaine](#146-événement-de-domaine)).

#### Relations de cause à effet

- L'agrégat est trop gros. Deux utilisateurs qui modifient des parties différentes se heurtent, les verrous s'étendent, et les performances chutent.
- L'agrégat est trop petit. Un invariant traverse deux agrégats et ne peut plus être garanti immédiatement : des états incohérents apparaissent.
- On modifie une entité interne sans passer par la racine. L'invariant est contourné.
- Les agrégats se référencent par objet. Charger l'un charge les autres en cascade, et le couplage s'étend.

#### Idées reçues

- **« Un agrégat est une table. »** C'est une frontière de cohérence. Elle peut correspondre à plusieurs tables, ou à un document.
- **« Il faut regrouper tout ce qui est lié. »** Non. Le lien métier ne suffit pas : on regroupe ce que les invariants rendent inséparable.
- **« Une transaction peut couvrir plusieurs agrégats. »** Techniquement possible, mais cela contredit le principe : on perd la petite frontière et l'on crée des conflits.

#### Principe clé

L'agrégat est la plus petite unité qui doit être cohérente à chaque instant : on y accède par la racine, on y fait respecter les invariants, et l'on s'accorde avec les autres par des événements.

#### Si vous ne retenez que trois choses

1. Un agrégat est une frontière de cohérence et de transaction, avec une racine unique.
2. On le dessine à partir des invariants à protéger, et on le garde petit.
3. Entre agrégats, on référence par identifiant et l'on se synchronise par événements.

### 3. Explication technique détaillée

#### Dessiner un agrégat

La question directrice est : **quelles règles doivent être vraies à chaque instant, après chaque transaction ?**

| Invariant | Objets concernés | Agrégat |
|---|---|---|
| La somme des heures prévues d'un bon de travail ne dépasse pas les heures autorisées | Bon de travail, ses lignes | `WorkOrder` |
| Un bon vide ne peut pas être libéré | Bon de travail, ses lignes | `WorkOrder` |
| Un aéronef retiré ne peut pas être affecté à un vol | Aéronef | `Aircraft` |
| Une même ressource n'est pas réservée deux fois sur la même période | Réservations d'une ressource | `ResourceSchedule` |

Les objets qui n'ont pas d'invariant commun appartiennent à des agrégats distincts, même s'ils sont liés par le métier.

#### Une racine qui protège

```typescript
class WorkOrder {                                  // racine d'agrégat
  private lines: WorkOrderLine[] = [];             // entités internes
  private events: DomainEvent[] = [];

  private constructor(
    readonly id: WorkOrderId,
    readonly aircraftId: AircraftId,               // référence par identité
    private authorizedHours: Hours,
    private status: WorkOrderStatus,
    private version: number,
  ) {}

  addLine(task: TaskDescription, planned: Hours): void {
    if (this.status !== WorkOrderStatus.Draft) throw new WorkOrderNotEditable(this.id);
    const total = this.plannedHours().plus(planned);
    if (total.greaterThan(this.authorizedHours)) {                // invariant
      throw new AuthorizedHoursExceeded(this.id, total, this.authorizedHours);
    }
    this.lines.push(WorkOrderLine.create(task, planned));
  }

  release(): void {
    if (this.lines.length === 0) throw new EmptyWorkOrder(this.id);   // invariant
    this.status = WorkOrderStatus.Released;
    this.events.push(new WorkOrderReleased(this.id, this.aircraftId));
  }

  private plannedHours(): Hours {
    return this.lines.reduce((sum, l) => sum.plus(l.planned), Hours.zero());
  }
}
```

- L'extérieur n'a **aucun accès** à `lines` : il appelle `addLine`.
- Les invariants sont vérifiés **dans la racine**, avant toute modification.
- L'agrégat référence l'aéronef par `aircraftId`, pas par l'objet.
- L'événement `WorkOrderReleased` est conservé dans l'agrégat et publié après l'enregistrement (voir [14.6 Événement de domaine](#146-événement-de-domaine)).

#### Les règles de conception

| Règle | Raison |
|---|---|
| Modéliser de vrais invariants dans la frontière | Sinon la frontière est arbitraire |
| Concevoir de petits agrégats | Moins de conflits, de verrous, de mémoire |
| Référencer les autres agrégats par identité | Découpler, charger indépendamment |
| Viser la cohérence à terme entre agrégats | Éviter les transactions étendues |

Ces règles sont décrites dans la littérature du DDD (notamment par Vaughn Vernon, dans ses travaux sur la conception des agrégats).

#### La concurrence

La version de l'agrégat détecte les modifications simultanées (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)) :

```sql
UPDATE work_order
SET status = :status, version = version + 1
WHERE tenant_id = :tenant AND id = :id AND version = :expected_version;
-- 0 ligne modifiée : conflit, l'agrégat a changé entre-temps
```

Quand le conflit survient, la commande est rejouée sur l'état actuel, ou refusée avec un message clair (voir [12.5 Formulaires et assistants](12-produit-ux.md#125-formulaires-et-assistants)). Plus l'agrégat est petit, moins il y a de conflits.

#### Entre agrégats

Quand une règle traverse deux agrégats, on ne les modifie pas dans la même transaction. On enchaîne :

```text
transaction 1 : WorkOrder.release()  ──►  enregistre l'état + l'événement WorkOrderReleased
        │
        ▼  publication fiable de l'événement (voir 7.7)
transaction 2 : gestionnaire ──► Aircraft.ground()  (autre agrégat, autre transaction)
        │
        ▼  en cas d'échec : nouvelle tentative, puis compensation (voir 7.11)
```

Entre les deux transactions, il existe une courte période où le bon est libéré et l'aéronef pas encore immobilisé. C'est la **cohérence à terme**. Elle est acceptable quand le métier la tolère, et le modèle doit l'expliciter.

#### Évaluer la taille

| Symptôme | Diagnostic |
|---|---|
| Des utilisateurs se bloquent sur des parties différentes du même agrégat | Trop gros : le découper |
| Une règle exige de modifier deux agrégats ensemble | Frontière mal placée, ou règle non immédiate |
| Un agrégat contient des milliers d'enfants | Trop gros : séparer l'historique, les journaux |
| On charge un agrégat entier pour lire un seul champ | Prévoir un modèle de lecture (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)) |

#### Dans la plateforme

- Un agrégat correspond à une **ressource avec ses ressources enfants** en composition (voir [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation)).
- Le moteur **enregistre la racine et ses enfants dans une seule transaction** (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).
- Les **références** entre ressources se font par identifiant (voir [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)).
- Les règles qui traversent plusieurs ressources utilisent les **événements** et les **sagas** (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)).
- Des **limites** (nombre maximal d'enfants, taille) évitent les agrégats démesurés.

#### Les modes de défaillance

- **L'agrégat géant** : tout est rattaché à l'aéronef, des dizaines de milliers de tâches, de vols, de pièces.
- **Les agrégats atomiques** : un invariant éclaté entre plusieurs agrégats, impossible à garantir.
- **L'accès direct aux entités internes**, qui contourne la racine.
- **Les références par objet**, avec chargement en cascade.
- **Les transactions multi-agrégats** : verrous étendus, conflits fréquents.
- **L'agrégat mimétique de la base** : un agrégat par table, sans regard pour les invariants.

**Contre-exemple.** `Aircraft` contient la liste de tous ses vols, tâches, pièces et constats, soit 50 000 éléments en quelques années. Chaque modification, même d'un simple statut, charge et verrouille tout l'agrégat. Un planificateur et un technicien, qui modifient des choses sans rapport, se bloquent mutuellement toute la journée.

**Limites.** La cohérence à terme demande des gestionnaires, des nouvelles tentatives et des compensations : c'est plus complexe qu'une transaction unique. Certaines règles ne tolèrent pas ce délai ; elles obligent à élargir l'agrégat, ou à choisir un mécanisme de base de données.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants sont ce que l'agrégat garantit |
| [14.4 Entité et objet-valeur](#144-entité-et-objet-valeur) | Entités et objets-valeurs composent l'agrégat |
| [14.6 Événement de domaine](#146-événement-de-domaine) | Les événements de domaine informent les autres agrégats |
| [14.7 Référentiel](#147-référentiel) | Un référentiel charge et enregistre un agrégat entier, par sa racine |
| [2.9 Composition et agrégation](02-donnees-ressources.md#29-composition-et-agrégation) | La composition de la plateforme réalise le regroupement racine et enfants |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | La transaction et le verrouillage optimiste appliquent la frontière |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) et [7.11 Saga](07-evenements-automatisation.md#711-saga) | Cohérence à terme et saga relient les agrégats |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Les modèles de lecture évitent de charger des agrégats pour l'affichage |

### 5. Application pratique

**Situation initiale.** Dans le modèle initial, l'agrégat `Aircraft` contient les tâches de maintenance, les constats et les bons de travail. Planificateurs et techniciens se heurtent en permanence, avec des conflits de version et des verrous longs.

**Problème.** Une seule frontière de cohérence enferme des règles sans rapport.

**Application du concept.** Un redécoupage en agrégats à partir des invariants.

**Déroulé.**

1. L'équipe liste les règles qui doivent être vraies immédiatement : états de l'aéronef (retiré ou non), somme des heures d'un bon de travail, interdiction de libérer un bon vide.
2. Elle en déduit trois agrégats : `Aircraft`, `WorkOrder` (avec ses lignes), `Finding`.
3. Les liens deviennent des **références par identifiant** : `WorkOrder.aircraftId`, `Finding.aircraftId`.
4. Les règles qui traversent les agrégats passent par des événements : la libération d'un bon de travail déclenche l'immobilisation de l'aéronef par un gestionnaire, avec une nouvelle tentative et une compensation en cas d'échec.
5. Les écrans qui montrent l'aéronef avec ses tâches utilisent un **modèle de lecture**.

**Résultat.** Les conflits entre planificateurs et techniciens disparaissent. Chaque transaction est courte, et les invariants de chaque agrégat sont garantis.

**Limites.** Entre la libération du bon et l'immobilisation de l'aéronef, quelques secondes s'écoulent. Le métier a confirmé que ce délai est acceptable, et l'écran affiche « immobilisation en cours » pendant ce temps.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un agrégat, et à quoi sert sa racine ?
2. **Compréhension.** Quelles sont les règles de conception d'un agrégat ?
3. **Compréhension.** Pourquoi référence-t-on les autres agrégats par identité ?
4. **Pourquoi.** Pourquoi vise-t-on la cohérence à terme entre agrégats ?
5. **Raisonnement pratique.** Une règle exige que la somme des montants de deux ressources reste inférieure à un plafond. Comment décidez-vous de la structure ?

#### Réponses

1. Un agrégat est un ensemble d'objets traité comme une unité de cohérence et de transaction. La racine est son unique point d'entrée : elle fait respecter les invariants, et l'extérieur ne référence qu'elle.
2. Modéliser de vrais invariants dans la frontière, concevoir de petits agrégats, référencer les autres agrégats par identité, viser la cohérence à terme entre agrégats.
3. Pour découpler les agrégats : on peut les charger, les enregistrer et les faire évoluer indépendamment, sans chargement en cascade, et les verrous restent petits.
4. Parce qu'une transaction multi-agrégats étend les verrous et les conflits, et bloque l'évolution. La cohérence à terme, par événements, accepte un court délai en échange d'indépendance.
5. Je demande si la règle doit être vraie à chaque instant. Si oui, les deux ressources font partie du même agrégat (ou la règle est portée par une ressource qui les agrège), car l'invariant exige une transaction. Si un court délai est acceptable, j'utilise deux agrégats, avec réservation, événements et compensation.

## 14.6 Événement de domaine

### 1. Comprendre simplement

Un **événement de domaine** (*domain event*) est un **fait important survenu dans le domaine**, exprimé au passé, dans le langage du métier : « Aéronef immobilisé », « Bon de travail libéré ». Il est **immuable**. D'autres parties du système peuvent y réagir sans que l'émetteur les connaisse.

**Pourquoi cela existe.** Beaucoup de règles métier s'énoncent « quand telle chose arrive, alors telle autre » : quand un aéronef est immobilisé, on annule ses affectations, on prévient les planificateurs, on crée des tâches. Si l'agrégat appelle directement chaque réaction, il les connaît toutes, et la transaction s'étend. Un événement rend le fait explicite et découple l'émetteur des réactions.

**Problème résolu.** Propager un changement d'un agrégat ou d'un contexte aux autres, sans les coupler, avec une trace explicite de ce qui s'est passé.

**Modèle mental.** Un communiqué officiel. « Le vol AF-123 a atterri à 10:42 » est un fait accompli, daté. Chaque service lit le communiqué et fait ce qui le concerne : l'escale prépare le débarquement, la maintenance planifie le contrôle, la facturation clôt le vol.

**Où l'analogie s'arrête.** Un communiqué est lu par des humains qui interprètent. Un événement est lu par des programmes qui l'appliquent à la lettre : son contrat (nom, champs, sens) doit être précis, stable et sans données superflues.

**Exemple.** `AircraftGrounded` (« aéronef immobilisé ») est publié quand l'aéronef passe à l'état « En inspection ». Quatre gestionnaires y réagissent : la planification annule les affectations, les notifications préviennent les planificateurs, les tâches de maintenance sont créées, le tableau de bord se met à jour.

**Les composants.**

1. un **nom** au passé, dans le langage du métier ;
2. des **données** utiles au consommateur ;
3. des **métadonnées** : identifiant, instant, tenant, corrélation ;
4. l'**émission** par l'agrégat ;
5. la **publication fiable** après validation de la transaction ;
6. des **consommateurs** indépendants et idempotents.

**Objectif d'apprentissage :** vous pouvez concevoir un événement de domaine bien nommé, distinguer événement et commande, et expliquer comment on le publie de façon fiable.

### 2. Connaissances essentielles

#### Définition

**Événement de domaine** : enregistrement immuable d'un fait métier significatif, survenu à un instant donné, publié par la partie du modèle où il s'est produit, et auquel d'autres parties peuvent réagir.

#### Idées fondamentales

1. **Un événement est un fait passé, pas une intention.** Il dit « c'est arrivé », pas « fais ceci ».
2. **Il porte un nom métier, au passé.** `AircraftGrounded`, pas `AircraftUpdated`.
3. **Il est immuable.** On ne le corrige pas : on en émet un autre.
4. **L'agrégat qui a changé l'émet.** Il est publié après validation de la transaction.
5. **Les consommateurs sont indépendants.** Chacun réagit à sa façon, et on peut en ajouter sans toucher à l'émetteur.
6. **Il est un contrat.** Il a un schéma, une version, et une compatibilité à préserver.
7. **On distingue événement de domaine et événement d'intégration.** Le premier est interne au contexte, le second est public entre contextes.

#### Vocabulaire essentiel

- **Commande** (*command*) : demande d'effectuer une action, qui peut être refusée.
- **Événement d'intégration** (*integration event*) : événement publié à destination d'autres contextes, avec un contrat stable (voir [14.3 Contexte délimité](#143-contexte-délimité)).
- **Boîte d'envoi** (*outbox*) : table où l'événement est enregistré dans la même transaction que le changement d'état (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).
- **Abonné** (*subscriber*) ou **gestionnaire** (*handler*) : composant qui réagit à un événement.
- **Notification d'événement** : événement qui signale un fait et laisse le consommateur chercher les détails.
- **Transfert d'état par événement** (*event-carried state transfer*) : événement qui porte les données utiles, pour éviter un rappel à l'émetteur.
- **Corrélation et causalité** : identifiants qui relient un événement à la requête et à l'événement qui l'ont provoqué.

#### Relations de cause à effet

- Les événements sont de type « mis à jour ». Les consommateurs doivent comparer l'avant et l'après pour comprendre, et l'intention métier est perdue.
- L'événement est publié avant la validation de la transaction. Si la transaction échoue, des consommateurs réagissent à un fait qui n'a pas eu lieu.
- L'événement est publié après, sans mécanisme fiable. Une panne entre les deux perd l'événement, et des systèmes restent désynchronisés.
- Les consommateurs ne sont pas idempotents. La livraison « au moins une fois » produit des doublons d'effets (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- L'événement contient des données personnelles. Il circule, est conservé, et ne peut plus être effacé facilement.

#### Idées reçues

- **« Un événement est un message. »** Le message est le moyen de transport. L'événement est le fait que le message transporte.
- **« Les événements remplacent les commandes. »** Ils les complètent : une commande exprime une intention et peut être refusée, un événement relate un fait.
- **« Il faut faire du sourcing d'événements. »** Non. On peut publier des événements de domaine sans faire des événements la source de vérité (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)).

#### Principe clé

Un événement de domaine est un fait métier passé, nommé dans le langage du domaine, immuable, publié de façon fiable après validation, auquel d'autres parties réagissent sans que l'émetteur les connaisse.

#### Si vous ne retenez que trois choses

1. Un événement est un fait passé, nommé en langage métier, immuable.
2. On le publie de façon fiable après validation, avec une boîte d'envoi.
3. Les consommateurs sont indépendants et idempotents, et le contrat de l'événement est versionné.

### 3. Explication technique détaillée

#### Commande ou événement

| Critère | Commande | Événement |
|---|---|---|
| Sens | Intention : « immobilise l'aéronef » | Fait : « l'aéronef a été immobilisé » |
| Temps | Impératif | Passé |
| Peut être refusé | Oui | Non : c'est déjà arrivé |
| Destinataires | Un seul, identifié | Zéro, un ou plusieurs, inconnus de l'émetteur |
| Exemple | `GroundAircraft` | `AircraftGrounded` |

#### Un événement dans le code et sur le réseau

```typescript
class AircraftGrounded implements DomainEvent {
  readonly type = "aircraft.grounded";
  constructor(
    readonly aircraftId: AircraftId,
    readonly reason: GroundingReason,
    readonly previousStatus: AircraftStatus,
    readonly occurredAt: Instant,
    readonly aggregateVersion: number,
  ) {}
}
```

Publié sur un bus, il prend la forme d'une enveloppe normalisée (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) :

```json
{
  "specversion": "1.0",
  "id": "evt_01HZX4Q8",
  "type": "aircraft.grounded",
  "source": "/tenants/ten_airline_01/aircraft/ac_8f3a",
  "subject": "ac_8f3a",
  "time": "2026-10-13T08:12:45Z",
  "tenantid": "ten_airline_01",
  "correlationid": "req_91ab33",
  "causationid": "cmd_77f0e1",
  "data": {
    "previous_status": "active",
    "new_status": "in_inspection",
    "reason": "Inspection annuelle",
    "aggregate_version": 8
  }
}
```

Le nom de classe suit le langage du domaine (`AircraftGrounded`), le type sur le réseau suit la convention de l'enveloppe (`aircraft.grounded`). `causationid` désigne la commande qui a provoqué l'événement.

#### De l'émission à la consommation

```text
commande ─► agrégat : change d'état et enregistre l'événement dans sa liste interne
              │
              ▼  une seule transaction
        écriture de l'état + écriture de l'événement dans la boîte d'envoi
              │
              ▼  relais (après validation)
        publication sur le bus ──► gestionnaire 1 (planification)
                              ├─► gestionnaire 2 (notifications)
                              └─► gestionnaire 3 (tâches de maintenance)
```

La **boîte d'envoi** garantit qu'il n'y a ni événement fantôme (publié pour un changement annulé) ni événement perdu (changement validé sans publication). La livraison est « au moins une fois », donc les gestionnaires sont idempotents (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Nommer et découper

| Nom | Évaluation | Raison |
|---|---|---|
| `AircraftUpdated` | À éviter | Style CRUD : aucun sens métier, impose de comparer l'avant et l'après |
| `AircraftStatusChanged` | Passable | Technique : il manque la raison métier |
| `AircraftGrounded` | Bon | Fait métier précis, dans le langage du domaine |
| `InspectionOverdueDetected` | Bon | Fait découvert par le système, avec un sens métier |

Règles : **un événement par fait métier significatif**, au passé, avec le verbe du métier. Plusieurs faits distincts ne se cachent pas derrière un événement unique.

#### Que mettre dans l'événement

| Choix | Principe | Avantage | Risque |
|---|---|---|---|
| Notification | Identifiant et type seulement | Léger, peu de données exposées | Les consommateurs rappellent l'émetteur |
| Transfert d'état | Les données utiles sont dans l'événement | Consommateurs autonomes | Contrat plus lourd, données dupliquées |

On choisit le **minimum utile** : les identifiants, le fait, et les données dont la plupart des consommateurs ont besoin. Les **données personnelles** sont évitées : on les référence par identifiant, car un événement conservé ne s'efface pas facilement (voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)).

#### Domaine ou intégration

| Aspect | Événement de domaine | Événement d'intégration |
|---|---|---|
| Portée | Interne au contexte | Entre contextes |
| Contrat | Libre, évolue avec le modèle | Stable, versionné, documenté (langage publié) |
| Contenu | Détails internes autorisés | Seulement ce qui est utile et partageable |
| Exemple | `WorkOrderLineAdded` | `WorkOrderReleased` |

On **traduit** à la frontière : le contexte publie un événement d'intégration construit à partir de ses événements de domaine, sans exposer son modèle interne (voir [14.3 Contexte délimité](#143-contexte-délimité)).

#### Évolution et ordre

- **Compatibilité** : ajouter un champ facultatif est compatible. Retirer ou changer un sens est cassant : on publie un nouveau type, et l'ancien reste disponible pendant la transition (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).
- **Lecture tolérante** : les consommateurs ignorent les champs inconnus.
- **Ordre** : garanti seulement par agrégat (la clé de partition est l'identifiant de l'agrégat). Aucune garantie globale.
- **Doublons** : tolérés et neutralisés par l'idempotence.

#### Dans la plateforme

- Le moteur émet des événements pour les changements d'état et les transitions, avec le type dérivé du **libellé de la transition** du tenant (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).
- Les **règles** et **déclencheurs** configurés par le tenant réagissent à ces événements (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) et [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles)).
- Le **journal d'audit** s'appuie sur les mêmes faits (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- Les types d'événements sont décrits par un **schéma**, versionné avec le modèle du tenant.

#### Les modes de défaillance

- **Des événements CRUD** : « créé », « mis à jour », « supprimé », sans sens métier.
- **Une publication non fiable** : avant validation, ou sans boîte d'envoi.
- **Des événements trop riches**, qui exposent des détails internes ou des données personnelles.
- **Des événements trop pauvres**, qui forcent chaque consommateur à rappeler l'émetteur.
- **Un contrat non versionné**, modifié sans préavis.
- **Des consommateurs non idempotents.**

**Contre-exemple.** Une plateforme émet `ResourceUpdated` avec l'objet complet avant et après. Un consommateur doit détecter si le statut a changé en comparant les deux versions, et découvre un jour que la comparaison échoue quand deux champs changent ensemble. Un autre consommateur, qui lisait un champ renommé, tombe en panne en silence.

**Limites.** Les événements introduisent de l'asynchronisme : l'effet d'un changement n'est pas immédiat. Le débogage demande des outils de traçage (voir [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces)). Un système où tout passe par des événements devient difficile à suivre : on réserve les événements aux faits qui intéressent d'autres parties.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action), [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) et [7.4 Architecture orientée événements](07-evenements-automatisation.md#74-architecture-orientée-événements) | Événement, bus et architecture orientée événements en sont la mécanique |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | L'idempotence des consommateurs neutralise les doublons |
| [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) | Le sourcing d'événements fait des événements la source de vérité |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | La boîte d'envoi transactionnelle fiabilise la publication |
| [14.3 Contexte délimité](#143-contexte-délimité) | Les événements d'intégration sont le langage publié entre contextes |
| [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat) | Les agrégats émettent des événements, et la cohérence entre agrégats passe par eux |
| [14.2 Langage omniprésent](#142-langage-omniprésent) | Le nom d'un événement vient du langage omniprésent |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement des contrats s'applique aux événements |

### 5. Application pratique

**Situation initiale.** La méthode `ground()` de l'aéronef appelle elle-même la planification pour annuler les affectations, le service de notifications, le module de tâches et le tableau de bord. Quand le module de tâches est indisponible, l'immobilisation échoue en entier, ou réussit à moitié.

**Problème.** L'agrégat connaît tous ses consommateurs, et leurs pannes l'affectent.

**Application du concept.** Un événement de domaine `AircraftGrounded`.

**Déroulé.**

1. L'agrégat `Aircraft` change d'état et enregistre `AircraftGrounded` dans sa liste d'événements.
2. La transaction écrit l'état et l'événement dans la boîte d'envoi.
3. Un relais publie l'événement après la validation.
4. Quatre gestionnaires s'abonnent : annulation des affectations (planification), notification, création des tâches, mise à jour du tableau de bord.
5. Chaque gestionnaire est idempotent. Si l'un est en panne, il reprend plus tard, sans bloquer les autres ni l'immobilisation.
6. Un nouveau besoin (alerter le système qualité) ajoute un cinquième gestionnaire, sans toucher à l'aéronef.

**Résultat.** L'immobilisation réussit indépendamment des consommateurs. Les pannes isolées se rattrapent, et le domaine reste découplé.

**Limites.** Les réactions ne sont plus synchrones : le tableau de bord peut afficher l'ancien état quelques secondes. Le métier a validé ce délai (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une commande et un événement ?
2. **Compréhension.** Pourquoi `AircraftUpdated` est-il un mauvais nom d'événement ?
3. **Compréhension.** À quoi sert la boîte d'envoi transactionnelle ?
4. **Pourquoi.** Pourquoi évite-t-on les données personnelles dans les événements ?
5. **Raisonnement pratique.** Un consommateur a traité deux fois le même événement et créé deux tâches. Quelle est la cause, et que faites-vous ?

#### Réponses

1. Une commande exprime une intention (impératif), elle a un destinataire et peut être refusée. Un événement relate un fait passé, il ne peut pas être refusé, et il a zéro, un ou plusieurs abonnés inconnus de l'émetteur.
2. Parce qu'il ne dit rien du sens métier : les consommateurs doivent comparer l'avant et l'après pour comprendre ce qui s'est passé, et l'intention est perdue. Un nom comme `AircraftGrounded` dit le fait.
3. À garantir que l'événement est publié si, et seulement si, le changement d'état est validé : l'événement est écrit dans la même transaction, puis publié par un relais. Il n'y a ni événement fantôme ni événement perdu.
4. Parce qu'un événement est conservé et diffusé : il ne peut pas être modifié, et l'effacement devient difficile. On référence la personne par un identifiant, et le détail reste dans un magasin modifiable.
5. La livraison est « au moins une fois », et le consommateur n'est pas idempotent. Je lui donne une clé de déduplication (identifiant de l'événement) ou une opération naturellement idempotente (création conditionnelle), puis je nettoie les doublons.

## 14.7 Référentiel

### 1. Comprendre simplement

Un **référentiel** (*repository*) donne l'illusion d'une **collection d'agrégats en mémoire** : on y ajoute, on y retrouve par identité, on y enregistre des agrégats, sans que le domaine connaisse la base de données. Il cache la persistance derrière une interface formulée dans le langage du domaine.

**Pourquoi cela existe.** Sans lui, la logique du domaine se mêle de SQL, de tables et de jointures. Changer de base, ou tester le domaine sans base, devient pénible. Les règles fuient dans la persistance, et inversement. Le référentiel sépare **ce que le domaine veut** (« le bon de travail 42 ») de **la façon dont c'est stocké**.

**Problème résolu.** Isoler le modèle du domaine de la technique de stockage, et donner un point d'accès unique et cohérent aux agrégats.

**Modèle mental.** Le préposé aux archives. On lui demande « le dossier de l'aéronef F-ABCD », et on le reçoit complet. On ne sait pas dans quelle armoire il se trouvait. On le rend, et il est reclassé.

**Où l'analogie s'arrête.** Un archiviste comprend des demandes vagues. Un référentiel offre un petit nombre d'opérations précises. Les recherches libres et les rapports passent ailleurs.

**Exemple.** `WorkOrderRepository` propose `byId`, `add`, `save` et `openFor(aircraft)`. Le code du domaine l'utilise sans savoir s'il s'appuie sur une base relationnelle, un document ou une implémentation en mémoire pour les tests.

**Les composants.**

1. une **interface** dans le domaine (un port) ;
2. une **implémentation** dans l'infrastructure (un adaptateur) ;
3. une correspondance entre l'**agrégat** et le **stockage** ;
4. la gestion de la **transaction** et de la **version** ;
5. l'application systématique du **contexte de tenant**.

**Objectif d'apprentissage :** vous pouvez définir l'interface d'un référentiel dans le langage du domaine, expliquer ce qu'il ne doit pas faire, et décrire son rôle dans une plateforme multi-tenant.

### 2. Connaissances essentielles

#### Définition

**Référentiel** : composant qui permet de stocker et de retrouver des agrégats par une interface de collection, en masquant les détails de la persistance.

#### Idées fondamentales

1. **Un référentiel par racine d'agrégat.** Pas un par table, ni un pour tout.
2. **Il charge et enregistre l'agrégat entier.** Jamais des morceaux sans la racine.
3. **Son interface parle le langage du domaine.** `openFor(aircraft)`, pas `selectWhere(...)`.
4. **Il ne contient pas de logique métier.** Les règles sont dans le domaine.
5. **Il applique le tenant en permanence.** L'appelant ne peut pas l'oublier.
6. **Il n'est pas fait pour le reporting.** Les lectures d'affichage passent par des modèles de lecture.
7. **Il se substitue facilement.** Une implémentation en mémoire sert aux tests.

#### Vocabulaire essentiel

- **Port** et **adaptateur** : interface définie par le domaine (port) et implémentation technique (adaptateur).
- **Unité de travail** (*unit of work*) : regroupement des changements d'une transaction.
- **Correspondance objet-relationnel** (*object-relational mapping*, ORM) : conversion entre objets et tables.
- **Modèle de lecture** (*read model*) : structure optimisée pour l'affichage, hors du domaine (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)).
- **Réhydratation** (*rehydration*) : reconstruction d'un agrégat à partir de ses données stockées.
- **Spécification** (*specification*) : critère de sélection exprimé comme objet du domaine.

#### Relations de cause à effet

- Le domaine écrit du SQL. Il devient dépendant de la base, difficile à tester, et les règles se dispersent.
- Le référentiel expose des requêtes génériques pour tout. Le domaine se couple à la structure de la base, et les parties de l'agrégat sont modifiées sans la racine.
- Le filtre de tenant est laissé aux appelants. Un oubli et des données d'un autre tenant sont lues ou modifiées.
- Les écrans demandent des listes avec des jointures au référentiel. Les agrégats sont chargés en entier pour afficher trois champs, et les performances s'effondrent.

#### Idées reçues

- **« Un référentiel est un DAO générique avec des méthodes CRUD sur chaque table. »** Il parle d'agrégats et de langage du domaine, pas de tables.
- **« Il doit fournir toutes les requêtes. »** Les requêtes de lecture et de rapport relèvent d'un modèle de lecture, séparé du modèle d'écriture.
- **« Il est inutile avec un ORM. »** L'ORM est une technique. Le référentiel est la frontière du domaine, qu'il vaut mieux garder.

#### Principe clé

Un référentiel est la frontière de persistance d'un agrégat : une interface de collection dans le langage du domaine, qui charge et enregistre l'agrégat entier, applique le tenant et la concurrence, et ne contient aucune règle métier.

#### Si vous ne retenez que trois choses

1. Un référentiel par racine d'agrégat, avec une interface dans le langage du domaine.
2. Il charge et enregistre l'agrégat entier, applique le tenant et la version, sans logique métier.
3. Les lectures d'affichage et de rapport passent par des modèles de lecture, pas par le référentiel.

### 3. Explication technique détaillée

#### L'interface dans le domaine

```typescript
interface WorkOrderRepository {
  byId(id: WorkOrderId): Promise<WorkOrder | null>;
  add(workOrder: WorkOrder): Promise<void>;
  save(workOrder: WorkOrder): Promise<void>;               // contrôle de version (concurrence optimiste)
  openFor(aircraft: AircraftId): Promise<WorkOrder[]>;     // requête métier nommée
}
```

L'interface est dans le **domaine**. Elle ne dépend d'aucune technique. Les noms de méthodes sont ceux du métier (`openFor`).

#### Une implémentation

```typescript
// Adaptateur d'infrastructure (pseudo-code simplifié)
class SqlWorkOrderRepository implements WorkOrderRepository {
  constructor(
    private db: Db,
    private tenant: TenantContext,       // injecté : l'appelant ne peut pas l'omettre
    private outbox: Outbox,
  ) {}

  async byId(id: WorkOrderId): Promise<WorkOrder | null> {
    const row = await this.db.one(
      "SELECT * FROM work_order WHERE tenant_id = $1 AND id = $2",
      [this.tenant.id, id.value]);
    if (!row) return null;
    const lines = await this.db.many(
      "SELECT * FROM work_order_line WHERE tenant_id = $1 AND work_order_id = $2",
      [this.tenant.id, id.value]);
    return WorkOrderMapper.toDomain(row, lines);          // réhydratation de l'agrégat
  }

  async save(w: WorkOrder): Promise<void> {
    const rec = WorkOrderMapper.toRecord(w);
    const updated = await this.db.execute(
      "UPDATE work_order SET status = $1, version = version + 1 " +
      "WHERE tenant_id = $2 AND id = $3 AND version = $4",
      [rec.status, this.tenant.id, rec.id, rec.expectedVersion]);
    if (updated === 0) throw new ConcurrentModification(w.id);
    await this.replaceLines(rec);                          // dans la même transaction
    await this.outbox.append(w.pullEvents());              // événements de domaine (voir 14.6)
  }
}
```

Trois points : le **tenant** est injecté, la **version** est contrôlée à l'écriture (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)), et les **événements** sont enregistrés dans la même transaction (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).

#### Ce qu'un référentiel n'est pas

| Ce n'est pas | Pourquoi | À la place |
|---|---|---|
| Un accès table par table | Il parle d'agrégats, pas de tables | Un référentiel par racine |
| Un moteur de rapports | Les jointures et agrégations dépassent l'agrégat | Modèle de lecture (voir [7.10 CQRS](07-evenements-automatisation.md#710-cqrs)) |
| Un lieu de règles métier | Les règles sont dans le domaine | Entités, agrégats, services de domaine |
| Un cache implicite | Le cache est une technique, à part | Cache explicite, invalidé par la version |
| Un moyen de modifier une partie d'agrégat | Cela contourne la racine | Charger l'agrégat, appeler la racine, enregistrer |

#### Les requêtes

Le référentiel offre des **requêtes nommées**, qui expriment des besoins métier précis : `openFor(aircraft)`, `overdueSince(date)`. Quand les besoins se multiplient, on évite d'y ajouter des variantes sans fin :

- les **requêtes à plusieurs critères** pour l'affichage vont dans un **modèle de lecture** (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) et [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête)) ;
- les **critères métier réutilisables** peuvent prendre la forme d'objets de **spécification**, qui expriment une règle de sélection dans le langage du domaine.

#### Le multi-tenant

- Le **contexte de tenant** est injecté au référentiel, et appliqué à **chaque** requête (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
- Les **clés composites** incluent le tenant (voir [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère)).
- La **sécurité au niveau des lignes** de la base peut servir de seconde défense (voir [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)).
- Un test d'isolation vérifie qu'un référentiel configuré pour un tenant ne retourne rien d'un autre.

#### La transaction et l'unité de travail

La transaction est ouverte par le **service d'application** (voir [14.8 Service de domaine](#148-service-de-domaine)), pas par le référentiel. Plusieurs opérations de référentiel participent à la même unité de travail :

```text
service d'application ─► ouvre la transaction
   ├─ référentiel.byId(...)         charge l'agrégat
   ├─ agrégat.commande(...)         applique les règles du domaine
   └─ référentiel.save(...)         enregistre l'état, la version et la boîte d'envoi
─► valide la transaction
```

#### Les performances

- **Agrégat entier** : un agrégat de taille raisonnable se charge d'un coup (voir [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat)).
- **Éviter les requêtes en cascade** : charger la racine et ses enfants par un nombre fixe de requêtes.
- **Chargement paresseux** : à manier avec prudence, car il cache des requêtes et rompt la frontière d'agrégat.
- **Mise en cache** : seulement avec une invalidation par version.

#### Dans la plateforme

Le moteur de ressources fournit un référentiel **générique**, parce que le modèle est décrit par métadonnées : `load(type, id)`, `save(resource)`, avec la composition, la version et le tenant gérés pour tous les types (voir [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique)). La généricité est justifiée par la nature de la plateforme. Les besoins de lecture riches passent par le **modèle de requête** (voir [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête)), pas par des méthodes ajoutées au référentiel.

#### Les modes de défaillance

- **Un référentiel par table**, sans notion d'agrégat.
- **Une interface qui fuit** la technique : un constructeur de requêtes ou un objet de l'ORM exposé.
- **Des règles métier dans le référentiel.**
- **Un filtre de tenant optionnel.**
- **Des méthodes de rapport** qui y sont ajoutées sans fin.
- **L'enregistrement partiel** d'un agrégat qui contourne ses invariants.

**Contre-exemple.** Un `Repository<T>` générique expose `findAll()` et `update(id, partialFields)`. Un écran de planification met à jour directement le champ `status` d'une tâche par ce chemin. L'agrégat, ses gardes et ses événements sont contournés. Une tâche passe « clôturée » alors que son bon de travail est encore ouvert.

**Limites.** Le référentiel ajoute une couche, qui n'a de valeur que si le domaine est suffisamment riche. Pour un simple CRUD sans règles, il est superflu, et la généricité d'un moteur de ressources suffit. Une implémentation soignée doit aussi gérer les conversions entre le modèle du domaine et la base.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat) | Le référentiel charge et enregistre des agrégats, par leur racine |
| [14.6 Événement de domaine](#146-événement-de-domaine) | Il enregistre les événements de domaine dans la boîte d'envoi |
| [14.8 Service de domaine](#148-service-de-domaine) | Les services d'application orchestrent les référentiels |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | La transaction et la version protègent l'enregistrement |
| [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique) | Le moteur de ressources fournit un référentiel générique |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) et [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant) | Le contexte de tenant s'applique dans le référentiel |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Les modèles de lecture prennent en charge les besoins d'affichage |
| [2.15 Modèle de requête](02-donnees-ressources.md#215-modèle-de-requête) | Le modèle de requête déclaratif sert les lectures riches |

### 5. Application pratique

**Situation initiale.** Dans le moteur de planification, les services contiennent du SQL pour charger les bons de travail et leurs lignes. Les tests exigent une base de données. Un oubli du filtre de tenant dans une requête de rapport a fait apparaître les bons de travail d'un autre client dans un export.

**Problème.** La persistance est mêlée au domaine, et l'isolation du tenant dépend de la vigilance de chacun.

**Application du concept.** Un référentiel par agrégat, avec le tenant injecté.

**Déroulé.**

1. L'équipe définit l'interface `WorkOrderRepository` dans le domaine, avec les opérations métier.
2. Elle écrit l'adaptateur SQL, qui reçoit le contexte de tenant et l'applique à chaque requête.
3. Les services du domaine ne voient plus de SQL. Les tests utilisent une implémentation en mémoire.
4. Les écrans et exports passent par des modèles de lecture, où le filtre de tenant est lui aussi imposé par la couche d'accès.
5. Un test d'isolation vérifie, pour chaque référentiel, qu'aucune ligne d'un autre tenant n'est accessible.

**Résultat.** Le domaine est testable sans base. L'isolation ne dépend plus des appelants, et une régression est détectée par les tests d'isolation.

**Limites.** Les modèles de lecture doivent être maintenus en parallèle : l'équipe a accepté ce coût pour les écrans fréquents, et laissé le reste aux requêtes générées par le moteur.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un référentiel, et que cache-t-il ?
2. **Compréhension.** Pourquoi y a-t-il un référentiel par racine d'agrégat ?
3. **Compréhension.** Pourquoi le référentiel ne sert-il pas aux rapports ?
4. **Pourquoi.** Pourquoi injecte-t-on le contexte de tenant dans le référentiel plutôt que dans chaque appel ?
5. **Raisonnement pratique.** Un écran doit afficher une liste de 50 aéronefs avec leur nombre de tâches ouvertes. Comment l'alimentez-vous ?

#### Réponses

1. Une interface de collection pour retrouver et enregistrer des agrégats, formulée dans le langage du domaine. Elle cache la technique de persistance (base, tables, requêtes, conversion).
2. Parce que l'agrégat est l'unité de cohérence et de transaction : on le charge et on l'enregistre entier, par sa racine. Accéder aux parties sans la racine contournerait les invariants.
3. Parce que les rapports exigent des jointures et des agrégations qui dépassent un agrégat, et qu'y répondre en chargeant des agrégats entiers serait lent. On utilise un modèle de lecture dédié.
4. Parce que l'isolation ne doit pas dépendre de la vigilance de chaque appelant : en l'injectant une fois, le référentiel l'applique à toutes les requêtes, et l'oubli est impossible.
5. Par un modèle de lecture (ou une requête d'affichage) qui renvoie directement les 50 lignes avec le comptage, filtré par tenant et par permission, sans charger 50 agrégats complets.

## 14.8 Service de domaine

### 1. Comprendre simplement

Un **service de domaine** (*domain service*) est une **opération métier** qui ne trouve pas sa place naturelle dans une entité ou un objet-valeur, parce qu'elle concerne plusieurs objets ou qu'elle exprime à elle seule un concept du métier. Il est **sans état** et porte un nom du langage du domaine.

**Pourquoi cela existe.** Forcer toute la logique dans les entités les déforme : un aéronef qui saurait planifier tous les autres aéronefs n'a plus de sens. Une règle qui implique plusieurs agrégats n'appartient à aucun d'eux. Le service de domaine lui donne une place **explicite dans le modèle**, plutôt qu'un utilitaire technique caché.

**Problème résolu.** Loger les règles qui n'appartiennent à aucun objet précis, sans les disperser dans les couches techniques ni déformer les entités.

**Modèle mental.** Un contrôleur de trafic aérien. Il n'est ni l'avion A, ni l'avion B. Il applique des règles précises pour coordonner plusieurs avions. Il ne garde rien d'un appel à l'autre : tout ce dont il a besoin lui est donné.

**Où l'analogie s'arrête.** Un contrôleur est une personne, avec de la mémoire et du jugement. Un service de domaine est une fonction du domaine sans état : il reçoit des objets du domaine et retourne un résultat, de façon déterministe.

**Exemple.** `InspectionScheduler.nextInspection(aircraft, rules, usage)` calcule la prochaine échéance en combinant le calendrier et les heures de vol. Le calcul concerne l'aéronef, les règles et l'historique d'utilisation : il n'appartient à aucun d'eux seul.

**Les composants.**

1. un **nom** et un verbe du langage du domaine ;
2. des **paramètres** et un **résultat** exprimés en objets du domaine ;
3. l'absence d'**état** ;
4. des **dépendances** par interfaces ;
5. une **distinction** avec les services d'application et d'infrastructure.

**Objectif d'apprentissage :** vous pouvez décider si un comportement appartient à une entité ou à un service de domaine, et distinguer les trois sortes de services.

### 2. Connaissances essentielles

#### Définition

**Service de domaine** : opération sans état du modèle de domaine, qui exprime une règle métier ne relevant naturellement d'aucune entité ni d'aucun objet-valeur, nommée dans le langage du domaine.

#### Idées fondamentales

1. **Le comportement va d'abord dans l'objet concerné.** Entité ou objet-valeur, quand c'est naturel.
2. **Le service de domaine est l'exception justifiée.** Quand l'opération concerne plusieurs agrégats, constitue un concept métier à part, ou applique une politique externe.
3. **Il est sans état.** Tout ce dont il a besoin lui est passé.
4. **Il parle le langage du domaine.** Nom, verbes, paramètres et résultats en termes métier.
5. **Il se distingue du service d'application.** Ce dernier orchestre (transaction, droits, enchaînement) sans contenir de règle.
6. **Il se distingue du service d'infrastructure.** Ce dernier fait de la technique (courriel, base, réseau).
7. **Il évite le modèle anémique.** On ne vide pas les entités de leurs règles pour les mettre dans des services.

#### Vocabulaire essentiel

- **Service d'application** (*application service*) : composant qui exécute un cas d'utilisation : droits, transaction, appels au domaine.
- **Service d'infrastructure** (*infrastructure service*) : composant technique (envoi de courriel, accès à un fichier, appel externe).
- **Modèle anémique** (*anemic domain model*) : modèle dont les objets ne contiennent que des données, et dont la logique est dans des services.
- **Politique** (*policy*) : règle ou stratégie interchangeable, exprimée comme un objet du domaine.
- **Cas d'utilisation** (*use case*) : scénario d'usage d'un acteur, réalisé par un service d'application.
- **Fabrique** (*factory*) : objet qui construit des objets complexes du domaine.

#### Relations de cause à effet

- Toute la logique est mise dans les entités. Elles deviennent démesurées et connaissent les autres agrégats, ce qui casse les frontières.
- Toute la logique est mise dans des services. Les entités ne sont plus que des sacs de données : le modèle est anémique, les règles sont dispersées, et les invariants peuvent être contournés.
- Une règle de domaine est placée dans un service d'application. Elle est mêlée aux droits et aux transactions, et se teste difficilement.
- Un service de domaine garde de l'état. Son comportement dépend de l'historique des appels, et devient imprévisible et difficile à tester.

#### Idées reçues

- **« Un service, c'est une classe qui fait quelque chose. »** Le service de domaine est précis : il porte une règle métier, dans le langage du domaine.
- **« Les services de domaine remplacent les entités riches. »** Non. Le comportement va dans l'entité quand c'est naturel.
- **« Un service de domaine peut appeler la base. »** Non. Il travaille sur des objets du domaine. L'accès à la base passe par un référentiel, dans le service d'application.

#### Principe clé

Un comportement va dans l'entité ou la valeur qui le concerne ; s'il traverse plusieurs objets ou exprime un concept en soi, il devient un service de domaine, sans état, nommé dans le langage du métier.

#### Si vous ne retenez que trois choses

1. Le service de domaine porte une règle métier qui n'appartient à aucun objet seul, sans état.
2. Il se distingue du service d'application (orchestration) et du service d'infrastructure (technique).
3. On y recourt par exception : le comportement va d'abord dans les entités et les objets-valeurs.

### 3. Explication technique détaillée

#### Où placer un comportement

```text
Le comportement concerne-t-il un seul objet ?
   ├─ oui ─► méthode de l'entité ou de l'objet-valeur
   └─ non ─►  Concerne-t-il plusieurs agrégats ou un concept métier à part ?
                ├─ oui ─► service de domaine
                └─ non ─►  Orchestre-t-il droits, transaction, enchaînement ?
                             ├─ oui ─► service d'application
                             └─ non ─► Appelle-t-il l'extérieur (courriel, base, fichier) ?
                                          └─ oui ─► service d'infrastructure
```

#### Les trois sortes de services

| Sorte | Rôle | Contient des règles métier ? | A de l'état ? | Exemple |
|---|---|---|---|---|
| Domaine | Règle métier hors des objets | Oui | Non | `InspectionScheduler` |
| Application | Cas d'utilisation : droits, transaction, enchaînement | Non | Non | `GroundAircraftHandler` |
| Infrastructure | Technique : message, base, fichier | Non | Parfois (connexions) | `EmailSender`, `SqlWorkOrderRepository` |

#### Un service de domaine

```typescript
// Service de domaine : sans état, types du domaine, règle métier
class InspectionScheduler {
  nextInspection(
    aircraft: Aircraft,
    rules: InspectionRules,
    usage: UsageHistory,
  ): CalendarDate {
    const interval = rules.intervalFor(aircraft.type());
    const byCalendar = aircraft.lastInspection().plusDays(interval.days);
    const byHours = usage.dateWhenHoursReach(
      aircraft.hoursAtLastInspection().plus(rules.hoursLimitFor(aircraft.type())));
    return CalendarDate.earliest(byCalendar, byHours);     // la première des deux limites atteinte
  }
}
```

Il reçoit tout en paramètres, ne lit pas la base, ne garde rien, et se teste sans infrastructure. La règle (« la première des deux limites atteinte ») est exprimée une seule fois, en termes métier.

#### Un service d'application

```typescript
class GroundAircraftHandler {                    // service d'application : orchestre
  constructor(
    private aircrafts: AircraftRepository,
    private authz: Authorization,
    private tx: UnitOfWork,
  ) {}

  async handle(cmd: GroundAircraft, actor: Actor): Promise<void> {
    this.authz.require(actor, "transition:ground", cmd.aircraftId);   // droits
    await this.tx.run(async () => {
      const aircraft = await this.aircrafts.byId(cmd.aircraftId);     // charge (voir 14.7)
      aircraft.ground(cmd.reason);                                    // règle : dans le domaine
      await this.aircrafts.save(aircraft);                            // enregistre + événements
    });
  }
}
```

Le service d'application **ne décide de rien** : il vérifie les droits, ouvre la transaction, charge l'agrégat, appelle le domaine, et enregistre.

#### Les politiques

Un service de domaine peut dépendre d'une **politique** interchangeable, par exemple un calcul d'échéance propre à un tenant. La politique est un objet du domaine, fourni par la configuration :

- une **formule** configurable (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)) ;
- une **table de décision** (voir [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision)) ;
- un **appel au moteur de règles** (voir [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles)) ;
- une **extension** fournie par le tenant (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

Le service garde la même signature, et seul le comportement choisi par le tenant change.

#### Pourquoi sans état

- **Prévisible** : le même appel avec les mêmes paramètres donne le même résultat.
- **Testable** : on le teste avec des objets du domaine, sans base ni réseau.
- **Rejouable** : on peut recalculer une décision passée avec la version des règles de l'époque (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).
- **Simultané** : aucun état partagé à protéger.

#### Dans la plateforme

- Beaucoup de services de domaine d'un tenant sont des **règles configurées** : calculs d'échéances, d'éligibilité, de priorité (voir [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité) et [6.9 Table de décision](06-workflow-etat-regles.md#69-table-de-décision)).
- Les cas qui sortent de la configuration deviennent des **extensions** avec un contrat (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) et [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).
- Les services d'application du moteur correspondent aux **cas d'usage génériques** : créer, transiter, archiver (voir [3.12 Assembler un Resource Engine générique](03-crud-runtime-ressources.md#312-assembler-un-resource-engine-générique)).
- Les services d'infrastructure sont les **adaptateurs** : notification, connecteurs, stockage (voir [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)).

#### Les modes de défaillance

- **Le service fourre-tout** (`MaintenanceManager`, `AircraftService`) : tout y passe.
- **Le modèle anémique** : les entités sans comportement, les règles dans des services.
- **Un service de domaine avec de l'état.**
- **Un service de domaine qui accède à la base** ou au réseau.
- **Des règles dans le service d'application**, mêlées aux droits et aux transactions.
- **Un nom technique** (`Helper`, `Processor`) qui masque le concept métier.

**Contre-exemple.** Un `AircraftService` de 4 000 lignes contient le calcul des échéances, l'affectation aux vols, l'envoi de notifications, la facturation interne et l'accès à la base. Personne n'ose le modifier. Les entités n'ont que des getters et des setters, et les mêmes règles sont dupliquées dans trois endroits.

**Limites.** La frontière entre une méthode d'entité et un service de domaine est un jugement : deux équipes peuvent la placer différemment. Trop de services de domaine mène à l'anémie. Trop peu déforme les entités. On corrige en revoyant le langage et les invariants.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.4 Entité et objet-valeur](#144-entité-et-objet-valeur) et [14.5 Agrégat et racine d'agrégat](#145-agrégat-et-racine-dagrégat) | Le comportement va d'abord dans les entités, les valeurs et les agrégats |
| [14.7 Référentiel](#147-référentiel) | Les services d'application orchestrent les référentiels |
| [14.6 Événement de domaine](#146-événement-de-domaine) | Les cas d'utilisation produisent et publient des événements |
| [14.2 Langage omniprésent](#142-langage-omniprésent) | Le nom du service vient du langage omniprésent |
| [6.7 Condition et éligibilité](06-workflow-etat-regles.md#67-condition-et-éligibilité) à [6.10 Moteur de règles](06-workflow-etat-regles.md#610-moteur-de-règles) | Éligibilité, expressions, tables de décision et moteur de règles réalisent des services de domaine configurés |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | La frontière entre configuration et code décide si un service est configuré ou codé |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les politiques sont des services de domaine évalués par un moteur |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions fournissent des services de domaine propres à un tenant |

### 5. Application pratique

**Situation initiale.** Le calcul de la prochaine inspection est dupliqué : une fois dans le contrôleur de l'écran de planification, une fois dans une procédure SQL du tableau de bord, une fois dans le service de notification. Les trois résultats diffèrent dans les cas limites, par exemple quand l'aéronef atteint d'abord sa limite d'heures de vol.

**Problème.** Une règle métier importante n'a pas de place dans le modèle, et chaque couche la réécrit à sa manière.

**Application du concept.** Un service de domaine `InspectionScheduler`.

**Déroulé.**

1. L'équipe nomme la règle avec les experts : « la prochaine inspection est la première des deux limites atteinte, calendaire ou en heures de vol ».
2. Elle l'écrit comme service de domaine, sans état, avec des objets du domaine en paramètres.
3. Elle écrit des tests qui couvrent les cas limites : limite calendaire atteinte d'abord, limite d'heures d'abord, absence de données d'usage.
4. Le contrôleur, la procédure du tableau de bord et le service de notification appellent désormais le même service.
5. Pour un tenant qui applique une règle différente, une **politique** configurée fournit les intervalles et les limites (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

**Résultat.** Un seul calcul, un seul endroit, et les trois affichages concordent. Les experts peuvent relire la règle, car elle est écrite dans leur langage.

**Limites.** Le calcul dépend de l'historique d'usage : la qualité des données d'heures de vol conditionne la qualité du résultat, et le service ne peut pas la garantir.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quand un comportement doit-il devenir un service de domaine ?
2. **Compréhension.** Quelle différence y a-t-il entre un service de domaine et un service d'application ?
3. **Compréhension.** Pourquoi un service de domaine est-il sans état ?
4. **Pourquoi.** Pourquoi faut-il éviter de tout mettre dans des services ?
5. **Raisonnement pratique.** Une règle de calcul de priorité utilise l'aéronef, la tâche et les règles du tenant. Où la placez-vous ?

#### Réponses

1. Quand il ne trouve pas sa place naturelle dans une entité ou un objet-valeur : parce qu'il traverse plusieurs agrégats, qu'il constitue un concept métier en soi, ou qu'il applique une politique externe.
2. Le service de domaine contient une règle métier, sans état, avec des objets du domaine. Le service d'application orchestre un cas d'utilisation (droits, transaction, chargement, enregistrement) sans contenir de règle.
3. Pour qu'il soit prévisible, testable sans infrastructure, rejouable, et sûr en accès simultané : le même appel avec les mêmes paramètres donne toujours le même résultat.
4. Parce que les entités deviennent de simples sacs de données (modèle anémique) : les règles sont dispersées, dupliquées, et les invariants peuvent être contournés par n'importe quel appelant.
5. Dans un service de domaine, car la règle croise l'aéronef, la tâche et une politique du tenant, et n'appartient à aucun de ces objets seul. La politique est fournie par la configuration, et le service est sans état.

