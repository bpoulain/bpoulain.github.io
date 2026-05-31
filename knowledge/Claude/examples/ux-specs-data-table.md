# Specs UX — Composant DataTable

**Auteur** : Ana Santos (Product Designer) + Claude Code (skill ux-reviewer)  
**Date** : 2026-05-10  
**PRD de référence** : prd-analytics-dashboard-v3.md  
**Statut** : Approved — prêt pour engineering

> **Note** : Ceci est un exemple de specs UX complètes pour un composant complexe.
> Généré avec le skill `ux-reviewer` + validation designer.

---

## Description du composant

Le composant `DataTable` affiche des données tabulaires paginées avec tri par colonne et filtrage global. Il est utilisé dans les sections "Events", "Users" et "Funnel" du dashboard analytics.

---

## Anatomie du composant

```
┌─────────────────────────────────────────────┐
│ [Titre optionnel]             [Filtre global]│  ← Header
├──────────┬──────────┬─────────┬─────────────┤
│ Col A ↑↓ │ Col B ↑↓ │ Col C   │ Actions     │  ← Header de colonnes
├──────────┼──────────┼─────────┼─────────────┤
│ data     │ data     │ data    │ [btn] [btn] │  ← Row
│ data     │ data     │ data    │ [btn] [btn] │
│ data     │ data     │ data    │ [btn] [btn] │
├──────────┴──────────┴─────────┴─────────────┤
│ 1-10 sur 247 résultats   ← [1] [2] [3] →   │  ← Footer / Pagination
└─────────────────────────────────────────────┘
```

---

## États

### État : Default (données chargées)

**Visuel** : Tableau complet avec header, rows et pagination.

**Comportement** :
- Les colonnes déclarées `sortable` affichent les icônes `↑↓` (gris neutre)
- Hover sur une row : background `surface-hover` (subtle highlight)
- Hover sur une colonne triable : icône `↑↓` passe en `text-primary`
- Le filtre est vide, placeholder "Rechercher..."

---

### État : Chargement (loading)

**Visuel** : Skeleton animation à la place des rows.

