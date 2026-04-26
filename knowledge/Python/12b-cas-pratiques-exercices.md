# 12. Cas pratiques — Exercices

> Ces exercices sont des projets complets. Consacre du temps à chacun avant de consulter les corrections.

---

## Énoncés

### Exercice 1 — Traduction mentale (Reef → Python CLI)

**Objectif** : comprendre comment une app Reef se traduit en outil CLI Python.

En Reef.js, tu gères un catalogue de tokens ainsi :

```js
import { signal, component, save, saved } from "reef.js";

const state = signal(saved("tokens") ?? { items: [], nextId: 1 });

function ajouterToken(nom, valeur) {
  state.value = {
    items: [...state.value.items, { id: state.value.nextId, nom, valeur }],
    nextId: state.value.nextId + 1
  };
  save("tokens", state.value);
}

function App() {
  return state.value.items
    .map(t => `<li>${t.nom}: ${t.valeur}</li>`)
    .join("");
}

component("#app", App);
```

**Question** : Traduis cette logique en script Python CLI qui :
- Ajoute un token : `python tokens_cli.py add color-primary "#3B82F6"`
- Liste tous les tokens : `python tokens_cli.py list`
- Persiste dans `tokens.json`

Pas de rendu HTML, pas de DOM — juste des données et un terminal.

---

### Exercice 2 — Piège de paradigme

**Objectif** : identifier les erreurs d'un script Python qui lit un fichier JSON mal géré.

```python
import json

def traiter_export(chemin):
    f = open(chemin)
    data = json.load(f)
    
    tokens = []
    for categorie in data:
        for nom in data[categorie]:
            token = {
                "nom": categorie + "-" + nom,
                "valeur": data[categorie][nom]["value"]
            }
            tokens.append(token)
    
    return tokens

resultats = traiter_export("export.json")
print(resultats)
```

**Identifie et corrige** les problèmes suivants :
1. Gestion du fichier — quelle erreur potentielle ?
2. Gestion des erreurs — que se passe-t-il si `"value"` est absent ?
3. Construction du nom — quelle construction Python est plus idiomatique ?

---

### Exercice 3 — Mini projet complet

**Objectif** : construire un outil CLI de gestion de tokens de design system.

Implémente `ds_tools.py` avec les commandes suivantes :

```bash
# Ajouter un token
python ds_tools.py add color-primary "#3B82F6"

# Lister les tokens (avec filtrage optionnel)
python ds_tools.py list
python ds_tools.py list --categorie color

# Exporter en CSS
python ds_tools.py export tokens.css

# Rapport de couverture
python ds_tools.py stats
```

**Données** persistées dans `tokens.json`. Format :
```json
[{"nom": "color-primary", "valeur": "#3B82F6", "actif": true}]
```

**Contraintes** :
- Utiliser `sys.argv` ou `argparse` pour les arguments
- Pas de bibliothèques tierces (seulement `json`, `sys`, `pathlib`)
- Gérer le cas fichier inexistant

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
- Signal Reef → variable Python ordinaire (pas de réactivité nécessaire sans UI)
- `save()` Reef → `json.dump()` dans un fichier
- `saved()` → `json.load()` avec fallback
- `component()` + template HTML → `print()` dans le terminal

#### Code Python propre

```python
import json
import sys
from pathlib import Path

FICHIER = "tokens.json"


def charger() -> list[dict]:
    p = Path(FICHIER)
    if not p.exists():
        return []
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def sauvegarder(tokens: list[dict]) -> None:
    with open(FICHIER, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)


def ajouter(nom: str, valeur: str) -> None:
    tokens = charger()
    tokens.append({"id": len(tokens) + 1, "nom": nom, "valeur": valeur})
    sauvegarder(tokens)
    print(f"✅ Ajouté : {nom} = {valeur}")


def lister() -> None:
    tokens = charger()
    if not tokens:
        print("Catalogue vide.")
        return
    for t in tokens:
        print(f"[{t['id']}] {t['nom']}: {t['valeur']}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("Usage: python tokens_cli.py [add|list] [args]")
        sys.exit(1)

    match args[0]:
        case "add" if len(args) == 3:
            ajouter(args[1], args[2])
        case "list":
            lister()
        case _:
            print(f"Commande inconnue ou arguments invalides : {args}")
```

