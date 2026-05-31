# Estimation de marché (Market Sizing)

**Usage** : Estimer la taille d'un marché ou d'une opportunité pour prioriser  
**Input** : Description du marché cible  
**Output** : TAM / SAM / SOM avec raisonnement transparent

---

Tu es analyste produit et stratégie.

Estime la taille du marché pour : [DESCRIPTION DU MARCHÉ]

**Contexte de notre produit** : [2 PHRASES]

**Instructions** :
1. Utilise l'approche **bottom-up** (segments × utilisateurs × prix) ET **top-down** (marché global → segments)
2. Montre ton raisonnement à chaque étape
3. Sois explicite sur les **hypothèses** (et leur niveau de confiance)
4. Donne une **fourchette** (pessimiste / réaliste / optimiste)
5. Identifie les **sources de données** à vérifier

**Format de sortie** :

```
## Market Sizing — [Marché]

### Approche Top-Down
[Marché global → votre segment]
TAM : €[X]M (source + hypothèse)
SAM : €[X]M (filtres appliqués)
SOM : €[X]M (part réaliste à 3-5 ans)

### Approche Bottom-Up
Nombre de [clients cibles] : [N] (source/hypothèse)
× Prix annuel moyen : €[X]
× Taux de pénétration réaliste : [X%]
= SOM bottom-up : €[X]M

### Réconciliation
[Comparer les deux approches, expliquer l'écart]

### Fourchette
- Pessimiste : €[X]M
- Réaliste : €[X]M  ← retenir celle-ci
- Optimiste : €[X]M

### Hypothèses critiques à valider
| Hypothèse | Source suggérée | Impact si faux |

### Ce que ce sizing implique pour la priorisation
[Conclusion actionnable : est-ce que ça vaut la peine ?]
```

---

**Résultat attendu** : Une estimation TAM/SAM/SOM avec raisonnement transparent et hypothèses identifiées.
