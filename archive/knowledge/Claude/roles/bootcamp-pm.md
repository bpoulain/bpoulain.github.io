# Bootcamp Claude Code — 👔 Product Manager

> Document autonome extrait du bootcamp complet (`draft_AI_Discovery.md`).
> Contient uniquement les modules et sections pertinents pour un PM.

**Durée totale** : ~3 semaines | **Niveau** : Débutant terminal, intermédiaire produit

---

## Votre objectif

À la fin de ce parcours, vous savez :

✅ Utiliser Claude Code quotidiennement dans votre workflow produit  
✅ Générer et itérer des PRDs solides sans refaire le travail  
✅ Organiser une mémoire produit persistante  
✅ Connecter Claude Code à Notion pour automatiser les exports  
✅ Automatiser votre veille concurrentielle hebdomadaire  
✅ Orchestrer des pipelines de research multi-agents  

---

## Semaine 1 — Fondations

### Jours 1-2 : Installation et terminal

**Ce qu'il faut faire :**

```bash
# 1. Installer Node.js (via brew si Mac)
brew install node

# 2. Installer Claude Code
npm install -g @anthropic-ai/claude-code

# 3. Vérifier
claude --version

# 4. Créer votre workspace PM
mkdir -p ai-product-lab/{discovery,prds,specs,research,competitors,memory,templates,prompts}
cd ai-product-lab
touch CLAUDE.md
claude
```

**Objectif du jour 2** : Claude Code démarre, vous pouvez taper une instruction et voir un résultat.

---

### Jours 3-4 : CLAUDE.md — votre mémoire projet

C'est la compétence la plus importante. Sans CLAUDE.md, vous recommencez à zéro à chaque session.

**Créez votre CLAUDE.md maintenant** (copiez et adaptez) :

```markdown
# [Nom de votre produit]

## Contexte
[Description de votre produit en 2-3 phrases]

## Rôle de l'IA
Tu es Senior PM B2B SaaS. Tu m'aides à produire des PRDs clairs et actionnables,
à synthétiser la research, et à structurer mes réflexions produit.
Tu parles toujours en français, tu es concis et orienté exécution.

## Structure du workspace
- discovery/ : notes d'interviews
- prds/ : PRDs par feature
- research/ : analyses marchés et concurrents
- memory/ : contexte produit persistant

## Conventions
- PRDs : prd-[feature]-v[N].md
- Research : research-[sujet]-[YYYY-MM].md

## Contexte produit
[Décrivez vos utilisateurs, leur problème, votre stack, votre équipe]

## Ne pas faire
- Ne pas inventer de features non validées en research
- Toujours poser les open questions manquantes
```

**Test de validation :**
```
> Qui es-tu dans ce projet et qu'est-ce que tu sais de mon produit ?
```

---

### Jour 5 : Slash commands et prompts RCOCQ

**Slash commands essentiels PM :**

| Commande | Utilisation |
|----------|-------------|
| `/clear` | Nouveau sujet — repart de zéro |
| `/compact` | Session longue — compresse l'historique |
| `/help` | Voir toutes les commandes disponibles |

**Framework de prompting RCOCQ :**

```
R — Rôle
C — Contexte
O — Objectif
C — Contraintes
Q — Qualité

Exemple PM :
Tu es Senior PM chez Linear.                                    (Rôle)
Notre taux d'activation est à 23%, l'onboarding est le problème.(Contexte)
Génère un PRD pour un wizard d'onboarding guidé.               (Objectif)
Pas de gamification, budget 3 sprints.                          (Contraintes)
Doit passer une engineering review sans questions manquantes.   (Qualité)
```

**Exercice :** Rédigez un prompt RCOCQ pour la prochaine feature sur votre roadmap.

---

## Semaine 2 — Workflows PM

### Le workflow PM augmenté par l'IA

```
Discovery (interviews, data)
       ↓
Research IA (synthèse avec Claude Code)
       ↓
PRD draft (avec prd-writer skill)
       ↓
Engineering review simulée (/prd-review command)
       ↓
Itération
       ↓
Specs techniques (sprint-planner skill)
```

### Générer un PRD

**Étape 1** : Installer le skill prd-writer

```bash
mkdir -p .claude/skills
cp starter-kit/.claude/skills/prd-writer.md .claude/skills/
```

**Étape 2** : Préparer votre contexte dans un fichier

