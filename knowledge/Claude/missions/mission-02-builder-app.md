# Mission 02 — Builder : Générer une micro-app

**Rôle** : Product Builder / Développeur  
**Niveau** : Intermédiaire  
**Durée estimée** : 3-4 heures  
**Objectif** : Utiliser Claude Code pour construire un outil interne de suivi de la rétention Pixio

---

## Contexte Pixio

L'équipe Pixio n'a pas de dashboard centralisé pour suivre la rétention par cohorte. Les données sont dans PostgreSQL mais personne ne sait facilement "quels utilisateurs de la cohorte Janvier sont encore là en M3 ?".

Le VP Engineering, Sam Costa, t'a briefé :

> *"On a besoin d'un outil interne simple — une webapp qui permet à l'équipe CS et PM de suivre les cohortes de rétention mois par mois. Pas besoin d'être beau, besoin d'être utile. On veut voir : cohorte, M1, M2, M3, M6. Et pouvoir filtrer par plan (Starter / Pro) et par segment."*

**Stack souhaitée** : React + TypeScript + Tailwind (aligné sur le reste du projet)

**Contraintes** :
- Pas d'accès à la vraie DB en dev — utiliser des données mock réalistes
- Déployable sur Vercel (pas de backend complexe)
- Le code doit être maintenable par l'équipe (pas de hack)

---

## Données mock disponibles

```typescript
// cohorts.mock.ts — Structure attendue

type CohortData = {
  cohortMonth: string;        // "2024-01", "2024-02", etc.
  plan: "Starter" | "Pro";
  segment: "Solo" | "SMB" | "Agency";
  totalUsers: number;
  retentionM1: number;        // % — ex: 0.82
  retentionM2: number;        // % — ex: 0.71
  retentionM3: number;        // % — ex: 0.78
  retentionM6: number;        // % — ex: 0.65
  churned: number;            // nombre absolu
  mrr: number;                // MRR de la cohorte
}
```

---

## Étapes de la mission

### Étape 1 — Setup et architecture (20-30 min)

**Objectif** : Créer le projet et définir l'architecture avant d'écrire du code.

**À faire avec Claude Code** :
```
Crée un nouveau projet React + TypeScript + Tailwind appelé "pixio-retention-dashboard".
Avant de générer du code, propose-moi l'architecture des composants et la structure de fichiers.
```

**Critère de réussite** : Architecture validée avant de commencer le développement (principe "architecture-first").

---

### Étape 2 — Génération des données mock (20 min)

**Objectif** : Créer des données mock réalistes qui représentent Pixio.

**À faire avec Claude Code** :
```
Génère le fichier cohorts.mock.ts avec des données réalistes pour Pixio :
- 12 cohortes mensuelles (Jan 2024 → Dec 2024)
- 3 plans × 3 segments = 9 lignes par cohorte
- Les taux de rétention doivent être réalistes (M3 autour de 78% global, Pro mieux que Starter)
- MRR cohérent avec les prix (Starter 29€, Pro 89€)
```

**Critère de réussite** : Données cohérentes et réalistes (un PM pourrait les utiliser pour tester des hypothèses).

---

### Étape 3 — Composant CohortTable (45-60 min)

**Objectif** : Composant principal de visualisation des cohortes.

**Skill à utiliser** : `starter-kit/.claude/skills/component-generator.md`

**À faire** :
1. Activer le skill dans Claude Code : `/skills component-generator`
2. Décrire le composant CohortTable
3. Générer CohortTable.tsx + types + tests

**Prompt de génération** :
```
Génère le composant CohortTable selon le skill component-generator.

Specs :
- Affiche les cohortes en lignes, les mois de rétention (M1/M2/M3/M6) en colonnes
- Coloration conditionnelle : vert si > 80%, jaune si 65-80%, rouge si < 65%
- Tri par colonne au clic
- Props : data (CohortData[]), filters (plan, segment)
- Accessible : tableau avec headers scope="col"
- TypeScript strict
```

**Critère de réussite** : Composant qui compile, avec types corrects et au moins 3 tests.

---

### Étape 4 — Filtres et état global (30-40 min)

**Objectif** : Ajouter les filtres par plan et segment.

**À faire avec Claude Code** :
```
Ajoute des filtres au dashboard :
- Select "Plan" : Tous / Starter / Pro
- Select "Segment" : Tous / Solo / SMB / Agency
- Les filtres doivent être dans un composant FilterBar séparé
- L'état des filtres doit être dans le composant parent (pas de librairie state externe)
- La CohortTable se met à jour en temps réel quand les filtres changent
```

**Critère de réussite** : Filtres fonctionnels sans rechargement de page.

---

### Étape 5 — KPIs summary (20-30 min)

**Objectif** : Ajouter une ligne de KPIs en haut du dashboard.

**À faire avec Claude Code** :
```
Ajoute un composant KpiCard et une ligne de 4 KPIs en haut du dashboard :
- Rétention M3 globale (cohortes filtrées)
- MRR total des cohortes filtrées
- Meilleure cohorte (rétention M3 max)
- Pire cohorte (rétention M3 min)
Chaque KpiCard affiche : titre, valeur, évolution vs mois précédent (flèche + %)
```

**Critère de réussite** : KPIs calculés dynamiquement selon les filtres actifs.

---

### Étape 6 — Debug et polishing (20-30 min)

**Objectif** : Corriger les problèmes et améliorer la qualité.

**À faire** :
1. Lancer les tests : `npm run test`
2. Si erreurs → utiliser `prompts-library/code/debug-root-cause.md`
3. Lancer le lint : `npm run lint`
4. Faire une code review du composant principal : `prompts-library/code/code-review.md`

**Critère de réussite** : Zéro erreur TypeScript, zéro erreur lint, tous les tests passent.

---

### Étape 7 — Déploiement Vercel (20 min) — Optionnel

**Objectif** : Déployer la micro-app en ligne.

**À faire avec Claude Code** :
```
Guide-moi pour déployer cette app sur Vercel :
- Configuration vercel.json si nécessaire
- Variables d'environnement (si applicable)
- Preview deployment vs production
```

**Critère de réussite** : URL Vercel fonctionnelle partageable avec l'équipe.

---

## Livrable attendu

Un dépôt `pixio-retention-dashboard/` contenant :
- `src/components/CohortTable.tsx` — Composant principal
- `src/components/FilterBar.tsx` — Filtres
- `src/components/KpiCard.tsx` — Cards KPIs
- `src/data/cohorts.mock.ts` — Données mock
- `src/components/CohortTable.test.tsx` — Tests
- `README.md` — Instructions d'installation et d'utilisation

---

## Auto-évaluation

| Critère | Oui | Partiel | Non |
|---------|-----|---------|-----|
| Architecture définie AVANT le premier composant | | | |
| TypeScript strict (pas de `any`) | | | |
| Composants séparés par responsabilité | | | |
| Tests pour le composant principal | | | |
| Filtres fonctionnels et réactifs | | | |
| Zéro erreur TypeScript et lint | | | |
| Code review effectuée | | | |

**Score** : `/7`

---

## Ressources

- `starter-kit/.claude/skills/component-generator.md`
- `starter-kit/.claude/commands/build-feature.md`
- `prompts-library/code/debug-root-cause.md`
- `prompts-library/code/code-review.md`
- `prompts-library/code/test-generation.md`
- `examples/react-component-badge/` (référence composant React)
