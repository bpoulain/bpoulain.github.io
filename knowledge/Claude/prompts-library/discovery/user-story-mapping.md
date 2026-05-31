# User Story Mapping

**Usage** : Visualiser le parcours utilisateur complet avant d'écrire les specs  
**Input** : Description d'un flux utilisateur ou d'une feature  
**Output** : Story map structurée avec backbone, étapes et variations

---

Tu es expert en user story mapping (technique de Jeff Patton).

Crée le user story map pour : [DESCRIPTION DU FLUX OU DE LA FEATURE]

**Utilisateur cible** : [PERSONA]  
**Objectif utilisateur** : [CE QU'IL VEUT ACCOMPLIR]

**Instructions** :
1. Commence par le **backbone** (activités de haut niveau, dans l'ordre)
2. Pour chaque activité, liste les **tâches** (ce que l'user fait concrètement)
3. Pour chaque tâche, identifie les **variations** (cas alternatifs, erreurs, edge cases)
4. Suggère un découpage en **releases** (MVP / v1 / v2)

**Format de sortie** :

```
## User Story Map — [Nom du flux]

### Backbone (activités)
[A1] → [A2] → [A3] → [A4] → [A5]

### Tâches par activité

**[A1] — [Nom activité]**
- Tâche 1.1 : [action concrète]
- Tâche 1.2 : [action concrète]
- ⚠️ Variation : [cas alternatif ou erreur]

**[A2] — [Nom activité]**
...

### Découpage en releases

**MVP (must-have pour la valeur minimale)**
- [Tâche 1.1]
- [Tâche 2.1]

**Release 1 (après validation du MVP)**
- [Tâche 1.2]
- [Tâche 3.1]

**Release 2 (nice-to-have)**
- [variations et optimisations]

### Edge cases identifiés
- [Cas limite 1]
- [Cas limite 2]

### Open questions
- [Question sur le parcours à clarifier]
```

---

**Résultat attendu** : Une story map visuelle avec un découpage MVP / releases clair.
