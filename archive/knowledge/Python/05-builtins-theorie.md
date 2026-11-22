# 5. Built-ins Python

## 5.1 Modèle mental

Python embarque un arsenal de fonctions natives puissantes, disponibles **sans import**. Avant d'écrire une boucle, demande-toi toujours : *"Est-ce qu'un built-in ne fait pas déjà ça ?"*

*Analogie :*
- **JS vanilla** : `Math.max()`, `Array.isArray()`, `parseInt()` — quelques utilitaires éparpillés
- **Python** : une boîte à outils beaucoup plus dense, intégrée au langage — `len`, `sum`, `sorted`, `map`, `filter`, `min`, `max`, `any`, `all`, `zip`, `enumerate`...

---

## 5.2 Opérations numériques et de mesure

### 5.2.1 `len()` — longueur

```python
len([1, 2, 3])          # 3
len("design system")    # 13
len({"a": 1, "b": 2})  # 2
len((10, 20, 30))       # 3
len({1, 2, 3, 4})       # 4
```

Fonctionne sur toutes les séquences et collections.

### 5.2.2 `sum()` — somme

```python
nombres = [4, 8, 15, 16, 23]
sum(nombres)           # 66

# Avec valeur de départ (start)
sum(nombres, 100)      # 166 (100 + 66)

# Avec des floats
sum([1.5, 2.5, 3.0])  # 7.0
```

### 5.2.3 `min()` et `max()`

```python
nombres = [4, 8, 15, 16, 23, 42]
min(nombres)   # 4
max(nombres)   # 42

# Avec une clé de comparaison
composants = [
    {"nom": "Button", "taille": 32},
    {"nom": "Card", "taille": 200},
    {"nom": "Input", "taille": 40},
]
min(composants, key=lambda c: c["taille"])  # {"nom": "Button", "taille": 32}
max(composants, key=lambda c: c["taille"])  # {"nom": "Card", "taille": 200}

# Sur plusieurs arguments (pas seulement des listes)
min(3, 1, 4, 1, 5)   # 1
max(10, 20, 5)       # 20
```

### 5.2.4 `abs()`, `round()`, `pow()`

```python
abs(-15)          # 15
abs(3.7)          # 3.7
round(3.14159, 2) # 3.14
round(3.5)        # 4
pow(2, 10)        # 1024 (équivalent à 2**10)
```

---

## 5.3 Tri et ordre

### 5.3.1 `sorted()` — nouvelle liste triée

```python
nombres = [3, 1, 4, 1, 5, 9, 2, 6]
trie = sorted(nombres)           # [1, 1, 2, 3, 4, 5, 6, 9] — nouvelle liste
trie_inverse = sorted(nombres, reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Trier des strings (ordre lexicographique)
mots = ["banane", "apple", "cerise"]
sorted(mots)         # ["apple", "banane", "cerise"]

# Trier avec une clé
composants = [
    {"nom": "Card", "taille": 200},
    {"nom": "Button", "taille": 32},
    {"nom": "Input", "taille": 40},
]
sorted(composants, key=lambda c: c["taille"])
# [{"nom": "Button", ...}, {"nom": "Input", ...}, {"nom": "Card", ...}]

# Trier par nom (string)
sorted(composants, key=lambda c: c["nom"])
```

*`sorted()` ne modifie pas l'original* — elle retourne une nouvelle liste. Utiliser `.sort()` pour trier en place.

### 5.3.2 `reversed()` — itérateur inversé

```python
nombres = [1, 2, 3, 4, 5]
list(reversed(nombres))   # [5, 4, 3, 2, 1]

# Plus Pythonic pour une nouvelle liste inversée :
nombres[::-1]
```

---

## 5.4 Tests booléens

### 5.4.1 `any()` — au moins un True

```python
resultats = [False, False, True, False]
any(resultats)   # True — au moins un True

# Pattern idiomatique : tester une condition sur une collection
composants = ["Button", "Input", "Card"]
any(c.startswith("B") for c in composants)   # True
```

### 5.4.2 `all()` — tous True

