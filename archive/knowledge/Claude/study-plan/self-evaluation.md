# Grille d'auto-évaluation

> À remplir à la fin de chaque semaine.
> Soyez honnête — une lacune identifiée est une lacune qu'on peut corriger.

**Notation** : 0 = pas du tout | 5 = partiellement | 10 = maîtrisé sans aide

---

## Semaine 1 — Fondations

### Installation et environnement

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je sais ouvrir un terminal et naviguer | | Relire Module 0 + exercices jour 2 |
| Claude Code démarre sans erreur | | Voir Troubleshooting |
| Je sais créer des fichiers et dossiers | | Pratiquer `mkdir`, `touch`, `ls` |

### CLAUDE.md

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Mon CLAUDE.md décrit correctement mon projet | | Relire section 1.2 |
| Claude Code répond correctement à "Qui es-tu ?" | | Enrichir le contexte dans CLAUDE.md |
| Je sais quand et pourquoi enrichir CLAUDE.md | | Relire la section sur la mémoire |

### Slash commands et contexte

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je sais quand utiliser `/clear` vs `/compact` | | Relire section 1.3 |
| Je décompose mes tâches en étapes | | Pratiquer le framework RCOCQ |
| Je gère le contexte sans "tout mettre dans un prompt" | | Relire section 1.4 |

### Score Semaine 1 : ___/30

**Preuve de maîtrise** : Ouvrez Claude Code, posez 3 questions sur votre projet, obtenez des réponses précises sans réexpliquer le contexte.

✅ / ❌ Validé ?

---

## Semaine 2 — Workflows par rôle

### 👔 PM

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je génère un PRD structuré depuis des notes brutes | | Retravailler le skill prd-writer |
| Mon PRD passe l'engineering review sans questions manquantes | | Utiliser `/prd-review` et itérer |
| Je sais découper un PRD en user stories | | Retravailler sprint-planner |
| J'ai un système de mémoire produit opérationnel | | Remplir les fichiers memory/ |

**Preuve de maîtrise** : Génèrez un PRD complet pour une feature de votre choix en < 20 minutes.

### 🔨 Builder

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je génère l'architecture d'une app avant de coder | | Retravailler le prompt d'architecture |
| J'implémente une feature avec `/build-feature` | | Pratiquer sur une feature simple |
| Je debugge efficacement avec Claude Code | | Pratiquer le template de debugging |
| Je committe avec des messages structurés | | Convention feat(scope): description |

**Preuve de maîtrise** : Implémentez une feature simple (CRUD basique) de bout en bout avec tests.

### 🎨 Designer

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je génère des specs couvrant tous les états | | Retravailler ux-specs-generator |
| Je fais une revue UX avec les heuristiques de Nielsen | | Retravailler ux-reviewer |
| Mon handoff est complet (questions ouvertes, checklist) | | Relire la section handoff |

**Preuve de maîtrise** : Documentez un composant existant (avec tous ses états) en < 30 minutes.

### ⚙️ Design Engineer

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je génère un composant React complet avec tests et story | | Retravailler component-generator |
| Mes composants sont accessibles (ARIA, clavier, contraste) | | Revoir la checklist accessibilité |
| Je lis les composants existants avant d'en créer un nouveau | | Rendre ça automatique dans votre prompt |

**Preuve de maîtrise** : Générez le composant `Tooltip` (accessible, avec tous les états) depuis zéro.

### Score Semaine 2 : ___/40

---

## Semaine 3 — MCP et Skills

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| J'ai configuré au moins un MCP fonctionnel | | Relire section 3.2 sur settings.json |
| Je peux lire ET écrire via MCP | | Pratiquer les deux directions |
| Mes API keys ne sont pas dans Git | | Vérifier .gitignore |
| J'ai créé au moins 3 skills opérationnels | | Retravailler la structure d'un skill |
| J'ai une bibliothèque de prompts organisée | | Créer prompts/ et y ranger les bons prompts |
| J'ai au moins 2 custom slash commands | | Créer .claude/commands/ |

**Preuve de maîtrise** : Exécutez un workflow MCP complet (lire depuis un outil → transformer → écrire dans un autre) sans aide.

### Score Semaine 3 : ___/60

---

## Semaine 4 — Subagents et Projet Final

| Compétence | Score /10 | À retravailler si < 7 |
|-----------|-----------|----------------------|
| Je sais quand utiliser des sessions multiples vs une seule | | Retravailler la logique de décomposition |
| J'ai un workspace complet et organisé | | Audit avec la checklist du jour 24 |
| J'exécute mon workflow complet sans regarder les instructions | | Pratiquer jusqu'à la fluidité |
| Mon CLAUDE.md + WORKFLOW.md permettent l'onboarding d'un nouveau | | Faire relire par quelqu'un |
| J'ai identifié mes 3 prochains apprentissages | | Remplir la section "Ce qui vient ensuite" |

**Preuve de maîtrise finale** : Quelqu'un de nouveau peut être opérationnel avec votre workspace en 30 minutes.

### Score Semaine 4 : ___/50

---

## Score Global et Plan de Suite

| Semaine | Score |
|---------|-------|
| Semaine 1 | ___/30 |
| Semaine 2 | ___/40 |
| Semaine 3 | ___/60 |
| Semaine 4 | ___/50 |
| **Total** | **___/180** |

### Interprétation

| Score | Niveau | Recommandation |
|-------|--------|---------------|
| > 150/180 | Expert | Passez au niveau suivant (voir week-4 → "Ce qui vient ensuite") |
| 120-150 | Avancé | Consolidez les lacunes identifiées, continuez à pratiquer quotidiennement |
| 90-120 | Intermédiaire | Refaites les modules avec les scores les plus bas |
| < 90 | Débutant | Revenez à la semaine 1, ralentissez le rythme |

---

## Mes lacunes prioritaires à combler

*(À remplir en fin de bootcamp)*

| Compétence | Score | Action concrète | Deadline |
|-----------|-------|----------------|---------|
| [Lacune 1] | /10 | [Action] | [Date] |
| [Lacune 2] | /10 | [Action] | [Date] |
| [Lacune 3] | /10 | [Action] | [Date] |
