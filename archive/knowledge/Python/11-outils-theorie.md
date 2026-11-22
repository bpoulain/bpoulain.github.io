# 11. Outils Python

## 11.1 Modèle mental

Python sans outillage = JS sans npm, sans Node. L'environnement Python inclut un gestionnaire de paquets, un système d'isolation des dépendances, un REPL interactif, un debugger et un framework de tests — tout intégré ou installable facilement.

---

## 11.2 `venv` — environnements virtuels

### 11.2.1 Pourquoi ?

Sans `venv`, tous les paquets sont installés globalement. Problème : projet A veut `requests==2.28`, projet B veut `requests==2.31` — conflit. Un `venv` isole les dépendances **par projet**.

*Analogie JS* : `node_modules/` local au projet. En Python, le `venv` joue ce rôle.

### 11.2.2 Créer et activer

```bash
# Créer le venv dans le dossier .venv
python -m venv .venv

# Activer (macOS / Linux)
source .venv/bin/activate

# Activer (Windows)
.venv\Scripts\activate

# Vérifier
which python   # doit pointer vers .venv/bin/python
```

### 11.2.3 Désactiver

```bash
deactivate
```

### 11.2.4 Ajouter au `.gitignore`

```
.venv/
__pycache__/
*.pyc
```

---

## 11.3 `pip` — gestionnaire de paquets

### 11.3.1 Installer un paquet

```bash
pip install requests
pip install "requests==2.31.0"      # version exacte
pip install "requests>=2.28,<3.0"   # contrainte de version
```

### 11.3.2 Lister et figer les dépendances

```bash
pip list                          # tous les paquets installés
pip freeze > requirements.txt     # figer les versions actuelles
```

Contenu typique de `requirements.txt` :
```
requests==2.31.0
rich==13.7.0
typer==0.9.0
```

### 11.3.3 Installer depuis `requirements.txt`

```bash
pip install -r requirements.txt
```

*Workflow standard sur un nouveau projet :*
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 11.3.4 Alternative moderne — `uv`

`uv` est un gestionnaire ultra-rapide (écrit en Rust) qui remplace `pip` + `venv` :

```bash
# Installation de uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Créer + activer l'env + installer en une commande
uv sync

# Ajouter un paquet (met à jour pyproject.toml automatiquement)
uv add requests
```

*`uv` est 10-100x plus rapide que `pip`*. Pour les nouveaux projets, c'est la recommandation 2024+.

---

## 11.4 Exécuter des scripts

```bash
# Exécution simple
python script.py

# Avec des arguments
python script.py --input tokens.json --output tokens.css

# Module comme script (ex: serveur HTTP intégré)
python -m http.server 8080

# Version Python
python --version   # Python 3.12.x
```

### 11.4.1 Shebang (Unix)

```python
#!/usr/bin/env python3
# Ce fichier peut être exécuté directement avec : ./script.py (après chmod +x)
```

---

## 11.5 REPL — explorateur interactif

### 11.5.1 Python REPL standard

```bash
python
```

```python
>>> import json
>>> json.loads('{"a": 1}')
{'a': 1}
>>> [x**2 for x in range(5)]
[0, 1, 4, 9, 16]
>>> quit()
```

*Usage :* tester des expressions, explorer une API, vérifier un comportement rapidement — l'équivalent de la console navigateur JS.

### 11.5.2 IPython — REPL amélioré

```bash
pip install ipython
ipython
```

Avantages : coloration syntaxique, autocomplétion, historique persistent, commandes magiques (`%timeit`, `%who`, `%paste`).

---

## 11.6 Debugger — `breakpoint()`

Python 3.7+ intègre un debugger directement dans le langage :

```python
def traiter_tokens(tokens):
    resultats = []
    for token in tokens:
        breakpoint()   # ← le programme s'arrête ici
        traite = transformer(token)
        resultats.append(traite)
    return resultats
```

Quand le code atteint `breakpoint()`, il entre dans `pdb` (Python Debugger) :

```
(Pdb) p token          # afficher la valeur de token
(Pdb) n                # next — passer à la ligne suivante
(Pdb) s                # step — entrer dans la fonction appelée
(Pdb) c                # continue — jusqu'au prochain breakpoint
(Pdb) q                # quit — stopper le programme
(Pdb) l                # list — afficher le code autour
(Pdb) pp token         # pretty print
```

*Équivalent JS :* `debugger;` dans le code (s'arrête dans DevTools).

---

## 11.7 Tests avec `pytest`

### 11.7.1 Installation et convention

```bash
pip install pytest
```

Convention : fichiers nommés `test_*.py` ou `*_test.py`, fonctions nommées `test_*`.

### 11.7.2 Écrire un test

```python
# test_tokens.py

from tokens import creer_token, valider_token


def test_creer_token_basique():
    token = creer_token("color-primary", "#3B82F6")
    assert token["nom"] == "color-primary"
    assert token["valeur"] == "#3B82F6"


def test_valider_token_valide():
    assert valider_token({"nom": "color-primary", "valeur": "#3B82F6", "actif": True})


def test_valider_token_nom_vide():
    assert not valider_token({"nom": "", "valeur": "#3B82F6", "actif": True})


def test_creer_token_leve_erreur():
    import pytest
    with pytest.raises(ValueError):
        creer_token("", "#3B82F6")
```

### 11.7.3 Lancer les tests

```bash
pytest                    # tous les tests
pytest test_tokens.py     # un seul fichier
pytest -v                 # verbose
pytest -k "valider"       # tests contenant "valider" dans le nom
```

### 11.7.4 Modèle mental `assert`

```python
assert resultat == attendu        # passe si True, lève AssertionError si False
assert "nom" in token             # vérifie l'appartenance
assert len(liste) == 3            # vérifie la longueur
assert isinstance(x, dict)       # vérifie le type
```

---

## 11.8 Structure de projet recommandée

```
mon_projet/
├── .venv/                 # environnement virtuel (gitignore)
├── sections/              # fichiers de cours
├── src/                   # code source
│   ├── tokens.py
│   ├── validation.py
│   └── export.py
├── tests/
│   ├── test_tokens.py
│   └── test_validation.py
├── requirements.txt       # dépendances
├── .gitignore
└── README.md
```
