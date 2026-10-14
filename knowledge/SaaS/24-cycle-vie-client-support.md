# Module 24 — Cycle de vie client, support et réussite client

> **Question directrice.** Comment amener un client à la valeur, le soutenir, puis le laisser partir proprement en lui restituant ses données ?

## Présentation du module

**Objectif.** Le cours décrit le cycle de vie **technique** d'un tenant : provisionnement, états, suspension, suppression ([1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement), [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)). Mais le client ne vit pas seulement dans le produit. Il est activé, accompagné, soutenu, puis il renouvelle ou il part. Ce module décrit, du point de vue de la plateforme, la relation qui entoure le tenant : les parcours, les signaux et les procédures que la plateforme doit porter pour que les équipes de réussite client, de support, d'exploitation et de conformité puissent faire leur travail. Il couvre l'arrivée (intégration, migration de données, modèles de départ), la vie du compte (adoption, santé, scénarios de réussite, support, communication d'état) et le départ (sortie, restitution, suppression, renouvellement et analyse des départs).

**Prérequis.** Le cycle de vie SaaS et le provisionnement ([1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement), [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)), l'import et l'export ([3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)), la délégation ([4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)), l'administration inter-tenants et l'accès de support ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)), la gestion des incidents ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) et la découvrabilité avec la mesure d'adoption ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)).

**Un mot, plusieurs sens.** Quatre mots changent de sens selon l'équipe qui parle. L'**activation** est tantôt le passage technique d'un tenant à l'état « actif » ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)), tantôt le moment où le client obtient une première valeur ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur)) : ce module emploie le second sens, et dit « état actif » pour le premier. Le **niveau de support** désigne tantôt une formule commerciale (standard, premium), tantôt un échelon interne (premier niveau, deuxième niveau) : [24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support) distingue les deux. Le **départ** (*churn*) désigne la perte d'un client ou la perte de revenu : [24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients) sépare les deux mesures. Enfin la **maintenance** est ici une opération planifiée qui peut interrompre ou dégrader le service, et non la maintenance aéronautique du fil rouge.

**Ordre retenu.** Trois groupes, de l'arrivée au départ.

```text
Arrivée       intégration, activation, délai de mise en valeur ─ migration de données, modèles de départ
Vie du compte adoption, score de santé ─ scénarios de réussite ─ niveaux de support, accès du support ─ page d'état, maintenance
Départ        sortie, restitution, certificat de suppression ─ renouvellement et analyse des départs
```

| Groupe | Question de l'équipe |
|---|---|
| Arrivée | Comment le client arrive-t-il à une première valeur, avec ses données, le plus vite possible ? |
| Vie du compte | Comment sait-on qu'un compte va bien ou mal, que fait-on alors, et comment le soutient-on et le tient-on informé ? |
| Départ | Comment le client part-il avec ses données, sans que des copies subsistent, et que retire-t-on de chaque départ ? |

**Références.** Les articles, documentations et textes cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié. Plusieurs notions de ce module sont des termes de pratique sans définition normative : elles sont présentées comme des définitions de travail.

## Sommaire du module

- [24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur)
- [24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ)
- [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte)
- [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)
- [24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support)
- [24.6 Page d'état, communication d'incident et fenêtre de maintenance](#246-page-détat-communication-dincident-et-fenêtre-de-maintenance)
- [24.7 Départ du client : sortie, restitution et certificat de suppression](#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)
- [24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients)

## 24.1 Intégration, activation et délai de mise en valeur

### 1. Comprendre simplement

Le **parcours d'intégration** (*onboarding*) mène un nouveau tenant de la signature, ou de l'essai, à un usage autonome : accès, configuration, données, formation. L'**activation** (*activation*) est le moment où le tenant atteint, de façon observable, le premier résultat qui prouve la valeur du produit. Le **délai de mise en valeur** (*time to value*) est le temps écoulé entre un point de départ, le plus souvent la création du tenant, et cette activation.

**Pourquoi cela existe.** Un client qui a signé n'a pas encore reçu de valeur. Plus la valeur tarde, plus le risque qu'il renonce augmente : c'est une hypothèse de pratique, qui se vérifie sur ses propres cohortes. Sans définition de l'activation, personne ne sait si l'intégration réussit ; sans mesure du délai, personne ne sait où elle ralentit.

**Problème résolu.** Donner à l'équipe un objectif observable (le tenant est-il activé ?), une mesure (en combien de temps ?) et des leviers (qu'est-ce qui retarde ?).

**Modèle mental.** Une salle de sport. L'abonnement ne fait pas le sportif : il est suivi d'un bilan, d'un premier programme et d'une première séance menée à bien. On mesure le nombre de jours entre l'inscription et cette première séance.

**Où l'analogie s'arrête.** Un adhérent est une personne. Un tenant est une organisation, avec des rôles, des intégrations et des données à migrer : l'activation y est collective et dépend de plusieurs personnes.

**Exemple.** Alpha Air (`ten_airline_01`) est provisionnée le 1er septembre 2026. Le 4, sa flotte est importée ; le 8, dix utilisateurs sont invités ; le 12, le premier constat est clos de bout en bout. La règle d'activation du produit exige ces trois jalons : Alpha Air est activée le 12 septembre, 11,3 jours après le provisionnement.

**Les composants.**

1. le **point de départ** de la mesure ;
2. les **jalons** de l'intégration ;
3. la **règle d'activation** ;
4. la **mesure du délai** de mise en valeur ;
5. le **responsable** de chaque jalon : client ou éditeur ;
6. les **leviers** : modèles de départ, import, formation ;
7. le **suivi par cohorte** ;
8. les **alertes de blocage**.

**Objectif d'apprentissage :** vous pouvez définir l'activation d'un produit, mesurer un délai de mise en valeur sur des cohortes et décrire un parcours d'intégration par jalons.

### 2. Connaissances essentielles

#### Définition

- **Intégration** : parcours organisé qui mène un nouveau tenant à un usage autonome du produit.
- **Activation** : événement, ou ensemble d'événements, observable dans les données de la plateforme, qui atteste que le tenant a obtenu une première valeur.
- **Délai de mise en valeur** : durée entre le point de départ (provisionnement ou signature) et l'activation.

#### Idées fondamentales

1. **L'intégration est un processus, l'activation un résultat.** Un parcours réussi peut durer des semaines ; l'activation est un instant.
2. **L'activation se définit par des événements observables.** Pas par une impression : une connexion n'est pas une valeur.
3. **L'activation est collective dans un produit d'entreprise.** Elle suppose plusieurs rôles et plusieurs jalons, pas une action isolée.
4. **Le délai se lit en distribution.** Médiane et centile élevé, pas moyenne ; et les tenants non encore activés comptent.
5. **Chaque jalon a un responsable.** Le client, l'éditeur ou les deux ; sans responsable, le jalon dérive.
6. **La définition se valide.** Une règle d'activation vaut si les tenants activés restent et renouvellent plus que les autres.
7. **La mesure respecte les règles du tenant.** Statistiques d'usage, finalité déclarée, consentement ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)).

#### Vocabulaire essentiel

- **Jalon** (*milestone*) : étape observable du parcours : flotte importée, utilisateurs invités.
- **Règle d'activation** (*activation rule*) : condition, sur des jalons, qui définit l'activation.
- **Cohorte** (*cohort*) : ensemble de tenants provisionnés dans une même période.
- **Taux d'activation** (*activation rate*) : part d'une cohorte activée dans une fenêtre donnée.
- **Moment de révélation** (*aha moment*) : premier instant où l'utilisateur perçoit la valeur ; terme de pratique, non normatif.
- **Point mort** (*stall*) : tenant qui n'avance plus dans le parcours.
- **Libre-service, guidé, accompagné** (*self-serve, guided, assisted*) : trois modèles d'intégration selon l'effort humain de l'éditeur.

#### Relations de cause à effet

- L'activation est définie par une connexion. Presque tous les tenants sont « activés », et le chiffre ne prédit rien.
- Le délai est calculé seulement sur les tenants activés. Les tenants bloqués disparaissent de la moyenne, et le délai paraît bon.
- Les jalons n'ont pas de responsable. Le client attend l'éditeur, l'éditeur attend le client, et rien n'avance.
- L'intégration est identique pour tous. Un petit tenant est submergé d'étapes inutiles, un grand tenant manque d'accompagnement.
- Les données n'arrivent pas. Le tenant reste devant un produit vide ([24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ)).

#### Idées reçues

- **« Activé veut dire connecté. »** Non. Une connexion mesure l'accès, pas la valeur.
- **« Plus l'intégration est riche, meilleure elle est. »** Non. Chaque étape ajoutée retarde la première valeur ; on retire ce qui n'est pas nécessaire à l'activation.
- **« Le délai de mise en valeur est une mesure de l'éditeur. »** Il dépend aussi du client : disponibilité des personnes, qualité des données, décisions internes.

#### Principe clé

On définit l'activation par des jalons observables, on mesure le délai par cohortes en comptant les tenants non activés, et l'on réduit ce délai en retirant les freins plutôt qu'en ajoutant des étapes.

#### Si vous ne retenez que trois choses

1. L'activation est un résultat observable, défini par des jalons, pas une connexion.
2. Le délai de mise en valeur se mesure par cohortes, en distribution, avec les tenants non activés.
3. Chaque jalon a un responsable, et la règle d'activation se valide sur la rétention.

### 3. Explication technique détaillée

#### Trois notions à ne pas confondre

| Notion | Nature | Question | Mesure |
|---|---|---|---|
| Intégration | Un processus conduit par des personnes et des outils | Que fait-on avec le client ? | Avancement par jalons |
| Activation | Un événement observable | Le client a-t-il obtenu sa première valeur ? | Taux d'activation à N jours |
| Délai de mise en valeur | Une durée | Combien de temps cela a-t-il pris ? | Médiane et centile élevé par cohorte |

Le cadre dit « AARRR » (*acquisition, activation, retention, referral, revenue*), attribué à Dave McClure, distingue l'activation de l'acquisition et de la rétention : elle répond à la question « les personnes entrées font-elles ce que nous attendons d'elles ? » (d'après des résultats de recherche, sources secondaires). Les définitions du délai de mise en valeur varient d'un fournisseur à l'autre : il n'existe pas de définition normative. On en fixe une, on la documente, et on la garde.

#### Définir l'activation

Une règle d'activation utile a quatre qualités :

1. **Observable** : elle repose sur des événements que la plateforme enregistre.
2. **Significative** : elle correspond à un résultat, pas à une visite.
3. **Atteignable** : un tenant bien accompagné l'atteint en jours ou en semaines, pas en mois.
4. **Prédictive** : les tenants qui l'atteignent restent et renouvellent davantage. On le vérifie par comparaison de cohortes.

Dans un produit d'entreprise, la règle est de niveau **tenant** et combine plusieurs jalons, éventuellement de plusieurs rôles. Une règle de niveau **utilisateur** complète : « le technicien a clos un premier constat ».

```json
{
  "onboarding_plan": {
    "pack": "acme.mro-aviation",
    "segment": "airline_mid_market",
    "milestones": [
      { "key": "bases_configured", "owner": "customer", "target_day": 2, "evidence": "event:base.created count>=2" },
      { "key": "fleet_imported", "owner": "customer", "target_day": 5, "evidence": "event:import.completed type=aircraft" },
      { "key": "users_invited_10", "owner": "customer", "target_day": 7, "evidence": "users.active count>=10" },
      { "key": "first_finding_closed", "owner": "customer", "target_day": 10, "evidence": "event:finding.closed" }
    ],
    "activation": { "requires": ["fleet_imported", "users_invited_10", "first_finding_closed"], "window_days": 30 },
    "assistance": { "model": "guided", "kickoff": "day_1", "checkpoints": ["day_7", "day_14"] }
  }
}
```

La règle est une donnée versionnée ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) : changer la définition de l'activation change l'historique des chiffres, donc on garde la version de règle avec chaque mesure.

```typescript
interface MilestoneEvent {
  tenantId: string;
  milestone: string;
  at: string;
}

interface ActivationRule {
  required: string[];
  windowDays: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function activationDate(events: MilestoneEvent[], rule: ActivationRule): string | null {
  let latest = 0;
  for (const milestone of rule.required) {
    const first = events
      .filter((e) => e.milestone === milestone)
      .map((e) => Date.parse(e.at))
      .sort((a, b) => a - b)[0];
    if (first === undefined) {
      return null;
    }
    latest = Math.max(latest, first);
  }
  return new Date(latest).toISOString();
}

function timeToValueDays(provisionedAt: string, activatedAt: string | null): number | null {
  if (activatedAt === null) {
    return null;
  }
  return (Date.parse(activatedAt) - Date.parse(provisionedAt)) / DAY_MS;
}
```

L'activation est la date du **dernier** jalon requis atteint. Avec les trois jalons d'Alpha Air (4, 8 et 12 septembre), `activationDate` renvoie le 12 septembre à 15 h 45 et `timeToValueDays` donne 11,3 jours pour un provisionnement le 1er septembre à 8 h. Si un jalon manque, la fonction renvoie `null` : le tenant n'est pas activé. *Le paramètre `windowDays` n'est pas exploité par cet extrait : il sert à calculer le taux d'activation à N jours.*

#### Mesurer le délai

