# 6. Compréhensions — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : remplacer les chaînes `.map().filter()` JS par des compréhensions.

```js
const tokens = [
  { nom: "color-primary", valeur: "#3B82F6", categorie: "color" },
  { nom: "spacing-4", valeur: "16px", categorie: "spacing" },
  { nom: "color-surface", valeur: "#F8FAFC", categorie: "color" },
  { nom: "font-size-base", valeur: "16px", categorie: "typography" },
  { nom: "color-accent", valeur: "#8B5CF6", categorie: "color" },
];

// Noms de tous les tokens couleur, en majuscules
const nomsCouleurs = tokens
  .filter(t => t.categorie === "color")
  .map(t => t.nom.toUpperCase());

// Dict { nom → valeur } pour tous les tokens
const dictTokens = Object.fromEntries(tokens.map(t => [t.nom, t.valeur]));

// Catégories uniques
const categories = [...new Set(tokens.map(t => t.categorie))];
```

**Question** : Traduis ces trois expressions en Python avec des compréhensions (list, dict, set).

---

### Exercice 2 — Piège de paradigme

**Objectif** : comprendre quand une compréhension est mal utilisée.

```python
# Version A — compréhension avec effet de bord
resultats = []
[resultats.append(x * 2) for x in range(5)]

# Version B — boucle classique
resultats = []
for x in range(5):
    resultats.append(x * 2)

# Version C — list comprehension correcte
resultats = [x * 2 for x in range(5)]
```

**Question 2a** : Les trois versions produisent le même `resultats`. Quel est le problème de la Version A ?

**Question 2b** : Dans quel cas précis doit-on revenir à la Version B (boucle classique) plutôt que d'utiliser une compréhension ?

---

### Exercice 3 — Mini cas réel

**Objectif** : construire un pipeline de traitement de tokens de design system.

```python
tokens_bruts = [
    {"nom": "color-primary-500", "valeur": "#3B82F6", "actif": True},
    {"nom": "color-primary-400", "valeur": "#60A5FA", "actif": True},
    {"nom": "color-deprecated-red", "valeur": "#EF4444", "actif": False},
    {"nom": "spacing-4", "valeur": "16px", "actif": True},
    {"nom": "spacing-8", "valeur": "32px", "actif": True},
    {"nom": "font-size-base", "valeur": "16px", "actif": True},
    {"nom": "spacing-deprecated-old", "valeur": "12px", "actif": False},
]
```

Avec des compréhensions uniquement :

1. **Liste** des noms de tokens actifs, triée alphabétiquement
2. **Dict** `{nom: valeur}` des tokens actifs uniquement
3. **Set** des catégories présentes dans les tokens actifs (ex: `"color"`, `"spacing"`) — la catégorie est le premier segment du nom avant le premier `-`
4. **Liste** des tokens couleur actifs avec leur valeur en majuscules : `[{"nom": ..., "valeur": ...}, ...]`

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
- List comprehension = `map + filter` en JS
- Dict comprehension = `Object.fromEntries(arr.map(...))` en JS
- Set comprehension = `new Set(arr.map(...))` en JS

#### Code Python propre

```python
tokens = [
    {"nom": "color-primary", "valeur": "#3B82F6", "categorie": "color"},
    {"nom": "spacing-4", "valeur": "16px", "categorie": "spacing"},
    {"nom": "color-surface", "valeur": "#F8FAFC", "categorie": "color"},
    {"nom": "font-size-base", "valeur": "16px", "categorie": "typography"},
    {"nom": "color-accent", "valeur": "#8B5CF6", "categorie": "color"},
]

# 1. Noms des tokens couleur en majuscules
noms_couleurs = [t["nom"].upper() for t in tokens if t["categorie"] == "color"]
# ["COLOR-PRIMARY", "COLOR-SURFACE", "COLOR-ACCENT"]

# 2. Dict { nom → valeur }
dict_tokens = {t["nom"]: t["valeur"] for t in tokens}
# {"color-primary": "#3B82F6", "spacing-4": "16px", ...}

# 3. Catégories uniques
categories = {t["categorie"] for t in tokens}
# {"color", "spacing", "typography"}
```

