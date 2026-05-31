# Bibliothèque de Prompts

33 prompts prêts à l'emploi, classés par cas d'usage.

## Comment utiliser

1. Trouvez le prompt dans la catégorie correspondante
2. Copiez-le dans Claude Code
3. Remplacez les `[VARIABLES]` par votre contexte
4. Adaptez si besoin

**Conseil** : Les meilleurs prompts sont ceux que vous adaptez à votre contexte dans votre CLAUDE.md. Un prompt générique bien placé vaut moins qu'un prompt médiocre avec le bon contexte.

## Index par catégorie

| Catégorie | Dossier | Prompts |
|-----------|---------|---------|
| Discovery & Research | `discovery/` | 6 |
| Rédaction | `writing/` | 7 |
| Review & Critique | `review/` | 5 |
| Planning & Priorisation | `planning/` | 5 |
| Code & Technique | `code/` | 5 |
| Design | `design/` | 5 |
| **Total** | | **33** |

---

## Discovery & Research — `discovery/`

| Fichier | Usage |
|---------|-------|
| `interview-synthesis.md` | Synthétiser des interviews utilisateurs en insights structurés |
| `competitor-deep-dive.md` | Analyse concurrentielle approfondie (forces, faiblesses, positionnement) |
| `problem-framing.md` | Reformuler un problème flou via les 5 Pourquoi |
| `market-sizing.md` | Calculer TAM / SAM / SOM bottom-up et top-down |
| `user-story-mapping.md` | Cartographier le parcours utilisateur (méthode Jeff Patton) |
| `hypothesis-tree.md` | Arbre d'opportunités (méthode Teresa Torres / OST) |

## Rédaction — `writing/`

| Fichier | Usage |
|---------|-------|
| `prd-from-notes.md` | Générer un PRD structuré depuis des notes en vrac |
| `release-notes.md` | Rédiger des release notes utilisateurs depuis un changelog technique |
| `executive-summary.md` | Résumé exécutif 300 mots pour CEO / investisseurs |
| `job-stories.md` | Rédiger des Job Stories (format Alan Klement) |
| `onboarding-email.md` | Séquence d'emails onboarding (3-5 emails avec déclencheurs) |
| `feature-announcement.md` | Annoncer une feature (in-app / email / blog / social) |
| `internal-brief.md` | Brief d'alignement interne (décision / kick-off / post-mortem) |

## Review & Critique — `review/`

| Fichier | Usage |
|---------|-------|
| `prd-engineering-review.md` | Simuler une revue Engineering Lead sur un PRD (score /10) |
| `react-component-review.md` | Revue de composant React (a11y, DS, TS, tests, perf) |
| `ux-flow-review.md` | Review UX selon les 10 heuristiques de Nielsen |
| `copy-review.md` | Review de copy UX (clarté, action, ton, longueur) |
| `accessibility-audit.md` | Audit accessibilité WCAG 2.1 AA (HTML/JSX) |

## Planning & Priorisation — `planning/`

| Fichier | Usage |
|---------|-------|
| `backlog-prioritization.md` | Prioriser un backlog avec RICE |
| `prd-to-stories.md` | Découper un PRD en user stories (MVP vs V2) |
| `sprint-retrospective.md` | Préparer une rétrospective (3 actions max avec owners) |
| `okr-definition.md` | Rédiger des OKRs (méthode Doerr, ambition 70%) |
| `capacity-planning.md` | Planifier la capacité d'équipe pour un sprint / trimestre |

## Code & Technique — `code/`

| Fichier | Usage |
|---------|-------|
| `debug-root-cause.md` | Analyser un bug pour trouver la cause racine (pas le symptôme) |
| `test-generation.md` | Générer des tests complets (Vitest + Testing Library) |
| `refactoring.md` | Refactorer du code sans changer le comportement |
| `api-integration.md` | Implémenter une intégration API robuste (retry, erreurs, types) |
| `code-review.md` | Code review structurée (Bloquant / Important / Suggestion) |

## Design — `design/`

| Fichier | Usage |
|---------|-------|
| `component-specs.md` | Specs complètes d'un composant UI (états, props, a11y) |
| `engineering-handoff.md` | Document de passation design → engineering |
| `design-system-audit.md` | Audit d'un design system (score par dimension + roadmap) |
| `token-extraction.md` | Extraire les tokens Figma → CSS / Tailwind / TS |
| `ux-audit.md` | Évaluation heuristique UX complète (10 heuristiques de Nielsen) |

---

## Index rapide par besoin

| Je veux... | Prompt |
|-----------|--------|
| Synthétiser des interviews | `discovery/interview-synthesis.md` |
| Analyser un concurrent | `discovery/competitor-deep-dive.md` |
| Reformuler un problème | `discovery/problem-framing.md` |
| Estimer un marché | `discovery/market-sizing.md` |
| Générer un PRD | `writing/prd-from-notes.md` |
| Rédiger des release notes | `writing/release-notes.md` |
| Annoncer une feature | `writing/feature-announcement.md` |
| Aligner mon équipe | `writing/internal-brief.md` |
| Faire reviewer un PRD | `review/prd-engineering-review.md` |
| Reviewer un composant React | `review/react-component-review.md` |
| Auditer l'accessibilité | `review/accessibility-audit.md` |
| Prioriser un backlog | `planning/backlog-prioritization.md` |
| Découper un PRD | `planning/prd-to-stories.md` |
| Planifier la capacité | `planning/capacity-planning.md` |
| Debugger un bug | `code/debug-root-cause.md` |
| Générer des tests | `code/test-generation.md` |
| Refactorer du code | `code/refactoring.md` |
| Intégrer une API | `code/api-integration.md` |
| Faire une code review | `code/code-review.md` |
| Spécifier un composant | `design/component-specs.md` |
| Préparer un handoff | `design/engineering-handoff.md` |
| Extraire des tokens Figma | `design/token-extraction.md` |
| Auditer l'UX | `design/ux-audit.md` |

---

## Format de chaque prompt

Chaque fichier de prompt suit ce format :
```
# Nom du prompt
Usage / Input / Output
---
[Le prompt complet avec [VARIABLES]]
---
Résultat attendu
```
