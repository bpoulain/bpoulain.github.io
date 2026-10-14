# Module 29 — Organisation, produit et économie de la plateforme

> **Question directrice.** Comment organiser les équipes, les décisions et le financement d'une plateforme dont les clients sont des développeurs et des administrateurs ?

## Présentation du module

**Objectif.** Une plateforme est aussi une organisation et un produit. Le parcours traite l'architecture, pas qui la construit, la gouverne et la finance. Il cite la loi de Conway pour justifier les frontières de service ([1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)), mentionne la feuille de route une fois ([12.2 Design systems](12-produit-ux.md#122-design-systems)), et traite la dette technique et les décisions d'architecture dans le module de livraison ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)). Ce module décrit six sujets : la **plateforme comme produit**, l'**équipe plateforme, les topologies d'équipes et le chemin balisé**, la **gouvernance des API et la dépréciation**, le choix de **construire ou d'acheter**, avec l'open source, les licences, la dépendance et la portabilité, la **feuille de route, l'analytique et l'expérimentation**, et enfin l'**écosystème de partenaires et la gouvernance d'architecture**. Le fil conducteur : les clients d'une plateforme sont des développeurs et des administrateurs, et ils choisissent de l'utiliser, ou de la contourner.

**Prérequis.** L'architecture de plateforme et l'architecture modulaire ([1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire)), les frontières de service ([1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)), le SDK et la plateforme développeur ([10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur)), la marketplace ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)) et la configuration versus le code ([13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)). Sont utiles la dette technique et l'enregistrement des décisions d'architecture ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)), l'économie unitaire ([22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)), les mesures d'adoption ([24.3 Mesures d'adoption et score de santé du compte](24-cycle-vie-client-support.md#243-mesures-dadoption-et-score-de-santé-du-compte)) et la propriété, la dépréciation et les licences des paquets ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](23-solutions-verticales-packagees.md#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

**Un mot, plusieurs sens.** Quatre mots changent de sens. Une **plateforme** est tantôt le produit SaaS vendu aux clients, tantôt le socle interne que les équipes de produit utilisent pour le construire : le module traite les deux et précise chaque fois laquelle. Un **client** peut être une organisation qui paie, une équipe interne qui consomme le socle, ou un développeur partenaire. La **gouvernance** désigne ici les règles qui encadrent les API, l'architecture et les dépendances, et non la gouvernance des données ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)). Une **dépréciation** est l'annonce du retrait futur d'une capacité, pas son retrait.

**Ordre retenu.** Trois groupes : produire, décider, piloter et ouvrir.

```text
Produire     plateforme comme produit ─ équipe plateforme, topologies, chemin balisé
Décider      gouvernance des API, dépréciation ─ construire ou acheter, licences, portabilité
Piloter      feuille de route, analytique, expérimentation ─ partenaires, gouvernance d'architecture
```

| Groupe | Question de l'équipe |
|---|---|
| Produire | Pour qui construit-on la plateforme, avec quelles équipes, et comment rend-on le bon chemin facile ? |
| Décider | Comment changer une API sans casser les clients, et décider de fabriquer, d'acheter ou d'adopter sans s'enfermer ? |
| Piloter et ouvrir | Que construire ensuite, comment le mesurer, et comment ouvrir à des partenaires sans perdre la cohérence ? |

**Références.** Les documentations, normes et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Les noms d'équipes, les chiffres et les durées des exemples sont fictifs ; les résultats de calcul présentés ont été obtenus par exécution des extraits donnés. Ce module n'est pas un avis juridique : la section sur les licences expose des familles et des méthodes, pas une analyse de cas.

## Sommaire du module

- [29.1 La plateforme comme produit](#291-la-plateforme-comme-produit)
- [29.2 Équipe plateforme, topologies d'équipes et chemin balisé](#292-équipe-plateforme-topologies-déquipes-et-chemin-balisé)
- [29.3 Gouvernance des API et politique de dépréciation](#293-gouvernance-des-api-et-politique-de-dépréciation)
- [29.4 Construire ou acheter, open source et licences, dépendance et portabilité](#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité)
- [29.5 Feuille de route, analytique produit et expérimentation](#295-feuille-de-route-analytique-produit-et-expérimentation)
- [29.6 Écosystème de partenaires et gouvernance d'architecture](#296-écosystème-de-partenaires-et-gouvernance-darchitecture)

## 29.1 La plateforme comme produit

### 1. Comprendre simplement

Traiter la **plateforme comme un produit** (*platform as a product*), c'est lui appliquer les pratiques d'un produit : connaître ses utilisateurs (développeurs, administrateurs, partenaires), formuler la valeur qu'elle leur apporte, tenir une feuille de route, mesurer son adoption et sa satisfaction, et accepter que son usage doive être mérité plutôt qu'imposé. Le mot désigne ici deux objets : la plateforme configurable vendue aux clients, et le socle interne sur lequel les équipes de produit construisent.

**Pourquoi cela existe.** Une plateforme construite comme un projet est livrée, puis délaissée. Une plateforme construite pour des utilisateurs qu'on n'a pas consultés répond à des besoins supposés. Une plateforme imposée par décision est contournée. Le document du CNCF sur les plateformes note que les mandats venus du haut rencontrent de la résistance ; Evan Bottcher écrit qu'une plateforme ne peut pas tenir sur un mandat seul, et qu'une équipe partagée sans concurrence est en situation de monopole, donc exposée à la négligence.

**Problème résolu.** Obtenir une plateforme utilisée, utile et qui évolue avec les besoins de ceux qui construisent dessus ou la configurent.

**Modèle mental.** Une boutique plutôt qu'un règlement. Les clients entrent s'ils trouvent ce qu'ils cherchent, à un prix (en effort) inférieur à celui d'un achat ailleurs ; la boutique a un assortiment, une enseigne, un service après-vente, et mesure ce qui se vend.

**Où l'analogie s'arrête.** Un client d'une boutique peut aller ailleurs. Les équipes internes ont souvent peu d'alternatives : c'est ce qui rend facile de négliger leur point de vue, et ce qui oblige à s'astreindre à des mesures explicites.

**Exemple.** L'éditeur de la plateforme a une équipe Plateforme et plusieurs équipes de paquets métier (maintenance aéronautique, santé, industrie). L'équipe Plateforme publie un portail pour développeurs, des gabarits de paquets, des environnements éphémères, et mesure le temps que met une équipe de paquet à son premier déploiement.

**Les composants.**

1. des **utilisateurs** identifiés : développeurs de paquets, administrateurs, partenaires ;
2. une **proposition de valeur** : ce que la plateforme évite de refaire ;
3. une **feuille de route** publique ([29.5 Feuille de route, analytique produit et expérimentation](#295-feuille-de-route-analytique-produit-et-expérimentation)) ;
4. des **interfaces en libre-service** : portail, API, documentation, gabarits ;
5. un **soutien** : support, communauté, formation ;
6. des **mesures** : adoption, satisfaction, délai avant le premier déploiement ;
7. un **responsable de produit** et une équipe durable.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi une plateforme se traite comme un produit, nommer ses utilisateurs et ses mesures, et dire ce qui distingue une plateforme adoptée d'une plateforme imposée.

### 2. Connaissances essentielles

#### Définition

**Plateforme comme produit** : manière de concevoir et de faire évoluer une plateforme, interne ou externe, comme un produit destiné à des utilisateurs identifiés, avec une proposition de valeur, des interfaces en libre-service, une feuille de route, un soutien et des mesures d'usage et de satisfaction, portés par une équipe durable.

#### Idées fondamentales

1. **Une plateforme a des clients.** Ce sont des personnes, avec des tâches à accomplir et des alternatives.
2. **L'usage se mérite.** Une plateforme plus facile à utiliser que sa copie maison est adoptée ; une plateforme imposée est contournée.
3. **Le libre-service définit la plateforme.** Sans demande à une autre équipe, le couplage par les files de demandes disparaît.
4. **Un produit est porté par une équipe durable.** Pas par un projet qui se dissout à la livraison.
5. **On mesure l'adoption et la satisfaction, pas seulement la disponibilité.** Un service disponible et inutilisé est un échec.
6. **On réduit la charge cognitive des équipes.** Chaque outil ou responsabilité ajouté à une équipe s'ajoute à sa charge mentale.
7. **On commence mince.** Le plus petit socle utile, étendu selon les usages.

#### Vocabulaire essentiel

- **Plateforme interne de développement** (*internal developer platform*) : ensemble de capacités en libre-service offertes aux équipes qui construisent des produits.
- **Libre-service** (*self-service*) : possibilité d'obtenir une capacité sans passer par une demande à une autre équipe.
- **Charge cognitive** (*cognitive load*) : effort mental demandé à une équipe par ce qu'elle doit maîtriser.
- **Couplage par les demandes** (*backlog coupling*) : dépendance d'une équipe à la file de demandes d'une autre.
- **Plateforme viable minimale** (*thinnest viable platform*) : le plus petit socle qui apporte une valeur réelle, sans complexité inutile.
- **Adoption** (*adoption*) : part des utilisateurs éligibles qui emploient réellement une capacité.

#### Relations de cause à effet

- La plateforme est un projet livré à une date. Elle n'évolue plus, et les équipes contournent ses manques.
- Elle est imposée par une décision. Les équipes la contournent ou l'utilisent a minima, et construisent des solutions parallèles.
- Elle demande des tickets. Chaque équipe attend la file d'une autre : on retrouve le couplage que la plateforme devait supprimer.
- Personne ne mesure l'adoption. L'équipe Plateforme ne sait pas ce qui sert, et continue de construire ce qu'elle croit utile.

#### Idées reçues

- **« Une plateforme est un projet d'infrastructure. »** Non. Elle a des utilisateurs, une valeur à prouver et une évolution continue : c'est un produit.
- **« Si elle est obligatoire, elle sera utilisée. »** Elle sera utilisée a minima. Evan Bottcher cite l'idée de « route pavée » de Netflix : les équipes peuvent s'écarter, mais elles en portent le coût.
- **« La disponibilité mesure le succès. »** Non. Le document du CNCF cite parmi les mesures d'une plateforme les utilisateurs actifs et leur rétention, la satisfaction, le délai entre la demande et son exécution, et le délai du premier changement de code d'un nouvel utilisateur.

#### Principe clé

Une plateforme est un produit : elle a des utilisateurs, une proposition de valeur, une équipe durable et des mesures d'adoption, et elle gagne son usage au lieu de l'imposer.

#### Si vous ne retenez que trois choses

1. Une plateforme a des clients et doit mériter leur usage ; un mandat seul ne suffit pas.
2. Le libre-service, la documentation et les gabarits sont le produit, autant que le code.
3. On mesure l'adoption, la satisfaction et le délai de première valeur, pas seulement la disponibilité.

### 3. Explication technique détaillée

#### Ce que disent les sources

Le document du CNCF sur les plateformes (page consultée le 14 octobre 2026) décrit une plateforme comme une collection intégrée de capacités, définie et présentée selon les besoins de ses utilisateurs, comme une couche transversale qui offre aux équipes une manière cohérente d'obtenir et d'intégrer des services courants ; il suggère la couche la plus mince raisonnable au-dessus des fournisseurs. Il recommande de traiter la plateforme comme tout produit logiciel : recueillir les besoins par entretiens, ateliers, enquêtes et observation de l'usage, publier une feuille de route, promouvoir la plateforme en interne et inclure des responsables de produit dès le début. Il liste sept attributs : plateforme comme produit, expérience utilisateur, documentation et accueil (y compris des gabarits de chemin balisé), libre-service, charge cognitive réduite, usage facultatif et composable, sécurité par défaut.

Evan Bottcher (5 mars 2018) définit la plateforme numérique comme un socle d'API, d'outils, de services, de connaissances et de soutien en libre-service, organisé comme un produit interne convaincant, qui permet à des équipes autonomes de livrer plus vite et réduit le couplage par les files de demandes. Il note que le libre-service est une caractéristique déterminante, que la plateforme ne peut pas s'appuyer sur un mandat seul, qu'elle inclut la documentation, le conseil, le soutien et la promotion, et qu'elle suppose une équipe de produit durable qui la construit et l'exploite.

#### Les utilisateurs et leurs tâches

| Utilisateur | Tâche | Ce qu'il attend de la plateforme |
|---|---|---|
| Développeur d'un paquet métier | Créer un type de ressource avec son workflow et ses droits, le tester, le publier | Gabarit, environnement éphémère, validation, publication en libre-service |
| Administrateur d'un tenant | Configurer, intégrer, déléguer | Console cohérente, explications, retour arrière |
| Intégrateur partenaire | Construire une extension | Portail, API stables, bac à sable, certification |
| Équipe d'exploitation | Suivre, diagnostiquer, répondre aux incidents | Mesures, traces, procédures |

Pour chaque ligne, une tâche : on construit les interfaces autour de tâches, pas autour de composants internes.

#### Mesurer

La même page du CNCF regroupe les mesures en trois familles : satisfaction et productivité des utilisateurs (utilisateurs actifs et rétention, enquête de satisfaction, indicateurs de productivité), efficacité de l'organisation (délai entre la demande et l'exécution, délai pour construire et déployer un nouveau service, délai avant le premier changement de code d'un nouvel utilisateur), et livraison (les quatre mesures DORA : fréquence de déploiement, délai de mise en production d'un changement, délai de rétablissement, taux d'échec des changements, voir [21.10 Gestion des versions et mesures de livraison](21-livraison-qualite-logicielle.md#2110-gestion-des-versions-et-mesures-de-livraison)).

```typescript
interface Adoption {
  capability: string;
  teamsEligible: number;
  teamsUsing: number;
}

interface Onboarding {
  team: string;
  hoursToFirstDeployment: number;
}

function adoptionRate(a: Adoption): number {
  return a.teamsUsing / a.teamsEligible;
}

function median(values: number[]): number {
  const s = [...values].sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
```

Sur douze équipes éligibles, le pipeline est employé par onze d'entre elles (92 %), le gabarit de paquet par sept (58 %), l'environnement éphémère par trois (25 %). Le délai de premier déploiement de six équipes nouvelles est de 6, 8, 10, 12, 30 et 52 heures : la médiane est de 11 heures, et la queue (30 et 52 heures) pointe les équipes pour lesquelles l'accueil ne fonctionne pas. Deux enseignements : on regarde la médiane et la queue, pas seulement la moyenne ; et une capacité à 25 % d'adoption pose une question de produit (utilité, découvrabilité, difficulté) avant de poser une question d'obligation.

#### Les pratiques de produit appliquées

1. **Connaître les utilisateurs** : entretiens réguliers, observation d'une première utilisation.
2. **Publier une feuille de route** et la discuter avec eux ([29.5 Feuille de route, analytique produit et expérimentation](#295-feuille-de-route-analytique-produit-et-expérimentation)).
3. **Soigner l'accueil** : documentation, exemples, gabarits ; le premier déploiement est un moment de vérité.
4. **Tenir le soutien** : canal, délais de réponse, retours qui alimentent la feuille de route.
5. **Annoncer les changements** et respecter une politique de dépréciation ([29.3 Gouvernance des API et politique de dépréciation](#293-gouvernance-des-api-et-politique-de-dépréciation)).
6. **Rendre l'usage optionnel mais attractif** : garde-fous obligatoires, chemin recommandé ([29.2 Équipe plateforme, topologies d'équipes et chemin balisé](#292-équipe-plateforme-topologies-déquipes-et-chemin-balisé)).

**Modes de défaillance.**

- **Plateforme livrée comme un projet**, sans équipe durable.
- **Mandat sans valeur** : usage minimal et solutions parallèles.
- **File de tickets** comme interface unique.
- **Aucune mesure d'adoption** ni d'accueil.
- **Fonctionnalités construites pour soi**, sans entretien avec les utilisateurs.
- **Charge cognitive ignorée** : toujours plus d'outils à maîtriser.

**Contre-exemple.** Un groupe d'architectes construit un socle de services partagés, le livre, puis passe à autre chose. Les équipes de paquets doivent demander chaque capacité à un guichet par ticket, avec des délais de deux semaines. Trois équipes écrivent leur propre système de publication. La direction impose alors le socle, et les équipes l'emploient pour les capacités qu'elles ne peuvent pas refaire et contournent le reste. Une équipe durable, un libre-service et des mesures d'accueil auraient fait de l'adoption un résultat.

**Limites.** Le produit interne demande des compétences de produit (recueil des besoins, priorisation) qui ne sont pas celles d'un ingénieur d'infrastructure. Les mesures peuvent être détournées : un délai de premier déploiement se réduit en retirant des contrôles. Toutes les capacités n'ont pas à être des produits : certaines sont des garde-fous obligatoires. Et l'adoption d'une capacité dépend aussi du contexte des équipes, pas seulement de sa qualité.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire) | L'architecture de plateforme est la structure que le produit rend utilisable |
| [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service) | La loi de Conway relie la structure des équipes à celle des services |
| [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur) | Le SDK et la plateforme développeur sont l'interface du produit pour les développeurs |
| [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité) | La découvrabilité conditionne l'adoption d'une capacité |
| [21.10 Gestion des versions et mesures de livraison](21-livraison-qualite-logicielle.md#2110-gestion-des-versions-et-mesures-de-livraison) | Les mesures de livraison fournissent les indicateurs des équipes qui consomment |
| [24.3 Mesures d'adoption et score de santé du compte](24-cycle-vie-client-support.md#243-mesures-dadoption-et-score-de-santé-du-compte) | Les mesures d'adoption s'appliquent aussi aux utilisateurs internes |
| [29.2 Équipe plateforme, topologies d'équipes et chemin balisé](#292-équipe-plateforme-topologies-déquipes-et-chemin-balisé) | L'équipe plateforme et le chemin balisé portent ce produit |
| [29.5 Feuille de route, analytique produit et expérimentation](#295-feuille-de-route-analytique-produit-et-expérimentation) | La feuille de route et l'analytique pilotent son évolution |

### 5. Application pratique

**Situation initiale.** L'éditeur de la plateforme compte douze équipes de paquets métier. Chacune construit à sa façon ses gabarits et ses environnements de test. L'équipe Plateforme propose un socle commun, mais peu d'équipes l'emploient.

**Problème.** Passer d'un socle livré à un produit adopté.

**Application du concept.** Entretiens, mesure d'accueil et d'adoption, libre-service, feuille de route publique.

**Déroulé.**

1. L'équipe nomme une responsable de produit pour la plateforme interne, et recueille des entretiens auprès des douze équipes.
2. Elle liste les tâches les plus fréquentes : créer un paquet, le tester contre une version de la plateforme, le publier.
3. Elle publie un gabarit de paquet, un environnement éphémère et une documentation d'accueil, accessibles sans ticket.
4. Elle mesure, pour chaque capacité, la part d'équipes qui l'utilisent et le délai de premier déploiement des nouvelles équipes.
5. Les mesures montrent 92 % pour le pipeline, 58 % pour le gabarit, 25 % pour l'environnement éphémère, et une médiane de 11 heures avec une queue à 30 et 52 heures.
6. Les équipes de la queue sont interviewées : leur accueil bute sur des prérequis non documentés ; la documentation est corrigée.
7. Le résultat est publié avec la feuille de route du trimestre, et les équipes votent les priorités.

**Résultat.** Une plateforme dont l'usage progresse parce qu'elle simplifie des tâches réelles, avec des mesures qui montrent où elle échoue.

**Limites.** L'environnement éphémère reste à 25 % : l'équipe doit déterminer s'il manque de visibilité, d'utilité ou de simplicité avant d'y investir davantage.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifie traiter une plateforme comme un produit ?
2. **Compréhension.** Pourquoi un mandat ne suffit-il pas à garantir l'adoption d'une plateforme ?
3. **Compréhension.** Citez trois mesures d'une plateforme autres que sa disponibilité.
4. **Pourquoi.** Pourquoi le libre-service est-il une caractéristique déterminante d'une plateforme ?
5. **Raisonnement pratique.** Une capacité est adoptée par 25 % des équipes éligibles. Que faire avant de la rendre obligatoire ?

#### Réponses

1. Lui appliquer les pratiques d'un produit : connaître ses utilisateurs, formuler sa valeur, tenir une feuille de route, soigner l'accueil, mesurer l'adoption et la satisfaction, et la faire porter par une équipe durable.
2. Parce qu'un mandat produit un usage minimal et des contournements : les équipes emploient ce qu'elles ne peuvent pas éviter et construisent des solutions parallèles pour le reste. L'usage durable vient de la valeur perçue.
3. Par exemple le nombre d'utilisateurs actifs et leur rétention, la satisfaction des utilisateurs, et le délai avant le premier changement de code d'un nouvel utilisateur ; on peut ajouter les mesures de livraison des équipes qui consomment.
4. Parce que sans libre-service, chaque usage passe par la file d'une autre équipe : le couplage par les demandes persiste et la plateforme ne réduit ni les délais ni la coordination.
5. Comprendre pourquoi elle n'est pas adoptée : entretiens et observation de la première utilisation, vérification de la découvrabilité, de l'utilité et de la difficulté. Si la raison est un défaut du produit, on le corrige ; si c'est une exigence de sécurité, c'est un garde-fou et non une capacité optionnelle.

## 29.2 Équipe plateforme, topologies d'équipes et chemin balisé

### 1. Comprendre simplement

Une **équipe plateforme** (*platform team*) fournit aux équipes qui livrent de la valeur métier des capacités en libre-service. Les **topologies d'équipes** (*team topologies*) décrivent un petit nombre de types d'équipes et de modes d'interaction entre elles. Un **chemin balisé** (*golden path*) est la façon recommandée, outillée et supportée de réaliser une tâche courante : créer un service, un paquet, une intégration.

**Pourquoi cela existe.** La structure des équipes détermine celle des services (loi de Conway, [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service)). Quand chaque équipe fait tout, elle porte une charge cognitive excessive ; quand une équipe centrale décide de tout, elle devient un goulot. Il faut une structure où les équipes de produit se concentrent sur leur domaine, et où le socle est fourni par une équipe qui le traite comme un produit.

**Problème résolu.** Répartir les responsabilités pour que les équipes livrent vite sans réinventer le socle, et que la cohérence se fasse par la facilité plutôt que par l'obligation.

**Modèle mental.** Un réseau routier et ses aires de service. L'équipe plateforme entretient la route et les aires ; les équipes de produit conduisent là où elles veulent aller. Le chemin balisé est la route principale, bien signalée, avec de l'aide à portée : on peut prendre un chemin de traverse, mais sans l'aide.

**Où l'analogie s'arrête.** Une route est partagée par tous sans qu'ils aient à la configurer. Un chemin balisé est un outil à maintenir, qui vieillit quand les besoins changent.

**Exemple.** L'éditeur a des équipes alignées sur un flux de valeur (paquet maintenance aéronautique, paquet santé), une équipe plateforme (socle de configuration), une équipe d'appui en sécurité qui aide les autres à monter en compétence, et une équipe pour un sous-système complexe (moteur de règles). Le chemin balisé « créer un nouveau type de ressource avec workflow et droits » est un gabarit, une documentation, un pipeline et un soutien.

**Les composants.**

1. des **types d'équipes** : alignée sur un flux, plateforme, d'appui, de sous-système complexe ;
2. des **modes d'interaction** : collaboration, libre-service, facilitation ;
3. un **socle mince** et en libre-service ;
4. un **chemin balisé** : gabarit, documentation, contrôles, valeurs par défaut d'exploitation ;
5. des **garde-fous** obligatoires, distincts du chemin recommandé ;
6. un **soutien** différencié selon que l'on est sur le chemin ou non ;
7. des **mesures** de la charge cognitive et de l'usage du chemin.

**Objectif d'apprentissage :** vous pouvez nommer les types d'équipes et leurs modes d'interaction, décrire un chemin balisé, et distinguer ce qui est recommandé de ce qui est obligatoire.

### 2. Connaissances essentielles

#### Définition

- **Équipe plateforme** : groupe d'équipes qui fournit un produit interne convaincant, en libre-service, aux équipes alignées sur les flux de valeur.
- **Topologies d'équipes** : modèle qui décrit quatre types d'équipes fondamentaux et trois modes d'interaction pour organiser la livraison en limitant la charge cognitive.
- **Chemin balisé** : manière opinionnée et supportée de construire une chose courante, avec ses outils, sa documentation et son soutien, que l'on peut quitter en perdant le même niveau de soutien.

#### Idées fondamentales

1. **La structure d'équipes façonne l'architecture.** On choisit la première pour obtenir la seconde.
2. **Quatre types d'équipes suffisent.** Alignée sur un flux, d'appui, de sous-système complexe, plateforme.
3. **Trois modes d'interaction.** Collaboration pour un temps, libre-service en régime courant, facilitation pour faire monter en compétence.
4. **La plateforme est surtout un service.** Le mode ordinaire est le libre-service, pas la collaboration permanente.
5. **Le chemin balisé est recommandé et soutenu.** On le rend plus facile que l'alternative.
6. **Les garde-fous sont obligatoires.** Isolation du tenant, authentification, journalisation : ils ne dépendent pas du choix du chemin.
7. **La charge cognitive guide la répartition.** Chaque outil ou domaine ajouté à une équipe lui coûte.

#### Vocabulaire essentiel

- **Équipe plateforme et topologies d'équipes** (*platform team and team topologies*) : l'équipe qui offre le socle en libre-service, et le modèle qui décrit les types d'équipes et leurs interactions.
- **Équipe alignée sur un flux** (*stream-aligned team*) : équipe alignée sur un flux de travail d'un segment du domaine métier.
- **Équipe d'appui** (*enabling team*) : équipe qui aide les autres à surmonter des obstacles et repère les capacités manquantes.
- **Équipe de sous-système complexe** (*complicated-subsystem team*) : équipe dédiée à une expertise technique ou mathématique pointue.
- **Mode d'interaction** (*interaction mode*) : collaboration, libre-service (*X-as-a-Service*) ou facilitation.
- **Chemin balisé** (*golden path*, *paved road*) : voie recommandée, outillée et supportée.
- **Garde-fou** (*guardrail*) : contrôle obligatoire indépendant du chemin choisi.

#### Relations de cause à effet

- Une équipe centrale décide de tout. Elle devient un goulot, et les équipes attendent ses décisions.
- Chaque équipe construit son propre socle. La charge cognitive monte, les pratiques divergent et la sécurité varie.
- Le chemin est obligatoire sans être le plus simple. Les équipes le contournent ou l'emploient a minima.
- Les garde-fous sont facultatifs. Une équipe pressée les omet, et l'isolation ou l'authentification manquent là où elles comptent le plus.

#### Idées reçues

- **« Une équipe plateforme est une équipe d'exploitation. »** Non. Elle développe un produit interne ; l'exploitation en est une capacité parmi d'autres.
- **« Le chemin balisé est une obligation. »** Non. L'article de Spotify consulté présente un chemin « opinionné et supporté » que l'on peut quitter, mais sans bénéficier du même soutien.
- **« Plus la plateforme couvre de domaines, mieux c'est. »** Non. La page de Team Topologies parle de la plateforme viable minimale : juste assez de capacité, sans complexité inutile.

#### Principe clé

Une équipe plateforme offre un chemin balisé en libre-service, plus facile que l'alternative, et laisse des garde-fous obligatoires qui ne dépendent pas du chemin.

#### Si vous ne retenez que trois choses

1. Les équipes alignées sur un flux livrent la valeur, et la plateforme les décharge de ce qui n'est pas leur différence.
2. Un chemin balisé est recommandé, supporté et plus simple ; les garde-fous sont obligatoires.
3. L'interaction ordinaire avec la plateforme est le libre-service ; la collaboration est temporaire, la facilitation fait monter en compétence.

### 3. Explication technique détaillée

#### Les types d'équipes et les modes d'interaction

La page des concepts clés de Team Topologies (consultée le 14 octobre 2026) définit quatre types d'équipes fondamentaux : l'équipe alignée sur un flux, « alignée sur un flux de travail issu, en général, d'un segment du domaine métier » ; l'équipe d'appui, qui aide une équipe alignée à franchir des obstacles et repère les capacités manquantes ; l'équipe de sous-système complexe, pour les cas qui demandent une expertise mathématique, de calcul ou technique importante ; et l'équipe plateforme, « un groupe d'autres types d'équipes qui fournit un produit interne convaincant ». Trois modes d'interaction : la collaboration (travailler ensemble sur une période définie pour découvrir), le libre-service (une équipe fournit, une autre consomme) et la facilitation (une équipe aide et accompagne une autre). La page présente la plateforme viable minimale comme l'approche qui fournit juste assez de capacité sans complexité inutile, et rappelle que chaque outil, responsabilité ou domaine ajouté augmente la charge mentale d'une équipe.

| Équipe | Rôle dans la plateforme | Mode d'interaction ordinaire |
|---|---|---|
| Alignée sur un flux (paquet maintenance, paquet santé) | Livre de la valeur métier | Consomme la plateforme en libre-service |
| Plateforme (socle de configuration) | Fournit les capacités communes | Libre-service ; collaboration pour une nouvelle capacité |
| D'appui (sécurité, accessibilité) | Fait monter les équipes en compétence | Facilitation, pour une durée limitée |
| Sous-système complexe (moteur de règles) | Maîtrise une expertise pointue | Libre-service vers les autres |

#### Le chemin balisé

L'article d'ingénierie de Spotify sur les chemins balisés (août 2020, consulté le 14 octobre 2026) part d'un constat : l'autonomie des équipes avait fragmenté l'outillage, et les ingénieurs apprenaient à faire les choses en demandant à leurs collègues. Il définit le chemin balisé comme la manière « opinionnée et supportée » de construire une chose, avec un tutoriel pas à pas, des outils recommandés listés dans un portail de développement, et un soutien facile à trouver. Il précise que le but n'est pas de limiter les ingénieurs : ils peuvent quitter le chemin, mais ils n'auront pas le même soutien. Les éléments de preuve y sont qualitatifs (les tutoriels figurent parmi la documentation technique la plus lue de l'entreprise) ; l'article ne donne ni taux d'adoption ni gains mesurés, et il date de 2020.

Un chemin balisé comporte :

1. un **gabarit** qui crée le projet avec ses valeurs par défaut ;
2. une **documentation** pas à pas, avec ses exemples ;
3. un **pipeline** standard avec tests et contrôles de sécurité ;
4. des **valeurs par défaut d'exploitation** : journalisation, mesures, objectifs de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) ;
5. un **soutien** : canal, délais, escalade ;
6. un **chemin de sortie** : comment s'en écarter, et ce que cela coûte.

#### Garde-fous et chemin : deux choses

| | Chemin balisé | Garde-fous |
|---|---|---|
| Statut | Recommandé, soutenu, plus simple | Obligatoire pour tous |
| Exemples | Gabarit, pipeline standard, observabilité de série | Contexte de tenant, authentification, journalisation d'audit |
| Si on s'en écarte | Soutien réduit | Livraison refusée ou service bloqué |
| Contrôle | Mesure d'usage | Contrôle automatique au déploiement ([13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code), [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)) |

```typescript
interface ServiceDescriptor {
  name: string;
  createdFromTemplate: string | null;
  pipeline: string | null;
  observability: boolean;
  authProvider: string | null;
  tenantContext: boolean;
}

interface Finding {
  service: string;
  onPath: boolean;
  gaps: string[];
  guardrailViolations: string[];
}

function assess(s: ServiceDescriptor): Finding {
  const guardrailViolations: string[] = [];
  if (!s.tenantContext) guardrailViolations.push("contexte de tenant absent");
  if (!s.authProvider) guardrailViolations.push("authentification non branchée");
  const gaps: string[] = [];
  if (s.createdFromTemplate !== "service-standard") gaps.push("hors gabarit");
  if (s.pipeline !== "pipeline-standard") gaps.push("hors pipeline standard");
  if (!s.observability) gaps.push("observabilité absente");
  return { service: s.name, onPath: gaps.length === 0, gaps, guardrailViolations };
}
```

Sur trois services d'exemple : `assignation-taches` suit le chemin et respecte les garde-fous ; `export-qualite` est hors gabarit et hors pipeline standard (il perd le soutien associé) mais respecte les garde-fous ; `import-legacy` est hors chemin, sans observabilité, et enfreint deux garde-fous (contexte de tenant et authentification) : il est bloqué au déploiement, non simplement « moins soutenu ». La nuance compte : s'écarter du chemin est un choix assumé, enfreindre un garde-fou n'en est pas un.

#### Limiter la charge cognitive

La page de Team Topologies ne donne ni seuil ni méthode de mesure de la charge cognitive. On l'aborde par des signaux : nombre de technologies à maîtriser par équipe, durée d'accueil d'une nouvelle personne, fréquence des demandes d'aide sur les mêmes sujets, et retours des équipes. Quand une équipe de produit porte trop, on déplace la capacité vers la plateforme ou vers une équipe d'appui ; quand la plateforme croît trop, on la découpe ou on la rend plus mince.

**Modes de défaillance.**

- **Équipe plateforme transformée en file de tickets.**
- **Chemin obligatoire** sans être le plus simple.
- **Garde-fous facultatifs** : ils sautent sous la pression.
- **Chemin jamais mis à jour** : il vieillit et devient un frein.
- **Équipe d'appui permanente** : elle devient une dépendance.
- **Charge cognitive non suivie.**

**Contre-exemple.** L'équipe Plateforme exige que tout nouveau service passe par un formulaire de demande validé par quatre personnes, « pour assurer la cohérence ». Les délais atteignent trois semaines ; deux équipes déploient leurs services hors du processus, sans contexte de tenant ni journalisation. Un gabarit en libre-service, des contrôles automatiques de garde-fous et un soutien différencié auraient produit la cohérence par la facilité.

**Limites.** Les types d'équipes ne remplacent pas un organigramme : la page de Team Topologies précise que l'approche sert à comprendre le flux du travail. Un chemin balisé demande un entretien continu, sinon il se périme. Le soutien réduit hors du chemin n'est une incitation que si le chemin est réellement plus simple. Et la loi de Conway cesse d'aider quand on la cite sans agir sur les équipes.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.11 Frontières de service](01-architecture-saas.md#111-frontières-de-service) | La loi de Conway justifie de façonner les équipes pour façonner les services |
| [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur) | La plateforme développeur est la surface en libre-service de l'équipe plateforme |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les objectifs de service font partie des valeurs par défaut d'exploitation du chemin |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les garde-fous s'expriment en politiques vérifiées automatiquement |
| [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) | Le pipeline d'intégration continue est une pièce du chemin balisé |
| [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | Les portes de qualité appliquent les garde-fous au déploiement |
| [29.1 La plateforme comme produit](#291-la-plateforme-comme-produit) | L'équipe plateforme porte le produit interne |
| [29.6 Écosystème de partenaires et gouvernance d'architecture](#296-écosystème-de-partenaires-et-gouvernance-darchitecture) | La gouvernance d'architecture fixe les garde-fous et les exceptions |

### 5. Application pratique

**Situation initiale.** Les douze équipes de paquets métier de l'éditeur créent leurs services de façons différentes ; la revue de sécurité trouve des écarts sur le contexte de tenant et la journalisation.

**Problème.** Obtenir la cohérence sans transformer l'équipe plateforme en guichet.

**Application du concept.** Un chemin balisé en libre-service, des garde-fous automatiques, et un soutien différencié.

**Déroulé.**

1. L'équipe Plateforme publie le gabarit `service-standard` : contexte de tenant, authentification, journalisation, pipeline et objectifs de service préconfigurés.
2. Un tutoriel pas à pas accompagne le gabarit ; un canal de soutien répond en un jour ouvré.
3. Le pipeline applique les garde-fous : un service sans contexte de tenant ou sans authentification ne se déploie pas.
4. Un tableau suit, par service, s'il est sur le chemin (gabarit, pipeline, observabilité) et les écarts de garde-fous.
5. Une équipe d'appui en sécurité accompagne trois équipes pendant un mois pour migrer vers le gabarit, puis se retire.
6. Une équipe qui a des besoins particuliers sort du chemin avec une décision enregistrée ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)), garde les garde-fous et assume son soutien.
7. L'équipe Plateforme met à jour le gabarit chaque trimestre à partir des retours.

**Résultat.** Les nouveaux services suivent le chemin parce qu'il est le plus simple, les garde-fous sont appliqués partout, et les écarts sont des décisions visibles.

**Limites.** L'écart entre le chemin et la réalité grandit si les mises à jour du gabarit prennent du retard : il faut un propriétaire et un budget d'entretien.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les quatre types d'équipes fondamentaux de Team Topologies ?
2. **Compréhension.** Quelle différence y a-t-il entre un chemin balisé et un garde-fou ?
3. **Compréhension.** Quels sont les trois modes d'interaction entre équipes ?
4. **Pourquoi.** Pourquoi la charge cognitive est-elle un critère de répartition des responsabilités ?
5. **Raisonnement pratique.** Un service est hors gabarit mais respecte tous les garde-fous. Que décide-t-on ?

#### Réponses

1. L'équipe alignée sur un flux, l'équipe d'appui, l'équipe de sous-système complexe et l'équipe plateforme.
2. Le chemin balisé est recommandé et soutenu, on peut le quitter en perdant le soutien ; le garde-fou est un contrôle obligatoire, indépendant du chemin, dont la violation bloque la livraison.
3. La collaboration (travailler ensemble sur une période définie), le libre-service (une équipe fournit, l'autre consomme) et la facilitation (une équipe aide et accompagne une autre).
4. Parce qu'une équipe qui doit maîtriser trop de technologies et de domaines décide plus mal et plus lentement : on répartit pour que chaque équipe porte ce qu'elle peut maîtriser.
5. Il peut rester hors du chemin : c'est un choix assumé, avec un soutien réduit et, si l'écart est durable, une décision enregistrée. Comme il respecte les garde-fous, rien ne bloque son déploiement.

## 29.3 Gouvernance des API et politique de dépréciation

### 1. Comprendre simplement

La **gouvernance des API** (*API governance*) est l'ensemble des règles, des rôles et des contrôles qui rendent les API d'une plateforme cohérentes, compatibles et durables : conventions de conception, revue, catalogue, cycle de vie. La **politique de dépréciation** (*deprecation policy*) décrit comment une API ou une fonction est retirée : annonce, période de coexistence, signaux techniques, retrait. Elle s'ajoute au versionnement d'API ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)), qui dit comment on nomme et on distingue les versions.

**Pourquoi cela existe.** Les API de la plateforme sont consommées par des intégrations de clients, de partenaires et d'équipes internes. Un changement cassant brise des systèmes sur lesquels la plateforme n'a pas la main. Et sans règles communes, chaque équipe nomme, pagine et signale les erreurs à sa façon, ce qui rend la plateforme difficile à utiliser.

**Problème résolu.** Faire évoluer les API sans casser les consommateurs, et en garder une surface cohérente à mesure que les équipes se multiplient.

**Modèle mental.** La signalisation d'un chantier routier : le chantier est annoncé à l'avance, une déviation est indiquée, la route ancienne est fermée à une date connue.

**Où l'analogie s'arrête.** Les conducteurs voient les panneaux. Les consommateurs d'une API sont des programmes que personne ne regarde : l'annonce doit aussi être faite aux humains qui en répondent, par un canal qu'ils lisent.

**Exemple.** L'équipe qualité veut retirer le champ `assignee` de la tâche au profit de `assignee_id`. La politique impose de le déprécier d'abord, d'annoncer une date de retrait, d'émettre des en-têtes de dépréciation et de retrait, de mesurer qui appelle encore l'ancienne forme, et de ne retirer qu'à l'échéance.

**Les composants.**

1. des **conventions** de conception ([10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)) ;
2. une **revue** de conception et des contrôles automatiques ;
3. un **catalogue** des API et de leurs propriétaires ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)) ;
4. des **états de cycle de vie** : aperçu, stable, déprécié, retiré ;
5. une **classification** des changements : cassant ou additif ;
6. une **politique de préavis** par niveau de stabilité ;
7. des **signaux** : en-têtes, documentation, notifications ;
8. une **mesure** de l'usage résiduel.

**Objectif d'apprentissage :** vous pouvez classer un changement d'API, choisir l'incrément de version correspondant, et décrire les étapes et les signaux d'une dépréciation.

### 2. Connaissances essentielles

#### Définition

- **Gouvernance des API** : ensemble des conventions, rôles, revues et contrôles qui encadrent la conception, l'évolution et le retrait des API d'une plateforme.
- **Politique de dépréciation** : engagement documenté sur la manière dont une capacité est annoncée comme appelée à disparaître, maintenue pendant une durée, puis retirée.

#### Idées fondamentales

1. **Une API est un engagement.** Ses consommateurs en dépendent ; la modifier est un acte à gouverner.
2. **Il faut classer les changements.** Additif (compatible) ou cassant ; l'un se livre tel quel, l'autre se gouverne.
3. **La dépréciation précède le retrait.** La capacité continue de fonctionner, avec un avertissement et une date.
4. **Les signaux sont techniques et humains.** En-têtes dans les réponses, documentation, courriels et notifications.
5. **Le préavis dépend du niveau de stabilité.** Un aperçu peut changer vite ; une API stable demande un long préavis.
6. **On mesure l'usage résiduel.** On retire quand on sait qui appelle encore, pas seulement à la date prévue.
7. **La cohérence est une propriété de la plateforme.** Des conventions communes valent mieux que des conventions parfaites.

#### Vocabulaire essentiel

- **Gouvernance des API et politique de dépréciation** (*API governance and deprecation policy*) : les règles qui encadrent la conception et l'évolution des API, et l'engagement sur la façon dont une capacité est retirée.
- **Changement cassant** (*breaking change*) : modification qui peut faire échouer un consommateur correct de la version précédente.
- **Changement additif** (*additive change*) : modification compatible, comme l'ajout d'un champ de réponse ou d'une opération.
- **Dépréciation** (*deprecation*) : état d'une capacité qui fonctionne encore mais dont le retrait est annoncé.
- **Retrait** (*sunset*, *retirement*) : fin de la disponibilité d'une capacité.
- **Version sémantique** (*semantic versioning*) : numérotation MAJEUR.MINEUR.CORRECTIF liée à la compatibilité.
- **Usage résiduel** (*residual usage*) : appels qui continuent à employer la capacité dépréciée.

#### Relations de cause à effet

- Un champ est retiré sans annonce. Les intégrations des clients cassent, souvent un vendredi soir, et la confiance baisse.
- Aucune classification des changements n'existe. Chaque équipe décide pour elle-même de ce qui est compatible.
- On ne dépréciera jamais rien. Les versions s'accumulent, le coût de maintenance monte, et les équipes ne peuvent plus évoluer.
- La date de retrait est fixée sans mesure d'usage. Des clients importants sont coupés par surprise.

#### Idées reçues

- **« Ajouter un champ est toujours sûr. »** Presque : cela suppose que les consommateurs ignorent les champs inconnus. Un paramètre de requête obligatoire ajouté, lui, est cassant.
- **« Déprécier, c'est retirer. »** Non. La dépréciation signale ; la RFC 9745 précise qu'elle ne change pas le comportement de la ressource.
- **« La version sémantique règle le préavis. »** Non. Elle dit comment numéroter ; elle exige une version mineure portant la dépréciation avant le retrait en version majeure, mais n'impose aucune durée.

#### Principe clé

Chaque changement d'API est classé, chaque retrait est précédé d'une dépréciation annoncée et mesurée, et le préavis est un engagement de la plateforme.

#### Si vous ne retenez que trois choses

1. Un changement cassant ne se livre pas comme un changement additif : il passe par une dépréciation et une version majeure.
2. La dépréciation est un état visible, avec des en-têtes, une date de retrait et une documentation de migration.
3. On retire quand l'usage résiduel est connu et traité, pas seulement quand la date est arrivée.

### 3. Explication technique détaillée

#### Classer les changements

```typescript
interface Endpoint {
  method: string;
  path: string;
  requiredParams: string[];
  optionalParams: string[];
  responseFields: Record<string, string>; // nom -> type
}

interface Change {
  kind: "breaking" | "additive";
  what: string;
}

function diffApi(oldApi: Endpoint[], newApi: Endpoint[]): { changes: Change[]; bump: "major" | "minor" | "patch" } {
  const changes: Change[] = [];
  const key = (e: Endpoint) => `${e.method} ${e.path}`;
  const newByKey = new Map(newApi.map((e) => [key(e), e]));
  const oldByKey = new Map(oldApi.map((e) => [key(e), e]));
  for (const o of oldApi) {
    const n = newByKey.get(key(o));
    if (!n) {
      changes.push({ kind: "breaking", what: `opération retirée : ${key(o)}` });
      continue;
    }
    for (const p of n.requiredParams) {
      if (!o.requiredParams.includes(p)) {
        changes.push({ kind: "breaking", what: `paramètre obligatoire ajouté : ${key(o)} ${p}` });
      }
    }
    for (const [field, type] of Object.entries(o.responseFields)) {
      if (!(field in n.responseFields)) changes.push({ kind: "breaking", what: `champ de réponse retiré : ${key(o)} ${field}` });
      else if (n.responseFields[field] !== type) changes.push({ kind: "breaking", what: `type de champ modifié : ${key(o)} ${field}` });
    }
    for (const field of Object.keys(n.responseFields)) {
      if (!(field in o.responseFields)) changes.push({ kind: "additive", what: `champ de réponse ajouté : ${key(o)} ${field}` });
    }
  }
  for (const n of newApi) {
    if (!oldByKey.has(key(n))) changes.push({ kind: "additive", what: `opération ajoutée : ${key(n)}` });
  }
  const bump = changes.some((c) => c.kind === "breaking") ? "major" : changes.length > 0 ? "minor" : "patch";
  return { changes, bump };
}
```

Sur une API de tâches `v1` (lecture d'une tâche avec `id`, `title`, `assignee`, et création avec `title` obligatoire), trois comparaisons donnent : l'ajout d'un champ `due_at` et d'une opération de liste est additif, donc un incrément mineur ; le retrait de `assignee` et l'ajout d'un paramètre obligatoire `aircraft_id` à la création sont cassants, donc un incrément majeur (l'ajout de `assignee_id` est additif mais ne rachète pas le retrait) ; l'absence de différence ne demande qu'un correctif. Ce contrôle tourne dans le pipeline ([21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)), comme le contrôle de compatibilité des schémas d'événements ([28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité)) : une fusion qui introduit un changement cassant sans la décision correspondante est bloquée.

#### La version sémantique

La spécification de la version sémantique 2.0.0 (consultée le 14 octobre 2026) pose que le logiciel qui l'emploie doit déclarer une API publique ; que le numéro majeur augmente pour des changements d'API incompatibles, le numéro mineur pour des ajouts compatibles, le correctif pour des corrections compatibles ; qu'une version publiée ne se modifie pas ; que la version majeure zéro est celle du développement initial, où tout peut changer. Pour la dépréciation, elle demande d'émettre une version mineure qui porte la dépréciation, et de ne retirer la fonction qu'en version majeure, après au moins une version mineure qui la déprécie. Elle ne fixe pas de durée.

#### Les étapes d'une dépréciation

```text
stable ──► dépréciée (fonctionne, avertit) ──► retrait annoncé ──► retirée
             annonce + en-têtes + doc            date de coupure
             mesure de l'usage résiduel          derniers appels traités
```

Deux en-têtes HTTP normalisés portent les signaux. La RFC 9745 (mars 2025, voie de normalisation) définit l'en-tête `Deprecation`, dont la valeur est une date : elle signale qu'une ressource « sera ou a été » dépréciée, sans changer son comportement ; la date peut être future ou passée. La RFC 8594 (mai 2019, informationnelle) définit l'en-tête `Sunset`, qui indique le moment où la ressource devrait cesser de répondre ; elle précise que l'en-tête ne convient pas à la première étape (dépréciation), seulement à la seconde. La RFC 9745 ajoute que la date de `Sunset` ne doit pas être antérieure à celle de `Deprecation`, et qu'un lien de relation `deprecation` peut pointer vers la documentation (politique, calendrier, guide de migration).

```http
Deprecation: @1791968400
Sunset: Thu, 14 Oct 2027 09:00:00 GMT
Link: <https://developers.platform.example/deprecations/tasks-assignee>; rel="deprecation"; type="text/html"
```

Dans l'exemple, la dépréciation prend effet le 14 octobre 2026 à 9 h UTC (l'horodatage Unix 1791968400) et le retrait est annoncé pour le 14 octobre 2027, soit douze mois plus tard. Les en-têtes sont aussi des données : ils sont produits à partir du catalogue d'API, pas écrits à la main.

#### Mesurer l'usage résiduel

```sql
SELECT tenant_id, client_id, count(*) AS calls, max(called_at) AS last_call
FROM api_call_log
WHERE api_version = 'v1'
  AND called_at >= now() - interval '30 days'
GROUP BY tenant_id, client_id
ORDER BY calls DESC;
```

La requête dit quels tenants et quels clients appellent encore l'ancienne version, et combien. Elle alimente les messages ciblés ([17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires)) et la décision de retrait : on contacte les plus gros appelants, on propose de l'aide à la migration, et l'on reporte au besoin la date, avec une annonce.

#### Une politique par niveau de stabilité

| Niveau | Engagement | Préavis de retrait (exemple) | Signaux |
|---|---|---|---|
| Aperçu | Peut changer ou disparaître | 30 jours | Documentation, mention dans la réponse |
| Stable | Compatibilité arrière durant la version | 12 mois | En-têtes, documentation, notification, contact ciblé |
| Contractuelle | Engagement écrit avec un client | Selon le contrat | Idem, plus échange direct |

Les durées sont des exemples : elles se décident avec les clients, les équipes juridiques et la capacité de maintenance, et elles sont publiées. Un correctif de sécurité urgent peut déroger : la politique prévoit cette exception, avec sa justification.

#### Conventions et revue

La gouvernance d'API comprend aussi des **conventions communes** : noms, pagination et filtrage ([10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)), format des erreurs, identifiants, en-têtes. On les automatise par des règles de contrôle sur la spécification (lint) et l'on réserve la revue humaine aux nouvelles ressources ou aux changements cassants. Le catalogue ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)) tient, pour chaque API, son propriétaire, son niveau de stabilité, ses consommateurs connus et son calendrier de dépréciation.

**Modes de défaillance.**

- **Retrait sans annonce.**
- **Aucune classification** des changements.
- **Dépréciation sans date** ni mesure d'usage.
- **En-têtes absents** : les machines ne sont pas prévenues.
- **Versions éternelles** : rien n'est jamais retiré.
- **Conventions non contrôlées** : elles dérivent.

**Contre-exemple.** L'équipe qualité renomme `assignee` en `assignee_id` « pour la cohérence » dans la version courante, sans annonce. Trois intégrations de clients, qui lisaient `assignee`, reçoivent une valeur absente et affichent des tâches sans responsable. Le support apprend le changement par les clients. Une dépréciation annoncée douze mois à l'avance, avec les deux champs servis en parallèle et les appelants mesurés, aurait permis une migration sans surprise.

**Limites.** Un préavis long a un coût : il faut maintenir les deux formes. Les consommateurs ne lisent pas toujours les annonces : la mesure et le contact direct complètent les en-têtes. Un engagement contractuel peut fixer un préavis plus long que la politique. Et la gouvernance trop lourde freine l'évolution : on la proportionne à la criticité de l'API.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest) | Les API et leurs spécifications sont l'objet de la gouvernance |
| [10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage) | Les conventions de pagination et de filtrage font partie des règles communes |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API fournit les mécanismes, que la politique encadre par des engagements |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | Le service de notifications relaie les annonces de dépréciation aux destinataires concernés |
| [20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données) | Le catalogue référence les API, leurs propriétaires et leur cycle de vie |
| [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | Le pipeline bloque les changements cassants non décidés |
| [23.8 Propriété, dépréciation, composition, licence et droits d'usage](23-solutions-verticales-packagees.md#238-propriété-dépréciation-composition-licence-et-droits-dusage) | La dépréciation de composants s'applique aussi aux paquets |
| [28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité) | Les règles de compatibilité des schémas d'événements suivent la même logique |

### 5. Application pratique

**Situation initiale.** L'équipe qualité veut remplacer le champ `assignee` de la tâche par `assignee_id` et rendre `aircraft_id` obligatoire à la création. Soixante-dix intégrations de clients lisent l'API.

**Problème.** Faire ces deux changements sans casser les intégrations.

**Application du concept.** Classification des changements, dépréciation annoncée, signaux, mesure d'usage et retrait à l'échéance.

**Déroulé.**

1. Le contrôle de différences classe le retrait de `assignee` et le nouveau paramètre obligatoire comme cassants ; l'ajout de `assignee_id` est additif.
2. L'équipe livre d'abord `assignee_id` en version mineure, en servant les deux champs, et déclare `assignee` déprécié.
3. Elle rend `aircraft_id` facultatif avec un avertissement dans la réponse, et planifie son caractère obligatoire pour la prochaine version majeure.
4. Les réponses portent l'en-tête de dépréciation, l'en-tête de retrait (douze mois) et le lien vers le guide de migration.
5. Une requête mesure chaque mois qui appelle encore l'ancienne forme ; les tenants concernés reçoivent un message ciblé avec l'offre d'aide.
6. À trois mois de l'échéance, une dizaine de clients sont encore concernés ; le support les contacte individuellement.
7. À l'échéance, le champ est retiré en version majeure ; les retardataires connus ont été traités ou ont reçu un report documenté.

**Résultat.** Les deux changements sont livrés, sans coupure surprise, avec une trace de ce qui a été annoncé, mesuré et accordé.

**Limites.** Pendant douze mois, l'API sert deux formes : le coût de maintenance est réel et doit figurer dans le calendrier de l'équipe.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels changements d'API sont cassants, et lesquels sont additifs ?
2. **Compréhension.** Quelle différence y a-t-il entre l'en-tête de dépréciation et l'en-tête de retrait ?
3. **Compréhension.** Que demande la version sémantique avant de retirer une fonction ?
4. **Pourquoi.** Pourquoi mesure-t-on l'usage résiduel avant de retirer une version ?
5. **Raisonnement pratique.** Une équipe veut renommer un champ de réponse. Quelles étapes suit-elle ?

#### Réponses

1. Sont cassants : retirer une opération ou un champ de réponse, modifier le type d'un champ, ajouter un paramètre de requête obligatoire. Sont additifs : ajouter un champ de réponse, une opération ou un paramètre facultatif.
2. L'en-tête de dépréciation signale qu'une ressource est ou sera dépréciée, sans changer son comportement ; l'en-tête de retrait indique le moment où elle devrait cesser de répondre. La date de retrait ne doit pas précéder celle de dépréciation.
3. D'émettre au moins une version mineure qui contient la dépréciation, puis de ne retirer la fonction que dans une version majeure.
4. Pour savoir qui serait coupé, les contacter et les aider, ou reporter la date : un retrait à la date prévue sans cette mesure coupe des clients par surprise.
5. Ajouter le nouveau champ en servant les deux, déprécier l'ancien avec annonce, en-têtes et guide de migration, mesurer l'usage de l'ancien, contacter les appelants restants, puis retirer l'ancien en version majeure à l'échéance.

## 29.4 Construire ou acheter, open source et licences, dépendance et portabilité

### 1. Comprendre simplement

**Construire ou acheter** (*build versus buy*) consiste à décider si une capacité est développée en interne, achetée (produit ou service), ou adoptée à partir d'un logiciel libre. Les **licences open source** (*open source and licensing*) fixent les droits et les conditions d'usage d'un logiciel publié : l'Open Source Initiative définit en dix critères ce qu'est une licence open source, et les licences se rangent en familles (permissives, à copyleft). La **dépendance** (*vendor lock-in*) est le coût de changer de fournisseur ou de produit ; la **portabilité** (*portability*) est la capacité de partir.

**Pourquoi cela existe.** Une plateforme repose sur des centaines de composants : bases de données, moteurs de recherche, bibliothèques, services gérés. Chaque décision d'acquisition engage pour des années. Sans méthode, on fabrique ce qu'on pourrait acheter, on achète ce qui différencie le produit, on ignore les conditions des licences et l'on découvre le coût de sortie le jour où l'on doit partir.

**Problème résolu.** Décider de façon explicite et réversible, garder le contrôle de ce qui différencie la plateforme, connaître les obligations attachées aux composants, et chiffrer ce qu'une sortie coûterait.

**Modèle mental.** Posséder ou louer un local. Posséder donne le contrôle et la charge de l'entretien ; louer donne de la souplesse et des clauses de résiliation. Une licence est le bail : on le lit avant de signer.

**Où l'analogie s'arrête.** Un local se déménage. Un composant logiciel intégré à une plateforme est entremêlé à ses données, ses processus et ses compétences : la sortie est un projet, pas un déménagement.

**Exemple.** L'éditeur doit choisir : le moteur de recherche (adopter un logiciel libre), l'envoi de notifications push (acheter un service), le moteur de règles du domaine aéronautique (construire, car il différencie), une bibliothèque de génération de documents (open source sous une licence à examiner).

**Les composants.**

1. des **critères de décision** : différenciation, coût total, risque, délai, compétences, contrôle des données, sortie ;
2. un **inventaire** des dépendances et de leurs licences ;
3. une **politique de licences** ;
4. une **analyse du verrouillage** : formes, coût de sortie, probabilité ;
5. un **plan de sortie** pour les composants critiques ;
6. un **enregistrement** de la décision ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)).

**Objectif d'apprentissage :** vous pouvez justifier une décision de construire, d'acheter ou d'adopter, lire une licence par sa famille, et dire pourquoi un coût de sortie se pèse par sa probabilité.

### 2. Connaissances essentielles

#### Définition

- **Construire ou acheter** : arbitrage entre développer une capacité soi-même et l'obtenir d'un tiers (produit, service ou logiciel libre), selon son caractère différenciant, son coût total et ses risques.
- **Licence open source** : licence qui respecte les critères de la définition de l'Open Source Initiative, notamment la libre redistribution et la disponibilité du code source.
- **Verrouillage** (*lock-in*) : dépendance qui rend un changement de fournisseur ou de produit coûteux ; **portabilité** : aptitude à effectuer ce changement à un coût acceptable.

#### Idées fondamentales

1. **On construit ce qui différencie.** On achète ou adopte le reste, sauf contrainte particulière.
2. **Le coût total inclut tout.** Développement, exploitation, maintenance, compétences et sortie.
3. **Une licence est une condition d'usage.** Elle se lit par sa famille et ses obligations, avant l'intégration.
4. **Open source n'est pas « sans condition ».** Certaines licences imposent des obligations de partage ; d'autres presque aucune.
5. **Le verrouillage n'est pas binaire.** Il a plusieurs formes, qu'on pèse séparément.
6. **Un coût de sortie se pèse par sa probabilité.** Un coût élevé que l'on n'aura probablement jamais à payer ne justifie pas un grand investissement d'évitement.
7. **Une licence peut changer.** Pour les versions futures : on prévoit la possibilité de rester sur une version ou de la reprendre.

#### Vocabulaire essentiel

- **Licence permissive** (*permissive licence*) : licence qui autorise l'usage, la modification et la redistribution avec peu d'obligations, par exemple de conserver la notice.
- **Copyleft** (*copyleft*) : méthode qui exige que les versions modifiées et étendues restent libres.
- **Source disponible** (*source-available*) : code publié sous des conditions qui ne respectent pas tous les critères de l'open source.
- **Identifiant SPDX** (*SPDX identifier*) : code court et normalisé d'une licence, comme `MIT` ou `Apache-2.0`.
- **Coût total de possession** (*total cost of ownership*) : somme des coûts d'acquisition, d'exploitation, de maintenance et de sortie.
- **Plan de sortie** (*exit plan*) : description des étapes et des coûts pour remplacer un composant critique.

#### Relations de cause à effet

- Une capacité banalisée est construite en interne. L'équipe porte sa maintenance sans en tirer d'avantage, et ne construit pas ce qui différencie.
- Un composant différenciant est acheté. La plateforme dépend du rythme d'un tiers pour ce qui la distingue.
- Les licences ne sont pas inventoriées. Une obligation de partage ou une restriction d'usage est découverte lors d'un audit ou d'une vente.
- Tout est abstrait « pour éviter le verrouillage ». La complexité augmente, les abstractions fuient, et l'on ne bénéficie pas des fonctions propres du produit.

#### Idées reçues

- **« Open source, c'est gratuit et sans risque. »** Non. Le coût d'exploitation, de sécurité et de compétences demeure, et les licences portent des conditions.
- **« Le logiciel libre supprime le verrouillage. »** Non. L'article de Gregor Hohpe note qu'il réduit le verrouillage vis-à-vis du fournisseur mais pas celui du produit, de la version, de l'architecture ou des compétences.
- **« Il faut éviter tout verrouillage. »** Non. Le même article présente l'évitement comme l'achat d'une option dont le prix est une complexité : sur-investir dans la flexibilité est une erreur courante.

#### Principe clé

On construit ce qui différencie, on achète ou adopte le reste en connaissant les licences, et l'on dimensionne l'effort de portabilité au coût de sortie pondéré par sa probabilité.

#### Si vous ne retenez que trois choses

1. On construit le différenciant et l'on acquiert le banalisé, avec une décision enregistrée.
2. On lit les licences par famille et l'on tient un inventaire des dépendances.
3. On pèse le verrouillage par forme, coût de sortie et probabilité, et l'on prépare une sortie pour les composants critiques.

### 3. Explication technique détaillée

#### Les critères de décision

| Critère | Question | Penche vers construire si… | Penche vers acheter ou adopter si… |
|---|---|---|---|
| Différenciation | Cela distingue-t-il la plateforme ? | Oui | Non, c'est banalisé |
| Coût total | Développement + exploitation + sortie, sur cinq ans ? | Le coût d'acquisition croît avec l'usage | Le marché amortit le coût |
| Délai | Quand en a-t-on besoin ? | Le besoin est spécifique et le délai souple | Le délai est court |
| Compétences | Peut-on porter la maintenance ? | Compétence interne rare mais disponible | Compétence absente ou rare |
| Contrôle des données | Où vont les données, qui les traite ? | Contraintes fortes de résidence ou de confidentialité | Un sous-traitant encadré suffit ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) |
| Sortie | Que coûterait un départ ? | — | Le coût de sortie est acceptable ou limité par des standards ([28.1 Normes d'échange sectorielles](28-interoperabilite-avancee.md#281-normes-déchange-sectorielles)) |

Sur les quatre exemples de l'éditeur : le moteur de règles est construit (différenciant) ; le moteur de recherche est adopté (banalisé, communauté active) ; les notifications push sont achetées (service géré, coût proportionnel à l'usage) ; la bibliothèque de génération de documents est adoptée sous réserve d'un examen de la licence. La décision est enregistrée avec ses alternatives ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)).

#### Les formes de verrouillage

L'article de Gregor Hohpe publié sur le site de Martin Fowler (septembre 2019, consulté le 14 octobre 2026) affirme que le verrouillage n'est pas tout ou rien et en distingue plusieurs formes :

| Forme | Description |
|---|---|
| Fournisseur | Difficulté de passer à un concurrent, souvent liée à des engagements commerciaux |
| Produit | Dépendance aux API et fonctions d'un produit précis |
| Version | Attache à une version, dont la mise à jour peut demander des réécritures |
| Architecture | Attache à un style, par exemple des microservices en conteneurs |
| Plateforme | Dépendance aux services d'identité, de sécurité et propriétaires d'un nuage |
| Compétences | Coût de formation ou de recrutement |
| Juridique | Contraintes de conformité, de résidence des données ou de licence |
| Mentale | Hypothèses héritées qui font rejeter des alternatives |

L'article propose deux grilles : le coût de changement contre l'utilité unique (quatre quadrants : jetable, verrouillage accepté, prudence, idéal), puis la séparation du coût de changement et de la probabilité de changer. Il traite le coût de changement comme le prix d'exercice d'une option : un changement à 50 000 avec 5 % de probabilité a un coût attendu d'environ 2 500, et dépenser beaucoup pour ramener le coût de changement près de zéro rarement se justifie. Il liste le coût de l'évitement (effort, dépense, sous-utilisation, complexité, nouveaux verrouillages), prévient que les couches d'abstraction ajoutent de la complexité et fuient, et recommande la prudence envers le multinuage.

```typescript
function lockInExposure(switchCost: number, likelihood: number, avoidanceCost: number) {
  const expected = switchCost * likelihood;
  return { expected, avoidIt: avoidanceCost < expected };
}
```

Avec les chiffres illustratifs de l'article, un changement à 50 000 et 5 % de probabilité a un coût attendu de 2 500 : un effort d'évitement de 10 000 ne se justifie pas, un effort de 1 000 oui. Pour un composant dont la sortie coûterait 400 000 avec 30 % de chances, le coût attendu est de 120 000, et un effort de 40 000 se justifie. Ces chiffres sont des illustrations, et le calcul est un guide pour la discussion, pas une preuve.

#### Les licences

La définition de l'open source de l'Open Source Initiative (page consultée le 14 octobre 2026) liste dix critères : libre redistribution, code source, œuvres dérivées, intégrité du code source de l'auteur, pas de discrimination contre des personnes ou des groupes, pas de discrimination contre des domaines d'activité, distribution de la licence, licence non spécifique à un produit, licence ne restreignant pas d'autres logiciels, licence neutre sur le plan technologique. La page du projet GNU sur le copyleft (consultée à la même date) le décrit comme une méthode générale pour rendre un programme libre en exigeant que les versions modifiées et étendues le restent aussi, et présente la licence publique générale Affero comme une forme alternative pour les logiciels utilisés sur des serveurs, et la licence publique générale limitée comme une forme de compromis pour certaines bibliothèques. La liste des licences du projet SPDX (version 3.29.0 du 16 septembre 2026) fournit les identifiants courts : `MIT`, `Apache-2.0`, `BSD-3-Clause`, `LGPL-3.0-only`, `MPL-2.0`, `GPL-3.0-only`, `AGPL-3.0-only`, `BUSL-1.1`.

| Famille | Exemples d'identifiants | Idée générale | Traitement d'une politique d'exemple |
|---|---|---|---|
| Permissive | `MIT`, `Apache-2.0`, `BSD-3-Clause` | Peu d'obligations | Autorisée |
| Copyleft faible ou limité | `LGPL-3.0-only`, `MPL-2.0` | Les modifications du composant restent libres | Examen selon l'usage |
| Copyleft fort ou réseau | `GPL-3.0-only`, `AGPL-3.0-only` | Les œuvres dérivées ou l'usage en réseau étendent les conditions | Bloquée sauf décision |
| Source disponible | `BUSL-1.1` | Code visible, usages restreints | Bloquée sauf décision |
| Propriétaire | Contrat | Selon le contrat | Examen au cas par cas |

```typescript
type Verdict = "allowed" | "review" | "blocked";

interface Dependency {
  name: string;
  spdx: string;
  usage: "embedded" | "network_service" | "build_tool";
}

// Politique d'exemple : à valider avec le service juridique, ce n'est pas un avis juridique.
const POLICY: Record<string, Verdict> = {
  MIT: "allowed",
  "Apache-2.0": "allowed",
  "BSD-3-Clause": "allowed",
  "LGPL-3.0-only": "review",
  "MPL-2.0": "review",
  "GPL-3.0-only": "blocked",
  "AGPL-3.0-only": "blocked",
  "BUSL-1.1": "blocked",
};

function checkLicenses(deps: Dependency[]): { name: string; spdx: string; verdict: Verdict; note: string }[] {
  return deps.map((d) => {
    const known = POLICY[d.spdx];
    const verdict = known ?? "review";
    const relaxed = d.usage === "build_tool" && verdict === "blocked";
    const note = known === undefined ? "licence inconnue de la politique" : relaxed ? "outil de build : à confirmer" : "";
    return { name: d.name, spdx: d.spdx, verdict: relaxed ? "review" : verdict, note };
  });
}
```

Sur six dépendances d'exemple : une bibliothèque `MIT` est autorisée ; une bibliothèque `AGPL-3.0-only` embarquée est bloquée ; un outil de build sous `GPL-3.0-only` passe en examen (usage de construction, à confirmer) ; un service sous `BUSL-1.1` est bloqué ; une bibliothèque `LGPL-3.0-only` passe en examen ; une licence inconnue (`Custom-EULA`) passe en examen. La politique n'est qu'un filtre : la décision finale revient à une analyse juridique, qui regarde l'usage réel (distribution, hébergement, modification).

#### Quand une licence change

Le 10 août 2023, HashiCorp a annoncé le passage de la licence publique Mozilla 2.0 à la Business Source License 1.1 pour les versions futures de ses produits (page consultée le 14 octobre 2026). Le texte explique que les utilisateurs peuvent encore copier, modifier et redistribuer le code pour un usage non commercial et commercial, sauf lorsqu'ils fournissent une offre concurrente à HashiCorp, et que les API, les kits de développement et la plupart des bibliothèques restent sous MPL 2.0. C'est un exemple de risque : une dépendance « libre » le jour de son adoption peut changer de conditions pour ses futures versions. Une restriction fondée sur le domaine d'activité (ici, les offres concurrentes) est en tension avec le sixième critère de l'OSD, ce qui fait classer ce type de licence parmi les licences à source disponible plutôt que parmi les licences open source : c'est une interprétation, pas un énoncé de la page.

Les parades sont de gestion : épingler les versions, suivre les annonces des composants critiques, savoir qui les maintient, avoir identifié une alternative ou la capacité de reprendre une version, et garder l'inventaire des licences à jour dans le pipeline ([21.9 Tests de sécurité dans le pipeline](21-livraison-qualite-logicielle.md#219-tests-de-sécurité-dans-le-pipeline), [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)).

#### La portabilité par la conception

| Levier | Effet | Coût |
|---|---|---|
| Formats d'export ouverts pour les données ([3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)) | Les données peuvent partir | Faible, à tester |
| Standards d'échange ([28.1 Normes d'échange sectorielles](28-interoperabilite-avancee.md#281-normes-déchange-sectorielles)) | Les intégrations ne dépendent pas d'un produit | Moyen |
| Frontière explicite autour du composant | Le remplacement se limite à un adaptateur | Moyen |
| Plan de sortie testé | On sait ce que coûte un départ | Moyen, périodique |
| Abstraction générale du fournisseur | Éviter le verrouillage | Élevé : complexité, fuite d'abstraction |

Le plan de sortie se **teste** : on exporte des données réelles et on les restaure dans un système alternatif en préproduction ; une sortie jamais essayée est une hypothèse.

**Modes de défaillance.**

- **Construire du banalisé**, par goût ou par habitude.
- **Acheter le différenciant** sans contrôle de son évolution.
- **Aucun inventaire** des licences et de leur usage.
- **Licence vérifiée une seule fois**, à l'adoption.
- **Abstraction systématique** pour éviter tout verrouillage.
- **Plan de sortie** écrit et jamais essayé.

**Contre-exemple.** L'équipe fabrique son propre système d'envoi de courriels transactionnels pendant dix-huit mois, alors que des services gérés existent et que cette capacité ne différencie pas la plateforme. En parallèle, elle adopte pour son moteur de règles, qui est son différenciant, un composant d'un éditeur dont la feuille de route lui échappe. La même équipe a donc porté ce qu'elle aurait pu acheter et acheté ce qu'elle aurait dû maîtriser.

**Limites.** La distinction entre différenciant et banalisé évolue : une capacité banalisée aujourd'hui peut devenir différenciante demain. Les licences s'interprètent selon l'usage et la juridiction : l'inventaire n'est pas une analyse juridique. Les coûts de sortie sont des estimations. Et la portabilité complète n'existe pas : on choisit où l'on accepte la dépendance.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'import et l'export portent la portabilité des données |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les plugins et extensions posent les mêmes questions de licence et de dépendance |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | La gestion des vulnérabilités et des dépendances s'appuie sur l'inventaire |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les sous-traitants et la responsabilité partagée encadrent les services achetés |
| [21.9 Tests de sécurité dans le pipeline](21-livraison-qualite-logicielle.md#219-tests-de-sécurité-dans-le-pipeline) | Les tests de sécurité du pipeline incluent l'analyse des dépendances |
| [21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture) | Les décisions d'architecture enregistrent les choix et leurs alternatives |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | L'économie unitaire donne la lecture du coût total |
| [23.8 Propriété, dépréciation, composition, licence et droits d'usage](23-solutions-verticales-packagees.md#238-propriété-dépréciation-composition-licence-et-droits-dusage) | La licence et les droits d'usage des paquets se rattachent aux mêmes questions |
| [28.1 Normes d'échange sectorielles](28-interoperabilite-avancee.md#281-normes-déchange-sectorielles) | Les normes d'échange limitent le coût de sortie des intégrations |

### 5. Application pratique

**Situation initiale.** L'éditeur doit choisir quatre composants pour la prochaine version : recherche, notifications push, moteur de règles aéronautique, génération de documents.

**Problème.** Décider sans reproduire les erreurs passées, et savoir à quoi l'on s'engage.

**Application du concept.** Une grille de critères, un inventaire de licences et un plan de sortie pour les composants critiques.

**Déroulé.**

1. L'équipe classe chaque capacité en différenciant ou banalisé, avec les équipes de produit.
2. Elle évalue pour chaque option le coût total sur cinq ans, y compris l'exploitation et la sortie.
3. Le moteur de règles est construit ; le moteur de recherche est adopté ; les notifications push sont achetées ; la bibliothèque de documents est adoptée sous réserve de la politique de licences.
4. L'inventaire des dépendances avec leurs identifiants de licence alimente le contrôle du pipeline ; une dépendance sous licence à copyleft de réseau est bloquée jusqu'à décision.
5. Pour le service de notifications, un plan de sortie est écrit : formats d'export, adaptateur isolant le fournisseur, estimation de 40 000 pour un changement.
6. Le coût de sortie pondéré par une probabilité de 20 % (valeur d'exemple) donne 8 000 : l'équipe n'investit pas dans une abstraction générale, mais isole le fournisseur dans un adaptateur.
7. Chaque décision est enregistrée avec ses alternatives et sa date de revue ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)).

**Résultat.** Des choix argumentés, des licences connues, et une sortie estimée pour ce qui est critique.

**Limites.** Les estimations changent avec le marché et la maturité des produits ; la revue de décision programmée est ce qui empêche l'enregistrement de devenir un fossile.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quel critère principal oriente la décision de construire ?
2. **Compréhension.** Citez trois formes de verrouillage.
3. **Compréhension.** Que signifie copyleft ?
4. **Pourquoi.** Pourquoi pondère-t-on le coût de sortie par sa probabilité ?
5. **Raisonnement pratique.** Une dépendance critique change de licence pour ses versions futures. Que fait-on ?

#### Réponses

1. Le caractère différenciant : on construit ce qui distingue la plateforme, et l'on acquiert ou adopte ce qui est banalisé, sauf contrainte particulière.
2. Par exemple le verrouillage de fournisseur, de produit, de version, d'architecture, de plateforme, de compétences, juridique ou mental.
3. Une méthode qui exige que les versions modifiées et étendues d'une œuvre restent libres, en s'appuyant sur le droit d'auteur pour garantir cette liberté.
4. Parce qu'un coût élevé que l'on aura probablement peu de chances de payer n'appelle pas un grand investissement d'évitement : le coût attendu (coût fois probabilité) guide l'effort à consentir.
5. On épingle la version actuelle, on évalue les conditions de la nouvelle licence avec le service juridique, on identifie une alternative ou la possibilité de reprendre le projet, on met à jour l'inventaire et la décision enregistrée, et l'on planifie la migration si les conditions sont inacceptables.

## 29.5 Feuille de route, analytique produit et expérimentation

### 1. Comprendre simplement

Une **feuille de route** (*roadmap*) est l'intention ordonnée de ce que l'on compte faire et pourquoi, par horizons de temps ; la **priorisation** (*prioritization*) est la méthode explicite qui ordonne les candidats. L'**analytique produit** (*product analytics*) mesure ce que les utilisateurs font réellement : événements, entonnoirs, rétention. L'**expérimentation** (*experimentation*) compare de façon contrôlée deux variantes pour décider laquelle est meilleure.

**Pourquoi cela existe.** La capacité d'une équipe est limitée, et les demandes sont plus nombreuses que ce qu'elle peut faire. Sans méthode, on décide à l'opinion, au volume sonore ou à l'ancienneté. Sans mesure, on ne sait pas si ce qui a été livré sert. Et une plateforme configurable ajoute une difficulté : chaque tenant l'emploie autrement, donc la mesure doit porter aussi sur la configuration.

**Problème résolu.** Choisir ce que l'on construit, vérifier que cela sert, et décider sur des preuves plutôt que sur des impressions.

**Modèle mental.** Le plan de vol, les instruments de bord et l'essai en vol comparatif. Le plan dit où l'on compte aller ; les instruments disent où l'on est ; l'essai compare deux réglages dans les mêmes conditions.

**Où l'analogie s'arrête.** Un plan de vol se suit. Une feuille de route change quand les preuves changent : elle est un engagement d'intention, pas de livraison.

**Exemple.** L'équipe Plateforme classe quatre candidats (gabarit de paquet, environnement éphémère, catalogue d'API, portail de partenaires) par une note de priorité, instrumente leur usage, et teste par un déploiement progressif un nouvel accueil.

**Les composants.**

1. des **résultats attendus** par horizon ;
2. une **méthode de priorisation** explicite ;
3. un **plan d'instrumentation** : événements, propriétés, définitions ;
4. un **respect de la vie privée** : consentement, minimisation ;
5. des **mesures d'adoption** par tenant ;
6. des **expériences** : hypothèse, unité de randomisation, taille d'échantillon, critères d'arrêt ;
7. des **mesures de garde-fou** ;
8. une **boucle de décision** : revue des résultats, mise à jour de la feuille de route.

**Objectif d'apprentissage :** vous pouvez ordonner des candidats avec une méthode explicite, définir ce qu'il faut instrumenter, et dire quand une expérience est ou n'est pas possible.

### 2. Connaissances essentielles

#### Définition

- **Feuille de route** : document qui exprime, par horizons, les résultats attendus et les initiatives envisagées, avec leur justification et leur degré de certitude.
- **Analytique produit** : collecte et analyse des événements d'usage d'un produit pour comprendre l'adoption, les parcours et la rétention.
- **Expérimentation** : comparaison contrôlée de variantes, avec répartition aléatoire, pour établir l'effet causal d'un changement.

#### Idées fondamentales

1. **Une feuille de route exprime des résultats.** Pas une liste de fonctions promises avec des dates.
2. **La priorisation est une méthode, pas un rapport de forces.** Les critères sont connus, discutables et réutilisables.
3. **Un score est un guide.** Les dépendances et les engagements peuvent justifier d'en sortir, avec explication.
4. **On mesure ce que les gens font.** Des événements typés, définis et gouvernés, dans le respect de la vie privée.
5. **Une plateforme mesure aussi sa configuration.** Quelles fonctions sont activées, par quels tenants.
6. **L'expérimentation répond à une question causale.** Elle suppose une unité de randomisation et une taille d'échantillon calculées à l'avance.
7. **Peu de tenants, peu de puissance.** Un produit B2B n'a pas toujours de quoi expérimenter : on emploie d'autres méthodes.

#### Vocabulaire essentiel

- **Feuille de route et priorisation** (*roadmap and prioritization*) : intention ordonnée et méthode pour l'ordonner.
- **Analytique produit et expérimentation** (*product analytics and experimentation*) : mesure de l'usage, puis comparaison contrôlée de variantes.
- **Résultat attendu** (*outcome*) : changement de comportement ou de situation visé, distinct de la fonction livrée.
- **Entonnoir** (*funnel*) : suite d'étapes d'un parcours, avec la part d'utilisateurs qui passe chacune.
- **Unité de randomisation** (*randomization unit*) : entité tirée au sort pour recevoir une variante : utilisateur ou tenant.
- **Mesure de garde-fou** (*guardrail metric*) : mesure qu'une expérience ne doit pas dégrader.
- **Puissance** (*power*) : probabilité de détecter un effet qui existe réellement.

#### Relations de cause à effet

- La feuille de route est une liste de dates. Une date manquée devient un échec, et les équipes cessent d'en discuter honnêtement.
- Les priorités sont décidées par le client le plus bruyant. La plateforme sert les besoins d'un tenant au détriment de la majorité.
- Rien n'est instrumenté. Personne ne sait ce qui est utilisé, et l'on continue à construire à l'aveugle.
- On teste sur douze tenants et l'on conclut. Le résultat est du bruit, et il oriente pourtant une décision.

#### Idées reçues

- **« La feuille de route est un calendrier de livraison. »** Non. C'est une intention : les horizons lointains sont incertains par nature.
- **« Le score décide. »** Non. L'auteur de la méthode RICE présente les scores comme un guide, pas une règle ; des dépendances peuvent justifier de faire passer un projet moins bien noté.
- **« Toute décision se règle par un test A/B. »** Non. Il faut assez d'unités randomisables et une mesure sensible : un produit à quelques dizaines de tenants n'a pas la puissance voulue.

#### Principe clé

On ordonne par une méthode explicite, on instrumente ce que l'on veut apprendre, et l'on n'expérimente que ce que le volume permet de conclure.

#### Si vous ne retenez que trois choses

1. Une feuille de route exprime des résultats attendus par horizon, avec leur degré de certitude.
2. La priorisation a des critères connus ; un score guide, il ne décide pas.
3. Une expérience demande une unité de randomisation et une taille d'échantillon calculées avant de commencer.

### 3. Explication technique détaillée

#### Prioriser avec une méthode explicite

L'article d'Intercom sur la méthode RICE (consulté le 14 octobre 2026) note chaque idée selon quatre facteurs : la **portée** (*reach*, nombre de personnes concernées sur une période, par exemple des clients par trimestre) ; l'**impact** (l'effet sur chaque personne, sur une échelle de 3 pour massif, 2 pour fort, 1 pour moyen, 0,5 pour faible et 0,25 pour minimal) ; la **confiance** (100 % pour élevée, 80 % pour moyenne, 50 % pour faible) ; et l'**effort** (en personnes-mois). Le score exprime l'impact total par unité de travail : portée fois impact fois confiance, divisé par l'effort. L'auteur précise que les scores sont un guide et non une règle : des dépendances ou des fonctions nécessaires pour gagner certains clients peuvent justifier de commencer par des projets moins bien notés.

```typescript
interface Item {
  name: string;
  reach: number; // personnes (ou tenants) par trimestre
  impact: 3 | 2 | 1 | 0.5 | 0.25;
  confidence: 1 | 0.8 | 0.5;
  effortPersonMonths: number;
}

function riceScore(i: Item): number {
  return (i.reach * i.impact * i.confidence) / i.effortPersonMonths;
}
```

Sur quatre candidats d'exemple (valeurs inventées) : le catalogue d'API (portée 40, impact 1, confiance 100 %, effort 3) obtient 13,3 ; le gabarit de paquet (12, impact 2, 80 %, effort 2) obtient 9,6 ; le portail de partenaires (25, impact 2, 50 %, effort 8) obtient 3,1 ; l'environnement éphémère (12, impact 3, 50 %, effort 6) obtient 3,0. Le classement oriente la discussion, qui peut ensuite l'amender, par exemple en avançant l'environnement éphémère s'il bloque deux autres chantiers. Ce qui compte est que l'amendement soit dit et enregistré.

#### La feuille de route comme intention

Une feuille de route utile dit : le résultat visé (par exemple « réduire de moitié le temps de premier déploiement des nouvelles équipes »), le problème, les initiatives envisagées, et un degré de certitude qui décroît avec l'horizon. On la publie aux utilisateurs de la plateforme, elle intègre les dépréciations annoncées ([29.3 Gouvernance des API et politique de dépréciation](#293-gouvernance-des-api-et-politique-de-dépréciation)), et elle distingue ce qui est engagé contractuellement de ce qui est envisagé. Les horizons lointains y sont volontairement flous.

#### Instrumenter l'usage

Un événement d'usage est un fait typé, qui a un nom, un horodatage, un acteur (pseudonymisé), un tenant et des propriétés :

```json
{
  "event": "workflow.published",
  "occurred_at": "2026-10-14T09:12:44Z",
  "tenant_id": "ten_airline_01",
  "actor": "pseudo_7c91",
  "properties": { "workflow_type": "finding_review", "steps": 5, "used_template": true },
  "schema_version": 3
}
```

Quelques règles : un **catalogue d'événements** défini et versionné (le plan d'instrumentation est un contrat, [28.5 Spécification d'API asynchrone et contrat de données](28-interoperabilite-avancee.md#285-spécification-dapi-asynchrone-et-contrat-de-données)), des définitions de mesures gouvernées ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)), un **respect de la vie privée** (minimisation, consentement et finalité, [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités), [20.4 Droits des personnes et gestion du consentement](20-gouvernance-donnees-conformite.md#204-droits-des-personnes-et-gestion-du-consentement)), et une séparation entre la mesure du produit et le journal d'audit ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), qui n'a ni le même but ni les mêmes garanties. Pour une plateforme configurable, on mesure aussi la **configuration** : quelles fonctions un tenant a activées, combien de types personnalisés il a créés, quelle part de ses utilisateurs emploie quelle vue. La question « combien de tenants emploient cette capacité ? » se pose en une requête :

```sql
SELECT feature, count(DISTINCT tenant_id) AS active_tenants
FROM feature_event
WHERE occurred_at >= now() - interval '28 days'
GROUP BY feature
ORDER BY active_tenants DESC;
```

#### Expérimenter : ce qu'il faut avoir avant

1. **Une hypothèse** et une mesure principale : « le nouvel accueil augmente de 10 % à 11 % la part de nouvelles équipes qui déploient dans la semaine ».
2. **Une unité de randomisation** : l'utilisateur quand il n'y a pas d'interférence ; le tenant quand une configuration est partagée et qu'un utilisateur influence les autres. Les drapeaux de fonctionnalité ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) assurent la répartition.
3. **Une taille d'échantillon calculée à l'avance.** Pour une proportion de base $p$, une différence absolue minimale $\Delta$ à détecter, un seuil de 5 % bilatéral et une puissance de 80 %, la taille par variante est :

$$n \approx \frac{2\,(z_{1-\alpha/2} + z_{1-\beta})^{2}\,p\,(1-p)}{\Delta^{2}} \approx \frac{16\,p\,(1-p)}{\Delta^{2}}$$

où $z_{1-\alpha/2}$ vaut environ 1,96 et $z_{1-\beta}$ environ 0,84 ; le facteur 16 est l'arrondi de $2 \times (1{,}96 + 0{,}84)^2 \approx 15{,}7$. C'est le calcul statistique usuel d'un test de comparaison de deux proportions, repris par la littérature sur les expériences en ligne.

```typescript
const Z_ALPHA = 1.959964; // quantile 97,5 % de la loi normale
const Z_BETA = 0.841621; // quantile 80 %

function sampleSizePerVariant(p: number, delta: number): number {
  const variance = p * (1 - p);
  return Math.ceil((2 * (Z_ALPHA + Z_BETA) ** 2 * variance) / delta ** 2);
}
```

Avec une proportion de base de 10 % et une différence à détecter de 1 point, il faut environ 14 128 unités par variante (14 400 par la règle du 16) ; pour 2 points, 3 532 ; avec une proportion de base de 50 % et 5 points, 1 570. Pour une plateforme dont la randomisation se fait par tenant, il n'y a pas 14 000 tenants : une expérience par tenant ne détecte que de très grands effets.

4. **Des mesures de garde-fou** (latence, taux d'erreur, tickets de support) qu'on ne doit pas dégrader.
5. **Un critère d'arrêt fixé à l'avance.** S'arrêter dès que le résultat paraît significatif augmente les faux positifs ; on décide de la durée avant de commencer.

#### Quand on ne peut pas expérimenter

| Situation | Alternative |
|---|---|
| Quelques dizaines de tenants | Déploiement progressif avec mesure ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)), entretiens, études de cas |
| Effet attendu très grand | Comparaison avant et après avec des tenants témoins, en assumant les limites |
| Changement à risque | Canari et retour arrière, plutôt qu'un test d'efficacité |
| Décision de principe (sécurité, conformité) | Pas d'expérience : une décision, justifiée |

**Modes de défaillance.**

- **Feuille de route** présentée comme un calendrier de livraison.
- **Priorité** décidée par le tenant le plus bruyant.
- **Aucune instrumentation**, ou des événements sans définition.
- **Mesure d'audit** employée comme analytique, avec des garanties différentes.
- **Test sur trop peu d'unités**, conclusion sur du bruit.
- **Arrêt dès que le résultat paraît bon.**

**Contre-exemple.** L'équipe livre un tableau de bord configurable après six mois de travail, sans plan d'instrumentation. Un an plus tard, personne ne sait si les tenants l'emploient, ni quelles vues. Pour décider d'un nouvel accueil, elle compare deux semaines de métriques sur douze tenants, constate une hausse de 3 points et généralise. Avec douze unités, un tel écart ne se distingue pas du bruit ; un plan d'instrumentation dès la conception et un déploiement progressif avec entretiens auraient donné des éléments utilisables.

**Limites.** Les mesures d'usage ne disent pas pourquoi : les entretiens complètent. Les méthodes de priorisation donnent une fausse précision si les estimations sont vagues. Une expérience mesure un effet moyen, qui peut cacher des effets opposés selon les tenants. Et l'analytique collecte des données sur des personnes : elle suit les règles de protection des données ([20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités), [20.4 Droits des personnes et gestion du consentement](20-gouvernance-donnees-conformite.md#204-droits-des-personnes-et-gestion-du-consentement)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les drapeaux de fonctionnalité répartissent les variantes et déploient progressivement |
| [12.2 Design systems](12-produit-ux.md#122-design-systems) | Le système de conception cite la feuille de route des composants |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | La gouvernance des définitions de mesures s'applique aux indicateurs produit |
| [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | La minimisation et la limitation des finalités encadrent l'analytique |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Le déploiement progressif est une alternative à l'expérience |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | L'économie unitaire alimente les arbitrages de priorité |
| [24.3 Mesures d'adoption et score de santé du compte](24-cycle-vie-client-support.md#243-mesures-dadoption-et-score-de-santé-du-compte) | Les mesures d'adoption par compte sont les mêmes événements, vus du côté du client |
| [28.5 Spécification d'API asynchrone et contrat de données](28-interoperabilite-avancee.md#285-spécification-dapi-asynchrone-et-contrat-de-données) | Le plan d'instrumentation est un contrat de données |
| [29.1 La plateforme comme produit](#291-la-plateforme-comme-produit) | La plateforme comme produit s'appuie sur ces pratiques |

### 5. Application pratique

**Situation initiale.** L'équipe Plateforme a quatre chantiers possibles pour le trimestre et une capacité de dix personnes-mois. Elle veut aussi savoir si un nouvel accueil améliore le délai de premier déploiement.

**Problème.** Choisir avec une méthode, mesurer l'effet, et ne pas sur-interpréter de petits échantillons.

**Application du concept.** Une priorisation par note, un plan d'instrumentation, un déploiement progressif.

**Déroulé.**

1. L'équipe note les quatre candidats par la méthode RICE, avec des estimations discutées avec les équipes de paquets.
2. Le catalogue d'API (13,3) et le gabarit de paquet (9,6) sont retenus ; l'environnement éphémère est avancé car il bloque un chantier des partenaires, décision enregistrée.
3. Elle publie la feuille de route du trimestre sous forme de résultats visés et de degrés de certitude.
4. Un plan d'instrumentation définit les événements « première création de paquet », « premier déploiement » et « première publication ».
5. Le nouvel accueil est déployé à la moitié des nouvelles équipes, par un drapeau, avec la médiane du délai de premier déploiement pour mesure principale.
6. Le calcul préalable montre qu'avec une quarantaine de nouvelles équipes par an, seule une grande amélioration est détectable ; l'équipe complète par des entretiens des équipes concernées.
7. Les résultats sont publiés, la feuille de route mise à jour, et la décision enregistrée.

**Résultat.** Des priorités discutables et tracées, un usage mesuré, et une conclusion qui n'excède pas ce que le volume permet.

**Limites.** Avec quarante équipes, une amélioration modeste reste invisible : l'équipe décide en connaissance de cause, avec les entretiens, plutôt que de feindre une précision statistique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les quatre facteurs de la méthode RICE ?
2. **Compréhension.** Pourquoi une feuille de route exprime-t-elle des résultats plutôt que des dates ?
3. **Compréhension.** Qu'est-ce que l'unité de randomisation d'une expérience ?
4. **Pourquoi.** Pourquoi calcule-t-on la taille d'échantillon avant de lancer une expérience ?
5. **Raisonnement pratique.** Un produit compte 30 tenants. Peut-on y faire un test A/B par tenant pour détecter 1 point sur une proportion de 10 % ?

#### Réponses

1. La portée (nombre de personnes concernées sur une période), l'impact (effet sur chaque personne), la confiance (certitude des estimations) et l'effort (en personnes-mois). Le score est portée fois impact fois confiance, divisé par l'effort.
2. Parce que les horizons lointains sont incertains : exprimer un résultat visé permet de changer d'initiative sans renier l'intention, alors qu'une date promise devient un engagement de livraison qu'on ne peut plus discuter.
3. L'entité que l'on tire au sort pour recevoir une variante : l'utilisateur ou, quand la configuration est partagée et que les utilisateurs s'influencent, le tenant.
4. Pour savoir si l'expérience peut conclure : avec trop peu d'unités, elle n'a pas la puissance pour détecter l'effet visé, et l'on prendrait du bruit pour un résultat. Le calcul préalable décide aussi de la durée, ce qui évite d'arrêter dès que le résultat paraît bon.
5. Non. Il faudrait environ 14 000 unités par variante pour une proportion de base de 10 % et une différence de 1 point : avec 30 tenants, seul un effet énorme serait détectable. On passe à un déploiement progressif et à des entretiens.

## 29.6 Écosystème de partenaires et gouvernance d'architecture

### 1. Comprendre simplement

Un **écosystème de partenaires** (*partner ecosystem*) est l'ensemble des organisations (intégrateurs, éditeurs de paquets, revendeurs, développeurs d'extensions) qui étendent, intègrent ou vendent la plateforme, encadrées par un programme : niveaux, certification, accès, soutien, règles commerciales. La **gouvernance d'architecture** (*architecture governance*) est l'ensemble des principes, décisions enregistrées, revues et contrôles qui maintiennent la cohérence des choix techniques dans le temps.

**Pourquoi cela existe.** La valeur d'une plateforme croît avec ce qu'on bâtit dessus, et le propriétaire ne peut pas tout bâtir : la marketplace ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)) en est la vitrine. Mais la qualité des partenaires engage la réputation de la plateforme. Et à mesure que les équipes se multiplient, les choix techniques divergent : cinq façons d'authentifier, quatre files de messages. Il faut des règles pour l'un comme pour l'autre.

**Problème résolu.** Ouvrir la plateforme à des partenaires sans perdre la confiance des clients, et garder une architecture cohérente sans la bloquer.

**Modèle mental.** Un aéroport et ses compagnies. Chacune opère selon un cahier des charges, une habilitation et des contrôles ; l'aéroport tient des règles d'accès et peut suspendre un opérateur. De même, les choix d'architecture suivent des principes communs, avec des dérogations connues et datées.

**Où l'analogie s'arrête.** Un aéroport est régulé par des autorités. Un écosystème de partenaires est encadré par des contrats et des tests, dont la plateforme est elle-même la partie qui les définit.

**Exemple.** Un intégrateur développe un paquet de planification de maintenance. Il passe un bac à sable, des tests de conformité ([23.7 Tests de conformité et tests de scénario](23-solutions-verticales-packagees.md#237-tests-de-conformité-et-tests-de-scénario)) et une revue de sécurité, obtient le niveau « certifié », est listé à la marketplace, et est surveillé par des mesures de qualité. En interne, une décision de ne pas utiliser le mécanisme d'authentification standard est enregistrée comme exception, avec un propriétaire et une date de fin.

**Les composants.**

1. des **types de partenaires** et des **niveaux** ;
2. un **parcours d'accueil** : bac à sable, documentation, support ;
3. une **certification** : tests automatisés et revue de sécurité ;
4. des **mesures de qualité** et de satisfaction ;
5. des **règles commerciales** et juridiques ;
6. des **principes d'architecture** ;
7. un **enregistrement des décisions** ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)) ;
8. des **revues proportionnées** et des **contrôles automatiques** ;
9. un **registre des exceptions**, avec propriétaire et échéance.

**Objectif d'apprentissage :** vous pouvez décrire le parcours d'un partenaire de la candidature à la supervision, et un dispositif de gouvernance d'architecture proportionné qui évite le goulot.

### 2. Connaissances essentielles

#### Définition

- **Écosystème de partenaires** : ensemble d'organisations tierces qui, dans le cadre d'un programme défini par la plateforme, étendent, intègrent, distribuent ou exploitent la plateforme.
- **Gouvernance d'architecture** : pratique qui encadre les décisions techniques d'une organisation pour qu'elles respectent des principes, des standards et une trajectoire, par des revues, des décisions enregistrées, des contrôles et des exceptions.

#### Idées fondamentales

1. **Un partenaire est un client particulier.** Il bâtit, vend ou intègre ; il a des besoins de développeur et de commerce.
2. **Un programme décrit des niveaux.** Obligations, avantages, accès, selon le niveau.
3. **La certification s'appuie sur des tests et une revue.** Automatiser ce qui peut l'être ([23.7 Tests de conformité et tests de scénario](23-solutions-verticales-packagees.md#237-tests-de-conformité-et-tests-de-scénario)).
4. **La confiance se mesure.** Qualité, incidents, satisfaction, conformité continue.
5. **Un partenaire peut être suspendu.** La révocation et la sortie sont prévues au programme.
6. **La gouvernance d'architecture guide.** Elle vise la cohérence plutôt que le contrôle strict.
7. **Une exception a un propriétaire et une échéance.** Sinon elle devient la règle.

#### Vocabulaire essentiel

- **Programme de partenaires** (*partner program*) : cadre qui définit les types de partenaires, les niveaux, les obligations et les avantages.
- **Certification** (*certification*) : reconnaissance, après des tests et des revues, qu'un partenaire ou un produit répond à des exigences.
- **Bac à sable** (*sandbox*) : environnement d'essai isolé, sans effet sur des données réelles.
- **Principe d'architecture** (*architecture principle*) : règle générale qui oriente les décisions, avec sa justification.
- **Comité d'architecture** (*architecture board*) : instance qui arbitre les décisions qui sortent du cadre et traite les conflits.
- **Exception** (*exception*) : dérogation temporaire à un principe, décidée, enregistrée et datée.

#### Relations de cause à effet

- Les partenaires ne sont pas certifiés. Un paquet défaillant dégrade l'expérience des clients, et la plateforme en porte la réputation.
- Tout changement passe par un comité. Il devient un goulot, et les équipes contournent le processus.
- Aucune gouvernance n'existe. Les décisions divergent, les coûts d'intégration et de sécurité montent.
- Les exceptions n'ont pas d'échéance. Elles s'accumulent et deviennent la pratique.

#### Idées reçues

- **« Plus de partenaires, c'est mieux. »** Non. Sans niveau d'exigence, la qualité moyenne baisse et les clients ne font plus confiance à la marketplace.
- **« La gouvernance d'architecture est un comité d'approbation. »** Non. Les descriptions du cadre TOGAF consultées parlent d'orientation et d'usage équitable des ressources plutôt que de contrôle strict.
- **« Les décisions d'architecture se prennent une fois. »** Non. Elles se revoient : une décision enregistrée porte une date de revue.

#### Principe clé

On ouvre la plateforme à des partenaires par un programme à niveaux, vérifié par des tests et des mesures, et l'on garde la cohérence technique par des principes, des décisions enregistrées, des revues proportionnées et des exceptions datées.

#### Si vous ne retenez que trois choses

1. Un partenaire passe par un parcours : bac à sable, certification, listage, supervision, avec la possibilité de suspension.
2. La gouvernance d'architecture est proportionnée : peu de revues humaines, beaucoup de contrôles automatiques.
3. Toute exception a un propriétaire, une raison et une échéance.

### 3. Explication technique détaillée

#### Le parcours d'un partenaire

| Étape | Contenu | Preuve ou contrôle |
|---|---|---|
| Candidature | Type de partenaire, cas d'usage visé | Examen du dossier |
| Accueil | Portail, documentation, bac à sable, jetons d'essai | Premier appel réussi ([10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur)) |
| Développement | Paquet ou intégration, selon le guide de construction | Tests de conformité et de scénario ([23.7 Tests de conformité et tests de scénario](23-solutions-verticales-packagees.md#237-tests-de-conformité-et-tests-de-scénario)) |
| Certification | Revue de sécurité, signature du paquet ([23.6 Distribution et signature des paquets](23-solutions-verticales-packagees.md#236-distribution-et-signature-des-paquets)) | Rapport, signature |
| Listage | Publication sur la marketplace ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)) | Fiche, version, licence ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](23-solutions-verticales-packagees.md#238-propriété-dépréciation-composition-licence-et-droits-dusage)) |
| Supervision | Mesures de qualité, incidents, satisfaction | Tableau partagé, seuils |
| Sortie ou suspension | Retrait, migration des clients | Procédure, préavis |

Les règles commerciales (partage de revenus, tarification) relèvent d'un autre module du plan ([module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation)), non rédigé à ce jour.

| Niveau (exemple) | Accès | Obligations | Avantages |
|---|---|---|---|
| Inscrit | Bac à sable, documentation | Respect des conditions d'usage | Support communautaire |
| Certifié | Listage à la marketplace | Tests de conformité à chaque version, revue de sécurité | Visibilité, support prioritaire |
| Stratégique | Pré-versions, appui d'ingénierie | Engagements de service, plan de maintenance | Feuille de route partagée |

La supervision repose sur des mesures : taux d'incidents attribuables au paquet, délai de correction, satisfaction des clients, usage des API dépréciées. Un partenaire sous le seuil reçoit un avis, un délai de correction, puis une suspension de sa mise en avant. Ces règles sont annoncées dans les conditions du programme.

#### Une gouvernance d'architecture proportionnée

Des descriptions du cadre d'architecture d'entreprise TOGAF, lues dans des pages tierces (non l'Open Group lui-même), présentent la gouvernance d'architecture comme la pratique qui oriente le travail d'architecture pour atteindre les résultats voulus et respecter principes, standards et trajectoire, en insistant sur l'orientation plus que sur le contrôle strict. Elles décrivent un comité d'architecture, instance transversale chargée de superviser la mise en œuvre de la stratégie de gouvernance, de servir de point d'escalade et d'arbitrer les conflits, ainsi que des évaluations de conformité et des contrats d'architecture entre équipes d'architecture et parties prenantes. On en retient, pour une plateforme, une version légère :

1. **Des principes écrits, peu nombreux**, avec leur justification : par exemple ceux de ce cours (ce qui varie est une donnée, le tenant est la frontière, refus par défaut).
2. **Des décisions enregistrées** ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)) : contexte, décision, alternatives, conséquences, propriétaire, date de revue.
3. **Des revues proportionnées au risque** : une décision réversible et locale se prend dans l'équipe ; une décision difficile à annuler ou transversale passe par une revue.
4. **Des contrôles automatiques** : les principes qui se vérifient s'expriment en politiques ([13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)) et s'exécutent au déploiement ([21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)).
5. **Un registre d'exceptions**, avec propriétaire, raison, référence à la décision et échéance.
6. **Des revues périodiques** des principes et des exceptions.

```yaml
id: ADR-0031
status: accepted
title: Service d'export sans contexte de tenant sur le chemin de lecture seule
context: Le service d'export lit des fichiers déjà filtrés en amont ; le contexte de tenant est reconstitué par le nom du fichier.
decision: Accepter, jusqu'à la migration vers le gabarit standard.
alternatives:
  - Refuser et reporter la livraison de trois mois.
consequences:
  - Risque d'isolation accru sur ce chemin ; contrôle compensatoire par un test d'isolation quotidien.
owner: team-quality-apps
review_on: 2026-12-31
```

Le registre des exceptions se vérifie par un contrôle simple :

```typescript
interface Exception {
  id: string;
  decision: string;
  reason: string;
  owner: string;
  expiresOn: string; // AAAA-MM-JJ
  adr: string | null;
}

function expiredOrInvalid(exceptions: Exception[], today: string): { id: string; problem: string }[] {
  const out: { id: string; problem: string }[] = [];
  for (const e of exceptions) {
    if (!e.adr) out.push({ id: e.id, problem: "aucune décision enregistrée" });
    if (!e.owner) out.push({ id: e.id, problem: "propriétaire absent" });
    if (e.expiresOn < today) out.push({ id: e.id, problem: `échue le ${e.expiresOn}` });
  }
  return out;
}
```

Sur trois exceptions d'exemple au 14 octobre 2026, une est à jour (EX-014, échéance le 31 décembre 2026) ; une est échue depuis le 30 septembre (EX-009) ; une n'a ni décision enregistrée ni propriétaire (EX-017), ce qui produit deux problèmes. Le contrôle n'interdit rien : il rend visible ce qui doit être décidé à nouveau.

#### Éviter le goulot

| Risque | Parade |
|---|---|
| Toute décision passe par le comité | Classer les décisions par risque ; ne soumettre que les décisions transversales ou irréversibles |
| Délais de revue longs | Délai maximal de réponse, décision par défaut après échéance |
| Revue sans critères | Principes écrits et checklist de revue |
| Contrôles manuels | Automatiser ce qui se vérifie ([13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)) |
| Exceptions sans fin | Échéance obligatoire, revue périodique |

**Modes de défaillance.**

- **Programme sans niveaux**, tous les partenaires listés sans condition.
- **Certification sans tests automatisés**, donc coûteuse et non répétable.
- **Aucune supervision** après le listage.
- **Comité d'architecture** transformé en guichet d'approbation.
- **Principes non écrits**, connus de quelques-uns.
- **Exceptions sans échéance.**

**Contre-exemple.** Un comité d'architecture doit approuver chaque nouveau service. Les revues se tiennent une fois par mois ; les équipes attendent six semaines, puis déploient hors processus pour tenir leurs engagements. Au bout d'un an, la plateforme compte neuf façons d'authentifier et aucun registre des écarts. Des principes écrits, des contrôles automatiques et une revue réservée aux décisions transversales auraient apporté la cohérence sans le délai.

**Limites.** Les mécanismes de gouvernance coûtent du temps : on les proportionne. Les descriptions du cadre TOGAF consultées sont secondaires, et un cadre complet d'entreprise est plus vaste que ce que cette entrée en retient. Un programme de partenaires suppose des ressources de soutien que beaucoup d'éditeurs sous-estiment. Et la certification ne garantit pas la qualité d'un paquet dans la durée : la supervision continue est nécessaire.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur) | La plateforme développeur est la porte d'entrée des partenaires |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La marketplace est la vitrine de l'écosystème |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | La politique comme code vérifie automatiquement les principes |
| [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | Les portes de qualité appliquent les contrôles au déploiement |
| [21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture) | Les décisions d'architecture et la dette technique sont enregistrées |
| [23.6 Distribution et signature des paquets](23-solutions-verticales-packagees.md#236-distribution-et-signature-des-paquets) | La signature des paquets atteste l'origine d'un paquet partenaire |
| [23.7 Tests de conformité et tests de scénario](23-solutions-verticales-packagees.md#237-tests-de-conformité-et-tests-de-scénario) | Les tests de conformité et de scénario fondent la certification |
| [23.8 Propriété, dépréciation, composition, licence et droits d'usage](23-solutions-verticales-packagees.md#238-propriété-dépréciation-composition-licence-et-droits-dusage) | La propriété, la licence et les droits d'usage encadrent les paquets partenaires |
| [29.1 La plateforme comme produit](#291-la-plateforme-comme-produit) | La plateforme comme produit inclut ses partenaires parmi ses utilisateurs |
| [29.3 Gouvernance des API et politique de dépréciation](#293-gouvernance-des-api-et-politique-de-dépréciation) | La politique de dépréciation s'applique aux partenaires comme aux clients |

### 5. Application pratique

**Situation initiale.** Un intégrateur veut proposer un paquet de planification de maintenance sur la marketplace. En interne, trois équipes demandent des dérogations au standard d'authentification pour tenir un jalon.

**Problème.** Accepter le partenaire sans exposer les clients à un paquet défaillant, et traiter les dérogations sans bloquer ni laisser faire.

**Application du concept.** Un parcours de certification pour le partenaire, un registre d'exceptions pour les équipes.

**Déroulé.**

1. L'intégrateur s'inscrit, reçoit un bac à sable et réalise son premier appel d'API le jour même.
2. Il développe son paquet selon le guide ; les tests de conformité et de scénario s'exécutent à chaque version.
3. La revue de sécurité vérifie les droits demandés et les dépendances, puis le paquet est signé.
4. Le paquet est listé, avec sa licence et ses droits d'usage, et surveillé : incidents, délai de correction, satisfaction.
5. Trois mois plus tard, un seuil d'incidents est dépassé : l'intégrateur reçoit un avis et un délai de correction ; il corrige, et la supervision revient au vert.
6. En interne, chaque demande de dérogation à l'authentification devient une exception : décision enregistrée, contrôle compensatoire, propriétaire, échéance.
7. Un contrôle hebdomadaire liste les exceptions échues ou sans décision ; une revue trimestrielle les rejuge.

**Résultat.** Un partenaire certifié et supervisé, des dérogations visibles et datées, et un comité réservé aux décisions qui l'exigent.

**Limites.** Le niveau d'exigence est un équilibre : trop strict, il décourage les partenaires ; trop souple, il dégrade la confiance dans la marketplace.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les étapes du parcours d'un partenaire ?
2. **Compréhension.** Sur quoi repose la certification d'un partenaire ?
3. **Compréhension.** Qu'est-ce qu'une exception d'architecture bien tenue ?
4. **Pourquoi.** Pourquoi une gouvernance d'architecture doit-elle être proportionnée ?
5. **Raisonnement pratique.** Une équipe demande de déroger à un principe pour tenir un jalon. Que fait-on ?

#### Réponses

1. La candidature, l'accueil (bac à sable), le développement, la certification, le listage, la supervision, et, si besoin, la suspension ou la sortie.
2. Sur des tests automatisés de conformité et de scénario et sur une revue de sécurité, avec une signature du paquet : on automatise ce qui l'est pour que la certification soit répétable à chaque version.
3. Une dérogation décidée, avec une décision enregistrée, un propriétaire, une raison, un contrôle compensatoire éventuel et une échéance ; elle est revue à terme et expire si on ne la renouvelle pas.
4. Parce qu'une gouvernance trop lourde devient un goulot que les équipes contournent, alors que trop légère elle laisse diverger les choix : on réserve la revue humaine aux décisions transversales ou irréversibles, et l'on automatise le reste.
5. On évalue le risque, on enregistre la décision avec ses alternatives, on désigne un propriétaire, on prévoit un contrôle compensatoire et une échéance, et on l'inscrit au registre des exceptions pour qu'elle soit revue.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Plateforme comme produit, attributs, mesures | CNCF TAG App Delivery, Platforms White Paper | https://tag-app-delivery.cncf.io/whitepapers/platforms/ | 29.1 |
| Plateforme numérique comme produit interne, libre-service, mandat | E. Bottcher, « What I Talk About When I Talk About Platforms » (5 mars 2018) | https://martinfowler.com/articles/talk-about-platforms.html | 29.1 |
| Types d'équipes, modes d'interaction, plateforme viable minimale, charge cognitive | Team Topologies, concepts clés | https://teamtopologies.com/key-concepts | 29.1, 29.2 |
| Chemin balisé | Spotify Engineering, « How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem » (août 2020) | https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem | 29.2 |
| En-tête de dépréciation | RFC 9745, The Deprecation HTTP Response Header Field (mars 2025) | https://www.rfc-editor.org/rfc/rfc9745.html | 29.3 |
| En-tête de retrait | RFC 8594, The Sunset HTTP Header Field (mai 2019) | https://www.rfc-editor.org/rfc/rfc8594.html | 29.3 |
| Version sémantique | Semantic Versioning 2.0.0 | https://semver.org/ | 29.3 |
| Formes de verrouillage, coût de sortie et probabilité | G. Hohpe, « Don't get locked up into avoiding lock-in » (septembre 2019) | https://martinfowler.com/articles/oss-lockin.html | 29.4 |
| Critères de l'open source | Open Source Initiative, Open Source Definition | https://opensource.org/osd | 29.4 |
| Copyleft | Projet GNU, What is Copyleft? | https://www.gnu.org/licenses/copyleft.html | 29.4 |
| Identifiants de licences | SPDX License List (version 3.29.0, 16 septembre 2026) | https://spdx.org/licenses/ | 29.4 |
| Changement de licence | HashiCorp, annonce du 10 août 2023 | https://www.hashicorp.com/en/blog/hashicorp-adopts-business-source-license | 29.4 |
| Méthode RICE | Intercom, RICE: Simple prioritization for product managers (janvier 2018) | https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/ | 29.5 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- La formule de taille d'échantillon pour deux proportions (et la règle du facteur 16) est du calcul statistique usuel, vérifié par calcul ; la source primaire des expériences en ligne n'a pas pu être lue (la page du document était derrière une authentification).
- La gouvernance d'architecture (comité, évaluations de conformité, contrats d'architecture) est décrite d'après des pages tierces sur TOGAF, pas d'après le texte de l'Open Group.
- Les programmes de partenaires (niveaux, certification, supervision) et leurs seuils sont des recommandations du cours, sans source externe.
- Le sixième critère de l'OSD appliqué à la licence à source disponible, et la qualification de ce type de licence, sont une interprétation du cours.
- Les obligations propres à chaque licence (notamment à copyleft de réseau) ne sont pas analysées ; la politique de licences est un exemple, pas un avis juridique.
- Les valeurs d'exemple : nombres d'équipes, délais, notes RICE, coûts de sortie, probabilités, durées de préavis.
- Les articles du CNCF, de Bottcher et de Spotify sont des documents de position : ils décrivent des pratiques, sans mesure de leur effet.
- Les extraits TypeScript ont été exécutés sur les valeurs d'exemple données ; le script SQL a été analysé syntaxiquement (dialecte PostgreSQL), sans exécution.
