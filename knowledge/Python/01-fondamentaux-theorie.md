# 1. Fondamentaux du langage Python

## 1.1 Modèle mental

Python est un langage **impératif généraliste** : tu écris des instructions qui s'exécutent de haut en bas, tu manipules des données directement, sans DOM, sans rendu, sans navigateur.

*Analogie stable :*
- **JS vanilla** = tableau blanc modifié à la main, directement dans le navigateur
- **Reef.js** = tableau blanc avec assistant — tu changes les données, il redessine
- **Python** = boîte à outils flexible — tu manipules les données, les structures et les fonctions sont les instruments

---

## 1.2 Variables et typage

### 1.2.1 Déclaration

```python
nom = "Alice"
age = 30
taille = 1.75
actif = True
rien = None
```

Pas de `let`, `const`, `var`. L'assignation crée la variable.

### 1.2.2 Typage dynamique, mais strict

Python est **dynamiquement typé** mais refuse la coercition implicite entre types :

```python
# JS : "5" + 3 → "53"  (coercition silencieuse)
# Python :
"5" + 3  # TypeError — refusé explicitement
```

Pour convertir : `int("5")`, `str(30)`, `float("1.75")`

### 1.2.3 `None` — pas de `null`, pas d'`undefined`

Python n'a qu'une seule valeur pour "l'absence" : `None`.

| JS | Python |
|---|---|
| `null` | `None` |
| `undefined` | `None` (n'existe pas en Python) |
| `null == undefined` → `true` | Pas d'équivalent |

**Règle absolue** : tester avec `is None` / `is not None`, jamais `== None`.

```python
valeur = None

# ✅ Correct
if valeur is None:
    print("vide")

# ❌ Fonctionne mais trompe — éviter
if valeur == None:
    print("vide")
```

*Pourquoi ?* `is` teste l'identité objet. `None` est un singleton : il n'existe qu'un seul objet `None` en mémoire. `==` appelle `__eq__` et peut être surchargé — source de bugs silencieux.

---

## 1.3 Types de base

| Type | Exemple | Équivalent JS |
|---|---|---|
| `int` | `42` | `number` (entier) |
| `float` | `3.14` | `number` (décimal) |
| `str` | `"texte"` | `string` |
| `bool` | `True` / `False` | `true` / `false` |
| `None` | `None` | `null` |

*Attention* : `True` et `False` commencent par une majuscule (contrairement à JS).

---

## 1.4 f-strings — formatage idiomatique

La façon standard de formater du texte en Python 3.12+ :

```python
prenom = "Alice"
age = 30

# f-string (méthode recommandée)
message = f"Bonjour {prenom}, tu as {age} ans."

# Expressions dans les accolades
prix = 9.5
tva = f"Prix TTC : {prix * 1.2:.2f} €"  # arrondi à 2 décimales

# Équivalent JS
# `Bonjour ${prenom}, tu as ${age} ans.`
```

*Modèle mental :* le `f` avant les guillemets active l'interpolation. Ce qui est entre `{}` est évalué comme du Python.

---

## 1.5 Opérateurs spécifiques à Python

### 1.5.1 Opérateurs logiques — mots-clés, pas symboles

| Python | JS équivalent |
|---|---|
| `and` | `&&` |
| `or` | `\|\|` |
| `not` | `!` |

```python
actif = True
admin = False

if actif and not admin:
    print("Utilisateur standard connecté")
```

### 1.5.2 `in` / `not in` — appartenance

```python
couleurs = ["rouge", "vert", "bleu"]

if "vert" in couleurs:
    print("trouvé")

if "jaune" not in couleurs:
    print("absent")
```

*Équivalent JS* : `couleurs.includes("vert")` — mais `in` Python fonctionne sur toutes les structures (listes, dicts, strings, sets).

### 1.5.3 `is` / `is not` — identité objet

Teste si deux variables pointent vers le **même objet en mémoire**, pas juste une valeur égale.

```python
a = [1, 2, 3]
b = a          # même objet
c = [1, 2, 3]  # nouvel objet, même valeur

a is b   # True  — même objet
a is c   # False — objets différents
a == c   # True  — valeurs identiques
```

*Utilisation principale en pratique* : `is None` / `is not None`.

---

## 1.6 Conditions

### 1.6.1 `if / elif / else`

```python
score = 75

if score >= 90:
    print("Excellent")
elif score >= 70:
    print("Bien")
elif score >= 50:
    print("Passable")
else:
    print("Insuffisant")
```

*Différence JS* : `elif` au lieu de `else if`. Pas d'accolades — **l'indentation (4 espaces) délimite le bloc**.

### 1.6.2 Expression ternaire

```python
# Python
statut = "actif" if age >= 18 else "mineur"

# Équivalent JS
# const statut = age >= 18 ? "actif" : "mineur"
```

### 1.6.3 `match / case` — pattern matching (Python 3.10+)

Puissant et expressif, va bien au-delà d'un `switch` JS :

```python
commande = "quitter"

match commande:
    case "aide":
        print("Affiche l'aide")
    case "quitter" | "exit":
        print("Au revoir")
    case _:
        print(f"Commande inconnue : {commande}")
```

Avec des structures de données :

```python
point = (0, 1)

match point:
    case (0, 0):
        print("Origine")
    case (x, 0):
        print(f"Sur l'axe X : {x}")
    case (0, y):
        print(f"Sur l'axe Y : {y}")
    case (x, y):
        print(f"Point ({x}, {y})")
```

*Modèle mental :* `match/case` **destructure** et filtre simultanément. `_` = joker (cas par défaut).

---

## 1.7 Boucles

### 1.7.1 `for`

```python
# Itération sur une liste
fruits = ["pomme", "banane", "cerise"]
for fruit in fruits:
    print(fruit)

# Itération sur un range
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):    # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8
    print(i)
```

### 1.7.2 `while`

```python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
```

### 1.7.3 `break`, `continue`, `else` sur boucle

```python
for n in range(10):
    if n == 3:
        continue   # saute cette itération
    if n == 7:
        break      # arrête la boucle
    print(n)
else:
    # Exécuté SEULEMENT si la boucle s'est terminée sans break
    print("Boucle complète")
```

*`else` sur boucle* : concept sans équivalent direct en JS. Utile pour détecter qu'une recherche n'a rien trouvé.

---

## 1.8 Indentation — règle fondamentale

L'indentation **fait partie de la syntaxe**. Elle définit les blocs logiques. Convention standard : **4 espaces** (jamais de tabulations).

```python
# ✅ Correct
def saluer(nom):
    if nom:
        print(f"Bonjour {nom}")
    else:
        print("Bonjour inconnu")

# ❌ IndentationError
def saluer(nom):
  if nom:        # 2 espaces
      print(...)  # 6 espaces — incohérent
```

*Différence JS* : les `{}` JS sont optionnels dans certains contextes et n'imposent pas d'indentation. En Python, l'indentation est la syntaxe.

---

## 1.9 Comparaison des paradigmes — §1

| Concept | JS vanilla | Python |
|---|---|---|
| Typage | Dynamique avec coercition | Dynamique sans coercition |
| Absence de valeur | `null`, `undefined` | `None` uniquement |
| Blocs | `{}` | Indentation obligatoire |
| Opérateurs logiques | `&&`, `\|\|`, `!` | `and`, `or`, `not` |
| Formatage string | Template literals `\`${}\`` | f-strings `f"{}"` |
| Appartenance | `.includes()` | `in` / `not in` |
| Identité | `===` (valeur + type) | `is` (identité objet) |
| Condition multi-branche | `else if` | `elif` |
