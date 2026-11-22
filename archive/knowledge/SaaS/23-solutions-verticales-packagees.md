# Module 23 — Solutions verticales packagées et personnalisation durable

> **Question directrice.** Comment livrer une solution métier comme un produit installable, puis la mettre à jour sans écraser ce que chaque client a configuré ?

## Présentation du module

**Objectif.** Le cours sait configurer un domaine pour un tenant ([15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée)) et distribuer des extensions de code ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) à [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)). Il ne dit pas comment emballer un domaine configuré en **produit installable**, comment le versionner, ni comment le mettre à jour chez des centaines de tenants qui l'ont personnalisé. Ce module décrit le **paquet de solution** et son manifeste, les **couches de configuration** qui séparent le produit des choix du tenant, la **mise à niveau** qui fusionne les deux, sa **simulation**, sa **distribution signée**, ses **tests**, et la **gouvernance** du paquet : propriété, dépréciation, composition, licence.

**Prérequis.** L'architecture pilotée par les métadonnées ([2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles), [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale)), la configuration et la personnalisation du tenant ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)), l'administration du comportement ([8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement)), l'instantané et la différence ([9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence)), le versionnement de la configuration ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), la marketplace ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)), le plan de contrôle et le runtime ([13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime)) et la démarche « nouveau domaine, plateforme configurée » ([15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée)).

**Un mot, plusieurs sens.** Trois mots changent de sens selon le contexte. Une **solution** est ici un ensemble configuré qui répond à un métier ; certaines plateformes emploient le même mot pour le conteneur technique qui porte cet ensemble, que ce module appelle **paquet**. Une **version** peut désigner celle du paquet, celle de la plateforme, celle de la configuration d'un tenant ou celle du schéma : le contexte et le tableau de [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) les distinguent. Enfin, la **dérive** désigne ici l'écart, voulu et cumulé, entre la configuration d'un tenant et le standard du paquet ; elle ne se confond pas avec la dérive involontaire d'un environnement ([8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement), [21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops)).

**Ordre retenu.** Trois groupes, du contenu du paquet à sa gouvernance.

```text
Le paquet               paquet, manifeste, dépendances ─ versionnement, amorçage, paramètres
La vie du paquet        couches, surface de personnalisation, points d'extension ─ mise à niveau, fusion, dérive ─ simulation, désinstallation, retour arrière
Distribution et         distribution et signature ─ tests de conformité et de scénario ─ propriété, dépréciation, composition, licence
gouvernance
```

| Groupe | Question de l'équipe |
|---|---|
| Le paquet | De quoi se compose le produit, que promet son numéro, et que faut-il fournir pour l'installer ? |
| La vie du paquet | Comment le produit et les choix du tenant coexistent-ils, et comment les mettre à jour sans perdre les seconds ? |
| Distribution et gouvernance | Comment livrer un paquet digne de confiance, le tester, le faire vieillir proprement et en maîtriser les droits d'usage ? |

**Références.** Les articles, documentations et ouvrages cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)
- [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)
- [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)
- [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)
- [23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)
- [23.6 Distribution et signature des paquets](#236-distribution-et-signature-des-paquets)
- [23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)
- [23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)

## 23.1 Paquet de solution, manifeste et dépendances

### 1. Comprendre simplement

Un **paquet de solution** (*solution pack*) emballe un domaine configuré en une unité **versionnée** et **installable** chez n'importe quel tenant : types de ressources, champs, états, règles, rôles, workflows, vues, modèles de notification, données de référence. Son **manifeste** (*pack manifest*) est le document qui le décrit : identité, version, composants, paramètres, compatibilité. Les **dépendances** (*pack dependency*) déclarent ce dont le paquet a besoin : d'autres paquets, ou des capacités de la plateforme.

**Pourquoi cela existe.** La démarche du module 15 ([15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée)) produit une configuration pour un tenant. Pour un produit vertical vendu à des centaines de tenants, refaire cette configuration à la main chez chacun est impossible : elle dériverait, ne se testerait pas et ne se corrigerait pas. Il faut un objet que l'on construit une fois, que l'on teste, que l'on distribue et que l'on installe de façon répétable.

**Problème résolu.** Transformer une configuration réussie en produit : un livrable identifié et reproductible, dont on connaît le contenu, les prérequis et les frontières.

**Modèle mental.** Un kit de montage : une boîte avec une référence, une liste de pièces, une notice et la mention des outils nécessaires. Deux personnes qui montent le même kit obtiennent le même meuble. Ce que l'on ajoute ensuite, une étagère par exemple, ne fait pas partie du kit.

**Où l'analogie s'arrête.** Un meuble monté ne reçoit plus de pièces. Un paquet installé reçoit des versions successives alors que le tenant l'a déjà modifié : c'est le sujet de [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation).

**Exemple.** Le paquet `acme.mro-aviation` (maintenance aéronautique) contient les types « aéronef », « constat » et « tâche de maintenance », les états du constat, trois rôles, un workflow d'approbation, une règle « pas de vol avec une inspection échue », des vues et des modèles de notification. Il dépend de `acme.quality-core` (qualité et gestion des écarts) et de `acme.notifications-base`. Alpha Air (`ten_airline_01`) l'installe en une opération.

**Les composants.**

1. l'**identité** : préfixe de l'éditeur, nom, version ;
2. les **composants** de configuration, chacun avec une clé stable ;
3. les **dépendances** et leurs plages de versions ;
4. la **compatibilité** avec la plateforme ;
5. les **paramètres d'installation** ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)) ;
6. les **données d'amorçage** ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)) ;
7. les **permissions** demandées et les **points d'extension** ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) ;
8. la **distribution** et la signature ([23.6 Distribution et signature des paquets](#236-distribution-et-signature-des-paquets)).

**Objectif d'apprentissage :** vous pouvez décrire ce qu'un paquet contient et ne contient pas, lire un manifeste et expliquer comment l'ordre d'installation se déduit des dépendances.

### 2. Connaissances essentielles

#### Définition

- **Paquet de solution** : ensemble versionné et identifié de composants de configuration qui, installés ensemble, fournissent une capacité métier à un tenant.
- **Manifeste** : document déclaratif qui décrit un paquet : identité, version, composants, dépendances, compatibilité, paramètres, permissions.
- **Dépendance** : exigence d'un paquet envers un autre paquet ou une capacité de la plateforme, exprimée par une identité et une plage de versions.

#### Idées fondamentales

1. **Le paquet est de la donnée.** Il se décrit, s'analyse et se compare comme toute configuration versionnée ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), pas comme du code.
2. **Chaque composant a une clé stable.** C'est elle, pas le libellé, qui permet de retrouver un composant d'une version à l'autre.
3. **La frontière est nette.** Le paquet contient la configuration du produit. Il ne contient ni les données du tenant, ni ses secrets, ni ses utilisateurs.
4. **Les dépendances sont déclarées.** La plateforme les vérifie avant d'installer et les consigne.
5. **L'installation est répétable.** Même paquet, mêmes paramètres : même résultat.
6. **Un paquet publié ne change plus.** Un changement est une nouvelle version.

#### Vocabulaire essentiel

- **Éditeur** (*publisher*) : organisation qui publie le paquet et en est propriétaire.
- **Préfixe d'éditeur** (*publisher prefix*) : préfixe d'espace de noms qui évite les collisions de noms entre paquets.
- **Composant** (*component*) : élément de configuration identifié par une clé : type, champ, état, règle, workflow, vue, modèle.
- **Clé de composant** (*component key*) : identifiant stable d'un composant, indépendant de son libellé.
- **Plage de versions** (*version range*) : ensemble des versions acceptées pour une dépendance.
- **Capacité** (*capability*) : fonction que la plateforme ou un autre paquet fournit.
- **Enregistrement d'installation** (*installation record*) : trace de ce qui est installé chez un tenant : version, paramètres, dépendances résolues.

#### Relations de cause à effet

- Les composants sont identifiés par leur libellé. Une correction de libellé est prise pour un nouveau composant, et la mise à niveau duplique ou supprime.
- Les dépendances ne sont pas déclarées. L'installation échoue à mi-parcours parce qu'une règle référence un champ d'un paquet absent, et laisse le tenant dans un état partiel.
- Le paquet embarque des identifiants du tenant d'origine. Il ne s'installe pas ailleurs, ou il importe des références mortes.
- Le paquet contient des valeurs propres à un client (seuils, adresses). Le tenant suivant les reçoit sans les avoir choisies.

#### Idées reçues

- **« Un paquet est une copie de la configuration d'un client. »** Non. Une copie contient des choix locaux et des identifiants. Un paquet est un produit conçu pour s'installer partout.
- **« Un paquet est du code déployé. »** Non. C'est de la configuration interprétée par le moteur. Le code éventuel est une extension distincte ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).
- **« Les dépendances se résolvent d'elles-mêmes. »** Non. Elles se déclarent avec des plages, se vérifient avant l'installation et se consignent.

#### Principe clé

Un paquet est un produit de configuration : identifié, décrit par un manifeste, composé de composants à clé stable, avec des dépendances déclarées et une frontière nette avec les données et les choix du tenant.

#### Si vous ne retenez que trois choses

1. Un paquet emballe une configuration en un produit versionné, installable de façon répétable.
2. Le manifeste décrit le contenu, la compatibilité et les dépendances ; chaque composant a une clé stable.
3. Le paquet ne contient ni données, ni secrets, ni choix du tenant.

### 3. Explication technique détaillée

#### Ce qu'un paquet contient

| Famille | Exemples de composants | Entrées |
|---|---|---|
| Modèle de données | Types, champs, relations, listes de valeurs | [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés), [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique), [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) |
| Comportement | États, transitions, règles, workflows, automatisations | [6.1 État, statut et cycle de vie](06-workflow-etat-regles.md#61-état-statut-et-cycle-de-vie), [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états), [6.6 Règle métier, règle de validation, contrainte et politique](06-workflow-etat-regles.md#66-règle-métier-règle-de-validation-contrainte-et-politique), [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche), [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) |
| Accès | Rôles, modèles de permissions, politiques | [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée), [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) |
| Expérience | Vues, formulaires, tableaux de bord, modèles de notification | [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues), [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord), [17.3 Modèles de message et localisation](17-collaboration-communication-travail.md#173-modèles-de-message-et-localisation) |
| Restitution | Définitions de rapports, modèles de document | [19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](19-recherche-analytique-restitution.md#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport), [18.8 Modèles de document et génération de documents](18-fichiers-documents-contenus.md#188-modèles-de-document-et-génération-de-documents) |
| Données d'amorçage | Listes de référence, valeurs initiales | [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) |
| Traductions | Catalogues de messages | [25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli) |

**Ce qu'un paquet ne contient pas.**

| Exclu | Pourquoi | Où cela vit |
|---|---|---|
| Instances de ressources (aéronefs, constats) | Ce sont les données du tenant | Base du tenant |
| Valeurs de configuration choisies par le tenant | Ce sont ses choix | Couche du tenant ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) |
| Utilisateurs et affectations de rôles | Ils appartiennent au tenant | Annuaire du tenant |
| Secrets et identifiants d'intégration | Ils ne voyagent pas dans un produit | Gestion des secrets ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) |
| Journaux d'audit | Ils décrivent ce qui s'est passé chez le tenant | Journal du tenant ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) |
| Code d'extension | C'est un livrable distinct, avec un autre cycle de vie | Extension référencée ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) |

Une frontière reste subtile : les **définitions** de rôles appartiennent au paquet, leurs **affectations** au tenant.

#### Le manifeste

```json
{
  "manifest_version": 1,
  "pack_id": "acme.mro-aviation",
  "version": "2.4.0",
  "display_name": { "fr": "Maintenance aéronautique", "en": "Aviation maintenance" },
  "publisher": { "id": "acme", "name": "Acme Aero Software" },
  "platform": {
    "min_engine_version": "7.2.0",
    "max_engine_version": null,
    "required_capabilities": ["custom_fields", "workflow_engine", "rule_engine"]
  },
  "dependencies": [
    { "pack_id": "acme.quality-core", "range": "^1.3.0" },
    { "pack_id": "acme.notifications-base", "range": "^2.0.0" }
  ],
  "components": [
    { "key": "acme.resource_type.aircraft", "type": "resource_type", "file": "types/aircraft.json" },
    { "key": "acme.resource_type.finding", "type": "resource_type", "file": "types/finding.json" },
    { "key": "acme.workflow.finding_approval", "type": "workflow", "file": "workflows/finding_approval.json" },
    { "key": "acme.rule.no_flight_with_overdue_inspection", "type": "rule", "file": "rules/no_flight_overdue.json" },
    { "key": "acme.role.quality_manager", "type": "role", "file": "roles/quality_manager.json" }
  ],
  "install_parameters_schema": "parameters.schema.json",
  "seed_data": ["seed/finding_categories.json", "seed/inspection_intervals.json"],
  "license": "LicenseRef-Acme-Commercial-1.0"
}
```

| Champ | Rôle | Remarque |
|---|---|---|
| `pack_id` | Identité globale du paquet | Préfixe d'éditeur, puis nom |
| `version` | État publié du paquet | Règle en [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) |
| `platform` | Versions du moteur et capacités exigées | Refus d'installer si non satisfait |
| `dependencies` | Autres paquets nécessaires, avec une plage | Résolues avant l'installation |
| `components` | Liste des composants, avec clé et fichier | Chaque clé est stable |
| `install_parameters_schema` | Schéma des paramètres | Validé à l'installation ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)) |
| `seed_data` | Données d'amorçage | Idempotentes ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)) |
| `license` | Conditions d'utilisation | Voir [23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage) |

#### Des composants à clé stable

La clé d'un composant est son **identité** à travers les versions. La mise à niveau ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) rapproche le composant de la version N de celui de la version N+1 par sa clé. Trois règles :

1. **La clé est immuable.** Le libellé change, la clé non. La documentation de la plateforme de solutions de Microsoft indique de même qu'on ne peut pas renommer les éléments de métadonnées une fois créés.
2. **La clé porte un espace de noms.** Le préfixe d'éditeur évite les collisions : la même documentation décrit le préfixe d'éditeur comme un mécanisme qui permet d'installer dans un même environnement des solutions d'éditeurs différents avec peu de conflits.
3. **Un renommage est une suppression suivie d'un ajout.** On crée une nouvelle clé, on déprécie l'ancienne et l'on migre ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

#### Dépendances et ordre d'installation

Un paquet peut dépendre de trois sortes de choses.

| Sorte | Exemple | Contrôle |
|---|---|---|
| Capacité de la plateforme | `workflow_engine`, version minimale du moteur | Comparaison avec ce que le moteur déclare |
| Autre paquet | `acme.quality-core` en `^1.3.0` | Résolution de version, installation préalable |
| Prérequis du tenant | Module activé, droit d'usage ([1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)) | Vérification des droits |

La plage `^1.3.0` suit la convention de compatibilité des versions sémantiques : la documentation du gestionnaire de paquets de Rust définit `^1.2.3` comme `>=1.2.3, <2.0.0`. La plateforme applique la même règle : toute version 1.x à partir de 1.3.0, jamais 2.0.0.

L'ordre d'installation se déduit des dépendances : un paquet s'installe après ceux dont il dépend. Deux cas sont refusés : une plage non satisfaite par la version disponible, et un cycle.

```typescript
interface PackManifest {
  id: string;
  version: string;
  dependencies: Record<string, string>;
}

function parse(version: string): [number, number, number] {
  const [major, minor, patch] = version.split(".").map(Number);
  return [major, minor, patch];
}

// Plage « ^X.Y.Z » avec X >= 1 : de X.Y.Z (inclus) à (X+1).0.0 (exclu).
function satisfiesCaret(version: string, range: string): boolean {
  const [vMajor, vMinor, vPatch] = parse(version);
  const [rMajor, rMinor, rPatch] = parse(range.replace("^", ""));
  if (vMajor !== rMajor) {
    return false;
  }
  if (vMinor !== rMinor) {
    return vMinor > rMinor;
  }
  return vPatch >= rPatch;
}

function installOrder(available: Map<string, PackManifest>, rootId: string): string[] {
  const order: string[] = [];
  const state = new Map<string, "visiting" | "done">();

  function visit(id: string, range: string | null): void {
    const manifest = available.get(id);
    if (manifest === undefined) {
      throw new Error(`paquet introuvable : ${id}`);
    }
    if (range !== null && !satisfiesCaret(manifest.version, range)) {
      throw new Error(`${id} ${manifest.version} ne satisfait pas ${range}`);
    }
    const current = state.get(id);
    if (current === "done") {
      return;
    }
    if (current === "visiting") {
      throw new Error(`cycle de dépendances autour de ${id}`);
    }
    state.set(id, "visiting");
    for (const [depId, depRange] of Object.entries(manifest.dependencies)) {
      visit(depId, depRange);
    }
    state.set(id, "done");
    order.push(id);
  }

  visit(rootId, null);
  return order;
}
```

Avec `acme.mro-aviation` 2.4.0 qui dépend de `acme.quality-core` 1.5.2 et de `acme.notifications-base` 2.1.0 (dont dépend aussi `acme.quality-core`), l'ordre est : `acme.notifications-base`, puis `acme.quality-core`, puis `acme.mro-aviation`. Si `acme.quality-core` est disponible en 2.0.0 seulement, l'installation est refusée avec le message « `acme.quality-core` 2.0.0 ne satisfait pas `^1.3.0` ». *L'extrait ne gère que des plages `^X.Y.Z` avec X ≥ 1, sans pré-version : c'est une simplification.*

**Le même principe côté plateforme.** La documentation des solutions de Microsoft décrit le comportement symétrique : si l'on tente d'installer une solution qui exige une solution de base absente, l'installation est impossible ; et l'on ne peut pas désinstaller la solution de base tant qu'une solution qui en dépend reste installée. Un autre outil de paquets, Helm, déclare ses dépendances dans le fichier de description du paquet (liste avec nom, version, dépôt), les télécharge par une commande dédiée, et distingue la version du paquet (`version`) du champ informatif `appVersion`, sans rapport avec elle.

#### Le déroulé d'une installation

```text
Manifeste ─► Validation de forme ─► Compatibilité plateforme ─► Résolution des dépendances
                                                                          │
Enregistrement d'installation ◄── Vérifications finales ◄── Application des composants (dans l'ordre)
        │                              │                                 ▲
        ▼                              └─ échec : retour à l'état initial  │
   Événement « paquet installé »                         Paramètres validés + données d'amorçage
```

L'installation est **tout ou rien** pour la configuration : soit tous les composants sont appliqués et l'enregistrement est écrit, soit rien n'a changé. Les opérations longues, comme un chargement massif de données d'amorçage, procèdent par étapes reprenables ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)).

**Modes de défaillance.**

- **Composants identifiés par leur libellé.**
- **Dépendance implicite** vers un champ d'un autre paquet.
- **Données du tenant d'origine embarquées.**
- **Valeurs locales dans le paquet.**
- **Cycle de dépendances** entre deux paquets.
- **Installation partielle** laissée en l'état après un échec.

**Contre-exemple.** L'équipe d'un éditeur exporte la configuration d'un client pilote et la livre comme « paquet ». L'export contient les identifiants de ses utilisateurs, ses adresses de messagerie d'alerte et un jeton d'intégration. Installé chez le deuxième client, le paquet crée des rôles affectés à des identifiants qui n'existent pas, envoie des alertes à des inconnus, et la revue de sécurité découvre le jeton après coup.

**Limites.** Un paquet ne dit pas, à lui seul, ce que le tenant peut modifier ni comment une mise à jour traitera ses modifications : ce sont les couches ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) et la fusion ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)). Et la résolution des dépendances est simple tant que les plages sont compatibles : deux paquets qui exigent des majeures différentes d'un même troisième ne peuvent pas coexister, ce qui limite la composition ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée) | La démarche produit la configuration que le paquet emballe |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'architecture pilotée par les métadonnées rend le paquet possible |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La personnalisation du tenant s'applique par-dessus le paquet |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Les versions de paquet suivent les mêmes principes de versionnement |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Une extension de code est un livrable distinct, référencé par le paquet |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La marketplace distribue des paquets |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | Le moteur interprète les métadonnées du paquet |
| [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime) | L'installation passe par le plan de contrôle |
| [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) | Le paquet, construit une fois, est un artefact immuable |
| [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) | Le versionnement, l'amorçage et les paramètres complètent le manifeste |

### 5. Application pratique

**Situation initiale.** Pendant deux ans, l'équipe d'Acme Aero Software a configuré à la main la maintenance aéronautique chez chaque nouveau client. Le onzième client découvre que sa configuration diffère de celle des autres sur 40 points que personne n'a décidés. Une correction de règle doit être refaite onze fois.

**Problème.** La configuration n'est pas un produit : elle n'a ni identité, ni version, ni contenu connu.

**Application du concept.** L'équipe construit le paquet `acme.mro-aviation` à partir de la configuration de référence.

**Déroulé.**

