# Module 22 — Performance, échelle et économie d'infrastructure

> **Question directrice.** Comment tenir la charge de milliers de tenants très inégaux, à un coût maîtrisé, sans qu'un seul ne dégrade les autres ?

## Présentation du module

**Objectif.** Une plateforme multi-tenant se juge à sa tenue sous une charge inégale et à sa marge. Le parcours initial donne la planification de capacité et la dégradation progressive ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité), [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)), le voisin bruyant et la cellule ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants), [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)), la réplication ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)) et les quotas ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)). Ce module décrit les **leviers d'architecture** (cache, réplicas, partitionnement, cellules, multi-région), les mécanismes d'**équité** (limites par tenant, files équitables, priorités) et la **lecture économique** (coût de service, économie unitaire, arbitrage entre efficacité et résilience).

**Prérequis.** Les quotas et la consommation ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)), l'isolation des tenants ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)), les modèles d'architecture multi-tenant et la multi-tenancy hybride ([5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant), [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)), la tolérance aux pannes ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)), la dégradation progressive ([11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive)) et la planification de capacité ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)).

**Un mot, plusieurs sens.** Le mot « échelle » désigne ici la capacité de la plateforme à croître en volume (tenants, données, requêtes) sans que sa qualité de service ni son coût unitaire se dégradent. Il ne se confond pas avec la **performance** d'une requête isolée, ni avec la **disponibilité**, que le module 11 traite. Le terme « partition » désigne tantôt une table découpée dans une base, tantôt un sous-ensemble de tenants sur un serveur : le contexte précise.

**Ordre retenu.** Quatre groupes, de la mesure de la charge à son économie.

```text
Modèle de charge       charge et distribution des tailles, tenant chaud ─ budget de latence, débit et latence
Leviers d'architecture cache ─ réplicas de lecture ─ partitionnement ─ cellules et rayon d'impact ─ multi-région et résidence
Équité et protection   limites par tenant, files équitables, priorités, nivellement ─ requêtes sur schémas dynamiques
Économie               modèle de coûts, attribution, coût de service ─ économie unitaire, FinOps, arbitrage résilience
```

| Groupe | Question de l'équipe |
|---|---|
| Modèle de charge | Quelle charge réelle la plateforme subit-elle, et où est-elle concentrée ? |
| Leviers d'architecture | Quel mécanisme réduit la latence, la charge ou le rayon d'effet, et à quel prix ? |
| Équité et protection | Comment empêcher un tenant d'en pénaliser un autre, et rendre les requêtes dynamiques tenables ? |
| Économie | Combien coûte chaque tenant, et quels compromis décide-t-on avec les chiffres ? |

