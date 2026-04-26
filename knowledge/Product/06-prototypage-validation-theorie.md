# Section 6 — Prototypage, Validation & Optimisation

> Fichier théorie — aucun exercice inclus. Les exercices associés se trouvent dans le fichier `06-prototypage-validation-exercices.md`.

---

## Table des matières

1. [Tests utilisateurs réels ou simulés](#1-tests-utilisateurs-réels-ou-simulés)
2. [Feedback qualitatif post-test](#2-feedback-qualitatif-post-test)
3. [A/B testing & tests prédictifs](#3-ab-testing--tests-prédictifs)
4. [Analytics & heatmaps prédictifs](#4-analytics--heatmaps-prédictifs)
5. [Performance UX](#5-performance-ux)
6. [Cadre méthodologique — tests rapides vs tests long terme](#6-cadre-méthodologique--tests-rapides-vs-tests-long-terme)
7. [Feedback loops courts & itérations multiples](#7-feedback-loops-courts--itérations-multiples)
8. [Tests cognitifs & charge mentale](#8-tests-cognitifs--charge-mentale)
9. [Éthique IA produit](#9-éthique-ia-produit)

---

## 1. Tests utilisateurs réels ou simulés

### Modèle mental
Un test utilisateur est le moment où l'on confronte nos hypothèses de design à la réalité des comportements humains. Ce que les utilisateurs font compte infiniment plus que ce qu'ils disent qu'ils feraient.

### Analogie stable
Concevoir sans tester, c'est construire un pont sans jamais vérifier les charges réelles. Le calcul théorique est nécessaire mais insuffisant : seul le test sous charge réelle révèle les points de rupture. Le "pont de glastonbury" du design, c'est l'interface qu'on pensait parfaite et qui génère 70% d'abandon sur la première étape du tunnel.

### Méthodologie & Bonnes pratiques

**Types de tests utilisateurs**

| Type | Modération | Lieu | Nombre participants | Objectif |
|---|---|---|---|---|
| Test modéré en présentiel | Modérateur présent | Lab ou bureau | 5-8 par segment | Profondeur qualitative, observation comportement |
| Test modéré à distance | Via vidéoconférence | En ligne | 5-8 par segment | Accessibilité géographique |
| Test non modéré | Automatisé | En ligne | 20-100+ | Scalabilité, données quantitatives |
| Test de guérilla | Informel | Café, espace public | 5-10 | Rapidité, faible coût |
| Test IA prédictif | Algorithme | Outils spécialisés | N/A | Estimation avant recrutement réel |

**La règle des 5 utilisateurs (Nielsen)**
- 5 utilisateurs par segment suffisent pour détecter 85% des problèmes d'utilisabilité majeurs dans un test qualitatif modéré.
- Au-delà de 5, les problèmes identifiés sont de plus en plus marginaux — le ROI décroit rapidement.
- Exception : pour des données quantitatives fiables (taux de succès, temps), il faut 20+ participants.

**Identification des friction points**
1. Observer sans intervenir — noter chaque hésitation, erreur, retour en arrière.
2. Enregistrer l'écran, le visage (eye-tracking si budget disponible) et la voix.
3. Utiliser le protocole de verbalisation à voix haute (Think Aloud).
4. Ne jamais aider l'utilisateur en difficulté pendant le test ❌ — l'aide biaise les résultats.

**Tests IA prédictifs**
- Outils : Maze AI, UserTesting AI, EyeQuant, Attention Insight.
- Ces systèmes prédisent les zones d'attention, les parcours probables et les friction points potentiels à partir de modèles comportementaux entraînés sur des millions de tests réels.
- Valeur : explorer des hypothèses en amont du recrutement, réduire les cycles.
- Limite critique : les modèles sont entraînés sur des populations historiques — ils peuvent reproduire des biais et ne pas prédire les comportements de populations sous-représentées.

### Comparaison d'approches

| Approche | Richesse données | Coût | Délai | Risque de biais |
|---|---|---|---|---|
| Test modéré lab | Très élevé | Élevé | Long | Biais du modérateur |
| Test non modéré en ligne | Moyen | Moyen | Court | Biais de recrutement panel |
| Test de guérilla | Faible | Très faible | Très court | Biais de convenance |
| Test IA prédictif | Moyen (statistique) | Faible | Très court | Biais des données d'entraînement |
| Analytics seuls | Comportemental (sans "pourquoi") | Faible | Continu | Biais d'interprétation |

### Correction modèle mental

❌ **Idée reçue** : "On n'a pas le budget pour des tests utilisateurs — on verra au lancement."
✅ **Approche correcte** : Un test de guérilla (5 personnes, 30 min chacune) coûte quelques heures d'organisation. Trouver un problème majeur avant le développement coûte 10 à 100 fois moins cher qu'après le déploiement (règle du coût de l'erreur de Nielsen).
**KPI impacté** : Coût de correction (bug produit vs bug design), taux de succès au lancement, NPS post-lancement.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Task success rate (%) | Coût de correction (pré vs post-dev) |
| Temps moyen de complétion (TTC) | Taux de conversion post-lancement |
| Taux d'erreur par tâche | NPS première semaine |
| SUS post-test | Coût de support (confusion évitée) |

### Points éthiques & inclusivité
- Recruter des participants représentatifs de l'audience réelle — pas seulement des "early adopters" technophiles.
- Obtenir un consentement éclairé, expliquer l'enregistrement, permettre de se retirer à tout moment.
- Anonymiser les données des participants.
- Tester avec des utilisateurs présentant des handicaps (moteur, visuel, cognitif) — pas uniquement en simulation.
- Les panels en ligne (UserTesting, Prolific) surreprésentent les populations anglophones, jeunes et connectées — en être conscient.

---

## 2. Feedback qualitatif post-test

### Modèle mental
Le feedback qualitatif est la matière brute de la compréhension utilisateur. Les verbatims non analysés sont des données ; synthétisés et contextualisés, ils deviennent des insights actionnables qui orientent les décisions produit.

### Analogie stable
Les verbatims d'un test sont comme des centaines de témoignages individuels après un événement. Chaque témoignage est partiel et biaisé. La synthèse — trouver les thèmes récurrents, les tensions, les surprises — est le travail du détective : trouver la vérité dans la masse des perceptions subjectives.

### Méthodologie & Bonnes pratiques

**Recueil du feedback qualitatif**
- **Pendant le test** : verbalisation à voix haute, observation comportementale, notes du modérateur.
- **Après le test** : interview de débrief (5-10 min), questionnaire court (SUS, questions ouvertes).
- **Post-usage** : enquêtes in-app (NPS, CSAT), entretiens de suivi à J+7.

**Analyse des verbatims**
1. **Transcription** : retranscrire les sessions ou utiliser l'IA (Otter.ai, Fireflies, Dovetail AI).
2. **Codage thématique** : identifier les thèmes récurrents (étiquettes : "confusion navigation", "manque de feedback", "chargement lent").
3. **Clustering** : regrouper les verbatims par thème pour identifier la fréquence et la sévérité.
4. **Triangulation** : croiser verbatims qualitatifs + données comportementales (clics, temps) pour valider.
5. **Priorisation** : Impact (nombre d'utilisateurs affectés) × Sévérité (blocage vs friction légère).

**Grille de synthèse recommandée**

| Problème identifié | Fréquence | Sévérité | Verbatim représentatif | Recommandation |
|---|---|---|---|---|
| Bouton "Continuer" non visible | 6/8 participants | Bloquante | "Je pensais que c'était fini, je cherchais quoi faire" | Augmenter visibilité CTA, repositionner |
| Confusion entre "Modifier" et "Annuler" | 3/8 participants | Majeure | "J'avais peur de tout perdre" | Renforcer les labels, ajouter confirmation |

**Synthèse IA et clustering de verbatims**
- Outils : Dovetail AI, Notably, Condens, Atlas (ex Aurelius), EnjoyHQ, Claude/GPT-4.
- L'IA peut traiter des centaines de verbatims en quelques minutes et proposer des clusters thématiques automatiques.
- Workflow : import transcriptions → clustering IA → validation humaine des clusters → formulation d'insights → recommandations.
- Règle d'or : l'IA propose, le chercheur valide. Un cluster IA peut regrouper des verbatims superficiellement similaires mais contextuellement opposés.

### Correction modèle mental

❌ **Idée reçue** : "Les utilisateurs ont dit que c'était bien, donc le design est validé."
✅ **Approche correcte** : Le biais de désirabilité sociale pousse les participants à exprimer de la satisfaction orale tout en montrant des comportements de confusion. Observer ce qu'ils font prime toujours sur ce qu'ils déclarent. Un "c'est très bien" accompagné de 4 retours en arrière sur la même étape révèle un problème.
**KPI impacté** : Task success rate (comportemental vs déclaratif), SUS (score objectif vs impression subjective).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Richesse insight (problèmes identifiés / session) | Coût de correction précoce |
| Temps d'analyse (réduit par IA) | Vélocité de décision produit |
| Score de cohérence insights (triangulation) | Réduction du risque de lancement |
| Taux d'insights actionnés (suivi) | ROI de la recherche utilisateur |

### Points éthiques & inclusivité
- Nommer les problèmes sans nommer les utilisateurs — les insights sont collectifs, pas individuels.
- Traiter avec autant de sérieux les retours des utilisateurs marginaux (seniors, personnes en situation de handicap) que ceux de l'audience principale.
- Éviter le "cherry picking" : sélectionner uniquement les verbatims qui confirment les décisions déjà prises ❌.
- Les outils IA de synthèse peuvent sur-pondérer les verbatims les plus expressifs (biais de longueur/intensité).

---

## 3. A/B testing & tests prédictifs

### Modèle mental
Un A/B test est une expérience scientifique contrôlée : deux variantes sont exposées simultanément à des populations équivalentes pour mesurer laquelle produit le meilleur résultat sur un indicateur précis. C'est l'antidote au "je préfère" et au HiPPO (Highest Paid Person's Opinion).

### Analogie stable
Le A/B test est l'équivalent d'un essai clinique randomisé pour l'interface. On ne change pas le médicament de toute la population en espérant que ça aille mieux — on teste d'abord sur un groupe contrôlé avant de déployer à grande échelle.

### Méthodologie & Bonnes pratiques

**Conditions d'un A/B test valide**
1. **Une seule variable modifiée** entre A et B (sinon impossible d'attribuer la différence).
2. **Hypothèse formalisée avant le test** : "Changer le CTA de 'S'inscrire' à 'Commencer gratuitement' augmentera le taux de clic de 10% car il réduit la perception de risque."
3. **Calcul de la taille d'échantillon** avant de lancer (outil : Evan Miller's A/B test calculator).
4. **Durée minimale** : couvrir au moins un cycle business complet (minimum 1-2 semaines) pour éviter les biais temporels.
5. **Seuil de significativité statistique** : p < 0.05 est le standard (95% de confiance). Ne jamais arrêter le test avant d'avoir atteint la significativité ❌.

**Ce qu'on peut A/B tester**
- Microcopy (labels de boutons, titres, textes d'erreur)
- Positions d'éléments (CTA en haut vs en bas)
- Couleurs de CTA
- Structures de formulaires (nombre de champs, ordre)
- Flows de navigation (tunnel en 3 étapes vs 5 étapes)
- Pricing display (annuel mis en avant vs mensuel)

**Dark patterns à éviter absolument ❌**
- A/B tester sur des pratiques de manipulation psychologique (urgence factice, framing trompeur).
- Tester avec des variations qui pourraient nuire à des utilisateurs vulnérables.
- Continuer un test uniquement quand les résultats "allaient dans le bon sens".

**Tests prédictifs**
- Outils IA : Attention Insight, EyeQuant, Maze Predict.
- Avant de lancer un vrai A/B test, des modèles prédictifs estiment quelle variante sera la plus performante.
- Utile pour éliminer les variantes manifestement faibles avant d'investir dans le recrutement et le développement.
- Limite : prédiction basée sur des patterns statistiques, pas sur la réalité de votre audience spécifique.

**Erreurs classiques en A/B testing**

| Erreur | Conséquence | Correction |
|---|---|---|
| Arrêter le test trop tôt (Peeking) | Faux positif | Calculer la durée avant de lancer |
| Tester plusieurs variables simultanément | Attribution impossible | Test multivarié (MVT) si plusieurs variables |
| Ignorer la segmentation | Résultats moyennés cachent des réalités opposées | Analyser par segment (mobile vs desktop, nouveau vs récurrent) |
| Tester des changements mineurs sans hypothèse | Résultats non interprétables | Toujours formaliser l'hypothèse |
| Appliquer les résultats à une autre audience | Erreur d'extrapolation | Re-tester sur chaque segment clé |

### Correction modèle mental

❌ **Idée reçue** : "Notre A/B test montre +5% de conversion, on déploie immédiatement."
✅ **Approche correcte** : Vérifier d'abord la significativité statistique, la durée (au moins un cycle), l'absence d'effets secondaires sur d'autres métriques (ex : conversion monte mais NPS chute), et la cohérence avec les valeurs produit.
**KPI impacté** : Taux de conversion (direct), NPS (effets secondaires), rétention (modifications à court terme vs long terme).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Task success rate par variante | Taux de conversion |
| Temps de complétion par variante | Revenu par visiteur |
| Taux de rebond par variante | LTV (long terme) |
| SUS par variante (si collecté) | Coût d'acquisition (CAC amélioré) |

### Points éthiques & inclusivité
- Le A/B testing qui manipule les émotions de façon trompeuse est une dark pattern ❌ (ex : affichage de faux stocks limités).
- Tester des pratiques qui pourraient exploiter des biais cognitifs pour pousser à des décisions non souhaitées viole la confiance des utilisateurs.
- Analyser les résultats par segment pour s'assurer que l'optimisation globale ne dégrade pas l'expérience d'un sous-groupe (ex : amélioration sur desktop qui détériore le mobile).
- L'expérimentation sur des populations captives (services essentiels, situations de vulnérabilité) nécessite des précautions éthiques supplémentaires.

---

## 4. Analytics & heatmaps prédictifs

### Modèle mental
Les analytics et heatmaps transforment les comportements collectifs des utilisateurs en données visuelles et quantitatives. Ils répondent au "quoi" et au "où" (qu'est-ce qui se passe dans l'interface ?) mais pas au "pourquoi" — seuls les tests qualitatifs répondent à ce dernier.

### Analogie stable
Les analytics sont comme les caméras de surveillance d'un supermarché. Elles montrent quels rayons sont visités, combien de temps les gens s'y arrêtent, où ils abandonnent leur panier. Mais elles ne disent pas pourquoi un client est parti sans acheter — pour ça, il faut lui parler.

### Méthodologie & Bonnes pratiques

**Types de données analytics**

| Type | Ce qu'il mesure | Outil(s) |
|---|---|---|
| Quantitatif comportemental | Clics, scrolls, temps, parcours | Google Analytics 4, Mixpanel, Amplitude |
| Heatmaps | Zones de clics, scroll depth, regard simulé | Hotjar, Crazy Egg, Microsoft Clarity |
| Session recordings | Replay de sessions individuelles | Hotjar, FullStory, LogRocket |
| Funnel analytics | Taux de progression entre étapes | GA4, Mixpanel, Heap |
| Cohort analysis | Comportement de groupes d'utilisateurs dans le temps | Amplitude, Mixpanel |
| Heatmaps prédictifs IA | Simulation zones d'attention sans trafic réel | EyeQuant, Attention Insight |

**Lecture des heatmaps**
- **Click maps** : révèlent les éléments cliqués (y compris les non-cliquables — "rage clicks" indiquent une frustration).
- **Scroll maps** : montrent jusqu'où les utilisateurs scrollent (fold invisible, contenu important hors zone de visibilité).
- **Move maps** : mouvement de la souris (approximation du regard sur desktop).
- **Attention maps (prédictifs IA)** : simulées à partir de modèles eye-tracking — utiles en amont, avant trafic réel.

**Rage clicks & dead clicks**
- Rage click : utilisateur clique frénétiquement sur un élément non interactif → frustration, attente d'une réaction du système.
- Dead click : clic sans réaction du système → élément perçu comme interactif mais non fonctionnel.
- Ces signaux sont des indicateurs directs de friction.

**Funnels d'analyse**
1. Définir les étapes critiques du parcours (ex : landing → inscription → onboarding → première action clé → rétention J+7).
2. Mesurer le taux de passage entre chaque étape.
3. Identifier le point de plus forte chute = "leaky bucket" prioritaire.
4. Hypothèse sur la cause → test A/B ou test utilisateur pour valider.

**Heatmaps prédictifs IA**
- Générent une simulation de l'attention avant tout déploiement réel.
- Basés sur des modèles entraînés sur des études eye-tracking réelles (Tobii, etc.).
- Workflow : upload du design → analyse IA → heatmap simulée → ajustements → nouveau cycle.
- Fiabilité : 85-90% de corrélation avec les eye-trackings réels selon les études publiées par EyeQuant.

### Correction modèle mental

❌ **Idée reçue** : "On a beaucoup de données analytics, on sait ce qui se passe sur le produit."
✅ **Approche correcte** : Les analytics disent "combien" et "où" mais jamais "pourquoi". Une page avec 80% de taux de rebond peut indiquer un problème ou un succès (utilisateur a trouvé sa réponse immédiatement). Sans contexte qualitatif, les données sont ambiguës.
**KPI impacté** : Taux de complétion (sur- ou sous-estimé sans contexte), taux de conversion (optimisé sans comprendre les causes).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Funnel drop-off rate | Taux de conversion global |
| Scroll depth (contenu important vu ?) | Revenu par session |
| Rage click rate | Coût de support (frustration évitée) |
| Session recording insights | LTV (rétention améliorée) |
| Heatmap coverage (zones actives vs mortes) | Coût d'acquisition (efficacité landing pages) |

### Points éthiques & inclusivité
- Les session recordings enregistrent des données personnelles — obligation de consentement clair (RGPD).
- Les analytics doivent être configurés pour ne pas capturer de données sensibles (champs de mot de passe, numéros de carte ❌).
- Éviter d'utiliser les données comportementales pour manipuler les utilisateurs (ex : pousser à l'achat impulsif via des déclencheurs comportementaux ❌).
- Analyser les données par segment d'accessibilité pour détecter les populations qui abandonnent plus (signal d'exclusion).

---

## 5. Performance UX

### Modèle mental
La performance technique est une composante de l'expérience utilisateur. Un design parfait sur une interface lente est une expérience dégradée. La perception de la vitesse est aussi importante que la vitesse réelle.

### Analogie stable
Un restaurant peut avoir les meilleurs plats du monde, mais si le service prend 45 minutes à chaque étape, l'expérience est mauvaise. La performance UX, c'est s'assurer que l'interface "sert" l'utilisateur à la vitesse attendue — ou gère l'attente avec élégance quand c'est impossible.

### Méthodologie & Bonnes pratiques

**Core Web Vitals (Google)**

| Métrique | Ce qu'elle mesure | Seuil "Good" | Seuil "Poor" |
|---|---|---|---|
| LCP (Largest Contentful Paint) | Temps d'affichage du contenu principal | < 2.5s | > 4s |
| FID / INP (Interaction to Next Paint) | Réactivité aux interactions | < 200ms | > 500ms |
| CLS (Cumulative Layout Shift) | Stabilité visuelle (éléments qui sautent) | < 0.1 | > 0.25 |

**Perception de la vitesse**
- 0-100ms : perception d'instantanéité.
- 100-300ms : acceptable pour les micro-interactions.
- 300ms-1s : l'utilisateur perçoit un délai mais reste patient.
- 1-10s : l'utilisateur commence à se demander si quelque chose a planté.
- Au-delà de 10s : abandon probable sans indicateur de progression.

**Stratégies de gestion de l'attente**
- **Skeleton screens** : afficher la structure de la page avant le contenu — perçu comme plus rapide que le spinner.
- **Progressive loading** : charger les éléments critiques en premier (above the fold), le reste en différé.
- **Optimistic UI** : afficher le résultat anticipé immédiatement avant confirmation serveur (ex : like sur les réseaux sociaux).
- **Progress bars** : pour les opérations longues, indiquer la progression et le temps estimé.

**Performance sur réseaux dégradés**
- Tester systématiquement en mode "Slow 3G" dans les DevTools.
- Les utilisateurs en zones rurales, pays émergents ou lors de déplacements ont une connectivité dégradée — ce n'est pas un cas marginal.

**Fluidité multi-devices**
- La performance perçue varie selon le device : un mobile bas de gamme a 5 à 10 fois moins de puissance CPU qu'un laptop moderne.
- Tester sur des devices représentatifs de l'audience, pas uniquement sur les derniers modèles.

### Correction modèle mental

❌ **Idée reçue** : "La performance, c'est un problème de développeur, pas de designer."
✅ **Approche correcte** : Chaque décision de design impacte la performance : nombre d'images, poids des assets, animations CSS vs JS, nombre de composants chargés. Un designer doit comprendre les implications de ses choix sur la performance perçue.
**KPI impacté** : Core Web Vitals (SEO), taux de rebond (1 seconde de délai = 7% de conversion en moins selon Amazon/Google), taux de complétion.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| LCP, INP, CLS (Core Web Vitals) | Taux de conversion (direct) |
| Latence perçue (vs latence réelle) | SEO ranking (Google) |
| Taux d'abandon (lié à la lenteur) | Revenu par session |
| Satisfaction mobile (bas de gamme) | Taille de marché accessible |
| Error rate (timeout, crash) | Coût infrastructure (optimisation) |

### Points éthiques & inclusivité
- La performance est une question d'équité d'accès : un site lent pénalise les utilisateurs les moins connectés et les moins bien équipés — souvent les populations les plus vulnérables économiquement.
- Optimiser pour les appareils d'entrée de gamme est un geste d'inclusion, pas seulement de performance.
- Les animations et assets lourds peuvent exclure les utilisateurs en forfait data limité.

---

## 6. Cadre méthodologique — tests rapides vs tests long terme

### Modèle mental
Il n'existe pas une seule méthode de test universelle. Chaque phase du produit (idéation, développement, post-lancement, optimisation) appelle un type de test différent, calibré sur le niveau de fidélité du prototype et la question à laquelle on cherche à répondre.

### Analogie stable
Un médecin utilise différents examens selon la question clinique : la prise de sang est rapide et donne des indicateurs généraux, l'IRM est longue et précise mais coûteuse, le test d'effort mesure le comportement en conditions réelles. Aucun examen ne remplace les autres — ils sont complémentaires.

### Méthodologie & Bonnes pratiques

**Matrice méthode × phase produit**

| Phase produit | Question clé | Méthode recommandée | Délai | Coût |
|---|---|---|---|---|
| Idéation | "Est-ce que le concept résonne ?" | Test concept (5 sec test, réaction moodboard) | 1-3 jours | Très faible |
| Wireframe | "Est-ce que la structure est compréhensible ?" | Test de navigation (prototype papier ou basse fidélité) | 3-5 jours | Faible |
| Prototype haute fidélité | "Est-ce que le flow fonctionne ?" | Test modéré avec prototype interactif | 1-2 semaines | Moyen |
| Post-lancement | "Qu'est-ce qui bloque les utilisateurs ?" | Analytics + session recordings + test non modéré | Continu | Faible-moyen |
| Optimisation | "Quelle variante performe mieux ?" | A/B testing | 2-4 semaines | Moyen |
| Évaluation produit mature | "L'expérience est-elle satisfaisante ?" | SUS, NPS, CSAT continus + entretiens qualitatifs | Trimestriel | Moyen |

**Tests rapides (< 1 semaine)**
- Objectif : invalider les mauvaises hypothèses tôt, avec le minimum d'investissement.
- Test des 5 secondes : montrer un écran 5s, demander ce que l'utilisateur a retenu → mesure la clarté du message.
- First click test : demander où l'utilisateur cliquerait en premier pour accomplir une tâche → mesure l'intuitivité de la navigation.
- Tests de guérilla : 5 personnes, café, 20-30 min, prototype sur téléphone.

**Tests long terme**
- Longitudinal : suivre les mêmes utilisateurs sur plusieurs semaines ou mois → mesure l'apprentissage, la fidélisation, l'évolution de l'usage.
- Diary study : les participants notent leurs interactions avec le produit au quotidien → révèle les usages en contexte réel, hors lab.
- NPS et CSAT trackers : mesures récurrentes de la satisfaction globale.

**Prototype fidelity vs type de test**

| Fidélité prototype | Ce qu'on peut tester | Ce qu'on ne peut PAS tester |
|---|---|---|
| Papier / sketch | Structure, navigation, logique de flux | Visuels, micro-interactions, performance |
| Wireframe digital (Figma) | Navigation, hiérarchie, clarté | Réactions émotionnelles, visuels finaux |
| Maquette haute fidélité | Ressenti visuel, CTA, lisibilité | Performance réelle, comportement dans le temps |
| Produit live | Tout comportement en conditions réelles | Idéations alternatives (trop coûteux) |

### Correction modèle mental

❌ **Idée reçue** : "On attend d'avoir un prototype parfait pour tester."
✅ **Approche correcte** : Plus on attend, plus la correction est coûteuse. Les tests sur prototype papier ou basse fidélité coûtent 10 à 50 fois moins cher que les corrections post-développement. Le test imparfait sur prototype imparfait vaut toujours mieux que l'absence de test.
**KPI impacté** : Coût de correction, vélocité de l'équipe, taux de succès au lancement.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Nombre de problèmes détectés par phase | Coût de correction par phase |
| Taux de problèmes résolus avant développement | Time to market (itérations évitées en dev) |
| Couverture méthodologique | ROI de la recherche |
| Task success rate par phase | Risque de lancement réduit |

### Points éthiques & inclusivité
- Diversifier les méthodes pour ne pas systématiquement exclure les mêmes populations (les tests en ligne excluent les non-connectés, les tests en lab excluent les personnes à mobilité réduite).
- Documenter les limitations méthodologiques de chaque test — les décisions produit doivent tenir compte de ces limitations.

---

## 7. Feedback loops courts & itérations multiples

### Modèle mental
Le feedback loop est le cycle qui transforme une observation (ce qui ne fonctionne pas) en modification (test d'une solution) puis en validation (mesure de l'impact). Plus ce cycle est court, plus l'équipe apprend vite et corrige rapidement.

### Analogie stable
Un thermostat domestique illustre le feedback loop parfait : il mesure la température (observation), compare à la consigne (objectif), active le chauffage si nécessaire (action), puis re-mesure (validation). Un produit sans feedback loop, c'est un thermostat sans thermomètre.

### Méthodologie & Bonnes pratiques

**Le double diamond au niveau micro**

```
Observation (données / tests)
    ↓
Hypothèse (cause probable)
    ↓
Modification (prototype / changement)
    ↓
Test (mesure d'impact)
    ↓
Apprentissage → nouvel Observation
```

**Mise en place d'un feedback loop continu**
1. Définir les KPIs de suivi dès le lancement d'une feature.
2. Installer les outils de mesure avant le déploiement (analytics events, heatmaps, enquêtes in-app).
3. Planifier un premier point de revue à J+7 et J+30.
4. Établir un seuil de déclenchement : "Si le taux de complétion < X%, on lance un test utilisateur d'urgence."

**Rythme d'itération**
- Itérations hebdomadaires (sprints Agile) pour les changements tactiques (microcopy, positionnement CTA).
- Itérations mensuelles pour les changements structurels (navigation, architecture information).
- Revues trimestrielles pour les évolutions stratégiques (redesign, nouveau flow).

**Suivi KPI UX et business**

| Niveau | Fréquence | KPIs suivis | Décision |
|---|---|---|---|
| Opérationnel | Hebdomadaire | Taux d'erreur, rage clicks, abandon funnel | Correctif immédiat |
| Tactique | Mensuel | Task success, conversion, NPS | A/B test, redesign partiel |
| Stratégique | Trimestriel | SUS, LTV, rétention, NPS long terme | Roadmap, priorités |

### Correction modèle mental

❌ **Idée reçue** : "On fait un grand redesign tous les 2 ans pour tout améliorer d'un coup."
✅ **Approche correcte** : Les grandes refontes sont risquées et coûteuses (désorientation des utilisateurs existants, régression possible). Les itérations continues, guidées par les données, permettent d'améliorer en permanence sans rupture brutale.
**KPI impacté** : NPS (stabilité vs disruption), taux de rétention (perturbation minimisée), coût de développement.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Taux d'amélioration sur KPIs cibles | Vélocité de l'équipe |
| Vitesse de détection des régressions | Coût de correction (précoce vs tardif) |
| SUS dans le temps (courbe) | LTV (amélioration continue) |
| NPS trend (hausse sur 6 mois) | Rétention et engagement |

### Points éthiques & inclusivité
- Les itérations rapides ne doivent pas négliger les utilisateurs qui s'adaptent plus lentement aux changements (seniors, utilisateurs moins technophiles).
- Communiquer les changements aux utilisateurs quand ils sont significatifs — les modifications silencieuses créent de la défiance.
- Inclure dans les KPIs des indicateurs d'accessibilité pour s'assurer que les itérations ne régressent pas sur ce point.

---

## 8. Tests cognitifs & charge mentale

### Modèle mental
La charge mentale est la quantité d'efforts cognitifs qu'un utilisateur doit déployer pour accomplir une tâche. Une interface optimale minimise cette charge en s'appuyant sur les schémas mentaux existants de l'utilisateur, en structurant l'information clairement et en ne demandant jamais plus d'efforts que nécessaire.

### Analogie stable
La charge mentale est comme le RAM d'un ordinateur. Chaque décision à prendre, chaque information à mémoriser, chaque ambiguïté à résoudre occupe de la mémoire de travail. Quand le RAM est saturé, le système plante — ou l'utilisateur abandonne.

### Méthodologie & Bonnes pratiques

**La théorie de la charge cognitive (Sweller)**
- **Charge intrinsèque** : difficulté inhérente à la tâche elle-même (remplir une déclaration fiscale).
- **Charge extrinsèque** : difficulté ajoutée par la mauvaise conception de l'interface (formulaire désorganisé, instructions ambiguës).
- **Charge germane** : effort d'apprentissage qui construit des schémas mentaux durables (onboarding bien conçu).

Objectif du design : réduire la charge extrinsèque au minimum. La charge intrinsèque est incompressible.

**Indicateurs de surcharge cognitive dans une interface**
- Utilisateur lit et relit les instructions sans progresser.
- Regard qui revient sans cesse au même point (eye-tracking).
- Temps de complétion anormalement long.
- Erreurs de saisie fréquentes sur des champs simples.
- Questions de type "Mais qu'est-ce que je suis censé faire ?" pendant un test.
- Abandon en milieu de formulaire ou de flow.

**Méthodes de mesure de la charge mentale**

| Méthode | Type | Ce qu'elle mesure | Difficulté de mise en oeuvre |
|---|---|---|---|
| NASA-TLX (Task Load Index) | Questionnaire déclaratif | 6 dimensions subjectives (effort, frustration, performance...) | Faible (questionnaire court) |
| Temps de complétion | Comportemental | Effort relatif (plus long = plus difficile) | Faible |
| Taux d'erreur | Comportemental | Confusion, surcharge informationnelle | Faible |
| Eye-tracking (fixations) | Physiologique | Charge attentionnelle (zones de fixation longue) | Élevée (matériel) |
| EEG (électroencéphalographie) | Physiologique | Charge cognitive réelle | Très élevée (laboratoire) |
| Protocole dual-task | Comportemental | Diminution de performance sur tâche secondaire | Moyenne |

**Stratégies de réduction de la charge mentale**

1. **Progressive disclosure** : ne montrer que ce qui est nécessaire à l'étape courante.
2. **Chunking** : regrouper les informations liées (loi de Miller : 7±2 éléments en mémoire de travail).
3. **Defaults intelligents** : pré-remplir les champs avec des valeurs probables réduit les décisions.
4. **Affordances claires** : les éléments interactifs doivent visuellement signifier leur interactivité.
5. **Feedback immédiat** : confirmer chaque action pour libérer la mémoire de travail ("est-ce que ça a marché ?").
6. **Reconnaissance vs rappel** : montrer les options plutôt que forcer l'utilisateur à s'en souvenir.

**IA pour prédiction de surcharge cognitive**
- Outils : EyeQuant (attention prédictive), Attention Insight, Maze Predict.
- L'IA peut analyser la complexité visuelle d'un écran (nombre d'éléments, contrastes, densité informationnelle) et prédire les zones de surcharge cognitive probable.
- Des modèles de NLP peuvent analyser la complexité du microcopy (Flesch-Kincaid score) pour identifier les formulations trop complexes.
- Workflow : scan automatisé de l'interface → score de complexité → recommandations de simplification → validation humaine → test utilisateur ciblé.

### Correction modèle mental

❌ **Idée reçue** : "Si l'utilisateur est intelligent, il comprendra notre interface complexe."
✅ **Approche correcte** : La charge mentale est universelle. Même les utilisateurs experts sont soumis aux limites de la mémoire de travail. Une interface complexe épuise même les experts et exclut les novices. La simplicité est une compétence de design, pas un manque d'ambition.
**KPI impacté** : Taux d'abandon, task success rate, SUS, temps de complétion, taux d'erreur.

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Score NASA-TLX (effort, frustration) | Taux d'abandon formulaires |
| Temps de complétion de tâche | Taux de conversion |
| Taux d'erreur de saisie | Coût de support (confusion) |
| SUS — facilité d'apprentissage | Taux de rétention (plaisir d'usage) |
| First-time task success | Coût d'onboarding (formation) |

### Points éthiques & inclusivité
- Les personnes avec des troubles cognitifs (dyslexie, TDAH, troubles de la mémoire) sont particulièrement affectées par les interfaces à haute charge cognitive — les concevoir pour elles profite à tous.
- Les interfaces complexes peuvent exclure des populations entières : seniors, personnes peu alphabétisées numériquement, non-natifs linguistiques.
- Une interface délibérément complexe pour décourager la désinscription est un dark pattern ❌ (roach motel).

---

## 9. Éthique IA produit

### Modèle mental
Intégrer l'IA dans un produit sans cadre éthique, c'est déléguer des décisions qui affectent des utilisateurs réels à des algorithmes optimisés pour des métriques, pas pour le bien-être humain. L'éthique IA est le garde-fou qui s'assure que l'optimisation sert l'utilisateur, pas uniquement la métrique business.

### Analogie stable
Confier la conduite d'une voiture à un pilote automatique sans supervision humaine, c'est faire confiance à un système optimisé pour maintenir la trajectoire — mais qui ne sait pas détecter un enfant qui traverse. L'humain dans la boucle n'est pas un signe de méfiance envers la technologie, c'est la garantie que quelqu'un évalue les situations que l'algorithme ne comprend pas.

### Méthodologie & Bonnes pratiques

**Les 4 dimensions de l'éthique IA en produit**

**1. Transparence**
- L'utilisateur doit savoir quand il interagit avec un système IA.
- Les recommandations IA doivent être expliquées ("On vous suggère ceci parce que...").
- Les limitations du système doivent être communiquées honnêtement.
- Dark pattern ❌ : faire passer une décision algorithmique pour une recommandation "humaine" ou "personnalisée" sans expliquer les critères.

**2. Contrôle humain (Human in the Loop)**
- Les décisions à fort impact (santé, finance, emploi, crédit) ne doivent pas être entièrement déléguées à l'IA sans supervision humaine.
- L'utilisateur doit pouvoir contester, modifier ou ignorer une recommandation IA.
- Les équipes produit doivent maintenir un mécanisme d'override humain pour les cas limites.

**3. Équité & non-discrimination**
- Les modèles IA reproduisent et amplifient les biais présents dans leurs données d'entraînement.
- Auditer régulièrement les sorties du modèle par sous-groupe (genre, âge, origine) pour détecter des biais systémiques.
- Exemple : un moteur de recommandation de contenu qui surexpose certains groupes à des publicités de crédit prédateur.

**4. Confidentialité & consentement**
- Les données utilisées pour entraîner ou personnaliser les modèles IA doivent avoir été collectées avec consentement éclairé.
- L'utilisateur doit pouvoir demander la suppression de ses données et l'explication des décisions le concernant (droit à l'explication — RGPD Article 22).

**Vérification transparence IA — checklist produit**

| Critère | Vérification | Signal d'alerte |
|---|---|---|
| Disclosure | L'utilisateur sait-il qu'il interagit avec de l'IA ? | "Notre assistant vous recommande..." sans mention IA |
| Explicabilité | Les recommandations sont-elles expliquées ? | Score de crédit IA sans critères visibles |
| Contrôle | L'utilisateur peut-il modifier/ignorer la recommandation ? | Décision IA non contestable |
| Audit | Les biais sont-ils monitorés régulièrement ? | Aucun processus d'audit défini |
| Consentement données | Les données d'entraînement sont-elles consenties ? | Collecte passive sans information |
| Recours | Existe-t-il un contact humain pour les cas limites ? | Support uniquement chatbot IA |

**Dark patterns IA à signaler ❌**
- **Manipulation comportementale** : utiliser l'IA pour identifier les moments de vulnérabilité émotionnelle et pousser à l'achat.
- **Filter bubbles** : algorithmes de recommandation qui enferment l'utilisateur dans ses biais existants sans diversité.
- **Urgence artificielle** : IA qui génère de faux signaux de rareté ou d'urgence pour accélérer une décision d'achat.
- **Deepfake marketing** : utiliser des visuels générés par IA pour faire croire à des avis ou résultats réels.
- **Shadow profiling** : inférer des informations sensibles non communiquées (orientation sexuelle, état de santé) à partir de comportements.

**Réglementation en vigueur (2025)**

| Réglementation | Scope | Impact produit |
|---|---|---|
| EU AI Act (2024) | Union Européenne | Classification des systèmes IA par risque, obligations de transparence |
| RGPD Article 22 | Union Européenne | Droit à l'explication pour les décisions automatisées |
| AI Bill of Rights (US) | États-Unis (recommandation) | Principes non contraignants mais influents |
| Digital Services Act (DSA) | Union Européenne | Transparence des algorithmes de recommandation |

### Correction modèle mental

❌ **Idée reçue** : "L'IA est objective — si l'algorithme recommande ça, c'est la meilleure solution."
✅ **Approche correcte** : L'IA optimise pour la métrique qu'on lui a donnée, sur les données qu'on lui a fournies. Si la métrique est biaisée (taux de clic = engagement mais aussi manipulation) ou les données biaisées (sous-représentation de certains groupes), l'IA produira des recommandations biaisées avec une apparence d'objectivité.
**KPI impacté** : NPS à long terme (confiance érodée), rétention (manipulation découverte), risque légal (EU AI Act).

### KPIs liés

| KPI UX | KPI Business |
|---|---|
| Trust score (NPS long terme) | Risque légal et réglementaire |
| Taux de contestation recommandations IA | Réputation brand |
| Diversité des profils servis équitablement | LTV (confiance = rétention) |
| Score de transparence (audit) | Coût de mise en conformité |
| Biais détectés par audit | Coût de litige évité |

### Points éthiques & inclusivité
- L'éthique IA n'est pas une option légale ou un exercice de communication — c'est une responsabilité envers les utilisateurs qui font confiance au produit.
- Les populations les plus vulnérables (personnes endettées, en crise de santé mentale, mineurs) sont les plus exposées aux effets négatifs des systèmes IA mal cadrés.
- Une équipe produit diversifiée réduit les angles morts éthiques — les biais sont souvent invisibles pour ceux qui les partagent.
- Les signaux de manipulation IA (dark patterns algorithmiques) doivent être traités avec la même sévérité que les dark patterns visuels classiques.

---

## Synthèse des KPIs de la Section 6

| Concept | KPI UX principal | KPI Business principal |
|---|---|---|
| Tests utilisateurs | Task success rate | Coût de correction précoce |
| Feedback qualitatif | Richesse des insights | Vélocité de décision produit |
| A/B testing | Task success par variante | Taux de conversion |
| Analytics & heatmaps | Funnel drop-off rate | Revenu par session |
| Performance UX | Core Web Vitals (LCP, INP, CLS) | Taux de conversion |
| Cadre méthodologique | Couverture tests par phase | ROI de la recherche |
| Feedback loops | SUS dans le temps | LTV (amélioration continue) |
| Tests cognitifs | Score NASA-TLX | Taux d'abandon / conversion |
| Éthique IA | Trust score (NPS long terme) | Risque légal / réputation |

---

## Synthèse transversale — Processus de validation en boucle

```
[Hypothèse design]
        ↓
[Test rapide (guérilla / 5s test)]
        ↓
[Prototype basse fidélité]
        ↓
[Test modéré (5 utilisateurs)]
        ↓
[Prototype haute fidélité]
        ↓
[Test non modéré (20+ utilisateurs)]
        ↓
[Lancement]
        ↓
[Analytics + heatmaps + session recordings]
        ↓
[A/B test sur hypothèses d'optimisation]
        ↓
[Synthèse qualitatif + quantitatif]
        ↓
[Nouvelle hypothèse design] → Boucle
```

Chaque itération réduit le risque d'erreur coûteuse et augmente la confiance dans les décisions produit.

---

> Précédent fichier : `05-design-visuel-theorie.md` — Design visuel, design system et psychologie visuelle.