1. Elle recense les composants et leur attribue des clés stables avec le préfixe `acme`.
2. Elle retire tout ce qui est propre à un client : identifiants, adresses, seuils locaux, jeton.
3. Elle déclare les dépendances : `acme.quality-core` en `^1.3.0`, `acme.notifications-base` en `^2.0.0`.
4. Elle déclare la compatibilité avec le moteur (7.2.0 au minimum).
5. Elle rédige le manifeste et vérifie qu'une installation sur un tenant vide donne le résultat attendu.
6. Alpha Air l'installe : la plateforme résout l'ordre, valide les paramètres, applique les composants et écrit l'enregistrement d'installation.

**Résultat.** Un tenant s'installe en une opération au lieu de plusieurs semaines, et une correction se publie une fois.

**Limites.** Les 40 points divergents des clients existants ne disparaissent pas : il faut, pour chacun, décider s'il s'agit d'un choix du client (couche du tenant) ou d'une dérive à résorber ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient un paquet de solution, et que ne contient-il pas ?
2. **Compréhension.** À quoi sert la clé stable d'un composant ?
3. **Compréhension.** Quelles sortes de dépendances un paquet peut-il déclarer ?
4. **Pourquoi.** Pourquoi une copie de la configuration d'un client n'est-elle pas un paquet ?
5. **Raisonnement pratique.** Le paquet A dépend de B en `^1.2.0` et de C en `^3.0.0`, et C dépend de B en `^2.0.0`. Peut-on installer A ?

#### Réponses

1. Il contient la configuration du produit : types, champs, états, règles, rôles, workflows, vues, modèles, données d'amorçage. Il ne contient ni les données du tenant, ni ses valeurs choisies, ni ses utilisateurs, ni ses secrets.
2. Elle permet de retrouver un composant d'une version à l'autre, indépendamment de son libellé : la mise à niveau rapproche les composants par leur clé.
3. D'autres paquets, avec une plage de versions ; des capacités de la plateforme, dont une version minimale du moteur ; des prérequis du tenant, comme un module activé ou un droit d'usage.
4. Parce qu'elle contient des choix locaux et des identifiants du client d'origine : elle ne se réinstalle pas ailleurs sans importer des valeurs, des références mortes ou des secrets.
5. Non. A exige B en 1.x et C, qui exige B en 2.x : aucune version unique de B ne satisfait les deux plages. L'installation est refusée avec une explication.

## 23.2 Versionnement, données d'amorçage et paramètres d'installation

### 1. Comprendre simplement

Le **versionnement d'un paquet** (*pack versioning*) donne à chaque état publié un numéro qui dit ce qui a changé et si la mise à jour est sûre. Les **données d'amorçage** (*seed data*) sont les valeurs initiales que le paquet installe avec sa configuration : listes de référence, catégories, intervalles. Les **paramètres d'installation** (*installation parameter*) sont les choix que le tenant fait à l'installation et que le paquet ne peut pas deviner : bases, langue, niveaux d'approbation.

**Pourquoi cela existe.** Un paquet installé chez 400 tenants se met à jour dans le temps. Pour que chaque tenant sache s'il peut passer à la version suivante sans risque, le numéro de version doit porter une promesse. Et le paquet doit s'installer utilement chez des clients différents : avec des valeurs initiales cohérentes, et avec des paramètres pour ce qui varie.

**Problème résolu.** Rendre l'évolution prévisible (les versions), l'installation immédiatement utile (l'amorçage) et l'adaptation possible sans modifier le paquet (les paramètres).

**Modèle mental.** Un manuel en éditions numérotées. La boîte contient aussi des étiquettes pré-remplies (l'amorçage) et un formulaire de commande (les paramètres). L'édition 2 corrige l'édition 1 ; le formulaire dit pour quel atelier on monte.

**Où l'analogie s'arrête.** Un livre imprimé ne se met pas à jour chez le lecteur. Les données d'amorçage installées peuvent être modifiées par le tenant, et les versions suivantes doivent composer avec ces modifications.

**Exemple.** `acme.mro-aviation` 2.4.0 s'installe chez Alpha Air avec les paramètres : bases `LYS` et `TLS`, langue `fr`, fuseau `Europe/Paris`, approbation à deux niveaux. Il amorce les catégories de constat et les intervalles d'inspection. Son numéro dit : « 2.4.0 : rien ne casse par rapport à 2.3.x, des fonctions s'ajoutent ».

**Les composants.**

1. le **numéro de version** et sa règle ;
2. la **surface publique** du paquet ;
3. le **journal des changements** ;
4. la **compatibilité** avec la plateforme ;
5. les **données d'amorçage** ;
6. le **schéma des paramètres** ;
7. les **valeurs de paramètres** choisies ;
8. l'**enregistrement d'installation**.

**Objectif d'apprentissage :** vous pouvez classer un changement de paquet en majeur, mineur ou correctif, décrire une donnée d'amorçage idempotente et concevoir le schéma des paramètres d'une installation.

### 2. Connaissances essentielles

#### Définition

- **Version de paquet** : identifiant immuable d'un état publié du paquet, de la forme MAJEURE.MINEURE.CORRECTIF.
- **Données d'amorçage** : données de référence et valeurs initiales livrées avec le paquet et installées de façon idempotente.
- **Paramètre d'installation** : valeur fournie à l'installation, validée par un schéma déclaré, qui détermine ce que l'installation génère ou configure.

#### Idées fondamentales

1. **Le numéro est une promesse.** Il dit si l'on peut mettre à jour sans adaptation.
2. **La promesse porte sur la surface publique.** Clés de composants, champs et leurs types, événements, points d'extension, rôles : ce sur quoi les clients s'appuient.
3. **Une version publiée est immuable.** Une correction est une nouvelle version.
4. **L'amorçage est idempotent.** Il s'appuie sur des clés stables : installer deux fois ne duplique rien.
5. **L'amorçage ne reprend pas ce que le tenant a modifié.** Une valeur amorcée puis modifiée par le tenant lui appartient.
6. **Les paramètres sont déclarés et validés.** Type, valeurs permises, défaut, caractère obligatoire.
7. **Tout est consigné.** Version, paramètres et dépendances résolues forment l'enregistrement d'installation.

#### Vocabulaire essentiel

- **Version majeure, mineure, correctif** (*major, minor, patch*) : les trois nombres d'une version sémantique.
- **Surface publique** (*public API*, *public surface*) : ce que le paquet promet de ne pas casser.
- **Pré-version** (*pre-release*) : version annoncée comme instable, de précédence inférieure à la version finale.
- **Journal des changements** (*changelog*) : liste des changements entre deux versions.
- **Donnée de référence** (*reference data*) : valeur d'une liste partagée : catégories, causes, niveaux.
- **Idempotent** (*idempotent*) : appliqué plusieurs fois, donne le même résultat qu'appliqué une fois.
- **Schéma de paramètres** (*parameter schema*) : description des paramètres attendus et de leurs contraintes.
- **Données de démonstration** (*sample data*) : exemples pour essai, facultatifs et supprimables, distincts de l'amorçage.

#### Relations de cause à effet

- Les versions ne suivent aucune règle. Chaque tenant reporte la mise à jour par prudence, ou la fait en aveugle.
- L'amorçage est ré-appliqué en écrasant à chaque mise à niveau. Les listes que le tenant a adaptées reviennent à l'état d'origine.
- L'amorçage n'est pas idempotent. Une réinstallation après un échec double les catégories.
- Les paramètres sont libres. Une faute de frappe dans un code de base produit une configuration silencieusement fausse.
- Un secret est passé en paramètre. Il est conservé dans l'enregistrement d'installation.

#### Idées reçues

- **« Le numéro de version est une question de communication. »** Non. Il porte une promesse de compatibilité qui conditionne la décision de mettre à jour.
- **« Les données d'amorçage sont des données de démonstration. »** Non. L'amorçage est nécessaire au fonctionnement ; la démonstration est facultative et supprimable.
- **« Un paramètre d'installation est un réglage. »** Pas exactement. Un réglage se change à chaud dans la cascade ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)). Un paramètre peut déterminer ce que l'installation génère, comme une entité par base.

#### Principe clé

Le numéro de version promet la compatibilité de la surface publique ; l'amorçage est idempotent et ne reprend pas ce que le tenant a modifié ; les paramètres sont déclarés, validés et consignés.

#### Si vous ne retenez que trois choses

1. La règle de version porte sur la surface publique du paquet, et une version publiée ne change plus.
2. Les données d'amorçage s'installent de façon idempotente, par clés stables, sans écraser les modifications du tenant.
3. Les paramètres d'installation se déclarent par un schéma, se valident à l'installation et se consignent.

### 3. Explication technique détaillée

#### Le versionnement sémantique appliqué à une configuration

La spécification du versionnement sémantique 2.0.0 fournit les règles. Elle exige qu'un logiciel déclare une interface publique (règle 1), interdit de modifier une version publiée (règle 3), réserve la majeure zéro au développement initial où tout peut changer (règle 4), demande d'incrémenter la majeure pour tout changement incompatible de l'interface publique (règle 8), la mineure pour un ajout compatible ou pour la dépréciation d'une fonction (règle 7), et le correctif pour une correction compatible (règle 6). Une pré-version est instable et de précédence inférieure à la version finale ; les métadonnées de construction sont ignorées dans la comparaison (règles 9 à 11).

Pour un paquet, la **surface publique** est l'ensemble des éléments sur lesquels les tenants et leurs intégrations s'appuient. Le manifeste la déclare : clés de composants, champs et types, événements émis, points d'extension, rôles, clés de réglages.

| Changement dans le paquet | Compatible ? | Incrément |
|---|---|---|
| Correction d'un libellé, d'une règle erronée | Oui | Correctif |
| Ajout d'un champ facultatif, d'une vue, d'un workflow | Oui | Mineure |
| Changement d'une valeur par défaut du paquet, annoncé | Compatible mais visible | Mineure, avec note de version |
| Marquage d'un composant comme déprécié | Oui | Mineure |
| Ajout d'un champ obligatoire sans valeur par défaut | Non | Majeure |
| Suppression ou renommage d'un composant, d'une clé, d'un événement | Non | Majeure |
| Changement du type d'un champ | Non | Majeure |
| Ajout d'une valeur à une énumération fermée | Non | Majeure |

Un point mérite une règle explicite : chaque énumération publique est déclarée **ouverte** (les consommateurs doivent tolérer des valeurs inconnues) ou **fermée** (la liste est exhaustive). Ajouter une valeur à une énumération fermée casse les consommateurs qui l'énumèrent : c'est un changement majeur.

```typescript
type ChangeKind =
  | "remove_component"
  | "rename_component"
  | "change_field_type"
  | "add_required_field"
  | "add_optional_field"
  | "add_component"
  | "deprecate_component"
  | "fix_rule"
  | "fix_label";

function requiredBump(changes: ChangeKind[]): "major" | "minor" | "patch" {
  const major: ChangeKind[] = ["remove_component", "rename_component", "change_field_type", "add_required_field"];
  const minor: ChangeKind[] = ["add_optional_field", "add_component", "deprecate_component"];
  if (changes.some((change) => major.includes(change))) {
    return "major";
  }
  if (changes.some((change) => minor.includes(change))) {
    return "minor";
  }
  return "patch";
}
```

Appliquée à `["fix_label", "fix_rule"]`, la fonction renvoie `patch` ; à `["fix_label", "add_optional_field", "deprecate_component"]`, `minor` ; à `["add_optional_field", "rename_component"]`, `major`. La classification des changements se déduit en grande partie d'une différence entre deux versions ([9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence)), mais elle demande une revue pour les changements de sens : une valeur dont la signification change n'apparaît pas dans une différence structurelle.

**Quatre numéros à ne pas confondre.**

| Version | Ce qu'elle désigne | Qui la change | Exemple |
|---|---|---|---|
| Version du paquet | Contenu configuré du produit vertical | L'éditeur | 2.4.0 |
| Version du moteur | Code de la plateforme | Le fournisseur de la plateforme | 7.2.1 |
| Version de configuration du tenant | État publié de ses réglages et personnalisations ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) | Le tenant | cfg-118 |
| Version du schéma de données | Structure des tables ([2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)) | Les migrations | 214 |

La compatibilité entre le paquet et le moteur se déclare dans le manifeste (`platform`, voir [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)). Le journal des changements se génère par comparaison de deux versions :

```json
{
  "pack_id": "acme.mro-aviation",
  "from": "2.3.1",
  "to": "2.4.0",
  "changes": [
    { "kind": "add_component", "key": "acme.state.maintenance_task.waiting_parts", "note": "Nouvel état « en attente de pièce »" },
    { "kind": "change_default", "key": "acme.workflow.finding_approval.review.delay_days", "from": 2, "to": 1 },
    { "kind": "deprecate_component", "key": "acme.field.finding.severity_legacy", "remove_in": "3.0.0" }
  ],
  "required_bump": "minor"
}
```

#### Les données d'amorçage

Un paquet livre trois sortes de données, qu'il faut séparer.

| Sorte | Exemples | Nécessaire ? | Après l'installation |
|---|---|---|---|
| Données d'amorçage | Catégories de constat, causes, intervalles d'inspection | Oui | Appartiennent au tenant dès qu'il les modifie |
| Données de démonstration | Aéronefs et constats fictifs pour un essai | Non | Supprimables en une opération |
| Données du tenant | Aéronefs, constats réels | Jamais dans le paquet | Propres au tenant |

L'amorçage se comporte comme une migration répétable. Dans la documentation de l'outil de migration de bases Flyway, les migrations répétables ne s'exécutent que lorsqu'elles ont changé, après les migrations versionnées ; la commande de migration est idempotente et l'historique des migrations appliquées enregistre quoi, quand et par qui. Le paquet reprend ce schéma : chaque élément d'amorçage a une clé stable, une empreinte de contenu et une origine.

```sql
CREATE TABLE reference_value (
  tenant_id    uuid        NOT NULL,
  list_key     text        NOT NULL,
  value_key    text        NOT NULL,
  label        text        NOT NULL,
  retired      boolean     NOT NULL DEFAULT false,
  origin       text        NOT NULL CHECK (origin IN ('pack', 'tenant')),
  pack_id      text,
  pack_version text,
  PRIMARY KEY (tenant_id, list_key, value_key)
);

-- Installation : insère ce qui manque, n'écrase rien
INSERT INTO reference_value (tenant_id, list_key, value_key, label, origin, pack_id, pack_version)
VALUES ($1, 'finding_category', 'structural', 'Structure', 'pack', 'acme.mro-aviation', '2.4.0')
ON CONFLICT (tenant_id, list_key, value_key) DO NOTHING;

-- Mise à niveau : ne met à jour que ce que le tenant n'a jamais modifié
UPDATE reference_value
   SET label = $4,
       pack_version = $5
 WHERE tenant_id = $1
   AND list_key = $2
   AND value_key = $3
   AND origin = 'pack'
   AND label <> $4;
```

Quand un tenant modifie une valeur amorcée, son origine passe à `tenant` : la mise à niveau ne la touche plus et la signale si le paquet a aussi changé ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)). Une valeur retirée du paquet n'est pas supprimée : elle est **retirée** (`retired = true`), c'est-à-dire masquée pour les nouvelles saisies, parce que des enregistrements existants la référencent.

#### Les paramètres d'installation

