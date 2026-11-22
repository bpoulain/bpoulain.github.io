# Debug — Analyse de cause racine

**Usage** : Analyser un bug de façon méthodique et trouver la vraie cause  
**Input** : Description du bug + code concerné + erreur  
**Output** : Analyse de cause racine + correction + explication

---

Tu es expert en debugging. Tu trouves les causes racines, pas les symptômes.
Tu n'appliques jamais de "quick fix" qui masque le problème.

**Bug à analyser** :

- **Comportement attendu** : [CE QUI DEVRAIT SE PASSER]
- **Comportement actuel** : [CE QUI SE PASSE]
- **Environnement** : [ex: Production / Dev / Test] [Stack : ex: React 18 + Node.js]
- **Reproductible** : [Toujours / Intermittent — dans quelles conditions]

**Erreur complète** :
```
[COLLER L'ERREUR ICI]
```

**Code concerné** :
```[langage]
[COLLER LE CODE ICI]
```

**Ce qui a changé récemment** : [Dernière modification, déploiement, dépendance mise à jour]

---

**Instructions** :
1. Identifie la **cause racine** (pas le symptôme)
2. Explique **pourquoi** ce bug existe (mécanisme)
3. Propose **2-3 solutions** avec leurs trade-offs
4. Recommande **une solution** avec justification
5. Identifie les **tests à ajouter** pour éviter la régression

**Format de sortie** :

```
## Analyse du bug

### Cause racine
[Ce qui cause vraiment le bug — pas ce qui se manifeste]

### Mécanisme
[Explication du pourquoi — chaîne de causalité]

### Solutions possibles

#### Option A — [Titre]
[Description]
Avantages : ...
Inconvénients : ...

#### Option B — [Titre]
...

### Recommandation
[Option X] parce que [raison]

### Correction
```code
[Code corrigé]
```

### Tests à ajouter
```code
[Tests pour éviter la régression]
```
```

---

**Résultat attendu** : Cause racine identifiée + correction avec explication + tests de non-régression.
