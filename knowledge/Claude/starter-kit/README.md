# AI Product OS — Starter Kit

Kit opérationnel prêt à déployer pour utiliser Claude Code dans vos workflows produit.

## Démarrage rapide (10 minutes)

```bash
# 1. Copier le starter kit dans votre projet
cp -r starter-kit/ mon-projet/
cd mon-projet/

# 2. Personnaliser CLAUDE.md avec votre contexte
# (ouvrir CLAUDE.md et remplir les sections marquées [À PERSONNALISER])

# 3. Configurer vos API keys dans .claude/settings.json
# (ne JAMAIS committer ce fichier avec de vraies clés)

# 4. Lancer Claude Code
claude
```

## Contenu du kit

```
starter-kit/
│
├── CLAUDE.md                    ← Mémoire projet (à personnaliser)
├── .gitignore                   ← Exclut les fichiers sensibles
│
├── .claude/
│   ├── settings.json            ← Permissions + MCP (à configurer)
│   ├── skills/
│   │   ├── prd-writer.md        ← Notes → PRD structuré
│   │   ├── competitor-analyzer.md ← Rapport concurrentiel
│   │   ├── sprint-planner.md    ← PRD → User stories
│   │   ├── ux-reviewer.md       ← Revue UX critique
│   │   └── component-generator.md ← Composant React complet
│   └── commands/
│       ├── prd-review.md        ← /prd-review
│       ├── weekly-intel.md      ← /weekly-intel
│       └── build-feature.md     ← /build-feature
│
├── templates/
│   ├── prd-template.md          ← Template PRD premium
│   ├── spec-template.md         ← Template specs techniques
│   ├── research-template.md     ← Template synthèse research
│   └── competitor-template.md   ← Template analyse concurrentielle
│
└── memory/
    ├── product-principles.md    ← Principes produit
    ├── target-users.md          ← Personas
    ├── decisions.md             ← Log des décisions
    ├── competitors.md           ← Résumé concurrentiel
    └── roadmap.md               ← Roadmap actuelle
```

## Premiers pas

### Tester que CLAUDE.md fonctionne

```bash
claude
> Qui es-tu et quel est ce projet ?
```

Claude Code doit répondre en utilisant les infos de votre CLAUDE.md.

### Utiliser un skill

```bash
> [coller des notes de discovery]
> Utilise le skill prd-writer pour transformer ces notes en PRD
```

### Utiliser un custom command

```bash
> /prd-review
```

Puis collez votre PRD dans le prompt.

## Structure de workspace recommandée

Ajoutez ces dossiers à votre projet selon votre rôle :

**PM :** `discovery/ prds/ research/ specs/ competitors/`  
**Builder :** `apps/ scripts/ automations/ docs/`  
**Designer :** `figma-exports/ specs/ handoff/ design-system/`  
**Design Engineer :** `components/ tokens/ storybook/ figma-sync/`