```bash
touch discovery/notes-feature-x.md
# Notez vos interviews, données, retours
```

**Étape 3** : Générer

```
> Lis le fichier discovery/notes-feature-x.md et utilise le skill prd-writer
  pour créer le PRD dans prds/prd-[nom]-v1.md
```

**Étape 4** : Simuler une engineering review

```bash
# Créer le custom command
cp starter-kit/.claude/commands/prd-review.md .claude/commands/
```

```
> /prd-review
[Coller votre PRD]
```

### Système de mémoire produit

Créez ces fichiers et maintenez-les à jour. Claude Code les consultera automatiquement si vous y faites référence :

```bash
# Créer la mémoire produit
cp starter-kit/memory/*.md memory/
```

**Règle d'or** : Toute décision prise avec l'IA va dans `memory/decisions.md` avec la date et la raison.

### Template PRD

```bash
cp starter-kit/templates/prd-template.md templates/
```

Voir aussi l'exemple complet : `examples/prd-saas-onboarding.md`

---

## Semaine 3 — MCP et automatisation

### Connecter Notion (MCP)

**Étape 1** : Créer une intégration Notion dédiée

1. Allez sur [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. "New integration" → nommer "Claude Code PM"
3. Permissions minimales : Read + Update + Insert content
4. Copiez le token `secret_...`

**Étape 2** : Configurer settings.json

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_VOTRE_TOKEN"
      }
    }
  }
}
```

**Étape 3** : Connecter vos pages Notion
- Ouvrez chaque database cible → ⋯ → "Add connections" → votre intégration

**Test :**
```
> Liste les databases Notion auxquelles tu as accès
```

**Workflow export PRD → Notion :**

```
> Sur la base du fichier prds/prd-onboarding-v2.md,
  crée une page Notion dans la database "PRDs" avec :
  - Titre : "PRD — Guided Onboarding"
  - Statut : "Draft"
  Montre-moi d'abord ce que tu vas créer.
```

### Automatiser la veille concurrentielle

**Installer le command `/weekly-intel` :**

```bash
cp starter-kit/.claude/commands/weekly-intel.md .claude/commands/
```

**Préparer la liste de concurrents :**

```bash
cp starter-kit/memory/competitors.md memory/
# Remplir avec vos 3-5 concurrents principaux
```

**Utilisation chaque semaine :**

```
> /weekly-intel

[Puis coller les articles, changelogs, tweets que vous avez collectés cette semaine]
```

Le résultat est exporté dans `research/competitive-intel-[YYYY-WW].md`.

---

## Vos livrables par module

| Semaine | Livrable | Exemple disponible |
|---------|----------|-------------------|
| 1 | CLAUDE.md opérationnel | `starter-kit/CLAUDE.md` |
| 2 | Premier PRD généré | `examples/prd-saas-onboarding.md` |
| 2 | Engineering review simulée | Skill `/prd-review` |
| 3 | Export Notion automatique | Via MCP Notion |
| 3 | Premier rapport de veille | Via `/weekly-intel` |

---

## Skills PM à installer

```bash
# Copier tous les skills PM dans votre projet
cp starter-kit/.claude/skills/prd-writer.md .claude/skills/
cp starter-kit/.claude/skills/competitor-analyzer.md .claude/skills/
cp starter-kit/.claude/skills/sprint-planner.md .claude/skills/
```

---

## Checklist de progression PM

### Semaine 1

- [ ] Claude Code installé et fonctionnel
- [ ] CLAUDE.md créé et testé (Claude Code connaît mon projet)
- [ ] Workspace PM créé avec la bonne structure de dossiers
- [ ] Je comprends `/clear` et `/compact`

### Semaine 2

- [ ] Premier PRD généré avec le skill `prd-writer`
- [ ] PRD reviewé avec `/prd-review`
- [ ] Système de mémoire produit en place
- [ ] Premier découpage en stories avec `sprint-planner`

### Semaine 3

- [ ] MCP Notion configuré et testé
- [ ] Premier export Notion réussi
- [ ] Premier rapport `/weekly-intel` généré
- [ ] Concurrent analysé avec `competitor-analyzer`

---

## Ressources PM

- Document complet : `draft_AI_Discovery.md` (sections PM)
- Templates : `starter-kit/templates/`
- Exemples : `examples/prd-saas-onboarding.md`, `examples/competitor-analysis-notion-vs-linear.md`
- Plan d'étude détaillé : `study-plan/`
