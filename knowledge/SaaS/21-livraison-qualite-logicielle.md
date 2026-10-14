# Module 21 — Livraison logicielle et assurance qualité

> **Question directrice.** Comment livrer chaque jour du code et de la configuration à des centaines de tenants sans casser personne, et savoir que cela marche avant que les clients ne le découvrent ?

## Présentation du module

**Objectif.** Le parcours initial gouverne finement la livraison de la **configuration** : brouillon, simulation, publication progressive, retour arrière ([8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement), [9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques), [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)). Ce module traite la livraison du **code** et de l'**infrastructure** qui l'exécutent : l'intégration et la livraison continues, les environnements, les stratégies de déploiement, les migrations de base de données, la stratégie de test (y compris multi-tenant), les mesures de la livraison et la dette technique.

**Prérequis.** L'évolution et le versionnement de schéma ([2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)), les feature flags ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)), la configuration d'environnement et la promotion ([8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement)), le versionnement de la configuration ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)), le cycle de développement sécurisé ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)) et la configuration sûre ([12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)). La revue et l'approbation des changements ([9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)), le versionnement d'API ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) et la distinction entre configuration et code ([13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)) servent de repères.

**Un mot, plusieurs sens.** Le mot « livraison » désigne ici la mise à disposition de **code** (une version de la plateforme) et d'**infrastructure**, par opposition à la publication d'une **configuration** de tenant. Un **déploiement** installe un artefact dans un environnement ; une **mise en production** (*release*) rend une fonction accessible aux utilisateurs. Les deux peuvent être séparés (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)).

**Ordre retenu.** Quatre groupes, de la chaîne de livraison au pilotage.

```text
Chaîne de livraison      intégration continue, artefact immuable ─ livraison continue, portes ─ environnements ─ infrastructure en code, GitOps
Stratégies de déploiement   vagues, bleu-vert, canari, progressif ─ retour arrière ou correction en avant, migrations de base
Stratégie de test        pyramide, contrats, bout en bout ─ isolation multi-tenant, configuration, données de test ─ sécurité
Pilotage                 gestion des versions, mesures de livraison ─ dette technique, décisions d'architecture
```

| Groupe | Question de l'équipe |
|---|---|
| Chaîne de livraison | Comment un changement devient-il un artefact fiable, testé et déployable ? |
| Stratégies de déploiement | Comment le mettre en production en limitant l'effet d'une erreur ? |
| Stratégie de test | Comment savoir que cela marche, pour tous les tenants, avant que les clients ne le découvrent ? |
| Pilotage | Comment mesurer, décider et garder une plateforme que l'on sait encore changer ? |

**Références.** Les articles, standards et documentations cités ont été confrontés à leur source pendant la rédaction, sauf indication contraire. La liste figure en fin de module, avec la date de consultation et ce qui n'a pas pu être vérifié.

## Sommaire du module

