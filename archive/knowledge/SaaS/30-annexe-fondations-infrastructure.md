# Module 30 — Annexe A : fondations d'infrastructure

> **Question directrice.** Sur quelles briques d'infrastructure repose la plateforme, et lesquelles de leurs propriétés se retrouvent dans ses garanties ?

## Présentation du module

**Objectif.** Les modules précédents s'appuient, sans toujours les décrire, sur des briques d'infrastructure : une base de données, un stockage, un réseau, des machines, un fournisseur de cloud. Le parcours en retient ce qui sert à son propos : les transactions ([3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)), le théorème CAP ([1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)), la distinction entre IaaS, PaaS et SaaS ([1.1 SaaS](01-architecture-saas.md#11-saas)). Il ne présente ni les familles de bases de données, ni le réseau, ni les modèles d'exécution. Cette annexe comble ce vide pour un public débutant, en six sujets : les **familles de bases de données**, les **types de stockage**, la **réplication, le partitionnement et les modèles de cohérence**, les **bases du réseau**, les **modèles d'exécution et l'orchestration de conteneurs**, et enfin les **services gérés ou auto-gérés, avec les régions et les zones de disponibilité**. Le fil conducteur : chaque brique a des propriétés (ce qu'elle garantit, ce qu'elle coûte, ce qu'elle permet), et ces propriétés remontent jusqu'aux promesses que la plateforme fait à ses clients.

**Prérequis.** Le SaaS et la distinction entre sur site, IaaS, PaaS et SaaS ([1.1 SaaS](01-architecture-saas.md#11-saas)), les systèmes distribués et le théorème CAP ([1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)), les transactions et l'atomicité ([3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)), la tolérance aux pannes, la redondance et le basculement ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)). Sont utiles la disponibilité ([11.7 Disponibilité, fiabilité et résilience](11-securite-fiabilite-operations.md#117-disponibilité-fiabilité-et-résilience)), la sauvegarde ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)), la reprise après sinistre ([11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto)), les réplicas de lecture ([22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication)), le partitionnement ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)) et le multi-région ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).

**Un mot, plusieurs sens.** Cinq mots changent de sens d'une brique à l'autre. La **cohérence** désigne tantôt le respect des règles d'intégrité après une transaction (le « C » d'ACID, [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)), tantôt la propriété du théorème CAP, qui exige que chaque lecture voie la dernière écriture ([1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)), tantôt la convergence de copies dans le temps ([7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)). Une **partition** est un morceau de données ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)), une coupure du réseau ([1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)) ou un segment d'un journal d'événements ([28.3 Plateforme de flux d'événements, partitions et groupes de consommateurs](28-interoperabilite-avancee.md#283-plateforme-de-flux-dévénements-partitions-et-groupes-de-consommateurs)). Une **instance** est une machine virtuelle, un exemplaire d'une base ou un exemplaire d'un service. Une **zone** est une zone de disponibilité chez un fournisseur, ou une zone du système de noms de domaine. Un **conteneur** est un conteneur d'objets dans un stockage ([30.2 Types de stockage](#302-types-de-stockage)), ou un conteneur d'application ([30.5 Modèles d'exécution et orchestration de conteneurs](#305-modèles-dexécution-et-orchestration-de-conteneurs)). Le module précise chaque fois le sens retenu.

**Ordre retenu.** Trois groupes : les données, la circulation et l'exécution, l'exploitation.

```text
Données        familles de bases ─ types de stockage ─ réplication, partitionnement, cohérence
Circulation    réseau : noms, chiffrement, répartition, proxy inverse, réseau privé ─ modèles d'exécution, conteneurs
Exploitation   services gérés ou auto-gérés ─ régions et zones de disponibilité
```

| Groupe | Question de l'équipe |
|---|---|
| Données | Où range-t-on chaque donnée, sous quelle forme, avec combien de copies, et que promet-on à celui qui la lit ? |
| Circulation et exécution | Comment une requête atteint-elle le code, et sur quel type de machine ce code s'exécute-t-il ? |
| Exploitation | Qui fait fonctionner chaque brique, et dans quels lieux physiques ? |

**Références.** Les documentations, normes et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Les noms de produits sont cités parce que leurs documentations ont été consultées, non pour établir un classement. Les chiffres des exemples sont fictifs ; les résultats de calcul présentés ont été obtenus par exécution des extraits donnés. Les valeurs propres à un fournisseur (limites, taux de panne, nombre de zones) sont celles de sa documentation à la date de consultation et peuvent changer.

## Sommaire du module

- [30.1 Familles de bases de données](#301-familles-de-bases-de-données)
- [30.2 Types de stockage](#302-types-de-stockage)
- [30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence)
- [30.4 Bases du réseau](#304-bases-du-réseau)
- [30.5 Modèles d'exécution et orchestration de conteneurs](#305-modèles-dexécution-et-orchestration-de-conteneurs)
- [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)

## 30.1 Familles de bases de données

### 1. Comprendre simplement

Une **famille de bases de données** (*database families*) est une catégorie de logiciels de stockage qui partagent une façon d'organiser les données et, par conséquent, un ensemble de questions auxquelles ils répondent vite. Six familles couvrent l'essentiel : la famille **relationnelle** (*relational*), la famille **document** (*document*), la famille **clé-valeur** (*key-value*), la famille **colonnes larges** (*wide-column*), la famille **graphe** (*graph*) et la famille **recherche** (*search*). Le terme **NoSQL** regroupe, de façon commode, les familles qui ne sont pas relationnelles ; il ne décrit pas une technique précise.

**Pourquoi cela existe.** Aucune organisation des données n'est la meilleure pour toutes les questions. Un tableau à lignes et à colonnes se prête aux jointures et aux règles d'intégrité. Un bloc complet, lu et écrit d'un seul geste, convient à une entité qui se consulte toujours en entier. Un simple carnet d'étiquettes (une clé, une valeur) est immédiat à consulter. Un graphe suit des liens. Un index de mots retrouve les textes qui les contiennent. Chaque famille rend l'une de ces opérations naturelle et rapide.

**Problème résolu.** Choisir un lieu de stockage adapté à la forme des données et à la façon de les interroger, plutôt que de tout faire entrer dans un seul modèle.

**Modèle mental.** Une bibliothèque municipale. Le **catalogue à fiches** classe chaque ouvrage par colonnes (titre, auteur, cote) et se recoupe d'un fichier à l'autre : c'est le relationnel. Le **dossier de chaque lecteur** réunit dans une chemise tout ce qui le concerne : c'est le document. Le **vestiaire** rend un manteau contre un numéro, sans poser de question : c'est la clé-valeur. Le **registre par rayonnage** note, pour chaque rayonnage, des fiches très larges : c'est la colonne large. La **carte des renvois** entre ouvrages (qui cite qui) est le graphe. L'**index alphabétique des mots**, à la fin d'un livre, est l'index de recherche.

**Où l'analogie s'arrête.** Dans une bibliothèque, chaque service occupe un lieu distinct. En informatique, un même produit peut offrir plusieurs modèles : PostgreSQL range aussi des documents JSON indexés, et DynamoDB, qui se décrit comme NoSQL, offre des transactions ACID. Les frontières entre familles sont poreuses, et les garanties dépendent du produit et de sa configuration.

**Exemple.** Alpha Air enregistre le constat `fd_204` (une fissure sur la bague du train gauche de l'aéronef F-ABCD). La plateforme le range dans une table relationnelle, avec ses règles d'intégrité. La session de Karim vit dans un magasin clé-valeur. Le texte du constat est copié dans un index de recherche, pour que Nadia le retrouve en tapant des mots. Ce sont trois magasins de natures différentes, et une seule source de vérité : la table.

**Les composants.**

1. un **modèle de données** : tables, documents, paires, colonnes, nœuds, termes ;
2. un **langage ou une interface** d'interrogation ;
3. des **index**, qui rendent certaines questions rapides ;
4. des **garanties** : transactions, cohérence, durabilité ([30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence)) ;
5. un **mode de répartition** : réplication et partitionnement ([30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence)) ;
6. un **mode d'exploitation** : géré ou auto-géré ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)).

**Objectif d'apprentissage :** vous pouvez nommer six familles de bases de données, dire pour chacune ce qu'elle fait bien et ce qu'elle fait mal, et justifier le choix d'une famille pour un besoin donné.

### 2. Connaissances essentielles

#### Définition

- **Famille de bases de données** : catégorie de systèmes de stockage qui partagent un modèle de données et des compromis (types de requêtes favorisées, garanties, mode de répartition).
- **Source de vérité** (*source of truth*) : magasin dont les données font foi ; les autres magasins en sont des copies dérivées, que l'on peut reconstruire.

#### Idées fondamentales

1. **Le modèle de données détermine les questions faciles.** Une jointure est naturelle en relationnel, un parcours de liens en graphe, une recherche par mots dans un index inversé.
2. **Le relationnel est un point de départ raisonnable.** Il offre contraintes, transactions et requêtes souples. Martin Fowler écrivait en 2011 que la plupart des projets sont probablement encore mieux servis par une base relationnelle.
3. **Les familles se recouvrent.** PostgreSQL stocke du JSON indexé ; DynamoDB propose des transactions ACID.
4. **Plusieurs magasins coexistent souvent.** C'est la persistance polyglotte, au prix d'une complexité accrue.
5. **Un index de recherche est une copie dérivée.** On le reconstruit à partir de la source de vérité ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).
6. **On choisit sur les accès, la cohérence, l'échelle et l'exploitation**, non sur la nouveauté d'un produit.

#### Vocabulaire essentiel

- **Relationnel** (*relational*) : données en tables liées par des clés, interrogées en SQL.
- **Document** (*document*) : enregistrement structuré et imbriqué, souvent en JSON, lu et écrit d'un bloc.
- **Clé-valeur** (*key-value*) : accès à une valeur par sa clé exacte, sans interroger le contenu de la valeur.
- **Colonnes larges** (*wide-column*) : lignes retrouvées par une clé de partition, avec un grand nombre de colonnes possibles.
- **Graphe** (*graph*) : nœuds reliés par des relations typées et orientées, qui portent des propriétés.
- **Recherche** (*search*) : documents dont les mots sont indexés pour retrouver ceux qui les contiennent, avec un classement.
- **NoSQL** : terme parapluie pour les bases non relationnelles.
- **Persistance polyglotte** (*polyglot persistence*) : usage de plusieurs technologies de stockage, chacune choisie selon l'usage de ses données.
- **Index inversé** (*inverted index*) : liste de tous les mots distincts, chacun relié aux documents qui le contiennent ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé)).

#### Relations de cause à effet

- On choisit un magasin de documents pour des données très reliées. Chaque lien devient une recopie ou une seconde requête, et la cohérence entre documents se gère à la main.
- On fait d'un index de recherche la source de vérité. Une réindexation ou un incident le fait diverger, et des données disparaissent sans trace.
- On multiplie les familles sans raison précise. Chaque technologie ajoute une interface, des sauvegardes, des compétences et des pannes propres.
- On force une famille à un usage qui n'est pas le sien (des jointures lourdes sur un magasin clé-valeur). Le code de l'application refait mal ce que le moteur ferait bien.

#### Idées reçues

- **« NoSQL veut dire sans garanties. »** Non. Le terme regroupe des produits très différents : DynamoDB, qui se décrit comme NoSQL, propose des transactions ACID et des lectures fortement cohérentes.
- **« Une base sans schéma n'a pas de structure. »** Non. La structure existe dans le code ou les conventions. MongoDB permet d'ajouter une validation de schéma là où l'on veut plus de contrôle, et la documentation de PostgreSQL recommande que les documents JSON gardent une structure à peu près fixe.
- **« Il faut une base différente par besoin. »** Non. Une seule famille suffit à beaucoup de besoins ; on en ajoute une quand un accès précis l'exige.
- **« L'index de recherche peut remplacer la base. »** Non. C'est une copie construite pour répondre vite à une question ; elle n'a pas à porter les règles d'intégrité ni l'historique.

#### Principe clé

Chaque famille rend une opération naturelle : on part du relationnel, on ajoute une famille quand un accès précis l'exige, et l'on désigne toujours une source de vérité.

#### Si vous ne retenez que trois choses

1. Les six familles diffèrent par leur modèle de données, donc par les questions qu'elles rendent faciles.
2. Le relationnel est le choix par défaut ; une autre famille se justifie par un accès précis.
3. Un index de recherche ou un cache est une copie dérivée : la source de vérité est ailleurs.

### 3. Explication technique détaillée

#### Le relationnel

PostgreSQL se présente comme un système de gestion de bases de données objet-relationnel qui prend en charge une grande partie du standard SQL et qui est extensible : types, fonctions, opérateurs, méthodes d'index. Les données y sont rangées en tables, les lignes sont identifiées par des clés, les liens sont des clés étrangères, et des contraintes refusent les écritures incohérentes ([2.10 Modélisation relationnelle et diagramme entité-relation](02-donnees-ressources.md#210-modélisation-relationnelle-et-diagramme-entité-relation), [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère), [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)). Un fait n'est écrit qu'une fois, et les jointures le recomposent. Les transactions ([3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)) regroupent plusieurs écritures en un tout.

```sql
CREATE TABLE aircraft (
  id           text PRIMARY KEY,
  registration text NOT NULL UNIQUE
);

CREATE TABLE finding (
  id          text PRIMARY KEY,
  tenant_id   text NOT NULL,
  aircraft_id text NOT NULL REFERENCES aircraft (id),
  severity    text NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  custom      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX finding_custom_gin ON finding USING GIN (custom jsonb_path_ops);

SELECT f.id, a.registration
FROM finding AS f
JOIN aircraft AS a ON a.id = f.aircraft_id
WHERE f.tenant_id = 'ten_airline_01'
  AND f.custom @> '{"ata_chapter": "32"}';
```

La clé étrangère interdit un constat sur un aéronef qui n'existe pas ; la contrainte `CHECK` limite la gravité à trois valeurs ; la colonne `custom` accueille les champs personnalisés d'un tenant ([2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)). D'après la documentation de PostgreSQL, le type `jsonb` est stocké sous forme binaire décomposée : un peu plus lent à l'écriture, nettement plus rapide à traiter, et il prend en charge l'indexation. La classe d'opérateurs `jsonb_path_ops` accepte l'opérateur de contenance `@>` et produit en général un index plus petit que la classe par défaut. Une mise à jour verrouille la ligne entière : la documentation conseille de limiter la taille des documents.

#### Le document

La documentation de MongoDB pose un principe : les données accédées ensemble sont stockées ensemble. Les documents d'une même collection n'ont pas besoin des mêmes champs ; une valeur peut être un document imbriqué ou un tableau. Les relations se modélisent par imbrication ou par référence, et l'imbrication évite des jointures entre collections.

```json
{
  "_id": "fd_204",
  "tenant_id": "ten_airline_01",
  "aircraft": { "id": "ac_8f3a", "registration": "F-ABCD" },
  "severity": "major",
  "title": "Fissure sur la bague du train d'atterrissage gauche",
  "attachments": [
    { "name": "photo_01.jpg", "object_key": "ten_airline_01/fd_204/photo_01.jpg" }
  ],
  "custom": { "ata_chapter": "32" }
}
```

Le constat se lit en un seul accès, avec son aéronef et ses pièces jointes. Le prix : le numéro d'immatriculation est recopié dans chaque document, et le changer demande de modifier tous les documents concernés. La documentation de MongoDB oppose ce modèle à un schéma relationnel fixé à l'avance et qui exige souvent des jointures.

#### Clé-valeur

La documentation de Redis le décrit comme un serveur de structures de données : au-delà des chaînes, il offre des tables de hachage, des listes, des ensembles, des ensembles triés et des flux. Il sert à la mise en cache, aux files et au traitement d'événements. Une clé peut recevoir une durée de vie : passé ce délai, elle est supprimée automatiquement. Redis propose plusieurs modes de persistance : des instantanés à intervalles (RDB), un journal de toutes les écritures (AOF), les deux, ou aucun, parfois choisi pour un cache. Avec les instantanés seuls, la documentation prévient que l'on doit s'attendre à perdre les dernières minutes en cas d'arrêt brutal ; avec le journal synchronisé chaque seconde, jusqu'à une seconde d'écritures.

```text
clé                                          valeur                                        durée de vie
session:7c91                                 {"user":"u_karim","tenant":"ten_airline_01"}  30 min
ratelimit:ten_airline_01:2026-10-14T09:12    42                                            60 s
```

DynamoDB offre à la fois des modèles clé-valeur et document. La documentation précise qu'il ne propose pas d'opérateur `JOIN` et recommande de dénormaliser le modèle pour réduire les allers-retours.

#### Colonnes larges

La documentation d'Apache Cassandra décrit un modèle de stockage en colonnes larges partitionné, avec une sémantique de cohérence à terme. La **clé de partition**, partie obligatoire de la clé primaire, détermine le nœud qui stocke la ligne : les requêtes efficaces la fournissent. Un espace de clés (*keyspace*) fixe la stratégie de réplication. La famille convient à de très gros volumes d'écritures lus par clé ; elle convient mal aux requêtes quelconques, qui parcourent toutes les partitions ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)).

#### Graphe

La documentation de Neo4j décrit le **graphe de propriétés** : des **nœuds** (qui portent zéro, une ou plusieurs étiquettes), des **relations** (chacune a un type et un sens, entre un nœud source et un nœud cible) et des **propriétés** (paires clé-valeur) portées par les deux. Une requête **parcourt** le graphe en suivant des relations.

```text
(Karim:Technicien) ─[:ASSIGNÉ_À]─► (mt_1042:Tâche) ─[:SUR]─► (ac_8f3a:Aéronef)
(fd_204:Constat)   ─[:SIGNALÉ_SUR]─► (ac_8f3a:Aéronef)
(fd_204:Constat)   ─[:A_GÉNÉRÉ]─► (mt_1042:Tâche)
```

Poser « quelles tâches concernent des aéronefs ayant un constat critique ouvert ? » revient à suivre deux relations, puis à filtrer sur les propriétés du constat. En relationnel, cela s'écrit avec des jointures, ou avec une requête récursive quand la profondeur varie ([27.7 Vocabulaires contrôlés et graphe de propriétés](27-types-donnees-specialises.md#277-vocabulaires-contrôlés-et-graphe-de-propriétés)). Le graphe devient intéressant quand la profondeur est variable et que les liens sont la question elle-même ; les droits fondés sur les relations ([4.17 ReBAC](04-identite-iam-autorisation.md#417-rebac)) en sont un exemple.

#### Recherche

La documentation d'Elasticsearch décrit des documents rangés dans des index, découpés en fragments répartis sur des nœuds ; chaque fragment repose sur la bibliothèque Apache Lucene et stocke ses données dans des segments immuables. Un paramètre (`index.refresh_interval`, 1 s par défaut) fixe la fréquence à laquelle les nouvelles données deviennent cherchables : la recherche est donc quasi immédiate, pas instantanée. Le principe de l'**index inversé** est ancien et simple : une liste de tous les mots distincts, chacun relié aux documents qui le contiennent.

```typescript
interface Doc {
  id: string;
  text: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

function buildIndex(docs: Doc[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const d of docs) {
    for (const term of tokenize(d.text)) {
      let ids = index.get(term);
      if (!ids) {
        ids = new Set<string>();
        index.set(term, ids);
      }
      ids.add(d.id);
    }
  }
  return index;
}

function search(index: Map<string, Set<string>>, query: string): string[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  let result: Set<string> | null = null;
  for (const t of terms) {
    const ids = index.get(t) ?? new Set<string>();
    result = result === null ? new Set(ids) : new Set([...result].filter((id) => ids.has(id)));
  }
  return [...(result ?? [])].sort();
}
```

Sur trois textes de constats (fissure sur le train gauche, usure d'un câble de commande, fuite hydraulique sur le train avant), l'index compte 19 termes distincts. La requête « train atterrissage » renvoie `fd_204` et `fd_206`, « fissure train » renvoie `fd_204`, et « hydraulique fissure » ne renvoie rien, car aucun texte ne contient les deux mots. Le point à retenir : l'index répond sans parcourir les textes, et il a été construit à partir d'eux. Les modules [19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé) à [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex) détaillent l'analyse du texte, le classement et la chaîne d'indexation.

#### Comparer les familles

| Famille | Unité de données | Question facile | Question difficile | Produits cités | Rôle dans la plateforme (exemple) |
|---|---|---|---|---|---|
| Relationnelle | Ligne d'une table | Jointures, contraintes, transactions | Données profondément imbriquées sans structure fixe | PostgreSQL | Source de vérité des ressources |
| Document | Document imbriqué | Lire et écrire une entité entière | Relations entre entités | MongoDB, `jsonb` de PostgreSQL | Champs personnalisés d'un tenant |
| Clé-valeur | Valeur derrière une clé | Accès par clé, expiration | Interroger le contenu des valeurs | Redis, DynamoDB | Sessions, compteurs, cache |
| Colonnes larges | Ligne à clé de partition | Écritures massives lues par clé | Requêtes quelconques hors clé | Cassandra | Journaux volumineux lus par clé |
| Graphe | Nœud et relation | Parcours de liens à profondeur variable | Agrégats massifs sur tout le jeu | Neo4j | Relations de droits, vocabulaires |
| Recherche | Document indexé par mots | Trouver par mots, classer | Être l'unique copie, porter des transactions | Elasticsearch | Recherche plein texte |

La dernière colonne illustre un usage possible dans la plateforme fictive ; le cours n'impose pas de produit.

#### Choisir

Cinq questions suffisent à orienter un choix. Quelles requêtes, et par quelle clé ? Quelle cohérence faut-il, pour quelle lecture ([30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence)) ? Quel volume, quelle croissance ? Qui exploite le magasin, et avec quelles compétences ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)) ? Et si ce magasin était reconstruit, qu'est-ce qui resterait ? La dernière question sépare la source de vérité des copies dérivées. Dans le doute, le relationnel est le point de départ ; on ajoute une famille après avoir identifié l'accès qui l'exige.

**Modes de défaillance.**

- **Famille choisie pour sa nouveauté**, sans lien avec les accès réels.
- **Trop de technologies pour la taille de l'équipe** : chacune demande sauvegardes, supervision et compétences.
- **Source de vérité non désignée** : deux magasins se contredisent et personne ne sait lequel croire.
- **Copie dérivée non reconstructible** : un incident efface des données sans retour possible.
- **Documents géants** : verrou de ligne sur chaque modification, lectures lentes.
- **Absence de contrôle de structure** dans un magasin « sans schéma » : des champs divergent d'un enregistrement à l'autre.

**Contre-exemple.** Une équipe range constats, tâches et pièces dans un magasin de documents « parce que le schéma est libre ». Six mois plus tard, la gravité est écrite de quatre façons, une même tâche existe en deux versions dans deux documents, et la question « combien de constats critiques par base ? » demande un programme. Un modèle relationnel avec une colonne `jsonb` pour les champs variables aurait gardé les contraintes là où elles servent et la souplesse là où elle est utile.

**Limites.** Six familles sont une simplification : les produits dépassent leur famille et évoluent. La liste de produits cités vient des documentations consultées ; ce n'est pas un classement, et ce cours ne donne aucune mesure de performance. Les garanties dépendent du produit, de sa version et de sa configuration : Cassandra décrit une sémantique de cohérence à terme tout en offrant des transactions légères sur une seule partition. Enfin, une famille n'est pas un choix d'exploitation : le même modèle peut être géré par un fournisseur ou par vous ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.10 Modélisation relationnelle et diagramme entité-relation](02-donnees-ressources.md#210-modélisation-relationnelle-et-diagramme-entité-relation) | Le modèle relationnel et le diagramme entité-relation sont le cœur de la première famille |
| [2.14 Index](02-donnees-ressources.md#214-index) | Les index rendent certaines questions rapides, dans toutes les familles |
| [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique) | Le schéma dynamique s'appuie sur des colonnes de documents indexées |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | Les transactions sont une garantie propre à certaines familles et à certaines configurations |
| [19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé) | L'index inversé est le principe de la famille recherche |
| [22.3 Mise en cache](22-performance-echelle-economie.md#223-mise-en-cache) | La mise en cache emploie souvent un magasin clé-valeur |
| [27.7 Vocabulaires contrôlés et graphe de propriétés](27-types-donnees-specialises.md#277-vocabulaires-contrôlés-et-graphe-de-propriétés) | Le graphe de propriétés et les vocabulaires contrôlés prolongent la famille graphe |
| [30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence) | La réplication, le partitionnement et la cohérence s'appliquent à chaque famille |
| [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité) | Le choix d'une famille se double d'un choix d'exploitation |

### 5. Application pratique

**Situation initiale.** L'équipe de la plateforme prépare l'écran de recherche des constats. Un développeur propose de ranger tous les constats dans le moteur de recherche « puisqu'on y cherche ». Un autre propose un magasin de documents pour tout, pour que chaque tenant définisse ses champs sans migration.

**Problème.** Choisir où ranger chaque donnée, en gardant une source de vérité et des règles d'intégrité là où elles comptent.

**Application du concept.** On énumère les accès et on associe chaque accès à la famille qui le rend naturel.

**Déroulé.**

1. Les constats, tâches et aéronefs ont des liens, des contraintes et des transactions : ils vont dans la base relationnelle, qui devient la source de vérité.
2. Les champs personnalisés d'un tenant, variables, sont rangés dans une colonne `jsonb` avec un index GIN, sans migration par tenant.
3. Les sessions et les compteurs de limitation de débit sont des paires clé-valeur à durée de vie courte ; on peut les perdre sans conséquence durable.
4. La recherche par mots alimente un index de recherche construit à partir de la base, par une chaîne d'indexation ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).
5. Les relations de droits profondes restent en relationnel tant que la profondeur est faible ; un graphe n'est envisagé qu'après mesure.
6. On écrit, pour chaque magasin, s'il est source de vérité ou copie, et comment on le reconstruit.

**Résultat.** Un seul magasin fait foi ; l'index de recherche est une copie qui se reconstruit ; les sessions et les compteurs sont éphémères ; et chaque famille répond à l'accès pour lequel elle est bonne.

**Limites.** Chaque magasin ajouté coûte en sauvegarde, en supervision et en compétences. Un moteur de recherche suppose de gérer un décalage entre la base et l'index. Et la décision se réexamine quand les accès ou les volumes changent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Nommez les six familles de bases de données et, pour chacune, l'unité de données qu'elle manipule.
2. **Compréhension.** Qu'est-ce qu'une source de vérité, et en quoi un index de recherche n'en est-il pas une ?
3. **Compréhension.** Que regroupe le terme NoSQL, et que ne dit-il pas ?
4. **Pourquoi.** Pourquoi le relationnel reste-t-il un bon point de départ ?
5. **Raisonnement pratique.** Une équipe veut un graphe pour « les tâches de l'aéronef ». La profondeur des liens est de deux. Que répondez-vous ?

#### Réponses

1. Relationnelle : la ligne d'une table. Document : le document imbriqué. Clé-valeur : la valeur derrière une clé. Colonnes larges : la ligne retrouvée par une clé de partition. Graphe : le nœud et la relation. Recherche : le document indexé par ses mots.
2. C'est le magasin dont les données font foi. Un index de recherche est une copie construite pour répondre vite : on peut le reconstruire à partir de la source, et il peut avoir du retard sur elle.
3. Les familles non relationnelles, sous un nom commode. Le terme ne dit rien de la technique : des produits NoSQL offrent des transactions, d'autres non ; le terme ne désigne ni une garantie ni un modèle unique.
4. Parce qu'il apporte contraintes, transactions et requêtes souples, qui servent presque tout besoin, et que l'on ajoute ensuite une autre famille pour un accès précis. Chaque magasin supplémentaire coûte en exploitation.
5. Qu'une profondeur de deux se traite avec deux jointures en relationnel, sans nouvelle technologie. Un graphe se justifie quand la profondeur varie et que le parcours est la question ; on le décide après mesure.

## 30.2 Types de stockage

### 1. Comprendre simplement

Le **stockage** est l'endroit où des octets restent après l'arrêt d'un programme. Trois **types de stockage** (*storage types*) se distinguent par la façon dont on y accède. Le stockage **en blocs** (*block*) expose des blocs numérotés, que le système d'exploitation organise lui-même, comme un disque. Le stockage **de fichiers** (*file*) expose une arborescence de dossiers et de fichiers, partagée par le réseau. Le stockage **d'objets** (*object*) range des objets entiers, chacun sous un nom unique, et se consulte par une interface HTTP.

**Pourquoi cela existe.** Une base de données a besoin d'un support rapide, à accès aléatoire. Une équipe qui partage des documents a besoin d'une arborescence commune. Une plateforme qui reçoit des millions de photos a besoin d'une capacité presque illimitée, accessible par programme. Un seul type de stockage ne rend pas les trois services au même coût.

**Problème résolu.** Associer chaque donnée à un support dont l'accès, la capacité, le partage et le prix correspondent à son usage.

**Modèle mental.** Un parking, un classeur et une consigne. Le **parking à places numérotées** (blocs) : vous décidez de ce qui se gare où, et personne d'autre ne s'y gare sans vous. Le **classeur à tiroirs** (fichiers) : tout le bureau le partage et le range par dossiers. La **consigne à bagages** (objets) : vous déposez un bagage entier et recevez un ticket ; pour le modifier, vous le reprenez et vous le redéposez.

**Où l'analogie s'arrête.** Une consigne ne recopie pas vos bagages dans plusieurs bâtiments. Un stockage d'objets de fournisseur le fait, et sa durabilité (la probabilité de ne pas perdre l'objet) n'a pas d'équivalent physique. De même, un parking n'a ni instantané ni historique des versions, alors que les services de stockage en offrent souvent.

**Exemple.** Karim joint douze photos de 6 Mio au constat `fd_204`. Les photos sont rangées dans un stockage d'objets, sous la clé `ten_airline_01/fd_204/photo_01.jpg`. La base de données qui garde le constat vit sur un volume en blocs, rattaché à son serveur. Un partenaire dépose chaque nuit un fichier d'export dans un dossier partagé, parce que son outil ancien ne sait lire qu'un dossier : c'est du stockage de fichiers.

**Les composants.**

1. le **support** physique (disques, serveurs) ;
2. l'**interface d'accès** : blocs, protocole de fichiers, API HTTP ;
3. l'**unité adressée** : bloc, fichier ou objet ;
4. les **métadonnées** : nom, taille, type, dates ;
5. la **redondance** : copies sur plusieurs appareils ou plusieurs zones ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)) ;
6. les **instantanés et les versions** ;
7. les **classes ou niveaux de stockage**, qui arbitrent coût et délai d'accès ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](18-fichiers-documents-contenus.md#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) ;
8. le **contrôle d'accès** et le **chiffrement** ([11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)).

**Objectif d'apprentissage :** vous pouvez distinguer les trois types de stockage par leur unité, leur accès et leur partage, et associer chaque donnée de la plateforme au type qui lui convient.

### 2. Connaissances essentielles

#### Définition

- **Stockage en blocs** : volume de blocs de taille fixe, adressés par un numéro, qu'un système d'exploitation organise lui-même et qui s'emploie comme un disque local.
- **Stockage de fichiers** : arborescence de dossiers et de fichiers, partagée par le réseau, avec des permissions et, en général, des verrous.
- **Stockage d'objets** : espace de noms à plat dans lequel chaque objet (des données et des métadonnées) est retrouvé par une clé, par une API.

#### Idées fondamentales

1. **Le type se définit par l'adressage** : un numéro de bloc, un chemin de fichier, une clé d'objet.
2. **Le bloc est rapide et proche d'un hôte.** Il sert aux disques de machines virtuelles et aux bases de données.
3. **Le fichier se partage.** Plusieurs machines lisent et écrivent la même arborescence, avec des verrous et des permissions.
4. **L'objet monte en charge presque sans limite.** Il s'adresse par API, avec une latence plus élevée, et on le remplace en entier plutôt que de le modifier sur place.
5. **Durabilité, disponibilité et sauvegarde sont trois choses différentes.** Des copies ne protègent pas d'une suppression par erreur.
6. **Le lieu fait partie du contrat.** Un stockage dans une zone ou une région est lié à elle ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)).
7. **On associe chaque donnée à un type** : base sur blocs, pièces jointes en objets, échanges hérités en fichiers.

#### Vocabulaire essentiel

- **Volume** (*volume*) : espace de blocs présenté à une machine comme un disque.
- **Instantané** (*snapshot*) : copie d'un volume à un instant donné, conservée séparément.
- **Système de fichiers** (*file system*) : organisation des fichiers et des dossiers sur un support.
- **NFS** (*Network File System*) : protocole qui donne accès à des fichiers distants comme à des fichiers locaux.
- **Conteneur d'objets** (*bucket*) : espace de regroupement des objets dans un service de stockage d'objets ; à ne pas confondre avec le conteneur d'application ([30.5 Modèles d'exécution et orchestration de conteneurs](#305-modèles-dexécution-et-orchestration-de-conteneurs)).
- **Clé d'objet** (*object key*) : nom unique d'un objet dans son conteneur d'objets.
- **Durabilité** (*durability*) : probabilité de ne pas perdre une donnée au fil du temps.
- **Classe de stockage** (*storage class*) : niveau de coût et de délai d'accès d'un objet.

#### Relations de cause à effet

- Une base de données est placée sur un système de fichiers partagé lent. Chaque écriture attend le réseau, et la latence des requêtes monte.
- Les pièces jointes sont écrites sur le disque d'un serveur d'application. Au remplacement du serveur ou à l'ajout d'un second, une partie des fichiers n'est plus trouvée.
- On confond durabilité et sauvegarde. Un fichier supprimé par erreur disparaît de toutes les copies, et rien ne permet de le restaurer.
- Un objet change légèrement. Il faut le téléverser en entier, ce qui coûte du temps et de la bande passante.

#### Idées reçues

- **« Le stockage d'objets est un disque dans le cloud. »** Non. On n'y accède pas comme à un disque : pas de modification en place, un nom par objet, une API.
- **« Des copies sur plusieurs machines tiennent lieu de sauvegarde. »** Non. Elles protègent d'une panne matérielle ; une suppression ou une corruption se répercute sur toutes les copies.
- **« Le stockage d'objets est toujours le moins cher et le meilleur. »** Non. Sa latence plus élevée et son interface en font un mauvais support pour une base de données.
- **« Un système de fichiers partagé passe à l'échelle sans limite. »** Non. La documentation d'AWS le décrit comme le moins évolutif des trois types.

#### Principe clé

On range chaque donnée sur le type de stockage dont l'adressage correspond à son usage, et l'on ne confond jamais copies, durabilité et sauvegarde.

#### Si vous ne retenez que trois choses

1. Bloc, fichier et objet diffèrent par leur adressage : un numéro, un chemin, une clé.
2. La base de données vit sur des blocs, les pièces jointes en objets, les échanges hérités en fichiers.
3. Des copies protègent d'une panne matérielle, pas d'une suppression : il faut des versions et des sauvegardes.

### 3. Explication technique détaillée

#### Le stockage en blocs

Les volumes d'Amazon EBS illustrent le bloc : on les rattache à une machine virtuelle et on les emploie « comme un disque dur local ». La documentation précise que les données d'un volume sont répliquées automatiquement sur plusieurs serveurs d'une même zone de disponibilité pour qu'une panne d'un composant ne les fasse pas perdre. Elle donne aussi, pour les types de volume autres que `io2 Block Express`, une durabilité de 99,8 % à 99,9 %, soit un taux de panne annuel de 0,1 % à 0,2 %. Les **instantanés** sont des sauvegardes d'un volume à un instant donné, conservées indépendamment du volume. La page de comparaison d'AWS relève la contrepartie : un volume est lié à un hôte, et la mise à l'échelle comme le partage sont plus difficiles.

Ce taux se manipule avec un calcul simple. Avec $n$ volumes indépendants et un taux annuel $p$, le nombre de pannes attendu par an est $n \times p$, et la probabilité d'avoir au moins une panne dans l'année est $1 - (1 - p)^n$.

```typescript
function expectedFailures(volumes: number, annualFailureRate: number): number {
  return volumes * annualFailureRate;
}

function probabilityAtLeastOne(volumes: number, annualFailureRate: number): number {
  return 1 - (1 - annualFailureRate) ** volumes;
}

function storageGrowthGiB(findingsPerDay: number, photosPerFinding: number, photoMiB: number, days: number): number {
  return (findingsPerDay * photosPerFinding * photoMiB * days) / 1024;
}
```

Un volume à 0,2 % de taux annuel a 0,2 % de chances de panne dans l'année. Pour 1 000 volumes à 0,2 %, on attend 2 pannes par an, et la probabilité d'en subir au moins une est de 86,5 %. À 0,1 %, on attend 1 panne par an, avec 63,2 % de probabilité d'au moins une. Ce n'est pas une mauvaise nouvelle, c'est un ordre de grandeur : à l'échelle d'un parc, une perte de volume n'est pas un accident rare, c'est un événement à prévoir, par des instantanés et une restauration éprouvée ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

#### Le stockage de fichiers

Amazon EFS illustre le fichier : il prend en charge le protocole NFS (versions 4.1 et 4.0), donne accès à la même arborescence à de nombreuses machines, et offre des sémantiques de système de fichiers, dont une forte cohérence et le verrouillage de fichiers, avec des permissions de type POSIX. La documentation distingue deux formes : régionale, qui stocke les données de façon redondante dans plusieurs zones de disponibilité, et mono-zone, où la perte de la zone peut faire perdre les données. La page de comparaison d'AWS indique que des applications écrites pour des fichiers partagés peuvent l'employer sans nouveau code, mais que ses performances ne sont pas son point fort et que la hiérarchie en fait le moins évolutif des trois types.

#### Le stockage d'objets

Amazon S3 illustre l'objet : un **conteneur d'objets** (*bucket*) contient des **objets**, chacun étant un fichier et ses métadonnées, retrouvé par une **clé** unique dans le conteneur. La documentation affiche une taille maximale d'objet de 50 To et précise que la limite réelle est de 48,8 Tio (53,7 To), produit de 10 000 parties de 5 Gio au plus. Le versionnement conserve plusieurs variantes d'un objet. Une écriture remplace l'objet en entier : la FAQ d'AWS décrit S3 comme conçu pour des mises à jour d'objets complets, par contraste avec un système de fichiers qui accepte les mises à jour partielles et les ajouts.

Le modèle de cohérence de S3 est précis, et donc instructif. Les écritures et suppressions d'objets offrent une cohérence forte en lecture après écriture, dans toutes les régions : une lecture lancée après la réponse à une écriture réussie renvoie ces données. Une mise à jour d'une clé est atomique : on lit l'ancienne ou la nouvelle version, jamais des données partielles. En revanche, il n'existe pas de mise à jour atomique portant sur plusieurs clés. Deux écritures simultanées sur la même clé : la plus récente l'emporte, et le service ne verrouille pas pour des écrivains concurrents. Les configurations de conteneur suivent un modèle de cohérence à terme : après la suppression d'un conteneur, il peut apparaître un moment encore dans la liste.

Côté durabilité, la documentation d'S3 indique que les classes standard sont conçues pour 99,999999999 % de durabilité et 99,99 % de disponibilité sur un an, avec des objets stockés sur plusieurs appareils d'au moins trois zones de disponibilité, et pour survivre à la perte d'une zone entière. Ce sont des objectifs de conception, non des mesures : avec 10 millions d'objets, ce taux revient à attendre en moyenne une perte tous les 10 000 ans, ce qui ne dit rien d'une suppression par erreur, qui est une autre cause de perte. Le service propose, contre ces erreurs, le **versionnement**, le verrouillage d'objets (écriture unique, lecture multiple, [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) et la réplication entre régions.

#### Choisir un type

| Critère | Blocs | Fichiers | Objets |
|---|---|---|---|
| Unité adressée | Bloc numéroté | Fichier dans un dossier | Objet sous une clé |
| Accès | Comme un disque, rattaché à un hôte | Protocole de fichiers (NFS), partagé | API HTTP |
| Partage entre machines | Difficile | Natif | Natif, par API |
| Latence | La plus basse | Moyenne | La plus élevée |
| Modification | En place | En place, avec verrous | Remplacement de l'objet entier |
| Mise à l'échelle | Limitée | La moins évolutive des trois | Quasi illimitée |
| Usage typique | Disques de machines, bases de données | Dossiers partagés, applications héritées | Pièces jointes, exports, sauvegardes |

Une politique de stockage se décrit comme une donnée :

```yaml
storage_policy:
  - data: base_principale
    type: block
    redundancy: multi_zone
    snapshots:
      every: 1h
      keep_days: 14
  - data: pieces_jointes
    type: object
    versioning: true
    lifecycle:
      - after_days: 90
        move_to: infrequent_access
  - data: depot_partenaire_historique
    type: file
    protocol: nfs
    access: private_network_only
```

Les valeurs (une heure, 14 jours, 90 jours) sont des exemples : elles se fixent selon les objectifs de reprise ([11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto)) et les durées de conservation ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

**Modes de défaillance.**

- **Pièces jointes sur le disque d'un serveur applicatif** : perdues au remplacement ou à la mise à l'échelle.
- **Base de données sur un stockage partagé inadapté** : latence imprévisible.
- **Copies prises pour des sauvegardes** : aucune restauration possible après une erreur.
- **Pas de versionnement ni de verrouillage** là où l'on doit conserver : un écrasement ou une suppression est définitif.
- **Stockage mono-zone pour une donnée critique** : la perte de la zone emporte la donnée.
- **Aucune politique de cycle de vie** : le coût croît sans limite.

**Contre-exemple.** Une équipe écrit les pièces jointes dans un dossier local de chaque serveur d'application, « pour aller vite ». Au quatrième serveur, une photo envoyée sur le premier n'est pas trouvée par le troisième ; au remplacement d'un serveur, ses fichiers disparaissent. Un stockage d'objets partagé, avec la clé inscrite dans la base, aurait rendu le serveur sans état et les fichiers indépendants de lui.

**Limites.** Les trois types sont des catégories conceptuelles : des services mélangent leurs propriétés, et les performances varient selon la configuration. Les chiffres cités sont ceux de la documentation d'un fournisseur à la date de consultation, et ils sont des objectifs de conception. Le calcul de probabilité suppose des pannes indépendantes, ce qui n'est pas garanti (un lot de disques défectueux, une panne de zone). Enfin, ces services se facturent à l'usage : l'emplacement des données et leur cycle de vie font partie de l'économie ([22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Le chiffrement au repos s'applique à chaque type de stockage |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | La règle 3-2-1 combine plusieurs supports et un lieu distinct |
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | Le stockage d'objets, ses métadonnées et ses empreintes sont traités pour les fichiers de la plateforme |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](18-fichiers-documents-contenus.md#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Les niveaux de stockage et les quotas s'appuient sur les classes de stockage |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La conservation et le gel légal emploient le verrouillage d'objets |
| [30.1 Familles de bases de données](#301-familles-de-bases-de-données) | Les bases de données reposent sur des volumes en blocs |
| [30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence) | La réplication des copies prolonge la redondance du stockage |
| [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité) | Zones et régions bornent la redondance et le lieu des données |

### 5. Application pratique

**Situation initiale.** La plateforme reçoit, sur l'ensemble des tenants, environ 3 000 constats par jour, chacun avec 12 photos de 6 Mio. Les pièces jointes sont aujourd'hui écrites dans un dossier du serveur applicatif. Un partenaire demande par ailleurs de déposer un export nocturne dans un dossier réseau.

**Problème.** Éviter la perte de fichiers au remplacement d'un serveur, absorber la croissance, et satisfaire le partenaire sans refaire son outil.

**Application du concept.** On associe chaque donnée à un type de stockage, et on chiffre les volumes de la croissance.

**Déroulé.**

1. La croissance s'estime : 3 000 × 12 × 6 Mio = 216 000 Mio par jour, soit environ 210,9 Gio par jour et 75,2 Tio par an, avant versions et dérivés.
2. Les photos passent en stockage d'objets, avec une clé qui inclut le tenant et le constat, le versionnement activé et une règle de cycle de vie vers un niveau moins coûteux après 90 jours ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](18-fichiers-documents-contenus.md#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).
3. La base relationnelle reste sur des volumes en blocs, avec des instantanés horaires conservés 14 jours et une copie dans une autre région ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).
4. Le dépôt du partenaire est un système de fichiers NFS, accessible depuis le réseau privé seulement ([30.4 Bases du réseau](#304-bases-du-réseau)), dont le contenu est importé vers le stockage d'objets par un traitement planifié.
5. Chaque type reçoit une politique décrite comme une donnée, avec un propriétaire.
6. Une restauration d'essai est planifiée chaque trimestre, car une sauvegarde non restaurée n'est pas une sauvegarde éprouvée.

**Résultat.** Les serveurs applicatifs deviennent sans état, la croissance est budgétée, et chaque donnée a un type de stockage, un niveau de redondance et une politique de conservation.

**Limites.** Le partage NFS reste un point spécifique à entretenir. Les coûts dépendent de la tarification du fournisseur, non donnée ici. Et la distance entre la région des données et celle des utilisateurs joue sur la latence ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les unités adressées par les stockages en blocs, de fichiers et d'objets ?
2. **Compréhension.** Pourquoi dit-on qu'un objet se remplace plutôt qu'il ne se modifie ?
3. **Compréhension.** Quelle différence y a-t-il entre durabilité et sauvegarde ?
4. **Pourquoi.** Pourquoi une base de données se place-t-elle sur un stockage en blocs plutôt qu'en objets ?
5. **Raisonnement pratique.** Une flotte compte 500 volumes avec un taux annuel de panne de 0,2 %. Combien de pannes attendez-vous par an, et que faut-il prévoir ?

#### Réponses

1. Un numéro de bloc, un chemin de fichier dans une arborescence, une clé d'objet dans un conteneur d'objets.
2. Parce que l'interface d'un stockage d'objets écrit un objet complet sous une clé. Pour changer une partie, on téléverse une nouvelle version entière ; il n'y a pas de modification partielle sur place.
3. La durabilité est la probabilité de ne pas perdre une donnée par défaillance matérielle, grâce aux copies. Une sauvegarde est une copie indépendante, restaurable après une suppression, une corruption ou une erreur : les copies d'une donnée supprimée sont elles aussi supprimées.
4. Parce qu'une base a besoin de lectures et d'écritures de faible latence, avec modification en place ; le stockage d'objets a une latence plus élevée et remplace les objets en entier.
5. $500 \times 0{,}002 = 1$ panne attendue par an, et une probabilité d'environ 63 % d'au moins une panne dans l'année. Il faut prévoir des instantanés réguliers, une restauration éprouvée et une redondance, plutôt que de compter sur l'absence de panne.

## 30.3 Réplication, partitionnement et modèles de cohérence

### 1. Comprendre simplement

La **réplication** (*replication*) consiste à garder plusieurs copies d'une même donnée sur des machines différentes. Le **partitionnement** (*partitioning*) consiste à répartir des données différentes entre plusieurs machines. Les deux répondent à des problèmes distincts : la réplication protège des pannes et multiplie les lectures possibles ; le partitionnement fait tenir un volume ou un débit d'écriture qu'une machine ne porte pas. Un **modèle de cohérence** (*consistency model*) est la promesse qu'un système fait sur ce qu'un lecteur voit après une écriture. Ces notions de base se combinent presque toujours : chaque partition est elle-même répliquée.

**Pourquoi cela existe.** Une machine tombe en panne, atteint les limites de son disque et de son débit, et se trouve loin de certains utilisateurs. Copier résout la panne et la distance ; découper résout la taille et le débit d'écriture. Mais des copies multiples posent une question nouvelle : quand l'une est modifiée, que voit celui qui lit une autre ? Le modèle de cohérence y répond.

**Problème résolu.** Garder des données disponibles et de taille gérable sur plusieurs machines, en sachant exactement ce que chaque lecteur peut en attendre.

**Modèle mental.** Un annuaire téléphonique. On en distribue des **exemplaires** dans plusieurs bureaux (réplication) ; on le découpe aussi en **tomes**, de A à M et de N à Z, rangés dans des bureaux différents (partitionnement). Quand un numéro change, la correction part du bureau où elle est faite vers les autres exemplaires : pendant ce temps, deux bureaux peuvent donner deux réponses. Le **modèle de cohérence** dit combien de temps cela peut durer et ce que l'on peut en conclure.

**Où l'analogie s'arrête.** Un annuaire papier se corrige par feuillets, avec des délais de plusieurs jours. Un système réparti propage les écritures en continu, en quelques millisecondes ou secondes, et doit en plus gérer des corrections simultanées, des bureaux injoignables (une partition réseau) et le choix de l'exemplaire qui fait foi.

**Exemple.** Karim crée le constat `fd_204`, enregistré sur la base principale. Il recharge la liste : la requête est servie par un réplica qui n'a pas encore reçu l'écriture, et le constat est absent. Une seconde plus tard, il apparaît. Les deux réponses sont « correctes » selon le modèle de ce réplica. Ce que l'on attend d'un bon produit, c'est que ce comportement ait été décidé, et non subi.

**Les composants.**

1. les **répliques** : une principale et des secondaires, ou plusieurs principales ;
2. le **flux de réplication**, synchrone ou asynchrone ;
3. la **méthode de partitionnement** : plage, liste ou hachage ;
4. la **clé de partition** ;
5. le **quorum** de lecture et d'écriture ;
6. le **modèle de cohérence** offert par opération ;
7. la **mesure du retard** ;
8. la **gestion des conflits** quand plusieurs répliques acceptent des écritures.

**Objectif d'apprentissage :** vous pouvez distinguer réplication et partitionnement, expliquer la différence entre réplication synchrone et asynchrone, et nommer les modèles de cohérence qu'un utilisateur rencontre : forte, lire ses écritures, lectures monotones et à terme.

### 2. Connaissances essentielles

#### Définition

- **Réplication** : conservation de copies d'une même donnée sur plusieurs machines, tenues à jour les unes à partir des autres.
- **Partitionnement** : division d'un ensemble de données en parties disjointes, selon une règle appliquée à une clé, placées sur des machines ou des espaces distincts.
- **Modèle de cohérence** : contrat qui précise quelles valeurs une lecture peut renvoyer, compte tenu des écritures précédentes, de leur ordre et du temps écoulé.

#### Idées fondamentales

1. **On réplique pour survivre et pour lire davantage, on partitionne pour tenir davantage.** Ce sont deux axes distincts, que l'on combine.
2. **La réplication synchrone attend, l'asynchrone laisse du retard.** La documentation de PostgreSQL le résume : en synchrone, un basculement ne perd aucune donnée mais la performance peut baisser de plus de moitié sur un réseau lent ; en asynchrone, des transactions peuvent être perdues au basculement et des lectures peuvent être périmées.
3. **La clé de partition décide de ce qui est rapide.** Elle détermine quelles requêtes touchent une partition et lesquelles les touchent toutes ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)).
4. **Un modèle de cohérence est une promesse par opération**, non une étiquette de produit. DynamoDB sert des lectures à terme par défaut et des lectures fortes sur demande.
5. **La cohérence forte** (linéarisabilité) fait paraître chaque opération atomique, dans un ordre qui respecte l'ordre réel. Elle coûte de l'attente et, en cas de partition réseau, de la disponibilité.
6. **Entre les deux, des garanties de session** : lire ses propres écritures, ne jamais voir une valeur plus ancienne que celle déjà vue.
7. **Un quorum fait se chevaucher lectures et écritures** : avec $N$ copies, $W$ accusés d'écriture et $R$ copies lues, $W + R > N$ garantit qu'une lecture touche au moins une copie à jour.

#### Vocabulaire essentiel

- **Notions de réplication et de partitionnement** (*replication and partitioning fundamentals*) : principes communs aux systèmes qui copient et découpent leurs données.
- **Principale et secondaire** (*primary* et *standby*) : serveur qui accepte les écritures, et serveurs qui suivent ses changements.
- **Réplication synchrone, asynchrone** (*synchronous*, *asynchronous replication*) : une écriture n'est validée qu'après confirmation des copies, ou sans les attendre.
- **Retard de réplication** (*replication lag*) : délai entre une écriture sur la principale et sa visibilité sur une copie ([22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication)).
- **Partitionnement par plage, par liste, par hachage** (*range*, *list*, *hash partitioning*) : règles qui placent une ligne selon un intervalle, une liste de valeurs, ou le reste d'un hachage de la clé.
- **Élagage de partitions** (*partition pruning*) : le planificateur ignore les partitions qui ne peuvent pas contenir les lignes cherchées.
- **Quorum** (*quorum*) : nombre de copies dont on attend la réponse ; $N$ copies, $W$ pour l'écriture, $R$ pour la lecture.
- **Modèles de cohérence** (*consistency models*) : cohérence forte ou linéarisabilité (*strong consistency*, *linearizability*), lire ses écritures (*read your writes*), lectures monotones (*monotonic reads*), cohérence à terme (*eventual consistency*).
- **Fenêtre d'incohérence** (*inconsistency window*) : durée pendant laquelle des lecteurs peuvent voir une valeur ancienne.

#### Relations de cause à effet

- La réplication est asynchrone et la principale tombe. Les dernières transactions validées peuvent manquer sur le secondaire promu : elles sont perdues.
- La réplication est synchrone sur un réseau lent. Chaque écriture attend la confirmation distante, et le débit d'écriture chute.
- La clé de partition est une date, avec un partitionnement par plage. Toutes les écritures récentes arrivent dans la dernière partition, qui devient le point chaud.
- Les lectures vont à un réplica en retard. Un utilisateur ne voit pas son écriture, ou voit une donnée plus ancienne que celle qu'il vient de voir.
- Le quorum est mal réglé ($W + R \le N$). Une lecture peut ne rencontrer aucune copie qui a reçu la dernière écriture.

#### Idées reçues

- **« Répliquer, c'est sauvegarder. »** Non. Une suppression ou une corruption se réplique aussi ; seule une sauvegarde indépendante en protège ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).
- **« Cohérence à terme veut dire données fausses. »** Non. Si les écritures cessent, toutes les lectures finissent par renvoyer la dernière valeur ; pendant la fenêtre d'incohérence, une lecture peut renvoyer une valeur plus ancienne.
- **« Le C de CAP est le C d'ACID. »** Non. Dans CAP, la cohérence est la linéarisabilité ; le C d'ACID concerne le respect des règles d'intégrité par une transaction.
- **« Une base est soit CP, soit AP. »** Non. Martin Kleppmann montre que ces étiquettes sont trompeuses : les garanties varient d'une opération à l'autre et selon la configuration.

#### Principe clé

On réplique pour survivre, on partitionne pour tenir la charge, et pour chaque lecture on décide, et on écrit, ce qu'elle a le droit de ne pas voir.

#### Si vous ne retenez que trois choses

1. Répliquer protège des pannes et multiplie les lectures ; partitionner fait tenir le volume et les écritures : les deux se combinent.
2. Synchrone ou asynchrone : on arbitre entre perte possible et lenteur.
3. Le modèle de cohérence est une promesse par opération : forte, de session ou à terme.

### 3. Explication technique détaillée

#### Répliquer : qui écrit, et quand les autres le savent

Trois topologies s'observent dans les documentations consultées.

- **Une principale et des secondaires.** PostgreSQL appelle *primary* le serveur qui modifie les données et *standby* les serveurs qui suivent ses changements. Un secondaire « à chaud » accepte des requêtes en lecture seule ; un secondaire « tiède » ne s'ouvre qu'une fois promu.
- **Plusieurs principales.** Les tables globales de DynamoDB sont dites multi-actives : une modification faite dans n'importe quelle réplique est propagée aux autres, et il n'y a pas de table principale. Deux modes existent : à terme (en général en moins d'une seconde) ou fort (la modification est répliquée de façon synchrone vers une autre région avant que l'écriture ne rende la main).
- **Pas de principale unique, avec quorum.** Cassandra place chaque partition sur un nombre de copies fixé par le facteur de réplication ; une écriture est envoyée à toutes, et le niveau de cohérence choisi fixe combien de réponses le coordinateur attend (`ONE`, `QUORUM`, `ALL`).

La documentation de PostgreSQL oppose les deux façons de propager. En **synchrone**, une transaction n'est validée qu'une fois que tous les serveurs l'ont validée : un basculement ne perd rien, mais « une solution entièrement synchrone sur un réseau lent peut réduire les performances de plus de moitié ». En **asynchrone**, un délai sépare la validation et sa propagation : certaines transactions peuvent être perdues lors d'un basculement, et des serveurs répartis peuvent renvoyer des résultats légèrement périmés. L'asynchrone s'emploie quand le synchrone serait trop lent.

#### Partitionner : comment on découpe

PostgreSQL propose trois méthodes. Le partitionnement **par plage** découpe selon des intervalles sans chevauchement, la borne inférieure étant incluse et la borne supérieure exclue. Le partitionnement **par liste** énumère les valeurs de chaque partition. Le partitionnement **par hachage** attribue à chaque partition un module et un reste, et place la ligne selon le reste du hachage de la clé. L'**élagage** permet au planificateur d'écarter les partitions qui ne peuvent pas répondre. Le partitionnement n'est en général utile que si la table serait sinon très grande ; la documentation donne comme règle empirique une table plus grande que la mémoire physique du serveur. Une contrainte d'unicité sur une table partitionnée doit inclure toutes les colonnes de la clé de partition. Cassandra fait un autre choix : la clé est hachée en un jeton, placé sur un anneau, et l'on parcourt l'anneau pour trouver les copies.

Le choix de la méthode dépend des requêtes. Prenons 12 000 événements d'audit d'une même journée.

```typescript
interface AuditEvent {
  id: string;
  occurredOn: string; // AAAA-MM-JJ
}

function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function monthPartition(e: AuditEvent): string {
  return e.occurredOn.slice(0, 7);
}

function hashPartition(e: AuditEvent, parts: number): string {
  return `p${fnv1a(e.id) % parts}`;
}

function distribution(events: AuditEvent[], route: (e: AuditEvent) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    const p = route(e);
    counts[p] = (counts[p] ?? 0) + 1;
  }
  return counts;
}
```

Avec un partitionnement par mois, les 12 000 événements tombent dans une seule partition (`2026-10`). Avec un hachage de l'identifiant sur 4 partitions, chacune reçoit environ 3 000 événements (3 000, 3 000, 3 001 et 2 999) ; sur 8 partitions, environ 1 500 chacune. La contrepartie est symétrique : une requête « les événements du jour » ne touche qu'une partition par plage et les touche toutes par hachage, alors que la recherche d'un événement par identifiant se résout directement par hachage, quand le partitionnement par mois impose de parcourir la partition du mois ou de s'appuyer sur un index. Il n'y a pas de bonne méthode en soi : il y a une méthode qui sert les requêtes fréquentes ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)).

#### Les quorums

Avec $N$ copies d'une donnée, une écriture attend $W$ accusés et une lecture interroge $R$ copies. Si $W + R > N$, tout ensemble de $R$ copies partage au moins une copie avec tout ensemble de $W$ copies : la lecture voit la dernière écriture. Si $W + R \le N$, une lecture peut ne toucher que des copies en retard. Le programme suivant énumère les combinaisons.

```typescript
function subsets(n: number, k: number): number[][] {
  const out: number[][] = [];
  const pick = (start: number, chosen: number[]): void => {
    if (chosen.length === k) {
      out.push([...chosen]);
      return;
    }
    for (let i = start; i < n; i++) pick(i + 1, [...chosen, i]);
  };
  pick(0, []);
  return out;
}

// Part des couples (copies écrites, copies lues) sans aucune copie commune,
// tous les choix étant équiprobables.
function staleReadProbability(n: number, w: number, r: number): number {
  const writes = subsets(n, w);
  const reads = subsets(n, r);
  let stale = 0;
  for (const ws of writes) {
    for (const rs of reads) {
      if (!rs.some((x) => ws.includes(x))) stale++;
    }
  }
  return stale / (writes.length * reads.length);
}
```

| $N$ | $W$ | $R$ | $W + R > N$ | Part de lectures pouvant être périmées |
|---|---|---|---|---|
| 3 | 1 | 1 | non | 66,7 % |
| 3 | 2 | 1 | non | 33,3 % |
| 3 | 1 | 2 | non | 33,3 % |
| 3 | 2 | 2 | oui | 0 % |
| 3 | 3 | 1 | oui | 0 % |
| 5 | 2 | 2 | non | 30 % |
| 5 | 3 | 3 | oui | 0 % |

Le quorum de majorité ($W = R = \lfloor N/2 \rfloor + 1$) vérifie toujours la condition. Le calcul ne modélise pas les mécanismes de rattrapage que des produits ajoutent, ni les pannes : il montre seulement pourquoi la règle fonctionne. Chaque écriture attend $W$ réponses : un $W$ plus grand allonge les écritures ; un $R$ plus grand allonge les lectures. On règle le curseur selon la charge dominante.

#### Les modèles de cohérence

| Modèle | Promesse | Ce que vit l'utilisateur | Observé dans |
|---|---|---|---|
| Forte (linéarisable) | Chaque opération paraît atomique, dans un ordre cohérent avec l'ordre réel | Après une écriture terminée, toute lecture voit cette écriture ou une plus récente | Lectures `ConsistentRead` de DynamoDB, écritures et lectures d'objets de S3 |
| Lire ses écritures | Après une écriture, les lectures du même client voient cette écriture ou plus récent | « Mon constat n'a pas disparu » | Garde de session ([22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication)) |
| Lectures monotones | Un client qui a vu une valeur ne voit jamais une valeur plus ancienne ensuite | Pas de retour en arrière en rechargeant | Session attachée à un même réplica |
| À terme | Sans nouvelle écriture, toutes les lectures renvoient finalement la dernière valeur | Un délai, puis la valeur à jour | Réplicas asynchrones, lectures par défaut de DynamoDB |

D'après les définitions de Werner Vogels, la cohérence forte exige que toute lecture après une mise à jour terminée renvoie la nouvelle valeur ; la cohérence à terme est une forme de cohérence faible, dont la durée d'incohérence est la fenêtre ; lire ses écritures est un cas particulier de cohérence causale, et la cohérence de session l'applique à la durée d'une session. La page de Jepsen sur la linéarisabilité la présente comme un modèle très fort portant sur un objet : chaque opération prend effet en un instant, et si une opération se termine avant qu'une autre ne commence, la seconde prend effet après la première. Lire ses écritures, d'après la page correspondante du même site, ne couvre que les opérations du client lui-même.

Deux faits aident à situer le théorème CAP ([1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués)). Premièrement, Martin Kleppmann rappelle que « C » y signifie linéarisabilité, sans rapport avec le « C » d'ACID, et que « A » y exige que tout nœud qui ne tombe pas réponde à toute requête, sans considération de latence. Deuxièmement, le théorème ne modélise qu'un registre unique et les seules partitions du réseau : il ignore les transactions multi-objets, les pannes de nœuds et la latence. Les étiquettes « CP » et « AP » ne décrivent donc pas correctement un produit réel.

Un cas concret montre la différence. Karim crée le constat à la version 7 de la base principale ; deux réplicas, A et B, en sont à la version 7 et à la version 6.

```typescript
interface Read {
  replica: string;
  version: number;
}

function violatesMonotonicReads(reads: Read[]): boolean {
  let last = -Infinity;
  for (const r of reads) {
    if (r.version < last) return true;
    last = r.version;
  }
  return false;
}

function violatesReadYourWrites(writeVersion: number, readsAfterWrite: Read[]): boolean {
  return readsAfterWrite.some((r) => r.version < writeVersion);
}
```

Si les deux lectures successives sont servies par A puis par B, la seconde renvoie une version plus ancienne que la première : les lectures ne sont pas monotones, et l'utilisateur ne lit pas son écriture. Si la session reste attachée à A, les deux propriétés tiennent. Si la première lecture tombe sur B, la lecture est monotone (il n'y en a qu'une), mais ne lit pas l'écriture. Les garanties de session se construisent donc par un routage (garder la session sur un réplica, ou comparer une version à celle qu'on a écrite, [22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication)), non par magie du moteur.

#### Choisir un modèle par opération

| Opération | Modèle visé | Moyen | Raison |
|---|---|---|---|
| Créer ou modifier un constat | Forte | Écriture sur la principale, transaction | Règles d'intégrité |
| Relire son écriture | Lire ses écritures | Principale pendant quelques secondes, ou jeton de version | Ne pas voir disparaître son constat |
| Liste de tâches | Lectures monotones | Session attachée à un réplica | Pas de retour en arrière |
| Tableau de bord | À terme, retard borné | Réplica dédié, retard mesuré | Charge de lecture lourde |
| Décompte de quota | Forte | Réservation atomique ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) | Ne pas dépasser la limite |
| Recherche plein texte | À terme, quelques secondes | Index dérivé ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)) | Fraîcheur acceptable |

**Modes de défaillance.**

- **Réplication asynchrone sans mesure du retard**, ni règle de lecture.
- **Synchrone partout par principe** : écritures ralenties pour des lectures qui toléreraient le retard.
- **Clé de partition croissante** avec un partitionnement par plage : un point chaud.
- **Tenant très gros dans une seule partition** ([22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)).
- **Basculement sans isolement** : deux principales, un cerveau divisé ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)).
- **Modèle de cohérence non documenté** : chaque équipe suppose le sien.
- **Quorum mal réglé** : lectures périmées sans qu'on le sache.

