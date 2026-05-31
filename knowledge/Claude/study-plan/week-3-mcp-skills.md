# Semaine 3 — MCP et Skills

**Modules couverts** : Module 3 + Module 4  
**Durée totale estimée** : 7-9h

---

## Jour 15 — Comprendre MCP

**Objectif** : Savoir exactement ce que MCP fait et comment le configurer.

**La question à répondre avant de configurer :**

> "Quel copier-coller est-ce que je fais plus de 3 fois par semaine ?"

C'est ça que vous allez automatiser avec MCP.

**Architecture MCP (dans votre tête) :**

```
Claude Code ←→ MCP Server ←→ API de l'outil (Notion/Figma/GitHub)
```

**Durée** : 30 min de lecture + 30 min de configuration

**Ce que vous faites :**

1. Identifiez l'outil que vous voulez connecter (Notion, Figma ou GitHub)
2. Obtenez le token API (instructions dans `draft_AI_Discovery.md` → Module 3)
3. Configurez `.claude/settings.json` (copiez depuis `starter-kit/.claude/settings.json`)
4. Redémarrez Claude Code et testez

**Test Notion :**
```
> Liste les databases Notion auxquelles tu as accès
```

**Test Figma :**
```
> Liste les fichiers Figma disponibles
```

**Critère de réussite** : Claude Code répond avec vos vraies databases/fichiers. ✅

---

## Jour 16 — Premier workflow MCP

**Objectif** : Exécuter un workflow bout-en-bout avec MCP.

**Exercice PM (Notion) :**
```
> Sur la base du fichier prds/prd-test-v2.md,
  crée une page Notion dans la database "PRDs" avec :
  - Titre : le titre du PRD
  - Statut : Draft
  - Contenu : le contenu formaté
  
  Montre-moi d'abord ce que tu vas créer avant d'exécuter.
```

**Exercice Builder (GitHub) :**
```
> Crée une issue GitHub dans [repo] :
  - Titre : [feature à implémenter]
  - Description : [description détaillée]
  - Labels : enhancement
```

**Exercice Designer (Figma) :**
```
> Accède au fichier Figma [URL].
  Extrais les specs du composant [nom] et crée specs/spec-[nom]-figma.md
```

**Critère de réussite** : Un document a été créé dans l'outil externe depuis Claude Code. ✅

---

## Jour 17 — Skills : créer et utiliser

**Objectif** : Créer votre premier skill sur mesure.

**Pourquoi les skills ?**

> Un bon skill = vous n'avez plus à expliquer le contexte à chaque fois.
> C'est votre expertise encodée, réutilisable à l'infini.

**Anatomie d'un skill :**

```markdown
---
name: mon-skill
description: Ce que fait ce skill (visible dans /help)
---

# Rôle
[Qui est l'IA dans ce contexte]

# Comportement
[Comment l'IA doit se comporter]

# Règles
[Ce qu'il ne faut pas faire]

# Format de sortie
[Structure exacte de l'output]
```

**Exercice — Créer un skill adapté à votre contexte :**

1. Identifiez une tâche répétitive que vous faites avec Claude Code
2. Créez le skill correspondant dans `.claude/skills/`
3. Testez-le sur un cas réel

**PM → suggestion :** skill "standup-synthesizer" (transforme des notes en standup structuré)
**Builder → suggestion :** skill "pr-description" (génère une description de PR depuis un diff)
**Designer → suggestion :** skill "ux-handoff-checker" (vérifie qu'un handoff est complet)
**Design Eng → suggestion :** skill "token-audit" (vérifie que les tokens sont correctement utilisés)

**Critère de réussite** : Le skill produit un output de meilleure qualité que sans le skill. ✅

---

## Jour 18 — Bibliothèque de prompts

**Objectif** : Organiser vos meilleurs prompts pour ne plus les reperdre.

**Structure recommandée :**

```bash
mkdir -p prompts/{research,writing,review,planning}
```

**Exercice :**

Pour chaque prompt que vous avez utilisé cette semaine et qui a bien fonctionné :

1. Créez un fichier dans `prompts/[catégorie]/[nom].md`
2. Format :

```markdown
# [Nom du prompt]

**Usage** : [Quand utiliser ce prompt]
**Input** : [Ce qu'on fournit]
**Output** : [Ce qu'on obtient]

---

[Le prompt complet]
```

Objectif : avoir 5-10 prompts sauvegardés à la fin du jour.

**Critère de réussite** : Vous pouvez retrouver et réutiliser n'importe quel prompt en moins de 30 secondes. ✅

---

## Jour 19 — Custom slash commands

**Objectif** : Créer des raccourcis pour vos workflows fréquents.

**Un custom command = un fichier dans `.claude/commands/`**

```bash
ls starter-kit/.claude/commands/
# prd-review.md, weekly-intel.md, build-feature.md
```

**Exercice :**

Copiez les commands de `starter-kit/` et créez-en une nouvelle adaptée à votre workflow :

```bash
# PM
cat > .claude/commands/weekly-standup.md << 'EOF'
Prépare le standup PM de cette semaine.

Lis les fichiers modifiés cette semaine dans prds/ et research/.
Génère un résumé de 3-5 bullets :
- Ce qui a été fait
- Ce qui est en cours
- Ce qui est bloqué ou décidé

Format : prêt à être collé dans Slack.
EOF
```

**Critère de réussite** : Votre custom command produit un output directement utilisable. ✅

---

## Jours 20-21 — Intégration et consolidation

**Jour 20 — Composer MCP + Skills :**

Créez un workflow qui combine :
1. Un skill (pour la transformation)
2. Un MCP (pour l'import ou l'export)

**PM exemple :**
```
Skill competitor-analyzer → export vers Notion via MCP
```

**Design Engineer exemple :**
```
Figma MCP → extraction tokens → skill component-generator
```

**Jour 21 — Auto-évaluation Semaine 3.**

---

## Récapitulatif Semaine 3

| Jour | Acquis |
|------|--------|
| J15 | MCP configuré et testé |
| J16 | Premier workflow MCP bout-en-bout |
| J17 | Premier skill custom créé |
| J18 | Bibliothèque de prompts organisée |
| J19 | Custom slash command opérationnel |
| J20-21 | Intégration MCP + Skills |

**Preuve de maîtrise** : Exécutez un workflow complet (input → Claude Code avec skill → export via MCP) sans aide externe.
