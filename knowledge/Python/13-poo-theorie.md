# 13. Programmation Orientée Objet (POO)

## 13.1 Modèle mental

En Python, la POO est un **outil parmi d'autres**, pas une obligation. Un objet = **données + comportements associés**. La POO est utile quand un dict devient trop complexe ou quand tu as besoin de valider, d'encapsuler ou d'associer des méthodes à une structure.

*Analogie :*
- **JS vanilla** : `class` ES6 — syntaxe similaire, mais Python va plus loin avec `@dataclass`
- **Reef.js** : les composants sont des fonctions, pas des classes
- **Python moderne** : préférer `@dataclass` aux classes manuelles pour les structures de données

---

## 13.2 Classe de base

### 13.2.1 Syntaxe

```python
class Token:
    def __init__(self, nom: str, valeur: str, actif: bool = True):
        self.nom = nom
        self.valeur = valeur
        self.actif = actif

    def css(self) -> str:
        return f"--{self.nom}: {self.valeur};"

    def __repr__(self) -> str:
        return f"Token(nom={self.nom!r}, valeur={self.valeur!r})"


# Utilisation
t = Token("color-primary", "#3B82F6")
print(t.nom)    # "color-primary"
print(t.css())  # "--color-primary: #3B82F6;"
print(t)        # Token(nom='color-primary', valeur='#3B82F6')
```

### 13.2.2 `__init__` — constructeur

`__init__` est appelé automatiquement à la création. `self` = référence vers l'instance (équivalent de `this` en JS, mais toujours **explicite** en Python).

### 13.2.3 Méthodes

```python
class CatalogueTokens:
    def __init__(self):
        self._tokens: list[Token] = []   # attribut privé (convention _)

    def ajouter(self, token: Token) -> None:
        self._tokens.append(token)

    def filtrer_actifs(self) -> list[Token]:
        return [t for t in self._tokens if t.actif]

    def __len__(self) -> int:
        return len(self._tokens)

    def __iter__(self):
        return iter(self._tokens)
```

### 13.2.4 Méthodes spéciales (dunder methods)

| Méthode | Déclenchée par |
|---|---|
| `__init__` | `Token(...)` |
| `__repr__` | `repr(t)`, print en REPL |
| `__str__` | `str(t)`, `print(t)` |
| `__len__` | `len(obj)` |
| `__eq__` | `a == b` |
| `__iter__` | `for x in obj:` |
| `__contains__` | `x in obj` |

---

## 13.3 `@dataclass` — la façon moderne

### 13.3.1 Problème des classes manuelles

```python
# ❌ Beaucoup de code répétitif
class Token:
    def __init__(self, nom, valeur, actif=True):
        self.nom = nom
        self.valeur = valeur
        self.actif = actif

    def __repr__(self):
        return f"Token(nom={self.nom!r}, valeur={self.valeur!r}, actif={self.actif!r})"

    def __eq__(self, other):
        return (self.nom, self.valeur, self.actif) == (other.nom, other.valeur, other.actif)
```

### 13.3.2 `@dataclass` génère tout ça automatiquement

```python
from dataclasses import dataclass, field


@dataclass
class Token:
    nom: str
    valeur: str
    actif: bool = True

    def css(self) -> str:
        return f"--{self.nom}: {self.valeur};"


# __init__, __repr__, __eq__ générés automatiquement
t1 = Token("color-primary", "#3B82F6")
t2 = Token("color-primary", "#3B82F6")

print(t1)        # Token(nom='color-primary', valeur='#3B82F6', actif=True)
t1 == t2         # True — __eq__ basé sur les champs
```

### 13.3.3 Options utiles

```python
from dataclasses import dataclass, field


@dataclass
class Composant:
    nom: str
    variantes: list[str] = field(default_factory=list)   # liste mutable par défaut
    taille: int = 32
    actif: bool = True

    def __post_init__(self):
        # Validation après __init__
        if not self.nom:
            raise ValueError("Le nom ne peut pas être vide")
        self.nom = self.nom.lower()
```

*`field(default_factory=list)`* : crée une nouvelle liste pour chaque instance — résout le problème de valeur par défaut mutable de §4.

### 13.3.4 Dataclass immuable

```python
@dataclass(frozen=True)
class Couleur:
    hex: str
    r: int
    g: int
    b: int

c = Couleur("#3B82F6", 59, 130, 246)
c.hex = "#000"   # FrozenInstanceError — immuable
```

---

## 13.4 `NamedTuple` — tuple avec noms de champs

```python
from typing import NamedTuple


class Point(NamedTuple):
    x: float
    y: float
    label: str = ""


p = Point(10.0, 20.0, "Origin")
p.x          # 10.0
p[0]         # 10.0 — accès par index aussi
x, y, _ = p  # unpacking

# Immuable comme un tuple
p.x = 99    # AttributeError
```

*Quand utiliser `NamedTuple` vs `@dataclass` ?*
- `NamedTuple` : données immuables, léger, compatible avec le tuple natif
- `@dataclass` : structure mutable, logique associée, validation dans `__post_init__`

---

## 13.5 Héritage — à utiliser avec parcimonie

```python
@dataclass
class TokenBase:
    nom: str
    valeur: str

@dataclass
class TokenCouleur(TokenBase):
    format: str = "hex"   # champ supplémentaire

    def rgb(self) -> tuple[int, int, int]:
        hex_ = self.valeur.lstrip("#")
        return tuple(int(hex_[i:i+2], 16) for i in (0, 2, 4))


t = TokenCouleur("color-primary", "#3B82F6")
print(t.rgb())   # (59, 130, 246)
```

*Bonne pratique Python* : préférer la **composition** à l'héritage profond. Une classe qui contient une autre > une hiérarchie à 5 niveaux.

---

## 13.6 Quand utiliser la POO en Python

**Utiliser une classe quand :**
- Un dict a trop de clés et une logique associée
- Tu as besoin de validation automatique à la création (`__post_init__`)
- Plusieurs fonctions opèrent toujours sur la même structure
- Tu modélises une entité avec état qui évolue

**Ne pas utiliser une classe quand :**
- Un dict ou tuple suffit
- Tu as juste besoin de regrouper quelques fonctions (utilise un module)
- La structure est créée, utilisée, jetée — sans comportement associé

---

## 13.7 Comparaison des paradigmes — §13

| Concept | JS (ES6) | Python manuel | Python @dataclass |
|---|---|---|---|
| Déclaration | `class Token { }` | `class Token:` | `@dataclass class Token:` |
| Constructeur | `constructor(nom)` | `def __init__(self, nom):` | Champs déclarés directement |
| `this` / `self` | `this` (implicite) | `self` (explicite, toujours) | `self` (généré automatiquement) |
| `toString()` | `.toString()` | `__str__` | `__repr__` généré |
| Égalité | `===` identité / `==` valeur | `__eq__` | `__eq__` généré automatiquement |
| Champ privé | `#champ` (ES2022) | `_champ` (convention) | `_champ` (convention) |
| Immuable | `Object.freeze()` | Pas de natif | `@dataclass(frozen=True)` |
