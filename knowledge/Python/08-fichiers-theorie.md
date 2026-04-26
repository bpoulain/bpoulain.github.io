# 8. Fichiers & persistance

## 8.1 Modèle mental

En Python, la persistance est **explicite et manuelle** : tu ouvres un fichier, tu lis ou écris, tu fermes. Pas de `localStorage` automatique, pas de re-render associé — juste des données sur disque.

*Analogie :*
- **JS vanilla** : `localStorage.setItem("key", JSON.stringify(data))` — persistance dans le navigateur
- **Reef.js** : `save()` — persistance dans `localStorage`, déclenchement découplé du re-render
- **Python** : `open("fichier.json", "w")` + `json.dump(data, f)` — persistance sur le système de fichiers. Aucune magie.

---

## 8.2 Ouvrir et lire des fichiers

### 8.2.1 Le gestionnaire de contexte `with`

La façon idiomatique Python d'ouvrir un fichier :

```python
with open("notes.txt", "r") as f:
    contenu = f.read()
# Le fichier est automatiquement fermé à la sortie du bloc with
```

*Pourquoi `with` ?* Il garantit la fermeture du fichier même si une exception est levée. Équivalent au pattern `try/finally` mais plus concis.

### 8.2.2 Modes d'ouverture

| Mode | Signification |
|---|---|
| `"r"` | Lecture (défaut) — fichier doit exister |
| `"w"` | Écriture — crée ou écrase le fichier |
| `"a"` | Ajout en fin de fichier (append) |
| `"x"` | Création exclusive — erreur si le fichier existe |
| `"r+"` | Lecture + écriture |
| `"rb"` / `"wb"` | Lecture/écriture en binaire |

### 8.2.3 Lire un fichier texte

```python
# Tout le contenu d'un coup
with open("notes.txt", "r", encoding="utf-8") as f:
    contenu = f.read()           # string complète
    # ou
    lignes = f.readlines()       # liste de strings (avec \n)

# Ligne par ligne (idiomatique pour les grands fichiers)
with open("notes.txt", "r", encoding="utf-8") as f:
    for ligne in f:
        print(ligne.strip())     # strip() supprime \n et espaces
```

*Toujours spécifier `encoding="utf-8"`* pour les fichiers texte — comportement par défaut variable selon l'OS.

### 8.2.4 Écrire dans un fichier texte

```python
# Écraser le fichier
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Première ligne\n")
    f.write("Deuxième ligne\n")

# Ajouter à la fin
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Nouvelle entrée\n")

# Écrire une liste de lignes
lignes = ["Button\n", "Input\n", "Card\n"]
with open("composants.txt", "w", encoding="utf-8") as f:
    f.writelines(lignes)
```

---

## 8.3 JSON — format central

### 8.3.1 Module `json`

```python
import json
```

### 8.3.2 Lire du JSON (désérialiser)

```python
# Depuis un fichier
with open("tokens.json", "r", encoding="utf-8") as f:
    tokens = json.load(f)   # retourne un dict ou une liste Python

# Depuis une string
json_str = '{"nom": "Button", "taille": 32}'
token = json.loads(json_str)   # loads = load string
```

### 8.3.3 Écrire du JSON (sérialiser)

```python
tokens = [
    {"nom": "color-primary", "valeur": "#3B82F6"},
    {"nom": "spacing-4", "valeur": "16px"},
]

# Dans un fichier
with open("tokens.json", "w", encoding="utf-8") as f:
    json.dump(tokens, f, indent=2, ensure_ascii=False)

# Dans une string
json_str = json.dumps(tokens, indent=2, ensure_ascii=False)
```

*Paramètres utiles :*
- `indent=2` : formatage lisible (JSON indenté)
- `ensure_ascii=False` : préserve les caractères Unicode (accents, etc.)

### 8.3.4 Pont Reef → Python

```python
# Reef save() — localStorage (navigateur)
# save("design-system", designSystem.value)

# Python équivalent — fichier JSON
import json

def sauvegarder(nom_fichier: str, data: dict | list) -> None:
    with open(f"{nom_fichier}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def charger(nom_fichier: str) -> dict | list | None:
    try:
        with open(f"{nom_fichier}.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return None
```

---

## 8.4 Le module `pathlib` — chemins modernes

### 8.4.1 Pourquoi `pathlib` ?

`pathlib.Path` est la façon moderne (Python 3.6+) de manipuler les chemins — cross-platform, orienté objet, plus lisible que les strings.

```python
from pathlib import Path

# Créer un chemin
p = Path("dossier/fichier.json")

# Vérifications
p.exists()          # True/False
p.is_file()         # True si c'est un fichier
p.is_dir()          # True si c'est un dossier

# Navigation
p.parent            # Path("dossier")
p.name              # "fichier.json"
p.stem              # "fichier"
p.suffix            # ".json"

# Construction
base = Path("data")
fichier = base / "tokens" / "color.json"   # data/tokens/color.json
```

### 8.4.2 Opérations courantes

```python
from pathlib import Path

# Créer un dossier (et ses parents)
Path("sections/exports").mkdir(parents=True, exist_ok=True)

# Lister des fichiers
for fichier in Path("sections").glob("*.md"):
    print(fichier.name)

# Lire un fichier directement
contenu = Path("notes.txt").read_text(encoding="utf-8")

# Écrire directement
Path("output.txt").write_text("contenu", encoding="utf-8")
```

---

## 8.5 Vérifier l'existence avant d'ouvrir

```python
from pathlib import Path
import json

def charger_tokens(chemin: str) -> list[dict]:
    p = Path(chemin)
    if not p.exists():
        return []
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)
```

---

## 8.6 Comparaison des paradigmes — §8

| Concept | JS (navigateur) | Reef.js | Python |
|---|---|---|---|
| Persistance courte durée | `sessionStorage` | — | Variable en mémoire |
| Persistance locale | `localStorage` | `save()` | Fichier (texte / JSON) |
| Sérialisation | `JSON.stringify()` | `save()` interne | `json.dumps()` |
| Désérialisation | `JSON.parse()` | `signal(saved())` | `json.loads()` / `json.load()` |
| Chemin de fichier | — (pas de système de fichiers) | — | `pathlib.Path` |
| Fermeture automatique | — | — | `with open(...) as f:` |
