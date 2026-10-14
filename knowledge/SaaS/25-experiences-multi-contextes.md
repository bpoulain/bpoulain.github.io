# Module 25 — Expériences multi-contextes : internationalisation, mobile, hors ligne, temps réel

> **Question directrice.** Comment la même plateforme sert-elle des personnes de langues, de régions et de contextes d'usage différents, y compris sans réseau ?

## Présentation du module

**Objectif.** Une plateforme agnostique sert des pays, des langues et des conditions d'usage différents. Le cours traite les fuseaux horaires ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond), [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) et l'accessibilité ([12.2 Design systems](12-produit-ux.md#122-design-systems)) ; il décrit l'état « hors ligne » comme un état d'interface ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) et pose l'exigence d'un fonctionnement hors ligne des tablettes de hangar sans en décrire le mécanisme ([15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne)). Ce module décrit ces mécanismes : l'**internationalisation** (étiquettes de langue, catalogues de messages, pluriels, libellés configurables, formats, tri, écriture de droite à gauche), l'**application mobile** (adaptative, native, web progressive, jetons de notification) et le **travail hors ligne** (stockage local, file de synchronisation, résolution de conflits, rejeu idempotent, périmètre de synchronisation). Le **temps réel** est traité par le module 17 ([17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](17-collaboration-communication-travail.md#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail), [17.13 Compteurs de non-lus et synchronisation de l'état de lecture](17-collaboration-communication-travail.md#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture), [17.15 Présence et édition collaborative](17-collaboration-communication-travail.md#1715-présence-et-édition-collaborative)) et la localisation des modèles de message par [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) : ce module les généralise à l'interface et aux libellés configurables, et n'ajoute que l'articulation du temps réel avec le travail hors ligne.

**Prérequis.** Les métadonnées ([2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées)), la concurrence et le verrouillage optimiste ([3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)), l'idempotence ([3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)), les systèmes de conception ([12.2 Design systems](12-produit-ux.md#122-design-systems)), les états vides et d'erreur ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) et la modélisation temporelle ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

**Un mot, plusieurs sens.** Trois mots changent de sens. Un **paramètre régional** (*locale*) n'est ni un pays ni une langue : c'est une langue accompagnée des préférences qui s'y rattachent (formats, calendrier, tri). La **synchronisation** désigne ici la copie, dans les deux sens, entre un appareil et le serveur ; elle ne se confond pas avec la synchronisation de données entre systèmes d'entreprise ([10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export)). Le **hors ligne** est tantôt un état d'interface que l'on signale ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)), tantôt un mode de fonctionnement prévu dès la conception : ce module traite le second.

**Ordre retenu.** Trois groupes, du texte à l'appareil, puis à la donnée.

```text
Internationalisation  étiquettes de langue ─ catalogues, pluriels, libellés, repli ─ formats, tri, écriture de droite à gauche
Mobile                application adaptative, native, web progressive ─ jetons de notification
Hors ligne            stockage local, file de synchronisation ─ conflits, rejeu idempotent, périmètre
Temps réel            traité par le module 17 ; articulation avec le hors ligne en 25.6
```

| Groupe | Question de l'équipe |
|---|---|
| Internationalisation | Comment un seul produit s'exprime-t-il dans plusieurs langues et plusieurs conventions, y compris pour ce que les clients configurent ? |
| Mobile | Quelle forme d'application choisir, et comment joindre l'appareil sans accumuler de jetons morts ? |
| Hors ligne | Comment travailler sans réseau, puis réconcilier sans rien perdre ni rien dupliquer ? |

**Références.** Les articles, documentations et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Les résultats de mise en forme présentés viennent d'une exécution réelle de l'API d'internationalisation de Node.js ; ils dépendent de la version des données de localisation et peuvent varier.

## Sommaire du module

