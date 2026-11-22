# Module 18 — Fichiers, documents et contenus

> **Question directrice.** Comment stocker, sécuriser, versionner et diffuser les fichiers de dizaines de tenants, sans fuite, sans code malveillant et sans coût imprévu ?

## Présentation du module

**Objectif.** Presque toute application métier manipule des pièces jointes, des photos, des rapports et des documents réglementaires. Le parcours initial les nomme dans des tableaux de politiques ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants), [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant), [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité), [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)) sans décrire le mécanisme. Ce module du plan des compléments comble cet écart : comment un fichier entre dans la plateforme, où il vit, qui peut le lire, comment il est contrôlé, diffusé, transformé en document, signé, conservé et supprimé.

**Prérequis.** L'isolation des tenants ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) et leurs données propres ([5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)), les droits au niveau ressource, champ et ligne ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), le chiffrement ([11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)), la révision d'entité et ses pièces jointes ([9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)), l'archivage et la rétention ([3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)), l'exception, la preuve et le gel légal ([9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)), ainsi que les états d'erreur ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).

**Un mot, plusieurs sens.** Ce module distingue le **fichier** (la suite d'octets, avec son nom et son type), l'**objet** stocké (le fichier tel que le service de stockage le conserve, sous une clé) et le **document** (un fichier qui a un sens métier, un modèle, un cycle de vie et parfois une valeur probante). Le mot « objet » désigne ici le stockage, et non une ressource métier au sens de [2.1 Entité, ressource, objet et enregistrement](02-donnees-ressources.md#21-entité-ressource-objet-et-enregistrement).

**Ordre retenu.** Quatre groupes, de l'octet au document.

```text
Stocker      stockage d'objets, métadonnées, empreinte ─ versions, quotas, niveaux
Recevoir     téléversement direct et fractionné ─ validation, antimalware, quarantaine
Diffuser     autorisation et liens expirants ─ aperçus et réseau de diffusion ─ partage externe et filigrane
Documents    modèles et génération ─ signature électronique ─ gestion documentaire ─ conservation et gel légal
```

| Groupe | Question de l'utilisateur |
|---|---|
| Stocker | Où vit ce fichier, et comment sait-on qu'il n'a pas été altéré ? |
| Recevoir | Comment l'envoyer sans bloquer la plateforme, et comment savoir qu'il est sain ? |
| Diffuser | Qui peut le télécharger, pour combien de temps, et comment le partager hors du tenant ? |
| Documents | Comment produire, signer, classer, conserver et supprimer un document qui engage ? |

**Références.** Les normes et textes cités (RFC, documentation d'un fournisseur de stockage, règlement européen) ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)
- [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)
- [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable)
- [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)
- [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)
- [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)
- [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)
- [18.8 Modèles de document et génération de documents](#188-modèles-de-document-et-génération-de-documents)
- [18.9 Signature électronique](#189-signature-électronique)
- [18.10 Gestion documentaire et cycle de vie du document](#1810-gestion-documentaire-et-cycle-de-vie-du-document)
- [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)

## 18.1 Stockage d'objets, métadonnées et empreinte de contenu

### 1. Comprendre simplement

Le **stockage d'objets** (*object storage*) conserve des fichiers sous forme d'**objets** : une suite d'octets, rangée sous une **clé** unique, dans un espace plat que l'on interroge par une interface HTTP (écrire, lire, supprimer, lister). Les **métadonnées d'un objet** (*blob metadata*) sont les informations qui le décrivent : taille, type, date, auteur, rattachement métier. L'**empreinte de contenu** (*content checksum*) est une valeur calculée à partir des octets, qui sert à détecter qu'ils ont été altérés ou à reconnaître deux fichiers identiques.

**Pourquoi cela existe.** Une base de données relationnelle n'est pas faite pour contenir des millions de fichiers de plusieurs mégaoctets : elle devient lourde à sauvegarder, à répliquer et à faire évoluer. Un système de fichiers classique n'est pas fait pour être partagé par des milliers d'instances d'une application. Le stockage d'objets répond à ce besoin : très grand volume, accès par le réseau, durabilité, coût au gigaoctet. Les métadonnées permettent de savoir ce qu'est un objet sans le lire, et l'empreinte de savoir s'il est intact.

**Problème résolu.** Conserver de grands volumes de fichiers de façon durable et partageable, avec de quoi les retrouver, les contrôler et vérifier qu'ils n'ont pas changé.

**Modèle mental.** Un entrepôt à étagères numérotées. Chaque colis porte un numéro de rayonnage (la clé), une étiquette (les métadonnées), et un scellé numérique (l'empreinte) : si le scellé ne correspond plus, le contenu a changé.

**Où l'analogie s'arrête.** Dans un entrepôt, on ouvre un colis pour en changer un objet. Un objet stocké ne se modifie pas en place : on le remplace en entier. Et le scellé n'est pas gardé dans le colis : il vit à côté, dans la base, sinon un attaquant qui modifie les deux le modifierait aussi.

**Exemple.** Karim photographie une fissure sur le train d'atterrissage de F-ABCD. Le fichier part vers le stockage sous la clé `tenants/ten_airline_01/files/f_01J0A4`. La base d'Alpha Air garde à côté : le nom d'origine, le type `image/jpeg`, le constat `fd_204` auquel la photo est rattachée, et l'empreinte SHA-256. Un mois plus tard, le contrôle d'intégrité relit l'objet, recalcule l'empreinte, et la compare.

**Les composants.**

1. un **service de stockage d'objets**, aux conteneurs (*buckets*) et aux clés ;
2. une **clé opaque**, jamais porteuse de données métier ;
3. des **métadonnées techniques** (taille, type, empreinte) et **métier** (sujet, auteur, statut) ;
4. une **table de référence** dans la base, source de vérité des droits et des liens ;
5. une **empreinte** calculée, stockée, vérifiée ;
6. un **chiffrement** au repos par tenant (voir [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)) ;
7. des **contrôles d'intégrité** périodiques.

**Objectif d'apprentissage :** vous pouvez décrire un objet stocké, dire où vivent les métadonnées métier, et expliquer à quoi sert une empreinte de contenu et ce qu'elle ne prouve pas.

### 2. Connaissances essentielles

#### Définition

- **Stockage d'objets** : service qui conserve des données non structurées sous forme d'objets immuables, identifiés par une clé dans un espace de noms plat, accessibles par une interface réseau.
- **Métadonnées d'un objet** : informations associées à un objet, techniques (taille, type de contenu, date, empreinte) ou métier (propriétaire, sujet, statut, durée de conservation).
- **Empreinte de contenu** : valeur de longueur fixe calculée par une fonction de hachage à partir des octets d'un fichier, telle qu'une modification du contenu change l'empreinte.

#### Idées fondamentales

1. **Un objet est remplacé, pas modifié.** Écrire revient à déposer un nouvel objet sous la clé, entier.
2. **La clé est un identifiant, pas une description.** Elle est opaque : le sens métier vit dans la base.
3. **La base est la source de vérité des droits.** Le stockage garde des octets ; la base dit à qui ils appartiennent et ce qu'on peut en faire.
4. **L'empreinte détecte, elle ne protège pas.** Elle révèle une altération si l'on sait où lire la valeur de référence.
5. **L'isolation se porte jusque dans le stockage.** Préfixes par tenant, politiques d'accès, chiffrement par tenant (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
6. **Le fichier a un cycle de vie.** En attente, reçu, contrôlé, disponible, supprimé : un statut le dit.

#### Vocabulaire essentiel

- **Objet** (*object*) : unité stockée, formée d'octets, d'une clé et de métadonnées.
- **Conteneur** (*bucket*) : espace de regroupement des objets, auquel s'appliquent des politiques.
- **Clé** (*key*) : identifiant de l'objet dans le conteneur. Une séparation par préfixes (`tenants/…/files/…`) permet de lister par groupes.
- **Fonction de hachage** (*hash function*) : fonction qui transforme des octets en une empreinte de longueur fixe.
- **SHA-256** : fonction de hachage de la famille SHA-2, spécifiée par la norme FIPS 180-4, qui produit une empreinte de 256 bits, notée en 64 caractères hexadécimaux.
- **Adressage par le contenu** (*content addressing*) : usage de l'empreinte comme identifiant.
- **Mutualisation** (*deduplication*) : stockage unique de contenus identiques.
- **Nettoyage d'intégrité** (*scrubbing*) : relecture périodique des objets pour détecter les corruptions.

#### Relations de cause à effet

- Les clés contiennent le nom du client ou le numéro du constat. Elles apparaissent dans les journaux et dans les liens, et révèlent des informations à des tiers.
- Les droits sont portés par le stockage seul. Un changement de rôle dans la plateforme n'a aucun effet sur l'accès aux fichiers déjà partagés.
- L'empreinte n'est pas stockée à part. Quelqu'un qui remplace le fichier remplace aussi la valeur de contrôle, et rien ne trahit la modification.
- Les fichiers de tous les tenants sont mutualisés sans précaution. La réponse « ce fichier existe déjà » révèle à un tenant le contenu d'un autre.
- L'intégrité n'est jamais relue. Une corruption silencieuse est découverte le jour où l'on a besoin du fichier.

#### Idées reçues

- **« Un stockage d'objets est un système de fichiers à distance. »** Non. Il n'a pas de répertoires réels, pas de modification partielle, pas de verrous de fichiers.
- **« L'empreinte prouve qui a produit le fichier. »** Non. Elle prouve seulement que les octets n'ont pas changé depuis son calcul, à condition de se fier à la valeur de référence.
- **« Mettre les fichiers dans la base est plus simple. »** Pour quelques kilo-octets, parfois. Au-delà, sauvegarde, réplication et coûts en pâtissent.

#### Principe clé

Le stockage garde des octets sous une clé opaque ; la base garde le sens, les droits et l'empreinte de référence ; et l'intégrité se vérifie en comparant ce que l'on relit à ce que l'on a enregistré.

#### Si vous ne retenez que trois choses

1. Un objet est une suite d'octets sous une clé opaque, remplacée en entier à chaque écriture.
2. Les métadonnées métier, les droits et l'empreinte de référence vivent dans la base, pas dans la clé.
3. Une empreinte détecte une altération ; elle se calcule, se stocke à part et se revérifie.

### 3. Explication technique détaillée

#### Le modèle

```text
        Base de données                              Service de stockage d'objets
  ┌──────────────────────────────┐              ┌────────────────────────────────────┐
  │ stored_file                  │   référence  │ conteneur « plateforme-fichiers »  │
  │  id, tenant_id, statut       │ ───────────► │  tenants/ten_airline_01/files/     │
  │  sujet (type, id)            │  storage_key │    f_01J0A4   (octets + métadonnées)│
  │  sha256, taille, type        │              │    f_01J0A5                        │
  │  auteur, dates               │              │    …                               │
  └──────────────────────────────┘              └────────────────────────────────────┘
        droits, liens, recherche                        octets, durabilité, coût
```

Chaque fichier a une **ligne de référence**. Les droits s'évaluent sur cette ligne et sur son sujet, selon les mêmes règles que toute ressource (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)). Le stockage ne contient pas la règle : il applique la politique générale (aucun accès public, préfixe par tenant).

```sql
CREATE TABLE stored_file (
  tenant_id      uuid        NOT NULL,
  id             uuid        NOT NULL,
  storage_key    text        NOT NULL,
  size_bytes     bigint      NOT NULL CHECK (size_bytes >= 0),
  sha256         char(64),
  content_type   text        NOT NULL,
  original_name  text        NOT NULL,
  status         text        NOT NULL CHECK (status IN
                   ('pending','uploaded','scanning','clean','quarantined','rejected','deleted')),
  subject_type   text,
  subject_id     text,
  created_by     uuid        NOT NULL,
  created_at     timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (storage_key)
);
```

**Comment la lire.** Le statut suit le cycle de vie du fichier : les entrées suivantes le complètent (téléversement : [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable), contrôle : [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine), suppression : [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)). Le nom d'origine est une donnée d'affichage : il n'entre jamais dans la clé, et il se nettoie avant tout usage.

#### La clé

| Règle | Raison |
|---|---|
| Préfixe par tenant (`tenants/{tenant}/files/{id}`) | Politiques d'accès et suppression par tenant (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) |
| Identifiant opaque, généré côté serveur | Aucune fuite d'information, aucun conflit |
| Aucune donnée personnelle ni métier | Les clés apparaissent dans les journaux, les traces, les liens |
| Jamais le nom fourni par l'utilisateur | Risques de traversée de chemin, de collision, d'injection |
| Une clé neuve à chaque téléversement | Un lien d'écriture signé remplace l'objet existant de même clé (voir [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable)) |

#### L'empreinte

La fonction SHA-256 (norme FIPS 180-4) produit, pour un contenu donné, toujours la même empreinte, et un changement minime du contenu la bouleverse.

| Contenu | Empreinte SHA-256 (64 caractères hexadécimaux) |
|---|---|
| `abc` | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` |
| `abd` | `a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9` |
| `abc ` (avec une espace) | `5488613c42b0d34d60f7aa9e94be317a3ee102a2bbd91ccc73cc79fbc2269955` |

```typescript
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

async function sha256Of(path: string): Promise<string> {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}
```

**Où la calculer.** Le client la calcule avant l'envoi et la déclare ; la plateforme la **recalcule** à la réception ou au contrôle, et compare. Un client qui annonce une empreinte fausse est détecté. Le service de stockage peut aussi vérifier lui-même une empreinte transmise avec l'écriture : la documentation d'un grand service d'objets indique, pour les liens d'écriture signés, la prise en charge de plusieurs algorithmes dont SHA-256 et plusieurs sommes de contrôle de type CRC.

**À quoi elle sert.**

| Usage | Principe | Précaution |
|---|---|---|
| Intégrité au transport | L'empreinte reçue égale celle déclarée | Refuser l'objet sinon |
| Intégrité dans la durée | Relecture périodique et comparaison | Valeur de référence stockée à part |
| Mutualisation (déduplication) | Un seul exemplaire pour des contenus identiques | **Par tenant seulement** : entre tenants, répondre « existe déjà » révèle un contenu |
| Détection de modification | Comparer deux versions | N'identifie pas qui a modifié |
| Référence de preuve | Lier une approbation à un fichier précis | Voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) et [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) |

L'empreinte ne remplace pas la **signature** : elle ne dit pas qui l'a produite. La signature d'un document est un autre mécanisme (voir [18.9 Signature électronique](#189-signature-électronique)).

#### Chiffrement et durabilité

Le stockage est chiffré au repos, avec une clé propre à chaque tenant quand le niveau d'isolation l'exige (voir [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) et [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)). La **durabilité** est la promesse que les objets ne seront pas perdus ; elle ne remplace ni la sauvegarde logique ni la protection contre l'effacement par erreur (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) et [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).

#### Les modes de défaillance

- **Une référence orpheline** : la ligne existe, l'objet manque, ou l'inverse. Une tâche de réconciliation les détecte (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)).
- **Une fuite par la clé** : un nom de client dans une adresse transmise à un tiers.
- **Une corruption silencieuse** : l'octet change, personne ne relit.
- **Une empreinte non vérifiée** : elle est stockée, mais jamais comparée.
- **Un accès public par défaut** : une politique de conteneur trop permissive.

**Contre-exemple.** Une plateforme stocke les fichiers sous le nom donné par l'utilisateur, `rapport.pdf`, dans un répertoire commun. Deux tenants envoient un fichier du même nom : le second remplace le premier, et le premier tenant ne le sait pas.

**Limites.** L'empreinte seule ne prouve rien de l'origine. La durabilité d'un service ne protège pas d'une suppression volontaire, d'une erreur de configuration ou d'un compte compromis. Et les limites de taille, de cohérence et de coût dépendent du service : elles se vérifient dans sa documentation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Les fichiers sont une couche à isoler : préfixe, politique, chiffrement par tenant |
| [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant) | Les fichiers font partie des données propres au tenant, avec leur propre politique |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits sur le fichier suivent ceux de son sujet |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Une révision peut référencer un fichier par son empreinte |
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Chiffrement au repos et clés par tenant |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Versions, quotas et niveaux s'appuient sur la ligne de référence |
| [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable) | Le téléversement renseigne la ligne et le statut |
| [18.9 Signature électronique](#189-signature-électronique) | La signature complète l'empreinte en identifiant le signataire |

### 5. Application pratique

**Situation initiale.** Alpha Air stocke les photos de constats dans le système de fichiers d'un serveur. Une sauvegarde nocturne les copie, et personne ne sait combien de fichiers ont été altérés ou perdus. Un auditeur demande de prouver que la photo d'un constat n'a pas changé depuis le contrôle.

**Problème.** Pas de référence d'intégrité, une organisation par chemins lisibles, et aucune isolation par tenant.

**Application du concept.** La plateforme adopte le stockage d'objets, une table de référence et une empreinte SHA-256.

**Déroulé.**

1. Karim envoie la photo. La plateforme génère l'identifiant `f_01J0A4` et la clé `tenants/ten_airline_01/files/f_01J0A4`.
2. À la réception, la plateforme recalcule l'empreinte, la compare à celle déclarée, et l'enregistre dans `stored_file`.
3. Le rattachement au constat `fd_204` est écrit dans la même ligne.
4. Chaque trimestre, une tâche relit un échantillon d'objets, recalcule l'empreinte, et signale les écarts.
5. L'auditeur demande la preuve : la plateforme présente l'empreinte enregistrée en mars, et celle recalculée aujourd'hui, identiques.

**Résultat.** L'intégrité est démontrable, les fichiers sont isolés par tenant, et la clé ne révèle rien.

**Limites.** L'empreinte enregistrée n'a de valeur que si la base qui la contient est elle-même protégée et tracée : un administrateur qui peut modifier à la fois le fichier et la ligne doit être détecté par le journal d'audit (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qui distingue un objet stocké d'un fichier dans un système de fichiers ?
2. **Compréhension.** Où vivent les droits et les métadonnées métier d'un fichier ?
3. **Compréhension.** Que prouve une empreinte SHA-256, et que ne prouve-t-elle pas ?
4. **Pourquoi.** Pourquoi la déduplication entre tenants est-elle dangereuse ?
5. **Raisonnement pratique.** Une clé d'objet contient `…/alpha-air/constat-fd_204/rapport.pdf`. Quels problèmes cela pose-t-il, et comment corriger ?

#### Réponses

1. Un objet est une suite d'octets immuable sous une clé dans un espace plat, accessible par une interface réseau. Il n'a pas de modification partielle, pas de verrou de fichier, et ses répertoires ne sont que des préfixes de clé.
2. Dans la base, sur la ligne de référence du fichier, qui porte le rattachement au sujet, le statut, l'auteur, l'empreinte. Le stockage ne garde que les octets et des métadonnées techniques.
3. Qu'un contenu n'a pas changé depuis le calcul de l'empreinte, à condition de se fier à la valeur de référence. Elle ne dit ni qui a produit le fichier, ni qui l'a modifié, ni si le fichier est sain.
4. Parce que la réponse « ce fichier existe déjà » ou un téléversement instantané révèle qu'un autre tenant détient ce contenu exact. C'est un canal d'information entre tenants : on déduplique par tenant seulement.
5. La clé contient un nom de client, un numéro de constat et le nom d'origine : elle fuit dans les journaux et les liens, risque des collisions et des injections de chemin, et lie le fichier à un contexte qui peut changer. On génère un identifiant opaque côté serveur, avec un préfixe de tenant, et l'on garde le sens dans la base.

## 18.2 Versionnement de fichiers, quotas et niveaux de stockage

### 1. Comprendre simplement

Le **versionnement de fichiers** (*file versioning*) conserve les états successifs d'un fichier : remplacer un fichier crée une nouvelle **version** au lieu d'effacer l'ancienne. Le **quota de stockage** (*storage quota*) plafonne l'espace qu'un tenant, un utilisateur ou un sujet peut occuper. Les **niveaux de stockage** (*storage tiering*) répartissent les objets entre des classes de stockage dont le coût de garde, la vitesse d'accès et les frais de relecture diffèrent.

**Pourquoi cela existe.** Trois besoins se rejoignent. Un fichier remplacé sans trace fait disparaître la preuve de ce qui avait été approuvé. Sans plafond, un tenant, ou un traitement qui boucle, occupe l'espace de tous. Et garder au prix du stockage rapide des fichiers que personne ne relit gaspille de l'argent.

**Problème résolu.** Conserver l'historique utile, borner la consommation et aligner le coût de conservation sur l'usage réel.

**Modèle mental.** Un classeur de bureau. Chaque révision d'une procédure est agrafée derrière la précédente : ce sont les versions. Le classeur compte un nombre fini de tiroirs : c'est le quota. Les dossiers anciens partent à la cave, moins chère mais plus lente d'accès : ce sont les niveaux.

**Où l'analogie s'arrête.** Dans un bureau, descendre à la cave prend cinq minutes et ne coûte rien. Dans un stockage d'archive, la restauration peut prendre de longues minutes ou des heures, et elle se facture. Les versions ne sont pas gratuites non plus : chacune occupe de l'espace et compte dans le quota, sauf règle contraire.

**Exemple.** Le manuel de procédure MP-71 d'Alpha Air existe en versions 1, 2 et 3. L'approbation de Sophie, responsable qualité, référence la version 2 par son numéro et son empreinte : l'arrivée de la version 3 ne change pas ce qui a été approuvé. Le tenant dispose d'un quota de 500 Gio. Les versions non courantes de plus de 90 jours passent en niveau tiède.

**Les composants.**

1. le **fichier logique**, qui porte l'identité, le sujet et les droits ;
2. les **versions**, immuables et numérotées, chacune liée à un objet et à son empreinte ;
3. la **version courante**, désignée par un pointeur ;
4. les **références épinglées**, par lesquelles une approbation ou une signature désigne une version précise ;
5. la **politique de rétention des versions** : combien, et combien de temps ;
6. le **quota** et son **compteur d'usage** (réservé, utilisé), réconciliés périodiquement ;
7. les **niveaux** et les **règles de transition** entre eux.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi l'on conserve des versions, comment un quota se réserve puis se réconcilie, et quel compromis impose un niveau de stockage plus économique.

### 2. Connaissances essentielles

#### Définition

- **Versionnement de fichiers** : conservation, pour un même fichier logique, de ses états successifs, chacun identifié, immuable et lié à son empreinte.
- **Quota de stockage** : limite d'espace, ou de nombre de fichiers, qu'une entité (tenant, utilisateur, sujet) peut occuper, appliquée par la plateforme avant d'accepter une écriture.
- **Niveaux de stockage** : répartition des objets entre des classes de stockage de coût, de latence d'accès et de conditions de conservation différents, avec des règles de passage de l'une à l'autre.

#### Idées fondamentales

1. **Un fichier logique, plusieurs versions immuables.** L'identité du fichier n'est pas celle de la version.
2. **Ce qui engage se rattache à une version précise.** Une approbation, une signature ou une citation désigne « la version 2 », jamais « le dernier ».
3. **Les versions coûtent.** Chacune occupe de l'espace et compte dans le quota ; une règle de rétention les gouverne.
4. **Un quota est une règle de plateforme.** Il se réserve avant l'écriture et se réconcilie après.
5. **Un niveau moins cher se paie ailleurs.** Un coût de garde plus bas signifie plus de latence, des frais de relecture ou une durée minimale.
6. **Les niveaux se pilotent par des règles.** L'âge, le dernier accès ou le statut du dossier décident, pas une intervention manuelle.
7. **Un quota atteint est un état de produit.** Il se présente avec un message clair et une issue, pas comme une panne (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).

#### Vocabulaire essentiel

- **Version** (*version*) : état immuable d'un fichier à un instant, avec son numéro, son objet, son empreinte, son auteur, sa date.
- **Version courante** (*current version*) : celle que l'on obtient par défaut.
- **Épinglage** (*pinning*) : rattachement d'une référence à une version précise.
- **Quota dur et quota souple** (*hard quota*, *soft quota*) : le premier refuse l'écriture au plafond, le second avertit.
- **Réservation** (*reservation*) : espace décompté à l'avance, avant l'arrivée des octets.
- **Classe de stockage** (*storage class*) : niveau de service d'un service de stockage, avec ses coûts et ses conditions.
- **Règle de cycle de vie** (*lifecycle rule*) : règle qui déplace ou supprime des objets selon leur âge ou leur état.
- **Durée minimale de conservation** (*minimum storage duration*) : durée facturée au minimum, même si l'objet est supprimé plus tôt, sur certaines classes.
- **Restauration** (*restore*) : opération qui rend à nouveau lisible un objet archivé.

#### Relations de cause à effet

- On remplace le fichier sur place : la preuve de ce qui avait été approuvé disparaît.
- On garde toutes les versions sans règle : l'espace croît comme le produit du nombre de fichiers, du nombre de versions et de leur taille, et le quota est atteint par des versions que personne ne relit.
- Le quota ne compte que la version courante : le tenant consomme bien plus que ce qu'il voit, et le coût réel dérive.
- Le compteur d'usage n'est mis à jour qu'après l'écriture : des envois simultanés dépassent le plafond.
- Un fichier lu chaque jour passe en niveau froid : les frais de relecture et la latence annulent l'économie.

#### Idées reçues

- **« Le versionnement tient lieu de sauvegarde. »** Non. Les versions vivent dans le même système, sous les mêmes droits : la suppression de toutes les versions ou un compte compromis les emporte. La sauvegarde est séparée (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).
- **« Un quota protège la plateforme contre la surcharge. »** Non. Il borne l'espace, pas le débit ni la concurrence (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) et [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)).
- **« Un niveau d'archive est un niveau chaud moins cher. »** Non. L'accès y est différé et facturé, et certaines classes imposent une durée minimale.

#### Principe clé

Un fichier est une suite de versions immuables, ce qui engage pointe une version précise, et l'espace comme le coût de ces versions se bornent par des règles : rétention, quotas, niveaux.

#### Si vous ne retenez que trois choses

1. Un fichier logique a plusieurs versions immuables, et tout ce qui engage pointe une version précise.
2. Un quota se réserve avant l'écriture et se réconcilie après, sinon les envois simultanés le dépassent.
3. Un niveau plus économique se paie en latence, en frais de relecture ou en durée minimale.

### 3. Explication technique détaillée

#### Fichier logique et versions

Le modèle de [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) décrit un objet. Pour versionner, on sépare l'identité du fichier de ses versions.

```text
file_asset (fichier logique)    1 ──── n    file_version    n ──── 1    stored_file (objet)
  id, sujet, nom, courante                    numéro, auteur, date         clé, empreinte, taille
```

```sql
CREATE TABLE file_asset (
  tenant_id           uuid    NOT NULL,
  id                  uuid    NOT NULL,
  subject_type        text    NOT NULL,
  subject_id          text    NOT NULL,
  display_name        text    NOT NULL,
  current_version_no  integer NOT NULL CHECK (current_version_no >= 1),
  PRIMARY KEY (tenant_id, id)
);

CREATE TABLE file_version (
  tenant_id    uuid        NOT NULL,
  file_id      uuid        NOT NULL,
  version_no   integer     NOT NULL CHECK (version_no >= 1),
  object_id    uuid        NOT NULL,
  change_note  text,
  created_by   uuid        NOT NULL,
  created_at   timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, file_id, version_no),
  FOREIGN KEY (tenant_id, file_id)   REFERENCES file_asset (tenant_id, id),
  FOREIGN KEY (tenant_id, object_id) REFERENCES stored_file (tenant_id, id)
);
```

**Comment la lire.** Le sujet et les droits se lisent sur le fichier logique (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) : toutes les versions les partagent. Une version ne se modifie pas. Un nouveau téléversement crée un objet neuf (voir [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable)), une ligne `file_version`, et déplace le pointeur `current_version_no`, dans une même transaction (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)).

**Concurrence.** Deux personnes enregistrent « à partir de la version 2 ». Si la plateforme accepte les deux sans contrôle, la seconde écrase la première sans le savoir. Le client indique donc la version dont il part ; si elle n'est plus la version courante, la plateforme refuse ou signale un conflit (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

**Version de fichier ou révision d'entité.** Le versionnement d'une entité structurée ([9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) conserve des valeurs de champs et sait calculer des différences ([9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence)). Le versionnement d'un fichier conserve des objets entiers, opaques pour la plateforme. Les deux se combinent : la révision d'un constat référence la version d'une photo.

**Versionnement du conteneur.** Certains services de stockage proposent un versionnement au niveau du conteneur : chaque écrasement conserve l'ancien objet. Il protège d'une erreur de manipulation, mais il ignore le sens métier : qui a approuvé quoi, quelle version est courante. On le traite comme un filet de sécurité, pas comme le modèle de version du produit.

#### Référence épinglée

Une approbation ou une signature mémorise la version et l'empreinte, pas seulement le fichier.

```json
{
  "approval_id": "ap_771",
  "subject": { "type": "document", "id": "doc_mp71" },
  "file": {
    "file_id": "f_mp71",
    "version_no": 2,
    "sha256": "d421b191100bf6b9cd344dcc0c59cc529e87ef57c6ae59d2cbac24fa441f5d0d"
  },
  "approved_by": "usr_sophie",
  "approved_at": "2026-09-12T09:30:00Z"
}
```

*Les identifiants sont des valeurs d'exemple. L'empreinte est celle de la chaîne `MP-71 v2`, calculée à titre d'illustration.*

Deux conséquences. D'abord, la version épinglée **ne se purge pas** : toute règle de suppression de versions contrôle d'abord les références entrantes (approbations, signatures de [18.9 Signature électronique](#189-signature-électronique), gels légaux de [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers), liens de partage de [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)). Ensuite, on peut redémontrer plus tard que la version présentée est celle qui a été approuvée, en recalculant son empreinte.

#### Politique de rétention des versions

| Politique | Principe | Cas d'usage |
|---|---|---|
| Toutes les versions | Rien n'est supprimé automatiquement | Documents réglementés |
| N dernières versions | Les plus anciennes disparaissent au-delà de N | Fichiers de travail |
| Durée | Les versions plus anciennes que D disparaissent | Compromis entre coût et historique |
| Exceptions épinglées | Une version référencée ou sous gel n'est jamais supprimée | Toujours |

Les versions rapprochées d'un même épisode d'édition se **regroupent** : une version par session d'édition ou par enregistrement explicite, plutôt qu'une par sauvegarde automatique.

**Coût des versions.** Si le tenant a $n$ fichiers, $v$ versions en moyenne et une taille moyenne $s$, l'espace occupé est :

$$S = n \times v \times s$$

Avec $n = 2\,000$, $v = 4$ et $s = 3$ Mio, on obtient $S = 24\,000$ Mio, soit environ 23,4 Gio. L'utilisateur croit occuper $2\,000 \times 3 = 6\,000$ Mio, environ 5,9 Gio. Le facteur d'écart est $v$.

#### Quotas

| Portée | Exemple | Pourquoi |
|---|---|---|
| Tenant | 500 Gio pour Alpha Air | Limite contractuelle (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) et [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) |
| Utilisateur | 5 Gio dans un espace personnel | Éviter qu'un compte consomme tout |
| Sujet | 50 pièces jointes par constat | Protéger la qualité de la donnée |
| Fichier | 200 Mio par fichier | Limiter le coût de traitement (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)) |

Un **quota souple** avertit, par exemple à 80 %. Un **quota dur** refuse. Le choix et les seuils sont des décisions de produit, souvent liées à l'offre commerciale (voir le [module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation)).

**Réserver, puis réconcilier.** Lire le compteur, puis écrire, laisse un intervalle pendant lequel deux envois passent ensemble. La plateforme réserve donc l'espace au début du téléversement, par une seule instruction atomique : la ligne du compteur est verrouillée le temps du test et de la mise à jour.

```sql
CREATE TABLE tenant_storage_usage (
  tenant_id       uuid        PRIMARY KEY,
  quota_bytes     bigint      NOT NULL CHECK (quota_bytes >= 0),
  used_bytes      bigint      NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
  reserved_bytes  bigint      NOT NULL DEFAULT 0 CHECK (reserved_bytes >= 0),
  updated_at      timestamptz NOT NULL
);

UPDATE tenant_storage_usage
   SET reserved_bytes = reserved_bytes + $2,
       updated_at     = now()
 WHERE tenant_id = $1
   AND used_bytes + reserved_bytes + $2 <= quota_bytes;
```

Si l'instruction ne modifie aucune ligne, le quota est dépassé : la plateforme refuse avant d'avoir reçu le moindre octet. À la fin du téléversement, la réservation devient de l'usage : `reserved_bytes` diminue, `used_bytes` augmente de la taille réelle. Si le téléversement est abandonné, la réservation expire.

**Dérive.** Les compteurs divergent de la réalité : envois abandonnés, échecs, suppressions, corrections. Une tâche de fond ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)) recalcule la somme réelle à partir des lignes de fichiers et corrige le compteur. Un compteur jamais réconcilié bloque un tenant sur des réservations fantômes, ou le laisse dépasser.

**Ce qui compte.** Les versions comptent. Les fichiers en quarantaine ([18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)) comptent. Les fichiers supprimés comptent jusqu'à leur purge. Les aperçus et les miniatures ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) relèvent d'une décision de produit : on l'annonce clairement.

> **Quota et limitation de débit.** Un quota borne un stock, des octets. Une limitation de débit borne un flux, des requêtes par seconde. Un tenant sous son quota peut encore saturer le service (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).

#### Niveaux de stockage

| Niveau | Accès | Coût de garde | Contrepartie | Usage typique |
|---|---|---|---|---|
| Chaud | Immédiat | Le plus élevé | Aucune | Fichiers actifs |
| Tiède | Immédiat | Moyen | Frais par relecture | Fichiers rarement lus |
| Froid | Immédiat ou en minutes | Faible | Frais de relecture, durée minimale | Dossiers clos |
| Archive | Restauration préalable, de minutes à heures | Le plus faible | Restauration lente et facturée, durée minimale | Conservation réglementaire |

*Ce tableau est qualitatif.* Les fournisseurs nomment ces classes différemment et fixent leurs propres délais, prix et durées minimales : ils se lisent dans la documentation du service retenu.

**Règles de transition.** La plateforme les exprime comme des règles, évaluées automatiquement.

| Règle | Condition | Action |
|---|---|---|
| R1 | Version courante d'un dossier ouvert | Rester en chaud |
| R2 | Version non courante depuis plus de 90 jours | Passer en tiède |
| R3 | Dossier de maintenance clos depuis plus de 12 mois | Passer en froid |
| R4 | Dossier clos depuis plus de 5 ans et soumis à conservation | Passer en archive |

*Ces durées sont des valeurs d'exemple ; elles ne reflètent aucune exigence réglementaire.*

**Seuil de rentabilité.** Passer un fichier en niveau froid est rentable si le coût de garde économisé dépasse les frais de relecture attendus. Pour 1 Gio et par mois :

$$k < \frac{C_{\text{chaud}} - C_{\text{froid}}}{r}$$

Ici, $C_{\text{chaud}}$ et $C_{\text{froid}}$ sont les coûts de garde mensuels dans chaque niveau, $r$ est le coût d'une relecture complète, et $k$ est le nombre de relectures par mois. Avec des unités arbitraires $C_{\text{chaud}} = 1{,}0$, $C_{\text{froid}} = 0{,}2$ et $r = 0{,}4$, on obtient $k < 2$. À trois relectures par mois, le niveau froid coûte $0{,}2 + 3 \times 0{,}4 = 1{,}4$, soit plus que le niveau chaud.

**Effets visibles pour l'utilisateur.** Un fichier archivé ne se télécharge pas tout de suite : l'interface affiche « restauration en cours », prévient à la fin (voir [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires)) et limite les restaurations en masse. Les aperçus et la recherche en texte intégral lisent le fichier : on les conçoit pour qu'ils ne réveillent pas l'archive.

**Interactions.** Avec les versions : les anciennes descendent d'abord, la courante reste chaude. Avec la rétention : la durée minimale d'un niveau et la durée de conservation légale se composent (voir [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers) et [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)). Avec les coûts : l'attribution du coût de stockage à chaque tenant relève de [22.10 Modèle de coûts, attribution et coût de service](22-performance-echelle-economie.md#2210-modèle-de-coûts-attribution-et-coût-de-service).

#### Modes de défaillance

- **Purge d'une version référencée** : une approbation ne pointe plus vers rien.
- **Compteur dérivé** : réservations fantômes, tenant bloqué à tort.
- **Quota contourné** : appliqué dans l'interface, absent de l'API ou de l'import (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)).
- **Tempête de restauration** : 500 fichiers archivés demandés d'un coup, avec délais et facture.
- **Explosion des versions** : sauvegarde automatique d'un gros fichier à chaque modification.

**Contre-exemple.** Une application de dessin versionne chaque sauvegarde automatique d'un plan de 200 Mio, 40 fois par jour. Cela représente 8 000 Mio par jour, environ 7,8 Gio, soit près de 55 Gio par semaine pour un seul fichier. Le quota est atteint en quelques semaines et l'historique n'a plus de sens. Il fallait regrouper les sauvegardes par session et borner la rétention.

**Limites.** Les noms, délais, prix et durées minimales des niveaux dépendent du fournisseur. Le versionnement ne remplace pas la sauvegarde. Le décompte d'un fournisseur (granularité, taille minimale facturée) peut différer du décompte de la plateforme : le quota métier et la facture d'infrastructure sont deux mesures distinctes.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | Chaque version pointe vers un objet décrit par `stored_file` |
| [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable) | La réservation de quota a lieu au début du téléversement |
| [18.9 Signature électronique](#189-signature-électronique) | Une signature se rattache à une version et à son empreinte |
| [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers) | Un gel légal ou une durée de conservation bloque la purge d'une version |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Révision d'entité (valeurs) en regard de version de fichier (octets) |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Cadre général des quotas et de la consommation |
| [22.10 Modèle de coûts, attribution et coût de service](22-performance-echelle-economie.md#2210-modèle-de-coûts-attribution-et-coût-de-service) | Coût de stockage attribué à chaque tenant |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | Archiver et restaurer au niveau de la ressource, avant le niveau de stockage |

### 5. Application pratique

**Situation initiale.** Les manuels de procédure d'Alpha Air sont remplacés sur place. Lors d'un audit, la direction technique demande quelle version du MP-71 était en vigueur le 12 septembre et qui l'a approuvée. En parallèle, le coût du stockage augmente d'un mois à l'autre.

**Problème.** Aucune version, aucune référence épinglée, aucune règle de rétention ni de niveau.

**Application du concept.** La plateforme introduit le fichier logique, les versions, les références épinglées, un quota par tenant et des règles de transition.

**Déroulé.**

1. Nadia téléverse le MP-71 corrigé : la plateforme crée une version 3 et déplace le pointeur courant.
2. L'approbation de Sophie du 12 septembre référence `version_no = 2` et son empreinte.
3. Le quota du tenant est de 500 Gio ; chaque téléversement réserve sa taille avant l'envoi.
4. Chaque nuit, la règle R2 fait passer en tiède les versions non courantes de plus de 90 jours ; la version 2, épinglée, reste protégée de la purge.
5. Lors de l'audit, la plateforme présente la version 2, recalcule son empreinte et la compare à celle de l'approbation.

**Résultat.** L'historique est redémontrable, la consommation est bornée, et les versions anciennes coûtent moins cher.

**Limites.** Les frais de relecture et le délai de restauration pèsent sur l'auditeur qui rouvre une version archivée. La politique de rétention doit rester cohérente avec les durées de conservation applicables (voir [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi une approbation doit-elle pointer une version précise et non « le dernier fichier » ?
2. **Compréhension.** Qu'est-ce qui distingue le versionnement d'un fichier de la révision d'une entité ?
3. **Compréhension.** Qu'est-ce que la réservation de quota, et que prévient-elle ?
4. **Pourquoi.** Pourquoi un niveau d'archive peut-il coûter plus cher qu'un niveau chaud pour certains fichiers ?
5. **Raisonnement pratique.** Un tenant a 1 500 fichiers, 6 versions en moyenne et 4 Mio par version. Quel espace occupe-t-il, et que croit-il occuper ?

#### Réponses

1. Parce que « le dernier » change à chaque nouvelle version : l'approbation ne désignerait plus ce qui a été approuvé. Épingler la version et l'empreinte rend l'approbation démontrable.
2. La révision d'une entité conserve des valeurs de champs, que la plateforme sait comparer. Le versionnement d'un fichier conserve des objets entiers et opaques, identifiés par une empreinte.
3. C'est un décompte d'espace réalisé avant l'arrivée des octets, par une instruction atomique. Il empêche que des envois simultanés dépassent le plafond entre la lecture du compteur et l'écriture.
4. Parce que la relecture y est facturée et lente, et qu'une durée minimale peut s'appliquer. Un fichier relu souvent paie plus de frais de relecture que ce que le niveau économise sur la garde.
5. $S = 1\,500 \times 6 \times 4 = 36\,000$ Mio, soit environ 35,2 Gio. Il croit occuper $1\,500 \times 4 = 6\,000$ Mio, environ 5,9 Gio, car il ne voit que les versions courantes.

## 18.3 Téléversement direct et téléversement fractionné reprenable

### 1. Comprendre simplement

Le **téléversement direct** (*direct upload with signed URL*) consiste à envoyer le fichier directement au service de stockage, sans le faire passer par l'application. La plateforme délivre pour cela au client une **URL signée** : une adresse dont la signature porte une autorisation limitée à une opération, à une clé et à une durée. Le **téléversement fractionné reprenable** (*multipart and resumable upload*) découpe un gros fichier en **parties** envoyées séparément et assemblées à la fin. Une coupure ne force alors à renvoyer que les parties manquantes.

**Pourquoi cela existe.** Si chaque octet traverse l'application, celle-ci porte la bande passante, la mémoire et des connexions longues, et devient le goulot de toute la plateforme. Sur le terrain, la connexion est en outre instable : un envoi de plusieurs gigaoctets qui échoue à 95 % ne doit pas repartir de zéro.

**Problème résolu.** Envoyer de gros fichiers de façon rapide, économique et reprenable, sans donner au client d'identifiants permanents sur le stockage et sans contourner les droits de la plateforme.

**Modèle mental.** Un guichet qui délivre un bon de dépôt. Le client présente le bon directement à l'entrepôt, qui l'accepte sans repasser par le guichet. Pour un colis très volumineux, on le découpe en cartons numérotés et l'on note ceux qui sont déjà livrés.

**Où l'analogie s'arrête.** Un bon de dépôt papier est nominatif. Une URL signée est un **titre au porteur** : quiconque la possède peut s'en servir jusqu'à son expiration. Et l'entrepôt ne contrôle que la signature, pas le contenu : c'est la plateforme qui vérifie le fichier ensuite (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).

**Exemple.** Karim filme, sur le tarmac, une vidéo de 1,2 Gio du train d'atterrissage de F-ABCD. La tablette demande à la plateforme l'autorisation d'envoyer et reçoit un plan en 20 parties de 64 Mio, avec une URL signée par partie. La connexion tombe après la partie 13. À la reconnexion, la tablette demande quelles parties sont reçues, puis envoie seulement les parties 14 à 20 : 448 Mio au lieu de 1 229 Mio.

**Les composants.**

1. l'**initialisation**, qui contrôle les droits, réserve le quota et crée la ligne en attente ;
2. l'**URL signée**, ou une par partie, à durée limitée ;
3. les **parties**, numérotées, chacune avec sa taille et son empreinte ;
4. l'**identifiant d'envoi**, qui désigne l'envoi en cours et permet de le reprendre ;
5. la **finalisation**, qui assemble, vérifie et fait exister le fichier ;
6. le **nettoyage** des envois abandonnés et la libération des réservations.

**Objectif d'apprentissage :** vous pouvez décrire le déroulement d'un téléversement direct, expliquer ce qu'une URL signée autorise et ce qu'elle n'établit pas, et dire comment un envoi fractionné reprend après une coupure.

### 2. Connaissances essentielles

#### Définition

- **Téléversement direct avec URL signée** : mécanisme dans lequel le client envoie le fichier directement au service de stockage, au moyen d'une URL délivrée par la plateforme, dont la signature porte une autorisation limitée dans sa portée et dans le temps.
- **Téléversement fractionné reprenable** : envoi d'un fichier en plusieurs parties indépendantes, assemblées à la finalisation, avec la possibilité de connaître les parties reçues et de reprendre l'envoi après une interruption.

#### Idées fondamentales

1. **Les octets ne traversent pas l'application ; l'autorisation, si.** L'application décide, le stockage reçoit (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)).
2. **Une URL signée est un titre au porteur.** On la veut brève, étroite (une clé, une méthode) et jamais journalisée.
3. **Le serveur ne croit pas ce que le client déclare.** Taille, type et empreinte se revérifient à la finalisation.
4. **Un gros fichier se découpe.** Chaque partie se renvoie seule, et l'état d'avancement se demande.
5. **La finalisation est un moment explicite et idempotent.** Tant qu'elle n'a pas eu lieu, le fichier n'existe pas pour les utilisateurs (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
6. **Un envoi abandonné laisse des restes.** Il faut les nettoyer et libérer les réservations.
7. **Une clé neuve par envoi.** On ne signe pas d'écriture sur la clé d'un objet existant.

#### Vocabulaire essentiel

- **URL signée ou préalablement signée** (*signed URL*, *presigned URL*) : adresse dont la signature autorise une opération précise, pour une durée limitée.
- **Titre au porteur** (*bearer token*) : justificatif qui donne accès à quiconque le présente.
- **Partie** (*part*) : fragment contigu du fichier, numéroté, envoyé seul.
- **Identifiant d'envoi** (*upload id*) : référence de l'envoi fractionné en cours.
- **Finalisation** (*completion*) : étape qui assemble les parties et fait exister l'objet.
- **Décalage** (*offset*) : position, en octets, à laquelle un envoi reprenable doit reprendre.
- **Protocole tus** (*tus protocol*) : protocole ouvert de reprise d'envoi au-dessus de HTTP.
- **Partage entre origines** (*CORS*) : réglage qui autorise un navigateur à envoyer des requêtes vers un autre domaine, ici celui du stockage.

#### Relations de cause à effet

- Les octets passent par l'application : bande passante, mémoire et délais d'attente deviennent des limites de la plateforme.
- L'URL signée vit longtemps et se retrouve dans un journal ou un courriel : quiconque la lit peut s'en servir jusqu'à expiration.
- Le client annonce 2 Mio et envoie 4 Gio, sans revérification : le quota et les contrôles sont contournés.
- Les envois abandonnés ne sont pas nettoyés : des parties orphelines occupent de l'espace facturé, invisible dans les listes de fichiers.
- La finalisation n'est pas idempotente : le client réessaie après un délai d'attente et deux fichiers sont créés.

#### Idées reçues

- **« Une URL signée est une URL secrète, donc sûre. »** Non. Elle vaut pour quiconque la détient. La sécurité vient de sa portée étroite et de sa brièveté.
- **« Reprenable signifie que le serveur garde la connexion ouverte. »** Non. La connexion tombe réellement : c'est l'état de l'envoi, conservé à part, qui permet de reprendre par une nouvelle requête.
- **« Si le transfert réussit, le fichier est bon. »** Non. Un transfert réussi ne dit rien de la validité ni de l'innocuité du contenu (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).

#### Principe clé

La plateforme décide et le stockage reçoit : l'autorisation passe par l'application, les octets vont directement au stockage, et rien n'est tenu pour valide avant la finalisation et le contrôle.

#### Si vous ne retenez que trois choses

1. Une URL signée délègue au client une écriture limitée en portée et en durée, comme un titre au porteur.
2. Un gros fichier s'envoie en parties numérotées dont on peut demander l'état, pour reprendre après une coupure.
3. Le fichier n'existe qu'après une finalisation qui revérifie taille, empreinte et quota, et qui est idempotente.

### 3. Explication technique détaillée

#### Pourquoi éviter de faire passer les octets par l'application

L'application relève du plan de contrôle ; les octets relèvent du plan de données (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)). Le téléversement direct applique cette séparation.

| Critère | Passage par l'application | Téléversement direct |
|---|---|---|
| Bande passante et mémoire | Portées par les serveurs d'application | Portées par le service de stockage |
| Connexions longues | Oui, sur l'application | Non, sur le stockage |
| Contrôle du contenu en cours de route | Possible | Impossible : le contrôle a lieu après (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)) |
| Pièces mobiles | Peu | URL signées, partage entre origines, finalisation |
| Taille de fichier adaptée | Quelques Mio | De quelques Mio à plusieurs Gio |

Le passage par l'application reste raisonnable pour de petits fichiers, à condition de les traiter en flux, sans les charger en mémoire.

#### Déroulement d'un téléversement direct

```text
     Client                             Plateforme (API)                        Stockage d'objets
        │                                       │                                       │
        │   1. demande d'envoi (nom, taille)    │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │ contrôle des droits                   │
        │                                       │ réserve l'espace de quota             │
        │                                       │ ligne créée, statut pending           │
        │   2. plan d'envoi : clé, URL signée   │                                       │
        ◄───────────────────────────────────────┤                                       │
        │                                       │                                       │
        │                       3. octets envoyés à l'URL signée                        │
        ├───────────────────────────────────────────────────────────────────────────────►
        │                              accusé de réception                              │
        ◄───────────────────────────────────────────────────────────────────────────────┤
        │                                       │                                       │
        │  4. finalisation (taille, empreinte)  │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │ vérifie taille et empreinte           │
        │                                       │ statut : uploaded                     │
        │         5. statut du fichier          │                                       │
        ◄───────────────────────────────────────┤                                       │
```

**Le plan d'envoi.** La plateforme répond à la demande par un plan, qu'elle construit après avoir contrôlé les droits sur le sujet (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

```json
{
  "upload_id": "up_01J0B7",
  "file_id": "f_01J0A4",
  "method": "PUT",
  "url": "https://storage.example.com/plateforme-fichiers/tenants/ten_airline_01/files/f_01J0A4?expires=1791973500&signature=3f9c0a7e",
  "expires_at": "2026-10-14T10:25:00Z",
  "required_headers": {
    "Content-Type": "image/jpeg"
  },
  "max_size_bytes": 10485760,
  "finalize_url": "/v1/files/f_01J0A4/finalize"
}
```

*L'adresse est fictive et la signature est abrégée.*

**Ce que signe l'URL.** Une signature lie ensemble la méthode, la clé et l'expiration, avec un secret que seule la plateforme détient. Le code suivant illustre le principe ; les services de stockage utilisent leur propre schéma, que leurs bibliothèques calculent.

```typescript
import { createHmac, timingSafeEqual } from "node:crypto";

interface SignedUrlClaims {
  method: "PUT" | "GET";
  key: string;
  expiresAt: number; // secondes depuis le 1er janvier 1970 (UTC)
}

function sign(claims: SignedUrlClaims, secret: Buffer): string {
  const payload = `${claims.method}\n${claims.key}\n${claims.expiresAt}`;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function verify(
  claims: SignedUrlClaims,
  signature: string,
  secret: Buffer,
  now: number,
): boolean {
  if (now > claims.expiresAt) return false;
  const expected = Buffer.from(sign(claims, secret), "hex");
  const given = Buffer.from(signature, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
```

Changer la clé, la méthode ou l'expiration invalide la signature. Mais rien ici ne lie le **contenu** : la signature autorise l'écriture d'une clé, pas d'un fichier précis. Certains services permettent de signer aussi un en-tête d'empreinte, ce qui lie le contenu à l'envoi : la documentation d'un grand service d'objets indique qu'une URL signée selon sa version 4 accepte plusieurs algorithmes de somme de contrôle, dont SHA-256.

#### Durée de vie et portée d'une URL signée

La documentation d'un grand service d'objets précise plusieurs points qu'il vaut mieux connaître avant de concevoir son propre mécanisme :

- ces URL sont des **titres au porteur** : elles donnent accès à quiconque les possède ;
- une URL peut servir **plusieurs fois**, jusqu'à son expiration ;
- l'expiration est vérifiée **au moment de la requête** : un transfert commencé juste avant l'expiration se poursuit, mais une reprise après l'expiration échoue ;
- si un objet de même clé existe déjà, l'écriture le **remplace** ;
- la durée effective est bornée par celle des identifiants utilisés pour signer.

| Paramètre | Recommandation | Raison |
|---|---|---|
| Durée de validité | Quelques minutes, adaptée à la taille ; une URL par partie pour les gros fichiers | Réduit la fenêtre d'abus |
| Portée | Une clé, une méthode, éventuellement un type de contenu | Limite ce que le porteur peut faire |
| Clé | Neuve, générée par la plateforme | Évite d'écraser un objet existant |
| Journalisation | Ne jamais enregistrer l'URL complète | L'URL tient lieu de secret |
| Usage unique | Obtenu par la clé neuve et une seule finalisation, pas par l'URL | La signature seule n'interdit pas la réutilisation |
| Navigateur | Configurer le partage entre origines | Sinon le navigateur bloque l'envoi |

Certains services offrent aussi une **écriture conditionnelle** : l'écriture échoue si un objet de même clé existe déjà. C'est un second filet contre l'écrasement, qui ne remplace pas la clé neuve.

#### Le téléversement fractionné

Un envoi fractionné se déroule en trois temps : initialiser, envoyer les parties, finaliser.

```text
     Client                             Plateforme (API)                        Stockage d'objets
        │                                       │                                       │
        │     1. demande d'envoi fractionné     │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │        crée l'envoi fractionné        │
        │                                       ├───────────────────────────────────────►
        │                                       │          identifiant d'envoi          │
        │                                       ◄───────────────────────────────────────┤
        │  2. plan : N parties, N URL signées   │                                       │
        ◄───────────────────────────────────────┤                                       │
        │                                       │                                       │
        │                       3. parties 1, 2, 3 … en parallèle                       │
        ├───────────────────────────────────────────────────────────────────────────────►
        │ coupure réseau                        │                                       │
        │                                       │                                       │
        │   4. quelles parties sont reçues ?    │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │           liste des parties           │
        │                                       ├───────────────────────────────────────►
        │                                       │    parties 1 à 3, avec empreintes     │
        │                                       ◄───────────────────────────────────────┤
        │       parties restantes : 4 à N       │                                       │
        ◄───────────────────────────────────────┤                                       │
        │                               5. parties 4 à N                                │
        ├───────────────────────────────────────────────────────────────────────────────►
        │                                       │                                       │
        │            6. finalisation            │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │         assemble les parties          │
        │                                       ├───────────────────────────────────────►
        │                                       │ vérifie taille et empreinte           │
        │         7. statut du fichier          │                                       │
        ◄───────────────────────────────────────┤                                       │
```

**Pourquoi découper.** Une partie qui échoue se renvoie seule. Les parties partent en parallèle et exploitent mieux la bande passante. Un envoi simple a une taille maximale plus basse que celle de l'objet final.

**Limites d'un service donné.** La documentation d'un grand service d'objets indique, à la date de consultation (voir les références du module), les valeurs suivantes :

| Élément | Valeur |
|---|---|
| Taille d'une partie | De 5 Mio à 5 Gio ; aucune taille minimale pour la dernière partie |
| Nombre de parties | De 1 à 10 000 |
| Taille maximale d'un objet | 48,8 Tio |
| Seuil conseillé | Envisager le fractionnement dès 100 Mo |
| Expiration d'un envoi en cours | Aucune : il faut le terminer ou l'abandonner explicitement |

*Ces valeurs sont celles d'un service précis, à une date précise. D'autres services ont d'autres limites.*

**Choisir la taille des parties.** Pour un fichier de taille $S$ et une taille de partie $p$, le nombre de parties est :

$$n = \left\lceil \frac{S}{p} \right\rceil$$

Il faut $n \le 10\,000$ et $p \ge 5$ Mio, sauf pour la dernière partie. Pour $S = 100$ Gio $= 102\,400$ Mio, la taille de partie doit valoir au moins $102\,400 / 10\,000 = 10{,}24$ Mio ; avec $p = 16$ Mio, on obtient $n = 6\,400$ parties. Pour $S = 1\,229$ Mio et $p = 64$ Mio, on obtient $n = 20$.

Des parties petites coûtent plus de requêtes mais se renvoient à bas prix. Des parties grandes coûtent moins de requêtes mais se renvoient chèrement.

**Reprise.** L'état de l'envoi se compose des numéros de parties reçues et de leur empreinte. Après une coupure, le client demande cet état puis envoie les parties manquantes. La documentation du service précédent recommande, pour finaliser, de s'appuyer sur la liste des numéros de parties et des étiquettes tenue par l'appelant, et de n'utiliser la liste renvoyée par le service qu'à titre de vérification.

**Envois abandonnés.** Les parties d'un envoi non terminé restent stockées, et facturées, jusqu'à la finalisation ou l'abandon. Un service peut proposer une règle de cycle de vie qui abandonne les envois incomplets après un délai. La plateforme se dote de sa propre tâche de nettoyage ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)), qui libère aussi les réservations de quota ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).

#### Protocoles ouverts de reprise

| Approche | Unité de reprise | Où vit l'état | Situation |
|---|---|---|---|
| Envoi fractionné d'un service d'objets | Partie numérotée | Service de stockage | Fonction propre au service |
| Protocole tus | Décalage dans une ressource d'envoi | Serveur d'envoi | Protocole ouvert, version 1.0.0 |
| *Resumable Uploads for HTTP* (IETF) | Décalage dans une ressource d'envoi | Serveur | Projet de travail, sans numéro de RFC à la date de consultation |

Le protocole tus définit une requête `HEAD` qui retourne le décalage courant, une requête `PATCH` qui envoie les octets à partir d'un décalage donné, et des extensions : création, expiration, somme de contrôle, terminaison et concaténation. Le projet de l'IETF reprend l'idée d'une ressource d'envoi temporaire dont on lit le décalage puis que l'on complète par `PATCH`. À la date de consultation, c'est un projet de travail (*Internet-Draft*), pas une norme publiée : on ne le cite pas comme un RFC.

#### Finalisation

La finalisation est le moment où le fichier commence à exister pour la plateforme.

1. Vérifier que l'envoi existe, appartient au tenant et n'a pas expiré.
2. Vérifier que l'objet existe, que sa taille correspond, et que son empreinte correspond à celle déclarée, ou la recalculer.
3. Transformer la réservation de quota en usage ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).
4. Passer le statut à `uploaded` et déclencher le contrôle du fichier ([18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).
5. Publier l'événement correspondant, par la boîte d'envoi transactionnelle (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité) et [7.1 Événement, déclencheur et action](07-evenements-automatisation.md#71-événement-déclencheur-et-action)).

Elle doit être idempotente : un client qui réessaie après un délai d'attente obtient le même résultat, pas un second fichier (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) et [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

```sql
UPDATE stored_file
   SET status     = 'uploaded',
       size_bytes = $3,
       sha256     = $4
 WHERE tenant_id = $1
   AND id        = $2
   AND status    = 'pending';
```

Si l'instruction modifie une ligne, la finalisation a lieu. Si elle n'en modifie aucune, soit le fichier est déjà finalisé et l'on renvoie le même résultat, soit il n'existe pas et l'on renvoie une erreur claire.

#### Sécurité

- **Autorisation à l'initialisation.** L'utilisateur a le droit d'ajouter un fichier à ce sujet, selon les mêmes règles que pour toute ressource ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Type déclaré indicatif.** Il ne sert qu'à l'affichage ; le contrôle réel a lieu ensuite ([18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).
- **Plafonds multiples.** Taille maximale dans le plan, dans la signature quand le service le permet, et revérifiée à la finalisation.
- **Limitation des initialisations.** Chaque initialisation réserve du quota : on limite le nombre d'envois ouverts par utilisateur et la durée des réservations ([10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).
- **Aucun fichier visible tant que non finalisé.** Une ligne `pending` ne figure dans aucune liste.
- **Isolation.** Les clés restent sous le préfixe du tenant ; pour une isolation plus stricte, on signe avec des identifiants limités à ce préfixe ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).

#### Modes de défaillance

- **URL divulguée** dans un journal, un courriel ou un ticket.
- **Écrasement par clé réutilisée** : l'écriture remplace l'objet existant sans avertissement.
- **Taille non revérifiée** : le quota est contourné.
- **Finalisation rejouée** : doublons.
- **Parties orphelines** : coûts cachés.
- **URL expirée au milieu d'un gros envoi** : la reprise échoue si l'on n'a qu'une URL pour tout le fichier.
- **Partage entre origines mal réglé** : le navigateur bloque l'envoi, et l'erreur ressemble à une panne réseau.

**Contre-exemple.** Une plateforme signe, pour chaque pièce jointe, une URL d'écriture valable 7 jours sur la clé `tenants/ten_airline_01/constat-fd_204.jpg`. L'URL est copiée dans un ticket de support. Pendant 7 jours, quiconque la lit peut remplacer la photo du constat par un autre fichier, et rien ne le signale avant le prochain contrôle d'empreinte. Il fallait une clé neuve, une durée de quelques minutes et une finalisation unique.

**Limites.** Les valeurs citées sont celles d'un service précis. Les protocoles de reprise demandent un serveur qui les prend en charge. Un envoi direct ne permet pas de contrôler le contenu pendant le transfert. Et les restrictions des systèmes mobiles sur les envois en arrière-plan relèvent du [module 25 du plan des compléments](../PLAN-COMPLEMENTS.md#module-25--expériences-multi-contextes--internationalisation-mobile-hors-ligne-temps-réel).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | Le téléversement crée l'objet, sa clé et son empreinte |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | La réservation de quota a lieu à l'initialisation et se règle à la finalisation |
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | Le contrôle du type, de la taille et du contenu suit la finalisation |
| [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants) | Le téléchargement utilise le même mécanisme d'URL signée, en lecture |
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | Le plan de contrôle décide ; le plan de données transporte les octets |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | La finalisation est idempotente |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les nouvelles tentatives rendent l'idempotence indispensable |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | Les initialisations d'envoi se limitent par utilisateur |

### 5. Application pratique

**Situation initiale.** Alpha Air envoie les vidéos de constat par un formulaire classique. Sur le tarmac, la connexion mobile tombe souvent. Les envois de plus de 500 Mio échouent presque toujours, et les serveurs d'application saturent quand plusieurs techniciens envoient en même temps.

**Problème.** Les octets traversent l'application, et aucun envoi n'est reprenable.

**Application du concept.** La plateforme passe au téléversement direct fractionné avec reprise.

**Déroulé.**

1. Karim ajoute la vidéo de 1,2 Gio au constat `fd_204`. La tablette demande un envoi.
2. La plateforme contrôle le droit d'ajouter une pièce jointe, réserve 1 229 Mio de quota et répond par un plan de 20 parties de 64 Mio.
3. La tablette envoie les parties en parallèle. La connexion tombe après la partie 13.
4. À la reconnexion, la tablette demande l'état de l'envoi, reçoit « parties 1 à 13 reçues », et envoie les parties 14 à 20.
5. La tablette finalise. La plateforme assemble, revérifie taille et empreinte, passe le statut à `uploaded` et déclenche le contrôle du fichier.

**Résultat.** Les serveurs d'application ne voient plus passer les octets, et l'envoi aboutit malgré la coupure, en renvoyant 448 Mio au lieu de 1 229 Mio.

**Limites.** Le fichier n'est ni sain ni valide parce qu'il est arrivé. Il reste en attente de contrôle, et une réservation oubliée doit être libérée par le nettoyage.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le téléversement direct allège-t-il l'application ?
2. **Compréhension.** Qu'autorise une URL signée, et qu'est-ce qu'elle n'établit pas ?
3. **Compréhension.** Comment un envoi fractionné reprend-il après une coupure ?
4. **Pourquoi.** Pourquoi la finalisation doit-elle être explicite et idempotente ?
5. **Raisonnement pratique.** Un fichier de 100 Gio doit être envoyé par parties, avec au plus 10 000 parties et au moins 5 Mio par partie. Quelle taille minimale de partie faut-il, et combien de parties avec 16 Mio ?

#### Réponses

1. Parce que les octets vont directement du client au stockage : l'application ne porte plus la bande passante, la mémoire ni les connexions longues. Elle garde seulement l'autorisation, le suivi et la vérification.
2. Elle autorise une opération précise sur une clé précise pendant une durée limitée, pour quiconque la détient. Elle n'établit ni l'identité de la personne, ni la nature du contenu, ni son innocuité.
3. Le client demande quelles parties sont reçues, puis envoie seulement les parties manquantes. L'état de l'envoi (numéros de parties, empreintes) est conservé à part, et les parties sont indépendantes.
4. Elle est explicite parce que le fichier ne doit exister, et compter dans le quota, qu'après vérification de la taille et de l'empreinte. Elle est idempotente parce qu'un client qui réessaie après un délai d'attente ne doit pas créer un second fichier.
5. $102\,400 / 10\,000 = 10{,}24$ Mio, donc au moins 10,24 Mio, supérieur au minimum de 5 Mio. Avec 16 Mio, $\lceil 102\,400 / 16 \rceil = 6\,400$ parties.

## 18.4 Validation, analyse antimalware et quarantaine

### 1. Comprendre simplement

La **validation du type et de la taille** (*file type and size validation*) vérifie, avant d'accepter un fichier, que son format réel et son volume correspondent à ce que la plateforme autorise. L'**analyse antimalware** (*malware scanning*) examine le contenu à la recherche de code malveillant. La **quarantaine** (*quarantine*) isole un fichier suspect, ou pas encore contrôlé : il existe dans le stockage, mais personne ne peut le lire, l'aperçu, l'indexer ou le partager.

**Pourquoi cela existe.** Un fichier reçu est une entrée non fiable. Il peut être un exécutable déguisé en image, une archive piégée, un document à macros, une page web qui exécute du script quand un navigateur l'ouvre depuis le domaine de la plateforme, ou simplement un fichier démesuré. Dans une plateforme multi-tenant, un fichier infecté déposé par un tenant peut en atteindre d'autres par le partage.

**Problème résolu.** Empêcher qu'un fichier dangereux ou hors limites n'entre dans la plateforme, n'atteigne des utilisateurs ou ne s'exécute dans le contexte de la plateforme.

**Modèle mental.** Le contrôle à la réception d'un entrepôt. On pèse le colis (la taille), on vérifie que le contenu correspond à l'étiquette (le type), on le passe au détecteur (l'antimalware), et on le garde en zone séparée tant que le contrôle n'est pas fini (la quarantaine).

**Où l'analogie s'arrête.** Un détecteur ne reconnaît que ce qu'il connaît : un code malveillant nouveau peut passer. Et l'étiquette n'est pas le contenu : c'est le client qui l'a écrite.

**Exemple.** Julie, technicienne d'un sous-traitant, téléverse « rapport.pdf », 3 Mio. La plateforme ignore le type annoncé : elle lit les premiers octets et reconnaît un PDF, vérifie la taille réelle, puis confie le fichier au moteur antimalware. Pendant l'analyse, quelques secondes, le fichier est au statut `scanning`, invisible des autres. Si le moteur y trouve du code malveillant, le fichier passe en `quarantined` ; la plateforme prévient Julie et l'administrateur du tenant, et ne sert jamais le fichier.

**Les composants.**

1. la **liste des types autorisés**, définie par contexte ;
2. la **détection du type réel**, par le contenu ;
3. les **plafonds de taille** : fichier, contenu décompressé, dimensions d'une image ;
4. le **moteur d'analyse** : signatures, heuristiques, bac à sable ;
5. les **statuts** : `scanning`, `clean`, `quarantined`, `rejected` ;
6. la **zone de quarantaine** et ses règles de sortie ;
7. la **notification** et la **traçabilité** de chaque décision.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi le type d'un fichier se détermine par son contenu, décrire la chaîne de contrôle jusqu'à la quarantaine, et dire ce que l'analyse antimalware ne garantit pas.

### 2. Connaissances essentielles

#### Définition

- **Validation du type et de la taille** : ensemble de contrôles qui établissent que le format réel et le volume d'un fichier appartiennent à la liste et aux limites autorisées dans le contexte.
- **Analyse antimalware** : examen du contenu d'un fichier par un moteur qui détecte du code malveillant à l'aide de signatures, d'heuristiques ou d'une exécution en bac à sable.
- **Quarantaine** : état d'isolation d'un fichier dont l'innocuité n'est pas établie ou dont la dangerosité est avérée ; il reste stocké, mais ni lisible, ni partageable, ni indexé.

#### Idées fondamentales

1. **Tout fichier reçu est une entrée non fiable** (voir [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces)).
2. **Le type se détermine par le contenu**, pas par l'étiquette ni par l'extension.
3. **On autorise par liste.** Une liste d'autorisation par contexte vaut mieux qu'une liste d'interdiction.
4. **Les limites de taille se posent à plusieurs niveaux.** Fichier, contenu décompressé, dimensions.
5. **Un fichier non contrôlé n'est pas disponible.** Le refus est le comportement par défaut tant qu'aucun verdict n'existe.
6. **L'analyse réduit le risque, elle ne le supprime pas.** Il faut y ajouter l'isolation du service et des en-têtes adaptés (voir [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)).
7. **La quarantaine est un état géré.** Elle a un responsable, une notification, une durée et des issues.

#### Vocabulaire essentiel

- **Liste d'autorisation** (*allow-list*) : liste des types acceptés ; tout le reste est refusé.
- **Signature de fichier ou octets magiques** (*file signature*, *magic bytes*) : premiers octets caractéristiques d'un format.
- **Type de média** (*media type*, *MIME type*) : identifiant normalisé d'un format, du genre `application/pdf`.
- **Bombe de décompression** (*decompression bomb*) : fichier compressé de petite taille qui occupe une taille démesurée une fois décompressé ou décodé.
- **Faux positif et faux négatif** (*false positive*, *false negative*) : fichier sain signalé à tort, ou fichier malveillant non détecté.
- **Bac à sable** (*sandbox*) : environnement isolé où l'on exécute ou analyse un contenu sans risque pour le reste.
- **Désarmement et reconstruction du contenu** (*content disarm and reconstruction*, CDR) : reconstruction d'un document sans ses éléments actifs.
- **Fichier de test EICAR** (*EICAR test file*) : fichier inoffensif que les antivirus détectent par convention, pour tester la chaîne d'analyse.
- **Échec fermé** (*fail closed*) : en cas de panne du contrôle, le fichier reste indisponible.

#### Relations de cause à effet

- On se fie au type annoncé : un script déguisé en image est servi tel quel, et un navigateur l'exécute chez un autre utilisateur.
- On ne limite que la taille compressée : une archive de quelques kio se décompresse en des gigaoctets et sature disque ou mémoire.
- On rend le fichier disponible avant l'analyse : un fichier infecté est téléchargé dans l'intervalle.
- On supprime en silence les fichiers détectés : l'utilisateur recommence sans comprendre et personne n'est alerté.
- On ne réanalyse jamais : un code qui n'était pas connu lors du dépôt reste stocké comme « sain ».

#### Idées reçues

- **« Un antivirus suffit. »** Non. Il reconnaît ce qu'il connaît. La validation du format, les plafonds et l'isolation du service restent nécessaires.
- **« L'extension indique le type. »** Non. L'expéditeur la choisit librement.
- **« Vérifier les octets magiques suffit. »** Non. Le guide de l'OWASP indique que cette vérification ne doit pas s'utiliser seule, car la contourner est courant et facile : un fichier peut commencer comme une image et contenir autre chose.

#### Principe clé

Un fichier reçu est une entrée non fiable : on décide de son type par son contenu, on borne ses dimensions, on l'isole tant qu'il n'est pas contrôlé, et on ne le sert que depuis un contexte où, même malveillant, il reste inoffensif.

#### Si vous ne retenez que trois choses

1. Le type et la taille s'établissent par le contenu et par des plafonds multiples, pas par ce que le client déclare.
2. Un fichier n'est disponible qu'après contrôle : jusque-là, il est en attente ou en quarantaine.
3. L'analyse antimalware réduit le risque sans le supprimer : on y ajoute l'isolation du service de contenu et les bons en-têtes.

### 3. Explication technique détaillée

#### La chaîne de contrôle

Les statuts du fichier ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)) décrivent la progression.

```text
pending ─► uploaded ─► scanning ─┬─► clean ─► disponible
                                 ├─► quarantined ─► revue ─┬─► clean (libération manuelle)
                                 │                         └─► deleted
                                 └─► rejected (type ou taille hors règles)
```

| Statut | Signification | Disponible | Sorties possibles |
|---|---|---|---|
| `pending` | Envoi en cours | Non | `uploaded` |
| `uploaded` | Reçu, pas encore contrôlé | Non | `scanning`, `rejected` |
| `scanning` | Analyse en cours | Non | `clean`, `quarantined`, `rejected` |
| `clean` | Contrôles passés | Oui | `quarantined` (réanalyse), `deleted` |
| `quarantined` | Suspect ou infecté | Non | `clean` (libération), `deleted` |
| `rejected` | Hors des règles de type ou de taille | Non | `deleted` |

Les contrôles s'enchaînent du moins coûteux au plus coûteux.

| Étape | Contrôle | Issue en cas d'échec |
|---|---|---|
| 1 | Taille maximale, déclarée puis réelle | Refus |
| 2 | Extension et type déclaré dans la liste du contexte | Refus |
| 3 | Type réel détecté par le contenu et cohérent avec le type déclaré | Refus |
| 4 | Contrôles du format : décodage, dimensions d'image, taille décompressée, nombre d'entrées d'une archive | Refus |
| 5 | Analyse antimalware | Quarantaine |
| 6 | Optionnel : assainissement (réencodage d'images, retrait des métadonnées, retrait des macros) | Version assainie, ou refus |

#### Politique de validation

La liste d'autorisation et les plafonds sont une configuration par contexte, pas du code (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)).

```json
{
  "upload_policy": {
    "subject_type": "finding",
    "max_file_size_bytes": 209715200,
    "allowed_types": [
      { "extension": "jpg", "media_type": "image/jpeg" },
      { "extension": "png", "media_type": "image/png" },
      { "extension": "pdf", "media_type": "application/pdf" },
      { "extension": "mp4", "media_type": "video/mp4" }
    ],
    "max_image_pixels": 100000000,
    "archives": { "allowed": false }
  }
}
```

Les 209 715 200 octets valent 200 Mio. Une politique analogue pour un autre type de sujet (par exemple une demande de formation) accepterait d'autres formats : c'est le contexte qui décide.

#### Détecter le type réel

Les premiers octets d'un format le signalent. Quelques signatures usuelles, à relire dans la spécification de chaque format :

| Format | Premiers octets (hexadécimal) | Remarque |
|---|---|---|
| PNG | `89 50 4E 47 0D 0A 1A 0A` | Huit octets fixes |
| JPEG | `FF D8 FF` | Trois octets |
| PDF | `25 50 44 46 2D` (`%PDF-`) | Le texte `%PDF-` |
| ZIP | `50 4B 03 04` (`PK`) | Aussi le conteneur des documents bureautiques modernes |

Un document bureautique récent est une archive ZIP : les octets magiques ne distinguent pas un tableur d'une archive quelconque. Il faut alors inspecter la structure interne.

```typescript
const SIGNATURES: Record<string, number[]> = {
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d],
};

function detectMediaType(head: Uint8Array): string | null {
  for (const [mediaType, signature] of Object.entries(SIGNATURES)) {
    if (signature.every((byte, i) => head[i] === byte)) return mediaType;
  }
  return null;
}

function isAcceptable(
  declared: string,
  head: Uint8Array,
  allowed: Set<string>,
): boolean {
  const detected = detectMediaType(head);
  return detected !== null && detected === declared && allowed.has(detected);
}
```

Ce contrôle est nécessaire et insuffisant. Il se combine avec les contrôles du format et avec l'analyse. Le type retenu pour la suite (en-têtes de réponse, aperçu) est le type **détecté**, jamais le type déclaré.

#### Tailles, dimensions et bombes de décompression

| Limite | Ce qu'elle prévient |
|---|---|
| Taille du fichier reçu | Saturation du stockage et du quota ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) |
| Taille après décompression et rapport de compression | Bombe de décompression |
| Nombre d'entrées et profondeur d'imbrication d'une archive | Archives récursives |
| Dimensions d'une image, en pixels | Image « de pixels » qui sature la mémoire au décodage |
| Durée et mémoire du traitement | Contenus conçus pour bloquer les convertisseurs |

Une image de 50 000 × 50 000 pixels compte 2,5 milliards de pixels. Décodée à 4 octets par pixel, elle occupe 10 milliards d'octets, environ 9,3 Gio de mémoire, alors que sa version compressée peut peser quelques Mio ou moins. On pose donc les limites **avant** de décoder, on décode avec des plafonds de mémoire et de temps, et l'on interrompt dès qu'un plafond est franchi.

#### L'analyse antimalware

| Méthode | Principe | Limite |
|---|---|---|
| Signatures | Reconnaît des motifs connus | Ne voit pas les codes nouveaux |
| Heuristiques | Repère des constructions suspectes | Faux positifs |
| Bac à sable | Exécute ou ouvre le fichier en environnement isolé | Coûteux, lent, contournable |
| Réputation par empreinte | Interroge un service avec l'empreinte du fichier | Peut divulguer des informations à un tiers |

Le guide de l'OWASP recommande l'analyse par antivirus ou bac à sable lorsqu'elle est disponible, signale le risque de fuite avec les services publics de recherche par empreinte, et recommande le désarmement et la reconstruction du contenu pour les documents tels que PDF et DOCX.

**Déploiement.** L'analyse est asynchrone : un travailleur consomme les événements de fichiers reçus (voir [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente)), lit l'objet, le passe au moteur, puis met à jour le statut par une transition conditionnelle.

```sql
UPDATE stored_file
   SET status = 'clean'
 WHERE tenant_id = $1
   AND id        = $2
   AND status    = 'scanning';
```

**Le moteur est un composant à risque.** Il lit des contenus hostiles : on l'exécute sans accès au réseau, sans secrets, avec un accès en lecture à l'objet seul, des plafonds de ressources et un environnement jetable.

**Réanalyse.** Les bases de signatures évoluent. Un fichier sain aujourd'hui peut être reconnu malveillant demain. La plateforme réanalyse les fichiers à la mise à jour majeure des signatures, ou périodiquement, et place en quarantaine ceux que le moteur reconnaît désormais.

**Test de bout en bout.** Le fichier de test EICAR est un fichier de 68 octets, inoffensif, que les antivirus détectent par convention. On l'envoie périodiquement, y compris en production, pour vérifier que toute la chaîne détecte, met en quarantaine et alerte.

**Si le moteur est indisponible.** Politique d'**échec fermé** : les fichiers restent en `uploaded` et indisponibles, avec un message clair, tant que le contrôle n'est pas rétabli. Un échec ouvert est une décision explicite et temporaire, jamais un défaut.

#### La quarantaine

Un fichier en quarantaine est stocké, mais scellé :

- il n'est ni téléchargeable ([18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)), ni prévisualisé ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)), ni partageable ([18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)), ni indexé ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)) ;
- il compte dans le quota ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) ;
- l'utilisateur voit « fichier bloqué » et le motif en termes simples ;
- l'administrateur du tenant et l'équipe sécurité de la plateforme le voient dans une file de revue ;
- les accès à la quarantaine sont tracés ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

Il est utile de la séparer physiquement : un conteneur ou un préfixe dédié, sans accès public, avec une politique de lecture très restreinte et une durée de vie propre.

| Règle | Exemple |
|---|---|
| Durée en quarantaine | 30 jours, puis purge, sauf conservation à des fins de preuve |
| Libération | Par un rôle autorisé, avec motif, journalisée, après réanalyse ou revue |
| Notification | Auteur du dépôt et administrateur du tenant ; alerte de sécurité en cas de répétition |
| Conservation de preuve | Selon la politique de sécurité et la loi applicable (voir [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)) |

#### Servir sans danger : défense en profondeur

- servir les contenus des utilisateurs depuis un **domaine distinct** de l'application, sans cookies de session : le guide de l'OWASP recommande un hôte séparé ;
- fixer `Content-Type` d'après le type **détecté** et ajouter `X-Content-Type-Options: nosniff`, qui empêche le navigateur de deviner le type ;
- forcer `Content-Disposition: attachment` pour les types qui ne doivent pas s'afficher (voir [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)) ;
- réencoder les images, ce qui retire les métadonnées, sachant que cela ne garantit pas l'absence de contenu malveillant ;
- ne jamais exécuter ni interpréter un fichier déposé.

#### Modes de défaillance

- **Type de confiance** : l'étiquette du client décide.
- **Disponible avant verdict** : le fichier est servi pendant l'analyse.
- **Échec ouvert** : le moteur tombe, tout passe.
- **Moteur exploité** : l'analyseur lui-même est compromis par un fichier hostile.
- **Signatures obsolètes** : pas de réanalyse.
- **Polyglotte** : un fichier valide pour deux formats passe le contrôle d'un seul.
- **Quarantaine sans propriétaire** : personne ne revoit, ni ne purge.

**Contre-exemple.** Une plateforme accepte « avatar.png » et le sert depuis son propre domaine avec le type annoncé. Le fichier contient du HTML et du script. Un navigateur qui devine le type l'ouvre comme une page, avec les cookies de session de la plateforme : le script lit les données de l'utilisateur. Il fallait détecter le type, réencoder l'image, servir depuis un domaine isolé et ajouter `nosniff`.

**Limites.** Aucune détection n'est parfaite : il existe des faux négatifs et des faux positifs. Une archive protégée par mot de passe ne peut pas être analysée : on la refuse ou on la met en quarantaine selon la politique. Un fichier chiffré de bout en bout par le client est illisible pour le moteur. Et envoyer des fichiers à un service d'analyse tiers expose leur contenu : la décision relève de la gouvernance des données (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable) | La finalisation déclenche le contrôle ; la réservation de quota est déjà prise |
| [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants) | Seul un fichier `clean` se télécharge, avec des en-têtes issus du type détecté |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Les aperçus ne se génèrent que pour un fichier `clean` |
| [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane) | Un fichier en quarantaine ne se partage pas |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces identifie le fichier téléversé comme entrée non fiable |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | La gestion des vulnérabilités s'applique aux bibliothèques de décodage et au moteur |
| [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | La file d'attente découple la réception de l'analyse |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Chaque décision de contrôle et chaque libération sont journalisées |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | L'auteur et l'administrateur sont notifiés des fichiers bloqués |

### 5. Application pratique

**Situation initiale.** Alpha Air ouvre un portail à ses sous-traitants pour déposer des rapports d'inspection. Les fichiers sont accessibles dès leur réception, et le seul contrôle est l'extension.

**Problème.** Un sous-traitant dépose un PDF piégé : il est téléchargé par plusieurs planificateurs avant d'être détecté, des semaines plus tard.

**Application du concept.** La plateforme ajoute la validation du type et de la taille, l'analyse antimalware asynchrone et une quarantaine.

**Déroulé.**

1. Le sous-traitant dépose « inspection-LYS-0412.pdf ». La plateforme détecte `application/pdf`, vérifie la taille (3 Mio) et passe le fichier en `uploaded`.
2. Un travailleur place le fichier en `scanning`, le moteur l'analyse dans un environnement isolé et signale du code malveillant.
3. Le statut devient `quarantined`. Le fichier n'est ni téléchargeable, ni prévisualisé, ni indexé.
4. Nadia, qui attendait le rapport, voit « fichier bloqué après contrôle » ; l'administrateur du tenant reçoit une notification et l'équipe sécurité une alerte.
5. L'administrateur demande au sous-traitant un nouveau dépôt. Une nuit, la réanalyse périodique confirme la détection sur deux autres fichiers du même expéditeur, qui passent aussi en quarantaine.

**Résultat.** Aucun utilisateur n'a ouvert le fichier, la décision est tracée, et le tenant sait qui prévenir.

**Limites.** Le moteur n'aurait pas détecté un code inconnu à la date du dépôt : seules la réanalyse et l'isolation du service de contenu limitent ce risque résiduel.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi ne faut-il se fier ni à l'extension ni au type déclaré par le client ?
2. **Compréhension.** Quelle différence y a-t-il entre un fichier rejeté et un fichier en quarantaine ?
3. **Compréhension.** Pourquoi un fichier reste-t-il indisponible jusqu'à la fin de l'analyse ?
4. **Pourquoi.** Pourquoi réanalyser des fichiers déjà jugés sains ?
5. **Raisonnement pratique.** Une image de 40 000 × 30 000 pixels est déposée, à 4 octets par pixel après décodage. Quelle mémoire exige son décodage, et que fait la politique de l'exemple (`max_image_pixels` = 100 000 000) ?

#### Réponses

1. Parce que ces valeurs sont choisies par l'expéditeur. Un fichier malveillant peut porter l'extension et le type d'une image. Le type se détermine par le contenu et par les contrôles propres au format.
2. Un fichier rejeté est hors des règles de type ou de taille : il n'entre pas, ou est supprimé. Un fichier en quarantaine respecte les règles, mais il est suspect ou infecté : on le conserve scellé pour revue, preuve ou libération.
3. Parce que tant qu'aucun verdict n'existe, on ignore s'il est dangereux. Le rendre disponible avant l'analyse ouvre une fenêtre où un fichier infecté peut être téléchargé.
4. Parce que les bases de signatures évoluent : un code non connu lors du dépôt peut l'être ensuite. La réanalyse retrouve les fichiers devenus détectables.
5. $40\,000 \times 30\,000 = 1{,}2$ milliard de pixels, soit 4,8 milliards d'octets, environ 4,5 Gio. La limite de 100 millions de pixels est dépassée : l'image est refusée avant tout décodage.

## 18.5 Autorisation de téléchargement et liens expirants

### 1. Comprendre simplement

L'**autorisation de téléchargement** (*download authorization*) est la décision, prise par la plateforme au moment de la lecture, de laisser ou non une personne obtenir un fichier. Un **lien expirant** (*expiring link*) est une adresse qui donne accès à un fichier pendant une durée limitée, puis cesse de fonctionner.

**Pourquoi cela existe.** Les droits changent : une personne quitte une équipe, un dossier est clos, un fichier devient confidentiel. Une adresse permanente continuerait de donner accès. Et il faut pourtant donner un accès temporaire à une application mobile, à un destinataire de courriel ou à un partenaire, sans lui ouvrir un compte.

**Problème résolu.** Garantir que chaque lecture respecte les droits du moment, et que les accès délégués s'éteignent d'eux-mêmes.

**Modèle mental.** Un vigile à la porte de l'entrepôt, qui contrôle les droits à chaque retrait, et un ticket de retrait à durée limitée que le vigile délivre une fois le contrôle passé.

**Où l'analogie s'arrête.** Un ticket de retrait se prête. Un lien expirant ne vérifie pas qui le présente, sauf liaison explicite. Et tant que le ticket est valable, il fonctionne, même si les droits ont changé entre-temps.

**Exemple.** Léa clique sur « Télécharger » pour le rapport d'audit. La plateforme vérifie son droit de lecture sur le dossier à cet instant, écrit l'accès dans le journal, puis la redirige vers une URL signée valable 60 secondes. Si Léa copie cette URL dans un message, elle ne fonctionnera plus une minute plus tard.

**Les composants.**

1. le **point d'entrée stable** (`/files/{id}/content`), sans secret ;
2. la **décision d'autorisation** : identité, tenant, droits sur le sujet, statut du fichier ;
3. le **lien expirant** : signature, durée, portée ;
4. la **réponse** : redirection vers le stockage, ou diffusion par la plateforme ;
5. les **en-têtes** : type, disposition, cache ;
6. le **journal d'accès** ;
7. la **révocation** et ses limites.

**Objectif d'apprentissage :** vous pouvez décrire ce que la plateforme contrôle à chaque lecture, expliquer pourquoi l'expiration d'un lien n'est pas une révocation, et dire quels en-têtes accompagnent un téléchargement sûr.

### 2. Connaissances essentielles

#### Définition

- **Autorisation de téléchargement** : décision, évaluée à chaque demande de lecture, qui détermine si l'acteur peut lire cette version de ce fichier, dans ce contexte, maintenant.
- **Lien expirant** : adresse signée qui donne accès à une ressource pendant une durée limitée, sans autre authentification, donc à tout porteur.

#### Idées fondamentales

1. **L'autorisation se décide à la lecture.** Elle ne se décide pas une fois pour toutes à la création du lien.
2. **Le point d'entrée est stable et sans secret ; le lien est éphémère et secret.** Le premier porte le contrôle, le second transporte les octets.
3. **Un lien expirant est un titre au porteur.** On le veut bref et étroit (voir [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable)).
4. **L'expiration ne révoque pas.** Tant que le lien n'a pas expiré, il fonctionne, même si les droits ont changé.
5. **La clé de l'objet se déduit de la base.** Jamais d'une valeur fournie par le client, et toujours dans le périmètre du tenant (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
6. **Chaque lecture laisse une trace.** Qui, quoi, quand, par quel moyen, avec quel résultat.
7. **Les en-têtes de réponse font partie du contrôle.** Type, disposition et cache décident de ce que fera le navigateur.

#### Vocabulaire essentiel

- **Référence directe non sécurisée à un objet** (*insecure direct object reference*, IDOR) : accès à l'objet d'un autre en modifiant un identifiant, faute de contrôle d'autorisation.
- **Redirection** (*redirect*) : réponse qui envoie le client vers l'URL signée du stockage.
- **Diffusion par la plateforme** (*proxy streaming*) : la plateforme lit l'objet et le retransmet.
- **Disposition de contenu** (*Content-Disposition*) : en-tête qui indique d'afficher le contenu (`inline`) ou de le télécharger (`attachment`).
- **Liaison** (*binding*) : rattachement d'un lien à une session, à une adresse ou à un utilisateur.
- **Lien à usage unique** (*one-time link*) : lien qui cesse de fonctionner après un premier usage.
- **Requête partielle** (*range request*) : demande d'une portion d'un fichier, utilisée pour reprendre un téléchargement.

#### Relations de cause à effet

- L'autorisation n'est évaluée qu'à la création d'un lien de longue durée : une personne qui perd ses droits garde l'accès.
- La clé de l'objet vient d'un paramètre du client : en changeant un identifiant, on obtient le fichier d'un autre tenant.
- Le lien vit sept jours : il circule dans des courriels, des messageries et des journaux, et sert à d'autres personnes.
- Aucun journal d'accès n'est tenu : on ne sait pas répondre à « qui a téléchargé ce rapport ? ».
- Le type servi vient du type déclaré : un contenu piégé s'exécute dans le navigateur (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).

#### Idées reçues

- **« Un lien long et aléatoire est assez sûr. »** Non. L'aléa protège contre la devinette, pas contre la fuite du lien.
- **« Faire expirer, c'est révoquer. »** Non. L'accès reste ouvert jusqu'à l'expiration.
- **« Être authentifié suffit. »** Non. Être authentifié n'est pas être autorisé : la lecture s'évalue pour ce fichier précis (voir [4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation)).

#### Principe clé

Le droit de lire se décide à chaque lecture, sur un point d'entrée stable ; le lien qui transporte les octets est bref, étroit et tracé.

#### Si vous ne retenez que trois choses

1. On autorise à chaque lecture, sur un point d'entrée stable, pas à la création d'un lien.
2. Un lien expirant est un titre au porteur : il reste valable jusqu'à son expiration, même si les droits changent.
3. Les en-têtes de réponse et le journal d'accès font partie du contrôle de téléchargement.

### 3. Explication technique détaillée

#### Deux modes de service

| Mode | Principe | Atouts | Limites |
|---|---|---|---|
| Redirection vers une URL signée | La plateforme décide, puis redirige le client vers le stockage | Les octets restent hors de l'application ; passe à l'échelle | Le lien est un titre au porteur ; révocation limitée |
| Diffusion par la plateforme | La plateforme lit l'objet et le retransmet | Contrôle total : filigrane à la volée, révocation immédiate, journal fin | Charge et bande passante sur l'application |

La redirection convient au cas courant. La diffusion par la plateforme se réserve aux documents qui exigent un filigrane appliqué à la volée ([18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)), une révocation immédiate ou un audit des octets servis.

#### Séquence de lecture

```text
     Client                             Plateforme (API)                        Stockage d'objets
        │                                       │                                       │
        │     1. GET /v1/files/{id}/content     │                                       │
        ├───────────────────────────────────────►                                       │
        │                                       │ identité et tenant                    │
        │                                       │ droit de lecture sur le sujet         │
        │                                       │ statut = clean ?                      │
        │                                       │ écrit le journal d'accès              │
        │                                       │ signe un lien de 60 secondes          │
        │   2. redirection vers l'URL signée    │                                       │
        ◄───────────────────────────────────────┤                                       │
        │                                       │                                       │
        │                            3. GET sur l'URL signée                            │
        ├───────────────────────────────────────────────────────────────────────────────►
        │                             4. octets et en-têtes                             │
        ◄───────────────────────────────────────────────────────────────────────────────┤
```

#### Ce que la plateforme contrôle à chaque lecture

1. **Identité** : session ou jeton valide ([4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)).
2. **Contexte de tenant** : le fichier appartient au tenant de l'acteur, sauf partage explicite ([5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
3. **Droit sur le sujet** : droit de lecture sur la ressource, voire sur le champ (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
4. **État du fichier** : `clean`, non supprimé, version autorisée ([18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).
5. **Politique de contexte** : authentification renforcée pour les contenus sensibles ([4.5 Authentification multifacteur](04-identite-iam-autorisation.md#45-authentification-multifacteur)), restrictions de réseau.
6. **Journalisation** de la décision, accordée ou refusée.

La clé de l'objet sort d'une requête qui impose le tenant du contexte :

```sql
SELECT f.storage_key, f.content_type, f.original_name
  FROM stored_file f
 WHERE f.tenant_id = $1
   AND f.id        = $2
   AND f.status    = 'clean';
```

Le premier paramètre vient du contexte authentifié, le second du chemin de la requête. Une ligne absente produit la même réponse qu'un fichier inexistant : on ne révèle pas qu'il existe chez un autre tenant.

#### Politique de téléchargement par tenant

La durée du lien, les contenus sensibles et les dispositions sont une configuration (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).

```json
{
  "download_policy": {
    "link_ttl_seconds": 60,
    "require_recent_mfa_for_classes": ["restricted"],
    "log_every_download": true,
    "disposition_by_type": {
      "application/pdf": "inline",
      "image/jpeg": "inline",
      "text/html": "attachment",
      "image/svg+xml": "attachment"
    }
  }
}
```

Les types qui peuvent embarquer du script (page web, image vectorielle) se servent en `attachment`, ou après assainissement.

#### Durée, usage unique et liaison

| Choix | Effet | Limite |
|---|---|---|
| Durée courte (30 à 120 secondes) | Réduit la fenêtre d'abus ; suffit pour démarrer le téléchargement | Une reprise après expiration échoue : il faut redemander un lien |
| Usage unique | Un second usage échoue | Exige un état côté serveur : la signature seule ne l'empêche pas |
| Liaison à la session ou à l'adresse | Un lien volé ne fonctionne pas ailleurs | Faux refus (réseaux mobiles, serveurs mandataires) |
| Lien longue durée par courriel | Pratique pour le destinataire | Relève du partage externe ([18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)) avec ses propres contrôles |

Le comportement de l'expiration dépend du service : pour un grand service d'objets, l'expiration est vérifiée au moment de la requête. Un téléchargement commencé juste avant l'expiration se poursuit, mais une reprise après l'expiration échoue. Pour les gros fichiers, la reprise par requêtes partielles repasse donc par la plateforme, qui signe un nouveau lien.

#### En-têtes de la réponse

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="rapport-audit-2026-09.pdf"
X-Content-Type-Options: nosniff
Cache-Control: private, no-store
Content-Length: 3145728
```

| En-tête | Rôle |
|---|---|
| `Content-Type` | Type détecté par la plateforme, jamais le type déclaré par le client |
| `X-Content-Type-Options: nosniff` | Le navigateur n'essaie pas de deviner le type ; il bloque les scripts et feuilles de style de type incorrect |
| `Content-Disposition` | Définit affichage ou téléchargement, et le nom proposé ; le RFC 6266 prévoit un paramètre `filename*` pour les noms non ASCII |
| `Cache-Control: private, no-store` | Empêche les caches partagés, puis tout cache, de conserver le contenu |

Le RFC 9111 précise que `private` interdit le stockage par les caches partagés et que `no-store` interdit tout stockage, tout en rappelant que ce ne sont pas des mécanismes de confidentialité infaillibles. Le nom de fichier proposé est nettoyé : séparateurs de chemin, caractères de contrôle et retours à la ligne sont retirés, ce qui évite l'injection d'en-têtes.

#### Révocation

| Technique | Effet | Coût |
|---|---|---|
| Durée très courte | La fenêtre d'abus reste de quelques secondes | Redemandes fréquentes |
| Jeton opaque contrôlé à chaque usage | Révocation immédiate : le jeton est supprimé ou marqué | Une lecture d'état à chaque usage |
| Rotation de la clé de signature | Invalide tous les liens en circulation | Brutal : tous les accès en cours échouent |
| Suppression ou déplacement de l'objet | Le lien ne mène plus à rien | Destructif ; incompatible avec la conservation |

Pour le cas courant, la durée courte suffit. Pour les liens de partage qui doivent vivre plus longtemps, on utilise un jeton opaque contrôlé à chaque usage (voir [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)).

#### Journal d'accès et limitation

Chaque lecture produit une ligne : tenant, fichier, version, acteur, mode (redirection ou diffusion), identifiant du lien, résultat et motif de refus, horodatage (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)). Les refus sont aussi précieux que les accords : une série de refus est un signal d'attaque. Les données de connexion (adresse réseau, agent utilisateur) sont des données personnelles : on minimise et l'on fixe une durée de conservation (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).

On limite le débit des téléchargements par acteur et par tenant : un téléchargement massif est un signe d'exfiltration. Le guide de l'OWASP recommande de limiter le rythme des requêtes de téléchargement (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) et [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)).

#### Modes de défaillance

- **IDOR** : l'identifiant ou le chemin du client désigne l'objet sans contrôle.
- **Autorisation à la création seulement** : un lien de longue durée contourne les changements de droits.
- **Lien de longue durée journalisé** : l'adresse complète apparaît dans les journaux.
- **Cache partagé** : une réponse privée est conservée et resservie à un autre utilisateur (voir [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)).
- **Type servi non contrôlé** : exécution dans le navigateur.
- **Incohérence entre interface et API** : le bouton est masqué, l'API répond (voir [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles)).
- **Orphelin** : le sujet est supprimé, le fichier reste accessible par son identifiant.

**Contre-exemple.** Une plateforme expose `/download?file=constat_204.pdf`. Le contrôle vérifie seulement que l'utilisateur est connecté. En remplaçant 204 par 205, on obtient le constat d'un autre tenant. Il fallait un identifiant opaque, une requête qui impose le tenant du contexte et un contrôle de droit sur le sujet.

**Limites.** Un lien expirant ne distingue pas son porteur. La révocation d'un lien déjà signé est limitée. Un utilisateur légitime peut redistribuer ce qu'il a téléchargé : le filigrane ([18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)) dissuade et trace, il n'empêche pas. Les délais d'expiration et leurs détails varient d'un service de stockage à l'autre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.3 Téléversement direct et téléversement fractionné reprenable](#183-téléversement-direct-et-téléversement-fractionné-reprenable) | La signature de lecture suit le même principe que celle d'écriture |
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | Seul un fichier `clean` se télécharge ; le type servi est le type détecté |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Les dérivés et le CDN prolongent le téléchargement, avec leurs propres règles de cache |
| [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane) | Le partage externe est un lien plus durable, avec vérification et journal propres |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | Les droits sur le fichier suivent ceux de son sujet |
| [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant) | Le tenant du contexte borne toute lecture |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'accès fait partie de la traçabilité |
| [12.12 Interface sensible aux permissions et aux rôles](12-produit-ux.md#1212-interface-sensible-aux-permissions-et-aux-rôles) | L'interface masque ce que l'API refuse, sans la remplacer |

### 5. Application pratique

**Situation initiale.** Un auditeur externe prépare l'audit annuel d'Alpha Air et doit consulter des rapports de maintenance clos. L'entreprise lui envoyait jusqu'ici des liens de téléchargement valables 30 jours.

**Problème.** Les liens circulent entre collègues de l'auditeur, personne ne sait qui a téléchargé quoi, et l'accès continue après la fin de la mission.

**Application du concept.** La plateforme remplace les liens longs par un point d'entrée stable, une autorisation à chaque lecture, un lien de 60 secondes et un journal.

**Déroulé.**

1. L'auditeur reçoit un compte invité avec le rôle `auditor`, en lecture seule sur les dossiers clos de la période.
2. À chaque clic, la plateforme vérifie l'identité, le tenant, le droit sur le dossier et le statut du fichier.
3. Elle répond par une redirection vers un lien de 60 secondes, avec `nosniff` et `Content-Disposition: attachment`.
4. Chaque accès, accordé ou refusé, est écrit dans le journal.
5. À la fin de la mission, le compte est désactivé : à la lecture suivante, la décision est un refus, sans lien à révoquer.

**Résultat.** Les droits suivent les changements du jour, les accès sont traçables et aucun lien durable ne circule.

**Limites.** L'auditeur peut redistribuer les fichiers qu'il a téléchargés légitimement ; la protection passe alors par le contrat et par le filigrane.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi autoriser à chaque lecture plutôt qu'à la création du lien ?
2. **Compréhension.** Qu'est-ce qu'un lien expirant, et que ne garantit-il pas ?
3. **Compréhension.** Quelle différence y a-t-il entre la redirection vers une URL signée et la diffusion par la plateforme ?
4. **Pourquoi.** Pourquoi les en-têtes `nosniff` et `Content-Disposition` appartiennent-ils au contrôle de téléchargement ?
5. **Raisonnement pratique.** Un utilisateur perd ses droits à 10:00:30. Son lien de 60 secondes a été créé à 10:00:00. Peut-il télécharger à 10:00:45 ? À 10:01:10 ?

#### Réponses

1. Parce que les droits changent entre la création du lien et son usage. Autoriser à chaque lecture applique les droits du moment et permet de journaliser chaque accès.
2. C'est une adresse signée qui donne accès à un fichier pendant une durée limitée, à quiconque la possède. Elle ne garantit ni l'identité du porteur, ni la révocation avant l'expiration.
3. La redirection laisse les octets circuler entre le stockage et le client : c'est économique, mais le lien est un titre au porteur. La diffusion fait passer les octets par la plateforme : elle coûte plus cher, mais permet filigrane à la volée, révocation immédiate et journal fin.
4. Parce que c'est le navigateur qui décide d'afficher ou d'exécuter ce qu'il reçoit. Sans ces en-têtes, un contenu déposé par un utilisateur peut s'exécuter dans le contexte de la plateforme.
5. À 10:00:45, oui : le lien est encore valable et l'autorisation a été décidée à 10:00:00. À 10:01:10, non : le lien a expiré, et une nouvelle demande est évaluée avec les droits du moment, donc refusée.

## 18.6 Aperçus, miniatures et réseau de diffusion de contenu

### 1. Comprendre simplement

Un **aperçu** (*preview*) est une représentation d'un fichier que l'on affiche sans télécharger l'original ni ouvrir un logiciel externe : une page de PDF rendue en image, une photo réduite, la première image d'une vidéo. Une **miniature** (*thumbnail*) est un aperçu de petite taille pour les listes et les grilles. Un **réseau de diffusion de contenu** (*content delivery network*, CDN) est un ensemble de serveurs répartis dans le monde qui conservent des copies temporaires de contenus pour les servir au plus près de l'utilisateur.

**Pourquoi cela existe.** Afficher quarante photos pleine résolution dans une liste transfère des centaines de mégaoctets. Ouvrir un document pour voir ce qu'il contient prend du temps. Et un utilisateur éloigné du serveur d'origine subit la latence à chaque requête.

**Problème résolu.** Voir vite sans lire l'original, et servir près de l'utilisateur sans solliciter l'origine à chaque fois.

**Modèle mental.** Une vitrine de magasin pour les aperçus, et des succursales locales qui gardent un stock des articles les plus demandés pour le CDN.

**Où l'analogie s'arrête.** La vitrine peut être périmée si l'original a été remplacé. Et les succursales gardent aussi ce qu'il ne faudrait pas montrer à tous : un contenu privé placé dans un cache partagé peut être resservi à la mauvaise personne.

**Exemple.** Nadia ouvre la liste des pièces jointes d'un constat : 12 miniatures de 20 Kio chacune, soit 240 Kio, au lieu de 12 photos de 6 Mio, soit 72 Mio. Un clic sur une photo affiche un aperçu de 800 pixels de large. L'original ne se télécharge que sur demande. Les miniatures passent par le CDN, avec des liens signés de durée limitée.

**Les composants.**

1. la **génération des dérivés**, asynchrone et après contrôle ;
2. le **stockage des dérivés**, en objets séparés, rattachés à une version ;
3. les **rendus par type** : image, PDF, document bureautique, vidéo ;
4. l'**isolation du générateur**, car il traite un contenu hostile ;
5. la **livraison** : lien signé, CDN ;
6. le **cache** : clé, durée, invalidation ;
7. le **repli** quand aucun aperçu n'est possible.

**Objectif d'apprentissage :** vous pouvez décrire comment un aperçu est produit et rattaché à une version, expliquer ce que fait un CDN, et dire pourquoi la clé de cache décide de la sécurité d'un contenu privé.

### 2. Connaissances essentielles

#### Définition

- **Aperçu et miniature** (*preview and thumbnail*) : dérivés d'un fichier, de plus petite taille ou de format plus simple, générés pour permettre de le reconnaître ou de le consulter sans l'original.
- **Réseau de diffusion de contenu** : réseau de serveurs en périphérie qui met en cache des réponses de l'origine et les sert aux utilisateurs proches, pendant une durée limitée.

#### Idées fondamentales

1. **Un dérivé n'est pas l'original.** Il vit à côté, se régénère, se jette.
2. **On ne génère de dérivé que pour un fichier contrôlé.** Un fichier en quarantaine n'a aucun aperçu (voir [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)).
3. **Un dérivé est lié à une version.** Une nouvelle version rend les anciens dérivés caducs (voir [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).
4. **La génération traite un contenu hostile.** Elle est asynchrone, idempotente et isolée.
5. **Un CDN accélère au prix d'un cache.** La clé de cache et l'invalidation décident de ce qui est resservi, et à qui.
6. **Un contenu privé ne va pas dans un cache partagé sans contrôle d'accès à la périphérie.**
7. **Le repli fait partie du design.** Pas d'aperçu signifie une icône et un message, pas une erreur (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).

#### Vocabulaire essentiel

- **Dérivé ou rendition** (*derivative*, *rendition*) : fichier produit à partir d'un autre.
- **Rendu** (*rendering*) : opération qui transforme un contenu en image.
- **Origine** (*origin*) : serveur d'où le CDN récupère un contenu absent de son cache.
- **Point de présence ou périphérie** (*edge*, *point of presence*) : serveur du CDN proche de l'utilisateur.
- **Clé de cache** (*cache key*) : ce qui identifie une réponse en cache : au minimum la méthode et l'adresse, plus les en-têtes cités par `Vary`.
- **Invalidation ou purge** (*purge*) : retrait d'un contenu du cache avant son expiration.
- **Taux de réussite du cache** (*cache hit ratio*) : part des requêtes servies sans solliciter l'origine.
- **Cache partagé** (*shared cache*) : cache utilisé par plusieurs utilisateurs, comme celui d'un CDN.

#### Relations de cause à effet

- Les dérivés sont générés à la demande par l'application : pics de processeur et latence imprévisibles à l'ouverture d'une liste.
- Le convertisseur de documents s'exécute sans isolation : un fichier piégé compromet le serveur.
- Rien ne lie le dérivé à la version : l'aperçu montre l'ancienne version après un remplacement.
- Le CDN met en cache des réponses privées : un utilisateur voit le contenu d'un autre.
- L'invalidation est absente : un contenu supprimé est encore servi.

#### Idées reçues

- **« Une miniature est inoffensive. »** Non. Elle peut révéler plus que prévu (métadonnées, zone rognée), et sa génération est un traitement du fichier hostile.
- **« Un CDN ne sert qu'aux sites publics. »** Non. Avec des liens signés vérifiés en périphérie, il sert aussi du contenu privé, à condition de maîtriser la clé de cache.
- **« Supprimer l'original supprime ses copies. »** Non. Dérivés et caches se purgent explicitement.

#### Principe clé

Un aperçu est un dérivé jetable d'une version contrôlée, généré en isolation ; un CDN le rapproche de l'utilisateur, à condition que la clé de cache et l'invalidation respectent les droits.

#### Si vous ne retenez que trois choses

1. Un aperçu est un dérivé d'une version précise, généré après contrôle, dans un environnement isolé.
2. Un CDN réduit la latence et la charge de l'origine en conservant des copies : ce qui est copié doit pouvoir l'être.
3. Pour un contenu privé, la clé de cache et la vérification d'accès en périphérie sont la sécurité.

### 3. Explication technique détaillée

#### Chaîne de génération

```text
fichier clean ─► file d'attente ─► générateur isolé ─► dérivés stockés ─► CDN ─► utilisateur
                                           │
                                           └─► échec : nouvelles tentatives, puis icône de repli
```

| Format source | Dérivés usuels | Remarque |
|---|---|---|
| Image | Miniature de 128 pixels, aperçu de 800 pixels | Le réencodage retire les métadonnées et applique l'orientation |
| PDF | Image de la première page, nombre de pages | Rendu de page en bac à sable |
| Document bureautique | Conversion en PDF, puis rendu | Convertisseur complexe : risque élevé, isolation forte |
| Vidéo | Image de couverture, version basse définition | Traitement coûteux : file dédiée |
| Autres formats | Icône par type | Pas d'aperçu |

Les dérivés se rangent sous une clé qui contient la version et la spécification, par exemple `tenants/ten_airline_01/derived/f_01J0A4/v3/thumb-128.jpg`. Une ligne de suivi garantit l'idempotence : la clé primaire interdit de créer deux fois le même dérivé.

```sql
CREATE TABLE file_derivative (
  tenant_id   uuid        NOT NULL,
  file_id     uuid        NOT NULL,
  version_no  integer     NOT NULL,
  kind        text        NOT NULL CHECK (kind IN ('thumbnail','preview','poster','text')),
  spec        text        NOT NULL,
  object_id   uuid,
  status      text        NOT NULL CHECK (status IN ('queued','ready','failed')),
  attempts    integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, file_id, version_no, kind, spec),
  FOREIGN KEY (tenant_id, file_id, version_no)
    REFERENCES file_version (tenant_id, file_id, version_no)
);
```

#### À l'avance ou à la demande

| Stratégie | Principe | Atouts | Limites |
|---|---|---|---|
| Pré-génération | On produit les dérivés dès le contrôle | Lecture rapide | Coût pour des dérivés jamais lus |
| À la demande | On produit au premier accès, puis on met en cache | Économique | Latence du premier accès |
| Hybride | Miniatures à l'avance, aperçus à la demande | Compromis courant | Deux chemins à exploiter |

Les originaux archivés ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) se lisent difficilement : on génère les dérivés **avant** le passage en niveau froid.

#### Isoler le générateur

Le générateur lit des contenus hostiles avec des bibliothèques complexes (voir [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)) : un bac à sable sans accès au réseau et sans secrets, avec des plafonds de mémoire, de temps de calcul et de taille de sortie, un environnement jetable, une entrée en lecture seule. Un résultat qui dépasse un plafond est refusé. Les nouvelles tentatives sont bornées ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)), et l'échec définitif laisse une icône de repli plutôt qu'une page d'erreur.

#### Fonctionnement d'un CDN

```text
Utilisateur ──► périphérie (CDN) ──┬─► réponse en cache : servie directement
                                   └─► absente ou expirée : requête à l'origine,
                                       réponse conservée pour la durée autorisée
```

La part des requêtes servies par le cache s'exprime par le taux de réussite $h$. La charge de l'origine est :

$$R_{\text{origine}} = (1 - h) \times R$$

où $R$ est le nombre total de requêtes. Pour $R = 1\,000\,000$ requêtes par jour : avec $h = 0{,}92$, l'origine reçoit 80 000 requêtes ; avec $h = 0{,}98$, elle en reçoit 20 000, soit quatre fois moins.

#### Cache partagé et contenu privé

Le RFC 9111 définit le fonctionnement des caches HTTP. Trois points comptent ici :

- une réponse marquée `private` ne doit pas être conservée par un cache partagé ;
- une réponse marquée `no-store` ne doit être conservée par aucun cache ;
- un cache partagé ne réutilise pas la réponse à une requête portant un en-tête `Authorization`, sauf directive qui l'autorise (`must-revalidate`, `public` ou `s-maxage`).

La **clé de cache** se compose de la méthode et de l'adresse, plus les en-têtes cités par `Vary`. Si un contenu privé est servi sous une adresse identique pour tous, la clé ne distingue pas les utilisateurs : le premier qui le charge le met en cache pour tous.

| Contenu | Stratégie | En-têtes de cache |
|---|---|---|
| Ressources statiques de l'application | CDN, longue durée, noms versionnés | `public, max-age=31536000` |
| Miniatures privées d'un tenant | CDN avec lien signé vérifié en périphérie, durée courte | `private` si la périphérie ne vérifie pas la signature |
| Originaux sensibles | Pas de CDN, ou lecture directe | `private, no-store` |
| Contenu public d'un tenant (logo) | CDN, durée moyenne | `public` |

**Clés versionnées.** Plutôt que d'invalider un cache après un remplacement, on change de clé : `…/v3/thumb-128.jpg` devient `…/v4/thumb-128.jpg`. L'ancienne clé n'est plus demandée et expire. Cette technique évite les purges.

**Purge.** Elle reste nécessaire pour retirer un contenu supprimé ou sous retrait légal. Elle n'est pas toujours instantanée : elle se vérifie auprès du fournisseur du CDN, et la durée de vie des entrées en cache borne la fenêtre.

**Isolation par tenant.** Le préfixe du tenant fait partie de l'adresse, donc de la clé : les contenus de deux tenants ne se mélangent pas. On évite de baser la clé sur des cookies pour des contenus statiques.

**Résidence des données.** Une périphérie copie les contenus dans de nombreuses régions : pour un contenu soumis à une exigence de localisation, on limite les points de présence ou l'on n'utilise pas le CDN (voir [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)).

#### Texte extrait pour la recherche

Les dérivés incluent parfois le texte extrait d'un document, utile à la recherche plein texte ([19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation), [19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)). Ce texte hérite des droits du fichier : il n'est jamais indexé pour d'autres lecteurs que ceux qui peuvent lire l'original.

#### Modes de défaillance

- **Dérivé périmé** : la version change, l'aperçu non.
- **Contenu privé en cache partagé** : exposition à des tiers.
- **Convertisseur non isolé** : compromission du serveur.
- **Tempête de génération** : un import de 50 000 fichiers sature les générateurs (voir [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)).
- **Purge oubliée** : un fichier supprimé reste accessible par son adresse de cache.
- **Aperçu qui expose plus que l'original** : une zone masquée par un droit de champ reste visible dans le dérivé.

**Contre-exemple.** Une plateforme sert `/thumbs/{file_id}.jpg` par un CDN avec `Cache-Control: public, max-age=86400`, l'autorisation étant évaluée à l'origine, par cookie. Un premier utilisateur autorisé réchauffe le cache. Un second, sans droit, reçoit l'image depuis la périphérie sans que l'origine soit consultée. Il fallait des liens signés vérifiés en périphérie, ou `private` avec des clés par utilisateur, ou pas de CDN pour ce contenu.

**Limites.** Un aperçu n'est pas fidèle à l'original : polices, mise en page et animations diffèrent. La conversion est avec perte. Les dérivés occupent de l'espace, et leur comptage dans le quota est une décision de produit ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)). Le comportement des CDN, leurs outils de purge et leurs frais de sortie varient selon les fournisseurs.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | Les dérivés ne sont générés que pour un fichier `clean` |
| [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants) | Les dérivés se servent par le même contrôle d'accès et les mêmes liens signés |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Dérivés rattachés à une version ; l'original archivé complique la génération |
| [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane) | Les copies filigranées sont des dérivés propres à un destinataire |
| [22.3 Mise en cache](22-performance-echelle-economie.md#223-mise-en-cache) | La mise en cache générale : niveaux, invalidation, clés par tenant |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Les points de présence du CDN interagissent avec la résidence des données |
| [19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation) | Le texte extrait alimente l'analyse de texte de la recherche |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | Le repli et les états d'erreur visibles quand l'aperçu manque |

### 5. Application pratique

**Situation initiale.** Alpha Air attache beaucoup de photos aux constats. La liste d'un constat charge les photos en pleine résolution : l'écran met 8 secondes à s'afficher sur le réseau d'un hangar, et le serveur de fichiers sature le lundi matin.

**Problème.** Aucun dérivé, aucune mise en cache, et un lien direct vers l'original dans chaque ligne.

**Application du concept.** La plateforme génère des miniatures et des aperçus après le contrôle, les range par version, et les sert par un CDN avec des liens signés vérifiés en périphérie.

**Déroulé.**

1. Une photo passe en `clean` ; un événement place un travail de dérivation en file.
2. Un générateur isolé produit une miniature de 128 pixels et un aperçu de 800 pixels, sans métadonnées, sous des clés versionnées.
3. La liste affiche les miniatures par des liens signés de 10 minutes, vérifiés en périphérie.
4. Un technicien remplace une photo : la version 2 reçoit de nouveaux dérivés, aux clés neuves ; les anciens expirent.
5. Le téléchargement de l'original passe par le contrôle d'accès à chaque lecture ([18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)).

**Résultat.** La liste s'affiche en moins d'une seconde, la charge d'origine tombe, et les contenus privés restent contrôlés.

**Limites.** La première ouverture d'un fichier qui vient d'arriver peut afficher une icône de repli le temps de la génération ; l'interface doit l'accepter.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un aperçu et une miniature ?
2. **Compréhension.** Pourquoi ne génère-t-on les dérivés qu'après le contrôle antimalware ?
3. **Compréhension.** Qu'est-ce que la clé de cache, et pourquoi pèse-t-elle sur la sécurité ?
4. **Pourquoi.** Pourquoi une nouvelle version produit-elle de nouvelles clés plutôt que d'invalider l'ancien cache ?
5. **Raisonnement pratique.** Un service reçoit 1 000 000 de requêtes par jour avec un taux de réussite de 92 %. Quelle charge reçoit l'origine, et que devient-elle à 98 % ?

#### Réponses

1. Un aperçu permet de consulter le contenu à taille d'écran. Une miniature est un aperçu très réduit, destiné aux listes et aux grilles, pour reconnaître le fichier plus que pour le lire.
2. Parce que le générateur traite le contenu du fichier : lui donner un fichier non contrôlé expose la plateforme, et un aperçu d'un fichier en quarantaine le rendrait visible.
3. C'est ce qui identifie une réponse en cache. Si deux utilisateurs distincts obtiennent la même clé pour un contenu privé, le cache sert au second ce que le premier a chargé, sans contrôle de droits.
4. Parce que l'invalidation est lente, incertaine et dépend du fournisseur. Une clé neuve n'a aucune entrée en cache ; l'ancienne n'est plus demandée et expire.
5. $(1 - 0{,}92) \times 1\,000\,000 = 80\,000$ requêtes. À 98 %, $(1 - 0{,}98) \times 1\,000\,000 = 20\,000$, soit quatre fois moins.

## 18.7 Partage externe et filigrane

### 1. Comprendre simplement

Le **partage externe** (*external sharing*) donne accès à un fichier à une personne ou à une organisation qui n'est pas membre du tenant : un sous-traitant, un auditeur, un loueur d'aéronef, un client. Le **filigrane** (*watermark*) est une marque ajoutée à une copie d'un document pour la rattacher à un destinataire ou à un contexte : un texte en transparence sur les pages, ou une marque invisible dans le contenu.

**Pourquoi cela existe.** Les fichiers servent à collaborer au-delà du tenant. On ne veut pas ouvrir un compte pour chaque destinataire occasionnel. Mais un fichier qui sort du tenant échappe aux droits de la plateforme : il faut au moins borner l'accès, le tracer, et pouvoir dire d'où vient une fuite.

**Problème résolu.** Partager sans créer de compte et sans perdre toute maîtrise : durée, étendue, vérification du destinataire, journal et traçabilité dissuasive.

**Modèle mental.** Un prêt en bibliothèque : on prête à une personne identifiée, pour une durée, on note le prêt, et l'ouvrage porte le tampon de la bibliothèque.

**Où l'analogie s'arrête.** Un tampon dissuade, il n'empêche pas la photocopie. Un fichier téléchargé se copie, se photographie et se retransmet : aucune technique ne l'empêche entièrement.

**Exemple.** Sophie partage le dossier de remise en service de F-ABCD avec le loueur de l'aéronef. Le lien est valable 14 jours, protégé par un code envoyé à l'adresse du destinataire, en lecture et téléchargement. La copie téléchargée porte le filigrane « Confidentiel — m.durand@client.example — 2026-10-14 ».

**Les composants.**

1. le **partage** : fichier, version, destinataire, droits, expiration ;
2. le **jeton de partage**, secret, conservé sous forme d'empreinte ;
3. la **vérification du destinataire** : code, mot de passe, compte invité ;
4. les **droits** accordés : voir, télécharger ;
5. le **journal** des accès externes ;
6. la **révocation** ;
7. le **filigrane**, appliqué à une copie par destinataire ;
8. la **politique du tenant** : autoriser ou non, pour quelles classes de données.

**Objectif d'apprentissage :** vous pouvez décrire les paramètres qui bornent un partage externe, expliquer ce qu'un filigrane apporte et ce qu'il ne fait pas, et dire pourquoi un partage doit pouvoir être révoqué et tracé.

### 2. Connaissances essentielles

#### Définition

- **Partage externe** : octroi d'un accès à un fichier, ou à une version, à un destinataire extérieur au tenant, par un mécanisme borné (durée, droits, vérification) et tracé.
- **Filigrane** : marque, visible ou non, insérée dans une copie d'un document pour l'associer à un destinataire, une date ou un statut, afin de dissuader la diffusion et de faciliter la recherche de l'origine d'une fuite.

#### Idées fondamentales

1. **Le partage externe est une exception explicite.** Le tenant décide s'il est permis, pour qui, et pour quelles classes de données (voir [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données)).
2. **Un partage est borné.** Version, droits, durée et destinataire sont fixés.
3. **Le destinataire se vérifie à proportion de la sensibilité.** Du lien simple au compte invité avec authentification renforcée.
4. **Tout accès externe est tracé et révocable.**
5. **Le filigrane dissuade et trace, il n'empêche pas.**
6. **Le filigrane s'applique à une copie par destinataire.** Jamais à l'original.
7. **Un partage a un propriétaire.** Quand celui-ci quitte l'organisation, ses partages doivent être revus.

#### Vocabulaire essentiel

- **Destinataire externe** (*external recipient*) : personne ou organisation hors du tenant.
- **Lien de partage** (*share link*) : adresse qui donne accès au fichier partagé.
- **« Toute personne disposant du lien »** (*anyone with the link*) : partage sans vérification du destinataire.
- **Compte invité** (*guest account*) : identité limitée, créée pour un partenaire.
- **Code à usage unique** (*one-time passcode*) : code envoyé à une adresse pour prouver qu'on la contrôle.
- **Filigrane visible** (*visible watermark*) : marque lisible à l'œil.
- **Filigrane invisible** (*invisible watermark*, *forensic watermark*) : marque encodée dans le contenu, lisible par un outil.
- **Lecture seule** (*view-only*) : consultation sans téléchargement proposé.

#### Relations de cause à effet

- Le partage par défaut est « toute personne disposant du lien » : le lien se transfère, et l'on ne sait plus qui lit.
- Aucune expiration n'est exigée : le partage devient permanent et oublié.
- Aucun journal n'est tenu : impossible d'établir qui a lu, quand.
- Le filigrane est posé sur l'original : toutes les copies portent la marque d'un même destinataire, aucune traçabilité.
- La « lecture seule » est présentée comme une protection : l'utilisateur photographie l'écran.

#### Idées reçues

- **« La lecture seule empêche la copie. »** Non. Elle supprime un bouton, pas la capture d'écran.
- **« Un filigrane empêche les fuites. »** Non. Il dissuade et permet de remonter à une copie, sans en empêcher la diffusion.
- **« Un lien long vaut contrôle d'accès. »** Non. Un lien est un titre au porteur (voir [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)).

#### Principe clé

Partager hors du tenant est une exception bornée, vérifiée et tracée ; le filigrane relie une copie à un destinataire pour dissuader et pour retrouver l'origine d'une fuite.

#### Si vous ne retenez que trois choses

1. Un partage externe est borné par la version, les droits, la durée et la vérification du destinataire, et il est tracé et révocable.
2. Un filigrane ne se pose que sur une copie par destinataire et ne prouve rien à lui seul.
3. Le tenant garde la main : il décide si le partage est permis, pour quelles données et avec quelles conditions.

### 3. Explication technique détaillée

#### Modèle de partage

```sql
CREATE TABLE file_share (
  tenant_id        uuid        NOT NULL,
  id               uuid        NOT NULL,
  file_id          uuid        NOT NULL,
  version_no       integer,
  recipient_kind   text        NOT NULL CHECK (recipient_kind IN ('anyone_with_link','email','guest_account')),
  recipient_email  text,
  permission       text        NOT NULL CHECK (permission IN ('view','download')),
  watermark        boolean     NOT NULL DEFAULT false,
  expires_at       timestamptz NOT NULL,
  revoked_at       timestamptz,
  created_by       uuid        NOT NULL,
  created_at       timestamptz NOT NULL,
  token_hash       char(64)    NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (token_hash)
);
```

**Comment la lire.** Le champ `version_no` épingle la version partagée (voir [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) : un `NULL` signifie « version courante », choix à décider et à afficher. `expires_at` est obligatoire : il n'existe pas de partage sans fin. `token_hash` conserve l'empreinte du jeton, pas le jeton : comme un mot de passe, un secret ne se stocke pas en clair, et une fuite de la base ne livre pas les liens.

```typescript
import { createHash, randomBytes } from "node:crypto";

function newShareToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}
```

Le jeton fait 256 bits tirés d'un générateur cryptographiquement sûr : il ne se devine pas. À l'usage, la plateforme recalcule l'empreinte du jeton reçu et cherche la ligne.

#### Politique du tenant

```json
{
  "external_sharing": {
    "enabled": true,
    "allowed_classifications": ["internal", "partner"],
    "max_expiry_days": 30,
    "default_expiry_days": 14,
    "recipient_verification": "email_code",
    "allow_anyone_with_link": false,
    "watermark_required_for": ["partner"],
    "notify_owner_on_access": true
  }
}
```

Cette politique appartient au tenant (voir [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)). La plateforme impose un plancher : même un administrateur ne peut pas retirer le journal d'accès.

#### Vérification du destinataire

| Niveau | Mécanisme | Convient pour |
|---|---|---|
| Lien seul | Jeton secret | Contenu peu sensible, durée courte |
| Lien et mot de passe | Secret transmis par un autre canal | Contenu moyennement sensible |
| Lien et code par courriel | Code à usage unique envoyé à l'adresse prévue | Cas courant : prouve le contrôle de la boîte |
| Compte invité avec authentification renforcée | Identité gérée ([4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation), [4.5 Authentification multifacteur](04-identite-iam-autorisation.md#45-authentification-multifacteur)) | Partages réguliers ou sensibles |

#### Le parcours du destinataire

Le destinataire arrive sur une surface dédiée, sans session de la plateforme : il présente le jeton, passe la vérification, puis consulte ou télécharge. Chaque étape est tracée. Un lien expiré ou révoqué mène à une page claire (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)). La surface a ses propres limites de débit, et ses réponses ne révèlent rien sur l'existence d'autres partages : un jeton invalide produit toujours la même réponse. Le jeton n'ouvre que ce fichier, cette version : aucune navigation vers des voisins.

#### Filigrane

| Type | Principe | Atout | Limite |
|---|---|---|---|
| Visible | Texte ou image en transparence : nom, adresse, date, mention | Dissuade, se lit à l'œil | Se retouche ; peut disparaître sur une capture recadrée |
| Invisible | Identifiant encodé dans les pixels, les espaces ou la structure | Traçabilité sans gêne | Fragile à la recompression ; nécessite un outil de lecture |
| Métadonnées | Champs du fichier (auteur, identifiant de copie) | Simple | Se retire facilement |

**Où l'appliquer.** À la volée, au téléchargement : l'original reste intact dans le stockage, la copie est produite pour ce destinataire. Cette copie est un dérivé ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)), mis en cache par couple (version, destinataire), ou diffusé par la plateforme pour les cas les plus sensibles ([18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants)).

**Le registre de copies.** Un filigrane ne vaut que si la plateforme sait le résoudre : elle enregistre, pour chaque copie, l'identifiant de filigrane, le partage, le destinataire, la version et l'instant. Sans ce registre, un identifiant retrouvé sur une fuite ne mène à personne.

**Contenu du filigrane visible.** Par exemple : « Confidentiel — {destinataire} — {date} — {identifiant court} ». Il contient une donnée personnelle du destinataire : on la limite au nécessaire (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).

#### Fin de vie d'un partage

- **Expiration** : le partage cesse à `expires_at`, sans action.
- **Révocation** : le propriétaire, un administrateur ou une règle de sécurité renseigne `revoked_at`.
- **Départ du propriétaire** : lorsqu'une identité est déprovisionnée ([1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement), [4.12 SCIM](04-identite-iam-autorisation.md#412-scim)), ses partages sont révoqués ou transférés selon la politique.
- **Suppression ou gel du fichier** : un partage vers un fichier supprimé ne mène à rien ; un gel légal ([18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)) empêche la suppression mais ne rend pas le partage plus permissif.

#### Journal et alertes

Chaque accès externe écrit : partage, destinataire vérifié, action (vue, téléchargement), adresse réseau, résultat. Le propriétaire peut recevoir une notification au premier accès (voir [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires)). Des accès répétés depuis des lieux inhabituels, ou en volume, déclenchent une alerte (voir [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)).

#### Modes de défaillance

- **Partage ouvert à tous par défaut.**
- **Durée infinie ou très longue.**
- **Mauvaise version partagée** : la version courante change après le partage.
- **Classification ignorée** : un document restreint est partagé sans contrôle.
- **Énumération des jetons** : des réponses différentes révèlent des jetons valides.
- **Périmètre qui s'élargit** : le partage d'un dossier inclut les fichiers ajoutés ensuite.
- **Partage orphelin** : le propriétaire part, son partage reste actif.
- **Filigrane retiré** : copie retouchée, sans résolution possible.

**Contre-exemple.** Une plateforme propose par défaut « toute personne disposant du lien », sans expiration. Un sous-traitant transmet le lien à un tiers. Rien n'est enregistré sur l'identité des lecteurs et aucune révocation systématique n'existe : le tenant découvre l'exposition des mois plus tard, sans pouvoir dire qui a lu.

**Limites.** Aucun dispositif technique n'empêche la copie par photographie d'écran ou la retransmission. Le filigrane ne prouve pas à lui seul une responsabilité. Le contrat (clause de confidentialité) complète la technique. Le partage vers un destinataire dans un autre pays relève des règles de transfert de données (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.5 Autorisation de téléchargement et liens expirants](#185-autorisation-de-téléchargement-et-liens-expirants) | Un lien de partage est un lien plus durable, avec vérification et journal propres |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Le partage épingle une version précise |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Les copies filigranées sont des dérivés par destinataire |
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | Un fichier non `clean` ne se partage pas |
| [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers) | Un gel légal ne se contourne pas par un partage ; un partage ne suspend pas la rétention |
| [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données) | La classification de la donnée gouverne ce qui peut être partagé |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les transferts hors d'une zone juridique ont leurs propres règles |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Le déprovisionnement d'un propriétaire déclenche la revue de ses partages |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | Notification au propriétaire lors de l'accès |

### 5. Application pratique

**Situation initiale.** Alpha Air doit remettre au loueur de l'aéronef le dossier de remise en service de F-ABCD. Jusqu'ici, un employé l'envoie par courriel, en pièce jointe, sans suite.

**Problème.** Aucune traçabilité, aucun contrôle de ce que le loueur transmet, et aucun moyen de retirer l'accès.

**Application du concept.** La plateforme propose un partage externe borné et filigrané, selon la politique du tenant.

**Déroulé.**

1. Sophie choisit « Partager », sélectionne le loueur et la version 3 du dossier. La politique impose la classe `partner`, un filigrane et 30 jours au plus ; Sophie garde 14 jours.
2. La plateforme crée le partage, le jeton, et envoie au loueur un lien, puis un code à l'adresse prévue.
3. Le destinataire saisit le code, consulte le dossier et télécharge un exemplaire. La copie porte son nom, la date et un identifiant court ; le registre de copies l'enregistre.
4. Sophie reçoit une notification au premier accès, et voit le journal : deux lectures et un téléchargement.
5. Après 14 jours, le partage expire. Sophie le prolonge d'une semaine pour une demande tardive, puis le révoque.

**Résultat.** L'accès est borné, tracé, et le dossier diffusé est rattaché à son destinataire.

**Limites.** Le loueur peut retransmettre la copie : le filigrane ne l'en empêche pas. Il permet de remonter à la copie et fonde un échange contractuel.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** En quoi un partage externe diffère-t-il d'un accès normal au tenant ?
2. **Compréhension.** Quels paramètres borne-t-on dans un partage externe ?
3. **Compréhension.** Que peut faire un filigrane, et que ne peut-il pas faire ?
4. **Pourquoi.** Pourquoi stocker l'empreinte du jeton de partage plutôt que le jeton ?
5. **Raisonnement pratique.** Une employée qui a créé 12 partages externes quitte l'organisation. Que doit-il se passer ?

#### Réponses

1. Le destinataire n'a ni compte ni rôle dans le tenant : l'accès repose sur un jeton et une vérification légère, limités à un fichier et à une durée. Les droits habituels (rôles, héritage) ne s'appliquent pas, donc les bornes du partage les remplacent.
2. Le fichier et sa version, les droits (voir ou télécharger), la durée, le destinataire et son niveau de vérification, la présence d'un filigrane, et la possibilité de révoquer.
3. Il dissuade, relie une copie à un destinataire et permet d'enquêter sur une fuite. Il n'empêche ni la copie, ni la photographie d'écran, et il ne prouve pas à lui seul une responsabilité.
4. Parce qu'un secret ne se stocke pas en clair : si la base fuit, les empreintes ne permettent pas de reconstituer les liens. La plateforme compare l'empreinte du jeton présenté à celle qu'elle a conservée.
5. Le déprovisionnement de l'identité déclenche la revue de ses partages : ils sont révoqués ou transférés à un responsable selon la politique, et la décision est journalisée. Un partage ne doit pas survivre sans propriétaire.

## 18.8 Modèles de document et génération de documents

### 1. Comprendre simplement

Un **modèle de document** (*document template*) est une mise en page qui comporte des emplacements variables, des zones répétées et des règles de présentation, que la plateforme remplit avec des données. La **génération de documents** (*document generation*) est l'opération qui, à partir d'un modèle, de données et d'une langue, produit un document figé : un PDF, un fichier bureautique, une page imprimable.

**Pourquoi cela existe.** Les mêmes documents reviennent des milliers de fois : certificats, rapports, bons de travail, contrats, courriers. Les produire à la main est lent et crée des écarts. Les organisations veulent aussi adapter la présentation (logo, mentions légales, langue) sans demander de développement.

**Problème résolu.** Produire de façon répétable, cohérente et personnalisable des documents conformes, à partir des données de la plateforme.

**Modèle mental.** Un publipostage : un courrier type, une liste de destinataires, et autant de courriers personnalisés.

**Où l'analogie s'arrête.** Un publipostage est un geste ponctuel. Ici, la génération est un service : les modèles ont des versions, des droits et des approbations, et le document produit est une pièce qui a une valeur. Il se conserve, il ne se refait pas à volonté.

**Exemple.** Alpha Air génère le certificat de remise en service de F-ABCD à partir du modèle `tpl_crs` en version 7, de la tâche `mt_1042` et du constat `fd_204`. Le PDF obtenu est enregistré comme fichier du dossier, avec la référence du modèle et un instantané des données. Hugo, responsable qualité, le signera ensuite (voir [18.9 Signature électronique](#189-signature-électronique)).

**Les composants.**

1. le **modèle** : structure, texte, variables, mise en forme, ressources (logo, polices) ;
2. le **contexte de rendu** : les données, figées à l'instant de la génération ;
3. le **moteur de modèles**, qui substitue, répète et teste des conditions ;
4. le **convertisseur**, qui produit le format final (PDF, fichier bureautique) ;
5. la **langue et les formats régionaux** (voir [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)) ;
6. la **numérotation** des documents (voir [27.5 Stratégie d'identifiants et numérotation sans trou](27-types-donnees-specialises.md#275-stratégie-didentifiants-et-numérotation-sans-trou)) ;
7. le **stockage** du document avec ses métadonnées de génération ;
8. l'**administration des modèles** : brouillon, test, publication.

**Objectif d'apprentissage :** vous pouvez décrire ce qui entre dans la génération d'un document, expliquer pourquoi un document généré se conserve au lieu de se refaire, et citer les risques propres aux modèles.

### 2. Connaissances essentielles

#### Définition

- **Modèle de document** : gabarit versionné, composé d'un contenu fixe et d'emplacements à remplir par des données, qui décrit la structure et la présentation d'un type de document.
- **Génération de documents** : production d'un document figé à partir d'une version de modèle, d'un jeu de données et d'une langue, par un moteur de rendu et un convertisseur.

#### Idées fondamentales

1. **Le contenu, la structure et les données sont séparés.** Le modèle ne contient pas la donnée ; la donnée ne connaît pas la mise en page.
2. **Le modèle est une configuration versionnée.** Brouillon, test, approbation, publication (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) et [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).
3. **Un document généré est un instantané.** Il fige la version du modèle, les données et la langue.
4. **La génération est reproductible.** Mêmes version, données et langue : même résultat, à la précision près du convertisseur.
5. **Un modèle s'exécute côté serveur.** On limite sa puissance et on l'isole.
6. **Les formats viennent de la langue, pas du modèle.** Dates, nombres, devises, unités.
7. **Le document généré est un fichier comme les autres.** Contrôlé, versionné, conservé.

#### Vocabulaire essentiel

- **Emplacement ou variable** (*placeholder*, *variable*) : zone du modèle remplie par une donnée.
- **Moteur de modèles** (*template engine*) : composant qui applique les données au modèle.
- **Contexte de rendu** (*render context*) : ensemble des données fournies au moteur.
- **Publipostage** (*mail merge*) : production de documents personnalisés à partir d'un modèle et d'une liste.
- **Moteur sans logique** (*logic-less engine*) : moteur qui n'offre que la substitution, les sections répétées et les conditions simples.
- **Injection de modèle côté serveur** (*server-side template injection*) : attaque qui fait exécuter par le moteur un contenu fourni par un utilisateur.
- **PDF/A** : famille de formats PDF conçue pour la conservation à long terme.

#### Relations de cause à effet

- Le modèle lit les données « en direct » à l'affichage : le document change après coup et ne prouve plus rien.
- Les modèles sont modifiés sans versions : on ne peut ni refaire ni expliquer un ancien document.
- Des utilisateurs écrivent des modèles à logique complète : le serveur exécute du code qu'ils ont choisi.
- Les formats de date et de nombre sont figés dans le modèle : le document est faux pour un autre pays.
- Un gros document est généré en mode synchrone : délai d'attente, utilisateur bloqué, doublons.

#### Idées reçues

- **« Un PDF est stable, donc sûr. »** Non. Un PDF ordinaire peut embarquer des éléments actifs. Le format PDF/A, lui, interdit notamment JavaScript et le chiffrement dans ses trois premières parties, selon la notice de la Bibliothèque du Congrès.
- **« Refaire un document revient à l'ouvrir. »** Non. Le refaire avec le modèle et les données du jour peut produire un document différent.
- **« Un modèle ne contient que de la mise en page. »** Non. Il porte des mentions légales et des règles : il se gouverne comme une configuration à effet réglementaire.

#### Principe clé

Un document généré est le produit figé d'une version de modèle, d'un instantané de données et d'une langue : on peut le reproduire, l'expliquer et le conserver.

#### Si vous ne retenez que trois choses

1. Un document généré fige un modèle versionné, des données et une langue à l'instant de la génération.
2. Le document émis se conserve ; on ne le refait pas pour le prouver.
3. Un modèle est une configuration qui s'exécute côté serveur : on le gouverne et on l'isole.

### 3. Explication technique détaillée

#### Anatomie d'un modèle

| Élément | Rôle | Exemple |
|---|---|---|
| Texte fixe | Contenu qui ne change pas | « Certificat de remise en service » |
| Variable | Valeur substituée | `{{aircraft.registration}}` |
| Section répétée | Une ligne par élément d'une liste | La liste des tâches |
| Condition | Affiche ou masque un bloc | Mention réservée à une base |
| En-tête, pied de page, styles | Présentation commune | Logo, numérotation de pages |
| Ressources | Fichiers référencés | Logo, polices |

```html
<h1>Certificat de remise en service</h1>
<p>Aéronef : {{aircraft.registration}} — Base : {{base.name}}</p>
<p>Date d'émission : {{issued_on}}</p>
<table>
  {{#tasks}}
  <tr><td>{{number}}</td><td>{{title}}</td><td>{{status}}</td></tr>
  {{/tasks}}
</table>
<p>Document n° {{document_number}}</p>
```

La syntaxe est celle d'un moteur sans logique. Le moteur **échappe** par défaut les valeurs substituées : un champ qui contiendrait du HTML est affiché comme du texte, pas interprété.

La fiche du modèle, elle, est une configuration :

```json
{
  "template_id": "tpl_crs",
  "version": 7,
  "status": "published",
  "default_locale": "fr-FR",
  "output": { "format": "pdf", "profile": "pdf-a-2b" },
  "data_contract": ["aircraft", "base", "tasks", "issued_on", "document_number"],
  "numbering": { "series": "CRS", "gapless": true },
  "approvals_required": ["quality_manager"]
}
```

Le champ `data_contract` liste les données que le modèle a le droit de lire : le moteur ne reçoit rien d'autre.

#### De la donnée au document

```text
 modèle (version 7) ─────┐
 données (instantané) ───┼─► moteur de rendu ─► page HTML ─► convertisseur ─► PDF ─► fichier du dossier
 locale (fr-FR) ─────────┘
```

Le résultat entre dans la chaîne de contrôle des fichiers ([18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine)) comme un fichier déposé : même statut, mêmes plafonds, mêmes droits.

#### Instantané et reproductibilité

Les données du contexte de rendu sont figées à la génération. La plateforme enregistre avec le fichier : l'identifiant et la version du modèle, la langue, la version du moteur, et l'empreinte du contexte, voire le contexte lui-même selon la sensibilité (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités) pour la minimisation).

```sql
CREATE TABLE generated_document (
  tenant_id         uuid        NOT NULL,
  id                uuid        NOT NULL,
  file_id           uuid        NOT NULL,
  template_id       text        NOT NULL,
  template_version  integer     NOT NULL,
  locale            text        NOT NULL,
  context_sha256    char(64)    NOT NULL,
  engine_version    text        NOT NULL,
  document_number   text,
  generated_by      uuid        NOT NULL,
  generated_at      timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, file_id) REFERENCES file_asset (tenant_id, id)
);
```

**Ce que la reproductibilité garantit, et ce qu'elle ne garantit pas.** Avec la même version de modèle, les mêmes données et la même version de moteur, on obtient un document visuellement identique. On n'obtient pas toujours un fichier identique octet pour octet : horodatages et identifiants internes des formats de sortie varient. D'où la règle : **on conserve le document émis**, on ne le refait pas pour le prouver. L'instantané sert à l'expliquer et, au besoin, à produire une copie de remplacement tracée.

#### Langue, formats et numérotation

- La langue du document se choisit par destinataire ou par contexte, avec une langue de repli (voir [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)).
- Les dates, nombres, devises et unités suivent la langue et les règles du domaine : voir [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche), [27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure) et [27.4 Monnaie et arrondis](27-types-donnees-specialises.md#274-monnaie-et-arrondis).
- Le texte riche saisi par un utilisateur et inséré dans un document est assaini avant substitution (voir [27.6 Texte riche](27-types-donnees-specialises.md#276-texte-riche)).
- La numérotation (`CRS-2026-000412`) est attribuée dans la même transaction que l'enregistrement du document : une génération qui échoue ne doit pas consommer un numéro, ou la trace du numéro abandonné doit rester explicable (voir [27.5 Stratégie d'identifiants et numérotation sans trou](27-types-donnees-specialises.md#275-stratégie-didentifiants-et-numérotation-sans-trou)).

**Document et message.** Un modèle de message de notification ([17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation)) et un modèle de document partagent le mécanisme : variables, langue, versions. Ils diffèrent par la sortie. Un message est court et éphémère. Un document est figé, contrôlé et conservé.

#### Génération synchrone ou asynchrone

| Cas | Mode | Raison |
|---|---|---|
| Un document court, à la demande | Synchrone avec délai d'attente | Retour immédiat |
| Un document volumineux ou complexe | Asynchrone : tâche de fond, puis notification ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond), [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires)) | Évite les délais d'attente |
| Un lot de 500 certificats | Asynchrone, file équitable par tenant ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) | Ne pas saturer les autres |

La demande de génération est idempotente : une même demande, avec la même clé, ne produit pas deux documents (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

#### Sécurité des modèles

Un modèle est du code déguisé : un moteur de modèles exécute des instructions sur des données.

- **Injection de modèle côté serveur.** Elle apparaît quand une entrée utilisateur est concaténée dans le modèle, au lieu d'être passée comme donnée. Les mesures recommandées par l'éditeur de formations PortSwigger : ne pas laisser des utilisateurs écrire des modèles quand c'est évitable, utiliser un moteur sans logique, n'exécuter le code fourni que dans un bac à sable, avec une isolation supplémentaire. On ajoute : donnée **jamais** concaténée dans la chaîne du modèle.
- **Droits de lecture.** Le document n'inclut que des champs que le demandeur peut lire (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)). Sinon, déclencher la génération devient un moyen de contourner les droits.
- **Requêtes sortantes du convertisseur.** Un convertisseur d'HTML qui charge des images ou des feuilles de style distantes peut être détourné pour contacter des adresses internes : on bloque ou l'on filtre ses accès réseau.
- **Plafonds.** Durée, nombre de pages, taille de sortie.
- **Administration.** Seuls les rôles prévus modifient un modèle, et la publication suit la revue et l'approbation (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).

#### Format de sortie et conservation

Pour un document destiné à être gardé longtemps, le format **PDF/A** (famille de normes ISO 19005) vise la préservation : d'après la Bibliothèque du Congrès, les parties 1 à 3 imposent notamment l'incorporation des polices, interdisent le chiffrement, JavaScript et le contenu audio ou vidéo, et exigent des métadonnées normalisées ; la partie 4 assouplit certaines de ces contraintes. Il existe quatre parties (PDF/A-1 à -4) et, pour les trois premières, des niveaux de conformité A, B et U. Un convertisseur qui annonce produire du PDF/A ne dispense pas de **valider** le résultat avec un outil de validation.

#### Administration et couches

Un modèle suit le cycle des configurations : brouillon, test sur des données d'exemple, revue, publication, retrait. Une version publiée est immuable ; une version retirée n'est plus proposée, mais reste disponible pour expliquer les documents qu'elle a produits. Les solutions livrées apportent des modèles de départ, que chaque tenant personnalise par couches (logo, mentions, langues) sans les forker (voir [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)).

#### Modes de défaillance

- **Document « vivant »** : rendu à l'ouverture, il change.
- **Modèle modifié sur place** : les anciens documents deviennent inexplicables.
- **Trou de numérotation** : numéro consommé par une génération échouée.
- **Police absente** : caractères remplacés par des carrés.
- **Génération synchrone d'un lot** : délais d'attente et doublons.
- **Injection de modèle** et **requêtes sortantes détournées**.
- **Champ non autorisé** : un document révèle ce que le demandeur ne peut pas lire.

**Contre-exemple.** Le « certificat » est une page web qui lit l'état de la tâche à l'affichage. Six mois plus tard, un auditeur l'ouvre : le statut a changé, une mention a disparu. La pièce que l'on montre n'est plus celle qui a été émise. Il fallait générer un fichier figé, enregistré avec son modèle et ses données.

**Limites.** Un document identique octet pour octet n'est pas garanti. Les mises à jour du moteur ou des données de langue peuvent modifier la mise en page. L'accessibilité du document (structure, balisage) demande des choix propres. La valeur juridique d'un document généré dépend du droit applicable et de la signature (voir [18.9 Signature électronique](#189-signature-électronique)). La conversion de fichiers bureautiques reste fragile.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | Le document généré est stocké et empreinté comme tout fichier |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Un document remplacé crée une version ; l'émis reste épinglable |
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | Le fichier généré passe par la chaîne de contrôle |
| [18.9 Signature électronique](#189-signature-électronique) | Le document figé est celui que l'on signe |
| [18.10 Gestion documentaire et cycle de vie du document](#1810-gestion-documentaire-et-cycle-de-vie-du-document) | Le document généré entre dans le cycle de vie documentaire |
| [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) | Même mécanisme de modèles, pour une sortie différente |
| [25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche) | Les formats régionaux s'appliquent à la génération |
| [27.5 Stratégie d'identifiants et numérotation sans trou](27-types-donnees-specialises.md#275-stratégie-didentifiants-et-numérotation-sans-trou) | La numérotation sans trou des documents émis |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le modèle est une configuration versionnée |

### 5. Application pratique

**Situation initiale.** Alpha Air établit ses certificats de remise en service dans un traitement de texte. Chaque base a sa version du modèle, les numéros sont saisis à la main, et il arrive de retrouver deux certificats portant le même numéro.

**Problème.** Aucune cohérence, aucune traçabilité du modèle utilisé, aucune garantie sur la numérotation.

**Application du concept.** La plateforme introduit un modèle `tpl_crs` versionné, un contexte de rendu défini, une numérotation sans trou et la conservation du document émis.

**Déroulé.**

1. À la clôture de la tâche `mt_1042`, la plateforme propose « Générer le certificat ».
2. Elle assemble le contexte de rendu (aéronef, base, tâches, date) avec les droits du demandeur, alloue le numéro `CRS-2026-000412` et fige les données.
3. Le moteur applique la version 7 du modèle, avec la langue française ; le convertisseur produit un PDF/A-2b, validé.
4. Le fichier passe par la chaîne de contrôle, puis est rattaché au dossier avec les références du modèle, de la langue, du moteur et du contexte.
5. Hugo ouvre le document figé et le signe ([18.9 Signature électronique](#189-signature-électronique)).

**Résultat.** Un seul modèle, des numéros uniques, un document émis qui ne change plus, et une traçabilité du modèle utilisé.

**Limites.** Si la mention légale évolue, le modèle passe en version 8 : les certificats déjà émis restent tels quels. Leur remplacement éventuel est une décision documentaire (voir [18.10 Gestion documentaire et cycle de vie du document](#1810-gestion-documentaire-et-cycle-de-vie-du-document)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un modèle de document et un document généré ?
2. **Compréhension.** Que contient l'instantané enregistré avec un document généré, et à quoi sert-il ?
3. **Compréhension.** Pourquoi limite-t-on la logique d'un modèle ?
4. **Pourquoi.** Pourquoi conserve-t-on le document émis plutôt que de le regénérer à la demande ?
5. **Raisonnement pratique.** Le modèle en version 7 est corrigé en version 8 à cause d'une mention légale. 200 certificats en version 7 sont déjà émis. Que faire ?

#### Réponses

1. Le modèle est un gabarit versionné avec des emplacements. Le document généré est le produit figé d'une version de modèle, de données et d'une langue : un fichier conservé, contrôlé et éventuellement signé.
2. L'identifiant et la version du modèle, la langue, la version du moteur, et l'empreinte du contexte de rendu, parfois le contexte lui-même. Il sert à expliquer le document, à produire une copie de remplacement tracée et à répondre à une contestation.
3. Parce qu'un modèle s'exécute côté serveur : plus il a de puissance, plus une entrée hostile peut y faire exécuter du code ou lire des données. Un moteur sans logique, des données passées comme données et un bac à sable réduisent le risque.
4. Parce que refaire le document avec le modèle, le moteur et les données du jour peut donner un résultat différent. La pièce qui engage est celle qui a été émise : on la conserve, on ne la reconstruit pas pour la prouver.
5. On laisse les 200 certificats tels quels : ce sont des pièces émises. Les nouveaux certificats utilisent la version 8. Si la correction exige de remplacer des certificats déjà émis, on en génère de nouveaux, rattachés aux anciens par un lien de remplacement tracé, sans écraser les originaux.

## 18.9 Signature électronique

### 1. Comprendre simplement

La **signature électronique** (*electronic signature*) est un ensemble de données électroniques associées à un document, que le signataire utilise pour signer. Elle sert à établir **qui** a signé, **quel** contenu exact, **quand**, et à rendre détectable toute modification ultérieure. Dans l'Union européenne, le règlement eIDAS distingue trois niveaux : simple, avancée et qualifiée.

**Pourquoi cela existe.** Un accord, un certificat de remise en service, l'approbation d'une procédure engagent leur auteur. Le papier avait la signature manuscrite. En numérique, il faut prouver l'identité du signataire, son consentement et l'intégrité du contenu, sans papier et souvent à distance.

**Problème résolu.** Engager des personnes sur un contenu précis de façon vérifiable, avec une valeur probante proportionnée au risque.

**Modèle mental.** Un sceau de cire sur une enveloppe : il identifie l'expéditeur, et sa rupture révèle l'ouverture.

**Où l'analogie s'arrête.** Un sceau de cire est un objet physique. La signature électronique repose, selon le niveau, sur un simple enregistrement de consentement ou sur la cryptographie et sur la confiance accordée à des tiers (prestataires, autorités). Et une image de signature manuscrite collée dans un fichier n'est pas une signature au sens technique.

**Exemple.** Hugo signe le certificat de remise en service de F-ABCD. La plateforme fige le document et calcule son empreinte, vérifie l'identité de Hugo par une authentification renforcée, recueille son consentement explicite, appose la signature et un horodatage, puis enregistre un dossier de preuve : qui, quoi, quand, comment. Toute modification ultérieure du PDF fait échouer la vérification.

**Les composants.**

1. le **document figé** : version et empreinte ;
2. l'**identité du signataire** et sa vérification ;
3. le **consentement** et l'intention de signer ;
4. la **donnée de signature**, cryptographique ou non ;
5. l'**horodatage** ;
6. le **dossier de preuve** ;
7. la **vérification** ultérieure ;
8. le **prestataire** de service de confiance, le cas échéant.

**Objectif d'apprentissage :** vous pouvez expliquer ce que lie une signature électronique, distinguer les trois niveaux du règlement eIDAS, et dire pourquoi le dossier de preuve compte autant que la signature.

### 2. Connaissances essentielles

#### Définition

- **Signature électronique** : données sous forme électronique, jointes ou associées logiquement à d'autres données électroniques, que le signataire utilise pour signer (règlement eIDAS, article 3, point 10).
- **Signature électronique avancée** : signature électronique qui satisfait aux exigences de l'article 26 : liée au signataire, capable de l'identifier, créée avec des données que le signataire peut, avec un niveau de confiance élevé, placer sous son contrôle exclusif, et liée aux données signées de façon que toute modification ultérieure soit détectable.
- **Signature électronique qualifiée** : signature avancée créée par un dispositif de création de signature qualifié et fondée sur un certificat qualifié de signature électronique (article 3, point 12) ; elle a un effet juridique équivalent à celui d'une signature manuscrite (article 25, paragraphe 2).

#### Idées fondamentales

1. **Signer, c'est lier une identité à un contenu précis.** Avec une intention, à un instant.
2. **Plusieurs niveaux existent.** On choisit le niveau selon le risque et le droit applicable.
3. **La signature porte sur une version figée.** Une référence épinglée, comme en [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage).
4. **La valeur probante repose sur un dossier de preuve.** Pas sur une image de signature.
5. **La cryptographie garantit l'intégrité.** L'identité repose sur la vérification de la personne et sur la confiance dans des tiers.
6. **L'horodatage fixe l'existence à un instant.** Il ne dépend pas de l'horloge du seul serveur.
7. **La vérification doit rester possible dans la durée.** Les certificats expirent ; il faut conserver de quoi les valider plus tard.

#### Vocabulaire essentiel

- **Signataire** (*signatory*) : personne physique qui signe.
- **Certificat** (*certificate*) : document électronique qui associe une clé publique à une identité.
- **Clé privée et clé publique** (*private key*, *public key*) : paire de clés ; la première signe, la seconde vérifie.
- **Prestataire de services de confiance** (*trust service provider*) : organisation qui fournit des services tels que certificats et horodatage.
- **Horodatage** (*timestamp*) : attestation, par un tiers, qu'une donnée existait à un instant.
- **Dossier de preuve** (*evidence file*, *audit trail*) : ensemble des éléments qui démontrent la signature.
- **Dispositif de création de signature qualifié** (*qualified signature creation device*) : dispositif certifié, qui protège la clé du signataire.
- **Cachet électronique** (*electronic seal*) : équivalent d'une signature pour une personne morale.

#### Relations de cause à effet

- On signe « le document » plutôt qu'une version figée : le contenu signé change, le litige est assuré.
- On colle une image de signature : aucune preuve d'intégrité, aucune preuve d'identité.
- L'identité n'est pas vérifiée (un lien envoyé par courriel suffit) : le signataire conteste.
- L'horodatage vient de l'horloge du serveur seule : la date est contestable.
- Les certificats expirent sans conservation des preuves de validité : la vérification devient impossible plus tard.

#### Idées reçues

- **« Une signature électronique est une image de ma signature. »** Non. C'est un mécanisme qui lie des données à un signataire et à un document.
- **« Seule la signature qualifiée a une valeur juridique. »** Non. L'article 25, paragraphe 1, prévoit qu'une signature électronique ne peut être privée d'effet juridique et de recevabilité comme preuve au seul motif qu'elle est électronique ou qu'elle ne satisfait pas aux exigences de la signature qualifiée. Son poids se discute ensuite.
- **« Une signature électronique est infalsifiable. »** Non. Elle vaut ce que valent la vérification d'identité et la protection de la clé.

#### Principe clé

Signer, c'est lier une identité vérifiée à une version figée d'un document, avec intention et à un instant, et conserver de quoi le démontrer ; le niveau de signature se choisit selon le risque et le droit applicable.

#### Si vous ne retenez que trois choses

1. Une signature lie une identité vérifiée, un contenu précis (par son empreinte) et un instant.
2. Le niveau (simple, avancée, qualifiée) se choisit selon le risque et la loi applicable.
3. Sans dossier de preuve conservé, la signature perd l'essentiel de sa valeur.

### 3. Explication technique détaillée

#### Les trois niveaux dans l'Union européenne

| Niveau | Exigences (règlement eIDAS) | Moyens typiques | Portée juridique |
|---|---|---|---|
| Simple | Données associées au document et utilisées pour signer (art. 3, point 10) | Case « J'approuve », nom saisi, image | Ne peut être refusée au seul motif qu'elle est électronique (art. 25, §1) ; poids à apprécier |
| Avancée | Exigences de l'art. 26 : liée au signataire, l'identifie, sous son contrôle exclusif, détecte toute modification | Signature cryptographique avec certificat, authentification forte | Même principe ; meilleure force probante |
| Qualifiée | Avancée, plus dispositif qualifié et certificat qualifié (art. 3, point 12) | Certificat qualifié, signature à distance qualifiée | Effet équivalent à celui d'une signature manuscrite (art. 25, §2) |

*Le texte cité est celui du règlement (UE) n° 910/2014 dans sa version d'origine. Le règlement (UE) 2024/1183 l'a modifié (publié au Journal officiel de l'Union européenne le 30 avril 2024, entré en vigueur le 20 mai 2024). La version consolidée n'a pas pu être consultée : relisez-la avant toute décision de conformité. Hors de l'Union, les cadres diffèrent.*

#### Ce que l'on signe : l'empreinte

Une signature cryptographique ne signe pas le fichier entier : elle signe son empreinte (voir [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)).

```text
Signature :     document figé ─► empreinte SHA-256 ─► signature avec la clé privée ─► valeur de signature
Vérification :  document reçu ─► empreinte SHA-256 ──┐
                                                     ├─► contrôle avec la clé publique ─► valide ou invalide
                valeur de signature ─────────────────┘
```

```typescript
import { generateKeyPairSync, sign, verify, createHash } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("ed25519");

function digest(document: Buffer): Buffer {
  return createHash("sha256").update(document).digest();
}

const document = Buffer.from("Certificat de remise en service — F-ABCD — version 3");
const signature = sign(null, digest(document), privateKey);

const intact = verify(null, digest(document), publicKey, signature);
const altered = verify(
  null,
  digest(Buffer.from("Certificat de remise en service — F-ABCD — version 4")),
  publicKey,
  signature,
);
console.log(intact, altered); // true false
```

Ce code illustre le principe (il affiche `true false` à l'exécution). Il ne constitue pas une signature avancée au sens du règlement : il manque la vérification d'identité, le certificat, l'horodatage et le dossier de preuve. Une modification d'un seul caractère change l'empreinte, donc la vérification échoue : l'intégrité est **détectée**, elle n'est pas empêchée.

#### Le dossier de preuve

```json
{
  "signature_id": "sig_5521",
  "document": {
    "file_id": "f_crs_9001",
    "version_no": 1,
    "sha256": "230a18d8c2d7de2fa5886584399fb6467eafa4ad724dd12cd98e5b541d10d0b0"
  },
  "signatory": {
    "user_id": "usr_hugo",
    "role": "quality_manager",
    "authentication": { "method": "password_and_totp", "at": "2026-10-14T09:58:12Z" }
  },
  "statement": "Je certifie que les travaux listés ont été réalisés conformément aux données applicables.",
  "level": "advanced",
  "signed_at": "2026-10-14T09:59:03Z",
  "timestamp_authority": "tsa.example.test",
  "events": ["opened", "scrolled_to_end", "consent_given", "signed"]
}
```

*Les identifiants et l'empreinte sont des valeurs d'exemple. La déclaration est un exemple, pas un texte juridique.*

| Élément du dossier | Pourquoi |
|---|---|
| Identité et méthode d'authentification | Établir qui a signé et avec quel niveau d'assurance (voir [4.5 Authentification multifacteur](04-identite-iam-autorisation.md#45-authentification-multifacteur)) |
| Document, version et empreinte | Établir quoi, de façon vérifiable |
| Texte présenté au signataire | Établir ce qu'il a lu ou accepté |
| Consentement et événements | Établir l'intention et le parcours |
| Horodatage | Établir quand |
| Valeur de signature et certificat | Permettre la vérification technique |
| Version du modèle de document et de l'interface | Expliquer ce qui était affiché |

Les données de connexion (adresse réseau, appareil) sont des données personnelles : on conserve ce qui sert la preuve, et pas davantage (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).

#### Le parcours de signature

Une demande de signature est un flux comme un autre (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche) et [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade)).

| État de la demande | Signification | Suite possible |
|---|---|---|
| `draft` | Document en préparation | `sent` |
| `sent` | Envoyé aux signataires ; **document verrouillé** | `partially_signed`, `declined`, `expired`, `cancelled` |
| `partially_signed` | Une partie des signatures est recueillie | `completed`, `declined`, `expired`, `cancelled` |
| `completed` | Toutes les signatures sont recueillies | Document signé conservé |
| `declined` | Un signataire refuse (avec motif) | Nouveau brouillon éventuel |
| `expired` | Délai dépassé | Nouvelle demande |

Règles utiles :

- **Verrouillage.** Dès l'envoi, le document ne change plus ; une modification crée une nouvelle version et relance le parcours.
- **Ordre.** Séquentiel (un après l'autre) ou parallèle.
- **Droit de signer.** La plateforme vérifie, à l'instant de la signature, que la personne a le droit de signer ce document (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) et [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
- **Délégation.** La signature est personnelle. Signer « pour le compte de » est un acte distinct, explicitement enregistré (voir [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)).
- **Rappels et échéances.** Elles s'appuient sur les mécanismes de tâches (voir [17.8 Élément de travail et boîte de tâches](17-collaboration-communication-travail.md#178-élément-de-travail-et-boîte-de-tâches)).

#### Après la signature

- Le document signé est un **nouveau fichier**, ou une nouvelle version, immuable ; il est épinglé (voir [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)).
- Le dossier de preuve est conservé avec le document, **aussi longtemps que lui** (voir [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)).
- **Validité dans la durée.** Les certificats expirent. Pour qu'une signature reste vérifiable des années plus tard, on conserve avec elle les preuves de validité à la date de signature et un horodatage. Le protocole d'horodatage défini par le RFC 3161 décrit les échanges avec une autorité d'horodatage. Pour les PDF, la norme ETSI EN 319 142-1 définit les signatures PAdES et quatre niveaux de profils qui ajoutent des garanties de validité à long terme.
- **Contrôle régulier.** On revérifie périodiquement un échantillon de documents signés, comme on revérifie les empreintes ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)).

#### Moteur interne ou prestataire

| Option | Atouts | Limites |
|---|---|---|
| Moteur interne (simple, avancée sans certificat qualifié) | Maîtrise du parcours, pas de dépendance | La valeur probante dépend de la qualité des contrôles internes |
| Prestataire de signature | Certificats, horodatage, niveau qualifié disponibles | Dépendance, coût, résidence des données, portabilité (voir [29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité)) |

Avec un prestataire, la plateforme reçoit des notifications d'état par webhook ([7.5 Webhook](07-evenements-automatisation.md#75-webhook)), récupère le document signé et le dossier de preuve, et les conserve dans son propre stockage : elle ne s'en remet pas à la seule conservation du prestataire.

Les clés de signature de la plateforme, quand il y en a, sont protégées par un service de gestion de clés (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).

#### Modes de défaillance

- **Contenu non figé** au moment de la signature.
- **Identité non vérifiée** ou vérifiée trop faiblement pour l'enjeu.
- **Image de signature** présentée comme preuve.
- **Horloge** non fiable.
- **Dossier de preuve perdu**, ou conservé moins longtemps que le document.
- **Certificat expiré** sans élément de validation conservé.
- **Droit de signer non vérifié** : une personne non habilitée signe.
- **Délégation implicite** : un assistant signe avec le compte d'un autre.

**Contre-exemple.** Un bouton « Signer » colle une image de signature sur un PDF modifiable, sans empreinte, sans journal. Un litige éclate : on ne peut démontrer ni qui a signé, ni quelle version, ni quand. Le fichier pouvait être modifié après coup, et rien ne le détecterait.

**Limites.** La valeur juridique d'une signature dépend de la juridiction, du type d'acte (certains actes exigent une forme particulière) et des preuves réunies. La plateforme fournit des preuves techniques ; elle ne donne pas d'avis juridique. Le niveau qualifié exige un prestataire qualifié. Le cadre européen cité ici peut évoluer, notamment avec le règlement (UE) 2024/1183.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | La signature porte sur l'empreinte du contenu |
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | On signe une version précise, épinglée |
| [18.8 Modèles de document et génération de documents](#188-modèles-de-document-et-génération-de-documents) | Le document généré et figé est celui que l'on signe |
| [18.10 Gestion documentaire et cycle de vie du document](#1810-gestion-documentaire-et-cycle-de-vie-du-document) | La signature fait passer un document d'un état à un autre du cycle de vie |
| [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers) | Le dossier de preuve suit la durée de conservation du document |
| [4.5 Authentification multifacteur](04-identite-iam-autorisation.md#45-authentification-multifacteur) | L'authentification multifacteur renforce l'identité du signataire |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | La signature est la forme finale d'une approbation |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Revue, demande de changement et approbation avant la signature |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Exception et preuve : même exigence de traçabilité |

### 5. Application pratique

**Situation initiale.** Alpha Air imprime le certificat de remise en service, le fait signer à la main puis le numérise. Retrouver un certificat prend du temps, et le scan est une image modifiable.

**Problème.** Aucune preuve d'intégrité, aucun lien automatique avec la tâche, une conservation dispersée.

**Application du concept.** La plateforme signe électroniquement le document généré, avec un niveau « avancée », un horodatage et un dossier de preuve.

**Déroulé.**

1. À la clôture de `mt_1042`, la plateforme génère le certificat (voir [18.8 Modèles de document et génération de documents](#188-modèles-de-document-et-génération-de-documents)) et le fige : version 1, empreinte calculée.
2. Hugo reçoit une tâche de signature. Il s'authentifie avec un second facteur et lit le document jusqu'à la fin.
3. La plateforme vérifie son droit de signer (rôle `quality_manager`, base concernée), recueille son consentement et appose la signature avec un horodatage.
4. Le PDF signé et le dossier de preuve sont enregistrés ; le certificat est épinglé dans le dossier de l'aéronef.
5. Un an plus tard, l'auditeur demande une preuve : la plateforme revérifie la signature et recalcule l'empreinte, qui correspondent.

**Résultat.** Le certificat est vérifiable, daté et attribuable, sans papier.

**Limites.** Le niveau choisi vaut ce que valent la vérification d'identité et la protection des clés. Un acte qui exige une signature qualifiée ne se satisfait pas de ce parcours.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que lie une signature électronique ?
2. **Compréhension.** Quels sont les trois niveaux du règlement eIDAS, et en quoi diffèrent-ils ?
3. **Compréhension.** Pourquoi signe-t-on une version figée plutôt que « le document » ?
4. **Pourquoi.** Pourquoi le dossier de preuve compte-t-il autant que la signature elle-même ?
5. **Raisonnement pratique.** Un PDF signé est modifié d'un seul caractère après la signature. Que se passe-t-il à la vérification, et pourquoi ?

#### Réponses

1. Une identité vérifiée, un contenu précis (par son empreinte), une intention et un instant. C'est ce lien qui rend la signature démontrable.
2. La signature simple associe des données au document pour signer ; l'avancée satisfait aux exigences de l'article 26 (liée au signataire, identifie, contrôle exclusif, détection des modifications) ; la qualifiée est une avancée créée par un dispositif qualifié et fondée sur un certificat qualifié, et elle a l'effet d'une signature manuscrite.
3. Parce que « le document » peut changer après la signature : on ne saurait plus ce qui a été signé. Une version figée, désignée par son empreinte, rend le contenu signé démontrable.
4. Parce que la signature seule ne montre pas ce que le signataire a vu, comment il s'est authentifié, ni quand. Le dossier de preuve rassemble ces éléments : sans lui, la signature est difficile à défendre.
5. La vérification échoue. L'empreinte recalculée du document modifié ne correspond plus à celle qui a été signée. La signature n'empêche pas la modification ; elle la rend détectable.

## 18.10 Gestion documentaire et cycle de vie du document

### 1. Comprendre simplement

La **gestion documentaire** (*document management*) est l'ensemble des règles, des rôles et des outils qui organisent la création, le classement, la révision, l'approbation, la diffusion, l'archivage et la suppression des documents d'une organisation. Le **cycle de vie du document** (*document lifecycle*) est la suite des états qu'un document traverse : brouillon, en revue, approuvé, en vigueur, remplacé, retiré, archivé, détruit.

**Pourquoi cela existe.** Dans une organisation réglementée, personne ne doit appliquer une procédure périmée ni ignorer la version applicable. Il faut savoir quelle révision était en vigueur à telle date, qui l'a approuvée, qui l'a lue. Et il faut éviter les copies divergentes.

**Problème résolu.** Garantir que chacun travaille avec la bonne révision d'un document, que les changements sont maîtrisés et que l'historique est démontrable.

**Modèle mental.** Un manuel de maintenance papier à feuillets mobiles : une liste des pages en vigueur, des feuillets révisés qui remplacent les anciens, un registre des révisions et des destinataires, et le retrait des feuillets périmés.

**Où l'analogie s'arrête.** Un manuel papier est localisé et ses copies se comptent. Une copie numérique se duplique sans effort : il faut distinguer les documents **contrôlés** des copies qui ne le sont pas.

**Exemple.** La procédure MP-71 passe de brouillon (Nadia), à en revue (Sophie et Hugo), puis approuvée, en vigueur le 1er novembre. Les techniciens concernés doivent accuser lecture. La révision 4 remplace la révision 3, qui devient « remplacée », puis est archivée.

**Les composants.**

1. le **document contrôlé** : identifiant stable, type, propriétaire ;
2. les **révisions**, chacune liée à une version de fichier ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) ;
3. le **cycle de vie**, machine à états ;
4. les **rôles** : auteur, relecteur, approbateur, propriétaire, lecteurs ;
5. la **date d'effet** et la **date de revue** ;
6. la **diffusion** et l'**accusé de lecture** ;
7. le **classement** : types, métadonnées, relations ;
8. la **liste maîtresse** des documents en vigueur.

**Objectif d'apprentissage :** vous pouvez décrire les états d'un document contrôlé et leurs transitions, expliquer pourquoi une seule révision est en vigueur à la fois, et dire comment l'on répond à « quelle version était applicable le… ? ».

### 2. Connaissances essentielles

#### Définition

- **Gestion documentaire** : ensemble des règles et des moyens qui gouvernent la production, le classement, la révision, l'approbation, la diffusion et la conservation des documents d'une organisation.
- **Cycle de vie du document** : suite des états d'un document, chacun avec des droits, des actions possibles et des conditions de passage à l'état suivant.

#### Idées fondamentales

1. **Un document contrôlé a une identité stable.** Un numéro, des révisions numérotées et un statut.
2. **Une seule révision est en vigueur** pour un document donné, à un instant donné : c'est un invariant (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)).
3. **Le statut gouverne les actions.** Modifier, diffuser, imprimer, supprimer dépendent de l'état.
4. **L'approbation précède l'entrée en vigueur.** La date d'effet n'est pas la date de dépôt.
5. **Les révisions anciennes restent consultables**, clairement marquées comme remplacées.
6. **La diffusion se prouve.** Les documents qui obligent donnent lieu à des accusés de lecture.
7. **Chaque document a un propriétaire.** Sans propriétaire, la revue périodique se perd.

#### Vocabulaire essentiel

- **Document contrôlé** (*controlled document*) : document dont la révision, la diffusion et l'usage sont gouvernés.
- **Révision** (*revision*) : état identifié et approuvé d'un document. Selon les secteurs : révision, édition, émission.
- **Date d'effet** (*effective date*) : date à partir de laquelle une révision s'applique.
- **Remplacement** (*supersession*) : une révision en vigueur cède la place à la suivante.
- **Accusé de lecture** (*acknowledgement*) : trace qu'une personne a pris connaissance d'une révision.
- **Liste maîtresse** (*master list*) : registre des documents et de leur révision en vigueur.
- **Copie non contrôlée** (*uncontrolled copy*) : exemplaire imprimé ou exporté, dont la mise à jour n'est pas suivie.
- **Revue périodique** (*periodic review*) : vérification régulière qu'un document reste valable.

#### Relations de cause à effet

- Il n'y a pas de statut : un brouillon est appliqué comme une procédure.
- Deux révisions sont en vigueur : deux équipes appliquent des règles différentes.
- Il n'y a pas de date d'effet : la procédure s'applique avant que les personnes soient prévenues ou formées.
- Il n'y a pas de revue périodique : des documents périmés restent « en vigueur ».
- Il n'y a pas de liste maîtresse : on ne sait pas répondre à l'auditeur.

#### Idées reçues

- **« Un dossier partagé, c'est de la gestion documentaire. »** Non. Sans statuts, révisions, approbations et accusés, c'est un classement.
- **« La version la plus récente est la version en vigueur. »** Non. La plus récente peut être un brouillon, ou une révision approuvée mais pas encore entrée en vigueur.
- **« Archiver, c'est supprimer. »** Non. Archiver retire de l'usage courant et conserve (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).

#### Principe clé

Un document contrôlé est une suite de révisions dont une seule est en vigueur, gouvernée par un cycle de vie qui sépare écrire, approuver, mettre en vigueur, remplacer et conserver.

#### Si vous ne retenez que trois choses

1. Un document contrôlé a des révisions et un statut, et une seule révision est en vigueur à la fois.
2. L'approbation, la date d'effet et la diffusion sont des étapes distinctes.
3. Sans propriétaire, revue périodique et liste maîtresse, le contrôle se dégrade.

### 3. Explication technique détaillée

#### Le cycle de vie

```text
brouillon ─► en revue ─► approuvé ─► en vigueur ─► remplacé ─► archivé ─► détruit
    ▲            │                        │
    └────────────┘                        └─► retiré ─► archivé
    modifications demandées
```

| De | Vers | Qui | Condition |
|---|---|---|---|
| Brouillon | En revue | Auteur | Métadonnées complètes, version de fichier figée |
| En revue | Approuvé | Approbateurs requis | Toutes les approbations ; l'auteur n'approuve pas son propre document (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) |
| En revue | Brouillon | Relecteur | Modifications demandées, avec motif |
| Approuvé | En vigueur | Système, à la date d'effet | Date atteinte ; diffusion faite si exigée |
| En vigueur | Remplacé | Système | Une nouvelle révision entre en vigueur |
| En vigueur | Retiré | Propriétaire et approbateur | Motif, sans remplaçant |
| Remplacé ou retiré | Archivé | Système | Selon le calendrier de conservation ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) |
| Archivé | Détruit | Système | Fin de conservation et absence de gel légal ([18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers)) |

Ce cycle est une machine à états (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)), dont les approbations suivent [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) et [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation). Il se configure par type de document :

```json
{
  "document_type": "procedure",
  "states": ["draft", "in_review", "approved", "effective", "superseded", "withdrawn", "archived"],
  "required_approvals": [
    { "role": "quality_manager", "count": 1 },
    { "role": "technical_director", "count": 1 }
  ],
  "review_period_months": 24,
  "acknowledgement_required_for": ["technician", "planner"],
  "numbering": { "series": "MP", "revision_format": "numeric" }
}
```

#### Imposer qu'une seule révision soit en vigueur

L'invariant se pose dans la base, pas seulement dans l'interface.

```sql
CREATE TABLE controlled_document (
  tenant_id  uuid NOT NULL,
  id         uuid NOT NULL,
  doc_number text NOT NULL,
  doc_type   text NOT NULL,
  title      text NOT NULL,
  owner_id   uuid NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, doc_number)
);

CREATE TABLE document_revision (
  tenant_id       uuid    NOT NULL,
  document_id     uuid    NOT NULL,
  revision_no     integer NOT NULL,
  file_id         uuid    NOT NULL,
  file_version    integer NOT NULL,
  status          text    NOT NULL CHECK (status IN
                    ('draft','in_review','approved','effective','superseded','withdrawn','archived')),
  effective_from  date,
  effective_to    date,
  next_review_on  date,
  PRIMARY KEY (tenant_id, document_id, revision_no),
  FOREIGN KEY (tenant_id, document_id) REFERENCES controlled_document (tenant_id, id)
);

CREATE UNIQUE INDEX one_effective_revision
  ON document_revision (tenant_id, document_id)
  WHERE status = 'effective';
```

L'index unique partiel interdit deux lignes `effective` pour un même document. Le passage « nouvelle révision en vigueur, ancienne remplacée » se fait dans une **seule transaction** (voir [3.9 Transactions et atomicité](03-crud-runtime-ressources.md#39-transactions-et-atomicité)) : sinon, l'une des deux écritures échoue contre l'index.

#### La liste maîtresse et la question de l'auditeur

« Quelle révision était en vigueur le 12 septembre ? » est une requête à date :

```sql
SELECT d.doc_number, d.title, r.revision_no
  FROM document_revision r
  JOIN controlled_document d
    ON d.tenant_id = r.tenant_id AND d.id = r.document_id
 WHERE r.tenant_id = $1
   AND r.effective_from <= $2
   AND (r.effective_to IS NULL OR $2 < r.effective_to)
 ORDER BY d.doc_number;
```

Le paramètre `$2` est la date demandée. Pour que la réponse soit juste, `effective_from` et `effective_to` doivent être renseignés au moment du changement, jamais réécrits après coup (voir [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

#### Diffusion et accusé de lecture

Quand une révision approuvée entre en vigueur, la plateforme crée, pour chaque personne concernée, une tâche « Lire et accuser réception » (voir [17.8 Élément de travail et boîte de tâches](17-collaboration-communication-travail.md#178-élément-de-travail-et-boîte-de-tâches)), avec une échéance ([17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité)) et des rappels ([17.11 Files enregistrées, modèles de tâche, rappels personnels et vue de charge](17-collaboration-communication-travail.md#1711-files-enregistrées-modèles-de-tâche-rappels-personnels-et-vue-de-charge)). Elle enregistre qui a accusé réception de quelle révision, et quand. La mise en vigueur peut être conditionnée à un taux d'accusés minimum : c'est une décision de produit.

#### Classement et métadonnées

Un document appartient souvent à plusieurs contextes : un manuel, une base, un type d'aéronef. Les **métadonnées** (type, domaine, base, propriétaire, classe de données, mots-clés) classent mieux que des dossiers, qui n'admettent qu'une seule position. Elles alimentent la recherche et ses facettes ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé), [19.3 Pertinence, classement et facettes](19-recherche-analytique-restitution.md#193-pertinence-classement-et-facettes)) et les relations entre documents ([2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)).

#### Revue périodique

À l'entrée en vigueur, `next_review_on` = date d'effet + durée de revue du type. Le propriétaire est rappelé, puis le rappel monte d'un niveau en cas de retard. Une « revue sans changement » est un événement qui reporte la date, sans créer de nouvelle révision.

#### Copies non contrôlées

Un document exporté ou imprimé sort du contrôle. On l'indique : mention « copie non contrôlée — vérifier la révision en vigueur », révision et date d'export visibles, et lien ou code pour vérifier l'actualité (voir [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane) pour le filigrane dynamique).

#### Relations entre documents

Un manuel renvoie à des procédures, qui renvoient à des instructions et à des formulaires. Quand une procédure change, les documents qui la citent sont signalés pour revue : c'est l'analyse d'impact (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)). Les renvois de navigation pointent vers « la révision en vigueur » ; les approbations et les signatures, elles, pointent vers une révision précise.

#### Modes de défaillance

- **Deux révisions en vigueur** : invariant non imposé.
- **Entrée en vigueur sautée** : la date d'effet passe sans diffusion.
- **Revue en retard** : document périmé qui reste valide.
- **Propriétaire parti** : plus personne n'est rappelé.
- **Copies non contrôlées** circulent.
- **Contournement par import** : des statuts changent hors du parcours d'approbation (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)).
- **Métadonnées incohérentes** : le classement se dégrade.

**Contre-exemple.** Un dossier partagé contient `MP-71_final_v2_VRAI.pdf`, `MP-71_final_v3.pdf` et `MP-71_apres_revue.docx`. Personne ne sait lequel est applicable, ni qui l'a approuvé. L'auditeur demande la révision du 12 septembre : on ne peut pas répondre.

**Limites.** Un outil ne remplace pas la discipline de l'organisation. Les exigences documentaires varient selon les secteurs et ne sont pas détaillées ici. Le vocabulaire (révision, édition, émission) change d'un référentiel à l'autre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Chaque révision pointe vers une version de fichier précise |
| [18.8 Modèles de document et génération de documents](#188-modèles-de-document-et-génération-de-documents) | Les documents générés entrent dans le cycle de vie |
| [18.9 Signature électronique](#189-signature-électronique) | La signature accompagne l'approbation |
| [18.11 Conservation et gel légal des fichiers](#1811-conservation-et-gel-légal-des-fichiers) | La conservation et le gel légal régissent la fin du cycle |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Le cycle de vie est une machine à états |
| [6.4 Approbation et escalade](06-workflow-etat-regles.md#64-approbation-et-escalade) | Les approbations et escalades du cycle |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | « Une seule révision en vigueur » est un invariant |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | Les dates d'effet relèvent de la modélisation temporelle |
| [17.8 Élément de travail et boîte de tâches](17-collaboration-communication-travail.md#178-élément-de-travail-et-boîte-de-tâches) | Les accusés de lecture sont des éléments de travail |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Le calendrier de conservation s'applique aux documents archivés |

### 5. Application pratique

**Situation initiale.** Les procédures d'Alpha Air sont des fichiers dans un dossier partagé. Deux bases appliquent des révisions différentes du MP-71, sans que personne ne s'en aperçoive.

**Problème.** Aucun statut, aucune date d'effet, aucune preuve de diffusion.

**Application du concept.** La plateforme introduit le document contrôlé, ses révisions, un cycle de vie à approbations et la liste maîtresse.

**Déroulé.**

1. Nadia crée la révision 4 en brouillon, avec le fichier modifié, puis la soumet en revue.
2. Sophie (qualité) et Hugo (direction technique) approuvent ; l'auteur ne peut pas approuver.
3. La révision 4 est approuvée avec une date d'effet au 1er novembre. Les 40 techniciens et planificateurs concernés reçoivent une tâche d'accusé de lecture.
4. Le 1er novembre, à minuit, une transaction passe la révision 4 en vigueur et la révision 3 en remplacée ; la liste maîtresse est à jour.
5. En mars, l'auditeur demande la révision applicable le 12 septembre : la requête à date répond « révision 3 ».

**Résultat.** Une seule révision applicable, une preuve de diffusion et une réponse immédiate à l'audit.

**Limites.** Les accusés restent déclaratifs : ils prouvent la lecture déclarée, pas la compréhension. La formation éventuelle se traite par un autre parcours.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une version de fichier et une révision d'un document contrôlé ?
2. **Compréhension.** Pourquoi une seule révision doit-elle être en vigueur à la fois, et comment l'impose-t-on ?
3. **Compréhension.** Pourquoi sépare-t-on l'approbation et l'entrée en vigueur ?
4. **Pourquoi.** Pourquoi chaque document doit-il avoir un propriétaire ?
5. **Raisonnement pratique.** La révision 3 est en vigueur du 1er mars au 31 octobre inclus, la révision 4 à partir du 1er novembre. Laquelle est applicable le 12 septembre ? le 31 octobre ? le 1er novembre ?

#### Réponses

1. Une version de fichier est un état technique et immuable d'un objet. Une révision est un état documentaire, identifié, approuvé et daté, avec un statut ; elle pointe vers une version de fichier précise.
2. Pour éviter que deux équipes appliquent des règles différentes. On l'impose dans la base (index unique partiel sur le statut « en vigueur ») et par une transaction unique qui remplace l'ancienne révision et active la nouvelle.
3. Parce que l'approbation valide le contenu, tandis que l'entrée en vigueur dépend d'une date et de la diffusion : il faut laisser aux personnes le temps d'être prévenues et formées avant l'application.
4. Parce que la revue périodique, la réponse aux questions et la décision de retrait ont besoin d'une personne responsable. Sans propriétaire, personne n'est rappelé et le document se périme.
5. Le 12 septembre et le 31 octobre : révision 3. Le 1er novembre : révision 4, car l'intervalle de la révision 3 se termine le 31 octobre inclus, ce qui correspond à `effective_to` = 1er novembre exclu.

## 18.11 Conservation et gel légal des fichiers

### 1. Comprendre simplement

La **conservation** (*retention*) est l'obligation de garder un fichier pendant une durée minimale, puis d'en disposer, c'est-à-dire de le supprimer, de l'anonymiser ou de le transférer aux archives, quand cette durée est écoulée. Le **gel légal** (*legal hold*) suspend toute suppression d'un fichier tant qu'une procédure l'exige, quelle que soit sa durée de conservation normale. L'ensemble forme la fonction *retention and legal hold for files*.

**Pourquoi cela existe.** Certains fichiers doivent être gardés : obligation légale, preuve, audit, litige. D'autres ne doivent pas l'être au-delà du nécessaire : la minimisation des données personnelles l'impose. Ces deux exigences se heurtent. Il faut une règle explicite et automatisée, et une suspension de la suppression quand une procédure est en cours.

**Problème résolu.** Garder le temps nécessaire, ni plus ni moins, et ne rien détruire de ce qui est sous procédure.

**Modèle mental.** Une salle d'archives avec un calendrier d'élimination, et des scellés posés par un juge sur certains cartons : le calendrier s'applique partout, sauf sous scellés.

**Où l'analogie s'arrête.** Dans une salle, le scellé est visible et la porte est unique. Dans une plateforme, une suppression peut venir de plusieurs chemins : un utilisateur, une tâche automatique, une demande d'effacement, la fin d'un contrat, une restauration de sauvegarde. Il faut tous les bloquer.

**Exemple.** Alpha Air conserve ses dossiers de maintenance 5 ans après la clôture (durée d'exemple). Un litige survient avec un loueur : le service juridique place un gel légal sur les fichiers du dossier de F-ABCD. Quand l'échéance des 5 ans arrive, rien n'est supprimé. À la levée du gel, la suppression reprend.

**Les composants.**

1. la **classe de conservation** : durée, déclencheur, disposition ;
2. le **déclencheur** : création, clôture, signature, fin de contrat ;
3. la **date de fin de conservation**, calculée ;
4. le **gel légal** : portée, motif, responsable ;
5. le **moteur de suppression** : suppression logique, puis purge ;
6. les **exceptions** : droit à l'effacement face à une obligation de conservation ;
7. la **preuve** : journal, certificat de suppression ;
8. le **stockage immuable** éventuel, pour les classes réglementées.

**Objectif d'apprentissage :** vous pouvez calculer la fin de conservation d'un fichier, expliquer pourquoi un gel légal l'emporte sur elle, et décrire les chemins par lesquels une suppression doit passer pour être réelle.

### 2. Connaissances essentielles

#### Définition

- **Conservation** : règle qui impose de garder un fichier jusqu'à une date de fin calculée à partir d'un déclencheur, puis qui gouverne sa disposition (suppression, anonymisation, transfert).
- **Gel légal** : suspension de la disposition d'un ensemble de fichiers du fait d'un litige, d'une enquête, d'un audit ou d'une procédure, jusqu'à sa levée explicite.

#### Idées fondamentales

1. **La durée se rattache à une classe, pas à un fichier.** Elle vient du calendrier de conservation (voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).
2. **Le déclencheur compte autant que la durée.** « Cinq ans », à compter de quoi ?
3. **Le gel l'emporte.** Il bloque tous les chemins de suppression, y compris la purge automatique.
4. **Supprimer à échéance est aussi une obligation.** Garder trop longtemps est un risque (voir [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).
5. **Quand les règles se heurtent, on arbitre explicitement.** Le plus long minimum s'applique ; une demande d'effacement est évaluée au regard des exceptions légales.
6. **Supprimer vraiment, c'est supprimer partout.** Versions, dérivés, caches, index, partages, et à terme sauvegardes.
7. **Tout est tracé.** Pose et levée d'un gel, suppression, qui, quand, pourquoi.

#### Vocabulaire essentiel

- **Durée de conservation** (*retention period*) : durée minimale de garde.
- **Déclencheur** (*retention trigger*) : événement qui fait partir la durée.
- **Disposition** (*disposition*) : sort du fichier à l'échéance : suppression, anonymisation, archivage.
- **Suppression logique** (*soft delete*) : marquage comme supprimé, sans effacer les octets.
- **Purge** (*purge*) : effacement réel des octets et de leurs copies.
- **Stockage à écriture unique** (*WORM, write once read many*) : stockage qui interdit modification et suppression pendant une période.
- **Effacement cryptographique** (*crypto-shredding*) : suppression de la clé qui chiffre les données, qui les rend illisibles.
- **Limitation de la conservation** (*storage limitation*) : principe selon lequel les données personnelles ne sont gardées que le temps nécessaire.

#### Relations de cause à effet

- Il n'y a pas de gel : une purge détruit des pièces d'un litige, avec les conséquences juridiques qui en découlent.
- Il n'y a pas de purge à échéance : les données personnelles s'accumulent au-delà du nécessaire.
- La suppression est faite en base mais pas dans le stockage, les dérivés ou l'index : la donnée subsiste.
- Le gel est posé sur le sujet mais pas sur ses versions : des versions sont purgées.
- Le gel n'a ni propriétaire ni date de revue : il devient perpétuel et oublié.

#### Idées reçues

- **« Supprimer un fichier, c'est le supprimer partout. »** Non. Il reste des versions, des dérivés, des caches, des index, des exports et des sauvegardes.
- **« Le droit à l'effacement l'emporte toujours. »** Non. L'article 17, paragraphe 3, du RGPD prévoit des exceptions, notamment le respect d'une obligation légale (point b) et la constatation, l'exercice ou la défense de droits en justice (point e).
- **« Un verrou de stockage suffit comme gel légal. »** Non. Un verrou protège des objets ; le gel est une décision organisationnelle, avec portée, responsable, motif et effet sur les copies et les dérivés.

#### Principe clé

La conservation fixe un plancher et un plafond de durée par classe ; le gel légal suspend la suppression sur tous les chemins ; et chaque suppression, comme chaque gel, laisse une preuve.

#### Si vous ne retenez que trois choses

1. La fin de conservation se calcule à partir d'un déclencheur et d'une durée de classe, et se recalcule si le déclencheur change.
2. Un gel légal bloque toute suppression, sur tous les chemins, jusqu'à sa levée explicite.
3. Une suppression réelle couvre versions, dérivés, caches, index et partages, et se prouve.

### 3. Explication technique détaillée

#### Classe, déclencheur et date de fin

| Classe | Déclencheur | Durée (exemple) | Disposition |
|---|---|---|---|
| Photo de constat | Clôture du constat | 5 ans | Suppression |
| Dossier de remise en service signé | Date de signature | 10 ans | Archivage, puis suppression |
| Journal d'accès aux fichiers | Date de l'événement | 12 mois | Suppression |
| Fichier de candidature | Fin du processus de recrutement | 2 ans | Suppression |

*Ces durées sont des valeurs d'exemple. La durée réelle dépend du droit applicable, du secteur et des contrats : elle se fixe avec le service juridique et se paramètre par tenant (voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).*

```json
{
  "retention_class": "maintenance_record",
  "trigger": "case_closed_at",
  "duration": { "years": 5 },
  "disposition": "delete",
  "grace_period_days": 30,
  "notify_owner_days_before": 60,
  "applies_to": { "subject_types": ["maintenance_task", "finding"] }
}
```

La date de fin se calcule : `retain_until` = date du déclencheur + durée. Pour une clôture le 15 mars 2026 et 5 ans : 15 mars 2031. Si le déclencheur change (le dossier est rouvert), la date est **recalculée** : la conservation ne court plus tant que le dossier est ouvert.

```sql
CREATE TABLE retention_assignment (
  tenant_id        uuid        NOT NULL,
  file_id          uuid        NOT NULL,
  retention_class  text        NOT NULL,
  trigger_at       timestamptz,
  retain_until     timestamptz,
  PRIMARY KEY (tenant_id, file_id),
  FOREIGN KEY (tenant_id, file_id) REFERENCES file_asset (tenant_id, id)
);
```

#### Le gel légal

```sql
CREATE TABLE legal_hold (
  tenant_id    uuid        NOT NULL,
  id           uuid        NOT NULL,
  title        text        NOT NULL,
  reason       text        NOT NULL,
  placed_by    uuid        NOT NULL,
  placed_at    timestamptz NOT NULL,
  released_by  uuid,
  released_at  timestamptz,
  PRIMARY KEY (tenant_id, id)
);

CREATE TABLE legal_hold_item (
  tenant_id  uuid NOT NULL,
  hold_id    uuid NOT NULL,
  file_id    uuid NOT NULL,
  PRIMARY KEY (tenant_id, hold_id, file_id),
  FOREIGN KEY (tenant_id, hold_id) REFERENCES legal_hold (tenant_id, id),
  FOREIGN KEY (tenant_id, file_id) REFERENCES file_asset (tenant_id, id)
);
```

Tant qu'un gel n'est pas levé (`released_at IS NULL`), les fichiers de ses éléments :

- ne peuvent être ni supprimés, ni purgés, par aucun chemin ;
- voient leurs versions conservées : une modification crée une nouvelle version, la version gelée reste ;
- ne voient pas leur durée de conservation produire d'effet ;
- restent lisibles selon les droits habituels.

| Question de conception | Choix courant |
|---|---|
| Portée | Liste explicite de fichiers, ou règle (« tout fichier lié à ce dossier »), évaluée à la pose et mise à jour si la règle est dynamique |
| Qui pose et lève | Un rôle juridique ou conformité ; jamais l'auteur du fichier |
| Visibilité | Restreinte : l'existence d'un gel peut être sensible ; les utilisateurs voient « suppression impossible » |
| Revue | Date de revue et propriétaire, pour éviter le gel oublié |
| Motif | Obligatoire, référence du dossier ou de la demande |

**Fichiers éligibles à la purge.** La requête exclut les fichiers sous gel :

```sql
SELECT r.file_id
  FROM retention_assignment r
 WHERE r.tenant_id = $1
   AND r.retain_until <= now()
   AND NOT EXISTS (
         SELECT 1
           FROM legal_hold_item i
           JOIN legal_hold h
             ON h.tenant_id = i.tenant_id AND h.id = i.hold_id
          WHERE i.tenant_id = r.tenant_id
            AND i.file_id   = r.file_id
            AND h.released_at IS NULL
       );
```

#### Chronologie : conservation et gel

```text
Conservation  ├──── 5 ans après la clôture ─────┤
Gel légal                         ├─────── suppression suspendue ───────┤
Suppression                                                             └─► possible après la levée du gel
```

Le fichier devient éligible à la purge quand la durée est écoulée **et** qu'aucun gel n'est actif. Si le gel est levé après l'échéance, la suppression est possible à la levée, après le délai de grâce.

#### Supprimer réellement : tous les chemins

| Emplacement | Action |
|---|---|
| Objets, toutes versions ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) | Suppression logique, puis purge |
| Dérivés : aperçus, miniatures, copies filigranées ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) | Purge liée |
| Caches de diffusion ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) | Purge, durée de vie courte |
| Index de recherche ([19.4 Chaîne d'indexation, réindexation et fraîcheur de l'index](19-recherche-analytique-restitution.md#194-chaîne-dindexation-réindexation-et-fraîcheur-de-lindex)) | Retrait du document et du texte extrait |
| Liens de partage ([18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane)) | Révocation |
| Rapports instantanés et exports ([19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](19-recherche-analytique-restitution.md#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport)) | Recherche des copies |
| Sauvegardes ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)) | Expiration selon leur propre rétention ; rejeu du journal de suppression après restauration |
| Journaux | Minimisation des noms et des contenus |

**Suppression logique, puis purge.** Le fichier reçoit `deleted_at` ; il disparaît de l'interface ; la purge réelle intervient après un délai de grâce, qui permet de corriger une erreur (voir [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)).

**La purge re-vérifie.** Entre la sélection et l'effacement, un gel peut être posé. La purge ne se fie donc pas à la liste candidate : à l'exécution, pour chaque fichier, elle revérifie dans la même transaction l'absence de gel et l'échéance, puis efface. Elle est idempotente, par lots, et reprenable.

**Sauvegardes et restauration.** Une restauration peut ressusciter des fichiers déjà purgés. La plateforme conserve un journal des suppressions et le **rejoue** après une restauration (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

**Effacement cryptographique.** Quand les données sont chiffrées par clé de tenant ou de fichier, détruire la clé les rend illisibles, y compris dans les sauvegardes (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)). Cela suppose une hiérarchie de clés bien conçue et aucune copie de clé hors du périmètre.

**Preuve de suppression.** À l'échéance, ou à la demande du client (voir [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)), la plateforme produit un certificat : classes concernées, nombre de fichiers, dates, méthode, et ce qui est exclu (gel, sauvegardes en attente d'expiration).

#### Verrous de stockage immuable

Certains services de stockage offrent un verrou d'objet selon le modèle WORM. La documentation d'un grand service d'objets décrit :

- des **périodes de conservation**, fixes ou variables ;
- deux modes : en mode « conformité », une version d'objet protégée ne peut être ni écrasée ni supprimée par aucun utilisateur, y compris le compte racine, et la période ne peut pas être raccourcie ; en mode « gouvernance », des utilisateurs disposant de permissions particulières peuvent la modifier ou supprimer l'objet ;
- des **gels légaux** (*legal holds*), indépendants des périodes de conservation, qui n'ont pas de date d'expiration et restent en place jusqu'à leur retrait explicite ;
- une protection qui s'applique à **une version d'objet** précise et nécessite que le versionnement soit activé.

On s'en sert en défense en profondeur pour les classes réglementées, pas comme seul mécanisme : il ne couvre ni les dérivés ni les index, et il est difficile à défaire. Une erreur de période en mode conformité ne se corrige pas ; la documentation indique que la seule façon de supprimer un objet avant l'échéance dans ce mode est de supprimer le compte. Il faut donc que le contrat de sortie d'un client le prévoie (voir [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)).

#### Conflit avec le droit à l'effacement

Le RGPD reconnaît un droit à l'effacement (article 17, paragraphe 1), avec des exceptions au paragraphe 3 : respect d'une obligation légale (point b), constatation, exercice ou défense de droits en justice (point e). Le principe de limitation de la conservation figure à l'article 5, paragraphe 1, point e. Une demande d'effacement qui porte sur un fichier sous conservation obligatoire ou sous gel légal n'est donc pas exécutée tant que l'exception s'applique : la plateforme le justifie, le trace, limite l'usage du fichier conservé à la finalité de conservation et supprime ce qui n'est pas concerné (voir [20.4 Droits des personnes et gestion du consentement](20-gouvernance-donnees-conformite.md#204-droits-des-personnes-et-gestion-du-consentement)).

Les rôles comptent : le tenant décide en général des finalités et des durées ; la plateforme fournit le mécanisme et applique ses instructions (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

#### Modes de défaillance

- **Course purge et gel** : le gel est posé entre la sélection et l'effacement.
- **Gel incomplet** : versions, dérivés ou copies non couverts.
- **Restauration** qui ressuscite des fichiers supprimés.
- **Mauvais déclencheur** : la durée part de la création, pas de la clôture.
- **Gel oublié** : il bloque la suppression pendant des années.
- **Verrou en mode conformité** posé par erreur.
- **Gel visible de tous** : l'existence d'un litige fuit.

**Contre-exemple.** Une tâche de purge sélectionne à 02:00 les fichiers échus. À 02:05, le service juridique pose un gel. À 02:10, la tâche efface sans revérifier : des pièces d'un litige sont détruites. Il fallait revérifier gel et échéance à l'exécution, dans la même transaction que l'effacement.

**Limites.** Les durées dépendent du droit applicable et du contrat : la plateforme ne les détermine pas. La suppression ne peut être absolue : sauvegardes, journaux et copies chez des tiers subsistent pendant leurs propres durées. Un stockage immuable empêche aussi de corriger une erreur. Les transferts entre juridictions ont leurs propres règles (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.2 Versionnement de fichiers, quotas et niveaux de stockage](#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage) | Versions, niveaux et durées minimales de stockage se composent avec la conservation |
| [18.4 Validation, analyse antimalware et quarantaine](#184-validation-analyse-antimalware-et-quarantaine) | La durée en quarantaine suit sa propre règle, et peut être gelée à des fins de preuve |
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Dérivés et caches suivent le sort de l'original |
| [18.7 Partage externe et filigrane](#187-partage-externe-et-filigrane) | Les partages d'un fichier supprimé sont révoqués |
| [18.9 Signature électronique](#189-signature-électronique) | Le dossier de preuve se conserve aussi longtemps que le document signé |
| [18.10 Gestion documentaire et cycle de vie du document](#1810-gestion-documentaire-et-cycle-de-vie-du-document) | L'archivage et la destruction terminent le cycle de vie documentaire |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Le calendrier de conservation fournit les classes et les durées |
| [20.4 Droits des personnes et gestion du consentement](20-gouvernance-donnees-conformite.md#204-droits-des-personnes-et-gestion-du-consentement) | Les droits des personnes entrent en tension avec la conservation |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Les sauvegardes prolongent la présence des données |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Exception et preuve : la même exigence de traçabilité |

### 5. Application pratique

**Situation initiale.** Alpha Air conserve tout, sans règle. Les fichiers de dossiers clos depuis dix ans occupent de l'espace et contiennent des données personnelles de salariés. Un litige s'ouvre avec le loueur de F-ABCD, et le service juridique craint qu'une personne supprime des pièces.

**Problème.** Pas de conservation par classe, pas de gel, pas de preuve de suppression.

**Application du concept.** La plateforme introduit des classes de conservation, un gel légal et une purge qui revérifie.

**Déroulé.**

1. Le service juridique, avec la direction technique, définit la classe `maintenance_record` : déclencheur « clôture », 5 ans, suppression.
2. À la clôture de `mt_1042`, la plateforme calcule `retain_until` = 15 mars 2031.
3. Le litige s'ouvre : le service juridique pose un gel sur les fichiers du dossier de F-ABCD, avec référence et motif. Les utilisateurs voient « suppression impossible ».
4. Le 15 mars 2031, la purge ne sélectionne pas ces fichiers. Le gel est levé le 10 juin 2031 ; à la purge suivante, après le délai de grâce, les fichiers sont supprimés, avec leurs dérivés et leurs index.
5. La plateforme produit le certificat de suppression : classes, nombre de fichiers, dates, méthode, et mention des sauvegardes qui expirent ensuite.

**Résultat.** Rien n'est détruit pendant la procédure, rien n'est gardé au-delà du nécessaire, et chaque étape est tracée.

**Limites.** Les sauvegardes conservent les fichiers jusqu'à l'expiration de leur propre rétention ; le certificat l'indique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre la conservation et le gel légal ?
2. **Compréhension.** Qu'est-ce qu'un déclencheur de conservation, et pourquoi pèse-t-il autant que la durée ?
3. **Compréhension.** Pourquoi supprimer à l'échéance est-il aussi une obligation ?
4. **Pourquoi.** Pourquoi la purge doit-elle revérifier le gel et l'échéance au moment d'effacer ?
5. **Raisonnement pratique.** Un constat est clos le 15 mars 2026, avec 5 ans de conservation. Un gel est posé le 1er mars 2031 et levé le 10 juin 2031. À quelle date le fichier devient-il éligible à la purge, hors délai de grâce ?

#### Réponses

1. La conservation impose une durée de garde et une disposition à l'échéance ; elle est automatique et propre à une classe. Le gel suspend toute suppression pour un ensemble de fichiers du fait d'une procédure, jusqu'à sa levée explicite, et l'emporte sur la conservation.
2. C'est l'événement à partir duquel la durée court : création, clôture, signature. Une durée de 5 ans n'a pas de sens sans savoir à compter de quand, et un déclencheur mal choisi décale tout.
3. Parce que le principe de limitation de la conservation interdit de garder des données personnelles plus longtemps que nécessaire. Garder sans règle crée aussi des risques de fuite et de coût.
4. Parce qu'un gel peut être posé entre la sélection des fichiers et leur effacement. Sans revérification dans la même transaction, la purge détruit des pièces sous procédure.
5. La fin de conservation est le 15 mars 2031, mais le gel est actif : le fichier ne devient éligible qu'à la levée, le 10 juin 2031. La purge intervient à ce moment, après le délai de grâce.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Fonction de hachage SHA-256 | NIST, *Secure Hash Standard (SHS)*, FIPS 180-4, août 2015 ; NIST a annoncé une révision en 2023 | [Page de la publication, NIST CSRC](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) | 18.1, 18.9 |
| Limites du fractionnement | Amazon S3, *Amazon S3 multipart upload limits* | [Documentation AWS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) | 18.3 |
| Déroulement et facturation du fractionnement | Amazon S3, *Uploading and copying objects using multipart upload* | [Documentation AWS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) | 18.3 |
| URL présignées | Amazon S3, *Download and upload objects with presigned URLs* | [Documentation AWS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) | 18.3, 18.5 |
| Protocole de reprise tus | tus, *Resumable upload protocol*, version 1.0.0 | [tus.io](https://tus.io/protocols/resumable-upload) | 18.3 |
| Reprise d'envoi à l'IETF | *Resumable Uploads for HTTP*, draft-ietf-httpbis-resumable-upload-13, projet de travail | [Datatracker de l'IETF](https://datatracker.ietf.org/doc/draft-ietf-httpbis-resumable-upload/) | 18.3 |
| Envoi de fichiers sûr | OWASP, *File Upload Cheat Sheet* | [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | 18.4, 18.5 |
| Fichier de test antimalware | EICAR, *Anti-Malware Testfile* | [eicar.org](https://www.eicar.org/download-anti-malware-testfile/) | 18.4 |
| En-tête `X-Content-Type-Options` | MDN, *X-Content-Type-Options* | [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) | 18.4, 18.5 |
| En-tête `Content-Disposition` | RFC 6266, juin 2011 | [RFC Editor](https://www.rfc-editor.org/info/rfc6266) | 18.5 |
| Mise en cache HTTP | RFC 9111, *HTTP Caching* (STD 98), 2022 | [RFC Editor](https://www.rfc-editor.org/rfc/rfc9111.html) | 18.5, 18.6 |
| Injection de modèle côté serveur | PortSwigger, *Server-side template injection* | [Web Security Academy](https://portswigger.net/web-security/server-side-template-injection) | 18.8 |
| Format PDF/A | Bibliothèque du Congrès, notice sur la famille PDF/A (ISO 19005) | [Digital Formats, loc.gov](https://www.loc.gov/preservation/digital/formats/fdd/fdd000318.shtml) | 18.8 |
| Signature électronique, définitions et exigences | Règlement (UE) n° 910/2014, articles 3, 25 et 26, texte d'origine | [legislation.gov.uk, publication du règlement](https://www.legislation.gov.uk/eur/2014/910/contents) | 18.9 |
| Modification du cadre eIDAS | Règlement (UE) 2024/1183, publié le 30 avril 2024, en vigueur le 20 mai 2024 | Résultats de recherche et notice d'encyclopédie (sources secondaires) | 18.9 |
| Horodatage | RFC 3161, août 2001, mis à jour par le RFC 5816 | [RFC Editor](https://www.rfc-editor.org/info/rfc3161) | 18.9 |
| Signatures PAdES | ETSI EN 319 142-1, V1.2.1 (2024-01) | Descriptions de catalogue trouvées par recherche ; texte de la norme non lu | 18.9 |
| Verrou d'objet et gel légal du stockage | Amazon S3, *Locking objects with Object Lock* | [Documentation AWS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) | 18.11 |
| Droit à l'effacement | RGPD, article 17 | [gdpr-info.eu](https://gdpr-info.eu/art-17-gdpr/) | 18.11 |
| Limitation de la conservation | RGPD, article 5, paragraphe 1, point e | [gdpr-info.eu](https://gdpr-info.eu/art-5-gdpr/) | 18.11 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Le texte consolidé du règlement eIDAS tel que modifié par le règlement (UE) 2024/1183 : le site officiel n'a pas pu être lu. Les articles 3, 25 et 26 cités viennent du texte d'origine de 2014 ; l'article 25, paragraphe 3, n'a pas été relu.
- Le texte des normes ISO 19005 (PDF/A) et ETSI EN 319 142-1 : seules des descriptions secondaires ont été lues.
- Les signatures d'octets de formats (PNG, JPEG, PDF, ZIP) : citées d'après les spécifications de format connues, sans relecture pendant la rédaction.
- Les comportements propres à chaque réseau de diffusion de contenu (purge, durée de vie, vérification en périphérie) : ils se vérifient auprès du fournisseur retenu.
- Les valeurs chiffrées de limites, de durées, de quotas, de coûts et de seuils : ce sont des valeurs d'exemple, hors celles attribuées explicitement à la documentation d'un service.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; les extraits TypeScript ont été contrôlés syntaxiquement, et l'exemple de signature a été exécuté.
- Les durées de conservation applicables dans un secteur ou un pays donné : elles relèvent du droit applicable et du service juridique.
