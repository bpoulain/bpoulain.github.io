# 2. Structures de données

## 2.1 Modèle mental

Python est un langage **data-first** : avant de penser à l'interface, tu penses aux données.

*Analogie stable :*
- **JS vanilla** : tu construis un DOM que tu peuples avec des données
- **Reef.js** : tu crées un state (signal), l'UI découle des données
- **Python** : **les données sont le programme** — pas de DOM, pas de rendu. Tu structures, transformes et interroges des données directement.

---

## 2.2 Les quatre structures fondamentales

| Structure | Type | Ordonnée | Mutable | Doublons | Équivalent JS |
|---|---|---|---|---|---|
| `list` | Séquence | Oui | Oui | Oui | `Array` |
| `dict` | Clé → valeur | Oui (3.7+) | Oui | Clés uniques | `Object` / `Map` |
| `tuple` | Séquence | Oui | **Non** | Oui | `Object.freeze([...])` |
| `set` | Ensemble | Non | Oui | **Non** | `Set` |

---

## 2.3 `list` — séquence mutable

### 2.3.1 Création et accès

```python
couleurs = ["rouge", "vert", "bleu"]

# Accès par index (commence à 0)
couleurs[0]   # "rouge"
couleurs[-1]  # "bleu" (dernier élément — index négatif)
couleurs[-2]  # "vert"

# Longueur
len(couleurs)  # 3
```

*Index négatif* : `-1` = dernier, `-2` = avant-dernier. Pas d'équivalent direct en JS (`arr.at(-1)` en ES2022 est proche).

### 2.3.2 Slicing — découpe de séquences

```python
nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

nombres[2:5]    # [2, 3, 4] — de l'index 2 (inclus) à 5 (exclus)
nombres[:3]     # [0, 1, 2] — du début à 3 (exclus)
nombres[7:]     # [7, 8, 9] — de 7 à la fin
nombres[::2]    # [0, 2, 4, 6, 8] — un sur deux (pas de 2)
nombres[::-1]   # [9, 8, 7, ..., 0] — liste inversée
nombres[1:8:2]  # [1, 3, 5, 7] — de 1 à 8, pas de 2
```

*Modèle mental* : `[début:fin:pas]`. Chaque partie est optionnelle.

*Équivalent JS* : `arr.slice(2, 5)` fait `[2:5]`, mais pas de pas ni d'index négatif natif sans ES2022+.

### 2.3.3 Modification

```python
couleurs = ["rouge", "vert", "bleu"]

couleurs.append("jaune")        # ajoute en fin → ["rouge", "vert", "bleu", "jaune"]
couleurs.insert(1, "orange")    # insère à l'index 1
couleurs.remove("vert")         # supprime la première occurrence
couleurs.pop()                  # supprime et retourne le dernier
couleurs.pop(0)                 # supprime et retourne l'index 0

couleurs.sort()                 # tri en place (modifie la liste)
couleurs.reverse()              # inverse en place

# Pour créer une NOUVELLE liste triée (sans modifier l'originale)
triee = sorted(couleurs)
```

### 2.3.4 Vérification

```python
"rouge" in couleurs     # True/False — appartenance
couleurs.index("vert")  # indice de la première occurrence
couleurs.count("rouge") # nombre d'occurrences
```

---

## 2.4 `dict` — structure clé → valeur

### 2.4.1 Création et accès

```python
composant = {
    "nom": "Button",
    "variantes": ["primary", "secondary"],
    "taille": 42,
    "actif": True
}

# Accès par clé
composant["nom"]            # "Button"
composant.get("couleur")    # None si absent (pas de KeyError)
composant.get("couleur", "transparent")  # valeur par défaut

# Modification
composant["couleur"] = "blue"
composant["taille"] = 48

# Suppression
del composant["actif"]
composant.pop("taille")     # supprime et retourne la valeur
```

*Modèle mental :* `dict` = objet JS littéral, mais avec une API plus riche.

### 2.4.2 Méthodes essentielles

