# Rôle et expertise

Tu es un **expert en accessibilité numérique**, spécialisé dans l’utilisation de **VoiceOver sur macOS et iOS**, dans les recommandations **WCAG 2.2 (niveaux A et AA)** et dans l’évaluation de l’accessibilité des composants de Design Systems.

Tu maîtrises les technologies d’assistance Apple, les interactions au clavier, les gestes VoiceOver, la sémantique HTML, ARIA ainsi que les bonnes pratiques d’accessibilité des interfaces web et mobiles natives.

# Objectif

Aide-moi à concevoir un **guide de tests d’accessibilité pour les composants d’un Design System**, destiné aux designers, développeurs et testeurs QA.

Ce guide doit permettre de :

- Vérifier l’accessibilité de chaque composant avec VoiceOver sur macOS et iOS.
- Identifier les problèmes d’interaction, de navigation, de compréhension et de restitution vocale.
- Définir une méthode de test standardisée, reproductible et compréhensible.
- Déterminer les comportements attendus pour chaque composant.
- Identifier les non-conformités et proposer des recommandations de correction.
- Faciliter la validation des composants avant leur intégration dans les produits.

# Partie 1 — Définir la stratégie globale de tests

Construis un plan de tests structuré comprenant :

1. **Le périmètre des tests** : composants concernés, variantes, états et contextes d’utilisation.
2. **Les environnements de tests** : macOS avec Safari et VoiceOver, iOS avec Safari et VoiceOver, et applications natives si pertinentes.
3. **Les prérequis** : configuration de VoiceOver, versions des systèmes, navigateurs et appareils.
4. **Les méthodes de navigation** : clavier, commandes VoiceOver, rotor iOS, gestes tactiles et exploration de l’écran.
5. **Les critères d’évaluation** : nom accessible, rôle, valeur, état, description, ordre de navigation, gestion du focus, annonces vocales et interactions.
6. **Les références normatives** : critères WCAG 2.2 applicables, bonnes pratiques WAI-ARIA et recommandations Apple.
7. **La classification des anomalies** : bloquante, majeure, mineure et amélioration.
8. **Les critères de validation** : conditions permettant de considérer un composant comme conforme aux exigences retenues.

Précise les différences de comportement et de méthode entre macOS et iOS.

# Partie 2 — Définir un plan de tests par composant

Propose un inventaire structuré des composants courants d’un Design System, regroupés par famille :

- **Actions** : boutons, liens, boutons d’icône, menus d’actions.
- **Formulaires** : champs de saisie, cases à cocher, boutons radio, listes déroulantes, interrupteurs, champs de recherche, champs de date.
- **Navigation** : onglets, menus, fil d’Ariane, pagination, accordéons.
- **Feedback** : alertes, notifications, messages d’erreur, indicateurs de progression, états de chargement.
- **Superposition** : fenêtres modales, dialogues, popovers, infobulles.
- **Contenus** : tableaux, listes, cartes, images, icônes et contenus repliables.
- **Composants complexes** : autocomplétion, combobox, carrousel, arbre de navigation et tableaux interactifs.

Pour chaque composant, identifie les scénarios prioritaires, les variantes et les états à tester.

# Partie 3 — Détailler les procédures de test

Pour **chaque composant**, produis une fiche de test autonome contenant les sections suivantes.

## 1. Présentation du composant

- Nom du composant.
- Fonction et usage attendu.
- Variantes et états à vérifier.
- Principaux risques d’accessibilité.

## 2. Prérequis

- Configuration nécessaire.
- Données ou contenus de test.
- État initial du composant.

## 3. Tests VoiceOver sur macOS

Décris précisément et chronologiquement :

- Comment atteindre le composant.
- Quelles touches ou combinaisons de touches utiliser.
- Comment parcourir ses éléments.
- Comment interagir avec lui.
- Comment vérifier ses différents états.
- Comment contrôler la restitution vocale.
- Comment vérifier la gestion du focus.

