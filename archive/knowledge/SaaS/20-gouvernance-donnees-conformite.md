# Module 20 — Gouvernance des données, conformité et assurance

> **Question directrice.** Comment démontrer à un client, à un auditeur ou à un régulateur que les données sont maîtrisées et que les engagements sont tenus ?

## Présentation du module

**Objectif.** Les clients entreprises achètent de la confiance démontrable. Le parcours initial fournit les mécanismes : audit ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), preuve et exception ([9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)), rétention ([3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)), résidence des données ([5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)), chiffrement et clés ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)). Ce module décrit le cadre qui les organise : classer et inventorier les données, justifier leur traitement, respecter les droits des personnes, fiabiliser leur circulation, puis démontrer la conformité par des contrôles, des preuves, des audits, des analyses d'impact, des contrats et un registre des risques.

**Prérequis.** L'archivage et la rétention ([3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer)), les données et permissions propres au tenant ([5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)), le journal d'audit ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), l'exception et la preuve ([9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)), les secrets et les clés ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)), la gestion des incidents ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)), ainsi que la conservation et le gel légal des fichiers ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

**Une précaution.** Ce module décrit des mécanismes techniques et des cadres. Il ne constitue pas un avis juridique : la qualification d'un traitement, d'une durée de conservation, d'un transfert ou d'une obligation sectorielle se décide avec le service juridique, pour chaque contexte et chaque juridiction.

**Un mot, plusieurs sens.** Le terme « contrôle » désigne ici une **mesure** de maîtrise (une politique, une procédure, une vérification technique) tenue par une organisation, et non le contrôle d'accès du module 4. Une **preuve** est une trace qui démontre qu'une mesure a fonctionné. Une **attestation** est un rapport d'un tiers ; une **certification** est un certificat délivré par un organisme.

**Ordre retenu.** Cinq groupes, de la connaissance des données à la démonstration et aux engagements.

```text
Connaître et justifier      classification et inventaire ─ registre des traitements, minimisation ─ calendrier de conservation, pseudonymisation
Respecter les personnes     droits des personnes, consentement
Maîtriser la circulation    catalogue, lignage, qualité ─ données de référence, contrat de données
Démontrer                   cadres, contrôles, preuves, conformité continue ─ audits, attestations, certifications
Réagir et s'engager         analyse d'impact, notification ─ transferts, sous-traitants, responsabilité partagée ─ contrats, régimes sectoriels, risques
```

| Groupe | Question de l'utilisateur |
|---|---|
| Connaître et justifier | Quelles données avons-nous, pourquoi, et pour combien de temps ? |
| Respecter les personnes | Comment honorer une demande d'accès ou d'effacement, et prouver un consentement ? |
| Maîtriser la circulation | D'où vient cette donnée, est-elle fiable, et qui s'est engagé sur sa forme ? |
| Démontrer | Comment prouver à un tiers que nos mesures existent et fonctionnent ? |
| Réagir et s'engager | Que faisons-nous en cas d'incident, avec nos sous-traitants et selon nos contrats ? |

**Références.** Les textes et documentations cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)
- [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités)
- [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)
- [20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement)
- [20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données)
- [20.6 Données de référence et contrat de données](#206-données-de-référence-et-contrat-de-données)
- [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)
- [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification)
- [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)
- [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)
- [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques)

## 20.1 Classification et inventaire des données

### 1. Comprendre simplement

La **classification des données** (*data classification*) attribue à chaque donnée un niveau de sensibilité et des catégories (donnée personnelle, donnée de santé, donnée de paiement, secret d'affaires), qui déterminent les règles à appliquer. L'**inventaire des données** (*data inventory*) est la liste, tenue à jour, de ce que la plateforme détient : quelles données, où, sous la responsabilité de qui, pour quel usage, et à quel niveau.

**Pourquoi cela existe.** On ne protège pas ce que l'on ne connaît pas. Les mesures (chiffrement, accès, partage, conservation, transfert) dépendent de la sensibilité de la donnée. Sans classe, chaque équipe décide au cas par cas et les règles divergent. Et les clients, les auditeurs et les régulateurs demandent : « quelles données détenez-vous, et où sont-elles ? ».

**Problème résolu.** Savoir de façon vérifiable quelles données existent, où elles se trouvent, et à quelles règles elles obéissent.

**Modèle mental.** Le plan d'un entrepôt dont chaque zone porte une couleur (publique, interne, confidentielle, restreinte). L'inventaire dit quelles zones contiennent quels colis, et qui en répond.

**Où l'analogie s'arrête.** Un entrepôt est stable. Dans une plateforme configurable, chaque tenant ajoute des champs, des fichiers, des intégrations, et la donnée se copie : dans des index, des entrepôts, des journaux, des sauvegardes. L'inventaire doit suivre ces changements sans intervention manuelle.

**Exemple.** Alpha Air ajoute un champ « aptitude médicale » à la fiche d'un salarié. La plateforme demande sa classification : niveau « restreint », catégories « personnelle » et « santé ». La classe déclenche des mesures : chiffrement du champ, masquage par défaut, exclusion de l'index de recherche (voir [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)), partage externe interdit (voir [18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane)), classe de conservation propre (voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

**Les composants.**

1. le **schéma de classification** : niveaux et catégories ;
2. les **métadonnées de classification**, portées par les champs, les fichiers et les jeux de données ;
3. les **règles d'héritage** : une donnée dérivée prend la classe la plus élevée de ses sources ;
4. la **découverte** : déclarée par le propriétaire et détectée par balayage ;
5. l'**inventaire** des emplacements : systèmes, index, entrepôts, journaux, sauvegardes, tiers ;
6. les **propriétaires** de données ;
7. les **mesures déclenchées** par la classe ;
8. la **revue périodique**.

**Objectif d'apprentissage :** vous pouvez décrire un schéma de classification, expliquer comment la classe pilote des mesures, et dire comment un inventaire reste à jour dans une plateforme configurable.

### 2. Connaissances essentielles

#### Définition

- **Classification des données** : affectation, à une donnée ou à un ensemble de données, d'un niveau de sensibilité et de catégories qui déterminent les mesures de protection et d'usage.
- **Inventaire des données** : registre des données détenues, de leurs emplacements, de leur classification, de leurs propriétaires et de leurs usages.

#### Idées fondamentales

1. **La classe pilote les mesures.** Accès, chiffrement, partage, conservation et transfert se déduisent d'elle.
2. **La classification se pose à la source.** Sur le champ, le fichier, le jeu de données, pas sur l'écran.
3. **Une donnée dérivée hérite.** L'agrégat, l'index, la copie portent au moins la classe de leurs sources.
4. **Un inventaire est un état vérifié.** Il se compare à la réalité par la découverte, pas seulement par la déclaration.
5. **Une donnée a un propriétaire.** Une personne ou un rôle décide de sa classe et de ses usages.
6. **Les copies comptent.** Index, entrepôts, journaux, sauvegardes et tiers figurent à l'inventaire.
7. **Un défaut sûr existe.** Un champ non classé reçoit une classe prudente, jusqu'à décision.

#### Vocabulaire essentiel

- **Niveau de sensibilité** (*sensitivity level*) : degré d'impact en cas d'accès ou de divulgation non autorisés.
- **Catégorie de données** (*data category*) : nature de la donnée : personnelle, de santé, de paiement, d'identifiants.
- **Catégories particulières** (*special categories*) : catégories de données personnelles que le RGPD, article 9, traite avec une protection renforcée : origine raciale ou ethnique, opinions politiques, convictions religieuses ou philosophiques, appartenance syndicale, données génétiques, données biométriques d'identification, données de santé, vie ou orientation sexuelles.
- **Propriétaire de données** (*data owner*) : responsable de la classe, des usages et de la qualité d'un jeu de données.
- **Découverte de données** (*data discovery*) : détection automatique de données sensibles dans des emplacements.
- **Héritage** (*inheritance*) : transmission de la classe d'une source à ses dérivés.
- **Donnée dérivée** (*derived data*) : donnée calculée ou copiée à partir d'autres : agrégat, index, extrait.

#### Relations de cause à effet

- Un tenant ajoute un champ personnalisé sans classe : il est stocké, indexé et exporté comme une donnée banale.
- Un jeu de données dérivé n'hérite pas de la classe : un agrégat « interne » contient des données de santé.
- L'inventaire n'est qu'un tableur déclaratif : il ne mentionne ni l'entrepôt, ni les journaux, ni les sauvegardes.
- Le niveau « confidentiel » est appliqué à tout : l'attention s'émousse et les vraies données sensibles ne se distinguent plus.
- Aucun propriétaire n'est nommé : personne ne décide quand une classe est contestée.

#### Idées reçues

- **« La classification est un exercice de documentation. »** Non. Elle sert à appliquer des mesures automatiquement : sans lien avec les contrôles, elle est décorative.
- **« Seules les bases de données comptent. »** Non. Fichiers, index, entrepôts, journaux, exports et sauvegardes contiennent des copies.
- **« Quatre niveaux suffisent partout. »** Le nombre de niveaux est un choix. Trop peu masque des différences utiles ; trop nombreux, ils ne sont plus appliqués.

#### Principe clé

La classification affecte à chaque donnée un niveau et des catégories, à la source ; elle se transmet aux dérivés et pilote les mesures ; l'inventaire dit où elle se trouve et qui en répond.

#### Si vous ne retenez que trois choses

1. Une classe se pose à la source et pilote des mesures précises, pas seulement des mentions.
2. Les dérivés et les copies héritent de la classe la plus élevée de leurs sources.
3. Un inventaire se vérifie par la découverte et compte tous les emplacements, y compris index, journaux et sauvegardes.

### 3. Explication technique détaillée

#### Un schéma de classification

```json
{
  "classification_scheme": {
    "version": 2,
    "levels": [
      { "code": "public", "rank": 0, "label": "Public" },
      { "code": "internal", "rank": 1, "label": "Interne" },
      { "code": "confidential", "rank": 2, "label": "Confidentiel" },
      { "code": "restricted", "rank": 3, "label": "Restreint" }
    ],
    "categories": ["personal", "special_category", "payment", "health", "credentials", "business_secret"],
    "default_level_for_new_fields": "internal",
    "inheritance": "highest_of_sources"
  }
}
```

Le schéma est une configuration de la plateforme, enrichie par le tenant : une organisation peut ajouter des catégories propres. Les niveaux sont ordonnés (`rank`), ce qui permet de comparer et de calculer l'héritage.

| Niveau | Exemple | Mesures typiques |
|---|---|---|
| Public | Fiche produit publiée | Aucune restriction de lecture |
| Interne | Liste des tâches | Authentification, droits par rôle |
| Confidentiel | Rapports de constats, données de contrat | Droits fins, partage externe borné, journalisation de l'accès |
| Restreint | Données de santé, identifiants, données de paiement | Chiffrement renforcé, masquage par défaut, hors index, accès exceptionnel et tracé |

#### La classification dans les métadonnées

Dans une plateforme pilotée par les métadonnées ([2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)), la classe est un attribut du champ, au même titre que son type ou ses contraintes ([2.3 Propriété et champ](02-donnees-ressources.md#23-propriété-et-champ), [2.4 Métadonnées](02-donnees-ressources.md#24-métadonnées)).

```json
{
  "resource": "employee",
  "field": "medical_aptitude",
  "type": "enum",
  "classification": { "level": "restricted", "categories": ["personal", "special_category", "health"] },
  "owner": "role:hr_manager",
  "purposes": ["occupational_health"],
  "retention_class": "hr_medical"
}
```

Quand un tenant crée un champ personnalisé ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)), l'assistant de création **demande la classe** et propose une valeur par défaut prudente. Un champ non classé n'est pas exportable ni indexable tant qu'il n'est pas décidé : le refus par défaut s'applique aussi à la classification (voir [4.13 Permission, rôle, politique et portée](04-identite-iam-autorisation.md#413-permission-rôle-politique-et-portée)).

#### Les mesures déclenchées

La classe est lue par les mécanismes déjà décrits :

| Mécanisme | Effet de la classe |
|---|---|
| Droits ([4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne), [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)) | Une règle de politique de la forme « restreint : rôle X seulement, avec justification » |
| Recherche ([19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)) | Champs restreints hors de l'index, ou index à droits propres |
| Partage et téléchargement ([18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants), [18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane)) | Partage externe refusé ou soumis à validation, filigrane imposé |
| Chiffrement ([11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement)) | Chiffrement par champ ou par clé dédiée pour les classes élevées |
| Exports et rapports ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) | Colonnes masquées ou exclues sans droit |
| Conservation ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers), [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) | Classe de conservation rattachée |

#### L'héritage

Une donnée dérivée porte au moins la classe de ses sources. Le calcul est la plus haute valeur :

```typescript
const RANK: Record<string, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  restricted: 3,
};

function derivedClassification(sources: string[]): string {
  return sources.reduce((a, b) => (RANK[b] > RANK[a] ? b : a), "public");
}
```

Un agrégat peut être **déclassé** si une règle explicite le justifie (par exemple après anonymisation, voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)), jamais par défaut. Le fichier hérite de la classe de son sujet ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)), l'index de celle des champs qu'il porte ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé)), le rapport de celle de ses colonnes ([19.10 Générateur de rapports, rapports planifiés et instantanés de rapport](19-recherche-analytique-restitution.md#1910-générateur-de-rapports-rapports-planifiés-et-instantanés-de-rapport)).

#### L'inventaire

```sql
CREATE TABLE data_inventory_item (
  tenant_id          uuid        NOT NULL,
  id                 uuid        NOT NULL,
  location_type      text        NOT NULL CHECK (location_type IN
                       ('field','file_class','index','warehouse_table','log','backup','third_party')),
  location_ref       text        NOT NULL,
  description        text        NOT NULL,
  classification     text        NOT NULL,
  categories         text[]      NOT NULL DEFAULT '{}',
  owner_role         text        NOT NULL,
  system_of_record   boolean     NOT NULL DEFAULT false,
  discovered_by      text        NOT NULL CHECK (discovered_by IN ('declared','scanned')),
  last_reviewed_at   timestamptz,
  PRIMARY KEY (tenant_id, id)
);

SELECT location_type, count(*) AS items
  FROM data_inventory_item
 WHERE tenant_id = $1
   AND 'personal' = ANY (categories)
 GROUP BY location_type
 ORDER BY items DESC;
```

La deuxième requête répond à une question typique d'une demande d'accès ou d'un audit : « où se trouvent les données personnelles ? ». Chaque ligne a un type d'emplacement, une classe, un propriétaire, et une origine : déclarée par une personne, ou détectée par balayage.

**Qui alimente l'inventaire.**

| Source | Mécanisme |
|---|---|
| Métadonnées de la plateforme | Les champs et classes de fichiers sont déjà décrits : l'inventaire s'en déduit |
| Déclarations des équipes | Nouvelles intégrations, nouveaux sous-traitants, nouveaux jeux de données |
| Découverte automatique | Balayage d'échantillons pour repérer des motifs (adresses électroniques, numéros d'identification) dans des champs non classés |
| Catalogue de données ([20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données)) | Les actifs de l'entrepôt, avec leur lignage |
| Registre des traitements ([20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités)) | Les finalités et les destinataires associés aux catégories |

La découverte signale des **écarts** : un champ de texte libre classé « interne » mais qui contient des numéros de sécurité sociale. L'écart devient une tâche pour le propriétaire.

#### Texte libre et données non structurées

Les champs de commentaires, les descriptions et les fichiers contiennent des données que personne n'a classées. La plateforme applique la classe **du conteneur** (le champ, le dossier), et prévient les utilisateurs par l'interface (« ne saisissez pas de données de santé ici »). La découverte automatique y repère des motifs. Elle ne peut pas garantir l'absence de donnée sensible : la politique d'usage et la formation complètent.

#### Modes de défaillance

- **Champ non classé** : traité par défaut comme anodin.
- **Dérivé sans héritage** : un agrégat expose plus que ses sources.
- **Inventaire périmé** : un tableur déclaratif qui n'évolue pas.
- **Copies oubliées** : index, journaux et sauvegardes.
- **Classe unique pour tout** : plus de discrimination.
- **Classe sans mesure** : l'étiquette ne change rien.

**Contre-exemple.** Un tenant ajoute un champ « motif d'arrêt maladie » à une fiche, sans classe. Le champ est exporté dans les rapports hebdomadaires, indexé par la recherche et visible de tous les utilisateurs de la fiche. Le jour où la RH demande où se trouvent les données de santé, l'inventaire n'en mentionne aucune.

**Limites.** La classification est un jugement : deux personnes peuvent classer différemment la même donnée. Les contextes changent la sensibilité (une adresse n'a pas le même poids pour un particulier et pour une entreprise). La découverte automatique produit des faux positifs et des faux négatifs. Un inventaire exact à la minute n'existe pas : on vise un état suffisamment frais, avec des écarts détectés.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | La classe est un attribut de métadonnée du champ |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Les politiques d'accès s'écrivent en fonction de la classe |
| [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) | Le chiffrement se règle selon la classe |
| [18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane) | Le partage externe dépend de la classe du fichier |
| [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits) | La recherche exclut ou isole les champs restreints |
| [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | Le registre des traitements rattache catégories et finalités |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | La conservation est portée par une classe |
| [20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données) | Le catalogue de données prolonge l'inventaire |

### 5. Application pratique

**Situation initiale.** Un client d'Alpha Air demande à la plateforme la liste des emplacements où se trouvent des données de santé de ses salariés. L'équipe ne sait pas répondre : les champs ont été ajoutés au fil du temps, sans classification.

**Problème.** Aucun schéma de classification, aucun inventaire, aucun propriétaire désigné.

**Application du concept.** La plateforme introduit un schéma, impose la classe sur les champs et les classes de fichiers, et bâtit un inventaire alimenté par les métadonnées et par la découverte.

**Déroulé.**

1. L'équipe définit quatre niveaux et six catégories, avec un défaut « interne » pour les nouveaux champs.
2. Elle classe les champs existants à partir des métadonnées et du balayage : 46 champs « personnels », 3 « santé ».
3. Elle déduit les emplacements dérivés : 2 index, 1 table d'entrepôt, 2 classes de fichiers, les journaux d'accès.
4. Les champs « santé » sont exclus de l'index de recherche et masqués par défaut dans les exports.
5. Elle répond au client avec un état de l'inventaire daté, propriétaires inclus.

**Résultat.** La question « où sont les données de santé ? » a une réponse vérifiable, et les mesures suivent la classe.

**Limites.** La découverte détecte aussi deux champs de commentaires qui contenaient des informations de santé saisies à la main : il faut les traiter par la formation et par un avertissement à la saisie.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre la classification et l'inventaire des données ?
2. **Compréhension.** Pourquoi une donnée dérivée hérite-t-elle de la classe de ses sources ?
3. **Compréhension.** Comment la classe d'un champ pilote-t-elle les mesures de la plateforme ?
4. **Pourquoi.** Pourquoi la découverte automatique complète-t-elle les déclarations des propriétaires ?
5. **Raisonnement pratique.** Un agrégat est calculé à partir de trois sources : « interne », « confidentiel » et « restreint ». Quelle est sa classe par défaut, et que faut-il pour le déclasser ?

#### Réponses

1. La classification attribue un niveau et des catégories à une donnée. L'inventaire liste ce que l'on détient, où, pour qui et avec quelle classe. La première décide des règles ; le second dit où les appliquer.
2. Parce que le dérivé contient ou révèle tout ou partie de ses sources. S'il n'héritait pas, copier une donnée restreinte dans un agrégat « interne » suffirait à contourner les mesures.
3. La classe est lue par les mécanismes de droits, de recherche, de partage, de chiffrement, d'export et de conservation. Chacun applique une règle selon le niveau et les catégories, sans que le code de chaque module connaisse la donnée.
4. Parce que les déclarations sont incomplètes ou périmées. La découverte repère des données sensibles dans des emplacements non classés et signale les écarts à corriger.
5. « Restreint », la plus élevée. Pour le déclasser, il faut une règle explicite et justifiée, par exemple une anonymisation vérifiée ou une agrégation sous seuil, approuvée par le propriétaire.

## 20.2 Registre des traitements, minimisation et limitation des finalités

### 1. Comprendre simplement

Le **registre des traitements** (*record of processing activities*) est un document tenu à jour qui décrit, pour chaque activité de traitement de données personnelles, ses finalités, ses catégories de données et de personnes, ses destinataires, ses transferts, ses durées et ses mesures de sécurité. La **minimisation des données** (*data minimization*) impose de ne collecter que ce qui est nécessaire. La **limitation des finalités** (*purpose limitation*) impose de n'utiliser une donnée que pour la finalité annoncée. L'ensemble forme la fonction *data minimization and purpose limitation*.

**Pourquoi cela existe.** Une organisation qui ne sait pas ce qu'elle fait des données personnelles ne peut ni les protéger ni répondre à une personne ou à une autorité. Garder « au cas où » crée du risque sans valeur. Et réutiliser une donnée pour un autre but que celui pour lequel elle a été donnée rompt la confiance, et souvent la loi.

**Problème résolu.** Rendre visibles et justifiables les traitements, et limiter les données au nécessaire et à l'usage déclaré.

**Modèle mental.** Le registre d'une pharmacie : chaque médicament entre et sort avec un motif, une quantité, une date. On ne garde que ce qui est utile, et on ne s'en sert que pour ce pour quoi il est inscrit.

**Où l'analogie s'arrête.** Une pharmacie compte des boîtes. Une plateforme copie, dérive et transforme des données : une finalité d'origine peut se perdre dans les copies si les finalités ne sont pas portées avec la donnée.

**Exemple.** La plateforme traite des journaux d'accès pour la sécurité. Un projet d'analyse du produit voudrait les réutiliser pour mesurer l'usage des fonctions. La finalité d'origine est « sécurité et audit », pas « analyse du produit » : le projet doit déclarer une nouvelle finalité, vérifier sa base légale et minimiser les champs (sans identifiant direct), avant d'y accéder.

**Les composants.**

1. le **registre** : une fiche par activité de traitement ;
2. les **finalités**, déclarées en termes précis ;
3. la **liaison données-finalités** : quels champs servent quelle finalité ;
4. les **destinataires** et **sous-traitants** ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) ;
5. les **durées** ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) et les **mesures de sécurité** ;
6. le **contrôle d'accès par finalité** ;
7. la **revue** à chaque changement de traitement.

**Objectif d'apprentissage :** vous pouvez décrire le contenu du registre, expliquer comment minimisation et limitation des finalités se traduisent dans la plateforme, et dire qui tient quel registre.

### 2. Connaissances essentielles

#### Définition

- **Registre des traitements** : document par lequel un responsable du traitement, ou un sous-traitant, consigne les activités de traitement de données personnelles qu'il mène, avec les informations exigées par l'article 30 du RGPD.
- **Minimisation des données** : principe selon lequel les données traitées sont adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités.
- **Limitation des finalités** : principe selon lequel les données sont collectées pour des finalités déterminées, explicites et légitimes, et ne sont pas traitées ultérieurement de manière incompatible avec elles.

#### Idées fondamentales

1. **On ne traite que pour une finalité déclarée.** Pas de donnée sans but.
2. **Le registre existe pour deux rôles.** Un responsable tient le sien ; un sous-traitant tient le registre des traitements faits pour le compte de chaque responsable.
3. **La finalité suit la donnée.** Elle est portée par les métadonnées, pas seulement par un document.
4. **Minimiser, c'est choisir.** Moins de champs, moins de détail, moins de durée.
5. **Un usage nouveau est un traitement nouveau.** Il se déclare, se justifie et se limite.
6. **Le registre est un outil de travail.** Les audits et les demandes des personnes s'y appuient.
7. **La plateforme aide ses tenants à tenir le leur.** Elle fournit la matière, le tenant en reste responsable.

#### Vocabulaire essentiel

- **Responsable du traitement** (*controller*) : entité qui détermine les finalités et les moyens du traitement (RGPD, article 4, point 7).
- **Sous-traitant** (*processor*) : entité qui traite des données pour le compte du responsable (article 4, point 8).
- **Activité de traitement** (*processing activity*) : ensemble d'opérations poursuivant une même finalité.
- **Finalité** (*purpose*) : but précis pour lequel on traite des données.
- **Base légale** (*lawful basis*) : fondement qui rend le traitement licite : consentement, contrat, obligation légale, intérêts vitaux, mission d'intérêt public, intérêts légitimes (article 6, paragraphe 1).
- **Réutilisation compatible** (*compatible further use*) : usage ultérieur qui reste compatible avec la finalité d'origine.
- **Accès par finalité** (*purpose-based access*) : droit d'accès conditionné à une finalité déclarée.

#### Relations de cause à effet

- Aucun registre : l'organisation ne peut pas répondre à une autorité, à un client ou à une personne.
- Les finalités sont écrites dans un document et pas dans les données : au fil des copies, plus personne ne sait pourquoi une donnée est là.
- On collecte « au cas où » : le volume exposé en cas d'incident augmente sans bénéfice.
- Un projet réutilise une donnée sans vérification : une obligation d'information ou de consentement est violée.
- Le registre n'est jamais revu : il décrit une plateforme qui n'existe plus.

#### Idées reçues

- **« Le registre est un document réglementaire à remplir une fois. »** Non. C'est une vue vivante de la plateforme.
- **« Un éditeur SaaS n'a pas de registre. »** Non. Il en a pour ses propres traitements (comptes, facturation, mesure d'usage) et, comme sous-traitant, pour ceux qu'il fait pour le compte de ses clients.
- **« Plus de données, c'est plus de valeur. »** Non. La donnée superflue coûte en stockage, en risques et en obligations.

#### Principe clé

Chaque traitement a une finalité déclarée, une base, des données limitées au nécessaire et un registre à jour ; la finalité suit la donnée et se contrôle à l'accès.

