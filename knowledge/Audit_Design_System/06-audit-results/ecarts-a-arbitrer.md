# Écarts à arbitrer

> **Version mesurée :** Nodus 4.11.0, tokens du thème par défaut.
> 
> **Date :** 2026-10-30
> 
> **Statut :** relevé préliminaire de la phase 2. Ce n'est pas l'audit : aucun composant rendu n'a été évalué, et aucun token Nodus n'a été modifié.

## Méthode et limites

Les mesures viennent de [measure_tokens.py](../07-nodus-adapter/tools/measure_tokens.py). Il lit les tokens de `_primitives.css` et `_semantic.css`.

- L'APCA est une implémentation locale, vérifiée sur quatre valeurs publiées. Les chiffres définitifs devront venir du paquet `apca-w3`.
- La table de polices APCA n'est pas appliquée : les seuils réels peuvent être plus hauts pour le texte de 12 à 14 px.
- Les usages des couples sont déduits des noms de rôles. Ils seront vérifiés sur les composants.
- 70 couples mesurés, soit 35 couples dans chacun des 2 thèmes.

## Résultat principal

**16 couples sur 70 passent sous leur seuil APCA, dont 14 en sombre.** Les 10 couples de texte en échec passent tous WCAG 2 avec au moins 5,42:1, ce qui explique que le contrat actuel de Nodus ne les voie pas.

## Écarts

### E-01 — Texte en thème sombre sous les seuils APCA

|Couple|Lc mesuré|Seuil|WCAG 2|
|---|---|---|---|
|`fg-subtle` sur `bg`, `bg-elevated`|51,6 ; 50,6|60|7,76 ; 6,91|
|`primary-fg` sur `primary`, `primary-solid`|53,8|60|7,76|
|`primary` sur `bg`|51,8|60|7,76|
|`destructive` sur `bg`, `bg-elevated`|49,2 ; 48,2|60|7,23 ; 6,44|
|`destructive-on-muted` sur sa teinte|46,0|60|5,42|
|`success-on-muted` sur sa teinte|51,6|60|6,09|
|`info-on-muted` sur sa teinte|48,3|60|5,69|

- **Sévérité proposée :** P0 pour le texte courant, à confirmer selon l'usage réel.
- **Recommandation :** remonter ces rôles en sombre, en commençant par `fg-subtle` et les `*-on-muted`.

### E-02 — Focus trop discret

L'anneau `--focus-ring` applique 40 % de `--color-ring` sur la surface.

|Thème|Lc sur `bg` / `bg-elevated`|Seuil|WCAG 2 (attendu 3:1)|
|---|---|---|---|
|Clair|32,2 ; 33,6|45|1,79 ; 1,81|
|Sombre|10,4 ; 12,6|45|2,10 ; 2,15|

Il échoue aussi en WCAG 2.2, donc le défaut ne dépend pas du choix de l'APCA. `--focus-ring-field` est à 20 %, mais le contour d'un champ passe aussi à `--color-ring`.

- **Sévérité proposée :** P0.
- **Recommandation :** rendre l'anneau opaque ou ajouter un contour opaque.

### E-03 — Texte désactivé en sombre

`fg-disabled` donne Lc 15,1 et 14,1 pour un seuil de 30. En clair, il donne 47,2 et 50,2. Le clair et le sombre sont donc très déséquilibrés.

- **Sévérité proposée :** P1.
- **Recommandation :** remonter le rôle sombre d'un cran.

### E-04 — Bordures de séparation sous Lc 15

`--color-border` donne 10,4 et 13,4 en clair, 8,2 et 0,0 en sombre.

**Décision nécessaire.** Un filet discret fait partie d'une esthétique sobre, et le seuil de Lc 15 vaut pour un élément qui doit être perçu. Une bordure de carte ou de séparation peut être jugée décorative.

- **Recommandation :** classer chaque usage. Une séparation qui structure l'information garde le seuil, un filet décoratif n'en a pas.

### E-05 — Contrat de contraste limité à WCAG 2

`contrast-contract.json`, CONTRAST-1 et `core/contrast.js` ne connaissent que le ratio WCAG 2. Un contrôle au build ne verrait donc aucun des écarts E-01 à E-04, sauf E-02 si l'anneau y était déclaré.

- **Recommandation :** ajouter l'APCA à `core/contrast.js` et un seuil par usage dans le contrat. C'est la première brique de l'audit JS. Vérifier d'abord la licence de `apca-w3`.

### E-06 — Surfaces proches

