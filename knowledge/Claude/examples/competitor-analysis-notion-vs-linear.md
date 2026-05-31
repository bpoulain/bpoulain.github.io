# Analyse Concurrentielle — Notion vs Linear (cas d'usage PM)

**Date** : 2026-05-15  
**Analysé par** : Claude Code (skill competitor-analyzer) + validation manuelle  
**Sources** : Sites officiels, G2 (mai 2026), Capterra, Product Hunt, Twitter/X  
**Contexte** : Analyse focalisée sur les workflows PM — rédaction de specs, gestion de roadmap, collaboration.

> **Note** : Ceci est un exemple de livrable généré avec le skill `competitor-analyzer`.
> Format réutilisable dans `starter-kit/templates/competitor-template.md`.

---

## NOTION — Analyse PM

### Positionnement

**En une phrase** : Notion est un workspace tout-en-un pour la gestion de connaissance et la collaboration, ciblant les équipes qui veulent remplacer plusieurs outils par un seul.

**Tagline** : "The connected workspace"  
**Message principal** : Flexibilité totale pour créer n'importe quel workflow, tout au même endroit.

---

### Cible

| Dimension | Détail |
|-----------|--------|
| Taille d'entreprise | 5-500 personnes (sweet spot : 10-100) |
| Rôle décideur | Head of Ops, Chief of Staff, VP Product |
| Rôle utilisateur | PMs, Ops, Founders, Knowledge workers |
| Secteur | Tous secteurs, surtout tech + startups |
| Géographie | Global, fort en US/Europe/Asie |

---

### Features clés

| Feature | Description | Différenciation |
|---------|-------------|----------------|
| Pages flexibles | Blocs de contenu (texte, table, kanban, calendrier) | Unique — flexibilité extrême |
| Databases | Tables relationnelles avec vues multiples | Fort |
| AI (Notion AI) | Rédaction, résumé, génération de contenu | Similaire aux concurrents |
| Templates | +10 000 templates communautaires | Fort |
| Partage public | Pages publiques sans authentification | Fort |
| API + Integrations | API REST + intégrations Zapier/MCP | Intermédiaire |
| Projets (Notion Projects) | Gestion de projet basique (milestone, sprint) | Basique vs Linear |

---

### Forces

1. **Flexibilité inégalée** : on peut construire n'importe quel workflow. Aucun outil ne rivalise en personnalisation libre.
2. **Adoption virale** : facile de commencer gratuitement, beau rendu, fort word-of-mouth.
3. **Ecosystem de templates** : la communauté a résolu la plupart des cas d'usage courants.
4. **Notion AI** : bien intégré, utile pour la synthèse et la rédaction de docs produit.
5. **Database views** : une seule database, multiple vues (kanban, liste, calendrier, galerie).

---

### Faiblesses exploitables

1. **Notion Projects est faible pour le suivi d'ingénierie** → *Notre avantage potentiel* : un PM peut utiliser notre produit pour le product discovery et Notion pour la knowledge base, sans friction.
2. **Pas de granularité des permissions fine** → *Notre avantage potentiel* : pour les équipes soucieuses de sécurité des données produit.
3. **Lent à configurer pour un usage PM structuré** → *Notre avantage potentiel* : onboarding guidé pour des workflows PM préconfigurés.
4. **Pas de time tracking natif** → *Notre avantage potentiel* : si on vise les équipes qui veulent mesurer le delivery.
5. **L'API est puissante mais demande un dev** → *Notre avantage potentiel* : MCP Notion simplifie ça, mais la cible non-tech est mal servie.

---

### Pricing

**Modèle** : Freemium + Per seat

| Plan | Prix | Limites principales |
|------|------|-------------------|
| Free | 0€ | 10 guests, historique limité |
| Plus | ~10€/user/mois | Guests illimités, fichiers jusqu'à 5MB |
| Business | ~15€/user/mois | SAML SSO, audit log, advanced analytics |
| Enterprise | Custom | SLA, DPA, admin avancé |

**Observations** : Pricing accessible, friction faible pour commencer. Le vrai lock-in vient du volume de contenu créé.

---

### Ce que les users disent (G2, mai 2026)

**Points positifs** :
- "Le meilleur outil pour gérer notre knowledge base produit"
- "Flexible to a fault — you can build anything"
- "Notion AI a transformé notre façon de rédiger les PRDs"

**Points négatifs** :
- "Trop libre — on a passé 2 semaines à configurer un workflow basique" → *Opportunité : onboarding guidé avec workflow PM préconfiguré*
- "Performance lente sur les grandes databases" → *Opportunité : argument de performance si pertinent*
- "Notion Projects ne remplace pas Jira ou Linear pour les devs" → *Opportunité : positionnement comme complément*

