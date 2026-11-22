# Mission 01 — PM Discovery : Du problème au PRD

**Rôle** : Product Manager  
**Niveau** : Débutant  
**Durée estimée** : 2-3 heures  
**Objectif** : Partir d'un problème flou → synthèse d'interviews → problem statement → PRD complet

---

## Contexte Pixio

Tu viens d'être recruté·e comme PM chez **Pixio**. Ton premier dossier : comprendre et résoudre le problème de churn à M3.

La CEO, Léa Marchetti, t'a partagé ces informations en réunion :

> *"On a un vrai problème de rétention. Les utilisateurs arrivent, créent un ou deux visuels, et disparaissent. On ne sait pas vraiment pourquoi. Les analytics montrent qu'ils n'utilisent pas les templates avancés, pas la fonctionnalité Brand Kit, pas la collaboration. On dirait qu'ils n'arrivent pas au 'aha moment'. Le support reçoit beaucoup de tickets du type 'comment je fais ça ?' sur des fonctionnalités basiques."*

L'équipe Customer Success t'a fourni les notes de 5 interviews utilisateurs (ci-dessous).

**Ton objectif** : Produire un PRD pour une solution qui améliore l'adoption à M3.

---

## Données brutes — Notes d'interviews (à analyser)

### Interview 1 — Clara, 34 ans, Social Media Manager, PME mode
*Interview téléphonique, 25 min, réalisée par Alice (CS)*

> "J'ai découvert Pixio via une recommandation LinkedIn. Au début c'est cool, j'ai créé mon premier post Instagram en 10 minutes. Mais après... j'ai cherché comment adapter ma charte graphique et je me suis perdue dans les menus. J'ai fini par recréer mes couleurs à la main à chaque fois. C'est long. Et puis j'ai pas trouvé comment partager mon travail avec mon assistante. Du coup j'exporte tout en PDF et je lui envoie par mail."

> "Ce qui me manque : que ça se souvienne de mes couleurs et polices. Je veux pas re-paramétrer à chaque nouveau visuel."

### Interview 2 — Thomas, 28 ans, Freelance consultant, solo
*Interview vidéo, 20 min, réalisée par Marc (CS)*

> "Je l'utilise pour faire des présentations clients. Le problème c'est que j'ai des clients différents avec des identités différentes. Là j'ai pas trouvé comment avoir plusieurs 'profils' de marque. Du coup je jongle entre différents comptes. C'est absurde."

> "J'ai essayé de regarder les templates mais il y en a trop, et les catégories ne correspondent pas à mon usage. Je cherche 'présentation client B2B' et je tombe sur des trucs trop colorés pour les réseaux sociaux."

### Interview 3 — Sophie, 42 ans, Responsable communication, association
*Interview téléphonique, 30 min, réalisée par Alice (CS)*

> "On est une petite équipe, on est 3 à utiliser l'outil. Mais on a des problèmes de cohérence — chacun fait un peu ce qu'il veut. J'ai essayé de créer un 'modèle maison' mais je n'ai pas trouvé comment le rendre accessible à toute l'équipe. Du coup chacun repart de zéro."

> "Ce qu'on voudrait : un endroit où on stocke nos visuels validés, et que tout le monde puisse s'en servir comme point de départ."

### Interview 4 — Antoine, 31 ans, Growth Manager, startup tech
*Interview vidéo, 35 min, réalisée par Marc (CS)*

> "L'onboarding est trop basique. Tu arrives, tu crées un truc, et ensuite... rien. Pas de guidage vers les fonctionnalités plus puissantes. J'ai découvert le Brand Kit par accident 3 semaines après mon inscription. Et encore, je suis quelqu'un qui fouille. Mon équipe utilise même pas 10% des fonctionnalités."

> "Ce qui serait bien : une sorte de 'Getting Started' guidé après la création du premier visuel. Genre 'Maintenant que vous avez votre premier visuel, voici comment gagner du temps sur le prochain.'"

### Interview 5 — Julie, 26 ans, Community Manager, agence
*Interview téléphonique, 20 min, réalisée par Alice (CS)*

> "Je fais des visuels pour 6 marques différentes de clients. Pixio c'est bien mais c'est vraiment long de changer de contexte entre un client et l'autre. J'ai pas de raccourci pour switcher rapidement."

> "L'export aussi c'est laborieux. Chaque fois je dois remettre les paramètres d'export (taille, format). Et j'exporte toujours pareil."

---

## Données quantitatives complémentaires

