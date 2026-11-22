# Section 7 — Collaboration & Documentation

> **Fichier théorie — aucun exercice.**
> Cette section couvre les fondamentaux de la collaboration interdisciplinaire, de la documentation UX vivante, et des outils IA qui transforment la façon dont les équipes produit travaillent ensemble.

---

## Table des matières

1. [Workshops & réunions : facilitation et capture structurée](#1-workshops--réunions--facilitation-et-capture-structurée)
2. [Guides & fiches composants : documentation actionnable](#2-guides--fiches-composants--documentation-actionnable)
3. [Documentation évolutive avec versioning IA](#3-documentation-évolutive-avec-versioning-ia)
4. [Frameworks méthodologiques : Lean UX, Design Sprint, Double Diamond](#4-frameworks-méthodologiques--lean-ux-design-sprint-double-diamond)
5. [Collaboration interdisciplinaire & leadership UX/PM](#5-collaboration-interdisciplinaire--leadership-uxpm)
6. [Handoff UX/UI aux développeurs](#6-handoff-uxui-aux-développeurs)
7. [IA appliquée : outils de collaboration augmentés](#7-ia-appliquée--outils-de-collaboration-augmentés)

---

## 1. Workshops & réunions : facilitation et capture structurée

### Modèle mental

Un workshop n'est pas une réunion avec un tableau blanc. C'est un dispositif structuré conçu pour produire une sortie spécifique — une décision, une liste d'idées validées, un consensus — dans un temps contraint.

**Analogie stable**

Un workshop ressemble à une recette de cuisine : vous avez des ingrédients (participants), un temps de cuisson (durée), une méthode (facilitation), et un plat attendu (livrable). Si vous n'avez pas de recette, vous obtenez un mélange d'ingrédients qui ne constitue pas un repas.

---

### Méthodologie & Bonnes pratiques

#### Avant le workshop

| Étape | Action | Outil |
|-------|--------|-------|
| Définir l'objectif | Une seule question centrale à résoudre | Brief 1 page |
| Identifier les participants | Croiser PM, UX, dev, métier — max 8 personnes | Carte des parties prenantes |
| Préparer le support | Agenda minuté, matériaux, exercices | Miro, FigJam |
| Envoyer le pré-read | Contexte, données, contraintes | Notion, Confluence |

#### Pendant le workshop

**Structure en blocs de temps (timeboxing)**

```
[5 min]  Cadrage : rappel objectif, règles du jeu
[15 min] Partage des faits : données, insights existants
[30 min] Divergence : génération d'idées (Crazy 8s, HMW)
[20 min] Convergence : dot voting, critères de décision
[10 min] Décision et prochaines étapes
```

**Rôles formels à distribuer**

- **Facilitateur** : gère le temps, la parole, l'énergie du groupe
- **Scribe** : capture décisions ET raisonnements (pas seulement conclusions)
- **Timekeeper** : chronométreur indépendant du facilitateur

#### Après le workshop

**La règle des 24h** : le compte-rendu doit être diffusé dans les 24 heures. Au-delà, les souvenirs divergent et les décisions sont remises en question.

**Structure d'un compte-rendu efficace**

```markdown
## Décisions prises
- [Décision 1] → Responsable : [Prénom] → Deadline : [date]
- [Décision 2] → Responsable : [Prénom] → Deadline : [date]

## Idées générées (non décidées)
- [Idée A] → Backlog ou exploration future

## Hypothèses identifiées
- [Hypothèse X] → À valider par : [méthode]

## Points de blocage ouverts
- [Blocage Y] → Propriétaire : [Prénom]
```

---

### Comparaison d'approches

| Approche | Usage | Avantage | Limite |
|----------|-------|----------|--------|
| Workshop synchrone (présentiel) | Décisions complexes, tensions à résoudre | Richesse relationnelle, décisions plus rapides | Coût logistique, difficultés d'inclusion remote |
| Workshop asynchrone (Miro/FigJam) | Équipes distribuées, fuseaux horaires multiples | Temps de réflexion plus long, moins de groupthink | Perte de spontanéité, engagement moins garanti |
| Réunion de suivi classique | Points d'avancement | Simple, rapide | ❌ Souvent sans structure, décisions floues |
| Réunion sur document (doc-based meeting) | Revue de livrables | Préparation documentée | Demande discipline de lecture préalable |

---

### Correction modèle mental

**❌ Idée reçue** : "Plus de participants = meilleur workshop, car plus d'idées."

**✅ Approche correcte** : Au-delà de 8 personnes, la participation individuelle chute (effet du passager clandestin). Privilégier des groupes restreints et représentatifs. Si le groupe est large, diviser en sous-groupes avec synthèse plénière.

**KPI impacté** : taux de complétion des actions post-workshop, vélocité de décision mesurable en jours

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux d'actions post-workshop complétées à J+7 | Vélocité de livraison (sprints complétés/sprint) |
| NPS interne des participants au workshop | Réduction des réunions de suivi non planifiées |
| Nombre d'hypothèses générées validées en test | Coût de la décision (temps x personnes x tarif) |

---

### Points éthiques & inclusivité

- **Inclusion active** : certains profils (introvertis, personnes neurodivergentes, participants non-natifs de la langue) parlent moins en groupe. Alterner temps de réflexion individuelle silencieuse (think time) et partage collectif.
- **Facilitation équitable** : éviter que les voix dominantes (hiérarchie, fortes personnalités) étouffent les contributions minoritaires. Techniques : sticky notes anonymes, dot voting simultané.
- **Accessibilité des supports** : contrastes suffisants, polices lisibles, sous-titres en visioconférence.
- **Horaires inclusifs** : en équipes internationales, alterner les fuseaux défavorisés pour ne pas toujours pénaliser les mêmes participants.

---

## 2. Guides & fiches composants : documentation actionnable

### Modèle mental

La documentation d'un composant n'est pas un manuel technique pour développeurs. C'est un contrat partagé entre design, dev et produit : voici ce que ce composant fait, pourquoi il existe, et comment l'utiliser correctement.

**Analogie stable**

Une fiche composant ressemble à une notice IKEA réussie : elle ne décrit pas comment l'étagère a été fabriquée, elle explique comment l'assembler correctement, dans quel contexte l'utiliser, et quelles sont les variations disponibles.

---

### Méthodologie & Bonnes pratiques

#### Anatomy d'une fiche composant complète

```
[Nom du composant]
├── Description fonctionnelle (1-2 phrases)
├── Usage principal (quand l'utiliser)
├── Usage interdit (quand ne PAS l'utiliser)
├── Variantes visuelles (avec captures d'écran)
├── États (default, hover, focus, disabled, error, loading)
├── Propriétés configurables
├── Règles de contenu (limites de texte, type de contenu)
├── Comportement responsive
├── Accessibilité (role ARIA, navigation clavier, contraste)
├── Exemples de code / token design
└── Historique des modifications
```

#### Documentation automatique vs manuelle

| Approche | Quand | Outils | Limite |
|----------|-------|--------|--------|
| Documentation manuelle | Lancement design system, composants complexes | Confluence, Notion | Chronophage, risque de désynchronisation |
| Documentation semi-automatique | Composants en production stables | Storybook, ZeroHeight, Supernova | Requiert configuration initiale |
| Documentation IA-assistée | Mise à jour itérative, changelog | Figma + plugins IA, Zeroheight AI | Vérification humaine nécessaire |
| Documentation auto-générée | Tokens, variables de design | Style Dictionary, Theo | Limité aux données structurées |

#### Bonnes pratiques de rédaction

- **Une fiche = un composant** : ne pas regrouper des composants trop différents sous une seule fiche
- **Rédiger en langage utilisateur**, pas en jargon technique
- **Documenter les rationales** : pourquoi ce choix de design ? Quelle contrainte d'accessibilité ? Cette information est la plus précieuse et la plus souvent absente.
- **Versionner explicitement** : chaque modification de composant doit générer une entrée de changelog datée

---

### Versioning des composants : bonnes pratiques

**Convention de versioning sémantique adapté au design**

```
v1.0.0 — Version initiale
v1.1.0 — Ajout d'une variante (non-breaking)
v1.2.0 — Modification visuelle mineure
v2.0.0 — Changement de comportement ou structure (breaking change)
```

**Principe de backward compatibility** : quand un composant v2 remplace un v1, les deux versions doivent coexister pendant une période de transition documentée pour éviter des régressions visuelles en production.

---

### Correction modèle mental

**❌ Idée reçue** : "La documentation est une tâche finale, à faire après que le design est terminé."

**✅ Approche correcte** : La documentation est co-construite avec le design. Documenter en parallèle oblige à clarifier les décisions ambiguës avant qu'elles ne créent des problèmes en production.

**KPI impacté** : taux de bugs liés à une mauvaise interprétation du design (réduction attendue de 20-40% avec documentation complète)

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de cohérence visuelle (audit design system) | Réduction du temps de development par feature |
| Nombre de questions "comment faire X" par sprint | Réduction des bugs visuels en production |
| Taux de réutilisation de composants existants | Vitesse d'onboarding des nouveaux designers/devs |

---

### Points éthiques & inclusivité

- **Documentation de l'accessibilité comme standard, non comme option** : chaque fiche doit inclure les guidelines WCAG appliquées, les ratios de contraste, et les comportements clavier/lecteur d'écran.
- **Inclusivité des exemples** : les exemples de contenu dans les fiches (noms, photos, cas d'usage) doivent représenter la diversité des utilisateurs réels et non un profil par défaut homogène.
- **Accessibilité de la documentation elle-même** : la documentation doit être lisible par des personnes avec des déficiences visuelles ou cognitives — contrastes, hiérarchie claire, pas de jargon inutile.

---

## 3. Documentation évolutive avec versioning IA

### Modèle mental

La documentation vivante ne se rédige pas entièrement à la main après chaque changement. Elle est générée, mise à jour et signalée automatiquement par des outils IA qui observent les modifications de design en temps réel.

**Analogie stable**

Un système de versioning IA pour documentation design, c'est comme Git pour le code : il détecte chaque changement, crée automatiquement une entrée de journal, et permet de revenir en arrière si une modification crée des problèmes. Sauf qu'ici, il s'applique aux composants visuels et aux décisions UX.

---

### Méthodologie & Bonnes pratiques

#### Figma + IA : ce que les outils permettent aujourd'hui

| Outil | Fonctionnalité IA | Cas d'usage | Maturité |
|-------|-------------------|-------------|----------|
| Figma (natif) | Auto-layout, variables, composants liés | Synchronisation design/dev | Stable |
| Figma + plugin "Changelog" | Génération automatique de notes de version | Historique des modifications | Bêta |
| Zeroheight AI | Résumé automatique des changements de composants | Documentation design system | Disponible |
| Supernova | Sync Figma → documentation + tokens | Documentation automatisée | Stable |
| Anima / Locofy | Génération de code à partir de Figma | Handoff enrichi | En évolution |

#### Mise en place d'un flux de documentation évolutive

```
[Figma] Modification d'un composant
    ↓
[Plugin/IA] Détection du changement + génération de diff visuel
    ↓
[Changelog automatique] Entrée datée avec description générée
    ↓
[Notification équipe] Alerte Slack/Jira pour les équipes impactées
    ↓
[Validation humaine] Review et approbation du changelog avant publication
    ↓
[Documentation mise à jour] Propagation vers Confluence/ZeroHeight
```

**Point critique** : la validation humaine reste indispensable. L'IA génère des descriptions fonctionnelles mais ne peut pas juger de l'intention de design ni des impacts UX non visibles.

#### Stratégie de versioning documentaire

- **Branche de documentation** : comme en développement, tester les modifications de composants sur une branche avant de les merger dans la version principale
- **Tagging sémantique** : chaque release de design system taguée avec version + résumé des impacts
- **Liens bidirectionnels** : chaque entrée de changelog lie vers le fichier Figma modifié ET vers les tickets Jira associés

---

### Correction modèle mental

**❌ Idée reçue** : "L'IA peut gérer seule toute la documentation — l'intervention humaine est un frein."

**✅ Approche correcte** : L'IA automatise la capture et la structuration des changements, mais le sens, la priorité et l'impact UX doivent être validés par un humain. Un changelog mal labellisé "non-breaking" qui casse en réalité l'accessibilité d'un composant est plus dangereux qu'une documentation manuelle imparfaite.

**KPI impacté** : taux de régression visuelle en production, temps de résolution des incohérences design/dev

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de synchronisation design/dev (composants alignés) | Réduction du coût de correction post-déploiement |
| Délai entre modification Figma et documentation mise à jour | Vélocité d'intégration des changements de design system |
| Nombre de régressions visuelles détectées avant prod | ROI du design system (réutilisation vs création from scratch) |

---

### Points éthiques & inclusivité

- **Biais de l'IA dans la documentation** : les outils IA qui génèrent des descriptions de composants peuvent reproduire des descriptions visuelles centrées sur des normes culturelles spécifiques (ex : "bouton primaire en bleu" suppose que le bleu est universel). Vérifier que les descriptions ne supposent pas de perception visuelle normale.
- **Transparence du versioning** : les équipes doivent pouvoir comprendre quelles décisions ont changé et pourquoi — pas seulement ce qui a changé. L'historique IA seul est insuffisant sans rationale humain.

---

## 4. Frameworks méthodologiques : Lean UX, Design Sprint, Double Diamond

### Modèle mental

Les frameworks méthodologiques sont des rails de pensée — ils ne remplacent pas le jugement, mais empêchent l'équipe de tourner en rond. Chaque framework est adapté à un type de problème précis : ne pas en changer en cours de route sans raison explicite.

**Analogie stable**

Choisir un framework, c'est comme choisir le bon itinéraire sur une carte. Le GPS (framework) vous évite de vous perdre, mais c'est vous qui décidez si vous prenez l'autoroute (Design Sprint, rapide et direct) ou les petites routes (Double Diamond, exploratoire et riche). Changer de GPS en chemin sans s'arrêter crée de la confusion.

---

### Comparaison des frameworks principaux

| Framework | Durée typique | Phase principale | Meilleur usage | Livrable clé |
|-----------|--------------|-----------------|----------------|-------------|
| **Design Sprint (GV)** | 5 jours | Prototypage + test rapide | Valider une idée risquée avant d'investir | Prototype testé avec 5 utilisateurs |
| **Double Diamond (Design Council)** | 4-12 semaines | Découverte + définition + développement + livraison | Problèmes complexes, exploration large | Brief de conception validé + solution testée |
| **Lean UX** | Continu (sprints) | Build-Measure-Learn | Produits en itération continue, équipes agiles | Hypothèses validées par données |
| **Jobs to Be Done (JTBD)** | 2-4 semaines | Découverte des motivations profondes | Repositionnement produit, innovation | Carte des Jobs et outcomes |
| **HCD (Human-Centered Design - IDEO)** | Variable | Empathie + idéation + prototypage | Innovation sociale, produits complexes | Solution co-créée avec utilisateurs |

---

### Lean UX en détail

**Principe fondateur** : réduire le gaspillage (lean) en testant les hypothèses le plus tôt possible avant de produire des livrables complets.

**Cycle Build-Measure-Learn**

```
[Hypothèse] "Nous pensons que [utilisateur X] a besoin de [solution Y]
             car cela leur permettra [résultat Z]"
    ↓
[Build] Prototype minimum testable (pas forcément numérique)
    ↓
[Measure] Test avec utilisateurs réels, collecte de données
    ↓
[Learn] Confirmer, infirmer, pivoter l'hypothèse
    ↓
[Nouvelle hypothèse] ← boucle
```

**Matrice d'hypothèses Lean UX**

| Hypothèse | Certitude actuelle | Risque si fausse | Priorité de test |
|-----------|-------------------|-----------------|-----------------|
| Les utilisateurs veulent [X] | Faible | Élevé | 1 — tester immédiatement |
| [Fonctionnalité Y] résout le problème | Moyenne | Moyen | 2 |
| [Flux Z] est compréhensible | Élevée | Faible | 3 |

---

### Double Diamond en détail

**Les 4 phases**

```
◇ DISCOVER (diverger)
  → Recherche, entretiens, observations terrain, données analytics
  → Objectif : comprendre le problème dans toute sa complexité

◇ DEFINE (converger)
  → Synthèse, personas, problem statement, HMW (How Might We)
  → Objectif : formuler le bon problème à résoudre

◇ DEVELOP (diverger)
  → Idéation, sketches, prototypes multiples
  → Objectif : explorer le maximum de solutions possibles

◇ DELIVER (converger)
  → Tests, itérations, sélection, handoff
  → Objectif : livrer la solution la plus efficace
```

**Erreur fréquente** : sauter la phase Discover pour aller directement en Develop. On résout alors le mauvais problème avec élégance.

---

### Design Sprint (GV) en détail

**Agenda des 5 jours**

| Jour | Focus | Activité principale |
|------|-------|-------------------|
| Lundi | Comprendre | Carte du problème, expert interviews, objectif à long terme |
| Mardi | Diverger | Sketches individuels de solutions (pas de vote) |
| Mercredi | Décider | Dot voting, storyboard, décision de prototype |
| Jeudi | Prototyper | Construction d'un prototype réaliste (pas fonctionnel) |
| Vendredi | Tester | 5 tests utilisateurs, pattern d'apprentissage |

**Conditions d'efficacité** : décideur présent toute la semaine, équipe dédiée (pas d'autres projets), facilitateur expérimenté.

---

### Templates méthodologiques clés

| Template | Usage | Outil |
|----------|-------|-------|
| HMW (How Might We) | Reformuler un problème en opportunité de design | Post-its, Miro |
| Carte d'empathie | Comprendre l'état mental de l'utilisateur | Miro template |
| Problem Statement | Formuler le problème à résoudre précisément | Notion |
| Job Story | "Quand [situation], je veux [motivation], pour [résultat]" | Spreadsheet |
| Storyboard | Visualiser un scénario utilisateur | Figma, papier |
| Hypothesis Canvas | Structurer et prioriser les hypothèses | Miro, FigJam |

---

### Correction modèle mental

**❌ Idée reçue** : "Le Design Sprint est la méthode universelle à appliquer dès qu'il y a une décision à prendre."

**✅ Approche correcte** : Le Design Sprint est conçu pour des problèmes clairement définis avec une forte incertitude sur la solution. Si le problème lui-même n'est pas compris, commencer par un Double Diamond (phase Discover). Un Design Sprint sur un mauvais problème produit un prototype élégant d'une mauvaise solution.

**KPI impacté** : taux de succès des fonctionnalités lancées (task success, taux d'adoption à J+30)

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de validation des hypothèses testées | Time-to-market (délai prototype → production) |
| Nombre d'itérations avant validation | Coût de développement évité (hypothèses invalidées tôt) |
| Score SUS des solutions testées en sprint | ROI des workshops (décisions prises vs coût équipe) |

---

### Points éthiques & inclusivité

- **Représentativité dans les sprints** : les 5 utilisateurs testés un vendredi de Design Sprint doivent refléter la diversité du public cible, pas uniquement les utilisateurs "experts" ou les plus faciles à recruter.
- **Diversité de l'équipe sprint** : une équipe homogène (même tranche d'âge, même culture) produit des solutions avec des angles morts systématiques. Inclure des profils variés — y compris des personnes ayant des usages différents (mobilité, accessibilité, contextes de vie différents).
- **Pression de groupe** : dans les phases de décision collective, les techniques de vote anonyme ou simultané réduisent l'influence des hiérarchies sur les choix.

---

## 5. Collaboration interdisciplinaire & leadership UX/PM

### Modèle mental

Le designer UX ne travaille pas en solo pour livrer des maquettes. Il est un connecteur et un traducteur entre les besoins utilisateurs, les contraintes techniques, les objectifs business et les capacités marketing. Son rôle est d'aligner ces tensions, pas de les ignorer.

**Analogie stable**

Le designer UX dans une équipe produit ressemble à un architecte dans un chantier : il traduit les besoins du client (utilisateurs) en plans concrets, dialogue avec les ingénieurs structure (devs) sur les contraintes de faisabilité, s'aligne avec le maître d'ouvrage (PM/business) sur le budget et les délais, et défend la qualité contre les raccourcis qui fragilisent l'édifice.

---

### Cartographie des interactions UX dans l'équipe produit

| Interlocuteur | Ce qu'ils apportent à l'UX | Ce que l'UX leur apporte | Tension fréquente |
|--------------|---------------------------|--------------------------|-------------------|
| **Product Manager** | Objectifs business, priorités, roadmap | Insights utilisateurs, faisabilité UX, risques | Scope vs qualité UX |
| **Développeurs** | Contraintes techniques, faisabilité | Spécifications claires, composants réutilisables | Fidelité du design vs effort dev |
| **Marketing** | Données d'acquisition, personas marché | Cohérence message/expérience produit | Promesse marketing vs réalité produit |
| **Data/Analytics** | Métriques comportementales, A/B tests | Contexte qualitatif des données | Données vs intentions utilisateurs |
| **Support client** | Verbatims, tickets récurrents, frustrations | Améliorations UX réduisant les tickets | Urgences réactives vs vision long terme |
| **Direction/Stakeholders** | Vision stratégique, validation finale | Impact UX sur métriques business | Court terme vs investissement UX long terme |

---

### Leadership UX : influencer sans autorité directe

**Le problème réel** : le designer UX n'a pas d'autorité hiérarchique sur les devs, le PM ou le marketing. Son influence repose sur sa crédibilité, la qualité de ses données, et sa capacité à connecter décisions UX et résultats business.

#### Leviers d'influence UX

**1. Langage des métriques**
Ne pas dire : "Cette interface est confuse."
Dire : "Dans nos tests, 4 utilisateurs sur 5 n'ont pas trouvé [fonctionnalité X]. Le taux d'abandon à cette étape est de 67% dans Google Analytics."

**2. Visualisation des impacts**
Montrer l'impact d'une mauvaise décision UX en chiffres avant qu'elle soit déployée (friction → abandon → perte de conversion).

**3. Prototyper les alternatives**
Présenter deux options côte à côte avec leurs métriques estimées est plus convaincant qu'argumenter verbalement.

**4. Construire des alliés**
Identifier dans l'organisation les "champions UX" — des PM, devs ou responsables qui comprennent la valeur de l'UX et peuvent porter le message en réunion stratégique.

---

### Collaboration UX/PM : rôles et frontières

| Décision | Appartient à | Impacte |
|----------|-------------|---------|
| Quoi construire (priorité) | PM (avec inputs UX) | Roadmap |
| Pourquoi construire | UX + PM ensemble | Validation problème utilisateur |
| Comment construire (UX) | UX (avec inputs dev) | Qualité expérience |
| Comment construire (technique) | Dev (avec inputs UX) | Faisabilité |
| Quand livrer | PM + Dev | Planning |
| Si ça fonctionne | UX + Data ensemble | KPIs |

**Tension productive** : PM cherche la vitesse de livraison, UX cherche la qualité de l'expérience. Cette tension est saine si elle est explicite et gérée avec des critères objectifs (SUS cible, task success minimum accepté).

---

### Influence stakeholders : communication adaptée

| Audience | Ce qui les convainct | Format recommandé |
|----------|---------------------|------------------|
| Direction / C-level | ROI, impact sur métriques business, risques | Executive summary 1 page, slides avec données |
| PM | Insights utilisateurs reliés aux OKRs | Brief UX structuré, données quantitatives |
| Devs | Clarté des specs, logique d'interaction | Annotations Figma, documentation technique |
| Marketing | Cohérence message/expérience, personas | Carte d'empathie, personas enrichis |
| Support | Solutions aux irritants récurrents | Mockups annotés des améliorations |

---

### Correction modèle mental

**❌ Idée reçue** : "L'UX doit protéger le design des demandes des stakeholders pour préserver l'intégrité de l'expérience."

**✅ Approche correcte** : L'UX doit intégrer les contraintes des stakeholders tout en défendant les intérêts utilisateurs avec des données. La "protection" du design sans dialogue crée des silos et nuit à l'influence UX sur le long terme. L'objectif est une tension productive, pas un territoire défendu.

**KPI impacté** : taux d'adoption des recommandations UX par l'équipe, vélocité des décisions interdisciplinaires

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Taux de recommandations UX intégrées en production | Réduction des demandes de refontes post-lancement |
| NPS interne de l'équipe UX (satisfaction des partenaires) | Coût des corrections évitées grâce aux reviews UX |
| Délai moyen de résolution des conflits design/dev | Réduction du temps d'alignement en réunion |

---

### Points éthiques & inclusivité

- **Voix des utilisateurs absentes** : dans les réunions de priorisation, les utilisateurs ne sont pas présents. L'UX a la responsabilité éthique de représenter leurs intérêts, y compris ceux des populations marginalisées (personnes âgées, utilisateurs en situation de handicap, utilisateurs non-experts) qui ont moins de poids dans les données d'usage classiques.
- **Éviter la co-optation** : sous pression stakeholder, le risque est que l'UX "vende" des décisions business déjà prises en les habillant de faux insights utilisateurs. C'est une forme de manipulation — la recherche doit rester indépendante des conclusions attendues.
- **Inclusion des équipes techniques** : les développeurs ont souvent des insights précieux sur les comportements réels des utilisateurs (logs, bugs récurrents) qui ne remontent pas dans les canaux UX formels. Formaliser ces échanges.

---

## 6. Handoff UX/UI aux développeurs

### Modèle mental

Le handoff n'est pas un transfert de fichiers Figma. C'est un protocole de communication structuré qui garantit que l'intention de design survive au passage entre l'équipe UX et l'équipe de développement.

**Analogie stable**

Un handoff UX/dev ressemble à la transmission d'un dossier médical entre deux médecins. Ce qui compte n'est pas le support (papier, numérique) mais la complétude des informations : antécédents (contexte UX), diagnostic (problème résolu), prescription (comportement attendu), et contre-indications (cas limites à éviter). Un dossier incomplet entraîne des erreurs de traitement.

---

### Méthodologie & Bonnes pratiques

#### Les 5 niveaux d'un handoff complet

**Niveau 1 — Contexte**
- Quel problème utilisateur ce design résout-il ?
- Quelles décisions ont été prises et pourquoi ?
- Quelles alternatives ont été rejetées et pour quelle raison ?

**Niveau 2 — Spécifications visuelles**
- Dimensions, espacements, couleurs (tokens), typographies
- Comportement responsive (breakpoints)
- États des composants (hover, focus, active, disabled, error, loading, empty state)

**Niveau 3 — Comportements interactifs**
- Animations et transitions (durée, courbe d'accélération)
- Comportements au scroll, au tap, au clic
- Gestion des erreurs et feedbacks système

**Niveau 4 — Contenu et cas limites**
- Textes max/min (que se passe-t-il si le nom de l'utilisateur a 50 caractères ?)
- Cas vides (état zéro data)
- Gestion des erreurs réseau
- Internationalisation (textes plus longs en allemand ou arabe)

**Niveau 5 — Accessibilité**
- Rôles ARIA des composants interactifs
- Navigation clavier (ordre de tabulation, focus visible)
- Équivalents textuels (alt text pour images, labels pour formulaires)
- Contrastes respectant WCAG AA minimum (ratio 4.5:1 pour texte normal)

---

### Outils de handoff : comparaison

| Outil | Points forts | Limites | Maturité IA |
|-------|-------------|---------|------------|
| **Figma Dev Mode** | Inspection native, tokens, specs automatiques | Limité aux specs visuelles | Annotations IA en développement |
| **Zeplin** | Annotations riches, style guide intégré | Synchronisation manuelle | Basique |
| **Storybook** | Documentation vivante des composants en code | Requiert setup technique | Génération automatique de stories |
| **Anima** | Export code à partir de Figma | Code généré rarement production-ready | Fort |
| **InVision Inspect** | ❌ Déprécié — ne pas utiliser | Plateforme abandonnée | N/A |

---

### Annotations : ce qu'il faut documenter

**Dans Figma : stratégie d'annotation**

```
[Composant]
├── [A] Comportement interactif non-évident
├── [B] Cas limite ou état spécial
├── [C] Règle de contenu (max 30 caractères)
├── [D] Note d'accessibilité (focus trap, label ARIA)
└── [E] Référence au composant du design system
```

**Règle d'or** : n'annoter que ce qui n'est pas évident depuis le fichier Figma. Sur-annoter noie les informations critiques dans le bruit.

---

### Design system partagé : le pont UX/Dev

**Un design system efficace comme outil de handoff**

```
Tokens de design (Figma variables)
    ↓
Style Dictionary (transformation automatique)
    ↓
Tokens CSS/JSON pour les développeurs
    ↓
Composants codés (React, Vue, etc.)
    ↓
Storybook (documentation vivante)
    ↓
Production
```

**Le design system réduit le handoff** car les composants déjà codés n'ont pas besoin d'être ré-expliqués. L'énergie du handoff se concentre sur les flux, les comportements et les cas limites — ce qui ne peut pas être tokenisé.

---

### Correction modèle mental

**❌ Idée reçue** : "Si j'utilise Figma Dev Mode, le handoff est automatique — les devs ont tout ce qu'il faut."

**✅ Approche correcte** : Les outils de handoff automatisent les specs visuelles (dimensions, couleurs, espacements) mais ne transmettent pas l'intention, les décisions prises, les cas limites, les comportements interactifs complexes, ni les exigences d'accessibilité. Ces éléments requièrent une documentation intentionnelle supplémentaire.

**KPI impacté** : nombre de questions "clarification dev" par feature, taux de bugs UX en production

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Nombre de questions de clarification dev par feature | Réduction du coût de correction (bugs visuels/UX) |
| Taux de fidélité design vs production (audit visuel) | Vélocité de développement (features livrées/sprint) |
| Score d'accessibilité en production (Lighthouse) | Réduction des tickets support liés à l'interface |

---

### Points éthiques & inclusivité

- **Accessibilité comme exigence de handoff, non comme option** : les specs d'accessibilité doivent être incluses dans le handoff au même titre que les dimensions visuelles. Ne pas les documenter revient à signaler qu'elles sont optionnelles — ce qu'elles ne sont pas légalement dans de nombreuses juridictions (RGAA en France, ADA aux États-Unis).
- **Documentation des dark patterns évités** : si l'équipe a délibérément évité d'implémenter un dark pattern (ex : checkbox pré-cochée pour opt-in marketing), l'annoter explicitement pour éviter qu'un développeur l'implémente par "logique" de simplification.
- **Internationalisation dès le handoff** : documenter les contraintes de localisation (longueur des textes, direction RTL pour l'arabe et l'hébreu, formats de date et nombres) pour éviter des expériences dégradées pour les utilisateurs non-anglophones.

---

## 7. IA appliquée : outils de collaboration augmentés

### Modèle mental

Les outils IA de collaboration ne remplacent pas les processus d'équipe — ils automatisent les tâches à faible valeur ajoutée (résumés, mise à jour de statuts, détection d'anomalies) pour libérer du temps aux activités à haute valeur (prise de décision, créativité, dialogue).

**Analogie stable**

L'IA dans les outils de collaboration, c'est comme un assistant de réunion qui prend des notes automatiquement, surligne les décisions prises, génère un résumé en 5 points et met à jour le board Jira. L'équipe peut se concentrer sur les échanges réels plutôt que sur la capture administrative.

---

### Cartographie des outils IA de collaboration UX/Product

#### Notion + IA

| Fonctionnalité IA | Usage UX/Product | Bénéfice |
|------------------|-----------------|---------|
| Résumé automatique de documents | Condensér un rapport de recherche de 30 pages | Gain de temps (x5 sur la lecture) |
| Génération de templates | Créer un brief UX, une fiche composant | Accélération du démarrage |
| Extraction d'actions | Identifier les tâches dans un CR de réunion | Réduction des oublis |
| Traduction et reformulation | Adapter un brief pour différentes audiences | Communication plus efficace |
| Recherche sémantique | Retrouver des décisions passées par concept | Mémoire organisationnelle |

**Limite importante** : Notion IA peut générer des résumés incomplets ou "halluciner" des informations absentes du document source. Toujours vérifier les éléments critiques (décisions, chiffres) contre le document original.

---

#### Jira + IA

| Fonctionnalité IA | Usage UX/Product | Bénéfice |
|------------------|-----------------|---------|
| Prédiction de durée | Estimer le temps d'une user story basée sur historique | Planning plus réaliste |
| Détection d'anomalies | Signaler les tickets sans critères d'acceptation | Qualité du backlog |
| Résumé de sprint | Générer le rapport de sprint automatiquement | Réduction de la charge admin |
| Suggestion d'étiquettes | Classifier automatiquement les types de tickets | Organisation du backlog |
| Alerte de dépendance | Identifier les tickets bloquants non résolus | Prévention des blocages |

---

#### Confluence + IA

| Fonctionnalité IA | Usage UX/Product | Bénéfice |
|------------------|-----------------|---------|
| Recherche intelligente | Retrouver des décisions passées par intention | Éviter de re-décider ce qui a déjà été décidé |
| Mise à jour automatique de pages | Synchroniser une page avec des données Jira | Documentation toujours à jour |
| Génération de structure | Proposer un plan de page pour un document | Accélération de la rédaction |
| Alerte de contenu périmé | Signaler les pages non mises à jour depuis X mois | Hygiène documentaire |

---

#### Figma Cloud + IA

| Fonctionnalité IA | Usage UX/Product | Bénéfice |
|------------------|-----------------|---------|
| Variables et tokens intelligents | Propagation automatique des changements de couleur/taille | Cohérence du design system |
| Suggestions de mise en page | Proposer des alternatives de layout | Exploration plus rapide |
| Détection d'incohérences | Identifier les composants non liés au design system | Qualité et maintenabilité |
| Génération de texte de remplissage contextuel | Lorem ipsum adapté au contexte | Prototype plus réaliste |
| Annotations automatiques | Générer des specs d'accessibilité | Handoff enrichi |

---

#### Miro + IA

| Fonctionnalité IA | Usage UX/Product | Bénéfice |
|------------------|-----------------|---------|
| Clustering automatique | Regrouper des post-its après brainstorming | Synthèse accélérée (x3) |
| Génération de diagrammes | Créer un user flow à partir d'une description textuelle | Idéation plus rapide |
| Résumé de board | Extraire les points clés d'un board de workshop | Partage facilité avec absent |
| Traduction de board | Adapter un workshop pour des équipes multilingues | Collaboration internationale |

---

### Flux de collaboration augmenté par IA : exemple concret

**Scénario** : Préparation et suivi d'un Design Sprint de 5 jours

```
[Avant le sprint]
Notion IA → Résumé du rapport de recherche utilisateur (30 min → 5 min)
Miro IA   → Génération du board sprint avec templates préremplis

[Pendant le sprint]
Miro IA   → Clustering automatique des idées du lundi soir
Notion IA → CR de fin de journée généré depuis les notes brutes

[Après le sprint]
Notion IA → Résumé des apprentissages du vendredi test
Jira IA   → Création automatique des user stories depuis les décisions
Confluence → Mise à jour de la page projet avec résultats du sprint

[Suivi]
Jira IA   → Alerte si les actions post-sprint ne sont pas complétées à J+7
```

---

### Alertes IA sur anomalies de collaboration

Les systèmes IA peuvent détecter des signaux faibles qui échappent à l'équipe :

| Anomalie | Signal IA | Action recommandée |
|----------|-----------|-------------------|
| Silence décisionnel | Ticket sans mise à jour depuis 14 jours | Relance automatique du propriétaire |
| Désalignement de specs | Écart entre Figma et ticket Jira | Alerte UX + PM pour réconciliation |
| Sur-charge d'un membre | 40% des actions assignées à une personne | Redistribution recommandée |
| Décision incohérente | Deux décisions contradictoires dans Confluence | Alerte pour révision |
| Composant désynchronisé | Figma modifié mais Storybook non mis à jour | Notification équipe dev |

---

### Correction modèle mental

**❌ Idée reçue** : "Adopter tous les outils IA de collaboration améliore automatiquement la qualité des échanges."

**✅ Approche correcte** : La multiplication des outils IA crée de la fragmentation si elle n'est pas accompagnée d'une stratégie de stack claire. Chaque outil IA ajouté est une source de notifications, de synchronisations à gérer et de formations à dispenser. Commencer par un outil IA à la fois, mesurer l'impact, puis étendre.

**KPI impacté** : temps passé en réunion de coordination, taux d'actions post-sprint complétées, satisfaction d'équipe (NPS interne)

---

### KPIs liés

| KPI UX | KPI Business |
|--------|-------------|
| Temps moyen de production d'un CR (avant/après IA) | Réduction du temps de coordination (heures/semaine) |
| Taux de mise à jour de la documentation (fraîcheur) | Réduction des erreurs de communication design/dev |
| NPS interne sur la qualité de la collaboration | ROI des outils IA (temps économisé vs coût licence) |

---

### Points éthiques & inclusivité

**Surveillance et vie privée**

- Les outils IA qui analysent les échanges d'équipe (résumés de réunion, analyse des communications Slack) collectent des données comportementales sur les personnes. Informer explicitement les équipes de ce qui est capturé et analysé.
- **Consentement éclairé** : les membres de l'équipe doivent savoir si leurs contributions (messages, sticky notes, votes) sont utilisées pour entraîner les modèles IA des outils.

**Biais dans les résumés IA**

- Les outils de résumé IA tendent à surreprésenter les contributions textuellement volumineuses au détriment des contributions courtes mais importantes. Un "oui" décisif de la direction peut disparaître d'un résumé automatique.
- Toujours vérifier que les voix minoritaires ou marginales (dans un workshop, les personnes moins bavardes) ne sont pas effacées du résumé IA.

**❌ Dark pattern IA à éviter**

- Utiliser les alertes IA de "productivité" (nombre de tickets fermés, temps de réponse) comme système de surveillance des performances individuelles. Cela crée de l'anxiété, du gaming des métriques, et détruit la confiance dans l'équipe.

---

## Synthèse des KPIs de la Section 7

| Domaine | KPI UX prioritaire | KPI Business prioritaire |
|---------|-------------------|--------------------------|
| Workshops | Taux d'actions complétées à J+7 | Vélocité de décision (jours) |
| Documentation | Taux de composants documentés | Réduction bugs visuels prod |
| Versioning IA | Synchronisation Figma/doc (%) | Coût de correction évité |
| Frameworks | Taux de validation hypothèses | ROI workshops |
| Collaboration | NPS interne équipe UX | Taux adoption recommandations UX |
| Handoff | Fidélité design/production (%) | Questions clarification dev (nb) |
| IA outils | Temps CR automatisé | Heures coordination économisées |

---

*Fin de la Section 7 — Collaboration & Documentation*
*Fichier théorie — pas d'exercices inclus*
