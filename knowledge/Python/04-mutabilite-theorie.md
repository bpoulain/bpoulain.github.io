# 4. Mutabilité & modèle mémoire

## 4.1 Modèle mental

En Python, les variables ne **contiennent pas** des valeurs — elles **pointent vers** des objets en mémoire. Comprendre cela évite une classe entière de bugs silencieux.

*Analogie :*
- Une variable = un post-it avec une adresse
- L'objet = la maison à cette adresse
- Assigner `b = a` = copier l'adresse sur un nouveau post-it, pas construire une nouvelle maison

---

## 4.2 Mutable vs immuable

| Type | Mutable ? | Exemples |
|---|---|---|
| `list` | Oui | `[1, 2, 3]` |
| `dict` | Oui | `{"a": 1}` |
| `set` | Oui | `{1, 2, 3}` |
| `int` | Non | `42` |
| `float` | Non | `3.14` |
| `str` | Non | `"texte"` |
| `tuple` | Non | `(1, 2)` |
| `bool` | Non | `True` |
| `None` | Non | `None` |

**Immuable** = une fois créé, l'objet ne peut pas être modifié. Toute "modification" crée un **nouvel objet**.

```python
texte = "hello"
texte += " world"   # crée un NOUVEAU string, "hello" n'est pas modifié
# texte pointe maintenant vers "hello world"
```

---

## 4.3 Références et copies

### 4.3.1 Le problème d'assignation

```python
# Avec des immuables : comportement intuitif
a = 42
b = a
b = 99
print(a)   # 42 — a est inchangé (les int sont immuables)

# Avec des mutables : comportement surprenant
liste_a = [1, 2, 3]
liste_b = liste_a    # même objet, deux étiquettes
liste_b.append(4)
print(liste_a)       # [1, 2, 3, 4] — liste_a est modifiée !
```

**Pourquoi ?** `liste_b = liste_a` ne copie pas la liste — elle copie la **référence** (l'adresse mémoire). Les deux variables pointent vers le même objet.

*Équivalent Reef* : `signal.value = autreSignal.value` en Reef copie la référence si c'est un objet — même piège.

### 4.3.2 Vérifier l'identité avec `id()`

```python
liste_a = [1, 2, 3]
liste_b = liste_a
liste_c = [1, 2, 3]

id(liste_a) == id(liste_b)   # True — même objet
id(liste_a) == id(liste_c)   # False — objets différents

liste_a is liste_b   # True
liste_a is liste_c   # False
liste_a == liste_c   # True (valeurs identiques)
```

---

## 4.4 Copier des objets

### 4.4.1 Copie superficielle (shallow copy)

Crée un nouvel objet avec les mêmes références de premier niveau.

```python
import copy

# Méthodes pour les listes
liste_b = liste_a[:]           # slicing
liste_b = liste_a.copy()       # méthode .copy()
liste_b = list(liste_a)        # reconstruction

# Pour les dicts
dict_b = dict_a.copy()
dict_b = {**dict_a}            # spread — Python 3.9+ : dict_a | {}
```

```python
# La copie superficielle suffit pour des structures plates
originale = [1, 2, 3]
copie = originale.copy()
copie.append(4)
print(originale)   # [1, 2, 3] — inchangée ✅
```

**Limite** : si la liste contient d'autres listes (imbrication), la copie superficielle ne copie pas les sous-objets.

```python
imbriquee = [[1, 2], [3, 4]]
copie_superficielle = imbriquee.copy()

copie_superficielle[0].append(99)
print(imbriquee)   # [[1, 2, 99], [3, 4]] — sous-liste modifiée !
```

### 4.4.2 Copie profonde (deep copy)

Copie récursivement tous les objets imbriqués.

```python
import copy

imbriquee = [[1, 2], [3, 4]]
copie_profonde = copy.deepcopy(imbriquee)

copie_profonde[0].append(99)
print(imbriquee)   # [[1, 2], [3, 4]] — inchangée ✅
```

*Équivalent JS* : `structuredClone(obj)` (ES2022) — Python avait `deepcopy` bien avant.

### 4.4.3 Quand utiliser quoi ?

```
Structure plate (pas d'imbrication) → .copy() ou [:]
Structure imbriquée → copy.deepcopy()
Doute → copy.deepcopy() (plus sûr, légèrement plus lent)
```

---

## 4.5 Effets de bord dans les fonctions

### 4.5.1 Les fonctions reçoivent des références

```python
def ajouter_element(liste, element):
    liste.append(element)   # modifie la liste ORIGINALE

ma_liste = [1, 2, 3]
ajouter_element(ma_liste, 4)
print(ma_liste)   # [1, 2, 3, 4] — l'original est modifié !
```

Ce comportement est un **effet de bord** : la fonction modifie un état extérieur à elle-même.

### 4.5.2 Fonctions pures vs fonctions avec effets de bord

```python
# Avec effet de bord (modifie l'original)
def ajouter_en_place(liste, element):
    liste.append(element)

# Pure (retourne un nouveau résultat, ne touche pas à l'original)
def ajouter(liste, element):
    return liste + [element]   # crée une nouvelle liste

# Ou avec copie explicite
def ajouter(liste, element):
    nouvelle = liste.copy()
    nouvelle.append(element)
    return nouvelle
```

*Modèle mental Reef → Python :*
- En Reef, `signal.value = newValue` déclare explicitement le changement d'état
- En Python, un objet mutable peut être modifié **depuis n'importe quelle référence** — sans signal, sans notification

### 4.5.3 Pièges des valeurs par défaut mutables

```python
# ❌ Bug classique — valeur par défaut mutable partagée entre tous les appels
def ajouter_tag(tag, tags=[]):
    tags.append(tag)
    return tags

ajouter_tag("responsive")   # ["responsive"]
ajouter_tag("dark-mode")    # ["responsive", "dark-mode"] — inattendu !
```

**Pourquoi ?** La liste `[]` par défaut est créée **une seule fois** à la définition de la fonction, pas à chaque appel.

```python
# ✅ Correction idiomatique
def ajouter_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags
```

---

## 4.6 Comparaison des paradigmes — §4

| Concept | JS vanilla | Reef.js | Python |
|---|---|---|---|
| Copie d'objet | `{...obj}` (shallow) | lecture de `signal.value` | `.copy()` (shallow), `deepcopy()` |
| Copie profonde | `structuredClone()` | — | `copy.deepcopy()` |
| Mutation | directe (`obj.prop = x`) | via `signal.value = ...` (déclenche re-render) | directe (listes, dicts) |
| Détection de mutation | non (sauf proxy) | automatique via signal | non (tu dois gérer) |
| Immuabilité | `Object.freeze()` | signal sans setter | `tuple` |
| Effet de bord | fréquent en JS | isolé dans les signaux | fréquent si non contrôlé |
