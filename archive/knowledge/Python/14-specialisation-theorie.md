# 14. Spécialisation

## 14.1 Modèle mental

Les §1–13 t'ont donné le socle Python universel. La spécialisation, c'est choisir dans quelle direction approfondir — selon tes projets réels et tes objectifs professionnels.

---

## 14.2 Arbre de décision (rappel)

```
"Je veux traiter/analyser des données (CSV, JSON, API, stats)"
       → Branche Data / Automatisation

"Je veux exposer des endpoints HTTP ou construire un backend"
       → Branche Web backend

"Je veux automatiser mon poste, créer des outils CLI, scripts système"
       → Branche Outils / Scripts

Hésitation ? → Outils / Scripts (gain immédiat, courbe douce)
```

---

## 14.3 Branche : Data / Automatisation

### 14.3.1 Prérequis acquis (§1–13)

- Lecture/écriture JSON et fichiers texte (§8)
- Itération, compréhensions, built-ins (§3, §5, §6)
- Fonctions pures avec type hints (§7)

### 14.3.2 Bibliothèques clés

```bash
pip install pandas polars rich
```

| Bibliothèque | Rôle |
|---|---|
| `csv` | CSV (standard, sans install) |
| `pandas` | DataFrames, analyse de données |
| `polars` | Alternatif à pandas, plus rapide |
| `rich` | Sortie terminal colorée et formatée |
| `httpx` / `requests` | Appels API HTTP |

### 14.3.3 Lire un CSV avec la bibliothèque standard

```python
import csv
from pathlib import Path


def lire_csv(chemin: str) -> list[dict]:
    with open(chemin, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)


def ecrire_csv(donnees: list[dict], chemin: str, champs: list[str]) -> None:
    with open(chemin, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=champs)
        writer.writeheader()
        writer.writerows(donnees)
```

### 14.3.4 Appel d'API JSON

```python
import urllib.request
import json


def appeler_api(url: str) -> dict | list:
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))

# Avec requests (plus ergonomique)
import requests

def appeler_api_requests(url: str) -> dict | list:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
```

### 14.3.5 Prochaines étapes Data

1. Maîtriser `pandas` : `DataFrame`, `groupby`, `merge`, `apply`
2. Visualisation : `matplotlib` (graphiques), `plotly` (interactif)
3. Notebooks Jupyter pour l'exploration
4. Pour les grands volumes : `polars` (API similaire à pandas, 10-100x plus rapide)

---

## 14.4 Branche : Web Backend

### 14.4.1 Prérequis acquis (§1–13)

- Fonctions, type hints, modules (§7, §10)
- Gestion d'erreurs (§9)
- JSON (§8)

### 14.4.2 FastAPI — recommandé (moderne + typé)

```bash
pip install fastapi uvicorn
```

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class Token(BaseModel):
    nom: str
    valeur: str
    actif: bool = True


catalogue: list[Token] = []


@app.get("/tokens")
def lister_tokens() -> list[Token]:
    return catalogue


@app.post("/tokens")
def ajouter_token(token: Token) -> Token:
    if any(t.nom == token.nom for t in catalogue):
        raise HTTPException(status_code=409, detail=f"Token '{token.nom}' existe déjà")
    catalogue.append(token)
    return token


@app.get("/tokens/{nom}")
def chercher_token(nom: str) -> Token:
    for t in catalogue:
        if t.nom == nom:
            return t
    raise HTTPException(status_code=404, detail="Token non trouvé")
```

```bash
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs (Swagger UI automatique)
```

*Pont JS/Reef → FastAPI :* FastAPI est l'API que ton Reef.js appellerait avec `fetch()`. Python gère la logique serveur, Reef/JS gère le rendu client.

### 14.4.3 Pydantic — validation de schémas

```python
from pydantic import BaseModel, field_validator


class Token(BaseModel):
    nom: str
    valeur: str
    actif: bool = True

    @field_validator("nom")
    @classmethod
    def nom_valide(cls, v: str) -> str:
        if not v or " " in v:
            raise ValueError("nom invalide")
        return v.lower()
