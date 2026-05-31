# Bootcamp Claude Code — ⚙️ Design Engineer

> Document autonome extrait du bootcamp complet (`draft_AI_Discovery.md`).
> Contient uniquement les modules et sections pertinents pour un Design Engineer.

**Durée totale** : ~3-4 semaines | **Niveau** : Développeur frontend avec intérêt design

---

## Votre objectif

À la fin de ce parcours, vous savez :

✅ Générer des composants React/TS complets depuis des specs Figma  
✅ Maintenir la cohérence du design system automatiquement  
✅ Extraire et synchroniser les design tokens depuis Figma  
✅ Générer des stories Storybook et des tests systématiquement  
✅ Revuer le code généré pour la qualité UI et l'accessibilité  
✅ Automatiser la pipeline Figma → Code  

---

## Semaine 1 — Fondations

### Setup complet Design Engineer

```bash
# Node.js + Claude Code (voir bootcamp-builder.md si besoin)
npm install -g @anthropic-ai/claude-code

# Workspace
mkdir -p ai-design-eng-lab/{components,design-tokens,storybook,figma-sync,templates,memory}
cd ai-design-eng-lab
git init
touch CLAUDE.md .gitignore
```

### CLAUDE.md pour un Design Engineer

```markdown
# [Produit] — Design System & Components

## Stack
- Framework : React 18 + TypeScript 5 (strict)
- Styling : Tailwind CSS v3 (design tokens via CSS variables)
- Documentation : Storybook v7
- Tests : Vitest + Testing Library
- Bundler : Vite

## Architecture des composants
Atomic design :
- atoms/ : Button, Input, Badge, Icon...
- molecules/ : InputGroup, Card, Dropdown...
- organisms/ : DataTable, Modal, NavigationBar...
- templates/ : PageLayout, SidebarLayout...

Un composant = un dossier :
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx
├── ComponentName.test.tsx
└── types.ts (si nécessaire)
```

## Design Tokens
- Fichier source : src/tokens/tokens.ts
- Variables CSS : src/tokens/tokens.css
- Figma sync : figma-sync/ (ne pas éditer manuellement)

## Conventions de code
- Nommage composants : PascalCase
- Props : camelCase, toujours typées, JSDoc sur les props publiques
- Events : préfixe `on` (onClick, onChange, onRemove)
- Composants purs quand possible (pas de state local inutile)

## Interdictions absolues
- Pas de couleurs hardcodées → toujours des tokens
- Pas de `px` pour les espacements → rem ou tokens
- Pas de `!important`
- Pas de `any` en TypeScript
- Pas de composant sans story Storybook

## Accessibilité
WCAG 2.1 AA obligatoire sur tous les composants.
Toujours vérifier : ARIA roles, focus visible, navigation clavier, contraste.

## Rôle de l'IA
Tu es design engineer senior. Tu génères du code de qualité production.
Tu lis toujours les composants existants avant d'en créer un nouveau.
Tu assures la cohérence avec le design system.
```

---

## Semaine 2 — Génération de composants

### Le skill `component-generator`

```bash
mkdir -p .claude/skills
cp starter-kit/.claude/skills/component-generator.md .claude/skills/
```

**Utilisation type :**

```
> Voici les specs du composant Badge :

  Variantes : default, primary, success, warning, error, info
  Tailles : sm, md, lg
  Options : dot (point coloré), icon, onRemove (bouton ✕)
  Accessibilité : ARIA, clavier, contraste

  Avant de coder :
  1. Lis les composants existants dans src/atoms/ pour suivre les patterns
  2. Lis src/tokens/tokens.ts pour les tokens disponibles
  
  Ensuite, génère Badge.tsx, Badge.stories.tsx et Badge.test.tsx
```

**Voir l'exemple complet :** `examples/react-component-badge/`

### Workflow de génération systématique

```
1. Lire les specs (depuis Figma ou le designer)
       ↓
2. Vérifier les composants existants (patterns, tokens)
       ↓
3. Générer le composant avec le skill
       ↓
4. Vérifier accessibilité (Axe, Lighthouse)
       ↓
5. Revue de code (prompt ci-dessous)
       ↓
6. Merge
```

**Prompt de revue de code UI :**

```
Revue ce composant React avec un focus design engineer :

