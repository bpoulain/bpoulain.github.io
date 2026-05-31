# Semaine 1 — Installation & Claude Code Core

**Modules couverts** : Module 0 + Module 1  
**Durée totale estimée** : 5-7h (1h/jour)

---

## Jour 1 — Installation et premier contact

**Objectif** : Claude Code fonctionne sur votre machine.

**Durée** : 45-60 min

**Ce que vous faites** :

```bash
# Homebrew (Mac seulement)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js
brew install node   # Mac
# Windows WSL2 : curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs

# Claude Code
npm install -g @anthropic-ai/claude-code

# Vérification
claude --version && echo "✅ Installation réussie"
```

**Premier lancement** :

```bash
mkdir premier-test && cd premier-test
claude
```

Dans Claude Code :
```
> Bonjour ! Crée un fichier hello.md avec "Mon premier test Claude Code — [date du jour]"
> /exit
cat hello.md
```

**Critère de réussite** : Le fichier `hello.md` existe avec le bon contenu. ✅

**Si ça ne marche pas** : Voir `draft_AI_Discovery.md` → section Troubleshooting, ou vérifiez que Node.js ≥ 18 avec `node --version`.

---

## Jour 2 — Terminal et workspace

**Objectif** : Naviguer dans le terminal et créer votre workspace.

**Durée** : 45 min

**Ce que vous faites** :

Mémorisez ces 6 commandes (les seules indispensables) :

```bash
pwd          # où suis-je ?
ls           # qu'est-ce qu'il y a ici ?
cd [dossier] # aller dans un dossier
mkdir [nom]  # créer un dossier
touch [nom]  # créer un fichier vide
cat [nom]    # lire un fichier
```

**Exercice** — Créer votre workspace (selon votre rôle) :

```bash
# PM
mkdir -p ai-product-lab/{discovery,prds,research,specs,competitors,memory,templates}

# Builder
mkdir -p ai-builder-lab/{src,tests,docs,automations,memory}

# Designer
mkdir -p ai-design-lab/{figma-exports,specs,ux-research,handoff,design-system,memory}

# Design Engineer
mkdir -p ai-design-eng-lab/{components,design-tokens,storybook,figma-sync,memory}

# Vérifier
ls votre-dossier/
```

**Critère de réussite** : Vous naviguez dans votre workspace sans regarder les commandes. ✅

---

## Jour 3 — CLAUDE.md — votre mémoire projet

**Objectif** : Claude Code connaît votre projet sans que vous le réexpliquez.

**Durée** : 60 min

**C'est la session la plus importante de la semaine.**

**Ce que vous faites** :

```bash
cd votre-workspace
touch CLAUDE.md
claude
```

Dans Claude Code :
```
> Ouvre le fichier CLAUDE.md et aide-moi à le remplir.
  Je vais te donner des informations sur mon projet.
```

Donnez-lui :
- Nom et description de votre projet
- Vos utilisateurs et leur problème
- Votre rôle dans le projet
- La langue (Français)
- Ce que vous voulez qu'il fasse

Copiez le template de `starter-kit/CLAUDE.md` comme base.

**Test de validation** :

```
> /clear
> Qui es-tu dans ce projet et décris-le moi en 3 phrases.
```

Si Claude Code répond correctement sans que vous ayez ré-expliqué → ✅

**Si la réponse est vague** : votre CLAUDE.md est trop générique. Ajoutez plus de contexte métier.

---

## Jour 4 — Slash commands et gestion du contexte

**Objectif** : Maîtriser les commandes de contrôle de session.

**Durée** : 45 min

**Ce que vous apprenez** :

| Commande | Quand l'utiliser |
|----------|-----------------|
| `/clear` | Changer de sujet — repart de zéro |
| `/compact` | Session > 30 min — compresse l'historique |
| `/help` | Voir toutes les commandes |
| `/exit` | Quitter |

**La règle du contexte** :

> Ne jamais tout mettre dans un seul prompt.
> Décomposez en étapes, donnez le minimum nécessaire.

**Exercice — trois sessions distinctes** :

Session 1 :
```
> Lis le dossier [votre dossier de travail] et liste les fichiers présents.
> Résume ce que tu vois en 3 bullets.
> /exit
```

Session 2 :
```
> /clear
> Quelle est la première chose à faire pour [votre objectif du jour] ?
```

Session 3 (session longue) :
```
# Après 20 min de travail :
> /compact
> Continue à partir d'où nous en étions.
```

**Critère de réussite** : Vous savez quand utiliser chaque commande. ✅

---

## Jour 5 — Prompts RCOCQ et premier vrai livrable

**Objectif** : Produire quelque chose d'utile avec Claude Code.

**Durée** : 60-75 min

**Le framework RCOCQ** :

```
R — Rôle     : "Tu es [expert]"
C — Contexte : "La situation est [contexte]"
O — Objectif : "Génère [livrable précis]"
C — Contraintes : "Pas de [limite], max [X]"
Q — Qualité  : "Le résultat doit [critère mesurable]"
```

**Exercice par rôle :**

**PM :**
```
R — Tu es Senior PM B2B SaaS.
C — [Lire votre CLAUDE.md]. Notre taux d'activation est faible.
O — Génère 3 hypothèses de features pour améliorer l'activation.
C — Pas de features de gamification. Réalistes pour une équipe de 3 devs.
Q — Chaque hypothèse doit avoir une métrique de succès mesurable.
```

**Builder :**
```
R — Tu es senior developer [votre stack].
C — Je construis [description de votre app].
O — Propose l'architecture et la structure de dossiers.
C — Pas de dépendances inutiles. Simple et maintenable.
Q — Un dev junior doit pouvoir comprendre la structure sans aide.
```

**Designer :**
```
R — Tu es UX researcher spécialisé en [votre domaine].
C — Notre onboarding a un taux d'abandon de 60%.
O — Génère 5 hypothèses UX sur les causes probables.
C — Basé sur les principes UX, pas sur des suppositions.
Q — Chaque hypothèse doit suggérer un test utilisateur pour la valider.
```

**Design Engineer :**
```
R — Tu es design engineer expert React + TypeScript + Tailwind.
C — Je construis [composant].
O — Génère l'interface TypeScript (props) avant le code.
C — Types stricts, pas de any.
Q — Doit couvrir tous les états et cas d'usage du composant.
```

**Critère de réussite** : Vous avez produit un livrable utile dans votre domaine. ✅

---

## Jours 6-7 — Consolidation

**Objectif** : Ancrer les habitudes et corriger les lacunes.

**Jour 6 — Révision** :
- Relisez votre CLAUDE.md et enrichissez-le avec ce que vous avez appris
- Créez votre premier custom slash command (`.claude/commands/`)
- Refaites l'exercice du Jour 5 sur un autre sujet

**Jour 7 — Auto-évaluation** :
Faites la section "Semaine 1" de `self-evaluation.md`.

---

## Récapitulatif Semaine 1

| Jour | Acquis |
|------|--------|
| J1 | Claude Code installé et fonctionnel |
| J2 | Workspace créé, terminal maîtrisé |
| J3 | CLAUDE.md opérationnel |
| J4 | Slash commands maîtrisées |
| J5 | Premier livrable produit avec RCOCQ |
| J6-7 | Consolidation + auto-évaluation |

**Preuve de maîtrise** : Ouvrez Claude Code dans votre workspace et produisez un livrable utile en moins de 10 minutes, sans regarder vos notes.