- [25.1 Internationalisation, localisation et étiquettes de langue](#251-internationalisation-localisation-et-étiquettes-de-langue)
- [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)
- [25.3 Formats régionaux, tri et mise en page de droite à gauche](#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)
- [25.4 Application adaptative, native et web progressive, et cycle de vie des jetons push](#254-application-adaptative-native-et-web-progressive-et-cycle-de-vie-des-jetons-push)
- [25.5 Hors ligne d'abord, stockage local et file de synchronisation](#255-hors-ligne-dabord-stockage-local-et-file-de-synchronisation)
- [25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation)

## 25.1 Internationalisation, localisation et étiquettes de langue

### 1. Comprendre simplement

L'**internationalisation** (*internationalization*, abrégée i18n) est la conception d'un produit pour qu'il puisse être adapté à des langues et à des cultures différentes sans modification de son code. La **localisation** (*localization*, l10n) est cette adaptation : traduire les textes, mais aussi choisir les formats, les unités et les usages d'un marché. Une **étiquette de langue** (*language tag*) est l'identifiant normalisé d'une langue, éventuellement avec son écriture et sa région : `fr`, `fr-CA`, `sr-Latn-RS`. Un **paramètre régional** (*locale*) regroupe une langue et les préférences qui s'y rattachent : formats de nombre et de date, calendrier, tri.

**Pourquoi cela existe.** Une plateforme vendue dans plusieurs pays ne peut pas être refaite pour chacun. Internationaliser une fois, puis localiser pour chaque marché, évite de dupliquer le produit. Et dans une plateforme configurable, une partie des textes affichés (noms de champs, d'états, de vues) appartient aux clients, pas à l'éditeur.

**Problème résolu.** Servir des utilisateurs de langues et de régions différentes avec un seul produit, et ajouter une langue sans développement.

**Modèle mental.** Une prise de courant universelle avec des adaptateurs. Le produit expose une interface stable (l'internationalisation) ; chaque marché a son adaptateur (la localisation).

**Où l'analogie s'arrête.** Un adaptateur de prise est mécanique. Une langue a des règles (pluriels, genres, ordre des mots) qu'on ne remplace pas mot à mot : traduire n'est pas substituer.

**Exemple.** Karim lit l'interface en `fr-FR`. Un auditeur invité d'Alpha Air la lit en `en-GB`. Le partenaire de Casablanca la préfère en arabe (`ar`), qui s'écrit de droite à gauche. La plateforme n'a qu'un code : chacun reçoit ses textes, ses formats et sa mise en page.

**Les composants.**

1. les **étiquettes de langue** normalisées ;
2. les **paramètres régionaux** et leurs préférences ;
3. la **négociation** : choix de la langue servie ;
4. les **ressources externalisées** : textes hors du code ;
5. les **formats** régionaux ([25.3 Formats régionaux, tri et mise en page de droite à gauche](#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)) ;
6. la **chaîne de repli** ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)) ;
7. la **langue du contenu**, distincte de celle de l'interface ;
8. les **tests** d'internationalisation.

**Objectif d'apprentissage :** vous pouvez décrire la différence entre internationalisation et localisation, lire une étiquette de langue, négocier la langue servie et distinguer les langues de l'interface, du contenu et des messages sortants.

### 2. Connaissances essentielles

#### Définition

- **Internationalisation** : conception et développement d'un produit ou d'un contenu qui permettent une localisation aisée.
- **Localisation** : adaptation d'un produit ou d'un contenu aux exigences de langue, de culture et autres d'un marché cible, appelé paramètre régional.
- **Étiquette de langue** : identifiant formé de sous-étiquettes (langue, écriture, région, variantes) selon la norme BCP 47.
- **Paramètre régional** : ensemble de préférences d'un utilisateur attachées à une langue et à une région.

#### Idées fondamentales

1. **L'internationalisation précède la localisation.** On ne localise bien que ce qui a été conçu pour l'être.
2. **Les textes sont des données, pas du code.** Ils vivent dans des catalogues, par langue.
3. **Une langue n'est pas un pays.** `fr` couvre des régions aux usages différents ; `fr-CA` n'est pas `fr-FR`.
4. **Une étiquette se normalise.** Casse canonique, sous-étiquettes valides, sans écriture ni région inutiles.
5. **On négocie la langue.** À partir des préférences de la personne et de ce que le produit propose, avec un repli.
6. **Plusieurs langues coexistent.** Interface, contenu saisi, messages sortants, document produit.
7. **Le contexte de formatage est séparé de la langue.** On peut lire en français et vouloir des dates et une monnaie d'une autre région.

#### Vocabulaire essentiel

- **Internationalisation et localisation** (*internationalization and localization*) : concevoir le produit pour être adaptable, puis l'adapter à un marché.
- **Paramètre régional et étiquette de langue** (*locale and language tag*) : l'ensemble des préférences d'une personne, et l'identifiant normalisé de sa langue.
- **Sous-étiquette** (*subtag*) : composant d'une étiquette de langue : langue, écriture, région, variante.
- **Écriture** (*script*) : système d'écriture, par exemple `Latn` (latin), `Cyrl` (cyrillique), `Hant` (chinois traditionnel).
- **Négociation de langue** (*language negotiation*) : choix, parmi les langues disponibles, de celle qui convient le mieux aux préférences.
- **Consultation** (*lookup*) : appariement qui retourne une seule étiquette, par troncature progressive.
- **Filtrage** (*filtering*) : appariement qui retourne l'ensemble des étiquettes correspondantes.
- **Langue du contenu** (*content language*) : langue des données saisies, par opposition à celle de l'interface.
- **Pseudo-localisation** (*pseudo-localization*) : transformation artificielle des textes pour révéler les textes en dur et les mises en page fragiles.

#### Relations de cause à effet

- Des textes sont écrits en dur dans le code. Chaque langue nouvelle demande de modifier le code, et les corrections de traduction suivent le cycle des versions.
- Le pays est utilisé comme langue. Un utilisateur suisse ou canadien reçoit la mauvaise langue, un voyageur reçoit celle de sa position.
- Les étiquettes sont saisies sans contrôle. `fr_CA`, `FR-ca` et `fr-ca` coexistent, et la recherche d'une traduction échoue pour des raisons de casse.
- Les messages sortants suivent la langue de l'expéditeur. Le destinataire reçoit un courriel dans une langue qu'il ne lit pas.

#### Idées reçues

- **« Internationaliser, c'est traduire. »** Non. La traduction est un des gestes de la localisation. L'internationalisation rend le produit capable de la recevoir : textes externalisés, formats locaux, écritures de droite à gauche.
- **« Une langue par pays. »** Non. Plusieurs langues dans un pays, plusieurs pays pour une langue, plusieurs écritures pour une langue (le serbe s'écrit en cyrillique et en latin).
- **« La langue du navigateur suffit. »** C'est un point de départ, pas une décision : elle ne dit rien de la langue du contenu, ni de la préférence propre à un tenant ou à une personne.

#### Principe clé

On internationalise une fois : textes hors du code, étiquettes normalisées, négociation de langue et chaîne de repli ; puis on localise langue par langue, sans toucher au produit.

#### Si vous ne retenez que trois choses

1. L'internationalisation rend le produit localisable ; la localisation adapte à un marché, bien au-delà de la traduction.
2. Une étiquette de langue se compose de sous-étiquettes normalisées et se négocie par troncature, avec un repli.
3. Interface, contenu et messages sortants ont chacun leur langue, et leur résolution suit une cascade.

### 3. Explication technique détaillée

#### Internationalisation et localisation

La page du W3C sur ces deux notions les définit ainsi : la localisation est l'adaptation d'un produit, d'une application ou d'un contenu aux exigences de langue, de culture et autres d'un marché cible, appelé paramètre régional, que l'on réduit souvent à tort à une traduction ; l'internationalisation est la conception et le développement qui permettent une localisation aisée. Elle précise que l'internationalisation vient en premier, comme étape fondamentale de la conception, et qu'elle recouvre notamment : supprimer les obstacles à la localisation (activer Unicode, ne pas dépendre de textes d'interface écrits en dur), ajouter la prise en charge de fonctions qui n'ont d'usage qu'après localisation (balisage du texte bidirectionnel), prendre en charge les préférences régionales (formats de date et d'heure, calendriers locaux, formats de nombre, systèmes de chiffres) et séparer les éléments localisables du code ou du contenu.

#### Lire une étiquette de langue

La norme BCP 47 (RFC 5646) décrit la structure des étiquettes. D'après le texte, la **sous-étiquette de langue** vient en premier et ne peut pas être omise ; la **sous-étiquette d'écriture** est formée de quatre lettres (norme ISO 15924) ; la **sous-étiquette de région** de deux lettres (ISO 3166-1) ou de trois chiffres (UN M.49), au plus une par étiquette ; viennent ensuite les variantes, les extensions et l'usage privé. L'écriture doit être omise quand elle n'apporte rien : l'islandais s'écrit presque toujours en caractères latins, `is-Latn` est donc redondant ; la région peut de même être omise. Les étiquettes se comparent sans tenir compte de la casse, et l'on affiche par convention la langue en minuscules, l'écriture avec une majuscule initiale et la région en majuscules. L'espace de noms est administré par l'IANA, dans un registre qui est la source des sous-étiquettes valides.

| Étiquette | Signification | Remarque |
|---|---|---|
| `fr` | Français | Sans région : français en général |
| `fr-CA` | Français, tel qu'il est utilisé au Canada | Région : conventions locales |
| `de-AT` | Allemand, tel qu'il est utilisé en Autriche | Exemple de la norme |
| `zh-Hant` | Chinois en écriture traditionnelle | L'écriture distingue deux jeux de caractères |
| `sr-Latn-RS` | Serbe, écrit en alphabet latin, tel qu'il est utilisé en Serbie | Exemple de la norme |
| `ar` | Arabe | Écriture de droite à gauche ([25.3 Formats régionaux, tri et mise en page de droite à gauche](#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)) |

Les données de localisation du consortium Unicode (CLDR) précisent que l'identifiant d'un paramètre régional se compose d'un identifiant de langue (langue, écriture et région facultatives, variantes) et d'extensions facultatives ; que, quand seules l'écriture ou la région sont connues, la langue vaut `und` ; et que `root` désigne le paramètre régional générique, parent de toutes les langues.

Les écritures et régions probables se déduisent par maximisation, ce qui montre ce que « `sr` » sous-entend. Résultats obtenus avec Node.js 26.3.0 (ICU 78.3, CLDR 48.0) :

| Étiquette | Maximisée |
|---|---|
| `fr-FR` | `fr-Latn-FR` |
| `en` | `en-Latn-US` |
| `zh-TW` | `zh-Hant-TW` |
| `sr` | `sr-Cyrl-RS` |

Un `sr` sans écriture est donc cyrillique par défaut : un utilisateur qui lit le serbe en latin doit être identifié par `sr-Latn`. Les étiquettes se **canonisent** à l'enregistrement : `EN-us` devient `en-US` et `zh-hant-tw` devient `zh-Hant-TW` (fonction `Intl.getCanonicalLocales`).

#### Négocier la langue

Le RFC 4647 décrit deux appariements. Le **filtrage** retourne un ensemble, éventuellement vide, d'étiquettes qui correspondent ; la **consultation** retourne exactement une étiquette : la plage est tronquée progressivement par la fin jusqu'à ce qu'une étiquette disponible corresponde, et, si rien ne correspond, une valeur par défaut est retournée. Le texte donne l'exemple de `zh-Hant-CN-x-private1-private2`, qui devient successivement `zh-Hant-CN-x-private1`, `zh-Hant-CN`, `zh-Hant`, `zh`, puis la valeur par défaut. Pour une interface, on veut une langue unique : on utilise la consultation.

```typescript
// Sélection de langue par « consultation » (RFC 4647) : on tronque la plage par la fin.
function lookupLocale(requested: string[], available: string[], fallback: string): string {
  const supported = new Set(available.map((tag) => tag.toLowerCase()));
  for (const range of requested) {
    let tag = range.toLowerCase();
    while (tag.length > 0) {
      if (supported.has(tag)) {
        return available.find((a) => a.toLowerCase() === tag) as string;
      }
      const cut = tag.lastIndexOf("-");
      if (cut < 0) {
        break;
      }
      tag = tag.slice(0, cut);
      // un sous-étiquette d'une seule lettre est retiré avec la précédente (extensions, usage privé)
      if (tag.length > 1 && tag[tag.length - 2] === "-") {
        tag = tag.slice(0, tag.length - 2);
      }
    }
  }
  return fallback;
}
```

Avec les langues disponibles `en`, `fr`, `fr-CA`, `es`, `zh-Hant` et `ar`, et `en` pour défaut : `zh-Hant-CN` donne `zh-Hant` ; `fr-BE` donne `fr` ; la liste `fr-CA, en` donne `fr-CA` ; la liste `pt-BR, es-AR` donne `es` (la première plage échoue, la seconde est tronquée) ; `de-CH` donne `en`, la valeur par défaut ; et `zh-Hant-CN-x-private1` donne `zh-Hant`. *Les données de la plateforme peuvent compléter cette troncature simple par des règles de parenté propres à chaque langue (voir [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)).*

#### Plusieurs langues, plusieurs contextes

| Contexte | Question | Source habituelle | Exemple |
|---|---|---|---|
| Langue de l'interface | Dans quelle langue affiche-t-on les écrans ? | Préférence de la personne, puis organisation, tenant, plateforme | `fr-FR` |
| Région de formatage | Quels formats de nombre, de date, de monnaie ? | Préférence de la personne, souvent déduite de la langue | `fr-CH` |
| Langue du contenu | Dans quelle langue la donnée est-elle saisie ? | Choix de l'auteur, éventuellement multilingue | Constat rédigé en `en` |
| Langue des messages sortants | Dans quelle langue écrit-on au destinataire ? | Préférence du destinataire ([17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation)) | Courriel en `ar` |
| Fuseau horaire | Quelle heure locale affiche-t-on ? | Préférence, organisation, base ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) | `Europe/Paris` |

La résolution suit la cascade de réglages du module 5 ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) : la personne, puis l'organisation, puis le tenant, puis la plateforme.

```json
{
  "tenant_locale_policy": {
    "tenant_id": "ten_airline_01",
    "default_ui_locale": "fr",
    "supported_ui_locales": ["fr", "fr-CA", "en-GB", "ar"],
    "content_locales": ["fr", "en"],
    "formatting_region_from": "user",
    "outbound_message_locale": "recipient_preference"
  }
}
```

```sql
CREATE TABLE user_preference (
  tenant_id         uuid NOT NULL,
  user_id           uuid NOT NULL,
  ui_locale         text,
  formatting_region text,
  time_zone         text,
  PRIMARY KEY (tenant_id, user_id),
  CONSTRAINT ui_locale_shape CHECK (
    ui_locale IS NULL
    OR ui_locale ~ '^[a-z]{2,3}(-[A-Z][a-z]{3})?(-([A-Z]{2}|[0-9]{3}))?$'
  )
);
```

La contrainte ne reconnaît que la forme usuelle (langue, écriture et région facultatives) : la validation complète se fait par une bibliothèque et le registre de l'IANA, et la valeur est canonisée avant l'écriture.

#### Bonnes pratiques d'internationalisation

| Pratique | Raison |
|---|---|
| Unicode (UTF-8) de bout en bout | Toutes les écritures sont représentables ([2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées)) |
| Aucun texte en dur ni dans les images | Le texte doit se traduire sans modifier le code |
| Aucune phrase assemblée par concaténation | L'ordre des mots et les accords varient ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)) |
| Mises en page qui tolèrent des textes plus longs ou plus courts | La longueur change d'une langue à l'autre |
| Identifiants et clés indépendants des libellés | Une clé stable survit à une traduction ou à un renommage |
| Tests avec une pseudo-localisation et une langue de droite à gauche | On révèle les textes en dur et les mises en page fragiles |

**Modes de défaillance.**

- **Textes en dur** dans le code.
- **Pays utilisé comme langue.**
- **Étiquettes non canonisées**, de casse variable.
- **Langue unique** pour l'interface, le contenu et les messages sortants.
- **Tests faits dans une seule langue.**
- **Concaténation de fragments** traduits.

**Contre-exemple.** Une plateforme choisit la langue d'après le pays de l'adresse IP. Un technicien suisse alémanique en déplacement à Lyon reçoit l'interface en français ; un auditeur canadien anglophone à Montréal reçoit le français du Québec, qu'il ne lit pas couramment. Les deux ouvrent un ticket. Une préférence de la personne, négociée avec les langues disponibles, aurait servi les deux.

**Limites.** Chaque langue ajoutée coûte : traduction, relecture, tests, mises à jour. La qualité d'une traduction dépend du contexte donné au traducteur, que la clé seule ne fournit pas. Certaines obligations de langue (documents de maintenance, notices) relèvent du juridique et de la réglementation du secteur, pas de la technique.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | Les métadonnées portent les libellés des champs et des types |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La cascade de configuration résout la langue et la région |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les tâches planifiées respectent le fuseau horaire |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | La modélisation temporelle sépare l'instant et son affichage local |
| [12.2 Design systems](12-produit-ux.md#122-design-systems) | Le système de conception prévoit les textes variables et l'écriture de droite à gauche |
| [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) | La localisation des modèles de message suit la langue du destinataire |
| [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) | Les catalogues, pluriels et libellés configurables prolongent l'étiquette de langue |
| [25.3 Formats régionaux, tri et mise en page de droite à gauche](#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche) | Les formats, le tri et la direction de l'écriture dépendent du paramètre régional |

### 5. Application pratique

**Situation initiale.** Alpha Air ouvre une base partenaire à Casablanca. Une quinzaine de techniciens y travaillent en arabe et en français ; l'interface n'existe qu'en français et en anglais.

**Problème.** Servir ces utilisateurs dans leur langue sans développer une version spécifique, et sans afficher de clés techniques là où des traductions manquent.

**Application du concept.** La plateforme négocie la langue par consultation, avec une politique de langues par tenant, et un repli explicite.

**Déroulé.**

1. La politique du tenant déclare les langues d'interface prises en charge : `fr` (français général), `fr-CA`, `en-GB`, et `ar` (en cours de traduction). Karim, avec `fr-FR`, est servi en `fr` par troncature.
2. Un technicien de Casablanca a pour préférences `ar-MA`, puis `fr-MA`. La consultation tronque `ar-MA` en `ar` : la langue est disponible.
3. Un autre, qui ne précise que `fr-MA`, est servi en `fr` : la région marocaine n'a pas de catalogue propre, et la troncature retombe sur le français général.
4. Les messages sortants suivent la préférence du destinataire : les notifications de tâche partent en arabe pour les premiers, en français pour les seconds ([17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation)).
5. La langue du contenu reste celle de l'auteur : un constat saisi en français garde sa langue, la plateforme ne le traduit pas silencieusement.
6. Les textes manquants en arabe se repliront sur le français, langue par défaut du tenant ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)).

**Résultat.** Les techniciens de Casablanca travaillent dans leur langue dès le lancement de la base, sans version dédiée, et le rapport des textes manquants guide la traduction.

**Limites.** L'arabe demande plus que des textes : une mise en page de droite à gauche et des formats spécifiques ([25.3 Formats régionaux, tri et mise en page de droite à gauche](#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)). Le lancement a été retardé de deux semaines pour les écrans les plus denses.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre internationalisation et localisation ?
2. **Compréhension.** Que signifie `sr-Latn-RS` ?
3. **Compréhension.** Comment fonctionne la consultation selon le RFC 4647 ?
4. **Pourquoi.** Pourquoi distingue-t-on la langue de l'interface, celle du contenu et celle des messages sortants ?
5. **Raisonnement pratique.** Les langues disponibles sont `en`, `fr` et `zh-Hant` ; la préférence est `zh-Hant-TW`, puis `pt-BR`. Quelle langue est servie ? Et pour `pt-BR` seul ?

#### Réponses

1. L'internationalisation est la conception qui rend le produit capable d'être adapté (textes externalisés, formats locaux, Unicode) ; la localisation est l'adaptation à un marché donné (traduction, formats, usages).
2. Le serbe (`sr`), écrit en alphabet latin (`Latn`), tel qu'il est utilisé en Serbie (`RS`).
3. La plage demandée est tronquée progressivement par la fin jusqu'à ce qu'une étiquette disponible corresponde ; si rien ne correspond, on retourne une valeur par défaut définie par l'application.
4. Parce que ce sont trois choix différents : la personne lit l'interface dans sa langue, un contenu a été écrit dans la langue de son auteur, et un message est écrit dans la langue de son destinataire.
5. `zh-Hant`, par troncature de `zh-Hant-TW`. Pour `pt-BR` seul, aucune étiquette ne correspond : on retourne la valeur par défaut du tenant ou de la plateforme.

## 25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli

### 1. Comprendre simplement

Un **catalogue de messages** (*message catalog*) associe, pour chaque langue, une clé stable à un texte. Les **règles de pluriel** (*plural rules*) choisissent la bonne forme d'un texte selon un nombre : la langue décide combien de formes existent. Un **libellé configurable traduisible** (*translatable configuration label*) est le nom d'un élément défini par un tenant ou par un paquet, comme un champ, un état ou une vue, que l'on peut fournir dans plusieurs langues. La **chaîne de repli** (*fallback chain*) est l'ordre dans lequel on cherche un texte quand la traduction demandée manque.

**Pourquoi cela existe.** Écrire « 3 constats » ou « 1 constat » semble simple, mais ce n'est pas le même mécanisme dans toutes les langues : le russe a trois formes, l'arabe six, le japonais une seule. Et dans une plateforme configurable, beaucoup de libellés ne sont pas ceux du produit : un tenant crée un champ « Niveau de corrosion », qui doit être lisible par ses utilisateurs dans leur langue.

**Problème résolu.** Afficher à chacun des textes grammaticalement corrects, y compris pour les éléments que le client a configurés, et ne jamais montrer une clé technique à une personne.

**Modèle mental.** Un dictionnaire par langue, indexé par des numéros de page (les clés), accompagné d'un mode d'emploi qui dit, pour chaque langue, quelle forme employer selon la quantité.

**Où l'analogie s'arrête.** Un dictionnaire est fixe. Dans une plateforme configurable, les entrées sont créées par les clients, par les paquets et par les utilisateurs, à tout moment, dans des couches ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)).

**Exemple.** Le message « nombre de constats » a quatre formes en français et en anglais, selon les règles de chaque langue. Le champ configuré `acme.field.finding.corrosion_level` a pour libellés « Niveau de corrosion » en français et « Corrosion level » en anglais. Un utilisateur arabophone, dont la traduction manque, voit le texte français, langue par défaut du tenant, et non la clé.

**Les composants.**

1. les **clés** stables ;
2. les **catalogues** par langue ;
3. le **format de message** avec variables et pluriels ;
4. les **règles de pluriel** de chaque langue ;
5. les **libellés configurables** et leurs couches ;
6. la **chaîne de repli** ;
7. le **rapport des textes manquants** ;
8. le **flux de traduction**.

**Objectif d'apprentissage :** vous pouvez écrire un message avec pluriel, expliquer pourquoi la concaténation est interdite, structurer les libellés d'un élément configurable et définir une chaîne de repli.

### 2. Connaissances essentielles

#### Définition

- **Catalogue de messages** : ensemble des textes d'une langue, indexés par des clés stables.
- **Règles de pluriel** : règles propres à une langue qui associent un nombre à une catégorie de forme : zéro, un, deux, quelques, beaucoup, autre.
- **Libellé configurable traduisible** : texte d'un élément défini à l'exécution, stocké avec une valeur par langue.
- **Chaîne de repli** : suite ordonnée de langues et de sources que l'on parcourt jusqu'à trouver un texte.

#### Idées fondamentales

1. **Une clé est stable, un texte change.** La clé identifie le message ; la traduction peut être corrigée sans toucher au code.
2. **Un message est une phrase entière.** On n'assemble jamais une phrase par concaténation.
3. **La langue décide des formes du pluriel.** Le code ne teste pas « n égale 1 » : il demande la catégorie à la langue.
4. **La catégorie « autre » est obligatoire.** Elle couvre ce que les autres catégories ne couvrent pas.
5. **Les libellés des éléments configurés sont des données.** Ils ont des couches, des langues et des états de traduction.
6. **Le repli est explicite et visible.** On sait quel texte on a servi à la place de quel autre, et l'on rend compte des manques.
7. **Aucune clé n'est jamais affichée à une personne.** Le dernier repli est un texte lisible.

#### Vocabulaire essentiel

- **Catalogue de messages et règles de pluriel** (*message catalog and plural rules*) : les textes d'une langue, et les règles qui en choisissent la forme selon le nombre.
- **Clé de message** (*message key*) : identifiant stable d'un texte, indépendant de sa langue.
- **Variable** (*placeholder*, *argument*) : valeur insérée dans le message : un nombre, un nom.
- **Catégorie de pluriel** (*plural category*) : `zero`, `one`, `two`, `few`, `many`, `other`.
- **Format de message** (*message format*) : syntaxe de message qui exprime variables, pluriels et sélections : ICU MessageFormat, MessageFormat 2.
- **Texte manquant** (*missing translation*) : clé absente dans la langue demandée.
- **Glossaire** (*glossary*) : liste des termes et de leur traduction convenue ([14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent)).
- **Pseudo-traduction** (*pseudo-translation*) : texte artificiel qui révèle les textes non externalisés.

#### Relations de cause à effet

- Le pluriel est codé par « un si n vaut 1, sinon plusieurs ». Le français affiche « 0 constats » et le russe est faux pour 2, 5 et 21.
- Une phrase est assemblée par concaténation de fragments traduits. L'ordre des mots et les accords sont faux dans les langues dont la syntaxe diffère.
- Les libellés des champs configurés n'ont qu'une langue. Les utilisateurs d'une autre langue voient des textes dans une langue qu'ils ne lisent pas, ou une clé.
- Aucun repli n'est défini. Un texte manquant produit un écran vide ou une clé technique.

#### Idées reçues

- **« Deux formes suffisent : singulier et pluriel. »** Non. Les langues ont d'une à six catégories, et leurs règles ne se ramènent pas à « n égale 1 ». Le français range zéro avec le singulier.
- **« Il suffit de traduire les textes du produit. »** Non. Dans une plateforme configurable, une part importante des libellés est créée par les clients et les paquets.
- **« Un repli vers l'anglais est toujours acceptable. »** Non. Le repli le plus utile est la langue par défaut du tenant, puis celle de la plateforme : le client choisit sa langue de travail.

#### Principe clé

Un texte est une clé stable, une phrase entière avec ses variables, dont la forme suit les règles de la langue ; les libellés configurés sont des données traduisibles en couches ; et un repli explicite garantit qu'on lit toujours quelque chose de lisible.

#### Si vous ne retenez que trois choses

1. Les messages sont des phrases entières, identifiées par des clés, avec des formes de pluriel choisies par la langue.
2. Les libellés des éléments configurés sont des données traduisibles, portées par des couches.
3. La chaîne de repli est définie, visible et mesurée ; on n'affiche jamais une clé.

### 3. Explication technique détaillée

#### Un message avec variables et pluriels

La documentation d'ICU MessageFormat décrit le format le plus répandu : les éléments variables sont des arguments entre accolades ; l'argument « pluriel » sélectionne des sous-messages d'après une valeur numérique et les règles de pluriel de la langue ; une variante « autre » est toujours nécessaire ; des valeurs explicites comme `=0` et `=1` sont possibles ; l'argument « sélection » choisit parmi un jeu de mots-clés fixes (par exemple le genre) ; la documentation conseille de placer les sélections à l'extérieur et d'imbriquer les pluriels à l'intérieur, sur un seul niveau si possible ; et une paire d'apostrophes ASCII représente une apostrophe, ce qui demande attention en français. Le format de nouvelle génération, MessageFormat 2, déjà intégré aux bibliothèques ICU, exprime la même chose avec une syntaxe plus lisible :

```text
.input {$count :number}
.match $count
0 {{Aucun constat.}}
one {{1 constat.}}
* {{{$count} constats.}}
```

Dans ce message, le motif `*` désigne la variante par défaut. Le choix de l'une ou l'autre syntaxe dépend des bibliothèques disponibles côté client et serveur.

#### Les catégories de pluriel

Les règles de pluriel proviennent des données de localisation du consortium Unicode (CLDR). Elles désignent des catégories : `zero`, `one`, `two`, `few`, `many` et `other`, cette dernière étant toujours définie. Un tableau des règles de CLDR donne par exemple : en anglais, `one` pour 1 (entier sans partie décimale) et `other` pour le reste ; en français, `one` pour les entiers 0 et 1 (et les décimaux dont la partie entière est 0 ou 1), `many` pour les millions entiers (« 1 000 000 de jours »), `other` pour le reste ; en russe, `one`, `few`, `many` et `other` selon le reste de la division par 10 et par 100 ; en arabe, six catégories ; en japonais, la seule catégorie `other`.

Résultats obtenus avec la fonction `Intl.PluralRules` de Node.js 26.3.0 (CLDR 48.0) :

| Langue | 0 | 1 | 2 | 3 | 5 | 11 | 21 | 1 000 000 |
|---|---|---|---|---|---|---|---|---|
| Anglais | other | one | other | other | other | other | other | other |
| Français | **one** | one | other | other | other | other | other | many |
| Russe | many | one | few | few | many | many | one | many |
| Arabe | zero | one | two | few | few | many | many | other |
| Japonais | other | other | other | other | other | other | other | other |

Deux pièges se lisent dans ce tableau : en français, **zéro** prend la forme du singulier (« 0 constat ») ; en russe, **21** a la forme du singulier. Un code qui teste « n égale 1 » se trompe dans les deux cas.

#### Ne jamais concaténer

| Approche | Exemple | Problème |
|---|---|---|
| Concaténation | `"Il y a " + n + " constat" + (n > 1 ? "s" : "")` | Le pluriel est faux pour 0 et dans d'autres langues ; la phrase ne se traduit pas |
| Fragments | `"Il y a "`, `" constats ouverts"` | Impossible de réordonner pour une autre syntaxe |
| Phrase entière avec variables | `"{count, plural, one {# constat ouvert} other {# constats ouverts}}"` | Le traducteur voit la phrase et choisit ses formes |

Les accords en genre, en cas ou en nombre se traitent de la même façon : par des sélections dans la phrase, jamais par assemblage de morceaux.

#### Où vivent les textes

| Famille | Exemples | Stockage | Qui traduit |
|---|---|---|---|
| Textes d'interface | Boutons, titres, aides | Catalogues livrés avec l'application | L'éditeur |
| Messages d'erreur et de validation | « Champ obligatoire » | Codes stables et paramètres côté serveur, textes côté client ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) | L'éditeur |
| Libellés des éléments configurés | Champ, état, vue, rôle | Données du tenant, par langue | Le tenant, ou le paquet ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) |
| Contenus saisis | Constats, descriptions | Données, dans la langue de l'auteur | L'auteur ou un service de traduction |
| Documents et courriels | Modèles ([17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation), [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents)) | Modèles par langue | L'éditeur, le tenant |

Pour une interface de programmation, les erreurs portent un **code stable** et des **paramètres**, jamais un texte traduit : le client choisit la langue et le texte.

#### Les libellés configurables

```json
{
  "key": "acme.field.finding.corrosion_level",
  "labels": { "fr": "Niveau de corrosion", "en": "Corrosion level" },
  "help": {
    "fr": "Échelle de 0 à 4 selon le manuel de maintenance",
    "en": "Scale from 0 to 4 according to the maintenance manual"
  },
  "options": [
    { "value": "L0", "labels": { "fr": "Aucune", "en": "None" } },
    { "value": "L1", "labels": { "fr": "Superficielle", "en": "Surface" } },
    { "value": "L2", "labels": { "fr": "Modérée", "en": "Moderate" } }
  ],
  "source": { "layer": "pack", "ref": "acme.mro-aviation@2.4.0" }
}
```

La **clé** de composant ne change pas ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) ; les **libellés** sont des données traduisibles. Ils suivent les couches ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) : le paquet livre ses traductions, le tenant les surcharge dans sa couche, et une mise à niveau du paquet n'écrase pas une traduction que le tenant a choisie. Un libellé a un **état de traduction** : traduit, à relire, périmé (le texte source a changé depuis la traduction), manquant.

