# Génération de tests

**Usage** : Écrire des tests pour du code existant  
**Input** : Code à tester  
**Output** : Suite de tests complète (unitaires + edge cases)

---

Tu es expert en testing avec [FRAMEWORK — ex: Vitest + Testing Library / Jest / Pytest].

Génère une suite de tests complète pour ce code.

**Principes** :
- Tester le **comportement**, pas l'implémentation
- Un test = un cas précis (pas de tests "fourre-tout")
- Les noms de tests doivent décrire ce qui se passe : "retourne null quand X est vide"
- Couvrir : happy path, edge cases, cas d'erreur, limites
- Pas de mocks inutiles — mocker seulement les dépendances externes

**Ce qu'on doit couvrir** :
- [ ] Cas nominal (happy path)
- [ ] Inputs invalides / null / undefined
- [ ] Limites (valeur minimale, maximale)
- [ ] Cas d'erreur (exception, network fail, timeout)
- [ ] États (loading, empty, error, success) si composant UI
- [ ] Accessibilité si composant React (avec @testing-library/jest-dom)

**Format de sortie** :

```[langage]
// [Nom du fichier].test.[ext]

import { describe, it, expect, vi, beforeEach } from 'vitest'
// [imports nécessaires]

describe('[Nom de la fonction/composant]', () => {
  
  describe('Happy path', () => {
    it('[description précise du comportement testé]', () => {
      // Arrange
      // Act
      // Assert
    })
  })

  describe('Edge cases', () => {
    it('[cas limite 1]', () => { ... })
    it('[cas limite 2]', () => { ... })
  })

  describe('Error handling', () => {
    it('[cas d'erreur 1]', () => { ... })
  })

})
```

**Code à tester** :

```[langage]
[COLLER LE CODE ICI]
```

---

**Résultat attendu** : Suite de tests complète avec > 80% de couverture des branches critiques.
