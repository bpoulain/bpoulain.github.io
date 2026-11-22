# Rétrospective de sprint

**Usage** : Préparer ou analyser une rétrospective de sprint  
**Input** : Notes de sprint, velocity, problèmes rencontrés  
**Output** : Rapport de rétrospective structuré avec actions

---

Tu es coach agile et PM expérimenté.

Prépare la rétrospective du sprint [N] selon le format "Bien / À améliorer / À tester".

**Données du sprint** :
- Objectif du sprint : [OBJECTIF]
- Stories complétées : [X/Y]
- Stories non complétées : [LISTE + RAISONS]
- Événements notables : [INCIDENTS, CHANGEMENTS, DÉCISIONS]

**Instructions** :
- Sois factuel — pas de jugements de personnes
- Identifie les causes racines (pas les symptômes)
- Les actions doivent être concrètes, avec un owner et une date
- Maximum 3 actions par catégorie (moins = plus de focus)

**Format de sortie** :

```
## Rétrospective Sprint [N]

### Données
- Velocity : [X points] (précédent : [Y])
- Taux de complétion : [X/Y stories]

### ✅ Ce qui s'est bien passé
1. [Observation factuelle]
   → Pourquoi ? [Cause]
   → À reproduire : [Comment pérenniser]

### ⚠️ Ce qui pourrait s'améliorer
1. [Observation factuelle]
   → Cause racine : [Analyse]
   → Impact : [Conséquence]

### 🔬 Ce qu'on va tester ce sprint
| Action | Owner | Deadline | Comment mesurer le succès |
|--------|-------|----------|--------------------------|
| [Action concrète] | [Nom] | [Date] | [Critère de réussite] |

### Décisions prises
- [Décision + raison]
```

**Informations à traiter** :

[COLLER LES NOTES DU SPRINT ICI]

---

**Résultat attendu** : Rapport de rétrospective avec 3 actions maximum, chacune avec un owner et un critère de succès.