$$\text{délai}_t = \text{date d'activation}_t - \text{date de provisionnement}_t$$

$$\text{taux d'activation à } N \text{ jours} = \frac{\text{tenants de la cohorte activés dans les } N \text{ jours}}{\text{tenants de la cohorte}}$$

Deux précautions. D'abord, on rapporte toujours le **taux d'activation** avec le délai : une médiane calculée sur les seuls tenants activés est biaisée par omission, puisque les tenants bloqués en sont absents. Ensuite, on suit des **cohortes** : mélanger des tenants provisionnés il y a deux ans et la semaine dernière donne un chiffre sans signification.

```sql
-- Taux d'activation à 30 jours et délai médian, par cohorte mensuelle de provisionnement
SELECT date_trunc('month', t.provisioned_at)::date AS cohort,
       count(*)                                    AS tenants,
       count(a.activated_at)                       AS activated,
       round(100.0 * count(*) FILTER (WHERE a.activated_at <= t.provisioned_at + interval '30 days') / count(*), 1)
                                                   AS activation_rate_30d,
       round((percentile_cont(0.5) WITHIN GROUP (
                ORDER BY extract(epoch FROM (a.activated_at - t.provisioned_at)) / 86400
              ) FILTER (WHERE a.activated_at IS NOT NULL))::numeric, 1)
                                                   AS median_ttv_days
  FROM tenant t
  LEFT JOIN tenant_activation a ON a.tenant_id = t.tenant_id
 WHERE t.provisioned_at >= $1
   AND t.provisioned_at <  $2
 GROUP BY 1
 ORDER BY 1;
```

La médiane d'une cohorte immature est provisoire : les tenants qui s'activeront plus tard n'y sont pas encore. On interprète une cohorte récente avec son taux d'activation, pas seulement avec son délai.

#### Le parcours d'intégration

```text
Signature ─► Provisionnement ─► Configuration ─► Données ─► Utilisateurs ─► Première valeur
  (vente)     (plateforme)       (modèle de      (import)    (invitations,   (activation)
                                 départ)                     rôles, SSO)
```

| Étape | Qui fait | Frein fréquent | Levier |
|---|---|---|---|
| Provisionnement | La plateforme | Échec d'une intégration tierce | Reprise automatique ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)) |
| Configuration | Le client, avec l'éditeur | Page blanche, trop d'options | Modèle de départ ([24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ), [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) |
| Données | Le client | Fichiers sales, formats variés | Outil d'import et rapport d'erreurs ([24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ)) |
| Utilisateurs | Le client | Annuaire non connecté | SSO et provisionnement d'utilisateurs ([4.12 SCIM](04-identite-iam-autorisation.md#412-scim)) |
| Première valeur | Les utilisateurs | Rôle sans tâche, vues vides | Parcours guidés et listes de démarrage ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)) |

**Trois modèles selon le segment.**

| Modèle | Effort de l'éditeur | Quand | Mesure typique |
|---|---|---|---|
| Libre-service | Aucun, produit et aide en ligne | Petits tenants, produit simple | Taux d'activation à 7 jours |
| Guidé | Rendez-vous de lancement et points d'étape | Tenants moyens | Respect des jalons |
| Accompagné | Équipe projet, plan partagé | Grands comptes, intégrations lourdes | Date de mise en production |

#### Alerter sur les blocages

Un tenant est en **point mort** quand un jalon dépasse sa date cible de plus d'un seuil : par exemple la flotte n'est pas importée au 8e jour. L'alerte alimente un scénario de réussite ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)) : message, appel, aide à l'import. Les événements d'intégration restent des statistiques d'usage : agrégées par tenant, avec finalité déclarée, sans suivi individuel inutile ([20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).

**Modes de défaillance.**

- **Activation définie par une connexion.**
- **Délai calculé sur les seuls tenants activés.**
- **Cohortes mélangées.**
- **Jalons sans responsable.**
- **Parcours unique** pour tous les segments.
- **Règle jamais validée** sur la rétention.

**Contre-exemple.** Une équipe définit l'activation comme « un utilisateur s'est connecté deux fois ». Le taux d'activation affiche 91 %, le délai médian 3 jours : le tableau de bord est vert. Pourtant, à six mois, 40 % de ces tenants « activés » n'ont jamais saisi un constat. La règle mesurait l'accès, pas la valeur, et l'équipe a investi dans l'accueil de comptes qui n'avançaient pas.

**Limites.** Une règle d'activation est une hypothèse sur ce qui prédit la rétention : elle se révise avec les données. Un délai court n'est pas un objectif en soi : forcer un tenant à « activer » vite avec des données mal migrées donne une valeur de façade. Enfin, certains tenants ont des contraintes (validation interne, achat d'intégrations) qui allongent le délai sans faute de l'éditeur : on segmente avant de comparer.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | L'intégration est la première étape du cycle de vie du client |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Le provisionnement est le point de départ technique de la mesure |
| [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité) | La découvrabilité et la mesure d'adoption fournissent listes de démarrage et événements |
| [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances) | Le paquet de solution porte la configuration que le client reçoit |
| [24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ) | La migration de données et les modèles de départ réduisent le délai |
| [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte) | L'activation est le premier signal du score de santé |
| [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client) | Un point mort déclenche un scénario de réussite |
| [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | La finalité et la minimisation encadrent les mesures d'usage |

### 5. Application pratique

**Situation initiale.** L'éditeur de `acme.mro-aviation` constate que ses nouveaux tenants mettent en moyenne 6 semaines à produire leur premier constat clos, et que 20 % d'entre eux n'y arrivent jamais dans les 90 jours.

**Problème.** Personne ne sait où le parcours ralentit, ni si le chiffre de 6 semaines est représentatif.

**Application du concept.** L'équipe définit une règle d'activation, instrumente les jalons et suit des cohortes mensuelles.

**Déroulé.**

1. Elle définit l'activation : flotte importée, dix utilisateurs invités, premier constat clos.
2. Elle instrumente les trois jalons comme événements et enregistre la date de chacun.
3. Elle calcule, par cohorte, le taux d'activation à 30 jours et le délai médian : 58 % et 23 jours.
4. Elle compare les tenants selon la date de l'import de la flotte : ceux qui importent avant le 5e jour s'activent en 11 jours en médiane, les autres en 34.
5. Elle conclut que l'import est le frein principal, et lance un outil d'import avec rapport d'erreurs et un modèle de départ ([24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ)).
6. Elle ajoute une alerte : flotte non importée au 8e jour, déclenchement d'un appel d'aide.

**Résultat.** Trois mois plus tard, le taux d'activation à 30 jours passe de 58 % à 74 %, et le délai médian de 23 à 15 jours (valeurs d'exemple).

**Limites.** La corrélation entre import précoce et activation rapide n'est pas une preuve de causalité : des tenants motivés importent vite et s'activent vite. L'effet de l'outil d'import se confirme par comparaison avec une cohorte témoin.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre intégration, activation et délai de mise en valeur ?
2. **Compréhension.** Quelles qualités doit avoir une règle d'activation ?
3. **Compréhension.** Pourquoi rapporte-t-on le taux d'activation avec le délai ?
4. **Pourquoi.** Pourquoi suit-on des cohortes plutôt qu'une moyenne globale ?
5. **Raisonnement pratique.** Un tenant est provisionné le 1er du mois à 8 h. Ses trois jalons requis sont atteints le 4, le 9 et le 15 à 8 h. Quel est son délai de mise en valeur ?

#### Réponses

1. L'intégration est le processus d'accueil ; l'activation est l'événement observable qui atteste la première valeur ; le délai est la durée entre le point de départ et l'activation.
2. Elle est observable, significative (un résultat, pas une visite), atteignable en jours ou semaines, et prédictive de la rétention.
3. Parce qu'un délai calculé seulement sur les tenants activés est biaisé : les tenants bloqués en sont absents. Le taux dit quelle part de la cohorte est effectivement arrivée à la valeur.
4. Parce que des tenants provisionnés à des dates très différentes n'ont pas le même parcours, ni le même produit : une moyenne globale mélange des situations qui ne se comparent pas.
5. L'activation est la date du dernier jalon, le 15 à 8 h : le délai est de 14 jours.

## 24.2 Migration de données à l'intégration et modèles de départ

### 1. Comprendre simplement

La **migration de données à l'intégration** (*onboarding data migration*) charge dans le tenant les données que le client possède déjà : aéronefs, historique de constats, utilisateurs, pièces. Un **modèle de départ** (*starter template*) est une configuration préremplie, avec des types, des états, des rôles, des vues et parfois des données d'exemple, qui permet de démarrer sans page blanche.

**Pourquoi cela existe.** Une plateforme vide n'apporte rien. Entre la signature et la première valeur, il faut modéliser le domaine et charger les données : ce sont les deux principaux consommateurs de délai ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur)). Les modèles de départ réduisent le premier, la migration outillée réduit le second.

**Problème résolu.** Raccourcir le chemin entre un tenant vide et un tenant utile, sans corrompre les données ni noyer le client sous des erreurs incompréhensibles.

**Modèle mental.** Un déménagement avec des cartons étiquetés et une pièce déjà meublée de l'essentiel. Les cartons suivent un plan (ce qui va où), un inventaire à l'arrivée vérifie que rien ne manque, et la pièce meublée évite de partir de zéro.

**Où l'analogie s'arrête.** Un déménagement est unique et irréversible. Une migration se répète (essais, complément final) et ses données ont des liens entre elles (références, historique) qu'un carton ne connaît pas.

**Exemple.** Alpha Air exporte de son ancien outil 14 200 constats historiques et 410 aéronefs en fichiers CSV. L'outil d'import associe les colonnes aux champs, valide chaque ligne, présente un rapport : 14 031 lignes valides, 169 rejetées avec la raison. Sophie corrige les 169 lignes dans le fichier, relance, et le chargement se fait en 9 minutes, sans doublon ni notification.

**Les composants.**

1. l'**extraction** depuis la source ;
2. le **mappage** des colonnes vers les champs ;
3. la **validation** et le rapport d'erreurs ;
4. l'**essai à blanc** ;
5. le **chargement** idempotent, par lots ;
6. la **réconciliation** avec la source ;
7. la **bascule** et le retour arrière ;
8. le **modèle de départ** et ses données d'exemple.

**Objectif d'apprentissage :** vous pouvez décrire un parcours de migration de données, expliquer pourquoi il est idempotent et sans effets de bord, et distinguer un modèle de départ d'un paquet de solution.

### 2. Connaissances essentielles

#### Définition

- **Migration de données à l'intégration** : chargement initial, contrôlé et vérifié, des données existantes d'un client dans son tenant.
- **Modèle de départ** : configuration préremplie appliquée à la création d'un tenant, qui fournit une structure de travail utilisable immédiatement.

#### Idées fondamentales

1. **La migration est le chemin critique de la première valeur.** Sans données, le produit est vide.
2. **Elle suit une chaîne : extraire, mapper, valider, charger, réconcilier.** Chaque étape produit un résultat vérifiable.
3. **On essaie à blanc avant de charger.** Les erreurs se découvrent sans rien écrire.
4. **Le chargement est idempotent.** Une clé externe stable permet de rejouer sans doublon.
5. **L'import n'a pas d'effets de bord.** Pas de notification, d'automatisation ni d'événement métier pour 14 000 enregistrements historiques.
6. **Les erreurs sont lisibles par le client.** Ligne, colonne, raison, correction attendue.
7. **Un modèle de départ est une base, pas une contrainte.** Le client l'adapte.

#### Vocabulaire essentiel

- **Clé externe** (*external key*) : identifiant de l'enregistrement dans le système source.
- **Table de correspondance** (*mapping table*) : association entre valeurs source et valeurs cibles.
- **Zone d'attente** (*staging area*) : stockage intermédiaire où les lignes sont validées avant le chargement.
- **Rapport d'erreurs** (*error report*) : liste des lignes rejetées avec leur motif.
- **Réconciliation** (*reconciliation*) : comparaison des comptes et des sommes entre source et cible.
- **Lot d'import** (*import batch*) : ensemble de lignes chargées ensemble, identifié et annulable.
- **Données d'exemple** (*sample data*) : jeu fictif, supprimable, pour explorer le produit.
- **Gabarit de tenant** (*tenant blueprint*) : configuration copiée à la création ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)).

#### Relations de cause à effet

- Le chargement n'est pas idempotent. Une reprise après une erreur double les enregistrements.
- Les automatisations restent actives pendant l'import. Le chargement de 14 000 constats historiques déclenche 14 000 notifications.
- Les erreurs sont rapportées en bloc. Le client ne sait pas quoi corriger et ouvre un ticket.
- Aucune réconciliation n'est faite. Des lignes manquantes se découvrent des semaines plus tard.
- Le modèle de départ est figé et copié sans lien. Il ne reçoit jamais les améliorations du produit.

#### Idées reçues

- **« Importer, c'est charger un fichier. »** Non. C'est un parcours de validation, de correspondance, de reprise et de vérification.
- **« Les données historiques doivent être identiques à la source. »** Pas exactement : les dates et auteurs d'origine se conservent comme données, mais l'import est lui-même tracé et ne se confond pas avec l'activité du client.
- **« Un modèle de départ, c'est un paquet de solution. »** Non. Le paquet est installé et mis à niveau ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) ; le modèle est une préconfiguration de choix à la création, que le tenant s'approprie.

#### Principe clé

On migre par une chaîne vérifiée, idempotente et sans effets de bord, avec des erreurs lisibles ; et l'on démarre d'un modèle de départ que le client adapte.

#### Si vous ne retenez que trois choses

1. La migration suit une chaîne : mapper, valider, essai à blanc, charger de façon idempotente, réconcilier.
2. Elle n'émet ni notification ni événement métier, et ses erreurs sont lisibles par le client.
3. Le modèle de départ est une base adaptable, distincte du paquet qui évolue.

### 3. Explication technique détaillée

#### La chaîne de migration

```text
Source (fichiers, API, connecteur)
   │ extraire                         formats déclarés : encodage, séparateur, dates
   ▼
Zone d'attente
   │ mapper                           colonnes → champs ; valeurs → listes de référence
   ▼
Lignes mappées
   │ valider                          types, obligatoires, références, unicité
   ▼
Rapport d'erreurs  ◄── essai à blanc : rien n'est écrit
   │ corriger et relancer
   ▼
Chargement idempotent (par lots)     clé externe, ordre des dépendances
   │
   ▼
Réconciliation ─► validation par le client ─► bascule
```

**Le format des fichiers.** Les fichiers CSV sont le format d'échange le plus fréquent, mais le RFC 4180, qui les décrit, indique lui-même qu'il n'est pas une norme et qu'il n'existe pas de spécification formelle, ce qui laisse une grande variété d'interprétations. L'outil d'import déclare donc explicitement ses attentes : encodage, séparateur, ligne d'en-tête, guillemets, format des dates, et refuse ou signale ce qu'il ne comprend pas.

```json
{
  "import_mapping": {
    "resource_type": "acme.resource_type.finding",
    "source": { "format": "csv", "encoding": "utf-8", "delimiter": ",", "header": true, "date_format": "YYYY-MM-DD" },
    "external_key": "ref_nc",
    "columns": [
      { "source": "ref_nc", "target": "external_key", "required": true },
      { "source": "immat", "target": "aircraft", "transform": "lookup_by_registration", "required": true },
      { "source": "gravite", "target": "severity", "transform": "map_values", "values": { "mineure": "minor", "majeure": "major", "critique": "critical" } },
      { "source": "date_ouverture", "target": "opened_on", "transform": "parse_date" }
    ],
    "on_unmapped_value": "reject_row",
    "side_effects": "suppressed"
  }
}
```

**La validation par ligne.**

```typescript
interface FindingRow {
  externalKey: string;
  aircraftRegistration: string;
  severity: string;
  openedOn: string;
}

interface RowError {
  field: string;
  code: string;
}

const SEVERITIES = ["minor", "major", "critical"];
const knownAircraft = new Set(["F-ABCD", "F-EFGH"]);

function validateRow(row: FindingRow): RowError[] {
  const errors: RowError[] = [];
  if (row.externalKey.trim() === "") {
    errors.push({ field: "externalKey", code: "required" });
  }
  if (!knownAircraft.has(row.aircraftRegistration)) {
    errors.push({ field: "aircraftRegistration", code: "unknown_reference" });
  }
  if (!SEVERITIES.includes(row.severity)) {
    errors.push({ field: "severity", code: "invalid_value" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.openedOn)) {
    errors.push({ field: "openedOn", code: "invalid_date" });
  }
  return errors;
}
```

Une ligne conforme (`NC-2019-0412`, `F-ABCD`, `major`, `2019-04-12`) renvoie une liste vide. Une ligne `NC-2020-0031` avec l'immatriculation `F-ZZZZ`, la gravité `grave` et la date `12/03/2020` renvoie trois erreurs : référence inconnue, valeur invalide, date invalide. Le rapport présente chaque erreur avec le numéro de ligne, la colonne source, la valeur reçue et la correction attendue.

#### Essai à blanc, chargement idempotent

Les lignes arrivent d'abord dans une **zone d'attente**, identifiées par un lot. L'essai à blanc valide et résume sans toucher aux données du tenant :

```sql
CREATE TABLE import_row (
  tenant_id     uuid    NOT NULL,
  batch_id      uuid    NOT NULL,
  row_number    integer NOT NULL,
  resource_type text    NOT NULL,
  external_key  text    NOT NULL,
  payload       jsonb   NOT NULL,
  status        text    NOT NULL CHECK (status IN ('pending', 'valid', 'rejected', 'loaded')),
  errors        jsonb   NOT NULL DEFAULT '[]',
  PRIMARY KEY (tenant_id, batch_id, row_number)
);

-- Synthèse de l'essai à blanc
SELECT resource_type, status, count(*) AS rows
  FROM import_row
 WHERE tenant_id = $1
   AND batch_id = $2
 GROUP BY resource_type, status
 ORDER BY resource_type, status;

-- Chargement idempotent : rejouable, sans écraser les enregistrements modifiés ensuite par les utilisateurs
INSERT INTO finding (tenant_id, external_key, data, source, import_batch_id)
SELECT r.tenant_id, r.external_key, r.payload, 'migration', r.batch_id
  FROM import_row r
 WHERE r.tenant_id = $1
   AND r.batch_id = $2
   AND r.status = 'valid'
ON CONFLICT (tenant_id, external_key)
DO UPDATE SET data = EXCLUDED.data,
              import_batch_id = EXCLUDED.import_batch_id
        WHERE finding.source = 'migration';
```

La clé externe unique est ce qui rend le chargement **idempotent** : le second passage met à jour au lieu de dupliquer. La documentation de l'interface de programmation de Salesforce recommande de même d'utiliser l'opération d'insertion-ou-mise-à-jour plutôt que l'insertion pour éviter les doublons, en s'appuyant sur un champ d'identifiant externe (d'après des extraits consultés par recherche, la page n'ayant pas pu être lue). La clause `WHERE finding.source = 'migration'` protège les enregistrements que les utilisateurs ont modifiés depuis : leur source n'est plus `migration`, et le rechargement ne les écrase pas.

**Les règles de chargement.**

| Règle | Pourquoi |
|---|---|
| Ordre des dépendances : aéronefs avant constats | Un constat référence un aéronef ([2.6 Relation et référence](02-donnees-ressources.md#26-relation-et-référence)) |
| Lots de taille bornée, reprenables | Une panne ne recommence pas tout ; la charge reste maîtrisée ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |
| Classe de traitement « lot » | L'import ne dégrade pas l'interactif des autres tenants ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)) |
| Automatisations et notifications suspendues | Pas de 14 000 messages pour des données historiques ([8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement), [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes)) |
| Dates et auteurs d'origine conservés comme données | L'historique reste lisible ; l'import est tracé à part ([9.2 Acteur, horodatage, avant et après, motif](09-audit-versionnement-gouvernance.md#92-acteur-horodatage-avant-et-après-motif)) |
| Quotas contrôlés avant chargement | Éviter un échec à mi-parcours ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) |
| Pièces jointes par un chemin dédié | Taille, analyse antimalware, quarantaine ([18.3 Téléversement direct et téléversement fractionné reprenable](18-fichiers-documents-contenus.md#183-téléversement-direct-et-téléversement-fractionné-reprenable), [18.4 Validation, analyse antimalware et quarantaine](18-fichiers-documents-contenus.md#184-validation-analyse-antimalware-et-quarantaine)) |

#### La réconciliation et la bascule

La réconciliation compare ce qui a été chargé à ce qui a été extrait : nombre d'enregistrements par type, sommes de contrôle sur des champs numériques, échantillon relu par le client. Le tenant valide par une **recette** : l'administrateur signe que les comptes et l'échantillon sont conformes. La **bascule** gèle la source, charge le complément (les enregistrements créés depuis le premier chargement) et ouvre le tenant. Le lot est **annulable** : l'identifiant de lot permet de retirer ce qu'il a créé tant que les données n'ont pas été modifiées par des utilisateurs.

#### Les modèles de départ

Un modèle de départ contient :

| Élément | Exemple |
|---|---|
| Types et champs | Aéronef, constat, tâche, avec leurs champs usuels |
| États et règles | Cycle de vie du constat, règles de gravité |
| Rôles | Technicien, responsable qualité, planificateur |
| Vues et tableaux de bord | Constats ouverts, flotte immobilisée |
| Listes de référence | Catégories de constat |
| Données d'exemple | Une flotte fictive de cinq aéronefs, supprimable en une action |

Un modèle se décline par segment : petit opérateur, compagnie moyenne, grand compte. Il se **versionne** ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), et la création d'un tenant enregistre la version utilisée.

**Modèle de départ et paquet.**

| Critère | Modèle de départ | Paquet de solution ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)) |
|---|---|---|
| Nature | Préconfiguration de choix, copiée à la création | Produit installé, avec identité et version |
| Lien avec l'origine | Aucun après la copie | Maintenu : mises à niveau et fusion ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](23-solutions-verticales-packagees.md#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) |
| Évolution | Le tenant en est propriétaire | Le tenant surcharge, l'éditeur fait évoluer |
| Usage | Démarrage rapide, apprentissage | Produit durable |

Dans une plateforme qui dispose de paquets, le modèle de départ se réalise comme un **profil de paramètres d'installation** ([23.2 Versionnement, données d'amorçage et paramètres d'installation](23-solutions-verticales-packagees.md#232-versionnement-données-damorçage-et-paramètres-dinstallation)) appliqué à un paquet, avec des données d'exemple : le tenant garde ainsi le lien avec le produit et reçoit ses évolutions, tout en démarrant d'une configuration choisie.

**Modes de défaillance.**

- **Chargement non idempotent.**
- **Automatisations actives** pendant l'import.
- **Erreurs rapportées en bloc**, sans ligne ni raison.
- **Aucune réconciliation.**
- **Import qui écrase** les modifications des utilisateurs.
- **Modèle de départ figé**, jamais mis à jour.

**Contre-exemple.** Un client charge 40 000 constats historiques. Les règles d'escalade restent actives : chaque constat « critique » ouvert envoie un message à la direction. En dix minutes, 6 200 courriels partent, le fournisseur de messagerie suspend le domaine de l'éditeur pour comportement abusif, et les notifications de tous les tenants sont retardées. Le mode d'import sans effets de bord et la classe de traitement « lot » auraient évité l'incident.

