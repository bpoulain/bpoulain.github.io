# Bootcamp Claude Code — 🎨 Product Designer

> Document autonome extrait du bootcamp complet (`draft_AI_Discovery.md`).
> Contient uniquement les modules et sections pertinents pour un Product Designer.

**Durée totale** : ~2-3 semaines | **Niveau** : Débutant terminal

---

## Votre objectif

À la fin de ce parcours, vous savez :

✅ Générer des specs UX complètes depuis vos notes ou wireframes  
✅ Documenter automatiquement un composant ou un flow  
✅ Connecter Figma à Claude Code pour extraire les specs  
✅ Structurer un handoff engineering sans friction  
✅ Revuer un design avec les heuristiques de Nielsen  
✅ Maintenir un design system documenté  

---

## Semaine 1 — Fondations

### Installation minimale

En tant que designer, vous n'avez pas besoin d'un setup complexe :

```bash
# 1. Installer Node.js
brew install node    # Mac
# Windows : télécharger depuis nodejs.org

# 2. Installer Claude Code
npm install -g @anthropic-ai/claude-code

# 3. Vérifier
claude --version

# 4. Créer votre workspace design
mkdir -p ai-design-lab/{figma-exports,specs,ux-research,handoff,design-system,templates,memory}
cd ai-design-lab
touch CLAUDE.md
```

### CLAUDE.md pour un Designer

```markdown
# [Nom du produit] — Workspace Design

## Contexte produit
[Description du produit, les utilisateurs, les objectifs UX]

## Rôle de l'IA
Tu es product designer senior spécialisé en documentation UX et en B2B SaaS.
Tu génères des specs techniques que les engineers peuvent implémenter sans poser de questions.
Tu parles le langage des PMs ET des engineers.
Tu rédiges en français, sauf les termes techniques (ARIA, WCAG, etc.).

## Structure du workspace
- figma-exports/ : données extraites depuis Figma
- specs/ : spécifications de composants et flows
- ux-research/ : synthèses d'études UX
- handoff/ : documents de handoff pour l'engineering
- design-system/ : documentation du design system

## Design System
- Figma : [URL du fichier Figma]
- Tokens : [couleurs, typographie, espacement]
- Composants clés : [liste des composants principaux]

## Conventions
- Statuts : Draft → In Review → Approved → Shipped
- Nommage specs : spec-[composant]-[version].md
- Nommage research : ux-research-[sujet]-[YYYY-MM].md

## Ce que tu dois toujours couvrir dans les specs
- Tous les états du composant (default, hover, focus, error, empty, loading, disabled)
- Accessibilité WCAG 2.1 AA
- Comportement mobile vs desktop
- Questions ouvertes pour l'engineering
```

---

## Semaine 2 — Workflows Design

### Votre pipeline de documentation

```
Figma (design source)
       ↓
Notes ou export Figma
       ↓
Claude Code → Specs techniques
       ↓
Review UX (skill ux-reviewer)
       ↓
Handoff engineering
```

### Générer des specs de composant

**Installer le skill `ux-specs-generator` :**

```bash
mkdir -p .claude/skills

cat > .claude/skills/ux-specs-generator.md << 'EOF'
---
name: ux-specs-generator
description: Génère des specs UX complètes depuis des notes ou une description de composant
---

Tu es Product Designer expert en documentation.
Pour le composant/flow décrit, génère les specs complètes incluant :
1. Description et rôle du composant
2. Tous les états (default, hover, focus, disabled, loading, error, empty)
3. Comportement responsive (mobile vs desktop)
4. Interactions et animations
5. Design tokens utilisés
6. Accessibilité WCAG 2.1 AA (rôles ARIA, navigation clavier, contraste)
7. Données dynamiques et leurs contraintes
8. Questions ouvertes pour l'engineering
EOF
```

**Utilisation :**

```
> Voici mes notes sur le composant [nom] :
  [Coller vos notes / description / wireframe décrit en texte]

  Utilise le skill ux-specs-generator pour créer les specs complètes
  dans specs/spec-[nom]-v1.md
```

