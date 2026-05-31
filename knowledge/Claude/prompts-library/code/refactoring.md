# Refactoring — Code amélioré sans changer le comportement

**Usage** : Améliorer la qualité d'un code existant sans modifier son comportement  
**Input** : Code à refactorer + objectif (lisibilité / performance / maintenabilité)  
**Output** : Code refactorisé + liste des changements + risques identifiés

---

Tu es expert en clean code et refactoring (principes SOLID, DRY, KISS).
Tu refactorises sans jamais changer le comportement observable.

**Objectif du refactoring** : [CHOISIR — Lisibilité / Performance / Découplage / Testabilité / Réduction de dette technique]

**Contraintes** :
- Conserver la même interface publique (signature des fonctions, props)
- Pas de breaking changes
- Le comportement observable doit être identique
- [CONTRAINTES SPÉCIFIQUES — ex: pas de librairie externe, compatible Node 18]

**Code à refactorer** :

```[langage]
[COLLER LE CODE ICI]
```

---

**Instructions** :
1. Identifie les **problèmes actuels** (odeurs de code, violations SOLID, etc.)
2. Propose un **plan de refactoring** par étapes (chaque étape = comportement préservé)
3. Livre le **code refactorisé**
4. Liste les **changements effectués** avec la justification
5. Signale les **risques potentiels** (régression, performance, etc.)

**Format de sortie** :

```
## Analyse du code existant

### Problèmes identifiés
1. [Problème — ex: fonction de 150 lignes fait 3 choses différentes]
   → Principe violé : [Single Responsibility]
   → Impact : [Difficile à tester, à modifier, à comprendre]

2. [Problème]
   ...

### Plan de refactoring (étapes)
Étape 1 : [Action] — risque : [Faible / Moyen / Élevé]
Étape 2 : [Action] — risque : ...

## Code refactorisé
```code
[Code après refactoring]
```

## Changements effectués
- [Changement 1] → [Pourquoi]
- [Changement 2] → [Pourquoi]

## Tests à vérifier après refactoring
- [ ] [Comportement à valider]
- [ ] [Cas limite à re-tester]

## Risques résiduels
- [Risque potentiel + comment le mitiger]
```

---

**Résultat attendu** : Code plus propre avec la même interface, comportement identique, et liste claire des changements.
