# Fiches de score des composants

> **Statut :** modèle vide. Aucun composant n'a encore été évalué.

## Règles

- Chaque dimension est notée de 0 à 4. N/A si elle ne s'applique pas, Inconnu si le contrôle n'a pas été fait.
- Score sur 100 : somme des `poids × note / 4 × 100`. Les dimensions N/A sont retirées, et les poids restants sont ramenés à 100 %.
- Tout P0 ouvert bloque le statut stable, quel que soit le score.
- L'accessibilité suit la règle de plafond de `05-technical-quality/accessibility.md`.
- Une note sans preuve est remplacée par Inconnu.

Ces règles reprennent les poids de `03-component-quality/component-audit-template.md`. Elles restent provisoires jusqu'à l'échelle unique prévue en phase 3.

## Vue d'ensemble

|Composant|Niveau|Score /100|P0|P1|Inconnus|Statut|Date|
|---|---|---|---|---|---|---|---|

## Modèle de fiche

### [Composant]

|Dimension|Poids|Note|Preuve|
|---|---|---|---|
|Alignement sur les principes|10 %|||
|Qualité visuelle|15 %|||
|Tokens|10 %|||
|API|10 %|||
|Complétude|10 %|||
|Interaction|10 %|||
|Intégration au framework|10 %|||
|Accessibilité|10 %|||
|Performance|5 %|||
|Tests et documentation|10 %|||

- Anomalies liées :
- Contrôles non exécutés :
- Décision : bloqué / conditionnel / validé