```sql
CREATE TABLE translatable_label (
  id            uuid PRIMARY KEY,
  tenant_id     uuid NOT NULL,
  component_key text NOT NULL,
  label_key     text NOT NULL,
  UNIQUE (tenant_id, component_key, label_key)
);

CREATE TABLE label_translation (
  id        uuid PRIMARY KEY,
  label_id  uuid NOT NULL REFERENCES translatable_label (id),
  locale    text NOT NULL,
  text      text NOT NULL,
  status    text NOT NULL CHECK (status IN ('translated', 'to_review', 'outdated')),
  UNIQUE (label_id, locale)
);

-- Libellés manquants, par langue d'interface prise en charge
SELECT l.component_key, l.label_key, s.locale
  FROM translatable_label l
  CROSS JOIN (SELECT unnest($2::text[]) AS locale) s
  LEFT JOIN label_translation t ON t.label_id = l.id AND t.locale = s.locale
 WHERE l.tenant_id = $1
   AND t.id IS NULL
 ORDER BY l.component_key, s.locale;
```

Le second paramètre est la liste des langues prises en charge par le tenant. Le rapport alimente un flux de traduction : export vers les traducteurs, import, relecture ; une traduction automatique peut fournir un brouillon, marqué « à relire ».

#### La chaîne de repli

Les données de localisation du consortium Unicode décrivent l'héritage : pour une variante `en_US_someVariant`, la chaîne de recherche par défaut est `en_US_someVariant`, `en_US`, `en`, puis `root`, le parent générique de toutes les langues ; l'héritage n'est pas toujours une simple troncature : un élément `parentLocale` peut changer le parent, par exemple en faisant de `es_419` le parent de `es_AR`. On part de cette chaîne et l'on ajoute les choix du tenant et de la plateforme.

```json
{
  "fallback_policy": {
    "chain": ["requested", "parent_locales", "tenant_default", "platform_default"],
    "tenant_default": "fr",
    "platform_default": "en",
    "on_total_miss": "show_neutral_text_and_report",
    "report_missing": true
  }
}
```

```typescript
type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";
type Message = string | Partial<Record<PluralCategory, string>>;
type Catalog = Record<string, Message>;

function fallbackChain(locale: string, tenantDefault: string, platformDefault: string): string[] {
  const chain: string[] = [];
  let tag = locale;
  while (tag.length > 0) {
    chain.push(tag);
    const cut = tag.lastIndexOf("-");
    tag = cut < 0 ? "" : tag.slice(0, cut);
  }
  for (const extra of [tenantDefault, platformDefault]) {
    if (!chain.includes(extra)) {
      chain.push(extra);
    }
  }
  return chain;
}

function translate(
  catalogs: Record<string, Catalog>,
  key: string,
  locale: string,
  count: number | null,
  tenantDefault = "fr",
  platformDefault = "en",
): string {
  for (const candidate of fallbackChain(locale, tenantDefault, platformDefault)) {
    const message = catalogs[candidate]?.[key];
    if (message === undefined) {
      continue;
    }
    if (typeof message === "string") {
      return message;
    }
    const category = new Intl.PluralRules(candidate).select(count ?? 0) as PluralCategory;
    const template = message[category] ?? message.other;
    if (template !== undefined) {
      return template.replace("{count}", new Intl.NumberFormat(candidate).format(count ?? 0));
    }
  }
  return `[${key}]`;
}
```

Avec un catalogue `en` (`one`, `other`), un catalogue `fr` (`one`, `many`, `other`) et un catalogue `ru` (`one`, `few`, `many`, `other`) pour la clé `finding.count`, la fonction renvoie, pour 0, 1, 2, 5, 21 et 1 000 000 : en anglais `0 findings`, `1 finding`, `2 findings`, `5 findings`, `21 findings`, `1,000,000 findings` ; en français canadien (repli sur `fr`) `0 constat`, `1 constat`, `2 constats`, `5 constats`, `21 constats`, `1 000 000 de constats` ; en russe `0 несоответствий`, `1 несоответствие`, `2 несоответствия`, `5 несоответствий`, `21 несоответствие`, `1 000 000 несоответствий`. Pour l'arabe, dont aucun catalogue n'existe dans l'exemple, la chaîne retombe sur le français du tenant : `3 constats`. Une clé inconnue renvoie `[clé]`, signe d'une erreur à rapporter, jamais à afficher en production : le texte neutre de dernier recours s'affiche à sa place.

**Modes de défaillance.**

- **Pluriel codé en dur** (« n égale 1 »).
- **Concaténation** de fragments.
- **Libellés configurés à langue unique.**
- **Repli absent**, ou clé technique affichée.
- **Texte source modifié** sans marquer les traductions périmées.
- **Aucun rapport** des textes manquants.

**Contre-exemple.** Une plateforme code `n === 1 ? "constat" : "constats"` et assemble « Il y a » + n + « constat(s) ouvert(s) ». Les pages anglaises affichent « Il y a 0 constat(s) ouvert(s) ». Une traduction russe est livrée sans modifier le code : avec une seule forme de pluriel, « 2 несоответствий » et « 21 несоответствий » s'affichent, formes fausses pour ces nombres, et la responsable qualité de la filiale conclut que le produit n'est pas prêt pour sa langue.

**Limites.** Les règles de pluriel couvrent les nombres ; les accords de genre, de cas et de politesse demandent des sélections explicites et des informations que les données ne portent pas toujours (genre d'une personne). Une traduction hors contexte est souvent fausse : il faut fournir au traducteur la description, la capture d'écran et le glossaire. Enfin, les traductions automatiques n'ont pas la rigueur des termes réglementaires : on les relit.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [25.1 Internationalisation, localisation et étiquettes de langue](#251-internationalisation-localisation-et-étiquettes-de-langue) | Les étiquettes de langue et la négociation fournissent la langue demandée |
| [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) | Les modèles de message utilisent le même mécanisme de pluriels et de repli |
| [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances) | Les clés de composants sont stables ; les libellés sont des données |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les traductions suivent les couches du paquet et du tenant |
| [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées) | Les métadonnées portent les libellés |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | Les messages d'erreur sont des codes avec paramètres, traduits côté interface |
| [14.2 Langage omniprésent](14-domain-driven-design.md#142-langage-omniprésent) | Le glossaire du domaine fixe la traduction des termes |
| [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents) | Les modèles de document ont leurs versions linguistiques |

### 5. Application pratique

**Situation initiale.** Alpha Air a configuré, dans son paquet, quarante champs, états et vues avec des libellés en français. Les techniciens de la base de Casablanca travaillent en arabe, les auditeurs en anglais.

**Problème.** Des écrans affichent du français aux arabophones, et des anglophones voient parfois des clés techniques (`acme.state.waiting_parts`). Les compteurs affichent « 1 constats » dans certaines vues.

**Application du concept.** Des libellés configurables traduisibles, des messages à pluriels, et une chaîne de repli explicite.

**Déroulé.**

1. L'équipe remplace tous les messages concaténés par des phrases entières avec pluriels (`finding.count`), et supprime les clés affichées : le dernier repli est un texte neutre.
2. Elle déclare la chaîne de repli : langue demandée, langue parente, français (langue du tenant), anglais (langue de la plateforme).
3. Elle exécute le rapport des libellés manquants : 14 pour l'arabe, 6 pour l'anglais.
4. Sophie fait traduire les 20 libellés ; les traductions sont marquées « à relire », relues par un responsable de la base de Casablanca, puis passées à « traduit ».
5. Une mise à niveau du paquet change le texte source de 3 libellés : leurs traductions passent à l'état « périmé » et reviennent à la relecture.
6. Les compteurs affichent désormais « 0 constat », « 1 constat », « 2 constats » en français.

**Résultat.** Plus aucune clé technique n'est visible ; les 20 libellés manquants sont traités en une semaine, et les textes de repli sont mesurés (taux de repli par langue).

**Limites.** Le repli vers le français pour les arabophones reste un compromis : il est visible et suivi, mais il oblige ces utilisateurs à lire une autre langue pour ces écrans tant que la traduction n'est pas terminée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi écrit-on des phrases entières dans les catalogues plutôt que des fragments ?
2. **Compréhension.** Quelles catégories de pluriel existent, et laquelle est toujours obligatoire ?
3. **Compréhension.** Où vivent les libellés d'un champ configuré par un tenant ?
4. **Pourquoi.** Pourquoi le test « n égale 1 » est-il faux en français et en russe ?
5. **Raisonnement pratique.** Un tenant a `fr` pour défaut, la plateforme `en`. Un utilisateur demande `ar-MA` et la clé n'existe qu'en `fr` et `en`. Quelle est la chaîne de repli et quel texte est servi ?

#### Réponses

1. Parce que l'ordre des mots, les accords et les pluriels varient d'une langue à l'autre : un traducteur ne peut ordonner et accorder correctement que s'il voit la phrase entière.
2. `zero`, `one`, `two`, `few`, `many` et `other`. La catégorie `other` est toujours définie : elle couvre les nombres que les autres catégories ne couvrent pas.
3. Dans les données du tenant, ou dans celles d'un paquet qu'il a installé, par langue, avec un état de traduction : le paquet fournit les siens, et le tenant peut les surcharger dans sa couche.
4. En français, 0 prend la forme du singulier ; en russe, 21 prend la forme du singulier et 2 à 4 une troisième forme. Le test « n égale 1 » ne voit que le cas de l'anglais.
5. `ar-MA`, `ar`, puis `fr` (défaut du tenant), puis `en` (défaut de la plateforme). Le texte français est servi, et le manque est rapporté.

## 25.3 Formats régionaux, tri et mise en page de droite à gauche

### 1. Comprendre simplement

Les **formats régionaux** (*number, date and currency formatting*) sont les conventions locales d'écriture des nombres, des dates, des heures et des montants : séparateurs, ordre des éléments, symboles, chiffres. Le **tri** (*collation and sorting*) est l'ordre dans lequel une langue range des textes : où vont « é » ou « ä », où va « z10 » par rapport à « z9 ». La **mise en page de droite à gauche** (*right-to-left layout*) est l'organisation d'une interface pour les écritures qui se lisent de droite à gauche, comme l'arabe et l'hébreu.

**Pourquoi cela existe.** Les mêmes données ne se lisent pas de la même façon partout : `1.234,5` est mille deux cent trente-quatre virgule cinq en Allemagne et une erreur ailleurs ; `03/04/2026` est le 3 avril ou le 4 mars. Une liste triée selon d'autres conventions que celles de la langue paraît fausse. Et une interface qui n'est pas inversée est inutilisable en arabe.

**Problème résolu.** Afficher, saisir et ordonner les données conformément aux attentes locales, sans changer ce que l'on stocke.

**Modèle mental.** Un interprète pour les chiffres et l'ordre : la donnée reste la même (la valeur, l'instant, la monnaie), seule sa présentation change selon celui qui la lit.

**Où l'analogie s'arrête.** L'affichage ne suffit pas. La saisie, l'analyse d'un texte saisi, le tri en base de données, l'export et les documents imprimés doivent suivre les mêmes conventions, ou se contredire.

**Exemple.** Le nombre 1 234 567,891 s'écrit `1,234,567.891` en anglais américain, `1 234 567,891` en français de France (avec des espaces fines insécables), `1.234.567,891` en allemand, `1'234'567.891` en allemand suisse, `12,34,567.891` en hindi (groupes à l'indienne) et avec des chiffres arabes-indiens en arabe d'Égypte. Le 14 octobre 2026 à 8 h 30 UTC s'écrit « 14 octobre 2026 à 10:30 » à Paris et « October 14, 2026 at 10:30 AM » en anglais américain, pour la même heure de Paris.

**Les composants.**

1. la **valeur neutre** stockée ;
2. le **paramètre régional** de présentation ;
3. le **formateur** ;
4. l'**analyseur** de saisie ;
5. le **tri** de la langue ;
6. la **direction** de l'écriture ;
7. la **mise en page** logique ;
8. les **tests** dans plusieurs régions.

**Objectif d'apprentissage :** vous pouvez séparer valeur et présentation, formater et analyser nombres, dates et montants selon la région, trier selon la langue et préparer une mise en page de droite à gauche.

### 2. Connaissances essentielles

#### Définition

- **Format régional** : convention d'écriture, propre à une langue et à une région, d'un nombre, d'une date, d'une heure ou d'un montant.
- **Collation** : règle d'ordre des textes d'une langue.
- **Écriture de droite à gauche** : système d'écriture dont les lignes se lisent de droite à gauche ; le texte y mêle souvent des segments de gauche à droite (nombres, mots latins).

#### Idées fondamentales

1. **On stocke des valeurs neutres, on affiche des formats locaux.** Nombres comme nombres, instants en UTC, montants avec leur code de monnaie.
2. **Les formats ne s'écrivent pas à la main.** Les bibliothèques s'appuient sur les données de localisation (CLDR).
3. **L'analyse suit le format.** Un texte saisi se comprend selon le paramètre régional de la personne ; les interfaces de programmation n'acceptent que des formes neutres.
4. **Le tri dépend de la langue.** Et la base de données doit suivre la même règle que l'interface.
5. **L'écriture de droite à gauche a un ordre logique et un ordre d'affichage.** On stocke dans l'ordre de lecture ; l'affichage est calculé.
6. **La mise en page se décrit en termes logiques.** Début et fin plutôt que gauche et droite.
7. **Le contenu de direction inconnue s'isole.** Un nom ou un identifiant ne doit pas déformer la phrase qui l'entoure.

#### Vocabulaire essentiel

- **Séparateur de groupes** et **séparateur décimal** (*grouping separator*, *decimal separator*) : symboles des milliers et de la virgule.
- **Système de chiffres** (*numbering system*) : jeu de chiffres utilisé : latins, arabes-indiens.
- **Code de monnaie** (*currency code*) : code à trois lettres de la monnaie (EUR, CHF, JPY).
- **Niveau de sensibilité** (*sensitivity*) : degré de différence retenu entre deux textes : de base, accent, casse.
- **Ordre logique** (*logical order*) : ordre dans lequel le texte est lu et stocké.
- **Algorithme bidirectionnel** (*bidirectional algorithm*) : calcul de l'ordre d'affichage d'un texte mêlant les deux directions.
- **Isolat** (*isolate*) : segment dont la direction est traitée à part de son contexte.
- **Propriété logique** (*logical property*) : propriété de style définie relativement au sens de l'écriture.

#### Relations de cause à effet

- Les montants sont formatés par concaténation (`valeur + " €"`). Le symbole est du mauvais côté pour des régions et l'espace est faux.
- Le tri se fait par ordre des codes des caractères. Les lettres accentuées passent après le « z », et les listes de noms paraissent fausses.
- La mise en page est mise à droite par un simple alignement. Les marges, les icônes de navigation et l'ordre des colonnes restent dans le mauvais sens.
- Un identifiant latin est inséré dans une phrase arabe sans isolation. La ponctuation voisine se retrouve du mauvais côté.

#### Idées reçues

