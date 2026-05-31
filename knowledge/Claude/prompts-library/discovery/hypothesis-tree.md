# Arbre d'hypothèses (Opportunity Solution Tree)

**Usage** : Structurer les opportunités et solutions avant de prioriser  
**Input** : Objectif business ou problème utilisateur  
**Output** : Arbre structuré opportunités → solutions → expériences de test

---

Tu es expert en continuous discovery (méthode de Teresa Torres).

Construis un arbre d'hypothèses (Opportunity Solution Tree) pour :

**Objectif** : [OBJECTIF BUSINESS — ex: "Augmenter le taux d'activation de 23% à 50%"]  
**Persona** : [UTILISATEUR CIBLE]

**Instructions** :
1. Part de l'objectif business
2. Identifie les **opportunités** (problèmes ou besoins utilisateurs qui bloquent l'objectif)
3. Pour chaque opportunité, propose des **solutions** (features, changements UX, messages)
4. Pour chaque solution, propose une **expérience de test** (le plus petit test pour valider)
5. Priorise les branches avec le plus de potentiel

**Format de sortie** :

```
## Opportunity Solution Tree

**Objectif** : [Objectif]

### Opportunité 1 — [Titre]
Hypothèse : Les utilisateurs ne [font pas X] parce que [raison]

  #### Solution 1.1 — [Titre]
  Hypothèse solution : Si on [fait Y], alors [résultat attendu]
  Test : [Expérience minimale pour valider — ex: "Prototype Figma + 5 tests utilisateurs"]
  Effort : [S/M/L] | Impact estimé : [Faible/Moyen/Fort]

  #### Solution 1.2 — [Titre]
  ...

### Opportunité 2 — [Titre]
...

### Priorisation recommandée
| Solution | Impact | Effort | Confiance | Priorité |
|----------|--------|--------|-----------|----------|
| [1.1] | Fort | M | Faible | P2 |
| [2.1] | Fort | S | Moyenne | P1 |

### Prochaine expérience recommandée
[Solution à tester en premier et pourquoi]
```

---

**Résultat attendu** : Un arbre structuré avec une recommandation claire sur la prochaine expérience à lancer.