#### Si vous ne retenez que trois choses

1. Le registre décrit, par activité : finalités, données, personnes, destinataires, transferts, durées, sécurité.
2. La minimisation et la limitation des finalités se traduisent en métadonnées et en contrôles, pas en intentions.
3. Un nouvel usage d'une donnée est un nouveau traitement, à déclarer et à justifier.

### 3. Explication technique détaillée

#### Le contenu du registre

L'article 30 du RGPD précise le contenu minimal. Pour le **responsable du traitement**, le registre contient notamment :

- les coordonnées du responsable (et, le cas échéant, du représentant et du délégué à la protection des données) ;
- les finalités du traitement ;
- les catégories de personnes concernées et de données ;
- les catégories de destinataires, y compris dans des pays tiers ;
- les transferts vers des pays tiers et les garanties ;
- si possible, les délais prévus pour l'effacement ;
- si possible, une description générale des mesures de sécurité.

Pour le **sous-traitant**, le registre est organisé par responsable : les coordonnées, les catégories de traitements effectués pour chacun, les transferts éventuels et, si possible, la description des mesures de sécurité. L'article prévoit une exemption pour les organisations de moins de 250 personnes, qui ne vaut pas si le traitement est susceptible de comporter un risque pour les droits et libertés, s'il n'est pas occasionnel, ou s'il porte sur des catégories particulières de données ou des condamnations pénales : en pratique, un éditeur SaaS la juge rarement applicable.

```json
{
  "activity_id": "pa_support_ticket",
  "role": "processor",
  "controller": "tenant",
  "purposes": ["customer_support"],
  "data_subject_categories": ["tenant_users"],
  "personal_data_categories": ["identity", "contact", "usage_logs"],
  "recipients": ["support_team", "sub_processor:ticketing_provider"],
  "transfers": [{ "to": "US", "mechanism": "adequacy_dpf" }],
  "retention": { "class": "support_tickets", "duration_months": 24 },
  "security_measures": ["encryption_at_rest", "role_based_access", "audit_log"],
  "legal_basis_owner": "tenant"
}
```

Le champ `role` distingue les traitements où la plateforme est **sous-traitant** (pour le compte du tenant) de ceux où elle est **responsable** (ses comptes, sa facturation, ses mesures d'usage). La base légale d'un traitement fait pour le compte du tenant relève du tenant (`legal_basis_owner`).

#### Deux niveaux de registre

| Niveau | Qui | Contenu | Sert à |
|---|---|---|---|
| Registre de la plateforme | L'éditeur | Ses traitements propres et ses traitements en tant que sous-traitant | Répondre aux clients et aux autorités ; alimenter les audits |
| Registre du tenant | Le tenant, responsable du traitement | Ses traitements dans la plateforme, selon son métier | Répondre à ses propres obligations |

La plateforme peut **aider** le tenant : un modèle de fiche pré-rempli par type de fonction (les catégories de données, les sous-traitants, les durées par défaut), et un export des données utiles à son registre. Elle ne le remplit pas à sa place : les finalités et les bases légales sont des décisions du tenant.

#### Minimiser dans la plateforme

| Levier | Mise en œuvre |
|---|---|
| À la conception | Chaque champ est lié à une finalité ; un champ sans finalité n'est pas créé |
| À la collecte | Champs optionnels et facultatifs ; granularité réduite (une tranche d'âge plutôt qu'une date de naissance, si le besoin le permet) |
| Au traitement | Journaux sans contenu superflu ; identifiants plutôt que données ; masquage dans les rapports |
| À la conservation | Durées par classe ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) ; suppression à échéance ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) |
| À la copie | Les entrepôts, index et jeux d'essai ne reçoivent que les champs nécessaires ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)) |
| À l'accès | Accès par finalité, justification des accès exceptionnels ([9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)) |

#### Lier la finalité à la donnée

```json
{
  "field": "employee.birth_date",
  "classification": { "level": "confidential", "categories": ["personal"] },
  "purposes": [
    { "code": "payroll", "legal_basis": "contract" },
    { "code": "safety_certification", "legal_basis": "legal_obligation" }
  ],
  "forbidden_purposes": ["marketing", "product_analytics"]
}
```

L'accès par finalité fait d'une **raison** une condition d'accès : une requête qui lit `birth_date` déclare sa finalité (« payroll »), et la politique refuse si la finalité n'est pas autorisée pour ce champ (voir [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac)). Pour les accès humains exceptionnels, la raison est saisie et journalisée ([9.2 Acteur, horodatage, avant et après, motif](09-audit-versionnement-gouvernance.md#92-acteur-horodatage-avant-et-après-motif)).

#### Quand un usage change

```text
Nouvelle idée d'usage ─► finalité compatible avec l'origine ? ─┬─ oui ─► déclarer, minimiser, documenter
                                                                └─ non ─► nouvelle finalité : base légale, information, consentement si requis
```

Le test de compatibilité tient compte du lien entre les finalités, du contexte de collecte, de la nature des données et des conséquences pour les personnes. La décision, et sa justification, sont enregistrées au registre. Les données dérivées (agrégats, analyses) restent soumises à ce test : anonymiser avant réutilisation est souvent le moyen le plus simple ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

#### Modes de défaillance

- **Registre fantôme** : un document qui ne reflète pas la plateforme.
- **Finalités vagues** : « amélioration des services ».
- **Réutilisation silencieuse** : un projet d'analyse lit des données collectées pour la sécurité.
- **Collecte excessive** : champs facultatifs rendus obligatoires.
- **Rôle confondu** : un traitement fait pour un client est traité comme celui de l'éditeur.
- **Copies sans finalité** : jeux d'essai ou exports qui contiennent plus que nécessaire.

**Contre-exemple.** Une équipe produit analyse l'usage des fonctions à partir des journaux d'accès, qui contiennent les adresses électroniques des salariés des clients. La finalité d'origine des journaux est la sécurité. Le projet n'est ni déclaré ni limité. Un client demande au registre de la plateforme si les journaux servent à l'analyse produit : la réponse écrite est « non », la réalité est « oui ».

**Limites.** Le registre ne remplace ni l'analyse d'impact ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) ni les mesures de sécurité : il documente. La qualification d'un traitement (responsable, sous-traitant, responsables conjoints) est un jugement juridique, parfois nuancé. Et la finalité décrite doit rester précise sans devenir une liste de cas particuliers inutilisable.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | L'inventaire fournit les catégories de données du registre |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Les durées et les techniques de protection du registre |
| [20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement) | Les droits des personnes s'exercent sur les traitements décrits ici |
| [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations) | L'analyse d'impact s'appuie sur la description du traitement |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Destinataires, sous-traitants et transferts du registre |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Les politiques d'accès peuvent exiger une finalité |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | L'accès exceptionnel est justifié et tracé |
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | Les copies analytiques sont minimisées |

### 5. Application pratique

**Situation initiale.** Un client d'Alpha Air demande à la plateforme la liste de ses traitements de données de salariés et leurs finalités. L'éditeur n'a qu'un document général, écrit deux ans plus tôt.

**Problème.** Pas de registre à jour, pas de finalité portée par les données, des usages d'analyse mal délimités.

**Application du concept.** La plateforme tient un registre par activité, lie les champs aux finalités et contrôle les accès par finalité.

**Déroulé.**

1. L'équipe dresse la liste des activités : support, journaux de sécurité, facturation, notifications, analyse d'usage.
2. Pour chacune, elle documente rôle, finalités, catégories, destinataires, durées et sécurité.
3. Elle rattache chaque champ à ses finalités dans les métadonnées, avec les finalités interdites.
4. Les journaux d'accès sont limités à la sécurité et à l'audit. L'analyse d'usage utilise des identifiants pseudonymisés (voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) et une finalité déclarée.
5. Elle fournit au client un extrait du registre, daté, pour ses propres obligations.

**Résultat.** La réponse à la demande du client est précise, et les réutilisations sont encadrées.

**Limites.** Les finalités des traitements faits pour le client restent décidées par le client : la plateforme documente ce qu'elle fait, pas ce que le client décide.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient le registre des traitements d'un responsable, et en quoi celui d'un sous-traitant diffère-t-il ?
2. **Compréhension.** Quelle différence y a-t-il entre la minimisation et la limitation des finalités ?
3. **Compréhension.** Pourquoi la finalité doit-elle être portée par les métadonnées des données ?
4. **Pourquoi.** Pourquoi la réutilisation d'une donnée pour un nouvel usage est-elle un nouveau traitement ?
5. **Raisonnement pratique.** Une équipe veut utiliser des journaux d'accès, collectés pour la sécurité, afin d'analyser l'usage des fonctions. Quelles étapes suit-on ?

#### Réponses

1. Pour un responsable : coordonnées, finalités, catégories de personnes et de données, destinataires, transferts et garanties, délais d'effacement et mesures de sécurité quand c'est possible. Le sous-traitant tient un registre organisé par responsable, avec les catégories de traitements faits pour chacun.
2. La minimisation limite les données au nécessaire pour la finalité. La limitation des finalités interdit d'utiliser ces données pour un but incompatible avec celui annoncé.
3. Pour que la finalité suive la donnée dans les copies et les dérivés, et puisse être contrôlée à l'accès. Un document séparé se périme et ne contrôle rien.
4. Parce que la finalité d'origine est le fondement du traitement : un autre but exige une compatibilité, une base légale et parfois une information ou un consentement. Il se déclare donc au registre et se justifie.
5. Vérifier la compatibilité avec la finalité d'origine ; sinon, définir une nouvelle finalité avec sa base légale ; minimiser (pseudonymiser ou anonymiser, retirer les identifiants directs) ; limiter l'accès à cette finalité ; mettre à jour le registre et informer si nécessaire.

## 20.3 Calendrier de conservation, pseudonymisation et anonymisation

### 1. Comprendre simplement

Le **calendrier de conservation** (*retention schedule*) est le document de gouvernance qui fixe, pour chaque classe de données, la durée de garde, l'événement qui la déclenche, le fondement de cette durée, et ce qu'on en fait à l'échéance. La **pseudonymisation** et l'**anonymisation** (*pseudonymization and anonymization*) sont deux techniques qui réduisent le lien entre une donnée et une personne : la première le dissimule en le conservant ailleurs, la seconde le supprime de façon irréversible.

**Pourquoi cela existe.** Garder des données plus longtemps que nécessaire crée un risque (fuite, usage détourné) sans bénéfice. Les supprimer trop tôt viole des obligations de conservation. Un calendrier met d'accord juristes, métiers et ingénieurs sur des durées précises. Et quand la donnée est utile sans identifier personne (statistiques, essais), ces deux techniques permettent de la garder à moindre risque.

**Problème résolu.** Décider une fois, par classe, combien de temps garder quoi, et réduire l'identifiabilité des données qu'on garde pour d'autres usages.

**Modèle mental.** Le calendrier est la date de péremption sur chaque étagère. La pseudonymisation remplace les noms sur les colis par des numéros, avec la table de correspondance dans un coffre. L'anonymisation détruit le carnet d'adresses : plus personne, y compris l'entrepôt, ne peut retrouver le destinataire.

**Où l'analogie s'arrête.** Un numéro de colis peut être retrouvé par recoupement avec d'autres informations (date, poids, quartier). Rendre une donnée réellement anonyme est difficile : beaucoup de jeux « anonymisés » restent réidentifiables.

**Exemple.** Alpha Air garde les photos de constats 5 ans après la clôture, et les journaux d'accès aux fichiers 12 mois (valeurs d'exemple). Pour une étude de qualité, l'équipe veut analyser les délais de traitement par technicien. Elle remplace les identifiants des techniciens par des pseudonymes, avec une clé gardée à part, puis agrège par équipe : l'étude publiée ne permet pas de remonter à une personne.

**Les composants.**

1. les **classes de conservation** : durée, déclencheur, fondement, disposition ;
2. les **propriétaires** et les **dates de revue** ;
3. le **moteur de disposition** (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) ;
4. la **pseudonymisation** : jetons, clés, séparation ;
5. l'**anonymisation** : agrégation, généralisation, suppression ;
6. le **test de réidentification** ;
7. le **registre des jeux dérivés** et leur statut.

**Objectif d'apprentissage :** vous pouvez décrire un calendrier de conservation, distinguer pseudonymisation et anonymisation, et dire pourquoi une donnée pseudonymisée reste une donnée personnelle.

### 2. Connaissances essentielles

#### Définition

- **Calendrier de conservation** : table des classes de données avec, pour chacune, la durée de conservation, l'événement déclencheur, le fondement, la disposition à l'échéance et le responsable.
- **Pseudonymisation** : traitement de données personnelles tel qu'elles ne peuvent plus être attribuées à une personne précise sans informations supplémentaires, conservées séparément et protégées par des mesures techniques et organisationnelles (RGPD, article 4, point 5).
- **Anonymisation** : traitement qui rend les données telles que la personne n'est plus identifiable, par aucun moyen raisonnablement susceptible d'être utilisé (considérant 26 du RGPD).

#### Idées fondamentales

1. **La durée appartient à la classe.** Elle ne se décide pas fichier par fichier.
2. **Un minimum et un maximum.** L'obligation de garder et l'obligation de ne pas garder trop se composent.
3. **Le déclencheur compte autant que la durée.**
4. **La pseudonymisation protège, elle ne retire pas le caractère personnel.** La donnée pseudonymisée reste une donnée personnelle.
5. **L'anonymisation est un résultat à démontrer.** Pas une étiquette.
6. **La clé est le secret.** La pseudonymisation vaut ce que vaut la séparation de la clé.
7. **L'anonymisation ouvre des usages.** Une donnée réellement anonyme sort du champ du RGPD.

#### Vocabulaire essentiel

- **Déclencheur** (*trigger*) : événement à partir duquel la durée court.
- **Disposition** (*disposition*) : sort des données à l'échéance : suppression, anonymisation, archivage.
- **Jeton** (*token*) : valeur de remplacement d'un identifiant.
- **Hachage à clé** (*keyed hash*, HMAC) : empreinte calculée avec un secret.
- **Réidentification** (*re-identification*) : retour à la personne par recoupement.
- **Individualisation** (*singling out*) : possibilité d'isoler une personne dans un jeu de données.
- **Généralisation** (*generalization*) : remplacement d'une valeur par une classe plus large (âge exact par tranche).
- **k-anonymat** (*k-anonymity*) : propriété selon laquelle chaque combinaison d'attributs identifiants correspond à au moins k personnes.

#### Relations de cause à effet

- Aucun calendrier : chaque équipe garde ou supprime à son idée, et l'organisation ne sait plus répondre à « combien de temps ? ».
- Les durées partent de la création alors que l'obligation part de la clôture : on supprime trop tôt, ou trop tard.
- On remplace un identifiant par son simple hachage : un attaquant qui connaît la liste des identifiants possibles retrouve chaque personne.
- On supprime le nom mais on garde la date de naissance, le code postal et le sexe : la personne est retrouvable par recoupement.
- On appelle « anonyme » un jeu pseudonymisé : les obligations sont écartées à tort.

#### Idées reçues

- **« Pseudonymiser, c'est anonymiser. »** Non. Le considérant 26 précise que des données pseudonymisées, qui peuvent être attribuées à une personne par des informations supplémentaires, restent des données personnelles.
- **« Supprimer le nom suffit. »** Non. L'individualisation par d'autres attributs reste possible.
- **« Plus la durée est longue, plus on est protégé. »** Non. La conservation excessive est une non-conformité en soi (limitation de la conservation).

#### Principe clé

Chaque classe de données a une durée, un déclencheur et une disposition décidés une fois ; la pseudonymisation dissimule le lien à la personne sans le supprimer, l'anonymisation le supprime et se démontre.

#### Si vous ne retenez que trois choses

1. Le calendrier fixe, par classe, la durée, le déclencheur, le fondement et la disposition.
2. Une donnée pseudonymisée reste personnelle : la clé qui permet le lien se garde à part.
3. L'anonymisation est une propriété à démontrer par un test de réidentification, pas un simple retrait de colonne.

### 3. Explication technique détaillée

#### Le calendrier

```sql
CREATE TABLE retention_class (
  tenant_id        uuid    NOT NULL,
  code             text    NOT NULL,
  description      text    NOT NULL,
  trigger_event    text    NOT NULL,
  duration_months  integer NOT NULL CHECK (duration_months >= 0),
  legal_basis      text,
  disposition      text    NOT NULL CHECK (disposition IN ('delete','anonymize','archive')),
  owner_role       text    NOT NULL,
  review_due_on    date    NOT NULL,
  PRIMARY KEY (tenant_id, code)
);
```

| Classe | Déclencheur | Durée (exemple) | Fondement | Disposition |
|---|---|---|---|---|
| `maintenance_record` | Clôture du constat | 60 mois | Obligation sectorielle, voir [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Suppression |
| `access_log` | Date de l'événement | 12 mois | Sécurité et audit | Suppression |
| `support_ticket` | Fermeture du ticket | 24 mois | Intérêt légitime, contrat | Anonymisation |
| `hr_medical` | Fin du contrat de travail | 120 mois | Obligation légale | Archivage puis suppression |
| `marketing_consent_proof` | Retrait du consentement | 36 mois | Preuve de conformité | Suppression |

*Ces durées sont des valeurs d'exemple. Elles dépendent du droit applicable, du secteur et des contrats : elles se fixent avec le service juridique.*

Le calendrier est une **configuration versionnée**, avec propriétaire et revue périodique (voir [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)). Chaque classe de la plateforme (fichiers, journaux, comptes, sauvegardes) y figure. Le mécanisme d'exécution (suppression logique, purge, gel légal, preuve) est décrit en [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) ; le calendrier le pilote.

**Règles de composition.**

| Situation | Règle |
|---|---|
| Plusieurs durées minimales s'appliquent | La plus longue prévaut, tant qu'aucune durée maximale ne s'y oppose |
| Une durée maximale et une obligation de conserver se contredisent | Arbitrage juridique documenté ; on ne laisse pas la technique trancher |
| Le déclencheur est rouvert (dossier rouvert) | La date de fin est recalculée |
| La donnée est sous gel légal | La suppression est suspendue (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) |
| Le tenant fixe une durée plus courte que le défaut de la plateforme | Respectée, sauf obligation de conservation supérieure |

#### Pseudonymisation

La définition de l'article 4 est précise : sans informations supplémentaires, la donnée n'est pas attribuable à une personne ; ces informations sont conservées à part et protégées. La **séparation** est donc le cœur de la technique.

| Technique | Principe | Atouts | Limites |
|---|---|---|---|
| Table de correspondance | Un identifiant est remplacé par un jeton aléatoire ; la table est gardée à part | Réversible par ceux qui ont la table ; simple | La table est une cible de grande valeur |
| Hachage simple | `SHA-256(identifiant)` | Sans table, déterministe | Un identifiant devinable se retrouve par essais : l'empreinte est calculée sur la liste des possibles |
| Hachage à clé (HMAC) | `HMAC(clé, identifiant)` | Déterministe, sans table, non rejouable sans la clé | Dépend de la protection de la clé ; rotation délicate |
| Chiffrement réversible | Chiffrement de l'identifiant | Réversible pour qui a la clé | Gestion de clés, voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) |

```typescript
import { createHmac } from "node:crypto";

function pseudonymize(identifier: string, tenantSecret: Buffer): string {
  return createHmac("sha256", tenantSecret)
    .update(identifier.trim().toLowerCase())
    .digest("hex");
}
```

Le secret est **propre au tenant** et gardé dans le gestionnaire de clés ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)). Deux tenants n'obtiennent pas les mêmes pseudonymes pour une même personne : on ne peut pas relier un salarié d'un tenant à un autre. Le pseudonyme est stable à l'intérieur d'un tenant : les jointures et les statistiques par personne restent possibles.

**Pourquoi pas un hachage simple ?** Un identifiant comme une adresse électronique appartient à un ensemble que l'on peut énumérer ou deviner : liste de salariés, annuaire public. Calculer l'empreinte de chaque candidat prend peu de temps, et la comparaison révèle l'identité. La clé secrète interdit cette énumération à qui ne la possède pas.

**Où pseudonymiser dans la plateforme.**

- les **jeux d'essai** et copies de production pour les environnements non productifs ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) ;
- les **analyses produit** et statistiques d'usage ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)) ;
- les **journaux** destinés à des équipes qui n'ont pas besoin de l'identité ;
- les **échanges** avec des sous-traitants qui n'ont pas besoin de l'identité ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

#### Anonymisation

Le considérant 26 du RGPD précise que, pour déterminer si une personne est identifiable, on considère tous les moyens raisonnablement susceptibles d'être utilisés, par le responsable ou par un tiers, pour l'identifier directement ou indirectement, par exemple l'individualisation ; on tient compte de facteurs objectifs tels que le coût, le temps et la technologie disponible, et de son évolution probable. Les principes de protection ne s'appliquent pas à une information réellement anonyme.