Les paramètres se déclarent par un schéma, dans le format JSON Schema :

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["bases", "default_language"],
  "properties": {
    "bases": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string", "pattern": "^[A-Z]{3}$" },
      "description": "Codes des bases de maintenance"
    },
    "default_language": { "type": "string", "enum": ["fr", "en", "es"], "default": "fr" },
    "timezone": { "type": "string", "default": "Europe/Paris" },
    "approval_levels": { "type": "string", "enum": ["one_level", "two_levels"], "default": "two_levels" }
  },
  "additionalProperties": false
}
```

Helm procède de même pour ses paquets : un fichier de valeurs porte les valeurs par défaut, l'utilisateur les surcharge à l'installation, et un schéma JSON, s'il existe, valide l'ensemble final des valeurs à l'installation, à la mise à niveau et à la vérification statique.

L'installation valide les valeurs contre le schéma **avant** d'appliquer quoi que ce soit, et refuse en expliquant la contrainte violée. Les paramètres se distinguent des réglages ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) :

| Critère | Paramètre d'installation | Réglage de configuration |
|---|---|---|
| Moment | À l'installation (et à sa ré-application) | À chaud, à tout moment |
| Effet | Peut générer des composants (une entité par base) | Change une valeur lue à l'exécution |
| Portée | Un paquet | Cascade de niveaux |
| Changement | Par ré-application, qui produit un plan ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)) | Par modification versionnée ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) |

Chaque paramètre précise s'il est **modifiable après installation** : le préfixe de numérotation des constats ne l'est pas, la liste des bases l'est par ré-application. Les secrets ne passent jamais en valeur : le paramètre porte une **référence** vers le gestionnaire de secrets ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).

L'**enregistrement d'installation** consigne ce qui a été fait :

```sql
CREATE TABLE pack_installation (
  tenant_id     uuid        NOT NULL,
  pack_id       text        NOT NULL,
  version       text        NOT NULL,
  status        text        NOT NULL CHECK (status IN ('installing', 'installed', 'failed', 'uninstalling')),
  parameters    jsonb       NOT NULL DEFAULT '{}',
  resolved_deps jsonb       NOT NULL DEFAULT '{}',
  installed_by  uuid        NOT NULL,
  installed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, pack_id)
);
```

```json
{
  "tenant_id": "ten_airline_01",
  "pack_id": "acme.mro-aviation",
  "version": "2.4.0",
  "parameters": { "bases": ["LYS", "TLS"], "default_language": "fr", "timezone": "Europe/Paris", "approval_levels": "two_levels" },
  "resolved_deps": { "acme.quality-core": "1.5.2", "acme.notifications-base": "2.1.0" },
  "status": "installed"
}
```

Cet enregistrement est la **base** des fusions à trois voies ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) : il dit quelle version, avec quels paramètres, a produit la configuration d'origine du tenant.

**Modes de défaillance.**

- **Numéro sans règle.**
- **Surface publique non déclarée.**
- **Amorçage qui écrase** les modifications du tenant.
- **Amorçage non idempotent.**
- **Paramètres libres**, sans schéma ni validation.
- **Secret en clair** dans les paramètres ou l'enregistrement.

**Contre-exemple.** Un éditeur publie 2.4.0 comme version mineure alors qu'elle renomme la clé d'un événement, `finding.critical` devenant `finding.critical_created`. Les automatisations et les intégrations de 130 tenants qui écoutent l'ancien nom cessent de se déclencher le jour de la mise à jour automatique des versions mineures. Le numéro promettait une compatibilité que le contenu ne tenait pas.

**Limites.** Le versionnement sémantique est une convention : aucun outil ne vérifie la compatibilité d'un paquet à votre place, et la qualité de la promesse dépend de la qualité de la déclaration de la surface publique. Les changements de sens échappent à l'analyse structurelle. Enfin, une version majeure n'est pas un échec : c'est le moment prévu pour retirer ce qui a été déprécié ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement de la configuration pose les mêmes principes ; ici appliqués à un produit |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | L'évolution de schéma suit la même logique de compatibilité |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API suit les mêmes règles de compatibilité et de dépréciation |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | Les environnements reçoivent des versions différentes, promues en séquence |
| [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) | L'artefact de paquet est construit une fois et immuable |
| [21.10 Gestion des versions et mesures de livraison](21-livraison-qualite-logicielle.md#2110-gestion-des-versions-et-mesures-de-livraison) | La gestion des versions et les mesures de livraison s'appliquent aux paquets |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | L'installation fait partie du provisionnement d'un tenant |
| [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances) | Le manifeste porte la version et le schéma des paramètres |
| [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation) | La mise à niveau applique la règle de fusion aux données d'amorçage |

### 5. Application pratique

**Situation initiale.** Pour la version 2.4.0, un ingénieur propose d'ajouter aux constats un champ obligatoire `inspection_authority`, l'autorité qui a demandé l'inspection. La proposition passe en revue.

**Problème.** Le changement est-il compatible ? Les tenants qui ont des intégrations d'import de constats n'envoient pas ce champ.

**Application du concept.** L'équipe classe le changement avec la règle de versionnement.

**Déroulé.**

1. Le journal des changements généré indique `add_required_field` : la classification donne une version majeure.
2. Une majeure impose une période de coexistence et un effort de migration chez tous les tenants : le bénéfice ne le justifie pas.
3. L'équipe change la conception : le champ devient **facultatif**, avec une règle de validation activable par réglage de tenant ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)).
4. Le journal des changements indique désormais `add_optional_field` : version mineure 2.4.0.
5. Le paquet amorce une liste d'autorités ; la mise à niveau l'ajoute chez les tenants sans toucher aux listes qu'ils ont déjà adaptées.
6. Pour les nouvelles installations, un paramètre `require_authority` (booléen, `false` par défaut) active la règle dès l'installation.

**Résultat.** Les tenants passent à 2.4.0 sans adaptation, et ceux qui le souhaitent exigent le champ.

**Limites.** La règle activable par tenant introduit une combinaison de plus à tester ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)), et le champ facultatif peut rester vide chez des tenants qui ne l'activent jamais.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels changements d'un paquet imposent une version majeure ?
2. **Compréhension.** Qu'est-ce qui distingue les données d'amorçage des données de démonstration ?
3. **Compréhension.** Pourquoi les paramètres d'installation sont-ils décrits par un schéma ?
4. **Pourquoi.** Pourquoi une valeur d'amorçage retirée du paquet n'est-elle pas supprimée chez les tenants ?
5. **Raisonnement pratique.** Un paquet passe de la 3.1.4 à une version qui ajoute un workflow, corrige un libellé et déprécie un champ. Quelle est la version suivante ?

#### Réponses

1. Les changements incompatibles de la surface publique : suppression ou renommage d'un composant, d'une clé ou d'un événement, changement du type d'un champ, ajout d'un champ obligatoire sans valeur par défaut, ajout d'une valeur à une énumération fermée.
2. L'amorçage est nécessaire au fonctionnement et s'installe de façon idempotente. La démonstration est facultative et supprimable en une opération.
3. Pour valider les valeurs avant d'appliquer quoi que ce soit, expliquer une erreur par la contrainte violée, documenter les paramètres et empêcher les valeurs libres.
4. Parce que des enregistrements existants la référencent : on la retire (masquée pour les nouvelles saisies) pour ne pas casser les références.
5. 3.2.0 : un ajout compatible et une dépréciation sont des changements mineurs, et la correction de libellé est absorbée dans le même incrément ; le correctif remet à zéro.

## 23.3 Configuration en couches, surface de personnalisation et points d'extension stables

### 1. Comprendre simplement

La **configuration en couches** (*layered configuration*) range les valeurs dans des couches séparées : celle du paquet, celle du tenant, celle de l'utilisateur. La valeur effective est celle de la couche la plus spécifique qui la définit. La **surface de personnalisation** (*customization surface*) est l'ensemble de ce que le paquet autorise le tenant à modifier, composant par composant. Un **point d'extension stable** (*stable extension point*) est un endroit nommé, versionné et documenté où un tenant ou un partenaire peut brancher de la logique, avec la promesse que le contrat ne cassera pas à la mise à jour.

**Pourquoi cela existe.** Un tenant doit pouvoir adapter le produit, et le produit doit pouvoir évoluer. Les deux ne vont ensemble que si ce qui vient du produit et ce qui vient du tenant sont stockés séparément, et si le produit dit clairement où l'adaptation est permise et garantie.

**Problème résolu.** Permettre la personnalisation sans qu'elle devienne un obstacle à la mise à jour.

**Modèle mental.** Un plan imprimé et des calques transparents. Le plan est celui du produit ; le tenant annote son calque ; chaque utilisateur a le sien. On lit en regardant à travers les calques. Remplacer le plan n'efface pas les annotations.

**Où l'analogie s'arrête.** Un calque se superpose sans interprétation. Ici, si le plan change à l'endroit annoté, l'annotation peut perdre son sens : il faut le détecter ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

**Exemple.** Alpha Air surcharge, dans sa couche, le délai de revue d'un constat : 3 jours au lieu de 2. Karim choisit l'affichage compact dans sa couche d'utilisateur. Le paquet n'est pas modifié. Quand la version 2.4.0 change la valeur du paquet, la valeur d'Alpha Air continue de s'appliquer.

**Les composants.**

1. les **couches** : paquet, offre, tenant, organisation, utilisateur ;
2. la **règle de résolution** de la valeur effective ;
3. les **surcharges**, stockées comme des écarts ;
4. la **granularité** : valeur, élément de liste, composant ;
5. la **politique de personnalisation** de chaque composant ;
6. les **points d'extension** et leurs contrats ;
7. la **politique de stabilité** et de dépréciation ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)) ;
8. l'**explication** de l'origine de chaque valeur.

**Objectif d'apprentissage :** vous pouvez décrire la résolution d'une valeur à travers les couches, choisir la granularité d'une surcharge et distinguer une personnalisation garantie d'une personnalisation tolérée.

### 2. Connaissances essentielles

#### Définition

- **Configuration en couches** : organisation de la configuration en couches distinctes, de la plus générale à la plus spécifique, dont la valeur effective se déduit sans copie entre couches.
- **Surface de personnalisation** : ensemble des composants et des propriétés que le paquet déclare modifiables par le tenant, avec le niveau de modification permis.
- **Point d'extension stable** : endroit déclaré de la plateforme ou d'un paquet où l'on branche de la logique, défini par un contrat versionné.

#### Idées fondamentales

1. **Chaque couche est stockée à part.** On ne copie jamais les valeurs du paquet dans la couche du tenant.
2. **La couche la plus spécifique gagne.** La valeur effective vient du dessus de la pile.
3. **Une surcharge est un écart.** Elle ne contient que ce qui diffère du standard.
4. **Le paquet déclare ce qui est personnalisable.** Verrouillé, valeurs, extension ou remplacement, composant par composant.
5. **Plus la surface est large, plus la mise à jour coûte.** On la garde étroite et explicite.
6. **Un point d'extension est un contrat.** Nommé, versionné, testé, déprécié selon une politique.
7. **Ce qui n'est pas déclaré n'est pas garanti.** Les éléments internes ne sont pas des points d'extension.

#### Vocabulaire essentiel

- **Couche** (*layer*) : niveau de la pile où des valeurs sont définies : paquet (*pack*), tenant, utilisateur (*user*).
- **Valeur effective** (*effective value*) : valeur qui s'applique, après résolution des couches.
- **Surcharge** (*override*) : valeur d'une couche plus spécifique qui remplace celle d'une couche plus générale.
- **Politique de personnalisation** (*customization policy*) : déclaration, par composant, de ce qui est modifiable.
- **Propriétés gérées** (*managed properties*) : nom que certaines plateformes donnent à cette déclaration.
- **Point d'extension** (*extension point*) : endroit prévu pour brancher de la logique.
- **Contrat** (*contract*) : description versionnée des entrées, des sorties et des limites d'un point d'extension.
- **Remplacement** (*replace*) : surcharge d'un composant entier.

#### Relations de cause à effet

- Les valeurs du paquet sont copiées dans la couche du tenant à l'installation. Les changements du paquet ne se propagent plus, et la mise à niveau ne sait plus distinguer ce que le tenant a choisi.
- Tout est personnalisable. Chaque mise à jour risque de casser une personnalisation, et le support ne sait plus ce qui est standard.
- Rien n'est personnalisable. Les clients contournent par des tableurs, des extensions improvisées ou des demandes de développement spécifique.
- Un point d'extension n'est pas versionné. Une mise à jour change le format des données transmises, et les extensions des tenants cessent de fonctionner.

#### Idées reçues

- **« Plus de surface de personnalisation, c'est plus de valeur. »** Non. Chaque point personnalisable est une promesse à tenir à chaque version et une combinaison de plus à tester.
- **« Personnaliser, c'est modifier le paquet du tenant. »** Non. Modifier la copie du paquet éloigne le tenant du produit. On surcharge dans sa couche.
- **« Tout endroit où l'on peut brancher du code est un point d'extension. »** Non. Il est stable s'il est déclaré, versionné et testé.

#### Principe clé

On sépare le produit et les choix du tenant en couches ; on déclare ce qui est personnalisable ; on garantit les points d'extension. Ce qui est garanti survit aux mises à jour, ce qui ne l'est pas peut casser.

#### Si vous ne retenez que trois choses

1. Les valeurs du paquet, du tenant et de l'utilisateur sont stockées dans des couches séparées, sans copie.
2. Le paquet déclare ce qui est personnalisable, au niveau de chaque composant.
3. Les points d'extension sont des contrats versionnés : on les fait évoluer par une nouvelle version, pas en les modifiant.

### 3. Explication technique détaillée

#### Les couches et la résolution

La cascade de réglages du module 5 ([5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) va de la plateforme à l'utilisateur. Le paquet s'y insère juste après le défaut de la plateforme : ses valeurs sont les valeurs du produit.

```text
Plateforme  <  Paquet  <  Offre  <  Tenant  <  Organisation  <  Équipe  <  Utilisateur
(défaut du moteur) (valeurs du produit)  (surcharges du client)         (préférences)
plus général ─────────────────────────────────────────────────────────► plus spécifique
```

La **règle** est celle de la cascade : la valeur effective est celle de la couche la plus spécifique qui la définit. La documentation de Microsoft sur les couches de solutions décrit le même principe : plusieurs solutions gérées sont empilées, la dernière installée au-dessus de la précédente ; en cas de définitions conflictuelles, le comportement à l'exécution est « le dernier gagne » ou une logique de fusion ; si l'on désinstalle une solution gérée, celle du dessous prend effet. Elle précise aussi que seuls trois types de composants (application pilotée par modèle, formulaire, plan de site) sont fusionnés : tous les autres suivent la règle du dessus qui gagne.

```json
{
  "component": "acme.workflow.finding_approval",
  "property": "steps.review.delay_days",
  "layers": [
    { "layer": "pack", "ref": "acme.mro-aviation@2.3.1", "value": 2 },
    { "layer": "tenant", "ref": "ten_airline_01", "value": 3, "set_by": "usr_sophie", "set_at": "2026-03-04T09:12:00Z" }
  ],
  "effective": { "value": 3, "from": "tenant" }
}
```

#### Une surcharge est un écart, jamais une copie

Les valeurs du paquet se lisent dans la **version installée** du paquet, qui est immuable. La couche du tenant ne contient que ses écarts. Ainsi, un tenant qui n'a rien surchargé **suit** le paquet : une mise à niveau change la version installée, et toutes ses valeurs suivent.

```sql
-- Valeurs du paquet : stockées une fois par version, jamais copiées par tenant
CREATE TABLE pack_default (
  pack_id text  NOT NULL,
  version text  NOT NULL,
  key     text  NOT NULL,
  value   jsonb NOT NULL,
  PRIMARY KEY (pack_id, version, key)
);

-- Surcharges du tenant et de l'utilisateur : uniquement les écarts
CREATE TABLE config_override (
  tenant_id uuid  NOT NULL,
  scope     text  NOT NULL CHECK (scope IN ('tenant', 'user')),
  scope_ref text  NOT NULL,
  key       text  NOT NULL,
  value     jsonb NOT NULL,
  PRIMARY KEY (tenant_id, scope, scope_ref, key)
);

-- Valeur effective pour un utilisateur : utilisateur, puis tenant, puis paquet
SELECT DISTINCT ON (key) key, value, layer
  FROM (
    SELECT d.key, d.value, 'pack' AS layer, 1 AS rank
      FROM pack_installation i
      JOIN pack_default d ON d.pack_id = i.pack_id AND d.version = i.version
     WHERE i.tenant_id = $1
    UNION ALL
    SELECT key, value, scope AS layer, CASE scope WHEN 'tenant' THEN 2 ELSE 3 END AS rank
      FROM config_override
     WHERE tenant_id = $1
       AND ((scope = 'tenant' AND scope_ref = $1::text) OR (scope = 'user' AND scope_ref = $2))
  ) AS layers
 ORDER BY key, rank DESC;
```

La même logique, en code, avec les trois couches :

```typescript
type Layer = "pack" | "tenant" | "user";

const rank: Record<Layer, number> = { pack: 1, tenant: 2, user: 3 };

interface LayerValue {
  layer: Layer;
  key: string;
  value: unknown;
}

function effectiveValues(values: LayerValue[]): Map<string, LayerValue> {
  const result = new Map<string, LayerValue>();
  for (const candidate of values) {
    const current = result.get(candidate.key);
    if (current === undefined || rank[candidate.layer] > rank[current.layer]) {
      result.set(candidate.key, candidate);
    }
  }
  return result;
}
```

Avec les valeurs `finding.review_delay_days` (paquet 2, tenant 3), `finding.label` (paquet « Constat ») et `ui.density` (paquet « comfortable », utilisateur « compact »), la fonction renvoie 3 (couche du tenant), « Constat » (paquet) et « compact » (utilisateur).

**L'origine de chaque valeur s'affiche.** L'interface d'administration montre, pour chaque réglage, sa valeur effective et sa couche d'origine : « 3 jours, défini par votre organisation ; la valeur du produit est 2 jours ». C'est la condition pour que l'administrateur comprenne ce qu'une mise à niveau changera ([12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

#### La granularité d'une surcharge

| Granularité | Principe | Atout | Limite |
|---|---|---|---|
| Propriété | Surcharge d'une propriété scalaire | Fine : le reste du composant suit le produit | Beaucoup de surcharges à suivre |
| Élément de liste, par clé | Ajout, retrait ou modification d'un élément identifié | Les listes se fusionnent | Exige des clés stables dans les éléments |
| Composant entier | Le tenant remplace le composant | Simple et total | Le composant ne reçoit plus les corrections du produit |
| Liste ordonnée sans clés (étapes d'un workflow) | Remplacement de la liste entière | Évite des fusions incohérentes | Le composant se fige |

Plus la granularité est fine, plus le tenant conserve de standard et reçoit de corrections ; plus elle est grossière, plus la fusion est simple et plus la dérive est probable ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

#### La surface de personnalisation

Le paquet déclare, pour chaque composant, ce que le tenant peut faire. La documentation de Microsoft décrit le principe sous le nom de propriétés gérées : l'éditeur choisit quels composants sont personnalisables ; un interrupteur général « autoriser les personnalisations » commande les autres options ; les propriétés s'appliquent quand la solution est packagée et installée ailleurs, et ne peuvent plus changer après l'import, sauf par une mise à jour de l'éditeur d'origine. Le même texte recommande de verrouiller les composants, sauf besoin d'adaptation, et de ne jamais permettre la personnalisation des composants critiques qui portent la fonction centrale de la solution. Il précise enfin que ces propriétés ne sont pas une protection des droits ni un mécanisme de licence ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

```json
{
  "components": [
    {
      "key": "acme.workflow.finding_approval",
      "customization": {
        "level": "values",
        "editable_properties": ["steps.review.delay_days", "steps.review.assignee_role", "labels.*"],
        "extensible": { "steps": "insert_between_declared_anchors" }
      }
    },
    {
      "key": "acme.rule.no_flight_with_overdue_inspection",
      "customization": { "level": "locked", "reason": "règle de sécurité du produit" }
    },
    {
      "key": "acme.view.findings_open",
      "customization": { "level": "replace" }
    }
  ]
}
```

| Niveau | Ce que le tenant peut faire | Coût de mise à niveau |
|---|---|---|
| Verrouillé | Rien | Nul |
| Valeurs | Modifier des propriétés nommées | Faible |
| Extension | Ajouter des éléments (champs, vues, étapes à des ancrages déclarés) | Moyen |
| Remplacement | Remplacer le composant | Élevé : le composant sort du standard |
| Extension de code | Brancher du code à un point d'extension | Élevé : dépend du contrat |

Une autre documentation d'éditeur de plateforme, celle de Salesforce, classe de façon voisine les propriétés d'un composant packagé en trois catégories : modifiables par l'éditeur seul, par l'éditeur et par l'abonné, ou par aucun des deux (d'après des extraits consultés par recherche, voir les références).

#### Les points d'extension stables

Un point d'extension est un endroit nommé où la logique d'un tenant ou d'un partenaire s'insère : validation avant clôture, action de workflow, widget de tableau de bord, rendu de document, canal de notification. Il se décrit par un contrat :

```json
{
  "extension_point": "acme.finding.before_close",
  "version": "v1",
  "input_schema": { "finding_id": "string", "severity": "enum(minor,major,critical)", "tenant_context": "object" },
  "output_schema": { "allow": "boolean", "reason": "string" },
  "limits": { "timeout_ms": 500, "side_effects": "none" },
  "on_failure": "fail_open_with_warning",
  "stability": "stable",
  "deprecated_since": null
}
```

La règle de stabilité s'inspire de la politique de dépréciation de Kubernetes : un élément d'API ajouté à une version donnée ne peut pas être retiré de cette version ni voir son comportement changer de façon significative ; on ne le retire qu'en incrémentant la version du groupe d'API ; et les objets doivent pouvoir passer d'une version à l'autre sans perte d'information. Pour un point d'extension, cela se traduit ainsi : un comportement nouveau est une version `v2` du point, servie en parallèle de `v1` pendant la période de coexistence ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

| Stable (garanti) | Non garanti (interne) |
|---|---|
| Points d'extension déclarés, versionnés | Noms internes de tables ou de classes |
| Clés de composants publiées | Ordre d'exécution non documenté |
| Événements et schémas documentés | Champs non documentés des événements |
| Propriétés déclarées éditables | Structure interne des composants verrouillés |
| API publiques versionnées ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) | Sélecteurs et structure de l'interface |

Le code d'extension s'exécute avec les protections du module 10 : bac à sable, permissions minimales, limites de débit ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés), [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)).

**Modes de défaillance.**

- **Valeurs du paquet copiées** dans la couche du tenant.
- **Tout est personnalisable**, y compris les règles de sécurité.
- **Remplacement systématique** de composants entiers.
- **Point d'extension non versionné.**
- **Origine des valeurs invisible** pour l'administrateur.
- **Extension branchée sur un élément interne** non garanti.

**Contre-exemple.** À l'installation, la plateforme copie toutes les valeurs du paquet dans la configuration du tenant, « pour que le tenant puisse tout modifier ». Dix-huit mois plus tard, le paquet corrige un seuil de sécurité : aucun des 300 tenants ne le reçoit, car chacun a désormais une copie, et la plateforme ne peut plus distinguer ce qui a été choisi de ce qui a été copié.

**Limites.** La séparation en couches exige que le moteur sache résoudre les valeurs à la lecture et expliquer leur origine : c'est un coût d'architecture. La garantie d'un point d'extension est une charge à long terme : chaque version servie doit être maintenue et testée. Enfin, une surface étroite est inconfortable pour les clients, qui demandent toujours « un champ de plus » : le bon équilibre se règle par l'observation des demandes ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La cascade de configuration est étendue par la couche du paquet |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | Les métadonnées rendent les couches interprétables par le moteur |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions de code s'attachent aux points d'extension |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Les contrats d'extension suivent les règles de versionnement d'API |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'origine d'une valeur s'explique à l'administrateur |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Configuration ou code : la surface de personnalisation tranche |
| [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances) | Le manifeste porte la politique de personnalisation des composants |
| [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation) | La fusion à trois voies opère sur les couches |
| [23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage) | La dépréciation gouverne le retrait d'un point d'extension |

### 5. Application pratique

**Situation initiale.** Alpha Air veut un délai de revue de 3 jours au lieu de 2, et une étape d'approbation supplémentaire de la direction pour les constats critiques. L'éditeur ne veut ni forker le paquet pour Alpha Air, ni perdre ces choix à la prochaine mise à jour.

**Problème.** Adapter un workflow du produit sans le modifier.

**Application du concept.** Le paquet déclare le workflow `acme.workflow.finding_approval` au niveau « valeurs » avec des ancrages d'extension.

**Déroulé.**

1. Sophie, responsable qualité d'Alpha Air, ouvre le workflow d'approbation. L'interface affiche chaque valeur avec son origine : « produit » ou « votre organisation ».
2. Elle modifie `steps.review.delay_days` à 3 : l'écart est enregistré dans la couche du tenant ; la valeur du paquet reste 2.
3. Elle insère l'étape « approbation de la direction » à l'ancrage prévu après l'approbation qualité, avec la condition « gravité critique » : la plateforme l'enregistre comme extension dans la couche du tenant.
4. Elle tente de supprimer la règle « pas de vol avec une inspection échue » : la plateforme refuse (composant verrouillé), avec la raison déclarée par le paquet.
5. Un aperçu montre l'effet : « 4 constats ouverts seraient concernés par le nouveau délai ».

**Résultat.** Deux écarts, enregistrés comme tels. Le reste du workflow suit le produit et recevra ses corrections.

**Limites.** Le workflow d'approbation est désormais étendu : toute mise à jour qui touche l'ancrage ou l'étape voisine devra être examinée avec l'extension d'Alpha Air ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Comment se calcule la valeur effective d'un réglage à travers les couches ?
2. **Compréhension.** Pourquoi une surcharge est-elle un écart et non une copie ?
3. **Compréhension.** Quels niveaux de personnalisation un paquet peut-il déclarer pour un composant ?
4. **Pourquoi.** Pourquoi les composants critiques sont-ils verrouillés ?
5. **Raisonnement pratique.** Un point d'extension `v1` doit changer le format de sa sortie. Que fait l'éditeur ?

#### Réponses

1. On prend la valeur de la couche la plus spécifique qui la définit : utilisateur, puis tenant, puis paquet, selon la cascade.
2. Pour que le tenant qui n'a rien surchargé continue de suivre le produit : si les valeurs du paquet étaient copiées, les changements du paquet ne se propageraient plus et la mise à niveau ne pourrait plus distinguer les choix du tenant.
3. Verrouillé (rien), valeurs (propriétés nommées), extension (ajouts à des ancrages), remplacement (composant entier) ; et, à part, l'extension de code aux points d'extension.
4. Parce qu'ils portent la fonction centrale ou la sécurité du produit : les modifier rendrait le produit imprévisible à supporter et à mettre à jour.
5. Il publie une version `v2` du point d'extension, avec le nouveau format, et sert `v1` et `v2` en parallèle pendant une période de coexistence annoncée, avant de déprécier puis de retirer `v1` à une version majeure.

## 23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation

### 1. Comprendre simplement

La **mise à niveau d'un paquet** (*pack upgrade*) remplace la version installée chez un tenant par une version plus récente, en conservant ses personnalisations. La **fusion à trois voies de configuration** (*three-way merge of configuration*) combine, pour chaque propriété, trois états : la **base** (ce que la version installée avait livré), l'**état actuel** du tenant (base plus ses surcharges) et la **nouvelle version** du paquet. La **dérive de personnalisation** (*customization drift*) est l'écart cumulé entre la configuration d'un tenant et le standard du paquet.

**Pourquoi cela existe.** Comparer seulement l'état actuel et la nouvelle version ne dit pas qui a changé quoi. On écrase alors les personnalisations, ou l'on ignore les corrections du produit. La base permet d'attribuer chaque changement à son auteur, et de ne confier à une décision humaine que les vrais désaccords.

**Problème résolu.** Mettre à jour un produit chez des tenants qui l'ont adapté, sans perdre leurs choix et sans les priver des évolutions du produit.

**Modèle mental.** Deux personnes ont chacune une copie annotée d'un même texte d'origine. L'éditeur sort une nouvelle édition, le client a ses annotations. Pour les fusionner, on compare chacune à l'original : on voit ce que l'éditeur a changé et ce que le client a changé.

**Où l'analogie s'arrête.** Un texte se fusionne ligne à ligne. Une configuration est une structure typée avec des invariants : deux changements qui ne se recouvrent pas peuvent, ensemble, casser une règle. Après la fusion, une validation est indispensable.

**Exemple.** Alpha Air passe de `acme.mro-aviation` 2.3.1 à 2.4.0. Le délai de revue vaut 2 dans la base, 3 chez Alpha Air et 1 dans la nouvelle version : c'est un conflit. L'état « en attente de pièce » est ajouté par le paquet seul : il est repris. Le libellé « Non-conformité » est changé par le tenant seul : il est conservé.

**Les composants.**

1. la **base** : la version installée, telle que livrée ;
2. l'**état actuel** : base plus surcharges du tenant ;
3. la **nouvelle version** du paquet ;
4. la **règle de fusion** par propriété ;
5. la **politique de résolution** des conflits ;
6. la **validation** après fusion ;
7. le **rapport de fusion** ;
8. la **mesure de la dérive**.

**Objectif d'apprentissage :** vous pouvez dérouler une fusion à trois voies sur un exemple, choisir une politique de résolution des conflits et mesurer la dérive d'un tenant.

### 2. Connaissances essentielles

#### Définition

- **Mise à niveau de paquet** : opération qui fait passer un tenant d'une version installée du paquet à une autre, en appliquant la nouvelle version et en préservant les personnalisations compatibles.
- **Fusion à trois voies** : combinaison de deux modifications indépendantes d'une même base commune ; les modifications d'un seul côté se reprennent, celles des deux côtés qui diffèrent sont des conflits.
- **Dérive de personnalisation** : écart cumulé et durable entre la configuration d'un tenant et le standard du paquet, formé de surcharges, de remplacements et de retard de version.

#### Idées fondamentales

1. **La base est indispensable.** Sans elle, on ne sait pas qui a changé quoi. L'enregistrement d'installation la conserve ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)).
2. **Chaque changement a un auteur.** Le paquet, le tenant, ou les deux.
3. **Un seul auteur : pas de conflit.** Deux auteurs avec la même valeur : convergence. Deux auteurs avec des valeurs différentes : conflit.
4. **Un conflit suit une politique déclarée.** Le tenant gagne, le paquet gagne, ou une personne décide.
5. **La fusion est suivie d'une validation.** Pas de conflit ne veut pas dire configuration cohérente.
6. **La dérive se mesure.** Et se réduit : revue, remise au standard, remontée vers le produit.
7. **Une majeure est un événement.** Elle se prépare, se simule et s'échelonne ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)).

#### Vocabulaire essentiel

- **Base** (*base*) : version d'origine commune aux deux modifications.
- **État actuel** (*current*) : configuration du tenant au moment de la mise à niveau.
- **Nouvelle version** (*other*, *incoming*) : version du paquet que l'on installe.
- **Conflit** (*conflict*) : propriété modifiée des deux côtés avec des valeurs différentes.
- **Convergence** (*convergence*) : propriété modifiée des deux côtés avec la même valeur.
- **Politique de résolution** (*conflict policy*) : règle qui tranche un conflit.
- **Remise au standard** (*reset to standard*) : suppression d'une surcharge pour suivre à nouveau le produit.
- **Score de dérive** (*drift score*) : indicateur synthétique de l'écart d'un tenant au standard.
- **Mise à niveau échelonnée** (*staged upgrade*) : mise à niveau préparée à côté, activée plus tard.

#### Relations de cause à effet

- La mise à niveau remplace la configuration du tenant par celle du paquet. Les personnalisations disparaissent, et le tenant cesse de faire confiance aux mises à jour.
- La mise à niveau ignore les changements du paquet dès qu'une surcharge existe. Les corrections de sécurité n'arrivent plus, et les tenants se figent.
- La base est perdue. La plateforme ne sait plus distinguer et demande à une personne de comparer 300 propriétés à la main.
- La fusion n'est pas validée. Une étape supprimée par le tenant reste la cible d'une transition ajoutée par le paquet, et le workflow se bloque en production.
- La dérive n'est jamais mesurée. Après trois ans, chaque tenant est un cas particulier impossible à tester et à supporter.

#### Idées reçues

- **« Une mise à niveau écrase : c'est le prix de la standardisation. »** Non. Avec la base et les couches, elle préserve ce que le tenant a choisi.
- **« Sans personnalisation, pas de dérive. »** Non. Un tenant qui ne met jamais à jour dérive aussi : son retard de version s'accumule.
- **« Une fusion sans conflit est correcte. »** Non. L'absence de conflit textuel ne garantit pas la cohérence : il faut valider.

#### Principe clé

On fusionne à trois voies à partir de la version installée : ce que seul le paquet a changé suit le paquet, ce que seul le tenant a changé reste au tenant, et les désaccords suivent une politique déclarée, suivie d'une validation.

#### Si vous ne retenez que trois choses

1. La base, c'est la version installée telle que livrée : sans elle, pas de fusion à trois voies.
2. Chaque propriété se tranche selon qui l'a changée ; seuls les désaccords sont des conflits.
3. La dérive se mesure et se réduit ; elle ne se subit pas.

### 3. Explication technique détaillée

#### Les trois états

```text
                    Base (2.3.1, telle que livrée)
                     │                          │
        surcharges du tenant              changements du paquet
                     ▼                          ▼
        État actuel (base + tenant)        Nouvelle version (2.4.0)
                     └────────────┬─────────────┘
                                  ▼
                       Fusion à trois voies
                                  ▼
              Configuration résultante  +  conflits à résoudre
