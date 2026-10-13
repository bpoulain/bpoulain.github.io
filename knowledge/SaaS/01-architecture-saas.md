# Module 1 — SaaS et architecture de plateforme

> **Question directrice.** Comment architecturer une plateforme capable d'héberger plusieurs applications métier différentes ?

## Présentation du module

**Objectif.** Comprendre ce qu'est réellement une plateforme SaaS : qui l'exploite, pour qui, comment elle est organisée en interne et quels choix d'architecture elle impose.

**Prérequis.** Les notions de client, de serveur, d'API et de base de données, rappelées dans la [vue d'ensemble](00-vue-ensemble.md).

**Ordre retenu.** Le module va du plus commercial au plus technique. Il diffère du plan sur un point : les systèmes distribués sont expliqués avant la comparaison monolithe et microservices, car cette comparaison repose sur leurs conséquences.

```text
SaaS ─► Tenant ─► Compte / Organisation ─► Abonnement ─► Quotas ─► Cycle de vie
                                                                      │
Frontières ◄─ Monolithe / Microservices ◄─ Distribué ◄─ Architecture ◄─ Plans
```

## Sommaire du module

- [1.1 SaaS](#11-saas)
- [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy)
- [1.3 Compte, organisation et espace de travail](#13-compte-organisation-et-espace-de-travail)
- [1.4 Abonnement et droits d'usage](#14-abonnement-et-droits-dusage)
- [1.5 Quotas et consommation](#15-quotas-et-consommation)
- [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement)
- [1.7 Plan de contrôle, plan de données et plan de gestion](#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)
- [1.8 Architecture de plateforme et architecture modulaire](#18-architecture-de-plateforme-et-architecture-modulaire)
- [1.9 Systèmes distribués](#19-systèmes-distribués)
- [1.10 Monolithe, monolithe modulaire et microservices](#110-monolithe-monolithe-modulaire-et-microservices)
- [1.11 Frontières de service](#111-frontières-de-service)

## 1.1 SaaS

### 1. Comprendre simplement

Un **SaaS** (*Software as a Service*, « logiciel en tant que service ») est un logiciel que l'on utilise par Internet, sans l'installer ni l'exploiter soi-même. Un fournisseur le fait fonctionner sur ses propres serveurs, le met à jour et assure sa disponibilité. Le client s'abonne et se connecte.

**Pourquoi cela existe.** Avant le SaaS, une entreprise achetait une licence, installait le logiciel sur ses serveurs, puis employait des équipes pour l'exploiter, le sauvegarder et le mettre à jour. Ce travail est coûteux, et il est répété chez chaque client. Le SaaS le déplace chez le fournisseur, qui le fait une seule fois pour tous.

**Problème résolu.** Livrer, exploiter et faire évoluer un même logiciel pour un grand nombre de clients, à un coût raisonnable.

**Modèle mental.** Pensez au réseau électrique. Vous branchez un appareil, mais vous n'exploitez pas de centrale. Vous payez selon un abonnement ou une consommation.

**Où l'analogie s'arrête.** L'électricité est un produit uniforme. Un logiciel contient vos données, peut être personnalisé, et une panne ou un changement du fournisseur vous touche directement.

**Exemple.** Une compagnie aérienne régionale suit la maintenance de ses avions avec une application web. Elle n'a aucun serveur à gérer. Le fournisseur déploie une nouvelle version chaque semaine, et la compagnie la reçoit sans rien faire.

**Les composants d'un SaaS.** On y trouve toujours cinq éléments :

1. une application ;
2. une infrastructure exploitée par le fournisseur ;
3. un accès par le réseau (navigateur ou API) ;
4. un modèle d'abonnement ;
5. une version du logiciel partagée par les clients.

**Objectif d'apprentissage :** à la fin de cette entrée, vous pouvez expliquer, avec vos propres mots, ce qui distingue un SaaS d'un logiciel installé chez le client, et pourquoi cela change la façon de concevoir le logiciel.

### 2. Connaissances essentielles

#### Définition

Un **SaaS** est un modèle de service dans lequel un fournisseur exploite une application sur une infrastructure cloud et la met à disposition de clients par le réseau. Le client ne gère ni l'infrastructure sous-jacente ni le code de l'application, sauf quelques réglages propres à son usage. Cette définition reprend, en la paraphrasant, celle de la publication SP 800-145 du NIST.

#### Idées fondamentales

1. **Le fournisseur exploite, le client utilise.** La charge d'exploitation (serveurs, mises à jour, sauvegardes) revient au fournisseur.
2. **L'accès passe par le réseau.** Le logiciel s'utilise depuis un navigateur ou par une API.
3. **Une version pour tous.** En général, tous les clients utilisent la même version, mise à jour en continu.
4. **On paie l'accès, pas la possession.** Le client s'abonne ou paie à la consommation.
5. **Le partage fait baisser le coût.** Plus le fournisseur partage son infrastructure et son exploitation entre clients, plus le coût par client diminue.
6. **Produit ou plateforme.** Un produit SaaS livre des fonctions figées. Une plateforme SaaS livre des primitives avec lesquelles d'autres construisent des applications.

#### Vocabulaire essentiel

- **Fournisseur** (*provider*, *vendor*) : l'organisation qui exploite le service.
- **Client** (*customer*) : l'organisation qui s'abonne au service.
- **Sur site** (*on-premise*) : modèle où le client installe et exploite lui-même le logiciel.
- **IaaS** (*Infrastructure as a Service*) : le fournisseur loue de l'infrastructure (machines, réseau, stockage).
- **PaaS** (*Platform as a Service*) : le fournisseur loue un environnement pour exécuter ses propres applications.
- **SaaS vertical** : un SaaS conçu pour un métier précis. Un **SaaS horizontal** sert de nombreux métiers avec la même fonction (par exemple la messagerie).
- **Cloud** : infrastructure informatique louée à la demande, accessible par le réseau.

#### Relations de cause à effet

- Une seule version est exploitée pour tous les clients. Une correction profite donc à tous, **mais** un défaut touche aussi tous les clients.
- Le client ne contrôle pas l'infrastructure. Il dépend donc du fournisseur pour la disponibilité, la sécurité et la conservation de ses données.
- Le fournisseur sert beaucoup de clients avec peu d'équipes. Il doit donc automatiser la création de comptes, les mises à jour et la supervision.

#### Idées reçues

- **« Toute application dans un navigateur est un SaaS. »** Faux. Ce qui compte est la personne qui exploite le logiciel. Une application web que vous hébergez vous-même n'est pas un SaaS.
- **« SaaS signifie multi-tenant. »** Pas nécessairement. Le multi-tenancy (voir [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy)) est un moyen courant de réduire les coûts, mais il ne fait pas partie de la définition. Un fournisseur peut déployer une instance dédiée par client et rester en SaaS.
- **« Un SaaS est moins sûr qu'un logiciel installé. »** Ce n'est pas une règle. La sécurité dépend de la conception et de l'exploitation, pas du modèle de livraison.

#### Principe clé

Le SaaS déplace l'exploitation du client vers le fournisseur, ce qui oblige le fournisseur à concevoir un système qu'il peut exploiter efficacement pour beaucoup de clients à la fois.

#### Si vous ne retenez que trois choses

1. Dans un SaaS, le fournisseur exploite le logiciel et le client l'utilise par le réseau.
2. Le modèle économique repose sur le partage : une version du logiciel pour plusieurs clients.
3. Une plateforme SaaS ne livre pas un métier : elle livre des primitives pour en construire.

### 3. Explication technique détaillée

#### Les trois modèles de service du cloud

Le NIST distingue trois modèles. Ils diffèrent par la part de la pile technique que le client gère.

| Couche | Sur site | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Application | Client | Client | Client | Fournisseur |
| Données (contenu et droits d'accès) | Client | Client | Client | Client |
| Environnement d'exécution | Client | Client | Fournisseur | Fournisseur |
| Système d'exploitation | Client | Client | Fournisseur | Fournisseur |
| Serveurs et virtualisation | Client | Fournisseur | Fournisseur | Fournisseur |
| Stockage et réseau | Client | Fournisseur | Fournisseur | Fournisseur |

**Comment lire ce tableau.** Plus on va vers la droite, moins le client gère. Même en SaaS, le client reste responsable du contenu qu'il saisit et des droits qu'il accorde à ses utilisateurs.

#### Du produit à la plateforme

| Critère | Produit SaaS | Plateforme SaaS |
|---|---|---|
| Ce qui est livré | Des fonctions métier figées | Des primitives configurables |
| Personnalisation | Quelques réglages | Modèle de données, règles et workflows définis par le client |
| Qui construit l'application métier | Le fournisseur | Le client, ou un partenaire, sur la plateforme |
| Risque principal | Ne pas couvrir un métier voisin | Complexité de configuration |

Le plan de formation vise la seconde colonne. Ce choix a une conséquence forte : le métier ne se trouve plus dans le code, il devient de la donnée de configuration (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)).

#### Ce que le modèle impose à l'architecture

1. **Servir plusieurs clients** avec un même logiciel, donc isoler les clients (voir [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy)).
2. **Livrer en continu** : une seule version à exploiter, donc des déploiements fréquents et sans interruption.
3. **Automatiser le cycle de vie** : créer, suspendre et supprimer un client sans intervention manuelle (voir [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement)).
4. **Mesurer et limiter l'usage** : sans cela, un client peut dégrader le service pour les autres (voir [1.5 Quotas et consommation](#15-quotas-et-consommation)).
5. **Observer** le système en production, car le fournisseur est seul responsable de son bon fonctionnement.

#### Cas limites et contre-exemple

**Contre-exemple.** Un progiciel de gestion installé sur les serveurs du client n'est pas un SaaS, même s'il a une interface web : c'est le client qui l'exploite.

**Cas limite.** Un fournisseur qui héberge une machine virtuelle dédiée par client et l'administre pour lui est proche du SaaS. Il perd cependant une partie des économies d'échelle, puisque chaque client a sa propre pile à mettre à jour.

**Limites du modèle.** Le client dépend de la connectivité et du fournisseur. Il peut être contraint par le rythme des mises à jour, par la localisation des données (souveraineté, réglementation) et par la difficulté de quitter le service (enfermement chez le fournisseur, ou *vendor lock-in*).

### 4. Relations avec les autres concepts

| Concept | Relation avec le SaaS |
|---|---|
| [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy) | Moyen principal de partager l'infrastructure entre clients |
| [1.4 Abonnement et droits d'usage](#14-abonnement-et-droits-dusage) | Traduit le modèle économique en règles d'accès |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | Décrit la vie d'un client de l'inscription à la suppression |
| [1.7 Plan de contrôle, plan de données et plan de gestion](#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | Sépare ce qui configure le service de ce qui sert les clients |
| [1.8 Architecture de plateforme et architecture modulaire](#18-architecture-de-plateforme-et-architecture-modulaire) | Décrit comment organiser une plateforme interne |

**Confusion à éviter.** *SaaS* décrit un modèle de livraison et d'exploitation. *Multi-tenancy* décrit une technique d'architecture. Les deux vont souvent ensemble, mais ils ne sont pas synonymes.

### 5. Application pratique

**Situation initiale.** Une compagnie aérienne régionale veut suivre les inspections de sa flotte. Elle hésite entre acheter un logiciel à installer et s'abonner à un service.

**Problème.** Installer le logiciel suppose des serveurs, une équipe pour l'exploiter, des sauvegardes et des mises à jour planifiées. La compagnie n'a pas ces compétences.

**Application du concept.** Elle s'abonne à un SaaS. Le fournisseur crée son espace, lui fournit un compte administrateur et exploite le service.

**Déroulé.**

1. La compagnie s'inscrit et choisit une offre.
2. Le fournisseur crée un espace isolé pour elle (voir [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement)).
3. L'administrateur invite ses techniciens.
4. Le fournisseur déploie des correctifs sans demander d'intervention à la compagnie.

**Résultat.** Le service est utilisable en quelques jours, sans infrastructure à gérer. La compagnie paie un abonnement.

**Limites.** La compagnie ne choisit pas la date des mises à jour. Elle doit vérifier où ses données sont hébergées et ce qui arrive si elle résilie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un logiciel installé chez le client et un SaaS, du point de vue de la personne qui l'exploite ?
2. **Compréhension.** Pourquoi une seule version du logiciel pour tous les clients est-elle à la fois un avantage et un risque ?
3. **Compréhension.** Quelle différence faites-vous entre un produit SaaS et une plateforme SaaS ?
4. **Pourquoi.** Pourquoi le modèle SaaS pousse-t-il le fournisseur à automatiser la création et la suppression des comptes clients ?
5. **Raisonnement pratique.** Un fournisseur héberge une application sur un serveur par client et la maintient lui-même. Est-ce du SaaS ? Quels éléments faut-il examiner pour répondre ?

#### Réponses

1. Dans le cas installé, le client exploite le logiciel. En SaaS, c'est le fournisseur qui l'exploite, et le client l'utilise par le réseau.
2. Avantage : une correction ou une amélioration profite à tous les clients en une seule fois. Risque : un défaut déployé touche tous les clients en même temps.
3. Un produit SaaS livre des fonctions métier fixes. Une plateforme SaaS livre des primitives (ressources, règles, rôles, workflows) que le client configure pour construire son application.
4. Le fournisseur sert de nombreux clients avec peu d'équipes. Une intervention manuelle par client ne passerait pas à l'échelle et serait source d'erreurs.
5. Oui, c'est du SaaS au sens de la définition, car le fournisseur exploite le service. Il faut ensuite examiner le coût : avec un serveur par client, les économies d'échelle sont faibles et chaque mise à jour doit être répétée.

## 1.2 Tenant et multi-tenancy

### 1. Comprendre simplement

Un **tenant** (« locataire ») est une organisation cliente de la plateforme, avec ses utilisateurs et ses données, qui dispose d'un espace logiquement séparé de celui des autres. La **multi-tenancy** est le fait qu'une seule installation du logiciel serve plusieurs tenants à la fois.

**Pourquoi cela existe.** Faire tourner une copie complète du logiciel par client coûte cher : infrastructure, supervision, mises à jour répétées. Partager une seule installation réduit ces coûts. En contrepartie, le fournisseur doit garantir que les clients ne voient ni ne perturbent les autres.

**Problème résolu.** Servir beaucoup de clients à un coût unitaire faible, sans exposer les données des uns aux autres.

**Modèle mental.** Un immeuble d'appartements. La structure, l'ascenseur et la plomberie sont partagés. Chaque appartement est privé et ferme à clé.

**Où l'analogie s'arrête.** Dans un immeuble, les murs sont physiques. En logiciel, la séparation est logique : elle dépend du code et de la configuration. Une erreur de programmation peut « percer le mur ». Le bruit du voisin a aussi un équivalent informatique, que l'on appelle le *voisin bruyant* (voir plus bas).

**Exemple.** Une compagnie aérienne et un hôpital utilisent la même plateforme. Chacun ne voit que ses propres données. Une nouvelle fonction, déployée une seule fois, profite aux deux.

**Les composants.**

1. un **identifiant de tenant** attaché à chaque donnée ;
2. un **contexte de tenant** connu à chaque requête ;
3. des **mécanismes d'isolation** (données, performances, configuration) ;
4. une **infrastructure partagée**.

**Objectif d'apprentissage :** vous pouvez expliquer ce qu'est un tenant, pourquoi la plateforme le partage avec d'autres, et quelle garantie le fournisseur doit apporter en échange.

### 2. Connaissances essentielles

#### Définition

Un **tenant** est l'unité d'isolation et de relation commerciale d'une plateforme : un client et l'ensemble de ses utilisateurs, données et configurations. La **multi-tenancy** est une architecture dans laquelle une même instance logicielle sert plusieurs tenants en les isolant logiquement les uns des autres.

#### Idées fondamentales

1. **Le tenant est l'unité d'isolation.** Les données, la configuration et les droits d'un tenant ne doivent jamais fuiter vers un autre.
2. **Un logiciel, plusieurs tenants.** Le code et l'infrastructure sont mutualisés, ce qui réduit le coût par client.
3. **L'isolation n'est pas facultative.** Elle porte sur les données, les performances, la sécurité et la configuration.
4. **Le tenant doit être connu à chaque requête.** Sans cela, le système ne sait pas quelles données il doit lire (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
5. **Le degré de partage est un choix de conception.** Il va du partage total à l'isolation complète (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant)).
6. **Un tenant n'est pas un utilisateur.** Un tenant regroupe de nombreux utilisateurs.

#### Vocabulaire essentiel

- **Tenant** (locataire) : une organisation cliente isolée.
- **Multi-tenancy** (multi-locataire) : architecture où plusieurs tenants partagent une instance.
- **Single-tenancy** (mono-locataire) : architecture où chaque tenant a sa propre instance.
- **Identifiant de tenant** (*tenant ID*) : valeur qui désigne un tenant, souvent attachée à chaque ligne de donnée.
- **Isolation** : ensemble des mécanismes qui empêchent un tenant d'accéder aux données d'un autre ou de les perturber.
- **Voisin bruyant** (*noisy neighbor*) : un tenant qui consomme tant de ressources partagées qu'il dégrade le service des autres.

#### Relations de cause à effet

- Plus on partage l'infrastructure, plus le coût par tenant baisse. **Mais** une faille d'isolation touche potentiellement plus de tenants.
- Un tenant consomme sans limite une ressource partagée. Les autres tenants subissent donc des lenteurs : il faut des quotas (voir [1.5 Quotas et consommation](#15-quotas-et-consommation)).
- Une seule version du logiciel est exploitée. Les mises à jour sont donc simples, **mais** chaque tenant doit accepter le même calendrier de changement.

#### Idées reçues

- **« Un tenant est un utilisateur. »** Faux. Un tenant est une organisation. Il compte de nombreux utilisateurs.
- **« Multi-tenant veut dire une seule base de données. »** Pas nécessairement. On peut partager la base, partager le serveur mais séparer les schémas, ou donner une base par tenant. Ces modèles sont décrits au module 5.
- **« Multi-tenant veut dire que tout le monde a la même application. »** Faux. Le comportement peut être configuré tenant par tenant. C'est même l'objet de ce parcours.

#### Principe clé

Un tenant est une frontière : tout ce qui est à l'intérieur est partagé entre ses utilisateurs, tout ce qui est à l'extérieur est interdit par défaut.

#### Si vous ne retenez que trois choses

1. Un tenant est une organisation cliente isolée ; ce n'est pas un utilisateur.
2. La multi-tenancy partage une installation pour réduire les coûts.
3. L'isolation entre tenants est la garantie centrale que le fournisseur doit apporter.

### 3. Explication technique détaillée

#### L'identifiant de tenant

**Ce que c'est.** Une valeur, souvent nommée `tenant_id`, qui est stockée avec chaque donnée appartenant à un tenant.

**Comment cela fonctionne.** Chaque requête qui lit ou écrit une donnée métier est filtrée par le tenant courant.

```sql
-- Lecture d'un aéronef : le filtre par tenant est obligatoire
SELECT *
FROM aircraft
WHERE tenant_id = :tenant_courant
  AND id = :aircraft_id;
```

**Pourquoi.** Sans ce filtre, la requête retournerait l'aéronef d'un autre tenant si l'identifiant `id` est connu ou deviné.

**Contre-exemple.** La requête `SELECT * FROM aircraft WHERE id = :aircraft_id` ne comporte pas le filtre. Elle fonctionne en test avec un seul tenant, puis provoque une fuite de données en production.

#### Les dimensions d'isolation

| Dimension | Question posée | Exemple de défaillance |
|---|---|---|
| Données | Un tenant peut-il lire les données d'un autre ? | Filtre `tenant_id` oublié |
| Performances | Un tenant peut-il ralentir les autres ? | Import massif qui sature la base |
| Configuration | Les réglages d'un tenant affectent-ils les autres ? | Règle globale modifiée par erreur |
| Sécurité | Une compromission reste-t-elle dans un tenant ? | Clé de chiffrement partagée |
| Coûts | Peut-on attribuer la consommation à chaque tenant ? | Usage non mesuré |

#### Single-tenant et multi-tenant

| Critère | Single-tenant | Multi-tenant |
|---|---|---|
| Coût par client | Élevé | Faible |
| Mises à jour | Répétées pour chaque instance | Une fois pour tous |
| Isolation | Forte, par construction | À garantir par conception |
| Personnalisation profonde | Facile | Doit passer par la configuration |
| Étendue d'un incident | Un tenant | Potentiellement tous les tenants |
| Complexité d'exploitation | Beaucoup d'instances | Une instance complexe |

#### Modes de défaillance fréquents

- **Filtre oublié** dans une requête : fuite de données.
- **Cache partagé** sans le tenant dans la clé : un tenant reçoit la réponse d'un autre.
- **Tâche de fond** exécutée sans contexte de tenant : elle traite ou mélange les données de plusieurs tenants.
- **Voisin bruyant** : un tenant sature une ressource commune.

**Limites.** La multi-tenancy n'est pas adaptée à tous les cas. Certains clients, par exigence réglementaire ou contractuelle, imposent des instances dédiées. C'est pourquoi les plateformes proposent souvent un modèle hybride (voir [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.1 SaaS](#11-saas) | La multi-tenancy est le moyen principal de réaliser les économies d'échelle du SaaS |
| [1.3 Compte, organisation et espace de travail](#13-compte-organisation-et-espace-de-travail) | Le tenant est une frontière technique ; compte et organisation sont des notions voisines à ne pas confondre |
| [1.5 Quotas et consommation](#15-quotas-et-consommation) | Les quotas limitent chaque tenant pour contenir le voisin bruyant |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Détaille les mécanismes d'isolation |
| [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | Détaille les modèles d'architecture (base partagée, schéma séparé, base séparée) |
| [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne) | La sécurité au niveau de la ligne renforce l'isolation dans la base de données |

### 5. Application pratique

**Situation initiale.** La plateforme sert déjà une compagnie aérienne. Un hôpital s'inscrit.

**Problème.** Les deux tenants ont des ressources de même type (par exemple des « équipements ») et des utilisateurs avec les mêmes noms de rôle. Aucun ne doit voir l'autre.

**Application du concept.** Chaque ressource porte un `tenant_id`. Chaque requête du moteur reçoit le tenant courant, déterminé à partir de l'identité de l'utilisateur authentifié.

**Déroulé.**

1. Un technicien de l'hôpital s'authentifie. Le jeton qu'il reçoit contient son tenant.
2. Il demande la liste des équipements.
3. Le moteur construit la requête avec le filtre sur ce tenant.
4. La base ne retourne que les équipements de l'hôpital.

**Résultat.** Les deux clients partagent le même logiciel et la même base, sans visibilité croisée.

**Limites.** Si un développeur écrit une requête sans filtre, la protection disparaît. On ajoute donc une défense en profondeur : un filtre appliqué au niveau de la base de données elle-même (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un tenant, et en quoi diffère-t-il d'un utilisateur ?
2. **Compréhension.** Quel est l'avantage économique de la multi-tenancy, et quel risque l'accompagne ?
3. **Compréhension.** Que signifie « voisin bruyant » ?
4. **Pourquoi.** Pourquoi le tenant doit-il être connu à chaque requête, et pas seulement à la connexion ?
5. **Raisonnement pratique.** Un cache applicatif stocke le résultat d'une recherche sous la clé `recherche:avions-actifs`. Quel problème cela peut-il poser dans une plateforme multi-tenant, et comment le corriger ?

#### Réponses

1. Un tenant est une organisation cliente avec ses données et sa configuration. Un utilisateur est une personne qui appartient à un tenant.
2. Le coût par client baisse, car l'infrastructure et l'exploitation sont partagées. Le risque est qu'une défaillance d'isolation expose ou perturbe plusieurs clients.
3. C'est un tenant dont la consommation de ressources partagées dégrade le service des autres tenants.
4. Parce que chaque opération sur une donnée doit être filtrée par tenant. Un contexte connu seulement à la connexion serait perdu dans les traitements internes, les tâches de fond ou les appels entre services.
5. Les résultats de tous les tenants partageraient la même clé : un tenant pourrait recevoir les avions d'un autre. Il faut inclure le tenant dans la clé de cache, par exemple `tenant-42:recherche:avions-actifs`.

## 1.3 Compte, organisation et espace de travail

### 1. Comprendre simplement

Les mots **compte** (*account*), **organisation** (*organization*) et **espace de travail** (*workspace*) désignent des choses proches mais différentes. Ils sont souvent confondus, car leurs définitions varient d'un produit à l'autre.

**Pourquoi cela existe.** Une plateforme doit répondre à quatre questions distinctes : *Qui paie ?* *Qui est isolé des autres ?* *Qui travaille avec qui ?* *Qui est la personne qui se connecte ?* Un même mot ne peut pas répondre à toutes.

**Problème résolu.** Donner un vocabulaire précis aux frontières commerciales, organisationnelles et collaboratives de la plateforme.

**Modèle mental.** Une entreprise cliente :

- le **compte** est sa relation commerciale avec le fournisseur (contrat, facturation) ;
- l'**organisation** est sa structure : filiales, services ;
- l'**espace de travail** est un lieu de collaboration : un projet, une équipe, un site ;
- le **tenant** est la frontière technique qui isole ses données.

**Où l'analogie s'arrête.** Dans de nombreux produits, ces quatre notions coïncident : un client est à la fois un compte, une organisation et un tenant. Elles ne se séparent qu'avec la croissance du produit.

**Exemple.** La compagnie aérienne régionale a un contrat unique (un compte). Elle possède deux filiales, chacune avec ses propres directeurs (deux organisations). Chaque base aéroportuaire dispose de son espace de travail.

**Objectif d'apprentissage :** vous pouvez dire à quelle question répond chacun de ces trois termes, et expliquer pourquoi il vaut mieux les modéliser séparément dès le départ.

### 2. Connaissances essentielles

#### Définition

- **Compte** : selon le contexte, soit la relation contractuelle et commerciale d'un client avec le fournisseur (compte client), soit l'identité de connexion d'une personne (compte utilisateur).
- **Organisation** : un groupe structuré de personnes, éventuellement hiérarchique, qui représente une entité légale ou fonctionnelle du client.
- **Espace de travail** : un espace logique, à l'intérieur d'une organisation ou d'un tenant, où des personnes collaborent autour de données et de configurations communes.

#### Idées fondamentales

1. **Chaque terme répond à une question différente.** Facturation, structure, collaboration, identité.
2. **Les définitions varient d'un produit à l'autre.** Il faut toujours préciser le sens retenu.
3. **Le tenant est la frontière technique d'isolation.** Les trois autres notions sont plutôt fonctionnelles.
4. **Une personne n'est pas une appartenance.** L'identité d'une personne est distincte de ses appartenances à une ou plusieurs organisations.
5. **Séparer tôt coûte moins cher que séparer tard.** Fusionner ces notions simplifie le départ, mais rend difficiles les besoins d'entreprise (filiales, consultants multi-clients).

#### Vocabulaire essentiel

- **Compte client** (*customer account*) : l'entité qui contracte et paie.
- **Compte utilisateur** (*user account*) : l'identité avec laquelle une personne se connecte.
- **Organisation** : une structure de personnes et de sous-structures.
- **Espace de travail** (*workspace*) : un espace de collaboration délimité.
- **Appartenance** (*membership*) : le lien entre une personne et une organisation ou un espace, généralement porteur d'un rôle.
- **Propriétaire** (*owner*) : la personne ou l'entité responsable d'un compte ou d'un espace.

#### Relations de cause à effet

- Si on confond compte client et tenant, un client qui veut deux environnements (test et production) oblige à dupliquer son contrat.
- Si on confond compte utilisateur et appartenance, un consultant qui travaille pour deux clients doit avoir deux comptes et deux mots de passe.
- Si on modélise l'organisation comme une simple liste, on ne peut plus représenter une hiérarchie (filiales, services).

#### Idées reçues

- **« Un compte, c'est un utilisateur. »** Pas toujours. Le même mot désigne parfois l'utilisateur, parfois le client contractant. Il faut lever l'ambiguïté.
- **« Organisation et tenant sont synonymes. »** Non. Un tenant peut contenir plusieurs organisations. Inversement, une grande organisation peut disposer de plusieurs tenants.
- **« Un espace de travail est une zone de sécurité forte. »** Pas nécessairement. L'isolation est garantie par le tenant ; l'espace de travail sert surtout à organiser.

#### Principe clé

Un terme par question : le compte pour la relation commerciale, l'organisation pour la structure, l'espace de travail pour la collaboration, le tenant pour l'isolation.

#### Si vous ne retenez que trois choses

1. Compte, organisation, espace de travail et tenant répondent à quatre questions différentes.
2. Ces mots n'ont pas de définition universelle : précisez toujours le sens retenu.
3. Une personne est distincte de ses appartenances ; un même utilisateur peut appartenir à plusieurs organisations.

### 3. Explication technique détaillée

#### Les quatre notions côte à côte

| Notion | Question | Exemple | Lien avec la facturation | Lien avec l'isolation |
|---|---|---|---|---|
| Compte client | Qui est le client contractant ? | La compagnie aérienne | Direct | Indirect |
| Tenant | Qui est isolé des autres ? | L'espace de la compagnie | Souvent 1 pour 1 | Direct |
| Organisation | Quelle est la structure ? | Filiale nord, filiale sud | Parfois (facturation par filiale) | Parfois |
| Espace de travail | Qui collabore sur quoi ? | Base de Lyon | Rarement | Faible |

#### Le modèle de l'appartenance

Une personne est représentée une seule fois. Ses liens avec les organisations passent par une table d'appartenances.

```text
UTILISATEUR ──< APPARTENANCE >── ORGANISATION
 (identité)      rôle, statut       (structure)
```

**Pourquoi.** Cette séparation permet à une personne d'avoir des rôles différents selon l'organisation, sans dupliquer son identité.

**Exemple.** Une auditrice externe appartient à deux compagnies aériennes. Elle est « lectrice » dans la première et « approbatrice » dans la seconde.

#### Quatre configurations courantes

| Configuration | Description | Cas d'usage |
|---|---|---|
| 1 compte = 1 tenant = 1 organisation | Tout coïncide | Petit client, produit simple |
| 1 compte, plusieurs tenants | Un contrat, des environnements séparés | Test et production |
| 1 tenant, plusieurs organisations | Une instance partagée entre filiales | Groupe avec filiales |
| 1 organisation, plusieurs espaces | Collaboration par équipe ou projet | Grande entreprise |

**Limites.** Certains produits regroupent plusieurs espaces de travail sous une organisation supérieure, d'autres non. Aucun modèle n'est universel : l'important est de rendre explicite ce que chaque terme représente dans la plateforme.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy) | Le tenant est la frontière technique ; ici on précise les notions voisines |
| [1.4 Abonnement et droits d'usage](#14-abonnement-et-droits-dusage) | L'abonnement est rattaché au compte client |
| [4.2 Utilisateur, groupe, équipe et organisation](04-identite-iam-autorisation.md#42-utilisateur-groupe-équipe-et-organisation) | L'organisation y est reprise du point de vue de l'identité et des groupes |
| [5.1 La hiérarchie d'entreprise](05-multi-tenancy-modele-entreprise.md#51-la-hiérarchie-dentreprise) | Détaille la hiérarchie : plateforme, tenant, organisation, unité, équipe, utilisateur |
| [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès) | L'administration gère les appartenances et les rôles |

### 5. Application pratique

**Situation initiale.** La compagnie aérienne régionale veut distinguer deux filiales (nord et sud) avec des directeurs différents, mais garder un seul contrat.

**Problème.** Si le modèle ne connaît que « le client », les deux filiales partagent les mêmes droits et la même facturation.

**Application du concept.** Un compte client, un tenant, deux organisations (nord, sud). Chaque organisation a ses propres appartenances et rôles.

**Déroulé.**

1. Le fournisseur crée le compte client et le tenant.
2. L'administrateur crée les deux organisations.
3. Les utilisateurs reçoivent une appartenance par organisation, avec un rôle.
4. La facturation reste attachée au compte client.

**Résultat.** Chaque filiale gère ses utilisateurs, et le contrat reste unique.

**Limites.** Si le client veut une isolation stricte des données entre les deux filiales, une simple séparation en organisations ne suffit pas : il faut des permissions de données par organisation (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)) ou des tenants distincts.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quelle question répond le « compte client » ? Et l'« espace de travail » ?
2. **Compréhension.** Pourquoi le mot « compte » est-il ambigu ?
3. **Compréhension.** Citez une configuration où un compte client possède plusieurs tenants.
4. **Pourquoi.** Pourquoi représente-t-on l'appartenance d'un utilisateur à une organisation par une relation séparée plutôt que par un champ de l'utilisateur ?
5. **Raisonnement pratique.** Un client veut un environnement de test et un environnement de production sous un seul contrat. Quelle structure proposez-vous ?

#### Réponses

1. Le compte client répond à la question « qui est le client contractant ? ». L'espace de travail répond à « qui collabore sur quoi ? ».
2. Parce qu'il désigne tantôt l'identité de connexion d'une personne, tantôt la relation contractuelle d'une organisation.
3. Un client qui souhaite un environnement de test et un environnement de production : un compte, deux tenants.
4. Parce qu'une personne peut appartenir à plusieurs organisations, avec un rôle différent dans chacune. Un champ unique ne le permettrait pas.
5. Un compte client, deux tenants (test et production). Le contrat et la facturation restent rattachés au compte ; chaque tenant a ses données et sa configuration propres.

## 1.4 Abonnement et droits d'usage

### 1. Comprendre simplement

Un **abonnement** (*subscription*) est le contrat par lequel un client obtient l'accès à la plateforme : offre choisie, période, prix, état. Un **droit d'usage** (*entitlement*) est ce que le client a, en conséquence, le droit d'utiliser : telle fonction, tel module, telle limite.

**Pourquoi cela existe.** Une plateforme commercialise souvent plusieurs offres (par exemple « Essentiel » et « Pro »). Le logiciel doit savoir, à chaque action, si le client y a droit.

**Problème résolu.** Relier une décision commerciale (l'offre vendue) à un comportement technique (ce que la plateforme autorise).

**Modèle mental.** Une carte d'accès à un hôtel. L'abonnement est la réservation. Les droits d'usage sont les portes que la carte ouvre : chambre, salle de sport, spa.

**Où l'analogie s'arrête.** La carte d'hôtel est statique. En SaaS, les droits peuvent changer à tout moment : changement d'offre, impayé, essai qui se termine, accord particulier négocié.

**Exemple.** La compagnie aérienne souscrit l'offre « Pro », qui inclut le module d'automatisation. L'hôpital a l'offre « Essentiel », sans ce module. Un administrateur de l'hôpital ne peut donc pas créer d'automatisation, même s'il en a la volonté.

**Objectif d'apprentissage :** vous pouvez distinguer l'abonnement, qui est un contrat, du droit d'usage, qui est une capacité vérifiée au moment de l'action.

### 2. Connaissances essentielles

#### Définition

- **Abonnement** : relation contractuelle entre un compte client et le fournisseur, caractérisée par une offre, une période, un prix et un état (essai, actif, en impayé, résilié).
- **Droit d'usage** (*entitlement*) : capacité, fonction ou limite que le client est autorisé à utiliser, déduite de son abonnement et de ses accords particuliers.

#### Idées fondamentales

1. **L'abonnement est le contrat ; le droit d'usage en est la conséquence technique.**
2. **L'offre se traduit en droits.** Une offre est un ensemble nommé de droits.
3. **Le droit est vérifié à l'exécution.** Il ne suffit pas de masquer un bouton : le serveur doit refuser l'action.
4. **Droit d'usage et permission sont deux contrôles distincts.** Le premier porte sur le tenant, le second sur l'utilisateur.
5. **Les droits évoluent dans le temps.** Essai, mise à niveau, impayé, dérogation.

#### Vocabulaire essentiel

- **Offre** ou **plan** (*plan*) : un ensemble nommé de droits et de prix.
- **Période d'essai** (*trial*) : période gratuite ou à tarif réduit avant engagement.
- **Impayé** (*past due*) : état où un paiement attendu n'est pas reçu.
- **Dérogation** (*override*) : droit accordé hors de l'offre standard à un client précis.
- **Période de grâce** (*grace period*) : délai après un impayé avant retrait des droits.
- **Fonction** (*feature*) : capacité fonctionnelle de la plateforme.

#### Relations de cause à effet

- L'offre change (mise à niveau). Les droits du tenant changent, et de nouvelles fonctions doivent apparaître sans nouveau déploiement.
- Le paiement échoue. L'abonnement passe en impayé. Après la période de grâce, certains droits sont retirés.
- Une fonction n'est vérifiée que dans l'interface. Un appel direct à l'API contourne alors la restriction commerciale.

#### Idées reçues

- **« Les droits d'usage sont des permissions. »** Non. Une permission dit ce qu'un utilisateur peut faire dans le tenant. Un droit d'usage dit ce que le tenant a le droit d'utiliser. Une action exige les deux.
- **« Un drapeau de fonctionnalité (*feature flag*) et un droit d'usage, c'est la même chose. »** Non. Le drapeau est un outil de déploiement technique (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)). Le droit d'usage est une décision commerciale. Les deux peuvent se combiner.
- **« Il suffit de cacher la fonction dans l'interface. »** Non. La vérification doit se faire côté serveur.

#### Principe clé

L'abonnement dit ce que le client a acheté ; le droit d'usage dit ce que la plateforme lui laisse faire, et il est vérifié à chaque action.

#### Si vous ne retenez que trois choses

1. L'abonnement est un contrat ; le droit d'usage est une capacité technique qui en découle.
2. Une action réussit si l'utilisateur a la permission **et** si le tenant a le droit d'usage.
3. Le droit d'usage se vérifie côté serveur, pas seulement dans l'interface.

### 3. Explication technique détaillée

#### Le modèle de données

```text
OFFRE ──< OFFRE_DROIT >── DROIT
  │
  └──< ABONNEMENT >── COMPTE CLIENT
            │
            └── DÉROGATION (droit ajouté ou retiré pour un client précis)
```

**Comment cela fonctionne.** Le droit effectif d'un tenant est calculé ainsi : droits de l'offre, plus les dérogations positives, moins les dérogations négatives. Le résultat est souvent stocké sous une forme prête à être lue (un ensemble de droits par tenant).

**Pourquoi.** Calculer à chaque requête serait coûteux. Stocker le résultat accélère la vérification, au prix d'une synchronisation à gérer.

#### Vérification à l'exécution

```json
{
  "tenant": "airline-regional",
  "plan": "pro",
  "entitlements": {
    "automation": true,
    "max_workflows": 50,
    "api_access": true
  }
}
```

Une action qui crée un workflow vérifie :

1. la permission de l'utilisateur (« peut configurer les workflows ») ;
2. le droit du tenant (`automation` est vrai) ;
3. la limite du tenant (`max_workflows` n'est pas atteinte, voir [1.5 Quotas et consommation](#15-quotas-et-consommation)).

#### Synchronisation avec la facturation

Le système de facturation est la source de vérité de l'abonnement. La plateforme reçoit des notifications de changement, et recalcule les droits.

**Mode de défaillance.** Si la notification est perdue, la plateforme garde de mauvais droits. On prévoit donc une réconciliation périodique entre le système de facturation et la plateforme.

#### Limites

- Les droits se vérifient à de nombreux endroits. Les disperser dans le code rend toute évolution commerciale douloureuse. Il vaut mieux un point de vérification unique.
- Un retrait de droit pose un problème de données : que devient une automatisation déjà créée quand le client rétrograde son offre ? C'est une décision métier à prendre explicitement (suspendre, conserver en lecture seule, supprimer).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.3 Compte, organisation et espace de travail](#13-compte-organisation-et-espace-de-travail) | L'abonnement est rattaché au compte client |
| [1.5 Quotas et consommation](#15-quotas-et-consommation) | Les limites chiffrées d'un droit sont des quotas |
| [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée) | Les permissions portent sur les utilisateurs ; les droits d'usage portent sur le tenant |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les drapeaux de fonctionnalité servent le déploiement, pas le contrat |
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | L'état de l'abonnement pilote le cycle de vie du tenant |

### 5. Application pratique

**Situation initiale.** L'hôpital, offre « Essentiel », demande l'accès aux automatisations.

**Problème.** La fonction n'est pas incluse dans son offre. Le fournisseur veut permettre une mise à niveau immédiate, sans intervention d'un développeur.

**Application du concept.** L'interface détecte l'absence du droit `automation` et propose la mise à niveau. L'API refuse l'action tant que le droit n'est pas présent.

**Déroulé.**

1. L'administrateur de l'hôpital tente de créer une automatisation.
2. Le moteur vérifie la permission : accordée. Il vérifie le droit : absent.
3. Le moteur répond par un refus explicite (« fonction non incluse dans votre offre »).
4. L'hôpital passe à l'offre « Pro ». La facturation notifie la plateforme.
5. La plateforme recalcule les droits. L'action réussit à la tentative suivante.

**Résultat.** La mise à niveau est effective en quelques secondes, sans déploiement.

**Limites.** Le message de refus doit distinguer « vous n'avez pas la permission » de « votre offre ne le permet pas », sinon l'utilisateur ne sait pas à qui s'adresser (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un abonnement et un droit d'usage ?
2. **Compréhension.** Pourquoi une permission et un droit d'usage sont-ils deux contrôles distincts ?
3. **Compréhension.** Pourquoi la vérification d'un droit doit-elle avoir lieu côté serveur ?
4. **Pourquoi.** Pourquoi stocke-t-on souvent le résultat du calcul des droits plutôt que de le recalculer à chaque requête ?
5. **Raisonnement pratique.** Un client rétrograde son offre et perd la fonction d'automatisation. Que faut-il décider pour les automatisations existantes ?

#### Réponses

1. L'abonnement est le contrat commercial. Le droit d'usage est la capacité technique qui en découle et que la plateforme vérifie.
2. La permission concerne l'utilisateur (son rôle). Le droit concerne le tenant (son offre). Une action doit satisfaire les deux : un administrateur peut avoir la permission sans que le tenant ait le droit.
3. Parce que l'interface peut être contournée par un appel direct à l'API. Seul le serveur garantit l'application de la règle.
4. Pour réduire le coût de chaque vérification. Le prix à payer est une synchronisation à maintenir quand l'offre ou les dérogations changent.
5. Il faut décider explicitement du sort de l'existant : le désactiver, le conserver en lecture seule, ou le supprimer après un délai. Cette règle doit être communiquée au client avant la rétrogradation.

## 1.5 Quotas et consommation

### 1. Comprendre simplement

La **consommation** (*usage*) est la quantité de ressources qu'un tenant utilise réellement : appels d'API, stockage, nombre d'utilisateurs, nombre d'enregistrements. Un **quota** est la limite fixée sur cette consommation.

**Pourquoi cela existe.** Les ressources de la plateforme sont partagées. Sans limite, un client pourrait en consommer assez pour ralentir les autres. Et sans mesure, le fournisseur ne sait pas ce qu'il doit facturer.

**Problème résolu.** Protéger le service contre les abus et les excès de consommation, et fournir la base de la tarification à l'usage.

**Modèle mental.** Un forfait de téléphonie. La consommation est le nombre de gigaoctets déjà utilisés. Le quota est le volume inclus dans le forfait.

**Où l'analogie s'arrête.** Un forfait mobile mesure à l'unité d'un seul appareil. Dans une plateforme, on mesure et on limite à plusieurs niveaux : par tenant, par utilisateur, par clé d'API, par type de ressource.

**Exemple.** L'offre « Essentiel » autorise 10 000 aéronefs et 100 requêtes d'API par minute. La consommation du tenant est de 7 800 aéronefs et de 40 requêtes par minute.

**Objectif d'apprentissage :** vous pouvez expliquer la différence entre mesurer (consommation), limiter (quota) et autoriser (droit d'usage), et dire pourquoi les trois coexistent.

### 2. Connaissances essentielles

#### Définition

- **Consommation** (*usage*) : mesure de la quantité d'une ressource utilisée par un tenant (ou un utilisateur) sur une période ou à un instant donné.
- **Quota** : limite maximale fixée à la consommation d'une ressource, par tenant ou par autre portée.

#### Idées fondamentales

1. **Mesurer précède limiter.** On ne peut pas appliquer un quota sans compter.
2. **Un quota protège le service et soutient le modèle économique.**
3. **Limite ferme ou limite souple.** Une limite ferme refuse l'action ; une limite souple alerte ou autorise un dépassement facturé.
4. **Les quotas ont une portée et une fenêtre.** Par tenant ou par utilisateur ; par minute, par mois, ou en total.
5. **Compter est un problème distribué.** Plusieurs requêtes simultanées peuvent dépasser le quota si le contrôle n'est pas atomique.

#### Vocabulaire essentiel

- **Mesure** (*metering*) : collecte des événements de consommation.
- **Limite ferme** (*hard limit*) : l'action est refusée au-delà du quota.
- **Limite souple** (*soft limit*) : un dépassement déclenche une alerte ou une facturation.
- **Fenêtre** (*window*) : période sur laquelle on compte (minute, jour, mois).
- **Rafale** (*burst*) : pic de consommation de courte durée toléré au-dessus du rythme moyen.
- **Facturation à l'usage** (*usage-based billing*) : facturation proportionnelle à la consommation mesurée.

#### Relations de cause à effet

- Un tenant dépasse sa limite de requêtes. Le moteur répond par un refus temporaire. Les autres tenants ne sont pas affectés.
- La mesure est incomplète. La facturation est inexacte, et le quota est contournable.
- Le contrôle de quota est lent. Il devient lui-même un goulot d'étranglement pour chaque requête.

#### Idées reçues

- **« Un quota est un droit d'usage. »** Non. Le droit dit « vous pouvez utiliser les automatisations ». Le quota dit « jusqu'à 50 ». Le quota est la limite chiffrée portée par le droit.
- **« Une limite doit toujours bloquer. »** Non. Beaucoup de plateformes préfèrent alerter, ralentir ou facturer le dépassement.
- **« Un compteur exact est toujours possible à moindre coût. »** Non. À grande échelle, on accepte souvent une précision approchée sur des quotas souples.

#### Principe clé

On mesure d'abord, on limite ensuite : le quota n'est fiable que si la consommation est correctement mesurée.

#### Si vous ne retenez que trois choses

1. La consommation est mesurée ; le quota est la limite appliquée à cette mesure.
2. Un quota peut être ferme ou souple, par tenant ou par utilisateur, sur une fenêtre de temps.
3. Contrôler un quota sans verrouillage atomique permet des dépassements en cas de requêtes simultanées.

### 3. Explication technique détaillée

#### Mesure et limite

**Formules.** Soit $Q$ le quota et $U$ la consommation courante :

$$\text{restant} = Q - U \qquad\qquad \text{taux d'utilisation} = \frac{U}{Q}$$

**Exemple chiffré.** Avec $Q = 10\,000$ aéronefs et $U = 7\,800$, il reste $2\,200$ aéronefs et le taux d'utilisation est de $78\,\%$. Une alerte peut être déclenchée à $80\,\%$.

#### Trois familles de quotas

| Famille | Exemple | Fenêtre | Mécanisme typique |
|---|---|---|---|
| Quota de stock | Nombre d'aéronefs | Aucune (total) | Compteur mis à jour à chaque création et suppression |
| Quota de débit | 100 requêtes par minute | Glissante ou fixe | Limitation de débit (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)) |
| Quota cumulé | 1 000 000 d'appels par mois | Mensuelle | Compteur remis à zéro à la période |

#### Le problème de l'atomicité

Deux requêtes simultanées lisent la consommation (9 999), voient qu'il reste une unité, et créent chacune une ressource. Le total devient 10 001.

```text
Requête A : lit 9 999 ─► autorise ─► écrit 10 000
Requête B : lit 9 999 ─► autorise ─► écrit 10 000   (devrait être refusée)
```

**Solutions possibles.** Une incrémentation atomique avec condition dans la base de données, un verrou, ou une réservation de quota. À défaut, on accepte un dépassement borné pour un quota souple.

#### Pipeline de mesure

```text
Action métier ─► Événement d'usage ─► Agrégation ─► Compteurs ─► Facturation / Alertes
```

**Point de vigilance.** Les événements d'usage doivent être traités de façon idempotente (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)) : un événement rejoué ne doit pas être compté deux fois.

**Limites.** Un quota mal choisi gêne l'utilisateur légitime. Il faut le choisir selon l'usage réel, afficher la consommation au client et prévoir un processus de relèvement.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.4 Abonnement et droits d'usage](#14-abonnement-et-droits-dusage) | Les droits d'usage portent les limites chiffrées |
| [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy) | Les quotas contiennent le voisin bruyant |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit est un quota de débit appliqué à l'API |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | Le comptage doit être idempotent |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité s'appuie sur la consommation mesurée |

### 5. Application pratique

**Situation initiale.** Un client de l'offre « Essentiel » importe chaque nuit des milliers d'enregistrements et sature la base partagée aux heures de bureau de l'hôpital.

**Problème.** Un tenant dégrade le service des autres.

**Application du concept.** Un quota de débit (requêtes par minute) et un quota de stock (nombre d'enregistrements) sont appliqués par tenant.

**Déroulé.**

1. L'import envoie des lots de requêtes.
2. La plateforme compte les requêtes dans la fenêtre d'une minute.
3. Au-delà du quota, elle répond « réessayez plus tard ».
4. L'import ralentit son rythme et termine sans perturber les autres.

**Résultat.** Le voisin bruyant est contenu. Le fournisseur propose une offre supérieure pour qui veut un débit plus élevé.

**Limites.** Si les refus ne sont pas expliqués dans la réponse, le client ne sait pas s'il s'agit d'un incident ou d'une limite.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre la consommation et le quota ?
2. **Compréhension.** Quelle différence y a-t-il entre une limite ferme et une limite souple ?
3. **Compréhension.** Pourquoi faut-il mesurer avant de pouvoir limiter ?
4. **Pourquoi.** Pourquoi un contrôle de quota non atomique peut-il laisser dépasser la limite ?
5. **Raisonnement pratique.** Une facturation à l'usage compte deux fois certains appels d'API après une panne. Quelle propriété manque dans la chaîne de mesure ?

#### Réponses

1. La consommation est la valeur mesurée. Le quota est la valeur maximale autorisée.
2. Une limite ferme refuse l'action au-delà du seuil. Une limite souple alerte ou autorise le dépassement, éventuellement facturé.
3. Parce qu'une limite se définit par rapport à une valeur courante. Sans mesure fiable, on ne sait pas si elle est dépassée.
4. Parce que deux requêtes simultanées peuvent lire la même valeur, la juger acceptable et l'incrémenter chacune, ce qui donne un total supérieur à la limite.
5. L'idempotence du traitement des événements d'usage : un événement rejoué après la panne doit être reconnu et ne pas être compté une seconde fois.

## 1.6 Cycle de vie SaaS, provisionnement et déprovisionnement

### 1. Comprendre simplement

Le **cycle de vie SaaS** (*SaaS lifecycle*) est la suite d'étapes que traverse un client, de son inscription à la suppression de ses données. Le **provisionnement** (*provisioning*) est l'opération qui crée tout ce dont un nouveau client a besoin. Le **déprovisionnement** (*deprovisioning*) est l'opération inverse : retirer l'accès et supprimer proprement ce qui a été créé.

**Pourquoi cela existe.** Un fournisseur qui crée un client à la main ne peut pas en servir des milliers. Il faut que la naissance et la fin d'un client soient automatiques, répétables et sûres.

**Problème résolu.** Rendre l'arrivée et le départ d'un client rapides, fiables et conformes aux obligations de conservation des données.

**Modèle mental.** L'arrivée d'un locataire dans un immeuble : on crée le bail, on remet les clés, on branche les compteurs. Au départ, on récupère les clés, on fait l'état des lieux, on coupe les compteurs.

**Où l'analogie s'arrête.** Un déménagement n'efface pas la mémoire du bâtiment. En SaaS, la suppression de données a des conséquences légales et techniques précises (sauvegardes, journaux, preuves).

**Exemple.** L'hôpital s'inscrit. La plateforme crée en quelques secondes son espace, son administrateur, sa configuration par défaut et ses quotas. À la résiliation, la plateforme coupe les accès, laisse un délai de récupération, puis supprime les données.

**Les étapes.**

1. acquisition (inscription, essai) ;
2. provisionnement ;
3. utilisation active (changements d'offre) ;
4. suspension éventuelle ;
5. déprovisionnement ;
6. conservation puis suppression.

**Objectif d'apprentissage :** vous pouvez décrire les étapes de la vie d'un client et expliquer pourquoi le provisionnement doit être automatique et répétable sans effet secondaire.

### 2. Connaissances essentielles

#### Définition

- **Cycle de vie SaaS** : suite des états par lesquels passe la relation entre un client et la plateforme, de l'inscription à la suppression.
- **Provisionnement** : ensemble des actions qui créent les ressources, configurations et accès nécessaires à un nouveau client (ou à une nouvelle capacité).
- **Déprovisionnement** : ensemble des actions qui retirent les accès et libèrent ou suppriment les ressources d'un client, ou d'une capacité, qui n'est plus utilisée.

#### Idées fondamentales

1. **Le cycle de vie est un parcours d'états.** Essai, actif, suspendu, supprimé.
2. **Le provisionnement est une procédure automatique.** Il crée plusieurs éléments qui doivent rester cohérents.
3. **Le provisionnement doit être répétable.** Rejoué après une erreur, il ne crée pas de doublons.
4. **Le déprovisionnement est plus délicat que le provisionnement.** Il touche aux obligations légales et à la récupération des données.
5. **Les états du client pilotent le comportement du système.** Un client suspendu ne peut plus écrire ; un client supprimé n'existe plus.

#### Vocabulaire essentiel

- **Intégration** (*onboarding*) : processus d'accueil d'un nouveau client.
- **Sortie** (*offboarding*) : processus de départ d'un client.
- **Suspension** : état où l'accès est restreint ou coupé sans suppression des données.
- **Période de rétention** (*retention period*) : durée pendant laquelle les données sont conservées après la fin du contrat.
- **Suppression logique** (*soft delete*) et **suppression physique** (*hard delete*) : marquer comme supprimé, ou effacer réellement.
- **Droit à l'effacement** : droit prévu par le RGPD (article 17) d'obtenir la suppression de données personnelles dans certaines conditions.

#### Relations de cause à effet

- Un impayé fait passer le tenant à l'état suspendu. Le moteur refuse les écritures, mais conserve les données.
- Un provisionnement s'interrompt à mi-chemin. Si l'opération n'est pas répétable, on obtient un client à moitié créé.
- Un déprovisionnement oublie un élément (une clé d'API, un fichier). On laisse des accès ou des données qui auraient dû disparaître.

#### Idées reçues

- **« Provisionner, c'est créer une ligne en base. »** Non. Cela peut impliquer des ressources d'infrastructure, des clés, des utilisateurs, des configurations par défaut.
- **« Supprimer un client, c'est effacer sa ligne. »** Non. Les sauvegardes, les journaux d'audit, les fichiers et les copies dans des systèmes tiers doivent aussi être traités.
- **« La suppression doit être immédiate. »** Pas toujours. Un délai de récupération protège contre les erreurs, et une obligation légale peut imposer de conserver certaines données.

#### Principe clé

Un cycle de vie explicite et automatisé transforme l'arrivée et le départ d'un client en procédures fiables, au lieu d'interventions manuelles risquées.

#### Si vous ne retenez que trois choses

1. Le client traverse des états : essai, actif, suspendu, supprimé.
2. Provisionner et déprovisionner sont des procédures automatiques, qui doivent pouvoir être rejouées sans dommage.
3. La suppression est un processus avec délai, conservation et vérification, pas un simple effacement.

### 3. Explication technique détaillée

#### Les états du tenant

```text
inscription
     │
     ▼
  ┌───────┐ conversion ┌───────┐   impayé   ┌──────────┐
  │ ESSAI ├───────────►│ ACTIF ├───────────►│ SUSPENDU │
  └───┬───┘            └───┬───┘            └────┬─────┘
      │ expiration         │ résiliation         │ rétention échue
      │                    │                     │ (si régularisation : retour à ACTIF)
      ▼                    ▼                     ▼
  ┌───────────────────────────────────────────────────┐
  │               EN COURS DE SUPPRESSION             │
  └─────────────────────────┬─────────────────────────┘
                            ▼
                        SUPPRIMÉ
```

**Pourquoi un état explicite.** Chaque état change ce que la plateforme autorise. Le modèle d'état et de transition est détaillé au module 6 (voir [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états)).

#### Les étapes du provisionnement

| Étape | Exemple | Point d'attention |
|---|---|---|
| Créer le tenant | Identifiant, nom, région | Unicité de l'identifiant |
| Créer les accès | Administrateur initial, rôles par défaut | Ne jamais envoyer de mot de passe en clair |
| Appliquer la configuration par défaut | Types de ressources de départ, modèles | Versionner les modèles de démarrage |
| Fixer les droits et quotas | Selon l'offre | Cohérence avec la facturation |
| Rattacher aux systèmes tiers | Facturation, messagerie, supervision | Échec partiel possible |

**Idempotence.** Chaque étape vérifie si son résultat existe déjà avant de le créer. Un provisionnement relancé après une panne reprend où il s'était arrêté.

**Mode de défaillance.** Si l'étape 5 échoue, que faire des étapes 1 à 4 ? Deux stratégies : réessayer jusqu'à la réussite, ou défaire les étapes déjà faites. Cette logique est celle d'une *saga* (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)).

#### Les étapes du déprovisionnement

1. **Suspendre** l'accès et révoquer les sessions et les clés.
2. **Proposer l'export** des données au client.
3. **Attendre** la période de rétention.
4. **Supprimer** les données et les ressources associées.
5. **Vérifier** et conserver la preuve de la suppression.

**Exemple chiffré.** Avec une rétention de 30 jours, un client qui résilie le 1er mars peut récupérer ses données jusqu'au 31 mars ; la suppression physique intervient ensuite.

**Limites.** Les sauvegardes contiennent encore les données jusqu'à leur propre expiration. La politique de suppression doit dire explicitement ce qui advient d'elles.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.4 Abonnement et droits d'usage](#14-abonnement-et-droits-dusage) | L'état de l'abonnement déclenche les changements d'état |
| [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy) | Le tenant est l'objet dont on gère le cycle de vie |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Détaille le provisionnement et le cycle de vie du tenant |
| [4.12 SCIM](04-identite-iam-autorisation.md#412-scim) | SCIM provisionne les utilisateurs d'un tenant depuis l'annuaire du client |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | Une saga coordonne les étapes qui peuvent échouer |
| [6.2 Transition et machine à états](06-workflow-etat-regles.md#62-transition-et-machine-à-états) | Le cycle de vie est une machine à états |

### 5. Application pratique

**Situation initiale.** Un hôpital s'inscrit à la plateforme depuis un formulaire web.

**Problème.** L'inscription doit créer le tenant, l'administrateur, la configuration de départ et les quotas, sans qu'un employé du fournisseur intervienne.

**Application du concept.** Un workflow de provisionnement exécute les étapes dans l'ordre. Chaque étape est idempotente.

**Déroulé.**

1. Le formulaire déclenche une demande de provisionnement avec un identifiant unique.
2. Le workflow crée le tenant, puis l'administrateur, puis la configuration.
3. L'étape de facturation échoue (service tiers indisponible).
4. Le workflow réessaie plus tard. Les étapes déjà faites ne sont pas refaites.
5. Tout est complété, le tenant passe à l'état « actif ».

**Résultat.** L'hôpital est opérationnel en quelques minutes, sans doublon ni état incohérent.

**Limites.** Si la reprise échoue de façon répétée, le tenant reste dans un état intermédiaire. Il faut alors une alerte et une procédure de reprise manuelle.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les principaux états du cycle de vie d'un client ?
2. **Compréhension.** Que doit contenir un provisionnement, au-delà de la création d'une ligne en base ?
3. **Compréhension.** Pourquoi la suppression d'un client n'est-elle pas immédiate ?
4. **Pourquoi.** Pourquoi chaque étape du provisionnement doit-elle être idempotente ?
5. **Raisonnement pratique.** Le provisionnement réussit pour le tenant et l'administrateur, mais échoue pour la facturation. Quelles stratégies de reprise sont possibles ?

#### Réponses

1. Essai, actif, suspendu, en cours de suppression, supprimé. Le détail dépend de l'offre commerciale.
2. Le tenant, les accès initiaux, la configuration par défaut, les droits et quotas, et le rattachement aux systèmes tiers (facturation, supervision).
3. Pour permettre au client de récupérer ses données, se protéger des erreurs et respecter les obligations de conservation. Une période de rétention précède la suppression physique.
4. Pour pouvoir rejouer le provisionnement après une panne sans créer de doublons ni d'état incohérent.
5. Réessayer l'étape de facturation jusqu'à la réussite, ou défaire les étapes déjà faites (compensation). Le choix dépend de ce qui est acceptable : un tenant temporairement sans facturation, ou l'annulation de l'inscription.

## 1.7 Plan de contrôle, plan de données et plan de gestion

### 1. Comprendre simplement

Une plateforme fait deux sortes de choses très différentes. D'un côté, elle **sert les requêtes des utilisateurs** : lire une fiche, enregistrer une modification, exécuter un workflow. De l'autre, elle **se configure et se gère** : créer un tenant, définir un type de ressource, changer une règle. Le **plan de données** (*data plane*) regroupe la première famille. Le **plan de contrôle** (*control plane*) regroupe la seconde. Le **plan de gestion** (*management plane*) désigne les outils que l'équipe du fournisseur utilise pour exploiter le service lui-même.

**Pourquoi cela existe.** Les deux familles n'ont pas les mêmes besoins. Le plan de données doit être très rapide et toujours disponible. Le plan de contrôle est utilisé plus rarement, mais ses actions sont puissantes et doivent être rigoureusement autorisées et cohérentes. Les mélanger rend les deux moins sûrs.

**Problème résolu.** Empêcher qu'une erreur de configuration ou une opération d'administration ne bloque le service rendu aux utilisateurs, et appliquer à chaque famille les garanties qui lui conviennent.

**Modèle mental.** Le contrôle aérien. La tour décide des itinéraires et des autorisations (plan de contrôle). Les avions transportent les passagers (plan de données). Si la radio de la tour tombe en panne, les avions déjà en vol continuent leur trajet.

**Où l'analogie s'arrête.** Dans l'aviation, la tour intervient pour chaque vol. Dans une plateforme bien conçue, le plan de données ne doit pas interroger le plan de contrôle à chaque requête : il garde une copie de la configuration.

**Exemple.** L'administrateur de la compagnie aérienne ajoute le statut « en inspection » au type *aéronef*. Cette action passe par le plan de contrôle. Ensuite, chaque technicien qui met à jour un aéronef passe par le plan de données, qui valide le statut selon la configuration enregistrée.

**Les composants.**

1. une **API et un stockage de configuration** (plan de contrôle) ;
2. un **moteur d'exécution** qui traite les requêtes métier (plan de données) ;
3. des **outils d'exploitation** internes (plan de gestion).

**Objectif d'apprentissage :** vous pouvez expliquer ce que fait chacun des trois plans, et pourquoi on veille à ce que le plan de données continue de fonctionner si le plan de contrôle est indisponible.

### 2. Connaissances essentielles

#### Définition

- **Plan de données** : l'ensemble des composants qui traitent les requêtes métier des utilisateurs et manipulent leurs données.
- **Plan de contrôle** : l'ensemble des composants qui définissent, configurent et pilotent le comportement du plan de données.
- **Plan de gestion** : l'ensemble des outils et processus par lesquels le fournisseur exploite le service (déploiement, supervision, facturation, support). Certaines sources fusionnent plan de contrôle et plan de gestion : la terminologie varie.

#### Idées fondamentales

1. **Séparer « décider » de « exécuter ».** Le plan de contrôle décide, le plan de données exécute.
2. **Le plan de données est à fort volume.** Il doit être rapide et disponible en permanence.
3. **Le plan de contrôle est à faible volume et à fort pouvoir.** Il exige cohérence, autorisation stricte et traçabilité.
4. **Le plan de données ne dépend pas du plan de contrôle à chaque requête.** Il utilise une copie de la configuration.
5. **Le plan de gestion sert le fournisseur.** Il n'est pas destiné aux tenants.
6. **Dans une plateforme configurable, il existe deux niveaux de contrôle.** Celui du fournisseur (tenants, offres) et celui de chaque tenant (types de ressources, règles).

#### Vocabulaire essentiel

- **Plan de contrôle** (*control plane*) : couche de configuration et de pilotage.
- **Plan de données** (*data plane*) : couche d'exécution du travail métier.
- **Plan de gestion** (*management plane*) : outils d'exploitation du service.
- **Configuration** : ensemble des paramètres qui décrivent le comportement voulu.
- **Propagation de configuration** : transmission d'un changement du plan de contrôle vers le plan de données.
- **Stabilité statique** (*static stability*) : capacité du plan de données à continuer de fonctionner avec la dernière configuration connue si le plan de contrôle est indisponible.

#### Relations de cause à effet

- Un administrateur modifie une règle. Le plan de contrôle enregistre le changement et le propage. Le comportement du plan de données change ensuite.
- Le plan de contrôle tombe en panne. Si le plan de données utilise sa copie de configuration, les utilisateurs ne remarquent rien, mais personne ne peut modifier la configuration.
- Une configuration erronée est propagée à tous les tenants. Tous les utilisateurs sont affectés : il faut valider et déployer progressivement.

#### Idées reçues

- **« Les plans sont des serveurs différents. »** Non. Ce sont des rôles logiques. Ils peuvent partager des machines, même si on les sépare souvent pour des raisons de sécurité et de disponibilité.
- **« Le plan de contrôle, c'est l'écran d'administration. »** Non. L'écran est un client du plan de contrôle. Le plan de contrôle est l'API, les règles et le stockage qui se trouvent derrière.
- **« Le plan de contrôle ne concerne que le fournisseur. »** Non. Dans une plateforme configurable, chaque tenant dispose d'un plan de contrôle limité à son périmètre.

#### Principe clé

Le plan de contrôle décide ce que le système doit faire ; le plan de données le fait, et continue de le faire même quand le plan de contrôle est absent.

#### Si vous ne retenez que trois choses

1. Le plan de contrôle configure, le plan de données exécute, le plan de gestion exploite.
2. Les trois n'ont pas les mêmes exigences de volume, de cohérence et de sécurité.
3. Le plan de données doit rester fonctionnel avec la dernière configuration connue.

### 3. Explication technique détaillée

#### Comparaison des plans

| Critère | Plan de données | Plan de contrôle | Plan de gestion |
|---|---|---|---|
| Qui l'utilise | Utilisateurs métier, applications | Administrateurs du tenant ou du fournisseur | Équipes d'exploitation du fournisseur |
| Exemple d'action | Enregistrer un aéronef | Ajouter un statut, créer un rôle | Déployer une version, ouvrir un incident |
| Volume | Très élevé | Faible | Faible |
| Disponibilité visée | La plus élevée | Élevée, mais indisponibilité tolérable à court terme | Selon les procédures d'exploitation |
| Cohérence | Selon la donnée | Forte, avec validation | Forte |
| Impact d'une erreur | Un utilisateur ou une requête | Potentiellement tous les tenants | Potentiellement tout le service |

#### Le chemin d'un changement de configuration

```text
Administrateur
      │
      ▼
API de contrôle ──► validation ──► stockage de configuration (versionné)
                                              │
                                              ▼  propagation
                                    ┌─────────────────────┐
                                    │ copie locale / cache│
                                    │  du plan de données │
                                    └──────────┬──────────┘
                                               ▼
                                   Traitement des requêtes
```

**Comment cela fonctionne.**

1. Le changement est validé (cohérence, droits, impact).
2. Il est enregistré comme une nouvelle version de la configuration.
3. Le plan de données récupère cette version, par notification ou par interrogation périodique.
4. Il l'applique à partir d'un instant défini.

**Pourquoi versionner.** On peut savoir quelle configuration était active à un instant donné et revenir en arrière en cas d'erreur (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) et [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)).

#### Stabilité statique et dernière configuration valide

Le plan de données conserve la dernière configuration valide. Si le plan de contrôle est injoignable, il continue d'utiliser cette copie plutôt que d'échouer.

**Contre-exemple.** Si chaque requête métier appelle le plan de contrôle pour lire la configuration, une panne ou une lenteur de ce dernier arrête tout le service. Les deux plans sont alors couplés.

#### Modes de défaillance

- **Rayon d'impact trop large** : une configuration invalide propagée partout. Réponse : valider avant propagation, déployer par vagues, garder la version précédente.
- **Dépendance cachée** : le plan de données appelle le plan de contrôle sur le chemin critique.
- **Privilèges excessifs** : le plan de contrôle peut tout modifier. Il doit être protégé plus strictement que le plan de données, et audité (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

**Limites.** La séparation a un coût : propagation, cohérence entre copies, délai entre la décision et son application. Ce délai doit être connu et accepté (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.2 Tenant et multi-tenancy](#12-tenant-et-multi-tenancy) | Le tenant a ses propres réglages, gérés par un plan de contrôle limité à son périmètre |
| [1.8 Architecture de plateforme et architecture modulaire](#18-architecture-de-plateforme-et-architecture-modulaire) | L'architecture de plateforme place ces plans comme des modules distincts |
| [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration) | La plateforme d'administration est l'interface humaine du plan de contrôle |
| [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime) | La vue transversale reprend la distinction entre plan de contrôle et exécution |
| [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques) | Le versionnement rend la configuration traçable et réversible |

### 5. Application pratique

**Situation initiale.** La compagnie aérienne veut ajouter le statut « en inspection » au type *aéronef*.

**Problème.** Le changement doit être appliqué sans redéploiement du logiciel, sans interrompre les techniciens connectés, et sans casser les aéronefs existants.

**Application du concept.** L'ajout passe par le plan de contrôle. Le plan de données récupère la nouvelle version de la configuration.

**Déroulé.**

1. L'administrateur ajoute le statut dans l'écran d'administration.
2. Le plan de contrôle valide que le nom est unique et que le changement ne casse aucune règle existante.
3. Une nouvelle version de la configuration du tenant est enregistrée.
4. Le plan de données la reçoit, l'applique et accepte désormais le statut.
5. Les techniciens utilisent le nouveau statut sans rien faire.

**Résultat.** Le changement est effectif en quelques secondes, sans redéploiement.

**Limites.** Entre l'enregistrement et la propagation, quelques instances du plan de données peuvent encore refuser le nouveau statut. Ce décalage est normal et doit être connu des équipes.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quel est le rôle du plan de contrôle, et quel est celui du plan de données ?
2. **Compréhension.** À quoi sert le plan de gestion, et qui l'utilise ?
3. **Compréhension.** Que signifie la stabilité statique ?
4. **Pourquoi.** Pourquoi ne faut-il pas que le plan de données interroge le plan de contrôle à chaque requête ?
5. **Raisonnement pratique.** Une configuration invalide a été propagée à tous les tenants et provoque des erreurs. Quelles mesures auraient limité l'impact ?

#### Réponses

1. Le plan de contrôle définit et pilote le comportement (configuration, politiques). Le plan de données traite les requêtes métier selon cette configuration.
2. Il regroupe les outils d'exploitation du service (déploiement, supervision, support, facturation). Il est utilisé par l'équipe du fournisseur.
3. C'est la capacité du plan de données à continuer de fonctionner avec la dernière configuration valide connue lorsque le plan de contrôle est indisponible.
4. Parce que cela les couple : une panne ou une lenteur du plan de contrôle arrêterait le service rendu aux utilisateurs, alors que ces deux fonctions ont des exigences différentes.
5. Valider la configuration avant de la propager, la déployer par vagues (quelques tenants d'abord), conserver la version précédente pour un retour arrière rapide, et surveiller les erreurs après chaque propagation.

## 1.8 Architecture de plateforme et architecture modulaire

### 1. Comprendre simplement

Une **architecture de plateforme** (*platform architecture*) organise un logiciel pour que de nombreuses applications puissent être construites à partir de briques communes, au travers d'interfaces stables. Une **architecture modulaire** (*modular architecture*) découpe un système en **modules** : des parties qui ont chacune une responsabilité claire et une interface définie, et qui cachent leur fonctionnement interne.

**Pourquoi cela existe.** Quand tout dépend de tout, chaque modification risque de casser autre chose, et personne ne comprend plus l'ensemble. Des modules bien délimités limitent l'effet d'un changement et permettent à plusieurs équipes de travailler en parallèle.

**Problème résolu.** Maîtriser la complexité d'un système qui grandit, et permettre à d'autres de construire dessus sans connaître son intérieur.

**Modèle mental.** Des briques de construction à emboîter. Chaque brique a une forme et des plots standards. On peut construire de nombreux objets en les assemblant.

**Où l'analogie s'arrête.** Les briques sont sans état et interchangeables. Un module logiciel porte des données et un comportement, et ses « plots » (son contrat) évoluent avec le temps.

**Exemple.** La plateforme est composée de modules : identité, tenants, moteur de ressources, moteur de workflows, événements, audit. L'application de maintenance de la compagnie aérienne est une configuration de ces modules, pas un module de plus.

**Objectif d'apprentissage :** vous pouvez expliquer ce qu'est un module, pourquoi une interface stable compte plus que l'implémentation, et ce qui distingue une plateforme d'un simple produit.

### 2. Connaissances essentielles

#### Définition

- **Architecture de plateforme** : organisation d'un système en services réutilisables et en points d'extension, exposés par des interfaces stables, sur lesquels des applications se construisent.
- **Architecture modulaire** : découpage d'un système en modules à responsabilité claire, aux dépendances maîtrisées, dont l'interface publique est distincte de l'implémentation.

#### Idées fondamentales

1. **Cohésion forte, couplage faible.** Un module regroupe ce qui change ensemble, et dépend peu des autres.
2. **Masquage de l'information.** Un module cache ses choix internes derrière une interface. Ce principe vient des travaux de David Parnas (1972).
3. **Contrat stable.** L'interface publique évolue lentement et de façon compatible, car d'autres en dépendent.
4. **Noyau et extensions.** Le noyau est petit et stable ; le reste s'ajoute par des points d'extension.
5. **Dépendances orientées.** Les modules de haut niveau dépendent de ceux de bas niveau, pas l'inverse.
6. **Configuration plutôt que code.** Dans une plateforme, on cherche à exprimer les variations métier par de la configuration (voir [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)).

#### Vocabulaire essentiel

- **Module** : unité du système avec une responsabilité et une interface publique.
- **Interface** ou **contrat** (*interface*, *contract*) : ce qu'un module promet à ses utilisateurs.
- **Cohésion** (*cohesion*) : degré auquel les éléments d'un module vont ensemble.
- **Couplage** (*coupling*) : degré de dépendance d'un module envers les autres.
- **Point d'extension** (*extension point*) : endroit prévu pour ajouter un comportement sans modifier le noyau.
- **Noyau** (*core*) : partie stable et minimale sur laquelle tout repose.
- **Couche** (*layer*) : niveau d'abstraction qui ne dépend que des niveaux inférieurs.

#### Relations de cause à effet

- Un module expose son fonctionnement interne. D'autres s'y accrochent. Plus aucun changement interne n'est possible sans casser les utilisateurs.
- Les modules dépendent les uns des autres en cercle. On ne peut plus les tester, les déployer ni les comprendre séparément.
- Le noyau est trop gros. Chaque évolution du noyau devient un événement à risque pour tout l'écosystème.

#### Idées reçues

- **« Modulaire signifie microservices. »** Non. Un système peut être modulaire et tenir dans un seul programme (voir [1.10 Monolithe, monolithe modulaire et microservices](#110-monolithe-monolithe-modulaire-et-microservices)). La modularité est une propriété de la conception, pas du déploiement.
- **« Plus il y a de modules, mieux c'est. »** Non. Des modules trop petits multiplient les interfaces et les coûts de coordination.
- **« Une plateforme est une API. »** Non. Une API est une porte d'entrée. Une plateforme est un ensemble de services, de règles, de modèles et d'outils d'extension.

#### Principe clé

Une plateforme tient par ses contrats : le noyau reste petit et stable, les modules cachent leur intérieur et les variations se placent dans la configuration et les extensions.

#### Si vous ne retenez que trois choses

1. Un module a une responsabilité claire et une interface qui cache son fonctionnement interne.
2. Une plateforme expose des contrats stables et des points d'extension, au lieu de fonctions métier figées.
3. La modularité est une propriété de conception, indépendante de la façon dont on déploie.

### 3. Explication technique détaillée

#### Les modules d'une plateforme générique

| Module | Responsabilité | Dépend de |
|---|---|---|
| Identité et accès | Authentifier, autoriser | Tenants |
| Tenants et abonnements | Isoler, mesurer, licencier | (aucun) |
| Modèle et ressources | Types, schémas, enregistrements | Tenants, identité |
| Moteur de workflow et de règles | États, transitions, règles | Ressources, identité |
| Événements et automatisation | Publier, abonner, planifier | Ressources, workflow |
| Audit et versionnement | Tracer, versionner | Tous (par événements) |
| Administration | Configurer les autres modules | Tous (via leurs interfaces) |

**Lecture du tableau.** Le module « tenants » ne dépend de personne : c'est une fondation. Le module d'audit écoute les autres par des événements, sans que les autres dépendent de lui.

#### Les couches

```text
┌───────────────────────────────────┐
│ Applications métier (configurées) │
├───────────────────────────────────┤
│ Moteurs : ressources, workflow,   │
│ règles, événements                │
├───────────────────────────────────┤
│ Services fondamentaux : identité, │
│ tenants, audit, configuration     │
├───────────────────────────────────┤
│ Infrastructure                    │
└───────────────────────────────────┘
Règle : une couche ne dépend que des couches inférieures.
```

#### Règles de dépendance

1. Pas de dépendance cyclique entre modules.
2. Aucun module n'accède directement aux données d'un autre : il passe par son interface.
3. Une dépendance vers un module de plus haut niveau est interdite, ou doit passer par une inversion (un événement, une interface fournie par le module de haut niveau).

**Exemple.** Le moteur de workflow doit déclencher une notification. Au lieu d'appeler directement le module de messagerie, il publie un événement « tâche créée » auquel la messagerie s'abonne. Ainsi, le workflow ne dépend pas de la messagerie.

#### Points d'extension

Une plateforme prévoit des endroits où l'on peut brancher du comportement : validations personnalisées, actions de workflow, connecteurs, vues. Chaque point d'extension est un contrat : il doit être documenté, versionné et testable (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

#### Modes de défaillance

- **« Grosse boule de boue »** : aucune frontière claire, tout est entremêlé.
- **Abstraction qui fuit** : l'interface expose des détails internes (noms de tables, identifiants techniques).
- **Base de données partagée** : plusieurs modules lisent et écrivent les mêmes tables. Le contrat réel devient le schéma, pas l'interface.
- **Module « fourre-tout »** : un module « utilitaires » ou « commun » qui absorbe tout ce qui n'a pas trouvé de place.

**Limites.** Une architecture modulaire n'empêche pas les mauvais choix de découpage. Un découpage initial erroné est coûteux à corriger quand d'autres dépendent déjà des interfaces.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.7 Plan de contrôle, plan de données et plan de gestion](#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | La séparation entre contrôle et exécution est un choix de découpage modulaire |
| [1.10 Monolithe, monolithe modulaire et microservices](#110-monolithe-monolithe-modulaire-et-microservices) | Le monolithe modulaire et les microservices sont deux façons de déployer des modules |
| [1.11 Frontières de service](#111-frontières-de-service) | La frontière d'un module est une frontière de service |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les plugins et extensions utilisent les points d'extension de la plateforme |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Le contexte délimité du DDD est un outil pour tracer les frontières de modules |

### 5. Application pratique

**Situation initiale.** Deux équipes développent la plateforme. L'une travaille sur les workflows, l'autre sur les notifications.

**Problème.** Les modifications d'une équipe cassent régulièrement le travail de l'autre, car le moteur de workflow appelle directement des fonctions internes de la messagerie.

**Application du concept.** On définit une interface claire entre les deux modules : un événement « tâche assignée ». Le workflow le publie. La messagerie s'y abonne.

**Déroulé.**

1. Les équipes conviennent du contenu de l'événement et de sa version.
2. Le workflow cesse d'appeler la messagerie directement.
3. La messagerie implémente un abonné à l'événement.
4. Chaque équipe peut changer son intérieur sans prévenir l'autre, tant que le contrat est respecté.

**Résultat.** Les changements deviennent locaux, et les équipes travaillent en parallèle.

**Limites.** Le contrat d'événement devient un point d'attention : l'évolution de son contenu doit rester compatible (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un module ?
2. **Compréhension.** Que signifient cohésion forte et couplage faible ?
3. **Compréhension.** Qu'est-ce qu'un point d'extension ?
4. **Pourquoi.** Pourquoi l'interface d'un module doit-elle être plus stable que son implémentation ?
5. **Raisonnement pratique.** Deux modules lisent et écrivent les mêmes tables. Quel problème cela crée-t-il, et comment le corriger ?

#### Réponses

1. Une unité du système qui a une responsabilité claire et une interface publique, et qui cache ses détails internes.
2. Une cohésion forte signifie que les éléments d'un module vont ensemble et changent pour les mêmes raisons. Un couplage faible signifie que le module dépend peu des autres.
3. Un endroit prévu dans le noyau où l'on peut ajouter un comportement sans modifier le noyau.
4. Parce que d'autres dépendent de l'interface. L'intérieur peut changer librement si l'interface reste stable ; l'inverse bloque toute évolution.
5. Le véritable contrat devient la structure des tables. Aucun des deux modules ne peut la changer librement. On corrige en donnant à chaque table un seul propriétaire, et en faisant passer les autres modules par son interface ou par des événements.

## 1.9 Systèmes distribués

### 1. Comprendre simplement

Les **systèmes distribués** (*distributed systems*) sont des systèmes dont les composants s'exécutent sur plusieurs machines qui communiquent par un réseau, et qui apparaissent à l'utilisateur comme un ensemble unique.

**Pourquoi cela existe.** Une seule machine a des limites : puissance, capacité, disponibilité. Si elle tombe en panne, tout s'arrête. En répartissant le travail sur plusieurs machines, on peut traiter plus de charge et survivre à des pannes.

**Problème résolu.** Dépasser les limites d'une machine unique, en capacité comme en disponibilité.

**Ce que cela change.** La répartition apporte de nouveaux problèmes. Les machines communiquent par un réseau qui peut être lent, perdre des messages ou se couper. Une partie du système peut tomber en panne pendant que le reste fonctionne.

**Modèle mental.** Une équipe de personnes qui travaillent dans des bureaux différents et communiquent seulement par lettres. Certaines lettres arrivent en retard, d'autres se perdent. Personne ne peut savoir à coup sûr ce que les autres sont en train de faire à cet instant.

**Où l'analogie s'arrête.** Les lettres sont lentes mais le courrier est rarement perdu. Un réseau informatique est beaucoup plus rapide, mais ses échecs sont silencieux et imprévisibles : un message perdu ne signale pas sa perte.

**Exemple.** Le moteur de ressources et le moteur de workflow tournent sur des machines différentes. Le moteur de workflow demande de modifier un aéronef ; la réponse n'arrive pas. A-t-il été modifié ou non ? On ne le sait pas.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi un système réparti sur plusieurs machines pose des problèmes qu'une machine unique ne connaît pas, et citer deux conséquences pratiques.

### 2. Connaissances essentielles

#### Définition

Un **système distribué** est un ensemble de composants indépendants, exécutés sur des machines distinctes, qui coordonnent leurs actions par échange de messages sur un réseau, afin de fournir un service unifié.

#### Idées fondamentales

1. **Le réseau n'est pas fiable.** Un message peut être perdu, retardé, dupliqué ou reçu dans le désordre.
2. **Les pannes sont partielles.** Une partie du système peut tomber pendant que le reste fonctionne.
3. **Il n'y a pas de temps global.** Chaque machine a sa propre horloge, avec des écarts.
4. **Il faut choisir entre cohérence et disponibilité en cas de partition.** C'est le théorème CAP.
5. **Il faut concevoir pour l'échec.** Délais d'attente, nouvelles tentatives, idempotence et reprise font partie de la conception.
6. **La complexité est un coût.** La distribution ne s'adopte que pour une raison précise : capacité, disponibilité, autonomie d'équipe.

#### Vocabulaire essentiel

- **Latence** (*latency*) : temps entre l'envoi d'une demande et la réception de la réponse.
- **Panne partielle** (*partial failure*) : défaillance d'une partie du système seulement.
- **Partition réseau** (*network partition*) : coupure qui sépare des machines en groupes qui ne communiquent plus.
- **Délai d'attente** (*timeout*) : durée après laquelle on considère un appel comme échoué.
- **Cohérence** (*consistency*) : propriété selon laquelle tous voient la même donnée à jour.
- **Disponibilité** (*availability*) : propriété selon laquelle chaque requête reçoit une réponse.
- **Réplication** (*replication*) : conservation de copies d'une donnée sur plusieurs machines.

#### Relations de cause à effet

- Un appel réseau expire. On ne sait pas s'il a abouti : il faut une opération idempotente pour pouvoir la rejouer sans risque (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).
- Plusieurs copies d'une donnée existent. Une mise à jour met du temps à se propager : les lecteurs peuvent voir des valeurs différentes (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
- Un service dépend d'un autre. Si celui-ci ralentit, le premier ralentit aussi, et la lenteur se propage en cascade.

#### Idées reçues

- **« Le réseau est fiable et rapide. »** C'est la première des « huit erreurs de l'informatique distribuée », formulées à Sun Microsystems dans les années 1990. Toutes sont des hypothèses fausses mais tentantes.
- **« Un appel distant ressemble à un appel local. »** Non. Un appel distant est plus lent, peut échouer sans signal clair, et son résultat peut être inconnu.
- **« Plus de machines, plus de fiabilité. »** Pas automatiquement. Chaque dépendance ajoutée est une cause de panne supplémentaire.

#### Principe clé

Dans un système distribué, tout appel peut échouer ou être incertain : on conçoit donc chaque opération pour être rejouée sans dommage et chaque donnée pour être cohérente dans des délais connus.

#### Si vous ne retenez que trois choses

1. Un système distribué communique par un réseau qui peut perdre, retarder ou dupliquer les messages.
2. Les pannes sont partielles : on ne sait pas toujours si une opération a réussi.
3. Distribuer est un choix coûteux : il faut le justifier par un besoin réel.

### 3. Explication technique détaillée

#### Les huit erreurs de l'informatique distribuée

| N° | Hypothèse fausse | Conséquence pratique |
|---|---|---|
| 1 | Le réseau est fiable | Prévoir délais, nouvelles tentatives, reprise |
| 2 | La latence est nulle | Limiter le nombre d'appels sur le chemin critique |
| 3 | La bande passante est infinie | Limiter la taille des messages |
| 4 | Le réseau est sûr | Authentifier et chiffrer les échanges |
| 5 | La topologie ne change pas | Ne pas coder en dur les adresses |
| 6 | Il y a un seul administrateur | Prévoir des environnements gérés par des équipes différentes |
| 7 | Le coût de transport est nul | Mesurer le coût des échanges |
| 8 | Le réseau est homogène | Utiliser des formats ouverts et des contrats clairs |

#### Le théorème CAP

**Énoncé.** En cas de partition réseau, un système ne peut garantir à la fois la cohérence (tous voient la dernière valeur écrite) et la disponibilité (chaque requête reçoit une réponse). Ce résultat, conjecturé par Eric Brewer, a été démontré par Seth Gilbert et Nancy Lynch.

**Exemple.** Deux copies d'une base sont coupées l'une de l'autre. Un utilisateur écrit sur la copie A.

- Si le système privilégie la **cohérence**, la copie B refuse les lectures et les écritures tant que la partition dure. Le service est indisponible pour une partie des utilisateurs.
- Si le système privilégie la **disponibilité**, la copie B répond, mais avec une valeur potentiellement ancienne.

**Limites.** CAP ne s'applique qu'en cas de partition. En fonctionnement normal, le vrai compromis porte sur la latence et la cohérence.

#### Disponibilité de dépendances en série

Si une requête traverse $n$ services en série, la disponibilité de l'ensemble est le produit des disponibilités :

$$A_{\text{total}} = \prod_{i=1}^{n} A_i$$

où $A_i$ est la disponibilité du service $i$ (une valeur entre 0 et 1).

**Exemple chiffré.** Trois services à 99,9 % chacun donnent $0{,}999^3 \approx 0{,}997$, soit environ 99,7 %. Cela représente environ 26 heures d'indisponibilité par an, contre environ 8,8 heures pour un seul service à 99,9 %.

#### Défaillances typiques

- **Appel dont le résultat est inconnu** : expiration après envoi.
- **Cascade** : un service lent sature ses appelants.
- **Tempête de nouvelles tentatives** : tous les clients réessaient en même temps et aggravent la panne.
- **Cerveau divisé** (*split brain*) : deux parties du système se croient chacune responsables d'une tâche.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.10 Monolithe, monolithe modulaire et microservices](#110-monolithe-monolithe-modulaire-et-microservices) | Les microservices rendent le système distribué ; le monolithe modulaire évite cette complexité |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend les appels rejouables |
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | La cohérence à terme est une réponse à la réplication |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | La saga coordonne des opérations réparties sans transaction globale |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | La tolérance aux pannes est une réponse aux défaillances partielles |

### 5. Application pratique

**Situation initiale.** Le moteur de workflow appelle le moteur de ressources pour passer un aéronef au statut « en inspection ». L'appel expire après trois secondes.

**Problème.** Le workflow ne sait pas si le statut a changé. S'il réessaie, il risque d'appliquer l'opération deux fois.

**Application du concept.** L'opération de changement de statut est conçue pour être idempotente : elle porte un identifiant de demande.

**Déroulé.**

1. Le workflow génère un identifiant de demande unique pour l'opération.
2. Il envoie la demande, qui expire.
3. Il la renvoie avec le même identifiant.
4. Le moteur de ressources reconnaît l'identifiant : si l'opération a déjà été appliquée, il renvoie simplement le résultat précédent.

**Résultat.** L'opération est appliquée une seule fois, même si le message a été envoyé plusieurs fois.

**Limites.** L'identifiant de demande doit être conservé assez longtemps pour couvrir les nouvelles tentatives, ce qui demande un stockage et une politique d'expiration.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une panne partielle ?
2. **Compréhension.** Que dit le théorème CAP ?
3. **Compréhension.** Citez trois des huit erreurs de l'informatique distribuée.
4. **Pourquoi.** Pourquoi un appel qui expire est-il plus difficile à traiter qu'un appel qui échoue explicitement ?
5. **Raisonnement pratique.** Une requête traverse quatre services en série, chacun à 99,9 % de disponibilité. Quelle est la disponibilité approximative de l'ensemble ?

#### Réponses

1. C'est la défaillance d'une partie du système (une machine, un service, un lien réseau) pendant que le reste continue de fonctionner.
2. En cas de partition réseau, un système ne peut pas garantir à la fois la cohérence et la disponibilité : il doit choisir.
3. Par exemple : le réseau est fiable ; la latence est nulle ; la bande passante est infinie.
4. Parce qu'une expiration ne dit pas si l'opération a eu lieu. Un échec explicite indique que l'opération n'a pas été appliquée.
5. $0{,}999^4 \approx 0{,}996$, soit environ 99,6 %.

## 1.10 Monolithe, monolithe modulaire et microservices

### 1. Comprendre simplement

Ces trois termes décrivent la façon dont on **découpe et déploie** un logiciel.

- Un **monolithe** est un logiciel déployé comme un seul bloc.
- Un **monolithe modulaire** (*modular monolith*) est un seul bloc déployable, mais organisé en modules aux frontières strictes.
- Des **microservices** sont de nombreux petits services indépendants, déployés séparément, qui communiquent par le réseau.

**Pourquoi cela existe.** Chaque approche répond à un compromis entre simplicité et indépendance. Un seul bloc est simple à développer et à exploiter. Des services séparés permettent à des équipes de travailler et de déployer indépendamment, au prix d'une complexité de système distribué.

**Problème résolu.** Choisir une structure de déploiement adaptée à la taille de l'équipe, au rythme de changement et aux besoins de montée en charge.

**Modèle mental.**

- Le monolithe est un grand magasin : tout est sous le même toit, une seule caisse.
- Le monolithe modulaire est un grand magasin avec des rayons bien séparés et des règles de circulation.
- Les microservices sont une rue commerçante : chaque boutique est indépendante, mais pour acheter un repas complet, il faut parcourir plusieurs boutiques.

**Où l'analogie s'arrête.** Les boutiques d'une rue ne partagent pas d'état, alors que des services doivent coordonner leurs données. Le coût de cette coordination est la difficulté principale des microservices.

**Exemple.** La plateforme démarre en monolithe modulaire : moteur de ressources, moteur de workflow et module d'identité sont des modules d'un même programme. Plus tard, l'import massif est isolé dans un service séparé, car il consomme beaucoup de ressources.

**Objectif d'apprentissage :** vous pouvez comparer les trois approches selon leur simplicité, leur indépendance et leur coût d'exploitation, et défendre un choix de départ.

### 2. Connaissances essentielles

#### Définition

- **Monolithe** : application dont tout le code est compilé, déployé et exécuté comme une seule unité.
- **Monolithe modulaire** : monolithe dont le code est organisé en modules aux interfaces explicites et aux dépendances contrôlées.
- **Microservices** : style d'architecture où l'application est composée de petits services indépendants, chacun responsable d'une capacité, déployés et mis à l'échelle séparément et communiquant par le réseau.

#### Idées fondamentales

1. **Le déploiement n'est pas la structure.** On peut être modulaire sans microservices.
2. **Le monolithe est simple.** Un appel entre modules est un appel de fonction, rapide et fiable.
3. **Les microservices achètent l'indépendance.** Équipes, déploiements et technologies peuvent être différents.
4. **L'indépendance se paie en distribution.** Réseau, cohérence des données, observabilité et tests deviennent plus difficiles (voir [1.9 Systèmes distribués](#19-systèmes-distribués)).
5. **On commence souvent simple.** Beaucoup d'équipes recommandent de partir d'un monolithe modulaire et d'extraire des services quand un besoin précis apparaît.
6. **Un mauvais découpage est pire qu'un monolithe.** Des services trop couplés forment un « monolithe distribué ».

#### Vocabulaire essentiel

- **Déploiement indépendant** : capacité à mettre en production un composant sans redéployer les autres.
- **Monolithe distribué** (*distributed monolith*) : services séparés par le réseau mais si dépendants qu'ils doivent être déployés ensemble.
- **Extraction de service** : opération qui sort un module du monolithe pour en faire un service.
- **Passerelle** (*gateway*) : point d'entrée unique qui route les requêtes vers les services.
- **Communication synchrone** : l'appelant attend la réponse. **Asynchrone** : il n'attend pas.
- **Autonomie d'équipe** : capacité d'une équipe à changer et déployer son périmètre sans coordination lourde.

#### Relations de cause à effet

- On sépare un module en service. Les appels internes deviennent des appels réseau : latence, échecs, nouvelles tentatives apparaissent.
- On donne à chaque service sa propre base de données. L'indépendance augmente, mais les transactions entre services disparaissent.
- Trop de services sont créés trop tôt. La coordination, les déploiements et la supervision coûtent plus que ce que l'indépendance rapporte.

#### Idées reçues

- **« Les microservices sont plus modernes, donc meilleurs. »** Non. Ils répondent à des contraintes précises. Sans ces contraintes, ils ajoutent du coût.
- **« Un monolithe est forcément désordonné. »** Non. Un monolithe modulaire peut être très bien structuré.
- **« Des microservices garantissent la modularité. »** Non. Des services mal découpés peuvent être plus entremêlés qu'un monolithe.

#### Principe clé

Choisissez la structure de déploiement la plus simple qui satisfait vos contraintes ; la modularité, elle, se construit dès le départ, quel que soit le déploiement.

#### Si vous ne retenez que trois choses

1. Monolithe, monolithe modulaire et microservices décrivent le déploiement ; la modularité est une qualité de conception.
2. Les microservices apportent l'indépendance au prix de la complexité distribuée.
3. Un monolithe modulaire est un bon point de départ ; on extrait des services quand un besoin précis le justifie.

### 3. Explication technique détaillée

#### Comparaison

| Critère | Monolithe | Monolithe modulaire | Microservices |
|---|---|---|---|
| Unité de déploiement | Une | Une | Plusieurs |
| Appel entre parties | Appel de fonction | Appel de fonction via interface | Appel réseau |
| Transactions entre parties | Simples | Simples | Difficiles (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)) |
| Indépendance des équipes | Faible | Moyenne | Forte |
| Mise à l'échelle | Globale | Globale | Par service |
| Complexité d'exploitation | Faible | Faible | Élevée |
| Risque de couplage caché | Élevé | Contrôlé par les règles de modules | Élevé si découpage mal choisi |

#### Le monolithe modulaire en pratique

Le programme est un seul déploiement, mais les règles suivantes sont appliquées et vérifiées automatiquement :

1. chaque module expose une interface publique ;
2. un module n'accède pas aux tables d'un autre ;
3. les dépendances entre modules forment un graphe sans cycle.

```text
┌──────────────────── Un seul déploiement ────────────────────┐
│ ┌──────────┐   ┌───────────┐   ┌───────────┐   ┌─────────┐ │
│ │ Identité │◄──│ Ressources│◄──│ Workflows │──►│ Audit   │ │
│ └──────────┘   └───────────┘   └───────────┘   └─────────┘ │
│        interfaces publiques uniquement entre modules        │
└─────────────────────────────────────────────────────────────┘
```

**Pourquoi.** On conserve la simplicité d'exploitation, mais on prépare l'extraction possible : un module qui n'est joignable que par son interface peut devenir un service sans réécriture profonde.

#### Quand extraire un service

Les raisons légitimes sont précises :

- **mise à l'échelle différente** : l'import massif demande beaucoup plus de ressources que le reste ;
- **isolation de panne** : un traitement instable ne doit pas faire tomber le service principal ;
- **exigence de sécurité ou réglementaire** : un composant manipule des données très sensibles ;
- **autonomie d'équipe** : une équipe doit pouvoir déployer indépendamment ;
- **technologie différente** : un composant exige un autre environnement.

#### Coûts des microservices

- appels réseau, latence, échecs partiels ;
- cohérence des données entre services ;
- observabilité : tracer une requête à travers plusieurs services ;
- gestion des versions de contrats ;
- tests d'intégration et environnements plus lourds ;
- coordination des déploiements.

**Contre-exemple.** Cinq services qui partagent la même base de données et doivent être déployés ensemble sont des microservices en apparence seulement. Ils cumulent les inconvénients des deux approches.

**Limites.** Il n'existe pas de règle chiffrée universelle. La décision dépend de la taille de l'équipe, du rythme de changement, des contraintes de charge et de la maturité d'exploitation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.8 Architecture de plateforme et architecture modulaire](#18-architecture-de-plateforme-et-architecture-modulaire) | La modularité est la qualité de conception qui précède le choix de déploiement |
| [1.9 Systèmes distribués](#19-systèmes-distribués) | Les microservices font de l'application un système distribué |
| [1.11 Frontières de service](#111-frontières-de-service) | Le découpage en services repose sur des frontières bien tracées |
| [7.4 Architecture orientée événements](07-evenements-automatisation.md#74-architecture-orientée-événements) | Les événements aident à découpler les services |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | Plus il y a de services, plus l'observabilité devient indispensable |

### 5. Application pratique

**Situation initiale.** La plateforme est un monolithe modulaire. L'import de fichiers volumineux (plusieurs centaines de milliers de lignes) ralentit les requêtes des utilisateurs aux heures de bureau.

**Problème.** L'import consomme des ressources partagées. Le reste du produit n'a pas besoin d'être séparé.

**Application du concept.** On extrait uniquement le module d'import en un service distinct, qui consomme une file de tâches.

**Déroulé.**

1. Le module d'import n'était accessible que par son interface, ce qui facilite l'extraction.
2. Il est déployé comme un service séparé avec ses propres ressources.
3. La plateforme dépose les demandes d'import dans une file ; le service les consomme.
4. L'utilisateur suit l'avancement par un statut mis à jour.

**Résultat.** L'import n'affecte plus les requêtes interactives, et le reste de la plateforme reste un monolithe simple.

**Limites.** Le service d'import doit désormais appeler l'API de la plateforme pour écrire les données, avec les conséquences d'un appel réseau (échecs, reprises, idempotence).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un monolithe et un monolithe modulaire ?
2. **Compréhension.** Citez deux avantages et deux coûts des microservices.
3. **Compréhension.** Qu'est-ce qu'un monolithe distribué ?
4. **Pourquoi.** Pourquoi recommande-t-on souvent de partir d'un monolithe modulaire plutôt que de microservices ?
5. **Raisonnement pratique.** Un traitement d'export mensuel sature la base chaque fin de mois. Faut-il passer toute la plateforme en microservices ?

#### Réponses

1. Les deux sont déployés d'un seul bloc. Le monolithe modulaire impose en plus des frontières nettes entre modules, avec des interfaces explicites.
2. Avantages : déploiement indépendant, mise à l'échelle par service. Coûts : complexité réseau, cohérence des données difficile, observabilité et tests plus lourds.
3. Un ensemble de services séparés par le réseau, mais si dépendants qu'ils doivent être modifiés et déployés ensemble. Il cumule les inconvénients des deux approches.
4. Parce que la frontière optimale entre services n'est pas connue au départ, et que la simplicité d'exploitation permet d'apprendre le domaine. Les modules bien définis rendent l'extraction possible plus tard.
5. Non. Il suffit d'isoler ce traitement, éventuellement comme tâche de fond ou comme service dédié, et de conserver le reste simple.

## 1.11 Frontières de service

### 1. Comprendre simplement

Une **frontière de service** (*service boundary*) est la ligne qui sépare ce qu'un service possède et décide de ce que les autres peuvent lui demander. À l'intérieur, il gère ses données et son comportement. À l'extérieur, on ne le connaît que par son contrat : ses API et ses événements.

**Pourquoi cela existe.** Dans un système composé de plusieurs parties, il faut savoir qui est responsable de quoi. Sans frontière claire, plusieurs parties modifient la même donnée, et personne ne peut la faire évoluer sans casser les autres.

**Problème résolu.** Répartir les responsabilités, limiter la portée des changements et clarifier qui est propriétaire de chaque donnée.

**Modèle mental.** Les frontières d'un pays. À l'intérieur, les règles locales s'appliquent. Pour entrer ou sortir, on passe à un point de passage contrôlé, avec des documents précis.

**Où l'analogie s'arrête.** Les frontières d'un pays sont fixes. Une frontière de service se déplace avec la compréhension du métier : on la redessine, parfois à coût élevé.

**Exemple.** Le module « tenants et abonnements » possède les données de contrat. Le moteur de ressources ne les lit pas directement ; il demande « ce tenant a-t-il le droit d'utiliser cette fonction ? » à travers l'interface du module.

**Objectif d'apprentissage :** vous pouvez dire où placer une frontière entre deux parties d'un système et justifier votre choix par la cohérence, la propriété des données et la rapidité de changement.

### 2. Connaissances essentielles

#### Définition

Les **frontières de service** (*service boundaries*) délimitent le périmètre de responsabilité de chaque service : les données qu'il possède, les règles qu'il applique et le contrat par lequel les autres composants interagissent avec lui.

#### Idées fondamentales

1. **Un service possède ses données.** Un seul propriétaire écrit une donnée précise ; les autres la consultent par son interface.
2. **Ce qui change ensemble reste ensemble.** Les éléments qui évoluent pour les mêmes raisons appartiennent à la même frontière.
3. **La cohérence forte reste à l'intérieur.** Ce qui doit toujours être cohérent à l'instant doit être à l'intérieur d'une même frontière.
4. **Découper par capacité métier, pas par couche technique.** Une frontière suit une capacité (facturer, autoriser), pas un étage technique (interface, base de données).
5. **La structure des équipes influence la structure du système.** C'est la loi de Conway (1968).
6. **Le contrat est la seule porte d'entrée.** Interface et événements, versionnés.

#### Vocabulaire essentiel

- **Propriété des données** (*data ownership*) : un service est seul responsable d'une donnée et de ses changements.
- **Contrat** (*contract*) : ensemble des interfaces et des événements qu'un service s'engage à respecter.
- **Cohérence forte** (*strong consistency*) : toute lecture voit la dernière écriture.
- **Bavardage** (*chattiness*) : excès d'appels entre services pour accomplir une seule tâche.
- **Contexte délimité** (*bounded context*) : notion du DDD proche de la frontière de service (voir [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité)).
- **Loi de Conway** : une organisation produit des systèmes dont la structure reproduit sa propre structure de communication.

#### Relations de cause à effet

- Deux services écrivent dans la même table. Aucun ne peut la changer sans coordonner avec l'autre.
- Une frontière coupe une opération qui doit être atomique. On doit remplacer la transaction par une coordination complexe (voir [7.11 Saga](07-evenements-automatisation.md#711-saga)).
- Une frontière suit la structure de l'équipe plutôt que le métier. Le système suit alors l'organigramme, et se rigidifie quand celui-ci change.

#### Idées reçues

- **« Une frontière suit les couches techniques. »** Non. Séparer « interface », « logique » et « base de données » en services crée des changements qui traversent tous les services pour chaque fonction.
- **« Plus les services sont petits, mieux c'est. »** Non. Des services trop fins (*nanoservices*) multiplient les appels et la coordination.
- **« On peut toujours redécouper plus tard sans coût. »** Non. Plus des consommateurs dépendent d'un contrat, plus il est coûteux de le changer.

#### Principe clé

Placez la frontière là où la cohérence peut devenir différée et où les raisons de changer divergent ; gardez ensemble ce qui doit toujours être cohérent.

#### Si vous ne retenez que trois choses

1. Un service possède ses données ; les autres y accèdent uniquement par son contrat.
2. On trace les frontières selon les capacités métier et les raisons de changer, pas selon les couches techniques.
3. Une opération qui doit être atomique doit rester à l'intérieur d'une seule frontière.

### 3. Explication technique détaillée

#### Comment choisir une frontière

| Question à se poser | Si la réponse est « oui » |
|---|---|
| Ces éléments changent-ils ensemble ? | Les garder dans la même frontière |
| Une transaction doit-elle les couvrir ? | Les garder dans la même frontière |
| Des équipes différentes en sont-elles responsables ? | Une frontière est plausible |
| Peut-on tolérer un délai de cohérence entre eux ? | La frontière est possible |
| Ont-ils des besoins de charge ou de sécurité différents ? | La frontière est justifiée |

#### Exemple de découpage pour une plateforme

| Capacité | Données possédées | Contrat exposé |
|---|---|---|
| Identité et accès | Utilisateurs, rôles, politiques | Authentifier, autoriser |
| Tenants et abonnements | Tenants, offres, droits | Résoudre un tenant, vérifier un droit |
| Modèle et ressources | Types, schémas, enregistrements | Créer, lire, modifier des ressources |
| Workflow et règles | Définitions, instances, états | Démarrer, avancer, interroger |
| Événements | Abonnements, livraison | Publier, s'abonner |
| Audit | Journal immuable | Enregistrer, consulter |

#### Interactions à travers la frontière

- **Appel synchrone** : « ce tenant a-t-il le droit ? ». Simple, mais couple la disponibilité des deux services.
- **Événement** : « un aéronef a été modifié ». L'émetteur ne connaît pas les consommateurs. Le résultat est asynchrone.
- **Copie locale** : un service garde une copie de lecture d'une donnée d'un autre. Rapide, mais à maintenir à jour.

#### Modes de défaillance

- **Base partagée** : le contrat réel est le schéma.
- **Bavardage** : une opération nécessite vingt appels entre services.
- **Cycle de dépendances** : A appelle B qui appelle A.
- **Frontière « technique »** : un service par couche.
- **Donnée sans propriétaire** : personne n'est responsable de sa qualité.

**Limites.** Il n'existe pas de découpage unique. Le métier évolue, les frontières aussi. Il faut accepter de les réviser, en restant attentif au coût du changement de contrat.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.8 Architecture de plateforme et architecture modulaire](#18-architecture-de-plateforme-et-architecture-modulaire) | Une frontière de service est la frontière d'un module de la plateforme |
| [1.10 Monolithe, monolithe modulaire et microservices](#110-monolithe-monolithe-modulaire-et-microservices) | Les microservices ne valent que si les frontières sont bien tracées |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Le contexte délimité du DDD donne une méthode pour trouver les frontières |
| [7.4 Architecture orientée événements](07-evenements-automatisation.md#74-architecture-orientée-événements) | Les événements permettent de franchir une frontière sans couplage fort |
| [13.5 Invariants](13-concepts-transversaux.md#135-invariants) | Les invariants indiquent ce qui doit rester dans une même frontière |

### 5. Application pratique

**Situation initiale.** L'équipe hésite : faut-il que le moteur de workflow et le moteur de ressources soient dans la même frontière ?

**Problème.** Une action de workflow modifie souvent une ressource, mais le workflow a ses propres règles d'évolution et un rythme de changement différent.

**Application du concept.** On vérifie les critères : la modification d'une ressource par un workflow doit-elle être atomique avec le changement d'état du workflow ?

**Déroulé.**

1. On liste ce qui doit toujours être cohérent : la ressource ne doit jamais être modifiée sans que le workflow en garde la trace.
2. On constate que cette cohérence peut être différée de quelques secondes, avec un mécanisme de reprise.
3. On sépare les deux frontières. Le workflow demande la modification par l'interface du moteur de ressources, de façon idempotente.
4. Le moteur de ressources publie un événement après modification, que le workflow écoute.

**Résultat.** Les deux modules évoluent indépendamment, avec un contrat clair.

**Limites.** Il faut gérer l'échec partiel : la ressource est modifiée, mais l'événement n'est pas arrivé. Le motif de la boîte d'envoi transactionnelle (*outbox*) est une réponse courante (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifie « un service possède ses données » ?
2. **Compréhension.** Pourquoi ne découpe-t-on pas un système selon ses couches techniques ?
3. **Compréhension.** Que dit la loi de Conway ?
4. **Pourquoi.** Pourquoi doit-on garder à l'intérieur d'une même frontière ce qui doit être atomique ?
5. **Raisonnement pratique.** Deux services écrivent dans la table `aircraft`. Quels risques cela présente-t-il, et comment y remédier ?

#### Réponses

1. Un seul service est autorisé à écrire cette donnée et à en faire évoluer la structure. Les autres l'obtiennent par son interface ou par ses événements.
2. Parce que presque toute fonction métier traverse toutes les couches. Chaque évolution toucherait tous les services et les rendrait dépendants entre eux.
3. Une organisation produit des systèmes dont la structure reproduit sa propre structure de communication.
4. Parce qu'au-delà de la frontière, il n'y a plus de transaction commune. Une opération atomique y devient une coordination complexe, avec des états intermédiaires visibles.
5. Aucun des deux ne peut changer la structure ou les règles de la table sans coordination, et les règles métier peuvent être contournées. On remédie en désignant un propriétaire unique, qui expose les opérations autorisées par son interface.
