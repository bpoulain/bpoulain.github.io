# Bootcamp Premium — Claude Code pour Product Managers, Builders & Designers

> **Version** : 1.1  
> **Durée totale** : 30 jours  
> **Niveau d'entrée** : débutant terminal, intermédiaire produit  
> **Langue** : Français

---

## 🗺️ Comment utiliser cette formation

Ce bootcamp est conçu pour quatre profils. Chaque module indique quelles sections sont communes et lesquelles sont spécifiques à votre rôle.

### Choisissez votre rôle

#### 👔 Product Manager

**Mission** : Décider quoi construire et pourquoi — prioriser, rédiger des PRDs, coordonner design et engineering, mesurer l'impact business.

**Vous apprendrez Claude Code comme** : copilote de réflexion, assistant de documentation, orchestrateur de workflows produit.

**Modules prioritaires** : 0 → 1 → 2-PM → 3 (Notion) → 4 → 5  
**Ce que vous pouvez ignorer** : architecture logicielle, qualité de code avancée, frontend

> **Objectif** : *"Comment orchestrer l'IA pour produire plus vite et mieux."*

---

#### 🔨 Product Builder

**Mission** : Construire rapidement des produits avec forte autonomie — indie hacker, fondateur, maker IA, PM technique.

**Vous apprendrez Claude Code comme** : co-développeur, générateur d'applications, agent d'automatisation.

**Modules prioritaires** : 0 → 1 → 2-Builder → 3 (tous) → 4 → 5  
**Ce que vous ne pouvez pas ignorer** : terminal, Git, debugging, déploiement

> **Objectif** : *"Comment shipper des produits avec l'IA."*

---

#### 🎨 Product Designer

**Mission** : Concevoir l'expérience utilisateur — UX, UI, parcours, prototypage, design systems.

**Vous apprendrez Claude Code comme** : extracteur de specs Figma, générateur de documentation UX, accélérateur de handoff.

**Modules prioritaires** : 0 → 1 → 2-Designer → 3 (Figma) → 4  
**Ce que vous pouvez alléger** : subagents complexes, architecture backend

> **Objectif** : *"Comment transformer le design en système exécutable."*

---

#### ⚙️ Design Engineer

**Mission** : Faire le pont entre design et engineering — coder des interfaces, construire des design systems, traduire Figma en composants.

**Vous apprendrez Claude Code comme** : pair-programmer frontend, générateur de composants, assistant design system.

**Modules prioritaires** : 0 → 1 → 2-DesignEng → 3 (Figma + GitHub) → 4 → 5  
**Ce que vous devez maîtriser** : React/frontend, architecture UI, génération de code

> **Objectif** : *"Comment industrialiser l'interface avec l'IA."*

---

## Vue d'ensemble

### Mental Model Global

```
Claude Chat classique    =   consultant externe
                               vous lui posez des questions

Claude Code              =   ingénieur produit dans votre terminal
                               il lit vos fichiers, modifie vos projets,
                               exécute des commandes, automatise des workflows
```

La différence fondamentale : avec Claude Code, vous ne "discutez" plus seulement avec l'IA. Vous lui donnez un **environnement**, des **outils**, des **règles** et des **responsabilités**.

### Roadmap globale

```
TERMINAL + SETUP
      ↓
CLAUDE CODE CORE (CLAUDE.md, slash commands, contexte)
      ↓
WORKFLOWS PAR RÔLE (PRDs / Apps / Design / UI)
      ↓
MCP ECOSYSTEM (Notion, Figma, GitHub)
      ↓
SKILLS & AUTOMATISATIONS
      ↓
SUBAGENTS & ORCHESTRATION
      ↓
FULL AI PRODUCT OS
```

### Planning recommandé — 30 jours

| Semaine | Module | Focus | Livrable |
|---------|--------|-------|----------|
| 1 | 0 + 1 | Terminal, setup, Claude Code core | Workspace opérationnel |
| 2 | 2 | Workflows par rôle | Premier workflow complet |
| 3 | 3 + 4 | MCP + Skills | Intégrations connectées |
| 4 | 5 | Subagents + projet final | AI Product OS personnel |

### Ce qu'un PM doit absolument maîtriser — Priorités ROI

**Niveau 1 — Obligatoire (semaine 1-2)**
- Terminal de base
- CLAUDE.md et gestion du contexte
- Slash commands
- Prompting structuré
- Workflow discovery → PRD
- Organisation workspace

**Niveau 2 — Très utile (semaine 3)**
- MCP Notion
- Skills réutilisables
- Templates standardisés

**Niveau 3 — Puissant mais optionnel (semaine 4)**
- Subagents
- MCP Figma
- Pipelines automatisés

### Erreurs qui font perdre le plus de temps

| Erreur | Impact | Correction |
|--------|--------|-----------|
| Prompt vague | Résultats médiocres | Framework RCOCQ |
| Pas de CLAUDE.md | L'IA "oublie" le contexte projet | Créer et maintenir CLAUDE.md |
| Contexte trop large | Confusion + coût élevé | Segmenter en fichiers |
| Aucun workflow standard | Résultats inconsistants | Templates par tâche |
| Pas de conventions nommage | Chaos dans les fichiers | Convention `type-sujet-v#.md` |
| Mélanger specs/design/research | IA confuse | Structure dossiers rigoureuse |
| Full workspace MCP | Risque sécurité | Workspace dédié IA |

---

## Prérequis & Installation

### Avant de commencer

**Ce dont vous avez besoin :**
- Mac, Windows (avec WSL2), ou Linux
- Connexion internet
- Un compte Anthropic (pour Claude Code)
- 30 minutes pour le setup initial

