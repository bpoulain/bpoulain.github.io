# Semaine 2 — Workflows par rôle

**Modules couverts** : Module 2 (parcours de votre rôle)  
**Durée totale estimée** : 7-9h (1-1.5h/jour)

> Suivez uniquement le parcours de votre rôle. Vous pouvez lire les autres pour mieux collaborer avec vos collègues.

---

## 👔 Semaine 2 PM

### Jour 8 — Workflow Discovery → PRD

**Objectif** : Générer un premier PRD depuis des notes brutes.

**Setup :**
```bash
cp starter-kit/.claude/skills/prd-writer.md .claude/skills/
cp starter-kit/templates/prd-template.md templates/
```

**Exercice :**
1. Créez `discovery/notes-feature-test.md` avec 10 bullet points sur un problème utilisateur réel
2. Lancez Claude Code :
   ```
   > Lis le fichier discovery/notes-feature-test.md.
     Utilise le skill prd-writer et le template prd-template.md pour créer
     prds/prd-test-v1.md
   ```
3. Lisez le PRD généré et identifiez ce qui manque
4. Itérez avec Claude Code pour compléter

**Critère de réussite** : Le PRD répond à toutes les sections du template. ✅

---

### Jour 9 — Engineering review simulée

**Objectif** : Améliorer votre PRD avant de le partager.

**Setup :**
```bash
cp starter-kit/.claude/commands/prd-review.md .claude/commands/
```

**Exercice :**
```
> /prd-review
[Collez votre PRD du jour 8]
```

Notez les questions manquantes. Corrigez votre PRD pour produire la v2.

**Critère de réussite** : Votre PRD v2 répond à toutes les questions de l'engineering review. ✅

---

### Jour 10 — Système de mémoire produit

**Objectif** : Construire votre mémoire produit persistante.

**Setup :**
```bash
cp starter-kit/memory/*.md memory/
```

Remplissez :
- `memory/target-users.md` — vos vraies personas
- `memory/product-principles.md` — vos principes
- `memory/decisions.md` — les décisions récentes
- `memory/competitors.md` — vos 3 principaux concurrents

**Critère de réussite** : Claude Code peut répondre à "Qui sont nos utilisateurs et leurs 3 principales frustrations ?" en lisant uniquement les fichiers memory/. ✅

---

### Jours 11-12 — Competitor analysis et sprint planning

**Jour 11 — Analyser un concurrent :**
```bash
cp starter-kit/.claude/skills/competitor-analyzer.md .claude/skills/
```

```
> Analyse [nom du concurrent] avec le skill competitor-analyzer.
  Génère research/competitor-[nom]-[date].md
```

**Jour 12 — Découper en stories :**
```bash
cp starter-kit/.claude/skills/sprint-planner.md .claude/skills/
```

```
> Lis prds/prd-test-v2.md et utilise le skill sprint-planner pour générer
  specs/stories-feature-test.md
```

---

### Jours 13-14 — Consolidation PM

**Jour 13** : Produisez un PRD complet de A à Z sur une vraie feature de votre produit.

**Jour 14** : Auto-évaluation + enrichissement CLAUDE.md avec les apprentissages.

---

## 🔨 Semaine 2 Builder

### Jour 8 — Architecture d'une app

**Objectif** : Générer l'architecture d'une app réelle.

Choisissez un projet concret : une micro-app que vous voulez construire.

**Exercice :**
```
Tu es senior developer [votre stack].

Je veux construire : [description de l'app]

Phase architecture uniquement :
1. Architecture adaptée (justifiée)
2. Structure de dossiers complète
3. Dépendances nécessaires avec justification
4. Décisions techniques à prendre avant de coder

Ne génère pas de code — je valide d'abord.
```

**Critère de réussite** : Vous comprenez l'architecture et pouvez l'expliquer à quelqu'un. ✅

---

### Jour 9 — Générer les fondations

**Objectif** : Le projet de base tourne.

Sur la base de l'architecture validée :
```
> Génère maintenant :
  1. package.json avec les dépendances exactes
  2. Configuration TypeScript (tsconfig.json)
  3. Structure de dossiers avec fichiers vides
  4. README.md avec les commandes de base

  Ensuite, installe les dépendances et vérifie que `npm run dev` fonctionne.
```

---

### Jours 10-12 — Feature par feature

**Workflow avec `/build-feature` :**
```bash
cp starter-kit/.claude/commands/build-feature.md .claude/commands/
```

Pour chaque feature :
```
> /build-feature
[Description de la feature]
```

Validez l'architecture → laissez Claude Code coder → testez.

**Objectif fin jour 12** : Une feature complète avec tests. ✅

---

### Jours 13-14 — Debugging et consolidation

**Jour 13** : Provoquez un bug volontairement, débuggez avec le template de debugging.

**Jour 14** : Auto-évaluation.

---

## 🎨 Semaine 2 Designer

### Jour 8 — Premier set de specs

**Objectif** : Générer des specs complètes d'un composant existant.

**Setup :**
```bash
# Créer le skill ux-specs-generator
mkdir -p .claude/skills
cat > .claude/skills/ux-specs-generator.md << 'EOF'
Tu es Product Designer expert en documentation.
Génère des specs UX complètes pour le composant/flow décrit.
Couvre obligatoirement : tous les états, accessibilité WCAG, interactions, design tokens, questions engineering.
EOF
```

**Exercice :**
```
> Voici la description du composant [nom] : [description]
  Génère les specs complètes dans specs/spec-[nom]-v1.md
```

Voir l'exemple : `examples/ux-specs-data-table.md`

---

### Jours 9-10 — Revue UX

**Setup :**
```bash
cp starter-kit/.claude/skills/ux-reviewer.md .claude/skills/
```

**Exercice :**
```
> Utilise le skill ux-reviewer pour analyser ce flow :
  [Description d'un flow existant dans votre produit]
```

Compilez les findings P1 en un plan d'action.

---

### Jours 11-12 — Handoff engineering

Créez un template de handoff complet pour une feature en cours :
- Lien Figma
- Specs générées
- Questions ouvertes
- Checklist QA

---

### Jours 13-14 — Consolidation Designer

**Jour 13** : Documentation d'un composant de votre design system.

**Jour 14** : Auto-évaluation.

---

## ⚙️ Semaine 2 Design Engineer

### Jour 8 — Premier composant généré

**Setup :**
```bash
cp starter-kit/.claude/skills/component-generator.md .claude/skills/
```

**Exercice :**
```
> Lis les composants existants dans src/components/ (patterns et tokens).
  
  Génère le composant [Nom] avec ces specs : [specs]
  
  Fichiers : [Nom].tsx, [Nom].stories.tsx, [Nom].test.tsx
```

Voir l'exemple complet : `examples/react-component-badge/`

---

### Jours 9-10 — Tests et Storybook

**Jour 9** : Générer les tests pour un composant existant sans tests.

**Jour 10** : Compléter les stories Storybook avec tous les états.

---

### Jours 11-12 — Revue et qualité

**Jour 11** : Revue de code UI (prompt de revue du bootcamp-design-engineer.md).

**Jour 12** : Audit a11y sur vos composants récents.

---

### Jours 13-14 — Consolidation Design Engineer

**Jour 13** : Pipeline complet Figma → Specs → Composant.

**Jour 14** : Auto-évaluation.
