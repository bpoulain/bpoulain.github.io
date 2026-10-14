# Module 19 — Recherche, analytique et restitution

> **Question directrice.** Comment retrouver une information et la transformer en chiffres fiables, par tenant, sans exposer ce que la personne n'a pas le droit de voir ?

## Présentation du module

**Objectif.** Retrouver une information et la transformer en chiffres fiables constitue une grande part de la valeur perçue d'une plateforme. Le parcours initial décrit l'expérience de recherche et de tableau de bord ([12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues), [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)). Ce module décrit l'infrastructure qui les rend possibles : l'indexation et le classement, l'isolation des index par tenant, l'entrepôt de données, le modèle de mesure, les rapports planifiés et la fiabilité des chiffres produits.

**Prérequis.** Les permissions au niveau ressource, champ et ligne ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), la cohérence à terme ([7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)), le modèle de lecture dérivé ([7.10 CQRS](07-evenements-automatisation.md#710-cqrs)), les synchronisations et l'ETL ([10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)), la recherche et les vues côté utilisateur ([12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)) et les tableaux de bord ([12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)). Les index de base de données ([2.14 Index](02-donnees-ressources.md#214-index)) et l'isolation des tenants ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) servent de repères.

**Un mot, plusieurs sens.** Le mot « index » désigne ici deux objets différents. L'**index de base de données** accélère une recherche exacte ou par plage sur une colonne ([2.14 Index](02-donnees-ressources.md#214-index)). L'**index de recherche** retrouve des documents à partir des mots qu'ils contiennent. Les deux ne se remplacent pas.

**Ordre retenu.** Trois groupes, de la recherche à la restitution des chiffres.

```text
Rechercher   index inversé ─ analyse de texte ─ pertinence et facettes ─ chaîne d'indexation ─ droits et tenants ─ autocomplétion et vecteurs
Analyser     charge transactionnelle et analytique, entrepôt, lac, ELT ─ modèle dimensionnel et couche sémantique ─ agrégats, libre-service, embarqué, droits par ligne
Restituer    générateur, rapports planifiés, instantanés ─ formats, définitions, reproductibilité, fraîcheur
```

| Groupe | Question de l'utilisateur |
|---|---|
| Rechercher | Comment retrouver vite ce que je cherche, sans voir ce que je n'ai pas le droit de voir ? |
| Analyser | Comment obtenir des chiffres sans ralentir l'application, et avec une seule définition par indicateur ? |
| Restituer | Comment recevoir, conserver et justifier un chiffre, à une date donnée ? |

**Références.** Les normes, documentations et ouvrages cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé)
- [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation)
- [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes)
- [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)
- [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)
- [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle)
- [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)
- [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique)
- [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)
- [19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport)
- [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)

## 19.1 Index de recherche et index inversé

### 1. Comprendre simplement

Un **index de recherche** (*search index*) est une structure construite à l'avance à partir des données, qui permet de retrouver vite les éléments correspondant à une requête, sans parcourir tout le contenu. Un **index inversé** (*inverted index*) est la forme la plus courante d'index de recherche en texte libre : il associe chaque mot, appelé **terme**, à la liste des documents où il apparaît.

**Pourquoi cela existe.** Pour trouver « fissure » parmi 800 000 constats, parcourir chaque description avec une condition du type `LIKE '%fissure%'` lit tout le texte à chaque requête. Le temps croît avec le volume. Cette méthode ne sait pas non plus classer les résultats, tolérer une faute ou ignorer les accents. L'index inversé déplace le travail à l'écriture, pour que la lecture soit rapide.

**Problème résolu.** Retrouver des documents par leur contenu en un temps presque indépendant du volume total, et conserver ce qu'il faut pour les classer : fréquences et positions des termes.

**Modèle mental.** L'index alphabétique à la fin d'un livre : pour chaque mot clé, la liste des pages. Au lieu de lire le livre, on consulte l'index.

**Où l'analogie s'arrête.** L'index d'un livre est fait une fois, par une personne. Un index de recherche est reconstruit en continu, il stocke aussi des comptes et des positions, et c'est une copie dérivée qui peut être en retard sur les données.

**Exemple.** Trois constats : 201 « Fissure sur le train d'atterrissage », 202 « Fuite hydraulique près du train », 203 « Corrosion du capot moteur ». L'index inversé contient : *fissure* → 201 ; *train* → 201, 202 ; *atterrissage* → 201 ; *fuite* → 202 ; *hydraulique* → 202 ; *corrosion* → 203 ; *capot* → 203 ; *moteur* → 203. La requête « train fissure » prend la liste de *train* (201, 202), celle de *fissure* (201), et garde l'intersection : 201.

**Les composants.**

1. le **document de recherche** : le contenu et les attributs à indexer (titre, texte, statut, base, tenant) ;
2. l'**analyse**, qui transforme le texte en termes (voir [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation)) ;
3. le **dictionnaire** des termes ;
4. les **listes de publication** (*postings lists*) : documents, fréquences, positions ;
5. les **segments**, fichiers d'index immuables que l'on fusionne ;
6. le **traitement de requête** : intersection, union, classement (voir [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes)) ;
7. le **magasin de documents**, qui renvoie les champs affichables.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi un index inversé répond vite, décrire ce qu'il contient, et dire en quoi il diffère d'un index de base de données et d'une source de vérité.

### 2. Connaissances essentielles

#### Définition

- **Index de recherche** : structure de données dérivée, construite pour répondre rapidement à des requêtes de recherche sur un ensemble de documents.
- **Index inversé** : index qui associe à chaque terme la liste ordonnée des documents qui le contiennent, avec des statistiques telles que la fréquence et les positions.

#### Idées fondamentales

1. **On inverse la relation.** Au lieu de « document → mots », on stocke « mot → documents ».
2. **Le travail se fait à l'écriture.** Indexer coûte ; interroger est rapide.
3. **L'index est une copie dérivée.** Il n'est jamais la source de vérité : la base reste l'autorité (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
4. **Les listes sont triées par identifiant.** L'intersection de deux listes se fait par fusion, en un seul passage.
5. **Un index conserve plus que la présence.** Fréquences et positions servent le classement et les expressions exactes.
6. **Un index se conçoit par champ.** Texte analysé, valeur exacte, nombre, date : chaque type a son usage.

#### Vocabulaire essentiel

- **Terme** (*term*) : unité indexée, produite par l'analyse du texte.
- **Dictionnaire** (*dictionary*) : ensemble des termes de l'index, avec des statistiques.
- **Liste de publication** (*postings list*) : pour un terme, la liste des documents qui le contiennent.
- **Fréquence de document** (*document frequency*) : nombre de documents qui contiennent un terme.
- **Fréquence du terme** (*term frequency*) : nombre d'occurrences d'un terme dans un document.
- **Segment** (*segment*) : fichier d'index immuable, écrit en une fois et fusionné plus tard.
- **Champ texte et champ mot-clé** (*text field*, *keyword field*) : le premier est analysé pour la recherche en texte libre, le second conserve la valeur exacte.

#### Relations de cause à effet

- La recherche se fait par balayage de la base : le temps de réponse suit le volume et la base transactionnelle est chargée.
- L'index n'est jamais tenu à jour : les nouveaux constats restent invisibles.
- L'unicité est vérifiée dans l'index : deux requêtes simultanées passent entre deux indexations, et un doublon naît.
- Tous les champs sont analysés comme du texte : un identifiant est découpé, et le tri ou les agrégations ne fonctionnent plus.
- L'index contient des champs que la base protège : la recherche devient un chemin de fuite (voir [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)).

#### Idées reçues

- **« L'index de ma base de données suffit. »** Non. Un index de colonne accélère une recherche exacte ou par plage ; il ne retrouve pas les documents qui contiennent un mot (voir [2.14 Index](02-donnees-ressources.md#214-index)).
- **« L'index est une copie exacte des données. »** Non. Il est dérivé, transformé par l'analyse, et en retard sur la base.
- **« Plus on indexe de champs, mieux c'est. »** Non. Chaque champ coûte du stockage et du temps d'écriture, ajoute du bruit au classement et augmente le risque de fuite.

#### Principe clé

Un index inversé range les documents par mot, à l'écriture, pour que la lecture soit rapide ; c'est une copie dérivée, jamais la source de vérité.

#### Si vous ne retenez que trois choses

1. Un index inversé associe chaque terme à la liste triée des documents qui le contiennent.
2. Il déplace le coût vers l'écriture, et il est en retard sur la base : il ne fait jamais autorité.
3. Il se conçoit champ par champ : texte analysé pour chercher, mot-clé pour filtrer, trier et compter.

### 3. Explication technique détaillée

#### Du document au document de recherche

La plateforme ne copie pas la ressource telle quelle : elle construit un **document de recherche**, aplati, avec les champs utiles à la recherche et au filtrage.

```json
{
  "id": "fd_204",
  "tenant_id": "ten_airline_01",
  "type": "finding",
  "title": "Fissure sur le train d'atterrissage principal",
  "description": "Fissure de 12 mm observée sur le longeron gauche lors de l'inspection A.",
  "status": "open",
  "severity": "critical",
  "base": "LYS",
  "aircraft": "F-ABCD",
  "created_at": "2026-10-12T08:14:00Z",
  "updated_at": "2026-10-12T09:02:00Z"
}
```

Le choix du type de chaque champ s'appelle le **mappage**. La documentation d'un moteur de recherche courant distingue les champs *texte*, analysés en termes individuels pour la recherche en texte libre, et les champs *mot-clé*, conservés comme valeurs exactes, qui servent au tri et aux agrégations. Quand on a les deux besoins, on déclare le champ sous deux formes.

```json
{
  "index": "findings",
  "fields": {
    "title":       { "kind": "text",    "analyzer": "fr", "boost": 3 },
    "description": { "kind": "text",    "analyzer": "fr" },
    "status":      { "kind": "keyword", "facet": true },
    "severity":    { "kind": "keyword", "facet": true },
    "base":        { "kind": "keyword", "facet": true },
    "aircraft":    { "kind": "keyword" },
    "created_at":  { "kind": "date" }
  }
}
```

*Le format de cet exemple est propre à la plateforme fictive ; les moteurs ont chacun leur syntaxe de mappage.*

#### Dictionnaire et listes de publication

Le manuel de référence de la recherche d'information décrit la construction d'un index inversé en quatre étapes : collecter les documents, les découper en jetons, normaliser les jetons en termes, puis construire le dictionnaire et les listes. Le dictionnaire stocke des statistiques, comme la fréquence de document, qui servent à l'efficacité des requêtes et au classement. Les listes sont triées par identifiant de document.

| Terme | Fréquence de document | Liste de publication (document : positions) |
|---|---|---|
| *train* | 2 | 201 : [4] ; 202 : [5] |
| *fissure* | 1 | 201 : [1] |
| *atterrissage* | 1 | 201 : [6] |
| *hydraulique* | 1 | 202 : [2] |
| *du* | 2 | 202 : [4] ; 203 : [2] |

Les positions permettent de vérifier une expression exacte : « train atterrissage » exige que les deux termes se suivent. Les mots courts comme *du* ou *sur* sont traités par l'analyse (voir [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation)).

#### Interroger : intersection et union

Une requête « A et B » intersecte deux listes triées. Les deux listes avancent ensemble, et chaque élément est examiné une seule fois : le coût est proportionnel à la somme des longueurs.

```typescript
type Postings = number[];

function buildIndex(docs: Map<number, string>): Map<string, Postings> {
  const index = new Map<string, Postings>();
  const ordered = [...docs.entries()].sort((a, b) => a[0] - b[0]);
  for (const [docId, text] of ordered) {
    const terms = new Set(text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    for (const term of terms) {
      const list = index.get(term) ?? [];
      list.push(docId);
      index.set(term, list);
    }
  }
  return index;
}

function intersect(a: Postings, b: Postings): Postings {
  const out: Postings = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push(a[i]);
      i++;
      j++;
    } else if (a[i] < b[j]) {
      i++;
    } else {
      j++;
    }
  }
  return out;
}
```

Appliqué aux trois constats de l'exemple, `intersect(index.get("train"), index.get("fissure"))` renvoie `[201]`. Une requête « A ou B » réunit les listes, une requête « A sans B » en retire les éléments de B, de la même façon.

#### Segments et fusions

Les moteurs de la famille Lucene écrivent l'index en **segments** immuables. Une écriture crée un nouveau segment ; une suppression est marquée, puis réalisée à la fusion de segments. La visibilité d'une écriture dépend d'un **rafraîchissement** : la documentation d'un moteur courant indique qu'une écriture devient recherchable en environ une seconde, et que ce mécanisme explique le qualificatif « quasi temps réel » (voir [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).

#### Index de base de données et index de recherche

| Critère | Index de base de données | Index de recherche |
|---|---|---|
| Question posée | Quelle ligne a cette valeur ou cette plage ? | Quels documents contiennent ces mots, et lesquels sont les plus pertinents ? |
| Structure | Arbre ordonné sur une colonne | Dictionnaire et listes de publication par terme |
| Mise à jour | Dans la transaction d'écriture | Après coup, par une chaîne d'indexation |
| Résultat | Exact | Approché, classé |
| Source de vérité | Oui, avec la table | Non |

#### Quand ne pas l'utiliser

- **Retrouver par identifiant** : la clé primaire suffit.
- **Vérifier une unicité** : seule la base garantit l'unicité (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
- **Compter exactement** : les comptes d'un index en retard sont approximatifs.
- **Petite table** : un balayage de quelques milliers de lignes est plus simple et assez rapide.
- **Écriture transactionnelle** : l'index ne participe pas à la transaction.

#### Modes de défaillance

- **Index obsolète** : les données récentes sont absentes, sans que l'interface le dise.
- **Index orphelin** : des documents supprimés restent trouvables.
- **Mappage inadapté** : un champ exact analysé comme texte, ou l'inverse.
- **Fuite** : un champ protégé est indexé sans les droits correspondants.
- **Explosion de taille** : des champs inutiles, des textes très longs, des historiques complets.

**Contre-exemple.** Une plateforme vérifie qu'une immatriculation n'existe pas déjà en l'interrogeant dans l'index de recherche. Entre deux indexations, deux requêtes simultanées passent le contrôle et créent chacune un aéronef : l'unicité aurait dû être imposée par une contrainte de la base.

**Limites.** Un index inversé répond bien aux questions de présence de mots et de classement. Il répond mal aux jointures, aux transactions et aux exigences d'exactitude. Il consomme de l'espace et du temps d'écriture, et il demande un dispositif de mise à jour et de reconstruction.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | L'expérience de recherche côté utilisateur s'appuie sur cet index |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | L'index est cohérent à terme et n'est pas une source de vérité |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | L'index est un modèle de lecture dérivé, alimenté par les changements |
| [2.14 Index](02-donnees-ressources.md#214-index) | L'index de base de données répond à d'autres questions |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'index de recherche est une couche à isoler par tenant |
| [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation) | L'analyse produit les termes qui entrent dans l'index |
| [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes) | Les fréquences et les positions servent le classement |
| [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex) | La chaîne d'indexation alimente et reconstruit l'index |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits s'appliquent aussi sur le chemin de recherche |

### 5. Application pratique

**Situation initiale.** Alpha Air compte 800 000 constats. La recherche libre de la liste des constats utilise une condition `ILIKE` sur la description : elle prend plusieurs secondes aux heures de pointe et ralentit les tablettes des techniciens.

**Problème.** Un balayage du texte à chaque requête, sur la base transactionnelle.

**Application du concept.** La plateforme construit un index inversé des constats, alimenté par les changements.

**Déroulé.**

1. L'équipe définit le document de recherche : titre, description, statut, gravité, base, aéronef, dates.
2. Elle déclare le mappage : texte analysé en français pour le titre et la description, mot-clé pour le statut, la gravité et la base.
3. Un indexeur lit les changements et alimente l'index ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).
4. La requête « fissure train » est transformée en intersection de deux listes.
5. La liste des constats lit l'index pour les identifiants, puis charge les lignes en base pour l'affichage et les droits ([19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)).

**Résultat.** Le temps de réponse passe de plusieurs secondes à quelques dizaines de millisecondes (ordre de grandeur d'exemple), et la base transactionnelle n'est plus sollicitée par la recherche libre.

**Limites.** Un constat créé à l'instant n'est visible qu'après la prochaine mise à jour de l'index : l'interface doit le gérer (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) et [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'associe un index inversé, et en quoi cela rend-il la recherche rapide ?
2. **Compréhension.** Quelle différence y a-t-il entre un index de base de données et un index de recherche ?
3. **Compréhension.** Pourquoi l'index de recherche n'est-il pas une source de vérité ?
4. **Pourquoi.** Pourquoi les listes de publication sont-elles triées par identifiant de document ?
5. **Raisonnement pratique.** Avec les trois constats de l'exemple, quel est le résultat de la requête « train et hydraulique », et quelles listes l'ont produit ?

#### Réponses

1. Il associe chaque terme à la liste des documents qui le contiennent. La recherche lit quelques listes au lieu de parcourir tous les documents : le coût dépend du nombre de documents qui contiennent les termes, pas du volume total.
2. L'index de base de données retrouve les lignes dont une colonne a une valeur ou une plage, avec un résultat exact, dans la transaction. L'index de recherche retrouve les documents contenant des mots, avec un résultat classé et approché, mis à jour après coup.
3. Parce qu'il est une copie dérivée, en retard sur la base, transformée par l'analyse. Une décision qui exige l'exactitude, comme l'unicité, se prend dans la base.
4. Parce que l'intersection de deux listes triées se fait en un seul passage, en avançant dans les deux listes. Sans tri, il faudrait comparer chaque élément à tous les autres.
5. *train* → 201, 202 ; *hydraulique* → 202. L'intersection est [202] : le constat « Fuite hydraulique près du train ».

## 19.2 Analyse de texte et segmentation

### 1. Comprendre simplement

L'**analyse de texte** (*text analysis*) transforme un texte libre en termes que l'on peut indexer et comparer. La **segmentation en jetons** (*tokenization*) en est la première étape : elle découpe le texte en unités appelées jetons, en général des mots. L'ensemble forme la fonction *text analysis and tokenization* : découper, puis normaliser (mettre en minuscules, retirer les accents, ramener à la racine, remplacer les synonymes).

**Pourquoi cela existe.** Un utilisateur écrit « Trains d'atterrissage », « train d'atterrissage » ou « TRAIN D’ATTERRISSAGE ». Sans traitement, un ordinateur voit trois chaînes différentes. L'analyse fait de ces variantes les mêmes termes, pour que la recherche trouve ce que la personne veut dire, pas seulement ce qu'elle a tapé.

**Problème résolu.** Faire correspondre le texte des documents et le texte des requêtes malgré les différences de forme : casse, accents, pluriel, ponctuation, langue.

**Modèle mental.** Un bureau de tri postal. Chaque courrier est ouvert, découpé en mots, ramené à une forme standard, puis rangé dans la bonne case. La requête passe par le même tri, donc elle arrive dans les mêmes cases.

**Où l'analogie s'arrête.** Un tri postal ne se trompe pas de langue et n'a pas de cas particuliers. L'analyse de texte dépend de la langue, de choix imparfaits (une racine peut rapprocher des mots qui n'ont rien à voir), et elle ne comprend pas le sens.

**Exemple.** Le titre « L'inspection des trains d'atterrissage » passe par l'analyse : retrait de l'apostrophe, mise en minuscules, retrait des mots vides, ramener le pluriel au singulier. Les termes indexés sont *inspection*, *train*, *atterrissage*. La requête « Train d’atterrissage inspection » est analysée de la même façon, et trouve le document.

**Les composants.**

1. les **filtres de caractères**, qui nettoient le texte brut (retrait du balisage, normalisation) ;
2. le **segmenteur** (*tokenizer*), qui découpe en jetons ;
3. les **filtres de jetons** : minuscules, retrait des accents, mots vides, racines, synonymes ;
4. la **langue**, qui choisit les règles ;
5. les **analyseurs configurables** par champ et par tenant ;
6. l'**outil de diagnostic** qui montre les termes produits.

**Objectif d'apprentissage :** vous pouvez décrire la chaîne d'analyse, expliquer pourquoi la même analyse s'applique au texte et à la requête, et prévoir les cas où elle se trompe (identifiants, langues, racines).

### 2. Connaissances essentielles

#### Définition

- **Analyse de texte** : suite de transformations qui convertit un texte libre en une liste de termes normalisés, destinée à l'indexation et à la recherche.
- **Segmentation en jetons** : découpage d'un texte en unités, les jetons, en suivant des règles de limites de mots.

#### Idées fondamentales

1. **Le texte et la requête passent par la même analyse.** Sinon les termes ne se rencontrent pas.
2. **L'analyse dépend de la langue.** Les règles d'élision, de pluriel et de mots vides ne sont pas universelles.
3. **Segmenter n'est pas couper sur les espaces.** Les règles de limites de mots suivent des normes, et certaines langues n'ont pas d'espaces.
4. **Normaliser rapproche, au risque de trop rapprocher.** Les racines et les synonymes élargissent les résultats et créent des faux positifs.
5. **Un identifiant n'est pas du texte.** Il se traite comme une valeur exacte, ou avec une analyse dédiée.
6. **Changer l'analyse change l'index.** Une modification impose une reconstruction (voir [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).

#### Vocabulaire essentiel

- **Jeton** (*token*) : unité produite par la segmentation.
- **Normalisation** (*normalization*) : mise sous forme standard : minuscules, accents, racine.
- **Racine** (*stemming*) : ramener un mot à une forme de base par des règles de coupe.
- **Lemmatisation** (*lemmatization*) : ramener un mot à sa forme de dictionnaire.
- **Mot vide** (*stop word*) : mot très fréquent, souvent retiré de l'index.
- **Synonyme** (*synonym*) : mot ou expression traité comme équivalent d'un autre.
- **Élision** (*elision*) : retrait d'un article contracté, comme « l' » ou « d' » en français.
- **Analyseur** (*analyzer*) : enchaînement de filtres de caractères, de segmenteur et de filtres de jetons.

#### Relations de cause à effet

- Le texte est analysé en français et la requête en anglais : les termes ne correspondent pas, la recherche ne trouve rien.
- L'analyse découpe « F-ABCD » en *f* et *abcd* : une requête sur *f* renvoie tous les aéronefs de la flotte.
- La racine rapproche *général* et *généraux* : c'est utile ; elle rapproche aussi des mots sans lien : le résultat est du bruit.
- Les synonymes d'un tenant sont ajoutés à l'index sans reconstruction : les anciens documents ne les connaissent pas.
- Le texte est dans une langue sans espaces : le découpage par espaces produit un seul jeton géant.

#### Idées reçues

- **« Découper, c'est séparer sur les espaces. »** Non. Les règles de limites de mots de la norme de segmentation Unicode sont plus fines, et pour des langues comme le thaï, le lao, le chinois ou le japonais, elles exigent un dictionnaire ou d'autres mécanismes.
- **« Retirer les accents est toujours bon. »** Non. Cela rapproche *résolu* et *resolu*, mais confond parfois des mots distincts ; la décision dépend de la langue et du public.
- **« Les mots vides n'ont aucune importance. »** Non. Retirés, ils empêchent de chercher une expression exacte qui les contient (« to be or not to be »). Beaucoup de moteurs les conservent et laissent le classement les pondérer.

#### Principe clé

Le même enchaînement de découpage et de normalisation s'applique au texte indexé et à la requête, et se choisit selon la langue et la nature du champ.

#### Si vous ne retenez que trois choses

1. L'analyse transforme le texte et la requête en termes comparables, avec la même chaîne.
2. Elle dépend de la langue et du type de champ : un identifiant ne s'analyse pas comme un texte.
3. Tout changement d'analyse oblige à reconstruire l'index.

### 3. Explication technique détaillée

#### La chaîne d'analyse

```text
texte brut ─► filtres de caractères ─► segmenteur ─► filtres de jetons ─► termes indexés
               (balisage, apostrophes)   (limites de mots)  (minuscules, accents, mots vides, racines, synonymes)
```

La documentation d'un moteur courant résume le principe : l'analyse transforme un texte libre en une forme structurée adaptée à la recherche, la segmentation découpe en jetons, la normalisation les standardise (minuscules, racines, synonymes), et le même traitement est conseillé pour les chaînes de requête afin que les termes correspondent.

| Étape | Rôle | Exemple |
|---|---|---|
| Nettoyage | Retirer le balisage, unifier les apostrophes | `d’atterrissage` devient `d'atterrissage` |
| Segmentation | Découper en jetons | `train`, `d`, `atterrissage` |
| Minuscules | Unifier la casse | `Fissure` devient `fissure` |
| Retrait des accents | Rapprocher les variantes | `résolu` devient `resolu` |
| Mots vides | Retirer les mots très fréquents | `le`, `des`, `sur` |
| Racine | Ramener au singulier ou à la racine | `trains` devient `train` |
| Synonymes | Étendre à des termes équivalents | `APU` ↔ `groupe auxiliaire de puissance` |

#### Segmentation et normes de limites de mots

La norme Unicode n° 29 (Unicode Text Segmentation) définit des règles par défaut pour les limites de graphèmes, de mots et de phrases. Elle précise que ces règles sont une base que les implémentations peuvent et devraient adapter par langue : pour le thaï, le lao, le chinois ou le japonais, la segmentation en mots demande un dictionnaire ou d'autres mécanismes. Les moteurs d'usage courant s'en inspirent pour leur segmenteur standard.

Conséquence pratique : le comportement d'un segmenteur sur les traits d'union, les apostrophes, les chiffres et les identifiants varie. On le **vérifie avec l'outil d'analyse du moteur**, qui affiche les termes produits, avant de s'y fier.

#### Un analyseur minimal

Le code ci-dessous illustre une chaîne française simplifiée.

```typescript
const STOP_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "sur", "sous", "et", "ou", "a", "au", "aux", "d", "l",
]);

function foldAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{M}+/gu, "");
}

function lightStem(token: string): string {
  if (token.length > 4 && token.endsWith("aux")) return token.slice(0, -3) + "al";
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function analyze(text: string): string[] {
  const lowered = foldAccents(text.toLowerCase().replace(/[’']/g, " "));
  return lowered
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t))
    .map(lightStem);
}
```

Ce code produit, à l'exécution :

| Texte | Termes |
|---|---|
| `L'inspection des trains d'atterrissage` | `inspection`, `train`, `atterrissage` |
| `Inspections du train d’atterrissage : résolu` | `inspection`, `train`, `atterrissage`, `resolu` |
| `Défauts généraux` | `defaut`, `general` |

C'est un exemple pédagogique : la coupe d'un `s` final rate des mots comme *bras* ou *corps*, et une vraie chaîne s'appuie sur des analyseurs de langue éprouvés.

#### Racine ou lemmatisation

| Technique | Principe | Atout | Limite |
|---|---|---|---|
| Racine | Règles de coupe de suffixes | Rapide, sans dictionnaire | Sur-coupe ou sous-coupe : des mots sans lien se rapprochent |
| Lemmatisation | Dictionnaire et analyse grammaticale | Plus précise | Plus lente, dépend de la langue et du dictionnaire |

#### Identifiants et valeurs structurées

Un numéro de pièce `A320-214` ou une immatriculation `F-ABCD` ne se découpe pas comme un texte. Trois approches se combinent :

- le déclarer en **champ mot-clé** (valeur exacte) pour le filtre et la recherche exacte ;
- en plus, l'indexer comme **texte** avec une analyse qui coupe aux séparateurs, pour les recherches partielles ;
- n'appliquer aucune tolérance aux fautes sur ce champ (voir [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle)) : deux immatriculations qui diffèrent d'une lettre désignent deux aéronefs.

#### Langues et tenants

- **Une langue par champ**, ou un champ par langue (`title_fr`, `title_en`), ou un champ multilingue avec détection de la langue à l'indexation.
- **Contenus mixtes** : un texte français contient des termes anglais ; l'analyse de la langue dominante ne doit pas les détruire.
- **Dictionnaires par tenant** : synonymes, mots protégés, abréviations sont une configuration du tenant (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)), versionnée, avec reconstruction de l'index quand elle change ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).
- **Requête et document** : certaines transformations, comme les synonymes, se placent de préférence du côté de la requête, ce qui évite de reconstruire l'index à chaque changement de dictionnaire.

```json
{
  "analysis": {
    "default_language": "fr",
    "fields": {
      "title": { "language": "fr", "stop_words": true, "stemming": "light" },
      "aircraft": { "kind": "keyword", "case_insensitive": true }
    },
    "synonyms": [
      { "terms": ["APU", "groupe auxiliaire de puissance"], "apply_at": "query" },
      { "terms": ["train", "atterrisseur"], "apply_at": "query" }
    ],
    "protected_terms": ["A320", "F-ABCD"]
  }
}
```

#### Modes de défaillance

- **Langue erronée** : les termes ne correspondent pas.
- **Identifiant découpé** : bruit massif ou résultats manquants.
- **Racines agressives** : faux positifs.
- **Synonymes mal posés** : changement non pris en compte, ou explosion des requêtes.
- **Analyse différente entre indexation et requête.**
- **Accents retirés d'un côté seulement.**

**Contre-exemple.** Une plateforme indexe les immatriculations avec l'analyseur de texte standard. « F-ABCD » devient *f* et *abcd*. Une personne qui cherche « F-ABCD » obtient aussi les 40 aéronefs dont l'immatriculation commence par *F*. Il fallait un champ mot-clé et une recherche exacte.

**Limites.** L'analyse n'est pas la compréhension : elle ne distingue pas « avions » (le nom) de « avions » (le verbe). Les racines et les synonymes sont des heuristiques. Le choix des filtres dépend du public et de la langue, et se valide avec des requêtes réelles (voir [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé) | L'analyse produit les termes du dictionnaire et des listes |
| [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes) | Les termes analysés déterminent les fréquences utilisées par le classement |
| [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex) | Un changement d'analyse déclenche une réindexation |
| [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle) | La tolérance aux fautes et l'autocomplétion s'appuient sur les termes analysés |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Le texte extrait des fichiers passe par la même analyse |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | Les dictionnaires et paramètres d'analyse se configurent par tenant |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | L'expérience de recherche dépend de ces choix |

### 5. Application pratique

**Situation initiale.** Les techniciens d'Alpha Air tapent « train d'atterrissage », « atterrisseur » ou « TdA » pour désigner la même chose. Les résultats varient d'une personne à l'autre, et une recherche d'immatriculation renvoie des dizaines d'aéronefs.

**Problème.** Une analyse unique et naïve, appliquée à tous les champs.

**Application du concept.** La plateforme règle l'analyse par champ, ajoute des dictionnaires par tenant et sépare les identifiants.

**Déroulé.**

1. Le titre et la description utilisent l'analyse française : élision, minuscules, accents, mots vides, racine légère.
2. L'immatriculation est un champ mot-clé, insensible à la casse, sans tolérance aux fautes.
3. Le responsable qualité ajoute au dictionnaire du tenant les équivalences « train d'atterrissage », « atterrisseur », « TdA », appliquées côté requête.
4. L'outil d'analyse affiche les termes produits pour une requête type, et l'équipe vérifie quelques cas.
5. La mise à jour du dictionnaire est versionnée et prend effet sans reconstruire l'index.

**Résultat.** Les trois formulations renvoient les mêmes constats, et une immatriculation renvoie un seul aéronef.

**Limites.** Un synonyme trop large (« train » ↔ « ensemble ») ajoute du bruit : chaque équivalence se revoit à l'usage.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fait la segmentation en jetons, et qu'est-ce que la normalisation ?
2. **Compréhension.** Pourquoi la requête doit-elle passer par la même analyse que les documents ?
3. **Compréhension.** Quelle différence y a-t-il entre une racine et une lemmatisation ?
4. **Pourquoi.** Pourquoi une immatriculation ne doit-elle pas être analysée comme un texte libre ?
5. **Raisonnement pratique.** Le tenant ajoute un synonyme appliqué à l'indexation. Que se passe-t-il pour les documents déjà indexés, et comment l'éviter ?

#### Réponses

1. La segmentation découpe le texte en jetons, en général des mots. La normalisation standardise les jetons : minuscules, accents, racines, synonymes. Ensemble, elles produisent les termes de l'index.
2. Parce que les termes de la requête doivent coïncider avec ceux de l'index. Si le texte est mis en minuscules sans accents et la requête non, « Résolu » ne trouve pas « resolu ».
3. La racine coupe des suffixes par règles, vite, mais elle rapproche parfois des mots sans lien. La lemmatisation s'appuie sur un dictionnaire et la grammaire, plus précise et plus lente.
4. Parce que le découpage au trait d'union la scinde en fragments qui correspondent à d'autres aéronefs. Un identifiant se recherche par valeur exacte, sans racine ni tolérance aux fautes.
5. Les documents déjà indexés ne contiennent pas le synonyme : ils ne sont trouvés que par leurs termes d'origine, jusqu'à la réindexation. On l'évite en appliquant les synonymes du côté de la requête, ce qui prend effet sans reconstruire l'index.

## 19.3 Pertinence, classement et facettes

### 1. Comprendre simplement

La **pertinence** (*relevance*) mesure à quel point un résultat répond à ce que la personne cherche. Le **classement** (*ranking*) ordonne les résultats par un score qui estime cette pertinence. Les **facettes** (*facets*) sont des regroupements par critère, avec des décomptes (« Base : LYS 12, TLS 30 »), qui permettent d'affiner les résultats. L'ensemble forme la fonction *relevance and ranking* et *facets*.

**Pourquoi cela existe.** Une recherche qui renvoie 3 000 résultats sans ordre est inutilisable. La personne ne lit que les premiers : ils doivent être les meilleurs. Quand elle ne sait pas quoi taper, les facettes lui montrent les dimensions du résultat, et lui permettent de les restreindre.

**Problème résolu.** Mettre en tête ce qui a le plus de chances d'être utile, et donner des moyens d'affiner sans réécrire la requête.

**Modèle mental.** Un libraire qui range les livres demandés du plus adapté au moins adapté, et qui montre aussi les rayons où se trouvent les autres : « Romans (12), Essais (30) ».

**Où l'analogie s'arrête.** Le libraire sait ce que vous voulez. Un moteur estime la pertinence par des statistiques sur les mots, pas par le sens : il se trompe, et on le règle avec des jeux d'essai.

**Exemple.** La requête « fissure train » renvoie 140 constats. Le score place en tête ceux où « fissure » apparaît dans le titre et plusieurs fois dans la description, avant ceux où « train » apparaît en passant. À gauche, les facettes montrent Statut (ouvert 90, clos 50), Gravité (critique 12, majeure 60, mineure 68) et Base (LYS 70, TLS 70). Un clic sur « critique » restreint à 12 résultats.

**Les composants.**

1. le **score de pertinence**, calculé par document et par requête ;
2. les **poids par champ** (le titre compte plus que le commentaire) ;
3. les **signaux métier** : statut, récence, épinglage ;
4. l'**ordre de départage** stable, pour la pagination ;
5. les **facettes** : agrégations sur des champs mot-clé ;
6. les **filtres** de raffinement et le décompte conditionnel ;
7. le **jeu d'essai** et les mesures de qualité.

**Objectif d'apprentissage :** vous pouvez expliquer ce que mesure un score de type BM25, décrire comment on combine texte et signaux métier, et dire pourquoi les facettes doivent respecter les droits.

### 2. Connaissances essentielles

#### Définition

- **Pertinence et classement** : estimation de l'adéquation entre un document et une requête, exprimée par un score qui ordonne les résultats.
- **Facettes** : regroupement des résultats par valeur d'un champ, avec le nombre de résultats par valeur, pour filtrer par plusieurs axes.

#### Idées fondamentales

1. **Un score est une estimation.** Il combine des statistiques sur les mots, pas le sens.
2. **Un mot rare compte plus qu'un mot fréquent.** C'est l'idée de la fréquence inverse de document.
3. **Les répétitions saturent.** Dix occurrences ne valent pas dix fois une occurrence.
4. **La longueur compte.** Un mot dans un titre court pèse plus que dans un long texte.
5. **Le métier pondère la statistique.** Statut, récence et épinglage modifient le score.
6. **Les facettes comptent sur le résultat visible.** Elles respectent le filtrage par les droits.
7. **La qualité se mesure.** Par des jeux d'essai et des mesures, pas par intuition.

#### Vocabulaire essentiel

- **Score** (*score*) : nombre qui estime la pertinence d'un document pour une requête.
- **BM25** : fonction de score classique en recherche d'information, fondée sur la fréquence du terme, sa rareté et la longueur du document.
- **Fréquence inverse de document** (*inverse document frequency*, IDF) : poids d'un terme, d'autant plus grand que le terme est rare.
- **Pondération de champ ou boost** (*field boost*) : coefficient qui augmente l'importance d'un champ.
- **Facette** (*facet*) : regroupement par valeur d'un champ, avec décompte.
- **Précision à k** (*precision at k*) : part de résultats pertinents parmi les k premiers.
- **Jeu de jugements** (*judgment set*) : requêtes avec des résultats jugés pertinents ou non.

#### Relations de cause à effet

- Le score ne dépend que de la fréquence des mots : un texte qui répète « fissure » vingt fois passe devant un constat plus complet.
- Aucune pondération de champ : un commentaire anodin pèse autant que le titre.
- La récence n'est pas prise en compte : des constats clos depuis des années dominent les résultats actuels.
- Les facettes sont calculées avant le filtrage par les droits : les décomptes révèlent des résultats cachés.
- Le tri ne départage pas les égalités : la pagination affiche des doublons ou en oublie.

#### Idées reçues

- **« Le moteur trouve le bon résultat tout seul. »** Non. Les réglages (champs, poids, signaux) se testent sur des requêtes réelles.
- **« Plus de résultats, c'est mieux. »** Non. La précision des premiers résultats compte plus que le nombre total.
- **« Les facettes sont de simples filtres. »** Non. Ce sont des calculs d'agrégation sur le résultat, avec leur coût et leurs règles de confidentialité.

#### Principe clé

Le classement combine une estimation statistique de la pertinence du texte et des signaux métier explicites, et se mesure sur des cas réels ; les facettes agrègent seulement ce que la personne a le droit de voir.

#### Si vous ne retenez que trois choses

1. Un score estime la pertinence à partir de la rareté des termes, de leur fréquence saturée et de la longueur du document.
2. Les signaux métier (champ, statut, récence) s'ajoutent à la statistique, et se règlent par des jeux d'essai.
3. Les décomptes de facettes respectent les droits et se calculent sur les résultats visibles.

### 3. Explication technique détaillée

#### Le score de type BM25

BM25 est une fonction de score classique de la recherche d'information. Pour une requête $Q$ et un document $D$, la forme usuelle est :

$$\text{score}(D, Q) = \sum_{t \in Q} \text{IDF}(t) \cdot \frac{f(t, D)\,(k_1 + 1)}{f(t, D) + k_1\left(1 - b + b\,\frac{|D|}{\text{avgdl}}\right)}$$

Ici, $f(t, D)$ est le nombre d'occurrences du terme $t$ dans $D$, $|D|$ la longueur de $D$ en termes, $\text{avgdl}$ la longueur moyenne des documents, $k_1$ le paramètre de saturation de la fréquence du terme, $b$ le paramètre de normalisation par la longueur, et $\text{IDF}(t)$ le poids de rareté du terme. Une variante courante de l'IDF est :

$$\text{IDF}(t) = \ln\left(1 + \frac{N - n(t) + 0{,}5}{n(t) + 0{,}5}\right)$$

où $N$ est le nombre de documents et $n(t)$ le nombre de documents qui contiennent $t$. La documentation de l'implémentation Lucene indique les valeurs par défaut $k_1 = 1{,}2$ et $b = 0{,}75$, et précise que $k_1$ règle la saturation de la fréquence du terme et $b$ l'effet de la longueur du document. Les formes exactes varient d'un moteur à l'autre.

**Exemple numérique.** Avec $N = 1\,000$ documents, $k_1 = 1{,}2$, $b = 0{,}75$ et un document de longueur moyenne :

| Terme | $n(t)$ | IDF | $f$ | Facteur de fréquence | Score |
|---|---|---|---|---|---|
| *fissure* (rare) | 10 | 4,56 | 3 | 1,57 | 7,16 |
| *train* (fréquent) | 500 | 0,69 | 3 | 1,57 | 1,09 |

Le terme rare pèse environ 6,5 fois plus que le terme fréquent à fréquence égale. Pour le terme *fissure*, le facteur de fréquence **sature** :

| Occurrences $f$ | 1 | 3 | 10 | 100 |
|---|---|---|---|---|
| Facteur de fréquence | 1,00 | 1,57 | 1,96 | 2,17 |

Il tend vers $k_1 + 1 = 2{,}2$ : répéter un mot cent fois n'en double pas l'effet. Pour 3 occurrences, un document deux fois plus long que la moyenne obtient un facteur de 1,29 au lieu de 1,57, et un document deux fois plus court 1,76 : la longueur modifie le score.

#### Pondérer les champs et les signaux

Le score de texte ne suffit pas. Une configuration de classement combine :

- des **poids par champ** : le titre compte trois fois la description ;
- des **signaux métier** : un constat ouvert passe avant un constat clos ;
- une **décroissance par récence** : un constat récent pèse plus ;
- des **résultats épinglés** par le tenant, pour des requêtes critiques.

```json
{
  "ranking": {
    "fields": { "title": 3.0, "description": 1.0, "comments": 0.5 },
    "boosts": [
      { "when": { "status": "open" }, "factor": 1.5 },
      { "decay": { "field": "updated_at", "scale_days": 30, "min": 0.5 } }
    ],
    "pinned": []
  },
  "tie_breaker": ["score desc", "updated_at desc", "id asc"]
}
```

L'**ordre de départage** (`tie_breaker`) rend le tri total : sans lui, deux documents de même score peuvent échanger leur position d'une requête à l'autre, et la pagination par curseur (voir [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)) affiche des doublons ou en omet.

**Expliquer.** Un utilisateur demande « pourquoi ce résultat est-il en premier ? ». La plateforme expose, pour le diagnostic, la contribution de chaque champ et de chaque signal (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)). Un classement inexplicable est un classement qu'on ne sait pas corriger.

#### Les facettes

Une facette est une **agrégation** sur un champ mot-clé : pour chaque valeur, le nombre de documents du résultat qui la portent. Le champ doit être de type exact, pas un texte analysé (voir [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé)).

```json
{
  "query": "fissure train",
  "filters": { "status": ["open"] },
  "facets": ["severity", "base", "status"],
  "result": {
    "total": 90,
    "facets": {
      "severity": { "critical": 8, "major": 41, "minor": 41 },
      "base": { "LYS": 45, "TLS": 45 },
      "status": { "open": 90 }
    }
  }
}
```

| Question | Choix courant |
|---|---|
| Facette à choix multiple | Le décompte d'une facette ignore son propre filtre, pour montrer les valeurs voisines |
| Cardinalité élevée | On limite aux N valeurs les plus fréquentes, avec décomptes approchés |
| Droits | Les décomptes portent seulement sur les documents que la personne peut voir (voir [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)) |
| Petits effectifs | On masque ou on regroupe en deçà d'un seuil, comme pour les tableaux de bord (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)) |
| Coût | Une agrégation lit plus de données qu'une simple liste : on plafonne le nombre de facettes |

#### Mesurer la qualité

| Mesure | Définition | Usage |
|---|---|---|
| Précision à $k$ | Part des $k$ premiers résultats jugés pertinents | Qualité du haut de liste |
| Rappel | Part des résultats pertinents effectivement renvoyés | Couverture |
| Taux de requêtes sans résultat | Part des requêtes qui renvoient zéro résultat | Lacunes de vocabulaire |
| Taux de clic sur les premiers résultats | Part des recherches où l'un des $k$ premiers est ouvert | Signal d'usage |

Exemple : parmi les 5 premiers résultats d'une requête, 3 sont jugés pertinents. La précision à 5 vaut $3 / 5 = 0{,}6$. Une série de requêtes types, avec leurs résultats attendus, forme un **jeu de jugements** que l'on rejoue à chaque changement de réglage, comme un test de non-régression. Les changements importants se déploient progressivement, avec comparaison (voir [29.5 Feuille de route, analytique produit et expérimentation](29-organisation-produit-economie.md#295-feuille-de-route-analytique-produit-et-expérimentation)).

#### Modes de défaillance

- **Sur-pondération d'un champ** : un champ de commentaires écrase le titre.
- **Absence de départage** : pagination instable.
- **Facettes sans droits** : fuite par les décomptes.
- **Facette sur un champ analysé** : valeurs découpées en mots.
- **Réglage à l'intuition** : un changement améliore une requête et en dégrade dix.
- **Signal métier non maîtrisé** : un épinglage oublié reste en tête des mois.

**Contre-exemple.** La plateforme ajoute un facteur 5 à « statut = ouvert » pour faire ressortir le travail en cours. Les résultats d'une requête précise sur un constat clos sont repoussés derrière des constats ouverts sans rapport. La personne ne retrouve plus ce qu'elle cherche. Il fallait un facteur modéré, et un jeu d'essai qui contient aussi des constats clos.

**Limites.** Un score statistique ne comprend pas la question. Les réglages optimaux dépendent des données et des usages de chaque tenant, d'où des réglages par défaut raisonnables, quelques paramètres exposés et une mesure. Un apprentissage automatique du classement existe mais demande des données d'usage abondantes, et il complique l'explication.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé) | Les fréquences et les statistiques de l'index alimentent le score |
| [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation) | L'analyse détermine les termes comptés |
| [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits) | Résultats et décomptes se calculent sur ce que la personne peut voir |
| [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle) | Les vecteurs et la tolérance aux fautes modifient la liste des candidats |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | Les facettes sont la face visible du filtrage dans l'interface |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | Expliquer pourquoi un résultat est classé ainsi |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | Un ordre de départage stable rend la pagination par curseur fiable |
| [29.5 Feuille de route, analytique produit et expérimentation](29-organisation-produit-economie.md#295-feuille-de-route-analytique-produit-et-expérimentation) | Le déploiement progressif et l'expérimentation valident un réglage |

### 5. Application pratique

**Situation initiale.** La recherche de constats d'Alpha Air renvoie les résultats dans l'ordre de création. Les planificateurs doivent parcourir plusieurs pages pour retrouver le constat dont ils parlent, et réclament des filtres.

**Problème.** Aucun classement par pertinence et aucune facette.

**Application du concept.** La plateforme introduit un score avec poids par champ et par statut, des facettes et un jeu d'essai.

**Déroulé.**

1. L'équipe définit les poids : titre 3, description 1, commentaires 0,5, avec un facteur modéré pour les constats ouverts et une décroissance sur 30 jours.
2. Elle rassemble 40 requêtes réelles avec leurs résultats attendus, jugés par les responsables qualité.
3. Elle mesure la précision à 5 avant et après : 0,52 puis 0,71 (valeurs d'exemple).
4. Elle ajoute les facettes statut, gravité et base, calculées après le filtrage par les droits.
5. Elle déploie le réglage progressivement, en comparant le taux de requêtes sans clic.

**Résultat.** Les constats cherchés remontent en tête, et les filtres réduisent les résultats sans retaper la requête.

**Limites.** Le réglage vaut pour le jeu d'essai et pour la langue de ce tenant : il se revoit quand les usages ou les données changent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que mesure la fréquence inverse de document, et pourquoi sert-elle au score ?
2. **Compréhension.** Pourquoi la fréquence d'un terme dans un document est-elle saturée ?
3. **Compréhension.** Qu'est-ce qu'une facette, et sur quel type de champ se calcule-t-elle ?
4. **Pourquoi.** Pourquoi faut-il un ordre de départage stable pour paginer ?
5. **Raisonnement pratique.** Sur 5 résultats, 2 sont pertinents ; après réglage, 4 le sont. Quelle est la précision à 5 avant et après, et que conclure d'un seul jeu de 5 résultats ?

#### Réponses

1. La rareté d'un terme dans la collection. Un mot présent dans peu de documents distingue mieux qu'un mot présent partout : il reçoit donc un poids plus fort.
2. Parce que répéter un mot n'augmente pas proportionnellement la pertinence. Le facteur de fréquence tend vers une limite ($k_1 + 1$), ce qui évite qu'un document qui répète un mot domine.
3. Une facette regroupe les résultats par valeur d'un champ, avec un décompte. Elle se calcule sur un champ de type exact (mot-clé), pas sur un champ texte analysé.
4. Parce que sans départage, des documents de même score peuvent changer d'ordre entre deux requêtes. La pagination par curseur affiche alors des doublons ou omet des éléments.
5. Avant : $2/5 = 0{,}4$ ; après : $4/5 = 0{,}8$. Un seul jeu de 5 résultats ne permet pas de conclure : il faut plusieurs requêtes représentatives, un jeu de jugements et une comparaison sur l'ensemble.

## 19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index

### 1. Comprendre simplement

La **chaîne d'indexation** (*indexing pipeline*) est l'ensemble des étapes qui transforment un changement de la base en une mise à jour de l'index de recherche. La **réindexation** (*reindexing*) reconstruit tout ou partie de l'index, par exemple après un changement d'analyse. La **fraîcheur de l'index** (*index freshness*) est le retard entre un changement dans la base et sa visibilité dans les résultats de recherche.

**Pourquoi cela existe.** L'index est une copie dérivée (voir [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé)). Il ne se tient pas à jour tout seul : une chaîne doit transporter chaque changement, dans le bon ordre, sans en perdre. Et comme l'analyse, le mappage ou un bogue peuvent rendre l'index inexact, il faut pouvoir le reconstruire sans interrompre la recherche.

**Problème résolu.** Garder un index fidèle à la base, avec un retard connu et borné, et pouvoir le refaire sans coupure.

**Modèle mental.** Un service de mise à jour d'un annuaire : chaque modification arrive sur un bureau, est vérifiée, puis recopiée dans l'annuaire imprimé. Un retard existe entre la modification et la page imprimée. De temps en temps, on réimprime tout l'annuaire, sans retirer l'ancien avant que le nouveau soit prêt.

**Où l'analogie s'arrête.** Un annuaire imprimé n'est consulté que par les lecteurs. Un index est aussi interrogé pendant sa mise à jour, par des milliers de requêtes, et il reçoit des changements dans le désordre ou en double.

**Exemple.** Karim passe le constat `fd_204` à « critique ». La transaction écrit la base et la boîte d'envoi. Un événement part vers le bus. L'indexeur relit l'état du constat, construit le document de recherche, et l'écrit dans l'index avec la révision 17. Deux secondes plus tard, le constat apparaît sous la facette « critique ». Le soir, l'équipe ajoute un dictionnaire de synonymes : l'index est reconstruit en arrière-plan, puis l'ancien est remplacé en une opération.

**Les composants.**

1. la **source de changements** : événements issus de la boîte d'envoi (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) et [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) ;
2. l'**indexeur** : consommateur qui relit l'état et construit le document ;
3. la **version du document** : la révision de l'entité, qui ignore les écritures périmées ;
4. le **traitement des échecs** : nouvelles tentatives, file de lettres mortes (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) ;
5. la **réindexation** : construction d'un nouvel index et bascule ;
6. la **mesure de fraîcheur** : retard de bout en bout ;
7. la **réconciliation** : détection des écarts entre base et index.

**Objectif d'apprentissage :** vous pouvez décrire la chaîne qui alimente un index, expliquer comment on le reconstruit sans coupure, et dire comment on mesure et on borne son retard.

### 2. Connaissances essentielles

#### Définition

- **Chaîne d'indexation** : suite d'étapes, de l'événement de changement à l'écriture dans l'index, qui maintient l'index fidèle à la base.
- **Réindexation** : reconstruction de l'index à partir de la base, totale ou partielle, par exemple après un changement d'analyse, de mappage ou à la suite d'un défaut.
- **Fraîcheur de l'index** : durée écoulée entre la validation d'un changement dans la base et sa visibilité dans la recherche.

#### Idées fondamentales

1. **La base fait autorité, l'index suit.** Toute reconstruction part de la base.
2. **Le changement déclenche, l'état fait foi.** L'indexeur relit l'état courant plutôt que de croire le contenu de l'événement.
3. **La version protège de l'ordre.** Une écriture plus ancienne n'écrase pas une plus récente.
4. **Tout est rejouable.** Indexer deux fois le même changement donne le même résultat.
5. **On reconstruit à côté.** Un nouvel index se construit sans toucher à l'ancien, puis on bascule.
6. **La fraîcheur se mesure de bout en bout.** Elle se compose de plusieurs retards.
7. **L'écart se détecte.** Un contrôle compare régulièrement base et index.

#### Vocabulaire essentiel

- **Indexeur** (*indexer*) : composant qui construit les documents et les écrit dans l'index.
- **Version externe** (*external versioning*) : version fournie par la source, qui sert à refuser les écritures périmées.
- **Alias** (*alias*) : nom stable qui désigne l'index courant, et que l'on fait pointer vers un nouvel index.
- **Bascule** (*cutover*) : passage atomique de l'ancien index au nouveau.
- **Rattrapage** (*catch-up*) : application des changements survenus pendant la construction du nouvel index.
- **Stèle de suppression** (*tombstone*) : marque qui représente une suppression.
- **Retard d'indexation** (*indexing lag*) : durée entre le changement et sa visibilité.
- **Réconciliation** (*reconciliation*) : comparaison entre la source et sa copie pour détecter les écarts.

#### Relations de cause à effet

- L'indexeur applique l'événement tel qu'il arrive : un événement tardif écrase un état plus récent et l'index revient en arrière.
- Les suppressions ne sont pas propagées : des documents supprimés restent trouvables.
- On reconstruit l'index en place : la recherche est incomplète ou indisponible pendant la construction.
- Une rafale de modifications dépasse le débit de l'indexeur : le retard monte de quelques secondes à quelques minutes.
- Aucun contrôle de cohérence : des documents manquent sans que personne le voie.

#### Idées reçues

- **« L'index se met à jour dans la transaction. »** Non. Il est alimenté après coup, donc cohérent à terme (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
- **« Réindexer, c'est lent et risqué. »** Pas si l'on construit un nouvel index à côté et que l'on bascule par alias.
- **« Une fois indexé, c'est correct. »** Non. Une analyse changée, un bogue ou un événement perdu rendent l'index inexact : il faut des contrôles.

#### Principe clé

L'index suit la base par une chaîne rejouable et versionnée, se reconstruit à côté puis par bascule, et son retard se mesure et se borne.

#### Si vous ne retenez que trois choses

1. L'indexeur relit l'état et écrit avec une version, pour que l'ordre d'arrivée ne compte pas.
2. Une réindexation se fait dans un nouvel index, avec rattrapage, puis bascule atomique.
3. La fraîcheur est un objectif mesuré de bout en bout, et un contrôle de réconciliation détecte les écarts.

### 3. Explication technique détaillée

#### La chaîne

```text
Base ─► boîte d'envoi ─► bus d'événements ─► indexeur ─► index de recherche
  │                                              │
  └─ source de vérité                            └─► échec : nouvelle tentative, puis file de lettres mortes
```

1. **Changement validé.** La transaction écrit la ressource et l'événement dans la boîte d'envoi (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).
2. **Publication.** L'événement est publié sur le bus, au moins une fois (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)).
3. **Relecture.** L'indexeur relit l'état courant de la ressource avec ses droits et ses données liées.
4. **Construction.** Il construit le document de recherche : champs, droits, texte extrait des fichiers ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)), champs calculés.
5. **Écriture.** Il écrit dans l'index avec la révision de la ressource comme version.
6. **Échec.** Il réessaie ; après N échecs, le message part en file de lettres mortes pour examen (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

```typescript
interface ChangeEvent {
  tenantId: string;
  entityType: string;
  entityId: string;
  revision: number;
}

async function handleChange(e: ChangeEvent, deps: IndexerDeps): Promise<void> {
  const entity = await deps.db.load(e.tenantId, e.entityType, e.entityId);
  if (entity === null) {
    await deps.index.delete(e.tenantId, e.entityType, e.entityId, e.revision);
    return;
  }
  const doc = await deps.build(entity);
  await deps.index.upsert(doc, { version: entity.revision });
}

interface IndexerDeps {
  db: {
    load(tenantId: string, type: string, id: string): Promise<{ revision: number } | null>;
  };
  build(entity: { revision: number }): Promise<Record<string, unknown>>;
  index: {
    upsert(doc: Record<string, unknown>, opts: { version: number }): Promise<void>;
    delete(tenantId: string, type: string, id: string, version: number): Promise<void>;
  };
}
```

L'indexeur lit l'**état courant**, pas le contenu de l'événement : un événement en retard ne rétablit pas un état ancien. L'écriture avec une **version** (la révision de la ressource, voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) fait refuser par l'index toute écriture dont la version est inférieure à celle déjà indexée. La suppression porte aussi une version : sans elle, une écriture tardive ressusciterait un document supprimé.

#### Ce que l'indexeur doit gérer

| Sujet | Règle |
|---|---|
| Ordre | Version externe ; pas de dépendance à l'ordre d'arrivée |
| Doublons | Écriture idempotente : même version, même résultat |
| Suppressions | Événement de suppression, avec version ; stèle conservée le temps du rattrapage |
| Lots | Écriture groupée pour le débit, avec traitement partiel des échecs |
| Droits | Les changements de droits sont des changements à indexer (voir [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)) |
| Dérivés | Texte extrait des fichiers, noms liés : une modification d'une entité liée déclenche la réindexation des documents qui la citent |
| Voisin bruyant | Files équitables par tenant, pour qu'un import massif ne retarde pas les autres (voir [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |

#### Fraîcheur : un retard fait de plusieurs retards

| Étape | Durée typique (exemple) |
|---|---|
| Validation → publication par la boîte d'envoi | 100 ms |
| Attente en file | 200 ms |
| Relecture et construction du document | 100 ms |
| Écriture dans l'index | 100 ms |
| Rafraîchissement de l'index | jusqu'à 1 000 ms |
| **Total typique** | **environ 1,5 s** |

La documentation d'un moteur courant indique qu'une écriture y devient recherchable en environ une seconde, et que, par défaut, un index n'est rafraîchi chaque seconde que s'il a reçu au moins une requête de recherche dans les 30 dernières secondes : la fraîcheur dépend donc aussi de l'usage. Les valeurs ci-dessus sont des ordres de grandeur d'exemple.

On exprime la fraîcheur comme un objectif de niveau de service (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) : « 95 % des changements visibles en moins de 5 secondes, 99 % en moins de 30 secondes ». On la **mesure** de deux façons :

- avec un document **sonde** : une écriture périodique d'un document fictif, dont on mesure le délai jusqu'à sa visibilité ;
- avec le **retard par tenant** : la différence entre l'heure du dernier changement validé et l'heure du dernier changement indexé.

L'interface en tient compte : indication « résultats à jour il y a quelques secondes » (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)), et, juste après une création, une présentation qui ne dépend pas de l'index (lecture de la propre écriture, voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

#### Réindexer sans coupure

Quand l'analyse, le mappage ou le document de recherche changent, l'index existant devient inadapté. On le reconstruit à côté.

```text
1. créer l'index v2 avec le nouveau mappage                (l'alias « findings » pointe sur v1)
2. noter le point de départ du flux de changements
3. copier les documents de la base vers v2 (par lots, par tenant, à débit limité)
4. rattraper les changements survenus depuis le point de départ
5. contrôler : nombres de documents et échantillon par tenant
6. basculer l'alias « findings » vers v2, en une opération
7. conserver v1 un temps, pour revenir en arrière, puis le supprimer
```

Le temps de copie est $T = N / r$, où $N$ est le nombre de documents et $r$ le débit d'écriture. Pour 800 000 constats : à 2 000 documents par seconde, $T = 400$ s, soit un peu moins de 7 minutes ; à 500 documents par seconde, quand on limite le débit pour ne pas gêner la production, $T = 1\,600$ s, soit environ 27 minutes.

| Déclencheur | Portée |
|---|---|
| Changement d'analyse ou de mappage | Index entier |
| Nouveau champ dans le document de recherche | Index entier, ou champ mis à jour par lot |
| Bogue dans la construction | Les documents concernés |
| Migration d'un tenant (voir [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant)) | Les documents du tenant |
| Restauration après incident | Reconstruction depuis la base |

#### Réconciliation

Un contrôle périodique détecte les documents manquants, périmés ou orphelins. La plateforme garde, pour chaque entité indexée, la révision indexée.

```sql
CREATE TABLE search_index_state (
  tenant_id         uuid        NOT NULL,
  entity_type       text        NOT NULL,
  entity_id         uuid        NOT NULL,
  indexed_revision  bigint      NOT NULL,
  indexed_at        timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, entity_type, entity_id)
);

SELECT f.id
  FROM finding f
  LEFT JOIN search_index_state s
    ON s.tenant_id = f.tenant_id
   AND s.entity_type = 'finding'
   AND s.entity_id = f.id
 WHERE f.tenant_id = $1
   AND (s.indexed_revision IS NULL OR s.indexed_revision < f.revision);
```

La requête liste les constats que l'index ignore ou connaît dans une révision plus ancienne. Le contrôle inverse (documents indexés dont la ressource n'existe plus) détecte les orphelins. Le résultat se traduit en mises à jour ciblées et en une alerte si l'écart dépasse un seuil.

#### Modes de défaillance

- **Événement perdu** : le document reste périmé jusqu'au prochain changement.
- **Écriture hors d'ordre** : retour en arrière de l'index.
- **Suppression oubliée** : résultats fantômes.
- **Réindexation en place** : trous visibles dans la recherche.
- **Rattrapage incomplet** : les changements survenus pendant la copie sont perdus.
- **Indexeur saturé** : retard qui s'accumule, sans alerte.
- **Message empoisonné** : un document impossible à construire bloque la file.

**Contre-exemple.** Une équipe reconstruit l'index en place, un samedi, en vidant d'abord l'index puis en le remplissant. Pendant 40 minutes, la recherche renvoie des résultats partiels. Pire, les changements survenus pendant la copie ne sont pas rattrapés : des constats modifiés restent absents jusqu'à leur prochaine modification.

**Limites.** Une fraîcheur de quelques secondes se paie en complexité et en coût. Pour des exigences d'exactitude, l'interface lit la base. Une réindexation totale d'un très gros index peut demander des heures, d'où la réindexation par tenant ou par lot, et la discipline de ne changer le mappage qu'avec une procédure.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé) | L'index est la copie dérivée que la chaîne maintient |
| [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation) | Un changement d'analyse impose une réindexation |
| [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits) | Les changements de droits doivent aussi traverser la chaîne |
| [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action) | Les événements de changement déclenchent l'indexation |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Nouvelles tentatives, file de lettres mortes et idempotence |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La cohérence à terme explique le retard |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | La révision de l'entité sert de version externe |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | La fraîcheur est un objectif de niveau de service |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La suppression d'un fichier se propage à l'index |

### 5. Application pratique

**Situation initiale.** Alpha Air ajoute un dictionnaire de synonymes et un nouveau champ « base de rattachement » au document de recherche des constats. L'équipe redoute une coupure de la recherche pendant la reconstruction, et ne sait pas quel retard le planificateur subit en moyenne.

**Problème.** Aucune procédure de réindexation, aucune mesure de fraîcheur.

**Application du concept.** La plateforme met en place une version externe, une réindexation par alias et une mesure de retard.

**Déroulé.**

1. L'indexeur écrit désormais avec la révision de la ressource comme version, et propage les suppressions.
2. L'équipe crée l'index `findings_v2`, note le point de départ du flux, copie les 800 000 documents par tenant à 500 documents par seconde, puis rattrape les changements.
3. Elle contrôle les nombres par tenant et un échantillon, puis bascule l'alias.
4. Une sonde écrit un document fictif chaque minute et mesure son délai de visibilité : médiane 1,4 s, 95e percentile 3,8 s (valeurs d'exemple).
5. Un contrôle de réconciliation nocturne signale les écarts et les corrige.

**Résultat.** La recherche n'a pas été interrompue, le retard est connu, et les écarts sont détectés.

**Limites.** Pendant la copie, la charge d'écriture augmente : on planifie la réindexation en dehors des pointes et à débit limité.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi l'indexeur relit-il l'état de la ressource plutôt que d'utiliser le contenu de l'événement ?
2. **Compréhension.** À quoi sert la version externe d'un document de recherche ?
3. **Compréhension.** Comment réindexe-t-on sans interrompre la recherche ?
4. **Pourquoi.** Pourquoi faut-il propager les suppressions avec une version ?
5. **Raisonnement pratique.** Un index de 2 400 000 documents est reconstruit à 800 documents par seconde. Combien de temps la copie prend-elle, en minutes ?

#### Réponses

1. Parce qu'un événement peut arriver tard ou hors d'ordre : son contenu peut être périmé. L'état courant fait foi, et le document construit reflète toujours la dernière version connue.
2. À refuser les écritures périmées. Si une écriture de révision 15 arrive après la 17, l'index la rejette, ce qui rend le résultat indépendant de l'ordre d'arrivée.
3. On construit un nouvel index à côté, on rattrape les changements survenus pendant la copie, on contrôle, puis on bascule un alias en une opération. L'ancien index reste disponible pour un retour arrière.
4. Parce qu'une écriture tardive pourrait recréer un document déjà supprimé. La suppression versionnée (stèle) permet de refuser cette écriture.
5. $T = 2\,400\,000 / 800 = 3\,000$ secondes, soit 50 minutes.

## 19.5 Index par tenant et recherche sensible aux droits

### 1. Comprendre simplement

Un **index sensible au tenant** (*tenant-aware index*) est un index dont l'organisation et les requêtes garantissent que les données d'un tenant ne sont jamais renvoyées à un autre. Une **recherche sensible aux droits** (*permission-aware search*) est une recherche qui ne renvoie que les éléments que la personne a le droit de voir, y compris dans les compteurs, les suggestions et les extraits.

**Pourquoi cela existe.** La recherche est un chemin d'accès aux données, comme la liste ou le détail. Elle est souvent le dernier chemin protégé : on filtre la base, on oublie l'index. Une fuite par la recherche est discrète : un titre, un compteur ou une suggestion suffisent à révéler ce qu'une personne ne devrait pas savoir.

**Problème résolu.** Garantir que la recherche applique les mêmes frontières que le reste de la plateforme, sans dégrader sa vitesse.

**Modèle mental.** Un bibliothécaire qui répond aux demandes de plusieurs organisations. Il ne cherche que dans les rayons de l'organisation du demandeur (le tenant), et, dans ces rayons, il écarte les livres que la personne n'a pas le droit de consulter.

**Où l'analogie s'arrête.** Un bibliothécaire parcourt les rayons au moment de la demande et connaît les droits à cet instant. Un index est une copie : les droits qu'il porte peuvent être en retard, et les statistiques de classement peuvent mélanger des tenants si l'on n'y prend pas garde.

**Exemple.** Sophie, responsable qualité, cherche « fissure ». L'index est filtré par son tenant. Il est ensuite filtré par les bases dont elle a la charge, LYS et TLS. Parmi les résultats candidats, la plateforme vérifie auprès du service d'autorisation que Sophie peut voir chacun. Les décomptes des facettes reflètent seulement les résultats visibles.

**Les composants.**

1. l'**organisation de l'index** : un index par tenant, un index partagé, ou un mélange ;
2. le **filtre de tenant**, imposé par la plateforme et non par le code appelant ;
3. les **champs de droits** : base, classification, identifiants de groupes ;
4. la **vérification finale** auprès du service d'autorisation ;
5. le **traitement des compteurs, facettes, suggestions et extraits** ;
6. la **propagation des changements de droits** vers l'index ;
7. les **tests d'isolation** de la recherche.

**Objectif d'apprentissage :** vous pouvez comparer les organisations d'index, décrire les patrons de filtrage par les droits, et expliquer pourquoi compteurs et suggestions doivent suivre les mêmes règles que les résultats.

### 2. Connaissances essentielles

#### Définition

- **Index sensible au tenant** : organisation d'index et de requêtes telle que toute recherche est bornée par le tenant de l'appelant, par construction.
- **Recherche sensible aux droits** : recherche dont les résultats, les compteurs, les suggestions et les extraits sont limités aux éléments que l'appelant peut voir.

#### Idées fondamentales

1. **La recherche est un chemin d'accès comme les autres.** Elle porte les mêmes frontières (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) et [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
2. **Le filtre de tenant est imposé par la plateforme.** Un code qui construit lui-même la requête finit par l'oublier.
3. **Il existe plusieurs organisations d'index.** Elles échangent isolation, coût et simplicité.
4. **Filtrer à l'index est rapide ; vérifier à la source est exact.** On combine les deux pour les cas sensibles.
5. **Les droits dans l'index sont en retard.** La révocation doit être traitée comme un changement prioritaire.
6. **Tout ce qui sort de l'index révèle.** Résultats, nombres, facettes, suggestions, extraits.
7. **L'isolation se teste.** Des jeux de données de tenants distincts, des requêtes adverses.

#### Vocabulaire essentiel

- **Filtrage préalable** (*pre-filtering*) : application du filtre dans la requête à l'index.
- **Vérification finale** (*post-filtering*, *final check*) : contrôle des résultats candidats auprès du service d'autorisation.
- **Élagage de sécurité** (*security trimming*) : retrait des résultats que la personne ne peut pas voir.
- **Sur-récupération** (*over-fetch*) : lecture de plus de candidats que la page demandée, pour compenser ceux que la vérification retire.
- **Canal auxiliaire** (*side channel*) : information révélée indirectement, par un compteur ou un délai.
- **Alias filtré** (*filtered alias*) : nom d'index qui applique automatiquement un filtre.
- **Index par tenant, index partagé** (*per-tenant index*, *shared index*) : deux organisations de base.

#### Relations de cause à effet

- Le filtre de tenant est laissé au code appelant : un chemin oublié renvoie les données d'un autre tenant (voir le contre-exemple de [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
- Les suggestions lisent l'index sans filtre : l'autocomplétion révèle des immatriculations d'autres tenants.
- Les facettes se calculent avant le filtrage par les droits : un décompte « 12 » signale des résultats cachés.
- Un droit est retiré, l'index n'est pas mis à jour : la personne continue de voir des titres et des extraits.
- Un index partagé mélange les statistiques : le classement d'un tenant est influencé par les données d'un autre.

#### Idées reçues

- **« Si le détail vérifie les droits, la recherche est sûre. »** Non. Le titre, l'extrait et le décompte sont déjà une information.
- **« Un alias filtré est un contrôle d'accès. »** Non. La documentation d'un moteur courant précise que les filtres d'alias ne s'appliquent pas à la lecture par identifiant, et que l'on ne s'en sert pas seul comme contrôle d'accès.
- **« Un champ non retourné est protégé. »** Non. La documentation d'un service de recherche précise qu'un champ non récupérable n'est pas un mécanisme de masquage : la protection vient du filtre appliqué à chaque requête.

#### Principe clé

La recherche applique les frontières du tenant et des droits par construction, à l'index puis à la source, sur les résultats comme sur tout ce qui les décrit.

#### Si vous ne retenez que trois choses

1. Le tenant est un filtre imposé par la plateforme, ou une frontière d'index, jamais une option du code appelant.
2. Les droits se filtrent à l'index pour la vitesse et se vérifient à la source pour l'exactitude.
3. Compteurs, facettes, suggestions et extraits obéissent aux mêmes règles que les résultats.

### 3. Explication technique détaillée

#### Organiser l'index par tenant

| Organisation | Principe | Atouts | Limites |
|---|---|---|---|
| Un index par tenant | Chaque tenant a son propre index | Isolation forte, export, suppression et migration simples, paramètres d'analyse propres | Surcoût par index pour les petits tenants, nombre d'index à gérer |
| Index partagé avec filtre | Un index, un champ `tenant_id` obligatoire | Économique, peu d'objets à exploiter | Un oubli de filtre est une fuite ; statistiques mélangées ; voisin bruyant ; suppression d'un tenant plus lourde |
| Hybride | Index propres aux grands tenants, index partagé pour les petits | Compromis, adapté à la distribution des tailles (voir [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)) | Deux chemins à exploiter et à tester |

Les choix se lisent dans la politique d'isolation du tenant (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) et [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)). L'index suit le niveau d'isolation choisi pour les données : on n'indexe pas dans un index partagé les données d'un tenant à isolation forte.

**Imposer le tenant.** La plateforme fournit **un seul client de recherche**, qui reçoit le contexte de tenant (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)) et ajoute le filtre ou choisit l'index. Le code appelant n'a pas accès à un client brut. Des tests d'isolation, avec des données de plusieurs tenants et des requêtes adverses, vérifient chaque chemin (voir [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

**Alias filtrés.** Un alias qui applique un filtre de tenant est un confort, pas une frontière : les filtres d'alias ne s'appliquent pas à la lecture d'un document par identifiant, d'après la documentation d'un moteur courant. On ne les utilise pas seuls comme contrôle d'accès.

**Statistiques de classement.** Dans un index partagé, la fréquence de document d'un terme est calculée sur tous les tenants : le classement d'un tenant dépend des données des autres, et un terme rare chez un tenant peut paraître fréquent. C'est un argument pour un index par tenant, ou pour une normalisation par tenant.

#### Filtrer par les droits : trois patrons

| Patron | Principe | Atouts | Limites |
|---|---|---|---|
| Vérification après recherche | On cherche, puis on vérifie chaque résultat auprès du service d'autorisation | Exact, droits à jour | Lent ; la page peut se retrouver presque vide ; décomptes faux |
| Filtrage préalable par champs de droits | L'index porte les identifiants de groupes ou de rôles autorisés ; la requête les filtre | Rapide, décomptes justes | Droits en retard ; filtres volumineux ; règles non listables (attributs, relations) |
| Hybride | Filtre grossier à l'index (tenant, base, classification), puis vérification finale des meilleurs candidats | Équilibre vitesse et exactitude | Complexité ; sur-récupération |

Le patron de **filtrage préalable** est décrit dans la documentation d'un service de recherche : un champ de chaînes contient les identités de groupes ou d'utilisateurs autorisés, déclaré filtrable, et la requête filtre sur les groupes de l'appelant. Le même texte précise que l'identité n'y est qu'une chaîne utilisée dans un filtre, qu'il n'y a aucune authentification dans ce mécanisme, que l'application doit appliquer le filtre à chaque requête, et que cacher le champ n'est pas un masquage de contenu.

```json
{
  "search_security": {
    "mode": "hybrid",
    "index_acl_fields": ["tenant_id", "base", "classification", "principal_ids"],
    "final_check": { "enabled": true, "over_fetch_factor": 3, "max_candidates": 300 },
    "sensitive_fields_excluded_from_index": ["salary", "medical_notes"],
    "max_staleness_seconds_for_revocation": 30
  }
}
```

```typescript
interface Actor {
  tenantId: string;
  principalIds: string[];
}

interface SearchDeps {
  index: {
    search(q: {
      query: string;
      filters: Record<string, unknown>;
      limit: number;
    }): Promise<{ id: string }[]>;
  };
  authz: { filterVisible(actor: Actor, ids: string[]): Promise<Set<string>> };
}

async function searchVisible(
  query: string,
  actor: Actor,
  pageSize: number,
  deps: SearchDeps,
): Promise<string[]> {
  const candidates = await deps.index.search({
    query,
    filters: { tenant_id: actor.tenantId, principal_ids: actor.principalIds },
    limit: pageSize * 3,
  });
  const allowed = await deps.authz.filterVisible(
    actor,
    candidates.map((c) => c.id),
  );
  return candidates.map((c) => c.id).filter((id) => allowed.has(id)).slice(0, pageSize);
}
```

**Sur-récupération.** Si l'on estime que 40 % des candidats seront visibles, il faut lire $20 / 0{,}4 = 50$ candidats pour remplir une page de 20. Un facteur 3 couvre une proportion visible d'environ un tiers. Si la proportion réelle est plus basse, la page est incomplète : on le signale plutôt que de relâcher la vérification.

#### Tout ce qui sort de l'index

| Élément | Risque | Règle |
|---|---|---|
| Nombre total de résultats | Révèle l'existence de résultats cachés | Calculé après filtrage ; pas de « et N autres résultats masqués » |
| Facettes | Valeurs et décomptes d'éléments non visibles | Agrégation sur les résultats filtrés ; seuil de petits effectifs |
| Suggestions et autocomplétion | Termes d'autres tenants ou de contenus cachés | Même filtre de tenant et de droits que la recherche (voir [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle)) |
| Extraits et surlignage | Texte d'un champ non visible | Extraits tirés des champs que la personne peut lire |
| Champs sensibles | Recherche sur un champ interdit révèle sa valeur | Champs sensibles hors index, ou index séparé à droits propres |
| Délais de réponse | Une requête rapide ou lente signale des résultats cachés | Avec prudence : on ne s'appuie pas sur le délai pour la sécurité |

Un champ que la personne ne peut pas lire ne doit pas non plus être **cherchable** : sinon, une requête « salaire:75000 » confirme une valeur sans l'afficher (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

#### Propager les changements de droits

Un changement de droits est un changement comme un autre, mais son retard est un retard de sécurité.

| Situation | Traitement |
|---|---|
| Retrait d'un droit | Événement prioritaire ; vérification finale tant que l'index n'est pas à jour |
| Départ d'une personne | Suppression de ses identifiants dans les champs de droits ; retrait de ses accès à la requête |
| Changement de groupe | Réindexation des documents concernés (potentiellement nombreux) |
| Règle fondée sur un attribut ou une relation | Non listable : vérification finale, ou index de la relation |

Un changement d'appartenance à un groupe qui concerne des millions de documents est coûteux à répercuter. C'est une des raisons de préférer l'hybride : l'index porte des groupes stables, et la vérification finale porte les règles fines.

**Pas de confiance en l'index à l'ouverture.** L'ouverture d'un résultat recontrôle toujours le droit à la source. L'index, même en retard, ne donne jamais plus que ce que la vérification autorise.

#### Modes de défaillance

- **Filtre de tenant optionnel** : fuite inter-tenants.
- **Suggestion sans filtre** : fuite par autocomplétion.
- **Facettes avant filtrage** : fuite par les décomptes.
- **Droits en retard** : accès au titre d'un élément retiré.
- **Alias filtré pris pour un contrôle d'accès.**
- **Vérification finale absente pour les contenus sensibles.**
- **Page vide** : sur-récupération insuffisante.

**Contre-exemple.** Un index partagé filtre le tenant dans les résultats détaillés, mais l'autocomplétion lit directement le dictionnaire des termes. En tapant « F-A », un utilisateur voit les immatriculations d'aéronefs d'autres compagnies. Le filtre doit se trouver dans le client de recherche, pas dans le code de chaque fonction.

**Limites.** Aucun patron n'est parfait : le filtrage préalable est rapide mais en retard, la vérification finale est exacte mais coûteuse. Les règles très dynamiques (relations, attributs contextuels) ne se mettent pas à l'index. Et les canaux auxiliaires (délais, tailles) ne se ferment pas entièrement : on évalue le risque selon la sensibilité des données.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé) | L'index organisé ici est celui décrit en 19.1 |
| [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex) | La chaîne d'indexation propage aussi les changements de droits |
| [19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle](#196-autocomplétion-tolérance-aux-fautes-et-recherche-vectorielle) | Autocomplétion et recherche vectorielle appliquent les mêmes filtres |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits au niveau ressource, champ et ligne s'appliquent aussi à la recherche |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | La recherche est une des couches à isoler |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Le contexte de tenant alimente le client de recherche |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | L'expérience de recherche ne montre que ce que la personne peut voir |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les tests d'isolation couvrent le chemin de recherche |

### 5. Application pratique

**Situation initiale.** Alpha Air partage son index de constats avec d'autres compagnies clientes. Un audit interne montre que l'autocomplétion de la barre de recherche propose des immatriculations d'une autre compagnie.

**Problème.** Le filtre de tenant est appliqué au détail, mais pas à l'autocomplétion, ni aux facettes.

**Application du concept.** La plateforme impose un client de recherche unique avec filtre de tenant, ajoute des champs de droits, une vérification finale et des tests d'isolation.

**Déroulé.**

1. Un client de recherche unique remplace les accès directs : il reçoit le contexte de tenant et ajoute le filtre à toute requête, y compris suggestions et facettes.
2. Les documents portent `tenant_id`, `base` et `classification`. Les groupes autorisés sont indexés pour les contenus à portée limitée.
3. La liste calcule les facettes sur les résultats filtrés, avec un seuil de petits effectifs.
4. Pour les classes « restreint », une vérification finale auprès du service d'autorisation ouvre chaque résultat, avec un facteur de sur-récupération de 3.
5. Des tests d'isolation créent deux tenants avec des données voisines et vérifient qu'aucun chemin ne renvoie les éléments de l'autre.

**Résultat.** Les suggestions, les décomptes et les résultats sont bornés par le tenant et par les droits.

**Limites.** Un retrait de droit met jusqu'à 30 secondes à atteindre l'index : pour les classes les plus sensibles, la vérification finale ferme cette fenêtre.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le filtre de tenant doit-il être imposé par la plateforme plutôt que par chaque fonction ?
2. **Compréhension.** Quelles sont les trois organisations d'index par tenant, et que choisit-on selon la taille des tenants ?
3. **Compréhension.** Quelle différence y a-t-il entre filtrage préalable et vérification finale ?
4. **Pourquoi.** Pourquoi les facettes et le nombre total doivent-ils être calculés après le filtrage par les droits ?
5. **Raisonnement pratique.** Une page de 25 résultats doit être servie ; on estime que 50 % des candidats seront visibles. Combien de candidats lire, et que faire si la proportion réelle est de 20 % ?

#### Réponses

1. Parce qu'un filtre laissé au code appelant finit par être oublié sur un chemin (suggestion, facette, export), et chaque oubli est une fuite. Un client unique rend le filtre inévitable.
2. Un index par tenant, un index partagé avec filtre obligatoire, et un hybride. Les grands tenants justifient un index propre ; les petits se regroupent dans un index partagé, pour éviter le surcoût par index.
3. Le filtrage préalable restreint la requête à l'index, grâce à des champs de droits : c'est rapide, mais les droits peuvent être en retard. La vérification finale contrôle les résultats candidats auprès du service d'autorisation : c'est exact, mais plus lent.
4. Parce qu'un total ou un décompte calculé sur des éléments cachés révèle leur existence. Les agrégats ne portent que sur les éléments visibles.
5. $25 / 0{,}5 = 50$ candidats. Si la proportion réelle est de 20 %, 50 candidats ne donnent que 10 résultats visibles : la page est incomplète. On augmente la sur-récupération ou on affine le filtrage préalable, et on signale la page incomplète plutôt que de relâcher la vérification.

## 19.6 Autocomplétion, tolérance aux fautes et recherche vectorielle

### 1. Comprendre simplement

L'**autocomplétion** (*autocomplete*) propose des complétions pendant la saisie. La **tolérance aux fautes** (*typo tolerance*) retrouve des résultats malgré une faute de frappe ou d'orthographe. La **recherche vectorielle** (*vector search*) retrouve des éléments dont le sens est proche, même sans mot commun, en comparant des vecteurs de nombres appelés plongements. L'ensemble forme la fonction *autocomplete and typo tolerance*, puis *vector search*.

**Pourquoi cela existe.** Les personnes tapent vite, avec des fautes, et ne connaissent pas toujours le mot exact du document. « hydrolique » doit trouver « hydraulique ». « Perte de pression du circuit » doit trouver « Chute de pression dans le système ». Les trois mécanismes comblent l'écart entre ce qui est tapé et ce qui est écrit.

**Problème résolu.** Réduire l'effort de saisie et les recherches sans résultat, sans noyer la personne de faux résultats.

**Modèle mental.** Un assistant attentif : il complète votre phrase pendant que vous l'écrivez (autocomplétion), il comprend ce que vous vouliez dire malgré une faute (tolérance), et il connaît les mots voisins par le sens (vecteurs).

**Où l'analogie s'arrête.** Un assistant humain sait quand il se trompe. Un moteur propose avec assurance des rapprochements erronés : une immatriculation proche d'une autre, un terme voisin par le sens mais différent par l'effet.

**Exemple.** Une planificatrice tape « hydrol » : la barre propose « hydraulique », « hydraulique près du train ». Elle valide « hydrolique » avec une faute : la tolérance aux fautes retrouve les constats sur « hydraulique ». Elle cherche « perte de pression » : la recherche vectorielle remonte aussi « chute de pression dans le circuit », qui ne contient aucun de ces mots.

**Les composants.**

1. l'**index de préfixes** ou de n-grammes, pour l'autocomplétion ;
2. les **sources de suggestions** : titres, requêtes fréquentes, vocabulaire du tenant ;
3. la **distance d'édition** et les règles de tolérance ;
4. le **modèle de plongement**, qui produit les vecteurs ;
5. l'**index vectoriel**, avec recherche approchée ;
6. la **fusion** des résultats lexicaux et vectoriels ;
7. les **filtres de tenant et de droits**, appliqués à chacun.

**Objectif d'apprentissage :** vous pouvez décrire ces trois mécanismes, dire où chacun se trompe, et expliquer comment on les combine sans fuite entre tenants.

### 2. Connaissances essentielles

#### Définition

- **Autocomplétion** : proposition de complétions à partir du début d'une saisie, à partir d'un index de préfixes ou de n-grammes.
- **Tolérance aux fautes** : recherche qui accepte des termes à une distance d'édition limitée de ceux de la requête.
- **Recherche vectorielle** : recherche des éléments dont le vecteur est le plus proche de celui de la requête, selon une mesure de similarité.

#### Idées fondamentales

1. **L'autocomplétion est une recherche de préfixe, rapide et filtrée.** Elle doit respecter les mêmes frontières que la recherche.
2. **La tolérance aux fautes mesure une distance.** Plus le terme est long, plus on accepte d'écarts.
3. **Aucune tolérance sur les identifiants.** Deux identifiants proches désignent deux objets.
4. **Un plongement transforme le sens en géométrie.** Des textes de sens proche donnent des vecteurs proches.
5. **La recherche vectorielle est approchée.** On échange un peu de rappel contre beaucoup de vitesse.
6. **Le lexical et le vectoriel se complètent.** On les fusionne plutôt que de choisir.
7. **Un vecteur est une donnée sensible.** Il suit les règles du texte dont il dérive.

#### Vocabulaire essentiel

- **N-gramme** (*n-gram*) : suite de n caractères consécutifs, utilisée pour indexer des fragments.
- **Distance d'édition** (*edit distance*) : nombre minimal d'insertions, suppressions et substitutions pour passer d'une chaîne à une autre.
- **Plongement** (*embedding*) : vecteur de nombres qui représente un texte ou une image.
- **Similarité cosinus** (*cosine similarity*) : mesure de proximité entre deux vecteurs, fondée sur l'angle qui les sépare.
- **Voisins les plus proches** (*nearest neighbors*, kNN) : les $k$ éléments dont les vecteurs sont les plus proches.
- **Recherche approchée** (*approximate nearest neighbor*, ANN) : recherche qui renonce à l'exactitude pour la vitesse.
- **Fusion par rangs réciproques** (*reciprocal rank fusion*) : combinaison de classements par leurs rangs.
- **Recherche hybride** (*hybrid search*) : combinaison de recherche lexicale et vectorielle.

#### Relations de cause à effet

- L'autocomplétion lit l'index sans filtre de tenant : des termes d'autres tenants sont suggérés.
- La tolérance aux fautes s'applique à un identifiant : « F-ABCE » remonte pour « F-ABCD ».
- Le modèle de plongement change : les vecteurs anciens ne sont plus comparables aux nouveaux.
- Le filtrage par les droits s'applique après la recherche des voisins : il reste moins de $k$ résultats, ou aucun.
- Les vecteurs sont stockés hors des règles de suppression : un contenu supprimé reste retrouvable par son vecteur.

#### Idées reçues

- **« La recherche vectorielle remplace la recherche par mots. »** Non. Elle manque les termes exacts (identifiants, codes) que la recherche lexicale trouve très bien.
- **« Plus de tolérance aux fautes, c'est mieux. »** Non. Au-delà de quelques écarts, on rapproche des mots sans lien, et sur les identifiants c'est dangereux.
- **« Un vecteur ne contient pas le texte. »** Non. Des travaux publiés montrent qu'on peut reconstituer une partie importante du texte d'origine à partir de ses plongements.

#### Principe clé

L'autocomplétion, la tolérance aux fautes et les vecteurs élargissent ce que la recherche trouve, au prix de faux rapprochements ; chacun obéit aux mêmes filtres de tenant et de droits que la recherche, et se combine avec elle plutôt que de la remplacer.

#### Si vous ne retenez que trois choses

1. Autocomplétion et tolérance aux fautes opèrent sur les termes ; elles s'appliquent aux textes, pas aux identifiants.
2. La recherche vectorielle rapproche par le sens, de façon approchée, et se fusionne avec la recherche par mots.
3. Les suggestions et les vecteurs portent les mêmes frontières de tenant et de droits, et se suppriment avec le contenu.

### 3. Explication technique détaillée

#### Autocomplétion

Deux familles de techniques :

| Technique | Principe | Atouts | Limites |
|---|---|---|---|
| Préfixes sur les termes triés | On cherche tous les termes qui commencent par la saisie | Très rapide, peu d'espace | Seulement le début du mot |
| N-grammes de début de mot | On indexe les fragments de début de chaque mot | Complétion sur chaque mot du titre | Index plus gros |

Les **sources** de suggestions : titres des ressources, requêtes fréquentes et récentes du tenant, vocabulaire contrôlé. Le **classement** des suggestions combine la popularité et la récence ; on ne propose rien avant 2 ou 3 caractères.

Contraintes propres :

- **latence** : la réponse doit rester dans un budget de l'ordre de 100 ms, sinon la saisie est gênée ;
- **débit** : la saisie est interrogée à chaque frappe ; le client attend une courte pause avant de requérir (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)) ;
- **frontières** : mêmes filtres de tenant et de droits que la recherche (voir [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)) ;
- **contenu** : jamais de termes de champs sensibles, et pas de suggestion qui révèle l'existence d'un élément caché.

#### Tolérance aux fautes

La **distance d'édition de Levenshtein** compte les insertions, suppressions et substitutions nécessaires pour passer d'un mot à l'autre. Par exemple, « fisure » et « fissure » sont à distance 1 ; « hydrolique » et « hydraulique » sont à distance 2.

La documentation d'un moteur courant décrit la tolérance selon la longueur du terme (réglage automatique) : de 0 à 2 caractères, correspondance exacte ; de 3 à 5 caractères, une modification ; au-delà de 5 caractères, deux modifications ; le maximum est deux. Cette règle reflète l'intuition : plus un mot est court, plus un écart le change en un autre mot.

| Terme saisi | Terme indexé | Distance | Accepté si | Verdict |
|---|---|---|---|---|
| `fisure` | `fissure` | 1 | Texte libre | Utile |
| `hydrolique` | `hydraulique` | 2 | Texte libre, terme long | Utile |
| `F-ABCE` | `F-ABCD` | 1 | Identifiant | Dangereux : deux aéronefs différents |

La tolérance se règle par champ : activée sur les textes libres, désactivée sur les identifiants et les codes. Elle coûte plus cher qu'une recherche exacte (plus de termes candidats), d'où des plafonds sur le nombre de variantes explorées. Une variante utile est la suggestion **« Vouliez-vous dire »**, qui propose une correction fondée sur les termes de l'index sans l'appliquer d'office.

#### La recherche vectorielle

Un **plongement** est un vecteur de $d$ nombres, produit par un modèle, tel que des contenus de sens proche donnent des vecteurs proches. La proximité se mesure souvent par la similarité cosinus :

$$\cos(\vec{a}, \vec{b}) = \frac{\vec{a} \cdot \vec{b}}{\|\vec{a}\| \, \|\vec{b}\|}$$

Une valeur proche de 1 indique des vecteurs de même direction, donc des contenus de sens voisin.

**Exacte ou approchée.** La recherche exacte compare la requête à tous les vecteurs : précise, mais coûteuse à grande échelle. La recherche approchée parcourt un graphe de proximité : la documentation d'un moteur courant la recommande pour la plupart des charges de production, où la latence et le volume comptent plus qu'un rappel parfait, et réserve la recherche exacte aux petits ensembles ou aux sous-ensembles préfiltrés. L'algorithme **HNSW** (Malkov et Yashunin) construit des couches de graphes de proximité emboîtées : la recherche part des couches clairsemées du haut et descend, ce qui donne une complexité de recherche logarithmique en pratique et une grande précision.

**Coût de stockage.** Un vecteur de 768 dimensions en nombres à 4 octets occupe $768 \times 4 = 3\,072$ octets, soit 3 Kio. Pour 10 millions de documents : environ 28,6 Gio, sans compter le graphe d'index et les copies. Le plongement a aussi un coût de calcul à l'indexation et à chaque requête.

**Contraintes.**

- **Modèle.** Les vecteurs de requête et de document doivent avoir la même dimension et provenir du même modèle. Changer de modèle impose de recalculer tous les vecteurs, comme une réindexation (voir [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)).
- **Découpage.** Un long document se découpe en passages (« chunks ») dont chacun a son vecteur.
- **Langue et domaine.** Un modèle généraliste rapproche mal le vocabulaire technique d'un domaine : on le mesure sur des requêtes réelles (voir [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes)).

#### Recherche hybride

La recherche lexicale excelle sur les termes exacts et les identifiants ; la recherche vectorielle sur les formulations différentes. On les **fusionne**. La fusion par rangs réciproques (Cormack, Clarke et Büttcher, 2009) additionne, pour chaque document, $1 / (k + \text{rang})$ dans chaque classement :

$$\text{RRF}(d) = \sum_{i} \frac{1}{k + r_i(d)}$$

Ici, $r_i(d)$ est le rang du document $d$ dans le classement $i$ et $k$ une constante ; les auteurs ont fixé $k = 60$ lors d'une étude pilote. Exemple : le document A est 1er en lexical et 5e en vectoriel ; le document B est 3e et 2e. Avec $k = 60$ :

| Document | Rang lexical | Rang vectoriel | Score |
|---|---|---|---|
| A | 1 | 5 | $1/61 + 1/65 \approx 0{,}0318$ |
| B | 3 | 2 | $1/63 + 1/62 \approx 0{,}0320$ |

B passe devant A : la fusion récompense la constance dans les deux classements. Elle n'a besoin que des rangs, pas des scores, qui ne sont pas comparables entre méthodes.

#### Filtres, droits et vecteurs

Les filtres de tenant et de droits ([19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits)) s'appliquent **pendant** la recherche des voisins, pas après. Si l'on cherche d'abord les 10 voisins les plus proches de toute la collection, puis que l'on retire ceux que la personne ne peut pas voir, il peut ne rester aucun résultat, alors qu'il existe des éléments visibles légèrement plus éloignés. La documentation d'un moteur courant offre des filtres appliqués à la recherche approchée ; le comportement exact (avant ou pendant la recherche) se lit dans la documentation du produit retenu. Les vecteurs suivent aussi l'isolation par tenant (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) et la suppression ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

**Les plongements sont des données sensibles.** Des chercheurs ont montré qu'une méthode itérative permet de reconstituer exactement 92 % de textes de 32 jetons à partir de leurs plongements, et d'en extraire des noms complets dans des notes cliniques. Un plongement se traite donc comme le texte dont il dérive : même tenant, même chiffrement, même durée de conservation.

#### Modes de défaillance

- **Suggestion qui fuit** : l'autocomplétion révèle des éléments d'autres tenants.
- **Faute tolérée sur un identifiant.**
- **Mélange de modèles** : vecteurs incomparables.
- **Filtrage après les voisins** : résultats vides ou fuite.
- **Vecteurs orphelins** : le texte supprimé reste retrouvable.
- **Confiance excessive** : un rapprochement par le sens est présenté comme une certitude.
- **Latence** : une autocomplétion qui dépasse le budget gêne la saisie.

**Contre-exemple.** Une plateforme active la tolérance aux fautes sur tous les champs. Un technicien cherche « F-ABCE », une immatriculation qui n'existe pas dans sa flotte. La recherche renvoie les constats de F-ABCD, sans le signaler. Le technicien enregistre un constat sur le mauvais aéronef.

**Limites.** La recherche vectorielle est approchée et dépend du modèle ; elle ne garantit pas de trouver un résultat exact. Elle ne se justifie que si des requêtes réelles montrent un manque de la recherche par mots. Son coût (calcul, stockage, exploitation) est notable. Pour les usages génératifs qui s'appuient sur elle, voir [26.3 Génération augmentée par récupération](26-intelligence-artificielle.md#263-génération-augmentée-par-récupération) et [26.4 Isolation des données d'IA et récupération sensible aux droits](26-intelligence-artificielle.md#264-isolation-des-données-dia-et-récupération-sensible-aux-droits).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.1 Index de recherche et index inversé](#191-index-de-recherche-et-index-inversé) | Les termes et les préfixes viennent de l'index inversé |
| [19.2 Analyse de texte et segmentation](#192-analyse-de-texte-et-segmentation) | L'analyse détermine les termes proposés et tolérés |
| [19.3 Pertinence, classement et facettes](#193-pertinence-classement-et-facettes) | La fusion des classements et la mesure de qualité |
| [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex) | Un changement de modèle de plongement impose une réindexation |
| [19.5 Index par tenant et recherche sensible aux droits](#195-index-par-tenant-et-recherche-sensible-aux-droits) | Mêmes filtres de tenant et de droits pour suggestions et vecteurs |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | L'interface gère la saisie, la pause et l'affichage des suggestions |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La suppression d'un contenu supprime ses vecteurs |
| [26.3 Génération augmentée par récupération](26-intelligence-artificielle.md#263-génération-augmentée-par-récupération) | La génération augmentée par récupération s'appuie sur la recherche vectorielle |
| [26.4 Isolation des données d'IA et récupération sensible aux droits](26-intelligence-artificielle.md#264-isolation-des-données-dia-et-récupération-sensible-aux-droits) | L'isolation des données d'IA reprend les règles de droits de la recherche |

### 5. Application pratique

**Situation initiale.** Les techniciens d'Alpha Air cherchent des constats par description libre et se plaignent de ne rien trouver quand ils ne tapent pas le mot exact. Les planificateurs, eux, saisissent des immatriculations.

**Problème.** Une recherche purement lexicale, sans suggestion, qui échoue sur les formulations différentes.

**Application du concept.** La plateforme ajoute l'autocomplétion, la tolérance aux fautes par champ, et une recherche vectorielle fusionnée.

**Déroulé.**

1. L'autocomplétion propose des titres et des requêtes fréquentes du tenant, filtrés par tenant et par droits, avec une pause de saisie de 150 ms.
2. La tolérance aux fautes est activée sur le titre et la description, avec le réglage automatique, et désactivée sur l'immatriculation.
3. Les constats reçoivent un plongement du titre et de la description ; l'index vectoriel est approché et filtré par tenant.
4. Les deux classements sont fusionnés par rangs réciproques.
5. Un jeu d'essai de 40 requêtes montre que le taux de requêtes sans résultat passe de 14 % à 4 % (valeurs d'exemple), sans dégradation sur les recherches d'immatriculation.

**Résultat.** Les formulations proches trouvent les mêmes constats, et les identifiants restent exacts.

**Limites.** Un rapprochement par le sens peut être trompeur (« corrosion » et « oxydation » ne sont pas toujours équivalents) : l'interface présente les résultats comme des candidats, avec leur contexte.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi ne tolère-t-on pas les fautes sur un identifiant ?
2. **Compréhension.** Qu'est-ce qu'un plongement, et que mesure la similarité cosinus ?
3. **Compréhension.** Quel avantage la recherche hybride apporte-t-elle ?
4. **Pourquoi.** Pourquoi le filtrage par les droits doit-il s'appliquer pendant la recherche des voisins et non après ?
5. **Raisonnement pratique.** Une collection compte 4 000 000 de passages, avec des vecteurs de 1 024 dimensions en nombres à 4 octets. Quel espace occupent les seuls vecteurs, en Gio ?

#### Réponses

1. Parce qu'un identifiant désigne un objet précis : deux identifiants qui diffèrent d'une lettre désignent deux objets. Une tolérance renverrait le mauvais, sans le signaler.
2. Un plongement est un vecteur de nombres qui représente le sens d'un contenu. La similarité cosinus mesure la proximité de deux vecteurs par l'angle qui les sépare : proche de 1, leur sens est voisin.
3. Elle combine la précision des termes exacts (identifiants, codes) et la capacité des vecteurs à rapprocher des formulations différentes. La fusion par rangs ne demande que des classements, pas des scores comparables.
4. Parce qu'un filtrage après la recherche des $k$ plus proches peut ne laisser aucun résultat visible, alors que des éléments visibles existent un peu plus loin, et il laisse planer un risque d'exposition. Le filtre pendant la recherche garantit $k$ voisins parmi les éléments autorisés.
5. $1\,024 \times 4 = 4\,096$ octets par vecteur ; $4\,096 \times 4\,000\,000 = 16\,384\,000\,000$ octets, soit environ 15,3 Gio.

## 19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT

### 1. Comprendre simplement

La **charge transactionnelle** (*transactional workload*) est faite de nombreuses petites opérations qui lisent ou modifient quelques lignes : créer un constat, changer un statut. La **charge analytique** (*analytical workload*) est faite de peu de requêtes qui parcourent beaucoup de lignes pour les agréger : le nombre de constats par base et par mois. Un **entrepôt de données** (*data warehouse*) est une base conçue pour l'analyse. Un **lac de données** (*data lake*) conserve des données brutes de toute nature, à grande échelle. L'**ELT** (*ELT*) charge d'abord les données brutes dans la cible, puis les transforme dans la cible. L'ensemble forme la fonction *transactional versus analytical workload*.

**Pourquoi cela existe.** Une requête qui compte tous les constats des trois dernières années lit des millions de lignes. Exécutée sur la base de l'application, elle entre en concurrence avec les techniciens qui enregistrent leurs constats : tout le monde ralentit. On sépare donc les deux charges, chacune sur une base adaptée à sa forme.

**Problème résolu.** Obtenir des analyses lourdes, sur des historiques longs et plusieurs sources, sans dégrader l'application ni obliger à modéliser les données pour deux usages opposés.

**Modèle mental.** Un magasin et son service de comptabilité. Le magasin enregistre chaque vente à la caisse, vite. La comptabilité ne travaille pas à la caisse : elle reçoit les relevés, les range, et fait ses totaux dans son bureau.

**Où l'analogie s'arrête.** Un relevé de caisse est final. Une donnée peut être corrigée après son export, supprimée pour une raison légale, ou arriver en retard : l'entrepôt doit le gérer.

**Exemple.** Alpha Air veut le nombre de constats critiques par base et par mois sur deux ans. Exécutée sur la base de production à 9 h, la requête ralentit les tablettes des techniciens. La plateforme copie les constats chaque nuit, puis chaque quart d'heure, vers un entrepôt, où la requête s'exécute sans rien perturber.

**Les composants.**

1. la **base transactionnelle**, source de vérité ;
2. le **chargement** : extraction des changements et transport ;
3. la **zone brute** (le lac) : données telles que reçues ;
4. la **transformation** : nettoyage, jointures, modélisation ;
5. l'**entrepôt**, qui sert les analyses ;
6. l'**isolation par tenant** et les droits ;
7. les **règles de suppression et de rétention**, propagées.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi on sépare charge transactionnelle et analytique, distinguer entrepôt et lac, et décrire une chaîne ELT multi-tenant.

### 2. Connaissances essentielles

#### Définition

- **Charge transactionnelle** : ensemble d'opérations courtes, concurrentes, qui lisent ou écrivent quelques lignes avec des exigences de cohérence et de temps de réponse.
- **Charge analytique** : ensemble de requêtes qui lisent de grands volumes, souvent historiques, pour les agréger ou les comparer.
- **Entrepôt de données** : base optimisée pour l'analyse de données structurées, dont le schéma est défini avant le chargement.
- **Lac de données** : dépôt centralisé de données brutes, structurées ou non, dont la structure est appliquée à la lecture.
- **ELT** : chaîne qui extrait les données, les charge brutes dans la cible, puis les transforme dans la cible.

#### Idées fondamentales

1. **Deux charges, deux formes.** Petites écritures concurrentes d'un côté, grands balayages de l'autre.
2. **On ne pénalise pas l'application par l'analyse.** L'analyse tourne ailleurs.
3. **L'entrepôt est une copie transformée.** La base reste la source de vérité.
4. **Le lac conserve le brut.** On peut retransformer plus tard, avec de nouvelles règles.
5. **L'ELT déplace la transformation vers la cible.** Les données brutes sont conservées et recalculables.
6. **Le tenant traverse toute la chaîne.** Chaque table, chaque fichier le porte.
7. **Les suppressions suivent.** Une donnée supprimée à la source l'est aussi dans les copies.

#### Vocabulaire essentiel

- **OLTP** (*online transaction processing*) : traitement transactionnel en ligne.
- **OLAP** (*online analytical processing*) : traitement analytique en ligne.
- **Stockage en colonnes** (*columnar storage*) : stockage où les valeurs d'une même colonne sont rangées ensemble.
- **Schéma à l'écriture, schéma à la lecture** (*schema-on-write*, *schema-on-read*) : la structure est imposée au chargement, ou appliquée à la lecture.
- **Capture des changements** (*change data capture*, CDC) : lecture des changements de la base source, par son journal ou par des événements.
- **ETL** (*extract, transform, load*) : la transformation précède le chargement dans la cible.
- **Zone brute, nettoyée, modélisée** (*raw*, *cleaned*, *modeled zones*) : étapes successives de préparation.
- **Marque de progression** (*watermark*) : repère qui indique jusqu'où les changements ont été chargés.

#### Relations de cause à effet

- Une requête analytique lourde tourne sur la base de production : les opérations transactionnelles ralentissent.
- Une table est modélisée pour les deux usages : elle est trop normalisée pour l'analyse et trop large pour la saisie.
- Le chargement incrémental se fonde sur une date de modification : des lignes validées en retard sont ratées.
- Une suppression pour motif légal n'est pas propagée : des données personnelles restent dans l'entrepôt.
- Le lac reçoit tout sans catalogue ni règles : il devient un marécage où personne ne retrouve rien.

#### Idées reçues

- **« L'entrepôt est une réplique de la base. »** Non. Il est modélisé pour l'analyse et contient des historiques, des agrégats et des sources multiples.
- **« Un lac remplace un entrepôt. »** Non. Le lac conserve le brut ; l'entrepôt sert des données nettoyées et modélisées, avec des performances et une gouvernance.
- **« ELT veut dire pas de transformation. »** Non. La transformation a lieu, dans la cible, après le chargement.

#### Principe clé

On sépare la charge qui enregistre de celle qui analyse ; on charge le brut, on le transforme dans la cible, et le tenant, les droits et les suppressions traversent toute la chaîne.

#### Si vous ne retenez que trois choses

1. Les charges transactionnelle et analytique ont des formes opposées : on les sépare.
2. Le lac garde le brut, l'entrepôt sert des données modélisées ; l'ELT les relie dans la cible.
3. Chaque étape porte le tenant, applique les droits et propage les suppressions.

### 3. Explication technique détaillée

#### Deux charges aux formes opposées

La page de comparaison d'un grand fournisseur d'infrastructure résume les différences suivantes.

| Critère | Transactionnel (OLTP) | Analytique (OLAP) |
|---|---|---|
| But | Traiter des transactions en temps réel | Analyser de grands volumes pour décider |
| Requêtes | Courtes, écritures fréquentes | Complexes, sur de grands historiques |
| Volume typique | Des gigaoctets | Des téraoctets à des pétaoctets |
| Temps de réponse | Millisecondes ou moins | Secondes à minutes, parfois davantage |
| Source | Un système, données en temps réel | Plusieurs sources, données historiques et agrégées |

Ces ordres de grandeur sont ceux de la page citée. Ils situent les usages, ils ne sont pas des garanties.

**Stockage par lignes ou par colonnes.** Une base transactionnelle range les valeurs d'une ligne ensemble : lire ou écrire une ligne entière est rapide. Une base analytique range souvent les valeurs d'une colonne ensemble : une requête qui n'utilise que 3 colonnes d'une table de 40 colonnes ne lit que ces 3 colonnes.

Exemple d'ordre de grandeur, avant compression : 80 millions de lignes de 40 colonnes de 8 octets en moyenne occupent $80\,000\,000 \times 40 \times 8 = 25{,}6$ milliards d'octets, soit 23,8 Gio ; une requête sur 3 colonnes en lit $80\,000\,000 \times 3 \times 8 = 1{,}92$ milliard d'octets, soit 1,8 Gio. Le rapport est de $40 / 3 \approx 13$. Le stockage en colonnes se compresse aussi mieux, car les valeurs d'une colonne se ressemblent.

#### Entrepôt et lac

| Critère | Entrepôt de données | Lac de données |
|---|---|---|
| Contenu | Données structurées, nettoyées, modélisées | Données brutes de toute nature, structurées ou non |
| Schéma | Défini avant le chargement (schéma à l'écriture) | Appliqué à la lecture (schéma à la lecture) |
| Préparation | Nettoyé, enrichi, transformé en source de vérité analytique | Brut, sans nettoyage obligatoire à l'arrivée |
| Usage | Rapports, tableaux de bord, analyses fiables | Exploration, science des données, reprise de transformations |
| Risque | Rigidité, coût de modélisation | Marécage de données sans catalogue ni qualité |

La description de ces deux notions suit la page d'un grand fournisseur d'infrastructure : le lac est un dépôt centralisé de données de tout type, à toute échelle, avec un schéma appliqué à la lecture ; l'entrepôt est une base optimisée pour analyser des données relationnelles, avec un schéma défini à l'écriture.

#### La chaîne ELT

```text
Base transactionnelle ─► capture des changements ─► zone brute ─► transformation ─► zone modélisée ─► entrepôt ─► analyses
         (source de vérité)                           (lac)        (dans la cible)
```

| Zone | Contenu | Règle |
|---|---|---|
| Brute | Changements tels que reçus, avec tenant, révision, date de chargement | Immuable ; conservée pour recalculer |
| Nettoyée | Types corrigés, doublons retirés, valeurs normalisées | Reconstructible depuis la zone brute |
| Modélisée | Faits et dimensions (voir [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique)) | Prête pour l'analyse et la couche sémantique |

**Charger par changements.** Trois approches existent pour savoir ce qui a changé :

| Approche | Principe | Limite |
|---|---|---|
| Date de modification | Charger les lignes plus récentes que la marque | Les transactions validées en retard sont ratées, sauf marge de recouvrement |
| Révision | Charger les lignes dont la révision dépasse celle déjà chargée | Demande une révision fiable (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) |
| Capture des changements ou événements | Lire le journal de la base ou la boîte d'envoi (voir [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)) | Plus complexe ; ordre et doublons à gérer |

Quelle que soit l'approche, le chargement est **idempotent** : le rejouer ne crée pas de doublon. Pour ne garder que le dernier état d'une ligne chargée plusieurs fois dans un lot :

```sql
INSERT INTO analytics.finding_current
       (tenant_id, finding_id, status, severity, base, opened_at, closed_at, revision)
SELECT DISTINCT ON (r.tenant_id, r.id)
       r.tenant_id, r.id, r.status, r.severity, r.base, r.created_at, r.closed_at, r.revision
  FROM raw.finding_changes r
 WHERE r.loaded_at > $1
 ORDER BY r.tenant_id, r.id, r.revision DESC
ON CONFLICT (tenant_id, finding_id) DO UPDATE
   SET status    = EXCLUDED.status,
       severity  = EXCLUDED.severity,
       base      = EXCLUDED.base,
       closed_at = EXCLUDED.closed_at,
       revision  = EXCLUDED.revision
 WHERE analytics.finding_current.revision < EXCLUDED.revision;
```

La clause `DISTINCT ON` retient la révision la plus récente de chaque constat dans le lot. La condition finale n'écrase jamais une révision plus récente par une plus ancienne : rejouer le même lot ne change rien.

**ELT plutôt qu'ETL.** Charger d'abord le brut et transformer dans la cible conserve l'historique brut, permet de recalculer avec de nouvelles règles, et s'appuie sur la puissance de la cible, au prix d'un espace de stockage plus grand et d'une zone brute à protéger (voir [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) pour la comparaison avec ETL).

#### Multi-tenant et analyse

| Organisation | Principe | Atouts | Limites |
|---|---|---|---|
| Tables partagées avec `tenant_id` | Toutes les données dans les mêmes tables | Économique, analyses transverses | Isolation à imposer par requête ou par politique de ligne (voir [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)) |
| Schéma par tenant | Un schéma par tenant dans le même entrepôt | Isolation plus claire, personnalisation | Nombre de schémas, évolution à répercuter |
| Entrepôt ou projet par tenant | Un espace par tenant | Isolation forte, coûts attribuables | Exploitation lourde, pas d'analyse transverse |

Le choix suit le niveau d'isolation du tenant (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) et [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)). L'analyse inter-tenants de l'opérateur de la plateforme se limite à des agrégats (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).

#### Suppressions, rétention et données personnelles

- La suppression d'une ressource à la source produit un événement qui **supprime ou anonymise** les lignes dans la zone modélisée et la zone brute selon la politique (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) et [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).
- Les fichiers du lac sont immuables : on supprime par réécriture de la partition concernée, ou par effacement cryptographique (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).
- Les données personnelles sont minimisées avant d'entrer dans l'analyse (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).
- La résidence des données ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)) s'applique aux copies analytiques comme à la source.

#### Fraîcheur et coût

Un chargement peut être **par lots** (chaque nuit), par **micro-lots** (chaque quart d'heure) ou en **flux** (quelques secondes). Plus la fraîcheur est fine, plus le coût et la complexité croissent. On choisit la fraîcheur par usage (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) : un tableau de bord opérationnel peut demander 15 minutes, un rapport réglementaire mensuel se contente d'un chargement quotidien.

#### Modes de défaillance

- **Analyse sur la base de production** : ralentissement des utilisateurs.
- **Chargement non idempotent** : doublons, comptes faux.
- **Lignes ratées** : date de modification utilisée sans marge.
- **Suppression non propagée** : données personnelles résiduelles.
- **Lac sans catalogue** : données introuvables ou non fiables.
- **Isolation par tenant oubliée** dans l'entrepôt.
- **Coût non maîtrisé** : requêtes libres sur de gros volumes.

**Contre-exemple.** Un rapport de direction exécute chaque matin, à 9 h, une requête qui parcourt trois ans de constats sur la base de production. Les tablettes des techniciens mettent 20 secondes à enregistrer un constat, et la direction ne le sait pas. Il fallait déplacer l'analyse vers un entrepôt alimenté par les changements.

**Limites.** Séparer les charges coûte : un pipeline à exploiter, une copie à garder cohérente, une latence de fraîcheur. Les petites plateformes peuvent commencer par un réplica de lecture (voir [22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication)) avant de construire un entrepôt. Les chiffres du lac et de l'entrepôt ne remplacent pas les données de la base pour les décisions qui exigent l'exactitude à l'instant.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | ETL, import et export : la synchronisation vers l'entrepôt en est un cas |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | Le modèle de lecture dérivé, en plus grand : l'entrepôt en est le prolongement |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | L'entrepôt est cohérent à terme |
| [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique) | La zone modélisée suit un modèle dimensionnel |
| [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne) | Agrégats et droits par ligne s'appuient sur cet entrepôt |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | La fraîcheur des chiffres se fixe comme objectif |
| [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants) | L'administration inter-tenants n'affiche que des agrégats |
| [22.4 Réplicas de lecture et retard de réplication](22-performance-echelle-economie.md#224-réplicas-de-lecture-et-retard-de-réplication) | Un réplica de lecture est une étape intermédiaire |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La suppression et la rétention se propagent aux copies analytiques |

### 5. Application pratique

**Situation initiale.** La direction technique d'Alpha Air consulte un tableau de bord alimenté directement par des requêtes sur la base de production. Chaque matin vers 9 h, les techniciens se plaignent de lenteurs.

**Problème.** Une charge analytique sur la base transactionnelle, des historiques incomplets et des définitions divergentes.

**Application du concept.** La plateforme introduit un entrepôt alimenté par les changements, avec zone brute et zone modélisée.

**Déroulé.**

1. Les événements de changement des constats, tâches et aéronefs alimentent la zone brute, avec le tenant et la révision.
2. Une transformation nettoie et déduplique, puis produit les tables de la zone modélisée.
3. Le chargement est rejoué chaque quart d'heure ; il est idempotent par la clause de révision.
4. Les tableaux de bord et les rapports lisent l'entrepôt, jamais la base de production.
5. Un événement de suppression propage l'effacement ou l'anonymisation aux zones brute et modélisée.

**Résultat.** Les lenteurs de 9 h disparaissent, et les analyses couvrent plusieurs années.

**Limites.** Un chiffre de l'entrepôt peut avoir 15 minutes de retard : la fraîcheur est affichée (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi sépare-t-on la charge transactionnelle de la charge analytique ?
2. **Compréhension.** Quelle différence y a-t-il entre un entrepôt et un lac de données ?
3. **Compréhension.** En quoi l'ELT diffère-t-il de l'ETL ?
4. **Pourquoi.** Pourquoi le chargement doit-il être idempotent ?
5. **Raisonnement pratique.** Une table compte 100 millions de lignes de 25 colonnes de 8 octets ; une requête lit 2 colonnes. Combien d'octets lit un stockage par lignes, et un stockage par colonnes, avant compression ?

#### Réponses

1. Parce que leurs formes s'opposent : de petites écritures concurrentes qui exigent un temps de réponse court, contre de grands balayages qui consomment beaucoup de ressources. Sur la même base, les secondes ralentissent les premières.
2. L'entrepôt contient des données structurées, nettoyées, modélisées, avec un schéma défini avant le chargement. Le lac conserve des données brutes de toute nature, avec un schéma appliqué à la lecture.
3. En ETL, la transformation précède le chargement dans la cible. En ELT, on charge d'abord les données brutes, puis on les transforme dans la cible, ce qui conserve le brut et permet de recalculer.
4. Parce qu'un chargement est souvent rejoué (après une panne, par recouvrement). S'il n'est pas idempotent, chaque rejeu crée des doublons et fausse les chiffres.
5. Stockage par lignes : $100\,000\,000 \times 25 \times 8 = 20$ milliards d'octets. Stockage par colonnes : $100\,000\,000 \times 2 \times 8 = 1{,}6$ milliard d'octets, soit douze fois et demie moins.

## 19.8 Modélisation dimensionnelle et couche sémantique

### 1. Comprendre simplement

La **modélisation dimensionnelle** (*dimensional modeling*) organise les données pour l'analyse autour de **faits** (des mesures : un constat, un nombre d'heures) et de **dimensions** (le contexte qui les décrit : l'aéronef, la base, la date). La **couche sémantique** (*semantic layer*) est une couche qui définit une fois, en termes métier, les entités, les relations et les indicateurs, pour que tous les outils d'analyse calculent la même chose.

**Pourquoi cela existe.** Les tables de l'application sont modélisées pour enregistrer : normalisées, étroites, nombreuses jointures. Une question d'analyse (« constats critiques par base et par mois ») y demande une longue suite de jointures que chacun écrit à sa façon. Deux personnes obtiennent deux chiffres. Un modèle pensé pour la question, et une définition unique des indicateurs, règlent les deux problèmes.

**Problème résolu.** Rendre les questions d'analyse simples à poser et leurs réponses identiques d'un outil et d'une personne à l'autre.

**Modèle mental.** Un tableur croisé dynamique : au centre, des mesures (faits) ; autour, des axes de découpage (dimensions). La couche sémantique est le dictionnaire qui dit ce que « constat ouvert » veut dire, partout.

**Où l'analogie s'arrête.** Un croisé dynamique est un fichier ponctuel. Un modèle dimensionnel est partagé, évolue, a des historiques de dimensions (une base qui change de nom, un aéronef qui change de base) et doit rester cohérent dans le temps.

**Exemple.** Les constats d'Alpha Air sont des faits, avec une date d'ouverture, une date de clôture et une gravité. Les dimensions sont l'aéronef, la base, la date, la gravité. La question « combien de constats critiques par base et par mois ? » devient un regroupement sur une table de faits et trois dimensions. La couche sémantique définit « constat ouvert » (non clos à la date) une fois, utilisée par tous les tableaux de bord.

**Les composants.**

1. le **grain** : ce que représente une ligne de faits ;
2. la **table de faits** : mesures et clés vers les dimensions ;
3. les **tables de dimensions** : attributs descriptifs ;
4. les **clés de substitution** : identifiants propres à l'entrepôt ;
5. l'**historique des dimensions** (variation lente) ;
6. les **dimensions conformes**, communes à plusieurs faits ;
7. la **couche sémantique** : entités, relations, indicateurs, droits.

**Objectif d'apprentissage :** vous pouvez décrire un schéma en étoile, déclarer un grain, expliquer la variation lente d'une dimension, et dire ce que la couche sémantique garantit.

### 2. Connaissances essentielles

#### Définition

- **Modélisation dimensionnelle** : méthode de conception de données analytiques en faits mesurables et dimensions descriptives, organisés en schéma en étoile.
- **Couche sémantique** : couche de définitions métier, entités, relations et indicateurs, située entre les données et leurs consommateurs, qui assure des calculs identiques partout.

#### Idées fondamentales

1. **On déclare le grain d'abord.** Chaque ligne de faits représente une chose précise.
2. **Les faits se mesurent, les dimensions se décrivent.** Les mesures sont souvent additives.
3. **Le schéma en étoile simplifie.** Peu de jointures, des requêtes lisibles.
4. **Les dimensions changent.** On choisit comment conserver leur historique.
5. **Les dimensions conformes relient les faits.** La même dimension « date » ou « aéronef » sert partout.
6. **Une définition, plusieurs usages.** La couche sémantique évite les écarts entre outils.
7. **La couche sémantique porte les droits.** Qui peut utiliser quel indicateur, sur quel périmètre.

#### Vocabulaire essentiel

- **Grain** (*grain*) : niveau de détail d'une ligne de la table de faits.
- **Fait** (*fact*) : mesure d'un événement ou d'un état, attachée à des dimensions.
- **Dimension** (*dimension*) : contexte descriptif d'un fait.
- **Schéma en étoile** (*star schema*) : une table de faits au centre, des dimensions autour.
- **Clé de substitution** (*surrogate key*) : identifiant artificiel d'une ligne de dimension.
- **Dimension à variation lente** (*slowly changing dimension*, SCD) : dimension dont les attributs changent peu, avec une règle d'historique.
- **Dimension conforme** (*conformed dimension*) : dimension partagée avec une même définition par plusieurs faits.
- **Mesure ou indicateur** (*measure*, *metric*) : calcul nommé et réutilisable sur les faits.

#### Relations de cause à effet

- Le grain n'est pas déclaré : des lignes de natures différentes se mélangent, et les sommes sont fausses.
- L'historique des dimensions est écrasé : un constat ancien est rattaché à la base actuelle de l'aéronef, pas à celle de l'époque.
- Chaque outil recalcule « constat ouvert » à sa façon : les tableaux de bord divergent.
- Les dimensions ne sont pas conformes : les faits de deux domaines ne se comparent pas.
- La couche sémantique ignore les droits : un indicateur expose ce qu'un autre protège.

#### Idées reçues

- **« Le schéma en étoile est un luxe d'architecte. »** Non. Il rend les requêtes courtes, comparables et rapides, et évite les jointures personnelles de chacun.
- **« Une dimension est une table de référence immuable. »** Non. Une dimension change, et la règle d'historique est un choix de conception.
- **« La couche sémantique est un outil de BI. »** Non. C'est une définition partagée, qui peut vivre indépendamment de l'outil.

#### Principe clé

On déclare un grain, on sépare mesures et contexte, on décide comment la dimension garde son histoire, et l'on définit chaque indicateur une seule fois dans une couche sémantique partagée.

#### Si vous ne retenez que trois choses

1. Le grain dit ce qu'est une ligne de faits ; tout le reste en découle.
2. Les dimensions changent : on choisit explicitement si l'on garde leur historique.
3. Un indicateur a une seule définition, dans une couche partagée, avec ses droits.

### 3. Explication technique détaillée

#### Le schéma en étoile

```text
                      dim_date
                         │
dim_aircraft ───── fact_finding ───── dim_severity
                         │
                      dim_base
```

La table de faits est au centre ; chaque dimension y est reliée par une clé. Le site d'un éditeur de référence en modélisation dimensionnelle liste, parmi les techniques fondamentales : les faits pour les mesures, les dimensions pour le contexte descriptif, la déclaration du grain, les schémas en étoile, les dimensions conformes, les clés de substitution et les variations lentes de dimension.

**Les trois familles de faits.**

| Famille | Une ligne représente | Exemple |
|---|---|---|
| Transaction | Un événement métier | Un constat ouvert |
| Instantané périodique | L'état à intervalles réguliers | Le nombre de constats ouverts chaque jour |
| Instantané cumulatif | Un élément le long d'un processus, mis à jour à chaque jalon | Un constat de l'ouverture à la clôture, avec les délais entre étapes |

#### Un modèle pour les constats

```sql
CREATE TABLE dim_aircraft (
  aircraft_key  bigint  PRIMARY KEY,
  tenant_id     uuid    NOT NULL,
  aircraft_id   uuid    NOT NULL,
  registration  text    NOT NULL,
  type_code     text    NOT NULL,
  base          text    NOT NULL,
  valid_from    date    NOT NULL,
  valid_to      date,
  is_current    boolean NOT NULL
);

CREATE TABLE fact_finding (
  tenant_id        uuid    NOT NULL,
  finding_id       uuid    NOT NULL,
  aircraft_key     bigint  NOT NULL REFERENCES dim_aircraft (aircraft_key),
  opened_date_key  integer NOT NULL,
  closed_date_key  integer,
  severity         text    NOT NULL,
  days_open        integer,
  PRIMARY KEY (tenant_id, finding_id)
);
```

**Le grain** de `fact_finding` est « un constat ». La clé `aircraft_key` est une **clé de substitution** : elle désigne une version d'un aéronef, pas l'aéronef lui-même. La date est une clé entière (`20261012`) vers une dimension de dates, qui porte aussi le calendrier ouvré du tenant (voir [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité)).

#### Variation lente : conserver l'histoire

Une dimension change : un aéronef passe de la base de Lyon à celle de Toulouse. La documentation de référence liste les types de traitement les plus courants.

| Type | Traitement | Effet |
|---|---|---|
| 0 | La valeur d'origine est conservée | L'attribut ne change jamais |
| 1 | La valeur est écrasée | L'histoire est perdue ; tout est rattaché à la valeur actuelle |
| 2 | Une nouvelle ligne est ajoutée | L'histoire est conservée, avec dates de validité |
| 3 | Un nouvel attribut est ajouté | Valeur précédente conservée, historique limité |

**Exemple chiffré.** L'aéronef F-ABCD change de base le 1er juin 2026. Deux constats : l'un ouvert le 20 mai (alors à Lyon), l'autre le 15 juin (alors à Toulouse).

| Traitement | Constats attribués à Lyon | Constats attribués à Toulouse |
|---|---|---|
| Type 1 (écrasement) | 0 | 2 |
| Type 2 (nouvelle ligne) | 1 | 1 |

Le type 2 reflète ce qui était vrai à l'époque ; le type 1 réécrit le passé. Ni l'un ni l'autre n'est « le bon » : le choix dépend de la question (« où était l'aéronef ? » ou « où est-il aujourd'hui ? »), et on peut conserver les deux (`base` à l'époque, `current_base`).

En type 2, le constat rattache sa clé de substitution au moment du chargement :

```sql
SELECT a.aircraft_key
  FROM dim_aircraft a
 WHERE a.tenant_id   = $1
   AND a.aircraft_id = $2
   AND a.valid_from <= $3
   AND (a.valid_to IS NULL OR $3 < a.valid_to);
```

Le paramètre `$3` est la date de l'événement. Les intervalles de validité ne se chevauchent pas : une seule ligne répond.

#### Dimensions conformes

La dimension « aéronef » est la même pour les faits « constats », « heures de vol » et « tâches ». Les faits de domaines différents se comparent alors par aéronef et par mois. Sans dimension conforme, chaque domaine invente la sienne, et les croisements deviennent des chantiers.

#### La couche sémantique

La couche sémantique situe entre les tables et les outils la définition des entités, des relations et des indicateurs. La documentation d'une couche sémantique d'un outil de transformation de données la décrit ainsi : définir les indicateurs une fois, dans la couche de modélisation, et les réutiliser dans les outils en aval, de sorte qu'une modification de définition se répercute partout où elle est utilisée ; elle inclut des permissions d'accès qui restreignent qui peut utiliser les indicateurs.

```yaml
metrics:
  - name: findings_open
    label: Constats ouverts
    model: fact_finding
    type: count
    filter: "closed_date_key IS NULL"
    dimensions: [base, severity, month]
    owner: quality_manager
    version: 3
  - name: findings_critical_opened
    label: Constats critiques ouverts dans la période
    model: fact_finding
    type: count
    filter: "severity = 'critical'"
    time_dimension: opened_date
    dimensions: [base, month]
    owner: quality_manager
    version: 1
```

C'est la généralisation de la **mesure nommée** vue pour les tableaux de bord ([12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)) : le widget référence une mesure, l'outil d'exploration et le rapport planifié ([19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport)) aussi.

**Multi-tenant.** Les indicateurs livrés par la plateforme servent de base ; un tenant peut définir les siens, ou redéfinir un terme comme « en retard » selon son métier (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)). Les **champs personnalisés** ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)) doivent apparaître comme des attributs de dimension ou des mesures : on les expose par un mécanisme d'attributs dynamiques, tout en gardant un modèle stable. Chaque définition est versionnée (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)).

#### Modes de défaillance

- **Grain mélangé** : une table qui contient des lignes de natures différentes.
- **Histoire écrasée** par défaut.
- **Dimension non conforme** : croisement impossible.
- **Définitions dupliquées** dans chaque tableau de bord.
- **Champs personnalisés absents** de l'analyse.
- **Clé naturelle utilisée** à la place d'une clé de substitution : l'histoire n'est plus représentable.

**Contre-exemple.** Trois tableaux de bord calculent « constats ouverts » avec trois filtres légèrement différents. La direction obtient 128, 131 et 140 le même jour. Chaque équipe a raison selon sa définition ; la confiance dans les chiffres disparaît. Il fallait une définition unique, nommée, versionnée, dans la couche sémantique.

**Limites.** Un modèle dimensionnel répond bien aux questions prévues : une nouvelle question peut exiger un nouveau fait ou une nouvelle dimension. Il demande un travail de conception et de maintenance. La couche sémantique centralise les définitions, mais elle n'élimine pas les désaccords métier : elle les rend visibles et arbitrables.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | Le modèle dimensionnel structure la zone modélisée de l'entrepôt |
| [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne) | Agrégats, libre-service et droits par ligne s'appuient sur ce modèle |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | La gouvernance des définitions versionne les indicateurs |
| [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord) | La mesure nommée d'un tableau de bord est le précurseur de la couche sémantique |
| [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Les champs personnalisés doivent trouver place dans les dimensions et mesures |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La variation lente est une modélisation temporelle |
| [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) | Le calendrier ouvré enrichit la dimension de dates |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | Les définitions se personnalisent par tenant |

### 5. Application pratique

**Situation initiale.** Chaque tableau de bord d'Alpha Air a sa requête. Le nombre de constats par base diffère d'un écran à l'autre, et une base rattachée à un aéronef après coup déplace tout l'historique.

**Problème.** Pas de grain déclaré, pas d'historique des dimensions, pas de définition partagée.

**Application du concept.** La plateforme introduit un schéma en étoile des constats, une dimension aéronef à variation lente de type 2 et une couche sémantique.

**Déroulé.**

1. L'équipe déclare le grain : un constat.
2. Elle crée `fact_finding` et les dimensions aéronef, base, date et gravité.
3. Elle traite l'aéronef en type 2 : chaque changement de base ouvre une nouvelle ligne avec ses dates de validité.
4. Elle définit `findings_open` une fois dans la couche sémantique, avec propriétaire et version.
5. Les tableaux de bord et les rapports référencent la mesure ; le chiffre et la liste concordent.

**Résultat.** Les constats sont attribués à la base de l'époque, et tous les écrans donnent le même nombre.

**Limites.** Le type 2 multiplie les lignes de dimension et complique les jointures : on documente l'usage de `is_current` pour les questions « aujourd'hui ».

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que le grain d'une table de faits, et pourquoi le déclare-t-on en premier ?
2. **Compréhension.** Quelle différence y a-t-il entre une variation lente de type 1 et de type 2 ?
3. **Compréhension.** Que définit la couche sémantique, et que garantit-elle ?
4. **Pourquoi.** Pourquoi utilise-t-on des clés de substitution pour les dimensions ?
5. **Raisonnement pratique.** Un aéronef change de base le 1er juillet. Un constat est ouvert le 10 juin, un autre le 20 juillet. Que donne chaque type pour la répartition par base ?

#### Réponses

1. Le grain dit ce que représente une ligne : un constat, une heure de vol. On le déclare d'abord car il détermine les mesures, les dimensions possibles et la justesse des sommes.
2. En type 1, la valeur est écrasée : l'histoire disparaît et tout est rattaché à la valeur actuelle. En type 2, une nouvelle ligne est ajoutée avec des dates de validité : l'histoire est conservée.
3. Les entités, les relations et les indicateurs en termes métier, une seule fois. Elle garantit que tous les outils calculent la même chose, et porte les droits d'usage des indicateurs.
4. Parce qu'une clé naturelle désigne l'aéronef, pas sa version à un instant. La clé de substitution désigne une ligne de dimension, donc une version, ce qui rend l'historique représentable.
5. Type 1 : les deux constats sont rattachés à la nouvelle base. Type 2 : le constat du 10 juin reste à l'ancienne base, celui du 20 juillet est rattaché à la nouvelle.

## 19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne

### 1. Comprendre simplement

Un **agrégat matérialisé** (*materialized aggregate*) est un résultat de calcul agrégé, stocké à l'avance et rafraîchi, pour qu'une question fréquente réponde en un instant. L'**analytique en libre-service** (*self-service analytics*) permet à des personnes non techniques de construire leurs analyses sur un modèle gouverné. L'**analytique embarquée** (*embedded analytics*) place des tableaux de bord et des analyses dans l'interface du produit, pour les utilisateurs des tenants. La **sécurité par ligne dans l'analytique** (*row-level security in analytics*) limite, ligne par ligne, ce que chaque personne voit dans les données analytiques.

**Pourquoi cela existe.** Un tableau de bord qui additionne deux ans de constats à chaque affichage est lent et coûteux. Les équipes veulent poser leurs propres questions sans attendre un développeur. Les clients veulent voir leurs chiffres dans l'application. Et chaque personne ne doit voir que ses données.

**Problème résolu.** Répondre vite, laisser chacun explorer, afficher l'analyse dans le produit, sans rien exposer de ce qui est protégé.

**Modèle mental.** Un tableau d'affichage de la direction : les totaux du mois y sont déjà calculés (agrégats), un classeur permet de consulter les détails par soi-même (libre-service), le tableau est visible depuis chaque bureau (embarqué), et chacun ne voit que les lignes de son périmètre (sécurité par ligne).

**Où l'analogie s'arrête.** Un tableau d'affichage est statique et public. Ici, les calculs se rafraîchissent, se recalculent quand une définition change, et chaque lecteur voit une vue différente.

**Exemple.** Le tableau de bord qualité d'Alpha Air affiche les constats par base et par mois, depuis un agrégat rafraîchi chaque quart d'heure. Sophie compose elle-même une vue « constats critiques par type d'aéronef ». Le tableau est intégré à l'application des tenants, avec un jeton qui ne porte que son tenant. Une personne de la base TLS ne voit que les lignes de TLS.

**Les composants.**

1. les **agrégats** : définitions, granularités, rafraîchissement ;
2. la **couche sémantique** (voir [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique)), qui les expose ;
3. l'**explorateur libre-service** et ses garde-fous ;
4. l'**intégration embarquée** : jetons, thèmes, quotas ;
5. la **politique de sécurité par ligne** ;
6. la **propagation de l'identité** jusqu'à la donnée ;
7. le **seuil de petits effectifs**.

**Objectif d'apprentissage :** vous pouvez choisir une stratégie d'agrégat, décrire les garde-fous d'un libre-service, expliquer comment un tableau embarqué reste isolé, et mettre en œuvre une sécurité par ligne.

### 2. Connaissances essentielles

#### Définition

- **Agrégat matérialisé** : résultat agrégé calculé à l'avance, stocké, et mis à jour selon une stratégie de rafraîchissement.
- **Analytique en libre-service** : capacité, pour des utilisateurs non techniciens, d'explorer et de composer des analyses sur un modèle gouverné.
- **Analytique embarquée** : analytique intégrée dans l'interface du produit, au service des utilisateurs finaux des tenants.
- **Sécurité par ligne** : restriction des lignes visibles pour chaque personne, appliquée dans la couche de données ou la couche sémantique.

#### Idées fondamentales

1. **Un agrégat échange fraîcheur contre vitesse.** Il est toujours en retard sur la source.
2. **Un agrégat porte les mêmes frontières que la source.** Le tenant et les droits y figurent.
3. **Le libre-service s'exerce sur un modèle gouverné.** Pas sur des tables brutes.
4. **Des garde-fous protègent la plateforme.** Limites de lignes, de durée et de coût.
5. **L'analytique embarquée est d'abord un problème d'isolation.** Chaque tenant, chaque utilisateur.
6. **La sécurité par ligne s'applique au plus bas niveau possible.** Le plus près de la donnée.
7. **Les petits effectifs identifient.** On masque sous un seuil.

#### Vocabulaire essentiel

- **Rafraîchissement complet, incrémental** (*full refresh*, *incremental refresh*) : recalcul de tout, ou des seules parties modifiées.
- **Cumul** (*rollup*) : agrégat à un niveau plus grossier (jour, mois, année).
- **Garde-fou** (*guardrail*) : limite qui protège la plateforme contre des requêtes trop coûteuses.
- **Jeton d'intégration** (*embed token*) : jeton signé et court qui autorise l'affichage d'un tableau à une personne précise.
- **Politique de ligne** (*row policy*) : règle qui filtre les lignes visibles.
- **Propagation d'identité** (*identity propagation*) : transmission de l'identité de la personne jusqu'à la couche de données.
- **Seuil de petits effectifs** (*small cell threshold*) : effectif minimal en dessous duquel on masque.

#### Relations de cause à effet

- L'agrégat est calculé sur tous les tenants puis filtré à l'affichage : une erreur de filtre expose des totaux d'autres tenants.
- Le libre-service lit les tables brutes : chaque personne redéfinit les indicateurs, et les chiffres divergent.
- Aucune limite de requête : une exploration mal formée occupe l'entrepôt pendant des heures.
- Le jeton d'intégration est valable des jours et porte des droits larges : sa fuite expose un tenant.
- L'identité est perdue par le pool de connexions : la politique de ligne s'applique à un utilisateur unique, ou à aucun.

#### Idées reçues

- **« Un agrégat est toujours à jour. »** Non. Il l'est à son dernier rafraîchissement.
- **« La sécurité par ligne dans l'interface suffit. »** Non. Elle se met au plus bas niveau, car une autre voie d'accès la contourne.
- **« Le libre-service veut dire sans règle. »** Non. Il s'appuie sur des définitions certifiées, avec des garde-fous.

#### Principe clé

Les agrégats accélèrent, le libre-service et l'embarqué multiplient les chemins d'accès, et la sécurité par ligne, au plus bas niveau, garantit que chaque chemin voit les mêmes frontières.

#### Si vous ne retenez que trois choses

1. Un agrégat est un résultat stocké et en retard, rafraîchi selon une stratégie qui se choisit par usage.
2. Libre-service et embarqué reposent sur un modèle gouverné, des garde-fous et des jetons d'intégration courts.
3. La sécurité par ligne se pose dans la couche de données, avec l'identité propagée, et un refus par défaut.

### 3. Explication technique détaillée

#### Agrégats matérialisés

Un agrégat résout une question fréquente à l'avance.

```sql
CREATE MATERIALIZED VIEW mv_findings_by_base_month AS
SELECT tenant_id,
       base,
       date_trunc('month', opened_at) AS month,
       count(*) AS findings_opened,
       count(*) FILTER (WHERE severity = 'critical') AS critical_opened
  FROM analytics.finding_current
 GROUP BY tenant_id, base, date_trunc('month', opened_at);

CREATE UNIQUE INDEX mv_findings_by_base_month_pk
  ON mv_findings_by_base_month (tenant_id, base, month);

REFRESH MATERIALIZED VIEW CONCURRENTLY mv_findings_by_base_month;
```

La documentation d'une base de données relationnelle courante précise le comportement du rafraîchissement : la commande remplace tout le contenu de la vue ; avec l'option `CONCURRENTLY`, les lectures ne sont pas bloquées, à condition que la vue ait au moins un index unique portant sur des colonnes simples ; un seul rafraîchissement peut s'exécuter à la fois pour une vue donnée. Le rafraîchissement est donc **complet** : pour un recalcul incrémental, on tient ses propres tables d'agrégats, mises à jour par les changements.

| Stratégie | Principe | Atouts | Limites |
|---|---|---|---|
| Rafraîchissement complet périodique | Recalcul de tout à intervalle fixe | Simple, fiable | Coût proportionnel au volume ; retard de l'intervalle |
| Incrémental par partitions | Recalcul des seules périodes modifiées | Efficace sur de gros historiques | Détection des périodes touchées, corrections tardives |
| Mise à jour par événements | Compteurs ajustés à chaque changement | Frais, quasi temps réel | Complexe ; dérive possible, à réconcilier |

**Granularité et cumuls.** On stocke l'agrégat au grain le plus fin utile (jour, base, gravité), puis on cumule (mois, année) à partir de lui. On ne recalcule pas un total par addition de moyennes : on stocke des sommes et des effectifs.

**Tenant.** L'agrégat porte `tenant_id` dans son grain. Un agrégat calculé tous tenants confondus, puis filtré, ne tient que par le filtre : on agrège par tenant et l'on filtre par tenant, deux fois. Le décalage de définition (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) impose de recalculer l'agrégat quand l'indicateur change.

#### Libre-service gouverné

| Principe | Mise en œuvre |
|---|---|
| Des sources certifiées | L'explorateur ne montre que les modèles et indicateurs de la couche sémantique (voir [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique)) |
| Des garde-fous | Limites de lignes, de durée, d'octets lus, de concurrence par tenant |
| Un coût visible | Estimation avant exécution pour les grosses requêtes |
| Des indicateurs personnels distincts | Un calcul personnel est étiqueté « non certifié » |
| Le partage contrôlé | Qui voit quelle analyse, avec quels droits de lecture |

```json
{
  "self_service": {
    "sources": ["semantic:findings", "semantic:tasks"],
    "guardrails": {
      "max_rows_returned": 50000,
      "max_query_seconds": 30,
      "max_scanned_bytes": 5000000000,
      "max_concurrent_queries_per_tenant": 4
    },
    "certified_only_for_sharing": true,
    "export_requires_permission": "analytics.export"
  }
}
```

Les garde-fous protègent les autres tenants (voir [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) : une exploration mal formée ne doit pas saturer l'entrepôt. Une file équitable par tenant, avec des classes de priorité, répartit la capacité.

#### Analytique embarquée

Elle s'intègre dans l'interface du produit. Le point critique est l'isolation : la personne ne doit voir que son tenant, et dans le tenant, que son périmètre.

| Sujet | Règle |
|---|---|
| Authentification | La plateforme émet un **jeton d'intégration** signé, de courte durée, pour une personne et un tableau |
| Portée | Le jeton porte le tenant, les rôles et les filtres imposés ; le navigateur ne peut pas les changer |
| Durée | Quelques minutes ; renouvelée par la session |
| Apparence | Thème du produit, langue et formats de la personne (voir [25.1 Internationalisation, localisation et étiquettes de langue](25-experiences-multi-contextes.md#251-internationalisation-localisation-et-étiquettes-de-langue)) |
| Quotas | Requêtes, concurrence et volume par tenant |
| Surface | Intégration par cadre ou par composants ; les deux respectent le jeton |

```json
{
  "iss": "platform",
  "aud": "analytics-embed",
  "sub": "usr_sophie",
  "tenant_id": "ten_airline_01",
  "roles": ["quality_manager"],
  "dashboard": "dash_quality",
  "filters": { "base": ["LYS", "TLS"] },
  "exp": 1791973800
}
```

*Le contenu est un exemple de revendications ; `exp` est une date en secondes depuis 1970.* La plateforme **signe** le jeton ; la couche d'analyse **vérifie** la signature et **impose** les filtres, quel que soit ce que demande le navigateur (voir [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)).

#### Sécurité par ligne dans l'analytique

La sécurité par ligne limite les lignes visibles de chaque personne. On la pose au plus bas niveau possible : la base analytique elle-même, sinon la couche sémantique.

La documentation d'une base relationnelle courante décrit le mécanisme : on active la sécurité par ligne sur la table ; des **politiques** définissent, par condition `USING`, les lignes visibles et, par `WITH CHECK`, les lignes que l'on peut écrire ; quand elle est activée et qu'aucune politique ne s'applique, aucune ligne n'est visible (refus par défaut) ; les superutilisateurs et les rôles à contournement l'ignorent, et le propriétaire de la table aussi, sauf si l'on force son application.

```sql
ALTER TABLE fact_finding ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_finding FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON fact_finding
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

BEGIN;
SET LOCAL app.tenant_id = 'a3f5a1de-5a0e-4c0b-9a3b-3c0d1b7e5a10';
SELECT base, count(*) FROM fact_finding GROUP BY base;
COMMIT;
```

La requête de lecture déclare le tenant par un paramètre de session limité à la transaction (`SET LOCAL`). La politique le lit. Si le paramètre n'est pas défini, la lecture échoue : le système **échoue fermé**.

| Point d'attention | Règle |
|---|---|
| Propagation d'identité | Le paramètre se fixe à chaque transaction, y compris avec un pool de connexions partagé |
| Rôle applicatif | Ne pas utiliser un rôle propriétaire ou à contournement pour les requêtes des utilisateurs |
| Politiques simples | La documentation recommande des politiques qui ne dépendent que des valeurs de la ligne courante : plus simples, plus rapides, sans les conditions de course des sous-requêtes |
| Fuites indirectes | Les contraintes d'intégrité (unicité, clés étrangères) ignorent la sécurité par ligne et peuvent créer des canaux auxiliaires |
| Fonctions | Les fonctions appliquées à des lignes non encore filtrées doivent être inoffensives (`LEAKPROOF`) |
| Agrégats | La sécurité par ligne s'applique aux lignes de la table sur laquelle on la pose : un agrégat se pose sur une table d'agrégats avec ses propres politiques, par tenant |

**Petits effectifs.** Un compte de 1 ou 2 sur une population restreinte peut identifier une personne (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)). On masque ou on regroupe en dessous d'un seuil (par exemple 5, valeur d'exemple), et l'on empêche de contourner le seuil par différence entre deux requêtes proches.

#### Dans la couche sémantique

Quand l'outil d'analyse ne permet pas la politique dans la base, la couche sémantique ajoute le filtre à chaque requête générée, avec les mêmes règles : le tenant et le périmètre de la personne sont ajoutés par la couche, pas par l'interface. C'est moins sûr (un accès direct à la base la contourne) : la base reste refermée aux accès directs.

#### Modes de défaillance

- **Filtre de tenant ou de ligne seulement dans l'interface.**
- **Identité perdue** dans le pool de connexions.
- **Rôle propriétaire** utilisé par l'application : politique ignorée.
- **Agrégat tous tenants** consulté par un tenant.
- **Jeton d'intégration trop durable** ou aux droits larges.
- **Requêtes sans limite** : saturation de l'entrepôt.
- **Petits effectifs exposés** par contournement du seuil.

**Contre-exemple.** Un tableau embarqué reçoit dans l'URL le paramètre `tenant=ten_airline_01`, que l'entrepôt utilise tel quel. Un utilisateur remplace la valeur et voit les données d'un autre tenant. Le tenant doit venir d'un jeton signé par la plateforme, et la politique de ligne doit le vérifier.

**Limites.** La sécurité par ligne coûte en performance, car la condition s'ajoute à chaque requête. Elle ne protège pas les colonnes : le masquage par colonne est un autre mécanisme (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)). Les agrégats précalculés figent des définitions : les redéfinitions demandent un recalcul.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | L'entrepôt héberge les agrégats et applique la politique de ligne |
| [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique) | La couche sémantique fournit les modèles et les indicateurs gouvernés |
| [19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport) | Les rapports planifiés lisent agrégats et modèles avec les mêmes droits |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | La fraîcheur et les définitions s'appliquent aux agrégats |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits au niveau ligne et champ sont ceux du reste de la plateforme |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation du tenant s'étend à l'analytique |
| [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord) | Les tableaux de bord, avec seuils de petits effectifs, sont la face visible |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites de concurrence et les files équitables protègent l'entrepôt |

### 5. Application pratique

**Situation initiale.** Alpha Air veut montrer à ses bases un tableau qualité dans l'application, et laisser les responsables composer leurs vues. Le tableau actuel calcule tout à chaque affichage et ne distingue pas les bases.

**Problème.** Lenteur, absence de libre-service gouverné et de sécurité par ligne.

**Application du concept.** La plateforme introduit des agrégats, un explorateur borné, un jeton d'intégration et une politique de ligne.

**Déroulé.**

1. Les constats par base, gravité et mois sont matérialisés et rafraîchis chaque quart d'heure.
2. Les responsables composent leurs vues dans un explorateur limité aux indicateurs certifiés, avec plafonds de lignes et de durée.
3. La plateforme émet pour chaque session un jeton d'intégration de 10 minutes, qui porte le tenant et les bases autorisées.
4. L'entrepôt applique une politique de ligne : tenant, puis base.
5. Les petits effectifs (moins de 5) sont regroupés dans « autres ».

**Résultat.** Les tableaux s'affichent en moins d'une seconde, chacun voit son périmètre, et l'exploration ne perturbe pas les autres tenants.

**Limites.** Les agrégats ont jusqu'à 15 minutes de retard : l'heure de mise à jour est affichée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un agrégat matérialisé est-il toujours en retard sur la source ?
2. **Compréhension.** Quels garde-fous protègent la plateforme d'un libre-service ?
3. **Compréhension.** Que porte un jeton d'intégration, et pourquoi est-il court ?
4. **Pourquoi.** Pourquoi pose-t-on la sécurité par ligne dans la couche de données plutôt que dans l'interface ?
5. **Raisonnement pratique.** Une politique de ligne lit `current_setting('app.tenant_id')`. Que se passe-t-il si l'application oublie de fixer ce paramètre, et pourquoi est-ce souhaitable ?

#### Réponses

1. Parce qu'il est calculé à un instant, puis stocké : il ne reflète pas les changements survenus depuis son dernier rafraîchissement.
2. Des limites de lignes renvoyées, de durée, d'octets lus et de concurrence par tenant, un coût estimé avant exécution, et des sources limitées à la couche sémantique certifiée.
3. Le tenant, la personne, ses rôles, le tableau autorisé et les filtres imposés, signés par la plateforme. Il est court pour limiter ce qu'une fuite permet.
4. Parce qu'une autre voie d'accès (API, export, outil externe) contournerait une règle posée dans l'interface. Au plus bas niveau, la règle s'applique à tous les chemins.
5. La lecture échoue, car le paramètre n'est pas défini : le système échoue fermé. C'est souhaitable : un oubli produit une erreur visible plutôt qu'une fuite silencieuse.

## 19.10 Générateur de rapports, rapports planifiés et instantanés de rapport

### 1. Comprendre simplement

Le **générateur de rapports** (*report builder*) est l'outil par lequel une personne compose un rapport : source de données, champs, filtres, regroupements, mise en page. Un **rapport planifié** (*scheduled report*) est un rapport exécuté automatiquement à intervalles réguliers et remis à des destinataires. Un **instantané de rapport** (*report snapshot*) est le résultat figé d'une exécution : le document, avec le contexte qui permet de l'expliquer.

**Pourquoi cela existe.** Un tableau de bord sert à surveiller et à orienter ; un rapport sert à analyser en détail et à prouver (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)). Des obligations sont récurrentes : une revue qualité chaque lundi, un état réglementaire chaque mois. Les personnes ne veulent pas se connecter pour obtenir le même rapport chaque semaine, et il faut pouvoir montrer plus tard ce qui a été remis.

**Problème résolu.** Produire, distribuer et conserver des rapports à la demande ou récurrents, sans développement, avec les bons droits et une trace de ce qui a été diffusé.

**Modèle mental.** Un journal quotidien : une rubrique définie (la définition du rapport), une parution à heure fixe (la planification) et des exemplaires archivés (les instantanés).

**Où l'analogie s'arrête.** Un journal est identique pour tous ses lecteurs. Un rapport peut différer par destinataire, parce que chacun n'a pas les mêmes droits. Et un exemplaire archivé doit pouvoir être expliqué : définition, date de référence, fraîcheur des données.

**Exemple.** Sophie compose « Constats par base et par gravité » dans le générateur. Elle la planifie chaque lundi à 7 h, heure de Paris, pour le rôle `quality_manager`. Chaque lundi, la plateforme génère un PDF par destinataire, limité à ses bases. Elle l'enregistre comme instantané, avec la version de la définition, la date de référence, la fraîcheur et le nombre de lignes, puis envoie un lien valable 14 jours.

**Les composants.**

1. la **définition du rapport**, versionnée ;
2. le **générateur**, avec ses garde-fous ;
3. la **planification**, dans un fuseau horaire ;
4. l'**exécution** : file, droits, idempotence ;
5. la **remise** : canal, lien, format ;
6. l'**instantané** conservé ;
7. l'**historique des exécutions**.

**Objectif d'apprentissage :** vous pouvez décrire la définition d'un rapport, expliquer comment une planification gère les fuseaux et les changements d'heure, et dire pourquoi l'instantané d'une exécution est la pièce qui fait foi.

### 2. Connaissances essentielles

#### Définition

- **Générateur de rapports** : outil qui permet de composer, prévisualiser et enregistrer la définition d'un rapport à partir de sources gouvernées.
- **Rapport planifié** : rapport dont l'exécution et la remise sont déclenchées par un calendrier récurrent.
- **Instantané de rapport** : résultat figé d'une exécution, conservé avec les paramètres, la version de définition, la date de référence et la fraîcheur des données.

#### Idées fondamentales

1. **Un rapport est une définition versionnée.** Pas une requête libre enregistrée.
2. **Il s'exécute avec des droits explicites.** Par défaut, ceux du destinataire.
3. **Une planification s'exprime dans un fuseau horaire.** Pas en UTC.
4. **Une exécution est idempotente.** Par créneau et par destinataire.
5. **L'instantané fait foi.** On ne rejoue pas un rapport pour prouver ce qui a été remis.
6. **Un lien contrôlé vaut mieux qu'une pièce jointe.** Le fichier reste sous contrôle.
7. **Les pointes s'étalent.** Tous les rapports du lundi 7 h ne partent pas à la même seconde.

#### Vocabulaire essentiel

- **Définition de rapport** (*report definition*) : description complète : source, colonnes, filtres, paramètres, mise en page.
- **Paramètre** (*parameter*) : valeur choisie à l'exécution, par exemple une date de référence.
- **Exécution** (*run*) : une production du rapport.
- **Créneau** (*time slot*) : instant planifié pour une exécution.
- **Diffusion personnalisée** (*bursting*) : production d'une version par destinataire, avec ses droits.
- **Exécuter en tant que** (*run as*) : identité dont les droits s'appliquent à l'exécution.
- **Fuseau horaire** (*time zone*) : règle de conversion entre l'heure locale et l'heure universelle, selon la base de fuseaux de l'IANA.

#### Relations de cause à effet

- Le rapport s'exécute avec les droits de son auteur et part chez des destinataires aux droits plus faibles : il leur révèle ce qu'ils ne peuvent pas voir.
- La planification est en UTC : le rapport « de 7 h » arrive à 8 h l'hiver et à 9 h l'été, à Paris.
- Aucune clé d'idempotence : une reprise après panne envoie le rapport deux fois.
- Aucun instantané : à l'audit, on ne sait plus ce qui a été remis le 3 mars.
- Tous les rapports partent à 7 h 00 : pic de charge, retard général.

#### Idées reçues

- **« Un rapport planifié est un tableau de bord envoyé par courriel. »** Non. Un tableau de bord est vivant ; un rapport planifié est un document daté, conservé.
- **« Envoyer en pièce jointe est plus simple. »** Plus simple, mais le fichier sort du contrôle : transfert, conservation chez des tiers, aucune révocation.
- **« Rejouer le rapport redonne le même résultat. »** Non. Les données se corrigent, les définitions évoluent, la date change.

#### Principe clé

Un rapport est une définition versionnée, exécutée avec des droits explicites, à un créneau local, et dont chaque exécution laisse un instantané qui fait foi.

#### Si vous ne retenez que trois choses

1. Un rapport est une définition versionnée, exécutée avec les droits du destinataire.
2. La planification se calcule dans un fuseau horaire, et chaque exécution est idempotente par créneau.
3. L'instantané conservé est la preuve de ce qui a été remis ; on ne rejoue pas pour prouver.

### 3. Explication technique détaillée

#### La définition d'un rapport

```json
{
  "report_id": "rpt_findings_by_base",
  "version": 4,
  "title": "Constats par base et par gravité",
  "source": "semantic:findings",
  "columns": [
    { "field": "base", "role": "group" },
    { "field": "severity", "role": "group" },
    { "metric": "findings_open", "role": "value" }
  ],
  "filters": [
    { "field": "opened_date", "op": "within_last", "value": { "months": 12 } }
  ],
  "parameters": [
    { "name": "as_of", "type": "date", "default": "today" }
  ],
  "layout": { "format": "pdf", "orientation": "landscape", "page_numbers": true },
  "limits": { "max_rows": 20000 }
}
```

La source est un modèle de la couche sémantique ([19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique)), pas une table brute : les indicateurs ont leur définition unique, et les droits par ligne s'appliquent ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)). La définition est une **configuration** : brouillon, prévisualisation, publication, versions (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

**Garde-fous du générateur.**

- sources limitées aux modèles certifiés ;
- prévisualisation sur un échantillon, avec limite de lignes ;
- filtre de période obligatoire pour les grands volumes ;
- estimation du coût avant planification ;
- droits de modification et de partage de la définition ;
- indication claire des paramètres et de la date de référence.

#### La planification

```json
{
  "report_id": "rpt_findings_by_base",
  "definition_version": 4,
  "schedule": {
    "frequency": "weekly",
    "day_of_week": "monday",
    "time": "07:00",
    "timezone": "Europe/Paris",
    "jitter_minutes": 20
  },
  "recipients": [{ "kind": "role", "value": "quality_manager" }],
  "delivery": { "channel": "link", "format": "pdf", "expires_in_days": 14 },
  "send_if": { "rows_at_least": 1 },
  "run_as": "recipient"
}
```

**Fuseaux et changements d'heure.** Une planification s'exprime en heure locale et dans un fuseau nommé de la base de fuseaux de l'IANA, qui consigne les évolutions de l'heure locale et se met à jour à mesure des décisions politiques. Si l'on exprimait « 7 h » en UTC, l'heure locale changerait à chaque passage heure d'été et heure d'hiver : à Paris, 7 h UTC valent 8 h l'hiver et 9 h l'été.

| Cas | Exemple (Paris, 2026) | Règle |
|---|---|---|
| Heure locale ordinaire | Lundi 7 h 00 | Convertir en instant UTC avec les règles du fuseau à cette date |
| Heure locale inexistante | Dimanche 29 mars, 2 h 30 : les horloges passent de 2 h à 3 h | Politique explicite : exécuter à la première heure valide suivante, ou sauter |
| Heure locale ambiguë | Dimanche 25 octobre, 2 h 30 : les horloges reculent de 3 h à 2 h | Exécuter une seule fois, à la première occurrence |

Ces transitions ont été relevées avec la base de fuseaux de la machine d'écriture : à Paris, l'heure d'été commence le 29 mars 2026 à 01 h 00 UTC (de 2 h à 3 h locales) et se termine le 25 octobre 2026 à 01 h 00 UTC (de 3 h à 2 h locales). Un rapport planifié à 2 h 30 locale ce jour-là serait inexistant au printemps, ambigu à l'automne : on évite ces heures pour les rapports, ou l'on applique la règle explicite.

#### L'exécution

```sql
CREATE TABLE report_run (
  tenant_id           uuid        NOT NULL,
  id                  uuid        NOT NULL,
  report_id           text        NOT NULL,
  definition_version  integer     NOT NULL,
  parameters          jsonb       NOT NULL,
  scheduled_for       timestamptz,
  started_at          timestamptz NOT NULL,
  finished_at         timestamptz,
  status              text        NOT NULL CHECK (status IN ('queued','running','succeeded','failed','skipped')),
  as_of               timestamptz NOT NULL,
  data_freshness      timestamptz,
  row_count           bigint,
  file_id             uuid,
  run_as              uuid        NOT NULL,
  idempotency_key     text        NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, idempotency_key)
);
```

- **Idempotence.** La clé d'idempotence combine le rapport, le créneau et le destinataire (`rpt_findings_by_base|2026-10-19T05:00Z|usr_sophie`). Une reprise après panne retrouve la même clé et ne produit pas de second envoi (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) et [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).
- **File.** Les exécutions passent par la file de tâches de fond ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)), avec files équitables par tenant et classes de priorité ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)). Le **jitter** étale les départs dans une fenêtre pour éviter le pic de 7 h 00.
- **Conditions.** `send_if` évite d'envoyer un rapport vide : l'exécution est marquée `skipped`.
- **Échecs.** Nouvelles tentatives bornées, alerte au propriétaire et trace dans l'historique.

#### Quels droits à l'exécution

| Mode | Principe | Risque |
|---|---|---|
| En tant que destinataire (diffusion personnalisée) | Une exécution par destinataire, avec ses droits | Coût multiplié par le nombre de destinataires |
| En tant que propriétaire | Une exécution avec les droits de l'auteur | Fuite vers des destinataires aux droits plus faibles |
| Compte de service à périmètre fixe | Droits figés, documentés | Dérive du périmètre ; doit être explicite |

Le mode par défaut est **le destinataire** : les politiques de ligne de la couche de données ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)) filtrent chaque exécution. L'exécution avec les droits du propriétaire se réserve à des destinataires dont les droits sont au moins équivalents, vérifiés à la planification et à chaque exécution.

#### La remise

| Mode | Atouts | Limites |
|---|---|---|
| Lien vers l'instantané (voir [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)) | Droits vérifiés à l'ouverture, expiration, journal d'accès, révocation | Demande une connexion ou une vérification |
| Pièce jointe | Simple, utilisable hors ligne | Le fichier sort du contrôle : transfert, conservation chez des tiers, aucune révocation |
| Page dans l'application | Toujours à jour | Pas de pièce datée |
| Interface de programmation ou webhook | Intégration à d'autres systèmes | Droits et fiabilité à la charge du consommateur |

Le message qui annonce le rapport est une notification de service (voir [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires), [17.4 Adaptateurs de canal et statut de livraison](17-collaboration-communication-travail.md#174-adaptateurs-de-canal-et-statut-de-livraison) et [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages)), avec un lien, plutôt qu'un contenu. Pour des destinataires externes, le partage suit les règles de [18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane).

#### L'instantané

Le résultat d'une exécution est enregistré comme **fichier** (voir [18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)), avec ses métadonnées de contexte :

| Élément | Rôle |
|---|---|
| Définition et version | Savoir ce qui a été demandé |
| Paramètres et date de référence | Savoir pour quelle date |
| Fraîcheur des données | Savoir jusqu'à quand les données étaient à jour |
| Nombre de lignes et empreinte | Détecter une altération |
| Identité d'exécution | Savoir avec quels droits |
| Classe de conservation | Durée de garde (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) |

L'instantané est **immuable**. Il se rattache à l'exécution par `file_id`, se lit par le contrôle de téléchargement de [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants), et peut être signé quand le rapport est un document réglementaire ([18.9 Signature électronique](18-fichiers-documents-contenus.md#189-signature-électronique)).

**Rejouer n'est pas retrouver.** Relancer aujourd'hui la définition du 3 mars avec la date du 3 mars peut donner un résultat différent : des corrections ont été saisies, une définition d'indicateur a changé, une dimension a évolué. C'est l'instantané, pas la relance, qui prouve ce qui a été remis (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)).

#### Modes de défaillance

- **Exécution avec des droits trop larges** : fuite vers les destinataires.
- **Heure UTC** : rapport qui dérive d'une heure deux fois par an.
- **Heure inexistante ou ambiguë** : rapport sauté ou envoyé deux fois.
- **Pas d'idempotence** : doublons après reprise.
- **Pic de lundi** : saturation de l'entrepôt et retards.
- **Pas d'instantané** : impossible de dire ce qui a été remis.
- **Pièce jointe hors contrôle.**

**Contre-exemple.** La directrice technique planifie un rapport avec ses propres droits et ajoute en destinataire un prestataire externe. Le rapport contient des données de toutes les bases. Il part en pièce jointe et n'est conservé nulle part. Six mois plus tard, personne ne peut dire ce qu'il contenait ni qui l'a reçu.

**Limites.** Un rapport planifié suppose des données prêtes à l'heure : la planification doit tenir compte de la fraîcheur de l'entrepôt (voir [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) et [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)). Une mise en page de qualité d'impression pour des rapports complexes demande des modèles de document (voir [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents)). Et l'envoi à de nombreux destinataires multiplie les exécutions : on le dimensionne.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique) | La définition s'appuie sur les modèles et indicateurs gouvernés |
| [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne) | Les droits par ligne s'appliquent à chaque exécution |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | Formats, définitions versionnées, date de référence et fraîcheur |
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | L'instantané est un fichier stocké et empreinté |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | La remise par lien et le contrôle de téléchargement |
| [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents) | La mise en page d'un rapport formel s'appuie sur un modèle de document |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les exécutions sont des tâches planifiées et de fond |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | La notification annonce le rapport |
| [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord) | Le tableau de bord surveille ; le rapport prouve |

### 5. Application pratique

**Situation initiale.** Chaque lundi matin, un planificateur d'Alpha Air extrait les constats par base, les copie dans un tableur et l'envoie par courriel. Les chiffres varient d'une semaine à l'autre selon l'heure de l'extraction, et personne ne conserve l'envoi.

**Problème.** Un rapport manuel, sans définition, sans droits clairs, sans trace.

**Application du concept.** La plateforme introduit un rapport défini dans le générateur, planifié, remis par lien, avec instantané.

**Déroulé.**

1. Sophie compose le rapport à partir du modèle certifié « constats », avec la mesure `findings_open`.
2. Elle le planifie le lundi à 7 h, heure de Paris, pour le rôle `quality_manager`, en exécution par destinataire.
3. Chaque lundi, chaque destinataire reçoit une notification avec un lien vers son PDF, valable 14 jours.
4. Chaque exécution est enregistrée : version 4, date de référence, fraîcheur de l'entrepôt, 312 lignes.
5. En novembre, l'auditeur demande le rapport du 19 octobre : la plateforme présente l'instantané.

**Résultat.** Le rapport est homogène, remis sous contrôle, et prouvable.

**Limites.** Le lien de 14 jours expire : au-delà, le rapport reste accessible depuis l'historique, avec les droits du moment.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la planification d'un rapport s'exprime-t-elle dans un fuseau horaire plutôt qu'en UTC ?
2. **Compréhension.** Qu'est-ce que la diffusion personnalisée, et quel problème règle-t-elle ?
3. **Compréhension.** Que contient un instantané de rapport, au-delà du document ?
4. **Pourquoi.** Pourquoi une clé d'idempotence est-elle nécessaire pour un rapport planifié ?
5. **Raisonnement pratique.** Un rapport est planifié le dimanche 25 octobre 2026 à 2 h 30, heure de Paris. Combien de fois cette heure locale existe-t-elle ce jour-là, et quelle règle appliquer ?

#### Réponses

1. Parce que les personnes attendent un rapport à une heure locale. En UTC, l'heure locale se décale d'une heure à chaque changement d'heure.
2. C'est la production d'une version du rapport par destinataire, avec ses propres droits. Elle évite qu'un rapport exécuté avec les droits de l'auteur révèle à d'autres ce qu'ils ne peuvent pas voir.
3. La version de la définition, les paramètres, la date de référence, la fraîcheur des données, le nombre de lignes, l'empreinte, l'identité d'exécution et la classe de conservation.
4. Parce qu'une exécution peut être reprise après une panne. Sans clé par rapport, créneau et destinataire, la reprise produit un second envoi.
5. Deux fois : les horloges reculent de 3 h à 2 h, donc 2 h 30 se produit à 00 h 30 UTC puis à 01 h 30 UTC. On exécute une seule fois, à la première occurrence, ou l'on évite cette heure.

## 19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres

### 1. Comprendre simplement

Un **format d'export** (*export format*) est la forme sous laquelle des données ou un rapport sortent de la plateforme : CSV, tableur, JSON, PDF. La **gouvernance des définitions d'indicateurs** (*metric definition governance*) regroupe les règles qui contrôlent la création, la modification, l'approbation et le retrait d'une définition d'indicateur. La **reproductibilité d'un chiffre à une date** (*figure reproducibility (as-of)*) est la capacité de retrouver exactement le chiffre publié à une date donnée. L'**objectif de fraîcheur des données** (*data freshness objective*) est le retard maximal toléré entre la réalité et le chiffre affiché.

**Pourquoi cela existe.** Un chiffre sort de la plateforme et vit sa vie : dans un tableur, un rapport, une présentation. Plus tard, quelqu'un demande : « d'où vient ce 128 ? pourquoi vaut-il 126 aujourd'hui ? ». Sans définition gouvernée, sans date de référence et sans fraîcheur connue, on ne sait pas répondre, et la confiance disparaît.

**Problème résolu.** Faire sortir des chiffres que l'on peut expliquer, retrouver et défendre : on sait ce qu'ils mesurent, pour quelle date, avec quelle fraîcheur, et sous quelle forme ils circulent.

**Modèle mental.** Une publication comptable : des chiffres arrêtés à une date, avec la méthode appliquée, une note sur le périmètre, et la possibilité de montrer, des années plus tard, ce qui était connu à l'arrêté.

**Où l'analogie s'arrête.** Une publication comptable est faite une fois par an, par une équipe. Dans une plateforme, des milliers de chiffres sont produits en continu, par des personnes différentes, et des corrections arrivent après coup.

**Exemple.** Le rapport mensuel du 1er octobre annonce 128 constats ouverts au 30 septembre. Le 5 octobre, une clôture saisie tardivement rectifie : 126 au 30 septembre. Le rapport du 1er octobre reste à 128, puisque c'est un instantané. La plateforme sait recalculer « au 30 septembre, tel que connu le 1er octobre » (128) et « tel que connu le 5 octobre » (126). Chaque chiffre porte sa définition (version 3) et sa fraîcheur.

**Les composants.**

1. les **formats d'export** et leurs règles ;
2. la **définition d'indicateur** versionnée, avec propriétaire ;
3. le **processus de changement** : proposition, revue, approbation, date d'effet ;
4. le **modèle temporel** : date de validité et date d'enregistrement ;
5. les **instantanés** des chiffres officiels ;
6. l'**objectif de fraîcheur**, sa mesure et son affichage ;
7. l'**étiquetage** de chaque chiffre : définition, date de référence, fraîcheur.

**Objectif d'apprentissage :** vous pouvez choisir un format d'export et ses précautions, décrire le cycle de vie d'une définition d'indicateur, et expliquer comment retrouver un chiffre « tel que connu à telle date ».

### 2. Connaissances essentielles

#### Définition

- **Format d'export** : représentation dans laquelle des données ou un document sortent de la plateforme, choisie selon le consommateur.
- **Gouvernance des définitions d'indicateurs** : cadre qui attribue un propriétaire à chaque indicateur et contrôle ses changements par versions, revue, approbation et date d'effet.
- **Reproductibilité d'un chiffre (as-of)** : propriété d'un chiffre dont on peut retrouver la valeur publiée, à partir de la version de définition, des données connues à la date, des paramètres et du moteur utilisé.
- **Objectif de fraîcheur des données** : objectif mesurable sur l'âge maximal des données affichées, exprimé comme un objectif de niveau de service.

#### Idées fondamentales

1. **Le format se choisit selon le consommateur.** Personne, machine ou archive.
2. **Un export respecte les droits.** Il n'est pas une porte dérobée.
3. **Une définition d'indicateur a un propriétaire et une version.** Son changement se gouverne.
4. **Un chiffre a deux dates.** Celle à laquelle il se rapporte, et celle à laquelle on le connaissait.
5. **Les chiffres officiels sont figés.** Une correction se publie comme telle, sans réécrire l'historique.
6. **La fraîcheur est un objectif.** On la mesure, on l'affiche, on alerte.
7. **Chaque chiffre se présente avec sa définition, sa date et sa fraîcheur.**

#### Vocabulaire essentiel

- **CSV** (*comma-separated values*) : format texte de tables, défini de façon informative par le RFC 4180.
- **Injection de formules** (*CSV injection*) : cellule qu'un tableur interprète comme une formule.
- **Date de validité** (*valid time*) : instant auquel un fait est vrai dans la réalité.
- **Date d'enregistrement** (*transaction time*, *recorded time*) : instant auquel le système l'a connu.
- **Rectification** (*restatement*) : correction publiée d'un chiffre déjà diffusé.
- **Clôture de période** (*period close*) : arrêt des écritures d'une période pour figer ses chiffres.
- **Indicateur certifié** (*certified metric*) : indicateur dont la définition a été revue et approuvée.
- **Âge des données** (*data age*) : durée entre la source et le moment de la lecture.

#### Relations de cause à effet

- L'export en CSV contient des cellules commençant par `=` : à l'ouverture, un tableur exécute une formule choisie par un tiers.
- Une définition change sans version : les chiffres historiques et courants ne se comparent plus, sans que personne ne le sache.
- Les corrections écrasent les données sans date d'enregistrement : on ne peut plus dire ce qui était connu le 1er octobre.
- Aucune fraîcheur n'est affichée : une personne décide sur un chiffre vieux de deux jours en le croyant à jour.
- L'objectif de fraîcheur est le même pour tous les usages : trop cher pour le mensuel, trop lâche pour l'opérationnel.

#### Idées reçues

- **« Un export est neutre. »** Non. Il sort des données du contrôle de la plateforme : il applique les droits, les masques et la journalisation.
- **« Le chiffre d'aujourd'hui annule celui d'hier. »** Non. Les deux sont vrais, à leur date de connaissance ; on publie la rectification, on n'efface pas l'ancien.
- **« La fraîcheur est un détail technique. »** Non. C'est une propriété du chiffre que les utilisateurs doivent connaître pour décider.

#### Principe clé

Chaque chiffre qui sort se présente avec sa définition versionnée, sa date de référence et sa fraîcheur ; on peut le retrouver tel qu'il était connu, et les changements de définition se gouvernent.

#### Si vous ne retenez que trois choses

1. Un chiffre porte une définition versionnée, une date de référence et une fraîcheur.
2. On distingue la date à laquelle un fait est vrai et la date à laquelle on l'a connu.
3. Les exports respectent les droits, et se protègent contre l'injection de formules.

### 3. Explication technique détaillée

#### Les formats d'export

| Format | Atouts | Limites | Usage typique |
|---|---|---|---|
| CSV | Universel, lisible, léger | Sans types ; séparateur, encodage et décimales selon la langue ; injection de formules ; norme informative | Échange de tables simples |
| Tableur (XLSX) | Types, onglets, mise en forme | Plus lourd ; formules ; compatibilité entre versions | Analyse par des personnes |
| JSON ou lignes JSON | Structuré, imbriqué | Verbeux ; pas de mise en page | Intégrations et API |
| Parquet | Colonnaire, typé, compressé ; format de fichier ouvert | Illisible sans outil | Analyse de gros volumes |
| PDF | Mise en page fixe, imprimable | Inexploitable par une machine | Documents lus et conservés |

**Le CSV.** Le RFC 4180 est un document informatif de 2005 qui décrit la disposition usuelle des fichiers CSV et enregistre le type de média `text/csv` : ce n'est pas une norme de l'Internet, et les variantes sont nombreuses. Les pièges courants :

- **Encodage** : UTF-8 ; certains tableurs exigent une marque d'ordre des octets pour reconnaître les accents ;
- **Séparateur** : `;` dans de nombreuses langues où la virgule est le séparateur décimal ;
- **Décimales et dates** : on exporte en format machine (point décimal, dates ISO 8601) ou on documente la langue ;
- **Citation** : les champs qui contiennent le séparateur, un guillemet ou un saut de ligne sont entourés de guillemets, avec les guillemets internes doublés.

**Injection de formules.** Un tableur interprète comme une formule une cellule qui commence par certains caractères. La page de référence de l'OWASP cite `=`, `+`, `-`, `@`, la tabulation, le retour chariot et le saut de ligne, ainsi que des variantes pleine chasse. Les mesures qu'elle recommande : qu'aucune cellule ne commence par ces caractères, ou entourer chaque champ de guillemets en préfixant d'une apostrophe, avec une réserve : aucune stratégie unique ne convient à tous les tableurs et consommateurs.

```typescript
const FORMULA_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

function csvCell(value: string): string {
  const needsGuard = value.length > 0 && FORMULA_PREFIXES.has(value[0]);
  const guarded = needsGuard ? `'${value}` : value;
  return `"${guarded.replace(/"/g, '""')}"`;
}
```

Cette fonction s'applique aux champs **texte** saisis par des personnes. Un nombre négatif véritable (`-5`) est exporté comme nombre, sans apostrophe : on distingue les colonnes par type. On vérifie le résultat dans les tableurs que l'on prévoit de soutenir.

**Règles communes à tous les formats.**

- **Droits et masques** : l'export applique les mêmes droits au niveau ressource, champ et ligne que l'écran (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Journalisation** : qui exporte quoi, quand, avec quels filtres (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- **Volume** : les grands exports sont asynchrones : une tâche, un fichier, un lien (voir [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) et [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)).
- **Contexte** : une feuille ou un en-tête indique la définition, la date de référence, la fraîcheur et les filtres.

#### Gouverner les définitions

Un indicateur est une configuration à effet métier : sa définition appartient à quelqu'un, évolue par versions, et ses changements se revoient.

```yaml
metric: findings_open
version: 3
status: certified
owner: quality_manager
definition:
  model: finding_state_history
  measure: count
  filter: "status = 'open'"
  time_semantics: "état à la date de référence"
  grain: finding
valid_from: 2026-07-01
valid_to: null
changes:
  - version: 3
    date: 2026-07-01
    reason: "Les constats en attente de pièce comptent comme ouverts"
    approved_by: [usr_sophie, usr_hugo]
    impact: "Chiffres historiques recalculés : environ +4 %"
```

| Étape | Règle |
|---|---|
| Proposition | Un changement a un motif, un impact estimé, une liste des rapports et tableaux de bord concernés (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)) |
| Revue et approbation | Le propriétaire et un second relecteur approuvent (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) |
| Date d'effet | La nouvelle version s'applique à partir d'une date ; l'ancienne reste disponible |
| Communication | Les destinataires des rapports concernés sont prévenus |
| Recalcul | Les agrégats concernés sont recalculés ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)) ; les chiffres historiques sont marqués « recalculés » ou conservés selon la décision |
| Retrait | Une définition obsolète est dépréciée, puis retirée, avec renvoi vers la nouvelle |

**Niveaux de gouvernance.** Les indicateurs de la plateforme sont verrouillés. Un tenant peut en définir d'autres, ou une variante nommée différemment (« en retard (tenant) ») : on ne redéfinit pas silencieusement un terme de la plateforme (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)). Seuls les indicateurs **certifiés** se partagent hors de l'équipe qui les a créés, ou alimentent des rapports officiels.

#### Retrouver un chiffre à une date

Un chiffre repose sur deux axes de temps.

| Axe | Question | Exemple |
|---|---|---|
| Date de validité | Pour quel jour ce fait est-il vrai ? | Le constat était ouvert le 30 septembre |
| Date d'enregistrement | Quand le système l'a-t-il su ? | La clôture a été saisie le 5 octobre |

On les conserve en historisant les états, avec les deux bornes (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) et [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)).

```sql
SELECT base, count(*) AS open_findings
  FROM finding_state_history h
 WHERE h.tenant_id = $1
   AND h.valid_from  <= $2 AND (h.valid_to      IS NULL OR $2 < h.valid_to)
   AND h.recorded_at <= $3 AND (h.superseded_at IS NULL OR $3 < h.superseded_at)
   AND h.status = 'open'
 GROUP BY base;
```

Le paramètre `$2` est la date de référence (« au 30 septembre »), `$3` la date de connaissance (« tel que connu le 1er octobre »). Avec `$3` au 1er octobre, on retrouve 128 ; au 5 octobre, 126.

| Approche | Principe | Limite |
|---|---|---|
| Instantané du chiffre officiel | On enregistre le résultat publié (voir [19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport)) | Ne répond qu'aux chiffres publiés |
| Historique bitemporel des faits | Les deux dates sont dans les données | Modèle plus lourd |
| Voyage dans le temps de l'entrepôt | Fonction de l'entrepôt pour lire un état passé | Durée limitée, dépend du produit |
| Journal d'événements | On rejoue les événements jusqu'à la date | Coûteux, voir [7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing) |

**Clôture de période.** Pour les chiffres officiels, on clôt la période : les corrections tardives sont enregistrées dans la période courante et signalées comme rectifications, sans réécrire le rapport de la période close.

**Étiqueter.** Chaque chiffre affiché ou exporté porte : le nom et la version de sa définition, la date de référence, la fraîcheur, et, le cas échéant, la mention « rectifié le … » (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### L'objectif de fraîcheur

La fraîcheur est l'âge de la donnée la plus récente incluse dans un chiffre :

$$\text{âge} = t_{\text{lecture}} - \max(t_{\text{validation à la source}})$$

On en fait un objectif de niveau de service (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

```json
{
  "freshness_objectives": [
    { "dataset": "operational_dashboard", "objective_minutes": 15, "target_ratio": 0.95 },
    { "dataset": "monthly_regulatory_report", "objective_minutes": 1440, "target_ratio": 0.99 }
  ],
  "display": "as_of_label",
  "alert_when_breached_for_minutes": 10
}
```

La chaîne est faite d'étapes (source, chargement, transformation, agrégat, cache) : on répartit un budget par étape. Exemple pour un objectif de 15 minutes : chargement 5 minutes, transformation 5 minutes, rafraîchissement de l'agrégat 5 minutes. La mesure se fait par une marque de progression par jeu de données (voir [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)). L'interface affiche « Données au 14/10/2026 06:00 » (voir [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)), et une alerte signale tout dépassement prolongé.

| Usage | Objectif | Raison |
|---|---|---|
| Tableau de bord opérationnel | 15 minutes | Piloter la journée |
| Rapport hebdomadaire | 1 jour | Revue régulière |
| État réglementaire mensuel | Après clôture de période | Exactitude plutôt que rapidité |

Plus la fraîcheur demandée est fine, plus le coût et la complexité augmentent : l'objectif se fixe par usage, pas globalement.

#### Modes de défaillance

- **Export sans droits** : un fichier contient ce que l'écran masque.
- **Injection de formules** non traitée.
- **Définition modifiée sur place.**
- **Corrections qui écrasent l'historique.**
- **Chiffre sans date ni fraîcheur.**
- **Deux versions d'un même indicateur** circulent sous le même nom.
- **Objectif de fraîcheur jamais mesuré.**

**Contre-exemple.** Un indicateur « délai moyen de clôture » est modifié pour exclure les constats mineurs, sans version ni communication. Le mois suivant, le rapport affiche une amélioration de 18 %. La direction applaudit. En réalité, la définition a changé : à définition constante, le délai a augmenté. Il fallait une nouvelle version, une date d'effet et un recalcul de l'historique.

**Limites.** Un modèle bitemporel complet est coûteux : on le réserve aux faits dont la reproductibilité compte. Les corrections rétroactives sont parfois légitimes, et la politique de rectification relève du métier. Les formats d'export ne résolvent pas la qualité des données : un chiffre bien présenté peut rester faux.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | La fraîcheur de l'entrepôt conditionne celle des chiffres |
| [19.8 Modélisation dimensionnelle et couche sémantique](#198-modélisation-dimensionnelle-et-couche-sémantique) | La couche sémantique porte les définitions que l'on gouverne |
| [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne) | Les agrégats se recalculent quand une définition change |
| [19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport) | L'instantané conserve le chiffre officiel et son contexte |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La modélisation temporelle fonde les deux axes de date |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La revue et l'approbation s'appliquent aux changements de définition |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | La fraîcheur est un objectif de niveau de service |
| [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord) | L'affichage de la fraîcheur et de la définition dans les tableaux de bord |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | Expliquer d'où vient un chiffre |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | Les exports volumineux se remettent par lien contrôlé |

### 5. Application pratique

**Situation initiale.** Alpha Air présente chaque mois à son conseil le nombre de constats ouverts. En octobre, le chiffre du mois précédent est contesté : le tableau de bord actuel affiche 126 et le rapport de septembre 128. Personne ne sait si l'un des deux est faux.

**Problème.** Pas de date de connaissance, pas de version de définition, pas d'instantané du rapport.

**Application du concept.** La plateforme étiquette les chiffres, historise les états et gouverne la définition de l'indicateur.

**Déroulé.**

1. La définition de `findings_open` passe en version 3, avec propriétaire, motif, date d'effet et impact documenté.
2. Les états des constats sont historisés avec les deux dates : validité et enregistrement.
3. Le rapport mensuel est enregistré comme instantané, avec la date de référence (30 septembre) et la fraîcheur.
4. Une requête « au 30 septembre, tel que connu le 1er octobre » retrouve 128 ; « tel que connu le 5 octobre » donne 126.
5. Le tableau de bord affiche désormais « Constats ouverts au 30/09, version 3, données au 05/10 06:00 », avec la mention « rectifié ».

**Résultat.** Le désaccord est expliqué : les deux chiffres sont exacts, à deux dates de connaissance différentes.

**Limites.** La rectification doit être communiquée au conseil : la technique l'explique, elle ne remplace pas la décision de la publier.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles précautions s'imposent pour un export CSV ?
2. **Compréhension.** Qu'est-ce que la gouvernance des définitions d'indicateurs, et que contient une définition gouvernée ?
3. **Compréhension.** Quelle différence y a-t-il entre la date de validité et la date d'enregistrement ?
4. **Pourquoi.** Pourquoi un chiffre officiel est-il conservé comme instantané plutôt que recalculé ?
5. **Raisonnement pratique.** Un objectif de fraîcheur de 15 minutes est fixé. Le chargement prend 5 minutes, la transformation 6 et le rafraîchissement 7. L'objectif est-il tenu, et que faire ?

#### Réponses

1. Un encodage et un séparateur adaptés, des guillemets pour les champs spéciaux, un format machine pour les nombres et les dates, la protection contre l'injection de formules, l'application des droits et des masques, et un contexte (définition, date, fraîcheur).
2. L'ensemble des règles qui attribuent un propriétaire à chaque indicateur et contrôlent ses changements par version, revue, approbation et date d'effet. Une définition porte son modèle, sa mesure, son filtre, sa sémantique temporelle, son grain, ses dates de validité et l'historique de ses changements.
3. La date de validité est celle à laquelle le fait est vrai dans la réalité ; la date d'enregistrement est celle à laquelle le système l'a connu. Une correction tardive change la seconde, pas la première.
4. Parce que recalculer avec les données et les définitions d'aujourd'hui peut donner un autre résultat. L'instantané conserve ce qui a été publié, et prouve ce qui a été remis.
5. $5 + 6 + 7 = 18$ minutes, supérieur à 15 : l'objectif n'est pas tenu. On réduit une étape (par exemple un rafraîchissement incrémental), on revoit le budget, ou l'on assouplit l'objectif si l'usage le permet.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Index inversé : dictionnaire et listes | Manning, Raghavan, Schütze, *Introduction to Information Retrieval*, 2008 | [Page du manuel en ligne](https://nlp.stanford.edu/IR-book/html/htmledition/a-first-take-at-building-an-inverted-index-1.html) | 19.1 |
| Paramètres par défaut de BM25 | Apache Lucene, `BM25Similarity`, documentation 9.0.0 | [Javadoc Lucene](https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html) | 19.3 |
| Analyse de texte | Elastic, *Text analysis overview* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-overview.html) | 19.2 |
| Champs texte et mot-clé | Elastic, *Text type family* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html) | 19.1, 19.3 |
| Quasi temps réel et rafraîchissement | Elastic, *Near real-time search* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/near-real-time.html) | 19.1, 19.4 |
| Segmentation en mots | Unicode Standard Annex n° 29, *Unicode Text Segmentation*, révision 49 (2026-09-01) | [unicode.org](https://www.unicode.org/reports/tr29/) | 19.2 |
| Tolérance aux fautes | Elastic, *Common options : Fuzziness* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html) | 19.6 |
| Graphes HNSW | Malkov, Yashunin, *Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs* | [arXiv:1603.09320](https://arxiv.org/abs/1603.09320) | 19.6 |
| Recherche des voisins les plus proches | Elastic, *k-nearest neighbor (kNN) search* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html) | 19.6 |
| Fusion par rangs réciproques | Cormack, Clarke, Büttcher, SIGIR 2009 | Résultats de recherche (résumé, valeur de $k$) ; texte de l'article non lu en entier | 19.6 |
| Reconstitution du texte à partir de plongements | Morris, Kuleshov, Shmatikov, Rush, *Text Embeddings Reveal (Almost) As Much As Text*, 2023 | [arXiv:2310.06816](https://arxiv.org/abs/2310.06816) | 19.6 |
| Filtre de sécurité par identités | Microsoft Learn, *Security filter pattern* (Azure AI Search) | [Microsoft Learn](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search) | 19.5 |
| Alias filtrés | Elastic, *Aliases* | [Documentation Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/aliases.html) | 19.5 |
| OLTP et OLAP | AWS, *The Difference Between OLAP and OLTP* | [Page AWS](https://aws.amazon.com/compare/the-difference-between-olap-and-oltp/) | 19.7 |
| Lac de données et entrepôt | AWS, *What is a Data Lake?* | [Page AWS](https://aws.amazon.com/what-is/data-lake/) | 19.7 |
| Modélisation dimensionnelle | Kimball Group, *Dimensional Modeling Techniques* ; *Design Tip #167* | [Techniques](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/), [Design Tip 167](https://www.kimballgroup.com/2014/06/design-tip-167-complementary-fact-table-types/) | 19.8 |
| Couche sémantique | dbt Labs, *dbt Semantic Layer* | [Documentation dbt](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) | 19.8 |
| Vues matérialisées | PostgreSQL, *REFRESH MATERIALIZED VIEW* | [Documentation PostgreSQL](https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html) | 19.9 |
| Sécurité par ligne | PostgreSQL, *Row Security Policies* (version 18) | [Documentation PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) | 19.9 |
| Fuseaux horaires | IANA, *Time Zone Database* (version 2026e) | [iana.org](https://www.iana.org/time-zones) | 19.10 |
| Format CSV | RFC 4180, octobre 2005, informationnel | [RFC Editor](https://www.rfc-editor.org/info/rfc4180) | 19.11 |
| Injection de formules | OWASP, *CSV Injection* | [OWASP Community](https://community.owasp.org/attacks/CSV_Injection) | 19.11 |
| Format Parquet | Apache Parquet | [parquet.apache.org](https://parquet.apache.org/) | 19.11 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- La forme de l'IDF de BM25 donnée en 19.3 : la documentation Lucene consultée fournit les valeurs par défaut de $k_1$ et de $b$, pas la formule complète ; les formes varient d'un moteur à l'autre.
- Le comportement exact du segmenteur standard d'un moteur donné sur les traits d'union et les apostrophes : on le vérifie avec l'outil d'analyse du moteur.
- La position du filtre par rapport à la recherche approchée dans un produit donné : la page consultée y renvoie vers un autre guide, non lu.
- Le texte intégral de l'article sur la fusion par rangs réciproques : les valeurs citées viennent d'un résumé de recherche.
- Les transitions d'heure d'été à Paris en 2026 : relevées avec la base de fuseaux de la machine d'écriture, non recoupées avec une publication.
- Les ordres de grandeur de performance, de coût, de stockage et de volumes : ce sont des valeurs d'exemple, hors celles attribuées explicitement à une documentation.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; l'analyseur traite en commandes génériques les instructions `REFRESH MATERIALIZED VIEW CONCURRENTLY`, `ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY` et `CREATE POLICY`, dont la syntaxe reprend celle de la documentation consultée. Les extraits TypeScript ont été contrôlés syntaxiquement, et ceux de l'index inversé et de l'analyse de texte ont été exécutés.