```

La documentation de la commande de fusion de fichiers de Git décrit la même opération : étant donné trois fichiers (courant, base et autre), elle incorpore au fichier courant tous les changements qui mènent de la base à l'autre ; si la base est l'original et que les deux autres en sont des modifications, elle combine les deux changements ; un conflit existe quand les deux ont changé un même segment de lignes ; la valeur de sortie du programme est le nombre de conflits, et zéro si la fusion est propre.

Le gestionnaire de paquets Helm illustre l'enjeu. Selon la documentation de ses changements depuis la version 2, la version 2 utilisait un correctif de fusion stratégique à deux voies, qui comparait l'ancien et le nouveau manifeste et ignorait l'état réel du cluster ; les modifications faites hors du paquet n'étaient pas prises en compte, et un retour arrière pouvait ne pas rétablir une ressource modifiée à la main. La version 3 utilise une fusion à trois voies, qui considère l'ancien manifeste, l'état réel et le nouveau manifeste. Une personnalisation de tenant est l'équivalent d'une modification faite hors du paquet.

#### La règle de fusion, propriété par propriété

| Base | Tenant (actuel) | Paquet (nouveau) | Résultat | Explication |
|---|---|---|---|---|
| a | a | a | a | Rien n'a changé |
| a | a | b | b | Seul le paquet a changé : le tenant suit le produit |
| a | c | a | c | Seul le tenant a changé : sa surcharge est conservée |
| a | c | c | c | Convergence : même valeur des deux côtés |
| a | c | b | Conflit | Les deux ont changé, différemment |
| a | supprimée | b | Conflit | Le tenant a retiré, le paquet a modifié |
| a | c | supprimée | Conflit | Le paquet a retiré, le tenant a modifié |
| absente | d | e | Conflit | Les deux ont ajouté la même clé avec des valeurs différentes |
| absente | absente | f | f | Ajout du paquet |

```typescript
type Props = Record<string, unknown>;

interface MergeResult {
  merged: Props;
  conflicts: string[];
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function merge3(base: Props, current: Props, other: Props): MergeResult {
  const merged: Props = {};
  const conflicts: string[] = [];
  const keys = new Set([...Object.keys(base), ...Object.keys(current), ...Object.keys(other)]);
  for (const key of keys) {
    const b = base[key];
    const c = current[key];
    const o = other[key];
    const currentChanged = !same(b, c);
    const otherChanged = !same(b, o);
    let chosen: unknown;
    if (!currentChanged && !otherChanged) {
      chosen = b;
    } else if (currentChanged && !otherChanged) {
      chosen = c;
    } else if (!currentChanged && otherChanged) {
      chosen = o;
    } else if (same(c, o)) {
      chosen = c;
    } else {
      conflicts.push(key);
      chosen = c;
    }
    if (chosen !== undefined) {
      merged[key] = chosen;
    }
  }
  return { merged, conflicts };
}
```

Avec la base `{ review_delay_days: 2, label: "Constat", critical_subject: "Constat critique", states: ["open", "closed"] }`, l'état actuel d'Alpha Air `{ review_delay_days: 3, label: "Non-conformité", ... }` et la version 2.4.0 `{ review_delay_days: 1, critical_subject: "Constat critique à traiter", states: ["open", "waiting_parts", "closed"], new_flag: true, ... }`, la fonction renvoie le délai 3 (conflit signalé, valeur du tenant gardée en attendant), le libellé « Non-conformité » (tenant seul), l'objet de notification nouveau et la liste d'états du paquet (paquet seul), et la nouvelle propriété `new_flag`. *Le code compare des propriétés plates ; un moteur réel applique la même règle récursivement et par clé d'élément de liste.*

#### La granularité de la fusion

| Type de contenu | Fusion | Remarque |
|---|---|---|
| Propriété scalaire | Par propriété, selon la table | Cas simple |
| Objet | Récursive, propriété par propriété | Un conflit par propriété |
| Liste d'éléments à clé stable | Par clé : ajout, retrait, modification | Exige des clés stables ([23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)) |
| Liste ordonnée sans clé (étapes) | Le composant entier : conflit s'il a changé des deux côtés | Évite des ordres incohérents |
| Composant remplacé par le tenant | Pas de fusion : le tenant garde le sien | Le composant est « gelé » |

Comme le montre la documentation des couches de Microsoft, la plupart des types de composants n'y sont pas fusionnés mais suivent la règle « le dessus gagne » : la fusion fine est coûteuse et ne se justifie que pour les types où elle apporte de la valeur.

#### La politique de résolution des conflits

| Politique | Quand l'utiliser | Exemple |
|---|---|---|
| Le tenant gagne | Propriétés d'organisation et de présentation | Délais, libellés, destinataires |
| Le paquet gagne | Correctif de sécurité ou d'intégrité | Seuil de conformité réglementaire, avec notification |
| Décision manuelle | Composants structurants | Workflow, rôle |
| Garder les deux | Deux ajouts distincts de même nature | Deux nouveaux états, de clés différentes |

La politique se déclare par composant dans le manifeste (`on_conflict`). Pour une décision manuelle, l'administrateur voit les trois valeurs et la raison, dans un langage métier ([12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

```json
{
  "tenant_id": "ten_airline_01",
  "pack_id": "acme.mro-aviation",
  "from": "2.3.1",
  "to": "2.4.0",
  "summary": { "unchanged": 212, "taken_from_pack": 9, "kept_from_tenant": 3, "converged": 0, "conflicts": 1 },
  "conflicts": [
    {
      "component": "acme.workflow.finding_approval",
      "property": "steps.review.delay_days",
      "base": 2,
      "tenant": 3,
      "pack": 1,
      "policy": "tenant_wins",
      "resolution": "kept_tenant_value",
      "needs_review": true
    }
  ]
}
```

#### Après la fusion : valider

Une fusion sans conflit peut produire une configuration incohérente : le tenant a retiré un état, le paquet a ajouté une transition vers cet état. La configuration fusionnée passe donc par les vérifications statiques de l'administration du comportement (boucles, étapes inatteignables, références invalides, [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement)) et par les invariants de la plateforme ([13.5 Invariants](13-concepts-transversaux.md#135-invariants)). En cas d'échec, la mise à niveau n'est pas appliquée et le rapport indique la cause. Les scénarios du paquet s'exécutent ensuite en bac à sable ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)).

#### Correctif, mise à niveau mineure, mise à niveau majeure

La documentation des solutions de Microsoft distingue les mises à jour (qui ne peuvent pas supprimer de composants), les mises à niveau (qui retirent les composants devenus inutiles, appliquent la logique de mise à niveau et cumulent les correctifs, avec la possibilité de les préparer avant de les appliquer) et les correctifs (qui ne portent que des changements et ne peuvent pas supprimer). Les couches de la mise à niveau préparée se composent au-dessus de la base ; l'application les aplatit en une nouvelle base. Pour un paquet de la plateforme :

| Type | Version | Peut supprimer des composants ? | Traitement |
|---|---|---|---|
| Correctif | x.y.**Z** | Non | Automatique possible, avec fusion |
| Mineure | x.**Y**.0 | Non (déprécie seulement) | Automatique avec fusion, notification du tenant |
| Majeure | **X**.0.0 | Oui | Planifiée, simulée ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)), échelonnée |

Après une mise à niveau réussie, la configuration fusionnée devient la **nouvelle base** : l'enregistrement d'installation reçoit la nouvelle version et ses valeurs d'origine, et la prochaine fusion partira de là.

#### La dérive de personnalisation

La dérive s'observe par des indicateurs simples, calculés par tenant :

| Indicateur | Ce qu'il dit |
|---|---|
| Nombre de surcharges | L'ampleur des écarts |
| Part des composants touchés | L'étendue de la personnalisation |
| Composants remplacés (gelés) | Ce qui ne reçoit plus les corrections |
| Versions de retard | Le temps passé hors du standard |
| Ancienneté de la plus vieille surcharge | Ce qui n'a pas été revu |

```sql
CREATE TABLE pack_override (
  tenant_id     uuid        NOT NULL,
  pack_id       text        NOT NULL,
  component_key text        NOT NULL,
  property      text        NOT NULL,
  new_value     jsonb       NOT NULL,
  set_by        uuid        NOT NULL,
  set_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, pack_id, component_key, property)
);

-- Dérive par tenant : les tenants les plus éloignés du standard
SELECT tenant_id,
       count(*)                       AS overrides,
       count(DISTINCT component_key)  AS components_touched,
       min(set_at)                    AS oldest_override
  FROM pack_override
 WHERE pack_id = $1
 GROUP BY tenant_id
 ORDER BY overrides DESC
 LIMIT 20;

-- Remontée vers le produit : les propriétés surchargées par le plus de tenants
SELECT component_key,
       property,
       count(DISTINCT tenant_id)                        AS tenants_overriding,
       mode() WITHIN GROUP (ORDER BY new_value::text)  AS most_common_value
  FROM pack_override
 WHERE pack_id = $1
 GROUP BY component_key, property
 ORDER BY tenants_overriding DESC
 LIMIT 20;
