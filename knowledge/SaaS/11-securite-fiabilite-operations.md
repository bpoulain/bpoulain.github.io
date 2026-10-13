# Module 11 — Sécurité, fiabilité et opérations

> **Question directrice.** Comment passer d'un prototype à une plateforme que des entreprises peuvent réellement utiliser, exploiter et à laquelle elles peuvent faire confiance ?

## Présentation du module

**Objectif.** Une plateforme qui fonctionne en démonstration n'est pas encore une plateforme qu'une entreprise peut confier ses opérations. Ce module couvre ce qui fait la différence : la **sécurité** (protéger), la **fiabilité** (résister et récupérer), l'**observabilité** (voir ce qui se passe) et les pratiques d'**exploitation** (s'engager et apprendre).

**Prérequis.** L'architecture du module 1, l'isolation du module 5, l'identité et l'autorisation du module 4, les événements du module 7.

**Ordre retenu.** Les quatre familles du plan, de la protection à l'exploitation.

```text
Sécurité         triade CIA ─ modélisation des menaces ─ chiffrement ─ secrets et clés
                 Zero Trust ─ cycle de développement sécurisé et vulnérabilités
Fiabilité        disponibilité, fiabilité, résilience ─ tolérance aux pannes, redondance, basculement
                 dégradation progressive ─ sauvegarde et restauration ─ reprise après sinistre (RPO, RTO)
Observabilité    journaux, métriques, traces ─ surveillance, alertes, sondes ─ suivi des erreurs
SRE              SLI, SLO, SLA ─ incidents, astreinte, post-mortem ─ capacité
```

Le principe du **moindre privilège** (*least privilege*), qui figure aussi dans la liste de sécurité du plan, est expliqué en [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) ; il est repris en [11.5 Zero Trust](#115-zero-trust) comme pilier du Zero Trust.

## Sommaire du module

- [11.1 La triade CIA](#111-la-triade-cia)
- [11.2 Modélisation des menaces](#112-modélisation-des-menaces)
- [11.3 Chiffrement](#113-chiffrement)
- [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés)
- [11.5 Zero Trust](#115-zero-trust)
- [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)
- [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience)
- [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement)
- [11.9 Dégradation progressive](#119-dégradation-progressive)
- [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration)
- [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)
- [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces)
- [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)
- [11.14 Suivi des erreurs](#1114-suivi-des-erreurs)
- [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)
- [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem)
- [11.17 Planification de capacité](#1117-planification-de-capacité)

## 11.1 La triade CIA

### 1. Comprendre simplement

La **triade CIA** (*Confidentiality, Integrity, Availability*) est le cadre le plus répandu pour penser les objectifs de la sécurité de l'information. Elle réunit trois propriétés à protéger : la **confidentialité** (seuls les autorisés voient), l'**intégrité** (les données ne sont pas altérées indûment) et la **disponibilité** (les données et les services sont utilisables quand il le faut).

**Pourquoi cela existe.** « Sécuriser » est vague. La triade donne trois questions précises à poser pour chaque ressource et chaque menace : qui pourrait voir ce qu'il ne doit pas ? Qui pourrait modifier ce qu'il ne doit pas ? Qui pourrait empêcher d'y accéder ?

**Problème résolu.** Structurer l'analyse des risques et des mesures de protection avec un vocabulaire commun.

**Modèle mental.** Le coffre d'une banque : la serrure et la salle sécurisée protègent la confidentialité, les scellés et le registre garantissent l'intégrité, les horaires et l'accès d'urgence assurent la disponibilité.

**Où l'analogie s'arrête.** Un coffre protège des objets. Une plateforme protège des données qui doivent être à la fois lues, modifiées et partagées, ce qui met les trois objectifs en tension.

**Exemple.** Pour les données d'inspection d'une compagnie : seules les personnes autorisées les lisent (confidentialité), personne ne peut falsifier une date d'inspection sans trace (intégrité), et les planificateurs y accèdent à toute heure (disponibilité).

**Les trois propriétés.**

1. **Confidentialité** : limiter l'accès aux personnes et systèmes autorisés.
2. **Intégrité** : garantir l'exactitude et l'absence de modification non autorisée.
3. **Disponibilité** : garantir l'accès en temps utile.

**Objectif d'apprentissage :** vous pouvez classer une menace ou une mesure selon la propriété qu'elle touche et identifier les tensions entre propriétés.

### 2. Connaissances essentielles

#### Définition

- **Confidentialité** : propriété selon laquelle l'information n'est accessible qu'aux entités autorisées.
- **Intégrité** : propriété selon laquelle l'information (et le système qui la traite) est exacte, complète et n'est modifiée que de façon autorisée.
- **Disponibilité** : propriété selon laquelle l'information et les services sont accessibles et utilisables à la demande d'une entité autorisée.

#### Idées fondamentales

1. **Trois objectifs, trois familles de mesures.** Contrôle d'accès et chiffrement, validation et traçabilité, redondance et sauvegarde.
2. **Aucun n'est absolu.** Chacun se mesure et se règle selon la valeur de la donnée.
3. **Ils entrent parfois en tension.** Plus de contrôle peut réduire la disponibilité.
4. **Une même donnée a des exigences différentes.** Le coût d'une inspection est confidentiel ; sa date doit être intègre ; la liste doit être disponible.
5. **Le risque combine probabilité et impact.** On protège d'abord ce qui est probable et grave.
6. **La triade n'est pas exhaustive.** L'authenticité, la responsabilité (*accountability*) et la vie privée la complètent.

#### Vocabulaire essentiel

- **Actif** (*asset*) : ce qui a de la valeur et doit être protégé.
- **Menace** (*threat*) : événement ou acteur qui peut causer un dommage.
- **Vulnérabilité** (*vulnerability*) : faiblesse exploitable.
- **Risque** (*risk*) : combinaison de la probabilité d'une menace exploitant une vulnérabilité et de son impact.
- **Contrôle** ou **mesure** (*control*, *countermeasure*) : moyen de réduire un risque.
- **Authenticité** (*authenticity*) : propriété d'une entité ou d'une donnée d'être ce qu'elle prétend.
- **Non-répudiation** (*non-repudiation*) : impossibilité de nier avoir effectué une action.

#### Relations de cause à effet

- Le chiffrement protège la confidentialité, mais la perte de la clé rend les données indisponibles.
- Une validation très stricte protège l'intégrité, mais peut bloquer des opérations légitimes et réduire la disponibilité.
- Une redondance forte améliore la disponibilité, mais multiplie les copies à protéger en confidentialité.

#### Idées reçues

- **« La sécurité, c'est la confidentialité. »** Non. Une panne ou un chiffrement par un rançongiciel est une atteinte à la disponibilité ; une date falsifiée est une atteinte à l'intégrité.
- **« Plus de sécurité est toujours mieux. »** Un excès de contrôles dégrade l'usage et la disponibilité. Le bon niveau dépend de la valeur et du risque.
- **« La sécurité est l'affaire de l'équipe sécurité. »** Chaque choix de conception touche l'une des trois propriétés.

#### Principe clé

Pour chaque actif, demandez ce que coûterait une fuite, une altération ou une indisponibilité, et dosez les mesures en conséquence.

#### Si vous ne retenez que trois choses

1. La triade CIA désigne confidentialité, intégrité et disponibilité.
2. Chaque mesure de sécurité protège une ou plusieurs propriétés, parfois au détriment d'une autre.
3. Le niveau de protection se décide par le risque : probabilité multipliée par impact.

### 3. Explication technique détaillée

#### Les mesures par propriété

| Propriété | Mesures typiques dans la plateforme |
|---|---|
| Confidentialité | Isolation des tenants (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)), autorisation fine (voir [4.19 Permissions au niveau ressource, champ et ligne](04-identite-iam-autorisation.md#419-permissions-au-niveau-ressource-champ-et-ligne)), chiffrement (voir [11.3 Chiffrement](#113-chiffrement)), masquage, gestion des secrets |
| Intégrité | Validation (voir [2.16 Validation des données](02-donnees-ressources.md#216-validation-des-données)), contraintes (voir [2.12 Contraintes et intégrité référentielle](02-donnees-ressources.md#212-contraintes-et-intégrité-référentielle)), transactions, journal d'audit immuable (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), signatures, contrôle de version |
| Disponibilité | Redondance (voir [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement)), sauvegardes (voir [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration)), limitation de débit, protection contre le déni de service, dégradation maîtrisée |

#### Des menaces classées

| Menace | Propriété principalement atteinte |
|---|---|
| Un tenant lit les données d'un autre | Confidentialité |
| Un administrateur modifie un journal d'audit | Intégrité |
| Un import malveillant corrompt des dates d'inspection | Intégrité |
| Un rançongiciel chiffre les bases | Disponibilité (et confidentialité si exfiltration) |
| Un déni de service sature l'API | Disponibilité |
| Une sauvegarde non chiffrée est volée | Confidentialité |

#### L'évaluation du risque

Une approche simple combine une probabilité et un impact :

$$\text{risque} = \text{probabilité} \times \text{impact}$$

**Exemple chiffré.** Si une panne de région a une probabilité de 5 % par an et un impact de 200 000 € de pertes et pénalités, le risque annualisé est de $0{,}05 \times 200\,000 = 10\,000$ €. Une mesure qui coûte 80 000 € par an pour l'éliminer n'est pas justifiée sur ce seul critère ; une mesure à 5 000 € qui réduit l'impact de moitié l'est.

Les chiffres sont des estimations. Beaucoup d'organisations utilisent des échelles qualitatives (faible, moyen, élevé) pour classer les risques avant de les chiffrer.

#### La classification des données

Les exigences varient selon les données. Une classification simple guide les mesures.

| Niveau | Exemples | Mesures minimales |
|---|---|---|
| Public | Documentation produit | Intégrité de publication |
| Interne | Configuration d'un tenant | Contrôle d'accès, journalisation |
| Confidentiel | Données d'inspection, personnel | Chiffrement, droits fins, audit |
| Restreint | Secrets, clés, données de santé | Chiffrement fort, accès exceptionnel, approbations |

#### Les tensions entre propriétés

| Tension | Exemple | Arbitrage |
|---|---|---|
| Confidentialité contre disponibilité | Chiffrement avec une clé que seul le client détient (BYOK) | Si la clé est perdue ou retirée, les données sont inaccessibles : le client en accepte le risque |
| Intégrité contre disponibilité | Refuser toute écriture si l'audit est indisponible | Choix explicite : refuser, ou accepter avec tampon sûr |
| Confidentialité contre traçabilité | Journaliser les accès sans exposer les données | Journaliser des références, masquer |
| Disponibilité contre intégrité | Réplication asynchrone | Fenêtre de perte possible (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)) |

**Contre-exemple.** Concentrer 90 % de l'effort de sécurité sur la confidentialité (chiffrement, contrôles d'accès), et ne pas tester la restauration des sauvegardes. Un rançongiciel chiffre les données ; la plateforme, impeccable en confidentialité, est hors service pendant trois semaines.

**Limites.** La triade est un cadre de réflexion, pas une méthode complète. Elle ne dit pas comment hiérarchiser ; c'est le rôle de l'analyse des risques et de la modélisation des menaces (voir [11.2 Modélisation des menaces](#112-modélisation-des-menaces)).

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.2 Modélisation des menaces](#112-modélisation-des-menaces) | La modélisation des menaces applique la triade à un système précis |
| [11.3 Chiffrement](#113-chiffrement) | Le chiffrement protège la confidentialité (et l'intégrité authentifiée) |
| [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience) | La disponibilité est la troisième propriété |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation des tenants est la protection centrale de la confidentialité |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit protège l'intégrité et la responsabilité |
| [4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation) | Authentification et autorisation servent confidentialité et intégrité |

### 5. Application pratique

**Situation initiale.** Une compagnie demande à la plateforme d'attester son niveau de protection avant de lui confier ses données d'inspection.

**Problème.** Les réponses de l'équipe sont dispersées : chiffrement ici, sauvegardes là, journaux ailleurs.

**Application du concept.** L'équipe présente ses mesures organisées par propriété de la triade.

**Déroulé.**

1. Elle recense les actifs : données d'inspection, secrets, configuration.
2. Elle classe les données (confidentielles, restreintes).
3. Pour chaque propriété, elle liste les menaces principales et les mesures en place.
4. Elle identifie les écarts : aucune restauration testée depuis un an (disponibilité), pas de signature des exports (intégrité).
5. Elle établit un plan d'action hiérarchisé par risque.

**Résultat.** Le client reçoit une vue claire, et l'équipe dispose d'un plan priorisé.

**Limites.** La cartographie est un instantané : elle doit être revue à chaque évolution majeure de l'architecture.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifient les trois lettres CIA ?
2. **Compréhension.** Quelle propriété est atteinte par un rançongiciel qui chiffre les données ?
3. **Compréhension.** Comment évalue-t-on simplement un risque ?
4. **Pourquoi.** Pourquoi les trois propriétés peuvent-elles entrer en tension ?
5. **Raisonnement pratique.** Une date d'inspection est modifiée par un import erroné. Quelle propriété est en cause, et quelles mesures la protègent ?

#### Réponses

1. Confidentialité, intégrité, disponibilité.
2. Principalement la disponibilité (et la confidentialité si les données ont aussi été exfiltrées).
3. En combinant la probabilité de la menace et l'impact : probabilité multipliée par impact, ou une échelle qualitative.
4. Parce que renforcer l'une peut affaiblir une autre : le chiffrement à clé unique réduit la disponibilité si la clé est perdue ; une redondance accroît les copies à protéger.
5. L'intégrité. Les mesures : validation, contraintes, contrôle de version, audit, possibilité de retour arrière.

## 11.2 Modélisation des menaces

### 1. Comprendre simplement

La **modélisation des menaces** (*threat modeling*) est une démarche structurée qui consiste à **se demander, avant que ce soit arrivé, ce qui pourrait mal tourner** dans un système : qui pourrait l'attaquer, comment, qu'est-ce qui serait atteint, et que fait-on pour l'éviter ou le limiter.

**Pourquoi cela existe.** Corriger une faille après sa découverte en production coûte cher. Réfléchir tôt, avec un schéma du système, permet de repérer des faiblesses de conception que ni les tests ni les analyses de code ne trouveront : une confusion d'identité, une frontière de confiance mal placée, un chemin d'accès oublié.

**Problème résolu.** Identifier méthodiquement les menaces pertinentes, et décider des contrôles avant ou pendant la conception.

**Modèle mental.** Un architecte de bâtiment qui se demande, plan en main : par où un intrus pourrait-il entrer ? Où est la partie la plus précieuse ? Quel est le chemin le plus facile ? Il le fait avant de couler le béton.

**Où l'analogie s'arrête.** Un bâtiment est figé. Un système logiciel évolue en continu : la modélisation est un exercice répété, pas un document définitif.

**Exemple.** En examinant la fonction « webhooks », l'équipe se demande : « que se passe-t-il si un client saisit une adresse interne ? » Elle découvre le risque de falsification de requête côté serveur (voir [7.5 Webhook](07-evenements-automatisation.md#75-webhook)) avant la mise en production.

**Les quatre questions.**

1. Sur quoi travaillons-nous ? (le système, les flux, les frontières)
2. Qu'est-ce qui peut mal tourner ? (les menaces)
3. Que faisons-nous pour y répondre ? (les mesures)
4. Avons-nous bien travaillé ? (la vérification)

**Objectif d'apprentissage :** vous pouvez conduire une modélisation simple d'une fonction, avec un schéma de flux, des frontières de confiance et la grille STRIDE.

### 2. Connaissances essentielles

#### Définition

La **modélisation des menaces** est un processus d'analyse qui représente un système, identifie les menaces qui pèsent sur ses actifs, évalue leur importance et définit des mesures de réduction, à des fins de conception et de vérification.

#### Idées fondamentales

1. **On part d'une représentation.** Un schéma de flux de données avec frontières de confiance.
2. **On énumère systématiquement.** Une grille (STRIDE) évite d'oublier des familles de menaces.
3. **On pense en attaquant.** Qui, avec quels moyens, pour quel gain.
4. **On hiérarchise.** Toutes les menaces ne méritent pas la même réponse.
5. **On produit des actions.** Des mesures, des tests, des responsables.
6. **On recommence.** À chaque évolution significative.

#### Vocabulaire essentiel

- **Frontière de confiance** (*trust boundary*) : ligne où le niveau de confiance change (Internet / plateforme, tenant / tenant).
- **Diagramme de flux de données** (*data flow diagram*, *DFD*) : schéma des processus, magasins de données, flux et acteurs.
- **Surface d'attaque** (*attack surface*) : ensemble des points d'entrée possibles pour un attaquant.
- **Arbre d'attaque** (*attack tree*) : décomposition d'un objectif d'attaquant en étapes.
- **Cas d'abus** (*abuse case*) : scénario où un acteur utilise le système contre son but.
- **Registre des menaces** (*threat register*) : liste des menaces avec leur traitement.
- **STRIDE** : grille de six familles de menaces.

#### Relations de cause à effet

- La modélisation est faite à la fin du projet. Les corrections touchent l'architecture et coûtent très cher, ou sont abandonnées.
- Les frontières de confiance sont mal tracées. Des données non vérifiées sont traitées comme fiables.
- La modélisation est faite une fois, puis oubliée. Chaque nouvelle fonction ouvre des chemins que personne n'a examinés.

#### Idées reçues

- **« C'est un exercice réservé aux experts en sécurité. »** Les meilleures séances réunissent des personnes qui connaissent le système : concepteurs, développeurs, exploitants.
- **« Il faut un outil spécialisé. »** Un tableau blanc et un schéma suffisent pour commencer.
- **« Elle ne trouve que des failles techniques. »** Elle trouve aussi des abus de logique métier : un tenant qui détourne un quota, un approbateur qui s'approuve lui-même.

#### Principe clé

Dessinez le système, repérez où la confiance change, énumérez ce qui peut mal tourner de façon systématique, et transformez chaque menace en décision.

#### Si vous ne retenez que trois choses

1. La modélisation des menaces cherche les faiblesses de conception avant qu'elles soient exploitées.
2. Elle s'appuie sur un schéma de flux, des frontières de confiance et une grille comme STRIDE.
3. Elle est répétée à chaque changement significatif et produit des actions suivies.

### 3. Explication technique détaillée

#### La grille STRIDE

| Lettre | Menace | Propriété visée | Exemple dans la plateforme |
|---|---|---|---|
| S | Usurpation (*Spoofing*) | Authenticité | Un attaquant rejoue un jeton volé, se fait passer pour un service |
| T | Falsification (*Tampering*) | Intégrité | Modification d'une requête, d'un import, d'un événement en transit |
| R | Répudiation (*Repudiation*) | Responsabilité | Un administrateur nie avoir modifié une règle, faute de trace |
| I | Divulgation d'information (*Information disclosure*) | Confidentialité | Fuite entre tenants, message d'erreur trop détaillé, cache partagé |
| D | Déni de service (*Denial of service*) | Disponibilité | Requête très coûteuse, boucle d'automatisation, saturation d'une file |
| E | Élévation de privilège (*Elevation of privilege*) | Autorisation | Création d'un rôle plus puissant que le sien, contournement de contrôle |

#### Un schéma avec frontières de confiance

```text
        Frontière : Internet
═══════════════════════════════════════════════
Utilisateur ──► Passerelle d'API ──► Moteur de ressources ──► Base de données
                     │                       │
                     │                       ├──► Bus d'événements ──► Service de webhooks ──► Système du client
                     │                       │                                  ▲ frontière : réseau externe
                     │                       └──► Plugins (bac à sable)
        Frontière : tenant A / tenant B (logique, à tous les niveaux)
```

À chaque flèche qui franchit une frontière, on pose les six questions STRIDE.

#### Un extrait de registre des menaces

| N° | Flux | Menace | Catégorie | Probabilité | Impact | Mesure | État |
|---|---|---|---|---|---|---|---|
| T-07 | Webhooks vers le client | Le client saisit une adresse interne (SSRF) | I, E | Moyenne | Élevé | Refuser adresses privées, vérifier après résolution DNS | Fait |
| T-12 | Console d'administration | Création d'un rôle plus puissant que le sien | E | Moyenne | Élevé | Règle « on n'accorde pas ce que l'on n'a pas » (voir [8.4 Administration des identités et des accès](08-admin-control-plane.md#84-administration-des-identités-et-des-accès)) | Fait |
| T-19 | Moteur d'expressions | Expression coûteuse épuisant le processeur | D | Moyenne | Moyen | Limites de temps et de profondeur (voir [6.8 Expression et formule](06-workflow-etat-regles.md#68-expression-et-formule)) | En cours |
| T-23 | Plugins | Exfiltration par un appel réseau | I | Faible | Élevé | Liste d'adresses autorisées (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)) | Fait |
| T-31 | Imports | Fichier piégé (injection de formule dans un export) | T | Moyenne | Moyen | Neutralisation des valeurs (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)) | À faire |

#### Les menaces propres à une plateforme multi-tenant

| Menace | Description |
|---|---|
| Fuite entre tenants | Contexte de tenant oublié dans un chemin (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)) |
| Voisin bruyant | Déni de service involontaire ou volontaire par un tenant |
| Abus d'administration inter-tenants | Compromission d'un compte d'opérateur (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) |
| Extension malveillante | Plugin ou application de marketplace (voir [10.14 Marketplace](10-api-integrations-extensibilite.md#1014-marketplace)) |
| Détournement d'automatisation | Règle créée pour exfiltrer ou saturer |
| Chaîne d'approvisionnement | Dépendance compromise (voir [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)) |

#### La hiérarchisation

On classe chaque menace par probabilité et impact, ou par une méthode normalisée de notation des vulnérabilités (voir [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités)). On traite d'abord les menaces à fort impact et à probabilité non négligeable, on documente celles que l'on accepte, et on planifie le reste.

#### Les réponses possibles à une menace

| Réponse | Exemple |
|---|---|
| Éliminer | Retirer la fonction qui crée le risque |
| Réduire | Ajouter un contrôle (validation, limite, chiffrement) |
| Transférer | Assurance, contrat, service géré |
| Accepter | Décision explicite, documentée, revue |

**Contre-exemple.** Une séance unique de modélisation, il y a deux ans, dont le résultat est dans un document que personne ne rouvre. Depuis, onze fonctions ont été ajoutées, dont une exécution de code client, sans qu'aucune n'ait été examinée.

**Limites.** La modélisation ne garantit pas de tout trouver ; elle dépend de l'imagination et de la connaissance des participants. Elle se complète par des tests d'intrusion, des revues de code et une surveillance en production.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.1 La triade CIA](#111-la-triade-cia) | La triade CIA structure les objectifs de la modélisation |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | Elle est une activité du cycle de développement sécurisé |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | Elle examine les chemins de fuite entre tenants |
| [7.5 Webhook](07-evenements-automatisation.md#75-webhook) | Elle a révélé le risque SSRF des webhooks |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Elle examine les extensions et leurs droits |
| [11.5 Zero Trust](#115-zero-trust) | Elle alimente les décisions de Zero Trust |

### 5. Application pratique

**Situation initiale.** L'équipe va livrer la fonction « actions de workflow personnalisées » (voir [10.15 Interface personnalisée et workflows personnalisés](10-api-integrations-extensibilite.md#1015-interface-personnalisée-et-workflows-personnalisés)) : une étape de workflow appelle un service du client.

**Problème.** Cette fonction fait sortir des appels de la plateforme vers des adresses choisies par les clients, avec des données du tenant.

**Application du concept.** Une séance de modélisation de deux heures avec développeurs, exploitants et un référent sécurité.

**Déroulé.**

1. L'équipe dessine le flux : moteur de workflow, appel signé vers l'adresse du client, réponse, journal.
2. Elle pose STRIDE sur chaque flèche. Menaces identifiées : appel vers une adresse interne (I, E), réponse géante (D), réponse qui injecte des données dans le contexte (T), absence de trace (R).
3. Elle décide des mesures : liste d'adresses interdites, taille maximale de réponse, validation par schéma, journal d'exécution.
4. Elle inscrit les actions dans le registre avec responsables.
5. Elle ajoute des tests automatiques pour chaque menace.

**Résultat.** Quatre faiblesses sont corrigées avant la mise en production, pour un coût de quelques jours.

**Limites.** Une mesure décidée n'est utile que si elle est vérifiée : le registre est relu à la livraison, et les tests couvrent chaque ligne.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifient les lettres STRIDE ?
2. **Compréhension.** Qu'est-ce qu'une frontière de confiance ?
3. **Compréhension.** Quelles sont les quatre réponses possibles à une menace ?
4. **Pourquoi.** Pourquoi la modélisation doit-elle être répétée ?
5. **Raisonnement pratique.** Un administrateur peut supprimer le journal d'audit de son tenant. Quelles catégories STRIDE sont concernées ?

#### Réponses

1. Usurpation, falsification, répudiation, divulgation d'information, déni de service, élévation de privilège.
2. Une ligne où le niveau de confiance change, par exemple entre Internet et la plateforme, ou entre deux tenants.
3. Éliminer, réduire, transférer ou accepter.
4. Parce que le système évolue : chaque fonction ajoutée crée de nouveaux flux et de nouvelles frontières à examiner.
5. La répudiation (on ne peut plus prouver les actions) et la falsification (altération d'une trace), avec une conséquence sur la responsabilité.

## 11.3 Chiffrement

### 1. Comprendre simplement

Le **chiffrement** (*encryption*) transforme une donnée en une forme **illisible** sans la **clé** qui permet de la restaurer. On l'applique aux données **stockées** (*at rest*), aux données qui **circulent** (*in transit*), et, de façon plus rare, aux données **en cours d'utilisation** (*in use*).

**Pourquoi cela existe.** Les supports de stockage peuvent être volés, copiés ou mal configurés ; les réseaux peuvent être écoutés. Le chiffrement garantit que la simple possession des données, sans la clé, ne donne pas accès à leur contenu.

**Problème résolu.** Protéger la confidentialité des données (et, avec le chiffrement authentifié, leur intégrité) contre ceux qui accèdent au support ou au réseau sans être autorisés.

**Modèle mental.** Une lettre dans une enveloppe scellée avec une serrure : celui qui l'intercepte ne peut pas la lire sans la clé du destinataire.

**Où l'analogie s'arrête.** Une enveloppe protège un message pendant le transport. Le chiffrement n'empêche pas un utilisateur légitime, ou une application compromise qui détient la clé, de lire les données en clair.

**Exemple.** Les communications avec l'API passent par TLS. Les fichiers joints sont chiffrés avec une clé propre à chaque tenant. Les sauvegardes sont chiffrées avant d'être envoyées dans une autre région.

**Les composants.**

1. un **algorithme** éprouvé ;
2. des **clés** gérées avec soin (voir [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés)) ;
3. un **périmètre** (transport, stockage, champ) ;
4. une **politique** de rotation et de recouvrement.

**Objectif d'apprentissage :** vous pouvez distinguer chiffrement symétrique et asymétrique, expliquer le chiffrement à enveloppe et dire ce que le chiffrement ne protège pas.

### 2. Connaissances essentielles

#### Définition

Le **chiffrement** est une opération cryptographique qui transforme un texte clair en un texte chiffré à l'aide d'un algorithme et d'une clé, de sorte que seule la possession de la clé appropriée permet l'opération inverse (déchiffrement).

#### Idées fondamentales

1. **La sécurité repose sur la clé, pas sur le secret de l'algorithme.** On utilise des algorithmes publics et éprouvés.
2. **Symétrique : une clé pour chiffrer et déchiffrer.** Rapide, adapté aux grandes quantités de données.
3. **Asymétrique : une paire de clés.** Une publique, une privée ; utile pour l'échange de clés et les signatures.
4. **On chiffre à plusieurs niveaux.** En transit, au repos (disque, base), au niveau du champ ou de l'application.
5. **La gestion des clés est la partie difficile.** Un excellent algorithme avec une clé mal gardée ne protège rien (voir [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés)).
6. **On n'invente pas sa propre cryptographie.** On utilise des bibliothèques et des modes reconnus.

#### Vocabulaire essentiel

- **Texte clair** (*plaintext*) et **texte chiffré** (*ciphertext*).
- **Clé** (*key*) : valeur secrète qui paramètre le chiffrement.
- **AES** : algorithme de chiffrement symétrique standard, avec des clés de 128, 192 ou 256 bits.
- **RSA**, **courbes elliptiques** (*ECC*) : algorithmes asymétriques.
- **TLS** : protocole qui protège les communications sur Internet (version 1.3 décrite dans la RFC 8446).
- **Chiffrement authentifié** (*authenticated encryption*, par exemple AES-GCM) : chiffrement qui garantit aussi l'intégrité.
- **Chiffrement à enveloppe** (*envelope encryption*) : les données sont chiffrées par une clé de données, elle-même chiffrée par une clé maîtresse.
- **Vecteur d'initialisation** (*nonce*, *IV*) : valeur à usage unique associée à chaque chiffrement.

#### Relations de cause à effet

- Les données sont chiffrées, mais la clé est stockée à côté. Un attaquant qui vole le support emporte aussi la clé : le chiffrement ne protège rien.
- Un même nonce est réutilisé avec la même clé en mode GCM. La sécurité s'effondre, et le texte clair peut être déduit.
- Les clés ne sont jamais renouvelées. Une compromission ancienne reste exploitable indéfiniment.

#### Idées reçues

- **« Chiffrer, c'est sécuriser. »** Non. Le chiffrement ne protège pas contre un accès légitime détourné, un contrôle d'accès défaillant ou une application compromise.
- **« Un hachage est un chiffrement. »** Non. Le hachage est à sens unique (voir [4.4 Mot de passe](04-identite-iam-autorisation.md#44-mot-de-passe)) ; le chiffrement est réversible avec la clé.
- **« Le chiffrement au repos du disque suffit. »** Il protège contre le vol du support, mais pas contre un accès à la base par un compte autorisé ou compromis.

#### Principe clé

Utilisez des algorithmes standard, protégez et renouvelez les clés, et sachez précisément contre quelle menace chaque chiffrement protège.

#### Si vous ne retenez que trois choses

1. Le chiffrement protège contre ceux qui n'ont pas la clé, pas contre ceux qui l'ont.
2. Le chiffrement symétrique traite les données ; l'asymétrique sert à échanger les clés et à signer.
3. La gestion des clés détermine la valeur réelle du chiffrement.

### 3. Explication technique détaillée

#### Les niveaux de chiffrement

| Niveau | Ce qui est protégé | Menace couverte | Menace non couverte |
|---|---|---|---|
| En transit (TLS) | Le trafic réseau | Écoute, altération sur le réseau | Le point d'arrivée compromis |
| Au repos, disque ou volume | Le support de stockage | Vol de disque, mauvais rebut | Accès par le système en fonctionnement |
| Au repos, base de données | Fichiers de la base | Vol des fichiers de base | Requêtes d'un compte autorisé |
| Au niveau du champ ou de l'application | Valeurs sensibles précises | Administrateur de base, copie de base | L'application elle-même quand elle déchiffre |
| Par tenant | Les données d'un tenant | Fuite d'une clé commune, effacement ciblé (voir [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)) | Même limites que ci-dessus |
| De bout en bout | Données lisibles seulement par les utilisateurs finaux | Le fournisseur lui-même | Perte de la clé : perte des données, recherche limitée |

#### Symétrique et asymétrique

| Critère | Symétrique | Asymétrique |
|---|---|---|
| Clés | Une seule, partagée | Une paire : publique et privée |
| Vitesse | Très rapide | Lente |
| Usage | Chiffrement des données | Échange de clés, signature, certificats |
| Exemple | AES-256-GCM | RSA, ECDSA, ECDH |

En pratique, on les combine : une session TLS utilise l'asymétrique pour s'accorder sur une clé de session, puis le symétrique pour chiffrer le trafic.

#### Le chiffrement à enveloppe

```text
Clé maîtresse (KEK), conservée dans un service de gestion des clés
        │ chiffre
        ▼
Clé de données (DEK), propre à un objet, un tenant, un fichier
        │ chiffre
        ▼
Données

Stockage : données chiffrées + DEK chiffrée par la KEK
Lecture  : demander au service de déchiffrer la DEK → déchiffrer les données
```

**Pourquoi cette structure.** Changer la clé maîtresse ne demande de rechiffrer que les petites clés de données, non les données elles-mêmes. Chaque tenant peut avoir sa propre clé de données (et sa propre clé maîtresse), ce qui permet l'effacement cryptographique et la révocation.

#### Le chiffrement authentifié

Un mode comme AES-GCM chiffre **et** produit une étiquette d'authentification : toute modification du texte chiffré est détectée au déchiffrement. On associe également des **données associées** (par exemple l'identifiant du tenant) non chiffrées mais authentifiées, ce qui lie le texte chiffré à son contexte.

```text
chiffrer(clé, nonce, texte_clair, données_associées = {tenant_id, resource_id})
  → texte_chiffré + étiquette
déchiffrer(...) échoue si le texte, le nonce ou les données associées ont changé
```

**Conséquence.** Un attaquant ne peut pas copier le texte chiffré d'un tenant dans l'enregistrement d'un autre : le déchiffrement échoue.

#### La recherche sur des données chiffrées

Un champ chiffré ne peut pas être indexé ni comparé simplement. Options :

- **ne pas chiffrer au niveau du champ** les champs à filtrer, et s'appuyer sur les droits ;
- ajouter un **index aveugle** (empreinte à clé du champ) pour la recherche d'égalité exacte ;
- limiter le chiffrement de champ aux données très sensibles qui ne sont pas filtrées.

#### Les points d'attention

| Point | Raison |
|---|---|
| TLS partout, y compris entre services internes | Zéro confiance interne (voir [11.5 Zero Trust](#115-zero-trust)) |
| Versions et suites de chiffrement à jour | Éviter les algorithmes obsolètes |
| Génération aléatoire sûre des clés et des nonces | Imprévisibilité |
| Agilité cryptographique | Pouvoir changer d'algorithme sans refonte |
| Chiffrement des sauvegardes et des exports | Ce sont des copies des données |
| Rotation et révocation des clés | Limiter l'exposition |

La normalisation de cryptographie résistante aux ordinateurs quantiques est en cours (publication de premiers standards par le NIST en 2024) : l'agilité cryptographique en prépare l'adoption.

**Contre-exemple.** Un mode de chiffrement par blocs sans vecteur d'initialisation (mode ECB). Des blocs de données identiques produisent des blocs chiffrés identiques, ce qui révèle la structure des données.

**Limites.** Le chiffrement a un coût (calcul, gestion des clés, complexité de recherche). On l'applique selon la sensibilité des données et les exigences contractuelles et réglementaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.1 La triade CIA](#111-la-triade-cia) | Il protège la confidentialité et, authentifié, l'intégrité |
| [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés) | La gestion des clés en conditionne l'efficacité |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Les clés par tenant permettent l'effacement cryptographique |
| [4.4 Mot de passe](04-identite-iam-autorisation.md#44-mot-de-passe) | Le hachage de mots de passe est une autre primitive |
| [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton) | La signature des jetons utilise la cryptographie asymétrique |
| [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration) | Les sauvegardes sont chiffrées |

### 5. Application pratique

**Situation initiale.** Une compagnie nationale exige que ses données soient chiffrées avec une clé qu'elle peut révoquer, et que le fournisseur ne puisse pas les lire hors des traitements autorisés.

**Problème.** Le chiffrement de disque de la base ne répond pas à cette exigence : il est géré par le fournisseur et transparent pour toute requête.

**Application du concept.** Chiffrement à enveloppe par tenant, avec une clé maîtresse que le client contrôle.

**Déroulé.**

1. Chaque ressource sensible est chiffrée avec une clé de données propre au tenant, avec le tenant et l'identifiant en données associées.
2. Les clés de données sont chiffrées par une clé maîtresse gérée dans un service de clés, dont le client contrôle l'accès.
3. À chaque lecture, la plateforme demande le déchiffrement de la clé de données, avec une trace.
4. Si le client révoque l'accès à sa clé maîtresse, la plateforme ne peut plus déchiffrer ses données.

**Résultat.** Le client garde un contrôle réel, et la révocation a un effet immédiat.

**Limites.** La révocation rend les données inaccessibles aussi à la plateforme et au client : une procédure de rétablissement et des sauvegardes de clé sont indispensables.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre chiffrement symétrique et asymétrique ?
2. **Compréhension.** Qu'est-ce que le chiffrement à enveloppe ?
3. **Compréhension.** Que protège le chiffrement du disque, et que ne protège-t-il pas ?
4. **Pourquoi.** Pourquoi la gestion des clés est-elle plus critique que le choix de l'algorithme ?
5. **Raisonnement pratique.** Comment empêcher qu'un texte chiffré d'un tenant soit recopié dans l'enregistrement d'un autre ?

#### Réponses

1. Le symétrique utilise une seule clé pour chiffrer et déchiffrer ; l'asymétrique utilise une paire de clés, publique et privée.
2. Les données sont chiffrées par une clé de données, elle-même chiffrée par une clé maîtresse : changer la clé maîtresse ne demande de rechiffrer que les clés de données.
3. Il protège contre le vol du support ; il ne protège pas contre un accès légitime détourné, ou un compte autorisé qui lit les données en fonctionnement.
4. Parce que des algorithmes standards sont robustes, alors qu'une clé exposée, perdue ou jamais renouvelée annule toute la protection.
5. En utilisant un chiffrement authentifié avec des données associées qui incluent le tenant et l'identifiant : le déchiffrement échoue si le contexte diffère.

## 11.4 Secrets et gestion des clés

### 1. Comprendre simplement

Les **secrets** (*secrets*) sont les valeurs confidentielles qui permettent de s'authentifier, d'autoriser ou de déchiffrer : mots de passe, clés d'API, jetons, clés privées, certificats. La **gestion des clés** (*key management*) est l'ensemble des pratiques qui encadrent le **cycle de vie** des clés cryptographiques : génération, stockage, distribution, usage, rotation, révocation, destruction.

**Pourquoi cela existe.** Presque toute la sécurité repose sur des secrets : si un secret fuit, la protection qu'il assurait disparaît. Les secrets se retrouvent dans des endroits où ils ne devraient pas être : code, journaux, messages, images de conteneurs. Les protéger est un travail à part entière.

**Problème résolu.** Garder les secrets et les clés confidentiels, disponibles pour ceux qui en ont besoin, renouvelables et traçables.

**Modèle mental.** La salle des clés d'un grand hôtel : un registre, des armoires fermées, des clés qui ne sortent que pour qui y a droit, des doubles sous scellés, des clés qu'on change quand un employé part.

**Où l'analogie s'arrête.** Une clé physique est copiée difficilement. Un secret numérique se copie en une seconde, sans laisser de trace : la détection des fuites et la rotation sont donc essentielles.

**Exemple.** L'application ne contient aucun mot de passe de base de données. Elle demande, au démarrage, un identifiant temporaire à un coffre à secrets, valable une heure.

**Les composants.**

1. un **coffre à secrets** ;
2. un **service de gestion des clés** (éventuellement matériel) ;
3. des **politiques d'accès** ;
4. une **rotation** automatique ;
5. une **traçabilité** de chaque usage.

**Objectif d'apprentissage :** vous pouvez décrire une hiérarchie de clés, les bonnes pratiques de rotation, et la réaction à la fuite d'un secret.

### 2. Connaissances essentielles

#### Définition

- **Secret** : donnée dont la confidentialité conditionne la sécurité d'un système (mot de passe, jeton, clé privée).
- **Gestion des clés** : ensemble de processus et de systèmes qui contrôlent la génération, le stockage, la distribution, l'usage, le renouvellement, la sauvegarde, la révocation et la destruction des clés cryptographiques.

#### Idées fondamentales

1. **Aucun secret dans le code.** Ni dans les dépôts, ni dans les images, ni dans les journaux.
2. **Un coffre centralisé.** Les secrets sont stockés et distribués par un service dédié.
3. **Les clés forment une hiérarchie.** Clé racine, clés maîtresses, clés de données.
4. **La rotation est systématique.** Planifiée et à la demande.
5. **Les accès sont minimaux et tracés.** Chaque lecture d'un secret est journalisée.
6. **Les identifiants de courte durée valent mieux que les secrets durables.** Ils limitent l'exposition.

#### Vocabulaire essentiel

- **Coffre à secrets** (*secrets manager*, *vault*) : service qui stocke et distribue les secrets.
- **KMS** (*Key Management Service*) : service de gestion des clés cryptographiques.
- **HSM** (*Hardware Security Module*) : module matériel qui protège les clés et exécute les opérations cryptographiques.
- **KEK** et **DEK** (*key encryption key*, *data encryption key*) : clé qui chiffre des clés, et clé qui chiffre des données.
- **Rotation** (*rotation*) : remplacement planifié d'un secret ou d'une clé.
- **Identifiants dynamiques** (*dynamic secrets*) : secrets générés à la demande, de courte durée.
- **BYOK** (*bring your own key*) : le client fournit ou contrôle la clé de chiffrement de ses données.

#### Relations de cause à effet

- Un secret est inscrit dans le code. Il se retrouve dans tous les clones du dépôt, dans l'historique, dans les copies de travail, et ne peut plus être considéré confidentiel.
- Aucune rotation n'a lieu. Un secret volé il y a trois ans est toujours valide, et l'impact d'une fuite ancienne est total.
- La clé racine n'est pas sauvegardée. Sa perte rend irrécupérables toutes les données chiffrées dessous.

#### Idées reçues

- **« Un dépôt privé protège les secrets. »** Non. Des dizaines de personnes y ont accès, et l'historique conserve tout, même après suppression.
- **« Les variables d'environnement sont un coffre. »** Elles sont plus sûres qu'un fichier de code, mais elles apparaissent dans les journaux de plantage, les outils de diagnostic et les processus enfants.
- **« Rotation égale interruption de service. »** Avec deux secrets valides en parallèle pendant la transition, elle se fait sans interruption.

#### Principe clé

Un secret a un propriétaire, un emplacement unique, une durée de vie bornée, et sa lecture laisse une trace.

#### Si vous ne retenez que trois choses

1. Les secrets vivent dans un coffre, jamais dans le code ou les journaux.
2. Les clés sont organisées en hiérarchie ; les clés racines sont sauvegardées et protégées.
3. Rotation, révocation et traçabilité sont des fonctions normales, pas des opérations exceptionnelles.

### 3. Explication technique détaillée

#### La hiérarchie des clés

```text
Clé racine (dans un HSM, jamais exportée)
     │ chiffre
     ▼
Clés maîtresses (KEK) : par environnement, par région, par tenant
     │ chiffrent
     ▼
Clés de données (DEK) : par objet, fichier, lot
     │ chiffrent
     ▼
Données
```

**Avantages.** Une clé de niveau supérieur change rarement et reste très protégée ; les clés de données, nombreuses, sont renouvelées facilement.

#### Les types de secrets et leur traitement

| Secret | Durée de vie visée | Mode de gestion |
|---|---|---|
| Mot de passe de base de données | Minutes à heures (dynamique) | Coffre avec génération à la demande |
| Clé d'API d'intégration | Mois, avec rotation | Coffre, rotation avec recouvrement |
| Clé de signature des jetons | Semaines à mois | KMS, publication de plusieurs clés (voir [4.6 Session et jeton](04-identite-iam-autorisation.md#46-session-et-jeton)) |
| Certificat TLS | Mois à un an, renouvellement automatisé | Autorité de certification, automatisation |
| Clé de chiffrement de données | Années, avec rotation de la KEK | KMS, chiffrement à enveloppe |
| Secrets d'un tenant (identifiants d'intégration) | Selon le tenant | Coffre par tenant, jamais affichés après saisie |

#### L'accès au secret

```text
Application (identité de charge de travail)
   │ 1. s'authentifie auprès du coffre (identité attestée par la plateforme d'exécution)
   ▼
Coffre : vérifie la politique « cette charge de travail peut lire le secret S »
   │ 2. émet un identifiant temporaire (par exemple 1 h) ou la valeur du secret
   ▼
Application : utilise, ne persiste pas, ne journalise pas
   │
   ▼
Journal du coffre : qui, quel secret, quand, depuis où
```

**Pourquoi.** L'application n'a pas besoin de « connaître » un secret durable au démarrage : elle prouve son identité et reçoit ce dont elle a besoin, pour le temps nécessaire.

#### La rotation sans interruption

```text
1. Générer la nouvelle valeur (S2). S1 reste valide.
2. Déposer S2 dans le coffre.
3. Les consommateurs rechargent S2 (rechargement automatique ou redéploiement).
4. Vérifier qu'aucune requête n'utilise plus S1.
5. Révoquer S1.
```

Pour les clés de chiffrement, la rotation de la KEK ne rechiffre que les DEK. La rotation d'une DEK impose de rechiffrer les données qu'elle protège, souvent progressivement.

#### Les clés des tenants

| Modèle | Principe | Contrôle du client | Risque |
|---|---|---|---|
| Clé gérée par le fournisseur, par tenant | Une KEK par tenant, gérée par la plateforme | Faible | Dépendance au fournisseur |
| Clé du client (*BYOK*) | Le client importe ou délègue sa clé au service de clés | Moyen à fort | Perte ou révocation = perte d'accès |
| Clé conservée par le client (*HYOK*) | La clé reste chez le client, appelée à chaque opération | Très fort | Latence, disponibilité, limites fonctionnelles |

#### Le personnel et la séparation des tâches

- Personne ne connaît à lui seul une clé racine : elle est répartie ou protégée par du matériel avec **contrôle à plusieurs**.
- Les administrateurs du coffre ne sont pas ceux qui l'utilisent.
- Les opérations sensibles (export, destruction) exigent une approbation à deux (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)).

#### La réaction à la fuite d'un secret

```text
1. Révoquer ou désactiver le secret immédiatement
2. Émettre un nouveau secret et le distribuer
3. Examiner les journaux : l'ancien secret a-t-il été utilisé de façon anormale ?
4. Évaluer l'impact (données accessibles, autres secrets exposés)
5. Corriger la cause (où le secret a-t-il fuité ?)
6. Notifier selon les obligations (clients, autorités)
```

#### La détection

| Outil | Rôle |
|---|---|
| Analyse de secrets dans les dépôts et les commits | Détecte les clés inscrites par erreur |
| Analyse des journaux | Détecte les secrets imprimés |
| Surveillance des dépôts publics | Détecte des fuites de clés de la plateforme |
| Inventaire des secrets | Sait ce qui existe, qui possède quoi, quand a eu lieu la dernière rotation |

**Contre-exemple.** Un secret de signature de jetons identique pour la production, la préproduction et les développeurs, stocké dans un fichier de configuration du dépôt. N'importe quel développeur peut forger des jetons valides pour la production.

**Limites.** Un coffre est lui-même une cible et une dépendance critique : il doit être très disponible, sauvegardé, avec une procédure de reprise testée. Sa panne ne doit pas empêcher les services déjà démarrés de fonctionner, par une mise en cache sûre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.3 Chiffrement](#113-chiffrement) | Le chiffrement dépend de la gestion des clés |
| [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) | Les identités non humaines reposent sur des secrets ou des certificats |
| [4.7 Clé d'API](04-identite-iam-autorisation.md#47-clé-dapi) | Les clés d'API sont des secrets à gérer |
| [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant) | Détruire la clé d'un tenant permet l'effacement cryptographique |
| [8.7 Configuration d'environnement](08-admin-control-plane.md#87-configuration-denvironnement) | La configuration d'environnement référence les secrets sans les contenir |
| [11.6 Cycle de développement sécurisé et gestion des vulnérabilités](#116-cycle-de-développement-sécurisé-et-gestion-des-vulnérabilités) | L'analyse de secrets fait partie du cycle de développement sécurisé |

### 5. Application pratique

**Situation initiale.** Un audit de sécurité trouve dans le dépôt de code des mots de passe de base de données de préproduction, une clé d'un service de messagerie et un certificat privé.

**Problème.** Ils sont dans l'historique du dépôt, copiés sur une cinquantaine de postes, et la clé de messagerie est identique en production.

**Application du concept.** Rotation immédiate, migration vers un coffre, prévention de la récidive.

**Déroulé.**

1. L'équipe révoque et remplace les trois secrets, y compris celui de production.
2. Elle examine les journaux du service de messagerie sur 90 jours : aucun usage anormal.
3. Elle migre les secrets vers un coffre ; les applications reçoivent des identifiants temporaires à leur démarrage.
4. Elle installe une analyse de secrets sur les commits, qui bloque toute inscription de secret.
5. Elle met en place une rotation automatique mensuelle des clés d'intégration.

**Résultat.** Les secrets exposés sont neutralisés, et la récidive est empêchée par des contrôles automatiques.

**Limites.** L'historique du dépôt contient toujours les anciennes valeurs : elles ne sont inoffensives que parce qu'elles ont été révoquées.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une hiérarchie de clés, et à quoi sert-elle ?
2. **Compréhension.** Qu'est-ce qu'un identifiant dynamique ?
3. **Compréhension.** Comment fait-on la rotation d'un secret sans interruption ?
4. **Pourquoi.** Pourquoi un secret inscrit dans le code reste-t-il compromis après sa suppression ?
5. **Raisonnement pratique.** Quelles sont les premières actions à la découverte d'une clé d'API dans un dépôt public ?

#### Réponses

1. Un empilement de clés où chaque niveau chiffre le suivant ; elle permet de changer les clés de haut niveau sans rechiffrer toutes les données et de limiter l'usage des clés racines.
2. Un secret généré à la demande, de courte durée, qui limite l'exposition en cas de fuite.
3. En faisant coexister l'ancien et le nouveau secret pendant la migration des consommateurs, puis en révoquant l'ancien.
4. Parce que l'historique du dépôt et les copies de travail conservent la valeur : seule sa révocation la neutralise.
5. Révoquer la clé, en émettre une nouvelle, examiner les journaux d'usage, évaluer l'impact, puis corriger la cause de la fuite.

## 11.5 Zero Trust

### 1. Comprendre simplement

Le **Zero Trust** (« confiance zéro ») est un modèle de sécurité selon lequel **aucune requête n'est digne de confiance du seul fait de son origine** : être « à l'intérieur du réseau » ne donne aucun droit. Chaque accès est **vérifié explicitement** (identité, appareil, contexte), accordé avec le **minimum de privilèges**, et l'on part du principe qu'une **compromission a déjà eu lieu ou aura lieu**.

**Pourquoi cela existe.** Le modèle classique du « château et des douves » protège le périmètre et fait confiance à l'intérieur. Mais avec le cloud, le travail à distance et les applications SaaS, le périmètre n'existe plus ; et un attaquant qui franchit la première barrière se déplace librement. Zero Trust retire la confiance implicite.

**Problème résolu.** Limiter l'impact d'une compromission et réduire les mouvements latéraux, en vérifiant chaque accès au lieu de se fier au réseau.

**Modèle mental.** Un immeuble où chaque porte intérieure exige un badge valide pour la personne et la zone, et non un immeuble où une fois passé le hall on circule partout.

**Où l'analogie s'arrête.** Des badges à chaque porte ralentissent les personnes. Dans un système, la vérification est automatique et rapide, mais elle suppose une identité forte pour chaque entité, humaine ou non.

**Exemple.** Le service de workflow appelle le moteur de ressources. L'appel porte une identité cryptographique de service, est chiffré, et le moteur vérifie que ce service a le droit précis d'effectuer cette transition pour ce tenant, à cet instant.

**Les piliers.**

1. **vérifier explicitement** (identité, appareil, contexte) ;
2. **moindre privilège** (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches)) ;
3. **supposer la compromission** (segmentation, détection, limitation de l'impact).

**Objectif d'apprentissage :** vous pouvez opposer le modèle de périmètre à Zero Trust et décrire comment l'appliquer entre services et pour les accès d'administration.

### 2. Connaissances essentielles

#### Définition

Le **Zero Trust** est une approche d'architecture de sécurité, décrite notamment dans la publication SP 800-207 du NIST, qui élimine la confiance implicite accordée à un utilisateur, un appareil ou un réseau, et exige une authentification et une autorisation strictes, à chaque accès, fondées sur le contexte.

#### Idées fondamentales

1. **La localisation réseau ne confère aucun droit.** Interne ou externe, la requête est vérifiée.
2. **L'identité est au centre.** Utilisateurs, appareils, services ont des identités fortes.
3. **L'accès est accordé par session ou par requête.** Pas une fois pour toutes.
4. **La politique est dynamique.** Elle tient compte de l'état de l'appareil, du comportement, du risque.
5. **Les droits sont minimaux.** Et limités dans le temps.
6. **On suppose la compromission.** Segmentation, chiffrement partout, détection.

#### Vocabulaire essentiel

- **Périmètre** (*perimeter*) : frontière réseau séparant l'intérieur de l'extérieur.
- **Mouvement latéral** (*lateral movement*) : déplacement d'un attaquant d'un système à un autre une fois entré.
- **Micro-segmentation** (*micro-segmentation*) : découpage fin du réseau et des accès.
- **Point de décision** et **point d'application** (*policy decision point*, *policy enforcement point*) : voir [4.1 IAM, authentification et autorisation](04-identite-iam-autorisation.md#41-iam-authentification-et-autorisation).
- **Proxy sensible à l'identité** (*identity-aware proxy*) : intermédiaire qui applique l'accès selon l'identité et le contexte.
- **État de l'appareil** (*device posture*) : niveau de conformité de l'appareil (mises à jour, chiffrement, gestion).
- **BeyondCorp** : modèle de Google qui a popularisé l'abandon du périmètre.

#### Relations de cause à effet

- Un service interne est compromis. Dans un modèle de périmètre, il peut appeler tous les autres sans contrôle ; avec Zero Trust, chaque appel est vérifié, et l'impact reste limité.
- Les appels internes sont en clair. Un attaquant présent dans le réseau les écoute et les modifie.
- Les droits d'un service sont larges « pour que ça marche ». Sa compromission donne accès à tout ce qu'il peut faire.

#### Idées reçues

- **« Zero Trust est un produit. »** Non. C'est une approche qui s'appuie sur plusieurs mesures (identité, chiffrement, segmentation, surveillance).
- **« Zero Trust signifie ne faire confiance à personne et tout bloquer. »** Non. Il s'agit de remplacer une confiance implicite par une confiance **évaluée** et limitée.
- **« Cela ne concerne que les utilisateurs. »** Les services, les appareils et les administrateurs en font partie, souvent d'abord.

#### Principe clé

Chaque accès est authentifié, autorisé et limité, quel que soit l'endroit d'où il vient ; la compromission d'un composant ne donne pas accès aux autres.

#### Si vous ne retenez que trois choses

1. Zero Trust remplace la confiance fondée sur la localisation par une vérification à chaque accès.
2. Il repose sur des identités fortes, le chiffrement partout et les droits minimaux.
3. Il suppose la compromission : segmentation et détection limitent l'impact.

### 3. Explication technique détaillée

#### Périmètre et Zero Trust

| Critère | Modèle de périmètre | Zero Trust |
|---|---|---|
| Confiance | Accordée à l'intérieur du réseau | Jamais implicite |
| Vérification | À l'entrée | À chaque accès |
| Réseau interne | Considéré sûr | Considéré hostile |
| Accès des services entre eux | Larges, par adresse | Précis, par identité |
| Compromission d'un composant | Mouvement latéral facile | Impact limité par la segmentation |
| Accès à distance | VPN donnant accès au réseau | Accès par application, selon l'identité et l'appareil |

#### Les principes (NIST SP 800-207)

1. Toutes les sources de données et tous les services de calcul sont des ressources.
2. Toutes les communications sont sécurisées, quel que soit l'emplacement réseau.
3. L'accès est accordé par session, ressource par ressource.
4. L'accès est déterminé par une politique dynamique (identité, appareil, comportement, contexte).
5. L'organisation surveille et mesure l'intégrité et l'état de sécurité de ses ressources.
6. L'authentification et l'autorisation sont dynamiques et strictement appliquées avant l'accès.
7. L'organisation collecte des informations pour améliorer sa posture de sécurité.

#### L'application aux services de la plateforme

```text
Service A ──► [mTLS : identité de A vérifiée] ──► Service B
                         │
                         ▼
        Point d'application chez B :
           - qui appelle ? (identité cryptographique de A, certificat à courte durée)
           - quel tenant, quelle opération ?
           - A a-t-il le droit de faire cette opération ? (politique, voir l'entrée 4.18)
           - limites de débit et de volume
           - journalisation de la décision
```

| Mesure | Détail |
|---|---|
| Identités de service | Certificats à courte durée, identité de charge de travail (voir [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines)) |
| Chiffrement interne | TLS mutuel entre services |
| Autorisation par appel | Un service n'a que les droits dont il a besoin |
| Segmentation | Les services ne peuvent joindre que ceux avec lesquels ils échangent |
| Pas de secrets partagés larges | Identifiants par service, de courte durée |
| Journalisation des décisions | Pour la détection et l'audit |

#### L'accès des administrateurs et des opérateurs

| Mesure | Détail |
|---|---|
| Identité forte | Second facteur résistant à l'hameçonnage |
| Appareil conforme | Géré, à jour, chiffré |
| Accès par application | Pas de VPN large : un proxy sensible à l'identité expose les seuls outils nécessaires |
| Élévation à la demande | Droits accordés pour une durée courte, avec motif |
| Enregistrement des sessions | Traçabilité des accès privilégiés (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)) |

#### La démarche de mise en œuvre

```text
1. Inventorier : actifs, flux, identités, dépendances
2. Renforcer l'identité : MFA, identités de service, gestion des appareils
3. Chiffrer : TLS partout, y compris à l'intérieur
4. Segmenter : limiter les flux autorisés au nécessaire
5. Appliquer des politiques d'accès par requête : décisions centralisées, journalisées
6. Surveiller : détection d'anomalies, corrélation
7. Itérer : par domaine, en commençant par les plus sensibles
```

#### Les mesures d'une plateforme multi-tenant

Le Zero Trust rejoint l'isolation des tenants : le contexte de tenant est vérifié à chaque frontière (voir [5.3 Contexte de tenant](05-multi-tenancy-modele-entreprise.md#53-contexte-de-tenant)), les accès inter-tenants sont des exceptions tracées (voir [5.9 Administration inter-tenants](05-multi-tenancy-modele-entreprise.md#59-administration-inter-tenants)), et les extensions tierces s'exécutent avec des droits minimaux (voir [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés)).

**Contre-exemple.** Un réseau interne « de confiance » où tous les services s'appellent en clair, avec un jeton partagé unique et sans autorisation par appel. Un attaquant qui compromet le service le moins protégé (un outil de génération de rapports) accède à toute la plateforme.

**Limites.** La migration est progressive et coûteuse : identités de service, gestion de certificats, politiques fines, compétences. On avance par domaines, en commençant par les ressources et les accès les plus sensibles.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) | Le moindre privilège en est un pilier |
| [4.18 PBAC](04-identite-iam-autorisation.md#418-pbac) | Les politiques évaluées par un moteur appliquent les décisions |
| [4.3 Identités non humaines](04-identite-iam-autorisation.md#43-identités-non-humaines) | Les identités non humaines en sont la base |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) | L'isolation des tenants applique la même idée à chaque couche |
| [11.3 Chiffrement](#113-chiffrement) | Le chiffrement en transit partout y contribue |
| [11.2 Modélisation des menaces](#112-modélisation-des-menaces) | La modélisation des menaces identifie où appliquer des vérifications |

### 5. Application pratique

**Situation initiale.** Un incident montre que le service d'exports, compromis par une dépendance vulnérable, pouvait appeler tous les autres services internes avec un jeton partagé.

**Problème.** La compromission d'un composant secondaire donne accès à l'ensemble de la plateforme.

**Application du concept.** Identités de service, autorisation par appel et segmentation.

**Déroulé.**

1. Chaque service reçoit un certificat à courte durée et une identité propre.
2. Les appels internes passent en TLS mutuel, avec autorisation selon l'identité appelante.
3. Le service d'exports n'a plus que le droit de lire certaines ressources, via l'API, avec un jeton du tenant demandeur.
4. Le réseau est segmenté : le service d'exports ne peut joindre que le moteur de ressources et le stockage.
5. Les décisions d'accès sont journalisées et alimentent la détection d'anomalies.

**Résultat.** Un nouveau compromis du service d'exports aurait un impact limité à ce que ce service est autorisé à faire pour un tenant précis.

**Limites.** La gestion de certificats et de politiques ajoute de la complexité, d'où l'automatisation indispensable.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle hypothèse du modèle de périmètre Zero Trust abandonne-t-il ?
2. **Compréhension.** Qu'est-ce qu'un mouvement latéral ?
3. **Compréhension.** Citez trois mesures d'application de Zero Trust entre services.
4. **Pourquoi.** Pourquoi suppose-t-on la compromission ?
5. **Raisonnement pratique.** Un administrateur accède à la console depuis un ordinateur personnel non géré. Que décide une politique Zero Trust ?

#### Réponses

1. L'hypothèse que ce qui est à l'intérieur du réseau est digne de confiance.
2. Le déplacement d'un attaquant d'un système à un autre après une première intrusion.
3. Par exemple : identités de service à courte durée, TLS mutuel, autorisation par appel, segmentation.
4. Pour concevoir des protections qui limitent l'impact d'une intrusion déjà réalisée, plutôt que de compter uniquement sur la prévention.
5. De refuser, ou de limiter l'accès, parce que l'état de l'appareil n'est pas conforme ; l'accès exige un appareil géré et un second facteur fort.

## 11.6 Cycle de développement sécurisé et gestion des vulnérabilités

### 1. Comprendre simplement

Le **cycle de développement sécurisé** (*Secure SDLC*, *secure software development lifecycle*) consiste à **intégrer des activités de sécurité à chaque étape** de la production logicielle : exigences, conception, code, test, livraison, exploitation. La **gestion des vulnérabilités** (*vulnerability management*) est le processus continu qui consiste à **repérer, évaluer, hiérarchiser, corriger et vérifier** les faiblesses des logiciels et des infrastructures.

**Pourquoi cela existe.** Une faille corrigée au moment de la conception coûte peu ; la même faille exploitée en production coûte très cher. De plus, un logiciel moderne s'appuie sur des centaines de dépendances externes dont chacune peut contenir une vulnérabilité découverte après coup.

**Problème résolu.** Réduire le nombre de vulnérabilités introduites, et corriger vite et dans le bon ordre celles qui existent ou qui apparaissent.

**Modèle mental.** Le contrôle qualité d'une chaîne de fabrication aéronautique : des contrôles à chaque poste, pas seulement un contrôle final, et un suivi des alertes de sécurité sur les composants déjà livrés.

**Où l'analogie s'arrête.** Une pièce livrée ne change pas. Un logiciel évolue en continu, et ses dépendances aussi : le suivi est permanent.

**Exemple.** Une dépendance utilisée par le moteur d'import est signalée comme vulnérable. Le système l'identifie dans l'inventaire, évalue qu'elle est exposée à Internet, ouvre une correction avec un délai de 7 jours, et vérifie le déploiement.

**Les composants.**

1. des **activités de sécurité par phase** ;
2. des **outils d'analyse automatique** ;
3. un **inventaire** des composants et des actifs ;
4. un **processus de traitement** des vulnérabilités ;
5. des **indicateurs** de délai et de couverture.

**Objectif d'apprentissage :** vous pouvez décrire les activités de sécurité par phase, les familles d'outils, et un processus de hiérarchisation des vulnérabilités.

### 2. Connaissances essentielles

#### Définition

- **Cycle de développement sécurisé** : ensemble de pratiques qui intègrent la sécurité à toutes les phases du développement et de l'exploitation d'un logiciel.
- **Gestion des vulnérabilités** : processus récurrent d'identification, d'évaluation, de hiérarchisation, de traitement et de vérification des vulnérabilités.

#### Idées fondamentales

1. **La sécurité se construit, elle ne s'ajoute pas.** À chaque phase, des activités dédiées.
2. **L'automatisation est indispensable.** Les contrôles sont intégrés à la chaîne de livraison.
3. **Les dépendances sont des vulnérabilités potentielles.** Il faut les inventorier et les suivre.
4. **La hiérarchisation décide.** Gravité, exploitabilité, exposition, impact métier.
5. **Les délais de correction sont définis.** Par niveau de gravité.
6. **Les exceptions sont tracées.** Une vulnérabilité acceptée l'est explicitement et temporairement (voir [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve)).

#### Vocabulaire essentiel

- **SAST** (*Static Application Security Testing*) : analyse du code source.
- **DAST** (*Dynamic Application Security Testing*) : test de l'application en fonctionnement.
- **SCA** (*Software Composition Analysis*) : analyse des dépendances.
- **SBOM** (*Software Bill of Materials*) : nomenclature des composants d'un logiciel.
- **CVE** (*Common Vulnerabilities and Exposures*) : identifiant public d'une vulnérabilité connue.
- **CVSS** (*Common Vulnerability Scoring System*) : système normalisé de notation de la gravité.
- **Test d'intrusion** (*penetration test*) : attaque autorisée simulée.
- **Divulgation coordonnée** (*coordinated disclosure*) : processus de signalement et de correction avant publication.

#### Relations de cause à effet

- Les analyses sont faites seulement avant la mise en production. Des défauts de conception profonds sont découverts à un moment où les corriger est très coûteux.
- Les dépendances ne sont pas inventoriées. Quand une vulnérabilité majeure est annoncée, on ne sait pas si l'on est concerné ni où.
- Tout est traité selon la seule gravité technique. Des vulnérabilités critiques non exposées consomment les équipes pendant que des failles moyennes exposées restent ouvertes.

#### Idées reçues

- **« Un test d'intrusion annuel suffit. »** Il est utile, mais il donne un instantané : les contrôles doivent être continus.
- **« Corriger toutes les vulnérabilités est possible. »** Non. Le volume impose de hiérarchiser selon le risque réel.
- **« Les vulnérabilités sont dans notre code. »** Une part importante vient des dépendances et de l'infrastructure.

#### Principe clé

Intégrez la sécurité à chaque phase, inventoriez ce que vous exécutez, et corrigez en priorité ce qui est exploitable, exposé et important.

#### Si vous ne retenez que trois choses

1. La sécurité se pratique à chaque phase du cycle de développement, avec des contrôles automatisés.
2. Un inventaire des composants permet de savoir où une vulnérabilité s'applique.
3. La hiérarchisation par risque et des délais de correction rendent la gestion tenable.

### 3. Explication technique détaillée

#### Les activités par phase

| Phase | Activités de sécurité |
|---|---|
| Exigences | Exigences de sécurité et de conformité, classification des données |
| Conception | Modélisation des menaces (voir [11.2 Modélisation des menaces](#112-modélisation-des-menaces)), revue d'architecture |
| Développement | Normes de codage, revue de code, analyse statique, analyse de secrets |
| Dépendances | Analyse de composition, nomenclature (SBOM), contrôle des licences |
| Tests | Tests de sécurité automatisés, analyse dynamique, tests de contrat des droits |
| Livraison | Signature des artefacts, contrôle de l'infrastructure comme code, images durcies |
| Exploitation | Surveillance, gestion des correctifs, réponse aux incidents |
| Amélioration | Tests d'intrusion, programme de signalement de vulnérabilités, retour d'expérience |

Des référentiels structurent ces pratiques, par exemple le *Secure Software Development Framework* du NIST (SP 800-218), l'OWASP SAMM ou le *Security Development Lifecycle* de Microsoft.

#### Les familles d'outils

| Outil | Ce qu'il trouve | Limite |
|---|---|---|
| SAST | Motifs dangereux dans le code (injection, secrets) | Faux positifs, ne voit pas la configuration réelle |
| SCA | Dépendances vulnérables ou à licence problématique | Dépend de la qualité de l'inventaire |
| DAST | Faiblesses d'une application en fonctionnement | Couverture limitée aux parcours testés |
| Analyse de conteneurs et d'infrastructure | Images et configurations faibles | Contexte d'exécution |
| Analyse de secrets | Clés et mots de passe dans les dépôts | Valeurs non reconnues |
| Test d'intrusion | Failles de logique et chaînes d'attaque | Coûteux, ponctuel |
| Signalement par des chercheurs | Failles inconnues | Gestion du flux |

#### L'inventaire

On ne corrige pas ce que l'on ne connaît pas. L'inventaire contient :

- les **actifs** (services, bases, comptes, domaines) ;
- les **composants logiciels** de chaque service (nomenclature SBOM) ;
- les **propriétaires** et l'**exposition** (Internet, interne) ;
- la **criticité** (données traitées, tenants concernés).

#### La hiérarchisation

La note CVSS exprime la gravité technique d'une vulnérabilité, mais non le risque pour **votre** système. On la complète par :

| Facteur | Question |
|---|---|
| Exploitabilité | Existe-t-il un code d'exploitation public, une exploitation active observée ? |
| Exposition | Le composant est-il accessible depuis Internet ? Par un tenant ? |
| Contexte d'usage | La fonction vulnérable est-elle réellement utilisée ? |
| Impact métier | Quelles données, quels tenants, quelle conformité ? |
| Mesures compensatoires | Un contrôle existant bloque-t-il l'attaque ? |

#### Un exemple de délais de correction

| Niveau | Critère | Délai cible |
|---|---|---|
| Critique | Exploitable, exposé, impact fort | Quelques jours (7 jours au plus) |
| Élevé | Exploitable ou exposé, impact significatif | 30 jours |
| Moyen | Exploitation difficile ou impact limité | 90 jours |
| Faible | Peu d'impact | Selon le cycle normal |

Les valeurs sont illustratives : chaque organisation fixe les siennes selon son contexte et ses engagements.

#### Le processus

```text
Détecter ─► Qualifier ─► Hiérarchiser ─► Affecter ─► Corriger ─► Vérifier ─► Clôturer
(analyses,   (réelle ?    (risque,         (équipe,   (correctif,  (nouvelle     (preuve,
 signalements, applicable ?  délai)         date)     contournement) analyse)     indicateurs)
 bulletins)    exposée ?)
                                            └─► si impossible dans le délai : exception tracée
```

#### Les indicateurs

| Indicateur | Utilité |
|---|---|
| Âge des vulnérabilités ouvertes, par gravité | Respect des délais |
| Délai moyen de correction | Efficacité du processus |
| Couverture des analyses | Part des services scannés |
| Part de dépendances à jour | Santé de la chaîne d'approvisionnement |
| Nombre d'exceptions ouvertes | Dette acceptée |

#### La divulgation

Les chercheurs en sécurité doivent savoir comment signaler une faille. La plateforme publie une adresse de contact et une politique (par exemple un fichier `security.txt`, RFC 9116) et s'engage à répondre, corriger et remercier. Un programme de récompenses peut compléter le dispositif.

**Contre-exemple.** En décembre 2021, la vulnérabilité de la bibliothèque de journalisation Log4j (CVE-2021-44228) a touché un très grand nombre d'organisations. Celles qui n'avaient pas d'inventaire de leurs dépendances ont passé des jours à chercher où la bibliothèque était utilisée, y compris de façon indirecte.

**Limites.** Les outils produisent beaucoup de bruit. Sans hiérarchisation, une équipe croule sous les alertes et finit par les ignorer, ce qui est plus dangereux que de ne pas en recevoir.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.2 Modélisation des menaces](#112-modélisation-des-menaces) | La modélisation des menaces est une activité du cycle |
| [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés) | L'analyse de secrets protège les dépôts |
| [9.8 Exception et preuve](09-audit-versionnement-gouvernance.md#98-exception-et-preuve) | Les vulnérabilités acceptées sont des exceptions tracées |
| [10.12 Plugins, extensions et modules personnalisés](10-api-integrations-extensibilite.md#1012-plugins-extensions-et-modules-personnalisés) | Les plugins et leurs dépendances sont dans le périmètre |
| [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem) | Une vulnérabilité exploitée devient un incident |
| [9.7 Revue, demande de changement et approbation](09-audit-versionnement-gouvernance.md#97-revue-demande-de-changement-et-approbation) | Les changements de sécurité suivent la gouvernance des changements |

### 5. Application pratique

**Situation initiale.** Le moteur d'import utilise une bibliothèque de traitement de fichiers dans laquelle une vulnérabilité critique est annoncée un vendredi.

**Problème.** L'équipe ne sait pas quels services utilisent cette bibliothèque, ni s'ils sont exposés.

**Application du concept.** Un inventaire de composants, une hiérarchisation par exposition et un délai de correction.

**Déroulé.**

1. L'outil d'analyse de composition interroge l'inventaire : trois services utilisent la bibliothèque, dont un exposé à Internet (l'import).
2. L'équipe qualifie : la fonction vulnérable est utilisée pour les fichiers de type tableur ; exposition forte, impact : exécution de code.
3. Elle classe en « critique » avec un délai de 7 jours, et active une règle de filtrage temporaire qui refuse les fichiers de ce type.
4. Elle met à jour la dépendance, teste, déploie progressivement.
5. Une nouvelle analyse confirme la correction, et la règle temporaire est retirée.

**Résultat.** La vulnérabilité est corrigée en deux jours, avec une trace, sans fermer l'import pour tous.

**Limites.** La règle temporaire protège un chemin d'attaque connu ; la mise à jour reste nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que signifient SAST, DAST et SCA ?
2. **Compréhension.** À quoi sert une nomenclature des composants (SBOM) ?
3. **Compréhension.** Pourquoi la note CVSS ne suffit-elle pas à hiérarchiser ?
4. **Pourquoi.** Pourquoi intègre-t-on la sécurité à chaque phase plutôt qu'à la fin ?
5. **Raisonnement pratique.** Une vulnérabilité moyenne touche un composant exposé à Internet et activement exploité. Comment la traiter ?

#### Réponses

1. SAST analyse le code source ; DAST teste l'application en fonctionnement ; SCA analyse les dépendances.
2. À savoir exactement quels composants un logiciel contient, pour identifier rapidement où une vulnérabilité annoncée s'applique.
3. Parce qu'elle mesure la gravité technique, pas le risque pour votre contexte : exposition, exploitation active et impact métier comptent aussi.
4. Parce que corriger tôt coûte moins cher, et que certaines faiblesses de conception ne se corrigent plus facilement en fin de projet.
5. La traiter en priorité élevée malgré sa note moyenne : exposition et exploitation active augmentent fortement le risque réel.

## 11.7 Disponibilité, fiabilité et résilience

### 1. Comprendre simplement

Trois mots, trois idées. La **disponibilité** (*availability*) est la proportion du temps où le service est **utilisable**. La **fiabilité** (*reliability*) est la capacité du service à **fonctionner correctement dans la durée**, sans défaillance. La **résilience** (*resilience*) est la capacité à **absorber une perturbation, continuer, et se rétablir**.

**Pourquoi cela existe.** Les clients organisent leur activité sur la plateforme : une indisponibilité les arrête. Il faut donc définir, mesurer et concevoir ce qu'on promet, avec des mots précis.

**Problème résolu.** Parler précisément de la tenue du service, la mesurer et décider des investissements.

**Modèle mental.** Un ascenseur : il est **disponible** quand il répond à l'appel, **fiable** s'il tombe rarement en panne et ne s'arrête pas entre deux étages, **résilient** si, en cas de panne, il se met en sécurité, signale, et repart vite, ou si l'escalier prend le relais.

**Où l'analogie s'arrête.** Un ascenseur est un objet simple. Une plateforme est composée de nombreux éléments dont les pannes se combinent, et dont les dépendances sont souvent hors de son contrôle.

**Exemple.** Une plateforme disponible 99,9 % du mois a été indisponible environ 43 minutes. Si ces 43 minutes sont dues à une seule panne longue ou à vingt micro-pannes, l'expérience des clients est très différente, bien que la disponibilité soit identique.

**Les trois notions.**

1. **disponibilité** : le service répond ;
2. **fiabilité** : il répond correctement, durablement ;
3. **résilience** : il encaisse et se remet.

**Objectif d'apprentissage :** vous pouvez calculer une disponibilité, traduire un pourcentage en durée d'indisponibilité, et composer des disponibilités en série ou en parallèle.

### 2. Connaissances essentielles

#### Définition

- **Disponibilité** : proportion du temps, ou des requêtes, pour lesquelles le service est opérationnel et utilisable.
- **Fiabilité** : probabilité qu'un système remplisse sa fonction de façon correcte sans défaillance pendant une durée donnée.
- **Résilience** : capacité d'un système à résister à des perturbations, à continuer de fournir un service acceptable et à revenir à un fonctionnement normal.

#### Idées fondamentales

1. **Les pannes sont inévitables.** On conçoit pour leur survenue.
2. **La disponibilité dépend aussi de la rapidité de rétablissement.** Pas seulement de la fréquence des pannes.
3. **Les « neuf » se traduisent en minutes.** Chaque neuf supplémentaire est dix fois plus exigeant.
4. **La disponibilité se compose.** En série, elle diminue ; en parallèle, elle augmente.
5. **On la mesure du point de vue de l'utilisateur.** Requêtes réussies, pas seulement serveurs allumés.
6. **Le niveau visé est un compromis.** Coût, complexité, besoin réel.

#### Vocabulaire essentiel

- **MTBF** (*Mean Time Between Failures*) : durée moyenne entre deux pannes.
- **MTTR** (*Mean Time To Repair*, *Recover*) : durée moyenne de rétablissement.
- **Les « neuf »** (*nines*) : expression de la disponibilité (99 %, 99,9 %, 99,99 %).
- **Point de défaillance unique** (*single point of failure*, *SPOF*) : composant dont la panne arrête le service.
- **Disponibilité planifiée** et **non planifiée** : arrêts programmés et pannes.
- **Mode de défaillance** (*failure mode*) : manière dont un composant peut tomber en panne.

#### Relations de cause à effet

- Les pannes sont rares mais très longues à réparer. La disponibilité est faible malgré une bonne fiabilité : réduire le temps de rétablissement est le levier.
- Un service dépend de nombreux autres en série. Sa disponibilité est inférieure à celle du moins disponible de ses composants.
- La disponibilité est mesurée par l'état des serveurs. Une application qui répond avec des erreurs est « disponible » pour l'outil, mais pas pour l'utilisateur.

#### Idées reçues

- **« 99,9 %, c'est presque 100 %. »** C'est environ 8,8 heures d'indisponibilité par an ; 99 % en représente près de 88.
- **« Plus de serveurs, plus de disponibilité. »** Pas automatiquement : des pannes corrélées (même configuration, même logiciel) touchent tous les serveurs à la fois.
- **« La disponibilité, c'est l'infrastructure. »** C'est aussi le code, les déploiements, la configuration, les dépendances externes et les opérations.

#### Principe clé

La disponibilité est le produit de la fréquence des pannes par la rapidité de rétablissement, composée sur l'ensemble des dépendances, mesurée du point de vue de l'utilisateur.

#### Si vous ne retenez que trois choses

1. Disponibilité, fiabilité et résilience se distinguent et se complètent.
2. La disponibilité se calcule : $\text{MTBF} / (\text{MTBF} + \text{MTTR})$, et se compose en série ou en parallèle.
3. Réduire le temps de rétablissement est souvent plus efficace que réduire la fréquence des pannes.

### 3. Explication technique détaillée

#### La formule de disponibilité

$$A = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}$$

**Exemple chiffré.** Un composant tombe en panne en moyenne tous les 1 000 heures et est rétabli en 2 heures : $A = 1\,000 / 1\,002 \approx 99{,}80\,\%$. En ramenant le rétablissement à 20 minutes ($\approx 0{,}33$ h), $A \approx 99{,}97\,\%$ : le gain vient de la rapidité.

#### La traduction des « neuf »

| Disponibilité | Indisponibilité par an | Par mois (30 jours) | Par semaine |
|---|---|---|---|
| 99 % | 3,65 jours | 7,2 heures | 1,7 heure |
| 99,9 % | 8,8 heures | 43,2 minutes | 10,1 minutes |
| 99,95 % | 4,4 heures | 21,6 minutes | 5,0 minutes |
| 99,99 % | 52,6 minutes | 4,3 minutes | 1,0 minute |
| 99,999 % | 5,3 minutes | 26 secondes | 6 secondes |

#### La composition

**En série** (toutes les dépendances sont nécessaires) :

$$A_{\text{série}} = \prod_{i=1}^{n} A_i$$

**En parallèle** (une seule instance suffit, pannes indépendantes) :

$$A_{\text{parallèle}} = 1 - \prod_{i=1}^{n} (1 - A_i)$$

**Exemples chiffrés.**

- Série : passerelle (99,99 %) × moteur (99,95 %) × base (99,95 %) $\approx 99{,}89\,\%$.
- Parallèle : deux instances à 99,9 % chacune, indépendantes : $1 - 0{,}001^2 = 99{,}9999\,\%$.

La seconde valeur est un maximum théorique : en pratique, des causes communes (même version déployée, même zone, même configuration) rendent les pannes corrélées et limitent le gain.

#### La disponibilité vue de l'utilisateur

$$A_{\text{utilisateur}} = \frac{\text{requêtes réussies}}{\text{requêtes totales}}$$

On compte comme échec une réponse en erreur ou trop lente (au-delà d'un seuil de latence), pas seulement une absence de réponse. C'est le fondement des indicateurs de niveau de service (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)).

#### Les causes d'indisponibilité

| Famille | Exemples | Réponse |
|---|---|---|
| Changements | Déploiement défectueux, configuration erronée | Déploiement progressif, retour arrière rapide |
| Défaillances matérielles ou d'infrastructure | Serveur, disque, zone | Redondance (voir [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement)) |
| Dépendances | Service tiers, fournisseur d'identité | Dégradation maîtrisée (voir [11.9 Dégradation progressive](#119-dégradation-progressive)) |
| Charge | Pic, voisin bruyant | Limites, capacité (voir [11.17 Planification de capacité](#1117-planification-de-capacité)) |
| Données | Corruption, suppression accidentelle | Sauvegardes (voir [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration)) |
| Humaines | Erreur d'opération | Garde-fous, automatisation |
| Malveillantes | Déni de service, rançongiciel | Défenses, sauvegardes immuables |

Une part très importante des indisponibilités provient de **changements**. Réduire leur risque (déploiements progressifs, drapeaux, retours arrière) est souvent le meilleur investissement.

#### Disponibilité par tenant

Une plateforme multi-tenant peut avoir une disponibilité globale élevée et une disponibilité par tenant très inégale (un tenant touché par un problème qui lui est propre). On suit les deux, car un client juge son propre vécu.

**Contre-exemple.** Annoncer « 99,99 % de disponibilité » en mesurant uniquement si le serveur répond au test de santé, alors que les utilisateurs reçoivent des erreurs depuis deux heures sur une fonction clé. La valeur affichée est belle, la confiance s'effondre.

**Limites.** Chaque neuf supplémentaire coûte de plus en plus cher (redondance, régions multiples, complexité). Le niveau doit répondre à un besoin réel et à ce que les dépendances externes permettent d'atteindre.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | La composition en série reprend l'exemple des systèmes distribués |
| [11.1 La triade CIA](#111-la-triade-cia) | La disponibilité est la troisième propriété de la triade |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | La redondance en est le moyen principal |
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | Les SLO formalisent l'objectif de disponibilité |
| [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto) | Le temps de rétablissement relève du RTO |
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | Les cellules limitent l'étendue des pannes |

### 5. Application pratique

**Situation initiale.** La plateforme promet 99,9 % de disponibilité mensuelle. Un mois, elle a connu deux pannes de 25 minutes chacune.

**Problème.** Le client estime que l'engagement est respecté (50 minutes sur 43,2 permises : non, il est dépassé), et les équipes veulent savoir où agir.

**Application du concept.** Calcul, analyse des causes et choix du levier.

**Déroulé.**

1. Le budget d'erreur mensuel est de 43,2 minutes ; les deux pannes totalisent 50 minutes : l'objectif est dépassé de 6,8 minutes.
2. L'analyse montre que les deux pannes viennent de déploiements défectueux, détectés après 10 minutes et rétablis en 15.
3. L'équipe retient deux leviers : déploiement par vagues avec détection automatique des erreurs (détection en 2 minutes), et retour arrière automatique (rétablissement en 3 minutes).
4. Avec ces valeurs, chaque panne comparable durerait environ 5 minutes.

**Résultat.** Le temps de rétablissement est divisé par cinq, sans multiplier l'infrastructure.

**Limites.** Le risque de défaillance des déploiements reste ; la mesure doit continuer, et l'objectif doit rester réaliste.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre disponibilité et fiabilité ?
2. **Compréhension.** Combien d'indisponibilité par mois autorise un objectif de 99,9 % ?
3. **Compréhension.** Quelle est la disponibilité de trois services en série à 99,9 % chacun ?
4. **Pourquoi.** Pourquoi réduire le MTTR est-il souvent plus efficace que réduire la fréquence des pannes ?
5. **Raisonnement pratique.** Deux instances indépendantes à 99,5 % sont en parallèle. Quelle est la disponibilité théorique ?

#### Réponses

1. La disponibilité mesure la proportion du temps où le service est utilisable ; la fiabilité, sa capacité à fonctionner correctement sans défaillance dans la durée.
2. Environ 43 minutes sur un mois de 30 jours.
3. $0{,}999^3 \approx 99{,}7\,\%$.
4. Parce que la disponibilité dépend du rapport entre durée de fonctionnement et durée de rétablissement : une panne rare mais longue pèse plus qu'une panne fréquente mais très courte.
5. $1 - 0{,}005^2 = 99{,}9975\,\%$, en supposant les pannes indépendantes.

## 11.8 Tolérance aux pannes, redondance et basculement

### 1. Comprendre simplement

La **tolérance aux pannes** (*fault tolerance*) est la capacité d'un système à **continuer de fonctionner correctement malgré la défaillance** de certains de ses composants. La **redondance** (*redundancy*) consiste à **dupliquer** des composants ou des capacités pour qu'un autre puisse prendre le relais. Le **basculement** (*failover*) est le passage effectif sur le composant de secours quand une défaillance est détectée.

**Pourquoi cela existe.** Tout composant finit par tomber en panne. Si un seul exemplaire suffit à faire fonctionner le service, sa panne arrête tout : c'est un point de défaillance unique. La redondance transforme une panne en un incident que l'utilisateur ne voit pas.

**Problème résolu.** Éliminer les points de défaillance uniques et maintenir le service malgré les pannes.

**Modèle mental.** Un avion de ligne : plusieurs moteurs, plusieurs circuits hydrauliques, des instruments en double. En cas de panne d'un élément, un autre prend le relais, souvent sans que les passagers le remarquent.

**Où l'analogie s'arrête.** Les systèmes d'un avion sont conçus ensemble et testés selon des normes strictes. Une plateforme logicielle évolue en permanence : la redondance doit être testée régulièrement, sinon elle ne fonctionne pas le jour où l'on en a besoin.

**Exemple.** La base de données principale a une réplique synchrone dans une autre zone. En cas de panne de la zone, le système bascule automatiquement sur la réplique en moins d'une minute.

**Les composants.**

1. des **composants dupliqués** ;
2. une **détection de panne** ;
3. un **mécanisme de bascule** ;
4. une **synchronisation des données** ;
5. des **tests réguliers**.

**Objectif d'apprentissage :** vous pouvez décrire les modèles de redondance, le rôle du quorum et les pièges des pannes corrélées.

### 2. Connaissances essentielles

#### Définition

- **Tolérance aux pannes** : propriété d'un système qui continue à fournir son service, éventuellement avec des performances réduites, malgré la défaillance d'un ou plusieurs composants.
- **Redondance** : présence de composants, de chemins ou de données en plusieurs exemplaires pour permettre la continuité du service.
- **Basculement** : opération qui transfère la charge d'un composant défaillant à un composant de secours, automatiquement ou sur décision.

#### Idées fondamentales

1. **Chaque composant critique est dupliqué.** Sinon c'est un point de défaillance unique.
2. **La détection est aussi critique que la duplication.** Un secours qui ne sait pas qu'il doit agir ne sert à rien.
3. **Les données doivent être répliquées.** Et la réplication a des conséquences sur la perte possible.
4. **Les pannes corrélées annulent la redondance.** Même version, même zone, même configuration.
5. **La redondance se teste.** Un basculement jamais exercé échoue souvent.
6. **Plus de redondance, plus de complexité.** Chaque mécanisme de bascule est lui-même un risque.

#### Vocabulaire essentiel

- **Actif–actif** (*active–active*) : toutes les instances traitent la charge.
- **Actif–passif** (*active–passive*) : une instance traite, l'autre attend en secours.
- **Secours chaud, tiède, froid** (*hot*, *warm*, *cold standby*) : degré de préparation du secours.
- **N+1** : une instance de secours pour $N$ instances nécessaires.
- **Quorum** : nombre minimal de participants qui doivent s'accorder pour décider.
- **Cerveau divisé** (*split brain*) : deux parties du système croient chacune être la principale.
- **Isolement** (*fencing*) : mécanisme qui empêche l'ancienne principale d'agir.
- **Zone de disponibilité** (*availability zone*) : ensemble d'infrastructures isolées dans une région.

#### Relations de cause à effet

- La redondance est dans une seule zone. Une panne de zone arrête tout malgré les exemplaires multiples.
- Deux instances sont mises à jour simultanément avec une même version défectueuse. Elles tombent ensemble : la redondance n'a rien apporté.
- Le basculement est automatique mais mal calibré. Une latence passagère le déclenche inutilement, ce qui crée une interruption pire que la panne.

#### Idées reçues

- **« Deux serveurs, c'est redondant. »** Seulement s'ils sont indépendants (zones, alimentations, déploiements) et si la bascule fonctionne.
- **« La réplication est une sauvegarde. »** Non. Une suppression ou une corruption est répliquée à l'identique (voir [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration)).
- **« Un basculement automatique est toujours préférable. »** Il est plus rapide, mais il peut aggraver une situation ambiguë (partition réseau). Certains systèmes préfèrent un basculement manuel.

#### Principe clé

Éliminez les points de défaillance uniques par une redondance indépendante, détectez les pannes de façon fiable, et exercez régulièrement la bascule.

#### Si vous ne retenez que trois choses

1. La redondance supprime les points de défaillance uniques, à condition que les composants soient indépendants.
2. Détection fiable, quorum et isolement évitent les bascules intempestives et les cerveaux divisés.
3. Une redondance non testée n'est qu'une hypothèse.

### 3. Explication technique détaillée

#### Les modèles de redondance

| Modèle | Principe | Temps de reprise | Coût | Usage |
|---|---|---|---|---|
| Actif–actif | Plusieurs instances servent simultanément | Quasi nul | Élevé (capacité partagée) | Services sans état, très disponibles |
| Actif–passif, secours chaud | Une instance sert, l'autre est prête et synchronisée | Secondes à minute | Moyen | Bases de données, services avec état |
| Secours tiède | Secours démarré, données à rattraper | Minutes | Moyen à faible | Environnements moins critiques |
| Secours froid | Environnement à construire | Heures | Faible | Reprise après sinistre (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)) |
| N+1 | Une instance de plus que nécessaire | Immédiat pour une panne | Faible | Parcs de serveurs homogènes |

#### La redondance géographique

```text
Région A                                          Région B
┌────────────────────────────────────┐            ┌────────────────────────────────────┐
│ Zone 1      Zone 2      Zone 3     │            │ Zone 1      Zone 2      Zone 3     │
│ instance    instance    instance   │ ◄────────► │ instance    instance    instance   │
└────────────────────────────────────┘            └────────────────────────────────────┘
                                       réplication
 panne d'une zone : absorbée par les deux autres
 panne de la région : bascule vers la région B (voir l'entrée 11.11)
```

#### La réplication des données

| Mode | Principe | Perte possible | Latence d'écriture |
|---|---|---|---|
| Synchrone | L'écriture est validée après confirmation de la réplique | Nulle (RPO proche de 0) | Plus élevée (aller-retour) |
| Asynchrone | L'écriture est validée avant la réplication | Les dernières écritures non répliquées | Faible |
| Semi-synchrone | Au moins une réplique confirme | Très faible | Intermédiaire |

Le choix est un compromis entre latence et perte potentielle (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto) pour le RPO).

#### Le quorum

Un groupe de $n$ nœuds prend une décision à la majorité :

$$\text{quorum} = \left\lfloor \frac{n}{2} \right\rfloor + 1$$

| Nombre de nœuds | Quorum | Pannes tolérées |
|---|---|---|
| 3 | 2 | 1 |
| 5 | 3 | 2 |
| 7 | 4 | 3 |

**Pourquoi.** Deux groupes séparés par une partition ne peuvent pas tous deux atteindre la majorité : un seul continue, ce qui évite le cerveau divisé. Les algorithmes de consensus (Paxos, Raft) reposent sur ce principe.

#### La détection de panne

| Technique | Principe | Précaution |
|---|---|---|
| Battement de cœur (*heartbeat*) | Signal périodique | Délais calibrés pour éviter les faux positifs |
| Sondes de santé (voir [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)) | Requêtes de vérification | Sondes profondes mais sans effet de bord |
| Détection par plusieurs observateurs | Un seul témoin peut se tromper | Décision à la majorité |

#### Les pannes corrélées

La redondance n'aide pas si les copies tombent ensemble :

| Cause commune | Exemple | Parade |
|---|---|---|
| Même logiciel | Un bogue qui se déclenche à une date | Diversité de versions, déploiement progressif |
| Même configuration | Une configuration erronée propagée partout | Propagation par vagues, validation |
| Même zone ou alimentation | Panne de zone | Répartition sur plusieurs zones |
| Même dépendance | Un fournisseur d'identité unique | Dépendance critique redondante ou dégradation |
| Même fournisseur cloud | Panne régionale du fournisseur | Multi-région, voire multi-fournisseur pour les services les plus critiques |

#### Les tests

| Pratique | Description |
|---|---|
| Exercice de bascule planifié | On force un basculement en dehors des heures de pointe |
| Ingénierie du chaos (*chaos engineering*) | On injecte des pannes contrôlées en production pour vérifier la résilience |
| Journées d'exercice (*game days*) | Simulations d'incidents avec les équipes |
| Tests de restauration | Voir [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration) |

**Contre-exemple.** Un cluster de bases en actif–passif où le basculement n'a jamais été exercé en deux ans. Le jour de la panne, le secours a une version incompatible, des identifiants expirés, et ne démarre pas.

**Limites.** La redondance a un coût de capacité et de complexité. On la dimensionne selon l'objectif de disponibilité (voir [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience)) et on l'évalue par rapport à d'autres moyens, comme la rapidité de rétablissement.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience) | Elle est le moyen principal d'atteindre la disponibilité visée |
| [11.9 Dégradation progressive](#119-dégradation-progressive) | La dégradation maîtrisée complète la redondance |
| [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto) | La réplication et la bascule régionale relèvent de la reprise après sinistre |
| [1.9 Systèmes distribués](01-architecture-saas.md#19-systèmes-distribués) | Les pannes partielles et le cerveau divisé sont des problèmes de systèmes distribués |
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | Les cellules sont une forme de redondance et de confinement |
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | Les sondes de santé déclenchent les bascules |

### 5. Application pratique

**Situation initiale.** La base de données principale est dans une seule zone, sans réplique. Une panne de la zone l'an dernier a arrêté la plateforme pendant 2 h 40.

**Problème.** Un point de défaillance unique pour toute la plateforme.

**Application du concept.** Réplication synchrone vers une seconde zone, avec bascule automatique par quorum.

**Déroulé.**

1. L'équipe déploie trois nœuds de base répartis sur trois zones, avec un nœud principal et deux répliques.
2. Une écriture est validée après confirmation d'au moins une réplique (semi-synchrone).
3. Un mécanisme de consensus élit une nouvelle principale si la principale disparaît, avec isolement de l'ancienne.
4. L'application se reconnecte automatiquement.
5. Un exercice trimestriel force le basculement en heures creuses.

**Résultat.** La panne d'une zone devient un incident de 30 à 60 secondes, sans perte de données validées.

**Limites.** La latence d'écriture augmente de quelques millisecondes à cause de la confirmation de la réplique ; elle est acceptée pour la garantie obtenue.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'un point de défaillance unique ?
2. **Compréhension.** Quelle différence y a-t-il entre actif–actif et actif–passif ?
3. **Compréhension.** Combien de pannes un groupe de cinq nœuds à quorum tolère-t-il ?
4. **Pourquoi.** Pourquoi la redondance ne protège-t-elle pas contre une configuration erronée déployée partout ?
5. **Raisonnement pratique.** Pourquoi exerce-t-on régulièrement la bascule ?

#### Réponses

1. Un composant dont la défaillance suffit à arrêter le service.
2. En actif–actif, toutes les instances servent en même temps ; en actif–passif, une seule sert, l'autre est en secours.
3. Deux : le quorum est de trois, donc la majorité subsiste tant qu'au plus deux nœuds sont perdus.
4. Parce que toutes les copies partagent la même cause : elles tombent ensemble, et il n'y a plus d'exemplaire sain.
5. Pour vérifier que le secours fonctionne vraiment (version, identifiants, données, procédure), car une bascule jamais exercée échoue souvent le jour où l'on en a besoin.

## 11.9 Dégradation progressive

### 1. Comprendre simplement

La **dégradation progressive** (*graceful degradation*) est la capacité d'un système, quand une partie tombe en panne ou est saturée, à **continuer de rendre un service réduit mais utile** plutôt que de s'arrêter complètement. Les fonctions essentielles sont préservées ; les fonctions secondaires sont désactivées ou simplifiées.

**Pourquoi cela existe.** Un arrêt total est presque toujours pire qu'un service partiel. Les clients peuvent continuer à travailler si les fonctions vitales restent disponibles, même si les statistiques, la recherche avancée ou les notifications sont momentanément indisponibles.

**Problème résolu.** Limiter l'impact d'une panne ou d'une surcharge à ce qui est réellement affecté, et préserver ce qui compte le plus.

**Modèle mental.** Une voiture en « mode dégradé » : un capteur est défaillant, le véhicule limite la puissance mais continue de rouler. Ou un hôpital sur groupe électrogène : l'éclairage des blocs et les respirateurs sont maintenus, le reste est délesté.

**Où l'analogie s'arrête.** Un véhicule signale clairement son mode dégradé. En plateforme, il faut aussi informer les utilisateurs et les systèmes clients de ce qui est dégradé, sinon ils interprètent mal les résultats.

**Exemple.** L'index de recherche est indisponible. La plateforme continue d'afficher les listes et fiches par accès direct à la base, désactive la recherche plein texte, et affiche un bandeau « Recherche temporairement indisponible ».

**Les composants.**

1. une **classification** des fonctions (critiques, importantes, secondaires) ;
2. des **modes dégradés** définis par dépendance ;
3. des **mécanismes de bascule** (disjoncteurs, drapeaux, délestage) ;
4. une **information** des utilisateurs ;
5. des **tests** des modes dégradés.

**Objectif d'apprentissage :** vous pouvez définir, pour une dépendance donnée, le comportement dégradé et les mécanismes qui le déclenchent.

### 2. Connaissances essentielles

#### Définition

La **dégradation progressive** est une propriété de conception selon laquelle la défaillance ou la saturation d'un composant entraîne une réduction contrôlée des fonctions offertes, en protégeant les plus critiques, plutôt qu'une défaillance globale.

#### Idées fondamentales

1. **Toutes les fonctions n'ont pas la même importance.** On les classe.
2. **Chaque dépendance a un comportement de repli.** Défini à l'avance.
3. **Le délestage protège le cœur.** Sous surcharge, on refuse le moins important.
4. **L'état dégradé est visible.** Utilisateurs et clients savent ce qui l'est.
5. **Les replis sont testés.** Un repli jamais exercé ne fonctionne pas.
6. **Un repli ne doit pas aggraver la panne.** Il ne doit pas surcharger un autre composant.

#### Vocabulaire essentiel

- **Délestage** (*load shedding*) : refus volontaire d'une partie de la charge pour protéger le service.
- **Disjoncteur** (*circuit breaker*) : mécanisme qui cesse d'appeler une dépendance en échec (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).
- **Cloisonnement** (*bulkhead*) : isolation de ressources pour qu'une panne ne se propage pas.
- **Repli** (*fallback*) : comportement alternatif quand l'opération normale échoue.
- **Fonction critique** (*critical path*) : fonction sans laquelle le service n'a plus de sens.
- **Baisse de régime sélective** (*brownout*) : désactivation temporaire de fonctions coûteuses non essentielles.
- **Servir des données périmées** (*stale-if-error*) : renvoyer une ancienne valeur en cas d'échec de la source.

#### Relations de cause à effet

- Une dépendance secondaire (notifications) tombe et bloque la fonction principale parce que l'appel est synchrone et sans délai. Une panne mineure devient une panne majeure.
- Sous surcharge, toutes les requêtes sont traitées avec la même priorité. Les requêtes critiques et non critiques échouent ensemble.
- Le repli repose sur la même ressource saturée. Il augmente la charge au lieu de la réduire.

#### Idées reçues

- **« La dégradation est un aveu de faiblesse. »** C'est une décision de conception : choisir ce que l'on sacrifie en cas de crise.
- **« Il suffit d'afficher une erreur. »** Une erreur totale est le contraire de la dégradation : on cherche à préserver autant que possible.
- **« Le repli est automatique. »** Il doit être conçu, défini fonction par fonction, et testé.

#### Principe clé

Décidez à l'avance ce qui doit survivre à chaque panne, et construisez des mécanismes qui sacrifient le secondaire pour préserver l'essentiel.

#### Si vous ne retenez que trois choses

1. La dégradation progressive remplace la panne totale par un service réduit mais utile.
2. Elle repose sur la classification des fonctions, des replis définis par dépendance et du délestage.
3. Replis et modes dégradés se testent et se signalent aux utilisateurs.

### 3. Explication technique détaillée

#### La classification des fonctions

| Niveau | Exemples | Comportement en crise |
|---|---|---|
| Critique | Authentification, lecture et modification des ressources, transitions d'état | Préservées en priorité |
| Importante | Recherche, notifications, imports | Retardées ou réduites |
| Secondaire | Tableaux de bord analytiques, exports lourds, recommandations | Suspendues en premier |

#### Une matrice de dépendances et de replis

| Dépendance en panne | Repli | Fonctions affectées |
|---|---|---|
| Index de recherche | Recherche limitée aux filtres sur la base ; désactivation de la recherche plein texte | Recherche |
| Service de notifications | Mise en file, envoi différé | Notifications |
| Fournisseur d'identité externe | Les sessions existantes continuent ; nouvelles connexions refusées avec message | Connexion SSO |
| Système externe synchronisé | Données de la dernière synchronisation, marquées « non vérifiées depuis… » | Données d'intégration |
| Service d'analytique | Masquage des tableaux de bord | Tableaux de bord |
| Moteur de plugins | Désactivation des extensions, flux standard | Extensions |
| Cache | Lecture directe, avec limitation de débit | Performance |

#### Le délestage selon la priorité

```text
File d'entrée des requêtes
   │
   ▼
Classement par priorité :  P0 interactive critique  >  P1 interactive  >  P2 lots  >  P3 analytique
   │
   ▼
Surcharge détectée (latence > seuil, file > seuil) :
   - refuser P3, puis P2, avec « 503 Service Unavailable » et Retry-After
   - garder P0 et P1
```

#### Les mécanismes

| Mécanisme | Rôle |
|---|---|
| Délai maximal et reprises bornées | Ne pas attendre une dépendance indéfiniment (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)) |
| Disjoncteur | Cesser d'appeler une dépendance qui échoue |
| Cloisonnement | Pools de ressources séparés par type de charge |
| Mise en file et traitement différé | Absorber les pics, découpler |
| Cache avec données périmées tolérées | Continuer à servir quand la source est indisponible |
| Drapeaux et coupe-circuits (voir [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags)) | Désactiver une fonction à la demande |
| Mode lecture seule | Protéger les données quand l'écriture est impossible |
| Stabilité statique (voir [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion)) | Le plan de données continue sans le plan de contrôle |

#### La communication de l'état dégradé

| Destinataire | Moyen |
|---|---|
| Utilisateur | Bandeau explicite, fonctions grisées avec explication (voir [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité)) |
| Client d'API | En-têtes ou champs indiquant des données périmées, codes `503` avec `Retry-After` |
| Administrateur | Tableau de bord et alertes |
| Tous | Page d'état du service |

#### Le piège du repli en cascade

Quand une dépendance principale tombe, tous les clients basculent sur le repli en même temps, et le repli (un autre service, une réplique) subit une charge qu'il n'a pas été dimensionné pour supporter. Il tombe à son tour. On y répond par un dimensionnement du repli, une limitation de débit sur son accès, et des tests de charge du scénario de repli.

#### Les tests

- **Injection de pannes** sur chaque dépendance pour vérifier le comportement dégradé.
- **Tests de charge** au-delà de la capacité pour vérifier le délestage.
- **Exercices** où l'on désactive une fonction secondaire à froid.

**Contre-exemple.** L'écran principal de la plateforme appelle de façon synchrone le service de recommandations pour afficher un bandeau. Quand ce service ralentit, l'écran principal devient inutilisable, alors que la fonction principale n'en dépendait pas.

**Limites.** Définir et tester les replis de chaque dépendance est un effort réel. On le concentre sur les dépendances et les fonctions dont l'impact est le plus fort.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative) | Délais, reprises et disjoncteurs en sont les outils |
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | La stabilité statique est une forme de dégradation |
| [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) | Les coupe-circuits permettent de désactiver des fonctions |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | La redondance et la dégradation se complètent |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | Le délestage rejoint la limitation de débit |
| [12.14 Explicabilité](12-produit-ux.md#1214-explicabilité) | L'interface doit expliquer l'état dégradé |

### 5. Application pratique

**Situation initiale.** Une panne du service de notifications provoque, via des appels synchrones, des délais d'attente sur toutes les transitions d'état. Les techniciens ne peuvent plus immobiliser ni remettre en service des aéronefs pendant 40 minutes.

**Problème.** Une fonction secondaire bloque une fonction critique.

**Application du concept.** Notifications asynchrones, avec file et repli.

**Déroulé.**

1. L'équipe classe les notifications comme fonction « importante » et les transitions comme « critiques ».
2. Les notifications passent par la boîte d'envoi transactionnelle et une file ; la transition ne les attend plus.
3. Un disjoncteur suspend l'envoi quand le service échoue, et les messages s'accumulent dans la file.
4. Une alerte prévient l'équipe, et la page d'état signale « notifications retardées ».
5. Au retour du service, la file est vidée, avec un débit limité.

**Résultat.** La panne du service de notifications n'a plus d'effet sur les transitions ; seules des notifications sont retardées.

**Limites.** Pour une notification critique (alerte de sécurité), un canal de repli distinct est prévu.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce que la dégradation progressive ?
2. **Compréhension.** Citez trois mécanismes qui la permettent.
3. **Compréhension.** Pourquoi classe-t-on les fonctions par criticité ?
4. **Pourquoi.** Pourquoi un repli peut-il aggraver une panne ?
5. **Raisonnement pratique.** Le fournisseur d'identité externe est indisponible. Que préserver, et que dégrader ?

#### Réponses

1. La capacité à fournir un service réduit mais utile quand une partie du système est défaillante ou saturée, plutôt que de tomber complètement.
2. Par exemple : disjoncteur, délestage, mise en file, cache avec données périmées, drapeaux de désactivation, mode lecture seule.
3. Pour savoir ce qu'il faut préserver en priorité et ce qui peut être suspendu en cas de crise.
4. Parce que tous les clients basculent sur lui en même temps, et qu'il peut ne pas être dimensionné pour cette charge, donc tomber à son tour.
5. Préserver les sessions existantes et les fonctions qui n'ont pas besoin d'une nouvelle authentification ; dégrader les nouvelles connexions SSO, avec un message clair et un accès de secours pour les administrateurs.

## 11.10 Sauvegarde et restauration

### 1. Comprendre simplement

Une **sauvegarde** (*backup*) est une **copie des données** (et de la configuration), conservée à part, qui permet de les retrouver après une perte, une corruption ou une destruction. La **restauration** (*restore*) est l'opération qui, à partir de cette copie, remet les données dans un état utilisable.

**Pourquoi cela existe.** Les données peuvent disparaître de bien des façons : suppression accidentelle, bogue qui les corrompt, panne matérielle, attaque par rançongiciel, sinistre. La redondance ne suffit pas : une suppression ou une corruption est répliquée à l'identique. Seule une copie ancienne, indépendante, permet de revenir à un état sain.

**Problème résolu.** Pouvoir revenir à un état antérieur connu des données, quelle que soit la cause de leur perte.

**Modèle mental.** Un double des clés et une assurance : on espère ne jamais s'en servir, mais le jour où l'on perd les clés, on est heureux de savoir où est le double et qu'il ouvre la porte.

**Où l'analogie s'arrête.** Un double de clé reste valable. Une sauvegarde peut être corrompue, incomplète, impossible à lire, ou inutilisable parce que la clé de déchiffrement est perdue : on ne le découvre qu'en restaurant.

**Exemple.** Chaque nuit, une sauvegarde complète de la base est chiffrée et envoyée dans une autre région. Toutes les cinq minutes, les journaux de transactions sont archivés, ce qui permet de restaurer l'état à un instant précis.

**Le principe qu'il faut retenir.** « Une sauvegarde qui n'a jamais été restaurée n'est pas une sauvegarde » : seule la restauration prouve que la copie est utilisable.

**Les composants.**

1. des **copies** planifiées ;
2. un **stockage** indépendant et protégé ;
3. un **chiffrement** des copies ;
4. une **procédure de restauration** ;
5. des **tests** réguliers.

**Objectif d'apprentissage :** vous pouvez distinguer sauvegarde et réplication, citer les types de sauvegarde, la règle 3-2-1 et décrire un test de restauration.

### 2. Connaissances essentielles

#### Définition

- **Sauvegarde** : copie de données, à un instant ou en continu, conservée sur un support ou dans un emplacement indépendant de la source, destinée à la récupération.
- **Restauration** : processus de remise en service des données et du système à partir d'une sauvegarde.

#### Idées fondamentales

1. **Sauvegarde et réplication sont différentes.** La réplication copie aussi les erreurs ; la sauvegarde conserve l'historique.
2. **Une sauvegarde est indépendante de la source.** Autre compte, autre région, autres identifiants.
3. **La fréquence détermine la perte possible.** Une sauvegarde toutes les 24 h peut perdre 24 h de données (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)).
4. **Les sauvegardes sont protégées.** Chiffrées, immuables, avec accès restreint.
5. **La restauration est testée.** Régulièrement, de bout en bout.
6. **La conservation est définie.** Durée selon le besoin et la réglementation.

#### Vocabulaire essentiel

- **Sauvegarde complète**, **incrémentale**, **différentielle** (*full*, *incremental*, *differential*).
- **Restauration à un instant donné** (*point-in-time recovery*, *PITR*) : retour à un instant précis grâce aux journaux de transactions.
- **Règle 3-2-1** : trois copies, sur deux supports différents, dont une hors site.
- **Sauvegarde immuable** (*immutable backup*) : copie qu'on ne peut ni modifier ni supprimer pendant une durée.
- **Instantané** (*snapshot*) : image de l'état d'un volume ou d'une base à un instant.
- **Exercice de restauration** (*restore drill*) : test planifié de la procédure.
- **Rétention** (*retention*) : durée de conservation des sauvegardes.

#### Relations de cause à effet

- Les sauvegardes sont dans le même compte et la même région que la production. Une compromission ou un sinistre les détruit avec les données.
- Les sauvegardes sont accessibles avec les mêmes identifiants que la production. Un attaquant qui les obtient les supprime avant de chiffrer les données.
- La restauration n'est jamais testée. On découvre pendant l'incident qu'elle échoue ou demande trois fois plus de temps que prévu.

#### Idées reçues

- **« La réplication est une sauvegarde. »** Non : une suppression accidentelle est répliquée en quelques secondes.
- **« Les sauvegardes sont automatiques, donc fiables. »** Elles peuvent échouer silencieusement. Seules la surveillance et les tests le détectent.
- **« Une sauvegarde est un fichier. »** Pour un système cohérent, c'est un ensemble : base, fichiers, configuration, clés, index.

#### Principe clé

Sauvegardez régulièrement, de façon indépendante et protégée, et prouvez par des restaurations que cela fonctionne.

#### Si vous ne retenez que trois choses

1. La sauvegarde conserve l'historique et protège contre les erreurs ; la réplication ne le fait pas.
2. Les copies sont indépendantes, chiffrées et protégées contre la suppression.
3. Seule une restauration réussie prouve qu'une sauvegarde est utile.

### 3. Explication technique détaillée

#### Les types de sauvegarde

| Type | Contenu | Avantage | Inconvénient |
|---|---|---|---|
| Complète | Tout l'état | Restauration simple | Volumineuse, longue |
| Incrémentale | Ce qui a changé depuis la dernière sauvegarde (de tout type) | Rapide, légère | Restauration demande la chaîne complète |
| Différentielle | Ce qui a changé depuis la dernière complète | Chaîne courte | Plus volumineuse que l'incrémentale |
| Journaux de transactions (continu) | Chaque changement | Restauration à un instant précis | Nécessite une base complète de départ |
| Instantané de volume | Image à un instant | Très rapide | Dépendant de l'infrastructure, cohérence à vérifier |

#### La restauration à un instant donné

```text
Dimanche 02:00    sauvegarde complète
Lundi–mardi       journaux de transactions archivés en continu
Mardi 14:32       suppression accidentelle d'une table
Mardi 14:50       décision de restaurer

Restauration :  sauvegarde complète du dimanche
              + rejeu des journaux jusqu'à mardi 14:31:59
              = état juste avant la suppression
```

#### La règle 3-2-1

| Élément | Signification | Exemple |
|---|---|---|
| 3 copies | Les données + deux sauvegardes | Production, sauvegarde locale, sauvegarde distante |
| 2 supports | Deux technologies de stockage | Stockage de blocs, stockage objet |
| 1 hors site | Au moins une dans un autre lieu | Autre région, autre fournisseur |

On ajoute de plus en plus un volet « immuable » : une copie protégée contre toute suppression pendant une durée (stockage avec verrouillage d'objet).

#### La protection des sauvegardes

| Menace | Mesure |
|---|---|
| Suppression par un attaquant | Immuabilité, compte séparé, approbation à deux pour la suppression |
| Vol des copies | Chiffrement avec une clé distincte, conservée séparément (voir [11.4 Secrets et gestion des clés](#114-secrets-et-gestion-des-clés)) |
| Corruption silencieuse | Sommes de contrôle, vérification périodique |
| Perte de la clé | Sauvegarde et séquestre des clés |
| Dépendance à l'environnement | Procédure documentée et exercée de reconstruction |

#### La durée d'une restauration

$$T_{\text{restauration}} \approx \frac{S}{B} + T_{\text{vérification}} + T_{\text{reconfiguration}}$$

où $S$ est le volume, $B$ le débit effectif de transfert et d'écriture.

**Exemple chiffré.** Pour 2 To à 200 Mo/s : $2\,000\,000 / 200 = 10\,000$ s, soit environ 2 h 45, auxquelles s'ajoutent la vérification d'intégrité et la reconfiguration des services. C'est ce calcul, confirmé par des exercices, qui fonde l'objectif de temps de reprise (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)).

#### La restauration par tenant

Restaurer **un seul tenant** (suite à son erreur) sans toucher aux autres est difficile quand les données sont mutualisées.

| Modèle (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant)) | Approche |
|---|---|
| Base séparée par tenant | Restauration de la base du tenant, simple |
| Schéma séparé | Restauration du schéma, selon les outils |
| Schéma partagé | Restauration complète dans un environnement séparé, extraction des lignes du tenant, réintégration contrôlée |

Pour les modèles mutualisés, on prévoit aussi des **exports logiques** par tenant, utilisés comme sauvegarde fonctionnelle, et la restauration de ressources individuelles depuis l'historique (voir [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité)).

#### Sauvegardes et suppression de données

Une donnée supprimée à la demande d'une personne reste présente dans les sauvegardes jusqu'à leur expiration. La politique doit l'indiquer : durée de rétention des sauvegardes, procédure de non-restauration des données supprimées, et effacement cryptographique lorsque c'est possible (voir [5.6 Provisionnement et cycle de vie d'un tenant](05-multi-tenancy-modele-entreprise.md#56-provisionnement-et-cycle-de-vie-dun-tenant)).

#### Les tests de restauration

| Test | Fréquence typique | Vérifie |
|---|---|---|
| Restauration d'une sauvegarde dans un environnement isolé | Mensuelle | La copie est lisible et complète |
| Restauration à un instant donné | Trimestrielle | Les journaux sont utilisables |
| Reconstruction complète de la plateforme | Semestrielle ou annuelle | Le plan de reprise (voir [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto)) |
| Contrôle automatique de cohérence après restauration | À chaque test | Intégrité référentielle, comptages |

**Contre-exemple.** Des sauvegardes nocturnes écrites dans le même compte que la production, avec les mêmes identifiants d'administration. Un attaquant qui prend le contrôle du compte supprime à la fois les données et leurs sauvegardes.

**Limites.** Une sauvegarde cohérente d'un système réparti (base, files, fichiers, index) est difficile : on définit un ordre, on accepte de reconstruire les index, et on teste la procédure complète.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto) | La fréquence et la durée de restauration déterminent RPO et RTO |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | La réplication assure la continuité, la sauvegarde l'historique |
| [9.3 Révision et versionnement d'entité](09-audit-versionnement-gouvernance.md#93-révision-et-versionnement-dentité) | Les révisions permettent des restaurations ciblées |
| [11.3 Chiffrement](#113-chiffrement) | Les sauvegardes sont chiffrées |
| [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | Le modèle multi-tenant détermine la restauration par tenant |
| [3.2 Archiver et restaurer](03-crud-runtime-ressources.md#32-archiver-et-restaurer) | L'archivage n'est pas une sauvegarde |

### 5. Application pratique

**Situation initiale.** Un administrateur d'un tenant lance par erreur une suppression de masse de 40 000 tâches de maintenance, un mardi à 14 h 30. L'erreur est repérée à 15 h.

**Problème.** Les données doivent être restaurées sans écraser le travail de l'heure suivante ni affecter les autres tenants.

**Application du concept.** Restauration à un instant donné dans un environnement isolé, puis réintégration ciblée.

**Déroulé.**

1. L'équipe restaure la base à 14 h 29 dans un environnement séparé, à partir de la dernière sauvegarde complète et des journaux.
2. Elle extrait les 40 000 tâches supprimées du tenant concerné.
3. Elle les compare à l'état actuel : 120 tâches ont été recréées entre-temps, par l'équipe.
4. Elle réintègre les tâches supprimées, en évitant les doublons, par une opération en masse tracée (voir [3.6 Opérations en masse](03-crud-runtime-ressources.md#36-opérations-en-masse)).
5. Un rapport indique les tâches restaurées et celles ignorées.

**Résultat.** Les données du tenant sont rétablies en deux heures, sans effet sur les autres tenants.

**Limites.** Les effets déclenchés par la suppression (notifications, événements) ne sont pas rappelés : une communication corrective peut être nécessaire.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi la réplication n'est-elle pas une sauvegarde ?
2. **Compréhension.** Que signifie la règle 3-2-1 ?
3. **Compréhension.** Qu'est-ce que la restauration à un instant donné ?
4. **Pourquoi.** Pourquoi les sauvegardes doivent-elles être dans un compte séparé de la production ?
5. **Raisonnement pratique.** Combien de temps prend le transfert de 3 To à 150 Mo/s ?

#### Réponses

1. Parce que la réplication copie aussi les suppressions et les corruptions, quasi instantanément : elle ne conserve pas l'historique.
2. Trois copies des données, sur deux supports différents, dont une hors site.
3. La restauration de l'état des données à un instant précis, à partir d'une sauvegarde complète et des journaux de transactions rejoués jusqu'à cet instant.
4. Pour qu'une compromission ou une erreur dans le compte de production ne puisse pas détruire aussi les sauvegardes.
5. $3\,000\,000 / 150 = 20\,000$ s, soit environ 5 h 33, hors vérification et reconfiguration.

## 11.11 Reprise après sinistre, RPO et RTO

### 1. Comprendre simplement

La **reprise après sinistre** (*disaster recovery*, **DR**) est l'ensemble des **plans, moyens et procédures** qui permettent de remettre en service la plateforme après une perturbation majeure : perte d'un centre de données ou d'une région, compromission généralisée, corruption massive. Deux valeurs la caractérisent : le **RPO** (*Recovery Point Objective*), la **perte de données maximale acceptable**, mesurée en durée ; et le **RTO** (*Recovery Time Objective*), la **durée maximale d'interruption acceptable**.

**Pourquoi cela existe.** Quelques événements rares dépassent ce que la haute disponibilité ordinaire absorbe. Il faut, avant qu'ils se produisent, décider ce que l'on est prêt à perdre et pendant combien de temps l'on peut s'arrêter, et s'y préparer en conséquence.

**Problème résolu.** Fixer des objectifs chiffrés de reprise, aligner les investissements sur le besoin métier, et être capable de redémarrer dans le délai promis.

**Modèle mental.** Un plan d'évacuation et de repli d'une entreprise : où se retrouve-t-on, avec quelles informations, en combien de temps reprend-on le travail, et jusqu'à quel point dans le passé accepte-t-on de revenir ?

**Où l'analogie s'arrête.** Un plan d'évacuation est testé par quelques exercices. Un plan de reprise numérique dépend de nombreux éléments (données, clés, identités, DNS, personnes) qui évoluent chaque semaine : il se périme vite s'il n'est pas exercé.

**Exemple.** Pour le service de gestion des tâches : RPO de 5 minutes (on accepte de perdre au plus 5 minutes de données) et RTO de 1 heure (la reprise doit être effective en une heure).

**Les composants.**

1. des **objectifs** (RPO, RTO) par service ;
2. une **stratégie** de reprise ;
3. des **procédures** et des **rôles** ;
4. des **moyens** (données répliquées, environnement de secours) ;
5. des **exercices** réguliers.

**Objectif d'apprentissage :** vous pouvez définir RPO et RTO, choisir une stratégie selon les objectifs et dire comment on vérifie qu'ils sont tenus.

### 2. Connaissances essentielles

#### Définition

- **Reprise après sinistre** : capacité et ensemble de procédures permettant de restaurer les services et les données d'une organisation après un événement majeur.
- **RPO** : durée maximale de données dont la perte est acceptable, mesurée entre le dernier état récupérable et l'instant du sinistre.
- **RTO** : durée maximale acceptable entre le début de l'interruption et la remise en service.

#### Idées fondamentales

1. **Les objectifs viennent du métier.** On ne les déduit pas de la technique.
2. **Le RPO dépend de la copie des données.** Fréquence des sauvegardes, mode de réplication.
3. **Le RTO dépend de la préparation.** Environnement prêt, automatisation, personnes.
4. **Plus l'objectif est ambitieux, plus c'est coûteux.** La relation n'est pas linéaire.
5. **Les services n'ont pas tous les mêmes objectifs.** On définit des niveaux.
6. **Seuls les exercices prouvent la capacité réelle.** L'objectif réel est celui que l'on a mesuré.

#### Vocabulaire essentiel

- **Sinistre** (*disaster*) : événement majeur qui prive durablement la plateforme d'une partie de ses moyens.
- **Site de secours** (*recovery site*) : environnement où l'on reprend.
- **Plan de continuité d'activité** (*business continuity plan*, *BCP*) : plan couvrant l'activité de l'organisation, dont la reprise informatique est une composante.
- **Durée maximale d'interruption admissible** (*maximum tolerable downtime*, *MTD*) : seuil au-delà duquel l'impact devient inacceptable.
- **Basculement** et **retour** (*failover*, *failback*) : passage au site de secours, puis retour au site nominal.
- **Manuel d'exécution** (*runbook*) : procédure détaillée et exécutable.
- **RTO et RPO réels** (*RTA*, *RPA*) : valeurs mesurées lors d'un exercice ou d'un incident.

#### Relations de cause à effet

- Les sauvegardes ont lieu toutes les 24 h. Le RPO ne peut pas être inférieur à 24 h, quels que soient les souhaits.
- Le site de secours doit être construit à la demande. Le RTO se compte en heures, voire en jours.
- Des dépendances n'ont pas été prévues (DNS, certificats, fournisseur d'identité). Le site de secours est prêt, mais personne ne peut s'y connecter.

#### Idées reçues

- **« La haute disponibilité remplace la reprise après sinistre. »** Non. La haute disponibilité couvre les pannes ordinaires ; elle ne protège pas contre la perte de la région, la corruption répliquée ou la compromission.
- **« Un RPO de zéro est un objectif normal. »** Il exige une réplication synchrone entre sites, avec un coût en latence et en complexité.
- **« Le plan existe donc la reprise fonctionnera. »** Un plan non exercé échoue le plus souvent sur des détails que personne n'avait vus.

#### Principe clé

Choisissez RPO et RTO selon l'impact métier, construisez la stratégie qui les tient, et mesurez en exercice ce que vous tenez réellement.

#### Si vous ne retenez que trois choses

1. RPO = données que l'on accepte de perdre ; RTO = temps d'arrêt que l'on accepte.
2. La stratégie (sauvegarde, secours tiède, actif–actif) se choisit selon les objectifs et le coût.
3. Les valeurs réelles se mesurent par des exercices, pas par des déclarations.

### 3. Explication technique détaillée

#### RPO et RTO sur une ligne de temps

```text
        dernier état récupérable            sinistre              reprise effective
─────────────────┬───────────────────────────┬──────────────────────────┬──────────►
                 │◄────────── RPO ──────────►│◄─────────── RTO ────────►│
                    (données perdues)              (service indisponible)
```

#### Les stratégies de reprise

| Stratégie | Description | RPO typique | RTO typique | Coût |
|---|---|---|---|---|
| Sauvegarde et restauration | Les données sont sauvegardées hors site ; l'environnement se reconstruit après le sinistre | Heures | Heures à jours | Faible |
| Feu de camp (*pilot light*) | Le cœur (données répliquées) est actif ; le reste est prêt à être démarré | Minutes | Dizaines de minutes à heures | Faible à moyen |
| Secours tiède (*warm standby*) | Un environnement réduit mais fonctionnel tourne en permanence | Minutes à secondes | Minutes | Moyen à élevé |
| Multi-sites actif–actif | Plusieurs régions servent en même temps | Secondes à zéro | Secondes à minutes | Élevé |

#### Des niveaux de service

| Niveau | Services | RPO | RTO | Stratégie |
|---|---|---|---|---|
| 1 | Authentification, moteur de ressources, transitions | 5 min | 1 h | Secours tiède, réplication asynchrone |
| 2 | Recherche, notifications, intégrations | 1 h | 4 h | Feu de camp |
| 3 | Analytique, exports lourds | 24 h | 24 h | Sauvegarde et restauration |

Chaque niveau est lié à une offre commerciale ou à un besoin du client. Des garanties plus fortes sont souvent proposées sous forme d'option payante.

#### Ce que l'objectif exige

| Objectif | Exigences |
|---|---|
| RPO de 5 minutes | Réplication asynchrone continue ou sauvegarde de journaux toutes les 5 minutes, surveillance du retard de réplication |
| RPO de zéro | Réplication synchrone vers un second site, acceptation de la latence supplémentaire |
| RTO de 1 heure | Environnement de secours prêt, procédure automatisée, personnes d'astreinte, données déjà présentes |
| RTO de 15 minutes | Bascule automatisée, vérifications automatiques, DNS et certificats préparés |

#### Les dépendances oubliées

| Dépendance | Question |
|---|---|
| DNS et certificats | Peut-on rediriger le trafic rapidement ? Les certificats sont-ils valables sur le secours ? |
| Identité et secrets | Les secrets et les clés sont-ils disponibles dans la région de secours ? |
| Fournisseurs tiers | Existent-ils dans la région ? Leurs limites suffisent-elles ? |
| Données de configuration | La configuration des tenants est-elle répliquée ? |
| Personnes et accès | Qui peut agir ? Avec quels accès, si l'identité est en panne ? |
| Outils d'exploitation | Surveillance, déploiement, communication fonctionnent-ils sans la région sinistrée ? |

#### Le déroulement d'une reprise

```text
1. Détecter et décider           déclaration du sinistre (autorité de décision définie)
2. Mobiliser                     équipe de reprise, communication
3. Isoler                        empêcher la région sinistrée d'agir (isolement)
4. Basculer                      données promues, services démarrés, trafic redirigé
5. Vérifier                      tests de fumée, contrôle de cohérence
6. Communiquer                   clients, état du service
7. Stabiliser                    surveillance renforcée, capacité
8. Revenir (facultatif)          retour planifié vers le site nominal
9. Retour d'expérience           ce qui a fonctionné ou non
```

#### La mesure et les exercices

| Exercice | Contenu | Mesure |
|---|---|---|
| Revue sur table | Déroulé du plan avec les équipes, sans action | Lacunes de procédure |
| Reprise partielle | Bascule d'un service de niveau 2 | RTO et RPO réels |
| Reprise complète | Bascule de la plateforme sur le site de secours | RTO global, difficultés |
| Panne imprévue (journée d'exercice) | Équipe non prévenue | Réactivité réelle |

On compare **objectif** et **valeur mesurée** : un RTO objectif de 1 h avec un exercice qui dure 3 h indique que l'objectif réel est de 3 h, ou qu'il faut investir.

**Contre-exemple.** Un plan de reprise de 80 pages, rédigé il y a trois ans, jamais exercé. Le jour du sinistre, on découvre que le DNS est géré par un fournisseur qui exige un code envoyé sur le téléphone d'une personne partie, et que la région de secours n'a pas les quotas de capacité nécessaires.

**Limites.** Un objectif trop ambitieux sans investissement correspondant est une promesse vide. On choisit des objectifs que l'on peut démontrer, et on les revoit quand le contexte change.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.10 Sauvegarde et restauration](#1110-sauvegarde-et-restauration) | Les sauvegardes sont la base du RPO et d'une partie du RTO |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | La réplication géographique est le moyen des reprises rapides |
| [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience) | La disponibilité ordinaire ne couvre pas les sinistres |
| [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride) | Les placements et cellules déterminent la reprise par tenant |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Des engagements de reprise renforcés peuvent être des options d'offre |
| [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem) | La reprise est une réponse à un incident majeur |

### 5. Application pratique

**Situation initiale.** Un client national demande à la plateforme de s'engager sur un RPO de 5 minutes et un RTO d'une heure pour ses données d'inspection.

**Problème.** La plateforme sauvegarde chaque nuit et n'a pas de site de secours. Son RPO réel est de 24 h, et son RTO de plusieurs jours.

**Application du concept.** Une stratégie de secours tiède avec réplication asynchrone vers une seconde région, et des exercices.

**Déroulé.**

1. L'équipe réplique en continu les données du tenant vers une seconde région ; le retard est surveillé et reste inférieur à 30 secondes.
2. Elle prépare un environnement réduit dans la seconde région, avec les secrets, les certificats et la configuration synchronisée.
3. Elle automatise la procédure de bascule et les contrôles de cohérence.
4. Un premier exercice donne un RTO de 2 h 10 : la promotion de la base est rapide, mais le DNS et le rechauffement des caches prennent du temps.
5. Après correction (TTL de DNS réduit, préchauffage), le second exercice donne 38 minutes.

**Résultat.** L'engagement du RPO de 5 minutes et du RTO d'une heure est tenable, et démontré.

**Limites.** L'engagement vaut pour la panne d'une région, non pour la corruption logique répliquée : celle-ci relève des sauvegardes avec restauration à un instant donné.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Que mesurent le RPO et le RTO ?
2. **Compréhension.** Quel RPO minimal permet une sauvegarde toutes les 24 heures ?
3. **Compréhension.** Citez les quatre stratégies de reprise courantes.
4. **Pourquoi.** Pourquoi la haute disponibilité ne remplace-t-elle pas la reprise après sinistre ?
5. **Raisonnement pratique.** Un exercice mesure un RTO de 3 h pour un objectif d'1 h. Que faire ?

#### Réponses

1. Le RPO mesure la perte de données maximale acceptable ; le RTO, la durée maximale d'interruption acceptable.
2. Environ 24 heures : on peut perdre toutes les écritures faites depuis la dernière sauvegarde.
3. Sauvegarde et restauration, feu de camp (*pilot light*), secours tiède, multi-sites actif–actif.
4. Parce que la haute disponibilité absorbe les pannes ordinaires d'un site ; elle ne protège pas contre la perte de tout le site, ni contre une corruption répliquée.
5. Analyser les étapes qui consomment le temps, les automatiser ou les préparer, puis refaire l'exercice ; à défaut, revoir l'objectif ou l'investissement.

## 11.12 Logs, métriques et traces

### 1. Comprendre simplement

L'**observabilité** (*observability*) est la capacité de **comprendre l'état interne d'un système à partir de ce qu'il produit**. Elle repose classiquement sur trois types de signaux : les **journaux** (*logs*), qui enregistrent des événements précis ; les **métriques** (*metrics*), qui mesurent des valeurs au fil du temps ; et les **traces** (*traces*), qui suivent le parcours d'une requête à travers les composants.

**Pourquoi cela existe.** Dans un système réparti, une requête traverse des dizaines de composants. Quand quelque chose ne va pas, on ne peut pas aller « regarder dans la machine ». Il faut que le système fournisse lui-même de quoi répondre à des questions qu'on n'avait pas prévues.

**Problème résolu.** Diagnostiquer, comprendre et améliorer le comportement d'un système en production.

**Modèle mental.** Le dossier médical d'un patient : le **journal** des événements (« 14 h, douleur déclarée »), les **constantes** relevées au fil du temps (tension, température), et le **parcours** du patient d'un service à l'autre de l'hôpital.

**Où l'analogie s'arrête.** Un patient a un seul dossier tenu par des soignants. Un système produit des millions de signaux par minute : choisir ce que l'on garde, avec quel niveau de détail et à quel coût, est un problème d'ingénierie à part entière.

**Exemple.** Une requête de transition d'aéronef est lente. La **trace** montre qu'elle a passé 1,8 s dans un appel au service de règles. Les **métriques** de ce service montrent une latence élevée depuis 14 h. Les **journaux** indiquent un délai d'attente vers une dépendance.

**Les trois signaux.**

1. **journaux** : *que s'est-il passé, précisément ?*
2. **métriques** : *combien, à quelle vitesse, avec quelle tendance ?*
3. **traces** : *par où est passée cette requête, et où le temps a-t-il été perdu ?*

**Objectif d'apprentissage :** vous pouvez dire à quelle question répond chaque signal, concevoir une ligne de journal exploitable, et expliquer pourquoi on utilise des percentiles.

### 2. Connaissances essentielles

#### Définition

- **Journal** : enregistrement horodaté d'un événement discret, accompagné de contexte.
- **Métrique** : mesure numérique agrégée dans le temps (compteur, jauge, histogramme).
- **Trace** : représentation du parcours d'une requête, composée de segments (*spans*) reliés, à travers les composants.
- **Observabilité** : propriété d'un système dont l'état interne peut être déduit de ses sorties.

#### Idées fondamentales

1. **Chaque signal répond à une question différente.** Ils se complètent.
2. **Ils doivent être reliés.** Un identifiant de corrélation commun les rapproche.
3. **Les journaux sont structurés.** Des champs, non des phrases libres.
4. **Les métriques sont agrégées.** Peu coûteuses, adaptées aux tendances et aux alertes.
5. **Les traces suivent la requête.** Indispensables dans les architectures réparties.
6. **L'observabilité a un coût.** Volume, stockage, cardinalité : il faut choisir.

#### Vocabulaire essentiel

- **Journalisation structurée** (*structured logging*) : journaux en champs (clé, valeur), typiquement en JSON.
- **Compteur** (*counter*), **jauge** (*gauge*), **histogramme** (*histogram*) : types de métriques.
- **Centile** (*percentile*) : valeur sous laquelle se trouve une proportion donnée des mesures (p95, p99).
- **Cardinalité** (*cardinality*) : nombre de combinaisons distinctes de valeurs d'étiquettes d'une métrique.
- **Segment** (*span*) : unité d'une trace, avec durée et contexte.
- **Contexte de trace** (*trace context*) : identifiants transmis entre composants (norme W3C Trace Context).
- **OpenTelemetry** : ensemble normalisé d'API et de SDK pour produire et collecter journaux, métriques et traces.

#### Relations de cause à effet

- Les journaux sont des phrases libres. Les rechercher et les agréger est difficile, et les corréler impossible.
- Les métriques ont des étiquettes à très forte cardinalité (identifiant d'utilisateur). Le stockage et les coûts explosent, et le système de métriques s'effondre.
- On ne regarde que la moyenne. Des requêtes très lentes pour une minorité d'utilisateurs sont invisibles.

#### Idées reçues

- **« Plus on journalise, mieux on diagnostique. »** Au-delà d'un seuil, le bruit masque l'essentiel et le coût devient prohibitif.
- **« Les métriques suffisent. »** Elles disent *que* quelque chose ne va pas, pas *pourquoi*.
- **« La moyenne résume la performance. »** Elle cache les queues de distribution, qui sont ce que vivent les utilisateurs les plus affectés.

#### Principe clé

Émettez des signaux structurés, reliés par un contexte commun, choisis pour répondre aux questions que l'on se posera en incident.

#### Si vous ne retenez que trois choses

1. Journaux, métriques et traces répondent à des questions complémentaires, et se relient par un identifiant commun.
2. Les journaux sont structurés ; les métriques sont agrégées avec une cardinalité maîtrisée ; les traces suivent les requêtes.
3. On raisonne en centiles, pas en moyennes.

### 3. Explication technique détaillée

#### Les trois signaux côte à côte

| Critère | Journaux | Métriques | Traces |
|---|---|---|---|
| Nature | Événements discrets | Séries temporelles numériques | Parcours d'une requête |
| Question | Que s'est-il passé ? | Quelle est la tendance ? | Où le temps est-il passé ? |
| Volume | Élevé | Faible (agrégées) | Moyen à élevé (échantillonnées) |
| Coût | Stockage et recherche | Faible | Moyen |
| Usage typique | Diagnostic détaillé | Alertes, tableaux de bord | Analyse de latence |
| Granularité | Fine | Agrégée | Par requête |

#### Une ligne de journal structurée

```json
{
  "ts": "2026-10-13T08:12:45.412Z",
  "level": "error",
  "service": "workflow-engine",
  "version": "2026.10.3",
  "tenant_id": "ten_airline_01",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "correlation_id": "req_91ab33",
  "event": "step_failed",
  "workflow_instance": "wf_204",
  "step": "notify_quality",
  "error": { "type": "timeout", "target": "quality-system", "after_ms": 10000 },
  "message": "Échec d'appel au système qualité"
}
```

**Règles.** Des champs stables ; le tenant et la corrélation dans chaque ligne ; aucun secret ni donnée personnelle inutile ; des niveaux (`debug`, `info`, `warn`, `error`) utilisés avec discipline.

#### Les types de métriques

| Type | Description | Exemple |
|---|---|---|
| Compteur | Valeur qui ne fait que croître | Nombre de requêtes, d'erreurs |
| Jauge | Valeur qui monte et descend | Taille d'une file, mémoire utilisée |
| Histogramme | Répartition de valeurs par classes | Durée des requêtes |

#### Pourquoi les centiles

Sur 1 000 requêtes, 950 prennent 100 ms et 50 prennent 3 s. La moyenne est de $0{,}95 \times 100 + 0{,}05 \times 3\,000 = 245$ ms, valeur qui ne correspond à l'expérience de personne. Le centile 50 est de 100 ms ; le centile 99 est de 3 s. C'est ce dernier qui décrit ce que vivent les utilisateurs les plus affectés, et sur lequel on fixe des objectifs (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)).

#### Les modèles de lecture d'un service

| Méthode | Signaux | Pour |
|---|---|---|
| **RED** | *Rate* (débit), *Errors* (erreurs), *Duration* (durée) | Services qui répondent à des requêtes |
| **USE** | *Utilization*, *Saturation*, *Errors* | Ressources (processeur, disque, file) |
| Quatre signaux d'or | Latence, trafic, erreurs, saturation | Vue d'ensemble d'un service |

#### La trace d'une requête

```text
trace 4bf92f35…  ─ requête PATCH /aircraft/ac_8f3a/transitions/ground (durée totale 1 940 ms)
├─ passerelle d'API                          ████ 35 ms
├─ moteur de ressources                      ████████████████████████████ 1 890 ms
│   ├─ autorisation                          ██ 12 ms
│   ├─ chargement de l'aéronef (base)        ███ 18 ms
│   ├─ évaluation des gardes                 ██████████████████████████ 1 800 ms
│   │   └─ appel au moteur de règles         ██████████████████████████ 1 790 ms  ◄ goulot
│   └─ écriture (base)                       ██ 15 ms
```

Le contexte de trace se propage par un en-tête normalisé (W3C Trace Context) :

```http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Le format est `version-identifiant_de_trace-identifiant_de_segment_parent-indicateurs`.

#### L'échantillonnage des traces

Conserver toutes les traces coûte cher. Deux approches :

- **en tête** : on décide au début de la requête de la conserver (par exemple 1 %), ce qui est simple mais peut manquer les cas rares ;
- **en queue** : on décide après coup, en gardant toutes les traces en erreur ou lentes.

#### Le multi-tenant

| Signal | Étiquette de tenant | Précaution |
|---|---|---|
| Journaux | Toujours | Accès au journal filtré par tenant pour les vues client (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)) |
| Traces | Toujours | Accès restreint |
| Métriques | Avec prudence | Le tenant comme étiquette multiplie la cardinalité ; on agrège par catégorie ou on garde les principaux tenants |

#### La corrélation

Les trois signaux sont reliés par `trace_id` et `correlation_id`. Depuis une alerte sur une métrique, on atteint des exemples de traces lentes, puis les journaux de ces traces.

#### Les modes de défaillance

- **Bruit** : trop de journaux de bas niveau, tout est noyé.
- **Absence de corrélation** : impossible de relier une erreur à sa cause.
- **Cardinalité** : étiquettes à valeurs illimitées.
- **Fuite** : secrets ou données personnelles dans les journaux.
- **Observabilité hors service pendant l'incident** : le système de supervision tombe avec le reste.

**Contre-exemple.** Un journal `INFO: Processing done` émis des millions de fois par heure, sans identifiant ni contexte, et une métrique de durée en moyenne seulement. En incident, on ne trouve rien, et on ne voit pas que 2 % des requêtes durent plus de 5 secondes.

**Limites.** L'observabilité ne répond qu'aux questions pour lesquelles les signaux ont été prévus. Elle demande de l'entretien : ajouter des signaux quand un incident révèle une zone aveugle.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | La surveillance et les alertes s'appuient sur ces signaux |
| [11.14 Suivi des erreurs](#1114-suivi-des-erreurs) | Le suivi d'erreurs en est une vue spécialisée |
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | Les indicateurs de niveau de service sont des métriques |
| [7.4 Architecture orientée événements](07-evenements-automatisation.md#74-architecture-orientée-événements) | Les traces sont essentielles dans les architectures événementielles |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La console opérationnelle expose une partie de ces signaux au tenant |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | L'audit est distinct des journaux techniques |

### 5. Application pratique

**Situation initiale.** Des utilisateurs signalent que « parfois, immobiliser un aéronef prend plusieurs secondes ». Les tableaux de bord affichent une latence moyenne de 120 ms.

**Problème.** La moyenne masque le problème, et l'équipe ne sait pas où chercher.

**Application du concept.** Histogrammes de durée, traces échantillonnées en queue, journaux corrélés.

**Déroulé.**

1. L'équipe affiche les centiles : p50 à 90 ms, p99 à 3,4 s.
2. Elle filtre les traces dont la durée dépasse 2 s : 80 % passent par l'évaluation de la garde de transition.
3. Les segments montrent un appel au moteur de règles qui attend le verrou d'un cache.
4. Les journaux de ces traces révèlent une invalidation massive de cache toutes les 10 minutes.
5. L'équipe corrige l'invalidation (par clé plutôt que globale) et vérifie que p99 passe à 180 ms.

**Résultat.** Le problème qui touchait 1 % des requêtes est trouvé et résolu en une heure.

**Limites.** Sans échantillonnage en queue, les traces lentes auraient été rarement conservées : le choix de la politique d'échantillonnage a fait la différence.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** À quelle question répond chacun des trois signaux ?
2. **Compréhension.** Qu'est-ce que la cardinalité d'une métrique, et pourquoi pose-t-elle problème ?
3. **Compréhension.** Pourquoi utilise-t-on des centiles plutôt que des moyennes ?
4. **Pourquoi.** Pourquoi insère-t-on un identifiant de corrélation dans chaque signal ?
5. **Raisonnement pratique.** 98 % des requêtes durent 100 ms et 2 % durent 5 s. Quelle est la moyenne, et que dit le p99 ?

#### Réponses

1. Les journaux : que s'est-il passé ; les métriques : quelle est la tendance ; les traces : par où est passée la requête et où le temps a-t-il été perdu.
2. Le nombre de combinaisons distinctes d'étiquettes ; une cardinalité très élevée fait exploser le stockage et le coût du système de métriques.
3. Parce que la moyenne cache les queues de distribution, c'est-à-dire les requêtes les plus lentes, qui sont l'expérience des utilisateurs les plus affectés.
4. Pour pouvoir relier un journal, une métrique et une trace d'un même déroulement, et passer de l'un à l'autre en diagnostic.
5. Moyenne : $0{,}98 \times 100 + 0{,}02 \times 5\,000 = 198$ ms. Le p99 est d'environ 5 s : il révèle le problème que la moyenne cache.

## 11.13 Surveillance, alertes et sondes de santé

### 1. Comprendre simplement

La **surveillance** (*monitoring*) consiste à **collecter et vérifier en continu des indicateurs** pour savoir si un système va bien. Les **alertes** (*alerts*) sont les notifications émises quand une situation exige l'attention ou l'action d'une personne. Les **sondes de santé** (*health checks*) sont des vérifications simples qui indiquent si un composant est en mesure de rendre service.

**Pourquoi cela existe.** On ne peut pas surveiller des milliers de composants à l'œil. Il faut des mécanismes qui détectent les anomalies avant les utilisateurs, préviennent les bonnes personnes, et permettent aux automates (répartiteurs de charge, orchestrateurs) de réagir.

**Problème résolu.** Détecter vite et de façon fiable les dégradations, prévenir les bonnes personnes sans les noyer, et déclencher les réparations automatiques.

**Modèle mental.** Les voyants d'un tableau de bord et le détecteur de fumée : ils surveillent en continu ; la plupart du temps ils sont silencieux ; quand quelque chose d'important se produit, ils alertent de façon claire et sans ambiguïté.

**Où l'analogie s'arrête.** Un détecteur de fumée a une seule fonction. Un système de surveillance doit trier des milliers de signaux, distinguer l'important du bruit, et se surveiller lui-même.

**Exemple.** Une sonde de disponibilité interroge toutes les 30 secondes l'API comme le ferait un utilisateur. Si le taux d'erreurs dépasse 2 % pendant 5 minutes, une alerte est envoyée à l'astreinte, avec un lien vers le manuel de résolution.

**Les composants.**

1. des **indicateurs** collectés ;
2. des **règles d'alerte** ;
3. des **canaux** et un **routage** ;
4. des **sondes** (santé, synthétiques) ;
5. des **tableaux de bord** et des **manuels**.

**Objectif d'apprentissage :** vous pouvez concevoir une alerte actionnable, distinguer les sondes de vivacité et de disponibilité, et expliquer la surveillance synthétique.

### 2. Connaissances essentielles

#### Définition

- **Surveillance** : collecte, analyse et affichage continus d'indicateurs de l'état d'un système, pour en détecter les écarts.
- **Alerte** : notification automatique déclenchée par une condition surveillée, adressée à une personne ou à un système pour qu'il agisse.
- **Sonde de santé** : vérification, souvent exposée par un point d'accès, qui indique si un composant fonctionne ou est prêt à recevoir du trafic.

#### Idées fondamentales

1. **On alerte sur les symptômes.** Ce que les utilisateurs ressentent (erreurs, lenteur), plus que les causes possibles.
2. **Chaque alerte est actionnable.** Si personne n'a rien à faire, ce n'est pas une alerte.
3. **Le bruit tue la vigilance.** Trop d'alertes inutiles conduisent à ignorer les vraies.
4. **La gravité détermine le canal.** Réveiller quelqu'un la nuit est réservé à ce qui l'exige.
5. **Les sondes servent aux automates.** Retirer une instance malade, redémarrer.
6. **On surveille aussi la surveillance.** Un système de supervision muet est une catastrophe silencieuse.

#### Vocabulaire essentiel

- **Sonde de vivacité** (*liveness probe*) : le processus est-il vivant ? Sinon, le redémarrer.
- **Sonde de disponibilité** (*readiness probe*) : est-il prêt à recevoir du trafic ? Sinon, ne pas lui en envoyer.
- **Surveillance synthétique** (*synthetic monitoring*) : scénarios simulés exécutés régulièrement depuis l'extérieur.
- **Seuil** (*threshold*) : valeur au-delà de laquelle une alerte se déclenche.
- **Alerte d'urgence** (*page*) et **ticket** : réveil immédiat, ou traitement en heures ouvrées.
- **Manuel d'exécution** (*runbook*) : procédure associée à une alerte.
- **Suppression** (*silence*) : mise en sourdine planifiée d'alertes (maintenance).
- **Signal de vie** (*dead man's switch*) : alerte déclenchée par l'absence d'un signal attendu.

#### Relations de cause à effet

- Les alertes portent sur des causes (processeur à 85 %). Elles se déclenchent souvent sans impact pour les utilisateurs, et les équipes cessent d'y répondre.
- Les alertes n'ont pas de propriétaire ni de manuel. Chaque déclenchement provoque une enquête de zéro.
- La sonde de santé teste seulement que le processus répond. Une instance dont la base est inaccessible reste dans la rotation et renvoie des erreurs.

#### Idées reçues

- **« Plus on a d'alertes, mieux on est protégé. »** Au contraire : la fatigue d'alerte fait manquer les incidents réels.
- **« Un tableau de bord vert signifie que tout va bien. »** Seulement si les bons indicateurs y figurent et si les sondes reflètent l'expérience réelle.
- **« Un seuil fixe convient. »** Les comportements varient selon l'heure, le jour, la saison : on préfère les seuils relatifs ou fondés sur des objectifs.

#### Principe clé

Chaque alerte signale un symptôme important, appelle une action précise, a un responsable et un manuel ; tout le reste va dans un tableau de bord ou un ticket.

#### Si vous ne retenez que trois choses

1. On alerte sur ce que les utilisateurs ressentent, et chaque alerte est actionnable.
2. Les sondes de vivacité et de disponibilité répondent à deux questions différentes.
3. La surveillance synthétique et le signal de vie couvrent ce que les signaux internes ne voient pas.

### 3. Explication technique détaillée

#### Les sondes de santé

| Sonde | Question | Action en cas d'échec |
|---|---|---|
| Vivacité (*liveness*) | Le processus fonctionne-t-il (n'est-il pas bloqué) ? | Redémarrer l'instance |
| Disponibilité (*readiness*) | Peut-il traiter une requête maintenant (dépendances, chauffe de cache) ? | Le retirer de la rotation, sans le redémarrer |
| Démarrage (*startup*) | A-t-il fini de démarrer ? | Attendre avant les autres sondes |

```json
{
  "status": "ready",
  "version": "2026.10.3",
  "checks": {
    "database": { "status": "ok", "latency_ms": 4 },
    "event_bus": { "status": "ok" },
    "cache": { "status": "degraded", "detail": "hit ratio low" },
    "rules_service": { "status": "ok" }
  }
}
```

**Superficielle ou profonde.** Une sonde superficielle (le processus répond) évite les faux positifs ; une sonde profonde (les dépendances sont vérifiées) détecte plus. Mais une sonde de vivacité trop profonde provoque des redémarrages en cascade quand une dépendance tombe : on réserve les vérifications de dépendances à la sonde de disponibilité.

#### Ce qui mérite une alerte

| Catégorie | Exemple | Pourquoi |
|---|---|---|
| Symptôme utilisateur | Taux d'erreurs au-dessus du seuil, latence p99 dépassée | Impact direct |
| Risque imminent | Disque plein dans 2 heures, quota presque épuisé | Action avant impact |
| Perte de redondance | Réplique hors service | Un second incident serait fatal |
| Sécurité | Pic d'échecs d'authentification, accès privilégié inhabituel | Détection rapide |
| Défaillance de la surveillance | Plus de métriques reçues | Aveuglement |

#### Alerter sur le rythme de consommation du budget d'erreur

Plutôt que sur un seuil instantané, on alerte sur la **vitesse** à laquelle le budget d'erreur est consommé (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)) :

$$\text{taux de consommation} = \frac{\text{taux d'erreurs observé}}{1 - \text{SLO}}$$

**Exemple.** Avec un SLO de 99,9 % (budget de 0,1 %), un taux d'erreurs de 1 % donne un taux de consommation de $0{,}01 / 0{,}001 = 10$ : le budget mensuel est épuisé en 3 jours. On déclenche une alerte d'urgence si le taux est élevé sur une fenêtre courte et une fenêtre plus longue (pour éviter les fausses alarmes).

#### La qualité d'une alerte

| Critère | Question |
|---|---|
| Actionnable | La personne sait-elle quoi faire ? |
| Importante | L'impact justifie-t-il de la déranger ? |
| Urgente | Doit-elle être traitée maintenant ? Sinon, c'est un ticket |
| Documentée | Y a-t-il un lien vers un manuel et un tableau de bord ? |
| Possédée | À quelle équipe va-t-elle ? |
| Sans doublon | Est-elle regroupée avec les alertes liées ? |

#### La surveillance synthétique

```text
Toutes les minutes, depuis plusieurs régions :
  1. s'authentifier avec un compte de test
  2. créer une ressource, la lire, déclencher une transition
  3. vérifier le résultat et la durée
  4. supprimer la ressource
Alerte si 2 échecs consécutifs depuis 2 régions différentes
```

Elle détecte ce que les signaux internes ne voient pas : un problème de DNS, de certificat, de passerelle, ou un chemin utilisateur cassé alors que tous les composants se déclarent sains.

#### Le signal de vie

Pour détecter la panne du système d'alerte lui-même, une alerte « toujours déclenchée » est envoyée régulièrement à un service externe. Si ce signal cesse d'arriver, une personne est prévenue : la supervision est muette.

#### Les alertes par tenant

Un incident peut toucher un seul tenant (voisin bruyant, intégration défaillante). La plateforme surveille aussi des indicateurs par tenant ou par catégorie, et alerte sur les écarts anormaux, sans multiplier les alertes globales.

#### Les modes de défaillance

- **Fatigue d'alerte** : volume excessif, faible taux d'actions.
- **Alertes sans propriétaire** : personne n'est responsable.
- **Seuils périmés** : valeurs choisies il y a deux ans, devenues inadaptées.
- **Surveillance dépendante de l'infrastructure surveillée** : elle tombe avec elle.
- **Faux sentiment de sécurité** : sondes qui ne reflètent pas l'expérience utilisateur.

**Contre-exemple.** Une alerte « utilisation du processeur supérieure à 80 % » qui se déclenche 40 fois par semaine sans impact, et vers laquelle l'astreinte réagit en la désactivant. Quand un vrai incident survient, plus personne ne regarde.

**Limites.** Une bonne politique d'alerte est un travail d'amélioration continue : on revoit chaque alerte déclenchée (utile, inutile ?), on supprime ou on affine, et on mesure le ratio d'alertes qui ont mené à une action.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces) | Elle s'appuie sur les journaux, métriques et traces |
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | Les alertes sur le budget d'erreur relèvent des SLO |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | Les sondes déclenchent les basculements |
| [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem) | Une alerte d'urgence ouvre souvent un incident |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La console de tenant expose des alertes propres au client |
| [1.7 Plan de contrôle, plan de données et plan de gestion](01-architecture-saas.md#17-plan-de-contrôle-plan-de-données-et-plan-de-gestion) | Les sondes sont des fonctions du plan de données et de gestion |

### 5. Application pratique

**Situation initiale.** L'astreinte reçoit 60 alertes par semaine, dont une sur dix mène à une action. Un incident réel d'une heure sur l'API a été manqué, noyé dans le bruit.

**Problème.** Les alertes sont fondées sur des causes techniques, sans propriétaire ni manuel.

**Application du concept.** Une refonte des alertes autour des symptômes et des objectifs de service.

**Déroulé.**

1. L'équipe analyse les 60 alertes : 38 sont sans action, 12 sont des doublons, 10 sont utiles.
2. Elle remplace les alertes de ressources par deux alertes de symptôme : taux d'erreurs et latence p99 de l'API, avec taux de consommation du budget d'erreur.
3. Elle ajoute une surveillance synthétique de trois parcours utilisateur.
4. Chaque alerte reçoit un propriétaire, un tableau de bord et un manuel.
5. Les causes techniques (processeur, disque) deviennent des tickets ou des tableaux de bord.

**Résultat.** Cinq alertes par semaine en moyenne, dont quatre mènent à une action, et le prochain incident est détecté en moins de deux minutes.

**Limites.** Certaines causes (disque presque plein) restent à surveiller en prévention, avec un seuil prévisionnel et un ticket plutôt qu'un réveil nocturne.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle différence y a-t-il entre une sonde de vivacité et une sonde de disponibilité ?
2. **Compréhension.** Qu'est-ce qu'une alerte actionnable ?
3. **Compréhension.** À quoi sert la surveillance synthétique ?
4. **Pourquoi.** Pourquoi une sonde de vivacité ne doit-elle pas vérifier les dépendances ?
5. **Raisonnement pratique.** Avec un SLO de 99,9 %, un taux d'erreurs de 0,5 % correspond à quel taux de consommation du budget ?

#### Réponses

1. La sonde de vivacité indique si le processus fonctionne et doit être redémarré sinon ; la sonde de disponibilité indique s'il peut recevoir du trafic, et le retire de la rotation sinon.
2. Une alerte qui signale un problème important et urgent, pour lequel la personne sait quelle action entreprendre, avec un manuel disponible.
3. À détecter les problèmes visibles seulement de l'extérieur ou de bout en bout (DNS, certificats, parcours cassé), en simulant des utilisateurs.
4. Parce qu'une panne d'une dépendance déclencherait le redémarrage en cascade de toutes les instances, ce qui aggraverait l'incident.
5. $0{,}005 / 0{,}001 = 5$ : le budget est consommé cinq fois plus vite que prévu.

## 11.14 Suivi des erreurs

### 1. Comprendre simplement

Le **suivi des erreurs** (*error tracking*) consiste à **capturer automatiquement les erreurs inattendues d'une application, à les regrouper par cause et à les présenter aux développeurs avec le contexte nécessaire pour les corriger**.

**Pourquoi cela existe.** Un système en production produit des erreurs que personne ne voit. Les journaux en contiennent des milliers de lignes, souvent identiques. On n'y lit ni le nombre de causes distinctes, ni le nombre d'utilisateurs ou de tenants touchés, ni la version à partir de laquelle l'erreur apparaît. Et la plupart des utilisateurs ne signalent rien.

**Problème résolu.** Transformer un flux brut d'erreurs en une courte liste de **problèmes distincts**. Chaque problème porte son contexte (version, tenant, requête, pile d'appels), son compteur et son responsable, et il est suivi jusqu'à la correction.

**Modèle mental.** Le cahier de réclamations d'un garage. Deux cents appels de clients qui disent « la voiture fait un bruit » deviennent trois fiches : plaquettes, courroie, suspension. Chaque fiche indique combien de clients sont concernés, quand le premier appel est arrivé et quel mécanicien s'en occupe.

**Où l'analogie s'arrête.** Les clients appellent d'eux-mêmes ; un logiciel doit détecter ses propres erreurs. Le regroupement est aussi une heuristique : il peut fusionner à tort deux causes, ou éclater une cause unique en plusieurs fiches.

**Exemple.** En deux heures, 1 240 erreurs « impossible de lire une propriété de `null` » apparaissent dans le moteur de règles. Le suivi les regroupe en **un seul problème** : première occurrence dans la version 2026.10.3, trois tenants touchés, une pile d'appels et un lien vers une trace. Le problème est assigné à l'équipe du moteur de règles.

**Les composants.**

1. la **capture** des erreurs dans l'application ;
2. l'**enrichissement** par le contexte ;
3. le **nettoyage** des données sensibles ;
4. le **regroupement** par empreinte ;
5. le **cycle de vie** du problème (nouveau, pris en charge, corrigé, régression) ;
6. les **règles d'alerte** et le lien avec les tickets.

**Objectif d'apprentissage :** vous pouvez expliquer la différence entre un événement d'erreur et un problème, dire pourquoi le contexte et le nettoyage sont indispensables, et décrire le cycle de vie d'un problème.

### 2. Connaissances essentielles

#### Définition

- **Suivi des erreurs** : pratique et outillage qui capturent les erreurs inattendues d'une application, les enrichissent d'un contexte, les regroupent en problèmes distincts et suivent leur traitement jusqu'à la correction.
- **Problème** (*issue*) : ensemble d'événements d'erreur qui partagent la même cause apparente.

#### Idées fondamentales

1. **On regroupe avant de compter.** Mille occurrences d'une même cause forment un problème, pas mille problèmes.
2. **Le contexte vaut autant que l'erreur.** Version, environnement, tenant, requête et trace rendent l'erreur reproductible. La pile d'appels seule suffit rarement.
3. **On distingue l'attendu de l'inattendu.** Une validation refusée est un fonctionnement normal. Une exception non gérée est un défaut.
4. **On protège les données.** Une pile d'appels ou un corps de requête peut contenir des secrets ou des données personnelles : on les retire avant l'envoi.
5. **Un problème a un cycle de vie.** Il est détecté, pris en charge, corrigé dans une version, et il peut réapparaître : c'est une régression.
6. **Le suivi complète les autres signaux.** Les métriques disent combien d'erreurs se produisent ; le suivi dit quelles en sont les causes.

#### Vocabulaire essentiel

- **Événement** (*event*) : une occurrence d'erreur capturée, avec son contexte.
- **Problème** (*issue*) : groupe d'événements de même cause apparente.
- **Empreinte** (*fingerprint*) : valeur calculée à partir de l'événement, qui détermine le problème auquel il est rattaché.
- **Pile d'appels** (*stack trace*) : liste des fonctions en cours d'exécution au moment de l'erreur.
- **Version déployée** (*release*) : identifiant de la version du code qui a produit l'événement.
- **Fil d'événements précédents** (*breadcrumbs*) : actions et événements survenus juste avant l'erreur (requêtes, navigation, lignes de journal).
- **Cartes de correspondance** (*source maps*) : fichiers qui permettent de retrouver le code source d'origine à partir d'un code JavaScript compacté.
- **Régression** (*regression*) : réapparition, dans une version égale ou postérieure à la correction, d'un problème marqué corrigé.
- **Nettoyage** (*scrubbing*) : retrait ou masquage des données sensibles avant l'envoi.

#### Relations de cause à effet

- Les événements ne sont pas regroupés. Dix mille lignes décrivent un seul défaut, l'équipe est noyée, et un nouveau problème grave passe inaperçu dans la masse.
- La version n'est pas enregistrée. On ne peut pas relier l'apparition d'un problème à un déploiement, et la décision de retour arrière est retardée.
- On capture toutes les réponses 4xx. Le bruit masque les vrais défauts, et l'équipe cesse de consulter l'outil.
- Les corps de requête sont envoyés sans filtre. Des données personnelles ou des secrets quittent le périmètre contrôlé vers un service tiers.

#### Idées reçues

- **« Les journaux suffisent. »** Les journaux contiennent l'information, mais ils ne regroupent pas par cause, ne comptent pas les tenants touchés et ne suivent pas l'état de la correction.
- **« L'objectif est zéro erreur. »** Ce n'est pas réaliste. L'objectif est qu'aucune erreur inattendue ne reste sans tri, et que le taux d'erreurs respecte les objectifs de service (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)).
- **« Sans plainte d'utilisateur, une erreur est sans importance. »** Beaucoup d'utilisateurs ne signalent rien. Une erreur silencieuse peut interrompre une synchronisation ou laisser des données incohérentes.

#### Principe clé

Une erreur n'est exploitable que si elle est regroupée avec ses semblables, située (version, tenant, requête) et attribuée à un responsable jusqu'à sa correction.

#### Si vous ne retenez que trois choses

1. Le suivi des erreurs transforme un flux d'événements en une liste de problèmes distincts.
2. Le contexte rend l'erreur diagnosticable, et le nettoyage protège les données.
3. Un problème a un cycle de vie, et le suivi détecte aussi les régressions.

### 3. Explication technique détaillée

Des produits spécialisés (par exemple Sentry ou Rollbar) et plusieurs plateformes d'observabilité fournissent ces fonctions. Le principe reste le même.

#### Du flux d'événements à la liste de problèmes

```text
exception non gérée ou erreur anormale
   │
   ▼
SDK dans l'application : capture, contexte, nettoyage des données sensibles
   │
   ▼  envoi asynchrone, file locale bornée, limitation du débit d'envoi
collecteur
   │
   ▼
calcul de l'empreinte ──► rattachement à un problème existant, ou création d'un problème
   │
   ▼
problème : compteur, première et dernière occurrence, versions, tenants touchés, responsable
   │
   ▼
règles : nouveau problème, régression, pic ──► alerte, ticket, message à l'équipe
```

**Pourquoi un envoi asynchrone.** L'application ne doit jamais ralentir, ni tomber, parce que l'outil de suivi est lent ou indisponible. Le SDK place les événements dans une file locale bornée et les envoie en arrière-plan, avec des délais d'attente courts. Si la file est pleine, il abandonne des événements plutôt que de bloquer la requête.

#### Ce qui est capturé

| Source | Exemple | Remarque |
|---|---|---|
| Exception non gérée | Erreur de type dans le moteur de règles | Un gestionnaire global la capture : c'est le filet de sécurité |
| Erreur gérée mais anormale | Échec d'appel au système qualité après toutes les nouvelles tentatives | Capture explicite, avec un niveau de gravité |
| Tâche de fond ou consommateur de messages | Échec d'un traitement planifié | Hors requête HTTP : sans capture explicite, personne ne le voit (voir [7.6 Tâche planifiée et tâche de fond](07-evenements-automatisation.md#76-tâche-planifiée-et-tâche-de-fond) et [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) |
| Navigateur | Erreur JavaScript pendant l'affichage d'un formulaire | Demande des cartes de correspondance ; beaucoup de bruit externe (extensions, réseau) |
| Application mobile | Plantage de l'application | Demande des fichiers de symboles (par exemple dSYM sur iOS) |

**Ce qui ne doit pas devenir un problème.** Les réponses 4xx attendues : validation refusée, ressource absente, droits insuffisants, conflit de version (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) et [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)). Elles font partie du fonctionnement normal et sont comptées dans les métriques (voir [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces)). Les ouvrir comme problèmes noie les vrais défauts.

#### Un événement enrichi

```json
{
  "event_id": "9c1e5f0a7b2d4e86",
  "timestamp": "2026-10-13T08:42:17Z",
  "level": "error",
  "exception": {
    "type": "TypeError",
    "value": "Cannot read properties of null (reading 'getTime')",
    "stacktrace": [
      { "module": "rules/inspection", "function": "computeNextInspection", "line": 88 },
      { "module": "engine/workflow", "function": "evaluateGuards", "line": 214 },
      { "module": "engine/resource", "function": "applyTransition", "line": 131 }
    ]
  },
  "release": "2026.10.3",
  "environment": "production",
  "tags": {
    "tenant_id": "ten_airline_01",
    "resource_type": "aircraft",
    "operation": "transition"
  },
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "breadcrumbs": [
    "08:42:17.002 PATCH /aircraft/ac_8f3a/transitions/ground",
    "08:42:17.010 autorisation accordée",
    "08:42:17.031 évaluation de la garde « inspection à jour »"
  ]
}
```

| Élément de contexte | Ce qu'il permet |
|---|---|
| `release` | Relier le problème à un déploiement et détecter les régressions |
| `environment` | Séparer la production de la préproduction |
| `tenant_id` | Mesurer l'étendue : combien de tenants sont touchés |
| `trace_id` | Retrouver le chemin complet de la requête (voir [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces)) |
| `breadcrumbs` | Comprendre ce qui a précédé l'erreur |

#### Le regroupement par empreinte

L'outil calcule une **empreinte** pour chaque événement. Deux événements de même empreinte appartiennent au même problème. Le calcul par défaut s'appuie sur :

1. le **type** de l'exception ;
2. les **éléments stables** de la pile d'appels : module et fonction des cadres qui appartiennent au code de l'application, sans numéros de ligne ni valeurs ;
3. à défaut de pile, le **message normalisé**, dans lequel les identifiants et les nombres sont remplacés par des marqueurs.

| Message brut | Message normalisé |
|---|---|
| `Aircraft ac_8f3a not found` | `Aircraft <id> not found` |
| `Timeout after 10000 ms calling quality-system` | `Timeout after <n> ms calling quality-system` |

**Règles personnalisées.** Le calcul par défaut échoue dans deux cas fréquents. Une fonction générique qui encapsule tous les appels externes figure dans toutes les piles : les erreurs de tous les systèmes externes fusionnent. On ajoute alors le système cible à l'empreinte. À l'inverse, une même cause qui passe par plusieurs chemins d'appel produit plusieurs problèmes : on les regroupe par une règle explicite.

```text
règle de regroupement (pseudo-configuration)
  si type d'exception = ExternalCallError
  alors empreinte = [type, étiquette « target_system »]
```

| Défaut de regroupement | Effet | Conséquence | Remède |
|---|---|---|---|
| Sur-regroupement | Des causes distinctes sont fusionnées | Un défaut reste caché derrière un autre | Affiner l'empreinte |
| Sous-regroupement | Une cause est éclatée en plusieurs problèmes | Bruit, et impact sous-estimé | Fusionner par une règle |

#### Le cycle de vie d'un problème

```text
nouveau ──► pris en charge ──► corrigé dans la version X ──► fermé
   │                                   │
   │                                   └── réapparition dans une version ≥ X ──► régression ──► pris en charge
   │
   └──► ignoré (avec un motif et une échéance de réexamen)
```

**Pourquoi la version compte dans la régression.** Un problème marqué « corrigé dans 2026.10.4 » peut encore apparaître depuis des instances qui exécutent l'ancienne version, pendant un déploiement progressif. Ce n'est pas une régression. La réapparition dans une version égale ou postérieure à 2026.10.4 en est une.

#### Les règles d'alerte propres au suivi

| Condition | Exemple | Réponse |
|---|---|---|
| Nouveau problème en production | Première occurrence d'une empreinte | Ticket ou message à l'équipe propriétaire |
| Régression | Problème corrigé qui réapparaît | Message à l'équipe, lien vers le correctif |
| Pic de fréquence | Fréquence multipliée par 10 en 15 minutes | Alerte d'urgence si un symptôme utilisateur est confirmé (voir [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)) |
| Nouveau problème juste après un déploiement | Apparition dans les 30 minutes qui suivent | Examen du déploiement, retour arrière possible (voir [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière)) |
| Étendue | Un problème touche plus de dix tenants | Montée en priorité |

#### Contrôler le volume

Une boucle d'erreurs peut produire des millions d'événements en quelques minutes. Les événements 1 et 100 000 d'une même empreinte n'apportent presque rien de plus.

- **L'échantillonnage** conserve les premiers événements détaillés de chaque empreinte, puis un événement sur N. Les compteurs restent exacts.
- **La limitation** plafonne le nombre d'événements acceptés par minute, par application ou par tenant. Elle protège l'outil et la facture.
- **Un disjoncteur côté client** arrête l'envoi quand le collecteur est indisponible (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)).

**Point de vigilance.** Si un plafond est atteint, un nouveau problème grave peut être perdu au milieu de la tempête. Les outils sérieux réservent de la place aux nouvelles empreintes.

#### Protéger les données

| Risque | Mesure |
|---|---|
| Secrets dans les en-têtes (`Authorization`, `Cookie`) | Liste de blocage d'en-têtes ; jamais envoyés |
| Corps de requête avec données personnelles | Ne pas envoyer les corps, ou ne garder que des champs autorisés |
| Valeurs des variables locales dans la pile | Désactiver leur capture, ou les filtrer |
| Identifiant d'utilisateur | Pseudonymiser, ou envoyer un identifiant interne sans signification |
| Lieu de stockage des événements | Choisir la région de l'outil ; encadrer par contrat de sous-traitance |

**Principe : nettoyer à la source.** Le nettoyage se fait dans le processus de l'application, avant l'envoi. Une donnée qui a quitté le périmètre est déjà chez un tiers, dans ses sauvegardes, avec ses propres règles de conservation. Le nettoyage dans l'outil est un second filet, pas le premier.

#### Le multi-tenant

- **L'étendue prime sur le volume.** Un problème de 10 000 événements pour un seul tenant est souvent une boucle d'intégration. Un problème de 300 événements répartis sur 40 tenants est plus probablement un défaut de la plateforme. On trie par nombre de tenants touchés autant que par volume.
- **Le cloisonnement.** Les événements peuvent contenir des données d'un tenant. L'accès à l'outil est réservé aux équipes internes habilitées. Aucune vue n'expose à un client les erreurs d'un autre.
- **L'identifiant de support.** Le message d'erreur renvoyé au client (voir [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs)) contient un identifiant de corrélation. Le support retrouve l'événement exact sans exposer la pile d'appels au client (voir [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur)).

#### Les modes de défaillance

- **Tout capturer** : bruit des erreurs attendues et des extensions de navigateur ; plus personne ne regarde.
- **Erreurs avalées** : un `catch` vide fait disparaître l'erreur sans la signaler.
- **Piles illisibles** : code compacté sans cartes de correspondance, binaire sans symboles.
- **Problèmes jamais triés** : la liste grossit, et « ignorer » est utilisé sans échéance de réexamen.
- **Fuite de données** : corps de requête, secrets ou données personnelles envoyés à un tiers.
- **Outil qui pénalise l'application** : un SDK bloquant ralentit les requêtes quand le collecteur est lent.

**Contre-exemple.** Un connecteur de synchronisation contient `catch (e) { return null; }`. Quand le système externe renvoie une erreur, le code continue avec une valeur vide. Aucune exception n'est signalée, aucune alerte ne se déclenche, et des enregistrements cessent de se synchroniser pendant trois semaines avant qu'un client le remarque.

**Limites.** Le suivi des erreurs détecte les exceptions. Il ne détecte pas les résultats faux sans exception : une règle mal configurée, un calcul erroné, une donnée corrompue. Pour ceux-là, on s'appuie sur les invariants (voir [13.5 Invariants](13-concepts-transversaux.md#135-invariants)), les tests et la surveillance de métriques métier.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces) | Les journaux, métriques et traces sont complémentaires ; `trace_id` relie les événements d'erreur à la requête complète |
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | Les règles d'alerte du suivi complètent les alertes sur les symptômes |
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | Le taux d'erreurs mesuré alimente le SLI de disponibilité |
| [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem) | Un pic de problèmes graves ouvre souvent un incident |
| [3.8 Validation et gestion des erreurs](03-crud-runtime-ressources.md#38-validation-et-gestion-des-erreurs) | La classification des erreurs (attendues ou non, client ou serveur) décide de ce qui est suivi |
| [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs) | Les messages en lettres mortes sont des erreurs de consommateurs asynchrones à suivre |
| [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) | Une régression détectée juste après un déploiement conduit à un retour arrière |
| [12.11 États vides et états d'erreur](12-produit-ux.md#1211-états-vides-et-états-derreur) | L'identifiant de corrélation s'affiche dans les états d'erreur de l'interface |

### 5. Application pratique

**Situation initiale.** Après le déploiement de la version 2026.10.3, des utilisateurs de la compagnie aérienne signalent que « les transitions échouent parfois ». Les journaux contiennent 14 000 lignes d'erreur en 24 heures. Personne ne peut dire combien de causes distinctes existent.

**Problème.** Aucun regroupement, aucune information sur l'étendue, aucun lien avec les versions.

**Application du concept.** Le suivi des erreurs est branché sur le moteur de ressources et sur les tâches de fond.

**Déroulé.**

1. Le SDK est configuré avec la version déployée, l'environnement et l'étiquette `tenant_id`. Les en-têtes sensibles et les corps de requête sont exclus à la source.
2. En une heure, l'outil produit trois problèmes : **A**, une erreur de type sur une valeur `null` (11 200 événements, 3 tenants, première occurrence dans 2026.10.3) ; **B**, un délai dépassé lors de l'appel au système qualité (2 600 événements, 1 tenant) ; **C**, 200 violations de contrainte d'unicité.
3. Le problème **A** commence avec le déploiement. La pile désigne `computeNextInspection`, qui échoue quand `next_inspection_date` est absent. Les enregistrements concernés viennent d'un import (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)). L'équipe corrige, ajoute un test et marque « corrigé dans 2026.10.4 ».
4. Le problème **B** est une défaillance d'un système externe. La politique de nouvelles tentatives est examinée (voir [7.7 Nouvelles tentatives, file de lettres mortes et idempotence des consommateurs](07-evenements-automatisation.md#77-nouvelles-tentatives-file-de-lettres-mortes-et-idempotence-des-consommateurs)) et une alerte d'intégration est configurée pour le tenant concerné.
5. Le problème **C** est un conflit de concurrence attendu (voir [3.10 Concurrence et verrouillage optimiste](03-crud-runtime-ressources.md#310-concurrence-et-verrouillage-optimiste)). Il est renvoyé au client comme une réponse 4xx. Il est retiré du suivi et compté dans les métriques.

**Résultat.** Deux problèmes à traiter au lieu de 14 000 lignes. Le problème A est corrigé en une journée. La détection des régressions est active sur la version 2026.10.4.

**Limites.** Ce suivi n'aurait pas détecté un calcul faux sans exception. Les invariants et les tests restent nécessaires.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Qu'est-ce qu'une empreinte, et à quoi sert-elle ?
2. **Compréhension.** Pourquoi enregistre-t-on la version déployée dans chaque événement ?
3. **Compréhension.** Une validation refusée avec une réponse 4xx doit-elle devenir un problème ? Pourquoi ?
4. **Pourquoi.** Pourquoi nettoie-t-on les données sensibles dans l'application, avant l'envoi, plutôt que dans l'outil de suivi ?
5. **Raisonnement pratique.** Un problème compte 10 000 événements en 5 minutes, tous d'un même tenant. Un autre en compte 300 en une heure, répartis sur 40 tenants. Lequel examinez-vous en premier, et que vérifiez-vous pour l'autre ?

#### Réponses

1. Une valeur calculée à partir du type de l'exception et des éléments stables de la pile d'appels. Elle détermine le problème auquel l'événement est rattaché, et permet donc de regrouper les occurrences d'une même cause.
2. Pour relier l'apparition d'un problème à un déploiement, décider d'un retour arrière, et détecter les régressions (réapparition dans une version égale ou postérieure à la correction).
3. Non. C'est un fonctionnement normal du système. On la compte dans les métriques, mais l'ouvrir comme problème noierait les vrais défauts.
4. Parce qu'une donnée qui a quitté le périmètre est déjà chez un tiers, avec ses propres sauvegardes et règles de conservation. Le nettoyage à la source empêche la sortie. Le nettoyage dans l'outil n'est qu'un second filet.
5. On examine d'abord le second : il touche 40 tenants, ce qui désigne probablement un défaut de la plateforme. Pour le premier, on vérifie qu'il s'agit d'une boucle limitée à un tenant et qu'elle ne sature pas des ressources partagées (voisin bruyant) ; un quota peut la contenir.

## 11.15 SLI, SLO et SLA

### 1. Comprendre simplement

Ces trois sigles décrivent trois niveaux d'une même idée : **mesurer la qualité du service, fixer un objectif, puis s'engager par contrat**.

- Un **indicateur de niveau de service** (**SLI**, *Service Level Indicator*) est une **mesure**. Exemple : la proportion de requêtes qui réussissent.
- Un **objectif de niveau de service** (**SLO**, *Service Level Objective*) est la **cible interne** fixée pour cet indicateur. Exemple : 99,9 % sur 30 jours.
- Un **accord de niveau de service** (**SLA**, *Service Level Agreement*) est l'**engagement contractuel** envers le client, avec des conséquences s'il n'est pas tenu. Exemple : un avoir sur la facture.

**Pourquoi cela existe.** « Le service est fiable » ne veut rien dire tant qu'on n'a pas défini ce que « fiable » signifie, comment on le mesure et à partir de quand on agit. Sans objectif chiffré, la fiabilité reste une opinion. Les équipes produit poussent des nouveautés, les équipes d'exploitation freinent, et personne ne peut trancher.

**Problème résolu.** Donner un langage commun et mesurable aux utilisateurs, aux ingénieurs et au contrat. Fournir aussi un **budget d'erreur** qui permet d'arbitrer, avec des chiffres, entre la vitesse d'évolution et la stabilité.

**Modèle mental.** Un transporteur ferroviaire. Le SLI est la part des trains arrivés à moins de cinq minutes de l'heure prévue. Le SLO est la cible interne : 95 % par mois. Le SLA est l'engagement envers les abonnés : un remboursement partiel si la ponctualité passe sous 90 %.

**Où l'analogie s'arrête.** Un train est à l'heure ou en retard. Pour un service logiciel, il faut définir précisément ce qu'est une requête « valide », une requête « réussie », et l'endroit où l'on mesure. Ces choix changent le résultat.

**Exemple.** SLI de disponibilité : proportion des requêtes de l'API qui reçoivent une réponse sans erreur serveur. SLO interne : 99,9 % sur 30 jours glissants. SLA proposé au client : 99,5 % par mois, avec un avoir de 10 % de la facture mensuelle en cas de manquement.

**Les composants.**

1. l'**indicateur** (SLI) et sa définition précise ;
2. l'**objectif** (SLO) sur une fenêtre de temps ;
3. le **budget d'erreur**, qui en découle ;
4. la **politique** qui dit quoi faire selon le budget restant ;
5. l'**engagement contractuel** (SLA) et ses conséquences.

**Objectif d'apprentissage :** vous pouvez définir un SLI, calculer un budget d'erreur, et expliquer la différence entre un SLO et un SLA.

### 2. Connaissances essentielles

#### Définition

- **SLI** : mesure quantitative d'un aspect du niveau de service, le plus souvent le rapport entre les événements satisfaisants et les événements valides.
- **SLO** : valeur cible, ou plage de valeurs, fixée pour un SLI sur une période donnée.
- **SLA** : accord contractuel entre un fournisseur et un client, qui fixe des niveaux de service et les conséquences (par exemple des avoirs) s'ils ne sont pas atteints.
- **Budget d'erreur** (*error budget*) : part de défaillance que le SLO tolère sur la période, soit $1 - \text{SLO}$.

#### Idées fondamentales

1. **On mesure ce que vit l'utilisateur.** Un bon indicateur reflète l'expérience, pas l'état interne des machines.
2. **100 % n'est pas un objectif raisonnable.** Chaque neuf supplémentaire coûte beaucoup plus cher, les dépendances ne le permettent pas, et l'utilisateur ne perçoit pas la différence au-delà de la fiabilité de son propre réseau.
3. **Le SLO est interne, le SLA est un contrat.** Le SLO est plus exigeant que le SLA, pour conserver une marge.
4. **Le budget d'erreur rend l'arbitrage objectif.** Tant qu'il en reste, on peut prendre des risques. Quand il est épuisé, la fiabilité passe en priorité.
5. **Tout objectif a une fenêtre.** Une période glissante (par exemple 30 jours) ou calendaire (le mois).
6. **On alerte sur la vitesse de consommation du budget.** Pas sur chaque erreur isolée.

#### Vocabulaire essentiel

- **Événement valide** (*valid event*) : événement pris en compte dans le calcul. Les requêtes mal formées ou non authentifiées en sont en général exclues.
- **Événement satisfaisant** (*good event*) : événement valide qui répond au critère (réussite, rapidité).
- **Budget d'erreur** (*error budget*) : quantité d'erreurs tolérée par le SLO sur la période.
- **Taux de consommation** (*burn rate*) : vitesse à laquelle le budget est consommé, rapportée à la vitesse nominale.
- **Fenêtre** (*window*) : période d'évaluation, glissante (*rolling*) ou calendaire.
- **Avoir de service** (*service credit*) : compensation financière prévue par le SLA en cas de manquement.
- **Politique du budget d'erreur** (*error budget policy*) : décisions convenues d'avance selon l'état du budget.

#### Relations de cause à effet

- Le SLO est trop strict. Le coût devient très élevé, et les évolutions sont bloquées pour un bénéfice que l'utilisateur ne perçoit pas.
- Le SLO est trop lâche. Les utilisateurs sont mécontents sans qu'aucune alerte ne se déclenche.
- L'indicateur est mesuré à l'intérieur du service. Quand le service est à l'arrêt, il ne reçoit plus de requêtes et semble « parfait ».
- Le SLA promet plus que le système ne peut tenir. Les avoirs s'accumulent et la confiance du client diminue.
- Aucune politique n'accompagne le SLO. L'objectif reste décoratif.

#### Idées reçues

- **« SLO et SLA, c'est la même chose. »** Le SLO est un objectif interne. Le SLA est un contrat avec des conséquences, et il est plus souple que le SLO.
- **« Plus il y a de neuf, mieux c'est. »** Chaque neuf demande une redondance et une exploitation bien plus coûteuses. On choisit le niveau dont l'utilisateur a besoin.
- **« Le SLA garantit que le service ne tombera pas. »** Il définit une compensation en cas de manquement, pas une garantie technique.
- **« Un SLO global suffit pour tous les tenants. »** Une moyenne globale peut cacher un tenant très mal servi.

#### Principe clé

Un SLO chiffré, mesuré du point de vue de l'utilisateur, avec un budget d'erreur et une politique associée, remplace l'opinion par une décision.

#### Si vous ne retenez que trois choses

1. Le SLI mesure, le SLO fixe la cible interne, le SLA est le contrat.
2. Le budget d'erreur est égal à $1 - \text{SLO}$ et sert à arbitrer entre évolution et stabilité.
3. On mesure du point de vue de l'utilisateur, sur une fenêtre définie, tenant par tenant quand c'est nécessaire.

### 3. Explication technique détaillée

#### La chaîne complète

```text
expérience de l'utilisateur
   │
   ▼
SLI  : la mesure (événements satisfaisants / événements valides)
   │
   ▼
SLO  : la cible interne sur une fenêtre (par exemple 99,9 % sur 30 jours)
   │
   ├──► budget d'erreur : 1 − SLO
   │       │
   │       ├──► politique : que fait-on selon le budget restant ?
   │       └──► alertes : taux de consommation du budget
   │
   ▼
SLA  : l'engagement contractuel, moins exigeant que le SLO, avec ses conséquences
```

#### Choisir de bons indicateurs

| Type de service | Catégorie d'indicateur | Exemple de SLI |
|---|---|---|
| API de requêtes | Disponibilité | Part des requêtes sans erreur serveur |
| API de requêtes | Latence | Part des requêtes de lecture traitées en moins de 300 ms |
| Moteur de workflow | Exactitude et délai | Part des transitions exécutées en moins de 5 s |
| Livraison d'événements (webhooks) | Fraîcheur | Part des événements livrés en moins de 60 s |
| Synchronisation | Fraîcheur | Part des enregistrements synchronisés en moins de 15 minutes |
| Stockage de données | Durabilité | Part des objets sauvegardés qui sont restaurables |

On choisit un petit nombre d'indicateurs par service (en général deux à quatre) qui couvrent ce que l'utilisateur ressent : « est-ce que ça répond ? », « est-ce assez rapide ? », « est-ce frais ? », « est-ce correct ? ».

#### Définir un indicateur avec précision

$$\text{SLI} = \frac{\text{événements satisfaisants}}{\text{événements valides}} \times 100$$

Une définition utile précise quatre choses :

1. **Quels événements sont valides.** Par exemple, les requêtes authentifiées vers `/resources/*`. Les requêtes mal formées sont exclues.
2. **Quand un événement est satisfaisant.** Par exemple, un statut inférieur à 500 en moins de 500 ms.
3. **Où l'on mesure.** Le plus près possible de l'utilisateur : à la passerelle d'API (voir [10.4 API Gateway](10-api-integrations-extensibilite.md#104-api-gateway)), ou par des sondes synthétiques (voir [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)). Pas dans le service lui-même.
4. **Comment on traite les cas limites.** Les réponses 429 dues à la limitation (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)) sont en général exclues, sauf si la limitation vient d'un défaut de la plateforme.

```yaml
slo:
  name: api-availability
  service: resource-engine
  sli:
    valid_events: "requêtes authentifiées sur /resources/*"
    good_events: "réponses avec statut < 500, hors 429 dû aux quotas"
    measured_at: "passerelle d'API"
  objective: 99.9
  window: "30 jours glissants"
  owner: "équipe plateforme"
```

**Piège : la moyenne des pourcentages.** On calcule le SLI sur le total des événements de la fenêtre, pas en moyennant des pourcentages journaliers. Jour A : 1 000 requêtes, toutes réussies. Jour B : 1 000 000 requêtes, 99 % réussies. La moyenne des pourcentages donne 99,5 %. Le rapport des totaux est $991\,000 / 1\,001\,000 \approx 99{,}0\ \%$, ce qui correspond à l'expérience réelle des utilisateurs.

#### Le budget d'erreur

$$\text{budget d'erreur} = 1 - \text{SLO}$$

Avec un SLO de 99,9 %, le budget est de 0,1 %. On l'exprime de deux façons :

- **en temps**, pour un SLI de disponibilité : $0{,}001 \times 30 \times 24 \times 60 = 43{,}2$ minutes d'indisponibilité totale par période de 30 jours ;
- **en événements**, pour un SLI fondé sur les requêtes : avec 10 millions de requêtes par mois, 10 000 requêtes peuvent échouer. Un incident qui en fait échouer 4 000 consomme 40 % du budget.

| SLO | Budget (30 jours) |
|---|---|
| 99 % | 7 h 12 min |
| 99,5 % | 3 h 36 min |
| 99,9 % | 43,2 min |
| 99,95 % | 21,6 min |
| 99,99 % | 4,3 min |

Ce tableau prolonge celui des « neufs » (voir [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience)).

#### La politique du budget d'erreur

| Budget restant | Décision convenue |
|---|---|
| Plus de la moitié | Les évolutions et les expérimentations se poursuivent normalement |
| Moins de la moitié, ou consommation rapide | Revue des changements risqués, déploiements plus progressifs |
| Épuisé | Gel des évolutions non urgentes ; priorité aux actions de fiabilité jusqu'au retour dans l'objectif |
| Épuisé à cause d'un tiers hors de contrôle | Exception documentée, discutée avec les parties prenantes |

La politique est convenue **avant** l'incident, avec le produit et l'ingénierie. Sans cet accord préalable, chaque dépassement redevient une négociation.

#### Alerter sur le taux de consommation

$$\text{taux de consommation} = \frac{\text{taux d'erreurs observé}}{1 - \text{SLO}}$$

Un taux de 1 signifie que le budget sera exactement épuisé à la fin de la fenêtre. Un taux de 10 l'épuise dix fois plus vite. La part du budget consommée sur une période d'observation vaut :

$$\text{part consommée} = \frac{\text{taux de consommation} \times \text{durée d'observation}}{\text{durée de la fenêtre du SLO}}$$

| Taux de consommation | Fenêtre longue | Fenêtre courte | Part du budget mensuel consommée | Réponse |
|---|---|---|---|---|
| 14,4 | 1 heure | 5 minutes | 2 % | Alerte d'urgence |
| 6 | 6 heures | 30 minutes | 5 % | Alerte d'urgence |
| 1 | 3 jours | 6 heures | 10 % | Ticket |

Ces valeurs, pour un budget sur 30 jours, sont des points de départ courants dans la littérature sur la fiabilité des services (SRE). On les adapte. L'alerte se déclenche quand **les deux fenêtres** dépassent le seuil : la fenêtre longue évite les fausses alarmes sur un pic bref, la fenêtre courte fait cesser l'alerte rapidement quand le problème est résolu.

Vérification : $14{,}4 \times 1\ \text{h} / 720\ \text{h} = 0{,}02$, soit 2 % du budget mensuel en une heure.

#### Du SLO au SLA

| Critère | SLO | SLA |
|---|---|---|
| Nature | Cible interne | Engagement contractuel |
| Public | Équipes d'ingénierie et de produit | Clients, juristes, achats |
| Conséquence d'un manquement | Décision interne (gel des évolutions, priorité à la fiabilité) | Compensation prévue au contrat (avoirs, résiliation) |
| Niveau | Plus exigeant | Moins exigeant, pour garder une marge |
| Évolution | Révisé régulièrement | Modifié par négociation |

Un SLA précise en général :

- la **définition** de la disponibilité et la méthode de mesure ;
- la **période** d'évaluation (le plus souvent mensuelle) ;
- les **exclusions** : maintenance planifiée annoncée, force majeure, faute du client, défaillance d'un tiers que le fournisseur ne maîtrise pas ;
- les **compensations** : avoirs de service, plafonds ;
- la **procédure de réclamation**.

Il se rattache à l'offre commerciale : les plans n'offrent pas les mêmes engagements (voir [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage)).

#### Les dépendances limitent l'engagement

Un service qui dépend en série de plusieurs composants ne peut pas promettre mieux que leur produit (voir [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience)). Avec un moteur de ressources à 99,95 %, une base de données gérée à 99,95 % et un bus d'événements à 99,9 % :

$$0{,}9995 \times 0{,}9995 \times 0{,}999 \approx 0{,}998$$

La disponibilité de bout en bout est d'environ 99,8 %. Pour promettre 99,9 %, il faut de la redondance (voir [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement)) ou une dégradation progressive qui rend certaines dépendances facultatives (voir [11.9 Dégradation progressive](#119-dégradation-progressive)). Ce calcul suppose des pannes indépendantes ; la réalité peut être meilleure ou pire.

#### Le multi-tenant

- **Une moyenne globale peut cacher un tenant.** Un SLI global de 99,95 % est compatible avec un tenant à 97 %, par exemple si une cellule défaillante ne le dessert que lui. On calcule aussi les indicateurs par tenant, ou au moins par segment.
- **Les engagements varient selon le plan.** Le SLA du plan premium n'est pas celui du plan standard. Les mesures et les rapports suivent cette segmentation.
- **Les preuves.** Pour appliquer un SLA, il faut pouvoir prouver la mesure, par tenant, avec une méthode convenue. Le tenant peut consulter son propre rapport de conformité dans la console d'administration (voir [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle)).
- **Les quotas.** Les refus dus aux quotas du tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)) ne sont pas des défaillances de la plateforme.

#### Les modes de défaillance

- **Un SLI qui ne reflète pas l'expérience.** Mesure interne ou sonde trop superficielle.
- **Trop d'indicateurs.** Des dizaines d'objectifs : plus personne ne les regarde.
- **Un SLO sans politique.** Le budget est épuisé et rien ne change.
- **Un SLO jamais révisé.** Il ne correspond plus ni aux usages ni à la technique.
- **Un SLA sans mesure fiable.** Le fournisseur ne peut ni prouver qu'il l'a tenu, ni contester une réclamation.
- **L'optimisation du chiffre plutôt que de l'expérience.** Exclure de la mesure les cas gênants améliore le tableau de bord, pas le service.

**Contre-exemple.** Une équipe calcule la disponibilité d'après la sonde de santé du service. La sonde répond « ok » alors que la base de données est inaccessible et que toutes les requêtes des utilisateurs échouent. Le tableau de bord affiche 100 % pendant la panne.

**Limites.** Un SLO moyenne les défaillances sur la fenêtre : 40 minutes d'arrêt un dimanche à 3 h et 40 minutes un lundi à 9 h consomment le même budget, avec un impact très différent. Les SLO ne détectent pas non plus les résultats faux renvoyés avec un statut de succès. D'autres indicateurs d'exactitude sont nécessaires.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience) | La disponibilité, les « neufs » et les formules de composition fondent les calculs |
| [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces) | Les journaux, métriques et traces fournissent les événements qui alimentent les SLI |
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | Les alertes portent sur le taux de consommation du budget d'erreur |
| [11.14 Suivi des erreurs](#1114-suivi-des-erreurs) | Le taux d'erreurs inattendues alimente le SLI de disponibilité |
| [11.16 Gestion des incidents, astreinte et post-mortem](#1116-gestion-des-incidents-astreinte-et-post-mortem) | La gravité d'un incident dépend notamment de la part de budget consommée |
| [11.17 Planification de capacité](#1117-planification-de-capacité) | L'objectif de latence détermine la capacité nécessaire |
| [1.4 Abonnement et droits d'usage](01-architecture-saas.md#14-abonnement-et-droits-dusage) | Les plans d'abonnement définissent des SLA différents |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit explique des refus à exclure des événements défaillants |

### 5. Application pratique

**Situation initiale.** Un hôpital, futur client, demande dans son appel d'offres une disponibilité contractuelle de 99,99 % par mois. L'équipe commerciale veut l'accepter.

**Problème.** 99,99 % autorise $0{,}0001 \times 43\,200 = 4{,}32$ minutes d'indisponibilité par mois. Sur les six derniers mois, la disponibilité mesurée est de 99,93 %, soit environ 30 minutes par mois ($0{,}0007 \times 43\,200 \approx 30{,}2$ minutes).

**Application du concept.** L'équipe plateforme définit des indicateurs, un objectif interne, et propose un engagement réaliste.

**Déroulé.**

1. Elle définit trois SLI à partir des usages critiques de l'hôpital : disponibilité de l'API de transitions, latence de lecture, fraîcheur de la livraison des événements.
2. Elle les mesure à la passerelle d'API, avec des sondes synthétiques externes.
3. Elle calcule la disponibilité en série de la chaîne : environ 99,8 %. Elle conclut qu'un engagement à 99,99 % est hors de portée sans redondance profonde.
4. Elle fixe un SLO interne de 99,9 % (budget de 43,2 minutes) et propose un SLA de 99,5 % (budget de 216 minutes, soit $0{,}005 \times 43\,200$) dans le plan standard. Un engagement de 99,9 % est réservé au plan premium, une fois la redondance multi-zones en place (voir [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement)).
5. Elle écrit la politique du budget d'erreur et l'annexe au contrat : définition, mesure, exclusions, avoirs.

**Résultat.** Le contrat est signé avec un engagement tenable et un rapport mensuel par tenant. Au premier mois, un incident de 28 minutes consomme 65 % du budget interne ($28 / 43{,}2 \approx 0{,}65$). La politique déclenche le gel des évolutions non urgentes pour le reste du mois. Le SLA n'est pas dépassé, puisque 28 minutes restent très inférieures aux 216 minutes tolérées.

**Limites.** Le SLA reste un compromis commercial : le client peut exiger davantage, et la plateforme devra alors investir. Les mesures contractuelles doivent être validées avec le client, sinon la mesure sera contestée.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Quelle est la différence entre un SLO et un SLA ?
2. **Compréhension.** Qu'est-ce que le budget d'erreur, et comment le calcule-t-on ?
3. **Compréhension.** Pourquoi ne fixe-t-on pas un SLO à 100 % ?
4. **Pourquoi.** Pourquoi le SLO interne est-il plus exigeant que le SLA ?
5. **Raisonnement pratique.** Avec un SLO de 99,95 % sur 30 jours, combien de minutes d'indisponibilité totale le budget autorise-t-il ? Une panne totale de 15 minutes en consomme quelle part ?

#### Réponses

1. Le SLO est la cible interne, qui guide les décisions de l'ingénierie. Le SLA est l'engagement contractuel envers le client, avec des conséquences en cas de manquement, et il est moins exigeant que le SLO.
2. C'est la part de défaillance que le SLO tolère : $1 - \text{SLO}$. Avec 99,9 %, le budget est de 0,1 %, soit 43,2 minutes sur 30 jours ou 1 requête sur 1 000.
3. Parce que le coût croît très vite avec chaque neuf, que les dépendances ne le permettent pas, que l'utilisateur ne perçoit pas la différence, et qu'aucune marge ne resterait pour faire évoluer le système.
4. Pour garder une marge : le SLO déclenche des décisions internes avant que le SLA soit en danger. Une équipe qui vise exactement le SLA subirait les avoirs au premier incident.
5. $0{,}0005 \times 43\,200 = 21{,}6$ minutes. Une panne de 15 minutes en consomme $15 / 21{,}6 \approx 0{,}69$, soit environ 69 %.

## 11.16 Gestion des incidents, astreinte et post-mortem

### 1. Comprendre simplement

La **gestion des incidents** (*incident management*) est l'ensemble des pratiques qui permettent de **détecter, qualifier, traiter et clôturer** un événement qui dégrade le service. L'**astreinte** (*on-call*) est l'organisation qui garantit qu'une personne compétente est joignable et responsable à tout moment. Le **post-mortem** (aussi appelé revue d'incident, *post-incident review*) est l'analyse écrite menée **après** l'incident, pour comprendre ce qui s'est passé et éviter que cela se reproduise.

**Pourquoi cela existe.** Les pannes sont inévitables (voir [11.7 Disponibilité, fiabilité et résilience](#117-disponibilité-fiabilité-et-résilience)). Ce qui distingue une organisation, c'est la rapidité et la qualité de sa réponse, et ce qu'elle en apprend. Sans organisation, un incident devient un chaos : tout le monde enquête, personne ne communique, deux personnes modifient le système en même temps, et les mêmes erreurs reviennent.

**Problème résolu.** Réduire la durée et l'impact des incidents, coordonner les personnes, communiquer de façon fiable, et transformer chaque incident important en améliorations durables.

**Modèle mental.** Le service d'urgences d'un hôpital. Le tri classe les patients selon la gravité. Un médecin coordonne. On stabilise d'abord le patient avant de chercher la cause profonde. Tout est consigné. Après les cas difficiles, une revue analyse ce qui peut être amélioré, sans chercher à punir.

**Où l'analogie s'arrête.** Un patient est un cas unique. Un service logiciel a des milliers d'utilisateurs simultanés. Et on peut souvent annuler la cause d'un incident (retour arrière), ce qui est impossible pour un patient.

**Exemple.** Un déploiement à 8 h 00 fait échouer 6 % des transitions d'état. Une alerte d'urgence réveille l'astreinte à 8 h 15. Un commandant d'incident est désigné, le retour arrière est décidé puis terminé à 8 h 41. Le lendemain, un post-mortem sans blâme identifie trois facteurs contributifs et quatre actions, chacune avec un responsable et une échéance.

**Les composants.**

1. la **détection** (alertes, signalements) ;
2. la **qualification** (gravité, périmètre) ;
3. la **mobilisation** (astreinte, rôles) ;
4. l'**atténuation** de l'impact ;
5. la **communication** ;
6. la **résolution** et la clôture ;
7. l'**apprentissage** (post-mortem) et le suivi des actions.

**Objectif d'apprentissage :** vous pouvez décrire le déroulement d'un incident, expliquer pourquoi on atténue avant de chercher la cause, et décrire un post-mortem sans blâme.

### 2. Connaissances essentielles

#### Définition

- **Incident** : événement non planifié qui dégrade ou interrompt un service, ou qui menace de le faire, et qui exige une réponse coordonnée.
- **Astreinte** : organisation par rotation qui rend une personne compétente joignable, et responsable de la première réponse, y compris en dehors des heures ouvrées.
- **Post-mortem** : analyse écrite et partagée d'un incident, qui décrit la chronologie, les causes, les enseignements et les actions correctives.

#### Idées fondamentales

1. **On atténue d'abord, on comprend ensuite.** Le but immédiat est de rétablir le service pour les utilisateurs. La cause profonde peut attendre.
2. **Un incident a un commandant.** Une personne coordonne et décide. Les autres exécutent et informent.
3. **La communication fait partie de la réponse.** Les utilisateurs et les équipes concernées sont tenus informés, à intervalle régulier.
4. **La gravité décide de la mobilisation.** On ne traite pas un incident majeur comme une anomalie mineure.
5. **L'apprentissage est sans blâme.** On analyse les systèmes et les décisions, pas les fautes individuelles.
6. **Les actions sont suivies jusqu'au bout.** Un post-mortem dont les actions ne sont pas suivies ne change rien.
7. **L'astreinte doit être soutenable.** Une astreinte épuisante dégrade la réponse et fait partir les personnes.

#### Vocabulaire essentiel

- **Commandant d'incident** (*incident commander*) : personne qui coordonne la réponse et prend les décisions.
- **Niveau de gravité** (*severity*) : classement de l'incident selon son impact, qui détermine la mobilisation.
- **Atténuation** (*mitigation*) : action qui réduit l'impact sans corriger la cause (retour arrière, bascule, désactivation d'une fonction).
- **Résolution** (*resolution*) : correction durable de la cause.
- **Facteur contributif** (*contributing factor*) : condition qui, combinée à d'autres, a rendu l'incident possible.
- **Escalade** (*escalation*) : appel d'une personne ou d'une équipe de niveau supérieur ou spécialisée.
- **Page d'état** (*status page*) : page publique ou privée qui indique l'état du service et des incidents en cours.
- **MTTD**, **MTTA**, **MTTR** : délais moyens de détection (*detect*), d'accusé de réception (*acknowledge*) et de rétablissement (*restore* ; la lettre R a plusieurs sens selon les organisations, on fixe donc la définition retenue).
- **Revue sans blâme** (*blameless review*) : analyse qui cherche les causes dans le système et non chez les personnes.

#### Relations de cause à effet

- Il n'y a pas de commandant. Les décisions se contredisent, des actions simultanées se gênent, et l'incident s'aggrave.
- On cherche la cause avant d'atténuer. L'impact dure plus longtemps pour comprendre ce qu'un retour arrière aurait suffi à arrêter.
- Une culture du blâme s'installe. Les personnes cachent leurs erreurs, les informations manquent au post-mortem, et les causes restent en place.
- L'astreinte repose sur peu de personnes et reçoit beaucoup d'alertes. La fatigue produit des erreurs, puis des départs, et la charge sur ceux qui restent augmente.
- Les actions n'ont ni responsable ni échéance. L'incident se reproduit.

#### Idées reçues

- **« Le post-mortem sert à trouver le responsable. »** Non. Il sert à améliorer les systèmes et les processus. Les personnes ont agi de bonne foi, avec les informations dont elles disposaient.
- **« Il existe une cause racine unique. »** Le plus souvent, plusieurs facteurs se combinent : un changement, un test manquant, une alerte tardive.
- **« Un incident est terminé quand le service repart. »** La clôture exige une vérification, une communication et le suivi des actions.
- **« Seuls les mauvais systèmes ont des incidents. »** Tous les systèmes en ont. La différence tient à la qualité de la réponse et de l'apprentissage.

#### Principe clé

On rétablit d'abord le service avec une organisation claire, puis on apprend sans chercher de coupable, et on suit les actions jusqu'à leur terme.

#### Si vous ne retenez que trois choses

1. On atténue l'impact d'abord, avec un commandant et une communication régulière ; la cause profonde vient ensuite.
2. L'astreinte repose sur des rotations soutenables, des escalades claires et des manuels d'exécution.
3. Le post-mortem est sans blâme, il décrit des facteurs contributifs, et ses actions sont suivies.

### 3. Explication technique détaillée

#### Le déroulement d'un incident

```text
détection ──► qualification ──► mobilisation ──► atténuation ──► résolution ──► clôture
 (alerte,       (gravité,         (astreinte,      (retour          (correction     (vérification,
  signalement)   périmètre)        rôles)           arrière,         durable)        communication)
                                                    bascule…)                              │
                                                                                            ▼
                                                                          post-mortem ──► actions suivies
```

Pendant tout le déroulement, une chronologie est tenue et la communication suit un rythme fixé.

#### Les niveaux de gravité

| Niveau | Critères (exemples) | Réponse |
|---|---|---|
| SEV1 | Indisponibilité totale ou majeure, perte ou fuite de données, tenants nombreux touchés | Mobilisation immédiate à toute heure ; commandant d'incident ; messages toutes les 30 minutes |
| SEV2 | Dégradation importante d'une fonction clé, ou d'un sous-ensemble de tenants | Mobilisation immédiate ; messages toutes les heures |
| SEV3 | Dégradation mineure, contournement disponible | Traitement en heures ouvrées |
| SEV4 | Défaut sans impact sur le service | Ticket classique |

Chaque organisation définit ses propres critères. Ils doivent être écrits, fondés sur l'**impact** (pas sur la cause supposée), et utilisables à 3 h du matin. Dans le doute, on choisit le niveau le plus élevé : on peut toujours le réduire.

#### Les rôles

| Rôle | Responsabilité |
|---|---|
| Commandant d'incident | Coordonne, décide, délègue ; ne corrige pas lui-même |
| Responsable technique | Dirige l'investigation et l'atténuation |
| Responsable de la communication | Rédige les messages internes et externes, à intervalle régulier |
| Scribe | Tient la chronologie : actions, décisions, heures |
| Expert appelé | Apporte un savoir ponctuel (base de données, sécurité, intégration) |

Sur un petit incident, une seule personne peut cumuler plusieurs rôles. Mais le rôle de commandant reste explicite : on sait qui décide.

#### Atténuer avant de comprendre

Les leviers d'atténuation sont préparés à l'avance :

| Levier | Quand l'utiliser | Voir |
|---|---|---|
| Retour arrière d'un déploiement ou d'une configuration | Un changement récent est suspect | [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) |
| Désactivation d'une fonction par un drapeau | Une fonction précise est en cause | [8.6 Feature flags](08-admin-control-plane.md#86-feature-flags) |
| Basculement vers une autre zone ou une réplique | Un composant ou une zone est perdu | [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) |
| Dégradation progressive | Une dépendance est indisponible | [11.9 Dégradation progressive](#119-dégradation-progressive) |
| Quota ou blocage d'un tenant abusif | Un voisin bruyant sature des ressources partagées | [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) |
| Ajout de capacité | La saturation est la cause | [11.17 Planification de capacité](#1117-planification-de-capacité) |

**Pourquoi atténuer d'abord.** Chaque minute passée à chercher la cause est une minute d'impact pour les utilisateurs. Le retour arrière d'un changement récent est souvent plus rapide que l'analyse. On conserve les preuves (journaux, traces, instantanés) pour l'analyse qui suit.

#### La communication

| Public | Canal | Contenu | Cadence |
|---|---|---|---|
| Équipes internes | Canal dédié à l'incident | Faits, hypothèses, actions, décisions | Continue |
| Direction et support | Messages réguliers | Impact, état, prochaine étape | Toutes les 30 à 60 minutes pour une gravité élevée |
| Clients | Page d'état, courriel, console d'administration | Impact, état, heure de la prochaine mise à jour | Régulière ; par région ou par composant |
| Autorités et clients concernés (données personnelles) | Selon le contrat et la loi | Nature de la violation, données concernées, mesures | Dans les délais légaux et contractuels |

Un bon message dit ce qui est affecté, depuis quand, ce qui est fait, et quand viendra la prochaine mise à jour. Il évite les hypothèses non confirmées. Les heures sont données en UTC.

```text
[SEV2 – 08:33 UTC] Transitions d'état dégradées
Impact : environ 6 % des transitions échouent depuis 08:00 UTC pour la région EU.
Cause suspectée : déploiement de 08:00 UTC. Action en cours : retour arrière.
Prochaine mise à jour : 09:00 UTC, ou plus tôt en cas de changement.
```

#### L'astreinte

L'astreinte repose sur :

- une **rotation**, avec un titulaire primaire et un secondaire ;
- une **politique d'escalade** qui précise qui est appelé, dans quel ordre et après quel délai ;
- des **manuels d'exécution** (voir [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)) et des accès préparés à l'avance ;
- une **transmission** des consignes à chaque relève : incidents ouverts, risques connus, changements prévus ;
- une **charge mesurée** : nombre d'alertes par garde, réveils nocturnes, avec un plafond au-delà duquel le travail de fiabilité devient prioritaire ;
- un **accompagnement** : les nouveaux sont d'abord en doublure, et les gardes sont compensées.

```text
alerte d'urgence
   └─► astreinte primaire (accusé de réception attendu sous 5 minutes)
          └─ sans accusé ─► astreinte secondaire (après 5 minutes)
                               └─ sans accusé ─► responsable d'ingénierie (après 10 minutes)
```

#### Les indicateurs de la réponse

| Indicateur | Mesure | Ce qu'il révèle |
|---|---|---|
| Délai de détection (MTTD) | De l'apparition de l'impact à la détection | Qualité de la surveillance |
| Délai d'accusé de réception (MTTA) | De l'alerte à la prise en charge | Efficacité de l'astreinte |
| Délai de rétablissement (MTTR) | De la détection (ou de l'apparition) au rétablissement du service | Efficacité de l'atténuation |
| Incidents par gravité et par cause | Comptage par période | Tendances, domaines fragiles |
| Actions de post-mortem terminées | Part terminée dans les délais | Capacité à apprendre |

Les incidents sont peu nombreux et très différents les uns des autres. Une moyenne est donc trompeuse : on regarde la distribution (médiane, pires cas) et chaque incident individuellement.

#### Le post-mortem sans blâme

```text
Titre et identifiant            : incident 2026-10-13-01
Gravité, durée, tenants touchés : SEV2, 41 minutes, tous les tenants de la région EU
Résumé                          : deux ou trois phrases
Impact                          : utilisateurs, tenants, données, budget d'erreur consommé
Chronologie                     : heures UTC, événements, décisions
Causes et facteurs contributifs : ce qui a rendu l'incident possible
Ce qui a bien fonctionné        : détection, communication, outils
Ce qui a moins bien fonctionné  : délais, informations manquantes, ambiguïtés
Où nous avons eu de la chance   : circonstances qui auraient pu aggraver l'incident
Actions                         : description, responsable, échéance, priorité, suivi
```

**Sans blâme.** Les personnes décident avec les informations et les outils dont elles disposent. Si un geste individuel a pu provoquer l'incident, c'est que le système l'a permis : pas de garde-fou, pas de test, pas de relecture. On corrige le système. Si l'on punit, les personnes cachent les erreurs et les informations manquent pour comprendre.

**Facteurs contributifs.** On évite de chercher « la » cause. La méthode des « cinq pourquoi » aide à remonter une chaîne, mais elle peut fausser l'analyse si l'on suit une seule branche. On cherche les conditions qui, combinées, ont produit l'incident.

**Quand en rédiger un.** Pour tout incident de gravité élevée, tout incident qui a touché des données, tout incident qui a consommé une part importante du budget d'erreur (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)), et les presque-incidents instructifs. On le rédige dans les jours qui suivent, tant que les souvenirs sont frais.

**Le suivi.** Les actions sont inscrites dans le carnet de travail, avec une priorité et une échéance, et revues régulièrement. La part d'actions terminées est un indicateur de santé du processus.

#### Incidents de sécurité et obligations de notification

Un incident de sécurité suit le même cadre (commandant, communication, post-mortem), avec des particularités :

- le **confinement** : isoler les comptes ou les systèmes compromis ;
- la **préservation des preuves** : journaux d'audit (voir [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)), instantanés ;
- la **diffusion restreinte** de l'information ;
- l'**implication précoce** des fonctions juridiques.

Le guide NIST SP 800-61 sur le traitement des incidents de sécurité décrit des phases de préparation, de détection et d'analyse, de confinement, d'éradication et de reprise, puis d'activités après incident.

**Obligations de notification.** En cas de violation de données à caractère personnel, le règlement (UE) 2016/679 (RGPD, article 33) impose au responsable du traitement de notifier l'autorité de contrôle dans un délai de 72 heures après en avoir pris connaissance, sauf si la violation n'est pas susceptible d'engendrer un risque pour les personnes. Le sous-traitant doit informer le responsable du traitement dans les meilleurs délais. Un éditeur SaaS agit le plus souvent comme sous-traitant pour les données de ses clients : le contrat fixe alors un délai de notification, souvent plus court. Les règles varient selon les pays et les secteurs : on associe le juridique dès le début.

#### Le multi-tenant

- **Le périmètre.** Quels tenants, quelles régions, quelles fonctions sont touchés ? La réponse conditionne la gravité et la communication.
- **La communication ciblée.** Page d'état par région et par composant, notification directe aux tenants touchés. Aucun message ne révèle des informations propres à un autre tenant.
- **L'accès de support.** Accéder aux données d'un tenant pendant un incident est exceptionnel, justifié, tracé et limité dans le temps (voir [4.22 Moindre privilège et séparation des tâches](04-identite-iam-autorisation.md#422-moindre-privilège-et-séparation-des-tâches) et [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications)).
- **Les preuves du SLA.** La chronologie et les mesures servent à calculer les avoirs et à répondre aux réclamations (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)).

#### Les modes de défaillance

- **Le héros.** Une seule personne détient le savoir. Si elle est absente, l'incident s'éternise.
- **Aucun commandant, ou trop de commandants.** Les décisions se contredisent.
- **L'enquête avant l'atténuation.** L'impact se prolonge inutilement.
- **Le silence ou les messages contradictoires.** Les clients et le support perdent confiance.
- **Le blâme.** Les erreurs se cachent.
- **Les post-mortems sans suite.** Les mêmes incidents reviennent.
- **L'astreinte épuisante.** La qualité de la réponse baisse.
- **L'absence d'entraînement.** Les procédures ne sont jamais exercées. On organise des exercices (*game days*) et des simulations.

**Contre-exemple.** À 2 h du matin, un incident touche l'API. Quatre ingénieurs se connectent. L'un redémarre la base, l'autre déploie un correctif, un troisième vide un cache. Personne n'écrit ce qui est fait. Le service retombe deux fois, et personne ne sait quelle action a aidé ou aggravé la situation. Aucun message n'est envoyé aux clients avant 3 h 30.

**Limites.** Les processus d'incident ne remplacent pas la prévention. Si les mêmes types d'incidents reviennent, les actions des post-mortems ne traitent pas les causes : on analyse les tendances par catégorie, au-delà des incidents pris un par un.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | Les alertes déclenchent les incidents ; les manuels d'exécution guident la réponse |
| [11.14 Suivi des erreurs](#1114-suivi-des-erreurs) | Le suivi des erreurs fournit le contexte technique de l'investigation |
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | La gravité et le budget d'erreur dépendent des SLO ; les mesures fournissent les preuves du SLA |
| [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces) | Les journaux, métriques et traces servent au diagnostic |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) et [11.9 Dégradation progressive](#119-dégradation-progressive) | La bascule et la dégradation progressive sont des leviers d'atténuation |
| [11.11 Reprise après sinistre, RPO et RTO](#1111-reprise-après-sinistre-rpo-et-rto) | Un sinistre majeur active le plan de reprise après sinistre |
| [9.6 Retour arrière](09-audit-versionnement-gouvernance.md#96-retour-arrière) | Le retour arrière est l'atténuation la plus fréquente |
| [9.1 Journal d'audit, journal d'activité et historique des modifications](09-audit-versionnement-gouvernance.md#91-journal-daudit-journal-dactivité-et-historique-des-modifications) | Le journal d'audit permet de reconstruire la chronologie et de préserver les preuves |
| [8.9 Administration opérationnelle](08-admin-control-plane.md#89-administration-opérationnelle) | La console opérationnelle fournit les outils d'intervention et de communication par tenant |

### 5. Application pratique

**Situation initiale.** La version 2026.10.3 est déployée automatiquement à 08:00 UTC, pour tous les tenants de la région EU. Le moteur de règles échoue quand la date de prochaine inspection d'un aéronef est absente.

**Problème.** 6 % des transitions d'état échouent, pour un grand nombre de tenants.

**Application du concept.** Le processus de réponse à incident.

**Déroulé.**

| Heure (UTC) | Événement |
|---|---|
| 08:00 | Déploiement de la version 2026.10.3 ; les erreurs commencent |
| 08:15 | Alerte d'urgence : taux de consommation du budget d'erreur supérieur à 14,4 sur une heure et sur cinq minutes (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)) |
| 08:17 | Accusé de réception par l'astreinte primaire |
| 08:20 | Incident déclaré, gravité SEV2 ; commandant d'incident désigné ; canal dédié ouvert |
| 08:28 | Corrélation : les erreurs commencent exactement avec le déploiement (voir [11.14 Suivi des erreurs](#1114-suivi-des-erreurs)) |
| 08:33 | Décision de retour arrière ; premier message sur la page d'état |
| 08:41 | Retour arrière terminé |
| 08:45 | Taux d'erreurs revenu sous 0,1 % |
| 09:15 | Fin de la surveillance renforcée ; incident clos ; message final |

**Résultat.** L'impact dure 41 minutes (de 08:00 à 08:41). Le délai de détection est de 15 minutes, l'accusé de réception de 2 minutes, et l'atténuation intervient 26 minutes après l'alerte. Avec un trafic homogène, 6 % de requêtes en échec pendant 41 minutes équivalent à $0{,}06 \times 41 \approx 2{,}5$ minutes d'indisponibilité totale, soit environ 5,7 % du budget mensuel de 43,2 minutes.

Le post-mortem, rédigé le lendemain, relève trois facteurs contributifs :

1. aucun test ne couvrait une date d'inspection absente, situation créée par des enregistrements importés (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)) ;
2. le déploiement a touché 100 % du trafic en une fois ;
3. la fenêtre d'une heure de l'alerte a retardé la détection d'environ 15 minutes.

Quatre actions sont décidées :

| Action | Responsable | Échéance |
|---|---|---|
| Ajouter les tests et un invariant sur la date d'inspection à l'import | Équipe moteur de règles | 2 semaines |
| Mettre en place un déploiement progressif (5 %, 25 %, 100 %) avec arrêt automatique | Équipe plateforme | 4 semaines |
| Ajouter une alerte à fenêtre courte pendant les 30 minutes qui suivent un déploiement | Astreinte | 1 semaine |
| Mettre à jour le manuel de retour arrière | Astreinte | 1 semaine |

**Limites.** Le post-mortem n'a de valeur que si les actions sont réalisées. Un déploiement progressif réduit l'impact sans l'éliminer : un défaut qui n'apparaît qu'à une certaine échelle ou dans une situation rare peut passer.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi cherche-t-on d'abord à atténuer l'impact plutôt qu'à trouver la cause racine ?
2. **Compréhension.** Quel est le rôle du commandant d'incident ?
3. **Compréhension.** Qu'est-ce qu'un post-mortem sans blâme ?
4. **Pourquoi.** Pourquoi une culture du blâme rend-elle les incidents suivants plus longs et plus fréquents ?
5. **Raisonnement pratique.** Un incident commence à 10:00, il est détecté à 10:20, l'astreinte accuse réception à 10:23, l'impact cesse à 10:55 et la cause est corrigée durablement à 11:30. Calculez le délai de détection, le délai d'accusé de réception, la durée d'impact et le délai d'atténuation depuis la détection.

#### Réponses

1. Parce que chaque minute passée à chercher la cause est une minute d'impact pour les utilisateurs. Un retour arrière ou une bascule rétablit souvent le service plus vite que l'analyse, et les preuves sont conservées pour l'analyse qui suit.
2. Il coordonne la réponse, décide, délègue et s'assure que la communication suit son rythme. Il ne corrige pas lui-même : il garde la vue d'ensemble.
3. Une analyse écrite qui cherche les causes dans le système, les processus et les conditions, et pas chez les personnes. Elle produit des facteurs contributifs et des actions correctives suivies.
4. Parce que les personnes cachent leurs erreurs et leurs doutes pour éviter la sanction. Les informations manquent pendant l'incident et au post-mortem, les vraies causes restent en place, et les mêmes incidents reviennent.
5. Détection : 20 minutes (10:00 à 10:20). Accusé de réception : 3 minutes après la détection. Durée d'impact : 55 minutes (10:00 à 10:55). Atténuation depuis la détection : 35 minutes (10:20 à 10:55). La correction durable de 11:30 appartient à la résolution, pas à la durée d'impact.

## 11.17 Planification de capacité

### 1. Comprendre simplement

La **planification de capacité** (*capacity planning*) consiste à **s'assurer que les ressources disponibles suffiront à la demande, avec la performance attendue et à un coût acceptable, aujourd'hui et dans les mois à venir**.

**Pourquoi cela existe.** Les ressources (calcul, mémoire, stockage, connexions, débit, quotas d'un fournisseur) sont limitées, et il faut du temps pour en ajouter. Si la demande dépasse la capacité, le service se dégrade, puis s'arrête. Si l'on en prévoit trop, on paie pour des ressources inutilisées.

**Problème résolu.** Éviter les pannes de saturation prévisibles sans gaspiller. Savoir à quel moment il faut agir, et avec quel délai d'avance.

**Modèle mental.** Les caisses d'un supermarché. Trop peu de caisses un samedi : des files interminables et des clients qui partent. Trop de caisses un mardi matin : du personnel inactif. Le gérant observe l'affluence, anticipe les pics (veille de fête), et sait combien de temps il faut pour appeler du renfort.

**Où l'analogie s'arrête.** Un supermarché a une seule file visible et une capacité simple. Une plateforme enchaîne plusieurs ressources : application, base de données, file de messages, systèmes externes. La capacité de l'ensemble est celle de **la première qui sature**. Et l'on ajoute des instances applicatives en quelques minutes, mais pas une base de données.

**Exemple.** Le moteur de ressources traite 400 requêtes par seconde au pic, avec 8 instances. Un groupe aérien qui rejoint la plateforme ajoutera 250 requêtes par seconde. Avant son arrivée, l'équipe calcule le nombre d'instances nécessaires, vérifie la base de données et lance les actions à long délai.

**Les composants.**

1. la **mesure** de la demande et de la consommation ;
2. la **capacité unitaire** : ce que supporte une instance ;
3. la **prévision** de la demande ;
4. la **marge** ;
5. la **décision** : ajouter, optimiser ou limiter ;
6. la **vérification** : test de charge et surveillance.

**Objectif d'apprentissage :** vous pouvez expliquer pourquoi on ne vise pas 100 % d'utilisation, calculer un dimensionnement simple, et identifier la ressource qui limite l'ensemble.

### 2. Connaissances essentielles

#### Définition

- **Planification de capacité** : processus qui prévoit la demande, mesure la capacité des ressources et décide de leur dimensionnement, pour respecter les objectifs de performance à un coût acceptable.
- **Capacité** : quantité maximale de travail qu'une ressource peut traiter tout en respectant l'objectif de performance.
- **Marge** (*headroom*) : écart volontaire entre la capacité et la charge attendue.

#### Idées fondamentales

1. **La capacité se mesure, elle ne se devine pas.** On la mesure par des tests de charge et par l'observation de la production.
2. **La première ressource saturée limite l'ensemble.** Ajouter des serveurs applicatifs ne sert à rien si la base de données est le goulot.
3. **On ne vise pas 100 % d'utilisation.** Près de la saturation, la latence explose et il ne reste aucune marge.
4. **On planifie pour le pic, la croissance et la panne.** La moyenne ne suffit pas.
5. **Le délai d'obtention compte.** Un composant qui demande des semaines doit être anticipé bien avant le besoin.
6. **Capacité et coût sont liés.** Trop de marge coûte cher ; trop peu coûte des incidents.
7. **Dans une plateforme multi-tenant, un tenant peut consommer la capacité des autres.** Les quotas et l'isolation en font partie.

#### Vocabulaire essentiel

- **Charge** (*load*) : quantité de travail soumise à une ressource (requêtes par seconde, par exemple).
- **Utilisation** (*utilization*) : rapport entre la charge et la capacité.
- **Saturation** (*saturation*) : état où la ressource ne peut plus absorber la charge, et où le travail s'accumule.
- **Goulot d'étranglement** (*bottleneck*) : ressource qui limite la capacité de l'ensemble.
- **Mise à l'échelle horizontale** (*scale out*) : ajouter des instances ; **verticale** (*scale up*) : augmenter la taille d'une instance.
- **Mise à l'échelle automatique** (*autoscaling*) : ajustement automatique du nombre d'instances selon la charge.
- **Test de charge** (*load test*) : essai qui soumet le système à une charge simulée, pour mesurer sa capacité.
- **N+1** : dimensionnement qui permet de supporter la charge de pic même en perdant une unité.
- **Délai de mise en œuvre** (*lead time*) : temps nécessaire pour obtenir une capacité supplémentaire.

#### Relations de cause à effet

- La capacité est planifiée sur la moyenne. Les pics saturent le système, avec des erreurs et de la latence.
- On ajoute des instances applicatives alors que la base de données est le goulot. La base reçoit plus de connexions et sature plus vite.
- Aucune marge n'est prévue pour la panne. La perte d'une instance reporte sa charge sur les autres, qui saturent à leur tour : c'est une cascade.
- Le délai d'une augmentation de quota n'est pas anticipé. Le besoin arrive avant la capacité.
- Un tenant n'a pas de quota. Il peut consommer la capacité partagée et dégrader tous les autres.

#### Idées reçues

- **« Le nuage est élastique, donc la planification est inutile. »** L'élasticité a des limites : quotas du fournisseur, bases de données, temps de démarrage, coût, systèmes externes.
- **« Il suffit d'ajouter des serveurs. »** Si le goulot est ailleurs (base de données, système tiers), cela n'aide pas, et cela peut aggraver le problème.
- **« Un taux d'utilisation élevé est signe d'efficacité. »** Il réduit le coût, mais près de la saturation la latence explose et la tolérance aux pointes disparaît.

#### Principe clé

On mesure la capacité unitaire, on repère la première ressource qui sature, et on garde une marge suffisante face au pic, à la croissance et à la panne, en tenant compte du délai nécessaire pour agir.

#### Si vous ne retenez que trois choses

1. La capacité se mesure par des tests, et c'est la première ressource saturée qui limite l'ensemble.
2. On ne vise pas 100 % d'utilisation : la latence augmente brutalement près de la saturation.
3. On planifie pour le pic, la croissance et la panne, avec le délai d'obtention de chaque ressource.

### 3. Explication technique détaillée

#### Les ressources à planifier

| Ressource | Indicateurs de saturation | Délai typique pour augmenter | Remarque |
|---|---|---|---|
| Calcul applicatif (instances) | Processeur, latence, file d'attente | Minutes (automatique) | Le plus facile à augmenter |
| Base de données | Connexions, opérations d'entrée-sortie, verrous, stockage | Heures à semaines | Souvent le goulot ; les écritures sont difficiles à répartir |
| Stockage | Espace, débit | Minutes à jours | Croissance continue (audit, sauvegardes) |
| Files de messages | Profondeur, retard de consommation | Minutes à heures | Absorbent les pics si elles sont bornées |
| Réseau | Débit, connexions | Variable | Quotas du fournisseur |
| Systèmes externes | Limites de débit imposées par le tiers | Négociation | Hors du contrôle de la plateforme |
| Capacité humaine | Astreinte, support | Semaines à mois | Souvent oubliée |

Les délais sont indicatifs ; ils dépendent du fournisseur et de l'architecture.

#### Pourquoi la latence explose près de la saturation

Un modèle simple de file d'attente (un serveur, arrivées aléatoires, durées de service exponentielles, dit M/M/1) donne le temps moyen passé dans le système :

$$W = \frac{1}{\mu - \lambda} = \frac{1/\mu}{1 - \rho} \qquad \text{avec} \qquad \rho = \frac{\lambda}{\mu}$$

- $W$ : temps moyen passé dans le système (attente et traitement) ;
- $\lambda$ : taux d'arrivée des requêtes (par seconde) ;
- $\mu$ : taux de service, c'est-à-dire le nombre de requêtes traitées par seconde quand le serveur est occupé en continu ;
- $\rho$ : utilisation, comprise entre 0 et 1.

Avec $\mu = 100$ requêtes par seconde (10 ms par requête) :

| Utilisation $\rho$ | Temps moyen $W$ |
|---|---|
| 50 % | 20 ms |
| 80 % | 50 ms |
| 90 % | 100 ms |
| 95 % | 200 ms |
| 99 % | 1 000 ms |

Le modèle est simplifié : les systèmes réels ont plusieurs serveurs et des rafales. Mais l'allure est la même. La latence croît lentement, puis brutalement, quand l'utilisation approche 100 %. C'est pourquoi on cible une utilisation modérée plutôt que le maximum.

#### La loi de Little

$$L = \lambda \times W$$

- $L$ : nombre moyen de requêtes en cours dans le système ;
- $\lambda$ : débit d'arrivée (requêtes par seconde) ;
- $W$ : temps moyen passé dans le système (secondes).

Cette relation vaut pour un système en régime stable, sans hypothèse sur la forme des arrivées.

**Exemple 1.** 200 requêtes par seconde avec une durée moyenne de 0,25 s : $200 \times 0{,}25 = 50$ requêtes en vol. Il faut donc pouvoir traiter environ 50 requêtes en parallèle, plus une marge.

**Exemple 2.** Une requête occupe une connexion de base de données pendant 15 ms (trois requêtes SQL de 5 ms). Avec 54 requêtes par seconde sur une instance : $54 \times 0{,}015 \approx 0{,}8$ connexion occupée en moyenne. Un pool de 20 connexions par instance est largement surdimensionné, et il consomme le plafond de connexions de la base.

#### De la mesure à la capacité

La capacité utile d'une instance se mesure par un **test de charge** : on augmente progressivement le débit jusqu'à ce que l'objectif de latence (voir [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla)) ne soit plus respecté. Le débit atteint juste avant définit la capacité utile.

| Type de test | Objectif |
|---|---|
| Charge | Vérifier le comportement à la charge attendue |
| Limite (*stress*) | Trouver où et comment le système cède |
| Endurance (*soak*) | Détecter les fuites et les dégradations lentes |
| Pic (*spike*) | Vérifier la réaction à une montée brutale |

Un test n'a de valeur que s'il est réaliste : mélange d'opérations proche de la production, volume de données comparable, répartition entre tenants (un tenant qui génère 40 % du trafic, par exemple).

#### Calculer le nombre d'instances

$$N = \left\lceil \frac{\text{charge de pic prévue}}{\text{capacité utile par instance}} \right\rceil + r$$

- $N$ : nombre d'instances ;
- la charge de pic est exprimée dans la même unité que la capacité (requêtes par seconde) ;
- la capacité utile par instance est mesurée à l'utilisation cible (par exemple 60 requêtes par seconde, et non les 100 de la saturation théorique) ;
- $r$ : nombre d'instances de redondance (1 pour N+1).

**Exemple.** Pic de 650 requêtes par seconde, 60 par instance : $\lceil 650 / 60 \rceil + 1 = 11 + 1 = 12$ instances.

#### La croissance

$$S(t) = S_0 \times (1 + g)^t$$

- $S_0$ : valeur initiale ;
- $g$ : taux de croissance par période ;
- $t$ : nombre de périodes.

**Exemple 1.** 120 tenants avec 8 % de croissance par mois : après 12 mois, $120 \times 1{,}08^{12} \approx 302$ tenants. Le nombre de tenants double en $\ln 2 / \ln 1{,}08 \approx 9$ mois.

**Exemple 2.** 50 millions d'événements d'audit par mois, de 1 Ko chacun, font 50 Go par mois, soit 600 Go par an. Avec un facteur 3 pour les index et les répliques, cela donne environ 1,8 To par an, avant les sauvegardes.

La croissance n'est pas toujours régulière : un gros client, un lancement ou une saison créent des sauts. On planifie donc des scénarios (bas, attendu, haut), pas un seul chiffre.

#### Les saisons et les événements

La demande suit des rythmes propres à chaque tenant et à chaque secteur : départs en vacances pour une compagnie aérienne, lundi matin pour un hôpital, fin de mois pour une usine. Les opérations de la plateforme créent aussi des pics : migration, import massif (voir [3.7 Import et export](03-crud-runtime-ressources.md#37-import-et-export)), réindexation, recalcul de règles. On les met au calendrier.

#### Le multi-tenant

- **Le voisin bruyant.** Un tenant qui consomme de façon disproportionnée dégrade les autres. On le contient par des quotas (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)), la limitation de débit (voir [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit)) et l'isolation des ressources (voir [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants)).
- **Le placement.** La façon de répartir les tenants (voir [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) et [5.5 Multi-tenancy hybride](05-multi-tenancy-modele-entreprise.md#55-multi-tenancy-hybride)) détermine l'équilibre de la charge. Un très gros tenant justifie parfois un environnement dédié.
- **L'arrivée de gros clients.** Elle se planifie en amont, avec une revue de capacité dans le processus commercial.
- **La mesure par tenant.** La consommation par tenant nourrit la tarification et l'analyse de rentabilité.

#### L'automatisation et ses limites

La mise à l'échelle automatique ajoute ou retire des instances selon une règle (processeur, latence, profondeur de file). Elle **réagit** à la charge observée, alors que la planification **anticipe**. Ses limites :

- le **délai de démarrage** : une instance prend du temps à devenir utile, caches vides ;
- les **plafonds** : quotas du fournisseur, nombre maximal d'instances ;
- l'**effet en cascade** : plus d'instances ouvrent plus de connexions, et la base saturée ralentit tout ;
- les **tempêtes de nouvelles tentatives** : une dépendance lente déclenche des reprises qui augmentent la charge (voir [6.5 Délai d'expiration et nouvelle tentative](06-workflow-etat-regles.md#65-délai-dexpiration-et-nouvelle-tentative)) ;
- le **coût** : une boucle ou une attaque peut faire monter la facture sans plafond budgétaire.

#### Les modes de défaillance

- **Planifier sur la moyenne** et non sur le pic.
- **Ignorer le goulot réel**, par exemple la base de données.
- **Ignorer les limites des tiers** : quotas du fournisseur, limites d'un système externe.
- **Un test de charge irréaliste**, qui ne reflète ni le mélange d'opérations ni la répartition des tenants.
- **Aucune marge pour la panne** (N+0).
- **Réagir trop tard**, sans tenir compte des délais.
- **Oublier la croissance du stockage**, jusqu'au disque plein.
- **Des coûts hors de contrôle**, par sur-dimensionnement ou par absence de plafond.

**Contre-exemple.** Une plateforme tourne à 85 % de la capacité de sa base de données en régime normal. Une instance applicative tombe. Les requêtes sont réparties sur les autres, des reprises automatiques doublent la charge de la base. En trois minutes, la base sature et le service entier s'arrête.

**Limites.** Les prévisions sont incertaines, et les tests de charge ne reproduisent jamais toute la réalité. La planification est un processus continu : on compare régulièrement la prévision et la mesure, et on ajuste le modèle.

### 4. Relations avec les autres concepts

| Concept | Relation |
|---|---|
| [11.15 SLI, SLO et SLA](#1115-sli-slo-et-sla) | L'objectif de latence et de disponibilité détermine la capacité nécessaire |
| [11.12 Logs, métriques et traces](#1112-logs-métriques-et-traces) | Les métriques d'utilisation et de saturation (méthode USE) fournissent les mesures |
| [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé) | Les alertes prévisionnelles signalent un épuisement à venir |
| [11.8 Tolérance aux pannes, redondance et basculement](#118-tolérance-aux-pannes-redondance-et-basculement) | La redondance (N+1) est une exigence de dimensionnement |
| [11.9 Dégradation progressive](#119-dégradation-progressive) | La dégradation progressive protège le service quand la capacité est dépassée |
| [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation) | Les quotas et la mesure de consommation encadrent la demande de chaque tenant |
| [5.2 Isolation des tenants](05-multi-tenancy-modele-entreprise.md#52-isolation-des-tenants) et [5.4 Modèles d'architecture multi-tenant](05-multi-tenancy-modele-entreprise.md#54-modèles-darchitecture-multi-tenant) | L'isolation et le modèle d'architecture déterminent le voisin bruyant et le placement |
| [10.6 Limitation de débit](10-api-integrations-extensibilite.md#106-limitation-de-débit) | La limitation de débit protège la capacité |
| [7.2 Message et file d'attente](07-evenements-automatisation.md#72-message-et-file-dattente) | Les files de messages absorbent les pics, dans des limites |

### 5. Application pratique

**Situation initiale.** Le moteur de ressources fonctionne avec 8 instances. Le pic actuel est de 400 requêtes par seconde. L'équipe commerciale annonce l'arrivée, dans trois mois, d'un groupe aérien : 250 requêtes par seconde de plus au pic, et 30 millions d'enregistrements.

**Problème.** La plateforme peut-elle absorber cette charge sans dégrader ses objectifs de service ?

**Application du concept.** Une revue de capacité avant l'arrivée du client.

**Déroulé.**

1. **Mesure.** Un test de charge montre qu'une instance tient 60 requêtes par seconde avant que le centile 99 de la latence dépasse l'objectif de 300 ms. La saturation théorique est proche de 100.
2. **Besoin.** Le pic prévu est de $400 + 250 = 650$ requêtes par seconde. $650 / 60 \approx 10{,}8$, donc 11 instances, plus 1 pour la panne : **12 instances**.
3. **Autres ressources.** Stockage : $30\,000\,000 \times 2$ Ko $= 60$ Go ; avec index et répliques (facteur 3), environ 180 Go, ce qui reste dans la capacité. Connexions : 12 instances à 20 connexions donnent 240, au-dessus du plafond de 200 de la base de données. La loi de Little montre qu'une instance occupe environ une connexion en moyenne ($54 \times 0{,}015 \approx 0{,}8$) : on ramène le pool à 12 par instance, soit 144 au total.
4. **Délais.** Les instances se créent en minutes. La montée en gamme de la base demande une fenêtre de maintenance planifiée, et l'augmentation du quota du fournisseur prend plusieurs jours : on les lance dès maintenant.
5. **Protection.** Un quota de 300 requêtes par seconde est appliqué au nouveau tenant (voir [1.5 Quotas et consommation](01-architecture-saas.md#15-quotas-et-consommation)), pour protéger les autres.
6. **Vérification.** Un test de charge à 130 % de la prévision (845 requêtes par seconde) valide le plan. Une alerte prévisionnelle surveille la consommation (voir [11.13 Surveillance, alertes et sondes de santé](#1113-surveillance-alertes-et-sondes-de-santé)).

**Résultat.** La capacité est prête avant l'arrivée du client, sans incident, pour un coût connu : quatre instances de plus et une montée en gamme de la base.

**Limites.** La prévision commerciale est incertaine : on la revoit chaque mois. Le test de charge ne reproduit pas exactement la production, et la capacité de la base devra être surveillée après l'arrivée du client.

### 6. Vérification finale de la compréhension

#### Questions

1. **Compréhension.** Pourquoi ne vise-t-on pas une utilisation de 100 % des ressources ?
2. **Compréhension.** Qu'est-ce que la marge, et que signifie « N+1 » ?
3. **Compréhension.** Quelle différence y a-t-il entre la planification de capacité et la mise à l'échelle automatique ?
4. **Pourquoi.** Pourquoi la latence augmente-t-elle brutalement quand l'utilisation approche de la saturation ?
5. **Raisonnement pratique.** Un service reçoit 300 requêtes par seconde. Chaque requête occupe une connexion de base de données pendant 20 ms. Combien de connexions sont occupées en moyenne ? Pourquoi un pool de cette taille exacte serait-il insuffisant ?

#### Réponses

1. Parce que la latence croît brutalement près de la saturation, que la moindre pointe ou la moindre panne provoquerait un dépassement, et qu'il ne resterait aucune marge pour agir.
2. La marge est l'écart volontaire entre la capacité et la charge attendue : elle absorbe les pointes, les erreurs de prévision et les pannes. « N+1 » désigne un dimensionnement qui supporte la charge de pic même quand une unité est perdue.
3. La mise à l'échelle automatique réagit à la charge observée, dans des limites. La planification anticipe : elle prévoit la demande, vérifie les ressources peu élastiques (base de données, quotas, tiers), fixe les plafonds et lance les actions à long délai.
4. Quand le débit d'arrivée approche le débit maximal de service, les requêtes s'accumulent en file d'attente. Dans le modèle simple, $W = (1/\mu)/(1-\rho)$ tend vers l'infini quand $\rho$ tend vers 1.
5. $300 \times 0{,}02 = 6$ connexions occupées en moyenne. Un pool de 6 serait insuffisant, car la moyenne cache les pointes (rafales, requêtes plus lentes que la moyenne). On ajoute une marge, par exemple le double, validée par la mesure.
