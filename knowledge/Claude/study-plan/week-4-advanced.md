# Semaine 4 — Subagents et Projet Final

**Modules couverts** : Module 5 + Projet Final  
**Durée totale estimée** : 8-12h

---

## Jours 22-23 — Comprendre les subagents

**Objectif** : Savoir quand et comment utiliser des workflows multi-agents.

### Quand utiliser les subagents ?

**Utilisez les subagents quand :**
- La tâche est divisible en sous-tâches indépendantes
- Chaque sous-tâche bénéficie d'un contexte spécialisé
- La parallélisation apporte un gain réel de qualité ou de vitesse

**N'utilisez pas les subagents pour :**
- Des tâches simples (ça coûte plus cher)
- Des tâches séquentielles où chaque étape dépend de la précédente
- L'exploration initiale (préférez une session unique)

### Jour 22 — Votre premier pipeline multi-étapes

**Exercice :**

Créez un custom command qui décompose une tâche en étapes distinctes :

**PM — pipeline veille hebdomadaire :**
```bash
cp starter-kit/.claude/commands/weekly-intel.md .claude/commands/
```

Remplissez `memory/competitors.md`, puis :
```
> /weekly-intel
[Collez des extraits d'articles concurrents de cette semaine]
```

**Builder — pipeline de feature complète :**
```
> /build-feature
[Description de votre prochaine feature]
```

Observez comment le command force une séquence : architecture → validation → code → tests.

**Critère de réussite** : Le pipeline produit un livrable multi-sections sans intervention à chaque étape. ✅

---

### Jour 23 — Orchestration et coordination

**Exercice avancé — Orchestration manuelle :**

Divisez une grosse tâche en 3 sessions Claude Code indépendantes :

```
# Session 1 : Collecte
> Analyse ces 5 articles concurrents et extrais les insights clés.
> Sauvegarde dans research/session1-insights.md
> /exit

# Session 2 : Analyse (nouveau /clear)
> Lis research/session1-insights.md
> Génère une matrice de comparaison avec notre produit
> Sauvegarde dans research/session2-matrix.md
> /exit

# Session 3 : Synthèse et action (nouveau /clear)
> Lis research/session2-matrix.md
> Génère les recommandations produit priorisées P1/P2/P3
> Sauvegarde dans research/session3-recommendations.md
```

**Pourquoi ce pattern fonctionne :** chaque session a un contexte propre et ciblé. La qualité est meilleure qu'une seule session qui tout faire.

---

## Jours 24-26 — Projet Final

**Objectif** : Construire votre "AI Product OS" personnel — un workspace opérationnel que vous utilisez au quotidien.

### Qu'est-ce que l'AI Product OS ?

C'est l'ensemble de vos fichiers, skills, commands et workflows Claude Code organisés pour vous permettre de travailler 2x plus vite dans votre rôle.

### Jour 24 — Audit et organisation

**Ce que vous faites :**

1. Listez tous les fichiers que vous avez créés depuis 3 semaines
2. Organisez-les dans la structure finale :

```bash
votre-workspace/
├── CLAUDE.md                (à jour et complet)
├── .claude/
│   ├── settings.json        (MCP configuré)
│   ├── skills/              (3-5 skills opérationnels)
│   └── commands/            (3+ custom commands)
├── memory/                  (5 fichiers remplis)
├── templates/               (templates réutilisables)
├── prompts/                 (bibliothèque de prompts)
└── [dossiers de contenu selon votre rôle]
```

3. Vérifiez chaque fichier — supprimez ce qui ne sert plus, complétez ce qui est incomplet.

---

### Jour 25 — Intégration complète

**Test d'intégration — exécutez ce workflow complet sans aide :**

**PM :**
1. Ouvrez Claude Code dans votre workspace
2. Générez un PRD pour une feature fictive en 15 min
3. Faites une engineering review avec `/prd-review`
4. Exportez vers Notion via MCP
5. Lancez `/weekly-intel` sur 3 articles concurrents

**Builder :**
1. Créez une nouvelle feature avec `/build-feature`
2. Vérifiez que les tests passent
3. Commitez avec un message structuré
4. Créez une PR GitHub via MCP

**Designer :**
1. Générez les specs d'un composant depuis des notes
2. Faites une revue UX avec `ux-reviewer`
3. Créez le handoff engineering
4. Exportez la documentation vers Notion ou Figma

**Design Engineer :**
1. Extrayez les specs d'un composant Figma
2. Générez le composant avec `component-generator`
3. Vérifiez l'accessibilité
4. Complétez la story Storybook

---

### Jour 26 — Documentation de votre OS

**Objectif** : Documenter votre workflow pour pouvoir le reproduire et le partager.

Créez `WORKFLOW.md` à la racine de votre workspace :

```markdown
# Mon Workflow Claude Code — [Rôle]

## Mes sessions types

### Session "Discovery / Research" (PM)
1. `claude` dans le dossier
2. "Lis les fichiers de discovery/ et synthétise en 5 insights"
3. Sauvegarde dans research/

### Session "PRD" (PM)
1. `claude`
2. "/prd-review" si j'ai déjà un draft
3. Ou : skill prd-writer + template

## Mes raccourcis quotidiens
- `/prd-review` : avant tout partage de PRD
- `/weekly-intel` : chaque lundi matin
- `/compact` : si la session dure > 30 min

## Ce qui fonctionne bien
[Notes sur vos patterns efficaces]

## Ce qui ne fonctionne pas
[Notes sur les pièges à éviter]
```

---

## Jours 27-28 — Affinage et personnalisation

**Objectif** : Identifier et combler les dernières lacunes.

**Jour 27 — Ce qui vous frustre encore :**

Faites la liste de 3 tâches que vous faites encore "manuellement" que Claude Code pourrait faire. Créez un skill ou un command pour chacune.

**Jour 28 — Partager et tester :**

Partagez votre workflow avec un collègue ou testez-le sur un contexte différent du vôtre. Les lacunes apparaissent toujours quand quelqu'un d'autre essaie.

---

## Jours 29-30 — Bilan et suite

**Jour 29 — Auto-évaluation finale :**

Faites `self-evaluation.md` en entier. Soyez honnête sur les lacunes.

Pour chaque compétence avec un score < 7 : identifiez une action concrète pour progresser.

**Jour 30 — Ce qui vient ensuite :**

Selon les priorités du bootcamp :

| Niveau suivant | Quoi apprendre |
|---------------|---------------|
| Technique | Git avancé, API basics, JSON |
| Automatisation | Python léger, scripts bash |
| IA avancée | LangChain, RAG systems, AI evals |
| Architecture | Multi-agent systems, AI pipelines |

---

## Récapitulatif Semaine 4

| Jour | Acquis |
|------|--------|
| J22-23 | Workflows multi-étapes et orchestration |
| J24 | Workspace organisé et audité |
| J25 | Workflow complet end-to-end sans aide |
| J26 | Documentation de votre OS |
| J27-28 | Personnalisation et affinage |
| J29-30 | Bilan et plan de suite |

**Preuve de maîtrise finale** : Quelqu'un de nouveau peut cloner votre workspace et être opérationnel en 30 minutes en lisant uniquement votre CLAUDE.md et WORKFLOW.md.