```

La seconde requête sert la boucle de retour : si 180 tenants sur 300 surchargent la même propriété avec la même valeur, la valeur du paquet est probablement mal choisie, ou un paramètre d'installation manque ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)). On corrige le produit au lieu de laisser chaque tenant compenser.

Quatre leviers réduisent la dérive : une **revue périodique** des surcharges avec l'administrateur du tenant, la **remise au standard** d'une surcharge avec aperçu de l'effet, la **promotion** d'un besoin répété en paramètre ou en valeur par défaut, et un **retard de version borné** (une majeure ne peut pas être sautée indéfiniment, voir [23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).

**Modes de défaillance.**

- **Remplacement à chaque mise à niveau.**
- **Gel** des tenants personnalisés hors du cycle de mise à jour.
- **Base perdue** ou non conservée.
- **Fusion sans validation.**
- **Politique de résolution absente** : les conflits restent en suspens.
- **Dérive jamais mesurée**, qui rend chaque tenant unique.

**Contre-exemple.** Une plateforme applique « le paquet remplace tout » à chaque mise à niveau. Le workflow d'approbation modifié par Alpha Air est écrasé pendant la nuit. Le matin, les constats critiques n'attendent plus l'approbation de la direction. Il faut une semaine pour reconstituer la configuration à partir d'une capture, et le client refuse désormais toute mise à jour automatique.

**Limites.** La fusion détecte les conflits de propriétés, pas les conflits de sens : un tenant peut avoir adapté un libellé à un usage que la nouvelle version rend faux. La politique « le tenant gagne » préserve les choix mais retarde les corrections ; la politique « le paquet gagne » corrige mais peut défaire un choix légitime. Aucune politique ne remplace la visibilité donnée à l'administrateur ([12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence) | L'instantané et la différence fournissent la comparaison ; la fusion à trois voies y est décrite |
| [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant) | La personnalisation doit survivre aux mises à jour |
| [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste) | La fusion à trois voies traite aussi les modifications concurrentes |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | Les vérifications statiques valident la configuration fusionnée |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants bornent ce que la fusion peut produire |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | Les conflits s'expliquent à l'administrateur |
| [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Les migrations de données de la mise à niveau suivent les règles de compatibilité |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | La dérive d'environnement est une notion voisine, involontaire |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les couches séparent ce que la fusion doit réconcilier |
| [23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière) | La simulation et le retour arrière encadrent la mise à niveau |

### 5. Application pratique

**Situation initiale.** Alpha Air est sur `acme.mro-aviation` 2.3.1 avec trois écarts : un délai de revue de 3 jours, le libellé « Non-conformité » et l'étape d'approbation de la direction. L'éditeur publie la version 2.4.0.

**Problème.** Appliquer la nouvelle version sans perdre ces trois choix et sans passer à côté des corrections.

**Application du concept.** La plateforme fusionne à trois voies à partir de la version 2.3.1 enregistrée à l'installation.

**Déroulé.**

1. La plateforme lit la base : le contenu de 2.3.1 tel qu'installé, d'après l'enregistrement d'installation.
2. Elle calcule les changements du paquet (2.3.1 vers 2.4.0) et ceux du tenant (2.3.1 vers l'état actuel).
3. Elle fusionne : 212 propriétés inchangées, 9 reprises du paquet (dont le nouvel état « en attente de pièce »), 3 conservées du tenant, 1 conflit sur le délai de revue (2, 3, 1).
4. La politique du composant est « le tenant gagne » : la valeur 3 est gardée, et le conflit est présenté à Sophie avec les trois valeurs et l'explication.
5. La validation vérifie que l'étape ajoutée par Alpha Air reste atteignable et que l'état nouveau n'a pas de transition orpheline.
6. Après acceptation, la configuration fusionnée devient la base de la version 2.4.0.

**Résultat.** Alpha Air garde ses trois choix, reçoit les neuf évolutions du produit et décide en connaissance de cause sur un seul point.

**Limites.** Le délai de revue d'Alpha Air reste différent du standard : son score de dérive est inchangé, et la revue trimestrielle examinera si la surcharge est toujours justifiée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la fusion à trois voies a-t-elle besoin d'une base ?
2. **Compréhension.** Que devient une propriété modifiée seulement par le paquet ? et seulement par le tenant ?
3. **Compréhension.** Citez trois politiques de résolution d'un conflit.
4. **Pourquoi.** Pourquoi faut-il valider la configuration après une fusion sans conflit ?
5. **Raisonnement pratique.** Pour une propriété, la base vaut 10, le tenant 12 et le nouveau paquet 15. Quel est le résultat, et que faut-il faire ?

#### Réponses

1. Parce que sans la version d'origine on ne peut pas dire qui a changé quoi : on ne distingue ni la surcharge du tenant d'une correction du paquet, ni un accord d'un désaccord.
2. La propriété modifiée seulement par le paquet suit le paquet : le tenant suit le produit. Celle modifiée seulement par le tenant reste à la valeur du tenant.
3. Le tenant gagne, le paquet gagne, décision manuelle, garder les deux.
4. Parce que deux changements qui ne se recouvrent pas peuvent, ensemble, violer une règle ou un invariant : par exemple une transition ajoutée vers un état que le tenant a retiré.
5. C'est un conflit : le tenant et le paquet ont changé la même propriété, différemment. La politique déclarée du composant tranche (par exemple le tenant gagne et garde 12), et l'écart est signalé à l'administrateur avec les trois valeurs.

## 23.5 Mise à niveau à blanc, désinstallation et retour arrière

### 1. Comprendre simplement

Une **mise à niveau à blanc** (*dry-run upgrade*) exécute tout le calcul d'une mise à niveau, c'est-à-dire la résolution, la fusion, la validation et l'estimation, sans rien appliquer, et rend un **plan** : ce qui sera ajouté, modifié ou retiré, les conflits, les résultats de validation et les effets attendus. La **désinstallation** (*uninstall*) retire un paquet d'un tenant, avec ce qu'elle emporte et ce qu'elle laisse. Le **retour arrière** (*rollback*) ramène un tenant à la version précédente quand une mise à niveau tourne mal.

**Pourquoi cela existe.** Une mise à niveau change le comportement d'un tenant en production. On veut voir avant d'agir, pouvoir interrompre en cours de route et pouvoir revenir. Une désinstallation peut détruire des données : on veut en connaître l'effet avant de la lancer.

**Problème résolu.** Rendre la mise à niveau et la désinstallation sûres et, autant que possible, réversibles, et dire explicitement ce qui ne l'est pas.

**Modèle mental.** Une répétition générale avant la représentation, un plan de démontage qui liste ce qui partira à la benne, et un ressort de secours si le décor s'effondre.

**Où l'analogie s'arrête.** Une répétition ne produit aucun effet réel. Certains effets d'une mise à niveau, comme des notifications envoyées, des données migrées ou des appels à des systèmes externes, ne se défont pas : le plan est donc calculé sans effet de bord, et le retour arrière a des limites déclarées.

**Exemple.** Avant de passer Alpha Air en 2.4.0, Sophie lance la mise à niveau à blanc. Le plan indique : 9 composants repris, 3 surcharges conservées, 1 conflit à arbitrer, aucune erreur de validation, une migration de 18 430 constats pour ajouter un champ avec valeur par défaut (environ 6 minutes), aucune étape irréversible. Elle valide, et la plateforme applique le plan.

**Les composants.**

1. le **plan**, calculé sans effet ;
2. l'**exécution** par le même moteur que l'application réelle ;
3. la **validation** et la **simulation** ;
4. la **mise à niveau échelonnée** ;
5. des **étapes reprenables** ;
6. le **point de non-retour** ;
7. la **désinstallation** avec analyse d'impact ;
8. le **retour arrière** et la vérification après coup.

**Objectif d'apprentissage :** vous pouvez décrire ce que contient un plan de mise à niveau, expliquer la désinstallation en deux temps et dire ce qu'un retour arrière ramène et ne ramène pas.

### 2. Connaissances essentielles

#### Définition

- **Mise à niveau à blanc** : exécution complète du calcul d'une mise à niveau, sans effet persistant ni effet de bord, qui produit un plan.
- **Désinstallation** : retrait d'un paquet d'un tenant : ses composants, ses données d'amorçage non référencées et ses liens, après contrôle des dépendances.
- **Retour arrière** : rétablissement de la configuration, et si possible des données migrées, d'une version précédente.

#### Idées fondamentales

1. **Le plan vient du même moteur que l'exécution.** Un autre chemin de code ne prédirait rien.
2. **Le plan n'a aucun effet de bord.** Ni notification, ni appel externe, ni événement.
3. **Le plan est lié à un état.** Il porte l'empreinte de la base et des surcharges ; l'application refuse un plan périmé.
4. **La mise à niveau procède par étapes vérifiables et reprenables.**
5. **Chaque transition déclare si elle est réversible.** Le plan montre le point de non-retour.
6. **La désinstallation commence par une analyse d'impact.** Elle se fait en deux temps : désactiver, puis purger.
7. **Le retour arrière a des limites.** Effets externes, données créées sous la nouvelle version.

#### Vocabulaire essentiel

- **Plan** (*plan*) : description calculée des changements qu'une opération produirait.
- **Effet de bord** (*side effect*) : effet persistant ou externe d'une opération : écriture, notification, appel.
- **Point de non-retour** (*point of no return*) : étape après laquelle le retour arrière n'est plus possible.
- **Désactivation** (*deactivation*) : arrêt de l'usage d'un paquet sans suppression de ses données.
- **Purge** (*purge*) : suppression définitive après désactivation.
- **Orphelin** (*orphan*) : enregistrement dont la définition a disparu.
- **Test de fumée** (*smoke test*) : vérification rapide, après opération, que les parcours essentiels fonctionnent.
- **Désinstallation et retour arrière** (*uninstall and rollback*) : les deux opérations qui défont une installation ou une mise à niveau.
- **Fenêtre de maintenance** (*maintenance window*) : période convenue pour appliquer un changement ([24.6 Page d'état, communication d'incident et fenêtre de maintenance](24-cycle-vie-client-support.md#246-page-détat-communication-dincident-et-fenêtre-de-maintenance)).

#### Relations de cause à effet

- Aucune mise à niveau à blanc. On découvre les conflits et les erreurs en production, pendant le changement.
- Le plan emprunte un autre chemin de code que l'application. Le plan annonce une chose, l'exécution en fait une autre.
- Le plan produit des effets de bord. Les notifications partent deux fois, une fois pour le plan et une fois pour l'application.
- La désinstallation ne regarde pas les dépendances. Elle supprime les définitions de types dont les enregistrements existent encore.
- Le retour arrière est supposé toujours possible. Après une migration destructive, il ne l'est plus, et il faut restaurer une sauvegarde.

#### Idées reçues

- **« Le retour arrière annule tout. »** Non. Il rétablit la configuration et, selon les étapes, les données. Il ne reprend pas ce qui est sorti du système.
- **« Désinstaller, c'est supprimer la configuration. »** Non. Le tenant a créé des données et des composants qui en dépendent.
- **« Un plan à blanc garantit le succès. »** Non. Il ne prévoit ni la charge, ni les réponses des systèmes externes, ni les changements du tenant entre le plan et l'application.

#### Principe clé

On calcule d'abord un plan sans effet ; on l'applique par étapes reprenables en connaissant les points de non-retour ; on vérifie après coup et l'on sait revenir. La désinstallation suit la même discipline.

#### Si vous ne retenez que trois choses

1. Le plan à blanc est calculé par le même moteur que l'application, sans aucun effet de bord.
2. Une mise à niveau se découpe en étapes reprenables, avec des points de non-retour annoncés.
3. Une désinstallation se prépare par une analyse d'impact et se fait en deux temps ; un retour arrière a des limites.

### 3. Explication technique détaillée

#### Le plan d'une mise à niveau

Deux outils d'infrastructure donnent le modèle. La documentation de l'API de Kubernetes décrit le mode d'essai à blanc comme l'évaluation d'une requête à travers les étapes habituelles (chaîne d'admission, validation, conflits de fusion) jusqu'à la persistance, qui n'a pas lieu ; elle garantit que de telles requêtes ne sont pas persistées et n'ont aucun autre effet de bord. Si la version réelle de la requête déclenchait un contrôleur d'admission à effet de bord, la requête échoue plutôt que de risquer un effet indésirable ; les valeurs générées (identifiants, horodatages) ne doivent pas être prises pour acquises ; et l'autorisation est identique à celle de la requête réelle. La commande de mise à niveau de Helm propose de même un mode d'essai qui simule l'opération sans enregistrer de changement, et prévient que sa sortie contient les secrets, d'où une option pour les masquer.

| Règle | Pourquoi |
|---|---|
| Même chemin de code que l'application, jusqu'à l'écriture | Le plan doit prédire l'exécution |
| Aucun effet persistant ni externe | Un plan ne doit rien changer |
| Échec plutôt que risque | Si une étape a un effet de bord non maîtrisable, le plan échoue |
| Ne pas se fier aux valeurs générées | Les identifiants et horodatages diffèrent à l'exécution |
| Mêmes droits que l'application | Le plan révèle autant que l'action |
| Masquer les secrets | Le plan peut contenir des valeurs sensibles |

```json
{
  "plan_id": "plan_9f21",
  "tenant_id": "ten_airline_01",
  "pack_id": "acme.mro-aviation",
  "from": "2.3.1",
  "to": "2.4.0",
  "state_digest": "sha256:24594fc3b40262003dd7f0205050bf1c8bb3a869765206611cb33dde484fb48b",
  "changes": {
    "components_added": 4,
    "components_modified": 5,
    "components_removed": 0,
    "overrides_kept": 3,
    "conflicts": 1
  },
  "validation": {
    "static_checks": "passed",
    "invariants": "passed",
    "warnings": ["étape « direction » : aucune personne affectée au rôle directeur_technique à la base TLS"]
  },
  "data_migration": {
    "steps": [
      { "id": "add_field_inspection_authority", "records": 18430, "estimated_minutes": 6, "reversible": true }
    ]
  },
  "irreversible_steps": [],
  "decisions_required": [
    { "type": "conflict", "component": "acme.workflow.finding_approval", "property": "steps.review.delay_days" }
  ],
  "side_effects_during_apply": { "notifications": 0, "webhooks": 0 }
}
```

Le champ `state_digest` est une empreinte de l'état sur lequel le plan a été calculé : version installée, surcharges, paramètres. L'ordre « appliquer `plan_9f21` » est refusé si l'état a changé entre-temps, par exemple si un administrateur a modifié une surcharge ; il faut recalculer. C'est le même principe que le contrôle optimiste de concurrence ([3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)).

Le plan reprend la simulation d'historique de l'administration du comportement ([8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement)) : pour les règles et workflows modifiés, la plateforme peut rejouer les événements des 30 derniers jours avec la nouvelle version et indiquer ce qui aurait changé.

#### Étapes, reprise et mise à niveau échelonnée

```text
planifiée ─► préparée (échelonnée) ─► en application ─► en vérification ─► validée
                  │                        │                   │
                  └─► abandonnée           └─► échouée ────────┴─► retour arrière ─► restaurée
```

| Phase | Contenu | Réversible ? |
|---|---|---|
| Préparée | La nouvelle version est calculée et posée à côté de la base, sans effet | Oui, on abandonne |
| En application | Composants de configuration appliqués dans une transaction | Oui, tout ou rien |
| Migration de données | Étapes idempotentes et reprenables, par lots | Selon l'étape |
| En vérification | Parcours de fumée du paquet et du tenant ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)) | Retour arrière automatique possible |
| Validée | La configuration fusionnée devient la nouvelle base ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) | Retour arrière jusqu'à l'expiration de l'instantané |

La **mise à niveau échelonnée** s'inspire des solutions de Microsoft : une mise à niveau peut être importée en attente, au-dessus de la base, pour effectuer des actions supplémentaires avant de l'appliquer ; l'application aplatit les couches en une nouvelle base. Pour les paquets : essai sur le bac à sable du tenant, puis sur un groupe pilote, puis sur tous, en suivant le déploiement progressif du module 21 ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)).

Les migrations de données reprennent les règles de l'outil de migration de bases déjà cité en [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) : chaque script s'exécute dans une transaction par défaut, un échec marque la migration comme échouée et l'annule si possible, et la commande est idempotente, donc rejouable. Helm expose des options de même nature : attendre que les ressources soient prêtes, revenir à la version précédente en cas d'échec, supprimer les ressources créées par une mise à niveau échouée, limiter le nombre de révisions conservées.

#### La désinstallation

La documentation des solutions de Microsoft décrit les effets : la suppression d'une solution gérée retire toutes les personnalisations et extensions qu'elle contient ; les données stockées dans les tables et colonnes personnalisées de la solution sont perdues ; une solution de base ne peut pas être désinstallée tant qu'une solution qui en dépend est installée ; et modifier un composant géré crée une dépendance entre la personnalisation et la solution, qui bloque la désinstallation tant qu'elle n'est pas retirée.

| Élément | Désinstallation | Remarque |
|---|---|---|
| Composants du paquet | Désactivés, puis retirés | Deux temps |
| Données d'amorçage non référencées | Retirées | |
| Données d'amorçage référencées | Conservées, marquées retirées | Les enregistrements les citent |
| Instances des types du paquet | À décider : export puis suppression, ou conservation en lecture seule | Jamais supprimées sans décision explicite |
| Surcharges du tenant sur les composants | Archivées avec le composant | Sinon elles réapparaîtraient à la réinstallation |
| Composants du tenant qui dépendent du paquet | Bloquent la désinstallation | À retirer ou à détacher d'abord |
| Autres paquets qui dépendent de lui | Bloquent la désinstallation | Message explicite |

**Deux temps.** La désactivation arrête l'usage : workflows stoppés, composants masqués, intégrations suspendues. Les données restent intactes, pendant une période de rétention convenue, par exemple 30 jours, et l'opération est réversible. La purge supprime ensuite, après export et confirmation explicite : elle est irréversible. L'interface montre l'analyse d'impact avant chaque temps : nombre d'enregistrements concernés, composants qui en dépendent, données exportables ([12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)). La restitution des données du tenant relève de la sortie du client ([24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)).

#### Le retour arrière

Que ramène un retour arrière ?

| Élément | Ramené ? | Condition |
|---|---|---|
| Configuration (composants, surcharges) | Oui | Instantané de la configuration effective conservé ([9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence), [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)) |
| Schéma de données | Oui, si les migrations suivent « étendre puis contracter » | Étapes de contraction non encore exécutées ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) |
| Données migrées | Selon l'étape | Étapes marquées réversibles |
| Données créées sous la nouvelle version | Peut-être | Seulement si elles tiennent dans l'ancienne structure |
| Notifications et événements émis | Non | Sortis du système |
| État des systèmes externes | Non | Hors de portée |

Chaque transition de version déclare dans le plan si elle est **réversible** ou **avant seulement**. Une étape irréversible (suppression de données après copie, contraction de schéma) impose un point de restauration juste avant elle ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)) et une confirmation explicite. Tant qu'aucune donnée ne dépend de la nouvelle version, le retour arrière est possible ; passé ce seuil, la décision est de **corriger en avant** ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)).

La documentation de Helm donne deux enseignements. Depuis la version 3, un retour arrière utilise la fusion à trois voies : elle considère l'ancien manifeste, l'état réel et le nouveau manifeste, ce qui permet par exemple de rétablir un déploiement que quelqu'un avait mis à zéro à la main. Et les définitions de ressources personnalisées, qui portent le schéma de données, ne sont jamais réinstallées, ni installées lors d'une mise à niveau ou d'un retour arrière, ni supprimées : il faut les traiter à part, avec soin. De même, ce qui porte le schéma des données d'un tenant suit des migrations et non le retour arrière automatique.

**Modes de défaillance.**

- **Plan calculé par un autre code** que l'application.
- **Plan à effets de bord.**
- **Plan périmé appliqué** sans contrôle d'état.
- **Étape irréversible non annoncée.**
- **Désinstallation sans analyse d'impact.**
- **Retour arrière jamais exercé**, donc inutilisable le jour venu.

**Contre-exemple.** Une plateforme propose le bouton « Désinstaller » sans analyse. Un administrateur retire le paquet de gestion des formations pour le réinstaller dans une version plus récente. La désinstallation supprime les types et, avec eux, les 26 000 enregistrements de stages. La réinstallation recrée des types vides. Il faut restaurer une sauvegarde de la veille et ressaisir une journée de données.

**Limites.** Le plan prédit la configuration, pas la charge : une migration estimée à 6 minutes en prend 40 sur un tenant très chargé ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)). Les effets externes échappent au retour arrière. Et un retour arrière n'est jamais gratuit : il faut une copie de l'état précédent, qui coûte du stockage et du temps de rétention.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | L'essai à blanc et la simulation s'étendent du comportement à la mise à niveau |
| [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) | Le retour arrière de la configuration repose sur le versionnement |
| [9.4 Instantané et différence](09-audit-versionnement-gouvernance.md#94-instantané-et-différence) | L'instantané de la configuration effective permet de revenir |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Un point de restauration précède les étapes irréversibles |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | La conscience de l'impact présente le plan à l'administrateur |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | La mise à niveau échelonnée suit le déploiement progressif |
| [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Retour arrière ou correction en avant, et migrations compatibles |
| [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation) | La fusion produit la configuration que le plan présente |
| [23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario) | Les scénarios servent de test de fumée après mise à niveau |
| [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression) | La désinstallation prépare la sortie et la restitution des données |

### 5. Application pratique

**Situation initiale.** L'éditeur publie `acme.mro-aviation` 2.4.0. Alpha Air (`ten_airline_01`), avec trois écarts à son standard, et Beta Régional (`ten_airline_02`), avec une extension de code propre, doivent passer à cette version.

**Problème.** Mettre à niveau deux tenants différemment personnalisés, sans interruption de service et avec la possibilité de revenir.

**Application du concept.** Plan à blanc, mise à niveau échelonnée, vérification et retour arrière automatique.

**Déroulé.**

1. Sophie lance la mise à niveau à blanc pour Alpha Air : 1 conflit, 1 avertissement (aucun directeur technique affecté à la base TLS), 0 erreur, 18 430 enregistrements à migrer en 6 minutes, aucune étape irréversible.
2. Léa affecte un directeur technique à TLS ; Sophie arbitre le conflit en gardant le délai de 3 jours.
3. La mise à niveau est appliquée d'abord au bac à sable du tenant, puis, dans la fenêtre de maintenance du dimanche à 02 h, à la production. Les parcours de fumée passent : la version est validée.
4. Pour Beta Régional, le plan est propre, mais le parcours de fumée échoue après application : l'extension de code du tenant lit un champ interne que la version 2.4.0 a déplacé.
5. La plateforme déclenche le retour arrière automatique : configuration restaurée, migration de données annulée (étape réversible). L'opération prend 4 minutes.
6. L'éditeur contacte Beta Régional : l'extension doit utiliser le point d'extension stable ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) au lieu du champ interne.

**Résultat.** Alpha Air est à jour, sans perte de personnalisation. Beta Régional est restauré à la version précédente, sans interruption notable, et sait quoi corriger.

**Limites.** Un événement de notification émis pendant la courte application chez Beta Régional ne peut pas être rappelé ; le plan l'annonçait comme effet attendu, avec 3 notifications.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient le plan d'une mise à niveau à blanc ?
2. **Compréhension.** Pourquoi le plan doit-il être calculé par le même moteur que l'application ?
3. **Compréhension.** Pourquoi désinstalle-t-on un paquet en deux temps ?
4. **Pourquoi.** Pourquoi un plan porte-t-il une empreinte de l'état du tenant ?
5. **Raisonnement pratique.** Une mise à niveau comporte une étape qui supprime une colonne après en avoir copié les données. Peut-on revenir en arrière après son exécution ? Que prévoir ?

#### Réponses

1. Les changements par composant (ajouts, modifications, retraits), les surcharges conservées, les conflits, les résultats de validation, les migrations de données avec leur estimation et leur caractère réversible, les étapes irréversibles, les décisions requises et les effets de bord attendus.
2. Pour qu'il prédise l'exécution : un autre chemin de code pourrait annoncer ce que l'application ne ferait pas.
3. Pour pouvoir revenir en arrière tant que les données sont intactes : la désactivation arrête l'usage sans rien supprimer, pendant une période de rétention ; la purge, irréversible, n'intervient qu'après export et confirmation.
4. Pour détecter que l'état a changé entre le plan et l'application, par exemple une surcharge modifiée entre-temps : le plan calculé ne correspond plus, et il doit être recalculé.
5. Non, pas simplement : la suppression de la colonne est une étape irréversible. Il faut la déclarer comme telle dans le plan, imposer un point de restauration juste avant elle et une confirmation explicite, ou la repousser à une version ultérieure (étendre, puis contracter une fois la nouvelle version éprouvée).

## 23.6 Distribution et signature des paquets

### 1. Comprendre simplement

La **distribution de paquets** (*pack distribution*) est l'acheminement d'un paquet depuis son éditeur jusqu'aux tenants qui l'installent : catalogue, canaux de publication, copies régionales, filtrage par compatibilité, politique de mise à jour. La **signature de paquets** (*pack signing*) permet à celui qui reçoit un paquet de vérifier qui l'a publié et qu'il n'a pas été modifié depuis.

**Pourquoi cela existe.** Un paquet installé a le pouvoir de changer le comportement de la plateforme chez un tenant. Entre l'éditeur et le tenant, il passe par un catalogue, des copies, des caches : n'importe lequel de ces maillons pourrait le remplacer. Et sans politique de distribution, un défaut se répandrait chez tous les tenants en même temps.

**Problème résolu.** Livrer un paquet dont l'origine et l'intégrité se vérifient, au rythme que chaque tenant a choisi.

**Modèle mental.** Un colis avec le sceau de l'expéditeur, un numéro de lot et un bordereau. Le transporteur peut changer. Le destinataire contrôle le sceau et le bordereau avant d'ouvrir.

**Où l'analogie s'arrête.** Un sceau protège un colis. Une signature numérique lie un contenu à une identité, mais ne dit rien de la qualité ni de l'intention : un paquet signé peut être défectueux, ou malveillant s'il vient d'un éditeur compromis ou malhonnête.

**Exemple.** `acme.mro-aviation` 2.4.0 est construit, testé, signé, puis publié sur le canal « stable » avec son empreinte. Quand Alpha Air l'installe, la plateforme vérifie l'empreinte, la signature, l'identité de l'éditeur et le fait que la version est plus récente que celle installée.

**Les composants.**

1. le **registre** ou catalogue ;
2. les **canaux** de publication ;
3. l'**empreinte** du contenu ;
4. la **signature** et l'identité du signataire ;
5. les **attestations** de provenance ;
6. la **politique de confiance** ;
7. la **vérification** à l'installation ;
8. la **révocation** et la **politique de mise à jour** du tenant.

**Objectif d'apprentissage :** vous pouvez décrire le chemin d'un paquet de l'éditeur au tenant, ce que prouve une signature et ce qu'elle ne prouve pas, et les contrôles que la plateforme applique avant d'installer.

### 2. Connaissances essentielles

#### Définition

- **Distribution de paquets** : ensemble des mécanismes qui publient, répliquent, exposent et délivrent les paquets aux tenants, selon des canaux et des politiques de mise à jour.
- **Signature de paquet** : preuve cryptographique, attachée à l'empreinte d'un paquet, de l'identité de son signataire et de l'intégrité du contenu.

#### Idées fondamentales

1. **On signe une empreinte.** Le contenu est un artefact immuable ([21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable)) : sa signature a un sens.
2. **On vérifie à chaque maillon, et surtout à l'installation.** La plateforme est l'autorité de vérification, pas le catalogue.
3. **Une signature prouve l'origine et l'intégrité.** Elle ne prouve ni la qualité, ni l'innocuité.
4. **La confiance est une politique.** Quels éditeurs, quels canaux, quelles garanties minimales.
5. **La fraîcheur compte.** Refuser une version plus ancienne que l'installée ; refuser des métadonnées périmées.
6. **La révocation existe.** On sait retirer une version ou une identité.
7. **La distribution est progressive.** Par canaux et par anneaux, pas pour tous à la fois.

#### Vocabulaire essentiel

- **Registre** (*registry*) : service qui stocke et sert les paquets.
- **Canal** (*channel*) : flux de publication : stable, accès anticipé, privé.
- **Empreinte** (*digest*) : valeur calculée à partir du contenu, qui change si le contenu change.
- **Attestation** (*attestation*) : déclaration signée sur un artefact, par exemple sa provenance.
- **Provenance** (*provenance*) : description de l'origine et de la chaîne de construction d'un artefact ([21.9 Tests de sécurité dans le pipeline](21-livraison-qualite-logicielle.md#219-tests-de-sécurité-dans-le-pipeline)).
- **Journal de transparence** (*transparency log*) : registre public, en ajout seul, des événements de signature.
- **Révocation** (*revocation*) : retrait de confiance envers une version, une clé ou une identité.
- **Attaque par retour de version** (*rollback attack*) : faire installer une version plus ancienne et vulnérable.
- **Attaque par gel** (*freeze attack*) : empêcher de voir qu'une mise à jour existe.

#### Relations de cause à effet

- Le paquet est servi sans vérification. Un maillon compromis, par exemple un miroir, remplace le contenu.
- Une clé de signature durable est partagée dans l'équipe. Sa compromission permet de signer n'importe quoi, longtemps.
- La version n'est pas comparée à la version installée. Une ancienne version vulnérable est réinstallée.
- Aucune révocation n'existe. Un paquet défectueux reste installable.
- Tous les tenants reçoivent la nouvelle version en même temps. Un défaut touche tout le parc.

#### Idées reçues

- **« Signé veut dire sûr. »** Non. La signature atteste l'origine et l'intégrité. Elle ne dit rien de la qualité.
- **« L'empreinte suffit à garantir l'origine. »** Non. Elle prouve que le contenu correspond à un descripteur ; si le descripteur vient d'une source non fiable, aucune garantie d'origine n'existe.
- **« Un miroir régional est neutre. »** Non. Il doit être vérifié comme n'importe quel maillon : on ne lui fait pas confiance, on contrôle ce qu'il sert.

#### Principe clé

On publie un contenu immuable, on signe son empreinte, on vérifie origine, intégrité et fraîcheur au moment d'installer selon une politique de confiance, et l'on sait révoquer et distribuer progressivement.

#### Si vous ne retenez que trois choses

1. La signature porte sur l'empreinte d'un contenu immuable et se vérifie à l'installation.
2. Elle prouve l'origine et l'intégrité, pas la qualité ; il faut des tests et un examen en plus.
3. La politique de confiance, la fraîcheur, la révocation et les canaux complètent la signature.

### 3. Explication technique détaillée

#### De l'éditeur au tenant

```text
Éditeur  : construire ─► tester (conformité, scénarios) ─► signer l'empreinte ─► publier (registre, canal)
                                                                                      │