Pour chaque étape, indique **la commande exacte, l’action à réaliser et le résultat attendu**.

## 4. Tests VoiceOver sur iOS

Décris précisément :

- Les gestes VoiceOver à effectuer.
- La navigation par balayage.
- L’utilisation du rotor lorsque pertinente.
- L’exploration tactile.
- Les gestes d’activation.
- Les interactions spécifiques au composant.
- Les annonces vocales attendues.
- Le comportement du focus après chaque action.

Distingue les interactions propres à iOS de celles réalisées sur macOS.

## 5. Résultats attendus

Pour chaque scénario, précise :

- Le nom accessible attendu.
- Le rôle annoncé.
- L’état ou la valeur annoncé.
- L’ordre de navigation attendu.
- Les interactions disponibles.
- Le comportement du focus.
- Les messages ou changements d’état devant être annoncés.

Fournis des **exemples concrets de restitution VoiceOver**, en précisant que la formulation exacte peut varier selon la version du système, la langue et le contexte.

## 6. Critères de conformité

Associe les tests aux critères WCAG 2.2 pertinents et, lorsque nécessaire, aux recommandations WAI-ARIA ou Apple.

Distingue clairement les exigences normatives des bonnes pratiques et des comportements spécifiques aux technologies d’assistance.

## 7. Anomalies fréquentes

Présente les problèmes susceptibles d’être rencontrés, leurs conséquences pour l’utilisateur et les pistes de correction.

## 8. Checklist de validation

Termine chaque fiche par une checklist permettant au testeur de marquer chaque contrôle :

- Conforme
- Non conforme
- Non applicable
- Non testé

Prévois également un champ pour les observations et les anomalies identifiées.

# Partie 4 — Construire une matrice de tests

Produis un tableau de synthèse comportant au minimum les colonnes suivantes :

| Champ | Description |
|---|---|
| Composant | Nom du composant testé |
| ID du test | Identifiant unique |
| Plateforme | macOS ou iOS |
| Scénario | Fonctionnalité vérifiée |
| Action | Manipulation à effectuer |
| Résultat attendu | Comportement accessible attendu |
| Référence | Critère WCAG ou bonne pratique |
| Priorité | Critique, haute, moyenne, basse |
| Statut | Conforme, non conforme, non applicable, non testé |

# Partie 5 — Recommandations et livrables

Propose :

1. Un ordre de priorité pour tester les composants.
2. Une méthode de suivi des anomalies.
3. Un modèle de fiche de test réutilisable.
4. Une checklist de recette d’accessibilité.
5. Des recommandations pour intégrer ces tests dans le cycle de vie du Design System.
6. Une stratégie de non-régression lors de l’évolution des composants.

# Exigences de rédaction

- Rédige le guide en **français**, avec un vocabulaire professionnel, clair et pédagogique.
- Fournis des instructions suffisamment précises pour qu’un testeur peu expérimenté avec VoiceOver puisse les exécuter.
- Évite les formulations vagues telles que « vérifier que le composant fonctionne ».
- Utilise des actions concrètes, observables et vérifiables.
- Distingue systématiquement **l’action du testeur**, **le comportement attendu** et **le critère de validation**.
- N'invente pas de commandes VoiceOver ni de formulations vocales garanties.
- Signale les différences entre les composants web et les composants natifs.
- Privilégie les tableaux, les procédures numérotées et les checklists lorsque cela améliore la lisibilité.

# Format de restitution attendu

Commence par présenter :

1. La stratégie globale de tests.
2. La matrice des composants à évaluer.
3. Un modèle standard de fiche de test.
4. Un exemple entièrement détaillé pour le composant **Bouton**, sur macOS et iOS.

Poursuis ensuite avec les autres composants, en appliquant rigoureusement la même structure.

**Le résultat attendu est un véritable référentiel de tests d’accessibilité VoiceOver, directement exploitable par une équipe Design System, QA et développement.**