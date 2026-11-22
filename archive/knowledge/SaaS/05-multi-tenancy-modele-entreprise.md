# Module 5 — Multi-tenancy et modèle d'entreprise

> **Question directrice.** Comment transformer le moteur en un vrai SaaS multi-clients, avec une isolation réelle et une organisation interne assez riche pour des entreprises complexes ?

## Présentation du module

**Objectif.** Le [module 1](01-architecture-saas.md) a introduit la notion de tenant. Ce module la creuse : la hiérarchie d'entreprise que la plateforme doit représenter, les mécanismes d'isolation, la façon dont chaque requête connaît son tenant, les architectures de stockage possibles, puis l'exploitation des tenants (cycle de vie, configuration, administration, migration).

**Prérequis.** Les notions de tenant et de plan de contrôle du module 1, les relations et hiérarchies du module 2, l'autorisation du module 4.

**Ordre retenu.** Le module suit un ordre du modèle vers l'exploitation. Il diffère légèrement du plan : la hiérarchie d'entreprise, qui n'est qu'un schéma dans le plan, est traitée comme une entrée à part entière.

```text
Modèle           hiérarchie d'entreprise
Isolation        isolation ─ contexte de tenant
Architecture     modèles partagé / séparé ─ hybride
Exploitation     provisionnement et cycle de vie ─ configuration ─ données et permissions
                 administration inter-tenants ─ migration
```

```text
Plateforme
    ↓
 Tenant
    ↓
Organisation
    ↓
Unité d'affaires
    ↓
  Équipe
    ↓
Utilisateur
```

## Sommaire du module