**Limites.** La migration de données n'est jamais mécanique : les données sources ont leurs propres incohérences, que seul le client sait trancher. Un outil d'import générique ne remplace pas un projet pour les grands comptes. Et la réconciliation ne prouve pas que les données sont **justes**, seulement qu'elles sont **arrivées** : la qualité reste à la charge de la source et du client ([20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'import et l'export sont les mécanismes de base |
| [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence) | L'idempotence rend le chargement rejouable |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Le gabarit de tenant est l'ancêtre du modèle de départ |
| [10.10 Synchronisation, ETL, import et export](10-api-integrations-extensibilite.md#1010-synchronisation-etl-import-et-export) | La synchronisation, l'ETL et l'import partagent les mêmes principes |
| [23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances) | Le paquet est le produit qui reçoit les choix du modèle de départ |
| [23.2 Versionnement, données d'amorçage et paramètres d'installation](23-solutions-verticales-packagees.md#232-versionnement-données-damorçage-et-paramètres-dinstallation) | Les paramètres d'installation et les données d'exemple réalisent le modèle |
| [24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur) | La migration est le frein principal du délai de mise en valeur |
| [22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge) | L'import est du travail de classe « lot », équitable avec les autres tenants |
| [20.5 Catalogue de données, lignage et qualité des données](20-gouvernance-donnees-conformite.md#205-catalogue-de-données-lignage-et-qualité-des-données) | La qualité des données migrées se mesure par des règles |

### 5. Application pratique

**Situation initiale.** Alpha Air quitte un outil de suivi des constats. Elle doit charger 410 aéronefs et 14 200 constats historiques, sans interrompre ses opérations ni inonder sa direction de notifications.

**Problème.** Un fichier CSV d'origine incohérent (dates mixtes, gravités libres, immatriculations avec des espaces) et un tenant avec des règles d'escalade actives.

**Application du concept.** Un import outillé : mappage, validation, essai à blanc, chargement idempotent sans effets de bord, réconciliation.

**Déroulé.**

1. Sophie dépose les fichiers ; l'outil propose un mappage des colonnes, qu'elle ajuste (la gravité « critique » vers `critical`).
2. L'essai à blanc donne 14 031 lignes valides et 169 rejetées, avec le rapport : 112 immatriculations inconnues, 41 dates invalides, 16 gravités non mappées.
3. Léa corrige les immatriculations dans le fichier, Sophie la table de gravités ; la seconde passe à blanc donne 0 rejet.
4. Le chargement s'exécute en classe « lot », en 9 minutes, avec automatisations et notifications suspendues ; les dates d'ouverture d'origine sont conservées.
5. La réconciliation compare : 410 aéronefs et 14 200 constats chargés, mêmes sommes de contrôle ; Sophie relit un échantillon de 50 constats et signe la recette.
6. À la bascule, un chargement complémentaire reprend les constats créés dans l'ancien outil depuis l'export ; le lot reste annulable pendant 7 jours.

**Résultat.** Le tenant est utile le jour de la bascule : toute la flotte et son historique sont présents, sans doublon ni message parasite.

**Limites.** 37 constats dont le texte contenait des informations personnelles de passagers ont dû être revus avec le délégué à la protection des données avant chargement ([20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données)). Et la bonne volonté du client reste nécessaire : l'outil ne corrige pas les données à sa place.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les étapes d'une chaîne de migration ?
2. **Compréhension.** Pourquoi un chargement doit-il être idempotent ?
3. **Compréhension.** Pourquoi suspend-on les automatisations pendant un import ?
4. **Pourquoi.** Pourquoi la réconciliation ne suffit-elle pas à garantir la qualité des données ?
5. **Raisonnement pratique.** Quelle différence y a-t-il entre appliquer un modèle de départ et installer un paquet de solution, pour la mise à jour future ?

#### Réponses

1. Extraire, mapper, valider, essayer à blanc, charger par lots de façon idempotente, réconcilier, puis valider avec le client et basculer.
2. Pour pouvoir rejouer le chargement après une erreur sans créer de doublons : une clé externe stable fait que le second passage met à jour au lieu de dupliquer.
3. Parce que des enregistrements historiques ne sont pas des événements nouveaux : sans suspension, chacun déclencherait des notifications et des actions, avec un volume qui peut saturer les canaux de messagerie.
4. Parce qu'elle compare ce qui est arrivé à ce qui a été extrait : elle montre que les données sont **toutes là**, pas qu'elles sont **correctes**. Les erreurs de la source sont chargées fidèlement.
5. Un modèle de départ est copié à la création, puis le tenant en est propriétaire sans lien avec l'origine : aucune évolution ne lui parvient. Un paquet reste lié à son éditeur : il reçoit les mises à niveau, fusionnées avec ses surcharges.

## 24.3 Mesures d'adoption et score de santé du compte

### 1. Comprendre simplement

Une **mesure d'adoption** (*adoption metric*) dit dans quelle mesure un compte utilise le produit : combien de personnes, quelles capacités, à quelle fréquence, avec quelle tendance. Un **score de santé du compte** (*account health score*) est un indicateur de synthèse qui agrège plusieurs signaux (usage, support, sentiment, relation, contrat) en une note ou une couleur, pour repérer les comptes à risque et ceux qui ont du potentiel.

**Pourquoi cela existe.** Une plateforme sert des centaines de tenants. L'équipe de réussite client ne peut pas suivre chacun par intuition. Les mesures rendent visibles les comptes qui s'éloignent ; le score ordonne l'attention. La mesure d'adoption d'une capacité ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)) est un instrument de produit : ici, elle devient un indicateur de la relation avec le compte.

**Problème résolu.** Prioriser l'attention humaine et déclencher des actions ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)) avant que la décision de partir soit prise.

**Modèle mental.** Le tableau de bord d'une voiture : plusieurs jauges (vitesse, température, carburant) et un voyant de synthèse. Le voyant ne dit pas pourquoi : il dit où regarder.

**Où l'analogie s'arrête.** Les jauges d'une voiture sont étalonnées par le constructeur. Un score de santé est un modèle construit à partir d'hypothèses sur ce qui précède un départ : il doit être calibré, et il peut se tromper.

**Exemple.** Alpha Air a un score de 67, donc jaune. Ses signaux : usage 80 (poids 0,40), support 60 (0,25), sentiment 70 (0,20), relation 40 (0,15). Le signal le plus faible est la relation : le sponsor exécutif a changé. Le score déclenche un scénario de réussite client.

**Les composants.**

1. les **signaux** par famille ;
2. la **normalisation** de chaque signal sur une échelle commune ;
3. les **poids** ;
4. le **score** et ses **bandes** ;
5. la **période de validité** de chaque signal ;
6. la **tendance** et les alertes de changement ;
7. l'**explication** du score ;
8. l'**action** associée à chaque bande.

**Objectif d'apprentissage :** vous pouvez mesurer l'adoption d'un compte en largeur, en profondeur et en tendance, construire un score pondéré et expliquer pourquoi il se calibre et se périme.

### 2. Connaissances essentielles

#### Définition

- **Mesure d'adoption** : proportion ou fréquence d'usage d'une capacité ou du produit par les utilisateurs éligibles d'un compte, sur une période.
- **Score de santé du compte** : indicateur synthétique, numérique, par lettre ou par couleur, calculé à partir de plusieurs signaux pondérés, qui estime le risque de départ ou le potentiel d'expansion d'un compte.

#### Idées fondamentales

1. **L'adoption se mesure en largeur, en profondeur et en tendance.** Combien de personnes, quelles capacités, et dans quel sens cela évolue.
2. **Le dénominateur est l'éligibilité.** On compte les utilisateurs qui peuvent et doivent utiliser la capacité ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)).
3. **Un score mêle des familles de signaux.** Usage, support, sentiment, relation, contrat.
4. **Les poids sont des hypothèses.** Ils se calibrent sur l'issue réelle des comptes : renouvelés ou partis.
5. **Un score se segmente.** Ce qui est sain pour un petit opérateur ne l'est pas pour un grand compte.
6. **Un score se périme.** Chaque signal a une période de validité.
7. **Un score est un point de départ, pas un verdict.** Il s'accompagne d'une explication et d'une action.

#### Vocabulaire essentiel

- **Largeur** (*breadth*) : part des utilisateurs éligibles qui utilisent le produit.
- **Profondeur** (*depth*) : part des capacités attendues qui sont utilisées, ou intensité d'usage.
- **Adhérence** (*stickiness*) : rapport entre utilisateurs actifs sur une courte période et sur une longue période.
- **Signal** (*signal*) : mesure d'entrée du score.
- **Poids** (*weight*) : importance relative d'un signal dans le score.
- **Bande** (*band*) : intervalle du score associé à une couleur et à une action.
- **Période de validité** (*validity period*) : durée au-delà de laquelle un signal est considéré comme périmé.
- **Rétro-test** (*backtest*) : comparaison d'un score passé avec l'issue réelle observée ensuite.
- **Sponsor exécutif** (*executive sponsor*) : personne du client qui porte le projet au niveau de la direction.

#### Relations de cause à effet

- On suit le nombre de connexions. Un compte où une seule personne se connecte beaucoup paraît sain, alors qu'il est fragile : si cette personne part, l'usage s'arrête.
- Les poids sont fixés à l'intuition et jamais revus. Le score ne prédit rien, mais l'équipe lui fait confiance.
- Les signaux ne sont pas rafraîchis. Un score vert périmé masque un compte qui décroche.
- Un seuil unique s'applique à tous les comptes. Les petits comptes sont tous rouges, les grands tous verts, et le score cesse d'orienter.

#### Idées reçues

- **« Un bon score garantit le renouvellement. »** Non. Il estime une probabilité, avec une marge d'erreur : des comptes verts partent, des comptes rouges restent.
- **« Plus il y a de signaux, mieux c'est. »** Non. Chaque signal ajouté apporte du bruit s'il n'est pas justifié et vérifié.
- **« La santé est une propriété du produit. »** Non. Elle dépend de l'usage du client, de ses personnes et de la relation.

#### Principe clé

On mesure l'adoption en largeur, en profondeur et en tendance parmi les utilisateurs éligibles ; on la synthétise en un score expliqué, calibré sur des issues réelles, segmenté et rafraîchi ; et l'on relie chaque bande à une action.

#### Si vous ne retenez que trois choses

1. L'adoption d'un compte se mesure par sa largeur, sa profondeur et sa tendance, sur les utilisateurs éligibles.
2. Un score de santé pondère des signaux de familles différentes ; ses poids sont des hypothèses à calibrer.
3. Il se segmente, se rafraîchit, s'explique et déclenche une action.

### 3. Explication technique détaillée

#### Mesurer l'adoption d'un compte

| Dimension | Question | Mesure | Exemple |
|---|---|---|---|
| Largeur | Combien de personnes l'utilisent ? | Utilisateurs éligibles actifs ÷ utilisateurs éligibles | 38 sur 120, soit 32 % |
| Profondeur | Quelles capacités sont utilisées ? | Capacités utilisées ÷ capacités attendues pour le segment | 7 sur 12, soit 58 % |
| Fréquence | À quel rythme ? | Utilisateurs actifs sur 7 jours ÷ actifs sur 30 jours | 55 % |
| Tendance | Dans quel sens ? | Variation sur 4 semaines | −12 points |

Un utilisateur est **actif** s'il a accompli une action significative, pas seulement ouvert un écran ([12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité)). Les mesures sont des statistiques d'usage : agrégées par tenant, avec une finalité déclarée ([20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)).

```sql
-- Largeur d'usage sur 28 jours, par tenant, parmi les utilisateurs éligibles
WITH eligible AS (
  SELECT tenant_id, count(*) AS eligible_users
    FROM app_user
   WHERE status = 'active'
     AND role_group = 'operational'
   GROUP BY tenant_id
), active AS (
  SELECT tenant_id, count(DISTINCT user_id) AS active_users
    FROM usage_event
   WHERE occurred_at >= now() - interval '28 days'
     AND is_meaningful
   GROUP BY tenant_id
)
SELECT e.tenant_id,
       e.eligible_users,
       coalesce(a.active_users, 0) AS active_users,
       round(100.0 * coalesce(a.active_users, 0) / e.eligible_users, 1) AS breadth_pct
  FROM eligible e
  LEFT JOIN active a ON a.tenant_id = e.tenant_id
 ORDER BY breadth_pct;
```

#### Construire un score de santé

L'annonce par laquelle Gainsight a présenté ses fiches de score en 2013 décrit les éléments d'un tel score : des mesures **objectives** (connexions agrégées, enquête de satisfaction) et **subjectives** (relation avec le sponsor) ; leur regroupement par type ; une **pondération** de chaque mesure qui permet de les agréger en un score global ; trois échelles de notation (numérique de 0 à 100, lettres, rouge-jaune-vert) ; une **période de validité** qui signale qu'un score est périmé ; et des alertes automatiques quand un score change de façon significative. L'article, qui est une annonce commerciale ancienne, ne donne ni la formule d'agrégation ni de seuils universels.

| Famille | Signaux typiques | Source | Validité (exemple) |
|---|---|---|---|
| Usage | Largeur, profondeur, tendance | Événements d'usage | 7 jours |
| Support | Cas ouverts, gravité, délais, escalades | Outil de support | 14 jours |
| Sentiment | Enquêtes, retours | Enquêtes | 90 jours |
| Relation | Sponsor identifié, dernier contact, participation aux revues | Évaluation de la gestionnaire de compte | 60 jours |
| Contrat et finance | Échéance, impayés, usage face aux quotas | Facturation ([1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) | 30 jours |

$$S = \frac{\sum_i w_i \, s_i}{\sum_i w_i}$$

où $S$ est le score global, $s_i \in [0, 100]$ le score normalisé du signal $i$ et $w_i$ son poids. Avec les bandes d'exemple « vert à partir de 75, jaune de 50 à 74, rouge en dessous de 50 », Alpha Air obtient :

$$S = 0{,}40 \times 80 + 0{,}25 \times 60 + 0{,}20 \times 70 + 0{,}15 \times 40 = 32 + 15 + 14 + 6 = 67$$

```json
{
  "scorecard": {
    "id": "account_health",
    "version": 4,
    "segments": ["airline_small", "airline_mid_market", "airline_large"],
    "signals": [
      { "key": "usage", "weight": 0.40, "validity_days": 7, "source": "usage_event" },
      { "key": "support", "weight": 0.25, "validity_days": 14, "source": "support_cases" },
      { "key": "sentiment", "weight": 0.20, "validity_days": 90, "source": "surveys" },
      { "key": "relationship", "weight": 0.15, "validity_days": 60, "source": "csm_assessment" }
    ],
    "bands": [
      { "name": "green", "min": 75 },
      { "name": "yellow", "min": 50 },
      { "name": "red", "min": 0 }
    ],
    "alerts": { "band_change": true, "drop_points": 15 }
  }
}
```

```typescript
interface Signal {
  name: string;
  score: number;
  weight: number;
}

type Band = "green" | "yellow" | "red";

function healthScore(signals: Signal[]): { score: number; band: Band; weakest: string } {
  const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
  const score = signals.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight;
  const band: Band = score >= 75 ? "green" : score >= 50 ? "yellow" : "red";
  const weakest = [...signals].sort((a, b) => a.score * a.weight - b.score * b.weight)[0].name;
  return { score: Math.round(score * 10) / 10, band, weakest };
}
```

Avec les quatre signaux d'Alpha Air, la fonction renvoie `{ score: 67, band: "yellow", weakest: "relationship" }` ; si chaque signal baisse de 30 points, `{ score: 37, band: "red", weakest: "relationship" }`. *La contribution la plus faible, ici celle de la relation, est un indice d'explication, non une cause établie.* La version du modèle est conservée avec chaque mesure : changer les poids change l'historique des scores.

#### Calibrer et valider

Un score ne vaut que s'il est **prédictif**. On le valide par un **rétro-test** : on prend les scores calculés 90 jours avant l'échéance de contrats passés, et l'on compare à l'issue.

```sql
SELECT band_at_t90                                                 AS band,
       count(*)                                                    AS accounts,
       round(100.0 * count(*) FILTER (WHERE renewed) / count(*), 1) AS renewal_rate_pct
  FROM renewal_outcome
 GROUP BY band_at_t90
 ORDER BY CASE band_at_t90 WHEN 'green' THEN 1 WHEN 'yellow' THEN 2 ELSE 3 END;
```

Un bon score ordonne les bandes : le taux de renouvellement du vert dépasse celui du jaune, qui dépasse celui du rouge. On le vérifie **par segment**, et l'on surveille la taille des échantillons : sur 20 comptes, un écart n'est pas significatif. On recalibre périodiquement, car les comportements et le produit changent.

#### Précautions

| Risque | Parade |
|---|---|
| Surveillance individuelle | Signaux agrégés par compte ; pas de classement de personnes ([20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités)) |
| Cible détournée | Plusieurs mesures, évaluation sur les issues (renouvellement), pas sur la couleur |
| Donnée périmée | Période de validité et indicateur de fraîcheur affichés |
| Boîte noire | Contributions des signaux visibles pour l'équipe |
| Biais de segment | Poids et seuils par segment |

**Modes de défaillance.**

- **Score réduit au nombre de connexions.**
- **Poids jamais calibrés.**
- **Signaux périmés** affichés comme actuels.
- **Seuil unique** pour tous les segments.
- **Score sans action associée.**
- **Couleur utilisée pour évaluer** les personnes qui la produisent.

**Contre-exemple.** Une équipe définit la santé comme le nombre de connexions du mois. Un compte de 80 utilisateurs, dont un administrateur qui se connecte quotidiennement, est vert. Cet administrateur quitte l'entreprise ; le compte passe de vert à rouge en un mois, après que plus personne n'a utilisé les workflows. Le score mesurait l'agitation d'une personne, pas l'adoption du compte.

**Limites.** Un score n'explique pas une décision de départ que l'équipe ne voit pas : fusion d'entreprises, changement de budget, choix stratégique du client. Les signaux subjectifs dépendent de la discipline de saisie. Et l'effort de construction d'un score est disproportionné pour une base de quelques dizaines de comptes, où la connaissance directe suffit ([24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [12.13 Découvrabilité](12-produit-ux.md#1213-découvrabilité) | La mesure d'adoption par capacité alimente le signal d'usage |
| [20.2 Registre des traitements, minimisation et limitation des finalités](20-gouvernance-donnees-conformite.md#202-registre-des-traitements-minimisation-et-limitation-des-finalités) | La finalité et la minimisation encadrent les statistiques d'usage |
| [24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur) | L'activation est le premier signal du score |
| [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client) | Chaque bande déclenche des scénarios de réussite |
| [24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support) | Les cas de support alimentent le signal de support |
| [24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients) | Le renouvellement valide le score et l'utilise pour prévoir |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | La qualité de service perçue (incidents, disponibilité) est un signal |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | Le coût de service se lit avec la santé : un compte coûteux et fragile |

### 5. Application pratique

**Situation initiale.** L'équipe de réussite client de l'éditeur suit 310 comptes avec huit personnes. Elle réagit aux appels, et découvre des départs au moment de la non-reconduction.

**Problème.** Aucun moyen de repérer à temps les comptes qui décrochent, ni de répartir l'attention.

**Application du concept.** Un score de santé pondéré, par segment, validé par rétro-test.

**Déroulé.**

1. L'équipe retient quatre familles de signaux (usage, support, sentiment, relation) et leur donne des poids initiaux.
2. Elle calcule largeur, profondeur et tendance d'usage chaque semaine, et les cas de support chaque jour.
3. Elle fait un rétro-test sur 140 contrats échus : renouvellement de 94 % pour le vert, 78 % pour le jaune, 49 % pour le rouge (valeurs d'exemple).
4. Elle constate que, pour les petits comptes, le signal de relation est mal renseigné : elle le retire de leur modèle et augmente le poids de l'usage.
5. Chaque changement de bande crée une action de suivi ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)).
6. Alpha Air passe de vert à jaune après le départ de son sponsor : la gestionnaire de compte en est informée la semaine même.

**Résultat.** Les 31 comptes rouges reçoivent une attention ciblée ; le taux de départ des comptes jaunes et rouges baisse de 22 % à 15 % sur l'année suivante (valeurs d'exemple).

**Limites.** Le rétro-test porte sur 140 contrats : l'équipe le répète chaque trimestre, et considère les résultats par segment avec prudence.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles dimensions mesurent l'adoption d'un compte ?
2. **Compréhension.** Pourquoi le dénominateur de la largeur est-il l'ensemble des utilisateurs éligibles ?
3. **Compréhension.** Pourquoi un score se segmente-t-il et se rafraîchit-il ?
4. **Pourquoi.** Pourquoi les poids d'un score doivent-ils être calibrés sur des issues réelles ?
5. **Raisonnement pratique.** Quatre signaux ont les scores 90, 50, 70 et 30, avec les poids 0,4, 0,3, 0,2 et 0,1. Quel est le score, et dans quelle bande est-il avec des seuils de 75 et 50 ?

#### Réponses

1. La largeur (combien de personnes), la profondeur (quelles capacités) et la tendance dans le temps ; la fréquence complète.
2. Parce qu'un utilisateur non éligible ne peut pas utiliser la capacité : le compter ferait paraître l'adoption plus faible qu'elle n'est, et rendrait les comptes incomparables.
3. Parce que ce qui est sain varie selon la taille et l'usage du compte, et parce qu'un signal périmé fait paraître un compte meilleur ou pire qu'il n'est.
4. Parce que les poids sont des hypothèses : sans comparaison avec les renouvellements et les départs observés, le score peut ne rien prédire tout en inspirant confiance.
5. $0{,}4 \times 90 + 0{,}3 \times 50 + 0{,}2 \times 70 + 0{,}1 \times 30 = 36 + 15 + 14 + 3 = 68$ : bande jaune.

## 24.4 Scénarios de réussite client

### 1. Comprendre simplement

Un **scénario de réussite client** (*customer success playbook*) est une suite prédéfinie d'actions, c'est-à-dire de tâches, de messages, de réunions et de ressources, qui se déclenche quand un signal le justifie, pour que la même situation reçoive toujours une réponse cohérente et mesurable.

**Pourquoi cela existe.** Sans scénario, la réponse à un signal dépend de la personne qui le voit, de sa disponibilité et de sa mémoire. Les signaux du score de santé ([24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte)) ne servent que s'ils déclenchent une réponse. Un scénario capitalise l'expérience : ce qui a marché une fois devient une procédure.

**Problème résolu.** Transformer un signal en action reproductible, avec un propriétaire, des échéances et un critère de sortie.

**Modèle mental.** Un protocole d'urgence : un signe, un enchaînement de vérifications et d'actions, des délais. Le protocole ne remplace pas le jugement de l'équipe ; il évite d'oublier une étape.

**Où l'analogie s'arrête.** Un protocole médical est validé par des études. Un scénario de réussite est une hypothèse d'organisation : il se mesure et se révise.

**Exemple.** Alpha Air passe en jaune avec une largeur d'usage de 22 % depuis deux semaines. Le scénario « adoption en panne » crée une action de risque chez la gestionnaire de compte : appel au sponsor sous 3 jours, revue des rôles et des capacités non utilisés sous 7 jours, atelier de reprise sous 10 jours, point de contrôle à 30 jours.

**Les composants.**

1. le **déclencheur** : signal et conditions ;
2. la **déduplication** et le **délai de grâce** ;
3. le **type** de scénario : risque, expansion, cycle de vie ;
4. les **tâches**, avec des échéances relatives au déclenchement ;
5. le **propriétaire** ;
6. le **critère de sortie** ;
7. l'**escalade** ;
8. le **suivi des résultats**.

**Objectif d'apprentissage :** vous pouvez décrire la structure d'un scénario de réussite, le déclencher à partir d'un signal sans bruit et mesurer son efficacité.

### 2. Connaissances essentielles

#### Définition

- **Scénario de réussite client** : suite structurée de tâches associées à un déclencheur et à un type de situation, appliquée de façon cohérente par les équipes en contact avec le client.
- **Appel à action** (*call to action*, CTA) : instance, pour un compte donné, d'un besoin d'intervention, à laquelle on applique un scénario.

#### Idées fondamentales

1. **Un scénario part d'un signal.** Score, jalon manqué, événement de cycle de vie, demande.
2. **Il a un type.** Risque, expansion, cycle de vie, activité, objectif.
3. **Il a un propriétaire, des échéances et un critère de sortie.** Sinon il reste ouvert sans fin.
4. **Il évite le bruit.** Déduplication, délai de grâce, plafond d'actions ouvertes par personne.
5. **Il se mesure.** Taux de résolution, délai, issue finale.
6. **Il se révise.** On compare des variantes et l'on retire ce qui ne sert pas.
7. **Il distingue l'interne et le sortant.** Les tâches de l'équipe, et les messages au client, soumis à consentement et limitation ([17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages), [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes)).

#### Vocabulaire essentiel

- **Déclencheur** (*trigger*) : condition qui crée une action.
- **Tâche** (*task*) : étape d'un scénario, assignée et datée.
- **Délai de grâce** (*cooldown*) : durée pendant laquelle un même scénario ne se redéclenche pas pour un même compte.
- **Critère de sortie** (*exit criteria*) : condition qui clôt le scénario avec succès.
- **Escalade** (*escalation*) : passage à un niveau supérieur si le critère n'est pas atteint à temps.
- **Gestionnaire de réussite client** (*customer success manager*, CSM) : personne qui porte la relation avec un compte.
- **Compte sauvé** (*save*) : compte à risque qui passe en bonne santé ou renouvelle après un scénario.

#### Relations de cause à effet

- Le scénario se redéclenche chaque semaine tant que le signal persiste. La gestionnaire reçoit des dizaines d'actions identiques et cesse de les lire.
- Aucun critère de sortie n'est défini. Les actions restent ouvertes, et le tableau de bord ne reflète plus la réalité.
- Les tâches n'ont pas de propriétaire. Chacun suppose que l'autre s'en occupe.
- Les résultats ne sont pas mesurés. On ne sait pas si le scénario sert, et il survit par habitude.

#### Idées reçues

- **« Un scénario enferme la gestionnaire dans une liste. »** Non. Il fixe le minimum à faire ; l'adaptation à la situation reste le travail humain.
- **« Plus de scénarios, c'est mieux. »** Non. Chaque scénario est un coût de maintenance et de bruit ; on garde ceux qui prouvent leur effet.
- **« Un scénario est un outil de relance commerciale. »** Non. Beaucoup sont des actions de soutien (aide à l'adoption, suivi d'incident) sans objectif de vente.

#### Principe clé

Un scénario relie un signal fiable à une réponse standard, propriétaire, datée et mesurée, avec des garde-fous contre le bruit.

#### Si vous ne retenez que trois choses

1. Un scénario est déclenché par un signal et formé de tâches avec propriétaire, échéances et critère de sortie.
2. On évite le bruit par la déduplication, le délai de grâce et un plafond d'actions ouvertes.
3. On mesure les résultats et l'on révise ou retire les scénarios inefficaces.

### 3. Explication technique détaillée

#### La structure

La documentation de Gainsight décrit les trois objets : les appels à action sont le cœur de l'espace de travail des gestionnaires, chacun rattaché à un client et représentant une action que la gestionnaire doit mener ; les tâches sont les éléments d'un appel à action, assignables, datables et suivies jusqu'à leur achèvement ; les scénarios sont des ensembles prédéfinis de tâches qui guident les gestionnaires dans les étapes d'un engagement avec un client, et leur application à la création d'un appel à action garantit un processus cohérent dans toute l'organisation. Cette documentation décrit cinq types d'appels à action : risque (tendances négatives, comme une baisse d'usage ou le départ d'un sponsor), expansion (tendances positives), cycle de vie (événements planifiés comme une formation ou une revue), activité et objectif. Ils se créent à la main ou se déclenchent par des règles métier, avec pour exemples courants une baisse d'usage, des cas de support, un changement de sponsor ou des résultats d'enquête.

| Élément | Rôle | Exemple |
|---|---|---|
| Signal | Ce qui est observé | Largeur d'usage sous 30 % depuis 14 jours |
| Déclencheur | Signal et conditions | Bande jaune ou rouge, et signal d'usage |
| Appel à action | Besoin d'intervention sur un compte | Risque : adoption en panne, Alpha Air |
| Scénario | Tâches standard | Appel au sponsor, revue des rôles, atelier |
| Tâche | Étape assignée et datée | Appeler le sponsor, due à J+3 |
| Critère de sortie | Fin avec succès | Largeur d'usage au-dessus de 45 % pendant 14 jours |
| Résultat | Issue consignée | Compte sauvé, ou parti avec motif |

#### Un catalogue de départ

| Scénario | Type | Déclencheur | Objectif |
|---|---|---|---|
| Intégration | Cycle de vie | Provisionnement | Atteindre l'activation ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur)) |
| Point mort d'intégration | Risque | Jalon en retard | Débloquer le client |
| Adoption en panne | Risque | Usage faible et score jaune ou rouge | Relancer l'usage |
| Changement de sponsor | Risque | Départ ou changement du sponsor | Établir une nouvelle relation |
| Suivi d'incident | Cycle de vie | Incident majeur résolu | Rétablir la confiance ([24.6 Page d'état, communication d'incident et fenêtre de maintenance](#246-page-détat-communication-dincident-et-fenêtre-de-maintenance)) |
| Préparation du renouvellement | Cycle de vie | Échéance dans 120 jours | Sécuriser la reconduction ([24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients)) |
| Expansion | Expansion | Quota atteint, nouvelle base | Proposer l'extension adaptée |
| Sortie | Cycle de vie | Préavis de résiliation | Restituer proprement ([24.7 Départ du client : sortie, restitution et certificat de suppression](#247-départ-du-client--sortie-restitution-et-certificat-de-suppression)) |

#### Définir un scénario comme une donnée

Un scénario est une donnée versionnée ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), non du code : ce qui varie est configurable ([13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale)).

```yaml
playbook: adoption_stalled
version: 3
type: risk
trigger:
  all:
    - signal: health_band
      in: [yellow, red]
    - signal: usage_breadth
      below: 0.30
      for_days: 14
  cooldown_days: 45
  dedupe_key: [tenant_id, playbook]
owner: account_manager
priority: high
tasks:
  - key: call_sponsor
    title: Appeler le sponsor et comprendre le blocage
    due_in_days: 3
  - key: usage_review
    title: Revoir les rôles et capacités non utilisés
    due_in_days: 7
  - key: recovery_workshop
    title: Animer un atelier de reprise avec les responsables de base
    due_in_days: 10
exit:
  success_when:
    - signal: usage_breadth
      at_least: 0.45
      for_days: 14
  escalate_if_not_met_in_days: 30
  escalate_to: customer_success_lead
```

```typescript
interface PlaybookTrigger {
  playbook: string;
  bandIn: string[];
  minBreadthBelow: number;
  cooldownDays: number;
}

interface AccountState {
  tenantId: string;
  band: string;
  breadth: number;
  lastTriggered: Record<string, string>;
}

function shouldTrigger(trigger: PlaybookTrigger, account: AccountState, today: string): boolean {
  if (!trigger.bandIn.includes(account.band)) {
    return false;
  }
  if (account.breadth >= trigger.minBreadthBelow) {
    return false;
  }
  const last = account.lastTriggered[trigger.playbook];
  if (last !== undefined) {
    const elapsedDays = (Date.parse(today) - Date.parse(last)) / (24 * 60 * 60 * 1000);
    if (elapsedDays < trigger.cooldownDays) {
      return false;
    }
  }
  return true;
}
```

Pour un compte jaune dont la largeur est de 0,22, avec un seuil de 0,30 et un délai de grâce de 45 jours : le déclenchement a lieu s'il n'y a jamais eu d'action ; il est refusé si la dernière a eu lieu 24 jours plus tôt (le 20 septembre, au 14 octobre) ; il a lieu de nouveau si la dernière date de 55 jours ; il n'a pas lieu pour un compte vert.

#### Où vit le scénario

Les scénarios s'exécutent dans l'outil de réussite client de l'éditeur, qui reçoit les **signaux** de la plateforme par événements ([7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements)) ou par interface ([10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest)). Deux points d'attention : cet outil contient des données de clients et peut être un **sous-traitant** au sens du contrat ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) ; et les messages envoyés **au client** par le scénario suivent les règles de consentement, de nature des messages et de limitation ([17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages), [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes)). La plateforme fournit les signaux et leur explication ; elle ne décide pas de la réponse commerciale.

#### Mesurer les scénarios

```sql
SELECT playbook_key,
       count(*)                                                                      AS cases,
       round(100.0 * count(*) FILTER (WHERE outcome = 'resolved') / count(*), 1)     AS resolved_pct,
       round(avg(extract(epoch FROM (closed_at - opened_at)) / 86400)::numeric, 1)   AS avg_days_to_close
  FROM playbook_run
 WHERE opened_at >= $1
   AND opened_at <  $2
   AND closed_at IS NOT NULL
 GROUP BY playbook_key
 ORDER BY cases DESC;
```

Trois indicateurs : le **taux de résolution** (critère de sortie atteint), le **délai de clôture** et le **taux d'actions sans suite**. Un scénario dont le taux de résolution n'est pas supérieur à celui de comptes comparables sans scénario ne prouve pas son utilité : on compare à un groupe témoin quand c'est possible.

**Modes de défaillance.**

- **Redéclenchement permanent**, sans délai de grâce.
- **Actions sans propriétaire** ni critère de sortie.
- **Trop de scénarios**, donc trop d'actions pour chaque gestionnaire.
- **Messages au client non soumis** au consentement.
- **Aucune mesure** de l'effet.
- **Scénario qui ne reçoit plus de signal fiable** parce que la source a changé.

**Contre-exemple.** Une équipe active, en une fois, quinze scénarios, déclenchés par n'importe quel changement de bande. Chaque gestionnaire reçoit 60 actions par semaine. Au bout d'un mois, les actions sont fermées en masse sans être traitées pour « vider la file », et un compte réellement à risque, noyé parmi les autres, part sans qu'aucun appel n'ait eu lieu.

**Limites.** Un scénario standardise la réaction, pas le diagnostic : la cause d'une baisse d'usage varie d'un compte à l'autre. L'effet d'un scénario est difficile à isoler, car les comptes suivis ne sont pas tirés au hasard. Enfin, un scénario trop rigide mine la confiance de l'équipe : on y laisse une place à l'adaptation.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur) | Un point mort d'intégration déclenche un scénario |
| [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte) | Le score et ses changements de bande déclenchent les scénarios |
| [24.6 Page d'état, communication d'incident et fenêtre de maintenance](#246-page-détat-communication-dincident-et-fenêtre-de-maintenance) | Un incident majeur déclenche un suivi client |
| [24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients) | La préparation du renouvellement est un scénario de cycle de vie |
| [7.3 Publication-abonnement et bus d'événements](07-evenements-automatisation.md#73-publication-abonnement-et-bus-dévénements) | Les signaux circulent comme des événements |
| [17.6 Consentement, désabonnement et nature des messages](17-collaboration-communication-travail.md#176-consentement-désabonnement-et-nature-des-messages) | Les messages sortants suivent les règles de consentement |
| [17.7 Limitation, résumé périodique et heures calmes](17-collaboration-communication-travail.md#177-limitation-résumé-périodique-et-heures-calmes) | La limitation évite de submerger le client |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | L'outil de réussite client peut être un sous-traitant |
| [13.1 Architecture pilotée par les métadonnées, vue transversale](13-concepts-transversaux.md#131-architecture-pilotée-par-les-métadonnées-vue-transversale) | Les scénarios sont des métadonnées, pas du code |

### 5. Application pratique

**Situation initiale.** Une panne de la plateforme, le 6 octobre 2026, a interrompu pendant 2 h 10 la création de constats chez 42 tenants dont Alpha Air (incident de gravité 1, voir [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)). L'équipe de réussite client doit rassurer, informer et chiffrer les avoirs prévus au contrat.

**Problème.** Chaque gestionnaire répond à sa façon : les messages arrivent à des moments différents, et certains clients ne reçoivent rien.

**Application du concept.** Le scénario « suivi d'incident » est déclenché à la clôture de l'incident, pour chaque tenant affecté.

**Déroulé.**

1. Le signal `incident.resolved` (gravité 1, tenants affectés) crée une action de cycle de vie pour chacun des 42 comptes.
2. À J+1, tâche : envoyer le résumé de l'incident (impact sur le tenant, cause connue, correctifs), validé par l'exploitation.
3. À J+5, tâche : partager l'analyse après incident, si le contrat le prévoit ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).
4. À J+5, tâche : calculer les avoirs de niveau de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) et les proposer.
5. À J+10, tâche : point avec le sponsor, pour les comptes jaunes et rouges.
6. Le critère de sortie est l'accusé de réception du client et l'avoir appliqué.

**Résultat.** Les 42 clients reçoivent le même niveau d'information dans les mêmes délais ; 39 actions sont closes à J+10, 3 sont escaladées.

**Limites.** Un scénario standard ne remplace pas un échange avec un client mécontent ; pour Alpha Air, dont le sponsor exige une réunion, la gestionnaire adapte la séquence. Le contenu du message est validé par l'exploitation et le juridique avant l'envoi.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels éléments compose un scénario de réussite client ?
2. **Compréhension.** À quoi servent la déduplication et le délai de grâce ?
3. **Compréhension.** Quelle différence y a-t-il entre une tâche et un appel à action ?
4. **Pourquoi.** Pourquoi un scénario doit-il avoir un critère de sortie ?
5. **Raisonnement pratique.** Un scénario a un délai de grâce de 30 jours. Il s'est déclenché pour un compte le 1er octobre. Le signal persiste. Quand peut-il se redéclencher ?

#### Réponses

1. Un déclencheur (signal et conditions), un type, des tâches avec échéances relatives et propriétaire, un critère de sortie, une escalade et un suivi des résultats.
2. À éviter que le même signal crée des actions identiques en boucle : la déduplication empêche les doublons ouverts, et le délai de grâce impose un intervalle avant un nouveau déclenchement.
3. L'appel à action est le besoin d'intervention sur un compte, créé par un signal ; la tâche est l'une de ses étapes, assignée et datée. Un scénario fournit les tâches standard.
4. Pour savoir quand l'action est réussie et peut être fermée : sans critère, les actions restent ouvertes, les indicateurs sont faux et l'efficacité du scénario ne se mesure pas.
5. À partir du 31 octobre (30 jours après le 1er octobre) : avant cette date, le déclenchement est refusé même si le signal persiste.

## 24.5 Niveaux de support et modèle d'accès du support

### 1. Comprendre simplement

Un **niveau de support** (*support tier*) est un échelon d'une organisation de support. Le terme recouvre deux choses distinctes : une **formule commerciale** (standard, premium, entreprise), qui fixe les canaux, les horaires et les délais de réponse promis au client, et un **échelon interne** (premier niveau, deuxième niveau, ingénierie), par lequel un cas monte jusqu'à sa résolution. Le **modèle d'accès du support** (*support access model*) définit comment le personnel du fournisseur accède à l'environnement et aux données d'un tenant pour résoudre un cas : à quel niveau, avec quel consentement, pour combien de temps, avec quelle trace.

**Pourquoi cela existe.** Un client attend une aide dont le délai est proportionné à l'importance de son problème. Le fournisseur ne peut pas donner le même niveau de réponse à tous. Et résoudre exige parfois de voir des données du client : c'est le plus fort pouvoir de la plateforme ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)), qui doit être encadré.

**Problème résolu.** Faire correspondre l'effort et les délais de support à la gravité du cas et à la formule du client ; permettre le diagnostic sans accès permanent ni opaque.

**Modèle mental.** Un service d'urgences. Un tri selon la gravité fait passer certains avant d'autres ; des niveaux de compétence (infirmier, médecin, spécialiste) se relaient ; et l'accès au dossier médical est encadré par le consentement et la traçabilité.

**Où l'analogie s'arrête.** Le tri médical repose sur l'état de santé, mesuré. La gravité d'un cas de support est déclarative et dépend de la formule. Et l'accès à un dossier médical est personnel, alors qu'un support SaaS accède à des données d'organisation, où figurent des données de nombreuses personnes.

**Exemple.** Alpha Air a une formule « entreprise ». Karim ouvre un cas de gravité 2 : l'import des documents réglementaires de la base de Lyon rejette 1 840 lignes. Un ingénieur de premier niveau le prend en charge en 12 minutes et l'escalade au deuxième niveau. Pour diagnostiquer, celui-ci doit voir les lignes rejetées : il demande l'accès, Sophie l'approuve pour une heure en lecture seule, avec les champs personnels masqués ; la trace est visible dans la console du tenant.

**Les composants.**

1. les **formules** de support ;
2. les **gravités** ;
3. les **délais** de première réponse et de résolution ;
4. l'**horloge** et ses pauses ;
5. les **échelons internes** et l'escalade ;
6. les **niveaux d'accès** aux données ;
7. le **consentement** et l'approbation ;
8. la **durée** et la **trace** visibles du client.

**Objectif d'apprentissage :** vous pouvez décrire une matrice gravité-formule, distinguer niveaux d'offre et échelons internes, et concevoir un accès de support gradué, approuvé, limité et tracé.

### 2. Connaissances essentielles

#### Définition

- **Niveau de support** : formule commerciale de support, ou échelon interne de traitement d'un cas.
- **Modèle d'accès du support** : ensemble des règles qui déterminent ce que le personnel de support peut voir ou faire chez un tenant, sous quelles conditions et avec quelle traçabilité.

#### Idées fondamentales

1. **La gravité décrit l'impact, la formule fixe le délai promis.** Deux dimensions, une matrice.
2. **La première réponse n'est pas la résolution.** Le délai promis porte sur la prise en charge ; la résolution suit son propre rythme.
3. **L'horloge a des règles.** Heures ouvrées ou continues, pauses pendant l'attente du client ou d'une approbation.
4. **Les échelons internes servent la résolution.** Libre-service, premier niveau, spécialistes, ingénierie.
5. **L'accès aux données est gradué.** Aucun, métadonnées, contenu masqué, action au nom d'un utilisateur.
6. **L'accès est justifié, limité dans le temps, approuvé et tracé.** Et la trace est visible du client ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
7. **Le chemin d'urgence existe, et il est examiné après coup.**

#### Vocabulaire essentiel

- **Gravité** (*severity*) : niveau d'impact d'un cas sur l'activité du client.
- **Délai de première réponse** (*first response time*) : durée entre l'ouverture d'un cas et la première réponse humaine utile.
- **Échelon** (*tier*) : niveau de compétence ou de responsabilité dans la chaîne de traitement.
- **Escalade** (*escalation*) : passage d'un cas à un échelon supérieur.
- **Accès juste à temps** (*just-in-time access*) : droit accordé à la demande, pour une durée limitée.
- **Accès de dernier recours** (*break-glass*) : accès d'urgence exceptionnel, fortement surveillé.
- **Pause d'horloge** (*clock pause*) : arrêt du décompte d'un délai pendant une attente qui ne dépend pas du fournisseur.
- **Accord de niveau de service** (*service level agreement*, SLA) : engagement contractuel de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

#### Relations de cause à effet

- Toutes les demandes ont la même priorité. Les urgences attendent derrière les questions d'usage.
- Chaque client choisit la gravité maximale. La gravité cesse de distinguer quoi que ce soit : il faut des règles de qualification et la possibilité de la reclasser.
- L'accès du support est permanent et large. La compromission d'un compte de support expose tous les tenants ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
- L'approbation d'accès n'est pas prise en compte dans le délai. Les délais deviennent incompréhensibles pour le client comme pour l'équipe.

#### Idées reçues

- **« Plus il y a d'échelons, meilleur est le support. »** Non. Chaque transfert ajoute du délai et de la perte d'information ; on vise la résolution au bon niveau dès le premier contact.
- **« Le support doit pouvoir tout voir. »** Non. Beaucoup de diagnostics se font sur des métadonnées, des journaux masqués ou des données synthétiques ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
- **« Le délai de première réponse est un délai de résolution. »** Non. Il engage la prise en charge, pas la correction.

#### Principe clé

La gravité mesure l'impact, la formule fixe le délai, l'échelon sert la résolution ; et l'accès aux données est exceptionnel, gradué, approuvé, borné dans le temps et visible du client.

#### Si vous ne retenez que trois choses

1. Le délai promis résulte du croisement de la gravité du cas et de la formule du client.
2. Les échelons internes servent à résoudre ; les formules servent à promettre ; il ne faut pas les confondre.
3. L'accès du support aux données suit un modèle gradué, approuvé, limité dans le temps et tracé.

### 3. Explication technique détaillée

#### Gravités, formules et délais

Un grand fournisseur d'infrastructure publie une matrice qui sert d'exemple. Selon sa documentation consultée le 14 octobre 2026, les gravités vont de « conseil général » (première réponse sous 24 heures) à « système critique à l'arrêt » (moins de 30 minutes avec la formule intermédiaire, moins de 15 minutes avec la formule supérieure), en passant par « système impacté » (12 heures), « système de production dégradé » (4 heures) et « système de production à l'arrêt » (1 heure). La même documentation recommande de réserver la gravité maximale aux cas qui n'ont pas de contournement ou qui touchent directement la production, permet de reclasser un cas pour les formules payantes, et impose une attente de 60 minutes avant de changer à nouveau la gravité après l'avoir relevée aux deux niveaux les plus élevés. La formule de base ne permet pas d'ouvrir de cas technique. Ces plans évoluent : la page consultée annonce la fin de plusieurs formules. On retient la **structure** (gravités définies par l'impact, délais par formule, reclassement encadré), pas les valeurs.

```json
{
  "support_plans": {
    "standard": {
      "hours": "business_hours",
      "channels": ["portal", "email"],
      "first_response_minutes": { "s1": 240, "s2": 480, "s3": 1440, "s4": 2880 },
      "named_contact": false
    },
    "premium": {
      "hours": "24x7_for_s1_s2",
      "channels": ["portal", "email", "phone"],
      "first_response_minutes": { "s1": 60, "s2": 240, "s3": 480, "s4": 1440 },
      "named_contact": false
    },
    "enterprise": {
      "hours": "24x7",
      "channels": ["portal", "email", "phone", "shared_channel"],
      "first_response_minutes": { "s1": 15, "s2": 60, "s3": 240, "s4": 480 },
      "named_contact": true
    }
  },
  "severity": {
    "s1": "Service indisponible pour le tenant, sans contournement",
    "s2": "Fonction importante dégradée ou indisponible, contournement partiel",
    "s3": "Fonction non critique anormale, contournement existant",
    "s4": "Question d'usage ou demande d'évolution"
  },
  "sla_clock": {
    "pause_on": ["waiting_customer", "waiting_access_approval"],
    "business_hours_calendar": "eu_working_week"
  }
}
```

Les valeurs de ce tableau sont des valeurs d'exemple. Les heures ouvrées se calculent avec un calendrier versionné, comme pour les échéances de travail ([17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité)).

```typescript
interface Interval {
  from: string;
  to: string;
}

function minutesBetween(from: string, to: string): number {
  return (Date.parse(to) - Date.parse(from)) / 60000;
}

function firstResponseBreached(
  openedAt: string,
  firstResponseAt: string | null,
  now: string,
  targetMinutes: number,
  paused: Interval[],
): boolean {
  const end = firstResponseAt ?? now;
  let elapsed = minutesBetween(openedAt, end);
  for (const p of paused) {
    const from = Math.max(Date.parse(p.from), Date.parse(openedAt));
    const to = Math.min(Date.parse(p.to), Date.parse(end));
    if (to > from) {
      elapsed -= (to - from) / 60000;
    }
  }
  return elapsed > targetMinutes;
}
```

Pour un cas de gravité 1 de la formule « premium » (cible de 60 minutes) ouvert à 9 h 00 : une réponse à 9 h 50 respecte la cible ; une réponse à 10 h 20, sans pause, la dépasse (80 minutes) ; la même réponse, avec une pause de 9 h 30 à 10 h 00 pour attendre une information du client, la respecte (50 minutes décomptées).

```sql
SELECT severity,
       count(*)                                                                                         AS cases,
       round(100.0 * count(*) FILTER (WHERE first_response_minutes <= target_minutes) / count(*), 1)    AS met_pct,
       round((percentile_cont(0.9) WITHIN GROUP (ORDER BY first_response_minutes))::numeric, 0)          AS p90_minutes
  FROM support_case
 WHERE opened_at >= $1
   AND opened_at <  $2
   AND first_response_minutes IS NOT NULL
 GROUP BY severity
 ORDER BY severity;
```

Ici, `first_response_minutes` est le délai **net des pauses**. On suit le taux de respect et le 90e centile : un taux de 98 % avec un 90e centile proche de la cible indique une marge faible.

#### Les échelons internes

| Échelon | Rôle | Résout | Escalade vers |
|---|---|---|---|
| Libre-service (niveau 0) | Aide en ligne, base de connaissances, assistant | Questions courantes, sans humain | Premier niveau |
| Premier niveau | Premier contact, qualification, cas connus | Questions d'usage, configuration simple | Spécialistes |
| Deuxième niveau | Spécialistes produit, diagnostic approfondi | Cas techniques, données, intégrations | Ingénierie |
| Troisième niveau | Ingénierie, propriétaires du code | Défauts, correctifs, incidents | Gestion d'incident ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) |

Cette découpe en niveaux de 0 à 3 est une convention de pratique, sans norme. Les principes qui comptent : qualifier tôt (gravité, impact, tenants touchés), documenter les cas connus pour qu'ils se résolvent au premier niveau, transférer avec le contexte complet, et ne pas faire répéter le client.

#### Le modèle d'accès

| Niveau d'accès | Ce que le support voit ou fait | Exemples | Autorisation | Durée maximale (exemple) |
|---|---|---|---|---|
| A0 | Rien du tenant | Diagnostic avec télémétrie agrégée et documentation | Aucune | — |
| A1 | Métadonnées | Configuration, états, erreurs, identifiants | Cadre contractuel, sur cas ouvert | 4 h |
| A2 | Contenu en lecture, masqué | Voir une fiche, lire les lignes rejetées avec champs sensibles masqués | Approbation du client | 1 h |
| A3 | Action au nom d'un utilisateur | Reproduire un problème en « vue en tant que » ([4.21 Délégation](04-identite-iam-autorisation.md#421-délégation)) | Approbation du client et deuxième valideur | 30 min |

Deux grands fournisseurs de nuage décrivent des mécanismes de cette nature. Le dispositif de Microsoft pour Azure prévoit que, si un ingénieur a besoin d'accéder à des données du client, une demande est créée et le client en est notifié ; des approbateurs désignés du client l'approuvent ou la refusent ; la demande reste dans la file du client pendant quatre jours puis expire sans donner d'accès ; en cas d'approbation, l'ingénieur reçoit l'accès pour la durée précisée ; les actions sont journalisées. La documentation précise les exclusions : situations d'urgence qui exigent une action immédiate, et exposition involontaire à des données lors d'un dépannage, ainsi que les demandes légales externes. Le dispositif de Google exige l'approbation explicite du client avant tout accès de son personnel aux données du client ; les demandes sont signées, le client est notifié par courriel ou message, approuve ou refuse par la console ou l'interface de programmation, et peut révoquer à tout moment une approbation active ; une approbation automatique peut avoir lieu pour des pannes urgentes, et la documentation signale que les délais de réponse du support augmentent du temps d'attente de l'approbation.

```text
Cas ouvert ─► Diagnostic sans accès (A0, A1) ─► besoin du contenu ? ─ non ─► résolution
                                                       │ oui
                                                       ▼
                     Demande d'accès : motif, périmètre, durée, cas associé
                                                       ▼
              Approbation par le rôle approbateur du client (ou règle contractuelle)
                           │ refus : autre moyen                │ accord
                                                       ▼
                    Accès temporaire, champs masqués, journal visible du client
                                                       ▼
                       Fin automatique (ou révocation) ─► clôture du cas
```

```json
{
  "access_request_id": "sar_5521",
  "case_id": "case_90177",
  "tenant_id": "ten_airline_01",
  "requested_by": "support_eng_17",
  "level": "A2",
  "reason": "Diagnostic de l'échec d'import : lecture des lignes rejetées",
  "scope": { "resources": ["import_batch:ib_204"], "fields_masked": ["passenger_name", "email"] },
  "duration_minutes": 60,
  "approval": { "required_from": "tenant_admin", "status": "approved", "approved_by": "usr_sophie", "approved_at": "2026-10-14T09:42:00Z" },
  "expires_at": "2026-10-14T10:42:00Z",
  "visible_to_tenant": true
}
```

**Leçons de conception.**

1. La demande porte un **motif**, un **périmètre** et une **durée**, rattachés à un cas.
2. L'approbateur est un **rôle** du client, pas n'importe quel utilisateur.
3. La demande **expire** si personne ne répond : on choisit un délai court pour le support.
4. L'approbation se **révoque** à tout moment.
5. Le **chemin d'urgence** existe, il est rare, il laisse une trace, et il est examiné après coup.
6. La **trace** est visible du client ([5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)).
7. L'**horloge du SLA** s'arrête pendant l'attente d'approbation, et le contrat le dit.
8. Les outils de support appliquent le filtre de tenant comme tout le reste ([5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) ; aucun compte partagé.

Un accès de support depuis un pays différent de celui du tenant est un **transfert** de données au sens de la conformité : il se déclare et se contractualise ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)), et se prend en compte dans le choix des équipes de permanence.

**Modes de défaillance.**

- **Gravité choisie sans règle.**
- **Même délai pour tous**, sans matrice.
- **Accès permanent** du support.
- **Approbation absente** du décompte des délais.
- **Compte de support partagé.**
- **Trace invisible** du client.

**Contre-exemple.** Un éditeur donne au support un compte unique en lecture et écriture sur tous les tenants, sans journal détaillé, « pour aller vite ». Un ingénieur y copie des données d'un client dans un outil de messagerie pour demander de l'aide à un collègue. L'audit ne peut attribuer aucune action, le client apprend la copie par un tiers, et la clause d'accès du contrat est rompue.

**Limites.** Un accès approuvé ralentit la résolution : le compromis entre rapidité et contrôle se règle par des outils de diagnostic qui n'exigent pas le contenu, un masquage intelligent et des données synthétiques de reproduction. Certains secteurs exigent l'approbation du client dans tous les cas, d'autres admettent une autorisation contractuelle préalable : le choix relève du contrat et du juridique. Enfin, le chemin d'urgence ne disparaît jamais : on l'encadre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants) | L'accès de support est un cas d'administration inter-tenants |
| [4.21 Délégation](04-identite-iam-autorisation.md#421-délégation) | La délégation et la vue en tant que bornent l'action au nom d'un utilisateur |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Les outils de support respectent le filtre de tenant |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les engagements de réponse relèvent des accords de niveau de service |
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | La gestion d'incident est l'échelon supérieur du support |
| [17.10 Échéance, horloge d'engagement, calendrier ouvré et priorité](17-collaboration-communication-travail.md#1710-échéance-horloge-dengagement-calendrier-ouvré-et-priorité) | Le calendrier ouvré fonde le calcul des délais |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Un accès depuis un autre pays est un transfert à encadrer |
| [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte) | Les cas de support alimentent le score de santé |
| [24.6 Page d'état, communication d'incident et fenêtre de maintenance](#246-page-détat-communication-dincident-et-fenêtre-de-maintenance) | La page d'état prolonge le support en cas d'incident général |

### 5. Application pratique

**Situation initiale.** Un mercredi matin, l'import mensuel d'Alpha Air échoue pour 1 840 lignes. Karim ouvre un cas : la mise à jour des documents réglementaires de la base de Lyon est bloquée.

**Problème.** Le support de premier niveau ne trouve pas la cause avec les journaux agrégés. Il faut lire les lignes rejetées, qui contiennent des noms de passagers.

**Application du concept.** Le cas suit la matrice de gravité, l'escalade interne et le modèle d'accès.

**Déroulé.**

1. Le cas est qualifié en gravité 2 : fonction importante indisponible, sans contournement complet. Cible de première réponse de la formule « entreprise » : 60 minutes.
2. Le cas est ouvert à 9 h 00. Un ingénieur de premier niveau le prend en charge à 9 h 12 (12 minutes), vérifie les cas connus et escalade au deuxième niveau à 9 h 25.
3. À 9 h 30, le deuxième niveau demande un accès A2 : motif, lecture du lot d'import `ib_204`, champs « nom du passager » et « courriel » masqués, 60 minutes.
4. L'horloge du SLA est en pause pendant l'attente d'approbation. Sophie approuve à 9 h 42 ; l'accès expire à 10 h 42.
5. L'ingénieur identifie une colonne de dates au mauvais format, ajoute une règle de normalisation à l'import, relance : les 1 840 lignes passent.
6. La trace de l'accès (qui, quand, pourquoi, quoi) est visible dans la console du tenant, avec le cas associé.

**Résultat.** Le cas est résolu en 2 h 05 ; le délai de première réponse (12 minutes) est respecté, et l'attente d'approbation est identifiée dans le décompte.

**Limites.** Un accès approuvé en 12 minutes dépend de la disponibilité de Sophie : la plateforme propose une règle d'approbation préalable pour certains diagnostics à données masquées, que le contrat d'Alpha Air n'a pas retenue.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un niveau de support commercial et un échelon interne ?
2. **Compréhension.** Pourquoi la gravité et la formule sont-elles deux notions distinctes ?
3. **Compréhension.** Quels sont les niveaux d'un modèle d'accès du support ?
4. **Pourquoi.** Pourquoi l'horloge du SLA se met-elle en pause pendant l'attente d'une approbation d'accès ?
5. **Raisonnement pratique.** Un cas de gravité 1 est ouvert à 9 h 00, avec une cible de 60 minutes. La première réponse intervient à 10 h 20, dont 30 minutes d'attente d'une information du client. La cible est-elle respectée ?

#### Réponses

1. Le niveau commercial est une formule d'offre (canaux, horaires, délais promis) ; l'échelon interne est un niveau de compétence ou de responsabilité par lequel un cas est traité et escaladé.
2. La gravité décrit l'impact du cas pour le client ; la formule décrit ce que le client a acheté. Le délai promis résulte de leur croisement : un même impact n'a pas la même cible pour toutes les formules.
3. Aucun accès, métadonnées, contenu en lecture masqué, et action au nom d'un utilisateur ; chaque niveau a ses conditions d'approbation et sa durée maximale.
4. Parce que le délai d'attente de l'approbation ne dépend pas du fournisseur mais du client : le décompter rendrait la cible inatteignable et incompréhensible. Le contrat doit l'écrire.
5. Oui : 80 minutes écoulées, moins 30 minutes de pause, donnent 50 minutes, inférieures à la cible de 60.

## 24.6 Page d'état, communication d'incident et fenêtre de maintenance

### 1. Comprendre simplement

Une **page d'état** (*status page*) est une page, publique ou réservée aux clients, qui indique l'état courant des composants du service, les incidents en cours et l'historique. La **communication d'incident** (*incident communication*) est la suite de messages datés, à cadence annoncée, qui dit aux clients ce qui est touché, ce qui est fait et quand viendra la prochaine mise à jour. Une **fenêtre de maintenance** (*maintenance window*) est la période, annoncée à l'avance, pendant laquelle des opérations planifiées peuvent dégrader ou interrompre le service.

**Pourquoi cela existe.** Quand un service est dégradé, les clients veulent savoir si le problème vient d'eux ou du fournisseur, ce qui est touché et quand cela reviendra. Sans canal d'information, ils saturent le support et perdent confiance. Pour une maintenance, prévenir évite la surprise et permet au client de s'organiser.

**Problème résolu.** Donner une source de vérité sur l'état du service, tenir les clients informés avec honnêteté et cadence, et planifier les interruptions sans surprise.

**Modèle mental.** L'affichage d'une gare : trains à l'heure, retardés ou supprimés ; messages avec la cause et l'heure de la prochaine annonce ; travaux annoncés à l'avance.

**Où l'analogie s'arrête.** Une gare affiche l'état de chaque train. Une plateforme multi-tenant a des états différents selon les régions, les composants et parfois les tenants ; et l'état publié est un engagement, qui sert à vérifier les accords de niveau de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).

**Exemple.** À 8 h 12 UTC, la page signale « notifications dégradées, région EU », en état « investigation ». À 8 h 33, l'état passe à « cause identifiée », avec le prochain point à 9 h 00 ; à 9 h 05, « surveillance » ; à 9 h 40, « résolu ». Le samedi suivant, une maintenance de la base de la région EU est annoncée 7 jours avant, de 2 h à 3 h UTC, avec un rappel une heure avant.

**Les composants.**

1. les **composants** publiés et leurs états ;
2. les **incidents** et leurs mises à jour datées ;
3. la **maintenance planifiée** et ses états ;
4. l'**indicateur global** ;
5. les **abonnements** (courriel, messages, webhooks) ;
6. l'**interface** de consultation de l'état ;
7. l'**historique** ;
8. le lien avec les **engagements** de service.

**Objectif d'apprentissage :** vous pouvez décrire le modèle d'une page d'état, rédiger un message d'incident à cadence annoncée et planifier une maintenance annoncée et bornée.

### 2. Connaissances essentielles

#### Définition

- **Page d'état** : service d'information qui publie l'état des composants d'un service et la chronologie de ses incidents et de ses maintenances.
- **Communication d'incident** : ensemble des messages adressés aux clients pendant un incident, avec l'impact, l'état, les actions et l'heure de la prochaine mise à jour.
- **Fenêtre de maintenance** : intervalle de temps annoncé, pendant lequel des opérations planifiées peuvent affecter le service.

#### Idées fondamentales

1. **La page d'état est indépendante du service.** Si elle tombe avec lui, elle ne sert à rien le jour où l'on en a besoin.
2. **Les composants parlent le langage du client.** Régions et fonctions, pas la liste des microservices.
3. **Un incident suit des états.** Investigation, cause identifiée, surveillance, résolu ; chaque mise à jour est datée.
4. **Chaque message dit quatre choses.** Ce qui est touché, depuis quand, ce qui est fait, quand viendra la prochaine mise à jour ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).
5. **La cadence est annoncée et tenue.** Même sans nouveauté, on le dit.
6. **Un message ne révèle rien d'un autre tenant.** La communication ciblée reste ciblée ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).
7. **La maintenance est annoncée, bornée et suivie.** Planifiée, en cours, en vérification, terminée.

#### Vocabulaire essentiel

- **Page d'état et communication d'incident** (*status page and incident communication*) : le canal de publication et les messages qui informent les clients.
- **Composant** (*component*) : élément du service dont on publie l'état.
- **Statut de composant** (*component status*) : opérationnel, performance dégradée, panne partielle, panne majeure.
- **Impact** (*impact*) : ampleur d'un incident : aucun, mineur, majeur, critique.
- **Abonné** (*subscriber*) : personne ou système qui reçoit les mises à jour.
- **Rappel** (*reminder*) : notification envoyée avant le début d'une maintenance.
- **Maintenance planifiée** (*scheduled maintenance*) : opération annoncée, avec début et durée.
- **Analyse après incident** (*post-incident review*) : récit et analyse publiés ou transmis après la résolution ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)).

#### Relations de cause à effet

- La page d'état est hébergée sur la plateforme elle-même. Pendant un incident majeur, elle est inaccessible, et les clients n'ont plus aucune information.
- Les messages ne donnent pas l'heure de la prochaine mise à jour. Les clients rafraîchissent la page et appellent le support.
- La maintenance n'est pas annoncée. Un client découvre l'interruption pendant son horaire de pointe.
- Tout est « opérationnel » alors que des clients sont touchés. La confiance dans la page disparaît, et les clients cessent de la consulter.

#### Idées reçues

- **« Une page d'état admet une faiblesse. »** Non. Elle prouve la maîtrise : les clients d'une plateforme fiable lisent la page d'état comme une source d'information.
- **« On publie quand on connaît la cause. »** Non. On publie l'impact dès qu'il est confirmé, et l'on dit que la cause est en cours d'analyse.
- **« La maintenance planifiée ne compte pas. »** Cela dépend du contrat : il dit si les fenêtres annoncées sont exclues des mesures de disponibilité.

#### Principe clé

Une source d'état indépendante, à la granularité du client, des messages datés à cadence annoncée, et des maintenances annoncées et bornées : le client sait à quoi s'en tenir.

#### Si vous ne retenez que trois choses

1. La page d'état est indépendante de la plateforme et publie des composants à la granularité du client.
2. Un incident se communique par états et par messages datés à cadence annoncée.
3. Une maintenance s'annonce à l'avance, avec début, durée et rappel, et se suit par états.

### 3. Explication technique détaillée

#### Le modèle d'une page d'état

La documentation de Statuspage, un produit d'Atlassian dédié, donne un modèle repris par de nombreuses pages d'état. Un composant est publié avec l'un de quatre statuts : opérationnel, performance dégradée, panne partielle, panne majeure. Un incident passe par quatre états : *Investigating* (les symptômes sont vus, la cause est inconnue), *Identified* (la cause est trouvée, un correctif est en cours), *Monitoring* (un correctif est en place, on attend la disparition des symptômes), *Resolved* (la cause est éliminée) ; une analyse après incident peut s'y ajouter. Son impact vaut aucun, mineur, majeur ou critique, et l'indicateur global de la page prend l'une de ces valeurs. L'interface oblige à indiquer les composants affectés avant de proposer la notification des abonnés. La maintenance planifiée a ses propres états : *Scheduled*, *In progress*, *Verifying*, *Completed*.

```json
{
  "page": { "status_indicator": "minor", "description": "Performance dégradée" },
  "components": [
    { "id": "notifications_eu", "name": "Notifications (UE)", "status": "degraded_performance" },
    { "id": "api_eu", "name": "API (UE)", "status": "operational" },
    { "id": "workflows_eu", "name": "Workflows (UE)", "status": "operational" }
  ],
  "incidents": [
    {
      "id": "inc_2026_10_14_01",
      "title": "Notifications retardées dans la région UE",
      "status": "identified",
      "impact": "minor",
      "components": ["notifications_eu"],
      "updates": [
        { "at": "2026-10-14T08:12:00Z", "status": "investigating", "body": "Les notifications sont retardées dans la région UE. Nous enquêtons. Prochaine mise à jour avant 08:45 UTC." },
        { "at": "2026-10-14T08:33:00Z", "status": "identified", "body": "Cause suspectée : un déploiement de 08:00 UTC. Retour arrière en cours. Prochaine mise à jour : 09:00 UTC." }
      ]
    }
  ],
  "scheduled_maintenances": [
    {
      "id": "mnt_2026_10_17_01",
      "title": "Maintenance de la base de données de la région UE",
      "status": "scheduled",
      "starts_at": "2026-10-17T02:00:00Z",
      "ends_at": "2026-10-17T03:00:00Z",
      "expected_impact": "Écritures interrompues pendant 10 minutes maximum",
      "components": ["api_eu", "workflows_eu"]
    }
  ]
}
```

#### La communication d'incident

Le module 11 a posé les principes ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) : un message dit ce qui est touché, depuis quand, ce qui est fait et quand viendra la prochaine mise à jour ; il évite les hypothèses non confirmées ; les heures sont en UTC. La cadence se règle sur la gravité :

