# Section 5 — Design visuel & Design System — Exercices

> Fichier d'exercices avec corrections. Chaque concept est travaillé sur trois niveaux : traduction mentale, détection de piège, et mini-cas réel avec dimension éthique et inclusive.

---

## Concept 1 — Design System & Tokens

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Une équipe produit t'explique qu'elle regroupe toutes ses couleurs, typographies et espacements dans un fichier Figma partagé appelé "bibliothèque de styles". La designer senior dit : "C'est notre design system."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Une bibliothèque de styles Figma est-elle suffisante pour constituer un design system ? Qu'est-ce qui pourrait manquer dans cette approche, et pourquoi cela aurait-il un impact sur l'expérience utilisateur finale ?

---

#### Exercice 2 — Piège de paradigme

L'équipe d'une fintech lance une refonte. Pour aller vite, chaque designer crée ses propres composants : un bouton "Valider" existe en 6 variantes différentes (taille, couleur, arrondi) selon les écrans. Le Product Manager se félicite : "On a de la variété, ça évite la monotonie !"

**Extrait du livrable :**
- Écran d'onboarding : bouton bleu #1A73E8, radius 8px, padding 12/24
- Écran de paiement : bouton vert #28A745, radius 4px, padding 10/20
- Écran de profil : bouton bleu #0066FF, radius 12px, padding 14/28

**Question :** Qu'est-ce qui ne va pas ici ? Identifie les problèmes UX et les impacts business. Quels KPIs seraient affectés et pourquoi ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Designer chez une startup EdTech qui développe une plateforme d'apprentissage pour des lycéens de 15 à 18 ans, incluant des élèves ayant des troubles Dys (dyslexie, dyspraxie). La plateforme existe depuis 2 ans avec une interface construite "à la main" par plusieurs prestataires successifs. Le taux d'abandon en cours de module atteint 47 %. La CPO veut lancer un design system.

**Dimension éthique et inclusive :** La plateforme accueille 12 % d'élèves ayant des besoins spécifiques. Certains enseignants signalent que leurs élèves Dys abandonnent les exercices interactifs deux fois plus vite que les autres.

**Questions :**

1. Décris ton modèle mental AVANT de commencer : comment comprends-tu le lien entre l'absence de design system et le taux d'abandon de 47 % ?

2. Quels tokens de design seraient prioritaires à définir pour améliorer l'accessibilité des élèves Dys ? Explique ton raisonnement.

3. Comment implémenterais-tu la mise en place du design system de façon progressive ? Décris les 3 premières étapes concrètes.

4. Quels KPIs UX et business suivrais-tu pour mesurer l'impact du design system sur l'expérience des élèves, y compris ceux ayant des besoins spécifiques ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Une bibliothèque de styles Figma est une couche de présentation. Un design system est un système vivant qui connecte les décisions de design aux décisions produit, à l'accessibilité, et au code. La confusion entre les deux révèle un angle mort fréquent : confondre l'outillage avec la philosophie.

**Raisonnement UX/Product**

