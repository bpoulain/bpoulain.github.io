# 1. Fondamentaux — Exercices

> **Mode génération de cours** : les 3 énoncés sont présentés d'abord. Les corrections sont regroupées à la fin du fichier, après une ligne de séparation. Tente chaque exercice avant de consulter les corrections.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : changer de paradigme sur les bases du langage.

Tu as ce code JS vanilla :

```js
const prenom = "Alice";
const age = 28;
const actif = true;
let score = null;

if (age >= 18 && actif) {
  const message = `${prenom} est majeure et active. Score : ${score ?? "non défini"}`;
  console.log(message);
}
```

**Question 1a** : Comment tu ferais exactement la même logique en Python ?
Pense d'abord aux différences : `const`/`let`, `&&`, template literal, `null`, `??`.

**Question 1b** : Quelle est la différence entre `null` en JS et `None` en Python dans ce contexte ?

---

### Exercice 2 — Piège de paradigme

**Objectif** : casser un faux ami mental sur `is` vs `==`.

Observe ce code Python :

```python
def verifier_config(config):
    if config == None:
        return "config vide"
    return f"config chargée : {config}"

resultat = verifier_config(None)
print(resultat)
```

Ce code **fonctionne** dans ce cas simple — mais il contient un piège.

**Question 2a** : Quelle est l'erreur de style et pourquoi est-elle dangereuse ?

**Question 2b** : Écris la version correcte.

---

### Exercice 3 — Mini cas réel

**Objectif** : appliquer les fondamentaux dans un contexte crédible.

**Contexte** : tu construis un petit CLI (command-line interface) de diagnostic de design system. L'outil reçoit un nom de composant et un score de couverture de tokens (0–100), et affiche un diagnostic.

**Règles métier** :
- Score ≥ 90 : "✅ Couverture excellente"
- Score 70–89 : "🟡 Couverture correcte"
- Score 50–69 : "🟠 Couverture partielle"
- Score < 50 : "❌ Couverture insuffisante"
- Si le composant est `None` ou une chaîne vide : afficher "⚠️ Composant non spécifié"

**Avant de coder** : décris en une phrase le modèle mental Python que tu vas appliquer ici (quelle structure, quelle logique ?).

**Puis écris** :

```python
composant = "Button"
score = 73

# Ton code ici
```

---

---

## Corrections

### Correction Exercice 1

#### Modèle mental
En Python : pas de `const`/`let`, pas de coercition, les opérateurs logiques sont des mots-clés, `None` remplace `null` ET `undefined`, les f-strings remplacent les template literals.

#### Code Python propre

```python
prenom = "Alice"
age = 28
actif = True
score = None

if age >= 18 and actif:
    valeur_score = score if score is not None else "non défini"
    message = f"{prenom} est majeure et active. Score : {valeur_score}"
    print(message)
```

#### Explication des différences

| JS | Python | Raison |
|---|---|---|
| `const prenom` | `prenom` | Pas de mot-clé de déclaration |
| `true` / `null` | `True` / `None` | Majuscule en Python |
| `&&` | `and` | Mot-clé, pas un opérateur symbolique |
| `` `${prenom}` `` | `f"{prenom}"` | f-string |
| `score ?? "non défini"` | `score if score is not None else "non défini"` | Pas d'opérateur `??` en Python |

#### Piège courant
`None` en Python est plus simple que JS : une seule valeur d'absence, pas de distinction `null`/`undefined`. Le code est plus prévisible.

---

### Correction Exercice 2

#### ❌ Ce que le cerveau fait
Utiliser `== None` parce que ça "ressemble" à `=== null` en JS et que ça fonctionne dans les cas simples.

#### ✅ Comment ça fonctionne réellement
`==` appelle la méthode `__eq__` de l'objet. Un objet peut surcharger `__eq__` pour retourner `True` même face à `None`, causant des faux positifs silencieux.

`is None` teste l'**identité** : est-ce littéralement le singleton `None` ? C'est non ambigu et inviolable.

#### Code corrigé

```python
def verifier_config(config):
    if config is None:       # ✅ identité objet
        return "config vide"
    return f"config chargée : {config}"

resultat = verifier_config(None)
print(resultat)
```

#### Erreur classique
Certains objets (ORM, librairies de données) surchargent `__eq__`. Dans ces contextes, `obj == None` peut retourner `True` ou lever une exception, alors que `obj is None` reste toujours fiable.

---

### Correction Exercice 3

#### Modèle mental
Structure de conditions `if/elif/else` sur un score numérique, après une garde pour les cas invalides (`None` / chaîne vide).

#### Code Python propre

```python
composant = "Button"
score = 73

if not composant:  # None ou chaîne vide → falsy
    print("⚠️ Composant non spécifié")
else:
    if score >= 90:
        niveau = "✅ Couverture excellente"
    elif score >= 70:
        niveau = "🟡 Couverture correcte"
    elif score >= 50:
        niveau = "🟠 Couverture partielle"
    else:
        niveau = "❌ Couverture insuffisante"

    print(f"{composant} — {niveau} ({score}/100)")
```

Sortie : `Button — 🟡 Couverture correcte (73/100)`

#### Notes

- `not composant` est **Pythonic** : `None` et `""` sont tous deux *falsy* en Python — une seule condition couvre les deux cas.
- Assigner `niveau` dans chaque branche puis afficher une seule fois est plus lisible que `print()` dans chaque branche.

#### Piège courant
Ne pas confondre `not composant` (falsy check) et `composant is None` (test d'identité). Si `composant = 0` ou `composant = []`, `not composant` serait `True` — ce qui serait un bug si ces valeurs étaient valides. Ici `composant` est une string, donc `not composant` couvre exactement `None` + `""`.