---

## LINEAR — Analyse PM

### Positionnement

**En une phrase** : Linear est un outil de gestion de projet engineering-first, conçu pour des cycles de développement rapides et une expérience développeur exceptionnelle.

**Tagline** : "The issue tracker for modern software teams"  
**Message principal** : Vitesse et rigueur du suivi d'issues pour les équipes engineering.

---

### Cible

| Dimension | Détail |
|-----------|--------|
| Taille d'entreprise | 5-200 personnes (sweet spot : 10-50) |
| Rôle décideur | CTO, Engineering Lead, VP Engineering |
| Rôle utilisateur | Développeurs, PMs techniques |
| Secteur | Tech / SaaS, équipes engineering-first |
| Géographie | US-first, Europe forte |

---

### Features clés

| Feature | Description | Différenciation |
|---------|-------------|----------------|
| Issues | Suivi d'issues ultra-rapide (keyboard shortcuts) | Unique — vitesse |
| Cycles (Sprints) | Sprints avec velocity tracking | Fort |
| Roadmaps | Vue roadmap depuis les issues | Intermédiaire |
| Projets | Regroupement d'issues en projets | Bon |
| Inbox | Suivi des mentions et notifications | Unique |
| Linear AI | Résumé d'issues, génération de specs | Intermédiaire |
| Intégrations | GitHub, Figma, Slack, Zapier | Fort |
| API | GraphQL API puissante | Fort |

---

### Forces

1. **Expérience développeur sans égale** : vitesse, raccourcis clavier, performance. Les devs adorent.
2. **Qualité de l'interface** : Linear est la référence design pour un outil B2B en 2026.
3. **Cycles et velocity** : suivi de sprint natif, très utile pour les engineering leads.
4. **Intégration GitHub** : issues liées aux PRs et commits = feedback loop PM/dev parfait.
5. **Linear AI** : résumé d'issues et génération de specs de qualité correcte.

---

### Faiblesses exploitables

1. **Faible pour la discovery et la research** : Linear n'est pas fait pour les notes d'interviews, les PRDs longs, la connaissance produit. → *Notre avantage potentiel* : complémentaire, pas concurrent.
2. **Interface intimidante pour les PMs non-techniques** → *Notre avantage potentiel* : si notre produit s'interface avec Linear sans que le PM doive apprendre l'outil.
3. **Pas de gestion de roadmap stratégique** (OKRs, thèmes, horizons) → *Notre avantage potentiel* : couche stratégique au-dessus de Linear.
4. **Pricing élevé à l'échelle** → *Notre avantage potentiel* : pour les entreprises > 50 personnes.

---

### Pricing

**Modèle** : Per seat

| Plan | Prix | Limites principales |
|------|------|-------------------|
| Free | 0€ | 250 issues, 10 membres |
| Basic | ~8€/user/mois | Issues illimitées |
| Business | ~14€/user/mois | Analytics, admin avancé |
| Enterprise | Custom | SSO, SLA |

---

### Ce que les users disent (G2, mai 2026)

**Points positifs** :
- "Le meilleur outil de tracking d'issues — la vitesse est incomparable"
- "Notre équipe engineering l'a adopté en 48h"

**Points négatifs** :
- "Manque de vue roadmap stratégique — on utilise Notion en parallèle pour ça" → *Opportunité confirmée*
- "Les PMs non-techniques ont du mal à l'utiliser" → *Opportunité confirmée*

---

## Synthèse — Opportunités

| Opportunité | Priorité | Source | Action suggérée |
|-------------|----------|--------|----------------|
| Les équipes utilisent Notion + Linear → friction de context switch | P1 | G2 reviews, interviews | Workflow d'intégration MCP Notion + Linear dans notre produit |
| Onboarding PM guidé manque dans les deux outils | P1 | Notion reviews | Notre UX doit être notre différenciation n°1 |
| Roadmap stratégique (OKRs, thèmes) manque dans Linear | P2 | G2 reviews | Feature roadmap stratégique sur notre backlog |
| API keys complexes à gérer pour les non-tech | P2 | Support tickets Notion | Notre onboarding wizard (voir PRD) est une réponse directe |

## Menaces à surveiller

1. **Linear lance des fonctionnalités PM** (roadmap stratégique, templates PRD) — probable en 2026 selon les signaux de changelog
2. **Notion acquiert une fonctionnalité d'engineering tracking** — peu probable mais surveiller les changelogs

---

## À surveiller

- [ ] Changelog Linear mensuel — focus sur les features "non-dev"
- [ ] Notion Projects — maturité du sprint planning
- [ ] Pricing changes Linear (tendance à augmenter sur les marchés captifs)
