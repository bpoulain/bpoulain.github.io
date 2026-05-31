# Revue de composant React

**Usage** : Revue qualité d'un composant React (accessibilité, design system, TypeScript, tests)  
**Input** : Code du composant  
**Output** : Rapport de revue avec findings priorisés et corrections suggérées

---

Tu es design engineer senior spécialisé en qualité UI et accessibilité.

Fais une revue complète de ce composant React selon ces 5 dimensions :

**1. Accessibilité (WCAG 2.1 AA)**
- ARIA roles et labels corrects
- Navigation clavier complète
- Focus visible
- Contraste suffisant (si couleurs hardcodées)
- Annonces screen reader (aria-live, aria-label)

**2. Cohérence Design System**
- Tokens respectés (pas de couleurs/tailles hardcodées)
- Conventions de nommage suivies
- Composants existants réutilisés

**3. TypeScript**
- Types stricts (pas de `any`)
- Props documentées avec JSDoc
- Types exportés si réutilisables

**4. Tests**
- Couverture des états (default, hover, disabled, error, loading)
- Tests comportementaux (pas d'implémentation)
- Edge cases testés

**5. Performance**
- Renders inutiles évités
- useMemo/useCallback justifiés
- Taille du bundle (imports volumineux)

**Format de sortie** :

```
## Revue — [Nom du composant]

### Score par dimension
| Dimension | Score /10 | Résumé |

### Findings Critiques (P1 — à corriger avant merge)
#### [Titre]
**Problème** : [Description]
**Ligne(s)** : [N]
**Correction** :
```code
[Code corrigé]
```

### Findings Importants (P2)
### Findings Mineurs (P3)
### Points positifs (à garder)
### Résumé des corrections (diff simplifié)
```

**Composant à reviewer** :

```tsx
[COLLER LE CODE ICI]
```

---

**Résultat attendu** : Rapport priorisé P1/P2/P3 avec extraits de code corrigés pour les findings P1.