**Voir l'exemple complet :** `examples/ux-specs-data-table.md`

### Analyser un flow UX

```
> Tu es UX expert.

Analyse ce flow utilisateur et identifie :
1. Points de friction (P1 = bloquant, P2 = important, P3 = mineur)
2. Cas non couverts (edge cases)
3. Violations des heuristiques de Nielsen (lister lesquelles)
4. Problèmes d'accessibilité (WCAG 2.1 AA)
5. Questions à valider en test utilisateur

Flow :
[Décrire le flow étape par étape ou coller le contenu]
```

### Revue UX avec le skill

```bash
cp starter-kit/.claude/skills/ux-reviewer.md .claude/skills/
```

```
> /ux-reviewer [ou : utilise le skill ux-reviewer sur le flow suivant :]
[Description du flow ou du composant]
```

---

## Semaine 3 — MCP Figma et Handoff

### Connecter Figma

**Étape 1 : Obtenir un token Figma**
1. [figma.com/settings](https://www.figma.com/settings) → Personal access tokens
2. "Generate new token" → nommer "Claude Code — Design"
3. Scope : Read only (suffisant)

**Étape 2 : Configurer**

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "votre-token"
      }
    }
  }
}
```

**Étape 3 : Tester**

```
> Liste les fichiers Figma auxquels tu as accès
```

### Workflow Figma → Specs

```
> Accède au fichier Figma [URL ou ID].
  Pour le composant "[nom]", extrais :
  1. Toutes les variantes et propriétés
  2. Les couleurs (avec noms de tokens si disponibles)
  3. La typographie complète
  4. Les espacements (padding, gap, margin)
  5. Les états définis
  
  Formate en specs markdown dans specs/spec-[nom]-v1.md
```

### Documenter le Design System

```
> Sur la base du fichier Figma [URL], documente notre design system :

  1. Liste tous les composants disponibles avec leur rôle
  2. Pour chaque token de couleur : nom, valeur hex, usage
  3. Pour chaque token de typographie : famille, poids, taille, usage
  4. Conventions d'espacement

  Crée design-system/README.md avec la documentation complète.
```

### Template de Handoff Engineering

Créez un fichier de handoff type :

```markdown
# Handoff — [Feature/Composant] — [Date]

## Pour les engineers

**PRD de référence** : [lien]  
**Figma** : [lien vers le composant]  
**Specs complètes** : [lien vers spec-xxx.md]

## Ce qui est validé et prêt à implémenter
[Description des éléments approved]

## Ce qui est encore en discussion
[Description des éléments non validés]

## Questions ouvertes pour l'engineering
| Question | Priorité | Date limite |
|----------|----------|------------|
| [Question] | P1 | [date] |

## Checklist de QA post-implémentation
- [ ] [Vérification visuelle 1]
- [ ] [Vérification d'accessibilité]
- [ ] [Comportement mobile]
```

---

## Skills Design à installer

```bash
cp starter-kit/.claude/skills/ux-reviewer.md .claude/skills/
# + ux-specs-generator (créé dans la semaine 2)
```

---

## Checklist de progression Designer

### Semaine 1
- [ ] Claude Code installé
- [ ] CLAUDE.md Designer créé et testé
- [ ] Workspace design créé avec la bonne structure

### Semaine 2
- [ ] Premier set de specs généré (`ux-specs-generator`)
- [ ] Revue UX d'un flow existant (`ux-reviewer`)
- [ ] Synthèse de research UX créée

### Semaine 3
- [ ] MCP Figma configuré et testé
- [ ] Extraction de specs depuis Figma réussie
- [ ] Premier handoff engineering documenté
- [ ] Design system partiellement documenté

---

## Ressources Designer

- Document complet : `draft_AI_Discovery.md` (sections Designer)
- Exemple specs complètes : `examples/ux-specs-data-table.md`
- Skills : `starter-kit/.claude/skills/ux-reviewer.md`
- Plan d'étude détaillé : `study-plan/`
