# bp knowledge

---

## Table des matières

- [Intelligence Artificielle](#intelligence-artificielle)
- [Claude](#claude)
- [Product](#product)
- [Python](#python)
- [Swift](#swift)

---

## Intelligence Artificielle

- [Parcours d'apprentissage adaptatif](knowledge/AI/parcours_adaptatif.md)
- [1.1 - Qu'est-ce que l'IA ? — Carte mentale fondatrice](knowledge/AI/M1.1-qu-est-ce-que-l-ia.md)
- [1.2 - Les LLM démystifiés — comment un modèle de langage pense](knowledge/AI/M1.2-les-llm-demystifies.md)
- [1.3 - Le prompt comme interface — du texte à l'action](knowledge/AI/M1.3-le-prompt-comme-interface.md)
- [1.4 - RAG — quand l'IA connaît votre contexte](knowledge/AI/M1.4-rag-contexte-et-memoire.md)
- [1.5 - Agents IA — des outils aux systèmes autonomes](knowledge/AI/M1.5-agents-ia.md)
- [1.6 - Embeddings et mémoire vectorielle — l'IA qui se souvient](knowledge/AI/M1.6-embeddings-memoire-vectorielle.md)
- [1.7 - Fine-tuning vs prompting — quand spécialiser un modèle](knowledge/AI/M1.7-fine-tuning-vs-prompting.md)
- [2.1 - Concevoir avec l'incertitude — l'UX des systèmes probabilistes](knowledge/AI/M2.1-ux-systemes-probabilistes.md)
- [2.2 - Identifier les bons cas d'usage IA dans un produit](knowledge/AI/M2.2-identifier-cas-usage-ia.md)
- [2.3 - Du brief au prototype IA — le design sprint adapté](knowledge/AI/M2.3-brief-au-prototype-ia.md)
- [2.4 - Évaluer la qualité d'une feature IA — métriques produit](knowledge/AI/M2.4-evaluer-feature-ia.md)
- [2.5 - Patterns d'interface pour l'IA — UI/UX des outputs génératifs](knowledge/AI/M2.5-patterns-interface-ia.md)
- [2.6 - Concevoir un système de feedback utilisateur pour l'IA](knowledge/AI/M2.6-feedback-utilisateur-ia.md)
- [2.7 - De la feature IA au produit IA-native](knowledge/AI/M2.7-produit-ia-native.md)
- [3.1 - Cartographier ses processus pour identifier l'IA à fort ROI](knowledge/AI/M3.1-cartographier-processus.md)
- [3.2 - Automatisation vs augmentation — choisir le bon paradigme](knowledge/AI/M3.2-automatisation-vs-augmentation.md)
- [3.3 - Construire un workflow IA sans coder — outils no-code/low-code](knowledge/AI/M3.3-workflow-ia-no-code.md)
- [3.4 - Intégrer l'IA dans le cycle produit — discovery, delivery, rétro](knowledge/AI/M3.4-ia-dans-cycle-produit.md)
- [3.5 - Gouvernance et éthique IA dans les équipes produit](knowledge/AI/M3.5-gouvernance-ethique-ia.md)
- [3.6 - Orchestration d'agents pour des processus métier complexes](knowledge/AI/M3.6-orchestration-agents.md)

## Claude

- [README](knowledge/Claude/README.md)
- [Bootcamp complet](knowledge/Claude/draft_AI_Discovery.md)

### roles / Parcours autonomes par rôle
- [Design Engineer](knowledge/Claude/roles/bootcamp-design-engineer.md)
- [Product Designer](knowledge/Claude/roles/bootcamp-designer.md)
- [Product Builder](knowledge/Claude/roles/bootcamp-builder.md)
- [Product Manager](knowledge/Claude/roles/bootcamp-pm.md)

### starter-kit / Kit clé-en-main à copier dans votre projet
- [ReadMe.md : Guide d'utilisation du kit](knowledge/Claude/starter-kit/README.md)
- [Claude.md : Template commenté (à personnaliser)](knowledge/Claude/starter-kit/CLAUDE.md)
#### .claude
- [Permissions + placeholders MCP](knowledge/Claude/starter-kit/.claude/settings.json)
##### skills / 5 skills opérationnels
- [Notes → PRD structuré](knowlegde/Claude/starter-kit/.claude/skills/prd-writer.md)
- [Rapport concurrentiel](knowlegde/Claude/starter-kit/skills/competitor-analyzer.md)
- [PRD → User stories](knowlegde/Claude/starter-kit/.claude/ski.claude/lls/sprint-planner.md)
- [Revue UX (heuristiques Nielsen)](knowlegde/Claude/.claude/starter-kit/skills/ux-reviewer.md)
- [Composant React complet](knowlegde/Claude/starter-kit/.claude/skills/component-generator.md)
##### commands / 3 custom slash commands
- [slash command /prd-review](knowlegde/Claude/starter-kit/.claude/commands/prd-review.md)
- [slash command /weekly-intel](knowlegde/Claude/starter-kit/.claude/commands/weekly-intel.md)
- [slash command /build-feature](knowlegde/Claude/starter-kit/.claude/commands/build-feature.md)
#### templates / 4 templates de livrables
- [competitor-template](knowlegde/Claude/starter-kit/templates/competitor-template.md)
- [prd-template](knowlegde/Claude/starter-kit/templates/prd-template.md)
- [research-template](knowlegde/Claude/starter-kit/templates/research-template.md)
- [spec-template](knowlegde/Claude/starter-kit/templates/spec-template.md)
#### memory / 5 fichiers de mémoire projet
- [competitors](knowlegde/Claude/starter-kit/memory/competitors.md)
- [decisions](knowlegde/Claude/starter-kit/memory/decisions.md)
- [product-principles](knowlegde/Claude/starter-kit/memory/product-principles.md)
- [roadmap](knowlegde/Claude/starter-kit/memory/roadmap.md)
- [target-users](knowlegde/Claude/starter-kit/memory/target-users.md)

### examples / Livrables de référence (à quoi ça ressemble)
- [PRD complet — feature onboarding SaaS](knowledge/Claude/examples/prd-saas-onboarding.md)
- [Analyse concurrentielle](knowledge/Claude/examples/competitor-analysis-notion-vs-linear.md)
- [Specs UX complètes — composant DataTable](knowledge/Claude/examples/ux-specs-data-table.md)
- [Composant React (tsx + stories + tests)](knowledge/Claude/examples/react-component-badge/)

### missions / Scénarios pratiques — startup fictive Pixio
- [Présentation de Pixio + guide des missions](knowledge/Claude/missions/README.md)
- [👔 Discovery → PRD (débutant, 2-3h)](knowledge/Claude/missions/mission-01-pm-discovery.md)
- [🔨 Micro-app de rétention (intermédiaire, 3-4h)](knowledge/Claude/missions/mission-02-builder-app.md)
- [🎨 Specs depuis un brief (débutant, 2-3h)](knowledge/Claude/missions/mission-03-designer-specs.md)
- [🌐 Cycle complet cross-rôles (avancé, 6-8h)](knowledge/Claude/missions/mission-04-full-cycle.md)

### prompts-library / 33 prompts prêts à l'emploi
- [Index et guide d'utilisation](knowledge/Claude/prompts-library/README.md)
#### discovery / Research, interviews, insights
- [competitor-deep-dive](knowledge/Claude/prompts-library/discovery/competitor-deep-dive.md
- [hypothesis-tree](knowledge/Claude/prompts-library/discovery/hypothesis-tree.md
- [interview-synthesis](knowledge/Claude/prompts-library/discovery/interview-synthesis.md
- [market-sizing](knowledge/Claude/prompts-library/discovery/market-sizing.md
- [problem-framing](knowledge/Claude/prompts-library/discovery/problem-framing.md
- [user-story-mapping](knowledge/Claude/prompts-library/discovery/user-story-mapping.md
#### writing / PRDs, specs, docs, release notes
- [executive-summary](knowledge/Claude/prompts-library/writing/executive-summary.md)
- [feature-announcement](knowledge/Claude/prompts-library/writing/feature-announcement.md)
- [internal-brief](knowledge/Claude/prompts-library/writing/internal-brief.md)
- [job-stories](knowledge/Claude/prompts-library/writing/job-stories.md)
- [onboarding-email](knowledge/Claude/prompts-library/writing/onboarding-email.md)
- [prd-from-notes](knowledge/Claude/prompts-library/writing/prd-from-notes.md)
- [release-notes](knowledge/Claude/prompts-library/writing/release-notes.md)
#### review / Code review, UX review, PRD review
- [accessibility-audit](knowledge/Claude/prompts-library/review/accessibility-audit.md)
- [copy-review](knowledge/Claude/prompts-library/review/copy-review.md)
- [prd-engineering-review](knowledge/Claude/prompts-library/review/prd-engineering-review.md)
- [react-component-review](knowledge/Claude/prompts-library/review/react-component-review.md)
- [ux-flow-review](knowledge/Claude/prompts-library/review/ux-flow-review.md)
#### planning / Sprint, roadmap, priorisation
- [backlog-prioritization](knowledge/Claude/prompts-library/planning/backlog-prioritization.md)
- [capacity-planning](knowledge/Claude/prompts-library/planning/capacity-planning.md)
- [okr-definition](knowledge/Claude/prompts-library/planning/okr-definition.md)
- [prd-to-stories](knowledge/Claude/prompts-library/planning/prd-to-stories.md)
- [sprint-retrospective](knowledge/Claude/prompts-library/planning/sprint-retrospective.md)
#### code / Génération, debug, refacto
- [api-integration](knowledge/Claude/prompts-library/code/api-integration.md)
- [code-review](knowledge/Claude/prompts-library/code/code-review.md)
- [debug-root-cause](knowledge/Claude/prompts-library/code/debug-root-cause.md)
- [refactoring](knowledge/Claude/prompts-library/code/refactoring.md)
- [test-generation](knowledge/Claude/prompts-library/code/test-generation.md)
#### design / Specs, tokens, handoff, design system
- [component-specs](knowledge/Claude/prompts-library/design/component-specs.md)
- [design-system-audit](knowledge/Claude/prompts-library/design/design-system-audit.md)
- [engineering-handoff](knowledge/Claude/prompts-library/design/engineering-handoff.md)
- [token-extraction](knowledge/Claude/prompts-library/design/token-extraction.md)
- [ux-audit](knowledge/Claude/prompts-library/design/ux-audit.md)

### claude-md-templates / CLAUDE.md prêts par secteur
- [README](knowledge/Claude/claude-md-templates/README.md)
- [E-commerce / retail digital](knowledge/Claude/claude-md-templates/ecommerce.md)
- [Plateforme C2C ou B2C](knowledge/Claude/claude-md-templates/marketplace.md)
- [Application mobile native/hybrid](knowledge/Claude/claude-md-templates/mobile-app.md)
- [Produit financier / paiements](knowledge/Claude/claude-md-templates/fintech.md)
- [SaaS outils de productivité B2B](knowledge/Claude/claude-md-templates/saas-b2b.md)

### study-plan / Plan d'étude 30 jours
- [Comment utiliser le plan](knowledge/Claude/study-plan/README.md)
- [J1-7 : Installation + Claude Code Core](knowledge/Claude/study-plan/week-1-setup.md)
- [J8-14 : Workflows par rôle](knowledge/Claude/study-plan/week-2-workflows.md)
- [J15-21 : MCP + Skills](knowledge/Claude/study-plan/week-3-mcp-skills.md)
- [J22-30 : Subagents + Projet final](knowledge/Claude/study-plan/week-4-advanced.md)
- [Grille d'auto-évaluation](knowledge/Claude/study-plan/self-evaluation.md)

## Product

- 01 - Stratégie produit & Product Thinking : [théorie](knowledge/Product/01-strategie-produit-theorie.md) / [exercices](knowledge/Product/01b-strategie-produit-exercices.md)
- 02 - Recherche utilisateur & Data Insights : [théorie](knowledge/Product/02-recherche-utilisateur-theorie.md) / [exercices](knowledge/Product/02b-recherche-utilisateur-exercices.md)
- 03 - Psychologie appliquée à l'UX & Product : [théorie](knowledge/Product/03-psychologie-ux-theorie.md) / [exercices](knowledge/Product/03b-psychologie-ux-exercices.md)
- 04 - Idéation & Conception UX : [théorie](knowledge/Product/04-ideation-conception-theorie.md) / [exercices](knowledge/Product/04b-ideation-conception-exercices.md)
- 05 - Design visuel & Design System : [théorie](knowledge/Product/05-design-visuel-theorie.md) / [exercices](knowledge/Product/05b-design-visuel-exercices.md)
- 06 - Prototypage, Validation & Optimisation : [théorie](knowledge/Product/06-prototypage-validation-theorie.md) / [exercices](knowledge/Product/06b-prototypage-validation-exercices.md)
- 07 - Collaboration & Documentation : [théorie](knowledge/Product/07-collaboration-documentation-theorie.md) / [exercices](knowledge/Product/07b-collaboration-documentation-exercices.md)
- 08 - Gestion de projet & Priorisation : [théorie](knowledge/Product/08-gestion-projet-theorie.md) / [exercices](knowledge/Product/08b-gestion-projet-exercices.md)
- 09 - Veille, Innovation & Apprentissage continu : [théorie](knowledge/Product/09-veille-innovation-theorie.md) / [exercices](knowledge/Product/09b-veille-innovation-exercices.md)
- 10 - Product Management avancé : [théorie](knowledge/Product/10-product-management-theorie.md) / [exercices](knowledge/Product/10b-product-management-exercices.md)
- 11 - Service Design & Systèmes complexes : [théorie](knowledge/Product/11-service-design-theorie.md) / [exercices](knowledge/Product/11b-service-design-exercices.md)
- 12 - Growth, Gamification & Engagement : [théorie](knowledge/Product/12-growth-gamification-theorie.md) / [exercices](knowledge/Product/12b-growth-gamification-exercices.md)
- 13 - UX Writing avancé & Delivery : [théorie](knowledge/Product/13-uxwriting-delivery-theorie.md) / [exercices](knowledge/Product/13b-uxwriting-delivery-exercices.md)
- [Synthèse globale](knowledge/Product/synthese.md)

## Python

- 01 - Fondamentaux du langage Python : [théorie](knowledge/Python/01-fondamentaux-theorie.md) / [exercices](knowledge/Python/01b-fondamentaux-exercices.md)
- 02 - Structures de données : [théorie](knowledge/Python/02-structures-theorie.md) / [exercices](knowledge/Python/02b-structures-exercices.md)
- 03 - Itération & accès aux données : [théorie](knowledge/Python/03-iteration-theorie.md) / [exercices](knowledge/Python/03b-iteration-exercices.md)
- 04 - Mutabilité & modèle mémoire : [théorie](knowledge/Python/04-mutabilite-theorie.md) / [exercices](knowledge/Python/04b-mutabilite-exercices.md)
- 05 - Built-ins Python : [théorie](knowledge/Python/05-builtins-theorie.md) / [exercices](knowledge/Python/05b-builtins-exercices.md)
- 06 - Compréhensions : [théorie](knowledge/Python/06-comprehensions-theorie.md) / [exercices](knowledge/Python/06b-comprehensions-exercices.md)
- 07 - Fonctions : [théorie](knowledge/Python/07-fonctions-theorie.md) / [exercices](knowledge/Python/07b-fonctions-exercices.md)
- 08 - Fichiers & persistance : [théorie](knowledge/Python/08-fichiers-theorie.md) / [exercices](knowledge/Python/08b-fichiers-exercices.md)
- 09 - Gestion des erreurs : [théorie](knowledge/Python/09-erreurs-theorie.md) / [exercices](knowledge/Python/09b-erreurs-exercices.md)
- 10 - Modules & organisation : [théorie](knowledge/Python/10-modules-theorie.md) / [exercices](knowledge/Python/10b-modules-exercices.md)
- 11 - Outils Python : [théorie](knowledge/Python/11-outils-theorie.md) / [exercices](knowledge/Python/11b-outils-exercices.md)
- 12 - Cas pratiques : [théorie](knowledge/Python/12-cas-pratiques-theorie.md) / [exercices](knowledge/Python/12b-cas-pratiques-exercices.md)
- 13 - Programmation Orientée Objet (POO) : [théorie](knowledge/Python/13-poo-theorie.md) / [exercices](knowledge/Python/13b-poo-exercices.md)
- 14 -  Spécialisation : [théorie](knowledge/Python/14-specialisation-theorie.md)
- [Synthèse globale](knowledge/Python/synthese.md)

## Swift

- 00 - Fondations Swift — Prérequis POC-oriented [théorie](knowledge/Swift/00-fondations-swift-theorie.md) / [exercices](knowledge/Swift/00b-fondations-swift-exercices.md)
- 01 - Paradigme fondamental — UI = état : [théorie](knowledge/Swift/01-paradigme-fondamental-theorie.md) / [exercices](knowledge/Swift/01b-paradigme-fondamental-exercices.md)
- 02 - Système d'état — State System : [théorie](knowledge/Swift/02-systeme-etat-theorie.md) / [exercices](knowledge/Swift/02b-systeme-etat-exercices.md)
- 03 - Composition des Views : [théorie](knowledge/Swift/03-composition-views-theorie.md) / [exercices](knowledge/Swift/03b-composition-views-exercices.md)
- 04 - Layout System : [théorie](knowledge/Swift/04-layout-system-theorie.md) / [exercices](knowledge/Swift/04b-layout-system-exercices.md)
- 05 - Data Flow — Flux de données : [théorie](knowledge/Swift/05-data-flow-theorie.md) / [exercices](knowledge/Swift/05b-data-flow-exercices.md)
- 06 - Navigation : [théorie](knowledge/Swift/06-navigation-theorie.md) / [exercices](knowledge/Swift/06b-navigation-exercices.md)
- 07 - Side Effects & Lifecycle : [théorie](knowledge/Swift/07-side-effects-lifecycle-theorie.md) / [exercices](knowledge/Swift/07b-side-effects-lifecycle-exercices.md)
- 08 - Lists & Performance : [théorie](knowledge/Swift/08-lists-performance-theorie.md) / [exercices](knowledge/Swift/08b-lists-performance-exercices.md)
- 09 - Concurrency — async / await : [théorie](knowledge/Swift/09-concurrency-theorie.md) / [exercices](knowledge/Swift/09b-concurrency-exercices.md)
- 10 - Persistence & Storage : [théorie](knowledge/Swift/10-persistence-storage-theorie.md) / [exercices](knowledge/Swift/10b-persistence-storage-exercices.md)
- 11 - Interop UIKit / AppKit : [théorie](knowledge/Swift/11-interop-uikit-appkit-theorie.md) / [exercices](knowledge/Swift/11b-interop-uikit-appkit-exercices.md)
- 12 - Animations & Interactions : [théorie](knowledge/Swift/12-animations-interactions-theorie.md) / [exercices](knowledge/Swift/12b-animations-interactions-exercices.md)
- 13 - Architecture & Patterns : [théorie](knowledge/Swift/13-architecture-patterns-theorie.md) / [exercices](knowledge/Swift/13b-architecture-patterns-exercices.md)
- 14 - Debug & Mental Tooling : [théorie](knowledge/Swift/14-debug-mental-tooling-theorie.md) / [exercices](knowledge/Swift/14b-debug-mental-tooling-exercices.md)
- 15 - Product POC Layer : [théorie](knowledge/Swift/15-product-poc-layer-theorie.md) / [exercices](knowledge/Swift/15b-product-poc-layer-exercices.md)
- 16 - Product Thinking Execution Layer : [théorie](knowledge/Swift/16-product-thinking-theorie.md) / [exercices](knowledge/Swift/16b-product-thinking-exercices.md)
- [Synthèse globale](knowledge/Swift/synthese.md)

### Swift examples

- 01 [HabitTracker](knowledge/Swift_examples/01_HabitTracker/code.md)
- 02 [NotesApp](knowledge/Swift_examples/02_NotesApp/code.md)
- 03 [WeatherApp](knowledge/Swift_examples/03_WeatherApp/code.md)
- 04 [ExpenseTracker](knowledge/Swift_examples/04_ExpenseTracker/code.md)
- 05 [WorkoutCompanion](knowledge/Swift_examples/05_WorkoutCompanion/code.md)
- 06 [SocialFeed](knowledge/Swift_examples/06_SocialFeed/code.md)
- 07 [WidgetKitApp](knowledge/Swift_examples/07_WidgetKitApp/code.md)
- 08 [DashboardAnalytics](knowledge/Swift_examples/08_DashboardAnalytics/code.md)
- 09 [DesignSystem](knowledge/Swift_examples/09_DesignSystem/code.md)
- 10 [MultiplatformApp](knowledge/Swift_examples/10_MultiplatformApp/code.md)