**Contre-exemple.** Le contrôle d'éligibilité d'un aéronef lit un réplica en retard de 900 ms et ne voit pas l'inspection enregistrée une seconde plus tôt : il refuse la remise en service, et Léa doit relancer le contrôle. Une lecture qui décide d'une action se fait sur la principale, ou avec une garde de version ; une lecture qui informe peut accepter le retard.

**Limites.** Les modèles présentés sont une sélection : la carte de Jepsen en compte bien d'autres. Le calcul de quorum suppose des choix équiprobables et ignore le rattrapage. Les produits mélangent les modèles et en changent selon la version et la configuration. Les protocoles de consensus qui élisent une principale ne sont pas traités ici ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) en donne le principe). Et la cohérence offerte par une base ne suffit pas : l'application doit en tirer parti, par exemple par des identifiants d'idempotence ([3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | Le théorème CAP et la notion de partition réseau cadrent ces compromis |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | L'isolation des transactions s'ajoute au modèle de cohérence des copies |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La cohérence à terme est le modèle de nombreuses copies et de messages |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | Quorum, basculement et cerveau divisé prolongent la réplication |
| [22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication) | Les réplicas de lecture et leur retard sont l'application directe |
| [22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage) | Partition, clé de partition et rééquilibrage détaillent la répartition |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Le multi-région réplique entre régions, avec un retard plus grand |
| [28.3 Plateforme de flux d'événements, partitions et groupes de consommateurs](28-interoperabilite-avancee.md#283-plateforme-de-flux-dévénements-partitions-et-groupes-de-consommateurs) | Les partitions d'un journal d'événements suivent la même logique de clé |
| [30.1 Familles de bases de données](#301-familles-de-bases-de-données) | Chaque famille de bases offre ses propres choix de réplication et de cohérence |
| [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité) | Les zones et régions bornent où vivent les copies |

### 5. Application pratique

**Situation initiale.** Léa se plaint : « Je crée une tâche et elle n'apparaît pas dans ma liste ». L'équipe vient d'ajouter deux réplicas asynchrones pour soulager la principale, et les lectures de listes y sont routées sans règle.

**Problème.** Décider quelles lectures peuvent aller sur un réplica, avec quelle garantie, sans revenir à une seule machine.

**Application du concept.** On classe les lectures selon l'usage qu'on en fait, et l'on associe à chaque classe un modèle de cohérence et un routage.

**Déroulé.**

1. On liste les lectures de la plateforme et l'on note, pour chacune, ce que fait l'utilisateur ensuite.
2. Les lectures qui **décident** (éligibilité, quotas, validations) vont sur la principale.
3. Les lectures de **confort** (listes, fiches) vont sur un réplica avec la garde « lire ses écritures » : l'écriture rend une version, et le réplica ne répond que s'il a appliqué au moins cette version, sinon la requête va sur la principale.
4. Les lectures **analytiques** (tableaux de bord, exports) vont sur un réplica dédié, avec le retard affiché ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)).
5. On mesure le retard de réplication et l'on alerte au-delà d'un seuil ; au-delà, le routage replie les lectures de confort sur la principale.
6. On documente, pour chaque opération, le modèle de cohérence offert, dans la description de l'API ([10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest)).