Plateforme : répliquer (miroirs régionaux) ─► vérifier à la réception ─► exposer dans le catalogue
                                                                                      │
Tenant   : voir la mise à jour ─► plan à blanc ─► installer : vérifier empreinte, signature, éditeur, version
```

#### Registre, canaux et adressage par empreinte

La documentation de Helm recommande de stocker et de partager les paquets de graphiques dans des registres de conteneurs compatibles avec la norme OCI ; la version sémantique du paquet fournit l'étiquette ; on peut installer un paquet par son empreinte, ce qui, selon cette documentation, est plus sûr qu'une étiquette parce que les empreintes sont immuables ; et un fichier de provenance placé à côté du paquet est publié avec lui. Les paquets de la plateforme s'adressent de même de deux façons : par **version** (lisible) et par **empreinte** (vérifiable).

| Canal | Contenu | Pour qui |
|---|---|---|
| Stable | Versions finales | Tous les tenants |
| Accès anticipé | Pré-versions, par exemple `2.5.0-rc.1` ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)) | Tenants volontaires, bacs à sable |
| Privé | Paquets destinés à un tenant ou à un partenaire | Un ou quelques tenants |

La **politique de mise à jour** du tenant fixe ce qui s'installe seul : par exemple les correctifs automatiquement, les mineures dans la fenêtre de maintenance, les majeures sur décision ([24.6 Page d'état, communication d'incident et fenêtre de maintenance](24-cycle-vie-client-support.md#246-page-détat-communication-dincident-et-fenêtre-de-maintenance)). Les copies régionales (miroirs) rapprochent le paquet des tenants et respectent la résidence des données de la plateforme ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)) ; le paquet lui-même ne contient aucune donnée de tenant ([23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)).

```json
{
  "pack_id": "acme.mro-aviation",
  "version": "2.4.0",
  "channel": "stable",
  "digest": "sha256:00942e50396e934b25539e3f5029035894e327e5c225a6f1c87ff1129949aec6",
  "size_bytes": 482113,
  "publisher": "acme",
  "published_at": "2026-10-12T08:00:00Z",
  "platform": { "min_engine_version": "7.2.0" },
  "signatures": [
    {
      "type": "keyless",
      "identity": "https://ci.acme-aero.example/workflows/release.yml@refs/tags/v2.4.0",
      "issuer": "https://oidc.acme-aero.example",
      "log_entry": "transparency-log:84213377"
    }
  ],
  "attestations": [
    { "type": "provenance", "builder": "ci.acme-aero.example", "source_commit": "9d3c1f2" }
  ],
  "supersedes": ["2.3.1"]
}
```

#### Signer : clés durables ou identité

| Approche | Principe | Atout | Limite |
|---|---|---|---|
| Clé durable | L'éditeur signe avec une paire de clés qu'il conserve | Simple | Protéger, faire tourner et révoquer la clé ; distribuer la clé publique |
| Identité et clé éphémère | Un certificat de courte durée lie une clé à l'identité du signataire | Pas de clé à conserver | Dépend d'un service d'identité et d'un journal |

Sigstore illustre la seconde approche. Selon sa documentation, le client de signature crée une paire de clés et demande un certificat pour la clé publique ; l'autorité de certification vérifie un jeton d'identité et délivre un certificat de courte durée lié à cette identité et à cette clé ; l'empreinte, la signature et le certificat sont consignés dans un journal en ajout seul ; la clé privée est écartée après une seule signature. La vérification contrôle la signature avec la clé publique du certificat, que l'identité du certificat correspond à l'identité attendue, que le certificat remonte à la racine de confiance, et la preuve d'inscription dans le journal. L'identité d'un jeton peut être une adresse de courriel, un compte de service, ou, en intégration continue, une information sur le flux de travail : on passe d'une signature par clé à une signature par identité.

Le projet TUF, qui sécurise les systèmes de mise à jour, décrit les menaces que la fraîcheur doit couvrir : un attaquant qui continue de servir le même fichier pour que vous ne voyiez pas qu'une mise à jour existe, un attaquant qui sert une version plus ancienne et vulnérable comme si elle était récente, et un attaquant qui compromet la clé de signature. Ses métadonnées portent les clés de confiance, les empreintes de fichiers, les signatures, les numéros de version des métadonnées et une **date d'expiration**. L'idée se transpose : l'index des paquets du catalogue a une durée de validité courte, et la plateforme refuse un index périmé.

**La provenance.** Une attestation de provenance dit où et comment le paquet a été construit (dépôt, commit, système de construction) : elle prolonge les pratiques du module 21 ([21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable), [21.9 Tests de sécurité dans le pipeline](21-livraison-qualite-logicielle.md#219-tests-de-sécurité-dans-le-pipeline)) et permet de refuser un paquet qui ne sort pas d'une chaîne reconnue.

#### La politique de confiance

```json
{
  "trust_policy": {
    "tenant_id": "ten_airline_01",
    "allowed_publishers": ["acme"],
    "allowed_channels": ["stable"],
    "require_signature": true,
    "require_provenance": true,
    "allow_downgrade": false,
    "max_index_age_hours": 48,
    "update_policy": { "patch": "auto", "minor": "auto_in_window", "major": "manual" }
  }
}
```

À l'installation, la plateforme applique la politique et contrôle au minimum trois choses : le contenu correspond à l'empreinte du descripteur, l'éditeur est autorisé, et la version est supérieure à celle installée (sauf retour arrière explicite). La vérification de la signature elle-même est confiée à un client de signature (Sigstore, TUF ou équivalent) ; le code ci-dessous illustre les contrôles propres à la plateforme.

```typescript
import { createHash } from "node:crypto";

interface PackDescriptor {
  packId: string;
  version: string;
  digest: string;
  publisher: string;
}

interface TrustPolicy {
  trustedPublishers: string[];
  installedVersion: string | null;
  allowDowngrade: boolean;
}

function isNewer(candidate: string, installed: string): boolean {
  const c = candidate.split(".").map(Number);
  const i = installed.split(".").map(Number);
  for (let k = 0; k < 3; k++) {
    if (c[k] !== i[k]) {
      return c[k] > i[k];
    }
  }
  return false;
}

function checkPack(desc: PackDescriptor, content: Uint8Array, policy: TrustPolicy): string[] {
  const problems: string[] = [];
  const actual = "sha256:" + createHash("sha256").update(content).digest("hex");
  if (actual !== desc.digest) {
    problems.push("empreinte différente du descripteur");
  }
  if (!policy.trustedPublishers.includes(desc.publisher)) {
    problems.push("éditeur non approuvé");
  }
  if (policy.installedVersion !== null && !policy.allowDowngrade && !isNewer(desc.version, policy.installedVersion)) {
    problems.push("version non supérieure à la version installée");
  }
  return problems;
}
```

Avec un contenu conforme à son descripteur, un éditeur approuvé et la version 2.3.1 installée, la fonction renvoie une liste vide pour la 2.4.0. Avec un contenu modifié, elle signale « empreinte différente du descripteur » ; avec un éditeur inconnu et une version 2.2.0, elle signale « éditeur non approuvé » et « version non supérieure à la version installée ». *Le comparateur de versions ignore les pré-versions : c'est une simplification.*

#### Révocation et retrait

| Cas | Action | Effet |
|---|---|---|
| Défaut découvert dans une version | Révoquer la version | Elle disparaît du catalogue ; les tenants qui l'ont installée sont notifiés, avec la version corrigée |
| Compromission d'une identité d'éditeur | Révoquer l'identité | Les paquets signés ensuite par cette identité sont refusés ; les précédents sont réexaminés |
| Paquet dangereux déjà installé | Désactivation à distance | Interrupteur de retrait, comme pour la marketplace ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)) |

**Modes de défaillance.**

- **Aucune vérification à l'installation.**
- **Miroir cru sur parole.**
- **Clé durable partagée** et jamais renouvelée.
- **Pas de contrôle de version** : retour de version possible.
- **Index du catalogue sans expiration.**
- **Pas de révocation.**

**Contre-exemple.** Un miroir régional est compromis. Il sert un paquet `acme.mro-aviation` 2.4.0 modifié, avec une extension qui exporte les constats vers un serveur tiers. La plateforme n'a aucun contrôle d'empreinte : le paquet est installé chez 60 tenants avant que quelqu'un le remarque. Avec une empreinte signée vérifiée à l'installation, le paquet modifié aurait été refusé.

**Limites.** Une signature prouve l'origine : un éditeur de confiance peut publier un paquet défectueux ; la qualité vient des tests ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)) et des revues ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)). Un journal de transparence public pose la question de la confidentialité des noms de paquets privés, à examiner avant de l'utiliser (raisonnement, non vérifié dans les références consultées). Dans un environnement sans accès au réseau, la vérification doit se faire avec des éléments livrés avec le paquet : c'est un point à étudier au cas par cas. Enfin, gérer des identités et des politiques par tenant est un coût d'exploitation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La marketplace distribue, examine et retire des paquets |
| [21.1 Intégration continue et artefact de build immuable](21-livraison-qualite-logicielle.md#211-intégration-continue-et-artefact-de-build-immuable) | L'artefact construit une fois, immuable, porte l'empreinte signée |
| [21.9 Tests de sécurité dans le pipeline](21-livraison-qualite-logicielle.md#219-tests-de-sécurité-dans-le-pipeline) | La provenance et les contrôles de sécurité du pipeline |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les canaux et anneaux suivent le déploiement progressif |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Les miroirs régionaux respectent la résidence des données |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés de signature relèvent de la gestion des clés |
| [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances) | Le manifeste décrit ce que l'empreinte couvre |
| [23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario) | Les tests de conformité précèdent la signature |
| [24.6 Page d'état, communication d'incident et fenêtre de maintenance](24-cycle-vie-client-support.md#246-page-détat-communication-dincident-et-fenêtre-de-maintenance) | La fenêtre de maintenance règle l'installation des mises à jour |

### 5. Application pratique

**Situation initiale.** L'éditeur publie la version 2.4.1, un correctif. Un miroir régional d'Europe sert, pendant une panne, un fichier tronqué. Par ailleurs, un administrateur d'un tenant essaie d'installer la version 2.2.0 d'un ancien dossier de téléchargement.

**Problème.** Éviter l'installation d'un contenu corrompu, modifié ou plus ancien que la version installée.

**Application du concept.** La plateforme applique la vérification d'empreinte, d'éditeur et de version avant toute installation.

**Déroulé.**

1. L'éditeur construit et teste 2.4.1, signe son empreinte avec l'identité de son système d'intégration et publie sur le canal stable.
2. La plateforme réplique vers les miroirs régionaux et vérifie la signature à la réception.
3. Un tenant déclenche l'installation depuis le miroir tronqué : l'empreinte du contenu diffère du descripteur ; l'installation est refusée avec « empreinte différente du descripteur », et le tenant est redirigé vers une autre copie.
4. L'administrateur qui tente d'installer 2.2.0 reçoit « version non supérieure à la version installée » ; un retour arrière explicite passerait par la procédure de [23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière).
5. Une semaine plus tard, un défaut est découvert dans 2.4.0 : la version est révoquée, les 12 tenants qui l'avaient installée sont notifiés, et la mise à niveau vers 2.4.1 leur est proposée.

**Résultat.** Aucun contenu corrompu ou plus ancien n'est installé, et le défaut de la 2.4.0 se corrige sans intervention manuelle chez les tenants.

**Limites.** La signature n'aurait pas empêché le défaut de 2.4.0, qui vient d'une erreur de conception : c'est la conformité et les scénarios qui le détectent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que prouve la signature d'un paquet, et que ne prouve-t-elle pas ?
2. **Compréhension.** Pourquoi signe-t-on l'empreinte plutôt que le fichier lui-même ?
3. **Compréhension.** Quels contrôles la plateforme applique-t-elle avant d'installer ?
4. **Pourquoi.** Pourquoi une date d'expiration sur l'index du catalogue ?
5. **Raisonnement pratique.** Une clé de signature durable d'un éditeur est compromise. Que faire ?

#### Réponses

1. Elle prouve l'origine (l'identité du signataire) et l'intégrité (le contenu n'a pas changé depuis la signature). Elle ne prouve ni la qualité, ni l'absence de défaut ou de malveillance.
2. Parce que l'empreinte est calculée à partir du contenu : tout changement du contenu change l'empreinte. Signer l'empreinte lie la signature à ce contenu exact, et permet un adressage immuable.
3. La correspondance du contenu avec l'empreinte du descripteur, la vérification de la signature et de l'identité du signataire contre la politique de confiance, l'autorisation de l'éditeur et du canal, et le fait que la version est supérieure à la version installée.
4. Pour empêcher une attaque par gel : un index périmé peut cacher qu'une mise à jour, par exemple de sécurité, existe. En refusant les index trop anciens, la plateforme détecte le blocage.
5. Révoquer la clé et l'identité, refuser les paquets signés ensuite, réexaminer les versions signées pendant la période de compromission, notifier les tenants concernés, republier les paquets avec une nouvelle clé ou une nouvelle identité, et, si possible, adopter une signature par identité éphémère pour ne plus dépendre d'une clé durable.

## 23.7 Tests de conformité et tests de scénario

### 1. Comprendre simplement

Un **test de conformité de paquet** (*pack conformance test*) est une suite automatique qu'un paquet doit réussir avant d'être distribué : forme du manifeste, composants, dépendances, respect des contrats de la plateforme, invariants, installation, mise à niveau et désinstallation. Un **test de scénario** (*scenario test*) est un parcours métier exécutable, écrit sous la forme « étant donné, quand, alors », qui vérifie que le paquet, et les personnalisations du tenant, se comportent comme le métier l'attend.

**Pourquoi cela existe.** Un paquet est installé chez des centaines de tenants, chacun personnalisé. Une erreur est multipliée par le nombre de tenants. Les tests réduisent la probabilité d'erreur à la source, et donnent à chaque tenant un filet de sécurité pour ses propres changements.

**Problème résolu.** Savoir, avant la publication et après chaque mise à niveau, que le paquet est valide, compatible et fait ce que le métier attend.

**Modèle mental.** Le contrôle qualité d'une usine, qui vérifie les dimensions, les normes et l'assemblage (la conformité), et l'essai en conditions réelles, où l'on monte la pièce et l'on fait un vol d'essai (le scénario).

**Où l'analogie s'arrête.** Un contrôle d'usine est le même pour toutes les pièces. Chaque tenant a sa propre configuration : les tests doivent couvrir des configurations variées et personnalisées, pas seulement l'installation sur un tenant vide.

**Exemple.** Avant de publier 2.4.0, la suite vérifie : manifeste valide, 212 composants à clés uniques, dépendances résolubles, aucune référence à un élément interne. Elle installe le paquet sur un tenant vide, le met à niveau depuis 2.3.1 et 2.2.4 sur un tenant de test très personnalisé, puis le désinstalle sans laisser d'orphelins. Le scénario « un constat critique attend l'approbation de la direction » passe.

**Les composants.**

1. la **validation de forme** du manifeste et des composants ;
2. les **contrôles de contrat** : API et points d'extension stables ;
3. les **invariants** et vérifications statiques ;
4. les **tests de cycle de vie** : installation, mise à niveau, désinstallation, retour arrière ;
5. la **convergence** entre installation neuve et mise à niveau ;
6. les **jeux de configurations** personnalisées ;
7. les **scénarios** « étant donné, quand, alors » ;
8. la **porte** de publication et le rapport.

**Objectif d'apprentissage :** vous pouvez décrire ce qu'une suite de conformité vérifie, écrire un scénario métier exécutable et expliquer pourquoi la mise à niveau se teste sur des configurations personnalisées.

### 2. Connaissances essentielles

#### Définition

- **Test de conformité de paquet** : suite de vérifications automatiques qui établit qu'un paquet respecte les règles de forme, de contrat, de comportement et de cycle de vie exigées pour être distribué.
- **Test de scénario** : test qui exécute un parcours métier, avec des préconditions, une action et des résultats attendus, sur un tenant réel ou de test.

#### Idées fondamentales

1. **La conformité dit si le paquet est distribuable.** Le scénario dit s'il fait ce que le métier attend.
2. **On teste au niveau le plus bas possible.** Règles et tables de décision en tests tabulaires, workflows en scénarios, peu de parcours de bout en bout ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)).
3. **La mise à niveau se teste, pas seulement l'installation neuve.** Depuis chaque version supportée, avec des personnalisations.
4. **Installation neuve et mise à niveau convergent.** Hors surcharges, elles donnent la même configuration.
5. **Le paquet livre ses scénarios.** Ils servent de test de fumée chez chaque tenant.
6. **Le tenant ajoute les siens.** Ses scénarios protègent ses personnalisations.
7. **Le résultat est une porte.** Pas de signature ni de publication sans réussite ([21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité)).

#### Vocabulaire essentiel

- **Suite de conformité** (*conformance suite*) : ensemble de tests de conformité exécutés ensemble.
- **Jeu de configurations** (*configuration fixture*) : configuration de tenant de test qui représente un profil de personnalisation.
- **Convergence** (*convergence*) : deux chemins d'installation aboutissent au même état.
- **Matrice de compatibilité** (*compatibility matrix*) : combinaisons de versions de paquet, de moteur et de profils testées.
- **Scénario** (*scenario*) : parcours métier exécutable.
- **Étant donné, quand, alors** (*given, when, then*) : structure d'un scénario : préconditions, comportement, résultats attendus.
- **Test de contrat** (*contract test*) : vérification que deux parties respectent l'accord qui les lie.
- **Test de fumée** (*smoke test*) : vérification rapide des parcours essentiels.
- **Test instable** (*flaky test*) : test qui réussit ou échoue sans changement du code ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)).

#### Relations de cause à effet

- Le paquet n'est testé que par une installation sur un tenant vide. Il échoue chez les tenants personnalisés, qui sont tous les tenants réels.
- La mise à niveau n'est testée que depuis la version précédente. Les tenants en retard de deux versions échouent.
- Les scénarios dépendent de l'horloge ou de données partagées. Ils sont instables, puis ignorés.
- Les tests vérifient des détails internes. Tout changement les casse, et l'on cesse de les croire.

#### Idées reçues

- **« Si l'installation passe, la mise à niveau passera. »** Non. La mise à niveau traverse des états que l'installation neuve n'a jamais : surcharges, versions intermédiaires, données existantes.
- **« Les scénarios remplacent les tests unitaires. »** Non. Ils sont plus lents et moins précis : la pyramide de tests s'applique aussi aux paquets.
- **« Les tests sont l'affaire de l'éditeur. »** Non. Le tenant doit pouvoir rejouer les scénarios du paquet et ajouter les siens.

#### Principe clé

Un paquet n'est publié que s'il est conforme et passe ses scénarios, en installation neuve, en mise à niveau depuis chaque version supportée et sur des configurations personnalisées ; ses scénarios restent disponibles chez les tenants.

#### Si vous ne retenez que trois choses

1. La conformité vérifie forme, contrats, comportement et cycle de vie ; le scénario vérifie le métier.
2. La mise à niveau se teste depuis les versions supportées, sur des configurations personnalisées, avec contrôle de convergence.
3. Les scénarios du paquet servent aussi de test de fumée chez les tenants, qui y ajoutent les leurs.

### 3. Explication technique détaillée

#### Ce que vérifie la conformité

| Catégorie | Vérifications | Exemple d'échec |
|---|---|---|
| Forme | Manifeste conforme à son schéma ; clés uniques et préfixées | Deux composants avec la même clé |
| Références | Toute référence résout vers un composant du paquet ou d'une dépendance | Règle qui cite un champ inexistant |
| Dépendances | Plages résolubles, aucun cycle ([23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)) | `^1.3.0` impossible à satisfaire |
| Contrats | N'emploie que des API et points d'extension stables ; surface publique déclarée | Lecture d'un champ interne |
| Comportement | États atteignables, pas d'impasse, rôles utilisables, invariants ([13.5 Invariants](13-concepts-transversaux.md#135-invariants)) | État sans transition d'entrée |
| Sécurité | Permissions minimales, aucun secret, extension isolée | Secret en clair dans un composant |
| Compatibilité | Fonctionne sur chaque version du moteur déclarée | Capacité absente en 7.2.0 |
| Cycle de vie | Installation neuve, mise à niveau, désinstallation, retour arrière | Orphelins après désinstallation |

La certification des distributions de Kubernetes procède de la même idée : les fournisseurs exécutent la suite de tests de conformité de Kubernetes et soumettent leurs résultats à un examen. La documentation consultée décrit ce processus, sans détailler le contenu des tests.

```json
{
  "pack_id": "acme.mro-aviation",
  "version": "2.4.0",
  "suite": "pack-conformance-1.6",
  "result": "passed",
  "checks": {
    "form": "passed",
    "references": "passed",
    "dependencies": "passed",
    "contracts": "passed",
    "behavior": "passed",
    "security": "passed",
    "compatibility": { "7.2.0": "passed", "7.3.1": "passed" },
    "lifecycle": {
      "fresh_install": "passed",
      "upgrade_from_2.3.1": "passed",
      "upgrade_from_2.2.4": "passed",
      "upgrade_customized_heavy": "passed",
      "uninstall": "passed",
      "rollback": "passed"
    }
  },
  "scenarios": { "total": 64, "passed": 64, "quarantined": 0 }
}
```

#### Tester le cycle de vie et la convergence

| Test | Départ | Arrivée | Ce qu'il vérifie |
|---|---|---|---|
| Installation neuve | Tenant vide | 2.4.0 | La configuration attendue |
| Mise à niveau N-1 | 2.3.1, sans personnalisation | 2.4.0 | Convergence avec l'installation neuve |
| Mise à niveau N-2 | 2.2.4 | 2.4.0 | Passage par les versions intermédiaires |
| Mise à niveau personnalisée | 2.3.1 et un jeu de surcharges | 2.4.0 | Surcharges conservées, conflits attendus ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) |
| Désinstallation | 2.4.0 | Aucun | Aucun orphelin, dépendances respectées ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)) |
| Retour arrière | 2.4.0 après mise à niveau | 2.3.1 | Configuration d'origine rétablie ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)) |

Le test de **convergence** compare la configuration obtenue par une installation neuve et celle obtenue par une mise à niveau, hors surcharges :

```typescript
type ConfigMap = Record<string, unknown>;