- [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable)
- [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité)
- [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements)
- [21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops)
- [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)
- [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)
- [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)
- [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)
- [21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline)
- [21.10 Gestion des versions et mesures de livraison](#2110-gestion-des-versions-et-mesures-de-livraison)
- [21.11 Dette technique et enregistrement des décisions d'architecture](#2111-dette-technique-et-enregistrement-des-décisions-darchitecture)

## 21.1 Intégration continue et artefact de build immuable

### 1. Comprendre simplement

L'**intégration continue** (*continuous integration*, CI) est une pratique par laquelle chaque membre d'une équipe fusionne ses changements dans une base de code commune très souvent, au moins une fois par jour, et où chaque fusion déclenche une construction automatique qui exécute les tests. Un **artefact de build immuable** (*immutable build artifact*) est le paquet déployable que cette construction produit une seule fois, identifié de façon unique, et qui ne change plus : c'est lui, et non une reconstruction, que l'on promeut d'un environnement à l'autre.

**Pourquoi cela existe.** Quand chacun travaille isolé pendant des semaines, la fusion devient une épreuve : conflits, comportements incompatibles, régressions découvertes tard. Et quand on reconstruit l'application pour chaque environnement, ce que l'on a testé n'est pas ce que l'on déploie : une dépendance a changé entre-temps, une option de compilation diffère.

**Problème résolu.** Détecter vite les erreurs d'intégration, et déployer exactement ce que l'on a testé.

**Modèle mental.** Une chaîne de production qui scelle des boîtes numérotées. Chaque boîte est contrôlée à la sortie de l'usine, puis voyage telle quelle vers l'entrepôt de test, puis vers le client. Personne ne rouvre une boîte scellée.

**Où l'analogie s'arrête.** Une boîte contient tout ce dont le client a besoin. Un artefact logiciel a besoin d'une **configuration** propre à chaque environnement (adresses, secrets) : elle se fournit au déploiement, séparément, sans modifier l'artefact.

**Exemple.** Une développeuse d'Alpha Air fusionne une correction dans la branche principale à 10 h 12. La construction compile, exécute les tests unitaires en 7 minutes, et produit une image `platform-api@sha256:9f2c…` identifiée par son empreinte. L'image est publiée une fois, puis déployée sans modification en préproduction, puis en production.

**Les composants.**

1. le **dépôt unique** et la **branche principale** ;
2. le **script de construction** automatisé ;
3. la **suite de tests** exécutée à chaque fusion ;
4. le **serveur d'intégration** ;
5. le **registre d'artefacts** ;
6. l'**identification par empreinte** ou par version ;
7. la **provenance** : preuve de la manière dont l'artefact a été construit ;
8. la **séparation entre artefact et configuration**.

**Objectif d'apprentissage :** vous pouvez décrire ce qu'une intégration continue vérifie, expliquer pourquoi un artefact doit être construit une seule fois, et dire ce qui doit rester hors de l'artefact.

### 2. Connaissances essentielles

#### Définition

- **Intégration continue** : pratique qui consiste à fusionner fréquemment (au moins quotidiennement) les changements dans une branche commune, chaque fusion étant vérifiée par une construction automatique qui exécute des tests.
- **Artefact de build immuable** : paquet déployable produit une seule fois par la construction, identifié de façon unique et jamais modifié après coup.

#### Idées fondamentales

1. **On intègre souvent, en petits changements.** Les erreurs se trouvent quand elles sont petites.
2. **La construction vérifie elle-même.** Elle compile et exécute les tests, et échoue si un test échoue.
3. **Une construction cassée est une urgence.** On la répare ou l'on annule le changement, sans attendre.
4. **On construit une fois, on déploie partout.** L'artefact testé est l'artefact déployé.
5. **L'artefact a une identité.** Une empreinte ou un identifiant unique, jamais un nom mutable comme « latest ».
6. **La configuration est séparée.** L'artefact ne contient ni secret ni réglage d'environnement.
7. **La provenance se prouve.** On sait qui, quoi, comment et avec quelles dépendances l'artefact a été construit.

#### Vocabulaire essentiel

- **Branche principale** (*mainline*, *trunk*) : branche commune où tout le monde intègre.
- **Construction** (*build*) : transformation du code source en artefact exécutable.
- **Construction automatique et autotestée** (*self-testing build*) : construction qui exécute les tests et échoue en cas d'échec.
- **Registre d'artefacts** (*artifact registry*) : dépôt des artefacts construits.
- **Empreinte** (*digest*) : valeur calculée à partir du contenu, qui identifie l'artefact (voir [18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu)).
- **Étiquette mutable** (*mutable tag*) : nom qui peut désigner successivement des contenus différents, comme `latest`.
- **Provenance** (*provenance*) : preuve inviolable de la manière dont un artefact a été produit.
- **Fichier de verrouillage** (*lock file*) : liste exacte des versions de dépendances utilisées.

#### Relations de cause à effet

- Les branches vivent des semaines : la fusion devient un chantier, les régressions apparaissent tard.
- Les tests ne sont pas exécutés à chaque fusion : une erreur d'intégration se découvre en préproduction, voire en production.
- L'application est reconstruite par environnement : une dépendance ou un outil change entre deux constructions, et la production n'est pas ce qui a été testé.
- Le déploiement référence une étiquette mutable : deux déploiements successifs de « la même version » installent deux contenus différents.
- Des secrets ou des réglages sont intégrés à l'artefact : il ne peut plus être promu tel quel, et les secrets fuient avec lui.

#### Idées reçues

- **« L'intégration continue, c'est un outil de construction. »** Non. L'outil aide ; la pratique est de fusionner souvent, avec des tests qui échouent bruyamment.
- **« Reconstruire pour chaque environnement est plus sûr. »** Non. C'est l'inverse : chaque reconstruction est une occasion de différer.
- **« Une branche par fonction vivant plusieurs semaines est une bonne isolation. »** Elle repousse l'intégration, et donc le coût et le risque, sans les réduire.

#### Principe clé

On intègre en petits changements dans une branche commune, chaque intégration est vérifiée par une construction autotestée, et l'on construit un artefact immuable une seule fois, que l'on promeut tel quel.

#### Si vous ne retenez que trois choses

1. L'intégration continue vérifie chaque fusion par une construction qui compile et teste.
2. L'artefact est construit une fois, identifié par son contenu, et déployé tel quel dans tous les environnements.
3. La configuration et les secrets restent hors de l'artefact.

### 3. Explication technique détaillée

#### Les pratiques de l'intégration continue

L'article de référence de Martin Fowler sur l'intégration continue en liste les pratiques principales :

| Pratique | Ce qu'elle exige |
|---|---|
| Dépôt unique | Code, tests, schémas et scripts de construction sont sous gestion de versions, avec une branche principale claire |
| Construction automatisée | Une commande transforme un dépôt propre en système en fonctionnement |
| Construction autotestée | Une suite de tests exhaustive s'exécute à chaque construction, qui échoue si un test échoue |
| Intégration quotidienne | Chacun fusionne dans la branche principale au moins une fois par jour, et mieux toutes les quelques heures |
| Réparation immédiate | Une construction cassée est la priorité, souvent en annulant le changement fautif |
| Construction rapide | Environ dix minutes pour la construction de validation ; les tests plus lents passent plus loin dans le pipeline |

Une plateforme ajoute des exigences : elle contient du code de **moteur** et des **métadonnées** (schémas de ressources, workflows livrés, modèles). La construction valide aussi ces métadonnées livrées avec le code (validité des schémas, des règles, des modèles : voir [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) et [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

```yaml
pipeline: platform-api
trigger: push_to_mainline
stages:
  - name: validation
    max_duration_minutes: 10
    steps:
      - checkout: { ref: "${commit_sha}" }
      - install_dependencies: { lockfile: required }
      - static_analysis: {}
      - unit_tests: {}
      - validate_shipped_metadata: {}
  - name: package
    steps:
      - build_image: { tag: "${commit_sha}", output: digest }
      - sign_and_record_provenance: {}
      - push_to_registry: { immutable_tags: true }
```

*Ce format est propre à la plateforme fictive ; chaque outil d'intégration a sa syntaxe.*

#### Un artefact immuable

Le facteur « construire, publier, exécuter » de la méthode des douze facteurs sépare trois étapes : la construction transforme le code d'un commit précis en paquet exécutable ; la publication combine ce paquet avec la configuration du déploiement ; l'exécution lance les processus à partir d'une publication choisie. Chaque publication a un identifiant unique, elle est en ajout seul et ne peut pas être modifiée : tout changement crée une nouvelle publication, et l'on peut revenir à une publication précédente.

| Règle | Raison |
|---|---|
| Identifier par l'empreinte du contenu | Le nom ne ment pas : deux contenus différents ont deux empreintes |
| Interdire les étiquettes mutables en déploiement | Un déploiement est reproductible |
| Verrouiller les dépendances | La même construction produit le même résultat |
| Séparer configuration et artefact | Le même artefact sert tous les environnements |
| Conserver les artefacts anciens | Le retour arrière est possible ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) |

```typescript
const DIGEST_REF = /^[a-z0-9._\/-]+@sha256:[a-f0-9]{64}$/;

function assertImmutableReference(image: string): void {
  if (!DIGEST_REF.test(image)) {
    throw new Error(`Image non épinglée par empreinte : ${image}`);
  }
}
```

Cette vérification, placée dans le contrôle d'admission du déploiement, refuse tout artefact désigné par une étiquette mutable.

#### La provenance et la chaîne d'approvisionnement

Le cadre SLSA (*Supply-chain Levels for Software Artifacts*) est un ensemble de lignes directrices adoptables progressivement pour sécuriser la chaîne d'approvisionnement logicielle : les producteurs s'en servent pour sécuriser leurs chaînes, les consommateurs pour décider de faire confiance à un paquet. La version 1.0 propose une piste « construction » à plusieurs niveaux, dont les exigences croissent ; la page consultée précise que cette version est remplacée par la version 1.2. L'idée centrale est la **provenance** : une preuve inviolable, produite par la plateforme de construction, de la manière dont l'artefact a été fabriqué.

Une plateforme qui distribue des paquets de solution ([23.6 Distribution et signature des paquets](23-solutions-verticales-packagees.md#236-distribution-et-signature-des-paquets)) ou des extensions ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) a deux raisons de s'y intéresser : prouver ce qu'elle livre, et vérifier ce qu'elle reçoit.

#### Mesurer la santé de l'intégration

| Signe | Interprétation |
|---|---|
| Durée de la construction de validation | Au-delà de 10 à 15 minutes, on contourne la pratique |
| Taux d'échec de la branche principale | Élevé : changements trop gros, tests instables |
| Temps de réparation d'une construction cassée | Long : la pratique n'est pas respectée |
| Tests instables (*flaky*) | Perte de confiance : on ignore les échecs |

Les tests instables méritent une règle : on les met en quarantaine, avec une limite de nombre et de durée, et on les corrige rapidement (voir [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)).

#### Modes de défaillance

- **Branches longues** : intégration tardive et douloureuse.
- **Tests ignorés** : « rouge » toléré.
- **Reconstruction par environnement.**
- **Étiquette `latest` en production.**
- **Dépendances non verrouillées.**
- **Secrets dans l'artefact.**
- **Construction de plus de 30 minutes** : on regroupe les changements, on perd le bénéfice.

**Contre-exemple.** Une équipe reconstruit l'application pour la production le jour du déploiement. Entre la préproduction et ce jour, une dépendance a publié une version mineure. L'application déployée n'est pas celle qui a été testée. Un comportement change pour tous les tenants, et personne ne comprend pourquoi la préproduction n'avait rien montré.

**Limites.** L'intégration continue ne prouve que ce que les tests couvrent. Un artefact immuable ne dit rien de sa qualité. Et la pratique demande de la discipline d'équipe : des changements petits, des tests rapides, une réparation immédiate des constructions cassées.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | L'artefact construit entre dans le pipeline de livraison et passe les portes |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Le même artefact est déployé dans des environnements à configuration différente |
| [21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops) | L'infrastructure et le déploiement référencent les artefacts par empreinte |
| [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Conserver les artefacts permet le retour arrière |
| [21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline) | Analyse des dépendances et provenance dans le pipeline |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les feature flags permettent d'intégrer du code non encore actif |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | Le cycle de développement sécurisé s'appuie sur cette chaîne |
| [18.1 Stockage d'objets, métadonnées et empreinte de contenu](18-fichiers-documents-contenus.md#181-stockage-dobjets-métadonnées-et-empreinte-de-contenu) | L'empreinte de contenu est la même notion que pour les fichiers |

### 5. Application pratique

**Situation initiale.** Alpha Air déploie sa plateforme à la main : une personne construit sur son poste, copie les fichiers sur les serveurs, et les branches de fonctions vivent trois semaines. Le dernier déploiement a cassé les exports pour tous les tenants.

**Problème.** Intégration tardive, construction non reproductible, déploiement manuel.

**Application du concept.** L'équipe met en place une intégration continue et un artefact immuable.

**Déroulé.**

1. Les équipes intègrent dans la branche principale au moins une fois par jour, derrière des feature flags pour le code inachevé.
2. Chaque fusion déclenche une construction qui compile, analyse, exécute les tests unitaires et valide les métadonnées livrées, en 8 minutes.
3. La construction produit une image identifiée par son empreinte, signée, avec sa provenance, publiée une fois.
4. Le déploiement référence l'image par empreinte ; une règle d'admission refuse les étiquettes mutables.
5. La même image est déployée en préproduction puis en production ; la configuration est injectée au déploiement.

**Résultat.** Ce qui est déployé est ce qui a été testé, et une régression est détectée dans la demi-heure qui suit la fusion.

**Limites.** Les tests unitaires ne couvrent pas les interactions : la livraison continue ajoute des étapes plus lentes (voir [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles sont les pratiques essentielles d'une intégration continue ?
2. **Compréhension.** Qu'est-ce qu'un artefact de build immuable, et comment l'identifie-t-on ?
3. **Compréhension.** Que doit-on laisser hors de l'artefact ?
4. **Pourquoi.** Pourquoi faut-il construire une seule fois plutôt que par environnement ?
5. **Raisonnement pratique.** Un déploiement référence `registry/platform-api:latest`. Quel risque et quelle correction ?

#### Réponses

1. Dépôt unique, construction automatisée et autotestée, intégration au moins quotidienne, réparation immédiate d'une construction cassée, et construction de validation rapide.
2. C'est le paquet déployable produit une seule fois par la construction et jamais modifié ensuite. On l'identifie par une empreinte de son contenu ou par une version unique, jamais par une étiquette mutable.
3. La configuration propre à chaque environnement et les secrets : ils sont fournis au déploiement, pour que le même artefact serve partout.
4. Parce que chaque reconstruction peut différer (dépendances, outils, options). Ce que l'on a testé n'est alors pas ce que l'on déploie.
5. Le risque : `latest` désigne des contenus différents au fil du temps, donc deux déploiements ne sont pas comparables ni reproductibles, et un retour arrière est incertain. Correction : référencer l'image par empreinte et refuser les étiquettes mutables à l'admission.

## 21.2 Livraison continue et portes de qualité

### 1. Comprendre simplement

La **livraison continue** (*continuous delivery*) est la discipline qui consiste à construire le logiciel de façon à pouvoir le mettre en production à tout moment, grâce à un **pipeline de déploiement** automatisé qui fait passer chaque changement par des étapes de plus en plus proches de la production. Une **porte de qualité** (*quality gate*) est une condition automatique que le changement doit satisfaire pour passer à l'étape suivante : tests réussis, couverture, absence de vulnérabilité critique, budget de performance.

**Pourquoi cela existe.** Si la mise en production est un événement rare, lourd, manuel, elle accumule des changements, du stress et des erreurs. En rendant chaque changement déployable à tout moment, par un chemin automatisé et vérifié, on rend la livraison banale et le risque petit. Les portes expriment ce qu'est « assez bon » en conditions vérifiables, pas en avis.

**Problème résolu.** Livrer souvent, par petits changements, avec une confiance fondée sur des vérifications reproductibles.

**Modèle mental.** Un couloir avec des portillons automatiques : chaque colis (changement) passe un portillon (porte) après un contrôle précis, du plus rapide au plus coûteux. Un colis qui échoue ressort, sans que quiconque l'autorise à passer par une porte latérale.

**Où l'analogie s'arrête.** Un portillon contrôle un critère simple. Un changement a des effets difficiles à mesurer : des portes trop strictes bloquent tout, trop lâches laissent passer. Les seuils se règlent à l'usage.

**Exemple.** Un changement du moteur de ressources d'Alpha Air passe : la validation (10 minutes), les tests de contrat (5 minutes), les tests de bout en bout sur des tenants synthétiques (25 minutes), l'analyse de sécurité, puis le déploiement en préproduction. Chaque étape est une porte. La mise en production est une décision, parfois automatique, qui ne dépend plus de la qualité du changement mais du moment choisi.

**Les composants.**

1. le **pipeline de déploiement** : étapes ordonnées ;
2. les **portes de qualité** : conditions, seuils, résultats ;
3. les **approbations** humaines éventuelles ;
4. le **chemin unique vers la production** ;
5. les **exceptions** et leurs règles ;
6. la **traçabilité** : quel changement, quelles portes, qui a approuvé ;
7. la **distinction** entre livraison continue et déploiement continu.

**Objectif d'apprentissage :** vous pouvez décrire un pipeline de livraison, concevoir des portes de qualité mesurables, et expliquer la différence entre livraison continue et déploiement continu.

### 2. Connaissances essentielles

#### Définition

- **Livraison continue** : discipline de construction du logiciel telle qu'il peut être mis en production à tout moment, par un pipeline automatisé.
- **Porte de qualité** : condition automatique, avec un seuil mesurable, que le changement doit satisfaire pour passer à l'étape suivante du pipeline.

#### Idées fondamentales

1. **Chaque changement est candidat à la production.** Il n'y a pas de « grande livraison » à préparer.
2. **Le pipeline est le chemin.** Aucun changement n'atteint la production par un autre.
3. **Les portes sont explicites et mesurables.** Un seuil, un résultat, un journal.
4. **Rapide d'abord.** Les vérifications les moins coûteuses précèdent les plus lourdes.
5. **Une porte qui échoue arrête le changement.** Pas de contournement silencieux.
6. **Les exceptions sont datées.** Un contournement est une décision, avec approbateur et durée (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).
7. **Livrer n'est pas déployer pour tous.** La séparation entre déploiement et mise à disposition (feature flags) découple les deux.

#### Vocabulaire essentiel

- **Pipeline de déploiement** (*deployment pipeline*) : suite automatisée d'étapes qui valide un changement jusqu'à la production.
- **Déploiement continu** (*continuous deployment*) : mise en production automatique de chaque changement qui passe les portes.
- **Étape de validation** (*commit stage*) : première étape, rapide, qui valide la construction et les tests unitaires.
- **Test d'acceptation** (*acceptance test*) : test qui vérifie qu'une fonction répond au besoin.
- **Budget de performance** (*performance budget*) : seuil de temps de réponse ou de ressources à ne pas dépasser.
- **Approbation manuelle** (*manual approval*) : validation humaine dans le pipeline.
- **Contournement d'urgence** (*break-glass*) : procédure exceptionnelle de livraison hors du chemin habituel, tracée.

#### Relations de cause à effet

- La livraison est un événement mensuel : des dizaines de changements s'accumulent, et la cause d'une régression est introuvable.
- Les portes n'existent que sur le papier : un changement passe parce qu'on lui fait confiance.
- Une porte est lente et placée tôt : les développeurs contournent le pipeline.
- Un correctif urgent passe par un chemin spécial : il n'est pas testé, et c'est lui qui casse la production.
- Les seuils sont fixés sans mesure : ils bloquent des changements légitimes ou laissent passer des dégradations.

#### Idées reçues

- **« Livraison continue veut dire déployer en production toutes les cinq minutes. »** Non. Elle veut dire que l'on **peut** le faire à tout moment. Le déploiement continu va plus loin : il le fait automatiquement pour chaque changement qui passe les portes.
- **« Les portes de qualité remplacent la revue humaine. »** Non. Elles automatisent ce qui se mesure ; la revue de code et l'approbation de changement jugent le reste (voir [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).
- **« Plus de portes, c'est plus de sécurité. »** Non. Des portes redondantes ou instables ralentissent et incitent au contournement.

#### Principe clé

Chaque changement suit un pipeline unique et automatisé, dont les portes de qualité mesurables, ordonnées du plus rapide au plus lent, rendent la mise en production à tout moment sûre et banale.

#### Si vous ne retenez que trois choses

1. La livraison continue rend chaque changement déployable à tout moment, par un pipeline unique.
2. Une porte de qualité est une condition mesurable avec un seuil, qui bloque le changement si elle échoue.
3. Les contournements sont exceptionnels, tracés et datés.

### 3. Explication technique détaillée

#### Livraison continue et déploiement continu

La page de Martin Fowler sur la livraison continue la décrit comme la discipline de construire le logiciel de façon à ce qu'il puisse être mis en production à tout moment, avec un critère simple : un sponsor métier pourrait demander que la version courante parte en production immédiatement, et l'équipe y serait prête sans panique. Le mécanisme est un **pipeline de déploiement** : le code est intégré en continu, construit, testé automatiquement, et progresse dans des environnements de plus en plus proches de la production. La page distingue le **déploiement continu**, qui met automatiquement en production chaque changement, de la livraison continue, qui le rend possible sans l'imposer ; le premier suppose la seconde.

| Pratique | Chaque changement est… | Mise en production |
|---|---|---|
| Intégration continue | Intégré et testé | Hors sujet |
| Livraison continue | Déployable à tout moment | Décision (humaine ou planifiée) |
| Déploiement continu | Déployé automatiquement | Automatique, à chaque changement qui passe |

Dans une plateforme à des centaines de tenants, la livraison continue s'accompagne souvent d'un **déploiement progressif** ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) et de **feature flags** ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) : la mise en production du code est découplée de l'activation de la fonction.

#### Un pipeline type

```text
validation (10 min) ─► contrats (5 min) ─► acceptation et bout en bout (25 min) ─► sécurité ─► préproduction ─► approbation ? ─► production progressive
       │                     │                        │                                 │
       └─ construction,      └─ consommateurs et      └─ tenants synthétiques           └─ dépendances, secrets,
          tests unitaires       fournisseurs                                               analyse statique
```

| Étape | Objet | Durée visée (exemple) | Si échec |
|---|---|---|---|
| Validation | Construction, analyse statique, tests unitaires, métadonnées livrées | ≤ 10 minutes | Le changement est refusé |
| Contrats | Compatibilité avec les consommateurs et les fournisseurs ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)) | ≤ 5 minutes | Refusé |
| Acceptation | Parcours métier sur des tenants synthétiques ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) | ≤ 30 minutes | Refusé |
| Sécurité | Dépendances, secrets, analyse ([21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline)) | ≤ 15 minutes | Refusé selon la gravité |
| Préproduction | Déploiement identique à la production, vérifications de fumée | ≤ 15 minutes | Refusé |
| Approbation | Facultative, selon le risque ([9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) | Variable | En attente |
| Production | Déploiement progressif ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) | Variable | Arrêt et retour ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) |

*Les durées sont des valeurs d'exemple.*

#### Concevoir des portes

Une bonne porte est :

- **mesurable** : un nombre, un seuil, un résultat binaire ;
- **déterministe** : le même changement donne le même résultat ;
- **rapide** pour son rang : la plus coûteuse s'exécute en dernier ;
- **actionnable** : l'échec dit quoi corriger ;
- **possédée** : une équipe répond du seuil et de ses évolutions ;
- **tracée** : le résultat est conservé avec le changement.

```json
{
  "gates": [
    { "id": "unit_tests", "stage": "validation", "rule": "all_pass", "blocking": true },
    { "id": "static_analysis", "stage": "validation", "rule": "no_new_blocking_findings", "blocking": true },
    { "id": "contract_tests", "stage": "contracts", "rule": "all_pass", "blocking": true },
    { "id": "e2e_smoke", "stage": "acceptance", "rule": "all_pass", "max_retries": 1, "blocking": true },
    { "id": "perf_budget", "stage": "acceptance", "rule": "p95_latency_ms <= 300", "blocking": true },
    { "id": "dependency_scan", "stage": "security", "rule": "no_critical_vulnerability", "blocking": true },
    { "id": "migration_check", "stage": "acceptance", "rule": "backward_compatible", "blocking": true }
  ],
  "exceptions": {
    "allowed": true,
    "requires": ["reason", "approver", "expires_at"],
    "audit": true
  }
}
```

Les portes s'écrivent comme une **politique en tant que code** ([13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code)) : elles se versionnent, se revoient et se testent. Elles s'appliquent à **tous** les changements, y compris les correctifs urgents : un chemin d'exception sans tests est le chemin par lequel viennent les incidents.

#### Qui approuve, et quoi

| Changement | Approbation | Raison |
|---|---|---|
| Correctif mineur, tests au vert | Automatique | Petit risque, vérifié |
| Changement du moteur de ressources | Revue par un pair, portes | Risque pour tous les tenants |
| Migration de schéma | Revue d'un expert, procédure spécifique ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) | Difficile à annuler |
| Changement de sécurité ou de droits | Revue de sécurité | Effet sur l'isolation |

La **séparation des tâches** impose que la personne qui écrit un changement ne soit pas la seule à l'approuver (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)). Le pipeline conserve la preuve : qui a fusionné, quelles portes ont passé, qui a approuvé.

#### Livraison de code et de configuration

| Aspect | Code et infrastructure (ce module) | Configuration de tenant ([8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement), [12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)) |
|---|---|---|
| Unité | Artefact construit | Brouillon de configuration |
| Pipeline | Intégration, tests, déploiement | Validation, simulation, publication |
| Retour arrière | Redéploiement, correction en avant | Version précédente |
| Qui | Équipes d'ingénierie | Administrateurs de tenant |

Les deux pipelines se rencontrent : un changement du moteur peut modifier le comportement de configurations existantes. D'où les **tests de configuration** ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) : ils exécutent des configurations réelles ou représentatives contre la nouvelle version.

#### Modes de défaillance

- **Livraison événementielle** : changements accumulés.
- **Portes décoratives** : jamais bloquantes.
- **Pipeline contourné** pour les urgences.
- **Tests lents au début** : on les évite.
- **Tests instables** : on relance jusqu'au vert.
- **Seuils arbitraires** : bloquent ou laissent passer sans raison.
- **Approbation de pure forme.**

**Contre-exemple.** Un correctif de nuit est déployé hors pipeline, « puisque c'est urgent ». Il contient une régression sur la gestion des droits : un rôle voit des données d'un autre. Les tests d'isolation qui auraient pris 20 minutes n'ont pas été exécutés. L'incident dure quatre heures.

**Limites.** Les portes détectent ce qu'elles mesurent. Un pipeline lent décourage, un pipeline instable fait perdre la confiance. La livraison continue ne dit pas ce qu'il faut livrer : elle rend la livraison sûre. Et elle demande des tests et une observabilité solides pour que « au vert » signifie quelque chose.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable) | L'artefact immuable est ce que le pipeline fait avancer |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Les étapes s'exécutent dans des environnements de plus en plus proches de la production |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | La mise en production se fait de façon progressive |
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Les portes s'appuient sur la pyramide de tests |
| [21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline) | Les portes de sécurité font partie du pipeline |
| [21.10 Gestion des versions et mesures de livraison](#2110-gestion-des-versions-et-mesures-de-livraison) | Les mesures de livraison évaluent la performance du pipeline |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La revue et l'approbation de changement s'y intègrent |
| [13.7 Policy as Code](13-concepts-transversaux.md#137-policy-as-code) | Les portes s'expriment en politique en tant que code |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les feature flags découplent déploiement et activation |

### 5. Application pratique

**Situation initiale.** Alpha Air livre la plateforme un jeudi par mois. Chaque livraison regroupe 40 changements et mobilise six personnes pendant une soirée. Deux livraisons sur cinq nécessitent un retour arrière.

**Problème.** Une livraison rare, lourde et risquée, sans portes explicites.

**Application du concept.** L'équipe met en place un pipeline de livraison continue avec des portes mesurables.

**Déroulé.**

1. Chaque changement fusionné produit un artefact et déclenche le pipeline.
2. Les portes sont définies : tests unitaires, contrats, parcours de bout en bout sur trois tenants synthétiques, budget de performance, analyse de dépendances.
3. Un changement qui échoue à une porte est renvoyé, avec le détail de l'échec.
4. La mise en production se fait chaque jour ouvré, par un déploiement progressif, sans soirée dédiée.
5. Les exceptions (correctif urgent) passent par le même pipeline, avec des portes réduites aux plus rapides, documentées et approuvées.

**Résultat.** Les changements sont livrés un par un, plusieurs fois par semaine, et la cause d'une régression est identifiable.

**Limites.** Le pipeline ne remplace pas la planification des changements de schéma, qui demandent une procédure particulière.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre livraison continue et déploiement continu ?
2. **Compréhension.** Qu'est-ce qu'une porte de qualité, et quelles propriétés doit-elle avoir ?
3. **Compréhension.** Pourquoi ordonne-t-on les portes du plus rapide au plus lent ?
4. **Pourquoi.** Pourquoi les correctifs urgents doivent-ils passer par le même pipeline ?
5. **Raisonnement pratique.** Une porte « tests de bout en bout » échoue une fois sur dix sans changement de code. Que faire ?

#### Réponses

1. La livraison continue rend chaque changement déployable à tout moment ; la mise en production reste une décision. Le déploiement continu met automatiquement en production chaque changement qui passe les portes.
2. Une condition automatique, avec un seuil, que le changement doit satisfaire pour avancer. Elle doit être mesurable, déterministe, rapide pour son rang, actionnable, possédée et tracée.
3. Pour donner un retour rapide et ne mobiliser les ressources lourdes que pour les changements qui ont passé les contrôles bon marché.
4. Parce qu'un chemin d'exception sans vérifications est celui par lequel arrivent les incidents : l'urgence augmente le risque, elle ne le justifie pas.
5. Traiter l'instabilité : identifier la cause (isolation, temps, ressource partagée), mettre le test en quarantaine avec une date limite plutôt que de relancer jusqu'au vert, et le corriger. Un test instable détruit la confiance dans la porte.

## 21.3 Parité et éphémérité des environnements

### 1. Comprendre simplement

La **parité des environnements** (*environment parity*) est le principe de garder le développement, la préproduction et la production aussi semblables que possible : mêmes types et versions de services, mêmes procédures de déploiement. Un **environnement éphémère** (*ephemeral environment*) est un environnement complet créé à la demande, par exemple pour chaque proposition de changement, et détruit quand il n'a plus d'utilité.

**Pourquoi cela existe.** Un changement testé dans un environnement différent de la production prouve peu de choses : la base de données n'est pas la même, le volume est autre, une option de configuration diffère. Et si les environnements de test sont rares et partagés, les équipes se bloquent mutuellement, ou testent sur un état qui n'est pas le leur.

**Problème résolu.** Faire en sorte que « ça marche en test » veuille dire « ça marchera en production », et donner à chaque changement un espace de test isolé.

**Modèle mental.** Un banc d'essai que l'on monte pour chaque nouveau prototype, identique à la ligne de production, et que l'on démonte après l'essai.

**Où l'analogie s'arrête.** Un banc d'essai peut reproduire la ligne à l'échelle réelle. Une plateforme de production compte des centaines de tenants et des téraoctets : on ne peut pas la copier. On reproduit sa **forme** (versions, topologie), pas son **volume**, et l'on construit des données synthétiques représentatives.

**Exemple.** Une développeuse d'Alpha Air ouvre une proposition de changement. Le pipeline crée un environnement qui déploie l'artefact de la proposition, avec les mêmes versions de base de données, de recherche et de file de messages que la production, trois tenants synthétiques et des données générées. Les tests s'y exécutent, la relecture peut y explorer la fonction, puis l'environnement est détruit à la fusion.

**Les composants.**

1. la **définition d'un environnement** comme code ;
2. les **services de support** de mêmes types et versions que la production ;
3. les **tenants et données synthétiques** ;
4. la **durée de vie** et la destruction automatique ;
5. les **secrets** à portée limitée ;
6. l'**isolation réseau** ;
7. le **suivi des coûts** ;
8. le **contrôle de dérive** entre environnements.

**Objectif d'apprentissage :** vous pouvez décrire les écarts à éviter entre environnements, expliquer l'intérêt et les limites d'un environnement éphémère, et estimer son coût.

### 2. Connaissances essentielles

#### Définition

- **Parité des environnements** : propriété selon laquelle les environnements de développement, de test et de production diffèrent le moins possible par leurs composants, leurs versions et leurs procédures.
- **Environnement éphémère** : environnement complet, créé automatiquement pour un usage précis et détruit à la fin de cet usage.

#### Idées fondamentales

1. **Trois écarts à réduire.** Le temps, les personnes et les outils.
2. **Même artefact, configuration différente.** Rien d'autre ne change (voir [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable)).
3. **Mêmes services, mêmes versions.** Pas de substitut local d'un autre type.
4. **On reproduit la forme, pas le volume.** Les données de production ne se copient pas telles quelles.
5. **Un environnement est du code.** Il se crée par une définition versionnée ([21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops)).
6. **Éphémère veut dire à durée de vie bornée.** Il a un propriétaire, une échéance, une destruction.
7. **La dérive se détecte.** Un environnement qui diverge de la définition perd sa valeur.

#### Vocabulaire essentiel

- **Environnement de préproduction** (*staging*) : environnement le plus proche de la production, où l'on valide avant la mise en service.
- **Environnement d'aperçu** (*preview environment*) : environnement éphémère par proposition de changement.
- **Service de support** (*backing service*) : base de données, file, cache ou autre service dont dépend l'application.
- **Tenant synthétique** (*synthetic tenant*) : tenant de test dont les données sont générées.
- **Écart de temps, de personnes, d'outils** (*time gap*, *personnel gap*, *tools gap*) : les trois écarts décrits par la méthode des douze facteurs.
- **Durée de vie** (*time to live*, TTL) : délai après lequel l'environnement est détruit.
- **Dérive d'environnement** (*environment drift*) : écart non maîtrisé par rapport à la définition.

#### Relations de cause à effet

- Le test utilise une base différente de la production : un comportement propre au moteur de production n'apparaît qu'en production.
- Le volume de test est minuscule : les requêtes lentes ne se voient pas.
- La préproduction est partagée par toutes les équipes : les changements se bloquent, les tests s'influencent.
- Les environnements éphémères ne sont pas détruits : le coût dérive, et des données de test traînent.
- Les données de production sont copiées en test : une fuite de données personnelles dans un environnement peu protégé (voir [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

#### Idées reçues

- **« Un environnement de test, c'est une version réduite de la production. »** Seulement pour ses composants : mêmes types et versions de services, pas le volume.
- **« Un substitut léger local suffit pour développer. »** La méthode des douze facteurs le déconseille : par exemple, utiliser une base différente en local expose à des divergences de comportement.
- **« Un environnement éphémère coûte cher. »** Souvent moins qu'une préproduction partagée permanente qui bloque les équipes, mais le coût se calcule.

#### Principe clé

Les environnements ont la même forme que la production, ne diffèrent que par leur configuration, se décrivent par du code, et les environnements d'essai se créent à la demande et se détruisent.

#### Si vous ne retenez que trois choses

1. Mêmes services, mêmes versions, même artefact : seule la configuration change.
2. Un environnement éphémère s'obtient par code et se détruit à échéance.
3. On reproduit la forme de la production avec des données synthétiques, pas son volume avec des données réelles.

### 3. Explication technique détaillée

#### Les trois écarts

La méthode des douze facteurs, au facteur « parité développement-production », décrit trois écarts :

| Écart | Description | Objectif |
|---|---|---|
| Temps | Le code met des semaines ou des mois à atteindre la production | Le ramener à des heures ou des minutes |
| Personnes | Les développeurs écrivent, d'autres déploient | Que ceux qui écrivent le code le déploient et observent son exécution |
| Outils | Le développement utilise d'autres logiciels que la production (serveur, base, système) | Les faire correspondre |

La même page recommande de garder développement, préproduction et production aussi semblables que possible pour permettre le déploiement continu, d'utiliser le même type et la même version de chaque service de support, et d'éviter les substituts légers (par exemple une base embarquée à la place de la base de production), rendus inutiles par les conteneurs.

#### Les types d'environnements

| Environnement | Rôle | Durée de vie | Données |
|---|---|---|---|
| Poste local | Développement | Permanente | Synthétiques |
| Aperçu (éphémère) | Valider et relire une proposition de changement | Heures à jours | Synthétiques générées |
| Intégration | Tester les interactions entre services | Permanente | Synthétiques à volume moyen |
| Préproduction | Dernière validation, mêmes versions et topologie que la production | Permanente | Synthétiques à volume réaliste |
| Production | Service aux clients | Permanente | Réelles |

Les **tenants de test** de la plateforme ([8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement), [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)) sont une autre idée : un tenant d'essai pour les clients. Ici, il s'agit des environnements de l'éditeur lui-même.

#### Définir un environnement éphémère

```json
{
  "environment": "preview-pr-4821",
  "lifetime": { "ttl_hours": 48, "destroy_on_merge": true },
  "artifact": "platform-api@sha256:1ca605592c1ede3ad12dfa4725b833df948e7055cff31e65d6d650301e2f75ba",
  "services": {
    "database": "same_major_version_as_production",
    "search": "same_major_version_as_production",
    "queue": "same_major_version_as_production"
  },
  "tenants": ["synthetic_small", "synthetic_large", "synthetic_regulated"],
  "data": { "source": "synthetic_generator", "seed": 4821 },
  "secrets": "scoped_short_lived",
  "network": "isolated",
  "owner": "usr_dev_017"
}
```

L'**empreinte** est celle de l'artefact de la proposition. Les **tenants synthétiques** représentent des profils : petit, gros, réglementé. Les **secrets** sont limités à cet environnement et de courte durée. L'**isolation réseau** empêche qu'un environnement de test atteigne des systèmes de production.

#### Coût

Le coût d'un environnement éphémère dépend de son nombre, de sa taille et de sa durée.

$$C = N \times c \times h$$

où $N$ est le nombre d'environnements par jour, $c$ le coût horaire d'un environnement et $h$ sa durée de vie moyenne en heures. Avec 20 propositions par jour, un coût de 3 unités par heure et une durée de 4 heures : $C = 20 \times 3 \times 4 = 240$ unités par jour. Une préproduction permanente de 8 unités par heure coûte $8 \times 24 = 192$ unités par jour. L'éphémère n'est donc pas gratuit ; il se justifie par l'isolation, le parallélisme et la qualité de la relecture. Les leviers : durée de vie courte, destruction à la fusion, environnements plus petits pour les changements simples, arrêt hors heures de travail.

#### Données et volumes

On ne copie pas la production dans les environnements d'essai : données personnelles, risque de fuite, obligations ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)). On génère des données **synthétiques** qui reproduisent la forme : distributions de tailles de tenants, cardinalités, valeurs extrêmes, cas limites ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

Pour les tests de **performance**, la préproduction doit approcher le volume de production : un test de charge sur 1 000 lignes ne dit rien sur 800 millions. On entretient un jeu de volumétrie réaliste, régénéré à la demande.

#### Détecter la dérive

| Écart | Détection |
|---|---|
| Versions de services | Comparaison périodique des versions déclarées et réelles |
| Configuration | Comparaison entre environnements, avec différences attendues listées (voir [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement)) |
| Topologie | Déclaration de l'infrastructure et réconciliation ([21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops)) |
| Données de référence | Listes et paramètres de plateforme identiques |

Une **liste explicite** des différences autorisées (adresses, secrets, tailles) rend le reste suspect.

#### Modes de défaillance

- **Services différents** : base ou file d'un autre type ou d'une autre version.
- **Préproduction partagée** : blocage et pollution.
- **Environnements orphelins** : coûts et données qui traînent.
- **Données réelles copiées** : fuite.
- **Volume irréaliste** : problèmes de performance invisibles.
- **Dérive manuelle** : « on a changé un réglage à la main ».
- **Éphémère sans propriétaire.**

**Contre-exemple.** Une équipe teste sur une base embarquée, légère, et déploie sur la base de production. Une contrainte, une collation et un comportement des transactions diffèrent. Les tests passent, la migration échoue en production. Utiliser, dès le développement, la même base et la même version aurait révélé le défaut.

**Limites.** La parité parfaite n'existe pas : le trafic, les données et les tenants réels ne se reproduisent pas. Un environnement éphémère complet demande une infrastructure décrite en code et des temps de création raisonnables. Et plus un environnement ressemble à la production, plus il coûte : on arbitre entre fidélité et coût (voir [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable) | Le même artefact est déployé partout |
| [21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops) | L'infrastructure en code crée et réconcilie les environnements |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les données synthétiques et les tenants de test |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | La configuration d'environnement, la promotion et la dérive |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Les tenants de test suivent le même cycle de vie que les autres |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | On ne copie pas de données personnelles en test sans protection |
| [22.11 Économie unitaire, pratique FinOps et arbitrage efficacité-résilience](22-performance-echelle-economie.md#2211-économie-unitaire-pratique-finops-et-arbitrage-efficacité-résilience) | Le coût des environnements entre dans l'économie unitaire |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | La planification de capacité s'appuie sur des tests à volume réaliste |

### 5. Application pratique

**Situation initiale.** Alpha Air a une préproduction unique, partagée par 12 développeurs. Les déploiements s'y écrasent, les tests s'influencent, et ses services sont d'une version de base de données plus ancienne que la production.

**Problème.** Un seul environnement partagé et divergent.

**Application du concept.** L'équipe met en place des environnements d'aperçu éphémères et réaligne la préproduction sur la production.

**Déroulé.**

1. La définition d'un environnement (versions, services, tenants synthétiques) est écrite comme code.
2. Chaque proposition de changement crée un environnement d'aperçu, détruit à la fusion ou après 48 heures.
3. La préproduction est reconstruite avec les mêmes versions de services que la production et une volumétrie de 10 % de celle-ci.
4. Un contrôle quotidien compare les versions et les configurations des environnements ; trois dérives sont corrigées.
5. Les données sont générées par un générateur dédié, jamais copiées de la production.

**Résultat.** Les relectures se font sur un environnement propre à chaque changement, et les écarts de version ont disparu.

**Limites.** Le test de charge exige une étape particulière, avec un volume proche de celui de la production, planifiée et coûteuse.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quels sont les trois écarts entre développement et production ?
2. **Compréhension.** Qu'est-ce qu'un environnement éphémère, et quand est-il détruit ?
3. **Compréhension.** Pourquoi ne copie-t-on pas les données de production dans les environnements de test ?
4. **Pourquoi.** Pourquoi utiliser le même type et la même version de service de support que la production ?
5. **Raisonnement pratique.** 15 environnements éphémères par jour durent 6 heures en moyenne, à 2,5 unités par heure. Quel est le coût quotidien ?

#### Réponses

1. L'écart de temps (le code met longtemps à atteindre la production), de personnes (ceux qui écrivent ne déploient pas) et d'outils (le développement n'utilise pas les mêmes logiciels).
2. Un environnement complet créé automatiquement pour un usage précis, par exemple une proposition de changement, et détruit à la fusion ou à l'échéance de sa durée de vie.
3. Parce qu'elles contiennent des données personnelles, qui n'ont rien à faire dans des environnements moins protégés. On génère des données synthétiques qui reproduisent la forme.
4. Parce que des différences de comportement (contraintes, transactions, requêtes) n'apparaissent qu'avec le moteur réel : un test sur un substitut ne prouve rien pour la production.
5. $C = 15 \times 2{,}5 \times 6 = 225$ unités par jour.

## 21.4 Infrastructure as code et GitOps

### 1. Comprendre simplement

L'**infrastructure en tant que code** (*infrastructure as code*, IaC) consiste à décrire l'infrastructure (serveurs, réseaux, bases, permissions) dans des fichiers lisibles par une machine, que l'on versionne, relit et exécute, au lieu de la configurer à la main. **GitOps** est une manière de faire fonctionner cela : l'état souhaité du système est décrit dans un dépôt versionné, et des agents l'appliquent en continu, en comparant l'état réel à l'état souhaité.

**Pourquoi cela existe.** Une infrastructure configurée à la main devient une collection de cas particuliers : personne ne sait pourquoi tel serveur diffère de tel autre, ni comment le recréer. Quand l'infrastructure est du texte, elle se relit, se teste, se rejoue, et un changement laisse une trace. Et quand un agent rapproche sans cesse la réalité de la description, les écarts manuels sont corrigés ou signalés.

**Problème résolu.** Reproduire et auditer l'infrastructure, et empêcher qu'elle dérive de ce que l'on croit qu'elle est.

**Modèle mental.** Un plan d'architecte et un conducteur de travaux. Le plan (le dépôt) dit ce qui doit exister ; le conducteur (l'agent) compare régulièrement le chantier au plan et corrige les écarts.

**Où l'analogie s'arrête.** Un plan de bâtiment est stable. Une infrastructure change plusieurs fois par jour, par plusieurs mains, avec des ressources que le fournisseur modifie aussi (mises à jour, redémarrages) : la comparaison doit distinguer les écarts réels du bruit.

**Exemple.** Alpha Air décrit, dans un dépôt, ses services, leurs répliques, leurs ressources et la version de l'artefact à déployer. Une personne propose de passer la version de l'artefact à `2026.41.3` par une demande de fusion ; elle est relue ; à la fusion, un agent du cluster constate l'écart avec l'état réel et le résorbe. Quelqu'un qui modifie la configuration à la main voit sa modification annulée à la prochaine réconciliation.

**Les composants.**

1. les **définitions** d'infrastructure, déclaratives et versionnées ;
2. le **dépôt** de l'état souhaité et son historique ;
3. le **processus de revue et d'approbation** par demande de fusion ;
4. l'**agent de réconciliation** ;
5. l'**état réel** et la **détection de dérive** ;
6. les **modules** réutilisables ;
7. la **gestion des secrets**, hors du dépôt ;
8. la **promotion** d'un environnement à l'autre.

**Objectif d'apprentissage :** vous pouvez décrire l'infrastructure en tant que code, énoncer les principes de GitOps, et expliquer la différence entre l'état de l'infrastructure et la configuration d'un tenant.

### 2. Connaissances essentielles

#### Définition

- **Infrastructure en tant que code** : définition de l'infrastructure par des fichiers sources exécutables, gérés comme tout logiciel : versionnés, relus, testés, rejoués.
- **GitOps** : mode d'exploitation où l'état souhaité du système est décrit de façon déclarative dans un dépôt versionné, et appliqué par des agents qui le réconcilient en continu avec l'état réel.

#### Idées fondamentales

1. **L'infrastructure est du texte.** Elle se relit, se compare, se rejoue.
2. **Déclaratif : on décrit l'état, pas les étapes.** L'outil calcule la différence.
3. **Versionné et immuable.** Chaque changement est un commit, avec son auteur, sa date et sa revue.
4. **Tiré automatiquement.** Les agents récupèrent l'état souhaité depuis la source (voir les principes d'OpenGitOps).
5. **Réconcilié en continu.** Les écarts sont corrigés ou signalés.
6. **Le dépôt est la source de vérité de l'infrastructure.** Pas la console ni la mémoire des personnes.
7. **Les secrets restent hors du dépôt.** On y met des références, pas des valeurs.

#### Vocabulaire essentiel

- **État souhaité** (*desired state*) : description de ce qui doit exister.
- **État réel** (*actual state*) : ce qui existe effectivement.
- **Réconciliation** (*reconciliation*) : action qui rapproche l'état réel de l'état souhaité.
- **Dérive** (*drift*) : écart entre les deux, non voulu.
- **Serveur flocon** (*snowflake server*) : serveur configuré à la main, de façon unique et non reproductible.
- **Demande de fusion** (*pull request*, *merge request*) : proposition de changement soumise à revue.
- **Module** (*module*) : bloc d'infrastructure réutilisable.
- **Idempotence** (*idempotence*) : propriété d'une opération dont le rejeu ne change pas le résultat (voir [3.11 Idempotence](03-crud-runtime-ressources.md#311-idempotence)).

#### Relations de cause à effet

- L'infrastructure est configurée par la console : personne ne peut la recréer, et la reprise après sinistre est une enquête.
- Le dépôt décrit un état, mais des modifications manuelles s'y ajoutent : l'état réel et l'état déclaré divergent.
- Les secrets sont stockés dans le dépôt : une fuite du dépôt est une fuite des secrets.
- Un changement d'infrastructure s'applique à toutes les régions d'un coup : une erreur se propage partout.
- L'agent de réconciliation tourne sans garde-fous : une suppression accidentelle dans le dépôt supprime des ressources réelles.

#### Idées reçues

- **« L'infrastructure en tant que code, c'est un script d'installation. »** Non. Un script exécute des étapes ; une définition déclarative décrit un état, et se rejoue sans effet de bord.
- **« GitOps oblige à utiliser un outil précis. »** Non. Ce sont quatre principes (déclaratif, versionné et immuable, tiré automatiquement, réconcilié en continu), pas un produit.
- **« Le dépôt contient aussi la configuration des tenants. »** Non. La configuration d'un tenant vit dans le plan de contrôle de la plateforme (voir [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime)), avec ses propres règles de versionnement.

#### Principe clé

L'infrastructure se décrit de façon déclarative dans un dépôt versionné et relu, et des agents la réconcilient en continu avec la réalité, de sorte que le dépôt dit toujours ce qui doit exister et que tout écart est vu.

#### Si vous ne retenez que trois choses

1. L'infrastructure est décrite par un état souhaité, déclaratif, dans un dépôt versionné.
2. Un agent compare et réconcilie en continu ; la dérive est corrigée ou signalée.
3. L'état de l'infrastructure n'est pas la configuration d'un tenant : les deux ont des circuits distincts.

### 3. Explication technique détaillée

#### L'infrastructure en tant que code

La page de Martin Fowler sur l'infrastructure en tant que code la définit comme la gestion de l'infrastructure par des fichiers de définition lisibles par une machine, traités comme n'importe quel système logiciel. Elle relève les bénéfices suivants : la gestion de versions garde la trace de chaque changement pour l'audit et permet des constructions reproductibles ; le code donne des résultats cohérents d'un serveur à l'autre, et l'on peut en créer de nouveaux à la demande ; des tests détectent vite les erreurs, et les chaînes de déploiement appliquent à l'infrastructure la discipline de livraison du logiciel ; de petites mises à jour sont plus faciles à vérifier et à annuler. Elle décrit aussi le problème inverse, celui des **serveurs flocons** configurés à la main avec des différences subtiles.

| Pratique | Effet |
|---|---|
| Déclaratif | On décrit le résultat, l'outil calcule les actions |
| Modules | Un même bloc sert à toutes les régions et tous les environnements |
| Plan avant application | Un aperçu des changements est relu avant application |
| Tests | Validation de la syntaxe, des règles de sécurité, de la conformité |
| Revue | Un second regard sur tout changement |

#### Les principes de GitOps

Le groupe OpenGitOps formule quatre principes :

| Principe | Signification |
|---|---|
| Déclaratif | L'état souhaité d'un système géré par GitOps est décrit sous forme déclarative |
| Versionné et immuable | L'état souhaité est stocké de façon à ce qu'il ne puisse pas être altéré, avec tout l'historique des versions |
| Tiré automatiquement | Des agents logiciels récupèrent d'eux-mêmes l'état souhaité depuis sa source |
| Réconcilié en continu | Les agents vérifient en permanence l'état réel et s'efforcent de le faire correspondre à l'état souhaité |

```yaml
service: platform-api
environment: production
region: eu-west
artifact: "platform-api@sha256:1ca605592c1ede3ad12dfa4725b833df948e7055cff31e65d6d650301e2f75ba"
replicas: { min: 6, max: 24 }
resources: { cpu: "2", memory: "4Gi" }
rollout:
  strategy: progressive
  waves: [1, 10, 50, 100]
dependencies:
  database: { major_version: 16, high_availability: true }
secrets:
  - ref: vault://platform/api/database-credentials
```

*Ce format est propre à la plateforme fictive. Les secrets y figurent par référence, jamais par valeur.*

```typescript
interface DesiredState {
  service: string;
  artifact: string;
  replicas: number;
}

interface ActualState {
  artifact: string;
  replicas: number;
}

async function reconcile(
  desired: DesiredState,
  actual: ActualState,
  apply: (d: DesiredState) => Promise<void>,
): Promise<"in_sync" | "corrected"> {
  if (desired.artifact === actual.artifact && desired.replicas === actual.replicas) {
    return "in_sync";
  }
  await apply(desired);
  return "corrected";
}
```

La boucle de réconciliation est **idempotente** : l'appeler plusieurs fois ne change rien une fois l'état atteint. Les agents réels comparent des états plus riches, gèrent les erreurs et mesurent le temps de convergence.

#### Pousser ou tirer

| Mode | Principe | Atouts | Limites |
|---|---|---|---|
| Poussé (*push*) | Le pipeline applique les changements sur l'environnement | Simple | Le pipeline détient des droits sur l'environnement ; pas de correction de dérive continue |
| Tiré (*pull*) | Un agent dans l'environnement récupère l'état souhaité | Les droits restent dans l'environnement ; réconciliation continue | Un agent à exploiter |

#### Plan de contrôle de la plateforme et état de l'infrastructure

Deux flux de versionnement coexistent :

| Aspect | Infrastructure et déploiement (ce module) | Configuration d'un tenant ([13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime), [8.1 La plateforme d'administration](08-admin-control-plane.md#81-la-plateforme-dadministration)) |
|---|---|---|
| Où vit l'état souhaité | Dans un dépôt versionné | Dans le plan de contrôle de la plateforme |
| Qui change | Ingénierie, par demande de fusion | Administrateurs de tenant, par l'interface et l'API |
| Cadre de contrôle | Pipeline et revue de code | Brouillon, simulation, publication ([12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)) |
| Granularité | Services, régions, ressources | Ressources, champs, workflows, règles |
| Historique | Historique du dépôt | Versionnement de la configuration ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) |

L'infrastructure qui héberge des **cellules** de tenants (voir [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact)) ou des régions est décrite en code : créer une nouvelle cellule se fait par une définition, pas par une intervention manuelle.

#### Environnements et promotion

La promotion d'un environnement à l'autre est un **changement de l'état souhaité** : l'artefact validé en préproduction est référencé dans la définition de la production, par une demande de fusion qui passe les portes ([21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité)). Le retour arrière est le retour au commit précédent.

#### Garde-fous

| Risque | Garde-fou |
|---|---|
| Suppression accidentelle de ressources | Plan relu ; protection des ressources critiques ; délai avant suppression |
| Erreur propagée partout | Application par vagues : un environnement, une région, puis le reste (voir [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) |
| Secrets exposés | Références vers un gestionnaire de secrets ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)) ; analyse des dépôts |
| Dérive silencieuse | Détection et alerte ; correction automatique pour ce qui est sûr |
| Droits excessifs de l'agent | Moindre privilège, agent par périmètre (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) |
| Dépôt unique de tous les services | Dépôts ou répertoires par domaine, propriétaires de code |

#### Modes de défaillance

- **Modifications manuelles** hors du dépôt.
- **Dépôt qui ment** : il décrit un état que personne n'atteint.
- **Secrets en clair.**
- **Application globale d'un changement risqué.**
- **Agent trop puissant.**
- **Définitions monolithiques** : un changement touche tout.
- **État perdu ou verrouillé** : l'outil ne sait plus ce qu'il gère.

**Contre-exemple.** Une personne augmente à la main, dans la console, la taille de la base pendant un incident. Le dépôt n'est pas mis à jour. Trois semaines plus tard, un changement sans rapport est appliqué et ramène la base à l'ancienne taille, en pleine charge. Le dépôt est la source de vérité : tout changement d'urgence s'y inscrit aussi, ou l'agent le corrige.

**Limites.** Le déclaratif ne gère pas tout : certaines opérations sont séquentielles ou impératives. Les agents de réconciliation ajoutent un composant critique à exploiter. Et l'état souhaité décrit l'infrastructure, pas la santé du service : on garde une observabilité distincte ([11.12 Logs, métriques et traces](11-securite-fiabilite-operations.md#1112-logs-métriques-et-traces)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable) | Les artefacts immuables sont référencés par empreinte dans l'état souhaité |
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Les changements d'infrastructure passent par le pipeline et ses portes |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Les environnements se décrivent et se réconcilient en code |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les changements s'appliquent par vagues |
| [13.4 Plan de contrôle versus runtime](13-concepts-transversaux.md#134-plan-de-contrôle-versus-runtime) | Plan de contrôle et état d'exécution : deux circuits distincts |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | La configuration d'environnement et la dérive |
| [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact) | Les cellules de tenants sont créées en code |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les secrets restent hors du dépôt |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | La revue et l'approbation s'appliquent aux changements d'infrastructure |

### 5. Application pratique

**Situation initiale.** Alpha Air a créé sa production à la main : certains réglages existent seulement dans la console, personne ne peut recréer l'environnement, et lors d'un exercice de reprise, la reconstruction a pris quatre jours.

**Problème.** Une infrastructure non décrite, non reproductible, avec des dérives.

**Application du concept.** L'équipe décrit l'infrastructure en code et adopte une réconciliation continue.

**Déroulé.**

1. Les services, réseaux, bases et droits sont décrits dans un dépôt, par modules, avec des références vers les secrets.
2. Tout changement passe par une demande de fusion, relue et validée par des tests de politique.
3. Un agent dans chaque environnement tire l'état souhaité et le réconcilie en continu.
4. La promotion de la production consiste à modifier la référence de l'artefact, par une demande de fusion qui passe les portes.
5. Un exercice de reprise recrée l'environnement dans une autre région en 3 heures, à partir du dépôt.

**Résultat.** L'infrastructure est reproductible, les changements sont tracés et la dérive est détectée.

**Limites.** Les changements d'urgence demandent une discipline : ils s'inscrivent dans le dépôt aussitôt après.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que l'infrastructure en tant que code, et quels bénéfices apporte-t-elle ?
2. **Compréhension.** Quels sont les quatre principes de GitOps ?
3. **Compréhension.** Quelle différence y a-t-il entre l'état souhaité de l'infrastructure et la configuration d'un tenant ?
4. **Pourquoi.** Pourquoi les secrets ne se stockent-ils pas dans le dépôt ?
5. **Raisonnement pratique.** Une modification manuelle a été faite en production et n'est pas dans le dépôt. Que va faire l'agent, et que faire ?

#### Réponses

1. La définition de l'infrastructure par des fichiers exécutables, gérés comme du logiciel. Elle apporte l'historique, la reproductibilité, la cohérence d'un serveur à l'autre, les tests et des changements petits, faciles à vérifier et à annuler.
2. Déclaratif ; versionné et immuable ; tiré automatiquement par des agents ; réconcilié en continu.
3. L'état souhaité de l'infrastructure vit dans un dépôt, géré par l'ingénierie, par demande de fusion. La configuration d'un tenant vit dans le plan de contrôle de la plateforme, gérée par ses administrateurs, avec son propre cycle de publication.
4. Parce qu'un dépôt est largement lu et copié : une fuite du dépôt serait une fuite des secrets. On y met des références vers un gestionnaire de secrets.
5. Il va réconcilier : annuler la modification, ou la signaler comme dérive, selon la politique. Il faut inscrire dans le dépôt les changements légitimes, par le même chemin de revue, plutôt que de les laisser à la main.

## 21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari

### 1. Comprendre simplement

Le **déploiement par vagues** (*rolling deployment*) remplace progressivement les instances d'une version par celles de la suivante, par groupes. Le **déploiement bleu-vert** (*blue-green deployment*) prépare la nouvelle version dans un second environnement complet, puis bascule le trafic d'un coup. La **mise en production canari** (*canary release*) expose d'abord la nouvelle version à un petit sous-ensemble du trafic, observe, puis élargit. La **livraison progressive** (*progressive delivery*) désigne l'ensemble de ces pratiques de mise à disposition graduelle, avec une maîtrise fine de qui voit quoi, et un arrêt automatique si les mesures se dégradent.

**Pourquoi cela existe.** Quel que soit le soin apporté aux tests, une version peut se comporter autrement en production : volume, données, usages réels. Déployer pour tout le monde d'un coup transforme chaque défaut en incident général. Déployer progressivement limite le nombre de personnes touchées, et permet d'arrêter avant que le dommage ne soit grand.

**Problème résolu.** Limiter l'étendue des dégâts d'un défaut non détecté, et décider de la suite à partir de mesures réelles.

**Modèle mental.** L'ouverture d'un nouveau pont : on laisse d'abord passer quelques véhicules légers, on mesure, puis on ouvre peu à peu, avec la possibilité de refermer.

**Où l'analogie s'arrête.** Un pont a une charge visible. Un logiciel peut paraître sain pour un petit groupe, parce que les problèmes dépendent du volume, des tenants ou des données : le groupe d'essai doit être représentatif.

**Exemple.** Alpha Air publie la version 2026.41.3 par vagues de tenants : d'abord le tenant interne, puis un anneau de clients volontaires, puis les petits tenants par paliers de 10, 50 et 100 % du trafic, et enfin les grands tenants réglementés avec un préavis de 72 heures. Si le taux d'erreur de la version nouvelle dépasse de 50 % celui de la version actuelle, le déploiement s'arrête automatiquement.

**Les composants.**

1. le **plan de vagues** : ordre, tailles, durées d'observation ;
2. le **routage** : trafic ou tenants dirigés vers l'ancienne ou la nouvelle version ;
3. les **mesures de comparaison** entre version nouvelle et version de référence ;
4. les **critères d'arrêt** et de poursuite ;
5. l'**automatisation** de la décision ;
6. la **cohabitation** de deux versions (données, API) ;
7. la **communication** aux clients concernés ;
8. le **retour arrière** (voir [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)).

**Objectif d'apprentissage :** vous pouvez comparer les stratégies de déploiement, décrire une analyse canari, et dire comment les adapter à une plateforme multi-tenant.

### 2. Connaissances essentielles

#### Définition

- **Déploiement par vagues** : mise à jour par remplacement progressif des instances d'une version par celles de la nouvelle, groupe après groupe.
- **Déploiement bleu-vert** : maintien de deux environnements de production identiques, dont l'un reçoit la nouvelle version, puis bascule du trafic de l'un à l'autre.
- **Mise en production canari** : exposition d'une nouvelle version à un petit sous-ensemble d'utilisateurs ou de trafic, évaluée avant élargissement.
- **Livraison progressive** : ensemble de pratiques de mise à disposition graduelle d'une version, avec contrôle fin de la portée et décision fondée sur des mesures.

#### Idées fondamentales

1. **Limiter le rayon d'effet.** Une erreur ne doit toucher qu'une petite part des utilisateurs.
2. **Mesurer avant d'élargir.** Chaque palier est conditionné par des mesures.
3. **Comparer à une référence.** Version nouvelle et version actuelle sont observées en parallèle (voir [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)).
4. **Deux versions coexistent.** Les données et les interfaces doivent le supporter.
5. **Le groupe d'essai doit être représentatif.** Sinon l'absence de problème ne prouve rien.
6. **La décision s'automatise.** L'arrêt est plus rapide qu'une personne.
7. **Un changement progressif se communique.** Les clients sensibles sont prévenus.

#### Vocabulaire essentiel

- **Instance** (*instance*) : copie en exécution d'un service.
- **Canari et contrôle** (*canary*, *control*) : sous-ensemble qui reçoit le changement, et reste du service servant de référence.
- **Anneau** (*ring*) : groupe de tenants ou d'utilisateurs recevant la version à un stade donné.
- **Rayon d'effet** (*blast radius*) : étendue de ce qu'un défaut peut toucher.
- **Temps d'observation** (*soak time*) : durée pendant laquelle on observe un palier avant de poursuivre.
- **Arrêt automatique** (*automatic halt*) : interruption du déploiement quand un critère est franchi.
- **Débit de pods en trop, d'indisponibilité** (*max surge*, *max unavailable*) : réglages d'un déploiement par vagues.

#### Relations de cause à effet

- La nouvelle version est déployée pour tous d'un coup : un défaut devient un incident pour tous les tenants.
- Le canari est trop petit ou trop court : il ne produit aucun signal, ou un signal bruité.
- Les mesures sont agrégées sur toute la plateforme : le problème d'un petit groupe de tenants est dilué.
- L'ancienne et la nouvelle version ne tolèrent pas les mêmes données : le retour arrière casse.
- Le palier suivant démarre sur un calendrier fixe sans regarder les mesures : le déploiement continue malgré la dégradation.

#### Idées reçues

- **« Bleu-vert, c'est un canari. »** Non. Le bleu-vert bascule tout le trafic d'un coup, d'un environnement à l'autre, avec un retour par la bascule inverse ; le canari élargit par paliers. La documentation de l'équipe de fiabilité de Google note toutefois que le bleu-vert est une variante du canari, au prix de deux fois les ressources.
- **« Progressif veut dire lent. »** Non. Un déploiement automatisé avec des mesures peut s'achever en une heure ; ce qui change, c'est qu'il s'arrête quand il le faut.
- **« Un déploiement par vagues, c'est sans risque d'indisponibilité. »** Seulement avec plusieurs instances et des réglages de disponibilité ; une instance unique coupe le service.

#### Principe clé

On met en production par paliers, en comparant à une référence et en s'arrêtant sur des critères mesurables, pour que l'effet d'un défaut reste borné.

#### Si vous ne retenez que trois choses

1. Par vagues, bleu-vert, canari : trois façons de limiter l'effet d'une erreur, aux coûts différents.
2. Un canari utile est représentatif, observé assez longtemps et comparé à une référence, par population.
3. Les deux versions cohabitent : données et interfaces doivent être compatibles.

### 3. Explication technique détaillée

#### Les stratégies

| Stratégie | Principe | Ressources | Retour arrière | Exposition au défaut | Complexité |
|---|---|---|---|---|---|
| Tout d'un coup | On remplace tout | Aucune en plus | Redéploiement | Totale, immédiate | Faible |
| Par vagues | Remplacement progressif des instances | Peu | Arrêt et retour par vagues | Progressive, mais tout le trafic finit sur la nouvelle version | Faible à moyenne |
| Bleu-vert | Deux environnements, bascule du routeur | Double | Rapide : bascule inverse | Totale à la bascule, retour immédiat | Moyenne |
| Canari | Petit sous-ensemble, puis élargissement | Peu | Rapide : retirer le canari | Limitée au sous-ensemble | Moyenne à élevée |
| Progressive | Anneaux, pourcentages, indicateurs, arrêt automatique | Variable | Automatique | Contrôlée | Élevée |

**Par vagues.** La documentation de Kubernetes décrit la mise à jour par vagues : les instances sont remplacées progressivement par de nouvelles ; le système attend que les nouvelles démarrent avant de retirer les anciennes ; le trafic n'est envoyé qu'aux instances prêtes ; les réglages par défaut autorisent une indisponibilité et un surplus d'une instance chacun, en nombre ou en pourcentage ; plusieurs réplicas sont nécessaires pour ne pas affecter la disponibilité ; et l'on peut revenir à l'état précédent.

**Bleu-vert.** La page de Martin Fowler en décrit le principe : deux environnements de production quasi identiques ; l'un sert, l'autre reçoit la nouvelle version pour des essais finaux ; quand le second fonctionne, on bascule le routeur ; en cas de problème, on rebascule. Elle précise la gestion des transactions survenues pendant la bascule (les envoyer aux deux environnements, ou passer brièvement le second en lecture seule) et le traitement des bases de données : déployer les changements de schéma séparément de l'application, d'abord un changement compatible avec l'ancienne et la nouvelle version, puis l'application, en gardant l'ancienne version comme point de retour, puis retirer le support de l'ancienne version une fois la mise à niveau stabilisée.

**Canari.** La page de Fowler le décrit : déployer la nouvelle version sur quelques serveurs qui ne reçoivent d'abord aucun trafic, diriger vers elle un petit ensemble choisi d'utilisateurs, puis ajouter des serveurs et des utilisateurs à mesure que la confiance grandit ; en cas de problème, réorienter vers l'ancienne version. Le chapitre du guide pratique de l'équipe de fiabilité de Google le définit comme un déploiement partiel et limité dans le temps d'un changement, suivi de son évaluation : le sous-ensemble est le canari, le reste est le contrôle.

**Livraison progressive.** Le terme a été proposé par James Governor, de RedMonk, vers 2018, pour désigner des pratiques de mise à disposition graduelle qui prolongent la livraison continue : lancements canari, déploiements par pourcentage, déploiements par anneaux.

#### Analyser un canari

Le chapitre de la fiabilité de Google précise comment comparer :

- comparer **directement** les mesures du canari et du contrôle ; les mesures agrégées sur tout le service masquent les erreurs d'un canari qui ne représente qu'une petite part ;
- ventiler les mesures **par population** pour que la différence apparaisse ;
- choisir des mesures qui indiquent un problème visible par l'utilisateur (taux d'erreur, latence) plutôt que des ressources (processeur), souvent trop bruitées ;
- garder un petit nombre de mesures ;
- utiliser des intervalles de mesure plus courts que la durée du canari.

| Compromis | Conséquence |
|---|---|
| Petit canari | Exposition limitée, mais signal lent à obtenir |
| Canari plus gros ou plus long | Plus représentatif, mais déploiement plus lent |
| Seuils stricts | Faux positifs : arrêts inutiles |
| Seuils lâches | Mauvais canaris qui passent |
| Comparaison avant-après | Faible : le trafic varie selon l'heure et le jour |

**Exemple chiffré.** Le canari reçoit 1 000 requêtes et enregistre 6 erreurs (0,6 %). Le contrôle reçoit 100 000 requêtes et enregistre 200 erreurs (0,2 %). Le rapport est de 3. Mais 6 erreurs sont un échantillon petit : l'écart peut relever du hasard. La règle de décision combine un rapport **et** un échantillon minimal : en dessous d'un nombre de requêtes, on prolonge l'observation au lieu de conclure.

#### Adapter à une plateforme multi-tenant

Une plateforme a des dimensions que les services unitaires n'ont pas : les **tenants**, de tailles et de profils très différents, et les **régions**.

| Dimension | Principe |
|---|---|
| Anneaux de tenants | Interne, volontaires, petits, moyens, grands, réglementés ; chaque anneau est un palier |
| Cellules | Une cellule à la fois (voir [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact)), pour borner le rayon d'effet |
| Régions | Une région à la fois, en gardant au moins une région de référence |
| Tenants à préavis | Les clients qui l'exigent sont prévenus (délai d'exemple : 72 heures) |
| Option d'adhésion ou de report | Un tenant peut demander à recevoir plus tôt ou plus tard, dans des limites |
| Mesures par tenant | Un tenant touché est visible même quand la moyenne est bonne |

```json
{
  "release": "2026.41.3",
  "waves": [
    { "name": "internal", "selector": { "tenant": "ten_internal" }, "min_soak_minutes": 30 },
    { "name": "early", "selector": { "ring": "early_adopters" }, "min_soak_minutes": 120 },
    { "name": "standard_small", "selector": { "size": "small" }, "traffic_percent": [10, 50, 100], "min_soak_minutes": 60 },
    { "name": "large_and_regulated", "selector": { "size": "large" }, "requires": "customer_notice_72h", "min_soak_minutes": 240 }
  ],
  "halt_if": [
    { "metric": "error_rate", "compare": "canary_vs_control", "threshold_ratio": 1.5, "min_requests": 5000 },
    { "metric": "p95_latency_ms", "compare": "canary_vs_control", "threshold_ratio": 1.3, "min_requests": 5000 },
    { "metric": "slo_burn_rate", "compare": "absolute", "threshold": 2.0 }
  ],
  "on_halt": { "action": "stop_and_hold", "notify": "role:release_manager" }
}
```

L'arrêt est **automatique** et la reprise est une décision : on ne repart pas seul. Les critères s'appuient sur les objectifs de niveau de service ([11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla)) : la consommation du budget d'erreur arrête les déploiements.

#### Compatibilité pendant la cohabitation

Pendant un déploiement, deux versions servent des requêtes et partagent les mêmes données. Il faut donc :

- que la nouvelle version **lise et écrive** des données que l'ancienne comprend ;
- que les changements de schéma soient **rétrocompatibles** (voir [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) ;
- que les messages et événements échangés soient compatibles ([28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité)) ;
- que les clients d'API ne voient pas de rupture ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) ;
- que les caches et sessions survivent au changement de version.

#### Modes de défaillance

- **Déploiement global** sans palier.
- **Canari non représentatif** : tenants simples seulement.
- **Mesures agrégées** qui diluent le signal.
- **Pas de critère d'arrêt** : le déploiement continue.
- **Incompatibilité des données** entre versions.
- **Surveillance absente** pendant la nuit : le palier suivant démarre sans personne.
- **Fenêtre trop courte** : un défaut qui se manifeste au bout de deux heures n'est pas vu.

**Contre-exemple.** Une version est déployée en canari sur 2 % du trafic, composé presque uniquement de petits tenants. Le défaut, une requête qui devient lente avec plus de 100 000 constats, n'apparaît que chez les grands tenants. Les mesures sont bonnes au palier de 2 %, bonnes à 50 %, et la mise en production à 100 % dégrade trois grands clients. Le canari doit inclure des tenants de profils variés, dont un grand tenant synthétique.

**Limites.** Un déploiement progressif ne détecte que ce qu'il mesure. Les défauts lents (fuite de mémoire, dérive de données) demandent des durées longues. La cohabitation de versions limite la nature des changements acceptables. Et le coût d'une plateforme de livraison progressive est réel : on l'adapte au risque de chaque changement.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Le déploiement progressif est la dernière étape du pipeline |
| [21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline) | Retour arrière, correction en avant et migrations accompagnent le déploiement |
| [21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops) | Les vagues se décrivent dans l'état souhaité de l'infrastructure |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les feature flags découplent déploiement et activation par tenant |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les objectifs de niveau de service pilotent l'arrêt |
| [22.6 Architecture cellulaire et rayon d'impact](22-performance-echelle-economie.md#226-architecture-cellulaire-et-rayon-dimpact) | Les cellules bornent le rayon d'effet |
| [22.7 Multi-région et routage par résidence des données](22-performance-echelle-economie.md#227-multi-région-et-routage-par-résidence-des-données) | Les régions sont des paliers naturels |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | La compatibilité des API pendant la cohabitation |

### 5. Application pratique

**Situation initiale.** Alpha Air déploie chaque version sur tous les tenants à la fois. Une version récente a doublé le temps de réponse de la liste des constats pour trois grands clients, détecté après deux heures par leurs réclamations.

**Problème.** Aucun palier, aucune comparaison, aucun arrêt automatique.

**Application du concept.** La plateforme adopte un déploiement progressif par anneaux de tenants, avec comparaison canari-contrôle et arrêt automatique.

**Déroulé.**

1. Les tenants sont répartis en anneaux : interne, volontaires, petits, moyens, grands et réglementés.
2. Chaque version passe les anneaux en séquence, avec des paliers de trafic et un temps d'observation.
3. Les mesures (erreurs, latence au 95e percentile, consommation du budget d'erreur) sont comparées entre canari et contrôle, ventilées par tenant.
4. Un seuil dépassé arrête le déploiement et prévient la personne chargée de la version.
5. Les grands clients réglementés sont prévenus 72 heures avant leur anneau.

**Résultat.** Un défaut de latence est détecté au deuxième anneau, avant d'atteindre les grands tenants ; la version est retirée en dix minutes.

**Limites.** Le cycle complet dure maintenant un à deux jours : les correctifs urgents suivent un chemin raccourci, avec les mêmes portes essentielles.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre un déploiement bleu-vert et un déploiement canari ?
2. **Compréhension.** Pourquoi compare-t-on le canari à un contrôle plutôt qu'à l'état d'avant ?
3. **Compréhension.** Quelles dimensions propres à une plateforme multi-tenant structurent les vagues ?
4. **Pourquoi.** Pourquoi les mesures doivent-elles être ventilées par population ?
5. **Raisonnement pratique.** Un canari reçoit 400 requêtes avec 3 erreurs ; le contrôle, 200 000 requêtes avec 200 erreurs. Peut-on conclure ?

#### Réponses

1. Le bleu-vert prépare un second environnement complet et bascule tout le trafic d'un coup, avec un retour par la bascule inverse ; il coûte deux fois les ressources. Le canari expose un petit sous-ensemble puis élargit par paliers, pour limiter l'exposition.
2. Parce que le trafic varie avec l'heure, le jour et les événements : la comparaison avant-après est bruitée. Le contrôle, observé en même temps, reçoit les mêmes conditions.
3. Les tenants (par taille, profil et exigences), les cellules et les régions.
4. Parce que les mesures agrégées diluent le problème d'un petit groupe : un défaut qui touche 3 grands tenants disparaît dans une moyenne portant sur 800.
5. Non : 3 erreurs sur 400 font 0,75 %, contre 0,1 % pour le contrôle, soit un rapport de 7,5, mais l'échantillon est petit. On prolonge l'observation jusqu'à un nombre minimal de requêtes avant de décider.

## 21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline

### 1. Comprendre simplement

Le **retour arrière** (*rollback*) ramène le système à la version précédente. La **correction en avant** (*roll-forward*) corrige le défaut par une nouvelle version, sans revenir en arrière. Le choix entre les deux est le sujet *rollback versus roll-forward*. Une **migration de base de données dans le pipeline** (*database migration in the pipeline*) est la modification de la structure ou des données de la base, appliquée par la chaîne de livraison, de façon ordonnée, versionnée et vérifiée.

**Pourquoi cela existe.** Quand une version casse quelque chose, on veut revenir vite à un état sain. Mais le code n'est pas seul : une migration a changé la base, des messages ont été émis, des utilisateurs ont écrit des données dans un nouveau format. Revenir au code ancien peut le faire lire des données qu'il ne comprend pas. Il faut donc décider à l'avance ce qui est réversible, et concevoir les changements pour qu'ils le soient.

**Problème résolu.** Pouvoir rétablir un service sain rapidement, et changer la base sans coupure ni perte.

**Modèle mental.** Une ouverture de route en travaux. On prépare un tronçon parallèle, on y bascule, on vérifie, puis seulement on ferme l'ancien. Tant que l'ancien n'est pas fermé, on peut revenir ; une fois fermé, on ne peut qu'avancer.

**Où l'analogie s'arrête.** Une route est à sens unique dans le temps. Dans une base de données, des écritures de l'ancienne et de la nouvelle version se mêlent pendant la cohabitation : il faut qu'elles restent compréhensibles par les deux.

**Exemple.** Alpha Air veut renommer la colonne `base` en `home_base` de la table des aéronefs. Plutôt que de renommer d'un coup, l'équipe procède en trois temps : ajouter `home_base` et écrire dans les deux colonnes ; migrer les lectures et recopier les anciennes valeurs ; supprimer `base` une version plus tard. À chaque étape, un retour arrière est possible.

**Les composants.**

1. la **règle de compatibilité** entre versions adjacentes ;
2. les **migrations versionnées**, appliquées une fois et enregistrées ;
3. le **schéma d'étapes** : étendre, migrer, contracter ;
4. l'**exécution** dans le pipeline, avant le déploiement du code ;
5. les **techniques en ligne** : verrous courts, recopie par lots ;
6. la **décision** de retour arrière ou de correction en avant ;
7. le **test** des migrations à volume réaliste ;
8. la **communication** d'un incident en cours.

**Objectif d'apprentissage :** vous pouvez dire quand un retour arrière est possible, décomposer un changement de schéma en étapes compatibles, et décrire comment une migration s'exécute dans le pipeline.

### 2. Connaissances essentielles

#### Définition

- **Retour arrière** : retour à une version précédente du système.
- **Correction en avant** : traitement d'un défaut par le déploiement rapide d'une nouvelle version corrigée.
- **Migration de base de données dans le pipeline** : changement de la structure ou du contenu de la base, versionné et exécuté automatiquement par la chaîne de livraison.

#### Idées fondamentales

1. **Un retour arrière n'est pas toujours possible.** Il l'est si l'état partagé reste compréhensible par l'ancienne version.
2. **On conçoit pour la réversibilité.** Les changements sont compatibles avec la version précédente.
3. **Étendre, migrer, contracter.** Trois étapes, sur plusieurs versions.
4. **La migration précède le code qui en dépend.** Mais reste compatible avec l'ancien.
5. **Une migration est versionnée et enregistrée.** Elle s'applique une fois, dans l'ordre.
6. **On décide vite.** Une règle dit quand revenir et quand corriger.
7. **On teste les migrations à volume réaliste.** Une migration sûre sur 1 000 lignes peut verrouiller 800 millions.

#### Vocabulaire essentiel

- **Changement rétrocompatible** (*backward-compatible change*) : changement que la version précédente tolère.
- **Étendre et contracter** (*expand and contract*) ou **changement parallèle** (*parallel change*) : méthode en trois phases pour changer une interface incompatible.
- **Migration versionnée** (*versioned migration*) : script de changement identifié par un numéro, appliqué une fois.
- **Table d'historique** (*schema history table*) : table qui consigne les migrations appliquées.
- **Recopie par lots** (*batched backfill*) : remplissage progressif d'une nouvelle colonne.
- **Migration en ligne** (*online migration*) : migration qui n'interrompt pas le service.
- **Changement irréversible** (*irreversible change*) : changement qui ne peut pas être annulé sans perte.

#### Relations de cause à effet

- La migration supprime une colonne dans la même version que le code qui n'en dépend plus : le retour arrière du code échoue, car l'ancienne version cherche la colonne.
- Une migration verrouille une grosse table pendant 20 minutes : le service est dégradé pour tous.
- La migration réussit en préproduction (petit volume) et échoue en production : le volume change tout.
- On revient au code ancien alors que des utilisateurs ont créé des données dans un nouveau format : l'ancienne version plante.
- Il n'y a pas de règle de décision : l'équipe débat pendant que l'incident dure.

#### Idées reçues

- **« On peut toujours revenir en arrière. »** Non. Des suppressions, des transformations de données, des messages envoyés, des effets externes ne se défont pas.
- **« Corriger en avant, c'est risqué. »** Pas nécessairement : si le pipeline est rapide et fiable, c'est souvent plus sûr que de revenir à un état que l'on n'a pas testé avec les données actuelles.
- **« Les migrations sont l'affaire d'un administrateur de base. »** Non. Elles sont du code, dans le pipeline, avec revue, tests et portes.

#### Principe clé

Chaque changement est conçu pour que la version précédente continue de fonctionner, la base se change en étapes compatibles et versionnées, et une règle décide à l'avance quand l'on revient et quand l'on corrige.

#### Si vous ne retenez que trois choses

1. Un retour arrière n'est sûr que si le changement est rétrocompatible avec la version précédente.
2. Un changement incompatible se décompose en trois temps : étendre, migrer, contracter.
3. Les migrations sont versionnées, exécutées par le pipeline et testées à volume réaliste.

### 3. Explication technique détaillée

#### Retour arrière ou correction en avant

| Critère | Retour arrière | Correction en avant |
|---|---|---|
| Principe | Redéployer la version précédente | Déployer une version corrigée |
| Rapidité | Très rapide si l'artefact est conservé | Dépend du pipeline et de la fabrication du correctif |
| Risque | Compatibilité avec l'état actuel des données | Nouveau code, peu de temps pour tester |
| Condition | Changements rétrocompatibles | Pipeline fiable et rapide |
| Quand | Défaut évident, état partagé compatible | Changement irréversible, correction simple et sûre |

```text
Incident après déploiement
   │
   ├─ Le défaut est-il lié à la dernière version ? ──non──► diagnostic ordinaire
   │ oui
   ├─ L'état (données, messages) reste-t-il compréhensible par la version précédente ? ──oui──► retour arrière
   │ non
   └─ Une correction courte et testable existe-t-elle ? ──oui──► correction en avant
                                                         non──► atténuation (désactiver la fonction, feature flag), puis correction
```

Une **règle de décision** s'écrit avant l'incident : par exemple, « si le rétablissement n'est pas assuré en 15 minutes par correction, on revient en arrière quand c'est compatible ». Les **feature flags** ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) offrent une troisième voie : désactiver la fonction fautive sans redéployer.

**Conserver les moyens du retour.** Les artefacts précédents restent disponibles ([21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable)) ; le déploiement sait cibler une version ([21.4 Infrastructure as code et GitOps](#214-infrastructure-as-code-et-gitops)) ; le retour est répété lors d'exercices, comme le reste de la reprise ([11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration)).

#### Les changements de schéma : étendre, migrer, contracter

La page de Martin Fowler sur le changement parallèle décrit trois phases : **étendre** (ajouter la nouvelle version à côté de l'ancienne, sans casser les clients existants), **migrer** (faire passer progressivement les clients de l'ancienne à la nouvelle), **contracter** (retirer l'ancienne quand plus personne ne l'utilise). La page précise que la plupart des refactorisations de base de données suivent ce schéma.

| Phase | Changement de base | Code | Retour arrière possible ? |
|---|---|---|---|
| Étendre | Ajouter `home_base`, nullable | Écrit dans `base` et `home_base`, lit `base` | Oui |
| Migrer | Recopier `base` vers `home_base` par lots | Lit `home_base` (repli sur `base`) | Oui |
| Vérifier | Contrôle de cohérence entre les deux colonnes | Lit `home_base` uniquement | Oui, vers la version précédente |
| Contracter | Supprimer `base` | Code ne la référence plus | **Non** : à faire une version plus tard |

La dernière étape est le seul changement irréversible : on la retarde, et l'on conserve éventuellement une copie des valeurs ([18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers)).

```sql
-- Étape 1 : étendre (rapide, compatible)
ALTER TABLE aircraft ADD COLUMN home_base text;

-- Étape 2 : recopier par lots, hors transaction longue
UPDATE aircraft
   SET home_base = base
 WHERE home_base IS NULL
   AND id IN (
         SELECT id FROM aircraft WHERE home_base IS NULL ORDER BY id LIMIT 1000
       );

-- Étape 3 : contraindre sans bloquer longtemps
ALTER TABLE aircraft
  ADD CONSTRAINT aircraft_home_base_not_null CHECK (home_base IS NOT NULL) NOT VALID;
ALTER TABLE aircraft VALIDATE CONSTRAINT aircraft_home_base_not_null;
```

La documentation de PostgreSQL précise le comportement de ces commandes : une colonne ajoutée sans valeur par défaut, ou avec une valeur par défaut non volatile, ne demande pas de réécriture de la table ; une contrainte ajoutée avec `NOT VALID` s'applique aux nouvelles écritures sans parcourir les lignes existantes, ce qui évite de bloquer les écritures pendant un long parcours ; `VALIDATE CONSTRAINT` vérifie ensuite les lignes existantes avec un verrou qui laisse passer les lectures et les écritures. La création d'un index avec l'option `CONCURRENTLY` ne bloque pas les écritures, au prix d'un travail plus long, d'une exécution hors transaction, et d'un éventuel index invalide à reprendre en cas d'échec.

```sql
CREATE INDEX CONCURRENTLY aircraft_home_base_idx ON aircraft (tenant_id, home_base);
```

#### Les migrations dans le pipeline

Les outils de migration versionnée appliquent les scripts dans l'ordre de leur numéro, ceux qui manquent à la base, et consignent dans une table d'historique ce qui a été appliqué, quand et par qui (c'est le comportement décrit par la documentation de l'outil Flyway).

```text
construire ─► tester ─► déployer en préproduction ─► migration (étendre) ─► déploiement du code N+1 ─► vérifications ─► (version suivante) migration (contracter)
```

| Règle | Raison |
|---|---|
| Une migration par changement, numérotée, jamais modifiée après application | L'historique est la vérité |
| La migration s'exécute **avant** le code qui en dépend | Le schéma est prêt |
| Elle est compatible avec le code **actuel** et le suivant | Retour arrière possible |
| Pas de migration irréversible dans la même version que le changement du code | Séparer les risques |
| Verrous courts, délai maximal de verrou | Le service ne se bloque pas |
| Grosses opérations par lots, avec reprise | Pas de transaction de plusieurs heures |
| Testée sur un volume proche de la production ([21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements)) | Les durées et les verrous réels se voient |
| Porte « migration rétrocompatible » dans le pipeline ([21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité)) | Détection avant la production |

**Multi-tenant.** Un schéma partagé se migre une fois ; un schéma par tenant se migre tenant par tenant, avec un ordre (anneaux), des reprises et un suivi par tenant ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)). Les **données** d'un tenant (valeurs de champs personnalisés) se migrent par des opérations de plateforme ([2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)), avec la même règle de compatibilité.

#### Ce qui ne se défait pas

| Élément | Pourquoi irréversible | Précaution |
|---|---|---|
| Suppression de colonne ou de table | Données perdues | Contracter en dernier ; sauvegarde ; délai |
| Transformation destructrice de données | Information perdue | Garder l'original un temps |
| Événements émis, notifications envoyées | Effet externe | Idempotence, désactivation par drapeau |
| Facturations, envois à des tiers | Effet financier ou légal | Mode « à blanc » ; validation |
| Clés ou secrets rotés | Ancienne valeur invalide | Période de double validité |

#### Modes de défaillance

- **Migration destructrice** dans la même version.
- **Verrou long** sur une table chaude.
- **Migration non testée** à volume réaliste.
- **Retour arrière tenté** sans compatibilité.
- **Migration modifiée après application** : historique incohérent.
- **Décision tardive** : on délibère pendant l'incident.
- **Retour arrière du code seul** alors que l'état a changé.

**Contre-exemple.** Une version supprime la colonne `base` et déploie le code qui lit `home_base`, dans le même déploiement. Un défaut apparaît dans le code. On revient à la version précédente, qui lit `base`… qui n'existe plus. Le service est en panne totale. La suppression devait venir une version après la stabilisation.

**Limites.** La méthode en trois temps multiplie les versions et la durée d'un changement : on la réserve aux changements incompatibles. Certains changements de données ne s'expriment pas en étapes compatibles. Et la cohabitation de deux formats augmente la complexité du code pendant la période de transition.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Le déploiement progressif exige la cohabitation de versions |
| [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable) | Conserver les artefacts précédents rend le retour possible |
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Une porte vérifie la rétrocompatibilité des migrations |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Les migrations se testent à volume réaliste |
| [2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma) | L'évolution de schéma en deux temps du parcours initial |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Désactiver une fonction par drapeau évite un retour arrière |
| [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) | Le retour arrière de configuration est traité par le versionnement |
| [11.10 Sauvegarde et restauration](11-securite-fiabilite-operations.md#1110-sauvegarde-et-restauration) | La sauvegarde est le dernier recours d'un changement irréversible |
| [18.11 Conservation et gel légal des fichiers](18-fichiers-documents-contenus.md#1811-conservation-et-gel-légal-des-fichiers) | La conservation d'une copie avant suppression |

### 5. Application pratique

**Situation initiale.** Alpha Air doit renommer une colonne et ajouter une contrainte sur une table de 40 millions de lignes. La dernière migration comparable a verrouillé la table pendant 18 minutes un matin de semaine.

**Problème.** Des migrations bloquantes, incompatibles avec un retour arrière, non testées à volume réaliste.

**Application du concept.** L'équipe adopte le schéma étendre-migrer-contracter, les migrations versionnées dans le pipeline et une règle de décision d'incident.

**Déroulé.**

1. Version N : ajout de `home_base`, double écriture ; migration exécutée avant le code, en quelques secondes.
2. Recopie par lots de 1 000 lignes, hors heures de pointe, avec suivi et reprise ; durée : 55 minutes, sans verrou long.
3. Version N+1 : lecture de `home_base` ; la contrainte est ajoutée en `NOT VALID`, puis validée.
4. Version N+2, deux semaines plus tard : suppression de `base`, après vérification d'absence de lecture.
5. La règle d'incident : en cas de défaut dans les 24 heures, retour arrière si l'état est compatible, sinon désactivation par drapeau puis correction en avant.

**Résultat.** Aucun verrou long, un retour arrière possible à chaque étape, et une seule étape irréversible, isolée.

**Limites.** Le changement s'étend sur trois versions et deux semaines : l'équipe l'accepte pour un changement de cette importance.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre retour arrière et correction en avant ?
2. **Compréhension.** Quelles sont les trois phases d'un changement parallèle ?
3. **Compréhension.** Pourquoi la suppression de colonne est-elle placée dans une version ultérieure ?
4. **Pourquoi.** Pourquoi une migration doit-elle être testée sur un volume proche de la production ?
5. **Raisonnement pratique.** Une version déploie une migration qui transforme de façon destructive des valeurs, puis le code. Un défaut apparaît. Peut-on revenir en arrière ?

#### Réponses

1. Le retour arrière redéploie la version précédente ; la correction en avant déploie une version corrigée. Le premier suppose que l'état partagé reste compréhensible par l'ancienne version.
2. Étendre (ajouter la nouvelle forme à côté de l'ancienne), migrer (faire passer les clients), contracter (retirer l'ancienne forme quand plus personne ne l'utilise).
3. Parce que c'est le seul changement irréversible : tant qu'elle existe, on peut revenir à la version précédente du code. On la fait après stabilisation.
4. Parce que la durée, les verrous et l'occupation des ressources dépendent du volume : une migration instantanée sur 1 000 lignes peut verrouiller une table pendant des minutes sur 40 millions.
5. Pas sans perte : la transformation destructrice a changé l'état, que l'ancienne version ne comprend pas ou qui est perdu. On corrige en avant, ou l'on restaure depuis une sauvegarde en mesurant la perte. D'où le principe de ne jamais combiner une migration destructrice et un changement de code.

## 21.7 Pyramide de tests, tests de contrat et tests de bout en bout

### 1. Comprendre simplement

La **pyramide de tests** (*test pyramid*) est une image qui recommande beaucoup de tests rapides et ciblés à la base, moins de tests d'intégration au milieu, et très peu de tests lents qui traversent tout le système au sommet. Un **test de contrat** (*contract test*) vérifie, sans lancer tout le système, que deux composants s'accordent sur ce qu'ils s'échangent : ce que le consommateur attend, ce que le fournisseur garantit. Un **test de bout en bout** (*end-to-end test*) exécute un parcours complet à travers le système réel, comme un utilisateur.

**Pourquoi cela existe.** On voudrait tout tester par des parcours complets, car c'est ce que vit l'utilisateur. Mais ces tests sont lents, fragiles, difficiles à diagnostiquer. On voudrait aussi tout tester isolément, ce qui laisse des trous entre les composants. La pyramide et les contrats cherchent le bon équilibre : de la vitesse et de la précision en bas, de la confiance en haut.

**Problème résolu.** Obtenir une confiance suffisante, rapidement et à bas coût, en plaçant chaque vérification au niveau le plus bas où elle est possible.

**Modèle mental.** Le contrôle d'une voiture : on vérifie chaque pièce sur l'établi (tests unitaires), on vérifie les raccords entre pièces (tests de contrat et d'intégration), puis on fait un tour d'essai avant de livrer (tests de bout en bout). On ne fait pas un tour d'essai pour chaque boulon.

**Où l'analogie s'arrête.** Une voiture est un objet fermé. Une plateforme est un système de composants, d'API, de clients et de configurations que d'autres équipes font évoluer : les raccords, ici, sont des interfaces versionnées.

**Exemple.** L'application mobile d'Alpha Air consomme l'API des constats. Le test de contrat du consommateur déclare : « la liste renvoie des éléments avec `id`, `title`, `severity` et un curseur suivant ». Le fournisseur rejoue ce contrat à chaque changement de l'API : s'il retire `severity`, le contrat échoue avant que l'application ne casse. Trois parcours de bout en bout seulement valident, ensuite, que la création d'un constat, sa clôture et sa signature fonctionnent de bout en bout.

**Les composants.**

1. les **tests unitaires**, rapides, isolés ;
2. les **tests d'intégration** : composant et dépendances réelles ou simulées ;
3. les **tests de contrat** : consommateur et fournisseur ;
4. les **tests de bout en bout** : parcours critiques ;
5. les **tests non fonctionnels** : performance, résilience (voir [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité)) ;
6. la **répartition** et les **budgets de durée** ;
7. la **gestion des tests instables**.

**Objectif d'apprentissage :** vous pouvez justifier la forme d'une pyramide de tests, décrire le principe d'un test de contrat piloté par le consommateur, et dire quand un test de bout en bout est justifié.

### 2. Connaissances essentielles

#### Définition

- **Pyramide de tests** : principe d'un portefeuille de tests où le nombre de tests décroît à mesure qu'ils sont plus larges, plus lents et plus coûteux.
- **Test de contrat** : test qui vérifie, pour chaque partie, qu'elle respecte le contrat d'échange avec l'autre, sans déployer l'ensemble.
- **Test de bout en bout** : test qui exerce un parcours complet à travers les composants réels du système.

#### Idées fondamentales

1. **Plus c'est large, plus c'est lent et fragile.** On en écrit moins.
2. **On teste au niveau le plus bas possible.** Le défaut se trouve plus vite et se diagnostique mieux.
3. **Le consommateur déclare ses attentes.** Le fournisseur n'a pas à deviner ce qui est utilisé.
4. **Un contrat se rejoue par le fournisseur à chaque changement.** C'est une protection des consommateurs.
5. **Peu de parcours de bout en bout, bien choisis.** Les parcours critiques seulement.
6. **Un test instable est un test cassé.** On le corrige ou on le met en quarantaine.
7. **Les tests ont un budget de durée.** Sinon on les contourne.

#### Vocabulaire essentiel

- **Test unitaire** (*unit test*) : test d'une petite unité de code, isolée.
- **Test d'intégration** (*integration test*) : test de l'interaction entre composants.
- **Contrat piloté par le consommateur** (*consumer-driven contract*) : contrat issu des attentes déclarées par le consommateur.
- **Double de test** (*test double*) : substitut contrôlé d'une dépendance : bouchon, simulacre, faux.
- **Test de fumée** (*smoke test*) : vérification rapide que l'essentiel fonctionne.
- **Test instable** (*flaky test*) : test dont le résultat varie sans changement du code.
- **Test non déterministe** (*non-deterministic test*) : synonyme du précédent.

#### Relations de cause à effet

- La suite repose surtout sur des tests de bout en bout : elle dure des heures, et ses échecs sont difficiles à localiser.
- Aucune vérification de contrat : un fournisseur retire un champ « inutilisé » et casse un consommateur.
- Les tests instables sont relancés jusqu'au vert : leur échec ne signifie plus rien.
- Les doubles de test dérivent de la réalité : les tests passent, la production échoue.
- Les tests lents s'exécutent en premier : le retour est tardif, et l'on contourne.

#### Idées reçues

- **« Tester, c'est surtout tester l'interface. »** Non. Les tests pilotés par l'interface sont, selon Martin Fowler, fragiles, coûteux à écrire et longs à exécuter ; on les garde pour l'essentiel.
- **« Un test de contrat remplace les tests d'intégration. »** Non. Il vérifie l'accord sur l'interface, pas le comportement global.
- **« Plus de tests, c'est plus de qualité. »** Non. Des tests redondants ou instables ralentissent et érodent la confiance.

#### Principe clé

On place chaque vérification au niveau le plus bas possible : beaucoup de tests rapides, des contrats pour les raccords, quelques parcours de bout en bout pour l'essentiel.

#### Si vous ne retenez que trois choses

1. Beaucoup de tests unitaires, moins d'intégration, très peu de bout en bout.
2. Un test de contrat protège un consommateur d'un changement du fournisseur, sans environnement complet.
3. Un test instable se corrige ou se met en quarantaine : on ne le relance pas jusqu'à ce qu'il passe.

### 3. Explication technique détaillée

#### La pyramide

La page de Martin Fowler sur la pyramide de tests la résume : constituer un portefeuille équilibré avec beaucoup de tests unitaires, rapides et de bas niveau, et beaucoup moins de tests de haut niveau qui traversent toute la pile ; une couche intermédiaire de tests au niveau d'un service ou d'une API donne beaucoup des avantages du bout en bout sans la complexité de l'interface. Il qualifie les tests de bout en bout pilotés par l'interface de fragiles, coûteux à écrire et longs à exécuter. La notion est popularisée par Mike Cohn dans un ouvrage de 2009.

```text
              ╱╲
             ╱  ╲          bout en bout : parcours critiques, peu nombreux, lents
            ╱────╲
           ╱      ╲        contrats et API : raccords entre composants, rapides
          ╱────────╲
         ╱          ╲      intégration : composant et dépendances réelles
        ╱────────────╲
       ╱              ╲    unitaires : très nombreux, très rapides, isolés
      ╱────────────────╲
```

| Niveau | Nombre (exemple) | Durée totale (exemple) | Ce qui est vérifié | Diagnostic d'un échec |
|---|---|---|---|---|
| Unitaire | 2 000 | 3 min | Règles, validations, calculs | Immédiat |
| Intégration | 300 | 8 min | Composant, base, file | Rapide |
| Contrat | 60 | 4 min | Interfaces entre composants | Rapide |
| Bout en bout | 25 | 20 min | Parcours critiques | Long |

*Ces valeurs sont des ordres de grandeur d'exemple.*

#### Tester un moteur générique

Dans une plateforme pilotée par les métadonnées, le moteur interprète des définitions. Les tests unitaires du moteur ne se limitent pas à du code : ils exercent le moteur sur un **catalogue de définitions** représentatives (transitions, règles, validations) avec des cas attendus. Un test « tabulaire » exprime beaucoup de cas en peu de code :

```typescript
interface TransitionCase {
  from: string;
  event: string;
  role: string;
  expected: "allowed" | "denied";
}

const CASES: TransitionCase[] = [
  { from: "open", event: "ground_aircraft", role: "quality_manager", expected: "allowed" },
  { from: "open", event: "ground_aircraft", role: "technician", expected: "denied" },
  { from: "closed", event: "ground_aircraft", role: "quality_manager", expected: "denied" },
];

function runCases(
  guard: (from: string, event: string, role: string) => "allowed" | "denied",
): TransitionCase[] {
  return CASES.filter((c) => guard(c.from, c.event, c.role) !== c.expected);
}
```

La fonction renvoie les cas en échec : un résultat vide signifie que tous passent. Les cas viennent des scénarios métier et s'enrichissent à chaque défaut trouvé.

#### Les tests de contrat

Le projet Pact, outil de test de contrat, décrit les principes : chaque application est vérifiée isolément pour s'assurer que les messages qu'elle envoie ou reçoit respectent un contrat partagé et documenté ; dans l'approche **pilotée par le consommateur**, le contrat est produit lors de l'exécution des tests du consommateur, qui définit donc ses attentes ; le contrat est **par l'exemple**, un ensemble de paires requête-réponse concrètes ; seules les parties de l'API réellement utilisées par les consommateurs sont testées, donc un fournisseur peut modifier ce qui n'est pas utilisé ; le but est de confirmer que les applications fonctionnent ensemble sans tests d'intégration coûteux et fragiles ni déploiement du système entier.

```json
{
  "consumer": "mobile-app",
  "provider": "platform-api",
  "interactions": [
    {
      "description": "lister les constats ouverts d'un aéronef",
      "request": {
        "method": "GET",
        "path": "/v1/findings",
        "query": { "aircraft": "ac_8f3a", "status": "open" }
      },
      "response": {
        "status": 200,
        "body_shape": {
          "items": [{ "id": "string", "title": "string", "severity": "one_of:minor|major|critical" }],
          "next_cursor": "string|null"
        }
      }
    }
  ]
}
```

*Format simplifié, propre à la plateforme fictive ; les outils de contrat ont leur propre format.*

| Étape | Qui | Quand |
|---|---|---|
| Écrire les attentes | Le consommateur | Dans ses tests |
| Publier le contrat | Le consommateur | À chaque modification |
| Rejouer le contrat | Le fournisseur | À chaque changement de l'API (porte du pipeline, [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité)) |
| Décider d'un changement incompatible | Fournisseur et consommateurs | Avec préavis (voir [20.6 Données de référence et contrat de données](20-gouvernance-donnees-conformite.md#206-données-de-référence-et-contrat-de-données) et [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) |

Les contrats couvrent les **API publiques**, les **webhooks** ([7.5 Webhook](07-evenements-automatisation.md#75-webhook)), les **événements** ([28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité)), les **connecteurs** ([10.9 Connecteurs et adaptateurs](10-api-integrations-extensibilite.md#109-connecteurs-et-adaptateurs)) et les **extensions** ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) : partout où une équipe ou un partenaire dépend d'une forme.

#### Les tests de bout en bout

Ils se réservent aux **parcours critiques** : créer un constat, le clore, le signer ; se connecter par la fédération d'identité ; provisionner un tenant. Ils s'exécutent dans un environnement proche de la production ([21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements)), avec des tenants synthétiques ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)).

| Règle | Raison |
|---|---|
| Peu de parcours, choisis par criticité | Le coût croît vite |
| Par l'API plutôt que par l'interface quand c'est possible | Plus stable et plus rapide |
| Données propres à chaque test | Isolation entre tests |
| Pas de dépendance à des systèmes tiers réels | Variabilité (utiliser des doubles et des contrats) |
| Budget de durée et quarantaine des instables | La suite reste utilisable |

#### Tests instables

La note de Martin Fowler sur le non-déterminisme liste les causes : le manque d'isolation (état partagé entre tests), les comportements asynchrones (attentes fixes), les services distants, le temps (horloge système) et les fuites de ressources. Elle recommande de mettre en **quarantaine** les tests non déterministes dans une suite séparée, de limiter le nombre et la durée de la quarantaine, de les corriger rapidement, d'isoler les tests, de remplacer les attentes fixes par des rappels ou des interrogations avec délai, d'utiliser des doubles stables avec des tests de contrat qui vérifient leur fidélité, et d'envelopper l'horloge pour la contrôler.

#### Modes de défaillance

- **Pyramide inversée** : surtout du bout en bout.
- **Doubles de test infidèles** : ils passent, la réalité échoue.
- **Contrats absents** : changements d'API qui cassent des clients.
- **Contrats trop larges** : ils figent tout.
- **Tests instables ignorés.**
- **Données partagées entre tests.**
- **Durée de la suite sans budget** : elle double chaque semestre.

**Contre-exemple.** Une équipe teste uniquement par des parcours de bout en bout dans l'interface : 400 tests, 3 heures. Un échec sur 8 est instable. Les développeurs relancent, puis finissent par fusionner « quand ça passe une fois ». Une régression réelle passe inaperçue au milieu des échecs de routine.

**Limites.** La pyramide est un principe, pas une formule : une plateforme avec peu de logique et beaucoup d'intégrations peut justifier une forme différente. Les tests de contrat ne couvrent que les interactions déclarées. Et aucune suite ne remplace l'observation de la production.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Les tests forment les portes du pipeline |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Les tests de bout en bout s'exécutent dans un environnement proche de la production |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les tests propres aux plateformes multi-tenant complètent la pyramide |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Le versionnement d'API et les tests de compatibilité |
| [20.6 Données de référence et contrat de données](20-gouvernance-donnees-conformite.md#206-données-de-référence-et-contrat-de-données) | Le contrat de données est testé de la même façon |
| [28.4 Registre de schémas et règles de compatibilité](28-interoperabilite-avancee.md#284-registre-de-schémas-et-règles-de-compatibilité) | Les règles de compatibilité de schémas pour les flux |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Les webhooks ont des contrats |
| [11.17 Planification de capacité](11-securite-fiabilite-operations.md#1117-planification-de-capacité) | Les tests de charge relèvent de la planification de capacité |

### 5. Application pratique

**Situation initiale.** Alpha Air a 500 tests de bout en bout par l'interface, qui durent 2 h 30, avec 10 % d'échecs instables. Une modification de l'API a cassé l'application mobile sans qu'aucun test ne le signale.

**Problème.** Une pyramide inversée et aucun contrat.

**Application du concept.** L'équipe redéploie ses tests selon la pyramide et ajoute des contrats.

**Déroulé.**

1. Elle écrit 1 800 tests unitaires sur le moteur, avec un catalogue de définitions et des cas tabulaires.
2. Elle remplace 300 tests d'interface par des tests au niveau de l'API et 60 contrats consommateur-fournisseur.
3. Elle conserve 25 parcours de bout en bout, sur trois tenants synthétiques.
4. Elle met en quarantaine les 18 tests instables, avec une limite de dix jours, et les corrige.
5. Elle fixe un budget : validation en moins de 10 minutes, bout en bout en moins de 30.

**Résultat.** Le retour tombe de 2 h 30 à 18 minutes, et l'application mobile est protégée par son contrat.

**Limites.** Les contrats des consommateurs externes (partenaires) restent à obtenir : on l'organise par le programme de développeurs ([10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que dit la pyramide de tests, et pourquoi ?
2. **Compréhension.** Qu'est-ce qu'un contrat piloté par le consommateur ?
3. **Compréhension.** Quand justifie-t-on un test de bout en bout ?
4. **Pourquoi.** Pourquoi met-on les tests instables en quarantaine avec une limite de durée ?
5. **Raisonnement pratique.** Un fournisseur veut supprimer un champ que personne n'utilise, à sa connaissance. Comment les contrats l'aident-ils ?

#### Réponses

1. Beaucoup de tests rapides et ciblés à la base, moins d'intégration au milieu, très peu de bout en bout au sommet, parce que plus un test est large, plus il est lent, fragile et difficile à diagnostiquer.
2. Un contrat établi à partir des attentes déclarées par le consommateur, sous forme d'exemples de requêtes et de réponses, que le fournisseur rejoue pour vérifier qu'il ne casse pas ce qui est utilisé.
3. Pour les parcours critiques qui traversent plusieurs composants et dont la défaillance est inacceptable : création, clôture, signature, connexion. Pas pour chaque règle.
4. Pour que les échecs de routine ne masquent pas les vrais, et pour ne pas laisser les tests instables s'installer : la limite oblige à les corriger.
5. Les contrats listent les champs que les consommateurs déclarent utiliser : si le champ figure dans un contrat, sa suppression fait échouer la vérification du fournisseur ; sinon, il peut le retirer, en suivant la politique de dépréciation.

## 21.8 Tests d'isolation multi-tenant, tests de configuration et données de test

### 1. Comprendre simplement

Un **test d'isolation multi-tenant** (*multi-tenant isolation test*) vérifie qu'un tenant ne peut ni lire, ni modifier, ni déduire les données d'un autre, sur tous les chemins d'accès. Un **test de configuration** (*configuration test*) exécute des configurations de tenants (workflows, règles, formulaires, rôles) contre une version de la plateforme pour vérifier qu'elles se comportent comme prévu. La **gestion des données de test** (*test data management*) produit, entretient et protège les données sur lesquelles tous ces tests s'appuient.

**Pourquoi cela existe.** Les défauts les plus graves d'une plateforme multi-tenant ne sont pas des plantages : ce sont des fuites entre tenants, que les tests fonctionnels classiques ne voient pas, parce qu'ils n'utilisent qu'un seul tenant. Et comme le comportement dépend de configurations que les clients écrivent, il faut tester le **moteur appliqué à des configurations**, pas seulement le moteur. Sans bonnes données de test, les deux restent théoriques.

**Problème résolu.** Prouver, avant la livraison, que l'isolation tient et que les configurations existantes continueront de fonctionner.

**Modèle mental.** Un coffre-fort à casiers pour plusieurs clients. On ne se contente pas de vérifier que chaque casier s'ouvre avec sa clé : on essaie, avec la clé du client A, d'ouvrir tous les casiers du client B, par toutes les portes, y compris celles que personne n'utilise.

**Où l'analogie s'arrête.** Un coffre a un nombre fini de portes. Une plateforme en ajoute à chaque fonction : listes, exports, recherche, caches, tâches de fond, journaux. L'inventaire des chemins fait partie du test.

**Exemple.** À chaque version, la plateforme crée deux tenants synthétiques aux données de même forme. Pour chaque route de l'API, le test appelle avec les droits du tenant A en visant des identifiants du tenant B, et vérifie que la réponse est indiscernable de celle d'une ressource inexistante. Il rejoue aussi 140 configurations représentatives contre la nouvelle version.

**Les composants.**

1. les **tenants synthétiques**, au moins deux, de profils variés ;
2. l'**inventaire des chemins d'accès** : routes, recherche, exports, fichiers, caches, tâches ;
3. les **attaques d'isolation** : identifiants croisés, filtres omis ;
4. la **bibliothèque de configurations** représentatives ;
5. les **scénarios** : événements en entrée, effets attendus ;
6. les **générateurs de données** déterministes ;
7. la **protection** des données issues de la production ;
8. le **contrôle de couverture** des chemins.

**Objectif d'apprentissage :** vous pouvez décrire comment tester l'isolation de façon systématique, comment rejouer des configurations contre une nouvelle version, et comment alimenter ces tests en données sûres.

### 2. Connaissances essentielles

#### Définition

- **Test d'isolation multi-tenant** : test qui vérifie, avec au moins deux tenants, qu'aucune opération d'un tenant n'accède aux données d'un autre, ni directement ni par déduction.
- **Test de configuration** : test qui applique des configurations de tenants à une version du moteur et en vérifie la validité et le comportement.
- **Gestion des données de test** : ensemble des pratiques qui créent, entretiennent, isolent, protègent et renouvellent les données utilisées par les tests.

#### Idées fondamentales

1. **L'isolation se teste avec deux tenants.** Un seul ne prouve rien.
2. **On teste tous les chemins.** Un chemin oublié est une fuite.
3. **Une ressource d'un autre tenant « n'existe pas ».** La réponse est identique à celle d'une ressource inexistante.
4. **Le moteur se teste sur des configurations.** Il interprète des définitions.
5. **Une bibliothèque de configurations est un actif.** Elle s'enrichit à chaque incident.
6. **Les données de test sont synthétiques et déterministes.** Elles se régénèrent à l'identique.
7. **La couverture des chemins se vérifie.** Une nouvelle route sans test d'isolation fait échouer le pipeline.

#### Vocabulaire essentiel

- **Chemin d'accès** (*access path*) : toute voie par laquelle une donnée peut être lue ou modifiée.
- **Identifiant croisé** (*cross-tenant identifier*) : identifiant d'une ressource d'un autre tenant, utilisé dans une requête.
- **Canal auxiliaire** (*side channel*) : information révélée indirectement (différence de réponse, de délai, de compteur).
- **Configuration de référence** (*golden configuration*) : configuration représentative conservée pour les tests.
- **Test de non-régression** (*regression test*) : test qui vérifie qu'un comportement validé ne change pas.
- **Générateur déterministe** (*seeded generator*) : générateur de données qui produit le même résultat pour la même graine.
- **Sous-ensemble référentiel** (*subsetting*) : extraction d'une partie cohérente d'un jeu de données.
- **Fabrique de données** (*test data factory*) : fonction qui construit des objets de test valides avec des valeurs par défaut.

#### Relations de cause à effet

- Les tests n'utilisent qu'un tenant : un filtre de tenant oublié n'est jamais détecté.
- Une route de l'API répond 403 pour une ressource d'un autre tenant et 404 pour une inexistante : la différence révèle l'existence.
- Les configurations des clients ne sont pas rejouées : une évolution du moteur casse un workflow qu'un client a écrit.
- Les données de test viennent de la production : une fuite de données personnelles dans un environnement peu protégé.
- Les données sont créées à la main et se dégradent : les tests deviennent non reproductibles.

#### Idées reçues

- **« Les tests fonctionnels couvrent l'isolation. »** Non. Ils vérifient ce qu'un utilisateur peut faire, pas ce qu'un autre tenant ne peut **pas** faire.
- **« Une erreur d'accès interdit est plus claire pour l'utilisateur. »** Elle révèle l'existence de la ressource : pour une ressource d'un autre tenant, la réponse « introuvable » est plus sûre.
- **« On peut tester avec une copie de la production. »** Pas sans protection : elle contient des données personnelles (voir [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)).

#### Principe clé

L'isolation se prouve en essayant d'accéder, avec un tenant, à tout ce qui appartient à un autre, par tous les chemins ; les configurations se rejouent contre chaque version ; les données de test sont synthétiques, déterministes et protégées.

#### Si vous ne retenez que trois choses

1. Deux tenants, tous les chemins, des identifiants croisés, et des réponses indiscernables de « introuvable ».
2. Le moteur se teste sur des configurations réelles ou représentatives, avec des scénarios attendus.
3. Les données de test se génèrent de façon déterministe ; on ne copie pas la production sans anonymisation.

### 3. Explication technique détaillée

#### Les tests d'isolation

L'isolation s'applique à chaque couche (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)) : il faut donc un test par chemin.

| Chemin | Attaque simulée | Résultat attendu |
|---|---|---|
| Lecture par identifiant | Requête avec l'identifiant d'une ressource du tenant B | Réponse indiscernable de « introuvable » |
| Liste et filtres | Filtre sur un champ ou paramètre omis | Aucune ressource de B |
| Recherche et suggestions | Termes uniques à B ([19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits)) | Aucun résultat ni suggestion de B |
| Facettes et compteurs | Décomptes | Décomptes sans les éléments de B |
| Exports et rapports | Export complet par A | Aucune ligne de B ([19.11 Formats d'export, gouvernance des définitions, reproductibilité et fraîcheur des chiffres](19-recherche-analytique-restitution.md#1911-formats-dexport-gouvernance-des-définitions-reproductibilité-et-fraîcheur-des-chiffres)) |
| Fichiers | Téléchargement avec l'identifiant d'un fichier de B ([18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants)) | Refus indiscernable |
| Caches | Même clé logique, deux tenants ([22.3 Mise en cache](22-performance-echelle-economie.md#223-mise-en-cache)) | Pas de réponse mélangée |
| Tâches et événements | Message d'un tenant traité dans le contexte d'un autre | Contexte propre à chaque message |
| Webhooks et notifications | Destinataires | Seulement le tenant concerné |
| Journaux | Contenu d'un journal visible par A | Aucune donnée de B |
| Messages d'erreur | Différence de message ou de délai | Aucun indice sur l'existence |

La règle de réponse est : une ressource d'un autre tenant produit **exactement** la réponse d'une ressource qui n'existe pas (même code, même forme, durée comparable).

```typescript
interface Route {
  method: "GET" | "PATCH" | "DELETE";
  path: string;
}

interface CallResult {
  status: number;
  bodyShape: string;
}

interface ApiClient {
  asTenantA: {
    call(route: Route, params: { id: string }): Promise<CallResult>;
  };
}

const MISSING_ID = "00000000-0000-0000-0000-000000000000";

async function assertIsolated(
  route: Route,
  tenantBResourceId: string,
  client: ApiClient,
): Promise<void> {
  const crossTenant = await client.asTenantA.call(route, { id: tenantBResourceId });
  const missing = await client.asTenantA.call(route, { id: MISSING_ID });
  if (crossTenant.status !== missing.status || crossTenant.bodyShape !== missing.bodyShape) {
    throw new Error(`Fuite possible : ${route.method} ${route.path}`);
  }
}
```

**Générer les tests depuis l'inventaire.** La liste des routes vient de la description de l'API ([10.1 API et REST](10-api-integrations-extensibilite.md#101-api-et-rest)), pas d'une liste écrite à la main. Un **test de couverture** vérifie que chaque route a son test d'isolation : une nouvelle route sans test fait échouer le pipeline. Le même principe s'applique aux tâches, aux requêtes de recherche et aux exports.

**Au-delà de l'API.** On teste aussi la **base** : si l'isolation repose sur des politiques de ligne ([19.9 Agrégats matérialisés, analytique en libre-service, analytique embarquée et sécurité par ligne](19-recherche-analytique-restitution.md#199-agrégats-matérialisés-analytique-en-libre-service-analytique-embarquée-et-sécurité-par-ligne)), un test exécute des requêtes avec le rôle d'application et le paramètre de tenant d'un autre, et vérifie le refus. Pour l'isolation de **performance**, des tests de charge vérifient qu'un tenant « chaud » ne dégrade pas les autres ([22.8 Limites de concurrence par tenant, files équitables, classes de priorité et nivellement de charge](22-performance-echelle-economie.md#228-limites-de-concurrence-par-tenant-files-équitables-classes-de-priorité-et-nivellement-de-charge)).

#### Les tests de configuration

Le moteur est générique ; son comportement dépend des définitions. Les tests de configuration comptent trois familles :

| Famille | Question | Exemple |
|---|---|---|
| Validité | La configuration est-elle acceptée par la nouvelle version ? | Schéma de la définition, références, expressions |
| Comportement | Les scénarios donnent-ils les effets attendus ? | « Un constat critique immobilise l'aéronef » |
| Régression | Une différence apparaît-elle entre l'ancienne et la nouvelle version ? | Comparer les sorties sur un jeu de scénarios |

```yaml
scenario: finding_critical_grounds_aircraft
configuration: pack:aviation_maintenance@7
given:
  aircraft: { id: ac_8f3a, status: in_service }
  finding: { id: fd_204, severity: critical, status: open }
when:
  event: finding.critical
then:
  transitions:
    - { resource: aircraft, id: ac_8f3a, to: grounded }
  notifications:
    - { audience: "role:quality_manager", count_at_least: 1 }
```

**La bibliothèque de configurations.** Elle rassemble des configurations de référence : paquets livrés ([23.1 Paquet de solution, manifeste et dépendances](23-solutions-verticales-packagees.md#231-paquet-de-solution-manifeste-et-dépendances)), configurations de tenants synthétiques, et, avec leur accord et après anonymisation, des configurations représentatives de clients. Chaque version de la plateforme les rejoue : validité, scénarios, comparaison des sorties avec la version précédente. Un écart de comportement non annoncé est un défaut du moteur, pas de la configuration.

C'est le contrôle qui rend sûre la promesse de ne pas casser les configurations des clients ([13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code)) et alimente la stratégie de personnalisation durable ([23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](23-solutions-verticales-packagees.md#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)).

#### Les données de test

| Besoin | Approche |
|---|---|
| Profils de tenants | Petit, grand, réglementé, « chaud » ([22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud)) : des tenants synthétiques aux distributions réalistes |
| Reproductibilité | Générateur déterministe : même graine, mêmes données |
| Indépendance des tests | Chaque test crée ses données (fabriques) et ne dépend pas des autres |
| Volume | Jeux de grande taille régénérés à la demande pour la performance |
| Temps | Horloge contrôlable, dates relatives |
| Intégrité | Relations cohérentes (sous-ensembles référentiels) |
| Confidentialité | Pas de données personnelles réelles ; si extrait de production : anonymisation vérifiée ([20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation)) |

```typescript
let counter = 0;

function uid(prefix: string): string {
  counter += 1;
  return `${prefix}_${String(counter).padStart(6, "0")}`;
}

interface Finding {
  id: string;
  tenantId: string;
  severity: "minor" | "major" | "critical";
  status: "open" | "closed";
}

function makeFinding(tenantId: string, overrides: Partial<Finding> = {}): Finding {
  return { id: uid("fd"), tenantId, severity: "minor", status: "open", ...overrides };
}
```

Une fabrique fournit des **valeurs valides par défaut** et laisse le test préciser seulement ce qui compte : le test reste lisible.

**Cycle de vie des données.** Les données de test évoluent avec le modèle : un changement de schéma impose de mettre à jour les générateurs ([2.18 Évolution et versionnement de schéma](02-donnees-ressources.md#218-évolution-et-versionnement-de-schéma)). Elles sont versionnées avec le code. Les environnements éphémères reçoivent leur jeu à la création, et le détruisent avec eux ([21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements)).

#### Modes de défaillance

- **Un seul tenant dans les tests.**
- **Chemins non couverts** : route récente, export, tâche de fond.
- **Réponses différentes** pour « interdit » et « inexistant ».
- **Configurations jamais rejouées.**
- **Données de production en test.**
- **Données partagées entre tests** : ordre d'exécution qui compte.
- **Générateurs figés** : le modèle a changé, pas les données.

**Contre-exemple.** Une nouvelle fonction d'export est ajoutée avec un filtre de tenant correct dans l'interface, mais sa tâche de fond lit directement une table sans le contexte de tenant. Les tests fonctionnels passent. Un client reçoit dans son export des lignes d'un autre. Un test d'isolation généré depuis l'inventaire des tâches l'aurait détecté avant la livraison.

**Limites.** Aucun test ne prouve l'absence de fuite : il démontre l'absence de celles qu'il cherche. Les tests d'isolation sont complétés par la conception (isolation à plusieurs couches), la revue, et la surveillance. Les bibliothèques de configurations clients demandent un cadre contractuel et d'anonymisation. Et un volume réaliste est coûteux à maintenir.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation à tester couche par couche |
| [19.5 Index par tenant et recherche sensible aux droits](19-recherche-analytique-restitution.md#195-index-par-tenant-et-recherche-sensible-aux-droits) | Recherche, suggestions et facettes à tester |
| [18.5 Autorisation de téléchargement et liens expirants](18-fichiers-documents-contenus.md#185-autorisation-de-téléchargement-et-liens-expirants) | Téléchargements à tester |
| [20.3 Calendrier de conservation, pseudonymisation et anonymisation](20-gouvernance-donnees-conformite.md#203-calendrier-de-conservation-pseudonymisation-et-anonymisation) | Anonymisation des données issues de la production |
| [21.3 Parité et éphémérité des environnements](#213-parité-et-éphémérité-des-environnements) | Les environnements éphémères reçoivent des données synthétiques |
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Ces tests complètent la pyramide |
| [8.5 Administration du comportement](08-admin-control-plane.md#85-administration-du-comportement) | La simulation de configuration est la version interactive du test de configuration |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Ne pas casser les configurations est une promesse à tenir |
| [22.1 Modèle de charge, distribution des tailles de tenants et tenant chaud](22-performance-echelle-economie.md#221-modèle-de-charge-distribution-des-tailles-de-tenants-et-tenant-chaud) | Les profils de tenants synthétiques suivent la distribution des tailles |

### 5. Application pratique

**Situation initiale.** Un audit de sécurité d'Alpha Air a trouvé deux fuites entre tenants (une suggestion de recherche et un export) que les tests n'avaient pas vues. Par ailleurs, une mise à jour du moteur a modifié le comportement d'un workflow client, sans que personne ne l'anticipe.

**Problème.** Aucun test systématique d'isolation ni de configuration, et des données de test insuffisantes.

**Application du concept.** La plateforme introduit des tests générés d'isolation, une bibliothèque de configurations et des données synthétiques déterministes.

**Déroulé.**

1. Deux tenants synthétiques sont créés à chaque exécution, avec des données de même forme et des identifiants distincts.
2. Les tests d'isolation sont générés à partir de l'inventaire des routes, des requêtes de recherche, des exports et des tâches.
3. Une porte du pipeline vérifie que chaque chemin possède son test.
4. 140 configurations (paquets livrés et configurations synthétiques) sont rejouées à chaque version, avec comparaison des sorties.
5. Les générateurs déterministes remplacent les extraits de production.

**Résultat.** Les deux fuites sont reproduites par des tests permanents, et un écart de comportement du moteur est détecté avant la livraison.

**Limites.** Les configurations les plus spécifiques restent hors de la bibliothèque : on les couvre par la simulation du client avant publication ([12.16 Configuration sûre](12-produit-ux.md#1216-configuration-sûre)).

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi faut-il au moins deux tenants pour tester l'isolation ?
2. **Compréhension.** Quelle réponse doit-on obtenir en demandant une ressource d'un autre tenant, et pourquoi ?
3. **Compréhension.** Quelles sont les trois familles de tests de configuration ?
4. **Pourquoi.** Pourquoi utiliser un générateur de données déterministe ?
5. **Raisonnement pratique.** Une nouvelle tâche de fond est ajoutée à la plateforme. Quelle porte du pipeline évite qu'elle livre sans test d'isolation ?

#### Réponses

1. Parce que l'isolation est l'absence d'accès à ce qui appartient à un autre : avec un seul tenant, il n'y a rien à ne pas voir, et un filtre oublié ne produit aucun défaut visible.
2. Une réponse indiscernable de celle d'une ressource inexistante (même code, même forme). Une réponse « interdit » révélerait l'existence de la ressource.
3. La validité (la configuration est acceptée), le comportement (les scénarios produisent les effets attendus) et la régression (les sorties ne changent pas sans annonce entre deux versions).
4. Pour que les tests soient reproductibles : même graine, mêmes données, donc un échec peut être rejoué et diagnostiqué.
5. Un test de couverture alimenté par l'inventaire des tâches : il échoue si une tâche n'a pas de test d'isolation associé.

## 21.9 Tests de sécurité dans le pipeline

### 1. Comprendre simplement

Les **tests de sécurité dans le pipeline** (*security testing in the pipeline*) regroupent les contrôles automatiques de sécurité exécutés à chaque changement : recherche de secrets, analyse du code, analyse des dépendances, analyse de la configuration d'infrastructure, tests dynamiques de l'application en fonctionnement. Ils déplacent la découverte des failles vers le moment où le changement est encore petit et facile à corriger.

**Pourquoi cela existe.** Une faille trouvée en production coûte cher : incident, notification, correctif en urgence. Trouvée quand le développeur écrit le code, elle coûte une correction de quelques minutes. Et la surface d'une plateforme croît avec chaque fonction, chaque dépendance, chaque extension : le contrôle manuel ne suit pas.

**Problème résolu.** Détecter les failles connues de façon systématique, avant la production, sans ralentir la livraison.

**Modèle mental.** Les détecteurs d'un aéroport, placés à plusieurs étapes : un premier à l'entrée du bâtiment (secrets), un autre au contrôle de sûreté (code, dépendances), un autre à l'embarquement (application en fonctionnement). Chacun voit autre chose, aucun ne voit tout.

**Où l'analogie s'arrête.** Un détecteur cherche des objets connus. Les failles de logique et d'autorisation, propres à la plateforme, demandent des tests d'isolation ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) et des revues, et certaines ne se trouvent que par des tests d'intrusion menés par des personnes.

**Exemple.** Une développeuse d'Alpha Air ajoute une dépendance. Le pipeline détecte qu'elle embarque une vulnérabilité connue de gravité élevée et bloque la fusion. Un autre changement contient, par erreur, une clé d'API : le contrôle de secrets l'arrête avant la publication du dépôt.

**Les composants.**

1. la **recherche de secrets** dans le code et l'historique ;
2. l'**analyse statique** du code ;
3. l'**analyse des dépendances** ;
4. l'**analyse de l'infrastructure en code** ;
5. l'**analyse des images** de conteneurs ;
6. les **tests dynamiques** sur un environnement en fonctionnement ;
7. les **seuils**, exceptions et délais de correction ;
8. la **provenance** et la signature des artefacts.

**Objectif d'apprentissage :** vous pouvez décrire les familles de tests de sécurité, dire où les placer dans le pipeline, et définir une politique de seuils et d'exceptions.

### 2. Connaissances essentielles

#### Définition

- **Tests de sécurité dans le pipeline** : ensemble de contrôles automatiques de sécurité exécutés à des étapes précises de la chaîne de livraison, dont les résultats conditionnent le passage des changements.

#### Idées fondamentales

1. **Plusieurs techniques, plusieurs failles.** Aucune ne couvre tout.
2. **À gauche.** Plus on détecte tôt, moins la correction coûte.
3. **Le bon contrôle à la bonne étape.** Rapide au début, lourd plus tard.
4. **Un seuil, pas un voyant.** Une gravité bloque, une autre avertit.
5. **Les exceptions sont datées.** Avec propriétaire et échéance (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).
6. **Le bruit se gère.** Les faux positifs fatiguent et font contourner.
7. **La chaîne elle-même est protégée.** Secrets du pipeline, provenance, droits (voir [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable)).

#### Vocabulaire essentiel

- **Analyse statique** (*static application security testing*, SAST) : analyse du code source ou compilé, sans l'exécuter, pour y trouver des failles.
- **Analyse de composition logicielle** (*software composition analysis*, SCA) : inventaire des composants tiers et recherche de vulnérabilités connues.
- **Test dynamique** (*dynamic application security testing*, DAST) : test d'une application en fonctionnement, par l'extérieur.
- **Test interactif** (*interactive application security testing*, IAST) : test qui observe l'application de l'intérieur pendant son exécution.
- **Recherche de secrets** (*secret scanning*) : détection d'identifiants et de clés dans les dépôts.
- **Analyse de l'infrastructure en code** (*IaC scanning*) : détection de mauvaises configurations dans les définitions d'infrastructure.
- **Vulnérabilité connue** (*known vulnerability*, CVE) : défaut publié avec un identifiant.
- **Faux positif** (*false positive*) : alerte à tort.

#### Relations de cause à effet

- Aucun contrôle de dépendances : une bibliothèque vulnérable arrive en production sans que personne le sache.
- Les secrets sont détectés seulement en production : ils ont déjà été copiés avec le dépôt.
- Tous les résultats bloquent : les développeurs les contournent, ou désactivent l'outil.
- Aucun résultat ne bloque : les alertes s'accumulent, personne ne les lit.
- Seul le code applicatif est analysé : une règle d'infrastructure ouvre un stockage au public.

#### Idées reçues

- **« Un outil de sécurité automatique suffit. »** Non. L'OWASP note que l'analyse statique ne détecte qu'une part relativement faible des failles, qu'elle produit beaucoup de faux positifs, et qu'elle voit mal les problèmes d'authentification, de contrôle d'accès et de configuration.
- **« Les tests dynamiques remplacent l'analyse statique. »** Non. Ils voient autre chose : l'application en fonctionnement, pas le code.
- **« Tout bloquer est plus sûr. »** Non. Un pipeline qui bloque pour du bruit est contourné.

#### Principe clé

Chaque famille de contrôles de sécurité se place à l'étape où elle est la plus utile, avec des seuils mesurables, des exceptions datées et une gestion du bruit, et se complète par des tests propres à la plateforme.

#### Si vous ne retenez que trois choses

1. Secrets, code, dépendances, infrastructure, images, application en fonctionnement : chaque famille voit un type de faille.
2. Les contrôles rapides tôt, les lourds plus tard, avec des seuils et des exceptions datées.
3. Les automatismes ne remplacent ni les tests d'isolation, ni la revue, ni les tests d'intrusion.

### 3. Explication technique détaillée

#### Un cadre de pratiques

Le cadre de développement logiciel sécurisé du NIST (SSDF, publication SP 800-218, version 1.1) fournit un ensemble de pratiques fondamentales, issues de guides établis, pour réduire les vulnérabilités des logiciels livrés et limiter l'effet de celles qui passent inaperçues. Il est organisé en quatre groupes : préparer l'organisation, protéger le logiciel contre l'altération et les accès non autorisés, produire un logiciel bien sécurisé, et répondre aux vulnérabilités. Les contrôles automatiques du pipeline relèvent surtout des deux groupes du milieu ; la réponse aux vulnérabilités relève de la gestion des vulnérabilités ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)).

#### Les familles de contrôles

| Famille | Ce qu'elle cherche | Étape | Atouts | Limites |
|---|---|---|---|---|
| Recherche de secrets | Clés, mots de passe, jetons dans les dépôts | Avant la fusion ; sur l'historique | Rapide, très utile | Faux positifs sur des valeurs d'exemple |
| Analyse statique (SAST) | Failles connues dans le code (injection, etc.) | Validation | Passe à l'échelle, indique le fichier et la ligne | Beaucoup de faux positifs ; mal adaptée aux défauts d'autorisation et de configuration |
| Composition logicielle (SCA) | Dépendances vulnérables ou à licence problématique | Validation, puis en continu | Détecte les vulnérabilités publiées | Ne voit que le connu ; dépend de la base de vulnérabilités |
| Infrastructure en code | Mauvaises configurations (stockage public, ports ouverts) | Validation | Prévient les erreurs avant l'application | Règles à entretenir |
| Images de conteneurs | Vulnérabilités du système et des paquets embarqués | Paquetage | Couvre ce qui est livré | Bruit si les images sont lourdes |
| Test dynamique (DAST) | Failles visibles de l'extérieur : en-têtes, injections, configuration | Acceptation, sur un environnement éphémère | Voit l'application réelle | Lent, couverture limitée |
| Test interactif (IAST) | Failles observées pendant l'exécution des tests | Acceptation | Moins de faux positifs | Instrumentation à gérer |
| Tests d'isolation et d'autorisation | Fuites entre tenants, contournement de droits | Validation et acceptation ([21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test)) | Propres à la plateforme | À maintenir avec les chemins |

La documentation de l'OWASP décrit le guide d'un pipeline sécurisé comme couvrant la recherche de secrets (détecter des fuites potentielles d'identifiants dans les dépôts), l'analyse statique, l'analyse de composition, les tests dynamiques, les tests interactifs et l'analyse du code d'infrastructure (détecter des mauvaises configurations dans des définitions d'infrastructure). L'outil Dependency-Check, de la même organisation, illustre l'analyse de composition : il inventorie les bibliothèques tierces et signale celles qui ont des failles connues, avec les entrées correspondantes dans une base publique de vulnérabilités.

#### Où les placer

```text
poste du développeur : secrets (avant commit), analyse statique légère
validation (10 min)   : secrets sur le dépôt, analyse statique, dépendances, infra en code, tests d'isolation
paquetage             : analyse de l'image, signature, provenance
acceptation           : test dynamique sur l'environnement éphémère, tests d'autorisation
production            : surveillance des vulnérabilités nouvelles sur les composants déployés
```

Une dépendance saine aujourd'hui peut être déclarée vulnérable demain : l'analyse de composition se **rejoue en continu** sur ce qui est déployé, pas seulement à la construction (voir [18.4 Validation, analyse antimalware et quarantaine](18-fichiers-documents-contenus.md#184-validation-analyse-antimalware-et-quarantaine) pour la même idée sur les fichiers).

#### Politique de seuils et d'exceptions

```json
{
  "security_gates": [
    { "id": "secrets", "stage": "validation", "block_on": "any" },
    { "id": "sast", "stage": "validation", "block_on": "new_critical_or_high", "baseline": "existing_findings_excluded" },
    { "id": "sca", "stage": "validation", "block_on": "critical_with_fix_available", "warn_on": "high" },
    { "id": "iac", "stage": "validation", "block_on": "public_exposure_or_missing_encryption" },
    { "id": "image", "stage": "package", "block_on": "critical" },
    { "id": "dast", "stage": "acceptance", "block_on": "high", "target": "ephemeral_environment" }
  ],
  "exceptions": {
    "requires": ["finding_id", "justification", "compensating_control", "approver", "expires_at"],
    "max_duration_days": 30
  },
  "remediation_sla_days": { "critical": 7, "high": 30, "medium": 90 }
}
```

*Les délais et les seuils sont des valeurs d'exemple.*

| Règle | Raison |
|---|---|
| Bloquer sur les **nouveaux** défauts graves | Ne pas bloquer toute l'équipe sur la dette existante |
| Distinguer « avec correctif disponible » | Un blocage sans issue est contourné |
| Exceptions limitées dans le temps | Le contournement ne devient pas permanent |
| Délais de correction par gravité | Les défauts anciens se traitent |
| Suivi des faux positifs | L'outil se règle plutôt que d'être ignoré |

#### Les secrets : un cas à part

Un secret commis dans un dépôt est compromis dès qu'il est publié ou copié, même s'il est retiré du fichier ensuite. La règle : détecter **avant** la fusion, et traiter toute détection comme une **rotation** de secret ([11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés)), pas comme un simple retrait. Les secrets du pipeline lui-même (jetons de déploiement) sont à portée limitée et de courte durée.

#### La chaîne d'approvisionnement

Les dépendances et les outils sont une partie du produit. Le cadre SLSA propose des niveaux de garantie sur la fabrication des artefacts, avec la provenance. Une plateforme qui distribue des extensions et des paquets de solution ([10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés), [23.6 Distribution et signature des paquets](23-solutions-verticales-packagees.md#236-distribution-et-signature-des-paquets)) applique les mêmes contrôles à ce qu'elle reçoit : analyse, signature, vérification de la provenance, et possibilité de désactivation à distance ([10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)).

#### Ce que le pipeline ne remplace pas

- la **modélisation des menaces** ([11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces)), qui oriente les contrôles ;
- les **revues** de code sensibles (droits, chiffrement) ;
- les **tests d'intrusion** périodiques, menés par des personnes ;
- la **gestion des vulnérabilités** en production ([11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)) et la **gestion des incidents** ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) ;
- les **programmes de signalement** de failles par des chercheurs externes.

#### Modes de défaillance

- **Contrôles seulement en fin de cycle.**
- **Tout bloque** ou **rien ne bloque**.
- **Alertes sans propriétaire** : elles s'accumulent.
- **Secrets retirés sans rotation.**
- **Pipeline compromis** : un jeton de déploiement à portée large.
- **Analyse de dépendances au moment de la construction seulement.**
- **Faux sentiment de sécurité** : outils au vert, failles d'autorisation présentes.

**Contre-exemple.** Une équipe active tous les contrôles en mode bloquant sur le code existant : 3 200 alertes. Les développeurs obtiennent de l'équipe sécurité une désactivation générale « le temps de nettoyer ». Un an plus tard, les contrôles sont toujours désactivés. Il fallait un état de référence, bloquer sur le nouveau, et planifier la réduction de l'existant par gravité.

**Limites.** Les outils automatiques ne voient que les familles de défauts qu'ils modélisent. Ils demandent du réglage et de l'entretien. Les failles de logique métier, d'autorisation et d'isolation se trouvent par la conception, les tests propres à la plateforme et la revue. Et le délai de correction dépend de l'organisation, pas de l'outil.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](11-securite-fiabilite-operations.md#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | Le cycle de développement sécurisé et la gestion des vulnérabilités |
| [11.2 Modélisation des menaces](11-securite-fiabilite-operations.md#112-modélisation-des-menaces) | La modélisation des menaces oriente les contrôles |
| [11.4 Secrets et gestion des clés](11-securite-fiabilite-operations.md#114-secrets-et-gestion-des-clés) | Les secrets détectés sont à remplacer |
| [21.1 Intégration continue et artefact de build immuable](#211-intégration-continue-et-artefact-de-build-immuable) | La provenance et la signature de l'artefact |
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Les contrôles de sécurité sont des portes du pipeline |
| [21.8 Tests d'isolation multi-tenant, tests de configuration et données de test](#218-tests-disolation-multi-tenant-tests-de-configuration-et-données-de-test) | Les tests d'isolation et d'autorisation complètent les outils |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Les exceptions sont tracées et datées |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les extensions reçues se contrôlent comme le reste |
| [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace) | La désactivation à distance d'une extension vulnérable |

### 5. Application pratique

**Situation initiale.** Alpha Air a découvert une clé d'API dans l'historique d'un dépôt et une bibliothèque vulnérable embarquée depuis 14 mois. Les contrôles de sécurité n'ont lieu qu'à la fin de l'année, par un audit externe.

**Problème.** Aucun contrôle automatique de sécurité dans la chaîne.

**Application du concept.** La plateforme intègre des contrôles à plusieurs étapes, avec des seuils et des exceptions.

**Déroulé.**

1. La recherche de secrets s'exécute avant le commit et sur le dépôt ; toute détection déclenche une rotation.
2. L'analyse statique, l'analyse de dépendances et l'analyse de l'infrastructure s'exécutent dans la validation, avec blocage sur les nouveaux défauts graves.
3. L'image est analysée, signée, et sa provenance enregistrée.
4. Un test dynamique s'exécute sur l'environnement éphémère ; les tests d'isolation complètent.
5. Chaque nuit, la liste des composants déployés est confrontée aux nouvelles vulnérabilités publiées.

**Résultat.** Les nouvelles failles graves sont arrêtées avant la fusion, les vulnérabilités publiées après coup sont repérées en 24 heures, et les exceptions sont limitées à 30 jours.

**Limites.** L'audit externe annuel et les tests d'intrusion restent nécessaires pour les failles de logique.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles familles de contrôles de sécurité place-t-on dans un pipeline ?
2. **Compréhension.** Pourquoi l'analyse de dépendances doit-elle être rejouée en continu ?
3. **Compréhension.** Que faut-il faire quand un secret est détecté dans un dépôt ?
4. **Pourquoi.** Pourquoi bloquer sur les nouveaux défauts plutôt que sur tous ?
5. **Raisonnement pratique.** Une exception est demandée pour une vulnérabilité critique sans correctif disponible. Quelles conditions poser ?

#### Réponses

1. Recherche de secrets, analyse statique, analyse de composition (dépendances), analyse de l'infrastructure en code, analyse des images, tests dynamiques et interactifs, auxquels s'ajoutent les tests d'isolation et d'autorisation propres à la plateforme.
2. Parce qu'une vulnérabilité est découverte après le déploiement : une dépendance saine aujourd'hui peut être vulnérable demain. L'analyse à la construction ne suffit pas.
3. Considérer le secret comme compromis et le remplacer (rotation), puis retirer et examiner l'usage éventuel ; retirer la valeur du fichier ne suffit pas.
4. Parce que bloquer sur toute la dette existante paralyse les équipes et pousse à désactiver les contrôles. Bloquer sur le nouveau empêche d'aggraver, et la dette se réduit selon un plan par gravité.
5. Une justification, une mesure compensatoire (désactivation de la fonction, filtrage), un approbateur de sécurité, une échéance courte avec revue, un suivi du correctif amont, et une trace dans le journal.

## 21.10 Gestion des versions et mesures de livraison

### 1. Comprendre simplement

La **gestion des versions** (*release management*) coordonne ce qui est mis en production, quand, pour qui, et comment les personnes concernées en sont informées : numérotation des versions, notes de version, calendrier, fenêtres de gel, versions d'urgence, compatibilités. Les **mesures de livraison** (*delivery metrics*) sont les indicateurs qui disent si la chaîne de livraison est rapide et fiable : délai de mise en production, fréquence des déploiements, taux d'échec, temps de rétablissement.

**Pourquoi cela existe.** Une plateforme livrée en continu change tous les jours. Les clients, les équipes de support, les partenaires d'intégration ont besoin de savoir ce qui change et quand, et de pouvoir s'y préparer. Et la direction technique a besoin de savoir si l'ingénierie s'améliore, sans s'en remettre à l'impression des équipes.

**Problème résolu.** Rendre le changement prévisible pour ceux qui le subissent, et mesurable pour ceux qui le pilotent.

**Modèle mental.** Un horaire de transport et un tableau de bord de ponctualité. L'horaire dit ce qui part, quand et pour où ; le tableau de bord dit si les trains partent à l'heure et combien sont retardés ou annulés.

**Où l'analogie s'arrête.** Un horaire est annoncé à l'avance. Une plateforme livrée en continu change plus souvent que ses clients ne lisent les annonces : on distingue les changements qui demandent une communication de ceux qui n'en demandent pas. Et le tableau de bord de ponctualité doit se garder d'être utilisé comme une cible.

**Exemple.** Alpha Air publie chaque semaine un résumé des changements visibles pour les clients, annonce 30 jours à l'avance le retrait d'un champ d'API, et évite les mises en production sensibles pendant la semaine de l'audit annuel de ses grands clients. L'équipe suit, par mois, 38 déploiements, un délai médian de mise en production de 28 heures et un taux d'échec de 7,9 %.

**Les composants.**

1. la **politique de versions** : numérotation, compatibilité, support ;
2. les **notes de version** et le **journal des changements** ;
3. le **calendrier** et les **périodes de gel** ;
4. les **versions d'urgence** et leurs règles ;
5. la **communication** aux clients et aux partenaires ;
6. le **registre des mises en production** : quoi, quand, par qui, quelles portes ;
7. les **mesures** : délai, fréquence, échec, rétablissement ;
8. l'**usage des mesures** : amélioration, pas sanction.

**Objectif d'apprentissage :** vous pouvez décrire une politique de versions pour une plateforme livrée en continu, définir les mesures de livraison de référence, et dire comment les utiliser sans les détourner.

### 2. Connaissances essentielles

#### Définition

- **Gestion des versions** : ensemble des pratiques qui planifient, coordonnent, contrôlent et communiquent les mises en production de logiciel.
- **Mesures de livraison** : indicateurs quantitatifs de la performance de la chaîne de livraison : débit (délai, fréquence, rétablissement) et stabilité (échec, reprises).

#### Idées fondamentales

1. **Une version a une identité.** Un numéro ou un identifiant, des notes, une trace de ses portes.
2. **Tout changement ne se communique pas de la même façon.** Ce qui est invisible, ce qui est visible, ce qui est incompatible.
3. **Un calendrier tient compte des clients.** Gels, fenêtres de maintenance, saisons d'audit.
4. **Une version d'urgence suit les mêmes portes essentielles.**
5. **On mesure le débit et la stabilité ensemble.** Aller vite en cassant, ou être stable en n'avançant pas : deux échecs.
6. **Les mesures décrivent une équipe, pas des individus.** Et se comparent à elles-mêmes dans le temps.
7. **Une mesure devenue cible se déforme.** On l'utilise pour comprendre, pas pour punir.

#### Vocabulaire essentiel

- **Versionnement sémantique** (*semantic versioning*) : numérotation `majeur.mineur.correctif` qui signale les ruptures (voir [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)).
- **Notes de version** (*release notes*) : description des changements d'une version à l'intention des utilisateurs.
- **Période de gel** (*freeze window*) : période pendant laquelle on évite les mises en production à risque.
- **Version d'urgence** (*hotfix*) : version livrée hors calendrier pour traiter un défaut grave.
- **Délai de mise en production** (*change lead time*) : durée entre l'enregistrement d'un changement dans le dépôt et son exécution en production.
- **Fréquence de déploiement** (*deployment frequency*) : nombre de déploiements sur une période.
- **Taux d'échec des changements** (*change fail rate*) : part des déploiements qui exigent une intervention immédiate.
- **Temps de rétablissement après un déploiement raté** (*failed deployment recovery time*) : durée pour rétablir le service après un déploiement qui a échoué.
- **Taux de reprises** (*deployment rework rate*) : part des déploiements non planifiés, déclenchés par un incident de production.

#### Relations de cause à effet

- Les changements incompatibles sont annoncés tard : les clients découvrent une rupture en production.
- Aucune période de gel : une mise en production sensible tombe pendant la clôture comptable d'un grand client.
- Les mesures sont fixées en objectifs d'équipe : on découpe artificiellement les changements pour gonfler la fréquence.
- On mesure seulement la vitesse : la stabilité se dégrade, les incidents s'accumulent.
- Les versions d'urgence contournent les portes : le taux de reprises augmente.

#### Idées reçues

- **« Une plateforme en SaaS n'a plus besoin de gestion des versions. »** Non. Elle livre plus souvent, ce qui augmente le besoin de communication, de compatibilité et de traçabilité.
- **« Plus de déploiements, c'est mieux, quoi qu'il arrive. »** Non. La fréquence ne vaut qu'avec une stabilité acceptable : les mesures se lisent ensemble.
- **« Les mesures servent à classer les équipes. »** Non. Elles servent à repérer ce qui freine et à vérifier qu'un changement de pratique améliore.

#### Principe clé

Les versions sont identifiées, communiquées et tracées à la mesure de leur impact sur les clients ; la chaîne de livraison se mesure par le débit et la stabilité ensemble, pour s'améliorer, pas pour classer.

#### Si vous ne retenez que trois choses

1. Chaque version a une identité, des notes et un historique de portes ; les ruptures sont annoncées à l'avance.
2. Les mesures de référence combinent débit (délai, fréquence, rétablissement) et stabilité (échec, reprises).
3. Une mesure qui devient une cible se déforme : on l'utilise pour comprendre.

### 3. Explication technique détaillée

#### Politique de versions d'une plateforme

Une plateforme à production unique (tous les tenants sur la même version) se distingue d'un logiciel livré à des clients qui choisissent le moment de leur mise à jour.

| Objet | Politique |
|---|---|
| Plateforme | Une version de production à la fois, déployée progressivement ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) ; identifiant de version par déploiement |
| API publique | Versions majeures explicites, avec dépréciation annoncée ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi), [29.3 Gouvernance des API et politique de dépréciation](29-organisation-produit-economie.md#293-gouvernance-des-api-et-politique-de-dépréciation)) |
| Kits de développement et extensions | Versionnement sémantique, matrice de compatibilité ([10.13 SDK et plateforme développeur](10-api-integrations-extensibilite.md#1013-sdk-et-plateforme-développeur), [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) |
| Paquets de solution | Versions et mises à niveau gérées (voir [23.2 Versionnement, données d'amorçage et paramètres d'installation](23-solutions-verticales-packagees.md#232-versionnement-données-damorçage-et-paramètres-dinstallation), [23.4 Mise à niveau, fusion à trois voies et dérive de personnalisation](23-solutions-verticales-packagees.md#234-mise-à-niveau-fusion-à-trois-voies-et-dérive-de-personnalisation)) |
| Configuration | Versions de configuration par tenant ([9.5 Versionnement de la configuration, des workflows et des politiques](09-audit-versionnement-gouvernance.md#95-versionnement-de-la-configuration-des-workflows-et-des-politiques)) |
| Documentation | Version associée à celle de la plateforme |

| Type de changement | Communication | Préavis (exemple) |
|---|---|---|
| Invisible (performance, interne) | Notes de version | Aucun |
| Visible, rétrocompatible | Notes de version, aide | Quelques jours |
| Visible, changeant des habitudes | Annonce, formation | 2 à 4 semaines |
| Incompatible (API, comportement) | Annonce formelle, période de double support | 90 jours ou plus, selon contrat |
| Impact sur la conformité ou la sécurité | Notification ciblée aux tenants concernés | Selon le contrat ([20.11 Instruments contractuels, régimes sectoriels et registre des risques](20-gouvernance-donnees-conformite.md#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques)) |

#### Notes de version et journal des changements

Les notes de version s'adressent aux utilisateurs : ce qui change pour eux, ce qu'ils doivent faire. Le journal des changements s'adresse aux équipes et aux intégrateurs : tout ce qui a changé, avec référence. Les deux se **génèrent** à partir des changements fusionnés (messages structurés, étiquettes), avec une relecture éditoriale.

#### Calendrier et gels

```json
{
  "release_calendar": {
    "default_cadence": "daily_progressive",
    "freeze_windows": [
      { "name": "fin d'année comptable", "from": "2026-12-20", "to": "2027-01-04", "allow": ["hotfix"] },
      { "name": "audit annuel des grands clients", "from": "2026-11-02", "to": "2026-11-13", "allow": ["hotfix", "security_fix"] }
    ],
    "maintenance_windows": [{ "region": "eu-west", "day": "tuesday", "start": "02:00", "duration_minutes": 60 }],
    "notice_days_for_visible_changes": 14
  }
}
```

Les périodes de gel sont des **décisions explicites**, liées aux clients et aux exigences (voir [24.6 Page d'état, communication d'incident et fenêtre de maintenance](24-cycle-vie-client-support.md#246-page-détat-communication-dincident-et-fenêtre-de-maintenance) pour la communication d'incident et de maintenance). Elles ne gèlent pas tout : les correctifs de sécurité et les versions d'urgence restent possibles, avec les mêmes portes.

#### Registre des mises en production

```sql
CREATE TABLE release_record (
  id              uuid PRIMARY KEY,
  version         text        NOT NULL,
  artifact_digest text        NOT NULL,
  environment     text        NOT NULL,
  started_at      timestamptz NOT NULL,
  finished_at     timestamptz,
  initiated_by    text        NOT NULL,
  approved_by     text,
  gates_passed    jsonb       NOT NULL,
  status          text        NOT NULL CHECK (status IN ('in_progress','succeeded','failed','rolled_back')),
  change_ids      text[]      NOT NULL
);
```

Ce registre alimente les audits (preuve de changement contrôlé, voir [20.7 Cadres de conformité, contrôles, preuves et conformité continue](20-gouvernance-donnees-conformite.md#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue)), les mesures de livraison et l'analyse d'incident.

#### Les mesures de livraison

Le programme de recherche DORA définit un ensemble de mesures de performance de livraison du logiciel, que sa page de référence présente en deux familles :

| Famille | Mesure | Définition |
|---|---|---|
| Débit | Délai de mise en production | Durée entre l'enregistrement d'un changement dans le dépôt de versions et son exécution en production |
| Débit | Fréquence de déploiement | Fréquence des déploiements sur une période, ou intervalle entre eux |
| Débit | Temps de rétablissement après un déploiement raté | Durée de rétablissement après un déploiement qui a exigé une intervention immédiate |
| Stabilité | Taux d'échec des changements | Part des déploiements qui exigent une intervention immédiate (retour arrière, correctif) |
| Stabilité | Taux de reprises | Part des déploiements non planifiés, déclenchés par un incident de production |

La page signale que la mesure de rétablissement est passée d'un temps moyen de restauration à une mesure centrée sur les déploiements ratés. Le taux d'échec des changements est celui du parcours initial ([9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)).

```sql
SELECT date_trunc('week', d.deployed_at) AS week,
       count(*) AS deployments,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY d.deployed_at - c.committed_at) AS median_lead_time,
       count(*) FILTER (WHERE d.needed_intervention) * 100.0 / count(*) AS change_fail_rate_pct
  FROM deployment d
  JOIN change_commit c ON c.deployment_id = d.id
 WHERE d.environment = 'production'
   AND d.deployed_at >= now() - interval '90 days'
 GROUP BY 1
 ORDER BY 1;
```

**Exemple chiffré.** Sur un mois : 38 déploiements en production (9,5 par semaine) ; 3 ont exigé une intervention (taux d'échec $3 / 38 \approx 7{,}9\ \%$) ; le délai médian de mise en production est de 28 heures ; le rétablissement des 3 échecs a pris 12, 25 et 70 minutes. La médiane des rétablissements est de 25 minutes.

#### Spécificités d'une plateforme multi-tenant

| Mesure | Complément |
|---|---|
| Délai par anneau | Durée de passage dans chaque palier ([21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari)) |
| Part de tenants touchés par un retour arrière | Rayon d'effet réel des défauts |
| Part des changements derrière un drapeau | Découplage déploiement et activation ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) |
| Incidents imputables à un changement | Lien avec la gestion des incidents ([11.16 Gestion des incidents, astreinte et post-mortem](11-securite-fiabilite-operations.md#1116-gestion-des-incidents-astreinte-et-post-mortem)) |
| Délai de remédiation des constats de sécurité | Efficacité des portes ([21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline)) |

#### Bon usage des mesures

| Pratique | Raison |
|---|---|
| Mesurer à l'échelle d'une équipe ou d'un service | Pas d'individus |
| Comparer l'équipe à elle-même dans le temps | Les contextes diffèrent entre équipes |
| Lire débit et stabilité ensemble | Éviter d'optimiser l'un contre l'autre |
| Éviter les objectifs chiffrés imposés | Une mesure devenue cible se déforme |
| Chercher la cause d'un écart | Une mesure dit où regarder, pas pourquoi |
| Automatiser la collecte | Données à jour, sans effort |

#### Modes de défaillance

- **Ruptures non annoncées.**
- **Mises en production en période sensible.**
- **Notes de version illisibles** : liste technique sans conséquence pour l'utilisateur.
- **Registre absent** : pas de trace de ce qui est en production.
- **Mesures détournées** : changements fractionnés pour gonfler la fréquence.
- **Mesures isolées** : vitesse sans stabilité.
- **Mesures par personne.**

**Contre-exemple.** La direction fixe l'objectif de « 20 déploiements par semaine » à chaque équipe. Les équipes découpent leurs changements en tout petits morceaux, y compris des modifications sans effet. La fréquence double ; le délai réel pour livrer une fonctionnalité ne change pas, et les équipes passent plus de temps en déploiements qu'en travail utile.

**Limites.** Les mesures de livraison ne disent rien de la valeur produite : on peut livrer vite et mal. Leur définition précise varie d'une organisation à l'autre (qu'est-ce qu'un « déploiement » dans une plateforme à déploiement progressif ?). Et leur usage demande une culture de confiance.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.2 Livraison continue et portes de qualité](#212-livraison-continue-et-portes-de-qualité) | Le pipeline produit les données des mesures |
| [21.5 Déploiement progressif : déploiement par vagues, bleu-vert, canari](#215-déploiement-progressif--déploiement-par-vagues-bleu-vert-canari) | Les paliers de déploiement donnent des mesures par anneau |
| [10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi) | Versionnement et dépréciation des API |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Le taux d'échec des changements est déjà défini avec la revue de changement |
| [11.15 SLI, SLO et SLA](11-securite-fiabilite-operations.md#1115-sli-slo-et-sla) | Les objectifs de niveau de service encadrent la vitesse acceptable |
| [20.7 Cadres de conformité, contrôles, preuves et conformité continue](20-gouvernance-donnees-conformite.md#207-cadres-de-conformité-contrôles-preuves-et-conformité-continue) | Le registre des mises en production fournit des preuves |
| [24.6 Page d'état, communication d'incident et fenêtre de maintenance](24-cycle-vie-client-support.md#246-page-détat-communication-dincident-et-fenêtre-de-maintenance) | Annonces de maintenance et communication d'incident |
| [29.3 Gouvernance des API et politique de dépréciation](29-organisation-produit-economie.md#293-gouvernance-des-api-et-politique-de-dépréciation) | Gouvernance des API et politique de dépréciation |
| [29.5 Feuille de route, analytique produit et expérimentation](29-organisation-produit-economie.md#295-feuille-de-route-analytique-produit-et-expérimentation) | Feuille de route et analytique produit |

### 5. Application pratique

**Situation initiale.** Alpha Air livre quotidiennement, mais ses clients se plaignent de ruptures non annoncées, et la direction ne sait pas si la livraison s'améliore. Une mise en production a eu lieu pendant la semaine d'audit d'un grand client.

**Problème.** Aucune politique de version ni communication, aucune mesure partagée.

**Application du concept.** La plateforme établit une politique de communication, un calendrier avec gels, un registre et des mesures de référence.

**Déroulé.**

1. Les changements sont classés en invisible, visible, incompatible ; chaque classe a sa communication et son préavis.
2. Des notes de version hebdomadaires sont générées à partir des changements, puis relues.
3. Un calendrier déclare deux périodes de gel pour les saisons d'audit et d'année comptable.
4. Un registre consigne chaque mise en production avec ses portes.
5. Le tableau de bord de livraison affiche, par mois et par équipe, les cinq mesures, avec la tendance.

**Résultat.** Les ruptures sont annoncées 90 jours à l'avance ; le taux d'échec passe de 14 % à 7,9 % en six mois, et le délai médian de 3 jours à 28 heures.

**Limites.** Les mesures sont un outil d'amélioration : leur lecture sert à décider où investir (tests, automatisation), pas à comparer les équipes.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelles mesures de livraison composent le débit et la stabilité ?
2. **Compréhension.** Comment classe-t-on les changements pour décider de leur communication ?
3. **Compréhension.** À quoi sert une période de gel ?
4. **Pourquoi.** Pourquoi lire les mesures de débit et de stabilité ensemble ?
5. **Raisonnement pratique.** 52 déploiements dans le mois, dont 4 ont exigé une intervention immédiate. Quel est le taux d'échec des changements ?

#### Réponses

1. Débit : délai de mise en production, fréquence de déploiement, temps de rétablissement après un déploiement raté. Stabilité : taux d'échec des changements, taux de reprises.
2. Invisible, visible et rétrocompatible, visible et changeant des habitudes, incompatible, impact sur la conformité ou la sécurité ; chaque classe a sa communication et son préavis.
3. À éviter les mises en production à risque pendant les périodes sensibles pour les clients (audits, clôtures), tout en laissant passer les correctifs de sécurité et les urgences, par les mêmes portes.
4. Parce qu'on peut améliorer l'un en dégradant l'autre : livrer très vite en cassant souvent, ou être très stable en n'avançant plus. Les deux ensemble disent si la chaîne est réellement saine.
5. $4 / 52 \approx 7{,}7\ \%$.

## 21.11 Dette technique et enregistrement des décisions d'architecture

### 1. Comprendre simplement

La **dette technique** (*technical debt*) est la métaphore qui décrit l'accumulation, dans un système, de défauts de qualité interne qui rendent les changements plus difficiles et plus lents : un raccourci pris aujourd'hui se paie plus tard, avec des intérêts. L'**enregistrement des décisions d'architecture** (*architecture decision record*, ADR) est la pratique qui consiste à consigner, dans un court document daté, chaque décision d'architecture importante, avec son contexte, son choix et ses conséquences.

**Pourquoi cela existe.** Toute plateforme prend des raccourcis : pour tenir une échéance, pour valider une idée. Ce n'est pas un défaut en soi, à condition que ce soit un choix connu, dont on mesure le coût. Sinon, la dette s'accumule en silence, le rythme de livraison ralentit, et personne ne sait pourquoi le système est fait ainsi. Les ADR conservent la mémoire des raisons, pour que les successeurs comprennent, discutent et changent en connaissance de cause.

**Problème résolu.** Rendre visibles et pilotables les compromis de conception, et garder la trace des raisons des choix structurants.

**Modèle mental.** Un prêt et un livre de comptes. La dette est un emprunt contracté auprès du futur : on gagne du temps maintenant, on paie des intérêts à chaque changement difficile, et on peut rembourser le capital en nettoyant. L'ADR est le livre de comptes qui dit pourquoi on a emprunté.

**Où l'analogie s'arrête.** Une dette financière est chiffrée au centime. La dette technique n'a ni taux officiel ni échéance : on l'estime en temps de travail, et ses intérêts viennent des tâches futures que l'on ne connaît pas encore.

**Exemple.** Pour tenir une échéance, l'équipe d'Alpha Air a codé en dur une règle de calcul de délai dans un module. Chaque nouvelle fonction qui touche ce module prend 6 jours au lieu de 4 : l'intérêt est de 2 jours par fonction. Nettoyer coûte 5 jours : le remboursement devient rentable à partir de la troisième fonction. La décision de ne pas externaliser le calcul est consignée dans un ADR, avec la date à laquelle on devait la revoir.

**Les composants.**

1. le **registre de la dette** : éléments, zone, intérêt, capital, décision ;
2. la **classification** : délibérée ou involontaire, prudente ou imprudente ;
3. l'**estimation** du coût et des bénéfices du remboursement ;
4. la **capacité** consacrée au remboursement ;
5. les **ADR** : titre, contexte, décision, statut, conséquences ;
6. l'**index** et la **recherche** des décisions ;
7. la **revue** périodique ;
8. le **lien** avec les risques et les mesures de livraison.

**Objectif d'apprentissage :** vous pouvez décrire la dette technique avec son intérêt et son capital, tenir un registre de dette, et rédiger un enregistrement de décision d'architecture.

### 2. Connaissances essentielles

#### Définition

- **Dette technique** : accumulation de défauts de qualité interne qui augmentent l'effort nécessaire pour faire évoluer un système.
- **Enregistrement de décision d'architecture** : document court qui consigne une décision d'architecture significative, son contexte, ses conséquences et son statut.

#### Idées fondamentales

1. **La dette est un choix, ou le devient.** Délibérée ou subie, elle se gère.
2. **Elle a des intérêts et un capital.** Les intérêts sont l'effort supplémentaire à chaque changement ; le capital est l'effort pour la supprimer.
3. **On rembourse quand c'est rentable.** Là où l'on change souvent le code.
4. **Elle se rend visible.** Un registre, des estimations, des mesures.
5. **Une décision se consigne avec sa raison.** Le contexte est ce qui se perd le plus vite.
6. **Un ADR ne se réécrit pas.** Une décision remplacée est marquée, pas effacée.
7. **La dette et les décisions se relient.** Une dette acceptée renvoie à l'ADR qui l'a justifiée.

#### Vocabulaire essentiel

- **Intérêt** (*interest*) : effort supplémentaire que la dette impose à chaque changement.
- **Capital** (*principal*) : effort pour éliminer la dette.
- **Dette délibérée ou involontaire** (*deliberate*, *inadvertent*) : choisie en connaissance de cause, ou découverte après coup.
- **Dette prudente ou imprudente** (*prudent*, *reckless*) : justifiée par un compromis raisonné, ou issue de négligence.
- **Refactorisation** (*refactoring*) : amélioration de la structure interne sans changer le comportement.
- **Point chaud** (*hot spot*) : zone du code où l'on change souvent et où l'on corrige beaucoup.
- **Statut d'une décision** (*decision status*) : proposée, acceptée, dépréciée, remplacée.
- **Décision significative sur le plan architectural** (*architecturally significant decision*) : décision qui influence la structure, les caractéristiques non fonctionnelles, les dépendances, les interfaces ou les techniques de construction.

#### Relations de cause à effet

- La dette est ignorée : chaque fonction coûte un peu plus, le rythme ralentit, et personne ne sait où.
- Tout est nettoyé : on dépense de l'effort dans des zones que l'on ne touche jamais.
- Les décisions ne sont pas consignées : les nouveaux arrivants refont les mêmes débats, ou défont sans comprendre.
- Un ADR est édité après coup pour refléter l'état actuel : la trace des raisons d'origine est perdue.
- La dette n'est jamais comparée à la capacité : le registre grossit, sans décision.

#### Idées reçues

- **« La dette technique, c'est du mauvais code. »** Pas seulement. Elle peut être un compromis délibéré et prudent, dont le coût est connu.
- **« Il faut tout réécrire. »** Rarement. On rembourse par la refactorisation ciblée, là où l'intérêt est le plus élevé.
- **« Documenter l'architecture, c'est écrire un grand document. »** Non. Un ADR tient en une ou deux pages, par décision.

#### Principe clé

On gère la dette comme une dette : on la rend visible, on estime ses intérêts et son capital, on rembourse où c'est rentable ; et l'on consigne chaque décision structurante avec ses raisons, sans jamais réécrire l'histoire.

#### Si vous ne retenez que trois choses

1. La dette technique a des intérêts (surcoût à chaque changement) et un capital (coût du nettoyage) ; on rembourse où elle coûte le plus.
2. Un registre rend la dette visible et décidable ; sans lui, elle croît en silence.
3. Un ADR consigne le contexte, la décision et ses conséquences, et reste dans l'historique quand il est remplacé.

### 3. Explication technique détaillée

#### La métaphore et ses limites

La page de Martin Fowler sur la dette technique rapporte la métaphore de Ward Cunningham : les systèmes accumulent des défauts de qualité interne (de la « crasse ») qui les rendent plus difficiles à modifier, et la dette est la métaphore pour gérer cette crasse comme une dette financière. Elle distingue les **intérêts**, l'effort supplémentaire pour ajouter une fonction à cause de la crasse (dans son exemple, six jours au lieu de quatre : deux jours d'intérêt), et le **capital**, l'effort pour supprimer la crasse (cinq jours supplémentaires dans l'exemple, ce qui ne devient rentable que si plusieurs fonctions semblables suivent). Elle renvoie à une autre notice pour la classification : la dette peut être contractée volontairement ou non, de façon prudente ou imprudente.

| Élément | Exemple |
|---|---|
| Intérêt par fonction | 2 jours (6 au lieu de 4) |
| Capital | 5 jours |
| Point d'équilibre | $5 / 2 = 2{,}5$, donc à partir de la 3e fonction |
| Décision | Rembourser si au moins 3 fonctions touchent la zone dans les prochains mois |

$$n^{\ast} = \left\lceil \frac{K}{i} \right\rceil$$

Ici, $K$ est le capital (coût du nettoyage), $i$ l'intérêt par changement, et $n^{\ast}$ le nombre de changements à partir duquel le remboursement devient rentable. Avec $K = 5$ et $i = 2$ : $n^{\ast} = 3$.

#### La dette spécifique d'une plateforme configurable

| Forme | Exemple | Où elle se voit |
|---|---|---|
| Surface de personnalisation | Nombre de champs et d'objets personnalisés non utilisés ([2.5 Champs et objets personnalisés](02-donnees-ressources.md#25-champs-et-objets-personnalisés)) | Statistiques d'usage ([8.2 Administration du modèle de données](08-admin-control-plane.md#82-administration-du-modèle-de-données)) |
| Drapeaux oubliés | Feature flags non retirés ([8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) | Inventaire des drapeaux, ancienneté |
| Versions anciennes d'API | Plusieurs versions maintenues ([10.8 Versionnement d'API](10-api-integrations-extensibilite.md#108-versionnement-dapi)) | Trafic par version |
| Code spécifique à un client | Branches ou conditions par tenant | Recherche d'identifiants de tenant dans le code |
| Migrations de compatibilité | Double écriture non retirée ([21.6 Retour arrière ou correction en avant, et migrations de base dans le pipeline](#216-retour-arrière-ou-correction-en-avant-et-migrations-de-base-dans-le-pipeline)) | Registre des étapes « contracter » |
| Tests instables et lents | Suite qui ralentit la livraison ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)) | Durée et taux d'instabilité |
| Dépendances obsolètes | Bibliothèques non maintenues ([21.9 Tests de sécurité dans le pipeline](#219-tests-de-sécurité-dans-le-pipeline)) | Analyse de composition |
| Documentation périmée | Procédures et schémas faux | Revues ([18.10 Gestion documentaire et cycle de vie du document](18-fichiers-documents-contenus.md#1810-gestion-documentaire-et-cycle-de-vie-du-document)) |

La **personnalisation durable** ([23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables)) est en partie une politique de gestion de la dette : un client qui a bifurqué d'un paquet de solution contracte une dette de mise à niveau.

#### Le registre de la dette

```sql
CREATE TABLE tech_debt_item (
  id               text PRIMARY KEY,
  title            text        NOT NULL,
  area             text        NOT NULL,
  description      text        NOT NULL,
  kind             text        NOT NULL CHECK (kind IN ('deliberate_prudent','deliberate_reckless','inadvertent_prudent','inadvertent_reckless')),
  interest_days    numeric(5,1) NOT NULL,
  changes_per_year integer     NOT NULL,
  principal_days   numeric(5,1) NOT NULL,
  decision         text        NOT NULL CHECK (decision IN ('repay','accept','monitor')),
  adr_id           text,
  owner            text        NOT NULL,
  review_on        date        NOT NULL
);

SELECT id, title,
       interest_days * changes_per_year AS annual_interest_days,
       principal_days,
       round(principal_days / NULLIF(interest_days * changes_per_year, 0), 2) AS payback_years
  FROM tech_debt_item
 WHERE decision <> 'accept'
 ORDER BY annual_interest_days DESC
 LIMIT 10;
```

La requête classe les dettes par **intérêt annuel** (jours perdus par an), et calcule le **délai de retour** du remboursement. Les valeurs sont des estimations, pas des mesures exactes : on les révise.

**Repérer les points chauds.** Une dette dans un code que l'on ne change jamais coûte peu. On croise la **fréquence de modification** et le **nombre de défauts** : c'est là que l'intérêt est le plus élevé. L'historique du dépôt et le suivi des incidents fournissent ces données.

**Rembourser.** Plusieurs façons :

- **Au fil de l'eau** : on améliore la zone qu'on traverse (refactorisation d'accompagnement) ;
- **Par lots dédiés** : on réserve une part de la capacité de chaque période (valeur d'exemple : de 10 à 20 %) ;
- **Par projet** : une migration majeure, rarement, pour une dette volumineuse ;
- **En évitant** : cesser de contracter la même dette (par une règle, un outil).

La **refactorisation** s'appuie sur des tests ([21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout)) : changer la structure sans changer le comportement exige de le vérifier.

#### Les enregistrements de décision d'architecture

Michael Nygard a proposé le format dans un article de 2011. Il recommande de ne consigner que les décisions « architecturalement significatives » (celles qui touchent la structure, les caractéristiques non fonctionnelles, les dépendances, les interfaces ou les techniques de construction), dans un court fichier texte du dépôt, numéroté séquentiellement (les numéros ne sont jamais réutilisés), de une à deux pages, avec cinq rubriques : titre, contexte (les forces en présence, décrites de façon neutre), décision (en phrases actives, « nous allons… »), statut (proposée, acceptée, dépréciée ou remplacée, avec renvoi vers le remplaçant) et conséquences (positives, négatives et neutres). Une décision renversée est conservée et marquée comme remplacée, plutôt que supprimée, car il reste utile de savoir qu'elle a été prise.

```text
ADR 0012 — Index de recherche partagé, avec filtre de tenant imposé par un client unique

Statut : acceptée (2026-06-03)

Contexte
- 800 tenants, dont 700 très petits ; un index par tenant coûterait environ 700 index presque vides.
- Des fuites par suggestions et facettes ont été observées chez un concurrent de la même catégorie (cas général, non spécifique).
- Les statistiques de classement sont calculées sur tout l'index partagé.

Décision
Nous utilisons un index partagé pour les petits tenants, avec un client de recherche unique
qui impose le filtre de tenant, y compris pour les suggestions et les facettes. Les grands
tenants et les tenants à isolation forte disposent d'un index propre.

Conséquences
+ Coût et exploitation réduits pour les petits tenants.
+ Une seule porte d'accès : testable (voir 21.8).
- Statistiques de classement mélangées entre petits tenants.
- Deux chemins à exploiter (partagé et dédié).
- À réexaminer si plus de 20 tenants demandent un index dédié.

Remplace : aucune. Liée à : ADR 0007 (isolation par cellules).
```

*Cet exemple est fictif. Il illustre le format ; les nombres et les références sont des valeurs d'exemple.*

| Bonne pratique | Raison |
|---|---|
| Un ADR par décision | Facile à retrouver et à remplacer |
| Dans le dépôt, avec le code | Revue par le même processus, historique partagé |
| Revue par demande de fusion ([9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation)) | Discussion visible, approbation tracée |
| Contexte neutre et factuel | Les successeurs comprennent les forces, pas les opinions |
| Les alternatives écartées figurent | On sait ce qui a été envisagé |
| Un index | On retrouve les décisions par sujet |
| Lien avec le registre de dette et le registre des risques | Une dette acceptée renvoie à l'ADR ([20.11 Instruments contractuels, régimes sectoriels et registre des risques](20-gouvernance-donnees-conformite.md#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques)) |

#### Gouvernance

La **gouvernance d'architecture** ([29.6 Écosystème de partenaires et gouvernance d'architecture](29-organisation-produit-economie.md#296-écosystème-de-partenaires-et-gouvernance-darchitecture)) décide qui valide quelles décisions : un comité léger pour les décisions qui engagent plusieurs équipes, l'équipe seule pour les autres. Les ADR en sont le support : ils rendent la décision discutable avant qu'elle ne soit prise.

#### Modes de défaillance

- **Dette invisible.**
- **Dette gonflée** : un registre de centaines d'éléments sans estimation.
- **Réécriture totale** comme remboursement : risque et coût disproportionnés.
- **Dette sans propriétaire.**
- **ADR après coup**, ou éditées pour refléter l'état présent.
- **ADR trop longs** : plus personne ne les lit.
- **Décisions orales** : perdues au départ des personnes.

**Contre-exemple.** Le calcul de délai codé en dur est un raccourci connu de tous, jamais consigné. Deux ans plus tard, les personnes qui l'ont écrit ont quitté l'équipe. Une nouvelle recrue le « corrige » en le généralisant, sans savoir qu'il répond à une contrainte d'un client réglementé : le comportement change pour ce client. Un ADR aurait gardé la raison du compromis.

**Limites.** La dette technique se mesure mal : les estimations sont approximatives, les intérêts futurs incertains. Un registre trop ambitieux devient un fardeau. Et un ADR documente une décision à une date : il ne garantit pas qu'elle soit toujours valable, d'où la date de réexamen.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [21.7 Pyramide de tests, tests de contrat et tests de bout en bout](#217-pyramide-de-tests-tests-de-contrat-et-tests-de-bout-en-bout) | Les tests rendent la refactorisation sûre |
| [21.10 Gestion des versions et mesures de livraison](#2110-gestion-des-versions-et-mesures-de-livraison) | Les mesures de livraison révèlent l'effet de la dette |
| [20.11 Instruments contractuels, régimes sectoriels et registre des risques](20-gouvernance-donnees-conformite.md#2011-instruments-contractuels-régimes-sectoriels-et-registre-des-risques) | Une dette acceptée est un risque inscrit au registre |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Les ADR passent par la revue de changement |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les drapeaux oubliés sont une forme de dette |
| [23.3 Configuration en couches, surface de personnalisation et points d'extension stables](23-solutions-verticales-packagees.md#233-configuration-en-couches-surface-de-personnalisation-et-points-dextension-stables) | La personnalisation durable évite de contracter une dette de mise à niveau |
| [29.6 Écosystème de partenaires et gouvernance d'architecture](29-organisation-produit-economie.md#296-écosystème-de-partenaires-et-gouvernance-darchitecture) | La gouvernance d'architecture s'appuie sur les ADR |
| [14.3 Contexte délimité](14-domain-driven-design.md#143-contexte-délimité) | Les contextes délimités sont des décisions d'architecture à consigner |
| [13.2 Configuration versus code](13-concepts-transversaux.md#132-configuration-versus-code) | Choisir entre configuration et code est une décision structurante |

### 5. Application pratique

**Situation initiale.** Les équipes d'Alpha Air ressentent un ralentissement : une fonction qui prenait une semaine en prend deux. Personne ne peut dire où le temps est perdu, ni pourquoi certains choix ont été faits.

**Problème.** Dette invisible, décisions non consignées.

**Application du concept.** La plateforme introduit un registre de dette et des ADR.

**Déroulé.**

1. Chaque équipe liste ses dix principales dettes, avec une estimation de l'intérêt par changement et du capital.
2. Le registre croise ces estimations avec la fréquence des modifications du dépôt : trois points chauds ressortent.
3. L'équipe réserve 15 % de sa capacité au remboursement, en commençant par le module de calcul de délai (intérêt annuel de 24 jours, capital de 5 jours).
4. Les décisions structurantes passent désormais par un ADR relu par demande de fusion ; douze décisions existantes sont rétro-documentées, avec la mention « reconstitué ».
5. Les dettes acceptées renvoient à leur ADR et figurent au registre des risques.

**Résultat.** Le délai de livraison des fonctions dans les trois zones chaudes baisse de 30 % en deux trimestres, et les nouvelles recrues retrouvent les raisons des principaux choix.

**Limites.** Les ADR reconstitués sont moins fiables que ceux écrits sur le moment : on les marque comme tels.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que sont l'intérêt et le capital d'une dette technique ?
2. **Compréhension.** Quelles rubriques contient un enregistrement de décision d'architecture ?
3. **Compréhension.** Pourquoi une décision remplacée n'est-elle pas supprimée ?
4. **Pourquoi.** Pourquoi rembourse-t-on la dette là où l'on change souvent le code ?
5. **Raisonnement pratique.** Un nettoyage coûte 8 jours ; la dette ajoute 1,5 jour à chaque changement de la zone. À partir de combien de changements est-il rentable ?

#### Réponses

1. L'intérêt est l'effort supplémentaire que la dette impose à chaque changement ; le capital est l'effort nécessaire pour la supprimer.
2. Un titre, un contexte, une décision, un statut (proposée, acceptée, dépréciée, remplacée) et des conséquences.
3. Parce qu'il reste utile de savoir que cette décision a existé, pourquoi elle avait été prise, et pourquoi elle a été changée : l'historique des raisons est ce que l'on conserve.
4. Parce que l'intérêt se paie à chaque changement : une zone que l'on touche rarement coûte peu, une zone fréquemment modifiée coûte cher.
5. $8 / 1{,}5 \approx 5{,}3$, donc à partir du 6e changement.

## Références du module

| Sujet | Référence | Source consultée | Utilisée en |
|---|---|---|---|
| Intégration continue | Martin Fowler, *Continuous Integration* | [martinfowler.com](https://martinfowler.com/articles/continuousIntegration.html) | 21.1 |
| Livraison continue | Martin Fowler, *Continuous Delivery* | [martinfowler.com](https://martinfowler.com/bliki/ContinuousDelivery.html) | 21.2 |
| Déploiement bleu-vert | Martin Fowler, *Blue Green Deployment* | [martinfowler.com](https://martinfowler.com/bliki/BlueGreenDeployment.html) | 21.5, 21.6 |
| Mise en production canari | Martin Fowler, *Canary Release* | [martinfowler.com](https://martinfowler.com/bliki/CanaryRelease.html) | 21.5 |
| Canarying | Google, *The Site Reliability Workbook*, « Canarying Releases » | [sre.google](https://sre.google/workbook/canarying-releases/) | 21.5 |
| Mises à jour par vagues | Kubernetes, *Performing a Rolling Update* | [kubernetes.io](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) | 21.5 |
| Livraison progressive | James Governor, RedMonk, 2018 | Résultats de recherche (sources secondaires) | 21.5 |
| Changement parallèle | Martin Fowler, *Parallel Change* | [martinfowler.com](https://martinfowler.com/bliki/ParallelChange.html) | 21.6 |
| Migrations versionnées | Redgate, documentation Flyway, *Migrations* | [documentation Flyway](https://documentation.red-gate.com/fd/migrations-271585107.html) | 21.6 |
| Changements de schéma | PostgreSQL, *ALTER TABLE* et *CREATE INDEX* | [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html), [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) | 21.6 |
| Pyramide de tests | Martin Fowler, *Test Pyramid* | [martinfowler.com](https://martinfowler.com/bliki/TestPyramid.html) | 21.7 |
| Tests de contrat | Pact, documentation | [docs.pact.io](https://docs.pact.io/) | 21.7 |
| Tests non déterministes | Martin Fowler, *Eradicating Non-Determinism in Tests* | [martinfowler.com](https://martinfowler.com/articles/nonDeterminism.html) | 21.7 |
| Parité développement-production | *The Twelve-Factor App*, facteur X | [12factor.net](https://12factor.net/dev-prod-parity) | 21.3 |
| Construire, publier, exécuter | *The Twelve-Factor App*, facteur V | [12factor.net](https://12factor.net/build-release-run) | 21.1 |
| Infrastructure en tant que code | Martin Fowler, *Infrastructure As Code* | [martinfowler.com](https://martinfowler.com/bliki/InfrastructureAsCode.html) | 21.4 |
| GitOps | OpenGitOps, principes | [opengitops.dev](https://opengitops.dev/) | 21.4 |
| Provenance et chaîne d'approvisionnement | SLSA, spécification v1.0 (page marquée remplacée par la v1.2) | [slsa.dev](https://slsa.dev/spec/v1.0/about) | 21.1, 21.9 |
| Développement logiciel sécurisé | NIST, SSDF (SP 800-218, v1.1) | [csrc.nist.gov](https://csrc.nist.gov/projects/ssdf) | 21.9 |
| Sécurité dans le pipeline | OWASP, *DevSecOps Guideline* ; *Dependency-Check* ; *Source Code Analysis Tools* | [DevSecOps](https://owasp.org/www-project-devsecops-guideline/), [Dependency-Check](https://owasp.org/www-project-dependency-check/), [Analyse du code](https://community.owasp.org/Source_Code_Analysis_Tools) | 21.9 |
| Mesures de livraison | DORA, *DORA's software delivery metrics* | [dora.dev](https://dora.dev/guides/dora-metrics/) | 21.10 |
| Dette technique | Martin Fowler, *Technical Debt* | [martinfowler.com](https://martinfowler.com/bliki/TechnicalDebt.html) | 21.11 |
| Décisions d'architecture | Michael Nygard, *Documenting Architecture Decisions*, 2011 | [cognitect.com](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | 21.11 |

**Consultées le 14 octobre 2026.**

**Non confrontés à une source pendant la rédaction.**

- La définition des portes de qualité d'un outil précis : la page de documentation consultée ne les définissait pas ; la description d'une porte comme condition mesurable vient de la pratique générale.
- Les exigences de chaque niveau de SLSA : la page consultée est celle de la version 1.0, marquée remplacée par la 1.2, et ne détaille pas les niveaux.
- La page de DORA renvoie à un article d'historique des mesures, non lu ; la liste des cinq mesures est celle de la page consultée.
- L'origine et la définition exacte de la livraison progressive : résultats de recherche, sources secondaires.
- Le comportement exact de contraintes et d'index d'une version donnée de PostgreSQL : à relire dans la documentation de la version utilisée.
- Les valeurs chiffrées (durées, nombres de tests, coûts d'environnement, seuils, préavis, taux) : ce sont des valeurs d'exemple.
- Les formats de pipeline, de contrat, de scénario, de plan de vagues, de calendrier et d'ADR sont propres à la plateforme fictive.
- Les scripts SQL ont été analysés syntaxiquement (grammaire PostgreSQL) mais pas exécutés sur une instance ; l'analyseur traite en commande générique l'instruction `VALIDATE CONSTRAINT`, dont la syntaxe reprend celle de la documentation consultée. Les extraits TypeScript ont été contrôlés syntaxiquement, sans exécution.
