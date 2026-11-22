# Section 1 — Stratégie produit & Product Thinking — Exercices

> **Mode d'emploi** : Travaille d'abord le Bloc 1 (exercices seuls) sans consulter les corrections. Note tes réponses par écrit. Ensuite seulement, ouvre le Bloc 2 pour confronter ton raisonnement.

---

## Concept 1 — Vision & Mission Produit

### BLOC 1 — Exercices

---

#### Exercice 1.1 — Traduction mentale

**Question amorce :** *Comment aborderais-tu ce problème avec ta compréhension actuelle ?*

**Contexte :** Tu rejoins **Luma**, une plateforme SaaS B2B d'onboarding RH destinée aux PME européennes (50–500 salariés). Le produit existe depuis 3 ans mais l'équipe n'a jamais formalisé de vision produit. Chaque trimestre, les features sont décidées en réunion entre le CEO, le lead dev et les deux Sales. L'équipe grandit (12 personnes) et les décisions deviennent conflictuelles.

**Ta mission :** Le CEO te demande de l'aider à poser la vision produit de Luma pour les 3 prochaines années.

**Questions :**
1. Par où commences-tu ? Quelles informations collectes-tu en premier ?
2. Quelle différence fais-tu entre vision, mission et stratégie produit ?
3. Comment t'assures-tu que la vision reste centrée sur l'utilisateur et pas uniquement sur les ambitions business ?
4. Quel format proposes-tu pour rendre cette vision actionnable par toute l'équipe ?

---

#### Exercice 1.2 — Piège de paradigme

**Question amorce :** *Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?*

**Scénario :** L'équipe produit de **Careo**, une app mobile de suivi de santé mentale pour les 18–35 ans, vient de définir sa vision produit :

> *"Devenir l'app numéro 1 de bien-être mental en Europe d'ici 2027, avec 5 millions d'utilisateurs actifs et un ARR de 20M€."*

Lors de la roadmap planning, toutes les décisions de features sont évaluées à l'aune de cette vision. L'équipe décide d'ajouter un système de gamification (badges, streaks, leaderboards entre amis) pour augmenter le DAU et la rétention.

**Questions :**
1. Identifie les problèmes dans la formulation de la vision produit.
2. Identifie le ou les dark patterns potentiels dans la décision de gamification. ❌
3. Quels KPI UX et business seraient négativement impactés à moyen terme ?
4. Reformule une vision produit plus appropriée pour Careo.

---

#### Exercice 1.3 — Mini-cas réel

**Question amorce :** *Décris ton modèle mental AVANT de commencer. Détaille comment tu implémenterais la solution et quels KPI tu suivrais.*

**Contexte produit :** **Schoolify** est une plateforme éducative B2C en croissance rapide (SaaS, freemium) qui propose du soutien scolaire en ligne pour les élèves de 10 à 18 ans. La plateforme compte 200 000 utilisateurs gratuits et 15 000 abonnés payants. Les parents financent l'abonnement mais ce sont les élèves qui utilisent le produit.

**Problème utilisateur :** Le taux de conversion freemium → payant stagne à 7,5% depuis 8 mois. Les entretiens utilisateurs révèlent que les parents ne comprennent pas la valeur du produit ("je ne vois pas ce que mon enfant y fait") tandis que les élèves perçoivent le produit comme "une corvée supplémentaire".

**Dimension éthique :** La plateforme cible des mineurs. Certains collègues proposent d'utiliser des mécaniques de persuasion (urgence artificielle, FOMO, notifications push agressives vers les élèves) pour accélérer la conversion.

**Ta mission :**
1. Décris ton modèle mental de la situation (qui sont vraiment les utilisateurs ? quels sont leurs besoins distincts ?).
2. Reformule la vision produit de Schoolify en intégrant la dualité parent/élève.
3. Propose une stratégie pour améliorer le taux de conversion sans recourir à des dark patterns. ❌
4. Quels KPI UX et business mettras-tu en place pour mesurer le succès ?
5. Comment intègres-tu les contraintes éthiques liées aux mineurs dans la vision produit ?

---

### BLOC 2 — Corrections

---

#### Correction 1.1 — Traduction mentale

**Modèle mental attendu :**
Comprendre que la vision produit n'est pas un slogan marketing mais un cap nord permanent qui guide chaque décision. Elle doit répondre à "pourquoi ce produit existe-t-il dans le monde ?" et non "quels revenus veut-on atteindre ?".

**Raisonnement UX/Product :**

La vision produit est l'outil de cohérence stratégique le plus puissant d'une équipe produit. Sans elle, chaque décision est locale, défendue par la personne la plus persuasive dans la salle (le CEO, les Sales) plutôt que par la valeur créée pour l'utilisateur.

**Solution détaillée :**

**Étape 1 — Collecte d'informations (avant d'écrire une seule ligne)**
- Interviews internes : CEO, Sales, Customer Success, développeurs → "Pourquoi travailles-tu ici ? Qu'est-ce que ce produit change pour nos clients ?"
- Interviews clients actuels : "Quel problème Luma résout-il dans votre quotidien RH ?" / "Comment feriez-vous sans ?"
- Analyse des churns récents : pourquoi des clients sont-ils partis ?
- Revue des tickets support pour identifier les douleurs récurrentes

