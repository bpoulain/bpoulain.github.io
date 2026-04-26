# 3. Itération & accès aux données — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : remplacer les patterns d'itération JS par l'équivalent Python idiomatique.

Tu as ce code JS qui traite un catalogue de composants :

```js
const composants = [
  { nom: "Button", taille: 32 },
  { nom: "Input", taille: 40 },
  { nom: "Card", taille: 200 },
];

// Afficher avec index
composants.forEach((c, i) => {
  console.log(`${i + 1}. ${c.nom} — ${c.taille}px`);
});

// Fusionner deux tableaux en parallèle
const statuts = ["stable", "beta", "stable"];
composants.forEach((c, i) => {
  console.log(`${c.nom}: ${statuts[i]}`);
});
```

**Question** : Traduis ces deux blocs en Python. Utilise les constructions idiomatiques (`enumerate`, `zip`).

---

### Exercice 2 — Piège de paradigme

**Objectif** : identifier le mauvais pattern d'itération.

```python
tokens = ["color-primary", "color-secondary", "spacing-4", "border-radius"]

# Version A
for i in range(len(tokens)):
    print(f"{i}: {tokens[i]}")

# Version B
for i, token in enumerate(tokens):
    print(f"{i}: {token}")
```

**Question 2a** : Les deux versions produisent le même résultat. Pourquoi la version A est-elle considérée comme du mauvais Python ?

**Question 2b** : Dans quel cas rare la version A serait-elle justifiée ?

---

### Exercice 3 — Mini cas réel

**Objectif** : traiter un export de données de design system.

**Contexte** : tu reçois deux listes parallèles — des noms de tokens et leurs valeurs. Tu dois :

1. Les afficher numérotés à partir de 1
2. Créer un `dict` `{nom: valeur}` à partir des deux listes
3. Trouver et afficher tous les tokens dont la valeur contient `"#"` (couleurs hexadécimales)
4. Inverser l'ordre des tokens et afficher la liste résultante

```python
noms = ["color-primary", "spacing-4", "color-surface", "font-size-base", "color-accent"]
valeurs = ["#3B82F6", "16px", "#F8FAFC", "14px", "#8B5CF6"]

# Ton code ici
```

**Avant de coder** : identifie quelle construction Python tu utiliseras pour chaque étape (1 → 4).

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
`forEach(callback)` JS = `for ... in` Python, mais sans callback — la logique est directement dans le corps de la boucle. `enumerate` remplace l'index passé en second argument de `forEach`.

#### Code Python propre

```python
composants = [
    {"nom": "Button", "taille": 32},
    {"nom": "Input", "taille": 40},
    {"nom": "Card", "taille": 200},
]

# Bloc 1 : afficher avec index (démarrant à 1)
for i, c in enumerate(composants, start=1):
    print(f"{i}. {c['nom']} — {c['taille']}px")

# Bloc 2 : deux listes en parallèle
statuts = ["stable", "beta", "stable"]
for c, statut in zip(composants, statuts):
    print(f"{c['nom']}: {statut}")
```

#### Pièges
- `c["nom"]` et non `c.nom` — Python n'a pas d'accès par propriété avec `.` sur les dicts.
- `enumerate(composants, start=1)` pour démarrer à 1 — pas besoin de `i + 1`.
- `zip` s'arrête à la liste la plus courte : si `statuts` était plus court, certains composants ne seraient pas affichés.

---

### Correction Exercice 2

#### Réponse 2a

La version A (`range(len(...))`) est un pattern hérité de C/Java. Elle :
- Introduit une variable `i` utilisée uniquement comme intermédiaire
- Force un accès par index `tokens[i]` alors que Python peut itérer directement
- Est plus verbeuse et moins lisible

C'est un **signal de code non-Pythonic** : un lecteur expérimenté saura immédiatement que l'auteur vient d'un autre langage.

#### ✅ Version idiomatique

```python
for i, token in enumerate(tokens):
    print(f"{i}: {token}")
```

#### Réponse 2b

La version A (`range(len(...))`) est justifiée quand tu as besoin de **modifier la liste en place pendant l'itération** par index :

```python
for i in range(len(tokens)):
    if tokens[i].startswith("color-"):
        tokens[i] = tokens[i].upper()   # modification par index
```

*(Même là, une compréhension serait préférable pour créer une nouvelle liste.)*

---

### Correction Exercice 3

#### Identification des constructions

1. Afficher numérotés → `enumerate(noms, start=1)` + `zip` pour avoir la valeur
2. Créer un dict → `dict(zip(noms, valeurs))` ou compréhension (voir §6)
3. Filtrer → boucle `for` avec `if "in" valeur`
4. Inverser → slicing `[::-1]`

#### Code Python propre

```python
noms = ["color-primary", "spacing-4", "color-surface", "font-size-base", "color-accent"]
valeurs = ["#3B82F6", "16px", "#F8FAFC", "14px", "#8B5CF6"]

# 1. Afficher numérotés
for i, (nom, valeur) in enumerate(zip(noms, valeurs), start=1):
    print(f"{i}. {nom}: {valeur}")

# 2. Créer un dict
tokens_dict = dict(zip(noms, valeurs))
print(tokens_dict)

# 3. Filtrer les couleurs hex
couleurs = []
for nom, valeur in tokens_dict.items():
    if "#" in valeur:
        couleurs.append(nom)
print("Couleurs :", couleurs)

# 4. Inverser l'ordre des noms
noms_inverses = noms[::-1]
print("Inversé :", noms_inverses)
```

#### Nota — double unpacking en ligne 1

`for i, (nom, valeur) in enumerate(zip(noms, valeurs), start=1)` :
- `zip(noms, valeurs)` produit des tuples `("color-primary", "#3B82F6")` etc.
- `enumerate(...)` enveloppe chaque tuple avec son index : `(0, ("color-primary", "#3B82F6"))`
- `i, (nom, valeur)` déstructure les deux niveaux en une fois

C'est lisible et idiomatique — mais peut être décomposé si ça semble obscur :

```python
for i, paire in enumerate(zip(noms, valeurs), start=1):
    nom, valeur = paire
    print(f"{i}. {nom}: {valeur}")
```
