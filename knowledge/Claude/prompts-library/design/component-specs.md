# Specs d'un composant UI

**Usage** : Rédiger les specs complètes d'un composant UI avant développement  
**Input** : Brief ou description du composant + contexte design system  
**Output** : Specs complètes (états, interactions, accessibilité, props, questions engineering)

---

Tu es UX Engineer et Design System lead.
Tu rédiges des specs suffisamment précises pour que l'engineering puisse implémenter sans aller-retour.
Tu ne laisses aucun état non spécifié.

**Composant à spécifier** : [NOM DU COMPOSANT — ex: DatePicker, DataTable, Toast, Modal]

**Contexte** :
- **Design system** : [ex: Notre DS interne / Shadcn / Radix / MUI]
- **Stack** : [ex: React 18 + TypeScript + Tailwind]
- **Cas d'usage principal** : [Où et comment ce composant est utilisé]
- **Composants similaires existants** : [Si le DS a déjà quelque chose de proche]

**Brief design** :

[DESCRIPTION DU COMPOSANT — ce qu'il fait, qui l'utilise, dans quel contexte]

---

**Ce qu'il faut couvrir** :

```
## Specs — [NomDuComposant]

### Vue d'ensemble
[Description courte + cas d'usage principal]

### Props / API
| Prop | Type | Défaut | Requis | Description |
|------|------|--------|--------|-------------|
| [prop] | [type] | [défaut] | [Oui/Non] | [Description] |

### Variants
[Liste des variantes visuelles avec description]

### États
| État | Déclencheur | Comportement | Visuel |
|------|-------------|--------------|--------|
| Default | — | [Description] | [Description visuelle] |
| Hover | Survol souris | [Description] | [Description] |
| Focus | Tab / Click | [Description] | [Description] |
| Active | Click/Press | [Description] | [Description] |
| Disabled | `disabled={true}` | [Description] | [Description] |
| Loading | `isLoading={true}` | [Description] | [Description] |
| Error | [Condition] | [Description] | [Description] |
| Empty | [Condition] | [Description] | [Description] |

### Interactions & comportement
- [Interaction 1 — ex: "Clic en dehors du modal → ferme le modal"]
- [Interaction 2]
- [Keyboard navigation — Tab, Enter, Escape, Arrow keys]

### Accessibilité (WCAG 2.1 AA)
| Critère | Implémentation |
|---------|---------------|
| Rôle ARIA | `role="[...]"` |
| Label | `aria-label` ou `aria-labelledby` |
| État | `aria-expanded`, `aria-selected`, etc. |
| Focus trap | [Oui/Non — si Modal/Drawer] |
| Keyboard only | [Tous les cas d'usage accessibles au clavier] |
| Ratio de contraste | [≥ 4.5:1 texte normal, ≥ 3:1 texte large] |

### Design tokens utilisés
```tokens
color-primary-500: [valeur]
spacing-4: [valeur]
border-radius-md: [valeur]
shadow-lg: [valeur]
```

### Responsive
- Mobile (< 768px) : [Comportement spécifique]
- Tablette (768px - 1024px) : [Comportement spécifique]
- Desktop (> 1024px) : [Comportement par défaut]

### Edge cases
- [Cas limite 1 — ex: "texte de 200 caractères → troncature avec ..."]
- [Cas limite 2]

### Ce qui N'est PAS dans le scope
- [Exclusion 1 — pourquoi]
- [Exclusion 2]

### Questions pour l'engineering
- [ ] [Question technique non résolue]
- [ ] [Point à décider ensemble]

### Critères d'acceptance QA
- [ ] [Test QA précis et vérifiable]
- [ ] [Test accessibilité — Screen reader]
```

---

**Résultat attendu** : Specs complètes avec tous les états, interactions et questions résolues — zéro ambiguïté pour l'engineering.
