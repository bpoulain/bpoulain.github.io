# 12. Cas pratiques

## 12.1 Modèle mental

Les cas pratiques sont le **ciment** de l'apprentissage Python : ils forcent à combiner §1 à §11 dans un contexte réel. On ne construit pas une interface — on construit des **outils qui traitent des données**.

*Quand démarrer ?* Dès que §7 (fonctions) et §8 (fichiers) sont assimilés.

---

## 12.2 Cas pratique 1 — CLI todo list

### 12.2.1 Description

Une application en ligne de commande pour gérer une liste de tâches, persistée dans un fichier JSON.

### 12.2.2 Fonctionnalités

```bash
python todo.py add "Apprendre les compréhensions"
python todo.py list
python todo.py done 1
python todo.py remove 2
```

### 12.2.3 Structure des données

```python
# todos.json
[
  {"id": 1, "texte": "Apprendre les compréhensions", "fait": False},
  {"id": 2, "texte": "Pratiquer les fichiers", "fait": True}
]
```

### 12.2.4 Code de référence

```python
import json
import sys
from pathlib import Path

FICHIER = "todos.json"


def charger() -> list[dict]:
    if not Path(FICHIER).exists():
        return []
    with open(FICHIER, "r", encoding="utf-8") as f:
        return json.load(f)


def sauvegarder(todos: list[dict]) -> None:
    with open(FICHIER, "w", encoding="utf-8") as f:
        json.dump(todos, f, indent=2, ensure_ascii=False)


def ajouter(texte: str) -> None:
    todos = charger()
    prochain_id = max((t["id"] for t in todos), default=0) + 1
    todos.append({"id": prochain_id, "texte": texte, "fait": False})
    sauvegarder(todos)
    print(f"✅ Ajouté : {texte}")


def lister() -> None:
    todos = charger()
    if not todos:
        print("Aucune tâche.")
        return
    for t in todos:
        statut = "✓" if t["fait"] else "○"
        print(f"[{t['id']}] {statut} {t['texte']}")


def terminer(id_: int) -> None:
    todos = charger()
    for t in todos:
        if t["id"] == id_:
            t["fait"] = True
            sauvegarder(todos)
            print(f"✅ Tâche {id_} marquée comme faite")
            return
    print(f"Tâche {id_} introuvable")


def supprimer(id_: int) -> None:
    todos = charger()
    nouveaux = [t for t in todos if t["id"] != id_]
    if len(nouveaux) == len(todos):
        print(f"Tâche {id_} introuvable")
        return
    sauvegarder(nouveaux)
    print(f"🗑️  Tâche {id_} supprimée")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("Usage: python todo.py [add|list|done|remove] [args]")
        sys.exit(1)

    commande = args[0]
    match commande:
        case "add":
            ajouter(" ".join(args[1:]))
        case "list":
            lister()
        case "done":
            terminer(int(args[1]))
        case "remove":
            supprimer(int(args[1]))
        case _:
            print(f"Commande inconnue : {commande}")
```

### 12.2.5 Concepts mis en pratique

- §1 : variables, f-strings, conditions
- §2 : listes, dicts
- §3 : itération, enumerate
- §5 : `max()` avec générateur
- §6 : compréhension pour `filtrer`
- §7 : fonctions pures + effets de bord explicites
- §8 : fichiers JSON, `pathlib`
- §10 : `if __name__ == "__main__"`, `sys.argv`
- §1 : `match/case`

---

## 12.3 Cas pratique 2 — Manipulation de JSON

### 12.3.1 Contexte design system

Lire un export JSON de tokens Figma, filtrer, transformer, exporter en CSS.

```python
import json
from pathlib import Path


def lire_tokens_figma(chemin: str) -> list[dict]:
    """Parse un export JSON simplifié de tokens Figma."""
    with open(chemin, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Format Figma : {"color": {"primary": {"value": "#3B82F6", "type": "color"}}}
    tokens = []
    for categorie, items in data.items():
        for nom, details in items.items():
            tokens.append({
                "nom": f"{categorie}-{nom}",
                "valeur": details["value"],
                "type": details["type"],
                "actif": True
            })
    return tokens


def generer_css_variables(tokens: list[dict], chemin_sortie: str) -> None:
    """Génère un fichier CSS :root avec les variables."""
    actifs = [t for t in tokens if t["actif"]]
    lignes = [f"  --{t['nom']}: {t['valeur']};" for t in actifs]
    contenu = ":root {\n" + "\n".join(lignes) + "\n}\n"
    Path(chemin_sortie).write_text(contenu, encoding="utf-8")
    print(f"✅ {len(actifs)} tokens exportés → {chemin_sortie}")
```

---

## 12.4 Cas pratique 3 — Scripts d'automatisation

### 12.4.1 Renommage de fichiers en masse

```python
from pathlib import Path


def normaliser_noms_fichiers(dossier: str, extension: str = ".png") -> None:
    """Renomme tous les fichiers : espaces → tirets, minuscules."""
    p = Path(dossier)
    compteur = 0
    for fichier in p.glob(f"*{extension}"):
        nouveau_nom = fichier.stem.lower().replace(" ", "-") + fichier.suffix
        nouveau_chemin = fichier.parent / nouveau_nom
        if nouveau_chemin != fichier:
            fichier.rename(nouveau_chemin)
            print(f"  {fichier.name} → {nouveau_nom}")
            compteur += 1
    print(f"✅ {compteur} fichier(s) renommé(s)")
```

### 12.4.2 Rapport de couverture de tokens

```python
def rapport_couverture(tokens_disponibles: list[dict], tokens_utilises: list[str]) -> dict:
    """Calcule les métriques de couverture."""
    set_disponibles = {t["nom"] for t in tokens_disponibles}
    set_utilises = set(tokens_utilises)

    utilises_valides = set_utilises & set_disponibles
    utilises_inconnus = set_utilises - set_disponibles
    non_utilises = set_disponibles - set_utilises

    return {
        "total_disponibles": len(set_disponibles),
        "total_utilises": len(set_utilises),
        "utilises_valides": sorted(utilises_valides),
        "utilises_inconnus": sorted(utilises_inconnus),
        "non_utilises": sorted(non_utilises),
        "taux_couverture": round(len(utilises_valides) / len(set_disponibles) * 100, 1)
    }
```

---

## 12.5 Fil conducteur

Ces cas pratiques montrent un pattern récurrent en Python :

```
1. Lire des données (fichier, stdin, API)
       ↓
2. Valider et nettoyer
       ↓
3. Transformer (compréhensions, fonctions pures)
       ↓
4. Produire un résultat (fichier, stdout, retour)
```

Ce pipeline est la forme la plus courante du code Python généraliste. Pas de DOM, pas de UI — **données → transformations → résultats**.