**Comportement** :
- Header de colonnes visible (permet de comprendre la structure)
- 5 rows de skeleton (hauteur fixe = hauteur d'une row réelle)
- Animation : pulse de gauche à droite, 1.5s loop
- Filtre et tri désactivés (opacity 0.5, `pointer-events: none`)
- Pas de spinner centré — le skeleton suffit

**Accessibilité** :
- `aria-busy="true"` sur le tableau
- `aria-label="Chargement des données..."` sur la zone skeleton

---

### État : Vide (empty state)

**Déclencheur** : Requête réussie mais 0 résultats

**Visuel** : Illustration + message contextuel centré dans la zone du tableau.

**Contenu** :
- Illustration (SVG, ~80px) : table avec loupe
- Titre : "Aucun résultat"
- Sous-titre contextuel selon le contexte :
  - Si filtre actif : "Aucun résultat pour "[terme]" — essayez un autre terme"
  - Si période sélectionnée vide : "Aucune donnée sur cette période"
  - Par défaut : "Aucune donnée disponible pour le moment"
- CTA optionnel (si filtre actif) : bouton "Effacer le filtre"

**Accessibilité** :
- `role="status"` sur le container de l'état vide
- `aria-live="polite"` pour annoncer le changement d'état

---

### État : Erreur (error state)

**Déclencheur** : Échec de la requête (réseau, serveur 5xx, timeout)

**Visuel** : Icône erreur + message + bouton de retry centré.

**Contenu** :
- Icône : triangle alerte (couleur `text-error`)
- Titre : "Impossible de charger les données"
- Message : "Une erreur est survenue. Vérifiez votre connexion ou réessayez."
- CTA : Bouton "Réessayer" (primary)
- Si l'erreur persiste : afficher "Contacter le support" (lien texte)

**Comportement** :
- Bouton "Réessayer" relance la requête
- Afficher un indicateur de chargement pendant le retry
- Conserver les données précédentes si disponibles (ne pas vider l'interface)

---

### État : Tri actif

**Déclencheur** : Clic sur un header de colonne triable

**Visuel** :
- Colonne triée : background header `surface-active`, icône `↑` ou `↓` (selon direction) en `text-primary`
- Un seul tri actif à la fois (clic sur une autre colonne remplace)
- Ordre : premier clic = ASC, deuxième clic = DESC, troisième clic = reset (pas de tri)

**Accessibilité** :
- `aria-sort="ascending"` ou `"descending"` sur le `<th>` actif
- `aria-sort="none"` sur les autres colonnes triables
- Annonce verbale : "Trié par [Nom colonne], ordre croissant"

---

### État : Filtre actif

**Déclencheur** : Saisie dans le champ de filtre global

**Visuel** :
- Filtre : icône "x" apparaît pour effacer
- Debounce : 300ms avant de déclencher le filtre (pas de requête à chaque frappe)
- Les rows qui ne matchent pas disparaissent
- Le compte de résultats se met à jour : "14 sur 247 résultats"

**Comportement edge cases** :
- Filtre avec espaces uniquement : trim silencieux, pas de requête
- Filtre < 2 caractères : ne pas déclencher de requête
- Filtre avec caractères spéciaux : encoder correctement, pas de crash

---

### État : Sélection (si activée)

**Déclencheur** : Clic sur checkbox d'une row (si prop `selectable` activée)

**Visuel** :
- Checkbox dans première colonne
- Row sélectionnée : background `surface-selected`
- Header : checkbox "tout sélectionner" (indéterminé si sélection partielle)
- Barre d'actions apparaît en bas : "[N] sélectionnés — [Action] [Action]"

---

## Interactions

### Navigation clavier

| Touche | Action |
|--------|--------|
| `Tab` | Passer de header → filtre → colonnes → pagination |
| `Enter` / `Space` | Activer le tri sur une colonne focusée |
| `←` `→` | Naviguer entre les headers de colonne |
| `↑` `↓` | Naviguer entre les rows (si `interactive`) |
| `Escape` | Effacer le filtre si focus dans le filtre |

### Pagination

- Flèches prev/next + numéros de pages visibles (max 7 avant ellipsis)
- Page courante : bouton disabled, style distinct
- Si 1 page uniquement : pagination masquée (ne pas afficher "Page 1 sur 1")
- Changement de page : retour en haut du tableau automatiquement

---

## Accessibilité WCAG 2.1 AA

| Critère | Implémentation |
|---------|---------------|
| 1.3.1 Info and Relationships | `<table>`, `<th>`, `<td>` sémantiques |
| 1.4.3 Contrast | Texte ≥ 4.5:1, éléments UI ≥ 3:1 |
| 2.1.1 Keyboard | Navigation clavier complète |
| 2.4.6 Headings and Labels | Labels explicites sur toutes les colonnes |
| 3.2.2 On Input | Pas de changement de contexte inattendu |
| 4.1.2 Name, Role, Value | ARIA roles corrects (table, columnheader, rowheader) |
| 4.1.3 Status Messages | États chargement/erreur/vide annoncés via `aria-live` |

---

## Design Tokens utilisés

| Token | Usage |
|-------|-------|
| `color.surface.default` | Background du tableau |
| `color.surface.hover` | Hover sur les rows |
| `color.surface.selected` | Row sélectionnée |
| `color.surface.active` | Header de colonne triée |
| `color.text.primary` | Texte principal, icône de tri active |
| `color.text.secondary` | Texte secondaire, compteur de résultats |
| `color.text.error` | Messages d'erreur |
| `color.border.default` | Bordures de tableau |
| `spacing.4` | Padding des cellules |
| `radius.md` | Border-radius du container |

---

## Props attendues (pour les engineers)

```typescript
interface DataTableProps {
  // Données
  data: Record<string, unknown>[];
  columns: ColumnDef[];
  
  // Pagination
  pageSize?: number;           // défaut: 10
  totalCount: number;          // total pour la pagination serveur
  onPageChange: (page: number) => void;
  
  // Tri
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void;
  
  // Filtre
  onFilterChange?: (filter: string) => void;
  filterDebounceMs?: number;   // défaut: 300
  
  // États
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  
  // Sélection
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  
  // Accessibilité
  caption?: string;            // Description pour les lecteurs d'écran
  'aria-label'?: string;
}

interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}
```

---

## Checklist QA (pour les engineers)

### Fonctionnel
- [ ] Le tri ASC/DESC/reset fonctionne sur toutes les colonnes `sortable`
- [ ] Le filtre se déclenche après 300ms de debounce
- [ ] La pagination fonctionne (prev, next, page directe)
- [ ] La sélection multiple fonctionne avec "tout sélectionner"
- [ ] L'état vide s'affiche correctement avec et sans filtre
- [ ] L'état d'erreur affiche le bouton "Réessayer" fonctionnel
- [ ] Le skeleton s'affiche pendant le chargement

### Accessibilité
- [ ] Navigation clavier complète sans souris
- [ ] `aria-sort` se met à jour lors du tri
- [ ] `aria-busy` présent pendant le chargement
- [ ] `aria-live` annonce les changements d'état
- [ ] Contraste vérifié avec Lighthouse ou Axe

### Responsive
- [ ] Le tableau est scrollable horizontalement sur mobile (pas de layout break)
- [ ] La pagination reste utilisable sur petit écran
- [ ] Le filtre est accessible sur mobile

---

## Questions ouvertes pour l'engineering

| Question | Priorité | Notes |
|----------|----------|-------|
| Tri côté serveur ou client ? | P1 — bloquant | Dépend du volume de données. Si > 1000 rows : serveur obligatoire |
| Virtualisation des rows (react-virtual) ? | P2 | À étudier si > 500 rows visibles simultanément |
| Export CSV — dans ce composant ou composant séparé ? | P2 | PM préfère composant séparé |