**Analytics M3 (cohorte des 90 derniers jours)** :
- Taux de rétention M3 : 78% (objectif : 85%)
- % utilisateurs ayant configuré le Brand Kit : 23%
- % utilisateurs ayant invité un collaborateur : 18%
- % utilisateurs ayant utilisé les templates avancés : 31%
- Tickets support "je ne sais pas comment..." : 340/mois (+40% vs M-3)
- Feature la plus utilisée après création : Export (91%), Duplication (67%), Brand Kit (23%)

---

## Étapes de la mission

### Étape 1 — Synthèse des interviews (20-30 min)

**Objectif** : Transformer 5 interviews en insights actionnables.

**Prompt à utiliser** : `prompts-library/discovery/interview-synthesis.md`

**À faire** :
1. Copier le prompt dans Claude Code
2. Coller les 5 notes d'interviews
3. Demander une synthèse structurée (patterns, JTBD, insights P1/P2/P3)

**Critère de réussite** : Tu as identifié au moins 3 patterns récurrents et formulé 2 Job Stories.

---

### Étape 2 — Problem framing (15-20 min)

**Objectif** : Formuler le vrai problème (pas le symptôme).

**Prompt à utiliser** : `prompts-library/discovery/problem-framing.md`

**À faire** :
1. Utiliser les insights de l'étape 1 comme input
2. Appliquer les 5 Pourquoi sur le churn M3
3. Formuler 3 versions alternatives du problème
4. Choisir la formulation la plus actionnable

**Critère de réussite** : Tu as un problem statement en 2 phrases qui répond à "Qui / Quoi / Pourquoi ça n'est pas résolu aujourd'hui".

---

### Étape 3 — Sizing et priorisation (15 min)

**Objectif** : Valider que le problème vaut qu'on le résout.

**Prompt à utiliser** : `prompts-library/discovery/market-sizing.md` (adapté)

**À faire** :
1. Estimer l'impact business si on résout le churn M3 (ARR récupéré, NRR amélioré)
2. Utiliser le prompt RICE de `planning/backlog-prioritization.md` pour scorer 3 solutions possibles

**Critère de réussite** : Tu peux justifier en 1 minute pourquoi cette feature est prioritaire vs autres.

---

### Étape 4 — Rédaction du PRD (45-60 min)

**Objectif** : Produire un PRD complet et prêt pour l'engineering.

**Prompt à utiliser** : `prompts-library/writing/prd-from-notes.md`  
**Template** : `starter-kit/templates/prd-template.md`  
**Exemple de référence** : `examples/prd-saas-onboarding.md`

**À faire** :
1. Assembler les outputs des étapes 1-3
2. Utiliser le prompt PRD avec toutes les données
3. Compléter les sections manquantes manuellement si besoin
4. Faire une engineering review du PRD produit : `prompts-library/review/prd-engineering-review.md`

**Critère de réussite** : PRD avec problem statement, métriques de succès, 3+ user stories avec critères d'acceptance, risques identifiés.

---

### Étape 5 — Découpage en stories (30 min) — Optionnel

**Objectif** : Transformer le PRD en stories prêtes pour le sprint.

**Prompt à utiliser** : `prompts-library/planning/prd-to-stories.md`

**Critère de réussite** : 3 stories MVP avec critères d'acceptance testables par QA.

---

## Livrable attendu

Un dossier `missions/output-mission-01/` contenant :
- `interview-synthesis.md` — Synthèse des 5 interviews
- `problem-statement.md` — Problem framing + choix justifié
- `prd-onboarding-pixio.md` — PRD complet

---

## Auto-évaluation

| Critère | Oui | Partiel | Non |
|---------|-----|---------|-----|
| Patterns identifiés dans les interviews (≥3) | | | |
| JTBD formulés (≥2) | | | |
| Problem statement clair et non-symptôme | | | |
| PRD avec métriques de succès mesurables | | | |
| User stories avec critères d'acceptance QA | | | |
| Engineering review du PRD effectuée | | | |
| Durée < 3h | | | |

**Score** : `/7`

**Référence** : Comparer avec `examples/prd-saas-onboarding.md` — est-ce que ton PRD est aussi précis ?

---

## Ressources

- `prompts-library/discovery/interview-synthesis.md`
- `prompts-library/discovery/problem-framing.md`
- `prompts-library/writing/prd-from-notes.md`
- `prompts-library/review/prd-engineering-review.md`
- `prompts-library/planning/prd-to-stories.md`
- `starter-kit/templates/prd-template.md`
- `examples/prd-saas-onboarding.md` (exemple de référence)