**Résultat.** Léa voit sa tâche immédiatement ; la principale porte les écritures et les lectures qui décident ; les lectures lourdes sont isolées ; et le comportement est écrit.

**Limites.** La garde de version ajoute un état à transporter avec la session. Les réplicas dédiés coûtent de la capacité. Et un retard qui dépasse le seuil peut renvoyer toutes les lectures sur la principale, ce qui la charge au pire moment.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre réplication et partitionnement ?
2. **Compréhension.** Que garantit « lire ses écritures », et que ne garantit-il pas ?
3. **Compréhension.** Que signifie la condition $W + R > N$ ?
4. **Pourquoi.** Pourquoi une clé de partition croissante pose-t-elle problème avec un partitionnement par plage ?
5. **Raisonnement pratique.** Avec $N = 5$, $W = 2$ et $R = 2$, une lecture peut-elle être périmée ? Comment corriger ?

#### Réponses

1. La réplication copie la même donnée sur plusieurs machines (pannes, lectures) ; le partitionnement répartit des données différentes entre machines (volume, écritures). On les combine : chaque partition est répliquée.
2. Qu'après une écriture, les lectures du même client voient cette écriture ou une plus récente. Cela ne dit rien des écritures des autres clients, ni de l'ordre entre clients.
3. Que toute lecture sur $R$ copies et toute écriture sur $W$ copies partagent au moins une copie : la lecture voit au moins une copie à jour, donc la dernière écriture.
4. Parce que les nouvelles écritures portent toutes une clé plus grande que les précédentes : elles tombent toutes dans la dernière partition, qui devient un point chaud, alors que les autres restent inactives.
5. Oui : $2 + 2 = 4$ n'est pas supérieur à 5, et 30 % des couples d'ensembles d'écriture et de lecture ne se rencontrent pas. On corrige en choisissant $W + R > 5$, par exemple $W = 3$ et $R = 3$, au prix d'écritures et de lectures plus lentes.

