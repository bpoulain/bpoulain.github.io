# Module 27 — Types de données spécialisés

> **Question directrice.** Quels types de champ un moteur générique doit-il offrir en plus du texte, du nombre et de la date, et quelles règles chacun impose-t-il ?

## Présentation du module

**Objectif.** Un moteur de ressources générique propose un catalogue de types de champ ([2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ), [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés), [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)). Les types simples (texte, nombre, date, booléen) sont traités par le parcours ; ceux qui ont leurs propres règles ne le sont pas. Le parcours prend l'objet-valeur `Money` comme exemple ([14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur)), mentionne la géographie et les séries temporelles en passant, et ne dit rien des unités de mesure. Ce module décrit sept familles : les **données géospatiales**, les **séries temporelles**, les **quantités avec unités**, les **montants**, les **identifiants et numéros**, le **texte riche** et les **vocabulaires contrôlés avec les graphes**. Pour chacune, un type n'est pas seulement un format : c'est un **contrat** qui fixe ce que l'on accepte (validation, [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)), comment on compare et on calcule, comment on stocke et on indexe ([2.14 Index](02-donnees-ressources.md#214-index)), et comment on affiche et on échange.

**Prérequis.** Les propriétés et champs ([2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ)), les index ([2.14 Index](02-donnees-ressources.md#214-index)), la validation des données ([2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) et les entités et objets-valeurs ([14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur)). Sont utiles les champs personnalisés ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)), la modélisation temporelle ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)), les formats régionaux ([25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)), le partitionnement ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)) et le calendrier de conservation ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

**Un mot, plusieurs sens.** Quatre mots changent de sens. Un **type** peut désigner le type de champ du moteur, le type SQL d'une colonne ou le type de ressource ([2.2 Type et schéma](02-donnees-ressources.md#22-type-et-schéma)) : ce module traite le premier. Une **série** est une suite de mesures horodatées ([27.2 Séries temporelles, sous-échantillonnage et rétention](#272-séries-temporelles-sous-échantillonnage-et-rétention)) ou une suite de numéros d'un même registre, comme une série de factures ([27.5 Stratégie d'identifiants et numérotation sans trou](#275-stratégie-didentifiants-et-numérotation-sans-trou)). Une **quantité** est ici une grandeur mesurée avec son unité, et non un nombre d'articles. Un **index** est la structure d'accélération des requêtes ([2.14 Index](02-donnees-ressources.md#214-index)), et non l'index inversé de la recherche ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé)).

**Ordre retenu.** Trois groupes : mesurer et situer, compter et identifier, décrire et relier.

```text
Mesurer et situer      géospatial ─ séries temporelles ─ quantités et unités
Compter et identifier  montants et arrondis ─ identifiants et numérotation sans trou
Décrire et relier      texte riche ─ vocabulaires contrôlés et graphe de propriétés
```

| Groupe | Question de l'équipe |
|---|---|
| Mesurer et situer | Comment stocker, comparer et interroger des positions, des mesures dans le temps et des grandeurs avec leur unité ? |
| Compter et identifier | Comment représenter un montant sans perdre un centime, et un identifiant ou un numéro sans ambiguïté ni trou ? |
| Décrire et relier | Comment accepter du texte mis en forme sans risque, et des termes et des liens qui restent cohérents ? |

**Références.** Les documentations, normes et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Les coordonnées et les valeurs numériques des exemples sont approchées ou inventées pour l'illustration ; les résultats de calcul présentés ont été obtenus par exécution des extraits donnés.

## Sommaire du module

- [27.1 Données géospatiales, système de référence spatial et index spatial](#271-données-géospatiales-système-de-référence-spatial-et-index-spatial)
- [27.2 Séries temporelles, sous-échantillonnage et rétention](#272-séries-temporelles-sous-échantillonnage-et-rétention)
- [27.3 Quantités et unités de mesure](#273-quantités-et-unités-de-mesure)
- [27.4 Monnaie et arrondis](#274-monnaie-et-arrondis)
- [27.5 Stratégie d'identifiants et numérotation sans trou](#275-stratégie-didentifiants-et-numérotation-sans-trou)
- [27.6 Texte riche](#276-texte-riche)
- [27.7 Vocabulaires contrôlés et graphe de propriétés](#277-vocabulaires-contrôlés-et-graphe-de-propriétés)

## 27.1 Données géospatiales, système de référence spatial et index spatial

### 1. Comprendre simplement

Une **donnée géospatiale** (*geospatial data*) est une valeur qui situe quelque chose à la surface de la Terre : un point (la position d'une base), une ligne (un trajet), une surface (l'emprise d'un hangar). Un **système de référence spatial** (*spatial reference system*) dit comment des coordonnées correspondent à des lieux : quel modèle de la Terre, quel système de coordonnées, quelle unité. Un **index spatial** (*spatial index*) est la structure qui permet de retrouver vite les objets proches ou contenus dans une zone, sans comparer chaque objet à la requête.

**Pourquoi cela existe.** Des questions comme « quelles bases sont à moins de 400 km de Lyon ? » ou « dans quelle zone de maintenance se trouve ce point ? » ne se règlent ni avec deux nombres décimaux, ni avec les opérateurs d'ordre d'une colonne ordinaire. Les coordonnées n'ont de sens que dans un système donné, la Terre n'est ni plate ni parfaitement sphérique, et le volume impose un index.

**Problème résolu.** Stocker des positions et des formes sans ambiguïté, les comparer et les mesurer correctement, et les interroger rapidement.

**Modèle mental.** Une carte routière et sa légende. La même position se note autrement sur une carte du monde et sur une carte départementale ; le système de référence est la légende, qui dit dans quelle convention lire les nombres. L'index spatial est l'index des communes en fin de volume.

**Où l'analogie s'arrête.** Une carte papier a une projection fixe. Une plateforme reçoit des données de capteurs, de fichiers et de services qui n'emploient pas la même, et doit les convertir sans les mélanger.

**Exemple.** Les bases LYS et TLS d'Alpha Air ont chacune une position (coordonnées approchées, données d'exemple). La planificatrice veut les bases à moins de 400 km de LYS, et savoir dans quelle zone de maintenance se trouve un point relevé par un appareil.

**Les composants.**

1. une **géométrie** : point, ligne, surface, ou collection ;
2. un **système de référence** : identifiant, modèle de la Terre, unités ;
3. un **type de colonne** adapté : plan (*geometry*) ou globe (*geography*) ;
4. un **format d'échange** : GeoJSON ou format binaire de la base ;
5. un **index spatial** ;
6. des **règles de validation** : bornes, système attendu, géométrie valide ;
7. des **fonctions** de mesure et de relation : distance, contenance, intersection.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi une coordonnée est inséparable de son système de référence, choisir entre plan et globe pour une mesure, et décrire comment un index spatial accélère une requête de proximité.

### 2. Connaissances essentielles

#### Définition

- **Donnée géospatiale** : valeur qui décrit la position ou la forme d'un objet par des coordonnées dans un système de référence spatial : point, ligne, surface ou collection.
- **Système de référence spatial** : définition d'un modèle de la Terre (datum), d'un système de coordonnées et d'unités, identifiée par un code, par exemple EPSG:4326 ; on parle de SRID pour l'identifiant numérique utilisé par une base de données.
- **Index spatial** : structure auxiliaire qui retrouve les objets dont l'emprise rencontre une zone de requête, en comparant d'abord des boîtes englobantes.

#### Idées fondamentales

1. **Une coordonnée n'a de sens qu'avec son système de référence.** Deux nombres sans système ne désignent aucun lieu.
2. **Plan et globe ne mesurent pas de la même façon.** Une distance dans le plan suit les unités du système ; une distance sur le globe se mesure en mètres le long de la Terre.
3. **L'ordre des axes est un piège.** Certains formats écrivent longitude puis latitude, d'autres l'inverse.
4. **On stocke dans un système, on convertit pour mesurer ou afficher.** La conversion est explicite, jamais implicite.
5. **Un index spatial filtre sur des boîtes, puis un test exact tranche.** Deux étapes, comme pour toute recherche approximative.
6. **Les décimales ne sont pas la précision.** Le nombre de chiffres n'indique pas l'incertitude de la mesure.
7. **Les cas limites existent.** Antiméridien, pôles, anneaux mal orientés, géométries invalides.

#### Vocabulaire essentiel

- **Géométrie** (*geometry*) : objet spatial décrit par des coordonnées ; aussi le type de colonne qui raisonne dans un plan.
- **Géographie** (*geography*) : type de colonne qui raisonne sur le globe, avec des distances en mètres.
- **SRID** (*spatial reference identifier*) : identifiant numérique du système de référence, résolu par une table de définitions de la base.
- **EPSG** : registre de codes de systèmes de référence ; EPSG:4326 désigne le système géographique WGS 84.
- **Projection** (*projection*) : transformation de la surface du globe en un plan ; **reprojection** : passage d'un système à un autre.
- **Boîte englobante** (*bounding box*) : rectangle minimal qui contient une géométrie.
- **Antiméridien** (*antimeridian*) : méridien opposé à Greenwich, à 180° de longitude, qu'une géométrie peut traverser.

#### Relations de cause à effet

- Les coordonnées sont stockées sans système. Des fichiers en degrés et d'autres en mètres se mélangent, et les positions sont fausses sans qu'aucune erreur ne soit levée.
- Longitude et latitude sont inversées. Les points se placent ailleurs, et tout reste « valide » tant que les valeurs sont dans les bornes.
- Les distances sont calculées en degrés. Une distance en degrés n'a pas d'unité utile, et sa valeur change avec la latitude.
- Aucun index spatial n'existe. Chaque requête de proximité compare tous les objets de la table.

#### Idées reçues

- **« Latitude puis longitude, partout. »** Non. Le GeoJSON (RFC 7946) impose longitude puis latitude, alors que la définition EPSG:4326 déclare la latitude en premier.
- **« Plus de décimales, plus de précision. »** Non. Le RFC 7946 précise que le nombre de chiffres ne doit pas être interprété comme une indication d'incertitude, et rappelle que six décimales de degré valent à peu près dix centimètres.
- **« Un index spatial accélère toute requête spatiale. »** Non. Il sert les prédicats qu'il connaît, fondés sur les boîtes englobantes ; une fonction qui ne s'en sert pas parcourt toute la table.

#### Principe clé

Une position est un couple (coordonnées, système de référence) : on la stocke avec son système, on la mesure dans un système adapté et on l'interroge par un index sur les boîtes englobantes.

#### Si vous ne retenez que trois choses

1. Une coordonnée sans système de référence est ambiguë : le système fait partie de la valeur.
2. On choisit le plan ou le globe selon la mesure voulue, et l'on se méfie de l'ordre des axes.
3. Un index spatial filtre par boîtes englobantes ; un test exact conclut.

### 3. Explication technique détaillée

#### Formes et format d'échange

Une géométrie est un point, une ligne, une surface (avec éventuellement des trous), ou une collection de ces éléments. Le format d'échange le plus courant sur le web est GeoJSON, défini par le RFC 7946 (août 2016). Ce texte impose pour les coordonnées le système WGS 84 en degrés décimaux, avec les deux premiers éléments d'une position dans l'ordre longitude puis latitude, et une hauteur facultative en mètres comme troisième élément. Il demande de couper en deux une géométrie qui traverse l'antiméridien, impose la règle de la main droite pour les anneaux (extérieur dans le sens inverse des aiguilles d'une montre, trous dans l'autre sens) tout en demandant aux analyseurs de ne pas rejeter une surface qui ne la respecte pas, et note que les systèmes de référence autres que WGS 84 ont été retirés de cette version, sauf accord préalable entre les parties.

```json
{
  "type": "Feature",
  "properties": { "code": "LYS", "name": "Base de Lyon" },
  "geometry": { "type": "Point", "coordinates": [5.0811, 45.7256] }
}
```

Dans cet exemple, `5.0811` est la longitude et `45.7256` la latitude.

#### Systèmes de référence

| Code | Nom | Nature | Unité | Usage |
|---|---|---|---|---|
| EPSG:4326 | WGS 84 | Géographique, deux dimensions | Degrés ; axes : latitude puis longitude | Positions GPS, échanges ; couverture : le monde |
| EPSG:3857 | WGS 84 / Pseudo-Mercator | Projeté | Mètres | Cartographie web ; latitude limitée à environ ±85,06° ; la page le décrit comme « non reconnu comme système géodésique » |
| EPSG:2154 | RGF93 v1 / Lambert-93 | Projeté | Mètres | France métropolitaine et Corse, terre et mer |

Ces trois lignes viennent des pages du registre consulté (epsg.io, le 14 octobre 2026). Elles rappellent deux faits. D'abord, le même lieu a des coordonnées numériquement différentes dans chaque système : des degrés pour l'un, des mètres pour les autres. Ensuite, la définition de EPSG:4326 place la latitude en premier, alors que le GeoJSON place la longitude en premier : c'est la cause la plus fréquente de points placés ailleurs. Une projection plane donne des mètres, donc des distances et des surfaces simples, mais toute projection déforme ; on choisit la projection adaptée à la région de travail.

#### Plan ou globe dans la base

La documentation de PostGIS (consultée le 14 octobre 2026) distingue deux types de colonnes :

| | Géométrie (*geometry*) | Géographie (*geography*) |
|---|---|---|
| Modèle | Plan cartésien | Globe |
| Unité des mesures | Celle du système de référence | Mètres pour distance, longueur, périmètre et surface ; le paramètre de distance de la recherche de voisinage est aussi en mètres |
| Fonctions disponibles | Nombreuses | Moins nombreuses |
| Système de référence | Quelconque, projeté ou non | Géodésique (longitude, latitude) ; par défaut 4326 ; refuse les autres |

Le système de référence d'une valeur s'identifie par son SRID ; la table de définitions de la base (`spatial_ref_sys`) en donne la description. La documentation précise que les fonctions qui traitent deux géométries exigent qu'elles soient dans le même système : on convertit l'une des deux, explicitement.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE site (
  tenant_id uuid NOT NULL,
  site_id   uuid NOT NULL,
  code      text NOT NULL,
  location  geography(Point, 4326) NOT NULL,
  PRIMARY KEY (tenant_id, site_id)
);

CREATE INDEX site_location ON site USING gist (location);

SELECT code,
       ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography) / 1000 AS distance_km
FROM site
WHERE tenant_id = $1
  AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, $4)
ORDER BY distance_km;

CREATE TABLE zone (
  zone_id   uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  name      text NOT NULL,
  boundary  geometry(Polygon, 2154) NOT NULL
);

CREATE INDEX zone_boundary ON zone USING gist (boundary);

SELECT name
FROM zone
WHERE tenant_id = $1
  AND ST_Contains(boundary, ST_Transform(ST_SetSRID(ST_MakePoint($2, $3), 4326), 2154));
```

La première requête cherche les sites dans un rayon donné en mètres, avec une colonne de type globe. La seconde reprojette un point reçu en WGS 84 vers le système de la zone avant de tester la contenance, car les deux valeurs doivent partager un système. L'ordre des arguments de `ST_MakePoint` est longitude puis latitude ; la page de la documentation consultée ne le formule pas explicitement.

#### L'index spatial : boîtes, puis test exact

La documentation de PostGIS indique que les index spatiaux ne stockent que la boîte englobante des géométries, que les requêtes s'en servent comme **filtre primaire** puis appliquent une fonction de prédicat exacte comme **filtre secondaire**, et qu'après la création d'un index il faut exécuter `VACUUM ANALYZE` pour que le planificateur dispose de statistiques. L'esquisse suivante rejoue ce principe, avec des coordonnées d'exemple.

```typescript
interface LonLat {
  lon: number;
  lat: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineKm(a: LonLat, b: LonLat): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function boundingBox(center: LonLat, radiusKm: number) {
  const dLat = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI);
  const dLon = dLat / Math.cos(toRad(center.lat));
  return { minLat: center.lat - dLat, maxLat: center.lat + dLat, minLon: center.lon - dLon, maxLon: center.lon + dLon };
}

function withinRadius(center: LonLat, radiusKm: number, sites: { code: string; at: LonLat }[]) {
  const box = boundingBox(center, radiusKm);
  const candidates = sites.filter(
    (s) => s.at.lat >= box.minLat && s.at.lat <= box.maxLat && s.at.lon >= box.minLon && s.at.lon <= box.maxLon,
  );
  const exact = candidates.filter((s) => haversineKm(center, s.at) <= radiusKm);
  return { tested: sites.length, candidates: candidates.map((s) => s.code), exact: exact.map((s) => s.code) };
}
```

La formule de haversine calcule une distance sur une sphère de rayon 6 371 km : c'est une approximation du globe, moins précise qu'un calcul sur le sphéroïde que fait la base. Avec LYS en (5,0811 ; 45,7256) et TLS en (1,3638 ; 43,6293), la distance obtenue est d'environ 375 km. Autour de LYS, un rayon de 200 km ne retient que LYS et GVA. Avec 400 km, la boîte englobante retient cinq candidats (LYS, TLS, MRS, CDG, GVA) et le test exact en conserve quatre : CDG, qui se trouve à environ 412 km, est dans la boîte mais hors du cercle. Si les deux coordonnées de LYS sont inversées, le point reste « valide » car il est dans les bornes, mais il tombe à environ 5 979 km de sa vraie position : aucune erreur n'est levée.

#### Valider

Un type de champ géospatial déclare : le système attendu (refus de toute valeur dans un autre système plutôt que conversion silencieuse), les bornes (latitude entre −90° et 90°, longitude entre −180° et 180° pour un système en degrés), la validité des géométries (anneaux fermés, absence d'auto-intersection) et, pour les données d'un tenant, une **emprise d'exploitation** : une position hors de la zone où le tenant opère est suspecte. Cette dernière règle attrape l'inversion de longitude et de latitude.

**Modes de défaillance.**

- **Deux colonnes flottantes** `lat` et `lon`, sans système ni index.
- **Mélange de systèmes** : degrés et mètres dans la même colonne.
- **Axes inversés**, sans règle d'emprise pour le détecter.
- **Distance en degrés** utilisée comme une longueur.
- **Fonction qui ignore l'index** sur une grande table.
- **Géométries invalides** acceptées et propagées.

**Contre-exemple.** Un partenaire envoie des positions d'aéronefs en Lambert-93 (en mètres) dans un fichier dont les colonnes s'appellent `x` et `y` ; la plateforme les lit comme des degrés. Les valeurs sont hors bornes, mais le champ n'a ni système ni règle : elles sont acceptées. Les cartes affichent des appareils en mer, et un filtre « à moins de 0,5 » ne retient rien. Un type géospatial avec son système déclaré aurait refusé le fichier ou imposé la conversion.

**Limites.** La précision d'une position dépend de sa source, pas de ses décimales. Les distances sur le globe sont des distances géodésiques, pas des temps de trajet ni des itinéraires routiers. L'altitude et la hauteur demandent un modèle supplémentaire. Et une position rattachée à une personne ou à un véhicule suivi peut être une donnée personnelle : elle suit les règles de classification et de conservation ([20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données), [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) | Un champ géospatial est un champ avec un système de référence déclaré |
| [2.14 Index](02-donnees-ressources.md#214-index) | L'index spatial prolonge la notion d'index pour les prédicats de proximité et de contenance |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation vérifie le système, les bornes et la validité des géométries |
| [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) | Une position est un objet-valeur : définie par ses valeurs et son système, sans identité |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Une position varie dans le temps ; la modélisation temporelle s'applique |
| [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données) | Une position peut être une donnée personnelle selon son rattachement |
| [27.2 Séries temporelles, sous-échantillonnage et rétention](#272-séries-temporelles-sous-échantillonnage-et-rétention) | Une trajectoire est une série temporelle de positions |

### 5. Application pratique

**Situation initiale.** Alpha Air reçoit les positions des aéronefs au sol par un flux en WGS 84, et le bureau d'études a dessiné les zones de hangar en Lambert-93, en mètres. La planificatrice veut afficher les appareils par zone et chercher les bases proches d'un point.

**Problème.** Deux sources dans deux systèmes, des questions de contenance et de proximité, et un risque d'inversion d'axes.

**Application du concept.** Deux types de champ : un point en WGS 84 de type globe, une zone en Lambert-93 de type plan, avec index et règles de validation.

**Déroulé.**

1. Le champ `geo_point` déclare le système 4326, les bornes de latitude et de longitude, et le format d'échange GeoJSON.
2. Le champ `geo_area` déclare le système 2154 ; les zones sont stockées en mètres.
3. À l'import, un contrôle refuse un système inattendu au lieu de convertir en silence.
4. Une règle d'emprise rejette les points hors de la zone d'exploitation du tenant : un point dont la longitude et la latitude sont inversées est refusé avec un message explicite.
5. Pour savoir dans quelle zone se trouve un appareil, le point est reprojeté en 2154, puis testé avec la contenance.
6. Pour « les bases à moins de 400 km de LYS », la requête utilise le type globe, en mètres.
7. Les deux colonnes portent un index spatial ; le plan d'exécution est vérifié sur une table de volume réaliste.

**Résultat.** Les appareils s'affichent dans la bonne zone, les recherches de proximité répondent vite, et les erreurs de système ou d'axes sont arrêtées à l'entrée.

**Limites.** La reprojection coûte du calcul à chaque requête : pour un usage intensif, on stocke aussi la position dans le système de la zone. Et la règle d'emprise ne détecte pas une inversion qui reste dans la zone.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi une coordonnée doit-elle toujours être accompagnée de son système de référence ?
2. **Compréhension.** Quelle différence y a-t-il entre une colonne de type plan et une colonne de type globe ?
3. **Compréhension.** Que stocke un index spatial, et en quoi consistent le filtre primaire et le filtre secondaire ?
4. **Pourquoi.** Pourquoi l'ordre des axes est-il une source d'erreurs fréquente ?
5. **Raisonnement pratique.** Un partenaire fournit des positions « 45.7256, 5.0811 » sans autre information, et la plateforme attend du GeoJSON. Que vérifier avant d'importer ?

#### Réponses

1. Parce que les mêmes nombres désignent des lieux différents selon le système : des degrés ou des mètres, un modèle de la Terre ou un autre. Sans le système, on ne peut ni mesurer, ni comparer, ni convertir.
2. Le plan raisonne dans une surface plane et mesure dans l'unité du système de référence ; le globe raisonne sur la Terre et mesure en mètres le long de sa surface, avec moins de fonctions disponibles et un système géodésique obligatoire.
3. Il stocke la boîte englobante de chaque géométrie. Le filtre primaire retient les objets dont la boîte rencontre la zone de requête ; le filtre secondaire applique le prédicat exact sur ces seuls candidats.
4. Parce que les formats n'ont pas la même convention (le GeoJSON écrit longitude puis latitude, la définition EPSG:4326 écrit latitude en premier) et que l'inversion produit des valeurs dans les bornes : aucune erreur n'apparaît.
5. Le système de référence (probablement WGS 84, à confirmer), l'ordre des axes (ici, une latitude de 45,7 et une longitude de 5,08 : latitude puis longitude), l'unité (degrés), et la plausibilité des points par rapport à la zone d'exploitation. Il faut convertir vers l'ordre longitude, latitude du GeoJSON avant l'import.

## 27.2 Séries temporelles, sous-échantillonnage et rétention

### 1. Comprendre simplement

Une **série temporelle** (*time series*) est une suite de mesures d'une même grandeur, chacune associée à un horodatage : la pression hydraulique d'un aéronef relevée chaque seconde en vol. Le **sous-échantillonnage** (*downsampling*) remplace des mesures détaillées par des agrégats sur des intervalles plus larges (minimum, maximum et moyenne par minute). La **rétention** (*retention*) est la durée pendant laquelle on conserve chaque niveau de détail. Les deux se décident ensemble : *downsampling and retention* forment une politique.

**Pourquoi cela existe.** Une mesure par seconde sur 200 capteurs d'un aéronef donne des millions de lignes par jour. La valeur du détail décroît avec l'âge : on veut la seconde pour l'enquête d'hier, la minute pour la tendance du trimestre, l'heure pour l'historique de cinq ans. Une table ordinaire, mise à jour et indexée ligne à ligne, ne tient pas ce rythme à coût raisonnable.

**Problème résolu.** Stocker et interroger de gros volumes de mesures horodatées, avec un coût borné, en gardant ce qui reste utile à chaque âge.

**Modèle mental.** Les archives météorologiques : le détail horaire pour la semaine passée, des moyennes mensuelles pour les décennies. Plus c'est ancien, plus c'est synthétique.

**Où l'analogie s'arrête.** On ne peut pas retrouver un maximum à partir d'une moyenne, ni une moyenne exacte à partir de moyennes sans leurs effectifs. Le choix des agrégats conservés détermine ce qui reste calculable.

**Exemple.** Le capteur de pression hydraulique de F-ABCD donne une valeur par seconde en vol. Alpha Air garde le brut 30 jours, un agrégat par minute 13 mois et un agrégat par heure 5 ans (valeurs d'exemple). Un capteur à 1 Hz sur six heures de vol par jour produit 21 600 mesures par jour ; 200 capteurs sur 40 aéronefs en font environ 173 millions.

**Les composants.**

1. une **série** identifiée : tenant, source, grandeur, unité ;
2. des **échantillons** : horodatage, valeur, qualité ;
3. une **écriture en ajout**, idempotente ;
4. un **partitionnement par le temps** ;
5. des **agrégats recomposables** par intervalle ;
6. des **règles de rétention** par niveau de résolution ;
7. la **gestion des données tardives** et des trous ;
8. des **requêtes par plage de temps**.

**Objectif d'apprentissage :** vous pouvez décrire le modèle d'une série temporelle, choisir des agrégats que l'on peut recomposer, et définir une politique de résolution et de rétention.

### 2. Connaissances essentielles

#### Définition

- **Série temporelle** : suite ordonnée de mesures d'une même grandeur, chacune associée à un instant, écrite pour l'essentiel en ajout et lue par plages de temps et par agrégats.
- **Sous-échantillonnage** : remplacement de mesures détaillées par des agrégats calculés sur des intervalles plus larges.
- **Rétention** : durée de conservation de chaque niveau de détail, après laquelle les données sont supprimées.

#### Idées fondamentales

1. **Le temps est la clé.** Les données arrivent à peu près dans l'ordre, ne sont presque jamais modifiées, et sont lues par plages.
2. **Le volume dicte l'architecture.** Partitionnement par le temps, index compact, écriture en lots.
3. **La résolution décroît avec l'âge.** Détail récent, synthèse ancienne.
4. **On agrège avec des agrégats recomposables.** Effectif, somme, minimum, maximum : la moyenne s'en déduit et se recompose sur des intervalles plus larges.
5. **La rétention est une règle déclarée.** Elle s'applique en supprimant des blocs entiers, pas ligne à ligne.
6. **Retards, trous et doublons sont normaux.** L'écriture est idempotente sur (série, instant).
7. **La rétention est une décision de conformité.** Ce qui est supprimé ne se récupère pas.

#### Vocabulaire essentiel

- **Échantillon** (*sample*) : une mesure et son horodatage.
- **Cardinalité** (*cardinality*) : nombre de séries distinctes (capteurs × grandeurs × tenants).
- **Intervalle d'agrégation** (*bucket*) : fenêtre de temps sur laquelle on agrège.
- **Agrégat recomposable** (*decomposable aggregate*) : agrégat qui se calcule à partir d'agrégats d'intervalles plus petits : somme, effectif, minimum, maximum.
- **Bloc** (*chunk*, partition) : tranche de temps stockée ensemble, que l'on supprime d'un coup.
- **Donnée tardive** (*late data*) : mesure qui arrive après la fin de l'intervalle auquel elle appartient.

#### Relations de cause à effet

- Tout reste en brut, sans partitionnement. La table grossit, les requêtes ralentissent, et supprimer les anciennes lignes devient une opération de plusieurs heures.
- Les agrégats conservés sont seulement des moyennes. On ne retrouve plus ni les extrêmes, ni la moyenne exacte d'une période plus large.
- Les mesures tardives sont ignorées. Les agrégats déjà calculés restent faux.
- La rétention est fixée par le coût seul. Des données exigées par une obligation ou une enquête disparaissent.

#### Idées reçues

- **« Une série temporelle, c'est une table avec une colonne de date. »** Non. Le volume, l'écriture en ajout, la lecture par plages et la rétention changent la façon de la stocker et de l'indexer.
- **« La moyenne suffit. »** Non. Elle cache les pics, qui sont souvent ce qui compte ; on garde au moins l'effectif, la somme, le minimum et le maximum.
- **« On supprime les vieilles lignes avec une requête de suppression. »** Cela fonctionne, mais mal à grande échelle : la documentation de PostgreSQL note que supprimer ou détacher une partition est bien plus rapide qu'une suppression en masse et évite le coût de nettoyage qui l'accompagne.

#### Principe clé

Une série temporelle se stocke par blocs de temps, se résume par des agrégats recomposables, et chaque niveau de détail a une durée de vie déclarée.

#### Si vous ne retenez que trois choses

1. On partitionne par le temps, on écrit en ajout et on lit par plages.
2. On conserve des agrégats recomposables (effectif, somme, minimum, maximum), pas seulement la moyenne.
3. La rétention supprime des blocs entiers, selon une règle déclarée qui tient compte des obligations de conservation.

### 3. Explication technique détaillée

#### Modèle et stockage

Le modèle étroit stocke une ligne par mesure : le tenant, la série, l'instant, la valeur. La clé (tenant, série, instant) rend l'écriture idempotente : rejouer une mesure remplace la même ligne. La table est partitionnée par plage de temps. La documentation de PostgreSQL (consultée le 14 octobre 2026) décrit les partitionnements par plage, par liste et par hachage, et cite comme avantages une amélioration des requêtes lorsque les lignes très sollicitées sont dans peu de partitions, et des chargements et suppressions en masse beaucoup plus rapides par suppression ou détachement d'une partition, qui évitent le coût de nettoyage d'une suppression massive. Elle note aussi que la suppression de la partition exige un verrou exclusif sur la table parente, alors que le détachement en mode concurrent n'exige qu'un verrou plus léger ; qu'un planificateur gère bien jusqu'à quelques milliers de partitions si les requêtes en élaguent la plupart ; et qu'il ne faut pas supposer que plus de partitions vaut mieux.

Pour les requêtes par plage de temps sur des données écrites dans l'ordre, un index de type BRIN est très compact. La documentation de PostgreSQL le décrit comme un résumé, par groupe de pages voisines, des valeurs minimales et maximales ; il fonctionne bien quand les valeurs sont corrélées à l'emplacement physique des lignes, ce qui est le cas de données insérées dans l'ordre du temps. Il est approximatif : l'exécuteur revérifie les lignes des groupes retenus, et les nouveaux groupes ne sont résumés qu'à l'exécution d'un nettoyage ou d'une résumation explicite.

```sql
CREATE TABLE sensor_reading (
  tenant_id uuid             NOT NULL,
  series_id uuid             NOT NULL,
  ts        timestamptz      NOT NULL,
  value     double precision NOT NULL,
  PRIMARY KEY (tenant_id, series_id, ts)
) PARTITION BY RANGE (ts);

CREATE TABLE sensor_reading_2026_10 PARTITION OF sensor_reading
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE INDEX sensor_reading_2026_10_ts_brin ON sensor_reading_2026_10 USING brin (ts);

CREATE TABLE sensor_rollup_1m (
  tenant_id uuid             NOT NULL,
  series_id uuid             NOT NULL,
  bucket    timestamptz      NOT NULL,
  n         integer          NOT NULL,
  sum_value double precision NOT NULL,
  min_value double precision NOT NULL,
  max_value double precision NOT NULL,
  PRIMARY KEY (tenant_id, series_id, bucket)
);

INSERT INTO sensor_rollup_1m (tenant_id, series_id, bucket, n, sum_value, min_value, max_value)
SELECT tenant_id, series_id, date_trunc('minute', ts), count(*), sum(value), min(value), max(value)
FROM sensor_reading
WHERE ts >= $1 AND ts < $2
GROUP BY tenant_id, series_id, date_trunc('minute', ts)
ON CONFLICT (tenant_id, series_id, bucket) DO UPDATE
SET n = EXCLUDED.n, sum_value = EXCLUDED.sum_value,
    min_value = EXCLUDED.min_value, max_value = EXCLUDED.max_value;

ALTER TABLE sensor_reading DETACH PARTITION sensor_reading_2026_08 CONCURRENTLY;
DROP TABLE sensor_reading_2026_08;
```

L'insertion avec reprise sur conflit recalcule les agrégats d'une fenêtre de temps : elle est rejouable, ce qui permet de rattraper les données tardives en recalculant les dernières heures. La clé primaire inclut la colonne de partition, ce qu'impose le partitionnement. Le BRIN complète la clé primaire pour les lectures par plage.

#### Agréger sans perdre

On agrège par intervalle en conservant l'effectif, la somme, le minimum et le maximum. La moyenne s'en déduit (somme divisée par effectif) et, surtout, on peut regrouper des intervalles déjà agrégés sans retourner au brut.

```typescript
interface Sample {
  ts: number; // secondes depuis une origine
  value: number;
}

interface Bucket {
  start: number;
  count: number;
  sum: number;
  min: number;
  max: number;
}

function rollup(samples: Sample[], widthSeconds: number): Bucket[] {
  const buckets = new Map<number, Bucket>();
  for (const s of samples) {
    const start = Math.floor(s.ts / widthSeconds) * widthSeconds;
    const b = buckets.get(start);
    if (!b) {
      buckets.set(start, { start, count: 1, sum: s.value, min: s.value, max: s.value });
    } else {
      b.count += 1;
      b.sum += s.value;
      b.min = Math.min(b.min, s.value);
      b.max = Math.max(b.max, s.value);
    }
  }
  return [...buckets.values()].sort((a, b) => a.start - b.start);
}

function mergeBuckets(parts: Bucket[], widthSeconds: number): Bucket[] {
  const merged = new Map<number, Bucket>();
  for (const p of parts) {
    const start = Math.floor(p.start / widthSeconds) * widthSeconds;
    const b = merged.get(start);
    if (!b) {
      merged.set(start, { ...p, start });
    } else {
      b.count += p.count;
      b.sum += p.sum;
      b.min = Math.min(b.min, p.min);
      b.max = Math.max(b.max, p.max);
    }
  }
  return [...merged.values()].sort((a, b) => a.start - b.start);
}

const mean = (b: Bucket) => b.sum / b.count;
```

Sur 120 secondes d'une pression en psi (valeurs d'exemple : 3 000 pendant 10 secondes puis 3 100 durant la première minute ; 2 900 pendant 2 secondes puis 3 100 durant la seconde), les agrégats par minute donnent une moyenne de 3 083,3 (minimum 3 000, maximum 3 100) puis de 3 093,3 (minimum 2 900, maximum 3 100). Regroupés sur deux minutes, ils donnent 3 088,33 et conservent le minimum de 2 900 et le maximum de 3 100 : le creux de deux secondes reste visible. À l'inverse, faire la moyenne de deux moyennes d'effectifs différents (une mesure à 3 000 et 59 mesures à 3 100) donne 3 050, alors que la moyenne exacte est de 3 098,33 : l'erreur vient des effectifs ignorés. Les percentiles ne se recomposent pas à partir d'agrégats : pour les conserver, on garde des histogrammes ou des esquisses, ce qui est un autre choix de conception.

#### Rétention par niveau

| Niveau | Contenu | Durée (exemple) | Usage |
|---|---|---|---|
| Brut | Une mesure par seconde | 30 jours | Enquête sur un événement récent |
| Minute | Effectif, somme, minimum, maximum | 13 mois | Tendances, comparaison à l'an passé |
| Heure | Idem | 5 ans | Historique long, usure |

La rétention de chaque niveau est une règle distincte. Des moteurs spécialisés l'offrent sous forme de politique : la documentation de TimescaleDB (consultée le 14 octobre 2026) décrit une politique de rétention qui supprime les blocs plus anciens qu'un intervalle donné, selon la plage de temps de la colonne de partition ou la date de création du bloc. Un bloc qui chevauche la limite est conservé tant qu'une partie de ses données reste dans la période. La page consultée ne traite pas de l'interaction avec les agrégats calculés : vérifiez-la chez votre moteur avant de supprimer le brut dont dépendent des agrégats.

La rétention reste une décision de conformité autant que de coût : certaines données doivent être conservées en brut pendant une durée fixée par une obligation, d'autres doivent être supprimées au plus tard à une date. Elle s'inscrit dans le calendrier de conservation du tenant ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) et, pour les fichiers de mesure, dans les règles de conservation et de gel ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

**Modes de défaillance.**

- **Tout en brut**, sans partitionnement ni agrégats.
- **Moyennes seules** : extrêmes et effectifs perdus.
- **Données tardives** ignorées : agrégats faux.
- **Suppression ligne à ligne** des anciennes données, avec nettoyage lourd.
- **Cardinalité non maîtrisée** : une étiquette libre crée des millions de séries.
- **Rétention fixée sans consulter la conformité.**

**Contre-exemple.** Alpha Air stocke toutes les mesures en brut dans une seule table. Deux ans plus tard, la table pèse plusieurs téraoctets ; les tendances sur douze mois prennent des minutes ; et la suppression des données de plus de deux ans, lancée par une requête de suppression, dure des heures et gonfle la table. Une table partitionnée par mois, des agrégats par minute et par heure, et la suppression des partitions échues auraient évité les trois.

**Limites.** Le sous-échantillonnage est irréversible : un détail agrégé ne revient pas. Les horloges des sources dérivent, et les fuseaux horaires se traitent à l'affichage ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)). La cardinalité (nombre de séries distinctes) pèse autant que le volume. Et un moteur spécialisé de séries temporelles n'est pas toujours nécessaire : une base relationnelle partitionnée suffit longtemps, au prix de plus de travail à la main.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.14 Index](02-donnees-ressources.md#214-index) | L'index compact (BRIN) et la clé primaire servent l'écriture et la lecture par plage |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'écriture idempotente sur (série, instant) absorbe les reprises |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les tâches planifiées calculent les agrégats et appliquent la rétention |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Les métriques d'exploitation sont des séries temporelles |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Le temps et les fuseaux horaires s'appliquent aux horodatages |
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | L'entrepôt et l'ELT accueillent les séries agrégées pour l'analytique |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Le calendrier de conservation fixe les durées de rétention |
| [22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage) | Le partitionnement et la clé de partition portent la structure en blocs de temps |
| [27.1 Données géospatiales, système de référence spatial et index spatial](#271-données-géospatiales-système-de-référence-spatial-et-index-spatial) | Une trajectoire est une série temporelle de positions |

### 5. Application pratique

**Situation initiale.** Alpha Air collecte la pression hydraulique de chaque aéronef à 1 Hz. La table de mesures grossit, les tendances sur un an sont lentes, et l'équipe se demande combien de temps garder le détail.

**Problème.** Réduire le coût de stockage et de requête sans perdre ce qui sert aux enquêtes et aux tendances.

**Application du concept.** Partitionnement mensuel, agrégats par minute et par heure, rétention par niveau.

**Déroulé.**

1. La table de mesures est partitionnée par mois, avec une clé (tenant, série, instant) qui rend l'écriture rejouable.
2. Chaque nuit, une tâche recalcule les agrégats par minute des 24 dernières heures (effectif, somme, minimum, maximum) et les agrégats par heure.
3. Les mesures tardives, jusqu'à 24 heures, sont absorbées par ce recalcul idempotent.
4. Les tendances sur l'année lisent les agrégats par minute ; l'affichage de la moyenne se fait par somme divisée par effectif.
5. La rétention est définie par niveau : brut 30 jours, minute 13 mois, heure 5 ans (valeurs d'exemple, validées avec la qualité et le service conformité).
6. À chaque fin de mois, la partition échue est détachée puis supprimée, après vérification que ses agrégats sont complets.
7. Un événement qualité, qui exige le brut d'un vol, déclenche un gel : la partition concernée est exportée avant sa suppression ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

**Résultat.** Un stockage borné, des tendances rapides, et des suppressions instantanées au lieu de requêtes de plusieurs heures.

**Limites.** Un enquêteur qui demande une seconde précise à trois mois n'a plus que la minute : la durée du brut doit couvrir les besoins d'enquête réels. Et les agrégats ne répondent pas à une question que l'on n'avait pas prévue (un percentile, par exemple).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi partitionne-t-on une série temporelle par le temps ?
2. **Compréhension.** Quels agrégats faut-il conserver pour pouvoir recomposer une moyenne sur un intervalle plus large ?
3. **Compréhension.** Pourquoi la rétention supprime-t-elle des blocs entiers plutôt que des lignes ?
4. **Pourquoi.** Pourquoi la moyenne de deux moyennes n'est-elle pas la moyenne de l'ensemble ?
5. **Raisonnement pratique.** Une enquête qualité demande, trois mois après un incident, les valeurs par seconde d'un vol. Le brut n'est conservé que 30 jours. Que s'est-il passé et que décider pour l'avenir ?

#### Réponses

1. Parce que les données sont écrites et lues par plages de temps : un partitionnement par le temps limite les lectures aux blocs concernés, permet des index compacts, et rend la suppression des anciennes données quasi instantanée.
2. L'effectif, la somme, le minimum et le maximum. La moyenne se déduit de la somme et de l'effectif, et ces quatre valeurs se regroupent exactement d'un intervalle à un intervalle plus large.
3. Parce que supprimer ou détacher une partition est bien plus rapide qu'une suppression en masse, et évite le travail de nettoyage qu'une suppression de millions de lignes laisse derrière elle.
4. Parce que les intervalles n'ont pas le même effectif : chaque moyenne doit être pondérée par son nombre de mesures. Sans les effectifs, la moyenne des moyennes est biaisée.
5. Le brut a été supprimé à la fin de la durée de rétention, et il ne reste que des agrégats. Il faut décider si les enquêtes exigent une durée de brut plus longue (ou un gel sur événement qualité), puis formaliser la règle avec la qualité et la conformité, en acceptant un coût de stockage supérieur.

## 27.3 Quantités et unités de mesure

### 1. Comprendre simplement

Une **quantité** (*quantity*) est une grandeur mesurée : un nombre accompagné de son **unité de mesure** (*unit of measure*), comme 80 N·m ou 3 000 psi. Chaque unité appartient à une **dimension** (force, longueur, pression, température) et se convertit en une unité de référence par un facteur, parfois avec un décalage.

**Pourquoi cela existe.** Un nombre nu cache son unité. Deux équipes saisissent « 80 » en pensant à des unités différentes ; une somme ou un contrôle de seuil devient faux sans erreur visible. Le cas le plus cité est la perte de la sonde Mars Climate Orbiter : la page de la NASA consultée la date du 23 septembre 1999 et attribue la perte à un défaut de conversion des unités anglaises en unités métriques entre le logiciel au sol et celui de bord.

**Problème résolu.** Rendre une mesure non ambiguë, comparable et convertible, et refuser ce qui n'a pas de sens, comme additionner une force et une pression.

**Modèle mental.** L'étiquette d'un colis. Un poids n'a de sens qu'avec « kg » ou « lb » ; deux colis ne se comparent qu'une fois ramenés à la même unité.

**Où l'analogie s'arrête.** Passer des kilogrammes aux livres est une multiplication. Passer des degrés Celsius aux degrés Fahrenheit demande aussi un décalage, et un écart de température ne se convertit pas comme une température.

**Exemple.** La limite de serrage d'une fixation est de 120 N·m. La clé dynamométrique d'une base partenaire est graduée en lbf·ft, et un technicien relève 90 lbf·ft : la limite est-elle respectée ?

**Les composants.**

1. une **valeur numérique** ;
2. un **code d'unité** normalisé ;
3. une **dimension** ;
4. une **unité canonique** par dimension ;
5. une **table de conversion** : facteur, éventuellement décalage ;
6. des **unités autorisées** par champ ;
7. une **valeur canonique** stockée, pour comparer et indexer ;
8. une **préférence d'affichage**, distincte de l'unité stockée.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi un nombre sans unité n'est pas une mesure, définir un champ de quantité avec ses unités autorisées, et convertir et comparer deux quantités en vérifiant leur dimension.

### 2. Connaissances essentielles

#### Définition

- **Quantité** : valeur numérique associée à une unité de mesure, qui exprime une grandeur d'une dimension donnée.
- **Unité de mesure** : grandeur de référence, identifiée par un code, définie dans une dimension et reliée aux autres unités de cette dimension par des règles de conversion.

#### Idées fondamentales

1. **Un nombre sans unité n'est pas une mesure.** L'unité fait partie de la valeur.
2. **La dimension fixe ce qui se compare.** Une force ne se compare pas à une pression ; la conversion entre dimensions est refusée.
3. **On stocke la valeur saisie, son unité et une valeur canonique.** La saisie se conserve ; la valeur canonique sert à comparer et à indexer.
4. **Une conversion est une fonction.** Un facteur, parfois un décalage : les températures le montrent.
5. **Un code d'unité normalisé évite les ambiguïtés.** Les libellés libres (« Nm », « newton-mètre ») ne se regroupent pas.
6. **L'unité d'affichage est une préférence.** Elle se règle par personne ou par tenant ([25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)) sans toucher à la valeur stockée.
7. **On arrondit à l'affichage, pas au stockage.** Les conversions successives accumulent l'erreur sinon.

#### Vocabulaire essentiel

- **Dimension** (*dimension*) : nature d'une grandeur : longueur, masse, pression, couple, température.
- **Unité canonique** (*canonical unit*) : unité de référence d'une dimension dans le moteur, à laquelle on ramène les valeurs pour les comparer.
- **Facteur et décalage** (*factor and offset*) : coefficient multiplicatif et terme additif d'une conversion.
- **UCUM** (*Unified Code for Units of Measure*) : système de codes d'unités destiné à l'échange électronique sans ambiguïté.
- **Unité spéciale** (*special unit*) : unité définie par une fonction de conversion et non par un simple facteur, comme le degré Celsius.
- **Unité arbitraire** (*arbitrary unit*) : unité dont le sens dépend d'une procédure de mesure ; elle n'est commensurable avec aucune autre.

#### Relations de cause à effet

- Le champ est un nombre nu. Deux unités cohabitent, et un seuil de contrôle ne protège plus.
- L'unité est un libellé libre. Les filtres, les regroupements et les conversions échouent ou se trompent.
- Une température est convertie comme un facteur. Les résultats sont faux de 32 degrés, ou de 273,15.
- La valeur est arrondie au stockage. Les conversions successives dérivent.

#### Idées reçues

- **« Les unités, c'est de l'affichage. »** Non. Le nombre stocké dépend de l'unité ; l'affichage n'est que la dernière étape.
- **« Convertir, c'est multiplier. »** Non. Le degré Celsius et le degré Fahrenheit sont des unités spéciales, définies par une fonction de conversion dans la spécification UCUM.
- **« Un libellé libre suffit. »** Non. Un même nom recouvre plusieurs unités ou plusieurs graphies : la spécification UCUM liste deux symboles pour le litre, et distingue des codes sensibles à la casse et d'autres qui ne le sont pas.

#### Principe clé

Une quantité est un couple (valeur, unité normalisée) typé par sa dimension : on la stocke telle que saisie avec sa valeur canonique, et l'on convertit explicitement.

#### Si vous ne retenez que trois choses

1. Une mesure est un nombre et une unité : l'un ne va pas sans l'autre.
2. On compare et on calcule dans l'unité canonique de la dimension, après avoir vérifié la dimension.
3. Une conversion est une fonction : un facteur, parfois un décalage, jamais un arrondi.

### 3. Explication technique détaillée

#### Un code d'unité normalisé

La spécification UCUM, version 2.2 du 17 juin 2024 (consultée le 14 octobre 2026), décrit un système de codes visant à couvrir les unités de mesure employées en science, en ingénierie et en affaires, pour l'échange électronique sans ambiguïté. Ses codes sont écrits en ASCII sur 7 bits ; chaque symbole a une forme sensible à la casse et une forme qui ne l'est pas, et les deux jeux ne sont pas compatibles. Toute unité se définit à partir d'unités de base ; les unités qui ont une même dimension sont commensurables. Les unités qui ne sont pas des ratios, comme le degré Celsius, sont des **unités spéciales** définies par une fonction de conversion. Le texte entre accolades est une annotation, sans effet sur le sens, que les analyseurs conformes écartent. Les **unités arbitraires**, dont le sens dépend de la procédure de mesure, ne sont commensurables avec aucune autre.

| Grandeur | Code UCUM (sensible à la casse) | Remarque |
|---|---|---|
| Force | `N` | |
| Pression | `Pa`, `bar`, `[psi]` | `[psi]` est défini par la livre-force par pouce carré |
| Longueur | `[ft_i]`, `[in_i]` | pied et pouce internationaux |
| Masse | `[lb_av]` | livre avoirdupois |
| Température | `Cel`, `K`, `[degF]` | unités spéciales pour `Cel` et `[degF]` |
| Couple | `N.m`, `[lbf_av].[ft_i]` | le point compose deux unités |

Les codes de ce tableau ont été relevés dans les tables et les index de la spécification ; les composés comme `N.m` suivent la notation à point qu'elle emploie pour les unités composées.

#### Déclarer un champ de quantité

```json
{
  "field": "tightening_torque",
  "type": "quantity",
  "dimension": "torque",
  "canonical_unit": "N.m",
  "allowed_units": ["N.m", "[lbf_av].[ft_i]"],
  "display_unit_from": "user_preference",
  "minimum": 0
}
```

Une valeur de ce champ se stocke avec la saisie et sa valeur canonique :

```sql
CREATE TABLE torque_limit (
  limit_id        uuid    PRIMARY KEY,
  tenant_id       uuid    NOT NULL,
  task_type       text    NOT NULL,
  entered_value   numeric NOT NULL,
  entered_unit    text    NOT NULL,
  canonical_value numeric NOT NULL,
  canonical_unit  text    NOT NULL DEFAULT 'N.m',
  CHECK (canonical_value >= 0)
);

CREATE INDEX torque_limit_canonical ON torque_limit (tenant_id, canonical_value);
```

La saisie reste exacte et auditable ; la valeur canonique, calculée par la plateforme à l'écriture, permet de trier, de filtrer et d'indexer sans conversion à la lecture.

#### Convertir, vérifier la dimension

```typescript
interface UnitDef {
  dimension: string;
  toCanonical: (v: number) => number;
  fromCanonical: (v: number) => number;
}

const LBF_FT_TO_N_M = 4.4482216152605 * 0.3048; // lbf = 4,4482216152605 N ; ft = 0,3048 m

const UNITS: Record<string, UnitDef> = {
  "N.m": { dimension: "torque", toCanonical: (v) => v, fromCanonical: (v) => v },
  "[lbf_av].[ft_i]": { dimension: "torque", toCanonical: (v) => v * LBF_FT_TO_N_M, fromCanonical: (v) => v / LBF_FT_TO_N_M },
  "Pa": { dimension: "pressure", toCanonical: (v) => v, fromCanonical: (v) => v },
  "bar": { dimension: "pressure", toCanonical: (v) => v * 100000, fromCanonical: (v) => v / 100000 },
  "[psi]": { dimension: "pressure", toCanonical: (v) => v * 6894.757293168361, fromCanonical: (v) => v / 6894.757293168361 },
  "K": { dimension: "temperature", toCanonical: (v) => v, fromCanonical: (v) => v },
  "Cel": { dimension: "temperature", toCanonical: (v) => v + 273.15, fromCanonical: (v) => v - 273.15 },
  "[degF]": { dimension: "temperature", toCanonical: (v) => ((v - 32) * 5) / 9 + 273.15, fromCanonical: (v) => ((v - 273.15) * 9) / 5 + 32 },
};

interface Quantity {
  value: number;
  unit: string;
}

function unitOf(code: string): UnitDef {
  const u = UNITS[code];
  if (!u) throw new Error(`unité inconnue : ${code}`);
  return u;
}

function convert(q: Quantity, target: string): Quantity {
  const from = unitOf(q.unit);
  const to = unitOf(target);
  if (from.dimension !== to.dimension) {
    throw new Error(`dimensions incompatibles : ${from.dimension} et ${to.dimension}`);
  }
  return { value: to.fromCanonical(from.toCanonical(q.value)), unit: target };
}

function exceeds(measured: Quantity, limit: Quantity): boolean {
  return convert(measured, limit.unit).value > limit.value;
}
```

Les facteurs viennent des définitions usuelles : le pied international vaut exactement 0,3048 m, et la livre-force vaut 4,4482216152605 N (une livre avoirdupois de 0,45359237 kg soumise à l'accélération normale de 9,80665 m/s²). Avec elles, 1 lbf·ft vaut environ 1,3558 N·m, et 90 lbf·ft valent environ 122,02 N·m, au-dessus de la limite de 120 N·m : `exceeds` renvoie vrai. Un relevé de 90 « sans unité » aurait paru inférieur à 120. De même 3 000 psi valent environ 206,84 bar et 100 °C valent 212 °F ; une conversion d'un couple vers une pression est refusée (`dimensions incompatibles : torque et pressure`).

Les températures illustrent la différence entre valeur et écart. Une température de 10 °C vaut 283,15 K ; un écart de 10 °C vaut un écart de 10 K. Un moteur qui n'a qu'un facteur applique la même règle aux deux et se trompe de 273,15 : un type de quantité distingue donc les **valeurs** des **écarts** pour les dimensions à décalage.

**Modes de défaillance.**

- **Nombre nu** sans unité ni dimension.
- **Unité libre** saisie comme texte.
- **Conversion à facteur unique** appliquée aux températures.
- **Valeur arrondie au stockage.**
- **Comparaison entre dimensions** acceptée.
- **Unités mélangées dans un même agrégat**, sans conversion préalable.

**Contre-exemple.** Un champ « couple de serrage » est un nombre. La base de Lyon saisit des N·m, celle d'un partenaire des lbf·ft. Un rapport trie les constats par couple et compare à 120 : 90 lbf·ft paraissent inférieurs à 120 alors qu'ils valent 122 N·m. Aucune erreur n'est levée. C'est la structure du défaut qui a causé, selon la page de la NASA, la perte de Mars Climate Orbiter : deux logiciels qui échangent un nombre sans que l'unité attendue soit portée avec la valeur.

**Limites.** Un code normalisé ne couvre pas toutes les unités métier : les unités propres à un domaine ou à un tenant demandent une extension déclarée. Les grandeurs sans dimension (taux, rapports) et les comptages ne sont pas des quantités au sens strict. L'incertitude et la tolérance d'une mesure sont un autre sujet : une valeur canonique n'en porte pas. Les noms d'unités affichés se traduisent comme les autres libellés ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)). Et la métrologie légale impose parfois des unités et des arrondis précis.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ) | Un champ de quantité déclare dimension, unités autorisées et unité canonique |
| [2.14 Index](02-donnees-ressources.md#214-index) | La valeur canonique est celle que l'on indexe |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation vérifie l'unité, la dimension et les bornes |
| [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) | Une quantité est un objet-valeur : définie par sa valeur et son unité |
| [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) | Les noms d'unités se traduisent comme les autres libellés |
| [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche) | Le format d'affichage et l'unité préférée suivent le paramètre régional |
| [27.2 Séries temporelles, sous-échantillonnage et rétention](#272-séries-temporelles-sous-échantillonnage-et-rétention) | Une série temporelle porte l'unité de sa grandeur |
| [27.4 Monnaie et arrondis](#274-monnaie-et-arrondis) | Un montant est une quantité avec des règles propres : devise et arrondi |

### 5. Application pratique

**Situation initiale.** Alpha Air importe les limites de serrage d'une base partenaire. Les valeurs sont des nombres, sans unité ; les procédures de la base de Lyon sont en N·m, celles du partenaire en lbf·ft.

**Problème.** Comparer les relevés aux limites sans mélanger les unités, et rendre le résultat vérifiable.

**Application du concept.** Un champ de quantité avec dimension, unités autorisées et valeur canonique.

**Déroulé.**

1. L'équipe déclare le champ `tightening_torque` : dimension couple, unité canonique N·m, unités autorisées N·m et lbf·ft.
2. L'import du partenaire est mappé : la colonne de valeurs reçoit l'unité lbf·ft, déclarée par le fichier de correspondance.
3. À l'écriture, la plateforme calcule la valeur canonique et conserve la saisie.
4. Un technicien relève 90 lbf·ft sur le chantier. La comparaison à la limite de 120 N·m se fait en valeur canonique : 122,02 N·m, la limite est dépassée.
5. Le constat affiche la valeur saisie et sa conversion : « 90 lbf·ft (122,0 N·m) ».
6. La préférence d'unité de chaque personne règle l'affichage ; la valeur stockée ne change pas.
7. Un test refuse une valeur dont l'unité n'est pas dans la liste, et une comparaison entre un couple et une pression.

**Résultat.** Les limites se comparent sans ambiguïté, quelle que soit l'unité saisie, et chaque valeur reste vérifiable à la saisie.

**Limites.** La qualité dépend du fichier de correspondance : une unité mal déclarée à l'import reste fausse. La tolérance de l'outil de mesure n'est pas modélisée ici.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un nombre sans unité n'est-il pas une mesure ?
2. **Compréhension.** Qu'est-ce que la valeur canonique, et pourquoi la stocke-t-on avec la saisie ?
3. **Compréhension.** Pourquoi convertir des températures demande-t-il plus qu'un facteur ?
4. **Pourquoi.** Pourquoi refuse-t-on la conversion entre dimensions différentes ?
5. **Raisonnement pratique.** Un seuil de 120 N·m et un relevé de 90 lbf·ft : le seuil est-il dépassé, et comment la plateforme le détermine-t-elle ?

#### Réponses

1. Parce que le même nombre désigne des grandeurs différentes selon l'unité : sans elle, on ne peut ni comparer, ni additionner, ni contrôler un seuil. L'unité fait partie de la valeur.
2. C'est la valeur ramenée à l'unité de référence de la dimension. On la stocke avec la saisie pour garder ce que la personne a écrit tout en pouvant comparer, trier et indexer dans une unité unique.
3. Parce que le degré Celsius et le degré Fahrenheit sont reliés au kelvin par une fonction avec décalage, et non par un simple facteur ; de plus, un écart de température se convertit sans décalage, contrairement à une température.
4. Parce qu'un couple et une pression n'ont pas la même dimension : la conversion n'a pas de sens physique, et l'accepter masquerait une erreur de saisie ou de configuration.
5. 90 lbf·ft valent environ 122,02 N·m, donc le seuil est dépassé. La plateforme vérifie que les deux unités ont la dimension « couple », convertit le relevé en valeur canonique, puis compare à la limite exprimée dans la même unité.

## 27.4 Monnaie et arrondis

### 1. Comprendre simplement

Un **montant** (*money*) est une quantité décimale exacte accompagnée d'un code de **devise**. L'**arrondi** (*rounding*) est la règle qui ramène un résultat à la plus petite unité de la devise (le centime pour l'euro), avec un mode choisi : demi vers le haut, demi vers le pair, vers zéro. *Money and rounding* forment ensemble un type de champ : le montant sans règle d'arrondi explicite n'est pas fiable.

**Pourquoi cela existe.** Les nombres à virgule flottante ne représentent pas exactement 0,1 : les sommes dérivent. Les arrondis diffèrent d'une couche à l'autre, et un écart d'un centime entre une ligne, un total et un document suffit à bloquer un rapprochement. Le nombre de décimales dépend de la devise. Et diviser un montant en parts égales perd ou crée des centimes si l'on n'y prend garde.

**Problème résolu.** Représenter, calculer, répartir et échanger des montants sans perte, et décider une fois pour toutes où et comment l'on arrondit.

**Modèle mental.** Une caisse à compartiments, un par devise : on n'y mélange pas euros et yens, et chaque compartiment a sa plus petite pièce.

**Où l'analogie s'arrête.** Une caisse ne convertit pas. Les taux de change changent, et la conversion est une opération datée, avec une source.

**Exemple.** Une facture a trois lignes de 10,02 € hors taxes, avec une TVA de 20 %. En arrondissant la TVA ligne par ligne, on obtient 2,00 par ligne, soit 6,00 au total ; en l'arrondissant sur le total de 30,06 €, on obtient 6,01. Un centime d'écart : la règle doit être choisie et écrite.

**Les composants.**

1. un **montant exact** : décimal, ou entier en unité mineure ;
2. un **code de devise** ;
3. l'**exposant** de la devise (nombre de décimales) ;
4. un **mode d'arrondi** ;
5. un **point d'arrondi** : ligne, total, paiement ;
6. une **allocation** qui conserve le total ;
7. des **taux de change** datés et sourcés ;
8. un **format d'échange** sans perte : chaîne décimale.

**Objectif d'apprentissage :** vous pouvez représenter un montant sans flottant, choisir un mode et un point d'arrondi, répartir un montant sans perdre de centime, et dire pourquoi la devise porte le nombre de décimales.

### 2. Connaissances essentielles

#### Définition

- **Montant** : valeur décimale exacte associée à une devise, qui n'a de sens que dans cette devise.
- **Arrondi** : opération qui ramène une valeur décimale à une précision donnée, selon un mode déterminé, par exemple à l'unité mineure de la devise.

#### Idées fondamentales

1. **Décimal exact, jamais flottant.** Le montant se calcule en décimal ou en entier d'unités mineures.
2. **Un montant porte sa devise.** Les opérations vérifient qu'elle est la même.
3. **Le nombre de décimales dépend de la devise.** Zéro pour le yen, deux pour l'euro, trois pour le dinar koweïtien.
4. **L'arrondi est une règle explicite.** Un mode nommé, appliqué à un endroit défini.
5. **On calcule en précision pleine et l'on arrondit aux frontières.** Ligne, total, paiement : jamais au milieu d'un calcul.
6. **L'allocation conserve le total.** On répartit les restes plutôt que de les perdre.
7. **Un taux de change est une donnée datée.** Il porte sa source et sa date de validité.

#### Vocabulaire essentiel

- **Unité mineure** (*minor unit*) : plus petite subdivision d'une devise ; l'**exposant** est le nombre de décimales correspondant.
- **ISO 4217** : norme des codes de devises (alphabétiques de trois lettres et numériques) et de leur unité mineure.
- **Demi vers le haut** (*half up*) : à égalité, on arrondit à la valeur supérieure en valeur absolue.
- **Demi vers le pair** (*half even*, « arrondi bancaire ») : à égalité, on arrondit au chiffre pair le plus proche.
- **Allocation** (*allocation*) : répartition d'un montant en parts dont la somme est exactement le montant.
- **Taux de change** (*exchange rate*) : rapport de conversion entre deux devises, valable à un instant ou sur une période.

#### Relations de cause à effet

- Les montants sont des flottants. Les sommes dérivent, et `0,1 + 0,2` ne donne pas `0,3`.
- Chaque couche arrondit à sa façon. Le total à l'écran, celui de l'API et celui du PDF diffèrent d'un centime.
- La devise est omise. Un total additionne des euros et des yens sans que rien ne le signale.
- Une division en parts égales n'est pas allouée. Trois fois un tiers de 100,00 donne 99,99 : un centime disparaît.

#### Idées reçues

- **« Deux décimales partout. »** Non. Une table de la norme ISO 4217, reprise par Wikipédia (lue le 14 octobre 2026), donne 0 pour le yen, 3 pour les dinars bahreïnien et koweïtien, et 4 pour certaines unités de compte.
- **« L'arrondi bancaire est la règle. »** Non. C'est un mode parmi d'autres, et le choix dépend du domaine (fiscal, contractuel, comptable). Le module `decimal` de Python prend le demi vers le pair par défaut ; ce n'est pas une règle universelle.
- **« Un décimal en base règle tout. »** Non. Il évite la dérive des flottants ; l'arrondi, la devise et l'allocation restent à définir.

#### Principe clé

Un montant est un couple (décimal exact, devise) : on le calcule en précision pleine, on arrondit selon une règle écrite à des points définis, et l'on répartit sans perdre d'unité mineure.

#### Si vous ne retenez que trois choses

1. Un montant se représente en décimal exact ou en entier d'unités mineures, jamais en flottant, et il porte sa devise.
2. L'arrondi est une règle explicite : un mode et un point d'application, décidés avec la fiscalité et le métier.
3. Une allocation répartit les restes pour que la somme des parts égale le montant.

### 3. Explication technique détaillée

#### Représenter

| Représentation | Principe | Avantages | Précautions |
|---|---|---|---|
| Entier en unités mineures + devise | `1002` pour 10,02 EUR | Calcul entier, pas d'arrondi caché | L'exposant dépend de la devise ; les divisions sont à arrondir explicitement |
| Décimal exact + devise | `numeric(19,4)` et `char(3)` | Précision souple, lecture directe | Choisir l'échelle ; ne pas mélanger des échelles dans un calcul |
| Flottant | Représentation binaire | Aucun | Interdit pour les montants |

Pour le transport, on envoie le montant comme **chaîne décimale** : `{"amount": "1234.50", "currency": "EUR"}`. De nombreux outils lisent un nombre JSON comme un flottant ; une chaîne garde les chiffres exacts.

La page du module `decimal` de Python (consultée le 14 octobre 2026) appuie le choix du décimal : les nombres décimaux y sont représentés exactement, alors que `1.1` n'a pas de représentation exacte en binaire ; elle note que la somme `0.1 + 0.1 + 0.1 - 0.3` vaut exactement zéro en décimal, contre une valeur non nulle en binaire, et que le décimal est préféré pour la comptabilité. Elle insiste aussi sur la construction : un décimal construit à partir d'une chaîne garde les chiffres donnés, alors que construit à partir d'un flottant il reprend l'erreur binaire. La page de Martin Fowler sur le motif *Money* (consultée à la même date) pose le même problème : l'absence de type monétaire dans les bibliothèques courantes cause l'addition de devises différentes et la perte de petits montants à l'arrondi.

#### Les devises et leur exposant

La norme ISO 4217 définit des codes alphabétiques et numériques et l'unité mineure de chaque devise. D'après l'article de Wikipédia (secondaire ; la page de l'ISO n'a pas été lue), le yen (JPY) a un exposant 0, le dinar bahreïnien (BHD) et le dinar koweïtien (KWD) un exposant 3, et certaines unités de compte (CLF, UYW) un exposant 4 ; des codes préfixés par X désignent des cas particuliers (XAU, l'or ; XXX, l'absence de devise). La table de devises de la plateforme porte donc le code, l'exposant et la période de validité, tenue à jour à partir de la source officielle.

#### Arrondir : mode et point d'application

La même page `decimal` liste les modes d'arrondi : vers l'infini positif, vers zéro, vers l'infini négatif, demi vers zéro, demi vers le pair, demi vers le haut (loin de zéro), loin de zéro, et un mode particulier. Les résultats suivants ont été obtenus par exécution :

| Valeur | Précision | Demi vers le haut | Demi vers le pair | Vers zéro |
|---|---|---|---|---|
| 2,5 | entier | 3 | 2 | 2 |
| 3,5 | entier | 4 | 4 | 3 |
| 0,125 | deux décimales | 0,13 | 0,12 | 0,12 |
| 0,135 | deux décimales | 0,14 | 0,14 | 0,13 |

Le mode ne suffit pas : il faut aussi dire **où** l'on arrondit. Sur l'exemple de la facture (trois lignes de 10,02 € à 20 %), arrondir la TVA par ligne donne 6,00, l'arrondir sur le total de 30,06 € donne 6,01. Aucune des deux n'est « juste » en soi : la règle applicable dépend du régime fiscal et du contrat, et doit être confirmée avec la fiscalité. Une fois choisie, elle est inscrite dans la configuration et appliquée partout, y compris dans les exports et les documents ([18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents)).

#### Calculer en entiers et répartir

```typescript
const MINOR_UNITS: Record<string, number> = { EUR: 2, USD: 2, JPY: 0, KWD: 3 };

interface Money {
  minor: bigint; // montant en plus petite unité de la devise
  currency: string;
}

function exponent(currency: string): number {
  const e = MINOR_UNITS[currency];
  if (e === undefined) throw new Error(`devise inconnue : ${currency}`);
  return e;
}

function fromDecimalString(text: string, currency: string): Money {
  const e = exponent(currency);
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text);
  if (!m) throw new Error(`montant invalide : ${text}`);
  const frac = m[3] ?? "";
  if (frac.length > e) throw new Error(`trop de décimales pour ${currency} : ${text}`);
  const value = BigInt(m[2] + frac.padEnd(e, "0"));
  return { minor: m[1] === "-" ? -value : value, currency };
}

function toDecimalString(money: Money): string {
  const e = exponent(money.currency);
  const negative = money.minor < 0n;
  const abs = (negative ? -money.minor : money.minor).toString().padStart(e + 1, "0");
  const whole = abs.slice(0, abs.length - e);
  const frac = e > 0 ? "." + abs.slice(abs.length - e) : "";
  return `${negative ? "-" : ""}${whole}${frac}`;
}

function add(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error(`devises différentes : ${a.currency} et ${b.currency}`);
  return { minor: a.minor + b.minor, currency: a.currency };
}

type Rounding = "half_up" | "half_even";

// Multiplie par une fraction num/den et arrondit à l'unité mineure (montants positifs).
function mulRatio(money: Money, num: bigint, den: bigint, mode: Rounding): Money {
  const product = money.minor * num;
  let q = product / den;
  const twice = (product % den) * 2n;
  if (twice > den || (twice === den && (mode === "half_up" || q % 2n === 1n))) q += 1n;
  return { minor: q, currency: money.currency };
}

// Répartit un montant selon des poids sans perdre ni créer d'unité mineure.
function allocate(money: Money, weights: bigint[]): Money[] {
  const total = weights.reduce((a, b) => a + b, 0n);
  const shares = weights.map((w) => (money.minor * w) / total);
  let rest = money.minor - shares.reduce((a, b) => a + b, 0n);
  for (let i = 0; rest > 0n; i = (i + 1) % shares.length) {
    shares[i] += 1n;
    rest -= 1n;
  }
  return shares.map((minor) => ({ minor, currency: money.currency }));
}
```

Sur les essais : 10,02 EUR à 20 % donne 2,00 par ligne et 6,00 pour trois lignes, contre 6,01 sur le total de 30,06 ; répartir 100,00 EUR en trois parts égales donne 33,34, 33,33 et 33,33, dont la somme est 100,00 ; répartir 0,05 EUR en proportion 3:7 donne 0,02 et 0,03 ; 12,5 EUR divisés par 100 donnent 0,13 en demi vers le haut et 0,12 en demi vers le pair (le cas 0,125 du tableau) ; ajouter des euros et des yens lève une erreur de devises différentes ; et `0,1 + 0,2` en flottant donne `0,30000000000000004`. La convention de l'allocation (les restes vont aux premières parts) est un choix qu'il faut écrire : une autre convention donne d'autres centimes.

#### Stocker et convertir

```sql
CREATE TABLE invoice_line (
  invoice_id uuid         NOT NULL,
  line_no    integer      NOT NULL,
  currency   char(3)      NOT NULL,
  net_minor  bigint       NOT NULL,
  vat_rate   numeric(5,4) NOT NULL,
  vat_minor  bigint       NOT NULL,
  PRIMARY KEY (invoice_id, line_no),
  CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE TABLE exchange_rate (
  base       char(3)       NOT NULL,
  quote      char(3)       NOT NULL,
  valid_from timestamptz   NOT NULL,
  rate       numeric(18,8) NOT NULL,
  source     text          NOT NULL,
  PRIMARY KEY (base, quote, valid_from)
);
```

On stocke les montants en unités mineures avec leur devise, et le montant d'origine d'une conversion avec le taux qui l'a produite : le taux est une donnée datée ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) et sourcée, et un document converti référence le taux utilisé, pour qu'on puisse refaire le calcul.

**Modes de défaillance.**

- **Flottants** pour les montants.
- **Arrondi implicite** différent entre couches.
- **Devise absente** ou supposée.
- **Division sans allocation**, qui perd des centimes.
- **Taux sans date ni source.**
- **Exposant fixe** à deux décimales pour toutes les devises.

**Contre-exemple.** Une plateforme additionne en flottant les 1 200 lignes d'un devis de pièces, convertit en dollars avec un taux courant sans le consigner, puis arrondit sur chaque ligne à l'affichage. Le total de l'écran, celui de l'API et celui du document diffèrent de quelques centimes, et le client d'un autre pays en conteste un. Personne ne sait quel taux a servi. Des entiers d'unités mineures, un point d'arrondi unique et un taux consigné auraient donné trois fois le même total.

**Limites.** Les règles fiscales d'arrondi et de présentation varient selon les juridictions et les produits ; la plateforme les rend configurables mais ne les invente pas. L'arrondi de caisse (au multiple de cinq centimes, par exemple) est une règle de paiement, distincte de l'arrondi de calcul. Les devises changent (redénominations, fin de monnaies), et leurs exposants avec elles. L'affichage dépend de la région ([25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)). Enfin la facturation et la monétisation d'une plateforme relèvent d'un autre module du plan ([module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation)), non rédigé à ce jour.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [14.4 Entité et objet-valeur](14-domain-driven-design.md#144-entité-et-objet-valeur) | `Money` est l'exemple d'objet-valeur du parcours : montant, devise, arrondi explicite |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation vérifie la devise, l'échelle et les bornes |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les taux de change sont des données datées |
| [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents) | Les documents générés reprennent les montants arrondis selon la règle |
| [22.10 Modèle de coûts, attribution et coût de service](22-performance-echelle-economie.md#2210-modèle-de-coûts-attribution-et-coût-de-service) | Le modèle de coûts attribue des montants dans plusieurs devises |
| [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche) | L'affichage des montants suit le paramètre régional, sans changer la valeur |
| [27.3 Quantités et unités de mesure](#273-quantités-et-unités-de-mesure) | Un montant est une quantité avec devise et arrondi |
| [27.5 Stratégie d'identifiants et numérotation sans trou](#275-stratégie-didentifiants-et-numérotation-sans-trou) | La numérotation des factures accompagne les montants des documents émis |

### 5. Application pratique

**Situation initiale.** Alpha Air établit des devis de pièces avec des fournisseurs en euros et en dollars. Les lignes de devis sont additionnées dans le tableur, puis ressaisies : les totaux diffèrent de quelques centimes.

**Problème.** Obtenir un total unique et reproductible, quelle que soit la couche qui l'affiche, et répartir les frais de transport sans perdre de centime.

**Application du concept.** Un type de champ monétaire avec devise, unités mineures, mode d'arrondi et allocation.

**Déroulé.**

1. Le champ `unit_price` déclare un montant en unités mineures avec un code de devise, et un exposant lu dans la table des devises.
2. L'import refuse un nombre de décimales supérieur à l'exposant, plutôt que d'arrondir en silence.
3. La règle d'arrondi (demi vers le haut, par ligne, sur la TVA) est définie avec la fiscalité et inscrite dans la configuration du tenant.
4. Les lignes en dollars sont converties avec le taux du jour du devis ; le taux et sa source sont consignés avec le document.
5. Les frais de transport de 100,00 EUR sont répartis entre trois lignes au prorata de leur montant par une allocation : la somme des parts vaut 100,00.
6. Le total est la somme des lignes arrondies ; l'écran, l'API et le document affichent le même résultat.
7. Un test rejoue le devis et compare le total au centime près.

**Résultat.** Un total unique, reproductible et justifiable, avec le taux et la règle d'arrondi consignés.

**Limites.** La règle d'arrondi retenue peut différer de celle de l'administration fiscale d'un autre pays : le type la rend configurable, mais la décision reste fiscale.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi ne représente-t-on pas un montant en flottant ?
2. **Compréhension.** Quelle différence y a-t-il entre l'arrondi demi vers le haut et demi vers le pair ?
3. **Compréhension.** À quoi sert une allocation ?
4. **Pourquoi.** Pourquoi le nombre de décimales dépend-il de la devise ?
5. **Raisonnement pratique.** Trois lignes de 10,02 € à 20 % de TVA : combien de TVA, en arrondissant par ligne, puis sur le total ?

#### Réponses

1. Parce que le binaire ne représente pas exactement des valeurs décimales comme 0,1 : les sommes dérivent et les égalités deviennent fausses. Un décimal exact ou un entier d'unités mineures évite ce défaut.
2. À égalité exacte, le demi vers le haut arrondit toujours à la valeur supérieure en valeur absolue, alors que le demi vers le pair arrondit au chiffre pair le plus proche : 2,5 donne 3 dans le premier cas et 2 dans le second.
3. À répartir un montant en parts dont la somme est exactement le montant, en distribuant les restes d'unité mineure plutôt que de les perdre : 100,00 en trois parts donne 33,34, 33,33 et 33,33.
4. Parce que la plus petite unité en circulation diffère : le yen n'a pas de subdivision courante, l'euro en a deux décimales, et certains dinars en ont trois. Le montant stocké et affiché doit respecter l'exposant de sa devise.
5. Par ligne : 10,02 × 0,20 = 2,004, arrondi à 2,00 ; trois lignes donnent 6,00. Sur le total : 30,06 × 0,20 = 6,012, arrondi à 6,01. L'écart d'un centime montre qu'il faut décider et écrire le point d'arrondi.

## 27.5 Stratégie d'identifiants et numérotation sans trou

### 1. Comprendre simplement

Une **stratégie d'identifiants** (*identifier strategy*) choisit comment les ressources reçoivent leur identité : de façon **aléatoire** (*random*), **triable** (*sortable*) ou **lisible par les personnes** (*human-readable*). Une **numérotation sans trou** (*gapless numbering*) est une suite de numéros sans manque ni doublon, où chaque numéro suit exactement le précédent : c'est l'exigence typique d'une facture.

**Pourquoi cela existe.** L'identité technique, qui relie les données et que l'on ne montre pas, et le numéro métier, que l'on lit, dicte, cite et qu'un règlement peut encadrer, répondent à des besoins différents. Les confondre expose des compteurs séquentiels dans les adresses, ou impose à un système réparti une continuité qu'il ne sait pas tenir.

**Problème résolu.** Donner à chaque ressource une identité adaptée à son usage (jointure, URL, saisie, obligation), et tenir une continuité là où elle est exigée, sans la payer partout.

**Modèle mental.** Le numéro de série gravé sur une pièce, et le numéro du bon de livraison. Le premier identifie la pièce pour les machines : unique, opaque, jamais réutilisé. Le second se cite à voix haute, se classe dans l'ordre, et la règle comptable peut exiger qu'aucun ne manque.

**Où l'analogie s'arrête.** Un numéro gravé n'est pas attribué au moment de la fabrication par un système qui peut échouer à mi-chemin. L'attribution d'un numéro continu est une opération transactionnelle, avec les échecs qui vont avec.

**Exemple.** Une tâche a une clé interne de type UUID version 7, un numéro d'affichage `MT-1042` et un code court à dicter, `10J6`. Une facture a le numéro `F-2026-000123`, dans une série continue.

**Les composants.**

1. une **clé interne** : opaque, unique, de préférence triable ;
2. un **numéro d'affichage** par tenant ;
3. un **code lisible** avec alphabet sans ambiguïté et symbole de contrôle ;
4. des **séries** par tenant, par type de document et par période ;
5. un **compteur transactionnel** pour les séries continues ;
6. un **état d'annulation** : un document émis ne se supprime pas ;
7. un **contrôle** de continuité.

**Objectif d'apprentissage :** vous pouvez choisir un identifiant technique selon ses propriétés, concevoir un code lisible avec contrôle d'erreur, et expliquer pourquoi une séquence de base de données ne garantit pas une numérotation sans trou.

### 2. Connaissances essentielles

#### Définition

- **Stratégie d'identifiants** : règle qui détermine comment une ressource reçoit son identité : aléatoire, triable par le temps, séquentielle ou lisible, avec leurs propriétés d'unicité, d'ordre, de localité d'index et de fuite d'information.
- **Numérotation sans trou** : attribution de numéros successifs, uniques et sans manque, où l'émission d'un numéro et la création du document auquel il est rattaché réussissent ou échouent ensemble.

#### Idées fondamentales

1. **L'identité technique et le numéro métier sont deux choses.** Le premier relie, le second se lit et s'encadre.
2. **L'aléatoire disperse, le triable localise.** Le RFC 9562 note qu'un identifiant non ordonné dans le temps a une mauvaise localité dans l'index de la base.
3. **Un identifiant triable dévoile l'instant de création.** L'horodatage est dans l'identifiant.
4. **Un code lisible se conçoit pour les personnes.** Alphabet sans caractères ambigus, regroupement, symbole de contrôle.
5. **Un identifiant n'est pas un secret.** Le RFC 9562 interdit d'utiliser un UUID comme capacité de sécurité.
6. **Une séquence de base de données n'est pas sans trou.** Ses valeurs ne sont jamais annulées avec la transaction.
7. **La continuité a un coût.** Elle sérialise l'émission : on la réserve à ce qui l'exige.

#### Vocabulaire essentiel

- **UUID** (*universally unique identifier*) : identifiant de 128 bits, écrit en 36 caractères avec des tirets.
- **Localité d'index** (*index locality*) : proximité, dans l'index, des entrées créées à des instants proches ; elle réduit les pages touchées à l'insertion.
- **Séquence** (*sequence*) : objet de la base qui délivre des valeurs croissantes, sans garantie de continuité.
- **Série** (*series*) : suite de numéros distincte, par exemple par type de document ou par année.
- **Symbole de contrôle** (*check symbol*) : caractère calculé à partir du reste, qui détecte une erreur de saisie.
- **Trou** (*gap*) : numéro manquant dans une suite qui devrait être continue.

#### Relations de cause à effet

- Des UUID aléatoires servent de clé primaire d'une grosse table. Les insertions s'éparpillent dans l'index et le cache travaille mal.
- Des compteurs séquentiels sont exposés dans les adresses. Un tiers énumère les ressources et estime les volumes.
- Le numéro de facture vient d'une séquence. Une transaction qui échoue laisse un trou, et la règle de continuité est violée.
- Le numéro est attribué à la création du brouillon. Chaque brouillon supprimé laisse un trou.

#### Idées reçues

- **« Un UUID est un secret. »** Non. Le RFC 9562 demande de ne pas supposer qu'un UUID est difficile à deviner et interdit de l'utiliser comme capacité de sécurité ; pour une opération de sécurité, il recommande la version aléatoire.
- **« Un identifiant triable est une faiblesse. »** Non. Il ne change pas l'unicité ; il dévoile l'instant de création, ce qui compte pour un identifiant exposé.
- **« La séquence de la base donne des numéros sans trou. »** Non. La documentation de PostgreSQL le dit : les appels `nextval` et `setval` ne sont jamais annulés, donc une séquence ne convient pas quand une attribution sans trou est nécessaire.

#### Principe clé

On distingue une identité technique (opaque, unique, de préférence triable) d'un numéro métier (lisible, parfois continu) ; la continuité s'obtient par un compteur transactionnel lié à l'émission, jamais par une séquence.

#### Si vous ne retenez que trois choses

1. La clé interne est opaque et, de préférence, triable par le temps ; le numéro lisible est un autre champ.
2. Un identifiant n'est jamais un secret : l'autorisation vient de l'authentification, pas de l'identifiant.
3. Une numérotation sans trou se fait par un compteur incrémenté dans la transaction d'émission, et un document émis s'annule, il ne se supprime pas.

### 3. Explication technique détaillée

#### Les identifiants techniques

| Famille | Exemple | Ordre | Localité d'index | Fuite | Usage |
|---|---|---|---|---|---|
| Aléatoire | UUID version 4 | Aucun | Mauvaise | Aucune | Jeton non devinable (avec un générateur sûr) ; petites tables |
| Triable par le temps | UUID version 7 | Par instant de création, à la milliseconde | Bonne | Instant de création | Clé primaire par défaut |
| Séquentiel | Entier de séquence | Par attribution | Excellente | Volume, rythme, énumération | Usage interne ; à ne pas exposer |
| Lisible | `MT-1042`, code court | Selon la règle | Sans objet | Volume | Affichage, citation, dictée |

Le RFC 9562 (mai 2024, qui rend obsolète le RFC 4122) définit les UUID : 128 bits, écrits avec 32 chiffres hexadécimaux et 4 tirets. La version 4 est issue de nombres aléatoires ou pseudo-aléatoires. La version 7 place en tête un horodatage Unix sur 48 bits en millisecondes, suivi de bits aléatoires, et vise la bonne localité dans les index de bases de données ; la monotonie à l'intérieur d'une même milliseconde n'est garantie que par des compteurs ou des champs complémentaires facultatifs. Côté sécurité, le texte demande de ne pas supposer qu'un UUID est difficile à deviner, de ne pas l'employer comme capacité de sécurité, et d'utiliser un générateur aléatoire cryptographique.

```typescript
import { randomBytes } from "node:crypto";

// UUID version 7 (RFC 9562) : 48 bits d'horodatage en millisecondes, puis du hasard.
function uuidV7(unixMs: number): string {
  const bytes = randomBytes(16);
  bytes[0] = Math.floor(unixMs / 2 ** 40) & 0xff;
  bytes[1] = Math.floor(unixMs / 2 ** 32) & 0xff;
  bytes[2] = Math.floor(unixMs / 2 ** 24) & 0xff;
  bytes[3] = Math.floor(unixMs / 2 ** 16) & 0xff;
  bytes[4] = Math.floor(unixMs / 2 ** 8) & 0xff;
  bytes[5] = unixMs & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante 10
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
```

Sur des horodatages croissants, le préfixe de 13 caractères (les 48 bits de temps) est croissant : 01a139a3-d280, puis 01a139a3-d281 à la milliseconde suivante, puis 01a139a4-bce0 une minute plus tard. Trier les identifiants dans l'ordre alphabétique les trie dans l'ordre de création. Le caractère 15 vaut `7` (version) et le caractère 20 est l'un de `8`, `9`, `a`, `b` (variante), et les identifiants font bien 36 caractères. Cette esquisse n'ajoute pas de compteur : deux identifiants créés dans la même milliseconde ne sont pas ordonnés entre eux.

#### Les codes lisibles

Pour ce que l'on dicte, étiquette ou recopie, on utilise un alphabet sans ambiguïté. La notation Base32 de Crockford (page consultée le 14 octobre 2026) retire les lettres I, L, O et U, et lit à la saisie I et L comme 1 et O comme 0 ; elle accepte les deux casses, ignore les tirets, et propose un symbole de contrôle optionnel : le nombre modulo 37, avec cinq symboles supplémentaires (`*`, `~`, `$`, `=` et `U`) pour les valeurs de contrôle de 32 à 36.

```typescript
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CHECK = ALPHABET + "*~$=U";

function encode(n: number): string {
  if (n === 0) return "0";
  let out = "";
  while (n > 0) {
    out = ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out;
}

function decode(text: string): number {
  let n = 0;
  for (const raw of text.toUpperCase().replaceAll("-", "")) {
    const c = raw === "I" || raw === "L" ? "1" : raw === "O" ? "0" : raw;
    const v = ALPHABET.indexOf(c);
    if (v < 0) throw new Error(`symbole invalide : ${raw}`);
    n = n * 32 + v;
  }
  return n;
}

function withCheck(n: number): string {
  return encode(n) + CHECK[n % 37];
}

function isValid(code: string): boolean {
  const body = code.slice(0, -1);
  const check = code.slice(-1).toUpperCase();
  try {
    return CHECK[decode(body) % 37] === check;
  } catch {
    return false;
  }
}
```

Le numéro 1042 s'écrit `10J` en base 32 ; son symbole de contrôle est `6` (1042 modulo 37 vaut 6), d'où le code `10J6`. Un code où deux caractères sont permutés (`01J6`) est rejeté par le contrôle ; un code dont le dernier caractère est faux (`1Z`) aussi ; et `10i` se lit `101`, soit 1025, comme le dit la règle de lecture indulgente. Un tel code est une **étiquette** pour les personnes : on le dérive d'un numéro d'affichage ou d'un compteur, on ne le tire pas de la clé interne.

#### Identités et tenants

Un identifiant interne unique à l'échelle de la plateforme évite les collisions entre tenants ; un numéro d'affichage est unique par tenant, souvent avec un préfixe de type (`MT-`). Les compteurs séquentiels ne sont pas exposés dans les adresses et les API publiques ([10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest)) : on y met la clé opaque. Toute lecture reste bornée par le tenant du contexte ([5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)), quelle que soit la forme de l'identifiant.

#### Numérotation sans trou

L'exigence vient souvent du droit. L'article 226 de la directive 2006/112/CE (texte consulté sur legislation.gov.uk le 14 octobre 2026) liste parmi les mentions requises sur une facture « un numéro séquentiel, fondé sur une ou plusieurs séries, qui identifie la facture de façon unique ». La page de service-public.gouv.fr consacrée aux mentions obligatoires (vérifiée le 11 août 2026) demande, pour la France, un numéro unique « fondé sur une séquence chronologique et continue ». Des guides professionnels précisent que la suite ne doit pas avoir de rupture, que des séries distinctes sont admises quand les conditions de l'activité le justifient, et que les avoirs et acomptes suivent la même règle ; ces précisions n'ont pas été confrontées au texte officiel. La règle varie d'un pays à l'autre : on la fait valider par le service juridique pour chaque juridiction desservie.

La documentation de PostgreSQL (consultée le 14 octobre 2026) est explicite sur les séquences : les appels qui avancent une séquence ne sont jamais annulés, donc elles ne conviennent pas à une attribution sans trou ; les valeurs mises en cache par session et non utilisées sont perdues à la fin de la session, et avec une mise en cache supérieure à un, les valeurs peuvent être délivrées dans le désordre. La page cite comme alternative le verrouillage exclusif d'une table qui contient un compteur, qu'elle dit beaucoup plus coûteux. C'est exactement la solution à retenir, pour les seuls documents qui l'exigent :

```sql
CREATE TABLE document_counter (
  tenant_id   uuid    NOT NULL,
  series      text    NOT NULL,
  year        integer NOT NULL,
  last_number integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, series, year)
);

CREATE TABLE invoice (
  invoice_id uuid        PRIMARY KEY,
  tenant_id  uuid        NOT NULL,
  series     text        NOT NULL,
  year       integer     NOT NULL,
  number     integer     NOT NULL,
  status     text        NOT NULL CHECK (status IN ('issued', 'voided')),
  issued_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, series, year, number)
);

UPDATE document_counter
SET last_number = last_number + 1
WHERE tenant_id = $1 AND series = $2 AND year = $3
RETURNING last_number;

SELECT year, series, number + 1 AS first_missing_number
FROM invoice i
WHERE tenant_id = $1
  AND NOT EXISTS (SELECT 1 FROM invoice j WHERE j.tenant_id = i.tenant_id AND j.series = i.series AND j.year = i.year AND j.number = i.number + 1)
  AND number < (SELECT max(number) FROM invoice k WHERE k.tenant_id = i.tenant_id AND k.series = i.series AND k.year = i.year);
```

L'incrément du compteur et l'insertion de la facture se font dans **la même transaction** : si elle échoue, les deux sont annulés et le numéro n'a pas été consommé. L'incrément pose un verrou sur la ligne du compteur, ce qui sérialise l'émission au sein d'une série : une seconde transaction attend la première, et obtient le même numéro si la première échoue. C'est la source du coût : le débit d'émission d'une série est borné par la durée de la transaction. D'où les règles de conception :

1. **attribuer le numéro à l'émission**, pas à la création du brouillon ; un brouillon n'a pas de numéro et peut être supprimé ;
2. **ne rien faire de long** entre l'incrément et la validation (le rendu du document se fait après) ;
3. **annuler, ne pas supprimer** : un document émis est annulé par un avoir qui prend le numéro suivant de la série, ou passe à l'état annulé, avec son numéro conservé ;
4. **partager en séries** là où la règle le permet, pour réduire la contention ;
5. **contrôler** la continuité (la dernière requête du bloc SQL liste le premier numéro manquant de chaque trou) et alerter ;
6. **un seul écrivain par série** : une numérotation continue ne se répartit pas entre régions en écriture simultanée ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).

Sur un jeu d'essai de numéros 1, 2, 3, 5, 6 et 9, la requête de contrôle renvoie 4 et 7 : les premiers manques de chaque trou.

**Modes de défaillance.**

- **UUID aléatoires** en clé primaire de grosses tables.
- **Compteurs exposés** dans les adresses publiques.
- **Séquence de base** pour une numérotation exigée continue.
- **`MAX(numéro) + 1`** sans verrou : doublons en concurrence.
- **Numéro attribué au brouillon**, suppression de documents émis.
- **Identifiant utilisé comme secret** d'accès.

**Contre-exemple.** Un module de facturation prend le numéro dans une séquence PostgreSQL, puis génère le PDF, puis valide. Un incident d'écriture annule dix transactions : dix numéros ont disparu de la suite. À l'audit, l'écart est visible, et rien ne l'explique. Un compteur incrémenté dans la transaction d'émission, avec une requête de contrôle, aurait évité les trous ou les aurait détectés le jour même.

**Limites.** La continuité n'empêche pas la fraude à elle seule : elle rend une omission visible. Les règles de numérotation, de séries et de dématérialisation varient d'un État à l'autre. Un système réparti en écriture multiple ne tient pas une continuité simple. Et le débit d'une série continue reste borné par la sérialisation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère) | La clé primaire et les clés étrangères portent l'identité technique |
| [2.14 Index](02-donnees-ressources.md#214-index) | La localité d'index explique l'intérêt des identifiants triables |
| [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) | La transaction atomique lie l'incrément du compteur à l'émission du document |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le verrou sur la ligne du compteur sérialise les émissions concurrentes |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Une reprise d'émission ne doit pas consommer un second numéro |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Les lectures restent bornées par le tenant, quelle que soit la forme de l'identifiant |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Les documents émis suivent le calendrier de conservation |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Une série continue impose un écrivain unique, ce qui contraint le multi-région |
| [27.4 Monnaie et arrondis](#274-monnaie-et-arrondis) | Les montants et les numéros se retrouvent sur les mêmes documents émis |

### 5. Application pratique

**Situation initiale.** Alpha Air veut des clés internes performantes, un numéro de tâche lisible par les techniciens, et des factures de prestations numérotées sans trou.

**Problème.** Trois besoins d'identité différents, dont un contraint par la règle comptable.

**Application du concept.** Une clé UUID version 7, un numéro d'affichage par tenant, un code court avec contrôle, et un compteur transactionnel pour les factures.

**Déroulé.**

1. La clé primaire de chaque ressource est un UUID version 7 généré par l'application : les insertions restent groupées dans l'index.
2. Le numéro d'affichage des tâches (`MT-1042`) est tiré d'un compteur par tenant ; des trous y sont tolérés.
3. Le code court `10J6` apparaît sur l'étiquette imprimée des pièces ; sa saisie est contrôlée.
4. Les factures ont une série `F` par tenant et par année ; le numéro est attribué à l'émission par le compteur, dans la transaction qui insère la facture.
5. Un brouillon n'a pas de numéro et peut être supprimé ; une facture émise ne se supprime jamais.
6. Une erreur sur une facture émise est corrigée par un avoir qui prend le numéro suivant de la série.
7. Une requête de contrôle liste chaque jour les trous éventuels ; une alerte part s'il y en a.

**Résultat.** Des insertions performantes, des numéros lisibles et protégés contre les erreurs de saisie, et une suite de factures continue et vérifiable.

**Limites.** Deux écrivains sur la même série (deux régions actives) ne sont pas compatibles avec la règle : on désigne une région d'émission par série.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un identifiant technique et un numéro métier ?
2. **Compréhension.** Pourquoi préfère-t-on un UUID version 7 à un UUID version 4 comme clé primaire ?
3. **Compréhension.** À quoi sert le symbole de contrôle d'un code lisible ?
4. **Pourquoi.** Pourquoi une séquence de base de données ne garantit-elle pas une numérotation sans trou ?
5. **Raisonnement pratique.** Deux transactions émettent une facture en même temps dans la même série ; la première échoue après avoir incrémenté le compteur. Que se passe-t-il pour la seconde, et pourquoi n'y a-t-il pas de trou ?

#### Réponses

1. L'identifiant technique relie les données, est opaque et reste interne ; le numéro métier se lit, se cite et peut être encadré par une règle (continuité, séries). Les deux sont des champs distincts.
2. Parce que la version 7 place l'instant de création en tête : les nouvelles entrées s'ajoutent à la fin de l'index, avec une bonne localité, alors que des identifiants aléatoires s'éparpillent dans l'index. Le prix est que l'instant de création est lisible dans l'identifiant.
3. À détecter une erreur de saisie ou de transcription (caractère faux, permutation) sans consulter la base : le contrôle recalcule le symbole à partir du reste du code.
4. Parce que les valeurs délivrées par une séquence ne sont jamais annulées avec la transaction, et que les valeurs mises en cache sont perdues quand une session se termine : des numéros disparaissent de la suite.
5. La seconde transaction attend le verrou sur la ligne du compteur ; quand la première échoue et annule son incrément, la seconde incrémente à partir de la même valeur et obtient le numéro attendu. Il n'y a pas de trou car l'incrément et l'émission réussissent ou échouent ensemble.

## 27.6 Texte riche

### 1. Comprendre simplement

Le **texte riche** (*rich text*) est du texte mis en forme et structuré : titres, listes, gras, liens, mentions, images. Un champ de texte riche permet d'écrire un commentaire, une procédure ou une description avec cette mise en forme, et non en texte brut.

**Pourquoi cela existe.** Les procédures, les commentaires et les descriptions gagnent à être lisibles : listes numérotées, avertissements, liens vers un constat. Mais le texte riche est le type de champ le plus risqué : son contenu est interprété par un navigateur, peut contenir du code exécutable, doit se chercher, s'exporter, se comparer, se traduire, et rester accessible.

**Problème résolu.** Accepter de la mise en forme dans les données sans ouvrir la porte à l'injection de code, et en gardant un contenu exploitable : cherchable, versionnable, convertible.

**Modèle mental.** Un formulaire à cases autorisées. On ne reçoit pas une lettre libre : on reçoit un document dont les éléments (paragraphe, liste, lien) sont ceux que le formulaire prévoit, et rien d'autre.

**Où l'analogie s'arrête.** Un formulaire papier est lu par une personne. Ici, le contenu est lu par des programmes (navigateurs, moteurs de recherche, générateurs de documents) qui l'interprètent chacun à leur manière.

**Exemple.** Une description de tâche contient un titre, deux phrases dont une en gras, une mention du constat `fd_204` et un lien vers la procédure MP-214.

**Les composants.**

1. un **modèle de document** : un arbre de nœuds et de marques ;
2. un **schéma** qui dit ce qui est permis ;
3. un **format de stockage** ;
4. une **validation** et un **assainissement** ;
5. un **rendu** vers HTML ou vers d'autres formats ;
6. une **extraction de texte brut** ;
7. des **références structurées** : mentions, fichiers ;
8. une **protection en profondeur** côté navigateur.

**Objectif d'apprentissage :** vous pouvez décrire un document de texte riche comme un arbre validé par un schéma, expliquer pourquoi on ne stocke pas du HTML brut, et énumérer les protections d'un champ de texte riche.

### 2. Connaissances essentielles

#### Définition

**Texte riche** : contenu textuel structuré en nœuds (paragraphes, titres, listes, liens, mentions) et en marques (gras, italique), dont la forme est contrainte par un schéma, stocké dans un format que la plateforme valide, rend et dérive en texte brut.

#### Idées fondamentales

1. **Un document est un arbre, pas une chaîne de HTML.** Le guide de ProseMirror décrit un document comme un arbre de nœuds, avec des marques portées par le texte.
2. **Un schéma dit ce qui est permis.** Types de nœuds et de marques, imbrications autorisées.
3. **On assainit ce qui vient de l'extérieur.** L'OWASP recommande une bibliothèque d'assainissement dédiée et de ne pas modifier le contenu après.
4. **Défense en profondeur.** Politique de sécurité du contenu et types de confiance complètent l'assainissement.
5. **Le format de stockage est un choix.** Document structuré, HTML assaini, ou Markdown, avec les risques propres à chacun.
6. **On dérive le texte brut.** Pour la recherche, les notifications, les aperçus.
7. **Les références sont structurées.** Une mention est un lien vers une entité, revérifié par les droits, pas une chaîne.

#### Vocabulaire essentiel

- **Nœud** (*node*) : élément structurel d'un document : paragraphe, titre, liste.
- **Marque** (*mark*) : mise en forme portée par un texte : gras, italique, lien.
- **Schéma** (*schema*) : description des nœuds et des marques permis et de leurs imbrications.
- **Assainissement** (*sanitization*) : retrait des éléments et attributs non autorisés d'un contenu avant son rendu.
- **Mention** (*mention*) : référence structurée à une entité de la plateforme.
- **Politique de sécurité du contenu** (*Content Security Policy*, CSP) : en-tête qui limite les sources de scripts et de ressources qu'une page peut charger.

#### Relations de cause à effet

- Le contenu est stocké en HTML brut et rendu tel quel. Un script dans un commentaire s'exécute dans la session de chaque lecteur.
- L'assainissement n'a lieu que dans le navigateur de l'auteur. Un appel direct à l'API contourne la protection.
- Le texte est modifié après assainissement. La protection est annulée, comme le note l'OWASP.
- Le texte brut n'est pas dérivé. La recherche et les notifications affichent du balisage.

#### Idées reçues

- **« Markdown est sûr. »** Non. La spécification CommonMark (version 0.31.2) précise qu'un bloc HTML est traité comme du HTML brut qui n'est pas échappé en sortie : un Markdown peut contenir du HTML actif.
- **« Échapper les caractères suffit. »** Cela suffit pour du texte brut. Pour du texte riche, l'échappement casse la mise en forme voulue : c'est l'assainissement, selon l'OWASP, qui s'applique.
- **« Un éditeur riche valide le contenu. »** Non. Il ne valide que ce qu'il produit : un client peut envoyer n'importe quoi à l'API.

#### Principe clé

Le texte riche est un document structuré validé par un schéma côté serveur, rendu par une liste d'éléments autorisés, jamais du HTML brut déclaré fiable.

#### Si vous ne retenez que trois choses

1. On stocke un arbre de nœuds validé par un schéma, pas du HTML libre.
2. La validation et l'assainissement se font côté serveur, et le rendu ne produit que des éléments de la liste autorisée.
3. Le texte brut, les mentions et les liens sont dérivés ou structurés : recherche, notifications et droits en dépendent.

### 3. Explication technique détaillée

#### Le modèle de document

Le guide de ProseMirror (consulté le 14 octobre 2026) décrit un document comme un arbre de nœuds, où le contenu en ligne est une séquence plate dont les marques sont des métadonnées portées par les nœuds de texte. Un **schéma** précise les types de nœuds et de marques permis et la façon dont ils s'imbriquent, par des expressions de contenu. Les nœuds sont des valeurs immuables : modifier un document produit un nouveau document qui partage les parties inchangées, et les modifications passent par des étapes appliquées dans une transaction. Le document se sérialise vers le DOM et en JSON. Cette structure sert de modèle ici, que l'on emploie ou non cette bibliothèque : un arbre, un schéma, des valeurs, une sérialisation JSON.

```json
{
  "type": "doc",
  "content": [
    { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Inspection du train avant" }] },
    { "type": "paragraph", "content": [
      { "type": "text", "text": "Voir le constat " },
      { "type": "mention", "attrs": { "entity_id": "fd_204", "label": "fd_204" } },
      { "type": "text", "text": " et la procédure ", "marks": [{ "type": "strong" }] },
      { "type": "text", "text": "MP-214", "marks": [{ "type": "link", "attrs": { "href": "https://docs.example.com/mp-214" } }] }
    ] }
  ]
}
```

#### Les formats de stockage

| Format | Avantages | Risques | Position |
|---|---|---|---|
| HTML brut | Simple à afficher | Exécution de code injecté ; rendu dépendant du navigateur | À éviter |
| HTML assaini, stocké après assainissement | Affichage direct | Dépend de la qualité et de la mise à jour de l'assainisseur ; schémas difficiles à faire évoluer | Acceptable avec liste blanche stricte |
| Document structuré (JSON) validé par un schéma | Validation exacte, rendu maîtrisé, extraction facile | Demande un éditeur et un rendu | Recommandé |
| Markdown | Lisible, simple | HTML brut possible ; extensions variables | Seulement avec assainissement du rendu |

#### Valider côté serveur

```typescript
interface Mark {
  type: string;
  attrs?: Record<string, string>;
}

interface DocNode {
  type: string;
  attrs?: Record<string, string | number>;
  text?: string;
  marks?: Mark[];
  content?: DocNode[];
}

interface NodeRule {
  children: string[]; // types de nœuds autorisés comme enfants
  marks: string[]; // types de marques autorisés sur un texte enfant
}

const SCHEMA: Record<string, NodeRule> = {
  doc: { children: ["paragraph", "heading", "bullet_list"], marks: [] },
  paragraph: { children: ["text", "mention"], marks: ["strong", "em", "link"] },
  heading: { children: ["text"], marks: ["strong"] },
  bullet_list: { children: ["list_item"], marks: [] },
  list_item: { children: ["paragraph"], marks: [] },
  mention: { children: [], marks: [] },
  text: { children: [], marks: [] },
};
const ALLOWED_SCHEMES = ["http:", "https:", "mailto:"];
const MAX_DEPTH = 8;

function isSafeLink(href: string | undefined): boolean {
  try {
    return ALLOWED_SCHEMES.includes(new URL(href ?? "").protocol);
  } catch {
    return false;
  }
}

function validate(node: DocNode, depth = 0, errors: string[] = []): string[] {
  const rule = SCHEMA[node.type];
  if (!rule) {
    errors.push(`nœud non autorisé : ${node.type}`);
    return errors;
  }
  if (depth > MAX_DEPTH) errors.push("profondeur excessive");
  if (node.type === "mention" && !/^[a-z]+_[a-z0-9]+$/.test(String(node.attrs?.entity_id ?? ""))) {
    errors.push("mention : identifiant invalide");
  }
  for (const child of node.content ?? []) {
    if (!rule.children.includes(child.type)) {
      errors.push(`enfant interdit : ${child.type} dans ${node.type}`);
    }
    for (const mark of child.type === "text" ? child.marks ?? [] : []) {
      if (!rule.marks.includes(mark.type)) {
        errors.push(`marque non autorisée : ${mark.type} dans ${node.type}`);
      }
      if (mark.type === "link" && !isSafeLink(mark.attrs?.href)) {
        errors.push(`lien refusé : ${mark.attrs?.href}`);
      }
    }
    validate(child, depth + 1, errors);
  }
  return errors;
}

function toPlainText(node: DocNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "mention") return `@${node.attrs?.label ?? node.attrs?.entity_id}`;
  const parts = (node.content ?? []).map(toPlainText);
  return ["paragraph", "heading", "list_item"].includes(node.type) ? parts.join("") + "\n" : parts.join("");
}
```

Le document d'exemple de la section précédente passe sans erreur, et `toPlainText` en tire « Inspection du train avant » puis « Voir le constat @fd_204 et la procédure MP-214 ». Un document qui contient un lien `javascript:alert(1)` et un nœud de type `script` est refusé avec trois messages : le lien refusé, l'enfant interdit dans le document, et le nœud non autorisé. Une marque d'italique sur un titre est refusée, car le schéma ne la permet que dans les paragraphes.

Cette validation a deux propriétés : elle est une **liste blanche** (tout ce qui n'est pas permis est refusé, plutôt que l'inverse) et elle s'exécute côté serveur, quel que soit le client. Le rendu, lui aussi, ne produit que des éléments connus à partir des nœuds validés : le HTML est construit, pas transmis.

#### Assainir et se défendre en profondeur

Quand il faut accepter du HTML (contenu importé, éditeur existant), l'OWASP (fiche sur la prévention des attaques XSS, consultée le 14 octobre 2026) recommande une bibliothèque d'assainissement dédiée plutôt qu'un échappement, car l'échappement détruirait la mise en forme voulue ; elle met en garde contre toute modification du contenu après l'assainissement, qui peut annuler la protection, et rappelle de tenir ces bibliothèques à jour. Pour l'affichage, elle demande un encodage adapté à chaque contexte (corps HTML, attributs, JavaScript, URL, CSS). En défense en profondeur, elle présente la politique de sécurité du contenu comme une couche supplémentaire qui ne doit pas être la défense principale, et, sur les navigateurs qui la prennent en charge, les types de confiance, qui obligent les écritures dangereuses à passer par une politique vérifiée.

#### Mentions et fichiers

Une mention est un nœud qui contient l'identifiant d'une entité, jamais un texte libre. À l'affichage, la plateforme résout l'identifiant, vérifie que la personne a le droit de voir l'entité ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) et affiche son libellé à jour ; sinon elle affiche un repli neutre. Les images et pièces jointes sont des références vers des fichiers ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)) dont l'accès est contrôlé au moment de la lecture ([18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)). La même mécanique sert les mentions des fils de discussion ([17.14 Commentaires, mentions, fils de discussion et fil d'activité](17-collaboration-communication-travail.md#1714-commentaires-mentions-fils-de-discussion-et-fil-dactivité)). L'édition à plusieurs mains sur un même document ([17.15 Présence et édition collaborative](17-collaboration-communication-travail.md#1715-présence-et-édition-collaborative)) repose sur ce modèle de document structuré.

**Modes de défaillance.**

- **HTML brut** stocké et rendu sans filtre.
- **Validation côté client seulement.**
- **Liste noire** de balises au lieu d'une liste blanche.
- **Modification après assainissement.**
- **Liens de schémas dangereux** (`javascript:`) acceptés.
- **Mentions en texte libre**, sans droits revérifiés.

**Contre-exemple.** Un commentaire est saisi dans un éditeur riche et envoyé à l'API sous forme de HTML ; la plateforme le stocke et l'affiche par une affectation directe de HTML. Un client écrit directement à l'API un commentaire contenant une image dont le chargement exécute un script. Le responsable qualité l'ouvre : le script s'exécute dans sa session. L'assainissement n'existait que dans l'éditeur du navigateur, que l'appel direct a contourné.

**Limites.** Un schéma figé gêne l'évolution : ajouter un type de nœud demande une migration des documents existants ([2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)). L'import depuis des traitements de texte apporte des structures que le schéma refuse, et il faut décider de les aplatir. L'accessibilité du contenu produit (titres, textes alternatifs) dépend de l'auteur autant du schéma. Et un assainisseur est un composant à tenir à jour, comme toute dépendance de sécurité ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation côté serveur est l'autorité sur la structure du document |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | L'évolution du schéma de document demande une migration |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | Les bibliothèques d'assainissement sont des dépendances de sécurité à tenir à jour |
| [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) | Les modèles de message reprennent le texte riche et ses variables |
| [17.14 Commentaires, mentions, fils de discussion et fil d'activité](17-collaboration-communication-travail.md#1714-commentaires-mentions-fils-de-discussion-et-fil-dactivité) | Les commentaires et mentions reposent sur des nœuds structurés |
| [17.15 Présence et édition collaborative](17-collaboration-communication-travail.md#1715-présence-et-édition-collaborative) | L'édition collaborative manipule un modèle de document structuré |
| [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents) | La génération de documents rend le texte riche vers d'autres formats |
| [19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation) | La recherche indexe le texte brut dérivé |
| [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) | Le texte riche traduisible suit les règles des libellés |

### 5. Application pratique

**Situation initiale.** Les techniciens d'Alpha Air veulent des descriptions de tâche avec listes, gras et liens, et pouvoir mentionner un constat. L'équipe envisage de stocker le HTML produit par l'éditeur.

**Problème.** Offrir de la mise en forme sans ouvrir la porte à l'injection, et garder un contenu cherchable.

**Application du concept.** Un champ de texte riche stocké en document structuré, validé par un schéma côté serveur.

**Déroulé.**

1. Le champ `description` déclare le type `rich_text` et son schéma : paragraphes, titres de niveau 2 à 4, listes à puces, gras, italique, liens, mentions.
2. L'éditeur produit un document structuré ; le serveur le valide à chaque écriture, quel que soit le client.
3. Un lien n'est accepté que pour les schémas `http`, `https` et `mailto`.
4. Une mention contient l'identifiant de l'entité ; à l'affichage, elle est résolue avec les droits de la personne.
5. À l'écriture, la plateforme dérive le texte brut pour la recherche ([19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation)) et pour les extraits de notification ([17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation)).
6. Le rendu HTML est construit nœud par nœud à partir de la liste blanche ; l'en-tête de politique de sécurité du contenu restreint les sources de scripts.
7. Un jeu de tests injecte des documents hostiles (balise de script, lien `javascript:`, profondeur excessive) et vérifie leur refus.

**Résultat.** Des descriptions mises en forme, un contenu recherchable, des mentions qui respectent les droits, et un refus systématique des contenus hors schéma.

**Limites.** L'import de procédures existantes en HTML demande un convertisseur et une revue de ce qui est aplati ou refusé.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi stocke-t-on un document structuré plutôt que du HTML ?
2. **Compréhension.** Qu'est-ce qu'un schéma de document, et que valide-t-il ?
3. **Compréhension.** Pourquoi la validation doit-elle avoir lieu côté serveur ?
4. **Pourquoi.** Pourquoi un Markdown n'est-il pas sûr par lui-même ?
5. **Raisonnement pratique.** Un commentaire contient un lien `javascript:alert(1)`. Où et comment le refuse-t-on ?

#### Réponses

1. Parce qu'un arbre validé par un schéma se contrôle exactement, se rend de façon maîtrisée, se convertit et se transforme en texte brut ; du HTML libre mélange structure et code exécutable, et dépend de l'interprétation du navigateur.
2. C'est la description des types de nœuds et de marques permis et de la façon dont ils s'imbriquent. Il valide que chaque nœud est autorisé, que ses enfants sont permis, que les marques le sont, et que les valeurs (par exemple les liens) respectent les règles.
3. Parce que l'API est appelable par n'importe quel client : seule la validation du serveur s'impose à tous. Une validation dans l'éditeur du navigateur se contourne.
4. Parce que la spécification CommonMark traite un bloc HTML comme du HTML brut non échappé en sortie : un document Markdown peut porter du code actif, qu'il faut assainir au rendu.
5. À la validation côté serveur : la règle sur les liens n'accepte que les schémas `http`, `https` et `mailto`, et refuse le nœud avec le message « lien refusé ». Le rendu, qui ne produit que des éléments autorisés, n'aurait de toute façon pas produit le lien.

## 27.7 Vocabulaires contrôlés et graphe de propriétés

### 1. Comprendre simplement

Un **vocabulaire contrôlé** (*controlled vocabulary*) est une liste gérée de termes, chacun avec un identifiant stable, des étiquettes par langue, des synonymes et, souvent, une hiérarchie : les types de défaut, les familles de systèmes, les causes. Un **graphe de propriétés** (*property graph*) est un modèle où les entités sont des nœuds et leurs relations des liens typés et orientés, qui portent eux aussi des propriétés ; il se prête aux réseaux et aux parcours.

**Pourquoi cela existe.** Un texte libre donne « fuite hydrau », « fuite d'huile hydraulique » et « hydraulique, fuite » : trois valeurs pour une même chose, donc des rapports faux. Une énumération figée dans le schéma est trop rigide pour des tenants différents et demande une migration à chaque ajout. Et les relations plusieurs-à-plusieurs de profondeur variable (quelles pièces, de quel lot, de quel fournisseur, sur quels aéronefs ?) se parcourent mal par des jointures fixes.

**Problème résolu.** Obtenir des valeurs cohérentes, multilingues et évolutives pour les termes, et des questions de parcours pour les réseaux de relations.

**Modèle mental.** Pour le vocabulaire : un dictionnaire de référence maintenu, avec ses renvois et ses synonymes. Pour le graphe : le plan d'un réseau de métro, où les stations sont les nœuds, les lignes les liens, et où l'on cherche des chemins.

**Où l'analogie s'arrête.** Un dictionnaire papier est figé et un plan de métro est un seul réseau. Un vocabulaire d'une plateforme est versionné, personnalisé par tenant et mis en correspondance avec des vocabulaires externes ; un graphe y est un modèle parmi d'autres, souvent porté par des tables.

**Exemple.** Le vocabulaire des types de défaut contient « Fuite », « Fuite hydraulique » (plus spécifique que « Fuite ») et « Fuite du vérin » (plus spécifique que la précédente), avec des libellés français et anglais et un synonyme « Écoulement ». Dans le graphe, une pièce est installée sur un aéronef, issue d'un lot, fourni par un fournisseur.

**Les composants.**

1. des **concepts** à identifiant stable, rattachés à un schéma de vocabulaire ;
2. des **étiquettes** par langue : préférée, alternatives, cachées ;
3. des **relations** : plus général, plus spécifique, associé ;
4. un **statut** et une **version** : actif, déprécié, remplacé par ;
5. des **correspondances** avec des vocabulaires externes ;
6. un **type de champ** qui référence les concepts, avec restriction à une branche ;
7. des **nœuds** et des **liens** typés pour les réseaux ;
8. des **requêtes de parcours**, avec limite de profondeur et détection de cycles.

**Objectif d'apprentissage :** vous pouvez définir un vocabulaire contrôlé avec ses étiquettes et sa hiérarchie, référencer ses concepts par identifiant dans un champ, et décrire un graphe de propriétés et ses parcours.

### 2. Connaissances essentielles

#### Définition

- **Vocabulaire contrôlé** : ensemble gouverné de concepts, chacun identifié de façon stable, étiqueté par langue, relié à d'autres par des relations de généralité ou d'association, utilisé pour qualifier des données de façon cohérente.
- **Graphe de propriétés** : modèle de données dans lequel des nœuds, qui peuvent porter des étiquettes et des propriétés, sont reliés par des liens orientés, typés, qui portent eux aussi des propriétés.

#### Idées fondamentales

1. **Un vocabulaire est un ensemble de concepts, pas de chaînes.** Identifiant stable, libellés par langue, définition.
2. **Un concept a un libellé préféré par langue, et des synonymes.** La norme SKOS pose au plus un libellé préféré par langue et par concept.
3. **Généralité et association sont des relations distinctes.** « Plus général que » structure une hiérarchie ; « associé à » relie sans hiérarchie.
4. **On référence par identifiant, pas par libellé.** Le libellé change, l'identifiant non.
5. **Un vocabulaire évolue.** Versions, dépréciation, remplacement, correspondances avec des référentiels externes.
6. **Un graphe représente des entités et des relations typées.** Les liens sont des éléments à part entière, avec propriétés.
7. **Un graphe peut vivre dans des tables.** Une table de liens et des requêtes récursives suffisent longtemps, à condition de gérer les cycles.

#### Vocabulaire essentiel

- **Concept** (*concept*) : unité de sens d'un vocabulaire, identifiée de façon stable.
- **Libellé préféré, alternatif, caché** (*preferred, alternative, hidden label*) : forme d'affichage, synonymes visibles et variantes de recherche (fautes de frappe, abréviations).
- **Plus général, plus spécifique** (*broader, narrower*) : relation hiérarchique entre concepts.
- **Correspondance** (*mapping*) : lien entre un concept et un concept d'un autre vocabulaire, plus ou moins exact.
- **Nœud, lien, propriété** (*node, relationship, property*) : éléments d'un graphe de propriétés.
- **Parcours** (*traversal*) : suivi de liens de nœud en nœud pour répondre à une question de chemin.

#### Relations de cause à effet

- Les valeurs sont saisies en texte libre. Les regroupements, les filtres et les statistiques portent sur des variantes.
- Le vocabulaire est une énumération du schéma. Chaque ajout est une migration, et un tenant ne peut pas avoir ses propres termes.
- La hiérarchie contient un cycle. Une requête récursive naïve ne se termine pas.
- Un terme est supprimé. Les données qui le référencent perdent leur sens, faute de statut « déprécié » et de remplacement.

#### Idées reçues

- **« Une liste déroulante suffit. »** Une liste sans identifiants stables, sans langues, sans hiérarchie ni gouvernance se dégrade : c'est un vocabulaire sans gestion.
- **« Un graphe demande une base de graphes. »** Non. Des tables de liens et des requêtes récursives couvrent beaucoup de besoins ; une base de graphes se justifie par le volume et la profondeur des parcours.
- **« Hiérarchie et association, c'est pareil. »** Non. SKOS distingue le lien hiérarchique, dont la fermeture transitive est un autre lien, du lien associatif, qui est symétrique et non transitif.

#### Principe clé

Les valeurs qualifiantes sont des concepts à identifiant stable, gouvernés et versionnés ; les réseaux de relations sont des nœuds et des liens typés que l'on parcourt avec des garde-fous.

#### Si vous ne retenez que trois choses

1. Un vocabulaire contrôlé référence des concepts par identifiant, avec des libellés par langue et une hiérarchie.
2. Un vocabulaire évolue : statuts, remplacements, correspondances et gouvernance par couches.
3. Un graphe se parcourt avec une profondeur bornée et une détection de cycles, qu'il soit porté par des tables ou par une base de graphes.

### 3. Explication technique détaillée

#### Le modèle de vocabulaire

La recommandation SKOS du W3C (18 août 2009, consultée le 14 octobre 2026) est un modèle de données pour partager des systèmes d'organisation de connaissances : thésaurus, schémas de classification, taxonomies. Ses éléments utiles ici :

| Élément SKOS | Rôle | Règle ou remarque |
|---|---|---|
| `Concept`, `ConceptScheme` | Concepts et leur schéma | Un concept appartient à zéro, un ou plusieurs schémas |
| `prefLabel`, `altLabel`, `hiddenLabel` | Libellés préféré, alternatif, caché | Au plus un libellé préféré par langue |
| `broader`, `narrower` | Hiérarchie directe | Non transitifs par convention ; les versions transitives servent à l'inférence |
| `related` | Association | Symétrique, non transitif |
| `exactMatch`, `closeMatch` | Correspondances | Les correspondances exactes sont transitives, les proches non |
| `notation` | Code | Par convention, deux concepts d'un schéma n'ont pas la même notation |

On en tire un modèle relationnel simple :

```sql
CREATE TABLE concept (
  concept_id  uuid PRIMARY KEY,
  scheme_id   uuid NOT NULL,
  notation    text NOT NULL,
  status      text NOT NULL CHECK (status IN ('active', 'deprecated')),
  replaced_by uuid REFERENCES concept (concept_id),
  UNIQUE (scheme_id, notation)
);

CREATE TABLE concept_label (
  concept_id uuid NOT NULL REFERENCES concept (concept_id),
  lang       text NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('pref', 'alt', 'hidden')),
  text       text NOT NULL,
  PRIMARY KEY (concept_id, lang, kind, text)
);

CREATE UNIQUE INDEX concept_one_pref_per_language ON concept_label (concept_id, lang) WHERE kind = 'pref';

CREATE TABLE concept_relation (
  from_id uuid NOT NULL REFERENCES concept (concept_id),
  to_id   uuid NOT NULL REFERENCES concept (concept_id),
  kind    text NOT NULL CHECK (kind IN ('broader', 'related')),
  PRIMARY KEY (from_id, to_id, kind)
);
```

L'index unique partiel traduit la règle « un libellé préféré par langue ». Le statut et le champ `replaced_by` portent l'évolution : un concept déprécié n'est plus proposé à la saisie, mais les données qui le référencent restent lisibles et se migrent vers son remplaçant.

#### Un type de champ qui référence des concepts

Un champ de type vocabulaire déclare le schéma de vocabulaire, éventuellement la branche autorisée (par exemple « Fuite » et ses descendants), la cardinalité (une ou plusieurs valeurs) et la politique pour les concepts dépréciés. À l'écriture, la validation ([2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) vérifie que le concept existe, appartient au schéma, est dans la branche et est actif. On stocke l'identifiant du concept ; à l'affichage, on résout l'étiquette préférée dans la langue de la personne avec la chaîne de repli ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)). Les vocabulaires d'un tenant se superposent à ceux de la plateforme par couches ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)).

#### Parcourir une hiérarchie

```typescript
interface Concept {
  id: string;
  scheme: string;
  labels: Record<string, { pref: string; alt?: string[] }>;
  broader: string[]; // parents directs
  status: "active" | "deprecated";
  replacedBy?: string;
}

function descendants(rootId: string, concepts: Map<string, Concept>): { ids: string[]; cycle: boolean } {
  const children = new Map<string, string[]>();
  for (const c of concepts.values()) {
    for (const parent of c.broader) {
      children.set(parent, [...(children.get(parent) ?? []), c.id]);
    }
  }
  const seen = new Set<string>([rootId]);
  const out: string[] = [];
  let cycle = false;
  const stack = [rootId];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    for (const child of children.get(current) ?? []) {
      if (seen.has(child)) {
        cycle = true;
        continue;
      }
      seen.add(child);
      out.push(child);
      stack.push(child);
    }
  }
  return { ids: out.sort(), cycle };
}

function label(concept: Concept, chain: string[]): string {
  for (const lang of chain) {
    const l = concept.labels[lang];
    if (l) return l.pref;
  }
  return concept.id;
}
```

Sur un vocabulaire d'exemple (`leak`, `leak_hydraulic`, `leak_actuator`, `leak_fuel` et `seep`, déprécié et remplacé par `leak`), les descendants de `leak` sont les quatre autres concepts, sans cycle. Le libellé de `leak_fuel`, qui n'existe qu'en anglais, est « Fuel leak » avec la chaîne français puis anglais ; celui de `leak_actuator`, qui n'existe qu'en français, est « Fuite du vérin » avec la chaîne anglais puis français. Si une erreur d'édition déclare `leak` plus spécifique que `leak_actuator`, la fonction termine et signale le cycle, grâce à l'ensemble des concepts déjà vus. En SQL, la requête récursive équivalente utilise la clause de détection de cycle :

```sql
WITH RECURSIVE descendants(concept_id) AS (
    SELECT from_id FROM concept_relation WHERE kind = 'broader' AND to_id = $1
  UNION ALL
    SELECT r.from_id
    FROM concept_relation r
    JOIN descendants d ON r.to_id = d.concept_id
    WHERE r.kind = 'broader'
) CYCLE concept_id SET is_cycle USING path
SELECT DISTINCT concept_id FROM descendants WHERE NOT is_cycle;
```

La documentation de PostgreSQL (consultée le 14 octobre 2026) décrit la forme d'une requête récursive (un terme non récursif, une union, un terme récursif), le risque de non-terminaison sur des données cycliques, et la clause `CYCLE`, qui ajoute à la sortie une colonne de cycle et un chemin.

#### Le graphe de propriétés

La documentation de Neo4j (consultée le 14 octobre 2026) décrit le modèle : des **nœuds** qui représentent les entités et portent zéro, une ou plusieurs étiquettes ; des **relations** qui relient un nœud source à un nœud cible, avec une direction, un type et des propriétés facultatives ; des **propriétés**, paires clé-valeur sur les nœuds et sur les relations ; et des **parcours**, qui suivent les relations pour répondre à des questions de chemin. La norme ISO/IEC 39075:2024 (GQL), publiée en avril 2024 d'après les catalogues de normes, définit un langage de requête et de définition pour les graphes de propriétés ; les produits ont leurs propres langages, plus anciens.

Dans une base relationnelle, un graphe se représente par une table de liens, avec un index dans le sens inverse :

```sql
CREATE TABLE graph_edge (
  tenant_id uuid  NOT NULL,
  from_id   uuid  NOT NULL,
  to_id     uuid  NOT NULL,
  type      text  NOT NULL,
  props     jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (tenant_id, from_id, to_id, type)
);

CREATE INDEX graph_edge_reverse ON graph_edge (tenant_id, to_id, type);

WITH RECURSIVE impacted(node_id, depth) AS (
    SELECT to_id, 1 FROM graph_edge WHERE tenant_id = $1 AND from_id = $2 AND type = 'INSTALLED_ON'
  UNION ALL
    SELECT e.to_id, i.depth + 1
    FROM graph_edge e
    JOIN impacted i ON e.from_id = i.node_id
    WHERE e.tenant_id = $1 AND e.type = 'INSTALLED_ON' AND i.depth < 6
)
SELECT DISTINCT node_id FROM impacted;
```

La requête d'analyse d'impact suit les liens `INSTALLED_ON` depuis une pièce, avec une profondeur limitée à six pour borner le coût et éviter qu'un cycle ne boucle indéfiniment. Le filtre par tenant est dans chaque branche : un graphe ne franchit jamais la frontière du tenant ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).

#### Quand passer à une base de graphes

| Critère | Tables de liens | Base de graphes |
|---|---|---|
| Profondeur de parcours | Quelques niveaux | Nombreux niveaux, chemins complexes |
| Volume de liens | Millions | Beaucoup plus, avec des parcours fréquents |
| Compétences et exploitation | Celles de la base existante | Nouvelle technologie à exploiter |
| Intégration aux droits et à l'audit | Déjà en place | À reconstruire |

**Modes de défaillance.**

- **Texte libre** pour des valeurs qui devraient être des concepts.
- **Vocabulaire figé dans le schéma**, avec migration à chaque ajout.
- **Étiquette utilisée comme clé** : un renommage casse les données.
- **Cycle** dans la hiérarchie, requête récursive sans garde-fou.
- **Concept supprimé** au lieu d'être déprécié et remplacé.
- **Graphe sans filtre de tenant** dans chaque étape du parcours.

**Contre-exemple.** Le champ « type de défaut » est un texte libre. Après dix-huit mois, il contient 140 variantes de « fuite hydraulique », et le rapport de fiabilité par type compte les mêmes événements sous des noms différents. Un vocabulaire contrôlé, avec ses synonymes et sa hiérarchie, aurait permis de saisir un concept, de rechercher « Écoulement » et de retrouver « Fuite », et de regrouper par branche.

**Limites.** La gouvernance d'un vocabulaire est un travail : qui l'édite, qui valide les ajouts, comment les tenants étendent un vocabulaire partagé sans le fragmenter. Les correspondances avec des référentiels externes sont rarement exactes. Un graphe n'est utile que si l'on a des questions de parcours ; sinon, des relations simples suffisent ([2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)). Et les langages de requête de graphes diffèrent d'un produit à l'autre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence) | Les relations et références sont la base ; le graphe les généralise pour les parcours |
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | La hiérarchie simple est le cas particulier d'un graphe à parent unique |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation vérifie qu'un concept existe, est actif et dans la branche permise |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Le vocabulaire et le graphe respectent la frontière du tenant |
| [19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé) | La recherche exploite les synonymes et les libellés cachés |
| [20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données) | Le catalogue de données et le lignage sont des graphes de métadonnées |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les vocabulaires du paquet et du tenant se superposent par couches |
| [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) | Les libellés des concepts suivent la chaîne de repli de langue |
| [27.1 Données géospatiales, système de référence spatial et index spatial](#271-données-géospatiales-système-de-référence-spatial-et-index-spatial) | Les zones et les positions peuvent être des nœuds d'un graphe de lieux |

### 5. Application pratique

**Situation initiale.** Alpha Air saisit le type de défaut en texte libre. Les rapports de fiabilité sont inexploitables, et un client partenaire demande de rapprocher les types avec son propre référentiel.

**Problème.** Rendre les types de défaut cohérents, multilingues et évolutifs, et répondre à une question d'impact : quels aéronefs ont reçu des pièces d'un lot suspect ?

**Application du concept.** Un vocabulaire contrôlé des types de défaut avec hiérarchie et correspondances, et une table de liens pour le graphe des pièces.

**Déroulé.**

1. L'équipe qualité définit le vocabulaire : concepts identifiés, libellés français et anglais, synonymes, hiérarchie « Fuite » vers « Fuite hydraulique » vers « Fuite du vérin ».
2. Le champ `defect_type` référence un concept, avec restriction à la branche « Défaut » et validation à l'écriture.
3. Les concepts anciens sont dépréciés avec un remplaçant ; les données existantes sont migrées par un lot idempotent.
4. Les correspondances avec le référentiel du partenaire sont enregistrées comme correspondances exactes ou proches, avec leur confiance.
5. Le rapport de fiabilité regroupe par branche : « Fuite » inclut tous ses descendants.
6. Le graphe des pièces (installée sur, issue du lot, fournie par) est porté par une table de liens ; la requête d'impact part du lot suspect et remonte vers les aéronefs, avec profondeur limitée.
7. Un test vérifie l'absence de cycle à chaque publication du vocabulaire.

**Résultat.** Des types de défaut cohérents, des rapports par branche, et une réponse à la question d'impact en une requête bornée.

**Limites.** Le travail de gouvernance du vocabulaire est continu ; et la qualité des correspondances avec le référentiel du partenaire se vérifie par échantillon.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui distingue un vocabulaire contrôlé d'une liste de valeurs ?
2. **Compréhension.** Pourquoi référence-t-on un concept par son identifiant et non par son libellé ?
3. **Compréhension.** Quels sont les éléments d'un graphe de propriétés ?
4. **Pourquoi.** Pourquoi une requête récursive sur une hiérarchie a-t-elle besoin d'un garde-fou contre les cycles ?
5. **Raisonnement pratique.** Un terme du vocabulaire doit disparaître car il est remplacé par un autre. Que fait-on des données qui le référencent ?

#### Réponses

1. Il est géré : chaque terme est un concept à identifiant stable, avec des libellés par langue, des synonymes, une hiérarchie, un statut et un historique, alors qu'une simple liste n'est qu'un ensemble de chaînes.
2. Parce que le libellé change (renommage, traduction, correction) alors que l'identifiant reste : référencer par libellé casserait les données à chaque modification.
3. Des nœuds (avec étiquettes et propriétés), des liens orientés et typés entre nœuds (avec propriétés), et des parcours qui suivent les liens pour répondre à des questions de chemin.
4. Parce qu'un cycle (A plus général que B, et B plus général que A) fait que la requête retrouve indéfiniment les mêmes nœuds et ne se termine pas ; un ensemble de nœuds déjà vus, une clause de détection de cycle ou une profondeur maximale la fait terminer.
5. On ne supprime pas le concept : on le déprécie, avec un champ « remplacé par », et l'on migre les données qui le référencent vers le remplaçant par un traitement idempotent. Le concept reste lisible pour les données historiques.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| GeoJSON : système WGS 84, ordre des coordonnées, antiméridien, précision, règle de la main droite | RFC 7946 (août 2016) | https://www.rfc-editor.org/rfc/rfc7946.html | 27.1 |
| Géométrie et géographie, SRID, table des systèmes, index spatial | Manuel de PostGIS, gestion des données | https://postgis.net/docs/using_postgis_dbmanagement.html | 27.1 |
| Systèmes de référence EPSG:4326, EPSG:3857, EPSG:2154 | Registre EPSG (epsg.io) | https://epsg.io/4326 (et /3857, /2154) | 27.1 |
| Partitionnement : méthodes, suppression et détachement, nombre de partitions | Documentation de PostgreSQL, Table Partitioning | https://www.postgresql.org/docs/current/ddl-partitioning.html | 27.2 |
| Index BRIN | Documentation de PostgreSQL, BRIN Indexes | https://www.postgresql.org/docs/current/brin.html | 27.2 |
| Politique de rétention de blocs | Documentation de TimescaleDB (Tiger Data), data retention | https://www.tigerdata.com/docs/reference/timescaledb/data-retention | 27.2 |
| Unités de mesure : codes, unités spéciales, annotations, unités arbitraires | UCUM, version 2.2 du 17 juin 2024 | https://ucum.org/ucum | 27.3 |
| Perte de Mars Climate Orbiter | NASA, page de la mission | https://science.nasa.gov/mission/mars-climate-orbiter/ | 27.3 |
| Décimal exact, modes d'arrondi, construction depuis une chaîne | Documentation de Python, module decimal | https://docs.python.org/3/library/decimal.html | 27.4 |
| Motif Money : mélange de devises et arrondi | M. Fowler, Money | https://martinfowler.com/eaaCatalog/money.html | 27.4 |
| Codes de devises et unités mineures | ISO 4217, d'après l'article de Wikipédia (secondaire) | https://en.wikipedia.org/wiki/ISO_4217 | 27.4 |
| UUID versions 4 et 7, sécurité | RFC 9562 (mai 2024) | https://www.rfc-editor.org/rfc/rfc9562.html | 27.5 |
| Alphabet lisible et symbole de contrôle | D. Crockford, Base32 | https://www.crockford.com/base32.html | 27.5 |
| Séquences et numérotation sans trou | Documentation de PostgreSQL, CREATE SEQUENCE | https://www.postgresql.org/docs/current/sql-createsequence.html | 27.5 |
| Numéro séquentiel de facture dans l'Union | Directive 2006/112/CE, article 226 (legislation.gov.uk) | https://www.legislation.gov.uk/eudr/2006/112/article/226 | 27.5 |
| Numéro unique de facture en France | service-public.gouv.fr, mentions obligatoires (vérifié le 11 août 2026) | https://entreprendre.service-public.gouv.fr/vosdroits/F31808 | 27.5 |
| Assainissement HTML, encodage par contexte, défense en profondeur | OWASP, Cross Site Scripting Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html | 27.6 |
| Modèle de document : arbre, schéma, valeurs immuables | Guide de ProseMirror | https://prosemirror.net/docs/guide/ | 27.6 |
| HTML brut dans Markdown | Spécification CommonMark 0.31.2 | https://spec.commonmark.org/0.31.2/ | 27.6 |
| Vocabulaires : concepts, libellés, hiérarchie, correspondances | SKOS Reference, recommandation du W3C (18 août 2009) | https://www.w3.org/TR/skos-reference/ | 27.7 |
| Modèle de graphe de propriétés | Documentation de Neo4j, concepts de bases de graphes | https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/ | 27.7 |
| Requêtes récursives et détection de cycles | Documentation de PostgreSQL, WITH Queries | https://www.postgresql.org/docs/current/queries-with.html | 27.7 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Les coordonnées des sites (LYS, TLS, MRS, CDG, GVA) sont approchées et d'exemple ; le rayon terrestre de 6 371 km et la formule de haversine sont des conventions courantes, non relues dans une source.
- L'ordre des arguments de `ST_MakePoint` (longitude puis latitude) n'est pas énoncé par la page PostGIS consultée.
- Les définitions du pied international, de la livre avoirdupois et de l'accélération normale sont des définitions usuelles, non relues ; les facteurs de conversion ont été recalculés.
- Les codes UCUM ont été relevés dans les tables et les index de la spécification, lue en partie (les 200 000 premiers caractères de 262 102) ; le code `kg` n'a pas été retrouvé comme entrée distincte.
- La page de l'ISO 4217 n'a pas été lue : les exposants viennent de l'article de Wikipédia, lu en partie (les 100 000 premiers caractères de 233 315).
- Les règles fiscales d'arrondi ne sont pas traitées ; l'exemple de TVA est illustratif.
- La règle française de numérotation vient d'une page de service-public.gouv.fr ; le fondement exact dans le code général des impôts, la possibilité de séries distinctes et le traitement des avoirs viennent de guides professionnels, non confrontés à Légifrance. Les règles des autres États membres n'ont pas été étudiées.
- Les formats d'identifiants triables autres que l'UUID version 7 (ULID, KSUID) ne sont pas traités.
- L'interaction entre la rétention de la table brute et les agrégats continus d'un moteur spécialisé n'a pas été vérifiée : la page consultée n'en parle pas.
- La norme ISO/IEC 39075:2024 (GQL) est connue par des extraits de catalogues de normes, non lue.
- Les valeurs d'exemple : durées de rétention, nombres de capteurs, budgets, rayons, nombres de lignes.
- Les extraits de code TypeScript ont été exécutés sur les valeurs d'exemple données ; les scripts SQL ont été analysés syntaxiquement (dialecte PostgreSQL), sans exécution (PostGIS et pgvector non installés) ; la requête de détection de trous a été essayée sur SQLite.
