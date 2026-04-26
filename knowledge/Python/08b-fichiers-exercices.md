# 8. Fichiers & persistance — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS/Reef → Python)

**Objectif** : comprendre l'équivalent Python de la persistance Reef.

En Reef.js, tu gères la persistance ainsi :

```js
import { signal, save, saved } from "reef.js";

const tokens = signal(saved("design-tokens") ?? []);

function ajouterToken(nom, valeur) {
  tokens.value = [...tokens.value, { nom, valeur }];
  save("design-tokens", tokens.value);
}

function chargerTokens() {
  return saved("design-tokens") ?? [];
}
```

**Question** : Traduis ces fonctions en Python. La persistance doit utiliser un fichier JSON nommé `design-tokens.json`. Pas de signal, pas de re-render — juste des données et des fichiers.

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre pourquoi le contexte `with` est obligatoire.

```python
# Version A — sans with
f = open("tokens.txt", "w")
f.write("color-primary: #3B82F6\n")
f.write("spacing-4: 16px\n")
# on oublie f.close()

# Version B — avec with
with open("tokens.txt", "w", encoding="utf-8") as f:
    f.write("color-primary: #3B82F6\n")
    f.write("spacing-4: 16px\n")
```

**Question 2a** : Quel risque pose la Version A si une exception est levée entre les deux `f.write()` ?

**Question 2b** : Que se passe-t-il si le fichier `tokens.txt` existe déjà et que tu utilises le mode `"w"` ? Et le mode `"a"` ?

---

### Exercice 3 — Mini cas réel

**Objectif** : implémenter un système de persistance de tokens de design system.

Implémente un module `tokens_manager` avec ces quatre fonctions :

1. `sauvegarder_tokens(tokens: list[dict], chemin: str = "tokens.json") -> None`
   — Sauvegarde la liste en JSON indenté.

2. `charger_tokens(chemin: str = "tokens.json") -> list[dict]`
   — Charge le fichier JSON. Retourne `[]` si le fichier n'existe pas.

3. `ajouter_token(nom: str, valeur: str, chemin: str = "tokens.json") -> None`
   — Charge les tokens existants, ajoute le nouveau, re-sauvegarde.
   — N'ajoute pas si un token avec le même `nom` existe déjà.

4. `exporter_css(chemin_json: str, chemin_css: str) -> None`
   — Charge les tokens JSON actifs et génère un fichier CSS :
   ```css
   :root {
     --color-primary: #3B82F6;
     --spacing-4: 16px;
   }
   ```

Puis teste avec :

```python
sauvegarder_tokens([
    {"nom": "color-primary", "valeur": "#3B82F6", "actif": True},
    {"nom": "spacing-4", "valeur": "16px", "actif": True},
])

ajouter_token("color-surface", "#F8FAFC")
ajouter_token("color-primary", "#999")  # doublon → ignoré

tokens = charger_tokens()
print(len(tokens))  # 3

exporter_css("tokens.json", "tokens.css")
```

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
`save("key", data)` Reef → `json.dump(data, f)` Python. `saved("key") ?? []` Reef → `json.load(f)` dans un try/except, avec `[]` comme fallback.

#### Code Python propre

```python
import json
from pathlib import Path

FICHIER = "design-tokens.json"


def charger_tokens() -> list[dict]:
    p = Path(FICHIER)
    if not p.exists():
        return []
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def sauvegarder(tokens: list[dict]) -> None:
    with open(FICHIER, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)


def ajouter_token(nom: str, valeur: str) -> None:
    tokens = charger_tokens()
    tokens.append({"nom": nom, "valeur": valeur})
    sauvegarder(tokens)
```

#### Différences Reef → Python

| Reef | Python |
|---|---|
| `save("key", data)` | `json.dump(data, f)` dans `with open(...)` |
| `saved("key") ?? []` | `json.load(f)` + fallback `[]` si FileNotFoundError |
| Signal réactif | Variable Python ordinaire |
| `localStorage` (navigateur) | Fichier sur disque |

---

### Correction Exercice 2

#### Réponse 2a

Sans `with`, si une exception est levée entre les deux `f.write()`, `f.close()` n'est jamais appelé. Conséquences possibles :
- Les données écrites ne sont pas entièrement flushées sur disque (données perdues)
- Le descripteur de fichier reste ouvert (fuite de ressource)
- Sur certains OS, le fichier peut être verrouillé jusqu'à la fin du processus

`with open(...) as f:` garantit que `f.__exit__()` est appelé (qui appelle `f.close()`) même si une exception est levée.

#### Réponse 2b

- Mode `"w"` : **écrase le fichier existant** — son contenu est perdu immédiatement à l'ouverture, même si tu n'écris rien.
- Mode `"a"` : **ajoute à la fin** du fichier existant, sans toucher au contenu précédent.

---

### Correction Exercice 3

#### Code Python propre

```python
import json
from pathlib import Path


def sauvegarder_tokens(tokens: list[dict], chemin: str = "tokens.json") -> None:
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)


def charger_tokens(chemin: str = "tokens.json") -> list[dict]:
    p = Path(chemin)
    if not p.exists():
        return []
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def ajouter_token(nom: str, valeur: str, chemin: str = "tokens.json") -> None:
    tokens = charger_tokens(chemin)
    noms_existants = {t["nom"] for t in tokens}
    if nom in noms_existants:
        print(f"Token '{nom}' déjà présent — ignoré.")
        return
    tokens.append({"nom": nom, "valeur": valeur, "actif": True})
    sauvegarder_tokens(tokens, chemin)


def exporter_css(chemin_json: str, chemin_css: str) -> None:
    tokens = charger_tokens(chemin_json)
    actifs = [t for t in tokens if t.get("actif", True)]
    lignes = [f"  --{t['nom']}: {t['valeur']};" for t in actifs]
    contenu = ":root {\n" + "\n".join(lignes) + "\n}\n"
    with open(chemin_css, "w", encoding="utf-8") as f:
        f.write(contenu)


# Test
sauvegarder_tokens([
    {"nom": "color-primary", "valeur": "#3B82F6", "actif": True},
    {"nom": "spacing-4", "valeur": "16px", "actif": True},
])

ajouter_token("color-surface", "#F8FAFC")
ajouter_token("color-primary", "#999")   # ignoré

tokens = charger_tokens()
print(len(tokens))   # 3

exporter_css("tokens.json", "tokens.css")
```

#### Sortie `tokens.css`

```css
:root {
  --color-primary: #3B82F6;
  --spacing-4: 16px;
  --color-surface: #F8FAFC;
}
```

#### Notes

- `{t["nom"] for t in tokens}` — set comprehension pour un test d'appartenance O(1) au lieu de O(n) sur une liste.
- `t.get("actif", True)` — si la clé `"actif"` est absente, on considère le token actif par défaut.
- Chaque fonction fait une seule chose — pipeline composable.