## 30.4 Bases du réseau

### 1. Comprendre simplement

Pour qu'une requête atteigne le code de la plateforme, cinq mécanismes se succèdent : ce sont les notions de base du réseau (*networking basics*). Le **DNS** (*Domain Name System*) transforme un nom, comme `api.alpha-air.example`, en adresse. **TLS** (*Transport Layer Security*) établit un canal chiffré et authentifie le serveur. La **répartition de charge** (*load balancing*) choisit, parmi plusieurs serveurs, celui qui traite la requête. Un **proxy inverse** (*reverse proxy*) reçoit la requête à la place des serveurs d'application et la leur transmet. Un **réseau privé** (*private network*) met les machines internes à l'abri de l'Internet public.

**Pourquoi cela existe.** Les utilisateurs connaissent un nom, pas une adresse, et les adresses changent. Les échanges traversent des réseaux que l'on ne contrôle pas : il faut les protéger. Un serveur seul ne suffit ni à la charge ni à la disponibilité. Et les machines internes, comme la base de données, ne doivent pas être exposées.

**Problème résolu.** Faire arriver une requête jusqu'au bon code, de façon sûre et disponible, sans exposer les machines internes.

**Modèle mental.** L'accueil d'un grand immeuble de bureaux. L'**annuaire** donne l'étage et le numéro d'une société à partir de son nom : le DNS. L'**enveloppe scellée**, remise après vérification de la pièce d'identité du destinataire, protège le courrier : TLS. La **réception** accueille tous les visiteurs et les oriente : le proxy inverse. L'**hôtesse** envoie chaque visiteur au guichet le moins occupé : le répartiteur de charge. Les **couloirs à badge** réservent les étages internes au personnel : le réseau privé.

**Où l'analogie s'arrête.** Un immeuble n'a qu'une réception physique ; ici, l'accueil est lui-même répliqué, et chaque couche peut tomber en panne. Les badges ne suffisent pas non plus : un intrus déjà à l'intérieur circule librement si rien d'autre ne vérifie, ce qui est le point de départ du modèle Zero Trust ([11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust)).

**Exemple.** Nadia ouvre `https://api.alpha-air.example/findings`. Son navigateur obtient une adresse du DNS, puis établit une session TLS avec un répartiteur de charge, qui présente un certificat pour ce nom. Le répartiteur transmet la requête à l'un des serveurs d'application, situés dans un sous-réseau privé. Ces serveurs interrogent la base de données, elle aussi dans un sous-réseau privé.

**Les composants.**

1. un **nom de domaine** et sa **zone** DNS ;
2. un **certificat** TLS et sa chaîne de confiance ;
3. un **point d'entrée** public : répartiteur de charge, proxy inverse ;
4. des **cibles** : serveurs ou conteneurs, avec des sondes de santé ([11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)) ;
5. un **réseau privé** : sous-réseaux et plages d'adresses privées ;
6. des **règles d'accès** : groupes de sécurité, listes de contrôle ;
7. un **point de sortie** contrôlé pour les appels sortants.

**Objectif d'apprentissage :** vous pouvez suivre le trajet d'une requête du navigateur jusqu'à la base de données, dire le rôle de chaque mécanisme, et expliquer pourquoi un changement d'adresse n'est pas instantané.

### 2. Connaissances essentielles

#### Définition

- **DNS** : système hiérarchique de noms qui associe des noms de domaine à des données (adresses, serveurs de courrier, textes), par des serveurs de noms et des résolveurs, avec mise en cache.
- **TLS** : protocole de canal sécurisé entre un client et un serveur, conçu pour empêcher l'écoute, l'altération et la falsification des messages.
- **Répartiteur de charge** : composant qui répartit les requêtes entrantes entre plusieurs cibles et n'envoie du trafic qu'aux cibles saines.
- **Proxy inverse** : intermédiaire qui reçoit les requêtes au nom des serveurs d'origine, les leur transmet et renvoie leurs réponses ; la RFC 9110 le désigne par le terme de passerelle.
- **Réseau privé** : réseau dont les adresses ne sont pas routables depuis l'Internet public, par exemple dans les blocs réservés par la RFC 1918.

#### Idées fondamentales

1. **Un nom n'est pas une adresse.** Le DNS permet de déplacer un service sans prévenir les clients, dans la limite de la durée de vie des enregistrements.
2. **Le DNS est mis en cache.** Chaque enregistrement porte une durée de vie (*TTL*) qui borne le temps pendant lequel on peut le réutiliser.
3. **TLS authentifie le serveur et protège le transport.** Le serveur est toujours authentifié, le client seulement en option.
4. **Un répartiteur de charge ne répartit que vers des cibles saines.** Il agit au niveau de la connexion (couche 4) ou de la requête (couche 7).
5. **Un proxy inverse centralise des fonctions** : terminaison TLS, routage par nom d'hôte ou par chemin, en-têtes, mise en tampon.
6. **Un réseau privé réduit l'exposition**, sans valoir preuve de confiance.
7. **Chaque couche peut tomber en panne.** La redondance s'applique aussi au répartiteur et au proxy, en plusieurs zones ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)).

#### Vocabulaire essentiel

- **Nom de domaine** (*domain name*) : nom hiérarchique, lu de la partie la plus précise vers la racine.
- **Résolveur** (*resolver*) : programme qui interroge les serveurs de noms pour le compte d'une application.
- **Serveur de noms faisant autorité** (*authoritative name server*) : serveur qui détient les données d'une zone.
- **Enregistrement** (*resource record*) : donnée d'un nom, avec un type (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`), une valeur et une durée de vie.
- **TTL** (*time to live*) : durée, en secondes, pendant laquelle un enregistrement peut être gardé en cache.
- **Certificat** (*certificate*) : document signé qui lie une clé publique à un nom de domaine.
- **Autorité de certification** (*certificate authority*) : organisation qui émet des certificats.
- **Terminaison TLS** (*TLS termination*) : point où le chiffrement du client s'arrête et où la requête est déchiffrée.
- **Couche 4, couche 7** (*layer 4*, *layer 7*) : niveau de la connexion de transport, ou niveau de l'application (HTTP).
- **Sous-réseau** (*subnet*) : plage d'adresses d'un réseau virtuel ; chez AWS, il réside dans une seule zone de disponibilité.
- **NAT** (*network address translation*) : dispositif qui permet à des machines privées d'atteindre Internet sans être jointes de l'extérieur.