- [5.1 La hiérarchie d'entreprise](#51-la-hiérarchie-dentreprise)
- [5.2 Isolation des tenants](#52-isolation-des-tenants)
- [5.3 Contexte de tenant](#53-contexte-de-tenant)
- [5.4 Modèles d'architecture multi-tenant](#54-modèles-darchitecture-multi-tenant)
- [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride)
- [5.6 Provisionnement et cycle de vie d'un tenant](#56-provisionnement-et-cycle-de-vie-dun-tenant)
- [5.7 Configuration et personnalisation au niveau du tenant](#57-configuration-et-personnalisation-au-niveau-du-tenant)
- [5.8 Données et permissions propres au tenant](#58-données-et-permissions-propres-au-tenant)
- [5.9 Administration inter-tenants](#59-administration-inter-tenants)
- [5.10 Migration de tenant](#510-migration-de-tenant)

## 5.1 La hiérarchie d'entreprise

### 1. Comprendre simplement

Une grande entreprise cliente n'est pas un bloc uniforme. Elle a des filiales, des divisions, des services, des équipes. La plateforme doit représenter cette structure pour y répartir l'administration, les droits et les configurations. Le plan propose un empilement en six niveaux : **plateforme**, **tenant**, **organisation**, **unité d'affaires** (*business unit*), **équipe** et **utilisateur**.

**Pourquoi cela existe.** Un client de grande taille veut qu'un directeur de filiale administre sa filiale sans avoir accès aux autres, qu'une configuration par défaut s'applique à tout le groupe avec des exceptions locales, et que les rapports se consolident du bas vers le haut.

**Problème résolu.** Refléter la structure réelle des clients pour déléguer l'administration, hériter des réglages et agréger les résultats.

**Modèle mental.** Un organigramme. La racine est l'entreprise ; chaque niveau a ses responsables, qui n'administrent que leur branche.

**Où l'analogie s'arrête.** Un organigramme est souvent un arbre strict. Dans la réalité, une personne appartient à plusieurs équipes, des équipes transversales traversent les divisions, et les structures changent après des fusions et des réorganisations.

**Exemple.**

```text
Plateforme
 └─ Tenant : Compagnie aérienne régionale
     ├─ Organisation : Filiale Nord
     │   ├─ Unité d'affaires : Maintenance
     │   │   └─ Équipe : Ligne Lyon  ──  utilisateurs…
     │   └─ Unité d'affaires : Opérations
     └─ Organisation : Filiale Sud
```

**Les composants.**

1. des **niveaux** typés ;
2. une **relation parent–enfant** entre eux ;
3. des **appartenances** pour les personnes ;
4. une **administration déléguée** par niveau.

**Objectif d'apprentissage :** vous pouvez nommer les six niveaux, dire lesquels sont des frontières d'isolation et lesquels sont des structures d'administration.

### 2. Connaissances essentielles

#### Définition

La **hiérarchie d'entreprise** est la structure arborescente qui organise, à l'intérieur de la plateforme, les clients (tenants) et leurs subdivisions (organisations, unités d'affaires, équipes) jusqu'aux utilisateurs, afin de répartir administration, droits, configuration et reporting.

#### Idées fondamentales

1. **Le tenant est la frontière d'isolation.** En dessous, les niveaux structurent sans isoler fortement.
2. **Chaque niveau a une finalité.** Administration, facturation, reporting, collaboration.
3. **L'administration est déléguée par branche.** Un responsable gère son sous-arbre.
4. **Les réglages et les droits descendent.** Avec des exceptions possibles à chaque niveau.
5. **Une plateforme agnostique préfère une hiérarchie générique.** Des niveaux typés et nommables par le client, plutôt que quatre colonnes figées.
6. **La structure évolue.** Fusions, scissions, réorganisations : le modèle doit permettre de rattacher une branche ailleurs.

#### Vocabulaire essentiel

- **Plateforme** (*platform*) : le fournisseur et l'ensemble des tenants.
- **Tenant** : le client, frontière d'isolation (voir [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy)).
- **Organisation** (*organization*) : entité légale ou fonctionnelle du client (filiale, société).
- **Unité d'affaires** (*business unit*) : subdivision par activité ou par métier (maintenance, opérations).
- **Équipe** (*team*) : groupe de personnes qui travaillent ensemble.
- **Nœud d'organisation** (*org unit*) : élément générique de l'arbre.
- **Administration déléguée** (*delegated administration*) : droit d'administrer un sous-arbre seulement.

#### Relations de cause à effet

- La hiérarchie est figée à quatre niveaux. Un client qui a cinq niveaux ne peut pas se représenter, et contourne par des conventions de nommage.
- L'administration est globale au tenant. Un directeur de filiale ne peut pas gérer ses utilisateurs sans accéder à tout.
- Les réglages sont définis seulement au niveau du tenant. Chaque filiale ne peut pas avoir sa langue ou ses règles propres.

#### Idées reçues

- **« Chaque niveau est une frontière de sécurité. »** Non. Seul le tenant l'est par construction. Les autres niveaux délimitent des droits, mais restent dans la même frontière d'isolation.
- **« Une personne appartient à un seul niveau. »** Non. Une personne peut appartenir à plusieurs équipes ou unités ; la structure est souvent une matrice.
- **« Les niveaux du plan sont universels. »** Ils sont un modèle de départ : les clients nomment et utilisent les niveaux à leur façon.

#### Principe clé

Un seul niveau isole (le tenant) ; les autres organisent. La hiérarchie sert à déléguer, à hériter et à agréger.

#### Si vous ne retenez que trois choses

1. Plateforme, tenant, organisation, unité d'affaires, équipe, utilisateur forment la hiérarchie de référence.
2. Seul le tenant est une frontière d'isolation ; les niveaux inférieurs structurent l'administration et les droits.
3. Une hiérarchie générique, avec des nœuds typés, convient mieux qu'une structure figée.

### 3. Explication technique détaillée

#### Les six niveaux

| Niveau | Question | Exemple | Isole ? | Administré par |
|---|---|---|---|---|
| Plateforme | Qui exploite le service ? | Le fournisseur | Entre tenants | Opérateurs du fournisseur |
| Tenant | Qui est le client ? | La compagnie | Oui | Administrateur du tenant |
| Organisation | Quelle entité ? | Filiale Nord | Non, structure | Directeur de filiale |
| Unité d'affaires | Quelle activité ? | Maintenance | Non, structure | Responsable d'activité |
| Équipe | Quelles personnes travaillent ensemble ? | Ligne Lyon | Non, structure | Chef d'équipe |
| Utilisateur | Qui agit ? | Mathilde | n/a | Elle-même, et ses responsables |

#### Un modèle générique

```sql
CREATE TABLE org_unit (
  tenant_id uuid NOT NULL,
  id        uuid NOT NULL,
  parent_id uuid,                        -- null pour la racine du tenant
  type      text NOT NULL,               -- 'organization', 'business_unit', 'team', ou type défini par le client
  name      text NOT NULL,
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, parent_id) REFERENCES org_unit (tenant_id, id)
);

CREATE TABLE org_membership (
  tenant_id   uuid NOT NULL,
  org_unit_id uuid NOT NULL,
  user_id     uuid NOT NULL,
  role        text NOT NULL,
  PRIMARY KEY (tenant_id, org_unit_id, user_id)
);
```

**Comment cela fonctionne.** La table `org_unit` stocke un arbre dont les nœuds ont un type. Un client peut définir ses propres types (« région », « atelier »). Les personnes sont rattachées par des appartenances, plusieurs possibles.

**Pourquoi cette forme.** Elle évite de figer le nombre de niveaux, et permet de rattacher une branche à un autre parent lors d'une réorganisation (voir [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie)).

#### La délégation par sous-arbre

Un rôle attribué avec la portée d'un nœud s'applique à ce nœud et à ses descendants (voir [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles)).

```text
(Karim, Administrateur d'organisation, portée = Filiale Nord)
 → peut gérer utilisateurs et réglages de Filiale Nord et de tout ce qu'elle contient
 → ne peut pas agir sur Filiale Sud
```

#### Les réglages en cascade

Un réglage défini au niveau du tenant s'applique par défaut aux niveaux inférieurs, qui peuvent le redéfinir (voir [5.7 Configuration et personnalisation au niveau du tenant](#57-configuration-et-personnalisation-au-niveau-du-tenant)).

| Niveau | Réglage « langue » | Effet pour la Filiale Sud |
|---|---|---|
| Tenant | français | français |
| Filiale Sud | espagnol | espagnol |
| Équipe Ligne Madrid | (non défini) | espagnol, hérité de la filiale |

#### Les appartenances multiples

Une personne appartient à plusieurs nœuds (une équipe de maintenance et un groupe de travail transversal). Le modèle d'appartenance doit le permettre, et les règles d'accès doivent préciser comment les droits se combinent (cumul, ou nœud actif).

**Contre-exemple.** Trois colonnes `organization_id`, `division_id`, `team_id` dans chaque table. Un client qui a un niveau de plus, ou une équipe rattachée directement à l'organisation, doit déformer son modèle.

**Limites.** Une hiérarchie générique rend certaines requêtes plus coûteuses (parcours d'arbre). On compense par des chemins matérialisés ou une table de fermeture. Par ailleurs, une hiérarchie trop souple est difficile à rendre lisible pour l'utilisateur.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.3 Compte, organisation et espace de travail](01-architecture-saas.md#13-compte-organisation-et-espace-de-travail) | Compte, organisation et espace de travail précisent les mots employés |
| [2.7 Hiérarchie](02-donnees-ressources.md#27-hiérarchie) | La hiérarchie d'entreprise est une hiérarchie au sens du modèle de données |
| [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation) | Les groupes et équipes sont des constructions d'identité |
| [4.20 Héritage de permissions et hiérarchie de rôles](04-identite-iam-autorisation.md#420-héritage-de-permissions-et-hiérarchie-de-rôles) | Les droits et les réglages héritent le long de la hiérarchie |
| [5.7 Configuration et personnalisation au niveau du tenant](#57-configuration-et-personnalisation-au-niveau-du-tenant) | La configuration se résout en cascade |
| [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès) | L'administration déléguée s'exerce dans l'interface d'administration |

### 5. Application pratique

**Situation initiale.** La compagnie aérienne a deux filiales. Chacune veut gérer ses utilisateurs et ses rôles de façon autonome, avec un responsable propre.

**Problème.** Un seul administrateur de tenant ne peut pas être sollicité à chaque ajout d'un technicien, et les deux filiales ne doivent pas se voir mutuellement.

**Application du concept.** Deux nœuds « organisation » sont créés sous le tenant, avec une administration déléguée.

**Déroulé.**

1. L'administrateur du tenant crée « Filiale Nord » et « Filiale Sud ».
2. Il attribue à chaque directeur le rôle d'administrateur d'organisation, avec pour portée sa filiale.
3. Le directeur Nord crée ses unités d'affaires et invite ses équipes.
4. Les ressources créées par la Filiale Nord sont rattachées à son nœud.

**Résultat.** Chaque filiale s'administre seule. Le tenant conserve une vision consolidée.

**Limites.** Si les deux filiales partagent des aéronefs, il faut décider quelle filiale en est responsable, ou introduire un nœud commun. Si l'isolation entre filiales est contractuellement stricte, une séparation en tenants est préférable.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les six niveaux de la hiérarchie de référence ?
2. **Compréhension.** Quel niveau est la frontière d'isolation ?
3. **Compréhension.** Qu'est-ce que l'administration déléguée ?
4. **Pourquoi.** Pourquoi préfère-t-on une hiérarchie générique à des colonnes fixes ?
5. **Raisonnement pratique.** Une personne travaille pour deux équipes de deux unités. Comment la représenter ?

#### Réponses

1. Plateforme, tenant, organisation, unité d'affaires, équipe, utilisateur.
2. Le tenant.
3. Le fait qu'un responsable administre seulement un sous-arbre (par exemple une filiale), sans accès aux autres branches.
4. Pour accepter des structures de profondeur et de noms variables, et permettre les réorganisations sans changer le schéma.
5. Par deux appartenances distinctes (une par équipe), avec un modèle de droits qui précise comment elles se combinent.

## 5.2 Isolation des tenants

### 1. Comprendre simplement

L'**isolation des tenants** (*tenant isolation*) est l'ensemble des mécanismes qui garantissent qu'un tenant **ne peut ni voir, ni modifier, ni perturber** les données et le fonctionnement d'un autre tenant, alors qu'ils partagent la même plateforme.

**Pourquoi cela existe.** La confiance est la condition de l'existence d'une plateforme multi-clients. Un client qui apprend qu'un autre a pu voir ses données la quitte, souvent en engageant une procédure. Une seule fuite d'isolation est un risque d'entreprise.

**Problème résolu.** Donner à chaque tenant l'assurance d'être seul chez lui, même sur une infrastructure partagée.

**Modèle mental.** Les compartiments d'un navire. Chaque compartiment est étanche : une voie d'eau dans l'un ne coule pas le bateau. Plus les cloisons sont nombreuses et solides, plus l'impact d'une avarie est limité.

**Où l'analogie s'arrête.** Les cloisons d'un navire sont physiques. Ici, elles sont faites de code, de configuration et de contrôles : chacune peut avoir un défaut invisible tant qu'on ne l'a pas testée.

**Exemple.** Une recherche « autocomplétion » qui suggère des immatriculations d'aéronefs de tous les tenants : le filtre de tenant a été oublié dans l'index de recherche, alors qu'il était présent dans la base.

**Les dimensions de l'isolation.**

1. **données** (lecture et écriture) ;
2. **performance** (consommation de ressources) ;
3. **configuration** et **identité** ;
4. **chiffrement** et **clés** ;
5. **exploitation** (journaux, sauvegardes, support).

**Objectif d'apprentissage :** vous pouvez lister les couches où l'isolation doit être appliquée et décrire comment on vérifie qu'elle tient.

### 2. Connaissances essentielles

#### Définition

L'**isolation des tenants** est la propriété d'un système multi-tenant selon laquelle les données, la configuration, les identités et les ressources de chaque tenant sont inaccessibles et imperméables aux actions des autres tenants, sauf mécanisme explicite et contrôlé.

#### Idées fondamentales

1. **L'isolation est appliquée en couches.** Application, base, stockage, cache, file, index, réseau.
2. **Une seule couche ne suffit pas.** La défense en profondeur compense l'oubli d'un contrôle.
3. **Elle concerne aussi les performances.** Un tenant ne doit pas dégrader les autres.
4. **Elle se teste.** Par des tests automatisés qui tentent des accès inter-tenants.
5. **La plupart des fuites viennent d'un chemin oublié.** Recherche, export, tâche de fond, outil de support.
6. **Le rayon d'impact se limite par construction.** Cellules, partitionnement par tenant.

#### Vocabulaire essentiel

- **Rayon d'impact** (*blast radius*) : étendue des dégâts d'une défaillance.
- **Voisin bruyant** (*noisy neighbor*) : tenant qui épuise des ressources partagées.
- **Cloisonnement** (*bulkhead*) : séparation de ressources pour contenir une défaillance.
- **Cellule** (*cell*) : réplique indépendante de la pile, hébergeant un sous-ensemble de tenants.
- **Fuite entre tenants** (*cross-tenant leak*) : exposition de données d'un tenant à un autre.
- **Défense en profondeur** (*defense in depth*) : plusieurs barrières indépendantes.

#### Relations de cause à effet

- Une couche (cache, index de recherche) n'est pas partitionnée par tenant. Elle devient le chemin de fuite, même si la base est bien protégée.
- Les files de tâches sont communes à tous les tenants. Un tenant qui lance un énorme import retarde les tâches de tous les autres.
- Les outils de support contournent le filtre de tenant « pour aller plus vite ». Ils deviennent la voie d'accès la plus dangereuse.

#### Idées reçues

- **« L'isolation, c'est le filtre sur `tenant_id`. »** Non. C'est un des mécanismes. Les caches, les files, les index, les fichiers, les journaux et les sauvegardes demandent chacun le leur.
- **« Les tests fonctionnels détectent les fuites. »** Pas par défaut : ils vérifient ce que l'on voit, rarement ce que l'on ne devrait pas voir. Il faut des tests dédiés.
- **« Isolation forte signifie bases séparées. »** Pas seulement. Une base séparée isole les données, mais pas les clés, les files, les index ni les opérations.

#### Principe clé

Chaque couche qui stocke ou traite des données porte sa propre barrière de tenant, et chaque barrière est testée.

#### Si vous ne retenez que trois choses

1. L'isolation doit être appliquée à chaque couche : application, base, stockage, cache, file, index.
2. Les fuites viennent surtout d'un chemin oublié ; seuls des tests dédiés les trouvent.
3. L'isolation concerne aussi les performances (voisin bruyant) et l'exploitation (support, journaux).

### 3. Explication technique détaillée

#### Les couches et leur mécanisme

| Couche | Risque | Mécanisme d'isolation |
|---|---|---|
| Application | Requête sans filtre de tenant | Contexte de tenant obligatoire, dépôts qui l'exigent |
| Base de données | Filtre oublié | Sécurité de ligne, schéma ou base séparés (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) |
| Stockage de fichiers | Chemin deviné | Préfixe par tenant, politiques d'accès, URLs signées à durée limitée |
| Cache | Clé partagée | Tenant dans chaque clé |
| Files et tâches | Mélange de tenants, voisin bruyant | Attribut de tenant sur chaque message, files ou quotas par tenant |
| Index de recherche | Résultats croisés | Index par tenant ou filtre systématique |
| Journaux et métriques | Données d'un tenant dans les journaux d'un autre | Étiquette de tenant, accès filtré |
| Chiffrement | Clé commune | Clés par tenant (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) |
| Support et opérations | Accès large des opérateurs | Accès temporaire, tracé, consenti (voir [5.9 Administration inter-tenants](#59-administration-inter-tenants)) |

#### L'isolation des performances

| Technique | Principe |
|---|---|
| Quotas et limitation de débit | Plafonner la consommation par tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) |
| Files équitables | Chaque tenant a sa part de traitement |
| Cloisonnement des ressources | Pools de connexions ou de tâches séparés par catégorie de tenant |
| Cellules | Groupes de tenants sur des piles indépendantes |

#### Le rayon d'impact des cellules

Si la plateforme est répartie en $N$ cellules, avec les tenants répartis uniformément, une défaillance d'une cellule touche une fraction :

$$\text{rayon d'impact} = \frac{1}{N}$$

**Exemple chiffré.** Avec 20 cellules, un incident dans une cellule touche environ 5 % des tenants. Avec une seule pile, il touche 100 %.

#### Tester l'isolation

| Test | Description |
|---|---|
| Accès croisé par identifiant | Avec les identifiants du tenant A, demander une ressource du tenant B sur chaque point d'accès : on attend un refus (ou un `404`) |
| Test de chaque chemin | Liste, détail, recherche, export, API, webhooks, fichiers |
| Tâches de fond | Vérifier que chaque tâche porte son contexte de tenant |
| Données de test croisées | Même valeur (immatriculation) dans deux tenants, contrôler l'absence de mélange |
| Analyse du code | Règle qui interdit les requêtes sur des tables de tenant sans contexte |
| Test d'intrusion | Tentatives manuelles par des experts |

**Contre-exemple.** Un index de recherche partagé par tous les tenants, avec un filtre de tenant appliqué seulement sur les résultats détaillés. L'autocomplétion, qui lit directement l'index, expose les valeurs des autres tenants.

**Limites.** L'isolation parfaite n'existe pas. Elle se mesure par des garanties documentées, des tests, une architecture limitant l'impact, et une capacité de détection et de réaction rapide.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Reprend et détaille les dimensions d'isolation |
| [5.3 Contexte de tenant](#53-contexte-de-tenant) | Le contexte de tenant est le point d'appui de toutes les barrières |
| [5.4 Modèles d'architecture multi-tenant](#54-modèles-darchitecture-multi-tenant) | Le modèle d'architecture détermine la force de l'isolation des données |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | La sécurité de ligne renforce l'isolation dans la base |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les quotas isolent les performances |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces identifie les chemins de fuite |

### 5. Application pratique

**Situation initiale.** Un test d'intrusion révèle que la fonction d'export CSV d'un tenant peut, en modifiant un paramètre, retourner des lignes d'un autre tenant.

**Problème.** L'export utilise un chemin de lecture différent de celui de l'API, sans le filtre de tenant.

**Application du concept.** On ajoute une barrière dans la base et une suite de tests croisés.

**Déroulé.**

1. L'équipe active la sécurité de ligne sur les tables sensibles : le contexte est fixé par transaction.
2. Elle retire le code d'export qui contournait les dépôts, et le fait passer par le même moteur.
3. Elle ajoute un test automatique qui, pour chaque point d'accès, tente un accès croisé.
4. Elle ajoute une alerte en cas de tentative de lecture hors contexte.

**Résultat.** La fuite est corrigée à deux niveaux, et de nouveaux chemins ne pourront pas la réintroduire sans que les tests échouent.

**Limites.** Les tests couvrent les points d'accès connus. Chaque nouvelle fonction doit être ajoutée à la suite, ce qui exige une règle d'équipe et un contrôle en revue.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez cinq couches où l'isolation doit être appliquée.
2. **Compréhension.** Qu'est-ce que le voisin bruyant ?
3. **Compréhension.** Que mesure le rayon d'impact ?
4. **Pourquoi.** Pourquoi une barrière unique ne suffit-elle pas ?
5. **Raisonnement pratique.** Comment tester qu'une nouvelle fonction de recherche respecte l'isolation ?

#### Réponses

1. Par exemple : application, base de données, stockage de fichiers, cache, files de tâches, index de recherche, journaux, chiffrement.
2. Un tenant dont la consommation de ressources partagées dégrade le service des autres.
3. L'étendue des dégâts d'une défaillance, par exemple la proportion de tenants touchés.
4. Parce qu'un chemin oublié ou une erreur de code peut contourner la barrière : plusieurs barrières indépendantes limitent le risque.
5. Avec deux tenants ayant des données voisines, rechercher avec les identifiants du premier et vérifier qu'aucun résultat du second n'apparaît, pour la recherche, l'autocomplétion et l'export.

## 5.3 Contexte de tenant

### 1. Comprendre simplement

Le **contexte de tenant** (*tenant context*) est l'information, attachée à chaque requête, qui indique **pour quel tenant** le système travaille. Il accompagne la requête de la porte d'entrée jusqu'à la dernière écriture, y compris dans les tâches de fond et les appels entre services.

**Pourquoi cela existe.** Le système sert de nombreux tenants avec le même code. Pour chaque opération, il doit savoir sur quelles données travailler. Sans contexte fiable, soit il ne sait pas, soit il se trompe.

**Problème résolu.** Garantir que chaque opération s'exécute pour le bon tenant, et uniquement lui.

**Modèle mental.** Le badge porté par un employé d'un prestataire dans un immeuble partagé. Chaque porte vérifie le badge : il indique pour quelle société la personne travaille.

**Où l'analogie s'arrête.** Un badge est présenté physiquement à chaque porte. Dans un système, c'est un objet logiciel qui doit être transmis explicitement à chaque couche, et qui peut être perdu ou remplacé par erreur.

**Exemple.** Une requête arrive sur `compagnie.platform.example`. Le système en déduit le tenant, vérifie que l'utilisateur authentifié en fait partie, puis fixe ce contexte pour toute la suite.

**Les composants.**

1. la **résolution** : d'où vient le tenant ;
2. la **vérification** : l'appelant appartient-il à ce tenant ;
3. la **propagation** : comment il traverse le système ;
4. l'**application** : comment chaque couche l'exige.

**Objectif d'apprentissage :** vous pouvez décrire d'où vient le contexte de tenant, et expliquer pourquoi il ne doit jamais être pris tel quel dans une donnée fournie par le client.

### 2. Connaissances essentielles

#### Définition

Le **contexte de tenant** est l'ensemble des informations (identifiant du tenant, et souvent son offre, sa région, sa version de configuration) qui qualifient une requête et dont toutes les couches du système dépendent pour appliquer l'isolation et le comportement propres au tenant.

#### Idées fondamentales

1. **Il est établi à l'entrée.** À partir de l'identité authentifiée ou d'une information vérifiée.
2. **Il n'est pas fourni librement par le client.** Un en-tête libre est une donnée à vérifier.
3. **Il est propagé explicitement.** Dans le processus, entre services, dans les messages.
4. **Chaque couche l'exige.** Une opération sans contexte échoue plutôt que d'agir sur tous les tenants.
5. **Il est présent partout dans les traces.** Journaux, métriques, traces.
6. **Changer de tenant est une opération contrôlée.** Une personne qui appartient à deux tenants doit être ré-autorisée.

#### Vocabulaire essentiel

- **Résolution de tenant** (*tenant resolution*) : détermination du tenant d'une requête.
- **Sous-domaine** (*subdomain*) : `compagnie.platform.example` identifie un tenant.
- **Revendication de tenant** (*tenant claim*) : valeur du tenant dans un jeton.
- **Propagation de contexte** (*context propagation*) : transmission du contexte entre composants.
- **Contexte local** (*request-scoped context*) : contexte attaché à la requête en cours.
- **Échec fermé** (*fail closed*) : en l'absence de contexte, l'opération est refusée.

#### Relations de cause à effet

- Le tenant est lu dans un en-tête fourni par le client. Un utilisateur du tenant A peut y mettre le tenant B.
- Une tâche de fond est lancée sans le contexte. Elle s'exécute pour « aucun tenant » ou pour le dernier tenant mémorisé.
- Un singleton mémorise le dernier tenant. Deux requêtes simultanées mélangent leurs contextes.

#### Idées reçues

- **« Le sous-domaine suffit à identifier le tenant de façon sûre. »** Il l'indique, mais il faut vérifier que l'utilisateur authentifié appartient bien à ce tenant.
- **« Le contexte, c'est un paramètre de plus. »** C'est un invariant : son absence ne doit jamais être silencieusement remplacée par une valeur par défaut.
- **« Le contexte est seulement utile à la base de données. »** Il est aussi nécessaire pour les caches, les files, les fichiers, les journaux et les clés.

#### Principe clé

Le tenant est établi à partir d'une identité vérifiée, propagé explicitement, et exigé par chaque couche, en refusant d'agir sans lui.

#### Si vous ne retenez que trois choses

1. Le contexte de tenant dit pour qui on travaille ; il vient d'une source vérifiée.
2. Il est propagé partout, y compris dans les tâches de fond et entre services.
3. Son absence produit un échec, jamais une valeur par défaut.

### 3. Explication technique détaillée

#### Les stratégies de résolution

| Source | Exemple | Avantage | Précaution |
|---|---|---|---|
| Sous-domaine | `compagnie.platform.example` | Lisible, marque propre | Vérifier l'appartenance de l'utilisateur |
| Chemin | `/t/compagnie/aircraft` | Simple | Idem |
| Revendication du jeton | `tenant_id` dans le JWT | Fiable, signé | Gérer le changement de tenant |
| Clé d'API | La clé est liée à un tenant | Naturel pour les services | La clé détermine seule le tenant |
| Domaine de courriel (SSO) | `@compagnie.example` | Découverte à la connexion | Réservé à la phase de connexion |
| En-tête personnalisé | `X-Tenant-ID: ten_42` | Souple | **Jamais seul** : à comparer à l'identité |

#### Le cheminement

```text
Requête
   │
   ▼
1. Résolution       tenant candidat (sous-domaine, jeton, clé)
   │
   ▼
2. Authentification identité de l'appelant
   │
   ▼
3. Vérification     l'appelant appartient-il à ce tenant ? sinon : refus
   │
   ▼
4. Contexte fixé    { tenant_id, user_id, plan, région, ... }
   │
   ▼
5. Propagation      application, base, cache, file, journaux, appels sortants
```

#### Propagation dans le code

```typescript
// Le contexte est obligatoire : son absence lève une erreur
const ctx = TenantContext.require();

const rows = await db.query(
  "SELECT * FROM aircraft WHERE tenant_id = $1 AND id = $2",
  [ctx.tenantId, aircraftId],
);
```

```typescript
// Une tâche de fond reçoit explicitement le contexte avec ses données
await queue.publish("aircraft.import", {
  tenantId: ctx.tenantId,           // attaché à chaque message
  fileId,
});
```

#### Propagation entre services et dans la base

- **Entre services** : le contexte voyage dans un jeton signé ou des métadonnées d'appel, vérifiés par le service appelé.
- **Dans la base** : le contexte est fixé par transaction (`SET LOCAL app.tenant_id = …`) pour la sécurité de ligne (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- **Dans les journaux** : chaque ligne porte le tenant pour le diagnostic et pour l'audit.

#### Le changement de tenant

Une personne qui appartient à deux tenants (par exemple un consultant) change de contexte explicitement : elle choisit le tenant, la plateforme vérifie l'appartenance, émet un nouveau jeton pour ce tenant, et journalise le changement. Un jeton n'est valable que pour un tenant à la fois.

#### Modes de défaillance

- **Contexte perdu** à la frontière asynchrone : file, minuteur, pool de threads.
- **Contexte remplacé par un défaut** : « tenant par défaut » en développement qui reste en production.
- **Contexte mélangé** : variable globale ou statique mémorisant le tenant.
- **Contexte non vérifié** : en-tête utilisé sans comparaison avec l'identité.

**Contre-exemple.** Une fonction utilitaire qui lit « le tenant courant » dans une variable globale, mise à jour au début de chaque requête. Sous charge, deux requêtes simultanées écrasent mutuellement la valeur, et une écriture est attribuée au mauvais tenant.

**Limites.** Un contexte propagé à tous les niveaux alourdit le code et exige de la discipline. Des cadres logiciels qui l'injectent automatiquement et des vérifications automatiques en revue de code réduisent le risque d'oubli.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Le tenant est l'unité que le contexte désigne |
| [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton) | Le jeton porte souvent la revendication de tenant |
| [5.2 Isolation des tenants](#52-isolation-des-tenants) | Toutes les barrières d'isolation s'appuient sur le contexte |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | La sécurité de ligne reçoit le contexte par transaction |
| [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | Les messages doivent porter le tenant |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Les journaux et traces doivent être étiquetés par tenant |

### 5. Application pratique

**Situation initiale.** La plateforme lance chaque nuit un traitement de recalcul des échéances d'inspection pour tous les tenants.

**Problème.** Le traitement itère sur les tenants, mais certaines fonctions utilisées lisent un « tenant courant » global, qui n'est pas fixé dans ce contexte.

**Application du concept.** Le traitement crée explicitement un contexte pour chaque tenant, et les dépôts refusent de travailler sans contexte.

**Déroulé.**

1. Le traitement liste les tenants actifs.
2. Pour chacun, il ouvre un contexte (`TenantContext.run(tenant, …)`).
3. Les accès aux données exigent le contexte ; une fonction qui lit un état global échoue.
4. Les résultats sont journalisés avec le tenant.

**Résultat.** Aucun calcul ne s'exécute sans tenant, et les erreurs de contexte sont détectées dès les tests.

**Limites.** Une tâche très longue qui traite de nombreux tenants doit se découper par tenant, pour que l'échec ou la lenteur d'un tenant n'affecte pas les autres.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient le contexte de tenant ?
2. **Compréhension.** Citez trois façons de déterminer le tenant d'une requête.
3. **Compréhension.** Pourquoi un en-tête de tenant fourni par le client doit-il être vérifié ?
4. **Pourquoi.** Pourquoi le contexte doit-il être exigé et non remplacé par une valeur par défaut ?
5. **Raisonnement pratique.** Une tâche de fond traite des fichiers importés. Comment s'assurer qu'elle travaille pour le bon tenant ?

#### Réponses

1. Au minimum l'identifiant du tenant ; souvent aussi son offre, sa région et sa version de configuration.
2. Par exemple : le sous-domaine, une revendication du jeton, la clé d'API.
3. Parce qu'un utilisateur peut y mettre le tenant d'un autre : il faut le comparer à l'identité authentifiée.
4. Parce qu'une valeur par défaut ferait agir silencieusement sur le mauvais tenant ou sur tous les tenants ; un échec explicite est préférable.
5. En attachant le tenant au message ou à la tâche dès sa création, et en exigeant que le traitement ouvre un contexte à partir de cette valeur.

## 5.4 Modèles d'architecture multi-tenant

### 1. Comprendre simplement

Il existe plusieurs façons de ranger les données de nombreux tenants dans des bases de données. Quatre variantes dominent, de la plus partagée à la plus isolée : **une base partagée avec un schéma partagé** (*shared database, shared schema*), **une base partagée avec un schéma séparé par tenant** (*shared database, separate schema*), **une base séparée par tenant** (*separate database*), et, au bout du spectre, **une pile entièrement dédiée**.

**Pourquoi cela existe.** Le partage réduit les coûts mais affaiblit l'isolation et la souplesse. L'isolation renforce la sécurité et la personnalisation mais multiplie les coûts d'exploitation. Aucune option n'est meilleure partout.

**Problème résolu.** Choisir un compromis explicite entre coût, isolation, souplesse et simplicité d'exploitation.

**Modèle mental.** Des logements.

- *Schéma partagé* : un dortoir. Tout le monde partage la salle, chacun a un casier avec son nom.
- *Schéma séparé* : une résidence. Un même immeuble, chacun son appartement.
- *Base séparée* : des maisons individuelles dans un lotissement.
- *Pile dédiée* : une propriété avec son propre terrain.

**Où l'analogie s'arrête.** Les logements ont des murs physiques. Ici, la force des cloisons dépend de la configuration, et un défaut de l'infrastructure partagée (le moteur de base de données lui-même) affecte tous les « logements » d'un même serveur.

**Exemple.** Mille petits clubs d'aviation utilisent la plateforme. Une compagnie nationale, soumise à une réglementation stricte, exige un environnement dédié.

**Les quatre modèles.**

1. **Schéma partagé** : toutes les tables communes, avec une colonne `tenant_id`.
2. **Schéma séparé** : une base, un schéma par tenant.
3. **Base séparée** : une base par tenant.
4. **Pile dédiée** : application et base séparées pour un tenant.

**Objectif d'apprentissage :** vous pouvez comparer les quatre modèles selon cinq critères et choisir celui qui convient à un profil de tenant.

### 2. Connaissances essentielles

#### Définition

- **Base partagée, schéma partagé** (*shared database, shared schema*) : tous les tenants partagent les mêmes tables, distingués par un identifiant de tenant.
- **Base partagée, schéma séparé** (*shared database, separate schema*) : tous les tenants partagent une base, chacun a son propre schéma de tables.
- **Base séparée** (*separate database*) : chaque tenant a sa propre base de données.
- **Pile dédiée** : chaque tenant dispose de sa propre instance de l'application et de ses données.

Attention : dans PostgreSQL, « schéma » désigne un espace de noms qui regroupe des tables. C'est ce sens qui est employé ici.

#### Idées fondamentales

1. **Plus on partage, moins on paie.** Le coût par tenant baisse avec la mutualisation.
2. **Plus on sépare, plus l'isolation est forte.** Et plus la personnalisation est facile.
3. **L'exploitation croît avec la séparation.** Migrations, sauvegardes, surveillance par tenant.
4. **Le nombre de tenants limite le modèle.** Des milliers de schémas ou de bases deviennent difficiles à gérer.
5. **Le modèle conditionne la conformité.** Certaines exigences imposent des données séparées.
6. **Le modèle peut varier par tenant.** C'est le modèle hybride (voir [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride)).

#### Vocabulaire essentiel

- **Mutualisation** (*pooling*) : partage des ressources entre tenants.
- **Silo** : ressources dédiées à un tenant.
- **Pont** (*bridge*) : modèle intermédiaire, avec partage de certaines couches et isolement d'autres.
- **Partitionnement par tenant** (*tenant sharding*) : répartition des tenants sur plusieurs bases.
- **Annuaire de tenants** (*tenant catalog*) : registre qui associe chaque tenant à son emplacement.
- **Migration de schéma** (*schema migration*) : modification de la structure des tables.

#### Relations de cause à effet

- Les tables sont partagées. Une migration s'applique une fois pour tous : simple, mais un échec touche tous les tenants.
- Un schéma par tenant. La migration doit s'appliquer des milliers de fois, et la durée croît avec le nombre de tenants.
- Une base par tenant. L'isolation est forte, mais le nombre de connexions et de bases à surveiller croît avec les tenants.

#### Idées reçues

- **« Schéma partagé est peu sûr. »** Pas forcément : avec des clés composites, une sécurité de ligne et des tests, il peut être très robuste. Mais la rigueur demandée est plus élevée.
- **« Une base par tenant règle tous les problèmes d'isolation. »** Non. Les files, les caches, les index, les clés et les opérations restent à isoler.
- **« On choisit un modèle une fois pour toutes. »** Non. Beaucoup de plateformes en combinent plusieurs et déplacent des tenants entre eux.

#### Principe clé

Partagez par défaut pour le coût, séparez quand une exigence d'isolation, de performance ou de conformité le justifie.

#### Si vous ne retenez que trois choses

1. Quatre modèles existent, du plus partagé (schéma partagé) au plus isolé (pile dédiée).
2. Le choix arbitre coût, isolation, souplesse et charge d'exploitation.
3. Le nombre de tenants et leurs exigences déterminent le modèle, et il peut varier par tenant.

### 3. Explication technique détaillée

#### Le schéma partagé

```sql
CREATE TABLE aircraft (
  tenant_id uuid NOT NULL,
  id        uuid NOT NULL,
  ...,
  PRIMARY KEY (tenant_id, id)
);
-- Toutes les requêtes filtrent sur tenant_id ; la sécurité de ligne en est la sûreté.
```

#### Le schéma séparé

```sql
CREATE SCHEMA tenant_airline_01;
CREATE TABLE tenant_airline_01.aircraft ( ... );

-- À chaque requête, le chemin de recherche désigne le schéma du tenant
SET LOCAL search_path = tenant_airline_01;
```

#### La base séparée

```text
Annuaire de tenants
  tenant_airline_01  ──►  postgres://db-17/airline_01
  tenant_hospital_02 ──►  postgres://db-17/hospital_02
  tenant_factory_03  ──►  postgres://db-22/factory_03
```

L'application consulte l'annuaire pour obtenir la connexion du tenant courant.

#### Comparaison

| Critère | Schéma partagé | Schéma séparé | Base séparée | Pile dédiée |
|---|---|---|---|---|
| Coût par tenant | Très faible | Faible | Moyen | Élevé |
| Isolation des données | Logique (à garantir) | Meilleure | Forte | Très forte |
| Isolation des performances | Faible | Faible | Moyenne | Forte |
| Nombre de tenants praticable | Très élevé | Quelques milliers | Quelques centaines à milliers | Dizaines à centaines |
| Migrations | Une fois | Une par tenant | Une par tenant | Une par pile |
| Sauvegarde et restauration d'un tenant | Difficile | Possible | Simple | Simple |
| Personnalisation du modèle | Via champs dynamiques | Possible | Possible | Totale |
| Analyse inter-tenants | Simple | Complexe | Complexe | Très complexe |
| Conformité (données séparées) | Difficile | Partielle | Bonne | Très bonne |

Les ordres de grandeur du tableau sont indicatifs : ils dépendent du moteur de base de données, du matériel et des outils d'automatisation.

#### Ce que le nombre de tenants change

Avec 10 000 tenants et 50 tables chacun, le modèle à schéma séparé manipule 500 000 tables. Les catalogues de la base grossissent, les migrations se comptent en milliers d'exécutions, et la maintenance courante (nettoyage, statistiques) devient lourde. Le modèle à schéma partagé n'en manipule que 50.

#### Le partitionnement par tenant

Pour des volumes importants, le tenant sert de **clé de partitionnement** : les tenants sont répartis sur plusieurs bases (*shards*). Un annuaire indique où se trouve chacun, ce qui permet d'ajouter des bases et de déplacer des tenants (voir [5.10 Migration de tenant](#510-migration-de-tenant)).

#### Précautions du schéma partagé

- `tenant_id` dans **chaque** clé primaire, unicité et clé étrangère (voir [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère)).
- Sécurité de ligne (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).
- Index dont la première colonne est le tenant (voir [2.14 Index](02-donnees-ressources.md#214-index)).
- Procédure d'extraction des données d'un seul tenant, pour l'export et la sauvegarde.

**Contre-exemple.** Choisir « une base par tenant » pour 50 000 petits clients, par souci d'isolation, sans outils d'automatisation. L'équipe passe son temps à gérer des bases, et le coût par client rend l'offre non viable.

**Limites.** Chaque modèle a un coût caché. Le schéma partagé demande de la discipline permanente ; les modèles séparés demandent de l'automatisation poussée.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | Ces modèles sont les réalisations de la multi-tenancy |
| [5.2 Isolation des tenants](#52-isolation-des-tenants) | La force de l'isolation des données en dépend |
| [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride) | Le modèle hybride les combine |
| [5.10 Migration de tenant](#510-migration-de-tenant) | Le déplacement d'un tenant d'un modèle à un autre est une migration |
| [2.11 Clé primaire et clé étrangère](02-donnees-ressources.md#211-clé-primaire-et-clé-étrangère) | Les clés composites avec tenant sont la base du schéma partagé |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Les sauvegardes et restaurations par tenant en dépendent |

### 5. Application pratique

**Situation initiale.** La plateforme lance une offre « Club » (petits clients, 50 à 500 aéronefs) et une offre « Entreprise » (grandes compagnies, forte volumétrie, exigences contractuelles).

**Problème.** Un modèle unique ne convient pas à ces deux profils : l'un pèse sur les coûts, l'autre sur l'isolation.

**Application du concept.** Les tenants « Club » sont dans une base à schéma partagé ; les tenants « Entreprise » ont une base séparée.

**Déroulé.**

1. L'offre « Club » : création d'un tenant par simple insertion de lignes, en quelques secondes.
2. L'offre « Entreprise » : création d'une base, exécution des migrations, enregistrement dans l'annuaire.
3. Le code applicatif est le même : il obtient la connexion par l'annuaire.
4. L'équipe d'exploitation applique les migrations aux deux familles par un outil unique.

**Résultat.** Les petits clients restent économiques, les grands obtiennent l'isolation exigée.

**Limites.** Deux modèles à tester et à exploiter : il faut une automatisation solide et des tests qui couvrent les deux variantes (voir [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez les quatre modèles d'architecture multi-tenant.
2. **Compréhension.** Pourquoi les migrations sont-elles plus lourdes avec un schéma par tenant ?
3. **Compréhension.** À quoi sert l'annuaire de tenants ?
4. **Pourquoi.** Pourquoi le schéma partagé exige-t-il le tenant dans chaque clé ?
5. **Raisonnement pratique.** Une grande compagnie exige que ses données soient physiquement séparées de celles des autres. Quel modèle proposez-vous ?

#### Réponses

1. Schéma partagé, schéma séparé, base séparée, pile dédiée.
2. Parce que chaque migration doit être appliquée à chaque schéma : le nombre d'exécutions et la durée croissent avec le nombre de tenants.
3. À indiquer, pour chaque tenant, où se trouvent ses données (base, schéma, région), de sorte que l'application route chaque requête correctement.
4. Pour que l'unicité et les références restent dans le tenant, et que la base refuse les liens entre tenants.
5. Une base séparée, voire une pile dédiée si l'exigence porte aussi sur le calcul, les clés et les opérations.

## 5.5 Multi-tenancy hybride

### 1. Comprendre simplement

La **multi-tenancy hybride** (*hybrid tenancy*) combine plusieurs modèles d'architecture au sein d'une même plateforme : certains tenants sont **mutualisés**, d'autres **dédiés**. Chaque tenant est placé dans le modèle qui lui convient.

**Pourquoi cela existe.** Les clients ne se ressemblent pas. Les petits veulent un prix bas ; les grands ou les réglementés exigent de l'isolation, de la performance garantie ou des données séparées. Un modèle unique oblige à sacrifier l'un des deux.

**Problème résolu.** Servir économiquement la masse des petits clients tout en répondant aux exigences des gros, avec un seul produit.

**Modèle mental.** Un parc d'hébergement avec des chambres d'hôtel, des appartements et des villas. Même gestionnaire, même service, niveaux d'isolement différents selon le tarif.

**Où l'analogie s'arrête.** Les logements sont conçus séparément. Ici, le même produit doit fonctionner sur plusieurs modes d'hébergement, et un tenant peut passer de l'un à l'autre.

**Exemple.** Les clubs sont dans une base partagée. Une compagnie nationale a une base dédiée dans une région précise. Une usine a une cellule entière, avec ses propres files et ses propres clés.

**Les composants.**

1. un **annuaire de tenants** qui décrit l'emplacement de chacun ;
2. un **routeur** qui oriente chaque requête ;
3. des **modèles de placement** (mutualisé, base dédiée, cellule) ;
4. des **outils uniformes** (provisionnement, migration, supervision).

**Objectif d'apprentissage :** vous pouvez décrire comment une plateforme héberge plusieurs modèles avec un seul code, et à quelles conditions déplacer un tenant d'un modèle à l'autre.

### 2. Connaissances essentielles

#### Définition

La **multi-tenancy hybride** est une architecture dans laquelle la plateforme supporte simultanément plusieurs niveaux de mutualisation ou d'isolation, un tenant étant affecté à l'un d'eux selon ses besoins, son offre ou ses contraintes.

#### Idées fondamentales

1. **Un seul code, plusieurs placements.** L'application ignore le modèle ; elle obtient sa connexion de l'annuaire.
2. **Le placement est une donnée du tenant.** Il peut changer.
3. **Le niveau de service suit l'offre.** L'isolation dédiée est souvent une option payante.
4. **L'automatisation est indispensable.** Sans elle, chaque tenant dédié devient un cas particulier à la main.
5. **Les cellules limitent le rayon d'impact.** On ajoute des cellules pour croître.
6. **La complexité de test augmente.** Chaque placement doit être couvert.

#### Vocabulaire essentiel

- **Placement** (*placement*) : emplacement et mode d'hébergement d'un tenant.
- **Annuaire de tenants** (*tenant catalog*, *tenant directory*) : registre des tenants et de leur placement.
- **Cellule** (*cell*) : pile complète et indépendante qui héberge un sous-ensemble de tenants.
- **Promotion** : passage d'un tenant d'un placement mutualisé à un placement dédié.
- **Flocon de neige** (*snowflake*) : tenant configuré à la main, différent de tous les autres.
- **Routage** (*routing*) : orientation d'une requête vers le bon placement.

#### Relations de cause à effet

- Chaque tenant dédié est configuré à la main. L'exploitation est ingérable au-delà de quelques dizaines : il faut des modèles automatisés.
- Les cellules évoluent à des vitesses différentes. Des tenants voient des versions différentes du produit : il faut une politique de versions.
- Un tenant mutualisé devient très gros. Il dégrade ses voisins : on le déplace vers un placement dédié.

#### Idées reçues

- **« Hybride veut dire plus complexe, donc à éviter. »** C'est vrai du coût d'exploitation, mais c'est souvent la seule façon de répondre à la fois à des petits et à des grands clients.
- **« Un tenant dédié est un cas particulier de code. »** Non : le même code s'exécute, seul le placement diffère.
- **« On décide du placement à la signature du contrat, une fois pour toutes. »** Non : les besoins changent, et il faut pouvoir déplacer un tenant.

#### Principe clé

Un seul produit, plusieurs placements décrits par des données : le routage et l'automatisation font la différence entre un hybride maîtrisé et un chaos de cas particuliers.

#### Si vous ne retenez que trois choses

1. L'hybride place chaque tenant dans le modèle qui lui convient, avec un seul code.
2. Un annuaire de tenants et un routeur rendent le placement transparent pour l'application.
3. L'automatisation et la possibilité de déplacer un tenant sont les conditions de sa maîtrise.

### 3. Explication technique détaillée

#### L'annuaire de tenants

```json
{
  "tenant": "airline-regional",
  "placement": {
    "model": "pooled",
    "shard": "pool-eu-3",
    "region": "eu-west",
    "version_channel": "stable"
  }
}
```

```json
{
  "tenant": "national-carrier",
  "placement": {
    "model": "dedicated_database",
    "database": "db-nc-01",
    "region": "eu-central",
    "version_channel": "stable",
    "encryption_key": "key-nc-01"
  }
}
```

**Comment les lire.** Le premier tenant est mutualisé sur le groupe `pool-eu-3`. Le second a sa propre base, dans une région précise, avec sa clé de chiffrement. L'application consulte cet annuaire (avec un cache) pour router.

#### Le routage

```text
Requête (tenant T)
   │
   ▼
Annuaire de tenants (avec cache)
   │  placement de T
   ▼
Fabrique de connexions
   ├── mutualisé        → pool partagé + sécurité de ligne
   ├── base dédiée      → base de T
   └── cellule dédiée   → pile de T
```

#### Les cellules

Une **cellule** est une copie complète et indépendante de la plateforme (application, base, files). Les tenants sont répartis entre cellules. Une défaillance reste confinée à une cellule, et la capacité s'ajoute en créant des cellules.

```text
          Routeur global (annuaire)
          ╱          │          ╲
   Cellule A     Cellule B     Cellule C
 (400 tenants) (400 tenants) (1 grand tenant)
```

#### La promotion d'un tenant

| Signal | Action |
|---|---|
| Un tenant consomme plus de X % d'une base partagée | Le déplacer vers une base dédiée |
| Exigence contractuelle ou réglementaire | Le placer dans une région ou une cellule dédiée |
| Offre supérieure souscrite | Provisionner le placement correspondant et migrer |
| Résiliation ou rétrogradation | Reconsolider dans le pool |

#### L'exemple d'un portefeuille de tenants

| Tenant | Taille | Exigences | Placement |
|---|---|---|---|
| Aéroclub A | 40 aéronefs | Aucune | Mutualisé, pool 3 |
| Compagnie régionale | 600 aéronefs | SLA standard | Mutualisé, pool 1 |
| Compagnie nationale | 8 000 aéronefs | Résidence des données, SLA renforcé | Base dédiée, région centrale |
| Usine | Données industrielles sensibles | Clés propres | Cellule dédiée |

#### Les coûts de l'hybride

- **Tests** : couvrir chaque modèle de placement.
- **Versions** : suivre quelle cellule exécute quelle version.
- **Observabilité** : agréger les métriques sur des placements divers.
- **Facturation** : refléter le coût réel de chaque placement.

**Contre-exemple.** Dix tenants « sur mesure » avec des configurations d'infrastructure différentes, déployées à la main. Chaque mise à jour est une opération individuelle, et personne ne sait ce qui tourne où.

**Limites.** L'hybride suppose que la plateforme sache déplacer un tenant d'un placement à l'autre sans perte, ce qui est un chantier à part entière (voir [5.10 Migration de tenant](#510-migration-de-tenant)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.4 Modèles d'architecture multi-tenant](#54-modèles-darchitecture-multi-tenant) | Les modèles d'architecture sont les « briques » de l'hybride |
| [5.10 Migration de tenant](#510-migration-de-tenant) | La migration de tenant permet de passer d'un placement à l'autre |
| [5.6 Provisionnement et cycle de vie d'un tenant](#56-provisionnement-et-cycle-de-vie-dun-tenant) | Le provisionnement dépend du placement choisi |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | L'offre souscrite détermine souvent le placement |
| [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) | Les exigences de reprise après sinistre peuvent différer par placement |
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | L'annuaire et le routeur relèvent du plan de contrôle |

### 5. Application pratique

**Situation initiale.** Un tenant de l'offre « Régionale » grossit : il importe désormais 40 millions de lignes de données de vol par an, et ses imports dégradent ses voisins.

**Problème.** Il est mutualisé. Le voisin bruyant gêne les autres, mais il ne justifie pas encore une offre « Entreprise ».

**Application du concept.** La plateforme le promeut vers un pool moins chargé, puis vers une base dédiée si la croissance se confirme.

**Déroulé.**

1. L'alerte de consommation signale le dépassement d'un seuil.
2. L'équipe provisionne un placement « base dédiée » dans la même région.
3. Une migration copie les données et bascule le routage à une heure convenue.
4. L'annuaire est mis à jour. L'application n'a pas changé.

**Résultat.** Le tenant bénéficie de ressources propres, et les autres retrouvent leurs performances.

**Limites.** Le coût de la base dédiée doit être répercuté dans l'offre, par un changement de plan ou un supplément.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que la multi-tenancy hybride ?
2. **Compréhension.** À quoi servent l'annuaire de tenants et le routeur ?
3. **Compréhension.** Qu'est-ce qu'une cellule ?
4. **Pourquoi.** Pourquoi l'automatisation est-elle indispensable à un modèle hybride ?
5. **Raisonnement pratique.** Citez deux signaux qui justifient de promouvoir un tenant vers un placement dédié.

#### Réponses

1. Une architecture qui supporte simultanément plusieurs modèles de mutualisation ou d'isolation, chaque tenant étant placé dans celui qui lui convient.
2. L'annuaire enregistre le placement de chaque tenant ; le routeur oriente chaque requête vers le bon placement.
3. Une copie complète et indépendante de la plateforme, qui héberge un sous-ensemble de tenants et confine les défaillances.
4. Sans automatisation, chaque tenant dédié devient un cas particulier géré à la main : l'exploitation ne passe pas à l'échelle.
5. Par exemple une consommation qui dégrade ses voisins, ou une exigence contractuelle ou réglementaire d'isolation ou de résidence des données.

## 5.6 Provisionnement et cycle de vie d'un tenant

### 1. Comprendre simplement

Le **provisionnement d'un tenant** (*tenant provisioning*) est la procédure qui crée, de façon automatique, tout ce qu'il faut pour qu'un nouveau client puisse utiliser la plateforme. Le **cycle de vie d'un tenant** (*tenant lifecycle*) est la suite des états qu'il traverse : de sa création à sa suppression, en passant par l'usage, la suspension et la résiliation.

**Pourquoi cela existe.** Le [module 1](01-architecture-saas.md) a présenté le cycle de vie du point de vue commercial. Ici, on regarde ce que cela signifie techniquement : quelles ressources créer, dans quel ordre, avec quelles vérifications, et ce que la plateforme autorise à chaque étape.

**Problème résolu.** Rendre l'arrivée, la vie et le départ d'un tenant rapides, répétables, sûrs et sans intervention humaine.

**Modèle mental.** L'ouverture et la clôture d'un compte bancaire : des étapes ordonnées, avec des contrôles, des états bien définis et des obligations de conservation après la fermeture.

**Où l'analogie s'arrête.** L'ouverture d'un compte est unique. Pour un tenant, certaines étapes se répètent au fil de la vie : changement d'offre, changement de région, ajout de modules.

**Exemple.** Une usine s'inscrit. En quelques minutes, son espace est prêt avec ses types de ressources de base, ses rôles types, son administrateur et ses quotas. Après résiliation, ses données restent consultables 30 jours puis sont supprimées.

**Les composants.**

1. un **modèle de tenant** (état, placement, offre) ;
2. une **procédure de provisionnement** orchestrée ;
3. des **états** et des **transitions** ;
4. une procédure de **sortie** et de **suppression**.

**Objectif d'apprentissage :** vous pouvez décrire les étapes du provisionnement d'un tenant et dire ce que la plateforme permet dans chaque état.

### 2. Connaissances essentielles

#### Définition

- **Provisionnement de tenant** : ensemble automatisé des opérations qui préparent un nouveau tenant (enregistrement, accès initiaux, configuration par défaut, ressources d'infrastructure, droits et quotas).
- **Cycle de vie de tenant** : modèle des états d'un tenant et des transitions entre eux, avec les effets de chaque état sur ce qui est permis.

#### Idées fondamentales

1. **Un tenant a un état explicite.** Chaque état fixe ce qui est permis.
2. **Le provisionnement est une procédure orchestrée.** Étapes ordonnées, reprise après échec.
3. **Il part d'un gabarit.** Types de ressources, rôles et vues par défaut.
4. **Chaque étape est idempotente.** On peut rejouer sans doublon (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
5. **Le placement conditionne les étapes.** Une base dédiée ajoute des étapes.
6. **La sortie est une procédure à part entière.** Export, rétention, suppression, preuve.

#### Vocabulaire essentiel

- **Gabarit de tenant** (*tenant blueprint*, *template*) : configuration de départ copiée à la création.
- **Orchestrateur** (*orchestrator*) : composant qui exécute et suit les étapes.
- **Test de fumée** (*smoke test*) : vérification rapide qu'un tenant fraîchement créé fonctionne.
- **Mode lecture seule** (*read-only mode*) : état où le tenant peut consulter mais pas modifier.
- **Période de rétention** (*retention period*) : délai de conservation après la fin du contrat.
- **Effacement cryptographique** (*crypto-shredding*) : destruction des clés de chiffrement d'un tenant pour rendre ses données illisibles.

#### Relations de cause à effet

- Une étape de provisionnement échoue sans mécanisme de reprise. Le tenant reste à moitié créé, inutilisable et non nettoyé.
- L'état « suspendu » n'est pas appliqué par tous les composants. Un tenant suspendu continue d'écrire par certains chemins.
- La suppression ne couvre pas les systèmes tiers. Des données subsistent dans la messagerie ou la facturation.

#### Idées reçues

- **« Créer un tenant, c'est ajouter une ligne dans une table. »** Cela peut impliquer de l'infrastructure, des clés, des DNS, des certificats, des identités, des quotas.
- **« Suspendre, c'est désactiver la connexion. »** Non. Il faut aussi couper les accès par API, les tâches planifiées, les webhooks, tout en conservant les données.
- **« La suppression est immédiate. »** Elle suit une période de rétention et une procédure de vérification.

#### Principe clé

Chaque état du tenant est explicite, chaque transition est une procédure automatisée et rejouable, et chaque état détermine précisément ce qui est permis.

#### Si vous ne retenez que trois choses

1. Le tenant a des états explicites qui gouvernent ce que la plateforme autorise.
2. Le provisionnement est une procédure orchestrée, rejouable, partant d'un gabarit.
3. La suppression suit une rétention, couvre les systèmes tiers et laisse une preuve.

### 3. Explication technique détaillée

#### Les états

```text
 demandé ─► en cours de provisionnement ─► actif ◄───────────────┐
                    │ échec                 │ │ impayé           │ régularisation
                    ▼                       │ └─────────► suspendu ┘
              en erreur ──(reprise)─►       │                │
                                            │ résiliation    │ rétention échue
                                            ▼                ▼
                                  en cours de suppression ─► supprimé
```

#### Ce que chaque état permet

| État | Lecture | Écriture | API et intégrations | Administration | Facturation |
|---|---|---|---|---|---|
| En cours de provisionnement | Non | Non | Non | Opérateurs | Non démarrée |
| Actif | Oui | Oui | Oui | Oui | Active |
| Suspendu | Oui (lecture seule) | Non | Lecture seule | Limitée | Impayé |
| En cours de suppression | Export seulement | Non | Non | Export | Terminée |
| Supprimé | Non | Non | Non | Non | Soldée |

#### Les étapes du provisionnement

| Étape | Contenu | Remarque |
|---|---|---|
| 1. Réservation | Identifiant, nom, sous-domaine | Unicité, vérification de disponibilité |
| 2. Placement | Choix du modèle et de la région | Selon l'offre et les exigences |
| 3. Infrastructure | Schéma, base, files, stockage, clés | Absente pour un tenant mutualisé |
| 4. Gabarit | Types de ressources, rôles, vues par défaut | Copie versionnée |
| 5. Accès | Administrateur initial, invitation | Pas de mot de passe en clair |
| 6. Droits et quotas | Selon l'offre | Voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) et [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) |
| 7. Intégrations | Facturation, supervision, messagerie | Échecs partiels à traiter |
| 8. Vérification | Test de fumée | Création et lecture d'une ressource d'essai |
| 9. Activation | État « actif », notification | Dernière étape |

#### L'orchestration

```text
POST /tenants  { "name": "Usine C", "plan": "enterprise", "request_id": "req-9f21" }
        │
        ▼
Workflow de provisionnement (idempotent par request_id)
   étape 1 ✔ → étape 2 ✔ → étape 3 ✔ → étape 4 ✔ → étape 5 ✖ (échec temporaire)
        │ reprise automatique avec délais
        ▼
   étape 5 ✔ → … → étape 9 ✔ → état « actif »
```

L'orchestrateur est un workflow durable (voir [6.3 Workflow, processus, étape et tâche](06-workflow-etat-regles.md#63-workflow-processus-étape-et-tâche)) ou une saga (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)). Chaque étape est rejouable. En cas d'échec définitif, une procédure de compensation défait les étapes réalisées.

#### Suspension et réactivation

La suspension met le tenant en lecture seule, **sans** détruire ses données. Elle doit être appliquée de façon cohérente : le moteur de ressources, les API, les tâches planifiées, les webhooks. La réactivation inverse l'opération, avec les mêmes contrôles.

#### La suppression

1. **Préavis** et possibilité d'annuler.
2. **Export** proposé au client (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)).
3. **Rétention** : le tenant reste en état « en cours de suppression », inaccessible aux utilisateurs.
4. **Effacement** : données, fichiers, index, caches, copies d'intégrations, clés.
5. **Preuve** : un certificat ou un journal indiquant ce qui a été supprimé et quand.

**Effacement cryptographique.** Quand les données d'un tenant sont chiffrées avec sa propre clé, détruire la clé rend toutes ses copies illisibles, y compris dans les sauvegardes. C'est une technique puissante, à condition que la gestion des clés soit rigoureuse (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)).

**Contre-exemple.** Une procédure de suppression qui efface la base du tenant, mais oublie le bucket de fichiers, l'index de recherche et la configuration de l'outil de facturation. Des données personnelles subsistent, en violation de l'engagement contractuel.

**Limites.** La rétention après résiliation entre en tension avec le droit à l'effacement : le délai et son fondement légal doivent être définis avec le service juridique.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Reprend et détaille le cycle de vie du point de vue technique |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Le cycle de vie du tenant est une machine à états |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | La saga coordonne les étapes qui peuvent échouer |
| [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride) | Le placement choisi détermine les étapes d'infrastructure |
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'export est proposé à la sortie |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés de tenant permettent l'effacement cryptographique |

### 5. Application pratique

**Situation initiale.** Le service commercial vend dix nouveaux contrats par semaine. Chaque provisionnement est fait à la main et demande une heure.

**Problème.** Les délais irritent les clients, et des erreurs de configuration apparaissent régulièrement (quotas oubliés, rôles absents).

**Application du concept.** Un provisionnement automatisé à partir d'un gabarit versionné, avec test de fumée.

**Déroulé.**

1. Le formulaire de souscription appelle l'API de provisionnement avec un identifiant de demande.
2. L'orchestrateur exécute les étapes ; l'étape d'intégration de facturation échoue deux fois, puis réussit à la troisième tentative.
3. Le test de fumée crée une ressource d'essai, la lit, puis la supprime.
4. Le tenant passe à « actif » et l'administrateur reçoit son invitation.

**Résultat.** Le délai passe d'une heure à quelques minutes, sans intervention, avec une configuration identique pour tous les clients de l'offre.

**Limites.** Le gabarit doit être versionné : un changement de gabarit ne doit pas s'appliquer rétroactivement aux tenants existants sans décision explicite.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez quatre états du cycle de vie d'un tenant.
2. **Compréhension.** Que permet l'état « suspendu » ?
3. **Compréhension.** Qu'est-ce qu'un gabarit de tenant ?
4. **Pourquoi.** Pourquoi chaque étape du provisionnement doit-elle être idempotente ?
5. **Raisonnement pratique.** Comment garantir que les données d'un tenant supprimé sont inexploitables, y compris dans les sauvegardes ?

#### Réponses

1. Par exemple : en cours de provisionnement, actif, suspendu, en cours de suppression, supprimé.
2. La lecture et l'export, sans écriture : les données sont conservées, mais le tenant ne peut plus les modifier.
3. La configuration de départ (types de ressources, rôles, vues) copiée lors de la création d'un tenant.
4. Pour qu'une reprise après échec n'entraîne ni doublon ni incohérence : le workflow peut être rejoué sans risque.
5. Par un effacement cryptographique : si les données et leurs sauvegardes sont chiffrées avec une clé propre au tenant, la destruction de cette clé les rend illisibles.

## 5.7 Configuration et personnalisation au niveau du tenant

### 1. Comprendre simplement

La **configuration du tenant** (*tenant configuration*) regroupe les réglages qui modifient le comportement de la plateforme dans les limites de ce qu'elle prévoit : langue, fuseau horaire, seuils, modules activés, connexion SSO. La **personnalisation** (*tenant-level customization*) va plus loin : elle modifie la structure ou la logique, par des champs, des types de ressources, des workflows, des vues ou des extensions.

**Pourquoi cela existe.** Aucun client ne fonctionne comme un autre. Si la plateforme ne permet pas d'adapter le comportement, chaque client demande un développement spécifique au fournisseur, ce qui ruine le modèle.

**Problème résolu.** Laisser chaque tenant adapter la plateforme à ses besoins, sans toucher au code et sans affecter les autres.

**Modèle mental.** Un appartement meublé : on peut régler le chauffage et choisir les rideaux (configuration), ou abattre une cloison et poser une cuisine (personnalisation), à condition de respecter le règlement de l'immeuble.

**Où l'analogie s'arrête.** Un appartement transformé reste dans un bâtiment figé. Ici, la plateforme évolue : les personnalisations doivent résister aux mises à jour du produit.

**Exemple.** Le tenant « compagnie aérienne » configure la langue française et le fuseau de Paris, active le module d'automatisation, ajoute un champ « niveau de bruit » aux aéronefs et définit un workflow d'approbation de constats.

**Le spectre.**

1. **paramètre** : un réglage simple ;
2. **configuration** : un choix parmi des options prévues ;
3. **personnalisation** : un ajout de structure ou de logique ;
4. **extension** : du code propre au tenant.

**Objectif d'apprentissage :** vous pouvez distinguer configuration et personnalisation, décrire la résolution en cascade des réglages et expliquer comment éviter qu'un tenant soit bloqué par une mise à jour.

### 2. Connaissances essentielles

#### Définition

- **Configuration de tenant** : ensemble des réglages propres à un tenant, choisis parmi ceux que la plateforme expose.
- **Personnalisation au niveau du tenant** : ajouts de structure (champs, types, vues), de logique (règles, workflows) ou de code (extensions) propres à un tenant.

#### Idées fondamentales

1. **La configuration est bornée par la plateforme.** Elle ne fait que choisir parmi des options.
2. **La personnalisation étend le modèle.** Elle s'appuie sur les métadonnées (voir [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)).
3. **Les réglages se résolvent en cascade.** Plateforme, offre, tenant, organisation, utilisateur.
4. **Tout est validé, versionné et audité.** Une configuration est une donnée critique.
5. **Les personnalisations doivent survivre aux mises à jour.** Points d'extension stables et politique de dépréciation.
6. **Les limites protègent la plateforme.** Nombre de champs, de règles, de workflows par tenant.

#### Vocabulaire essentiel

- **Réglage** (*setting*) : une valeur de configuration.
- **Valeur par défaut** (*default*) : valeur utilisée en l'absence de choix.
- **Surcharge** (*override*) : valeur plus spécifique qui remplace la valeur héritée.
- **Cascade de configuration** (*configuration cascade*) : résolution de la valeur effective selon la précision des niveaux.
- **Point d'extension** (*extension point*) : endroit prévu pour la personnalisation (voir [1.8 Architecture de plateforme et architecture modulaire](01-architecture-saas.md#18-architecture-de-plateforme-et-architecture-modulaire)).
- **Marque blanche** (*white-labeling*) : adaptation de l'identité visuelle (logo, couleurs, domaine).

#### Relations de cause à effet

- Les réglages sont stockés dans le code ou en variables d'environnement. Chaque changement de tenant demande un déploiement.
- La configuration n'est pas versionnée. Un changement malheureux ne peut pas être annulé, et on ne sait pas qui a changé quoi.
- Les personnalisations dépendent d'éléments internes non garantis. Une mise à jour du produit les casse.

#### Idées reçues

- **« Plus il y a d'options, mieux c'est. »** Non. Chaque option augmente les combinaisons à tester et à documenter.
- **« La personnalisation est du développement sur mesure. »** Pas nécessairement : dans une plateforme configurable, elle passe par des métadonnées, pas par du code spécifique.
- **« Les réglages se changent à chaud sans risque. »** Non. Un réglage peut changer le comportement de façon globale : il faut validation, simulation et possibilité de retour arrière.

#### Principe clé

Offrez des réglages bornés et des points d'extension stables ; versionnez et auditez chaque changement ; faites survivre les personnalisations aux mises à jour.

#### Si vous ne retenez que trois choses

1. La configuration choisit parmi des options prévues ; la personnalisation étend la structure ou la logique.
2. Les réglages se résolvent en cascade, du plus général au plus spécifique.
3. Chaque changement est validé, versionné, audité et réversible.

### 3. Explication technique détaillée

#### La cascade de résolution

```text
Plateforme (défaut)  <  Offre  <  Tenant  <  Organisation  <  Équipe  <  Utilisateur
      plus général ───────────────────────────────────────────►  plus spécifique
```

**Règle.** La valeur effective est celle du niveau le plus spécifique qui la définit.

```json
{
  "setting": "ui.language",
  "levels": {
    "platform": "en",
    "tenant": "fr",
    "organization:filiale-sud": "es",
    "user:u_42": null
  }
}
```

Pour l'utilisateur `u_42` de la Filiale Sud, la valeur effective est `es` : la Filiale Sud redéfinit le tenant, et l'utilisateur n'a rien défini.

#### Le catalogue de réglages

Chaque réglage est décrit comme une métadonnée : nom, type, valeurs permises, valeur par défaut, niveaux où il peut être défini, impact.

```json
{
  "key": "inspections.reminder_days",
  "type": "integer",
  "min": 1,
  "max": 90,
  "default": 30,
  "levels": ["platform", "tenant", "organization"],
  "requires_entitlement": null,
  "description": "Nombre de jours avant l'échéance d'inspection pour envoyer un rappel."
}
```

**Pourquoi.** Un catalogue décrit permet de générer l'écran de configuration, de valider les valeurs, de documenter et de limiter les niveaux où un réglage peut changer.

#### Les niveaux de personnalisation

| Niveau | Exemple | Coût de maintenance pour le fournisseur |
|---|---|---|
| Paramètre | Fuseau horaire | Très faible |
| Configuration | Modules activés | Faible |
| Structure | Champs et types personnalisés | Moyen, via les métadonnées |
| Logique | Règles, workflows | Moyen, via le moteur |
| Code | Extension propre au tenant | Élevé |

#### La résistance aux mises à jour

| Mécanisme | Principe |
|---|---|
| Points d'extension stables | Contrats versionnés, rétrocompatibles |
| Politique de dépréciation | Annonce, période de coexistence, retrait |
| Environnement d'essai (*sandbox*) | Tester les personnalisations avant une mise à jour |
| Analyse de compatibilité | Détecter les personnalisations affectées par une version |
| Canaux de version | Un tenant sensible reçoit les mises à jour plus tard |

#### Validation et sécurité d'un changement

1. valider la valeur contre le catalogue ;
2. vérifier le droit de l'auteur (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée)) et les droits d'usage du tenant (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)) ;
3. évaluer l'impact, si le réglage a des effets étendus ;
4. enregistrer une nouvelle version et journaliser ;
5. propager aux composants (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)).

**Contre-exemple.** Un champ libre « paramètres avancés » où le client saisit du JSON arbitraire lu directement par le code. Aucune validation, aucune documentation, et des comportements imprévisibles à chaque version.

**Limites.** La personnalisation extrême conduit à des tenants uniques, impossibles à tester à l'échelle. On borne le nombre d'options et on pousse les besoins répétés vers des fonctions standard.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Champs et objets personnalisés sont la personnalisation de structure |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | L'architecture pilotée par les métadonnées la rend possible |
| [5.1 La hiérarchie d'entreprise](#51-la-hiérarchie-dentreprise) | La cascade suit la hiérarchie d'entreprise |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | La configuration doit être versionnée |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions sont la personnalisation par le code |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | La configuration d'environnement est une notion voisine, côté technique |

### 5. Application pratique

**Situation initiale.** La compagnie veut que les rappels d'inspection partent 45 jours à l'avance, alors que la valeur par défaut est de 30.

**Problème.** Un changement de comportement global affecterait les autres clients. La compagnie ne doit modifier que son propre comportement.

**Application du concept.** Le réglage est défini au niveau du tenant, avec une surcharge pour une filiale.

**Déroulé.**

1. L'administrateur ouvre « Configuration » et choisit `inspections.reminder_days`.
2. Il saisit 45 au niveau du tenant ; la plateforme valide la plage (1 à 90).
3. Pour la Filiale Sud, il saisit 60.
4. Le moteur de rappel résout la valeur pour chaque aéronef selon son organisation.
5. Le changement est versionné et journalisé.

**Résultat.** Chaque organisation a son délai, sans effet sur les autres tenants.

**Limites.** Si le nombre de rappels envoyés augmente fortement, le quota de notifications du tenant peut être atteint : la plateforme doit prévenir de cet effet avant l'enregistrement.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre configuration et personnalisation ?
2. **Compréhension.** Comment se résout la valeur effective d'un réglage défini à plusieurs niveaux ?
3. **Compréhension.** Pourquoi décrit-on les réglages dans un catalogue ?
4. **Pourquoi.** Pourquoi une personnalisation peut-elle casser lors d'une mise à jour ?
5. **Raisonnement pratique.** Comment éviter qu'un réglage mal choisi ne dégrade la plateforme ?

#### Réponses

1. La configuration choisit parmi des options prévues ; la personnalisation ajoute de la structure ou de la logique propre au tenant.
2. La valeur du niveau le plus spécifique qui la définit remplace les valeurs plus générales.
3. Pour valider les valeurs, générer l'interface, documenter et limiter les niveaux où chaque réglage peut être changé.
4. Parce qu'elle peut dépendre d'éléments internes du produit qui ne sont pas garantis : sans contrats stables, une évolution la casse.
5. Par une validation (plages, droits), une évaluation de l'impact avant enregistrement, des quotas et la possibilité de retour arrière.

## 5.8 Données et permissions propres au tenant

### 1. Comprendre simplement

Dans une plateforme multi-tenant, tout ne se range pas de la même façon. Certaines choses appartiennent **à un tenant** et à lui seul : ses ressources métier, ses configurations, ses rôles. D'autres appartiennent **à la plateforme** : le catalogue des permissions disponibles, les types de base, les modèles de référence. Il faut distinguer clairement les **données propres au tenant** (*tenant-specific data*) et ses **permissions propres** (*tenant-specific permissions*).

**Pourquoi cela existe.** Si cette frontière est floue, un tenant peut modifier ce qui appartient à tous, ou lire ce qui appartient à un autre. Elle détermine aussi ce qui peut être exporté, supprimé, chiffré avec une clé propre, ou conservé dans une région donnée.

**Problème résolu.** Donner à chaque élément de la plateforme un propriétaire clair : un tenant, ou la plateforme.

**Modèle mental.** Dans un immeuble : les appartements et leur contenu appartiennent aux locataires. L'ascenseur, l'escalier et le règlement appartiennent à la copropriété. Un locataire peut aménager son appartement, pas modifier l'ascenseur.

**Où l'analogie s'arrête.** Dans un immeuble, la frontière est visible. Dans un système, certains éléments sont à la limite : un type de ressource fourni par la plateforme que le tenant étend, ou une liste de référence que le tenant peut compléter.

**Exemple.** La liste des modèles d'aéronefs est tenue par la plateforme, en lecture seule. La compagnie y ajoute ses modèles internes dans une liste propre. Les rôles « Planificateur » et « Technicien » sont définis par la compagnie, avec des permissions choisies dans le catalogue de la plateforme.

**Les catégories.**

1. **données métier du tenant** ;
2. **configuration et métadonnées du tenant** ;
3. **données de référence de la plateforme** ;
4. **catalogue de permissions** (plateforme) et **attributions** (tenant).

**Objectif d'apprentissage :** vous pouvez classer un élément dans sa catégorie, et dire qui peut le modifier.

### 2. Connaissances essentielles

#### Définition

- **Données propres au tenant** : toutes les données créées, importées ou dérivées pour un tenant, qui lui appartiennent et sont isolées des autres.
- **Permissions propres au tenant** : droits, rôles et attributions définis et administrés dans un tenant, bornés par le catalogue de permissions et les droits d'usage de la plateforme.

#### Idées fondamentales

1. **Chaque donnée a un propriétaire.** Un tenant, ou la plateforme.
2. **Les données dérivées appartiennent aussi au tenant.** Index, caches, agrégats, journaux, fichiers.
3. **Les données de référence sont partagées en lecture seule.** Le tenant peut les compléter, pas les modifier.
4. **Le catalogue de permissions est de la plateforme.** Les attributions et rôles sont du tenant.
5. **Un tenant ne s'accorde pas plus que ses droits d'usage.** L'administrateur ne peut pas créer une permission que le plan interdit.
6. **L'emplacement et le chiffrement suivent le tenant.** Région, clés, durée de conservation.

#### Vocabulaire essentiel

- **Donnée de référence** (*reference data*) : donnée stable partagée (pays, modèles de base).
- **Donnée dérivée** (*derived data*) : donnée calculée à partir de données du tenant.
- **Catalogue de permissions** (*permission catalog*) : liste des permissions que la plateforme définit.
- **Rôle système** (*system role*) : rôle fourni par la plateforme, non modifiable.
- **Rôle personnalisé** (*custom role*) : rôle défini par un tenant.
- **Résidence des données** (*data residency*) : contrainte sur le lieu de stockage.
- **Clé gérée par le client** (*customer-managed key*, *BYOK*) : clé de chiffrement fournie ou contrôlée par le tenant.

#### Relations de cause à effet

- Les données de référence sont éditables par les tenants. Une modification d'un tenant affecte tous les autres.
- Les données dérivées (index de recherche) ne portent pas le tenant. Elles fuient, ou ne sont pas supprimées à la sortie du client.
- Les rôles personnalisés peuvent porter le même nom qu'un rôle système. Le comportement devient ambigu, et un rôle système peut être masqué.

#### Idées reçues

- **« Les données du tenant, ce sont ses tables. »** Non. Ce sont aussi les index, les fichiers, les caches, les journaux et les sauvegardes.
- **« Un administrateur de tenant peut tout faire dans son tenant. »** Non. Il est borné par les droits d'usage du plan et par les règles de la plateforme (par exemple, il ne peut pas désactiver l'audit).
- **« Les permissions sont propres à chaque tenant. »** Le catalogue est commun ; seules les attributions et les rôles sont propres.

#### Principe clé

La plateforme possède le vocabulaire (catalogue, types de base, références) ; chaque tenant possède ce qu'il en fait (données, rôles, attributions, réglages).

#### Si vous ne retenez que trois choses

1. Chaque élément appartient à un tenant ou à la plateforme, et cela détermine qui le modifie.
2. Les données dérivées et les fichiers suivent le tenant au même titre que ses données métier.
3. Le catalogue de permissions est commun ; les rôles et attributions sont propres au tenant, dans les limites de son plan.

### 3. Explication technique détaillée

#### La classification

| Catégorie | Propriétaire | Modifiable par le tenant ? | Exemple | Isolation |
|---|---|---|---|---|
| Données métier | Tenant | Oui | Aéronefs, tâches | Stricte |
| Données dérivées | Tenant | Indirectement | Index, agrégats, caches | Stricte |
| Fichiers et pièces jointes | Tenant | Oui | Rapports d'inspection | Stricte |
| Configuration et métadonnées | Tenant | Oui, dans les limites | Types, champs, workflows | Stricte |
| Rôles et attributions | Tenant | Oui | Rôle « Planificateur » | Stricte |
| Catalogue de permissions | Plateforme | Non | `aircraft:update` | Partagé |
| Types de base et modèles | Plateforme | Étend, ne modifie pas | Type « Aéronef » de base | Partagé |
| Données de référence | Plateforme | Non (complète) | Liste de pays, constructeurs | Partagé, lecture seule |

#### Les données de référence

Un tenant a souvent besoin d'une liste commune (constructeurs, modèles) qu'il peut compléter avec ses éléments internes.

```text
Liste effective pour le tenant T  =  référence de la plateforme (lecture seule)
                                  ∪  éléments propres à T
```

Les éléments propres portent le tenant. Un élément de référence fourni par la plateforme ne peut pas être modifié, mais le tenant peut le masquer ou le remplacer par un élément propre.

#### Les permissions

```json
{
  "tenant": "airline-regional",
  "custom_roles": [
    {
      "name": "Inspecteur terrain",
      "permissions": ["aircraft:read", "finding:create", "finding:read"],
      "based_on": null
    }
  ],
  "constraints": {
    "allowed_permissions_from_plan": ["aircraft:*", "finding:*", "task:*"],
    "forbidden": ["audit:disable", "tenant:delete"]
  }
}
```

**Comment la lire.** Le tenant crée un rôle personnalisé avec des permissions choisies dans le catalogue. Certaines permissions (désactiver l'audit, supprimer le tenant) ne peuvent jamais être accordées par un tenant à ses utilisateurs ordinaires.

#### Emplacement, chiffrement, conservation

| Attribut | Portée | Exemple |
|---|---|---|
| Région de stockage | Par tenant | Données conservées dans l'Union européenne |
| Clé de chiffrement | Par tenant | Clé gérée par le client (BYOK) |
| Durée de conservation | Par tenant et par type | Journaux d'audit : 10 ans |
| Anonymisation | Par tenant | À la demande d'une personne |

#### Modes de défaillance

- **Référence modifiable** par un tenant et partagée par tous.
- **Donnée dérivée orpheline** : index ou agrégat qui survit à la suppression du tenant.
- **Permission non bornée** : un tenant s'accorde une permission réservée à la plateforme.
- **Collision de noms** entre rôle système et rôle personnalisé.

**Contre-exemple.** Une table « paramètres du produit » partagée, que les administrateurs de tenants peuvent éditer par l'interface d'administration. Un seul administrateur peut changer le comportement de la plateforme pour tous les clients.

**Limites.** La frontière entre plateforme et tenant évolue : un champ introduit par la plateforme peut entrer en collision avec un champ personnalisé de même nom. Des préfixes de nommage et des règles de réservation préviennent ces cas.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](01-architecture-saas.md#12-tenant-et-multi-tenancy) | La notion de tenant décide de ce qui est propre |
| [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Les champs personnalisés sont des métadonnées propres au tenant |
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) | Le vocabulaire de permission et de rôle y est appliqué |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les droits d'usage bornent les permissions du tenant |
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Le chiffrement par tenant en est une conséquence |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | À la sortie, toutes les données propres doivent être traitées |

### 5. Application pratique

**Situation initiale.** Un administrateur de tenant veut créer un rôle « Super administrateur » qui peut aussi désactiver l'audit et supprimer le tenant.

**Problème.** Ces permissions touchent à la gouvernance de la plateforme et du contrat : elles ne doivent pas être sous le contrôle d'un seul administrateur.

**Application du concept.** Le catalogue marque ces permissions comme non délégables aux rôles personnalisés.

**Déroulé.**

1. L'administrateur ouvre l'éditeur de rôles.
2. Il sélectionne des permissions dans le catalogue ; celles qui sont réservées sont absentes ou grisées.
3. Il enregistre un rôle aux permissions étendues, mais sans les permissions interdites.
4. La création du rôle est journalisée.

**Résultat.** Le tenant dispose d'un rôle puissant sans pouvoir désactiver le contrôle indépendant.

**Limites.** Si le client a une raison légitime de demander ces droits (par exemple une demande contractuelle), le processus passe par une demande au fournisseur, avec approbation et traçabilité (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez deux catégories d'éléments qui appartiennent à la plateforme.
2. **Compréhension.** Pourquoi les index de recherche appartiennent-ils au tenant ?
3. **Compréhension.** Qui possède le catalogue de permissions, et qui possède les rôles ?
4. **Pourquoi.** Pourquoi les données de référence sont-elles en lecture seule pour les tenants ?
5. **Raisonnement pratique.** Un tenant veut ajouter ses propres modèles d'aéronefs à la liste de référence. Comment faire sans modifier la liste commune ?

#### Réponses

1. Par exemple : le catalogue de permissions, les types de base, les données de référence.
2. Parce qu'ils sont dérivés des données du tenant : ils doivent être isolés, chiffrés et supprimés avec elles.
3. La plateforme possède le catalogue ; chaque tenant possède ses rôles et ses attributions.
4. Parce qu'une modification serait visible par tous les tenants et pourrait casser leur fonctionnement.
5. En ajoutant des éléments propres au tenant, fusionnés avec la référence à la lecture, sans toucher aux éléments communs.

## 5.9 Administration inter-tenants

### 1. Comprendre simplement

L'**administration inter-tenants** (*cross-tenant administration*) désigne toutes les opérations qui franchissent la frontière entre tenants : un opérateur du fournisseur qui diagnostique un problème chez un client, une équipe qui déploie une mise à jour sur tous les tenants, un partenaire qui administre plusieurs clients.

**Pourquoi cela existe.** Une plateforme se gère, se dépanne et évolue. Cela exige des personnes ou des outils qui voient plusieurs tenants. Mais c'est aussi le plus grand risque pour l'isolation : un accès inter-tenants est, par définition, un accès qui contourne la séparation.

**Problème résolu.** Permettre l'exploitation et le support de la plateforme sans transformer ces accès en faille.

**Modèle mental.** Le passe-partout d'un gardien d'immeuble. Il ouvre toutes les portes pour les urgences et l'entretien. Sa gestion (qui le détient, quand on l'utilise, comment on le contrôle) est une question de sécurité à part entière.

**Où l'analogie s'arrête.** Un gardien est une personne connue. Une plateforme a des équipes, des outils automatisés et des partenaires : chacun peut détenir un type d'accès, et la traçabilité doit les distinguer.

**Exemple.** Un client signale que ses imports échouent. Un ingénieur support demande à voir la configuration et les journaux du tenant. La plateforme exige l'accord du client, limite l'accès à une heure, le masque en partie et en laisse une trace visible du client.

**Les catégories.**

1. **opérations** (déploiement, migration, maintenance) ;
2. **support** (diagnostic) ;
3. **conformité** (conservation légale, enquêtes) ;
4. **partenaires** (revendeurs, intégrateurs gérant plusieurs clients).

**Objectif d'apprentissage :** vous pouvez lister les contrôles qui encadrent un accès inter-tenants et expliquer pourquoi il ne passe jamais par la porte ordinaire des utilisateurs.

### 2. Connaissances essentielles

#### Définition

L'**administration inter-tenants** est l'ensemble des fonctions, des accès et des procédures qui permettent à des opérateurs du fournisseur ou à des partenaires autorisés d'agir sur un ou plusieurs tenants, hors du cadre d'authentification et d'autorisation ordinaire des utilisateurs du tenant.

#### Idées fondamentales

1. **C'est le plus fort pouvoir de la plateforme.** Il doit être le plus encadré.
2. **Il passe par un plan d'administration distinct.** Identité, interface et API séparées de celles des tenants.
3. **Il est accordé à la demande, pour une durée limitée.** Pas d'accès permanent.
4. **Il est justifié et consenti.** Motif, ticket, accord du client quand le contrat l'exige.
5. **Il est entièrement tracé, et la trace est visible du client.** Qui, quand, pourquoi, quoi.
6. **Les données sont masquées par défaut.** On voit la structure avant de voir le contenu.

#### Vocabulaire essentiel

- **Plan d'administration de la plateforme** (*platform admin plane*) : interface et API réservées aux opérateurs.
- **Accès de support** (*support access*) : accès temporaire d'un opérateur à un tenant.
- **Impersonation encadrée** (*view as*, *impersonation*) : vue de ce que voit un utilisateur, en lecture seule, avec restrictions.
- **Approbation à deux personnes** (*two-person rule*) : deux personnes valident une action sensible.
- **Accès de dernier recours** (*break-glass*) : accès d'urgence exceptionnel et fortement surveillé.
- **Journal d'accès de support** : trace consultable par le client.
- **Hiérarchie de partenaires** : un partenaire gère plusieurs tenants clients.

#### Relations de cause à effet

- Les opérateurs ont un accès permanent en lecture à tous les tenants. Une compromission d'un compte d'opérateur expose toutes les données de tous les clients.
- L'accès de support n'est pas visible du client. La confiance s'érode quand le client le découvre par hasard, et la conformité est difficile à démontrer.
- Les outils d'administration contournent la couche de contrôle d'accès. Ils deviennent le moyen d'accéder à tout sans trace.

#### Idées reçues

- **« Le fournisseur doit pouvoir tout voir pour assurer le support. »** Pas par défaut. Beaucoup de diagnostics se font sur des métadonnées, des journaux masqués, ou en reproduisant le problème avec des données synthétiques.
- **« Un administrateur de plateforme est un super utilisateur d'un tenant. »** Non. Ses droits relèvent d'un autre plan, avec ses propres contrôles.
- **« Les partenaires sont des utilisateurs comme les autres. »** Ils gèrent plusieurs tenants : ils ont besoin d'un modèle d'accès propre, avec délégation et séparation.

#### Principe clé

Un accès qui traverse la frontière entre tenants est exceptionnel, justifié, limité dans le temps, minimal dans ce qu'il montre, et visible de ceux dont il touche les données.

#### Si vous ne retenez que trois choses

1. L'administration inter-tenants est un plan distinct, très encadré, qui ne passe jamais par les accès ordinaires.
2. Chaque accès est justifié, limité dans le temps, minimal et tracé.
3. Le client peut voir qui a accédé à ses données, quand et pourquoi.

### 3. Explication technique détaillée

#### Les catégories d'accès et leur encadrement

| Catégorie | Exemple | Encadrement typique |
|---|---|---|
| Opérations automatisées | Déploiement d'une mise à jour, migration | Automatisé, révisé, sans lecture de données métier |
| Supervision | Métriques agrégées par tenant | Pas de données métier |
| Support : métadonnées | Configuration, états, erreurs | Accès sur ticket, durée limitée |
| Support : contenu | Voir une fiche pour diagnostiquer | Consentement du client, masquage, lecture seule |
| Conformité | Conservation légale, demande d'autorité | Procédure juridique, approbation à deux |
| Partenaire | Gérer les tenants de ses clients | Relation explicite, délégation, périmètre |

#### Le flux d'un accès de support

```text
1. Ticket client                      « Les imports échouent »
2. Demande d'accès                    ingénieur → tenant, motif, durée (1 h), périmètre
3. Approbation                        client (consentement) ou règle contractuelle ; second valideur
4. Session d'administration           MFA, appareil conforme, accès temporaire
5. Actions                            lecture, masquage des champs sensibles, journalisées
6. Fin automatique                    expiration ; révocation anticipée possible
7. Trace visible du client            « Ingénieur X a consulté la configuration à 14:05, motif… »
```

#### La séparation technique

```text
┌───────────────────────────────────────────────────────────┐
│ Plan d'administration de la plateforme (opérateurs)        │
│  - identité propre, MFA fort, appareils gérés              │
│  - API dédiée : « agir sur le tenant T, motif M, durée D » │
└────────────────────────┬──────────────────────────────────┘
                         │ accès contrôlé, tracé
┌────────────────────────▼──────────────────────────────────┐
│ Plan de données et plan de contrôle des tenants             │
└───────────────────────────────────────────────────────────┘
```

**Pourquoi.** Les opérateurs ne se servent pas de l'interface des utilisateurs avec un compte spécial : ils passent par une API qui impose le tenant visé, le motif et la durée, et applique les masquages.

#### Les contrôles

- **Moindre privilège** et **élévation à la demande** (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).
- **Approbation à deux personnes** pour les actions sensibles.
- **Masquage** des données personnelles et sensibles par défaut.
- **Lecture seule** par défaut ; écriture exceptionnelle.
- **Journal immuable**, visible du client.
- **Détection d'anomalies** : accès à un grand nombre de tenants, accès hors horaires.
- **Clés gérées par le client** : un client peut révoquer l'accès du fournisseur à ses données en retirant sa clé.

#### La hiérarchie de partenaires

Un revendeur ou un intégrateur gère plusieurs tenants clients :

```text
Partenaire P
 ├── Tenant client 1   (P a le rôle « gestionnaire », périmètre : configuration)
 ├── Tenant client 2   (P a le rôle « lecture », périmètre : rapports)
 └── Tenant client 3
```

Le partenaire a sa propre identité, mais ses droits sont **accordés par chaque client**, tenant par tenant, et visibles de lui. La facturation peut remonter vers le partenaire.

**Contre-exemple.** Un compte unique « admin-support » partagé par toute l'équipe, avec un accès en lecture et écriture à tous les tenants et sans journal détaillé. Aucune action n'est attribuable, aucune séparation n'est possible, et la compromission du mot de passe expose tout.

**Limites.** Un accès de support trop contraignant ralentit la résolution des incidents. Il faut un compromis : des outils de diagnostic qui ne nécessitent pas l'accès aux données, un masquage intelligent, et un chemin d'urgence encadré.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.2 Isolation des tenants](#52-isolation-des-tenants) | Les accès inter-tenants sont la principale exception à l'isolation |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | L'assistance est une forme encadrée de délégation |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Moindre privilège et séparation des tâches s'y appliquent avec rigueur |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit rend les accès visibles du client |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | Le plan d'administration de la plateforme est un plan de contrôle du fournisseur |
| [11.5 Zero Trust](11-securite-fiabilite-operations.md#115-zero-trust) | Zero Trust s'applique aux opérateurs comme aux utilisateurs |

### 5. Application pratique

**Situation initiale.** Un client conteste une facture d'utilisation et demande des explications. Un analyste du fournisseur doit examiner les volumes d'appels de son tenant.

**Problème.** L'analyste n'a besoin d'aucune donnée métier, seulement de compteurs d'usage.

**Application du concept.** L'accès se limite aux métriques agrégées du tenant, sans accès aux ressources.

**Déroulé.**

1. L'analyste ouvre une demande avec le numéro de ticket et le motif « litige de facturation ».
2. Le système lui donne une vue limitée aux compteurs d'usage du tenant, pour une heure.
3. Aucun champ métier n'est exposé.
4. L'accès est journalisé et apparaît dans le journal d'accès du client.

**Résultat.** Le litige est instruit sans que le fournisseur ne voie de données métier.

**Limites.** Un autre type de litige (par exemple une donnée erronée) pourrait exiger le contenu : la procédure plus stricte (consentement, masquage) s'applique alors.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Citez trois contrôles qui encadrent un accès de support.
2. **Compréhension.** Pourquoi les opérateurs n'utilisent-ils pas l'interface ordinaire des utilisateurs ?
3. **Compréhension.** Que voit le client d'un accès de support à ses données ?
4. **Pourquoi.** Pourquoi un accès permanent en lecture à tous les tenants est-il dangereux ?
5. **Raisonnement pratique.** Un partenaire gère les configurations de dix clients. Comment organiser son accès ?

#### Réponses

1. Par exemple : élévation temporaire sur ticket, masquage des données sensibles, lecture seule, approbation à deux, journal visible du client.
2. Parce que l'interface ordinaire n'impose ni motif, ni durée, ni masquage, et que l'accès inter-tenants relève d'un plan de sécurité distinct.
3. Qui y a accédé, quand, pour quel motif et avec quel périmètre, dans un journal d'accès de support.
4. Parce que la compromission d'un seul compte d'opérateur exposerait les données de tous les clients : l'accès doit être limité dans le temps et justifié.
5. Par un rôle accordé par chaque client à l'identité du partenaire, avec un périmètre limité (configuration), visible et révocable tenant par tenant.

## 5.10 Migration de tenant

### 1. Comprendre simplement

La **migration de tenant** (*tenant migration*) consiste à **déplacer un tenant d'un emplacement à un autre** : d'un pool mutualisé vers une base dédiée, d'une base vers une autre, d'une région vers une autre, ou même fusionner deux tenants. Le client doit continuer à travailler, avec une interruption la plus courte possible.

**Pourquoi cela existe.** Les besoins changent. Un client grossit, change d'offre, doit respecter une nouvelle réglementation, ou est racheté. La plateforme doit pouvoir adapter son placement sans demander au client de repartir de zéro.

**Problème résolu.** Changer le placement d'un tenant en préservant ses données, ses identifiants et ses liens, avec un minimum d'interruption et la possibilité de revenir en arrière.

**Modèle mental.** Un déménagement d'entreprise : on prépare les nouveaux locaux, on transporte progressivement, on bascule un week-end, on vérifie, puis on rend les anciens locaux.

**Où l'analogie s'arrête.** Une entreprise déménage son contenu une fois. Une plateforme doit continuer à recevoir des écritures pendant le déménagement, et garder deux copies synchronisées jusqu'à la bascule.

**Exemple.** Un tenant mutualisé de 200 Go bascule vers une base dédiée en région centrale, un dimanche matin, avec une interruption de dix minutes.

**Les composants.**

1. un **placement source** et un **placement cible** ;
2. une **copie** (initiale puis synchronisation continue) ;
3. une **vérification** de l'intégrité ;
4. une **bascule** du routage ;
5. un **plan de retour arrière**.

**Objectif d'apprentissage :** vous pouvez décrire les étapes d'une migration en ligne et dire pourquoi l'annuaire de tenants la rend possible sans que les clients s'en aperçoivent.

### 2. Connaissances essentielles

#### Définition

La **migration de tenant** est l'opération qui déplace l'ensemble des données, de la configuration et des ressources associées d'un tenant d'un placement vers un autre, et bascule son routage, en préservant son identité, ses données et ses liens.

#### Idées fondamentales

1. **Le routage passe par un annuaire.** Changer le placement revient à changer une entrée, au moment choisi.
2. **La copie se fait en deux temps.** Une copie complète, puis une synchronisation continue des changements.
3. **La bascule est courte.** Une brève période d'écriture figée.
4. **La vérification précède la bascule.** Comptes, sommes de contrôle, tests.
5. **Le retour arrière est prévu.** L'ancien placement est conservé jusqu'à validation.
6. **La migration est propre à un tenant.** On ne déplace pas toute la plateforme d'un coup.

#### Vocabulaire essentiel

- **Copie initiale** (*initial copy*, *snapshot*) : première copie complète.
- **Capture des changements** (*change data capture*, *CDC*) : flux des modifications depuis la copie initiale.
- **Bascule** (*cutover*) : instant où le tenant passe sur le nouveau placement.
- **Fenêtre de maintenance** (*maintenance window*) : période convenue d'interruption.
- **Somme de contrôle** (*checksum*) : empreinte pour comparer deux jeux de données.
- **Retour arrière** (*rollback*) : retour au placement d'origine.
- **Fusion de tenants** (*tenant merge*) : réunion de deux tenants en un seul.

#### Relations de cause à effet

- La copie est faite pendant que le tenant écrit. Sans synchronisation des changements, des écritures sont perdues entre la copie et la bascule.
- La bascule n'est pas atomique. Une partie des requêtes va encore vers l'ancien placement : des écritures sont perdues ou dupliquées.
- Les caches, files et index ne sont pas migrés ou invalidés. Le tenant voit des données périmées ou incohérentes après la bascule.

#### Idées reçues

- **« Migrer, c'est copier la base. »** Non. Il faut aussi les fichiers, les index, les files, les clés, la configuration, les références externes, et l'annuaire.
- **« Une interruption de plusieurs heures est inévitable. »** Pas avec une synchronisation continue : l'interruption se réduit à la bascule, de quelques minutes.
- **« Une migration réussie n'a pas besoin de retour arrière. »** Non. Les problèmes apparaissent parfois après la bascule : il faut garder l'ancien placement un temps.

#### Principe clé

Copiez, synchronisez, vérifiez, basculez brièvement, et gardez la voie du retour jusqu'à ce que le nouveau placement ait fait ses preuves.

#### Si vous ne retenez que trois choses

1. Une migration en ligne combine copie initiale, synchronisation continue et bascule courte.
2. L'annuaire de tenants rend la bascule transparente pour l'application.
3. Vérification et retour arrière sont indispensables.

### 3. Explication technique détaillée

#### Les étapes

```text
1. Préparer        placement cible, gabarit, clés, droits, réseau
2. Copier          copie initiale des données et fichiers (le tenant continue à écrire)
3. Synchroniser    application continue des changements (CDC) jusqu'à un écart minimal
4. Vérifier        comptages, sommes de contrôle, échantillons, tests fonctionnels
5. Figer           brève suspension des écritures du tenant
6. Synchroniser    dernier rattrapage jusqu'à l'écart nul
7. Basculer        mise à jour de l'annuaire : le tenant pointe vers la cible
8. Valider         contrôles post-bascule, surveillance rapprochée
9. Retirer         après le délai de sécurité, suppression de l'ancien placement
```

**Retour arrière.** Entre les étapes 7 et 9, on peut basculer l'annuaire vers l'ancien placement. Il faut alors avoir continué à synchroniser dans l'autre sens, ou accepter de perdre les écritures faites sur la cible.

#### La durée de la copie initiale

$$T_{\text{copie}} \approx \frac{S}{B}$$

où $S$ est le volume à copier et $B$ le débit effectif de transfert.

**Exemple chiffré.** Pour $S = 500$ Go et $B = 100$ Mo/s, $T \approx 5\,000$ s, soit un peu moins de 1 h 30. Pendant ce temps, le tenant continue d'écrire, et ces écritures sont rattrapées par la synchronisation continue.

#### Les éléments à migrer

| Élément | Précaution |
|---|---|
| Données métier | Copie cohérente à un instant, puis flux de changements |
| Fichiers et pièces jointes | Copie en parallèle, vérification d'intégrité |
| Index de recherche | Reconstruire sur la cible ou migrer |
| Caches | Invalider à la bascule |
| Files et tâches en cours | Vider avant la bascule, ou migrer avec leur identifiant |
| Clés de chiffrement | Réemballer ou transférer selon la politique |
| Références externes | Adresses de webhooks, domaines personnalisés, intégrations |
| Identifiants | Conservés, pour ne pas casser les références |

#### L'annuaire comme point de bascule

```text
Avant :  tenant T  ──►  pool-eu-3
Après :  tenant T  ──►  db-nc-01   (nouvelle entrée, effective à l'instant de la bascule)
```

L'application ne contient aucune adresse de base codée en dur : elle consulte l'annuaire, avec un cache de courte durée. La bascule se propage en quelques secondes.

#### La fusion de tenants

Fusionner deux tenants (rachat d'une société) est plus difficile qu'un déplacement :

- les **identifiants** peuvent entrer en collision ;
- les **types de ressources et champs personnalisés** diffèrent ;
- les **rôles et utilisateurs** doivent être réconciliés (voir [3.4 Fusionner](03-crud-runtime-ressources.md#34-fusionner)) ;
- les **règles et workflows** peuvent se contredire.

On procède par une correspondance explicite, une migration par type, et une phase de coexistence.

#### Modes de défaillance

- **Écritures perdues** entre l'arrêt de la synchronisation et la bascule.
- **Bascule partielle** : certains serveurs gardent l'ancien routage en cache.
- **Divergence** : la cible diffère de la source à cause d'une erreur de copie non détectée.
- **Coût réseau ou temps de copie sous-estimé.**
- **Violation de conformité** : copies temporaires dans une région non autorisée.

**Contre-exemple.** Une migration par « exporter puis importer » avec une interruption de tout le tenant le temps du transfert, sans vérification ni retour arrière. Une erreur d'import n'est découverte que le lundi matin, quand l'ancien environnement a déjà été supprimé.

**Limites.** Pour des volumes de plusieurs téraoctets, la copie initiale peut durer des jours, et la synchronisation doit rester fiable tout ce temps. Il faut parfois des mécanismes de transfert dédiés, ou migrer par type de données.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.5 Multi-tenancy hybride](#55-multi-tenancy-hybride) | L'hybride repose sur la capacité de migrer entre placements |
| [5.4 Modèles d'architecture multi-tenant](#54-modèles-darchitecture-multi-tenant) | Chaque modèle d'architecture implique une procédure de migration |
| [5.6 Provisionnement et cycle de vie d'un tenant](#56-provisionnement-et-cycle-de-vie-dun-tenant) | Le cycle de vie du tenant inclut des migrations |
| [3.4 Fusionner](03-crud-runtime-ressources.md#34-fusionner) | La fusion de tenants s'appuie sur la fusion de ressources |
| [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) | Les exigences de reprise (RPO, RTO) guident la bascule |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit enregistre chaque étape |

### 5. Application pratique

**Situation initiale.** Une compagnie nationale, aujourd'hui mutualisée, signe un contrat qui exige des données hébergées dans une base dédiée, en région centrale, avec ses propres clés. Elle a 180 Go de données et 40 utilisateurs actifs en journée.

**Problème.** Elle ne peut accepter ni une interruption de plus de quelques minutes en journée, ni une perte de données.

**Application du concept.** Une migration en ligne vers une base dédiée, avec bascule un dimanche matin.

**Déroulé.**

1. L'équipe provisionne la base dédiée, les clés et le routage de la région cible.
2. La copie initiale démarre le jeudi ; la synchronisation continue prend le relais.
3. Le samedi, les comptages et les sommes de contrôle sont identiques, et un test fonctionnel passe sur la cible.
4. Le dimanche à 7 h, le tenant est figé en écriture, le dernier rattrapage dure deux minutes, puis l'annuaire bascule.
5. Le tenant est surveillé de près pendant 48 h. L'ancien placement est conservé 7 jours, puis supprimé après validation du client.

**Résultat.** L'interruption en écriture dure moins de cinq minutes, aucune donnée n'est perdue et l'exigence contractuelle est satisfaite.

**Limites.** La suppression finale des données dans le pool doit suivre la procédure d'effacement, y compris pour les sauvegardes (voir [5.6 Provisionnement et cycle de vie d'un tenant](#56-provisionnement-et-cycle-de-vie-dun-tenant)). Sans cela, l'exigence de séparation n'est pas pleinement tenue.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les grandes étapes d'une migration en ligne ?
2. **Compréhension.** Pourquoi la synchronisation continue est-elle nécessaire ?
3. **Compréhension.** Quel rôle joue l'annuaire de tenants dans la bascule ?
4. **Pourquoi.** Pourquoi conserve-t-on l'ancien placement après la bascule ?
5. **Raisonnement pratique.** Combien de temps prend la copie initiale de 500 Go à 100 Mo/s, et que se passe-t-il pendant ce temps ?

#### Réponses

1. Préparer la cible, copier, synchroniser, vérifier, figer brièvement, rattraper, basculer, valider, puis retirer l'ancien placement.
2. Parce que le tenant continue d'écrire pendant la copie : sans rattrapage des changements, ces écritures seraient perdues.
3. L'application route d'après l'annuaire : changer l'entrée suffit à orienter le tenant vers la cible, sans modifier l'application.
4. Pour pouvoir revenir en arrière si un problème apparaît après la bascule, avant d'avoir validé le nouveau placement.
5. Environ 5 000 s, soit un peu moins de 1 h 30. Pendant ce temps, le tenant continue d'écrire et ses modifications sont rattrapées par la synchronisation continue.
