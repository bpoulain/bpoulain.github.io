# 9. Gestion des erreurs — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : traduire le pattern try/catch JS en try/except Python idiomatique.

```js
async function chargerConfig(chemin) {
  try {
    const response = await fetch(chemin);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error("JSON invalide :", e.message);
    } else {
      console.error("Erreur chargement :", e.message);
    }
    return null;
  } finally {
    console.log("Chargement terminé");
  }
}
```

On n'a pas `fetch` en Python (pas de navigateur) — mais la logique est identique pour lire un fichier JSON local.

**Question** : Traduis cette fonction en Python. Utilise `FileNotFoundError` et `json.JSONDecodeError`. Remplace `fetch` par une lecture de fichier JSON local.

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre pourquoi attraper `Exception` trop large est dangereux.

```python
def charger_tokens(chemin):
    try:
        with open(chemin, "r") as f:
            return json.load(f)
    except Exception:
        return []
```

**Question 2a** : Ce code fonctionne mais cache potentiellement plusieurs types d'erreurs différents. Lesquels ? Quel est le risque ?

**Question 2b** : Réécris cette fonction en attrapant les exceptions de façon spécifique, avec un message différent pour chaque cas.

---

### Exercice 3 — Mini cas réel

**Objectif** : ajouter une validation robuste au module de tokens.

Implémente deux exceptions personnalisées et une fonction de validation :

```python
# Définir les exceptions
class TokenInvalideError(ValueError):
    ...

class TokenDoublonError(Exception):
    ...

# Implémenter
def valider_et_ajouter(
    catalogue: list[dict],
    token: dict
) -> list[dict]:
    """
    Valide le token et l'ajoute au catalogue.
    Retourne le catalogue mis à jour.
    Lève TokenInvalideError si le token est mal formé.
    Lève TokenDoublonError si le nom existe déjà.
    """
    ...
```

Règles de validation :
- `token` doit avoir les clés `"nom"`, `"valeur"`
- `"nom"` doit être non-vide et ne pas contenir d'espaces
- `"valeur"` doit être non-vide
- Le `"nom"` ne doit pas déjà exister dans le catalogue

Puis teste :

```python
catalogue = [{"nom": "color-primary", "valeur": "#3B82F6"}]

# Ces appels doivent lever des exceptions
try:
    valider_et_ajouter(catalogue, {"nom": "", "valeur": "#fff"})
except TokenInvalideError as e:
    print(f"Invalide : {e}")

try:
    valider_et_ajouter(catalogue, {"nom": "color primary", "valeur": "#fff"})
except TokenInvalideError as e:
    print(f"Invalide : {e}")

try:
    valider_et_ajouter(catalogue, {"nom": "color-primary", "valeur": "#999"})
except TokenDoublonError as e:
    print(f"Doublon : {e}")

# Cet appel doit réussir
catalogue = valider_et_ajouter(catalogue, {"nom": "spacing-4", "valeur": "16px"})
print(len(catalogue))  # 2
```

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
`fetch + response.json()` → `open() + json.load()`. `SyntaxError` JS sur JSON → `json.JSONDecodeError` Python. `finally` existe des deux côtés.

#### Code Python propre

```python
import json
from pathlib import Path


def charger_config(chemin: str) -> dict | list | None:
    try:
        with open(chemin, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError as e:
        print(f"Fichier non trouvé : {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON invalide : {e}")
        return None
    finally:
        print("Chargement terminé")
```

#### Notes

- `json.JSONDecodeError` est une sous-classe de `ValueError` — on peut aussi attraper `ValueError` si on veut une gestion commune.
- En Python, `finally` est identique à JS.
- Pas de `async/await` ici — Python peut faire de l'async (avec `asyncio`), mais pour lire un fichier local, c'est inutile.

---

### Correction Exercice 2

#### Réponse 2a — erreurs potentiellement masquées

`except Exception` attrape tout sauf `SystemExit`, `KeyboardInterrupt`, `GeneratorExit`. Risques :

| Exception masquée | Scénario |
|---|---|
| `PermissionError` | Droits insuffisants sur le fichier |
| `IsADirectoryError` | Le chemin pointe vers un dossier |
| `json.JSONDecodeError` | JSON corrompu |
| `MemoryError` | Fichier trop volumineux |
| Bug inattendu dans `json.load` | Erreur du développeur masquée |

**Conséquence** : retourner `[]` silencieusement alors qu'il y a une vraie erreur → comportement imprévisible en production.

#### Code corrigé

```python
import json


def charger_tokens(chemin: str) -> list[dict]:
    try:
        with open(chemin, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []   # cas normal : fichier pas encore créé
    except PermissionError as e:
        print(f"Accès refusé : {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Fichier JSON corrompu ({chemin}) : {e}")
        return []
```

---

### Correction Exercice 3

#### Code Python propre

```python
class TokenInvalideError(ValueError):
    """Levée quand un token est mal formé."""
    pass


class TokenDoublonError(Exception):
    """Levée quand un token avec ce nom existe déjà."""
    def __init__(self, nom: str):
        super().__init__(f"Token '{nom}' existe déjà dans le catalogue")
        self.nom = nom


def valider_et_ajouter(catalogue: list[dict], token: dict) -> list[dict]:
    # Présence des clés requises
    for cle in ("nom", "valeur"):
        if cle not in token:
            raise TokenInvalideError(f"Clé manquante : '{cle}'")

    nom = token["nom"]
    valeur = token["valeur"]

    # Validation du nom
    if not nom:
        raise TokenInvalideError("Le nom ne peut pas être vide")
    if " " in nom:
        raise TokenInvalideError(f"Le nom '{nom}' ne doit pas contenir d'espaces")

    # Validation de la valeur
    if not valeur:
        raise TokenInvalideError("La valeur ne peut pas être vide")

    # Unicité
    noms_existants = {t["nom"] for t in catalogue}
    if nom in noms_existants:
        raise TokenDoublonError(nom)

    # Ajout — on retourne une nouvelle liste (fonction pure)
    return catalogue + [token]


# Tests
catalogue = [{"nom": "color-primary", "valeur": "#3B82F6"}]

try:
    valider_et_ajouter(catalogue, {"nom": "", "valeur": "#fff"})
except TokenInvalideError as e:
    print(f"Invalide : {e}")
# Invalide : Le nom ne peut pas être vide

try:
    valider_et_ajouter(catalogue, {"nom": "color primary", "valeur": "#fff"})
except TokenInvalideError as e:
    print(f"Invalide : {e}")
# Invalide : Le nom 'color primary' ne doit pas contenir d'espaces

try:
    valider_et_ajouter(catalogue, {"nom": "color-primary", "valeur": "#999"})
except TokenDoublonError as e:
    print(f"Doublon : {e}")
# Doublon : Token 'color-primary' existe déjà dans le catalogue

catalogue = valider_et_ajouter(catalogue, {"nom": "spacing-4", "valeur": "16px"})
print(len(catalogue))  # 2
```

#### Notes

- `return catalogue + [token]` crée une **nouvelle liste** — la fonction reste pure.
- Les exceptions personnalisées héritent d'exceptions standard (`ValueError`, `Exception`) pour rester intégrées dans la hiérarchie Python.
- `self.nom` sur `TokenDoublonError` permet d'accéder au nom problématique après l'avoir attrapé : `except TokenDoublonError as e: print(e.nom)`.