#### Relations de cause à effet

- Un enregistrement DNS change, alors que son TTL est long. Des clients et des résolveurs continuent d'employer l'ancienne adresse jusqu'à expiration.
- Un répartiteur envoie du trafic à une cible malade faute de sonde de santé. Une part des requêtes échoue, alors que d'autres cibles sont saines.
- Un certificat expire. Les clients refusent la connexion, même si le serveur fonctionne.
- La base de données est dans un sous-réseau public. Une simple erreur de règle d'accès suffit à la rendre joignable depuis Internet.
- Le réseau interne est considéré comme sûr. Un seul serveur compromis donne accès à tous les autres.

#### Idées reçues

- **« Changer l'adresse d'un service est instantané. »** Non. Les caches DNS gardent l'ancienne adresse jusqu'à l'expiration du TTL.
- **« HTTPS protège de tout. »** Non. Il protège le transport entre le client et la terminaison TLS ; il ne protège ni d'une requête malveillante, ni d'un serveur compromis.
- **« Un réseau privé suffit à protéger la base. »** Non. Il réduit l'exposition ; les identités, les droits et le chiffrement s'appliquent aussi à l'intérieur ([11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust)).
- **« Un répartiteur de charge garantit la disponibilité. »** Non. Il déplace le point de défaillance ; lui-même doit être redondant.

#### Principe clé

Chaque requête traverse un nom, un canal chiffré, un point d'entrée qui répartit, et un réseau privé : chaque couche se règle, se supervise et se rend redondante.

#### Si vous ne retenez que trois choses

1. Le DNS associe un nom à une adresse avec une durée de vie : un changement ne se voit qu'après expiration des caches.
2. TLS protège le transport et authentifie le serveur ; il se termine au répartiteur ou au proxy.
3. Un réseau privé réduit l'exposition des machines internes ; il ne remplace ni les droits ni le chiffrement.

### 3. Explication technique détaillée

#### La résolution d'un nom

La RFC 1034 décrit trois composants : l'espace de noms (un arbre dont chaque nœud porte un ensemble de données typées), les serveurs de noms (qui détiennent les données de parties de l'arbre, regroupées en zones, et renvoient vers d'autres serveurs pour le reste) et les résolveurs (des programmes qui interrogent les serveurs de noms pour le compte d'une application). Un nom est la suite de ses étiquettes, de la plus précise à la racine, et ne dépasse pas 255 octets. La RFC 1035 définit le format d'un enregistrement : un nom, un type, une classe, une durée de vie sur 32 bits et des données.

```text
requête : navigateur ─► résolveur (cache) ─► serveurs de noms, de la racine vers la zone ─► serveur faisant autorité
réponse : navigateur ◄─ résolveur (garde la réponse jusqu'à l'expiration du TTL) ◄─ adresse et TTL
```

| Type | Rôle | Exemple |
|---|---|---|
| `A` | Adresse IPv4 d'un nom | `api.alpha-air.example` → `192.0.2.10` |
| `AAAA` | Adresse IPv6 d'un nom (RFC 3596) | `api.alpha-air.example` → une adresse IPv6 |
| `CNAME` | Nom canonique d'un alias | `maintenance.alpha-air.example` → `edge.platform.example` |
| `MX` | Serveur d'échange du courrier | Réception du courrier du domaine |
| `TXT` | Chaînes de texte | Politique SPF d'un domaine ([17.5 Rebonds et authentification du courriel](17-collaboration-communication-travail.md#175-rebonds-et-authentification-du-courriel)) |
| `NS` | Serveur de noms faisant autorité pour une zone | Délégation d'une zone |

La durée de vie borne le délai de propagation. Le programme suivant simule un résolveur qui met en cache une réponse jusqu'à l'expiration de son TTL, et un enregistrement qui change à l'instant 100 s.

```typescript
interface Authoritative {
  ip: string;
  ttl: number; // secondes
}

function makeResolver(lookup: (name: string, now: number) => Authoritative) {
  const cache = new Map<string, { ip: string; expiresAt: number }>();
  return (name: string, now: number): string => {
    const hit = cache.get(name);
    if (hit && hit.expiresAt > now) return hit.ip;
    const record = lookup(name, now);
    cache.set(name, { ip: record.ip, expiresAt: now + record.ttl });
    return record.ip;
  };
}

// L'enregistrement change à t = 100 s : 192.0.2.10 devient 192.0.2.20.
function zone(ttl: number) {
  return (_name: string, now: number): Authoritative => ({ ip: now < 100 ? "192.0.2.10" : "192.0.2.20", ttl });
}

function firstNewAnswer(ttl: number): number {
  const resolve = makeResolver(zone(ttl));
  for (let t = 0; t <= 4000; t += 30) {
    if (resolve("api.alpha-air.example", t) === "192.0.2.20") return t;
  }
  return -1;
}
```

Avec un résolveur interrogé toutes les 30 s, la nouvelle adresse n'est vue qu'à 120 s si le TTL est de 60 s, à 300 s si le TTL est de 300 s, et à 3 600 s si le TTL est de 3 600 s. Le pire cas est le TTL lui-même, compté depuis la dernière consultation. La RFC 1034 en tire une conduite : réduire le TTL avant un changement prévu limite l'incohérence pendant le changement. La documentation du répartiteur réseau d'AWS le rappelle de l'autre côté : un client qui ne respecte pas le TTL et continue d'appeler une adresse retirée du DNS voit ses requêtes échouer.

#### TLS

La RFC 8446 définit TLS 1.3 comme un protocole conçu pour empêcher l'écoute, l'altération et la falsification des messages. Il fournit trois propriétés : l'**authentification** (le serveur est toujours authentifié, le client en option), la **confidentialité** (les données ne sont visibles que des deux extrémités) et l'**intégrité** (une modification est détectée). La documentation de MDN rappelle que le site présente un certificat qui lie sa clé publique à son nom de domaine, émis par une autorité de certification, et que TLS 1.3 est la version courante la plus employée, TLS 1.2 restant en usage.

