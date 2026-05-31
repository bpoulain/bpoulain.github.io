# Mission 04 — Full Cycle : Du problème au composant livrable

**Rôle** : Tous rôles (ou un seul en mode simulation)  
**Niveau** : Avancé  
**Durée estimée** : 6-8 heures  
**Objectif** : Simuler un cycle produit complet — Discovery → PRD → Design → Code → Livraison

---

## Contexte Pixio

Pixio lance une nouvelle initiative stratégique : **le mode Agence**.

Après avoir résolu le churn M3 (Missions 01-03), la CEO Léa Marchetti ouvre un nouveau front :

> *"30% de nos clients sont des freelances ou des agences qui gèrent plusieurs marques. Aujourd'hui ils ouvrent des comptes différents. C'est du churn volontaire — ils voudraient rester sur un seul compte mais ne peuvent pas. On perd aussi en MRR car ils prennent le plan Starter par marque. Il faut qu'on leur permette de gérer plusieurs 'espaces marque' dans un seul compte."*

**Signal business** :
- 380 clients identifiés comme "multi-marques" (via le support)
- 62 ont demandé explicitement cette feature via le feedback form
- Churn M6 de ce segment : 34% (vs 22% global) — ils partent vers Canva Teams
- Potentiel de conversion Starter → Pro si feature disponible : estimé à 140 comptes (+12 460€ MRR)

---

## Structure de la mission

Cette mission est divisée en 4 phases. Chaque phase correspond à un rôle. Tu peux :
- **Option A** : Faire les 4 phases dans l'ordre (simulation complète)
- **Option B** : Choisir uniquement la phase de ton rôle principal et utiliser les outputs des autres phases comme inputs (fournis ci-dessous)

---

## Phase 1 — PM : Discovery & PRD (1h30-2h)

### Brief
Produire le PRD complet du **mode Agence** de Pixio.

### Inputs disponibles
- Brief CEO ci-dessus
- Signal business (380 clients identifiés, 62 demandes explicites)
- Interviews à synthétiser : les interviews de la Mission 01 contiennent des données pertinentes (Thomas freelance multi-clients, Julie CM 6 marques)

### Étapes
1. **Synthèse discovery** — Extraire les insights "multi-marques" des interviews existantes
2. **Problem framing** — Formuler le vrai problème (pas "ajouter des workspaces")
3. **Story mapping** — Cartographier le parcours utilisateur actuel vs cible
4. **PRD complet** — Rédiger le PRD avec métriques, user stories, risques
5. **Engineering review** — Faire reviewer le PRD par Claude en mode engineering lead

**Prompts** :
- `discovery/interview-synthesis.md`
- `discovery/problem-framing.md`
- `discovery/user-story-mapping.md`
- `writing/prd-from-notes.md`
- `review/prd-engineering-review.md`

**Output attendu** : `output-mission-04/prd-mode-agence.md`

---

## Phase 2 — Planning : Stories & Sprint (30-45 min)

### Brief
Découper le PRD en stories et planifier le sprint.

