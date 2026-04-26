# 13. POO — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : comprendre la différence entre class JS et @dataclass Python.

```js
class Token {
  constructor(nom, valeur, actif = true) {
    if (!nom) throw new Error("nom requis");
    this.nom = nom.toLowerCase();
    this.valeur = valeur;
    this.actif = actif;
  }

  get css() {
    return `--${this.nom}: ${this.valeur};`;
  }

  toString() {
    return `Token(${this.nom}, ${this.valeur})`;
  }
}

const t = new Token("Color-Primary", "#3B82F6");
console.log(t.css);      // "--color-primary: #3B82F6;"
console.log(String(t));  // "Token(color-primary, #3B82F6)"
```

**Question** : Traduis cette classe en Python en utilisant `@dataclass`. Utilise `__post_init__` pour la validation et la normalisation. Utilise `@property` pour le getter `css`.

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre quand une classe est sur-ingéniée.

```python
class TokenManager:
    def __init__(self):
        self.tokens = []

    def ajouter(self, token):
        self.tokens.append(token)

    def get_tous(self):
        return self.tokens

    def get_actifs(self):
        return [t for t in self.tokens if t["actif"]]
```

**Question 2a** : Cette classe est un wrapper inutile autour d'une liste. Pourquoi est-ce du mauvais Python ici ?

**Question 2b** : Quand cette approche serait-elle justifiée ? Donne un exemple de fonctionnalité qui justifierait une classe.

---

### Exercice 3 — Mini cas réel

**Objectif** : modéliser un design system avec `@dataclass`.

Implémente ces deux dataclasses :

```python
@dataclass
class Token:
    # nom: str — ne doit pas être vide, pas d'espaces, converti en minuscules
    # valeur: str — ne doit pas être vide
    # actif: bool — True par défaut
    # categorie: str — premier segment du nom (dérivé automatiquement)
    ...

@dataclass
class Composant:
    # nom: str
    # tokens: list[Token] — vide par défaut
    # version: str — "1.0.0" par défaut
    ...
    
    # Méthodes attendues :
    # ajouter_token(self, token: Token) -> None
    # css(self) -> str — retourne les variables CSS de tous les tokens actifs
    # taux_couverture(self, tokens_disponibles: list[Token]) -> float
```

Puis teste :

```python
button = Composant("Button")
button.ajouter_token(Token("color-primary", "#3B82F6"))
button.ajouter_token(Token("spacing-4", "16px"))
button.ajouter_token(Token("color-deprecated", "#aaa", actif=False))

print(button.css())
# :root {
#   --color-primary: #3B82F6;
#   --spacing-4: 16px;
# }

disponibles = [
    Token("color-primary", "#3B82F6"),
    Token("spacing-4", "16px"),
    Token("color-deprecated", "#aaa"),
    Token("font-size-base", "16px"),
]
print(button.taux_couverture(disponibles))  # 50.0 (2 actifs / 4 disponibles)
```

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
- `constructor` → `__init__` ou `__post_init__` avec `@dataclass`
- `get css()` → `@property`
- `toString()` → `__str__` ou `__repr__`
- Validation → `__post_init__`

#### Code Python propre

```python
from dataclasses import dataclass


@dataclass
class Token:
    nom: str
    valeur: str
    actif: bool = True

    def __post_init__(self):
        if not self.nom:
            raise ValueError("nom requis")
        self.nom = self.nom.lower()

    @property
    def css(self) -> str:
        return f"--{self.nom}: {self.valeur};"

    def __str__(self) -> str:
        return f"Token({self.nom}, {self.valeur})"


t = Token("Color-Primary", "#3B82F6")
print(t.css)    # "--color-primary: #3B82F6;"
print(str(t))   # "Token(color-primary, #3B82F6)"
print(t)        # "Token(color-primary, #3B82F6)"
```

#### Notes

- `@property` transforme une méthode en attribut accessible sans `()` — comme un getter JS.
- `__post_init__` est appelé par `@dataclass` après `__init__` — le bon endroit pour validation + transformation.
- `@dataclass` génère `__repr__` automatiquement (pour le REPL). `__str__` est pour `str()` et `print()`.

