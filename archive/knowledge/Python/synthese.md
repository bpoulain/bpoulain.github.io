# Synthèse post-apprentissage — Python

> Ce fichier agrège les points clés de chaque section théorique. Il est conçu pour une révision rapide, pas comme point d'entrée. Lire après avoir étudié les sections §1–§13.

---

## Le fil conducteur

```
JS vanilla → données mélangées à l'UI → callbacks implicites
Reef.js    → données séparées de l'UI → state réactif explicite
Python     → données transformées → résultats → pas de DOM
```

**Mantra Python** : *"Je transforme des données, je ne construis pas une interface."*

---

## §1 — Fondamentaux

**Modèles mentaux à retenir**
- `None` = seule valeur d'absence. Tester avec `is None`, jamais `== None`.
- f-strings : `f"{variable}"` — l'unique façon idiomatique de formater.
- Indentation = syntaxe (4 espaces). Pas d'accolades.
- `and`/`or`/`not` — mots-clés, pas symboles.

**Faux amis JS → Python**
- `null`/`undefined` → `None`
- `===` → Python `==` est déjà strict (pas de coercition)
- `typeof` → `isinstance(x, type)`
- `else if` → `elif`
- `true`/`false` → `True`/`False`

**Nouveauté Python 3.10+** : `match/case` — pattern matching qui destructure et filtre simultanément.

---

## §2 — Structures de données

| Structure | Caractéristiques | Usage principal |
|---|---|---|
| `list` | Ordonnée, mutable | Séquences qui évoluent |
| `dict` | Clé→valeur, ordonnée (3.7+) | Objets structurés |
| `tuple` | Ordonnée, **immuable** | Valeurs fixes, retours multiples |
| `set` | Non-ordonnée, **unique** | Dédupliquation, appartenance rapide |

**Pièges**
- `d["clé_absente"]` → `KeyError` (pas `undefined`). Utiliser `.get(cle, defaut)`.
- `{}` vide = dict, pas set. Set vide = `set()`.

---

## §3 — Itération

**Constructions idiomatiques**
- `for x in liste:` — jamais `for i in range(len(...)):` sauf si tu modifies par index
- `enumerate(liste)` — quand tu as besoin de l'index
- `zip(a, b)` — deux listes en parallèle
- Unpacking : `a, b = (1, 2)` / `premier, *reste = liste`
- Slicing : `liste[début:fin:pas]` — `[::-1]` pour inverser

**Générateurs** : `(x for x in iterable)` — paresseux, économe en mémoire. Préférer aux list comprehensions dans les `sum()`, `any()`, `all()`.

---

## §4 — Mutabilité & mémoire

**Règle d'or** : `b = a` sur une liste/dict → même objet, deux étiquettes.

| Situation | Solution |
|---|---|
| Copie simple (structure plate) | `liste.copy()` ou `liste[:]` |
| Copie profonde (imbriqué) | `copy.deepcopy(obj)` |
| Valeur par défaut mutable | `def f(x=None): if x is None: x = []` |

**Faux ami Reef** : `signal.value = {...spread}` protège le state Reef, pas les sous-objets Python.

---

## §5 — Built-ins

**Réflexe avant d'écrire une boucle** : y a-t-il un built-in ?

| Built-in | Usage |
|---|---|
| `len(x)` | Longueur de toute collection |
| `sum(x)` | Somme d'un itérable |
| `min(x)` / `max(x)` | Min/max avec `key=fn` optionnel |
| `sorted(x)` | Nouvelle liste triée (ne modifie pas) |
| `any(gen)` | Au moins un `True` |
| `all(gen)` | Tous `True` |
| `enumerate(x)` | Index + valeur |
| `zip(a, b)` | Paires parallèles |

**Pièges**
- `sorted()` → nouvelle liste. `.sort()` → en place, retourne `None`.
- `min(liste, key=len)` → le plus court. `max(..., key=lambda x: x["score"])` → le plus haut score.

---

## §6 — Compréhensions

```python
[f(x) for x in iterable]               # list
[f(x) for x in iterable if cond]        # list avec filtre
{k: v for k, v in pairs}               # dict
{f(x) for x in iterable}               # set
(f(x) for x in iterable)               # générateur (paresseux)
```

**Règles d'or**
- Une seule transformation par compréhension
- Pas d'effets de bord dans une compréhension
- Si > 80 chars → décomposer