```python
# Itération
composant.keys()    # vue des clés
composant.values()  # vue des valeurs
composant.items()   # vue des paires (clé, valeur) — pour les boucles

# Fusion (Python 3.9+)
defaults = {"taille": 16, "actif": True}
config = {"taille": 32, "couleur": "red"}
resultat = defaults | config   # merge — les doublons prennent config
# → {"taille": 32, "actif": True, "couleur": "red"}

# Mise à jour en place
defaults.update(config)
```

### 2.4.3 Vérification

```python
"nom" in composant         # True — teste l'existence d'une clé
"nom" not in composant     # False
len(composant)             # nombre de paires
```

*Pièges JS → Python* :
- `composant["cle_inexistante"]` → `KeyError` (pas `undefined` comme en JS)
- Utiliser `.get()` pour les accès potentiellement absents

---

## 2.5 `tuple` — séquence immuable

### 2.5.1 Création

```python
point = (10, 20)           # parenthèses (optionnelles)
point = 10, 20             # aussi valide
rgb = (255, 128, 0)
singleton = (42,)          # virgule obligatoire pour un tuple d'un seul élément
vide = ()
```

### 2.5.2 Accès

```python
point[0]   # 10
point[-1]  # 20
x, y = point   # unpacking — très Pythonic
```

### 2.5.3 Immuabilité

```python
point = (10, 20)
point[0] = 99   # TypeError — les tuples ne sont pas modifiables
```

*Quand utiliser un tuple ?*
- Données qui ne doivent pas changer : coordonnées, configuration fixe, valeurs de retour multiples
- Clés de dictionnaire (les listes ne peuvent pas être des clés — les tuples oui)

### 2.5.4 Valeurs de retour multiples

```python
def dimensions_composant():
    return 320, 48   # retourne un tuple

largeur, hauteur = dimensions_composant()   # unpacking direct
```

---

## 2.6 `set` — ensemble sans doublons

### 2.6.1 Création

```python
tags = {"responsive", "accessible", "dark-mode"}
tags_depuis_liste = set(["a", "b", "a", "c"])  # {"a", "b", "c"}
vide = set()   # pas {} — ça crée un dict vide
```

### 2.6.2 Opérations

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b   # union → {1, 2, 3, 4, 5, 6}
a & b   # intersection → {3, 4}
a - b   # différence → {1, 2}
a ^ b   # différence symétrique → {1, 2, 5, 6}
```

*Quand utiliser un set ?*
- Éliminer les doublons d'une liste : `list(set(ma_liste))`
- Test d'appartenance rapide (plus rapide que `in` sur une liste pour grands volumes)
- Opérations mathématiques d'ensemble

---

## 2.7 Choisir la bonne structure

```
Ma donnée est une séquence ordonnée ?
├── Oui → elle peut changer ? → list
│             elle ne doit pas changer ? → tuple
└── Non → les éléments ont un nom ? → dict
           l'unicité prime ? → set
```

*Exemple pratique — design system :*

```python
# Liste de composants (ordonnée, peut changer)
composants = ["Button", "Input", "Card", "Modal"]

# Propriétés d'un composant (clé → valeur)
button = {
    "nom": "Button",
    "variantes": ["primary", "ghost", "danger"],
    "taille_defaut": (32, 120)   # tuple : hauteur × largeur min
}

# Ensemble de tags uniques
tags_utilises = {"responsive", "dark-mode", "accessible"}
```

---

## 2.8 Comparaison des paradigmes — §2

| Concept | JS vanilla | Reef.js | Python |
|---|---|---|---|
| Tableau | `Array` | `signal([...])` | `list` |
| Objet clé/valeur | `Object` / `Map` | `signal({...})` | `dict` |
| Immuable | `Object.freeze()` | lecture seule d'un signal | `tuple` |
| Ensemble | `Set` | — | `set` |
| Accès clé manquante | `undefined` | `undefined` | `KeyError` → utiliser `.get()` |
| Modification d'état | mutation directe | `signal.value = ...` | mutation directe (liste/dict) |
