# 10. Modules & organisation — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : comprendre la correspondance entre modules ES et modules Python.

Tu as ce projet JS organisé avec ES modules :

```js
// utils.js
export function formaterNom(nom) {
  return nom.toLowerCase().replace(/\s+/g, "-");
}

export function valider(token) {
  return token.nom && token.valeur;
}

// tokens.js
import { formaterNom, valider } from "./utils.js";

export function creerToken(nom, valeur) {
  if (!valider({ nom, valeur })) throw new Error("Token invalide");
  return { nom: formaterNom(nom), valeur };
}

// main.js
import { creerToken } from "./tokens.js";
const t = creerToken("Color Primary", "#3B82F6");
console.log(t);
```

**Question** : Traduis cette architecture en Python. Crée trois fichiers (`utils.py`, `tokens.py`, `main.py`). N'utilise pas d'`export` — il n'en existe pas en Python. Ajoute `if __name__ == "__main__":` dans `main.py`.

*(Note : pour cet exercice, écris le code des trois fichiers — pas besoin de les créer sur disque.)*

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre pourquoi l'absence d'`export` est un piège.

```python
# config.py
CHEMIN_JSON = "tokens.json"
_secret = "valeur_privee"   # convention: privé

def charger():
    ...

def _helper_interne():   # convention: privé
    ...
```

```python
# main.py
from config import *   # importe tout
```

**Question 2a** : Qu'est-ce que `from config import *` importe ? Est-ce que `_secret` est importé ?

**Question 2b** : Pourquoi est-ce une mauvaise pratique ? Quelle est la meilleure alternative ?

---

### Exercice 3 — Mini cas réel

**Objectif** : organiser le mini-projet tokens en modules séparés.

Restructure le code accumulé depuis §7 à §9 en trois fichiers :

**`validation.py`** — contient :
- `TokenInvalideError`
- `TokenDoublonError`
- `valider_token(token: dict) -> bool`

**`catalogue.py`** — contient :
- `charger_tokens(chemin: str) -> list[dict]`
- `sauvegarder_tokens(tokens: list[dict], chemin: str) -> None`
- `ajouter_token(nom: str, valeur: str, chemin: str) -> None` (utilise `validation.py`)

**`export.py`** — contient :
- `exporter_css(tokens: list[dict]) -> str`
- `exporter_json(tokens: list[dict]) -> str`

Écris les en-têtes de chaque fichier (imports + signatures complètes avec type hints). Pas besoin d'implémenter le corps des fonctions — juste la structure.

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
- Pas d'`export` en Python — tout ce qui est dans un module est importable
- `import { f } from "./module.js"` → `from module import f`
- `if __name__ == "__main__":` protège le code d'exécution lors de l'import

#### Code Python propre

**`utils.py`**
```python
def formater_nom(nom: str) -> str:
    return nom.lower().replace(" ", "-")


def valider(token: dict) -> bool:
    return bool(token.get("nom")) and bool(token.get("valeur"))
```

**`tokens.py`**
```python
from utils import formater_nom, valider


def creer_token(nom: str, valeur: str) -> dict:
    if not valider({"nom": nom, "valeur": valeur}):
        raise ValueError("Token invalide")
    return {"nom": formater_nom(nom), "valeur": valeur}
```

**`main.py`**
```python
from tokens import creer_token

if __name__ == "__main__":
    t = creer_token("Color Primary", "#3B82F6")
    print(t)
    # {"nom": "color-primary", "valeur": "#3B82F6"}
```

#### Exécution
```bash
python main.py
```

---

### Correction Exercice 2

#### Réponse 2a

`from config import *` importe : `CHEMIN_JSON`, `charger`. La convention `_nom` (underscore préfixe) **n'empêche pas** techniquement l'import — mais `from config import *` respecte la convention et **n'importe pas** `_secret` ni `_helper_interne`.

Cependant, `import config; config._secret` fonctionne — le préfixe `_` n'est pas un vrai mécanisme de protection, juste une convention.

#### Réponse 2b — mauvaises pratiques de `import *`

1. **Pollution du namespace** : tous les noms de `config` deviennent locaux — risque de collision avec des noms existants.
2. **Opacité** : un lecteur ne sait pas d'où vient `charger` — vient-il de `config` ? D'un autre `import *` ?
3. **Fragile au refactor** : si `config.py` ajoute une fonction `load`, elle écrase la tienne.

#### Alternative idiomatique

```python
# ✅ Imports explicites
from config import CHEMIN_JSON, charger

# ✅ Ou module entier pour regrouper les accès
import config
config.charger()
```

---

### Correction Exercice 3

#### `validation.py`

```python
class TokenInvalideError(ValueError):
    """Token mal formé ou avec des champs invalides."""
    pass


class TokenDoublonError(Exception):
    """Token avec un nom déjà présent dans le catalogue."""
    def __init__(self, nom: str) -> None:
        super().__init__(f"Token '{nom}' existe déjà dans le catalogue")
        self.nom = nom


def valider_token(token: dict) -> bool:
    """Retourne True si le token a nom, valeur non-vides et sans espace dans le nom."""
    nom = token.get("nom", "")
    valeur = token.get("valeur", "")
    return bool(nom) and bool(valeur) and " " not in nom
```

#### `catalogue.py`

```python
import json
from pathlib import Path

from validation import TokenInvalideError, TokenDoublonError, valider_token


def charger_tokens(chemin: str = "tokens.json") -> list[dict]:
    """Charge les tokens depuis un fichier JSON. Retourne [] si absent."""
    ...


def sauvegarder_tokens(tokens: list[dict], chemin: str = "tokens.json") -> None:
    """Sauvegarde la liste de tokens en JSON indenté."""
    ...


def ajouter_token(nom: str, valeur: str, chemin: str = "tokens.json") -> None:
    """Ajoute un token après validation. Lève TokenInvalideError ou TokenDoublonError."""
    ...
```

#### `export.py`

```python
def exporter_css(tokens: list[dict]) -> str:
    """Retourne une string CSS :root { --nom: valeur; } depuis les tokens actifs."""
    ...


def exporter_json(tokens: list[dict]) -> str:
    """Retourne une string JSON indentée depuis la liste de tokens."""
    ...
```

#### Notes

- Les imports dans `catalogue.py` montrent la séparation des responsabilités : `catalogue.py` délègue la validation à `validation.py`.
- `export.py` ne dépend d'aucun autre module interne — il transforme des données reçues en paramètre. Couplage minimal.
- Les docstrings sont ici justifiées (API publique) — en code interne, elles sont souvent superflues.
