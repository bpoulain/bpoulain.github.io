# Mission 03 — Designer : Du brief aux specs complètes

**Rôle** : Product Designer  
**Niveau** : Débutant  
**Durée estimée** : 2-3 heures  
**Objectif** : Partir d'un brief flou → produire des specs UI complètes + handoff engineering

---

## Contexte Pixio

Suite à la mission PM (Mission 01), le PRD du nouvel onboarding guidé a été validé. Il est maintenant temps de designer la solution.

La Lead Designer, Inès Dumont, t'a briefé en réunion :

> *"On a besoin de repenser le parcours de premier usage. L'idée c'est un 'checklist d'activation' — une petite liste de 4-5 actions clés que l'utilisateur fait dans sa première semaine. Chaque action cochée = un pas vers le 'aha moment'. Genre : créer son premier visuel, configurer le Brand Kit, inviter un collaborateur, exporter dans le bon format. On veut que ça soit visible dans l'app sans être intrusif. Pas un modal bloquant. Quelque chose de doux mais présent."*

**Contraintes design** :
- Doit s'intégrer dans le design system Pixio existant
- Mobile-responsive (60% des utilisateurs accèdent sur mobile en première semaine)
- Ne doit pas bloquer l'accès aux fonctionnalités
- Accessible WCAG 2.1 AA
- Doit disparaître une fois les 5 étapes complètes (ou après 30 jours)

---

## Brief complet

### Feature : Activation Checklist

**Objectif produit** : Augmenter le taux d'activation à M1 de 62% à 75%

**Déclencheur** : Visible dès la deuxième connexion (pas au premier login — trop tôt)

**5 étapes de la checklist** :
1. ✓ Créer votre premier visuel *(déjà fait pour la plupart)*
2. ☐ Configurer votre Brand Kit (couleurs + polices)
3. ☐ Créer un template à partir d'un visuel
4. ☐ Inviter un membre de l'équipe
5. ☐ Exporter en haute résolution

**Récompense** : Badge "Pixio Pro" débloqué après complétion + 30 jours de plan Pro offerts

**Métriques de succès** :
- Taux de complétion de la checklist > 45%
- Rétention M1 : 62% → 75%
- Pas de hausse des signalements "trop intrusif" dans le support

---

## Étapes de la mission

### Étape 1 — Spécification du composant ActivationChecklist (40-50 min)

**Objectif** : Produire les specs complètes du composant avant tout design.

**Prompt à utiliser** : `prompts-library/design/component-specs.md`

**À faire** :
```
[Utiliser le prompt component-specs.md avec ce brief]

Composant : ActivationChecklist
- Widget flottant (coin inférieur droit sur desktop, barre en bas sur mobile)
- 5 étapes avec états : à faire / en cours / complété
- Peut être réduit / masqué temporairement
- Affiche la progression : "2/5 étapes"
- Au clic sur une étape non faite : lien vers la fonctionnalité correspondante
- Animation de célébration à la complétion (confetti ?)
```

**Critère de réussite** : Specs avec tous les états documentés, props listées, accessibilité définie.

---

### Étape 2 — Review UX du concept (20-30 min)

**Objectif** : Valider que le concept est bien conçu avant d'aller plus loin.

**Prompt à utiliser** : `prompts-library/review/ux-flow-review.md`

**À faire** :
1. Décrire le parcours complet (deuxième login → checklist visible → clic étape → action → retour checklist → complétion)
2. Demander une review selon les heuristiques de Nielsen
3. Identifier les frictions potentielles

**Critère de réussite** : Au moins 2 frictions identifiées et solution proposée pour chacune.

---

### Étape 3 — Audit accessibilité du composant (20 min)

**Objectif** : S'assurer que le composant sera accessible dès la conception.

**Prompt à utiliser** : `prompts-library/review/accessibility-audit.md`

**À faire** :
```
Audite l'accessibilité de ce composant ActivationChecklist (specs du dessus).
Identifie :
- Les rôles ARIA nécessaires
- L'ordre de tabulation
- Les announcements screen reader (ex: quand une étape est cochée)
- Le comportement clavier (Escape pour réduire, etc.)
```

**Critère de réussite** : Liste des rôles ARIA et comportements clavier définis dans les specs.

---

### Étape 4 — Specs des états (30-40 min)

**Objectif** : Documenter précisément chaque état visuel.

**À faire avec Claude Code** :
```
Pour le composant ActivationChecklist, génère la documentation complète de tous les états visuels :

États du widget :
- Étendu (5 étapes visibles)
- Réduit (juste le compteur "2/5")
- Masqué (l'utilisateur a cliqué "Masquer pour aujourd'hui")
- Complété (toutes les étapes faites → animation + message de félicitation)
- Post-complétion (widget disparu, badge visible dans le profil)

États d'une étape :
- À faire (gris, cercle vide)
- En cours (si l'utilisateur est sur la page de cette feature)
- Complété (vert, coche)

Pour chaque état : décrire le visuel, les tokens utilisés, l'animation si applicable, le comportement au clic.
```

**Critère de réussite** : Tableau d'états complet, prêt à être ajouté aux specs Figma.

---

### Étape 5 — Handoff engineering (30-40 min)

**Objectif** : Préparer le document de passation pour l'équipe dev.

**Prompt à utiliser** : `prompts-library/design/engineering-handoff.md`

**À faire** :
1. Utiliser le prompt handoff avec toutes les specs produites
2. Compléter les valeurs exactes (espacements, couleurs, animations)
3. Lister les questions ouvertes pour l'engineering

**Critère de réussite** : Document de handoff qu'un dev peut utiliser sans te poser de questions.

---

### Étape 6 — Review de la copy UX (15 min)

**Objectif** : Valider que les textes du composant sont clairs et bien écrits.

**Prompt à utiliser** : `prompts-library/review/copy-review.md`

**Copy à valider** :
- Titre du widget : "Démarrez avec Pixio"
- Sous-titre : "5 étapes pour maîtriser votre outil"
- CTA completion : "Félicitations ! Vous êtes Pixio Pro 🎉"
- Texte de masquage : "Masquer pour aujourd'hui"
- Chaque libellé d'étape (1 à 5)

**Critère de réussite** : Copy validée ou corrigée avec justification.

---

## Livrable attendu

Un dossier `missions/output-mission-03/` contenant :
- `component-specs-activation-checklist.md` — Specs complètes
- `ux-review.md` — Résultats de la review UX + corrections
- `accessibility-checklist.md` — Audit a11y + rôles ARIA
- `engineering-handoff.md` — Document de passation engineering

---

## Auto-évaluation

| Critère | Oui | Partiel | Non |
|---------|-----|---------|-----|
| Tous les états du composant documentés | | | |
| Props et types définis | | | |
| Accessibilité WCAG couverte (rôles ARIA, clavier) | | | |
| Review UX avec au moins 2 frictions identifiées | | | |
| Handoff avec valeurs exactes (tokens, espacements) | | | |
| Copy validée | | | |
| Questions engineering listées | | | |

**Score** : `/7`

**Référence** : Comparer avec `examples/ux-specs-data-table.md` — même niveau de précision attendu.

---

## Ressources

- `prompts-library/design/component-specs.md`
- `prompts-library/design/engineering-handoff.md`
- `prompts-library/review/ux-flow-review.md`
- `prompts-library/review/copy-review.md`
- `prompts-library/review/accessibility-audit.md`
- `examples/ux-specs-data-table.md` (exemple de référence)
