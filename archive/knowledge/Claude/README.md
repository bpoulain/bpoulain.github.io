# AI Discovery — Ecosystem Claude Code

Bootcamp + kit opérationnel pour utiliser Claude Code dans les workflows produit.  
Conçu pour 4 rôles : 👔 PM · 🔨 Builder · 🎨 Designer · ⚙️ Design Engineer

---

## Par où commencer ?

### Je viens d'arriver

```
1. Lire cette page jusqu'au bout (5 min)
2. Choisir mon rôle → aller dans roles/
3. Installer Claude Code (instructions dans le bootcamp)
4. Copier starter-kit/ dans mon projet
5. Suivre study-plan/week-1-setup.md
```

### Je veux pratiquer tout de suite

→ **`missions/`** — Scénarios complets avec corrigés. Aucun contexte réel nécessaire.

### Je cherche un prompt spécifique

→ **`prompts-library/`** — 33 prompts classés par cas d'usage.

### Je veux configurer mon contexte Claude Code rapidement

→ **`claude-md-templates/`** — CLAUDE.md prêts pour SaaS, marketplace, mobile, fintech.

### Je veux voir ce qu'un bon livrable ressemble

→ **`examples/`** — PRD complet, competitor analysis, specs UX, composant React.

---

## Carte complète de l'ecosystem

```
claude_ops/
│
├── README.md                          ← Vous êtes ici
├── draft_AI_Discovery.md              ← Bootcamp complet (2500+ lignes)
│
├── roles/                             ← Parcours autonomes par rôle
│   ├── bootcamp-pm.md                 👔 Product Manager (3 semaines)
│   ├── bootcamp-builder.md            🔨 Product Builder (3-4 semaines)
│   ├── bootcamp-designer.md           🎨 Product Designer (2-3 semaines)
│   └── bootcamp-design-engineer.md    ⚙️ Design Engineer (3-4 semaines)
│
├── starter-kit/                       ← Kit clé-en-main à copier dans votre projet
│   ├── README.md                      Guide d'utilisation du kit
│   ├── CLAUDE.md                      Template commenté (à personnaliser)
│   ├── .gitignore                     Sécurité (API keys hors Git)
│   ├── .claude/
│   │   ├── settings.json              Permissions + placeholders MCP
│   │   ├── skills/                    5 skills opérationnels
│   │   │   ├── prd-writer.md          Notes → PRD structuré
│   │   │   ├── competitor-analyzer.md Rapport concurrentiel
│   │   │   ├── sprint-planner.md      PRD → User stories
│   │   │   ├── ux-reviewer.md         Revue UX (heuristiques Nielsen)
│   │   │   └── component-generator.md Composant React complet
│   │   └── commands/                  3 custom slash commands
│   │       ├── prd-review.md          /prd-review
│   │       ├── weekly-intel.md        /weekly-intel
│   │       └── build-feature.md       /build-feature
│   ├── templates/                     4 templates de livrables
│   │   ├── prd-template.md
│   │   ├── spec-template.md
│   │   ├── research-template.md
│   │   └── competitor-template.md
│   └── memory/                        5 fichiers de mémoire projet
│       ├── product-principles.md
│       ├── target-users.md
│       ├── decisions.md
│       ├── competitors.md
│       └── roadmap.md
│
├── examples/                          ← Livrables de référence (à quoi ça ressemble)
│   ├── prd-saas-onboarding.md         PRD complet — feature onboarding SaaS
│   ├── competitor-analysis-notion-vs-linear.md  Analyse concurrentielle
│   ├── ux-specs-data-table.md         Specs UX complètes — composant DataTable
│   └── react-component-badge/         Composant React (tsx + stories + tests)
│
├── missions/                          ← Scénarios pratiques — startup fictive Pixio
│   ├── README.md                      Présentation de Pixio + guide des missions
│   ├── mission-01-pm-discovery.md     👔 Discovery → PRD (débutant, 2-3h)
│   ├── mission-02-builder-app.md      🔨 Micro-app de rétention (intermédiaire, 3-4h)
│   ├── mission-03-designer-specs.md   🎨 Specs depuis un brief (débutant, 2-3h)
│   └── mission-04-full-cycle.md       🌐 Cycle complet cross-rôles (avancé, 6-8h)
│
├── prompts-library/                   ← 33 prompts prêts à l'emploi
│   ├── README.md                      Index et guide d'utilisation
│   ├── discovery/                     Research, interviews, insights
│   ├── writing/                       PRDs, specs, docs, release notes
│   ├── review/                        Code review, UX review, PRD review
│   ├── planning/                      Sprint, roadmap, priorisation
│   ├── code/                          Génération, debug, refacto
│   └── design/                        Specs, tokens, handoff, design system
│
├── claude-md-templates/               ← CLAUDE.md prêts par secteur
│   ├── README.md                      Quel template choisir
│   ├── saas-b2b.md                    SaaS outils de productivité B2B
│   ├── marketplace.md                 Plateforme C2C ou B2C
│   ├── mobile-app.md                  Application mobile native/hybrid
│   ├── fintech.md                     Produit financier / paiements
│   └── ecommerce.md                   E-commerce / retail digital
│
└── study-plan/                        ← Plan d'étude 30 jours
    ├── README.md                      Comment utiliser le plan
    ├── week-1-setup.md                J1-7 : Installation + Claude Code Core
    ├── week-2-workflows.md            J8-14 : Workflows par rôle
    ├── week-3-mcp-skills.md           J15-21 : MCP + Skills
    ├── week-4-advanced.md             J22-30 : Subagents + Projet final
    └── self-evaluation.md             Grille d'auto-évaluation
```