```python
scores = [85, 90, 78, 92]
all(s >= 70 for s in scores)   # True — tous >= 70

tokens = ["color-primary", "color-surface", "spacing-4"]
all(t.startswith("color-") for t in tokens)   # False
```

### 5.4.3 `bool()`, `int()`, `str()`, `float()` — conversions

```python
bool(0)        # False
bool("")       # False
bool([])       # False
bool(None)     # False
bool(1)        # True
bool("texte")  # True
bool([1])      # True

int("42")      # 42
float("3.14")  # 3.14
str(42)        # "42"
```

---

## 5.5 Manipulation de séquences

### 5.5.1 `range()` — séquence de nombres

```python
range(5)          # 0, 1, 2, 3, 4
range(1, 6)       # 1, 2, 3, 4, 5
range(0, 10, 2)   # 0, 2, 4, 6, 8
range(10, 0, -1)  # 10, 9, 8, ..., 1

list(range(5))    # [0, 1, 2, 3, 4]
```

### 5.5.2 `enumerate()` et `zip()` (rappel)

Voir §3 — ils sont des built-ins, pas des imports.

### 5.5.3 `map()` et `filter()` — fonctions d'ordre supérieur

```python
# map — applique une fonction à chaque élément
nombres = [1, 2, 3, 4, 5]
doubles = list(map(lambda x: x * 2, nombres))   # [2, 4, 6, 8, 10]

# filter — garde les éléments qui satisfont la condition
pairs = list(filter(lambda x: x % 2 == 0, nombres))   # [2, 4]
```

*En Python moderne, préférer les compréhensions* (voir §6) — plus lisibles que `map`/`filter` avec lambda.

```python
# Équivalents idiomatiques
doubles = [x * 2 for x in nombres]
pairs = [x for x in nombres if x % 2 == 0]
```

### 5.5.4 `type()` et `isinstance()`

```python
type(42)           # <class 'int'>
type("hello")      # <class 'str'>
type([])           # <class 'list'>

isinstance(42, int)          # True
isinstance("hello", str)     # True
isinstance([], (list, tuple))  # True — vérifie contre plusieurs types
```

*Préférer `isinstance()` à `type() ==`* — plus robuste avec l'héritage.

---

## 5.6 Utilitaires divers

### 5.6.1 `print()` — affichage avancé

```python
print("a", "b", "c")              # a b c (séparateur espace par défaut)
print("a", "b", "c", sep=", ")    # a, b, c
print("début", end=" ")           # pas de retour à la ligne
print("suite")                    # → "début suite"
```

### 5.6.2 `input()` — saisie utilisateur

```python
nom = input("Ton prénom : ")   # attend la saisie, retourne une string
age = int(input("Ton âge : ")) # convertir manuellement
```

### 5.6.3 `open()` — fichiers (voir §8)

### 5.6.4 `id()` — identité objet (voir §4)

---

## 5.7 Pont JS → Python — built-ins

| JS | Python | Notes |
|---|---|---|
| `arr.length` | `len(arr)` | Fonction, pas propriété |
| `arr.includes(x)` | `x in arr` | Opérateur, pas méthode |
| `Math.min(...arr)` | `min(arr)` | Natif, pas de spread |
| `Math.max(...arr)` | `max(arr)` | Natif, pas de spread |
| `arr.sort()` | `.sort()` (en place) ou `sorted()` (nouvelle) | Deux formes séparées |
| `arr.some(fn)` | `any(fn(x) for x in arr)` | Avec expression génératrice |
| `arr.every(fn)` | `all(fn(x) for x in arr)` | Avec expression génératrice |
| `arr.map(fn)` | `[fn(x) for x in arr]` | Compréhension (idiomatique) |
| `arr.filter(fn)` | `[x for x in arr if fn(x)]` | Compréhension (idiomatique) |
| `parseInt(s)` | `int(s)` | Conversion explicite |
| `parseFloat(s)` | `float(s)` | Conversion explicite |
| `String(x)` | `str(x)` | Conversion explicite |