Un design system comprend trois dimensions que la bibliothèque Figma seule ne couvre pas :
- Les tokens sémantiques : pas juste `blue-500` mais `color-action-primary` — la valeur porte une intention, pas juste une couleur
- La documentation des usages et des contraintes (quand utiliser ce composant, quand ne pas l'utiliser)
- La gouvernance : qui décide des évolutions, comment les changements sont propagés, comment les équipes contribuent

**Solution détaillée**

Une bibliothèque Figma centralisée est un bon point de départ, mais elle doit être complétée par :
1. Des tokens nommés sémantiquement (`color-feedback-error`, `spacing-component-gap`) pour que les décisions de design soient lisibles par tous (designers, développeurs, PMs)
2. Une documentation des composants avec leurs états (default, hover, focus, disabled, error) et leurs règles d'usage
3. Un processus de contribution et de validation pour éviter la prolifération non contrôlée

**KPIs impactés**

- UX : cohérence perçue (mesurable par SUS — les questions sur la consistance du système), taux d'erreurs de navigation (réduction attendue de 15 à 30 % sur les interfaces incohérentes)
- Business : vélocité de développement (réduction du temps de design-to-dev de 20 à 40 % selon les études Nielsen Norman Group), coût de maintenance réduit

**Erreurs classiques**

- Croire que Figma = le design system (c'est l'outil, pas le système)
- Créer des tokens uniquement descriptifs (`blue`, `large`) plutôt que sémantiques (`action-primary`, `heading-xl`)
- Négliger la dimension "documentation vivante" : un design system non documenté n'est pas adopté

**Correction du biais cognitif**

Biais de représentation : on assimile l'outil visible (Figma) au concept abstrait (design system). L'outil n'est que l'interface du système, pas le système lui-même.

**Améliorations possibles**

Intégrer dès le départ une couche d'accessibilité dans les tokens : définir les ratios de contraste minimum dans les tokens de couleur eux-mêmes, pas comme une couche ajoutée après.

**Changement de paradigme**

Un design system n'est pas une bibliothèque de ressources, c'est un langage partagé entre design, produit et développement.

---

#### Correction — Exercice 2 : Piège de paradigme

**Modèle mental attendu**

La variété visuelle non systémique est perçue par l'utilisateur non pas comme de la richesse mais comme de l'incohérence. Le cerveau utilise la consistance visuelle comme signal de fiabilité, surtout dans les contextes financiers.

**Problèmes UX identifiés**

1. Charge cognitive accrue : l'utilisateur doit re-apprendre l'affordance du bouton principal à chaque écran
2. Perte de confiance : en fintech, l'incohérence visuelle est associée inconsciemment à l'instabilité ou au manque de professionnalisme
3. Problème d'accessibilité : les 6 valeurs de bleu (#1A73E8 et #0066FF) sont similaires mais différentes — pour un utilisateur daltonien ou en contexte de faible luminosité, ce sont des signaux contradictoires
4. Impossibilité de tester : avec 6 variantes de bouton, aucun A/B test n'est valide car les variables sont confondues

**KPIs affectés**

- UX : SUS (score de cohérence perçue en chute prévisible), taux d'erreurs de clic (l'utilisateur ne reconnaît pas l'action principale)
- Business : taux de conversion sur les parcours de paiement (chaque friction non résolue réduit la conversion de 5 à 15 % selon les benchmarks secteur fintech), NPS (perceptions négatives de l'interface alimentent les verbatims)

**Erreurs classiques**

- Confondre diversité visuelle et richesse expérientielle
- ❌ Dark pattern potentiel : utiliser le vert sur le bouton de paiement (#28A745) pour déclencher une action irréversible, en jouant sur l'association psychologique "vert = valider = continuer sans lire" — c'est une manipulation de l'affordance
- Ignorer que l'incohérence a un coût de maintenance : 6 composants à maintenir au lieu d'un système de variantes

**Améliorations possibles**

Définir un token `color-action-primary` unique, décliné en variantes sémantiques (`color-action-destructive` pour les suppressions, `color-action-confirm` pour les validations irréversibles) avec une règle : la couleur ne porte pas l'importance, la hiérarchie typographique et le positionnement le font.

**Changement de paradigme**

La cohérence visuelle n'est pas un manque de créativité, c'est un signal de confiance que l'utilisateur lit avant même de lire le texte du bouton.

---

#### Correction — Exercice 3 : Mini-cas réel EdTech

**Modèle mental attendu AVANT**

L'absence de design system dans une plateforme multi-prestataires crée une incohérence visuelle et comportementale qui génère de la charge cognitive. Pour des élèves Dys, cette charge s'ajoute à la charge déjà élevée de décodage du contenu : l'interface elle-même devient un obstacle. Le taux d'abandon de 47 % est probablement la somme de plusieurs frictions accumulées, dont l'incohérence visuelle est une cause sous-estimée.

**Tokens prioritaires pour l'accessibilité Dys**

1. Tokens typographiques :
   - `font-family-reading` : une police adaptée (OpenDyslexic ou une police à espacement large comme Atkinson Hyperlegible)
   - `font-size-base` : minimum 16px, avec une variante `font-size-comfortable` à 18px activable par l'utilisateur
   - `line-height-reading` : 1.6 minimum (WCAG recommande 1.5, mais 1.6 réduit la fatigue de lecture pour les Dys)
   - `letter-spacing-reading` : légèrement augmenté (0.05em) pour réduire la confusion entre lettres similaires (b/d, p/q)

2. Tokens d'espacement :
   - `spacing-block-gap` : espacement généreux entre les blocs de contenu pour éviter la confusion de proximité (loi de Gestalt)
   - `spacing-line-indent` : indentation visible des paragraphes pour faciliter le retour à la ligne

3. Tokens de couleur :
   - `color-background-reading` : un fond légèrement crème (#FAFAF5) plutôt que blanc pur, qui réduit l'éblouissement pour les Dys photosensibles
   - `color-text-primary` : ratio de contraste 7:1 minimum (AAA WCAG) plutôt que 4.5:1 (AA)
   - `color-focus-indicator` : indicateur de focus visible et contrasté, indispensable pour la navigation clavier

**Mise en place progressive — 3 premières étapes**

Étape 1 — Audit et inventaire (semaines 1 à 3) :
Recenser tous les composants existants sur la plateforme, identifier les incohérences, mesurer le nombre de variantes non intentionnelles. Impliquer un ou deux élèves ayant des troubles Dys dans un test utilisateur court (15 min) pour identifier les points de friction visuels réels — pas supposés.

Étape 2 — Définition des tokens fondamentaux (semaines 4 à 6) :
Définir les tokens de typographie, d'espacement et de couleur en partant des besoins d'accessibilité identifiés à l'étape 1. Ce qui est bon pour les Dys est bon pour tous : principe de conception universelle. Valider ces tokens avec les enseignants référents.

Étape 3 — Composants prioritaires et migration partielle (semaines 7 à 12) :
Reconstruire en priorité les composants utilisés dans les modules au taux d'abandon le plus élevé. Déployer sur un module pilote, mesurer l'impact sur le taux d'abandon avant de généraliser.

**KPIs à suivre**

KPIs UX :
- Taux d'abandon par module (objectif : descendre de 47 % à moins de 30 % sur les modules pilotes)
- Taux d'abandon différentiel élèves standard vs élèves Dys (objectif : réduire l'écart de ×2 à moins de ×1,3)
- SUS score global et par segment (élèves avec et sans besoins spécifiques)
- Taux de complétion des exercices interactifs
- Temps passé par module (proxy de l'engagement)

KPIs business :
- Taux de renouvellement des licences établissements (rétention)
- NPS enseignants (le design system est un argument de crédibilité pédagogique)
- Réduction du temps de design-to-dev pour les nouvelles fonctionnalités (ROI interne du design system)

**Erreurs classiques**

- Traiter l'accessibilité comme une couche ajoutée après coup plutôt que comme un principe fondateur des tokens
- Créer un design system pour les designers sans embarquer les développeurs dès le début
- Négliger la dimension "préférence utilisateur" : les élèves Dys bénéficient d'un mode de lecture personnalisable, pas d'une police imposée

**Changement de paradigme**

Concevoir pour les élèves Dys n'est pas une contrainte d'accessibilité, c'est un levier de qualité qui améliore l'expérience de tous les élèves.

---
---

## Concept 2 — Psychologie visuelle & Gestalt

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Un designer junior te montre une maquette de tableau de bord analytique. Il a utilisé 8 couleurs différentes pour distinguer les catégories de données, des icônes personnalisées pour chaque métrique, et des lignes de séparation entre chaque section. Il dit : "Plus c'est détaillé, plus c'est professionnel."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Qu'est-ce que les lois de la Gestalt t'apprennent sur la manière dont l'œil humain lit une interface ? En quoi le principe "plus c'est détaillé = plus c'est professionnel" est-il un biais à corriger ?

---

#### Exercice 2 — Piège de paradigme

Une app de méditation lance une fonctionnalité "Bilan de semaine". Le designer a produit l'écran suivant :

**Description de l'écran :**
- Titre "Bilan de semaine" en gras, taille 24px, couleur #1A1A1A
- Sous-titre "Voici vos stats" en regular, taille 14px, couleur #666666
- 4 cartes métriques (minutes de méditation, sessions complétées, série de jours, humeur moyenne) disposées en grille 2×2, avec des couleurs de fond différentes pour chaque carte
- Entre les cartes : aucun espacement systématique (les gaps varient de 8px à 24px selon les écrans)
- En bas : un bouton "Partager mes stats" en orange vif, et un lien texte "Voir l'historique complet" juste à côté, en orange également

**Question :** Identifie les violations des lois de la Gestalt et de la hiérarchie visuelle dans cet écran. Quels KPIs seraient affectés ? Y a-t-il un dark pattern ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX/UI Designer pour une application de santé mentale destinée à des adultes en situation de burn-out ou d'anxiété chronique. L'app propose des exercices de respiration, de journaling et de pleine conscience. Le taux de retour à J+7 est de 22 % (benchmark secteur : 35 %). Les tests utilisateurs révèlent que les utilisateurs trouvent l'interface "stressante" ou "surchargée", alors que le contenu lui-même est apprécié.

**Dimension éthique et inclusive :** Les utilisateurs en état d'anxiété élevée sont particulièrement sensibles aux stimulations visuelles. Certains utilisateurs signalent que les animations et les couleurs vives aggravent leur état.

**Questions :**

1. Décris ton modèle mental AVANT de commencer : comment le vocabulaire visuel d'une interface peut-il aggraver ou atténuer un état émotionnel ? Sur quels principes de Gestalt et de psychologie des couleurs t'appuierais-tu ?

2. Identifie 4 principes visuels concrets à appliquer pour réduire la charge visuelle de l'interface. Explique le mécanisme cognitif derrière chaque principe.

3. Conçois la structure visuelle d'un écran d'accueil "apaisé" pour cette app. Décris les choix de typographie, couleur, espacement et hiérarchie.

4. Quels KPIs UX et business suivrais-tu pour valider que les changements visuels ont réduit l'anxiété perçue et amélioré la rétention ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

La Gestalt est la théorie selon laquelle le cerveau perçoit les formes et les groupes avant les détails. L'œil cherche l'ordre, la continuité et la signification. Une interface surchargée ne montre pas de la profondeur : elle montre de la dissonance, que le cerveau interprète comme du bruit.

**Raisonnement UX/Product**

Les lois de Gestalt les plus pertinentes pour un tableau de bord :
- Loi de proximité : les éléments proches sont perçus comme liés. Des métriques sans groupement visuel semblent sans relation
- Loi de similarité : des éléments visuellement identiques sont perçus comme appartenant au même groupe. 8 couleurs différentes signalent 8 groupes distincts — ce qui peut être involontaire
- Loi de figure-fond : l'œil cherche un sujet principal sur un fond. Une interface sans hiérarchie claire n'a pas de figure : tout est fond

**KPIs impactés**

- Temps moyen pour trouver une information clé (task completion time) : directement corrélé à la clarté visuelle
- Taux d'erreurs : un tableau de bord illisible génère des erreurs d'interprétation des données
- SUS : les questions sur "l'apprentissage" et la "complexité" du système

**Erreurs classiques**

- Confondre densité d'information et richesse d'information : on peut avoir beaucoup d'informations et peu de bruit
- Utiliser la couleur comme seul différenciateur (problème d'accessibilité pour 8 % des hommes daltoniens)

**Changement de paradigme**

Le professionnalisme visuel ne se mesure pas au nombre d'éléments, mais à la clarté avec laquelle l'information la plus importante saute aux yeux.

---

#### Correction — Exercice 2 : Piège de paradigme

**Violations de la Gestalt identifiées**

1. Loi de proximité violée : les gaps variables (8px à 24px) brisent le regroupement perçu. Le cerveau ne sait pas quelles métriques sont liées
2. Loi de similarité violée : 4 couleurs de fond différentes sur les cartes signalent 4 catégories différentes, alors que ce sont 4 métriques de même nature (toutes liées à la pratique hebdomadaire)
3. Hiérarchie visuelle incohérente : le bouton "Partager" et le lien "Voir l'historique" sont en orange — même couleur, même niveau visuel — alors qu'ils n'ont pas la même importance. L'œil ne sait pas où aller

**Dark pattern identifié**

❌ Le bouton "Partager mes stats" en orange vif au premier plan, avec le lien "Voir l'historique complet" relégué (malgré la même couleur) crée une asymétrie d'attention dirigée vers le partage social plutôt que vers l'analyse personnelle. Dans une app de santé mentale, pousser le partage de données de santé mentale en les mettant en avant visuellement sur l'historique personnel est un dark pattern de type "misdirection" : l'interface favorise l'action bénéfique pour l'entreprise (viralité) au détriment de l'action bénéfique pour l'utilisateur (suivi de sa santé).

**KPIs affectés**

- Taux de complétion du bilan de semaine (si l'utilisateur ne comprend pas l'écran, il abandonne)
- Taux de partage vs taux de consultation de l'historique (révèle si le dark pattern a fonctionné — et à quel coût éthique)
- NPS : les utilisateurs qui perçoivent la manipulation partagent des verbatims très négatifs

**Changement de paradigme**

Dans une app de santé mentale, l'architecture visuelle est une architecture de confiance : chaque décision de hiérarchie doit servir l'utilisateur, pas la croissance virale.

---

#### Correction — Exercice 3 : Mini-cas réel App Santé Mentale

**Modèle mental attendu AVANT**

L'interface visuelle d'une app de santé mentale n'est pas neutre. Pour un utilisateur anxieux, le cerveau est déjà en état d'alerte élevée (amygdale hyperactivée). Une interface à haute stimulation visuelle (couleurs saturées, animations, densité d'éléments) aggrave cet état en ajoutant de la charge sensorielle à une charge cognitive déjà élevée. Le design visuel doit être une "régulation émotionnelle externe" : il doit signaler la sécurité, pas la performance.

**4 principes visuels concrets**

1. Réduction de la saturation chromatique (mécanisme : les couleurs très saturées activent le système nerveux sympathique — "fight or flight"). Utiliser des palettes désaturées, douces : verts sauge, bleus ardoise, beiges chauds. Éviter le rouge, l'orange vif, les jaunes électriques.

2. Espacement généreux (mécanisme : la loi de proximité de la Gestalt — si les éléments sont trop serrés, le cerveau perçoit un surencombrement, synonyme de danger ou d'urgence). Des marges larges signalent le calme et l'espace.

3. Une seule action principale par écran (mécanisme : la loi de Hick — plus il y a de choix, plus le temps de décision augmente et plus l'anxiété de choix s'installe). Sur chaque écran, une seule chose à faire, claire et accessible.

4. Typographie à faible contraste d'épaisseur (mécanisme : des contrastes typographiques très marqués — du ultra-light au ultra-bold — créent une tension visuelle. Une hiérarchie fondée sur la taille plutôt que sur le poids réduit cette tension).

**Structure de l'écran d'accueil "apaisé"**

- Fond : blanc cassé ou beige très léger (#FAF8F4), pas de blanc pur (trop contrasté)
- Zone de bienvenue : "Bonjour [Prénom]" en serif léger (Lora ou Playfair en weight 300), taille 28px, couleur #3D3D3D — le serif évoque la chaleur et le calme vs le sans-serif qui évoque la performance
- Sous-titre contextuel : "Comment vous sentez-vous maintenant ?" en sans-serif regular, 16px, couleur #7A7A7A
- Sélection d'humeur : 5 cercles simples, non labellisés de couleur mais avec des illustrations minimalistes ou des emojis accessibles — espacés généreusement
- Une seule CTA principale : "Commencer un exercice" — bouton arrondi (radius 24px), couleur vert sauge (#8FAF8A), texte blanc, taille confortable
- Aucune notification, aucun badge, aucun compteur visible sur cet écran

**KPIs à suivre**

KPIs UX :
- Taux de retour J+7 (objectif : passer de 22 % à 35 % — benchmark secteur)
- Taux de retour J+1 et J+3 (early indicators de l'engagement)
- Score d'anxiété perçue après utilisation : mesurable par un questionnaire ultra-court (une seule question : "Comment vous sentez-vous après avoir utilisé l'app ?" sur une échelle de 1 à 5)
- Taux d'activation de l'option "mode sensoriel réduit" si proposée

KPIs business :
- Taux de rétention à 30 jours (abonnements)
- Taux de désabonnement avec motif "interface stressante" (à suivre via les enquêtes de sortie)
- NPS et verbatims sur l'interface (vs le contenu)

**Erreurs classiques**

- Réduire la charge visuelle mais augmenter la charge cognitive (ex. : supprimer des éléments sans donner de repères de navigation)
- Appliquer un design "minimaliste" au sens esthétique sans penser à l'utilisateur anxieux qui a besoin de repères stables
- ❌ Dark pattern : proposer un "mode sérénité" uniquement dans la version premium — monétiser l'accessibilité émotionnelle est contraire à l'éthique dans un contexte de santé mentale

**Changement de paradigme**

Dans une app de santé mentale, le design visuel est une intervention thérapeutique indirecte : chaque choix d'espacement, de couleur et de hiérarchie agit sur l'état émotionnel de l'utilisateur.

---
---

## Concept 3 — Accessibilité visuelle & WCAG

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Tu rejoins une équipe qui a conçu une interface e-commerce. La designer dit : "On a vérifié l'accessibilité — nos couleurs ont toutes un ratio de contraste de 4.5:1." Le chef de projet ajoute : "On est WCAG AA, donc on est good."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Est-ce que WCAG AA est suffisant dans tous les contextes ? Quelles dimensions de l'accessibilité visuelle vont au-delà du seul ratio de contraste ?

---

#### Exercice 2 — Piège de paradigme

Une app de navigation GPS pour randonneurs affiche les alertes de danger (ours, orage, terrain difficile) uniquement via un code couleur :
- Rouge = danger immédiat
- Orange = vigilance
- Vert = sécurisé

Le designer explique : "C'est intuitif, tout le monde connaît rouge/orange/vert."

**Question :** Qu'est-ce qui ne va pas ici ? Identifie les populations exclues, les risques UX et les KPIs impactés. Y a-t-il une dimension éthique ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu travailles sur une application de vote en ligne pour des élections municipales. L'application est déployée dans une commune de 45 000 habitants. Les élus veulent un design "moderne et dynamique". Le taux de participation aux dernières élections locales était de 38 %. L'objectif est d'atteindre 55 % avec ce nouveau canal.

**Dimension éthique et inclusive :** L'application doit être accessible à des citoyens âgés (30 % de la population a plus de 65 ans), à des personnes malvoyantes, et à des utilisateurs peu à l'aise avec le numérique. Dans une application de vote, une erreur d'interface peut avoir des conséquences civiques réelles.

**Questions :**

1. Décris ton modèle mental AVANT de commencer : pourquoi l'accessibilité dans une application de vote est-elle une question démocratique autant que technique ?

2. Quels critères WCAG iraient au-delà du niveau AA pour cette application ? Justifie tes choix.

3. Identifie 3 risques d'accessibilité spécifiques à une app de vote, et propose une solution concrète pour chacun.

4. Quels KPIs suivrais-tu pour t'assurer que l'application n'exclut aucun segment de la population ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

WCAG AA est un minimum légal, pas un objectif d'excellence. Le ratio de contraste 4.5:1 est le seuil bas pour le texte normal — en dessous duquel il y a exclusion garantie. Mais l'accessibilité visuelle comprend au moins cinq dimensions que le seul ratio ne couvre pas.

**Dimensions au-delà du ratio**

1. Taille des cibles interactives : WCAG 2.5.5 recommande 44×44px minimum. En dessous, les personnes ayant des tremblements ou une motricité réduite sont exclues
2. Espacement du texte : WCAG 1.4.12 — l'interface doit rester lisible quand l'utilisateur augmente l'espacement des lignes à 1.5× et les lettres à 0.12em
3. Non-dépendance à la couleur seule (1.4.1) : l'information ne peut pas être transmise uniquement par la couleur
4. Indicateurs de focus visibles (2.4.7, renforcé en 2.4.11 WCAG 2.2) : les utilisateurs qui naviguent au clavier doivent voir où ils se trouvent
5. Adaptabilité au zoom (1.4.4) : l'interface doit fonctionner à 200 % de zoom sans perte de fonctionnalité

**KPIs impactés**

- Taux d'accessibilité mesuré par audit WCAG (outil Axe ou Lighthouse)
- Taux d'utilisation par les seniors (segment souvent invisible dans les analytics)
- Taux de retours négatifs liés à la lisibilité dans les enquêtes NPS

**Changement de paradigme**

L'accessibilité n'est pas une checklist à cocher une fois : c'est une posture de conception qui anticipe la diversité des corps, des contextes et des équipements.

---

#### Correction — Exercice 2 : Piège de paradigme

**Problème fondamental**

Environ 8 % des hommes et 0,5 % des femmes ont une forme de daltonisme, la plus fréquente étant la deutéranopie (rouge/vert). Dans l'interface décrite, rouge et vert sont les deux extrêmes de l'échelle de danger — précisément les couleurs les plus affectées par la deutéranopie. Un randonneur daltonien ne peut pas distinguer "danger immédiat" de "sécurisé".

**Violation WCAG 1.4.1** : l'information est transmise uniquement par la couleur, sans redondance textuelle ou iconographique.

**Dimension éthique**

Dans une application de sécurité physique (randonnée en terrain dangereux), l'exclusion d'un utilisateur daltonien de l'information de danger n'est pas un inconfort — c'est un risque vital. L'accessibilité devient ici une question de responsabilité légale et morale.

**Solution**

Redondance multimodale de l'information de danger :
- Icône (triangle d'alerte, icône ours, nuage d'orage) en plus de la couleur
- Texte explicite ("DANGER — Ours signalé à 500m") en plus du code couleur
- Couleur + forme + texte : les trois canaux ensemble garantissent l'accessibilité

**KPIs impactés**

- Taux de compréhension des alertes dans les tests utilisateurs (mesurable par simulation en filtre daltonisme)
- Taux d'incidents signalés par les utilisateurs (proxy du risque réel)
- Score de conformité WCAG 1.4.1

**Changement de paradigme**

La couleur est un exhausteur d'information, pas un porteur d'information : elle renforce ce qui est déjà dit par la forme et le texte, elle ne le remplace pas.

---

#### Correction — Exercice 3 : Mini-cas réel Application de Vote

**Modèle mental attendu AVANT**

Une application de vote n'est pas une application de commerce ou de divertissement : chaque erreur d'interface est une erreur civique. Si un utilisateur sélectionne par inadvertance un candidat qu'il ne souhaitait pas choisir, ou si une confirmation peu visible lui fait croire qu'il a voté alors que ce n'est pas le cas, l'interface a altéré le processus démocratique. L'accessibilité ici n'est pas une option légale — c'est une condition de légitimité du vote.

**Critères WCAG au-delà du niveau AA**

1. WCAG AAA — Contraste renforcé (1.4.6) : ratio 7:1 pour le texte normal, 4.5:1 pour le texte large. Justification : 30 % de la population a plus de 65 ans, avec une acuité visuelle réduite. L'enjeu (vote) justifie le niveau maximum d'exigence.

2. WCAG AAA — Pas de temporisation (2.2.3) : aucune session ne doit expirer sans avertissement explicite et possibilité de prolonger. Un utilisateur lent ne doit pas perdre son vote en cours.

3. WCAG 2.2 — Cible de taille minimale 2.5.8 (niveau AA) poussée jusqu'à 2.5.5 (AAA) : 44×44px minimum pour chaque élément interactif, avec un espacement suffisant pour éviter les erreurs de tap sur mobile.

4. Confirmation explicite et réversible (best practice, pas WCAG pur) : avant la validation finale, afficher un récapitulatif lisible du vote avec une option de modification. Aucune action irréversible sans confirmation en deux temps.

**3 risques spécifiques et solutions**

Risque 1 — Erreur de sélection non détectée :
Un utilisateur malvoyant ou peu à l'aise avec le numérique sélectionne le mauvais candidat sans s'en rendre compte car l'état "sélectionné" vs "non sélectionné" n'est signalé que par la couleur.
Solution : signaler l'état sélectionné par trois canaux simultanés — couleur (fond coloré), icône (coche visible), texte ("Sélectionné"). Ajouter un retour sonore optionnel.

Risque 2 — Validation accidentelle :
Le bouton "Confirmer mon vote" est placé trop près du bouton "Annuler" ou a une taille insuffisante sur mobile. Un utilisateur avec des tremblements (Parkinson, âge) peut valider par erreur.
Solution : séparer les deux actions par au moins 48px, avec une étape de confirmation intermédiaire ("Êtes-vous sûr de vouloir voter pour [Nom] ?") avant l'action irréversible.

Risque 3 — Incompréhension du résultat :
Après validation, l'écran de confirmation n'est pas assez explicite. L'utilisateur ne sait pas s'il a bien voté ou si une erreur s'est produite.
Solution : un écran de confirmation avec le récapitulatif du vote, un numéro de confirmation unique, et un message clair : "Votre vote a bien été enregistré le [date] à [heure]. Vous pouvez fermer cette page." Prévoir un envoi de confirmation par SMS ou email.

**KPIs à suivre**

KPIs d'accessibilité et d'inclusion :
- Taux de participation par tranche d'âge (segmenter les analytics pour détecter si les seniors utilisent l'app autant que les autres)
- Taux d'erreurs de vote (votes annulés ou resoumis) par segment
- Score de conformité WCAG (audit tiers avant déploiement)
- Taux d'abandon du parcours de vote (chaque abandon est une voix non exprimée)

KPIs business / démocratiques :
- Taux de participation global (objectif : 55 %)
- Taux de satisfaction post-vote mesuré par enquête courte (une seule question : "Avez-vous eu des difficultés à utiliser l'application ?")
- Taux de recours et réclamations liés à des erreurs de l'interface

**Erreurs classiques**

- Prioriser l'esthétique "moderne et dynamique" au détriment de la lisibilité pour les seniors
- ❌ Dark pattern : placer le bouton d'un candidat ou d'une option politique en position visuellement plus avantageuse (plus grand, plus haut, plus coloré) — même involontairement, c'est un biais de design à impact démocratique
- Négliger les tests avec de vrais utilisateurs seniors et malvoyants — les personas théoriques ne remplacent pas les tests réels

**Changement de paradigme**

Dans une application de vote, l'accessibilité n'est pas une fonctionnalité parmi d'autres : c'est la condition sine qua non de la légitimité du service.

---
---

## Concept 4 — Évaluation heuristique visuelle

---

### BLOC 1 — Exercices (sans correction)

---

#### Exercice 1 — Traduction mentale

Ton chef de projet te dit : "On fait une évaluation heuristique de l'interface avant le lancement. Tu peux faire ça seul en une après-midi, non ? Il suffit de regarder l'interface et de noter ce qui est moche."

**Question :** Comment aborderais-tu ce problème avec ta compréhension actuelle ? Une évaluation heuristique est-elle une affaire d'esthétique ? Quelle méthode permettrait de la conduire rigoureusement, et pourquoi ne peut-elle pas être réalisée par une seule personne ?

---

#### Exercice 2 — Piège de paradigme

Une équipe réalise une évaluation heuristique d'un écran d'inscription d'une app de covoiturage. Voici leur rapport :

> "L'interface est propre et bien rangée. Les couleurs sont harmonieuses. Le formulaire est bien structuré avec des labels clairs. Le bouton d'inscription est visible. Note globale : 8/10. Recommandation : aucun changement majeur nécessaire."

Lors des tests utilisateurs la semaine suivante, 34 % des utilisateurs abandonnent le formulaire d'inscription, et 60 % de ceux qui abandonnent le font au niveau du champ "Numéro de téléphone" qui affiche le message d'erreur "Format incorrect" sans indiquer le format attendu.

**Question :** Que révèle cet écart entre l'évaluation heuristique et les tests utilisateurs ? Quelle heuristique de Nielsen a été violée ? Quels KPIs sont directement impactés ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu rejoins en tant que consultant UX une plateforme de télémédecine qui met en relation des patients avec des médecins. L'interface existe depuis 3 ans et n'a jamais fait l'objet d'une évaluation systématique. Les médecins signalent une "interface lente et confuse". Le taux de satisfaction des médecins (côté professionnel) est de 52/100 (NPS très bas). Les patients, eux, donnent un NPS de 68 — la perception est meilleure côté patient que côté médecin.

**Dimension éthique et inclusive :** La plateforme traite des données de santé. Certaines consultations concernent des patients en situation de crise (urgences psychiatriques légères, consultations oncologiques). Une mauvaise interface côté médecin peut allonger le temps de consultation ou générer des erreurs dans la prise en charge.

**Questions :**

1. Décris ton modèle mental AVANT de commencer : pourquoi l'asymétrie NPS patients/médecins (68 vs 52) est-elle un signal UX important ? Qu'est-ce qu'elle révèle sur la conception initiale de la plateforme ?

2. Conduis une évaluation heuristique partielle : identifie 3 violations probables des heuristiques de Nielsen dans une interface de télémédecine côté médecin, sans avoir vu l'interface. Justifie ton raisonnement.

3. Quel protocole d'évaluation heuristique mettrais-tu en place ? Qui impliquerais-tu, sur quelle durée, et avec quels livrables ?

4. Quels KPIs suivrais-tu pour mesurer l'impact d'une refonte de l'interface médecin sur la qualité des soins et la satisfaction des deux parties ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1 : Traduction mentale

**Modèle mental attendu**

Une évaluation heuristique est une inspection experte de l'interface selon des principes d'utilisabilité établis (les 10 heuristiques de Nielsen, les principes de Gestalt, les critères WCAG). Ce n'est pas un jugement esthétique : c'est une analyse structurée des frictions potentielles, réalisée avant les tests utilisateurs pour identifier les problèmes évidents et éviter de "gaspiller" des utilisateurs sur des bugs connus.

**Pourquoi plusieurs évaluateurs**

La recherche de Nielsen (1992) montre qu'un seul évaluateur détecte en moyenne 35 % des problèmes d'utilisabilité. Trois à cinq évaluateurs en détectent 75 à 85 %. Au-delà de 5, le rendement marginal décroît. La méthode standard : 3 à 5 évaluateurs indépendants, puis consolidation des résultats.

**KPIs impactés par une mauvaise évaluation heuristique**

- Taux de succès des tâches (task success rate) : les problèmes non détectés se retrouvent en production
- Coût de correction : un bug détecté en évaluation heuristique coûte 10× moins cher à corriger qu'un bug détecté en production (règle du "1-10-100" de la qualité)

**Changement de paradigme**

L'évaluation heuristique n'est pas un audit esthétique, c'est une assurance qualité UX : elle protège les utilisateurs réels des frictions prévisibles.

---

#### Correction — Exercice 2 : Piège de paradigme

**Diagnostic**

L'évaluation a confondu esthétique et utilisabilité. Le rapport ne cite aucune heuristique de Nielsen, ne teste aucun flux complet, et ne s'intéresse pas aux états d'erreur — pourtant, c'est là que 60 % des abandons se produisent.

**Heuristique violée**

Heuristique n°9 de Nielsen — Aide à la reconnaissance, au diagnostic et à la récupération des erreurs : les messages d'erreur doivent être en langage clair, indiquer précisément le problème et suggérer une solution.

"Format incorrect" viole cette heuristique car il indique qu'il y a une erreur mais n'indique pas le format attendu (exemple : "Entrez votre numéro au format 06 XX XX XX XX").

**KPIs directement impactés**

- Taux de complétion du formulaire d'inscription (34 % d'abandon = perte de 34 utilisateurs sur 100 avant même qu'ils n'accèdent au service)
- Coût d'acquisition client (CAC) : si l'acquisition coûte 15€ par utilisateur et que 34 % abandonnent sur un message d'erreur mal rédigé, le ROI de corriger ce message est immédiat
- Taux de conversion (inscription → premier trajet) : un utilisateur qui abandonne l'inscription ne reviendra pas dans 80 % des cas

**Erreurs classiques**

- Évaluer l'interface dans ses états "heureux" (happy path) sans tester les états d'erreur
- Ne pas parcourir l'intégralité des flux critiques (inscription, paiement, etc.)

**Changement de paradigme**

Une interface ne se juge pas dans ses meilleurs moments, elle se juge dans les moments où l'utilisateur fait une erreur.

---

#### Correction — Exercice 3 : Mini-cas réel Télémédecine

**Modèle mental attendu AVANT**

L'asymétrie NPS 68 (patients) vs 52 (médecins) révèle que la plateforme a été conçue en priorité pour l'expérience patient — ce qui est compréhensible marketing mais stratégiquement problématique. Les médecins sont les "power users" de la plateforme : ils l'utilisent 8 à 10 heures par jour, gèrent des dizaines de dossiers, et prennent des décisions médicales dans cette interface. Une interface confuse pour eux n'est pas une gêne : c'est un risque pour les patients. La satisfaction des médecins conditionne aussi leur fidélité à la plateforme (churn B2B).

**3 violations heuristiques probables côté médecin**

1. Heuristique n°6 — Reconnaissance plutôt que rappel :
Les médecins doivent probablement se souvenir de donde se trouve l'historique du patient, les résultats d'examens, les ordonnances précédentes. Si ces informations ne sont pas visibles dans la vue principale de la consultation, le médecin doit "chercher" — charge cognitive inacceptable en situation de consultation réelle.

2. Heuristique n°1 — Visibilité de l'état du système :
Dans une consultation en cours, le médecin doit savoir à tout moment : est-ce que le patient me voit ? Est-ce que le son fonctionne ? Le dossier a-t-il été enregistré ? Les interfaces médicales omettent souvent ces confirmations d'état, sources d'anxiété et d'erreurs.

3. Heuristique n°4 — Cohérence et standards :
Les terminologies médicales et les flux de prescription varient souvent d'une interface à l'autre selon les prestataires techniques. Si la plateforme utilise un vocabulaire non standard (ex. : "clore la session" au lieu de "terminer la consultation"), les médecins habitués à d'autres logiciels sont déstabilisés.

**Protocole d'évaluation heuristique**

Phase 1 — Recrutement des évaluateurs (1 semaine) :
3 à 5 évaluateurs avec des profils complémentaires : 1 UX designer senior externe (regard neuf), 1 médecin utilisateur de la plateforme (expertise domaine), 1 expert accessibilité (dimension WCAG et inclusive). NB : ne pas inclure de membre de l'équipe de conception initiale — le biais de familiarité invalide l'évaluation.

Phase 2 — Évaluation individuelle (2 jours) :
Chaque évaluateur parcourt l'interface seul, selon une liste de tâches critiques définies en amont (démarrer une consultation, accéder au dossier patient, prescrire un médicament, clore la consultation). Chaque problème identifié est documenté avec : heuristique violée, sévérité (1 à 4), capture d'écran, recommandation.

Phase 3 — Consolidation et priorisation (1 jour) :
Session de synthèse collective. Les problèmes identifiés par au moins 2 évaluateurs sont priorisés. Matrice sévérité × fréquence pour définir les Quick Wins vs les chantiers lourds.

Livrables :
- Rapport d'évaluation heuristique avec liste priorisée des problèmes
- Matrice de sévérité
- Recommandations à court terme (Quick Wins) et long terme

**KPIs à suivre**

KPIs qualité des soins :
- Durée moyenne d'une consultation (une interface plus fluide = consultations plus courtes et plus concentrées)
- Taux d'erreurs de prescription (difficile à mesurer directement mais proxy : taux de corrections post-consultation)
- Taux d'incidents signalés liés à l'interface

KPIs satisfaction et rétention :
- NPS médecins (objectif : remonter de 52 à 70+ sur 12 mois)
- Taux de churn médecins (abandon de la plateforme)
- SUS score côté médecin (mesure l'utilisabilité perçue)
- NPS patients (à ne pas dégrader en améliorant l'interface médecin)

**Erreurs classiques**

- Réaliser l'évaluation heuristique avec des évaluateurs qui connaissent déjà l'interface (biais de familiarité)
- Négliger les flux d'urgence ou de crise — ce sont les situations où l'interface doit être la plus claire
- ❌ Considérer que le NPS patients élevé (68) compense le NPS médecins bas (52) — c'est une erreur stratégique : la qualité des soins dépend de la qualité de l'interface médecin

**Changement de paradigme**

Dans une interface médicale, l'expérience du professionnel de santé n'est pas séparable de l'expérience du patient : une mauvaise interface médecin est un risque patient.
