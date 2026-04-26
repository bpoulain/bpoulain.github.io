# 11. Outils Python — Exercices

> Ces exercices se font en ligne de commande et dans l'éditeur. Tente chaque étape avant de consulter les corrections.

---

## Énoncés

### Exercice 1 — Traduction mentale (npm → pip + venv)

**Objectif** : comprendre les équivalences entre l'écosystème JS et Python.

En JS, tu initialises un projet ainsi :

```bash
mkdir mon-projet && cd mon-projet
npm init -y
npm install lodash
npm install --save-dev jest
cat package.json
```

**Question** : Traduis cette séquence en Python avec `pip` + `venv`. Crée un environnement virtuel, installe `requests` (équivalent général de `lodash` pour les appels HTTP) et `pytest` (équivalent de `jest`), puis génère un `requirements.txt`.

Écris les commandes exactes.

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre les erreurs courantes de setup Python.

```bash
# Scénario : tu installes requests sans venv
pip install requests

# Tu travailles sur le projet, tout fonctionne.
# 6 mois plus tard, tu mets à jour requests pour un autre projet :
pip install --upgrade requests

# Résultat : ton premier projet plante.
```

**Question 2a** : Pourquoi ce problème survient-il ? Comment le `venv` l'aurait évité ?

**Question 2b** : Tu reprends un projet Python (cloné depuis Git) qui a un `requirements.txt`. Quelles sont les 3 commandes exactes pour le remettre en marche ?

---

### Exercice 3 — Mini cas réel

**Objectif** : écrire et lancer des tests pour le module de tokens.

Écris un fichier `test_tokens.py` complet qui teste les fonctions développées dans les sections précédentes. Couvre au minimum :

1. `valider_token` — 3 cas : valide, nom vide, clé manquante
2. `creer_token` (ou `normaliser_token`) — transformation attendue
3. `filtrer_actifs` — liste mixte actifs/inactifs
4. Un test qui vérifie qu'une exception est bien levée (`TokenInvalideError` ou `ValueError`)

**Règles** :
- Convention pytest : fonctions `test_*`
- Utiliser `assert` natif
- Utiliser `pytest.raises` pour les exceptions
- Un seul fichier `test_tokens.py`

---

---

## Corrections

### Correction Exercice 1

#### Commandes Python équivalentes

```bash
# Créer le dossier et s'y placer
mkdir mon-projet && cd mon-projet

# Créer l'environnement virtuel
python -m venv .venv

# Activer (macOS/Linux)
source .venv/bin/activate
# (Windows : .venv\Scripts\activate)

# Installer les dépendances
pip install requests
pip install pytest

# Générer requirements.txt
pip freeze > requirements.txt

# Vérifier
cat requirements.txt
```

#### Tableau de correspondance

| npm / Node | Python |
|---|---|
| `npm init -y` | Pas d'équivalent direct — `requirements.txt` suffit pour les projets simples |
| `node_modules/` | `.venv/` |
| `npm install <pkg>` | `pip install <pkg>` |
| `package.json` | `requirements.txt` (ou `pyproject.toml` pour les projets avancés) |
| `npm install --save-dev` | Même `pip install` — pas de distinction dev/prod dans `requirements.txt` de base |
| `npx jest` | `pytest` |
| `npm run start` | `python main.py` |

---

### Correction Exercice 2

#### Réponse 2a

Sans `venv`, tous les paquets sont installés dans l'environnement Python **global du système**. Deux projets partagent les mêmes versions. Quand tu mets à jour `requests` pour le projet B, le projet A reçoit la mise à jour aussi — et peut casser si l'API a changé.

Avec `venv` : chaque projet a ses propres paquets dans `.venv/`. Mettre à jour un projet n'affecte jamais les autres.

#### Réponse 2b

```bash
# 1. Créer l'environnement virtuel
python -m venv .venv

# 2. L'activer
source .venv/bin/activate

# 3. Installer les dépendances figées
pip install -r requirements.txt
```

---

### Correction Exercice 3

#### `test_tokens.py`

```python
import pytest
from validation import valider_token, TokenInvalideError
from catalogue import filtrer_actifs


# --- valider_token ---

def test_valider_token_valide():
    token = {"nom": "color-primary", "valeur": "#3B82F6", "actif": True}
    assert valider_token(token) is True


def test_valider_token_nom_vide():
    token = {"nom": "", "valeur": "#3B82F6", "actif": True}
    assert valider_token(token) is False


def test_valider_token_cle_manquante():
    token = {"valeur": "#3B82F6", "actif": True}   # pas de "nom"
    assert valider_token(token) is False


# --- normalisation ---

def test_normaliser_nom_en_minuscules():
    from catalogue import normaliser_token
    token = {"nom": "COLOR-PRIMARY", "valeur": "#3B82F6", "actif": True}
    result = normaliser_token(token)
    assert result["nom"] == "color-primary"
    assert result["valeur"] == "#3B82F6"   # valeur inchangée


# --- filtrer_actifs ---

def test_filtrer_actifs_retourne_seulement_actifs():
    tokens = [
        {"nom": "a", "valeur": "1", "actif": True},
        {"nom": "b", "valeur": "2", "actif": False},
        {"nom": "c", "valeur": "3", "actif": True},
    ]
    result = filtrer_actifs(tokens)
    assert len(result) == 2
    assert all(t["actif"] for t in result)


def test_filtrer_actifs_liste_vide():
    assert filtrer_actifs([]) == []


# --- exceptions ---

def test_valider_et_ajouter_leve_erreur_nom_vide():
    from validation import TokenInvalideError
    from catalogue import valider_et_ajouter
    catalogue = []
    with pytest.raises(TokenInvalideError):
        valider_et_ajouter(catalogue, {"nom": "", "valeur": "#fff"})


def test_valider_et_ajouter_leve_erreur_doublon():
    from validation import TokenDoublonError
    from catalogue import valider_et_ajouter
    catalogue = [{"nom": "color-primary", "valeur": "#3B82F6"}]
    with pytest.raises(TokenDoublonError):
        valider_et_ajouter(catalogue, {"nom": "color-primary", "valeur": "#999"})
```

#### Lancer les tests

```bash
pytest test_tokens.py -v
```

#### Sortie attendue

```
PASSED test_tokens.py::test_valider_token_valide
PASSED test_tokens.py::test_valider_token_nom_vide
PASSED test_tokens.py::test_valider_token_cle_manquante
PASSED test_tokens.py::test_normaliser_nom_en_minuscules
PASSED test_tokens.py::test_filtrer_actifs_retourne_seulement_actifs
PASSED test_tokens.py::test_filtrer_actifs_liste_vide
PASSED test_tokens.py::test_valider_et_ajouter_leve_erreur_nom_vide
PASSED test_tokens.py::test_valider_et_ajouter_leve_erreur_doublon
```
