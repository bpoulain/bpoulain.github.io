# 10. Modules & organisation

## 10.1 Modèle mental

Un module Python est simplement un **fichier `.py`**. Organiser un projet = découper le code en fichiers avec des responsabilités claires. Pas de bundler, pas de build step — Python importe directement les fichiers.

*Analogie :*
- **JS vanilla** : ES modules — `import { fn } from "./module.js"`
- **Python** : `from module import fn` — syntaxe proche, pas de `.js`, pas d'`export` explicite

---

## 10.2 Les imports

### 10.2.1 Import d'un module entier

```python
import json
import math
import pathlib

json.loads('{"a": 1}')
math.sqrt(16)
pathlib.Path("dossier/fichier.txt")
```

### 10.2.2 Import de noms spécifiques

```python
from pathlib import Path
from json import loads, dumps
from math import sqrt, pi

Path("fichier.txt")   # pas besoin de pathlib.Path
loads('{"a": 1}')
```

### 10.2.3 Alias

```python
import numpy as np          # convention standard
import pandas as pd         # convention standard
from pathlib import Path as P  # rare, préférer le nom complet
```

### 10.2.4 Import de sous-modules

```python
from collections import defaultdict, Counter
from itertools import groupby, chain
from typing import Optional
```

---

## 10.3 Modules de la bibliothèque standard

Python "batteries included" — une bibliothèque standard très riche, disponible sans `pip install`.

| Module | Usage principal |
|---|---|
| `json` | Sérialisation/désérialisation JSON |
| `pathlib` | Manipulation de chemins de fichiers |
| `os` | Interaction avec l'OS |
| `sys` | Accès à l'interpréteur Python |
| `math` | Fonctions mathématiques |
| `random` | Génération aléatoire |
| `datetime` | Dates et heures |
| `collections` | Structures avancées (`defaultdict`, `Counter`, `deque`) |
| `itertools` | Itérateurs avancés |
| `re` | Expressions régulières |
| `copy` | Copie d'objets |
| `dataclasses` | Décorateur `@dataclass` |
| `typing` | Type hints avancés |
| `unittest` | Tests unitaires |
| `argparse` | Parsing d'arguments CLI |
| `csv` | Lecture/écriture CSV |
| `http.server` | Serveur HTTP minimal |

---

## 10.4 Organiser un projet

### 10.4.1 Structure de fichiers

```
mon_projet/
├── main.py              # point d'entrée
├── tokens.py            # module tokens
├── config.py            # configuration
├── utils.py             # fonctions utilitaires
└── tests/
    ├── test_tokens.py
    └── test_utils.py
```

### 10.4.2 Importer entre modules du même projet

```python
# Dans main.py
from tokens import charger_tokens, sauvegarder_tokens
from config import CHEMIN_DEFAUT
from utils import formater_css
```

### 10.4.3 Package — dossier avec `__init__.py`

```
design_system/
├── __init__.py          # fait du dossier un package
├── tokens.py
├── composants.py
└── utils/
    ├── __init__.py
    └── validation.py
```

```python
# Import depuis un package
from design_system.tokens import charger_tokens
from design_system.utils.validation import valider_token
```

*`__init__.py`* peut être vide ou exporter des noms publics du package.

---

## 10.5 `if __name__ == "__main__":`

### 10.5.1 Pourquoi ce pattern ?

Un fichier Python peut être à la fois :
- **Un module** (importé par un autre fichier) — le code de haut niveau ne doit pas s'exécuter
- **Un script** (lancé directement) — le code de haut niveau doit s'exécuter

```python
# tokens.py

def charger_tokens(chemin):
    ...

def sauvegarder_tokens(tokens, chemin):
    ...

if __name__ == "__main__":
    # Ce bloc n'est exécuté QUE si on lance tokens.py directement
    # Pas quand il est importé par main.py
    tokens = charger_tokens("test.json")
    print(f"Chargé : {len(tokens)} tokens")
```

*Équivalent JS :* pas de concept direct. En Node.js : `if (require.main === module) { ... }` ou détection via `import.meta.url`.

---

## 10.6 Imports relatifs vs absolus

### 10.6.1 Absolus (recommandés)

```python
# Depuis la racine du projet
from tokens import charger_tokens
from design_system.utils.validation import valider_token
```

### 10.6.2 Relatifs (dans un package)

```python
# Dans design_system/composants.py
from .tokens import charger_tokens       # module frère
from ..utils.validation import valider   # module parent
```

*Bonne pratique :* préférer les imports absolus — plus explicites et moins fragiles lors des refactors.

---

## 10.7 Éviter les imports circulaires

```
# ❌ Circulaire : a.py importe b.py, b.py importe a.py
# → ImportError ou comportement indéfini

# ✅ Résoudre : extraire les dépendances communes dans un module tiers
# a.py et b.py importent tous les deux depuis utils.py
```

---

## 10.8 Comparaison des paradigmes — §10

| Concept | JS vanilla (ES modules) | Python |
|---|---|---|
| Déclarer un export | `export function f()` | Pas de déclaration — tout est public par défaut |
| Importer une fonction | `import { f } from "./module.js"` | `from module import f` |
| Import par défaut | `import module from "./module.js"` | `import module` |
| Alias | `import * as ns from "./m.js"` | `import module as alias` |
| Point d'entrée | `<script type="module" src="main.js">` | `python main.py` |
| Bundler | Nécessaire pour le navigateur | Non nécessaire |
| Convention privé | Pas de convention | Préfixe `_nom` (convention, pas enforcement) |