Deux points demandent de l'attention. D'une part, la RFC 8446 précise pour les données envoyées dès le premier message (*0-RTT*) qu'il n'y a « aucune garantie de non-rejeu entre connexions ». Le cours en tire la consigne de n'accepter en 0-RTT que des requêtes sans effet de bord ou idempotentes ([3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)). D'autre part, le chiffrement se termine à un point : le répartiteur de charge ou le proxy inverse. La documentation d'AWS indique que le répartiteur peut décharger les serveurs du chiffrement et du déchiffrement, avec des certificats qu'il détient. Ce qui se passe entre ce point et les serveurs d'application dépend du réseau ; avec un modèle Zero Trust, on rechiffre aussi à l'intérieur ([11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust), [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) pour l'authentification mutuelle entre services).

#### La répartition de charge

Un répartiteur reçoit les requêtes et les distribue à des cibles qu'il surveille. Le répartiteur d'applications d'AWS fonctionne à la couche 7 : il évalue, dans l'ordre de priorité, les règles de ses écouteurs, qui peuvent porter sur le chemin, le nom d'hôte, des en-têtes ou des paramètres, et choisit une cible dans un groupe ; l'algorithme par défaut est le tourniquet, avec en option le plus petit nombre de requêtes en cours. Le répartiteur réseau fonctionne à la couche 4 : il traite des connexions TCP, UDP ou TLS, choisit la cible par un hachage du flux, et chaque connexion TCP reste sur une seule cible pendant sa durée. NGINX propose, de son côté, le tourniquet (par défaut), le moins de connexions (`least_conn`) et le hachage de l'adresse du client (`ip_hash`), avec des poids, et des contrôles passifs : après `max_fails` échecs consécutifs dans la fenêtre `fail_timeout`, une cible est écartée un moment.

Le choix de l'algorithme compte quand les requêtes n'ont pas toutes le même coût. Le programme suivant compare le tourniquet et le moins de connexions sur 12 requêtes, une toutes les 100 ms, dont une sur trois dure 1 000 ms et les autres 100 ms, réparties sur 3 serveurs.

```typescript
interface Request {
  at: number; // millisecondes
  durationMs: number;
}

type Strategy = "round_robin" | "least_connections";

function simulate(requests: Request[], servers: number, strategy: Strategy): number[] {
  const inFlight: number[][] = Array.from({ length: servers }, () => []);
  const peak: number[] = new Array(servers).fill(0);
  let next = 0;
  for (const r of requests) {
    for (const list of inFlight) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] <= r.at) list.splice(i, 1);
      }
    }
    let target = 0;
    if (strategy === "round_robin") {
      target = next % servers;
      next++;
    } else {
      for (let s = 1; s < servers; s++) {
        if (inFlight[s].length < inFlight[target].length) target = s;
      }
    }
    inFlight[target].push(r.at + r.durationMs);
    peak[target] = Math.max(peak[target], inFlight[target].length);
  }
  return peak;
}
```

Le tourniquet envoie toutes les requêtes longues au premier serveur : il en cumule 4 au même instant, contre 1 pour chacun des deux autres. Le moins de connexions n'en laisse jamais plus de 2 sur un même serveur. Le cas est construit pour l'exemple, avec une période égale au nombre de serveurs : sur un grand nombre de requêtes d'origine variée, le tourniquet se répartit en moyenne correctement. Ce qu'il faut en retenir : le tourniquet ne sait rien de la charge réelle, alors que le moins de connexions l'observe.

#### Le proxy inverse

La RFC 9110 définit la passerelle (*gateway*), ou proxy inverse, comme un intermédiaire qui agit comme serveur d'origine pour la connexion sortante, traduit les requêtes reçues et les transmet à un ou plusieurs autres serveurs. La documentation de NGINX décrit ses usages : répartir la charge, transmettre à des serveurs d'application, avec `proxy_pass` ; modifier les en-têtes transmis, avec `proxy_set_header` (par défaut, `Host` prend la valeur de l'hôte proxifié et `Connection` la valeur `close`) ; mettre en tampon la réponse du serveur, ce qui aide les clients lents, et que `proxy_buffering off` désactive pour diffuser au fil de l'eau.

```nginx
upstream findings_api {
    least_conn;
    server 10.0.1.11:8080 max_fails=2 fail_timeout=10s;
    server 10.0.1.12:8080 max_fails=2 fail_timeout=10s;
}

server {
    listen              443 ssl;
    server_name         api.alpha-air.example;
    ssl_certificate     api.alpha-air.example.crt;
    ssl_certificate_key api.alpha-air.example.key;

    location / {
        proxy_pass       http://findings_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Le serveur termine TLS pour le nom `api.alpha-air.example`, puis transmet à deux serveurs d'application aux adresses privées. L'adresse du client, que les serveurs ne voient plus directement, voyage dans un en-tête : une application ne doit lui faire confiance que s'il a été posé par le proxy de confiance, et non par le client (consigne du cours). Un proxy inverse prolonge naturellement une passerelle d'API ([10.4 API Gateway](10-api-integrations-extensibilite.md#104-api-gateway)) : cette dernière y ajoute l'authentification, la limitation de débit et le versionnement.

#### Le réseau privé

La RFC 1918 réserve trois blocs d'adresses aux réseaux privés : `10.0.0.0/8`, `172.16.0.0/12` et `192.168.0.0/16`. Leur raison d'être est de laisser des organisations adresser leurs machines internes sans enregistrer d'adresses et en économisant l'espace d'adresses uniques. Ces adresses ne sont uniques qu'à l'intérieur d'une organisation : elles ne sont pas joignables de l'Internet public. Le programme suivant teste l'appartenance à ces blocs.

```typescript
function ipv4ToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    throw new Error(`adresse IPv4 invalide : ${ip}`);
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function inCidr(ip: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

// Les trois blocs réservés par la RFC 1918.
const PRIVATE_BLOCKS: { base: string; bits: number }[] = [
  { base: "10.0.0.0", bits: 8 },
  { base: "172.16.0.0", bits: 12 },
  { base: "192.168.0.0", bits: 16 },
];

function isRfc1918(ip: string): boolean {
  return PRIVATE_BLOCKS.some((b) => inCidr(ip, b.base, b.bits));
}
```

Les adresses `10.2.3.4`, `172.16.0.1`, `172.31.255.255` et `192.168.1.10` sont privées ; `172.32.0.1`, `192.169.0.1`, `8.8.8.8` et l'adresse d'exemple `192.0.2.10` ne le sont pas, et `300.1.1.1` lève une erreur. Ce test resservira à refuser, dans le code des appels sortants, les adresses privées qui ouvriraient une falsification de requête côté serveur ([7.5 Webhook](07-evenements-automatisation.md#75-webhook)), à condition de l'appliquer après la résolution du nom.

Dans un nuage, le réseau privé prend la forme d'un réseau virtuel. D'après la documentation d'Amazon VPC, c'est un réseau logiquement isolé, découpé en **sous-réseaux** dont chacun réside entièrement dans une zone de disponibilité. Un sous-réseau est **public** s'il a une route directe vers une passerelle Internet, **privé** s'il n'en a pas (il faut alors un dispositif NAT pour sortir), **isolé** s'il n'a aucune route vers l'extérieur du réseau. La documentation recommande les sous-réseaux privés pour protéger les ressources. Des **groupes de sécurité** autorisent le trafic entrant et sortant des ressources auxquelles ils sont associés ; des **listes de contrôle d'accès réseau** autorisent ou refusent le trafic à l'échelle d'un sous-réseau.

```text
Internet
  │  443 (TLS)
┌─▼ réseau virtuel, plage privée 10.0.0.0/16 ──────────────────────────────────────────┐
│ sous-réseaux publics    répartiteur de charge (zone a, zone b)                       │
│          │ requêtes (rechiffrées ou non)                                             │
│ sous-réseaux privés     serveurs d'application (zone a, zone b)                      │
│          │                                                                           │
│ sous-réseaux privés     base principale (zone a)  ─  réplica (zone b)                │
│ sortie : dispositif NAT vers Internet pour les appels sortants (webhooks)            │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Modes de défaillance.**

- **Adresse écrite en dur** chez les clients : le déplacement du service les casse.
- **TTL très long** juste avant une migration.
- **Certificat arrivé à expiration** sans renouvellement automatisé.
- **Répartiteur sans sondes de santé** : il continue d'envoyer du trafic à une cible malade.
- **Tout le point d'entrée dans une seule zone** : une panne de zone coupe l'accès.
- **Base de données dans un sous-réseau public**, ou exposée sans nécessité.
- **Confiance excessive dans le réseau interne** : pas de droits ni de chiffrement entre services.
- **En-tête d'adresse client accepté de n'importe qui** : l'adresse est falsifiable.

**Contre-exemple.** L'équipe déplace le service vers un nouveau répartiteur en changeant l'adresse du nom, en pleine journée, alors que le TTL est de 24 heures. Pendant des heures, une partie des clients appelle encore l'ancien répartiteur, qu'il faut donc laisser fonctionner, et le support reçoit des appels incohérents. Abaisser le TTL à 60 secondes la veille, basculer, puis le remonter aurait ramené la fenêtre à quelques minutes.

**Limites.** Cette entrée simplifie : la chaîne de résolution (racine, domaines de premier niveau), l'établissement d'une session TLS, HTTP/2 et HTTP/3, IPv6 et les réseaux de diffusion de contenu ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) ne sont pas détaillés. Les services nommés (répartiteurs et réseau virtuel d'AWS, NGINX) servent d'exemples ; les autres fournisseurs ont des équivalents aux noms différents. Les valeurs de TTL et d'adresses sont des exemples. Et l'exposition d'un système ne se juge pas à une seule couche : un réseau bien découpé n'excuse pas des droits mal réglés.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) | L'authentification mutuelle par certificat identifie les services entre eux |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | La création d'un tenant peut impliquer des noms, des certificats et des réseaux |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Les appels sortants des webhooks se protègent des adresses privées |
| [10.4 API Gateway](10-api-integrations-extensibilite.md#104-api-gateway) | La passerelle d'API prolonge le proxy inverse avec authentification et limitation |
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Le chiffrement en transit repose sur TLS |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust refuse de faire confiance au réseau interne |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les sondes de santé alimentent la répartition de charge |
| [17.5 Rebonds et authentification du courriel](17-collaboration-communication-travail.md#175-rebonds-et-authentification-du-courriel) | L'authentification du courriel s'appuie sur des enregistrements DNS de type TXT |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Un réseau de diffusion de contenu prolonge le DNS et le cache pour les fichiers |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Le routage entre régions emploie le DNS et la répartition de charge |
| [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité) | Les zones de disponibilité bornent les sous-réseaux et la redondance du point d'entrée |

### 5. Application pratique

**Situation initiale.** Alpha Air veut accéder à la plateforme par `maintenance.alpha-air.example`, un nom à elle. L'équipe de la plateforme doit l'ouvrir sans arrêt de service.

**Problème.** Faire répondre ce nom, en TLS, au bon tenant, sans exposer les serveurs internes.

**Application du concept.** On suit le trajet de la requête et on règle chaque couche.

**Déroulé.**

1. Alpha Air crée, dans sa zone DNS, un enregistrement `CNAME` de `maintenance.alpha-air.example` vers `edge.platform.example`, avec un TTL court pendant la mise en service.
2. La plateforme obtient un certificat pour ce nom, émis par une autorité de certification, et le charge sur le répartiteur de charge ; son renouvellement est automatisé et surveillé.
3. Le répartiteur termine TLS, lit le nom d'hôte et route vers le groupe de serveurs d'application, qui déduisent le tenant du nom d'hôte ([5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
4. Les serveurs d'application sont dans des sous-réseaux privés de deux zones, avec des sondes de santé ; la base est dans un sous-réseau privé, sans route vers Internet.
5. Les appels sortants (webhooks) passent par un dispositif NAT, après la vérification que l'adresse résolue n'est pas privée.
6. Le TTL est remonté à une valeur courante une fois la bascule vérifiée.

**Résultat.** Alpha Air utilise son nom, en TLS, sur une plateforme dont les serveurs et la base ne sont pas joignables de l'extérieur.

**Limites.** Le client dépend de sa propre gestion du DNS. Le certificat est un élément à renouveler. Et le routage par nom d'hôte suppose que l'application vérifie que l'utilisateur appartient bien au tenant déduit, sans se fier au seul nom.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quel est le rôle du DNS, et que mesure le TTL ?
2. **Compréhension.** Que protège TLS, et que ne protège-t-il pas ?
3. **Compréhension.** Quelle différence y a-t-il entre un répartiteur de couche 4 et un répartiteur de couche 7 ?
4. **Pourquoi.** Pourquoi abaisse-t-on le TTL avant une migration ?
5. **Raisonnement pratique.** Un sous-réseau n'a aucune route vers une passerelle Internet et héberge la base. Les serveurs de la base doivent télécharger des correctifs. Que faut-il ?

#### Réponses

1. Le DNS associe un nom à des données, notamment une adresse, par des serveurs de noms et des résolveurs. Le TTL est la durée, en secondes, pendant laquelle un enregistrement peut être gardé en cache.
2. TLS protège le transport : confidentialité, intégrité et authentification du serveur. Il ne protège ni d'une requête malveillante, ni d'un serveur compromis, ni des droits mal réglés.
3. La couche 4 traite des connexions (TCP, UDP) et choisit une cible par un hachage du flux, sans lire le contenu. La couche 7 lit la requête HTTP et peut router par chemin, nom d'hôte ou en-tête.
4. Parce que le changement ne devient visible qu'après l'expiration des caches : avec un TTL plus court, les clients adoptent la nouvelle adresse en quelques minutes au lieu de quelques heures.
5. Un dispositif NAT, ou un point d'accès privé vers le service concerné, selon le fournisseur : il laisse les machines privées sortir sans être joignables de l'extérieur. Le sous-réseau n'a pas à devenir public.

## 30.5 Modèles d'exécution et orchestration de conteneurs

### 1. Comprendre simplement

Les **modèles d'exécution** (*compute models*) décrivent où et comment le code de la plateforme s'exécute. Trois dominent. Une **machine virtuelle** (*virtual machine*) simule un ordinateur complet, avec son propre système d'exploitation. Un **conteneur** (*container*) est un processus isolé qui embarque ses fichiers et partage le noyau de la machine hôte. Le **sans serveur** (*serverless*) laisse le fournisseur démarrer et arrêter le code à la demande, sans que l'on gère de serveur. L'**orchestration de conteneurs** (*container orchestration*) est le système qui, pour une flotte de conteneurs, décide où ils tournent, les redémarre quand ils tombent et les remplace progressivement par une nouvelle version.

**Pourquoi cela existe.** Le code doit s'exécuter quelque part, avec des ressources garanties, à l'abri des autres, et se déployer sans interruption. Une machine virtuelle isole fortement mais pèse et démarre plus lentement. Un conteneur est léger. Le sans serveur supprime la gestion des machines et facture à l'usage. Dès que les conteneurs se comptent par dizaines, il faut un système qui les place, les surveille et les remplace.

**Problème résolu.** Exécuter chaque charge sur le modèle dont l'isolation, le coût, le démarrage et l'exploitation correspondent à ses besoins.

**Modèle mental.** Des logements. La **machine virtuelle** est un appartement complet : sa cuisine, son compteur, sa porte. Le **conteneur** est une chambre meublée dans une colocation : elle a sa serrure, mais la cuisine (le noyau) est commune. Le **sans serveur** est le taxi : on paie la course, sans entretenir de véhicule. L'**orchestrateur** est le gestionnaire de la résidence : il attribue les chambres, remplace un occupant parti et rénove étage par étage sans fermer l'immeuble.

**Où l'analogie s'arrête.** Un logement garde son occupant ; un conteneur ou une fonction est jetable et remplaçable, et ne doit pas porter un état que l'on ne peut pas perdre. Et la cuisine commune est un risque d'isolation propre : une faille du noyau touche tous les conteneurs d'un même hôte.

**Exemple.** Alpha Air exécute trois charges : l'API des constats (stable, sans état, de charge régulière), la génération nocturne des rapports (ponctuelle, par rafales) et un analyseur hérité qui exige un système d'exploitation précis. L'API tourne en conteneurs sur un orchestrateur, les rapports en fonctions sans serveur, l'analyseur sur une machine virtuelle dédiée.

**Les composants.**

1. une **image** : paquet figé du code et de ses dépendances ;
2. un **environnement d'exécution** : machine, conteneur ou fonction ;
3. un **ordonnanceur**, qui place les charges sur les machines ;
4. un **état désiré** déclaré (« trois exemplaires de cette version ») ;
5. des **contrôleurs**, qui rapprochent l'état réel de l'état désiré ;
6. des **sondes de santé** ([11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)) ;
7. une **mise à l'échelle**, manuelle ou automatique ;
8. des **ressources déclarées** : processeur et mémoire.

**Objectif d'apprentissage :** vous pouvez comparer machine virtuelle, conteneur et sans serveur, expliquer ce que fait un orchestrateur, et choisir un modèle selon la durée, l'état, l'isolation et le profil de charge.

### 2. Connaissances essentielles

#### Définition

- **Machine virtuelle** : ordinateur simulé par logiciel, qui exécute son propre système d'exploitation et ses applications sur du matériel virtuel.
- **Conteneur** : processus isolé, lancé à partir d'une image, qui embarque les fichiers dont il a besoin et partage le noyau de l'hôte. Le NIST le décrit comme une virtualisation au niveau du système d'exploitation, combinée à un empaquetage de l'application.
- **Sans serveur** : modèle où le fournisseur exécute le code à la demande, gère les serveurs et la mise à l'échelle, et facture à l'usage.
- **Orchestration de conteneurs** : système qui place, démarre, surveille, met à l'échelle et met à jour des conteneurs d'après un état désiré déclaré.

#### Idées fondamentales

1. **Isolation et poids vont dans le même sens.** Une machine virtuelle a son noyau ; un conteneur partage celui de l'hôte ; un service sans serveur multi-clients s'appuie, d'après la documentation d'AWS Lambda, sur une virtualisation de niveau machine virtuelle entre charges.
2. **Une image est immuable.** Pour changer un conteneur, on construit une autre image, que l'on déploie ([21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable)).
3. **Les instances sont jetables.** Un exemplaire est remplaçable à tout moment ; l'état durable vit dans des services dédiés.
4. **Un orchestrateur fonctionne par état désiré.** On déclare ce que l'on veut ; des contrôleurs observent l'état réel et agissent pour s'en rapprocher.
5. **Les mises à jour sont progressives.** On remplace les exemplaires par vagues, avec des bornes de surcapacité et d'indisponibilité, et on garde la possibilité de revenir en arrière ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)).
6. **Le sans serveur a des contraintes.** Durée maximale, mémoire bornée, démarrage à froid, état non garanti d'un appel à l'autre.
7. **On choisit par charge**, non par plateforme : plusieurs modèles coexistent dans une même plateforme.

#### Vocabulaire essentiel

- **Image** (*image*) : paquet standardisé et immuable qui contient fichiers, binaires, bibliothèques et configuration nécessaires pour lancer un conteneur.
- **Noyau** (*kernel*) : cœur du système d'exploitation, partagé par les conteneurs d'un même hôte.
- **Pod** (*Pod*) : plus petite unité déployable de Kubernetes ; groupe d'un ou plusieurs conteneurs avec stockage et réseau partagés.
- **Déploiement** (*Deployment*) : objet Kubernetes qui déclare l'état désiré d'un ensemble de pods et gère leurs mises à jour.
- **Contrôleur** (*controller*) : boucle de contrôle qui observe l'état du cluster et le rapproche de l'état désiré.
- **Sonde de disponibilité, de vivacité** (*readiness*, *liveness probe*) : vérification qui décide si un exemplaire reçoit du trafic, ou s'il doit être redémarré.
- **Démarrage à froid** (*cold start*) : préparation d'un environnement d'exécution neuf avant le premier appel.
- **Mise à l'échelle horizontale** (*horizontal scaling*) : ajout ou retrait d'exemplaires, non de ressources par exemplaire.
- **Modèles d'exécution** (*compute models*) : machine virtuelle, conteneur, sans serveur.

#### Relations de cause à effet

- Un conteneur écrit des fichiers sur son disque local, puis il est remplacé. Les fichiers disparaissent avec lui.
- Une mise à jour progressive se fait sans sonde de disponibilité. L'orchestrateur envoie du trafic à des exemplaires qui ne sont pas prêts, et des exemplaires sains sont remplacés par des exemplaires défaillants.
- Aucune ressource n'est déclarée. L'ordonnanceur place mal les charges, et un exemplaire gourmand gêne ses voisins.
- Une fonction est appelée après une période d'inactivité. Son premier appel inclut un démarrage à froid.
- Les bornes de surcapacité et d'indisponibilité sont toutes deux à zéro. La mise à jour ne peut ni créer ni retirer d'exemplaire : elle est bloquée.

#### Idées reçues

- **« Un conteneur est une petite machine virtuelle. »** Non. Il partage le noyau de l'hôte, alors qu'une machine virtuelle a le sien : la frontière d'isolation n'est pas la même.
- **« Sans serveur veut dire qu'il n'y a pas de serveur. »** Non. Il y a des serveurs, que le fournisseur gère à votre place.
- **« Kubernetes est une plateforme de déploiement complète. »** Non. Sa documentation précise qu'il n'est pas une plateforme-service tout-en-un : il ne construit pas le code et ne fournit pas de bases de données ni de services applicatifs.
- **« Un conteneur règle le problème de l'état. »** Non. Il le rend plus visible : l'état durable doit vivre ailleurs.

#### Principe clé

On choisit le modèle d'exécution par charge, selon la durée, l'état, l'isolation, le démarrage et le coût ; on déclare l'état désiré et l'on laisse des contrôleurs le maintenir.

#### Si vous ne retenez que trois choses

1. Machine virtuelle, conteneur, sans serveur : de l'isolation forte et lourde au code jetable facturé à l'usage.
2. Une instance est jetable : l'état durable vit dans des services dédiés.
3. Un orchestrateur maintient un état désiré par des boucles de contrôle, et met à jour par vagues.

### 3. Explication technique détaillée

#### Trois modèles côte à côte

| Critère | Machine virtuelle | Conteneur | Sans serveur (fonctions) |
|---|---|---|---|
| Unité | Système d'exploitation complet | Processus isolé et ses fichiers, à partir d'une image | Fonction déclenchée par un événement ou une requête |
| Isolation | Noyau propre | Noyau partagé avec l'hôte | Gérée par le fournisseur ; chez AWS Lambda, virtualisation de niveau machine virtuelle |
| Démarrage | Le plus long | Court | Démarrage à froid possible : de moins de 100 ms à plus d'une seconde chez AWS, pour moins de 1 % des appels |
| Qui exploite | Vous : système, correctifs | Vous : image ; l'orchestrateur place | Le fournisseur |
| État local | Disque persistant possible | Jetable | Non garanti d'un appel à l'autre |
| Facturation | À la machine louée | Selon les ressources réservées | À l'appel et à la durée d'exécution |
| Limites | Taille de la machine | Ressources déclarées | Durée maximale, mémoire, concurrence |

Le tableau compare des ordres de grandeur et des propriétés ; il ne chiffre pas le démarrage d'une machine virtuelle ni d'un conteneur, qu'il faut mesurer dans son contexte.

#### Conteneurs et images

La documentation de Docker définit un conteneur comme un processus isolé pour chaque composant d'une application, avec tous les fichiers dont il a besoin. Il est autonome (il ne dépend pas de logiciels installés sur l'hôte), isolé (son influence sur l'hôte et sur les autres conteneurs est limitée), indépendant (on le gère séparément) et portable (il se comporte de la même façon d'un poste de travail à un centre de données). Il partage le noyau de l'hôte, ce qui permet d'exécuter plus d'applications sur moins d'infrastructure qu'avec des machines virtuelles complètes. Une **image** est un paquet standardisé, qui inclut fichiers, binaires, bibliothèques et configuration ; elle est immuable, et un changement en produit une nouvelle. Un conteneur est l'instance en cours d'exécution d'une image. Le guide du NIST sur la sécurité des conteneurs (SP 800-190, septembre 2017) existe précisément parce que ces conteneurs comportent des risques de sécurité propres, avec des parades recommandées ; elles ne sont pas détaillées ici ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)).

#### Le sans serveur

D'après la documentation d'AWS Lambda, le service exécute du code sans qu'on ait à provisionner ni à gérer de serveur : il gère l'infrastructure, la capacité, la mise à l'échelle et les correctifs. Chaque invocation s'exécute indépendamment, sans état partagé, et la facturation est à l'usage. La documentation fixe aussi des bornes : une durée maximale de 900 secondes (15 minutes) par invocation, une mémoire de 128 à 10 240 Mo, et 1 000 exécutions simultanées par défaut dans une région, valeur relevable. Elle précise que le service est conçu pour des tâches de courte durée qui ne conservent pas d'état entre invocations, et que des environnements d'exécution peuvent être réutilisés (« démarrage à chaud »), sans que l'état persiste forcément. Le premier appel d'un environnement neuf paie le démarrage à froid.

Le choix entre un parc toujours actif et des fonctions se calcule : à faible volume, l'usage à la demande coûte moins ; à fort volume et à charge régulière, une ressource toujours active devient moins chère. Le programme suivant calcule le seuil, avec des prix d'exemple.

```typescript
interface Pricing {
  alwaysOnMonthly: number; // coût mensuel d'une instance toujours active (valeur d'exemple)
  perMillionRequests: number; // coût par million de requêtes (valeur d'exemple)
  perGbSecond: number; // coût par Gio-seconde (valeur d'exemple)
}

function onDemandMonthlyCost(requests: number, avgDurationMs: number, memoryGb: number, p: Pricing): number {
  const gbSeconds = requests * (avgDurationMs / 1000) * memoryGb;
  return (requests / 1_000_000) * p.perMillionRequests + gbSeconds * p.perGbSecond;
}

function breakEvenRequests(avgDurationMs: number, memoryGb: number, p: Pricing): number {
  const costPerRequest = p.perMillionRequests / 1_000_000 + (avgDurationMs / 1000) * memoryGb * p.perGbSecond;
  return p.alwaysOnMonthly / costPerRequest;
}
```

Avec des prix inventés, en unités monétaires arbitraires (70 par mois pour l'instance, 0,20 par million de requêtes et 0,00002 par Gio-seconde), des appels de 200 ms et 0,5 Gio : 1 million de requêtes par mois coûtent 2,20 ; 10 millions, 22,00 ; 50 millions, 110,00. Le seuil est d'environ 31,8 millions de requêtes par mois, soit 12,3 requêtes par seconde en moyenne. Le calcul est volontairement incomplet : il omet la passerelle, le transfert de données, la supervision et le temps de l'équipe pour exploiter une machine, et il suppose que la machine toujours active absorbe toute la charge.

#### L'orchestration

La documentation de Kubernetes le définit comme une plateforme portable, extensible et libre pour gérer des charges et des services conteneurisés, qui facilite la configuration déclarative et l'automatisation. Elle liste des capacités : découverte de services et répartition de charge, orchestration du stockage, déploiements et retours arrière automatisés, placement automatique selon les besoins en processeur et en mémoire, auto-réparation (redémarrage ou remplacement des conteneurs défaillants, ou qui échouent à leurs sondes), gestion des secrets et de la configuration. Elle précise qu'il n'est pas une plateforme-service traditionnelle : il opère au niveau du conteneur, ne construit pas le code, n'impose pas de solutions de journalisation ni de supervision. Il n'est pas non plus une simple orchestration au sens d'un enchaînement défini : il exécute des processus de contrôle indépendants qui rapprochent sans cesse l'état courant de l'état désiré.

Un **pod** est la plus petite unité déployable : un groupe d'un ou plusieurs conteneurs, avec stockage et réseau partagés. La documentation le décrit comme relativement éphémère et jetable, et recommande de ne pas créer de pods directement mais par des ressources de charge de travail comme un déploiement ou une tâche. Un **déploiement** fournit des mises à jour déclaratives pour des pods : le contrôleur change l'état réel vers l'état désiré à un rythme contrôlé ; une mise à jour crée un nouvel ensemble d'exemplaires qu'il augmente progressivement pendant qu'il réduit l'ancien ; on peut revenir à une révision antérieure. Deux bornes règlent le rythme : `maxSurge` (nombre d'exemplaires créés au-delà du nombre désiré, 25 % par défaut) et `maxUnavailable` (nombre d'exemplaires indisponibles pendant la mise à jour, 25 % par défaut) ; elles ne peuvent pas être toutes deux à zéro. Les **sondes** précisent l'état d'un conteneur : la sonde de vivacité décide d'un redémarrage ; la sonde de disponibilité décide s'il reçoit du trafic (un exemplaire qui échoue est retiré des destinations du service) ; la sonde de démarrage protège les conteneurs lents à démarrer.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: findings-api
  labels:
    app: findings-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: findings-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: findings-api
    spec:
      containers:
        - name: api
          image: registry.example/alpha/findings-api:1.42.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /healthz/ready
              port: 8080
            periodSeconds: 5
```

Ce document déclare trois exemplaires de la version 1.42.0, une mise à jour qui ajoute au plus un exemplaire sans jamais en retirer tant que le nouveau n'est pas prêt, des ressources demandées (l'ordonnanceur s'en sert pour placer l'exemplaire) et une sonde de disponibilité. C'est un état désiré, versionné comme du code ([21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops)).

Le programme suivant simule trois idées : la réconciliation (un exemplaire en échec est supprimé et remplacé), la mise à jour par vagues, et la règle de mise à l'échelle horizontale dont la documentation donne la formule : le nombre d'exemplaires désiré est le plafond du nombre actuel multiplié par le rapport entre la mesure courante et la mesure cible.

```typescript
type PodState = "running" | "failed";

interface Pod {
  name: string;
  version: string;
  state: PodState;
}

type Action = { op: "create"; version: string } | { op: "delete"; name: string };

function reconcile(desired: number, version: string, pods: Pod[]): Action[] {
  const actions: Action[] = [];
  for (const p of pods) {
    if (p.state === "failed") actions.push({ op: "delete", name: p.name });
  }
  const healthy = pods.filter((p) => p.state === "running" && p.version === version).length;
  for (let i = healthy; i < desired; i++) actions.push({ op: "create", version });
  return actions;
}

function rollingUpdate(desired: number, maxSurge: number, maxUnavailable: number): string[] {
  let oldCount = desired;
  let newCount = 0;
  const states: string[] = [`anciens ${oldCount}, nouveaux ${newCount}`];
  while (oldCount > 0 || newCount < desired) {
    let progressed = false;
    const room = desired + maxSurge - (oldCount + newCount);
    const toCreate = Math.min(room, desired - newCount);
    if (toCreate > 0) {
      newCount += toCreate;
      progressed = true;
      states.push(`anciens ${oldCount}, nouveaux ${newCount} (créés)`);
    }
    const removable = Math.min(oldCount, oldCount + newCount - (desired - maxUnavailable));
    if (removable > 0) {
      oldCount -= removable;
      progressed = true;
      states.push(`anciens ${oldCount}, nouveaux ${newCount} (retirés)`);
    }
    if (!progressed) {
      states.push("blocage : ni création ni retrait possible");
      break;
    }
  }
  return states;
}

function desiredReplicas(current: number, currentMetric: number, targetMetric: number): number {
  return Math.ceil(current * (currentMetric / targetMetric));
}
```

Sur trois exemplaires dont l'un est en échec, la réconciliation supprime l'exemplaire défaillant et en crée un nouveau. Une mise à jour de trois exemplaires avec une surcapacité de 1 et aucune indisponibilité passe par les états (anciens, nouveaux) : (3, 0), (3, 1), (2, 1), (2, 2), (1, 2), (1, 3), (0, 3) : on ne descend jamais sous trois exemplaires disponibles, au prix d'un exemplaire supplémentaire pendant la mise à jour. Avec une surcapacité de 0 et une indisponibilité de 1, on retire d'abord un exemplaire, puis on le remplace : la capacité tombe à deux pendant la mise à jour, mais aucun exemplaire supplémentaire n'est nécessaire. Avec 0 et 0, la mise à jour est bloquée. La simulation suppose que les nouveaux exemplaires sont prêts dès leur création, ce que la sonde de disponibilité vérifie en réalité. Pour la mise à l'échelle, 4 exemplaires à 90 % de processeur avec une cible de 60 % donnent $\lceil 4 \times 90/60 \rceil = 6$ exemplaires ; 6 exemplaires à 20 % avec la même cible donnent 2.

#### Sans état et conteneurs

La méthodologie des douze facteurs précise que les processus d'une application sont sans état et ne partagent rien : toute donnée durable appartient à un service d'appui, comme une base de données. Elle range parmi les violations les sessions collantes, où la session d'un utilisateur est tenue en mémoire par un processus vers lequel on renvoie ses requêtes ; elle recommande un magasin externe avec expiration. C'est ce qui rend les exemplaires interchangeables, donc remplaçables et multipliables par un orchestrateur : les fichiers vont en stockage d'objets ([30.2 Types de stockage](#302-types-de-stockage)), les sessions en clé-valeur ([30.1 Familles de bases de données](#301-familles-de-bases-de-données)).

#### Choisir un modèle par charge

| Charge | Profil | Modèle | Raison |
|---|---|---|---|
| API des constats | Régulière, sans état, mises à jour fréquentes | Conteneurs orchestrés | Charge continue ; mises à jour par vagues |
| Rapports par tenant | Rafales brèves, quelques minutes | Fonctions sans serveur | Pas de capacité inutilisée entre deux rafales |
| Rapport mensuel consolidé | 25 minutes | Tâche planifiée en conteneur | Dépasse la durée maximale d'une fonction |
| Analyseur hérité | Système précis, état local | Machine virtuelle | Contrôle du système, isolation |
| Base de données | État critique | Service géré ou machine dédiée ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)) | L'état ne se confie pas à une instance jetable |

**Modes de défaillance.**

- **État durable dans l'instance** : perdu au remplacement.
- **Aucune ressource déclarée** : placement hasardeux, voisins perturbés.
- **Pas de sonde de disponibilité** : du trafic arrive sur des exemplaires non prêts.
- **Pas de retour arrière** : une version défaillante reste en place.
- **Orchestrateur trop lourd pour l'équipe** : le temps passe à exploiter l'outil.
- **Fonction pour une tâche longue** : coupée à la limite de durée.
- **Images jamais reconstruites** : des vulnérabilités s'accumulent ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)).
- **Secrets dans l'image** : tout porteur de l'image les lit ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).

**Contre-exemple.** Une équipe de six personnes installe et exploite elle-même un orchestrateur complet pour une seule application. Elle passe ses semaines à gérer les mises à jour du cluster, les certificats et le réseau, et livre moins de fonctionnalités. Un service géré de conteneurs, voire une plateforme d'application, aurait réduit la charge d'exploitation ; l'orchestrateur se justifie quand le nombre de charges et d'équipes le demande, seuil que ce cours ne chiffre pas.

**Limites.** Les bornes citées (15 minutes, 128 à 10 240 Mo, 1 000 exécutions, démarrage à froid) sont celles d'un fournisseur à la date de consultation. Les prix du calcul sont inventés. Les termes (pod, déploiement) sont ceux de Kubernetes ; d'autres orchestrateurs existent et ne sont pas traités. La comparaison d'isolation entre machine virtuelle et conteneur est qualitative, et la sécurité des conteneurs n'est qu'effleurée. Enfin, un orchestrateur ne dispense pas de concevoir pour la panne : il la rend simplement plus automatique à traiter.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.1 SaaS](01-architecture-saas.md#11-saas) | Machines virtuelles, plateformes et applications correspondent aux modèles de service IaaS, PaaS et SaaS |
| [1.10 Monolithe, monolithe modulaire et microservices](01-architecture-saas.md#110-monolithe-monolithe-modulaire-et-microservices) | Les microservices multiplient les exécutables, d'où l'orchestration |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les tâches planifiées et de fond s'exécutent en conteneurs ou en fonctions |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les sondes de santé pilotent le trafic et les redémarrages |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité décide des ressources et de la marge |
| [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) | L'image est l'artefact de build immuable |
| [21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops) | Les manifestes d'orchestration sont de l'infrastructure déclarée comme du code |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les mises à jour par vagues et les retours arrière sont ceux du déploiement progressif |
| [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact) | L'architecture cellulaire s'appuie sur des groupes d'exécution isolés |
| [30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité) | Un orchestrateur ou une base peuvent être des services gérés |

### 5. Application pratique

**Situation initiale.** L'API des constats tourne sur deux machines virtuelles mises à jour à la main, avec des interruptions. Les rapports nocturnes s'exécutent sur les mêmes machines et ralentissent l'API de jour. Un rapport mensuel consolidé dure 25 minutes. Un analyseur hérité exige un système d'exploitation ancien.

**Problème.** Mettre à jour sans interruption, isoler les rapports, absorber les pics et traiter le cas de l'analyseur.

**Application du concept.** On classe chaque charge, on déclare l'état désiré et on laisse un orchestrateur maintenir l'API.

**Déroulé.**

1. L'API (stable, sans état) passe en conteneurs sur un orchestrateur, avec trois exemplaires répartis sur deux zones ([30.6 Services gérés ou auto-gérés, régions et zones de disponibilité](#306-services-gérés-ou-auto-gérés-régions-et-zones-de-disponibilité)).
2. Le pipeline construit une image immuable, étiquetée par version ([21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable)), et la déclare dans un déploiement avec une sonde de disponibilité et des ressources demandées.
3. La mise à jour se fait avec une surcapacité de 1 et aucune indisponibilité ; un retour arrière redéploie la révision précédente.
4. La mise à l'échelle suit une cible de 60 % de processeur : à 90 % sur 4 exemplaires, elle passe à 6.
5. Les rapports par tenant, de quelques minutes, deviennent des fonctions déclenchées par une file ; le rapport mensuel de 25 minutes, qui dépasse la durée d'une fonction, devient une tâche planifiée en conteneur.
6. L'analyseur hérité reste sur une machine virtuelle dédiée, avec un plan pour le remplacer.
7. Les fichiers et les sessions sortent des instances ([30.2 Types de stockage](#302-types-de-stockage), [30.1 Familles de bases de données](#301-familles-de-bases-de-données)).

**Résultat.** Des mises à jour sans interruption, des rapports sans effet sur l'API, une capacité qui suit la charge, et une charge héritée isolée.

**Limites.** L'orchestrateur ajoute une exploitation à maîtriser. Le sans serveur impose ses limites (durée, état). Et chaque modèle ajouté multiplie les pipelines, les journaux et les compétences à entretenir.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence essentielle entre une machine virtuelle et un conteneur ?
2. **Compréhension.** Qu'est-ce que l'état désiré dans un orchestrateur, et qui le maintient ?
3. **Compréhension.** Pourquoi dit-on qu'un conteneur est jetable ?
4. **Pourquoi.** Pourquoi une sonde de disponibilité est-elle nécessaire pendant une mise à jour par vagues ?
5. **Raisonnement pratique.** Un traitement dure 40 minutes, une fois par nuit. Une fonction sans serveur convient-elle ? Que choisissez-vous ?

#### Réponses

1. Une machine virtuelle exécute son propre système d'exploitation et son noyau ; un conteneur est un processus isolé qui partage le noyau de l'hôte. Le conteneur est plus léger, avec une frontière d'isolation différente.
2. C'est la description de ce que l'on veut : nombre d'exemplaires, version, ressources. Des contrôleurs observent l'état réel et agissent pour le rapprocher de l'état désiré.
3. Parce qu'il peut être arrêté, remplacé ou déplacé à tout moment ; ce qu'il écrit localement n'est pas conservé. Les données durables vont dans des services dédiés.
4. Parce que sans elle, l'orchestrateur ne sait pas quand un nouvel exemplaire peut recevoir du trafic : il peut retirer des exemplaires sains et envoyer des requêtes à des exemplaires qui ne sont pas prêts.
5. Pas telle quelle, si la durée maximale d'une fonction est de 15 minutes. On choisit une tâche planifiée en conteneur, ou on découpe le traitement en unités plus courtes, selon le coût et la facilité d'exploitation.

## 30.6 Services gérés ou auto-gérés, régions et zones de disponibilité

### 1. Comprendre simplement

Un **service géré** (*managed service*) est un service dont le fournisseur exploite le logiciel et l'infrastructure : installation, correctifs, sauvegardes, détection des pannes, bascule. Un service **auto-géré** (*self-managed service*) est un logiciel que vous installez et exploitez vous-même, sur des machines louées ou possédées. Le choix entre les deux (*managed versus self-managed service*) déplace la frontière des responsabilités. Une **région** (*region*) est un lieu géographique où un fournisseur regroupe des centres de données. Elle contient plusieurs **zones de disponibilité** (*availability zone*), des emplacements isolés les uns des autres, de sorte qu'une panne locale n'en touche qu'une.

**Pourquoi cela existe.** Exploiter une base de données ou un orchestrateur demande des compétences rares, des astreintes et du temps ; un fournisseur peut mutualiser ce travail. En contrepartie, on y perd du contrôle et l'on y gagne une dépendance. Par ailleurs, des pannes localisées (courant, refroidissement, réseau) et des obligations géographiques imposent de savoir précisément où les choses tournent.

**Problème résolu.** Décider qui exploite chaque brique, et où elle s'exécute physiquement, pour tenir ses engagements de disponibilité, de résidence des données et de coût.

**Modèle mental.** Un traiteur et une cuisine à la maison. Chez le traiteur (le service géré), les courses, la cuisine et la vaisselle sont faites : vous choisissez le menu et vous goûtez. À la maison (l'auto-géré), tout vous revient, du choix du four à la vaisselle ; vous avez plus de liberté et plus de travail. La **région** est la ville ; les **zones** en sont les quartiers, chacun avec son propre poste électrique. Une coupure dans un quartier laisse les autres allumés ; une panne générale de la ville les éteint tous.

**Où l'analogie s'arrête.** Chez un traiteur, on juge le repas tout de suite. Avec un service géré, on ne voit ni ses sauvegardes ni ses bascules tant qu'on n'a pas éprouvé une restauration. Et la responsabilité n'est jamais entièrement transférée : on reste responsable de ses données, de ses accès et de ses requêtes.

**Exemple.** Alpha Air choisit pour la plateforme une base PostgreSQL gérée, dans la région `eu-west`, en configuration multi-zones : une instance principale dans la zone `a`, une réplique synchrone dans la zone `b`. Une réplique asynchrone vit dans la région `eu-central`, pour la reprise après sinistre ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).

**Les composants.**

1. le **modèle d'exploitation** : géré ou auto-géré ;
2. le **partage des responsabilités** entre fournisseur et client ;
3. la **région** choisie ;
4. les **zones** utilisées ;
5. la **configuration de redondance** : zonale, ou redondante entre zones ;
6. la **fiche de service** : propriétaire, objectifs, sortie ;
7. le **coût** ;
8. le **plan de sortie**.

**Objectif d'apprentissage :** vous pouvez dire ce qu'un service géré prend en charge et ce qu'il laisse au client, expliquer la différence entre région et zone, et décider d'une configuration multi-zones pour un objectif de disponibilité.

### 2. Connaissances essentielles

#### Définition

- **Service géré** : service dont le fournisseur assure l'exploitation courante (installation, correctifs, sauvegardes, détection des pannes, reprise), le client gardant la responsabilité de ses données, de ses accès et de son usage.
- **Service auto-géré** : logiciel que le client installe et exploite lui-même, y compris le système, les correctifs, les sauvegardes et la haute disponibilité.
- **Région** : lieu géographique où un fournisseur regroupe des zones de disponibilité.
- **Zone de disponibilité** : un ou plusieurs centres de données d'une région, avec leurs propres alimentation, refroidissement et réseau, isolés des autres zones.

#### Idées fondamentales

1. **La responsabilité est partagée, jamais entièrement transférée.** AWS distingue la sécurité « du » nuage, qu'il assure, de la sécurité « dans » le nuage, qui reste au client.
2. **Plus c'est géré, moins on contrôle.** Le NIST décrit un client SaaS qui ne gère ni système ni infrastructure, un client PaaS qui contrôle ses applications, un client IaaS qui contrôle le système et le stockage.
3. **Une région est un ensemble de zones.** AWS indique un minimum de trois zones par région ; Google, trois zones ou plus ; Azure précise que toutes ses régions n'offrent pas de zones, et la liste donne trois zones à presque toutes celles qui en offrent.
4. **Une zone protège d'une panne locale, pas d'une panne de région.** Azure le précise : les zones ne protègent pas d'une indisponibilité de la région entière.
5. **La redondance entre zones se configure.** Un service peut être redondant entre zones, ou rattaché à une seule zone (zonal).
6. **Le choix de la région est contraint** par la latence, le coût, la disponibilité des services et la réglementation.
7. **Il faut un plan de sortie.** Une dépendance à un service géré propriétaire a un coût de changement ([29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité)).

#### Vocabulaire essentiel

- **Responsabilité partagée** (*shared responsibility model*) : répartition des tâches de sécurité et d'exploitation entre fournisseur et client.
- **Région et zone de disponibilité** (*region and availability zone*) : lieu géographique, et emplacement isolé à l'intérieur de ce lieu.
- **Déploiement multi-zones** (*Multi-AZ*) : configuration où une instance principale et une réplique sont dans des zones différentes.
- **Ressource zonale** (*zonal resource*) : ressource placée dans une seule zone que l'on choisit.
- **Ressource redondante entre zones** (*zone-redundant resource*) : ressource que le service réplique sur plusieurs zones.
- **Plan de sortie** (*exit plan*) : description de ce qu'il faudrait faire, et à quel coût, pour quitter un service.
- **Services gérés ou auto-gérés** (*managed versus self-managed service*) : les deux modèles d'exploitation.

#### Relations de cause à effet

- On choisit un service géré et l'on considère ne plus rien devoir. Les requêtes lentes, les droits trop larges et les restaurations jamais testées restent à la charge du client.
- Tous les exemplaires sont dans une seule zone. Une panne de zone arrête le service malgré les exemplaires multiples.
- Deux zones sont utilisées à 70 % chacune. La perte d'une zone reporte sa charge sur l'autre, qui atteint 140 % de sa capacité et sature.
- Une région est choisie pour son seul prix. Des données se retrouvent hors du cadre juridique exigé.
- Le service géré repose sur des fonctions propriétaires. La sortie coûte cher, et le changement devient théorique.

#### Idées reçues

- **« Géré veut dire sans responsabilité. »** Non. La documentation d'AWS pour sa base relationnelle gérée précise que l'optimisation des requêtes reste au client.
- **« Plusieurs zones protègent d'une panne de région. »** Non. Elles protègent d'une panne d'une zone ; une panne de région demande une autre région ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).
- **« Deux zones à 99,9 % donnent 99,9999 %. »** Pas automatiquement : seulement sous l'hypothèse de pannes indépendantes et d'une capacité suffisante dans la zone restante.
- **« L'auto-géré est toujours moins cher. »** Non. Son coût inclut le temps d'exploitation : la documentation d'AWS le cite parmi les inconvénients des solutions non gérées.

#### Principe clé

Pour chaque brique, on écrit qui l'exploite et où elle tourne, on assume la part de responsabilité qui reste au client, et l'on dimensionne les zones pour survivre à la perte de l'une d'elles.

#### Si vous ne retenez que trois choses

1. Un service géré est exploité par le fournisseur ; le client reste responsable de ses données, de ses accès, de ses requêtes et de ses restaurations.
2. Une zone protège d'une panne locale, une région regroupe des zones : aucune des deux ne protège de tout.
3. Survivre à la perte d'une zone exige de la capacité de réserve dans les autres.

### 3. Explication technique détaillée

#### Le spectre des responsabilités

Les trois modèles de service du NIST (SP 800-145) rangent les responsabilités. Avec le **SaaS**, le client utilise les applications du fournisseur et ne gère ni le réseau, ni les serveurs, ni les systèmes, ni le stockage. Avec le **PaaS**, il déploie ses propres applications sur l'infrastructure du fournisseur et en contrôle la configuration. Avec l'**IaaS**, il provisionne le calcul, le stockage et le réseau, et contrôle le système, le stockage et les applications déployées ([1.1 SaaS](01-architecture-saas.md#11-saas)). Un service géré de base de données se range, selon la lecture du cours, du côté du PaaS : le fournisseur gère le système et le logiciel de base, le client garde ses données et ses applications. La documentation d'Amazon RDS le détaille en comparant trois façons d'héberger une base.

| Tâche | Sur site | Machine louée (EC2) | Service géré (RDS) |
|---|---|---|---|
| Optimisation applicative | Client | Client | Client |
| Mise à l'échelle | Client | Client | Fournisseur |
| Haute disponibilité | Client | Client | Fournisseur |
| Sauvegardes de la base | Client | Client | Fournisseur |
| Correctifs du logiciel de base | Client | Client | Fournisseur |
| Installation de la base | Client | Client | Fournisseur |
| Correctifs et installation du système | Client | Client | Fournisseur |
| Maintenance des serveurs | Client | Fournisseur | Fournisseur |
| Cycle de vie du matériel | Client | Fournisseur | Fournisseur |
| Alimentation, réseau, refroidissement | Client | Fournisseur | Fournisseur |

La documentation précise que le fournisseur héberge les composants logiciels et l'infrastructure, et que le client reste responsable de l'optimisation des requêtes, qui dépend de la conception de la base, des volumes, de la répartition des données et des charges. Le modèle de responsabilité partagée d'AWS dit la même chose pour des services plus abstraits comme S3 ou DynamoDB : le fournisseur gère l'infrastructure, le système et les plateformes ; le client gère ses données, les options de chiffrement, la classification et les permissions.

#### Régions et zones de disponibilité

```text
Fournisseur
 └─ Région  eu-west
     ├─ Zone a  (un ou plusieurs centres de données ; alimentation, refroidissement, réseau propres)
     ├─ Zone b
     └─ Zone c
 └─ Région  eu-central
     └─ Zones a, b, c
```

Les trois documentations consultées convergent, avec des nuances. Chez **AWS**, une région regroupe un minimum de trois zones de disponibilité isolées et physiquement séparées ; une zone est un ou plusieurs centres de données avec alimentation, réseau et connectivité redondants ; les zones sont séparées d'une distance de plusieurs kilomètres, toutes à moins de 100 km, et reliées par des liaisons à faible latence, assez rapides pour une réplication synchrone ; le trafic entre zones est chiffré. Chez **Azure**, les zones d'une région sont séparées de plusieurs kilomètres, en général à moins de 100 km ; la latence aller-retour visée entre zones est inférieure à 2 ms environ ; le trafic de données entre zones d'une même région n'est pas facturé ; et la correspondance entre zones physiques et zones logiques varie selon l'abonnement, de sorte que « zone 1 » ne désigne pas la même zone pour deux abonnements. Chez **Google Cloud**, une région est une zone géographique indépendante composée de zones ; une zone est « un domaine de défaillance unique dans une région » ; une région compte trois zones ou plus.

Azure distingue deux façons d'utiliser les zones : les ressources **redondantes entre zones**, que le service réplique ou répartit lui-même, et les ressources **zonales**, placées dans une seule zone choisie par le client. Une ressource zonale ne résiste pas à la perte de sa zone, sauf si l'on déploie des ressources séparées dans plusieurs zones et que l'on gère soi-même la bascule. Une ressource **non zonale** peut être placée par le fournisseur dans n'importe quelle zone de la région : elle peut subir la panne d'une zone. Pour sa base gérée, AWS propose un déploiement **multi-zones** : une instance principale, et une réplique de secours synchrone dans une autre zone, provisionnée et entretenue par le service ; dans la variante en grappe, un écrivain et deux lecteurs se répartissent sur trois zones et peuvent tous servir des lectures. Une réplique de lecture dans une autre région est alimentée de façon asynchrone.

#### Combien de zones, et à quel coût

Si une zone est indisponible indépendamment des autres avec une disponibilité $a$, un service qui reste utilisable tant qu'au moins une de $k$ zones répond a la disponibilité $1 - (1 - a)^k$. Pour survivre à la perte d'une zone, chacune des $k$ zones ne peut porter que la part $(k - 1)/k$ de sa capacité : les autres absorbent la charge de celle qui tombe.

```typescript
// Disponibilité d'un service qui reste utilisable tant qu'au moins une zone répond,
// si les zones tombent en panne de façon indépendante (hypothèse forte).
function availabilityAtLeastOneZone(zoneAvailability: number, zones: number): number {
  return 1 - (1 - zoneAvailability) ** zones;
}

// Taux d'utilisation maximal par zone pour que les zones restantes absorbent la perte d'une zone.
function maxUtilizationToSurviveOneZoneLoss(zones: number): number {
  return (zones - 1) / zones;
}

function downtimeMinutesPerYear(availability: number): number {
  return (1 - availability) * 365 * 24 * 60;
}
```

Avec des zones à 99,9 % : une zone donne 99,9 % (525,6 minutes d'indisponibilité par an) ; deux zones donnent 99,9999 % (0,53 minute par an) et exigent de ne pas dépasser 50 % d'utilisation par zone ; trois zones donnent 99,9999999 % et autorisent 66,7 % d'utilisation par zone. Le gain de disponibilité est théorique : il suppose des pannes indépendantes, alors que des pannes corrélées (un défaut logiciel déployé partout, une dépendance commune) existent. Le surcoût de capacité, lui, est certain : c'est l'arbitrage entre efficacité et résilience de l'économie unitaire ([22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)), et celui du « N+1 » de la redondance ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)).

#### Choisir : géré ou auto-géré, où

| Critère | Penche vers un service géré | Penche vers l'auto-géré |
|---|---|---|
| Différenciation ([29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité)) | La brique ne différencie pas le produit | Elle est au cœur du produit ou très spécifique |
| Compétences et astreinte | Rares ou coûteuses | Disponibles, avec un besoin de maîtrise fine |
| Contrôle | Les paramètres standard suffisent | Extensions, versions ou réglages particuliers requis |
| Conformité et résidence ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) | Le fournisseur offre la région et les attestations exigées | Le contrôle direct est exigé |
| Coût ([22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)) | L'exploitation interne coûte plus que la marge du service | Charge stable et forte, exploitation maîtrisée |
| Portabilité ([29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité)) | Protocole standard et export simple : la sortie reste possible | Le même critère s'applique : un manque d'export se paie dans les deux cas |

La décision se consigne dans une fiche de service, donnée structurée que l'on revoit ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)) :

```json
{
  "service": "postgresql-principal",
  "operating_model": "managed",
  "region": "eu-west",
  "zones": ["a", "b"],
  "redundancy": "multi_zone_synchronous",
  "dr_replica": { "region": "eu-central", "replication": "asynchronous" },
  "owner": "team-platform",
  "customer_responsibilities": ["schéma", "requêtes", "accès", "tests de restauration"],
  "exit_plan": "protocole PostgreSQL standard ; export logique régulier ; réplication vers une instance auto-gérée"
}
```

**Modes de défaillance.**

- **Aucun test de restauration** d'un service géré : la sauvegarde est supposée.
- **Redondance déclarée mais toutes les répliques dans la même zone.**
- **Zones saturées** : aucune réserve pour absorber la perte d'une zone.
- **Région choisie sans lien avec la résidence exigée.**
- **Dépendance non cartographiée** à des fonctions propriétaires du service.
- **Zones supposées identiques d'un compte à l'autre** : la numérotation peut différer.
- **Coûts de transfert entre zones et régions ignorés.**

**Contre-exemple.** Une équipe déclare une base « multi-zones », mais place ses deux instances dans la même zone « pour réduire la latence ». Au premier incident de zone, la base et son secours disparaissent ensemble : la redondance ne servait que sur le papier. Une fiche de service qui nomme les zones, et un test annuel de bascule, auraient révélé l'écart.

**Limites.** Les chiffres (trois zones au moins, 100 km, 2 ms) viennent des documentations de trois fournisseurs à la date de consultation et sont des objectifs ou des conditions de service, non des garanties contractuelles. Les termes diffèrent d'un fournisseur à l'autre (zone, zone de disponibilité, emplacement). Le calcul de disponibilité suppose l'indépendance des pannes. Les prix ne sont pas traités. Et le choix géré ou auto-géré se renouvelle : l'équipe, la charge et l'offre évoluent.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.1 SaaS](01-architecture-saas.md#11-saas) | Les modèles IaaS, PaaS et SaaS fixent la frontière des responsabilités |
| [11.7 Disponibilité, fiabilité et résilience](11-securite-fiabilite-operations.md#117-disponibilité-fiabilité-et-résilience) | La disponibilité visée détermine le nombre de zones |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | Redondance, zones et basculement sont l'application de cette entrée |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Une sauvegarde reste nécessaire et se teste, même sur un service géré |
| [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) | La reprise après sinistre emploie une autre région |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | La responsabilité partagée avec le fournisseur est aussi un sujet de conformité |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Le multi-région prolonge le choix des régions et de la résidence |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | L'économie unitaire arbitre entre coût d'exploitation et résilience |
| [29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité) | Construire ou acheter, dépendance et portabilité encadrent le choix géré |
| [30.3 Réplication, partitionnement et modèles de cohérence](#303-réplication-partitionnement-et-modèles-de-cohérence) | Les modes de réplication déterminent ce qui survit à la perte d'une zone |
| [30.5 Modèles d'exécution et orchestration de conteneurs](#305-modèles-dexécution-et-orchestration-de-conteneurs) | Les orchestrateurs et les bases sont proposés en services gérés |

### 5. Application pratique

**Situation initiale.** Alpha Air demande 99,95 % de disponibilité annuelle et une résidence des données dans l'Union européenne. L'équipe de la plateforme compte huit personnes, sans astreinte spécialisée en bases de données. Deux options : PostgreSQL sur des machines virtuelles, ou un PostgreSQL géré.

**Problème.** Choisir le modèle d'exploitation, la région et le nombre de zones, et savoir ce qu'il reste à la charge de l'équipe.

**Application du concept.** On traduit l'objectif en minutes, on applique les critères et on calcule capacité et disponibilité.

**Déroulé.**

1. L'objectif de 99,95 % autorise $0{,}0005 \times 525\,600 = 262{,}8$ minutes d'indisponibilité par an.
2. Une seule zone à 99,9 % donne 525,6 minutes par an : elle n'y suffit pas. Deux zones indépendantes donnent 0,53 minute, en théorie ; la limite réelle viendra des pannes corrélées et du délai de bascule.
3. Pour absorber la perte d'une zone, chaque zone reste sous 50 % d'utilisation avec deux zones, sous 66,7 % avec trois ; on compare ce surcoût au gain.
4. La base n'est pas différenciante et l'équipe n'a pas d'astreinte spécialisée : un service géré, en multi-zones, dans la région `eu-west` pour la résidence, avec une réplique de reprise dans `eu-central`.
5. La fiche de service nomme le propriétaire et dresse la liste de ce qui reste au client : schéma, requêtes, accès, tests de restauration trimestriels.
6. Le plan de sortie s'appuie sur le protocole standard de PostgreSQL et sur un export logique régulier.

**Résultat.** Un objectif traduit en minutes, un modèle d'exploitation choisi sur des critères, une configuration multi-zones dimensionnée, et des responsabilités nommées.

**Limites.** Le calcul est théorique, et le délai de bascule d'un service géré se mesure par un essai, non par la documentation. La région choisie conditionne l'ensemble des données de la base, y compris ses sauvegardes ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)). Et une dépendance à des fonctions propriétaires réduit la portée du plan de sortie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre une région et une zone de disponibilité ?
2. **Compréhension.** Citez trois tâches qu'un service géré de base de données prend en charge, et une qui reste au client.
3. **Compréhension.** De quoi un déploiement multi-zones protège-t-il, et de quoi ne protège-t-il pas ?
4. **Pourquoi.** Pourquoi faut-il de la capacité de réserve dans les zones restantes ?
5. **Raisonnement pratique.** Deux zones sont utilisées chacune à 70 %. Que se passe-t-il à la perte d'une zone, et que faut-il changer ?

#### Réponses

1. Une région est un lieu géographique qui regroupe plusieurs zones ; une zone de disponibilité est un emplacement isolé (un ou plusieurs centres de données) à l'intérieur d'une région, avec ses propres alimentation, refroidissement et réseau.
2. Par exemple : les sauvegardes, les correctifs du logiciel de base, la haute disponibilité et la mise à l'échelle. L'optimisation des requêtes, les accès et les tests de restauration restent au client.
3. Il protège de la perte d'une zone (panne de courant, de refroidissement, de réseau locales). Il ne protège pas d'une panne de la région entière, ni d'une erreur de configuration ou de suppression répliquée sur toutes les copies.
4. Parce que la charge de la zone perdue se reporte sur les autres : si celles-ci n'ont pas de marge, elles saturent à leur tour, et la panne d'une zone devient une panne du service.
5. La charge de la zone perdue (70 %) s'ajoute à celle de l'autre (70 %) : 140 % de sa capacité, donc saturation. Il faut garder chaque zone sous 50 %, ou répartir sur trois zones (66,7 % au maximum par zone).

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Types JSON, indexation GIN | Documentation PostgreSQL 18, JSON Types | https://www.postgresql.org/docs/current/datatype-json.html | 30.1 |
| Présentation de PostgreSQL | Documentation PostgreSQL 18, What Is PostgreSQL? | https://www.postgresql.org/docs/current/intro-whatis.html | 30.1 |
| Modèle de document | MongoDB, Data Modeling Introduction | https://www.mongodb.com/docs/manual/core/data-modeling-introduction/ | 30.1 |
| Types de données Redis | Redis, Data types | https://redis.io/docs/latest/develop/data-types/ | 30.1 |
| Persistance Redis | Redis, Persistence | https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/ | 30.1 |
| Durée de vie d'une clé | Redis, EXPIRE | https://redis.io/docs/latest/commands/expire/ | 30.1 |
| Clé-valeur, document, transactions | AWS, What is Amazon DynamoDB? | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html | 30.1, 30.3 |
| Colonnes larges, clé de partition | Apache Cassandra, Overview | https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html | 30.1 |
| Anneau, facteur de réplication, niveaux de cohérence | Apache Cassandra, Dynamo | https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html | 30.3 |
| Graphe de propriétés | Neo4j, Graph database concepts | https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/ | 30.1 |
| Index, fragments, rafraîchissement | Elastic, Index basics | https://www.elastic.co/docs/manage-data/data-store/index-basics | 30.1 |
| Index inversé (version 2.x du guide, ancienne) | Elasticsearch: The Definitive Guide 2.x, Inverted Index | https://www.elastic.co/guide/en/elasticsearch/guide/2.x/inverted-index.html | 30.1 |
| Persistance polyglotte | M. Fowler, Polyglot Persistence (16 novembre 2011) | https://martinfowler.com/bliki/PolyglotPersistence.html | 30.1 |
| Bases orientées agrégats | M. Fowler, Aggregate Oriented Database | https://martinfowler.com/bliki/AggregateOrientedDatabase.html | 30.1 |
| Blocs, fichiers, objets | AWS, The difference between block, file, and object storage | https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/ | 30.2 |
| Stockage en blocs | AWS, What is Amazon EBS? | https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html | 30.2 |
| Stockage de fichiers | AWS, What is Amazon EFS? | https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html | 30.2 |
| Stockage d'objets, cohérence | AWS, What is Amazon S3? | https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html | 30.2 |
| Objets, taille maximale | AWS, Amazon S3 objects overview | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingObjects.html | 30.2 |
| Durabilité, zones, versionnement | AWS, Data protection in Amazon S3 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html | 30.2 |
| Mises à jour d'objets complets | AWS, Amazon S3 FAQs | https://aws.amazon.com/s3/faqs/ | 30.2 |
| Réplication, basculement | Documentation PostgreSQL 18, High Availability, Load Balancing, and Replication | https://www.postgresql.org/docs/current/high-availability.html | 30.3 |
| Partitionnement | Documentation PostgreSQL 18, Table Partitioning | https://www.postgresql.org/docs/current/ddl-partitioning.html | 30.3 |
| Modèles de cohérence | W. Vogels, Eventually Consistent (23 décembre 2008) | https://www.allthingsdistributed.com/2008/12/eventually_consistent.html | 30.3 |
| Linéarisabilité | Jepsen, Linearizable | https://jepsen.io/consistency/models/linearizable | 30.3 |
| Lire ses écritures | Jepsen, Read your writes | https://jepsen.io/consistency/models/read-your-writes | 30.3 |
| Théorème CAP | M. Kleppmann, Please stop calling databases CP or AP (11 mai 2015) | https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html | 30.3 |
| Lectures à terme et fortes | AWS, DynamoDB read consistency | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html | 30.3 |
| DNS : concepts | RFC 1034, Domain Names — Concepts and Facilities | https://www.rfc-editor.org/rfc/rfc1034.html | 30.4 |
| DNS : implémentation | RFC 1035, Domain Names — Implementation and Specification | https://www.rfc-editor.org/rfc/rfc1035.html | 30.4 |
| Enregistrement IPv6 | RFC 3596, DNS Extensions to Support IP Version 6 | https://www.rfc-editor.org/rfc/rfc3596.html | 30.4 |
| TLS 1.3 | RFC 8446, The Transport Layer Security Protocol Version 1.3 | https://www.rfc-editor.org/rfc/rfc8446.html | 30.4 |
| Certificats et TLS, vue d'ensemble | MDN, Transport Layer Security | https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security | 30.4 |
| Intermédiaires HTTP, passerelle | RFC 9110, HTTP Semantics, section 3.7 | https://www.rfc-editor.org/rfc/rfc9110.html | 30.4 |
| Adresses privées | RFC 1918, Address Allocation for Private Internets | https://www.rfc-editor.org/rfc/rfc1918.html | 30.4 |
| Répartition de charge | AWS, What is Elastic Load Balancing? ; Application Load Balancer ; Network Load Balancer | https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html | 30.4 |
| Répartition et proxy inverse | NGINX, HTTP Load Balancing ; Reverse Proxy ; Configuring HTTPS servers | https://nginx.org/en/docs/http/load_balancing.html | 30.4 |
| Réseau virtuel, sous-réseaux | AWS, What is Amazon VPC? ; Subnets for your VPC | https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html | 30.4 |
| Conteneurs, images | Docker, What is a container? ; What is an image? | https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/ | 30.5 |
| Sécurité des conteneurs | NIST SP 800-190, Application Container Security Guide (septembre 2017) | https://csrc.nist.gov/pubs/sp/800/190/final | 30.5 |
| Virtualisation | NIST SP 800-125, Guide to Security for Full Virtualization Technologies (janvier 2011) | https://csrc.nist.gov/pubs/sp/800/125/final | 30.5 |
| Orchestration | Kubernetes, Overview ; Pods ; Deployments | https://kubernetes.io/docs/concepts/overview/ | 30.5 |
| Sondes, ressources, mise à l'échelle | Kubernetes, Liveness, Readiness and Startup Probes ; Resource Management ; Horizontal Pod Autoscaling | https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/ | 30.5 |
| Sans serveur | AWS, What is AWS Lambda? ; Execution environment lifecycle ; Lambda quotas | https://docs.aws.amazon.com/lambda/latest/dg/welcome.html | 30.5 |
| Processus sans état | The Twelve-Factor App, VI. Processes | https://12factor.net/processes | 30.5 |
| Définition du cloud, modèles de service | NIST SP 800-145, The NIST Definition of Cloud Computing (septembre 2011) | https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf | 30.5, 30.6 |
| Responsabilité partagée | AWS, Shared Responsibility Model | https://aws.amazon.com/compliance/shared-responsibility-model/ | 30.6 |
| Service géré de base de données | AWS, What is Amazon RDS? | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html | 30.6 |
| Régions et zones | AWS, Global Infrastructure : Regions and Availability Zones | https://aws.amazon.com/about-aws/global-infrastructure/regions_az/ | 30.6 |
| Zones de disponibilité | Microsoft Learn, What are Azure availability zones? | https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview | 30.6 |
| Régions et zones | Google Cloud, Geography and regions | https://docs.cloud.google.com/docs/geography-and-regions | 30.6 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Les valeurs d'exemple : nombres de constats, tailles de photos, durées de vie DNS, adresses, prix, noms de régions et de zones, taux d'utilisation.
- Les rôles attribués à chaque famille et à chaque type de stockage dans la plateforme fictive, et les critères de choix, sont des recommandations du cours, sans source externe.
- La comparaison d'isolation entre machine virtuelle et conteneur est qualitative, déduite des documentations de Docker, du NIST et d'AWS ; aucune mesure de démarrage ni de performance n'est donnée.
- Le déroulé de la résolution DNS (de la racine à la zone) est une simplification ; les RFC 1034, 1035, 8446 et 9110 n'ont été lues qu'en partie (le début des textes, jusqu'à 100 000 caractères par RFC).
- La consigne de n'accepter en 0-RTT que des requêtes idempotentes, et celle de ne se fier à l'adresse du client que si un proxy de confiance l'a posée, sont des consignes du cours.
- Les pages des fournisseurs (AWS, Microsoft, Google) décrivent leurs propres produits. Leurs chiffres (taux de panne, durabilité, nombre de zones, distances, latences, limites de service) sont des objectifs de conception ou des limites à la date de consultation, non des garanties ni des mesures indépendantes.
- La carte des modèles de cohérence de Jepsen n'a pas été lue en entier : seules les pages sur la linéarisabilité et sur lire ses écritures l'ont été. Les définitions de la cohérence forte et à terme viennent de l'article de Vogels.
- Les pages de Kubernetes sur les pods et les déploiements, et la FAQ d'Amazon S3, n'ont été lues que sur leurs 100 000 premiers caractères, à l'exception de la section sur la stratégie de mise à jour, lue séparément.
- La page de comparaison d'AWS ne nomme aucun protocole de fichiers : NFS vient de la documentation d'EFS. Les performances relatives des trois types sont celles de cette page.
- Les extraits TypeScript ont été exécutés sur les valeurs d'exemple données ; les scripts SQL ont été analysés syntaxiquement (dialecte PostgreSQL), sans exécution ; les documents JSON et YAML ont été validés syntaxiquement ; la configuration NGINX n'a pas été chargée dans un serveur.
