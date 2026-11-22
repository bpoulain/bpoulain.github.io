# 2. Structures de données — Exercices

> Les 3 énoncés sont présentés en premier. Tente chaque exercice avant de consulter les corrections à la fin du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : passer du modèle "objet JS" au modèle "dict + list Python".

Tu as ce state Reef.js modélisant un design system :

```js
import { signal } from "reef.js";

const designSystem = signal({
  nom: "Polaris",
  version: "4.2.0",
  composants: ["Button", "Input", "Card"],
  metadata: {
    auteur: "Alice",
    actif: true
  }
});

// Ajouter un composant
designSystem.value.composants.push("Modal");

// Accéder à l'auteur
console.log(designSystem.value.metadata.auteur);
```

**Question 1a** : Traduis cette structure de données en Python pur (pas de Reef, pas de signal — juste les données et les manipulations).

**Question 1b** : Que se passe-t-il si tu essaies d'accéder à `design_system["metadata"]["createur"]` (une clé inexistante) ? Comment éviter l'erreur ?

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre la différence entre modifier une liste et en créer une nouvelle.

Observe ce code Python :

```python
tokens_base = ["color-primary", "color-secondary", "spacing-4"]
tokens_projet = tokens_base

tokens_projet.append("border-radius-8")

print("Base :", tokens_base)
print("Projet :", tokens_projet)
```

**Question 2a** : Que va afficher ce code ? Pourquoi ?

**Question 2b** : Comment corriger pour que `tokens_base` ne soit pas modifiée ?

*(Indice : ce concept sera approfondi en §4 Mutabilité & mémoire)*

---

### Exercice 3 — Mini cas réel

**Objectif** : modéliser et manipuler des données de design system.

**Contexte** : tu reçois un export de tokens d'un design system sous forme de liste brute (avec doublons potentiels). Tu dois :

1. Créer un `dict` représentant un composant `Card` avec : `nom`, `variantes` (liste), `taille_defaut` (tuple `(hauteur, largeur)`), `tokens_utilises` (set)
2. Éliminer les doublons de la liste de tokens bruts
3. Vérifier si le token `"color-surface"` est utilisé
4. Ajouter une variante `"outlined"` si elle n'est pas déjà présente

```python
tokens_bruts = [
    "color-surface", "spacing-4", "border-radius-8",
    "color-surface", "font-size-base", "spacing-4"
]

# Ton code ici
```

**Avant de coder** : quelle structure Python utilises-tu pour chaque donnée et pourquoi ?

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
Un `signal({...})` Reef est juste un conteneur réactif autour d'un dict. En Python, on travaille **directement** avec le dict, sans enveloppe réactive — Python n'a pas de système de re-render à déclencher.

#### Code Python propre

```python
design_system = {
    "nom": "Polaris",
    "version": "4.2.0",
    "composants": ["Button", "Input", "Card"],
    "metadata": {
        "auteur": "Alice",
        "actif": True
    }
}

# Ajouter un composant
design_system["composants"].append("Modal")

# Accéder à l'auteur
print(design_system["metadata"]["auteur"])  # "Alice"
```

#### Réponse 1b — clé inexistante

```python
# ❌ KeyError
design_system["metadata"]["createur"]   # KeyError: 'createur'

# ✅ Option 1 : .get() avec valeur par défaut
createur = design_system["metadata"].get("createur", "inconnu")

# ✅ Option 2 : tester l'existence avant
if "createur" in design_system["metadata"]:
    print(design_system["metadata"]["createur"])
```

*Faux ami JS* : en JS, accéder à une propriété inexistante retourne `undefined` silencieusement. Python lève une `KeyError`. C'est **volontaire** : Python préfère les erreurs explicites aux `undefined` silencieux.

---

### Correction Exercice 2

#### Ce qui s'affiche

```
Base : ["color-primary", "color-secondary", "spacing-4", "border-radius-8"]
Projet : ["color-primary", "color-secondary", "spacing-4", "border-radius-8"]
```

**Les deux listes sont modifiées**, parce que `tokens_projet = tokens_base` ne **copie pas** la liste — elle crée une **deuxième référence vers le même objet**.

#### ❌ Ce que le cerveau fait
Penser que `=` crée une copie, comme avec des valeurs primitives (`str`, `int`).

#### ✅ Comment ça fonctionne réellement
En Python, `=` sur une liste copie la **référence** (l'adresse mémoire), pas le contenu. Les deux variables pointent vers le même objet.

#### Code corrigé

```python
tokens_base = ["color-primary", "color-secondary", "spacing-4"]

# Option 1 : copie superficielle avec [:]
tokens_projet = tokens_base[:]

# Option 2 : copie superficielle avec .copy()
tokens_projet = tokens_base.copy()

# Option 3 : copie profonde (pour structures imbriquées)
import copy
tokens_projet = copy.deepcopy(tokens_base)

tokens_projet.append("border-radius-8")

print("Base :", tokens_base)    # inchangée
print("Projet :", tokens_projet)  # modifiée
```

*Ce concept sera approfondi en §4.*

---

### Correction Exercice 3

#### Choix des structures

| Donnée | Structure | Raison |
|---|---|---|
| Composant | `dict` | clés nommées, accès rapide |
| Variantes | `list` | ordre important, peut changer |
| Taille par défaut | `tuple` | valeur fixe, deux dimensions |
| Tokens | `set` | unicité, pas d'ordre requis |

#### Code Python propre

```python
tokens_bruts = [
    "color-surface", "spacing-4", "border-radius-8",
    "color-surface", "font-size-base", "spacing-4"
]

# 1. Créer le composant Card
card = {
    "nom": "Card",
    "variantes": ["default", "elevated"],
    "taille_defaut": (200, 300),         # (hauteur, largeur)
    "tokens_utilises": set(tokens_bruts) # élimine les doublons
}

# 2. Vérifier si "color-surface" est utilisé
if "color-surface" in card["tokens_utilises"]:
    print("✅ color-surface est utilisé")

# 3. Ajouter "outlined" si absent
if "outlined" not in card["variantes"]:
    card["variantes"].append("outlined")

print(card)
```

#### Pièges courants

- `set()` sur une liste élimine les doublons mais **perd l'ordre** — utiliser `list(dict.fromkeys(liste))` si l'ordre doit être conservé.
- Un `set` vide s'écrit `set()`, jamais `{}` (qui crée un `dict` vide).
- `tuple` d'un seul élément : `(200,)` — la virgule est obligatoire.