| Gravité | Cadence de mise à jour | Contenu minimal |
|---|---|---|
| 1 (panne générale) | 30 minutes | Impact, état, action, prochaine mise à jour |
| 2 (fonction majeure dégradée) | 60 minutes | Idem |
| 3 (impact limité) | 4 heures, ou à chaque changement | Impact, état, prochaine mise à jour |

```typescript
type Severity = "sev1" | "sev2" | "sev3";

const updateCadenceMinutes: Record<Severity, number> = { sev1: 30, sev2: 60, sev3: 240 };

function nextUpdateDue(lastUpdateAt: string, severity: Severity): string {
  const due = Date.parse(lastUpdateAt) + updateCadenceMinutes[severity] * 60000;
  return new Date(due).toISOString();
}

function overdue(lastUpdateAt: string, severity: Severity, now: string): boolean {
  return Date.parse(now) > Date.parse(nextUpdateDue(lastUpdateAt, severity));
}
```

Pour un incident de gravité 2 dont la dernière mise à jour est à 8 h 33, la fonction annonce la prochaine à 9 h 33 ; à 9 h 10, elle n'est pas en retard en gravité 2, mais l'est en gravité 1 (échéance à 9 h 03). L'outil de gestion d'incident calcule cette échéance et alerte le responsable de la communication.

