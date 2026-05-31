# PRD — Guided Onboarding Wizard

**Statut** : Approved  
**Version** : v2  
**Auteur** : Sarah Leclerc (PM)  
**Date** : 2026-05-01  
**Sprint cible** : S22 — Semaine du 2026-05-25  
**Reviewers** : Mathieu Chen (Engineering Lead), Ana Santos (Designer)

> **Note** : Ceci est un exemple de PRD de qualité "prêt pour engineering review".
> Généré avec le skill `prd-writer` + itérations manuelles.

---

## 🎯 Problem Statement

### Le problème utilisateur

Les nouveaux utilisateurs abandonnent pendant la phase d'onboarding avant d'avoir connecté leur première source de données, ce qui les empêche de voir la valeur du produit et provoque un fort taux de churn précoce.

**Contexte détaillé** : Selon notre funnel d'activation, 77% des signups ne complètent pas la connexion de leur première data source dans les 7 jours. Les interviews révèlent que l'étape de connexion API est perçue comme "trop technique" par les non-développeurs. Les users lisent la documentation mais ne savent pas quelles valeurs entrer ni comment les trouver dans leurs outils sources.

### Pourquoi maintenant

- Notre taux d'activation (connexion source dans les 7 jours) est à 23% vs 65% de la médiane SaaS selon Mixpanel Benchmarks 2025
- Trois tickets de support sur cinq concernent l'onboarding
- Notre plan Series A implique un objectif d'activation à 55% d'ici Q3 2026
- L'Engineering est disponible (sprint S22-S23) avant le gel de feature du Q3

### Impact business attendu

Un taux d'activation passant de 23% à 50% sur les 6 prochains mois représente :
- +350 users activés/mois sur notre volume actuel
- Réduction estimée du churn mois 1 de 45% → 25% (basé sur la corrélation activation/retention)
- Réduction du support onboarding (-3h/semaine estimé)

---

## 👥 Utilisateurs

### Persona principale — "Le PM non-technique"

**Prénom fictif** : Thomas  
**Rôle** : Product Manager dans une scale-up SaaS, 50-200 salariés  
**Contexte** : Thomas veut utiliser notre analytics pour les réunions de product review, mais il n'a jamais manipulé une API key. Il dépend d'un dev pour les intégrations, ce qui crée de la friction.

### Jobs-to-be-done

1. Voir ses métriques produit sans demander de l'aide technique
2. Être autonome pour mettre à jour ses dashboards
3. Montrer des résultats à son CEO la semaine suivante

### Pain points actuels

| Pain point | Fréquence | Sévérité |
|-----------|-----------|----------|
| Ne sait pas où trouver son API key dans Mixpanel / Amplitude | Haute | Haute |
| Peur de faire une erreur (supprimer des données) | Haute | Moyenne |
| Documentation trop technique, pleine de jargon | Haute | Haute |
| Ne comprend pas pourquoi certaines étapes sont nécessaires | Moyenne | Moyenne |

---

## ✅ Success Metrics

| Métrique | Baseline actuelle | Objectif | Délai | Comment mesurer |
|----------|------------------|----------|-------|-----------------|
| Taux d'activation (connexion source J7) | 23% | 50% | 3 mois post-launch | Mixpanel funnel "signup → first_source_connected" |
| Time-to-first-value (premier dashboard chargé) | 8 jours médian | 3 jours médian | 3 mois | Amplitude session analysis |
| Taux d'abandon à l'étape API | 67% | <30% | 1 mois post-launch | Event "onboarding_step_api_abandoned" |
| Tickets support onboarding | 3.1/user signup | <1.5 | 2 mois | Intercom tag "onboarding" |

**Guardrail metrics** *(à ne pas dégrader)* :
- Taux d'erreur de connexion API : maintenir < 5%
- NPS à 30 jours : maintenir > 42

---

## 📐 Scope

### In scope — ce qu'on construit

- Wizard étape par étape (4 étapes max) remplaçant le formulaire actuel
- Détection automatique du type d'outil source (Mixpanel, Amplitude, Segment, GA4)
- Instructions contextuelles visuelles "Comment trouver votre API key dans [outil]"
- Validation en temps réel de la connexion avec feedback clair
- État de progression sauvegardé (reprise possible après fermeture)
- Email de reprise automatique si abandon à mi-parcours (J+1, J+3)