### Input
Utiliser le PRD de la Phase 1 (ou l'output fourni ci-dessous si tu sautes la Phase 1).

<details>
<summary>📄 PRD résumé (si tu sautes la Phase 1)</summary>

**Feature** : Mode Agence — Multi-Brand Workspaces

**Problem statement** : Les freelances et agences qui gèrent 3+ marques clientes ne peuvent pas organiser leurs visuels par marque dans un seul compte Pixio. Ils ouvrent plusieurs comptes (friction, coût) ou partent vers des concurrents avec cette fonctionnalité.

**Solution** : Permettre à un utilisateur Pro de créer jusqu'à 10 "Espaces Marque" au sein d'un seul compte, chacun avec son Brand Kit propre, ses templates et ses collaborateurs.

**Métriques de succès** :
- Churn M6 segment multi-marques : 34% → 20%
- Conversion Starter → Pro sur ce segment : +80 comptes
- CSAT feature : > 4.2/5 dans les 60 premiers jours

**User stories clés** :
- US-A01 : Créer un espace marque avec nom et logo
- US-A02 : Configurer un Brand Kit par espace marque
- US-A03 : Switcher entre espaces marque depuis la nav principale
- US-A04 : Inviter des collaborateurs par espace marque (pas au niveau compte)
- US-A05 : Archiver un espace marque (sans supprimer les visuels)

**Contraintes** : Feature réservée au plan Pro — pas sur Starter.
</details>

### Étapes
1. **Découpage en stories** — MVP vs V2 clair
2. **Estimations** — Forcer l'équipe à penser en effort, pas en temps
3. **Capacity planning** — Équipe Pixio : 2 frontend, 1 backend, 1 designer (ce sprint = 10 jours ouvrés)
4. **Sprint backlog** — Ce qui entre dans le sprint, ce qui est reporté

**Prompts** :
- `planning/prd-to-stories.md`
- `planning/capacity-planning.md`

**Output attendu** : `output-mission-04/sprint-backlog.md`

---

## Phase 3 — Design : Specs & Handoff (1h30-2h)

### Brief
Designer le **Brand Switcher** — le composant de navigation entre espaces marque.

### Input
Utiliser le PRD Phase 1 et les stories Phase 2 (ou les résumés fournis dans la Phase 2).

### Composant à spécifier : BrandSwitcher

**Description** : Composant visible dans la navigation principale (sidebar gauche) permettant de switcher d'un espace marque à l'autre. Doit afficher l'espace actif, permettre de switcher rapidement, et d'en créer un nouveau.

**Comportement attendu** :
- Affiche le logo + nom de l'espace actif dans la sidebar
- Au clic → dropdown avec liste des espaces marque (max 10)
- Chaque item de la liste : logo + nom + nombre de visuels
- En bas de la liste : "+ Créer un espace marque" (si < 10)
- Si > 5 espaces : scroll interne dans le dropdown
- Keyboard : Arrow Up/Down pour naviguer, Enter pour sélectionner, Escape pour fermer

### Étapes
1. **Specs du composant** — Tous les états, props, accessibilité
2. **Review UX** — Le switcher est-il intuitif ? Respecte les heuristiques ?
3. **Design tokens** — Quels tokens utiliser (issus du DS Pixio)
4. **Handoff engineering** — Document complet avec valeurs exactes

**Prompts** :
- `design/component-specs.md`
- `review/ux-flow-review.md`
- `design/token-extraction.md`
- `design/engineering-handoff.md`

**Output attendu** : `output-mission-04/specs-brand-switcher.md` + `output-mission-04/handoff-brand-switcher.md`

---

## Phase 4 — Builder : Implémentation (2h-3h)

### Brief
Implémenter le composant BrandSwitcher.

### Inputs
- Specs de la Phase 3 (ou résumé ci-dessous)
- Stack Pixio : React 18 + TypeScript + Tailwind

<details>
<summary>📄 Specs résumées (si tu sautes la Phase 3)</summary>

**Composant** : BrandSwitcher

**Props** :
```typescript
interface BrandSwitcherProps {
  brands: Brand[];
  activeBrandId: string;
  onBrandSelect: (brandId: string) => void;
  onCreateBrand: () => void;
  maxBrands?: number; // default: 10
}

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  assetsCount: number;
}
```

**États** :
- Fermé (affiche l'espace actif)
- Ouvert (dropdown visible, liste scrollable si > 5)
- Création (loading après clic "+ Créer")
- Un seul espace (pas de dropdown — affiche juste le nom)
- Limite atteinte (10/10 — pas de bouton créer)

**Accessibilité** :
- `role="combobox"` sur le trigger
- `aria-expanded` + `aria-haspopup="listbox"`
- `role="listbox"` + `role="option"` sur les items
- `aria-selected` sur l'option active
- Focus trap dans le dropdown ouvert

**Animations** :
- Dropdown : fade in + slide down (150ms ease-out)
- Switch : flash subtle sur le trigger (100ms)
</details>

### Étapes
1. **Architecture** — Identifier les sous-composants avant de coder
2. **Types TypeScript** — Interfaces complètes
3. **Composant principal** — BrandSwitcher.tsx avec tous les états
4. **Tests** — Comportement, keyboard nav, accessibilité
5. **Storybook** — Stories pour chaque état et variant
6. **Code review** — Review par Claude avant livraison

**Skill** : `starter-kit/.claude/skills/component-generator.md`

**Prompts** :
- `code/code-review.md`
- `code/test-generation.md`

**Output attendu** :
- `output-mission-04/BrandSwitcher.tsx`
- `output-mission-04/BrandSwitcher.test.tsx`
- `output-mission-04/BrandSwitcher.stories.tsx`

---

## Livrable final

Un dossier `missions/output-mission-04/` avec :
- `prd-mode-agence.md` — PRD complet
- `sprint-backlog.md` — Stories + capacity plan
- `specs-brand-switcher.md` — Specs design
- `handoff-brand-switcher.md` — Handoff engineering
- `BrandSwitcher.tsx` — Composant React
- `BrandSwitcher.test.tsx` — Tests
- `BrandSwitcher.stories.tsx` — Storybook

---

## Auto-évaluation (cycle complet)

| Phase | Critère | Oui | Partiel | Non |
|-------|---------|-----|---------|-----|
| PM | Problem statement non-symptôme | | | |
| PM | PRD avec métriques mesurables | | | |
| Planning | MVP vs V2 clairement séparé | | | |
| Planning | Capacity plan réaliste (marge 20%) | | | |
| Design | Tous les états documentés | | | |
| Design | Accessibilité définie dès les specs | | | |
| Builder | TypeScript strict, zéro `any` | | | |
| Builder | Tests comportementaux (pas implementation) | | | |
| Général | Cohérence entre les phases | | | |
| Général | Terminé en < 8h | | | |

**Score** : `/10`

---

## Réflexion finale

Après la mission, répondre à ces questions dans `output-mission-04/retrospective.md` :
1. Quelle phase a été la plus longue ? Pourquoi ?
2. À quel moment Claude Code a été le plus utile ?
3. Qu'est-ce que tu aurais fait différemment ?
4. Quels prompts as-tu modifiés / adaptés pour mieux correspondre à ton contexte ?
5. Qu'est-ce qui est directement réutilisable dans ton travail réel ?

---

## Ressources

Tous les prompts de la bibliothèque + tous les skills du starter-kit + tous les exemples de `/examples/`.
