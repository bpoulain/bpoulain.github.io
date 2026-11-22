# 5. Built-ins Python — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : remplacer les méthodes JS par les built-ins Python idiomatiques.

```js
const scores = [78, 92, 45, 88, 63, 95, 51];

// Vérifications
const tousAdmis = scores.every(s => s >= 50);
const auMoinsUnExcellent = scores.some(s => s >= 90);

// Stats
const total = scores.reduce((acc, s) => acc + s, 0);
const min = Math.min(...scores);
const max = Math.max(...scores);

// Tri
const classeTop = [...scores].sort((a, b) => b - a).slice(0, 3);

console.log({ tousAdmis, auMoinsUnExcellent, total, min, max, classeTop });
```

**Question** : Traduis ce bloc complet en Python. Utilise les built-ins natifs — évite les boucles `for` explicites pour les tests et stats.

---

### Exercice 2 — Piège de paradigme

**Objectif** : distinguer `.sort()` (en place) et `sorted()` (nouvelle liste).

```python
composants_originaux = ["Card", "Button", "Modal", "Input"]
composants_tries = composants_originaux.sort()

print("Originaux :", composants_originaux)
print("Triés :", composants_tries)
```

**Question 2a** : Qu'affiche ce code ? Pourquoi `composants_tries` a-t-il une valeur inattendue ?

**Question 2b** : Comment obtenir une liste triée dans `composants_tries` **sans** modifier `composants_originaux` ?

---

### Exercice 3 — Mini cas réel

**Objectif** : produire un rapport de couverture de tokens avec des built-ins uniquement.

```python
tokens_disponibles = [
    "color-primary", "color-secondary", "color-surface",
    "spacing-2", "spacing-4", "spacing-8", "spacing-16",
    "font-size-sm", "font-size-base", "font-size-lg",
    "border-radius-sm", "border-radius-md"
]

tokens_utilises_composant = [
    "color-primary", "spacing-4", "font-size-base",
    "border-radius-md", "spacing-8"
]
```

Génère un rapport qui affiche :
1. Nombre total de tokens disponibles
2. Nombre de tokens utilisés par le composant
3. Taux de couverture en % (arrondi à 1 décimale)
4. Le token utilisé dont le nom est le plus long
5. Tous les tokens utilisés sont-ils dans la liste disponible ? (`True`/`False`)
6. Les tokens utilisés triés par ordre alphabétique

**Contrainte** : n'écris aucune boucle `for` explicite — utilise uniquement des built-ins.

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
Les built-ins Python (`any`, `all`, `sum`, `min`, `max`, `sorted`) acceptent directement des listes ou des expressions génératrices — pas besoin de callback dans une méthode de tableau.

#### Code Python propre

```python
scores = [78, 92, 45, 88, 63, 95, 51]

# Vérifications
tous_admis = all(s >= 50 for s in scores)
au_moins_un_excellent = any(s >= 90 for s in scores)

# Stats
total = sum(scores)
minimum = min(scores)
maximum = max(scores)

# Top 3 (tri décroissant, 3 premiers)
classe_top = sorted(scores, reverse=True)[:3]

print({
    "tous_admis": tous_admis,
    "au_moins_un_excellent": au_moins_un_excellent,
    "total": total,
    "min": minimum,
    "max": maximum,
    "classe_top": classe_top
})
```

#### Notes

- `all(s >= 50 for s in scores)` — l'expression génératrice évite de créer une liste intermédiaire.
- `sum(scores)` remplace `.reduce((acc, s) => acc + s, 0)` — beaucoup plus lisible.
- `sorted(..., reverse=True)[:3]` — tri + slice, pas besoin d'une variable intermédiaire.
- Pas de `Math.min(...scores)` : `min(scores)` accepte directement une liste.

---

### Correction Exercice 2

#### Ce qui s'affiche

```
Originaux : ['Button', 'Card', 'Input', 'Modal']
Triés : None
```

#### ❌ Ce que le cerveau fait
Supposer que `.sort()` retourne la liste triée, comme en JS (`arr.sort()` retourne le tableau).

#### ✅ Comment ça fonctionne réellement
`.sort()` trie **en place** et retourne `None`. L'original est modifié, mais rien n'est retourné.

#### Code corrigé

```python
composants_originaux = ["Card", "Button", "Modal", "Input"]

# Option 1 : sorted() — ne modifie pas l'original
composants_tries = sorted(composants_originaux)

# Option 2 : copie + .sort()
composants_tries = composants_originaux.copy()
composants_tries.sort()

print("Originaux :", composants_originaux)  # inchangé ✅
print("Triés :", composants_tries)          # trié ✅
```

---

### Correction Exercice 3

#### Code Python propre

```python
tokens_disponibles = [
    "color-primary", "color-secondary", "color-surface",
    "spacing-2", "spacing-4", "spacing-8", "spacing-16",
    "font-size-sm", "font-size-base", "font-size-lg",
    "border-radius-sm", "border-radius-md"
]

tokens_utilises_composant = [
    "color-primary", "spacing-4", "font-size-base",
    "border-radius-md", "spacing-8"
]

# 1. Nombre total de tokens disponibles
total = len(tokens_disponibles)

# 2. Nombre de tokens utilisés
utilises = len(tokens_utilises_composant)

# 3. Taux de couverture
taux = round(utilises / total * 100, 1)

# 4. Token utilisé le plus long
plus_long = max(tokens_utilises_composant, key=len)

# 5. Tous les tokens utilisés sont dans la liste disponible ?
tous_valides = all(t in tokens_disponibles for t in tokens_utilises_composant)

# 6. Tokens utilisés triés alphabétiquement
trie = sorted(tokens_utilises_composant)

print(f"Tokens disponibles : {total}")
print(f"Tokens utilisés : {utilises}")
print(f"Couverture : {taux}%")
print(f"Token le plus long : {plus_long}")
print(f"Tous valides : {tous_valides}")
print(f"Triés : {trie}")
```

#### Sortie

```
Tokens disponibles : 12
Tokens utilisés : 5
Couverture : 41.7%
Token le plus long : border-radius-md
Tous valides : True
Triés : ['border-radius-md', 'color-primary', 'font-size-base', 'spacing-4', 'spacing-8']
```

#### Notes

- `max(..., key=len)` utilise `len` comme fonction de comparaison — `len` est lui-même un built-in utilisé comme argument.
- `all(t in tokens_disponibles for t in ...)` — l'expression génératrice s'arrête au premier `False` (court-circuit).
- `t in tokens_disponibles` sur une liste est O(n). Pour de grands volumes, convertir en `set` : `set(tokens_disponibles)`.
