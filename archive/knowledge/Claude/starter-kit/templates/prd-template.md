# PRD — [Nom de la Feature]

**Statut** : Draft | In Review | Approved | Shipped  
**Version** : v1  
**Auteur** : [Nom]  
**Date** : [YYYY-MM-DD]  
**Sprint cible** : [S##] — Semaine du [date]  
**Reviewers** : [Engineering Lead], [Designer], [CEO si stratégique]

---

## 🎯 Problem Statement

### Le problème utilisateur

> En une phrase : [Quel problème résout cette feature, pour qui, dans quel contexte ?]

[Description détaillée : contexte d'usage, fréquence du problème, impact actuel]

### Pourquoi maintenant

[Événement déclencheur : donnée, feedback utilisateur, opportunité marché, dette produit]

### Impact business attendu

[Lien avec les OKRs ou métriques d'équipe]

---

## 👥 Utilisateurs

### Persona principale

**Nom** : [Prénom fictif]  
**Rôle** : [Titre]  
**Contexte** : [Description en 2-3 phrases]

### Jobs-to-be-done

1. [JTBD 1]
2. [JTBD 2]
3. [JTBD 3 si pertinent]

### Pain points actuels

| Pain point | Fréquence | Sévérité |
|-----------|-----------|----------|
| [Pain 1] | Haute / Moyenne / Faible | Haute / Moyenne / Faible |
| [Pain 2] | | |

---

## ✅ Success Metrics

| Métrique | Baseline actuelle | Objectif | Délai | Comment mesurer |
|----------|------------------|----------|-------|-----------------|
| [KPI principal] | [valeur actuelle] | [cible] | [X mois post-launch] | [où dans les analytics] |
| [KPI secondaire] | | | | |

**Guardrail metrics** *(à ne pas dégrader)* :
- [Métrique à protéger 1]
- [Métrique à protéger 2]

---

## 📐 Scope

### In scope — ce qu'on construit

- [Feature / comportement 1]
- [Feature / comportement 2]
- [Feature / comportement 3]

### Out of scope — ce qu'on ne construit PAS (et pourquoi)

| Élément exclu | Raison |
|--------------|--------|
| [Fonctionnalité exclue 1] | [Raison : hors focus / prochain sprint / budget] |
| [Fonctionnalité exclue 2] | |

---

## 📖 User Stories

### Epic 1 — [Nom de l'epic]

**US-001** : En tant que [persona], je veux [action], afin de [bénéfice].

**Priorité** : P1  
**Estimation** : M  

**Critères d'acceptance** :
- [ ] [Critère vérifiable par QA 1]
- [ ] [Critère vérifiable par QA 2]
- [ ] [Critère vérifiable par QA 3]

**Edge cases** :
- [Cas limite 1 et comportement attendu]
- [Cas limite 2 et comportement attendu]

---

**US-002** : En tant que [persona], je veux [action], afin de [bénéfice].

**Priorité** : P2  
**Estimation** : S  

**Critères d'acceptance** :
- [ ]
- [ ]

---

### Epic 2 — [Nom de l'epic]

*(Reproduire le pattern ci-dessus)*

---

## 🎨 UX Considerations

### Flows principaux

```
[Flow 1 en texte ou ASCII]
Étape 1 → Étape 2 → Étape 3
```

### États UI

- **État vide** : [Comportement quand pas de données]
- **État chargement** : [Skeleton / spinner / etc.]
- **État d'erreur** : [Message et action possible]
- **État succès** : [Confirmation]

### Contraintes design

- [Contrainte d'accessibilité si connue]
- [Cohérence avec design system]

---

## ⚙️ Technical Considerations

### Dépendances techniques

- [Dépendance 1 : service, API, composant existant]
- [Dépendance 2]

### Risques d'implémentation

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| [Risque technique 1] | Haute / Moyenne / Faible | Haute / Moyenne / Faible | [Approche] |

### Contraintes connues

- [Contrainte performance si pertinente]
- [Contrainte de sécurité si pertinente]

---

## 🚀 Rollout Plan

| Phase | Scope | Durée | Critère de passage |
|-------|-------|-------|-------------------|
| Alpha interne | Équipe seulement | 1 semaine | [Critère] |
| Beta | [X% users / cohorte] | 2 semaines | [Métrique seuil] |
| GA | 100% users | — | — |

**Feature flag** : `feature_[nom]_enabled`  
**Rollback** : [Comment revenir en arrière si problème]

---

## ⚠️ Risks

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| [Risque produit 1] | | | |
| [Risque adoption 1] | | | |

---

## ❓ Open Questions

| Question | Owner | Deadline | Priorité |
|----------|-------|----------|----------|
| [Question bloquante 1] | [Nom] | [Date] | P1 |
| [Question importante] | [Nom] | [Date] | P2 |

---

## 📋 Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|-----------|
| v1 | [date] | [nom] | Document initial |
