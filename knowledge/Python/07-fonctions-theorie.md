# 7. Fonctions

## 7.1 Modèle mental

Une fonction Python est un bloc de logique nommé et réutilisable qui **transforme des données**. Pas de DOM, pas d'événements — elle reçoit des données en entrée et produit un résultat (ou un effet de bord explicite).

*Analogie :*
- **JS vanilla** : fonction pour manipuler le DOM ou répondre à des événements
- **Reef.js** : fonction `template` qui retourne du HTML depuis le state
- **Python** : fonction qui **transforme des données** → résultat. Point.

---

## 7.2 Définition et retour

### 7.2.1 Syntaxe de base

```python
def saluer(prenom):
    message = f"Bonjour, {prenom} !"
    return message

resultat = saluer("Alice")
print(resultat)   # "Bonjour, Alice !"
```

### 7.2.2 `return` et valeurs de retour

```python
# Retour simple
def carre(x):
    return x ** 2

# Retour multiple (tuple implicite)
def dimensions():
    return 1920, 1080   # retourne (1920, 1080)

largeur, hauteur = dimensions()   # unpacking

# Sans return → retourne None implicitement
def afficher(msg):
    print(msg)

resultat = afficher("test")   # None
```

### 7.2.3 Early return

```python
def calculer_taux(utilises, disponibles):
    if disponibles == 0:
        return 0.0   # sortie anticipée — évite la division par zéro
    return utilises / disponibles * 100
```

---

## 7.3 Paramètres

### 7.3.1 Positionnels

```python
def creer_token(nom, valeur, categorie):
    return {"nom": nom, "valeur": valeur, "categorie": categorie}

token = creer_token("color-primary", "#3B82F6", "color")
```

### 7.3.2 Nommés (keyword arguments)

```python
# L'ordre n'a plus d'importance
token = creer_token(valeur="#3B82F6", categorie="color", nom="color-primary")

# Très utile pour les fonctions avec de nombreux paramètres
```

### 7.3.3 Valeurs par défaut

```python
def creer_token(nom, valeur, categorie="color", actif=True):
    return {"nom": nom, "valeur": valeur, "categorie": categorie, "actif": actif}

# Appels valides
token1 = creer_token("color-primary", "#3B82F6")
token2 = creer_token("spacing-4", "16px", "spacing")
token3 = creer_token("color-old", "#aaa", actif=False)
```

**Règle** : les paramètres avec valeurs par défaut doivent toujours venir **après** les paramètres sans défaut.

**Rappel §4** : ne jamais utiliser `list`, `dict`, `set` comme valeur par défaut — utiliser `None`.

### 7.3.4 `*args` — arguments positionnels variables

```python
def somme(*nombres):
    return sum(nombres)

somme(1, 2, 3)         # 6
somme(1, 2, 3, 4, 5)   # 15
```

`*args` capture les arguments positionnels supplémentaires dans un **tuple**.

### 7.3.5 `**kwargs` — arguments nommés variables

```python
def creer_composant(nom, **options):
    return {"nom": nom, **options}

c = creer_composant("Button", taille=32, couleur="blue", actif=True)
# {"nom": "Button", "taille": 32, "couleur": "blue", "actif": True}
```

`**kwargs` capture les arguments nommés supplémentaires dans un **dict**.

### 7.3.6 Ordre des paramètres

```python
def f(pos1, pos2, *args, kwonly, **kwargs):
    ...
# 1. Positionnels sans défaut
# 2. Positionnels avec défaut
# 3. *args
# 4. Keyword-only (après *)
# 5. **kwargs
```

---

## 7.4 Type hints — typage explicite (Python 3.12+)

### 7.4.1 Syntaxe

```python
def calculer_taux(utilises: int, disponibles: int) -> float:
    if disponibles == 0:
        return 0.0
    return utilises / disponibles * 100

def creer_token(nom: str, valeur: str, actif: bool = True) -> dict:
    return {"nom": nom, "valeur": valeur, "actif": actif}
```

*Syntaxe :* `parametre: type` pour les arguments, `-> type` pour le retour.