**Ce dont vous n'avez PAS besoin :**
- Savoir coder
- Expérience du terminal (vous l'apprendrez dans ce module)

---

### Étape 1 — Ouvrir un terminal

#### Mac

Trois façons d'ouvrir le terminal :
1. **Spotlight** : `⌘ + Espace` → tapez "Terminal" → Entrée
2. **Finder** : Applications → Utilitaires → Terminal
3. **Recommandé** : Téléchargez [iTerm2](https://iterm2.com) pour une meilleure expérience

#### Windows

1. Installez **Windows Terminal** depuis le Microsoft Store
2. Installez **WSL2** (Windows Subsystem for Linux) :
   ```powershell
   wsl --install
   ```
3. Redémarrez votre machine
4. Ouvrez "Ubuntu" depuis le menu Démarrer

#### Analogie

> Le terminal = parler directement à votre ordinateur.  
> Au lieu de cliquer sur des icônes, vous donnez des instructions textuelles précises.  
> C'est moins intuitif au début, mais infiniment plus puissant.

---

### Étape 2 — Installer Node.js

Claude Code est distribué via `npm`, le gestionnaire de paquets de Node.js.

#### Mac

```bash
# Installer Homebrew (gestionnaire de paquets Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js
brew install node

# Vérifier
node --version   # Devrait afficher v18.x ou plus
npm --version    # Devrait afficher 9.x ou plus
```

#### Windows (WSL2)

```bash
# Dans votre terminal Ubuntu/WSL2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

---

### Étape 3 — Installer Claude Code

```bash
# Installation globale
npm install -g @anthropic-ai/claude-code

# Vérifier l'installation
claude --version

# Lancer Claude Code pour la première fois
claude
```

Lors du premier lancement, Claude Code vous demandera de vous authentifier avec votre compte Anthropic. Suivez les instructions à l'écran.

#### Variantes de lancement

```bash
# Mode interactif (principal)
claude

# Mode non-interactif (pour scripts)
claude -p "Crée un fichier README.md pour ce projet"

# Lancer sur un fichier spécifique
claude path/to/file.md

# Aide complète
claude --help
```

---

### Étape 4 — Vérifier que tout fonctionne

```bash
# Créer un dossier test
mkdir claude-test && cd claude-test

# Lancer Claude Code
claude

# Dans l'interface Claude Code, tapez :
> Bonjour ! Crée un fichier hello.md avec "Premier test réussi."

# Quitter
> /exit
```

Si vous voyez le fichier `hello.md` créé, votre installation est correcte. ✅

---

## MODULE 0 — Environnement & Terminal

**Durée estimée** : 2-3 jours | **Difficulté** : ⭐☆☆☆☆ | **Pour tous les rôles**

### Objectifs

- ✅ Naviguer dans le terminal sans stress
- ✅ Comprendre la structure de fichiers
- ✅ Créer votre workspace selon votre rôle
- ✅ Maîtriser les commandes essentielles

---

### 0.1 — Commandes de base

#### Navigation et exploration

| Commande | Signification | Exemple |
|----------|---------------|---------|
| `pwd` | Print Working Directory — où suis-je ? | `pwd` → `/Users/alice/projects` |
| `ls` | List — voir les fichiers | `ls -la` (avec détails) |
| `cd` | Change Directory — changer de dossier | `cd Documents` |
| `cd ..` | Remonter d'un niveau | `cd ../..` (deux niveaux) |
| `cd ~` | Aller au dossier home | `cd ~` |

#### Création et manipulation

| Commande | Fonction | Exemple |
|----------|----------|---------|
| `mkdir` | Créer un dossier | `mkdir mon-projet` |
| `mkdir -p` | Créer un dossier et ses parents | `mkdir -p a/b/c` |
| `touch` | Créer un fichier vide | `touch README.md` |
| `cp` | Copier | `cp source.md cible.md` |
| `mv` | Déplacer ou renommer | `mv old.md new.md` |
| `rm` | Supprimer un fichier | `rm fichier.md` |
| `rm -rf` | Supprimer un dossier (**attention** : irréversible) | `rm -rf dossier/` |

#### Lire et écrire

| Commande | Fonction |
|----------|----------|
| `cat fichier` | Afficher le contenu |
| `less fichier` | Afficher page par page (q pour quitter) |
| `echo "texte" > fichier` | Écrire dans un fichier |
| `echo "texte" >> fichier` | Ajouter à un fichier existant |

---

### 0.2 — Exercices guidés

#### Exercice 1 : Navigation

```bash
# Où suis-je ?
pwd

# Voir les fichiers
ls

# Aller dans Documents
cd ~/Documents

# Créer un dossier de travail
mkdir ai-workspace
cd ai-workspace
pwd
```

**Vérification** : `pwd` doit afficher un chemin se terminant par `ai-workspace`.

#### Exercice 2 : Créer votre workspace

Choisissez la structure selon votre rôle :

**👔 PM — Product Manager**
```bash
mkdir -p ai-product-lab/{discovery,prds,specs,research,competitors,figma-notes,prompts,workflows,templates,memory}
touch ai-product-lab/CLAUDE.md
touch ai-product-lab/README.md
```

**🔨 Product Builder**
```bash
mkdir -p ai-builder-lab/{apps,scripts,automations,prompts,workflows,templates,research,memory}
touch ai-builder-lab/CLAUDE.md
touch ai-builder-lab/README.md
```

**🎨 Product Designer**
```bash
mkdir -p ai-design-lab/{figma-exports,specs,design-systems,ux-research,handoff,prompts,templates,memory}
touch ai-design-lab/CLAUDE.md
touch ai-design-lab/README.md
```

**⚙️ Design Engineer**
```bash
mkdir -p ai-design-eng-lab/{components,design-tokens,storybook,figma-sync,code-gen,templates,memory}
touch ai-design-eng-lab/CLAUDE.md
touch ai-design-eng-lab/README.md
```

---

### 0.3 — Checklist Module 0

- [ ] Je sais ouvrir un terminal
- [ ] Je comprends `pwd`, `ls`, `cd`
- [ ] J'ai créé mon workspace
- [ ] Je sais créer des fichiers et dossiers
- [ ] Je sais lire un fichier avec `cat`

---

## MODULE 1 — Claude Code Core

**Durée estimée** : 5-7 jours | **Difficulté** : ⭐⭐☆☆☆ | **Pour tous les rôles**

### Objectifs

- ✅ Comprendre comment Claude Code fonctionne
- ✅ Maîtriser CLAUDE.md — le fichier de mémoire projet
- ✅ Utiliser les slash commands courants
- ✅ Gérer le contexte efficacement
- ✅ Écrire des prompts structurés
- ✅ Comprendre les permissions

---

### 1.1 — Comment Claude Code fonctionne

#### Ce que Claude Code peut faire

Claude Code est connecté à votre système de fichiers et à votre terminal. Il peut :

- **Lire** n'importe quel fichier de votre projet
- **Créer et modifier** des fichiers
- **Exécuter** des commandes terminal
- **Chercher** dans vos fichiers
- **Se connecter** à des outils externes via MCP
- **Orchestrer** des agents spécialisés

#### Ce que Claude Code ne fait PAS par défaut

- Il ne modifie pas de fichiers sans vous demander la permission
- Il ne pousse pas de code sur GitHub sans votre accord
- Il ne se connecte pas à internet sans outils MCP configurés
- Il ne garde PAS de mémoire entre les sessions (c'est le rôle de CLAUDE.md)

#### Cycle de base

```
Vous donnez un contexte (CLAUDE.md + fichiers)
         ↓
Vous faites une demande
         ↓
Claude Code lit les fichiers nécessaires
         ↓
Claude Code propose ou exécute des actions
         ↓
Vous validez ou ajustez
         ↓
Résultat dans vos fichiers
```

---

### 1.2 — CLAUDE.md — Le fichier de mémoire projet ⭐ (concept clé)

> C'est probablement le concept le plus important de toute cette formation. **Ne le sautez pas.**

#### Qu'est-ce que CLAUDE.md ?

`CLAUDE.md` est un fichier markdown placé à la racine de votre projet. Claude Code le **charge automatiquement** à chaque session. C'est votre mémoire persistante entre les conversations.

Sans CLAUDE.md, vous devez ré-expliquer le contexte à chaque session.  
Avec CLAUDE.md, Claude Code "connaît" votre projet dès le démarrage.

#### CLAUDE.md global vs projet

```bash
# CLAUDE.md global (chargé dans TOUS vos projets)
~/.claude/CLAUDE.md

# CLAUDE.md de projet (chargé uniquement dans ce projet)
votre-projet/CLAUDE.md
```

#### Structure recommandée de CLAUDE.md

```markdown
# [Nom du projet]

## Contexte
[Description du projet en 2-3 phrases]

## Rôle de l'IA
Tu agis comme [RÔLE]. Tu dois [OBJECTIF PRINCIPAL].

## Conventions
- Langue : Français
- Format des fichiers : [convention de nommage]
- Structure du projet : [description]

## Ce que tu ne dois PAS faire
- [Limite 1]
- [Limite 2]

## Ressources clés
- [Fichier important 1] : [à quoi il sert]
- [Fichier important 2] : [à quoi il sert]

## Contexte métier
[Informations sur le produit, les utilisateurs, les contraintes]
```

#### Exemple concret — CLAUDE.md pour un PM

```markdown
# Workspace Produit — Application Analytics B2B

## Contexte
Nous construisons une application d'analytics pour des équipes produit B2B SaaS.
Cible : Product Managers de startups Series A-C.
Problème principal : trop de données, pas assez d'insights actionnables.

## Rôle de l'IA
Tu agis comme un Senior Product Manager expérimenté en B2B SaaS.
Tu parles toujours en français, sauf pour le code et les termes techniques standards.
Tu es concis, orienté execution, sans bullshit.

## Structure du workspace
- discovery/ : notes d'interviews utilisateurs
- prds/ : Product Requirements Documents
- research/ : analyses concurrentielles
- specs/ : spécifications techniques pour l'engineering
- templates/ : modèles réutilisables

## Conventions de nommage
- PRDs : prd-[feature]-v[numero].md
- Research : research-[sujet]-[date].md
- Specs : spec-[feature]-[composant].md

## Contexte produit important
- Stack technique : React frontend, Node.js backend, PostgreSQL
- Cycle de sprint : 2 semaines
- Équipe : 3 devs, 1 designer, 1 PM (moi)
- KPIs produit : activation rate, weekly active users, NPS

## Ne pas faire
- Ne pas inventer des fonctionnalités non mentionnées
- Ne pas écrire de code fonctionnel (j'en ai pas besoin)
- Ne pas utiliser de jargon non expliqué
```

#### Exercice : créer votre CLAUDE.md

1. Ouvrez votre workspace créé en Module 0
2. Créez `CLAUDE.md` à la racine
3. Remplissez au minimum : contexte, rôle de l'IA, conventions
4. Lancez Claude Code et vérifiez qu'il connaît votre contexte :
   ```
   > Décris-moi ce projet en une phrase
   ```

---

### 1.3 — Slash commands — L'interface de contrôle

Les slash commands sont des commandes rapides que vous tapez directement dans l'interface Claude Code.

#### Commands essentielles

| Commande | Fonction |
|----------|----------|
| `/help` | Afficher toutes les commandes disponibles |
| `/clear` | Effacer la conversation et réinitialiser le contexte |
| `/compact` | Compresser la conversation pour libérer de l'espace de contexte |
| `/model` | Changer de modèle IA |
| `/config` | Voir et modifier la configuration |
| `/exit` | Quitter Claude Code |

#### Commandes de session

| Commande | Fonction |
|----------|----------|
| `/reset` | Réinitialiser complètement la session |
| `/undo` | Annuler la dernière action |
| `/diff` | Voir les changements effectués |

#### Quand utiliser `/compact`

La **context window** (mémoire active de l'IA) a une limite. Quand une session devient longue, Claude Code peut "oublier" les premières parties. Utilisez `/compact` pour que Claude Code résume et compresse l'historique tout en gardant l'essentiel.

```
Règle pratique :
→ Session courte (< 30 min) : pas besoin
→ Session longue ou nombreux fichiers : /compact toutes les 30-45 min
→ Nouveau sujet dans la même session : /clear pour repartir proprement
```

#### Custom slash commands (avancé)

Vous pouvez créer vos propres commandes dans `.claude/commands/` :

```bash
# Créer le dossier des commandes
mkdir -p .claude/commands

# Créer une commande /prd-review
cat > .claude/commands/prd-review.md << 'EOF'
Fais une revue critique de ce PRD.

Évalue :
1. Clarté du problème
2. Définition des utilisateurs
3. Métriques de succès
4. Couverture des edge cases
5. Risques identifiés

Format de sortie : tableau avec colonne Aspect / Note /10 / Commentaire
EOF
```

Utilisation : `/prd-review` dans Claude Code appliquera automatiquement ce prompt.

---

### 1.4 — Gestion du contexte

#### Le problème du contexte

L'IA a une "mémoire de travail" limitée (la context window). Si vous lui donnez trop d'informations d'un coup, elle devient confuse ou ignore des parties.

**Mauvaise approche :**
```
> Voici 10 fichiers de research, 3 PRDs existants, nos analytics, les retours clients,
  les specs techniques et les contraintes légales. Génère-moi un nouveau PRD.
```

**Bonne approche :**
```
> Étape 1 : Lis d'abord le dossier research/ et résume les 3 insights principaux.
> Étape 2 : Sur la base de ces insights, crée le draft du PRD.
> Étape 3 : Intègre les contraintes techniques du fichier specs/constraints.md.
```

#### Stratégies de gestion du contexte

**1. Segmentation par dossier**
```
research/    → informations de recherche
constraints/ → contraintes produit et techniques
personas/    → profils utilisateurs
decisions/   → décisions passées et leurs raisons
```

**2. Fichiers de résumé**
```bash
# Créer un fichier de synthèse pour chaque domaine
touch research/SUMMARY.md
touch constraints/SUMMARY.md
```

**3. Référencer explicitement les fichiers**
```
> Utilise uniquement les fichiers du dossier research/interviews/ pour cette analyse.
```

**4. Sessions dédiées**
```
Session 1 : analyse et synthèse de la research
Session 2 : rédaction du PRD (on passe le SUMMARY)
Session 3 : revue et itération
```

#### La règle des 3 fichiers

> Pour chaque session, essayez de ne référencer que 3 fichiers maximum comme contexte principal. Au-delà, la qualité baisse.

---

### 1.5 — Prompting structuré

#### Le framework RCOCQ

```
R — Rôle      : qui est l'IA dans ce contexte ?
C — Contexte  : quelle est la situation ?
O — Objectif  : qu'est-ce qu'on veut produire ?
C — Contraintes : ce qu'on ne veut PAS
Q — Qualité   : comment on sait que c'est bon ?
```

**Mauvais prompt :**
```
Fais un PRD.
```

**Bon prompt (RCOCQ) :**
```
R — Tu es Senior PM chez Linear, expert en outils B2B.
C — Notre analytics dashboard a un taux d'activation de 23% seulement.
    Les interviews révèlent que les users sont perdus dans le setup initial.
O — Crée un PRD pour une feature "Guided Onboarding" qui vise 60% d'activation.
C — Pas de solutions "gamification" (validé en user research). Budget engineering : 3 sprints.
Q — Le PRD doit passer la revue d'un Engineering Lead sans questions manquantes.
```

#### Template universel

```markdown
Tu es [RÔLE].

Contexte :
[CONTEXTE — 3-5 phrases max]

Objectif :
[CE QU'ON VEUT PRODUIRE — précis]

Contraintes :
- [CE QU'ON NE VEUT PAS 1]
- [CE QU'ON NE VEUT PAS 2]

Format attendu :
[STRUCTURE DE L'OUTPUT]

Critères de qualité :
[COMMENT SAVOIR QUE C'EST RÉUSSI]
```

#### Anti-patterns de prompting

| Anti-pattern | Problème | Solution |
|-------------|----------|---------|
| "Fais quelque chose de bien" | Subjectif, non mesurable | Définir des critères |
| Prompt de 2000 mots | L'IA se perd | Segmenter en étapes |
| Pas de format | Output imprévisible | Toujours définir la structure |
| Contexte dans le prompt | Pas réutilisable | Mettre dans CLAUDE.md |
| Un seul prompt pour tout | Qualité médiocre | Décomposer en étapes |

---

### 1.6 — Permissions et sécurité

#### Comment Claude Code demande les permissions

Par défaut, Claude Code vous demande confirmation avant :
- Créer ou modifier des fichiers
- Exécuter des commandes terminal
- Se connecter à des services externes

**Approbation dans la session** : vous pouvez dire "oui" à une action ponctuelle.  
**Approbation permanente** : configurez dans `settings.json` pour des actions récurrentes.

#### Settings.json — configuration des permissions

```bash
# Voir la configuration actuelle
cat .claude/settings.json

# Ou la configuration globale
cat ~/.claude/settings.json
```

Structure de base :
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Bash(git status)",
      "Bash(git diff)"
    ]
  }
}
```

#### Règles de sécurité fondamentales

```
✅ Toujours  : limiter les permissions MCP au strict nécessaire
✅ Toujours  : créer un workspace dédié (pas votre Notion principal)
✅ Toujours  : relire les commandes bash avant de les approuver
✅ Toujours  : sauvegarder avant d'automatiser des modifications massives
❌ Jamais    : donner accès "full workspace" à un MCP
❌ Jamais    : approuver en masse sans lire
❌ Jamais    : stocker des tokens API dans des fichiers trackés par Git
```

---

### 1.7 — Mini Projet Module 1 : Workspace opérationnel

**Objectif** : Votre workspace est configuré et Claude Code "connaît" votre contexte.

**Livrables :**
1. Structure dossiers créée (de votre rôle)
2. `CLAUDE.md` rempli et testé
3. Au moins une custom slash command créée
4. Premier prompt RCOCQ rédigé et testé

**Test de validation :**
```
> Sans que je te donne d'autres informations, dis-moi :
  1. Quel est ce projet ?
  2. Quel est ton rôle ?
  3. Quelles sont les conventions de ce workspace ?
```

Claude Code doit pouvoir répondre correctement en lisant uniquement CLAUDE.md. ✅

---

### 1.8 — Checklist Module 1

- [ ] J'ai installé Claude Code correctement
- [ ] J'ai créé et testé mon CLAUDE.md
- [ ] Je sais utiliser `/clear`, `/compact`, `/help`
- [ ] J'ai créé au moins une custom slash command
- [ ] Je structure mes sessions avec le framework RCOCQ
- [ ] Je comprends le concept de context window
- [ ] Je sais configurer les permissions basiques

---

### Quiz Module 1

**Q1.** Quel fichier est automatiquement chargé par Claude Code à chaque session ?  
A) `settings.json`  B) `CLAUDE.md`  C) `README.md`  
→ **B** — `CLAUDE.md` est la mémoire persistante du projet.

**Q2.** Quelle commande utilisez-vous quand la conversation est devenue très longue ?  
A) `/clear`  B) `/exit`  C) `/compact`  
→ **C** — `/compact` compresse l'historique sans le perdre. `/clear` repart de zéro.

**Q3.** Dans le framework RCOCQ, que signifie le premier C ?  
A) Code  B) Contexte  C) Contraintes  
→ **B** — Rôle, **Contexte**, Objectif, Contraintes, Qualité.

