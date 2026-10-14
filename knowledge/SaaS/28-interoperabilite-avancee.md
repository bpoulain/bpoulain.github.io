# Module 28 — Interopérabilité avancée

> **Question directrice.** Comment échanger durablement avec des écosystèmes qui ont leurs propres standards, sans que chaque intégration devienne une dette ?

## Présentation du module

**Objectif.** Les secteurs ont leurs standards d'échange, et les intégrations durables reposent sur des contrats de données explicites. Le parcours les cite en passant : HL7 FHIR et OPC UA tiennent chacun une ligne ([15.3 Études de cas comparées, santé, industrie et logistique](15-cas-application.md#153-études-de-cas-comparées-santé-industrie-et-logistique)) ; les connecteurs, l'ETL et la capture des changements sont traités ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs), [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)) ; les contrats de schéma sont mentionnés ([10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest), [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur)). Ce module va plus loin sur six sujets : les **normes d'échange sectorielles**, la **correspondance et le modèle canonique**, la **plateforme de flux d'événements**, le **registre de schémas et la compatibilité**, la **spécification d'API asynchrone et le contrat de données**, et enfin l'**intégration sans code et la réconciliation**. Le fil conducteur est un principe : on isole ce qui est externe à la frontière, on rend les accords explicites et vérifiables, et on mesure les écarts plutôt que de les supposer absents.

