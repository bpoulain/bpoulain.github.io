# Section 5 — Design visuel & Design System

> Fichier théorie — aucun exercice inclus. Les exercices associés se trouvent dans le fichier `05-design-visuel-exercices.md`.

---

## Table des matières

1. [Création graphique & assets UI](#1-création-graphique--assets-ui)
2. [Exploration de styles & variantes UI](#2-exploration-de-styles--variantes-ui)
3. [Design system & tokens](#3-design-system--tokens)
4. [Responsive design & adaptabilité multi-device](#4-responsive-design--adaptabilité-multi-device)
5. [Motion design pour UX](#5-motion-design-pour-ux)
6. [Accessibilité visuelle](#6-accessibilité-visuelle)
7. [Évaluation heuristique visuelle](#7-évaluation-heuristique-visuelle)
8. [Psychologie visuelle & lois de la Gestalt](#8-psychologie-visuelle--lois-de-la-gestalt)
9. [Traduction & localisation](#9-traduction--localisation)
10. [IA appliquée au design visuel](#10-ia-appliquée-au-design-visuel)

---

## 1. Création graphique & assets UI

### Modèle mental
Les assets UI sont les briques visuelles atomiques d'une interface : chaque icône, illustration ou image de fond transmet une information ou une émotion avant même que l'utilisateur lise un mot.

### Analogie stable
Pense à une partition musicale. Chaque note (asset) a une forme précise, une durée, une intensité. Joué isolément, cela sonne, mais c'est l'ensemble orchestré qui crée l'expérience. Un asset UI sans contexte système est une note sans morceau.

### Méthodologie & Bonnes pratiques

**Icônes**
- Utiliser un style unique et cohérent sur l'ensemble du produit (outlined, filled, duotone — pas de mélange).
- Taille minimale de zone de touche : **44×44 px** (recommandation Apple/Google) pour garantir l'accessibilité tactile.
- Toujours accompagner d'un label texte quand l'icône n'est pas universellement reconnue.
- Préférer les formats vectoriels (SVG) pour l'indépendance à la résolution.

**Illustrations**
- Aligner le style illustratif avec la tonalité de la marque (flat, 3D, ligne, isométrique).
- Éviter les illustrations génériques sans âme ❌ (banques d'images clichés) — elles détériorent la confiance.
- Assurer la diversité et l'inclusion dans la représentation des personnages.

**Images de fond & photographies**
- Privilégier des images qui soutiennent le contenu plutôt que de le concurrencer.
- Contrôler le ratio signal/bruit visuel : une image de fond trop chargée noie le texte posé dessus.

**Génération d'assets via IA**
- Outils actuels : Midjourney, Adobe Firefly, DALL·E, Figma AI (Make designs).
- La génération IA accélère l'idéation mais nécessite une validation humaine systématique (cohérence brand, biais représentatifs, droits d'auteur).
- Workflow recommandé : prompt → variantes IA → sélection humaine → intégration dans le design system.

### Comparaison d'approches

| Approche | Avantages | Risques |
|---|---|---|
| Assets manuels (illustrateur) | Cohérence brand maximale, originalité | Coût élevé, délais longs |
| Bibliothèques d'icônes (Heroicons, Material) | Rapidité, accessibilité | Perte de différenciation brand |
| Génération IA | Rapidité d'idéation, variété | Biais, incohérence style, droits flous |
| Mix (base IA + finition manuelle) | Équilibre coût/qualité | Risque d'incohérence si mal cadré |

### Correction modèle mental

❌ **Idée reçue** : "Des icônes jolies suffisent, le style n'a pas d'importance du moment que c'est beau."
✅ **Approche correcte** : La cohérence de style est plus importante que la beauté individuelle de chaque asset. Un mélange de styles crée une friction cognitive inconsciente qui détériore la confiance.
**KPI impacté** : SUS (perception cohérence), taux de confiance (NPS), task success rate.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| SUS — perception de cohérence | Taux de conversion (confiance visuelle) |
| Taux d'erreur de reconnaissance (icônes) | Rétention (brand recall) |
| Eye-tracking — attention sur l'image vs le CTA | Coût de support (confusion évitée) |

### Points éthiques & inclusivité
- Représenter la diversité (âge, genre, origine, handicap) dans les illustrations et photos sans tomber dans le "tokenisme" symbolique.
- Les assets générés par IA reproduisent les biais des données d'entraînement — validation humaine obligatoire.
- Éviter les images qui renforcent des stéréotypes culturels ou de genre.

---

## 2. Exploration de styles & variantes UI

### Modèle mental
Explorer des styles visuels, c'est tester des hypothèses esthétiques avant de s'engager. C'est moins une question de goût personnel et plus une question d'alignement entre l'émotion transmise et les attentes de l'audience cible.

### Analogie stable
Comme un architecte qui produit trois esquisses avant de dessiner les plans définitifs. Chaque esquisse explore une direction (minimaliste, expressive, institutionnelle) pour converger vers la bonne après validation.

### Méthodologie & Bonnes pratiques

**Moodboarding**
1. Collecter 15-25 références visuelles en accord avec les valeurs de marque (Dribbble, Behance, Mobbin, Pinterest).
2. Identifier les patterns communs : couleurs dominantes, typographies, espacement, ton photographique.
3. Presenter aux parties prenantes pour validation avant de produire quoi que ce soit.

**Style tiles**
- Alternative légère aux moodboards : montrer typographies + palettes + quelques composants sans dessiner un écran entier.
- Permettent de valider la direction visuelle sans investir dans un prototype complet.

**Brand guidelines & cohérence**
- Les guidelines de marque (logo, couleurs primaires, typographies officielles) sont des contraintes non négociables.
- Le rôle du designer UX est d'opérationnaliser ces guidelines dans des composants concrets.
- Divergence entre maquette et guidelines = dette de design à rembourser plus tard.

**Thèmes (dark mode, high contrast)**
- Prévoir systématiquement un mode sombre depuis la conception — pas comme un afterthought.
- Les tokens de design (voir section 3) sont l'outil qui rend ce basculement possible sans tout recréer.

### Comparaison d'approches

| Méthode | Rapidité | Fidélité | Idéal pour |
|---|---|---|---|
| Moodboard | Haute | Basse | Phase d'idéation, alignement stakeholders |
| Style tiles | Moyenne | Moyenne | Validation direction sans écrans |
| Prototype mockup complet | Basse | Haute | Présentation client, tests utilisateurs |
| Design system existant | Très haute | Très haute | Produits existants avec base établie |

### Correction modèle mental

❌ **Idée reçue** : "Suivre les tendances design garantit une bonne expérience utilisateur."
✅ **Approche correcte** : Les tendances peuvent convenir ou non à votre audience spécifique. Un style "glassmorphism" peut paraître moderne sur un produit fintech premium et totalement inadapté sur une application médicale destinée à des seniors.
**KPI impacté** : NPS (adéquation émotionnelle), taux de rebond (première impression).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| First impression score (tests 5 secondes) | Taux de rebond première visite |
| Brand recognition rate | Taux de conversion (confiance initiale) |
| SUS — cohérence perçue | Coût de rebranding évité |

### Points éthiques & inclusivité
- Ne pas choisir des styles visuels qui excluent implicitement certains groupes (ex : esthétique ultra-jeune pour un service grand public).
- Tester les explorations visuelles avec des utilisateurs représentatifs, pas seulement avec l'équipe produit.

---

## 3. Design system & tokens

### Modèle mental
Un design system est la grammaire visuelle et fonctionnelle d'un produit : il définit les règles partagées qui permettent à des dizaines de personnes de produire des interfaces cohérentes sans se parler en permanence.

### Analogie stable
Pense à un jeu de Lego. Les briques (composants) ont des dimensions précises qui garantissent l'assemblage — peu importe qui les utilise. Les tokens sont les dimensions elles-mêmes : couleur, taille, espacement. Sans ces dimensions standards, les briques ne s'emboîteraient plus.

### Méthodologie & Bonnes pratiques

**Architecture d'un design system**

```
Design Tokens (valeurs atomiques)
    ↓
Primitives (couleur brute, taille brute)
    ↓
Tokens sémantiques (color-primary, spacing-large)
    ↓
Composants (Button, Card, Input)
    ↓
Patterns (formulaire, navigation, page layout)
    ↓
Templates (écrans types)
```

**Design tokens**
- Les tokens sont des paires clé/valeur nommées de façon sémantique : `color-background-primary`, `spacing-md`, `font-size-body`.
- Ils permettent de changer toute la palette d'un produit en modifiant une seule source de vérité.
- Outils : Style Dictionary, Theo, Figma Variables, Tokens Studio.

**Composants**
- Chaque composant doit documenter : ses états (default, hover, focus, disabled, error), ses variantes, ses contraintes d'usage.
- Atomic Design (Brad Frost) : atomes → molécules → organismes → templates → pages.
- Ne pas créer un nouveau composant si un existant peut être étendu.

**Versioning du design system**
- Adopter un versioning sémantique (MAJOR.MINOR.PATCH) : 2.1.0.
- Un MAJOR bump = rupture de compatibilité → communication obligatoire aux équipes.
- Maintenir un changelog accessible.

**Gouvernance**
- Définir qui peut proposer un nouveau composant, qui valide, qui documente.
- Sans gouvernance, le design system se fragmente en "snowflakes" (composants one-off) ❌.

### Comparaison d'approches

| Niveau de maturité | Description | Risque principal |
|---|---|---|
| Absence de design system | Chaque écran inventé from scratch | Incohérence massive, coût de maintenance élevé |
| Bibliothèque de composants non documentée | Assets partagés sans règles | "Graveyard" de composants inutilisés |
| Design system documenté sans tokens | Cohérence visuelle mais refactoring coûteux | Thèmes impossibles, dark mode difficile |
| Design system avec tokens | Source de vérité unique, thèmes faciles | Complexité initiale de setup |
| Design system multi-brand | Plusieurs marques sur une base commune | Gouvernance lourde si mal structurée |

### Correction modèle mental

❌ **Idée reçue** : "Un design system, c'est juste une bibliothèque de composants Figma."
✅ **Approche correcte** : Un design system comprend la documentation des règles d'usage, les tokens, les guidelines d'accessibilité, le processus de contribution et de versioning. Sans ces couches, c'est une sticker sheet, pas un système.
**KPI impacté** : Vélocité de l'équipe (temps de mise sur le marché), taux de cohérence visuelle (audits), coût de maintenance.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Score de cohérence (audit heuristique) | Vélocité de production (sprints) |
| Taux d'erreur UI (composant mal utilisé) | Coût de refontes évitées |
| Accessibilité rate (WCAG) | Time to market |
| SUS — facilité d'apprentissage | Dette technique réduite |

### Points éthiques & inclusivité
- Intégrer les critères d'accessibilité (contrastes, tailles min, focus visible) directement dans les composants — ne pas laisser cela à la discrétion de chaque designer.
- Documenter explicitement les états disabled, error et focus pour tous les composants interactifs.
- Un design system sans considérations d'accessibilité encode l'exclusion à l'échelle.

---

## 4. Responsive design & adaptabilité multi-device

### Modèle mental
Le responsive design, ce n'est pas "réduire un écran desktop sur mobile". C'est repenser la priorité de l'information pour chaque contexte d'usage, en sachant que les contextes (mobilité, attention fragmentée, tactile vs souris) sont fondamentalement différents.

### Analogie stable
Un journal imprimé et son application mobile traitent la même information mais différemment : le journal déploie en pleine page, l'app mobile empile en colonnes scrollables, en-tête condensé, navigation par gestes. Le contenu est le même, la structure s'adapte au contenant et à l'usage.

### Méthodologie & Bonnes pratiques

**Mobile-first vs Desktop-first**
- Mobile-first ✅ : concevoir d'abord le mobile (contrainte maximale) puis enrichir pour les grands écrans. Oblige à prioriser le contenu essentiel.
- Desktop-first ❌ (dans la plupart des cas) : tends à créer des interfaces trop denses sur mobile, la démarche de "réduction" conduit à cacher du contenu plutôt qu'à le repenser.

**Breakpoints**
- Ne pas définir des breakpoints par device (iPhone X, iPad Pro) mais par comportement du contenu.
- Breakpoints courants : 320px, 768px, 1024px, 1440px — mais le vrai critère est : "à partir de quel moment le contenu se casse-t-il ?".

**Grille & espacement**
- Utiliser des grilles fluides (%, fr, vw) plutôt que fixes (px) pour les contenants.
- Les marges et paddings doivent suivre une échelle cohérente issue des tokens.

**Touch targets**
- Zone de touche minimale : 44×44 px (iOS), 48×48 dp (Android).
- Espacement minimum entre deux éléments tactiles : 8 px.

**Navigation adaptive**
- Desktop : navigation horizontale, mega menus admissibles.
- Mobile : bottom navigation bar (pouce), hamburger seulement si le nombre d'items le justifie (5+).

**Contenu adaptatif**
- Certains contenus peuvent être masqués sur mobile si non essentiels — mais jamais des informations critiques.
- Progressive disclosure : afficher l'essentiel, permettre d'accéder au reste.

### Comparaison d'approches

| Stratégie | Description | Contexte adapté |
|---|---|---|
| Responsive (CSS fluide) | Même HTML, CSS adaptatif | Majorité des cas |
| Adaptive (serveurs distincts) | HTML/CSS différents par device | Très haute performance, expériences distinctes |
| Mobile-first | Conception partant du mobile | Audiences majoritairement mobile |
| Progressive Web App (PWA) | Web avec comportements natifs | Engagement mobile sans app store |

### Correction modèle mental

❌ **Idée reçue** : "Le responsive design se résume à des media queries CSS, c'est un problème de développeur."
✅ **Approche correcte** : Le responsive design est une décision de priorisation de contenu et de navigation, prise au stade de la conception. Si le designer ne pense pas responsive dès le wireframe, le développeur devra inventer des solutions sans direction claire.
**KPI impacté** : Taux de rebond mobile, taux de complétion de tâche sur mobile, Core Web Vitals (CLS).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux de complétion de tâche (mobile vs desktop) | Taux de conversion mobile |
| Taux de rebond mobile | Part de trafic mobile monétisée |
| Core Web Vitals (CLS, LCP) | SEO (Google Mobile-First Index) |
| Error rate sur formulaires mobile | Abandon panier mobile |

### Points éthiques & inclusivité
- Les utilisateurs en situation de handicap moteur (motricité fine réduite) bénéficient directement des grandes zones de touche.
- Prévoir le mode portrait ET paysage — certains utilisateurs ne peuvent pas changer l'orientation de leur appareil.
- Les zones rurales ou pays à faible connectivité utilisent majoritairement le mobile sur réseau bas débit : la performance est une question d'accessibilité.

---

## 5. Motion design pour UX

### Modèle mental
Les animations fonctionnelles ne décorent pas l'interface, elles l'expliquent. Chaque transition ou micro-interaction bien conçue réduit la charge cognitive en rendant visible ce qui se passe dans le système.

### Analogie stable
Pense au mécanicien horloger : les aiguilles d'une montre ne "bougent pas pour être jolies", elles communiquent le temps de façon continue et compréhensible. Une animation UI doit, comme l'aiguille, avoir une raison fonctionnelle précise.

### Méthodologie & Bonnes pratiques

**Les 4 fonctions de l'animation UX**
1. **Orientation spatiale** : montrer d'où vient un élément et où il va (transitions de navigation).
2. **Feedback d'état** : confirmer qu'une action a été reçue (bouton qui pulse, loader).
3. **Attente confortable** : masquer la latence perçue (skeleton screens, progress bars).
4. **Guidage attentionnel** : diriger l'oeil vers l'information prioritaire.

**Micro-interactions (Dan Saffer)**
Structure d'une micro-interaction :
- Déclencheur (trigger) → Règles (what happens) → Feedback (communication) → Boucles & Modes (récurrence).

**Principes de timing**
- Durées de référence : 100-300ms pour les micro-interactions, 300-600ms pour les transitions d'écran.
- Au-delà de 500ms pour une simple animation de bouton → ressenti comme lent ❌.
- Utiliser des courbes d'easing naturelles (ease-in-out) plutôt que linéaires (mécanique, artificiel).

**Réduction de mouvement (prefers-reduced-motion)**
- Toujours prévoir une version sans animation pour les utilisateurs souffrant de vestibulaires ou d'épilepsie photosensible.
- C'est une obligation d'accessibilité, pas une option.

### Comparaison d'approches

| Type d'animation | Fonction | Erreur fréquente |
|---|---|---|
| Transition de page | Orienter spatialement | Trop longue → frustration |
| Skeleton screen | Réduire attente perçue | Absent → interface perçue comme lente |
| Micro-interaction (hover, click) | Feedback tactile/visuel | Absente → interface morte, froide |
| Animation décorative | Enrichissement émotionnel | Envahissante → distraction, surcharge |
| Parallax scrolling | Profondeur narrative | Nausée, désorientation ❌ si excessif |

### Correction modèle mental

❌ **Idée reçue** : "Plus il y a d'animations, plus l'interface paraît premium."
✅ **Approche correcte** : Une animation non fonctionnelle est du bruit visuel. L'animation premium est celle qui est invisible en tant qu'animation et perçue uniquement comme une interface fluide et naturelle.
**KPI impacté** : Temps de complétion de tâche, taux de satisfaction (SUS), taux d'abandon (animation bloquante).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Latence perçue (vs latence réelle) | Taux de rétention (plaisir d'usage) |
| SUS — fluidité perçue | Engagement (durée session) |
| Taux d'erreur (feedback insuffisant) | Coût de support (confusion évitée) |
| Accessibilité (prefers-reduced-motion) | Inclusion (utilisateurs avec vestibulaires) |

### Points éthiques & inclusivité
- Implémenter systématiquement `prefers-reduced-motion` — ignorer ce paramètre peut provoquer des malaises physiques réels (étourdissements, nausée, crises).
- Les animations "auto-play" sans contrôle utilisateur sont une dark pattern ❌ — WCAG 2.1 impose un mécanisme de pause.
- Éviter les animations qui créent une urgence artificielle (compte à rebours, badge clignotant) — manipulation émotionnelle ❌.

---

## 6. Accessibilité visuelle

### Modèle mental
L'accessibilité visuelle n'est pas un add-on de fin de projet. C'est une contrainte de conception qui, bien intégrée dès le début, améliore l'expérience de tous — y compris les utilisateurs sans handicap (lecture en plein soleil, fatigue oculaire, vieillissement).

### Analogie stable
Les bateaux abaissés sur les trottoirs (trottoirs abaissés) ont été conçus pour les fauteuils roulants. Résultat : ils servent aussi les parents avec poussettes, les livreurs avec chariots, les cyclistes. L'accessibilité pour 10% améliore l'expérience des 100%.

### Méthodologie & Bonnes pratiques

**Contrastes WCAG**

| Niveau | Texte normal | Texte large (18pt+ ou 14pt bold) | Composants UI & graphiques |
|---|---|---|---|
| WCAG AA (minimum) | 4.5:1 | 3:1 | 3:1 |
| WCAG AAA (optimal) | 7:1 | 4.5:1 | N/A (recommandé) |

- Outils de vérification : Stark (Figma plugin), Colour Contrast Analyser, WebAIM Contrast Checker.
- Ne jamais placer du texte directement sur une image sans overlay semi-opaque.

**Typographies accessibles**
- Taille minimale corps de texte : 16px (pas 12px ou 14px en mobile ❌).
- Hauteur de ligne (line-height) : minimum 1.5× la taille de police pour les paragraphes.
- Éviter les polices trop fines (weight 100-300) pour le corps de texte.
- Longueur de ligne idéale : 60-80 caractères par ligne (lisibilité optimale).

**Types de déficiences visuelles à couvrir**
- Daltonisme (8% des hommes) : ne jamais utiliser la couleur seule comme unique vecteur d'information.
- Basse vision : support du zoom navigateur jusqu'à 200% sans perte de fonctionnalité.
- Cécité : lisibilité par lecteur d'écran (ordre du DOM, alt texts, aria-labels) — même si cela dépasse le strictement "visuel".

**Simulations IA d'accessibilité**
- Des outils comme Stark, Adobe Firefly Accessibility, et les nouvelles fonctions Figma AI peuvent simuler l'apparence de l'interface pour différents types de daltonisme (deutéranopie, protanopie, tritanopie).
- Ces simulations permettent de détecter les problèmes en amont, avant les tests avec de vrais utilisateurs.
- Limitation : la simulation IA ne remplace pas les tests avec des utilisateurs réels ayant des déficiences visuelles.

### Comparaison d'approches

| Moment d'intégration | Impact | Coût |
|---|---|---|
| Dès les tokens (couleurs, typo) | Maximal — tout est accessible by design | Faible |
| Au stade des composants | Bon — mais peut nécessiter des ajustements | Moyen |
| En fin de projet (audit) | Limité — corrections coûteuses, compromis | Élevé |
| Jamais | Interface excluante, risque légal | Très élevé (long terme) |

### Correction modèle mental

❌ **Idée reçue** : "L'accessibilité visuelle concerne uniquement les personnes aveugles ou malvoyantes."
✅ **Approche correcte** : Le WCAG couvre aussi les contrastes insuffisants (visibles par tous dans de mauvaises conditions lumineuses), les tailles de texte (lisibilité générale), et les mécanismes de focus (navigation clavier utile à des millions d'utilisateurs non handicapés).
**KPI impacté** : SUS (lisibilité), taux de complétion de formulaires, taux d'abandon (friction visuelle), risque légal (loi RGAA/ADA).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Score WCAG AA/AAA (audit) | Conformité légale (RGAA, ADA) |
| Taux d'erreur sur formulaires | Taux de complétion (lisibilité améliorée) |
| SUS — satisfaction visuelle | Marché élargi (15% de la population avec handicap) |
| Taux de zoom navigateur utilisé | Coût d'audit/correction évité |

### Points éthiques & inclusivité
- En France, le RGAA rend l'accessibilité obligatoire pour les services publics et recommandée pour le privé.
- L'inaccessibilité est une forme de discrimination — "c'était trop complexe à implémenter" ne constitue pas une justification éthiquement acceptable.
- Les populations âgées (presbytie, basse vision) représentent un marché majeur souvent négligé par des équipes produit jeunes.

---

## 7. Évaluation heuristique visuelle

### Modèle mental
L'évaluation heuristique visuelle est un audit systématique de l'interface par rapport à des principes établis. Elle ne remplace pas les tests utilisateurs mais permet de détecter rapidement des problèmes sans recruter de participants.

### Analogie stable
Un correcteur orthographique ne remplace pas un lecteur humain, mais il détecte des catégories d'erreurs prévisibles en quelques secondes. L'évaluation heuristique est le "correcteur orthographique" du design visuel.

### Méthodologie & Bonnes pratiques

**Les 10 heuristiques de Nielsen appliquées au visuel**

| Heuristique | Application visuelle | Signal d'alerte |
|---|---|---|
| 1. Visibilité du statut | Feedback visuel des états (chargement, erreur, succès) | Absence d'état disabled, pas de loader |
| 2. Correspondance monde réel | Iconographie reconnaissable, métaphores visuelles | Icône ambiguë sans label |
| 3. Contrôle & liberté | Boutons retour visibles, annulation accessible | CTA destructif sans confirmation |
| 4. Cohérence & standards | Composants homogènes, patterns connus | Bouton primaire de 3 couleurs différentes |
| 5. Prévention des erreurs | Champs clairement labellisés, formats indiqués | Placeholder seul (disparaît à la saisie) ❌ |
| 6. Reconnaissance plutôt que rappel | Navigation visible, état actif clair | Menu caché, fil d'Ariane absent |
| 7. Flexibilité & efficacité | Raccourcis visuels pour utilisateurs avancés | Interface identique novices/experts |
| 8. Esthétique & minimalisme | Hiérarchie visuelle claire, contenu sans bruit | Information tertiaire en taille identique au titre |
| 9. Gestion des erreurs | Messages d'erreur clairs, en couleur + icône | Message "Erreur 500" sans explication ❌ |
| 10. Aide & documentation | Tooltips contextuels, empty states informatifs | Page blanche sans guidance |

**Cohérence graphique**
- Aligner l'espacement, les arrondis, les ombres sur les tokens définis.
- Utiliser un nombre limité de niveaux de typographie (H1, H2, H3, Body, Caption, Label — maximum 6).

**Hiérarchie visuelle**
- Une et une seule action principale par écran (CTA primaire).
- F-pattern et Z-pattern pour prédire le parcours oculaire.
- Le principe de Fitts : plus une cible est grande et proche, plus elle est facile à atteindre.

**Audit IA pour vérification du design system**
- Outils : Figma Plugins (Design Lint, Similayer), systèmes d'audit automatisé comme Linting CSS-in-JS.
- L'IA peut scanner des centaines d'écrans pour détecter les déviances par rapport aux tokens définis (couleur hors palette, espacement incorrect, police non repertoriée).
- Workflow : export des écrans → analyse IA → rapport de déviances → corrections → re-audit.
- Limitation : l'IA détecte les anomalies techniques mais pas les problèmes de sens ou de contexte.

### Correction modèle mental

❌ **Idée reçue** : "Si c'est beau, c'est utilisable."
✅ **Approche correcte** : L'esthétique et l'usabilité sont corrélées (effet d'esthétique-utilisabilité de Masaaki Kurosu) mais non équivalentes. Une interface belle mais incohérente ou illisible dégrade l'expérience. La beauté peut masquer temporairement les problèmes mais pas les éliminer.
**KPI impacté** : Taux d'erreur, task success rate, taux de complétion, SUS.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Score heuristique (nombre de violations) | Temps de développement economisé (détection précoce) |
| SUS — cohérence perçue | Coût de refonte évité |
| Taux d'erreur utilisateur | Taux de conversion |
| Score d'accessibilité | Conformité légale |

### Points éthiques & inclusivité
- L'évaluation heuristique doit être complétée par des tests avec des utilisateurs réels et représentatifs — les experts ont des biais.
- Un design "correct" selon les heuristiques peut rester excluant si les utilisateurs cibles n'ont pas été impliqués dans la conception.
- Signaler explicitement les dark patterns détectés lors de l'audit (confirm-shaming, roach motels, trick questions) ❌.

---

## 8. Psychologie visuelle & lois de la Gestalt

### Modèle mental
Les lois de la Gestalt décrivent comment le cerveau humain groupe automatiquement les éléments visuels. Comprendre ces lois permet de concevoir des interfaces dont la structure visuelle est évidente sans effort conscient de la part de l'utilisateur.

### Analogie stable
Notre cerveau est un "détecteur de patterns" qui cherche à compléter et organiser l'information même quand elle est incomplète. Comme un puzzle : on reconnaît l'image avant d'avoir posé toutes les pièces. Le design visuel exploite cette tendance naturelle.

### Méthodologie & Bonnes pratiques

**Les 6 lois de la Gestalt appliquées à l'UI**

| Loi | Principe | Application UI | Erreur fréquente |
|---|---|---|---|
| Proximité | Les éléments proches semblent liés | Grouper label + champ, titre + sous-titre | Label trop éloigné du champ associé |
| Similarité | Les éléments semblables semblent liés | Même style pour tous les CTAs secondaires | Bouton primaire visuellement identique au secondaire |
| Continuité | L'oeil suit les lignes et courbes | Carrousels, sliders, indicateurs de progression | Rupture visuelle non intentionnelle dans un flow |
| Fermeture | Le cerveau complète les formes incomplètes | Icônes partielles encore reconnaissables, cartes coupées pour signifier le scroll | Éléments trop fragmentés pour être compris |
| Figure-fond | Distinction entre sujet et arrière-plan | Modales sur overlay, tooltips détachés du fond | Fond et contenu de contraste insuffisant |
| Prégnance (simplicité) | Le cerveau préfère les formes simples | Icônes épurées, compositions minimalistes | Surcharge visuelle, trop d'éléments de même poids |

**Perception des couleurs**
- Les couleurs ont des connotations culturelles non universelles (le rouge = danger en Occident, bonheur en Chine).
- Les associations fonctionnelles doivent être établies explicitement dans le design system, pas supposées.
- Hiérarchie chromatique : une couleur primaire d'action, une secondaire, des neutres. Au-delà de 3-4 couleurs dans une interface = bruit visuel.

**Hiérarchie visuelle par les contrastes**
- Taille → la plus importante des différenciations.
- Poids (bold vs regular) → structure les niveaux de lecture.
- Couleur → attire l'attention sur l'essentiel.
- Espace blanc → isole et valorise les éléments importants.

**F-pattern & Z-pattern**
- F-pattern : typique de la lecture dense (listes, articles). Les éléments importants en haut et à gauche.
- Z-pattern : typique des interfaces légères (landing pages). Les éléments clés aux 4 coins du Z.

### Correction modèle mental

❌ **Idée reçue** : "Il faut remplir l'espace blanc — un écran vide semble inachevé."
✅ **Approche correcte** : L'espace blanc (whitespace) est un élément de design actif qui améliore la lisibilité, crée de la hiérarchie et donne de la respiration. Les interfaces les plus premium (Apple, Notion) l'utilisent comme outil principal.
**KPI impacté** : SUS (lisibilité), eye-tracking (scan speed), taux de compréhension du message.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Eye-tracking — vitesse de scan | Taux de conversion (CTA visible) |
| First click accuracy | Taux de mémorisation brand |
| SUS — clarté perçue | Engagement (temps passé) |
| Taux de compréhension (tests 5s) | Réduction du coût de support |

### Points éthiques & inclusivité
- Les connotations de couleur sont culturellement situées — concevoir pour une audience internationale exige une validation locale.
- Les personnes daltoniennes ne perçoivent pas les contrastes chromatiques de la même façon — la hiérarchie visuelle ne doit pas reposer uniquement sur la couleur.
- Éviter les compositions qui créent une hiérarchie implicite défavorable à certains groupes (ex : représentations de personnes associées à des rôles stéréotypés).

---

## 9. Traduction & localisation

### Modèle mental
La localisation ne se limite pas à traduire des mots. C'est l'adaptation de l'ensemble de l'expérience — mise en page, images, couleurs, formats de date, sens de lecture — à la culture cible.

### Analogie stable
Traduire une interface, c'est comme adapter un film pour une autre culture : le doublage change les mots, mais l'adaptation culturelle change aussi les blagues, les références, et parfois le montage. Une traduction mot à mot produit un "sous-titrage mécanique", pas une expérience localisée.

### Méthodologie & Bonnes pratiques

**Niveaux de localisation (i18n vs L10n)**

| Niveau | Description | Exemple |
|---|---|---|
| Internationalisation (i18n) | Préparer le code/design à recevoir différentes langues | Laisser de l'espace pour l'expansion textuelle |
| Localisation (L10n) | Adapter le contenu à une culture spécifique | Changer les images, formats de date, monnaie |
| Traduction | Convertir le texte d'une langue à l'autre | "Submit" → "Envoyer" |

**Expansion textuelle**
- L'allemand est en moyenne 30-40% plus long que l'anglais. L'arabe peut être 25% plus court.
- Prévoir des boutons et labels flexibles — ne jamais fixer une largeur de bouton en px si le texte est traduit.
- Les interfaces avec des textes courts en anglais "explosent" visuellement en allemand si le responsive n'est pas prévu.

**Sens de lecture**
- Langues RTL (Right-to-Left) : arabe, hébreu, farsi.
- L'ensemble de la mise en page doit être mirorée : navigation, icônes directionnelles, ordre des colonnes.
- Les frameworks modernes (CSS logical properties) facilitent ce basculement.

**Formats locaux**
- Dates : MM/DD/YYYY (US) vs DD/MM/YYYY (Europe) vs YYYY-MM-DD (ISO).
- Nombres : 1,000.00 (US) vs 1 000,00 (France).
- Devises, unités de mesure, adresses postales.

**Images & pictogrammes**
- Une main faisant un signe "OK" (pouce levé) est offensante dans certaines cultures.
- Valider les images avec des représentants de la culture cible.

### Correction modèle mental

❌ **Idée reçue** : "On fera la traduction en post-production, c'est juste du texte à changer."
✅ **Approche correcte** : La localisation doit être anticipée dès la conception (espace flexible, sens de lecture, images neutres culturellement). Une interface conçue sans i18n en tête nécessite souvent une refonte partielle coûteuse pour être localisée.
**KPI impacté** : Coût de développement (refonte évitée), taux d'adoption dans les marchés cibles, taux de satisfaction locale.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| SUS par marché (satisfaction locale) | Taux de conversion par région |
| Taux d'erreur sur formulaires (format) | Coût de localisation (conception préparée) |
| NPS par culture | Taille de marché accessible |
| Taux d'abandon (incompréhension) | Time to market par région |

### Points éthiques & inclusivité
- La localisation respecte la dignité culturelle des utilisateurs. Une interface mal localisée transmet un message implicite : "vous n'êtes pas notre vrai marché."
- Impliquer des représentants des cultures cibles dans les tests — pas seulement des traducteurs.
- Attention aux biais des outils de traduction automatique sur des langues à faible représentation dans les données d'entraînement.

---

## 10. IA appliquée au design visuel

### Modèle mental
L'IA dans le design visuel agit comme un assistant rapide de niveau intermédiaire : excellente pour générer des options à explorer, détecter des incohérences systémiques et accélérer les tâches répétitives. Elle ne remplace pas le jugement créatif et stratégique du designer.

### Analogie stable
L'IA est le chargé de production qui peut préparer 20 variations de mise en page en 10 minutes pour que le directeur artistique en sélectionne et affine 3. Sans le DA, les 20 variations n'ont aucun sens stratégique. Sans le chargé de prod, le DA passe sa journée à copier-coller.

### Cas d'usage IA par domaine

| Domaine | Outils actuels (2025) | Valeur ajoutée | Limite |
|---|---|---|---|
| Génération d'assets (images, icônes) | Midjourney, Adobe Firefly, DALL·E 3, Figma AI | Idéation rapide, déclinaisons | Style incohérent si non guidé, biais |
| Suggestions de layout | Figma AI (Make designs), Uizard, Galileo AI | Wireframes rapides depuis un brief texte | Manque de compréhension du contexte métier |
| Tests d'accessibilité assistés | Stark AI, axe DevTools, Wave | Détection automatique des violations WCAG | Ne couvre pas tous les cas edge |
| Audit de cohérence design system | Figma Design Lint, Zeroheight AI | Détection des déviances de tokens | Faux positifs si le system est mal documenté |
| Simulation daltonisme | Figma Sim Daltonism plugin, Stark | Aperçu visuel pour 8 types de daltonisme | Simulation, pas test réel |
| Copyrighting & microcopy | Claude, GPT-4, Gemini | Variantes de texte rapides | Manque de contexte brand et ton |
| Prédiction comportementale | Attention Insight, EyeQuant | Heatmaps prédictives avant test | Modèle statistique, pas comportement réel |

### Bonnes pratiques d'intégration IA

1. **Définir le rôle de l'IA dans le workflow** : idéation, production, validation ou audit ? Chaque rôle a ses outils et ses limites.
2. **Toujours valider humainement** : les outputs IA sont des propositions, pas des décisions.
3. **Documenter les prompts** : les prompts efficaces sont des actifs réutilisables. Les versionner comme du code.
4. **Vérifier les biais** : les modèles de génération d'image ont des biais documentés (surreprésentation de certains types physiques, sous-représentation de certains groupes).
5. **Ne pas dépendre de l'IA pour la créativité stratégique** : le positionnement visuel, le ton de marque, les choix d'exclusion sont des décisions humaines.

### Correction modèle mental

❌ **Idée reçue** : "L'IA va remplacer les designers visuels."
✅ **Approche correcte** : L'IA automatise les tâches de production répétitives et accelere l'idéation. Elle déplace la valeur du designer vers la direction créative, la critique, la stratégie visuelle et la compréhension des utilisateurs — compétences que l'IA ne possède pas.
**KPI impacté** : Vélocité de l'équipe, qualité des outputs (si mal guidée, la qualité baisse), coût de production.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Vélocité design (écrans/sprint) | Coût de production réduit |
| Cohérence design system (audit automatisé) | Time to market |
| Score accessibilité (détection précoce) | ROI UX (économies sur corrections tardives) |
| Satisfaction équipe design | Innovation (temps libéré pour stratégie) |

### Points éthiques & inclusivité
- Les modèles IA ont des biais documentés qui peuvent renforcer les inégalités si les outputs ne sont pas validés.
- La propriété intellectuelle des assets générés par IA est encore floue légalement — se renseigner avant utilisation commerciale.
- Transparence envers les utilisateurs : certains produits doivent indiquer quand des visuels sont générés par IA (secteurs santé, information, juridique).
- L'IA ne doit pas être utilisée pour contourner les règles d'accessibilité — "l'IA a validé" n'est pas un standard légal.

---

## Synthèse des KPIs de la Section 5

| Concept | KPI UX principal | KPI Business principal |
|---|---|---|
| Assets UI | SUS cohérence | Taux de conversion |
| Styles & variantes | First impression score | Taux de rebond |
| Design system | Score cohérence audit | Vélocité production |
| Responsive design | Complétion tâche mobile | Conversion mobile |
| Motion design | Latence perçue | Rétention |
| Accessibilité visuelle | Score WCAG | Conformité légale / marché élargi |
| Heuristiques visuelles | Taux d'erreur | Coût de refonte évité |
| Psychologie visuelle | Eye-tracking scan speed | Taux de conversion CTA |
| Localisation | SUS par marché | Taille de marché accessible |
| IA design | Vélocité équipe | ROI UX |

---

> Prochain fichier : `06-prototypage-validation-theorie.md` — Tests utilisateurs, A/B testing, analytics et optimisation continue.