**Q4.** Où configurez-vous les permissions de Claude Code pour un projet spécifique ?  
A) `~/.claude/settings.json`  B) `.claude/settings.json`  C) `CLAUDE.md`  
→ **B** — Le `.claude/settings.json` à la racine du projet. Le `~/.claude/settings.json` est global.

---

## MODULE 2 — Workflows par Rôle

**Durée estimée** : 7-8 jours | **Difficulté** : ⭐⭐⭐☆☆

Ce module se divise en quatre parcours. Suivez le vôtre, consultez les autres pour comprendre vos collaborateurs.

---

### 👔 Parcours PM — Product Manager

#### Objectifs

- ✅ Générer des PRDs solides et itératifs
- ✅ Construire un workflow discovery → specs
- ✅ Organiser la mémoire produit
- ✅ Structurer la collaboration design/engineering

#### 2-PM.1 — IA-native Product Management

**Le changement de paradigme :**

```
Ancien paradigme         Nouveau paradigme
─────────────────        ─────────────────
Le PM écrit tout    →   Le PM orchestre l'intelligence
Documente           →   Structure le contexte
Synthétise seul     →   Pilote l'IA
Coordonne           →   Automatise
```

**Workflow PM augmenté :**

```
Discovery (interviews, data)
   ↓
Research IA (synthèse, insights)
   ↓
PRD draft (avec Claude Code)
   ↓
Review (engineering, design)
   ↓
Specs techniques
   ↓
Delivery tracking
```

#### 2-PM.2 — Template PRD Premium

```markdown
# PRD — [Nom de la feature]

**Statut** : Draft | Review | Approved  
**Date** : [YYYY-MM-DD]  
**Auteur** : [Nom]  
**Sprint cible** : [S##]

---

## 🎯 Problem Statement

### Problème utilisateur
[Description du problème concret, en langage utilisateur]

### Pourquoi maintenant
[Contexte marché, données, événement déclencheur]

### Impact business attendu
[Métriques et objectifs chiffrés]

---

## 👥 Utilisateurs

### Persona principale
[Nom, rôle, contexte]

### Jobs-to-be-done
1. [JTBD 1]
2. [JTBD 2]

### Pain points actuels
- [Pain 1] → fréquence : [haute/moyenne/faible]
- [Pain 2] → fréquence : [haute/moyenne/faible]

---

## ✅ Success Metrics

| Métrique | Baseline | Objectif | Délai |
|----------|----------|----------|-------|
| [KPI 1] | [valeur] | [cible] | [X mois] |
| [KPI 2] | [valeur] | [cible] | [X mois] |

---

## 📐 Scope

### In scope
- [Feature 1]
- [Feature 2]

### Out of scope (et pourquoi)
- [Feature hors scope 1] — raison
- [Feature hors scope 2] — raison

---

## 📖 User Stories

### Epic : [Nom Epic]

**US-001** : En tant que [persona], je veux [action] afin de [bénéfice].  
Critères d'acceptance :
- [ ] [Critère 1]
- [ ] [Critère 2]

---

## 🎨 UX Considerations
[Notes UX, flows principaux, edge cases]

## ⚙️ Technical Considerations
[Contraintes techniques, dépendances, risques d'implémentation]

## 🚀 Rollout Plan
[Plan de déploiement, feature flags, phases]

## ⚠️ Risks
| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|

## ❓ Open Questions
- [ ] [Question 1] — Owner : [nom] — Date : [deadline]
```

