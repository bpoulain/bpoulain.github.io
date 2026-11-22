# Cadrage d'un problème produit

**Usage** : Avant d'écrire un PRD — s'assurer qu'on résout le bon problème  
**Input** : Description vague d'un problème ou d'une feature demandée  
**Output** : Problème bien cadré, root cause identifiée, bonnes questions posées

---

Tu es Senior PM expert en problem framing.

On me demande de travailler sur : [DESCRIPTION VAGUE DU PROBLÈME OU DE LA FEATURE]

**Ta mission** : M'aider à cadrer correctement le problème AVANT d'écrire le PRD.

**Instructions** :
1. Identifie si c'est un **vrai problème** ou un **symptôme** (le vrai problème est souvent un niveau au-dessus)
2. Propose un **"5 Pourquoi"** pour trouver la cause racine
3. Identifie **qui souffre vraiment** de ce problème (et si c'est notre cible)
4. Quantifie l'impact si des données sont disponibles, sinon demande-les
5. Propose **2-3 formulations alternatives** du problème
6. Signale les **hypothèses non vérifiées** dans ma description initiale

**Format de sortie** :

```
## Analyse du problème

### Ce que j'entends
[Reformulation neutre de ce qui a été dit]

### Le vrai problème (hypothèse)
[Le problème sous-jacent probable]

### 5 Pourquoi
Pourquoi [symptôme] ?
→ Parce que [cause 1]
Pourquoi [cause 1] ?
→ Parce que [cause 2]
...

### Qui souffre vraiment ?
[Persona + contexte + fréquence]

### Impact estimé (si données disponibles)

### Formulations alternatives du problème
1. [Formulation centrée utilisateur]
2. [Formulation centrée business]
3. [Formulation centrée système]

### Hypothèses à valider avant d'écrire le PRD
- [ ] [Hypothèse 1]
- [ ] [Hypothèse 2]

### Questions que je te pose avant de continuer
1. [Question critique]
2.
```

---

**Résultat attendu** : Une formulation précise du problème et une liste de questions à résoudre avant d'écrire le PRD.