**Étape 2 — Différencier vision / mission / stratégie**
- **Vision** : état du monde que le produit cherche à créer (horizon 3–5 ans, inspirante, durable). Ex : *"Un monde où chaque nouveau salarié se sent attendu et intégré dès son premier jour."*
- **Mission** : comment le produit contribue à cette vision (ce qu'on fait concrètement). Ex : *"Nous aidons les PME à transformer l'onboarding en expérience mémorable grâce à des outils simples et humains."*
- **Stratégie** : les choix clés pour y parvenir (segments cibles, différenciation, modèle économique)

**Étape 3 — Ancrage utilisateur**
Tester la vision avec la question "So what ?" : pour chaque affirmation, demande "et alors, en quoi est-ce important pour l'utilisateur final ?" Si la réponse reste interne ("pour faire du chiffre"), la vision n'est pas centrée utilisateur.

**Étape 4 — Format actionnable**
- Vision en 1 phrase mémorable (test : un développeur peut-il la réciter de mémoire ?)
- Principes produits (3–5 règles de décision dérivées de la vision)
- Test de cohérence : avant chaque décision feature, demander "est-ce que cela nous rapproche de notre vision ?"

**KPIs impactés :**
- UX : satisfaction des utilisateurs onboardés (SUS, NPS produit)
- Business : réduction du temps de décision feature (-30% attendu), réduction du churn (vision = cohérence = produit plus pertinent), taux de recommandation B2B

**Erreurs classiques :**
- Confondre vision et objectifs financiers ("être leader du marché")
- Écrire la vision seul dans son coin sans input terrain
- Vision trop longue, incompréhensible, non mémorable
- Oublier les utilisateurs finaux (ici, les nouveaux salariés) au profit des acheteurs (les RH)

**Correction des biais cognitifs :**
- Biais de confirmation : les dirigeants entendent ce qu'ils veulent → inclure des voix discordantes dans les interviews
- Biais de disponibilité : se concentrer sur les clients les plus bruyants → équilibrer avec des clients silencieux et satisfaits

**Améliorations possibles :**
- Co-construire la vision avec un atelier "Future Press Release" (Amazon-style)
- Valider la vision avec 3–5 clients avant de la finaliser
- Créer une "vision board" physique visible dans les espaces de travail

---

**Feedback itératif — Concept 1 :**
*Correction du modèle mental :* La vision n'est pas un livrable ponctuel mais un outil de navigation permanent — elle se teste, se révise, se mémorise.
*Points d'amélioration :* Ancrer systématiquement la vision dans la voix des utilisateurs avant de la formaliser.
*Synthèse :* **La vision produit vaut par sa capacité à refuser une feature autant que par sa capacité à en justifier une.**

---

#### Correction 1.2 — Piège de paradigme

**Modèle mental attendu :**
Une vision centrée sur des métriques internes (parts de marché, ARR) n'est pas une vision produit — c'est un objectif business. Elle ne guide pas les décisions UX et peut mener à des choix nuisibles pour les utilisateurs.

**Raisonnement UX/Product :**

**Problèmes dans la vision de Careo :**
1. **Orientée vanity metrics** : "5 millions d'utilisateurs" et "ARR 20M€" sont des résultats souhaités, pas une raison d'être. Ils ne répondent pas à "pourquoi ce produit existe-t-il ?"
2. **Absence de l'utilisateur** : aucune mention de l'impact sur la santé mentale des utilisateurs
3. **Compétition comme boussole** : "numéro 1" oriente vers la concurrence, pas vers la valeur créée
4. **Temporalité rigide** : "d'ici 2027" transforme la vision en objectif trimestriel

**Dark patterns dans la gamification ❌ :**
- **Streak shaming** : pénaliser l'interruption d'une série de sessions crée une anxiété artificielle — particulièrement toxique dans une app de santé mentale
- **Leaderboard entre amis** : induit de la comparaison sociale et de la honte, contre-productif pour des utilisateurs vulnérables
- **Variable reward / infinite scroll** : mécaniques addictives qui exploitent les circuits dopaminergiques — éthiquement inacceptable dans ce contexte
- **Badge collecting** : déplace la motivation intrinsèque (aller mieux) vers la motivation extrinsèque (collecter des récompenses), fragilisant la rétention à long terme

**KPI négativement impactés à moyen terme :**
- UX : SUS (perception de qualité), NPS (recommandation), satisfaction perçue → baisse probable quand les utilisateurs réalisent la manipulation
- Business : taux de rétention long terme (churn spike à 3–6 mois), reviews App Store/Google Play, presse spécialisée (réputation)
- Santé : risque de iatrogénèse numérique (aggraver l'état de santé mentale des utilisateurs les plus fragiles)

**Vision reformulée :**
> *"Aider chaque jeune adulte à comprendre ses émotions et à développer des ressources intérieures durables, à son rythme et sans jugement."*

Cette vision :
- Centre l'utilisateur (pas les métriques)
- Intègre la dimension éthique ("sans jugement", "à son rythme")
- Guide les décisions : une feature qui crée de l'urgence ou de la comparaison est incompatible avec cette vision

**KPIs impactés :**
- UX : SUS, NPS, taux de complétion des parcours thérapeutiques
- Business : rétention 6 mois, Net Revenue Retention, recommandation organique

**Erreurs classiques :**
- Copier les mécaniques de gamification de Duolingo ou Strava sans considérer le contexte d'usage (santé mentale ≠ apprentissage de langue)
- Confondre engagement (DAU) et valeur créée pour l'utilisateur
- Ignorer les effets de second ordre (un utilisateur "actif" mais anxieux est un futur churner et un vecteur de mauvaise réputation)

---

**Feedback itératif — Concept 1 (suite) :**
*Correction :* Les métriques de croissance sont des outputs, jamais des inputs de vision.
*Synthèse :* **Dans un produit de santé, chaque mécanique d'engagement doit passer le test éthique : "est-ce que cela aide l'utilisateur à aller mieux ou est-ce que cela l'exploite ?"**

---

#### Correction 1.3 — Mini-cas réel (Schoolify)

**Modèle mental attendu :**
Schoolify a deux types d'utilisateurs avec des besoins radicalement différents : les **payeurs** (parents, anxieux des résultats scolaires, ont besoin de preuves de valeur) et les **utilisateurs** (élèves, cherchent l'efficacité et le sens, pas une corvée). Une vision produit qui ignore cette dualité ne peut pas guider de bonnes décisions.

**Raisonnement UX/Product :**

**Qui sont vraiment les utilisateurs ?**
- **Parents** : décideurs financiers, besoin de contrôle, de réassurance, de preuves concrètes (progression, temps passé, résultats). Ils "achètent" la tranquillité d'esprit.
- **Élèves** : utilisateurs finaux, besoin d'efficacité, de pertinence ("est-ce que ça m'aide vraiment ?"), de contrôle sur leur propre parcours. Ils "vivent" le produit quotidiennement.
- **Enseignants** (utilisateurs secondaires) : potentiellement prescripteurs si le produit s'intègre à leur pratique.

**Vision produit reformulée :**
> *"Rendre chaque élève acteur de ses progrès, et chaque parent confident de l'accompagnement de son enfant."*

**Stratégie de conversion sans dark patterns :**

*Pour les parents :*
- Tableau de bord parental : progression visible, temps d'apprentissage, domaines travaillés (sans surveillance intrusive)
- Rapport de progrès hebdomadaire automatique par email ("Cette semaine, votre enfant a progressé de 12% en fractions")
- Témoignages et cas d'usage concrets sur la page de conversion (social proof authentique, pas fabriqué)
- Période d'essai premium vraiment engageante (pas juste "débloquer les exercices" mais accès à un diagnostic complet)

*Pour les élèves :*
- Onboarding centré sur leur propre objectif ("Quel est ton prochain exam ? Comment tu veux progresser ?")
- Système de progression intrinsèque (mastery-based, pas de comparaison sociale)
- Sessions courtes et efficaces (respect du temps des ados)
- Contenu pertinent et calibré à leur niveau réel (pas en dessous, pas au-dessus)

**Refus des dark patterns proposés ❌ :**
- Urgence artificielle ("offre expire dans 2h") : crée une défiance durable et est particulièrement problématique pour des mineurs
- FOMO entre élèves : peut aggraver l'anxiété scolaire existante
- Notifications push agressives vers les élèves : risque de renforcer l'association produit = contrainte, augmentant le churn

Alternative éthique : **Progressive disclosure de valeur** — montrer la valeur premium progressivement dans l'expérience gratuite, sans bloquer ni faire peur.

**KPIs à suivre :**

| KPI | Type | Cible |
|---|---|---|
| Taux de conversion freemium → payant | Business | +3 pts en 6 mois |
| NPS (parents) | UX | > 40 |
| NPS (élèves) | UX | > 30 |
| Taux de complétion des sessions | UX | > 70% |
| Rétention abonnés à 3 mois | Business | > 80% |
| DAU/MAU ratio (élèves) | Engagement | > 0,4 |
| Taux d'ouverture des rapports parents | Engagement | > 55% |

**Contraintes éthiques mineurs :**
- RGPD renforcé (données mineurs) : collecte minimale, consentement parental explicite
- Pas de mécaniques addictives (variable rewards, streaks punitifs)
- Droit à l'oubli facilement accessible
- Pas de publicité personnalisée ni de revente de données comportementales
- Design inclusif : accessibilité (dyslexie, TDAH), neutralité de genre dans les avatars et exemples

**Erreurs classiques :**
- Résoudre le problème de conversion uniquement côté parents sans améliorer l'expérience élève (les élèves sont les ambassadeurs les plus puissants du produit)
- Ajouter des features plutôt que de clarifier la valeur existante
- Confondre personnalisation et surveillance (les parents veulent être rassurés, pas espionner)

**Améliorations possibles :**
- Créer un "score de valeur perçue" composite (parent + élève) comme métrique nord
- Tester un format "rapport de rentrée" annuel envoyé aux parents comme déclencheur de conversion
- Explorer un modèle de parrainage entre parents (referral éthique, non intrusif)

---

**Feedback itératif — Concept 1 (fin) :**
*Synthèse du changement de paradigme :* **La vision produit n'est pas ce que tu veux construire — c'est le changement que tu veux provoquer dans la vie de tes utilisateurs.**

---

## Concept 2 — Lean Canvas & Value Proposition Canvas

### BLOC 1 — Exercices

---

#### Exercice 2.1 — Traduction mentale

**Question amorce :** *Comment aborderais-tu ce problème avec ta compréhension actuelle ?*

**Contexte :** **Meditcare** est une startup early-stage qui veut lancer une app de coordination de soins pour les aidants familiaux (personnes qui s'occupent d'un proche dépendant : parent âgé, enfant en situation de handicap). L'équipe de 4 personnes (2 développeurs, 1 designer, 1 CEO) vient de valider une idée et veut lancer son MVP dans 3 mois.

**Questions :**
1. Quelle est la différence entre un Business Model Canvas et un Lean Canvas ? Lequel utiliserais-tu ici et pourquoi ?
2. Quelles sont les sections les plus critiques à remplir en premier pour Meditcare ? Dans quel ordre et pourquoi ?
3. Comment distingues-tu "problème" et "solution" dans le Lean Canvas pour ne pas tomber dans le piège de la solution ?
4. Quels seraient les "Unfair Advantages" potentiels d'une app pour aidants familiaux ?

---

#### Exercice 2.2 — Piège de paradigme

**Question amorce :** *Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?*

**Scénario :** L'équipe de **Freshy**, une app de livraison de paniers bio en circuit court, a construit ce Value Proposition Canvas :

**Profil client :**
- Jobs : "avoir des légumes frais à la maison"
- Pains : "faire la queue au marché", "ne pas savoir cuisiner les légumes du panier"
- Gains : "manger sainement", "soutenir les producteurs locaux"

**Value Map :**
- Products & Services : "livraison de paniers bio chaque semaine"
- Pain Relievers : "livraison à domicile", "pas de déplacement"
- Gain Creators : "légumes de saison, frais, locaux"

L'équipe est satisfaite du fit et lance le produit. Après 4 mois, le taux de churn mensuel est de 35%.

**Questions :**
1. Identifie les lacunes du Value Proposition Canvas qui expliquent ce churn.
2. Quels Jobs-to-be-done ont été ignorés ?
3. Quels dark patterns ont pu être utilisés inconsciemment pour masquer ce problème au lancement ? ❌
4. Comment le VPC aurait dû être construit différemment ?

---

#### Exercice 2.3 — Mini-cas réel

**Question amorce :** *Décris ton modèle mental AVANT de commencer. Détaille comment tu implémenterais la solution et quels KPI tu suivrais.*

**Contexte produit :** **TalentBridge** est une plateforme SaaS B2B de recrutement inclusif à destination des entreprises qui veulent diversifier leurs équipes. La plateforme propose des outils d'anonymisation des CV et des algorithmes de matching basés sur les compétences (pas le parcours scolaire). Elle cible les DRH et managers de PME-ETI (100–2000 salariés).

**Problème utilisateur :** Après 18 mois de commercialisation, le taux d'adoption interne est faible : les managers (utilisateurs finaux qui reçoivent les candidatures anonymisées) contournent l'outil dès qu'ils le peuvent, demandant aux RH de leur envoyer les CVs complets. Le NPS est de -12.

**Dimension éthique :** La promesse du produit est de réduire les biais de recrutement. Des managers qui contournent l'outil reviennent de facto à des pratiques discriminatoires, même involontairement.

**Ta mission :**
1. Construis un Lean Canvas simplifié pour TalentBridge en identifiant le vrai problème.
2. Construis un Value Proposition Canvas pour le segment "managers" (pas les DRH).
3. Explique pourquoi le produit échoue d'un point de vue Value Proposition.
4. Propose une redesign de l'expérience produit qui réconcilie éthique et adoption.
5. Quels KPIs mesures-tu pour valider que la solution fonctionne ?

---

### BLOC 2 — Corrections

---

#### Correction 2.1 — Traduction mentale

**Modèle mental attendu :**
En phase early-stage, l'outil n'est pas une fin en soi — c'est un outil de pensée pour valider des hypothèses. Le Lean Canvas force à nommer explicitement ce qu'on ne sait pas encore.

**Solution détaillée :**

**BMC vs Lean Canvas :**
- Le **Business Model Canvas** est adapté aux entreprises existantes qui analysent leur modèle actuel
- Le **Lean Canvas** est fait pour les startups : il remplace "Activités clés / Ressources clés / Partenaires" par "Problème / Solution / Métriques clés / Avantage déloyal" — des blocs orientés validation d'hypothèses
- Choix pour Meditcare : **Lean Canvas**, car tout est hypothèse à ce stade

**Ordre de remplissage critique :**
1. **Problème** (et segments clients) : valider que le problème existe vraiment, qu'il est douloureux, et pour qui exactement
2. **Segments clients** (en parallèle) : aidants familiaux est un segment large — qui précisément ? Aidants de parents âgés ? D'enfants handicapés ? Actifs ou retraités ?
3. **Proposition de valeur unique** : en quoi est-ce différent de ce qui existe (carnet de santé papier, WhatsApp familial, appels au médecin) ?
4. **Solution** (en dernier !) : seulement après avoir validé le problème
5. **Canaux** : comment atteindre les aidants (souvent invisibles, peu organisés en communauté)
6. **Métriques clés** : qu'est-ce qui prouve que le produit marche ?
7. **Structure de coûts / Sources de revenus** : qui paie ? (L'aidant ? La mutuelle ? La collectivité ?)
8. **Avantage déloyal** en dernier (souvent le plus difficile à remplir honnêtement)

**Piège problème vs solution :**
- MAUVAIS : "Problème : les aidants n'ont pas d'app de coordination" (c'est une solution déguisée)
- BON : "Problème : les aidants passent 2–3h/semaine à coordonner les rendez-vous médicaux entre différents soignants sans outil partagé, ce qui génère des erreurs et un épuisement supplémentaire"

**Unfair Advantages potentiels :**
- Partenariats avec des associations d'aidants (France Alzheimer, APF France Handicap) → accès à une communauté difficile à atteindre
- Expertise médicale embedded (si un cofondateur a un background médical ou aidant)
- Intégration avec des logiciels de soins existants (DMP, logiciels d'EHPAD)
- Données de coordination de soins difficiles à répliquer (effet réseau entre soignants)

**KPIs impactés :**
- UX : taux de complétion du Lean Canvas (proxy de clarté stratégique), NPS équipe (cohésion)
- Business : time-to-first-paying-customer, CAC (Customer Acquisition Cost), LTV

---

#### Correction 2.2 — Piège de paradigme (Freshy)

**Modèle mental attendu :**
Le churn à 35%/mois signifie que le produit ne crée pas suffisamment de valeur pour que les clients restent. Le VPC est trop superficiel : il capture des jobs fonctionnels mais ignore les jobs émotionnels et sociaux, ainsi que les "switching costs" réels.

**Lacunes du VPC :**

**Jobs manquants :**
- "Savoir quoi cuisiner avec ce que j'ai" (job fonctionnel critique — ignoré)
- "Me sentir compétent en cuisine" (job émotionnel)
- "Faire plaisir à ma famille" (job social)
- "Éviter le gaspillage alimentaire" (job fonctionnel + valeur)
- "Gérer mon budget alimentaire" (job fonctionnel souvent décisif)

**Pains manquants :**
- "Je reçois des légumes que je ne sais pas cuisiner et qui finissent à la poubelle" (pain majeur = source de frustration et de culpabilité)
- "Le panier ne correspond pas à mes goûts/contraintes alimentaires (végétarien, allergies)"
- "Je ne suis pas là le jour de livraison"
- "Je ne peux pas ajuster la quantité selon mes besoins"

**Gains manquants :**
- "Réduire mon gaspillage alimentaire"
- "Découvrir de nouvelles recettes facilement"
- "Avoir de la flexibilité sur le panier"

**Dark patterns potentiels ❌ :**
- **Roach motel** : inscription simple mais désabonnement complexe (enfouissement du bouton "résilier", délai de 30 jours)
- **Confirmshaming** : "Non merci, je préfère les légumes industriels" pour décourager la résiliation
- **Free trial piège** : essai gratuit avec prélèvement automatique non annulé facilement
Ces pratiques retardent le churn apparent mais aggravent la défiance et le bouche-à-oreille négatif.

**VPC correct pour Freshy :**
Ajouter dans la Value Map :
- Pain Relievers : recettes suggérées pour chaque panier, option de personnalisation, flexibilité de livraison
- Gain Creators : calculateur d'économies CO2, conseils de conservation, communauté de recettes

**KPIs impactés :**
- UX : NPS (-35% dans ce scénario), SUS, taux de complétion (utilisation des recettes suggérées)
- Business : churn mensuel (35% → cible < 8%), LTV, CAC/LTV ratio

---

#### Correction 2.3 — Mini-cas réel (TalentBridge)

**Modèle mental attendu :**
TalentBridge a fait l'erreur classique du B2B : vendre à un acheteur (DRH) sans concevoir pour l'utilisateur final (managers). Le DRH adopte le discours de l'inclusion mais le manager, sous pression de temps et d'efficacité, vit le produit comme une contrainte sans valeur perçue.

**Lean Canvas simplifié :**

| Bloc | Contenu |
|---|---|
| **Problème** | 1. Les managers perçoivent l'anonymisation comme un handicap à leur prise de décision. 2. Les biais implicites persistent même avec les bons outils si ceux-ci ne sont pas adoptés. 3. Les DRH n'ont pas de visibilité sur les contournements. |
| **Segment client** | DRH (acheteurs) + Managers (utilisateurs critiques) — deux personas distincts |
| **UVP** | "Recrutez sur les compétences réelles, pas les parcours supposés — et constatez la différence en 3 mois." |
| **Solution** | Outil de matching compétences + feedback manager intégré + tableau de bord diversité pour DRH |
| **Canaux** | Réseaux RH, cabinets de conseil RH, Label Diversité |
| **Métriques clés** | Taux d'adoption managers, taux de contournement, diversité des recrutements |
| **Avantage déloyal** | Données de recrutement anonymisé à grande échelle, partenariats avec organismes de certification diversité |
| **Structure coûts** | Développement produit, Customer Success, conformité RGPD |
| **Revenus** | Abonnement SaaS par volume de recrutements |

**Value Proposition Canvas — segment Managers :**

*Profil Manager :*
- Jobs : "Recruter vite et bien", "Prendre des décisions de recrutement en confiance", "Ne pas se tromper de profil"
- Pains : "Je ne comprends pas pourquoi ce candidat a été sélectionné", "Je perds du temps à naviguer dans l'outil", "Je n'ai pas les infos dont j'ai besoin pour décider"
- Gains : "Voir rapidement les compétences clés", "Avoir confiance dans le matching", "Gagner du temps"

*Value Map :*
- Products & Services : interface manager simplifiée, explication du scoring de matching
- Pain Relievers : onboarding manager en < 10 min, explication pédagogique de chaque recommandation ("Ce candidat est recommandé parce que...")
- Gain Creators : gain de temps mesuré (badge "Décision en < 15 min"), amélioration des équipes (data sur la diversité des performances)

**Pourquoi le produit échoue :**
Le produit a été conçu du point de vue de la compliance (réduire les biais légalement) et non du point de vue de la valeur perçue par le manager. Pour le manager, l'anonymisation enlève de l'information sans lui en donner une autre en retour. Le produit ne résout pas son job principal : "recruter vite et bien".

**Redesign éthique et adoptable :**
1. Remplacer "CV anonymisé + score" par "Profil de compétences détaillé + contexte pertinent" (le manager a plus d'info, pas moins)
2. Ajouter une explication pédagogique courte de chaque recommandation (confiance dans l'algo)
3. Dashboard manager : "Vos recrutements ce mois / Taux de match à 3 mois" → valeur perçue concrète
4. Formation intégrée (micro-learning 5 min sur les biais inconscients) → le manager devient acteur du changement, pas victime d'un outil imposé
5. Rapport de diversité automatique pour le manager (pas seulement pour le DRH) → fierté et ownership

**KPIs :**

| KPI | Type | Cible |
|---|---|---|
| Taux d'adoption managers (usage hebdomadaire) | UX | > 75% |
| Taux de contournement (CVs complets demandés) | UX | < 5% |
| NPS managers | UX | > 30 (depuis -12) |
| Task success rate (décision < 20 min) | UX | > 80% |
| Diversité des recrutements à 6 mois | Business/Impact | +15% profils atypiques |
| Rétention client (DRH) à 12 mois | Business | > 85% |

**Erreurs classiques :**
- Concevoir pour l'acheteur, pas pour l'utilisateur
- Présenter l'éthique comme une contrainte plutôt que comme une valeur
- Ignorer le change management lors de l'implémentation d'un outil qui modifie des pratiques

---

**Feedback itératif — Concept 2 :**
*Correction :* Le Value Proposition Canvas n'est pas un exercice de marketing — c'est une hypothèse à valider sur le terrain avec de vrais utilisateurs.
*Synthèse :* **Un outil éthique qui n'est pas adopté ne produit aucun impact éthique — la valeur perçue par l'utilisateur est le vecteur de la mission.**

---

## Concept 3 — Priorisation OKR-driven

### BLOC 1 — Exercices

---

#### Exercice 3.1 — Traduction mentale

**Question amorce :** *Comment aborderais-tu ce problème avec ta compréhension actuelle ?*

**Contexte :** **Logify**, une plateforme SaaS de gestion logistique pour les TPE/PME (transport, stockage, livraison last-mile), a une backlog de 87 features demandées par les clients. L'équipe produit (PM + 2 designers + 6 développeurs) est en train de planifier le prochain trimestre. Le CEO veut "faire plaisir aux gros clients" en priorité. Les Sales veulent des features pour "closer" de nouveaux deals. Le Customer Success veut des corrections de bugs qui font partir les clients actuels.

**Questions :**
1. Quelle est la différence entre prioriser par OKR et prioriser par demande client ou par intuition du CEO ?
2. Comment construirais-tu les OKR du prochain trimestre pour Logify ?
3. Quelle méthode de priorisation utiliserais-tu pour évaluer les 87 features ? Décris ton approche.
4. Comment gères-tu les conflits entre CEO, Sales et Customer Success de manière structurée ?

---

#### Exercice 3.2 — Piège de paradigme

**Question amorce :** *Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?*

**Scénario :** L'équipe produit de **Fitly**, une app mobile de coaching sportif personnalisé, a défini ses OKR du trimestre :

**Objective :** Devenir l'app de fitness la plus complète du marché
- KR1 : Lancer 15 nouvelles features d'ici fin de trimestre
- KR2 : Atteindre 500 000 téléchargements
- KR3 : Couvrir 20 nouveaux types de sports
- KR4 : Être présent sur 5 nouvelles langues

L'équipe travaille d'arrache-pied, livre 14 features, atteint 480 000 téléchargements. Le CEO célèbre le trimestre. Six semaines après, le taux de rétention à 30 jours est tombé à 18%.

**Questions :**
1. Identifie tous les problèmes dans ces OKR.
2. Quelle est la différence entre des outputs (livrables) et des outcomes (résultats) dans des OKR bien construits ?
3. Reformule ces OKR correctement.
4. Quel est le biais cognitif qui a conduit à ces OKR ?

---

#### Exercice 3.3 — Mini-cas réel

**Question amorce :** *Décris ton modèle mental AVANT de commencer. Détaille comment tu implémenterais la solution et quels KPI tu suivrais.*

**Contexte produit :** **CityMov**, une app de mobilité urbaine multimodale (vélo, trottinette, transport en commun, covoiturage), opère dans 8 villes françaises. L'app a 350 000 utilisateurs actifs mensuels. Le taux de rétention à 90 jours est de 41%, en dessous de la cible de 55%. L'équipe a identifié 3 chantiers possibles :
- A) Refonte de l'onboarding (complexe, 6 écrans, taux de complétion 52%)
- B) Ajout d'une fonctionnalité de planification de trajet multi-jours
- C) Amélioration de la carte temps réel (principale plainte dans les reviews)

**Dimension éthique :** 23% des utilisateurs de CityMov déclarent avoir un handicap moteur ou sensoriel. La carte temps réel actuelle n'est pas accessible (pas de mode contraste élevé, pas de compatibilité lecteur d'écran).

**Ta mission :**
1. Décris ton modèle mental de priorisation.
2. Construis les OKR du prochain trimestre pour CityMov.
3. Priorise les 3 chantiers avec une méthode structurée (RICE, ICE, ou autre).
4. Intègre la dimension accessibilité dans ta priorisation.
5. Quels KPIs suivras-tu et comment les communiques-tu aux stakeholders ?

---

### BLOC 2 — Corrections

---

#### Correction 3.1 — Traduction mentale

**Modèle mental attendu :**
La priorisation n'est pas un problème de liste — c'est un problème de stratégie. Chaque décision de priorisation est un choix implicite de ce qu'on ne fait pas. Les OKR servent à aligner ces choix sur les objectifs qui comptent vraiment.

**Solution détaillée :**

**Priorisation OKR vs demande client / intuition :**
- **Demande client** : répond à qui crie le plus fort — biais de sélection (les clients qui demandent ne sont pas représentatifs de tous les utilisateurs)
- **Intuition CEO** : rapide mais non scalable, non partageable, crée de la dépendance et du ressentiment
- **OKR-driven** : ancre chaque décision sur un impact mesurable souhaité → permet de dire "non" avec une raison claire et partagée

**Construction OKR Logify :**

*Objective 1 : Réduire le churn des PME (< 50 salariés)*
- KR1 : Réduire le taux de churn mensuel de 8% à 5% en 3 mois
- KR2 : Augmenter le NPS Customer Success de -5 à +20
- KR3 : Réduire le temps moyen de résolution des tickets critiques de 48h à 12h

*Objective 2 : Accélérer l'activation des nouveaux clients*
- KR1 : Augmenter le taux de complétion de l'onboarding de 45% à 70%
- KR2 : Réduire le délai entre inscription et première commande gérée de 7j à 3j

**Méthode de priorisation des 87 features :**

1. **Filtrage OKR** : pour chaque feature, demander "A quel OKR contribue-t-elle ?" → éliminer tout ce qui n'est lié à aucun OKR du trimestre (peut revenir le trimestre prochain)
2. **RICE scoring** sur les features restantes :
   - **R**each : combien d'utilisateurs impactés ?
   - **I**mpact : quel effet sur le KR concerné ? (1=minimal, 3=modéré, 9=massif)
   - **C**onfidence : quelle certitude que l'impact sera au rendez-vous ? (%)
   - **E**ffort : en semaines-développeur
   - Score = (R × I × C) / E
3. **Décision finale** : top 5–8 features selon le score RICE, validées en session stakeholders avec les OKR à l'écran

**Gestion des conflits CEO / Sales / CS :**
- Organiser une session "Alignment OKR" trimestrielle avec tous les stakeholders
- Chaque demande est reformulée en hypothèse d'impact : "Si on fait X, on espère que Y (KR) s'améliore de Z%"
- Le débat porte sur les hypothèses, pas sur les opinions
- Le PM garde le droit de veto si une feature va à l'encontre des OKR

**KPIs impactés :**
- UX : NPS, taux de complétion des tâches critiques
- Business : churn, ARR, NRR (Net Revenue Retention)

---

#### Correction 3.2 — Piège de paradigme (Fitly)

**Modèle mental attendu :**
Ces OKR mesurent ce que l'équipe produit (outputs) sans mesurer ce que les utilisateurs font et ressentent (outcomes). L'équipe a travaillé dur pour ne pas créer de valeur.

**Problèmes dans les OKR :**
1. **L'objectif est orienté compétition** ("la plus complète") et non valeur utilisateur
2. **KR1 (15 features)** : mesure un livrable, pas un impact — une feature inutilisée ne crée aucune valeur
3. **KR2 (500k téléchargements)** : mesure l'acquisition, pas l'activation ni la rétention
4. **KR3 (20 sports)** : quantité sans lien avec l'usage réel — combien de ces sports seront utilisés ?
5. **KR4 (5 langues)** : internationalisation sans stratégie de marché claire
6. **Aucun KR ne mesure la rétention** — l'indicateur de santé d'une app de coaching

**Outputs vs Outcomes :**
- **Output** : "livrer 15 features" — ce que l'équipe a fait
- **Outcome** : "augmenter la rétention à 30 jours de 18% à 40%" — le changement de comportement souhaité chez les utilisateurs

**OKR reformulés :**

*Objective : Devenir l'app de coaching qui transforme durablement les habitudes sportives de ses utilisateurs*
- KR1 : Augmenter la rétention à 30 jours de 18% à 40%
- KR2 : Augmenter le NPS de 12 à 45
- KR3 : Augmenter le taux d'utilisateurs complétant leur programme sur 4 semaines de 22% à 50%
- KR4 : Réduire le délai entre téléchargement et première séance complétée de 3j à 1j

**Biais cognitif :**
**Biais de productivité** (ou illusion du busy work) : confondre l'activité intense avec la création de valeur. L'équipe a optimisé pour "livrer" plutôt que pour "impacter". Ce biais est amplifié par des processus de reporting qui célèbrent les outputs visibles (features lancées) plutôt que les outcomes discrets (comportements utilisateurs améliorés).

**KPIs impactés :**
- UX : rétention J30, J90, NPS, taux de complétion des séances
- Business : LTV (une app qui retient = revenu récurrent), churn, conversion freemium

---

#### Correction 3.3 — Mini-cas réel (CityMov)

**Modèle mental attendu :**
La rétention à 41% est symptomatique d'une fracture entre l'acquisition (l'app attire) et la valeur perçue à l'usage (l'app ne délivre pas assez). Les 3 chantiers ne sont pas des options équivalentes — il faut les évaluer sur leur impact sur la rétention ET sur leur urgence éthique.

**OKR du prochain trimestre :**

*Objective : Faire de CityMov une app que les usagers de la mobilité urbaine ne peuvent pas imaginer ne plus avoir*
- KR1 : Augmenter la rétention à 90 jours de 41% à 55%
- KR2 : Augmenter le NPS global de +8 à +35
- KR3 : Atteindre un taux de complétion de l'onboarding de 80% (vs 52%)
- KR4 : Atteindre un score d'accessibilité WCAG AA sur la carte temps réel

**Priorisation RICE des 3 chantiers :**

| Chantier | Reach | Impact | Confidence | Effort (sem.) | Score RICE |
|---|---|---|---|---|---|
| A — Onboarding | 350k (tous nouveaux users) | 3 | 75% | 6 | **131** |
| B — Planification multi-jours | ~80k users avancés | 2 | 55% | 10 | **88** |
| C — Carte temps réel (accessibilité) | 350k + 80k users handicap | 9 | 90% | 8 | **394** |

**Argument d'accessibilité :**
Le chantier C n'est pas seulement le mieux scoré — il est aussi impératif d'un point de vue éthique et légal (RGAA obligatoire pour les services publics et fortement recommandé pour les apps grand public). 23% des utilisateurs en situation de handicap qui ont une expérience dégradée = 23% de churners potentiels ET un risque légal/réputationnel. L'accessibilité n'est pas un "nice to have" — c'est une dette produit urgente.

**Plan d'action :**
1. **Q immédiat** : Chantier C (carte accessible) — impact fort, obligation éthique
2. **En parallèle** : Chantier A (onboarding) — investissement récurrent sur chaque nouveau user
3. **Q suivant** : Chantier B (planification multi-jours) — feature de valeur mais non urgente

**Communication aux stakeholders :**
- Dashboard mensuel : rétention J30/J90, NPS, taux complétion onboarding, score accessibilité
- Story metrics : "Cette semaine, 18 000 nouveaux utilisateurs ont complété l'onboarding" (plus parlant que "52% → 54%")
- OKR review bi-mensuelle : avancement des KRs avec confiance actuelle (vert/orange/rouge)

**KPIs :**

| KPI | Avant | Cible | Délai |
|---|---|---|---|
| Rétention 90j | 41% | 55% | T+3 mois |
| NPS | +8 | +35 | T+3 mois |
| Taux complétion onboarding | 52% | 80% | T+2 mois |
| Score accessibilité WCAG | Non conforme | AA | T+2 mois |
| SUS (utilisateurs handicap) | N/M | > 72 | T+2 mois |

**Erreurs classiques :**
- Traiter l'accessibilité comme une feature optionnelle plutôt que comme une exigence de base
- Prioriser la feature "cool" (planification multi-jours) sur les fondamentaux (onboarding cassé)
- Oublier que le RICE n'est qu'un outil d'aide à la décision — le jugement humain reste nécessaire

---

**Feedback itératif — Concept 3 :**
*Correction :* Un OKR bien construit mesure un changement dans le monde (comportement utilisateur, rétention, satisfaction), jamais un livrable interne.
*Synthèse :* **Prioriser, c'est décider ce qu'on ne fera pas — et l'OKR est le seul outil qui permette de dire "non" sans que ce soit personnel.**

---

## Concept 4 — Éthique & UX Responsable

### BLOC 1 — Exercices

---

#### Exercice 4.1 — Traduction mentale

**Question amorce :** *Comment aborderais-tu ce problème avec ta compréhension actuelle ?*

**Contexte :** **Insura**, une insurtech proposant des assurances santé personnalisées, veut lancer une fonctionnalité de "score de style de vie" basée sur les données de l'app (activité physique, alimentation, sommeil, localisation). Ce score influencerait les primes d'assurance proposées. Le CTO pense que c'est "le futur de l'assurance". Le responsable marketing voit une opportunité d'engagement.

**Questions :**
1. Quels sont les problèmes éthiques de cette fonctionnalité ?
2. Quelle est la différence entre personnalisation et discrimination algorithmique ?
3. Comment évalues-tu l'impact éthique d'une feature avant de la développer ?
4. Quelles alternatives permettraient d'atteindre les objectifs business sans les risques éthiques ?

---

#### Exercice 4.2 — Piège de paradigme

**Question amorce :** *Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?*

**Scénario :** **Parentaly**, une app d'accompagnement parental (suivi de grossesse, développement de l'enfant 0–3 ans), utilise les pratiques suivantes :
- Notifications push à 6h et 22h pour "ne pas rater une étape clé de développement de votre enfant"
- Badges "Parent investi" pour les utilisateurs qui ouvrent l'app tous les jours
- Section "comparaison" : "Votre enfant marche à 14 mois — 73% des enfants marchent avant 13 mois"
- Collecte des données de santé de l'enfant pour "améliorer le produit" (utilisées pour de la publicité ciblée)
- Onboarding avec case pré-cochée : "J'accepte de partager mes données avec nos partenaires"

**Questions :**
1. Identifie chaque dark pattern et problème éthique. ❌
2. Pour chaque problème, évalue l'impact émotionnel sur les utilisateurs (jeunes parents, souvent stressés et en manque de sommeil).
3. Quels KPI business seraient impactés à 6 mois si ces pratiques continuent ?
4. Reformule une version éthique de chacune de ces pratiques.

---

#### Exercice 4.3 — Mini-cas réel

**Question amorce :** *Décris ton modèle mental AVANT de commencer. Détaille comment tu implémenterais la solution et quels KPI tu suivrais.*

**Contexte produit :** **Workly** est une plateforme de gestion RH et de suivi de productivité pour les équipes en télétravail. Elle propose un tableau de bord pour les managers avec : temps de connexion, nombre de messages envoyés, fichiers modifiés, temps en réunion, pauses détectées. La plateforme a été vendue comme "outil de collaboration" mais est utilisée par certains managers comme outil de surveillance des employés.

**Dimension éthique :** Des témoignages d'employés signalent un stress accru, des comportements d'évitement (rester connecté sans travailler pour "paraître productif") et une dégradation du climat de confiance dans les équipes qui utilisent le tracking le plus intensif.

**Ta mission :**
1. Identifie les problèmes éthiques et UX de la situation actuelle.
2. Distingue les usages légitimes du suivi (collaboration) des usages problématiques (surveillance). ❌
3. Propose une redesign éthique du dashboard manager.
4. Comment impliques-tu les employés (utilisateurs affectés mais non acheteurs) dans la conception ?
5. Quels KPIs permettent de mesurer si le produit améliore ou dégrade le bien-être au travail ?

---

### BLOC 2 — Corrections

---

#### Correction 4.1 — Traduction mentale (Insura)

**Modèle mental attendu :**
L'éthique produit n'est pas une question de bonnes intentions — c'est une question de conséquences réelles pour des personnes réelles. Un produit peut causer du tort même si ses créateurs n'avaient aucune mauvaise intention.

**Problèmes éthiques du "score de style de vie" :**
1. **Discrimination indirecte** : les comportements de santé sont corrélés au niveau socio-économique (manger sainement coûte cher, faire du sport nécessite du temps). Un score pénalise de facto les personnes défavorisées.
2. **Surveillance comportementale** : collecter localisation + activité + alimentation = profil de vie complet → risque d'usage secondaire non anticipé
3. **Autonomie violée** : l'assurance devient conditionnelle à des comportements surveillés — coercition déguisée
4. **RGPD** : données de santé = données sensibles de catégorie spéciale → consentement explicite, droit d'opposition, proportionnalité
5. **Effet de classe** : les personnes avec des maladies chroniques, handicaps, ou contraintes de vie (travail de nuit, aidants) seraient pénalisées pour des facteurs hors de leur contrôle

**Personnalisation vs discrimination algorithmique :**
- **Personnalisation** : adapter l'expérience à ce que l'utilisateur veut (préférences, comportements déclarés, contexte)
- **Discrimination algorithmique** : utiliser des données corrélées à des caractéristiques protégées (origine, classe sociale, santé) pour décider différemment → même si l'intention est neutre, l'effet peut être discriminatoire

**Évaluation d'impact éthique (framework) :**
1. Qui sont les utilisateurs les plus vulnérables de ce produit ? Quel est l'impact pour eux ?
2. Qui sont les personnes absentes de la conception mais affectées par la décision ?
3. Quelles données sont collectées ? Ont-elles pu faire l'objet d'un détournement d'usage ?
4. Quel est l'effet de pouvoir ? (qui bénéficie, qui supporte le risque ?)
5. Que se passe-t-il si ce système est utilisé à grande échelle ?

**Alternatives éthiques :**
- Programme de prévention opt-in avec récompenses (réductions) pour les utilisateurs qui choisissent de partager des données de santé
- Score basé uniquement sur des comportements déclarés et non sur une surveillance passive
- Coaching de prévention personnalisé sans impact sur les primes

**KPIs impactés :**
- Business : risque légal (amende RGPD jusqu'à 4% du CA), réputation (NPS, presse), churn utilisateurs
- UX : trust score, NPS, taux d'adoption de la fonctionnalité

---

#### Correction 4.2 — Piège de paradigme (Parentaly)

**Modèle mental attendu :**
Des parents de jeunes enfants sont dans un état de vulnérabilité émotionnelle intense (privation de sommeil, anxiété, hypervigilance). Exploiter cette vulnérabilité pour améliorer les métriques d'engagement est particulièrement grave.

**Dark patterns et problèmes éthiques ❌ :**

1. **Notifications à 6h et 22h**
   - Dark pattern : **Urgency triggers** (manipulation de l'anxiété parentale)
   - Impact émotionnel : réveil brutal à 6h pour un parent en manque de sommeil = stress, resentiment, association négative avec l'app
   - Version éthique : Notifications configurables par l'utilisateur, désactivées par défaut, avec plages horaires choisies

2. **Badge "Parent investi" pour l'usage quotidien**
   - Dark pattern : **Shame-based gamification** (suggère qu'un parent qui n'ouvre pas l'app tous les jours est moins "investi")
   - Impact émotionnel : culpabilité, pression performative
   - Version éthique : supprimer les badges d'usage ; valoriser uniquement des comportements de soin (non liés à l'app)

3. **Comparaison développement enfant**
   - Dark pattern : **Social comparison anxiety** (exploiter l'anxiété du "mon enfant est normal ?")
   - Impact émotionnel : panique, consultation pédiatre inutile, honte
   - Version éthique : "Le développement de chaque enfant est unique. La plupart des enfants marchent entre 9 et 17 mois." Fourchette normale, pas de rang.

4. **Collecte données de santé enfant pour publicité**
   - Problème éthique majeur : données de santé d'un mineur utilisées à des fins commerciales → RGPD catégorie spéciale + protection renforcée mineurs
   - Version éthique : anonymisation totale, consentement explicite séparé, aucune utilisation commerciale des données de santé

5. **Case pré-cochée partage de données**
   - Dark pattern : **Trick question / pre-ticked box** ❌ — illégal sous RGPD (le consentement doit être actif et éclairé)
   - Version éthique : case décochée par défaut, explication claire de l'usage, bouton "Accepter" et "Refuser" de même taille et couleur

**KPIs impactés à 6 mois :**
- Reviews App Store (1-2 étoiles avec mention "culpabilité", "stressant")
- NPS effondrement (parents recommandent aux autres parents — puissant vecteur positif ET négatif)
- Risque CNIL (amende, mise en demeure publique)
- Churn à 6 mois (lié au bout d'un moment à la prise de conscience)

---

#### Correction 4.3 — Mini-cas réel (Workly)

**Modèle mental attendu :**
Workly a deux catégories d'utilisateurs aux intérêts opposés : les managers (acheteurs, bénéficiaires du tracking) et les employés (utilisateurs affectés, non acheteurs, non consultés). Un produit qui bénéficie à l'acheteur en nuisant à l'utilisateur final crée une valeur à court terme mais une destruction de confiance à long terme.

**Problèmes éthiques et UX :**
1. **Surveillance déguisée** : le produit a été vendu comme "collaboration" mais est utilisé comme outil de contrôle → tromperie de l'utilisateur final
2. **Asymétrie de pouvoir** : les employés ne peuvent pas refuser d'être trackés sans risquer leur emploi (consentement non libre)
3. **Métriques proxy trompeuses** : "temps de connexion" ≠ productivité → les managers prennent de mauvaises décisions sur la base de données biaisées
4. **Comportements adaptatifs toxiques** : les employés "jouent le jeu" des métriques (rester connectés sans travailler) → dégradation réelle de la productivité
5. **Biais de discrimination** : les employés avec des contraintes (garde d'enfants, santé) qui se déconnectent aux heures normales apparaissent "moins productifs"

**Usages légitimes vs surveillance ❌ :**

| Légitime | Problématique ❌ |
|---|---|
| Voir quels projets sont en cours dans l'équipe | Surveiller les pauses individuelles |
| Identifier les goulots d'étranglement collectifs | Comparer le temps de connexion entre individus |
| Comprendre la charge de travail globale | Alerter le manager si quelqu'un se déconnecte |
| Faciliter la coordination asynchrone | Utiliser les métriques en entretien annuel |

**Redesign éthique du dashboard manager :**
1. **Données agrégées, jamais individuelles** : la charge de travail de l'équipe (pas de Jean ou Sophie)
2. **Focus outcomes, pas activité** : tâches complétées, jalons atteints (pas "connecté 8h23")
3. **Transparence totale** : chaque employé voit exactement les mêmes données que son manager le concernant
4. **Droit d'opt-out partiel** : certaines métriques (pauses, localisation) opt-in seulement
5. **Alert bien-être** : signaux d'alerte de surcharge (> 50h/semaine, réponses le weekend) visibles aussi par l'employé lui-même

**Impliquer les employés dans la conception :**
- Sessions de co-design avec des représentants employés (syndicats, CSE si applicable)
- Tests utilisateurs avec employés comme participants principaux (pas seulement managers)
- Processus de feedback continu et anonyme sur l'usage des données
- Charte de bon usage co-rédigée avec les représentants du personnel

**KPIs de bien-être au travail :**

| KPI | Type | Mesure |
|---|---|---|
| eNPS (Employee NPS) | Bien-être | Questionnaire mensuel anonyme |
| Taux de burn-out déclaré | Santé | Enquête trimestrielle |
| Turnover de l'équipe | Business | Mensuel |
| Taux d'adoption volontaire des features | UX | Opt-in vs opt-out ratio |
| Satisfaction manager (NPS manager) | UX/Business | Trimestriel |
| Réduction des comportements d'évitement | UX comportemental | Mesure indirecte via enquête |

**Erreurs classiques :**
- Penser que "les entreprises sont les clients donc seuls leurs besoins comptent" → les employés sont les utilisateurs et leur expérience détermine la valeur du produit
- Présenter des données individuelles sans consentement comme un "service de transparence"
- Ignorer les effets systémiques d'un outil adopté à grande échelle

**Améliorations possibles :**
- Label "Humain & Responsable" pour les fonctionnalités certifiées éthiques
- Partenariat avec des organisations de droit du travail pour validation externe
- Publication d'un rapport annuel d'impact éthique

---

**Feedback itératif — Concept 4 (fin de section) :**
*Correction du modèle mental :* L'éthique n'est pas une couche qu'on ajoute à la fin — c'est une contrainte de conception au même titre que la performance ou l'accessibilité.
*Points d'amélioration :* Intégrer un "audit éthique" systématique dans le processus de validation de chaque feature (à côté du design review et du code review).
*Synthèse du changement de paradigme :* **Un produit éthique n'est pas celui qui ne fait pas de mal — c'est celui qui a activement conçu pour protéger les personnes les plus vulnérables qu'il touche.**

---

*Fin de la Section 1 — Stratégie produit & Product Thinking — Exercices*
