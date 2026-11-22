# 4. Mutabilité & modèle mémoire — Exercices

> Tente les 3 énoncés avant de consulter les corrections en bas du fichier.

---

## Énoncés

### Exercice 1 — Traduction mentale (JS → Python)

**Objectif** : comprendre comment Python gère les copies d'objets, en comparaison avec JS.

En JS, tu fais couramment :

```js
// Copie superficielle
const original = { nom: "Button", variantes: ["primary", "ghost"] };
const copie = { ...original };
copie.nom = "InputCopie";

// Copie profonde
const copieComplete = structuredClone(original);
copieComplete.variantes.push("danger");

console.log(original.nom);        // "Button" — inchangé
console.log(original.variantes);  // ["primary", "ghost"] — inchangé
```

**Question 1a** : Traduis ces deux blocs en Python. Quelles méthodes utilises-tu ?

**Question 1b** : Que se passe-t-il si tu utilises `copie = dict(original)` puis que tu modifies `copie["variantes"].append("danger")` ? L'original est-il affecté ?

---

### Exercice 2 — Piège de paradigme

**Objectif** : débusquer le bug silencieux des valeurs par défaut mutables.

```python
def creer_composant(nom, tokens=[]):
    tokens.append(f"token-{nom}")
    return {"nom": nom, "tokens": tokens}

button = creer_composant("Button")
print(button)

input_comp = creer_composant("Input")
print(input_comp)

print(button["tokens"])  # Que vaut-il maintenant ?
```

**Question 2a** : Qu'affiche ce code ? Explique pourquoi c'est un bug.

**Question 2b** : Corrige la fonction.

---

### Exercice 3 — Mini cas réel

**Objectif** : manipuler des données de design system sans effets de bord non voulus.

**Contexte** : tu as un thème de base et tu veux créer deux variantes (clair et sombre) sans modifier le thème d'origine.

```python
theme_base = {
    "nom": "Base",
    "couleurs": {
        "primary": "#3B82F6",
        "surface": "#FFFFFF",
        "texte": "#111827"
    },
    "tokens": ["color-primary", "color-surface", "color-texte"]
}

# Ton code ici

# Résultat attendu :
# theme_clair : primary="#3B82F6", surface="#FFFFFF"
# theme_sombre : primary="#60A5FA", surface="#1F2937", texte="#F9FAFB"
# theme_base : inchangé
```

**Avant de coder** : quelle méthode de copie utilises-tu et pourquoi (`copy()` vs `deepcopy()`) ?

---

---

## Corrections

### Correction Exercice 1

#### Réponse 1a

```python
import copy

# Copie superficielle
original = {"nom": "Button", "variantes": ["primary", "ghost"]}
copie = dict(original)    # ou original.copy() ou {**original}
copie["nom"] = "InputCopie"

# Copie profonde
copie_complete = copy.deepcopy(original)
copie_complete["variantes"].append("danger")

print(original["nom"])       # "Button" — inchangé ✅
print(original["variantes"]) # ["primary", "ghost"] — inchangé ✅
```

| JS | Python équivalent |
|---|---|
| `{ ...obj }` | `obj.copy()` ou `dict(obj)` ou `{**obj}` |
| `structuredClone(obj)` | `copy.deepcopy(obj)` |

#### Réponse 1b

```python
copie = dict(original)        # copie superficielle
copie["variantes"].append("danger")
print(original["variantes"])  # ["primary", "ghost", "danger"] — MODIFIÉ !
```

**Oui, l'original est affecté.** `dict(original)` crée un nouveau dict, mais les valeurs sont **copiées par référence**. La liste `variantes` est partagée entre `original` et `copie`. Modifier `copie["variantes"]` modifie la même liste en mémoire.

---

### Correction Exercice 2

#### Ce qui s'affiche

```
{'nom': 'Button', 'tokens': ['token-Button']}
{'nom': 'Input', 'tokens': ['token-Button', 'token-Input']}
['token-Button', 'token-Input']   # ← button["tokens"] a été modifié !
```

#### ❌ Ce que le cerveau fait
Croire que `tokens=[]` crée une **nouvelle** liste vide à chaque appel.

#### ✅ Comment ça fonctionne réellement
Les valeurs par défaut mutables sont évaluées **une seule fois**, à la définition de la fonction. La même liste `[]` est réutilisée à chaque appel. Tous les appels partagent le même objet.

#### Code corrigé

```python
def creer_composant(nom, tokens=None):
    if tokens is None:
        tokens = []           # nouvelle liste à chaque appel
    tokens.append(f"token-{nom}")
    return {"nom": nom, "tokens": tokens}

button = creer_composant("Button")
input_comp = creer_composant("Input")

print(button["tokens"])     # ["token-Button"] ✅
print(input_comp["tokens"]) # ["token-Input"] ✅
```

**Règle** : ne jamais utiliser `list`, `dict` ou `set` comme valeur par défaut d'un paramètre. Utiliser `None` + initialisation conditionnelle.

---

### Correction Exercice 3

#### Choix de la méthode

`deepcopy()` est nécessaire ici car `theme_base` est imbriqué (il contient un dict `couleurs` et une liste `tokens`). Une copie superficielle partagerait ces sous-objets.

#### Code Python propre

```python
import copy

theme_base = {
    "nom": "Base",
    "couleurs": {
        "primary": "#3B82F6",
        "surface": "#FFFFFF",
        "texte": "#111827"
    },
    "tokens": ["color-primary", "color-surface", "color-texte"]
}

# Thème clair — copie du base (avec renommage)
theme_clair = copy.deepcopy(theme_base)
theme_clair["nom"] = "Clair"

# Thème sombre — copie du base + modifications
theme_sombre = copy.deepcopy(theme_base)
theme_sombre["nom"] = "Sombre"
theme_sombre["couleurs"]["primary"] = "#60A5FA"
theme_sombre["couleurs"]["surface"] = "#1F2937"
theme_sombre["couleurs"]["texte"] = "#F9FAFB"

# Vérification — theme_base inchangé
print(theme_base["couleurs"]["surface"])  # "#FFFFFF" ✅
print(theme_clair["couleurs"]["surface"])  # "#FFFFFF"
print(theme_sombre["couleurs"]["surface"]) # "#1F2937"
```

#### Piège courant
Penser que la logique Reef (signal.value = nouveau_objet) protège automatiquement les données. En Reef, la réactivité est un mécanisme de rendu — la protection des données reste ta responsabilité. Python ne diffère pas sur ce point.