**Qui voit quoi.**

| Canal | Public | Contenu |
|---|---|---|
| Page d'état publique | Tout le monde | Composants, impact général, chronologie |
| Page ou espace réservé aux clients | Clients | Détails supplémentaires (régions, composants fins) |
| Message dans l'application et console d'administration | Administrateurs du tenant touché | Impact sur **leur** tenant, contournement ([17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires)) |
| Notification directe | Contacts désignés du tenant | Alerte, état, avoirs éventuels ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)) |
| Interface et webhook | Systèmes du client | Intégration à leurs outils d'alerte |

Un message public ne contient ni identifiant de tenant ni donnée métier. La communication ciblée vers les tenants touchés par une cellule ([22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact)) passe par les canaux réservés.

#### Indépendance

La page d'état et son outil de publication ne dépendent pas de l'infrastructure qu'ils décrivent : autre fournisseur, autre domaine, autre fournisseur de noms, identité distincte. Une **version dégradée** (page statique, message préenregistré) reste possible quand l'outil lui-même est indisponible. Les sondes de santé ([11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé)) peuvent poster automatiquement un état « investigation » ; la qualification et les messages suivants restent humains pour éviter les fausses alertes et les messages contradictoires.

#### La fenêtre de maintenance

| Élément | Règle |
|---|---|
| Moment | Choisi au creux de charge de la région, d'après le modèle de charge ([22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)), et décalé par région ([22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données)) |
| Préavis | Annoncé à l'avance : délai fixé par le contrat, plus long pour une interruption que pour une opération sans impact |
| Rappel | Envoyé peu avant le début : une heure, par exemple |
| Durée | Bornée, avec une fin annoncée |
| États | Planifiée, en cours, vérification, terminée |
| Retour arrière | Prévu et annoncé si l'opération dépasse la fenêtre ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) |
| Urgence | Une maintenance d'urgence suit une procédure distincte, avec un message dès que possible |