#### Prompt PRD avancé

```
Tu es Senior PM chez [entreprise similaire à la nôtre].

Contexte produit (lis le fichier CLAUDE.md pour les détails).

Research disponible : [lister les fichiers du dossier research/]

Mission :
Crée un PRD complet pour la feature "[nom]".

Style :
- Concis et orienté exécution (pas de bullshit)
- Chaque section doit pouvoir répondre aux questions d'un Engineering Lead
- Sois particulièrement rigoureux sur les success metrics et les edge cases

Sections obligatoires : Problem Statement, Users, Success Metrics, Scope, User Stories, Risks, Open Questions.

Format : utilise le template prds/template-prd.md comme base.
```

#### 2-PM.3 — Système de mémoire produit

```
memory/
├── product-principles.md    # Principes produit de l'équipe
├── target-users.md          # Personas détaillées
├── roadmap.md               # Roadmap actuelle
├── tech-context.md          # Contraintes et stack technique
├── decisions.md             # Log des décisions et leur justification
├── competitors.md           # Résumé concurrentiel
└── glossary.md              # Termes métier spécifiques
```

**Règle d'or** : Toute décision prise avec l'IA doit être loggée dans `decisions.md` avec la date et la raison.

#### 2-PM.4 — Collaboration engineering

**Workflow recommandé pour le handoff :**

```
1. PM draft PRD (avec Claude Code)
   ↓
2. Claude Code génère les questions d'un Engineering Lead fictif
   ↓
3. PM répond ou ajuste le PRD
   ↓
4. Claude Code génère un premier découpage en stories
   ↓
5. Engineering review des estimations
   ↓
6. Spec finale
```

**Prompt pour simuler une engineering review :**
```
Tu es un Engineering Lead senior avec 10 ans d'expérience en B2B SaaS.

Lis ce PRD et identifie :
1. Les ambiguïtés qui vont bloquer l'implémentation
2. Les edge cases non couverts
3. Les dépendances techniques non mentionnées
4. Les user stories mal découpées
5. Les métriques non mesurables techniquement

Sois direct et exigeant. Un bon PRD ne doit pas nécessiter d'aller voir le PM.
```

#### Mini Projet PM

**Sujet** : Feature "Onboarding guidé" pour un SaaS analytics

**Livrables :**
1. `discovery/interview-synthesis.md` (résumé de 5 interviews fictives)
2. `research/competitor-onboarding.md` (analyse de 3 concurrents)
3. `prds/prd-guided-onboarding-v1.md` (PRD complet)
4. `specs/stories-guided-onboarding.md` (découpage en user stories)

**Validation :** Demandez à Claude Code de jouer le rôle d'un Engineering Lead et de noter votre PRD sur 10.

---

### 🔨 Parcours Product Builder

#### Objectifs

- ✅ Générer des applications complètes avec Claude Code
- ✅ Debugger efficacement avec l'IA
- ✅ Créer des automations fonctionnelles
- ✅ Déployer des projets simples

#### 2-Builder.1 — Claude Code comme co-développeur

**Workflow de génération d'app :**

```
1. Définir l'app (CLAUDE.md avec les specs)
   ↓
2. Générer la structure de projet
   ↓
3. Implémenter feature par feature
   ↓
4. Debugger avec Claude Code
   ↓
5. Tester
   ↓
6. Déployer
```

**CLAUDE.md pour un projet builder :**

```markdown
# [Nom de l'app]

## Concept
[Description en 2 phrases]

## Stack technique
- Frontend : [ex: React + Vite + Tailwind]
- Backend : [ex: Node.js + Express]
- Base de données : [ex: PostgreSQL + Prisma]
- Déploiement : [ex: Vercel + Railway]

## Architecture
[Description de l'architecture]

## Conventions de code
- Langue des commentaires : Français
- Nommage : camelCase pour JS, kebab-case pour les fichiers
- Pas de `any` en TypeScript

## Commandes de développement
- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm test` : tests

## Règles importantes
- Toujours créer des tests pour les fonctions critiques
- Toujours gérer les erreurs explicitement
- Ne jamais stocker de secrets dans le code
```

#### 2-Builder.2 — Génération structurée d'app

**Prompt de génération de structure :**

```
Tu es un senior developer avec une expertise en [stack].