### 7.4.2 Types composés (module `typing` / syntaxe Python 3.10+)

```python
# Python 3.10+ — syntaxe moderne
def traiter(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Union de types (Python 3.10+)
def convertir(valeur: str | int | None) -> str:
    return str(valeur) if valeur is not None else ""

# Optionnel (équivalent à T | None)
from typing import Optional
def chercher(nom: str) -> Optional[dict]:   # peut retourner None
    ...
```

### 7.4.3 Les hints ne sont pas vérifiés à l'exécution

```python
def carre(x: int) -> int:
    return x ** 2

carre("hello")   # Ne lève PAS d'erreur — Python ne vérifie pas les hints
```

Les type hints sont vérifiés par des outils externes : `mypy`, `pyright`, ou l'IDE.

*Pont mental :* les type hints ressemblent aux annotations TypeScript ou aux JSDoc — documentation vivante + outil de vérification statique.

---

## 7.5 Portée — règle LEGB

Python résout les noms dans cet ordre : **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in.

```python
x = 10   # Global

def externe():
    x = 20   # Enclosing

    def interne():
        x = 30   # Local
        print(x)  # 30 — Local trouvé en premier

    interne()
    print(x)   # 20 — Enclosing

externe()
print(x)   # 10 — Global
```

### 7.5.1 `global` et `nonlocal`

```python
compteur = 0

def incrementer():
    global compteur   # déclare qu'on modifie la variable globale
    compteur += 1

# nonlocal : modifier la variable d'une fonction englobante
def externe():
    total = 0
    def ajouter(n):
        nonlocal total
        total += n
    ajouter(5)
    ajouter(3)
    return total   # 8
```

*Bonne pratique* : éviter `global`. Préférer passer les données en paramètre et retourner le résultat.

---

## 7.6 Fonctions pures vs effets de bord

### 7.6.1 Fonction pure

- Même entrée → toujours même sortie
- Ne modifie rien à l'extérieur
- Testable, prévisible

```python
# ✅ Pure
def formater_token(nom: str, valeur: str) -> str:
    return f"--{nom}: {valeur};"

# ✅ Pure
def filtrer_actifs(tokens: list[dict]) -> list[dict]:
    return [t for t in tokens if t["actif"]]
```

### 7.6.2 Fonction avec effet de bord

```python
# Effet de bord explicite et documenté — acceptable
def ajouter_token(catalogue: list, token: dict) -> None:
    catalogue.append(token)   # modifie l'argument

# ❌ Effet de bord caché — à éviter
def compter_tokens(tokens):
    tokens.sort()       # modifie l'entrée de manière inattendue
    return len(tokens)
```

---

## 7.7 `lambda` — fonctions anonymes

```python
# Syntaxe : lambda params: expression
double = lambda x: x * 2
double(5)   # 10

# Utilisation courante : comme argument de sorted/min/max
tokens = [{"nom": "spacing-8", "val": "32px"}, {"nom": "color-primary", "val": "#3B82F6"}]
sorted(tokens, key=lambda t: t["nom"])

# ⚠️ Limites : une seule expression, pas de return, pas de type hint
# Pour de la logique complexe → def nommé
```

*Équivalent JS :* `x => x * 2`. Mais en Python, préférer `def` pour tout ce qui dépasse une expression simple.

---

## 7.8 Comparaison des paradigmes — §7

| Concept | JS vanilla | Reef.js | Python |
|---|---|---|---|
| Déclaration | `function f()` / `const f = () =>` | `function template()` | `def f():` |
| Retour | `return` | `return htmlString` | `return` |
| Arguments variadiques | `...args` (rest) | — | `*args`, `**kwargs` |
| Typage | TypeScript / JSDoc | — | Type hints (Python 3.10+) |
| Portée | closure sur le scope parent | closure sur le composant | LEGB |
| Fonction pure | `const f = (x) => x * 2` | `template` (idéalement pure) | `def f(x): return x * 2` |
| Anonyme | `x => x * 2` | `(x) => x * 2` | `lambda x: x * 2` |
