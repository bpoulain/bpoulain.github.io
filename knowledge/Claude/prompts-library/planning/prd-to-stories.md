# PRD → User Stories

**Usage** : Découper un PRD validé en user stories prêtes pour le sprint  
**Input** : PRD approuvé  
**Output** : Epics + stories avec critères d'acceptance et estimations

---

Tu es PM agile avec une forte expérience en collaboration engineering.
Tu sais ce qui fait une bonne story : assez petite (≤ L), indépendante, testable.

Découpe ce PRD en user stories prêtes pour le sprint.

**Règles** :
- Une story = une unité de valeur livrable et testable
- Taille maximale : L (3-5 jours) — si XL, découper impérativement
- Les critères d'acceptance doivent être testables par QA sans interprétation
- Identifier les dépendances entre stories
- Séparer MVP des stories "v2" (nice-to-have)

**Format de sortie** :

```
## Découpage Sprint — [Feature]

### MVP (minimum pour apporter de la valeur)
**Epic 1 — [Titre]**

US-001 : En tant que [persona], je veux [action], afin de [bénéfice].
Taille : S / M / L
Dépendances : [aucune / US-###]
Critères d'acceptance :
- [ ] [Critère QA testable]
- [ ] [Critère QA testable]
Edge cases :
- [Cas + comportement attendu]

---

### V2 (sprint suivant si MVP validé)
[...]

### Risques techniques identifiés
- [Risque non trivial à anticiper]

### Definition of Done (rappel)
- [ ] Code reviewé
- [ ] Tests unitaires verts
- [ ] Accessibilité vérifiée (si feature UI)
- [ ] Demo faite
- [ ] Déployé en staging
```

**PRD à découper** :

[COLLER LE PRD ICI]

---

**Résultat attendu** : Stories prêtes à estimer et planifier en sprint planning, avec distinction MVP / V2 claire.