Contexte : je construis [description de l'app].

Mission - étape 1 :
Génère la structure de dossiers complète du projet, avec :
- Tous les fichiers de configuration
- Un README.md
- Un .gitignore adapté
- La structure des dossiers src/

Ne génère pas encore de code fonctionnel. Juste la structure.
```

**Prompt de développement feature :**

```
Stack : [stack]

Feature à implémenter : [description précise]

Contraintes :
- Compatibilité avec les fichiers existants (lis src/ en premier)
- Pas de dépendances supplémentaires sauf si justifié
- Gérer les cas d'erreur

Workflow :
1. Lis d'abord les fichiers concernés
2. Explique ton approche avant de coder
3. Implémente
4. Ajoute les tests unitaires
```

#### 2-Builder.3 — Debugging efficace

```
Tu es un expert debugger.

Le problème : [description du bug]

Comportement attendu : [ce qui devrait se passer]
Comportement actuel : [ce qui se passe vraiment]

Fichiers concernés :
- [fichier 1]
- [fichier 2]

Erreur complète :
[coller l'erreur ici]

Analyse le problème, identifie la cause racine, propose une correction.
Ne suggère pas de "quick fixes" — je veux comprendre pourquoi.
```

#### 2-Builder.4 — Git et versioning

```bash
# Dans votre CLAUDE.md, ajoutez une section Git
```

```markdown
## Git workflow
- Commits : `type(scope): description` (ex: `feat(auth): add login form`)
- Une feature = une branche
- Toujours commiter avant une modification massive par l'IA
```

Commandes utiles à autoriser dans `settings.json` :
```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git add .)",
      "Bash(git commit *)",
      "Bash(npm run *)"
    ]
  }
}
```

#### Mini Projet Builder

**Sujet** : Construire un "PRD Generator" — une petite app web qui génère des PRDs à partir d'un formulaire

**Livrables :**
1. App fonctionnelle (React + Express ou Next.js)
2. Formulaire de saisie (nom feature, problème, users, KPIs)
3. Génération de PRD en markdown via Claude API
4. Export en téléchargement

---

### 🎨 Parcours Product Designer

#### Objectifs

- ✅ Extraire des specs depuis Figma via MCP
- ✅ Générer de la documentation UX systématique
- ✅ Créer des workflows design → handoff
- ✅ Standardiser le design system

#### 2-Designer.1 — Claude Code pour le design

**Cas d'usage principaux :**

```
Figma → Specs techniques    (extraction automatique)
Figma → Documentation UX    (analyse des flows)
Figma → Stories engineering (handoff structuré)
Research → Insights UX      (synthèse d'études)
Design System → Documentation (génération automatique)
```

#### 2-Designer.2 — CLAUDE.md pour un designer

```markdown
# Workspace Design — [Produit]

## Rôle
Tu es un product designer senior et expert en documentation UX.
Tu parles le langage des PMs ET des engineers.

## Contexte produit
[Description de l'app, des utilisateurs, des objectifs UX]

## Design System
- Figma link : [URL]
- Tokens : [système de couleurs, typographie, espacement]
- Composants clés : [liste]

## Conventions de documentation
- Format specs : [template]
- Nommage des composants : PascalCase
- Statuts : Draft / Review / Approved / Shipped

## Fichiers importants
- design-system/tokens.md : tous les design tokens
- specs/ : specs par feature
- ux-research/ : synthèses research
```

#### 2-Designer.3 — Analyse UX et documentation

**Prompt d'analyse UX :**

```
Tu es un expert UX researcher et product designer.

Analyze ce flow utilisateur et identifie :

1. Points de friction potentiels
2. Cas non couverts (edge cases UX)
3. Cohérence avec les heuristiques de Nielsen
4. Accessibilité (WCAG 2.1 AA)
5. Questions à valider en test utilisateur

Format de sortie : rapport structuré avec priorité (P1/P2/P3) pour chaque finding.
```

**Prompt de génération de specs :**

```
Tu es un product designer qui rédige des specs pour des engineers.

Feature : [nom]

Sur la base des notes Figma [coller le contenu extrait], génère :

1. Description du composant
2. États (default, hover, focus, disabled, loading, error, empty)
3. Comportement sur mobile vs desktop
4. Interactions et transitions
5. Tokens de design utilisés
6. Données dynamiques et leurs contraintes
7. Accessibilité : rôle ARIA, navigation clavier
8. Questions ouvertes pour l'engineering

Format : markdown structuré, prêt pour Notion.
```

#### 2-Designer.4 — Workflow design-engineering

```
Discovery & Concepts
   ↓
Design Figma
   ↓
Extraction MCP (Module 3)
   ↓
Analyse IA des flows
   ↓
Génération des specs
   ↓
Review PM + Engineering
   ↓
Handoff documenté
   ↓
QA post-implémentation
```

#### Mini Projet Designer

**Sujet** : Documentation complète d'un composant "Onboarding Stepper"

**Livrables :**
1. `specs/component-onboarding-stepper.md` (specs complètes)
2. `ux-research/usability-findings.md` (5 findings priorisés)
3. `handoff/engineering-qa-checklist.md` (checklist de vérification)

---

### ⚙️ Parcours Design Engineer

#### Objectifs

- ✅ Générer des composants UI de qualité
- ✅ Automatiser la translation Figma → code
- ✅ Maintenir un design system cohérent
- ✅ Optimiser la qualité du code généré

#### 2-DesignEng.1 — Claude Code pour le frontend

**Cas d'usage principaux :**

```
Figma → Composant React    (génération directe)
Tokens → CSS Variables     (synchronisation design system)
Storybook → Documentation  (génération auto)
PR Review → Feedback UI    (revue de code orientée UX)
```

#### 2-DesignEng.2 — CLAUDE.md pour un design engineer

```markdown
# Design System — [Produit]

## Stack
- Framework : React 18 + TypeScript
- Styling : Tailwind CSS + CSS Modules
- Storybook : v7
- Tests : Vitest + Testing Library

## Architecture des composants
- Atomic design : atoms / molecules / organisms / templates
- Un composant = un dossier (component, stories, tests, types)
- Props : toujours typées avec TypeScript strict
- Accessibilité : WCAG 2.1 AA obligatoire

## Design tokens
- Couleurs : [system]
- Typographie : [system]
- Espacement : [system]
- Fichier source : src/tokens/tokens.ts

## Conventions
- Nommage composants : PascalCase
- Nommage props : camelCase
- Events : préfixe `on` (onClick, onChange)
- Composants purs quand possible

## Interdictions
- Pas de couleurs hardcodées (toujours des tokens)
- Pas de `px` pour l'espacement (système en rem)
- Pas de `!important`
```

#### 2-DesignEng.3 — Génération de composants

**Prompt de génération composant :**

```
Tu es un design engineer expert React + TypeScript + Tailwind.

Composant à créer : [Nom]

Specs (extraites de Figma) :
[coller les specs]

Requirements :
- TypeScript strict (pas de any)
- Tailwind pour le styling (tokens du CLAUDE.md)
- Accessible : ARIA roles, navigation clavier, focus visible
- États à couvrir : default, hover, focus, disabled, loading
- Props document avec JSDoc
- Storybook story couvrant tous les états

Structure du fichier :
- [Composant].tsx
- [Composant].stories.tsx
- [Composant].test.tsx
- types.ts (si nécessaire)

Génère les 4 fichiers.
```

#### 2-DesignEng.4 — Revue de code IA

```
Tu es un senior design engineer spécialisé en qualité UI.

Revue ce composant React en vérifiant :

1. Accessibilité : rôles ARIA corrects, gestion focus, contraste
2. Performance : renders inutiles, useMemo pertinent
3. Cohérence design system : tokens respectés, pas de couleurs hardcodées
4. TypeScript : types stricts, props documentées
5. Tests : couverture des états et interactions
6. Storybook : toutes les variations documentées

Format : liste par catégorie, chaque finding avec niveau (critique/important/mineur) et suggestion de correction.
```

#### Mini Projet Design Engineer

**Sujet** : Composant "DataTable" avec tri, filtrage et pagination

**Livrables :**
1. `src/components/DataTable/DataTable.tsx`
2. `src/components/DataTable/DataTable.stories.tsx`
3. `src/components/DataTable/DataTable.test.tsx`
4. `src/components/DataTable/types.ts`

---

## MODULE 3 — MCP Servers

**Durée estimée** : 6-8 jours | **Difficulté** : ⭐⭐⭐⭐☆

### Objectifs communs

- ✅ Comprendre MCP et son architecture
- ✅ Configurer un serveur MCP correctement
- ✅ Connecter Notion (👔 PM, 🔨 Builder)
- ✅ Connecter Figma (🎨 Designer, ⚙️ Design Engineer)
- ✅ Créer des workflows cross-tools

---

### 3.1 — Qu'est-ce que MCP ?

**MCP = Model Context Protocol**

C'est le standard ouvert (créé par Anthropic) qui permet à Claude Code de se connecter à des outils externes de façon sécurisée et standardisée.

**Analogie :** MCP est l'USB-C des agents IA. Un câble standard qui connecte l'IA à n'importe quel outil.

**Architecture :**

```
Claude Code (client MCP)
       ↓
  MCP Server
  (pont entre l'IA et l'outil)
       ↓
  API de l'outil
  (Notion, Figma, GitHub, etc.)
       ↓
  Vos données
```

**Avant MCP :**
```
Copier/coller entre les outils → chronophage, erreurs
```

**Après MCP :**
```
Claude Code lit et écrit directement dans vos outils
```

---

### 3.2 — Configuration MCP — Le fichier settings.json

La configuration MCP se fait dans le fichier `settings.json`. Deux niveaux :

```bash
# Configuration globale (tous vos projets)
~/.claude/settings.json

# Configuration de projet (uniquement ce projet)
.claude/settings.json      # À la racine de votre projet
```

**Structure du settings.json avec MCP :**

```json
{
  "mcpServers": {
    "nom-du-serveur": {
      "command": "npx",
      "args": ["@package/mcp-server"],
      "env": {
        "API_KEY": "votre-clé-api"
      }
    }
  }
}
```

> ⚠️ **Sécurité** : Ne committez JAMAIS votre settings.json avec des vraies API keys dans Git. Utilisez des variables d'environnement ou ajoutez `settings.json` à votre `.gitignore`.

---

### 3.3 — MCP Notion

**Cas d'usage par rôle :**

| Rôle | Cas d'usage |
|------|-------------|
| 👔 PM | Générer PRDs, mettre à jour la roadmap, centraliser research |
| 🔨 Builder | Créer des docs techniques, tracker les tâches |
| 🎨 Designer | Archiver les specs, partager les handoffs |
| ⚙️ Design Eng | Documenter le design system |

#### Installation étape par étape

**Étape 1 : Créer une intégration Notion**

1. Allez sur [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Cliquez "New integration"
3. Donnez un nom : "Claude Code PM Workspace"
4. Choisissez le workspace cible
5. Permissions minimales recommandées :
   - Read content ✅
   - Update content ✅
   - Insert content ✅
   - **NE PAS activer** : Read user information, Read comments

**Étape 2 : Récupérer le token**

Copiez le "Internal Integration Token" (commence par `secret_...`).

**Étape 3 : Connecter vos pages**

Pour chaque page/database Notion que vous voulez rendre accessible :
1. Ouvrez la page
2. Cliquez ⋯ → "Add connections"
3. Sélectionnez votre intégration

**Étape 4 : Configurer settings.json**

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_VOTRE_TOKEN_ICI"
      }
    }
  }
}
```

**Étape 5 : Vérifier la connexion**

```bash
# Redémarrez Claude Code
claude

# Testez
> Liste les databases Notion auxquelles tu as accès
```

#### Bonnes pratiques Notion MCP

```
✅ Créer un workspace Notion dédié "IA Workspace"
✅ Limiter l'accès aux pages strictement nécessaires
✅ Nommer les databases de façon descriptive
✅ Vérifier ce que Claude Code a créé avant de le publier

❌ Donner accès à tout votre Notion principal
❌ Laisser Claude Code modifier des documents en production sans review
```

#### Workflow Notion PM

```
Research dans des fichiers locaux
   ↓
Synthèse avec Claude Code
   ↓
Export vers Notion (via MCP)
   ↓
Enrichissement humain dans Notion
   ↓
Retour vers Claude Code si besoin
```

**Prompt export Notion :**

```
Sur la base du fichier research/synthesis.md,
crée une page Notion dans la database "Recherche Produit" avec :
- Titre : "Synthèse Research — [Feature] — [Date]"
- Propriété "Statut" : "Draft"
- Propriété "Feature" : "[nom]"
- Corps : le contenu de la synthèse formaté pour Notion

Avant de créer, montre-moi ce que tu vas créer pour validation.
```

---

### 3.4 — MCP Figma

**Cas d'usage par rôle :**

| Rôle | Cas d'usage |
|------|-------------|
| 🎨 Designer | Extraire les specs, analyser les flows, documenter |
| ⚙️ Design Eng | Extraire les tokens, générer des composants |
| 👔 PM | Comprendre le design, valider la cohérence UX |
| 🔨 Builder | Implémenter fidèlement des maquettes |

> ⚠️ **Note de maturité** : Le MCP Figma officiel est moins mature que le MCP Notion. Les fonctionnalités et la stabilité varient. Vérifiez la documentation officielle pour la version actuelle.

#### Options disponibles

**Option 1 : MCP officiel Figma**
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "votre-token"
      }
    }
  }
}
```

**Option 2 : Figma REST API directement** (via un serveur MCP custom)

#### Obtenir un token Figma

1. [figma.com/settings](https://www.figma.com/settings) → "Access tokens"
2. "Generate new token"
3. Nom : "Claude Code — Design Workspace"
4. Scope : Read only

#### Prompt d'extraction Figma

```
Accède au fichier Figma [URL ou ID du fichier].