function differences(fresh: ConfigMap, upgraded: ConfigMap): string[] {
  const out: string[] = [];
  const keys = new Set([...Object.keys(fresh), ...Object.keys(upgraded)]);
  for (const key of [...keys].sort()) {
    const a = JSON.stringify(fresh[key]);
    const b = JSON.stringify(upgraded[key]);
    if (a !== b) {
      out.push(`${key} : installation neuve=${a}, mise à niveau=${b}`);
    }
  }
  return out;
}
```

Avec une installation neuve qui donne la vue `view.findings_open` en version `v3` et une mise à niveau qui la laisse en `v2`, la fonction signale : `view.findings_open : installation neuve="v3", mise à niveau="v2"`. C'est le défaut typique d'une migration oubliée pour une version intermédiaire. Appelée sur deux configurations identiques, elle renvoie une liste vide.

**Jeux de configurations.** Les tenants de test représentent des profils de personnalisation : aucune, légère (quelques valeurs), lourde (extensions, remplacements, retard de plusieurs versions). Ils sont construits à partir des motifs de surcharge observés chez les tenants, jamais à partir de leurs données ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)). La **matrice** se choisit par représentants : versions de paquet supportées (N, N-1, N-2) croisées avec les versions du moteur (minimale et courante) et les profils (aucun, léger, lourd).

#### Les scénarios

L'article de Martin Fowler sur la forme « étant donné, quand, alors » indique qu'elle a été développée par Daniel Terhorst-North et Chris Matts dans le cadre du développement piloté par le comportement : *étant donné* décrit les préconditions, *quand* le comportement spécifié, *alors* les changements attendus. Elle sert à spécifier par l'exemple et s'écrit dans des outils comme Cucumber. L'article recommande, pour la partie « alors », des requêtes sans effet de bord. C'est la forme déjà employée pour valider un domaine configuré ([15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée)).

```yaml
scenario: critical_finding_requires_management_approval
description: Un constat critique attend l'approbation de la direction avant clôture
tags: [workflow, approval, smoke]
clock: "2026-10-14T09:00:00Z"
given:
  tenant_profile: airline_standard
  aircraft: { id: ac_8f3a, registration: F-ABCD, base: LYS }
  finding: { id: fd_204, aircraft: ac_8f3a, severity: critical, state: in_review }
  users:
    - { id: u_karim, role: technician }
    - { id: u_sophie, role: quality_manager }
when:
  - actor: u_sophie
    action: approve
    target: fd_204
    step: quality_approval
then:
  - expect: finding_state
    target: fd_204
    equals: awaiting_management_approval
  - expect: task_created
    for_role: technical_director
  - expect: notification_sent
    template: finding_critical
    to_role: technical_director
```

Le scénario fixe l'horloge (`clock`) : les échéances et les délais ne dépendent plus de l'heure d'exécution ([13.6 Modélisation temporelle](13-concepts-transversaux.md#136-modélisation-temporelle)). Un second scénario vérifie la promesse du module :

```yaml
scenario: upgrade_preserves_tenant_customization
given:
  installed: { pack: acme.mro-aviation, version: 2.3.1 }
  overrides:
    - { component: acme.workflow.finding_approval, property: steps.review.delay_days, value: 3 }
when:
  - action: upgrade_pack
    target_version: 2.4.0
then:
  - expect: effective_value
    component: acme.workflow.finding_approval
    property: steps.review.delay_days
    equals: 3
  - expect: scenario_passes
    scenario: critical_finding_requires_management_approval
```

**Où les scénarios s'exécutent.**

| Lieu | Qui | Objectif |
|---|---|---|
| Intégration continue de l'éditeur | L'éditeur | Porte de publication |
| Bac à sable du tenant, après plan à blanc | La plateforme | Contrôle avant application ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)) |
| Production, après mise à niveau | La plateforme | Test de fumée en lecture seule, ou sur des enregistrements d'essai marqués et nettoyés |
| Tests propres au tenant | Le tenant | Protéger ses personnalisations |

Les extensions de code et les intégrations qui s'appuient sur un point d'extension se testent par des tests de contrat entre le consommateur et le fournisseur ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)) : la plateforme rejoue les attentes déclarées par chaque extension à chaque nouvelle version du point d'extension ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)).

**Modes de défaillance.**

- **Test d'installation neuve seulement.**
- **Mise à niveau testée depuis la seule version précédente.**
- **Aucun jeu de configurations personnalisées.**
- **Scénarios dépendants de l'horloge** ou de données partagées.
- **Tests de détails internes**, cassés à chaque évolution.
- **Résultat non bloquant** : la publication continue malgré l'échec.

**Contre-exemple.** Un éditeur valide chaque version en l'installant sur un tenant vide. La version 2.5.0 passe tous les tests, puis échoue chez 80 tenants lors de la mise à niveau : une migration de vue, jamais exercée par les tests, plante sur les vues personnalisées. Il faut deux jours de correctifs, et la confiance dans les mises à jour automatiques s'effondre.

**Limites.** Aucune matrice ne couvre toutes les personnalisations des tenants : les jeux de configurations représentent des motifs, pas la réalité. Les scénarios de bout en bout sont lents et coûteux à maintenir. Et un scénario ne vaut que par le métier qui l'a rédigé : un scénario faux donne une fausse assurance. Il faut donc que des personnes du métier relisent les scénarios, comme elles relisent la configuration ([15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | La pyramide de tests, les contrats et les tests instables s'appliquent aux paquets |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les tests de configuration et les données de test synthétiques alimentent les jeux |
| [21.2 Livraison continue et portes de qualité](21-livraison-qualite-logicielle.md#212-livraison-continue-et-portes-de-qualité) | La suite de conformité est une porte de qualité |
| [15.1 De nouveau domaine à plateforme configurée](15-cas-application.md#151-de-nouveau-domaine-à-plateforme-configurée) | La démarche vérifie déjà le domaine par des scénarios |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants sont vérifiés par la conformité |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | Les vérifications statiques et simulations du comportement |
| [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation) | Les tests de mise à niveau exercent la fusion à trois voies |
| [23.5 Mise à niveau à blanc, désinstallation et retour arrière](#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière) | Les scénarios servent de test de fumée après mise à niveau |
| [23.6 Distribution et signature des paquets](#236-distribution-et-signature-des-paquets) | La conformité précède la signature |

### 5. Application pratique

**Situation initiale.** L'éditeur prépare 2.4.0. Les tests existants installent le paquet sur un tenant vide et passent tous. Deux versions plus tôt, une mise à niveau a pourtant échoué chez plusieurs clients.

**Problème.** Les tests ne reproduisent pas les conditions réelles : des tenants personnalisés, en retard de version.

**Application du concept.** L'équipe ajoute la matrice de cycle de vie, les jeux de configurations et le contrôle de convergence, et fait de la suite une porte de publication.

**Déroulé.**

1. Elle construit trois jeux de configurations : « aucune », « légère » (3 surcharges) et « lourde » (extensions, composant remplacé, retard de deux versions).
2. Elle exécute les mises à niveau 2.2.4 → 2.4.0 et 2.3.1 → 2.4.0 sur chaque jeu, et compare à l'installation neuve.
3. Le contrôle de convergence signale que la vue `findings_open` reste en `v2` depuis 2.2.4 : la migration de cette version intermédiaire n'a jamais été écrite. Elle est corrigée.
4. Le jeu « lourd » échoue : une surcharge d'extension référence un ancrage que 2.4.0 a renommé sans le déclarer. L'équipe rétablit l'ancrage et déclare son éventuelle dépréciation ([23.8 Propriété, dépréciation, composition, licence et droits d'usage](#238-propriété-dépréciation-composition-licence-et-droits-dusage)).
5. Les 64 scénarios passent, dont `upgrade_preserves_tenant_customization`.
6. Le rapport est joint au paquet ; la signature ([23.6 Distribution et signature des paquets](#236-distribution-et-signature-des-paquets)) n'intervient qu'après la réussite.

**Résultat.** Deux défauts sont corrigés avant la publication, et les mises à niveau chez les clients se passent sans incident.

**Limites.** La suite dure 25 minutes au lieu de 4 : l'équipe l'exécute entièrement à chaque candidat de version et allégée à chaque fusion. Alpha Air ajoute ses propres scénarios pour son étape d'approbation de la direction.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que vérifie une suite de conformité de paquet ?
2. **Compréhension.** Pourquoi la mise à niveau se teste-t-elle sur des configurations personnalisées ?
3. **Compréhension.** Que signifie la convergence entre installation neuve et mise à niveau ?
4. **Pourquoi.** Pourquoi un scénario fixe-t-il l'horloge ?
5. **Raisonnement pratique.** Un paquet supporte trois versions antérieures, deux versions du moteur et trois profils de personnalisation. Combien de mises à niveau teste-t-on dans la matrice complète ?

#### Réponses

1. La forme du manifeste, les références, les dépendances, le respect des contrats stables, le comportement (états, rôles, invariants), la sécurité, la compatibilité avec les versions du moteur, et le cycle de vie : installation, mise à niveau, désinstallation, retour arrière.
2. Parce que les tenants réels sont personnalisés : les surcharges, les extensions et les retards de version créent des états que l'installation sur un tenant vide ne produit jamais.
3. Qu'hors surcharges du tenant, un tenant mis à niveau a la même configuration qu'un tenant neuf à la même version : tout écart révèle une migration oubliée ou une fusion fautive.
4. Parce que les échéances, les délais et les calendriers dépendent du temps : sans horloge fixe, le même scénario donnerait des résultats différents selon l'heure d'exécution et deviendrait instable.
5. $3 \times 2 \times 3 = 18$ mises à niveau, plus l'installation neuve de chaque version du moteur ; on réduit en pratique par des représentants.

## 23.8 Propriété, dépréciation, composition, licence et droits d'usage

### 1. Comprendre simplement

La **propriété d'un paquet** (*pack ownership*) dit qui en répond : qui décide de son contenu, qui le maintient et qui contrôle ce que d'autres peuvent y changer. La **dépréciation** (*deprecation*) est l'annonce qu'un élément sera retiré, avec une période de coexistence. La **composition de plusieurs paquets** (*multi-pack composition*) est leur cohabitation chez un même tenant, sans collision. La **licence** (*pack licensing*) fixe les conditions juridiques d'usage ; les **droits d'usage** (*entitlement*) en sont la traduction technique : qui peut utiliser quoi, combien de temps et en quelle quantité.

**Pourquoi cela existe.** Un paquet vit des années, chez des tenants différents, à côté d'autres paquets. Sans règles de responsabilité, d'évolution et de droits, la plateforme devient ingérable et la relation commerciale floue.

**Problème résolu.** Faire vieillir proprement un ensemble de paquets : savoir qui répond, annoncer les retraits, faire cohabiter les paquets et faire respecter les droits.

**Modèle mental.** Un immeuble de bureaux : un propriétaire qui répond de la structure, un règlement qui impose un préavis avant des travaux, des locataires qui doivent cohabiter dans les parties communes, des baux qui fixent les conditions et des badges qui donnent les accès.

**Où l'analogie s'arrête.** Un badge ouvre une porte physique. Un droit d'usage se vérifie côté serveur à chaque usage, avec des quantités et des durées. Et deux paquets peuvent interagir par des événements et des données partagées, ce qu'un immeuble ne connaît pas.

**Exemple.** L'éditeur publie 2.6.0, qui déprécie le champ `finding.severity_legacy` avec un retrait annoncé en 3.0.0. La plateforme alerte les 41 tenants qui l'utilisent encore. Alpha Air a installé `acme.mro-aviation` et `acme.quality-core` ; son droit d'usage porte sur 120 sièges jusqu'au 31 mars 2027.

**Les composants.**

1. le **propriétaire** et le mainteneur ;
2. le **statut de maintenance** et le plan de fin de vie ;
3. le **cycle de vie** d'un composant : actif, déprécié, retiré ;
4. la **période de coexistence** et la **mesure d'usage** des éléments dépréciés ;
5. les **règles de cohabitation** : espaces de noms, ordre, capacités ;
6. la **licence** ;
7. le **droit d'usage** : statut, validité, quantité ;
8. le **contrôle côté serveur**.

**Objectif d'apprentissage :** vous pouvez décrire le cycle de dépréciation d'un composant, les règles pour faire cohabiter des paquets et la différence entre licence et droit d'usage.

### 2. Connaissances essentielles

#### Définition

- **Propriété d'un paquet** : attribution, à un éditeur et à une équipe identifiés, de la responsabilité du contenu, de la maintenance et du support d'un paquet et de chacun de ses composants.
- **Dépréciation** : état d'un composant ou d'un point d'extension annoncé comme destiné au retrait, encore fonctionnel pendant une période de coexistence.
- **Composition de paquets** : installation conjointe de plusieurs paquets chez un tenant, selon des règles qui évitent leurs collisions.
- **Licence** : conditions juridiques d'utilisation d'un paquet.
- **Droit d'usage** : enregistrement technique qui dit si, pour qui, pour combien et jusqu'à quand un paquet peut être utilisé.

#### Idées fondamentales

1. **Chaque composant a un propriétaire.** Celui qui l'a créé décide de ce que d'autres peuvent y changer.
2. **Retirer prend du temps.** Annonce, coexistence, puis retrait à une version majeure.
3. **On mesure l'usage de ce qui est déprécié.** Pour savoir qui doit migrer.
4. **La composition passe par des espaces de noms et des contrats.** Pas par des modifications croisées.
5. **Les paquets s'empilent dans un ordre.** Les conflits se traitent, ils ne se subissent pas.
6. **La licence est juridique, le droit d'usage est technique.** L'un s'appuie sur l'autre.
7. **Le droit d'usage se vérifie côté serveur.** À chaque usage, pas seulement dans l'interface.

#### Vocabulaire essentiel

- **Propriétaire** (*owner*) : éditeur dont le paquet a créé le composant.
- **Statut de maintenance** (*maintenance status*) : actif, maintenance seule ou fin de vie.
- **Période de coexistence** (*coexistence period*) : durée pendant laquelle l'ancien et le nouveau élément fonctionnent ensemble.
- **Statut de stabilité** (*stability level*) : expérimental, bêta, stable ; il fixe les règles de retrait.
- **Capacité fournie ou exigée** (*provided or required capability*) : fonction qu'un paquet offre ou dont il a besoin.
- **Expression de licence** (*license expression*) : combinaison d'identifiants de licence par des opérateurs.
- **Droit d'usage** (*entitlement*) : autorisation technique d'utiliser un paquet.
- **Siège** (*seat*) : unité de licence par utilisateur ; une **licence de site** couvre tous les utilisateurs.
- **Essai** (*trial*) : droit d'usage temporaire.

#### Relations de cause à effet

- Un composant est retiré sans annonce. Les intégrations et automatisations des tenants cessent de fonctionner à la mise à jour.
- La dépréciation est annoncée mais son usage n'est jamais mesuré. Au jour du retrait, des dizaines de tenants l'utilisent encore.
- Deux paquets modifient le même composant sans règle. Le dernier installé l'emporte, et l'ordre d'installation change le comportement.
- Le droit d'usage n'est vérifié que par l'interface. Il se contourne par l'API.
- Aucune propriété n'est déclarée. Personne ne corrige un défaut, ou deux équipes éditent le même composant.

#### Idées reçues

- **« Déprécier, c'est supprimer plus tard. »** Non. C'est un engagement de coexistence, avec des avertissements et un chemin de migration.
- **« Deux paquets de la même plateforme cohabitent toujours. »** Non. Ils peuvent entrer en collision de clés, d'événements ou de dépendances.
- **« Une licence, c'est une date de fin. »** Non. Elle comprend un statut, des quantités, un périmètre, un essai et souvent une période de grâce.

#### Principe clé

Chaque paquet a un propriétaire ; ce qui doit disparaître est déprécié, mesuré puis retiré à une majeure ; les paquets cohabitent par des espaces de noms et des contrats ; et les droits d'usage, vérifiés côté serveur, appliquent les licences.

#### Si vous ne retenez que trois choses

1. La propriété dit qui décide, qui maintient et qui contrôle ce que les autres peuvent changer.
2. Une dépréciation annonce, laisse coexister, mesure l'usage, puis retire à une version majeure.
3. Licence et droit d'usage sont distincts : le second est vérifié côté serveur.

### 3. Explication technique détaillée

#### La propriété

La documentation des solutions de Microsoft décrit le principe : l'éditeur de la solution dans laquelle un composant est créé en est le propriétaire, et contrôle ce que les autres éditeurs des solutions qui incluent ce composant ont le droit d'y changer. La propriété peut passer d'une solution à une autre chez le même éditeur, mais pas d'un éditeur à un autre ; et une fois l'éditeur introduit pour un composant d'une solution gérée, on ne peut plus le changer. La même documentation en conclut qu'il vaut mieux définir un éditeur unique pour pouvoir modifier ensuite le modèle de couches.

```json
{
  "ownership": {
    "publisher": "acme",
    "maintainer_team": "mro-solutions",
    "support": { "url": "https://support.acme-aero.example", "sla": "next-business-day" },
    "maintenance_status": "active",
    "end_of_life": null
  }
}
```

Le statut de maintenance a trois valeurs : **actif** (évolutions et correctifs), **maintenance seule** (correctifs de sécurité et de conformité), **fin de vie** (plus rien, avec une date et un chemin de migration). La marketplace affiche ce statut sur la fiche ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)).

#### La dépréciation

Le cycle d'un composant est : **actif**, **déprécié**, **retiré**. La spécification du versionnement sémantique impose d'incrémenter la mineure quand une fonction est dépréciée et la majeure quand elle est retirée, et sa foire aux questions demande au moins une version mineure qui contient la dépréciation avant le retrait.

La politique de dépréciation de Kubernetes fixe des durées par niveau de stabilité : une API générale peut être dépréciée mais ne peut pas être retirée au sein d'une version majeure ; une API bêta est dépréciée au plus 9 mois ou 3 versions mineures après son introduction, et n'est plus servie 9 mois ou 3 versions mineures après sa dépréciation, selon la durée la plus longue ; une API alpha peut être retirée à toute version sans préavis. Depuis la version 1.19, une requête vers un point déprécié reçoit un en-tête d'avertissement, une annotation dans le journal d'audit et une métrique les compte.

La plateforme en tire une politique par niveau de stabilité. Les durées ci-dessous sont des valeurs d'exemple :

| Niveau de stabilité | Préavis avant retrait | Retrait possible dans |
|---|---|---|
| Stable | Au moins 2 versions mineures et 12 mois | Version majeure seulement |
| Bêta | Au moins 1 version mineure et 6 mois | Version mineure |
| Expérimental | Aucun préavis | Toute version |

```json
{
  "key": "acme.field.finding.severity_legacy",
  "status": "deprecated",
  "since": "2.6.0",
  "remove_in": "3.0.0",
  "replacement": "acme.field.finding.severity",
  "migration": { "tool": "pack-migrate", "automatic": true },
  "message": "Utilisez le champ « gravité » ; l'ancien champ sera retiré en 3.0.0."
}
```

Un composant déprécié doit rester **observable** : chaque usage (lecture, écriture, appel d'API, règle qui le cite) est compté par tenant.

```sql
SELECT tenant_id,
       component_key,
       count(*)     AS uses_30d,
       max(used_at) AS last_use
  FROM deprecated_usage
 WHERE pack_id = $1
   AND used_at >= now() - interval '30 days'
 GROUP BY tenant_id, component_key
 ORDER BY uses_30d DESC;