---

### Correction Exercice 2

#### Problèmes identifiés

**1. Gestion du fichier**

```python
# ❌ Pas de with — fichier non fermé si exception
f = open(chemin)
data = json.load(f)
```

```python
# ✅ Avec with
with open(chemin, "r", encoding="utf-8") as f:
    data = json.load(f)
```

**2. Accès sans protection**

```python
# ❌ KeyError si "value" absent
"valeur": data[categorie][nom]["value"]
```

```python
# ✅ Avec .get() et valeur par défaut
"valeur": data[categorie][nom].get("value", "")
```

**3. Construction du nom**

```python
# ❌ Concaténation string manuelle
"nom": categorie + "-" + nom
```

```python
# ✅ f-string idiomatique
"nom": f"{categorie}-{nom}"
```

#### Version corrigée complète

```python
import json


def traiter_export(chemin: str) -> list[dict]:
    try:
        with open(chemin, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Fichier non trouvé : {chemin}")
        return []
    except json.JSONDecodeError as e:
        print(f"JSON invalide : {e}")
        return []

    tokens = []
    for categorie, items in data.items():
        for nom, details in items.items():
            valeur = details.get("value", "")
            if valeur:
                tokens.append({
                    "nom": f"{categorie}-{nom}",
                    "valeur": valeur
                })
    return tokens
```

---

### Correction Exercice 3

```python
import json
import sys
from pathlib import Path

FICHIER = "tokens.json"


def charger() -> list[dict]:
    p = Path(FICHIER)
    if not p.exists():
        return []
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def sauvegarder(tokens: list[dict]) -> None:
    with open(FICHIER, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)


def cmd_add(nom: str, valeur: str) -> None:
    tokens = charger()
    if any(t["nom"] == nom for t in tokens):
        print(f"Token '{nom}' existe déjà.")
        return
    tokens.append({"nom": nom, "valeur": valeur, "actif": True})
    sauvegarder(tokens)
    print(f"✅ {nom}: {valeur}")


def cmd_list(categorie: str | None = None) -> None:
    tokens = charger()
    filtres = [t for t in tokens if not categorie or t["nom"].startswith(categorie)]
    if not filtres:
        print("Aucun token.")
        return
    for t in filtres:
        statut = "✓" if t["actif"] else "✗"
        print(f"  {statut} {t['nom']}: {t['valeur']}")


def cmd_export(chemin_css: str) -> None:
    tokens = [t for t in charger() if t["actif"]]
    lignes = [f"  --{t['nom']}: {t['valeur']};" for t in tokens]
    contenu = ":root {\n" + "\n".join(lignes) + "\n}\n"
    Path(chemin_css).write_text(contenu, encoding="utf-8")
    print(f"✅ {len(tokens)} tokens → {chemin_css}")


def cmd_stats() -> None:
    tokens = charger()
    actifs = [t for t in tokens if t["actif"]]
    categories = {t["nom"].split("-")[0] for t in actifs}
    print(f"Total : {len(tokens)} tokens ({len(actifs)} actifs)")
    print(f"Catégories : {', '.join(sorted(categories))}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("Usage: python ds_tools.py [add|list|export|stats] [args]")
        sys.exit(1)

    match args[0]:
        case "add" if len(args) >= 3:
            cmd_add(args[1], args[2])
        case "list":
            categorie = None
            if "--categorie" in args:
                idx = args.index("--categorie")
                categorie = args[idx + 1] if idx + 1 < len(args) else None
            cmd_list(categorie)
        case "export" if len(args) == 2:
            cmd_export(args[1])
        case "stats":
            cmd_stats()
        case _:
            print(f"Commande inconnue : {args[0]}")
            sys.exit(1)
```
