# 7. Fonctions — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : passer des fonctions JS aux fonctions Python typées.

```js
/**
 * @param {string} nom
 * @param {string} valeur
 * @param {string} [categorie="color"]
 * @returns {{ nom: string, valeur: string, categorie: string, css: string }}
 */
function creerToken(nom, valeur, categorie = "color") {
  return {
    nom,
    valeur,
    categorie,
    css: `--${nom}: ${valeur};`,
  };
}

/**
 * @param {Array<{nom: string, valeur: string, categorie: string}>} tokens
 * @param {string} categorie
 * @returns {Array}
 */
function filtrerParCategorie(tokens, categorie) {
  return tokens.filter((t) => t.categorie === categorie);
}
```

**Question** : Traduis ces deux fonctions en Python avec des **type hints** Python 3.12+. Utilise la syntaxe moderne (`list[dict]`, pas `List[Dict]`).

---

### Exercice 2 — Piège de paradigme

**Objectif** : identifier et corriger un bug de portée (LEGB).

```python
taux_tva = 0.20

def calculer_prix_ttc(prix_ht):
    taux_tva = 0.10   # intention : taux réduit local
    return prix_ht * (1 + taux_tva)

def afficher_taux():
    print(f"Taux appliqué : {taux_tva}")

calculer_prix_ttc(100)  # 110.0
afficher_taux()         # ???
```

**Question 2a** : Que retourne `calculer_prix_ttc(100)` ? Quel `taux_tva` est utilisé ? Pourquoi ?

**Question 2b** : Que va afficher `afficher_taux()` ? Pourquoi ?

**Question 2c** : Modifie `calculer_prix_ttc` pour accepter un taux en paramètre avec `0.20` comme valeur par défaut — sans utiliser de variable globale.

---

### Exercice 3 — Mini cas réel

**Objectif** : construire un mini-pipeline fonctionnel pour un catalogue de tokens.

Implémente ces quatre fonctions **pures** avec des type hints :

1. `valider_token(token: dict) -> bool` — retourne `True` si le token a bien les clés `"nom"`, `"valeur"` et `"actif"`, et si `"nom"` est non-vide.

2. `normaliser_token(token: dict) -> dict` — retourne un **nouveau** dict avec `nom` en minuscules, `valeur` inchangée, `actif` inchangé.

3. `filtrer_actifs(tokens: list[dict]) -> list[dict]` — retourne une nouvelle liste avec uniquement les tokens actifs.

4. `exporter_css(tokens: list[dict]) -> str` — retourne une string CSS avec un token par ligne : `--nom: valeur;`

Puis teste le pipeline :

```python
catalogue_brut = [
    {"nom": "COLOR-PRIMARY", "valeur": "#3B82F6", "actif": True},
    {"nom": "Spacing-4", "valeur": "16px", "actif": True},
    {"nom": "COLOR-DEPRECATED", "valeur": "#aaa", "actif": False},
    {"nom": "", "valeur": "??", "actif": True},         # invalide
    {"valeur": "#fff"},                                  # invalide
]
```

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
- JSDoc → type hints Python natifs
- `{ nom, valeur, ... }` shorthand JS → dict Python explicite `{"nom": nom, ...}`
- `[].filter(fn)` → list comprehension avec `if`

#### Code Python propre

```python
def creer_token(nom: str, valeur: str, categorie: str = "color") -> dict:
    return {
        "nom": nom,
        "valeur": valeur,
        "categorie": categorie,
        "css": f"--{nom}: {valeur};",
    }


def filtrer_par_categorie(tokens: list[dict], categorie: str) -> list[dict]:
    return [t for t in tokens if t["categorie"] == categorie]
```

#### Notes

- `list[dict]` est la syntaxe moderne (Python 3.9+, recommandée en 3.12+). Pas besoin de `from typing import List`.
- `-> dict` est le type de retour. Pour être plus précis : `-> dict[str, str | bool]`.
- Le raccourci `{ nom, valeur }` JS n'existe pas en Python — toujours écrire `{"nom": nom, "valeur": valeur}`.

---

### Correction Exercice 2

#### Réponse 2a

`calculer_prix_ttc(100)` retourne `110.0`.

La variable `taux_tva = 0.10` à l'intérieur de la fonction est **locale** — elle crée une nouvelle variable dans la portée locale, sans toucher à la variable globale. La règle LEGB dit : Python cherche d'abord dans le scope **L**ocal, et trouve `0.10`.

#### Réponse 2b

`afficher_taux()` affiche `Taux appliqué : 0.2`.

`afficher_taux` n'a pas de `taux_tva` local, ni de portée englobante — elle remonte au scope **G**lobal et trouve `0.20`.

#### Code corrigé 2c

```python
def calculer_prix_ttc(prix_ht: float, taux_tva: float = 0.20) -> float:
    return prix_ht * (1 + taux_tva)

# Appels
calculer_prix_ttc(100)          # 120.0 — taux standard
calculer_prix_ttc(100, 0.10)    # 110.0 — taux réduit
calculer_prix_ttc(100, taux_tva=0.055)  # 105.5 — taux super-réduit
```

**Bonne pratique** : passer les données en paramètre plutôt que de lire des variables globales. La fonction devient pure, testable et réutilisable.

---

### Correction Exercice 3

#### Code Python propre

```python
def valider_token(token: dict) -> bool:
    required = {"nom", "valeur", "actif"}
    return required.issubset(token.keys()) and bool(token.get("nom"))


def normaliser_token(token: dict) -> dict:
    return {
        "nom": token["nom"].lower(),
        "valeur": token["valeur"],
        "actif": token["actif"],
    }


def filtrer_actifs(tokens: list[dict]) -> list[dict]:
    return [t for t in tokens if t["actif"]]


def exporter_css(tokens: list[dict]) -> str:
    lignes = [f"--{t['nom']}: {t['valeur']};" for t in tokens]
    return "\n".join(lignes)


# Pipeline
catalogue_brut = [
    {"nom": "COLOR-PRIMARY", "valeur": "#3B82F6", "actif": True},
    {"nom": "Spacing-4", "valeur": "16px", "actif": True},
    {"nom": "COLOR-DEPRECATED", "valeur": "#aaa", "actif": False},
    {"nom": "", "valeur": "??", "actif": True},
    {"valeur": "#fff"},
]

tokens_valides = [t for t in catalogue_brut if valider_token(t)]
tokens_normalises = [normaliser_token(t) for t in tokens_valides]
tokens_actifs = filtrer_actifs(tokens_normalises)
css = exporter_css(tokens_actifs)

print(css)
```

#### Sortie

```
--color-primary: #3B82F6;
--spacing-4: 16px;
```

#### Notes

- `required.issubset(token.keys())` — vérifie que toutes les clés requises sont présentes. Plus robuste que `"nom" in token and "valeur" in token and ...`.
- Chaque fonction est **pure** : elle ne modifie pas son argument et retourne toujours le même résultat pour la même entrée.
- Le pipeline est un enchaînement de compréhensions + appels de fonctions — style fonctionnel Python idiomatique.
- `"\n".join(lignes)` — Pythonic pour construire une string multi-lignes depuis une liste.