**Équivalences JS**
- `.map(fn)` → `[fn(x) for x in arr]`
- `.filter(fn).map(f)` → `[f(x) for x in arr if fn(x)]`
- `Object.fromEntries(...)` → `{k: v for k, v in pairs}`

---

## §7 — Fonctions

**Type hints** (Python 3.12+) :
```python
def f(x: int, y: str = "defaut") -> list[str]:
    ...
```

**Portée LEGB** : Local → Enclosing → Global → Built-in. Python cherche dans cet ordre.

**Règle de la valeur par défaut mutable** : utiliser `None`, jamais `[]` ou `{}`.

**Fonction pure** : même entrée → même sortie, aucun effet de bord. Préférer les fonctions pures.

**`lambda`** : pour les arguments de `sorted`/`min`/`max` uniquement. Tout ce qui dépasse une expression → `def` nommé.

---

## §8 — Fichiers & persistance

```python
# Toujours with, toujours encoding="utf-8"
with open("fichier.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Écriture
with open("fichier.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

**`pathlib.Path`** : chemin moderne. `p.exists()`, `p.parent`, `p.glob("*.json")`, `p.read_text()`.

**Pont Reef → Python** : `save("key", data)` = `json.dump(data, f)` dans un `with open(...)`.

---

## §9 — Gestion des erreurs

**Style EAFP** (Python) : essayer, puis gérer l'exception. Opposé au LBYL (vérifier avant).

```python
try:
    data = json.load(f)
except FileNotFoundError:
    return []
except json.JSONDecodeError as e:
    print(f"JSON invalide : {e}")
    return []
```

**Règles**
- Attraper des exceptions **spécifiques**, jamais `except Exception: pass`
- `raise ValueError("message explicite")` avec contexte suffisant
- Exceptions personnalisées pour le domaine métier : `class MonErreur(ValueError): pass`

---

## §10 — Modules

- Module = fichier `.py`. Tout est importable par défaut (pas d'`export`).
- `from module import f` — préférer les imports explicites à `from module import *`.
- `if __name__ == "__main__":` — protège le code d'exécution lors de l'import.
- `_nom` — convention privé (non enforced). `from m import *` le respecte.

---

## §11 — Outils

| Outil | Commande | Usage |
|---|---|---|
| venv | `python -m venv .venv` | Isoler les dépendances |
| pip | `pip install pkg` | Installer des paquets |
| requirements | `pip freeze > requirements.txt` | Figer les versions |
| REPL | `python` | Explorer du code interactivement |
| Debugger | `breakpoint()` dans le code | Arrêt et inspection |
| Tests | `pytest` | Tests automatisés |

**Workflow de démarrage** : `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`

---

## §12 — Cas pratiques

**Pattern récurrent Python** :
```
Lire → Valider → Transformer → Produire
```

Les cas pratiques type : CLI todo, parser JSON/CSV, script de renommage, pipeline de tokens.

**Quand utiliser `sys.argv` vs `argparse`** :
- `sys.argv` : ≤ 3 arguments simples
- `argparse` / `typer` : plusieurs commandes, options, aide auto

---

## §13 — POO

**`@dataclass` en premier** — génère `__init__`, `__repr__`, `__eq__` automatiquement.

```python
from dataclasses import dataclass, field

@dataclass
class Token:
    nom: str
    valeur: str
    actif: bool = True
    # Pour liste mutable :
    tags: list[str] = field(default_factory=list)

    def __post_init__(self):
        self.nom = self.nom.lower()
```

**Quand utiliser une classe** : dict trop complexe, logique associée, validation à la création.
**Ne pas utiliser** : si un dict + quelques fonctions suffisent.

**`NamedTuple`** : immuable, compatible tuple, léger. Pour des records fixes.

---

## Erreurs classiques à éviter

| Erreur | Correction |
|---|---|
| `== None` | `is None` |
| `for i in range(len(lst))` | `for i, x in enumerate(lst)` |
| `def f(x=[])` | `def f(x=None): if x is None: x = []` |
| `sorted(lst)` pensant que lst est modifiée | `sorted()` = nouvelle liste. `.sort()` = en place |
| `except Exception: pass` | Attraper l'exception spécifique |
| `from module import *` | Imports explicites |
| `f = open(...)` sans `with` | `with open(...) as f:` |
| Classe sans logique | `dict` + fonctions dans un module |