La documentation de Statuspage décrit des automatismes de ce type : une maintenance débute à l'état « planifiée » ; les abonnés peuvent être notifiés à la création ; un rappel part par courriel et message 60 minutes avant le début ; le passage à « en cours » et à « terminée » peut être automatique ; les composants peuvent passer à « en maintenance » au début et revenir à « opérationnel » à la fin, si ces options sont activées ; et une maintenance terminée ne peut pas être rouverte.

Le meilleur moyen de réduire l'impact des maintenances est de réduire leur besoin : des migrations compatibles étendre-contracter ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](21-livraison-qualite-logicielle.md#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) et des déploiements progressifs par cellule ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari), [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact)) évitent beaucoup d'interruptions globales. Une opération qui touche un seul tenant, comme la mise à niveau d'un paquet ([23.5 Mise à niveau à blanc, désinstallation et retour arrière](23-solutions-verticales-packagees.md#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière)), se planifie avec lui dans une fenêtre qu'il choisit.

```sql
CREATE TABLE component_status_period (
  component_id text        NOT NULL,
  status       text        NOT NULL CHECK (status IN ('operational', 'degraded_performance', 'partial_outage', 'major_outage', 'under_maintenance')),
  started_at   timestamptz NOT NULL,
  ended_at     timestamptz,
  PRIMARY KEY (component_id, started_at)
);

-- Disponibilité d'un composant : temps passé en panne partielle ou majeure
SELECT component_id,
       round(100.0 * (1 - coalesce(
         sum(extract(epoch FROM (least(coalesce(ended_at, $2), $2) - greatest(started_at, $1))))
           FILTER (WHERE status IN ('partial_outage', 'major_outage')), 0)
         / extract(epoch FROM ($2::timestamptz - $1::timestamptz))), 3) AS availability_pct
  FROM component_status_period
 WHERE started_at < $2
   AND coalesce(ended_at, $2) > $1
 GROUP BY component_id
 ORDER BY component_id;
```

La requête rapproche la chronologie publiée des engagements de disponibilité ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)). Que la maintenance planifiée compte comme indisponibilité est une décision contractuelle : le statut `under_maintenance` permet de la traiter séparément.

**Modes de défaillance.**

- **Page d'état hébergée par la plateforme.**
- **Composants trop fins** ou trop vagues.
- **Message sans prochaine mise à jour** annoncée.
- **Fausses alertes** par automatisation non qualifiée.
- **Maintenance sans préavis** ou sans fin annoncée.
- **Page toujours verte**, démentie par les clients.

**Contre-exemple.** Un éditeur héberge sa page d'état sur la même infrastructure que sa plateforme et la met à jour à la main. Une panne de la région principale la rend inaccessible pendant 90 minutes. Les clients voient une page d'erreur, saturent le support, et plusieurs concluent que l'éditeur « ne dit rien ». L'incident technique dure 90 minutes ; la crise de confiance dure des semaines.

**Limites.** Une transparence totale se heurte parfois à la sécurité (un incident de sécurité ne se détaille pas en cours d'enquête) et au juridique (obligations de notification, [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem), [20.9 Analyse d'impact et processus de notification des violations](20-gouvernance-donnees-conformite.md#209-analyse-dimpact-et-processus-de-notification-des-violations)). Publier trop de composants alourdit la lecture ; trop peu, rend l'information inutile. Enfin, les clients attendent des délais d'information plus courts que la compréhension de la cause : on annonce un impact avant d'en avoir fait l'analyse.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem) | La gestion d'incident définit les messages, la cadence et les rôles |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | La chronologie publiée sert à vérifier les engagements de service |
| [11.13 Surveillance, alertes et sondes de santé](11-securite-fiabilite-operations.md#1113-surveillance-alertes-et-sondes-de-santé) | Les sondes de santé alimentent l'état des composants |
| [17.1 Service de notifications et résolution des destinataires](17-collaboration-communication-travail.md#171-service-de-notifications-et-résolution-des-destinataires) | Le service de notifications délivre les messages aux abonnés |
| [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact) | Les cellules permettent une communication ciblée |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Les régions déterminent la granularité de la page et les fenêtres |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](21-livraison-qualite-logicielle.md#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les déploiements progressifs limitent les maintenances globales |
| [23.5 Mise à niveau à blanc, désinstallation et retour arrière](23-solutions-verticales-packagees.md#235-mise-à-niveau-à-blanc-désinstallation-et-retour-arrière) | Une mise à niveau de paquet se planifie dans une fenêtre |
| [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client) | Un incident majeur déclenche un suivi client |
| [24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support) | Le support renvoie vers la page d'état en cas d'incident général |

### 5. Application pratique

**Situation initiale.** Le 14 octobre 2026, à 8 h 00 UTC, un déploiement dégrade la région UE : environ 6 % des transitions d'état échouent et les notifications sont retardées. Des clients ouvrent des cas de support.

**Problème.** Informer les clients rapidement, sans révéler d'informations propres à d'autres tenants, et sans surcharger le support.

**Application du concept.** La page d'état et le processus de communication d'incident, avec cadence annoncée.

**Déroulé.**

1. Une sonde de santé détecte le taux d'échec ; l'outil publie automatiquement « investigation » sur le composant « Notifications (UE) », avec la prochaine mise à jour sous 30 minutes.
2. Le commandant d'incident qualifie la gravité 2 et publie à 8 h 33 : cause suspectée (déploiement de 8 h 00), retour arrière en cours, prochaine mise à jour à 9 h 00.
3. Le support répond aux nouveaux cas par un lien vers l'incident, et déclare les cas comme liés.
4. À 9 h 05, après le retour arrière, l'état passe à « surveillance » ; à 9 h 40, après 30 minutes de stabilité, à « résolu ».
5. Un message direct est envoyé aux administrateurs des 42 tenants touchés avec l'impact sur leur propre tenant ; le suivi client suit le scénario d'incident ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)).
6. Le samedi suivant, la maintenance annoncée de la base de la région UE se déroule de 2 h à 3 h UTC, avec rappel à 1 h et retour à « opérationnel » à la fin.

**Résultat.** Peu de clients ont eu à demander ce qui se passait : le volume de cas liés à l'incident est inférieur à la moitié de celui d'un incident comparable sans page à jour (valeur d'exemple).

**Limites.** L'automatisation de l'état « investigation » a publié un faux message trois semaines plus tôt, lors d'un défaut de sonde : le seuil de la sonde a été revu, et la confirmation humaine préservée pour les états suivants.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les états d'un incident sur une page d'état ?
2. **Compréhension.** Pourquoi la page d'état doit-elle être indépendante de la plateforme ?
3. **Compréhension.** Que contient un bon message de communication d'incident ?
4. **Pourquoi.** Pourquoi annonce-t-on l'heure de la prochaine mise à jour même quand il n'y a rien de nouveau ?
5. **Raisonnement pratique.** Un composant a été en panne majeure 43 minutes sur un mois de 30 jours. Quelle est sa disponibilité ?

#### Réponses

1. Investigation (symptômes vus, cause inconnue), cause identifiée (correctif en cours), surveillance (correctif en place), résolu ; une analyse après incident peut suivre.
2. Parce que si elle dépend de l'infrastructure qu'elle décrit, elle tombe avec elle, au moment précis où les clients ont besoin d'elle.
3. Ce qui est touché, depuis quand, ce qui est fait, et l'heure de la prochaine mise à jour ; sans hypothèse non confirmée, avec des heures en UTC.
4. Parce que le silence est interprété comme une perte de maîtrise : annoncer l'heure du prochain point évite que les clients rafraîchissent la page et saturent le support, et engage l'équipe à tenir la cadence.
5. Un mois de 30 jours compte $30 \times 24 \times 60 = 43\,200$ minutes. Disponibilité : $1 - 43 / 43\,200 \approx 99{,}90\ \%$.

## 24.7 Départ du client : sortie, restitution et certificat de suppression

### 1. Comprendre simplement

La **sortie** (*offboarding*) est le processus qui conduit un client de l'annonce de son départ à l'effacement de ses données : préavis, gel, export, rétention, suppression, preuve. La **restitution et la portabilité des données** (*data return and portability*) remettent au client ses données dans un format structuré, couramment utilisé et lisible par machine, avec ce qu'il faut pour les réutiliser. Le **certificat de suppression** (*deletion certificate*) est le document, ou l'enregistrement, qui atteste ce qui a été supprimé, quand, comment et avec quelle vérification.

**Pourquoi cela existe.** Un client qui part veut récupérer ses données ou les faire effacer. La loi et le contrat l'exigent, et la façon dont une plateforme laisse partir est un élément de confiance. Sans procédure, on improvise : export incomplet, suppression partielle, copies oubliées.

**Problème résolu.** Rendre le départ propre, complet, démontrable, et sans dépendance subie.

**Modèle mental.** L'état des lieux de sortie d'un appartement : inventaire, remise des clés, restitution du dépôt avec les justificatifs, et la certitude de ne rien laisser derrière soi.

**Où l'analogie s'arrête.** Un appartement est un objet physique, unique. Les données existent en de nombreuses copies : réplicas, sauvegardes, index, caches, sous-traitants. Il faut toutes les retrouver.

**Exemple.** Alpha Air donne son préavis le 15 janvier. Le tenant passe en lecture seule à la date d'effet, le 28 février. Le 1er mars, un paquet de restitution (données en CSV, fichiers, configuration, manifeste avec empreintes) est livré par un lien expirant. Une période de récupération de 30 jours suit. Le 31 mars, les bases, fichiers, index, journaux et clés sont supprimés ; le 2 avril, un certificat liste les périmètres, les méthodes et les vérifications, et indique que les sauvegardes expirent au plus tard le 29 mai.

**Les composants.**

1. le **préavis** et le plan de sortie ;
2. la **lecture seule** et l'**export** ;
3. le **paquet de restitution** et son manifeste ;
4. la **période de récupération** ;
5. la **rétention** avant suppression ;
6. la **suppression** par périmètre et sa **vérification** ;
7. les **sous-traitants** ;
8. le **certificat** et ses exclusions.

**Objectif d'apprentissage :** vous pouvez décrire le calendrier d'une sortie, le contenu d'un paquet de restitution et les éléments d'un certificat de suppression, et expliquer ce que la suppression ne couvre pas immédiatement.

### 2. Connaissances essentielles

#### Définition

- **Sortie** : processus qui mène un tenant de la décision de départ à la fin de la conservation de ses données par le fournisseur.
- **Restitution** : remise au client de ses données et de ses éléments de configuration, dans des formats ouverts, avec un manifeste de contrôle.
- **Certificat de suppression** : enregistrement signé et daté qui atteste, par périmètre, la suppression des données d'un client, la méthode employée et la vérification faite.

#### Idées fondamentales

1. **Le départ est une procédure à états et à dates.** Préavis, lecture seule, récupération, rétention, suppression ([1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement), [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)).
2. **Le client choisit entre restitution et suppression.** Le règlement général sur la protection des données (RGPD, article 28) prévoit que le sous-traitant supprime ou restitue les données personnelles au choix du responsable du traitement.
3. **La restitution est complète et exploitable.** Formats ouverts, dictionnaire de données, relations, empreintes.
4. **La suppression couvre toutes les copies.** Y compris les tiers ; les sauvegardes expirent à leur échéance.
5. **Les obligations légales de conservation priment.** Le même article réserve le cas où la loi impose de conserver ; le gel légal suspend la suppression ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).
6. **La preuve est le certificat.** Il indique périmètre, méthode, vérification et exclusions.
7. **Les délais sont contractuels, et parfois encadrés par la loi.** Selon la nature du service et le règlement européen sur les données.

#### Vocabulaire essentiel

- **Préavis** (*notice period*) : délai entre l'annonce du départ et sa date d'effet.
- **Période de transition** (*transitional period*) : période pendant laquelle le fournisseur assure la continuité et aide au changement de service.
- **Période de récupération** (*retrieval period*) : durée pendant laquelle le client peut encore récupérer ses données après le départ.
- **Données exportables** (*exportable data*) : données d'entrée et de sortie, avec métadonnées, générées par le client ou le concernant directement.
- **Actifs numériques** (*digital assets*) : éléments sous forme numérique, y compris des applications, dont le client a le droit d'usage.
- **Manifeste d'export** (*export manifest*) : liste des fichiers du paquet, avec comptes et empreintes.
- **Effacement cryptographique** (*crypto-shredding*, *cryptographic erase*) : destruction des clés qui rendent les données illisibles ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)).
- **Gel légal** (*legal hold*) : suspension de la suppression pour une obligation légale ou une procédure ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

#### Relations de cause à effet

- L'export ne couvre que les tables principales. Les pièces jointes, la configuration et l'historique manquent : le client ne peut pas réutiliser ses données.
- La suppression oublie l'index de recherche, le stockage d'objets et les journaux. Des données personnelles subsistent.
- Aucune période de récupération n'existe. Une erreur du client devient irréversible.
- Aucun certificat n'est remis. Le client ne peut pas démontrer à ses propres auditeurs que ses données ont été effacées.
- Les données sortent dans un format propriétaire. La dépendance vis-à-vis du fournisseur se prolonge après le départ.

#### Idées reçues

- **« Le RGPD impose un certificat de suppression. »** Non. L'article 28 impose au sous-traitant de supprimer ou de restituer, au choix du responsable, et de fournir les informations nécessaires pour démontrer la conformité ; la page consultée ne précise ni délai, ni méthode de confirmation. Le certificat est une pratique de preuve, souvent contractuelle.
- **« La portabilité du RGPD couvre tout ce que le client a saisi. »** Non. L'article 20 vise les données que la personne concernée a fournies, traitées par des moyens automatisés sur la base du consentement ou d'un contrat. La restitution contractuelle d'un tenant est en général plus large.
- **« Supprimer, c'est vider la base. »** Non. Les copies sont nombreuses : réplicas, index, objets, entrepôts, journaux, sauvegardes, sous-traitants.

#### Principe clé

On laisse partir un client par une procédure datée : restitution complète en formats ouverts, suppression de toutes les copies selon des méthodes vérifiées, et un certificat qui dit ce qui est fait et ce qui reste, jusqu'à quand.

#### Si vous ne retenez que trois choses

1. La sortie est une procédure à états : préavis, lecture seule, récupération, rétention, suppression.
2. La restitution est complète, en formats ouverts, avec un manifeste d'empreintes.
3. Le certificat de suppression liste périmètres, méthodes et vérifications, et nomme honnêtement les exclusions, dont les sauvegardes.

### 3. Explication technique détaillée

#### Le calendrier et ses contraintes