---

## Index par besoin

| Besoin | Fichier(s) |
|--------|-----------|
| Installer Claude Code | `draft_AI_Discovery.md` → Prérequis & Installation |
| Comprendre CLAUDE.md | `draft_AI_Discovery.md` → 1.2 / `starter-kit/CLAUDE.md` |
| Démarrer mon workspace | `starter-kit/` + `claude-md-templates/` |
| Générer mon premier PRD | `starter-kit/.claude/skills/prd-writer.md` + `examples/prd-saas-onboarding.md` |
| Pratiquer sans contexte réel | `missions/` |
| Trouver un prompt rapide | `prompts-library/` |
| Configurer MCP Notion | `draft_AI_Discovery.md` → 3.3 |
| Configurer MCP Figma | `draft_AI_Discovery.md` → 3.4 |
| Créer un skill | `draft_AI_Discovery.md` → 4.1 / `starter-kit/.claude/skills/` |
| Voir un composant React exemple | `examples/react-component-badge/` |
| Voir des specs UX exemple | `examples/ux-specs-data-table.md` |
| Mesurer mes progrès | `study-plan/self-evaluation.md` |
| Savoir quoi apprendre ensuite | `study-plan/week-4-advanced.md` → "Ce qui vient ensuite" |

---

## Index par rôle

| Je suis... | Je commence par... | Mes fichiers clés |
|-----------|-------------------|------------------|
| 👔 PM | `roles/bootcamp-pm.md` | `skills/prd-writer` · `skills/competitor-analyzer` · `commands/weekly-intel` · `examples/prd-*` |
| 🔨 Builder | `roles/bootcamp-builder.md` | `skills/component-generator` · `commands/build-feature` · `claude-md-templates/saas-b2b` |
| 🎨 Designer | `roles/bootcamp-designer.md` | `skills/ux-reviewer` · `examples/ux-specs-*` · `prompts-library/design/` |
| ⚙️ Design Eng | `roles/bootcamp-design-engineer.md` | `skills/component-generator` · `examples/react-component-badge/` · `prompts-library/code/` |

---

## Démarrage en 10 minutes

```bash
# 1. Installer Claude Code (si pas déjà fait)
npm install -g @anthropic-ai/claude-code

# 2. Copier le starter kit dans votre projet
cp -r starter-kit/ ~/mon-projet/
cd ~/mon-projet/

# 3. Personnaliser CLAUDE.md (ou prendre un template sectoriel)
cp ../claude-md-templates/saas-b2b.md CLAUDE.md
# Puis éditer les sections [À PERSONNALISER]

# 4. Lancer Claude Code
claude

# 5. Tester
> Qui es-tu et quel est ce projet ?
```

---

## Versions

| Composant | Version | Dernière mise à jour |
|-----------|---------|---------------------|
| Bootcamp principal | v1.1 | 2026-05-23 |
| Starter Kit | v1.0 | 2026-05-23 |
| Exemples | v1.0 | 2026-05-23 |
| Missions | v1.0 | 2026-05-23 |
| Prompts Library | v1.0 | 2026-05-23 |
| CLAUDE.md Templates | v1.0 | 2026-05-23 |