---

### Correction Exercice 2

#### Réponse 2a

`TokenManager` est une **classe-coquille** (wrapper anémique) : elle ne fait que déléguer à une liste sans ajouter de valeur. Les mêmes opérations s'écrivent plus simplement avec une liste :

```python
# Équivalent sans classe :
tokens = []
tokens.append(token)                              # ajouter
list(tokens)                                      # get_tous
[t for t in tokens if t["actif"]]                 # get_actifs
```

C'est un antipattern venu de Java/C# où encapsuler dans une classe est systématique. En Python, **une liste reste une liste** tant qu'il n'y a pas de comportement métier associé.

#### Réponse 2b — quand une classe est justifiée

La classe `TokenManager` serait justifiée si elle ajoutait :
- Validation à l'ajout (no doublon, format vérifié)
- Persistance intégrée (auto-save après chaque modification)
- Indexation interne (recherche O(1) par nom)
- Historique des modifications

```python
class CatalogueTokens:
    def __init__(self, chemin: str = "tokens.json"):
        self._tokens: list[dict] = []
        self._index: dict[str, dict] = {}   # O(1) par nom
        self._chemin = chemin

    def ajouter(self, token: dict) -> None:
        if token["nom"] in self._index:
            raise TokenDoublonError(token["nom"])
        self._tokens.append(token)
        self._index[token["nom"]] = token
        self._sauvegarder()   # auto-save
```

---

### Correction Exercice 3

#### Code Python propre

```python
from dataclasses import dataclass, field


@dataclass
class Token:
    nom: str
    valeur: str
    actif: bool = True
    categorie: str = field(init=False)

    def __post_init__(self):
        if not self.nom:
            raise ValueError("nom requis")
        if " " in self.nom:
            raise ValueError(f"nom '{self.nom}' ne doit pas contenir d'espaces")
        if not self.valeur:
            raise ValueError("valeur requise")
        self.nom = self.nom.lower()
        self.categorie = self.nom.split("-")[0]

    @property
    def css_var(self) -> str:
        return f"--{self.nom}: {self.valeur};"


@dataclass
class Composant:
    nom: str
    tokens: list[Token] = field(default_factory=list)
    version: str = "1.0.0"

    def ajouter_token(self, token: Token) -> None:
        self.tokens.append(token)

    def css(self) -> str:
        actifs = [t for t in self.tokens if t.actif]
        lignes = [f"  {t.css_var}" for t in actifs]
        return ":root {\n" + "\n".join(lignes) + "\n}"

    def taux_couverture(self, tokens_disponibles: list[Token]) -> float:
        noms_disponibles = {t.nom for t in tokens_disponibles}
        noms_actifs = {t.nom for t in self.tokens if t.actif}
        utilises = noms_actifs & noms_disponibles
        if not noms_disponibles:
            return 0.0
        return round(len(utilises) / len(noms_disponibles) * 100, 1)


# Test
button = Composant("Button")
button.ajouter_token(Token("color-primary", "#3B82F6"))
button.ajouter_token(Token("spacing-4", "16px"))
button.ajouter_token(Token("color-deprecated", "#aaa", actif=False))

print(button.css())

disponibles = [
    Token("color-primary", "#3B82F6"),
    Token("spacing-4", "16px"),
    Token("color-deprecated", "#aaa"),
    Token("font-size-base", "16px"),
]
print(button.taux_couverture(disponibles))  # 50.0
```

#### Sortie

```
:root {
  --color-primary: #3B82F6;
  --spacing-4: 16px;
}
50.0
```

#### Notes

- `field(init=False)` : `categorie` n'est pas passé au constructeur — il est calculé dans `__post_init__`.
- `field(default_factory=list)` : nouvelle liste pour chaque instance (§4 — valeur par défaut mutable).
- L'intersection de sets `noms_actifs & noms_disponibles` est la façon idiomatique de compter les tokens en commun.
