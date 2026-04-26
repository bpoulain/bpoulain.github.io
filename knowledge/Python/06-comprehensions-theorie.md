# 6. Compréhensions

## 6.1 Modèle mental

Une compréhension est une **expression** qui construit une collection en une ligne, en exprimant directement la logique de transformation et de filtrage. C'est la façon idiomatique Python de remplacer un `for` + `append`.

*Analogie :*
- `for` classique = construire un mur brique par brique
- Compréhension = commander un mur avec ses caractéristiques en une phrase

---

## 6.2 List comprehension

### 6.2.1 Forme de base

```python
# Boucle classique
carres = []
for x in range(1, 6):
    carres.append(x ** 2)

# List comprehension — identique
carres = [x ** 2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]
```

*Syntaxe :* `[expression for variable in iterable]`

### 6.2.2 Avec filtre

```python
# Boucle classique
pairs = []
for x in range(10):
    if x % 2 == 0:
        pairs.append(x)

# List comprehension avec filtre
pairs = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]
```

*Syntaxe :* `[expression for variable in iterable if condition]`

### 6.2.3 Avec transformation et filtre

```python
tokens = ["color-primary", "spacing-4", "color-surface", "font-size-base", "color-accent"]

# Tous les tokens couleur, en majuscules
couleurs = [t.upper() for t in tokens if t.startswith("color-")]
# ["COLOR-PRIMARY", "COLOR-SURFACE", "COLOR-ACCENT"]
```

### 6.2.4 Pont JS → Python

```python
composants = ["Button", "Input", "Card", "Modal"]

# JS : composants.map(c => c.toLowerCase())
# Python :
minuscules = [c.lower() for c in composants]

# JS : composants.filter(c => c.length > 4)
# Python :
longs = [c for c in composants if len(c) > 4]

# JS : composants.map(c => c.toLowerCase()).filter(c => c.length > 4)
# Python :
longs_min = [c.lower() for c in composants if len(c) > 4]
```

---

## 6.3 Dict comprehension

### 6.3.1 Forme de base

```python
noms = ["Button", "Input", "Card"]
tailles = [32, 40, 200]

# Dict avec zip
tailles_dict = {nom: taille for nom, taille in zip(noms, tailles)}
# {"Button": 32, "Input": 40, "Card": 200}

# Carré de chaque nombre
carres = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

### 6.3.2 Avec filtre et transformation

```python
config = {"color-primary": "#3B82F6", "spacing-4": "16px", "color-surface": "#FFF"}

# Extraire seulement les tokens couleur
couleurs = {k: v for k, v in config.items() if k.startswith("color-")}
# {"color-primary": "#3B82F6", "color-surface": "#FFF"}

# Inverser clé et valeur
inverse = {v: k for k, v in config.items()}
# {"#3B82F6": "color-primary", ...}
```

---

## 6.4 Set comprehension

```python
tokens = ["color-primary", "spacing-4", "color-surface", "spacing-4", "color-primary"]

# Set de préfixes uniques
prefixes = {t.split("-")[0] for t in tokens}
# {"color", "spacing"}
```

---

## 6.5 Expression génératrice (rappel §3)

Syntaxe identique à la list comprehension, mais entre parenthèses — évaluation paresseuse :

```python
# List comprehension — tout en mémoire
total = sum([x**2 for x in range(1000000)])

# Expression génératrice — une valeur à la fois
total = sum(x**2 for x in range(1000000))   # plus économe
```

*Règle :* quand le résultat n'est utilisé que dans un autre built-in (`sum`, `max`, `any`, `all`), préférer l'expression génératrice.

---

## 6.6 Compréhensions imbriquées

```python
# Matrice 3x3
matrice = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Aplatir la matrice
plat = [val for ligne in matrice for val in ligne]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Transposer
transpose = [[ligne[i] for ligne in matrice] for i in range(3)]
```

*Attention :* les compréhensions imbriquées sur plus de deux niveaux deviennent difficiles à lire. Privilégier une boucle classique si la lisibilité en pâtit.

---

## 6.7 Règles d'or des compréhensions

1. **Une seule transformation** par compréhension — si la logique est complexe, extraire dans une fonction.
2. **Pas d'effets de bord** — ne jamais faire `print()` ou modifier une variable externe dans une compréhension.
3. **Lisibilité avant concision** — si la compréhension nécessite plus de 80 caractères, la décomposer.
4. **`for` classique si l'intention est de construire avec des effets de bord** — append conditionnel complexe, logging, etc.

```python
# ✅ Lisible — one-liner justifié
noms_valides = [n for n in noms if n and isinstance(n, str)]

# ❌ Trop dense — utiliser une fonction
resultat = [f(x) for x in data if g(x) and h(x) and not i(x)]
```

---

## 6.8 Comparaison des paradigmes — §6

| Pattern JS moderne | Python idiomatique |
|---|---|
| `arr.map(x => f(x))` | `[f(x) for x in arr]` |
| `arr.filter(x => cond)` | `[x for x in arr if cond]` |
| `arr.map(f).filter(g)` | `[f(x) for x in arr if g(x)]` |
| `Object.fromEntries(arr.map(...))` | `{k: v for k, v in arr}` |
| `new Set(arr.map(f))` | `{f(x) for x in arr}` |
| `arr.reduce((acc, x) => acc + x, 0)` | `sum(x for x in arr)` ou `sum(arr)` |
| Générateur `function*` | `(x for x in iterable)` ou `def f(): yield ...` |
