# Extraction de tokens Figma → Code

**Usage** : Extraire et structurer les design tokens depuis Figma vers le code  
**Input** : Variables Figma (couleurs, typographie, espacements) + stack cible  
**Output** : Fichiers de tokens prêts à intégrer (CSS variables, JS/TS, Tailwind config)

---

Tu es Design Engineer expert en design tokens et systèmes de design.
Tu transformes les valeurs Figma en tokens structurés, sémantiques et maintenables.
Tu distingues les tokens primitifs (valeurs brutes) des tokens sémantiques (rôles).

**Stack cible** : [CHOISIR — CSS Variables / Tailwind config / Style Dictionary / JS/TS tokens]

**Variables Figma à convertir** :

```
[COLLER LES VARIABLES FIGMA ICI — ex: copier-coller depuis Figma Variables panel]

Exemple de format d'entrée :
Colors/Primary/50: #EFF6FF
Colors/Primary/100: #DBEAFE
Colors/Primary/500: #3B82F6
Colors/Primary/900: #1E3A5F

Text/Heading/XL: 32px / 600 / 40px
Text/Body/MD: 16px / 400 / 24px

Spacing/4: 16px
Spacing/6: 24px

Border Radius/SM: 4px
Border Radius/MD: 8px
Border Radius/LG: 12px
```

**Tokens sémantiques à créer** (mapping fonctionnel) :
- `color-primary` → [Colors/Primary/500]
- `color-background` → [Colors/Gray/50]
- `color-text-default` → [Colors/Gray/900]
- `color-text-muted` → [Colors/Gray/500]
- `color-danger` → [Colors/Red/500]
- `color-success` → [Colors/Green/500]

---

**Format de sortie attendu** :

```
## Tokens extraits

### CSS Custom Properties (variables.css)
```css
:root {
  /* Tokens primitifs */
  --color-primary-50: #EFF6FF;
  --color-primary-500: #3B82F6;
  
  /* Tokens sémantiques */
  --color-brand: var(--color-primary-500);
  --color-background: var(--color-gray-50);
  --color-text: var(--color-gray-900);
  --color-text-muted: var(--color-gray-500);
  
  /* Typographie */
  --font-size-xl: 32px;
  --line-height-xl: 40px;
  --font-weight-semibold: 600;
  
  /* Espacements */
  --spacing-4: 16px;
  --spacing-6: 24px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
}
```

### Tailwind config (tailwind.config.ts)
```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
        }
      },
      fontSize: {
        'heading-xl': ['32px', { lineHeight: '40px', fontWeight: '600' }],
      },
      spacing: {
        '4': '16px',
      },
      borderRadius: {
        'md': '8px',
      }
    }
  }
}
```

### TypeScript tokens (tokens.ts)
```typescript
export const tokens = {
  colors: {
    primary: { 50: '#EFF6FF', 500: '#3B82F6' },
    semantic: {
      brand: 'var(--color-brand)',
      background: 'var(--color-background)',
    }
  },
  spacing: { 4: '16px', 6: '24px' },
  fontSize: { xl: '32px', md: '16px' },
} as const;
```

### Tokens manquants ou incohérences détectées
- [Token manquant — ex: "Pas de token pour les ombres (box-shadow)"]
- [Incohérence — ex: "2 valeurs différentes pour le même rôle sémantique"]

### Recommandations
- [Conseil — ex: "Ajouter des tokens pour dark mode dès maintenant"]
```

---

**Résultat attendu** : Tokens structurés en 2 niveaux (primitifs + sémantiques), prêts à intégrer dans la stack, avec les incohérences Figma signalées.
