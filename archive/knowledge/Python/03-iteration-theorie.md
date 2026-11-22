# 3. Itération & accès aux données

## 3.1 Modèle mental

En Python, l'itération est **explicite et structurée**. Pas de callbacks implicites comme `.map()` ou `.forEach()` — on écrit directement la boucle, on nomme les variables, on contrôle le flux.

*Analogie :*
- **JS vanilla** : `array.forEach(item => ...)` — callback passé à la méthode
- **Reef.js** : itération souvent dans le `template`, toujours liée au re-render
- **Python** : `for item in liste:` — itération directe, sans callback, découplée du rendu

---

## 3.2 `for` — parcours de séquences

### 3.2.1 Parcours simple

```python
fruits = ["pomme", "banane", "cerise"]

for fruit in fruits:
    print(fruit)
```

*Équivalent JS* : `fruits.forEach(fruit => console.log(fruit))` ou `for (const fruit of fruits)`

### 3.2.2 `enumerate()` — index + valeur

Quand tu as besoin de l'index **et** de la valeur en même temps :

```python
composants = ["Button", "Input", "Card"]

for i, composant in enumerate(composants):
    print(f"{i}: {composant}")
# 0: Button
# 1: Input
# 2: Card

# Démarrer l'index à 1
for i, composant in enumerate(composants, start=1):
    print(f"{i}. {composant}")
```

*Équivalent JS* : `composants.forEach((composant, i) => ...)` ou `.entries()` — mais `enumerate` est plus lisible.

**Ne jamais faire** : `for i in range(len(liste)):` pour accéder à `liste[i]` — utiliser `enumerate` à la place.

### 3.2.3 `zip()` — parcours parallèle

Parcourir deux séquences en parallèle :

```python
noms = ["Button", "Input", "Card"]
tailles = [32, 40, 200]

for nom, taille in zip(noms, tailles):
    print(f"{nom} → {taille}px")
# Button → 32px
# Input → 40px
# Card → 200px
```

`zip` s'arrête à la séquence la plus courte.

```python
# Pour des longueurs différentes
from itertools import zip_longest
for a, b in zip_longest(noms, tailles, fillvalue=None):
    ...
```

*Équivalent JS* : pas de `zip` natif. Nécessite `noms.map((nom, i) => [nom, tailles[i]])`.

### 3.2.4 Parcours d'un `dict`

```python
config = {"couleur": "blue", "taille": 16, "poids": 400}

# Clés seulement (défaut)
for cle in config:
    print(cle)

# Clés seulement (explicite)
for cle in config.keys():
    print(cle)

# Valeurs seulement
for valeur in config.values():
    print(valeur)

# Clés ET valeurs — le plus courant
for cle, valeur in config.items():
    print(f"{cle}: {valeur}")
```

*Modèle mental* : `.items()` retourne des tuples `(clé, valeur)` que l'on **unpacke** directement dans `for cle, valeur`.

---

## 3.3 Unpacking — déstructuration Python

### 3.3.1 Unpacking basique

```python
point = (10, 20)
x, y = point          # x=10, y=20

rgb = (255, 128, 0)
r, g, b = rgb

# Équivalent JS
# const [x, y] = point
# const [r, g, b] = rgb
```

### 3.3.2 Unpacking avec `*` (rest)

```python
premier, *reste = [1, 2, 3, 4, 5]
# premier = 1
# reste = [2, 3, 4, 5]

*debut, dernier = [1, 2, 3, 4, 5]
# debut = [1, 2, 3, 4]
# dernier = 5

premier, *milieu, dernier = [1, 2, 3, 4, 5]
# premier = 1, milieu = [2, 3, 4], dernier = 5
```

*Équivalent JS* : `const [premier, ...reste] = arr` — syntaxe proche mais `*` en Python se place n'importe où.

### 3.3.3 Ignorer des valeurs

```python
# _ est la convention pour "je n'utilise pas cette valeur"
_, y = (10, 20)      # on ne veut que y
premier, *_, dernier = [1, 2, 3, 4, 5]  # on veut le premier et le dernier
```

---

## 3.4 Slicing — découpe de séquences (rappel)

Fonctionne sur `list`, `str`, `tuple` :

```python
texte = "design-system"
texte[0:6]    # "design"
texte[7:]     # "system"
texte[::-1]   # "metsys-ngised" (inversé)

nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nombres[2:7]   # [2, 3, 4, 5, 6]
nombres[::2]   # [0, 2, 4, 6, 8]
nombres[::-1]  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

*Syntaxe* : `sequence[début:fin:pas]` — chaque partie est optionnelle, les valeurs par défaut sont : début=0, fin=fin, pas=1.

---

## 3.5 Générateurs et `yield`

### 3.5.1 Modèle mental

Un **générateur** est une fonction qui produit des valeurs **une par une, à la demande**, sans tout charger en mémoire. Elle "se met en pause" après chaque `yield` et reprend quand on demande la valeur suivante.

*Analogie :* une liste = un tiroir plein de cartes (tout en mémoire). Un générateur = quelqu'un qui te tend une carte à la fois, en la fabriquant au besoin.

### 3.5.2 Fonction génératrice

```python
def compter(max):
    n = 0
    while n < max:
        yield n     # produit n, se met en pause
        n += 1

for valeur in compter(5):
    print(valeur)
# 0, 1, 2, 3, 4
```

### 3.5.3 Expression génératrice

Comme une list comprehension, mais paresseuse (entre parenthèses) :

```python
# List comprehension — crée TOUTE la liste en mémoire
carres = [x**2 for x in range(1000000)]

# Expression génératrice — produit les valeurs à la demande
carres = (x**2 for x in range(1000000))

# Utilisation identique dans une boucle
for c in carres:
    print(c)

# Ou dans un built-in
total = sum(x**2 for x in range(100))  # pas de double parenthèse nécessaire
```

### 3.5.4 Convertir un générateur en liste

```python
gen = (x*2 for x in range(5))
liste = list(gen)   # [0, 2, 4, 6, 8]
```

*Quand utiliser un générateur ?*
- Grands volumes de données (fichiers CSV, logs, APIs paginées)
- Quand on ne veut pas stocker tout le résultat d'un coup
- `sum(gen)`, `max(gen)`, `any(gen)` — les built-ins Python acceptent tous les itérables

---

## 3.6 Pont JS → Python — itération

| Pattern JS | Équivalent Python | Notes |
|---|---|---|
| `arr.forEach(x => ...)` | `for x in arr:` | Plus lisible, pas de callback |
| `arr.map(x => f(x))` | `[f(x) for x in arr]` | Compréhension (voir §6) |
| `arr.filter(x => test)` | `[x for x in arr if test]` | Compréhension filtrée |
| `arr.entries()` | `enumerate(arr)` | Index + valeur |
| `zip` (pas natif) | `zip(a, b)` | Natif en Python |
| `arr[1:4]` (`slice`) | `arr[1:4]` | Syntaxe similaire |
| `arr.slice()` (copie) | `arr[:]` | Slice sans bornes = copie |
| `[...arr].reverse()` | `arr[::-1]` | Nouvelle liste inversée |
| Générateur JS `function*` | `def f(): yield ...` | Concept similaire |