- **« ISO 8601 suffit pour les dates. »** C'est un format d'échange et de stockage, pas d'affichage : une personne lit sa date dans son usage.
- **« Trier, c'est comparer des chaînes. »** Non. La comparaison par défaut des chaînes compare des codes ; l'ordre attendu est celui de la langue.
- **« L'écriture de droite à gauche consiste à aligner à droite. »** Non. Elle inverse l'ordre des colonnes, la place des éléments de navigation, la direction de certaines icônes ; et elle ne s'applique ni à tout (les nombres), ni aux logos.

#### Principe clé

On stocke des valeurs neutres et l'on calcule la présentation par la langue et la région de la personne, avec des bibliothèques de localisation : formats, analyse, tri et direction de l'écriture ensemble.

#### Si vous ne retenez que trois choses

1. Valeur neutre stockée, présentation locale calculée : nombres, dates, montants.
2. Le tri et l'analyse de saisie suivent la même langue que l'affichage, y compris en base de données.
3. La mise en page de droite à gauche est une mise en page logique, qui isole le contenu de direction inconnue.

### 3. Explication technique détaillée

#### Valeur neutre et présentation locale

| Donnée | Stockée comme | Affichée par |
|---|---|---|
| Nombre | Nombre ou décimal exact | Formateur de nombre du paramètre régional |
| Instant | Date et heure UTC (ISO 8601) | Formateur de date avec le fuseau de l'utilisateur ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)) |
| Montant | Valeur décimale et code de monnaie | Formateur de monnaie ([27.4 Monnaie et arrondis](27-types-donnees-specialises.md#274-monnaie-et-arrondis)) |
| Pourcentage, unité | Valeur et code d'unité ([27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure)) | Formateur d'unité |
| Texte | Chaîne Unicode et langue du contenu | Tri et casse de la langue |

Le montant et sa monnaie se stockent ensemble ; la langue n'intervient que pour l'écriture. Les règles d'arrondi et de décimales relèvent de [27.4 Monnaie et arrondis](27-types-donnees-specialises.md#274-monnaie-et-arrondis).

#### Nombres, montants et dates

Les résultats ci-dessous viennent d'une exécution de l'API `Intl` de Node.js 26.3.0 (ICU 78.3, CLDR 48.0). Ils illustrent le principe ; ils peuvent varier avec la version des données de localisation.

| Paramètre régional | Nombre 1234567,891 | Chiffres |
|---|---|---|
| `en-US` | `1,234,567.891` | Latins |
| `fr-FR` | `1 234 567,891` (espaces fines insécables) | Latins |
| `fr-CA` | `1 234 567,891` | Latins |
| `fr-CH` | `1'234'567,891` | Latins |
| `de-DE` | `1.234.567,891` | Latins |
| `de-CH` | `1'234'567.891` | Latins |
| `hi-IN` | `12,34,567.891` | Latins |
| `ar` | `1,234,567.891` | Latins |
| `ar-EG` | `١٬٢٣٤٬٥٦٧٫٨٩١` | Arabes-indiens |
| `ar-MA` | `1.234.567,891` | Latins |

Deux enseignements : la **région** compte autant que la langue (l'arabe générique, celui d'Égypte et celui du Maroc n'écrivent pas les nombres de la même façon) ; et les espaces du français sont des **espaces insécables** (U+202F pour le séparateur de groupes), qui font échouer un analyseur naïf et se copient mal.

| Montant 1234,5 | Résultat |
|---|---|
| `fr-FR`, EUR | `1 234,50 €` (espace fine insécable, puis espace insécable avant le symbole) |
| `en-US`, EUR | `€1,234.50` |
| `de-CH`, CHF | `CHF 1'234.50` |
| `ja-JP`, JPY | `￥1,235` (pas de décimales ; le symbole est celui, pleine chasse, de la région) |

| Instant 2026-10-14T08:30:00Z, fuseau `Europe/Paris` | Résultat |
|---|---|
| `en-US` (long) | `October 14, 2026 at 10:30 AM` |
| `en-GB` (long) | `14 October 2026 at 10:30` |
| `fr-FR` (long) | `14 octobre 2026 à 10:30` |
| `de-DE` (long) | `14. Oktober 2026 um 10:30` |
| `ja-JP` (long) | `2026年10月14日 10:30` |
| `ar-EG` (long) | `١٤ أكتوبر ٢٠٢٦ في ١٠:٣٠ ص` |
| `en-US` (court, UTC) | `10/14/26` |
| `fr-FR` (court, UTC) | `14/10/2026` |

La date courte montre le piège : `03/04/2026` a deux lectures. On affiche donc les dates de documents et de contrats avec le mois en toutes lettres, et l'on stocke l'instant en UTC avec le fuseau de l'événement ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond), [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)).

```typescript
function formatForUser(
  value: { amount: number; currency: string; at: Date; timeZone: string },
  locale: string,
): { amount: string; when: string } {
  return {
    amount: new Intl.NumberFormat(locale, { style: "currency", currency: value.currency }).format(value.amount),
    when: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short", timeZone: value.timeZone }).format(value.at),
  };
}
```

Avec un montant de 1 234,50 euros et l'instant de l'exemple, `formatForUser(..., "fr-FR")` renvoie `1 234,50 €` et `14 octobre 2026 à 10:30` ; avec `en-US`, `€1,234.50` et `October 14, 2026 at 10:30 AM`. La fonction ne change pas ; seules les données de localisation changent.

**L'analyse.** Un champ numérique saisi `1.234,5` se comprend avec le paramètre régional de la personne : l'allemand y lit 1 234,5, l'anglais ne le peut pas. L'interface convertit la saisie en valeur neutre avant l'envoi ; l'interface de programmation n'accepte que la forme neutre (nombre JSON, date ISO). Un champ qui accepte des espaces insécables ou des séparateurs variés les normalise avant analyse.

#### Le tri

La documentation de l'objet `Intl.Collator` décrit la comparaison de chaînes qui tient compte de la langue : en allemand, `ä` se classe avec `a` ; en suédois, `ä` est une lettre distincte qui vient après `z`. Résultats obtenus avec Node.js 26.3.0 sur la liste `zebra`, `ärger`, `apple`, `Zebra`, `äpfel`, `z10`, `z9` :

| Tri | Résultat |
|---|---|
| Par défaut (codes des caractères) | `Zebra`, `apple`, `z10`, `z9`, `zebra`, `äpfel`, `ärger` |
| Allemand | `äpfel`, `apple`, `ärger`, `z10`, `z9`, `zebra`, `Zebra` |
| Suédois | `apple`, `z10`, `z9`, `zebra`, `Zebra`, `äpfel`, `ärger` |
| Français, option numérique | `äpfel`, `apple`, `ärger`, `z9`, `z10`, `zebra`, `Zebra` |

Pour des prénoms français, le tri par défaut donne `Adèle, Zoé, Zélie, Émile, Éric, Étienne` (les É après le Z) ; celui du français donne `Adèle, Émile, Éric, Étienne, Zélie, Zoé`. L'option de sensibilité « de base » rend `e` et `É` égaux ; l'option « variante » les distingue.

**En base de données.** La documentation de PostgreSQL définit une collation comme un objet qui associe un nom à des paramètres régionaux fournis par des bibliothèques du système ; elle distingue les fournisseurs (la bibliothèque C du système et ICU), précise que la collation d'un `ORDER BY` est celle de la clé de tri, et décrit les collations non déterministes, qui rendent égaux des textes de séquences d'octets différentes (comparaison insensible à la casse ou aux accents), au prix d'une dégradation des performances et de certaines opérations impossibles.

```sql
SELECT full_name
  FROM technician
 WHERE tenant_id = $1
 ORDER BY full_name COLLATE "fr_FR";

CREATE COLLATION case_insensitive (
  provider = icu,
  locale = 'und-u-ks-level2',
  deterministic = false
);
```

Le tri de la base et celui de l'interface doivent se correspondre : une liste paginée par curseur ([10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)) dont la clé de curseur suit un autre ordre que celui affiché saute ou répète des lignes. La recherche en texte libre applique ses propres règles de normalisation ([19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation)).

#### L'écriture de droite à gauche

L'annexe 9 de la norme Unicode décrit l'algorithme bidirectionnel. Le texte est stocké dans l'**ordre logique**, celui de la lecture ; l'ordre d'affichage en est dérivé. Le niveau d'imbrication du paragraphe se déduit du premier caractère à direction forte ; les caractères ont un type : forts (gauche à droite, droite à gauche, arabe), faibles (chiffres européens, chiffres arabes), neutres (espaces, ponctuation). Les suites de chiffres se résolvent d'après ces types et, en pratique, gardent leur ordre de lecture de gauche à droite au milieu d'un texte arabe (constat de pratique, à vérifier sur les cas réels). Des caractères de formatage explicites existent (embeddings, isolats, marques invisibles) ; les remplacements de direction sont à éviter pour des raisons de sécurité, et l'annexe recommande de préférer le balisage quand il existe.

L'article du W3C sur le balisage bidirectionnel en ligne donne les règles pratiques en HTML : l'attribut `dir` (`ltr`, `rtl`, `auto`) isole le texte de l'élément de ce qui l'entoure ; `auto` regarde le premier caractère à direction forte ; l'élément `bdi`, sans attribut, se comporte comme `dir="auto"` et convient au texte inséré à l'exécution dont on ne connaît pas la direction ; et le balisage est préférable aux caractères de contrôle, réservés aux endroits où le balisage est impossible, comme les attributs.

```html
<p lang="ar" dir="rtl">الطائرة <bdi>F-ABCD</bdi> بحاجة إلى فحص في قاعدة <bdi>LYS</bdi>.</p>
```

Ici, l'immatriculation et le code de base, de direction « gauche à droite », sont isolés : la phrase arabe garde son ordre et sa ponctuation.

**La mise en page.** La documentation de MDN sur les propriétés logiques de CSS explique que le début d'une ligne n'est pas toujours à gauche : les propriétés logiques définissent des équivalents relatifs au sens de l'écriture, avec les termes « bloc » et « en ligne », et un contenu traduit dans une langue d'un autre mode d'écriture se rend comme prévu.

```css
.task-card {
  padding-inline: 1rem;
  margin-inline-start: 0.5rem;
  border-inline-start: 4px solid var(--severity-color);
  text-align: start;
}
```

Avec ces propriétés, la marge de début est à gauche en français et à droite en arabe, sans règle supplémentaire. Le système de conception ([12.2 Design systems](12-produit-ux.md#122-design-systems)) définit ses composants en termes logiques.

| À inverser | À ne pas inverser |
|---|---|
| Ordre des colonnes, des étapes, des onglets | Les nombres et les identifiants (ordre de lecture propre) |
| Position des éléments de navigation, alignement du texte | Les logos et les marques |
| Icônes de direction (précédent, suivant) | Les images dont le sens est physique |
| Barres de progression | Les contrôles dont la convention est universelle (lecture) |

La dernière colonne est une règle de pratique, non tirée d'une source consultée : on la valide avec des relecteurs qui lisent la langue.

**Les tests.** On exécute l'interface avec la direction forcée à droite-gauche, avec une pseudo-localisation et avec des textes longs ; on vérifie les formulaires (saisie de nombres), les tableaux (colonnes), les graphiques (axes) et les documents imprimés.

**Modes de défaillance.**

- **Formats construits par concaténation.**
- **Tri par codes de caractères.**
- **Dates ambiguës** dans les documents.
- **Analyse de saisie sans paramètre régional.**
- **Mise en page physique** (gauche, droite) dans les composants.
- **Identifiants non isolés** dans du texte de droite à gauche.

**Contre-exemple.** Une plateforme affiche les montants par la concaténation `"€ " + valeur` et trie les noms de techniciens par leurs codes. Les rapports pour la base de Casablanca affichent « € 1234.5 » dans un document destiné à la douane, et la liste alphabétique de 400 noms place tous les « É » après le « Z ». La responsable qualité imprime la liste et la corrige à la main : l'outil ne sert plus à l'usage prévu.

**Limites.** Les données de localisation évoluent (de nouvelles versions changent des séparateurs et des noms) : des résultats peuvent différer entre un navigateur, un serveur et un document généré. Les conventions culturelles dépassent les formats : ordre des noms, adresses, civilités, couleurs, icônes. Et un test d'écriture de droite à gauche par un outil ne remplace pas la relecture par des lecteurs de la langue.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [25.1 Internationalisation, localisation et étiquettes de langue](#251-internationalisation-localisation-et-étiquettes-de-langue) | Le paramètre régional détermine formats, tri et direction |
| [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) | Les messages utilisent les mêmes règles de formatage des variables |
| [13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle) | L'instant est stocké en UTC et affiché dans le fuseau voulu |
| [27.3 Quantités et unités de mesure](27-types-donnees-specialises.md#273-quantités-et-unités-de-mesure) | Les quantités et leurs unités se formatent selon la région |
| [27.4 Monnaie et arrondis](27-types-donnees-specialises.md#274-monnaie-et-arrondis) | Les montants et leur arrondi sont traités à part |
| [12.2 Design systems](12-produit-ux.md#122-design-systems) | Les composants du système de conception sont écrits en termes logiques |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | La pagination et le filtrage suivent le même ordre que l'interface |
| [19.2 Analyse de texte et segmentation](19-recherche-analytique-restitution.md#192-analyse-de-texte-et-segmentation) | La recherche normalise les textes selon ses propres règles |
| [2.14 Index](02-donnees-ressources.md#214-index) | Les index doivent correspondre à la collation utilisée pour trier |

### 5. Application pratique

**Situation initiale.** La base partenaire de Casablanca utilise l'interface en arabe. Les premiers retours signalent des montants affichés à la manière française dans des écrans arabes, des noms mal triés, et des immatriculations qui « sautent » dans les phrases.

**Problème.** Les formats, le tri et la direction de l'écriture sont traités écran par écran, avec des exceptions.

**Application du concept.** Un traitement systématique : valeurs neutres, formateurs de localisation, tri par collation de la langue, mise en page logique et isolation des identifiants.

**Déroulé.**

1. L'équipe supprime les formatages écrits à la main et passe tous les nombres, dates et montants par un formateur unique, paramétré par le paramètre régional de l'utilisateur (`ar-MA`).
2. Les nombres du Maroc s'écrivent avec des chiffres latins, point de milliers et virgule décimale ; ceux d'un utilisateur d'`ar-EG` ou d'`ar-SA` avec des chiffres arabes-indiens : la région choisit.
3. Le tri des noms utilise la collation de la langue de l'utilisateur, en interface et en base.
4. Les composants du système de conception passent aux propriétés logiques ; la direction `rtl` est posée au niveau du document selon la langue.
5. Les immatriculations, codes de base et noms saisis par les utilisateurs sont enveloppés dans des éléments isolés (`bdi`).
6. Des relecteurs de la base valident les écrans les plus utilisés : cartes de tâche, constats, tableau de bord.

**Résultat.** Les écrans d'arabe sont lisibles et cohérents ; les corrections demandées passent de dizaines à quelques cas.

**Limites.** Les documents réglementaires générés (PDF) utilisent un moteur de rendu distinct : les mêmes réglages y ont été reportés en deux semaines. Les données de localisation du serveur et du navigateur diffèrent légèrement, ce qui produit des écarts d'espaces insécables entre l'écran et le PDF.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi stocke-t-on des valeurs neutres et non des textes formatés ?
2. **Compréhension.** Pourquoi le tri par défaut des chaînes ne convient-il pas à une liste de noms ?
3. **Compréhension.** À quoi sert l'élément `bdi` ?
4. **Pourquoi.** Pourquoi préfère-t-on des propriétés CSS logiques aux propriétés physiques ?
5. **Raisonnement pratique.** Une API reçoit `"03/04/2026"` d'un utilisateur de `fr-FR` et d'un utilisateur de `en-US`. Quel est le problème, et que faire ?

#### Réponses

1. Parce que la même valeur doit s'afficher de façon différente selon la personne, être comparée, calculée et exportée sans perte : le texte formaté perd ces propriétés et dépend d'une région.
2. Parce qu'il compare des codes de caractères : les lettres accentuées passent après le « z », et la casse et les accents ne suivent pas les règles de la langue.
3. À isoler un texte de direction inconnue (nom, identifiant inséré à l'exécution) du texte qui l'entoure, pour que l'ordre d'affichage et la ponctuation restent corrects ; sans attribut, il se comporte comme `dir="auto"`.
4. Parce qu'elles s'adaptent au sens de l'écriture : la marge « de début » est à gauche dans une langue de gauche à droite et à droite dans une langue de droite à gauche, avec une seule règle.
5. La chaîne a deux lectures (le 3 avril ou le 4 mars) : le serveur ne peut pas la comprendre sans le paramètre régional. L'interface doit convertir la saisie en valeur neutre (`2026-04-03`) avant l'envoi, et l'API n'accepter que les formes neutres.

## 25.4 Application adaptative, native et web progressive, et cycle de vie des jetons push

### 1. Comprendre simplement

Une **application adaptative** (*responsive web app*) est une application web dont la mise en page s'adapte à la taille et aux capacités de l'écran. Une **application native** (*native app*) est installée depuis une boutique, écrite pour un système (iOS, Android), avec un accès complet à ses fonctions. Une **application web progressive** (*progressive web app*, PWA) est une application web que l'on peut installer sur l'appareil, qui peut fonctionner hors ligne et recevoir des notifications. Le **cycle de vie des jetons push** (*push token lifecycle*) est la vie de l'identifiant qui permet d'envoyer une notification à une installation donnée : obtention, mise à jour, expiration, suppression.

**Pourquoi cela existe.** Le travail se fait sur des écrans très différents : poste de bureau, tablette de hangar, téléphone. Chaque forme d'application coûte différemment à construire, à distribuer et à maintenir. Et une plateforme qui envoie des notifications sans gérer la vie des jetons accumule des identifiants morts, envoie à des appareils qui n'existent plus, et mesure mal ce qu'elle délivre.

**Problème résolu.** Servir plusieurs types d'appareils avec un effort raisonnable, et joindre les personnes de façon fiable.

**Modèle mental.** Trois formats de commerce : un étal adaptable que l'on déploie sur n'importe quel marché (adaptatif), une boutique à demeure qui accède à tout le quartier (native), un étal que l'on peut aussi installer chez soi et qui garde un stock pour quand la route est coupée (PWA).

**Où l'analogie s'arrête.** Les trois formats partagent souvent le même code, la même interface de programmation et les mêmes règles métier : la différence est dans la distribution, l'accès à l'appareil et la persistance locale.

**Exemple.** Les tablettes de hangar d'Alpha Air exécutent l'application en mode installé : une PWA servie par la plateforme, avec stockage local et notifications d'affectation de tâches. Les téléphones des gestionnaires de base utilisent le même code dans un navigateur, en mise en page adaptative.

**Les composants.**

1. la **mise en page adaptative** ;
2. le **manifeste** d'application web ;
3. le **service worker** et le stockage local ;
4. l'**application native** et ses accès à l'appareil ;
5. l'**abonnement de notification** ;
6. l'**enregistrement d'appareil** côté serveur ;
7. les **règles de péremption** et de nettoyage ;
8. la **mesure de la délivrance**.

**Objectif d'apprentissage :** vous pouvez comparer les trois formes d'application, énumérer ce qui rend une PWA installable et décrire le cycle de vie d'un jeton de notification, de son obtention à sa suppression.

### 2. Connaissances essentielles

#### Définition

- **Application adaptative** : application web qui adapte sa mise en page à l'écran.
- **Application native** : application installée, développée pour un système précis, avec accès aux interfaces de l'appareil.
- **Application web progressive** : application web installable, avec manifeste et, le plus souvent, un service worker, qui peut fonctionner hors ligne et envoyer des notifications.
- **Jeton push** : identifiant, délivré par un service de notification, qui désigne une installation et permet à un serveur de lui adresser un message.

#### Idées fondamentales

1. **La forme se choisit par les besoins.** Accès à l'appareil, hors ligne, distribution, notifications, coût.
2. **Le web va loin avant d'exiger du natif.** Installation, hors ligne et notifications existent en web, avec des différences selon les navigateurs.
3. **Une PWA s'installe selon des critères précis.** Manifeste, adresse sécurisée, et les spécificités de chaque navigateur.
4. **Un jeton est un identifiant périssable.** Il change, expire, devient invalide.
5. **Le serveur garde un enregistrement horodaté.** Chaque jeton a une date de dernier signe de vie et un état.
6. **On nettoie.** On retire les jetons invalides ou inactifs, sans attendre.
7. **Une notification n'est pas une livraison garantie.** On conçoit comme si elle pouvait ne pas arriver.

#### Vocabulaire essentiel

- **Application adaptative, native et web progressive** (*responsive, native and progressive web app*) : les trois formes d'application comparées dans ce chapitre.
- **Manifeste d'application web** (*web app manifest*) : fichier JSON qui décrit l'application : nom, icônes, page de départ, mode d'affichage.
- **Service worker** : script du navigateur qui intercepte les requêtes et peut servir des réponses locales.
- **Abonnement** (*push subscription*) : ressource créée par l'appareil auprès du service de notification.
- **Service de notification** (*push service*) : service qui reçoit les messages du serveur et les remet aux appareils.
- **Durée de vie** (*time to live*, TTL) : délai après lequel un message non remis est abandonné.
- **Enregistrement d'appareil** (*device registration*) : fiche côté serveur : jeton, plate-forme, utilisateur, dernière activité.
- **Jeton obsolète** (*stale token*) : jeton dont l'appareil ne s'est pas manifesté depuis la durée choisie.

#### Relations de cause à effet

- Un seul jeton est conservé par utilisateur. Le dernier appareil connecté remplace les autres, et une tablette partagée envoie les notifications d'une personne à la suivante.
- Les jetons ne sont jamais retirés. Les envois partent vers des cibles mortes, les statistiques de délivrance chutent, et les erreurs du service de notification s'accumulent.
- Le contenu complet d'une alerte voyage dans la notification. Des données sensibles transitent par un service tiers et s'affichent sur un écran verrouillé.
- La forme d'application est choisie avant les besoins. On développe du natif pour une fonction que le web permettait, ou l'inverse.

#### Idées reçues

- **« Une PWA remplace toujours une application native. »** Non. Elle couvre beaucoup de cas, mais l'accès à certaines fonctions de l'appareil et la distribution en boutique peuvent exiger du natif ; la prise en charge varie selon les navigateurs.
- **« Une notification arrive toujours. »** Non. Le service peut stocker puis remettre, ou abandonner à l'expiration de la durée de vie ; un appareil éteint ne reçoit rien.
- **« Un jeton, une fois obtenu, est valable pour toujours. »** Non. Il peut changer, expirer ou être invalidé ; le serveur doit le suivre.

#### Principe clé

On choisit la forme d'application par les besoins, on s'appuie sur le web aussi loin que possible, et l'on traite chaque jeton de notification comme un identifiant horodaté, suivi, rafraîchi et retiré.

#### Si vous ne retenez que trois choses

1. Adaptative, PWA et native se distinguent par la distribution, l'accès à l'appareil et la persistance locale, pas par le métier.
2. Une PWA exige un manifeste et une adresse sécurisée ; la prise en charge diffère selon les navigateurs.
3. Un jeton de notification a un cycle de vie : on le date, on le rafraîchit, on retire les invalides et les inactifs.

### 3. Explication technique détaillée

#### Choisir une forme

| Critère | Adaptative (navigateur) | Web progressive (installée) | Native |
|---|---|---|---|
| Distribution | Adresse web | Adresse web, installation, parfois boutiques | Boutiques, déploiement géré |
| Installation | Aucune | Depuis le navigateur | Depuis la boutique |
| Hors ligne | Limité | Service worker et stockage local | Complet |
| Notifications | Selon le navigateur | Selon le navigateur et le système | Complètes |
| Accès à l'appareil | Interfaces web | Interfaces web | Interfaces du système |
| Mises à jour | Immédiates | Immédiates, avec cache à gérer | Par boutique ou déploiement |
| Coût | Une base de code | Une base de code | Une base par système, ou une couche commune |

La page de MDN sur l'installation d'une PWA décrit ce qui la rend installable : un manifeste d'application web, lié depuis chaque page ; pour les navigateurs fondés sur Chromium, les membres `name` ou `short_name`, `icons` (avec des icônes de 192 et 512 pixels), `start_url`, `display` ou `display_override`, et `prefer_related_applications` absent ou faux ; un service par une adresse `https` (ou `localhost` en développement). Un service worker n'est pas une condition d'installation : de nombreuses PWA en utilisent un pour le hors ligne. Les navigateurs diffèrent : Firefox pour ordinateur ne permet pas d'installer par manifeste ; Safari offre « Ajouter au Dock » ; sur Android, Chrome et Samsung Internet installent la PWA comme une application à part entière ; sur iOS, l'installation passe par le menu de partage ; et l'événement `beforeinstallprompt`, qui permet un bouton d'installation personnalisé, n'est pas pris en charge sur iOS.

```json
{
  "name": "Maintenance Alpha Air",
  "short_name": "Maintenance",
  "start_url": "/app/tasks?source=pwa",
  "display": "standalone",
  "lang": "fr",
  "icons": [
    { "src": "/icons/192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icons/512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

**Le stockage.** La page de MDN sur les quotas et l'éviction du stockage précise que les navigateurs gèrent les données par origine ; que, par défaut, les données sont « au mieux » : conservées tant que l'origine est sous son quota, que l'appareil a de la place et que la personne ne les efface pas ; qu'une origine peut demander la persistance (`navigator.storage.persist()`), que Firefox soumet à la personne tandis que Safari et les navigateurs fondés sur Chromium décident d'après l'historique d'interaction ; qu'en cas de manque de place, on évince les origines non persistantes les moins récemment utilisées ; et que Safari, quand la prévention du suivi inter-sites est active, supprime les données créées par script d'une origine sans interaction depuis sept jours. Pour une PWA de travail, on demande donc la persistance, on gère les erreurs de quota, et l'on prévoit que le stockage local puisse disparaître : le serveur reste la source de vérité ([25.5 Hors ligne d'abord, stockage local et file de synchronisation](#255-hors-ligne-dabord-stockage-local-et-file-de-synchronisation)).

#### La notification

La notification Web repose sur le RFC 8030. Trois rôles : l'agent utilisateur (l'appareil), le service de notification et le serveur d'application. L'appareil crée un abonnement ; le serveur envoie ses messages au service par une ressource d'envoi. L'en-tête de **durée de vie** est obligatoire : le service peut conserver le message moins longtemps et ne doit pas le remettre après l'échéance ; une durée nulle ne remet que si l'appareil est joignable immédiatement. L'en-tête d'**urgence** prend les valeurs très basse, basse, normale ou haute. Si l'appareil est hors ligne, le service stocke puis remet au retour. Et le service peut faire expirer un abonnement à tout moment : une requête vers un abonnement expiré reçoit une réponse « introuvable ».

Pour les applications mobiles, les services des systèmes (Firebase Cloud Messaging, service de notification d'Apple) jouent le même rôle. Le guide de Firebase sur la gestion des enregistrements en décrit le cycle de vie :

| Étape | Ce que dit le guide |
|---|---|
| Obtention | Au premier démarrage, la bibliothèque enregistre l'instance de l'application et retourne un identifiant ; le serveur en a besoin pour envoyer |
| Rafraîchissement | Avec l'initialisation automatique, la bibliothèque rafraîchit ; pour d'anciens jetons, le client doit les récupérer et les renvoyer périodiquement : une fois par mois est un bon équilibre, sans bénéfice à faire plus souvent que chaque semaine |
| Stockage | Enregistrer chaque identifiant avec un horodatage, mis à jour à chaque envoi, même si la valeur n'a pas changé |
| Péremption | Par défaut, un enregistrement est périmé si l'instance ne s'est pas connectée depuis un mois ; sous Android, après 270 jours d'inactivité, il est considéré expiré et supprimé ; sous iOS, le service sous-jacent n'a pas d'expiration de 270 jours, donc on retire proactivement |
| Invalidité | Les erreurs « non enregistré » (404) et « argument invalide » (400) peuvent signaler un enregistrement invalide ; une fois la charge utile vérifiée, on peut le supprimer, car il ne sera plus jamais valide |
| Nettoyage | Avant un envoi, vérifier l'horodatage ; exécuter une tâche planifiée (par exemple toutes les 24 heures) qui supprime les enregistrements trop anciens |
| Mesure | Ne considérer que les instances actives pour mesurer la délivrance |

```sql
CREATE TABLE device_registration (
  tenant_id    uuid        NOT NULL,
  device_id    uuid        NOT NULL,
  user_id      uuid,
  platform     text        NOT NULL CHECK (platform IN ('web', 'android', 'ios')),
  push_token   text        NOT NULL,
  app_version  text,
  ui_locale    text,
  last_seen_at timestamptz NOT NULL,
  last_error   text,
  PRIMARY KEY (tenant_id, device_id)
);

-- Nettoyage quotidien : enregistrements invalides ou inactifs
DELETE FROM device_registration
 WHERE last_error = 'UNREGISTERED'
    OR last_seen_at < now() - make_interval(days => $1);

-- Cibles d'une notification : appareils actifs de l'utilisateur
SELECT device_id, platform, push_token
  FROM device_registration
 WHERE tenant_id = $1
   AND user_id = $2
   AND last_error IS NULL
   AND last_seen_at >= now() - make_interval(days => $3);
```

```typescript
type RegistrationStatus = "active" | "stale" | "invalid" | "unlinked";

interface Registration {
  token: string;
  lastSeenAt: string;
  lastProviderError: string | null;
  linkedToUser: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function classify(reg: Registration, now: string, staleAfterDays: number): RegistrationStatus {
  if (!reg.linkedToUser) {
    return "unlinked";
  }
  if (reg.lastProviderError === "UNREGISTERED") {
    return "invalid";
  }
  const idleDays = (Date.parse(now) - Date.parse(reg.lastSeenAt)) / DAY_MS;
  return idleDays > staleAfterDays ? "stale" : "active";
}
```

Au 14 octobre 2026, avec une péremption à 30 jours : un enregistrement vu le 1er octobre est `active` ; vu le 1er août, `stale` ; avec l'erreur `UNREGISTERED`, `invalid` ; et délié de l'utilisateur (déconnexion), `unlinked`.

```text
obtenu ─► actif ─► (aucun signe de vie 30 jours) ─► périmé ─► supprimé par le nettoyage
              │
              ├─► erreur « non enregistré » du service ─► invalide ─► supprimé
              └─► déconnexion de l'utilisateur ─► délié ─► supprimé ou réattribué à la prochaine connexion
```

**Règles de conception.**

| Règle | Raison |
|---|---|
| Un enregistrement par appareil, non par utilisateur | Plusieurs appareils par personne, plusieurs personnes par tablette partagée |
| Délier le jeton à la déconnexion | Éviter l'envoi des notifications d'une personne à la suivante |
| Horodater chaque signe de vie | Seule base fiable pour la péremption |
| Retirer sur erreur définitive du service | Ne plus envoyer à une cible morte |
| Charge utile minimale : un identifiant, pas le contenu | Moins de données chez un tiers et à l'écran verrouillé ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) |
| Appliquer préférences, consentement et heures calmes avant l'envoi | La notification reste un message soumis au choix de la personne ([17.2 Abonnement, suivi et préférences de notification](17-collaboration-communication-travail.md#172-abonnement-suivi-et-préférences-de-notification), [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages), [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes)) |
| Durée de vie et urgence selon la nature du message | Une alerte d'immobilisation d'aéronef n'a pas la même durée de vie qu'un résumé |

**Modes de défaillance.**

- **Un jeton par utilisateur.**
- **Aucun nettoyage** des jetons invalides.
- **Contenu sensible** dans la charge utile.
- **Appareil partagé** non délié à la déconnexion.
- **Forme d'application choisie** avant l'analyse des besoins.
- **Stockage local** supposé permanent.

**Contre-exemple.** Une plateforme enregistre un jeton par utilisateur, écrasé à chaque connexion, et ne supprime jamais les jetons que le service refuse. Une tablette de hangar partagée par trois techniciens reçoit les alertes de tâches du dernier connecté, y compris des détails de constats affichés sur l'écran verrouillé. Le taux de délivrance affiché est de 46 %, parce que les deux tiers des jetons enregistrés ne sont plus valides ; l'équipe cherche une panne du service de notification qui n'existe pas.

**Limites.** Une notification est un signal : le service ne garantit ni la remise ni l'ordre, et le RFC 8030 ne fixe ni période de stockage maximale au-delà de la durée de vie. La prise en charge des fonctions web varie selon les navigateurs et les versions des systèmes : il faut des critères d'acceptation sur les appareils réellement déployés. Enfin, une PWA ne remplace pas un lecteur de codes matériel ou une intégration à un périphérique spécialisé : ces cas exigent parfois une couche native.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.2 Design systems](12-produit-ux.md#122-design-systems) | Le système de conception porte la mise en page adaptative |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | L'état hors ligne et les erreurs sont des états d'interface |
| [15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne) | L'exigence de tablettes hors ligne motive le choix d'une PWA |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | Le service de notifications délivre vers les adaptateurs de canal |
| [17.4 Adaptateurs de canal et statut de livraison](17-collaboration-communication-travail.md#174-adaptateurs-de-canal-et-statut-de-livraison) | Les adaptateurs de canal et le statut de livraison |
| [17.2 Abonnement, suivi et préférences de notification](17-collaboration-communication-travail.md#172-abonnement-suivi-et-préférences-de-notification) | Les préférences de notification s'appliquent avant l'envoi |
| [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes) | La limitation et les heures calmes bornent les envois |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Le service de notification est un sous-traitant à déclarer |
| [25.5 Hors ligne d'abord, stockage local et file de synchronisation](#255-hors-ligne-dabord-stockage-local-et-file-de-synchronisation) | Le service worker et le stockage local portent le mode hors ligne |

### 5. Application pratique

**Situation initiale.** Alpha Air équipe 40 tablettes de hangar, partagées par équipe de quart, pour consulter les cartes de tâches et saisir les constats, dans des zones où le réseau est intermittent. Les gestionnaires de base veulent aussi recevoir les alertes sur leur téléphone.

**Problème.** Un seul code à maintenir pour des tablettes sans réseau stable et des téléphones, avec des notifications fiables sur des appareils partagés.

**Application du concept.** Une application web progressive installée sur les tablettes, la même application en mise en page adaptative sur les téléphones, et un enregistrement d'appareil suivi.

**Déroulé.**

1. L'équipe publie un manifeste conforme (nom, icônes de 192 et 512 pixels, page de départ, mode autonome) ; les tablettes gérées installent l'application depuis l'adresse sécurisée.
2. Elle demande la persistance du stockage local à l'installation, et gère les erreurs de quota ([25.5 Hors ligne d'abord, stockage local et file de synchronisation](#255-hors-ligne-dabord-stockage-local-et-file-de-synchronisation)).
3. À la connexion de chaque technicien, la tablette enregistre un abonnement ; la plateforme le rattache à l'utilisateur ; à la déconnexion, il est délié.
4. Les alertes d'affectation de tâche sont envoyées avec un identifiant seulement ; le détail est lu à l'ouverture, après authentification.
5. Un nettoyage quotidien retire les enregistrements invalides et ceux inactifs depuis 30 jours.
6. Le taux de délivrance est mesuré sur les seuls appareils actifs.

**Résultat.** Le taux de délivrance sur les appareils actifs passe de 46 % à 93 % (valeurs d'exemple) ; aucune alerte n'arrive plus sur la tablette d'une autre personne.

**Limites.** Un lecteur de codes à main n'est pas pris en charge par le navigateur des tablettes : une couche native légère est prévue pour ce seul besoin, en phase 2.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles conditions rendent une PWA installable sur un navigateur fondé sur Chromium ?
2. **Compréhension.** Pourquoi un jeton de notification doit-il être horodaté ?
3. **Compréhension.** Pourquoi délie-t-on un jeton à la déconnexion de l'utilisateur ?
4. **Pourquoi.** Pourquoi une notification n'est-elle pas une livraison garantie ?
5. **Raisonnement pratique.** Une plateforme utilise une péremption de 30 jours. Un jeton a été vu pour la dernière fois il y a 45 jours et n'a jamais renvoyé d'erreur. Que fait-on ?

#### Réponses

1. Un manifeste lié depuis les pages, avec nom, icônes de 192 et 512 pixels, adresse de départ et mode d'affichage ; `prefer_related_applications` absent ou faux ; et un service par adresse sécurisée. Un service worker n'est pas obligatoire pour l'installation.
2. Parce que l'horodatage du dernier signe de vie est la seule base fiable pour décider qu'un jeton est périmé et pour mesurer la délivrance sur les appareils actifs.
3. Parce que, sur un appareil partagé, le jeton continuerait de désigner l'ancien utilisateur : les notifications d'une personne arriveraient à la suivante.
4. Parce que le service de notification peut stocker puis remettre, abandonner à l'expiration de la durée de vie, ou faire expirer un abonnement ; un appareil éteint ou injoignable ne reçoit rien.
5. On le classe périmé et on le retire au prochain nettoyage, même sans erreur du service, puisque l'instance ne s'est pas manifestée depuis plus que la durée choisie ; l'appareil se réenregistrera s'il revient.

## 25.5 Hors ligne d'abord, stockage local et file de synchronisation

### 1. Comprendre simplement

Une application **hors ligne d'abord** (*offline-first*) fonctionne sans réseau pour tout ou partie de ses fonctions essentielles : elle lit et écrit sur des données locales, et synchronise quand le réseau revient. Le **stockage local** (*local store*) est la copie de travail des données sur l'appareil. La **file de synchronisation** (*sync queue*, ou file d'envoi) est la liste ordonnée des changements faits hors ligne qui attendent d'être envoyés au serveur.

**Pourquoi cela existe.** Une partie du travail se fait où le réseau manque : hangars, aires de stationnement, sous-sols, avions. Une application qui attend le réseau pour afficher un écran ou enregistrer un constat bloque le travail et fait perdre la saisie. Un fonctionnement hors ligne d'abord le prévoit dès la conception, au lieu de le traiter comme un cas d'erreur.

**Problème résolu.** Continuer à travailler sans réseau, ne rien perdre de ce qui est saisi, et réconcilier ensuite avec le serveur.

**Modèle mental.** Un carnet de tournée. On y écrit pendant la tournée (le stockage local) ; au retour au bureau, on recopie dans le registre officiel (le serveur), dans l'ordre, en vérifiant chaque entrée.

**Où l'analogie s'arrête.** Un carnet est personnel. Ici, plusieurs personnes modifient les mêmes enregistrements, le registre a pu changer entre-temps, et l'appareil peut être perdu ou volé avec ses données.

**Exemple.** Karim ouvre, dans le hangar de Lyon sans réseau, la carte de tâche `mt_1042` de l'aéronef F-ABCD (`ac_8f3a`). Il consigne le constat `fd_204` avec trois photos et coche quatre étapes. Tout s'écrit en local, et l'écran affiche « 7 modifications en attente ». De retour dans la salle d'escale, avec le réseau, les 7 changements partent dans l'ordre et le compteur revient à zéro.

**Les composants.**

1. le **stockage local**, source de lecture de l'interface ;
2. le **modèle de données local** : version, état de synchronisation ;
3. la **file d'envoi**, durable et ordonnée ;
4. la **boucle de synchronisation** ;
5. le **point de contrôle** des changements reçus ;
6. les **indicateurs** d'état pour la personne ;
7. les **règles de sécurité** : données autorisées, chiffrement, purge ;
8. les **règles de péremption** du stockage.

**Objectif d'apprentissage :** vous pouvez décrire l'architecture d'une application hors ligne d'abord, choisir une stratégie d'écriture par type d'opération et concevoir la file d'envoi et la boucle de synchronisation.

### 2. Connaissances essentielles

#### Définition

- **Hors ligne d'abord** : conception dans laquelle l'application accomplit tout ou un sous-ensemble critique de ses fonctions sans accès à Internet, en lisant et en écrivant d'abord sur des données locales.
- **Stockage local** : base de données ou ensemble de fichiers de l'appareil, qui sert de copie de travail.
- **File de synchronisation** : file durable des opérations locales à envoyer au serveur, avec leur ordre, leurs clés d'idempotence et leur état.

#### Idées fondamentales

1. **Le stockage local est la source de lecture de l'interface.** L'écran ne dépend pas du réseau ; la synchronisation met à jour le stockage, qui met à jour l'écran.
2. **Au minimum, les lectures fonctionnent sans réseau.** Les écritures hors ligne sont un choix, par type d'opération.
3. **Trois stratégies d'écriture.** En ligne seulement, en file, ou paresseuse : on écrit d'abord en local, puis on notifie le serveur.
4. **La file est durable et ordonnée.** Elle survit à la fermeture de l'application et se rejoue sans doublon.
5. **La synchronisation est un protocole.** Pousser les changements locaux, tirer les changements du serveur depuis un point de contrôle.
6. **Le serveur reste l'autorité, et l'état est visible.** Il valide les droits et les règles ; l'appareil propose ; la personne sait ce qui est en attente.
7. **Le stockage local est périssable et sensible.** Il peut être évincé, perdu, volé.

#### Vocabulaire essentiel

- **Stockage local et file de synchronisation** (*local store and sync queue*) : la copie de travail de l'appareil et la liste de ses changements à envoyer.
- **Source de vérité** (*source of truth*) : copie qui fait foi : ici, le serveur pour l'organisation, le stockage local pour l'interface.
- **Écriture paresseuse** (*lazy write*) : écriture locale immédiate, puis mise en file pour le serveur.
- **File d'envoi** (*outbox*) : file des opérations en attente.
- **Point de contrôle** (*checkpoint*, *cursor*) : marque de la dernière position synchronisée.
- **Pierre tombale** (*tombstone*) : marque de suppression conservée pour la propager.
- **Attente exponentielle** (*exponential backoff*) : intervalle de reprise qui croît à chaque échec.
- **Moniteur de connectivité** (*connectivity monitor*) : composant qui détecte le retour du réseau.
- **Éviction** (*eviction*) : suppression de données locales par le système, sous pression de stockage.

#### Relations de cause à effet

- L'interface lit le réseau en premier. Sans réseau, l'écran est vide et la personne ne peut rien consulter.
- Les écritures hors ligne sont gardées en mémoire. La fermeture de l'application, ou une panne de batterie, les fait disparaître.
- La file n'est pas ordonnée par entité. Une modification arrive avant la création qu'elle suppose et échoue.
- Le stockage local est supposé permanent. Le système l'évince, et les changements non synchronisés disparaissent.
- Les droits sont vérifiés seulement à l'ouverture. Une personne qui a perdu l'accès garde des données sur sa tablette.

#### Idées reçues

- **« Hors ligne, c'est du cache. »** Non. Un cache accélère des lectures. Un fonctionnement hors ligne d'abord ajoute des écritures locales, une file, un protocole de synchronisation et une résolution de conflits.
- **« Tout doit fonctionner hors ligne. »** Non. On choisit un sous-ensemble critique : lire les cartes de tâche, saisir des constats ; les approbations qui demandent l'autorité du serveur restent en ligne ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).
- **« L'horloge de l'appareil ordonne les changements. »** Non. Elle peut être fausse ou réglée à la main : l'ordre vient des versions du serveur ([25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation)).

#### Principe clé

L'interface lit et écrit sur un stockage local durable ; une file ordonnée et rejouable transporte les changements ; le serveur valide et réconcilie ; et la personne voit en permanence où elle en est.

#### Si vous ne retenez que trois choses

1. Le stockage local est la source de lecture de l'interface ; la synchronisation le met à jour.
2. Les écritures hors ligne passent par une file durable et ordonnée, avec une stratégie choisie par type d'opération.
3. Le serveur reste l'autorité, et le stockage local est traité comme périssable et sensible.

### 3. Explication technique détaillée

#### L'architecture en couches

```text
Interface  ◄── observe ──  Stockage local  ◄── applique ──  Moteur de synchronisation  ◄── réseau ──►  Serveur
                               ▲                                   │
                               └──── écrit d'abord ────────────────┘ (file d'envoi, point de contrôle)
```

Le guide d'Android sur les applications hors ligne d'abord fixe les principes. Une application de ce type accomplit tout ou un sous-ensemble critique de ses fonctions sans Internet ; elle doit au minimum pouvoir lire sans réseau ; elle a au moins deux sources de données quand elle utilise le réseau, la source locale et la source réseau, et la source locale est la source de vérité de l'application, l'unique source des données que lisent les couches supérieures ; les couches d'interface et de domaine ne communiquent jamais directement avec le réseau ; les lectures sont réactives : l'écriture d'abord en local met à jour les consommateurs, puisque la source locale est observable.

#### Les stratégies d'écriture

Le même guide distingue trois stratégies d'écriture :

| Stratégie | Principe | Quand | Exemple du guide |
|---|---|---|---|
| En ligne seulement | Tenter l'écriture sur le réseau ; mettre à jour le local seulement en cas de succès ; sinon erreur | Opérations quasi temps réel | Un virement bancaire |
| En file | Insérer dans une file ; vider la file avec attente exponentielle au retour du réseau | Données non critiques, non urgentes | Événements d'analyse et journaux |
| Paresseuse | Écrire en local, puis mettre en file la notification du serveur | Données critiques pour l'application ; des conflits sont possibles | Une liste de tâches hors ligne |

Pour la plateforme, la stratégie se choisit par type d'opération :

| Opération | Stratégie | Raison |
|---|---|---|
| Consigner un constat avec photos | Paresseuse | Donnée critique du travail ; elle ne doit pas être perdue |
| Cocher une étape de carte de tâche | Paresseuse | Le travail est fait ; la trace suit |
| Commenter | Paresseuse | Sans conflit en général (ajout) |
| Approuver un constat critique | En ligne seulement | Elle exige des droits et des règles à jour : l'autorité est celle du serveur |
| Envoyer des mesures d'usage | En file | Non urgentes, perte acceptable |

#### Les stratégies de synchronisation

| Stratégie | Principe | Atouts | Limites |
|---|---|---|---|
| Tirer (*pull*) | L'application lit les dernières données au besoin | Simple ; pas de données inutiles | Consommation de données ; ne passe pas bien à l'échelle de données relationnelles |
| Pousser (*push*) | Le stockage local imite un réplica ; le serveur signale ce qui change | Hors ligne indéfini ; peu de données ; bon pour le relationnel | Versionnement pour les conflits ; le serveur doit prendre en charge la synchronisation |
| Hybride | Tirer ou pousser selon la donnée | Adapté à chaque type | Plus de composants à maintenir |

Le guide d'Android précise que le choix dépend des exigences du produit et de l'infrastructure disponible, et recommande des utilitaires de travail persistant : une file de lectures reportées et une file d'écritures reportées, avec attente exponentielle, et un moniteur de connectivité qui déclenche le vidage.

#### Le modèle de données local

```sql
CREATE TABLE local_finding (
  id             text    PRIMARY KEY,
  data           text    NOT NULL,
  server_version integer,
  sync_state     text    NOT NULL CHECK (sync_state IN ('clean', 'dirty', 'conflict')),
  deleted        boolean NOT NULL DEFAULT false
);

CREATE TABLE outbox (
  seq          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  op_id        text   NOT NULL UNIQUE,
  entity_type  text   NOT NULL,
  entity_id    text   NOT NULL,
  base_version integer,
  patch        text   NOT NULL,
  created_at   text   NOT NULL,
  attempts     integer NOT NULL DEFAULT 0,
  status       text   NOT NULL CHECK (status IN ('pending', 'sent', 'rejected', 'conflict'))
);
```

*La syntaxe est celle de PostgreSQL, pour la lisibilité ; les bases locales d'appareils (SQLite par exemple) ont leurs propres notations.* Chaque enregistrement local porte la **version du serveur** sur laquelle il est fondé et son **état** (`clean`, `dirty`, `conflict`). Chaque opération de la file porte un identifiant stable (`op_id`), qui sert de clé d'idempotence ([25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation)), la version de base, le changement (patch) et son état. Les suppressions sont conservées sous forme de pierres tombales jusqu'à confirmation.

#### La boucle de synchronisation

```text
1. Retour du réseau (moniteur de connectivité)
2. Pousser la file, dans l'ordre, par entité
      │ appliqué ─► marque « sent », met à jour la version locale
      │ fusionné  ─► idem, avec les champs fusionnés
      │ conflit   ─► marque « conflict » ; les opérations suivantes de l'entité attendent
      │ rejeté    ─► marque « rejected », avec la raison pour la personne
      │ échec réseau ─► attente exponentielle, reprise
3. Tirer les changements depuis le point de contrôle
4. Appliquer en local, en tenant compte des modifications locales en attente
5. Mettre à jour le point de contrôle
6. Purger ce qui sort du périmètre (voir 25.6)
```

```json
{
  "cursor": "c_000018422",
  "has_more": false,
  "changes": [
    { "type": "finding", "id": "fd_204", "version": 6, "op": "upsert", "data": { "state": "in_review", "severity": "critical" } },
    { "type": "task", "id": "mt_1042", "version": 9, "op": "delete" }
  ]
}
```

La réponse au tirage porte un nouveau **point de contrôle** : l'appareil le garde et le renvoie au prochain tirage. Les suppressions voyagent comme des opérations explicites.

```typescript
interface Operation {
  id: string;
  entityId: string;
  patch: Record<string, unknown>;
  baseVersion: number;
  attempts: number;
}

type SendResult = "ok" | "conflict" | "retry";

function drain(
  queue: Operation[],
  send: (op: Operation) => SendResult,
  maxAttempts: number,
): { done: string[]; conflicts: string[]; pending: string[] } {
  const done: string[] = [];
  const conflicts: string[] = [];
  const pending: string[] = [];
  const blocked = new Set<string>();
  for (const op of queue) {
    if (blocked.has(op.entityId)) {
      pending.push(op.id);
      continue;
    }
    const result = send(op);
    if (result === "ok") {
      done.push(op.id);
    } else if (result === "conflict") {
      conflicts.push(op.id);
      blocked.add(op.entityId);
    } else {
      op.attempts += 1;
      pending.push(op.id);
      if (op.attempts < maxAttempts) {
        blocked.add(op.entityId);
      }
    }
  }
  return { done, conflicts, pending };
}
```

Avec trois opérations (`op-1` et `op-2` sur `fd_204`, `op-3` sur `mt_1042`) dont la première rencontre un conflit, la fonction renvoie `done: ["op-3"]`, `conflicts: ["op-1"]` et `pending: ["op-2"]` : la seconde opération du même constat attend la résolution de la première, pour que l'ordre par entité soit respecté, et l'autre entité continue.

#### Le stockage local d'un navigateur

La page de MDN sur les quotas et l'éviction du stockage précise que les données d'IndexedDB, de l'API Cache et du système de fichiers privé d'origine sont « au mieux » par défaut ; que les écritures au-delà du quota échouent avec une erreur de quota, qu'il faut intercepter ; et que l'éviction suit l'ordre des origines les moins récemment utilisées, sauf demande de persistance. Pour une application de travail : on demande la persistance au premier lancement, on interroge l'estimation de l'espace, et l'on **synchronise souvent** : les données non synchronisées sont les seules que l'on ne peut pas reconstituer.

L'interface de synchronisation en arrière-plan permet à un service worker de reporter une tâche jusqu'à une connexion stable ; elle est signalée comme à disponibilité limitée par MDN (non « Baseline »). On ne s'y fie donc pas : la synchronisation se déclenche aussi à l'ouverture de l'application, au retour du réseau (événement de connectivité) et par un minuteur lorsque l'application est ouverte.

#### L'expérience de la personne

| Élément | Comportement |
|---|---|
| Indicateur de connexion | État du réseau et de la synchronisation, visible en permanence ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) |
| Compteur de changements en attente | « 7 modifications en attente », et date de la dernière synchronisation |
| Actions réservées au serveur | Désactivées avec une explication : « nécessite une connexion » |
| Conflits et rejets | Boîte « à vérifier », avec la raison et l'action |
| Interface optimiste | Le changement est affiché tout de suite, marqué « non synchronisé » |

#### La sécurité

```json
{
  "offline_policy": {
    "tenant_id": "ten_airline_01",
    "allowed_record_types": ["task", "finding", "aircraft", "checklist"],
    "max_offline_days": 14,
    "encrypt_local_store": true,
    "require_device_enrollment": true,
    "purge_on_logout": true,
    "write_mode": { "finding": "lazy", "task": "lazy", "approval": "online_only" }
  }
}
```

| Risque | Mesure |
|---|---|
| Appareil perdu ou volé | Chiffrement du stockage, enrôlement des appareils, effacement à distance, durée maximale hors ligne |
| Données non nécessaires embarquées | Types autorisés et périmètre limité ([25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation), [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données)) |
| Droits révoqués pendant l'absence | Revalidation au retour ; purge de ce qui n'est plus autorisé |
| Jeton d'accès expiré hors ligne | Nouvelle authentification avant la synchronisation ([4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)) |
| Appareil partagé | Stockage séparé par utilisateur, purge à la déconnexion |

**Modes de défaillance.**

- **Lecture réseau d'abord.**
- **File en mémoire**, perdue à la fermeture.
- **File non ordonnée** par entité.
- **Stockage supposé permanent**, sans demande de persistance.
- **Aucun indicateur** d'état de synchronisation.
- **Données sensibles non chiffrées** sur l'appareil.

**Contre-exemple.** Une application « hors ligne » met en cache les écrans consultés et garde les saisies dans une liste en mémoire, envoyées au retour du réseau. Un technicien consigne dix constats pendant une journée sans réseau, puis la tablette redémarre pour une mise à jour du système. La liste a disparu : les dix constats sont à ressaisir, et la confiance dans l'outil s'effondre.

**Limites.** Le fonctionnement hors ligne d'abord ajoute de la complexité : versions, file, conflits, purge, tests. Il ne rend pas le serveur inutile : les validations réglementaires et les droits sont ceux du serveur, et les actions qui en dépendent restent en ligne. La durée hors ligne a une borne : plus elle est longue, plus les conflits et les droits périmés se multiplient.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | L'état hors ligne est présenté comme un état d'interface |
| [15.2 Étude de cas, maintenance d'une flotte aérienne](15-cas-application.md#152-étude-de-cas-maintenance-dune-flotte-aérienne) | La maintenance de flotte pose l'exigence de tablettes hors ligne |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Les versions du serveur détectent les modifications concurrentes |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend les envois rejouables |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | La reprise et l'idempotence des consommateurs suivent les mêmes principes |
| [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](17-collaboration-communication-travail.md#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Le temps réel complète la synchronisation quand l'appareil est en ligne |
| [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données) | La classification dit ce qui peut être embarqué |
| [25.4 Application adaptative, native et web progressive, et cycle de vie des jetons push](#254-application-adaptative-native-et-web-progressive-et-cycle-de-vie-des-jetons-push) | Le service worker et le stockage de la PWA portent le mode hors ligne |
| [25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation) | Les conflits, le rejeu et le périmètre complètent la file |

### 5. Application pratique

**Situation initiale.** Dans le hangar de Lyon, le réseau est absent à plusieurs endroits. Les techniciens consignent leurs constats sur papier, puis les ressaisissent en fin de poste. Les erreurs de ressaisie et les retards de déclaration inquiètent la qualité.

**Problème.** Saisir sur place, sans réseau, sans rien perdre, sans doublon ni écrasement de ce que d'autres ont fait.

**Application du concept.** Une PWA installée, avec stockage local persistant, écritures paresseuses et file d'envoi durable.

**Déroulé.**

1. À l'ouverture du poste, avec le réseau de l'escale, l'application tire les tâches de Karim pour les 14 jours (périmètre, [25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation](#256-résolution-de-conflits-rejeu-idempotent-et-périmètre-de-synchronisation)) et les range dans le stockage local.
2. Dans le hangar, sans réseau, Karim ouvre `mt_1042`, consigne `fd_204` avec trois photos et coche quatre étapes : tout s'écrit en local, marqué « non synchronisé », et la file compte 7 opérations.
3. L'approbation du constat critique est désactivée avec la mention « nécessite une connexion ».
4. De retour à l'escale, le moniteur de connectivité déclenche la boucle : la file part dans l'ordre par entité, avec les clés d'idempotence ; deux opérations sont fusionnées, cinq appliquées.
5. L'application tire les changements depuis le point de contrôle : Sophie a modifié la gravité de `fd_204` entre-temps ; la valeur arrive en local.
6. Le compteur revient à zéro ; la date de synchronisation s'affiche.

**Résultat.** Les constats sont déclarés le jour même, sans ressaisie ; le délai moyen de déclaration passe de 1,4 jour à 0,2 jour (valeurs d'exemple).

**Limites.** Les photos pèsent 12 Mo par constat : le quota local et la bande passante du retour imposent un envoi des pièces jointes après les données, par lots et en reprise.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les trois stratégies d'écriture d'une application hors ligne d'abord ?
2. **Compréhension.** Pourquoi le stockage local est-il la source de lecture de l'interface ?
3. **Compréhension.** Pourquoi la file doit-elle être durable et ordonnée par entité ?
4. **Pourquoi.** Pourquoi demande-t-on la persistance du stockage et synchronise-t-on souvent ?
5. **Raisonnement pratique.** Une approbation de constat critique doit-elle être possible hors ligne ? Justifiez.

#### Réponses

1. En ligne seulement (l'écriture réussit sur le réseau avant le local), en file (on met en file puis on vide avec attente exponentielle), et paresseuse (on écrit en local d'abord, puis on met en file la notification du serveur).
2. Parce que l'interface ne doit pas dépendre du réseau : elle lit et observe le stockage local, et la synchronisation le met à jour ; l'écran est donc cohérent dans tous les états de connexion.
3. Durable pour survivre à la fermeture de l'application et aux pannes ; ordonnée par entité parce qu'une modification ne peut pas être envoyée avant la création ou la modification précédente sur laquelle elle s'appuie.
4. Parce que le stockage « au mieux » peut être évincé sous pression de stockage et que les changements non synchronisés sont les seules données que l'on ne peut pas reconstituer : on réduit la fenêtre d'exposition.
5. En général non : l'approbation suppose des droits et des règles à jour, dont l'autorité est celle du serveur. On la garde en ligne seulement, ou on la traite comme une demande qui sera validée ou refusée à la synchronisation.

## 25.6 Résolution de conflits, rejeu idempotent et périmètre de synchronisation

### 1. Comprendre simplement

Un **conflit** survient quand un même enregistrement a été modifié hors ligne et ailleurs avant la synchronisation. La **résolution de conflits** (*conflict resolution*) est la règle qui décide du résultat. Le **rejeu idempotent** (*idempotent replay*) est le renvoi d'une opération, après une coupure, une réponse perdue ou une reprise, sans qu'elle produise deux effets. Le **périmètre de synchronisation partielle** (*partial synchronization scope*) est le sous-ensemble de données qu'un appareil reçoit et conserve.

**Pourquoi cela existe.** Plusieurs appareils et plusieurs personnes modifient les mêmes données. Le réseau perd des réponses : l'appareil ne sait pas si son opération a été reçue, et la renvoie. Et un appareil ne peut ni contenir toutes les données du tenant, ni avoir le droit de les voir.

**Problème résolu.** Converger vers un état cohérent, sans perte silencieuse ni doublon, avec sur chaque appareil ce qui est nécessaire et permis.

**Modèle mental.** Deux secrétaires reçoivent chacune une copie d'un dossier et l'annotent. Au retour, il faut fusionner leurs annotations. Chaque courrier envoyé porte un numéro, pour qu'il ne soit pas traité deux fois. Et chacune n'emporte que les dossiers de son service.

**Où l'analogie s'arrête.** Des annotations de papier se lisent côte à côte. Des changements structurés peuvent se contredire de façon moins visible : états, totaux, contraintes d'unicité, règles métier.

**Exemple.** Karim a modifié la note de `fd_204` hors ligne, Sophie a changé sa gravité en ligne : les champs sont distincts, la fusion est automatique. Si les deux avaient modifié la note, le conflit serait présenté à Karim avec les deux valeurs. Le réseau coupe pendant l'envoi : Karim renvoie la même opération, le serveur reconnaît sa clé et renvoie le résultat enregistré, sans appliquer deux fois.

**Les composants.**

1. la **version** de chaque enregistrement ;
2. la **détection** des conflits ;
3. la **stratégie** de résolution par type de donnée ;
4. la **clé d'idempotence** de chaque opération ;
5. la **conservation des résultats** côté serveur ;
6. le **périmètre** de synchronisation ;
7. le **changement de périmètre** et la purge ;
8. le **rapport** des conflits et des rejets.

**Objectif d'apprentissage :** vous pouvez détecter un conflit par la version, choisir une stratégie de résolution par type de donnée, rendre un envoi rejouable par une clé d'idempotence et définir le périmètre de synchronisation d'un utilisateur.

### 2. Connaissances essentielles

#### Définition

- **Conflit** : deux modifications indépendantes du même enregistrement, fondées sur la même version de base, dont les effets ne se composent pas sans règle.
- **Rejeu idempotent** : renvoi d'une opération identifiée par une clé, que le serveur traite au plus une fois en effet et dont il rend toujours le même résultat.
- **Périmètre de synchronisation** : ensemble des enregistrements et des pièces jointes qu'un appareil reçoit, défini par les droits de la personne et par la pertinence.

#### Idées fondamentales

1. **Un conflit se détecte par la version, pas par l'horloge.** On compare la version de base de l'opération à la version courante.
2. **La stratégie dépend du type de donnée.** Dernier écrivain, fusion par champ, fusion sémantique, décision humaine.
3. **Aucune perte silencieuse.** On conserve les deux, on fusionne, ou on signale : jamais on n'écrase sans trace.
4. **Le serveur est l'autorité.** Les invariants, les droits et les machines d'états s'appliquent aux opérations hors ligne comme aux autres.
5. **Chaque opération porte une clé d'idempotence.** Le serveur retient son résultat pour répondre à un rejeu.
6. **La rétention des clés dépasse la durée hors ligne maximale.** Sinon un rejeu tardif est pris pour une nouvelle opération.
7. **Le périmètre est l'intersection des droits et de la pertinence.** Il change dans le temps, et ce qui en sort se purge.

#### Vocabulaire essentiel

- **Révision** (*revision*) : version d'un enregistrement, avec son historique.
- **Dernier écrivain gagne** (*last write wins*) : le changement le plus récent l'emporte, les plus anciens sont écartés.
- **Fusion par champ** (*field-level merge*) : combinaison de changements qui touchent des champs différents.
- **Gagnant déterministe** (*deterministic winner*) : règle qui désigne la même version gagnante sur tous les pairs.
- **Clé d'idempotence** (*idempotency key*) : identifiant fourni par le client pour reconnaître un renvoi.
- **Descripteur de périmètre** (*scope descriptor*) : règles qui définissent ce que reçoit un appareil.
- **Référence pendante** (*dangling reference*) : lien vers un enregistrement hors du périmètre.
- **Tempête de resynchronisation** (*sync storm*) : retour simultané de nombreux appareils, après une panne ou un déploiement.

#### Relations de cause à effet

- Le dernier écrit gagne, d'après les horloges des appareils. Un appareil dont l'horloge avance l'emporte toujours, et des modifications légitimes sont perdues sans trace.
- Aucune clé d'idempotence n'existe. Après une coupure, l'opération rejouée crée un second constat.
- Les clés sont conservées 24 heures et la durée hors ligne atteint 10 jours. L'envoi tardif d'une opération est traité comme une nouvelle, et crée un doublon.
- Le périmètre est « tout le tenant ». L'appareil sature, des données non nécessaires y résident, et une perte de l'appareil expose plus.
- Le périmètre est figé. La personne affectée à un nouvel aéronef n'a pas ses cartes de tâche hors ligne.

#### Idées reçues

- **« Le dernier qui écrit gagne : c'est simple et suffisant. »** C'est simple, et acceptable pour des champs sans enjeu ; mais cela perd des modifications. La fusion par champ suffit souvent, la décision humaine reste nécessaire pour certains cas.
- **« Rejouer est sans risque, c'est la même opération. »** Non. Sans clé d'idempotence, le serveur ne peut pas distinguer un renvoi d'une nouvelle opération.
- **« Synchroniser, c'est tout copier. »** Non. Le périmètre limite les données par droits et par pertinence ; ce qui sort du périmètre se purge.

#### Principe clé

On détecte les conflits par version, on les résout par une stratégie propre à chaque donnée sans perte silencieuse, on rend chaque envoi rejouable par une clé conservée plus longtemps que la durée hors ligne, et l'on ne synchronise que ce que la personne peut voir et dont elle a besoin.

#### Si vous ne retenez que trois choses

1. Un conflit se détecte par version, et se résout par une stratégie adaptée à la donnée, sans perte silencieuse.
2. Une clé d'idempotence, conservée plus longtemps que la durée hors ligne maximale, rend l'envoi rejouable.
3. Le périmètre est calculé par le serveur, change dans le temps, et ce qui en sort est purgé.

### 3. Explication technique détaillée

#### Détecter

Chaque enregistrement a une **version** de serveur, qui augmente à chaque changement accepté. L'opération hors ligne porte la **version de base** sur laquelle elle a été préparée. Si la version courante du serveur est égale à la version de base, l'opération s'applique. Sinon, le serveur compare ce que l'opération touche à ce qui a changé depuis la version de base ([3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)) : des champs disjoints se fusionnent ; des champs communs sont un conflit. La documentation d'Apache CouchDB décrit un modèle voisin : les révisions forment un arbre ; une mise à jour dont la révision de base est dépassée est refusée sur un seul nœud avec un code de conflit, et, entre répliques, les révisions en conflit sont toutes conservées, un gagnant déterministe est désigné pour que tous les pairs choisissent le même, et l'application fusionne puis supprime les autres révisions.

#### Stratégies de résolution

| Stratégie | Principe | Quand | Limite |
|---|---|---|---|
| Dernier écrivain gagne | Le changement le plus récent l'emporte | Champs sans enjeu, préférences | Perte silencieuse ; sensible aux horloges |
| Fusion par champ | Fusion à trois voies à partir de la version de base ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](23-solutions-verticales-packagees.md#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) | Enregistrements aux champs indépendants | Conflit si les mêmes champs sont touchés |
| Fusion sémantique | Règle propre au type : union d'une liste en ajout seul, somme de deltas | Commentaires, compteurs, ensembles | Demande une règle par type |
| Validation par machine d'états | Le serveur rejoue la transition dans l'état courant ([6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)) | États, statuts | Une transition devenue invalide est rejetée avec explication |
| Décision humaine | Présenter les deux versions à la personne | Données critiques, texte libre | Coût d'attention |

Le guide d'Android ne décrit en détail que « le dernier écrivain gagne », avec des horodatages attachés aux données par les appareils, le serveur écartant ce qui est plus ancien que son état ; il ne discute pas les dérives d'horloge. Pour la plateforme, on privilégie les **versions du serveur**, qui n'en dépendent pas.

```typescript
interface Record_ {
  version: number;
  fields: Record<string, unknown>;
  changedSince: Record<string, number>;
}

interface ClientOp {
  idempotencyKey: string;
  baseVersion: number;
  changes: Record<string, unknown>;
}

type ApplyResult =
  | { status: "applied"; version: number }
  | { status: "merged"; version: number; mergedFields: string[] }
  | { status: "conflict"; fields: string[] }
  | { status: "replayed"; original: string };

const processed = new Map<string, ApplyResult>();

function apply(record: Record_, op: ClientOp): ApplyResult {
  const known = processed.get(op.idempotencyKey);
  if (known !== undefined) {
    return { status: "replayed", original: known.status };
  }
  let result: ApplyResult;
  if (op.baseVersion === record.version) {
    Object.assign(record.fields, op.changes);
    record.version += 1;
    for (const f of Object.keys(op.changes)) {
      record.changedSince[f] = record.version;
    }
    result = { status: "applied", version: record.version };
  } else {
    const clash = Object.keys(op.changes).filter((f) => (record.changedSince[f] ?? 0) > op.baseVersion);
    if (clash.length > 0) {
      result = { status: "conflict", fields: clash };
    } else {
      Object.assign(record.fields, op.changes);
      record.version += 1;
      for (const f of Object.keys(op.changes)) {
        record.changedSince[f] = record.version;
      }
      result = { status: "merged", version: record.version, mergedFields: Object.keys(op.changes) };
    }
  }
  processed.set(op.idempotencyKey, result);
  return result;
}
```

Avec un constat en version 5 (`state`, `note`, `severity`) et quatre opérations de base 5 : `k1` change la note (appliquée, version 6) ; `k2` change la gravité (fusionnée, version 7, car le champ `severity` n'a pas changé depuis la version 5) ; `k3` change la note (conflit sur `note`, modifiée en version 6) ; `k1` renvoyée (rejouée : le serveur renvoie le résultat déjà enregistré, sans rien appliquer). *Un moteur réel exécute ce traitement dans une transaction, avec le verrouillage de l'enregistrement.*

#### Le rejeu idempotent

La documentation de Stripe sur les requêtes idempotentes décrit le mécanisme : le client génère une clé unique ; pour la première requête avec une clé donnée, le serveur enregistre le code d'état et le corps de la réponse, y compris les erreurs 500 ; un renvoi avec la même clé retourne la réponse enregistrée ; les clés peuvent avoir jusqu'à 255 caractères ; elles peuvent être supprimées automatiquement après 24 heures ; et le serveur compare les paramètres du renvoi à ceux de la requête d'origine, et signale une erreur s'ils diffèrent. Les requêtes de lecture et de suppression n'ont pas besoin de clé.

Pour un travail hors ligne, deux ajustements :

| Point | Pourquoi |
|---|---|
| La durée de rétention des clés dépasse la durée hors ligne maximale, avec une marge | Une opération préparée il y a 10 jours doit être reconnue à son envoi |
| La clé est créée à la saisie, pas à l'envoi | Une reprise après redémarrage doit renvoyer la même clé |
| La clé et le changement sont écrits dans la même transaction du serveur | Sinon un échec entre les deux laisse un effet sans trace, ou une trace sans effet |
| Le renvoi avec des paramètres différents est refusé | Il révèle un défaut du client, pas un rejeu |

```sql
CREATE TABLE processed_operation (
  tenant_id       uuid        NOT NULL,
  idempotency_key text        NOT NULL,
  request_digest  text        NOT NULL,
  response_status integer     NOT NULL,
  response_body   jsonb       NOT NULL,
  processed_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

-- Purge : au-delà de la durée hors ligne maximale, avec marge
DELETE FROM processed_operation
 WHERE processed_at < now() - make_interval(days => $1);
```

La remise reste « au moins une fois » : l'effet est « une seule fois » parce que la clé est reconnue ([3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence), [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Le périmètre de synchronisation

Un appareil ne reçoit que ce que la personne peut voir et dont elle a besoin. Le serveur, qui connaît les droits ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), calcule le périmètre à partir d'un descripteur.

```json
{
  "sync_scope": {
    "tenant_id": "ten_airline_01",
    "user_id": "usr_karim",
    "rules": [
      { "type": "task", "where": { "base": "LYS", "assigned_to": "me", "due_within_days": 14 } },
      { "type": "finding", "where": { "aircraft_in": "assigned_tasks", "state_not": "closed" } },
      { "type": "aircraft", "where": { "id_in": "assigned_tasks" } },
      { "type": "attachment", "where": { "max_bytes": 5000000, "kind": ["photo"] } }
    ],
    "limits": { "max_records": 5000, "max_bytes": 250000000 }
  }
}
```

```sql
SELECT t.id, t.version, t.updated_at
  FROM maintenance_task t
 WHERE t.tenant_id = $1
   AND t.base_code = $2
   AND t.assignee_id = $3
   AND t.due_date <= current_date + $4::int
   AND t.state <> 'closed'
 ORDER BY t.updated_at, t.id
 LIMIT $5;
```

| Règle | Raison |
|---|---|
| Le serveur calcule le périmètre | L'appareil n'est pas une autorité sur les droits ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) |
| Périmètre = droits ∩ pertinence | Réduire les données et l'exposition |
| Un jeton ou une version de périmètre accompagne le point de contrôle | Détecter qu'il a changé |
| Une affectation nouvelle déclenche un tirage initial du sous-ensemble | La personne a ce qu'il lui faut sans resynchroniser tout |
| Ce qui sort du périmètre est purgé de l'appareil | Minimisation des données ([20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)) |
| Les références hors périmètre sont des marques de substitution | Éviter des liens cassés sans embarquer la cible |
| Les pièces jointes volumineuses se récupèrent à la demande | Stockage et bande passante |

#### Temps réel et hors ligne

En ligne, le canal temps réel du module 17 ([17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](17-collaboration-communication-travail.md#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail)) pousse les changements au moteur de synchronisation, qui les traite comme des changements tirés : une seule logique d'application, deux déclencheurs. Hors ligne, le canal est coupé : la file s'accumule, et la reprise repart du point de contrôle. La présence et l'édition collaborative ([17.15 Présence et édition collaborative](17-collaboration-communication-travail.md#1715-présence-et-édition-collaborative)) n'existent qu'en ligne ; les compteurs de non-lus ([17.13 Compteurs de non-lus et synchronisation de l'état de lecture](17-collaboration-communication-travail.md#1713-compteurs-de-non-lus-et-synchronisation-de-létat-de-lecture)) se recalculent à la synchronisation.

**Les tempêtes de resynchronisation.** Après une panne de réseau ou de plateforme, des milliers d'appareils reviennent en même temps. Les envois sont rejoués avec une attente exponentielle et un délai aléatoire, et la synchronisation est servie dans une classe de traitement équitable ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge), [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)).

**Tests.** On simule des coupures en cours d'envoi, des doublons, des ordres inversés et des horloges fausses ; on vérifie les propriétés : après synchronisation tous les exemplaires convergent ; un rejeu ne change pas le résultat ; un conflit n'efface rien ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)).

**Modes de défaillance.**

- **Dernier écrivain gagne** fondé sur les horloges des appareils.
- **Pas de clé d'idempotence**, ou clés trop vite purgées.
- **Résolution silencieuse**, sans trace ni rapport.
- **Périmètre trop large**, ou figé.
- **Données sorties du périmètre non purgées.**
- **Tempête de resynchronisation** non maîtrisée.

**Contre-exemple.** Une plateforme règle les conflits par « le plus récent horodatage gagne », en se fiant à l'horloge des tablettes. Une tablette dont l'horloge avance de deux jours écrase, à chaque synchronisation, les modifications des autres : les corrections de gravité saisies en ligne par la qualité sont remplacées par d'anciennes valeurs, sans erreur ni alerte. Un audit trouve une trentaine de constats avec une gravité fausse.

**Limites.** Aucune stratégie ne fait disparaître tous les conflits : la décision humaine reste nécessaire pour les données critiques, avec son coût d'attention. Les opérations hors ligne peuvent devenir **invalides** (état changé, droits retirés) : le rejet explique, et la personne reprend. Le serveur doit garder les résultats des opérations pendant toute la durée hors ligne autorisée, ce qui a un coût de stockage. Enfin, les structures de fusion automatique avancées (types de données répliqués sans conflit, transformation opérationnelle) ne sont pas traitées ici.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | Le verrouillage optimiste fournit les versions et la détection |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend le rejeu sûr |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | La machine d'états valide les transitions hors ligne |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les nouvelles tentatives et l'idempotence suivent les mêmes principes |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants s'appliquent à toute opération à la synchronisation |
| [17.12 Diffusion en temps réel : interrogation, flux serveur, WebSocket et diffusion en éventail](17-collaboration-communication-travail.md#1712-diffusion-en-temps-réel--interrogation-flux-serveur-websocket-et-diffusion-en-éventail) | Le temps réel pousse les changements en ligne |
| [17.15 Présence et édition collaborative](17-collaboration-communication-travail.md#1715-présence-et-édition-collaborative) | La présence et l'édition collaborative n'existent qu'en ligne |
| [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | La minimisation justifie le périmètre et la purge |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | L'équité traite les tempêtes de resynchronisation |
| [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](23-solutions-verticales-packagees.md#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation) | La fusion par champ est la fusion à trois voies |
| [25.5 Hors ligne d'abord, stockage local et file de synchronisation](#255-hors-ligne-dabord-stockage-local-et-file-de-synchronisation) | La file et la boucle de synchronisation portent ces opérations |

### 5. Application pratique

**Situation initiale.** Karim a passé la matinée hors ligne dans le hangar. À la reconnexion, sa file contient 7 opérations, dont une modification de la note de `fd_204`. Sophie a, entre-temps, changé la gravité du même constat, et une coupure interrompt un envoi.

**Problème.** Appliquer les opérations de Karim sans écraser celles de Sophie, sans doublon après la coupure, avec seulement les données de Karim sur sa tablette.

**Application du concept.** Détection par version, fusion par champ, clés d'idempotence, périmètre calculé par le serveur.

**Déroulé.**

1. Le serveur reçoit la première opération (note de `fd_204`, version de base 5). La version courante est 6 (gravité modifiée par Sophie). Les champs sont disjoints : l'opération est fusionnée, version 7.
2. La coupure interrompt la réponse. Karim ne sait pas si l'opération est passée. Son application la renvoie avec la même clé d'idempotence.
3. Le serveur reconnaît la clé, ne réapplique rien et renvoie le résultat enregistré : fusion, version 7.
4. Une autre opération (changement d'état de `fd_204`) est rejetée : le constat a été clôturé entre-temps par la qualité, et la transition n'est plus valide. Le rejet explique la raison ; il apparaît dans la boîte « à vérifier » de Karim.
5. Le serveur recalcule le périmètre de Karim : une affectation a changé, deux tâches du jour entrent dans le périmètre et une sort ; l'appareil reçoit les deux premières, et purge la troisième.
6. Le rapport de synchronisation indique : 6 appliquées ou fusionnées, 1 rejetée, 0 doublon.

**Résultat.** Aucune donnée n'est perdue silencieusement ni dupliquée ; la personne voit exactement ce qui est accepté, fusionné ou rejeté.

**Limites.** Le rejet de l'opération invalide demande à Karim de décider : l'outil ne peut pas deviner si sa note doit être ajoutée au constat clos ; il propose de la rattacher comme un commentaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Comment détecte-t-on un conflit sans se fier à l'horloge des appareils ?
2. **Compréhension.** Quelle est la différence entre une fusion par champ et « le dernier écrivain gagne » ?
3. **Compréhension.** À quoi sert une clé d'idempotence dans un envoi hors ligne ?
4. **Pourquoi.** Pourquoi la durée de rétention des clés doit-elle dépasser la durée hors ligne maximale ?
5. **Raisonnement pratique.** Une tablette peut rester hors ligne 14 jours. Les clés d'idempotence sont conservées 24 heures. Que peut-il arriver, et que changer ?

#### Réponses

1. Par la version : l'opération porte la version de base sur laquelle elle a été préparée ; si la version courante du serveur est supérieure, quelqu'un a modifié l'enregistrement entre-temps, et l'on compare les champs touchés.
2. La fusion par champ combine des changements sur des champs différents et ne signale un conflit que si les mêmes champs sont touchés ; « le dernier écrivain gagne » garde un seul changement entier et écarte l'autre, sans le signaler.
3. À reconnaître un renvoi de la même opération, après une coupure ou une réponse perdue : le serveur renvoie le résultat enregistré au lieu de réappliquer, ce qui évite les doublons.
4. Parce qu'une opération préparée hors ligne peut être envoyée longtemps après sa création : si la clé a été supprimée entre-temps, le serveur la prend pour une nouvelle opération et la rejoue.
5. Une opération créée hors ligne 5 jours plus tôt et renvoyée après une coupure serait traitée comme nouvelle : doublon. Il faut conserver les clés au moins 14 jours, avec une marge (par exemple 30), et purger au-delà.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Internationalisation et localisation | W3C, *Localization vs. Internationalization* | [w3.org](https://www.w3.org/International/questions/qa-i18n) | 25.1 |
| Étiquettes de langue | IETF, RFC 5646, *Tags for Identifying Languages* (BCP 47) | [rfc-editor.org](https://www.rfc-editor.org/rfc/rfc5646) | 25.1 |
| Appariement des étiquettes | IETF, RFC 4647, *Matching of Language Tags* (BCP 47) | [rfc-editor.org](https://www.rfc-editor.org/rfc/rfc4647) | 25.1 |
| Identifiants de paramètres régionaux, héritage | Unicode, UTS #35, *Locale Data Markup Language* | [unicode.org](https://www.unicode.org/reports/tr35/tr35.html) | 25.1, 25.2 |
| Règles de pluriel | Unicode, UTS #35, partie 3 ; graphique des règles de pluriel de CLDR | [partie 3](https://www.unicode.org/reports/tr35/tr35-numbers.html), [graphique](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) | 25.2 |
| Format de message | ICU, *Formatting Messages* ; Unicode, *MessageFormat 2* | [ICU](https://unicode-org.github.io/icu/userguide/format_parse/messages/), [MessageFormat 2](https://messageformat.unicode.org/) | 25.2 |
| Pluriels et tri en JavaScript | MDN, `Intl.PluralRules` ; `Intl.Collator` | [PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules), [Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) | 25.2, 25.3 |
| Texte bidirectionnel | Unicode, UAX #9, *Unicode Bidirectional Algorithm* | [unicode.org](https://www.unicode.org/reports/tr9/) | 25.3 |
| Balisage bidirectionnel en HTML | W3C, *Inline markup and bidirectional text in HTML* | [w3.org](https://www.w3.org/International/articles/inline-bidi-markup/) | 25.3 |
| Propriétés logiques | MDN, *CSS logical properties and values* | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) | 25.3 |
| Collations en base de données | PostgreSQL, *Collation Support* | [postgresql.org](https://www.postgresql.org/docs/current/collation.html) | 25.3 |
| Installation d'une PWA | MDN, *Making PWAs installable* | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) | 25.4 |
| Notifications web | IETF, RFC 8030, *Generic Event Delivery Using HTTP Push* | [rfc-editor.org](https://www.rfc-editor.org/rfc/rfc8030) | 25.4 |
| Gestion des jetons de notification | Firebase, *Best practices for FCM registration token management* | [firebase.google.com](https://firebase.google.com/docs/cloud-messaging/manage-tokens) | 25.4 |
| Quotas et éviction du stockage | MDN, *Storage quotas and eviction criteria* | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | 25.4, 25.5 |
| Synchronisation en arrière-plan | MDN, *Background Synchronization API* | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) | 25.5 |
| Applications hors ligne d'abord | Android Developers, *Build an offline-first app* | [developer.android.com](https://developer.android.com/topic/architecture/data-layer/offline-first) | 25.5, 25.6 |
| Conflits de réplication | Apache CouchDB, *Replication and conflict model* | [docs.couchdb.org](https://docs.couchdb.org/en/stable/replication/conflicts.html) | 25.6 |
| Requêtes idempotentes | Stripe, *Idempotent requests* | [docs.stripe.com](https://docs.stripe.com/api/idempotent_requests) | 25.6 |
| Résultats de formatage, de pluriel et de tri | Exécution de l'API `Intl` de Node.js 26.3.0 (ICU 78.3, CLDR 48.0, Unicode 17.0) | Exécution locale du 14 octobre 2026 | 25.1, 25.2, 25.3 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Les pages de la documentation d'Apple sur les jetons du service de notification n'ont pas pu être lues : les règles propres à iOS ne reposent que sur ce que dit le guide de Firebase.
- L'en-tête HTTP de préférence de langue et son traitement n'ont pas été consultés.
- Les règles de pratique suivantes ne viennent d'aucune source consultée : ce qu'il faut ou non inverser en mise en page de droite à gauche, la pseudo-localisation, la tolérance des mises en page à la longueur des textes, l'ordre de lecture des chiffres dans un texte de droite à gauche, et le choix de rejeter ou de conserver les opérations invalides.
- Les traductions russes et arabes de l'exemple sont illustratives : elles demandent une relecture par des locuteurs. L'arabe de l'exemple HTML est une phrase simple, non validée par un relecteur.
- Les types de données répliqués sans conflit, les horloges vectorielles et la transformation opérationnelle ne sont pas traités et n'ont pas été consultés.
- La durée de conservation des clés d'idempotence de la documentation de Stripe (24 heures) concerne une interface de paiement, non un travail hors ligne : l'ajustement proposé est un raisonnement de conception.
- Les résultats de mise en forme et de tri viennent d'une exécution avec une version précise des données de localisation : ils peuvent différer avec d'autres versions, d'autres navigateurs ou d'autres systèmes.
- Les valeurs chiffrées (délais, taux, tailles, volumes, durées) sont des valeurs d'exemple ; les formats de politique, de périmètre, de file et de réponse sont propres à la plateforme fictive.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; l'analyseur traite en commande générique l'instruction `CREATE COLLATION` ; les bases locales d'appareils ont leur propre syntaxe. Les extraits TypeScript ont été contrôlés syntaxiquement et exécutés avec Node.js sur les exemples donnés (consultation de langue, messages et repli, état des enregistrements, vidage de file, application des opérations).
