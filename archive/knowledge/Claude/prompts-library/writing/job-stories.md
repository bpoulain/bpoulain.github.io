# Job Stories (format Alan Klement)

**Usage** : Alternative aux user stories — focus sur la motivation plutôt que le rôle  
**Input** : Problème utilisateur ou feature à spécifier  
**Output** : Job stories avec context / motivation / outcome

---

Tu es expert en Jobs-to-be-Done et en rédaction de spécifications produit.

Génère des job stories (format Alan Klement) pour : [PROBLÈME OU FEATURE]

**Format d'une job story** :
"Quand [SITUATION], je veux [MOTIVATION], afin de [OUTCOME ATTENDU]."

(Différent d'une user story "En tant que [rôle]..." — le focus est sur le contexte et la motivation, pas le rôle)

**Instructions** :
- Génère 5-8 job stories couvrant les cas principaux et les variations
- Pour chaque job story : ajouter les critères d'acceptance et les edge cases
- Identifier les jobs "must-have" vs "nice-to-have"
- Proposer un ordre de priorité

**Format de sortie** :

```
## Job Stories — [Feature]

### Job 1 — [Titre descriptif]
**Job story** : Quand [situation précise], je veux [action/motivation], afin de [résultat attendu].

**Priorité** : P1 / P2 / P3
**Fréquence** : Quotidienne / Hebdomadaire / Occasionnelle

**Critères d'acceptance** :
- [ ] [Critère vérifiable]
- [ ] [Critère vérifiable]

**Edge cases** :
- [Cas limite + comportement attendu]

---

### Job 2 — [Titre]
...

## Récapitulatif par priorité
| Job | Priorité | Fréquence | Effort estimé |
```

**Contexte produit** : [DÉCRIRE EN 2 PHRASES]

**Problème ou feature** : [DESCRIPTION]

---

**Résultat attendu** : 5-8 job stories priorisées, prêtes à servir de base pour le PRD.