| Technique | Principe | Exemple |
|---|---|---|
| Suppression des identifiants directs | Retrait du nom, du numéro, de l'adresse | Insuffisante seule |
| Généralisation | Valeurs en classes plus larges | Âge exact → tranche de 10 ans ; code postal → département |
| Agrégation | Résultats par groupe, pas par personne | Délai moyen par équipe |
| Seuil minimal | Groupes trop petits supprimés ou fusionnés | Pas de statistique en dessous de 5 personnes (valeur d'exemple) |
| Perturbation | Bruit ajouté aux valeurs | Valeurs légèrement modifiées |

**Le test de réidentification.** On vérifie, avant diffusion, que des attributs apparemment anodins combinés n'isolent pas une personne. Un critère simple est le **k-anonymat** : chaque combinaison des attributs quasi identifiants (âge, code postal, sexe) doit apparaître au moins $k$ fois.

```sql
SELECT age_band, postal_prefix, sex, count(*) AS people
  FROM analytics.technician_sample
 GROUP BY age_band, postal_prefix, sex
HAVING count(*) < 5
 ORDER BY people;
```

Cette requête liste les combinaisons qui isolent moins de 5 personnes : chaque ligne renvoyée est un risque d'individualisation à corriger (généralisation, suppression) avant de diffuser le jeu. Le seuil 5 est un exemple ; le niveau retenu dépend de la sensibilité et du contexte de diffusion.

**Une anonymisation se documente.** On consigne la méthode, les attributs retenus, le seuil, le test, la date, la personne qui l'a approuvée, et le périmètre de diffusion. Elle se **réévalue** : de nouvelles données publiques ou de nouvelles techniques peuvent rendre un jeu réidentifiable.

#### Pseudonymisation ou anonymisation

| Critère | Pseudonymisation | Anonymisation |
|---|---|---|
| Lien à la personne | Conservé, séparé | Détruit, de façon irréversible |
| Statut au regard du RGPD | Donnée personnelle | Hors du champ, si elle est réelle |
| Réversibilité | Oui, avec la clé | Non |
| Usage | Réduire le risque, garder des jointures | Réutiliser, publier, conserver sans durée liée à la personne |
| Preuve à fournir | Séparation, protection de la clé | Résistance à la réidentification |

#### Dans les données historisées

Les révisions ([9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) et les événements immuables ([7.9 Event sourcing](07-evenements-automatisation.md#79-event-sourcing)) posent un problème : on ne réécrit pas l'historique, mais on doit pouvoir effacer ou dissocier une personne. Deux pratiques : ne pas mettre de données personnelles dans les événements (références vers des enregistrements modifiables), ou chiffrer les données personnelles avec une clé par personne que l'on détruit (effacement cryptographique).

#### Modes de défaillance

- **Calendrier absent ou ignoré.**
- **Déclencheur erroné.**
- **Hachage simple** d'identifiants devinables.
- **Table de correspondance** stockée à côté des données.
- **Quasi-identifiants oubliés** : date, code postal, poste.
- **Anonymisation non réévaluée.**
- **Données pseudonymisées présentées comme anonymes** à un tiers.

**Contre-exemple.** Une équipe publie un jeu « anonymisé » de délais de traitement par technicien, en remplaçant le matricule par son SHA-256. Le matricule est un nombre à 5 chiffres : en calculant les 100 000 empreintes possibles, n'importe qui retrouve l'identité de chaque technicien en quelques secondes. Il fallait un pseudonyme à clé, et, pour une publication, une agrégation.

**Limites.** Aucune technique d'anonymisation n'est absolue : la réidentification dépend des données disponibles ailleurs. Les durées légales varient. Et pseudonymiser coûte (clés, jointures, processus) : on l'applique là où le risque le justifie.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | Le mécanisme de conservation, de gel légal et de purge |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | Archiver et restaurer avant la disposition |
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | Les classes de données portent les classes de conservation |
| [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | Les durées figurent au registre des traitements |
| [20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement) | Les demandes d'effacement se confrontent au calendrier |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | L'effacement dans les révisions passe par l'anonymisation |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés de pseudonymisation et l'effacement cryptographique |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](21-livraison-qualite-logicielle.md#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les jeux d'essai sont pseudonymisés |

### 5. Application pratique

**Situation initiale.** Alpha Air conserve tout, sans calendrier. L'équipe qualité voudrait analyser les délais par technicien et partager les résultats avec un laboratoire universitaire.

**Problème.** Aucune durée décidée, des données personnelles gardées sans limite, un partage envisagé sans protection.

**Application du concept.** La plateforme formalise un calendrier et applique pseudonymisation puis anonymisation.

**Déroulé.**

1. Le service juridique et la direction technique définissent six classes de conservation, avec déclencheur, durée et disposition.
2. Pour l'analyse interne, la plateforme remplace le matricule par un pseudonyme à clé propre au tenant.
3. Pour le laboratoire, elle agrège par base et par trimestre, supprime les groupes de moins de 5 personnes, généralise l'ancienneté en tranches.
4. Le test de réidentification ne retourne aucune combinaison de moins de 5 personnes.
5. La méthode, le test et la date sont consignés et approuvés par le délégué à la protection des données.

**Résultat.** Les données personnelles brutes suivent des durées décidées, et le laboratoire ne reçoit que des agrégats non individualisants.

**Limites.** L'anonymisation est valable à la date du test : on la réévalue si de nouvelles données croisables apparaissent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient une classe d'un calendrier de conservation ?
2. **Compréhension.** Pourquoi une donnée pseudonymisée reste-t-elle une donnée personnelle ?
3. **Compréhension.** Quelle différence y a-t-il entre hachage simple et hachage à clé pour pseudonymiser ?
4. **Pourquoi.** Pourquoi le test de réidentification est-il nécessaire après le retrait des identifiants directs ?
5. **Raisonnement pratique.** Un jeu contient âge, code postal et sexe. La requête de k-anonymat renvoie 12 combinaisons à moins de 5 personnes. Que faire avant de le diffuser ?

#### Réponses

1. Un code, une durée, un déclencheur, un fondement, une disposition à l'échéance, un propriétaire et une date de revue.
2. Parce que les informations supplémentaires qui permettent le lien existent encore et sont détenues par le responsable ou un tiers : la personne reste identifiable, ce que précise le considérant 26 du RGPD.
3. Le hachage simple se retrouve par essais sur la liste des identifiants possibles. Le hachage à clé exige un secret : sans lui, on ne peut pas calculer les empreintes de candidats.
4. Parce que des attributs combinés (âge, code postal, poste) peuvent isoler une personne même sans nom. Le test mesure cette individualisation avant diffusion.
5. Généraliser les attributs (tranches plus larges, départements au lieu de codes postaux), fusionner ou supprimer les groupes trop petits, relancer le test jusqu'à ce qu'aucune combinaison ne soit sous le seuil, puis documenter.

## 20.4 Droits des personnes et gestion du consentement

### 1. Comprendre simplement

Les **droits des personnes** (*data subject rights*) sont les droits que la loi reconnaît aux personnes sur leurs données : être informées, y accéder, les faire rectifier, effacer ou limiter, les récupérer, s'opposer à leur traitement, ne pas être soumises à une décision entièrement automatisée. La **gestion du consentement** (*consent management*) enregistre, applique et prouve les consentements donnés par les personnes pour des traitements précis.

**Pourquoi cela existe.** La loi donne ces droits (le chapitre III du RGPD, articles 12 à 23), mais ils n'ont de valeur que si l'organisation sait y répondre, dans un délai court, pour des données éparpillées entre la base, les fichiers, les index, l'entrepôt et les sauvegardes. Sans mécanisme, la réponse est manuelle, tardive et incomplète. Le consentement, lui, n'a de valeur que s'il peut être prouvé et retiré.

**Problème résolu.** Répondre de façon complète, tracée et dans les délais à une demande d'une personne ; prouver qui a consenti à quoi, quand et sous quel texte.

**Modèle mental.** Le guichet d'une administration. La personne dépose une demande, l'administration vérifie son identité, retrouve le dossier dans tous les services, répond dans un délai et garde la trace.

**Où l'analogie s'arrête.** Un guichet a un dossier unique. Une plateforme a des copies partout, des tiers qui détiennent des données, des obligations de conservation qui s'opposent à l'effacement, et des données d'autres personnes mêlées à celles du demandeur.

**Exemple.** Une personne qui travaille chez un sous-traitant d'Alpha Air demande l'accès à ses données. Alpha Air, responsable du traitement, enregistre la demande, vérifie l'identité, interroge l'inventaire pour savoir où chercher, produit un export et répond dans le mois.

**Les composants.**

1. le **canal de dépôt** : formulaire, courriel, support ;
2. la **vérification d'identité** ;
3. la **localisation des données**, par l'inventaire ([20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) ;
4. l'**exécution par droit** : accès, rectification, effacement, limitation, portabilité, opposition ;
5. le **suivi du délai** ;
6. les **exceptions** et refus motivés ;
7. la **réponse sécurisée** ;
8. le **registre des consentements**, appliqué aux traitements.

**Objectif d'apprentissage :** vous pouvez décrire le traitement d'une demande de personne, de la réception à la réponse, et expliquer comment un consentement s'enregistre, se prouve et se retire.

### 2. Connaissances essentielles

#### Définition

- **Droits des personnes** : ensemble des droits dont dispose une personne concernée sur ses données personnelles : information, accès, rectification, effacement, limitation, portabilité, opposition, décision automatisée.
- **Gestion du consentement** : ensemble des moyens qui recueillent, enregistrent, appliquent, prouvent et révoquent les consentements, par finalité.

#### Idées fondamentales

1. **Le responsable répond, le sous-traitant assiste.** Le tenant est en général responsable ; la plateforme lui fournit les moyens (RGPD, article 28, paragraphe 3, point e).
2. **Il existe un délai.** Un mois, prolongeable de deux mois si la demande est complexe ou nombreuse, avec information dans le premier mois (article 12, paragraphe 3).
3. **Une demande est une opération transversale.** Elle traverse toutes les copies de la donnée.
4. **L'identité se vérifie.** En cas de doute raisonnable, le responsable peut demander des informations supplémentaires (article 12, paragraphe 6).
5. **Les droits ont des exceptions.** Conservation obligatoire, droits d'autrui, demandes manifestement infondées ou excessives.
6. **Un consentement se prouve.** Par un enregistrement : qui, pour quoi, quand, sous quel texte.
7. **Un consentement se retire aussi facilement qu'il se donne.** Et le retrait se propage.

#### Vocabulaire essentiel

- **Demande d'accès** (*data subject access request*, DSAR) : demande d'une personne d'obtenir ses données ou d'exercer un autre droit.
- **Droit d'accès** (*right of access*) : article 15.
- **Droit de rectification** (*right to rectification*) : article 16.
- **Droit à l'effacement** (*right to erasure*) : article 17.
- **Droit à la limitation du traitement** (*right to restriction*) : article 18.
- **Droit à la portabilité** (*right to data portability*) : article 20.
- **Droit d'opposition** (*right to object*) : article 21.
- **Décision automatisée** (*automated decision-making*) : article 22.
- **Preuve de consentement** (*consent record*) : enregistrement de l'accord, de sa finalité, de sa date et du texte présenté.

#### Relations de cause à effet

- Aucune cartographie des données : la réponse à une demande d'accès oublie l'entrepôt, les fichiers et les sauvegardes.
- Aucune vérification d'identité : on transmet les données d'une personne à une autre.
- L'export d'accès contient des données d'autres personnes : une fuite par la réponse.
- L'effacement ne s'applique qu'à la base : index et copies restent trouvables.
- Aucun registre des consentements : on ne peut pas prouver l'accord, et le consentement perd sa valeur.

#### Idées reçues

- **« Le consentement est la base légale par défaut. »** Non. Le RGPD, article 6, en liste six : consentement, contrat, obligation légale, intérêts vitaux, mission d'intérêt public, intérêts légitimes. Le consentement n'est requis que lorsque aucune autre base ne convient.
- **« La plateforme répond directement aux personnes. »** Pas pour les données traitées pour le compte d'un tenant : elle transmet au tenant, responsable, sauf instruction contraire.
- **« L'effacement s'applique toujours. »** Non. L'article 17, paragraphe 3, prévoit des exceptions, dont une obligation légale et la défense de droits en justice (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

#### Principe clé

Chaque droit est une opération de bout en bout sur toutes les copies, dans un délai, avec une identité vérifiée et une trace ; chaque consentement est un enregistrement prouvable, par finalité, que l'on peut retirer.

#### Si vous ne retenez que trois choses

1. Le délai court dès la réception : un mois, prolongeable dans des conditions précises.
2. La demande traverse toutes les copies : l'inventaire dit où chercher, la conservation et les droits d'autrui disent quoi refuser.
3. Un consentement est un enregistrement par finalité, avec le texte présenté, et son retrait est aussi simple que son octroi.

### 3. Explication technique détaillée

#### Les droits et leurs opérations

Le chapitre III du RGPD est intitulé « Droits de la personne concernée » et comprend, parmi ses articles : l'information (13 et 14), l'accès (15), la rectification (16), l'effacement (17), la limitation (18), l'obligation de notification (19), la portabilité (20), l'opposition (21) et les décisions automatisées (22).

| Droit | Article | Opération dans la plateforme | Point d'attention |
|---|---|---|---|
| Information | 13, 14 | Avis présenté à la collecte, version tracée | Conserver la version présentée |
| Accès | 15 | Export de toutes les données de la personne, et des informations sur le traitement | Ne pas exposer les données d'autres personnes |
| Rectification | 16 | Correction, propagée aux copies et aux destinataires | Historique conservé (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)) |
| Effacement | 17 | Suppression ou anonymisation sur toutes les copies | Exceptions et gel légal (voir [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) |
| Limitation | 18 | Drapeau « traitement limité » : la donnée est conservée mais n'est plus utilisée | Tous les traitements doivent lire le drapeau |
| Notification | 19 | Informer les destinataires d'une rectification, d'un effacement ou d'une limitation | Inclut les sous-traitants ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) |
| Portabilité | 20 | Export structuré, couramment utilisé, lisible par machine (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)) | Limité aux données fournies par la personne, selon la base |
| Opposition | 21 | Arrêt des traitements concernés, dont la prospection (voir [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages)) | Propager aux listes et aux flux |
| Décision automatisée | 22 | Intervention humaine, explication de la décision (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) | Concerne les décisions à effet significatif |

La colonne « Opération » est une mise en œuvre possible, pas une exigence du texte.

#### Le traitement d'une demande

```text
réception ─► qualification ─► identité vérifiée ─► localisation (inventaire) ─► exécution par système ─► contrôle ─► réponse ─► clôture
   │              │                  │                                              │
   │              │                  └─ doute : informations supplémentaires        └─ en parallèle, tâches idempotentes
   │              └─ droit visé, personne, responsable
   └─ horloge : un mois
```

```sql
CREATE TABLE data_subject_request (
  tenant_id       uuid        NOT NULL,
  id              uuid        NOT NULL,
  request_type    text        NOT NULL CHECK (request_type IN
                    ('access','rectification','erasure','restriction','portability','objection','automated_decision')),
  subject_ref     text        NOT NULL,
  received_at     timestamptz NOT NULL,
  due_at          timestamptz NOT NULL,
  extended_until  timestamptz,
  status          text        NOT NULL CHECK (status IN
                    ('received','identity_pending','in_progress','completed','refused')),
  identity_verified_at timestamptz,
  decision_note   text,
  completed_at    timestamptz,
  PRIMARY KEY (tenant_id, id)
);

SELECT id, request_type, coalesce(extended_until, due_at) AS deadline
  FROM data_subject_request
 WHERE tenant_id = $1
   AND status NOT IN ('completed','refused')
   AND coalesce(extended_until, due_at) < now() + interval '7 days'
 ORDER BY deadline;
```

Le **délai** est d'un mois à compter de la réception ; il peut être prolongé de deux mois si nécessaire, compte tenu de la complexité et du nombre de demandes, et la personne en est informée, avec les motifs, dans le premier mois. Pour une demande reçue le 13 octobre 2026, l'échéance est le 13 novembre 2026 ; une prolongation reporterait la limite au 13 janvier 2027. Les informations sont en principe gratuites ; pour des demandes manifestement infondées ou excessives, le responsable peut exiger des frais raisonnables ou refuser d'agir, et doit pouvoir démontrer ce caractère (article 12, paragraphe 5).

**Localiser.** L'inventaire ([20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) liste les emplacements : base, fichiers ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)), index ([19.1 Index de recherche et index inversé](19-recherche-analytique-restitution.md#191-index-de-recherche-et-index-inversé)), entrepôt ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)), journaux, sauvegardes, tiers. Chaque emplacement a un **connecteur de demande** : « chercher les données de cette personne », « corriger », « supprimer ou anonymiser », « limiter ». La plateforme orchestre ces tâches comme un processus à compensation ([7.11 Saga](07-evenements-automatisation.md#711-saga)), chacune idempotente ([3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

**Répondre à un accès.**

- l'export est un paquet structuré (JSON ou CSV), accompagné des informations de traitement : finalités, destinataires, durées ;
- les **données d'autres personnes** en sont retirées ou masquées (un commentaire qui mentionne un collègue) ;
- le paquet est remis par un lien contrôlé et expirant ([18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)), après nouvelle vérification d'identité ;
- la demande et la remise sont journalisées ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).

**Effacer.** La demande est confrontée au calendrier et aux exceptions ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation), [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) : suppression complète, suppression partielle avec limitation du reste, ou refus motivé. Les sauvegardes expirent selon leur propre durée, et un journal de suppressions est rejoué après toute restauration ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)). Les destinataires et sous-traitants sont informés (article 19, [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)).

**Limiter.** Le drapeau de limitation est lu par tous les traitements : tâches planifiées, exports, rapports, notifications. Une donnée limitée reste stockée, mais n'est plus utilisée, sauf pour les cas que la loi permet.

#### Le rôle de la plateforme

| Situation | Conduite |
|---|---|
| Une personne écrit à la plateforme au sujet de données qu'elle traite pour un tenant | Transmettre au tenant, responsable, dans un délai court, sauf instruction contraire |
| Le tenant demande de l'aide | Fournir les outils : recherche par personne, export, effacement orchestré |
| Une personne est cliente directe de la plateforme | La plateforme est responsable pour ses propres traitements : elle répond |
| Une demande vise plusieurs tenants | Chaque tenant est responsable de son périmètre |

Le contrat de sous-traitance exige que le sous-traitant aide le responsable à répondre aux demandes des personnes (article 28, paragraphe 3, point e).

#### Gérer le consentement

Le RGPD définit le consentement comme une manifestation de volonté libre, spécifique, éclairée et univoque, par une déclaration ou un acte positif clair (article 4, point 11). Le responsable doit pouvoir démontrer qu'il a été donné, et son retrait doit être aussi simple que son octroi (article 7). Voir aussi [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages) pour l'effet sur les messages.

```json
{
  "consent_id": "cns_9001",
  "subject": "ext_341",
  "purpose": "product_newsletter",
  "status": "granted",
  "granted_at": "2026-09-02T10:15:00Z",
  "text_version": "newsletter-v3",
  "channel": "web_form",
  "evidence": { "form_id": "frm_newsletter", "page_version": "2026-08-30" },
  "withdrawn_at": null
}
```

```sql
CREATE TABLE consent_record (
  tenant_id     uuid        NOT NULL,
  id            uuid        NOT NULL,
  subject_ref   text        NOT NULL,
  purpose       text        NOT NULL,
  text_version  text        NOT NULL,
  status        text        NOT NULL CHECK (status IN ('granted','withdrawn')),
  occurred_at   timestamptz NOT NULL,
  channel       text        NOT NULL,
  evidence      jsonb       NOT NULL DEFAULT '{}',
  PRIMARY KEY (tenant_id, id)
);

SELECT DISTINCT ON (subject_ref, purpose)
       subject_ref, purpose, status, occurred_at
  FROM consent_record
 WHERE tenant_id = $1
 ORDER BY subject_ref, purpose, occurred_at DESC;
```

Le registre est **en ajout seul** : un retrait est une nouvelle ligne, pas une modification. L'état courant est la dernière ligne par personne et finalité.

| Règle | Mise en œuvre |
|---|---|
| Finalité précise | Un consentement par finalité, pas un consentement global |
| Texte versionné | La version du texte présenté est enregistrée |
| Preuve | Date, canal, éléments de contexte conservés |
| Retrait simple | Même effort que l'octroi ; effet immédiat sur les traitements |
| Application | Les traitements lisent l'état courant avant d'agir ; les files ne diffusent pas après retrait |
| Réexamen | Le consentement se renouvelle quand la finalité ou le texte change |

#### Modes de défaillance

- **Demande perdue** dans une boîte partagée.
- **Délai manqué** : pas d'horloge, pas d'alerte.
- **Identité non vérifiée** : divulgation à un tiers.
- **Effacement partiel** : copies oubliées.
- **Export qui expose d'autres personnes.**
- **Consentement sans preuve** ou impossible à retirer.
- **Retrait non propagé** : on continue d'envoyer.

**Contre-exemple.** Une personne demande l'effacement de ses données. La base est nettoyée, mais l'index de recherche, l'entrepôt et les listes d'envoi de courriels ne le sont pas. Trois semaines plus tard, elle reçoit une campagne. Elle saisit l'autorité de contrôle : l'organisation ne peut montrer ni la liste des emplacements, ni la preuve de l'effacement.

