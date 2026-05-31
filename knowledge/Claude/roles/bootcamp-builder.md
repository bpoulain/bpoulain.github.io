# Bootcamp Claude Code — 🔨 Product Builder

> Document autonome extrait du bootcamp complet (`draft_AI_Discovery.md`).
> Contient uniquement les modules et sections pertinents pour un Product Builder.

**Durée totale** : ~3-4 semaines | **Niveau** : Débutant à intermédiaire en code

---

## Votre objectif

À la fin de ce parcours, vous savez :

✅ Générer la structure complète d'une application avec Claude Code  
✅ Développer feature par feature avec un workflow structuré  
✅ Debugger efficacement avec l'IA comme partenaire  
✅ Utiliser Git dans votre workflow Claude Code  
✅ Connecter des APIs externes via MCP  
✅ Déployer une application fonctionnelle  

---

## Semaine 1 — Fondations techniques

### Installation complète

```bash
# 1. Homebrew (Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Node.js
brew install node

# 3. Git (si pas déjà installé)
brew install git

# 4. Claude Code
npm install -g @anthropic-ai/claude-code

# 5. Vérifier
claude --version && node --version && git --version
```

### CLAUDE.md pour un projet Builder

```markdown
# [Nom de l'application]

## Concept
[Ce que fait l'app en 2 phrases]

## Stack technique
- Frontend : React 18 + TypeScript + Vite + Tailwind CSS
- Backend : Node.js + Express (ou Next.js full-stack)
- Base de données : PostgreSQL + Prisma
- Déploiement : Vercel (frontend) + Railway (backend + DB)

## Architecture
[Description de l'architecture]

## Rôle de l'IA
Tu es senior developer avec une expertise sur ma stack.
Tu codes toujours de la façon la plus simple possible.
Tu gères les erreurs explicitement, tu ne supposes pas.

## Conventions de code
- Langue des commentaires : Français
- Nommage : camelCase (JS/TS), kebab-case (fichiers)
- TypeScript strict — pas de `any`
- Tests pour toutes les fonctions critiques

## Commandes
- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm test` : tests

## Git workflow
- Convention commits : type(scope): description
  Types : feat / fix / refactor / test / docs / chore
- Committer avant toute modification massive par l'IA

## Ne pas faire
- Ne pas stocker de secrets dans le code
- Ne pas utiliser `any` en TypeScript
- Toujours gérer les cas d'erreur explicitement
```

### Workspace Builder

```bash
mkdir -p mon-app/{src,tests,docs,memory}
cd mon-app
git init
touch CLAUDE.md .gitignore
cp path/to/starter-kit/.claude/commands/build-feature.md .claude/commands/
```

---

## Semaine 2 — Générer des applications

### Workflow de génération d'app

La clé est de **décomposer** et de **valider à chaque étape** :

```
1. Architecture (Claude propose → vous validez)
         ↓
2. Structure de projet (fichiers créés)
         ↓
3. Feature par feature (avec validation à chaque étape)
         ↓
4. Tests (générés ou écrits avec Claude Code)
         ↓
5. Déploiement
```

### Démarrer une nouvelle app

**Prompt de démarrage :**

```
Tu es senior developer avec une expertise [stack de votre CLAUDE.md].

Je veux construire [description de l'app].

Phase 1 — Architecture uniquement :
- Propose l'architecture adaptée
- Génère la structure de dossiers complète
- Liste les dépendances avec justification
- Identifie les décisions techniques à prendre

Ne génère pas encore de code. Je veux valider l'architecture d'abord.
```

**Après validation de l'architecture :**

```
L'architecture est validée. Génère maintenant :
1. package.json avec toutes les dépendances
2. tsconfig.json
3. Structure de dossiers complète (fichiers vides)
4. README.md avec les commandes de démarrage
```

### Développer une feature avec `/build-feature`

```bash
> /build-feature

Je veux implémenter : [description précise de la feature]

Fichiers existants concernés :
- [fichier 1]
- [fichier 2]

Contraintes :
- [contrainte 1]
- [contrainte 2]
```

Le command `/build-feature` vous force à valider l'architecture avant le code.

### Debugging avec Claude Code

**Template de debugging :**

```
Le bug :
- Comportement attendu : [ce qui devrait se passer]
- Comportement actuel : [ce qui se passe]

Erreur complète :
```
[coller l'erreur ici]
```

Fichiers concernés :
- [fichier et ligne si connue]

Analyse la cause racine (pas les symptômes) et propose la correction.
Explique pourquoi le bug existe — je veux comprendre, pas juste corriger.
```

---

## Semaine 3 — MCP et intégrations

### MCP GitHub

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "votre-token"
      }
    }
  }
}
```

**Workflows avec MCP GitHub :**

```
> Crée un nouveau repo GitHub pour ce projet et push le code actuel
> Génère une pull request pour la feature [nom] avec description complète
> Liste les issues ouvertes et suggère des priorités
```

### Connexion à des APIs externes

**Prompt pour intégrer une API :**

```
Je veux intégrer l'API [nom] dans mon application.

Documentation : [URL ou coller les endpoints importants]

Ce que je veux faire : [description du cas d'usage]

Analyse les endpoints nécessaires, génère :
1. Un service TypeScript encapsulant les appels API
2. La gestion des erreurs et des retry
3. Les types TypeScript pour les réponses
4. Un test de l'intégration
```

---

## Semaine 4 — Déploiement et automatisation

### Pipeline de déploiement

**Vercel (frontend) :**

```bash
npm install -g vercel
vercel deploy
```

Avec Claude Code :

```
> Configure le déploiement Vercel pour ce projet.
  Génère vercel.json avec la config adaptée à [stack].
  Quelles variables d'environnement dois-je configurer ?
```

### Automatiser les workflows répétitifs

**Skill app-architect :**

```bash
cp starter-kit/.claude/skills/prd-writer.md .claude/skills/
# Adapter en app-architect pour votre usage
```

**Exemple : pipeline de génération de tests**

```
> Lis tous les fichiers dans src/ qui n'ont pas de fichier .test.ts associé.
  Pour chacun, génère un fichier de test avec :
  - Tests des fonctions exportées
  - Edge cases couverts
  - Pas de tests d'implémentation interne
```

---

## Votre stack recommandée

```
Claude Code
    + CLAUDE.md (contexte projet)
    + skill component-generator (si React)
    + command /build-feature (feature workflow)
    + MCP GitHub (si collaboration)
    + Vercel / Railway (déploiement)
```

---

## Checklist de progression Builder

### Semaine 1
- [ ] Claude Code + Git installés
- [ ] CLAUDE.md Builder créé et testé
- [ ] Premier projet initialisé avec Claude Code

### Semaine 2
- [ ] Architecture d'une app validée avec Claude Code
- [ ] Feature implémentée avec `/build-feature`
- [ ] Premier bug debuggé avec Claude Code

### Semaine 3
- [ ] MCP GitHub configuré
- [ ] API externe intégrée
- [ ] Tests générés automatiquement

### Semaine 4
- [ ] App déployée sur Vercel/Railway
- [ ] Pipeline de CI configuré
- [ ] Workflow complet feature → tests → deploy

---

## Ressources Builder

- Document complet : `draft_AI_Discovery.md` (sections Builder)
- Skills : `starter-kit/.claude/skills/component-generator.md`
- Commands : `starter-kit/.claude/commands/build-feature.md`
- Exemple composant : `examples/react-component-badge/`
- Plan d'étude détaillé : `study-plan/`
