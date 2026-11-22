# 9. Gestion des erreurs

## 9.1 Modèle mental

En Python, les erreurs sont des **citoyens de première classe** : elles font partie du flux normal d'exécution, pas un cas exceptionnel rare. Le style Python est **EAFP** (*Easier to Ask Forgiveness than Permission*) — essayer, puis gérer si ça échoue.

*Analogie :*
- **JS vanilla** : `try/catch` existe mais on vérifie souvent avant (`if (arr && arr.length > 0)`)
- **Reef.js** : peu de gestion d'erreurs explicite (state UI)
- **Python EAFP** : essaie d'abord, attrape l'exception si ça rate
- **Python LBYL** (*Look Before You Leap*) : vérifier avant d'agir — utilisé dans certains contextes

---

## 9.2 `try / except`

### 9.2.1 Syntaxe de base

```python
try:
    resultat = 10 / 0
except ZeroDivisionError:
    print("Division par zéro impossible")
    resultat = 0
```

### 9.2.2 Attraper plusieurs exceptions

```python
try:
    valeur = int(input("Entrez un nombre : "))
    resultat = 100 / valeur
except ValueError:
    print("Ce n'est pas un nombre valide")
except ZeroDivisionError:
    print("Le diviseur ne peut pas être zéro")
```

### 9.2.3 `except Exception as e` — récupérer l'objet erreur

```python
try:
    with open("inexistant.json", "r") as f:
        data = json.load(f)
except FileNotFoundError as e:
    print(f"Fichier non trouvé : {e}")
except json.JSONDecodeError as e:
    print(f"JSON invalide : {e}")
```

### 9.2.4 `else` et `finally`

```python
try:
    data = json.load(f)
except json.JSONDecodeError as e:
    print(f"Erreur : {e}")
else:
    # Exécuté SEULEMENT si aucune exception n'a été levée
    print(f"Chargé avec succès : {len(data)} items")
finally:
    # Toujours exécuté, erreur ou pas
    print("Opération terminée")
    f.close()
```

*`else` sur `try`* : s'exécute si le bloc `try` s'est terminé sans exception. Utile pour séparer le code qui peut échouer du code qui suit logiquement.

---

## 9.3 Exceptions intégrées courantes

| Exception | Déclenchée quand |
|---|---|
| `ValueError` | Valeur incorrecte pour un type (`int("abc")`) |
| `TypeError` | Opération sur le mauvais type (`"a" + 1`) |
| `KeyError` | Clé absente dans un dict (`d["inexistant"]`) |
| `IndexError` | Index hors limites (`lst[99]` sur une liste de 3) |
| `FileNotFoundError` | Fichier inexistant |
| `PermissionError` | Droits insuffisants pour un fichier |
| `ZeroDivisionError` | Division par zéro |
| `AttributeError` | Attribut inexistant (`None.upper()`) |
| `ImportError` | Module non trouvé |
| `StopIteration` | Itérateur épuisé |
| `json.JSONDecodeError` | JSON malformé |

---

## 9.4 `raise` — lever une exception

### 9.4.1 Lever une exception intégrée

```python
def calculer_taux(utilises: int, disponibles: int) -> float:
    if disponibles <= 0:
        raise ValueError(f"'disponibles' doit être > 0, reçu : {disponibles}")
    return utilises / disponibles * 100
```

### 9.4.2 Exceptions personnalisées

```python
class TokenInvalideError(ValueError):
    """Levée quand un token de design system est mal formé."""
    pass

class TokenDoublonError(Exception):
    """Levée quand un token avec ce nom existe déjà."""
    def __init__(self, nom: str):
        super().__init__(f"Token '{nom}' existe déjà dans le catalogue")
        self.nom = nom


def ajouter_token(catalogue: list, token: dict) -> None:
    if "nom" not in token or not token["nom"]:
        raise TokenInvalideError("Le token doit avoir un nom non-vide")
    noms = {t["nom"] for t in catalogue}
    if token["nom"] in noms:
        raise TokenDoublonError(token["nom"])
    catalogue.append(token)
```

### 9.4.3 Re-lever une exception

```python
try:
    traiter_donnees()
except ValueError as e:
    logger.error(f"Données invalides : {e}")
    raise   # re-lève la même exception — la propagation continue
```

---

## 9.5 EAFP vs LBYL

### 9.5.1 LBYL — Look Before You Leap

Vérifier les conditions avant d'agir :

```python
# LBYL
if "nom" in token and token["nom"]:
    traiter(token["nom"])
```

### 9.5.2 EAFP — Easier to Ask Forgiveness

Essayer, puis gérer si ça échoue :

```python
# EAFP
try:
    traiter(token["nom"])
except (KeyError, TypeError):
    print("Token sans nom valide")
```

### 9.5.3 Quand utiliser quoi ?

| Situation | Style recommandé |
|---|---|
| Accès fichier (peut ne pas exister) | EAFP : `try/except FileNotFoundError` |
| Conversion de type (`int`, `float`) | EAFP : `try/except ValueError` |
| Vérification de précondition logique | LBYL : `if condition: raise ValueError(...)` |
| Dict : clé potentiellement absente | `.get()` ou EAFP |
| Test simple avant action coûteuse | LBYL (évite de lancer un processus inutilement) |

---

## 9.6 Bonnes pratiques

### 9.6.1 Ne jamais attraper `Exception` nue

```python
# ❌ Attrape tout — cache les bugs
try:
    faire_quelque_chose()
except Exception:
    pass

# ✅ Spécifique — gère ce qu'on attend
try:
    faire_quelque_chose()
except FileNotFoundError:
    return None
```

### 9.6.2 Ne pas utiliser les exceptions pour le flux normal

```python
# ❌ Antipattern
try:
    index = ma_liste.index("valeur")
except ValueError:
    index = -1

# ✅ Idiomatique
index = ma_liste.index("valeur") if "valeur" in ma_liste else -1
```

### 9.6.3 Contexte suffisant dans le message

```python
# ❌ Message vide
raise ValueError("Erreur")

# ✅ Message actionnable
raise ValueError(f"Token '{nom}' : la valeur '{valeur}' n'est pas un hex valide")
```

---

## 9.7 Comparaison des paradigmes — §9

| Concept | JS vanilla | Python |
|---|---|---|
| Attraper une erreur | `try/catch` | `try/except` |
| Type d'erreur | `instanceof Error` | classe d'exception directe |
| Lever une erreur | `throw new Error("msg")` | `raise ValueError("msg")` |
| Erreur personnalisée | `class MyError extends Error` | `class MyError(ValueError): pass` |
| Toujours exécuter | `finally` | `finally` |
| Style de défense | LBYL souvent implicite en JS | EAFP recommandé en Python |
