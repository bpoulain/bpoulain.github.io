# Section 4 — Idéation & Conception UX

> **Fichier théorie uniquement.** Cette section couvre les méthodes, outils et raisonnements qui permettent de passer d'un problème utilisateur identifié à des solutions concrètes, testables et itérables.

---

## Table des matières

1. [Brainstorming & co-création](#1-brainstorming--co-création)
2. [Storyboards & user flows](#2-storyboards--user-flows)
3. [Architecture de l'information](#3-architecture-de-linformation)
4. [Wireframing & prototypage rapide](#4-wireframing--prototypage-rapide)
5. [Interaction design avancé](#5-interaction-design-avancé)
6. [UX Writing & Microcopy](#6-ux-writing--microcopy)
7. [Design critique & feedback structuré](#7-design-critique--feedback-structuré)
8. [Conception pour la charge cognitive](#8-conception-pour-la-charge-cognitive)
9. [Livrables typiques UX](#9-livrables-typiques-ux)
10. [Outils de conception UX](#10-outils-de-conception-ux)

---

## 1. Brainstorming & co-création

### 1.1 Brainstorming classique — Limites et évolution

**Modèle mental**
Le brainstorming classique (réunion de groupe, génération libre d'idées) est souvent moins efficace qu'on le croit. La présence des autres inhibe la génération individuelle d'idées (production blocking) et crée une convergence prématurée vers les idées du leader ou des membres les plus extravertis.

**Analogie stable**
Brainstorming classique = jardinage commun où tout le monde arrache les mauvaises herbes d'abord. Résultat : tout le monde touche aux mêmes plantes, les espèces rares (idées originales) sont arrachées avant d'avoir poussé. Brainstorming individuel puis partagé = chaque jardinier cultive son coin, puis on compare les meilleures plantes.

**Brainstorming classique vs structuré**

| Critère | Brainstorming classique | Brainstorming structuré |
|---|---|---|
| Génération d'idées | Simultanée en groupe | D'abord individuelle, puis partagée |
| Biais | Conformité sociale, HiPPO (Highest Paid Person's Opinion) | Réduction des biais de statut |
| Quantité d'idées | Modérée (inhibition de production) | Plus élevée |
| Qualité | Irrégulière | Plus homogène |
| Temps requis | Court | Légèrement plus long |

**Points éthiques & inclusivité**
- Le brainstorming non structuré marginalise les personnes introvertis, non-natives linguistiques et les personnalités moins assertives.
- Donner un temps de génération silencieuse individuelle avant tout partage groupe est une pratique inclusive fondamentale.

---

### 1.2 Crazy 8s

**Modèle mental**
Crazy 8s est une technique de génération rapide d'idées : chaque participant dessine 8 esquisses d'une idée différente en 8 minutes (1 minute par esquisse). La contrainte de temps force à dépasser les premières idées évidentes et à explorer des directions inattendues.

**Analogie stable**
Demander à un musicien d'improviser pendant 60 secondes sans s'arrêter : les premières notes sont les patterns habituels, les dernières notes révèlent des territoires inexplorés. La contrainte libère la créativité en désamorçant l'auto-censure.

**Méthodologie Crazy 8s**

1. **Préparer** : Feuille A4 pliée en 8 cases, timer, stylos (aucun matériel digital nécessaire)
2. **Briefer** : Rappeler le problème utilisateur à résoudre (1 phrase max)
3. **Générer** : 8 minutes / 8 cases / 8 idées différentes — interdit de répéter la même idée
4. **Afficher** : Coller toutes les feuilles au mur, présentation silencieuse (dot voting possible)
5. **Converger** : Chaque participant vote pour les idées qu'il veut approfondir
6. **Approfondir** : Les idées sélectionnées sont développées en wireframes

**Correction modèle mental**
❌ Idée reçue : "La meilleure idée vient spontanément lors d'une réunion."
✅ Approche correcte : La meilleure idée émerge rarement en premier — elle requiert d'avoir épuisé les idées évidentes. Les contraintes temporelles et la quantité forcée (8 idées) produisent statistiquement de meilleures solutions.
KPI impacté : diversité des solutions explorées, vitesse d'idéation, qualité des prototypes issus des ateliers.

---

### 1.3 Workshops de co-création avec les utilisateurs

**Modèle mental**
Un workshop de co-création implique des utilisateurs réels dans le processus de conception — non pas comme testeurs passifs mais comme co-auteurs actifs. Cette approche réduit le risque de concevoir des solutions déconnectées des besoins réels.

**Analogie stable**
Concevoir une cuisine avec le cuisinier qui l'utilisera, plutôt qu'une cuisine "idéale" selon des standards architecturaux génériques. Le cuisinier sait que l'évier doit être à gauche de la plaque de cuisson parce qu'il est gaucher — ce détail ne figure dans aucune étude générale.

**Structure d'un workshop de co-création**

| Phase | Durée | Activité | Rôle de l'utilisateur |
|---|---|---|---|
| 1 — Partage | 20-30 min | Narration d'expériences vécues | Protagoniste, expert de sa propre vie |
| 2 — Problèmes | 15-20 min | Identifier les frictions et besoins | Diagnosticien |
| 3 — Idéation | 30-40 min | Proposer des solutions (Crazy 8s, vote) | Co-concepteur |
| 4 — Prototype | 20-30 min | Esquisse rapide collaborative | Co-créateur |
| 5 — Critique | 15-20 min | Réagir aux prototypes des autres groupes | Évaluateur |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Pertinence des idées générées (évaluation par pairs) | Réduction du coût de re-design post-lancement |
| Diversité des profils représentés | Time-to-market réduit |
| Satisfaction participants (NPS workshop) | Adhésion utilisateur lors du lancement |

---

### 1.4 Mind maps

**Modèle mental**
Un mind map est une représentation visuelle arborescente d'un problème ou d'un domaine, partant d'un concept central et se ramifiant en idées associées. Il externalise la pensée associative et permet de voir des connexions qui ne seraient pas visibles en liste linéaire.

**Analogie stable**
Une toile d'araignée : le centre est le concept principal, chaque fil est une association, les fils se croisent entre différentes branches révélant des liens inattendus. Une liste linéaire serait comme regarder un seul fil à la fois.

**Application UX**
- Cartographier les relations entre fonctionnalités d'un produit
- Explorer le champ sémantique d'une fonctionnalité (avant l'architecture de l'information)
- Préparer un atelier d'idéation : structurer les thèmes à explorer

---

## 2. Storyboards & User Flows

### 2.1 Storyboards

**Modèle mental**
Un storyboard est une séquence de vignettes dessinées (comme une bande dessinée simplifiée) qui illustre comment un utilisateur vit une expérience — avant, pendant et après l'interaction avec le produit. Il capture le contexte émotionnel et situationnel, pas seulement les écrans.

**Analogie stable**
Le scénariste de cinéma qui dessine les scènes clés avant de tourner : le storyboard ne montre pas chaque geste de l'acteur, mais les moments clés, les transitions, les émotions à chaque étape. Un storyboard UX fait pareil avec l'utilisateur et le produit.

**Types de storyboards UX**

| Type | Niveau de détail | Usage | Outil |
|---|---|---|---|
| Storyboard d'exploration | Croquis très rapides | Phase d'idéation | Papier, Miro |
| Storyboard de scénario | Semi-détaillé | Communication équipe | Miro, Figma |
| Storyboard de présentation | Détaillé, soigné | Stakeholders, pitch | Figma, Keynote |

**Ce qu'un storyboard doit capturer**

1. **Qui** est l'utilisateur (persona de référence)
2. **Contexte** : où est-il ? Quel appareil ? Quelle émotion de départ ?
3. **Déclencheur** : qu'est-ce qui l'amène à utiliser le produit ?
4. **Parcours** : les 3-6 étapes clés de l'interaction
5. **Résultat** : que ressent-il à la fin ? Quel est l'état après ?

**Correction modèle mental**
❌ Idée reçue : "Un storyboard UX doit montrer des écrans précis et détaillés."
✅ Approche correcte : Un storyboard montre le contexte de vie de l'utilisateur, pas des wireframes. Les écrans peuvent être des rectangles vides avec une étiquette. La valeur est dans la narration émotionnelle et situationnelle.
KPI impacté : alignement équipe sur le problème utilisateur, cohérence du design avec les scénarios réels.

---

### 2.2 User Flows

**Modèle mental**
Un user flow est un diagramme qui représente le chemin qu'un utilisateur emprunte pour accomplir une tâche spécifique dans un produit — de l'entrée (point de départ) jusqu'à la sortie (objectif atteint ou abandon). Il révèle la complexité réelle d'un parcours et les points de friction potentiels.

**Analogie stable**
Un plan de métro : chaque station est un écran ou une étape, chaque ligne est un chemin possible, les correspondances sont les embranchements décisionnels. Un bon plan de métro rend les correspondances claires et les trajets longs acceptables.

**Éléments d'un user flow**

| Symbole | Signification |
|---|---|
| Rectangle arrondi (pill) | Point d'entrée / de sortie |
| Rectangle | Écran ou étape |
| Losange | Point de décision (Oui/Non, conditionnel) |
| Flèche | Direction du flux |
| Cylindre | Base de données / état sauvegardé |

**Niveaux de granularité**

| Niveau | Description | Usage |
|---|---|---|
| Task flow | Flux d'une tâche unique, linéaire | Valider une fonctionnalité isolée |
| User flow | Flux complet avec décisions et variantes | Conception et communication |
| Wireflow | User flow avec aperçu des écrans | Handoff développement |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Nombre d'étapes pour atteindre l'objectif clé | Taux de complétion du funnel |
| Taux d'abandon par étape (analytics) | Coût par conversion |
| Nombre de points de décision | Temps de développement (complexité) |

---

## 3. Architecture de l'information

### 3.1 Définition et fondements

**Modèle mental**
L'architecture de l'information (AI) est l'art d'organiser et d'étiqueter l'information pour qu'elle soit trouvable, compréhensible et utilisable. Une mauvaise AI est invisible quand elle est bonne, mais catastrophiquement visible quand elle est mauvaise (les utilisateurs se perdent, n'encontrent pas ce qu'ils cherchent, quittent).

**Analogie stable**
La bibliothèque publique : si les livres de cuisine sont rangés sous "Science appliquée" plutôt que "Arts de vivre", les visiteurs ne les trouveront jamais — même si physiquement les livres sont là. L'IA n'est pas l'organisation logique du contenu pour le créateur, mais l'organisation mentale du contenu pour l'utilisateur.

**Les 4 composantes de l'AI (Morville & Rosenfeld)**

| Composante | Description | Exemple concret |
|---|---|---|
| Organisation | Comment le contenu est catégorisé | Arborescence du menu principal |
| Labelling | Comment les catégories sont nommées | "Mon espace" vs "Compte" vs "Profil" |
| Navigation | Comment les utilisateurs se déplacent | Fil d'Ariane, menus, recherche |
| Recherche | Comment les utilisateurs trouvent du contenu | Moteur de recherche interne, filtres |

---

### 3.2 Arborescence et taxonomie

**Modèle mental**
Une arborescence est la structure hiérarchique des contenus d'un produit. La taxonomie est le système de classification qui organise ces contenus. Une taxonomie doit refléter le modèle mental des utilisateurs, pas la structure organisationnelle interne de l'entreprise.

**Analogie stable**
L'organigramme d'une entreprise et le plan de son site web sont souvent identiques — c'est une erreur fondamentale. Les utilisateurs cherchent "Contacter le service client", pas "Trouver le département relations clientèle de la division B2C de la région EMEA".

**Tests d'arborescence**

| Méthode | Description | Usage |
|---|---|---|
| Card Sorting (ouvert) | Les utilisateurs créent leurs propres catégories | Découvrir les modèles mentaux |
| Card Sorting (fermé) | Les utilisateurs classent dans des catégories prédéfinies | Valider une taxonomie existante |
| Tree Testing | Les utilisateurs trouvent des items dans l'arborescence sans le design | Valider la navigation seule |
| First Click Test | Clic sur le premier point d'entrée attendu | Vérifier l'évidence des labels |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux de succès en tree testing (>70%) | Taux de rebond sur pages importantes |
| Temps pour trouver un contenu cible | Pages vues par session |
| Score de findability (enquête) | Taux de conversion depuis la navigation |

---

### 3.3 Navigation et labelling

**Modèle mental**
Les labels (étiquettes) de navigation sont l'interface entre le modèle mental de l'entreprise et le modèle mental de l'utilisateur. Un bon label est immédiatement compris sans contexte supplémentaire.

**Bonnes pratiques de labelling**

| Pratique | Bonne pratique ✅ | À éviter ❌ |
|---|---|---|
| Clarté | "Mes commandes" | "Gestion des transactions" |
| Concision | "Aide" | "Centre d'assistance et de support clientèle" |
| Cohérence | Même terme partout pour le même concept | "Panier" ici, "Caddie" ailleurs |
| Voix utilisateur | Termes issus du card sorting | Jargon interne |
| Action vs destination | "Créer un compte" | "Compte" (ambigu : créer ou accéder ?) |

**Correction modèle mental**
❌ Idée reçue : "Les labels de navigation se choisissent selon la charte éditoriale de la marque."
✅ Approche correcte : Les labels se choisissent selon la façon dont les utilisateurs nommers les choses, validée par des tests (card sorting, tree testing). La marque peut influencer le ton, pas le vocabulaire fonctionnel.
KPI impacté : taux de succès de navigation, taux d'abandon par page.

---

## 4. Wireframing & Prototypage rapide

### 4.1 Niveaux de fidélité

**Modèle mental**
La fidélité d'un prototype désigne à quel point il ressemble au produit final. Plus la fidélité est haute, plus le temps de production est long et plus les retours des utilisateurs portent sur des détails visuels plutôt que sur des problèmes fondamentaux. La fidélité doit correspondre à la question à laquelle on cherche une réponse.

**Analogie stable**
Plan d'architecte : l'esquisse à main levée sur serviette répond à "Est-ce que cette disposition générale a du sens ?" Le plan technique coté répond à "Les dimensions sont-elles correctes ?" La maquette 3D en styrofoam répond à "Est-ce que les volumes me plaisent ?" Chaque niveau de fidélité a sa question.

**Comparaison des niveaux de fidélité**

| Niveau | Description | Quand l'utiliser | Outil typique | Durée |
|---|---|---|---|---|
| Sketch (croquis) | Formes basiques, pas de détail | Idéation initiale, exploration | Papier, whiteboard | Minutes |
| Wireframe basse fidélité | Grilles, zones nommées, pas de couleur | Valider la structure | Balsamiq, Whimsical | Heures |
| Wireframe haute fidélité | Layout précis, typographie de base | Avant développement | Figma | Jours |
| Prototype interactif basse fi | Liens entre écrans, flux cliquable | Tests utilisateurs de navigation | Figma (liens) | Heures |
| Prototype interactif haute fi | Animations, vrais contenus | Tests d'utilisabilité avancés | Figma (interactions) | Jours |
| Prototype fonctionnel | Code réel | Validation technique | Développement | Semaines |

---

### 4.2 Wireframing — Bonnes pratiques

**Modèle mental**
Un wireframe est une représentation filaire (en fil de fer) d'une interface, focalisée sur la structure et la hiérarchie de l'information, sans couleurs ni images définitives. Il répond à "Qu'est-ce qui est là ?" et "Dans quel ordre ?" avant de répondre à "Comment ça doit être beau ?"

**Analogie stable**
Le squelette d'un corps humain : il révèle la structure, les proportions, les articulations. Sans squelette, aucun muscle ni peau ne tient. Le wireframe est le squelette de l'interface.

**Ce qu'un wireframe doit et ne doit pas contenir**

| Doit contenir ✅ | Ne doit pas contenir ❌ |
|---|---|
| Zones de contenu étiquetées | Couleurs définitives |
| Hiérarchie visuelle (taille relative) | Images définitives (utiliser des placeholders) |
| CTAs et leur position | Textes rédactionnels finaux (utiliser Lorem ou étiquettes) |
| Navigation et structure | Logique de développement ou back-end |
| Annotations de comportement | Détails stylistiques |

**Correction modèle mental**
❌ Idée reçue : "Un wireframe doit être le plus fidèle possible pour que le client comprenne."
✅ Approche correcte : Un wireframe trop fidèle déplace les retours vers le style visuel (couleurs, polices) plutôt que vers la structure. Garder intentionnellement le wireframe peu stylisé force l'attention sur ce qui compte : l'architecture.
KPI impacté : vitesse d'itération, qualité des retours de tests utilisateurs.

---

### 4.3 IA pour la génération rapide de wireframes

**Modèle mental**
Les outils d'IA génèrent des wireframes ou des suggestions de layout à partir d'une description textuelle ou d'une intention de contenu. Ils accélèrent la phase d'exploration mais ne remplacent pas la connaissance du contexte utilisateur, des contraintes métier et de la psychologie de perception.

**Analogie stable**
L'IA comme générateur de premier jet : elle produit 10 variations d'une structure en 2 minutes — ce qui aurait pris une journée à la main. Le designer choisit, combine et adapte selon sa connaissance du contexte. C'est un amplificateur d'exploration, pas un remplaçant du jugement.

**Outils IA de wireframing et suggestions layout**

| Outil | Capacité IA | Usage |
|---|---|---|
| Figma (IA intégrée) | Génération de layouts, auto-layout, suggestions | Wireframing et UI dans le même outil |
| Uizard | Sketch → wireframe automatique, génération depuis description | Idéation rapide |
| Galileo AI | Génération d'UI complète depuis prompt textuel | Exploration de concepts |
| Visily | Conversion screenshot → wireframe éditable | Benchmark compétitif |
| Locofy | Wireframe → code (React, Next.js) | Handoff développement |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Nombre d'alternatives explorées avant validation | Time-to-first-prototype réduit |
| Taux de retours structurels en tests | Coût de re-design |
| Vitesse d'itération (cycles/semaine) | Time-to-market |

---

## 5. Interaction Design avancé

### 5.1 Micro-interactions — Design et intention

**Modèle mental**
Une micro-interaction est un mécanisme de design à échelle réduite qui gère une seule tâche spécifique. Elle communique l'état du système, confirme une action, prévient une erreur ou crée un moment de plaisir. Cumulées, les micro-interactions définissent la personnalité d'un produit.

**Analogie stable**
La poignée de main : un geste fonctionnel (salutation) chargé d'informations émotionnelles (confiance, énergie, chaleur). Une interface sans micro-interactions est comme une conversation sans expressions faciales — fonctionnelle mais froide.

**Anatomie d'une micro-interaction (Saffer)**

| Composante | Question | Exemple |
|---|---|---|
| Déclencheur | Qu'est-ce qui l'active ? | Clic sur "J'aime" |
| Règle | Que se passe-t-il ? | Le cœur passe de gris à rouge, compteur +1 |
| Feedback | Comment l'utilisateur le perçoit ? | Animation "rebond" du cœur, vibration haptique |
| Boucle/Mode | Y a-t-il des conditions spéciales ? | Animation différente si premier "J'aime" |

**Bonnes pratiques**

1. **Purposeful** : chaque micro-interaction a une raison fonctionnelle claire
2. **Discret** : ne pas détourner l'attention de la tâche principale
3. **Cohérent** : même langage d'animation dans tout le produit
4. **Performant** : < 400ms pour les feedbacks d'actions, 200-300ms idéal
5. **Désactivable** : option de réduction des animations (accessibilité vestibulaire)

---

### 5.2 Transitions et animations

**Modèle mental**
Les transitions entre états ou écrans ne sont pas décoratives : elles communiquent la relation spatiale entre les éléments (où suis-je allé ? D'où vient ce panneau ?), réduisent la désorientation et donnent de la consistance au modèle mental de l'utilisateur.

**Analogie stable**
La carte géographique vs téléportation : si une application change d'écran instantanément sans transition, l'utilisateur "téléporte" — il perd le sens de l'espace. Une transition directionnelle lui montre qu'il "avance" dans l'arborescence ou "glisse" vers un panneau adjacent.

**Principes d'animation UX (Google Material, Apple HIG)**

| Principe | Description | Exemple |
|---|---|---|
| Naturel | Suit les lois physiques (inertie, gravité) | Élément qui glisse avec décélération |
| Intentionnel | Guide l'attention vers ce qui importe | Bouton qui pulse après une action |
| Économe | Minimum d'animation pour l'effet voulu | Fade-in discret plutôt que rotation complexe |
| Cohérent | Même timing et courbe d'animation partout | Système de tokens d'animation |
| Accessible | Option prefers-reduced-motion respectée | Transitions désactivables |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux d'erreur de navigation (désorientation) | Taux d'abandon |
| Score de plaisir UX (enquête) | NPS, mémorabilité marque |
| Performance perçue (temps subjectif) | Taux de complétion |

---

## 6. UX Writing & Microcopy

### 6.1 Fondements de l'UX Writing

**Modèle mental**
L'UX Writing est la discipline qui conçoit les textes fonctionnels d'une interface — boutons, labels, messages d'erreur, notifications, confirmations, onboarding. Ces textes ne sont pas des contenus rédactionnels : ce sont des éléments de design fonctionnel au même titre que les boutons et les icônes.

**Analogie stable**
Les panneaux de signalisation routière : un panneau "Stop" ne décrit pas une philosophie de l'arrêt — il déclenche une action immédiate. La microcopy fait pareil : elle déclenche des actions, oriente, rassure, en utilisant le moins de mots possible.

**Comparaison — Avant/Après UX Writing**

| Contexte | Avant (texte génériq.) | Après (UX Writing) |
|---|---|---|
| Bouton de validation | "Soumettre" | "Créer mon compte" |
| Message d'erreur | "Erreur 404" | "Cette page n'existe plus — voici ce que vous cherchiez peut-être" |
| Champ vide | "Nom" | "Votre prénom (visible des autres membres)" |
| Notification push | "Nouvelle notification" | "Marie vient de commenter votre post" |
| Onboarding vide state | "Aucun contenu" | "Votre espace est prêt — commencez par créer votre premier projet" |
| Confirmation suppression | "Êtes-vous sûr ?" | "Supprimer « Projet Alpha » ? Cette action est irréversible." |

---

### 6.2 Principes clés de la microcopy

**Modèle mental**
La microcopy efficace est utile, claire, concise et cohérente avec le ton de la marque. Elle anticipe les doutes de l'utilisateur et y répond au bon moment, au bon endroit.

**Les 5C de l'UX Writing**

| Principe | Description | Exemple appliqué |
|---|---|---|
| Clarté | L'utilisateur comprend immédiatement | "Connexion" plutôt que "Authentification" |
| Concision | Minimum de mots pour le maximum de sens | "Envoyer" plutôt que "Procéder à l'envoi" |
| Contextuel | Le texte est pertinent à l'endroit précis | Aide sur le champ qui en a besoin, pas en intro |
| Cohérent | Même terme pour le même concept | Pas "Connexion" ici et "Login" ailleurs |
| Conversationnel | Ton humain, pas bureaucratique | "On ne trouve pas votre email" vs "Identifiant inconnu" |

---

### 6.3 Messages d'erreur — Anatomie

**Modèle mental**
Un bon message d'erreur est une occasion manquée de rompre la relation utilisateur-produit — ou une opportunité de la renforcer. Un mauvais message d'erreur bloque l'utilisateur sans lui donner les moyens de débloquer.

**Anatomie d'un message d'erreur efficace**

| Composante | Contenu | Mauvais exemple | Bon exemple |
|---|---|---|---|
| Quoi | Ce qui s'est passé | "Erreur" | "Votre paiement n'a pas abouti" |
| Pourquoi | La cause (si utile) | — | "Votre carte expire ce mois-ci" |
| Comment | La solution | "Réessayez" | "Mettez à jour votre moyen de paiement" |
| Ton | Empathique, non-blâmant | "Vous avez saisi un mauvais mot de passe" | "Ce mot de passe ne correspond pas — vous pouvez le réinitialiser" |

**Points éthiques & inclusivité**
- Ne jamais blâmer l'utilisateur dans un message d'erreur ("Vous avez oublié de...").
- Utiliser un langage neutre et accessible (niveau B1 de clarté linguistique recommandé).
- Prévoir des messages d'erreur pour les cas d'accessibilité (ARIA live regions pour les lecteurs d'écran).

---

### 6.4 IA pour l'UX Writing adaptatif

**Modèle mental**
Les outils d'IA peuvent suggérer des variantes de microcopy selon le contexte, le ton de marque défini et les données comportementales (quel texte de CTA a le meilleur taux de clic ?). L'IA accélère la génération et l'A/B testing à grande échelle.

**Capacités IA en UX Writing**

| Capacité | Description | Outil exemple |
|---|---|---|
| Génération de variantes | 10 formulations alternatives d'un même CTA | ChatGPT, Claude, Copy.ai |
| Adaptation au ton de marque | Réécrire en respectant la voix définie | Claude avec prompt système |
| A/B test à grande échelle | Tester des variantes sur segments utilisateurs | Optimizely + IA |
| Détection d'incohérences | Identifier les termes utilisés de manière incohérente | Analyse de corpus (Notion AI, Grammarly) |
| Localisation | Adapter le ton et le registre par langue/culture | DeepL + révision humaine |

**Correction modèle mental**
❌ Idée reçue : "L'IA peut écrire toute la microcopy — c'est juste du texte."
✅ Approche correcte : L'IA génère des variantes pertinentes mais ne comprend pas le contexte émotionnel fin, les nuances culturelles locales, et peut perpétuer des biais de langage. Un UX Writer humain valide, sélectionne et raffine.
KPI impacté : taux de clic sur CTA, taux de complétion, CSAT sur les messages d'erreur.

---

## 7. Design critique & feedback structuré

### 7.1 Design Critique — Principes

**Modèle mental**
La critique de design est un processus structuré d'évaluation d'une solution par rapport à des critères définis (objectifs utilisateurs, principes de design, contraintes). Elle est distincte de l'opinion ("Je n'aime pas cette couleur") : elle relie l'observation à l'impact sur l'utilisateur.

**Analogie stable**
La critique filmique professionnelle vs "j'ai aimé/pas aimé ce film" : un critique analyse la narration, la direction d'acteurs, la cohérence artistique — en reliant ses observations à des critères identifiables. La critique de design fait pareil avec les principes UX.

**Structure d'une critique de design productive**

| Étape | Description | Exemple |
|---|---|---|
| 1 — Contexte | Rappeler l'objectif et le problème utilisateur | "Le but est de réduire le taux d'abandon du formulaire d'inscription" |
| 2 — Observation | Décrire ce qui est vu, sans jugement | "Le CTA est en dessous de la ligne de flottaison" |
| 3 — Impact | Relier à l'utilisateur ou au KPI | "Les utilisateurs sur mobile ne le voient pas sans scroller" |
| 4 — Suggestion | Proposer une alternative constructive | "Envisager un CTA sticky en bas d'écran" |
| 5 — Validation | Tester ou mesurer l'impact de la modification | "A/B test sur 2 semaines, mesurer le taux de complétion" |

**Correction modèle mental**
❌ Idée reçue : "La critique de design est subjective — tout le monde a son avis."
✅ Approche correcte : La critique de design efficace est ancrée dans des critères objectifs (heuristiques de Nielsen, principes de Gestalt, données comportementales). Elle répond à "Cela sert-il l'objectif utilisateur ?" pas à "Est-ce que ça me plaît ?"
KPI impacté : qualité des itérations, réduction du nombre de cycles de révision.

---

### 7.2 Heuristiques de Nielsen comme grille de critique

**Les 10 heuristiques de Nielsen — Application rapide**

| Heuristique | Question de critique | Exemple de violation |
|---|---|---|
| Visibilité du statut système | "L'utilisateur sait-il toujours où il en est ?" | Upload sans indicateur de progression |
| Correspondance monde réel | "Les termes sont-ils ceux de l'utilisateur ?" | "Initialiser la session" vs "Connexion" |
| Contrôle utilisateur | "Peut-il annuler et revenir en arrière ?" | Suppression sans possibilité d'annulation |
| Cohérence & standards | "Les conventions sont-elles respectées ?" | Bouton "Fermer" à gauche sur iOS |
| Prévention d'erreur | "Le design évite-t-il les erreurs ?" | Formulaire sans validation en temps réel |
| Reconnaissance vs rappel | "L'utilisateur se souvient-il de tout ?" | Menu déroulant sans valeur par défaut visible |
| Flexibilité & efficacité | "Les experts peuvent-ils aller plus vite ?" | Pas de raccourcis clavier |
| Esthétique & minimalisme | "Y a-t-il des informations inutiles ?" | Écran d'accueil surchargé de texte |
| Aide à la récupération | "Les erreurs sont-elles réparables ?" | Message d'erreur sans action corrective |
| Aide & documentation | "L'aide est-elle trouvable et utile ?" | FAQ introuvable sans moteur de recherche |

---

## 8. Conception pour la charge cognitive

### 8.1 Simplification et hiérarchisation

**Modèle mental**
La simplification n'est pas d'enlever des fonctionnalités — c'est de réduire la charge mentale nécessaire pour les utiliser. Une interface peut être fonctionnellement riche et cognitivement simple si la hiérarchie visuelle guide efficacement l'attention.

**Analogie stable**
Le cockpit d'avion vs le tableau de bord d'une voiture citadine : le cockpit d'avion a des centaines d'instruments — mais chaque instrument est à sa place logique, regroupé par fonction, et les instruments critiques sont les plus visibles. Ce n'est pas simple, mais c'est bien organisé pour ceux qui le connaissent.

**Techniques de simplification**

| Technique | Description | Exemple concret |
|---|---|---|
| Progressive disclosure | Montrer l'essentiel d'abord, détails sur demande | "Paramètres avancés" en accordéon |
| Chunking | Regrouper les éléments liés | Adresse = 1 groupe, pas 4 champs isolés |
| Defaults intelligents | Pré-remplir avec des valeurs optimales | Pays pré-sélectionné selon géolocalisation |
| Élimination | Supprimer ce qui n'aide pas la tâche principale | Une action primaire par écran |
| Familiarité | Utiliser des patterns standards | Bouton hamburger pour menu mobile |

---

### 8.2 Chunking — Théorie et application

**Modèle mental**
Le chunking consiste à regrouper des éléments d'information en unités significatives plus larges. La mémoire de travail traite un chunk (unité) comme un seul élément, quelle que soit sa complexité interne — à condition que le chunk soit familier et cohérent.

**Analogie stable**
Un numéro de téléphone : "06 12 34 56 78" est beaucoup plus mémorisable que "0612345678" — même information, même nombre de chiffres, mais le découpage en chunks de 2 réduit la charge de mémorisation.

**Application en design de formulaires**

| Sans chunking ❌ | Avec chunking ✅ |
|---|---|
| 8 champs à la suite | 3 sections (Identité / Coordonnées / Paiement) |
| Numéro de carte en 1 champ | 4 groupes de 4 chiffres |
| Toutes les options visibles | Options groupées par catégorie |
| Informations légales mélangées | Résumé + lien "En savoir plus" |

---

### 8.3 Hiérarchie visuelle

**Modèle mental**
La hiérarchie visuelle guide le regard selon l'importance relative des éléments. Elle utilise la taille, le poids, la couleur, l'espace et la position pour communiquer "Regardez ici d'abord, puis là, puis là."

**Les leviers de la hiérarchie visuelle**

| Levier | Usage | Impact cognitif |
|---|---|---|
| Taille | H1 > H2 > corps | Structure immédiatement perçue |
| Contraste | Texte foncé sur fond clair | Lisibilité et attention |
| Couleur | Couleur d'accent sur l'action principale | Guidage du regard vers le CTA |
| Espace blanc | Séparation entre groupes | Réduction de la densité perçue |
| Position | Haut-gauche = premier lu (cultures LTR) | Placement stratégique du plus important |
| Poids | Gras pour les termes clés | Facilite le scan |

**KPIs liés**

| KPI UX | KPI Business |
|---|---|
| Taux de complétion des formulaires | Conversion funnel |
| Eye-tracking : ordre de fixation | CTR sur éléments clés |
| Taux d'erreur utilisateur | Coûts de support |
| Temps sur tâche | Engagement, NPS |

---

## 9. Livrables typiques UX

### 9.1 Vue d'ensemble des livrables

**Modèle mental**
Les livrables UX sont des artéfacts de communication — ils communiquent une décision de design, un flux, une structure ou une intention à une audience spécifique (équipe, client, développeur, testeur). Chaque livrable doit répondre à la question "Pour qui ? Pour quelle décision ?"

**Matrice des livrables UX**

| Livrable | Phase | Audience principale | Format |
|---|---|---|---|
| User flow | Idéation | Équipe design, PM | Diagramme (Miro, Figma) |
| Storyboard | Idéation / Recherche | Stakeholders, équipe | Croquis + narration |
| Wireframe (basse fi) | Conception | Équipe design, PM | Miro, Balsamiq |
| Wireframe (haute fi) | Conception | Développeurs, clients | Figma |
| Prototype interactif | Test | Utilisateurs, développeurs | Figma, InVision |
| Design system / UI Kit | Production | Développeurs, designers | Figma |
| Spécifications techniques | Handoff | Développeurs | Figma (annotations), Zeplin |
| Rapport de test utilisateur | Post-test | PM, stakeholders | Document + vidéos |

---

### 9.2 Wireframes — Standards de documentation

**Ce qu'un wireframe livrable doit documenter**

| Élément | Description |
|---|---|
| Titre de l'écran | Nom et numéro de version |
| Contexte d'usage | Sur quel device ? À quelle étape du flow ? |
| États de l'écran | État vide, état chargé, état d'erreur, état de succès |
| Annotations | Comportements interactifs, règles de gestion, cas particuliers |
| Légende | Si des conventions symboliques sont utilisées |

---

### 9.3 Prototypes testables — Critères de qualité

**Modèle mental**
Un prototype testable est le minimum nécessaire pour obtenir des retours valides sur une hypothèse spécifique. Il n'a pas besoin d'être exhaustif — il doit couvrir exactement le scénario qu'on cherche à tester.

**Critères d'un bon prototype testable**

| Critère | Description |
|---|---|
| Scénario défini | Le test porte sur 1-3 tâches claires |
| Fidelité adaptée | Suffisamment réaliste pour que l'utilisateur s'immerge |
| États couverts | États principaux du happy path + 1-2 cas d'erreur |
| Neutralité | Ne guide pas l'utilisateur vers la "bonne" réponse |
| Reset possible | On peut recommencer le test depuis le début |

---

## 10. Outils de conception UX

### 10.1 Vue d'ensemble des outils

**Modèle mental**
Les outils sont des amplificateurs de méthode, pas des méthodes en eux-mêmes. Maîtriser Figma sans comprendre la hiérarchie visuelle ou les principes de Gestalt produit de beaux pixels sans valeur UX. Comprendre les méthodes permet de les appliquer avec n'importe quel outil.

**Comparaison des outils principaux**

| Outil | Usage principal | Points forts | Limites |
|---|---|---|---|
| Figma | Wireframing, prototypage, design system, handoff | Collaboratif temps réel, composants, dev mode | Courbe d'apprentissage, coût équipe |
| Miro | Ateliers, mind maps, user flows, storyboards | Infiniment flexible, collaboratif, templates | Pas de design visuel précis |
| Whimsical | Wireframes rapides, user flows, mind maps | Très rapide, simple, export propre | Moins puissant que Figma |
| Maze | Tests utilisateurs, tree testing, 5-second test | Autonome (sans modérateur), analytics | Pas de test qualitatif profond |
| Balsamiq | Wireframes basse fidélité | Intentionnellement sketch, rapide | Pas de prototypage avancé |
| Notion / Confluence | Documentation, spécifications | Intégration facile au workflow | Pas de design visuel |

---

### 10.2 Figma — Concepts clés UX

**Fonctionnalités clés pour le travail UX**

| Fonctionnalité | Usage UX | Bénéfice |
|---|---|---|
| Components & variants | Design system, cohérence | Modifier 1 composant = modifier partout |
| Auto-layout | Responsive wireframes | Simule le comportement réel du layout |
| Prototype mode | Flows interactifs, transitions | Tests utilisateurs sans développement |
| Dev mode | Handoff développeurs | Specs CSS, mesures, assets exportables |
| FigJam | Ateliers collaboratifs | Sticky notes, votes, timers intégrés |
| Variables | Thèmes, dark mode | Design adaptatif sans duplication |

---

### 10.3 IA intégrée aux outils de conception

**Évolution de l'IA dans les outils UX (2024-2026)**

| Capacité IA | Outil | Impact sur le workflow |
|---|---|---|
| Génération de layouts depuis prompt | Figma (IA), Uizard | Réduction du temps d'exploration initiale |
| Auto-remplissage de contenu | Figma Content Reel | Prototypes plus réalistes sans données réelles |
| Suggestions d'accessibilité | Figma Accessibility Checker | Détection automatique des problèmes WCAG |
| Analyse de heatmaps prédictives | Attention Insight (plugin Figma) | Validation visuelle sans test utilisateur |
| Génération de microcopy | ChatGPT / Claude (via prompt) | Variantes rapides de boutons, labels, erreurs |
| Conversion wireframe → code | Locofy, Anima | Accélération du handoff |

**Correction modèle mental**
❌ Idée reçue : "Utiliser l'IA dans le design UX accélère tout le processus."
✅ Approche correcte : L'IA accélère la génération, pas la compréhension. La phase de recherche utilisateur, la définition du problème et la critique de design requièrent toujours un jugement humain nourri de connaissance du contexte.
KPI impacté : time-to-prototype réduit, diversité des explorations, qualité du handoff.

---

## Synthèse — KPIs conception & idéation

| Phase | Activité clé | KPI UX | KPI Business |
|---|---|---|---|
| Idéation | Brainstorming, Crazy 8s | Diversité solutions générées | Réduction coût re-design |
| Exploration | Storyboards, user flows | Cohérence parcours validée | Alignement équipe |
| Architecture | Card sorting, tree testing | Taux succès findability (>70%) | Réduction taux de rebond |
| Wireframing | Maquettes basse/haute fi | Vitesse d'itération | Time-to-prototype |
| Interaction | Micro-interactions, transitions | SUS score, satisfaction | NPS, rétention |
| UX Writing | Microcopy, messages d'erreur | Taux de complétion, erreurs | Conversion, coût support |
| Critique | Design review structurée | Qualité des itérations | Cycles de révision réduits |
| Test | Prototypes testables | Task success rate | Coût de re-design évité |

---

> **Principe directeur de la conception UX** : Concevoir, c'est toujours choisir — choisir quoi montrer et quoi cacher, quoi simplifier et quoi garder, quoi dire et comment le dire. Ces choix ne sont pas neutres : ils reflètent des valeurs, des hypothèses sur les utilisateurs et des priorités business. Un bon designer les rend explicites, les questionne et les ancre dans des données et des principes, pas dans des préférences personnelles.