### Out of scope — ce qu'on ne construit PAS (et pourquoi)

| Élément exclu | Raison |
|--------------|--------|
| Connexion OAuth (vs API key) | Nécessite intégration OAuth par outil — sprint S24+ |
| Onboarding en vidéo / tutoriel interactif | Budget marketing, pas engineering — Q3 |
| Support de 50+ outils sources | On se concentre sur les 6 outils de 80% de nos signups |
| Onboarding mobile | Moins de 3% des signups viennent du mobile |

---

## 📖 User Stories

### Epic 1 — Wizard de connexion

**US-001** : En tant que nouvel utilisateur, je veux voir un wizard étape par étape pour connecter ma première source de données, afin de ne pas être perdu face à un formulaire vide.

**Priorité** : P1 | **Estimation** : L

**Critères d'acceptance** :
- [ ] Le wizard s'affiche automatiquement lors du premier login après signup
- [ ] Le wizard comporte exactement 4 étapes : Choisir l'outil → Trouver la clé → Tester la connexion → Première vue
- [ ] Une barre de progression indique l'étape courante et le nombre total d'étapes
- [ ] Chaque étape affiche un titre, une description en langage simple, et une aide contextuelle
- [ ] L'utilisateur peut quitter le wizard et le reprendre sans perdre sa progression

**Edge cases** :
- Si l'utilisateur ferme le browser à l'étape 2 : reprendre à l'étape 2 à la prochaine connexion
- Si l'utilisateur a déjà une source connectée : ne pas afficher le wizard (détecter via `source_count > 0`)

---

**US-002** : En tant que nouvel utilisateur, je veux voir des instructions visuelles "Comment trouver mon API key dans [mon outil]", afin de ne pas devoir ouvrir la documentation dans un autre onglet.

**Priorité** : P1 | **Estimation** : M

**Critères d'acceptance** :
- [ ] Après sélection de l'outil source, un panneau d'aide contextuel s'affiche
- [ ] Le panneau montre des captures d'écran annotées des 3 endroits principaux où trouver l'API key
- [ ] Le panneau est dismissable et peut être réaffiché via un bouton "Aide"
- [ ] Le contenu est disponible pour : Mixpanel, Amplitude, Segment, Google Analytics 4, HubSpot, Salesforce

**Edge cases** :
- Outil non supporté : afficher "Pas d'instructions disponibles — voir notre documentation" avec lien
- Images non chargées (connexion lente) : afficher texte alternatif complet

---

**US-003** : En tant que nouvel utilisateur, je veux que ma connexion soit testée en temps réel avec un feedback clair, afin de savoir immédiatement si j'ai fait une erreur (et laquelle).

**Priorité** : P1 | **Estimation** : M

**Critères d'acceptance** :
- [ ] Le bouton "Tester la connexion" déclenche un appel API avec feedback en < 3 secondes
- [ ] Si succès : message "Connexion réussie ✅ — X événements trouvés" avec aperçu
- [ ] Si échec clé invalide : "Clé API incorrecte — vérifiez que vous avez copié la clé complète"
- [ ] Si échec permissions : "Votre clé n'a pas les permissions nécessaires — voici comment les activer"
- [ ] Si timeout : "Connexion trop lente — réessayez dans quelques secondes"

**Edge cases** :
- Clé valide mais compte vide (0 événements) : succès + message "Aucune donnée trouvée — vérifiez que votre période est correcte"
- Clé copiée avec espace avant/après : trimmer silencieusement et mentionner dans le message de succès

---

### Epic 2 — Réengagement abandons

**US-004** : En tant que PM, je veux qu'un utilisateur ayant abandonné l'onboarding à mi-parcours reçoive un email de rappel, afin d'augmenter notre taux de complétion.

**Priorité** : P2 | **Estimation** : S