```

Cette requête dit qui utilise encore l'élément. Elle alimente les messages aux administrateurs, les avertissements dans l'API, l'outil de migration et la décision de retrait. Une valeur d'énumération ou d'amorçage se **retire** (masquée aux nouvelles saisies) sans casser les enregistrements qui la citent ([23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation)).

#### La composition de plusieurs paquets

| Règle | Contenu |
|---|---|
| Espaces de noms | Le préfixe d'éditeur évite les collisions de clés, de noms de champs et d'événements |
| Pas de modification croisée | Un paquet ne modifie pas le composant d'un autre ; il passe par ses points d'extension ou par une dépendance déclarée |
| Ordre d'empilement | Déterministe : d'abord les dépendances, puis l'ordre d'installation |
| Capacités | Un paquet exige une capacité (`finding-management` en version 1 ou plus) plutôt qu'un paquet précis |
| Compatibilité testée | Les combinaisons supportées sont déclarées et testées ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)) |

La documentation de Microsoft sur les couches décrit l'empilement : le dernier installé se place au-dessus du précédent et peut le personnaliser ; en cas de définitions conflictuelles, le comportement est « le dernier gagne » ou une logique de fusion ; si l'on désinstalle une solution, celle du dessous prend effet. Le préfixe d'éditeur, selon la même documentation, permet d'installer ensemble des solutions d'éditeurs différents avec peu de conflits.

| Conflit | Détection | Traitement |
|---|---|---|
| Même clé de composant | À l'installation | Refus, avec les deux propriétaires |
| Deux traitements sur un même point d'extension | À l'installation | Priorités déclarées ; sinon refus |
| Dépendances incompatibles (deux majeures d'un même paquet) | Résolution | Refus : ils ne peuvent pas coexister |
| Même rôle défini deux fois | À l'installation | Refus ; renommage par l'éditeur |
| Événements du même nom | À l'installation | Refus, sauf schéma identique |

```json
{
  "tenant_id": "ten_airline_01",
  "installed_order": [
    { "pack_id": "acme.notifications-base", "version": "2.1.0" },
    { "pack_id": "acme.quality-core", "version": "1.5.2" },
    { "pack_id": "acme.mro-aviation", "version": "2.4.0" }
  ],
  "capabilities_provided": ["finding-management@1", "notification-templates@2"],
  "conflicts": [],
  "warnings": [
    "acme.mro-aviation et acme.quality-core définissent chacun un traitement sur acme.finding.before_close : priorité 10 et 20"
  ]
}
```

#### Licence et droits d'usage

La **licence** est un texte juridique. Pour les composants sous licence libre qu'un paquet embarque, la spécification SPDX fournit des expressions : `OR` pour un choix, `AND` pour une conformité simultanée, `WITH` pour une exception, `+` pour « cette version ou une suivante », et la forme `LicenseRef-` pour une licence qui n'est pas dans la liste, comme la licence commerciale du paquet (champ `license` du manifeste, [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances)). Les identifiants désignent des conditions : ils ne remplacent pas l'avis d'un juriste.

Le **droit d'usage** applique la licence :

```sql
CREATE TABLE pack_entitlement (
  tenant_id   uuid  NOT NULL,
  pack_id     text  NOT NULL,
  edition     text  NOT NULL,
  status      text  NOT NULL CHECK (status IN ('trial', 'active', 'suspended', 'expired')),
  seats       integer,
  valid_from  date  NOT NULL,
  valid_until date,
  source      text  NOT NULL,
  PRIMARY KEY (tenant_id, pack_id)
);
```

Le champ `seats` nul signifie une licence de site. La documentation de gestion des licences de Salesforce décrit un modèle voisin pour les paquets gérés : un enregistrement de licence est créé à chaque installation ; la licence est par siège ou de site ; son statut est essai (jusqu'à 90 jours), actif ou suspendu, et un essai converti en actif ne peut pas revenir en essai ; une date d'expiration borne l'usage, ou n'existe pas ; la désinstallation passe le statut à « désinstallé » et fige la licence. Elle précise que l'accès est contrôlé par le statut.

```typescript
type EntitlementStatus = "trial" | "active" | "suspended" | "expired";

interface Entitlement {
  status: EntitlementStatus;
  validUntil: string | null;
  seats: number | null;
}

function canUse(entitlement: Entitlement, today: string, seatsInUse: number): boolean {
  if (entitlement.status === "suspended" || entitlement.status === "expired") {
    return false;
  }
  if (entitlement.validUntil !== null && today > entitlement.validUntil) {
    return false;
  }
  if (entitlement.seats !== null && seatsInUse > entitlement.seats) {
    return false;
  }
  return true;
}
```

Avec un droit actif valable jusqu'au 2027-03-31 pour 120 sièges, `canUse` renvoie `true` à la date du 2026-10-14 avec 98 sièges utilisés, `false` au 2027-04-01 (expiré), `false` avec 121 sièges (quota dépassé) et `false` si le statut est suspendu ; un essai sans limite de date ni de sièges renvoie `true`. *Les dates ISO se comparent comme des chaînes tant que leur format est identique.*

**Où le contrôle s'applique.** À l'**installation** (le tenant a-t-il droit au paquet ?), à l'**usage** des fonctions du paquet (côté serveur, par la passerelle d'accès, [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)), à l'**attribution des sièges** et au **renouvellement**. L'interface cache les fonctions non autorisées, mais ne les protège pas : la vérification est celle du serveur.

**À l'expiration.** Les fonctions du paquet se ferment, ou passent en lecture seule selon l'offre. Les **données du tenant ne sont jamais supprimées** par une expiration : elles restent exportables ([24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)). Les verrous de personnalisation du paquet, de leur côté, n'ont rien à voir avec la licence : la documentation de Microsoft précise que ses propriétés gérées ne fournissent ni protection des droits, ni mécanisme de licence ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)). Les aspects commerciaux (offres, facturation) relèvent du [module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation).

**Modes de défaillance.**

- **Composant retiré sans annonce.**
- **Dépréciation sans mesure d'usage.**
- **Même clé définie par deux paquets.**
- **Ordre d'installation qui change le résultat.**
- **Droit d'usage vérifié seulement par l'interface.**
- **Expiration qui supprime les données** du tenant.

**Contre-exemple.** Un éditeur retire dans une version mineure l'événement `finding.critical`, qu'il juge inutile. Les intégrations de 130 tenants qui l'écoutent cessent de fonctionner. Le journal des changements ne le mentionnait pas, et aucun avertissement n'avait été émis. L'éditeur doit republier l'événement en urgence, et la confiance des clients dans les versions mineures est atteinte.

**Limites.** Les durées de préavis sont un engagement commercial autant que technique : elles se négocient avec les clients, et un client très en retard demande parfois un support étendu. La composition coûte cher à tester : chaque paire de paquets supportée est une combinaison de plus ([23.7 Tests de conformité et tests de scénario](#237-tests-de-conformité-et-tests-de-scénario)). Enfin, les licences et les droits d'usage ont une dimension juridique que ce module n'aborde pas : leur rédaction et leur interprétation demandent une revue juridique.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | L'abonnement et les droits d'usage encadrent l'accès aux paquets |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La marketplace affiche la maintenance, examine et retire |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | La dépréciation d'API suit les mêmes règles |
| [20.11 Instruments contractuels, régimes sectoriels et registre des risques](20-gouvernance-donnees-conformite.md#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Les instruments contractuels portent les conditions de licence |
| [23.1 Paquet de solution, manifeste et dépendances](#231-paquet-de-solution-manifeste-et-dépendances) | Le manifeste porte la propriété et la licence |
| [23.2 Versionnement, données d'amorçage et paramètres d'installation](#232-versionnement-données-damorçage-et-paramètres-dinstallation) | La version et la dépréciation s'accordent : mineure pour déprécier, majeure pour retirer |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les points d'extension sont dépréciés selon la même politique |
| [23.6 Distribution et signature des paquets](#236-distribution-et-signature-des-paquets) | La révocation et la distribution complètent la dépréciation |
| [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression) | Le départ du client conserve et restitue les données après expiration |
| [29.3 Gouvernance des API et politique de dépréciation](29-organisation-produit-economie.md#293-gouvernance-des-api-et-politique-de-dépréciation) | La gouvernance des API applique la même politique de dépréciation |

### 5. Application pratique

**Situation initiale.** L'éditeur veut remplacer le champ `finding.severity_legacy` par `finding.severity`, déjà présent. Le plan prévoit un retrait en 3.0.0. Les tenants ont des automatisations et des intégrations qui lisent l'ancien champ.

**Problème.** Retirer un élément public sans casser les tenants, et savoir qui il reste à migrer.

**Application du concept.** La plateforme applique le cycle de dépréciation avec mesure d'usage.

**Déroulé.**

1. La version 2.6.0 (mineure) marque le champ comme déprécié : `since: 2.6.0`, `remove_in: 3.0.0`, avec le remplacement et un outil de migration.
2. La plateforme compte les usages par tenant : 41 tenants utilisent encore le champ.
3. Les administrateurs concernés reçoivent un message ; l'API ajoute un avertissement aux réponses qui le contiennent ; l'éditeur propose une migration automatique.
4. Six mois plus tard, 9 tenants l'utilisent encore. L'équipe produit les contacte un par un ; 2 demandent un délai, accordé par un support étendu contractuel.
5. La version 3.0.0 retire le champ. Les tenants qui n'ont pas migré restent sur la 2.x, avec correctifs de sécurité seulement (statut « maintenance seule »).

**Résultat.** Le retrait n'a cassé aucune intégration en production ; chaque tenant connaissait la date et avait un outil.

**Limites.** Le coût de la coexistence est réel : deux champs à maintenir pendant dix-huit mois. Les deux tenants en support étendu ralentissent la simplification du produit.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qui est propriétaire d'un composant d'un paquet, et qu'est-ce que cela permet ?
2. **Compréhension.** Quelles sont les étapes de la dépréciation d'un composant ?
3. **Compréhension.** Quelle différence y a-t-il entre une licence et un droit d'usage ?
4. **Pourquoi.** Pourquoi vérifie-t-on le droit d'usage côté serveur ?
5. **Raisonnement pratique.** Deux paquets définissent chacun un traitement sur le même point d'extension. Comment éviter que l'ordre d'installation change le comportement ?

#### Réponses

1. L'éditeur du paquet qui l'a créé. Il contrôle ce que les autres éditeurs et les tenants peuvent y modifier, et répond de son maintien.
2. Annonce par une version mineure (statut déprécié, date de retrait, remplacement), coexistence avec mesure d'usage et avertissements, accompagnement des tenants concernés, puis retrait à une version majeure.
3. La licence est un texte juridique qui fixe les conditions d'usage ; le droit d'usage est son application technique : statut, validité, quantité, pour un tenant et un paquet.
4. Parce que l'interface peut être contournée : une fonction masquée reste appelable par l'API. Seul le serveur fait autorité sur ce que le tenant peut faire.
5. En déclarant des priorités explicites sur le point d'extension, ou en refusant l'installation en cas d'ambiguïté : le résultat dépend alors des priorités déclarées, pas de l'ordre d'installation.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Solutions, composants, dépendances, cycle de vie | Microsoft, *Solution concepts with Power Platform* | [learn.microsoft.com](https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm) | 23.1, 23.4, 23.5, 23.8 |
| Couches et comportement de fusion | Microsoft, *Solution layers and merge behavior in Power Platform* | [learn.microsoft.com](https://learn.microsoft.com/en-us/power-platform/alm/solution-layers-alm) | 23.3, 23.4, 23.8 |
| Propriétés gérées | Microsoft, *View and edit managed properties in solutions* | [learn.microsoft.com](https://learn.microsoft.com/en-us/power-platform/alm/managed-properties-alm) | 23.3, 23.8 |
| Paquets, dépendances, valeurs et schéma | Helm, *Charts* | [helm.sh](https://helm.sh/docs/topics/charts/) | 23.1, 23.2 |
| Mise à niveau, essai à blanc, retour arrière | Helm, *helm upgrade* | [helm.sh](https://helm.sh/docs/helm/helm_upgrade/) | 23.5 |
| Fusion à trois voies à la mise à niveau | Helm, *Changes since Helm 2* | [helm.sh](https://helm.sh/docs/faq/changes_since_helm2/) | 23.4, 23.5 |
| Registres et empreintes de paquets | Helm, *Use OCI-based registries* | [helm.sh](https://helm.sh/docs/topics/registries/) | 23.6 |
| Fusion à trois voies de fichiers | Git, *git-merge-file* | [git-scm.com](https://git-scm.com/docs/git-merge-file) | 23.4 |
| Versionnement sémantique | *Semantic Versioning 2.0.0* | [semver.org](https://semver.org/) | 23.2, 23.8 |
| Plages de versions compatibles | The Cargo Book, *Specifying Dependencies* | [doc.rust-lang.org](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html) | 23.1 |
| Migrations versionnées et répétables | Redgate, documentation Flyway, *Migrations* | [documentation.red-gate.com](https://documentation.red-gate.com/fd/migrations-271585107.html) | 23.2, 23.5 |
| Politique de dépréciation | Kubernetes, *Deprecation Policy* | [kubernetes.io](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) | 23.3, 23.8 |
| Essai à blanc côté serveur | Kubernetes, *API Concepts*, section « Dry-run » | [kubernetes.io](https://kubernetes.io/docs/reference/using-api/api-concepts/) | 23.5 |
| Signature par identité | Sigstore, *Overview* | [docs.sigstore.dev](https://docs.sigstore.dev/about/overview/) | 23.6 |
| Sécurité des systèmes de mise à jour | The Update Framework, *Overview* | [theupdateframework.io](https://theupdateframework.io/overview/) | 23.6 |
| Certification par tests de conformité | CNCF, *Certified Kubernetes Conformance Program* | [github.com](https://github.com/cncf/k8s-conformance) | 23.7 |
| Scénarios « étant donné, quand, alors » | Martin Fowler, *GivenWhenThen* | [martinfowler.com](https://martinfowler.com/bliki/GivenWhenThen.html) | 23.7 |
| Expressions de licence | SPDX, spécification 2.3.1, *SPDX license expressions* | [spdx.github.io](https://spdx.github.io/spdx-spec/v2.3.1/SPDX-license-expressions/) | 23.8 |
| Licences de paquets gérés | Salesforce Trailhead, *Manage Your Licenses* | [trailhead.salesforce.com](https://trailhead.salesforce.com/content/learn/modules/appexchange_licensing/appexchange_licensing_manage) | 23.8 |
| Propriétés modifiables d'un composant packagé ; retrait de composants | Salesforce, guides de paquets de deuxième génération | Résultats de recherche (extraits ; pages non lues) | 23.3 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Les pages de référence de Salesforce sur les composants de paquets (propriétés modifiables après installation, retrait de composants) n'ont pas pu être lues (accès refusé) : seuls des extraits issus de résultats de recherche ont été consultés. La page de la politique de licences est celle de Trailhead.
- La page de la politique de dépréciation de Kubernetes a été lue partiellement : la fin du texte (options de ligne de commande, fonctionnalités, métriques) n'a pas été lue.
- Les pages de Helm consultées sont marquées « non mises à jour pour Helm 4 » : les options citées sont à relire pour cette version.
- La page de TUF décrit les menaces sans les nommer : les noms « attaque par retour de version » et « attaque par gel » sont ceux de l'usage, non confrontés à la page.
- La confidentialité des journaux de transparence publics pour des paquets privés, et la vérification hors ligne : raisonnement, non confronté à une source.
- Le contenu des tests de la certification Kubernetes : la page consultée ne le décrit pas.
- L'adaptation du versionnement sémantique à une configuration (surface publique d'un paquet, énumérations ouvertes ou fermées, classe d'un changement de valeur par défaut) est une règle de conception de ce cours, pas une règle de la spécification.
- Les durées de préavis du tableau de dépréciation sont des valeurs d'exemple ; elles s'inspirent de Kubernetes sans les reprendre.
- Les aspects juridiques des licences, des conditions d'usage et des engagements contractuels ne sont pas traités : ils exigent une revue juridique.
- Les valeurs chiffrées (nombres de composants, de tenants, de sièges, durées, volumes, dates) sont des valeurs d'exemple.
- Les formats de manifeste, de plan, de rapport, de scénario, de politique de confiance et de droit d'usage sont propres à la plateforme fictive.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance. Les extraits TypeScript ont été contrôlés syntaxiquement et exécutés avec Node.js sur les exemples donnés (ordre d'installation, classification des changements, résolution des couches, fusion à trois voies, contrôles de distribution, convergence, droit d'usage).