**Limites.** La qualification d'un refus est un jugement juridique. Certaines données sont mêlées à celles d'autres personnes. Les sauvegardes conservent les données jusqu'à leur expiration. Et la vérification d'identité d'une personne qui n'a pas de compte est difficile : elle se règle selon le risque.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | L'inventaire dit où chercher les données de la personne |
| [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | Les finalités et bases légales du registre précisent ce qui est dû |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Le calendrier de conservation s'oppose ou se compose à l'effacement |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | Les mécanismes de suppression, gel légal et preuve |
| [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages) | Le consentement et le désabonnement pour les messages |
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'export de portabilité s'appuie sur l'import et l'export |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Rectifier et effacer dans les révisions |
| [7.11 Saga](07-evenements-automatisation.md#711-saga) | Une demande est un processus en plusieurs étapes avec compensation |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les sous-traitants sont informés et assistent |

### 5. Application pratique

**Situation initiale.** Alpha Air reçoit des demandes d'accès par courriel, traitées à la main par le support. Une demande a dépassé le délai, et une autre a livré à un homonyme un export qui ne le concernait pas.

**Problème.** Aucun processus, aucune vérification d'identité systématique, aucune orchestration entre systèmes.

**Application du concept.** La plateforme introduit un registre des demandes, un parcours avec horloge, des connecteurs par emplacement et un registre de consentements.

**Déroulé.**

1. La demande est enregistrée à sa réception, avec une échéance à un mois.
2. L'identité est vérifiée par un lien envoyé à l'adresse connue et une question complémentaire.
3. L'inventaire désigne six emplacements ; chacun reçoit une tâche « rechercher » puis « exporter ».
4. L'export retire les données d'autres personnes, puis est mis à disposition par un lien de 7 jours.
5. La personne demande ensuite l'effacement : deux emplacements sont soumis à conservation obligatoire, les autres sont purgés, et la réponse motive les deux exceptions.

**Résultat.** Les demandes sont traitées dans les délais, avec trace, et les refus sont motivés.

**Limites.** Les sauvegardes expirent sous 35 jours (valeur d'exemple) : la réponse l'indique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quel délai s'applique à la réponse à une demande d'une personne, et peut-il être prolongé ?
2. **Compréhension.** Pourquoi la demande d'une personne est-elle une opération transversale ?
3. **Compréhension.** Que doit contenir la preuve d'un consentement ?
4. **Pourquoi.** Pourquoi le registre des consentements est-il en ajout seul ?
5. **Raisonnement pratique.** Une demande est reçue le 31 janvier. Quelle est l'échéance d'un mois, et que faire si la demande est complexe ?

#### Réponses

1. Un mois à compter de la réception ; il peut être prolongé de deux mois si la complexité ou le nombre de demandes l'exige, à condition d'informer la personne, avec les motifs, dans le premier mois.
2. Parce que les données de la personne se trouvent dans de nombreux emplacements : base, fichiers, index, entrepôt, journaux, sauvegardes, tiers. Une réponse complète exige de les traiter tous.
3. La personne, la finalité précise, la date, le canal, la version du texte présenté, et les éléments de contexte, ainsi que l'éventuel retrait.
4. Parce que l'historique des accords et des retraits est lui-même une preuve : modifier une ligne effacerait ce qu'il faut démontrer. L'état courant se déduit de la dernière ligne.
5. Comme février n'a pas de 31, la règle usuelle retient le dernier jour du mois suivant (28 ou 29 février selon l'année) ; le mode de calcul exact des délais se confirme avec le service juridique. Si la demande est complexe, on informe la personne dans le mois de la prolongation de deux mois et de ses motifs.

## 20.5 Catalogue de données, lignage et qualité des données

### 1. Comprendre simplement

Le **catalogue de données** (*data catalog*) est un répertoire consultable des jeux de données d'une organisation : ce qu'ils contiennent, qui en répond, d'où ils viennent, comment les utiliser. Le **lignage** (*data lineage*) retrace le chemin d'une donnée : de ses sources, par les transformations, jusqu'aux rapports et aux usages. La **qualité des données** (*data quality*) mesure si une donnée est adaptée à l'usage : complète, valide, unique, à jour, exacte, cohérente.

**Pourquoi cela existe.** À mesure que les données se multiplient (base, entrepôt, index, rapports), personne ne sait plus ce qui existe, d'où cela vient, ni si l'on peut s'y fier. Un changement de champ casse trois rapports sans que l'auteur le sache. Un chiffre est contesté et personne ne retrouve son origine. Le catalogue, le lignage et la qualité y répondent.

**Problème résolu.** Retrouver les données utiles, comprendre leur origine et leurs usages, mesurer leur fiabilité, et évaluer l'effet d'un changement avant de le faire.

**Modèle mental.** Le catalogue d'une bibliothèque, avec, pour chaque livre, ses sources (la bibliographie), son état (rayures, pages manquantes) et son responsable.

**Où l'analogie s'arrête.** Un livre ne change pas. Un jeu de données évolue chaque minute, ses sources changent, et sa qualité se dégrade silencieusement : on la surveille.

**Exemple.** Un responsable qualité cherche « constats ouverts par base ». Le catalogue renvoie le jeu `analytics.finding_current`, décrit en termes métier, avec son propriétaire, sa classification, sa fraîcheur et son score de qualité. Le lignage montre qu'il vient de `raw.finding_changes` et alimente deux tableaux de bord. Avant de renommer le champ `base`, l'équipe consulte le lignage et trouve les trois objets qui en dépendent.

**Les composants.**

1. le **catalogue** : actifs, descriptions, propriétaires, classes ;
2. la **collecte automatique** de métadonnées ;
3. le **glossaire métier** : termes et définitions ;
4. le **lignage** : graphe des dépendances, au niveau des jeux et des colonnes ;
5. les **règles de qualité** et leurs mesures ;
6. les **seuils** et alertes ;
7. l'**analyse d'impact** ;
8. les **intendants de données** (*data stewards*).

**Objectif d'apprentissage :** vous pouvez décrire ce que contient un catalogue, expliquer comment le lignage permet l'analyse d'impact, et mesurer la qualité d'un jeu par des règles.

### 2. Connaissances essentielles

#### Définition

- **Catalogue de données** : répertoire des actifs de données avec leurs métadonnées techniques et métier (description, propriétaire, classification, qualité, usage), pour les retrouver et les comprendre.
- **Lignage des données** : description des dépendances entre jeux de données, tâches et consommateurs, qui retrace l'origine et le devenir d'une donnée.
- **Qualité des données** : degré d'adéquation d'une donnée à son usage, mesuré selon des dimensions telles que l'exactitude, la complétude, la cohérence, l'actualité, l'unicité et la validité.

#### Idées fondamentales

1. **Une donnée qu'on ne trouve pas n'existe pas.** Le catalogue la rend découvrable.
2. **Le catalogue se nourrit automatiquement.** Une saisie manuelle se périme.
3. **Le lignage répond à deux questions.** D'où ça vient ; qui en dépend.
4. **La qualité est relative à un usage.** Un même jeu peut être bon pour l'un et inadapté à l'autre.
5. **La qualité se mesure par des règles.** Chaque règle a une dimension, un seuil, un propriétaire.
6. **On vérifie là où l'erreur entre.** À l'écriture, au chargement, à la consommation.
7. **Un propriétaire répond.** Un jeu sans responsable se dégrade.

#### Vocabulaire essentiel

- **Actif de données** (*data asset*) : jeu de données, table, champ, rapport, indicateur.
- **Glossaire métier** (*business glossary*) : dictionnaire des termes du métier, avec leurs définitions.
- **Intendant de données** (*data steward*) : personne chargée de la qualité et de la bonne utilisation d'un domaine de données.
- **Lignage de colonne** (*column-level lineage*) : dépendance suivie champ par champ.
- **Analyse d'impact** (*impact analysis*) : recherche de ce qui est touché par un changement.
- **Dimension de qualité** (*data quality dimension*) : axe de mesure de la qualité.
- **Score de qualité** (*quality score*) : synthèse chiffrée de règles passées ou échouées.

#### Relations de cause à effet

- Aucun catalogue : les équipes recréent des jeux qui existent déjà, avec des définitions différentes.
- Aucun lignage : un changement de colonne casse des rapports découverts par les utilisateurs.
- La qualité n'est pas mesurée : une dégradation (valeurs nulles, doublons, retards) est découverte par les décisions erronées.
- Le catalogue est saisi à la main : il se périme en quelques semaines.
- Une règle n'a pas de seuil ni de propriétaire : l'alerte n'a pas de destinataire.

#### Idées reçues

- **« Un catalogue est un projet d'outillage. »** Non. L'outil est secondaire ; sans propriétaires, glossaire et conventions, il reste vide.
- **« Le lignage sert seulement à la conformité. »** Non. Il sert d'abord à l'ingénierie : impact, diagnostic, rapport.
- **« Une bonne qualité est une qualité parfaite. »** Non. On fixe un niveau adapté à l'usage et on le mesure.

#### Principe clé

On décrit les données dans un catalogue alimenté automatiquement, on trace leur circulation dans un lignage exploitable, et on mesure leur qualité par des règles, avec des propriétaires et des seuils.

#### Si vous ne retenez que trois choses

1. Le catalogue rend les données découvrables, décrites et attribuées ; il se remplit surtout automatiquement.
2. Le lignage dit d'où vient une donnée et qui en dépend : c'est la base de l'analyse d'impact.
3. La qualité se mesure par des règles par dimension, avec des seuils, et se rattache à un usage.

### 3. Explication technique détaillée

#### Le catalogue

| Information | Origine |
|---|---|
| Nom technique, schéma, colonnes, types | Collecte automatique (base, entrepôt) |
| Description métier, termes du glossaire | Intendant de données |
| Propriétaire, contacts | Désigné |
| Classification et catégories | Inventaire ([20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) |
| Finalités | Registre ([20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités)) |
| Fraîcheur | Marque de progression du chargement ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt), [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |
| Qualité | Résultats des règles |
| Usage | Journaux de requêtes, tableaux de bord, rapports |

Dans une plateforme pilotée par les métadonnées, une grande part du catalogue est **déjà là** : les types, les champs, les relations et les classes sont décrits (voir [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)). Le catalogue y ajoute l'entrepôt, les agrégats ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](19-recherche-analytique-restitution.md#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)) et les indicateurs de la couche sémantique ([19.8 Modélisation dimensionnelle et couche sémantique](19-recherche-analytique-restitution.md#198-modélisation-dimensionnelle-et-couche-sémantique)).

**Multi-tenant.** Chaque tenant voit son catalogue. Les actifs fournis par la plateforme sont communs, avec leurs descriptions ; les champs personnalisés ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)) y apparaissent avec les descriptions du tenant. Aucun actif d'un tenant n'est visible d'un autre.

#### Le lignage

Le lignage est un **graphe orienté** : des nœuds (jeux de données, tâches, rapports) et des arêtes (« A alimente B »).

```text
base transactionnelle ─► raw.finding_changes ─► analytics.finding_current ─► mv_findings_by_base_month ─► tableau « qualité »
                                                           │
                                                           └──► rapport « constats par base » (hebdomadaire)
```

| Niveau | Contenu | Usage |
|---|---|---|
| Jeux de données | Quel jeu alimente quel jeu | Vue d'ensemble, planification |
| Colonnes | Quel champ vient de quels champs | Impact d'un renommage, suivi des données personnelles |
| Exécutions | Quelle exécution a produit quelle sortie, quand | Diagnostic, reproductibilité ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |

L'initiative **OpenLineage** propose un standard ouvert de métadonnées de lignage : elle modélise des jeux de données, des tâches et des exécutions, enrichis par des facettes, et définit une spécification pour que les outils échangent ces informations. Les événements de lignage sont émis par les tâches de chargement et de transformation.

```json
{
  "event_time": "2026-10-14T06:00:12Z",
  "job": "elt.findings_current",
  "run_id": "run_8841",
  "inputs": [
    { "dataset": "raw.finding_changes", "columns": ["id", "status", "severity", "base", "revision"] }
  ],
  "outputs": [
    { "dataset": "analytics.finding_current" }
  ],
  "status": "complete"
}
```

*Le format de cet exemple est simplifié et propre à la plateforme fictive ; il s'inspire des notions de tâche, d'exécution et de jeu de données.*

**Analyse d'impact.** Les arêtes se stockent et se parcourent :

```sql
WITH RECURSIVE downstream AS (
  SELECT target_dataset, 1 AS depth
    FROM lineage_edge
   WHERE tenant_id = $1
     AND source_dataset = $2
  UNION
  SELECT e.target_dataset, d.depth + 1
    FROM lineage_edge e
    JOIN downstream d ON e.source_dataset = d.target_dataset
   WHERE e.tenant_id = $1
     AND d.depth < 10
)
SELECT DISTINCT target_dataset
  FROM downstream;
```

La requête liste tout ce qui dépend, directement ou non, d'un jeu de données : c'est la liste des objets à prévenir ou à tester avant un changement (voir [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact)). La profondeur est bornée pour éviter une boucle sur un graphe cyclique.

**Pour la conformité.** Le lignage de colonne montre où va une donnée personnelle : une demande d'effacement ([20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement)) ou un audit s'appuie sur lui pour ne rien oublier.

#### La qualité

Six dimensions sont couramment retenues, issues d'un groupe de travail de DAMA UK de 2013 que le cadre qualité de données du gouvernement britannique a adoptées : exactitude, complétude, cohérence, actualité, unicité, validité. Le même constat précise qu'il n'y a pas d'accord universel : la norme ISO/IEC 25012 propose un modèle plus large de 15 caractéristiques.

| Dimension | Question | Règle type |
|---|---|---|
| Exactitude | La valeur correspond-elle à la réalité ? | Comparaison à une référence ou à un échantillon vérifié |
| Complétude | Les valeurs attendues sont-elles présentes ? | Part de valeurs non nulles requises |
| Cohérence | Deux sources disent-elles la même chose ? | Rapprochement entre systèmes |
| Actualité | La donnée est-elle assez récente pour l'usage ? | Âge maximal (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |
| Unicité | Chaque chose n'apparaît-elle qu'une fois ? | Absence de doublons sur la clé |
| Validité | La valeur respecte-t-elle le format et le domaine ? | Valeur parmi une liste, format, plage |

```json
{
  "dataset": "analytics.finding_current",
  "owner": "role:quality_manager",
  "rules": [
    { "id": "q1", "dimension": "completeness", "field": "base", "threshold_pct": 99.5 },
    { "id": "q2", "dimension": "uniqueness", "key": ["tenant_id", "finding_id"], "max_duplicates": 0 },
    { "id": "q3", "dimension": "validity", "field": "severity", "allowed": ["minor", "major", "critical"] },
    { "id": "q4", "dimension": "timeliness", "field": "loaded_at", "max_age_minutes": 15 }
  ],
  "on_failure": { "severity": "warning", "notify": "role:data_steward", "block_publication": false }
}
```

```sql
SELECT count(*) AS total,
       count(*) FILTER (WHERE base IS NOT NULL) * 100.0 / count(*) AS completeness_pct,
       count(*) - count(DISTINCT finding_id) AS duplicate_rows,
       count(*) FILTER (WHERE severity NOT IN ('minor','major','critical')) AS invalid_severity,
       max(loaded_at) AS newest_load
  FROM analytics.finding_current
 WHERE tenant_id = $1;
```

Sur un jeu de 12 480 lignes dont 37 sans base, la complétude vaut $(12\,480 - 37) / 12\,480 \approx 99{,}70\ \%$ : au-dessus du seuil de 99,5 %.

**Où contrôler.**

| Point | Contrôle | Exemple |
|---|---|---|
| À l'écriture | Validation à la saisie ([2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)) | Gravité parmi une liste |
| Au chargement | Règles avant publication ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)) | Doublons, nulls inattendus |
| À la consommation | Surveillance des jeux publiés | Fraîcheur, volumes |
| Aux frontières | Contrats de données ([20.6 Données de référence et contrat de données](#206-données-de-référence-et-contrat-de-données)) | Schéma attendu par les consommateurs |

Un échec peut **bloquer la publication** (jeu non publié, ancienne version conservée) ou **avertir**. Le choix dépend de l'usage : un rapport réglementaire bloque, un tableau de bord exploratoire avertit.

**Score et tendance.** Un score synthétique (part de règles passées, pondérée) se suit dans le temps. La tendance compte plus que la valeur : une chute soudaine signale un incident.

#### Les rôles

| Rôle | Responsabilité |
|---|---|
| Propriétaire de données | Décide de la classe, des usages, des niveaux de qualité attendus |
| Intendant de données | Tient les définitions, traite les anomalies de qualité |
| Producteur | Alimente le jeu et respecte le contrat |
| Consommateur | Déclare ses usages, signale les écarts |

#### Modes de défaillance

- **Catalogue saisi à la main** : périmé.
- **Descriptions techniques seulement** : illisibles par le métier.
- **Lignage incomplet** : l'analyse d'impact oublie des consommateurs.
- **Règles sans propriétaire** : alertes ignorées.
- **Qualité mesurée seulement à la fin** : l'erreur est ancienne et diffusée.
- **Seuils irréalistes** : fatigue d'alertes.
- **Définitions divergentes** : même terme, deux sens.

**Contre-exemple.** Un renommage du champ `base` en `home_base` est déployé un vendredi. Trois tableaux de bord et un rapport planifié cassent. Personne ne savait qu'ils en dépendaient : il n'existait pas de lignage. L'analyse d'impact aurait listé les quatre objets avant le déploiement.

**Limites.** Le lignage automatique est difficile pour les transformations écrites en code arbitraire. La qualité exacte (par rapport à la réalité) est coûteuse à mesurer ; on mesure surtout des propriétés internes. Un catalogue riche ne remplace ni la conception des données ni la responsabilité des propriétaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | L'inventaire alimente le catalogue en classes et propriétaires |
| [20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement) | Le lignage localise les données d'une personne |
| [20.6 Données de référence et contrat de données](#206-données-de-référence-et-contrat-de-données) | Le contrat de données fixe schéma et qualité attendue |
| [19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt) | Les chargements émettent le lignage et passent les règles |
| [19.8 Modélisation dimensionnelle et couche sémantique](19-recherche-analytique-restitution.md#198-modélisation-dimensionnelle-et-couche-sémantique) | La couche sémantique est un actif du catalogue |
| [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres) | La fraîcheur et la reproductibilité s'appuient sur lignage et exécutions |
| [2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles) | Les métadonnées de la plateforme sont la première source du catalogue |
| [12.15 Conscience de l'impact](12-produit-ux.md#1215-conscience-de-limpact) | L'analyse d'impact des changements |
| [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données) | La validation à l'écriture est la première ligne de qualité |

### 5. Application pratique

**Situation initiale.** Alpha Air a un entrepôt de 120 tables. Les analystes en créent de nouvelles sans en parler, plusieurs tableaux de bord donnent des chiffres différents, et un changement de colonne a cassé un rapport pour le conseil.

**Problème.** Aucune visibilité sur les jeux, leurs origines ni leur fiabilité.

**Application du concept.** La plateforme met en place un catalogue alimenté automatiquement, un lignage par événements et des règles de qualité par jeu.

**Déroulé.**

1. Les métadonnées de la base et de l'entrepôt alimentent le catalogue ; chaque jeu reçoit un propriétaire et une description.
2. Les tâches de transformation émettent des événements de lignage ; le graphe est exploitable par requête.
3. Les jeux publiés reçoivent quatre à six règles ; les chargements qui violent une règle critique ne sont pas publiés.
4. Avant tout renommage, l'équipe lance l'analyse d'impact : quatre objets dépendants sont identifiés et mis à jour.
5. Le score de qualité du jeu des constats passe de 92 % à 99 % en deux mois.

**Résultat.** Les équipes retrouvent les jeux, mesurent leur fiabilité et évaluent l'effet des changements.

**Limites.** Le lignage de colonne n'est complet que pour les transformations décrites en SQL déclaratif ; les scripts libres restent à documenter.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que contient un catalogue de données, et d'où viennent ses informations ?
2. **Compréhension.** À quelles deux questions le lignage répond-il ?
3. **Compréhension.** Citez les six dimensions de qualité couramment retenues.
4. **Pourquoi.** Pourquoi la qualité se définit-elle par rapport à un usage ?
5. **Raisonnement pratique.** Un jeu de 8 000 lignes contient 120 valeurs de `base` nulles. Le seuil de complétude est 98,5 %. La règle est-elle respectée ?

#### Réponses

1. Les actifs de données avec leurs descriptions techniques et métier, propriétaires, classes, finalités, fraîcheur, qualité et usages. Elles viennent de la collecte automatique des métadonnées, de l'inventaire, du registre, des chargements, et des intendants pour les descriptions.
2. D'où vient une donnée (amont) et qui en dépend (aval). La première sert au diagnostic ; la seconde, à l'analyse d'impact.
3. Exactitude, complétude, cohérence, actualité, unicité et validité.
4. Parce qu'un même jeu peut être suffisant pour un usage et inadapté à un autre : un retard de 24 heures est négligeable pour un rapport mensuel, bloquant pour un tableau de bord opérationnel.
5. $(8\,000 - 120) / 8\,000 = 98{,}5\ \%$ : le seuil est atteint tout juste. La règle est respectée si elle est « supérieure ou égale » ; on surveille la tendance, car la moindre dégradation la ferait échouer.

## 20.6 Données de référence et contrat de données

### 1. Comprendre simplement

Les **données de référence** (*reference data*) sont des listes de valeurs stables et partagées qui donnent un sens commun aux autres données : types d'aéronefs, codes de gravité, pays, devises. Les **données maîtres** (*master data*) décrivent les entités centrales de l'organisation, partagées entre systèmes : aéronefs, clients, fournisseurs, pièces. L'ensemble forme la fonction *master data and reference data*. Un **contrat de données** (*data contract*) est un accord explicite entre le producteur et les consommateurs d'un jeu de données, sur sa structure, sa signification, sa qualité, ses délais et sa gestion des changements.

**Pourquoi cela existe.** Quand trois systèmes décrivent le même aéronef avec trois immatriculations différentes, ou que « critique » signifie des choses différentes, tout croisement devient une enquête. Et quand un producteur change un champ sans prévenir, ses consommateurs cassent. Les données de référence et maîtres stabilisent le vocabulaire ; le contrat stabilise la relation.

**Problème résolu.** Parler des mêmes choses avec les mêmes mots entre systèmes, et faire évoluer un jeu de données sans casser ceux qui s'en servent.

**Modèle mental.** Un dictionnaire commun et un bon de livraison. Le dictionnaire (référence) fixe le sens des mots ; la fiche d'identité de chaque grande entité (maître) évite les doublons ; le bon de livraison (contrat) dit ce qui est livré, dans quel état, à quelle fréquence.

**Où l'analogie s'arrête.** Un dictionnaire papier est figé. Les valeurs de référence évoluent (un nouveau code, un retrait), et il faut garder l'historique de ce qu'elles voulaient dire à chaque date.

**Exemple.** La liste de gravité (`minor`, `major`, `critical`) est une donnée de référence, fournie par la plateforme et réutilisée par les constats, les tâches et les rapports. L'aéronef F-ABCD est une donnée maître : l'ERP, le système de navigabilité et la plateforme en parlent. Le jeu `analytics.finding_current` est livré aux tableaux de bord par un contrat qui précise ses champs, sa fraîcheur de 15 minutes et un préavis de 30 jours avant tout changement incompatible.

**Les composants.**

1. les **listes de référence**, versionnées et datées ;
2. les **données maîtres** et leur **enregistrement de référence** ;
3. les **règles de rapprochement** et de **survie** des valeurs ;
4. le **propriétaire** de chaque domaine ;
5. le **contrat de données** : structure, sémantique, qualité, niveaux de service ;
6. la **gestion des changements** : version, préavis, dépréciation ;
7. le **contrôle automatisé** du respect du contrat.

**Objectif d'apprentissage :** vous pouvez distinguer donnée de référence, donnée maître et donnée transactionnelle, décrire le contenu d'un contrat de données, et expliquer comment il protège les consommateurs d'un changement.

### 2. Connaissances essentielles

#### Définition

- **Données de référence** : valeurs stables et partagées, souvent des listes de codes, qui qualifient les autres données.
- **Données maîtres** : données décrivant les entités métier centrales et partagées, avec un enregistrement de référence par entité.
- **Contrat de données** : spécification, convenue entre producteur et consommateurs, de la structure, de la signification, de la qualité, des niveaux de service et des règles de changement d'un jeu de données.

#### Idées fondamentales

1. **Un sens partagé a un propriétaire.** Une liste ou une entité sans responsable se fragmente.
2. **Les références évoluent.** Elles ont des versions, des dates de validité et des remplacements.
3. **Une entité a un enregistrement de référence.** Les doublons se rapprochent ; les conflits se tranchent par des règles de survie.
4. **Un système d'origine fait autorité.** Les autres en reçoivent une copie (voir [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)).
5. **Un contrat est explicite.** Il ne se déduit pas de ce qu'un producteur publie « d'habitude ».
6. **Un contrat se vérifie par la machine.** Un contrat non testé est un vœu.
7. **Les changements se gèrent.** Version, préavis, période de transition.

#### Vocabulaire essentiel

- **Liste de référence** (*reference list*, *code list*) : ensemble de valeurs autorisées pour un champ.
- **Enregistrement de référence** (*golden record*) : version retenue de l'entité, issue du rapprochement des sources.
- **Rapprochement** (*matching*) : identification des enregistrements qui désignent la même entité.
- **Règle de survie** (*survivorship rule*) : règle qui choisit, entre des valeurs en conflit, celle que l'on retient.
- **Gestion des données maîtres** (*master data management*, MDM) : discipline et outils qui tiennent les enregistrements de référence.
- **Producteur et consommateur** (*producer*, *consumer*) : celui qui publie un jeu, ceux qui l'utilisent.
- **Changement incompatible** (*breaking change*) : modification qui casse des consommateurs existants.

#### Relations de cause à effet

- Les listes de valeurs sont recopiées dans chaque système : elles divergent, et les rapprochements échouent.
- Une entité n'a pas d'enregistrement de référence : les doublons faussent les décomptes.
- Un producteur renomme un champ sans prévenir : les consommateurs cassent, et personne ne sait qui prévenir.
- Un contrat est écrit sans tests : la réalité s'en écarte en silence.
- Une valeur de référence est retirée sans remplacement : les anciens enregistrements deviennent illisibles.

#### Idées reçues

- **« Les données de référence sont des détails techniques. »** Non. Elles portent la compréhension commune ; une erreur s'y répercute partout.
- **« Un contrat de données est un document juridique. »** Non. C'est un accord technique et fonctionnel, souvent en un format lisible par une machine.
- **« Un schéma suffit comme contrat. »** Non. Le schéma dit la forme ; le contrat dit aussi la signification, la qualité, la fraîcheur et la gestion des changements.

#### Principe clé

Les références et les entités centrales ont un propriétaire, des versions et un enregistrement de référence ; chaque jeu partagé a un contrat explicite, vérifié par la machine, qui encadre ses changements.

#### Si vous ne retenez que trois choses

1. Référence, maître et transactionnel sont trois natures de données avec des règles différentes de gouvernance.
2. Un contrat de données couvre structure, signification, qualité, niveaux de service et changements.
3. Un contrat se teste automatiquement, et un changement incompatible demande version et préavis.

### 3. Explication technique détaillée

#### Trois natures de données

| Nature | Exemple | Volume | Changement | Gouvernance |
|---|---|---|---|---|
| Référence | Gravités, types d'aéronef, pays | Petit | Rare, daté | Propriétaire de la liste, versions, dates de validité |
| Maître | Aéronef, client, fournisseur, pièce | Moyen | Occasionnel | Enregistrement de référence, rapprochement, survie |
| Transactionnelle | Constat, tâche, vol | Grand | Constant | Droits, cycle de vie, rétention |

#### Données de référence

```sql
CREATE TABLE reference_value (
  tenant_id    uuid NOT NULL,
  list_code    text NOT NULL,
  value_code   text NOT NULL,
  label_fr     text NOT NULL,
  valid_from   date NOT NULL,
  valid_to     date,
  replaced_by  text,
  PRIMARY KEY (tenant_id, list_code, value_code, valid_from)
);
```

- **Versions et dates.** Une valeur a une période de validité : une valeur retirée reste lisible pour les anciens enregistrements, avec `replaced_by` pour guider la migration.
- **Couches.** La plateforme fournit des listes par défaut ; le tenant ajoute ou masque des valeurs (voir [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) et [5.7 Configuration et personnalisation au niveau du tenant](05-multi-tenancy-modele-entreprise.md#57-configuration-et-personnalisation-au-niveau-du-tenant)) sans modifier celles de la plateforme.
- **Libellés par langue.** Le code est stable, le libellé est localisé ([25.2 Catalogue de messages, pluriels, libellés configurables et chaîne de repli](25-experiences-multi-contextes.md#252-catalogue-de-messages-pluriels-libellés-configurables-et-chaîne-de-repli)).
- **Correspondance.** Des tables de correspondance relient les codes d'un système externe aux codes de la plateforme ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs) et [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)).

#### Données maîtres

Quand plusieurs sources décrivent la même entité, on les rapproche et on retient un enregistrement de référence.

| Source | Immatriculation | Type | Base |
|---|---|---|---|
| ERP | F-ABCD | A320 | LYS |
| Navigabilité | F-ABCD | A320-214 | TLS |
| Plateforme | f-abcd | A320 | LYS |

| Étape | Principe |
|---|---|
| Normalisation | Mise en forme commune (`f-abcd` devient `F-ABCD`) |
| Rapprochement | Même immatriculation normalisée : même aéronef |
| Survie | Règle par attribut : le type vient du système de navigabilité, la base vient de la plateforme |
| Publication | L'enregistrement de référence est diffusé aux consommateurs avec son origine |
| Corrections | Une correction retourne vers le système d'origine (voir [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence)) |

Le **système d'origine** d'un attribut fait autorité ; les autres copies en dérivent. Sans règle de survie, chaque système corrige à sa manière, et les valeurs oscillent.

#### Le contrat de données

Le contrat est un document structuré, versionné, qui accompagne chaque jeu partagé. Le standard ouvert **Open Data Contract Standard** définit un contrat en YAML, indépendant des plateformes, avec des sections telles que les fondamentaux, le schéma, la qualité des données, les niveaux de service, les rôles, le support, les prix et des propriétés personnalisées.

```yaml
contract:
  name: findings_current
  version: 2.1.0
  status: active
  owner: role:quality_manager
  producer: team:platform_data
  consumers: [dashboards_quality, report_weekly_findings]
  schema:
    - field: finding_id
      type: uuid
      required: true
      primary_key: true
    - field: base
      type: string
      required: true
      reference_list: bases
    - field: severity
      type: string
      required: true
      allowed: [minor, major, critical]
    - field: closed_at
      type: timestamp
      required: false
  semantics:
    findings_open: "constat dont closed_at est nul à la date de référence"
  quality:
    - rule: "completeness(base) >= 99.5%"
    - rule: "duplicates(finding_id) = 0"
  service_levels:
    freshness_minutes: 15
    availability_pct: 99.5
  classification:
    level: confidential
    categories: [business_secret]
  changes:
    policy: "préavis de 30 jours pour tout changement incompatible"
    deprecation_period_days: 90
```

*Ce format est un exemple simplifié, inspiré des sections du standard ; il ne prétend pas s'y conformer.*

| Section | Ce qu'elle engage |
|---|---|
| Fondamentaux | Nom, version, propriétaire, statut |
| Schéma | Champs, types, obligation, clés, listes de référence |
| Sémantique | Définitions métier des champs et indicateurs |
| Qualité | Règles et seuils (voir [20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données)) |
| Niveaux de service | Fraîcheur, disponibilité (voir [19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |
| Classification | Niveau et catégories (voir [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) |
| Changements | Versions, préavis, période de transition |

#### Gérer les changements

| Type de changement | Exemple | Règle |
|---|---|---|
| Compatible | Ajout d'un champ facultatif | Version mineure, communication |
| Incompatible | Renommage, suppression, changement de type, nouvelle valeur interdite | Version majeure, préavis, période de double publication |
| Correction sans effet de forme | Meilleure qualité | Version corrective |

Un changement incompatible suit un **parcours** : annonce, publication des deux versions en parallèle, migration des consommateurs, retrait de l'ancienne. Les règles de compatibilité d'un registre de schémas formalisent ce principe pour les flux ([28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité)). Pour une API, le versionnement suit les mêmes idées ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).

#### Vérifier le contrat

- **Côté producteur** : un test de contrat à chaque modification du code de production du jeu, avant déploiement ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)).
- **Au chargement** : les règles de qualité et la validation du schéma avant publication ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)).
- **Côté consommateur** : des tests qui déclarent ce qu'ils attendent ; une liste automatique des consommateurs, par le lignage ([20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données)).
- **En continu** : surveillance de la fraîcheur et des volumes.

Une violation produit une alerte au propriétaire et au producteur, et, selon la gravité, bloque la publication.

#### Contrat de données et interopérabilité

Le contrat de données se retrouve en [28.5 Spécification d'API asynchrone et contrat de données](28-interoperabilite-avancee.md#285-spécification-dapi-asynchrone-et-contrat-de-données) sous l'angle de l'interopérabilité : échange entre systèmes et organisations, spécification de l'API asynchrone. Ici, il est vu sous l'angle de la gouvernance : propriétaire, qualité, classification, conformité.

#### Modes de défaillance

- **Références recopiées** : divergence entre systèmes.
- **Doublons de maîtres** : entités éclatées.
- **Valeurs retirées sans transition.**
- **Contrat décoratif** : jamais testé.
- **Changement silencieux** : un producteur modifie un champ sans version.
- **Propriétaire absent** : personne ne tranche.
- **Contrat trop rigide** : toute évolution devient un chantier.

**Contre-exemple.** Un producteur remplace la valeur `critical` par `high` dans la gravité, pour s'aligner sur un autre système. Aucun préavis. Les tableaux de bord qui comptent les constats « critical » affichent zéro, et le rapport hebdomadaire de sécurité part avec « aucun constat critique ». Un contrat versionné, avec contrôle des valeurs autorisées, aurait bloqué la publication.

**Limites.** Un contrat réduit l'incertitude, il n'élimine pas les désaccords sémantiques. La gestion des données maîtres est un chantier d'organisation autant que d'outil. Les parties qui ne maîtrisent pas leurs consommateurs (données publiées vers l'extérieur) ont moins de moyens de contraindre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | La classification figure dans le contrat |
| [20.5 Catalogue de données, lignage et qualité des données](#205-catalogue-de-données-lignage-et-qualité-des-données) | Les règles de qualité et le lignage servent le contrat |
| [10.11 Systèmes externes et système de référence](10-api-integrations-extensibilite.md#1011-systèmes-externes-et-système-de-référence) | Le système de référence d'une donnée fait autorité |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API suit les mêmes principes de compatibilité |
| [19.8 Modélisation dimensionnelle et couche sémantique](19-recherche-analytique-restitution.md#198-modélisation-dimensionnelle-et-couche-sémantique) | Les indicateurs de la couche sémantique ont une sémantique contractuelle |
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](21-livraison-qualite-logicielle.md#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Les tests de contrat vérifient le respect du contrat |
| [28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité) | Les règles de compatibilité d'un registre de schémas |
| [28.5 Spécification d'API asynchrone et contrat de données](28-interoperabilite-avancee.md#285-spécification-dapi-asynchrone-et-contrat-de-données) | Le contrat de données vu sous l'angle de l'interopérabilité |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | Les listes de référence se personnalisent en couches |

### 5. Application pratique

**Situation initiale.** Alpha Air importe des aéronefs depuis l'ERP et le système de navigabilité. Le même aéronef existe en trois versions, avec des types et des bases différents. Un producteur de rapports change régulièrement le nom des colonnes.

**Problème.** Pas de référence commune ni d'enregistrement unique par aéronef, et aucun contrat entre producteurs et consommateurs.

**Application du concept.** La plateforme tient des listes de référence versionnées, un enregistrement de référence par aéronef et des contrats sur les jeux partagés.

**Déroulé.**

1. L'équipe définit les listes de référence (gravité, type, base) avec leurs valeurs, dates de validité et propriétaires.
2. Le rapprochement par immatriculation normalisée produit un enregistrement par aéronef, avec des règles de survie par attribut.
3. Les jeux partagés reçoivent un contrat versionné avec schéma, qualité, fraîcheur et politique de changement.
4. Les tests de contrat s'exécutent à chaque modification du producteur ; une suppression de colonne est bloquée.
5. Le renommage prévu de `base` en `home_base` passe par la version 3.0.0, avec deux versions en parallèle pendant 90 jours.

**Résultat.** Un aéronef, une identité ; les changements sont annoncés et testés.

**Limites.** La période de double publication coûte du stockage et de l'exploitation : on la borne.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre données de référence, données maîtres et données transactionnelles ?
2. **Compréhension.** Que contient un contrat de données, au-delà du schéma ?
3. **Compréhension.** Qu'est-ce qu'un changement incompatible, et comment le gère-t-on ?
4. **Pourquoi.** Pourquoi une valeur de référence retirée garde-t-elle une période de validité et un remplaçant ?
5. **Raisonnement pratique.** Deux systèmes donnent des types différents pour F-ABCD (A320 et A320-214). Que faut-il définir pour obtenir un enregistrement de référence stable ?

#### Réponses

1. Les références sont des listes stables de codes partagés ; les données maîtres décrivent les entités centrales partagées ; les données transactionnelles enregistrent les événements et changent en permanence.
2. La signification des champs, les règles de qualité, les niveaux de service (fraîcheur, disponibilité), la classification, les rôles et les règles de changement.
3. Une modification qui casse des consommateurs existants (renommage, suppression, changement de type). On la gère par une nouvelle version majeure, un préavis, une période de double publication et la migration des consommateurs.
4. Parce que d'anciens enregistrements y font référence : ils doivent rester lisibles et interprétables, et le remplaçant guide la migration.
5. Une règle de rapprochement (identité par immatriculation normalisée) et une règle de survie par attribut : quel système fait autorité pour le type, avec priorité en cas de conflit.

## 20.7 Cadres de conformité, contrôles, preuves et conformité continue

### 1. Comprendre simplement

Un **cadre de conformité** (*compliance framework*) est un référentiel structuré d'exigences ou de critères auquel une organisation s'engage, ou que ses clients lui demandent de respecter : SOC 2, ISO/IEC 27001, PCI DSS. Un **contrôle** (*control*) est une mesure précise (une politique, une procédure, une vérification technique) qui répond à une exigence, et la **preuve** (*evidence*) est la trace qui démontre que ce contrôle a fonctionné. La **correspondance des contrôles** (*control mapping*) relie un même contrôle à plusieurs exigences de plusieurs cadres. La **conformité continue** (*continuous compliance*) maintient et vérifie ces contrôles en permanence plutôt qu'une fois par an. L'ensemble forme la fonction *control and evidence*.

**Pourquoi cela existe.** Les clients, les assureurs et les régulateurs demandent des garanties comparables d'un fournisseur à l'autre. Les cadres fournissent un langage commun. Mais chaque cadre pose des dizaines ou des centaines d'exigences qui se recoupent : sans correspondance, on prouve la même chose cinq fois. Et préparer un audit en trois mois, à la main, est coûteux et fragile.

**Problème résolu.** Démontrer à plusieurs auditeurs et clients que des mesures existent et fonctionnent, en les décrivant et en les prouvant une seule fois, de façon continue.

**Modèle mental.** Un carnet de maintenance d'un avion : chaque opération (contrôle) est décrite dans un programme, chaque réalisation est consignée avec la date et la signature (preuve), et plusieurs autorités s'appuient sur le même carnet (correspondance).

**Où l'analogie s'arrête.** Un carnet de maintenance se remplit à la main, opération par opération. Dans une plateforme, une grande part des preuves est produite par le système lui-même (journaux, configurations), ce qui permet de les collecter en continu. Mais un tableau de bord tout vert ne prouve pas que la mesure est la bonne.

**Exemple.** Alpha Air demande à la plateforme une attestation SOC 2 et un certificat ISO/IEC 27001. Le contrôle « revue trimestrielle des accès privilégiés » est décrit une fois, avec son propriétaire, sa fréquence et ses preuves : l'export des comptes à privilèges, les validations des responsables, les tickets de retrait. Il est relié aux exigences des deux cadres.

**Les composants.**

1. les **cadres** retenus et leurs exigences ;
2. les **contrôles** : description, propriétaire, fréquence, automatisation ;
3. les **preuves** : type, source, période, empreinte ;
4. la **correspondance** contrôles-exigences ;
5. les **collecteurs de preuves** automatiques ;
6. les **vérifications continues** et alertes de dérive ;
7. les **exceptions** documentées et datées ;
8. le **tableau de bord** de couverture.

**Objectif d'apprentissage :** vous pouvez décrire la relation entre cadre, contrôle et preuve, expliquer l'intérêt de la correspondance, et dire ce que la conformité continue apporte et ne garantit pas.

### 2. Connaissances essentielles

#### Définition

- **Cadre de conformité** : ensemble structuré d'exigences, de critères ou de bonnes pratiques, publié par une autorité ou un organisme, servant de référence à la démonstration d'une maîtrise.
- **Contrôle** : mesure précise, avec propriétaire et fréquence, qui répond à une ou plusieurs exigences.
- **Preuve** : trace datée et attribuable qui démontre qu'un contrôle a été exécuté ou qu'il opère.
- **Correspondance des contrôles** : table de relation entre contrôles et exigences de plusieurs cadres.
- **Conformité continue** : maintien et vérification automatisés des contrôles, avec collecte régulière des preuves et détection des dérives.

#### Idées fondamentales

1. **Un contrôle, plusieurs exigences.** On décrit une mesure une fois et on la relie à plusieurs cadres.
2. **Un contrôle sans preuve n'existe pas pour l'auditeur.** La preuve est la moitié du contrôle.
3. **La preuve est datée, attribuable et non modifiable.** Sa source et sa période sont connues.
4. **La conformité est un état, pas un événement.** On la maintient entre deux audits.
5. **L'automatisation réduit l'effort, pas la responsabilité.** Un propriétaire répond du contrôle.
6. **Une exception est un fait documenté.** Motif, durée, approbation (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).
7. **Un cadre n'est pas la sécurité.** Il en structure la démonstration.

#### Vocabulaire essentiel

- **SOC 2** : examen par un auditeur indépendant des contrôles d'une organisation de services, selon des critères de services de confiance : sécurité, disponibilité, intégrité du traitement, confidentialité, vie privée.
- **ISO/IEC 27001** : norme de système de management de la sécurité de l'information.
- **PCI DSS** : norme de sécurité des données de paiement, qui s'applique aux entités qui stockent, traitent ou transmettent des données de titulaires de cartes.
- **Déclaration d'applicabilité** (*statement of applicability*) : document qui liste les contrôles retenus, leur justification et leur état.
- **Échantillonnage** (*sampling*) : examen d'une partie d'une population de preuves.
- **Dérive** (*drift*) : écart entre l'état attendu d'un contrôle et la réalité.
- **OSCAL** (*Open Security Controls Assessment Language*) : formats ouverts du NIST pour exprimer catalogues de contrôles, bases de référence et résultats de façon lisible par machine.

#### Relations de cause à effet

- Chaque cadre est traité séparément : trois audits sollicitent les mêmes équipes pour trois fois les mêmes preuves.
- Les preuves sont rassemblées une fois par an, dans la précipitation : des trous apparaissent, des captures d'écran s'ajoutent, la qualité chute.
- Un contrôle est décrit mais personne n'en répond : il n'est pas exécuté, et l'écart est découvert à l'audit.
- La conformité est mesurée par des cases cochées : un contrôle « vert » ne vérifie pas ce qu'il prétend.
- Les exceptions ne sont pas datées : elles deviennent permanentes.

#### Idées reçues

- **« Un cadre de conformité garantit la sécurité. »** Non. Il fixe ce que l'on démontre ; la qualité des mesures reste à la charge de l'organisation.
- **« Automatiser la preuve, c'est automatiser la conformité. »** Non. L'automatisation collecte et vérifie ce qu'on a défini ; le choix des contrôles et leur adéquation restent humains.
- **« Une organisation conforme n'aura pas d'incident. »** Non. La conformité réduit le risque et améliore la réaction ; elle ne l'annule pas.

#### Principe clé

Chaque mesure est décrite une fois comme un contrôle, avec propriétaire et preuves, reliée aux exigences de plusieurs cadres, et vérifiée en continu plutôt que ressortie avant l'audit.

#### Si vous ne retenez que trois choses

1. Le contrôle est la mesure ; la preuve en est la démonstration datée ; la correspondance relie un contrôle à plusieurs exigences.
2. La conformité continue collecte et vérifie en permanence, et signale les dérives.
3. Un cadre structure la démonstration ; il ne remplace ni les mesures ni le jugement.

### 3. Explication technique détaillée

#### Les cadres usuels

| Cadre | Objet | Particularité |
|---|---|---|
| SOC 2 | Contrôles d'une organisation de services au regard des critères des services de confiance (sécurité, disponibilité, intégrité du traitement, confidentialité, vie privée) | Rapport d'un auditeur indépendant (voir [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification)) ; la catégorie sécurité est le socle commun, les autres s'ajoutent selon les services |
| ISO/IEC 27001 | Système de management de la sécurité de l'information | Édition 2022 : 93 contrôles de référence en quatre thèmes (organisationnel, humain, physique, technologique) ; déclaration d'applicabilité ; certification par un organisme |
| PCI DSS | Protection des données de paiement | S'applique aux entités qui stockent, traitent ou transmettent des données de titulaires de cartes, ou qui peuvent affecter la sécurité de cet environnement |
| RGPD | Protection des données personnelles | Cadre légal, pas de certificat unique ; démonstration par des mesures documentées (voir [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités), [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) |
| Cadres sectoriels | Santé, finance, aéronautique | Voir [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) |

Les descriptions de SOC 2, d'ISO/IEC 27001 et de PCI DSS suivent les pages des organismes et les ouvrages de référence consultés (voir les références du module). Les listes de critères et de contrôles se lisent dans les textes eux-mêmes.

#### Contrôle, preuve, correspondance

```yaml
control:
  id: AC-REVIEW-Q
  title: Revue trimestrielle des accès privilégiés
  owner: role:security_officer
  frequency: quarterly
  automated: partial
  procedure:
    - Extraire la liste des comptes à privilèges (automatisé)
    - Faire valider chaque compte par son responsable
    - Révoquer les accès non justifiés dans les 5 jours ouvrés
  evidence:
    - type: export
      source: iam.privileged_accounts
    - type: approval
      source: tickets.access_review
  maps_to:
    - framework: soc2
      requirement: "accès logique (catégorie sécurité)"
    - framework: iso27001
      requirement: "gestion des accès (Annexe A)"
```

*Les références aux exigences sont volontairement génériques : les numéros de critères se lisent dans les textes de chaque cadre.*

| Contrôle | Cadre A | Cadre B | Cadre C |
|---|---|---|---|
| Revue trimestrielle des accès privilégiés | Accès logique | Gestion des accès | Restriction de l'accès aux données |
| Sauvegarde et test de restauration | Disponibilité | Sauvegarde de l'information | Disponibilité des systèmes |
| Gestion des vulnérabilités | Sécurité | Gestion des vulnérabilités techniques | Tests de sécurité |
| Journalisation des accès aux données | Surveillance | Journalisation | Suivi des accès |

La **correspondance** évite la duplication : un contrôle est exécuté une fois, ses preuves sont collectées une fois, et chaque cadre y puise ce qu'il demande.

```sql
CREATE TABLE control (
  id           text PRIMARY KEY,
  title        text NOT NULL,
  description  text NOT NULL,
  owner_role   text NOT NULL,
  frequency    text NOT NULL CHECK (frequency IN
                 ('continuous','daily','weekly','monthly','quarterly','annual','event')),
  automated    boolean NOT NULL,
  status       text NOT NULL CHECK (status IN ('draft','active','retired'))
);

CREATE TABLE control_requirement (
  control_id   text NOT NULL REFERENCES control (id),
  framework    text NOT NULL,
  requirement  text NOT NULL,
  PRIMARY KEY (control_id, framework, requirement)
);

CREATE TABLE control_evidence (
  id             uuid PRIMARY KEY,
  control_id     text NOT NULL REFERENCES control (id),
  collected_at   timestamptz NOT NULL,
  period_start   timestamptz,
  period_end     timestamptz,
  source         text NOT NULL,
  result         text NOT NULL CHECK (result IN ('pass','fail','exception','not_applicable')),
  artifact_file  uuid,
  sha256         char(64),
  collected_by   text NOT NULL
);

SELECT c.id, c.title, max(e.collected_at) AS last_evidence
  FROM control c
  LEFT JOIN control_evidence e ON e.control_id = c.id
 WHERE c.status = 'active'
 GROUP BY c.id, c.title
HAVING max(e.collected_at) IS NULL
    OR max(e.collected_at) < now() - interval '35 days'
 ORDER BY last_evidence NULLS FIRST;
```

La dernière requête liste les contrôles actifs sans preuve récente : c'est le premier tableau de bord de la conformité continue.

#### Qu'est-ce qu'une bonne preuve

| Qualité | Question |
|---|---|
| Source | Vient-elle du système qui fait autorité ? |
| Complétude | Couvre-t-elle toute la population, ou un échantillon identifié ? |
| Datation | Quand et sur quelle période a-t-elle été produite ? |
| Attribution | Qui ou quoi l'a produite ? |
| Intégrité | Est-elle non modifiable ou signée d'une empreinte ? |
| Lisibilité | Un tiers la comprend-il sans connaître les systèmes ? |

Une preuve se range comme un fichier de la plateforme ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)) avec empreinte, classe de conservation et, pour les plus sensibles, stockage à écriture unique ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)). Une capture d'écran est la preuve la plus faible : elle n'est pas rejouable, et peu vérifiable.

#### La conformité continue

```text
exigences ─► contrôles ─► collecteurs ─► vérifications planifiées ─► résultats datés ─► tableau de bord ─► alertes de dérive
                               │                                           │
                               └─ API, journaux, configurations            └─ exceptions approuvées et datées
```

| Élément | Mise en œuvre |
|---|---|
| Collecteurs | Tâches planifiées qui interrogent les systèmes : liste des comptes, configurations, résultats de sauvegarde, tickets ([7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond)) |
| Vérifications | Règles exprimées en code (voir [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)) : « aucun compte à privilèges sans authentification multifacteur » |
| Résultats | Enregistrés avec horodatage, immuables, rattachés au contrôle |
| Dérive | Écart détecté : alerte au propriétaire, ticket, délai de correction |
| Exceptions | Approbation, motif, date d'expiration, compensations (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)) |
| Visibilité | Couverture par cadre, contrôles en retard, tendances |

Le NIST propose **OSCAL**, des formats ouverts (XML, JSON, YAML) pour exprimer catalogues de contrôles, bases de référence et résultats d'évaluation de façon lisible par machine, avec l'objectif d'automatiser les processus de sécurité et de conformité et de traduire des politiques en « politique en tant que code ». Une plateforme peut s'en inspirer pour échanger ses contrôles avec des outils tiers ; ce module n'en suppose pas l'usage.

#### Dans une plateforme multi-tenant

- La plateforme maintient **ses** contrôles : infrastructure, développement, exploitation, support.
- Chaque tenant maintient **les siens** pour ce qu'il configure : rôles, revues d'accès, classification (voir [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) pour la répartition des responsabilités).
- La plateforme **fournit des preuves à ses tenants** : journaux d'audit exportables ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), historique des changements de configuration ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), rapports de conformité.
- Un **portail de confiance** publie les attestations et certificats, sous accord de confidentialité si besoin.

#### Modes de défaillance

- **Preuves de dernière minute** : lacunes et fabrications involontaires.
- **Contrôles sans propriétaire.**
- **Correspondance absente** : duplication d'effort.
- **Tableau de bord vert** sur des vérifications qui ne mesurent rien.
- **Exceptions éternelles.**
- **Preuves modifiables** : pas de valeur probante.
- **Cadre appliqué comme un gabarit** : les mesures ne correspondent pas aux risques réels.

**Contre-exemple.** Une organisation prépare son audit annuel en trois semaines. Elle découvre que la revue des accès n'a pas eu lieu pendant deux trimestres. Elle l'exécute à la hâte, antidate des approbations, et l'auditeur relève l'incohérence entre les dates de création des fichiers et celles des approbations. Un contrôle trimestriel avec collecte automatique de preuves aurait signalé le retard dès le premier trimestre.

**Limites.** La conformité continue demande des outils, des conventions et du temps de maintenance. Les vérifications automatiques ne couvrent pas les contrôles humains (formation, jugement). Un cadre peut exiger des preuves que la plateforme ne produit pas naturellement : on les crée. Et un état « conforme » se rapporte à un périmètre précis.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'audit est une source de preuves |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Les exceptions et les preuves sont tracées et datées |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les contrôles s'expriment en politique en tant que code |
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | La classification des données alimente les contrôles |
| [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification) | Les audits et attestations évaluent ces contrôles |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les responsabilités se répartissent entre la plateforme et ses tenants |
| [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Les régimes sectoriels ajoutent des exigences |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | Le stockage immuable des preuves |
| [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) | Les collecteurs sont des tâches planifiées |

### 5. Application pratique

**Situation initiale.** Alpha Air a répondu à six questionnaires de sécurité de clients et prépare un SOC 2. Chaque réponse mobilise les mêmes personnes, et les preuves sont dispersées dans des courriels et des captures d'écran.

**Problème.** Pas de catalogue de contrôles, pas de correspondance, preuves ad hoc.

**Application du concept.** La plateforme formalise 60 contrôles, les relie aux cadres demandés, et collecte les preuves automatiquement.

**Déroulé.**

1. Les équipes décrivent leurs 60 contrôles : propriétaire, fréquence, procédure, preuves attendues.
2. Chaque contrôle est relié aux exigences des cadres demandés ; une matrice montre que 42 contrôles servent plusieurs cadres.
3. Des collecteurs produisent les preuves : export des comptes, résultats de sauvegarde, journaux de changements.
4. Un tableau de bord liste les contrôles sans preuve récente ; deux sont en retard et corrigés.
5. Les réponses aux questionnaires s'appuient sur les mêmes contrôles et les mêmes preuves.

**Résultat.** Un seul jeu de contrôles et de preuves sert tous les cadres, et les retards sont vus à temps.

**Limites.** Dix contrôles restent manuels (formation, revue de contrats) : leurs preuves sont déposées par leurs propriétaires, avec rappel automatique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un contrôle et une preuve ?
2. **Compréhension.** Qu'apporte la correspondance des contrôles ?
3. **Compréhension.** Que fait la conformité continue que ne fait pas une préparation annuelle ?
4. **Pourquoi.** Pourquoi une capture d'écran est-elle une preuve faible ?
5. **Raisonnement pratique.** Un contrôle trimestriel n'a aucune preuve datant de plus de 35 jours. Que signale le tableau de bord, et que faire ?

#### Réponses

1. Le contrôle est la mesure (ce que l'on fait, qui, à quelle fréquence). La preuve est la trace datée et attribuable qui démontre qu'il a été exécuté ou qu'il opère.
2. Un contrôle exécuté une fois sert à plusieurs cadres : on décrit, on exécute et on prouve une seule fois, ce qui réduit le coût et les incohérences.
3. Elle collecte et vérifie en permanence, signale les dérives dès qu'elles apparaissent, et garde l'organisation prête à tout moment, au lieu de reconstituer l'année avant l'audit.
4. Parce qu'elle n'est ni rejouable, ni facilement attribuable ou datée de manière fiable, et qu'un tiers ne peut pas la vérifier à la source.
5. Que la preuve du trimestre est en retard : le contrôle apparaît dans la liste des contrôles sans preuve récente. On alerte le propriétaire, on exécute le contrôle, on dépose la preuve, et l'on analyse la cause du retard.

## 20.8 Audit interne et externe, attestation et certification

### 1. Comprendre simplement

Un **audit interne** (*internal audit*) est un examen réalisé par une fonction de l'organisation, indépendante des équipes auditées. Un **audit externe** (*external audit*) est réalisé par une partie extérieure : un client, un régulateur, un cabinet indépendant. Une **attestation** (*attestation*) est un rapport par lequel un auditeur indépendant exprime une opinion sur des contrôles. Une **certification** (*certification*) est un certificat délivré par un organisme, qui constate la conformité d'un système à une norme, sur un périmètre. L'ensemble forme la fonction *internal and external audit*, puis *attestation and certification*.

**Pourquoi cela existe.** Un fournisseur qui affirme « nous sommes sécurisés » ne convainc personne. Un client veut une opinion d'un tiers indépendant, ou la capacité de vérifier lui-même. L'audit apporte cette indépendance ; l'attestation et la certification la rendent portable : un même rapport ou un même certificat sert des centaines de clients.

**Problème résolu.** Fournir à des tiers une assurance indépendante, comparable et réutilisable sur les contrôles du fournisseur, sans multiplier les audits individuels.

**Modèle mental.** Un contrôle technique automobile : un garage indépendant examine selon une liste, rédige un procès-verbal, et le délivre à tout acheteur qui le demande.

**Où l'analogie s'arrête.** Un procès-verbal de contrôle technique vaut pour un véhicule à une date. Une attestation couvre un périmètre et une période ; une certification vaut pour un système de management sur un périmètre déclaré, avec des audits de surveillance. Aucun des deux ne garantit l'absence d'incident.

**Exemple.** Alpha Air demande à la plateforme son rapport SOC 2 de type 2 et son certificat ISO/IEC 27001, pour son propre dossier d'autorité. Un autre client, plus exigeant, demande un audit sur site de la gestion des accès. La plateforme répond au premier par ses rapports et au second par un audit encadré, sous accord de confidentialité, avec un auditeur au rôle limité et temporaire.

**Les composants.**

1. le **plan d'audit interne** : périmètre, fréquence, indépendance ;
2. les **audits de tiers** : clients, régulateurs, cabinets ;
3. les **attestations** (SOC 2) ;
4. les **certifications** (ISO/IEC 27001) ;
5. le **cycle d'audit** : cadrage, travaux, constats, remédiation ;
6. l'**accès d'audit** : rôle, périmètre, durée ;
7. le **suivi des constats** et des plans d'action ;
8. la **publication** des résultats : portail, accord de confidentialité.

**Objectif d'apprentissage :** vous pouvez distinguer audit interne et externe, attestation et certification, décrire le cycle d'un audit, et dire ce que chaque livrable prouve.

### 2. Connaissances essentielles

#### Définition

- **Audit interne** : examen indépendant, réalisé par une fonction de l'organisation, de la maîtrise de ses risques et du fonctionnement de ses contrôles.
- **Audit externe** : examen réalisé par une partie extérieure à l'organisation, selon un référentiel convenu.
- **Attestation** : rapport d'un auditeur indépendant qui exprime une opinion sur la description d'un système et sur la conception, et parfois le fonctionnement, de ses contrôles, selon des critères.
- **Certification** : reconnaissance, par un organisme de certification indépendant, de la conformité d'un système de management à une norme, sur un périmètre et pour une durée.

#### Idées fondamentales

1. **L'indépendance fonde la valeur.** L'auditeur n'est pas celui qui opère les contrôles.
2. **Le périmètre est le cœur du résultat.** Une attestation ou un certificat vaut pour ce qui est couvert.
3. **La conception et le fonctionnement sont deux questions.** Un contrôle bien conçu peut ne pas être exécuté.
4. **Une période n'est pas un instant.** Observer six mois ne dit pas ce qui s'est passé avant ou après.
5. **L'attestation décrit ; la certification constate.** L'une est un rapport détaillé, l'autre un certificat.
6. **Un audit repose sur des preuves.** D'où l'intérêt de les avoir préparées (voir [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)).
7. **Les constats se suivent.** Un constat sans plan d'action daté est un constat qui revient.

#### Vocabulaire essentiel

- **SOC 2 de type 1 et de type 2** : rapport sur la conception des contrôles à une date, ou sur leur conception et leur efficacité de fonctionnement sur une période.
- **Période d'observation** (*observation period*) : durée couverte par un rapport de type 2.
- **Organisme de certification** (*certification body*) : organisme indépendant qui audite et délivre le certificat.
- **Audit de surveillance** (*surveillance audit*) : audit périodique de maintien d'une certification.
- **Constat** (*finding*) : écart ou point d'amélioration relevé par un audit.
- **Plan d'action correctif** (*corrective action plan*) : mesures, responsables et dates pour traiter un constat.
- **Droit d'audit** (*right to audit*) : clause contractuelle qui permet à un client d'auditer son fournisseur.
- **Rapport sous accord de confidentialité** (*report under NDA*) : rapport communiqué sous engagement de confidentialité.

#### Relations de cause à effet

- L'auditeur est aussi l'opérateur du contrôle : l'opinion perd son indépendance.
- Le périmètre est annoncé de façon vague : un client croit que ses données sont couvertes alors qu'elles ne le sont pas.
- Un contrôle est conçu mais n'est exécuté qu'avant l'audit : un rapport de type 2 relève l'écart.
- Chaque client demande son audit sur site : l'organisation passe son année à répondre.
- Les constats ne sont pas suivis : ils réapparaissent à l'audit suivant.

#### Idées reçues

- **« Une attestation et une certification sont la même chose. »** Non. L'une est le rapport d'un auditeur sur des contrôles, avec une opinion ; l'autre, un certificat délivré par un organisme pour un système de management.
- **« Un rapport sans réserve prouve l'absence de faille. »** Non. Il exprime une opinion sur un périmètre et une période.
- **« L'organisme de normalisation certifie. »** Non. D'après la description d'ISO/IEC 27001 consultée, l'ISO ne certifie pas les organisations elles-mêmes : des organismes de certification indépendants le font.

#### Principe clé

Un audit apporte une assurance indépendante ; l'attestation la formule en une opinion détaillée sur des contrôles et une période, la certification la constate pour un système et un périmètre ; les deux se préparent par des contrôles et des preuves déjà en place.

#### Si vous ne retenez que trois choses

1. L'audit vaut par son indépendance et par son périmètre.
2. Une attestation exprime une opinion sur des contrôles (conception, et parfois fonctionnement sur une période) ; une certification constate la conformité d'un système à une norme.
3. Les constats d'audit se suivent par des plans d'action datés.

### 3. Explication technique détaillée

#### Les types d'audit

| Type | Qui | Pour qui | Portée |
|---|---|---|---|
| Interne | Une fonction d'audit de l'organisation | La direction, le conseil | Risques et contrôles choisis selon un plan |
| Client (seconde partie) | Un client ou son mandataire | Le client | Ce que le contrat prévoit ; souvent limité à ses données |
| Indépendant (tierce partie) | Un cabinet ou un organisme | Tous les clients et régulateurs | Un référentiel, un périmètre, une période |
| Régulateur | Une autorité | L'autorité | Les obligations légales ou sectorielles |

Le contrat de sous-traitance prévoit, en vertu du RGPD (article 28, paragraphe 3, point h), que le sous-traitant fournit toutes les informations nécessaires pour démontrer le respect des obligations et permet et contribue aux audits, y compris les inspections, réalisés par le responsable du traitement ou un auditeur mandaté.

#### Attestation et certification

| Critère | Attestation (SOC 2) | Certification (ISO/IEC 27001) |
|---|---|---|
| Qui délivre | Un cabinet d'expertise comptable indépendant, selon les normes de l'AICPA | Un organisme de certification indépendant |
| Nature | Rapport avec opinion, description du système, tests et résultats | Certificat de conformité d'un système de management |
| Objet | Contrôles liés aux critères des services de confiance | Système de management de la sécurité de l'information |
| Temporalité | Type 1 : à une date ; type 2 : sur une période d'observation | Cycle : audit initial en deux étapes, audits de surveillance annuels, recertification environ tous les trois ans |
| Contenu public | Rapport en général communiqué sous accord de confidentialité | Certificat et périmètre ; déclaration d'applicabilité en général non publique |
| Limite | Périmètre et période du rapport | Périmètre du système de management déclaré sur le certificat |

Les éléments sur le type 1 et le type 2 (conception à une date, puis conception et fonctionnement sur une période) et sur la durée d'observation (que l'AICPA ne fixe pas de façon uniforme, la pratique tournant autour de trois à douze mois) proviennent de sources secondaires : on les vérifie auprès de l'auditeur retenu. Le cycle de certification ISO/IEC 27001 (deux étapes d'audit initial, première surveillance sous douze mois puis annuelle, recertification triennale) est tiré d'une description encyclopédique : on le vérifie auprès de l'organisme.

#### Le cycle d'un audit

```text
cadrage ─► préparation ─► travaux (demandes de preuves, entretiens, tests) ─► constats ─► réponse de la direction ─► rapport ─► suivi
```

| Étape | Contenu | Bonne pratique |
|---|---|---|
| Cadrage | Périmètre, période, critères, calendrier | Écrire ce qui est exclu |
| Préparation | Rassembler la description du système, les contrôles, les preuves | S'appuyer sur la collecte continue ([20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)) |
| Travaux | L'auditeur demande des preuves, sélectionne des échantillons, interroge | Un point d'entrée unique, un journal des demandes |
| Constats | Écarts classés par gravité | Distinguer écart de conception et écart de fonctionnement |
| Réponse | Analyse, plan d'action, responsable, date | Réponse factuelle, sans minimiser |
| Rapport | Opinion ou constats formels | Relu pour exactitude factuelle |
| Suivi | Vérification de la fermeture des actions | Revue périodique par le comité de pilotage |

**Échantillonnage.** Un auditeur ne regarde pas toute la population : pour un contrôle qui produit 180 preuves sur la période, il en sélectionne un échantillon. La population doit donc être **exhaustive et exportable** : si la plateforme produit la liste complète (tous les changements de la période, tous les comptes), l'échantillon est tiré sur une base fiable. Les tailles d'échantillon sont celles de l'auditeur, pas celles de l'organisation.

#### Donner l'accès sans perdre le contrôle

La plateforme prévoit un rôle **auditeur**, avec les propriétés suivantes (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) et [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)) :

```json
{
  "access_grant": {
    "principal": "ext_auditor_firm_07",
    "role": "auditor",
    "scope": { "tenant": "ten_airline_01", "resources": ["audit_log", "access_reviews", "change_history"] },
    "permissions": ["read", "export_with_watermark"],
    "valid_from": "2026-11-02T08:00:00Z",
    "valid_until": "2026-11-20T18:00:00Z",
    "requires": ["mfa", "nda_signed"],
    "all_access_logged": true
  }
}
```

- accès en **lecture seule**, limité aux ressources utiles à l'audit ;
- **durée limitée**, avec authentification renforcée ;
- exports **filigranés** et journalisés ([18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane)) ;
- séparation des tâches : la personne qui prépare les preuves n'est pas celle qui les approuve ([4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) ;
- accès de l'auditeur **tracé** dans le journal d'audit.

#### Répondre à de nombreux clients

| Approche | Principe |
|---|---|
| Rapports et certificats partagés | Un seul rapport indépendant, communiqué sous accord de confidentialité |
| Portail de confiance | Documents, politiques, sous-traitants, état des contrôles |
| Questionnaires standardisés | Réponses pré-remplies à partir des contrôles ([20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)) |
| Audits clients encadrés | Limités à des domaines non couverts, avec un calendrier et un périmètre |
| Audits mutualisés | Un audit commun pour plusieurs clients |

#### Suivre les constats

```sql
CREATE TABLE audit_finding (
  id              uuid PRIMARY KEY,
  engagement      text        NOT NULL,
  raised_at       date        NOT NULL,
  control_id      text,
  severity        text        NOT NULL CHECK (severity IN ('observation','minor','major','critical')),
  description     text        NOT NULL,
  owner_role      text        NOT NULL,
  action_plan     text,
  due_on          date,
  status          text        NOT NULL CHECK (status IN ('open','in_progress','closed','accepted_risk')),
  closed_on       date
);
```

Un constat clos renvoie à la preuve de sa correction. Un risque accepté renvoie au registre des risques ([20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques)), avec sa décision.

#### Modes de défaillance

- **Périmètre flou.**
- **Indépendance compromise.**
- **Préparation précipitée.**
- **Audit mal encadré** : accès trop large, journaux absents.
- **Constats non suivis.**
- **Rapport utilisé hors périmètre** : un client suppose couverte une région ou une fonction qui ne l'est pas.
- **Fatigue d'audit** : trop de demandes individuelles.

**Contre-exemple.** Un fournisseur présente son attestation SOC 2 à un nouveau client, en laissant entendre qu'elle couvre toute la plateforme. Le périmètre du rapport exclut les environnements de la région où se trouvent les données du client. Quand l'écart est découvert lors d'un incident, le client invoque un défaut d'information. Le périmètre doit être explicite et rappelé à chaque communication.

**Limites.** Un audit est un échantillon dans le temps. L'opinion dépend de la compétence de l'auditeur et du référentiel. Une certification ne dit rien du niveau de sécurité au-delà de la conformité du système de management à la norme. Et la valeur d'un rapport décroît avec le temps : un rapport de plus de douze mois est souvent jugé périmé par les clients.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue) | Les contrôles et preuves préparés pour l'audit |
| [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations) | Les analyses d'impact et les notifications sont auditées |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les audits couvrent les sous-traitants et la répartition des responsabilités |
| [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Les clauses de droit d'audit et le registre des risques |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'audit est la source principale des tests |
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Séparation des tâches pour l'accès d'audit |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | La remise des rapports et des preuves par liens contrôlés |
| [18.7 Partage externe et filigrane](18-fichiers-documents-contenus.md#187-partage-externe-et-filigrane) | Les exports filigranés pour l'auditeur |

### 5. Application pratique

**Situation initiale.** Alpha Air demande à son fournisseur, la plateforme, un audit sur site de la gestion des accès. D'autres clients envoient des questionnaires. Chaque demande mobilise l'équipe sécurité pendant deux semaines.

**Problème.** Pas de livrable partagé, accès d'audit improvisé, constats suivis par courriel.

**Application du concept.** La plateforme obtient une attestation indépendante de type 2 et une certification, publie un portail de confiance et encadre les audits clients.

**Déroulé.**

1. Un cabinet indépendant examine les contrôles sur une période d'observation de six mois ; le rapport est communiqué sous accord de confidentialité.
2. Un organisme de certification audite le système de management, avec le périmètre inscrit au certificat.
3. Alpha Air consulte le portail : rapport, périmètre, sous-traitants, état des contrôles.
4. Pour le domaine non couvert (gestion des accès de son tenant), un audit encadré est organisé : rôle auditeur de 8 jours, lecture seule, exports filigranés.
5. Deux constats mineurs sont consignés avec un plan d'action et une échéance ; ils sont clos et prouvés au bout de six semaines.

**Résultat.** Un livrable indépendant sert la plupart des clients ; les audits individuels se limitent à ce qui n'est pas couvert.

**Limites.** Le rapport couvre six mois : le client demande un rapport de suivi (« lettre de passerelle ») pour la période suivante, selon la pratique du cabinet.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre audit interne et audit externe ?
2. **Compréhension.** En quoi une attestation diffère-t-elle d'une certification ?
3. **Compréhension.** Que distingue un rapport de type 1 d'un rapport de type 2 ?
4. **Pourquoi.** Pourquoi le périmètre d'un rapport ou d'un certificat doit-il être rappelé à chaque communication ?
5. **Raisonnement pratique.** Un auditeur externe doit consulter les journaux d'accès pendant huit jours. Quelles propriétés doit avoir son accès ?

#### Réponses

1. L'audit interne est réalisé par une fonction de l'organisation, indépendante des équipes auditées, pour la direction. L'audit externe est réalisé par une partie extérieure (client, régulateur, cabinet), selon un référentiel convenu.
2. L'attestation est un rapport d'un auditeur indépendant, avec une opinion sur des contrôles et une description du système. La certification est un certificat délivré par un organisme, qui constate la conformité d'un système de management à une norme sur un périmètre.
3. Le type 1 porte sur la conception des contrôles à une date. Le type 2 porte aussi sur leur fonctionnement effectif sur une période d'observation.
4. Parce que ce qui est couvert détermine la confiance qu'on peut accorder : un client qui suppose couvert ce qui ne l'est pas décide sur une fausse base, et le fournisseur s'expose.
5. Lecture seule, limitée aux ressources utiles, durée limitée à la mission, authentification renforcée et accord de confidentialité signé, exports filigranés, et journalisation complète des accès.

## 20.9 Analyse d'impact et processus de notification des violations

### 1. Comprendre simplement

L'**analyse d'impact** (*privacy impact assessment*, ou *data protection impact assessment*) est une étude, faite avant de lancer un traitement susceptible d'engendrer un risque élevé pour les personnes, qui décrit le traitement, évalue sa nécessité, ses risques et les mesures pour les réduire. Le **processus de notification des violations** (*breach notification process*) est la procédure qui, en cas de violation de données, qualifie l'événement, mesure le risque, prévient dans les délais les autorités, les clients et les personnes, et conserve la trace des décisions.

**Pourquoi cela existe.** Certains traitements (profilage, données de santé à grande échelle, surveillance systématique) exposent les personnes à des risques élevés. Mieux vaut le voir avant, quand on peut encore changer la conception. Et quand une violation survient, des délais courts, fixés par des textes, s'appliquent : sans procédure préparée, ils sont manqués.

**Problème résolu.** Identifier et réduire les risques avant le lancement ; réagir dans les délais, de façon complète, à un incident touchant des données.

**Modèle mental.** L'analyse d'impact est l'étude d'un chantier avant son ouverture : on examine ce qui peut mal tourner pour les riverains, et on adapte le plan. La notification est le plan d'évacuation affiché : on le répète pour que chacun sache qui prévenir, quand, et avec quoi.

**Où l'analogie s'arrête.** Un chantier a un début et une fin. Un traitement évolue : l'analyse se réexamine à chaque changement notable, et une violation peut se découvrir longtemps après qu'elle a eu lieu.

**Exemple.** Alpha Air veut introduire un module d'analyse automatique de photos de constats avec un modèle d'IA (voir [26.1 Cas d'usage de l'IA et passerelle de modèles](26-intelligence-artificielle.md#261-cas-dusage-de-lia-et-passerelle-de-modèles)), pouvant identifier des personnes présentes sur les photos. Le projet déclenche une analyse d'impact : description, nécessité, risques, mesures. Plus tard, un incident expose des exports de constats : la procédure de notification est activée dès la prise de connaissance.

**Les composants.**

1. les **critères de déclenchement** d'une analyse ;
2. le **modèle d'analyse** : description, nécessité, risques, mesures ;
3. l'**avis** du délégué à la protection des données ;
4. le **registre des analyses** et leur revue ;
5. la **détection** et la **qualification** d'une violation ;
6. l'**horloge** et les **destinataires** des notifications ;
7. le **journal de décisions** ;
8. les **modèles de messages**.

**Objectif d'apprentissage :** vous pouvez dire quand une analyse d'impact est requise, en décrire le contenu, et dérouler les étapes et délais d'une notification de violation.

### 2. Connaissances essentielles

#### Définition

- **Analyse d'impact** : évaluation, préalable à un traitement susceptible d'engendrer un risque élevé pour les droits et libertés des personnes, de l'impact des opérations de traitement prévues sur la protection des données (RGPD, article 35).
- **Processus de notification des violations** : ensemble d'étapes, de rôles et de délais qui encadrent la détection, la qualification, la notification et le suivi d'une violation de données.

#### Idées fondamentales

1. **On évalue avant de traiter.** L'analyse précède la mise en œuvre.
2. **Le risque élevé déclenche.** L'article 35 cite notamment l'évaluation systématique et à grande échelle fondée sur un traitement automatisé, le traitement à grande échelle de catégories particulières, et la surveillance systématique à grande échelle d'une zone accessible au public.
3. **L'analyse a un contenu minimal.** Description, nécessité et proportionnalité, risques, mesures.
4. **Une violation est un événement avec une horloge.** 72 heures pour notifier l'autorité, à partir de la prise de connaissance.
5. **Le sous-traitant prévient le responsable sans délai.** Le responsable prévient l'autorité.
6. **On notifie les personnes si le risque est élevé.** Sauf exceptions prévues.
7. **Tout est documenté.** Même les violations non notifiées.

#### Vocabulaire essentiel

- **AIPD ou DPIA** : analyse d'impact relative à la protection des données.
- **Délégué à la protection des données** (*data protection officer*, DPO) : personne chargée de conseiller et de contrôler le respect des règles de protection des données.
- **Violation de données à caractère personnel** (*personal data breach*) : atteinte à la sécurité entraînant la destruction, la perte, l'altération, la divulgation ou l'accès non autorisés à des données personnelles.
- **Prise de connaissance** (*awareness*) : moment à partir duquel le délai court.
- **Autorité de contrôle** (*supervisory authority*) : autorité chargée du contrôle de la protection des données.
- **Notification par étapes** (*phased notification*) : information fournie progressivement si tout n'est pas connu.
- **Journal des violations** (*breach register*) : registre de toutes les violations, notifiées ou non.

#### Relations de cause à effet

- L'analyse est faite après le lancement : les mesures coûtent plus cher à intégrer, ou ne sont jamais prises.
- Le délai court dès la prise de connaissance mais personne ne l'a datée : on ne peut pas prouver qu'il a été respecté.
- Le sous-traitant attend d'avoir tout compris pour prévenir : le responsable perd des heures sur ses 72.
- Les violations jugées « mineures » ne sont pas consignées : à l'audit, aucune trace de la décision de ne pas notifier.
- Les modèles de messages sont écrits pendant l'incident : retards, erreurs, informations contradictoires.

#### Idées reçues

- **« L'analyse d'impact est un formulaire. »** Non. C'est une démarche de conception, qui peut changer le projet.
- **« On notifie quand on a tout compris. »** Non. L'article 33, paragraphe 4, prévoit une information par étapes.
- **« Une violation non notifiée n'a pas à être documentée. »** Non. Le responsable documente toute violation, avec ses faits, ses effets et les mesures prises (article 33, paragraphe 5).

#### Principe clé

On évalue le risque avant de traiter, et, quand une violation survient, on date la prise de connaissance, on notifie dans les délais par étapes si nécessaire, et l'on documente chaque décision.

#### Si vous ne retenez que trois choses

1. L'analyse d'impact se fait avant le traitement quand le risque est élevé, et elle décrit, justifie, évalue les risques et prévoit des mesures.
2. Les délais de notification courent à partir de la prise de connaissance, qu'il faut dater.
3. Un sous-traitant prévient sans délai ; toute violation est documentée, notifiée ou non.

### 3. Explication technique détaillée

#### L'analyse d'impact

L'article 35 du RGPD exige une analyse préalable lorsqu'un traitement, notamment par de nouvelles technologies, est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes, en tenant compte de sa nature, de sa portée, de son contexte et de ses finalités. Il énumère, pour le cas où elle est requise : l'évaluation systématique et approfondie d'aspects personnels fondée sur un traitement automatisé, y compris le profilage, avec des décisions à effets juridiques ou significatifs ; le traitement à grande échelle de catégories particulières de données ou de données relatives aux condamnations ; la surveillance systématique à grande échelle d'une zone accessible au public.

**Contenu minimal** (paragraphe 7) :

| Élément | Question |
|---|---|
| Description | Quel traitement, quelles finalités, quel intérêt légitime poursuivi ? |
| Nécessité et proportionnalité | Le traitement est-il nécessaire et proportionné au but ? |
| Risques | Quels risques pour les droits et libertés des personnes ? |
| Mesures | Quelles garanties, mesures de sécurité et mécanismes assurent la protection ? |

Le responsable demande l'**avis du délégué à la protection des données**, s'il en a un (paragraphe 2), et, le cas échéant, recueille l'avis des personnes concernées ou de leurs représentants (paragraphe 9).

```json
{
  "dpia_id": "dpia_017",
  "title": "Analyse automatique des photos de constats",
  "status": "in_review",
  "owner": "role:product_owner",
  "dpo_opinion": null,
  "processing": {
    "purposes": ["detect_damage_from_photos"],
    "data_categories": ["images", "metadata"],
    "data_subjects": ["technicians", "bystanders"],
    "volume": "800000 photos par an",
    "recipients": ["sub_processor:vision_provider"],
    "retention_class": "maintenance_record"
  },
  "necessity": "La détection automatique réduit les délais d'examen ; des alternatives sans visages sont étudiées.",
  "risks": [
    { "id": "r1", "description": "Identification de personnes présentes sur les photos", "likelihood": "possible", "severity": "significant" },
    { "id": "r2", "description": "Transfert des images vers un fournisseur hors UE", "likelihood": "likely", "severity": "significant" }
  ],
  "measures": [
    { "risk": "r1", "measure": "Floutage des visages avant analyse", "residual": "limited" },
    { "risk": "r2", "measure": "Région européenne et contrat de sous-traitance", "residual": "limited" }
  ],
  "review_due_on": "2027-04-14"
}
```

**Quand la déclencher dans la plateforme.** Elle s'inscrit dans les processus de changement : une nouvelle fonction qui traite des catégories particulières, un nouveau sous-traitant, une nouvelle région, une nouvelle fonction d'IA ([26.9 Gouvernance et réglementation de l'IA](26-intelligence-artificielle.md#269-gouvernance-et-réglementation-de-lia)) ouvre une **revue de risque** (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)). La fiche de revue pose les questions du déclenchement ; la réponse « oui » ouvre une analyse. Elle est **vivante** : on la réexamine à chaque changement notable du traitement.

**Rôle d'un éditeur.** Pour les traitements faits pour le compte de ses clients, l'éditeur assiste le responsable : le contrat de sous-traitance prévoit qu'il l'aide à respecter ses obligations relatives aux analyses d'impact (article 28, paragraphe 3, point f). La plateforme fournit des informations (description du traitement, mesures de sécurité, sous-traitants) pour que le client réalise sa propre analyse.

#### Violations : qualifier, mesurer, notifier

```text
détection ─► triage ─► données personnelles en cause ? ─┬─ non ─► incident de sécurité (voir 11.16)
                                                         └─ oui ─► qualification ─► risque ? ─┬─ improbable ─► documenter
                                                                                              ├─ risque ─► notifier le responsable / l'autorité
                                                                                              └─ risque élevé ─► informer aussi les personnes
```

**Délais et destinataires.**

| Régime | Déclencheur | Délai | Destinataire |
|---|---|---|---|
| RGPD, article 33 | Violation de données personnelles, sauf risque improbable | Sans retard injustifié, si possible dans les 72 heures après en avoir pris connaissance | Autorité de contrôle |
| RGPD, article 33, paragraphe 2 | Le sous-traitant prend connaissance d'une violation | Dans les meilleurs délais | Le responsable du traitement |
| RGPD, article 34 | Risque élevé pour les personnes | Dans les meilleurs délais | Les personnes concernées |
| Directive NIS2, article 23 | Incident important | Alerte précoce sous 24 heures, notification sous 72 heures, rapport final sous un mois | CSIRT ou autorité compétente |
| HIPAA (États-Unis, santé) | Violation de données de santé non sécurisées | Sans retard déraisonnable, et au plus tard 60 jours calendaires après la découverte | Les personnes concernées (et autorités) |
| Contrat | Selon l'accord avec le client | Souvent plus court que la loi | Le client |

**Contenu de la notification à l'autorité** (article 33, paragraphe 3) : la nature de la violation, avec les catégories et le nombre approximatif de personnes et d'enregistrements ; le contact du délégué ou d'un point de contact ; les conséquences probables ; les mesures prises ou proposées. Si tout n'est pas connu, l'information peut être fournie **par étapes** (paragraphe 4). L'**information des personnes** (article 34) emploie un langage clair, et n'est pas exigée dans trois cas : des mesures de protection appropriées rendaient les données inintelligibles (chiffrement), des mesures ultérieures écartent le risque élevé, ou l'effort serait disproportionné (communication publique à la place).

```typescript
const HOUR_MS = 3_600_000;

interface BreachDeadlines {
  nis2EarlyWarning: string;
  authorityNotification: string;
}

function breachDeadlines(awarenessIso: string): BreachDeadlines {
  const awareness = new Date(awarenessIso).getTime();
  return {
    nis2EarlyWarning: new Date(awareness + 24 * HOUR_MS).toISOString(),
    authorityNotification: new Date(awareness + 72 * HOUR_MS).toISOString(),
  };
}
```

Pour une prise de connaissance le mardi 13 octobre 2026 à 9 h 00 (UTC), l'alerte précoce NIS2 est due le mercredi 14 à 9 h 00, et la notification à 72 heures le vendredi 16 à 9 h 00. Ces délais sont des **heures calendaires** : ils ne s'arrêtent pas le week-end.

#### Le dossier de violation

```sql
CREATE TABLE breach_case (
  id                      uuid PRIMARY KEY,
  detected_at             timestamptz NOT NULL,
  aware_at                timestamptz NOT NULL,
  personal_data_involved  boolean     NOT NULL,
  summary                 text        NOT NULL,
  affected_tenants        text[]      NOT NULL DEFAULT '{}',
  categories              text[]      NOT NULL DEFAULT '{}',
  approx_records          bigint,
  risk_level              text        CHECK (risk_level IN ('unlikely','risk','high')),
  controller_notified_at  timestamptz,
  authority_notified_at   timestamptz,
  individuals_notified_at timestamptz,
  decision_log            jsonb       NOT NULL DEFAULT '[]',
  closed_at               timestamptz
);
```

| Champ | Pourquoi |
|---|---|
| `aware_at` | L'horloge : moment de la prise de connaissance, daté et justifié |
| `affected_tenants` | Multi-tenant : qui prévenir (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) |
| `risk_level` | Détermine les notifications |
| `controller_notified_at` | Preuve de la notification du responsable, par le sous-traitant |
| `decision_log` | Chaque décision, y compris « ne pas notifier », avec motif et approbateur |

**Prise de connaissance.** Les lignes directrices des autorités de protection des données retiennent en pratique le moment où l'organisation a un degré raisonnable de certitude qu'une violation de sécurité touche des données personnelles (ces lignes directrices n'ont pas été consultées pour ce module : à confirmer). Quelle que soit la formule retenue, le moment se date et se justifie. Une alerte automatique n'est pas toujours une prise de connaissance ; la réception d'un signalement sérieux peut l'être. Le sous-traitant, lui, informe le responsable dès qu'il a connaissance de la violation, sans attendre d'avoir tout qualifié.

#### Préparer

| Préparation | Pourquoi |
|---|---|
| Rôles et astreinte nommés (voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) | Pas d'improvisation |
| Modèles de messages (clients, autorité, personnes) | Gagner des heures |
| Liste de contacts des clients et du délégué | Prévenir sans chercher |
| Exercices périodiques | Vérifier que les délais sont tenables |
| Accès aux preuves : journaux, instantanés | Qualifier vite ([9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)) |
| Cartographie des données ([20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) | Savoir ce qui est touché |

#### Modes de défaillance

- **Analyse après coup** ou jamais.
- **Heure de prise de connaissance non consignée.**
- **Sous-traitant silencieux** jusqu'à qualification complète.
- **Violations « mineures » non documentées.**
- **Messages improvisés** : contradictions, promesses.
- **Périmètre multi-tenant mal borné** : on prévient tout le monde, ou personne.
- **Exercices jamais faits** : le premier test est l'incident réel.

**Contre-exemple.** Un export de constats est exposé par un lien trop permissif. L'équipe passe quatre jours à comprendre ce qui s'est passé avant de prévenir ses clients, au motif qu'« il faut être sûr ». Le contrat prévoit 48 heures. Ses clients, responsables du traitement, perdent trois jours sur leurs 72 heures. Il fallait informer dès la prise de connaissance, puis compléter par étapes.

**Limites.** Les délais et les destinataires dépendent du droit applicable : les textes cités ne sont pas exhaustifs. La qualification du risque est un jugement. Une analyse d'impact ne supprime pas les risques ; elle les rend visibles et traités. Et le temps de réaction se prépare : on ne le crée pas pendant l'incident.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | La gestion des incidents fournit les rôles, la chronologie et les communications |
| [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données) | La cartographie des données dit ce qui est touché |
| [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | La description du traitement du registre alimente l'analyse d'impact |
| [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue) | Les contrôles et preuves nourrissent l'analyse et le dossier de violation |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les sous-traitants informent le responsable ; les contrats fixent les délais |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'audit permet de reconstituer l'événement |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La revue de changement déclenche l'analyse d'impact |
| [26.9 Gouvernance et réglementation de l'IA](26-intelligence-artificielle.md#269-gouvernance-et-réglementation-de-lia) | La gouvernance de l'IA s'appuie sur ces analyses |

### 5. Application pratique

**Situation initiale.** Alpha Air prépare une fonction d'analyse de photos par IA. Par ailleurs, la plateforme n'a jamais testé sa procédure de notification : l'astreinte ne sait ni qui prévient les clients, ni à quelle heure.

**Problème.** Aucune analyse d'impact formelle, aucune procédure de violation éprouvée.

**Application du concept.** La plateforme intègre l'analyse d'impact au processus de revue de changement et rédige puis teste une procédure de notification.

**Déroulé.**

1. La revue de changement du projet pose six questions de déclenchement ; trois réponses « oui » ouvrent l'analyse.
2. L'équipe décrit le traitement, justifie la nécessité, évalue deux risques et choisit des mesures (floutage, région européenne).
3. Le délégué à la protection des données donne son avis, qui est consigné ; l'analyse est revue dans six mois.
4. En parallèle, la plateforme rédige les modèles de messages et la liste des contacts, et organise un exercice : un faux incident déclenche l'astreinte à 14 h.
5. L'exercice montre qu'il faut 5 heures pour établir le périmètre multi-tenant : la préparation de requêtes prêtes à l'emploi le ramène à 45 minutes.

**Résultat.** Le projet est modifié avant lancement, et la procédure de violation tient dans les délais lors de l'exercice.

**Limites.** L'exercice ne reproduit pas la pression d'un incident réel : on le répète, avec des scénarios variés.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quand une analyse d'impact est-elle requise, et que doit-elle contenir ?
2. **Compréhension.** À partir de quand court le délai de notification à l'autorité, et quelle est sa durée ?
3. **Compréhension.** Que doit faire un sous-traitant qui prend connaissance d'une violation ?
4. **Pourquoi.** Pourquoi consigner aussi les violations que l'on décide de ne pas notifier ?
5. **Raisonnement pratique.** Une violation est connue le vendredi 16 octobre 2026 à 17 h 00. À quelle heure expire le délai de 72 heures, et pourquoi le week-end n'y change-t-il rien ?

#### Réponses

1. Quand un traitement est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes. Elle contient la description du traitement et de ses finalités, l'évaluation de sa nécessité et de sa proportionnalité, l'évaluation des risques et les mesures envisagées.
2. À partir de la prise de connaissance par le responsable. Le délai est de 72 heures si possible, sauf si la violation n'est pas susceptible d'engendrer un risque ; un retard doit être motivé.
3. Informer le responsable du traitement dans les meilleurs délais, sans attendre d'avoir tout qualifié, et l'assister dans ses obligations.
4. Parce que le responsable doit documenter toute violation, pour que l'autorité puisse vérifier la conformité : la décision de ne pas notifier doit être justifiée par écrit.
5. 72 heures après le vendredi 16 octobre à 17 h 00 : le lundi 19 octobre 2026 à 17 h 00. Le délai se compte en heures consécutives : il n'est pas suspendu par le week-end.

## 20.10 Transferts de données, sous-traitants et responsabilité partagée

### 1. Comprendre simplement

Un **mécanisme de transfert** (*data transfer mechanism*) est le fondement juridique qui autorise l'envoi ou la mise à disposition de données personnelles vers un pays situé hors de la zone qui les protège, par exemple hors de l'Union européenne. La **gestion des sous-traitants** (*sub-processor management*) est l'ensemble des règles par lesquelles un fournisseur choisit, déclare, contractualise et surveille les tiers qui traitent des données pour son compte. Le **modèle de responsabilité partagée** (*shared responsibility model*) répartit explicitement, entre le fournisseur d'infrastructure, la plateforme et ses clients, qui assure quelle part de la sécurité et de la conformité.

**Pourquoi cela existe.** Une plateforme repose sur des fournisseurs : hébergement, courriel, support, analyse, intelligence artificielle. Chacun traite ou voit des données de clients, parfois depuis un autre pays. Le droit demande que ces chaînes soient connues, encadrées et acceptées. Et quand un incident survient, il faut savoir qui devait faire quoi.

**Problème résolu.** Savoir et démontrer où vont les données, qui les traite, sur quel fondement, et qui répond de quoi.

**Modèle mental.** Une chaîne de livraison avec des relais. À chaque relais, un contrat, un registre, un droit de regard ; et un tableau qui dit qui conduit, qui charge, qui vérifie le colis.

**Où l'analogie s'arrête.** Un colis est à un endroit à la fois. Une donnée est copiée, mise en cache, consultée à distance par des équipes de support : les points de contact sont plus nombreux que les lieux de stockage.

**Exemple.** Alpha Air héberge ses données dans une région européenne de la plateforme. Un fournisseur d'outil de support est situé aux États-Unis. Quand un agent de support consulte un ticket qui contient des données personnelles, une mise à disposition a lieu. Elle est encadrée par un mécanisme de transfert, déclarée dans la liste des sous-traitants, et la responsabilité de la sécurité du service de support figure dans la matrice de responsabilités.

**Les composants.**

1. la **cartographie des flux** : où les données vont et qui y accède ;
2. les **mécanismes de transfert** : décision d'adéquation, clauses contractuelles types, règles d'entreprise contraignantes, dérogations ;
3. le **registre des sous-traitants** ;
4. les **conditions d'autorisation** et d'information ;
5. la **diligence** et la **surveillance** des sous-traitants ;
6. la **matrice des responsabilités** ;
7. les **clauses contractuelles** correspondantes ;
8. la **gestion des changements**.

**Objectif d'apprentissage :** vous pouvez décrire les mécanismes de transfert, les règles applicables aux sous-traitants, et lire une matrice de responsabilité partagée.

### 2. Connaissances essentielles

#### Définition

- **Mécanisme de transfert** : base juridique qui permet de communiquer des données personnelles à un destinataire situé dans un pays tiers, avec un niveau de protection jugé équivalent ou garanti.
- **Gestion des sous-traitants** : ensemble de règles et de processus pour autoriser, encadrer, informer et surveiller les tiers qui traitent des données pour le compte du fournisseur.
- **Modèle de responsabilité partagée** : répartition documentée des responsabilités de sécurité et de conformité entre plusieurs acteurs d'une chaîne de services.

#### Idées fondamentales

1. **Un transfert est un fait, pas un lieu.** C'est la mise à disposition de données à un destinataire hors de la zone, y compris par un accès à distance.
2. **Chaque transfert a un fondement.** Décision d'adéquation, clauses types, règles d'entreprise, dérogation.
3. **Le sous-traitant est autorisé.** Par le responsable, spécifiquement ou par une autorisation générale (article 28, paragraphe 2).
4. **Les obligations descendent.** Le sous-traitant ultérieur est tenu des mêmes obligations, et le premier sous-traitant reste responsable (article 28, paragraphe 4).
5. **La liste est publique et à jour.** Les clients ont besoin de savoir.
6. **La responsabilité se découpe selon la couche.** Elle varie avec le service utilisé.
7. **Ce qui n'est pas attribué n'est pas fait.** Chaque contrôle a un responsable.

#### Vocabulaire essentiel

- **Pays tiers** (*third country*) : pays hors de l'Union européenne (et de l'Espace économique européen).
- **Décision d'adéquation** (*adequacy decision*) : décision de la Commission européenne reconnaissant qu'un pays, un territoire ou un cadre offre un niveau de protection essentiellement équivalent.
- **Clauses contractuelles types** (*standard contractual clauses*, SCC) : clauses modèles approuvées par la Commission, utilisables comme fondement d'un transfert.
- **Règles d'entreprise contraignantes** (*binding corporate rules*, BCR) : règles internes d'un groupe, approuvées, qui encadrent les transferts à l'intérieur du groupe.
- **Cadre de protection des données UE–États-Unis** (*EU–US Data Privacy Framework*) : cadre à l'égard duquel la Commission a adopté une décision d'adéquation.
- **Sous-traitant ultérieur** (*sub-processor*) : sous-traitant d'un sous-traitant.
- **Sécurité « du » cloud et « dans » le cloud** (*security of / in the cloud*) : distinction entre ce que protège le fournisseur d'infrastructure et ce que protège son client.

#### Relations de cause à effet

- Le stockage reste en Europe mais le support consulte les données depuis un pays tiers : un transfert a lieu, sans fondement documenté.
- Un sous-traitant est ajouté sans information : les clients découvrent le changement, et perdent leur droit d'objection.
- Le contrat ne reporte pas les obligations sur le sous-traitant ultérieur : une chaîne comporte un maillon non engagé.
- La répartition des responsabilités n'est pas écrite : chacun suppose que l'autre chiffre, patche ou surveille.
- La liste des sous-traitants n'est pas tenue à jour : l'audit relève des écarts.

#### Idées reçues

- **« Héberger dans l'Union règle la question des transferts. »** Non. L'hébergement n'est qu'un des points de contact ; l'accès à distance, le support, la maintenance et les sous-traitants ultérieurs comptent aussi.
- **« Un fournisseur certifié est responsable de tout. »** Non. Le modèle de responsabilité partagée décrit des parts : le fournisseur sécurise son infrastructure, le client sa configuration et ses données.
- **« Un sous-traitant ultérieur n'engage pas le premier. »** Non. D'après l'article 28, paragraphe 4, si le sous-traitant ultérieur manque à ses obligations, le premier sous-traitant demeure pleinement responsable envers le responsable.

#### Principe clé

Chaque transfert a un fondement, chaque sous-traitant est connu, autorisé et engagé par contrat, et chaque contrôle de sécurité a un responsable dans une matrice partagée.

#### Si vous ne retenez que trois choses

1. Un transfert est une mise à disposition à un destinataire hors de la zone, y compris par accès à distance, et il a un fondement documenté.
2. Un sous-traitant est autorisé, déclaré, engagé par un contrat qui reprend les obligations, et le fournisseur en répond.
3. La responsabilité se découpe par couche et par service ; elle s'écrit, sinon elle s'évapore.

### 3. Explication technique détaillée

#### Résidence des données et transfert

| Notion | Question | Nature |
|---|---|---|
| Résidence des données | Où les données sont-elles stockées et traitées ? | Architecture et exploitation ([5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant), [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)) |
| Transfert | Qui, hors de la zone, peut y accéder ou les recevoir ? | Cadre juridique |

La résidence est une décision d'architecture ; le transfert est une qualification juridique. Selon l'interprétation courante des autorités de protection des données, un accès à distance depuis un pays tiers (support, maintenance) constitue un transfert, même si les données restent stockées dans la zone ; cette interprétation n'a pas été consultée dans une source officielle pour ce module, et se confirme avec le service juridique.

#### Les mécanismes

| Mécanisme | Principe | Remarque |
|---|---|---|
| Décision d'adéquation | La Commission constate que le pays ou le cadre assure un niveau de protection essentiellement équivalent | Ex. : le cadre UE–États-Unis, décision du 10 juillet 2023 (2023/1795) ; les transferts vers des entreprises américaines participantes y sont facilités |
| Clauses contractuelles types | Clauses modèles pré-approuvées par la Commission (décision d'exécution (UE) 2021/914, du 4 juin 2021) | Utilisables par des responsables ou sous-traitants soumis au RGPD vers des destinataires hors UE ; remplacent les anciennes clauses |
| Règles d'entreprise contraignantes | Règles internes d'un groupe, approuvées par les autorités | Pour les transferts internes à un groupe |
| Dérogations | Cas limités prévus par le texte (article 49) | Exceptionnelles, non systématiques |

D'après la page de la Commission européenne, la décision d'adéquation du cadre UE–États-Unis a été adoptée en juillet 2023 ; les garanties introduites du côté américain s'appliquent à tous les transferts vers des entreprises américaines quel que soit l'instrument, et appuient les clauses types et les règles d'entreprise contraignantes. Les modules des clauses types (responsable vers responsable, responsable vers sous-traitant, etc.) se lisent dans la décision elle-même. Les évolutions juridiques sont rapides : le fondement d'un transfert se **revérifie** régulièrement.

**Dans la plateforme.**

- chaque **sous-traitant** et chaque **région** porte son mécanisme de transfert dans le registre ;
- les **accès de support** depuis un pays tiers sont des flux déclarés, limités, tracés (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)) ;
- la **région de données** du tenant détermine l'emplacement du stockage et de l'index ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)) ;
- un **mode « support dans la zone »** peut être proposé aux clients qui l'exigent.

#### Le registre des sous-traitants

```sql
CREATE TABLE sub_processor (
  id                  text PRIMARY KEY,
  name                text NOT NULL,
  service             text NOT NULL,
  purposes            text[] NOT NULL,
  data_categories     text[] NOT NULL,
  processing_regions  text[] NOT NULL,
  access_regions      text[] NOT NULL,
  transfer_mechanism  text,
  contract_version    text NOT NULL,
  security_review_on  date,
  status              text NOT NULL CHECK (status IN ('proposed','active','retiring','retired')),
  active_from         date
);

CREATE TABLE sub_processor_use (
  tenant_id         uuid NOT NULL,
  sub_processor_id  text NOT NULL REFERENCES sub_processor (id),
  PRIMARY KEY (tenant_id, sub_processor_id)
);

CREATE TABLE sub_processor_change_notice (
  id                uuid PRIMARY KEY,
  sub_processor_id  text NOT NULL REFERENCES sub_processor (id),
  change_type       text NOT NULL CHECK (change_type IN ('add','replace','remove','region_change')),
  announced_on      date NOT NULL,
  effective_on      date NOT NULL,
  objection_until   date NOT NULL
);
```

Le registre indique, pour chaque sous-traitant : le **service** rendu, les **finalités**, les **catégories de données**, les **régions** de traitement et d'accès, le **mécanisme de transfert**, la version du contrat et la date de dernière revue de sécurité. La table `sub_processor_use` dit **quels tenants** sont concernés : un sous-traitant utilisé seulement pour une fonction optionnelle ne concerne que les tenants qui l'activent.

**Les règles de l'article 28.**

| Point | Règle |
|---|---|
| Autorisation | Le sous-traitant recourt à un autre sous-traitant seulement avec l'autorisation écrite préalable du responsable, spécifique ou générale (paragraphe 2) |
| Autorisation générale | Le sous-traitant informe des ajouts ou remplacements prévus, ce qui laisse au responsable la possibilité de s'y opposer |
| Engagement | Le sous-traitant ultérieur est lié par un contrat qui impose les mêmes obligations de protection (paragraphe 4) |
| Responsabilité | Le premier sous-traitant reste pleinement responsable envers le responsable de l'exécution du sous-traitant ultérieur |

**Gérer un changement.**

```text
projet de nouveau sous-traitant ─► revue de sécurité et de conformité ─► contrat avec reprise des obligations
        ─► annonce aux tenants concernés (préavis) ─► période d'objection ─► entrée en service ─► surveillance
```

Le préavis et la procédure d'objection viennent du contrat (par exemple 30 jours, valeur d'exemple). Si un client s'oppose, la plateforme propose une solution (désactiver la fonction, une alternative) ou le contrat prévoit un droit de résiliation.

#### La responsabilité partagée

La page d'un grand fournisseur d'infrastructure résume le modèle : la sécurité et la conformité y sont une responsabilité partagée entre le fournisseur et le client ; le fournisseur protège l'infrastructure qui exécute ses services (« sécurité du cloud ») ; le client sécurise ce qu'il construit et configure sur cette infrastructure (« sécurité dans le cloud ») ; la répartition varie selon le service utilisé. Certains contrôles sont **hérités**, d'autres **partagés**, d'autres propres au client.

Une plateforme SaaS ajoute une couche : elle est cliente de son fournisseur d'infrastructure, et fournisseur de ses tenants.

| Contrôle | Fournisseur d'infrastructure | Plateforme | Tenant |
|---|---|---|---|
| Sécurité physique des centres de données | Responsable | Hérite | Hérite |
| Réseau et virtualisation | Responsable | Configure | Hérite |
| Correctifs du système et de la plateforme | Partagé | Responsable | Hérite |
| Isolation des tenants | Fournit des primitives | Responsable | Hérite |
| Chiffrement au repos | Fournit les services | Responsable de la mise en œuvre | Peut apporter ses clés (voir [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) |
| Gestion des rôles et des accès des utilisateurs | — | Fournit les moyens | Responsable |
| Revue périodique des accès | — | Fournit les rapports | Responsable |
| Classification des données saisies | — | Fournit les champs de classe | Responsable (voir [20.1 Classification et inventaire des données](#201-classification-et-inventaire-des-données)) |
| Sauvegarde et restauration de la plateforme | Fournit des services | Responsable | Vérifie ses exigences |
| Détection et traitement des incidents de plateforme | — | Responsable | Informé |
| Notification d'une violation aux autorités | — | Informe le responsable sans délai | Responsable du traitement |
| Réponse aux demandes des personnes | — | Assiste | Responsable ([20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement)) |

*Cette matrice est un exemple. Elle se lit dans le contrat et la documentation de chaque service, car la répartition varie avec le service et le mode de déploiement.*

**Publier la matrice.** Elle figure dans la documentation, dans les réponses aux questionnaires et dans les contrats : un client qui ne connaît pas sa part ne la tient pas. Elle se décline en **liste de vérification** pour les administrateurs de tenant (revues d'accès, classification, durée de conservation, signalement des incidents).

**Réponses de la plateforme.**

| Zone | Pratique |
|---|---|
| Transparence | Page publique des sous-traitants, avec région et finalité |
| Contrôle | Droits d'objection, régions, options de support |
| Preuves | Rapports d'audit des sous-traitants, certifications ([20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification)) |
| Contrat | Clauses reprenant les obligations, notification d'incident, audit, sortie |
| Exploitation | Réévaluation périodique de chaque sous-traitant ; plan de sortie |

#### Modes de défaillance

- **Flux non cartographiés** : support, outils d'analyse, services de courriel.
- **Transfert sans fondement** à jour.
- **Liste des sous-traitants périmée.**
- **Changement sans préavis.**
- **Matrice de responsabilités absente** : écarts de couverture.
- **Reprise d'obligations absente** du contrat de sous-traitance ultérieure.
- **Dépendance critique** sans plan de sortie.

**Contre-exemple.** La plateforme ajoute un outil d'analyse de l'usage hébergé hors de l'Union, qui reçoit des adresses électroniques d'utilisateurs de ses tenants. Aucun registre, aucune annonce, aucun mécanisme de transfert. Un client, qui interroge son délégué à la protection des données, découvre le flux lors d'un audit : la plateforme doit stopper le flux, notifier ses clients et régulariser.

**Limites.** Les mécanismes de transfert évoluent rapidement, par décisions et jurisprudence : leur validité se revérifie. La répartition des responsabilités varie avec chaque service. La liste des sous-traitants ne dit rien de leur fiabilité : la diligence et la surveillance sont à part. Et le droit des pays tiers peut limiter l'efficacité des garanties contractuelles.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant) | La résidence des données est la face architecture du transfert |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Le routage multi-région met en œuvre la résidence |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | Les applications d'une marketplace sont des sous-traitants à encadrer |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les clés gérées par le client réduisent la dépendance |
| [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | Destinataires et transferts figurent au registre des traitements |
| [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue) | La matrice nourrit les contrôles et leurs preuves |
| [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification) | Les audits couvrent les sous-traitants |
| [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations) | Le sous-traitant informe le responsable d'une violation |
| [20.11 Instruments contractuels, régimes sectoriels et registre des risques](#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Les contrats formalisent ces engagements |

### 5. Application pratique

**Situation initiale.** Alpha Air demande à la plateforme la liste de ses sous-traitants et les fondements des transferts. L'éditeur a une liste interne vieille de 18 mois et ne sait pas dire quels tenants sont concernés.

**Problème.** Pas de registre à jour, pas de matrice de responsabilités, pas de procédure de changement.

**Application du concept.** La plateforme publie un registre des sous-traitants, documente les transferts et partage une matrice de responsabilités.

**Déroulé.**

1. L'équipe inventorie les flux : stockage, courriel, support, mesure d'usage, IA. Elle trouve deux flux non déclarés.
2. Chaque sous-traitant reçoit une fiche : service, finalités, catégories, régions, mécanisme de transfert, contrat, revue.
3. La page publique liste les sous-traitants ; les clients peuvent s'abonner aux changements.
4. Une matrice de responsabilités en trois colonnes est publiée, avec une liste de vérification pour les administrateurs de tenant.
5. Le jour où un nouveau fournisseur d'IA est envisagé, la procédure déclenche la revue de sécurité, l'analyse d'impact ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)), le contrat, et une annonce avec 30 jours d'objection.

**Résultat.** La plateforme répond précisément à la demande d'Alpha Air et gère les changements sans surprise.

**Limites.** La page publique expose aussi des informations aux concurrents et aux attaquants : on en limite le détail à ce que le contrat et la loi exigent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre résidence des données et transfert ?
2. **Compréhension.** Quels sont les principaux mécanismes de transfert ?
3. **Compréhension.** Que prévoit l'article 28 pour l'ajout d'un sous-traitant ultérieur ?
4. **Pourquoi.** Pourquoi une matrice de responsabilité partagée doit-elle être écrite et publiée ?
5. **Raisonnement pratique.** Un agent de support situé dans un pays tiers consulte, à distance, un ticket qui contient des données personnelles stockées dans l'Union. Que faut-il vérifier ?

#### Réponses

1. La résidence indique où les données sont stockées et traitées, c'est une décision d'architecture. Le transfert est la mise à disposition de données à un destinataire hors de la zone, y compris par accès à distance, c'est une qualification juridique avec un fondement requis.
2. La décision d'adéquation, les clauses contractuelles types, les règles d'entreprise contraignantes et, de façon exceptionnelle, les dérogations.
3. L'autorisation écrite préalable du responsable, spécifique ou générale ; dans le second cas, l'information des changements avec une possibilité d'objection. Le sous-traitant ultérieur est lié par les mêmes obligations, et le premier sous-traitant reste responsable.
4. Parce que sans répartition explicite, chaque acteur suppose que l'autre assure un contrôle, et des zones ne sont couvertes par personne. Publiée, elle permet au client de connaître sa part.
5. Que l'accès est déclaré comme un flux, qu'il dispose d'un mécanisme de transfert valide (adéquation, clauses types), que l'agent est un sous-traitant autorisé et engagé, que l'accès est limité, justifié et tracé, et que le tenant a été informé selon le contrat.

## 20.11 Instruments contractuels, régimes sectoriels et registre des risques

### 1. Comprendre simplement

Les **instruments contractuels** (*contractual instruments*) sont les documents qui engagent juridiquement le fournisseur et son client : les **conditions d'utilisation** (*terms of service*), qui fixent les règles du service ; l'**accord de traitement des données** (*data processing agreement*), qui encadre le traitement de données personnelles pour le compte du client ; l'**accord de niveau de service** (*service level agreement*), qui fixe les engagements de disponibilité et de support. Les **régimes sectoriels** (*sector regimes*) sont les règles propres à un secteur (aéronautique, santé, paiement, finance) qui s'ajoutent au cadre général. Le **registre des risques** (*risk register*) est la liste tenue à jour des risques identifiés, de leur niveau, de leurs traitements et de leurs responsables.

**Pourquoi cela existe.** Une plateforme configurable est vendue à des organisations soumises à des règles très différentes. Les engagements doivent être écrits, versionnés, et reliés à ce que la plateforme fait vraiment. Les secteurs réglementés imposent des obligations précises (conservation, notification, sous-traitance). Et les décisions de sécurité ne se prennent bien que sur une vue d'ensemble des risques.

**Problème résolu.** Rendre les engagements précis, vérifiables et exécutables ; connaître les obligations propres à chaque secteur ; piloter les risques de façon visible.

**Modèle mental.** Un dossier de maintenance d'un avion : le contrat dit ce qui est dû, le règlement du secteur dit ce qui est obligatoire, et le registre des risques dit ce qui peut mal tourner et ce qu'on fait pour l'éviter.

**Où l'analogie s'arrête.** Un dossier est écrit pour un appareil. Ici, un même produit est vendu à des centaines de clients, avec des variantes contractuelles, et le logiciel doit appliquer des paramètres qui découlent de ces contrats.

**Exemple.** Le contrat d'Alpha Air stipule : région de données « eu-west », notification d'une violation sous 48 heures, 30 jours de préavis pour un nouveau sous-traitant, disponibilité de 99,9 %. La plateforme lit ces paramètres comme de la configuration. Pour les enregistrements de maintenance, le régime sectoriel de la maintenance aéronautique impose des durées de conservation et des protections que la plateforme traduit en classes et en contrôles.

**Les composants.**

1. les **documents contractuels** et leurs versions ;
2. les **paramètres contractuels** exploitables par la plateforme ;
3. l'**historique d'acceptation** ;
4. les **régimes sectoriels** et leurs exigences ;
5. les **configurations sectorielles** (classes de conservation, rôles, rapports) ;
6. le **registre des risques** : description, niveau, traitement, responsable ;
7. la **revue périodique** et le lien avec les incidents, les analyses d'impact et les audits.

**Objectif d'apprentissage :** vous pouvez distinguer les instruments contractuels, expliquer comment des clauses deviennent des paramètres de la plateforme, citer des exemples de régimes sectoriels, et décrire un registre des risques.

### 2. Connaissances essentielles

#### Définition

- **Conditions d'utilisation** : règles générales d'usage du service, de responsabilité, de résiliation, qui s'appliquent à l'ensemble des utilisateurs.
- **Accord de traitement des données** : contrat qui lie un responsable du traitement et un sous-traitant, et fixe l'objet, la durée, la nature, la finalité du traitement, les types de données, les catégories de personnes, ainsi que les obligations du sous-traitant (RGPD, article 28, paragraphe 3).
- **Accord de niveau de service** : engagement chiffré sur la disponibilité, les délais de support et les réparations en cas de manquement (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).
- **Régime sectoriel** : ensemble de règles propres à un secteur d'activité, qui complètent le cadre général.
- **Registre des risques** : enregistrement central des risques courants d'un périmètre, avec leur évaluation, leur traitement et leur responsable.

#### Idées fondamentales

1. **Un contrat est une donnée.** Ses paramètres pilotent la plateforme.
2. **Les documents ont un ordre de préséance.** En cas de conflit, l'accord spécifique l'emporte sur les conditions générales, selon ce que le contrat prévoit.
3. **Le contenu minimal d'un accord de traitement est connu.** L'article 28, paragraphe 3, le fixe.
4. **Un régime sectoriel se traduit en configuration.** Conservation, rôles, preuves, notifications.
5. **Le risque se qualifie et se traite.** Réduire, transférer, accepter ou éviter.
6. **Un risque accepté est une décision.** Avec un responsable, une date et une revue.
7. **Le registre est vivant.** Il se nourrit des incidents, des audits et des analyses d'impact.

#### Vocabulaire essentiel

- **Préséance** (*order of precedence*) : ordre dans lequel les documents s'appliquent en cas de contradiction.
- **Avoir de service** (*service credit*) : réparation financière en cas de manquement à l'accord de niveau de service.
- **Régime sectoriel** (*sector regime*) : règles propres à un secteur.
- **Risque inhérent, résiduel** (*inherent risk*, *residual risk*) : risque avant les mesures, puis après.
- **Traitement du risque** (*risk treatment*) : réduire, transférer, accepter, éviter.
- **Appétence au risque** (*risk appetite*) : niveau de risque que l'organisation accepte de porter.
- **Propriétaire du risque** (*risk owner*) : personne qui répond du traitement.

#### Relations de cause à effet

- Les contrats sont dans des documents sans lien avec la plateforme : les engagements ne sont pas appliqués, et la différence n'est découverte que lors d'un litige.
- La préséance n'est pas claire : les clients revendiquent la version la plus favorable.
- Le secteur est ignoré : la plateforme efface des enregistrements que la réglementation impose de garder.
- Le registre des risques est un tableur rempli une fois : il ne reflète ni les incidents ni les audits.
- Un risque est « accepté » sans décision : personne n'en répond.

#### Idées reçues

- **« Les conditions d'utilisation suffisent. »** Non. Les clients qui confient des données personnelles attendent un accord de traitement ; ceux qui ont des exigences de service, un accord de niveau de service.
- **« La réglementation sectorielle est l'affaire du client. »** Pas seulement : la plateforme doit permettre au client de la respecter, et peut être elle-même visée comme fournisseur.
- **« Un registre des risques est un exercice de conformité. »** Non. C'est un outil de décision sur ce que l'on traite d'abord, et ce que l'on accepte.

#### Principe clé

Les engagements contractuels sont versionnés et traduits en paramètres que la plateforme applique ; les régimes sectoriels se traduisent en classes, rôles et preuves ; les risques sont enregistrés, traités et décidés par des responsables.

#### Si vous ne retenez que trois choses

1. Un contrat se lit par la plateforme sous forme de paramètres : région, délais, préavis, disponibilité.
2. Un régime sectoriel se traduit en configuration vérifiable, pas en simple mention.
3. Un registre des risques sert à décider : chaque risque a un niveau, un traitement, un responsable et une date de revue.

### 3. Explication technique détaillée

#### Les trois instruments

| Instrument | Objet | Qui l'accepte | Contenu type | Lien technique |
|---|---|---|---|---|
| Conditions d'utilisation | Règles générales d'usage | L'administrateur du tenant, parfois chaque utilisateur | Usages interdits, responsabilités, résiliation | Journal d'acceptation par version |
| Accord de traitement des données | Traitement de données personnelles pour le compte du client | Le client, responsable du traitement | Contenu de l'article 28, paragraphe 3 | Paramètres : sous-traitants, délais, suppression, audit |
| Accord de niveau de service | Engagements de disponibilité et de support | Le client | Objectifs, mesures, avoirs, exclusions | SLO, mesures et calcul des avoirs ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) |

**Le contenu de l'accord de traitement.** L'article 28, paragraphe 3, exige un contrat qui précise l'objet, la durée, la nature et la finalité du traitement, le type de données et les catégories de personnes, les obligations et droits du responsable, et qui impose au sous-traitant notamment de : ne traiter que sur instruction documentée ; assurer la confidentialité des personnes autorisées ; mettre en œuvre les mesures de sécurité de l'article 32 ; respecter les conditions pour recruter un autre sous-traitant ; aider le responsable à répondre aux demandes des personnes ; l'aider à respecter ses obligations de sécurité, de notification et d'analyse d'impact ; supprimer ou restituer les données au terme des services ; fournir les informations nécessaires à la démonstration du respect des obligations et permettre les audits.

| Obligation du contrat | Où le module l'a traitée |
|---|---|
| Instructions documentées, transferts | [20.2 Registre des traitements, minimisation et limitation des finalités](#202-registre-des-traitements-minimisation-et-limitation-des-finalités), [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) |
| Sécurité | [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue), [11.3 Chiffrement](11-securite-fiabilite-operations.md#113-chiffrement) |
| Sous-traitants ultérieurs | [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) |
| Aide aux demandes des personnes | [20.4 Droits des personnes et gestion du consentement](#204-droits-des-personnes-et-gestion-du-consentement) |
| Aide à la sécurité, à la notification, à l'analyse d'impact | [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations) |
| Suppression ou restitution | [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers), [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression) |
| Information et audits | [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification) |

#### Le contrat comme donnée

```json
{
  "tenant": "ten_airline_01",
  "contract_version": "2026-03",
  "documents": [
    { "type": "terms_of_service", "version": "v6", "accepted_by": "usr_admin_01", "accepted_at": "2026-03-04T09:12:00Z" },
    { "type": "data_processing_agreement", "version": "v4", "accepted_by": "usr_admin_01", "accepted_at": "2026-03-04T09:12:00Z" },
    { "type": "service_level_agreement", "version": "gold-2026", "accepted_by": "usr_admin_01", "accepted_at": "2026-03-04T09:12:00Z" }
  ],
  "terms": {
    "region": "eu-west",
    "breach_notification_hours": 48,
    "subprocessor_change_notice_days": 30,
    "retention_after_termination_days": 30,
    "audit_rights": { "frequency_per_year": 1, "notice_days": 30 },
    "availability_target_pct": 99.9
  }
}
```

Chaque paramètre est **lu** par un mécanisme de la plateforme :

| Paramètre | Mécanisme |
|---|---|
| `region` | Routage et stockage par région ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données), [5.8 Données et permissions propres au tenant](05-multi-tenancy-modele-entreprise.md#58-données-et-permissions-propres-au-tenant)) |
| `breach_notification_hours` | Horloge du dossier de violation ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) |
| `subprocessor_change_notice_days` | Préavis des changements de sous-traitants ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) |
| `retention_after_termination_days` | Procédure de sortie du client ([24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression), [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) |
| `audit_rights` | Planification des audits clients ([20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification)) |
| `availability_target_pct` | Objectif de niveau de service et calcul des avoirs ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) |

L'**acceptation** est consignée (qui, quand, quelle version) : une modification des conditions déclenche une nouvelle acceptation. Les écarts du contrat par rapport au modèle standard (avenants) sont des **exceptions** documentées ([9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)), pour éviter qu'un client aux clauses particulières se perde dans la masse.

#### Les régimes sectoriels

| Régime | Domaine | Ce qu'il impose (extraits consultés) | Effet sur la plateforme |
|---|---|---|---|
| EASA Part-145, point 145.A.55 | Maintenance aéronautique (UE) | Conservation des copies des enregistrements détaillés de maintenance et des données associées pendant trois ans à compter de la remise en service ; protection contre les dommages, l'altération et le vol ; matériel de sauvegarde situé dans un lieu distinct ; copie du certificat de remise en service remise au propriétaire ou à l'exploitant | Classe de conservation propre, stockage immuable ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)), exports vers l'exploitant |
| HIPAA, règle de notification | Santé (États-Unis) | Notification des personnes sans retard déraisonnable et au plus tard 60 jours calendaires après la découverte d'une violation de données de santé non sécurisées | Procédure de violation avec délai spécifique ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) |
| PCI DSS | Paiement | S'applique aux entités qui stockent, traitent ou transmettent des données de titulaires de cartes, ou qui peuvent affecter la sécurité de leur environnement | Réduction du périmètre par délégation du traitement des cartes à un prestataire, segmentation |
| NIS2 | Entités essentielles et importantes (UE) | Alerte précoce sous 24 heures, notification sous 72 heures, rapport final sous un mois | Procédure et rôles ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) |
| DORA | Entités financières (UE) | Applicable depuis le 17 janvier 2025 ; registre d'information des accords avec les prestataires de services TIC ; exigences contractuelles | Registre, clauses, droits d'audit ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) |

*Les éléments du tableau proviennent des sources consultées (voir les références) ; pour la maintenance aéronautique, le texte consolidé du règlement (UE) n° 1321/2014 est à confirmer. Le droit et les régimes évoluent : la liste est un exemple, pas un recensement.*

**Traduire un régime en configuration.** Une solution sectorielle ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) emporte avec elle : des classes de conservation, des rôles et des séparations de tâches, des modèles de document, des rapports de preuve, des procédures de notification. Le tenant les active ; la plateforme les rend vérifiables ([20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)).

```json
{
  "sector_pack": "aviation_maintenance",
  "retention_classes": [
    { "code": "maintenance_record", "trigger": "release_to_service", "duration_months": 36, "immutable": true }
  ],
  "roles": ["certifying_staff", "quality_manager", "auditor"],
  "evidence_reports": ["records_retention_status", "access_to_records_log"],
  "exports": [{ "type": "release_certificate_copy", "to": "aircraft_owner_or_operator" }]
}
```

*La durée de 36 mois est un exemple tiré de l'extrait consulté ; elle se confirme dans le texte applicable.*

#### Le registre des risques

La définition du glossaire du NIST décrit un registre des risques comme un enregistrement central des risques courants pour un périmètre donné, qui couvre à la fois les risques acceptés et ceux qui ont un traitement prévu, et comme un lieu de stockage de ce que l'on sait des risques dans le temps.

```sql
CREATE TABLE risk (
  id                   text PRIMARY KEY,
  title                text NOT NULL,
  description          text NOT NULL,
  category             text NOT NULL,
  likelihood           integer NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
  impact               integer NOT NULL CHECK (impact BETWEEN 1 AND 5),
  residual_likelihood  integer CHECK (residual_likelihood BETWEEN 1 AND 5),
  residual_impact      integer CHECK (residual_impact BETWEEN 1 AND 5),
  treatment            text NOT NULL CHECK (treatment IN ('mitigate','transfer','accept','avoid')),
  owner_role           text NOT NULL,
  status               text NOT NULL CHECK (status IN ('open','treating','accepted','closed')),
  next_review_on       date NOT NULL
);

SELECT id, title, likelihood * impact AS score
  FROM risk
 WHERE status <> 'closed'
 ORDER BY score DESC, next_review_on
 LIMIT 10;
```

| Champ | Rôle |
|---|---|
| Vraisemblance et impact | Échelle de 1 à 5 chacune ; le score est leur produit |
| Résiduel | Niveau après les mesures ; l'écart mesure l'effet du traitement |
| Traitement | Réduire (mesures), transférer (assurance, contrat), accepter (décision), éviter (arrêter l'activité) |
| Propriétaire | La personne qui répond du traitement |
| Revue | Date de la prochaine revue |

**Exemple chiffré.** Un risque « fuite par un sous-traitant de support » : vraisemblance 3, impact 4, score $3 \times 4 = 12$. Après des mesures (minimisation, masquage, contrat renforcé), vraisemblance 2, impact 4 : résiduel $2 \times 4 = 8$. Avec un seuil d'exemple de 15 pour « élevé » et de 9 pour « acceptable sans autre action », le résiduel est acceptable, la décision est consignée et le risque est revu dans six mois.

**Alimenter le registre.**

| Source | Ce qu'elle apporte |
|---|---|
| Incidents ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) | Risques réalisés ou évités de peu |
| Audits ([20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification)) | Constats ouverts, risques acceptés |
| Analyses d'impact ([20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations)) | Risques résiduels des traitements |
| Revue des sous-traitants ([20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) | Risques fournisseurs |
| Modélisation des menaces ([11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces)) | Risques techniques |
| Planification de capacité, dette technique ([11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité), [21.11 Dette technique et enregistrement des décisions d'architecture](21-livraison-qualite-logicielle.md#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)) | Risques d'exploitation |

**Gouvernance.** Une instance régulière (comité des risques) examine les risques élevés, décide des traitements et des acceptations, et rend compte à la direction. Un risque accepté est une **décision** avec une personne, une date, une justification et une durée : il n'est pas un risque ignoré.

#### Modes de défaillance

- **Contrats hors système** : les paramètres ne sont pas appliqués.
- **Préséance floue.**
- **Obligation sectorielle ignorée** : suppression d'enregistrements à conserver.
- **Registre figé** : jamais alimenté par la réalité.
- **Risques acceptés sans décision.**
- **Score sans traitement** : on mesure et on ne fait rien.
- **Avenants non tracés** : on ne sait plus ce qui a été promis à qui.

**Contre-exemple.** Un client aéronautique a négocié dans son contrat une notification de violation sous 24 heures. L'avenant est archivé par l'équipe juridique, mais la plateforme applique le paramètre standard de 72 heures. Lors d'un incident, le délai contractuel est dépassé de quarante-huit heures. Le paramètre doit être une donnée du tenant, appliquée par la procédure.

**Limites.** Un contrat ne remplace pas la confiance ni la réalité opérationnelle. Les régimes sectoriels sont nombreux, nuancés et évolutifs : leur traduction demande de la veille juridique et des experts. Un score de risque est un outil de comparaison, pas une mesure objective. Et la liste des instruments dépend du marché et des juridictions.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | L'accord de niveau de service s'appuie sur les objectifs et mesures |
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | Les incidents alimentent le registre des risques |
| [20.7 Cadres de conformité, contrôles, preuves et conformité continue](#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue) | Les contrôles et preuves démontrent le respect des engagements |
| [20.8 Audit interne et externe, attestation et certification](#208-audit-interne-et-externe-attestation-et-certification) | Les audits vérifient le respect et enrichissent le registre |
| [20.9 Analyse d'impact et processus de notification des violations](#209-analyse-dimpact-et-processus-de-notification-des-violations) | Les délais de notification suivent loi et contrat |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les clauses sur les sous-traitants et les transferts |
| [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances) | Les solutions sectorielles emportent les configurations de conformité |
| [24.7 Départ du client : sortie, restitution et certificat de suppression](24-cycle-vie-client-support.md#247-départ-du-client--sortie-restitution-et-certificat-de-suppression) | Les clauses de sortie du client |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | Les durées de conservation sectorielles |

### 5. Application pratique

**Situation initiale.** Alpha Air signe avec la plateforme un contrat qui comporte une notification de violation sous 48 heures, une région européenne et des obligations de conservation propres à la maintenance aéronautique. Les engagements sont dans un classeur du service juridique.

**Problème.** Aucun lien entre le contrat et la plateforme, aucune configuration sectorielle, aucun suivi des risques liés.

**Application du concept.** La plateforme traduit le contrat en paramètres, active la solution sectorielle de maintenance et inscrit les risques au registre.

**Déroulé.**

1. Le contrat est enregistré avec ses versions et ses paramètres : région, délais, préavis, disponibilité.
2. L'acceptation des conditions et de l'accord de traitement est consignée avec l'identité et la version.
3. La solution sectorielle active la classe de conservation des enregistrements de maintenance, les rôles de personnel habilité et les rapports de preuve.
4. Le registre des risques reçoit trois entrées liées au client : dépendance à un sous-traitant de support, délai de notification de 48 heures, conservation immuable.
5. Une revue semestrielle contrôle que les paramètres sont appliqués et que les risques sont traités.

**Résultat.** Les engagements sont appliqués par le système, vérifiables, et les risques ont un propriétaire.

**Limites.** Un avenant négocié ultérieurement doit entrer dans le système avec les mêmes soins : sans cela, la plateforme et le contrat divergent.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre conditions d'utilisation, accord de traitement et accord de niveau de service ?
2. **Compréhension.** Citez trois obligations qu'un accord de traitement doit imposer au sous-traitant.
3. **Compréhension.** Comment un régime sectoriel se traduit-il dans une plateforme ?
4. **Pourquoi.** Pourquoi les paramètres contractuels doivent-ils être des données lues par la plateforme ?
5. **Raisonnement pratique.** Un risque a une vraisemblance de 4 et un impact de 5 ; après mesures, 2 et 5. Quels sont les scores initial et résiduel, et que dire de l'écart ?

#### Réponses

1. Les conditions d'utilisation fixent les règles générales d'usage ; l'accord de traitement encadre le traitement de données personnelles pour le compte du client ; l'accord de niveau de service fixe des engagements chiffrés de disponibilité et de support.
2. Par exemple : ne traiter que sur instruction documentée du responsable ; assurer la confidentialité des personnes autorisées ; mettre en œuvre les mesures de sécurité requises ; respecter les conditions applicables aux sous-traitants ultérieurs ; supprimer ou restituer les données à la fin du service ; permettre les audits.
3. En classes de conservation, rôles, preuves, procédures et exports, activés dans la solution sectorielle et rendus vérifiables par des contrôles.
4. Parce qu'un engagement écrit seulement dans un document n'est ni appliqué ni vérifié : le système peut agir en contradiction avec le contrat sans que personne le voie.
5. Initial : $4 \times 5 = 20$ ; résiduel : $2 \times 5 = 10$. L'écart de 10 points mesure l'effet des mesures sur la vraisemblance ; l'impact, inchangé, reste à 5, ce qui justifie un suivi.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Registre des traitements | RGPD, article 30 | [gdpr-info.eu](https://gdpr-info.eu/art-30-gdpr/) | 20.2 |
| Définitions | RGPD, article 4 | [gdpr-info.eu](https://gdpr-info.eu/art-4-gdpr/) | 20.2, 20.3, 20.4 |
| Principes, catégories particulières, bases légales | RGPD, articles 5, 6 et 9 | [art. 5](https://gdpr-info.eu/art-5-gdpr/), [art. 6](https://gdpr-info.eu/art-6-gdpr/), [art. 9](https://gdpr-info.eu/art-9-gdpr/) | 20.1, 20.2, 20.4 |
| Données anonymes | RGPD, considérant 26 | [gdpr-info.eu](https://gdpr-info.eu/recitals/no-26/) | 20.3 |
| Droits des personnes | RGPD, chapitre III et article 12 | [chapitre III](https://gdpr-info.eu/chapter-3/), [art. 12](https://gdpr-info.eu/art-12-gdpr/) | 20.4 |
| Droit à l'effacement et exceptions | RGPD, article 17 | [gdpr-info.eu](https://gdpr-info.eu/art-17-gdpr/) | 20.4 |
| Sous-traitants | RGPD, article 28 | [gdpr-info.eu](https://gdpr-info.eu/art-28-gdpr/) | 20.8, 20.10, 20.11 |
| Analyse d'impact | RGPD, article 35 | [gdpr-info.eu](https://gdpr-info.eu/art-35-gdpr/) | 20.9 |
| Notification des violations | RGPD, articles 33 et 34 | [art. 33](https://gdpr-info.eu/art-33-gdpr/), [art. 34](https://gdpr-info.eu/art-34-gdpr/) | 20.9 |
| Clauses contractuelles types | Commission européenne, page sur les clauses contractuelles types | [commission.europa.eu](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en) | 20.10 |
| Cadre de protection des données UE–États-Unis | Commission européenne, page sur les transferts UE–États-Unis | [commission.europa.eu](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en) | 20.10 |
| Responsabilité partagée | AWS, *Shared Responsibility Model* | [Page AWS](https://aws.amazon.com/compliance/shared-responsibility-model/) | 20.10 |
| Contrôles lisibles par machine | NIST, OSCAL | [pages.nist.gov/OSCAL](https://pages.nist.gov/OSCAL/) | 20.7 |
| Norme ISO/IEC 27001 | Description encyclopédique (la page de l'ISO n'était pas accessible) | [Wikipédia](https://en.wikipedia.org/wiki/ISO/IEC_27001) | 20.7, 20.8 |
| Sécurité des données de paiement | PCI Security Standards Council, page PCI DSS | [pcisecuritystandards.org](https://www.pcisecuritystandards.org/standards/pci-dss/) | 20.7, 20.11 |
| Attestation SOC 2 | AICPA (page d'ensemble) et sources secondaires pour les types 1 et 2 | [AICPA](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) ; résultats de recherche | 20.7, 20.8 |
| Lignage | OpenLineage | [openlineage.io](https://openlineage.io/docs/) | 20.5 |
| Contrat de données | Open Data Contract Standard (Bitol) | [bitol-io.github.io](https://bitol-io.github.io/open-data-contract-standard/latest/) | 20.6 |
| Dimensions de qualité | DAMA UK, groupe de travail 2013 ; cadre qualité des données du gouvernement britannique | Résultats de recherche (sources secondaires) | 20.5 |
| Notification d'incident (directive NIS2) | Directive (UE) 2022/2555, article 23 | [nis-2-directive.com](https://www.nis-2-directive.com/NIS_2_Directive_Article_23.html) (source secondaire) | 20.9, 20.11 |
| Notification de violation (santé, États-Unis) | 45 CFR 164.404 | [Cornell LII](https://www.law.cornell.edu/cfr/text/45/164.404) | 20.9, 20.11 |
| Conservation des enregistrements de maintenance | EASA Part-145, point 145.A.55 (règlement (UE) n° 1321/2014) | Résultats de recherche citant le texte | 20.11 |
| Résilience opérationnelle numérique | Règlement (UE) 2022/2554 (DORA) | Résultats de recherche (sources secondaires) | 20.11 |
| Registre des risques | NIST, glossaire, *risk register* | [csrc.nist.gov](https://csrc.nist.gov/glossary/term/risk_register) | 20.11 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Le texte intégral de la directive NIS2, du règlement DORA, du règlement (UE) n° 1321/2014 (EASA Part-145) et de la décision d'exécution (UE) 2021/914 : les éléments cités viennent de pages secondaires ou de résumés de recherche. Les décisions d'adéquation et les clauses types se lisent dans les textes officiels.
- Les lignes directrices des autorités de protection des données (prise de connaissance d'une violation, accès à distance comme transfert, évaluation des transferts) : non consultées.
- La description des types 1 et 2 de SOC 2 et de la période d'observation, du cycle de certification d'ISO/IEC 27001 et de l'édition 2022 de la norme : sources secondaires ou encyclopédiques ; les textes des normes ne sont pas lus.
- Les dimensions de qualité de DAMA UK et la norme ISO/IEC 25012 : sources secondaires.
- Le mode de calcul des délais en mois pour les demandes des personnes : à confirmer avec le service juridique.
- Les valeurs chiffrées de durées de conservation, de seuils de risque, de préavis, de scores et de volumes : ce sont des valeurs d'exemple.
- Les formats de contrat de données, de lignage, de contrôle et de pack sectoriel : formats propres à la plateforme fictive, inspirés des standards cités, sans conformité revendiquée.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; les extraits TypeScript ont été contrôlés syntaxiquement, et le calcul de délais a été exécuté.