|Thème|Paire|ΔE2000|L*|
|---|---|---|---|
|Clair|`bg-canvas` / `bg`|1,32|96,2 → 98,3|
|Clair|`bg` / `bg-elevated`|1,00|98,3 → 100,0|
|Clair|`bg` / `bg-muted`|1,32|98,3 → 96,2|
|Sombre|`bg-canvas` / `bg`|0,00|Identiques|
|Sombre|`bg` / `bg-elevated`|3,80|2,5 → 8,4|

L'hypothèse de ΔE2000 ≥ 2 échoue en clair. C'est plutôt l'hypothèse qui doit être calibrée, car une différence faible peut être voulue quand une bordure accompagne la surface.

- **Recommandation :** ne rien changer avant le calibrage. En sombre, décider si `bg-canvas` et `bg` doivent rester identiques.

### E-07 — Couleur principale et information identiques

`--color-primary` et `--color-info` donnent un ΔE2000 de 0 dans les deux thèmes. C'est cohérent dans le thème par défaut, mais cela contredit `THEME-07` tel qu'il est écrit.

- **Recommandation :** autoriser cette égalité pour `info`, et garder la règle pour les autres couleurs sémantiques.

### E-08 — Densité par défaut

Les boutons et champs font 40 px par défaut, et 32 px en mode compact. Le référentiel présente 32 px comme hauteur par défaut d'une interface dense.

**Décision nécessaire.** Pour viser une densité d'outil professionnel, le mode compact pourrait devenir le défaut. Cela changerait le rendu de toutes les applications consommatrices.

- **Recommandation :** garder 40 px jusqu'au calibrage, puis trancher.

### E-09 — Tailles de texte en pixels

`--text-*` et `--leading-*` sont en px. Le zoom du navigateur fonctionne, mais pas la taille de police réglée par l'utilisateur. Cela contredit `A11Y-53`.

- **Sévérité proposée :** P1.
- **Recommandation :** passer ces échelles en `rem`, en vérifiant la grille de 4 px.

### E-10 — Préférences d'affichage non gérées

Aucune occurrence de `forced-colors` ni de `prefers-contrast` dans `ui-lib`. Seuls 2 fichiers CSS de composants et les tokens gèrent `prefers-reduced-motion`.

- **Sévérité proposée :** P1 pour `forced-colors`, P2 pour `prefers-contrast`.
- **Recommandation :** mesurer d'abord le rendu réel avec les couleurs forcées.

### E-11 — Pas de test en vrai navigateur

Les tests tournent sous happy-dom. Le point A14 de l'audit d'octobre est reporté. Le focus, le contraste rendu et le clavier réel ne sont donc pas prouvés. `testing.md` plafonne ces composants à 2.

- **Recommandation :** traiter A14 avant l'audit des composants, au moins pour les niveaux 1 et 2.

### E-12 — Échelle de durées

Nodus utilise 100, 150, 300 et 500 ms. Le référentiel propose 100, 150, 200, 250 et 300 ms. Aucune étape de 200 ms n'existe, et 500 ms dépasse sa limite.

- **Recommandation :** ne rien changer avant le calibrage, puis vérifier où 500 ms est utilisé.

### E-13 — Personnalisation incomplète pour un outil de thèmes

La base est saine : couches séparées, `--radius` central, axe `data-style`, `core/contrast.js`. Il manque cependant le calcul automatique de plusieurs rôles : survol, texte sur couleur principale, `*-on-muted`. Le détail est dans [token-roles.md](../07-nodus-adapter/token-roles.md).

La génération de thèmes figure encore dans la feuille de route en exploratoire (E-3).

- **Recommandation :** remonter E-3 après la phase 3.

## Ce qui ne pose pas de problème

- **Texte courant :** `fg` et `fg-muted` dépassent leurs seuils dans tous les couples mesurés, y compris en sombre.
- **Boutons :** le texte passe sur les boutons pleins en clair, et sur les boutons destructifs dans les deux thèmes.
- **Échelle des gris :** L* progresse sans inversion de `zinc-50` à `zinc-950`.
- **États :** les survols dépassent ΔE2000 3, et les couleurs sémantiques restent bien distinctes entre elles.

## Décisions attendues

|Écart|Question|
|---|---|
|E-01|Corriger le texte sombre pour respecter les seuils APCA, ou ajuster certains seuils par usage|
|E-04|Considérer les bordures de séparation comme décoratives ou structurelles|
|E-08|Faire de la densité compacte le défaut, après calibrage|