**Prérequis.** Les webhooks ([7.5 Webhook](07-evenements-automatisation.md#75-webhook)), le versionnement d'API ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)), les connecteurs et adaptateurs ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)), la synchronisation, l'ETL, l'import et l'export ([10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)) et les systèmes externes et le système de référence ([10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)). Sont utiles les messages et files ([7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente)), le bus d'événements ([7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)), les nouvelles tentatives et l'idempotence des consommateurs ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) et le contrat de données dans sa dimension de gouvernance ([20.6 Données de référence et contrat de données](20-gouvernance-donnees-conformite.md#206-données-de-référence-et-contrat-de-données)).

**Un mot, plusieurs sens.** Quatre mots changent de sens. Un **contrat** est ici un accord technique et de service entre un producteur et des consommateurs, pas le contrat commercial. Un **schéma** est la description d'un message échangé, pas celle d'une table ([2.2 Type et schéma](02-donnees-ressources.md#22-type-et-schéma)). Une **partition** est une subdivision ordonnée d'un flux d'événements, pas une partition de table ([22.5 Partitionnement, clé de partition et rééquilibrage](22-performance-echelle-economie.md#225-partitionnement-clé-de-partition-et-rééquilibrage)). Un **modèle canonique** est un format d'échange commun, pas le modèle de domaine d'un contexte délimité ([14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité)). La **réconciliation** désigne ici la comparaison de deux jeux de données censés concorder, pas le rapprochement bancaire en comptabilité, qui en est un cas.

**Ordre retenu.** Trois groupes : se comprendre, transporter et faire évoluer, contractualiser et fiabiliser.

```text
Se comprendre              normes sectorielles ─ correspondance, transformation, modèle canonique
Transporter et évoluer     flux d'événements, partitions, groupes ─ registre de schémas, compatibilité
Contractualiser, fiabiliser  spécification d'API asynchrone, contrat de données ─ sans code, réconciliation
```

| Groupe | Question de l'équipe |
|---|---|
| Se comprendre | Quelle langue parle le partenaire, et comment traduit-on sans que sa langue envahisse le modèle de la plateforme ? |
| Transporter et faire évoluer | Comment diffuser des événements à plusieurs consommateurs, dans l'ordre utile, et changer leur forme sans les casser ? |
| Contractualiser et fiabiliser | Comment écrire, vérifier et mesurer l'accord, laisser les administrateurs assembler des flux, et détecter les écarts ? |

**Références.** Les documentations, normes et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Les noms de systèmes, de messages et de champs des exemples sont fictifs ; les résultats de calcul présentés ont été obtenus par exécution des extraits donnés.

## Sommaire du module

- [28.1 Normes d'échange sectorielles](#281-normes-déchange-sectorielles)
- [28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)
- [28.3 Plateforme de flux d'événements, partitions et groupes de consommateurs](#283-plateforme-de-flux-dévénements-partitions-et-groupes-de-consommateurs)
- [28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité)
- [28.5 Spécification d'API asynchrone et contrat de données](#285-spécification-dapi-asynchrone-et-contrat-de-données)
- [28.6 Plateforme d'intégration sans code et réconciliation](#286-plateforme-dintégration-sans-code-et-réconciliation)

## 28.1 Normes d'échange sectorielles

### 1. Comprendre simplement

Une **norme d'échange sectorielle** (*sector exchange standard*) est une convention partagée par un secteur pour représenter et transmettre ses données : HL7 FHIR en santé, OPC UA en industrie, UN/EDIFACT en commerce et en transport, ATA Spec 2000 et S1000D en aéronautique. Elle définit un vocabulaire (objets, champs, codes), un format, une manière d'échanger (interfaces, messages), et souvent des **profils** (sous-ensembles contraints) et des tests de conformité.

**Pourquoi cela existe.** Sans norme, chaque paire d'organisations négocie ses formats, et chaque nouvelle relation recommence. Avec une norme, un partenaire parle « la langue du secteur », et un outil écrit pour elle fonctionne chez plusieurs. Mais une norme est un accord entre organisations, pas un modèle de données interne : elle contient des options, des extensions et des versions, que la plateforme ne doit pas importer telles quelles dans son cœur.

**Problème résolu.** Échanger avec des écosystèmes sectoriels sans inventer un format par partenaire, et sans que les évolutions d'un standard imposent de réécrire le modèle de la plateforme.

**Modèle mental.** Une langue véhiculaire : l'anglais des échanges aériens, par exemple. Chacun garde sa langue chez soi et parle la langue commune aux frontières.

**Où l'analogie s'arrête.** Une langue évolue lentement et par l'usage. Une norme évolue par versions publiées, avec des profils et des variantes locales : deux partenaires qui « parlent FHIR » peuvent ne pas se comprendre s'ils n'ont pas aligné leurs profils.

**Exemple.** Alpha Air reçoit des certificats de remise en service de ses fournisseurs de pièces, des messages de commande par un partenaire de transport, et, dans la variante hospitalière du cours, des ressources FHIR d'un système clinique. Chaque flux passe par un adaptateur propre au standard ; le cœur de la plateforme garde son propre modèle.

**Les composants.**

1. le **vocabulaire** et le modèle de la norme ;
2. le **format** (syntaxe) ;
3. le **mode d'échange** : interface, messages, documents ;
4. les **profils** et guides de mise en œuvre ;
5. les **versions** et leur cycle de publication ;
6. les **tests de conformité** ;
7. un **adaptateur** à la frontière ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)) ;
8. la **correspondance** avec le modèle interne ([28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)).

**Objectif d'apprentissage :** vous pouvez dire ce qu'est une norme d'échange et ce qu'elle ne fournit pas, distinguer norme, profil et version, et décider où placer l'adaptateur.

### 2. Connaissances essentielles

#### Définition

**Norme d'échange sectorielle** : spécification, maintenue par un organisme ou une communauté d'un secteur, qui fixe comment représenter, structurer et transmettre des informations entre organisations, avec son vocabulaire, sa syntaxe, son mode d'échange et, en général, ses profils, ses versions et ses moyens de vérifier la conformité.

#### Idées fondamentales

1. **Une norme est un accord entre organisations, pas un modèle interne.** Elle sert à l'échange ; le modèle de la plateforme répond à ses propres besoins.
2. **Elle a plusieurs couches.** Sémantique (ce que les mots signifient), syntaxe (comment on les écrit), transport (comment on les envoie), conformité (comment on vérifie).
3. **Un profil précise la norme pour un usage.** La norme laisse des choix, comme l'optionnalité ou les extensions ; le profil les fige pour un cas.
4. **Plusieurs versions coexistent.** Les partenaires ne migrent pas au même moment ; la plateforme gère plusieurs versions en parallèle.
5. **On adapte à la frontière.** Un adaptateur traduit entre la norme et le modèle interne, pour que l'une n'envahisse pas l'autre.
6. **Adopter une norme a un coût de maintenance.** On choisit celles qui apportent de la valeur d'échange.
7. **Conformité n'est pas interopérabilité.** On teste avec des partenaires réels, sur des cas réels.

#### Vocabulaire essentiel

- **Normes d'échange sectorielles** (*sector exchange standards*) : spécifications d'un secteur pour représenter et transmettre ses données entre organisations.
- **Profil** (*profile*) : ensemble de contraintes qui précise une norme pour un usage : éléments obligatoires, cardinalités, jeux de codes.
- **Guide de mise en œuvre** (*implementation guide*) : document qui décrit comment une communauté applique une norme.
- **Extension** (*extension*) : mécanisme prévu par la norme pour porter du contenu qu'elle ne définit pas.
- **Énoncé de capacités** (*capability statement*) : description des interfaces et des fonctions qu'une implémentation expose.
- **Conformité** (*conformance*) : respect de ce que la norme et le profil exigent.
- **Version** (*version*, *release*) : état publié de la norme, qui coexiste avec les précédents.

#### Relations de cause à effet

- Le modèle interne reprend celui du standard. Chaque nouvelle version impose une migration du cœur, et les options du standard deviennent des colonnes.
- Aucun profil n'est convenu avec le partenaire. Les deux implémentations sont « conformes » et ne s'entendent pas, car elles ont fait des choix différents.
- Une seule version est prise en charge. Un partenaire qui migre plus tôt ou plus tard bloque l'échange.
- La conformité n'est pas testée. Les erreurs se découvrent en production, chez le partenaire.

#### Idées reçues

- **« Adopter une norme, c'est adopter son modèle de données. »** Non. On adopte son format d'échange, à la frontière. Le modèle interne répond à d'autres besoins.
- **« Une norme garantit l'interopérabilité. »** Non. Elle la rend possible ; les profils, les jeux de codes et les tests la rendent réelle.
- **« Le standard est stable. »** Non. Les normes publient des versions ; la page de FHIR consultée présente par exemple la version R5 comme la version publiée courante, avec des mécanismes d'extension intégrés.

#### Principe clé

On parle la langue du secteur à la frontière, par un adaptateur versionné et testé ; le modèle interne reste celui de la plateforme.

#### Si vous ne retenez que trois choses

1. Une norme d'échange fixe vocabulaire, syntaxe, mode d'échange et conformité ; elle ne remplace pas le modèle interne.
2. Les profils et les versions font la différence entre « conforme » et « interopérable ».
3. L'adaptateur à la frontière isole la plateforme des évolutions de chaque norme.

### 3. Explication technique détaillée

#### Un panorama de normes d'exemple

| Norme | Secteur | Ce qu'elle décrit | Mécanismes notables | À savoir |
|---|---|---|---|---|
| HL7 FHIR | Santé | Des ressources, brique de base, échangées par interface, documents ou messages | Ressources composées par références ; extensions intégrées ; énoncé de capacités ; définitions de structure qui contraignent optionnalité, cardinalité et jeux de codes ; formats JSON et XML | La page consultée présente la version R5 (5.0.0) comme version courante ; l'usage de REST n'est pas obligatoire |
| OPC UA | Industrie | Une architecture orientée services, indépendante de la plateforme, avec un modèle d'information extensible | Client-serveur et publication-abonnement ; chiffrement, signature, certificats X.509, audit ; lecture et écriture de données courantes et historiques, méthodes, notifications | Le modèle d'information est la base de modèles sectoriels qui s'y ajoutent |
| UN/EDIFACT | Commerce, transport | Des messages d'échange de données informatisé | Règles de syntaxe de la série ISO 9735 (version 4, édition 3 dans l'ISO 9735-10:2022) ; répertoires mis à jour deux fois par an | Connu ici par des extraits de catalogues ; la page de l'UNECE n'a pas répondu |
| ATA Spec 2000 | Aviation | Les échanges autour du matériel, des pièces, de la maintenance et de la fiabilité ; le chapitre 16 traite l'échange électronique du certificat de remise en service | Maintenue par un programme d'échanges électroniques de l'association des transporteurs ; publications souvent payantes | Statut et versions à vérifier chez l'éditeur |
| S1000D | Aérospatiale, défense | Des publications techniques découpées en modules de données stockés dans une base source commune | Chaque version (*issue*) reste valide : un contrat peut exiger une version qui n'est pas la dernière | Spécification qui ne dit pas comment mettre en œuvre la base |

Ce tableau est un échantillon, pas un catalogue. Il montre la diversité : un modèle de ressources, une architecture de services, une famille de messages, des publications. La question à poser est toujours la même : pour quel flux, avec quel partenaire, dans quelle version et avec quel profil ?

#### Identifier le format et la version d'un message entrant

La page FHIR sur l'interface REST (consultée le 14 octobre 2026) donne un exemple de ce qu'une norme fixe à la frontière : les types de média `application/fhir+json` et `application/fhir+xml`, un paramètre `fhirVersion` du type de média, et les codes `406` et `415` pour un format de réponse ou de requête non pris en charge. L'adaptateur d'entrée de la plateforme s'appuie sur ces éléments pour choisir le traducteur.

```typescript
interface Adapter {
  id: string;
  mediaType: string;
  versions: string[]; // vide : toutes versions acceptées
}

const ADAPTERS: Adapter[] = [
  { id: "fhir-r4", mediaType: "application/fhir+json", versions: ["4.0"] },
  { id: "fhir-r5", mediaType: "application/fhir+json", versions: ["5.0"] },
  { id: "edifact-d96a", mediaType: "application/edifact", versions: [] },
];

type Resolution = { ok: true; adapter: string } | { ok: false; status: 415; reason: string };

function parseContentType(header: string): { mediaType: string; params: Record<string, string> } {
  const [type, ...rest] = header.split(";").map((p) => p.trim());
  const params: Record<string, string> = {};
  for (const p of rest) {
    const [k, v] = p.split("=").map((s) => s.trim());
    if (k && v) params[k.toLowerCase()] = v.replaceAll('"', "");
  }
  return { mediaType: type.toLowerCase(), params };
}

function resolveAdapter(contentType: string, partnerDefaults: Record<string, string>): Resolution {
  const { mediaType, params } = parseContentType(contentType);
  const candidates = ADAPTERS.filter((a) => a.mediaType === mediaType);
  if (candidates.length === 0) return { ok: false, status: 415, reason: `format non pris en charge : ${mediaType}` };
  const version = params["fhirversion"] ?? partnerDefaults[mediaType];
  const match = candidates.find((a) => a.versions.length === 0 || (version !== undefined && a.versions.includes(version)));
  if (!match) {
    return { ok: false, status: 415, reason: `version non prise en charge ou absente : ${version ?? "aucune"}` };
  }
  return { ok: true, adapter: match.id };
}
```

Sur les essais : `application/fhir+json; fhirVersion=4.0` donne l'adaptateur `fhir-r4`, et `fhirVersion=5.0` l'adaptateur `fhir-r5` ; sans paramètre, le même type de média prend la version par défaut convenue avec le partenaire (4.0 dans l'exemple) ou, en l'absence de défaut, est refusé avec la raison « version absente » ; `application/edifact` donne `edifact-d96a` ; `text/csv` et la version `3.0` sont refusés (415). Le défaut par partenaire est une donnée de configuration : la version par défaut d'un partenaire se négocie, elle ne se devine pas.

#### Profils, extensions et conformité

La page de présentation de FHIR distingue deux ressources de conformité : l'énoncé de capacités, qui décrit les interfaces qu'une implémentation expose, et la définition de structure, qui contraint l'optionnalité, la cardinalité, les liaisons de terminologie, les types de données et les extensions. Un mécanisme d'extension intégré couvre le reste du contenu au besoin. La plateforme applique le même principe à ses propres adaptateurs :

- **déclarer** pour chaque partenaire le standard, la version, le profil et les extensions acceptées ;
- **valider** les messages entrants contre ce profil, et refuser ou isoler ce qui n'y est pas ;
- **tester** avec un jeu de messages d'exemple et, quand le standard l'offre, des outils de conformité ;
- **conserver** le message brut reçu, pour l'audit et le rejeu.

#### Choisir ce qu'on adopte

| Critère | Question |
|---|---|
| Valeur d'échange | Combien de partenaires l'emploient, et pour quels flux ? |
| Maturité et gouvernance | Qui le maintient ? Quel est le rythme des versions ? |
| Coût | Licence, outils, compétences, maintenance des profils |
| Couverture | Quelle part de nos objets couvre-t-il ? Que faut-il étendre ? |
| Alternatives | Un format interne documenté suffit-il pour ce partenaire ? |

**Modes de défaillance.**

- **Modèle interne calqué** sur celui du standard.
- **Version unique** prise en charge.
- **Profil non convenu** avec le partenaire.
- **Extensions propriétaires** sans documentation.
- **Message brut non conservé** : impossible de rejouer ou d'auditer.
- **Conformité non testée** avant la mise en production.

**Contre-exemple.** Alpha Air adopte le modèle d'un standard sectoriel comme modèle interne pour « éviter les traductions ». Une nouvelle version du standard modifie la structure d'un objet central : toute la base et toutes les API doivent migrer, et un partenaire qui reste sur l'ancienne version ne peut plus échanger. Un adaptateur à la frontière aurait absorbé le changement : une correspondance modifiée, le cœur inchangé.

**Limites.** Une norme ne couvre jamais tout le besoin : les extensions sont inévitables, et c'est là que naissent les divergences. Certains documents de référence sont payants ou à accès restreint. La qualification juridique de certains échanges (certificats, dossiers cliniques) relève de la réglementation du secteur, hors du champ de ce module. Et un standard peut cesser d'évoluer : l'état d'un standard s'évalue à la date où l'on décide.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | Les API de la plateforme ont leur propre contrat ; la norme en est un autre, à la frontière |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API s'applique aussi aux versions des normes prises en charge |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) | Les connecteurs et adaptateurs portent la traduction entre la norme et le modèle interne |
| [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence) | Le système de référence décide quelle source fait foi pour un objet échangé |
| [15.3 Études de cas comparées, santé, industrie et logistique](15-cas-application.md#153-études-de-cas-comparées-santé-industrie-et-logistique) | Les cas santé, industrie et logistique citent FHIR et OPC UA |
| [28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique) | La correspondance et le modèle canonique traduisent la norme vers le modèle interne |
| [28.5 Spécification d'API asynchrone et contrat de données](#285-spécification-dapi-asynchrone-et-contrat-de-données) | Le contrat de données précise, au-delà de la norme, l'accord avec un partenaire donné |

### 5. Application pratique

**Situation initiale.** Alpha Air doit recevoir des certificats électroniques de remise en service de trois fournisseurs : deux utilisent un format sectoriel, le troisième envoie un fichier maison.

**Problème.** Intégrer les trois sans que le modèle de la plateforme dépende d'aucun d'eux, et pouvoir ajouter un quatrième.

**Application du concept.** Un adaptateur par format et par version, des profils convenus avec chaque fournisseur, et un modèle interne unique pour le certificat.

**Déroulé.**

1. L'équipe liste, pour chaque fournisseur, le format, la version et le profil convenus, dans une configuration versionnée.
2. Le message entrant est identifié par son type de média et sa version, puis confié à l'adaptateur correspondant.
3. L'adaptateur valide le message contre le profil et le conserve tel quel.
4. Il le traduit vers le modèle interne du certificat, avec une correspondance versionnée ([28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)).
5. Les champs sans équivalent sont conservés comme données brutes rattachées, pas supprimés.
6. Un jeu de messages d'exemple de chaque fournisseur, rejoué à chaque modification, vérifie la traduction.
7. Le quatrième fournisseur s'ajoute en écrivant un adaptateur ou une correspondance, sans toucher au cœur.

**Résultat.** Trois formats, un modèle interne, un chemin clair pour en ajouter un quatrième.

**Limites.** Le fichier maison du troisième fournisseur demande un effort de documentation que la norme évite : l'adaptateur n'est pas gratuit, il est borné.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que fixe une norme d'échange sectorielle, et que ne fixe-t-elle pas ?
2. **Compréhension.** Quelle différence y a-t-il entre une norme, un profil et une version ?
3. **Compréhension.** Où place-t-on l'adaptateur entre la norme et le modèle interne, et pourquoi ?
4. **Pourquoi.** Pourquoi la conformité à une norme ne garantit-elle pas l'interopérabilité ?
5. **Raisonnement pratique.** Un partenaire envoie `application/fhir+json` sans paramètre de version. Que fait l'adaptateur, et quelle donnée de configuration lui est utile ?

#### Réponses

1. Elle fixe le vocabulaire, la syntaxe, le mode d'échange et les moyens de vérifier la conformité. Elle ne fixe ni le modèle interne des organisations, ni leurs choix d'options, ni leurs extensions, qui relèvent des profils et des accords entre partenaires.
2. La norme est la spécification d'ensemble ; le profil la contraint pour un usage (éléments obligatoires, jeux de codes) ; la version est un état publié de la norme, qui coexiste avec d'autres.
3. À la frontière : l'adaptateur traduit les messages externes vers le modèle interne et inversement, pour que les évolutions de la norme restent absorbées par la correspondance, sans traverser le cœur.
4. Parce que la norme laisse des options et des extensions : deux implémentations peuvent être conformes avec des choix différents. Les profils, les jeux de codes partagés et les tests entre partenaires comblent l'écart.
5. Il applique la version par défaut convenue avec ce partenaire, si elle existe, et refuse le message avec la raison « version absente » sinon. La donnée utile est la version par défaut par partenaire et par type de média, dans la configuration.

## 28.2 Correspondance, transformation et modèle canonique

### 1. Comprendre simplement

Une **correspondance** (*mapping*) décrit comment les éléments d'un format correspondent à ceux d'un autre : tel champ source devient tel champ cible, avec une conversion éventuelle. Une **transformation** (*transformation*) applique cette correspondance pour convertir un message ou un enregistrement. Un **modèle canonique** (*canonical data model*) est un format commun, indépendant de toute application, vers et depuis lequel chaque système est traduit.

**Pourquoi cela existe.** Les systèmes à relier n'emploient pas les mêmes noms, les mêmes types, les mêmes codes ni les mêmes unités. Écrire une traduction par paire de systèmes fait croître leur nombre avec le carré des systèmes ; passer par un format pivot le fait croître proportionnellement.

**Problème résolu.** Traduire de façon explicite, testable et maintenable, et limiter le nombre de traductions à entretenir quand les systèmes se multiplient.

**Modèle mental.** Les interprètes d'une conférence qui passent par une langue pivot : à six langues, il faut 30 interprètes pour des traductions directes entre chaque paire, mais 12 pour passer par le pivot.

**Où l'analogie s'arrête.** Une langue pivot perd des nuances, et personne ne la possède. Un modèle canonique est un objet de gouvernance : il faut le maintenir, le faire évoluer et décider de ce qui y entre.

**Exemple.** L'ERP d'un fournisseur envoie `PN`, `SN`, `QTY`, `UOM` et `STAT`. La plateforme le traduit vers son composant canonique : `part_number`, `serial_number`, `quantity`, `status`, en convertissant le code d'état `A` en `serviceable`.

**Les composants.**

1. les **schémas** source et cible ;
2. les **règles de correspondance** : copie, constante, conversion, table de codes, enrichissement ;
3. un **moteur de transformation** ;
4. un **modèle canonique** ;
5. des **traducteurs** vers et depuis le modèle canonique ;
6. une **politique** pour les champs sans équivalent et les valeurs inconnues ;
7. des **tests** : exemples, aller-retour ;
8. le **versionnement** des correspondances.

**Objectif d'apprentissage :** vous pouvez décrire une correspondance comme une donnée versionnée, compter les traducteurs avec et sans modèle canonique, et dire ce qu'une transformation fait des champs sans équivalent.

### 2. Connaissances essentielles

#### Définition

- **Correspondance et transformation** : une correspondance est la description déclarative des liens entre éléments de deux formats ; une transformation est son application à un message ou à un enregistrement pour produire la forme cible.
- **Modèle canonique** : format d'échange commun, indépendant de toute application, auquel chaque système se traduit, de sorte que l'intégration ne demande de traductions qu'entre chaque système et le modèle.

#### Idées fondamentales

1. **La correspondance est une donnée versionnée.** Elle se relit, se teste et se corrige sans redéployer le moteur.
2. **Les opérations sont peu nombreuses.** Copier, convertir (unité, format), traduire un code par une table, assembler ou scinder, enrichir, calculer.
3. **Un modèle canonique réduit les traducteurs.** De n(n−1) à 2n pour n systèmes.
4. **Le modèle canonique a un coût.** Il demande une gouvernance, et il peut devenir l'union de tous les champs ou le plus petit commun dénominateur.
5. **Une transformation perd de l'information.** On décide quoi faire de ce qui n'a pas d'équivalent : conserver, ignorer, rejeter.
6. **Les codes sont des tables.** Un code inconnu est signalé, pas remplacé silencieusement ([27.7 Vocabulaires contrôlés et graphe de propriétés](27-types-donnees-specialises.md#277-vocabulaires-contrôlés-et-graphe-de-propriétés)).
7. **On teste la traduction.** Sur des exemples réels, et par aller-retour quand elle est réversible.

#### Vocabulaire essentiel

- **Schéma source et schéma cible** (*source and target schema*) : formats de départ et d'arrivée.
- **Table de correspondance de codes** (*crosswalk*) : association de valeurs d'un jeu de codes à celles d'un autre.
- **Enrichissement** (*enrichment*) : ajout d'une information issue d'une autre source pendant la transformation.
- **Format pivot** (*pivot format*) : synonyme usuel de modèle canonique.
- **Aller-retour** (*round trip*) : transformation vers le modèle commun, puis retour, pour vérifier ce qui est conservé.
- **Champ non mappé** (*unmapped field*) : élément de la source sans règle de correspondance.

#### Relations de cause à effet

- Une traduction est écrite pour chaque paire de systèmes. Le nombre de traductions explose, et chaque changement d'un système touche toutes les autres.
- Les règles vivent dans du code dispersé. Personne ne peut dire ce que devient un champ, ni le tester sans exécuter l'ensemble.
- Un code inconnu est remplacé par une valeur par défaut. Les données deviennent fausses sans que personne le voie.
- Le modèle canonique grossit à chaque demande. Il devient la somme de tous les modèles, et plus personne ne le comprend.

#### Idées reçues

- **« Un modèle canonique est toujours préférable. »** Non. L'Enterprise Integration Patterns note que le modèle paraît compliqué avec peu d'applications et qu'il se rentabilise à mesure que leur nombre croît.
- **« Traduire, c'est renommer des champs. »** Non. Il faut aussi convertir des unités et des formats, traduire des codes et traiter des structures différentes.
- **« Une transformation réussie est une transformation correcte. »** Non. Elle a pu produire une forme valide à partir d'un sens mal compris : la correspondance doit être revue avec le métier.

#### Principe clé

Une correspondance est une donnée versionnée que l'on applique à la frontière : explicite sur ce qu'elle convertit, sur ce qu'elle garde de côté et sur ce qu'elle refuse.

#### Si vous ne retenez que trois choses

1. Une correspondance se décrit par des règles déclaratives et des tables de codes, versionnées et testées.
2. Un modèle canonique ramène le nombre de traducteurs de n(n−1) à 2n, au prix d'une gouvernance.
3. Une transformation décide explicitement du sort des champs sans équivalent et des codes inconnus.

### 3. Explication technique détaillée

#### Deux patrons d'intégration

La description du patron *Canonical Data Model* du site *Enterprise Integration Patterns* (consultée le 14 octobre 2026) pose le problème de plusieurs applications qui échangent des messages dans des formats propres, et sa solution : un modèle de données commun, indépendant de toute application spécifique ; chaque application produit et consomme des messages dans ce format, et l'intégration n'a besoin de transformations qu'entre chaque application et le modèle. Ses exemples chiffrés : avec deux applications, deux traducteurs directs ou quatre avec le modèle ; avec trois, six dans les deux cas ; avec six, trente traducteurs directs contre douze. Le patron *Message Translator*, lui, décrit un filtre spécialisé qui convertit un message d'un format dans un autre, présenté comme l'équivalent, pour la messagerie, du patron Adaptateur.

| Applications | Traducteurs directs | Avec modèle canonique |
|---|---|---|
| 2 | 2 | 4 |
| 3 | 6 | 6 |
| 6 | 30 | 12 |
| 10 | 90 | 20 |

Les trois premières lignes viennent de la page ; la dernière applique la même arithmétique : n(n−1) traducteurs directs, contre 2n avec un modèle (un vers le modèle, un depuis le modèle, par application). Le modèle canonique n'est avantageux qu'à partir de trois ou quatre systèmes à relier durablement.

#### Décrire la correspondance comme une donnée

```json
{
  "id": "zeta-erp-to-component",
  "version": 3,
  "rules": [
    { "op": "copy", "from": "PN", "to": "part_number", "required": true },
    { "op": "copy", "from": "SN", "to": "serial_number" },
    { "op": "to_quantity", "to": "quantity", "valueFrom": "QTY", "unitFrom": "UOM" },
    { "op": "map_code", "from": "STAT", "to": "status", "table": "status" },
    { "op": "const", "to": "source_system", "value": "zeta-erp" }
  ],
  "codeTables": {
    "status": { "A": "serviceable", "U": "unserviceable", "S": "scrapped" }
  }
}
```

La spécification contient les règles dans l'ordre et les tables de codes ; elle porte un identifiant et une version. Le moteur qui l'applique est le même pour toutes les correspondances.

```typescript
type Rule =
  | { op: "copy"; from: string; to: string; required?: boolean }
  | { op: "const"; to: string; value: string | number }
  | { op: "map_code"; from: string; to: string; table: string }
  | { op: "to_quantity"; to: string; valueFrom: string; unitFrom: string };

interface MappingSpec {
  id: string;
  version: number;
  rules: Rule[];
  codeTables: Record<string, Record<string, string>>;
}

interface Outcome {
  target: Record<string, unknown>;
  errors: string[];
  unmapped: string[];
}

function transform(source: Record<string, unknown>, spec: MappingSpec): Outcome {
  const target: Record<string, unknown> = {};
  const errors: string[] = [];
  const used = new Set<string>();
  for (const rule of spec.rules) {
    if (rule.op === "const") {
      target[rule.to] = rule.value;
      continue;
    }
    if (rule.op === "to_quantity") {
      used.add(rule.valueFrom);
      used.add(rule.unitFrom);
      const v = source[rule.valueFrom];
      const u = source[rule.unitFrom];
      if (v === undefined || u === undefined) {
        errors.push(`quantité incomplète : ${rule.to}`);
      } else {
        target[rule.to] = { value: Number(v), unit: String(u) };
      }
      continue;
    }
    used.add(rule.from);
    const value = source[rule.from];
    if (value === undefined) {
      if (rule.op === "copy" && rule.required) errors.push(`champ obligatoire absent : ${rule.from}`);
      continue;
    }
    if (rule.op === "copy") {
      target[rule.to] = value;
    } else {
      const mapped = spec.codeTables[rule.table]?.[String(value)];
      if (mapped === undefined) {
        errors.push(`code inconnu pour ${rule.from} : ${String(value)}`);
      } else {
        target[rule.to] = mapped;
      }
    }
  }
  const unmapped = Object.keys(source).filter((k) => !used.has(k)).sort();
  return { target, errors, unmapped };
}
```

Sur le message `{PN: "A320-123", SN: "S-8841", QTY: 2, UOM: "EA", STAT: "A", WHSE: "TLS"}`, la cible est le composant `A320-123` de série `S-8841`, de quantité 2 `EA`, d'état `serviceable`, avec `source_system` à `zeta-erp` ; aucune erreur ; le champ `WHSE` est signalé comme non mappé. Sur `{SN: "S-8842", QTY: 1, STAT: "Q"}`, le moteur renvoie trois erreurs (champ obligatoire absent `PN`, quantité incomplète faute d'unité, code d'état inconnu `Q`) au lieu de produire un composant faux. Le résultat contient donc trois choses : la cible, les erreurs, les champs non mappés, et c'est l'appelant qui décide de la suite : rejeter, mettre en file d'examen, ou accepter avec avertissement.

#### Le sort de ce qui n'a pas d'équivalent

| Cas | Choix possibles | Recommandation |
|---|---|---|
| Champ source sans règle | Ignorer, conserver en bloc brut, rejeter | Conserver en bloc brut rattaché, et le signaler |
| Code inconnu | Valeur par défaut, rejet, file d'examen | Rejet ou file d'examen, jamais défaut silencieux |
| Champ cible sans source | Valeur absente, valeur par défaut documentée, rejet | Dépend du champ ; documenté dans la correspondance |
| Perte de précision (unité, arrondi) | Accepter, refuser | Conserver la valeur d'origine à côté |
| Sémantiques différentes (même mot, autre sens) | Aucune règle technique | Revue avec le métier, nom distinct dans le modèle |

La dernière ligne rappelle la limite : aucune règle de correspondance ne résout un désaccord de sens. Si « statut » désigne chez le fournisseur l'état d'une commande et chez nous l'état d'un composant, le renommage produit une valeur bien formée et fausse.

#### Concevoir un modèle canonique

- **Le restreindre à ce qui s'échange** : le modèle canonique n'est ni le modèle de stockage, ni le modèle de domaine d'un contexte ([14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité)).
- **Le séparer des formats** : sémantique en un endroit, syntaxe dans les adaptateurs.
- **Le gouverner** : un propriétaire, une procédure de changement, des versions.
- **Le versionner** avec les mêmes règles de compatibilité que les schémas d'événements ([28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité)).
- **Accepter la perte** : un modèle commun est rarement réversible pour tous les systèmes ; conserver la source brute pour le rejeu.

**Modes de défaillance.**

- **Traductions point à point** pour de nombreux systèmes.
- **Règles dispersées** dans du code applicatif.
- **Valeur par défaut silencieuse** pour un code inconnu.
- **Modèle canonique fourre-tout**, sans propriétaire.
- **Source brute non conservée** : aucun rejeu possible.
- **Correspondance non versionnée** : on ne sait plus laquelle a produit un enregistrement.

**Contre-exemple.** Alpha Air relie six systèmes (ERP, achats, qualité, transport, atelier partenaire, entrepôt) par des traductions directes : trente traductions, écrites par quatre équipes. Un fournisseur change un code d'état, et sept traductions doivent être corrigées ; deux sont oubliées, et des pièces non navigables apparaissent comme conformes. Un modèle canonique avec douze traducteurs et une table de codes unique aurait limité la correction à un point.

**Limites.** Un modèle canonique est un projet de gouvernance autant que de technique : sans propriétaire, il se dégrade. Pour deux ou trois systèmes stables, une traduction directe reste plus simple. Les traductions coûtent en latence et en traitement. Et une correspondance exacte du format ne garantit rien sur le sens : le désaccord sémantique se règle avec les équipes métier ([14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) | Les adaptateurs exécutent les correspondances à la frontière |
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | La synchronisation et l'ETL appliquent les mêmes transformations par lots |
| [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent) | Le langage omniprésent aide à lever les désaccords de sens |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Le contexte délimité est distinct du modèle canonique d'échange |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les correspondances d'un tenant se superposent à celles de la plateforme par couches |
| [27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure) | Les conversions d'unités vérifient la dimension avant de convertir |
| [27.7 Vocabulaires contrôlés et graphe de propriétés](27-types-donnees-specialises.md#277-vocabulaires-contrôlés-et-graphe-de-propriétés) | Les tables de codes se rattachent aux vocabulaires contrôlés |
| [28.1 Normes d'échange sectorielles](#281-normes-déchange-sectorielles) | La norme fournit le format source ou cible ; la correspondance la traduit |
| [28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité) | Le modèle canonique évolue sous des règles de compatibilité |

### 5. Application pratique

**Situation initiale.** Alpha Air doit recevoir, de son ERP fournisseur, les mouvements de composants : numéro de pièce, numéro de série, quantité, unité, code d'état. Deux autres systèmes devront suivre.

**Problème.** Ne pas multiplier les traductions, et ne pas laisser un code inconnu produire une pièce faussement conforme.

**Application du concept.** Un composant canonique, une correspondance versionnée pour l'ERP, une table de codes, et une politique de rejet.

**Déroulé.**

1. L'équipe définit le composant canonique : numéro de pièce, numéro de série, quantité avec unité, état, système source.
2. Elle écrit la correspondance de l'ERP Zeta comme une donnée : règles et table des états `A`, `U`, `S`.
3. Le moteur applique la correspondance au message ; il renvoie la cible, les erreurs et les champs non mappés.
4. Un message avec un code `Q` est mis en file d'examen avec son brut ; il ne devient pas un composant.
5. Les champs non mappés, comme l'entrepôt, sont conservés dans un bloc brut rattaché.
6. Un jeu de messages d'exemple, rejoué à chaque version de la correspondance, vérifie les résultats attendus.
7. Quand les deux autres systèmes arrivent, chacun reçoit sa correspondance vers le même composant canonique.

**Résultat.** Trois systèmes reliés par six traducteurs au lieu de six directs ; un code inconnu arrêté à l'entrée ; chaque composant porte la version de la correspondance qui l'a produit.

**Limites.** Le jeu de messages d'exemple ne couvre que ce que l'équipe a vu ; les codes nouveaux d'un fournisseur apparaissent d'abord en file d'examen, et il faut une personne pour les traiter.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi décrit-on une correspondance comme une donnée plutôt que comme du code ?
2. **Compréhension.** Combien de traducteurs faut-il pour relier 6 systèmes, avec et sans modèle canonique ?
3. **Compréhension.** Que fait-on d'un code que la table de correspondance ne connaît pas ?
4. **Pourquoi.** Pourquoi un modèle canonique demande-t-il une gouvernance ?
5. **Raisonnement pratique.** Deux systèmes emploient le mot « statut » pour des choses différentes. Une règle de renommage suffit-elle ?

#### Réponses

1. Parce qu'une correspondance déclarative se relit, se versionne, se teste et se corrige sans modifier le moteur : on voit ce que devient chaque champ, et l'on sait quelle version a produit quel résultat.
2. Directement : 6 × 5 = 30 traducteurs. Avec un modèle canonique : 2 × 6 = 12, un vers le modèle et un depuis le modèle pour chaque système.
3. On le signale : rejet ou file d'examen, avec le message brut conservé, jamais une valeur par défaut silencieuse. La table se complète après décision du métier.
4. Parce que le modèle est partagé par plusieurs équipes et systèmes : sans propriétaire ni règles de changement, il grossit à chaque demande, devient l'union de tous les besoins et finit par n'être compris de personne.
5. Non. Le renommage produit une valeur bien formée mais fausse si les sens diffèrent. Il faut distinguer les deux concepts dans le modèle (deux noms) et valider la correspondance avec le métier.

## 28.3 Plateforme de flux d'événements, partitions et groupes de consommateurs

### 1. Comprendre simplement

Une **plateforme de flux d'événements** (*event streaming platform*) capture des événements en continu, les stocke durablement dans des journaux ordonnés, et les distribue à ceux qui les consomment, chacun à son rythme. Un **sujet** (*topic*) est un journal nommé, découpé en **partitions** : chaque partition est une suite ordonnée d'événements. Un **groupe de consommateurs** (*consumer group*) est un ensemble de consommateurs qui se partagent les partitions d'un sujet pour en traiter les événements en parallèle.

**Pourquoi cela existe.** Un webhook ([7.5 Webhook](07-evenements-automatisation.md#75-webhook)) prévient une adresse donnée au moment où quelque chose arrive ; une file ([7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente)) remet chaque message à un consommateur puis l'oublie. Quand plusieurs systèmes doivent lire les mêmes faits, parfois plus tard, parfois pour reconstruire leur état, il faut un journal que l'on relit : plusieurs lecteurs indépendants, un ordre utile, un débit élevé, un rejeu possible.

**Problème résolu.** Diffuser des faits à plusieurs consommateurs, dans l'ordre qui compte, avec un débit qui passe à l'échelle, et sans que le producteur connaisse les consommateurs.

**Modèle mental.** Un journal de bord en plusieurs volumes. Chaque équipe le lit avec son propre signet, et le garde ouvert aussi longtemps que la rétention l'autorise.

**Où l'analogie s'arrête.** Un journal papier est lu par des personnes, dans l'ordre. Ici, les consommateurs d'un groupe se partagent les volumes, l'ordre n'existe qu'au sein d'un volume, et la lecture avance par positions numériques.

**Exemple.** Les événements `aircraft.grounded` et `finding.critical` sont publiés avec l'identifiant de l'aéronef pour clé : tous les événements de F-ABCD tombent dans la même partition et restent ordonnés. Trois groupes de consommateurs les lisent chacun, indépendamment : `notifications`, `analytics` et `erp-sync`.

**Les composants.**

1. des **producteurs** et des **courtiers** (serveurs du flux) ;
2. des **sujets** et leurs **partitions** ;
3. une **clé** d'événement qui choisit la partition ;
4. un **décalage** (*offset*) : la position de lecture ;
5. une **rétention** et une **réplication** ;
6. des **groupes de consommateurs** et leur **rééquilibrage** ;
7. des **garanties de livraison** ;
8. des **consommateurs idempotents** ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

**Objectif d'apprentissage :** vous pouvez décrire la structure d'un flux d'événements, choisir une clé de partition selon l'ordre dont on a besoin, et expliquer ce que fait un groupe de consommateurs.

### 2. Connaissances essentielles

#### Définition

- **Plateforme de flux d'événements** : système qui capture, stocke durablement, traite et distribue des événements en continu, sous forme de journaux ordonnés et rejouables.
- **Partition** : sous-ensemble ordonné et immuable d'un sujet, dans lequel les événements sont ajoutés à la suite.
- **Groupe de consommateurs** : ensemble de consommateurs qui coopèrent pour lire un sujet, chaque partition étant lue par un seul membre du groupe à la fois.

#### Idées fondamentales

1. **Un journal, pas une file.** Les événements ne sont pas supprimés à la lecture ; une durée de rétention décide combien de temps ils restent.
2. **Les partitions donnent le parallélisme.** L'ordre n'existe qu'à l'intérieur d'une partition.
3. **La clé choisit la partition.** Choisir la clé, c'est choisir ce qui doit rester ordonné.
4. **Chaque groupe lit tout le sujet.** Les groupes sont indépendants ; au sein d'un groupe, chaque partition va à un seul consommateur.
5. **Le parallélisme est borné par le nombre de partitions.** Au-delà, des consommateurs restent inactifs.
6. **La position de lecture appartient au groupe.** Rejouer, c'est repositionner.
7. **La livraison est au moins une fois.** Les consommateurs doivent être idempotents.

#### Vocabulaire essentiel

- **Partition et groupe de consommateurs** (*partition and consumer group*) : le sujet est découpé en partitions ordonnées ; un groupe de consommateurs se les partage, chacune étant lue par un seul membre.
- **Courtier** (*broker*) : serveur qui stocke les partitions et sert les producteurs et les consommateurs.
- **Sujet** (*topic*) : catégorie nommée d'événements.
- **Décalage** (*offset*) : numéro de position d'un événement dans une partition.
- **Clé** (*key*) : valeur d'un événement qui détermine sa partition.
- **Rééquilibrage** (*rebalance*) : redistribution des partitions entre les membres d'un groupe quand ils changent.
- **Rétention** (*retention*) : durée ou volume pendant lesquels les événements sont conservés.
- **Facteur de réplication** (*replication factor*) : nombre de copies de chaque partition.

#### Relations de cause à effet

- Le sujet n'a qu'une partition pour « garder l'ordre ». Un seul consommateur par groupe peut lire : le débit est borné.
- La clé est aléatoire. L'ordre des événements d'un même aéronef n'est plus garanti.
- Il y a plus de consommateurs que de partitions. Les consommateurs en trop attendent sans travail.
- Le consommateur n'est pas idempotent. Un rejeu ou une reprise après rééquilibrage traite deux fois le même événement.

#### Idées reçues

- **« Un flux garantit l'ordre global. »** Non. L'ordre est garanti par partition, pas pour l'ensemble du sujet. La page de présentation d'Apache Kafka consultée le 14 octobre 2026 limite la garantie d'ordre à chaque couple sujet-partition.
- **« Plus de consommateurs, plus de débit. »** Non. Au sein d'un groupe, le parallélisme est borné par le nombre de partitions.
- **« Un événement lu est supprimé. »** Non. Selon la même page, les événements ne sont pas supprimés après lecture ; un réglage par sujet détermine leur durée de conservation.

#### Principe clé

On choisit la clé selon l'ordre utile, on dimensionne les partitions selon le parallélisme voulu, et l'on écrit des consommateurs idempotents qui tolèrent le rejeu.

#### Si vous ne retenez que trois choses

1. Un sujet est un journal rejouable, partitionné ; l'ordre n'existe qu'au sein d'une partition.
2. La clé détermine la partition, donc l'ordre dont on dispose pour un même objet.
3. Un groupe de consommateurs se partage les partitions ; chaque groupe lit tout, indépendamment.

### 3. Explication technique détaillée

#### Ce que dit la documentation

La page d'introduction d'Apache Kafka (consultée le 14 octobre 2026) définit le flux d'événements comme la capture de données en temps réel depuis des sources variées, leur stockage durable, leur traitement et leur routage. Un événement a une clé, une valeur, un horodatage et des en-têtes facultatifs. Producteurs et consommateurs sont découplés : les producteurs n'attendent jamais les consommateurs. Les événements sont stockés dans des sujets, qui peuvent avoir plusieurs producteurs et plusieurs consommateurs, et ne sont pas supprimés à la lecture : un paramètre de rétention par sujet fixe leur durée de conservation. Les sujets sont répartis en partitions, réparties sur des courtiers ; les événements de même clé vont dans la même partition, et tout consommateur d'une partition lit ses événements exactement dans l'ordre où ils ont été écrits. Les sujets peuvent être répliqués, et la page indique qu'un facteur de réplication de 3 est un réglage courant en production.

Les règles de coopération des consommateurs (un groupe nommé, chaque partition attribuée à un seul consommateur du groupe, rééquilibrage quand les membres changent, coordinateur de groupe qui calcule l'attribution) sont décrites par des guides tiers et par la documentation de programmation des clients ; la page de documentation générale de Kafka consultée n'a pas pu être lue (page de redirection). Ces règles se retrouvent dans les autres plateformes de flux, avec des variantes.

#### La clé, la partition et le groupe

```typescript
// Hachage FNV-1a 32 bits : un choix d'illustration, pas l'algorithme d'un produit.
function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function partitionFor(key: string, partitions: number): number {
  return fnv1a(key) % partitions;
}

// Répartit les partitions entre les consommateurs d'un groupe, à tour de rôle.
function assign(partitions: number, consumers: string[]): Record<string, number[]> {
  const out: Record<string, number[]> = Object.fromEntries(consumers.map((c) => [c, [] as number[]]));
  for (let p = 0; p < partitions; p++) {
    out[consumers[p % consumers.length]].push(p);
  }
  return out;
}

interface Event {
  key: string;
  seq: number;
}

function route(events: Event[], partitions: number): Map<number, Event[]> {
  const log = new Map<number, Event[]>();
  for (const e of events) {
    const p = partitionFor(e.key, partitions);
    log.set(p, [...(log.get(p) ?? []), e]);
  }
  return log;
}
```

Sur sept événements de quatre aéronefs, publiés dans l'ordre `ac_8f3a`, `ac_77b1`, `ac_12c9`, `ac_8f3a`, `ac_55d0`, `ac_77b1`, `ac_8f3a`, et avec quatre partitions, les trois événements de `ac_8f3a` (numéros 1, 4 et 7) tombent dans la même partition et y restent dans cet ordre. Avec deux consommateurs, `c1` lit les partitions 0 et 2 et `c2` les partitions 1 et 3 ; avec six consommateurs et quatre partitions, deux consommateurs restent sans partition. Autre propriété : quand le nombre de partitions passe de 4 à 6, certaines clés changent de partition (`ac_8f3a` passe de 0 à 4) : l'ordre relatif d'un même objet n'est plus garanti à travers le changement. On ne change donc pas à la légère le nombre de partitions d'un sujet dont l'ordre compte.

#### Choisir la clé

| Clé | Ordre garanti pour | Risque |
|---|---|---|
| Identifiant de l'aéronef | Tous les événements d'un aéronef | Aéronef très actif : partition chaude |
| Identifiant du tenant | Tous les événements d'un tenant | Tenant chaud ([22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)) : une partition sature |
| Identifiant du constat | Les événements d'un constat | Pas d'ordre entre constats d'un même aéronef |
| Aucune (aléatoire) | Rien | Débit uniforme, aucun ordre |

La clé est un arbitrage entre l'ordre dont on a besoin et la répartition de la charge : on prend la clé la plus fine qui préserve l'ordre exigé par les consommateurs.

#### Livrer au moins une fois, traiter une seule fois

La position de lecture est validée après le traitement : si le consommateur s'arrête entre le traitement et la validation, l'événement est relu. Le consommateur doit donc être idempotent ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) : il retient les événements déjà traités.

```sql
CREATE TABLE processed_event (
  consumer_group text        NOT NULL,
  event_id       text        NOT NULL,
  processed_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (consumer_group, event_id)
);

INSERT INTO processed_event (consumer_group, event_id)
VALUES ($1, $2)
ON CONFLICT (consumer_group, event_id) DO NOTHING
RETURNING event_id;
```

Si l'insertion ne renvoie aucune ligne, l'événement a déjà été traité et le consommateur l'ignore ; l'insertion et l'effet du traitement partagent la même transaction ([3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)) pour qu'un échec ne laisse pas l'un sans l'autre.

#### Rejouer, conserver, effacer

Un nouveau groupe peut relire un sujet depuis le début : c'est ainsi que l'on reconstruit un modèle de lecture ([7.10 CQRS](07-evenements-automatisation.md#710-cqrs)) ou que l'on branche un nouveau système. La rétention est une décision de conservation ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) : un flux qui garde des données personnelles pendant sept jours est un magasin de données personnelles. Effacer un enregistrement d'un journal qui n'est pas modifiable par ligne se règle par le chiffrement des données avec une clé par personne que l'on détruit ([24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)), ou par une rétention courte.

#### Un flux pour plusieurs tenants

| Option | Isolation | Coût | Remarque |
|---|---|---|---|
| Sujets par tenant | Forte | Nombre de sujets et de partitions élevé | Convient à quelques gros tenants |
| Sujet partagé, clé incluant le tenant | Logique | Faible | Les droits d'accès par tenant sont à gérer au niveau du flux ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) |
| Sujet partagé, quotas par tenant | Équité | Modéré | Évite qu'un tenant sature les partitions ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |

**Modes de défaillance.**

- **Partition unique** pour « garder l'ordre ».
- **Clé aléatoire** quand l'ordre est nécessaire.
- **Plus de consommateurs que de partitions.**
- **Consommateur non idempotent.**
- **Changement du nombre de partitions** sans plan pour l'ordre.
- **Rétention longue de données personnelles** sans règle d'effacement.

**Contre-exemple.** L'équipe publie tous les événements d'Alpha Air dans un sujet d'une seule partition « pour qu'ils restent dans l'ordre ». Le consommateur de notification traite 400 événements par seconde au mieux, et le flux sature à l'heure de pointe : les retards s'accumulent. Avec l'identifiant de l'aéronef pour clé et douze partitions, l'ordre utile (par aéronef) est conservé et douze consommateurs travaillent en parallèle.

**Limites.** Il n'y a pas d'ordre global : si un consommateur en a besoin, c'est un autre problème. Le « exactement une fois » est un sujet à part, qui dépend de la plateforme et de la manière dont le consommateur écrit ses résultats ; la page consultée le mentionne sans le détailler. Une plateforme de flux est un système à exploiter : pour de petits volumes, une file suffit. Et la page consultée ne donne ni durée de rétention par défaut, ni ordre entre partitions.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | La file remet un message à un consommateur ; le flux garde un journal relisible |
| [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Le bus d'événements est le motif ; la plateforme de flux en est une mise en œuvre durable |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les nouvelles tentatives et l'idempotence des consommateurs s'appliquent à la livraison au moins une fois |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La cohérence à terme décrit le décalage entre le producteur et les lecteurs |
| [7.10 CQRS](07-evenements-automatisation.md#710-cqrs) | CQRS reconstruit les modèles de lecture en rejouant le flux |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | Un tenant chaud rend une partition chaude |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites par tenant et les files équitables protègent le flux partagé |
| [28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité) | Le registre de schémas gouverne la forme des événements |

### 5. Application pratique

**Situation initiale.** Alpha Air publie des événements de constats critiques consommés par trois systèmes : les notifications, l'analytique et l'ERP. Aujourd'hui, chaque consommateur est appelé par webhook, avec des reprises propres à chacun.

**Problème.** Diffuser les mêmes faits à trois systèmes qui évoluent à leur rythme, dans l'ordre par aéronef, et pouvoir en ajouter un quatrième qui relise l'historique.

**Application du concept.** Un sujet partitionné par identifiant d'aéronef, trois groupes de consommateurs et des consommateurs idempotents.

**Déroulé.**

1. L'équipe crée le sujet `finding.critical`, douze partitions, une rétention de sept jours, avec l'identifiant de l'aéronef pour clé.
2. Le producteur publie chaque constat critique avec son identifiant d'événement unique.
3. Trois groupes de consommateurs lisent le sujet : `notifications`, `analytics`, `erp-sync`, chacun avec ses instances.
4. Chaque consommateur note les identifiants d'événements traités dans une table, dans la transaction de son effet.
5. Un rééquilibrage, après le redémarrage d'une instance, relit quelques événements : les doublons sont ignorés.
6. Un quatrième système s'ajoute avec son propre groupe, et relit les sept jours d'historique avant de passer au direct.
7. Le suivi mesure le retard de chaque groupe (écart entre le dernier événement écrit et la position lue) et alerte au-delà d'un seuil.

**Résultat.** Trois consommateurs indépendants, un ordre garanti par aéronef, un rejeu possible, et aucun traitement en double.

**Limites.** Le retard d'un groupe n'est pas un problème du producteur : les équipes consommatrices en répondent, avec leurs propres objectifs ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une file et un flux d'événements ?
2. **Compréhension.** Sur quoi porte la garantie d'ordre d'un flux partitionné ?
3. **Compréhension.** Que se passe-t-il quand un groupe a plus de consommateurs que le sujet n'a de partitions ?
4. **Pourquoi.** Pourquoi les consommateurs d'un flux doivent-ils être idempotents ?
5. **Raisonnement pratique.** Les événements d'un même aéronef doivent être traités dans l'ordre, et le débit doit passer à l'échelle. Quelle clé et quel nombre de partitions envisager ?

#### Réponses

1. La file remet chaque message à un consommateur puis l'oublie ; le flux garde les événements dans un journal que plusieurs lecteurs indépendants relisent, aussi longtemps que la rétention l'autorise, ce qui permet le rejeu.
2. Sur chaque partition prise séparément : tout consommateur d'une partition lit ses événements dans l'ordre d'écriture, et les événements de même clé vont dans la même partition. Il n'y a pas d'ordre garanti entre partitions.
3. Chaque partition est lue par un seul consommateur du groupe : les consommateurs en excès restent inactifs, sans partition à lire.
4. Parce que la livraison est au moins une fois : après une panne ou un rééquilibrage, un événement peut être relu. Un consommateur idempotent reconnaît ce qu'il a déjà traité et n'en répète pas l'effet.
5. L'identifiant de l'aéronef comme clé, pour garder l'ordre par aéronef, et un nombre de partitions supérieur ou égal au parallélisme voulu (par exemple douze pour douze consommateurs), à fixer tôt car le modifier change le placement des clés.

## 28.4 Registre de schémas et règles de compatibilité

### 1. Comprendre simplement

Un **registre de schémas** (*schema registry*) est un service qui conserve les schémas des messages, versionnés, et les met à la disposition des producteurs et des consommateurs. Les **règles de compatibilité** (*schema compatibility rules*) décident quelles évolutions d'un schéma sont admises sans casser les lecteurs ou les écrivains existants.

**Pourquoi cela existe.** Dans un flux lu par plusieurs consommateurs indépendants, un producteur qui modifie un message peut casser n'importe lequel d'entre eux, sans bruit : un champ renommé arrive comme absent, un type change. Le registre transforme un accord implicite en un accord vérifié, avant la publication.

**Problème résolu.** Permettre aux producteurs et aux consommateurs d'évoluer à leur rythme, en détectant à l'avance les changements qui casseraient l'un des deux.

**Modèle mental.** La bibliothèque des plans d'une prise électrique. Avant de modifier la prise, on vérifie que les appareils existants s'y branchent encore.

**Où l'analogie s'arrête.** La vérification porte sur la forme (noms, types, valeurs par défaut), pas sur le sens : un champ qui passe de newtons-mètres à livres-pieds garde le même type.

**Exemple.** L'événement `finding.critical` a une première version avec `finding_id`, `aircraft` et `severity`. Ajouter un champ facultatif `reason` est compatible ; renommer `aircraft` en `aircraft_id` ne l'est pas.

**Les composants.**

1. des **schémas** par sujet, versionnés ;
2. l'**identifiant du schéma** porté par chaque message ;
3. une **règle de compatibilité** par sujet ;
4. une **vérification** avant l'enregistrement d'une nouvelle version ;
5. une **intégration** dans le pipeline de livraison ([21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)) ;
6. une **procédure de rupture** : nouvelle version du sujet, coexistence, retrait ;
7. des **caches** côté clients, pour ne pas dépendre du registre à chaque message.

**Objectif d'apprentissage :** vous pouvez expliquer ce qu'est une compatibilité arrière, avant et complète, classer un changement de schéma, et dire ce que le registre ne vérifie pas.

### 2. Connaissances essentielles

#### Définition

- **Registre de schémas** : service qui stocke, versionne et sert les schémas des messages échangés, et qui contrôle les nouvelles versions selon une règle de compatibilité.
- **Règles de compatibilité de schémas** : règles qui définissent quelles différences entre deux versions d'un schéma permettent à des lecteurs d'une version de lire des données écrites avec l'autre.

#### Idées fondamentales

1. **Un message est lu avec deux schémas.** Celui de l'écrivain et celui du lecteur ; ils peuvent différer, d'où des règles de résolution.
2. **La compatibilité a un sens.** Arrière : les nouveaux lecteurs lisent les anciennes données. Avant : les anciens lecteurs lisent les nouvelles données. Complète : les deux.
3. **Les variantes transitives comparent à toutes les versions.** Pas seulement à la dernière.
4. **Le geste sûr est d'ajouter un champ facultatif.** Supprimer ou renommer ne l'est pas.
5. **L'ordre de mise à niveau suit la règle.** Arrière : consommateurs d'abord ; avant : producteurs d'abord ; complète : indépendamment.
6. **Le contrôle se fait avant la publication.** Dans le pipeline et au registre, pas en production.
7. **La forme n'est pas le sens.** La compatibilité technique ne garantit pas la compatibilité du sens.

#### Vocabulaire essentiel

- **Sujet** (*subject*) : nom sous lequel une suite de versions d'un schéma est enregistrée.
- **Schéma d'écrivain et de lecteur** (*writer and reader schema*) : schémas avec lesquels les données ont été écrites et avec lequel on les lit.
- **Valeur par défaut** (*default value*) : valeur utilisée par un lecteur quand le champ manque dans les données.
- **Promotion de type** (*type promotion*) : lecture d'un type étroit par un type plus large, comme un entier lu en entier long.
- **Compatibilité transitive** (*transitive compatibility*) : contrôle contre toutes les versions antérieures, pas seulement la précédente.
- **Rupture** (*breaking change*) : changement qui ne passe pas la règle de compatibilité du sujet.

#### Relations de cause à effet

- Le producteur renomme un champ. Les lecteurs reçoivent une valeur absente ou par défaut, sans erreur de format.
- Aucun contrôle n'a lieu avant la publication. L'incompatibilité apparaît en production, chez le consommateur.
- La règle est réglée sur « aucune » pour aller vite. Les changements cassants passent, et la dette se déplace chez les consommateurs.
- Un champ obligatoire est ajouté sans valeur par défaut. Les nouveaux lecteurs ne peuvent plus relire l'historique.

#### Idées reçues

- **« Compatible signifie que rien ne change. »** Non. La compatibilité vaut dans un sens, pour des lecteurs ou des écrivains précis.
- **« Changer un type est toujours une rupture. »** Non. Les règles de résolution d'Avro admettent certaines promotions (entier vers entier long, flottant vers double), mais dans un seul sens.
- **« Le registre protège le sens. »** Non. Il vérifie les noms, les types et les valeurs par défaut.

#### Principe clé

Toute évolution de schéma est vérifiée contre une règle de compatibilité explicite avant d'atteindre le flux ; ce qui ne passe pas devient une nouvelle version du sujet, avec une période de coexistence.

#### Si vous ne retenez que trois choses

1. La compatibilité est une propriété dirigée : arrière, avant ou complète.
2. Ajouter un champ avec une valeur par défaut est sûr ; supprimer, renommer ou rendre obligatoire ne l'est pas.
3. Le contrôle se fait au registre et dans le pipeline, avant publication, et ne dit rien du sens.

### 3. Explication technique détaillée

#### Les types de compatibilité

La documentation de Confluent sur l'évolution des schémas (consultée le 14 octobre 2026) définit les règles suivantes, avec X la version courante :

| Règle | Ce que cela garantit | Changements admis (selon la page) | Ordre de mise à niveau |
|---|---|---|---|
| BACKWARD | Des consommateurs au schéma X lisent des données écrites en X ou X-1 | Supprimer des champs, ajouter des champs facultatifs | Consommateurs d'abord |
| BACKWARD_TRANSITIVE | Idem, pour X, X-1 et X-2 | Idem | Consommateurs d'abord |
| FORWARD | Les données écrites en X sont lues par des consommateurs en X ou X-1 | Ajouter des champs, supprimer des champs facultatifs | Producteurs d'abord |
| FORWARD_TRANSITIVE | Idem, pour X, X-1 et X-2 | Idem | Producteurs d'abord |
| FULL | Arrière et avant entre X et X-1 | Ajouter ou supprimer des champs facultatifs ou à valeur par défaut | Indépendamment |
| FULL_TRANSITIVE | Arrière et avant sur X, X-1 et X-2 | Idem | Indépendamment |
| NONE | Aucune vérification | N'importe lesquels | Prudence |

La page précise que le type par défaut est BACKWARD, non transitif : une nouvelle version n'est vérifiée que contre la dernière.

#### Ce que le lecteur fait des différences

La spécification d'Avro (version 1.11.1, consultée le 14 octobre 2026) décrit la résolution entre le schéma de l'écrivain et celui du lecteur : les champs d'un enregistrement se rapprochent par leur nom, dans n'importe quel ordre ; un champ présent chez l'écrivain et absent chez le lecteur est ignoré ; un champ du lecteur absent des données prend sa valeur par défaut, et, s'il n'en a pas, c'est une erreur ; les types se rapprochent s'ils sont identiques ou si celui de l'écrivain peut être promu vers celui du lecteur (entier vers entier long, flottant ou double ; entier long vers flottant ou double ; flottant vers double ; chaîne et octets l'un vers l'autre) ; les énumérations utilisent la valeur par défaut du lecteur pour un symbole inconnu, sinon une erreur. Voici un schéma de ce type, avec un champ facultatif :

```json
{
  "type": "record",
  "name": "FindingCritical",
  "namespace": "com.alphaair.events",
  "fields": [
    { "name": "finding_id", "type": "string" },
    { "name": "aircraft_id", "type": "string" },
    { "name": "severity", "type": "string" },
    { "name": "reason", "type": ["null", "string"], "default": null }
  ]
}
```

#### Un contrôleur de compatibilité

```typescript
type FieldType = "string" | "int" | "long" | "float" | "double" | "boolean";

interface Field {
  name: string;
  type: FieldType;
  hasDefault: boolean;
}

interface RecordSchema {
  name: string;
  fields: Field[];
}

const PROMOTES: Record<string, FieldType[]> = {
  int: ["long", "float", "double"],
  long: ["float", "double"],
  float: ["double"],
};

function readable(writer: FieldType, reader: FieldType): boolean {
  return writer === reader || (PROMOTES[writer] ?? []).includes(reader);
}

// Un lecteur au schéma `reader` lit des données écrites avec `writer` (règles de résolution d'Avro).
function canRead(reader: RecordSchema, writer: RecordSchema): string[] {
  const problems: string[] = [];
  for (const rf of reader.fields) {
    const wf = writer.fields.find((f) => f.name === rf.name);
    if (!wf) {
      if (!rf.hasDefault) problems.push(`champ lu sans valeur par défaut et absent des données : ${rf.name}`);
    } else if (!readable(wf.type, rf.type)) {
      problems.push(`type non lisible pour ${rf.name} : ${wf.type} -> ${rf.type}`);
    }
  }
  return problems;
}

function backward(oldS: RecordSchema, newS: RecordSchema): string[] {
  return canRead(newS, oldS); // consommateurs nouveaux, données anciennes
}

function forward(oldS: RecordSchema, newS: RecordSchema): string[] {
  return canRead(oldS, newS); // consommateurs anciens, données nouvelles
}
```

Sur une version 1 de `FindingCritical` (`finding_id`, `aircraft` et `severity` en entier, sans valeur par défaut), quatre évolutions donnent :

| Évolution | Arrière | Avant | Raison |
|---|---|---|---|
| Ajout d'un champ avec valeur par défaut | oui | oui | Les nouveaux lecteurs utilisent le défaut ; les anciens ignorent le champ |
| Ajout d'un champ obligatoire | non | oui | Les anciennes données n'ont pas ce champ, et le nouveau lecteur n'a pas de défaut |
| Renommage de `aircraft` en `aircraft_id` | non | non | Pour chaque sens, un champ lu est absent et sans défaut |
| Élargissement d'`int` en `long` | oui | non | Un lecteur large lit un entier étroit ; un lecteur étroit ne lit pas un entier large |

Un renommage est une suppression suivie d'un ajout : il ne passe dans aucun sens, sauf à déclarer un alias, qui est un mécanisme de la spécification que cette page n'a pas détaillé.

#### Le contrôle dans le pipeline

1. Le schéma modifié est proposé avec le code du producteur.
2. Le pipeline interroge le registre : la nouvelle version est-elle compatible avec la règle du sujet ?
3. En cas d'échec, la fusion est bloquée ([21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)).
4. En cas de réussite, la version est enregistrée à la publication ; chaque message porte l'identifiant de son schéma.
5. Les consommateurs mettent les schémas en cache, et la panne du registre n'arrête pas la lecture.

Pour une rupture voulue, on ne contourne pas la règle : on crée un nouveau sujet ou une nouvelle version majeure du flux (`finding.critical.v2`), on publie en parallèle pendant une durée annoncée, puis l'on retire l'ancien, comme pour une API ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

#### Ce que le registre ne voit pas

Un changement de **sens** passe toutes les règles : un champ numérique qui passe de newtons-mètres à livres-pieds ([27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure)), un statut dont la valeur `done` change de signification, un horodatage qui change de fuseau. On l'aborde par le nom (nouveau champ plutôt que changement de sens), la description du champ, et le contrat de données ([28.5 Spécification d'API asynchrone et contrat de données](#285-spécification-dapi-asynchrone-et-contrat-de-données)) avec ses tests.

**Modes de défaillance.**

- **Compatibilité réglée sur aucune**, pour aller vite.
- **Contrôle uniquement en production.**
- **Champ obligatoire ajouté** sans valeur par défaut.
- **Renommage sans alias** ni nouvelle version.
- **Registre point de défaillance** sans cache côté clients.
- **Changement de sens** sans changement de nom.

**Contre-exemple.** Un producteur renomme `aircraft` en `aircraft_id` « pour nettoyer ». Le sujet est en mode « aucune » ; la modification passe. Les consommateurs dont le champ a une valeur par défaut lisent cette valeur : la notification part sans immatriculation, et l'analytique compte tous les événements sous « inconnu ». Aucune lecture n'a échoué ; l'écart apparaît des semaines plus tard. Une règle arrière ou complète aurait refusé le changement avant la fusion.

**Limites.** Les règles diffèrent selon le format : la page de Confluent renvoie pour Protobuf et JSON Schema à d'autres documents. Le registre est une dépendance à protéger. Il vérifie des schémas, pas la qualité ni le sens des données. Et plus un sujet a de consommateurs, plus la coordination d'une rupture est lente : d'où l'intérêt de la règle complète transitive pour les sujets très partagés.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | Le contrat de schéma d'une API est le pendant synchrone du schéma d'un message |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API fournit la méthode pour les ruptures : versions parallèles et retrait |
| [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | La porte de qualité du pipeline exécute le contrôle de compatibilité |
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Les tests de contrat complètent la vérification de forme par la vérification du sens |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | L'évolution et le versionnement de schéma suivent le même raisonnement pour les bases |
| [27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure) | Un changement d'unité est une rupture de sens que le registre ne détecte pas |
| [28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique) | Le modèle canonique évolue sous les mêmes règles |
| [28.3 Plateforme de flux d'événements, partitions et groupes de consommateurs](#283-plateforme-de-flux-dévénements-partitions-et-groupes-de-consommateurs) | Les événements du flux sont lus avec le schéma du registre |
| [28.5 Spécification d'API asynchrone et contrat de données](#285-spécification-dapi-asynchrone-et-contrat-de-données) | Le contrat de données porte ce que le schéma ne dit pas |

### 5. Application pratique

**Situation initiale.** L'événement `finding.critical` a trois consommateurs. L'équipe qualité veut y ajouter une raison de criticité et renommer `aircraft` en `aircraft_id` pour s'aligner sur le reste de la plateforme.

**Problème.** Faire les deux sans casser les consommateurs.

**Application du concept.** Une règle complète sur le sujet, un ajout facultatif immédiat, et une procédure de rupture pour le renommage.

**Déroulé.**

1. Le sujet `finding.critical` est enregistré avec la compatibilité complète, transitive.
2. L'ajout de `reason` en champ facultatif avec valeur par défaut passe le contrôle du pipeline ; version 2 enregistrée.
3. Le renommage, proposé dans la même fusion, est refusé : ni arrière ni avant.
4. L'équipe publie un nouveau sujet `finding.critical.v2` avec `aircraft_id`, et diffuse les deux pendant 90 jours (valeur d'exemple).
5. Chaque consommateur migre à son rythme, en lisant le nouveau sujet ; le suivi montre quels groupes lisent encore l'ancien.
6. À l'échéance annoncée, l'ancien sujet est retiré.
7. Une description du champ `severity` précise sa signification ; un test de contrat vérifie ses valeurs permises.

**Résultat.** Le champ facultatif est livré le jour même, le renommage au terme d'une migration annoncée, sans casse silencieuse.

**Limites.** La coexistence double la publication pendant 90 jours, avec la charge et le coût que cela suppose ; il faut une personne qui suive la migration jusqu'au bout.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifie la compatibilité arrière, et que signifie la compatibilité avant ?
2. **Compréhension.** Pourquoi ajouter un champ obligatoire sans valeur par défaut est-il une rupture arrière ?
3. **Compréhension.** Que fait un lecteur Avro d'un champ qui est dans les données mais pas dans son schéma ?
4. **Pourquoi.** Pourquoi la compatibilité d'un schéma ne suffit-elle pas à garantir le bon fonctionnement des consommateurs ?
5. **Raisonnement pratique.** Un sujet a la règle arrière, non transitive. Dans quel ordre mettre à niveau producteurs et consommateurs pour un ajout de champ facultatif ?

#### Réponses

1. Arrière : des consommateurs au nouveau schéma lisent les données écrites avec l'ancien. Avant : des consommateurs à l'ancien schéma lisent les données écrites avec le nouveau.
2. Parce que les données déjà écrites n'ont pas ce champ : un lecteur au nouveau schéma, qui exige le champ sans défaut, ne peut pas les lire. Il faudrait une valeur par défaut pour que le lecteur la fournisse.
3. Il l'ignore : les champs de l'écrivain absents du lecteur sont écartés lors de la résolution.
4. Parce qu'elle vérifie la forme (noms, types, défauts), pas le sens : un changement d'unité, de fuseau ou de signification d'une valeur ne modifie pas le schéma et casse pourtant les consommateurs.
5. Les consommateurs d'abord : avec la règle arrière, ils doivent savoir lire la nouvelle version avant que les producteurs ne l'écrivent. Pour un champ facultatif avec valeur par défaut, les anciens consommateurs, eux, continuent de lire les nouveaux messages en ignorant le champ.

## 28.5 Spécification d'API asynchrone et contrat de données

### 1. Comprendre simplement

Une **spécification d'API asynchrone** (*asynchronous API specification*) décrit, dans un format lisible par une machine, une API fondée sur des messages : serveurs, canaux (sujets), opérations (envoyer, recevoir), messages et schémas. AsyncAPI est un format de ce type. Un **contrat de données** (*data contract*) est l'accord explicite entre le producteur d'un flux ou d'un jeu de données et ses consommateurs : schéma, sémantique, qualité, niveaux de service, règles d'évolution, propriétaire.

**Pourquoi cela existe.** Une description d'API de type requête-réponse ne dit rien d'un flux d'événements. Et sans accord écrit, un consommateur lit le code du producteur ou sa base pour deviner ce qu'il peut attendre. Un contrat rend les attentes testables.

**Problème résolu.** Donner aux consommateurs de quoi s'intégrer sans connaître le producteur, et au producteur de quoi évoluer en sachant ce qu'il promet.

**Modèle mental.** La notice technique et le bon de commande réunis : la notice dit ce que le produit est, le bon dit ce que le fournisseur s'engage à livrer, quand et à quel niveau de qualité.

**Où l'analogie s'arrête.** Une notice et un bon de commande se lisent. Un contrat de données ne vaut que s'il est vérifié automatiquement : sinon il dérive de la réalité.

**Exemple.** Le flux `finding.critical.v2` est décrit par un document AsyncAPI (canal, opération, message, schéma) et par un contrat : propriétaire, sémantique de `severity`, délai de livraison au 95e centile de 60 secondes, rétention de sept jours, préavis de 90 jours pour toute rupture.

**Les composants.**

1. un **document de spécification** ;
2. des **schémas de messages**, référencés au registre ([28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité)) ;
3. des **liaisons** de protocole ;
4. un **propriétaire** et un canal de support ;
5. des **règles de qualité** ;
6. des **niveaux de service** ;
7. des **règles d'évolution** et de dépréciation ;
8. une **vérification automatisée** : conformité du producteur, tests des consommateurs ;
9. un **catalogue** pour les découvrir ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)).

**Objectif d'apprentissage :** vous pouvez décrire un flux d'événements avec une spécification d'API asynchrone, rédiger un contrat de données vérifiable, et dire ce que chacun apporte.

### 2. Connaissances essentielles

#### Définition

- **Spécification d'API asynchrone** : description lisible par machine d'une application qui échange des messages : serveurs, canaux, opérations et messages, indépendamment du protocole.
- **Contrat de données** : accord documenté et vérifiable entre un producteur de données et ses consommateurs, qui porte le schéma, la sémantique, la qualité attendue, les niveaux de service et les règles d'évolution.

#### Idées fondamentales

1. **Un flux a besoin de sa propre description.** Une spécification de requête-réponse ne couvre pas canaux, opérations d'envoi et de réception, ni messages.
2. **La spécification décrit une application.** Son point de vue (envoi ou réception) compte : on ne dérive pas le document d'un consommateur de celui d'un producteur.
3. **L'enveloppe est standardisable.** Un format commun d'événement fixe les attributs de contexte, indépendamment de la charge.
4. **Un contrat est plus que le schéma.** Sémantique, qualité, délai, retenue, évolution, propriétaire.
5. **Un contrat se vérifie.** Par des contrôles automatiques du producteur et des tests des consommateurs.
6. **Un contrat a un propriétaire.** Sans nom, personne ne répond du changement.
7. **Un contrat évolue.** Il suit des règles de compatibilité et de préavis.

#### Vocabulaire essentiel

- **Canal** (*channel*) : lieu adressable où circulent des messages, par exemple un sujet.
- **Opération** (*operation*) : ce que l'application fait sur un canal : envoyer ou recevoir.
- **Liaison de protocole** (*binding*) : informations propres à un protocole, comme Kafka ou MQTT.
- **Enveloppe d'événement** (*event envelope*) : attributs de contexte communs : identifiant, source, type, version de la spécification.
- **Niveau de service** (*service level*) : engagement mesurable : délai de livraison, disponibilité, rétention.
- **Règle de qualité** (*quality rule*) : condition vérifiable sur les données : non nul, valeurs permises, unicité.

#### Relations de cause à effet

- Le consommateur déduit le format du code du producteur. Un changement interne devient une rupture sans que le producteur le sache.
- Le contrat est écrit une fois, dans un wiki. Il dérive de la réalité faute de vérification.
- Aucun propriétaire n'est nommé. Les questions et les incidents restent sans réponse.
- Les délais ne sont pas mesurés. L'engagement n'est ni tenu ni démontrable.

#### Idées reçues

- **« Le schéma suffit comme contrat. »** Non. Il ne dit ni le sens, ni la qualité, ni le délai, ni l'évolution.
- **« Un contrat de données est un document juridique. »** Il peut s'y rattacher, mais c'est d'abord un accord technique vérifiable entre équipes.
- **« Une spécification asynchrone décrit les deux côtés. »** Non. Un document AsyncAPI décrit une application ; la page consultée met en garde contre le fait de déduire le document du récepteur à partir de celui de l'émetteur.

#### Principe clé

Un flux se décrit par une spécification lisible par machine et se gouverne par un contrat de données vérifié, avec un propriétaire, des niveaux de service mesurés et des règles d'évolution.

#### Si vous ne retenez que trois choses

1. Une spécification d'API asynchrone décrit serveurs, canaux, opérations et messages.
2. Un contrat de données ajoute sémantique, qualité, niveaux de service, évolution et propriétaire.
3. Un contrat qui n'est pas vérifié par des contrôles automatiques est une opinion.

### 3. Explication technique détaillée

#### Décrire un flux : AsyncAPI

La spécification AsyncAPI 3.0.0 (consultée le 14 octobre 2026) est un format lisible par machine, indépendant du protocole (AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP). Ses objets principaux sont : les informations générales, les serveurs (hôte, protocole), les **canaux** (lieux adressables qui listent les messages qu'ils peuvent porter), les **opérations** (objet distinct dans la version 3 : une action `send` ou `receive` qui référence un canal), les messages (charge et en-têtes facultatifs) et les composants réutilisables. Les formats de schéma de charge sont : le schéma d'AsyncAPI par défaut et JSON Schema (draft 07) obligatoires, et en recommandation Avro, le schéma d'OpenAPI 3.0, les types de données de RAML, et Protocol Buffers.

```yaml
asyncapi: 3.0.0
info:
  title: Événements de constats critiques
  version: 2.1.0
  description: Constats critiques publiés par la plateforme pour les systèmes abonnés.
servers:
  production:
    host: streaming.platform.example:9093
    protocol: kafka
channels:
  findingCritical:
    address: finding.critical.v2
    messages:
      findingCritical:
        $ref: '#/components/messages/FindingCritical'
operations:
  publishFindingCritical:
    action: send
    channel:
      $ref: '#/channels/findingCritical'
    summary: Un constat critique vient d'être déclaré.
components:
  messages:
    FindingCritical:
      name: FindingCritical
      contentType: application/json
      payload:
        type: object
        required: [finding_id, aircraft_id, severity, occurred_at]
        properties:
          finding_id: { type: string }
          aircraft_id: { type: string }
          severity: { type: string, enum: [critical] }
          occurred_at: { type: string, format: date-time }
          reason: { type: string }
```

Ce document décrit l'application qui **publie** : l'action est `send`. Un consommateur décrit la sienne avec l'action `receive` sur le même canal. La page consultée met en garde contre le fait de dériver mécaniquement l'un de l'autre, car les canaux et les sens peuvent différer.

#### L'enveloppe de l'événement

La spécification CloudEvents (version 1.0.3 en cours d'élaboration sur la branche principale, consultée le 14 octobre 2026) définit un format commun de description des événements. Elle exige quatre attributs de contexte : `id`, `source`, `specversion` (valeur « 1.0 ») et `type`, et en prévoit d'autres facultatifs : `datacontenttype`, `dataschema`, `subject`, `time`. Les producteurs doivent garantir que la combinaison `source` et `id` est unique pour chaque événement distinct, et les consommateurs peuvent traiter deux événements de mêmes `source` et `id` comme des doublons : c'est la base de l'idempotence ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

```json
{
  "specversion": "1.0",
  "type": "com.alphaair.finding.critical",
  "source": "https://platform.example/tenants/ten_airline_01",
  "id": "evt_9f21",
  "time": "2026-10-14T09:12:44Z",
  "subject": "finding/fd_204",
  "datacontenttype": "application/json",
  "dataschema": "https://schemas.platform.example/finding-critical/2.1.0",
  "data": {
    "finding_id": "fd_204",
    "aircraft_id": "ac_8f3a",
    "severity": "critical",
    "occurred_at": "2026-10-14T09:12:41Z"
  }
}
```

#### Le contrat de données

L'Open Data Contract Standard, projet de la communauté Bitol (page consultée le 14 octobre 2026), décrit un contrat comme un fichier YAML, indépendant de la plateforme, structuré en sections : informations fondamentales, schéma, contexte, références, qualité des données, support et canaux de communication, tarification, équipe, rôles, niveaux de service, infrastructures et serveurs, propriétés personnalisées, définitions faisant autorité, étiquettes et variables. Les clés de l'exemple suivant sont celles du cours, inspirées de ces sections, et non celles de la norme.

```yaml
contract_id: finding-critical-events
version: 2.1.0
owner_team: team-quality-apps
purpose: Informer les systèmes abonnés de la création d'un constat critique.
interface:
  channel: finding.critical.v2
  schema_ref: registry://finding-critical/2.1.0
semantics:
  severity: "critical : une décision d'immobilisation doit être prise"
quality:
  - rule: not_null
    fields: [finding_id, aircraft_id, occurred_at]
service_levels:
  delivery_latency_p95_seconds: 60
  availability_target_percent: 99.9
  retention_days: 7
change_policy:
  breaking_change_notice_days: 90
  parallel_versions: 2
support:
  channel: quality-apps-oncall
```

Ce contrat dit ce que le schéma ne dit pas : le sens de `severity`, le délai promis, la rétention et le préavis. Le propriétaire est une équipe, pas une personne.

#### Vérifier le contrat

```typescript
interface PayloadSchema {
  required: string[];
  properties: Record<string, { type: "string" | "number"; enum?: string[] }>;
}

function validatePayload(schema: PayloadSchema, payload: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const name of schema.required) {
    if (payload[name] === undefined || payload[name] === null) errors.push(`champ obligatoire absent : ${name}`);
  }
  for (const [name, value] of Object.entries(payload)) {
    const spec = schema.properties[name];
    if (!spec) continue; // champs supplémentaires tolérés : évolution compatible
    if (typeof value !== spec.type) errors.push(`type invalide : ${name}`);
    else if (spec.enum && !spec.enum.includes(String(value))) errors.push(`valeur hors énumération : ${name}`);
  }
  return errors;
}

// Percentile par rang le plus proche.
function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.max(0, rank - 1)];
}

interface Delivery {
  occurredAt: number; // secondes
  receivedAt: number;
}

function checkLatencySla(deliveries: Delivery[], p95TargetSeconds: number) {
  const latencies = deliveries.map((d) => d.receivedAt - d.occurredAt);
  const p95 = percentile(latencies, 95);
  return { count: latencies.length, p95, ok: p95 <= p95TargetSeconds };
}
```

Un événement conforme (avec le champ supplémentaire `reason`, toléré) donne zéro erreur ; un événement sans `aircraft_id` ni `occurred_at`, avec une gravité hors énumération, donne trois erreurs. Sur 20 livraisons dont la plus lente prend 90 secondes et les autres au plus 25, le 95e centile est de 25 secondes : le niveau de service de 60 secondes est tenu, malgré le cas lent. Si trois livraisons sur vingt prennent 90 secondes, le 95e centile passe à 90 : l'engagement n'est plus tenu. Le choix du centile est une décision : le maximum serait trop sévère, la moyenne cacherait les cas lents ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

Les vérifications du contrat sont de trois sortes :

1. **côté producteur** : chaque message publié est validé contre le schéma du registre, et des tests de charge vérifient les délais ;
2. **côté consommateur** : des tests de contrat ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)) rejouent des messages d'exemple contre le code du consommateur, et signalent les champs dont il dépend ;
3. **en exploitation** : des mesures de délai, de fraîcheur et de volume sont comparées aux niveaux de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)), et alimentent un tableau lisible par les consommateurs.

**Modes de défaillance.**

- **Contrat dans un wiki**, sans vérification.
- **Schéma sans sémantique** : tout le monde interprète à sa façon.
- **Aucun propriétaire** nommé.
- **Document dérivé** du producteur pour le consommateur, ou l'inverse.
- **Niveaux de service jamais mesurés.**
- **Ruptures sans préavis** ni coexistence.

**Contre-exemple.** Une équipe consomme les événements de constats critiques en lisant directement la table du producteur « parce que c'est plus simple ». Le producteur renomme une colonne lors d'un refactoring interne ; le consommateur casse en production un vendredi soir, sans que personne n'ait su qu'il dépendait de cette colonne. Un contrat avec un schéma publié, un propriétaire et des tests de consommateurs aurait rendu la dépendance visible et le changement négociable.

**Limites.** Un contrat coûte un effort d'écriture et de maintenance qui n'a de sens que pour les flux partagés et durables. Une spécification dérive si elle n'est pas générée ou validée à partir du code. Les engagements de service supposent une mesure et un propriétaire d'astreinte. Et la sémantique reste affaire de langage commun entre équipes ([14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)), pas de format.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | L'identifiant et la source de l'événement servent à détecter les doublons |
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | Les spécifications d'API synchrones ont leur propre contrat ; AsyncAPI est le pendant pour les messages |
| [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur) | Le SDK et la plateforme développeur publient les spécifications et les schémas |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les niveaux de service du contrat se mesurent par des SLI et des objectifs |
| [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent) | Le langage omniprésent fonde la sémantique du contrat |
| [20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données) | Le catalogue de données référence les contrats et leur lignage |
| [20.6 Données de référence et contrat de données](20-gouvernance-donnees-conformite.md#206-données-de-référence-et-contrat-de-données) | Le contrat de données y est vu sous l'angle de la gouvernance et des données de référence |
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Les tests de contrat vérifient les attentes des consommateurs |
| [28.4 Registre de schémas et règles de compatibilité](#284-registre-de-schémas-et-règles-de-compatibilité) | Le registre fournit les schémas que le contrat référence |

### 5. Application pratique

**Situation initiale.** Trois systèmes consomment `finding.critical.v2`. Le producteur ne sait pas ce dont chacun dépend, et les consommateurs ont des attentes différentes sur le délai.

**Problème.** Formaliser l'accord et pouvoir le vérifier automatiquement.

**Application du concept.** Un document AsyncAPI, un contrat de données avec propriétaire et niveaux de service, et des vérifications dans le pipeline.

**Déroulé.**

1. L'équipe qualité publie le document AsyncAPI du flux, généré à partir du schéma enregistré.
2. Elle rédige le contrat : propriétaire, sémantique de `severity`, règles de qualité, délai au 95e centile de 60 secondes, rétention de sept jours, préavis de 90 jours.
3. Chaque consommateur déclare dans son dépôt les champs dont il dépend et un test de contrat qui rejoue des messages d'exemple.
4. Le pipeline du producteur valide chaque message d'essai contre le schéma, et bloque la fusion si un test de consommateur échoue.
5. En exploitation, la mesure du délai de livraison est publiée ; une alerte part si le 95e centile dépasse 60 secondes.
6. Le contrat est référencé au catalogue ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)), avec ses consommateurs connus.
7. Une demande de rupture suit la règle de préavis ; elle est annoncée aux consommateurs listés.

**Résultat.** Les dépendances sont visibles, le délai est mesuré, et les changements passent par une négociation plutôt que par une panne.

**Limites.** Un consommateur qui ne déclare pas ses dépendances reste invisible : la mesure de ce qui est réellement lu (champs, groupes) complète la déclaration.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que décrit un document AsyncAPI, et qu'est-ce qui le distingue d'une description d'API de requête-réponse ?
2. **Compréhension.** Quels attributs une enveloppe CloudEvents exige-t-elle, et à quoi sert la paire source et identifiant ?
3. **Compréhension.** Qu'ajoute un contrat de données au schéma ?
4. **Pourquoi.** Pourquoi un contrat doit-il être vérifié automatiquement ?
5. **Raisonnement pratique.** Sur 20 livraisons, trois prennent 90 secondes et les autres moins de 25. L'engagement est un 95e centile de 60 secondes. Est-il tenu ?

#### Réponses

1. Il décrit une application qui échange des messages : serveurs, canaux, opérations d'envoi ou de réception, messages et schémas, indépendamment du protocole. Une description de requête-réponse décrit des ressources et des appels synchrones, pas des canaux ni des opérations d'émission et de réception.
2. L'identifiant, la source, la version de la spécification et le type. La paire source et identifiant est unique par événement : elle permet aux consommateurs de reconnaître un doublon.
3. La sémantique des champs, les règles de qualité, les niveaux de service, les règles d'évolution et le propriétaire : tout ce qui n'est pas la forme du message.
4. Parce qu'un contrat qui n'est pas contrôlé dérive de la réalité : le producteur change sans le savoir, le consommateur dépend sans le dire. Les contrôles rendent les écarts visibles à temps.
5. Non. Avec 20 valeurs, le 95e centile par rang le plus proche est la 19e valeur triée, soit 90 secondes ; trois livraisons sur vingt dépassent la cible, ce qui fait plus de 5 %.

## 28.6 Plateforme d'intégration sans code et réconciliation

### 1. Comprendre simplement

Une **plateforme d'intégration sans code** (*no-code integration platform*) permet à des personnes qui ne sont pas développeuses de relier des systèmes en assemblant visuellement des déclencheurs, des connecteurs, des correspondances et des actions. Elle peut être intégrée à la plateforme, pour les administrateurs d'un tenant, ou être un service externe. La **réconciliation** (*reconciliation*) est le processus qui compare des enregistrements de deux systèmes censés concorder, détecte les écarts (manquants, en trop, différents), et les corrige ou les signale.

**Pourquoi cela existe.** Chaque tenant a ses systèmes ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)) : écrire un connecteur sur mesure pour chacun ne tient pas. Les administrateurs veulent relier leurs outils sans attendre un développement. Et même une bonne intégration dérive : messages perdus, règles différentes de chaque côté, corrections manuelles. Il faut une façon de constater et de restaurer la concordance.

**Problème résolu.** Permettre aux administrateurs de construire des flux sans écrire de code, dans un cadre qui garde les droits, les quotas et l'audit, et mesurer régulièrement l'écart entre deux systèmes.

**Modèle mental.** Des prises universelles et le comptage de caisse. L'administrateur branche des éléments standard ; en fin de journée, on compte la caisse et on compare avec les tickets.

**Où l'analogie s'arrête.** Compter une caisse est simple. Réconcilier des données demande une clé commune, des règles de comparaison, des tolérances, et la décision de savoir quel système fait foi ([10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)).

**Exemple.** L'administratrice d'Alpha Air configure un flux : quand une tâche est terminée dans la plateforme, une ligne d'ordre de travail est créée dans l'ERP. Chaque nuit, un rapprochement compare les tâches terminées aux lignes de l'ERP.

**Les composants.**

1. des **déclencheurs** (événements, planifications) ;
2. des **connecteurs** ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)) ;
3. des **correspondances** ([28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)) ;
4. des **actions** ;
5. une **gestion des erreurs** : reprises, file d'échec, alerte ;
6. une **identité d'exécution** non humaine et des **secrets** ([4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines), [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) ;
7. des **limites** : quotas, débit, concurrence ;
8. une **observabilité** : exécutions, journaux ;
9. une **réconciliation** : clés, périmètre, règles, rapport, corrections.

**Objectif d'apprentissage :** vous pouvez décrire un flux sans code comme une configuration encadrée, dire ce qui le rend sûr, et mener une réconciliation en distinguant manquants, excédents et différences.

### 2. Connaissances essentielles

#### Définition

- **Plateforme d'intégration sans code** : environnement de configuration visuelle qui permet d'assembler des flux entre systèmes à partir de déclencheurs, de connecteurs et d'actions, sans programmer.
- **Réconciliation** : comparaison de deux ensembles d'enregistrements censés correspondre, sur une clé commune et un périmètre donnés, pour établir les concordances et les écarts et décider de leur traitement.

#### Idées fondamentales

1. **Le sans-code est une interface, pas un contournement.** Les flux passent par les mêmes API, droits, quotas et audit que le reste.
2. **Un flux est une donnée déclarative.** Un déclencheur, des étapes, des actions : versionnée, relue, testée.
3. **Un flux s'exécute sous une identité non humaine.** Avec des droits limités et un propriétaire humain.
4. **Les erreurs sont prévues.** Idempotence, file d'échec, reprise bornée, alerte.
5. **Une réconciliation compare un état à un autre.** Clé commune, périmètre, date de coupure.
6. **Elle distingue trois écarts.** Manquant d'un côté, manquant de l'autre, présent des deux côtés avec des valeurs différentes.
7. **La correction est une action tracée.** Elle suit le système de référence, et certains écarts se traitent à la main.

#### Vocabulaire essentiel

- **Déclencheur** (*trigger*) : événement ou planification qui démarre un flux.
- **Action** (*action*) : opération effectuée par une étape, par exemple créer un enregistrement chez un tiers.
- **Flux** (*flow*, *scenario*) : suite déclarée de déclencheur et d'étapes.
- **Exécution** (*run*) : une instance de flux, avec ses entrées, ses résultats et ses erreurs.
- **Clé de rapprochement** (*match key*) : valeur commune qui identifie un même objet dans les deux systèmes.
- **Date de coupure** (*cutoff*) : instant jusqu'auquel on compare, pour ne pas prendre pour un écart ce qui est en transit.
- **Écart** (*discrepancy*) : différence constatée entre les deux systèmes.

#### Relations de cause à effet

- Un flux est créé sous le compte personnel d'un administrateur. Il s'arrête quand la personne part ou change de rôle.
- Les erreurs ne sont pas gérées. Un échec silencieux laisse des enregistrements manquants dont personne ne sait rien.
- Aucune réconciliation n'est prévue. Les écarts s'accumulent et sont découverts à la clôture.
- La correction automatique ignore le système de référence. Une donnée correcte est écrasée par une donnée fausse.

#### Idées reçues

- **« Sans code, sans gouvernance. »** Non. Un flux sans code agit sur des données réelles : il a besoin d'un propriétaire, de droits limités, de quotas et d'une trace.
- **« Une intégration bien faite n'a pas besoin de réconciliation. »** Non. Messages perdus, règles différentes et corrections manuelles créent des écarts même dans une bonne intégration.
- **« Réconcilier, c'est comparer des totaux. »** Un total est un premier contrôle ; il ne dit pas quels enregistrements diffèrent.

#### Principe clé

Un flux sans code est une configuration versionnée qui s'exécute sous une identité encadrée, et une réconciliation régulière mesure l'écart réel entre les systèmes plutôt que de le supposer nul.

#### Si vous ne retenez que trois choses

1. Un flux sans code reste dans le cadre de la plateforme : droits, quotas, audit, propriétaire.
2. Une réconciliation compare deux états sur une clé et une date de coupure, et classe les écarts.
3. La correction suit le système de référence, de façon idempotente et tracée.

### 3. Explication technique détaillée

#### Anatomie d'un flux

```json
{
  "id": "task-to-erp",
  "version": 4,
  "owner": "user_nadia",
  "run_as": "svc_flow_task_to_erp",
  "trigger": { "event": "task.completed" },
  "steps": [
    {
      "id": "s1",
      "connector": "erp-zeta",
      "action": "create_work_order_line",
      "mapping": "zeta-erp-from-task@3"
    }
  ],
  "on_error": { "retries": 3, "backoff_seconds": [10, 60, 300], "dead_letter": true },
  "limits": { "max_runs_per_minute": 60 }
}
```

Le flux est une donnée : il a un identifiant, une version, un **propriétaire** (une personne), une **identité d'exécution** (un compte de service, voir [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines)), un déclencheur, des étapes qui référencent des connecteurs et des correspondances versionnées ([28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)), une politique d'erreur et des limites. Le propriétaire répond du flux ; l'identité d'exécution porte des droits limités, et c'est elle qui apparaît à l'audit ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

#### Les garde-fous de la plateforme

| Garde-fou | Rôle | Entrée du parcours |
|---|---|---|
| Liste de connecteurs et d'actions autorisés par tenant | Un flux ne peut employer que ce qui est ouvert | [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs), [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) |
| Identité non humaine à droits limités | Moindre privilège ; attribution à l'audit | [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines), [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) |
| Secrets dans un coffre | Aucun secret dans la définition du flux | [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) |
| Quotas et limites de débit | Un flux ne sature ni la plateforme ni le système cible | [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation), [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) |
| Équité entre tenants | Un tenant ne prive pas les autres de capacité | [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) |
| Journal d'exécution | Qui a lancé quoi, avec quel résultat | [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) |
| Versionnement et retour arrière | Une modification est tracée et réversible | [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) |

Un contrôle de définition refuse un flux mal formé avant son activation :

```typescript
interface FlowStep {
  id: string;
  connector: string;
  action: string;
}

interface Flow {
  id: string;
  version: number;
  owner: string | null;
  runAs: string | null;
  trigger: { event: string };
  steps: FlowStep[];
}

function validateFlow(flow: Flow, allowed: Record<string, string[]>, maxSteps: number): string[] {
  const problems: string[] = [];
  if (!flow.owner) problems.push("propriétaire absent");
  if (!flow.runAs) problems.push("identité d'exécution absente");
  if (flow.steps.length === 0) problems.push("aucune étape");
  if (flow.steps.length > maxSteps) problems.push(`trop d'étapes : ${flow.steps.length} > ${maxSteps}`);
  const ids = new Set<string>();
  for (const s of flow.steps) {
    if (ids.has(s.id)) problems.push(`étape en double : ${s.id}`);
    ids.add(s.id);
    const actions = allowed[s.connector];
    if (!actions) problems.push(`connecteur non autorisé : ${s.connector}`);
    else if (!actions.includes(s.action)) problems.push(`action non autorisée : ${s.connector}.${s.action}`);
  }
  return problems;
}
```

Avec les actions autorisées `erp-zeta` : `create_work_order_line` et `read_work_order`, et `mail` : `send`, le flux `task-to-erp` ci-dessus passe sans problème. Un flux sans propriétaire ni identité, dont une étape appelle `delete_work_order` (non autorisée) et une autre le connecteur `ftp` (non autorisé), avec un identifiant d'étape en double, est refusé avec cinq problèmes.

Les produits du marché illustrent le modèle : des comparatifs tiers consultés décrivent des outils où un déclencheur démarre un flux, suivi d'actions réalisées par des connecteurs, avec une interface linéaire ou en canevas selon le produit, et des différences de gouvernance selon qu'ils sont hébergés par l'éditeur ou auto-hébergés. Ces descriptions viennent de pages tierces, parfois publiées par les éditeurs eux-mêmes : les fonctions, les limites et les tarifs se vérifient dans la documentation du produit retenu.

#### La réconciliation

Elle se déroule en étapes :

1. **définir le périmètre et la date de coupure** : quels objets, jusqu'à quel instant ; les éléments en transit après la coupure ne sont pas des écarts ;
2. **extraire les deux côtés** sous forme d'instantanés, avec une clé commune ;
3. **comparer** : manquant de l'autre côté, en trop, différent au-delà d'une tolérance ;
4. **classer** : différence de timing, erreur de correspondance, vraie divergence ;
5. **rapporter** : taux de concordance, liste des écarts, tendance ;
6. **corriger** ou escalader : de façon idempotente, selon le système de référence ([10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)) ;
7. **apprendre** : si un type d'écart revient, on corrige la cause (correspondance, reprise) et non seulement l'effet.

```typescript
interface Rec {
  key: string;
  hours: number;
}

interface Discrepancy {
  key: string;
  kind: "missing_in_b" | "missing_in_a" | "different";
  a?: number;
  b?: number;
}

function reconcile(a: Rec[], b: Rec[], tolerance: number): { matched: number; discrepancies: Discrepancy[] } {
  const bByKey = new Map(b.map((r) => [r.key, r]));
  const seen = new Set<string>();
  const discrepancies: Discrepancy[] = [];
  let matched = 0;
  for (const ra of a) {
    const rb = bByKey.get(ra.key);
    seen.add(ra.key);
    if (!rb) {
      discrepancies.push({ key: ra.key, kind: "missing_in_b", a: ra.hours });
    } else if (Math.abs(ra.hours - rb.hours) > tolerance) {
      discrepancies.push({ key: ra.key, kind: "different", a: ra.hours, b: rb.hours });
    } else {
      matched += 1;
    }
  }
  for (const rb of b) {
    if (!seen.has(rb.key)) discrepancies.push({ key: rb.key, kind: "missing_in_a", b: rb.hours });
  }
  discrepancies.sort((x, y) => x.key.localeCompare(y.key));
  return { matched, discrepancies };
}
```

Sur quatre tâches de la plateforme (`mt_1040` à 2,0 h, `mt_1041` à 1,5 h, `mt_1042` à 4,0 h, `mt_1043` à 0,5 h) et quatre lignes de l'ERP (`mt_1040` à 2,0 h, `mt_1041` à 1,75 h, `mt_1042` à 4,02 h, `mt_1044` à 3,0 h), avec une tolérance de 0,05 h, deux enregistrements concordent (`mt_1040`, et `mt_1042` dont l'écart de 0,02 h est dans la tolérance), un est différent (`mt_1041`), un manque dans l'ERP (`mt_1043`) et un manque dans la plateforme (`mt_1044`).

Le même rapprochement se fait en SQL, par une jointure externe complète sur la clé, après avoir borné chaque côté par la date de coupure :

```sql
WITH p AS (
  SELECT task_id, hours FROM task_completed WHERE tenant_id = $1 AND completed_at < $2
), e AS (
  SELECT task_ref, hours FROM erp_line_snapshot WHERE tenant_id = $1 AND booked_at < $2
)
SELECT COALESCE(p.task_id, e.task_ref) AS match_key,
       CASE WHEN e.task_ref IS NULL THEN 'missing_in_erp'
            WHEN p.task_id IS NULL THEN 'missing_in_platform'
            ELSE 'different' END AS kind,
       p.hours AS platform_hours,
       e.hours AS erp_hours
FROM p
FULL OUTER JOIN e ON e.task_ref = p.task_id
WHERE e.task_ref IS NULL OR p.task_id IS NULL OR abs(p.hours - e.hours) > 0.05;
```

Le filtre de tenant et la date de coupure sont dans chaque côté, avant la jointure, pour qu'un enregistrement manquant d'un côté ne soit pas éliminé par la condition de l'autre. Essayée sur les mêmes quatre tâches et quatre lignes, la requête renvoie les trois écarts attendus.

#### Les niveaux de réconciliation

| Niveau | Contrôle | Coût | Ce qu'il détecte |
|---|---|---|---|
| Comptage | Nombre d'enregistrements par période | Faible | Un écart global |
| Agrégat | Sommes, minimum, maximum par groupe | Faible à moyen | Un écart de valeurs |
| Empreinte | Condensat des enregistrements par lot | Moyen | Quel lot diffère |
| Ligne à ligne | Comparaison par clé | Élevé | Quel enregistrement diffère, et comment |

On commence par les niveaux peu coûteux et l'on descend sur les lots qui diffèrent.

**Modes de défaillance.**

- **Flux sous un compte personnel.**
- **Aucune gestion d'erreur** ni file d'échec.
- **Secrets dans la définition** du flux.
- **Pas de date de coupure** : l'en-cours est pris pour des écarts.
- **Correction automatique** sans système de référence.
- **Écarts corrigés un par un**, sans traiter la cause.

**Contre-exemple.** Une administratrice crée un flux qui pousse les tâches terminées vers l'ERP, sous son propre compte, sans file d'échec ni réconciliation. Elle change de service ; son compte est désactivé ; le flux s'arrête sans bruit. Trois mois plus tard, la clôture trimestrielle révèle 4 % d'heures manquantes dans l'ERP. Une identité d'exécution propre au flux, une alerte sur les échecs et un rapprochement nocturne auraient fait apparaître l'arrêt le lendemain.

**Limites.** Un flux sans code a un plafond de complexité : au-delà de quelques étapes et de règles conditionnelles, le code est plus lisible. Les produits externes sont des sous-traitants à encadrer ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)). Une réconciliation ne règle pas un désaccord de sens ([28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique)). Et les corrections automatiques doivent rester limitées aux cas où le système de référence est sans ambiguïté.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Les corrections de réconciliation sont idempotentes |
| [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) | L'identité d'exécution d'un flux est une identité non humaine |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La cohérence à terme explique les écarts transitoires et la date de coupure |
| [8.8 Administration technique, clés d'API, webhooks et intégrations](08-admin-control-plane.md#88-administration-technique-clés-dapi-webhooks-et-intégrations) | L'administration technique gère clés, webhooks et intégrations par tenant |
| [10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) | Les connecteurs sont les briques des flux |
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | La synchronisation et l'ETL sont les mécanismes que la réconciliation vérifie |
| [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence) | Le système de référence décide qui a raison en cas d'écart |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites par tenant protègent la plateforme des flux trop gourmands |
| [28.2 Correspondance, transformation et modèle canonique](#282-correspondance-transformation-et-modèle-canonique) | Les correspondances sont les étapes de transformation d'un flux |

### 5. Application pratique

**Situation initiale.** Nadia, la planificatrice d'Alpha Air, veut que les heures des tâches terminées arrivent dans l'ERP de la comptabilité sans ressaisie. Aucune équipe de développement n'est disponible avant le trimestre suivant.

**Problème.** Mettre en place le flux sans développement, et savoir s'il est fidèle.

**Application du concept.** Un flux déclaré dans l'outil d'intégration de la plateforme, sous une identité dédiée, avec une réconciliation nocturne.

**Déroulé.**

1. Nadia compose le flux : déclencheur `task.completed`, une étape de création de ligne d'ordre de travail dans l'ERP, avec la correspondance du composant.
2. Le contrôle de définition vérifie le propriétaire, l'identité d'exécution `svc_flow_task_to_erp`, les actions autorisées et la limite d'étapes.
3. Le flux est activé pour la base de Lyon, derrière un drapeau ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) ; les droits de l'identité se limitent à la création de lignes.
4. Les échecs sont repris trois fois, puis placés en file d'échec avec une alerte au propriétaire.
5. Chaque nuit, le rapprochement compare les tâches terminées jusqu'à minuit aux lignes de l'ERP, avec une tolérance de 0,05 heure.
6. Le rapport du matin donne le taux de concordance et la liste des écarts ; un écart « manquant dans l'ERP » est corrigé par un rejeu idempotent, un écart « différent » est escaladé à Nadia.
7. Une tendance d'écarts du même type déclenche la correction de la correspondance, pas seulement des lignes.

**Résultat.** Les heures arrivent sans ressaisie, avec un taux de concordance mesuré chaque jour et des écarts traités ou escaladés.

**Limites.** Le rapprochement ne voit que les tâches et les lignes qu'il sait mettre en correspondance : une ligne saisie à la main dans l'ERP sans référence de tâche apparaît comme un excédent à examiner.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui rend un flux sans code sûr dans une plateforme multi-tenant ?
2. **Compréhension.** Quels sont les trois types d'écarts d'une réconciliation ?
3. **Compréhension.** À quoi sert la date de coupure ?
4. **Pourquoi.** Pourquoi une intégration bien faite a-t-elle quand même besoin d'une réconciliation ?
5. **Raisonnement pratique.** Une réconciliation montre une ligne présente dans l'ERP et absente de la plateforme. Que faire ?

#### Réponses

1. Il s'exécute sous une identité non humaine à droits limités, avec un propriétaire, des connecteurs et actions autorisés par tenant, des secrets hors de sa définition, des quotas, un journal d'exécution et un versionnement : les contrôles de la plateforme s'appliquent comme pour le code.
2. Un enregistrement manquant dans l'autre système, un enregistrement en trop (manquant dans le premier), et un enregistrement présent des deux côtés avec des valeurs différentes au-delà d'une tolérance.
3. À ne pas prendre pour des écarts les éléments en transit : on compare les deux systèmes jusqu'au même instant, après lequel les différences sont attendues du fait de la cohérence à terme.
4. Parce que des messages se perdent, que les règles diffèrent de part et d'autre et que des corrections manuelles se produisent : la réconciliation constate l'écart réel, indépendamment de la qualité du tuyau.
5. Vérifier d'abord s'il s'agit d'un décalage de timing (après la coupure) ou d'une saisie manuelle sans référence ; consulter le système de référence pour cet objet ; puis soit créer l'élément manquant par une action idempotente, soit signaler et escalader si le sens est ambigu.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| FHIR : ressources, profils, extensions, version courante | Présentation de HL7 FHIR | https://hl7.org/fhir/overview.html | 28.1 |
| FHIR : interactions, versions, types de média, codes 406 et 415 | Interface RESTful de HL7 FHIR | https://hl7.org/fhir/http.html | 28.1 |
| OPC UA : architecture, modèle d'information, sécurité, publication-abonnement | OPC Foundation, présentation d'OPC UA | https://opcfoundation.org/about/opc-technologies/opc-ua/ | 28.1 |
| Modèle canonique et nombre de traducteurs | Enterprise Integration Patterns, Canonical Data Model | https://www.enterpriseintegrationpatterns.com/patterns/messaging/CanonicalDataModel.html | 28.2 |
| Traducteur de messages | Enterprise Integration Patterns, Message Translator | https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTranslator.html | 28.2 |
| Événements, sujets, partitions, clé, ordre, rétention, réplication | Apache Kafka, introduction | https://kafka.apache.org/intro | 28.3 |
| Types de compatibilité, défaut, ordre de mise à niveau | Confluent, Schema Evolution and Compatibility | https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html | 28.4 |
| Résolution entre schéma d'écrivain et de lecteur | Apache Avro 1.11.1, Schema Resolution | https://avro.apache.org/docs/1.11.1/specification/ | 28.4 |
| Canaux, opérations, messages, formats de charge | AsyncAPI 3.0.0 | https://www.asyncapi.com/docs/reference/specification/v3.0.0 | 28.5 |
| Enveloppe d'événement, attributs requis, unicité source et identifiant | CloudEvents (version 1.0.3 en cours d'élaboration) | https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md | 28.5 |
| Sections d'un contrat de données | Open Data Contract Standard (Bitol) | https://bitol-io.github.io/open-data-contract-standard/latest/ | 28.5 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- UN/EDIFACT : la page de l'UNECE a refusé l'accès ; la série ISO 9735 (version 4, édition 3 de la partie 10, 2022) et la mise à jour semestrielle des répertoires viennent d'extraits de catalogues et d'un groupe de travail.
- ATA Spec 2000 et S1000D : connus par des extraits de recherche (pages de l'association des transporteurs, de la communauté des spécifications de la série S), non lus à la source ; leur statut et leurs versions sont à vérifier chez l'éditeur.
- OPC UA : la page consultée ne mentionne pas la norme internationale qui lui correspond ; elle n'a pas été relue.
- Les groupes de consommateurs d'Apache Kafka : la page de documentation générale n'a pas pu être lue (page de redirection) ; les règles de partage des partitions et de rééquilibrage viennent de guides tiers et de la documentation de programmation des clients.
- La fonction de hachage et l'attribution des partitions de l'esquisse sont des illustrations, pas l'algorithme d'un produit.
- Avro : la spécification lue est la version 1.11.1 ; la section sur les alias n'a pas été relue ; les règles de compatibilité de Protobuf et de JSON Schema ne sont pas traitées. La page de Confluent a été lue en partie (les 100 000 premiers caractères de 154 017).
- AsyncAPI : page lue en partie (100 000 caractères de 111 804), sans date de publication. CloudEvents : version en cours d'élaboration de la branche principale.
- Les clés du contrat de données de l'exemple sont celles du cours : elles ne reprennent pas les noms de champs de l'Open Data Contract Standard.
- Les plateformes d'intégration sans code : aucune documentation d'éditeur n'a été lue ; la description des modèles de déclencheur et d'action vient de comparatifs tiers ; les fonctions, limites et tarifs ne sont pas vérifiés.
- La démarche de réconciliation, les niveaux de contrôle et le choix du 95e centile sont des recommandations du cours.
- Les valeurs d'exemple : tailles de lots, délais, préavis, tolérances, rétention, seuils.
- Les extraits TypeScript ont été exécutés sur les valeurs d'exemple données ; les scripts SQL ont été analysés syntaxiquement (dialecte PostgreSQL) et la requête de rapprochement a été essayée sur SQLite 3.53.4.