**Critères d'acceptance** :
- [ ] Si `onboarding_step < 3` ET `last_activity > 24h`, déclencher l'email J+1
- [ ] Si toujours incomplet après J+1, déclencher l'email J+3
- [ ] L'email contient un lien qui reprend l'onboarding à l'étape d'abandon
- [ ] Maximum 2 emails de relance par utilisateur
- [ ] Unsubscribe possible depuis l'email

---

## 🎨 UX Considerations

### Flow principal

```
Signup confirmé
      ↓
Premier login → Wizard s'affiche
      ↓
Étape 1 : "Quel outil voulez-vous connecter ?"
      → Grille de logos (6 outils) + "Autre"
      ↓
Étape 2 : "Entrez votre API key [outil sélectionné]"
      → Champ input + Panneau d'aide "Comment trouver votre clé"
      ↓
Étape 3 : Test de connexion
      → Loading → Succès / Erreur avec guidance
      ↓
Étape 4 : "Votre premier dashboard est prêt !"
      → Aperçu avec 3 données de l'outil
      → CTA : "Voir mon dashboard"
```

### États UI

- **Chargement test connexion** : skeleton + spinner, désactiver le bouton
- **Erreur connexion** : message d'erreur contextuel, input en rouge, aide affinée selon l'erreur
- **Succès** : animation de confirmation, transition vers étape suivante (500ms)
- **Abandon** : état sauvegardé automatiquement

### Contraintes design

- Wizard en modale (pas pleine page) — les utilisateurs ont parfois besoin de consulter leur email simultanément
- Mobile : le wizard doit fonctionner sur mobile même si l'usage est rare (pas de fonctionnalité réduite)
- WCAG 2.1 AA obligatoire sur l'ensemble du wizard

---

## ⚙️ Technical Considerations

### Dépendances techniques

- Service d'envoi d'email (Sendgrid) — déjà en place, configuration requise
- Endpoints de test de connexion par outil — à créer pour les 6 outils
- Stockage de l'état d'onboarding — nouvelle colonne `onboarding_state` en DB

### Risques d'implémentation

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Rate limiting des APIs tierces lors du test de connexion | Moyenne | Haute | Cache 60s du résultat de test, retry avec backoff |
| Délai de réponse > 3s sur certaines APIs | Haute | Moyenne | Timeout à 5s, message "réessayez" |
| Faux positifs (clé valide mais sans données récentes) | Faible | Moyenne | Vérifier la période sur 30 jours, pas uniquement les 24h |

---

## 🚀 Rollout Plan

| Phase | Scope | Durée | Critère de passage |
|-------|-------|-------|-------------------|
| Alpha interne | Équipe + 10 beta users | 1 semaine | 0 bug bloquant, feedback positif |
| Beta | 20% des nouveaux signups | 2 semaines | Activation beta ≥ 40%, support tickets ≤ 2 |
| GA | 100% nouveaux signups | — | — |

**Feature flag** : `feature_guided_onboarding_v2`  
**Rollback** : Désactiver le flag → retour au formulaire v1 (data compatible)

---

## ⚠️ Risks

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Le wizard ajoute de la friction pour les users techniques | Moyenne | Faible | Bouton "Passer / Je sais comment faire" visible dès l'étape 1 |
| Les instructions de localisation d'API key deviennent obsolètes | Haute | Moyenne | Versioning des captures d'écran, revue trimestrielle |
| Faible adoption de l'email de relance (spam) | Faible | Faible | Plain text, sender = PM@company.com, objet personnalisé |

---

## ❓ Open Questions

| Question | Owner | Deadline | Priorité |
|----------|-------|----------|----------|
| Faut-il proposer un mode "connexion par OAuth" dès la v1 pour Segment ? | Mathieu Chen | 2026-05-12 | P1 — bloque le scope |
| Qui maintient les captures d'écran des outils sources ? (PM ou Marketing ?) | Ana Santos | 2026-05-08 | P1 — bloque le design |
| L'email de relance J+3 doit-il être personnalisé avec le nom de l'outil choisi ? | Sarah Leclerc | 2026-05-10 | P2 |

---

## 📋 Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|-----------|
| v1 | 2026-04-28 | Sarah Leclerc | Document initial |
| v2 | 2026-05-01 | Sarah Leclerc | Ajout Epic 2 (réengagement), métriques affinées après review engineering |