Pour le composant "[nom du composant]", extrais :
1. Toutes les variantes et leurs propriétés
2. Les couleurs utilisées (avec leurs noms de tokens si disponibles)
3. La typographie (font, size, weight, line-height)
4. Les espacements (padding, margin, gap)
5. Les états définis (default, hover, active, disabled)
6. Les interactions documentées

Formate en markdown structuré pour les engineers.
```

#### Workflow Figma → Specs → Code

```
Figma (design source)
   ↓  extraction MCP
Données brutes structurées
   ↓  analyse IA
Specs techniques (markdown)
   ↓  review designer
Specs validées
   ↓  génération de code
Composant React
   ↓  QA visuelle
Ship 🚀
```

---

### 3.5 — Exercice pratique MCP

**Exercice commun : pipeline bout en bout**

Choisissez votre variante selon votre rôle :

**👔 PM** : Research → Claude Code → Synthèse → Notion
```
1. Prenez 3 articles concurrents
2. Demandez à Claude Code de synthétiser
3. Exportez la synthèse dans une database Notion "Veille Concurrentielle"
```

**🎨 Designer** : Figma → Specs → Notion
```
1. Prenez un composant Figma existant
2. Extrayez les specs avec Claude Code
3. Exportez dans une page Notion "Design System Docs"
```

**⚙️ Design Eng** : Figma → Tokens → Code
```
1. Extrayez les design tokens d'un fichier Figma
2. Générez un fichier tokens.ts
3. Synchronisez avec votre projet
```

---

### 3.6 — Architecture workspace MCP recommandée

```
votre-workspace/
│
├── .claude/
│   └── settings.json    ← Configuration MCP (ne pas committer avec les keys)
│
├── mcp-exports/
│   ├── notion/          ← Données récupérées depuis Notion
│   └── figma/           ← Données extraites depuis Figma
│
├── mcp-imports/
│   ├── to-notion/       ← Contenu prêt à envoyer vers Notion
│   └── to-figma/        ← Contenu prêt à envoyer vers Figma
│
└── automations/         ← Scripts et workflows MCP
```

---

### 3.7 — Checklist Module 3

- [ ] Je comprends l'architecture MCP
- [ ] J'ai configuré au moins un serveur MCP
- [ ] J'ai testé une lecture depuis l'outil (Notion ou Figma)
- [ ] J'ai testé une écriture (création d'une page Notion)
- [ ] Mes API keys ne sont pas dans Git
- [ ] J'ai limité les permissions au strict nécessaire

---

## MODULE 4 — Skills & Automatisations

**Durée estimée** : 5-6 jours | **Difficulté** : ⭐⭐⭐⭐☆

### Objectifs

- ✅ Comprendre ce qu'est un skill et comment il fonctionne
- ✅ Créer des skills adaptés à votre rôle
- ✅ Construire une bibliothèque de prompts réutilisables
- ✅ Composer des workflows automatisés

---

### 4.1 — Qu'est-ce qu'un skill ?

Un **skill** est un comportement réutilisable défini dans un fichier markdown. Il encapsule un prompt système, des instructions et des exemples pour accomplir une tâche précise de façon cohérente.

**Analogie** : Une macro d'expert. Vous créez une fois la logique d'un expert pour une tâche spécifique, puis vous l'invoquez en une ligne à chaque fois.

#### Où vivent les skills

```bash
# Skills de projet (partagés avec l'équipe)
.claude/skills/
├── prd-writer.md
├── competitor-analyzer.md
└── ux-reviewer.md

# Skills personnels (tous vos projets)
~/.claude/skills/
├── my-writing-style.md
└── my-review-process.md
```

#### Format d'un skill

```markdown
---
name: prd-writer
description: Transforme des notes de discovery en PRD structuré
---

# Rôle

Tu es Senior Product Manager avec 10 ans d'expérience en B2B SaaS.
Tu rédiges des PRDs qui passent directement en engineering review sans aller-retour.

# Comportement

Quand on te donne des notes ou une description de feature :

1. Identifie le problème utilisateur central
2. Quantifie l'impact si des données sont disponibles
3. Structure selon le template PRD de ce projet
4. Pose les questions manquantes en fin de document
5. Sois concis — chaque phrase doit apporter de la valeur

# Règles

- Jamais de bullshit ou de remplissage
- Toujours des métriques mesurables (pas "améliorer l'UX")
- Toujours couvrir les edge cases
- Langue : Français, sauf termes techniques

# Exemple d'invocation

Input : "Les users abandonnent pendant l'onboarding, notamment à l'étape connexion API"
Output : PRD complet avec Problem Statement, métriques, user stories

# Format de sortie

Utilise le template : templates/template-prd.md
```

---

### 4.2 — Créer vos skills par rôle

#### 👔 Skills PM

**skill : prd-writer**
```markdown
---
name: prd-writer
description: Transforme des notes brutes en PRD structuré
---

Tu es Senior PM B2B SaaS. Transforme ce qui suit en PRD complet.
Utilise le template prds/template-prd.md.
Pose les questions manquantes à la fin.
```

**skill : competitor-analyzer**
```markdown
---
name: competitor-analyzer
description: Analyse un concurrent et produit un rapport structuré
---

Tu es analyst produit. Pour le concurrent donné :
1. Résume le positionnement en 2 phrases
2. Liste les features clés (5-7)
3. Identifie les forces vs notre produit
4. Identifie les faiblesses exploitables
5. Donne 3 opportunités concrètes

Format : markdown prêt pour research/competitors/
```

**skill : sprint-planner**
```markdown
---
name: sprint-planner
description: Découpe un PRD en stories et tâches prêtes pour le sprint
---

Tu es PM avec une expérience forte en agile.
Pour le PRD fourni, génère :
- Epics organisés par thème
- User stories avec critères d'acceptance (format Gherkin si complexe)
- Estimation relative (S/M/L/XL) avec justification
- Dépendances identifiées
- Risques techniques signalés
```

#### 🔨 Skills Builder

**skill : app-architect**
```markdown
---
name: app-architect
description: Génère l'architecture et la structure d'une nouvelle app
---

Tu es architecte logiciel senior. Pour l'app décrite :
1. Propose l'architecture adaptée au contexte (monolithe vs microservices, etc.)
2. Génère la structure de dossiers complète
3. Liste les dépendances avec justification
4. Identifie les décisions techniques à prendre
5. Estime la complexité de chaque module
```

**skill : debug-expert**
```markdown
---
name: debug-expert
description: Analyse et résout des bugs de façon méthodique
---

Tu es expert en debugging. Face à un bug :
1. Identifie la cause racine (pas les symptômes)
2. Explique pourquoi le bug existe
3. Propose 2-3 solutions avec leurs trade-offs
4. Recommande la meilleure solution
5. Vérifie qu'aucun edge case n'est laissé de côté

Ne propose pas de quick fixes qui masquent le problème.
```

#### 🎨 Skills Designer

**skill : ux-specs-generator**
```markdown
---
name: ux-specs-generator
description: Génère des specs UX complètes depuis des notes Figma
---

Tu es Product Designer expert en documentation.
Pour le composant/flow décrit :
1. Documente tous les états (default, hover, focus, error, empty, loading, disabled)
2. Identifie les edge cases UX
3. Spécifie les interactions et transitions
4. Note les questions d'accessibilité (WCAG 2.1 AA)
5. Génère la checklist QA pour les devs

Format : specs/template-component.md
```

**skill : ux-reviewer**
```markdown
---
name: ux-reviewer
description: Critique constructive d'un flow UX selon les heuristiques
---

Tu es expert UX spécialisé en SaaS B2B.
Revue selon les 10 heuristiques de Nielsen + bonnes pratiques mobile.
Pour chaque finding : niveau (critique/important/mineur) + recommandation.
Sois direct, pas de diplomatie inutile.
```

#### ⚙️ Skills Design Engineer

**skill : component-generator**
```markdown
---
name: component-generator
description: Génère un composant React complet depuis des specs
---

Tu es design engineer expert React + TypeScript + Tailwind.
Pour le composant décrit :
1. Génère le composant (.tsx) avec TypeScript strict
2. Génère la story Storybook (.stories.tsx) avec tous les états
3. Génère les tests (.test.tsx) avec Testing Library
4. Utilise les design tokens du projet (CLAUDE.md)
5. Assure l'accessibilité WCAG 2.1 AA