1. Cohérence design system : tokens respectés, pas de hardcode
2. Accessibilité : ARIA roles, focus, contraste, clavier
3. TypeScript : types stricts, props documentées, pas de `any`
4. Performance : renders inutiles, mémoisation pertinente
5. Tests : couverture des états et interactions
6. Storybook : tous les états documentés

Pour chaque finding : [Critique / Important / Mineur] + correction suggérée.
```

---

## Semaine 3 — MCP Figma et Design Tokens

### Connecter Figma

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "votre-token-figma"
      }
    }
  }
}
```

### Extraire les design tokens

```
> Accède au fichier Figma [URL].

  Extrais tous les design tokens (couleurs, typographie, espacement, border-radius, ombres).
  
  Pour chaque token :
  - Nom (en camelCase pour TS, en kebab-case pour CSS)
  - Valeur
  - Usage recommandé
  
  Génère deux fichiers :
  1. src/tokens/tokens.ts (export TypeScript)
  2. src/tokens/tokens.css (CSS custom properties)
```

**Exemple de sortie attendue :**

```typescript
// src/tokens/tokens.ts
export const tokens = {
  color: {
    primary: '#4F46E5',
    primarySubtle: '#EEF2FF',
    success: '#16A34A',
    // ...
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    4: '1rem',
    // ...
  },
} as const;
```

```css
/* src/tokens/tokens.css */
:root {
  --color-primary: #4F46E5;
  --color-primary-subtle: #EEF2FF;
  --spacing-1: 0.25rem;
  /* ... */
}
```

### Pipeline Figma → Composant React

```
> Pipeline complet pour le composant [nom] :

  Étape 1 : Lis le fichier Figma [URL] et extrais les specs du composant [nom]
  Étape 2 : Analyse les variantes, états et propriétés
  Étape 3 : Génère le composant React avec le skill component-generator
  Étape 4 : Liste les tokens manquants dans notre fichier tokens.ts (si applicable)

  Fichiers à créer :
  - src/components/atoms/[Nom]/[Nom].tsx
  - src/components/atoms/[Nom]/[Nom].stories.tsx
  - src/components/atoms/[Nom]/[Nom].test.tsx
```

---

## Semaine 4 — Storybook et automatisation

### Générer la documentation Storybook

```
> Pour tous les composants dans src/components/ qui n'ont pas de story Storybook :
  
  Génère une story complète qui documente :
  - Tous les états (states)
  - Toutes les variantes (variants)
  - Un "Playground" avec args controls
  - Des exemples de cas d'usage réels

  Priorité : commencer par les composants atoms/ sans story.
```

### Automatiser la revue d'accessibilité

```bash
# Installer axe-playwright ou storybook/addon-a11y
npm install --save-dev @storybook/addon-a11y
```

```
> Lis tous les composants dans src/components/ et identifie ceux qui pourraient
  avoir des problèmes d'accessibilité :
  
  - Éléments interactifs sans label ARIA
  - Composants sans gestion du focus
  - Potentiels problèmes de contraste (couleurs hardcodées)
  
  Génère un rapport components-a11y-audit.md avec les findings priorisés.
```

---

## Skills Design Engineer à installer

```bash
cp starter-kit/.claude/skills/component-generator.md .claude/skills/
cp starter-kit/.claude/skills/ux-reviewer.md .claude/skills/  # Pour la revue UX
```

---

## Checklist de progression Design Engineer

### Semaine 1
- [ ] Setup complet (Claude Code + Git + Storybook configuré)
- [ ] CLAUDE.md Design Engineer créé et testé
- [ ] Design tokens extraits et en place

### Semaine 2
- [ ] Premier composant généré avec le skill
- [ ] Story Storybook complète avec tous les états
- [ ] Tests couvrant les interactions principales

### Semaine 3
- [ ] MCP Figma configuré
- [ ] Extraction de specs Figma réussie
- [ ] Tokens synchronisés depuis Figma

### Semaine 4
- [ ] Pipeline Figma → Composant fonctionnel
- [ ] Audit a11y automatisé
- [ ] 10+ composants générés et testés

---

## Ressources Design Engineer

- Document complet : `draft_AI_Discovery.md` (sections Design Engineer)
- Exemple composant complet : `examples/react-component-badge/`
- Exemple specs UX : `examples/ux-specs-data-table.md`
- Skills : `starter-kit/.claude/skills/component-generator.md`
- Plan d'étude détaillé : `study-plan/`