| Phase | État du tenant | Contenu | Durée (exemple) |
|---|---|---|---|
| Préavis | Actif | Annonce du départ, plan de sortie, interlocuteurs | Selon le contrat |
| Transition | Actif, puis lecture seule | Aide à l'export, continuité de service | Jusqu'à 30 jours |
| Récupération | Lecture seule, export seul | Le client récupère ses données | Au moins 30 jours |
| Rétention | En cours de suppression | Données inaccessibles, conservées pour reprise ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)) | Selon le contrat, par exemple 30 jours |
| Suppression | Supprimé | Effacement par périmètre, vérification | Quelques jours |
| Preuve | — | Émission du certificat | À l'issue |

**Le règlement européen sur les données.** Le règlement (UE) 2023/2854, dit *Data Act*, encadre le changement de fournisseur de services de traitement de données. D'après son texte, lu sur un site d'aide à la lecture (le texte authentique est celui du Journal officiel) : le contrat doit prévoir une période de transition d'au plus 30 jours calendaires (article 25, paragraphe 2, point a) ; un préavis d'au plus deux mois pour déclencher le changement (point d) ; une spécification exhaustive des catégories de données exportables et d'actifs numériques (points e et f) ; une période de récupération d'au moins 30 jours après la transition (point g) ; l'effacement des données exportables à l'issue de la récupération (point h). Si les 30 jours sont techniquement irréalisables, le fournisseur le notifie sous 14 jours ouvrables et propose une période alternative d'au plus sept mois ; le client peut prolonger la transition une fois (paragraphes 4 et 5). Les frais de changement sont interdits à partir du 12 janvier 2027, et limités aux coûts directement liés avant cette date (article 29). Le règlement s'applique depuis le 12 septembre 2025 (article 50). Il vise les « services de traitement de données », que sa définition décrit comme des services numériques fournis à un client et permettant un accès réseau omniprésent et à la demande (la suite de la définition n'a pas été relue) : qu'un service SaaS donné y entre est une question juridique, que ce module ne tranche pas.

#### La restitution

| Élément | Contenu | Format |
|---|---|---|
| Données structurées | Enregistrements de chaque type de ressource, relations par clés | CSV déclaré, ou JSON en lignes |
| Pièces jointes | Fichiers d'origine, avec leurs métadonnées | Fichiers tels quels, et fichier de métadonnées |
| Configuration | Types, champs, états, règles, rôles, workflows, vues | JSON documenté (actifs numériques) |
| Journaux d'audit du tenant | Historique des actions du tenant | JSON en lignes |
| Utilisateurs et rôles | Comptes, affectations | CSV ou JSON, sans secrets |
| Dictionnaire de données | Schéma, types, relations, valeurs permises | Document lisible et JSON |
| Manifeste | Fichiers, comptes, empreintes | JSON |
| Notice | Comment réutiliser, limites | Texte |

Le RFC 4180, qui décrit le format CSV, indique qu'il est informatif, qu'il ne spécifie aucune norme et qu'il n'existe pas de spécification formelle, d'où des interprétations variées. La restitution **déclare donc son dialecte** : encodage UTF-8, séparateur virgule, fins de ligne, ligne d'en-tête, guillemets doubles, dates au format ISO 8601 en UTC, identifiants stables. Les structures imbriquées se rendent en JSON.

**Les tableurs et l'injection de formules.** Quand un export CSV est ouvert dans un tableur, une cellule dont le contenu commence par `=`, `+`, `-` ou `@` (ou par une tabulation ou un retour chariot) peut être interprétée comme une formule ; la page de l'OWASP décrit cette attaque d'injection de formules, signale que les parades courantes (préfixer d'une apostrophe ou d'une tabulation) ne sont pas fiables dans tous les tableurs, et qu'il n'existe pas de stratégie universelle. Pour une restitution, on documente le risque, on propose des formats typés (JSON) pour la réutilisation par des programmes, et l'on neutralise le début des cellules de texte dans les fichiers destinés à des tableurs.

```typescript
import { createHash } from "node:crypto";

interface ExportFile {
  path: string;
  content: Uint8Array;
  records: number;
}

function buildManifest(tenantId: string, files: ExportFile[]) {
  return {
    tenant_id: tenantId,
    format_version: 1,
    files: files.map((f) => ({
      path: f.path,
      records: f.records,
      bytes: f.content.length,
      sha256: createHash("sha256").update(f.content).digest("hex"),
    })),
  };
}
```

Avec deux fichiers, `data/aircraft.csv` (1 enregistrement, 31 octets) et `data/findings.csv` (1 enregistrement, 46 octets), la fonction produit un manifeste avec leurs empreintes SHA-256 (par exemple `4466d925…64a6` pour le premier). Le client peut recalculer l'empreinte de chaque fichier après transfert. Le paquet est livré par un lien expirant, restreint à l'administrateur du tenant ([18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)), chiffré avec une clé transmise par un autre canal ; chaque téléchargement est journalisé, et le paquet est supprimé de chez le fournisseur après un délai court.

#### La suppression par périmètre

La suppression part d'un **inventaire** des emplacements où vivent les données d'un tenant ([20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données)).

| Périmètre | Méthode | Vérification |
|---|---|---|
| Base de données principale | Suppression des lignes du tenant, ou de son schéma ou de sa base dédiés | Comptage nul, absence de références |
| Réplicas | Suivent la base principale | Retard nul, comptage nul |
| Index de recherche | Suppression de l'index du tenant ([19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)) | Liste d'index sans le tenant |
| Stockage d'objets | Suppression des objets, de leurs versions et des marqueurs ([18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)) | Listage vide |
| Entrepôt analytique | Purge des partitions du tenant ([19.7 Charge transactionnelle et analytique, entrepôt, lac et ELT](19-recherche-analytique-restitution.md#197-charge-transactionnelle-et-analytique-entrepôt-lac-et-elt)) | Comptage nul |
| Caches | Invalidation par préfixe de tenant ([22.3 Mise en cache](22-performance-echelle-economie.md#223-mise-en-cache)) | Absence de clés |
| Journaux et télémétrie | Suppression ou anonymisation selon la rétention ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) | Politique appliquée |
| Sauvegardes | Expiration à l'échéance, ou effacement cryptographique si la clé est propre au tenant ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)) | Date d'expiration documentée |
| Sous-traitants et intégrations | Demande de suppression et confirmation ([20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée)) | Accusés de réception |
| Clés | Destruction ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) | Journal du gestionnaire de clés |

Le guide NIST SP 800-88, dans sa révision 1 (retirée le 26 septembre 2025 et remplacée par la révision 2, que ce module n'a pas lue), décrit l'effacement cryptographique : il utilise le chiffrement des données et assainit la clé, ce qui ne laisse que du texte chiffré et rend les données irrécupérables sans la clé ; il déconseille de l'employer si le chiffrement a été activé après que des données sensibles avaient été stockées sans avoir été assainies, ou si l'on ne sait pas si c'est le cas. Pour un tenant dont les données et les sauvegardes sont chiffrées par une clé propre ([5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)), détruire la clé couvre les copies que l'on ne sait pas supprimer une à une.

```sql
-- Vérification d'absence : ce qu'il reste du tenant dans les magasins relationnels
SELECT 'aircraft' AS store, count(*) AS remaining FROM aircraft WHERE tenant_id = $1
UNION ALL
SELECT 'finding', count(*) FROM finding WHERE tenant_id = $1
UNION ALL
SELECT 'file_asset', count(*) FROM file_asset WHERE tenant_id = $1
UNION ALL
SELECT 'config_override', count(*) FROM config_override WHERE tenant_id = $1
UNION ALL
SELECT 'pack_installation', count(*) FROM pack_installation WHERE tenant_id = $1
ORDER BY store;
```

En pratique, la liste des tables à contrôler vient du catalogue des ressources et des tables par tenant, pas d'une liste écrite à la main : un type ajouté plus tard doit entrer automatiquement dans la suppression et dans la vérification ([2.19 Architecture pilotée par les métadonnées et par les modèles](02-donnees-ressources.md#219-architecture-pilotée-par-les-métadonnées-et-par-les-modèles)).

#### Le certificat

Le même guide du NIST décrit un certificat d'élimination : il doit consigner au moins le fabricant, le modèle et le numéro de série du support, la source, la description de l'assainissement (effacement, purge, destruction), la méthode employée (dont l'effacement cryptographique), l'outil et sa version, la méthode de vérification, et la destination. Il précise que la décision d'établir un certificat et la quantité d'informations à y consigner dépendent du niveau de confidentialité des données. Transposé à un tenant :

| Élément du guide | Transposition |
|---|---|
| Support et identifiants | Magasin de données et identifiants du tenant |
| Source | Tenant et région d'origine |
| Description (effacement, purge, destruction) | Catégorie de la méthode, par périmètre |
| Méthode employée | Suppression de lignes, purge d'index, effacement cryptographique |
| Outil et version | Procédure automatisée et version |
| Méthode de vérification | Comptage, listage, journal de clés |
| Date et exécutant | Horodatage, acteur (service ou personne) |

```json
{
  "certificate_id": "del_cert_2026_04_02_017",
  "tenant_id": "ten_airline_01",
  "issued_at": "2026-04-02T09:00:00Z",
  "request": { "type": "contract_termination", "effective_date": "2026-02-28", "retention_end": "2026-03-31" },
  "scopes": [
    { "store": "primary_database", "method": "row_deletion", "tool": "tenant-purge 4.8.1", "verified": "count=0", "completed_at": "2026-03-31T22:14:00Z" },
    { "store": "search_index", "method": "index_deletion", "tool": "tenant-purge 4.8.1", "verified": "index_absent", "completed_at": "2026-03-31T22:20:00Z" },
    { "store": "object_storage", "method": "object_and_version_deletion", "tool": "tenant-purge 4.8.1", "verified": "listing_empty", "completed_at": "2026-04-01T03:40:00Z" },
    { "store": "tenant_encryption_keys", "method": "cryptographic_erase", "tool": "kms-destroy", "verified": "key_destroyed_log", "completed_at": "2026-04-01T04:05:00Z" }
  ],
  "exclusions": [
    { "store": "backups", "reason": "expiration à l'échéance", "latest_expiry": "2026-05-29" },
    { "store": "invoicing_records", "reason": "obligation légale de conservation", "legal_basis_reference": "contrat, annexe conservation" }
  ],
  "sub_processors": [
    { "name": "messaging-provider", "confirmation": "received", "confirmed_at": "2026-04-01T15:00:00Z" }
  ],
  "integrity": { "digest": "sha256:0f6b19c3a5b24e0f8e2e5f2f6d2a8bd3a86a1b0a1d4a64f4ea0e2f3b7f8c41aa" }
}
```

**Les exclusions sont dites.** Un certificat qui prétend tout couvrir sans nommer les sauvegardes ni les conservations légales est trompeur. Le gel légal ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)) suspend la suppression et le certificat l'indique, avec la date de réexamen. Les informations qui doivent être conservées (factures, preuves d'accès) le sont dans leur périmètre minimal, sans données de contenu.

**Modes de défaillance.**

- **Export partiel.**
- **Format propriétaire** ou non documenté.
- **Suppression qui oublie** un périmètre (index, entrepôt, journaux).
- **Aucune vérification** après suppression.
- **Certificat automatique non vérifié**, ou qui tait les sauvegardes.
- **Sous-traitants non relancés.**

**Contre-exemple.** À la résiliation, un éditeur supprime la base du tenant et émet un certificat « toutes les données ont été supprimées ». Six mois plus tard, un audit du client découvre l'index de recherche, les documents générés et un entrepôt analytique encore remplis de ses données. Le certificat affirmait plus que ce qui avait été fait ; la rupture de confiance pèse plus que la faute de suppression.

**Limites.** Le fournisseur atteste son périmètre et les confirmations reçues : il ne peut pas prouver au-delà de ce que ses sous-traitants confirment. Les sauvegardes subsistent jusqu'à leur expiration, ce qui est acceptable si c'est dit et encadré. Certaines données doivent être conservées par obligation légale. Enfin, la restitution des données n'équivaut pas à la reconstruction du service : la configuration exportée n'est utile que si le client peut la réutiliser, ce qui n'est pas toujours possible ailleurs.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.6 Cycle de vie SaaS, provisionnement et déprovisionnement](01-architecture-saas.md#16-cycle-de-vie-saas-provisionnement-et-déprovisionnement) | La sortie est la dernière étape du cycle de vie du client |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Les états en suppression, la rétention et l'effacement cryptographique |
| [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export) | L'export est le mécanisme de base de la restitution |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | La livraison par lien expirant |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | Le gel légal suspend la suppression |
| [20.1 Classification et inventaire des données](20-gouvernance-donnees-conformite.md#201-classification-et-inventaire-des-données) | L'inventaire des données donne le périmètre de la suppression |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | La conservation, la pseudonymisation et l'anonymisation |
| [20.4 Droits des personnes et gestion du consentement](20-gouvernance-donnees-conformite.md#204-droits-des-personnes-et-gestion-du-consentement) | Les droits des personnes, dont la portabilité, sont distincts de la restitution contractuelle |
| [20.10 Transferts de données, sous-traitants et responsabilité partagée](20-gouvernance-donnees-conformite.md#2010-transferts-de-données-sous-traitants-et-responsabilité-partagée) | Les sous-traitants doivent supprimer et confirmer |
| [24.8 Renouvellement et analyse du départ des clients](#248-renouvellement-et-analyse-du-départ-des-clients) | L'enquête de sortie nourrit l'analyse des départs |

### 5. Application pratique

**Situation initiale.** Alpha Air résilie son contrat et passe chez un autre éditeur. Son auditeur exige la preuve que les données de passagers ne subsistent pas chez l'ancien fournisseur.

**Problème.** Restituer l'ensemble des données de façon exploitable, puis supprimer, et prouver.

**Application du concept.** Une sortie suivant le calendrier, la restitution outillée et le certificat par périmètre.

**Déroulé.**

1. Le 15 janvier, la résiliation est enregistrée, avec date d'effet le 28 février. L'équipe de réussite client ouvre le scénario de sortie ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)).
2. Le 1er mars, le tenant passe en lecture seule. Le paquet de restitution est généré : 12 fichiers de données, 38 200 pièces jointes, la configuration en JSON, le dictionnaire de données et le manifeste.
3. Sophie télécharge le paquet par un lien expirant, vérifie les empreintes, et signale deux colonnes dont le sens n'est pas clair : le dictionnaire est complété.
4. Pendant la période de récupération de 30 jours, aucun autre téléchargement n'est nécessaire ; le tenant reste en lecture seule.
5. Le 31 mars, la suppression s'exécute par périmètre, avec vérification de chaque magasin ; la clé du tenant est détruite ; les sous-traitants confirment.
6. Le 2 avril, le certificat est émis avec ses exclusions : sauvegardes expirant au plus tard le 29 mai, et pièces de facturation conservées par obligation légale.

**Résultat.** Alpha Air dispose d'un paquet exploitable et d'un certificat qui répond aux questions de son auditeur, avec les exclusions nommées.

**Limites.** Le client a signalé que sa configuration de workflows exportée ne s'importe pas telle quelle dans le nouveau produit : le format est documenté, mais la réutilisation demande un travail de traduction que le fournisseur n'assure pas.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les phases d'une sortie de client ?
2. **Compréhension.** Que contient un paquet de restitution ?
3. **Compréhension.** Quels éléments un certificat de suppression doit-il contenir ?
4. **Pourquoi.** Pourquoi un certificat doit-il nommer les exclusions ?
5. **Raisonnement pratique.** Un tenant a des données et des sauvegardes chiffrées par une clé qui lui est propre. Que permet la destruction de cette clé, et à quelle condition ?

#### Réponses

1. Préavis, transition (lecture seule), récupération, rétention, suppression par périmètre, puis émission du certificat.
2. Les données structurées, les pièces jointes, la configuration, les journaux d'audit du tenant, les utilisateurs et rôles, un dictionnaire de données, un manifeste avec comptes et empreintes, et une notice.
3. Les périmètres, la méthode de chaque périmètre, l'outil et sa version, la vérification faite, les dates et l'exécutant, les confirmations des sous-traitants, et les exclusions.
4. Parce qu'un certificat qui affirme tout couvrir alors que des copies subsistent (sauvegardes, conservations légales) est trompeur : le client doit savoir ce qui reste et jusqu'à quand.
5. Elle rend illisibles toutes les copies chiffrées, y compris celles qu'on ne peut pas supprimer une à une, comme les sauvegardes. La condition : que toutes les données aient été chiffrées avec cette clé dès leur écriture, et que la gestion des clés soit rigoureuse.

## 24.8 Renouvellement et analyse du départ des clients

### 1. Comprendre simplement

Le **renouvellement** (*renewal*) est la reconduction du contrat d'un client à son échéance, expresse ou tacite. L'**analyse du départ** (*churn analysis*) mesure et explique les clients et le revenu perdus : combien partent, lesquels, quand, et pourquoi. Ensemble, **renouvellement et analyse du départ** (*renewal and churn analysis*) disent si la base de clients se maintient et pourquoi elle se déforme.

**Pourquoi cela existe.** Dans un modèle d'abonnement, la valeur d'un client se réalise sur des renouvellements successifs. La croissance dépend autant de ce que l'on garde que de ce que l'on acquiert. Comprendre les départs est la meilleure source d'amélioration du produit, de l'accompagnement et de l'offre.

**Problème résolu.** Prévoir et conduire les renouvellements, mesurer la rétention avec des indicateurs comparables, et transformer les départs en apprentissage.

**Modèle mental.** Un réservoir. Il se vide par des fuites (clients qui partent, abonnements réduits) et se remplit par des apports (nouveaux clients, extensions). L'analyse du départ cherche où sont les fuites.

**Où l'analogie s'arrête.** L'eau d'un réservoir est homogène. Les clients ont des tailles, des histoires et des raisons de partir très différentes : une moyenne les confond.

**Exemple.** Une cohorte de 10 comptes de 50 000 € de revenu récurrent mensuel (MRR) chacun, soit 500 000 €. Un compte part (−50 000 €), deux réduisent (−10 000 € au total), trois s'étendent (+65 000 €). Le taux de départ de clients est de 10 %, la rétention brute de revenu de 88 %, la rétention nette de 101 %. La rétention nette dépasse 100 % : elle masque la fuite que la rétention brute révèle.

**Les composants.**

1. le **calendrier** de renouvellement ;
2. la **prévision** de renouvellement ;
3. le **taux de départ de clients** ;
4. le **taux de départ de revenu**, brut et net ;
5. l'analyse par **cohortes** ;
6. les **motifs** de départ ;
7. les **signaux précurseurs** ;
8. la **boucle de retour** vers le produit et l'accompagnement.

**Objectif d'apprentissage :** vous pouvez calculer le taux de départ de clients et la rétention brute et nette d'une cohorte, analyser des cohortes et organiser un calendrier de renouvellement.

### 2. Connaissances essentielles

#### Définition

- **Renouvellement** : reconduction d'un contrat d'abonnement à son échéance.
- **Départ de clients** (*logo churn*) : part des clients perdus sur une période, rapportée au nombre de clients au début de cette période.
- **Départ de revenu** (*revenue churn*) : part du revenu récurrent perdue par départ de clients et par réduction d'abonnements.
- **Rétention brute de revenu** (*gross revenue retention*) : part du revenu de départ conservée, sans compter les extensions.
- **Rétention nette de revenu** (*net revenue retention*) : part du revenu de départ retrouvée en ajoutant les extensions des clients existants.

#### Idées fondamentales

1. **Deux mesures du départ : les clients et le revenu.** Elles répondent à deux questions : combien de clients perd-on, et quelle part de revenu ?
2. **La rétention brute ne dépasse pas 100 %.** La nette le peut, parce qu'elle ajoute les extensions.
3. **La nette peut cacher une fuite.** On regarde toujours la brute avec elle.
4. **On mesure par cohorte, sur une période définie.** Le dénominateur est la base au début de la période.
5. **Une réduction n'est pas un départ.** Un client qui résilie un abonnement sur deux est en contraction.
6. **Les départs involontaires et volontaires diffèrent.** Un échec de paiement n'est pas un choix du client.
7. **Les motifs se codifient et se confrontent aux faits.** Le motif déclaré n'est pas toujours la cause observée.

#### Vocabulaire essentiel

- **Revenu récurrent mensuel** (*monthly recurring revenue*, MRR) : revenu mensuel prévisible des abonnements.
- **Contraction** (*contraction*) : baisse de revenu d'un client conservé.
- **Expansion** (*expansion*) : hausse de revenu d'un client conservé.
- **Cohorte** (*cohort*) : groupe de clients défini par une date commune, par exemple le mois de départ de l'abonnement.
- **Reconduction tacite** (*auto-renewal*) : renouvellement sans acte nouveau, sauf préavis de non-renouvellement.
- **Départ involontaire** (*involuntary churn*) : perte due à un échec de paiement ou à un incident administratif.
- **Réactivation** (*reactivation*) : retour d'un client perdu.

#### Relations de cause à effet

- On ne regarde que la rétention nette. Des clients de grande taille qui s'étendent masquent des petits clients qui partent.
- On calcule un taux annuel avec des clients arrivés en cours d'année. Le dénominateur est faux et le taux, trompeur.
- On compte la résiliation d'un seul abonnement comme un départ. Le taux de départ de clients est surestimé.
- Les motifs de départ ne sont pas codifiés. On ne retient qu'une impression, et le produit ne reçoit aucune information exploitable.
- Le renouvellement se prépare trop tard. La négociation commence quand le préavis de non-renouvellement est déjà échu.

#### Idées reçues

- **« Le taux de départ est une mesure unique. »** Non. Il existe en clients et en revenu, brut et net : chaque mesure répond à une question différente.
- **« Une rétention nette supérieure à 100 % prouve que tout va bien. »** Non. Elle peut coexister avec une rétention brute qui se dégrade.
- **« Les clients qui partent disent pourquoi. »** Pas toujours. Le motif déclaré est souvent un motif poli ; l'usage observé avant le départ en dit plus.

#### Principe clé

On mesure le départ en clients et en revenu, en brut et en net, par cohorte ; on prépare chaque renouvellement à l'avance avec le signal de santé ; et l'on fait remonter les motifs vers le produit et l'accompagnement.

#### Si vous ne retenez que trois choses

1. Départ de clients, rétention brute et rétention nette répondent à trois questions différentes ; on les lit ensemble.
2. On les calcule par cohorte, avec pour dénominateur la base du début de période.
3. Les motifs de départ alimentent le produit, l'intégration et le support ; le renouvellement se prépare des mois avant.

### 3. Explication technique détaillée

#### Les définitions de mesure

La documentation d'un outil d'analyse d'abonnements, ChartMogul, fixe des définitions précises qui servent de référence. Le **taux de départ de clients** est le pourcentage de clients qui annulent ou ne renouvellent pas leur abonnement sur une période ; le numérateur retranche les clients qui sont arrivés et partis dans la même période, ainsi que ceux qui sont partis puis ont été réactivés ; le dénominateur est le nombre de clients au début de la période ; un client qui résilie une partie seulement de ses abonnements reste actif et sa résiliation est comptée en contraction. Le **taux de départ brut de MRR** est la somme du revenu perdu par départ et par contraction, divisée par le MRR de début de période, sans compter l'expansion ni la réactivation. La version nette ajoute l'expansion et la réactivation.

Les formules de rétention brute et nette sont d'usage courant (billets de fournisseurs d'outils, sources secondaires) :

$$\text{GRR} = \frac{R_0 - D - C}{R_0} \qquad \text{NRR} = \frac{R_0 - D - C + E}{R_0}$$

où $R_0$ est le revenu récurrent de la cohorte au début de la période, $D$ le revenu perdu par départ de clients, $C$ la contraction et $E$ l'expansion des clients conservés. La rétention brute vaut au plus 100 % ; la nette peut le dépasser.

| Mesure | Question | Valeur de l'exemple |
|---|---|---|
| Départ de clients | Combien de clients a-t-on perdus ? | 1 sur 10, soit 10 % |
| Rétention brute | Quelle part du revenu garde-t-on, hors extensions ? | $(500 - 50 - 10) / 500 = 88\ \%$ |
| Rétention nette | Où en est la base, extensions comprises ? | $(500 - 50 - 10 + 65) / 500 = 101\ \%$ |

```typescript
interface Account {
  id: string;
  startMrr: number;
  churned: boolean;
  contraction: number;
  expansion: number;
}

function retention(accounts: Account[]) {
  const start = accounts.reduce((sum, a) => sum + a.startMrr, 0);
  const churnMrr = accounts.filter((a) => a.churned).reduce((sum, a) => sum + a.startMrr, 0);
  const contraction = accounts.reduce((sum, a) => sum + a.contraction, 0);
  const expansion = accounts.reduce((sum, a) => sum + a.expansion, 0);
  const lostLogos = accounts.filter((a) => a.churned).length;
  return {
    logoChurn: lostLogos / accounts.length,
    grr: (start - churnMrr - contraction) / start,
    nrr: (start - churnMrr - contraction + expansion) / start,
  };
}
```

Appliquée aux dix comptes de l'exemple, la fonction renvoie un départ de clients de 10,0 %, une rétention brute de 88,0 % et une rétention nette de 101,0 %.

#### Les cohortes

Une **cohorte** regroupe des clients qui ont commencé à la même période : on suit combien restent après un, deux, douze mois.

```sql
WITH cohort AS (
  SELECT tenant_id,
         date_trunc('month', first_paid_at)::date AS cohort_month
    FROM subscription_summary
), activity AS (
  SELECT tenant_id,
         date_trunc('month', period_start)::date AS active_month
    FROM subscription_period
   WHERE mrr > 0
   GROUP BY tenant_id, date_trunc('month', period_start)
)
SELECT c.cohort_month,
       (extract(year FROM age(a.active_month, c.cohort_month)) * 12
        + extract(month FROM age(a.active_month, c.cohort_month)))::int AS months_since_start,
       count(DISTINCT a.tenant_id)                                       AS active_tenants
  FROM cohort c
  JOIN activity a ON a.tenant_id = c.tenant_id
 GROUP BY c.cohort_month, months_since_start
 ORDER BY c.cohort_month, months_since_start;
```

Chaque ligne donne, pour une cohorte, le nombre de tenants encore actifs N mois après le début. Rapporté à la taille de la cohorte, c'est la courbe de rétention. On y lit les âges critiques (le troisième mois, le douzième) où l'on perd le plus, ce qui oriente l'accompagnement ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur), [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)).

#### Le calendrier de renouvellement

```json
{
  "renewal_calendar": [
    { "days_before_term": 180, "action": "forecast_and_review_health", "owner": "account_manager" },
    { "days_before_term": 120, "action": "start_playbook:renewal_preparation", "owner": "account_manager" },
    { "days_before_term": 90, "action": "send_renewal_proposal", "owner": "account_manager" },
    { "days_before_term": 60, "action": "negotiate_and_resolve_blockers", "owner": "account_manager" },
    { "days_before_term": 30, "action": "close_or_escalate", "owner": "customer_success_lead" }
  ],
  "contract": { "auto_renew": true, "non_renewal_notice_days": 60 }
}
```

La date qui compte est le **préavis de non-renouvellement** du contrat : la préparation doit être terminée avant. La prévision combine le score de santé ([24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte)), l'usage et les signaux de relation ; elle se corrige avec l'issue réelle des échéances.

#### Les motifs et les signaux

| Famille | Exemples de motifs | Signal précurseur |
|---|---|---|
| Produit | Fonction manquante, performance, fiabilité | Cas de support récurrents, incidents ([24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support), [24.6 Page d'état, communication d'incident et fenêtre de maintenance](#246-page-détat-communication-dincident-et-fenêtre-de-maintenance)) |
| Valeur et usage | Jamais activé, adoption faible | Activation tardive ou absente, largeur basse ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur), [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte)) |
| Prix et budget | Réduction de budget, renégociation | Demande de remise, baisse du nombre de sièges |
| Relation | Départ du sponsor, changement d'équipe | Contact perdu, absence aux revues |
| Concurrence | Offre concurrente | Questions de portabilité, demande d'export |
| Événement | Fusion, rachat, cessation d'activité | Information externe |
| Involontaire | Échec de paiement, carte expirée | Rejets de paiement |

On distingue le **motif déclaré** (enquête de sortie, échange avec la gestionnaire de compte) et le **motif observé** (usage dans les 90 jours précédents, incidents, cas de support). Le premier est codifié dans une liste de valeurs ; le second se calcule. Les deux sont enregistrés, et l'écart entre eux est une information.

**La boucle de retour.** Les motifs agrégés par segment alimentent l'amélioration de l'intégration, du support, de la feuille de route ([29.5 Feuille de route, analytique produit et expérimentation](29-organisation-produit-economie.md#295-feuille-de-route-analytique-produit-et-expérimentation)) et de la politique de prix. Une analyse du départ qui ne change rien n'est que de l'archivage.

**Modes de défaillance.**

- **Une seule mesure** (la rétention nette).
- **Taux calculé** sur un dénominateur qui inclut les nouveaux clients.
- **Cohortes mélangées.**
- **Contraction comptée comme départ.**
- **Motifs non codifiés.**
- **Préparation du renouvellement tardive.**
- **Départs involontaires** traités comme des choix du client.

**Contre-exemple.** Une direction se réjouit d'une rétention nette de 112 %. Elle ne regarde pas la rétention brute, qui est passée de 92 % à 81 % en un an : de gros clients s'étendent, pendant que les petits partent en nombre. Deux ans plus tard, l'extension des gros clients s'épuise et la base se contracte sans que personne l'ait vu venir.

**Limites.** Une cohorte demande de l'historique et une taille suffisante : sur 15 clients, un seul départ change le taux de 7 points. Les définitions de mesure varient d'une entreprise à l'autre : on compare aux chiffres des autres avec prudence, et à soi-même avec constance. L'analyse décrit les départs ; elle n'en établit pas les causes, qui demandent des entretiens et des comparaisons.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur) | Une activation tardive ou absente précède souvent un départ |
| [24.3 Mesures d'adoption et score de santé du compte](#243-mesures-dadoption-et-score-de-santé-du-compte) | Le score de santé alimente la prévision et se valide par les renouvellements |
| [24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client) | La préparation du renouvellement et le suivi du départ sont des scénarios |
| [24.5 Niveaux de support et modèle d'accès du support](#245-niveaux-de-support-et-modèle-daccès-du-support) | Les cas de support sont des signaux précurseurs |
| [24.7 Départ du client : sortie, restitution et certificat de suppression](#247-départ-du-client--sortie-restitution-et-certificat-de-suppression) | L'enquête de sortie fournit les motifs déclarés |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | L'abonnement et ses droits d'usage définissent ce qui se renouvelle |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | Le coût de service se lit avec la rétention : un client coûteux et fidèle, ou non |
| [29.5 Feuille de route, analytique produit et expérimentation](29-organisation-produit-economie.md#295-feuille-de-route-analytique-produit-et-expérimentation) | Les motifs de départ alimentent la feuille de route |

Les aspects commerciaux (offres, facturation, tarification) relèvent du [module 16 du plan des compléments](../PLAN-COMPLEMENTS.md#module-16--monétisation-et-facturation).

### 5. Application pratique

**Situation initiale.** L'éditeur de `acme.mro-aviation` annonce 106 % de rétention nette et se croit en bonne santé. Le directeur financier demande pourquoi le nombre de clients a baissé de 4 % sur l'année.

**Problème.** Une seule mesure, calculée sur toute la base, sans cohortes ni motifs.

**Application du concept.** L'équipe calcule les trois mesures par segment, suit les cohortes et codifie les motifs.

**Déroulé.**

1. Elle calcule sur 12 mois : départ de clients de 9 %, rétention brute de 89 %, rétention nette de 106 %.
2. Elle découpe par segment : petits opérateurs, rétention brute de 78 % ; compagnies moyennes, 91 % ; grands comptes, 97 % avec une forte expansion.
3. L'analyse de cohortes montre que les petits opérateurs partent surtout entre le troisième et le sixième mois, après une activation tardive.
4. L'enquête de sortie et l'usage observé donnent les motifs : « jamais activé » (46 %), « budget » (22 %), « fonction manquante » (18 %), autres (14 %).
5. L'équipe renforce l'intégration des petits opérateurs ([24.1 Intégration, activation et délai de mise en valeur](#241-intégration-activation-et-délai-de-mise-en-valeur), [24.2 Migration de données à l'intégration et modèles de départ](#242-migration-de-données-à-lintégration-et-modèles-de-départ)) et crée un scénario « adoption en panne » pour les trois premiers mois ([24.4 Scénarios de réussite client](#244-scénarios-de-réussite-client)).
6. Elle suit le même indicateur par cohorte chaque trimestre.

**Résultat.** La rétention brute des petits opérateurs passe de 78 % à 86 % en deux trimestres (valeurs d'exemple), et le nombre de clients cesse de baisser.

**Limites.** Les motifs « budget » restent difficiles à traiter par l'accompagnement : ils relèvent de l'offre et du prix, donc d'une décision commerciale. Et l'effet des actions se confond partiellement avec celui de la conjoncture.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre départ de clients, rétention brute et rétention nette ?
2. **Compréhension.** Pourquoi une rétention nette supérieure à 100 % peut-elle être trompeuse ?
3. **Compréhension.** Comment compte-t-on un client qui résilie un seul de ses deux abonnements ?
4. **Pourquoi.** Pourquoi calcule-t-on les départs par cohorte ?
5. **Raisonnement pratique.** Une cohorte a 1 000 000 € de revenu récurrent au début de l'année. Elle perd 60 000 € par départs, 20 000 € par contraction, et gagne 120 000 € d'expansion. Quelles sont ses rétentions brute et nette ?

#### Réponses

1. Le départ de clients compte les clients perdus ; la rétention brute mesure la part du revenu conservée sans extensions ; la rétention nette y ajoute les extensions des clients conservés.
2. Parce qu'elle inclut l'expansion : de gros clients qui s'étendent peuvent compenser le départ de nombreux petits, et masquer une rétention brute qui se dégrade.
3. Comme une contraction : le client reste actif, et la résiliation partielle est comptée dans la réduction du revenu, pas comme un départ.
4. Parce que des clients arrivés à des dates différentes n'ont pas le même âge ni le même parcours : par cohorte, on compare des situations comparables et l'on repère les âges critiques.
5. Rétention brute : $(1\,000\,000 - 60\,000 - 20\,000) / 1\,000\,000 = 92\ \%$. Rétention nette : $(1\,000\,000 - 60\,000 - 20\,000 + 120\,000) / 1\,000\,000 = 104\ \%$.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Activation et mise en valeur | Dave McClure, cadre « AARRR » ; définitions de pratique de fournisseurs d'outils d'analyse | Résultats de recherche (sources secondaires) | 24.1 |
| Format CSV | IETF, RFC 4180, *Common Format and MIME Type for CSV Files* | [rfc-editor.org](https://www.rfc-editor.org/rfc/rfc4180) | 24.2, 24.7 |
| Chargement idempotent par clé externe | Salesforce, *upsert()* de l'interface de programmation | Résultats de recherche (extraits ; page non lue, accès refusé) | 24.2 |
| Fiches de score de santé | Gainsight, *Scorecards: Quantifying Customer Health*, 2013 | [gainsight.com](https://www.gainsight.com/blog/scorecards-quantifying-customer-health/) | 24.3 |
| Appels à action et scénarios | Gainsight, *CTAs, Tasks, and Playbooks Overview* | [support.gainsight.com](https://support.gainsight.com/gainsight_nxt/04Cockpit_and_Playbooks/00Cockpit_Horizon_Experience/About/CTAs%2C_Tasks%2C_and_Playbooks_Overview) | 24.4 |
| Gravités et délais de support | AWS Support, *Case management* ; *AWS Support plans* ; *SeverityLevel* | [case management](https://docs.aws.amazon.com/awssupport/latest/user/case-management.html), [plans](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html), [API](https://docs.aws.amazon.com/awssupport/latest/APIReference/API_SeverityLevel.html) | 24.5 |
| Approbation de l'accès du fournisseur | Microsoft, *Customer Lockbox for Microsoft Azure* | [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/security/fundamentals/customer-lockbox-overview) | 24.5 |
| Approbation de l'accès du fournisseur | Google Cloud, *Access Approval overview* | [docs.cloud.google.com](https://docs.cloud.google.com/assured-workloads/access-approval/docs/overview) | 24.5 |
| Incidents et maintenance planifiée | Atlassian, *Statuspage*, pages d'aide *Create an incident* et *Schedule maintenance* | [create an incident](https://support.atlassian.com/statuspage/docs/create-an-incident/), [schedule maintenance](https://support.atlassian.com/statuspage/docs/schedule-maintenance/) | 24.6 |
| États de composants et indicateurs | Page d'API d'un service hébergé sur Statuspage | [opsgenie.status.atlassian.com](https://opsgenie.status.atlassian.com/api) | 24.6 |
| Suppression ou restitution | Règlement (UE) 2016/679, article 28 | [gdpr-info.eu](https://gdpr-info.eu/art-28-gdpr/) | 24.7 |
| Portabilité des données | Règlement (UE) 2016/679, article 20 | [gdpr-info.eu](https://gdpr-info.eu/art-20-gdpr/) | 24.7 |
| Changement de fournisseur | Règlement (UE) 2023/2854, articles 2, 25, 29 et 50 | Site d'aide à la lecture : [article 2](https://www.springlex.eu/en/packages/data-act/data-act-regulation/article-2/), [article 25](https://www.springlex.eu/en/packages/data-act/data-act-regulation/article-25/), [article 29](https://www.springlex.eu/en/packages/data-act/data-act-regulation/article-29/), [article 50](https://www.springlex.eu/en/packages/data-act/data-act-regulation/article-50/) | 24.7 |
| Assainissement des supports | NIST, SP 800-88 révision 1 (retirée le 26 septembre 2025, remplacée par la révision 2) | [csrc.nist.gov, révision 2](https://csrc.nist.gov/pubs/sp/800/88/r2/final) ; texte de la révision 1 lu | 24.7 |
| Injection de formules | OWASP, *CSV Injection* | [community.owasp.org](https://community.owasp.org/attacks/CSV_Injection) | 24.7 |
| Taux de départ de clients et de revenu | ChartMogul, *Customer Churn Rate* ; *Gross MRR Churn Rate* | [taux de départ de clients](https://help.chartmogul.com/hc/en-us/articles/203359321), [taux de départ brut](https://help.chartmogul.com/hc/en-us/articles/204898491) | 24.8 |
| Rétention brute et nette | Billets de fournisseurs d'outils d'analyse d'abonnements | Résultats de recherche (sources secondaires) | 24.8 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- Les termes de pratique du module (intégration, activation, délai de mise en valeur, score de santé, scénario de réussite, niveaux de support de 0 à 3, motifs de départ) n'ont pas de définition normative. Ils sont présentés comme des définitions de travail, appuyées sur des pages de fournisseurs ou des résultats de recherche.
- La page de l'interface de programmation de Salesforce sur l'insertion-ou-mise-à-jour n'a pas pu être lue (accès refusé) : seul un extrait de résultats de recherche est utilisé. La page du manuel de GitLab sur les scores de santé n'a pas pu être exploitée et n'est pas citée.
- Les formules de rétention brute et nette sont d'usage courant et proviennent de billets de fournisseurs d'outils ; seules les définitions du taux de départ de clients et du taux de départ brut de MRR ont été lues sur leur source.
- Le règlement (UE) 2023/2854 a été lu sur un site d'aide à la lecture, qui rappelle que le texte authentique est celui du Journal officiel ; la définition complète des services de traitement de données n'a pas été relue, et l'application à un service SaaS donné est une question juridique.
- Le guide NIST SP 800-88 a été lu dans sa révision 1, retirée et remplacée par la révision 2, dont seule la page de présentation a été consultée : les éléments du certificat sont ceux de la révision 1.
- Les schémas de l'interface de programmation de Statuspage n'ont pas pu être lus ; les statuts viennent des pages d'aide et d'une page d'API d'un service hébergé sur Statuspage.
- Les durées, les seuils, les poids, les cadences, les taux et les montants du module sont des valeurs d'exemple.
- Les formats de plan d'intégration, de correspondance d'import, de grille de score, de scénario, de plan de support, de demande d'accès, de page d'état, de manifeste, de certificat et de calendrier sont propres à la plateforme fictive.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance. Les extraits TypeScript ont été contrôlés syntaxiquement et exécutés avec Node.js sur les exemples donnés (activation, validation de ligne, score, déclenchement, délai de réponse, cadence, manifeste, rétention).