Lis toujours les composants existants avant de créer pour rester cohérent.
```

---

### 4.3 — Bibliothèque de prompts réutilisables

Organisez vos prompts dans `prompts/` par catégorie :

```
prompts/
├── research/
│   ├── interview-synthesis.md
│   ├── competitor-analysis.md
│   └── market-sizing.md
├── writing/
│   ├── prd-draft.md
│   ├── spec-generation.md
│   └── release-notes.md
├── review/
│   ├── prd-review.md
│   ├── ux-review.md
│   └── code-review.md
└── planning/
    ├── sprint-breakdown.md
    └── roadmap-prioritization.md
```

**Format recommandé pour un prompt réutilisable :**

```markdown
# [Nom du prompt]

**Usage** : [quand utiliser ce prompt]
**Input** : [ce qu'on doit fournir]
**Output** : [ce qu'on obtient]

---

[Le prompt]
```

---

### 4.4 — Système de productivité IA

**Stack complète recommandée :**

```
Claude Code (cerveau)
    +
CLAUDE.md (mémoire projet)
    +
Skills (comportements spécialisés)
    +
Custom commands (raccourcis)
    +
MCP Notion (stockage/partage)
    +
MCP Figma (si design)
```

**Organisation du stack :**

```
.claude/
├── settings.json     ← Permissions + MCP
├── skills/           ← Skills de projet
└── commands/         ← Custom slash commands
```

---

### 4.5 — Mini Projet Module 4

**Objectif** : "Mon AI Toolkit" — votre bibliothèque personnelle

**Livrables par rôle :**

| Rôle | Livrables |
|------|-----------|
| 👔 PM | 5 skills + 15 prompts + 3 custom commands |
| 🔨 Builder | 5 skills + 10 prompts + 5 custom commands dev |
| 🎨 Designer | 4 skills + 10 prompts + 3 custom commands design |
| ⚙️ Design Eng | 5 skills + 10 prompts + workflow Figma→Code |

---

### 4.6 — Checklist Module 4

- [ ] J'ai créé au moins 3 skills adaptés à mon rôle
- [ ] J'ai une bibliothèque de prompts organisée
- [ ] J'ai au moins 2 custom slash commands
- [ ] Mes skills sont documentés (description, input, output)
- [ ] J'ai testé chaque skill sur un cas réel

---

## MODULE 5 — Subagents & Orchestration Avancée

**Durée estimée** : 7-10 jours | **Difficulté** : ⭐⭐⭐⭐⭐ | **👔 PM + 🔨 Builder prioritaire**

### Objectifs

- ✅ Comprendre les subagents et leur utilité
- ✅ Orchestrer des workflows multi-agents
- ✅ Automatiser la veille concurrentielle (PM)
- ✅ Paralléliser des tâches complexes (Builder)

---

### 5.1 — Qu'est-ce qu'un subagent ?

Un **subagent** est un agent Claude spécialisé que vous (ou Claude Code) instanciez pour accomplir une tâche précise en parallèle d'autres agents.

**Analogie** : Vous êtes le chef de projet. Les subagents sont vos analysts spécialisés.  
Au lieu d'un seul consultant généraliste qui fait tout séquentiellement, vous avez une équipe qui travaille en parallèle.

**Sans subagents :**
```
Vous → Claude Code → Tâche A → Tâche B → Tâche C → Résultat
(séquentiel, lent, contexte mélangé)
```

**Avec subagents :**
```
Vous → Coordinateur
              ├── Agent A : Tâche A
              ├── Agent B : Tâche B  (parallèle)
              └── Agent C : Tâche C
                     ↓
              Coordinateur agrège
                     ↓
              Résultat de meilleure qualité
```

**Avantages :**
- Spécialisation (chaque agent a son contexte propre)
- Parallélisation (plus rapide)
- Meilleure qualité (moins de "pollution" de contexte)
- Modularité (chaque sous-tâche est indépendante)

---

### 5.2 — Architecture multi-agent

**Pattern de base :**

```
Coordinateur (orchestrateur)
│
├── Agent de collecte      (recherche, extraction de données)
├── Agent d'analyse        (traitement, insights)
├── Agent de synthèse      (résumé, recommandations)
└── Agent d'export         (formatage, publication)
```

**Implémentation avec custom commands :**

```markdown
# .claude/commands/competitive-research.md

Lance une analyse concurrentielle en 4 étapes parallèles.

Étape 1 — Collecte (parallèle) :
Pour chaque concurrent listé dans competitors.md :
- Analyse leur site web et leur pricing
- Identifie leurs features principales
- Note les changements récents

Étape 2 — Analyse par dimension :
- Pricing : comparaison et positionnement
- Features : matrice de comparaison
- Positioning : messages et segments cibles
- UX : points forts et faibles

Étape 3 — Synthèse :
- Opportunités identifiées (liste priorisée)
- Menaces identifiées
- Recommandations produit (max 5, actionnables)

Étape 4 — Export :
- Génère research/competitive-analysis-[date].md
- Met à jour memory/competitors.md avec les changements
- Crée la page Notion via MCP si configuré

Format : rapport exécutif + données détaillées en annexe
```

---

### 5.3 — Pipeline de veille concurrentielle (👔 PM)

**Architecture du pipeline :**

```
Déclenchement (manuel ou schedulé)
          ↓
[Agent Collecte]
├── Scrape les sites concurrents
├── Lit les changelogs
└── Analyse les réseaux sociaux
          ↓
[Agent Analyse UX]    [Agent Analyse Pricing]    [Agent Analyse Positioning]
(parallèle)           (parallèle)                 (parallèle)
          ↓
[Agent Synthèse]
├── Génère les insights
├── Compare aux périodes précédentes
└── Identifie les opportunités
          ↓
[Agent Export]
├── Rapport markdown local
└── Export Notion (MCP)
```

**Custom command — veille hebdomadaire :**

```markdown
# .claude/commands/weekly-intel.md

Exécute la veille concurrentielle hebdomadaire.

## Contexte
Lis memory/competitors.md pour la liste des concurrents et le contexte.
Lis research/previous-reports/ pour comparer avec les semaines précédentes.

## Tâche 1 : Analyse comparative
Pour chaque concurrent (max 5) :
- Quoi de neuf dans leurs features / produit ?
- Changements de pricing ou de positionnement ?
- Nouvelles initiatives marketing ou contenu ?
- Changements dans les reviews utilisateurs ?

## Tâche 2 : Insights et opportunités
- Quelles tendances se dessinent ?
- Quelles opportunités pour notre produit ?
- Y a-t-il des menaces nouvelles ?

## Tâche 3 : Export
Crée le fichier research/competitive-intel-[YYYY-WW].md avec :
- Résumé exécutif (5 bullets max)
- Détail par concurrent
- Opportunités priorisées (P1/P2/P3)
- Questions ouvertes

Si Notion MCP est connecté, crée la page dans la database "Veille Concurrentielle".
```

---

### 5.4 — Orchestration pour Product Builder (🔨)

**Pattern : génération d'app multi-agents**

```markdown
# .claude/commands/build-feature.md

Implémente la feature [nom] de façon complète et testée.

Phase 1 — Architecture :
- Analyse les fichiers existants pour comprendre les patterns
- Propose l'architecture de la feature
- Identifie les dépendances et les risques
- STOP : attends ma validation avant de continuer

Phase 2 — Implémentation :
- Implémente le backend (API, logique métier)
- Implémente le frontend (composants, états)
- Gère les cas d'erreur

Phase 3 — Tests :
- Tests unitaires des fonctions critiques
- Tests d'intégration des endpoints

Phase 4 — Documentation :
- Mise à jour du README si nécessaire
- Commentaires JSDoc sur les fonctions publiques

Commit final avec message structuré.
```

---

### 5.5 — Limites et bonnes pratiques

**Coûts et tokens :**
```
Chaque subagent consomme des tokens.
Pipeline complet avec 5 agents = 5x le coût d'un prompt simple.
→ Utiliser les subagents pour les tâches vraiment complexes ou répétitives.
→ Commencer simple, ajouter de la complexité seulement si nécessaire.
```

**Validation humaine :**
```
Un pipeline entièrement automatisé sans revue humaine est risqué.
→ Insérer des points de validation entre les étapes critiques.
→ Ne jamais publier automatiquement sans relecture.
```

**Context pollution :**
```
Les subagents ont chacun leur propre contexte.
→ Passer uniquement les informations nécessaires à chaque agent.
→ Ne pas partager tout le workspace à chaque agent.
```

---

### 5.6 — Projet Final — AI Product Operating System

**Construire votre "AI Product OS" personnel**

C'est le projet cumulatif final. Il rassemble tous les éléments des modules précédents.

**Architecture cible :**

```
ai-product-os/
│
├── CLAUDE.md                    ← Contexte produit complet
├── .claude/
│   ├── settings.json            ← Permissions + MCP
│   ├── skills/                  ← Vos skills spécialisés
│   └── commands/                ← Vos custom commands
│
├── memory/                      ← Mémoire persistante
│   ├── product-principles.md
│   ├── decisions.md
│   ├── competitors.md
│   └── roadmap.md
│
├── templates/                   ← Templates réutilisables
│   ├── prd-template.md
│   ├── spec-template.md
│   └── research-template.md
│
├── workflows/                   ← Documentation des workflows
│   ├── discovery-to-prd.md
│   ├── weekly-intel.md
│   └── sprint-planning.md
│
└── [modules selon votre rôle]
```

**Livrables par rôle :**

**👔 PM :**
- AI Product OS complet avec 5 skills PM
- Pipeline de veille concurrentielle fonctionnel
- Export Notion automatisé
- Au moins 1 PRD généré de bout en bout

**🔨 Builder :**
- AI Product OS avec workspace de développement
- Au moins une micro-app fonctionnelle générée
- Pipeline de génération et test automatisé
- Déploiement configuré

**🎨 Designer :**
- AI Product OS avec workflow Figma complet
- Design system documenté automatiquement
- Pipeline Figma → Specs → Handoff
- Au moins 5 composants documentés

**⚙️ Design Engineer :**
- AI Product OS avec pipeline Figma → Code
- 10+ composants générés et testés
- Storybook complet
- Design tokens synchronisés

---

## Ressources Transversales

### Glossaire

| Terme | Définition |
|-------|-----------|
| **MCP** | Model Context Protocol — standard de connexion entre IA et outils |
| **Context Window** | Mémoire active de l'IA dans une session (limitée en tokens) |
| **Token** | Unité de base que l'IA traite — environ ¾ de mot en français |
| **Prompt** | Instruction donnée à l'IA |
| **Skill** | Comportement réutilisable défini en markdown |
| **Subagent** | Agent IA spécialisé lancé par un agent coordinateur |
| **CLAUDE.md** | Fichier de contexte chargé automatiquement à chaque session |
| **PRD** | Product Requirements Document |
| **Custom command** | Slash command personnalisé défini dans `.claude/commands/` |
| **Settings.json** | Fichier de configuration de Claude Code (permissions, MCP) |
| **Design token** | Variable de design (couleur, taille, espacement) partagée code/design |
| **Handoff** | Transfert de specs du designer vers les engineers |
| **/compact** | Commande pour compresser l'historique de la session |

---

### FAQ Débutant

**"Dois-je savoir coder pour utiliser Claude Code ?"**

Non pour les rôles PM et Designer. Comprendre le terminal (Module 0) et la structure de fichiers suffit. Pour Builder et Design Engineer, un niveau débutant en code est nécessaire.

**"Quelle est la différence entre CLAUDE.md et la mémoire de Claude.ai ?"**

Ce sont deux systèmes distincts. CLAUDE.md est un fichier que *vous* gérez dans votre projet — c'est une mémoire explicite et contrôlée. La "mémoire" de Claude.ai est gérée par Anthropic et disponible en conversation web, pas dans Claude Code.

**"Combien coûte Claude Code ?"**

Claude Code est facturé à l'usage (tokens consommés). Les coûts dépendent de votre usage. Commencez avec des sessions courtes pour calibrer. Les pipelines de subagents sont plus coûteux — utilisez-les pour les tâches qui en valent vraiment la peine.

**"Que faire quand Claude Code 'oublie' le contexte ?"**

Trois causes possibles :
1. Session trop longue → `/compact`
2. CLAUDE.md insuffisant → enrichissez-le
3. Trop de fichiers en contexte → segmentez vos sessions

**"Quand utiliser MCP vs copier/coller ?"**

Règle simple : si vous faites la même opération copy/paste plus de 3 fois par semaine, configurez un MCP. Pour un usage ponctuel, le copy/paste est plus rapide à mettre en place.

**"Est-ce que Claude Code peut se tromper ?"**

Oui. Claude Code peut générer du contenu incorrect, incomplet ou non adapté. Relisez toujours les outputs critiques. Ne publiez jamais sans revue. Pour le code : toujours tester.

---

### Troubleshooting

#### Claude Code "oublie" le contexte en milieu de session

**Cause** : La context window est pleine.  
**Solution** :
1. Utilisez `/compact` pour compresser sans perdre l'essentiel
2. Vérifiez que votre CLAUDE.md est complet (il recharge le contexte à chaque session)
3. Découpez les longues sessions en sessions plus courtes

#### Résultats incohérents d'une session à l'autre

**Cause** : Pas de CLAUDE.md, ou CLAUDE.md trop vague.  
**Solution** : Enrichissez votre CLAUDE.md avec les conventions, le rôle de l'IA, et le contexte métier. Testez avec : `> Qui es-tu et quel est ce projet ?`

#### Le MCP Notion ne se connecte pas

**Checklist** :
1. La clé API est bien dans `settings.json` (pas dans un fichier markdown)
2. L'intégration Notion est bien connectée aux pages cibles
3. Claude Code a été redémarré après modification de `settings.json`
4. Testez avec : `> Liste les pages Notion auxquelles tu as accès`

#### Claude Code demande des permissions à chaque fois

**Solution** : Ajoutez les outils fréquents dans `settings.json` :
```json
{
  "permissions": {
    "allow": ["Read", "Write", "Bash(git status)", "Bash(git diff)"]
  }
}
```

#### Le prompt ne donne pas le résultat attendu

**Checklist RCOCQ** :
- [ ] Rôle défini ?
- [ ] Contexte suffisant ?
- [ ] Objectif précis ?
- [ ] Contraintes listées ?
- [ ] Format de sortie spécifié ?

---

### Anti-patterns à éviter

#### ❌ Le "Mega Prompt"

```
# Mauvais
> Lis tous mes fichiers, analyse tout le contexte, génère un PRD complet,
  fais une revue engineering, découpe en stories, et exporte dans Notion.
```

```
# Bon
Session 1 : > Synthétise les fichiers de research
Session 2 : > Sur la base de cette synthèse, génère le PRD
Session 3 : > Simule une engineering review de ce PRD
```

#### ❌ Le Workspace Chaotique

```
misc/
stuff/
new/
old/
temp/
```

Un workspace sans structure = une IA qui ne sait pas quoi lire. Investissez 30 minutes dans la structure — c'est récupéré en une semaine.

#### ❌ La Validation Automatique Sans Revue

Ne laissez jamais Claude Code publier, committer ou envoyer quelque chose sans revue humaine sur les actions critiques. Insérez des points de validation explicites dans vos workflows.

#### ❌ Le CLAUDE.md Vide

```markdown
# Mon Projet
```

Un CLAUDE.md vide force Claude Code à "deviner" le contexte à chaque session. Investissez 20 minutes pour le remplir correctement.

#### ❌ Les API Keys dans Git

```bash
# Mauvais : settings.json avec vrais tokens trackés par Git

# Bon : settings.json dans .gitignore
echo ".claude/settings.json" >> .gitignore
```

---

### Bonnes pratiques de sécurité

**Permissions :**
```
✅ Limiter les permissions au strict nécessaire
✅ Utiliser des API keys avec scope minimal
✅ Revue des commandes bash sensibles avant approbation
✅ Workspace Notion/Figma dédié à l'IA (pas votre workspace principal)
✅ Sauvegarder avant toute automatisation massive
```

**Données sensibles :**
```
✅ API keys dans des variables d'environnement
✅ .gitignore pour settings.json avec secrets
✅ Ne jamais passer de données personnelles utilisateurs à l'IA
✅ Attention aux documents confidentiels en contexte
```

**Automatisations :**
```
✅ Points de validation humaine dans les pipelines
✅ Logs des actions automatisées
✅ Pas de publication automatique sans revue
✅ Tests en environnement isolé avant production
```

---

## Progression et suite

### Débutant → Expert

| Niveau | Compétences | Indicateur |
|--------|------------|------------|
| Débutant | Terminal, CLAUDE.md, prompts basiques | Session productive en < 5 min |
| Junior IA | PRDs/specs, context management | Workflow quotidien établi |
| Intermédiaire | Skills, MCP, custom commands | Bibliothèque de 10+ prompts réutilisables |
| Avancé | Subagents, MCP cross-tools | Pipeline automatisé fonctionnel |
| Expert | Multi-agent systems, AI OS | Équipe augmentée par vos workflows |

### Ce qu'apprendre ensuite

**Priorité haute (mois 2-3) :**
- Git et GitHub (collaboration sur les prompts et specs)
- Basics des APIs et JSON (comprendre MCP en profondeur)
- Automatisation légère (scripts bash simples)

**Très puissant ensuite (mois 4+) :**
- Python léger (scripts d'automatisation avancés)
- Concepts RAG (Retrieval-Augmented Generation)
- Architecture AI Agents
- Évaluation de la qualité des outputs IA

---

## Conclusion

Le vrai levier n'est pas "utiliser une IA".

Le levier est de construire **un système de travail IA-native** :

```
Contexte structuré (CLAUDE.md)
+ Comportements codifiés (skills)
+ Outils connectés (MCP)
+ Workflows automatisés (subagents)
= Infrastructure opérationnelle augmentée
```

Les professionnels les plus performants dans les prochaines années seront ceux qui savent :
- Structurer le contexte pour que l'IA soit pertinente
- Orchestrer les agents pour paralléliser l'intelligence
- Créer des workflows réutilisables plutôt que de recommencer à chaque fois
- Transformer l'IA d'un outil ponctuel en infrastructure opérationnelle

Ce bootcamp est le point de départ. La différenciation vient avec la pratique quotidienne.

---

*Ressources officielles*
- [Anthropic Claude Code](https://www.anthropic.com/claude-code)
- [Documentation Claude Code](https://docs.anthropic.com/claude-code)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Notion Developers](https://developers.notion.com)
- [Figma Developers](https://www.figma.com/developers)