```

*Modèle mental :* Pydantic = `@dataclass` + validation + sérialisation JSON automatique.

### 14.4.4 Prochaines étapes Web

1. `FastAPI` + `SQLite` / `PostgreSQL` via `SQLAlchemy` ou `SQLModel`
2. Authentification JWT
3. Tests d'API avec `pytest` + `httpx`
4. Déploiement : `Docker` + `Railway` / `Fly.io`

---

## 14.5 Branche : Outils / Scripts

### 14.5.1 Prérequis acquis (§1–13)

- Fichiers, JSON (§8)
- Gestion d'erreurs (§9)
- Modules, `sys.argv` (§10, §11)

### 14.5.2 CLI avec `argparse` — standard

```python
import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Gestionnaire de tokens de design system")
    subparsers = parser.add_subparsers(dest="commande")

    # Sous-commande add
    add_parser = subparsers.add_parser("add", help="Ajouter un token")
    add_parser.add_argument("nom", help="Nom du token")
    add_parser.add_argument("valeur", help="Valeur du token")

    # Sous-commande list
    list_parser = subparsers.add_parser("list", help="Lister les tokens")
    list_parser.add_argument("--categorie", help="Filtrer par catégorie")

    args = parser.parse_args()

    match args.commande:
        case "add":
            print(f"Ajout : {args.nom} = {args.valeur}")
        case "list":
            print(f"Liste (catégorie: {args.categorie})")
        case None:
            parser.print_help()


if __name__ == "__main__":
    main()
```

### 14.5.3 CLI avec `typer` — moderne + typé

```bash
pip install typer
```

```python
import typer

app = typer.Typer()


@app.command()
def add(nom: str, valeur: str):
    """Ajoute un token au catalogue."""
    print(f"✅ {nom}: {valeur}")


@app.command()
def list(categorie: str = typer.Option(None, help="Filtrer par catégorie")):
    """Liste les tokens."""
    print(f"Tokens (catégorie: {categorie})")


if __name__ == "__main__":
    app()
```

*`typer` utilise les type hints Python pour générer automatiquement le parser CLI + l'aide.*

### 14.5.4 Manipulation du système de fichiers

```python
from pathlib import Path
import shutil


# Trouver des fichiers
list(Path("exports").glob("**/*.png"))   # récursif
list(Path("exports").glob("*.svg"))      # non récursif

# Copier, déplacer, supprimer
shutil.copy("src.txt", "dst.txt")
shutil.move("ancien.txt", "nouveau.txt")
Path("temp.txt").unlink()               # supprimer un fichier
shutil.rmtree("dossier_temp")           # supprimer un dossier et son contenu

# Créer des dossiers
Path("exports/2024/tokens").mkdir(parents=True, exist_ok=True)
```

### 14.5.5 Prochaines étapes Outils

1. `rich` pour des CLI élégantes (tables, barres de progression, couleurs)
2. `watchdog` pour surveiller des fichiers (réactions aux changements)
3. Scripts de build personnalisés (`Makefile` Python-style avec `invoke`)
4. Packaging : distribuer ton outil avec `pipx`

---

## 14.6 Ressources et suite recommandée

### 14.6.1 Documentation officielle

- Python 3.12 : `docs.python.org/3.12`
- FastAPI : `fastapi.tiangolo.com`
- Pydantic : `docs.pydantic.dev`
- `typer` : `typer.tiangolo.com`
- `pandas` : `pandas.pydata.org`

### 14.6.2 Projet intégrateur recommandé

Construis un outil CLI complet de gestion de tokens de design system :
- Commandes : `add`, `list`, `export-css`, `export-json`, `stats`, `validate`
- Persistance JSON
- Tests pytest couvrant validation + export
- Type hints complets
- README avec exemples d'utilisation

Ce projet couvrira §1–§11 dans un contexte réel et concret.