#### Note sur la lisibilité
`[t["nom"].upper() for t in tokens if t["categorie"] == "color"]` tient en une ligne claire. En JS, `.filter().map()` nécessite deux passes et une chaîne — la compréhension Python fait les deux en une passe.

---

### Correction Exercice 2

#### Réponse 2a

La Version A est **antipattern** pour deux raisons :
1. Elle utilise une compréhension uniquement pour ses effets de bord (`append`) et jette le résultat — c'est sémantiquement trompeur.
2. La liste retournée par la compréhension (`[None, None, None, None, None]`) est créée en mémoire puis immédiatement ignorée — gaspillage.

Une compréhension doit **produire** une collection. Si ton but est un effet de bord, utilise une boucle.

#### Réponse 2b

Revenir à la boucle classique quand :
- La logique implique plusieurs effets de bord (logging + modification + I/O)
- L'ajout conditionnel dépend de plusieurs étapes de calcul intermédiaires
- La lisibilité de la compréhension est compromise (> 80 chars, imbrication profonde)
- Tu as besoin de `break` / `continue`

```python
# ✅ Boucle justifiée — logique complexe avec effets de bord
for token in tokens_bruts:
    if not token["actif"]:
        continue
    valide = valider(token)
    if not valide:
        logger.warning(f"Token invalide : {token['nom']}")
        continue
    resultats.append(traiter(token))
```

---

### Correction Exercice 3

#### Code Python propre

```python
tokens_bruts = [
    {"nom": "color-primary-500", "valeur": "#3B82F6", "actif": True},
    {"nom": "color-primary-400", "valeur": "#60A5FA", "actif": True},
    {"nom": "color-deprecated-red", "valeur": "#EF4444", "actif": False},
    {"nom": "spacing-4", "valeur": "16px", "actif": True},
    {"nom": "spacing-8", "valeur": "32px", "actif": True},
    {"nom": "font-size-base", "valeur": "16px", "actif": True},
    {"nom": "spacing-deprecated-old", "valeur": "12px", "actif": False},
]

# 1. Noms actifs triés
noms_actifs = sorted([t["nom"] for t in tokens_bruts if t["actif"]])

# 2. Dict nom → valeur (actifs)
dict_actifs = {t["nom"]: t["valeur"] for t in tokens_bruts if t["actif"]}

# 3. Catégories uniques (actifs) — premier segment avant "-"
categories = {t["nom"].split("-")[0] for t in tokens_bruts if t["actif"]}

# 4. Tokens couleur actifs avec valeur en majuscules
couleurs_actives = [
    {"nom": t["nom"], "valeur": t["valeur"].upper()}
    for t in tokens_bruts
    if t["actif"] and t["nom"].startswith("color-")
]

print("Noms actifs :", noms_actifs)
print("Dict actifs :", dict_actifs)
print("Catégories :", categories)
print("Couleurs actives :", couleurs_actives)
```

#### Sortie

```
Noms actifs : ['color-primary-400', 'color-primary-500', 'font-size-base', 'spacing-4', 'spacing-8']
Catégories : {'color', 'spacing', 'font'}
Couleurs actives : [
  {'nom': 'color-primary-500', 'valeur': '#3B82F6'},
  {'nom': 'color-primary-400', 'valeur': '#60A5FA'}
]
```

#### Notes

- `t["nom"].split("-")[0]` : `.split("-")` retourne une liste de segments, `[0]` prend le premier.
- Le format multi-ligne pour la compréhension 4 est intentionnel — elle dépasse 80 chars, la mettre sur plusieurs lignes améliore la lisibilité sans sacrifier la concision.
- `sorted([...])` trie la liste produite par la compréhension — on peut aussi chaîner : `sorted(t["nom"] for t in tokens_bruts if t["actif"])`.