**Références.** Les articles, documentations et ouvrages cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)
- [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence)
- [22.3 Mise en cache](#223-mise-en-cache)
- [22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication)
- [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage)
- [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact)
- [22.7 Multi-région et routage par résidence des données](#227-multi-région-et-routage-par-résidence-des-données)
- [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)
- [22.9 Performance des requêtes sur schémas dynamiques](#229-performance-des-requêtes-sur-schémas-dynamiques)
- [22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service)
- [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)

## 22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud

### 1. Comprendre simplement

Un **modèle de charge** (*workload model*) décrit ce que la plateforme subit : quels types d'opérations, à quel rythme, avec quelles tailles, à quels moments, et comment cela se répartit entre tenants. La **distribution des tailles de tenants** (*tenant size distribution*) dit combien de tenants sont petits, moyens, grands, et quelle part de la charge chaque catégorie produit. Un **tenant chaud** (*hot tenant*) est un tenant dont l'usage dépasse nettement celui des autres, ou d'un seuil attendu, au point de peser sur les ressources partagées.

**Pourquoi cela existe.** On dimensionne et on teste une plateforme avec un scénario de charge. Si ce scénario est « mille tenants identiques », il est faux : les plateformes réelles ont quelques très gros tenants et une longue traîne de petits, avec des usages très différents. Un système réglé pour la moyenne s'effondre sur le gros tenant, et gaspille sur les petits.

**Problème résolu.** Connaître la charge réelle et sa concentration, pour dimensionner, tester, isoler et facturer en connaissance de cause.

**Modèle mental.** Une ville : beaucoup d'habitants modestes, quelques grands immeubles et une usine. L'urbaniste ne dimensionne pas le réseau d'eau sur l'habitant moyen : il regarde la répartition, et prévoit une alimentation spéciale pour l'usine.

**Où l'analogie s'arrête.** Une ville croît lentement. Un tenant peut multiplier son usage par vingt en une semaine (un import massif, une campagne), et un petit tenant peut devenir chaud sans prévenir.

**Exemple.** Alpha Air compte 800 tenants clients. L'analyse de 30 jours montre que 8 d'entre eux (1 %) produisent 55 % des requêtes, et qu'un seul, une grande compagnie, lance chaque nuit un export de 2 millions de lignes. Le modèle de charge de la plateforme distingue donc des profils (petit, moyen, grand, chaud) avec, pour chacun, un volume, une forme et une saisonnalité.

**Les composants.**

1. le **catalogue des opérations** : lecture, écriture, recherche, import, export, génération ;
2. les **mesures par tenant** : requêtes, données, concurrence, tâches ;
3. la **distribution** des tailles : centiles, concentration ;
4. les **profils de tenant** : petit, moyen, grand, chaud ;
5. la **saisonnalité** : heure, jour, mois, événement ;
6. les **projections** de croissance ;
7. la **détection** des tenants chauds ;
8. les **actions** : quota, isolement, offre dédiée.

**Objectif d'apprentissage :** vous pouvez décrire un modèle de charge multi-tenant, mesurer la concentration de la charge, et dire comment repérer et traiter un tenant chaud.

### 2. Connaissances essentielles

#### Définition

- **Modèle de charge** : description chiffrée des opérations qu'un système subit : types, fréquences, tailles, concurrence, variations dans le temps et répartition entre utilisateurs.
- **Distribution des tailles de tenants** : répartition des tenants selon une mesure de taille (données, requêtes, utilisateurs, coût) et de la part de charge de chaque classe.
- **Tenant chaud** : tenant dont la charge est disproportionnée par rapport aux autres ou à son quota, et qui menace les ressources partagées.

#### Idées fondamentales

1. **La moyenne ment.** La charge est concentrée, et le dimensionnement suit les extrêmes.
2. **On mesure par tenant.** Sans mesure par tenant, on ne voit ni la concentration, ni le tenant chaud.
3. **Plusieurs profils, pas un tenant moyen.** Chaque profil a sa forme.
4. **La charge varie dans le temps.** Journalière, hebdomadaire, mensuelle, événementielle.
5. **Un tenant chaud est un événement normal.** On le détecte et on le traite par des mécanismes, pas par des exceptions manuelles.
6. **Le modèle sert à tester.** Les tests de charge reproduisent la distribution (voir [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).
7. **Le modèle se révise.** La croissance et les usages changent.

#### Vocabulaire essentiel

- **Charge de travail** (*workload*) : ensemble des opérations soumises au système.
- **Concentration** (*concentration*) : part de la charge produite par les plus gros contributeurs.
- **Centile** (*percentile*) : valeur en dessous de laquelle se trouve une part donnée des observations.
- **Longue traîne** (*long tail*) : grand nombre de petits contributeurs.
- **Saisonnalité** (*seasonality*) : régularité de la charge selon le temps.
- **Rafale** (*burst*) : pic bref et fort.
- **Voisin bruyant** (*noisy neighbor*) : tenant qui épuise des ressources partagées (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).

#### Relations de cause à effet

- Le dimensionnement se fait sur la charge moyenne par tenant : un gros tenant sature une ressource partagée aux heures de pointe.
- Les tests de charge utilisent des tenants identiques : l'effet d'un tenant très gros n'apparaît qu'en production.
- Aucune mesure par tenant : l'équipe ne sait pas qui consomme, et ne peut ni facturer, ni protéger.
- Un import massif est lancé aux heures de pointe : les autres tenants voient des lenteurs.
- Un tenant chaud est traité par une règle ad hoc : la règle se perd au changement d'équipe.

#### Idées reçues

- **« Tous les tenants se ressemblent à peu près. »** Non. L'écart entre le plus petit et le plus gros tenant se compte en ordres de grandeur.
- **« Un tenant chaud est un mauvais client. »** Non. C'est souvent un gros client, au contraire : il demande une capacité adaptée, pas une sanction.
- **« Il suffit d'ajouter des serveurs. »** Pas toujours : une ressource partagée (une base, une file, un index) reste le goulot si la charge d'un tenant n'est pas bornée.

#### Principe clé

La charge d'une plateforme multi-tenant se décrit par des profils et une distribution mesurée par tenant ; le dimensionnement, les tests et l'isolation suivent cette distribution, pas la moyenne.

#### Si vous ne retenez que trois choses

1. La charge est concentrée : quelques tenants en produisent une grande part.
2. On mesure par tenant, on décrit des profils, et l'on teste avec la distribution réelle.
3. Un tenant chaud se détecte et se traite par des mécanismes généraux (quotas, files équitables, isolement).

### 3. Explication technique détaillée

#### Les opérations et leurs formes

| Type d'opération | Forme | Sensibilité principale |
|---|---|---|
| Lecture interactive (liste, détail) | Très fréquente, courte | Latence |
| Écriture interactive | Fréquente, courte, transactionnelle | Latence et cohérence |
| Recherche | Fréquente, variable | Latence, index |
| Import et export | Rare, massive | Débit, impact sur les autres |
| Génération de documents, rapports | Rare, coûteuse en calcul | Débit, files |
| Traitements planifiés | Prévisibles, en pointe | Fenêtre de temps |
| Intégrations (webhooks, API) | En rafales | Limites et reprises |

Pour chaque opération, on décrit : fréquence (par seconde, par heure), taille typique et maximale, concurrence, ressources sollicitées (base, index, calcul, réseau) et variation dans le temps.

#### Mesurer la distribution

La première analyse classe les tenants par charge et calcule la part cumulée.

```sql
WITH usage AS (
  SELECT tenant_id, sum(requests) AS requests
    FROM tenant_daily_usage
   WHERE day >= current_date - 30
   GROUP BY tenant_id
), ranked AS (
  SELECT tenant_id,
         requests,
         row_number() OVER (ORDER BY requests DESC) AS rnk,
         count(*) OVER ()                           AS tenants,
         sum(requests) OVER (ORDER BY requests DESC) AS cumulative,
         sum(requests) OVER ()                      AS total
    FROM usage
)
SELECT rnk,
       round(100.0 * rnk / tenants, 1)     AS pct_of_tenants,
       round(100.0 * cumulative / total, 1) AS pct_of_load
  FROM ranked
 WHERE rnk IN (1, 8, 40, 80, 400)
 ORDER BY rnk;
```

Résultat typique d'une plateforme à 800 tenants (valeurs d'exemple) :

| Rang | Part des tenants | Part cumulée de la charge |
|---|---|---|
| 1 | 0,1 % | 11 % |
| 8 | 1 % | 55 % |
| 40 | 5 % | 78 % |
| 80 | 10 % | 88 % |
| 400 | 50 % | 99 % |

La moitié des tenants produit 1 % de la charge. Deux conséquences : le dimensionnement et les tests se font sur les gros profils, et la facturation ou l'allocation des coûts (voir [22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service)) doivent refléter cette concentration. On suit aussi les **centiles** de taille (médiane, 90e, 99e, maximum) et l'évolution de la concentration dans le temps.

#### Les profils

| Profil | Part des tenants (exemple) | Caractéristiques | Traitement |
|---|---|---|---|
| Petit | 70 % | Peu d'utilisateurs, peu de données, rafales rares | Mutualisé, quotas par défaut |
| Moyen | 20 % | Usage régulier, quelques imports | Mutualisé, files équitables |
| Grand | 9 % | Données volumineuses, intégrations, rapports lourds | Pool dédié ou index propre |
| Chaud ou critique | 1 % | Charge forte et irrégulière, exigences contractuelles | Cellule dédiée, limites sur mesure |

Les profils servent à construire les **tenants synthétiques** des tests ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) et à choisir le niveau d'isolation ([5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant), [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)).

#### Détecter un tenant chaud

```json
{
  "hot_tenant_rules": [
    { "id": "share_of_cluster", "metric": "request_share_pct", "window_minutes": 10, "threshold": 20 },
    { "id": "versus_own_baseline", "metric": "requests_per_min", "compare": "own_7d_p95", "ratio": 3 },
    { "id": "database_time", "metric": "db_time_share_pct", "window_minutes": 5, "threshold": 30 },
    { "id": "queue_backlog", "metric": "queued_jobs", "threshold": 5000 }
  ],
  "on_detect": ["tag_tenant_hot", "apply_adaptive_limits", "notify_oncall", "notify_account_owner"]
}
```

Un tenant est chaud par rapport à **trois** repères : la part qu'il prend sur les ressources partagées, son propre historique et son quota. Les règles se mesurent par tenant : pour un très grand nombre de tenants, on limite la cardinalité des métriques en suivant les plus gros contributeurs (les *k* premiers) plutôt que chaque tenant.

#### Traiter un tenant chaud

| Levier | Effet | Où dans le module |
|---|---|---|
| Quotas et limites de débit | Borner l'usage | [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation), [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) |
| Limites de concurrence, files équitables | Protéger les autres | [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) |
| Cache plus agressif sur ses lectures | Réduire la charge | [22.3 Mise en cache](#223-mise-en-cache) |
| Index ou pool dédié | L'isoler des ressources partagées | [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits), [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage) |
| Cellule dédiée | Rayon d'effet propre | [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) |
| Offre commerciale adaptée | Aligner capacité et prix | [24.8 Renouvellement et analyse du départ des clients](24-cycle-vie-client-support.md#248-renouvellement-et-analyse-du-départ-des-clients) |

#### La saisonnalité et les rafales

La charge d'Alpha Air suit les rythmes de l'exploitation aérienne : pic matinal des inspections, bilans de fin de poste, clôtures mensuelles, campagnes de maintenance programmées. Les rafales viennent aussi des **intégrations** : une synchronisation d'un système externe produit des milliers de requêtes en quelques secondes. On les traite par le nivellement de charge (voir [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)), pas par le surdimensionnement permanent.

#### Modes de défaillance

- **Dimensionnement sur la moyenne.**
- **Tests avec des tenants identiques.**
- **Aucune mesure par tenant.**
- **Tenant chaud traité à la main.**
- **Profils figés** : un tenant change de catégorie sans que personne ne le voie.
- **Charges planifiées toutes à la même heure** : pic autoprovoqué.
- **Métriques par tenant sans limite** : explosion de cardinalité.

**Contre-exemple.** Une équipe teste la plateforme avec 1 000 tenants synthétiques identiques, tous à 10 requêtes par seconde. Le test passe. En production, un grand client lance, chaque lundi à 8 h, un export complet qui occupe 70 % du temps de base de données pendant 12 minutes : les autres tenants voient leurs listes passer de 200 ms à 4 secondes. Aucun test ne reproduisait cette forme de charge.

**Limites.** Un modèle de charge est une simplification : il décrit le passé, et la croissance d'un tenant est parfois imprévisible. La concentration de la charge n'est pas une loi : certaines plateformes ont une répartition plus uniforme. Et un modèle riche coûte à maintenir : on le garde proportionné aux décisions qu'il éclaire.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité s'appuie sur ce modèle |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Le voisin bruyant est le cas extrême d'un tenant chaud |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Quotas et consommation fournissent les mesures et les bornes |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les tenants synthétiques reproduisent les profils |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites et files équitables traitent le tenant chaud |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | Une cellule dédiée isole un très gros tenant |
| [22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service) | L'attribution des coûts suit la concentration |
| [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits) | Un index dédié pour les très gros tenants |

### 5. Application pratique

**Situation initiale.** Alpha Air constate des lenteurs le lundi matin. L'équipe pense à un manque de capacité et prévoit d'ajouter des serveurs d'application.

**Problème.** Aucune lecture de la charge par tenant ; la cause est supposée, pas mesurée.

**Application du concept.** L'équipe construit un modèle de charge par tenant et étudie la distribution.

**Déroulé.**

1. Elle ajoute le tenant dans les métriques de requêtes, de temps de base de données et de tâches.
2. Elle calcule la répartition : 8 tenants produisent 55 % de la charge.
3. Elle observe qu'un tenant chaud lance, le lundi à 8 h, un export de 2 millions de lignes.
4. Elle déplace l'export dans une file équitable avec limite de concurrence ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)), et propose au client une fenêtre nocturne.
5. Elle ajoute un profil « chaud » aux tests de charge, avec cette forme d'usage.

**Résultat.** Les lenteurs du lundi disparaissent sans ajout de serveurs, et la plateforme est testée sur une charge qui lui ressemble.

**Limites.** Le client doit être accompagné : l'export nocturne change son processus ; l'équipe commerciale est associée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un modèle de charge multi-tenant ne peut-il pas se limiter à un tenant moyen ?
2. **Compréhension.** Quels repères définissent un tenant chaud ?
3. **Compréhension.** Pourquoi mesure-t-on la charge par tenant ?
4. **Pourquoi.** Pourquoi les tests de charge doivent-ils reproduire la distribution des tailles ?
5. **Raisonnement pratique.** Sur 800 tenants, les 8 premiers produisent 55 % de la charge. Quelle part de la charge produisent, en moyenne, les 792 autres, par tenant, et par rapport à un tenant du top 8 ?

#### Réponses

1. Parce que la charge est très concentrée : quelques gros tenants dominent, et la moyenne ne décrit ni les uns ni les autres. Dimensionner sur la moyenne sature les ressources partagées aux heures de pointe des gros.
2. Sa part sur les ressources partagées, son propre historique et son quota. Un tenant est chaud quand il dépasse nettement l'un de ces repères.
3. Sans mesure par tenant, on ne voit ni la concentration, ni le tenant chaud, et l'on ne peut ni protéger les autres, ni attribuer les coûts.
4. Parce que les défaillances viennent des extrêmes : un test à tenants identiques ne révèle pas ce qu'un tenant très gros fait aux ressources partagées.
5. Les 792 autres produisent 45 % : environ 0,057 % chacun. Chaque tenant du top 8 produit en moyenne $55 / 8 \approx 6{,}9\ \%$, soit environ 120 fois plus.

## 22.2 Budget de latence, débit et latence

### 1. Comprendre simplement

Un **budget de latence** (*latency budget*) répartit le temps de réponse visé d'une opération entre les composants qu'elle traverse : chaque étape reçoit une part, et la somme des parts ne dépasse pas l'objectif. La relation **débit contre latence** (*throughput versus latency*) décrit un compromis : le débit mesure le travail accompli par unité de temps, la latence mesure la durée d'une opération ; quand le système approche de sa capacité, le débit cesse de croître et la latence explose.

**Pourquoi cela existe.** Une requête traverse souvent cinq à dix composants. Si chacun prend « un peu de temps » sans règle, la somme dépasse l'objectif sans que personne en soit responsable. Et sous charge, un système qui paraît rapide à vide devient très lent bien avant d'atteindre 100 % d'utilisation : on doit comprendre pourquoi pour fixer des marges.

**Problème résolu.** Tenir un objectif de latence de bout en bout, de façon explicable, et choisir sciemment entre rapidité de chaque opération et quantité de travail traitée.

**Modèle mental.** Un budget de voyage : on dispose de deux heures pour aller au rendez-vous, on réserve 30 minutes pour le train, 20 pour le métro, 15 pour marcher, et une marge. Et une file au guichet : le temps d'attente s'envole quand le guichet est presque toujours occupé.

**Où l'analogie s'arrête.** Un trajet est séquentiel. Une requête peut appeler plusieurs services en parallèle : alors, la latence est celle du plus lent, et la probabilité qu'un des appels soit lent augmente avec leur nombre.

**Exemple.** Alpha Air vise 300 ms au 95e centile pour afficher la liste des constats. Le budget : routage 20 ms, authentification et contexte de tenant 15 ms, autorisation 25 ms, base de données 120 ms, sérialisation 30 ms, marge 90 ms. Quand une évolution fait passer la base à 180 ms, l'équipe sait que c'est elle qui rompt le budget, et non « le système ».

**Les composants.**

1. l'**objectif de bout en bout** : centile et durée ;
2. la **répartition** par étape ;
3. les **délais d'attente** par appel, bornés par le budget restant ;
4. la **propagation d'échéance** à travers les appels ;
5. la **mesure** par étape et par centile ;
6. la **courbe de saturation** : latence en fonction de la charge ;
7. les **marges** d'utilisation ;
8. les **arbitrages** débit-latence.

**Objectif d'apprentissage :** vous pouvez construire un budget de latence, expliquer pourquoi la latence explose près de la saturation, et relier concurrence, débit et latence par la loi de Little.

### 2. Connaissances essentielles

#### Définition

- **Budget de latence** : répartition du temps de réponse visé entre les étapes d'une opération, avec une marge, de façon que la somme respecte l'objectif.
- **Débit** : quantité de travail traitée par unité de temps (requêtes par seconde, lignes par minute).
- **Latence** : temps écoulé entre le début et la fin d'une opération.

#### Idées fondamentales

1. **On raisonne en centiles.** La moyenne cache la queue de distribution, qui est ce que vivent les utilisateurs les moins chanceux.
2. **Les latences s'additionnent en séquence.** Elles se composent par le maximum en parallèle.
3. **La queue domine à grande échelle.** À grand nombre d'appels, la probabilité d'en rencontrer un lent devient élevée.
4. **La latence explose près de la saturation.** Les files d'attente s'allongent de façon non linéaire.
5. **Concurrence, débit et latence sont liés.** La loi de Little les relie.
6. **Un appel a une échéance.** Elle est héritée du budget restant, pas fixée au hasard.
7. **On garde de la marge.** Fonctionner à 100 % d'utilisation, c'est être déjà en panne.

#### Vocabulaire essentiel

- **Centile** (*percentile*) : p95 est la valeur sous laquelle se trouvent 95 % des mesures.
- **Latence de queue** (*tail latency*) : latence des centiles élevés (p99, p99,9).
- **Échéance** (*deadline*) : instant avant lequel une opération doit se terminer.
- **Délai d'attente** (*timeout*) : durée maximale d'attente d'une réponse.
- **Utilisation** (*utilization*) : part de la capacité effectivement occupée.
- **Loi de Little** (*Little's law*) : $L = \lambda W$ : le nombre moyen d'éléments dans un système égale le débit d'arrivée multiplié par le temps moyen passé dans le système.
- **Mise en lot** (*batching*) : regroupement d'opérations pour traiter davantage par unité de temps.

#### Relations de cause à effet

- Chaque composant ajoute « quelques dizaines de millisecondes » sans budget : l'objectif est dépassé et personne n'est responsable.
- Un service appelle 100 sous-services en parallèle, chacun lent une fois sur cent : une requête sur deux, environ, est lente.
- Le système tourne à 90 % d'utilisation moyenne : les rafales créent des files, et la latence du p99 devient plusieurs fois celle de la médiane.
- Les délais d'attente sont fixés à 30 secondes partout : une dépendance lente retient des ressources et propage la lenteur.
- On augmente le débit par la mise en lot : la latence de chaque opération augmente aussi.

#### Idées reçues

- **« La latence moyenne suffit. »** Non. Les utilisateurs vivent la queue : la moyenne peut être bonne avec un p99 inacceptable.
- **« Un système à 80 % d'utilisation a de la marge. »** Pas forcément : selon la variabilité des arrivées et des durées de service, la latence a déjà beaucoup augmenté.
- **« Plus de débit, c'est moins de latence. »** Souvent le contraire : traiter plus de travail par unité de temps (lots, parallélisme) peut allonger chaque opération.

#### Principe clé

Un objectif de latence se répartit en budget par étape, avec des échéances héritées et des marges ; la latence se juge en centiles et se dégrade vite à l'approche de la saturation.

#### Si vous ne retenez que trois choses

1. Un budget partage l'objectif de bout en bout entre les étapes, avec une marge.
2. La queue de latence domine à grande échelle, et la latence explose près de la saturation.
3. Concurrence, débit et latence se relient par la loi de Little.

### 3. Explication technique détaillée

#### Le budget d'une opération

```json
{
  "operation": "list_findings",
  "slo": { "p95_ms": 300, "p99_ms": 800 },
  "budget_ms": {
    "edge_and_routing": 20,
    "authentication_and_tenant_context": 15,
    "authorization": 25,
    "query_planning_and_database": 120,
    "serialization": 30,
    "margin": 90
  },
  "timeouts_ms": { "database": 150, "authorization_service": 40 }
}
```

La somme des parts est de 300 ms. Le budget a trois usages : **concevoir** (où le temps peut-il aller ?), **surveiller** (quelle étape dépasse sa part ?) et **arbitrer** (si l'on ajoute une vérification de 40 ms, qui cède ?). Les budgets s'expriment par opération importante, avec des variantes par profil de tenant : un grand tenant n'a pas le même coût de base de données qu'un petit.

#### Les centiles et la queue

Le nombre moyen d'appels lents augmente avec le nombre d'appels. Si chaque appel dépasse son seuil une fois sur cent, la probabilité qu'au moins un des $N$ appels en parallèle soit lent est :

$$P = 1 - (1 - p)^N$$

où $p$ est la probabilité qu'un appel soit lent. Avec $p = 0{,}01$ :

| Nombre d'appels $N$ | Probabilité qu'au moins un soit lent |
|---|---|
| 1 | 1,0 % |
| 10 | 9,6 % |
| 100 | 63,4 % |

L'article de Jeffrey Dean et Luiz André Barroso, *The Tail at Scale* (2013), défend que, dans les services à grande échelle et à forte utilisation, les rares réponses lentes finissent par dominer la performance d'ensemble, et qu'il faut concevoir les services pour obtenir une réactivité prévisible à partir de composants moins prévisibles. Pour une plateforme, cela justifie de suivre le p95 et le p99, de limiter les appels en éventail, et de prévoir des délais d'attente courts avec reprises prudentes (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)).

#### Débit, latence et saturation

Un modèle simplifié de file d'attente (une file, un serveur, arrivées aléatoires, durées de service aléatoires) donne le temps moyen passé dans le système :

$$W = \frac{1}{\mu - \lambda}$$

où $\mu$ est la capacité de service (requêtes par seconde que le système peut traiter) et $\lambda$ le débit d'arrivée. Avec $\mu = 100$ requêtes par seconde :

| Débit d'arrivée $\lambda$ | Utilisation | Temps moyen $W$ |
|---|---|---|
| 50 req/s | 50 % | 20 ms |
| 80 req/s | 80 % | 50 ms |
| 90 req/s | 90 % | 100 ms |
| 95 req/s | 95 % | 200 ms |
| 99 req/s | 99 % | 1 000 ms |

Le temps de réponse est multiplié par 50 quand l'utilisation passe de 50 % à 99 %, alors que le débit n'a presque doublé. *Ce modèle est une simplification : les systèmes réels ont plusieurs ressources, des rafales et des durées de service très variables, mais la forme générale (croissance rapide près de la saturation) se retrouve.* D'où la règle d'exploitation : on fixe une **utilisation cible** (par exemple 50 à 70 % en pointe pour les ressources interactives) et l'on ajoute de la capacité avant, pas à 95 %.

#### La loi de Little

La loi de Little énonce que, dans un système stable, le nombre moyen d'éléments présents est égal au débit moyen d'arrivée multiplié par le temps moyen passé dans le système :

$$L = \lambda \times W$$

Elle ne dépend ni de la loi des arrivées, ni de celle des durées de service, ni de l'ordre de service. Application : un service qui reçoit 120 requêtes par seconde, avec 250 ms de latence, a en moyenne $120 \times 0{,}25 = 30$ requêtes en cours. Si l'on limite la concurrence à 20 requêtes, le débit maximal à latence constante est $20 / 0{,}5 = 40$ requêtes par seconde pour 500 ms de latence : la limite de concurrence est une limite de débit déguisée. C'est le lien entre la limite par tenant de [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) et le débit.

#### Propager l'échéance

Un appel en aval ne doit pas attendre plus que le budget restant :

```typescript
function remainingMs(deadlineEpochMs: number, now: number = Date.now()): number {
  return Math.max(0, deadlineEpochMs - now);
}

async function callWithDeadline<T>(
  fn: (timeoutMs: number) => Promise<T>,
  deadlineEpochMs: number,
  reserveMs: number,
): Promise<T> {
  const timeoutMs = remainingMs(deadlineEpochMs) - reserveMs;
  if (timeoutMs <= 0) {
    throw new Error("deadline_exceeded");
  }
  return fn(timeoutMs);
}
```

L'échéance est transmise dans les en-têtes d'appel : chaque étape sait ce qu'il reste et renonce plutôt que de travailler pour rien. Une **réserve** garde de quoi répondre proprement à l'appelant.

#### Les leviers du compromis

| Levier | Effet sur le débit | Effet sur la latence |
|---|---|---|
| Mise en lot | Augmente | Augmente chaque opération |
| Parallélisme | Augmente | Peut diminuer, mais accroît la queue |
| Cache ([22.3 Mise en cache](#223-mise-en-cache)) | Réduit la charge | Diminue en cas de succès |
| Compression | Réduit le réseau | Ajoute du calcul |
| Mise en file ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) | Lisse la charge | Ajoute de l'attente |
| Surdimensionnement | Augmente la marge | Réduit la queue ; coûte |

#### Multi-tenant

- **Centiles par classe de tenant** : un p95 global peut masquer les grands tenants.
- **Objectifs par opération** : une liste interactive et un export n'ont pas le même budget (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).
- **Isolation de la queue** : un tenant lent ne doit pas allonger la queue des autres (voir [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)).

#### Modes de défaillance

- **Budget absent** : somme non maîtrisée.
- **Moyenne seule** comme indicateur.
- **Délais d'attente trop longs** ou **identiques partout**.
- **Fonctionnement à haute utilisation** sans marge.
- **Éventail non borné** : un appel déclenche des centaines d'appels.
- **Reprises en cascade** : chaque couche reprend, la charge se multiplie.
- **Mise en lot excessive** : un traitement rapide devient lent.

**Contre-exemple.** Une équipe règle chaque service pour qu'il réponde en moins de 50 ms « en moyenne ». Une page appelle huit services en séquence. La moyenne de bout en bout est 400 ms. Le p99 atteint 3 secondes, car un appel sur cent est lent et que les huit appels offrent huit occasions de l'être. Aucun budget n'a été fixé pour la page.

**Limites.** Les modèles de file donnent des formes, pas des valeurs : on mesure. Un budget très détaillé devient une contrainte inutile : on le garde pour les opérations qui comptent. Et réduire la latence a un coût : on arbitre selon la valeur perçue (voir [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les objectifs de latence sont des objectifs de niveau de service |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité fixe les marges d'utilisation |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | Les profils de tenants déterminent les budgets réalistes |
| [22.3 Mise en cache](#223-mise-en-cache) | Le cache est le levier le plus direct sur la latence |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites de concurrence et les files protègent la queue |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les reprises et leurs délais |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit protège la capacité |
| [22.9 Performance des requêtes sur schémas dynamiques](#229-performance-des-requêtes-sur-schémas-dynamiques) | Les requêtes dynamiques consomment la plus grande part du budget |

### 5. Application pratique

**Situation initiale.** La liste des constats d'Alpha Air s'affiche en 700 ms au 95e centile, pour un objectif de 300 ms. Chaque équipe affirme que son composant est « rapide ».

**Problème.** Pas de budget, pas de mesure par étape.

**Application du concept.** L'équipe fixe un budget par étape et mesure chaque appel.

**Déroulé.**

1. Elle répartit les 300 ms : routage 20, contexte de tenant 15, autorisation 25, base de données 120, sérialisation 30, marge 90.
2. Elle instrumente chaque étape avec des centiles par classe de tenant.
3. Elle constate : autorisation 140 ms (appels répétés), base de données 310 ms pour les grands tenants.
4. Elle met en cache les décisions d'autorisation (voir [22.3 Mise en cache](#223-mise-en-cache)) et corrige une requête sans index ([22.9 Performance des requêtes sur schémas dynamiques](#229-performance-des-requêtes-sur-schémas-dynamiques)).
5. Elle propage une échéance de 300 ms : les appels renoncent au-delà, et la page se dégrade proprement.

**Résultat.** Le p95 passe à 260 ms, avec un p99 de 650 ms.

**Limites.** Les grands tenants restent plus lents : leur budget de base de données est révisé, avec un index dédié.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un budget de latence, et à quoi sert-il ?
2. **Compréhension.** Pourquoi la latence explose-t-elle près de la saturation ?
3. **Compréhension.** Que dit la loi de Little ?
4. **Pourquoi.** Pourquoi la queue de latence domine-t-elle à grande échelle ?
5. **Raisonnement pratique.** Un service reçoit 150 requêtes par seconde avec une latence moyenne de 200 ms. Combien de requêtes sont en cours en moyenne ?

#### Réponses

1. Une répartition du temps de réponse visé entre les étapes, avec une marge. Il sert à concevoir, à surveiller quelle étape dépasse sa part, et à arbitrer les ajouts.
2. Parce que près de la saturation, les files d'attente s'allongent de façon non linéaire : une petite hausse de charge crée une grande hausse d'attente.
3. Qu'en régime stable, le nombre moyen d'éléments dans un système est égal au débit moyen d'arrivée multipliée par le temps moyen passé dans le système.
4. Parce que plus on fait d'appels, plus la probabilité d'en rencontrer au moins un lent est grande : 1 % de lenteur par appel donne environ 63 % de requêtes touchées pour 100 appels.
5. $L = 150 \times 0{,}2 = 30$ requêtes en cours.

## 22.3 Mise en cache

### 1. Comprendre simplement

La **mise en cache** (*caching*) conserve à proximité le résultat d'un calcul ou d'une lecture coûteux, pour le resservir sans le refaire. Elle se pratique à plusieurs **niveaux** (*levels* : navigateur, réseau de diffusion, mémoire de l'application, cache partagé, base). Elle exige de savoir **invalider** ce qui a changé, d'éviter la **ruée** (*stampede*) quand beaucoup de demandes reconstruisent la même entrée au même moment, et de bâtir des **clés limitées au tenant** (*tenant-scoped keys*) pour ne jamais servir à l'un ce qui est à l'autre.

**Pourquoi cela existe.** Beaucoup de lectures se répètent : la même liste, le même profil, la même configuration. Les recalculer à chaque fois gaspille du temps et charge les ressources partagées. Un cache change l'économie : un résultat coûteux se paie une fois et se sert mille fois.

**Problème résolu.** Réduire la latence et la charge des ressources partagées pour les lectures répétées, sans les rendre fausses ni les exposer au mauvais tenant.

**Modèle mental.** Une étagère de dépannage près du bureau : on y garde les documents souvent demandés, plutôt que d'aller chaque fois aux archives. Mais il faut jeter ce qui est périmé et ne pas y mettre le dossier d'un client dans l'étagère d'un autre.

**Où l'analogie s'arrête.** Une étagère reste là où on l'a mise. Un cache peut disparaître d'un coup (redémarrage, vidage), et toute la charge qu'il absorbait revient en même temps sur les archives.

**Exemple.** La décision « la technicienne Julie peut-elle clore ce constat ? » suppose de lire des rôles, des relations et des règles. L'autorisation met en cache le résultat pendant 30 secondes, sous une clé qui contient le tenant, l'utilisateur, la ressource, l'action et la version du modèle de droits. Une révocation de rôle invalide immédiatement les clés de l'utilisateur.

**Les composants.**

1. les **niveaux** de cache : navigateur, bordure, mémoire locale, cache partagé, base ;
2. la **clé** : tenant, ressource, version, profil de droits ;
3. la **durée de vie** : douce et dure ;
4. l'**invalidation** : à l'expiration, à l'événement, par version ;
5. la **protection contre la ruée** ;
6. le **comportement sans cache** : repli, délestage ;
7. la **mesure** : taux de succès, fraîcheur, évictions ;
8. la **sécurité** : isolation entre tenants.

**Objectif d'apprentissage :** vous pouvez choisir un niveau de cache, concevoir une clé et une stratégie d'invalidation, et protéger un système d'une ruée et d'une fuite entre tenants.

### 2. Connaissances essentielles

#### Définition

- **Mise en cache** : conservation temporaire du résultat d'une opération pour le resservir sans la refaire, au prix d'un risque de péremption.
- **Invalidation** : retrait ou remplacement d'une entrée devenue périmée.
- **Ruée** (*cache stampede*) : afflux simultané de reconstructions d'une même entrée expirée ou absente, qui surcharge la source.
- **Clé limitée au tenant** : clé de cache qui contient le tenant et tout ce qui détermine le résultat.

#### Idées fondamentales

1. **Un cache échange fraîcheur contre vitesse.** On décide du retard acceptable.
2. **La clé contient tout ce qui détermine la réponse.** Tenant, droits, version, paramètres.
3. **L'invalidation est le point difficile.** Durée de vie, événement, version.
4. **Un cache vide ne doit pas casser le service.** Le comportement à froid se prévoit.
5. **Une ruée se prévient.** Un seul reconstruit, les autres attendent ou servent le périmé.
6. **Un cache est une couche à isoler.** Une clé sans tenant est une fuite (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
7. **On mesure.** Taux de succès, fraîcheur, coût.

#### Vocabulaire essentiel

- **Cache de côté** (*side cache*, *cache-aside*) : le code applicatif lit le cache, puis la source en cas d'absence, et remplit le cache.
- **Cache en ligne** (*inline cache*, *read-through*, *write-through*) : le cache est placé derrière l'interface d'accès aux données.
- **Cache local et cache externe** (*on-box*, *external cache*) : en mémoire du processus, ou service partagé (de type Redis ou Memcached).
- **Durée de vie** (*time to live*, TTL) : durée de validité d'une entrée.
- **Durée douce et dure** (*soft TTL*, *hard TTL*) : la douce déclenche un rafraîchissement ; la dure borne le service d'une entrée périmée.
- **Coalescence des requêtes** (*request coalescing*) : une seule requête en vol par clé absente.
- **Cache négatif** (*negative caching*) : mise en cache d'une absence ou d'une erreur.
- **Éviction** (*eviction*) : retrait d'une entrée pour faire de la place.
- **Taux de succès** (*hit ratio*) : part des demandes servies par le cache.

#### Relations de cause à effet

- La clé ne contient pas le tenant : une réponse d'un tenant est servie à un autre.
- La clé ne contient pas le profil de droits : une personne reçoit ce qu'une autre était autorisée à voir.
- Le cache est vidé lors d'un déploiement : toute la charge retombe sur la base en quelques secondes.
- Une entrée très demandée expire : cent requêtes la reconstruisent en même temps.
- Le service dépend du cache pour sa disponibilité : la panne du cache provoque une panne du service.

#### Idées reçues

- **« Mettre en cache accélère toujours. »** Non. Un cache à faible taux de succès coûte sans gagner, et ajoute de la complexité.
- **« Le TTL court règle l'invalidation. »** Il réduit le problème sans le supprimer, et augmente la charge sur la source.
- **« Un cache est une optimisation que l'on peut retirer à tout moment. »** Quand le système a été dimensionné avec lui, le retirer le met en panne.

#### Principe clé

Un cache sert vite ce qui s'est déjà calculé, à condition que sa clé contienne tout ce qui détermine la réponse, que son invalidation soit pensée, et que le système tienne s'il disparaît.

#### Si vous ne retenez que trois choses

1. La clé contient le tenant, les droits, la version et les paramètres.
2. L'invalidation se conçoit : durée de vie, événement, clé versionnée.
3. Le service doit résister à un cache vide et à une ruée.

### 3. Explication technique détaillée

#### Les niveaux

| Niveau | Où | Durée de vie typique | Ce qu'on y met | Remarque |
|---|---|---|---|---|
| Navigateur | Poste de l'utilisateur | Minutes à heures | Ressources statiques, réponses publiques ou privées | Règles HTTP, voir [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) |
| Réseau de diffusion | Périphérie | Minutes à jours | Contenu statique, miniatures ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) | Clé de cache et droits |
| Mémoire locale | Processus de l'application | Secondes à minutes | Configuration, décisions d'autorisation | Rapide, mais différent par serveur ; chauffe séparément |
| Cache partagé | Service externe | Secondes à heures | Résultats de requêtes, sessions | Une vue commune ; un service de plus à exploiter |
| Base | Mémoire de la base, vues matérialisées ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](19-recherche-analytique-restitution.md#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)) | Selon la base | Pages, agrégats | Géré par la base |

La documentation d'un grand fournisseur d'infrastructure distingue les caches **en ligne**, placés derrière l'interface d'accès aux données (le client n'a rien à changer, mais le cache devient une part de la disponibilité de la dépendance), des caches **de côté**, gérés par le code applicatif, qui lit le cache avant la dépendance puis y range le résultat. Elle oppose aussi le cache en mémoire du processus, rapide à ajouter mais propre à chaque serveur, au cache externe partagé, qui évite le démarrage à froid par serveur mais ajoute un parc à exploiter.

#### La clé

```typescript
interface CacheKeyParts {
  tenantId: string;
  resource: string;
  id: string;
  modelVersion: number;
  permissionProfile: string;
  locale: string;
}

function cacheKey(p: CacheKeyParts): string {
  return ["v1", p.tenantId, p.resource, p.id, `m${p.modelVersion}`, p.permissionProfile, p.locale].join(":");
}
```

Chaque composant a une raison :

| Composant | Raison |
|---|---|
| `tenantId` | Aucune réponse d'un tenant ne sert un autre ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) |
| `modelVersion` | Un changement de configuration ou de schéma change la réponse ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) |
| `permissionProfile` | Deux personnes de droits différents ne partagent pas une réponse filtrée ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne), [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord)) |
| `locale` | Les libellés et formats dépendent de la langue ([25.3 Formats régionaux, tri et mise en page de droite à gauche](25-experiences-multi-contextes.md#253-formats-régionaux-tri-et-mise-en-page-de-droite-à-gauche)) |
| Préfixe de version `v1` | On peut invalider tout le format d'un coup |

Une clé qui omet l'un de ces éléments produit une fuite ou une réponse fausse.

#### Durée de vie et invalidation

La documentation précitée relève que la durée de vie absolue est l'approche d'expiration la plus courante, et recommande deux durées : une durée **douce**, qui déclenche des tentatives de rafraîchissement, et une durée **dure**, qui borne le temps pendant lequel une donnée périmée peut être servie quand la dépendance est indisponible.

| Stratégie | Principe | Atouts | Limites |
|---|---|---|---|
| Expiration | La donnée vit une durée fixe | Simple | Fraîcheur approximative ; charge régulière sur la source |
| Invalidation par événement | Un événement de changement supprime les clés concernées (voir [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) | Fraîcheur fine | Le chemin d'invalidation doit être fiable ; latence de propagation |
| Clé versionnée | La version fait partie de la clé ; un changement crée une nouvelle clé | Pas de suppression à faire | Les anciennes entrées occupent la mémoire jusqu'à expiration |
| Écriture traversante | L'écriture met à jour source et cache | Cohérence | Complexité, double écriture |

La **règle de fraîcheur** s'exprime par donnée : un libellé de statut peut avoir 5 minutes de retard ; un droit révoqué, quelques secondes ; une valeur financière, aucun (on ne la met pas en cache, ou on la lit à la source).

```json
{
  "cache_policies": [
    { "name": "authorization_decision", "ttl_seconds": 30, "invalidate_on": ["role.revoked", "membership.changed"], "key": ["tenant", "user", "resource", "action", "model_version"] },
    { "name": "tenant_configuration", "ttl_seconds": 300, "invalidate_on": ["configuration.published"], "key": ["tenant", "config_version"] },
    { "name": "list_findings_first_page", "ttl_seconds": 10, "invalidate_on": [], "key": ["tenant", "filters", "permission_profile", "locale"], "stale_while_error_seconds": 120 },
    { "name": "financial_balance", "ttl_seconds": 0, "note": "jamais en cache" }
  ]
}
```

#### La ruée

Le même texte décrit le comportement à deux modes d'un service qui dépend d'un cache : selon qu'une requête rencontre ou non le cache, le comportement est très différent ; une baisse du taux de succès ou un vidage du cache peut surcharger brusquement les dépendances, déclencheurs fréquents : déploiements qui vident les caches locaux, pannes du parc de cache, changements de trafic. Parmi les parades qu'il cite : la **coalescence des requêtes** (une seule requête en cours pour une clé absente, les autres attendent), le service de **données périmées** pendant une panne, et le **plafonnement** du débit vers la dépendance.

Une autre famille de parades repose sur un rafraîchissement **probabiliste anticipé** : plutôt que d'attendre l'expiration, chaque demande a une probabilité, croissante à l'approche de l'échéance, de reconstruire l'entrée avant qu'elle n'expire. Le travail de Vattani, Chierichetti et Lowenstein (2015) en propose des algorithmes qualifiés d'optimaux.

| Parade | Effet | Limite |
|---|---|---|
| Coalescence des requêtes | Une reconstruction par clé | Les autres attendent ; verrou ou futur partagé |
| Servir du périmé le temps de la reconstruction | La latence reste faible | Fraîcheur dégradée |
| Rafraîchissement anticipé | Pas d'expiration synchrone | Un peu de charge en plus |
| Dispersion des durées de vie (jitter) | Évite des expirations simultanées | Fraîcheur variable |
| Plafond de débit vers la source | Protège la source | Des requêtes sont refusées |

#### Gain attendu

La latence moyenne observée d'une lecture est :

$$T = h \times T_{\text{cache}} + (1 - h) \times T_{\text{source}}$$

où $h$ est le taux de succès. Avec $T_{\text{cache}} = 2$ ms et $T_{\text{source}} = 80$ ms :

| Taux de succès $h$ | Latence moyenne | Charge sur la source (pour 1 000 req/s) |
|---|---|---|
| 50 % | 41 ms | 500 req/s |
| 90 % | 9,8 ms | 100 req/s |
| 98 % | 3,6 ms | 20 req/s |

Gagner les derniers points de taux de succès réduit fortement la charge sur la source : de 90 % à 98 %, la charge est divisée par cinq. Mais un taux très élevé fait aussi dépendre le système du cache : on teste son comportement **sans** cache (voir [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

#### Sécurité

- **Isolation** : clé et espace de noms par tenant ; pour les contenus sensibles, cache dédié ou chiffrement des valeurs ([11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)).
- **Droits** : le profil de droits dans la clé ; invalidation à la révocation.
- **Empoisonnement** : un cache ne doit accepter que des valeurs produites par le service autorisé.
- **Données personnelles** : durée de vie compatible avec la suppression ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation), [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) ; purge à la demande.
- **Cache négatif** : les absences et erreurs sont mises en cache avec une durée de vie propre, courte, pour que des demandes répétées sur une ressource inexistante ne se multiplient pas.

#### Modes de défaillance

- **Clé sans tenant** : fuite.
- **Clé sans profil de droits** : exposition.
- **Vidage au déploiement** : surcharge de la source.
- **Ruée** sur une entrée chaude.
- **Invalidation oubliée** : donnée périmée longtemps.
- **Dépendance critique au cache.**
- **Cache non mesuré** : coût sans gain.

**Contre-exemple.** Un cache de résultats de recherche est clé sur le texte de la requête et les filtres, sans le profil de droits. La première personne, responsable qualité, charge « constats critiques ouverts ». Un technicien aux droits restreints tape la même recherche : il reçoit la liste du responsable, y compris des constats qu'il n'a pas le droit de voir. Le contrôle de droits existait, mais derrière le cache.

**Limites.** Un cache accélère les lectures répétées ; il ne répare ni une requête mal conçue ni une architecture saturée. L'invalidation parfaite n'existe pas : on choisit le retard acceptable. Et un cache ajoute un composant, des pannes possibles et une surface de sécurité.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu) | Le réseau de diffusion est un niveau de cache |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | Les en-têtes HTTP de cache, privé et partagé |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | La clé de cache est une couche d'isolation |
| [12.7 Tableaux de bord](12-produit-ux.md#127-tableaux-de-bord) | Le calcul des tableaux de bord et la clé de cache avec profil de droits |
| [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Les événements de changement invalident les clés |
| [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence) | Le cache réduit la latence, et protège le budget |
| [19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](19-recherche-analytique-restitution.md#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne) | Les agrégats matérialisés sont des caches de calcul |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Les données en cache suivent les règles de conservation |

### 5. Application pratique

**Situation initiale.** Alpha Air calcule les droits à chaque requête : cinq lectures de rôles et de relations, 140 ms en moyenne. Un redémarrage général de la plateforme l'an dernier a fait doubler la charge de la base pendant dix minutes.

**Problème.** Un calcul coûteux répété, et aucune protection contre le démarrage à froid.

**Application du concept.** L'équipe met en cache les décisions d'autorisation avec une clé complète, une invalidation par événement et une protection contre la ruée.

**Déroulé.**

1. La clé contient le tenant, l'utilisateur, la ressource, l'action et la version du modèle de droits.
2. La durée de vie est de 30 secondes ; la révocation d'un rôle invalide immédiatement les clés de l'utilisateur.
3. La coalescence des requêtes garantit une seule évaluation par clé absente.
4. Le déploiement ne vide plus le cache : les entrées partagées survivent aux redémarrages des serveurs.
5. Un test de charge avec le cache désactivé vérifie que la plateforme reste utilisable en mode dégradé, avec délestage.

**Résultat.** La latence d'autorisation passe de 140 ms à 6 ms en moyenne, avec un taux de succès de 94 %, et un redémarrage ne surcharge plus la base.

**Limites.** Une révocation de droit n'est effective qu'après invalidation : la fenêtre de 30 secondes, au pire, est acceptée pour ces droits, et ramenée à zéro pour les actions les plus sensibles (lecture directe).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que doit contenir la clé d'un cache de résultats dans une plateforme multi-tenant ?
2. **Compréhension.** Qu'est-ce qu'une ruée de cache, et comment la prévient-on ?
3. **Compréhension.** Quelle différence y a-t-il entre durée de vie douce et durée dure ?
4. **Pourquoi.** Pourquoi faut-il tester le service avec le cache désactivé ?
5. **Raisonnement pratique.** Avec $T_{\text{cache}} = 3$ ms, $T_{\text{source}} = 100$ ms et un taux de succès de 95 %, quelle est la latence moyenne, et quelle part des requêtes atteint la source ?

#### Réponses

1. Le tenant, la ressource, la version du modèle ou de la configuration, le profil de droits et les paramètres qui déterminent la réponse (langue, filtres).
2. Un afflux simultané de reconstructions d'une même entrée absente ou expirée, qui surcharge la source. On la prévient par la coalescence des requêtes, le service de données périmées pendant la reconstruction, le rafraîchissement anticipé et le plafonnement du débit vers la source.
3. La durée douce déclenche des tentatives de rafraîchissement tout en continuant de servir ; la durée dure borne le temps pendant lequel une donnée périmée peut être servie quand la source est indisponible.
4. Parce qu'un cache vidé ou en panne est un cas normal : sans test, on découvre en incident que le service ne tient pas sans lui.
5. $0{,}95 \times 3 + 0{,}05 \times 100 = 2{,}85 + 5 = 7{,}85$ ms ; 5 % des requêtes atteignent la source.

## 22.4 Réplicas de lecture et retard de réplication

### 1. Comprendre simplement

Un **réplica de lecture** (*read replica*) est une copie d'une base de données, tenue à jour à partir de la base principale, qui sert uniquement des lectures. Le **retard de réplication** (*replication lag*) est le délai entre une écriture validée sur la base principale et sa visibilité sur le réplica. Les deux vont ensemble (*read replica and replication lag*) : on ajoute des réplicas pour absorber les lectures, et l'on accepte que ces lectures voient un état légèrement ancien.

**Pourquoi cela existe.** Dans la plupart des applications, les lectures sont bien plus nombreuses que les écritures, et la base principale est un point d'étranglement : une seule peut accepter les écritures. Servir les lectures depuis des copies soulage la base principale, accroît la capacité de lecture et permet de placer des copies plus près des utilisateurs.

**Problème résolu.** Étendre la capacité de lecture et isoler les lectures lourdes (rapports, exports) des écritures interactives, sans multiplier les bases à écrire.

**Modèle mental.** Un bureau principal où l'on écrit le registre, et des bureaux annexes qui reçoivent des copies du registre et répondent aux consultations. L'annexe a toujours un peu de retard : un document qui vient d'être enregistré n'y est pas encore.

**Où l'analogie s'arrête.** Une annexe papier reçoit le registre par courrier, avec un retard régulier. Un réplica reçoit un flux continu de changements, dont le retard varie avec la charge, une panne réseau ou une grosse transaction, et il peut annuler une requête longue quand elle gêne l'application des changements.

**Exemple.** Alpha Air sert la liste des constats depuis un réplica. Karim crée un constat, puis recharge la liste : le constat n'y figure pas encore, parce que le réplica a 900 ms de retard. L'application garde la lecture de la session sur la base principale pendant 5 secondes après une écriture : Karim voit son constat.

**Les composants.**

1. la **base principale** et ses **réplicas** ;
2. le **flux de réplication**, asynchrone en général ;
3. la **mesure du retard** ;
4. le **routage des lectures** ;
5. la **règle de lecture après écriture** ;
6. les **réplicas dédiés** : lecture interactive, rapports ;
7. la **bascule** en cas de panne (voir [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)) ;
8. les **conflits** entre requêtes longues et application des changements.

**Objectif d'apprentissage :** vous pouvez décrire un routage de lectures vers des réplicas, expliquer le retard de réplication et ses conséquences, et choisir ce qui peut être lu sur un réplica.

### 2. Connaissances essentielles

#### Définition

- **Réplica de lecture** : copie d'une base, alimentée par la base principale, qui accepte uniquement des lectures.
- **Retard de réplication** : durée (ou volume de journal) entre un changement validé sur la base principale et son application sur le réplica.

#### Idées fondamentales

1. **Un réplica soulage les lectures, pas les écritures.** L'écriture reste sur la base principale.
2. **La réplication asynchrone a un retard.** Un réplica est cohérent à terme (voir [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)).
3. **Toutes les lectures ne se valent pas.** Certaines tolèrent le retard, d'autres non.
4. **Lire ses propres écritures se garantit.** Par un routage vers la base principale ou un jeton de cohérence.
5. **Le retard se mesure et se borne.** Une règle de repli s'applique au-delà d'un seuil.
6. **Une requête longue entre en conflit avec la réplication.** Un réplica de rapport se règle autrement qu'un réplica de haute disponibilité.
7. **Un réplica n'est pas une sauvegarde.** Il copie aussi les erreurs (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

#### Vocabulaire essentiel

- **Base principale** (*primary*) : base qui accepte les écritures.
- **Réplication asynchrone** (*asynchronous replication*) : la base principale valide sans attendre le réplica.
- **Réplication synchrone** (*synchronous replication*) : la validation attend la confirmation du réplica.
- **Lecture de sa propre écriture** (*read-your-writes*) : garantie de voir ce que l'on vient d'écrire.
- **Jeton de cohérence** (*consistency token*) : position dans le journal des écritures qu'un réplica doit avoir atteinte.
- **Conflit de récupération** (*recovery conflict*) : conflit entre une requête en cours sur le réplica et l'application des changements.
- **Réplica de rapport** (*reporting replica*) : réplica réglé pour de longues requêtes.

#### Relations de cause à effet

- Toutes les lectures vont sur les réplicas : une personne qui vient d'écrire ne voit pas son changement, et recommence.
- Aucune mesure du retard : une panne de réplication laisse des réplicas périmés pendant des heures.
- Les rapports longs tournent sur le réplica de haute disponibilité : l'application des changements est retardée, ou les requêtes sont annulées.
- Le réplica sert à la sauvegarde : une suppression erronée s'y propage.
- La lecture de droits va sur un réplica en retard : un droit révoqué reste actif quelques secondes.

#### Idées reçues

- **« Un réplica est toujours à jour. »** Non. Avec la réplication asynchrone, il est en retard, de façon variable.
- **« Plus de réplicas, c'est plus de performances en écriture. »** Non. Les écritures restent sur la base principale, et chaque réplica ajoute du travail de réplication.
- **« Un réplica remplace la sauvegarde. »** Non. Il copie les erreurs et les corruptions.

#### Principe clé

On route vers les réplicas les lectures qui tolèrent un état légèrement ancien, on garde sur la base principale celles qui n'y consentent pas, et l'on mesure le retard pour savoir où l'on en est.

#### Si vous ne retenez que trois choses

1. Un réplica absorbe des lectures et accepte un retard, borné et mesuré.
2. Une règle garantit la lecture de sa propre écriture et protège les lectures critiques.
3. Un réplica de rapport et un réplica de haute disponibilité se règlent différemment.

### 3. Explication technique détaillée

#### Le principe et ses limites

La documentation de PostgreSQL décrit le mode « veille active » (*hot standby*) : un serveur de secours peut exécuter des **requêtes en lecture seule** une fois qu'il a atteint un état cohérent. Les écritures, les modifications de schéma et les commandes de maintenance y sont refusées. La même documentation précise que les données arrivent de la base principale avec un délai mesurable : la même requête, lancée presque simultanément sur la principale et sur la réplique, peut renvoyer des résultats différents. Elle décrit les données de la réplique comme **cohérentes à terme** avec la principale.

| Réplication | Principe | Retard | Disponibilité en écriture | Usage |
|---|---|---|---|---|
| Asynchrone | La principale valide sans attendre | Variable | Peu affectée | Réplicas de lecture |
| Synchrone | La validation attend le réplica | Nul pour les données confirmées | Dépend du réplica | Haute disponibilité, perte de données nulle |

#### Conflits avec la récupération

Un réplica doit appliquer les changements déjà validés sur la principale, et ne peut pas attendre indéfiniment. Si une requête lit une table qu'un changement supprime, le réplica doit soit retarder l'application, soit annuler la requête. La documentation de PostgreSQL décrit le paramètre `max_standby_streaming_delay` : durée maximale pendant laquelle l'application peut attendre avant d'annuler les requêtes en conflit ; des valeurs courtes conviennent aux réplicas de haute disponibilité, des valeurs longues ou infinies aux réplicas de rapport. Elle décrit aussi les conflits liés au nettoyage des versions de lignes, et l'option `hot_standby_feedback`, qui empêche la principale de supprimer des lignes encore nécessaires au réplica, au prix d'un risque de gonflement des tables.

| Type de réplica | Réglage | Usage |
|---|---|---|
| Haute disponibilité et lecture interactive | Délai d'attente court | Rester proche de la principale ; requêtes courtes |
| Rapport | Délai long | Requêtes longues ; retard toléré |

#### Mesurer le retard

```sql
SELECT now() - pg_last_xact_replay_timestamp() AS replication_delay;
```

La requête s'exécute sur le réplica. Si la principale n'écrit plus, la valeur croît sans que le réplica soit en retard : on la complète par la comparaison des positions du journal (`pg_current_wal_lsn()` sur la principale, `pg_last_wal_replay_lsn()` sur le réplica). *Ces noms de fonctions sont ceux de PostgreSQL, à vérifier dans la version utilisée.* On suit le retard en centiles, par réplica, avec une alerte au-delà d'un seuil.

#### Router les lectures

```json
{
  "read_routing": {
    "default": "replica",
    "force_primary_when": [
      { "after_write_by_same_session_seconds": 5 },
      { "operation": "authorization_critical" },
      { "replica_lag_seconds_over": 3 }
    ],
    "replica_selection": "least_lag_in_same_cell",
    "max_tolerated_lag_seconds": { "list_views": 10, "dashboards": 60, "reports": 300 }
  }
}
```

| Lecture | Réplica ? | Raison |
|---|---|---|
| Liste et recherche | Oui, avec garde de lecture après écriture | Tolère quelques secondes |
| Détail juste après une écriture | Non (principale) | La personne attend son changement |
| Contrôle de droit sensible | Non | Un retard est un retard de sécurité ([19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)) |
| Tableaux de bord, rapports | Oui, réplica de rapport | Tolère minutes de retard ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |
| Contrôle d'unicité, vérification avant écriture | Non | Exige la vérité ([7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme)) |

**Garantir la lecture de sa propre écriture.** Deux techniques :

- **Fenêtre de session** : après une écriture, la session lit sur la principale pendant quelques secondes ;
- **Jeton de cohérence** : l'écriture renvoie la position du journal ; la lecture suivante la transmet, et le routeur choisit un réplica qui l'a dépassée, ou la principale.

```typescript
interface ReplicaState {
  id: string;
  replayedLsn: bigint;
  lagSeconds: number;
}

function chooseNode(
  minLsn: bigint | null,
  replicas: ReplicaState[],
  maxLagSeconds: number,
): "primary" | string {
  const eligible = replicas
    .filter((r) => r.lagSeconds <= maxLagSeconds)
    .filter((r) => minLsn === null || r.replayedLsn >= minLsn)
    .sort((a, b) => a.lagSeconds - b.lagSeconds);
  return eligible.length > 0 ? eligible[0].id : "primary";
}
```

La fonction retombe sur la principale quand aucun réplica n'est assez à jour : le service reste correct, au prix d'une charge plus grande sur la principale.

#### Gain de capacité

Supposons 10 000 requêtes par seconde, dont 90 % de lectures. Sans réplica, la principale en traite 10 000. Avec trois réplicas et un routage de 90 % des lectures vers eux, chaque réplica traite environ 3 000 lectures par seconde, et la principale ne traite plus que les 1 000 écritures et les lectures critiques : sa charge est divisée par un facteur proche de dix, à condition que le retard soit acceptable.

#### Multi-tenant

- **Réplicas par cellule** : chaque cellule a ses réplicas ([22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact)).
- **Réplicas dédiés** pour les grands tenants et leurs rapports lourds ([22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)).
- **Droits** : un réplica contient les mêmes données ; les contrôles d'isolation s'appliquent de la même façon.
- **Analyse** : un réplica de rapport est une étape ; l'entrepôt ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)) prend le relais quand les besoins grandissent.

#### Modes de défaillance

- **Lecture de sa propre écriture non garantie.**
- **Lectures critiques sur un réplica.**
- **Retard non mesuré.**
- **Rapports sur le réplica de haute disponibilité.**
- **Tempête de reprises** quand un réplica est promu et que les autres se resynchronisent.
- **Réplica pris pour sauvegarde.**
- **Divergence de versions** entre principale et réplicas.

**Contre-exemple.** Une plateforme lit tous les droits sur un réplica. Un administrateur retire à une personne le rôle qui donne accès à des constats sensibles. Le réplica a 40 secondes de retard à cause d'une grosse tâche d'import. Pendant ces 40 secondes, la personne garde l'accès. Les lectures de droits sensibles devaient se faire sur la principale, ou vérifier le jeton de cohérence.

**Limites.** Un réplica ne soulage que les lectures. Il ajoute une charge de réplication à la principale. Le retard est irréductible en asynchrone, et la synchrone a un coût de disponibilité. Au-delà d'un certain volume d'écritures, la solution est le partitionnement ([22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [7.8 Cohérence à terme](07-evenements-automatisation.md#78-cohérence-à-terme) | Le réplica est cohérent à terme |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | Réplication, redondance et basculement |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | Un réplica n'est pas une sauvegarde |
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | L'entrepôt prolonge le réplica de rapport |
| [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence) | Le routage vers des réplicas réduit la latence sous charge |
| [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage) | Le partitionnement traite la limite d'écriture |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | Réplicas par cellule |
| [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits) | Les droits sensibles ne se lisent pas sur un réplica en retard |

### 5. Application pratique

**Situation initiale.** La base principale d'Alpha Air plafonne à 85 % de processeur aux heures de pointe, avec 92 % de lectures. Les rapports hebdomadaires la saturent le lundi.

**Problème.** Toutes les lectures, interactives et lourdes, vont sur la base principale.

**Application du concept.** L'équipe introduit deux réplicas interactifs et un réplica de rapport, avec routage.

**Déroulé.**

1. Deux réplicas à délai court servent les listes et la recherche ; un réplica de rapport à délai long sert les rapports et exports.
2. Le routage envoie les lectures tolérantes aux réplicas et garde sur la principale les écritures, les droits sensibles et les vérifications d'unicité.
3. Après une écriture, la session lit sur la principale pendant 5 secondes ; un jeton de cohérence protège les enchaînements.
4. Le retard est suivi par réplica ; au-delà de 3 secondes, le routage retombe sur la principale.
5. Un test coupe volontairement la réplication : le service continue, avec la principale plus chargée.

**Résultat.** La charge de la principale tombe à 30 % de processeur aux heures de pointe, et les rapports du lundi ne gênent plus les écritures.

**Limites.** Les personnes voient parfois des listes en retard de quelques secondes ; l'interface l'indique (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi un réplica de lecture a-t-il un retard ?
2. **Compréhension.** Quelles lectures ne doivent pas être servies par un réplica en retard ?
3. **Compréhension.** Comment garantit-on la lecture de sa propre écriture ?
4. **Pourquoi.** Pourquoi règle-t-on différemment un réplica de rapport et un réplica de haute disponibilité ?
5. **Raisonnement pratique.** 20 000 requêtes par seconde, dont 85 % de lectures ; 80 % des lectures partent vers 4 réplicas. Quelle charge reste sur la principale, et combien par réplica ?

#### Réponses

1. Parce que la réplication est asynchrone : la principale valide sans attendre le réplica, qui applique les changements un peu plus tard, à un rythme qui varie avec la charge et le réseau.
2. Celles qui exigent la vérité à l'instant : droits sensibles, contrôles d'unicité, vérifications avant écriture, et la lecture immédiate de son propre changement.
3. En lisant sur la principale pendant une courte fenêtre après l'écriture, ou en transmettant un jeton de cohérence qui impose un réplica ayant atteint la position de l'écriture.
4. Un réplica de rapport exécute de longues requêtes et tolère du retard : on allonge le délai avant annulation. Un réplica de haute disponibilité doit rester proche de la principale : on le règle court.
5. Lectures : $20\,000 \times 0{,}85 = 17\,000$ ; vers réplicas : $17\,000 \times 0{,}8 = 13\,600$, soit 3 400 par réplica ; reste sur la principale : $3\,000$ écritures $+ 3\,400$ lectures $= 6\,400$ requêtes par seconde.

## 22.5 Partitionnement, clé de partition et rééquilibrage

### 1. Comprendre simplement

Le **partitionnement** (*partitioning*) découpe une grande table en morceaux, appelés partitions, selon une règle. Le **partitionnement horizontal réparti** (*sharding*) place ces morceaux sur des serveurs ou des bases différentes. La **clé de partition** (*shard key*) est la colonne ou la règle qui décide dans quel morceau va chaque ligne. Le **rééquilibrage** (*rebalancing*) déplace des données entre morceaux quand la charge ou la taille se répartit mal. L'ensemble forme la fonction *partitioning and sharding*, puis *shard key and rebalancing*.

**Pourquoi cela existe.** Une seule base finit par atteindre ses limites : volume de données, débit d'écriture, durée des opérations de maintenance. Découper permet de garder des morceaux de taille gérable, de ne toucher que les morceaux concernés par une requête, et, avec la répartition, d'ajouter de la capacité d'écriture.

**Problème résolu.** Continuer à croître en données et en écritures sans que chaque opération touche tout.

**Modèle mental.** Un classeur géant découpé en tiroirs étiquetés. Pour retrouver un dossier, on ne parcourt que le bon tiroir ; pour archiver l'année passée, on retire un tiroir. Quand un tiroir déborde, on le scinde ou l'on déplace des dossiers.

**Où l'analogie s'arrête.** Un classeur est statique. Dans une plateforme, des tenants grandissent à des rythmes différents, le tiroir d'un gros tenant déborde, et il faut déplacer des données sans arrêter le service.

**Exemple.** La table des événements d'audit d'Alpha Air ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) est partitionnée par mois : l'insertion touche la partition du mois courant, une recherche sur le dernier trimestre ne lit que trois partitions, et supprimer les données de plus de cinq ans consiste à détacher des partitions. Les tenants eux-mêmes sont répartis sur plusieurs bases (*shards*), le tenant servant de clé, avec un annuaire qui dit où se trouve chacun.

**Les composants.**

1. la **méthode** de partitionnement : plage, liste, hachage ;
2. la **clé de partition** ;
3. l'**annuaire** ou la fonction de placement ;
4. la **taille et le nombre** de partitions ;
5. les **requêtes** qui élaguent ;
6. le **rééquilibrage** : déplacement de données ;
7. les **contraintes** : unicité, transactions, jointures ;
8. la **supervision** de la répartition.

**Objectif d'apprentissage :** vous pouvez distinguer partitionnement et répartition, choisir une clé de partition, et décrire comment l'on rééquilibre sans interrompre le service.

### 2. Connaissances essentielles

#### Définition

- **Partitionnement** : découpage d'une table logique en sous-tables physiques selon une règle appliquée à une ou plusieurs colonnes.
- **Répartition horizontale** (*sharding*) : placement de partitions ou de groupes de données sur des serveurs ou bases distincts, chacun traitant une part des écritures.
- **Clé de partition** : donnée qui détermine la partition d'une ligne ou d'un enregistrement.
- **Rééquilibrage** : déplacement de données entre partitions ou serveurs pour corriger un déséquilibre de taille ou de charge.

#### Idées fondamentales

1. **La clé de partition est la décision la plus structurante.** Elle détermine l'élagage, la répartition et les limites.
2. **Elle suit les requêtes.** Une requête qui ne fournit pas la clé touche toutes les partitions.
3. **Elle répartit la charge, pas seulement les données.** Une clé équilibrée en taille peut être déséquilibrée en usage.
4. **Le tenant est souvent une bonne clé.** Les données d'un tenant restent ensemble, avec des transactions locales.
5. **Il y a un point faible : le tenant chaud.** Une partition par tenant le concentre (voir [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)).
6. **Le rééquilibrage est inévitable.** La répartition initiale ne reste pas bonne.
7. **Changer de clé coûte très cher.** On la choisit avec soin.

#### Vocabulaire essentiel

- **Élagage de partitions** (*partition pruning*) : le planificateur ignore les partitions qui ne peuvent pas répondre.
- **Partitionnement par plage, par liste, par hachage** (*range*, *list*, *hash partitioning*) : trois méthodes.
- **Hachage cohérent** (*consistent hashing*) : répartition qui ne déplace qu'une fraction des clés quand on ajoute ou retire un serveur.
- **Nœud virtuel** (*virtual node*) : point supplémentaire d'un serveur sur l'anneau, qui lisse la charge.
- **Partition chaude** (*hot partition*, *hot shard*) : partition qui reçoit une charge disproportionnée.
- **Annuaire** (*directory*, *lookup table*) : table qui associe une clé à son emplacement.
- **Colocalisation** (*colocation*) : placement ensemble de données liées, pour des transactions et des jointures locales.

#### Relations de cause à effet

- La clé de partition n'apparaît pas dans les requêtes : chaque requête interroge toutes les partitions, et le partitionnement ne sert à rien.
- Le partitionnement est par tenant et un tenant devient énorme : sa partition sature alors que les autres restent vides.
- On répartit par `hachage modulo N` puis l'on ajoute un serveur : presque toutes les clés changent d'emplacement.
- L'unicité d'une valeur doit être globale mais la contrainte est locale à une partition : des doublons apparaissent.
- Le nombre de partitions est excessif : le temps de planification et la mémoire augmentent.

#### Idées reçues

- **« Partitionner, c'est répartir. »** Non. Le partitionnement découpe dans une base ; la répartition place sur plusieurs serveurs. Les deux se combinent.
- **« Une bonne clé répartit les données de façon égale. »** Elle doit répartir la **charge**, pas seulement le volume.
- **« On pourra changer de clé plus tard. »** Très difficilement : cela réorganise toutes les données.

#### Principe clé

La clé de partition suit la façon dont on interroge et dont la charge se répartit ; on prévoit dès le départ comment déplacer des données entre partitions sans interrompre le service.

#### Si vous ne retenez que trois choses

1. La clé de partition doit apparaître dans les requêtes et répartir la charge.
2. Le tenant est une clé naturelle, avec le risque du tenant chaud, qui se traite par un placement dédié.
3. Le rééquilibrage se prépare : annuaire, hachage cohérent, migration en ligne.

### 3. Explication technique détaillée

#### Le partitionnement dans la base

La documentation de PostgreSQL décrit le partitionnement déclaratif : trois méthodes (par plage, par liste, par hachage), des **bénéfices** (élagage des partitions par le planificateur, y compris à l'exécution ; suppression en bloc par détachement d'une partition, bien plus rapide qu'une suppression de lignes et sans nettoyage associé ; placement des anciennes partitions sur un stockage moins cher) et des **précautions** : le temps de planification et la mémoire augmentent avec le nombre de partitions ; une clé primaire ou une contrainte d'unicité doit inclure toutes les colonnes de la clé de partition ; on teste avec des charges simulées plutôt que de supposer.

```sql
CREATE TABLE audit_event (
  tenant_id    uuid        NOT NULL,
  occurred_at  timestamptz NOT NULL,
  id           uuid        NOT NULL,
  payload      jsonb       NOT NULL,
  PRIMARY KEY (tenant_id, occurred_at, id)
) PARTITION BY RANGE (occurred_at);

CREATE TABLE audit_event_2026_10 PARTITION OF audit_event
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE INDEX ON audit_event (tenant_id, occurred_at);
```

La clé de partition est la date : les requêtes d'audit portent presque toujours sur une période, et la conservation se gère en retirant des partitions entières ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers), [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)). La clé primaire inclut `occurred_at`, comme l'exige le partitionnement.

#### La répartition entre bases

Le tenant sert de clé : chaque tenant est assigné à une base ou à un groupe. Le parcours initial décrit l'annuaire qui dit où se trouve chacun (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) et [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)).

| Méthode de placement | Principe | Atouts | Limites |
|---|---|---|---|
| Modulo | `hash(tenant) mod N` | Simple, sans annuaire | Changer $N$ déplace presque tout |
| Hachage cohérent | Clés et serveurs sur un anneau, nœuds virtuels | Ajout ou retrait ne déplace qu'une fraction | Une répartition moins contrôlable |
| Annuaire | Table `tenant → shard` | Placement explicite, déplacement d'un tenant à la fois, tenants dédiés | Un composant à rendre rapide et fiable |
| Composite | Tenant puis hachage d'un identifiant | Découpe un très gros tenant | Les requêtes d'un tenant touchent plusieurs shards |

**Hachage cohérent.** D'après la description usuelle, les clés et les serveurs sont placés sur un cercle, chaque clé étant attribuée au serveur suivant dans le sens des aiguilles d'une montre ; ajouter ou retirer un serveur ne déplace que les clés situées entre lui et son voisin ; des nœuds virtuels (plusieurs points par serveur) lissent la charge. À l'inverse, avec un hachage modulo, changer le nombre de serveurs redistribue presque toutes les clés.

**Exemple chiffré.** Passer de 4 à 5 shards :

| Méthode | Part des clés déplacées |
|---|---|
| Modulo | environ 80 % (seulement 20 % gardent leur place) |
| Hachage cohérent | environ 20 % (les clés qui vont vers le nouveau serveur) |

Pour une plateforme multi-tenant, l'**annuaire** est souvent le meilleur choix : on déplace un tenant à la fois, on place les gros tenants sur des bases dédiées et l'on tient compte des contraintes (région, isolation).

```json
{
  "tenant_directory": [
    { "tenant": "ten_airline_01", "shard": "pool-eu-3", "region": "eu-west", "placement": "shared" },
    { "tenant": "ten_airline_77", "shard": "dedicated-eu-1", "region": "eu-west", "placement": "dedicated" }
  ],
  "rules": {
    "default_pool": "least_loaded_in_region",
    "dedicated_when": { "load_share_pct_over": 10, "or_contract": "dedicated_database" }
  }
}
```

#### Choisir la clé

| Critère | Question |
|---|---|
| Présence dans les requêtes | La clé figure-t-elle dans presque toutes les requêtes ? |
| Cardinalité | Y a-t-il assez de valeurs distinctes pour répartir ? |
| Uniformité de la charge | Une valeur peut-elle concentrer l'essentiel du trafic ? |
| Localité des transactions | Les données qui changent ensemble sont-elles ensemble ? |
| Croissance | La clé reste-t-elle bonne quand les volumes doublent ? |
| Contraintes | Les unicités globales restent-elles possibles ? |

Le tenant satisfait la plupart de ces critères pour des données propres au tenant. Il échoue sur la charge quand un tenant domine : la parade est de le placer à part, ou, si une table très volumineuse le justifie, de la partitionner à l'intérieur du tenant (par date, par identifiant).

#### Rééquilibrer

Déplacer un tenant d'un shard à un autre suit un schéma en ligne (voir [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant)) :

```text
1. choisir la cible, vérifier la capacité
2. copier les données du tenant vers la cible, en continu (réplication logique, copie par lots)
3. rattraper les changements survenus pendant la copie
4. contrôler : comptages, sommes de contrôle, échantillon
5. basculer : mise en lecture seule brève du tenant, dernier rattrapage, mise à jour de l'annuaire
6. surveiller, puis supprimer les données de la source après un délai
```

| Précaution | Raison |
|---|---|
| Débit de copie limité | Ne pas dégrader les autres tenants de la source |
| Lecture seule très courte | Garantir un état cohérent à la bascule |
| Annuaire à jour et caches courts | Les instances d'application suivent la bascule |
| Retour arrière possible | La source reste intacte jusqu'à validation |
| Un tenant à la fois | Borner le risque |

#### Contraintes et limites des données réparties

- **Transactions** : une transaction ne couvre qu'un shard ; les opérations entre tenants passent par des processus à compensation ([7.11 Saga](07-evenements-automatisation.md#711-saga)).
- **Unicité globale** : un nom de domaine ou une adresse électronique unique entre tenants exige un registre global.
- **Jointures** entre shards : à éviter, ou déléguer à l'entrepôt ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)).
- **Requêtes d'administration inter-tenants** : exécutées en parallèle sur tous les shards, avec agrégation ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
- **Identifiants** : uniques globalement, ou accompagnés du tenant ([27.5 Stratégie d'identifiants et numérotation sans trou](27-types-donnees-specialises.md#275-stratégie-didentifiants-et-numérotation-sans-trou)).

#### Modes de défaillance

- **Clé absente des requêtes** : partitionnement inutile.
- **Partition chaude.**
- **Modulo** et ajout de serveur.
- **Trop de partitions.**
- **Unicité globale oubliée.**
- **Rééquilibrage sans retour arrière.**
- **Annuaire en point unique de panne.**

**Contre-exemple.** Une plateforme répartit ses tenants par hachage modulo 8 sur 8 bases. Quand elle passe à 9 bases pour absorber la croissance, 89 % des tenants changent d'emplacement. La migration mobilise l'équipe pendant six semaines, avec des fenêtres de lecture seule en cascade. Un annuaire, ou un hachage cohérent, aurait déplacé environ un neuvième des tenants.

**Limites.** Le partitionnement et la répartition compliquent le modèle, l'exploitation et les requêtes transverses. On les introduit quand les limites de la base unique approchent, pas par anticipation. Et les réplicas ([22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication)) et le cache ([22.3 Mise en cache](#223-mise-en-cache)) retardent souvent ce besoin.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | Les modèles d'architecture, dont le partitionnement par tenant |
| [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant) | La migration de tenant est un rééquilibrage |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | La distribution des tailles guide la clé et le placement |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | Les cellules sont un partitionnement de toute la pile |
| [22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication) | Les réplicas retardent le besoin de répartition |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La conservation par détachement de partitions |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | La table d'audit est un cas typique de partitionnement par date |
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | L'entrepôt assure les jointures transverses |

### 5. Application pratique

**Situation initiale.** La table d'audit d'Alpha Air atteint 4 milliards de lignes. Les suppressions de rétention durent des heures et gonflent la base, et la maintenance de l'index prend des nuits.

**Problème.** Une table unique volumineuse, dont les requêtes portent sur des périodes.

**Application du concept.** L'équipe partitionne la table par mois, et prépare la répartition des tenants par annuaire.

**Déroulé.**

1. Elle choisit la date comme clé de partition, car les requêtes d'audit portent sur des périodes.
2. Elle crée des partitions mensuelles, avec un processus qui prépare les suivantes.
3. Elle migre les données existantes par lots, en dehors des heures de pointe.
4. La rétention de cinq ans devient le détachement de la partition la plus ancienne, puis sa suppression.
5. En parallèle, elle prépare l'annuaire de tenants pour placer les plus gros sur des bases dédiées.

**Résultat.** Les suppressions de rétention passent de plusieurs heures à quelques secondes, et les requêtes d'audit ne lisent que les partitions concernées.

**Limites.** Un nombre de partitions élevé alourdit la planification : l'équipe limite à 60 mois et archive le reste dans un stockage moins cher.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre partitionnement et répartition ?
2. **Compréhension.** Quels critères guident le choix d'une clé de partition ?
3. **Compréhension.** Pourquoi le hachage cohérent vaut-il mieux que le modulo quand le nombre de serveurs change ?
4. **Pourquoi.** Pourquoi une clé de partition qui équilibre le volume peut-elle quand même créer une partition chaude ?
5. **Raisonnement pratique.** Une répartition par modulo passe de 10 à 11 serveurs. Quelle part des clés change de serveur environ ?

#### Réponses

1. Le partitionnement découpe une table en morceaux, souvent dans la même base. La répartition place des morceaux ou des groupes de données sur des serveurs différents pour répartir aussi les écritures. Les deux se combinent.
2. Sa présence dans les requêtes, sa cardinalité, l'uniformité de la charge, la localité des transactions, sa tenue à la croissance et les contraintes d'unicité.
3. Parce que le hachage cohérent ne déplace que les clés voisines du serveur ajouté ou retiré, soit une fraction d'ordre $1/n$, alors que le modulo en redistribue presque toutes.
4. Parce que le volume ne dit pas la charge : un tenant peut avoir peu de données et un usage intense, ou l'inverse. La clé répartit les données, mais une valeur peut concentrer le trafic.
5. Une clé garde sa place si `h mod 10 = h mod 11`, soit environ 1/11 des cas : environ $10/11 \approx 91\ \%$ des clés changent de serveur.

## 22.6 Architecture cellulaire et rayon d'impact

### 1. Comprendre simplement

Une **architecture cellulaire** (*cell-based architecture*) divise la plateforme en plusieurs copies indépendantes et complètes, appelées **cellules**, qui se partagent les tenants : chaque cellule contient tout ce qu'il faut pour servir ses tenants et n'échange pas d'état avec les autres. Le **rayon d'impact** (*blast radius*) est l'étendue de ce qu'une défaillance ou un changement défectueux peut atteindre. Le but d'une architecture cellulaire est de le borner par construction.

**Pourquoi cela existe.** Avec une seule pile partagée par tous, chaque défaut est un incident général : une mauvaise version, une requête empoisonnée, un tenant qui sature une ressource. En divisant la plateforme en cellules, on transforme un incident total en incident partiel, de taille connue. Et on peut déployer, tester et migrer cellule par cellule.

**Problème résolu.** Limiter l'effet des pannes et des changements défectueux, et croître en ajoutant des cellules plutôt qu'en grossissant une pile unique.

**Modèle mental.** Les compartiments étanches d'un navire : si la coque est percée, un seul compartiment se remplit et le navire flotte.

**Où l'analogie s'arrête.** Les compartiments d'un navire sont fixes. Les cellules d'une plateforme se créent, se remplissent, se vident et se déplacent des tenants entre elles ; et certains composants (identité, facturation, annuaire) restent partagés et forment un point commun à ne pas négliger.

**Exemple.** Alpha Air héberge 800 tenants dans 20 cellules d'une quarantaine de tenants chacune. Une mauvaise version déployée sur la cellule 7 provoque des erreurs : 5 % des tenants sont touchés, les 95 % autres ne voient rien, et le déploiement s'arrête avant d'atteindre la cellule suivante. Un très gros client réglementé occupe seul sa cellule.

**Les composants.**

1. les **cellules** : instances complètes et indépendantes ;
2. la **clé de partition** : le tenant ;
3. le **routeur de cellules**, le plus mince possible ;
4. le **plan de contrôle** : création, retrait, migration de tenants ;
5. les **composants globaux** et leurs limites ;
6. la **politique de placement** ;
7. les **déploiements** cellule par cellule ;
8. la **supervision** par cellule.

**Objectif d'apprentissage :** vous pouvez décrire une architecture cellulaire, calculer un rayon d'impact, et dire ce qui reste global et pourquoi.

### 2. Connaissances essentielles

#### Définition

- **Architecture cellulaire** : organisation d'un service en plusieurs instances isolées et indépendantes de la charge de travail, chacune traitant un sous-ensemble des requêtes ou des tenants.
- **Cellule** : instance complète et autonome de la plateforme, qui ne partage pas d'état avec les autres cellules.
- **Rayon d'impact** : part des utilisateurs, des tenants ou des requêtes touchée par une défaillance ou un changement.

#### Idées fondamentales

1. **Une cellule est autonome.** Elle contient tout ce dont elle a besoin pour fonctionner.
2. **Les cellules ne partagent pas d'état.** Une panne reste dans la cellule.
3. **Le tenant est la clé.** Un tenant vit dans une seule cellule à la fois.
4. **Le routeur est mince.** Il fait une chose : envoyer vers la bonne cellule.
5. **Le rayon d'impact se calcule.** Il est de $1/N$ pour $N$ cellules de taille égale.
6. **On déploie cellule par cellule.** Un changement défectueux ne dépasse pas la première.
7. **Le global se limite.** Chaque composant partagé est un point commun de défaillance.

#### Vocabulaire essentiel

- **Routeur de cellules** (*cell router*) : composant qui oriente chaque requête vers sa cellule.
- **Plan de contrôle des cellules** (*cell control plane*) : fonctions d'administration (provision, migration) distinctes du service des requêtes.
- **Requête empoisonnée** (*poison pill request*) : requête qui provoque une défaillance à chaque traitement.
- **Isolation de défaut** (*fault isolation boundary*) : frontière qui limite la propagation d'une défaillance.
- **Placement** (*placement*) : choix de la cellule d'un tenant.
- **Évacuation** (*cell evacuation*) : déplacement des tenants d'une cellule défaillante vers d'autres.
- **Stabilité statique** (*static stability*) : capacité à continuer de fonctionner quand les composants de contrôle sont indisponibles.

#### Relations de cause à effet

- Une pile unique : une mauvaise version est un incident pour 100 % des tenants.
- Les cellules partagent une base ou une file : la panne de cette ressource touche toutes les cellules.
- Le routeur est complexe : il devient le premier point de défaillance, qui annule le bénéfice des cellules.
- Un gros tenant est mis avec d'autres dans une cellule : sa charge dégrade ses voisins.
- Les cellules sont trop petites : le surcoût fixe de chacune fait exploser le coût total.

#### Idées reçues

- **« Les cellules coûtent un multiple de l'infrastructure. »** Pas nécessairement : d'après le livre blanc consulté, une application de 30 hôtes peut garder 30 hôtes répartis en cellules, avec un routeur en plus.
- **« L'architecture cellulaire, c'est des microservices. »** Non. C'est la répétition de **toute** la pile, pas la décomposition en services.
- **« Plus il y a de cellules, mieux c'est. »** Non. Chaque cellule a un coût fixe et une charge d'exploitation.

#### Principe clé

On borne le rayon d'impact en répétant la plateforme en cellules indépendantes, avec un routeur mince et un plan de contrôle séparé, et l'on déploie, teste et migre cellule par cellule.

#### Si vous ne retenez que trois choses

1. Une cellule est une copie autonome de la plateforme pour un sous-ensemble de tenants.
2. Avec $N$ cellules égales, un incident touche environ $1/N$ des tenants ; le déploiement s'arrête à la première cellule touchée.
3. Les composants globaux (routeur, plan de contrôle, identité) sont des points communs à garder minces et très disponibles.

### 3. Explication technique détaillée

#### Le principe

Le livre blanc du cadre d'architecture d'un grand fournisseur d'infrastructure décrit l'architecture cellulaire par analogie avec les cloisons étanches d'un navire. La charge de travail est partitionnée par une **clé de partition** qui correspond au grain naturel du service, avec le moins d'interactions possible entre cellules (identifiant de client, de ressource). Une **couche de routage** répartit les requêtes entre cellules selon cette clé et présente un point d'entrée unique. Chaque cellule est indépendante, ne partage pas d'état avec les autres et traite un sous-ensemble des requêtes. Si une charge de travail utilise 10 cellules pour servir 100 requêtes, une défaillance dans l'une laisse 90 % des requêtes inaffectées. Beaucoup de défaillances courantes, comme un déploiement défectueux ou une requête empoisonnée, restent confinées dans la cellule.

Le motif de la **cloison étanche** (*bulkhead*) en est l'ancêtre : la documentation d'Azure précise que ce motif est aussi appelé architecture cellulaire, et qu'il consiste à isoler des éléments d'une application dans des groupes séparés, pour que la défaillance d'un élément ne gagne pas les autres.

```text
                                    ┌─► cellule A (tenants 1 à 40)      ─ application, base, files, index, cache
 requêtes ─► routeur de cellules ───┼─► cellule B (tenants 41 à 80)     ─ application, base, files, index, cache
 (par tenant)                       ├─► cellule C (gros tenant dédié)   ─ application, base, files, index, cache
                                    └─► cellule D …
                            ▲
          annuaire tenant → cellule     plan de contrôle : créer, retirer, migrer, déployer
```

#### Les trois composants

| Composant | Rôle | Exigence |
|---|---|---|
| Cellule | Charge complète et indépendante | Pas d'état partagé ; capacité bornée |
| Routeur | Oriente la requête vers la cellule du tenant | Le plus mince possible ; très disponible ; sans logique métier |
| Plan de contrôle | Provisionne, retire, déplace, déploie | Séparé du service ; sa panne ne coupe pas le service ([13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime)) |

Le routeur lit l'annuaire du tenant (voir [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage)), qu'il met en cache avec une durée courte. Si le plan de contrôle est indisponible, le routeur et les cellules continuent avec leur dernière configuration : c'est la **stabilité statique**. La page consultée sur la reprise après sinistre rappelle le même principe : les plans de données ont généralement des objectifs de disponibilité plus élevés que les plans de contrôle, et un basculement doit s'appuyer sur les premiers.

#### Rayon d'impact et taille des cellules

Avec $T$ tenants répartis uniformément entre $N$ cellules, une défaillance d'une cellule touche :

$$\text{rayon} = \frac{1}{N} \qquad \text{tenants touchés} = \frac{T}{N}$$

| Cellules $N$ | Part touchée | Tenants touchés (sur 800) | Surcoût fixe (1,5 unité par cellule, exemple) |
|---|---|---|---|
| 1 | 100 % | 800 | 1,5 |
| 5 | 20 % | 160 | 7,5 |
| 10 | 10 % | 80 | 15 |
| 20 | 5 % | 40 | 30 |

On choisit $N$ en comparant le rayon d'impact acceptable (lié aux objectifs de niveau de service, [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) et le surcoût fixe, sans oublier l'effort d'exploitation par cellule (déploiements, supervision, mises à jour). Les **gros tenants** sont isolés par une cellule dédiée : leur rayon est un seul tenant, et ils ne dégradent personne.

#### Le placement

```json
{
  "cells": [
    { "id": "cell-eu-1", "region": "eu-west", "tenants": 42, "capacity_units": 1000, "used_units": 640, "status": "active" },
    { "id": "cell-eu-2", "region": "eu-west", "tenants": 38, "capacity_units": 1000, "used_units": 590, "status": "active" },
    { "id": "cell-eu-dedicated-1", "region": "eu-west", "tenants": 1, "capacity_units": 400, "used_units": 310, "status": "active" }
  ],
  "placement": {
    "default": "least_loaded_in_region",
    "large_tenant_threshold_units": 100,
    "large_tenants": "dedicated_cell",
    "constraints": ["residency", "isolation_tier", "contract"],
    "headroom_pct": 30
  }
}
```

Le placement tient compte de la **région** (résidence des données, voir [22.7 Multi-région et routage par résidence des données](#227-multi-région-et-routage-par-résidence-des-données)), du **niveau d'isolation** acheté ([5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant)), de la **charge** (profils de [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)) et d'une **réserve** pour la croissance (ici 30 %). Un tenant qui grandit est déplacé vers une cellule plus grande ou dédiée (migration, [5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant)).

```typescript
interface Cell {
  id: string;
  region: string;
  usedUnits: number;
  capacityUnits: number;
  status: "active" | "draining";
}

function placeTenant(
  region: string,
  neededUnits: number,
  cells: Cell[],
  headroomPct: number,
): Cell | null {
  const eligible = cells
    .filter((c) => c.status === "active" && c.region === region)
    .filter((c) => c.usedUnits + neededUnits <= c.capacityUnits * (1 - headroomPct / 100))
    .sort((a, b) => a.usedUnits / a.capacityUnits - b.usedUnits / b.capacityUnits);
  return eligible.length > 0 ? eligible[0] : null;
}
```

Si aucune cellule n'est éligible, la plateforme **crée une cellule** (par code, voir [21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops)), plutôt que de dépasser la réserve.

#### Opérer par cellule

| Opération | Pratique |
|---|---|
| Déploiement | Une cellule à la fois, avec arrêt automatique ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) |
| Supervision | Métriques et alertes par cellule ; comparaison entre cellules |
| Incident | Isoler la cellule, évacuer ses tenants vers d'autres si nécessaire |
| Migration | Déplacer un tenant entre cellules ([5.10 Migration de tenant](05-multi-tenancy-modele-entreprise.md#510-migration-de-tenant)) |
| Exercices | Détruire volontairement une cellule en préproduction, mesurer la reprise |
| Versions | Suivre quelle cellule exécute quelle version ([5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)) |

#### Ce qui reste global

| Composant | Pourquoi global | Précaution |
|---|---|---|
| Annuaire de tenants et routeur | Il faut savoir où aller | Mince, répliqué, statiquement stable |
| Identité et authentification | Une personne se connecte avant de savoir sa cellule | Répartie, fortement disponible ([4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation)) |
| Facturation et métrage | Vue d'ensemble des consommations | Asynchrone, hors du chemin de requête |
| Plan de contrôle | Provisionner et déployer | Hors du chemin de requête |
| Unicités globales | Domaines, adresses | Registre global minimal |
| Administration inter-tenants | Voir l'ensemble ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) | Agrégats par cellule |

Chaque composant global est un **point commun de défaillance** : on le rend petit, redondant, testé, et l'on décrit ce qui se passe quand il est indisponible.

#### Modes de défaillance

- **État partagé caché** entre cellules (base commune, file commune, cache commun).
- **Routeur riche** : point unique de défaillance.
- **Cellules trop grandes** : rayon d'impact inchangé.
- **Cellules trop petites** : coût et exploitation.
- **Gros tenant mutualisé** : dégrade ses voisins.
- **Déploiement sur toutes les cellules à la fois.**
- **Dépendances globales non listées** : l'incident touche tout.

**Contre-exemple.** Une plateforme crée 12 cellules, mais toutes lisent leur configuration dans une même base centrale, « pour ne pas la dupliquer ». Une migration de cette base verrouille la table de configuration : les 12 cellules cessent de répondre en même temps. Les cellules ne partageaient pas d'état applicatif, mais leur démarrage et leur configuration dépendaient d'un composant commun.

**Limites.** L'architecture cellulaire demande une plateforme conçue pour être répliquée (création de cellules par code). Elle complique les requêtes transverses, l'analyse globale et les unicités. Et son bénéfice dépend de la rigueur avec laquelle on empêche l'état partagé de revenir.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | La multi-tenancy hybride introduit la cellule |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Le rayon d'impact fait partie de l'isolation |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les déploiements procèdent par cellules |
| [21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops) | Les cellules se créent par code |
| [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage) | L'annuaire et le placement des tenants |
| [22.7 Multi-région et routage par résidence des données](#227-multi-région-et-routage-par-résidence-des-données) | Les cellules appartiennent à une région |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | Tolérance aux pannes et redondance |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Le rayon acceptable se déduit des objectifs de service |
| [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime) | Plan de contrôle et plan de données |

### 5. Application pratique

**Situation initiale.** Alpha Air exploite une pile unique pour 800 tenants. L'an dernier, une migration défectueuse a rendu la plateforme indisponible pour tous les clients pendant 47 minutes.

**Problème.** Un rayon d'impact de 100 % pour tout défaut.

**Application du concept.** L'équipe adopte une architecture cellulaire.

**Déroulé.**

1. Elle crée une cellule type, décrite en code, et vingt exemplaires, de 40 tenants chacune.
2. Elle isole les trois plus gros tenants, chacun dans une cellule dédiée.
3. Un routeur mince oriente les requêtes selon l'annuaire ; le plan de contrôle est séparé.
4. Les déploiements passent cellule par cellule, avec arrêt automatique ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)).
5. Un exercice détruit une cellule en préproduction : les tenants sont évacués vers deux autres en 25 minutes.

**Résultat.** Le prochain défaut de migration touche une cellule (5 % des tenants) et est arrêté avant la suivante ; la durée d'indisponibilité pour les autres est nulle.

**Limites.** Le coût fixe des cellules augmente la facture d'infrastructure de 9 % ; la direction l'accepte au regard du risque évité (voir [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une cellule, et que partage-t-elle avec les autres ?
2. **Compréhension.** Quel est le rôle du routeur de cellules, et pourquoi doit-il être mince ?
3. **Compréhension.** Comment calcule-t-on le rayon d'impact ?
4. **Pourquoi.** Pourquoi isole-t-on un gros tenant dans une cellule dédiée ?
5. **Raisonnement pratique.** 900 tenants dans 15 cellules égales : combien de tenants touche la défaillance d'une cellule, et quelle part ?

#### Réponses

1. Une instance complète et autonome de la plateforme pour un sous-ensemble de tenants. Elle ne partage pas d'état avec les autres cellules ; les seuls points communs sont les composants globaux, volontairement minces.
2. Orienter chaque requête vers la cellule de son tenant, et rien d'autre. Il doit être mince parce qu'il est commun à toutes les cellules : plus il est complexe, plus il risque de défaillir pour tous.
3. Avec $N$ cellules de taille égale, une défaillance touche $1/N$ des tenants. Avec $T$ tenants, environ $T/N$.
4. Parce que sa charge pourrait dégrader ses voisins, et parce qu'un incident le concernant ne doit pas toucher d'autres tenants : son rayon d'impact se réduit à lui seul.
5. $900 / 15 = 60$ tenants, soit $1/15 \approx 6{,}7\ \%$.

## 22.7 Multi-région et routage par résidence des données

### 1. Comprendre simplement

Une plateforme **multi-région** (*multi-region*) s'exécute dans plusieurs régions géographiques d'un fournisseur d'infrastructure. On la déploie ainsi pour trois raisons distinctes : résister à la perte d'une région, servir des utilisateurs plus près d'eux, et respecter des obligations de localisation des données. Elle prend deux formes : **actif-passif** (*active-passive*), où une région sert et l'autre attend de prendre le relais, et **actif-actif** (*active-active*), où plusieurs régions servent du trafic en même temps. Le **routage par résidence des données** (*data residency routing*) envoie chaque requête vers la région où les données du tenant doivent rester.

**Pourquoi cela existe.** Une région entière peut devenir indisponible, rarement mais réellement. Un client situé loin de la région d'hébergement subit une latence que la physique empêche de réduire. Et des clients ou des réglementations exigent que leurs données restent dans une zone géographique donnée. Ces trois besoins appellent des réponses différentes, qu'il ne faut pas confondre.

**Problème résolu.** Choisir, pour chaque besoin, le niveau de redondance, de proximité et de localisation justifié par son coût.

**Modèle mental.** Un réseau d'agences d'une banque : chaque client a une agence de rattachement où se trouve son dossier ; une agence de repli, dans le même pays, peut le prendre en charge si la sienne ferme ; et un client en voyage est servi par un guichet local qui contacte son agence.

**Où l'analogie s'arrête.** Une agence de repli a un exemplaire papier du dossier. Les données d'une plateforme se copient en continu, avec un retard (voir [22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication)), et une écriture simultanée dans deux régions pose des problèmes de conflits que le papier ne connaît pas.

**Exemple.** Alpha Air est rattachée à la région `eu-west`, avec une région de reprise `eu-central`, toutes deux dans l'Union européenne. Ses requêtes, ses données, ses sauvegardes, son index de recherche et ses journaux restent dans ces deux régions. Si `eu-west` tombe, une procédure en un clic bascule ses tenants vers `eu-central`, après vérification du retard de réplication.

**Les composants.**

1. la **région d'attache** du tenant ;
2. la **région de reprise**, dans la même juridiction ;
3. l'**annuaire** et le **routage** par tenant ;
4. la **réplication** des données entre régions ;
5. la **stratégie de reprise** : sauvegarde, feu pilote, veille chaude, actif-actif ;
6. la **stratégie d'écriture** : globale, locale, partitionnée ;
7. la **procédure de bascule** et son automatisation ;
8. les **flux transfrontaliers** déclarés (support, administration).

**Objectif d'apprentissage :** vous pouvez distinguer les trois motifs du multi-région, comparer les stratégies de reprise, et décrire un routage par résidence des données.

### 2. Connaissances essentielles

#### Définition

- **Multi-région** : exécution d'une charge de travail dans plusieurs régions, pour la reprise, la proximité ou la localisation.
- **Actif-passif** : une région sert le trafic ; l'autre, passive, sert à la reprise et ne reçoit pas de trafic avant la bascule.
- **Actif-actif** : plusieurs régions servent le trafic en même temps.
- **Routage par résidence des données** : acheminement de chaque requête vers la région où les données du tenant doivent être traitées et stockées.

#### Idées fondamentales

1. **Trois besoins, trois réponses.** Reprise, latence et résidence ne se règlent pas par le même mécanisme.
2. **La résidence est une contrainte.** Elle s'applique aussi aux copies, aux sauvegardes et à la région de reprise.
3. **Le tenant a une région d'attache.** Ses écritures y vont, par défaut.
4. **L'actif-actif est le plus coûteux et le plus complexe.** Il ne se justifie que si le besoin l'exige.
5. **Une bascule se répète.** Une reprise jamais testée ne marche pas.
6. **On s'appuie sur le plan de données pour basculer.** Les plans de contrôle sont moins disponibles.
7. **Les flux transfrontaliers se déclarent.** Un accès de support depuis un autre pays est un transfert (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

#### Vocabulaire essentiel

- **Région** (*region*) : zone géographique d'un fournisseur d'infrastructure, composée de zones de disponibilité.
- **Objectif de temps de reprise** (*recovery time objective*, RTO) : durée maximale d'interruption acceptée (voir [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto)).
- **Objectif de point de reprise** (*recovery point objective*, RPO) : perte de données maximale acceptée.
- **Feu pilote** (*pilot light*) : données répliquées et infrastructure cœur prête mais éteinte.
- **Veille chaude** (*warm standby*) : copie réduite mais fonctionnelle, prête à servir.
- **Lecture locale** (*read local*) : les lectures sont servies par la région la plus proche.
- **Écriture globale, locale, partitionnée** (*write global*, *write local*, *write partitioned*) : trois façons de diriger les écritures.
- **Région d'attache** (*home region*) : région à laquelle un tenant est rattaché.

#### Relations de cause à effet

- La région de reprise est choisie sans considérer la juridiction : une bascule transfère les données hors de la zone autorisée.
- Le multi-région n'est testé qu'en théorie : à la première panne, la bascule échoue ou dure des heures.
- L'écriture est ouverte dans deux régions sans règle de conflit : des écritures concurrentes divergent.
- Le trafic de support est routé vers une équipe située hors de la zone : un transfert non déclaré.
- Tout est répliqué partout par précaution : coût doublé, résidence violée.

#### Idées reçues

- **« Multi-région, c'est actif-actif. »** Non. La plupart des plateformes se contentent d'une reprise en actif-passif.
- **« La résidence se règle par le choix de la région de stockage. »** Pas seulement : les sauvegardes, les index, les journaux, le support et l'analytique doivent suivre.
- **« Plus de régions, c'est plus de disponibilité. »** Pas si la plateforme garde une dépendance globale ou un plan de contrôle unique.

#### Principe clé

On choisit une stratégie multi-région pour chaque besoin (reprise, proximité, résidence), on rattache chaque tenant à une région et à une région de reprise de la même juridiction, et l'on teste la bascule.

#### Si vous ne retenez que trois choses

1. Reprise, latence et résidence sont trois besoins distincts avec des coûts différents.
2. Le tenant est rattaché à une région, et toutes ses copies restent dans la juridiction.
3. La bascule est automatisée et répétée, appuyée sur des opérations de plan de données.

### 3. Explication technique détaillée

#### Les stratégies de reprise

Le livre blanc d'un grand fournisseur sur la reprise après sinistre classe les approches en quatre familles, du moins coûteux et du plus simple au plus complexe :

| Stratégie | Principe | Reprise | Coût et complexité |
|---|---|---|---|
| Sauvegarde et restauration | Les données sont sauvegardées (et copiées dans une autre région) ; l'infrastructure se redéploie après le sinistre | Lente : il faut reconstruire | Le plus bas |
| Feu pilote | Les données sont répliquées en continu ; l'infrastructure cœur existe, les serveurs d'application sont éteints | Rapide après allumage et montée en charge | Faible |
| Veille chaude | Une copie réduite mais fonctionnelle tourne en permanence | Plus rapide : il suffit de monter en charge | Moyen |
| Multi-site actif-actif | La charge s'exécute en même temps dans plusieurs régions | Proche de zéro pour la plupart des sinistres | Le plus élevé |

Le même document distingue l'**actif-actif** (trafic servi par toutes les régions déployées) de la **veille à chaud en actif-passif** (une seule région sert, les autres sont dimensionnées pour reprendre toute la charge). Il note qu'une corruption de données se traite par les sauvegardes avec point dans le temps, quelle que soit la stratégie : la réplication continue copie aussi les erreurs.

| Besoin | Réponse | Remarque |
|---|---|---|
| Perte d'une zone de disponibilité | Redondance dans la région ([11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement)) | Premier niveau, peu coûteux |
| Perte d'une région | Sauvegarde ou feu pilote, veille chaude, actif-actif | Selon le RTO et le RPO ([11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto)) |
| Latence pour des utilisateurs distants | Lecture locale, périphérie, parfois écriture locale | Le coût de la distribution des écritures |
| Résidence | Placement et routage par région d'attache | Contrainte juridique, pas seulement technique |

#### Les écritures en multi-région

Le même livre blanc distingue trois façons de traiter les écritures dans un déploiement actif-actif, la lecture étant servie localement :

| Stratégie | Principe | Conséquence |
|---|---|---|
| Écriture globale | Toutes les écritures vont vers une seule région ; une autre est promue en cas de panne | Simple, cohérent ; latence d'écriture pour les régions éloignées |
| Écriture locale | Chaque région accepte les écritures ; réconciliation des conflits (par exemple « dernier écrivain gagne ») | Latence faible ; conflits à traiter |
| Écriture partitionnée | Les écritures sont attribuées à une région par une clé de partition (par exemple l'utilisateur) | Pas de conflit entre régions pour une même clé |

Pour une plateforme multi-tenant, l'**écriture partitionnée par tenant** est naturelle : chaque tenant a une région d'attache, où vont ses écritures. La plateforme est alors **active-active à l'échelle du parc** et **active-passive à l'échelle de chaque tenant** :

```text
Région A : tenants 1 à 400 (actifs)    ◄── réplication continue ──►   Région B : tenants 401 à 800 (actifs)
           copie passive des 401–800                                             copie passive des 1–400
```

Chaque région sert des tenants et sert de reprise aux tenants de l'autre. Le coût est celui de deux régions dimensionnées pour absorber, en bascule, la charge de l'autre (ou une veille plus économe, selon l'objectif).

#### Le routage par résidence

```json
{
  "tenant_region_policy": {
    "ten_airline_01": {
      "home_region": "eu-west",
      "recovery_region": "eu-central",
      "allowed_jurisdictions": ["EU"],
      "data_locations": ["primary_db", "replicas", "backups", "search_index", "object_storage", "logs", "analytics"],
      "failover": { "mode": "manual_one_button", "rto_target_minutes": 60, "rpo_target_seconds": 60 }
    }
  }
}
```

```typescript
interface RegionPolicy {
  homeRegion: string;
  recoveryRegion: string;
  failedOver: boolean;
}

function regionFor(
  tenantId: string,
  directory: Map<string, RegionPolicy>,
): string {
  const policy = directory.get(tenantId);
  if (policy === undefined) {
    throw new Error("tenant_unknown");
  }
  return policy.failedOver ? policy.recoveryRegion : policy.homeRegion;
}
```

Le routage tient en trois temps :

1. **Identifier le tenant** le plus tôt possible : nom de domaine, jeton, en-tête ([5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)).
2. **Consulter l'annuaire** : région d'attache et état de bascule.
3. **Acheminer** vers la région : par le nom de domaine, par un routeur périphérique, ou par une redirection.

**Ce que la résidence englobe.** Les copies principales et répliquées, les sauvegardes, les index ([19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)), le stockage de fichiers ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)), les caches ([22.3 Mise en cache](#223-mise-en-cache)), les journaux et la télémétrie ([11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces)), les entrepôts ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)), les fournisseurs tiers ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) et les **accès humains** (support, exploitation). Les composants globaux (annuaire, identité) ne portent que le minimum : l'identifiant du tenant et sa région, sans données personnelles inutiles.

#### Bascule

| Étape | Contenu | Remarque |
|---|---|---|
| Détecter | Sondes de santé, alertes, décision | Une fausse alarme a un coût |
| Décider | Automatique ou manuelle | Le livre blanc cité recommande la prudence pour l'automatique : une bascule inutile occasionne des pertes de disponibilité et de données |
| Vérifier | Retard de réplication, capacité de la région de reprise | Connaître le RPO réel |
| Basculer | Promouvoir les données, changer le routage | S'appuyer sur des opérations de plan de données |
| Valider | Parcours de fumée, surveillance | Avant d'ouvrir à tous |
| Revenir | Retour à la région d'attache | Planifié, pas improvisé |

La source citée recommande de ne s'appuyer, au moment de la bascule, que sur des opérations de plan de données, dont l'objectif de disponibilité est plus élevé que celui des plans de contrôle, et d'automatiser les étapes pour que le déclenchement manuel revienne à « appuyer sur un bouton ». Elle note aussi que le routage par noms de domaine souffre des effets de mise en cache, que d'autres mécanismes évitent.

#### Latence

La physique impose des délais entre régions éloignées : de l'ordre de plusieurs dizaines à plus d'une centaine de millisecondes pour un aller-retour intercontinental (valeur d'ordre de grandeur, non vérifiée ici). Une écriture synchronisée entre régions paie ce délai à chaque validation. On retient donc l'écriture dans la région d'attache, et la lecture locale pour les données qui tolèrent un retard (voir [22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication)).

#### Modes de défaillance

- **Région de reprise hors juridiction.**
- **Bascule jamais testée.**
- **Dépendance globale cachée** : annuaire, identité, plan de contrôle.
- **Écritures concurrentes sans règle.**
- **Résidence partielle** : sauvegardes ou journaux hors zone.
- **Bascule automatique sur fausse alarme.**
- **Retour oublié** : la région d'attache n'est jamais restaurée.

**Contre-exemple.** Une plateforme promet à ses clients européens que leurs données restent dans l'Union. Sa région de reprise est choisie sur un critère de coût : elle se trouve hors de l'Union. Lors d'un exercice de bascule, les données de tous les tenants passent en pleine production hors de la zone autorisée. Le contrat est rompu sans qu'aucune panne ne soit survenue.

**Limites.** Le multi-région double une grande part de l'exploitation et du coût. Il ne protège pas d'une erreur logicielle déployée partout (voir [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)), ni d'une corruption de données (voir [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)). Les exigences de résidence varient selon les juridictions et se confirment avec le service juridique (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant) | La résidence des données propres au tenant |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les transferts et les accès à distance |
| [11.8 Tolérance aux pannes, redondance et basculement](11-securite-fiabilite-operations.md#118-tolérance-aux-pannes-redondance-et-basculement) | La redondance dans la région précède la reprise entre régions |
| [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) | Les objectifs de point et de temps de reprise |
| [22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication) | La réplication entre régions a un retard |
| [22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage) | L'annuaire des tenants porte la région d'attache |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | Les cellules appartiennent à une région |
| [21.4 Infrastructure as code et GitOps](21-livraison-qualite-logicielle.md#214-infrastructure-as-code-et-gitops) | Les régions se décrivent en code |

### 5. Application pratique

**Situation initiale.** Alpha Air est hébergée dans une seule région. Un client réglementé exige que ses données restent dans l'Union et une reprise en moins d'une heure. Les clients d'Asie-Pacifique se plaignent de la latence.

**Problème.** Une région unique, aucune stratégie de reprise ni de résidence.

**Application du concept.** L'équipe distingue les trois besoins et choisit une réponse pour chacun.

**Déroulé.**

1. Résidence : chaque tenant reçoit une région d'attache et une région de reprise dans la même juridiction ; un annuaire et un routage par tenant l'appliquent.
2. Reprise : une veille chaude dans la région de reprise, avec réplication continue ; une bascule en un clic, répétée chaque trimestre.
3. Latence : un réseau de diffusion pour les contenus statiques et les miniatures ([18.6 Aperçus, miniatures et réseau de diffusion de contenu](18-fichiers-documents-contenus.md#186-aperçus-miniatures-et-réseau-de-diffusion-de-contenu)) ; les écritures restent dans la région d'attache.
4. Sauvegardes, index, journaux et analytique suivent la même juridiction.
5. Les accès de support depuis d'autres zones sont déclarés et limités.

**Résultat.** La reprise est testée à 38 minutes, avec une perte de données inférieure à 30 secondes, et les clients européens disposent d'une preuve de localisation.

**Limites.** Les clients d'Asie-Pacifique gardent une latence d'écriture élevée ; une cellule régionale sera étudiée si le volume le justifie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les trois besoins que le multi-région peut servir ?
2. **Compréhension.** Quelle différence y a-t-il entre actif-passif et actif-actif ?
3. **Compréhension.** Comment une plateforme multi-tenant peut-elle éviter les conflits d'écriture entre régions ?
4. **Pourquoi.** Pourquoi la région de reprise doit-elle appartenir à la même juridiction que la région d'attache ?
5. **Raisonnement pratique.** Une veille chaude coûte 60 % de la production et divise par trois le temps de reprise par rapport à un feu pilote. Quels éléments comparer pour choisir ?

#### Réponses

1. La reprise après la perte d'une région, la latence pour des utilisateurs éloignés, et la résidence des données.
2. En actif-passif, une région sert et l'autre attend pour reprendre ; en actif-actif, plusieurs régions servent du trafic en même temps.
3. En rattachant chaque tenant à une région d'attache où vont ses écritures (écriture partitionnée) : les écritures d'un tenant ne se produisent pas dans deux régions à la fois.
4. Parce qu'une bascule déplace réellement les données et le traitement : si la région de reprise est hors de la zone autorisée, la bascule viole la résidence promise.
5. Le coût annuel supplémentaire, le temps de reprise cible (RTO), la perte de données acceptable (RPO), la valeur de l'indisponibilité évitée (voir [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)) et la complexité d'exploitation. On choisit si le coût évité de l'indisponibilité dépasse le surcoût.

## 22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge

### 1. Comprendre simplement

Une **limite de concurrence par tenant** (*per-tenant concurrency limit*) plafonne le nombre d'opérations qu'un tenant peut avoir en cours en même temps. Une **file équitable** (*fair queuing*) sert à tour de rôle les tenants qui ont du travail en attente, au lieu de traiter les demandes dans l'ordre d'arrivée global. Une **classe de priorité** (*priority class*) distingue des familles de travail (interactif, intégration, lot, arrière-plan) servies avec des garanties différentes. Le **nivellement de charge par file** (*queue-based load leveling*) place une file d'attente entre ceux qui demandent et ceux qui traitent, pour absorber les pointes.

**Pourquoi cela existe.** Dans une plateforme partagée, rien n'empêche naturellement un tenant d'occuper tous les travailleurs : un import massif, une intégration emballée. Les autres attendent derrière lui. L'équité est un choix d'ingénierie : borner chaque tenant, intercaler les demandes, protéger l'interactif du lot, et lisser les pointes plutôt que de dimensionner pour elles.

**Problème résolu.** Garantir à chaque tenant une expérience proche de celle d'un système dédié, malgré un partage des ressources, et absorber les pointes sans les répercuter.

**Modèle mental.** Un guichet de poste avec plusieurs files. Chaque personne a droit à un guichet à la fois (limite), les files avancent à tour de rôle (équité), les urgences passent avant les colis volumineux (priorité) et un parc d'attente absorbe l'affluence du matin (nivellement).

**Où l'analogie s'arrête.** Dans un guichet, les personnes sont physiquement limitées. Un tenant peut engendrer des milliers de demandes en une seconde par ses intégrations : la limite doit être appliquée par la plateforme, de façon automatique, avec une réponse claire à celui qui la dépasse.

**Exemple.** Un tenant d'Alpha Air lance 10 000 tâches de génération de documents. Dix tâches d'un autre tenant arrivent ensuite. Avec une file unique, ces dix tâches attendent derrière les 10 000 : environ 200 secondes à 50 tâches par seconde. Avec une file équitable, elles sont servies en moins d'une seconde, par intercalation. Le premier tenant n'a pas plus de 4 générations en parallèle (limite de concurrence).

**Les composants.**

1. l'**admission** : limite de débit et de concurrence par tenant ;
2. les **files** par tenant et par classe ;
3. l'**ordonnanceur équitable** ;
4. les **classes de priorité** et leurs poids ;
5. le **vieillissement** : éviter la famine ;
6. la **file tampon** de nivellement ;
7. les **réponses de refus** : code, délai de reprise ;
8. la **mesure** : attente par tenant et par classe.

**Objectif d'apprentissage :** vous pouvez décrire un schéma d'admission, d'ordonnancement équitable et de priorités, et expliquer comment une file lisse les pointes sans les cacher.

### 2. Connaissances essentielles

#### Définition

- **Limite de concurrence par tenant** : nombre maximal d'opérations qu'un tenant peut avoir simultanément en cours de traitement.
- **File équitable** : discipline de service qui répartit la capacité entre les tenants en attente, par exemple à tour de rôle ou selon des poids.
- **Classe de priorité** : catégorie de travail à laquelle s'attachent des garanties de service et de capacité différentes.
- **Nivellement de charge par file** : usage d'une file d'attente comme tampon entre producteurs et consommateurs, pour lisser des charges irrégulières.

#### Idées fondamentales

1. **Chaque tenant a un plafond.** Il borne la part de ressources qu'il peut prendre.
2. **On sert à tour de rôle, pas dans l'ordre d'arrivée global.** Sinon le plus bruyant passe en premier.
3. **Le travail interactif passe avant le lot.** Mais le lot ne meurt pas de faim.
4. **Une file lisse, elle ne crée pas de capacité.** Si l'on produit plus vite qu'on ne consomme, la file grossit.
5. **Refuser est une réponse correcte.** Avec un code et un délai de reprise clairs.
6. **Concurrence et débit sont liés.** La loi de Little les relie (voir [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence)).
7. **L'équité se mesure.** Attente par tenant, par classe.

#### Vocabulaire essentiel

- **Cloison** (*bulkhead*) : isolation de ressources par groupe pour qu'une défaillance ou une surcharge ne se propage pas.
- **Seau à jetons** (*token bucket*) : mécanisme qui autorise un débit moyen avec des rafales bornées.
- **Délestage** (*load shedding*) : refus d'une partie des demandes pour protéger le système.
- **Tête de file** (*head-of-line blocking*) : blocage de demandes légères par une demande lourde placée devant.
- **Famine** (*starvation*) : travail jamais servi parce que d'autres passent toujours avant.
- **Vieillissement** (*aging*) : augmentation progressive de la priorité d'un travail qui attend.
- **Profondeur de file** (*queue depth*) : nombre d'éléments en attente.
- **Contre-pression** (*backpressure*) : signal renvoyé aux producteurs pour qu'ils ralentissent.

#### Relations de cause à effet

- Une file unique en ordre d'arrivée : un tenant qui dépose 10 000 tâches retarde tous les autres.
- Aucune limite de concurrence : un tenant occupe tous les travailleurs et les connexions à la base.
- Les lots tournent avec la même priorité que l'interactif : les écrans se figent pendant les traitements de nuit déplacés.
- La mise à l'échelle automatique n'est pas bornée : elle déplace la surcharge vers la base en aval.
- Aucun vieillissement : le travail de fond n'est jamais traité.

#### Idées reçues

- **« Une file d'attente règle la surcharge. »** Non. Elle la reporte. Si le débit moyen d'arrivée dépasse celui du traitement, la file grandit et la latence aussi.
- **« L'équité, c'est donner la même chose à chacun. »** Pas forcément : on peut pondérer par offre, par classe de travail, par engagement contractuel.
- **« Un refus est un échec. »** C'est une réponse maîtrisée : la documentation d'un grand fournisseur recommande de refuser les excédents d'un tenant (code 429) pour que les autres gardent des performances prévisibles.

#### Principe clé

On borne chaque tenant à l'entrée, on sert les tenants à tour de rôle par classe de priorité, on lisse les pointes par des files, et l'on refuse clairement ce qui dépasse.

#### Si vous ne retenez que trois choses

1. Chaque tenant a des plafonds de débit et de concurrence, et reçoit une réponse claire quand il les dépasse.
2. Les tenants et les classes sont servis de façon équitable, avec un vieillissement qui évite la famine.
3. Une file lisse les pointes, mais elle ne remplace ni les limites ni la capacité.

### 3. Explication technique détaillée

#### Admission : débit et concurrence

La documentation d'un grand fournisseur sur l'équité dans les systèmes multi-tenant décrit l'objectif : donner à chaque client une expérience proche de celle d'un système dédié. Elle recommande des **quotas par tenant** : l'excès d'un tenant est rejeté, pendant que les autres gardent des performances prévisibles ; les quotas peuvent être empilés pour permettre des rafales dans la capacité inutilisée, le trafic des tenants dans leurs limites ayant priorité ; une violation de quota renvoie le code 429, qui signale un problème côté client, et non une panne du serveur ; le seau à jetons autorise des rafales contrôlées, et l'on peut chaîner un seau à forte rafale et un seau à faible débit pour borner la rafale. Elle note que le délestage générique (rejet rapide de l'excédent) peut pénaliser tous les tenants quand l'un d'eux déborde, alors que les quotas par tenant rejettent uniquement l'excédent du fautif.

| Limite | Ce qu'elle borne | Exemple |
|---|---|---|
| Débit (requêtes par seconde) | Le flux d'arrivée ([10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)) | 100 par seconde, rafale de 300 |
| Concurrence (opérations en cours) | L'occupation simultanée des ressources | 50 requêtes en cours |
| Par type de tâche | Les traitements lourds | 2 imports, 4 générations de documents |
| Volume (quota) | Un stock ou un cumul ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation), [18.2 Versionnement de fichiers, quotas et niveaux de stockage](18-fichiers-documents-contenus.md#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) | Octets, lignes par mois |

La concurrence et le débit sont liés par la loi de Little ([22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence)) : avec 20 requêtes en cours et 500 ms de latence, le débit maximal est de 40 par seconde. Une limite de concurrence protège donc aussi contre une dépendance lente, qui allongerait la latence et occuperait les ressources.

```typescript
class TokenBucket {
  private tokens: number;
  private last: number;
  private readonly ratePerSec: number;
  private readonly burst: number;

  constructor(ratePerSec: number, burst: number, now: number = 0) {
    this.ratePerSec = ratePerSec;
    this.burst = burst;
    this.tokens = burst;
    this.last = now;
  }

  tryTake(now: number): boolean {
    const elapsedSec = (now - this.last) / 1000;
    this.tokens = Math.min(this.burst, this.tokens + elapsedSec * this.ratePerSec);
    this.last = now;
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}
```

Avec un débit de 10 par seconde et une rafale de 3, trois demandes simultanées passent, la quatrième est refusée, puis une demande passe tous les dixièmes de seconde.

#### La file équitable

Dans une file unique, une rafale d'un tenant retarde les autres : c'est le **blocage de tête de file**. Une file par tenant, servie à tour de rôle, supprime ce défaut.

```typescript
class FairQueue<T> {
  private queues = new Map<string, T[]>();
  private order: string[] = [];
  private cursor = 0;

  enqueue(tenantId: string, item: T): void {
    if (!this.queues.has(tenantId)) {
      this.queues.set(tenantId, []);
      this.order.push(tenantId);
    }
    this.queues.get(tenantId)!.push(item);
  }

  dequeue(): { tenantId: string; item: T } | null {
    for (let i = 0; i < this.order.length; i++) {
      const idx = (this.cursor + i) % this.order.length;
      const tenantId = this.order[idx];
      const queue = this.queues.get(tenantId)!;
      if (queue.length > 0) {
        this.cursor = (idx + 1) % this.order.length;
        return { tenantId, item: queue.shift()! };
      }
    }
    return null;
  }
}
```

Avec 5 tâches pour A et 2 pour B, l'ordre de service est : `a1 b1 a2 b2 a3 a4 a5`. B n'attend pas la fin de A.

| Discipline | Principe | Atout | Limite |
|---|---|---|---|
| Ordre d'arrivée | Une file, premier arrivé premier servi | Simple | Blocage de tête de file |
| Tour de rôle | Une file par tenant, service cyclique | Équitable | Ne tient pas compte des tailles ni des offres |
| Pondérée | Chaque tenant ou classe reçoit une part proportionnelle à un poids | Offres différenciées | Calibrage des poids |
| Par coût estimé | Service selon le coût prévu de la tâche | Évite qu'une tâche lourde monopolise | Estimation à fournir |

**Exemple chiffré.** Le tenant A dépose 10 000 tâches, B en dépose 10, avec un débit de 50 tâches par seconde. En ordre d'arrivée, B termine après environ $10\,000 / 50 = 200$ secondes. Avec un tour de rôle, ses 10 tâches sont intercalées avec les 10 premières de A : elles se terminent après environ $20 / 50 = 0{,}4$ seconde.

#### Les classes de priorité

| Classe | Exemples | Garantie visée | Poids (exemple) |
|---|---|---|---|
| Interactive | Écrans, API synchrones | Attente de l'ordre de la seconde | 8 |
| Intégration | Webhooks, synchronisations | Attente de quelques dizaines de secondes | 4 |
| Lot | Imports, exports, rapports, génération de documents | Attente de minutes à heures | 2 |
| Arrière-plan | Réindexation, nettoyage, recalculs | Quand la capacité le permet | 1 |

Deux précautions : **réserver** une part de capacité à l'interactif, pour qu'elle ne soit pas occupée par le lot, et **vieillir** le travail en attente, pour que les classes basses finissent par passer :

$$\text{priorité effective} = \text{poids de la classe} + \frac{\text{temps d'attente}}{\text{pas de vieillissement}}$$

#### Le nivellement par file

Le motif de nivellement de charge par file, tel que décrit dans le catalogue de motifs d'Azure, place une file entre la tâche qui demande et le service qui traite : la file sert de tampon, stocke les messages jusqu'à leur traitement, et le service les consomme à son rythme, même quand des tâches concurrentes produisent un volume élevé. Les bénéfices : maximiser la disponibilité (les retards du service n'affectent pas directement l'application), la scalabilité (le nombre de files et de consommateurs varie) et la maîtrise des coûts (on dimensionne pour la charge moyenne, pas pour la pointe). Les précautions : borner le débit global des consommateurs vers l'aval (la mise à l'échelle automatique sans borne ne fait que déplacer la surcharge), surveiller la profondeur de la file (si le débit moyen d'arrivée dépasse celui du traitement, la file et la latence croissent), exiger des files durables, rendre les consommateurs idempotents, router les messages irrécupérables vers une file de lettres mortes ([7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)), et ne pas supposer l'ordre d'origine préservé. Le motif ne convient pas quand l'appelant exige une réponse synchrone à faible latence.

```text
producteurs ─► admission (débit, concurrence par tenant) ─► files par classe et par tenant ─► ordonnanceur équitable ─► travailleurs (cloisonnés)
                    │ refus 429 + délai de reprise                                                 │
                    └─ travail asynchrone : accepté et mis en file                                 └─ surveillance : attente, profondeur
```

```json
{
  "admission": {
    "per_tenant": {
      "max_concurrent_requests": { "default": 50, "large": 200 },
      "rate_limit": { "requests_per_second": 100, "burst": 300 },
      "max_concurrent_jobs": { "import": 2, "export": 2, "report": 4, "document_generation": 4 }
    },
    "classes": [
      { "name": "interactive", "weight": 8, "reserved_capacity_pct": 40, "max_wait_seconds": 2 },
      { "name": "integration", "weight": 4, "max_wait_seconds": 30 },
      { "name": "batch", "weight": 2, "max_wait_seconds": 3600 },
      { "name": "background", "weight": 1, "max_wait_seconds": 86400 }
    ],
    "overflow": { "http_status": 429, "retry_after": true, "queue_if_async": true }
  }
}
```

**Cloisons.** Les travailleurs de chaque classe sont des **groupes séparés** : une saturation du lot ne consomme pas les ressources de l'interactif. Le motif de cloison d'Azure précise la granularité à décider : un tenant par partition, ou plusieurs tenants par partition, selon l'isolation voulue et le surcoût.

#### Que dire à celui qui dépasse

| Cas | Réponse | Pourquoi |
|---|---|---|
| Débit dépassé en synchrone | 429 avec délai de reprise | Le client sait qu'il doit ralentir |
| Travail asynchrone au-delà de la concurrence | Accepté, mis en file avec une estimation | Pas de perte, pas de blocage |
| Quota atteint | Erreur métier explicite ([12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)) | Pas une panne |
| File saturée | Refus ou délestage ciblé du tenant en cause | Protéger les autres |

#### Modes de défaillance

- **File unique** : blocage de tête de file.
- **Limites uniformes** : un petit et un grand tenant sont traités pareil.
- **Priorités sans réserve** : l'interactif manque de capacité.
- **Pas de vieillissement** : famine du lot.
- **Mise à l'échelle non bornée** : la surcharge se déplace vers la base.
- **Refus opaque** : pas de code ni de délai.
- **File sans supervision** : l'attente grandit sans alerte.

**Contre-exemple.** Une plateforme met toutes les tâches asynchrones dans une seule file, servie dans l'ordre. Un client déclenche, par une intégration, 40 000 générations de documents. Les confirmations d'envoi des autres clients, placées derrière, arrivent avec 90 minutes de retard. Aucun incident n'est déclaré : aucune file n'est « en panne ».

**Limites.** L'équité parfaite n'existe pas : les tâches ont des coûts différents et les estimations sont approximatives. Les plafonds se règlent à l'usage. Et une file qui grossit en permanence signale un manque de capacité, que l'équité ne guérit pas.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit est un des étages d'admission |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les quotas bornent les cumuls |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | Le tenant chaud est ce que l'équité contient |
| [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence) | Concurrence, débit et latence sont reliés par la loi de Little |
| [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | Les files d'attente sont l'outil du nivellement |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Idempotence, reprises et file de lettres mortes |
| [11.9 Dégradation progressive](11-securite-fiabilite-operations.md#119-dégradation-progressive) | La dégradation progressive utilise le délestage |
| [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) | La priorité du travail métier est une autre notion, voisine |

### 5. Application pratique

**Situation initiale.** Le lundi matin, un grand client d'Alpha Air déclenche 25 000 générations de certificats par intégration. Pendant 40 minutes, les autres clients ne reçoivent plus leurs notifications ni leurs documents.

**Problème.** Une file unique, aucune limite par tenant, aucune classe.

**Application du concept.** La plateforme introduit l'admission par tenant, des files équitables par classe et un nivellement.

**Déroulé.**

1. L'API refuse au-delà de 100 requêtes par seconde par tenant, avec 429 et un délai de reprise.
2. Les générations de documents ont une concurrence de 4 par tenant, et passent par une file équitable de la classe « lot ».
3. Les notifications et l'interactif ont leur classe, avec 40 % de capacité réservée.
4. Le lot vieillit : après 30 minutes d'attente, sa priorité effective rejoint celle de l'intégration.
5. Des alertes suivent l'attente au 95e centile par classe et par tenant.

**Résultat.** Le grand client termine ses 25 000 générations en 52 minutes, sans retarder les autres, dont les notifications restent à moins de 2 secondes.

**Limites.** Le client a vu ses générations s'étaler : il est informé par un indicateur d'avancement, et peut demander un plafond plus élevé, avec une offre adaptée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre limite de débit et limite de concurrence ?
2. **Compréhension.** Qu'est-ce que le blocage de tête de file, et comment une file équitable le supprime-t-elle ?
3. **Compréhension.** Pourquoi les classes de priorité ont-elles besoin d'un vieillissement ?
4. **Pourquoi.** Pourquoi une file ne règle-t-elle pas, à elle seule, un excès durable de charge ?
5. **Raisonnement pratique.** Un tenant a une limite de concurrence de 10 et des requêtes de 400 ms. Quel est son débit maximal ?

#### Réponses

1. La limite de débit borne le nombre de requêtes par unité de temps ; la limite de concurrence borne le nombre d'opérations en cours au même moment. Les deux sont liées par la loi de Little.
2. Dans une file unique, des demandes légères attendent derrière une rafale lourde d'un seul tenant. Une file par tenant, servie à tour de rôle, intercale les demandes : chaque tenant avance même si un autre en a déposé des milliers.
3. Parce que sans vieillissement, des classes de basse priorité peuvent ne jamais être servies tant que des classes plus hautes ont du travail : le vieillissement augmente progressivement leur priorité.
4. Parce qu'une file reporte la charge : si le débit moyen d'arrivée dépasse durablement celui du traitement, la file grossit sans fin et la latence aussi. Il faut des limites en amont et de la capacité.
5. $10 / 0{,}4 = 25$ requêtes par seconde.

## 22.9 Performance des requêtes sur schémas dynamiques

### 1. Comprendre simplement

Un **schéma dynamique** (*dynamic schema*) est un schéma que les administrateurs de tenants modifient à l'exécution : champs et objets personnalisés ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés), [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)). La **performance des requêtes sur schémas dynamiques** (*query performance on dynamic schemas*) est la capacité de la plateforme à répondre vite à des filtres, des tris et des agrégations sur des champs que ses ingénieurs n'ont pas connus à la conception, et dont le nombre et l'usage varient d'un tenant à l'autre.

**Pourquoi cela existe.** Dans une base classique, on indexe les colonnes que l'on sait interroger. Dans une plateforme configurable, un tenant ajoute un champ `classe_de_couple` et le filtre dès le lendemain, sur 12 millions de lignes. Sans stratégie, la requête balaie tout, le planificateur de la base ne sait pas estimer la sélectivité de valeurs rangées dans un document, et la plateforme devient lente dans les cas mêmes qui font sa valeur : la souplesse.

**Problème résolu.** Garder des requêtes rapides et prévisibles sur des champs définis par les clients, sans indexer l'infini ni figer le modèle.

**Modèle mental.** Un classeur dont chaque client peut ajouter ses propres rubriques. Pour retrouver vite un dossier par une rubrique, il faut une fiche d'index sur cette rubrique : on n'en fait que pour celles que l'on consulte réellement, sinon le classeur déborde de fiches.

**Où l'analogie s'arrête.** Une fiche d'index papier a un coût de rangement. Un index de base de données coûte aussi à chaque écriture, du stockage, et du temps de maintenance ; et des milliers de tenants multiplient les champs possibles.

**Exemple.** Le tenant d'Alpha Air ajoute un champ de nombre `torque_nm` sur les constats et filtre les valeurs supérieures à 80. Sans index, la requête lit 12 millions de lignes (environ 4 secondes). Avec un index d'expression ciblé, elle répond en 15 ms. La plateforme crée cet index à la demande, parce que le champ est déclaré « filtrable » et que le tenant n'a pas dépassé son nombre de champs indexés.

**Les composants.**

1. le **stockage** des valeurs personnalisées : colonnes, document, lignes ;
2. le **catalogue des champs** et leur déclaration « filtrable », « triable » ;
3. l'**indexation à la demande**, bornée par un quota ;
4. la **promotion** d'un champ en colonne dédiée ;
5. les **limites de requête** : filtres, tris, durées ;
6. l'**estimation du coût** avant exécution ;
7. la **mesure** par tenant et par champ ;
8. la **gouvernance** : nettoyage des index inutilisés.

**Objectif d'apprentissage :** vous pouvez comparer les modes de stockage d'un schéma dynamique, choisir quels champs indexer, et décrire comment l'on borne le coût d'une requête libre.

### 2. Connaissances essentielles

#### Définition

- **Schéma dynamique** : schéma modifiable à l'exécution par les utilisateurs de la plateforme, sans migration de code.
- **Performance des requêtes sur schéma dynamique** : temps de réponse, prévisibilité et coût de requêtes portant sur des champs définis à l'exécution.

#### Idées fondamentales

1. **On n'indexe que ce qui est interrogé.** Un index par champ possible n'est pas tenable.
2. **L'index se décide par champ et par tenant.** Un champ filtré par un tenant peut ne jamais l'être chez un autre.
3. **Un champ est déclaré avant d'être filtré.** Filtrable, triable, cherchable : chaque capacité a un coût.
4. **L'usage réel guide la promotion.** Un champ très utilisé devient une colonne.
5. **Une requête libre a un budget.** Durée, lignes lues, résultats.
6. **Le planificateur voit mal dans un document.** Une valeur rangée dans un document n'a pas de statistique propre.
7. **Le coût se mesure par tenant.** Pour agir, il faut savoir qui interroge quoi.

#### Vocabulaire essentiel

- **Entité-attribut-valeur** (*entity-attribute-value*, EAV) : stockage d'une ligne par valeur d'attribut.
- **Colonne document** (*document column*, `jsonb`) : colonne qui contient un document structuré indexable.
- **Index inversé généralisé** (*GIN index*) : index adapté aux valeurs composites, dont les documents.
- **Index d'expression** (*expression index*) : index sur le résultat d'une expression, par exemple une valeur extraite.
- **Index partiel** (*partial index*) : index limité aux lignes qui satisfont une condition.
- **Promotion** (*promotion*) : passage d'un champ personnalisé à une colonne dédiée (voir [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)).
- **Sélectivité** (*selectivity*) : part des lignes qu'un filtre retient.
- **Plan d'exécution** (*query plan*) : stratégie choisie par la base pour exécuter une requête.

#### Relations de cause à effet

- Un champ personnalisé est filtrable sans index : chaque filtre balaie toute la table, et le coût croît avec le volume.
- Tous les champs sont indexés : les écritures ralentissent, l'espace explose, la maintenance s'alourdit.
- Les valeurs sont dans un document opaque : le planificateur estime mal le nombre de lignes retenues et choisit un mauvais plan.
- Un tri sur un champ non indexé de plusieurs millions de lignes : une requête de plusieurs secondes sur une page de liste.
- Aucune limite de requête : un filtre composé de dix conditions sur des champs libres occupe la base.

#### Idées reçues

- **« JSON dans la base résout le problème. »** Il résout le stockage souple ; pas la performance. Il faut des index adaptés.
- **« Un index GIN couvre toutes les requêtes. »** Non. La documentation de PostgreSQL précise les opérateurs pris en charge par chaque classe d'opérateurs ; certains filtres ne l'utilisent pas.
- **« Il suffit d'indexer tous les champs filtrables. »** Pas sans limite : chaque index coûte à chaque écriture et en espace.

#### Principe clé

Pour un schéma dynamique, on stocke de façon souple, on indexe à la demande les champs réellement filtrés, dans une limite par tenant, on promeut ceux qui deviennent importants, et l'on borne le coût de toute requête libre.

#### Si vous ne retenez que trois choses

1. On n'indexe que les champs réellement filtrés ou triés, à la demande, dans un quota par tenant.
2. Un champ très utilisé se promeut en colonne dédiée.
3. Toute requête libre a un budget (durée, lignes), avec un refus ou un avertissement clair.

### 3. Explication technique détaillée

#### Les modes de stockage

| Mode | Principe | Atouts | Limites |
|---|---|---|---|
| Entité-attribut-valeur | Une ligne par valeur de champ | Souple, typage par colonne de valeur | Filtres multi-champs = auto-jointures ; pivots coûteux ; très volumineux |
| Colonne document | Un document par ligne dans une colonne (`jsonb`) | Souple, une ligne par entité, index GIN et d'expression | Statistiques moins précises ; mise à jour du document entier |
| Colonnes génériques | `c1`, `c2`… colonnes typées préconstruites | Index classiques, plans précis | Nombre limité ; lisibilité faible |
| Colonnes dédiées | Une colonne par champ promu | Performances optimales | Migration de schéma, par tenant ou globale |
| Hybride | Document pour le long tail, colonnes pour les champs promus | Équilibre | Deux chemins à gérer |

```sql
CREATE TABLE custom_value (
  tenant_id   uuid NOT NULL,
  entity_id   uuid NOT NULL,
  field_id    uuid NOT NULL,
  value_text  text,
  value_num   numeric,
  PRIMARY KEY (tenant_id, entity_id, field_id)
);
```

Filtrer sur deux champs personnalisés dans un modèle entité-attribut-valeur demande deux jointures sur cette table pour chaque entité : le coût croît avec le nombre de filtres. La colonne document évite cette multiplication, au prix d'index dédiés.

#### Indexer une colonne document

La documentation de PostgreSQL décrit, pour le type `jsonb`, deux classes d'opérateurs pour l'index GIN. La classe par défaut (`jsonb_ops`) prend en charge les opérateurs d'existence de clé (`?`, `?|`, `?&`), l'opérateur de contenance (`@>`) et les opérateurs de chemin JSON (`@?`, `@@`). La classe `jsonb_path_ops` ne prend pas en charge les opérateurs d'existence de clé, mais prend en charge la contenance et les opérateurs de chemin JSON ; son index est en général beaucoup plus petit et les recherches y sont en général plus rapides. La même page indique qu'un index d'expression ciblé (par exemple sur `jdoc -> 'tags'`) est probablement plus petit et plus rapide qu'un index sur tout le document, mais moins souple : l'index sur le document entier sert des requêtes sur n'importe quelle clé.

Pour une comparaison d'ordre (« supérieur à »), aucun de ces opérateurs ne convient : on crée un **index d'arbre sur une expression**. Selon la documentation sur les index d'expression, l'expression est calculée à chaque insertion et à chaque mise à jour de ce type, pas à chaque recherche ; ces index sont donc utiles quand la vitesse de lecture compte plus que celle de l'écriture.

```sql
-- Contenance sur tout le document personnalisé (petit index)
CREATE INDEX finding_custom_gin
  ON finding USING GIN (custom jsonb_path_ops);

SELECT id
  FROM finding
 WHERE tenant_id = $1
   AND custom @> '{"torque_class": "T3"}';

-- Comparaison numérique sur une clé précise : index d'expression, partiel
CREATE INDEX finding_torque_idx
  ON finding (tenant_id, ((custom ->> 'torque_nm')::numeric))
  WHERE (custom ->> 'torque_nm') IS NOT NULL;

SELECT id
  FROM finding
 WHERE tenant_id = $1
   AND (custom ->> 'torque_nm') IS NOT NULL
   AND (custom ->> 'torque_nm')::numeric > 80
 ORDER BY (custom ->> 'torque_nm')::numeric DESC
 LIMIT 50;
```

Le premier index sert les filtres de contenance (`@>`). Les comparaisons d'ordre ne figurent pas dans la liste des opérateurs d'un index GIN sur `jsonb` : elles demandent un index d'arbre sur une expression typée. Le second index est **partiel** (seulement les lignes qui ont la clé) et commence par le tenant, ce qui borne chaque recherche à un tenant. Trois règles se lisent dans cet exemple.

1. **Le prédicat se répète dans la requête.** La documentation sur les index partiels indique qu'un tel index n'est utilisé que si la condition de la requête implique son prédicat, et que, hors implications simples, le prédicat doit apparaître tel quel dans la condition. D'où la ligne `IS NOT NULL` répétée.
2. **Le prédicat ne contient pas de paramètre.** La même page précise que les clauses paramétrées ne conviennent pas à un prédicat d'index partiel. Ici, le paramètre `$1` porte sur la colonne `tenant_id`, qui est une colonne d'index, pas le prédicat.
3. **Le transtypage s'applique à chaque valeur.** Le transtypage `::numeric` échoue pour une valeur qui n'est pas numérique, et l'écriture échoue avec lui. La plateforme valide donc le type à l'écriture ([2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) avant de déclarer un champ filtrable.

Exemple d'ordre de grandeur : 12 millions de lignes, 4,2 secondes sans index, 15 millisecondes avec l'index d'expression (valeurs d'exemple, non mesurées sur une instance).

#### Décider quoi indexer

```json
{
  "custom_field": "torque_nm",
  "resource": "finding",
  "type": "number",
  "capabilities": { "filterable": true, "sortable": true, "searchable": false },
  "index": { "strategy": "on_demand", "state": "building", "type": "expression_btree" },
  "limits": { "max_indexed_fields_per_resource_type": 10, "max_filters_per_query": 5 }
}
```

| Capacité déclarée | Coût | Décision |
|---|---|---|
| Affichable seulement | Aucun | Par défaut |
| Filtrable | Un index par champ | À la demande, dans un quota par type de ressource |
| Triable | Un index adapté, plus un tri | À la demande, avec limite de page |
| Cherchable en texte | Alimentation de l'index de recherche ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé)) | Seulement si utile |

**Indexation à la demande.** Quand un champ est déclaré filtrable, la plateforme crée l'index en arrière-plan, sans bloquer les écritures (voir [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) pour la création concurrente), et le déclare disponible quand il est valide. Tant qu'il ne l'est pas, les filtres sur ce champ sont refusés ou limités à un périmètre réduit.

**Quota.** Un nombre maximal de champs indexés par type de ressource et par tenant : au-delà, il faut retirer un index ou demander une promotion. Cela empêche l'explosion des index.

#### Promouvoir

L'usage réel guide la promotion : un champ qui devient central (utilisé dans 40 % des requêtes, ou dans des tris fréquents) passe dans une colonne dédiée, avec un type propre et des statistiques précises (voir [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique)).

```sql
SELECT custom_field,
       count(*)                          AS queries_30d,
       percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95_ms,
       count(DISTINCT tenant_id)         AS tenants
  FROM query_log
 WHERE occurred_at >= now() - interval '30 days'
   AND custom_field IS NOT NULL
 GROUP BY custom_field
 ORDER BY queries_30d DESC
 LIMIT 20;
```

La requête classe les champs personnalisés par usage et par lenteur : elle alimente les décisions de promotion et de nettoyage.

#### Borner une requête libre

| Garde-fou | Mesure |
|---|---|
| Nombre de filtres | Maximum de 5 conditions sur champs personnalisés |
| Champs non indexés | Refusés sur les gros volumes, ou limités par un périmètre (date, état) |
| Tris | Seulement sur des champs triables ; limite de page |
| Durée | Délai d'attente par requête ; annulation côté serveur |
| Lignes lues | Estimation avant exécution ; refus si le coût dépasse le budget |
| Pagination | Par curseur ([10.7 Pagination et filtrage](10-api-integrations-extensibilite.md#107-pagination-et-filtrage)) |
| Équité | La requête compte dans les limites par tenant ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |

La liste de l'interface ne propose en tri que les colonnes indexées, ou l'indique (voir [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues)).

#### Statistiques et plan

Le planificateur de la base choisit un plan à partir de statistiques sur les colonnes. Une valeur rangée à l'intérieur d'un document n'a pas de statistique propre : ses estimations de sélectivité y sont grossières, et il peut choisir un balayage ou une jointure inadaptés (constat usuel, non confronté à la documentation consultée). La documentation de `ALTER INDEX` indique que l'on peut régler la cible de statistiques d'une colonne d'index définie par une expression : l'analyse collecte donc des statistiques sur l'expression indexée. Les parades : index d'expression, colonnes promues, requêtes simplifiées, et vérification des plans (`EXPLAIN`) pour les requêtes fréquentes.

#### Modes de défaillance

- **Champ filtrable sans index** sur une grande table.
- **Index pour chaque champ** : écritures lentes.
- **Tri libre sur un gros volume.**
- **Index jamais retirés** : coût sans usage.
- **Statistiques ignorées** : mauvais plans.
- **Requête sans limite de durée.**
- **Promotion tardive** : un champ central reste dans le document.

**Contre-exemple.** Une plateforme permet à tout champ personnalisé d'être trié dans les listes. Un tenant trie 8 millions de lignes sur un champ texte non indexé. La requête dure 40 secondes, occupe un processeur de la base et dégrade les autres tenants du même groupe. Un refus ou un avertissement à la déclaration du champ « triable », avec indexation à la demande, aurait évité cette surprise.

**Limites.** L'indexation à la demande ajoute des opérations de fond et des états transitoires. Les limites déçoivent parfois : il faut les expliquer (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)). Et la promotion de champ est une migration, avec ses risques (voir [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés) | Les champs personnalisés posent ce problème |
| [2.17 Schéma dynamique](02-donnees-ressources.md#217-schéma-dynamique) | Le schéma dynamique et la promotion de champs |
| [2.14 Index](02-donnees-ressources.md#214-index) | Les index de base de données |
| [12.6 Tables, filtres, recherche et vues](12-produit-ux.md#126-tables-filtres-recherche-et-vues) | Les listes, filtres et tris côté utilisateur |
| [22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence) | Ces requêtes consomment la plus grande part du budget de latence |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les requêtes libres comptent dans les limites par tenant |
| [19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé) | Le texte libre se cherche par l'index de recherche |
| [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Création d'index concurrente et migrations |

### 5. Application pratique

**Situation initiale.** Les tenants d'Alpha Air ont créé 1 400 champs personnalisés sur les constats. Les listes filtrées sur ces champs prennent de 3 à 40 secondes sur les grands tenants, et un tri a saturé la base le mois dernier.

**Problème.** Aucune stratégie d'index ni de limite pour les champs personnalisés.

**Application du concept.** La plateforme introduit des capacités déclarées, l'indexation à la demande, la promotion et des garde-fous.

**Déroulé.**

1. Les champs deviennent « affichables » par défaut ; « filtrable » et « triable » se déclarent.
2. Une déclaration crée un index d'expression en arrière-plan, dans un quota de 10 champs indexés par type de ressource.
3. L'analyse du journal des requêtes révèle 6 champs qui concentrent 70 % des filtres : ils sont promus en colonnes dédiées.
4. Les requêtes sont bornées : 5 filtres maximum, délai de 10 secondes, estimation de coût avant exécution.
5. Un nettoyage mensuel retire les index jamais utilisés depuis 90 jours.

**Résultat.** Le p95 des listes filtrées passe de 11 secondes à 180 ms ; la taille totale des index baisse de 35 %.

**Limites.** Un tenant qui a besoin de plus de 10 champs filtrés doit choisir ou passer à une offre avec un pool dédié.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi ne peut-on pas indexer tous les champs personnalisés d'une plateforme ?
2. **Compréhension.** Quels sont les principaux modes de stockage d'un schéma dynamique ?
3. **Compréhension.** Quand promeut-on un champ en colonne dédiée ?
4. **Pourquoi.** Pourquoi une requête libre a-t-elle besoin d'un budget ?
5. **Raisonnement pratique.** Un champ numérique doit être filtré par « supérieur à ». Pourquoi un index GIN sur le document ne suffit-il pas, et que créer ?

#### Réponses

1. Parce que chaque index coûte à chaque écriture, en espace et en maintenance, et que le nombre de champs possibles, multiplié par le nombre de tenants, est trop grand : on indexe à la demande ceux qui sont réellement filtrés.
2. L'entité-attribut-valeur, la colonne document, les colonnes génériques, les colonnes dédiées, et l'hybride (document plus colonnes promues).
3. Quand son usage justifie une performance maximale : fréquence élevée de filtres et de tris, nombre important de tenants, lenteurs mesurées.
4. Parce qu'un filtre arbitraire sur des champs non maîtrisés peut occuper la base et dégrader les autres : durée, lignes lues et nombre de filtres sont bornés.
5. Parce que les opérateurs pris en charge par un index GIN sur `jsonb` sont l'existence de clé, la contenance et les chemins JSON, pas les comparaisons d'ordre. On crée un index d'arbre sur l'expression qui extrait et convertit la valeur numérique, de préférence partiel et préfixé par le tenant.

## 22.10 Modèle de coûts, attribution et coût de service

### 1. Comprendre simplement

Un **modèle de coûts** (*cost model*) décrit ce que coûte la plateforme : ses postes de dépense, leur comportement (fixe ou variable) et ce qui les fait varier. L'**attribution des coûts** (*cost attribution*) répartit ces dépenses entre les tenants. Le **coût de service** (*cost to serve*) est le total des coûts engagés pour servir un tenant donné sur une période.

**Pourquoi cela existe.** La facture d'infrastructure arrive en un seul total. Sans modèle, on ne peut dire ni quel tenant coûte quoi, ni si une offre est rentable, ni quel effet aura un tenant de plus. Dans une plateforme partagée, les ressources sont mutualisées par construction (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant)) : un coût ne porte pas, de lui-même, l'étiquette d'un tenant.

**Problème résolu.** Passer d'un total global à une estimation du coût par tenant, assez fiable pour décider (offres, limites, prix, priorités), sans bâtir une comptabilité analytique démesurée.

**Modèle mental.** Un immeuble en copropriété. Certaines charges se mesurent par lot : l'eau, avec un compteur individuel. D'autres sont communes : l'ascenseur, le gardien. Elles se répartissent selon une clé convenue. Ce que paie chaque lot est la somme des deux.

**Où l'analogie s'arrête.** Dans un immeuble, la clé de répartition est fixée par un règlement et change rarement. Dans une plateforme, la consommation des ressources partagées varie d'un mois à l'autre, les clés se choisissent et se révisent, et une mauvaise clé fausse les décisions de prix et de produit.

**Exemple.** En un mois, Alpha Air (`ten_airline_01`) utilise 12 % du temps de calcul partagé. Ce poste coûte 48 000 € ce mois-là : sa part est de 5 760 €. S'y ajoutent 1 200 € de stockage mesuré, 800 € de support et 1 000 € de coûts communs répartis à parts égales. Le coût de service est de 8 760 €. Le revenu du tenant est de 14 000 € : la marge est de 5 240 €, soit 37,4 %.

**Les composants.**

1. le **catalogue des postes de coûts** ;
2. le **comportement** de chaque poste : fixe, variable ou par paliers ;
3. les **moteurs de coût** (*cost drivers*) : ce qui fait varier un poste ;
4. les **mesures d'usage** par tenant ;
5. les **clés de répartition** des postes partagés ;
6. l'**attribution** périodique ;
7. le **coût de service** par tenant et par segment ;
8. le **rapprochement** avec la facture réelle.

**Objectif d'apprentissage :** vous pouvez décrire un modèle de coûts, choisir une clé de répartition pour un poste partagé et calculer le coût de service d'un tenant.

### 2. Connaissances essentielles

#### Définition

- **Modèle de coûts** : description structurée des postes de dépense d'une plateforme et des facteurs qui les font varier.
- **Attribution des coûts** : affectation du coût de chaque poste aux tenants, directement ou par une clé de répartition.
- **Coût de service** : somme des coûts attribués à un tenant sur une période, pour le servir.

#### Idées fondamentales

1. **Un coût a un comportement.** Il est fixe, variable (il suit l'usage) ou par paliers (il saute à chaque seuil de capacité).
2. **Un coût a un moteur.** On le rattache à une grandeur mesurable : secondes de calcul, gigaoctets, messages envoyés.
3. **Direct ou partagé.** Un coût direct se rattache à un tenant par une mesure ou une étiquette. Un coût partagé se répartit par une clé.
4. **La précision se règle sur la décision.** Estimer le coût des marchandises vendues, facturer à l'usage, repérer les tenants atypiques et réduire la facture globale n'exigent pas la même précision.
5. **L'attribution n'est jamais complète.** Une part reste non attribuée : on la montre au lieu de la cacher.
6. **La mesure de l'usage a son pipeline.** La télémétrie échantillonnée ne remplace pas une mesure conçue pour compter.
7. **Les clés se révisent.** Elles dépendent de la structure de la plateforme et de l'usage.

#### Vocabulaire essentiel

- **Poste de coûts** (*cost item*) : ligne de dépense homogène, par exemple le calcul, la base de données, le stockage d'objets, un fournisseur de courriel, le support.
- **Moteur de coût** (*cost driver*) : grandeur qui fait varier un poste.
- **Coût direct** (*direct cost*) : coût que l'on peut rattacher à un tenant précis.
- **Coût partagé** (*shared cost*) : coût commun à plusieurs tenants, à répartir.
- **Clé de répartition** (*allocation key*) : règle qui divise un coût partagé entre tenants.
- **Mesure indirecte** (*proxy metric*) : grandeur facile à mesurer qui remplace une grandeur difficile à mesurer.
- **Étiquette** (*tag*) : couple clé-valeur posé sur une ressource d'infrastructure, utilisé pour regrouper les coûts.
- **Montrer les coûts** (*showback*) : rendre visibles les coûts attribués à un groupe interne, sans les imputer à son budget.
- **Imputer les coûts** (*chargeback*) : porter les coûts attribués au budget du groupe qui les engendre.
- **Marge brute** (*gross margin*) : revenu moins coût de service, rapporté au revenu.

#### Relations de cause à effet

- On divise la facture par le nombre de tenants : les petits tenants paraissent aussi coûteux que les gros, et la tarification s'appuie sur une fiction.
- La clé de répartition ne suit pas le moteur du coût, par exemple une répartition par nombre d'utilisateurs d'un coût qui suit le stockage : les décisions de prix reposent sur des chiffres faux.
- La télémétrie échantillonnée sert de base de facturation : les totaux sont sous-estimés ou instables.
- Les coûts partagés ne sont pas attribués : la marge par tenant est surestimée et le total ne se réconcilie pas avec la facture.
- On vise la précision au centime : le processus devient fragile, et son entretien coûte plus que ce qu'il apporte.

#### Idées reçues

- **« Le coût de service, c'est la facture divisée par le nombre de tenants. »** Non : la moyenne cache la distribution des tailles (voir [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)).
- **« Il faut tout mesurer exactement. »** Non : la précision dépend de l'objectif. L'article d'architecture consulté déconseille la précision excessive et la mesure en temps réel.
- **« Les étiquettes d'infrastructure suffisent. »** Non : une ressource partagée ne porte pas d'étiquette de tenant, et le nombre d'étiquettes par ressource est limité. Il faut des mesures d'usage venant de l'application.

#### Principe clé

On cherche une attribution assez fiable pour décider : on classe les postes, on mesure l'usage par tenant, on choisit une clé pour chaque poste partagé et l'on rapproche le total de la facture.

#### Si vous ne retenez que trois choses

1. Un coût se décrit par son comportement et son moteur, et se rattache à un tenant directement ou par une clé de répartition.
2. La précision se règle sur la décision à prendre ; la mesure de l'usage vient de l'application, pas de la télémétrie échantillonnée.
3. Une moyenne par tenant trompe : le coût de service se calcule par tenant et se lit par segment.

### 3. Explication technique détaillée

#### Le catalogue des postes

Un modèle de coûts commence par une liste de postes. Pour chacun : le comportement, le moteur, la nature (directe ou partagée) et la source de la mesure.

| Poste | Comportement | Moteur de coût | Nature | Mesure |
|---|---|---|---|---|
| Calcul des services applicatifs | Variable, par paliers de capacité | Secondes de calcul | Partagé | Journaux d'usage par tenant |
| Base de données | Par paliers | Gigaoctets stockés, opérations | Partagé, ou direct si le pool est dédié | Volume par tenant, requêtes étiquetées |
| Stockage d'objets | Variable | Gigaoctets stockés, requêtes | Direct | Compteurs par tenant ([18.2 Versionnement de fichiers, quotas et niveaux de stockage](18-fichiers-documents-contenus.md#182-versionnement-de-fichiers-quotas-et-niveaux-de-stockage)) |
| Transfert de données sortant | Variable | Gigaoctets sortants | Direct | Journaux d'accès |
| Services tiers à l'usage | Variable | Messages, minutes, jetons | Direct | Compteurs par tenant ([17.4 Adaptateurs de canal et statut de livraison](17-collaboration-communication-travail.md#174-adaptateurs-de-canal-et-statut-de-livraison)) |
| Observabilité | Variable ou fixe | Volume de journaux | Partagé | Volume par tenant, si étiqueté ([11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces)) |
| Support | Variable | Minutes de traitement | Direct | Saisie du temps |
| Outillage, sécurité, environnements d'essai | Fixe | Aucun | Partagé | Facture |
| Marge de capacité | Fixe | Aucun | Partagé | Plan de capacité ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)) |

```json
{
  "cost_model": {
    "period": "month",
    "currency": "EUR",
    "items": [
      { "id": "compute_shared", "kind": "shared", "behavior": "step", "driver": "cpu_seconds", "allocation": "proportional" },
      { "id": "database_shared", "kind": "shared", "behavior": "step", "driver": "stored_gb", "allocation": "proportional" },
      { "id": "object_storage", "kind": "direct", "behavior": "variable", "driver": "stored_gb", "allocation": "measured" },
      { "id": "email_provider", "kind": "direct", "behavior": "variable", "driver": "messages_sent", "allocation": "measured" },
      { "id": "support_staff", "kind": "direct", "behavior": "variable", "driver": "support_minutes", "allocation": "measured" },
      { "id": "observability", "kind": "shared", "behavior": "fixed", "driver": null, "allocation": "equal_share" },
      { "id": "security_tooling", "kind": "shared", "behavior": "fixed", "driver": null, "allocation": "equal_share" }
    ],
    "unallocated_warning_pct": 10
  }
}
```

Le modèle est une donnée versionnée ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) : on sait avec quel modèle un rapport a été calculé, et l'on peut rejouer un mois ancien.

#### Direct, partagé et étiqueté

L'article d'architecture du fournisseur cloud consulté décrit trois pratiques complémentaires.

1. **Étiqueter les ressources.** Une ressource dédiée à un tenant porte une étiquette de tenant. Une ressource partagée porte une étiquette de **groupe** : cellule, base ou ensemble de tenants. L'article précise que le nombre d'étiquettes par ressource est limité : on ne pose donc pas une étiquette par tenant sur une ressource partagée. Le coût d'une ressource partagée se divise ensuite entre les tenants du groupe, d'après une correspondance conservée à part, comme l'annuaire des tenants ([22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage)).
2. **Instrumenter l'application.** Quand une ressource n'a pas de lien direct avec un tenant, l'application compte l'usage : requêtes d'API par tenant, périodes de pointe, différences de profil. L'article précise que les outils de supervision échantillonnent les données et ne conviennent ni à une mesure précise ni à la facturation. Pour cela, on construit un pipeline de journalisation et d'agrégation dédié.
3. **Utiliser les règles d'allocation de l'outil de gestion des coûts.** L'outil décrit dans l'article répartit des coûts partagés en parts égales, en pourcentages personnalisés ou au prorata de coûts cibles. Selon la page consultée, il ne prend pas en charge certains types de comptes ni les achats de réservations.

#### Les clés de répartition

| Clé | Principe | Atout | Limite | Exemple |
|---|---|---|---|---|
| Mesure directe | Le coût se rattache au tenant | Précise | Seulement pour les ressources dédiées | Pool ou cellule dédiés ([22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact)) |
| Prorata d'un usage mesuré | Part = usage du tenant ÷ usage total | Suit la consommation | Exige une mesure fiable | Secondes de calcul |
| Mesure indirecte | Une grandeur facile remplace une grandeur difficile | Simple | Approximation | Gigaoctets stockés pour répartir le coût de la base |
| Part égale | Chaque tenant porte la même part | Simple, stable | Injuste aux extrêmes | Outillage commun |
| Pourcentages convenus | Parts fixées par décision | Prévisible | Se détache de l'usage | Plateforme interne |
| Par groupe | Coût d'un groupe réparti entre ses tenants | Pas d'étiquette par tenant | Approximation dans le groupe | Cellule partagée |

La page consultée du cadre FinOps distingue de même l'allocation fixe, proportionnelle et par mesure indirecte, et note que la plupart des organisations mélangent plusieurs approches. Elle décrit aussi une approche d'« ignorance informée », où un budget central absorbe les coûts partagés au lieu de les allouer ; on la tolère au début, puis on en sort.

```sql
-- Répartition d'un poste partagé au prorata d'une mesure d'usage
WITH tenant_usage AS (
  SELECT tenant_id,
         sum(quantity) AS qty
    FROM usage_event
   WHERE metric = $1
     AND occurred_at >= $2
     AND occurred_at <  $3
   GROUP BY tenant_id
), usage_total AS (
  SELECT sum(qty) AS qty
    FROM tenant_usage
)
SELECT u.tenant_id,
       u.qty,
       round($4::numeric * u.qty / t.qty, 2) AS allocated_cost
  FROM tenant_usage u
 CROSS JOIN usage_total t
 ORDER BY allocated_cost DESC;
```

Les paramètres sont : `$1` la mesure (par exemple `cpu_seconds`), `$2` et `$3` la période, `$4` le coût du poste pour la période. Les parts arrondies à deux décimales peuvent différer du total de quelques centimes : on garde cet écart dans une ligne « arrondis », ou on l'attribue à la plus grande part (voir [27.4 Monnaie et arrondis](27-types-donnees-specialises.md#274-monnaie-et-arrondis)).

#### Le calcul du coût de service

$$\text{CS}_t = \sum_{i \in D} c_{i,t} + \sum_{j \in P} C_j \times \frac{u_{j,t}}{\sum_k u_{j,k}}$$

où $\text{CS}_t$ est le coût de service du tenant $t$ ; $D$ l'ensemble des postes directs et $c_{i,t}$ le coût du poste direct $i$ pour le tenant $t$ ; $P$ l'ensemble des postes partagés, $C_j$ le coût total du poste partagé $j$ et $u_{j,t}$ l'usage du tenant $t$ pour le moteur de ce poste ; la somme du dénominateur porte sur tous les tenants $k$.

$$\text{marge}_t = \frac{R_t - \text{CS}_t}{R_t}$$

où $R_t$ est le revenu du tenant $t$ sur la période.

| Poste | Clé | Calcul | Montant (€) |
|---|---|---|---|
| Calcul partagé | Prorata des secondes de calcul (12 %) | 48 000 × 0,12 | 5 760 |
| Stockage d'objets | Mesure directe | Volume × prix unitaire | 1 200 |
| Support | Minutes de traitement saisies | Minutes × coût horaire | 800 |
| Coûts communs | Part égale | Coût commun ÷ nombre de tenants | 1 000 |
| **Coût de service** | | | **8 760** |
| Revenu du tenant | | | 14 000 |
| **Marge brute** | | (14 000 − 8 760) ÷ 14 000 | **37,4 %** |

#### Rapprochement et résidu

Ce que l'on attribue se compare à la facture du fournisseur :

| Ligne | Montant (€) | Part |
|---|---|---|
| Facture du fournisseur d'infrastructure | 180 000 | 100 % |
| Attribué aux tenants | 162 000 | 90 % |
| Non attribué : marge de capacité, environnements d'essai, outillage commun | 18 000 | 10 % |

Le résidu est montré et suivi. Une part qui grossit signale un manque de mesure ou une capacité inutilisée ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)). Le seuil d'alerte du modèle ci-dessus (`unallocated_warning_pct`) la surveille.

#### Précision selon l'objectif

L'article consulté liste quatre objectifs de mesure. La précision utile n'est pas la même pour chacun.

| Objectif | Précision utile | Conséquence pratique |
|---|---|---|
| Estimer le coût des marchandises vendues par tenant | Approximative | Étiquettes de groupe, clés simples |
| Calculer le coût exact de chaque tenant, par exemple pour facturer à l'usage | Exacte | Pipeline de mesure dédié, auditable ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) ; voir le [module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation) |
| Repérer les tenants qui coûtent bien plus que les autres | Approximative | Classement, seuils, limites d'usage équitable ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |
| Réduire le coût global | Par poste | Revue des postes, pas par tenant |

#### Ce qui reste à décider avec la finance

Certains choix sont des conventions, pas des faits techniques. Les coûts de personnel (support, exploitation, ingénierie) entrent-ils dans le coût de service ? Comment répartir un engagement d'achat pluriannuel ? Quel taux de change et quelle période retenir ? Il faut les fixer avec la finance, les consigner ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)) et les appliquer de la même façon d'un mois à l'autre, sans quoi les tendances ne se comparent plus.

#### Modes de défaillance

- **Une seule clé pour tout.**
- **Coûts partagés ignorés.**
- **Étiquettes absentes ou incohérentes.**
- **Télémétrie échantillonnée utilisée pour facturer.**
- **Coût de support oublié.**
- **Aucun rapprochement avec la facture.**
- **Précision excessive**, qui fige un processus coûteux et fragile.
- **Clés jamais révisées** après un changement d'architecture.

**Contre-exemple.** Une plateforme répartit le coût de sa base de données à parts égales entre ses 1 000 tenants. L'un d'eux occupe 30 % du stockage et 40 % des requêtes, mais le rapport lui attribue 0,1 % du poste, comme à tous. L'équipe produit en conclut que tous les tenants coûtent autant et propose une offre à prix unique. Le gros tenant est servi à perte, et aucun rapport ne le montre.

**Limites.** Les clés sont des conventions : deux clés raisonnables donnent des résultats différents, par exemple le stockage ou les requêtes pour répartir une base. Les achats d'engagement et les remises de volume rendent le coût unitaire non linéaire. Et un modèle de coûts décrit le passé : il ne prédit pas, à lui seul, le coût d'un tenant qui n'existe pas encore.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les quotas et la consommation fournissent les mesures d'usage |
| [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | Le modèle d'architecture, partagé ou dédié, détermine ce qui est direct |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | La distribution des tailles explique pourquoi la moyenne trompe |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | Une cellule dédiée rend le coût direct ; une cellule partagée se répartit par groupe |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites bornent le coût qu'un tenant peut engendrer |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | Le coût de service est le numérateur de l'économie unitaire |
| [11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces) | La télémétrie sert à estimer, pas à facturer avec précision |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité utilise les mêmes mesures |

### 5. Application pratique

**Situation initiale.** La facture d'infrastructure d'Alpha Air est de 180 000 € par mois pour 620 tenants. Aucune vue par tenant n'existe. La finance demande quels segments sont rentables, car l'offre est forfaitaire.

**Problème.** Un total unique, aucune mesure d'usage par tenant, aucune clé de répartition.

**Application du concept.** L'équipe bâtit un modèle de coûts, mesure l'usage et attribue chaque mois.

**Déroulé.**

1. Elle recense 14 postes et les classe : directs, partagés, fixes, variables.
2. Elle étiquette chaque cellule et chaque ressource dédiée ; elle ne pose aucune étiquette de tenant sur les ressources partagées.
3. Elle alimente un pipeline de mesure dédié (`usage_event`), distinct de la télémétrie échantillonnée.
4. Elle répartit le calcul et la base au prorata des secondes de calcul et des gigaoctets stockés, l'outillage à parts égales et le support au temps passé.
5. Elle rapproche : 90 % de la facture est attribuée ; les 10 % restants sont présentés comme marge de capacité et coûts communs.
6. Elle lit la distribution par segment, pas la moyenne.

**Résultat.** 31 tenants sur 620 (5 %) ont une marge négative, et 4 d'entre eux concentrent 60 % de la perte. Des plafonds d'usage équitable ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) et une offre adaptée pour les très gros volumes sont décidés. Le rapport est mensuel, calculé en lot, pas en temps réel.

**Limites.** L'attribution est approchée. Le support dépend de la qualité de la saisie du temps. Les clés sont revues chaque trimestre, avec la finance.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un coût direct et un coût partagé ?
2. **Compréhension.** Citez trois clés de répartition et un cas d'usage pour chacune.
3. **Compréhension.** Pourquoi la télémétrie échantillonnée ne convient-elle pas à une facturation précise ?
4. **Pourquoi.** Pourquoi le coût moyen par tenant est-il trompeur ?
5. **Raisonnement pratique.** Un poste partagé coûte 60 000 € ; un tenant en utilise 3 000 unités sur 40 000. Il a 500 € de coûts directs, 300 € de support et 200 € de coûts communs. Son revenu est de 6 000 €. Quels sont son coût de service et sa marge ?

#### Réponses

1. Un coût direct se rattache à un tenant précis par une mesure ou une étiquette. Un coût partagé est commun à plusieurs tenants et se répartit par une clé.
2. Par exemple : le prorata d'un usage mesuré (secondes de calcul pour le calcul partagé) ; la mesure indirecte (gigaoctets stockés pour répartir une base) ; la part égale (outillage commun).
3. Parce que l'échantillonnage réduit le volume de données pour limiter le coût de supervision : il donne des ordres de grandeur, pas des totaux exacts. La facturation demande un comptage complet, par un pipeline conçu pour cela.
4. Parce que la charge est très concentrée (voir [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)) : quelques gros tenants dominent. La moyenne ne décrit ni les uns ni les autres, et masque les tenants à marge négative.
5. Part du poste partagé : $60\,000 \times 3\,000 / 40\,000 = 4\,500$ €. Coût de service : $4\,500 + 500 + 300 + 200 = 5\,500$ €. Marge : $(6\,000 - 5\,500) / 6\,000 \approx 8{,}3\ \%$.

## 22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience

### 1. Comprendre simplement

L'**économie unitaire** (*unit economics*) rapporte le coût, et le revenu, à une unité qui a un sens pour l'activité : un tenant, un utilisateur actif, une transaction. La **pratique FinOps** (*FinOps practice*) est la discipline qui rend le coût visible, l'attribue, le rapproche de la valeur créée et fait agir ensemble ingénierie, finance et produit. L'**arbitrage efficacité-résilience** (*efficiency versus resilience trade-off*) est la décision de ce que l'on accepte de payer en redondance, en marge de capacité et en isolation pour limiter l'effet des pannes, face à ce que l'on économise en les retirant.

**Pourquoi cela existe.** Le total de la facture monte quand l'activité monte : ce n'est pas mauvais en soi. Pour savoir si la plateforme devient plus efficace, il faut un coût par unité. Et réduire les coûts sans regarder le risque conduit à supprimer ce qui protège : réplicas, réserves, redondance. À l'inverse, empiler la redondance sans prix de référence ruine la marge.

**Problème résolu.** Décider des dépenses avec des chiffres comparables, et arbitrer entre coût et risque par une règle explicite.

**Modèle mental.** Une prime d'assurance. On la compare à la perte que l'on risque et à ce que l'on tolère. Payer très cher pour couvrir un risque faible n'a pas de sens, et ne rien couvrir d'un risque ruineux non plus.

**Où l'analogie s'arrête.** Une assurance rembourse après le sinistre. La redondance ne rembourse rien : elle réduit la probabilité et la durée d'une interruption. La confiance perdue des clients, elle, ne se rembourse pas.

**Exemple.** En un an, le coût total de la plateforme passe de 90 000 € à 110 000 € par mois (+22 %), alors que le nombre de tenants actifs passe de 400 à 560 (+40 %). Le coût par tenant passe de 225 € à 196 € (−13 %) : le total a monté, le coût unitaire a baissé. La plateforme est devenue plus efficace.

**Les composants.**

1. l'**unité de valeur** : tenant, utilisateur actif, transaction ;
2. le **numérateur** (coût) et le **dénominateur** (unité) ;
3. la **tendance** et la **distribution** ;
4. le **cadre FinOps** : principes, phases, domaines ;
5. les **revues régulières** et la **gestion des anomalies** ;
6. les **leviers d'optimisation** : usage, prix, architecture ;
7. le **critère d'arbitrage** coût-risque ;
8. les **décisions consignées** ([21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)).

**Objectif d'apprentissage :** vous pouvez calculer et lire un coût unitaire, décrire la pratique FinOps appliquée à la plateforme, et arbitrer entre efficacité et résilience par une perte espérée chiffrée.

### 2. Connaissances essentielles

#### Définition

- **Économie unitaire** : développement et suivi de mesures qui rapportent ce que coûte la technologie à une unité d'activité ou de valeur.
- **Pratique FinOps** : discipline de gestion financière des dépenses technologiques qui associe ingénierie, finance, produit et direction.
- **Arbitrage efficacité-résilience** : choix du niveau de dépense entre l'économie, qui retire de la réserve, et la protection contre les pannes, qui en ajoute.

#### Idées fondamentales

1. **Le total n'est pas l'efficacité.** Le coût par unité l'est.
2. **L'unité a un sens métier.** Un coût par tenant ou par transaction éclaire une décision ; un coût par machine seulement décrit une facture.
3. **Une moyenne cache la distribution.** On suit la médiane, un centile élevé et la part de tenants à marge négative.
4. **Chacun possède son usage.** Les ingénieurs voient le coût de ce qu'ils construisent et décident avec.
5. **La fiabilité supplémentaire coûte de plus en plus.** Chaque amélioration coûte plus que la précédente.
6. **On arbitre sur une perte espérée.** Elle est chiffrée, avec ses hypothèses, et consignée.
7. **L'optimisation n'est pas un projet unique.** C'est un rythme : mesurer, agir, vérifier.

#### Vocabulaire essentiel

- **Mesure unitaire** (*unit metric*) : coût rapporté à une unité d'activité ou de valeur.
- **Perte espérée** (*expected loss*) : fréquence d'un événement × durée × coût de l'unité de durée.
- **Gestion des anomalies** (*anomaly management*) : détection et traitement des écarts de coût inattendus.
- **Optimisation de l'usage** (*usage optimization*) : réduire ce que l'on consomme, par exemple en arrêtant l'inutilisé.
- **Optimisation des tarifs** (*rate optimization*) : réduire le prix payé pour ce que l'on consomme, par exemple par des engagements d'achat.
- **Budget d'erreur** (*error budget*) : écart toléré entre l'objectif de niveau de service et la réalité ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).
- **Marge de capacité** (*headroom*) : capacité disponible au-dessus de la charge courante.

#### Relations de cause à effet

- On suit seulement le total : une croissance saine paraît inquiétante, et une perte d'efficacité passe inaperçue.
- On suit seulement la moyenne : les tenants à marge négative restent invisibles.
- On coupe la redondance pour économiser : le risque monte, sans que le coût d'une interruption ait été chiffré.
- On ajoute de la redondance sans plafond : la marge disparaît, pour un gain de disponibilité marginal.
- On prend des engagements d'achat avant d'avoir mesuré la base stable : on paie une capacité que l'on n'utilise pas.

#### Idées reçues

- **« Réduire la facture est toujours bon. »** Non : une baisse du total peut cacher un coût unitaire en hausse, ou une résilience sacrifiée.
- **« La FinOps est l'affaire de la finance, ou un outil. »** Non : les principes du cadre insistent sur la collaboration et sur la responsabilité des équipes d'ingénierie pour leur usage.
- **« Il faut viser la disponibilité maximale. »** Non : le but est d'être assez fiable, pas davantage que nécessaire, et de payer le niveau de fiabilité que l'activité justifie.

#### Principe clé

On mesure le coût par unité de valeur, on le rend visible et attribuable aux équipes, et l'on arbitre entre efficacité et résilience par une perte espérée chiffrée et consignée.

#### Si vous ne retenez que trois choses

1. Le coût unitaire, pas le total, dit si la plateforme devient plus efficace.
2. La FinOps est une pratique partagée entre ingénierie, finance et produit, avec des rythmes de revue.
3. On arbitre entre économie et résilience en comparant le coût d'une protection à la perte espérée qu'elle évite.

### 3. Explication technique détaillée

#### Les mesures unitaires

La page consultée sur l'économie unitaire distingue des mesures d'efficacité de ressource (coût par gigaoctet stocké, par gigaoctet transféré, par processeur virtuel, par siège utilisé, par jeton) et des mesures d'unité d'activité (coût par tenant, par transaction, par dossier traité, coût de service). Elle indique que les mesures d'unité d'activité sont plus parlantes et signalent en général une maturité plus élevée.

```json
{
  "unit_metrics": [
    { "id": "cost_per_tenant_month", "numerator": "platform_cost", "denominator": "active_tenants", "period": "month" },
    { "id": "cost_per_active_user_month", "numerator": "platform_cost", "denominator": "monthly_active_users", "period": "month" },
    { "id": "cost_per_1000_api_calls", "numerator": "api_tier_cost", "denominator": "api_calls_in_thousands", "period": "month" },
    { "id": "gross_margin_by_segment", "numerator": "revenue_minus_cost_to_serve", "denominator": "revenue", "segments": ["size", "plan", "vertical"] }
  ]
}
```

```sql
-- Lecture de la distribution du coût de service par mois
SELECT date_trunc('month', period_start)::date                                 AS month,
       count(*)                                                                AS tenants,
       round(avg(cost_to_serve), 2)                                            AS mean_cost,
       round((percentile_cont(0.5) WITHIN GROUP (ORDER BY cost_to_serve))::numeric, 2) AS median_cost,
       round((percentile_cont(0.9) WITHIN GROUP (ORDER BY cost_to_serve))::numeric, 2) AS p90_cost,
       count(*) FILTER (WHERE revenue < cost_to_serve)                         AS negative_margin_tenants
  FROM tenant_monthly_cost
 WHERE period_start >= $1
   AND period_start <  $2
 GROUP BY 1
 ORDER BY 1;
```

La requête compare la moyenne, la médiane et le 90e centile, et compte les tenants dont le revenu est inférieur au coût de service. Une moyenne très supérieure à la médiane signale une queue de distribution lourde (voir [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)).

#### Lire une tendance

La même page indique qu'associer la dépense à une mesure de valeur permet de distinguer une économie d'échelle, un gain de productivité et un coût qui s'emballe, et qu'une hausse de coût n'est pas négative si elle s'accompagne d'une valeur proportionnellement plus grande. Elle recommande aussi la tendance dans le temps, dans un périmètre défini, plutôt que des comparaisons larges entre objectifs sans rapport.

| Cas | Total | Unités | Coût unitaire | Lecture |
|---|---|---|---|---|
| A | +22 % | +40 % | −13 % | Économie d'échelle : le coût monte moins vite que l'activité |
| B | −10 % | −25 % | +20 % | Le total baisse, l'efficacité se dégrade |
| C | +5 % | +5 % | 0 % | Croissance proportionnelle |

Pour le cas B : si le total baisse de 10 % et les unités de 25 %, le coût unitaire est multiplié par $0{,}90 / 0{,}75 = 1{,}20$.

#### Le cadre FinOps

La page consultée du cadre FinOps liste six principes, sans ordre particulier. La traduction ci-dessous est libre.

| Principe (traduction libre) | Ce que cela change pour la plateforme |
|---|---|
| Les équipes collaborent | Ingénierie, finance, produit et direction lisent les mêmes chiffres |
| La valeur métier guide les décisions technologiques | On arbitre sur le coût unitaire et la marge, pas sur le total |
| Chacun répond de son usage | Les équipes voient le coût de ce qu'elles construisent |
| Les données FinOps sont accessibles, à jour et exactes | Le rapport mensuel est accessible, et les anomalies se voient vite |
| La FinOps est animée de façon centrale | Une fonction commune porte les pratiques, les engagements d'achat et les outils |
| On tire parti du modèle de coûts variable du cloud | On dimensionne à la demande, on planifie juste à temps |

Le cadre décrit un parcours en trois phases, nommées *Inform*, *Optimize* et *Operate* (informer, optimiser, exploiter). La page consultée ne donne que ces noms et ne décrit pas leur contenu. On les lit couramment comme rendre le coût visible, agir sur les opportunités, puis ancrer la pratique dans le fonctionnement courant ; cette lecture n'a pas été confrontée à la page.

Le cadre organise ses capacités en domaines. La page en liste quatre :

| Domaine | Capacités (page consultée) | Dans la plateforme |
|---|---|---|
| Comprendre l'usage et le coût | Ingestion de données, allocation, rapports et analyse, gestion des anomalies | Pipeline de mesure, attribution ([22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service)), rapport mensuel, alertes |
| Quantifier la valeur métier | Planification et estimation, prévision, budget, indicateurs et références, économie unitaire | Coût par tenant, marge par segment, prévision de capacité ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)) |
| Optimiser l'usage et le coût | Architecture et placement des charges, optimisation de l'usage, optimisation des tarifs, licences et SaaS, durabilité | Cache, réplicas, cellules ; arrêt de l'inutilisé ; engagements d'achat |
| Gérer la pratique FinOps | Alignement stratégique, opérations, gouvernance et risque, formation, facturation et imputation, évaluation, automatisation, disciplines connexes | Rôles, rituels, politiques, outillage |

#### Les rythmes de revue

| Cadence | Revue | Contenu | Participants |
|---|---|---|---|
| Continue | Anomalies de coût | Écarts par tenant et par poste, boucles d'intégration emballées | Plateforme, astreinte |
| Mensuelle | Allocation et coût unitaire | Coût par tenant, marge par segment, résidu non attribué | Plateforme, finance, produit |
| Trimestrielle | Engagements et arbitrages | Engagements d'achat, redondance, objectifs de coût unitaire | Direction technique, finance |

```json
{
  "cost_anomaly_rule": {
    "scope": "tenant",
    "metric": "cost_to_serve_daily",
    "baseline": { "method": "trailing_median", "window_days": 28 },
    "trigger": { "ratio_to_baseline": 2.0, "min_absolute_amount": 200, "min_consecutive_days": 2 },
    "route_to": ["platform_finops_owner", "tenant_success_manager"],
    "first_check": "runaway_job_or_integration_loop"
  }
}
```

Les rythmes et les seuils de cette règle sont des valeurs d'exemple à calibrer sur l'historique de la plateforme.

#### Les trois familles de levier

| Levier | Principe | Exemples | Précaution |
|---|---|---|---|
| Usage | Consommer moins | Arrêter les environnements inactifs, ajuster la taille des bases, purger les données inutiles ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) | Mesurer avant de couper |
| Tarif | Payer moins ce que l'on consomme | Engagements d'achat sur la base stable | L'article consulté suggère d'engager la base stable et de payer au tarif normal les pointes imprévisibles |
| Architecture | Consommer mieux | Cache ([22.3 Mise en cache](#223-mise-en-cache)), partitionnement ([22.5 Partitionnement, clé de partition et rééquilibrage](#225-partitionnement-clé-de-partition-et-rééquilibrage)), placement des charges | Peut déplacer le coût vers un autre poste |

#### L'arbitrage efficacité-résilience

Le chapitre sur la prise de risque du livre *Site Reliability Engineering* de Google formule le principe : le but est d'être assez fiable, pas davantage que nécessaire. Il indique que le coût ne croît pas linéairement avec la fiabilité : une amélioration incrémentale peut coûter 100 fois plus que la précédente. Il nomme deux coûts : les ressources redondantes, et le coût d'opportunité, c'est-à-dire le temps d'ingénierie dépensé en protections plutôt qu'en fonctions visibles. Le budget d'erreur ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) opérationnalise l'arbitrage : tant qu'il en reste, on peut livrer ; quand il s'épuise, on ralentit et l'on investit dans la fiabilité.

| Levier d'efficacité | Ce qu'il économise | Risque qu'il crée | Parade |
|---|---|---|---|
| Regrouper des tenants sur moins de ressources | Coûts fixes par tenant | Rayon d'effet plus large ([22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact)) | Cellules de taille bornée, limites par tenant ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |
| Réduire la marge de capacité | Ressources inactives | Saturation en pointe ([22.2 Budget de latence, débit et latence](#222-budget-de-latence-débit-et-latence)) | Utilisation cible, alertes ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)) |
| Retirer des réplicas ou la région de reprise | Redondance | Reprise longue ou impossible ([22.4 Réplicas de lecture et retard de réplication](#224-réplicas-de-lecture-et-retard-de-réplication), [22.7 Multi-région et routage par résidence des données](#227-multi-région-et-routage-par-résidence-des-données)) | Calcul de perte espérée, exercices de bascule |
| Engager des achats pluriannuels | Prix unitaire | Perte de flexibilité si la base baisse | N'engager que la base stable |

**Perte annuelle espérée.**

$$\text{perte espérée} = f \times d \times c$$

où $f$ est la fréquence annuelle des interruptions, $d$ leur durée moyenne en heures et $c$ le coût d'une heure d'indisponibilité. Le coût total d'une option est son surcoût annuel plus la perte espérée qu'elle laisse.

| Option | Surcoût annuel (€) | $f$ | $d$ (h) | Perte espérée (€) | Coût total (€) |
|---|---|---|---|---|---|
| Reprise manuelle | 0 | 0,5 | 6 | 75 000 | 75 000 |
| Veille chaude | 35 000 | 0,5 | 1 | 12 500 | 47 500 |
| Actif-actif | 90 000 | 0,5 | 0,1 | 1 250 | 91 250 |

Avec $c = 25\,000$ € par heure, la veille chaude coûte moins cher au total. L'actif-actif réduit encore la perte, mais son surcoût dépasse le gain, sur ce seul critère. Le calcul se code en quelques lignes :

```typescript
interface ResilienceOption {
  name: string;
  extraAnnualCost: number;
  outagesPerYear: number;
  hoursPerOutage: number;
}

function totalAnnualCost(option: ResilienceOption, lossPerHour: number): number {
  const expectedLoss = option.outagesPerYear * option.hoursPerOutage * lossPerHour;
  return option.extraAnnualCost + expectedLoss;
}
```

Appliquée aux trois options du tableau avec 25 000 € par heure, la fonction renvoie 75 000, 47 500 et 91 250.

**Ce que ce calcul ne dit pas.** Les hypothèses sont des estimations : la fréquence vient de l'historique, souvent court ; le coût horaire agrège un revenu à risque, des crédits de service contractuels ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)), un surcroît de support et un risque de départ de clients, qu'il faut estimer. Une espérance masque la variance : un événement rare et très coûteux n'a pas le même poids qu'une fréquence modérée. Et des exigences contractuelles ou réglementaires, comme un objectif de reprise imposé, s'imposent avant le calcul. On teste donc la **sensibilité** : on fait varier la fréquence et le coût horaire, et l'on regarde si la décision change.

#### Modes de défaillance

- **Suivre le total seulement.**
- **Optimiser sans mesurer** : on coupe ce qui semblait inutile.
- **Couper la redondance en silence** : la dette de résilience n'apparaît pas dans la facture.
- **Engagements d'achat trop larges.**
- **Aucune revue des anomalies** : une boucle emballée coûte un mois entier.
- **FinOps portée par la seule finance.**
- **Décisions non consignées** : on rediscute chaque année les mêmes arbitrages.

**Contre-exemple.** Une équipe annonce une économie de 20 % : elle a retiré la veille chaude de la région de reprise et divisé par deux les réplicas de lecture. Six mois plus tard, un incident régional dure 7 heures. La perte dépasse les économies d'un an, et le client le plus important invoque une clause de pénalité. Un calcul de perte espérée, même approximatif, avait montré l'inverse.

**Limites.** L'économie unitaire dépend de la qualité de l'attribution ([22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service)). La pratique FinOps exige du temps et de la discipline, et les gains faciles s'épuisent. Et l'arbitrage chiffré aide la décision sans la remplacer : le risque de réputation et les obligations de reprise ne se réduisent pas à une espérance.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [22.10 Modèle de coûts, attribution et coût de service](#2210-modèle-de-coûts-attribution-et-coût-de-service) | Le coût de service fournit le numérateur de l'économie unitaire |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | La distribution des tailles explique le rôle de la médiane et des centiles |
| [22.6 Architecture cellulaire et rayon d'impact](#226-architecture-cellulaire-et-rayon-dimpact) | La taille des cellules arbitre rayon d'effet et coûts fixes |
| [22.7 Multi-région et routage par résidence des données](#227-multi-région-et-routage-par-résidence-des-données) | Le multi-région est le poste de résilience le plus coûteux |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | Les limites par tenant bornent le coût qu'un tenant peut causer |
| [11.11 Reprise après sinistre, RPO et RTO](11-securite-fiabilite-operations.md#1111-reprise-après-sinistre-rpo-et-rto) | Les objectifs de reprise bornent l'arbitrage |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les objectifs de niveau de service et le budget d'erreur cadrent la fiabilité nécessaire |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La marge de capacité est à la fois un coût et une protection |
| [21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture) | Les arbitrages se consignent dans des décisions d'architecture |
| [24.8 Renouvellement et analyse du départ des clients](24-cycle-vie-client-support.md#248-renouvellement-et-analyse-du-départ-des-clients) | Le renouvellement et le départ des clients relient coût et revenu |
| [29.4 Construire ou acheter, open source et licences, dépendance et portabilité](29-organisation-produit-economie.md#294-construire-ou-acheter-open-source-et-licences-dépendance-et-portabilité) | Construire ou acheter suit la même logique d'arbitrage |

### 5. Application pratique

**Situation initiale.** La direction financière d'Alpha Air demande une baisse de 15 % de la facture d'infrastructure, soit 2 160 000 € par an. L'objectif est donc de 324 000 € d'économies.

**Problème.** Réduire le coût sans dégrader la résilience, ni la marge des tenants.

**Application du concept.** L'équipe calcule d'abord les coûts unitaires, puis évalue chaque levier et chaque retrait de protection.

**Déroulé.**

1. Le coût par tenant est de 290 € par mois (180 000 € ÷ 620) et baisse de 8 % sur un an : la plateforme gagne déjà en efficacité.
2. La gestion des anomalies repère des environnements d'essai inactifs : 120 000 € par an à économiser.
3. Le réglage de la taille des bases, après mesure, économise 90 000 € par an.
4. Des engagements d'achat sur la base stable de calcul, soit 60 % de la capacité, économisent 150 000 € par an (valeur d'exemple).
5. Une quatrième proposition retire la veille chaude (35 000 € par an). L'équipe calcule la perte espérée : elle passe de 12 500 € à 75 000 €. Le retrait est refusé.
6. La décision est consignée avec ses hypothèses et sa date de revue.

**Résultat.** L'économie est de 360 000 € par an (16,7 %), sans réduire la résilience. Le coût par tenant passe de 290 € à 242 € par mois.

**Limites.** Une partie des économies, comme l'arrêt d'environnements inactifs, est ponctuelle. Les engagements réduisent la flexibilité si la base baisse. Et la revue de l'arbitrage est annuelle : les hypothèses de fréquence et de coût horaire doivent être mises à jour.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi le coût total peut-il augmenter alors que la plateforme devient plus efficace ?
2. **Compréhension.** Citez deux des six principes du cadre FinOps et dites ce qu'ils changent pour une équipe d'ingénierie.
3. **Compréhension.** Pourquoi une moyenne du coût par tenant est-elle insuffisante ?
4. **Pourquoi.** Pourquoi chaque amélioration de la fiabilité coûte-t-elle plus que la précédente ?
5. **Raisonnement pratique.** Une interruption survient 0,4 fois par an, dure 5 heures et coûte 20 000 € par heure. Une veille chaude coûte 30 000 € par an et ramène la durée à 1 heure. Est-elle justifiée ? Que se passe-t-il si la fréquence est de 0,2 ?

#### Réponses

1. Parce que le coût suit l'activité. Si le nombre d'unités (tenants, utilisateurs, transactions) augmente plus vite que le coût, le coût par unité baisse : le total monte, l'efficacité progresse.
2. Par exemple : « chacun répond de son usage » — les équipes voient et gèrent le coût de ce qu'elles construisent ; « la valeur métier guide les décisions technologiques » — elles arbitrent sur le coût unitaire et la marge, pas sur le total.
3. Parce que la charge et le coût sont très concentrés : la moyenne ne décrit ni les petits ni les gros tenants, et masque ceux dont la marge est négative. On suit la médiane, un centile élevé et la part de tenants à marge négative.
4. Parce que les premiers gains se font par des mesures simples (redondance locale, supervision), tandis que les derniers exigent d'éliminer des défaillances rares et corrélées, par des moyens plus complexes (multi-région, isolation, exploitation). Le chapitre consulté indique qu'une amélioration peut coûter 100 fois plus que la précédente.
5. Sans veille chaude : $0{,}4 \times 5 \times 20\,000 = 40\,000$ € par an. Avec : $0{,}4 \times 1 \times 20\,000 + 30\,000 = 38\,000$ €. Le gain est de 2 000 € par an : la décision est marginale et dépend des hypothèses et des exigences contractuelles. Avec une fréquence de 0,2 : 20 000 € sans veille contre $0{,}2 \times 1 \times 20\,000 + 30\,000 = 34\,000$ € avec : la veille chaude n'est plus justifiée sur ce seul critère.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Latence de queue | Jeffrey Dean et Luiz André Barroso, *The Tail at Scale*, Communications of the ACM, 2013 | [research.google](https://research.google/pubs/the-tail-at-scale/) | 22.2 |
| Loi de Little | Wikipédia (en anglais), *Little's law* | [en.wikipedia.org](https://en.wikipedia.org/wiki/Little%27s_law) | 22.2, 22.8 |
| Mise en cache | Amazon Builders' Library, *Caching challenges and strategies* | [builder.aws.com](https://builder.aws.com/content/3K9TeXp6strMiJ4vhakpRD7BQWO/caching-challenges-and-strategies) | 22.3 |
| Prévention de la ruée sur le cache | Vattani, Chierichetti et Lowenstein, *Optimal Probabilistic Cache Stampede Prevention*, PVLDB, 2015 | Résultats de recherche (résumé de l'article) | 22.3 |
| Réplicas et retard de réplication | PostgreSQL, *Hot Standby* | [postgresql.org](https://www.postgresql.org/docs/current/hot-standby.html) | 22.4 |
| Partitionnement de tables | PostgreSQL, *Table Partitioning* | [postgresql.org](https://www.postgresql.org/docs/current/ddl-partitioning.html) | 22.5 |
| Hachage cohérent | Wikipédia (en anglais), *Consistent hashing* | [en.wikipedia.org](https://en.wikipedia.org/wiki/Consistent_hashing) | 22.5 |
| Architecture cellulaire | AWS Well-Architected, *Reducing the Scope of Impact with Cell-Based Architecture* | [vue d'ensemble](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html), [qu'est-ce qu'une architecture cellulaire](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html) | 22.6 |
| Reprise après sinistre, multi-région | AWS, *Disaster Recovery of Workloads on AWS*, « Disaster recovery options in the cloud » | [docs.aws.amazon.com](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) | 22.7 |
| Équité entre tenants | Amazon Builders' Library, *Fairness in multi-tenant systems* | [builder.aws.com](https://builder.aws.com/content/3Eupj3d2bo4fEvlzYbICMZNhQ3B/fairness-in-multi-tenant-systems) | 22.8 |
| Nivellement de charge par file | Azure Architecture Center, *Queue-Based Load Leveling pattern* | [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling) | 22.8 |
| Cloison | Azure Architecture Center, *Bulkhead pattern* | [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead) | 22.8 |
| Types JSON et index GIN | PostgreSQL, *JSON Types* | [postgresql.org](https://www.postgresql.org/docs/current/datatype-json.html) | 22.9 |
| Index d'expression et index partiels | PostgreSQL, *Indexes on Expressions* ; *Partial Indexes* | [index d'expression](https://www.postgresql.org/docs/current/indexes-expressional.html), [index partiels](https://www.postgresql.org/docs/current/indexes-partial.html) | 22.9 |
| Statistiques sur les expressions indexées | PostgreSQL, *ALTER INDEX* | [postgresql.org](https://www.postgresql.org/docs/current/sql-alterindex.html) | 22.9 |
| Attribution des coûts multi-tenant | Azure Architecture Center, *Architectural approaches for cost management and allocation in a multitenant solution* | [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/cost-management-allocation) | 22.10 |
| Cadre FinOps | FinOps Foundation, *FinOps Framework* ; *FinOps Principles* | [cadre](https://www.finops.org/framework/), [principes](https://www.finops.org/framework/principles/) | 22.11 |
| Allocation et économie unitaire | FinOps Foundation, capacités *Allocation* et *Unit Economics* | [allocation](https://www.finops.org/framework/capabilities/allocation/), [économie unitaire](https://www.finops.org/framework/capabilities/unit-economics/) | 22.10, 22.11 |
| Fiabilité et coût | Google, *Site Reliability Engineering*, chapitre « Embracing Risk » | [sre.google](https://sre.google/sre-book/embracing-risk/) | 22.11 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- La formule du temps de réponse d'une file simple (modèle M/M/1) : modèle simplifié, donné comme tel, non confronté à une source.
- Le rafraîchissement probabiliste anticipé : l'article de Vattani et ses coauteurs n'a pas été lu ; seul un résumé issu de résultats de recherche a été consulté. La technique de gigue sur la durée de vie des entrées est une technique générale, non confrontée.
- Le hachage cohérent : description usuelle, issue d'un article encyclopédique.
- Les noms des fonctions PostgreSQL de position du journal (`pg_current_wal_lsn()`, `pg_last_wal_replay_lsn()`) : à relire dans la documentation de la version utilisée.
- Les ordres de grandeur de latence entre régions éloignées.
- Le constat qu'une valeur rangée dans un document n'a pas de statistique propre et que ses estimations de sélectivité sont grossières ; le coût de réécriture d'un document `jsonb` entier lors d'une mise à jour.
- La lecture usuelle des trois phases du cadre FinOps : la page consultée n'en donne que les noms.
- Les conventions comptables (inclusion des coûts de personnel dans le coût de service, traitement des engagements pluriannuels) : à fixer avec la finance.
- Les valeurs chiffrées (charges, latences, tailles, coûts, marges, fréquences, durées, taux de succès, remises) : ce sont des valeurs d'exemple.
- Les formats de politique, de modèle de coûts, de règle d'alerte et de mesure sont propres à la plateforme fictive.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; le choix des plans par le planificateur n'a pas été observé. Les extraits TypeScript ont été contrôlés syntaxiquement ; ceux de la file équitable, du seau à jetons et du calcul de perte espérée ont en outre été exécutés avec Node.js sur les exemples donnés.
